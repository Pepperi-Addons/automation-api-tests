import { PapiClient, DataView, FindOptions } from '@pepperi-addons/papi-sdk';

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
// [
// 	{ 
// 		"Key": "1234-567890-43213", // generate new guid   
// 		"Name": "my-chart", 
// 		"Description": "my chart",
// 		"Type": "Single"|"Series"|"MultiSeries", // mandatory on create
		
// 		// http or base 64
// 		"ScriptURI": "https://cdn.pepperi.com/1110703/CustomizationFile/1.js" 
// 		"ReadOnly": true
// 	}
// ]
export class DataVisualisationService {
    constructor(public papiClient: PapiClient) {}

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

    // postDataView(dataView: DataView) {
    //     return this.papiClient.metaData.dataViews.upsert(dataView);
    // }

    // postDataViewBatch(dataViewArr: DataView[]) {
    //     return this.papiClient.metaData.dataViews.batch(dataViewArr);
    // }
}
