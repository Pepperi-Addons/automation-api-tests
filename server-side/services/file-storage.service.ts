import { PapiClient, FileStorage } from "@pepperi-addons/papi-sdk";

export class FileStorageService {
    constructor(public papiClient: PapiClient) {

    }

    //Test Data
    createNewImgFile(title: string, name: string, description?: string) {
        return {
            "Title": title,
            "FileName": name + ".png",
            "URL": "https://www.gstatic.com/webp/gallery3/1.png",
        }
    }

    createNewTextFileFromBase64(title: string, name: string, description?: string, content?: string) {
        return {
            "Title": title,
            "FileName": name + ".txt",
            "Content": Buffer.from(content ? content : 'ABCD').toString('base64'),
        }
    }

    createNewTextFileFromUrl(title: string, name: string, description: string, url: string) {
        return {
            "Title": title,
            "FileName": name + ".txt",
            "URL": url
        }
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