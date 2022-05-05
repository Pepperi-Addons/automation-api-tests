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
        script?: {
            lang: 'painless';
            [key: string]: any;
        };
    };
}

// {
//     "query": {
//         "match": {
//             "Key": "1"
//         },
//         "script": {
//             "source": "ctx._source.Field3++",
//             "lang": "painless"
//         }
//         // "script": {
//         //     "Field1": "Dor - Updated",
//         //     "Field2": true,
//         //     "Field3": "5", //This will maybe change field 3 to be "6" need to test
//         //     "Field4": 112.2,
//         //     "Field5": "2021-03-27",
//         //     "Key": 1
//         // }
//     }
// }

export class DataIndexAdalService {
    constructor(public generalService: GeneralService) {}

    createScheme(addonUUID: string, scheme: DataIndexSchema) {
        return this.generalService.papiClient.post(`/addons/data/index/schemes/${addonUUID}/create`, scheme);
    }

    cleanScheme(addonUUID, schemeName: string) {
        return this.generalService.papiClient.post(`/addons/data/index/schemes/${addonUUID}/purge`, {
            Name: schemeName,
        });
    }

    createDocument(addonUUID: string, schemeName: string, scheme: DataIndexDocument) {
        return this.generalService.papiClient.post(`/addons/data/index/${addonUUID}/${schemeName}`, scheme);
    }

    updateDocument(addonUUID: string, schemeName: string, query: DataIndexQuery) {
        return this.generalService.papiClient.post(`/addons/data/index/update/${addonUUID}/${schemeName}`, query);
    }

    getAllDocuments(addonUUID, indexName: string) {
        return this.generalService.papiClient.get(`/addons/data/index/${addonUUID}/${indexName}`);
    }

    getDocumentByKey(addonUUID, indexName: string, indexKey?: string | number) {
        let url;
        if (indexKey) {
            url = `/addons/data/index/${addonUUID}/${indexName}/${indexKey}`;
        } else {
            url = `/addons/data/index/${addonUUID}/${indexName}`;
        }
        return this.generalService.papiClient.get(url);
    }

    cleanDocument(addonUUID, indexName: string | number, query: DataIndexQuery) {
        return this.generalService.papiClient.post(`/addons/data/index/delete/${addonUUID}/${indexName}`, query);
    }
}
