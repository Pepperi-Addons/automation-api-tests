import { PapiClient, DataView } from '@pepperi-addons/papi-sdk';

export class DataViewsService {
    constructor(public papiClient: PapiClient) {}

    getDataViewByID(id: number) {
        return this.papiClient.metaData.dataViews.get(id);
    }

    getDataView(options?: Record<string, unknown>) {
        return this.papiClient.metaData.dataViews.find(options);
    }

    postDataView(dataView: DataView) {
        return this.papiClient.metaData.dataViews.upsert(dataView);
    }
}
