import GeneralService, { TesterFunctions } from '../services/general.service';
import { DataVisualisationService, Chart } from '../services/data_visualisation.service';
import * as URL from 'url';

export async function DataVisualisationTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const dataVisualisationService = new DataVisualisationService(generalService.papiClient); //just for lint issue

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const listOfChartsToUpsert: Chart[] = createListOfRandCharts(); // global chart list to use in test

    //#region Upgrade Data Visualisation
    const testData = {
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
    });

    describe('Endpoints', () => {
        describe('GET', () => {
            it('Get Charts - Retriving all chart data and validating its format', async () => {
                const chartResponse = await dataVisualisationService.getChartsAsync();
                const chartAuditLogAsync = await generalService.getAuditLogResultObjectIfValid(chartResponse.URI, 40);
                expect(chartAuditLogAsync['Status']['Name']).to.equal('Success');
                const jsonDataFromAuditLog = JSON.parse(chartAuditLogAsync.AuditInfo.ResultObject);
                jsonDataFromAuditLog.forEach((jsonChartData) => {
                    expect(jsonChartData).to.have.own.property('Key');
                    expect(jsonChartData).to.have.own.property('Name');
                    expect(jsonChartData).to.have.own.property('Description');
                    expect(jsonChartData).to.have.own.property('ScriptURI');
                    expect(stringIsAValidUrl(jsonChartData['ScriptURI'])).to.equal(true);
                    expect(jsonChartData).to.have.own.property('ReadOnly');
                    expect(jsonChartData['ReadOnly']).to.be.an('Boolean');
                });
            });
        });
        describe('POST', () => {
            it('Upsert chart - w/o mandatory field: Authorization', async () => {
                const headers = {
                    Authorization: null as any,
                };
                const chartResponse = await dataVisualisationService.postChartAsync(generalService, chart, headers);
                expect(chartResponse.Status).to.equal(401);
                expect(chartResponse.Body.message).to.equal('Unauthorized');
            });
            it('Upsert chart - w/o mandatory field: Name', async () => {
                const jsonDataFromAuditLog = await testUpsertWithoutMandatoryField(
                    'Name',
                    dataVisualisationService,
                    generalService,
                );
                expect(jsonDataFromAuditLog).to.have.own.property('success');
                expect(jsonDataFromAuditLog.success).to.equal('Exception');
                expect(jsonDataFromAuditLog).to.have.own.property('errorMessage');
                expect(jsonDataFromAuditLog.errorMessage).to.include('Name is a required field');
            });
            it('Upsert chart - w/o mandatory field: ScriptURI', async () => {
                const jsonDataFromAuditLog = await testUpsertWithoutMandatoryField(
                    'ScriptURI',
                    dataVisualisationService,
                    generalService,
                );
                expect(jsonDataFromAuditLog).to.have.own.property('success');
                expect(jsonDataFromAuditLog.success).to.equal('Exception');
                expect(jsonDataFromAuditLog).to.have.own.property('errorMessage');
                expect(jsonDataFromAuditLog.errorMessage).to.include('ScriptURI is a required field');
            });
        });
    });

    describe('e2e test - UPSERT (POST) 5 valid charts & validate GET returns all 5 correctly', () => {
        it('testing UPSERT (POST) - UPSERTING 5 valid charts - testing server response is in valid format', async () => {
            for (let i = 0; i < listOfChartsToUpsert.length; i++) {
                listOfChartsToUpsert[i].Hidden = false;
                const chartResponse = await dataVisualisationService.postChartAsync(
                    generalService,
                    listOfChartsToUpsert[i],
                );
                const chartAuditLogAsync = await generalService.getAuditLogResultObjectIfValid(
                    chartResponse.Body.URI,
                    40,
                );
                expect(chartAuditLogAsync['Status']['Name']).to.equal('Success');
                const jsonDataFromAuditLog = JSON.parse(chartAuditLogAsync.AuditInfo.ResultObject);
                expect(jsonDataFromAuditLog).to.have.own.property('Key');
                expect(jsonDataFromAuditLog).to.have.own.property('Name');
                expect(jsonDataFromAuditLog['Name']).to.equal(listOfChartsToUpsert[i]['Name']);
                expect(jsonDataFromAuditLog).to.have.own.property('Description');
                expect(jsonDataFromAuditLog['Description']).to.equal(listOfChartsToUpsert[i]['Description']);
                expect(jsonDataFromAuditLog).to.have.own.property('ScriptURI');
                expect(stringIsAValidUrl(jsonDataFromAuditLog.ScriptURI)).to.equal(true);
                expect(jsonDataFromAuditLog).to.have.own.property('ReadOnly');
                expect(jsonDataFromAuditLog['ReadOnly']).to.be.an('Boolean');
                //using returning data from server to save this chart script uri, read only and key attributes
                listOfChartsToUpsert[i].ScriptURI = jsonDataFromAuditLog.ScriptURI;
                listOfChartsToUpsert[i].ReadOnly = jsonDataFromAuditLog.ReadOnly;
                listOfChartsToUpsert[i].Key = jsonDataFromAuditLog.Key;
            }
        });
        it('GET all charts and test we can find all 5 valid upserted charts', async () => {
            const chartResponse = await dataVisualisationService.getChartsAsync();
            const chartAuditLogAsync = await generalService.getAuditLogResultObjectIfValid(chartResponse.URI, 40);
            expect(chartAuditLogAsync).to.not.equal(null);
            expect(chartAuditLogAsync['Status']['Name']).to.not.equal(null);
            const jsonDataFromAuditLog = JSON.parse(chartAuditLogAsync.AuditInfo.ResultObject);
            let upsertedChartFound = 0;
            jsonDataFromAuditLog.forEach((jsonChartData) => {
                if (objectsEqual(jsonChartData, listOfChartsToUpsert)) upsertedChartFound++;
            });
            expect(upsertedChartFound).to.be.equal(listOfChartsToUpsert.length);
        });
    });
    describe('bug verification', () => {
        it('POST - upserting a chart with number as script uri', async () => {
            const jsonDataFromAuditLog = await testUpsertWithoutMandatoryField(
                'ScriptURI',
                dataVisualisationService,
                generalService,
                721346,
            );
            expect(jsonDataFromAuditLog).to.have.own.property('success');
            expect(jsonDataFromAuditLog.success).to.equal('Exception');
            expect(jsonDataFromAuditLog).to.have.own.property('errorMessage');
            expect(jsonDataFromAuditLog.errorMessage).to.include('Failed upsert file storage');
        });
        it('POST - upserting a chart with non url string as script uri', async () => {
            const jsonDataFromAuditLog = await testUpsertWithoutMandatoryField(
                'ScriptURI',
                dataVisualisationService,
                generalService,
                'https:fsdjkfd',
            );
            expect(jsonDataFromAuditLog).to.have.own.property('success');
            expect(jsonDataFromAuditLog.success).to.equal('Exception');
            expect(jsonDataFromAuditLog).to.have.own.property('errorMessage');
            expect(jsonDataFromAuditLog.errorMessage).to.include('Failed upsert file storage');
        });
    });
}

//***global variables and helper functions***//

const scriptURI = 'https://cdn.pepperi.com/7786003/CustomizationFile/7bdc82bd-0e6f-4fe4-8134-5e820829ebb8/test%20chart';

const stringIsAValidUrl = (s: string) => {
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

async function testUpsertWithoutMandatoryField(
    chartFieldToNull: string,
    dataVisualisationService: DataVisualisationService,
    generalService: GeneralService,
    dataToPass?: any,
) {
    chart.Name = generateRandomName();
    const _chart: Chart = { ...chart };
    _chart[chartFieldToNull] = dataToPass ? dataToPass : null;
    const chartResponse = await dataVisualisationService.postChartAsync(generalService, _chart);
    const chartAuditLogAsync = await generalService.getAuditLogResultObjectIfValid(chartResponse.Body.URI, 40);
    const jsonDataFromAuditLog = JSON.parse(chartAuditLogAsync.AuditInfo.ResultObject);
    return jsonDataFromAuditLog;
}

function objectsEqual(o1, listOfCharts: Chart[]): boolean {
    for (let i = 0; i < listOfCharts.length; i++) {
        if (
            o1['Key'] === listOfCharts[i]['Key'] &&
            o1['Description'] === listOfCharts[i]['Description'] &&
            o1['Name'] === listOfCharts[i]['Name'] &&
            o1['ReadOnly'] === listOfCharts[i]['ReadOnly'] &&
            o1['ScriptURI'] === listOfCharts[i]['ScriptURI']
        )
            return true;
    }
    return false;
}

function createListOfRandCharts(): Chart[] {
    const listOfCharts: Chart[] = [];
    for (let i = 0; i < 5; i++) {
        const chartToPush: Chart = {
            Description: `chart-desc-${i}`,
            Name: generateRandomName(),
            ReadOnly: false,
            ScriptURI: scriptURI,
        };
        listOfCharts.push(chartToPush);
    }
    return listOfCharts;
}

const generateRandomName = (): string => Math.random().toString(36).substr(2, 7);
