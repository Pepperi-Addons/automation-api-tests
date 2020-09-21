import { PapiClient, DataView } from '@pepperi-addons/papi-sdk';

export class DataViewsService {
    constructor(public papiClient: PapiClient) {}

    getDataViewByID(id: number) {
        return this.papiClient.metaData.dataViews.get(id);
    }

    getDataViews(options?: Record<string, unknown>) {
        return this.papiClient.metaData.dataViews.find(options);
    }

    getAllDataViews(options?: Record<string, unknown>) {
        return this.papiClient.metaData.dataViews.iter(options).toArray();
    }

    postDataView(dataView: DataView) {
        return this.papiClient.metaData.dataViews.upsert(dataView);
    }

    postDataViewBatch(dataView: DataView[]) {
        return this.papiClient.metaData.dataViews.batch(dataView);
    }
}
