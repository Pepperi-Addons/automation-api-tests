import /*FindOptions*/ '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface DataIndexSchema {
    Name: string | number;
    Type: 'index' | 'typed_index';
    [key: string]: any;
}

interface DataIndexDocument {
    Key: string | number;
    [key: string]: any;
}

interface DataIndexQuery {
    query: {
        match: {
            [key: string]: any;
        };
    };
    script?: {
        lang: 'painless';
        [key: string]: any;
    };
}

export class DataIndexAdalService {
    globalSleep = 900;
    constructor(public generalService: GeneralService) {}

    async createScheme(type: DataIndexSchema['Type'], addonUUID: string, scheme: DataIndexSchema) {
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/data/${type}/schemes/${addonUUID}/create`, scheme);
    }

    async removeScheme(type: DataIndexSchema['Type'], addonUUID, scheme: DataIndexSchema) {
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/data/${type}/schemes/${addonUUID}/purge`, scheme);
    }

    async createDocument(
        type: DataIndexSchema['Type'],
        addonUUID: string,
        schemeName: string,
        scheme: DataIndexDocument,
    ) {
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/data/${type}/${addonUUID}/${schemeName}`, scheme);
    }

    async createBatchDocument(
        type: DataIndexSchema['Type'],
        addonUUID: string,
        schemeName: string,
        schemeArr: DataIndexDocument[],
    ) {
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/data/${type}/batch/${addonUUID}/${schemeName}`, schemeArr);
    }

    async updateDocument(type: DataIndexSchema['Type'], addonUUID: string, schemeName: string, query: DataIndexQuery) {
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/data/${type}/update/${addonUUID}/${schemeName}`, query);
    }

    async getAllDocuments(type: DataIndexSchema['Type'], addonUUID, indexName: string) {
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.get(`/addons/data/${type}/${addonUUID}/${indexName}`);
    }

    async searchAllDocuments(type: DataIndexSchema['Type'], addonUUID, indexName: string, query: DataIndexQuery) {
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/data/${type}/search/${addonUUID}/${indexName}`, query);
    }

    async getDocumentByNameAndOptionalKey(
        type: DataIndexSchema['Type'],
        addonUUID,
        indexName: string,
        indexKey?: string | number,
    ) {
        await this.generalService.sleepAsync(this.globalSleep);
        let url;
        if (indexKey) {
            url = `/addons/data/${type}/${addonUUID}/${indexName}/${indexKey}`;
        } else {
            url = `/addons/data/${type}/${addonUUID}/${indexName}`;
        }
        return this.generalService.papiClient.get(url);
    }

    async removeDocuments(type: DataIndexSchema['Type'], addonUUID, indexName: string | number, query: DataIndexQuery) {
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/data/${type}/delete/${addonUUID}/${indexName}`, query);
    }
}
