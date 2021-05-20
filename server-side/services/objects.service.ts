import {
    PapiClient,
    Account,
    ApiFieldObject,
    GeneralActivity,
    Transaction,
    Item,
    TransactionLines,
    FindOptions,
    User,
    UserDefinedTableMetaData,
    UserDefinedTableRow,
    Catalog,
    Contact,
    BatchApiResponse,
} from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

const apiCallsInterval = 400;

export class ObjectsService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    getItems(options?: FindOptions): Promise<Item[]> {
        return this.papiClient.items.find(options);
    }

    getUsers(options?: FindOptions): Promise<User[]> {
        return this.papiClient.users.find(options);
    }

    createUser(body: User): Promise<User> {
        return this.papiClient.post('/CreateUser', body);
    }

    updateUser(body: User): Promise<User> {
        return this.papiClient.users.upsert(body);
    }

    async getRepProfile() {
        const profiles = await this.papiClient.get('/profiles');
        for (const i in profiles) {
            if (profiles[i].Name == 'Rep') {
                return profiles[i];
            }
        }
    }

    async getSecurityGroup(idpBaseURL: string) {
        const securityGroups = await this.generalService
            .fetchStatus(idpBaseURL + '/api/securitygroups', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + this.papiClient['options'].token,
                },
            })
            .then((res) => res.Body);
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

    getCatalogs(options?: FindOptions): Promise<Catalog[]> {
        return this.papiClient.catalogs.find(options);
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

    createContact(body: Contact): Promise<Contact> {
        return this.papiClient.contacts.upsert(body);
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

    getTransactionLines(options?: FindOptions): Promise<TransactionLines[]> {
        return this.papiClient.transactionLines.find(options);
    }

    getTransactionLinesByID(id: number): Promise<TransactionLines> {
        return this.papiClient.transactionLines.get(id);
    }

    createTransactionLine(body: TransactionLines): Promise<TransactionLines> {
        return this.papiClient.transactionLines.upsert(body);
    }

    deleteTransactionLine(id: number): Promise<boolean> {
        return this.papiClient.transactionLines.delete(id);
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

    getTransactionByID(transactionID: number): Promise<Transaction> {
        return this.papiClient.transactions.get(transactionID);
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

    createAccount(body: Account): Promise<Account> {
        return this.papiClient.accounts.upsert(body);
    }

    getAccountByID(accountID: number): Promise<Account> {
        return this.papiClient.accounts.get(accountID);
    }

    getAccounts(options?: FindOptions) {
        return this.papiClient.accounts.find(options);
    }

    countAccounts(options?): Promise<number> {
        return this.papiClient.accounts.count(options);
    }

    getAllAccounts(options?: FindOptions) {
        return this.papiClient.accounts.iter(options).toArray();
    }

    deleteAccount(accountID: number): Promise<boolean> {
        return this.papiClient.accounts.delete(accountID);
    }

    postUDTMetaData(body: UserDefinedTableMetaData): Promise<UserDefinedTableMetaData> {
        return this.papiClient.metaData.userDefinedTables.upsert(body);
    }

    getUDTMetaData(id: number): Promise<UserDefinedTableMetaData> {
        return this.papiClient.metaData.userDefinedTables.get(id);
    }

    postUDT(body: UserDefinedTableRow): Promise<UserDefinedTableRow> {
        return this.papiClient.userDefinedTables.upsert(body);
    }

    getUDT(options?: FindOptions): Promise<UserDefinedTableRow[]> {
        return this.papiClient.userDefinedTables.find(options);
    }

    postBatchUDT(body: UserDefinedTableRow[]): Promise<BatchApiResponse[]> {
        return this.papiClient.userDefinedTables.batch(body);
    }

    postBatchAccount(body: Account[]): Promise<BatchApiResponse[]> {
        return this.papiClient.accounts.batch(body);
    }

    createBulkArray(amount, exID) {
        const bulkArray = [] as any;
        for (let i = 0; i < amount; i++) {
            bulkArray.push([exID + ' ' + i, 'Bulk Account ' + i]);
        }
        return bulkArray;
    }

    updateBulkArray(array) {
        for (let i = 0; i < array.length; i++) {
            array[i][1] += ' Update';
        }
        return array;
    }

    addHiddenBulkArray(array) {
        for (let i = 0; i < array.length; i++) {
            array[i].push('1');
        }
        return array;
    }

    deleteUDT(id: number): Promise<boolean> {
        return this.papiClient.userDefinedTables.delete(id);
    }

    deleteUDTMetaData(id: number): Promise<boolean> {
        return this.papiClient.metaData.userDefinedTables.delete(id);
    }

    async waitForBulkJobStatus(ID: number, maxTime: number) {
        const maxLoops = maxTime / (apiCallsInterval * 10);
        let counter = 0;
        let apiGetResponse;
        do {
            if (apiGetResponse != undefined) {
                this.generalService.sleep(apiCallsInterval * 10);
            }
            counter++;
            apiGetResponse = await this.getBulkJobInfo(ID);
        } while (
            (apiGetResponse.Status == 'Not Started' || apiGetResponse.Status == 'In Progress') &&
            counter < maxLoops
        );
        this.generalService.sleep(apiCallsInterval * 10);
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
