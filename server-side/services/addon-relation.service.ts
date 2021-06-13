import { PapiClient, FindOptions, Item } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

const apiCallsInterval = 4000;

export class AddonRelationService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    getItems(options?: FindOptions): Promise<Item[]> {
        return this.papiClient.items.find(options);
    }

    async getRelation(headers?: { [key: string]: string }) {
        return this.generalService
            .fetchStatus('/addons/data/relations', {
                method: 'GET',
                headers: headers,
            })
            .then((res) => res.Body);
    }

    async getRelationWithName(headers: { [key: string]: string }, name: string) {
        return this.generalService
            .fetchStatus(`/addons/data/relations?where=Name='${name}'&include_deleted=true`, {
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

    //get secret key
    async getSecretKey(): Promise<string> {
        return this.generalService
            .fetchStatus('/code_jobs/get_data_for_job_execution', {
                method: 'POST',
                body: JSON.stringify({
                    JobMessageData: {
                        UUID: '14ca5951-06e6-4f4c-a8fd-92fa243a662c',
                        MessageType: 'AddonMessage',
                        SchemaVersion: 2,
                        DistributorUUID: '547dc30b-bb56-46f7-8c89-864f54402cdb',
                        FunctionPath: 'Addon/Public/fff02926-7aac-467f-8f1b-2ec2154a6bc7/Ver3/test.js',
                        ExecutionMemoryLevel: 4,
                        UserUUID: '3e4d1f14-6760-4c2c-9977-4f438e591c56',
                        NumberOfTry: 1,
                        NumberOfTries: 1,
                        FunctionName: 'ido',
                        StartDateTime: '2020-11-03T11:34:15.916Z',
                        EndDateTime: '2020-11-03T11:34:16.508Z',
                        Request: {
                            path: '/addons/api/async/fff02926-7aac-467f-8f1b-2ec2154a6bc7/test.js/ido',
                            method: 'GET',
                            originalUrl: '/pjobs/addons/api/async/fff02926-7aac-467f-8f1b-2ec2154a6bc7/test.js/ido',
                            query: {},
                            body: null,
                            header: {},
                        },
                        CodeJobUUID: null,
                        CodeJobName: null,
                        CodeJobDescription: null,
                        IsScheduled: false,
                        IsPublished: false,
                        AddonData: {
                            AddonUUID: this.generalService['client'].BaseURL.includes('staging')
                                ? '48d20f0b-369a-4b34-b48a-ffe245088513'
                                : '78696fc6-a04f-4f82-aadf-8f823776473f',
                            AddonPath: 'test.js',
                            AddonVersion: null,
                        },
                        CallbackUUID: null,
                    },
                }),
            })
            .then((res) => res.Body.ClientObject.AddonSecretKey);
    }
}
