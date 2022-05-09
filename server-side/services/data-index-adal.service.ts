import /*FindOptions*/ '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

interface DataIndexSchema {
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
    constructor(public generalService: GeneralService) {}

    createScheme(addonUUID: string, scheme: DataIndexSchema) {
        return this.generalService.papiClient.post(`/addons/data/index/schemes/${addonUUID}/create`, scheme);
    }

    removeScheme(addonUUID, schemeName: string) {
        return this.generalService.papiClient.post(`/addons/data/index/schemes/${addonUUID}/purge`, {
            Name: schemeName,
        });
    }

    createDocument(addonUUID: string, schemeName: string, scheme: DataIndexDocument) {
        return this.generalService.papiClient.post(`/addons/data/index/${addonUUID}/${schemeName}`, scheme);
    }

    createBatchDocument(addonUUID: string, schemeName: string, schemeArr: DataIndexDocument[]) {
        return this.generalService.papiClient.post(`/addons/data/index/batch/${addonUUID}/${schemeName}`, schemeArr);
    }

    updateDocument(addonUUID: string, schemeName: string, query: DataIndexQuery) {
        return this.generalService.papiClient.post(`/addons/data/index/update/${addonUUID}/${schemeName}`, query);
    }

    getAllDocuments(addonUUID, indexName: string) {
        return this.generalService.papiClient.get(`/addons/data/index/${addonUUID}/${indexName}`);
    }

    searchAllDocuments(addonUUID, indexName: string, query: DataIndexQuery) {
        return this.generalService.papiClient.post(`/addons/data/index/search/${addonUUID}/${indexName}`, query);
    }

    getDocumentByNameAndOptionalKey(addonUUID, indexName: string, indexKey?: string | number) {
        let url;
        if (indexKey) {
            url = `/addons/data/index/${addonUUID}/${indexName}/${indexKey}`;
        } else {
            url = `/addons/data/index/${addonUUID}/${indexName}`;
        }
        return this.generalService.papiClient.get(url);
    }

    removeDocuments(addonUUID, indexName: string | number, query: DataIndexQuery) {
        return this.generalService.papiClient.post(`/addons/data/index/delete/${addonUUID}/${indexName}`, query);
    }
}
