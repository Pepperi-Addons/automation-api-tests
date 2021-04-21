import { PapiClient, DataView, FindOptions, User, Item, Transaction, Account } from '@pepperi-addons/papi-sdk';

export class CPINodeService {
    constructor(public papiClient: PapiClient) {}

    getDataViewByID(id: number) {
        return this.papiClient.metaData.dataViews.get(id);
    }

    getDataViews(options?: FindOptions) {
        return this.papiClient.metaData.dataViews.find(options);
    }

    getAllDataViews(options?: FindOptions) {
        return this.papiClient.metaData.dataViews.iter(options).toArray();
    }

    postDataView(dataView: DataView) {
        return this.papiClient.metaData.dataViews.upsert(dataView);
    }

    postDataViewBatch(dataViewArr: DataView[]) {
        return this.papiClient.metaData.dataViews.batch(dataViewArr);
    }

    getDorIsAwesome() {
        return 'CoolCoolCoolCoolCoolCoolCoolCoolCoolCoolCoolCoolCoolCoolCool';
    }

    findUsers(options?: FindOptions): Promise<User[]> {
        return this.papiClient.users.find(options);
    }

    getUserData(options?: FindOptions): Promise<User[]> {
        return this.papiClient.users.find(options);
    }
    
    getItemData(options?: FindOptions): Promise<Item[]> {
        return this.papiClient.items.find(options);
    }

    countTransactions(options?: FindOptions): Promise<number> {
        return this.papiClient.transactions.count(options);
    }
    
    postAccount(body: Account) {
        return this.papiClient.accounts.upsert(body);
    }

    findAccount(options: FindOptions) {
        return this.papiClient.accounts.find(options);
    }

    updateAccount(body: Account): Promise<Account> {
        return this.papiClient.accounts.upsert(body);
    }

}
