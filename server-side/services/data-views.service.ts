import { PapiClient, DataView } from '@pepperi-addons/papi-sdk';

export class DataViewsService {
    constructor(public papiClient: PapiClient) {}

    //Test Data
    createTestDataInBase64Format(content?: string) {
        return Buffer.from(content ? content : 'ABCD').toString('base64');
    }

    //Files Storage API Calls
    getFilesFromStorage(where?: string) {
        return this.papiClient.fileStorage
            .iter({
                where,
            })
            .toArray();
    }

    getFromUrl(url: string) {
        return this.papiClient.get(url);
    }

    getDataViewByID(id: number) {
        return this.papiClient.metaData.dataViews.get(id);
    }

    getDataView(options?: Record<string, unknown>) {
        return this.papiClient.metaData.dataViews.find(options);
    }

    postDataView(dataView: DataView) {
        return this.papiClient.metaData.dataViews.upsert(dataView);
    }

    getFileConfigurationByID(id: number) {
        return this.papiClient.fileStorage.get(id);
    }
}
