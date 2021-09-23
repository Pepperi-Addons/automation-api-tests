import { PapiClient, DataView, FindOptions } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface Chart {
    CreationDateTime?: string;
    Hidden?: boolean;
    ModificationDateTime?: string;
    Key?:string;
    Description: string;
    Name:string;
    ReadOnly:boolean;
    ScriptURI:string;
    Type: string;
    // [key: string]: any;
}


export class DataVisualisationService {
    constructor(public papiClient: PapiClient) { }

    getCharts(options?: FindOptions) {
        return this.papiClient.get('/addons/api/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/0.0.21/api/charts');
    }

    getChartsAsync(options?: FindOptions) {
        return this.papiClient.get('/addons/api/async/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/0.0.21/api/charts');
    }

    postChartAsync(generalService: GeneralService, chart: any, argHeaders?: any) {
        if (argHeaders)
            return generalService
                .fetchStatus('/addons/api/async/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/0.0.21/api/charts', {
                    method: 'POST',
                    body: JSON.stringify(chart),
                    headers: argHeaders
                });
        else
            return generalService
                .fetchStatus('/addons/api/async/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/0.0.21/api/charts', {
                    method: 'POST',
                    body: JSON.stringify(chart)
                });
    }
}
