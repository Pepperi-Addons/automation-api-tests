import { PapiClient, FindOptions } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export class UDCService {
    papiClient: PapiClient;
    generalService: GeneralService;
    uuid: string;
    sk: any;

    constructor(public service: GeneralService, uuid) {
        this.papiClient = service.papiClient;
        this.generalService = service;
        this.uuid = uuid;
    }

    postCollectionschemes(body: any) {
        return this.papiClient.userDefinedCollections.schemes.upsert(body);
    }

    getCollectionschemes(options?: FindOptions) {
        return this.papiClient.userDefinedCollections.schemes.find(options);
    }

    postDocument(collectionName, body) {
        return this.papiClient.userDefinedCollections.documents(collectionName).upsert(body);
    }

    getDocuments(collectionName, options?: FindOptions) {
        return this.papiClient.userDefinedCollections.documents(collectionName).find(options);
    }

    async getCollectionFromADAL(collection) {
        if (!this.sk) {
            this.sk = await this.generalService.getSecretKey(this.uuid);
        }
        return await this.generalService
            .fetchStatus(`/addons/data/${this.uuid}/${collection}`, {
                method: 'GET',
                headers: {
                    'X-Pepperi-OwnerID': this.uuid,
                    'X-Pepperi-SecretKey': this.sk,
                },
            })
            .then((res) => res.Body);
    }
}
