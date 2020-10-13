import { PapiClient, FileStorage } from '@pepperi-addons/papi-sdk';
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
export class FileStorageService {
    constructor(public papiClient: PapiClient) {}

    //Test Data
    createTestDataInBase64Format(content?: string) {
        return Buffer.from(content ? content : 'ABCD').toString('base64');
    }

    //Files Storage API Calls
    getFilesFromStorage(options?: FindOptions) {
        return this.papiClient.fileStorage.find(options);
    }

    getAllFilesFromStorage(options?: FindOptions) {
        return this.papiClient.fileStorage.iter(options).toArray();
    }

    postFileToStorage(body: FileStorage) {
        return this.papiClient.fileStorage.upsert(body);
    }

    getFileConfigurationByID(id: number) {
        return this.papiClient.fileStorage.get(id);
    }
}
