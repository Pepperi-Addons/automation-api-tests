import { PapiClient, DataView, FindOptions } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface Chart {
    // InternalID?: number;
    // UUID?: string;
    // Archive?: boolean;
    // CreationDateTime?: string;
    // DeliveryDate?: string;
    // Hidden?: boolean;
    // LineNumber: number;
    // ModificationDateTime?: string;
    // TotalUnitsPriceAfterDiscount?: number;
    // TotalUnitsPriceBeforeDiscount?: number;
    // UnitDiscountPercentage?: number;
    // UnitPrice?: number;
    // UnitPriceAfterDiscount?: number;
    // UnitsQuantity: number;
    // Item?: NestedObject;
    // Transaction?: NestedObject;

    [key: string]: any;
}


export class DataVisualisationService {
    constructor(public papiClient: PapiClient) { }

    // getDataViewByID(id: number) {
    //     return this.papiClient.metaData.dataViews.get(id);
    // }

    getCharts(options?: FindOptions) {
        return this.papiClient.get('/addons/api/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/0.0.21/api/charts');
    }

    getChartsAsync(options?: FindOptions) {
        return this.papiClient.get('/addons/api/async/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/0.0.21/api/charts');
    }

    // getAllDataViews(options?: FindOptions) {
    //     return this.papiClient.metaData.dataViews.iter(options).toArray();
    // }

    // postChart(chart: any) {
    //     // return this.papiClient.metaData.dataViews.upsert(chart);
    //     return this.papiClient
    //         .post('/addons/api/async/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/0.0.21/api/charts', chart);
    //     ;
    // }

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

    // postDataViewBatch(dataViewArr: DataView[]) {
    //     return this.papiClient.metaData.dataViews.batch(dataViewArr);
    // }
}
