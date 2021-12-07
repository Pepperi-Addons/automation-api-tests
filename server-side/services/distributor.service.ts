import {
    PapiClient,
    Account,
    ApiFieldObject,
    GeneralActivity,
    Transaction,
    Item,
    FindOptions,
    User,
    Contact,
} from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface DistributorObject {
    FirstName: string;
    LastName: string;
    Email: string;
    Company: string;
    Password: string;
}

export class DistributorService {
    papiClient: PapiClient;
    generalService: GeneralService;
    request: any;

    constructor(public service: GeneralService, request) {
        this.papiClient = service.papiClient;
        this.generalService = service;
        this.request = request;
    }

    getItems(options?: FindOptions): Promise<Item[]> {
        return this.papiClient.items.find(options);
    }

    postItem(item: Item): Promise<Item> {
        return this.papiClient.items.upsert(item);
    }

    async createDistributor(Distributor: DistributorObject) {
        const newDistributor = await this.generalService.fetchStatus(
            this.generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                `/var/distributors/create?firstName=${Distributor.FirstName}&lastName=${Distributor.LastName}&email=${Distributor.Email}&company=${Distributor.Company}&password=${Distributor.Password}`,
            {
                method: `POST`,
                headers: {
                    Authorization: this.request.body.varKey,
                },
            },
        );
        console.log(newDistributor.Status, newDistributor.Body.Text, newDistributor.Body.fault.faultstring);
        return newDistributor;
    }
}
