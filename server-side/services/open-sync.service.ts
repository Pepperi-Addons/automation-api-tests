import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface SyncSource {
    AddonUUID: string;
    LastSyncDateTime: string;
}

export class OpenSyncService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    async getSyncedConfigurationObjectBasedOnResource(sourcesToUse: SyncSource[], modificationDateTime: string) {
        const bodyToSend = {
            Sources: sourcesToUse,
            ModificationDateTime: modificationDateTime, //'1970-11-23T14:39:50.781Z',
            Format: 'JSON',
        };
        console.log(`==> sent body is: ${JSON.stringify(bodyToSend)}`);
        const openSyncResponse = await this.generalService.fetchStatus(
            '/addons/api/5122dc6d-745b-4f46-bb8e-bd25225d350a/open-sync/sync',
            {
                method: 'POST',
                body: JSON.stringify(bodyToSend),
            },
        );
        console.log(`==> response from '/open-sync/sync' is: ${JSON.stringify(openSyncResponse)}`);
        return openSyncResponse;
    }
}
