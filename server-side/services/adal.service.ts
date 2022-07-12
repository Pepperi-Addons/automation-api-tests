import { AddonDataScheme, PapiClient, AddonData, FindOptions } from '@pepperi-addons/papi-sdk';

export class ADALService {
    constructor(public papiClient: PapiClient) {
        this.papiClient = papiClient;
        console.dir(this.papiClient);
    }

    postSchema(addonDataScheme: AddonDataScheme) {
        return this.papiClient.addons.data.schemes.post(addonDataScheme);
    }

    getDataFromSchema(addonUUID: string, tableName: string, options?: FindOptions) {
        return this.papiClient.addons.data.uuid(addonUUID).table(tableName).find(options);
    }

    postDataToSchema(addonUUID: string, tableName: string, addonData: AddonData) {
        return this.papiClient.addons.data.uuid(addonUUID).table(tableName).upsert(addonData);
    }

    postBatchDataToSchema(addonUUID: string, tableName: string, addonData: AddonData[]) {
        return this.papiClient.post(`/addons/data/batch/${addonUUID}/${tableName}`, { Objects: addonData });
    }

    deleteSchema(tableName: string) {
        console.dir(this.papiClient);
        return this.papiClient.post(`/addons/data/schemes/${tableName}/purge`);
    }
}
