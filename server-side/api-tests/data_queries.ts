import { DataQuerie, DataQueriesService } from '../services/data-queries.service';
import GeneralService, { TesterFunctions } from '../services/general.service';

export async function DataQueriesTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const dataQueriesService = new DataQueriesService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region global variables and helper functions
    // const scriptURI =
    //     'https://cdn.pepperi.com/7786003/CustomizationFile/7bdc82bd-0e6f-4fe4-8134-5e820829ebb8/test%20chart';

    // function createListOfRandCharts(): Chart[] {
    //     const listOfCharts: Chart[] = [];
    //     for (let i = 0; i < 5; i++) {
    //         const chartToPush: Chart = {
    //             Description: `chart-desc-${i}`,
    //             Name: generalService.generateRandomString(7),
    //             ReadOnly: false,
    //             ScriptURI: scriptURI,
    //         };
    //         listOfCharts.push(chartToPush);
    //     }
    //     return listOfCharts;
    // }

    // const listOfChartsToUpsert: Chart[] = createListOfRandCharts(); // global chart list to use in test
    //#endregion global variables and helper functions

    //#region Upgrade Data Visualisation
    const testData = {
        // 'Training Template': ['00000000-0000-0000-0000-0da1a0de41e5', ''],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(request.body.varKey, testData, false);
    //#endregion Upgrade Data Visualisation

    describe('Data Visualisation Tests Suites', () => {
        describe('Prerequisites Addon for Data Visualisation Tests', () => {
            //Test Data
            //Pepperi Notification Service
            it('Validate That All The Needed Addons Installed', async () => {
                isInstalledArr.forEach((isInstalled) => {
                    expect(isInstalled).to.be.true;
                });
            });

            for (const addonName in testData) {
                const addonUUID = testData[addonName][0];
                const version = testData[addonName][1];
                const varLatestVersion = chnageVersionResponseArr[addonName][2];
                const changeType = chnageVersionResponseArr[addonName][3];
                describe(`Test Data: ${addonName}`, () => {
                    it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                        if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                            expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                        } else {
                            expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                        }
                    });

                    it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(varLatestVersion);
                    });
                });
            }
        });
        describe('Endpoints', () => {
            describe('GET', () => {
                it('Get Queries - Retriving all Queries data and validating its format', async () => {
                    //test goes here//
                    const jsonDataFromAuditLog: DataQuerie[] = await dataQueriesService.getQueries();
                    jsonDataFromAuditLog.forEach((jsonDataQuery) => {
                        expect(jsonDataQuery).to.have.own.property('ModificationDateTime');
                        expect(jsonDataQuery).to.have.own.property('Hidden');
                        expect(jsonDataQuery.Hidden).to.be.a('Boolean');
                        expect(jsonDataQuery).to.have.own.property('CreationDateTime');
                        expect(jsonDataQuery).to.have.own.property('Name');
                        expect(jsonDataQuery).to.have.own.property('Key');
                        jsonDataQuery.Series.forEach((jsonSeriresData) => {//tests each Series list
                            expect(jsonSeriresData).to.have.own.property('Key');
                            expect(jsonSeriresData).to.have.own.property('Name');
                            expect(jsonSeriresData).to.have.own.property('Resource');
                            expect(jsonSeriresData).to.have.own.property('Label');
                            expect(jsonSeriresData).to.have.own.property('Top');
                            expect(jsonSeriresData.Top).to.have.own.property('Max');
                            expect(jsonSeriresData.Top.Max).to.be.a('Number');
                            expect(jsonSeriresData.Top).to.have.own.property('Ascending');
                            expect(jsonSeriresData.Top.Ascending).to.be.a('Boolean');
                            expect(jsonSeriresData).to.have.own.property('AggregatedFields');
                            jsonSeriresData.AggregatedFields.forEach((jsonAggregatedFields) => {//tests each element in the AggregatedFields list
                                expect(jsonAggregatedFields).to.have.own.property('Aggregator');
                                expect(jsonAggregatedFields).to.have.own.property('FieldID');
                                expect(jsonAggregatedFields).to.have.own.property('Alias');
                                expect(jsonAggregatedFields).to.have.own.property('Script');
                            });
                            expect(jsonSeriresData).to.have.own.property('AggregatedParams');
                            jsonSeriresData.AggregatedParams.forEach((jsonAggregatedParams) => {//tests each element in the AggregatedParams list
                                expect(jsonAggregatedParams).to.have.own.property('FieldID');
                                expect(jsonAggregatedParams).to.have.own.property('Aggregator');
                                expect(jsonAggregatedParams).to.have.own.property('Name');
                            });
                            expect(jsonSeriresData).to.have.own.property('BreakBy');
                            expect(jsonSeriresData.BreakBy).to.have.own.property('FieldID');
                            expect(jsonSeriresData.BreakBy).to.have.own.property('Interval');
                            expect(jsonSeriresData.BreakBy).to.have.own.property('Format');
                            expect(jsonSeriresData).to.have.own.property('Filter');
                            expect(jsonSeriresData).to.have.own.property('Scope');
                            expect(jsonSeriresData.Scope).to.have.own.property('User');
                            expect(jsonSeriresData.Scope.User).to.be.oneOf(['AllUsers','CurrentUser']);
                            expect(jsonSeriresData.Scope).to.have.own.property('Account');
                            expect(jsonSeriresData.Scope.Account).to.be.oneOf(['AllAccounts','AccountsAssignedToCurrentUser']);
                            expect(jsonSeriresData).to.have.own.property('DynamicFilterFields');
                            expect(jsonSeriresData).to.have.own.property('GroupBy');
                            jsonSeriresData.GroupBy.forEach((jsonGroupBy) => {//tests each GroupBy element in the list
                                expect(jsonGroupBy).to.have.own.property('FieldID');
                                expect(jsonGroupBy).to.have.own.property('Interval');
                                expect(jsonGroupBy).to.have.own.property('Format');
                                expect(jsonGroupBy).to.have.own.property('Alias');
                            });
                        });

                    });
                });
            });
        });
    });
}

