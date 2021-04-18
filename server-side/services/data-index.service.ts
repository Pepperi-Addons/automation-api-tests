import { PapiClient /*FindOptions*/ } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';
import fetch from 'node-fetch';

type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

export class DataIndexService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    apiCallWithFetch(method: HttpMethod, URI: string, body?: any) {
        return fetch(`${this.generalService['client'].BaseURL}${URI}`, {
            method: `${method}`,
            headers: {
                Authorization: `Bearer ${this.generalService.papiClient['options'].token}`,
            },
            body: JSON.stringify(body),
        })
            .then(async (response) => {
                return {
                    Status: response.status,
                    Body: await response.json(),
                };
            })
            .then((res) => {
                return {
                    Status: res.Status,
                    Size: res.Body.length,
                    Body: res.Body,
                };
            });
    }

    // getDataViewByID(id: number) {
    //     return this.papiClient.metaData.dataViews.get(id);
    // }

    // getDataViews(options?: FindOptions) {
    //     return this.papiClient.metaData.dataViews.find(options);
    // }

    // getAllDataViews(options?: FindOptions) {
    //     return this.papiClient.metaData.dataViews.iter(options).toArray();
    // }

    // postDataView(dataView: DataView) {
    //     return this.papiClient.metaData.dataViews.upsert(dataView);
    // }

    // postDataViewBatch(dataViewArr: DataView[]) {
    //     return this.papiClient.metaData.dataViews.batch(dataViewArr);
    // }
}
