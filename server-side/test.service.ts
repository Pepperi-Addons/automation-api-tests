import { PapiClient, InstalledAddon } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { stringify } from 'querystring';
import { FileStorage } from '@pepperi-addons/papi-sdk/dist/entities/fileStorage';

class TestService {

    papiClient: PapiClient

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken
        });
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

    //API Calls
    getAddons(): Promise<InstalledAddon[]> {
        return this.papiClient.addons.installedAddons.find({});
    }

    getFilesFromStorage() {
        return this.papiClient.fileStorage.find({});
    }

    postFilesToStorage(body: FileStorage) {
        return this.papiClient.fileStorage.upsert(body);
    }

    getFileConfigurationByID(id: number) {
        return this.papiClient.fileStorage.get(id);
    }

    //functions
}

export default TestService;