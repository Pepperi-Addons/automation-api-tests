import { PapiClient, DataView, FindOptions } from '@pepperi-addons/papi-sdk';

export class DataVisualisationService {
    constructor(public papiClient: PapiClient) {}

    getDataViewByID(id: number) {
        return this.papiClient.metaData.dataViews.get(id);
    }

    getDataViews(options?: FindOptions) {
        return this.papiClient.metaData.dataViews.find(options);
    }

    getAllDataViews(options?: FindOptions) {
        return this.papiClient.metaData.dataViews.iter(options).toArray();
    }

    postDataView(dataView: DataView) {
        return this.papiClient.metaData.dataViews.upsert(dataView);
    }

    postDataViewBatch(dataViewArr: DataView[]) {
        return this.papiClient.metaData.dataViews.batch(dataViewArr);
    }
}
