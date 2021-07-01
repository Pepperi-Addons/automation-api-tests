import {
    PapiClient,
    InstalledAddon,
    Catalog,
    FindOptions,
    GeneralActivity,
    Transaction,
    User,
} from '@pepperi-addons/papi-sdk';
import { Client } from '@pepperi-addons/debug-server';
import jwt_decode from 'jwt-decode';
import fetch from 'node-fetch';
import { performance } from 'perf_hooks';

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

export default class GeneralService {
    papiClient: PapiClient;

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID.length > 10 ? client.AddonUUID : 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
            addonSecretKey: client.AddonSecretKey,
        });
    }

    sleep(ms) {
        console.debug(`%cSleep: ${ms} milliseconds`, 'color: #f7df1e');
        const start = new Date().getTime(),
            expire = start + ms;
        while (new Date().getTime() < expire) {}
        return;
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
        return this.client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
    }

    getClientData(data: ClientData): string {
        return jwt_decode(this.client.OAuthAccessToken)[UserDataObject[data]];
    }

    getAddons(options?: FindOptions): Promise<InstalledAddon[]> {
        return this.papiClient.addons.installedAddons.find(options);
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

    async getAuditLogResultObjectIfValid(uri, loopsAmount?) {
        let auditLogResponse = await this.papiClient.get(uri);
        auditLogResponse = auditLogResponse[0] === undefined ? auditLogResponse : auditLogResponse[0];

        //This loop is used for cases where AuditLog was not created at all (This can happen and it is valid)
        if (auditLogResponse.UUID.length < 10 || !JSON.stringify(auditLogResponse).includes('AuditInfo')) {
            console.log('Retray - No Audit Log found');
            let retrayGetCall = loopsAmount + 2;
            do {
                this.sleep(800);
                auditLogResponse = await this.papiClient.get(uri);
                auditLogResponse = auditLogResponse[0] === undefined ? auditLogResponse : auditLogResponse[0];
                retrayGetCall--;
            } while (auditLogResponse.UUID.length < 10 && retrayGetCall > 0);
        }

        let loopsCounter = 0;
        //This loop will only retray the get call again as many times as the "loopsAmount"
        if (auditLogResponse.Status.ID == '2') {
            loopsAmount = loopsAmount === undefined ? 2 : loopsAmount;
            console.log('Status ID is 2, Retray ' + loopsAmount + ' Times.');
            while (auditLogResponse.Status.ID == '2' && loopsCounter < loopsAmount) {
                auditLogResponse = await this.papiClient.get(uri);
                this.sleep(2000);
                loopsCounter++;
            }
        }

        //Check UUID
        try {
            if (
                auditLogResponse.DistributorUUID == auditLogResponse.UUID ||
                auditLogResponse.DistributorUUID == auditLogResponse.Event.User.UUID ||
                auditLogResponse.UUID == auditLogResponse.Event.User.UUID ||
                auditLogResponse.Event.User.UUID != this.getClientData('UserUUID')
            ) {
                return 'Error in UUID in Audit Log API Response';
            }
        } catch (e) {
            e.stack = 'UUID in Audit Log API Response:\n' + e.stack;
            return e;
        }
        //Check Date and Time
        try {
            if (
                !auditLogResponse.CreationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z') ||
                !auditLogResponse.ModificationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z')
            ) {
                return 'Error in Date and Time in Audit Log API Response';
            }
        } catch (e) {
            e.stack = 'Date and Time in Audit Log API Response:\n' + e.stack;
            return e;
        }
        //Check Type and Event
        try {
            if (
                (auditLogResponse.AuditType != 'action' && auditLogResponse.AuditType != 'data') ||
                (auditLogResponse.Event.Type != 'code_job_execution' &&
                    auditLogResponse.Event.Type != 'scheduler' &&
                    auditLogResponse.Event.Type != 'sync' &&
                    auditLogResponse.Event.Type != 'deployment') ||
                auditLogResponse.Event.User.Email != this.getClientData('UserEmail')
            ) {
                return 'Error in Type and Event in Audit Log API Response';
            }
        } catch (e) {
            e.stack = 'Type and Event in Audit Log API Response:\n' + e.stack;
            return e;
        }
        return auditLogResponse;
    }

    async areAddonsInstalled(testData: { [any: string]: string[] }): Promise<boolean[]> {
        const isInstalledArr: boolean[] = [];
        const installedAddonsArr = await this.getAddons({ page_size: -1 });
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
                    await this.papiClient.addons.installedAddons
                        .addonUUID(`${testData[addonUUID][0]}`)
                        .install('0.0.235');
                } else {
                    await this.papiClient.addons.installedAddons.addonUUID(`${testData[addonUUID][0]}`).install();
                }
                this.sleep(20000); //If addon needed to be installed, just wait 20 seconds, this should not happen.
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
            this.sleep(4000); //Test upgrade status only after 4 seconds.
            let auditLogResponse = await this.papiClient.auditLogs.uuid(upgradeResponse.ExecutionUUID as any).get();
            if (auditLogResponse.Status.Name == 'InProgress') {
                this.sleep(20000); //Wait another 20 seconds and try again (fail the test if client wait more then 20+4 seconds)
                auditLogResponse = await this.papiClient.auditLogs.uuid(upgradeResponse.ExecutionUUID as any).get();
            }
            if (auditLogResponse.Status.Name == 'Failure') {
                if (!auditLogResponse.AuditInfo.ErrorMessage.includes('is already working on newer version')) {
                    testData[addonName].push(changeType);
                    testData[addonName].push(auditLogResponse.Status.Name);
                    testData[addonName].push(auditLogResponse.AuditInfo.ErrorMessage);
                } else {
                    changeType = 'Downgrade';
                    upgradeResponse = await this.papiClient.addons.installedAddons
                        .addonUUID(`${addonUUID}`)
                        .downgrade(varLatestVersion);
                    this.sleep(4000); //Test downgrade status only after 4 seconds.
                    let auditLogResponse = await this.papiClient.auditLogs
                        .uuid(upgradeResponse.ExecutionUUID as any)
                        .get();
                    if (auditLogResponse.Status.Name == 'InProgress') {
                        this.sleep(20000); //Wait another 20 seconds and try again (fail the test if client wait more then 20+4 seconds)
                        auditLogResponse = await this.papiClient.auditLogs
                            .uuid(upgradeResponse.ExecutionUUID as any)
                            .get();
                    }
                    testData[addonName].push(changeType);
                    testData[addonName].push(auditLogResponse.Status.Name);
                }
            } else {
                testData[addonName].push(changeType);
                testData[addonName].push(auditLogResponse.Status.Name);
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
