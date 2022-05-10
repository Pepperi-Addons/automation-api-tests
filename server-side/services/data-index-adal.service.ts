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
    constructor(public generalService: GeneralService) {}

    createScheme(type: DataIndexSchema['Type'], addonUUID: string, scheme: DataIndexSchema) {
        return this.generalService.papiClient.post(`/addons/data/${type}/schemes/${addonUUID}/create`, scheme);
    }

    removeScheme(type: DataIndexSchema['Type'], addonUUID, scheme: DataIndexSchema) {
        return this.generalService.papiClient.post(`/addons/data/${type}/schemes/${addonUUID}/purge`, scheme);
    }

    createDocument(type: DataIndexSchema['Type'], addonUUID: string, schemeName: string, scheme: DataIndexDocument) {
        return this.generalService.papiClient.post(`/addons/data/${type}/${addonUUID}/${schemeName}`, scheme);
    }

    createBatchDocument(
        type: DataIndexSchema['Type'],
        addonUUID: string,
        schemeName: string,
        schemeArr: DataIndexDocument[],
    ) {
        return this.generalService.papiClient.post(`/addons/data/${type}/batch/${addonUUID}/${schemeName}`, schemeArr);
    }

    updateDocument(type: DataIndexSchema['Type'], addonUUID: string, schemeName: string, query: DataIndexQuery) {
        return this.generalService.papiClient.post(`/addons/data/${type}/update/${addonUUID}/${schemeName}`, query);
    }

    getAllDocuments(type: DataIndexSchema['Type'], addonUUID, indexName: string) {
        return this.generalService.papiClient.get(`/addons/data/${type}/${addonUUID}/${indexName}`);
    }

    searchAllDocuments(type: DataIndexSchema['Type'], addonUUID, indexName: string, query: DataIndexQuery) {
        return this.generalService.papiClient.post(`/addons/data/${type}/search/${addonUUID}/${indexName}`, query);
    }

    getDocumentByNameAndOptionalKey(
        type: DataIndexSchema['Type'],
        addonUUID,
        indexName: string,
        indexKey?: string | number,
    ) {
        let url;
        if (indexKey) {
            url = `/addons/data/${type}/${addonUUID}/${indexName}/${indexKey}`;
        } else {
            url = `/addons/data/${type}/${addonUUID}/${indexName}`;
        }
        return this.generalService.papiClient.get(url);
    }

    removeDocuments(type: DataIndexSchema['Type'], addonUUID, indexName: string | number, query: DataIndexQuery) {
        return this.generalService.papiClient.post(`/addons/data/${type}/delete/${addonUUID}/${indexName}`, query);
    }
}
