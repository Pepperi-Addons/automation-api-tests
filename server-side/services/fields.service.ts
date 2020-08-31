import { PapiClient } from '@pepperi-addons/papi-sdk';
declare type ResourceTypes = 'activity' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts ';

export class FieldsService {
    constructor(public papiClient: PapiClient) {}

    //Test Data
    getFields(resource_name: ResourceTypes, type_Id, FieldID?) {
        if ((resource_name = 'catalogs')) {
            return this.papiClient.get(`/meta_data/${resource_name}/fields`);
        }
        if (FieldID === undefined) {
            return this.papiClient.get(`/meta_data/${resource_name}/types/${type_Id}/fields`);
        }
        return this.papiClient.get(`/meta_data/${resource_name}/types/${type_Id}/fields/${FieldID}`);
    }
}
