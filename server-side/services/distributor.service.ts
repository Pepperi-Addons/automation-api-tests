import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService, { ConsoleColors } from './general.service';

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

    resetUserPassword(UserID) {
        return this.papiClient.post('/Users/' + UserID + '/reset_password');
    }

    async createDistributor(Distributor: DistributorObject) {
        let newDistributor;
        let maxLoopsCounter = 16;
        let startTime;
        let endTime;
        // console.log("NOTICE: 'var/distributors/create' API call started - Expect up to 15 minutes wait time");
        console.log("NOTICE: 'var/distributors/create' API call started");
        do {
            startTime = new Date().getTime();
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
                    // timeout: 1000 * 60 * 2, // THIS DOESN'T LIMIT THE API CALL - BUT PROLONGS IT!!!!
                },
            );
            endTime = new Date().getTime();
            console.log(
                `NOTICE: 'var/distributors/create' API call finished - Took ${(
                    (endTime - startTime) /
                    1000 /
                    60
                ).toFixed(1)} Minutes`,
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
            let isNotKnown = true;
            if (newDistributor.Body?.Type == 'request-timeout') {
                console.log('%cBug exist for this response: (DI-19118)', ConsoleColors.BugSkipped);
                console.log('%cVAR - Create Distributor - The API call never return', ConsoleColors.BugSkipped);
                //TODO: Un comment this throw when the bug will be solved
                // throw new Error(`Known Bug: VAR - Create Distributor - The API call never return (DI-19118)`);
            }
            if (newDistributor.Status == 500) {
                if (
                    newDistributor.Body?.fault?.faultstring == 'Object reference not set to an instance of an object.'
                ) {
                    console.log('%cBug exist for this response: (DI-19114)', ConsoleColors.BugSkipped);
                    this.generalService.sleep(1000 * 60 * 1);
                    isNotKnown = false;
                }
                if (
                    JSON.stringify(newDistributor.Body).includes(
                        'The requested URL was rejected. Please consult with your administrator.',
                    )
                ) {
                    console.log('%cBug exist for this response: (DI-19116)', ConsoleColors.BugSkipped);
                    // this.generalService.sleep(1000 * 60 * 1);
                    isNotKnown = false;
                    break; //in this case the server wont return a 200 - but the user is existing
                }
                if (
                    newDistributor.Body?.fault?.faultstring ==
                    'Timeout error - trying to free sql cache and update statistics in order to workaround the issue.'
                ) {
                    console.log('%cBug exist for this response: (DI-19117)', ConsoleColors.BugSkipped);
                    this.generalService.sleep(1000 * 60 * 1);
                    isNotKnown = false;
                }
                if (isNotKnown) {
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
        return await this.generalService.getAuditLogResultObjectIfValid(expirationResponse.URI, 45);
    }
}
