import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService, { FetchStatusResponse } from './general.service';

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

export interface AuditLogJSON {
    errorMessage: string;
    resultObject: any;
    success: string;
}

export interface AsyncResponse {
    URI: string;
}

const addonVersion = '0.0.31';

export class DataVisualisationService {
    constructor(public papiClient: PapiClient) {}

    getCharts(): Promise<Chart[]> {
        return this.papiClient.get(
            `/addons/api/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/${addonVersion}/api/charts?page_size=-1`,
        );
    }
    //?page_size=-1
    getChartsAsync(): Promise<AsyncResponse> {
        return this.papiClient.get(
            `/addons/api/async/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/${addonVersion}/api/charts?page_size=-1`,
        );
    }

    postChartAsync(generalService: GeneralService, chart: Chart, argHeaders?: any): Promise<FetchStatusResponse> {
        if (argHeaders)
            return generalService.fetchStatus(
                `/addons/api/async/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/${addonVersion}/api/charts`,
                {
                    method: 'POST',
                    body: JSON.stringify(chart),
                    headers: argHeaders,
                },
            );
        else
            return generalService.fetchStatus(
                `/addons/api/async/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/${addonVersion}/api/charts`,
                {
                    method: 'POST',
                    body: JSON.stringify(chart),
                },
            );
    }
}
