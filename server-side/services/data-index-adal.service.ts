import /*FindOptions*/ '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export class DataIndexAdalService {
    constructor(public generalService: GeneralService) {}

    createScheme(addonUUID) {
        return this.generalService.papiClient.post(`/index/schemes/${addonUUID}/create`);
    }

    cleanScheme(addonUUID) {
        return this.generalService.papiClient.post(`/index/schemes/${addonUUID}/purge`);
    }

    getAllDocuments(addonUUID, indexName: string) {
        return this.generalService.papiClient.get(`/index/${addonUUID}/${indexName}`);
    }

    getDocumentByKey(addonUUID, indexName: string, indexKey: string) {
        return this.generalService.papiClient.get(`/index/${addonUUID}/${indexName}/${indexKey}`);
    }

    cleanDataIndex(addonUUID) {
        return this.generalService.papiClient.post(`/index/schemes/${addonUUID}/purge`);
    }
}
