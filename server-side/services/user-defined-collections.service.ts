import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export class UDCService {
    papiClient: PapiClient;
    generalService: GeneralService;
    uuid: string;

    constructor(public service: GeneralService, uuid) {
        this.papiClient = service.papiClient;
        this.generalService = service;
        this.uuid = uuid;
    }

    postCollectionschemes(body: any) {
        return this.papiClient.userDefinedCollections.schemes.upsert(body);
    }

    getCollectionschemes() {
        return this.papiClient.userDefinedCollections.schemes.find();
    }

    postDocument(collectionName, body) {
        return this.papiClient.userDefinedCollections.documents(collectionName).upsert(body);
    }

    getDocuments(collectionName) {
        return this.papiClient.userDefinedCollections.documents(collectionName).find();
    }

    async getCollectionFromADAL(collection) {
        return await this.generalService
            .fetchStatus(`/addons/data/${this.uuid}/${collection}`, {
                method: 'GET',
                headers: {
                    'X-Pepperi-OwnerID': this.uuid,
                    'X-Pepperi-SecretKey': await this.generalService.getSecretKey(this.uuid),
                },
            })
            .then((res) => res.Body);
    }
}
