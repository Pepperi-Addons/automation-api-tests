import { PapiClient, Item, FindOptions } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface DistributorObject {
    FirstName: string;
    LastName: string;
    Email: string;
    Company: string;
    Password: string;
}

export interface DistributorTrialObject {
    UUID: string;
    TrialExpirationDateTime: string;
}

export class DistributorService {
    papiClient: PapiClient;
    generalService: GeneralService;
    request: any;

    constructor(public service: GeneralService, request = {}) {
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

    resetUserPassword(UserID) {
        return this.papiClient.post('/Users/' + UserID + '/reset_password');
    }

    async createDistributor(Distributor: DistributorObject) {
        let newDistributor;
        let maxLoopsCounter = 16;
        console.log("NOTICE: 'var/distributors/create' API call started - Expected 8 minutes wait time");
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
            if (newDistributor.Status == 200) {
                console.log({ CreateStatus: newDistributor.Status, CreateBody: newDistributor.Body });
            } else {
                console.log({
                    CreateStatus: newDistributor.Status,
                    CreateBody: newDistributor.Body?.Text,
                    CreateError: newDistributor.Body?.fault?.faultstring,
                });
            }
            if (newDistributor.Status == 504) {
                console.log(
                    'Mandatory sleep of 7 minutes after timeout - before continue as if the distributors create',
                );
                this.generalService.sleep(1000 * 60 * 7);
            }
        } while ((newDistributor.Status != 200 || newDistributor.Status != 504) && maxLoopsCounter > 0);
        return newDistributor;
    }

    async setTrialExpirationDate(distributorTrialObject: DistributorTrialObject) {
        const trialExpirationDate = await this.generalService.fetchStatus(
            this.generalService['client'].BaseURL + `/var/distributors`,
            {
                method: `POST`,
                headers: {
                    Authorization: this.request.body.varKey,
                },
                body: JSON.stringify({
                    UUID: distributorTrialObject.UUID,
                    TrialExpirationDateTime: distributorTrialObject.TrialExpirationDateTime,
                }),
            },
        );
        console.log({ CreateStatus: trialExpirationDate.Status, CreateBody: trialExpirationDate.Body });
        return trialExpirationDate;
    }

    async runExpirationProtocol() {
        const expirationResponse = await this.papiClient.post(
            `/addons/api/async/00000000-0000-0000-0000-000000000a91/expiration/manual_test_expired_distributors`,
        );
        return await this.generalService.getAuditLogResultObjectIfValid(expirationResponse.URI);
    }
}
