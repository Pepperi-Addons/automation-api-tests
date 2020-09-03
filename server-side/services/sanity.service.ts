import { PapiClient, Account, ApiFieldObject } from '@pepperi-addons/papi-sdk';
import fetch from 'node-fetch';

export class SanityService {
    constructor(public papiClient: PapiClient) { }

    
    createAccount(body: Account) {
        return this.papiClient.accounts.upsert(body);
    }

    getAccount(where?: string) {
        return this.papiClient.accounts
            .iter({
                where,
            })
            .toArray();
    }

    deleteAccount(accountID: number) {
        return this.papiClient.delete('/accounts/' + accountID);
    }

    async createTSA(type: string, nameATD: string, body: ApiFieldObject) {
        const ATDarr = await this.getATD(type);
        let ATD;
        for (let i = 0; i < ATDarr.length; i++) {
            if (ATDarr[i].ExternalID == nameATD) {
                ATD = ATDarr[i].TypeID;
                break;
            }
        }
        return await this.papiClient.metaData.type(type + "/types" + ATD).fields.upsert(body);
    }

    async getATD(type: string) {
        return await this.papiClient.metaData.type(type).types.get();
    }

    async createBulkTSA(type: string, nameATD: string, body: any[]){
        const ATDarr = await this.getATD(type);
        let ATD;
        let resultArr: any[] = [];
        for (let i = 0; i < ATDarr.length; i++) {
            if (ATDarr[i].ExternalID == nameATD) {
                ATD = ATDarr[i].TypeID;
                break;
            }
        }
        for (let i = 0; i < body.length; i++ ){
            let tempResult = await this.papiClient.metaData.type(type + "/types/" + ATD).fields.upsert(body[i]);
            resultArr.push(tempResult.FieldID)
        }
        return resultArr;
    }

    async deleteBulkTSA(type: string, nameATD: string, body: any[]) {
        const ATDarr = await this.getATD(type);
        let resultArr: any[] = [];
        let ATD;
        for (let i = 0; i < ATDarr.length; i++) {
            if (ATDarr[i].ExternalID == nameATD) {
                ATD = ATDarr[i].TypeID;
                break;
            }
        }
        for (let i = 0; i < body.length; i++ ){
            let tempResult = await this.papiClient.delete('/meta_data/' + type + "/types/" + ATD + body[i].FieldID);
            resultArr.push(body[i].FieldID + " - " + tempResult.statusText)
        }
        return resultArr;   
    }

}
