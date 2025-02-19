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
import * as path from 'path';

export const systemAddons: any = {
    //these are the system addons of pepperi, i.e. every dist starts with them regardless - all these are configured by: Type = 1
    //this JSON is built for open-sync, because I cant start from installing Nebula -
    //it requires KMS permission, so if you need Nebula: create the dist THEN set KMS permission then run upg. dep. for nebula dists
    Crawler: ['f489d076-381f-4cf7-aa63-33c6489eb017', ''], // evgeny: 27/3/24 - cpi data dep.
    'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
    'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
    'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
    'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '17.%.%'], //CPAS
    sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '3.%.%'], //open-sync
    configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
    'Key Management Service': ['8b4a1bd8-a2eb-4241-85ac-89c9e724e900', ''],
    'Resource Tracer': ['8b4a1bd8-a2eb-4241-85ac-89c9e724e900', ''],
    'Operation Invoker': ['f8d964d7-aad0-4d29-994b-5977a8f22dca', ''],
    'Push Notifications': ['95025423-9096-4a4f-a8cd-d0a17548e42e', ''],
    Logs: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', ''],
    'Async Task Execution': ['00000000-0000-0000-0000-0000000a594c', ''],
    'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
    Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''], // was 2.%.% - changed on Dec. 2024 by Hagit
    'Usage Monitor': ['00000000-0000-0000-0000-000000005a9e', ''],
    'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', ''],
    'Audit Log': ['00000000-0000-0000-0000-00000da1a109', ''],
    'Object Types Editor': ['04de9428-8658-4bf7-8171-b59f6327bbf1', ''],
    'Notification Service': ['00000000-0000-0000-0000-000000040fa9', ''],
    ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
    'ATD Export / Import': ['e9029d7f-af32-4b0e-a513-8d9ced6f8186', ''],
    'Application Header': ['9bc8af38-dd67-4d33-beb0-7d6b39a6e98d', ''], // added on Dec. 2024 by Hagit
    'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''], // was 18.%.% - changed on Dec. 2024 by Hagit
    'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.%'], //cpapi
    'Data Views API': ['484e7f22-796a-45f8-9082-12a734bac4e8', ''],
    'Addons Manager': ['bd629d5f-a7b4-4d03-9e7c-67865a6d82a9', ''],
    'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''], //cpi-node (Cross Platform Engine)
    'Theme Editor': ['95501678-6687-4fb3-92ab-1155f47f839e', '2.2.%'],
    'Settings Framework': ['354c5123-a7d0-4f52-8fce-3cf1ebc95314', ''],
    'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'], //PAPI locked on TLS 2 version --
    'Custom Login': ['529b0de5-4640-4e78-83d0-b630a819db3b', ''],
    'Custom Domain': ['529b0de5-4640-4e78-83d0-b630a819db3b', ''],
};

export const testData = {
    //*these are the addons which all the "regular" dists in pepperi work with, we need them to work on latest versions -
    //this also contains our testing addon.
    //*these addons are combined to become our basic upg. dep. set
    //*please notice that this JSON extends "system addons" so of course its still fits open sync
    //*first half of these addons above the 'systemAddons' are system addon dependecies
    Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''],
    'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', '1.4.%'], //1.4.45 is the interim 1.4.X PFS version
    'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
    'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', ''], // REQUIRED FOR ADAL NEW VERSIONS (2.0.19 and above)
    'Activity Data Index': ['10979a11-d7f4-41df-8993-f06bfd778304', ''],
    'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''], // REQUIRED FOR PUSH NOTIFICATIONS NEW VERSIONS (1.5.4x and above)
    ...systemAddons,
    'API Testing Framework': ['eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', ''], //OUR TESTING ADDON --
    'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
    'Automated Jobs': ['fcb7ced2-4c81-4705-9f2b-89310d45e6c7', ''],
    Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''],
};

//this may be redundant
const testDataWithNoSync = { ...testData };
delete testDataWithNoSync.sync;
export const testDataNoSyncNoNebula = {
    ...testDataWithNoSync,
};

//this is the upg. dep. for nebula dists - containing nebula and locked on sync, cpi data and config versions
const baseAddonsForNebula = { ...testData };
baseAddonsForNebula.Slugs = ['4ba5d6f9-6642-4817-af67-c79b68c96977', '1.3.7'];
//removed the following dependencies:
//baseAddonsForNebula.configurations = ['84c999c3-84b7-454e-9a86-71b7abc96554', '0.7.%'];
//baseAddonsForNebula['Cross Platform Engine Data'] = ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', '0.6.%'];
//baseAddonsForNebula.sync = ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '1.%.%'];
baseAddonsForNebula.configurations = ['84c999c3-84b7-454e-9a86-71b7abc96554', ''];
baseAddonsForNebula['Cross Platform Engine Data'] = ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''];
baseAddonsForNebula.sync = ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''];
baseAddonsForNebula['File Service Framework'] = ['00000000-0000-0000-0000-0000000f11e5', '']; //1.3.x is for neubla
baseAddonsForNebula['User Defined Collections'] = ['122c0e9d-c240-4865-b446-f37ece866c22', ''];
export const testDataForNebulaDists = {
    ...baseAddonsForNebula,
    Nebula: ['00000000-0000-0000-0000-000000006a91', ''],
    'cpi-node-automation': ['2b39d63e-0982-4ada-8cbb-737b03b9ee58', '%'],
};

//this includes the NEW Sync, Nebula, UDC, Cpi-Node-Automation & Generic Resource - for tests that are related to CPI
export const testDataWithNewSyncForCpiRegression = {
    ...testData,
    'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
    'cpi-node-automation': ['2b39d63e-0982-4ada-8cbb-737b03b9ee58', '%'],
    'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
    Nebula: ['00000000-0000-0000-0000-000000006a91', ''],
};

//this may be redundant
//this includes the NEW Sync, Nebula, UDC, Cpi-Node-Automation & Generic Resource - for tests that are related to CPI
export const testDataWithNewSyncAndNebula = {
    ...testData, // already has sync
    'cpi-node-automation': ['2b39d63e-0982-4ada-8cbb-737b03b9ee58', '%'],
    'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
    Nebula: ['00000000-0000-0000-0000-000000006a91', ''],
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
    // debugger;
    if (error instanceof Error && JSON.stringify(error.stack).includes('selenium-webdriver\\lib\\http.js')) {
        console.log(`%cError in Chrome API: ${error}`, ConsoleColors.Error);
        console.log('Wait 10 seconds before trying to call the browser api again');
        console.debug(`%cSleep: ${10000} milliseconds`, ConsoleColors.Information);
        msSleep(10000);
    } else if (error instanceof Error && JSON.stringify(error.message).includes('Error')) {
        console.log(`%Unhandled Rejection: ${error.message}`, ConsoleColors.Error);
        console.log(
            `%cIn Cases Of UnhandledRejection Which Include Message Of "Error" The Process Stopps With Exit Code 1`,
            ConsoleColors.SystemInformation,
        );
        process.exit(1);
    } else if (error && typeof error === 'string' && error.includes(`SyntaxError: Unexpected token '<', "<html>`)) {
        console.log(`%Unhandled Rejection: ${error}`, ConsoleColors.Error);
        console.log(
            `%cIn Cases Of UnhandledRejection Which Include Message Of "Error" The Process Stopps With Exit Code 1`,
            ConsoleColors.SystemInformation,
        );
        process.exit(1);
    } else if (
        error &&
        typeof error === 'string' &&
        error.includes(` Unexpected token '<', "<html><hea"... is not valid JSON`)
    ) {
        console.log(`%Unhandled Rejection: ${error}`, ConsoleColors.Error);
        console.log(
            `%cIn Cases Of UnhandledRejection Which Include Message Of "Error" The Process Stopps With Exit Code 1`,
            ConsoleColors.SystemInformation,
        );
        process.exit(1);
    } else if (
        error &&
        typeof error === 'object' &&
        error['message'] &&
        typeof error['message'] === 'string' &&
        error['message'].includes(`reason: certificate has expired`)
    ) {
        console.log(`%Unhandled Rejection: ${error}`, ConsoleColors.Error);
        console.log(
            `%cIn Cases Of UnhandledRejection Which Include Message Of "Error" The Process Stopps With Exit Code 1`,
            ConsoleColors.SystemInformation,
        );
        process.exit(1);
    } else if (error && typeof error === 'string' && error.includes(`Error`)) {
        console.log(`%Unhandled Rejection: ${error}`, ConsoleColors.Error);
        console.log(
            `%cIn Cases Of UnhandledRejection Which Include Message Of "Error" The Process Stopps With Exit Code 1`,
            ConsoleColors.SystemInformation,
        );
        process.exit(1);
    } else if (error && typeof error === 'string' && error.includes(`doesn't have any phased available version`)) {
        console.log(`%Unhandled Rejection: ${error}`, ConsoleColors.Error);
        console.log(
            `%cIn Cases Of UnhandledRejection Which Include Message Of "Error" The Process Stopps With Exit Code 1`,
            ConsoleColors.SystemInformation,
        );
        process.exit(1);
    } else if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as any).message === 'string' &&
        (error as any).message.includes(`doesn't have any phased available version`)
    ) {
        console.log(`%Unhandled Rejection: ${error}`, ConsoleColors.Error);
        console.log(
            `%cIn Cases Of UnhandledRejection Which Include Message Of "Error" The Process Stopps With Exit Code 1`,
            ConsoleColors.SystemInformation,
        );
        process.exit(1);
    } else if (
        typeof error === 'string' &&
        (error.includes('Error') || error.includes('502') || error.includes('401') || error.includes('error'))
    ) {
        console.log(`%Unhandled Rejection: ${error}`, ConsoleColors.Error);
        console.log(
            `%cIn Cases Of UnhandledRejection Which Include Message Of "Error" The Process Stopps With Exit Code 1`,
            ConsoleColors.SystemInformation,
        );
        process.exit(1);
    } else if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        (JSON.stringify((error as any).message).includes('Error') ||
            JSON.stringify((error as any).message).includes('502'))
    ) {
        console.log(`%Unhandled Rejection: ${JSON.stringify((error as any).message)}`, ConsoleColors.Error);
        console.log(
            `%cIn Cases Of UnhandledRejection Which Include Message Of "Error" The Process Stopps With Exit Code 1`,
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
        this.testData = testData;
        this.testDataWithNewSyncForCpiRegression = testDataWithNewSyncForCpiRegression;
        this.testDataWithNewSync = testDataWithNewSyncAndNebula;
        this.testDataForInitUser = systemAddons;
        this.ConsoleColors = ConsoleColors;
    }
    public testData;
    public testDataWithNewSync;
    public testDataWithNewSyncForCpiRegression;
    public testDataForInitUser;
    public ConsoleColors;

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

    getNumberOfRandomElementsFromArray(array, numberOfElements) {
        const result = new Array(numberOfElements);
        let len = array.length;
        const taken = new Array(len);
        if (numberOfElements > len) throw new RangeError('getRandom: more elements taken than available');
        while (numberOfElements--) {
            const x = Math.floor(Math.random() * len);
            result[numberOfElements] = array[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
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

    returnXRandomElementsFromArray(array: any[], X: number): any[] {
        // Shuffle array
        const shuffled = array.sort(() => 0.5 - Math.random());
        // Get sub-array of first n elements after shuffled
        const selected = shuffled.slice(0, X);
        return selected;
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
        const [AddonUUID, sk] = this.getSecret();

        return {
            AddonUUID: AddonUUID,
            AddonSecretKey: sk,
            BaseURL: parsedToken['pepperi.baseurl'],
            OAuthAccessToken: token,
            AssetsBaseUrl: this.assetsBaseUrl ? this.assetsBaseUrl : 'http://localhost:4400/publish/assets',
            Retry: function () {
                return;
            },
            ValidatePermission: async (policyName) => {
                await this.validatePermission(policyName, token, parsedToken['pepperi.baseurl']);
            },
        } as Client;
    }

    async validatePermission(policyName: string, token: string, baseURL: string): Promise<void> {
        const permmisionsUUID = '3c888823-8556-4956-a49c-77a189805d22';
        const url = `${baseURL}/addons/api/${permmisionsUUID}/api/validate_permission`;
        const AddonUUID = this.getSecret()[0];

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const body = {
            policyName: policyName,
            addonUUID: AddonUUID,
        };

        const response = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(body) });

        if (response.ok) {
            return;
        } else {
            const responseJson = await response.json();
            const error: any = new Error(responseJson.fault.faultstring);
            error.code = response.status;
            throw error;
        }
    }

    async getSecretfromKMS(email, pass, key: string) {
        const token = (await this.getToken(email, pass)).access_token;
        const sk = this.getSecret();
        const uuid = testData['API Testing Framework'][0];
        const kmsData = await this.fetchStatus(`https://papi.pepperi.com/V1.0/kms/parameters/${key}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Pepperi-SecretKey': sk[1],
                'x-pepperi-ownerid': uuid,
            },
        });
        // const kmsData = (await this.papiClient.get(`/kms/parameters/${key}`)).Value;
        return kmsData.Body.Value;
    }

    async runJenkinsJobRemotely(buildUserCredentials: string, jobPath: string, jobName: string): Promise<string[]> {
        const base64Credentials = Buffer.from(buildUserCredentials).toString('base64');
        const jobQueueId = await this.startJenkinsJobRemotely(base64Credentials, jobPath);
        console.log(`started ${jobName} Jenkins job with queue id: ${jobQueueId}`);
        // const jobNameAsUrlSafe = encodeURI(jobName);
        await this.pollJenkinsEndPointUntillJobStarted(base64Credentials, jobPath, jobQueueId);
        const JenkinBuildResult = await this.pollJenkinsEndPointUntillJobEnded(base64Credentials, jobName, jobPath);
        if (jobPath.includes('Production')) {
            return [JenkinBuildResult, 'Production'];
        }
        if (jobPath.includes('EU')) {
            return [JenkinBuildResult, 'EU'];
        }
        if (jobPath.includes('Stage')) {
            return [JenkinBuildResult, 'Stage'];
        }
        return [JenkinBuildResult];
    }

    async startJenkinsJobRemotely(base64Credentials: string, jobPath: string) {
        const jenkinsBaseUrl = 'https://admin-box.pepperi.com/job/';
        const jobRemoteURL = jenkinsBaseUrl + jobPath;
        const jenkinsStartingJobResponse = await this.fetchStatus(jobRemoteURL, {
            method: 'GET',
            headers: {
                Authorization: `Basic ` + base64Credentials,
            },
        });
        if (jenkinsStartingJobResponse.Status !== 201) {
            throw `ERROR STATUS WHEN CALLING: ${jobRemoteURL}, GOT ${jenkinsStartingJobResponse.Status} instead OF 201`;
        }
        if (jenkinsStartingJobResponse.Ok !== true) {
            throw `ERROR STATUS WHEN CALLING: ${jobRemoteURL}, GOT ${jenkinsStartingJobResponse.Ok} instead of TRUE`;
        }
        if (!jenkinsStartingJobResponse.Headers.location.includes('https://admin-box.pepperi.com/queue/item/')) {
            throw `ERROR RESPONSE WHEN CALLING: ${jobRemoteURL}, GOT PREFIX LOCATION OF ${jenkinsStartingJobResponse.Headers.location} instead of https://admin-box.pepperi.com/queue/item/`;
        }
        const jenkinsLocationSplit = jenkinsStartingJobResponse.Headers.location.split('/');
        const jenkinsRunQueueNumber = jenkinsLocationSplit[jenkinsLocationSplit.length - 2];
        const jenkinsRunQueueNumberAsNumber = parseInt(jenkinsRunQueueNumber);
        if (isNaN(jenkinsRunQueueNumberAsNumber)) {
            throw `ERROR RESPONSE WHEN CALLING: ${jobRemoteURL}, QUEUE ID IS NOT A NUMBER: ${jenkinsRunQueueNumber}`;
        }
        return jenkinsRunQueueNumberAsNumber;
    }

    async pollJenkinsEndPointUntillJobStarted(
        buildUserCredsBase64: string,
        jobPath: string,
        //jobNameAsUrlSafe: string,
        jenkinsRunQueueNumberAsNumber: number,
    ) {
        let gottenIdFromJenkins = 0;
        let jenkinsJobResponsePolling: FetchStatusResponse = {
            Ok: false,
            Status: 0,
            Body: undefined,
            Error: undefined,
        };
        const path = jobPath.split('/build')[0];
        do {
            jenkinsJobResponsePolling = await this.fetchStatus(
                `https://admin-box.pepperi.com/job/${path}/lastBuild/api/json`,
                //https://admin-box.pepperi.com/job/API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20Production%20-%20ADAL/lastBuild/api/json
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Basic ` + buildUserCredsBase64,
                    },
                },
            );
            gottenIdFromJenkins = jenkinsJobResponsePolling.Body.queueId;
            console.log(`waiting for job queue id: ${gottenIdFromJenkins} to start -- still in Jenkins Queue`);
            this.sleep(4500);
        } while (gottenIdFromJenkins !== jenkinsRunQueueNumberAsNumber);
        const jenkinsJobName = jenkinsJobResponsePolling.Body.fullDisplayName;
        console.log(`job: ${jenkinsJobName} STARTED execution`);
        return;
    }

    //didLastJenkinsRunSucceed
    async didLastJenkinsRunSucceed(buildUserCredsBase64: string, jobPath: string) {
        const jenkinsLastBuildJobResponse = await this.fetchStatus(
            `https://admin-box.pepperi.com/job/${jobPath}/lastBuild/api/json`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ` + buildUserCredsBase64,
                },
            },
        );
        const gottenResultFromJenkins = jenkinsLastBuildJobResponse.Body.result;
        return gottenResultFromJenkins === 'SUCCESS';
    }

    async pollJenkinsEndPointUntillJobEnded(
        buildUserCredsBase64: string,
        jobName: string,
        jobPath: string,
    ): Promise<string> {
        let gottenResultFromJenkins = '';
        let jenkinsJobResponsePolling: FetchStatusResponse = {
            Ok: false,
            Status: 0,
            Body: undefined,
            Error: undefined,
        };
        const path = jobPath.split('/build')[0];
        do {
            jenkinsJobResponsePolling = await this.fetchStatus(
                `https://admin-box.pepperi.com/job/${path}/lastBuild/api/json`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Basic ` + buildUserCredsBase64,
                    },
                },
            );
            gottenResultFromJenkins = jenkinsJobResponsePolling.Body.result;
            console.log(
                `${jobName}: received result is ${gottenResultFromJenkins} ${
                    gottenResultFromJenkins === null
                        ? '(still running)'
                        : typeof gottenResultFromJenkins === 'undefined'
                        ? '(networking error should be resolved)'
                        : '(finished)'
                } `,
            );
            this.sleep(4500);
            // debugger;
        } while (gottenResultFromJenkins === null || typeof gottenResultFromJenkins === 'undefined');
        const jenkinsJobResult = jenkinsJobResponsePolling.Body.result;
        const jenkinsJobName = jenkinsJobResponsePolling.Body.fullDisplayName;
        console.log(`job: ${jenkinsJobName} is ended with status: ${jenkinsJobResult} `);
        return jenkinsJobResult;
    }

    async getLatestJenkinsJobExecutionId(buildUserCredentials, jobPath: string) {
        const base64Credentials = Buffer.from(buildUserCredentials).toString('base64');
        const jenkinsJobResponsePolling = await this.fetchStatus(
            `https://admin-box.pepperi.com/job/${jobPath}/lastBuild/api/json`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ` + base64Credentials,
                },
            },
        );
        return jenkinsJobResponsePolling.Body.number;
    }

    async getConsoleDataFromJenkinsJob(bufferedJenkinsBuildCreds, jenkinsJobUrl) {
        const JENKINS_BASE_URL = 'https://admin-box.pepperi.com/job/';
        const jenkinsJobConsoleTextResponse = await this.fetchStatus(
            `${JENKINS_BASE_URL}${jenkinsJobUrl}/lastBuild/consoleText`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ` + bufferedJenkinsBuildCreds,
                },
            },
        );
        return jenkinsJobConsoleTextResponse;
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
        console.log(`%c${state} ${testName} Test System Information: `, ConsoleColors.SystemInformation);
        this.CalculateUsedMemory();
    }

    PrintStartOfInstallation(state, testName) {
        console.log(` ####################### ${state} ${testName}`, ' ####################### ');
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
        let installedAddons;
        try {
            installedAddons = this.papiClient.addons.installedAddons.find(options);
        } catch (error) {
            throw new Error(`Error: ${(error as any).message}}`);
        }
        return installedAddons;
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

    async getAuditLogResultObjectIfValid(uri: string, loopsAmount = 30, sleepTime?: number): Promise<AuditLog> {
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
            else if (
                auditLogResponse.Status.ID == '2' ||
                auditLogResponse.Status.ID == '5' ||
                auditLogResponse.Status.ID == '4'
            ) {
                this.sleep(sleepTime !== undefined && sleepTime > 0 ? sleepTime : 2000);
                console.log(
                    `%c${
                        auditLogResponse.Status.ID === 2
                            ? 'In_Progres'
                            : auditLogResponse.Status.ID === 5
                            ? 'Started'
                            : 'InRetry'
                    }: Status ID is ${auditLogResponse.Status.ID}, Retry ${loopsAmount} Times.`,
                    ConsoleColors.Information,
                );
                loopsAmount--;
            }
        } while ( //2-> in progress, 5->Started, 4-> in retry|||| "ID": 5,"Name": "Started"
            (auditLogResponse === null ||
                auditLogResponse.Status.ID == '2' ||
                auditLogResponse.Status.ID == '5' ||
                auditLogResponse.Status.ID == '4') && //15/5: evgeny - new status "in retry"
            loopsAmount > 0
        );

        //Check UUID
        try {
            // debugger;
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
            // debugger;
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
            // debugger;
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

    async getAuditLogResultObjectIfValidV2(uri: string, loopsAmount = 30, sleepTime?: number): Promise<AuditLog> {
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
            else if (
                auditLogResponse.Status.ID == '2' ||
                auditLogResponse.Status.ID == '5' ||
                auditLogResponse.Status.ID == '4'
            ) {
                this.sleep(sleepTime !== undefined && sleepTime > 0 ? sleepTime : 2000);
                console.log(
                    `%c${
                        auditLogResponse.Status.ID === 2
                            ? 'In_Progres'
                            : auditLogResponse.Status.ID === 5
                            ? 'Started'
                            : 'InRetry'
                    }: Status ID is ${auditLogResponse.Status.ID}, Retry ${loopsAmount} Times.`,
                    ConsoleColors.Information,
                );
                if (auditLogResponse.Status.ID == '4') {
                    console.log(
                        `%cIn Retry: Result Object: ${auditLogResponse.AuditInfo.ResultObject}`,
                        ConsoleColors.Information,
                    );
                }
                loopsAmount--;
            }
        } while ( //2-> in progress, 5->pending, 4-> in retry
            (auditLogResponse === null ||
                auditLogResponse.Status.ID == '2' ||
                auditLogResponse.Status.ID == '5' ||
                auditLogResponse.Status.ID == '4') && //15/5: evgeny - new status "in retry"
            loopsAmount > 0
        );

        //Check UUID
        try {
            // debugger;
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
            // debugger;
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
            // debugger;
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
                                .addonUUID(`${addonUUID} `)
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
                    if (!auditLogResponse.AuditInfo.ErrorMessage.includes('Addon already installed'))
                        isInstalledArr.push(false);
                    continue;
                }
            }
            isInstalledArr.push(true);
        }
        return isInstalledArr;
    }

    async areAddonsInstalledEVGENY(testData: { [any: string]: string[] }): Promise<boolean[]> {
        const isInstalledArr: boolean[] = [];
        const installedAddonsArr = await this.getInstalledAddons({ page_size: -1 });
        let installResponse;
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            const isInstalled = installedAddonsArr.find((addon) => addon.Addon.UUID == addonUUID) ? true : false;

            if (!isInstalled) {
                installResponse = await this.papiClient.addons.installedAddons
                    .addonUUID(`${addonUUID}`)
                    .install(version);
            } else {
                installResponse = await this.papiClient.addons.installedAddons
                    .addonUUID(`${addonUUID}`)
                    .upgrade(version);
            }
            const auditLogResponse = await this.getAuditLogResultObjectIfValid(installResponse.URI, 40);
            if (auditLogResponse.Status && auditLogResponse.Status.ID != 1) {
                if (
                    !auditLogResponse.AuditInfo.ErrorMessage.includes('Addon already installed') &&
                    !auditLogResponse.AuditInfo.ErrorMessage.includes('is already working on version') &&
                    !auditLogResponse.AuditInfo.ErrorMessage.includes('is already working on newer version')
                ) {
                    isInstalledArr.push(auditLogResponse.AuditInfo.ErrorMessage);
                } else if (auditLogResponse.AuditInfo.ErrorMessage.includes('is already working on newer version')) {
                    installResponse = await this.papiClient.addons.installedAddons
                        .addonUUID(`${addonUUID}`)
                        .downgrade(version);
                    const auditLogResponse = await this.getAuditLogResultObjectIfValid(installResponse.URI, 40);
                    if (auditLogResponse.Status && auditLogResponse.Status.ID != 1) {
                        if (
                            !auditLogResponse.AuditInfo.ErrorMessage.includes('Addon already installed') &&
                            !auditLogResponse.AuditInfo.ErrorMessage.includes('is already working on version')
                        ) {
                            isInstalledArr.push(auditLogResponse.AuditInfo.ErrorMessage);
                        } else {
                            isInstalledArr.push(true);
                        }
                    } else {
                        isInstalledArr.push(true);
                    }
                } else {
                    isInstalledArr.push(true);
                }
            } else isInstalledArr.push(true);
        }
        return isInstalledArr;
    }

    async getLatestAvailableVersion(addonUUID: string, varCredentials: string, versionString?, env?) {
        const [varUserName, varPassword] = varCredentials.split(':');
        const client = await initiateTester(varUserName, varPassword, env);
        const service = new GeneralService(client);
        const varCredBase64 = Buffer.from(varCredentials).toString('base64');
        const responseProd = await service.fetchStatus(
            `/var/addons/versions?where=AddonUUID='${addonUUID}' AND Version Like ${
                versionString && versionString !== '' && versionString !== undefined
                    ? `'` + versionString + `'`
                    : `'%' AND Available Like 1`
            }
            &order_by=CreationDateTime DESC`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${varCredBase64}`,
                },
            },
        );
        return [responseProd.Body[0].Version, responseProd.Body[0].UUID];
    }

    async uninstallAddon(addonUuid: string): Promise<AddonAPIAsyncResult> {
        return this.papiClient.addons.installedAddons.addonUUID(addonUuid).uninstall();
    }

    /**
     * changes the version of the already installed addons based on 'test data'
     * @param varKey
     * @param testData
     * @param isPhased if true will query only for pahsed versions
     * @returns
     */
    async changeVersion(
        varKey: string,
        testData: { [any: string]: string[] },
        isPhased: boolean,
    ): Promise<{ [any: string]: string[] }> {
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            let changeType = 'Upgrade';
            let searchString = `AND Version Like '${
                version === '' ? '%' : version
            }' AND Available Like 1 AND Phased Like 1`;
            if (
                addonName == 'cpi-node-automation' || //cpi automation will never be phased
                addonName == 'Cross Platform Engine Data' ||
                addonName == 'Services Framework' ||
                addonName == 'Cross Platforms API' ||
                addonName == 'API Testing Framework' ||
                addonName == 'Object Types Editor' || //evgeny (2/11/22)
                addonName == 'WebApp Platform' || //evgeny
                addonName == 'ADAL' || //evgeny
                addonName == 'Data Index Framework' || //evgeny
                addonName == 'system_health' || //evgeny
                addonName == 'Cross Platform Engine' || //evgeny
                addonName == 'WebApp API Framework' || // 8/5/23: CPAS MUST ALWAYS BE SENT WITH FULL VERSION (xx.xx.xx)
                addonName == 'Relations Framework' || // evgeny 4/12/23: done to be able to test latest relation fw version
                addonName == 'Pepperitest (Jenkins Special Addon) - Code Jobs' || // evgeny 6/12: trying to fix wiered jenkins issue
                addonName == 'Audit Log' || // evgeny 13/12/23: newest audit to fix SB
                addonName == 'Async Task Execution' || // evgeny 3/3/24: async versions barely get phased (they do but after lots of time in 'available testing') - so its better to get latest available ASAP
                addonName == 'Notification Service' || // evgeny 15/1/23: to get newest PNS we have
                addonName == 'Export and Import Framework' ||
                addonName == 'Export and Import Framework (DIMX)' || // evgeny 15/1/23: to get newest DIMX
                addonName == 'sync' || //new sync addons
                addonName == 'Core Data Source Interface' || //new sync addons
                addonName == 'Core Resources' || //new sync addons
                addonName == 'Nebula' || //new sync addons
                addonName == 'configurations' || //new sync addons
                addonName == 'File Service Framework' || //PFS needed for sync
                !isPhased
            ) {
                searchString = `AND Version Like '${version === '' ? '%' : version}' AND Available Like 1`;
            }
            // if (addonName == 'File Service Framework') {
            //     //because 1.0.2 works but 1.0.29 isnt - 1.0.2% = 1.0.29 (evgeny - 6/11)
            //     searchString = `AND Version Like '${version}' AND Available Like 1`;
            // }
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
            if (fetchVarResponse.Body.length > 0 && fetchVarResponse.Status == 200) {
                try {
                    varLatestVersion = fetchVarResponse.Body[0].Version;
                } catch (error) {
                    throw new Error(
                        `Get latest addon version failed: ${version}, Status: ${
                            varLatestVersion.Status
                        }, Error Message: ${JSON.stringify(fetchVarResponse.Error)} `,
                    );
                }
            } else if (fetchVarResponse.Body.length > 0 && fetchVarResponse.Status == 401) {
                throw new Error(
                    `Fetch Error - Verify The varKey, Status: ${fetchVarResponse.Status}, Error Message: ${fetchVarResponse.Error.title} `,
                );
            } else if (fetchVarResponse.Body.length > 0) {
                throw new Error(
                    `Get latest addon version failed: ${version}, Status: ${
                        fetchVarResponse.Status
                    }, Error Message: ${JSON.stringify(fetchVarResponse.Error)} `,
                );
            }
            if (varLatestVersion) {
                testData[addonName].push(varLatestVersion);
            } else {
                testData[addonName].push(version);
            }

            let varLatestValidVersion: string | undefined = varLatestVersion;
            if (fetchVarResponse.Body.length === 0) {
                varLatestValidVersion = undefined;
            }

            let upgradeResponse = await this.papiClient.addons.installedAddons
                .addonUUID(`${addonUUID}`)
                .upgrade(varLatestValidVersion);
            let auditLogResponse = await this.getAuditLogResultObjectIfValid(upgradeResponse.URI as string, 40);
            if (fetchVarResponse.Body.length === 0) {
                varLatestValidVersion = auditLogResponse.AuditInfo.ToVersion;
            }
            if (auditLogResponse.Status && auditLogResponse.Status.Name == 'Failure') {
                if (
                    auditLogResponse.AuditInfo.ErrorMessage.includes(
                        `is already working on version ${varLatestValidVersion}`,
                    )
                ) {
                    testData[addonName].push(changeType);
                    testData[addonName].push('Success');
                    testData[addonName].push(auditLogResponse.AuditInfo.ErrorMessage);
                } else if (auditLogResponse.AuditInfo.ErrorMessage.includes('does not installed!')) {
                    const installResponse = await this.papiClient.addons.installedAddons
                        .addonUUID(`${addonUUID}`)
                        .install(varLatestValidVersion);
                    const auditLogResponse = await this.getAuditLogResultObjectIfValid(
                        installResponse.URI as string,
                        40,
                    );
                    if (auditLogResponse.Status && auditLogResponse.Status.Name == 'Failure') {
                        testData[addonName].push(changeType);
                        testData[addonName].push(auditLogResponse.Status.Name);
                        testData[addonName].push(auditLogResponse.AuditInfo.ErrorMessage);
                    } else {
                        testData[addonName].push(changeType);
                        testData[addonName].push(String(auditLogResponse.Status?.Name));
                    }
                } else if (!auditLogResponse.AuditInfo.ErrorMessage.includes('is already working on newer version')) {
                    testData[addonName].push(changeType);
                    testData[addonName].push(auditLogResponse.Status.Name);
                    testData[addonName].push(auditLogResponse.AuditInfo.ErrorMessage);
                } else {
                    changeType = 'Downgrade';
                    upgradeResponse = await this.papiClient.addons.installedAddons
                        .addonUUID(`${addonUUID}`)
                        .downgrade(varLatestValidVersion as string);
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

    async getAddonLatestPhasedVersion(
        addonUUID: string,
        varKey: string,
    ): Promise<{ latestPhasedVersion: string; message: string }> {
        let latestPhasedVersion = '';
        let informativeMessage = `Latest phased version retrieved successfully`;
        const fetchVarResponse = await this.fetchStatus(
            `${this.client.BaseURL.replace(
                'papi-eu',
                'papi',
            )}/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1 AND Phased=1 &order_by=CreationDateTime DESC`,
            {
                method: `GET`,
                headers: {
                    Authorization: `Basic ${Buffer.from(varKey).toString('base64')}`,
                },
            },
        );
        if (fetchVarResponse.Body.length > 0 && fetchVarResponse.Status == 200) {
            try {
                latestPhasedVersion = fetchVarResponse.Body[0].Version;
            } catch (error) {
                console.error(error);
                informativeMessage = `Get latest phased version failed, Status: ${
                    fetchVarResponse.Status
                }, Error Message: ${JSON.stringify(fetchVarResponse.Error)} `;
            }
        } else if (fetchVarResponse.Body.length > 0 && fetchVarResponse.Status == 401) {
            informativeMessage = `Fetch Error - Verify The varKey, Status: ${fetchVarResponse.Status}, Error Message: ${fetchVarResponse.Error.title} `;
        } else if (fetchVarResponse.Body.length > 0) {
            informativeMessage = `Get latest phased version failed, Status: ${
                fetchVarResponse.Status
            }, Error Message: ${JSON.stringify(fetchVarResponse.Error)} `;
        }
        console.info(`Addon ${addonUUID} Latest Phased Version: `, JSON.stringify(latestPhasedVersion, null, 2));
        return { latestPhasedVersion: latestPhasedVersion || '', message: informativeMessage };
    }

    async getAddonsLatestAvailableVersion(
        addonUUID: string,
        varKey: string,
        version?: string,
    ): Promise<{ latestVersion: string; message: string }> {
        let latestVersion = '';
        let informativeMessage = `Latest available version ${
            version ? `that starts with ${version} ` : ''
        }retrieved successfully`;
        const searchString = `AND Version Like '${
            version === undefined || version === '' ? '%' : version
        }' AND Available Like 1`;
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
        if (fetchVarResponse.Body.length > 0 && fetchVarResponse.Status == 200) {
            try {
                latestVersion = fetchVarResponse.Body[0].Version;
            } catch (error) {
                console.error(error);
                informativeMessage = `Get latest addon version that starts with: ${version} failed, Status: ${
                    fetchVarResponse.Status
                }, Error Message: ${JSON.stringify(fetchVarResponse.Error)} `;
            }
        } else if (fetchVarResponse.Body.length > 0 && fetchVarResponse.Status == 401) {
            informativeMessage = `Fetch Error - Verify The varKey, Status: ${fetchVarResponse.Status}, Error Message: ${fetchVarResponse.Error.title} `;
        } else if (fetchVarResponse.Body.length > 0) {
            informativeMessage = `Get latest addon version that starts with: ${version} failed, Status: ${
                fetchVarResponse.Status
            }, Error Message: ${JSON.stringify(fetchVarResponse.Error)} `;
        }
        console.info(
            `Addon ${addonUUID} Latest Available Version${version ? `that starts with ${version} ` : ''}: `,
            JSON.stringify(latestVersion, null, 2),
        );
        return { latestVersion: latestVersion, message: informativeMessage };
    }

    //currently immplemented only for dev-tests: will get better with time
    async installLatestAvalibaleVersionOfAddon(varKey: string, testData: { [any: string]: string[] }) {
        const addonName = Object.entries(testData)[0][0];
        const addonUUID = testData[addonName][0];
        const addonVersion = testData[addonName][1];
        const searchString = `AND Version Like ${
            addonVersion !== '' && addonVersion !== '%'
                ? `'` + addonVersion + `'` + ' AND Available Like 1'
                : `'%' AND Available Like 1`
        }`;
        const fetchVarResponse = (
            await this.fetchStatus(
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
            )
        ).Body[0];
        const latestVersion = fetchVarResponse.Version;
        console.log(`Installing Version ${latestVersion} Of ${addonName} - ${addonUUID}`);
        const installObj = {};
        installObj[addonName] = [testData[addonName][0], latestVersion];
        return await this.areAddonsInstalledEVGENY(installObj);
    }

    async getLatestAvalibaleVersionOfAddon(varKey: string, testData: { [any: string]: string[] }) {
        const addonName = Object.entries(testData)[0][0];
        const addonUUID = testData[addonName][0];
        const searchString = `AND Version Like '%' AND Available Like 1`;
        const fetchVarResponse = (
            await this.fetchStatus(
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
            )
        ).Body[0];
        const latestVersion = fetchVarResponse.Version;
        return latestVersion;
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
                        }, Error Message: ${JSON.stringify(fetchResponse.Error)} `,
                    );
                }
            } else {
                throw new Error(
                    `Get latest addon version failed: ${version}, Status: ${
                        fetchResponse.Status
                    }, Error Message: ${JSON.stringify(fetchResponse.Error)} `,
                );
            }
            testData[addonName].push(LatestVersion);

            let upgradeResponse = await this.papiClient.addons.installedAddons
                .addonUUID(`${addonUUID}`)
                .upgrade(LatestVersion);
            let auditLogResponse = await this.getAuditLogResultObjectIfValid(upgradeResponse.URI as string, 90);
            if (auditLogResponse.Status && auditLogResponse.Status.Name == 'Failure') {
                if (!auditLogResponse.AuditInfo.ErrorMessage.includes('is already working on newer version')) {
                    //debugger;
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

    async changeToRequestedVersion(
        requested: {
            addonName: string;
            addonUUID: string;
            setToVersion?: string;
            setToLatestAvailable?: boolean;
            setToLatestPhased?: boolean;
        },
        varKey: string,
    ): Promise<{
        addonName: string;
        addonUUID: string;
        setToVersion?: string;
        setToLatestAvailable?: boolean;
        setToLatestPhased?: boolean;
        latestAvailableVersion?: string;
        latestPhasedVersion?: string;
        auditLogResponseChangeType?: string;
        auditLogResponseStatusName: string;
        auditLogResponseErrorMessage?: string;
    }> {
        const changeResponseObject = {
            ...requested,
            auditLogResponseStatusName: '',
        };
        if (requested.setToLatestPhased) {
            const phasedVersionResponse = await this.getAddonLatestPhasedVersion(requested.addonUUID, varKey);
            if (phasedVersionResponse.message === 'Latest phased version retrieved successfully') {
                changeResponseObject['latestPhasedVersion'] = phasedVersionResponse.latestPhasedVersion;
                const setToPhasedResponse = await this.setAddonToVersion(
                    requested.addonUUID,
                    phasedVersionResponse.latestPhasedVersion,
                );
                if (setToPhasedResponse.hasOwnProperty('changeType')) {
                    changeResponseObject['auditLogResponseChangeType'] = setToPhasedResponse['changeType'];
                }
                if (setToPhasedResponse.hasOwnProperty('status')) {
                    changeResponseObject.auditLogResponseStatusName = setToPhasedResponse['status'];
                }
                if (setToPhasedResponse.hasOwnProperty('errorMessage')) {
                    changeResponseObject['auditLogResponseErrorMessage'] = setToPhasedResponse['errorMessage'];
                }
            }
        } else if (requested.setToLatestAvailable) {
            const availableVersionResponse = await this.getAddonsLatestAvailableVersion(requested.addonUUID, varKey);
            if (availableVersionResponse.message.includes('retrieved successfully')) {
                changeResponseObject['latestAvailableVersion'] = availableVersionResponse.latestVersion;
                const setToLatestAvailableResponse = await this.setAddonToVersion(
                    requested.addonUUID,
                    availableVersionResponse.latestVersion,
                );
                if (setToLatestAvailableResponse.hasOwnProperty('changeType')) {
                    changeResponseObject['auditLogResponseChangeType'] = setToLatestAvailableResponse['changeType'];
                }
                if (setToLatestAvailableResponse.hasOwnProperty('status')) {
                    changeResponseObject.auditLogResponseStatusName = setToLatestAvailableResponse['status'];
                }
                if (setToLatestAvailableResponse.hasOwnProperty('errorMessage')) {
                    changeResponseObject['auditLogResponseErrorMessage'] = setToLatestAvailableResponse['errorMessage'];
                }
            }
        } else if (requested.setToVersion) {
            const setToVersionResponse = await this.setAddonToVersion(requested.addonUUID, requested.setToVersion);
            if (setToVersionResponse.hasOwnProperty('changeType')) {
                changeResponseObject['auditLogResponseChangeType'] = setToVersionResponse['changeType'];
            }
            if (setToVersionResponse.hasOwnProperty('status')) {
                changeResponseObject.auditLogResponseStatusName = setToVersionResponse['status'];
            }
            if (setToVersionResponse.hasOwnProperty('errorMessage')) {
                changeResponseObject['auditLogResponseErrorMessage'] = setToVersionResponse['errorMessage'];
            }
        }
        return changeResponseObject;
    }

    async changeSetOfAddonsToRequestedVersions(
        requestedArr: {
            addonName: string;
            addonUUID: string;
            setToVersion?: string;
            setToLatestAvailable?: boolean;
            setToLatestPhased?: boolean;
        }[],
        varKey: string,
    ): Promise<
        {
            addonName: string;
            addonUUID: string;
            setToVersion?: string;
            setToLatestAvailable?: boolean;
            setToLatestPhased?: boolean;
            latestAvailableVersion?: string;
            latestPhasedVersion?: string;
            auditLogResponseChangeType?: string;
            auditLogResponseStatusName: string;
            auditLogResponseErrorMessage?: string;
        }[]
    > {
        const changeSetResponse: {
            addonName: string;
            addonUUID: string;
            setToVersion?: string;
            setToLatestAvailable?: boolean;
            setToLatestPhased?: boolean;
            latestAvailableVersion?: string;
            latestPhasedVersion?: string;
            auditLogResponseChangeType?: string;
            auditLogResponseStatusName: string;
            auditLogResponseErrorMessage?: string;
        }[] = [];
        // const changeSetResponse = await Promise.all(requestedArr.map(async requested => {
        //     return await this.changeToRequestedVersion(requested, varKey)
        // }));
        for (let index = 0; index < requestedArr.length; index++) {
            const requested = requestedArr[index];
            const requestedChangeToRequestedVersionResponse = await this.changeToRequestedVersion(requested, varKey);
            changeSetResponse.push(requestedChangeToRequestedVersionResponse);
        }
        return changeSetResponse;
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
                    `${isSucsess ? ConsoleColors.FetchStatus : ConsoleColors.Information} `,
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
                console.error(`Error type: ${error.type}, ${error} `);
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

    async baseAddonVersionsInstallation(varPass: string, otherTestData?: any, isPhased?: boolean) {
        const isInstalledArr = await this.areAddonsInstalled(otherTestData ? otherTestData : testData);
        const chnageVersionResponseArr = await this.changeVersion(
            varPass,
            otherTestData ? otherTestData : testData,
            isPhased ? isPhased : false,
        );
        return { chnageVersionResponseArr: chnageVersionResponseArr, isInstalledArr: isInstalledArr };
    }

    async baseAddonVersionsInstallationNewSyncForCpiRegression(varPass: string, otherTestData?: any) {
        const isInstalledArr = await this.areAddonsInstalled(
            otherTestData ? otherTestData : testDataWithNewSyncForCpiRegression,
        );
        const chnageVersionResponseArr = await this.changeVersion(
            varPass,
            otherTestData ? otherTestData : testDataWithNewSyncForCpiRegression,
            true,
        );
        return { chnageVersionResponseArr: chnageVersionResponseArr, isInstalledArr: isInstalledArr };
    }

    async baseAddonVersionsInstallationNewSync(varPass: string, otherTestData?: any) {
        const isInstalledArr = await this.areAddonsInstalled(
            otherTestData ? otherTestData : testDataWithNewSyncAndNebula,
        );
        const chnageVersionResponseArr = await this.changeVersion(
            varPass,
            otherTestData ? otherTestData : testDataWithNewSyncAndNebula,
            true,
        );
        return { chnageVersionResponseArr: chnageVersionResponseArr, isInstalledArr: isInstalledArr };
    }

    async baseAddonVersionsInstallationNewSyncNoNebula(varPass: string, otherTestData?: any) {
        const isInstalledArr = await this.areAddonsInstalled(otherTestData ? otherTestData : testData);
        const chnageVersionResponseArr = await this.changeVersion(
            varPass,
            otherTestData ? otherTestData : testData,
            true,
        );
        return { chnageVersionResponseArr: chnageVersionResponseArr, isInstalledArr: isInstalledArr };
    }

    async setBaseAddonsToPhasedForE2E(varPass: string) {
        const addonsToSwitchToPhased = {};
        const systemAddons = await this.getSystemAddons();
        console.info('System Addons: ', JSON.stringify(systemAddons, null, 2));
        for (let index = 0; index < systemAddons.length; index++) {
            const sysAddon = systemAddons[index];
            const addonName = sysAddon.Name || '';
            const addonUUID = sysAddon.UUID || '';
            const phasedVersion = (await this.getAddonLatestPhasedVersion(addonUUID, varPass)) || '';
            addonsToSwitchToPhased[addonName] = [addonUUID, phasedVersion];
        }
        console.info(
            'List of Base Addons to Change to Latest Phased Version: ',
            JSON.stringify(addonsToSwitchToPhased, null, 2),
        );
        const chnageVersionResponseArr = await this.changeVersion(varPass, addonsToSwitchToPhased, true);
        return chnageVersionResponseArr;
    }

    async setToLatestPhasedVersion(varPass: string, otherTestData?: any) {
        const addonsToSwitchToPhased = {};
        const excludeAddons = ['cpi-node-automation'];
        const testedData = otherTestData ? Object.keys(otherTestData) : Object.keys(testData);
        for (let index = 0; index < testedData.length; index++) {
            const addonName = testedData[index];
            const addonUUID = otherTestData ? otherTestData[addonName][0] : testData[addonName][0];
            if (!excludeAddons.includes(addonName)) {
                const phasedVersion = (await this.getAddonLatestPhasedVersion(addonUUID, varPass)) || '';
                addonsToSwitchToPhased[addonName] = [addonUUID, phasedVersion];
            }
        }
        console.info(
            'List Of Addons To Change to Latest Phased Version: ',
            JSON.stringify(addonsToSwitchToPhased, null, 2),
        );
        const chnageVersionResponseArr = await this.changeVersion(varPass, addonsToSwitchToPhased, true);
        return chnageVersionResponseArr;
    }

    async setAddonToVersion(addonUUID: string, toVersion: string) {
        let changeType = '';
        const chnageVersionResponse = {};
        const theAddon = await this.papiClient.addons.installedAddons.addonUUID(addonUUID).get();
        if (theAddon.Version) {
            if (theAddon.Version < toVersion) {
                changeType = 'Upgrade';
                let upgradeResponse;
                let upgrade_AuditLogResponse;
                try {
                    upgradeResponse = await this.papiClient.addons.installedAddons
                        .addonUUID(addonUUID)
                        .upgrade(toVersion);
                    upgrade_AuditLogResponse = await this.getAuditLogResultObjectIfValid(
                        upgradeResponse.URI as string,
                        40,
                    );
                } catch (error) {
                    console.error(error);
                    const theError = error as Error;
                    chnageVersionResponse['changeType'] = changeType;
                    chnageVersionResponse['status'] = 'Failure';
                    chnageVersionResponse['errorMessage'] = theError.message;
                }
                if (upgrade_AuditLogResponse?.Status?.Name == 'Failure') {
                    if (
                        upgrade_AuditLogResponse.AuditInfo.ErrorMessage.includes(
                            `is already working on version ${toVersion}`,
                        )
                    ) {
                        chnageVersionResponse['changeType'] = changeType;
                        chnageVersionResponse['status'] = 'Success';
                        chnageVersionResponse['errorMessage'] = upgrade_AuditLogResponse.AuditInfo.ErrorMessage;
                    } else if (
                        !upgrade_AuditLogResponse.AuditInfo.ErrorMessage.includes('is already working on newer version')
                    ) {
                        chnageVersionResponse['changeType'] = changeType;
                        chnageVersionResponse['status'] = upgrade_AuditLogResponse.Status.Name;
                        chnageVersionResponse['errorMessage'] = upgrade_AuditLogResponse.AuditInfo.ErrorMessage;
                    } else if (upgrade_AuditLogResponse.AuditInfo.ErrorMessage.includes('does not installed!')) {
                        let installResponse;
                        let auditLogResponse;
                        try {
                            installResponse = await this.papiClient.addons.installedAddons
                                .addonUUID(`${addonUUID}`)
                                .install(toVersion);
                            auditLogResponse = await this.getAuditLogResultObjectIfValid(
                                installResponse.URI as string,
                                40,
                            );
                        } catch (error) {
                            console.error(error);
                            const theError = error as Error;
                            chnageVersionResponse['changeType'] = changeType;
                            chnageVersionResponse['status'] = 'Failure';
                            chnageVersionResponse['errorMessage'] = theError.message;
                        }
                        if (auditLogResponse.Status?.Name == 'Failure') {
                            chnageVersionResponse['changeType'] = changeType;
                            chnageVersionResponse['status'] = auditLogResponse.Status.Name;
                            chnageVersionResponse['errorMessage'] = auditLogResponse.AuditInfo.ErrorMessage;
                        } else {
                            chnageVersionResponse['changeType'] = changeType;
                            chnageVersionResponse['status'] = auditLogResponse.Status?.Name;
                        }
                    }
                }
            } else {
                changeType = 'Downgrade';
                let downgradeResponse;
                let downgrade_auditLogResponse;
                try {
                    downgradeResponse = await this.papiClient.addons.installedAddons
                        .addonUUID(addonUUID)
                        .downgrade(toVersion);
                    downgrade_auditLogResponse = await this.getAuditLogResultObjectIfValid(
                        downgradeResponse.URI as string,
                        40,
                    );
                } catch (error) {
                    console.error(error);
                    const theError = error as Error;
                    chnageVersionResponse['changeType'] = changeType;
                    chnageVersionResponse['status'] = 'Failure';
                    chnageVersionResponse['errorMessage'] = theError.message;
                }
                if (downgrade_auditLogResponse?.Status?.Name == 'Failure') {
                    if (
                        downgrade_auditLogResponse.AuditInfo.ErrorMessage.includes(
                            `is already working on version ${toVersion}`,
                        )
                    ) {
                        chnageVersionResponse['changeType'] = changeType;
                        chnageVersionResponse['status'] = 'Success';
                        chnageVersionResponse['errorMessage'] = downgrade_auditLogResponse.AuditInfo.ErrorMessage;
                    } else if (downgrade_auditLogResponse.AuditInfo.ErrorMessage.includes('does not installed!')) {
                        let installResponse;
                        let auditLogResponse;
                        try {
                            installResponse = await this.papiClient.addons.installedAddons
                                .addonUUID(`${addonUUID}`)
                                .install(toVersion);
                            auditLogResponse = await this.getAuditLogResultObjectIfValid(
                                installResponse.URI as string,
                                40,
                            );
                        } catch (error) {
                            console.error(error);
                            const theError = error as Error;
                            chnageVersionResponse['changeType'] = changeType;
                            chnageVersionResponse['status'] = 'Failure';
                            chnageVersionResponse['errorMessage'] = theError.message;
                        }
                        if (auditLogResponse.Status?.Name == 'Failure') {
                            chnageVersionResponse['changeType'] = changeType;
                            chnageVersionResponse['status'] = auditLogResponse.Status.Name;
                            chnageVersionResponse['errorMessage'] = auditLogResponse.AuditInfo.ErrorMessage;
                        } else {
                            chnageVersionResponse['changeType'] = changeType;
                            chnageVersionResponse['status'] = auditLogResponse.Status?.Name;
                        }
                    }
                }
            }
        } else {
            let installResponse;
            let install_auditLogResponse;
            try {
                installResponse = await this.papiClient.addons.installedAddons
                    .addonUUID(`${addonUUID}`)
                    .install(toVersion);
                install_auditLogResponse = await this.getAuditLogResultObjectIfValid(installResponse.URI as string, 40);
            } catch (error) {
                console.error(error);
                const theError = error as Error;
                chnageVersionResponse['changeType'] = changeType;
                chnageVersionResponse['status'] = 'Failure';
                chnageVersionResponse['errorMessage'] = theError.message;
            }
            if (install_auditLogResponse?.Status?.Name == 'Failure') {
                chnageVersionResponse['changeType'] = changeType;
                chnageVersionResponse['status'] = install_auditLogResponse.Status.Name;
                chnageVersionResponse['errorMessage'] = install_auditLogResponse.AuditInfo.ErrorMessage;
            } else {
                chnageVersionResponse['changeType'] = changeType;
                chnageVersionResponse['status'] = install_auditLogResponse.Status?.Name;
            }
        }
        return chnageVersionResponse;
    }

    // async setTestDataWithNewSyncToLatestPhasedVersion(varPass: string) {
    //     const addonsToSwitchToPhased = {};
    //     const testedData = Object.keys(testDataWithNewSync);
    //     for (let index = 0; index < testedData.length; index++) {
    //         const addonName = testedData[index];
    //         const addonUUID = testDataWithNewSync[addonName][0];
    //         const phasedVersion = (await this.getAddonLatestPhasedVersion(addonUUID, varPass)) || '';
    //         addonsToSwitchToPhased[addonName] = [addonUUID, phasedVersion];
    //     }
    //     console.info('List Of Addons To Change to Latest Phased Version: ', JSON.stringify(addonsToSwitchToPhased, null, 2));
    //     const chnageVersionResponseArr = await this.changeVersion(
    //         varPass,
    //         addonsToSwitchToPhased,
    //         true,
    //     );
    //     return chnageVersionResponseArr;
    // }

    // async sendResultsToMonitoringAddon(userName: string, testName: string, testStatus: string, env: string) {
    //     const addonsSK = this.getSecret()[1];
    //     const testingAddonUUID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
    //     const current = new Date();
    //     const time = current.toLocaleTimeString();
    //     const body = {
    //         Name: `${ testName }_${ time } `, //param:addon was tested (test name)
    //         Description: `Running on: ${ userName } - ${ env } `, //param: version of the addon
    //         Status: testStatus, //param is passing
    //         Message: 'evgeny', //param link to Jenkins
    //         NotificationWebhook: '',
    //         SendNotification: '',
    //     };
    //     // const monitoringResult = await this.fetchStatus('/system_health/notifications', {
    //     //     method: 'POST',
    //     //     headers: {
    //     //         'X-Pepperi-SecretKey': addonsSK,
    //     //         'X-Pepperi-OwnerID': testingAddonUUID,
    //     //     },
    //     //     body: JSON.stringify(body),
    //     // });
    //     return {};
    //     //except(monitoringResult.Ok).to.equal(true);
    //     //except(monitoringResult.Status).to.equal(200);
    //     //except(monitoringResult.Error).to.equal({});
    // }

    reportResults(testResultsObj, testedAddonObject) {
        debugger;
        console.log('Did Test Pass: ' + (testResultsObj.failures.length === 0 ? 'True √' : 'False X'));
        // console.log('Total Failures: ' + testResultsObj.failures.length);
        // console.log('Total Passes: ' + testResultsObj.passes.length);
        //1. run on all suites
        for (let index1 = 0; index1 < testResultsObj.results[0].suites.length; index1++) {
            const testSuite = testResultsObj.results[0].suites[index1];
            for (let index2 = 0; index2 < testSuite.tests.length; index2++) {
                const test = testSuite.tests[index2];
                const testTitle = test.fullTitle.split(':').join(' - ');
                if (
                    testTitle.includes('TestDataStartTestServerTimeAndDate') ||
                    testTitle.includes('TestDataTestedUser') ||
                    testTitle.includes('Test Data Start Test Server Time And Date') ||
                    testTitle.includes('Test Data Tested User')
                ) {
                    console.log(`*  ${testTitle}`);
                } else if (
                    testTitle.includes('Test Data Test Prerequisites') ||
                    testTitle.includes('TestDataTestPrerequisites')
                ) {
                    for (let index3 = 0; index3 < testSuite.suites[0].tests.length; index3++) {
                        const installResponse = testSuite.suites[0].tests[index3];
                        console.log(`${index3 + 1}.  ${installResponse.fullTitle.split('Versions')[1]}`);
                    }
                    console.log(`Tested Addon: ${testedAddonObject.Addon.Name} Version: ${testedAddonObject.Version}`);
                } else {
                    console.log(`${test.pass ? '√' : '𝑥'}  ${testTitle}: ${test.pass ? 'Passed' : 'Failed'}`);
                }
            }
        }
    }

    reportResults2(testResultsObj, testedAddonObject) {
        let didpass = true;
        if (!testResultsObj.title.includes('Test Data')) {
            console.log(`Tested Addon: ${testedAddonObject.Addon.Name} Version: ${testedAddonObject.Version}`);
            console.log(`Test Suite: ${testResultsObj.title}`);
            if (testResultsObj.failures) {
                console.log('Total Failures: ' + testResultsObj.failures.length);
            } else {
                if (testResultsObj.passed) didpass = true;
                else didpass = false;
            }
            if (testResultsObj.passes) {
                console.log('Total Passes: ' + testResultsObj.passes.length);
            } else {
                if (testResultsObj.passed) didpass = true;
                else didpass = false;
            }
            console.log('Did Test Pass: ' + `${didpass ? 'True √' : 'False X'}`);
            console.log(' ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ');
        }
        if (testResultsObj.tests)
            for (let index = 0; index < testResultsObj.tests.length; index++) {
                const test = testResultsObj.tests[index];
                if (
                    test.fullTitle.includes('TestDataStartTestServerTimeAndDate') ||
                    test.fullTitle.includes('TestDataTestedUser') ||
                    test.fullTitle.includes('Test Data Start Test Server Time And Date') ||
                    test.fullTitle.includes('Test Data Tested User')
                ) {
                    console.log(`*  ${test.fullTitle}`);
                } else {
                    if (test.pass) {
                        console.log(`√ ${test.fullTitle}: passed\n`);
                    } else {
                        console.log(
                            `𝑥 ${test.fullTitle}: failed, on: ${test.err === undefined ? '' : test.err.message}\n`,
                        );
                    }
                }
            }
        // for (let index1 = 0; index1 < testResultsObj.results[0].suites.length; index1++) {
        //     const testSuite = testResultsObj.results[0].suites[index1];
        //     for (let index2 = 0; index2 < testSuite.tests.length; index2++) {
        //         const test = testSuite.tests[index2];
        //         const testTitle = test.fullTitle.split(':').join(' - ');
        //         if (
        //             testTitle.includes('TestDataStartTestServerTimeAndDate') ||
        //             testTitle.includes('TestDataTestedUser') ||
        //             testTitle.includes('Test Data Start Test Server Time And Date') ||
        //             testTitle.includes('Test Data Tested User')
        //         ) {
        //             console.log(`*  ${testTitle}`);
        //         } else if (
        //             testTitle.includes('Test Data Test Prerequisites') ||
        //             testTitle.includes('TestDataTestPrerequisites')
        //         ) {
        //             for (let index3 = 0; index3 < testSuite.suites[0].tests.length; index3++) {
        //                 const installResponse = testSuite.suites[0].tests[index3];
        //                 console.log(`${index3 + 1}.  ${installResponse.fullTitle.split('Versions')[1]}`);
        //             }
        //             console.log(`Tested Addon: ${testedAddonObject.Addon.Name} Version: ${testedAddonObject.Version}`);
        //         } else {
        //             console.log(`${test.pass ? '√' : '𝑥'}  ${testTitle}: ${test.pass ? 'Passed' : 'Failed'}`);
        //         }
        //     }
        // }
    }

    async handleTeamsURL(addonName, email, pass) {
        //-->eb26afcd-3cf2-482e-9ab1-b53c41a6adbe
        // handle teams URL for reporting of cicd - evgeny: add new addons here
        switch (addonName) {
            case 'QA':
                return await this.getSecretfromKMS(email, pass, 'QAWebHook');
            case 'ASSETS_MANAGER_CLIENT':
            case 'ASSETS MANAGER':
            case 'ASSETS-MANAGER':
            case 'ASSETS':
                return await this.getSecretfromKMS(email, pass, 'AssetsManagerWebHook');
            case 'SYNC-SCHEDULER':
            case 'SYNC SCHEDULER':
                return await this.getSecretfromKMS(email, pass, 'SyncSchedulerWebHook');
            case 'SUPPORT-TOOLS':
            case 'SUPPORT TOOLS':
                return await this.getSecretfromKMS(email, pass, 'SupportToolsWebHook');
            case 'KMS':
                return await this.getSecretfromKMS(email, pass, 'KMSTeamsWebHook');
            case 'PAGE-BUILDER':
            case 'PAGE BUILDER':
            case 'PAGE':
            case 'PAGES':
            case 'PAGE-BUILDER':
                return await this.getSecretfromKMS(email, pass, 'PageBuilderTeamsWebHook');
            case 'PAPI-DATA-INDEX':
            case 'PAPI INDEX': //evgeny todo
                return await this.getSecretfromKMS(email, pass, 'PapiDataIndexWebHook');
            case 'JOURNEY':
            case 'JOURNEY-TRACKER':
                return await this.getSecretfromKMS(email, pass, 'JourneyTeamsWebHook');
            case 'SYNC':
                return await this.getSecretfromKMS(email, pass, 'SyncTeamsWebHook');
            case 'ADAL':
                return await this.getSecretfromKMS(email, pass, 'ADALTeamsWebHook');
            case 'NEBULA':
            case 'FEBULA':
                return await this.getSecretfromKMS(email, pass, 'NebulaTeamsWebHook');
            case 'NEBULUS':
                return await this.getSecretfromKMS(email, pass, 'NebulusTeamsWebHook');
            case 'DIMX':
                return await this.getSecretfromKMS(email, pass, 'DIMXTeamsWebHook');
            case 'DATA INDEX':
            case 'DATA-INDEX':
                return await this.getSecretfromKMS(email, pass, 'DataIndexTeamsWebHook');
            case 'PFS':
            case 'PEPPERI-FILE-STORAGE':
                return await this.getSecretfromKMS(email, pass, 'PFSTeamsWebHook');
            case 'PNS':
                return await this.getSecretfromKMS(email, pass, 'PNSTeamsWebHook');
            case 'USER-DEFINED-COLLECTIONS':
            case 'UDC':
                return await this.getSecretfromKMS(email, pass, 'UDCTeamsWebHook');
            case 'SCHEDULER':
                return await this.getSecretfromKMS(email, pass, 'SchedulerTeamsWebHook');
            case 'CPI-DATA':
            case 'CPI DATA':
            case 'ADDONS-CPI-DATA':
                return await this.getSecretfromKMS(email, pass, 'CPIDataTeamsWebHook');
            case 'CORE':
            case 'CORE-GENERIC-RESOURCES':
                return await this.getSecretfromKMS(email, pass, 'CORETeamsWebHook');
            case 'RESOURCE-LIST':
            case 'RESOURCE LIST':
                return await this.getSecretfromKMS(email, pass, 'ResourceListTeamsWebHook');
            case 'UDB':
            case 'USER DEFINED BLOCKS':
                return await this.getSecretfromKMS(email, pass, 'UDBTeamsWebHook');
            case 'CONFIGURATIONS':
                return await this.getSecretfromKMS(email, pass, 'CONFIGURATIONSTeamsWebHook');
            case 'RELATED-ITEMS':
                return await this.getSecretfromKMS(email, pass, 'RelatedItemsTeamsWebHook');
            case 'GENERIC-RESOURCE':
            case 'GENERIC RESOURCE':
                return await this.getSecretfromKMS(email, pass, 'GenericResourceTeamsWebHook');
            case 'NODE':
            case 'CPI-NODE':
                return await this.getSecretfromKMS(email, pass, 'CPINodeTeamsWebHook');
            case 'CRAWLER':
                return await this.getSecretfromKMS(email, pass, 'CRAWLERTeamsWebHook');
            case 'ASYNCADDON':
                return await this.getSecretfromKMS(email, pass, 'ASYNCTeamsWebHook');
            case 'TRANSLATION':
                return await this.getSecretfromKMS(email, pass, 'TRANSLATIONTeamsWebHook');
            case 'PUSH-NOTIFICATIONS':
                return await this.getSecretfromKMS(email, pass, 'PushNotificationsTeamsWebHook');
        }
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
     * This uses the var endpoint, this is why this have to get varKey
     * @param addonUUID
     * @param varKey this have to from the api or the cli that trigger this process
     * @returns
     */
    async getSecretKey(addonUUID: string, varKey: string): Promise<string> {
        const updateVersionResponse = await this.fetchStatus(
            this['client'].BaseURL.replace('papi-eu', 'papi') + `/var/addons/${addonUUID}/secret_key`,
            {
                method: `GET`,
                headers: {
                    Authorization: `Basic ${Buffer.from(varKey).toString('base64')}`,
                },
            },
        );
        return updateVersionResponse.Body.SecretKey;
    }

    async generateFileE2EFolder(tempFileName, data) {
        const filePath = path.join(__dirname, '..', 'ui-tests', 'test-data', tempFileName);
        try {
            fs.writeFileSync(filePath, data, 'utf-8');
        } catch (error) {
            throw new Error(`Error: ${(error as any).message}`);
        }
    }

    async generateFileServerSideFolder(tempFileName, data) {
        const filePath = path.join(__dirname, '..', 'api-tests', 'test-data', tempFileName);
        try {
            fs.writeFileSync(filePath, data, 'utf-8');
        } catch (error) {
            throw new Error(`Error: ${(error as any).message}`);
        }
    }

    convertArrayOfObjectsToPFSTempFile(arrayOfObjects: Record<string, unknown>[]) {
        return this.turnJsonObjectToCSVTextualObjectArray(arrayOfObjects[1], arrayOfObjects);
    }

    turnJsonObjectToCSVTextualObjectArray(jsonObject: Record<string, unknown>, actualArray: Record<string, unknown>[]) {
        let csvTextualObject = '';
        const jsonObjKeys = Object.keys(jsonObject);
        //1. validate all keys are the same across object
        for (let index = 0; index < actualArray.length; index++) {
            const jsonFromArray = actualArray[index];
            const keys = Object.keys(jsonFromArray);
            for (let index = 0; index < keys.length; index++) {
                const keyFromJson = keys[index];
                if (keyFromJson !== jsonObjKeys[index]) {
                    throw new Error(
                        `Error: Keys are not the same across JSON: ${keyFromJson} != ${jsonObjKeys[index]}`,
                    );
                }
            }
        }
        //2. add CSV's keys
        csvTextualObject += jsonObjKeys + ',Hidden' + '\n';
        //3. add all values
        for (let index = 0; index < actualArray.length; index++) {
            const jsonElement = actualArray[index];
            const jsonValues = Object.values(jsonElement);
            for (let index = 0; index < jsonValues.length; index++) {
                const csvRow = jsonValues[index];
                csvTextualObject += csvRow + ',';
            }
            csvTextualObject += 'false' + '\n';
        }
        return csvTextualObject;
    }

    async createCSVFile(
        fileName: string,
        howManyDataRows: number,
        headers: string,
        keyData: string,
        valueData: string[],
        isHidden: string,
        serverSide?: boolean,
    ) {
        if (!fileName.includes('.csv')) {
            fileName += '.csv';
        }
        let strData = '';
        strData += headers + ',Hidden' + '\n';
        for (let index = 0; index < howManyDataRows; index++) {
            if (keyData !== '') strData += `${keyData.replace('index', index.toString())},`;
            for (let index1 = 0; index1 < valueData.length; index1++) {
                const value = valueData[index1];
                strData += `${value.includes('index') ? value.replace('index', index.toString()) : value},`;
            }
            strData += `${isHidden}\n`;
        }
        if (serverSide) {
            await this.generateFileServerSideFolder(fileName, strData);
        } else {
            await this.generateFileE2EFolder(fileName, strData);
        }
    }

    readFileE2ELocation(fileName: string) {
        const filePath = path.join(__dirname, '..', 'ui-tests', 'test-data', fileName);
        const buf1 = fs.readFileSync(filePath);
        return buf1;
    }

    readFileServeSideLocation(fileName: string) {
        const filePath = path.join(__dirname, '..', 'api-tests', 'test-data', fileName);
        const buf1 = fs.readFileSync(filePath);
        return buf1;
    }

    async createCSVFileForAccountsInfo(
        fileName: string,
        howManyDataRows: number,
        howManyComapnies: number,
        howManyDivisions: number,
        headers: string,
        keyData: string,
        valueData: string[],
        isHidden: string,
    ) {
        if (!fileName.includes('.csv')) {
            fileName += '.csv';
        }
        let strData = '';
        strData += headers + ',Hidden' + '\n';
        let companyIndex = 0;
        let divisionIndex = 0;
        for (let index = 0; index < howManyDataRows; index++) {
            if (keyData !== '') strData += `${keyData.replace('index', index.toString())},`;
            for (let index1 = 0; index1 < valueData.length; index1++) {
                const value = valueData[index1];
                if (value.includes('company')) {
                    if (companyIndex === howManyComapnies) {
                        companyIndex = 0;
                        strData += `${
                            value.includes('index') ? value.replace('index', companyIndex.toString()) : value
                        },`;
                        companyIndex++;
                    } else {
                        strData += `${
                            value.includes('index') ? value.replace('index', companyIndex.toString()) : value
                        },`;
                        companyIndex++;
                    }
                } else if (value.includes('division')) {
                    if (divisionIndex === howManyDivisions) {
                        divisionIndex = 0;
                        strData += `${
                            value.includes('index') ? value.replace('index', divisionIndex.toString()) : value
                        },`;
                        divisionIndex++;
                    } else {
                        strData += `${
                            value.includes('index') ? value.replace('index', divisionIndex.toString()) : value
                        },`;
                        divisionIndex++;
                    }
                } else {
                    strData += `${value.includes('index') ? value.replace('index', index.toString()) : value},`;
                }
            }
            strData += `${isHidden}\n`;
        }
        await this.generateFileE2EFolder(fileName, strData);
    }

    generateRandomString(length: number): string {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }
        return result;
    }

    async executeScriptFromTestData(scriptName: string): Promise<void> {
        await execFileSync(`${__dirname.split('services')[0]}api - tests\\test - data\\${scriptName} `);
        return;
    }

    convertNameToUUIDForDevTests(addonName: string) {
        switch (addonName) {
            case 'UDB':
            case 'USER DEFINED BLOCKS':
                return '9abbb634-9df5-49ab-91d1-41ad7a2632a6';
            case 'ADAL':
                return '00000000-0000-0000-0000-00000000ada1';
            case 'DATA INDEX':
            case 'DATA-INDEX':
                return '00000000-0000-0000-0000-00000e1a571c';
            case 'NEBULA':
                return '00000000-0000-0000-0000-000000006a91';
            case 'FEBULA':
                return 'cebb251f-1c80-4d80-b62c-442e48e678e8';
            case 'SYNC':
                return '5122dc6d-745b-4f46-bb8e-bd25225d350a';
            case 'CORE':
            case 'CORE-GENERIC-RESOURCES':
                return 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f';
            case 'CONFIGURATIONS':
                return '84c999c3-84b7-454e-9a86-71b7abc96554';
            case 'RELATED-ITEMS':
                return '4f9f10f3-cd7d-43f8-b969-5029dad9d02b';
            case 'PEPPERI-FILE-STORAGE':
            case 'PFS':
                return '00000000-0000-0000-0000-0000000f11e5';
            case 'JOURNEY':
            case 'JOURNEY-TRACKER':
                return '41011fbf-debf-40d8-8990-767738b8af03';
            case 'NODE':
            case 'CPI-NODE':
                return 'bb6ee826-1c6b-4a11-9758-40a46acb69c5';
            case 'CRAWLER':
                return 'f489d076-381f-4cf7-aa63-33c6489eb017';
            case 'ASYNCADDON':
                return '00000000-0000-0000-0000-0000000a594c';
            case 'TRANSLATION':
                return 'fbbac53c-c350-42c9-b9ad-17c238e55b42';
            default:
                return 'none';
        }
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

    replaceAll(string: string, searchValue: string, replaceValue: string) {
        const regex = new RegExp(searchValue, 'g');
        return string.replace(regex, replaceValue);
    }
}

function msSleep(ms: number) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

export interface TesterFunctions {
    describe: { (name: string, fn: () => any): any };
    expect: Chai.ExpectStatic;
    assert: Chai.AssertStatic;
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
        errorMessage.Header[`${headerTagsArr[index]} `] = headerTagsArr[index - 1];
    }
    for (let index = 1; index < bodyStrTagsArr.length; index += 2) {
        errorMessage.Body = {};
        errorMessage.Body[`${bodyStrTagsArr[index]} `] = bodyStrTagsArr[index - 1];
    }
    return errorMessage;
}

async function getToken(email: any, pass: any, env) {
    const urlencoded = new URLSearchParams();
    urlencoded.append('username', email);
    urlencoded.append('password', pass);
    urlencoded.append('scope', 'pepperi.apint pepperi.wacd offline_access');
    urlencoded.append('grant_type', 'password');
    urlencoded.append('client_id', 'ios.com.wrnty.peppery');

    const server = env;
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

export async function initiateTester(email, pass, env): Promise<Client> {
    const token = await getToken(email, pass, env);
    return createClient(token.access_token);
}

function createClient(authorization) {
    if (!authorization) {
        throw new Error('Error unauthorized');
    }
    const token = authorization.replace('Bearer ', '') || '';
    const parsedToken = jwt_decode(token);
    const [AddonUUID, sk] = getSecret();

    return {
        AddonUUID: AddonUUID,
        AddonSecretKey: sk,
        BaseURL: parsedToken['pepperi.baseurl'],
        OAuthAccessToken: token,
        AssetsBaseUrl: 'http://localhost:4400/publish/assets',
        Retry: function () {
            return;
        },
        ValidatePermission: async (policyName) => {
            await this.validatePermission(policyName, token, parsedToken['pepperi.baseurl']);
        },
    } as Client;
}

function getSecret() {
    const addonUUID = JSON.parse(fs.readFileSync('../addon.config.json', { encoding: 'utf8', flag: 'r' }))['AddonUUID'];
    let sk;
    try {
        sk = fs.readFileSync('../var_sk', { encoding: 'utf8', flag: 'r' });
    } catch (error) {
        console.log(`%cSK Not found: ${error}`, ConsoleColors.SystemInformation);
        sk = '00000000-0000-0000-0000-000000000000';
    }
    return [addonUUID, sk];
}
