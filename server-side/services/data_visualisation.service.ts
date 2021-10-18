import { PapiClient } from '@pepperi-addons/papi-sdk';
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

const addonVersion = '0.0.30';

export class DataVisualisationService {
    constructor(public papiClient: PapiClient) {}

    getCharts() {
        return this.papiClient.get(
            `/addons/api/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/${addonVersion}/api/charts`,
        );
    }

    getChartsAsync() {
        return this.papiClient.get(
            `/addons/api/async/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/${addonVersion}/api/charts`,
        );
    }

    postChartAsync(generalService: GeneralService, chart: Chart, argHeaders?: any) {
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
