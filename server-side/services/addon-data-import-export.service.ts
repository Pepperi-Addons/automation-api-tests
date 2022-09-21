import { PapiClient } from '@pepperi-addons/papi-sdk';
/**
 * 'Overwrite' is false by default.
 */
export interface ImportObjects {
    Objects: { [key: string]: any }[];
    Overwrite?: boolean;
}

export class DIMXService {
    constructor(public papiClient: PapiClient) {}

    dataExport(addonUUID: string, tableName: string, body?: { Format?: string; Delimiter?: string; Where?: string }) {
        return this.papiClient.post(`/addons/data/export/file/${addonUUID}/${tableName}`, body);
    }

    dataImport(
        addonUUID: string,
        tableName: string,
        data?: { URI: string; Delimiter?: string; OverwriteObject?: boolean, OverwriteTable?: boolean },
    ) {
        return this.papiClient.post(`/addons/data/import/file/${addonUUID}/${tableName}`, data);
    }

    dataRecursiveExport(addonUUID: string, tableName: string) {
        return this.papiClient.post(
            `/addons/api/async/44c97115-6d14-4626-91dc-83f176e9a0fc/api/recursive_export?addon_uuid=${addonUUID}&table=${tableName}`,
        );
    }

    insertDataToSchemeDIMX(addonUUID: string, tableName: string, body) {
        return this.papiClient.post(`/addons/data/import/${addonUUID}/${tableName}`, body);
    }

    recursiveExport(addonUUID: string, tableName: string) {
        return this.papiClient.post(`/addons/data/export/file/recursive/${addonUUID}/${tableName}`);
    }

    mapping(addonUUID: string, tableName: string, body) {
        return this.papiClient.post(`/addons/data/mapping/${addonUUID}/${tableName}`, body);
    }

    recursiveImport(addonUUID: string, tableName: string, body) {
        return this.papiClient.post(`/addons/data/import/file/recursive/${addonUUID}/${tableName}`, body);
    }
}
