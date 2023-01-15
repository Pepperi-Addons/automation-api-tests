import GeneralService, { TesterFunctions } from '../services/general.service';
import { ChartsManagerService, Chart } from '../services/chart-manager.service';

export async function ChartManagerTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const chartManagerService = new ChartsManagerService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region global variables and helper functions
    const scriptURI =
        'https://cdn.pepperi.com/7786003/CustomizationFile/7bdc82bd-0e6f-4fe4-8134-5e820829ebb8/test%20chart';

    function createListOfRandCharts(): Chart[] {
        const listOfCharts: Chart[] = [];
        for (let i = 0; i < 5; i++) {
            const chartToPush: Chart = {
                Description: `chart-desc-${i}`,
                Name: generalService.generateRandomString(7),
                ScriptURI: scriptURI,
                System: false,
            };
            listOfCharts.push(chartToPush);
        }
        return listOfCharts;
    }

    const listOfChartsToUpsert: Chart[] = createListOfRandCharts(); // global chart list to use in test
    //#endregion global variables and helper functions

    //#region Upgrade Data Visualisation
    const dimxName = generalService.papiClient['options'].baseURL.includes('staging')
        ? 'Export and Import Framework'
        : 'Export and Import Framework (DIMX)'; //to handle different DIMX names between envs
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', '1.0.2'],
        'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', ''],
        Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''],
        'Charts Manager': ['3d118baf-f576-4cdb-a81e-c2cc9af4d7ad', ''],
        'Activity Data Index': ['10979a11-d7f4-41df-8993-f06bfd778304', ''], //papi index
        'Data Visualization': ['00000000-0000-0000-0000-0da1a0de41e5', ''],
    };
    testData[`${dimxName}`] = ['44c97115-6d14-4626-91dc-83f176e9a0fc', '0.7.36'];
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    await generalService.baseAddonVersionsInstallation(varKey);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Upgrade Data Visualisation

    describe('Chart Manager Tests Suites', () => {
        describe('Prerequisites Addon for Chart Manager Tests', () => {
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
            describe('GET', () => {
                it('Get Charts - Retriving all chart data and validating its format', async () => {
                    const jsonDataFromAuditLog = await chartManagerService.getCharts();
                    jsonDataFromAuditLog.forEach((jsonChartData) => {
                        expect(jsonChartData).to.have.own.property('Key');
                        expect(jsonChartData).to.have.own.property('Name');
                        expect(jsonChartData).to.have.own.property('CreationDateTime');
                        expect(jsonChartData.CreationDateTime).to.not.equal(undefined);
                        expect(jsonChartData.CreationDateTime).to.not.equal(null);
                        expect(jsonChartData.CreationDateTime).to.not.equal('');
                        expect(jsonChartData).to.have.own.property('ModificationDateTime');
                        if (jsonChartData.Description) expect(jsonChartData).to.have.own.property('Description');
                        expect(jsonChartData).to.have.own.property('ScriptURI');
                        expect(jsonChartData.ScriptURI).to.not.equal(undefined);
                        expect(jsonChartData.ScriptURI).to.not.equal(null);
                        expect(jsonChartData.ScriptURI).to.not.equal('');
                        expect(jsonChartData.ScriptURI).to.include.oneOf([
                            'pfs.pepperi.com',
                            'cdn.pepperi.com',
                            'pfs.staging.pepperi.com',
                            'cdn.staging.pepperi.com',
                        ]);
                        expect(jsonChartData.ScriptURI).to.include('.js');
                        expect(jsonChartData.ScriptURI).to.include(jsonChartData.Key);
                        expect(jsonChartData).to.have.own.property('Hidden');
                        expect(jsonChartData.Hidden).to.be.a('Boolean');
                        expect(jsonChartData).to.have.own.property('Type');
                        expect(jsonChartData.Type).to.include.oneOf([
                            'Chart',
                            'Benchmark chart',
                            'Value scorecard',
                            'User defined',
                            'Series scorecard',
                        ]);
                        expect(jsonChartData).to.have.own.property('System');
                        expect(jsonChartData.System).to.be.a('Boolean');
                        expect(jsonChartData.System).to.equal(true);
                    });
                });
                it('Get Chart By Key', async () => {
                    const allChartsJsonDataFromAuditLog = await chartManagerService.getCharts();
                    const chartsKey: string = allChartsJsonDataFromAuditLog[0].Key
                        ? allChartsJsonDataFromAuditLog[0].Key
                        : ''; //wont happen - for the linter
                    const keyChartJsonDataFromAuditLog = await chartManagerService.getChartByKey(chartsKey);
                    const keyChart = keyChartJsonDataFromAuditLog[0];
                    expect(keyChart).to.have.own.property('Key');
                    expect(keyChart.Key).to.equal(chartsKey);
                    expect(keyChart).to.have.own.property('Name');
                    expect(keyChart.Name).to.equal(allChartsJsonDataFromAuditLog[0].Name);
                    if (keyChart.Description) {
                        expect(keyChart).to.have.own.property('Description');
                        expect(keyChart.Description).to.equal(allChartsJsonDataFromAuditLog[0].Description);
                    }
                    expect(keyChart).to.have.own.property('ScriptURI');
                    expect(keyChart.ScriptURI).to.not.equal(undefined);
                    expect(keyChart.ScriptURI).to.not.equal(null);
                    expect(keyChart.ScriptURI).to.not.equal('');
                    expect(keyChart.ScriptURI).to.include.oneOf([
                        'pfs.pepperi.com',
                        'cdn.pepperi.com',
                        'pfs.staging.pepperi.com',
                        'cdn.staging.pepperi.com',
                    ]);
                    expect(keyChart.ScriptURI).to.include('.js');
                    expect(keyChart.ScriptURI).to.include(keyChartJsonDataFromAuditLog[0].Key);
                    expect(keyChart.ScriptURI).to.equal(allChartsJsonDataFromAuditLog[0].ScriptURI);
                    expect(keyChart).to.have.own.property('Hidden');
                    expect(keyChart.Hidden).to.be.a('Boolean');
                    expect(keyChart).to.have.own.property('Type');
                    expect(keyChart.Type).to.equal(allChartsJsonDataFromAuditLog[0].Type);
                    expect(keyChart).to.have.own.property('System');
                    expect(keyChart.System).to.be.a('Boolean');
                    expect(keyChart).to.have.own.property('CreationDateTime');
                    expect(keyChart.CreationDateTime).to.not.equal(undefined);
                    expect(keyChart.CreationDateTime).to.not.equal(null);
                    expect(keyChart.CreationDateTime).to.not.equal('');
                    expect(keyChart).to.have.own.property('ModificationDateTime');
                });
            });

            describe('POST', () => {
                describe('Positive', () => {
                    it('Basic Chart Upsert ', async () => {
                        const chart: Chart = {
                            Description: 'chart-desc-basic',
                            Name: generalService.generateRandomString(7),
                            ScriptURI: scriptURI,
                            Type: 'Chart',
                        } as Chart;
                        const chartResponse = await chartManagerService.postChart(chart);
                        expect(chartResponse).to.have.own.property('Key');
                        expect(chartResponse).to.have.own.property('Name');
                        expect(chartResponse.Name).to.equal(chart.Name);
                        expect(chartResponse).to.have.own.property('Description');
                        expect(chartResponse.Description).to.equal(chart.Description);
                        expect(chartResponse).to.have.own.property('ScriptURI');
                        expect(chartResponse.ScriptURI).to.not.equal(undefined);
                        expect(chartResponse.ScriptURI).to.not.equal(null);
                        expect(chartResponse.ScriptURI).to.not.equal('');
                        expect(chartResponse.ScriptURI).to.include.oneOf([
                            'pfs.pepperi.com',
                            'cdn.pepperi.com',
                            'pfs.staging.pepperi.com',
                            'cdn.staging.pepperi.com',
                        ]);
                        expect(chartResponse.ScriptURI).to.include('.js');
                        expect(chartResponse.ScriptURI).to.include(chartResponse.Name);
                        expect(chartResponse).to.have.own.property('Hidden');
                        expect(chartResponse.Hidden).to.be.a('Boolean');
                        expect(chartResponse.Hidden).to.equal(false);
                        expect(chartResponse).to.have.own.property('Type');
                        expect(chartResponse.Type).to.equal(chart.Type);
                        expect(chartResponse).to.have.own.property('System');
                        expect(chartResponse.System).to.be.a('Boolean');
                        expect(chartResponse.System).to.equal(false);
                    });
                    it('Updating An Existing Chart ', async () => {
                        const allChartsFromServer = await chartManagerService.getCharts();
                        const chartsPostedByMe = allChartsFromServer.filter((chart) =>
                            chart.Description?.includes('chart-desc-basic'),
                        );
                        const chart: Chart = {
                            Key: chartsPostedByMe[0].Key,
                            Name: chartsPostedByMe[0].Name,
                            ScriptURI: chartsPostedByMe[0].ScriptURI,
                            Description: 'newDesc',
                            Type: 'Chart',
                        } as Chart;
                        const chartResponse = await chartManagerService.postChart(chart);
                        expect(chartResponse).to.have.own.property('Key');
                        expect(chartResponse).to.have.own.property('Name');
                        expect(chartResponse.Name).to.equal(chartsPostedByMe[0].Name);
                        expect(chartResponse).to.have.own.property('Description');
                        expect(chartResponse.Description).to.equal(chart.Description);
                        expect(chartResponse).to.have.own.property('ScriptURI');
                        expect(chartResponse.ScriptURI).to.not.equal(undefined);
                        expect(chartResponse.ScriptURI).to.not.equal(null);
                        expect(chartResponse.ScriptURI).to.not.equal('');
                        expect(chartResponse.ScriptURI).to.include.oneOf([
                            'pfs.pepperi.com',
                            'cdn.pepperi.com',
                            'pfs.staging.pepperi.com',
                            'cdn.staging.pepperi.com',
                        ]);
                        expect(chartResponse.ScriptURI).to.include('.js');
                        expect(chartResponse.ScriptURI).to.include(chartsPostedByMe[0].Key);
                        expect(chartResponse).to.have.own.property('Hidden');
                        expect(chartResponse.Hidden).to.be.a('Boolean');
                        expect(chartResponse.Hidden).to.equal(false);
                        expect(chartResponse).to.have.own.property('Type');
                        expect(chartResponse.Type).to.equal(chart.Type);
                        expect(chartResponse).to.have.own.property('System');
                        expect(chartResponse.System).to.be.a('Boolean');
                        expect(chartResponse.System).to.equal(false);
                    });
                });

                describe('Negative', () => {
                    it('Upsert Chart - w/o mandatory field: Authorization', async () => {
                        const chart: Chart = {
                            Description: 'desc',
                            Name: generalService.generateRandomString(7),
                            ScriptURI: scriptURI,
                        } as Chart;
                        const headers = {
                            Authorization: null as any,
                        };
                        const chartResponse = await generalService.fetchStatus(
                            `/addons/data/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/Charts`,
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
                        const chart: Chart = { Description: '', ScriptURI: scriptURI } as Chart;
                        let isError = false;
                        try {
                            await chartManagerService.postChart(chart);
                        } catch (error) {
                            isError = true;
                            expect((error as any).message).to.equal(
                                'Failed due to exception: Name is a required field',
                                'wrong error message w/o name',
                            );
                        }
                        expect(isError, 'no error w/o name').to.be.true;
                    });

                    it('Upsert chart - w/o mandatory field: ScriptURI', async () => {
                        const chart: Chart = {
                            Name: generalService.generateRandomString(7),
                            Description: 'desc',
                        } as Chart;
                        let isError = false;
                        try {
                            await chartManagerService.postChart(chart);
                        } catch (error) {
                            isError = true;
                            expect((error as any).message).to.include(
                                'Failed due to exception: ScriptURI is a required field',
                                'wrong message w/o script URI',
                            );
                        }
                        expect(isError, 'no error w/o scriptURI').to.be.true;
                    });

                    it('Upsert Chart - With Non Existing Type', async () => {
                        const chart: Chart = {
                            Description: 'desc',
                            Name: generalService.generateRandomString(7),
                            ScriptURI: scriptURI,
                            Type: 'xsgnjosdfgbhuoidfgh',
                        } as Chart;
                        let isError = false;
                        try {
                            await chartManagerService.postChart(chart);
                        } catch (error) {
                            isError = true;
                            expect((error as any).message).to.include(
                                'Failed due to exception: ScriptURI is a required field',
                            );
                        }
                        expect(isError, 'no error - non existing type').to.be.true;
                    });
                });
            });
        });

        describe('E2E Test - UPSERT (POST) 5 valid charts & validate GET returns all 5 correctly', () => {
            it('Testing UPSERT (POST) - UPSERTING 5 valid charts - testing server response is in valid format', async () => {
                for (let i = 0; i < listOfChartsToUpsert.length; i++) {
                    listOfChartsToUpsert[i].Hidden = false;
                    const chartResponse = await chartManagerService.postChart(listOfChartsToUpsert[i]);
                    expect(chartResponse).to.have.own.property('Key');
                    expect(chartResponse).to.have.own.property('Name');
                    expect(chartResponse.Name).to.equal(listOfChartsToUpsert[i].Name);
                    expect(chartResponse).to.have.own.property('Description');
                    expect(chartResponse.Description).to.equal(listOfChartsToUpsert[i].Description);
                    expect(chartResponse).to.have.own.property('ScriptURI');
                    expect(chartResponse).to.have.own.property('ScriptURI');
                    expect(chartResponse.ScriptURI).to.not.equal(undefined);
                    expect(chartResponse.ScriptURI).to.not.equal(null);
                    expect(chartResponse.ScriptURI).to.not.equal('');
                    expect(chartResponse.ScriptURI).to.include.oneOf([
                        'pfs.pepperi.com',
                        'cdn.pepperi.com',
                        'pfs.staging.pepperi.com',
                        'cdn.staging.pepperi.com',
                    ]);
                    expect(chartResponse.ScriptURI).to.include('.js');
                    expect(chartResponse.ScriptURI).to.include(chartResponse.Name);
                    //using returning data from server to save this chart script uri, read only and key attributes
                    listOfChartsToUpsert[i].ScriptURI = chartResponse.ScriptURI;
                    listOfChartsToUpsert[i].Key = chartResponse.Key;
                }
            });

            it('GET all charts and test we can find all 5 valid upserted charts', async () => {
                const chartResponse: Chart[] = await chartManagerService.getCharts();
                expect(chartResponse).to.not.equal(null);
                expect(chartResponse.length).to.be.above(0);
                let upsertedChartFound = 0;
                for (let index = 0; index < listOfChartsToUpsert.length; index++) {
                    chartResponse.forEach((jsonChartData) => {
                        if (jsonChartData.Key === listOfChartsToUpsert[index].Key) {
                            upsertedChartFound++;
                            delete jsonChartData.ModificationDateTime;
                            delete jsonChartData.CreationDateTime;
                            delete jsonChartData.FileID;
                            expect(jsonChartData).to.deep.equal(listOfChartsToUpsert[index]);
                        }
                    });
                }
                expect(upsertedChartFound).to.be.equal(listOfChartsToUpsert.length);
            });
        });

        describe('Bug Verification', () => {
            it('POST - upserting a chart with number as script uri', async () => {
                const chart: Chart = {
                    Name: generalService.generateRandomString(7),
                    Description: 'desc',
                    ScriptURI: 721346,
                    System: false,
                };
                try {
                    await chartManagerService.postChart(chart);
                } catch (error) {
                    expect((error as any).message).to.include('Failed due to exception: Failed upsert file storage');
                }
            });

            it('POST - upserting a chart with non url string as script uri', async () => {
                const chart: Chart = {
                    Name: generalService.generateRandomString(7),
                    Description: 'desc',
                    ScriptURI: 'https:fsdjkfd',
                };
                try {
                    await chartManagerService.postChart(chart);
                } catch (error) {
                    expect((error as any).message).to.include(
                        'Failed due to exception: Only absolute URLs are supported',
                    );
                }
            });
            it('POST - upserting a chart with desc as empty string', async () => {
                const chart: Chart = {
                    Name: generalService.generateRandomString(7),
                    ScriptURI: scriptURI,
                };
                const chartResponse = await chartManagerService.postChart(chart);
                expect(chartResponse).to.have.own.property('Key');
                expect(chartResponse).to.have.own.property('Name');
                expect(chartResponse.Name).to.equal(chart.Name);
                expect(chartResponse).to.have.own.property('ScriptURI');
                expect(chartResponse.ScriptURI).to.not.equal(undefined);
                expect(chartResponse.ScriptURI).to.not.equal(null);
                expect(chartResponse.ScriptURI).to.not.equal('');
                expect(chartResponse.ScriptURI).to.include.oneOf([
                    'pfs.pepperi.com',
                    'cdn.pepperi.com',
                    'pfs.staging.pepperi.com',
                    'cdn.staging.pepperi.com',
                ]);
                expect(chartResponse.ScriptURI).to.include('.js');
                expect(chartResponse.ScriptURI).to.include(chartResponse.Key);
            });
        });
        describe('Test Clean Up (Hidden = true)', () => {
            it('Trying To Hide (set Hidden=true) All Non System Charts', async () => {
                await expect(chartManagerService.TestCleanUp()).eventually.to.be.above(0);
            });
            it('Validate After Cleansing Only Deafult Charts Remain', async () => {
                const jsonDataFromAuditLog = await chartManagerService.getCharts();
                jsonDataFromAuditLog.forEach((jsonChartData) => {
                    expect(jsonChartData).to.have.own.property('Key');
                    expect(jsonChartData).to.have.own.property('Name');
                    expect(jsonChartData.Name).to.be.oneOf([
                        'Bar',
                        'Benchmark bar',
                        'Benchmark column',
                        'Benchmark column line',
                        'Column',
                        'Gauge',
                        'Line',
                        'Pie',
                        'Stacked bar',
                        'Progress bar',
                        'Stacked column',
                        'Value',
                        'Value and change',
                        'Value with area',
                        'Value with columns',
                    ]);
                    expect(jsonChartData).to.have.own.property('Description');
                    expect(jsonChartData.Description).to.be.oneOf([
                        'Default bar',
                        'Default benchmark bar with markers',
                        'Default benchmark column with markers',
                        'Default benchmark column and line',
                        'Default column',
                        'Default gauge',
                        'Default value',
                        'Default value and change',
                        'Default value with area',
                        'Default value with columns',
                        'Default progress bar',
                        'Default line',
                        'Default pie',
                        'Default stacked bar',
                        'Default stacked column',
                    ]);
                    expect(jsonChartData).to.have.own.property('ScriptURI');
                    expect(jsonChartData.ScriptURI).to.not.equal(undefined);
                    expect(jsonChartData.ScriptURI).to.not.equal(null);
                    expect(jsonChartData.ScriptURI).to.not.equal('');
                    expect(jsonChartData.ScriptURI).to.include.oneOf([
                        'pfs.pepperi.com',
                        'cdn.pepperi.com',
                        'pfs.staging.pepperi.com',
                        'cdn.staging.pepperi.com',
                    ]);
                    expect(jsonChartData.ScriptURI).to.include('.js');
                    expect(jsonChartData.ScriptURI).to.include(jsonChartData.Key);
                    expect(jsonChartData).to.have.own.property('Hidden');
                    expect(jsonChartData.Hidden).to.be.a('Boolean');
                    expect(jsonChartData.Hidden).to.equal(false);
                    expect(jsonChartData).to.have.own.property('Type');
                    expect(jsonChartData).to.have.own.property('System');
                    expect(jsonChartData.System).to.be.a('Boolean');
                    expect(jsonChartData.System).to.equal(true);
                });
            });
        });
    });
}
