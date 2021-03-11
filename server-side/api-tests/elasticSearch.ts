import GeneralService, { TesterFunctions } from '../services/general.service';
import { ElasticSearchService } from '../services/elasticSearch.service';

export async function ElasticSearchTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = new ElasticSearchService(generalService.papiClient);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const ElasticData = [
        {
            Category: ['xbox', 'console'],
            Distributor: 'Test Dist 1',
            ElasticSearchSubType: 'Test Data',
            UUID: 'xbox 360',
            Color: ['Green', 'Black'],
            Brand: 'Microsoft',
            RetailPrice: 99.0,
            PriceLevel: 79.0,
            IsInStock: false,
            Sort: 1,
        },
        {
            Category: ['xbox', 'console'],
            Distributor: 'Test Dist 1',
            ElasticSearchSubType: 'Test Data',
            UUID: 'xbox one',
            Color: ['White'],
            Brand: 'Microsoft',
            RetailPrice: 129.99,
            PriceLevel: 100.0,
            IsInStock: true,
            Sort: 2,
        },
        {
            Category: ['xbox', 'console'],
            Distributor: 'Test Dist 1',
            ElasticSearchSubType: 'Test Data',
            UUID: 'xbox series x',
            Color: ['Black'],
            Brand: 'Microsoft',
            RetailPrice: 500.0,
            PriceLevel: 450.0,
            IsInStock: true,
            Sort: 3,
        },
        {
            Category: ['Playstation', 'console'],
            Distributor: 'Test Dist 1',
            ElasticSearchSubType: 'Test Data',
            UUID: 'ps3',
            Color: ['Black'],
            Brand: 'Sony',
            RetailPrice: 99.99,
            PriceLevel: 79.0,
            IsInStock: false,
            Sort: 4,
        },
        {
            Category: ['Playstation', 'console'],
            Distributor: 'Test Dist 1',
            ElasticSearchSubType: 'Test Data',
            UUID: 'ps4',
            Color: ['Black'],
            Brand: 'Sony',
            RetailPrice: 129.99,
            PriceLevel: 100.0,
            IsInStock: true,
            Sort: 5,
        },
        {
            Category: ['Playstation', 'console'],
            Distributor: 'Test Dist 1',
            ElasticSearchSubType: 'Test Data',
            UUID: 'ps5',
            Color: ['White', 'Blue'],
            Brand: 'Sony',
            RetailPrice: 450.0,
            PriceLevel: 400.0,
            IsInStock: false,
            Sort: 6,
        },
        {
            Category: ['Switch', 'console'],
            Distributor: 'Test Dist 1',
            ElasticSearchSubType: 'Test Data',
            UUID: 'switch',
            Color: ['Pink'],
            Brand: 'Nintendo',
            RetailPrice: 300.0,
            PriceLevel: 250.0,
            IsInStock: true,
            Sort: 7,
        },
        {
            Category: ['Switch', 'console'],
            Distributor: 'Test Dist 1',
            ElasticSearchSubType: 'Test Data',
            UUID: 'switch lite',
            Color: ['Neon'],
            Brand: 'Nintendo',
            RetailPrice: 250.0,
            PriceLevel: 200.0,
            IsInStock: false,
            Sort: 8,
        },
        {
            Category: ['Switch', 'console'],
            Distributor: 'Test Dist 1',
            ElasticSearchSubType: 'Test Data',
            UUID: 'switch pro',
            Color: ['Grey'],
            Brand: 'Nintendo',
            RetailPrice: 350.0,
            PriceLevel: 300.0,
            IsInStock: false,
            Sort: 9,
        },
        {
            Category: ['Stadia', 'console'],
            Distributor: 'Test Dist 1',
            ElasticSearchSubType: 'Test Data',
            UUID: 'stadia',
            Color: ['Blue'],
            Brand: 'Google',
            RetailPrice: 129.99,
            PriceLevel: 100.0,
            IsInStock: false,
            Sort: 10,
        },
    ];

    describe('Elastic Search Test Suites', () => {
        let distUUID;

        describe('Post Bulk Data', () => {
            let tempFile;

            it('Create temp file for bulk', async () => {
                tempFile = await service.uploadTempFile(ElasticData);
                expect(tempFile).to.include('https://cdn.'), expect(tempFile).to.include('pepperi.com/TemporaryFiles/');
            });

            it('Post bulk data', async () => {
                distUUID = await service.getDistUUID();
                await service.postBulkData('all_activities', { URL: tempFile });
                const bulkData = await service.postBulkData('open_catalog', { URL: tempFile });
                expect(bulkData).to.have.property('took').that.is.above(0),
                    expect(bulkData).to.have.property('errors').that.is.a('boolean').and.is.false,
                    expect(bulkData).to.have.property('items').that.is.an('array').with.lengthOf(10);
                bulkData.items.map((item) => {
                    expect(item.index).to.have.property('_id').that.includes('open_catalog_Test Data_'),
                        expect(item.index)
                            .to.have.property('_index')
                            .that.equals('oc-' + distUUID),
                        expect(item.index).to.have.property('result').that.equals('created'),
                        expect(item.index).to.have.property('status').that.equals(201);
                });
            });
        });

        describe('Post search data', () => {
            it('Search data', async () => {
                const searchData = await service.postSearchData({ Distributor: 'Test Dist 1' }, 10);
                expect(searchData).to.have.property('took').that.is.above(0),
                    expect(searchData).to.have.property('timed_out').that.is.a('boolean').and.is.false,
                    expect(searchData.hits.total).to.have.property('value').that.equals(10);
                searchData.hits.hits.map((item) => {
                    expect(item).to.have.property('_id').that.includes('open_catalog_Test Data_'),
                        expect(item)
                            .to.have.property('_index')
                            .that.equals('oc-' + distUUID),
                        expect(item._source).to.have.property('Distributor').that.equals('Test Dist 1');
                    expect(searchData.hits.hits).to.be.an('array').with.lengthOf(10);
                });
            });

            it('Search data page size', async () => {
                const searchData = await service.postSearchData({ Distributor: 'Test Dist 1' }, 1);
                expect(searchData).to.have.property('took').that.is.above(0),
                    expect(searchData).to.have.property('timed_out').that.is.a('boolean').and.is.false,
                    expect(searchData.hits.total).to.have.property('value').that.equals(10);
                searchData.hits.hits.map((item) => {
                    expect(item).to.have.property('_id').that.includes('open_catalog_Test Data_'),
                        expect(item)
                            .to.have.property('_index')
                            .that.equals('oc-' + distUUID),
                        expect(item._source).to.have.property('Distributor').that.equals('Test Dist 1');
                    expect(searchData.hits.hits).to.be.an('array').with.lengthOf(1);
                });
            });

            it('Search data String', async () => {
                const searchData = await service.postSearchData({ Color: 'Black' }, 10);
                expect(searchData).to.have.property('took').that.is.above(0),
                    expect(searchData).to.have.property('timed_out').that.is.a('boolean').and.is.false,
                    expect(searchData.hits.total).to.have.property('value').that.equals(4);
                searchData.hits.hits.map((item) => {
                    expect(item).to.have.property('_id').that.includes('open_catalog_Test Data_'),
                        expect(item)
                            .to.have.property('_index')
                            .that.equals('oc-' + distUUID),
                        expect(item._source).to.have.property('Distributor').that.equals('Test Dist 1'),
                        expect(item._source).to.have.property('Color').that.includes('Black');
                    expect(searchData.hits.hits).to.be.an('array').with.lengthOf(4);
                });
            });

            it('Search data Boolean', async () => {
                const searchData = await service.postSearchData({ IsInStock: false }, 10);
                expect(searchData).to.have.property('took').that.is.above(0),
                    expect(searchData).to.have.property('timed_out').that.is.a('boolean').and.is.false,
                    expect(searchData.hits.total).to.have.property('value').that.equals(6);
                searchData.hits.hits.map((item) => {
                    expect(item).to.have.property('_id').that.includes('open_catalog_Test Data_'),
                        expect(item)
                            .to.have.property('_index')
                            .that.equals('oc-' + distUUID),
                        expect(item._source).to.have.property('Distributor').that.equals('Test Dist 1'),
                        expect(item._source).to.have.property('IsInStock').that.is.false;
                    expect(searchData.hits.hits).to.be.an('array').with.lengthOf(6);
                });
            });

            it('Search data Number', async () => {
                const searchData = await service.postSearchData({ RetailPrice: 99 }, 10);
                expect(searchData).to.have.property('took').that.is.above(0),
                    expect(searchData).to.have.property('timed_out').that.is.a('boolean').and.is.false,
                    expect(searchData.hits.total).to.have.property('value').that.equals(1);
                searchData.hits.hits.map((item) => {
                    expect(item).to.have.property('_id').that.includes('open_catalog_Test Data_'),
                        expect(item)
                            .to.have.property('_index')
                            .that.equals('oc-' + distUUID),
                        expect(item._source).to.have.property('Distributor').that.equals('Test Dist 1'),
                        expect(item._source).to.have.property('RetailPrice').that.equals(99);
                    expect(searchData.hits.hits).to.be.an('array').with.lengthOf(1);
                });
            });
        });

        describe('Post delete data', () => {
            it('Delete data', async () => {
                await service.postDeleteData('all_activities', {
                    ElasticSearchSubType: 'Test Data',
                });
                const deleteData = await service.postDeleteData('open_catalog', { ElasticSearchSubType: 'Test Data' });
                expect(deleteData).to.have.property('took').that.is.above(0),
                    expect(deleteData).to.have.property('timed_out').that.is.a('boolean').and.is.false,
                    expect(deleteData).to.have.property('total').that.is.equals(10),
                    expect(deleteData).to.have.property('deleted').that.is.equals(10);
            });
        });
    });
}
