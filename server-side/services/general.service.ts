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
    AddonAPIAsyncResult,
} from '@pepperi-addons/papi-sdk';
import { Client } from '@pepperi-addons/debug-server';
import jwt_decode from 'jwt-decode';
import fetch from 'node-fetch';
import { performance } from 'perf_hooks';
import { ADALService } from './adal.service';
import fs from 'fs';
import { execFileSync } from 'child_process';
import tester from '../tester';

export const testData = {
    'API Testing Framework': ['eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', ''],
    'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.5'],
    'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.'],
    'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '16.80.4'], //hardcoded version because there are CPAS .80 versions only for CPI team testing - this one is phased
    'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '16.65.'], //16.60.38 //16.60
    'Settings Framework': ['354c5123-a7d0-4f52-8fce-3cf1ebc95314', '9.5.305'], //9.5
    'Addons Manager': ['bd629d5f-a7b4-4d03-9e7c-67865a6d82a9', '0.'],
    'Data Views API': ['484e7f22-796a-45f8-9082-12a734bac4e8', '1.'],
    ADAL: ['00000000-0000-0000-0000-00000000ada1', '1.'],
    'Automated Jobs': ['fcb7ced2-4c81-4705-9f2b-89310d45e6c7', ''],
    'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', ''],
    'Object Types Editor': ['04de9428-8658-4bf7-8171-b59f6327bbf1', '1.'],
    'Pepperi Notification Service': ['00000000-0000-0000-0000-000000040fa9', ''],
    'Item Trade Promotions': ['b5c00007-0941-44ab-9f0e-5da2773f2f04', ''],
    'Order Trade Promotions': ['375425f5-cd2f-4372-bb88-6ff878f40630', ''],
    'Package Trade Promotions': ['90b11a55-b36d-48f1-88dc-6d8e06d08286', ''],
};

export const ConsoleColors = {
    MenuHeader: 'color: #FFFF00',
    MenuBackground: 'background-color: #000000',
    SystemInformation: 'color: #F87217',
    Information: 'color: #FFD801',
    FetchStatus: 'color: #893BFF',
    PageMessage: 'color: #6C2DC7',
    NevigationMessage: 'color: #3BB9FF',
    ClickedMessage: 'color: #00FFFF',
    SentKeysMessage: 'color: #C3FDB8',
    ElementFoundMessage: 'color: #6AFB92',
    BugSkipped: 'color: #F535AA',
    Error: 'color: #FF0000',
    Success: 'color: #00FF00',
};
console.log('%cLogs Colors Information:\t\t', `${ConsoleColors.MenuBackground}; ${ConsoleColors.MenuHeader}`); //Black, Yellow
console.log('%c#F87217\t\tSystem Information\t', `${ConsoleColors.MenuBackground}; ${ConsoleColors.SystemInformation}`); //Pumpkin Orange
console.log('%c#FFD801\t\tInformation\t\t', `${ConsoleColors.MenuBackground}; ${ConsoleColors.Information}`); //Rubber Ducky Yellow
console.log('%c#893BFF\t\tFetch Status\t\t', `${ConsoleColors.MenuBackground}; ${ConsoleColors.FetchStatus}`); //Aztech Purple
console.log('%c#6C2DC7\t\tPage Message\t\t', `${ConsoleColors.MenuBackground}; ${ConsoleColors.PageMessage}`); //Purple Amethyst
console.log('%c#3BB9FF\t\tNevigation Message\t', `${ConsoleColors.MenuBackground}; ${ConsoleColors.NevigationMessage}`); //Deep Sky Blue
console.log('%c#00FFFF\t\tClicked Message\t\t', `${ConsoleColors.MenuBackground}; ${ConsoleColors.ClickedMessage}`); //Aqua
console.log('%c#C3FDB8\t\tSentKeys Message\t', `${ConsoleColors.MenuBackground}; ${ConsoleColors.SentKeysMessage}`); //Light Jade
console.log(
    '%c#6AFB92\t\tElement Found Message\t',
    `${ConsoleColors.MenuBackground}; ${ConsoleColors.ElementFoundMessage}`,
); //Dragon Green
console.log('%c#F535AA\t\tBug Skipped\t\t', `${ConsoleColors.MenuBackground}; ${ConsoleColors.BugSkipped}`); //Neon Pink
console.log('%c#FF0000\t\tError\t\t\t', `${ConsoleColors.MenuBackground}; ${ConsoleColors.Error}`); //red
console.log('%c#00FF00\t\tSuccess\t\t\t', `${ConsoleColors.MenuBackground}; ${ConsoleColors.Success}`); //green

/**
 * This listner will be added when scripts start from the API or from CLI
 * In cased of errors from selenium-webdriver libary or an error that includes message of "Error"
 * The process will end
 */
process.on('unhandledRejection', async (error) => {
    if (error instanceof Error && JSON.stringify(error.stack).includes('selenium-webdriver\\lib\\http.js')) {
        console.log(`%cError in Chrome API: ${error}`, ConsoleColors.Error);
        console.log('Wait 10 seconds before trying to call the browser api again');
        console.debug(`%cSleep: ${10000} milliseconds`, ConsoleColors.Information);
        msSleep(10000);
    } else if (error instanceof Error && JSON.stringify(error.message).includes('Error')) {
        console.log(`%cError unhandledRejection: ${error.message}`, ConsoleColors.Error);
        console.log(
            `%cIn cases of unhandledRejection that include message of "Error" the process stopped`,
            ConsoleColors.SystemInformation,
        );
        process.exit(1);
    } else {
        console.log(`%cError unhandledRejection: ${error}`, ConsoleColors.Error);
        console.debug(`%cSleep: ${4000} milliseconds`, ConsoleColors.Information);
        msSleep(4000);
    }
});

interface QueryOptions {
    select?: string[];
    group_by?: string;
    fields?: string[];
    where?: string;
    order_by?: string;
    page?: number;
    page_size?: number;
    include_nested?: boolean;
    full_mode?: boolean;
    include_deleted?: boolean;
    is_distinct?: boolean;
}

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
    /**
     * This is Async/Non-Blocking sleep
     * @param ms
     * @returns
     */
    sleepAsync(ms: number) {
        console.debug(`%cAsync Sleep: ${ms} milliseconds`, ConsoleColors.Information);
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * This is Synchronic/Blocking sleep
     * This should be used in most cases
     * @param ms
     * @returns
     */
    sleep(ms: number) {
        console.debug(`%cSleep: ${ms} milliseconds`, ConsoleColors.Information);
        msSleep(ms);
        return;
    }

    addQueryAndOptions(url: string, options: QueryOptions = {}) {
        const optionsArr: string[] = [];
        Object.keys(options).forEach((key) => {
            optionsArr.push(key + '=' + encodeURIComponent(options[key]));
        });
        const query = optionsArr.join('&');
        return query ? url + '?' + query : url;
    }

    initiateTesterFunctions(client: Client, testName: string) {
        const testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, assert, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } =
            tester(client, testName, testEnvironment);
        return {
            describe,
            expect,
            assert,
            it,
            run,
            setNewTestHeadline,
            addTestResultUnderHeadline,
            printTestResults,
        };
    }

    async initiateTester(email, pass): Promise<Client> {
        const getToken = await this.getToken(email, pass);

        return this.createClient(getToken.access_token);
    }

    private async getToken(email: any, pass: any) {
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

        if (!getToken?.access_token) {
            throw new Error(
                `Error unauthorized\nError: ${getToken.error}\nError description: ${getToken.error_description}`,
            );
        }

        return getToken;
    }

    createClient(authorization) {
        if (!authorization) {
            throw new Error('Error unauthorized');
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
        let addonUUID;
        if (this.client.AddonUUID.length > 0) {
            addonUUID = this.client.AddonUUID;
        } else {
            addonUUID = JSON.parse(fs.readFileSync('../addon.config.json', { encoding: 'utf8', flag: 'r' }))[
                'AddonUUID'
            ];
        }
        let sk;
        if (this.client.AddonSecretKey && this.client.AddonSecretKey.length > 0) {
            sk = this.client.AddonSecretKey;
        } else {
            try {
                sk = fs.readFileSync('../var_sk', { encoding: 'utf8', flag: 'r' });
            } catch (error) {
                console.log(`%cSK Not found: ${error}`, ConsoleColors.SystemInformation);
                sk = '00000000-0000-0000-0000-000000000000';
            }
        }
        return [addonUUID, sk];
    }

    CalculateUsedMemory() {
        const used = process.memoryUsage();
        const memoryUsed = {};
        for (const key in used) {
            memoryUsed[key] = Math.round((used[key] / 1024 / 1024) * 100) / 100;
        }
        console.log(`%cMemory Use in MB = ${JSON.stringify(memoryUsed)}`, ConsoleColors.SystemInformation);
    }

    PrintMemoryUseToLog(state, testName) {
        console.log(`%c${state} ${testName} Test System Information:`, ConsoleColors.SystemInformation);
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

    getInstalledAddons(options?: FindOptions): Promise<InstalledAddon[]> {
        return this.papiClient.addons.installedAddons.find(options);
    }

    getSystemAddons() {
        return this.papiClient.addons.find({ where: 'Type=1', page_size: -1 });
    }

    getVARInstalledAddons(varKey: string, options: QueryOptions = {}) {
        let url = `${this.client.BaseURL.replace('papi-eu', 'papi')}/var/addons/installed_addons`;
        url = this.addQueryAndOptions(url, options);
        return this.fetchStatus(url, {
            method: `GET`,
            headers: {
                Authorization: `Basic ${Buffer.from(varKey).toString('base64')}`,
            },
        });
    }

    getVARDistributor(varKey: string, options: QueryOptions = {}) {
        let url = `${this.client.BaseURL.replace('papi-eu', 'papi')}/var/distributors`;
        url = this.addQueryAndOptions(url, options);
        return this.fetchStatus(url, {
            method: `GET`,
            headers: {
                Authorization: `Basic ${Buffer.from(varKey).toString('base64')}`,
            },
        });
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

    getDistributor() {
        return this.papiClient.get('/distributor');
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
                console.log('%cAudit Log was not found, waiting...', ConsoleColors.Information);
                loopsAmount--;
            }
            //This case will only retry the get call again as many times as the "loopsAmount"
            else if (auditLogResponse.Status.ID == '2') {
                this.sleep(2000);
                console.log(
                    '%cIn_Progres: Status ID is 2, Retry ' + loopsAmount + ' Times.',
                    ConsoleColors.Information,
                );
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
        const installedAddonsArr = await this.getInstalledAddons({ page_size: -1 });
        let installResponse;
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];

            const isInstalled = installedAddonsArr.find((addon) => addon.Addon.Name == addonName) ? true : false;

            if (!isInstalled) {
                //API Testing Framework AddonUUID
                if (addonUUID == 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe') {
                    installResponse = await this.papiClient.addons.installedAddons
                        .addonUUID(`${addonUUID}`)
                        .install('0.0.235');
                } else {
                    if (version.match(/\d+[\.]\d+[/.]\d+/)) {
                        const versionToInstall = version.match(/\d+[\.]\d+[/.]\d+/);
                        if (version?.length && typeof version[0] === 'string') {
                            installResponse = await this.papiClient.addons.installedAddons
                                .addonUUID(`${addonUUID}`)
                                .install(String(versionToInstall));
                        } else {
                            installResponse = await this.papiClient.addons.installedAddons
                                .addonUUID(`${addonUUID}`)
                                .install();
                        }
                    } else {
                        installResponse = await this.papiClient.addons.installedAddons
                            .addonUUID(`${addonUUID}`)
                            .install();
                    }
                }
                const auditLogResponse = await this.getAuditLogResultObjectIfValid(installResponse.URI, 40);
                if (auditLogResponse.Status && auditLogResponse.Status.ID != 1) {
                    isInstalledArr.push(false);
                    continue;
                }
            }
            isInstalledArr.push(true);
        }
        return isInstalledArr;
    }

    async uninstallAddon(addonUuid: string): Promise<AddonAPIAsyncResult> {
        return this.papiClient.addons.installedAddons.addonUUID(addonUuid).uninstall();
    }

    async changeVersion(
        varKey: string,
        testData: { [any: string]: string[] },
        isPhased: boolean,
    ): Promise<{ [any: string]: string[] }> {
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            let changeType = 'Upgrade';
            let searchString = `AND Version Like'${version}%' AND Available Like 1 AND Phased Like 1`;
            if (
                addonName == 'Services Framework' ||
                addonName == 'Cross Platforms API' ||
                addonName == 'API Testing Framework' ||
                // addonName == 'WebApp API Framework' || // 11/4: becuase CPAS versions are sometimes released just for dev tests - we cant just take the newest
                !isPhased
            ) {
                searchString = `AND Version Like '${version}%' AND Available Like 1`;
            }
            if (addonName == 'ADAL' && this.papiClient['options'].baseURL.includes('staging')) {
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
                        Authorization: `Basic ${Buffer.from(varKey).toString('base64')}`,
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
                    `Fetch Error - Verify The varKey, Status: ${fetchVarResponse.Status}, Error Message: ${fetchVarResponse.Error.title}`,
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

    async changeToAnyAvailableVersion(testData: { [any: string]: string[] }): Promise<{ [any: string]: string[] }> {
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            let changeType = 'Upgrade';
            const searchString = `AND Version Like '${version}%' AND Available Like 1`;
            const fetchResponse = await this.fetchStatus(
                `${this.client.BaseURL}/addons/versions?where=AddonUUID='${addonUUID}'${searchString}&order_by=CreationDateTime DESC`,
                {
                    method: `GET`,
                },
            );
            let LatestVersion;
            if (fetchResponse.Status == 200) {
                try {
                    LatestVersion = fetchResponse.Body[0].Version;
                } catch (error) {
                    throw new Error(
                        `Get latest addon version failed: ${version}, Status: ${
                            LatestVersion.Status
                        }, Error Message: ${JSON.stringify(fetchResponse.Error)}`,
                    );
                }
            } else {
                throw new Error(
                    `Get latest addon version failed: ${version}, Status: ${
                        fetchResponse.Status
                    }, Error Message: ${JSON.stringify(fetchResponse.Error)}`,
                );
            }
            testData[addonName].push(LatestVersion);

            let upgradeResponse = await this.papiClient.addons.installedAddons
                .addonUUID(`${addonUUID}`)
                .upgrade(LatestVersion);
            let auditLogResponse = await this.getAuditLogResultObjectIfValid(upgradeResponse.URI as string, 90);
            if (auditLogResponse.Status && auditLogResponse.Status.Name == 'Failure') {
                if (!auditLogResponse.AuditInfo.ErrorMessage.includes('is already working on newer version')) {
                    testData[addonName].push(changeType);
                    testData[addonName].push(auditLogResponse.Status.Name);
                    testData[addonName].push(auditLogResponse.AuditInfo.ErrorMessage);
                } else {
                    changeType = 'Downgrade';
                    upgradeResponse = await this.papiClient.addons.installedAddons
                        .addonUUID(`${addonUUID}`)
                        .downgrade(LatestVersion);
                    auditLogResponse = await this.getAuditLogResultObjectIfValid(upgradeResponse.URI as string, 90);
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
                    `${isSucsess ? ConsoleColors.FetchStatus : ConsoleColors.Information}`,
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

    async baseAddonVersionsInstallation(varPass: string) {
        const isInstalledArr = await this.areAddonsInstalled(testData);
        const chnageVersionResponseArr = await this.changeVersion(varPass, testData, false);
        return { chnageVersionResponseArr: chnageVersionResponseArr, isInstalledArr: isInstalledArr };
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

    /**
     * The addon must be installed for this function to work
     * @param addonUUID
     * @returns
     */
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

    generateRandomString(length: number): string {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }
        return result;
    }

    async executeScriptFromTestData(scriptName: string): Promise<void> {
        await execFileSync(`${__dirname.split('services')[0]}api-tests\\test-data\\${scriptName}`);
        return;
    }

    /**
     * will return true if dateToTest param is indicating a time point which happened less than howLongAgo milliseconds ago
     * @param dateToTest tested date in millisecods
     * @param howLongAgo less than how many milliseconds should pass
     * @param timeDiff time diff between the time zone which the machine running the code is in and time zone tested date taken from
     * @returns
     */
    isLessThanGivenTimeAgo(dateToTest, howLongAgo, timeDiff?) {
        if (timeDiff) dateToTest += timeDiff;
        const timeAgo = Date.now() - howLongAgo;
        return dateToTest > timeAgo;
    }
}

function msSleep(ms: number) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

export interface TesterFunctions {
    describe: { (name: string, fn: () => any): any };
    expect: Chai.ExpectStatic;
    assert?: Chai.AssertStatic | any;
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
