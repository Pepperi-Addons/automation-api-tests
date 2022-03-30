import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService, { ResourceTypes } from './general.service';

export interface DataQuerie {
    CreationDateTime?: string;
    Hidden: boolean;
    Key: string;
    ModificationDateTime: string;
    Name: string;
    Series: QuerySeries[];
}

export interface QuerySeries {
    Key: string;
    Name: string;
    Resource: ResourceTypes;
    Label: string;
    Top: Top;
    AggregatedFields: AggregatedFields[];
    AggregatedParams: AggregatedParams[];
    BreakBy: BreakBy;
    Filter: any;
    Scope: Scope;
    DynamicFilterFields: any[];
    GroupBy: GroupBy[];
}

interface Top {
    Max: number;
    Ascending: boolean;
}
interface AggregatedFields {
    Aggregator: string;
    FieldID: string;
    Alias: string;
    Script: string;
}
interface AggregatedParams {
    FieldID: string;
    Aggregator: String;
    Name: string;
}
interface BreakBy {
    FieldID: string;
    Interval: string;
    Format: string;
}
interface Scope {
    User: string;
    Account: string;
}
interface GroupBy {
    FieldID: string;
    Interval: string;
    Format: string;
    Alias: string;
}

export class DataQueriesService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    //This should be replace with return this.papiClient.charts.find(); once SDK is developed
    async getQueries(): Promise<DataQuerie[]> {
        const queriesResponse = await this.papiClient.get('/data_queries?page_size=-1');
        return queriesResponse;
    }

    postChart(dataQuerie: DataQuerie): Promise<DataQuerie> {
        return this.papiClient.post('/charts', dataQuerie);
    }
}
