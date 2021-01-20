import { PapiClient, SyncBody } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';
//import fetch from 'node-fetch';

export class SyncService {
    papiClient: PapiClient;
    Authorization: string;

    constructor(public generalService: GeneralService) {
        this.papiClient = generalService.papiClient;
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

    //This part is needed to test Maor new sync endpoints in EU
    // jobInfo(uuid: string) {
    //     return fetch(`https://j7m0zxw14k.execute-api.eu-central-1.amazonaws.com/application/sync/jobinfo/${uuid}`, {
    //         method: `GET`,
    //         headers: {
    //             Authorization: this.Authorization,
    //         },
    //     })
    //         .then((res) => {
    //             console.log(res.url);
    //             return res.text();
    //         })
    //         .then((obj) => {
    //             console.log(obj ? JSON.parse(obj) : '');
    //             return obj ? JSON.parse(obj) : '';
    //         });
    // }

    // post(body: SyncBody) {
    //     return fetch(`https://j7m0zxw14k.execute-api.eu-central-1.amazonaws.com/application/sync`, {
    //         method: `POST`,
    //         headers: {
    //             Authorization: this.Authorization,
    //         },
    //         body: JSON.stringify(body),
    //     })
    //         .then((res) => {
    //             console.log(res.url);
    //             return res.text();
    //         })
    //         .then((obj) => {
    //             console.log(obj ? JSON.parse(obj) : '');
    //             return obj ? JSON.parse(obj) : '';
    //         });
    // }

    // SyncData(uuid: string) {
    //     return fetch(`https://j7m0zxw14k.execute-api.eu-central-1.amazonaws.com/application/sync/data/${uuid}`, {
    //         method: `GET`,
    //         headers: {
    //             Authorization: this.Authorization,
    //         },
    //     })
    //         .then((res) => {
    //             console.log(res.url);
    //             return res.text();
    //         })
    //         .then((obj) => {
    //             console.log(obj ? JSON.parse(obj) : '');
    //             return obj ? JSON.parse(obj) : '';
    //         });
    // }
}
