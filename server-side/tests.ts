import { Client, Request } from '@pepperi-addons/debug-server'
import GeneralService from './services/general.service'
import { CRUDOneFileFromFileStorageTest } from './api-tests/file_storage';

export async function file_storage(client: Client, request: Request) {
    const service = new GeneralService(client);
    return CRUDOneFileFromFileStorageTest(service);
}