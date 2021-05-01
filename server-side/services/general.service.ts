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
type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

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

    sleep(ms: number) {
        const start = new Date().getTime(),
            expire = start + ms;
        while (new Date().getTime() < expire) {}
        return;
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

    async getAuditLogResultObjectIfValid(URI, loopsAmount?) {
        let auditLogResponse = await this.papiClient.get(URI);
        auditLogResponse = auditLogResponse[0] === undefined ? auditLogResponse : auditLogResponse[0];

        //This loop is used for cases where AuditLog was not created at all (This can happen and it is valid)
        if (auditLogResponse.UUID.length < 10 || !JSON.stringify(auditLogResponse).includes('AuditInfo')) {
            console.log('Retray - No Audit Log found');
            let retrayGetCall = loopsAmount + 2;
            do {
                this.sleep(800);
                auditLogResponse = await this.papiClient.get(URI);
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
                setTimeout(async () => {
                    auditLogResponse = await this.papiClient.get(URI);
                }, 2000);
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
                    auditLogResponse.Event.Type != 'sync') ||
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
        for (const addonName in testData) {
            let isInstalled = false;
            for (let i = 0; i < installedAddonsArr.length; i++) {
                if (installedAddonsArr[i].Addon !== null) {
                    if (installedAddonsArr[i].Addon.Name == addonName) {
                        isInstalled = true;
                        break;
                    }
                }
            }
            if (!isInstalled) {
                await this.papiClient.addons.installedAddons.addonUUID(`${testData[addonName][0]}`).install();
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
            if (addonName == 'Services Framework' || addonName == 'Cross Platforms API' || !isPhased) {
                searchString = `AND Version Like '${version}%' AND Available Like 1`;
            }
            let varLatestVersion;
            try {
                varLatestVersion = await fetch(
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
                ).then((response) => response.json());
            } catch (error) {
                throw new Error(`Fetch Error - Verify The varKey, error: ${error}`);
            }
            try {
                varLatestVersion = varLatestVersion[0].Version;
            } catch (error) {
                throw new Error(`No Version That Start With: ${version}, error: ${error}`);
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

    fetchStatus(method: HttpMethod, URI: string, body?: any, timeout?: number, size?: number) {
        const start = performance.now();
        return fetch(`${this['client'].BaseURL}${URI}`, {
            method: `${method}`,
            body: JSON.stringify(body),
            headers: {
                Authorization: `Bearer ${this.papiClient['options'].token}`,
            },
            timeout: timeout,
            size: size,
        })
            .then(async (response) => {
                const end = performance.now();
                console.log(
                    `Fetch ${method}:`,
                    this['client'].BaseURL + URI,
                    'took',
                    (end - start).toFixed(2),
                    'milliseconds',
                );
                return {
                    Status: response.status,
                    Body: await response.text(),
                };
            })
            .then((res) => {
                res.Body = res.Body ? JSON.parse(res.Body) : '';
                return {
                    Status: res.Status,
                    Size: res.Body.length,
                    Body: res.Body as any,
                };
            })
            .catch((err) => {
                const end = performance.now();
                console.error(
                    `Error - Fetch ${method}:`,
                    this['client'].BaseURL + URI,
                    'took',
                    (end - start).toFixed(2),
                    'milliseconds',
                );
                console.error(`Error Message: ${err}`);
                return {
                    Status: null,
                    Size: null,
                    Body: null,
                    Error: err,
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
