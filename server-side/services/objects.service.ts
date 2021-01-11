import { PapiClient, Account, ApiFieldObject, GeneralActivity, Transaction } from '@pepperi-addons/papi-sdk';

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

export class ObjectsService {
    constructor(public papiClient: PapiClient) {}

    getItems() {
        return this.papiClient.get('/items');
    }

    getContacts(InternalID) {
        return this.papiClient.get('/contacts?where=InternalID=' + InternalID);
    }

    createContact(body: any) {
        return this.papiClient.post('/contacts', body);
    }

    deleteContact(InternalID) {
        return this.papiClient.delete('/contacts/' + InternalID)
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
        return this.papiClient.delete('/transaction_lines/' + InternalID)
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
