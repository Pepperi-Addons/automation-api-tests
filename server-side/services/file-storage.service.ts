import { PapiClient, FileStorage } from '@pepperi-addons/papi-sdk';

export class FileStorageService {
    constructor(public papiClient: PapiClient) {}

    //Test Data
    createTestDataInBase64Format(content?: string) {
        return Buffer.from(content ? content : 'ABCD').toString('base64');
    }

    //Files Storage API Calls
    getFilesFromStorage() {
        return this.papiClient.fileStorage.find();
    }

    postFileToStorage(body: FileStorage) {
        return this.papiClient.fileStorage.upsert(body);
    }

    getFileConfigurationByID(id: number) {
        return this.papiClient.fileStorage.get(id);
    }
}
