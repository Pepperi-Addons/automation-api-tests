import { PapiClient, FileStorage } from '@pepperi-addons/papi-sdk';

export class FileStorageService {
    constructor(public papiClient: PapiClient) {}

    //Test Data
    createNewImgFile(title: string, name: string, description?: string) {
        const obj: FileStorage = {
            Title: title,
            FileName: name + '.png',
            Description: description,
            URL: 'https://www.gstatic.com/webp/gallery3/1.png',
        };
        return obj;
    }

    createNewTextFileFromBase64(title: string, name: string, description?: string, content?: string) {
        const obj: FileStorage = {
            Title: title,
            FileName: name + '.txt',
            Description: description,
            Content: Buffer.from(content ? content : 'ABCD').toString('base64'),
        };
        return obj;
    }

    createNewTextFileFromUrl(title: string, name: string, description: string, url: string) {
        const obj: FileStorage = {
            Title: title,
            FileName: name + '.txt',
            Description: description,
            URL: url,
        };
        return obj;
    }

    //Files Storage API Calls
    getFilesFromStorage() {
        return this.papiClient.fileStorage.find({});
    }

    postFilesToStorage(body: FileStorage) {
        return this.papiClient.fileStorage.upsert(body);
    }

    getFileConfigurationByID(id: number) {
        return this.papiClient.fileStorage.get(id);
    }
}
