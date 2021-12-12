import {
    PapiClient,
    InstalledAddon,
    Catalog,
    FindOptions,
    GeneralActivity,
    Transaction,
    User,
    AuditLog,
    Type,
} from '@pepperi-addons/papi-sdk';
import { Client } from '@pepperi-addons/debug-server';
import jwt_decode from 'jwt-decode';
import fetch from 'node-fetch';
import { performance } from 'perf_hooks';
import { ADALService } from './adal.service';
import fs from 'fs';
import { execFileSync } from 'child_process';

declare type ClientData =
    | 'UserEmail'
    | 'UserName'
    | 'UserID'
    | 'UserUUID'
    | 'DistributorID'
    | 'DistributorUUID'
    | 'Server'
    | 'IdpURL';

const UserDataObject = {
    UserEmail: 'email',
    UserName: 'name',
    UserID: 'pepperi.id',
    UserUUID: 'pepperi.useruuid',
    DistributorID: 'pepperi.distributorid',
    DistributorUUID: 'pepperi.distributoruuid',
    Server: 'pepperi.datacenter',
    IdpURL: 'iss',
};
type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';

export declare type ResourceTypes =
    | 'activities'
    | 'transactions'
    | 'transaction_lines'
    | 'catalogs'
    | 'accounts'
    | 'items'
    | 'contacts'
    | 'fields'
    | 'file_storage'
    | 'all_activities'
    | 'user_defined_tables'
    | 'users'
    | 'data_views'
    | 'installed_addons'
    | 'schemes';

export interface FilterAttributes {
    AddonUUID: string[]; //Tests only support one AddonUUID but FilterAttributes interface keep the format of ADAL
    Resource: string[]; //Tests only support one Resource but FilterAttributes interface keep the format of ADAL
    Action: string[]; //Tests only support one Action but FilterAttributes interface keep the format of ADAL
    ModifiedFields: string[];
    UserUUID?: string[]; //Tests only support one UserUUID but FilterAttributes interface keep the format of ADAL
}

export default class GeneralService {
    papiClient: PapiClient;
    adalService: ADALService;
    assetsBaseUrl: string;

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID.length > 10 ? client.AddonUUID : 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
            addonSecretKey: client.AddonSecretKey,
        });
        this.adalService = new ADALService(this.papiClient);
        this.assetsBaseUrl = client.AssetsBaseUrl;
    }

    sleep(ms) {
        console.debug(`%cSleep: ${ms} milliseconds`, 'color: #f7df1e');
        const start = new Date().getTime(),
            expire = start + ms;
        while (new Date().getTime() < expire) {}
        return;
    }

    async initiateTester(email, pass): Promise<Client> {
        const urlencoded = new URLSearchParams();
        urlencoded.append('username', email);
        urlencoded.append('password', pass);
        urlencoded.append('scope', 'pepperi.apint pepperi.wacd offline_access');
        urlencoded.append('grant_type', 'password');
        urlencoded.append('client_id', 'ios.com.wrnty.peppery');

        let server;
        if (process.env.npm_config_server) {
            server = process.env.npm_config_server;
        } else {
            server = this.papiClient['options'].baseURL.includes('staging') ? 'stage' : '';
        }

        const getToken = await fetch(`https://idp${server == 'stage' ? '.sandbox' : ''}.pepperi.com/connect/token`, {
            method: 'POST',
            body: urlencoded,
        })
            .then((res) => res.text())
            .then((res) => (res ? JSON.parse(res) : ''));

        return this.createClient(getToken.access_token);
    }

    createClient(authorization) {
        if (!authorization) {
            throw new Error('unauthorized');
        }
        const token = authorization.replace('Bearer ', '') || '';
        const parsedToken = jwt_decode(token);
        const [sk, AddonUUID] = this.getSecret();
        return {
            AddonUUID: AddonUUID,
            AddonSecretKey: sk,
            BaseURL: parsedToken['pepperi.baseurl'],
            OAuthAccessToken: token,
            AssetsBaseUrl: this.assetsBaseUrl ? this.assetsBaseUrl : 'http://localhost:4400/publish/assets',
            Retry: function () {
                return;
            },
        };
    }

    getSecret() {
        const addonUUID = JSON.parse(fs.readFileSync('../addon.config.json', { encoding: 'utf8', flag: 'r' }))[
            'AddonUUID'
        ];
        let sk;
        try {
            sk = fs.readFileSync('../var_sk', { encoding: 'utf8', flag: 'r' });
        } catch (error) {
            console.log(`SK Not found: ${error}`);
            sk = '00000000-0000-0000-0000-000000000000';
        }
        return [addonUUID, sk];
    }

    CalculateUsedMemory() {
        const used = process.memoryUsage();
        const memoryUsed = {};
        for (const key in used) {
            memoryUsed[key] = Math.round((used[key] / 1024 / 1024) * 100) / 100;
        }
        console.log(`memoryUse in MB = ${JSON.stringify(memoryUsed)}`);
    }

    PrintMemoryUseToLog(state, testName) {
        console.log(`${state} Test: ${testName}`);
        this.CalculateUsedMemory();
    }

    //#region getDate
    getTime() {
        const getDate = new Date();
        return (
            getDate.getHours().toString().padStart(2, '0') +
            ':' +
            getDate.getMinutes().toString().padStart(2, '0') +
            ':' +
            getDate.getSeconds().toString().padStart(2, '0')
        );
    }

    getDate() {
        const getDate = new Date();
        return (
            getDate.getDate().toString().padStart(2, '0') +
            '/' +
            (getDate.getMonth() + 1).toString().padStart(2, '0') +
            '/' +
            getDate.getFullYear().toString().padStart(4, '0')
        );
    }
    //#endregion getDate

    getServer() {
        return this.client.BaseURL.includes('staging')
            ? 'Sandbox'
            : this.client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
    }

    getClientData(data: ClientData): string {
        return jwt_decode(this.client.OAuthAccessToken)[UserDataObject[data]];
    }

    getAddons(options?: FindOptions): Promise<InstalledAddon[]> {
        return this.papiClient.addons.installedAddons.find(options);
    }

    getAddonsByUUID(UUID: string): Promise<InstalledAddon> {
        return this.papiClient.addons.installedAddons.addonUUID(UUID).get();
    }

    getCatalogs(options?: FindOptions): Promise<Catalog[]> {
        return this.papiClient.catalogs.find(options);
    }

    getUsers(options?: FindOptions): Promise<User[]> {
        return this.papiClient.users.find(options);
    }

    getAllActivities(options?: FindOptions): Promise<GeneralActivity[] | Transaction[]> {
        return this.papiClient.allActivities.find(options);
    }

    getTypes(resource_name: ResourceTypes) {
        return this.papiClient.metaData.type(resource_name).types.get();
    }

    getAllTypes(options?: FindOptions): Promise<Type[]> {
        return this.papiClient.types.find(options);
    }

    async getAuditLogResultObjectIfValid(uri: string, loopsAmount = 30): Promise<AuditLog> {
        let auditLogResponse;
        do {
            auditLogResponse = await this.papiClient.get(uri);
            auditLogResponse =
                auditLogResponse === null
                    ? auditLogResponse
                    : auditLogResponse[0] === undefined
                    ? auditLogResponse
                    : auditLogResponse[0];
            //This case is used when AuditLog was not created at all (This can happen and it is valid)
            if (auditLogResponse === null) {
                this.sleep(4000);
                console.log('Audit Log was not found, waiting...');
                loopsAmount--;
            }
            //This case will only retray the get call again as many times as the "loopsAmount"
            else if (auditLogResponse.Status.ID == '2') {
                this.sleep(2000);
                console.log('IN_Prog: Status ID is 2, Retray ' + loopsAmount + ' Times.');
                loopsAmount--;
            }
        } while ((auditLogResponse === null || auditLogResponse.Status.ID == '2') && loopsAmount > 0);

        //Check UUID
        try {
            if (
                auditLogResponse.DistributorUUID == auditLogResponse.UUID ||
                auditLogResponse.DistributorUUID == auditLogResponse.Event.User.UUID ||
                auditLogResponse.UUID == auditLogResponse.Event.User.UUID ||
                auditLogResponse.Event.User.UUID != this.getClientData('UserUUID')
            ) {
                throw new Error('Error in UUID in Audit Log API Response');
            }
        } catch (error) {
            if (error instanceof Error) {
                error.stack = 'UUID in Audit Log API Response:\n' + error.stack;
            }
            throw error;
        }

        //Check Date and Time
        try {
            if (
                !auditLogResponse.CreationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z') ||
                !auditLogResponse.ModificationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z')
            ) {
                throw new Error('Error in Date and Time in Audit Log API Response');
            }
        } catch (error) {
            if (error instanceof Error) {
                error.stack = 'Date and Time in Audit Log API Response:\n' + error.stack;
            }
            throw error;
        }
        //Check Type and Event
        try {
            if (
                (auditLogResponse.AuditType != 'action' && auditLogResponse.AuditType != 'data') ||
                (auditLogResponse.Event.Type != 'code_job_execution' &&
                    auditLogResponse.Event.Type != 'addon_job_execution' &&
                    auditLogResponse.Event.Type != 'scheduler' &&
                    auditLogResponse.Event.Type != 'sync' &&
                    auditLogResponse.Event.Type != 'deployment') ||
                auditLogResponse.Event.User.Email != this.getClientData('UserEmail')
            ) {
                throw new Error('Error in Type and Event in Audit Log API Response');
            }
        } catch (error) {
            if (error instanceof Error) {
                error.stack = 'Type and Event in Audit Log API Response:\n' + error.stack;
            }
            throw error;
        }
        return auditLogResponse;
    }

    async areAddonsInstalled(testData: { [any: string]: string[] }): Promise<boolean[]> {
        const isInstalledArr: boolean[] = [];
        const installedAddonsArr = await this.getAddons({ page_size: -1 });
        let installResponse;
        for (const addonUUID in testData) {
            let isInstalled = false;
            for (let i = 0; i < installedAddonsArr.length; i++) {
                if (installedAddonsArr[i].Addon !== null) {
                    if (installedAddonsArr[i].Addon.Name == addonUUID) {
                        isInstalled = true;
                        break;
                    }
                }
            }
            if (!isInstalled) {
                if (testData[addonUUID][0] == 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe') {
                    installResponse = await this.papiClient.addons.installedAddons
                        .addonUUID(`${testData[addonUUID][0]}`)
                        .install('0.0.235');
                } else {
                    installResponse = await this.papiClient.addons.installedAddons
                        .addonUUID(`${testData[addonUUID][0]}`)
                        .install();
                }
                const auditLogResponse = await this.getAuditLogResultObjectIfValid(installResponse.URI, 40);
                if (auditLogResponse.Status && auditLogResponse.Status.ID != 1) {
                    isInstalledArr.push(false);
                }
            }
            isInstalledArr.push(true);
        }
        return isInstalledArr;
    }

    async chnageVersion(
        varKey: string,
        testData: { [any: string]: string[] },
        isPhased: boolean,
    ): Promise<{ [any: string]: string[] }> {
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            let changeType = 'Upgrade';
            let searchString = `AND Version Like '${version}%' AND Available Like 1 AND Phased Like 1`;
            if (
                addonName == 'Services Framework' ||
                addonName == 'Cross Platforms API' ||
                addonName == 'API Testing Framework' ||
                addonName == 'WebApp API Framework' ||
                !isPhased
            ) {
                searchString = `AND Version Like '${version}%' AND Available Like 1`;
            }
            const fetchVarResponse = await this.fetchStatus(
                `${this.client.BaseURL.replace(
                    'papi-eu',
                    'papi',
                )}/var/addons/versions?where=AddonUUID='${addonUUID}'${searchString}&order_by=CreationDateTime DESC`,
                {
                    method: `GET`,
                    headers: {
                        Authorization: `${varKey}`,
                    },
                },
            );
            let varLatestVersion;
            if (fetchVarResponse.Status == 200) {
                try {
                    varLatestVersion = fetchVarResponse.Body[0].Version;
                } catch (error) {
                    throw new Error(
                        `Get latest addon version failed: ${version}, Status: ${
                            varLatestVersion.Status
                        }, Error Message: ${JSON.stringify(fetchVarResponse.Error)}`,
                    );
                }
            } else if (fetchVarResponse.Status == 401) {
                throw new Error(
                    `Fetch Error - Verify The varKey, Status: ${fetchVarResponse.Status}, Error Message: ${fetchVarResponse.Error.Header.title}`,
                );
            } else {
                throw new Error(
                    `Get latest addon version failed: ${version}, Status: ${
                        fetchVarResponse.Status
                    }, Error Message: ${JSON.stringify(fetchVarResponse.Error)}`,
                );
            }
            testData[addonName].push(varLatestVersion);

            let upgradeResponse = await this.papiClient.addons.installedAddons
                .addonUUID(`${addonUUID}`)
                .upgrade(varLatestVersion);
            let auditLogResponse = await this.getAuditLogResultObjectIfValid(upgradeResponse.URI as string, 40);
            if (auditLogResponse.Status && auditLogResponse.Status.Name == 'Failure') {
                if (!auditLogResponse.AuditInfo.ErrorMessage.includes('is already working on newer version')) {
                    testData[addonName].push(changeType);
                    testData[addonName].push(auditLogResponse.Status.Name);
                    testData[addonName].push(auditLogResponse.AuditInfo.ErrorMessage);
                } else {
                    changeType = 'Downgrade';
                    upgradeResponse = await this.papiClient.addons.installedAddons
                        .addonUUID(`${addonUUID}`)
                        .downgrade(varLatestVersion);
                    auditLogResponse = await this.getAuditLogResultObjectIfValid(upgradeResponse.URI as string, 40);
                    testData[addonName].push(changeType);
                    testData[addonName].push(String(auditLogResponse.Status?.Name));
                }
            } else {
                testData[addonName].push(changeType);
                testData[addonName].push(String(auditLogResponse.Status?.Name));
            }
        }
        return testData;
    }

    fetchStatus(uri: string, requestInit?: FetchRequestInit): Promise<FetchStatusResponse> {
        const start = performance.now();
        let responseStr: string;
        let parsed: any = {};
        let errorMessage: any = {};
        let OptionalHeaders = {
            Authorization: `Bearer ${this.papiClient['options'].token}`,
            ...requestInit?.headers,
        };
        if (requestInit?.headers?.Authorization === null) {
            OptionalHeaders = undefined as any;
        }
        return fetch(`${uri.startsWith('/') ? this['client'].BaseURL + uri : uri}`, {
            method: `${requestInit?.method ? requestInit?.method : 'GET'}`,
            body: typeof requestInit?.body == 'string' ? requestInit.body : JSON.stringify(requestInit?.body),
            headers: OptionalHeaders,
            timeout: requestInit?.timeout,
            size: requestInit?.size,
        })
            .then(async (response) => {
                const end = performance.now();
                const isSucsess = response.status > 199 && response.status < 400 ? true : false;
                console[isSucsess ? 'log' : 'debug'](
                    `%cFetch ${isSucsess ? '' : 'Error '}${requestInit?.method ? requestInit?.method : 'GET'}: ${
                        uri.startsWith('/') ? this['client'].BaseURL + uri : uri
                    } took ${(end - start).toFixed(2)} milliseconds`,
                    `${isSucsess ? 'color: #9370DB' : 'color: #f7df1e'}`,
                );

                try {
                    if (response.headers.get('content-type')?.startsWith('image')) {
                        responseStr = await response.buffer().then((r) => r.toString('base64'));
                        parsed = {
                            Type: 'image/base64',
                            Text: responseStr,
                        };
                    } else {
                        responseStr = await response.text();
                        parsed = responseStr ? JSON.parse(responseStr) : '';
                    }
                } catch (error) {
                    if (responseStr && responseStr.substring(20).includes('xml')) {
                        parsed = {
                            Type: 'xml',
                            Text: responseStr,
                        };
                        errorMessage = parseResponse(responseStr);
                    } else if (responseStr && responseStr.substring(20).includes('html')) {
                        parsed = {
                            Type: 'html',
                            Text: responseStr,
                        };
                        errorMessage = parseResponse(responseStr);
                    } else {
                        parsed = {
                            Type: 'Error',
                            Text: responseStr,
                        };
                        errorMessage = error;
                    }
                }

                const headersArr: any = {};
                response.headers.forEach((value, key) => {
                    headersArr[key] = value;
                });

                return {
                    Ok: response.ok,
                    Status: response.status,
                    Headers: headersArr,
                    Body: parsed,
                    Error: errorMessage,
                };
            })
            .catch((error) => {
                console.error(`Error type: ${error.type}, ${error}`);
                return {
                    Ok: undefined as any,
                    Status: undefined as any,
                    Headers: undefined as any,
                    Body: {
                        Type: error.type,
                        Name: error.name,
                    },
                    Error: error.message,
                };
            });
    }

    async getLatestSchemaByKeyAndFilterAttributes(
        key: string,
        addonUUID: string,
        tableName: string,
        filterAttributes: FilterAttributes,
        loopsAmount?,
    ) {
        let schemaArr, latestSchema;
        let maxLoopsCounter = loopsAmount === undefined ? 12 : loopsAmount;
        do {
            this.sleep(1500);
            schemaArr = await this.adalService.getDataFromSchema(addonUUID, tableName, {
                order_by: 'CreationDateTime DESC',
            });
            maxLoopsCounter--;
            latestSchema = this.extractSchema(schemaArr, key, filterAttributes);
        } while (Array.isArray(latestSchema) && maxLoopsCounter > 0);
        return latestSchema;
    }

    extractSchema(schema, key: string, filterAttributes: FilterAttributes) {
        outerLoop: for (let j = 0; j < schema.length; j++) {
            const entery = schema[j];
            if (!entery.Key.startsWith(key) || entery.IsTested) {
                continue;
            }
            if (filterAttributes.AddonUUID) {
                if (entery.Message.FilterAttributes.AddonUUID != filterAttributes.AddonUUID[0]) {
                    continue;
                }
            }
            if (filterAttributes.Resource) {
                if (entery.Message.FilterAttributes.Resource != filterAttributes.Resource[0]) {
                    continue;
                }
            }
            if (filterAttributes.Action) {
                if (entery.Message.FilterAttributes.Action != filterAttributes.Action[0]) {
                    continue;
                }
            }
            if (filterAttributes.ModifiedFields) {
                if (entery.Message.FilterAttributes.ModifiedFields.length != filterAttributes.ModifiedFields.length) {
                    continue;
                }
                for (let i = 0; i < filterAttributes.ModifiedFields.length; i++) {
                    const field = filterAttributes.ModifiedFields[i];
                    if (entery.Message.FilterAttributes.ModifiedFields.includes(field)) {
                        continue;
                    } else {
                        continue outerLoop;
                    }
                }
            }
            return schema[j];
        }
        return schema;
    }

    isValidUrl(s: string): boolean {
        //taken from https://tutorial.eyehunts.com/js/url-validation-regex-javascript-example-code/
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', // fragment locator
            'i', // makes the regex case insensitive
        );
        return !!pattern.test(s.replace(' ', '%20'));
    }

    getSecretKey(addonUUID: string): Promise<string> {
        return this.papiClient
            .post('/code_jobs/get_data_for_job_execution', {
                JobMessageData: {
                    UUID: '00000000-0000-0000-0000-000000000000',
                    MessageType: 'AddonMessage',
                    AddonData: {
                        AddonUUID: addonUUID,
                        AddonPath: 0,
                    },
                },
            })
            .then((res) => res.ClientObject.AddonSecretKey);
    }

    generateRandomString(len: number) {
        let rdmString = '';
        while (rdmString.length < len) {
            rdmString += Math.random().toString(36).substr(2);
        }
        return rdmString.substr(0, len);
    }

    async executeScriptFromTestData(scriptName: string): Promise<void> {
        await execFileSync(`${__dirname.split('services')[0]}api-tests\\test-data\\${scriptName}`);
        return;
    }
}

export interface TesterFunctions {
    describe: any;
    expect: any;
    assert?: any;
    it: any;
    run: any;
    setNewTestHeadline?: any;
    addTestResultUnderHeadline?: any;
    printTestResults?: any;
}

export interface FetchStatusResponse {
    Ok: boolean;
    Status: number;
    Headers?: any;
    Body: any;
    Error: any;
}

export interface FetchRequestInit {
    method?: HttpMethod;
    body?: string;
    headers?: {
        [key: string]: string;
    };
    timeout?: number;
    size?: number;
}

function parseResponse(responseStr) {
    const errorMessage: any = {};
    responseStr = responseStr.replace(/\s/g, '');
    responseStr = responseStr.replace(/.......(?<=style>).*(?=<\/style>)......../g, '');
    responseStr = String(responseStr.match(/......(?<=head>).*(?=<\/body>)......./));
    const headerStr = String(responseStr.match(/(?<=head>).*(?=<\/head>)/));
    const headerTagsMatched = String(headerStr.match(/(?<=)([\w\s\.\,\:\;\'\"]+)(?=<\/)..[\w\s]+/g));
    const headerTagsArr = headerTagsMatched.split(/,|<\//);
    const bodyStr = String(responseStr.match(/(?<=body>).*(?=<\/body>)/));
    const bodyStrTagsMatched = String(bodyStr.match(/(?<=)([\w\s\.\,\:\;\'\"]+)(?=<\/)..[\w\s]+/g));
    const bodyStrTagsArr = bodyStrTagsMatched.split(/,|<\//);
    for (let index = 1; index < headerTagsArr.length; index += 2) {
        errorMessage.Header = {};
        errorMessage.Header[`${headerTagsArr[index]}`] = headerTagsArr[index - 1];
    }
    for (let index = 1; index < bodyStrTagsArr.length; index += 2) {
        errorMessage.Body = {};
        errorMessage.Body[`${bodyStrTagsArr[index]}`] = bodyStrTagsArr[index - 1];
    }
    return errorMessage;
}
