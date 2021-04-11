import GeneralService, { TesterFunctions } from '../services/general.service';
import { ElasticSearchService } from '../services/elastic-search.service';
import fetch from 'node-fetch';

export async function ElasticSearchTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const elasticSearchService = new ElasticSearchService(generalService.papiClient);
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

    const elasticSearchAddonUUID = '00000000-0000-0000-0000-00000e1a571c';
    const elasticSearchVersion = '.';
    //#region Upgrade Elastic Search
    const elasticSearchVarLatestVersion = await fetch(
        `${generalService['client'].BaseURL.replace(
            'papi-eu',
            'papi',
        )}/var/addons/versions?where=AddonUUID='${elasticSearchAddonUUID}' AND Version Like '%${elasticSearchVersion}%'&order_by=CreationDateTime DESC`,
        {
            method: `GET`,
            headers: {
                Authorization: `${request.body.varKey}`,
            },
        },
    )
        .then((response) => response.json())
        .then((addon) => addon[0].Version);

    let isInstalled = false;
    let installedAddonVersion;
    const installedAddonsArr = await generalService.getAddons(elasticSearchVarLatestVersion);
    for (let i = 0; i < installedAddonsArr.length; i++) {
        if (installedAddonsArr[i].Addon !== null) {
            if (installedAddonsArr[i].Addon.Name == 'PepperiElasticSearch') {
                installedAddonVersion = installedAddonsArr[i].Version;
                isInstalled = true;
                break;
            }
        }
    }
    if (!isInstalled) {
        await generalService.papiClient.addons.installedAddons.addonUUID(`${elasticSearchAddonUUID}`).install();
        generalService.sleep(20000); //If addon needed to be installed, just wait 20 seconds, this should not happen.
    }

    let elasticSearchUpgradeAuditLogResponse;
    let elasticSearchInstalledAddonVersion;
    let elasticSearchAuditLogResponse;
    if (installedAddonVersion != elasticSearchVarLatestVersion) {
        elasticSearchUpgradeAuditLogResponse = await generalService.papiClient.addons.installedAddons
            .addonUUID(`${elasticSearchAddonUUID}`)
            .upgrade(elasticSearchVarLatestVersion);

        generalService.sleep(4000); //Test installation status only after 4 seconds.
        elasticSearchAuditLogResponse = await generalService.papiClient.auditLogs
            .uuid(elasticSearchUpgradeAuditLogResponse.ExecutionUUID)
            .get();
        if (elasticSearchAuditLogResponse.Status.Name == 'InProgress') {
            generalService.sleep(20000); //Wait another 20 seconds and try again (fail the test if client wait more then 20+4 seconds)
            elasticSearchAuditLogResponse = await generalService.papiClient.auditLogs
                .uuid(elasticSearchUpgradeAuditLogResponse.ExecutionUUID)
                .get();
        }
        elasticSearchInstalledAddonVersion = await (
            await generalService.papiClient.addons.installedAddons.addonUUID(`${elasticSearchAddonUUID}`).get()
        ).Version;
    } else {
        elasticSearchUpgradeAuditLogResponse = 'Skipped';
        elasticSearchInstalledAddonVersion = installedAddonVersion;
    }
    //#endregion Upgrade Elastic Search

    describe('Elastic Search Test Suites', () => {
        it(`Test Data: Tested Addon: PepperiElasticSearch - Version: ${elasticSearchInstalledAddonVersion}`, () => {
            expect(elasticSearchInstalledAddonVersion).to.contain('.');
        });

        describe('Prerequisites Addon for Elastic Search Tests', () => {
            it('Upgarde To Latest Version of Elastic Search Addon', async () => {
                if (elasticSearchUpgradeAuditLogResponse != 'Skipped') {
                    expect(elasticSearchUpgradeAuditLogResponse)
                        .to.have.property('ExecutionUUID')
                        .a('string')
                        .with.lengthOf(36);
                    if (elasticSearchAuditLogResponse.Status.Name == 'Failure') {
                        expect(elasticSearchAuditLogResponse.AuditInfo.ErrorMessage).to.include(
                            'is already working on version',
                        );
                    } else {
                        expect(elasticSearchAuditLogResponse.Status.Name).to.include('Success');
                    }
                }
            });

            it(`Latest Version Is Installed`, () => {
                expect(elasticSearchInstalledAddonVersion).to.equal(elasticSearchVarLatestVersion);
            });
        });

        let distUUID;

        describe('Post Bulk Data', () => {
            let tempFile;

            it('Create temp file for bulk', async () => {
                tempFile = await elasticSearchService.uploadTempFile(ElasticData);
                expect(tempFile).to.include('https://cdn.'), expect(tempFile).to.include('pepperi.com/TemporaryFiles/');
            });

            it('Post bulk data', async () => {
                distUUID = generalService.getClientData('DistributorUUID');
                await elasticSearchService.postBulkData('all_activities', { URL: tempFile });
                const bulkData = await elasticSearchService.postBulkData('open_catalog', { URL: tempFile });
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
                const searchData = await elasticSearchService.postSearchData({ Distributor: 'Test Dist 1' }, 10);
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
                const searchData = await elasticSearchService.postSearchData({ Distributor: 'Test Dist 1' }, 1);
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
                const searchData = await elasticSearchService.postSearchData({ Color: 'Black' }, 10);
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
                const searchData = await elasticSearchService.postSearchData({ IsInStock: false }, 10);
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
                const searchData = await elasticSearchService.postSearchData({ RetailPrice: 99 }, 10);
                expect(searchData).to.have.property('took').that.is.above(0),
                    expect(searchData).to.have.property('timed_out').that.is.a('boolean').and.is.false,
                    expect(searchData.hits.total).to.have.property('value').that.equals(2);
                searchData.hits.hits.map((item) => {
                    expect(item).to.have.property('_id').that.includes('open_catalog_Test Data_'),
                        expect(item)
                            .to.have.property('_index')
                            .that.equals('oc-' + distUUID),
                        expect(item._source).to.have.property('Distributor').that.equals('Test Dist 1'),
                        expect(item._source).to.have.property('RetailPrice').that.equals(99);
                    expect(searchData.hits.hits).to.be.an('array').with.lengthOf(2);
                });
            });
        });

        describe('Get totals', () => {
            it('Get totals', async () => {
                const getTotalsData = await elasticSearchService.getTotals('all_activities', {
                    select: [
                        'sum(RetailPrice)',
                        'avg(RetailPrice)',
                        'min(RetailPrice)',
                        'max(RetailPrice)',
                        'count(Brand)',
                    ],
                });
                expect(getTotalsData[0]).to.have.property('avg_RetailPrice').that.equals(243.5),
                    expect(getTotalsData[0]).to.have.property('sum_RetailPrice').that.equals(2435),
                    expect(getTotalsData[0]).to.have.property('min_RetailPrice').that.equals(99),
                    expect(getTotalsData[0]).to.have.property('max_RetailPrice').that.equals(500),
                    expect(getTotalsData[0]).to.have.property('count_Brand').that.equals(10);
            });

            it('Get totals with group by', async () => {
                const getTotalsData = await elasticSearchService.getTotals('all_activities', {
                    select: [
                        'sum(RetailPrice)',
                        'avg(RetailPrice)',
                        'min(RetailPrice)',
                        'max(RetailPrice)',
                        'count(Brand)',
                    ],
                    group_by: 'Color',
                });
                expect(getTotalsData[0]).to.have.property('Color').that.equals('Black'),
                    expect(getTotalsData[0]).to.have.property('avg_RetailPrice').that.equals(206.75),
                    expect(getTotalsData[0]).to.have.property('sum_RetailPrice').that.equals(827),
                    expect(getTotalsData[0]).to.have.property('min_RetailPrice').that.equals(99),
                    expect(getTotalsData[0]).to.have.property('max_RetailPrice').that.equals(500),
                    expect(getTotalsData[0]).to.have.property('count_Brand').that.equals(4),
                    expect(getTotalsData[1]).to.have.property('Color').that.equals('Blue'),
                    expect(getTotalsData[1]).to.have.property('avg_RetailPrice').that.equals(289.5),
                    expect(getTotalsData[1]).to.have.property('sum_RetailPrice').that.equals(579),
                    expect(getTotalsData[1]).to.have.property('min_RetailPrice').that.equals(129),
                    expect(getTotalsData[1]).to.have.property('max_RetailPrice').that.equals(450),
                    expect(getTotalsData[1]).to.have.property('count_Brand').that.equals(2),
                    expect(getTotalsData[2]).to.have.property('Color').that.equals('White'),
                    expect(getTotalsData[2]).to.have.property('avg_RetailPrice').that.equals(289.5),
                    expect(getTotalsData[2]).to.have.property('sum_RetailPrice').that.equals(579),
                    expect(getTotalsData[2]).to.have.property('min_RetailPrice').that.equals(129),
                    expect(getTotalsData[2]).to.have.property('max_RetailPrice').that.equals(450),
                    expect(getTotalsData[2]).to.have.property('count_Brand').that.equals(2),
                    expect(getTotalsData[3]).to.have.property('Color').that.equals('Green'),
                    expect(getTotalsData[3]).to.have.property('avg_RetailPrice').that.equals(99),
                    expect(getTotalsData[3]).to.have.property('sum_RetailPrice').that.equals(99),
                    expect(getTotalsData[3]).to.have.property('min_RetailPrice').that.equals(99),
                    expect(getTotalsData[3]).to.have.property('max_RetailPrice').that.equals(99),
                    expect(getTotalsData[3]).to.have.property('count_Brand').that.equals(1),
                    expect(getTotalsData[4]).to.have.property('Color').that.equals('Grey'),
                    expect(getTotalsData[4]).to.have.property('avg_RetailPrice').that.equals(350),
                    expect(getTotalsData[4]).to.have.property('sum_RetailPrice').that.equals(350),
                    expect(getTotalsData[4]).to.have.property('min_RetailPrice').that.equals(350),
                    expect(getTotalsData[4]).to.have.property('max_RetailPrice').that.equals(350),
                    expect(getTotalsData[4]).to.have.property('count_Brand').that.equals(1),
                    expect(getTotalsData[5]).to.have.property('Color').that.equals('Neon'),
                    expect(getTotalsData[5]).to.have.property('avg_RetailPrice').that.equals(250),
                    expect(getTotalsData[5]).to.have.property('sum_RetailPrice').that.equals(250),
                    expect(getTotalsData[5]).to.have.property('min_RetailPrice').that.equals(250),
                    expect(getTotalsData[5]).to.have.property('max_RetailPrice').that.equals(250),
                    expect(getTotalsData[5]).to.have.property('count_Brand').that.equals(1),
                    expect(getTotalsData[6]).to.have.property('Color').that.equals('Pink'),
                    expect(getTotalsData[6]).to.have.property('avg_RetailPrice').that.equals(300),
                    expect(getTotalsData[6]).to.have.property('sum_RetailPrice').that.equals(300),
                    expect(getTotalsData[6]).to.have.property('min_RetailPrice').that.equals(300),
                    expect(getTotalsData[6]).to.have.property('max_RetailPrice').that.equals(300),
                    expect(getTotalsData[6]).to.have.property('count_Brand').that.equals(1);
            });
        });

        describe('Post delete data', () => {
            it('Delete data', async () => {
                await elasticSearchService.postDeleteData('all_activities', {
                    ElasticSearchSubType: 'Test Data',
                });
                const deleteData = await elasticSearchService.postDeleteData('open_catalog', {
                    ElasticSearchSubType: 'Test Data',
                });
                expect(deleteData).to.have.property('took').that.is.above(0),
                    expect(deleteData).to.have.property('timed_out').that.is.a('boolean').and.is.false,
                    expect(deleteData).to.have.property('total').that.is.equals(10),
                    expect(deleteData).to.have.property('deleted').that.is.equals(10);
            });
        });
    });
}
