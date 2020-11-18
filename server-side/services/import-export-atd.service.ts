import { PapiClient } from '@pepperi-addons/papi-sdk';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

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

interface References {
    references: { ID: string; Name: string; Type: string }[];
}

export class ImportExportATDService {
    constructor(public papiClient: PapiClient) {}

    //Files Storage API Calls
    getFilesFromStorage(options?: FindOptions) {
        return this.papiClient.fileStorage.find(options);
    }

    getAllFilesFromStorage(options?: FindOptions) {
        return this.papiClient.fileStorage.iter(options).toArray();
    }

    getFileConfigurationByID(id: number) {
        return this.papiClient.fileStorage.get(id);
    }

    exportATD(type: ResourceTypes, subtype: number) {
        return this.papiClient.get(
            `/addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=${type}&subtype=${subtype}`,
        );
    }

    exportMappingATD(references: References) {
        return this.papiClient.post(
            '/addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/build_references_mapping',
            references,
        );
    }
}
