import { FindOptions, PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';
import { Subscription } from '@pepperi-addons/papi-sdk';

export class PepperiNotificationServiceService {
    papiClient: PapiClient;

    constructor(public generalService: GeneralService) {
        this.papiClient = generalService.papiClient;
    }

    subscribe(Subscription: Subscription): Promise<Subscription> {
        return this.papiClient.notification.subscriptions.upsert(Subscription);
    }

    getSubscriptionsbyKey(key: string): Promise<Subscription[]> {
        return this.papiClient.notification.subscriptions.find({where: `Key='${key}'`});
    }

    findSubscriptions(options?: FindOptions): Promise<Subscription[]> {
        return this.papiClient.notification.subscriptions.find(options);
    }
}
