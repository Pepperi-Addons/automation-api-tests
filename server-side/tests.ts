import { Client } from '@pepperi-addons/debug-server';
import GeneralService from './services/general.service';
import { FileStorageTests } from './api-tests/file_storage';
import { DataViewsTests } from './api-tests/data_views';
import { FieldsTests } from './api-tests/fields';

export async function file_storage(client: Client) {
    const service = new GeneralService(client);
    return FileStorageTests(service);
}

export async function data_views(client: Client) {
    const service = new GeneralService(client);
    return DataViewsTests(service);
}

export async function fields(client: Client) {
    const service = new GeneralService(client);
    return FieldsTests(service);
}
