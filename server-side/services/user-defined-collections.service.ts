import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export class UDCService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    postCollection(body: any) {
        return this.papiClient.post('/user_defined_collections/schemes', body);
    }

    getCollections() {
        return this.papiClient.get('/user_defined_collections/schemes');
    }

    postDocument(collection, body: any) {
        return this.papiClient.post('/user_defined_collections/' + collection, body);
    }

    getDocuments(collection) {
        return this.papiClient.get('/user_defined_collections/' + collection);
    }

    async getDIMX(udcUUID, collection) {
        return await this.generalService
            .fetchStatus('/addons/data/' + udcUUID + '/' + collection, {
                method: 'GET',
                headers: {
                    'X-Pepperi-OwnerID': udcUUID,
                    'X-Pepperi-SecretKey': await this.generalService.getSecretKey(udcUUID),
                },
            })
            .then((res) => res.Body);
    }
}
