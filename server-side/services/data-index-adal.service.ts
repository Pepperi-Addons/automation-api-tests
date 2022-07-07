import /*FindOptions*/ '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface DataIndexSchema {
    Name: string | number;
    Type: 'index' | 'shared_index';
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
    constructor(public generalService: GeneralService) { }

    async changeEndpoint(type, scheme) {
        if (type == 'index') {
            return type;
        } else {
            return 'shared_index/index/' + scheme.DataSourceData.IndexName;
        }
    }

    async createScheme(type: DataIndexSchema['Type'], addonUUID: string, scheme: DataIndexSchema) {
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/${type}/schemes/${addonUUID}/create`, scheme);
    }

    async removeScheme(type: DataIndexSchema['Type'], addonUUID, scheme: DataIndexSchema) {
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/${type}/schemes/${addonUUID}/purge`, scheme);
    }

    async createDocument(
        type: DataIndexSchema['Type'],
        addonUUID: string,
        schemeName: string,
        scheme: DataIndexDocument,
        indexName?
    ) {
        const path = await this.changeEndpoint(type, indexName);
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/${path}/${addonUUID}/${schemeName}`, scheme);
    }

    async createBatchDocument(
        type: DataIndexSchema['Type'],
        addonUUID: string,
        schemeName: string,
        schemeArr: DataIndexDocument[],
        indexName?
    ) {
        let obj = { Objects: schemeArr };
        const path = await this.changeEndpoint(type, indexName);
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/${path}/batch/${addonUUID}/${schemeName}`, obj);
    }

    async updateDocument(type: DataIndexSchema['Type'], addonUUID: string, schemeName: string, query: DataIndexQuery, scheme) {
        const path = await this.changeEndpoint(type, scheme);
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/${path}/update/${addonUUID}/${schemeName}`, query);
    }

    async getAllDocuments(type: DataIndexSchema['Type'], addonUUID, indexName: string, scheme) {
        const path = await this.changeEndpoint(type, scheme);
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.get(`/addons/${path}/${addonUUID}/${indexName}`);
    }

    async searchAllDocuments(type: DataIndexSchema['Type'], addonUUID, indexName: string, query: DataIndexQuery, scheme) {
        const path = await this.changeEndpoint(type, scheme);
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/${path}/search/${addonUUID}/${indexName}`, query);
    }

    async getDocumentByNameAndOptionalKey(
        scheme: DataIndexSchema,
        type: DataIndexSchema['Type'],
        addonUUID,
        indexName: string,
        indexKey?: string | number,
    ) {
        await this.generalService.sleepAsync(this.globalSleep);
        const path = await this.changeEndpoint(type, scheme);
        let url;
        if (indexKey) {
            url = `/addons/${path}/${addonUUID}/${indexName}/${indexKey}`;
        } else {
            url = `/addons/${path}/${addonUUID}/${indexName}`;
        }
        return this.generalService.papiClient.get(url);
    }

    async removeDocuments(type: DataIndexSchema['Type'], addonUUID, indexName: string | number, scheme, query: DataIndexQuery) {
        const path = await this.changeEndpoint(type, scheme);
        await this.generalService.sleepAsync(this.globalSleep);
        return this.generalService.papiClient.post(`/addons/${path}/delete/${addonUUID}/${indexName}`, query);
    }
}
