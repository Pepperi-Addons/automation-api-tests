import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export class ConfigurationsService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    async getSchemes() {
        const configSchemes = await this.generalService.fetchStatus('/addons/configurations/schemes');
        return configSchemes;
    }
}
