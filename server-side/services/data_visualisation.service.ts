import { PapiClient, AuditLog } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface Chart {
    CreationDateTime?: string;
    Hidden?: boolean;
    ModificationDateTime?: string;
    Key?: string;
    Description: string;
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

    //This should be replace with getCharts() that will used from the sdk and will always return Chart[] => return this.papiClient.charts.find();
    async getCharts(): Promise<Chart[]> {
        const chartResponse = await this.papiClient.get(
            `/addons/api/async/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/api/charts?page_size=-1`,
        );
        const chartAuditLogAsync: AuditLog = await this.generalService.getAuditLogResultObjectIfValid(
            chartResponse.URI,
            40,
        );
        const jsonDataFromAuditLog: Chart[] = JSON.parse(chartAuditLogAsync.AuditInfo.ResultObject);
        return jsonDataFromAuditLog;
    }

    postChart(chart: Chart): Promise<Chart> {
        return this.papiClient.post(`/addons/api/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/api/charts`, chart);
    }
}
