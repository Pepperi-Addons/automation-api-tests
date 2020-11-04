import { PapiClient, SyncBody } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';
import fetch from 'node-fetch';

export class SyncService {
    papiClient: PapiClient;

    constructor(public generalService: GeneralService) {
        this.papiClient = generalService.papiClient;
    }

    jobInfo(uuid: string) {
        return this.papiClient.application.sync.jobInfo(uuid);
    }

    //not possible read the response of sync with large data from this endpoint.
    // async post(body: SyncBody) {
    //     return this.papiClient.application.sync.post(body);
    // }

    async post(body: SyncBody) {
        try {
            //return this.papiClient.application.sync.post(body);

            let syncPostApiResponse;
            //possible to read the response of sync with large data from this endpoint.
            syncPostApiResponse = await fetch(`${this.generalService['client'].BaseURL}/application/sync`, {
                method: `POST`,
                headers: {
                    Authorization: `Bearer ${this.generalService['client'].OAuthAccessToken}`,
                },
                body: JSON.stringify(body),
            }).then((response) => {
                return response.text();
            });
            console.log(syncPostApiResponse);
            syncPostApiResponse = syncPostApiResponse.replace(/(\s|\n|\r)/gm, '');
            syncPostApiResponse = JSON.parse(syncPostApiResponse);

            return syncPostApiResponse;
        } catch (error) {
            return error;
        }
    }
}
