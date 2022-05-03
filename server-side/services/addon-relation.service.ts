import { PapiClient, FindOptions, Relation } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export class AddonRelationService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
        this.papiClient['addonUUID'] = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
    }

    getRelationSDK(options?: FindOptions): Promise<Relation[]> {
        return this.papiClient.addons.data.relations.find(options);
    }

    async getRelation(headers?: { [key: string]: string }) {
        return this.generalService
            .fetchStatus('/addons/data/relations', {
                method: 'GET',
                headers: headers,
            })
            .then((res) => res.Body);
    }

    async postRelationSDK(body: Relation) {
        return this.papiClient.addons.data.relations.upsert(body);
    }

    async getRelationWithNameAndUUID(headers: { [key: string]: string }, name: string, AddonUUID?: string) {
        let url;
        if (AddonUUID) {
            url = `/addons/data/relations?where=Name='${name}' AND AddonUUID='${AddonUUID}'&include_deleted=true`;
        } else {
            url = `/addons/data/relations?where=Name='${name}'&include_deleted=true`;
        }
        return this.generalService
            .fetchStatus(url, {
                method: 'GET',
                headers: headers,
            })
            .then((res) => res.Body);
    }

    async getRelationByRelationType(headers: { [key: string]: string }, relationtype: string) {
        return this.generalService
            .fetchStatus(`/addons/data/relations?where=RelationName='${relationtype}'`, {
                method: 'GET',
                headers: headers,
            })
            .then((res) => res.Body);
    }

    async postRelation(headers?: { [key: string]: string }, body?: any) {
        return this.generalService
            .fetchStatus('/addons/data/relations', {
                method: 'POST',
                headers: headers,
                body: body,
            })
            .then((res) => res.Body);
    }

    async postRelationStatus(headers?: { [key: string]: string }, body?: any) {
        return this.generalService
            .fetchStatus('/addons/data/relations', {
                method: 'POST',
                headers: headers,
                body: body,
            })
            .then((res) => res.Status);
    }
}
