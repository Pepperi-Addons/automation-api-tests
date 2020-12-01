import { PapiClient } from '@pepperi-addons/papi-sdk';

declare type ResourceTypes =
    | 'activities'
    | 'transactions'
    | 'transaction_lines'
    | 'catalogs'
    | 'accounts'
    | 'items'
    | 'user_defined_tables';

export interface MetaDataATD {
    TypeID?: number;
    InternalID?: number;
    ExternalID: string;
    Description: string;
    Icon?: string;
    CreationDateTime?: string;
    ModificationDateTime?: string;
    Hidden?: boolean;
    UUID?: string;
}

export interface MetaDataUDT {
    InternalID?: number;
    TableID: string;
    MainKeyType: {
        ID: number;
        Name: string;
    };
    SecondaryKeyType: {
        ID: number;
        Name: string;
    };
    CreationDateTime?: string;
    ModificationDateTime?: string;
    Hidden?: boolean;
    MemoryMode?: Record<string, unknown>;
}

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
    References: { ID: string; Name: string; Type: string }[];
}

export class ImportExportATDService {
    constructor(public papiClient: PapiClient) {}

    //ATD Types
    //Transactions
    postTransactionsATD(atd: MetaDataATD) {
        return this.papiClient.post(`/meta_data/${'transactions' as ResourceTypes}/types`, atd);
    }

    getTransactionsATD(subTypeID: number) {
        return this.papiClient.get(`/meta_data/${'transactions' as ResourceTypes}/types/${subTypeID}`);
    }

    getAllTransactionsATD() {
        return this.papiClient.get(`/meta_data/${'transactions' as ResourceTypes}/types`);
    }

    //Activities
    postActivitiesATD(atd: MetaDataATD) {
        return this.papiClient.post(`/meta_data/${'activities' as ResourceTypes}/types`, atd);
    }

    getActivitiesATD(subTypeID: number) {
        return this.papiClient.get(`/meta_data/${'activities' as ResourceTypes}/types${subTypeID}`);
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

    //UDT
    postUDT(udt: MetaDataUDT) {
        return this.papiClient.post(`/meta_data/${'user_defined_tables' as ResourceTypes}`, udt);
    }

    getUDT(tableID: string) {
        return this.papiClient.get(`/meta_data/${'user_defined_tables' as ResourceTypes}/${tableID}`);
    }

    getAllUDT() {
        return this.papiClient.get(`/meta_data/${'user_defined_tables' as ResourceTypes}`);
    }

    deleteUDT(tableID: string) {
        return this.papiClient.delete(`/meta_data/${'user_defined_tables' as ResourceTypes}/${tableID}`);
    }
}
