import GeneralService, { TesterFunctions } from '../services/general.service';
import { DataVisualisationService, Chart } from '../services/data-visualisation.service';

export async function DataVisualisationTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const dataVisualisationService = new DataVisualisationService(generalService);
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
        ADAL: ['00000000-0000-0000-0000-00000000ada1', '1.0.194'], //hardcoded version to match dependency of PFS
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', '0.0.86'], //hardcoded because there are a number of versions - this is the working one
        'Charts Manager': ['3d118baf-f576-4cdb-a81e-c2cc9af4d7ad', ''],
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

    describe('Chart Manager Tests Suites', () => {
        describe('Prerequisites Addon for Chart Manager Tests', () => {
            //Test Data
            //Pepperi Notification Service
            it('Validate That All The Needed Addons Installed', async () => {
                debugger;
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
                it('Get Charts - Retriving all chart data and validating its format', async () => {
                    const jsonDataFromAuditLog = await dataVisualisationService.getCharts();
                    jsonDataFromAuditLog.forEach((jsonChartData) => {
                        expect(jsonChartData).to.have.own.property('Key');
                        expect(jsonChartData).to.have.own.property('Name');
                        expect(jsonChartData).to.have.own.property('Description');
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
                        expect(jsonChartData.ScriptURI).to.include(jsonChartData.Name);
                        expect(jsonChartData).to.have.own.property('ReadOnly');
                        expect(jsonChartData.ReadOnly).to.be.a('Boolean');
                    });
                });
            });

            describe('POST', () => {
                describe('Positive', () => {
                    it('Basic Chart Upsert ', async () => {
                        const chart: Chart = {
                            Description: 'chart-desc-basic',
                            Name: generalService.generateRandomString(7),
                            ReadOnly: true,
                            ScriptURI: scriptURI,
                        } as Chart;
                        const chartResponse = await generalService.fetchStatus(`/charts`, {
                            method: 'POST',
                            body: JSON.stringify(chart),
                        });
                        expect(chartResponse.Status).to.equal(200);
                        expect(chartResponse.Ok).to.be.true;
                        expect(chartResponse.Body).to.have.own.property('Key');
                        expect(chartResponse.Body).to.have.own.property('Name');
                        expect(chartResponse.Body.Name).to.equal(chart.Name);
                        expect(chartResponse.Body).to.have.own.property('Description');
                        expect(chartResponse.Body.Description).to.equal(chart.Description);
                        expect(chartResponse.Body).to.have.own.property('ScriptURI');
                        expect(chartResponse.Body.ScriptURI).to.not.equal(undefined);
                        expect(chartResponse.Body.ScriptURI).to.not.equal(null);
                        expect(chartResponse.Body.ScriptURI).to.not.equal('');
                        expect(chartResponse.Body.ScriptURI).to.include.oneOf([
                            'pfs.pepperi.com',
                            'cdn.pepperi.com',
                            'pfs.staging.pepperi.com',
                            'cdn.staging.pepperi.com',
                        ]);
                        expect(chartResponse.Body.ScriptURI).to.include('.js');
                        expect(chartResponse.Body.ScriptURI).to.include(chartResponse.Body.Name);
                        expect(chartResponse.Body).to.have.own.property('ReadOnly');
                        expect(chartResponse.Body.ReadOnly).to.be.a('Boolean');
                    });
                });

                describe('Negative', () => {
                    it('Upsert Chart - w/o mandatory field: Authorization', async () => {
                        const chart: Chart = {
                            Description: 'desc',
                            Name: generalService.generateRandomString(7),
                            ReadOnly: true,
                            ScriptURI: scriptURI,
                        } as Chart;
                        const headers = {
                            Authorization: null as any,
                        };
                        const chartResponse = await generalService.fetchStatus(`/charts`, {
                            method: 'POST',
                            body: JSON.stringify(chart),
                            headers: headers,
                        });
                        expect(chartResponse.Status).to.equal(401);
                        expect(chartResponse.Body.message).to.equal('Unauthorized');
                    });

                    it('Upsert chart - w/o mandatory field: Name', async () => {
                        const chart: Chart = { Description: '', ReadOnly: true, ScriptURI: scriptURI } as Chart;
                        const chartResponse = await generalService.fetchStatus(`/charts`, {
                            method: 'POST',
                            body: JSON.stringify(chart),
                        });
                        expect(chartResponse.Status).to.equal(400);
                        expect(chartResponse.Body.fault.faultstring).to.equal(
                            'Failed due to exception: Name is a required field',
                        );
                    });

                    it('Upsert chart - w/o mandatory field: ScriptURI', async () => {
                        const chart: Chart = {
                            Name: generalService.generateRandomString(7),
                            Description: 'desc',
                            ReadOnly: true,
                        } as Chart;

                        const chartResponse = await generalService.fetchStatus(`/charts`, {
                            method: 'POST',
                            body: JSON.stringify(chart),
                        });
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
                    const chartResponse = await generalService.fetchStatus(`/charts`, {
                        method: 'POST',
                        body: JSON.stringify(listOfChartsToUpsert[i]),
                    });

                    expect(chartResponse.Status).to.equal(200);
                    expect(chartResponse.Ok).to.be.true;
                    expect(chartResponse.Body).to.have.own.property('Key');
                    expect(chartResponse.Body).to.have.own.property('Name');
                    expect(chartResponse.Body.Name).to.equal(listOfChartsToUpsert[i].Name);
                    expect(chartResponse.Body).to.have.own.property('Description');
                    expect(chartResponse.Body.Description).to.equal(listOfChartsToUpsert[i].Description);
                    expect(chartResponse.Body).to.have.own.property('ScriptURI');
                    expect(chartResponse.Body).to.have.own.property('ScriptURI');
                    expect(chartResponse.Body.ScriptURI).to.not.equal(undefined);
                    expect(chartResponse.Body.ScriptURI).to.not.equal(null);
                    expect(chartResponse.Body.ScriptURI).to.not.equal('');
                    expect(chartResponse.Body.ScriptURI).to.include.oneOf([
                        'pfs.pepperi.com',
                        'cdn.pepperi.com',
                        'pfs.staging.pepperi.com',
                        'cdn.staging.pepperi.com',
                    ]);
                    expect(chartResponse.Body.ScriptURI).to.include('.js');
                    expect(chartResponse.Body.ScriptURI).to.include(chartResponse.Body.Name);
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
                    ReadOnly: true,
                    ScriptURI: 721346,
                };
                const chartResponse = await generalService.fetchStatus(`/charts`, {
                    method: 'POST',
                    body: JSON.stringify(chart),
                });
                expect(chartResponse.Status).to.equal(400);
                expect(chartResponse.Body.fault.faultstring).to.include(
                    'Failed due to exception: Failed upsert file storage',
                );
                expect(chartResponse.Body.fault.faultstring).to.include('failed with status: 400');
            });

            it('POST - upserting a chart with non url string as script uri', async () => {
                const chart: Chart = {
                    Name: generalService.generateRandomString(7),
                    Description: 'desc',
                    ReadOnly: true,
                    ScriptURI: 'https:fsdjkfd',
                };
                const chartResponse = await generalService.fetchStatus(`/charts`, {
                    method: 'POST',
                    body: JSON.stringify(chart),
                });
                expect(chartResponse.Status).to.equal(400);
                expect(chartResponse.Body.fault.faultstring).to.include(
                    'Failed due to exception: Failed upsert file storage',
                );
                expect(chartResponse.Body.fault.faultstring).to.include('failed with status: 400');
            });

            // it('POST - upserting a chart with desc as empty string', async () => {
            //     const chart: Chart = {
            //         Name: generalService.generateRandomString(7),
            //         Description: "",
            //         ReadOnly: true,
            //         ScriptURI: scriptURI,
            //     };
            //     const chartResponse = await generalService.fetchStatus(`/charts`, {
            //         method: 'POST',
            //         body: JSON.stringify(chart),
            //     });
            //     expect(chartResponse.Status).to.equal(200);
            //     expect(chartResponse.Ok).to.be.true;
            //     expect(chartResponse.Body).to.have.own.property('Key');
            //     expect(chartResponse.Body).to.have.own.property('Name');
            //     expect(chartResponse.Body.Name).to.equal(chart.Name);
            //     expect(chartResponse.Body).to.have.own.property('ScriptURI');
            //     expect(chartResponse.Body.ScriptURI).to.not.equal(undefined);
            //     expect(chartResponse.Body.ScriptURI).to.not.equal(null);
            //     expect(chartResponse.Body.ScriptURI).to.not.equal('');
            //     expect(chartResponse.Body.ScriptURI).to.include.oneOf(['pfs.pepperi.com', 'cdn.pepperi.com']);
            //     expect(chartResponse.Body.ScriptURI).to.include('.js');
            //     expect(chartResponse.Body.ScriptURI).to.include(chartResponse.Body.Name);
            //     expect(chartResponse.Body).to.have.own.property('ReadOnly');
            //     expect(chartResponse.Body.ReadOnly).to.be.a('Boolean');
            // });
        });
        describe('Test Clean Up (Hidden = true)', () => {
            it('All The Charts Hidden', async () => {
                await expect(TestCleanUp(dataVisualisationService)).eventually.to.be.above(0);
            });
        });
    });
}

//Service Functions
//Remove all test Charts (Hidden = true)
async function TestCleanUp(service: DataVisualisationService) {
    const allChartsObjects: Chart[] = await service.getCharts();
    let deletedCounter = 0;

    for (let index = 0; index < allChartsObjects.length; index++) {
        if (
            allChartsObjects[index].Description?.startsWith('chart-desc') && //as all the charts im upserting to api start with this description -- wont delete templates
            allChartsObjects[index].Hidden == false
        ) {
            allChartsObjects[index].Hidden = true;
            await service.postChart(allChartsObjects[index]);
            deletedCounter++;
        }
    }
    console.log('Hidded Charts: ' + deletedCounter);
    return deletedCounter;
}
