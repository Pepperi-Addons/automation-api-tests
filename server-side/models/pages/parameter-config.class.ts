import {
    PageConfigurationParameterFilter,
    PageConfigurationParameterString,
    ResourceType,
} from '@pepperi-addons/papi-sdk';

export interface IBlockStringParameter extends PageConfigurationParameterString {
    Value?: any;
}

export interface IBlockFilterParameter extends PageConfigurationParameterFilter {
    Value: IFilter[];
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

export interface TestConfiguration {
    Parameters: Array<IBlockStringParameter | IBlockFilterParameter>,
    BlockId: string
}

export class BlockParamConfig extends Array<IBlockFilterParameter | IBlockStringParameter> {}
