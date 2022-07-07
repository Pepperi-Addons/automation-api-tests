import /*FindOptions*/ '@pepperi-addons/papi-sdk';
import { ElasticSearchService } from './../services/elastic-search.service';
import GeneralService from './general.service';

const stringFieldsArr: string[] = ['City', 'Country', 'Remark'];
const numberFieldsArr: string[] = ['ExternalID'];

export class DataIndexService {
    elasticSearchService: ElasticSearchService;

    constructor(public generalService: GeneralService) {
        this.elasticSearchService = new ElasticSearchService(generalService);
    }

    async createTotalsMapOfField(fieldName: string): Promise<Map<string, number>> {
        const sortedAndCountedMap: Map<string, number> = new Map();
        const totlasArr = await this.elasticSearchService.getTotals('all_activities', {
            select: [`count(${fieldName})`],
            group_by: fieldName,
        });
        // debugger;
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
            if (fieldName == 'Country') {
                return 'IL';
            }
            return Math.floor(Math.random() * 100000000000).toString(36);
        } else if (numberFieldsArr.includes(fieldName)) {
            return Math.floor(Math.random() * 1000000);
        } else {
            throw new Error(`NotImplementedException - Field Name: ${fieldName}`);
        }
    }

    cleanDataIndex() {
        return this.generalService.papiClient.post(
            '/addons/api/async/10979a11-d7f4-41df-8993-f06bfd778304/data_index_ui_api/delete_index',
        );
    }

    exportDataToDataIndex(data) {
        return this.generalService.papiClient.post(
            '/addons/api/async/10979a11-d7f4-41df-8993-f06bfd778304/data_index_ui_api/save_ui_data',
            data,
        );
    }

    rebuildAllActivities() {
        return this.generalService.papiClient.post(
            '/addons/api/async/10979a11-d7f4-41df-8993-f06bfd778304/data_index/all_activities_rebuild',
        );
    }

    pollAllActivities() {
        return this.generalService.papiClient.post(
            '/addons/api/async/10979a11-d7f4-41df-8993-f06bfd778304/data_index/all_activities_polling',
        );
    }

    rebuildTransactionLines() {
        return this.generalService.papiClient.post(
            '/addons/api/async/10979a11-d7f4-41df-8993-f06bfd778304/data_index/transaction_lines_rebuild',
        );
    }

    pollTransactionLines() {
        return this.generalService.papiClient.post(
            '/addons/api/async/10979a11-d7f4-41df-8993-f06bfd778304/data_index/transaction_lines_polling',
        );
    }
}
