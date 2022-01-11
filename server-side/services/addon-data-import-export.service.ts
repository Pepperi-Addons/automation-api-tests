import { AddonDataScheme, PapiClient, AddonData, FindOptions } from '@pepperi-addons/papi-sdk';

export class DMXService {
    constructor(public papiClient: PapiClient) {}

    postSchema(addonDataScheme: AddonDataScheme) {
        return this.papiClient.addons.data.schemes.post(addonDataScheme);
    }

    getDataFromSchema(addonUUID: string, tableName: string, options?: FindOptions) {
        return this.papiClient.addons.data.uuid(addonUUID).table(tableName).find(options);
    }

    postDataToSchema(addonUUID: string, tableName: string, addonData: AddonData) {
        return this.papiClient.addons.data.uuid(addonUUID).table(tableName).upsert(addonData);
    }

    deleteSchema(tableName: string) {
        return this.papiClient.post(`/addons/data/schemes/${tableName}/purge`);
    }

    dataExport(addonUUID: string, tableName: string) {
        return this.papiClient.post(`/addons/data/export/file/${addonUUID}/${tableName}`);
    }
}
