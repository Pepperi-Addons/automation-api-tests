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
        let newDistributor;
        let maxLoopsCounter = 16;
        do {
            newDistributor = await this.generalService.fetchStatus(
                this.generalService['client'].BaseURL + `/var/distributors/create`,
                {
                    method: `POST`,
                    headers: {
                        Authorization: this.request.body.varKey,
                    },
                    body: JSON.stringify({
                        FirstName: Distributor.FirstName,
                        LastName: Distributor.LastName,
                        Email: Distributor.Email,
                        Company: Distributor.Company,
                        Password: Distributor.Password,
                    }),
                },
            );
            maxLoopsCounter--;
            console.log(newDistributor.Status, newDistributor.Body);
            if (newDistributor.Status == 504) {
                this.generalService.sleep(1000 * 60 * 6);
            }
        } while (newDistributor.Status != 200 && maxLoopsCounter > 0);

        console.log(newDistributor.Status, newDistributor.Body?.Text, newDistributor.Body?.fault?.faultstring);
        return newDistributor;
    }
}
