import { PapiClient, ApiFieldObject } from '@pepperi-addons/papi-sdk';
declare type ResourceTypes = 'activity' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts ';

export class FieldsService {
    constructor(public papiClient: PapiClient) {}

    getFields(resource_name: ResourceTypes, type_Id, FieldID?) {
        if (resource_name == 'catalogs') {
            return this.papiClient.metaData.type(resource_name).fields.get();
        }
        if (FieldID == undefined) {
            return this.papiClient.metaData.type(resource_name).types.subtype(type_Id).fields.get();
        }
        return this.papiClient.metaData.type(resource_name).types.subtype(type_Id).fields.get(FieldID);
    }

    upsertFields(resource_name: ResourceTypes, body: ApiFieldObject, type_Id?: string) {
        if (type_Id == undefined || resource_name == 'catalogs') {
            return this.papiClient.metaData.type(resource_name).fields.upsert(body);
        }
        return this.papiClient.metaData.type(resource_name).types.subtype(type_Id).fields.upsert(body);
    }

    deleteFields(resource_name: ResourceTypes, FieldID: string, type_Id?: string) {
        if (resource_name == 'catalogs'  || type_Id == undefined) {
            return this.papiClient.metaData.type(resource_name).fields.delete(FieldID);
        }
        return this.papiClient.metaData.type(resource_name).types.subtype(type_Id).fields.delete(FieldID);
    }
}
