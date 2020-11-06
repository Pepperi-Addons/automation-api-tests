import { PapiClient, SyncBody } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export class SyncService {
    papiClient: PapiClient;

    constructor(public generalService: GeneralService) {
        this.papiClient = generalService.papiClient;
    }

    jobInfo(uuid: string) {
        return this.papiClient.application.sync.jobInfo(uuid);
    }
    async post(body: SyncBody) {
        return this.papiClient.application.sync.post(body);
    }
}
