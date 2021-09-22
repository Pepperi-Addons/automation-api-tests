import GeneralService, { TesterFunctions } from '../services/general.service';
import { DataVisualisationService, Chart } from '../services/data_visualisation.service';

const name = "test chart";
const correctType = "Single";
const wrongType = "not-correct";
let corrcetScriptUri = "";
let chart = {
    "Description": "",
    "Name": name,
    "Type": correctType,
    "ScriptURI": ""
};
export async function DataVisualisationTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const dataVisualisationService = new DataVisualisationService(generalService.papiClient);//just for lint issue

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

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

    const URL = require("url").URL;
    const stringIsAValidUrl = (s) => {
        try {
            new URL(s);
            return true;
        } catch (err) {
            return false;
        }
    };

    describe('Endpoints', () => {
        describe('GET', () => {
            it('Get Charts - Retriving chart data and validating its format', async () => {
                const chartResponse = await dataVisualisationService.getChartsAsync();
                // const chartFromFetch: Chart = await generalService
                // .fetchStatus('https://papi.pepperi.com/V1.0/addons/api/async/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/version/0.0.21/api/charts');
                const chartAuditLogAsync = await generalService.getAuditLogResultObjectIfValid(chartResponse.URI, 40);
                expect(chartAuditLogAsync["Status"]["Name"]).to.equal('Success');
                // const chartAuditLogFetch = await generalService.getAuditLogResultObjectIfValid(chartFromFetch.Body.URI, 40);
                const jsonDataFromAuditLog = JSON.parse(chartAuditLogAsync.AuditInfo.ResultObject);
                jsonDataFromAuditLog.forEach(jsonChartData => {
                    expect(jsonChartData).to.have.own.property('Key');
                    expect(jsonChartData).to.have.own.property('Name');
                    expect(jsonChartData).to.have.own.property('Description');
                    expect(jsonChartData).to.have.own.property('Type');
                    expect(jsonChartData["Type"]).to.be.oneOf(["Single", "Series", "MultiSeries"]);
                    expect(jsonChartData).to.have.own.property('ScriptURI');
                    chart["ScriptURI"] = jsonChartData['ScriptURI'];
                    expect(stringIsAValidUrl(jsonChartData['ScriptURI'])).to.equal(true);
                    expect(jsonChartData).to.have.own.property('ReadOnly');
                    expect(jsonChartData["ReadOnly"]).to.be.an('Boolean');
                });
            });
        });
        describe('POST', () => {
            it('Upsert chart - w/o mandatory field Authorization', async () => {
                let headers = {
                    Authorization: null as any
                };
                const chartResponse = await dataVisualisationService.postChartAsync(generalService, chart, headers);
                expect(chartResponse.Status).to.equal(401);
                expect(chartResponse.Body.message).to.equal("Unauthorized");

            });
            it('Upsert chart - w/o mandatory field Name', async () => {
                await testPostEndPointWithoutMandatoryField('Name', dataVisualisationService, generalService, tester);
            });
            it('Upsert chart - w/o mandatory field Type', async () => {
                await testPostEndPointWithoutMandatoryField('Type', dataVisualisationService, generalService, tester);
            });
            it('Upsert chart - with not supported mandatory field Type', async () => {
                await testPostEndPointWithoutMandatoryField('Type', dataVisualisationService, generalService, tester, wrongType);
            });
            it('Upsert chart - w/o mandatory field ScriptURI', async () => {
                await testPostEndPointWithoutMandatoryField('ScriptURI', dataVisualisationService, generalService, tester);
            });
        });
    });

    describe('e2e', () => {
        it('Upsert chart - with valid data - testing output as GET response', async () => {
            chart["Description"] = "testing chart API";
            const chartResponse = await dataVisualisationService.postChartAsync(generalService, chart);
            const chartAuditLogAsync = await generalService.getAuditLogResultObjectIfValid(chartResponse.Body.URI, 40);
            expect(chartAuditLogAsync["Status"]["Name"]).to.equal('Success');
            const jsonDataFromAuditLog = JSON.parse(chartAuditLogAsync.AuditInfo.ResultObject);
            expect(jsonDataFromAuditLog).to.have.own.property('Key');
            expect(jsonDataFromAuditLog).to.have.own.property('Name');
            expect(jsonDataFromAuditLog["Name"]).to.equal(chart["Name"]);
            expect(jsonDataFromAuditLog).to.have.own.property('Description');
            expect(jsonDataFromAuditLog["Description"]).to.equal(chart["Description"]);
            expect(jsonDataFromAuditLog).to.have.own.property('Type');
            expect(jsonDataFromAuditLog["Type"]).to.equal(chart["Type"]);
            expect(jsonDataFromAuditLog).to.have.own.property('ScriptURI');
            expect(stringIsAValidUrl(jsonDataFromAuditLog['ScriptURI'])).to.equal(chart["ScriptURI"]);
            expect(jsonDataFromAuditLog).to.have.own.property('ReadOnly');
            expect(jsonDataFromAuditLog["ReadOnly"]).to.be.an('Boolean');
        });
    });
}

async function testPostEndPointWithoutMandatoryField(chartFieldToNull, dataVisualisationService, generalService, tester, dataToPass?) {
    const expect = tester.expect;
    let _chart = { ...chart };
    _chart[chartFieldToNull] = dataToPass ? dataToPass : null;
    const chartResponse = await dataVisualisationService.postChartAsync(generalService, _chart);
    const chartAuditLogAsync = await generalService.getAuditLogResultObjectIfValid(chartResponse.Body.URI, 40);
    const jsonDataFromAuditLog = JSON.parse(chartAuditLogAsync.AuditInfo.ResultObject);
    expect(jsonDataFromAuditLog).to.have.own.property('success');
    expect(jsonDataFromAuditLog.success).to.equal('Exception');
    expect(jsonDataFromAuditLog).to.have.own.property('errorMessage');
    expect(jsonDataFromAuditLog.errorMessage).to.include(
        !dataToPass ? `${chartFieldToNull} is a required field` : `${dataToPass} is not supported type`);


}

