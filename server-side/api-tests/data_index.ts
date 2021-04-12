import { ElasticSearchService } from './../services/elastic-search.service';
import GeneralService, { TesterFunctions } from '../services/general.service';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

export async function DataIndexTests(generalService: GeneralService, tester: TesterFunctions) {
    const elasticSearchService = new ElasticSearchService(generalService.papiClient);

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    describe('Pepperi Notification Service Tests Suites', () => {
        describe('Endpoints', () => {
            describe('POST', () => {
                it('Create transaction', async () => {
                    const oren = await elasticSearchService.getElasticSearch('all_activities', {
                        page_size: -1,
                    });
                    console.log({ oren: oren });
                    expect(JSON.stringify(oren)).to.include('oren');
                });

                it('Create transaction', async () => {
                    const oren = await elasticSearchService.getElasticSearch('transaction_lines', {
                        page_size: -1,
                    });
                    console.log({ oren: oren });
                    expect(JSON.stringify(oren)).to.include('oren');
                });

                it('Get totals', async () => {
                    const getTotalsData = await elasticSearchService.getTotals('all_activities', {
                        select: ['sum(Status)', 'avg(Status)', 'min(Status)', 'max(Status)', 'count(Status)'],
                    });
                    console.log({ getTotalsData: getTotalsData });
                    expect(getTotalsData[0]).to.have.property('avg_RetailPrice').that.equals(243.5);
                });

                it('Get totals with group by', async () => {
                    const getTotalsData = await elasticSearchService.getTotals('all_activities', {
                        select: ['sum(Status)', 'avg(Status)', 'min(Status)', 'max(Status)', 'count(Status)'],
                        group_by: 'Catalog.ExternalID',
                    });
                    console.log({ getTotalsData: getTotalsData });
                    expect(getTotalsData[0]).to.have.property('avg_RetailPrice').that.equals(243.5);
                });
            });
        });
    });
}
