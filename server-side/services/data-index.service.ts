import { PapiClient /*FindOptions*/ } from '@pepperi-addons/papi-sdk';
import { ElasticSearchService } from './../services/elastic-search.service';

const stringFieldsArr: string[] = ['City'];
const numberFieldsArr: string[] = ['ExternalID'];

export class DataIndexService {
    elasticSearchService: ElasticSearchService;

    constructor(public papiClient: PapiClient) {
        this.elasticSearchService = new ElasticSearchService(papiClient);
    }

    async createTotalsMapOfField(fieldName: string): Promise<Map<string, number>> {
        const sortedAndCountedMap: Map<string, number> = new Map();
        const totlasArr = await this.elasticSearchService.getTotals('all_activities', {
            select: [`count(${fieldName})`],
            group_by: fieldName,
        });

        if (totlasArr.length <= 0) {
            throw new Error('Empty array response from elastic search');
        }

        totlasArr.forEach((fieldCount) => {
            sortedAndCountedMap.set(fieldCount[Object.keys(fieldCount)[0]], fieldCount[Object.keys(fieldCount)[1]]);
        });
        return sortedAndCountedMap;
    }

    createTestDataForField(fieldName: string): any {
        if (stringFieldsArr.includes(fieldName)) {
            return Math.floor(Math.random() * 100000000000).toString(36);
        } else if (numberFieldsArr.includes(fieldName)) {
            return Math.floor(Math.random() * 1000000);
        } else {
            throw new Error('NotImplementedException');
        }
    }
    // getDataViewByID(id: number) {
    //     return this.papiClient.metaData.dataViews.get(id);
    // }

    // getDataViews(options?: FindOptions) {
    //     return this.papiClient.metaData.dataViews.find(options);
    // }

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
