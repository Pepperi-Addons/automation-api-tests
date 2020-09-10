import { Client } from '@pepperi-addons/debug-server';
import GeneralService from './services/general.service';
import { FileStorageTests } from './api-tests/file_storage';
import { DataViewsTests } from './api-tests/data_views';
import { FieldsTests } from './api-tests/fields';
import { SyncTests } from './api-tests/sync';

export async function run(client: Client) {
    return Promise.all([file_storage(client), data_views(client), fields(client), sync(client)]);
}

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

export async function sync(client: Client) {
    const service = new GeneralService(client);
    return SyncTests(service);
}
