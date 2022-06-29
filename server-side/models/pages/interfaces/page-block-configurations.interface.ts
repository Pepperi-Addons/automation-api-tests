import {
    PageConfigurationParameterFilter,
    PageConfigurationParameterString,
    ResourceType,
} from '@pepperi-addons/papi-sdk';
import { BlockParamsConfig } from '../index';

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

export interface PageTesterConfig {
    Parameters: BlockParamsConfig;
    BlockId: string;
}
