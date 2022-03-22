import {
    PageConfigurationParameterFilter,
    PageConfigurationParameterString,
    PapiClient,
    ResourceType,
} from '@pepperi-addons/papi-sdk';
import GeneralService from '../general.service';

export interface IBlockStringParameter extends PageConfigurationParameterString {
    Value?: any;
}

export interface IBlockFilterParameter extends PageConfigurationParameterFilter {
    Value?: IFilter[];
}

export interface IFilter {
    resource?: ResourceType;
    filter?: {
        FieldType?: string;
        ApiName?: string;
        Operation?: string;
        Values?: Array<any>;
    };
}

export class BlockParameterService {
    private papiClient: PapiClient;

    constructor(generalService: GeneralService) {
        this.papiClient = generalService.papiClient;
    }
}
