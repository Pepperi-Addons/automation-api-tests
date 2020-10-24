import { PapiClient, InstalledAddon, Catalog } from '@pepperi-addons/papi-sdk';
import { Client } from '@pepperi-addons/debug-server';

declare type ClientData =
    | 'UserEmail'
    | 'UserName'
    | 'UserID'
    | 'UserUUID'
    | 'DistributorID'
    | 'DistributorUUID'
    | 'Server';

const UserDataObject = {
    UserEmail: 'email',
    UserName: 'name',
    UserID: 'pepperi.id',
    UserUUID: 'pepperi.useruuid',
    DistributorID: 'pepperi.distributorid',
    DistributorUUID: 'pepperi.distributoruuid',
    Server: 'pepperi.datacenter',
};

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

export default class GeneralService {
    papiClient: PapiClient;

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
        });
    }

    sleep = function (ms) {
        const start = new Date().getTime(),
            expire = start + ms;
        while (new Date().getTime() < expire) {}
        return;
    };

    //#region getDate
    getTime = function () {
        const getDate = new Date();
        return (
            getDate.getHours().toString().padStart(2, '0') +
            ':' +
            getDate.getMinutes().toString().padStart(2, '0') +
            ':' +
            getDate.getSeconds().toString().padStart(2, '0')
        );
    };

    getDate = function () {
        const getDate = new Date();
        return (
            getDate.getDate().toString().padStart(2, '0') +
            '/' +
            (getDate.getMonth() + 1).toString().padStart(2, '0') +
            '/' +
            getDate.getFullYear().toString().padStart(4, '0')
        );
    };
    //#endregion getDate

    getServer() {
        return this.client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
    }

    getClientData(data: ClientData): string {
        return parseJwt(this.client.OAuthAccessToken)[UserDataObject[data]];
    }

    getAddons(): Promise<InstalledAddon[]> {
        return this.papiClient.addons.installedAddons.find({});
    }

    getCatalogs(): Promise<Catalog[]> {
        return this.papiClient.catalogs.find({});
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
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        Buffer.from(base64, 'base64')
            .toString()
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(''),
    );
    return JSON.parse(jsonPayload);
}

export interface TesterFunctions {
    describe: any;
    expect: any;
    it: any;
    run: any;
    setNewTestHeadline: any;
    addTestResultUnderHeadline: any;
    printTestResults: any;
}
