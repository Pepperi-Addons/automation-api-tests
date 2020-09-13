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
        return this.papiClient.accounts.delete(accountID);
    }

    async getATD(type: string) {
        return await this.papiClient.metaData.type(type).types.get();
    }

    async findATDbyName(type: string, nameATD: string){
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
        if(type != 'accounts'){
            return await this.papiClient.metaData.type(type + "/types/" + ATD).fields.upsert(body);
        }
        else{
            return await this.papiClient.metaData.type(type).fields.upsert(body);
        }
    }

    async createBulkTSA(type: string, body: ApiFieldObject[], ATD?: string){
        let resultArr: any[] = [];
        if(type != 'accounts' && ATD != undefined){
            for (let i = 0; i < body.length; i++ ){
                let tempResult = await this.papiClient.metaData.type(type + "/types/" + ATD).fields.upsert(body[i]);
                resultArr.push(tempResult.FieldID)
            }
        }
        else{
            for (let i = 0; i < body.length; i++ ){
                let tempResult = await this.papiClient.metaData.type(type).fields.upsert(body[i]);
                resultArr.push(tempResult.FieldID)
            }
        }
        return resultArr;
    }

    async deleteBulkTSA(type: string, body: ApiFieldObject[], ATD?: string) {
        let resultArr: any[] = [];
        if(type != 'accounts' && ATD != undefined){
            for (let i = 0; i < body.length; i++ ){
                let tempResult = await this.papiClient.metaData.type(type).types.subtype(ATD).fields.delete(body[i].FieldID);
                resultArr.push(body[i].FieldID)
            }
        }
        else{
            for (let i = 0; i < body.length; i++ ){
                let tempResult = await this.papiClient.metaData.type(type).fields.delete(body[i].FieldID);
                resultArr.push(body[i].FieldID)
            }
        }
        return resultArr;   
    }

}
