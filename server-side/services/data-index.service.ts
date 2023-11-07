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

    async cleanDataIndexAsInUI() {
        return await this.generalService.fetchStatus(
            '/addons/api/10979a11-d7f4-41df-8993-f06bfd778304/data_index_ui_api/delete_index',
            {
                method: 'POST',
                body: JSON.stringify({}),
            },
        );
    }

    async publishDataIndex() {
        const hardcodedBody = {
            all_activities_fields: [
                { fieldID: 'InternalID', type: 'Integer' },
                { fieldID: 'UUID', type: 'String' },
                { fieldID: 'Type', type: 'String' },
                { fieldID: 'StatusName', type: 'String' },
                { fieldID: 'ActionDateTime', type: 'DateTime' },
                { fieldID: 'Account.InternalID', type: 'Integer' },
                { fieldID: 'Account.UUID', type: 'String' },
                { fieldID: 'Account.ExternalID', type: 'String' },
                { fieldID: 'Account.Name', type: 'String' },
                { fieldID: 'Agent.InternalID', type: 'Integer' },
                { fieldID: 'Agent.Name', type: 'String' },
                { fieldID: 'ExternalID', type: 'String' },
                { fieldID: 'TaxPercentage', type: 'Double' },
                { fieldID: 'Remark', type: 'String' },
                { fieldID: 'CreationDateTime', type: 'DateTime' },
                { fieldID: 'SubTotal', type: 'Double' },
                { fieldID: 'Status', type: 'Integer' },
                { fieldID: 'DiscountPercentage', type: 'Double' },
                { fieldID: 'Account.City', type: 'String' },
                { fieldID: 'Account.Country', type: 'String' },
                { fieldID: 'Account.Status', type: 'Integer' },
                { fieldID: 'Agent.ExternalID', type: 'String' },
                { fieldID: 'Agent.FirstName', type: 'String' },
                { fieldID: 'Agent.Mobile', type: 'String' },
            ],
            transaction_lines_fields: [
                { fieldID: 'InternalID', type: 'Integer' },
                { fieldID: 'UUID', type: 'String' },
                { fieldID: 'Item.InternalID', type: 'Integer' },
                { fieldID: 'Item.ExternalID', type: 'String' },
                { fieldID: 'Item.Name', type: 'String' },
                { fieldID: 'Item.MainCategory', type: 'String' },
                { fieldID: 'Transaction.InternalID', type: 'Integer' },
                { fieldID: 'Transaction.StatusName', type: 'String' },
                { fieldID: 'Transaction.ActionDateTime', type: 'DateTime' },
                { fieldID: 'Transaction.Account.InternalID', type: 'Integer' },
                { fieldID: 'Transaction.Account.UUID', type: 'String' },
                { fieldID: 'Transaction.Account.ExternalID', type: 'String' },
                { fieldID: 'Transaction.Account.Name', type: 'String' },
                { fieldID: 'Transaction.Type', type: 'String' },
                { fieldID: 'Transaction.Agent.InternalID', type: 'Integer' },
                { fieldID: 'Transaction.Agent.Name', type: 'String' },
                { fieldID: 'LineNumber', type: 'String' },
                { fieldID: 'TotalUnitsPriceAfterDiscount', type: 'Double' },
                { fieldID: 'TotalUnitsPriceBeforeDiscount', type: 'Double' },
                { fieldID: 'UnitDiscountPercentage', type: 'Double' },
                { fieldID: 'CreationDateTime', type: 'DateTime' },
                { fieldID: 'Transaction.ExternalID', type: 'String' },
                { fieldID: 'Transaction.Remark', type: 'String' },
                { fieldID: 'Transaction.CreationDateTime', type: 'DateTime' },
                { fieldID: 'Transaction.SubTotal', type: 'Double' },
                { fieldID: 'Transaction.Status', type: 'Integer' },
                { fieldID: 'Transaction.DiscountPercentage', type: 'Double' },
                { fieldID: 'Transaction.Account.ZipCode', type: 'String' },
                { fieldID: 'Transaction.Account.Status', type: 'Integer' },
                { fieldID: 'Transaction.Account.City', type: 'String' },
                { fieldID: 'Transaction.Agent.ExternalID', type: 'String' },
                { fieldID: 'Transaction.Agent.FirstName', type: 'String' },
                { fieldID: 'Transaction.Agent.Mobile', type: 'String' },
            ],
            RunTime: null,
        };
        return await this.generalService.fetchStatus(
            '/addons/api/10979a11-d7f4-41df-8993-f06bfd778304/data_index_ui_api/publish',
            {
                method: 'POST',
                body: JSON.stringify(hardcodedBody),
            },
        );
    }

    async getProgressOfDataIndexBuilding() {
        return await this.generalService.fetchStatus(
            '/addons/api/10979a11-d7f4-41df-8993-f06bfd778304/data_index_ui_api/get_ui_data',
            {
                method: 'GET',
            },
        );
    }
}
