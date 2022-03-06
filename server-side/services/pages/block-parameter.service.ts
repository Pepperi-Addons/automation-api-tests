import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from '../general.service';

export class BlockParameterService {
    private papiClient: PapiClient;

    constructor(generalService: GeneralService) {
        this.papiClient = generalService.papiClient;
    }
}
