import { PapiClient, FileStorage } from '@pepperi-addons/papi-sdk';

export class FileStorageService {
    constructor(public papiClient: PapiClient) {}

    //Test Data
    createTestDataInBase64Format(content?: string) {
        return Buffer.from(content ? content : 'ABCD').toString('base64');
    }

    //Files Storage API Calls
    getFilesFromStorage(where?: string) {
        return this.papiClient.fileStorage.find({
            where,
        });
    }

    getAllFilesFromStorage(where?: string) {
        return this.papiClient.fileStorage
            .iter({
                where,
            })
            .toArray();
    }

    postFileToStorage(body: FileStorage) {
        return this.papiClient.fileStorage.upsert(body);
    }

    getFileConfigurationByID(id: number) {
        return this.papiClient.fileStorage.get(id);
    }
}
