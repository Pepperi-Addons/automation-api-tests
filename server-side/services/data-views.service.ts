import { PapiClient, DataView } from '@pepperi-addons/papi-sdk';
interface FindOptions {
    fields?: string[];
    where?: string;
    orderBy?: string;
    page?: number;
    page_size?: number;
    include_nested?: boolean;
    full_mode?: boolean;
    include_deleted?: boolean;
    is_distinct?: boolean;
}
export class DataViewsService {
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

    postDataViewBatch(dataView: DataView[]) {
        return this.papiClient.metaData.dataViews.batch(dataView);
    }
}
