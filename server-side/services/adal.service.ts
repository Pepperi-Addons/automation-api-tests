import { AddonDataScheme, PapiClient, AddonData, FindOptions } from '@pepperi-addons/papi-sdk';

export class ADALService {
    constructor(public papiClient: PapiClient) {}

    postSchema(addonDataScheme: AddonDataScheme) {
        return this.papiClient.addons.data.schemes.post(addonDataScheme);
    }

    getDataFromSchema(uuid: string, tableName: string, options: FindOptions) {
        return this.papiClient.addons.data.uuid(uuid).table(tableName).find(options);
    }

    postDataToSchema(uuid: string, tableName: string, addonData: AddonData) {
        return this.papiClient.addons.data.uuid(uuid).table(tableName).upsert(addonData);
    }

    deleteSchema(tableName: string) {
        return this.papiClient.post(`/addons/data/schemes/${tableName}/purge`);
    }
}
