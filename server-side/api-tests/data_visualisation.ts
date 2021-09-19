import GeneralService, { TesterFunctions } from '../services/general.service';
import { DataVisualisationService, Chart } from '../services/data_visualisation.service';

export async function DataVisualisationTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const dataVisualisationService = new DataVisualisationService(generalService.papiClient);//just for lint issue

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade Data Visualisation
    const testData = {
        // 'data-visualization': ['43d4fe5c-7c60-4a91-9d65-8580dc47a4bd', ''],
        'Training Template': ['3d118baf-f576-4cdb-a81e-c2cc9af4d7ad', ''],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.chnageVersion(request.body.varKey, testData, false);
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
                it('Get Charts - Retriving data and validating its format', async () => {
                    const chart = await dataVisualisationService.getChartsAsync();
                    // const chartFromFetch: Chart = await generalService
                    // .fetchStatus('https://papi.pepperi.com/V1.0/addons/api/async/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/0.0.21/api/charts');
                    const chartAuditLogAsync = await generalService.getAuditLogResultObjectIfValid(chart.URI, 40);
                    // const chartAuditLogFetch = await generalService.getAuditLogResultObjectIfValid(chartFromFetch.Body.URI, 40);
                    const jsonDataFromAuditLog = JSON.parse(chartAuditLogAsync.AuditInfo.ResultObject);
                    jsonDataFromAuditLog.forEach(jsonDataForChart => {
                        console.log("key=>",jsonDataForChart.Key);
                        console.log("name=>",jsonDataForChart.Name);
                    });
                    debugger;
                    // expect(JSON.parse(chartAuditLogAsync.AuditInfo.ResultObject)).to.deep.equal(JSON.parse(chartAuditLogFetch.AuditInfo.ResultObject));
                });
            });
        });
    });
}
