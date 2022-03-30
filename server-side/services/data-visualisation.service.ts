import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface Chart {
    Type?: string;
    CreationDateTime?: string;
    Hidden?: boolean;
    ModificationDateTime?: string;
    Key?: string;
    Description?: string; //just to make sure i could send w\o any desc. although rn its impossible (returns 400)
    FileID?: string;
    Name: string;
    ReadOnly: boolean;
    ScriptURI: any;
    UID?: string;
}

export class DataVisualisationService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    //This should be replace with return this.papiClient.charts.find(); once SDK is developed
    async getCharts(): Promise<Chart[]> {
        const chartResponse = await this.papiClient.get('/charts?page_size=-1');
        return chartResponse;
    }

    postChart(chart: Chart): Promise<Chart> {
        return this.papiClient.post('/charts', chart);
    }
}
