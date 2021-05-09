import { PapiClient, SyncBody } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export class SyncService {
    papiClient: PapiClient;
    Authorization: string;

    constructor(public generalService: GeneralService) {
        this.papiClient = generalService.papiClient;
        //Part 1 of 2 for Maor
        //console.log({ Authorization: 'Bearer ' + generalService['client'].OAuthAccessToken });
        this.Authorization = 'Bearer ' + generalService['client'].OAuthAccessToken;
    }

    jobInfo(uuid: string) {
        return this.papiClient.application.sync.jobInfo(uuid);
    }

    post(body: SyncBody) {
        return this.papiClient.application.sync.post(body);
    }

    SyncData(uuid: string) {
        return this.papiClient.application.sync.data(uuid);
    }

    //Part 2 of 2 for Maor
    //This part is needed to test Maor new sync endpoints in EU
    // jobInfo(uuid: string) {
    //     return this.generalService
    //         .fetchStatus(`https://j7m0zxw14k.execute-api.eu-central-1.amazonaws.com/application/sync/jobinfo/${uuid}`, {
    //             method: `GET`,
    //             headers: {
    //                 Authorization: this.Authorization,
    //             },
    //         })
    //         .then((res) => {
    //             res.Body;
    //         });
    // }

    // post(body: SyncBody) {
    //     return this.generalService
    //         .fetchStatus(`https://j7m0zxw14k.execute-api.eu-central-1.amazonaws.com/application/sync`, {
    //             method: `POST`,
    //             headers: {
    //                 Authorization: this.Authorization,
    //             },
    //             body: JSON.stringify(body),
    //         })
    //         .then((res) => {
    //             res.Body;
    //         });
    // }

    // SyncData(uuid: string) {
    //     return this.generalService
    //         .fetchStatus(`https://j7m0zxw14k.execute-api.eu-central-1.amazonaws.com/application/sync/data/${uuid}`, {
    //             method: `GET`,
    //             headers: {
    //                 Authorization: this.Authorization,
    //             },
    //         })
    //         .then((res) => {
    //             res.Body;
    //         });
    // }
}
