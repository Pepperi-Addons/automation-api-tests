import { AddonDataScheme, PapiClient, AddonData } from '@pepperi-addons/papi-sdk';

export class ADALService {
    constructor(public papiClient: PapiClient) {}

    postSchema(addonDataScheme: AddonDataScheme) {
        return this.papiClient.addons.data.schemes.post(addonDataScheme);
    }

    postDataToSchema(uuid: string, tableName: string, addonData: AddonData) {
        return this.papiClient.addons.data.uuid(uuid).table(tableName).upsert(addonData);
    }
}
