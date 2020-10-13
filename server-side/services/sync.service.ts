import { PapiClient, SyncBody } from '@pepperi-addons/papi-sdk';

export class SyncService {
    constructor(public papiClient: PapiClient) {}

    jobInfo(uuid: string) {
        return this.papiClient.application.sync.jobInfo(uuid);
    }

    post(body: SyncBody) {
        return this.papiClient.application.sync.post(body);
    }
}
