import { DataQuerie, DataQueriesService, QuerySeries } from '../services/data-queries.service';
import GeneralService, { TesterFunctions } from '../services/general.service';

export async function DataQueriesTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const dataQueriesService = new DataQueriesService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const savedSeries: QuerySeries = {
        Key: 'fc4f2b0a-2f2f-43a8-bb44-6977a1217bee',
        Name: 'Series 1',
        Resource: 'transaction_lines',
        Label: '${label}',
        Top: {
            Max: 20,
            Ascending: true,
        },
        AggregatedFields: [
            {
                Aggregator: 'Sum',
                Script: 'params.Var1',
                Alias: '',
                FieldID: 'InternalID',
            },
        ],
        AggregatedParams: [
            {
                Aggregator: 'Sum',
                FieldID: '',
                Name: 'Var1',
            },
        ],
        BreakBy: {
            FieldID: 'Transaction.Type',
            Interval: 'None',
            Format: '',
        },
        Filter: null,
        Scope: {
            Account: 'AllAccounts',
            User: 'AllUsers',
        },
        DynamicFilterFields: [],
        GroupBy: [
            {
                Format: '',
                Alias: 'ExternalID',
                FieldID: 'Transaction.Account.ExternalID',
                Interval: 'None',
            },
        ],
    };
    const savedDateQueries: DataQuerie = {
        Hidden: false,
        Name: 'evgenys data query 22',
        Series: [savedSeries],
    };

    //#region Upgrade Data Visualisation
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', ''],
        'Charts Manager': ['3d118baf-f576-4cdb-a81e-c2cc9af4d7ad', ''],
        'Data Visualization': ['00000000-0000-0000-0000-0da1a0de41e5', ''],
    };
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Upgrade Data Visualisation

    describe('Data Queries Tests Suites', () => {
        describe('Prerequisites Addon for Data Visualisation Tests', () => {
            //Test Data
            //Pepperi Notification Service
            isInstalledArr.forEach((isInstalled, index) => {
                it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
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
            describe('POST', () => {
                it('Post A New Querie And Test The Response', async () => {
                    const todaysDate = new Date().toJSON().slice(0, 10);
                    const tenMinutes = 1000 * 60 * 10;//1000 * 60 is  a minute
                    const threeHoursTimeZoneDiffWithAWS =  1000 * 60 * 60 * 3;//1000 * 60 * 60 is an hour
                    const jsonDataFromAuditLog: DataQuerie = await dataQueriesService.postQuerie(savedDateQueries);
                    expect(jsonDataFromAuditLog).to.have.own.property('CreationDateTime');
                    expect(jsonDataFromAuditLog.CreationDateTime).to.include(todaysDate);
                    let dateTimeFromJson;
                    if (jsonDataFromAuditLog.CreationDateTime) {
                        //should always be true - done for the linter
                        dateTimeFromJson = jsonDataFromAuditLog.CreationDateTime;
                    }
                    expect(generalService.isLessThanGivenTimeAgo(Date.parse(dateTimeFromJson), tenMinutes, threeHoursTimeZoneDiffWithAWS)).to.be.true;
                    expect(jsonDataFromAuditLog).to.have.own.property('ModificationDateTime');
                    expect(jsonDataFromAuditLog.CreationDateTime).to.include(todaysDate);
                    if (jsonDataFromAuditLog.ModificationDateTime) {
                        //should always be true - done for the linter
                        dateTimeFromJson = jsonDataFromAuditLog.ModificationDateTime;
                    }
                    expect(generalService.isLessThanGivenTimeAgo(Date.parse(dateTimeFromJson), tenMinutes, threeHoursTimeZoneDiffWithAWS)).to.be.true;
                    expect(jsonDataFromAuditLog).to.have.own.property('Key');
                    expect(jsonDataFromAuditLog).to.have.own.property('Name');
                    expect(jsonDataFromAuditLog.Name).to.equal(savedDateQueries.Name);
                    expect(jsonDataFromAuditLog).to.have.own.property('Series');
                    expect(jsonDataFromAuditLog.Series).to.be.a('Array');
                    expect(jsonDataFromAuditLog.Series).to.deep.equal(savedDateQueries.Series);
                });
            });
            describe('GET', () => {
                it('Get Queries - Retriving all Queries and validating their format', async () => {
                    const jsonDataFromAuditLog: DataQuerie[] = await dataQueriesService.getQueries();
                    jsonDataFromAuditLog.forEach((jsonDataQuery) => {
                        expect(jsonDataQuery).to.have.own.property('ModificationDateTime');
                        expect(jsonDataQuery).to.have.own.property('Hidden');
                        expect(jsonDataQuery.Hidden).to.be.a('Boolean');
                        expect(jsonDataQuery).to.have.own.property('CreationDateTime');
                        expect(jsonDataQuery).to.have.own.property('Name');
                        expect(jsonDataQuery).to.have.own.property('Key');
                        if (jsonDataQuery.Series) {
                            //not every data query has to have a series
                            expect(jsonDataQuery).to.have.own.property('Series');
                            expect(jsonDataQuery.Series).to.be.an('Array');
                            jsonDataQuery.Series.forEach((jsonSeriresData) => {
                                //tests each Series list
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
                                jsonSeriresData.AggregatedFields.forEach((jsonAggregatedFields) => {
                                    //tests each element in the AggregatedFields list
                                    expect(jsonAggregatedFields).to.have.own.property('Aggregator');
                                    expect(jsonAggregatedFields).to.have.own.property('FieldID');
                                    expect(jsonAggregatedFields).to.have.own.property('Alias');
                                    expect(jsonAggregatedFields).to.have.own.property('Script');
                                });
                                expect(jsonSeriresData).to.have.own.property('AggregatedParams');
                                jsonSeriresData.AggregatedParams.forEach((jsonAggregatedParams) => {
                                    //tests each element in the AggregatedParams list
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
                                expect(jsonSeriresData.Scope.User).to.be.oneOf(['AllUsers', 'CurrentUser']);
                                expect(jsonSeriresData.Scope).to.have.own.property('Account');
                                expect(jsonSeriresData.Scope.Account).to.be.oneOf([
                                    'AllAccounts',
                                    'AccountsAssignedToCurrentUser',
                                ]);
                                expect(jsonSeriresData).to.have.own.property('DynamicFilterFields');
                                expect(jsonSeriresData).to.have.own.property('GroupBy');
                                jsonSeriresData.GroupBy.forEach((jsonGroupBy) => {
                                    //tests each GroupBy element in the list
                                    expect(jsonGroupBy).to.have.own.property('FieldID');
                                    expect(jsonGroupBy).to.have.own.property('Interval');
                                    expect(jsonGroupBy).to.have.own.property('Format');
                                    expect(jsonGroupBy).to.have.own.property('Alias');
                                });
                            });
                        }
                    });
                });
            });
            describe('Data Cleansing', () => {
                it('Delete All Queries And Validate Nothing Left', async () => {
                    await expect(dataQueriesService.TestCleanUp()).eventually.to.be.above(0);
                    const jsonDataFromAuditLog: DataQuerie[] = await dataQueriesService.getQueries();
                    expect(jsonDataFromAuditLog.length).to.equal(0);
                });
            });
        });
    });
}