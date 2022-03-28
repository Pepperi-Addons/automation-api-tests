import GeneralService, { TesterFunctions } from '../services/general.service';
import { DataVisualisationService, Chart } from '../services/data-visualisation.service';

export async function ChartManagerTests(generalService: GeneralService, request, tester: TesterFunctions) {
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
        CloudWatch: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', '0.0.56'], //hardcoded version -- no phased one
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
            
        });

    });
}