import { PapiClient } from '@pepperi-addons/papi-sdk';

/**
 * 'Overwrite' is false by default.
 */
export interface ImportObjects {
    Objects: { [key: string]: any }[];
    Overwrite?: boolean;
}

export class DIMXService {
    constructor(public papiClient: PapiClient) { }

    dataExport(addonUUID: string, tableName: string, body?) {
        return this.papiClient.post(`/addons/data/export/file/${addonUUID}/${tableName}`, body);
    }

    dataImport(addonUUID: string, tableName: string, data) {
        return this.papiClient.post(`/addons/data/import/file/${addonUUID}/${tableName}`, data);
    }
}
