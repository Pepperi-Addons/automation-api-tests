import GeneralService, { TesterFunctions } from '../services/general.service';
import { DataVisualisationService, Chart } from '../services/data_visualisation.service';
import * as URL from 'url';

export async function DataVisualisationTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const dataVisualisationService = new DataVisualisationService(generalService); //just for lint issue

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region global variables and helper functions
    const scriptURI =
        'https://cdn.pepperi.com/7786003/CustomizationFile/7bdc82bd-0e6f-4fe4-8134-5e820829ebb8/test%20chart';

    const stringIsAValidUrl = (s: string): boolean => {
        try {
            URL.parse(s);
            return true;
        } catch (err) {
            return false;
        }
    };

    //chart generic object which is manipulated for negative POST tests
    const chart: Chart = {
        Description: 'desc',
        Name: 'name',
        ScriptURI: scriptURI,
        ReadOnly: true,
    };

    function createListOfRandCharts(): Chart[] {
        const listOfCharts: Chart[] = [];
        for (let i = 0; i < 5; i++) {
            const chartToPush: Chart = {
                Description: `chart-desc-${i}`,
                Name: Math.random().toString(36).substr(2, 7),
                ReadOnly: false,
                ScriptURI: scriptURI,
            };
            listOfCharts.push(chartToPush);
        }
        return listOfCharts;
    }

    const listOfChartsToUpsert: Chart[] = createListOfRandCharts(); // global chart list to use in test
    //#endregion global variables and helper functions

    //#region Upgrade Data Visualisation
    const testData = {
        'Training Template': ['3d118baf-f576-4cdb-a81e-c2cc9af4d7ad', ''],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.chnageVersion(request.body.varKey, testData, false);
    //#endregion Upgrade Data Visualisation

    //TODO: Review with Evgeny the stringIsAValidUrl function he created...
    const dataStrArr = [
        'oren',
        '',
        '',
        ``,
        '1231',
        'https://www.youtube.com/watch?v=FuDOIsVgwWE&ab_channel=JayzTwoCents',
        'https://papi.pepperi.com/V1.0/var/addons/versions?where=AddonUUID=%27bd629d5f-a7b4-4d03-9e7c-67865a6d82a9%27%20AND%20Version%20Like%20%270.%%27&order_by=CreationDateTime%20DESC',
        '[]',
        '{}',
        '[https://papi.pepperi.com/V1.0/var/addons/versions?where=AddonUUID=%27bd629d5f-a7b4-4d03-9e7c-67865a6d82a9%27%20AND%20Version%20Like%20%270.%%27&order_by=CreationDateTime%20DESC]',
    ];

    for (let index = 0; index < dataStrArr.length; index++) {
        stringIsAValidUrl(dataStrArr[index]);
        console.log(dataStrArr[index], stringIsAValidUrl(dataStrArr[index]));
    }

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

        //TODO: Endpoint: GET, POST, DELETE, PATCH, PUT
        describe('Endpoints', () => {
            describe('GET', () => {
                it('Get Charts - Retriving all chart data and validating its format', async () => {
                    const jsonDataFromAuditLog = await dataVisualisationService.getCharts();
                    jsonDataFromAuditLog.forEach((jsonChartData) => {
                        expect(jsonChartData).to.have.own.property('Key');
                        expect(jsonChartData).to.have.own.property('Name');
                        expect(jsonChartData).to.have.own.property('Description');
                        expect(jsonChartData).to.have.own.property('ScriptURI');
                        expect(stringIsAValidUrl(jsonChartData['ScriptURI'])).to.equal(true);
                        expect(jsonChartData).to.have.own.property('ReadOnly');
                        expect(jsonChartData['ReadOnly']).to.be.a('Boolean');
                    });
                });
            });

            describe('POST', () => {
                describe('Positive', () => {
                    //TODO: Add positive POST endpoint test
                    it('Upsert Chart', async () => {
                        const chartResponse = await generalService.fetchStatus(
                            `/addons/api/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/api/charts`,
                            {
                                method: 'POST',
                                body: JSON.stringify(chart),
                            },
                        );
                        expect(chartResponse.Status).to.equal(400);
                        expect(chartResponse.Body.fault.faultstring).to.equal(
                            'Failed due to exception: A chart with this name already exist.',
                        );
                    });
                });

                describe('Negative', () => {
                    it('Upsert Chart - w/o mandatory field: Authorization', async () => {
                        const headers = {
                            Authorization: null as any,
                        };
                        const chartResponse = await generalService.fetchStatus(
                            `/addons/api/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/api/charts`,
                            {
                                method: 'POST',
                                body: JSON.stringify(chart),
                                headers: headers,
                            },
                        );
                        expect(chartResponse.Status).to.equal(401);
                        expect(chartResponse.Body.message).to.equal('Unauthorized');
                    });

                    it('Upsert chart - w/o mandatory field: Name', async () => {
                        const chart: Chart = { Description: '', ReadOnly: true, ScriptURI: scriptURI } as Chart;
                        const chartResponse = await generalService.fetchStatus(
                            `/addons/api/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/api/charts`,
                            {
                                method: 'POST',
                                body: JSON.stringify(chart),
                            },
                        );
                        expect(chartResponse.Status).to.equal(400);
                        expect(chartResponse.Body.fault.faultstring).to.equal(
                            'Failed due to exception: Name is a required field',
                        );
                    });

                    it('Upsert chart - w/o mandatory field: ScriptURI', async () => {
                        const chart: Chart = {
                            Name: Math.random().toString(36).substr(2, 7),
                            Description: '',
                            ReadOnly: true,
                        } as Chart;

                        const chartResponse = await generalService.fetchStatus(
                            `/addons/api/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/api/charts`,
                            {
                                method: 'POST',
                                body: JSON.stringify(chart),
                            },
                        );
                        expect(chartResponse.Status).to.equal(400);
                        expect(chartResponse.Body.fault.faultstring).to.equal(
                            'Failed due to exception: ScriptURI is a required field',
                        );
                    });
                });
            });
        });

        describe('E2E Test - UPSERT (POST) 5 valid charts & validate GET returns all 5 correctly', () => {
            it('Testing UPSERT (POST) - UPSERTING 5 valid charts - testing server response is in valid format', async () => {
                for (let i = 0; i < listOfChartsToUpsert.length; i++) {
                    listOfChartsToUpsert[i].Hidden = false;
                    const chartResponse = await generalService.fetchStatus(
                        `/addons/api/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/api/charts`,
                        {
                            method: 'POST',
                            body: JSON.stringify(listOfChartsToUpsert[i]),
                        },
                    );

                    expect(chartResponse.Status).to.equal(200);
                    expect(chartResponse.Ok).to.be.true;
                    expect(chartResponse.Body).to.have.own.property('Key');
                    expect(chartResponse.Body).to.have.own.property('Name');
                    expect(chartResponse.Body.Name).to.equal(listOfChartsToUpsert[i]['Name']);
                    expect(chartResponse.Body).to.have.own.property('Description');
                    expect(chartResponse.Body.Description).to.equal(listOfChartsToUpsert[i]['Description']);
                    expect(chartResponse.Body).to.have.own.property('ScriptURI');
                    expect(stringIsAValidUrl(chartResponse.Body.ScriptURI)).to.equal(true);
                    expect(chartResponse.Body).to.have.own.property('ReadOnly');
                    expect(chartResponse.Body.ReadOnly).to.be.a('Boolean');
                    //using returning data from server to save this chart script uri, read only and key attributes
                    listOfChartsToUpsert[i].ScriptURI = chartResponse.Body.ScriptURI;
                    listOfChartsToUpsert[i].ReadOnly = chartResponse.Body.ReadOnly;
                    listOfChartsToUpsert[i].Key = chartResponse.Body.Key;
                }
            });

            it('GET all charts and test we can find all 5 valid upserted charts', async () => {
                const chartResponse: Chart[] = await dataVisualisationService.getCharts();
                expect(chartResponse).to.not.equal(null);
                expect(chartResponse.length).to.be.above(0);
                //TODO: change how the logic of the test is working, since we probably don't want to iterate that matrix of [5, infinity]
                let upsertedChartFound = 0;
                for (let index = 0; index < listOfChartsToUpsert.length; index++) {
                    chartResponse.forEach((jsonChartData) => {
                        try {
                            expect(jsonChartData).to.deep.include(listOfChartsToUpsert[index]);
                        } catch (error) {
                            console.log('Error');
                            return;
                        }
                        console.log('Found!');
                        upsertedChartFound++;
                    });
                }
                expect(upsertedChartFound).to.be.equal(listOfChartsToUpsert.length);
            });
        });

        describe('Bug Verification', () => {
            it('POST - upserting a chart with number as script uri', async () => {
                const chart: Chart = {
                    Name: Math.random().toString(36).substr(2, 7),
                    Description: '',
                    ReadOnly: true,
                    ScriptURI: 721346,
                };
                const chartResponse = await generalService.fetchStatus(
                    `/addons/api/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/api/charts`,
                    {
                        method: 'POST',
                        body: JSON.stringify(chart),
                    },
                );
                expect(chartResponse.Status).to.equal(400);
                expect(chartResponse.Body.fault.faultstring).to.equal(
                    'Failed due to exception: Failed upsert file storage. error: TypeError: s.match is not a function',
                );
            });

            it('POST - upserting a chart with non url string as script uri', async () => {
                const chart: Chart = {
                    Name: Math.random().toString(36).substr(2, 7),
                    Description: '',
                    ReadOnly: true,
                    ScriptURI: 'https:fsdjkfd',
                };
                const chartResponse = await generalService.fetchStatus(
                    `/addons/api/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/api/charts`,
                    {
                        method: 'POST',
                        body: JSON.stringify(chart),
                    },
                );
                expect(chartResponse.Status).to.equal(400);
                expect(chartResponse.Body.fault.faultstring).to.equal(
                    'Failed due to exception: Failed upsert file storage. error: Error: https://papi.pepperi.com/V1.0/file_storage failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Invalid URL","detail":{"errorcode":"InvalidData"}}}',
                );
            });
        });
    });
}
