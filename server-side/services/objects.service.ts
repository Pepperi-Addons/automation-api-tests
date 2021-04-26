import {
    PapiClient,
    Account,
    ApiFieldObject,
    GeneralActivity,
    Transaction,
    UserDefinedTableMetaData,
    UserDefinedTableRow,
} from '@pepperi-addons/papi-sdk';
import jwt_decode from 'jwt-decode';
import fetch from 'node-fetch';

interface FindOptions {
    fields?: string[];
    where?: string;
    orderBy?: string;
    page?: number;
    page_size?: number;
    include_nested?: boolean;
    full_mode?: boolean;
    include_deleted?: boolean;
    is_distinct?: boolean;
}

const apiCallsInterval = 400;

export class ObjectsService {
    constructor(public papiClient: PapiClient) {}

    getItems() {
        return this.papiClient.get('/items');
    }

    getUsers(clause?) {
        switch (clause) {
            case undefined:
                return this.papiClient.get('/users');
            default:
                return this.papiClient.get('/users' + clause);
        }
    }

    createUser(body: any) {
        return this.papiClient.post('/CreateUser', body);
    }

    updateUser(body: any) {
        return this.papiClient.post('/users', body);
    }

    async getRepProfile() {
        const profiles = await this.papiClient.get('/profiles');
        for (const i in profiles) {
            if (profiles[i].Name == 'Rep') {
                return profiles[i];
            }
        }
    }

    getIDPurl() {
        const token = this.papiClient['options'].token;
        const decodedToken = jwt_decode(token);
        return decodedToken.iss;
    }

    async getSecurityGroup() {
        const idpBaseURL = await this.getIDPurl();
        const securityGroups = await fetch(idpBaseURL + '/api/securitygroups', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + this.papiClient['options'].token,
            },
        }).then((data) => data.json());
        return securityGroups;
    }

    getSingleUser(type, ID) {
        switch (type) {
            case 'UUID':
                return this.papiClient.get('/users/uuid/' + ID);
            case 'ExternalID':
                return this.papiClient.get('/users/externalid/' + ID);
            case 'InternalID':
                return this.papiClient.get('/users/' + ID);
        }
    }

    getDefaultCatalog() {
        return this.papiClient.get("/catalogs?where=ExternalID='Default Catalog'");
    }

    deleteUser(type, ID) {
        switch (type) {
            case 'UUID':
                return this.papiClient
                    .delete('/users/uuid/' + ID)
                    .then((res) => res.text())
                    .then((res) => (res ? JSON.parse(res) : ''));
            case 'ExternalID':
                return this.papiClient
                    .delete('/users/externalid/' + ID)
                    .then((res) => res.text())
                    .then((res) => (res ? JSON.parse(res) : ''));
            case 'InternalID':
                return this.papiClient
                    .delete('/users/' + ID)
                    .then((res) => res.text())
                    .then((res) => (res ? JSON.parse(res) : ''));
        }
    }

    getContacts(InternalID) {
        return this.papiClient.get('/contacts?where=InternalID=' + InternalID);
    }

    getBulk(type, clause) {
        return this.papiClient.get('/' + type + clause);
    }

    createContact(body: any) {
        return this.papiClient.post('/contacts', body);
    }

    connectAsBuyer(body: any) {
        return this.papiClient.post('/contacts/connectAsBuyer', body);
    }

    disconnectBuyer(body: any) {
        return this.papiClient.post('/contacts/DisconnectBuyer', body);
    }

    deleteContact(InternalID) {
        return this.papiClient
            .delete('/contacts/' + InternalID)
            .then((res) => res.text())
            .then((res) => (res ? JSON.parse(res) : ''));
    }

    getTransactionLines(InternalID) {
        return this.papiClient.get('/transaction_lines?where=TransactionInternalID=' + InternalID);
    }

    createTransactionLine(body: any) {
        return this.papiClient.post('/transaction_lines', body);
    }

    deleteTransactionLine(InternalID) {
        return this.papiClient
            .delete('/transaction_lines/' + InternalID)
            .then((res) => res.text())
            .then((res) => (res ? JSON.parse(res) : ''));
    }

    createActivity(body: GeneralActivity) {
        return this.papiClient.activities.upsert(body);
    }

    getActivity(options?: FindOptions) {
        return this.papiClient.activities.find(options);
    }

    deleteActivity(activityID: number) {
        return this.papiClient.activities.delete(activityID);
    }

    createTransaction(body: Transaction) {
        return this.papiClient.transactions.upsert(body);
    }

    getTransaction(options?: FindOptions) {
        return this.papiClient.transactions.find(options);
    }

    deleteTransaction(transactionID: number) {
        return this.papiClient.transactions.delete(transactionID);
    }

    bulkCreate(type: string, body: any) {
        return this.papiClient.post('/bulk/' + type + '/json', body);
    }

    getBulkJobInfo(ID) {
        return this.papiClient.get('/bulk/jobinfo/' + ID);
    }

    createAccount(body: Account) {
        return this.papiClient.accounts.upsert(body);
    }

    getAccounts(options?: FindOptions) {
        return this.papiClient.accounts.find(options);
    }

    getAllAccounts(options?: FindOptions) {
        return this.papiClient.accounts.iter(options).toArray();
    }

    deleteAccount(accountID: number) {
        return this.papiClient.accounts.delete(accountID);
    }

    sleep(ms) {
        const start = new Date().getTime(),
            expire = start + ms;
        while (new Date().getTime() < expire) {}
        return;
    }

    postUDTMetaData(body: UserDefinedTableMetaData): Promise<UserDefinedTableMetaData>{
        return this.papiClient.metaData.userDefinedTables.upsert(body);
    }

    getUDTMetaData(id: number){
        return this.papiClient.metaData.userDefinedTables.get(id);
    }

    postUDT(body: UserDefinedTableRow) {
        return this.papiClient.userDefinedTables.upsert(body);
    }

    getUDT(options?: FindOptions) {
        return this.papiClient.userDefinedTables.find(options);
    }

    deleteUDT(id: number) {
        return this.papiClient.userDefinedTables.delete(id);
    }

    deleteUDTMetaData(id: number) {
        return this.papiClient.metaData.userDefinedTables.delete(id);
    }

    async waitForBulkJobStatus(ID: number, maxTime: number) {
        const maxLoops = maxTime / (apiCallsInterval * 10);
        let counter = 0;
        let apiGetResponse;
        do {
            if (apiGetResponse != undefined) {
                this.sleep(apiCallsInterval * 10);
            }
            counter++;
            apiGetResponse = await this.getBulkJobInfo(ID);
        } while (
            (apiGetResponse.Status == 'Not Started' || apiGetResponse.Status == 'In Progress') &&
            counter < maxLoops
        );
        this.sleep(apiCallsInterval * 10);
        apiGetResponse = await this.getBulkJobInfo(ID);
        return apiGetResponse;
    }

    async getATD(type: string) {
        return await this.papiClient.metaData.type(type).types.get();
    }

    async findATDbyName(type: string, nameATD: string) {
        const ATDarr = await this.getATD(type);
        let ATD;
        for (let i = 0; i < ATDarr.length; i++) {
            if (ATDarr[i].ExternalID == nameATD) {
                ATD = ATDarr[i].TypeID;
                break;
            }
        }
        return ATD;
    }

    async createTSA(type: string, body: ApiFieldObject, ATD?: number) {
        if (type != 'accounts') {
            return await this.papiClient.metaData.type(type + '/types/' + ATD).fields.upsert(body);
        } else {
            return await this.papiClient.metaData.type(type).fields.upsert(body);
        }
    }

    async createBulkTSA(type: string, body: ApiFieldObject[], ATD?: number) {
        const resultArr: any[] = [];
        if (type != 'accounts' && ATD != undefined) {
            for (let i = 0; i < body.length; i++) {
                const tempResult = await this.papiClient.metaData.type(type + '/types/' + ATD).fields.upsert(body[i]);
                resultArr.push(tempResult.FieldID);
            }
        } else {
            for (let i = 0; i < body.length; i++) {
                const tempResult = await this.papiClient.metaData.type(type).fields.upsert(body[i]);
                resultArr.push(tempResult.FieldID);
            }
        }
        return resultArr;
    }

    async deleteBulkTSA(type: string, body: ApiFieldObject[], ATD?: number) {
        const resultArr: any[] = [];
        if (type != 'accounts' && ATD != undefined) {
            for (let i = 0; i < body.length; i++) {
                await this.papiClient.metaData.type(type).types.subtype(ATD.toString()).fields.delete(body[i].FieldID);
                resultArr.push(body[i].FieldID);
            }
        } else {
            for (let i = 0; i < body.length; i++) {
                await this.papiClient.metaData.type(type).fields.delete(body[i].FieldID);
                resultArr.push(body[i].FieldID);
            }
        }
        return resultArr;
    }
}
