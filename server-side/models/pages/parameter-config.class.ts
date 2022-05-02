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
    Parameters: BlockParamsConfig;
    BlockId: string;
}

export interface ChartData {
    query: { Key: string } | null,
    useDropShadow: boolean,
    dropShadow: {
        type: string,
        intensity: number
    },
    useBorder: boolean,
    border: {
        color: string,
        opacity: string
    },
    executeQuery: boolean,
    chart: {
        Key: string,
        ScriptURI: string
    },
    useLabel: boolean,
    label: string,
    height: number
}

export class BlockParamsConfig extends Array<IBlockFilterParameter | IBlockStringParameter> { }
