import GeneralService, { TesterFunctions } from '../services/general.service';
import { OpenCatalogService } from '../services/open-catalog.service';

export async function OpenCatalogTests(generalService: GeneralService, tester: TesterFunctions) {
    const openCatalogService = new OpenCatalogService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    describe('Get single item and compare to PAPI item', () => {
        let papiItems;
        let openCatalogSingleItem;

        it('Get items via Open Catalog and papi', async () => {
            papiItems = await openCatalogService.getItems();
            expect(papiItems).to.be.an('array');
            openCatalogSingleItem = await openCatalogService.getOpenCatalogSingleItem(papiItems[0].UUID);
            expect(openCatalogSingleItem).to.have.property('ItemName.Value').that.is.a('string'),
                expect(openCatalogSingleItem).to.have.property('UnitPrice.Value').that.is.a('number'),
                expect(openCatalogSingleItem).to.have.property('ItemExternalID.Value').that.is.a('string'),
                expect(openCatalogSingleItem).to.have.property('UUID').that.is.a('string'),
                expect(openCatalogSingleItem).to.have.property('Image.Value').that.is.a('string');
        });

        it('Verify open catalog single item matches papi item', async () => {
            expect(openCatalogSingleItem).to.have.property('ItemName.Value').that.equals(papiItems[0].Name),
                expect(openCatalogSingleItem).to.have.property('UnitPrice.Value').that.equals(papiItems[0].Price),
                expect(openCatalogSingleItem)
                    .to.have.property('ItemExternalID.Value')
                    .that.equals(papiItems[0].ExternalID),
                expect(openCatalogSingleItem).to.have.property('UUID').that.equals(papiItems[0].UUID),
                expect(openCatalogSingleItem).to.have.property('Image.Value').that.includes('https://cdn.'),
                expect(openCatalogSingleItem)
                    .to.have.property('Image.Value')
                    .that.includes('.pepperi.com/WrntyImages/30014280/PortfolioItems/'),
                expect(openCatalogSingleItem).to.have.property('Image.Value').that.includes(papiItems[0].InternalID);
        });
    });

    describe('Get items and compare to PAPI items', () => {
        let papiItems;
        let openCatalogItems;

        it('Get items via Open Catalog and papi and compare total count', async () => {
            papiItems = await openCatalogService.getItems("?where=ExternalID not like '%PPI%'");
            expect(papiItems).to.be.an('array');
            openCatalogItems = await openCatalogService.getOpenCatalogItems(
                '?include_count=true&order_by=ItemExternalID.Value',
            );
            expect(openCatalogItems).to.have.property('TotalCount').that.equals(papiItems.length),
                expect(openCatalogItems)
                    .to.have.property('Products')
                    .that.is.an('array')
                    .with.lengthOf(papiItems.length),
                expect(openCatalogItems.Products[0])
                    .to.have.property('ItemName.Value')
                    .that.is.a('string')
                    .that.equals('Description'),
                expect(openCatalogItems.Products[0]).to.have.property('ElasticSearchSubType').that.is.a('string'),
                expect(openCatalogItems.Products[0]).to.have.property('CategoryUUID').that.is.an('array'),
                expect(openCatalogItems.Products[0])
                    .to.have.property('ElasticSearchType')
                    .that.is.a('string')
                    .that.equals('open_catalog'),
                expect(openCatalogItems.Products[0]).to.have.property('UnitPrice.Value').that.is.a('number'),
                expect(openCatalogItems.Products[0]).to.have.property('ItemExternalID.Value').that.is.a('string'),
                expect(openCatalogItems.Products[0]).to.have.property('UUID').that.is.a('string'),
                expect(openCatalogItems.Products[0]).to.have.property('Image.Value').that.is.a('string');
        });

        it('Verify open catalog items match papi items', async () => {
            openCatalogItems.Products.map((item, index) => {
                expect(item).to.have.property('ItemName.Value').that.equals(papiItems[index].Name),
                    expect(item).to.have.property('UnitPrice.Value').that.equals(papiItems[index].Price),
                    expect(item).to.have.property('ItemExternalID.Value').that.equals(papiItems[index].ExternalID),
                    expect(item).to.have.property('UUID').that.equals(papiItems[index].UUID);
            });
        });

        it('Verify open catalog page size', async () => {
            const pageSizeOpenCatalogData = await openCatalogService.getOpenCatalogItems('?page_size=1');
            expect(pageSizeOpenCatalogData).to.have.property('Products').that.is.an('array').with.lengthOf(1);
        });

        it('Verify open catalog search string', async () => {
            const searchStringOpenCatalogData = await openCatalogService.getOpenCatalogItems('?search_string=TM127');
            expect(searchStringOpenCatalogData).to.have.property('Products').that.is.an('array').with.lengthOf(1),
                expect(searchStringOpenCatalogData.Products[0])
                    .to.have.property('ItemExternalID.Value')
                    .that.is.a('string')
                    .that.equals('TM127');
        });

        it('Verify open catalog where clause', async () => {
            const whereClauseOpenCatalogData = await openCatalogService.getOpenCatalogItems(
                '?where=ItemExternalID.Value=NE566 and UnitPrice.Value=7.4',
            );
            expect(whereClauseOpenCatalogData).to.have.property('Products').that.is.an('array').with.lengthOf(1),
                expect(whereClauseOpenCatalogData.Products[0])
                    .to.have.property('ItemExternalID.Value')
                    .that.is.a('string')
                    .that.equals('NE566');
        });
    });

    describe('Get Filters', () => {
        let openCatalogItems;
        let openCatalogFilters;

        it('Get filters and items via Open Catalog and compare distinct values', async () => {
            openCatalogItems = await openCatalogService.getOpenCatalogItems(
                '?fields=ItemExternalID.Value&order_by=ItemExternalID.Value',
            );
            openCatalogFilters = await openCatalogService.getOpenCatalogFilters(
                '?distinct_fields=ItemExternalID.Value',
            );
            const distinctExternalId = Array.from(
                new Set(openCatalogItems.Products.map((item: any) => item['ItemExternalID.Value'])),
            );
            const distinctExternalIdFilters = Array.from(
                new Set(openCatalogFilters[0].Values.map((item: any) => item.key)),
            );
            expect(openCatalogFilters).to.be.an('array'),
                expect(openCatalogItems.Products).to.be.an('array'),
                expect(openCatalogFilters[0]).to.have.property('APIName').that.equals('ItemExternalID'),
                expect(openCatalogFilters[0]).to.have.property('Values').that.is.an('array'),
                expect(openCatalogFilters[0].Values).to.be.an('array').with.lengthOf(distinctExternalId.length),
                expect(distinctExternalId).to.eql(distinctExternalIdFilters);
        });
    });

    describe('Get Configurations', () => {
        let configurationsURL;
        let configurations;

        it('Get configurations URL and use it to get configurations', async () => {
            configurationsURL = await openCatalogService.getOpenCatalogConfigurationsURL();
            expect(configurationsURL).to.have.property('ConfigurationsURL').that.includes('https://cdn.'),
                expect(configurationsURL)
                    .to.have.property('ConfigurationsURL')
                    .that.includes('.pepperi.com/30014280/CustomizationFile/'),
                expect(configurationsURL).to.have.property('ConfigurationsURL').that.includes('/configurations.json'),
                (configurations = await openCatalogService.getOpenCatalogConfigurations(
                    configurationsURL.ConfigurationsURL,
                ));
            expect(configurations).to.have.property('DataViews').that.is.an('array'),
                expect(configurations).to.have.property('CategoriesTree').that.is.an('array'),
                expect(configurations).to.have.property('Currency').that.is.a('string');
        });

        it('Get data views and compare to configurations', async () => {
            for (let index = 0; index < configurations.DataViews.length; index++) {
                const dataViewName = configurations.DataViews[index].Context.Name;
                const specificDataView = await openCatalogService.getDataViews(dataViewName);
                expect(specificDataView).to.be.an('array').with.lengthOf(1),
                    expect(configurations.DataViews[index]).to.eql(specificDataView[0]);
            }
        });

        it('Post change to data views, verify change arrived to open catalog after publish', async () => {
            const postDataView = await openCatalogService.postDataView({
                InternalID: 5266676,
                Type: 'Menu',
                Title: 'Rep',
                Context: {
                    Object: {
                        Resource: 'transactions',
                        InternalID: 304550,
                        Name: 'Open Catalog 304550',
                    },
                    Name: 'OrderCenterSearch',
                    ScreenSize: 'Tablet',
                    Profile: {
                        InternalID: 71080,
                        Name: 'Rep',
                    },
                },
                Fields: [
                    {
                        FieldID: 'ItemExternalID',
                        Title: 'Item External ID Test',
                    },
                    {
                        FieldID: 'ItemName',
                        Title: 'Item Description Test',
                    },
                ],
            });
            const publishOpenCatalog = await openCatalogService.publishOpenCatalog({
                atdID: '304550',
                atdSecret:
                    'eyJhIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDBjYTdhMTA5IiwidSI6IjY3YjNkY2VlLTU0MmEtNDQyMi04MDFlLWI0ZmVmYjk1ZDYzYiIsImsiOiI0YmMwMWVmZi0zNTc1LTI2N2MtYmU1My0yZTFhNTE3ODg5OWEifQ==',
                comment: 'test',
            });
            expect(publishOpenCatalog).to.have.property('Comment').that.equals('test'),
                expect(publishOpenCatalog).to.have.property('Status').that.equals('Done');

            configurationsURL = await openCatalogService.getOpenCatalogConfigurationsURL();
            expect(configurationsURL).to.have.property('ConfigurationsURL').that.includes('https://cdn.'),
                expect(configurationsURL)
                    .to.have.property('ConfigurationsURL')
                    .that.includes('.pepperi.com/30014280/CustomizationFile/'),
                expect(configurationsURL).to.have.property('ConfigurationsURL').that.includes('/configurations.json'),
                (configurations = await openCatalogService.getOpenCatalogConfigurations(
                    configurationsURL.ConfigurationsURL,
                ));
            expect(configurations).to.have.property('DataViews').that.is.an('array'),
                expect(configurations).to.have.property('CategoriesTree').that.is.an('array'),
                expect(configurations).to.have.property('Currency').that.is.a('string'),
                expect(configurations.DataViews).to.deep.include(postDataView);
        });

        it('Revert changed data view to original state and publish', async () => {
            const revertDataView = await openCatalogService.postDataView({
                InternalID: 5266676,
                Type: 'Menu',
                Title: 'Rep',
                Context: {
                    Object: {
                        Resource: 'transactions',
                        InternalID: 304550,
                        Name: 'Open Catalog 304550',
                    },
                    Name: 'OrderCenterSearch',
                    ScreenSize: 'Tablet',
                    Profile: {
                        InternalID: 71080,
                        Name: 'Rep',
                    },
                },
                Fields: [
                    {
                        FieldID: 'ItemExternalID',
                        Title: 'Item External ID',
                    },
                    {
                        FieldID: 'ItemName',
                        Title: 'Item Description',
                    },
                ],
            });

            expect(revertDataView).to.have.property('InternalID').that.equals(5266676);
            const publishOpenCatalogRevert = await openCatalogService.publishOpenCatalog({
                atdID: '304550',
                atdSecret:
                    'eyJhIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDBjYTdhMTA5IiwidSI6IjY3YjNkY2VlLTU0MmEtNDQyMi04MDFlLWI0ZmVmYjk1ZDYzYiIsImsiOiI0YmMwMWVmZi0zNTc1LTI2N2MtYmU1My0yZTFhNTE3ODg5OWEifQ==',
                comment: 'test',
            });
            expect(publishOpenCatalogRevert).to.have.property('Comment').that.equals('test'),
                expect(publishOpenCatalogRevert).to.have.property('Status').that.equals('Done');
        });
    });
}
