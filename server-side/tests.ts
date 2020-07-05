import { Client } from '@pepperi-addons/debug-server';
import GeneralService from './services/general.service';
import { FileStorageTests } from './api-tests/file_storage';

export async function file_storage(client: Client) {
    const service = new GeneralService(client);
    return FileStorageTests(service);
}
