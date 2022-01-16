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
    varKey: string;
    constructor(public service: GeneralService, password?) {
        this.papiClient = service.papiClient;
        this.generalService = service;
        this.varKey = password;
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
        console.log("NOTICE: 'var/distributors/create' API call started - Expected up to 8 minutes wait time");
        do {
            newDistributor = await this.generalService.fetchStatus(
                this.generalService['client'].BaseURL + `/var/distributors/create`,
                {
                    method: `POST`,
                    headers: {
                        Authorization: `Basic ${Buffer.from(this.varKey).toString('base64')}`,
                    },
                    body: JSON.stringify({
                        FirstName: Distributor.FirstName,
                        LastName: Distributor.LastName,
                        Email: Distributor.Email,
                        Company: Distributor.Company,
                        Password: Distributor.Password,
                    }),
                    timeout: 1000 * 60 * 9, //Limit this api call to 9 minutes
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
            //TODO: Remove this when bugs will be solved (DI-19114/19116/19117/19118)
            let isKnown = false;
            if (newDistributor.Body?.Type == 'request-timeout') {
                console.log('Bug exist for this response: (DI-19118)');
                console.log('VAR - Create Distributor - The API call never return');
                throw new Error(`Known Bug: VAR - Create Distributor - The API call never return (DI-19118)`);
            }
            if (newDistributor.Status == 500) {
                if (
                    newDistributor.Body?.fault?.faultstring == 'Object reference not set to an instance of an object.'
                ) {
                    console.log('Bug exist for this response: (DI-19114)');
                    this.generalService.sleep(1000 * 60 * 1);
                    isKnown = true;
                }
                if (
                    newDistributor.Body?.includes(
                        'The requested URL was rejected. Please consult with your administrator.',
                    )
                ) {
                    console.log('Bug exist for this response: (DI-19116)');
                    this.generalService.sleep(1000 * 60 * 1);
                    isKnown = true;
                }
                if (
                    newDistributor.Body?.fault?.faultstring ==
                    'Timeout error - trying to free sql cache and update statistics in order to workaround the issue.'
                ) {
                    console.log('Bug exist for this response: (DI-19117)');
                    this.generalService.sleep(1000 * 60 * 1);
                    isKnown = true;
                }
                if (isKnown) {
                    throw new Error(
                        `Status: ${newDistributor.Status}, Message: ${newDistributor.Body?.fault?.faultstring}`,
                    );
                }
            }
        } while (newDistributor.Status == 500 && maxLoopsCounter > 0);
        return newDistributor;
    }

    async setTrialExpirationDate(distributorTrialObject: DistributorTrialObject) {
        const trialExpirationDate = await this.generalService.fetchStatus(
            this.generalService['client'].BaseURL + `/var/distributors`,
            {
                method: `POST`,
                headers: {
                    Authorization: `Basic ${Buffer.from(this.varKey).toString('base64')}`,
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
