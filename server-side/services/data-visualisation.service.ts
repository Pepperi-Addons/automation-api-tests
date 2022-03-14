import { PapiClient, AuditLog } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface Chart {
    CreationDateTime?: string;
    Hidden?: boolean;
    ModificationDateTime?: string;
    Key?: string;
    Description?: string;
    FileID?: string;
    Name: string;
    ReadOnly: boolean;
    ScriptURI: any;
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
        const chartResponse = await this.papiClient.get(
            '/charts?page_size=-1',
        );
        return chartResponse;
    }

    postChart(chart: Chart): Promise<Chart> {
        return this.papiClient.post('/charts', chart);
    }
}
