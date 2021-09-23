import GeneralService, { TesterFunctions } from '../services/general.service';
import { DataVisualisationService, Chart } from '../services/data_visualisation.service';

let corrcetScriptUri = "";
const possibaleTypes = ["Single", "Series", "MultiSeries"];

const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

const URL = require("url").URL;
const stringIsAValidUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
};

let chart: Chart = {
    "Description": "test chart desc",
    "Name": "testing chart name",
    "Type": possibaleTypes[generateRandomNumber(0, 3)],
    "ScriptURI": "",
    "ReadOnly": true
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
                    expect(stringIsAValidUrl(jsonChartData['ScriptURI'])).to.equal(true);
                    corrcetScriptUri = jsonChartData['ScriptURI'];
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
                await testPostEndPointWithoutMandatoryField('Type', dataVisualisationService, generalService, tester, "wrongType");
            });
            it('Upsert chart - w/o mandatory field ScriptURI', async () => {
                await testPostEndPointWithoutMandatoryField('ScriptURI', dataVisualisationService, generalService, tester);
            });
        });
        describe('e2e', () => {
            it('Upsert chart - with valid data - testing output as GET response & using GET to retrive upstreamed data', async () => {
                // chart["Description"] = "testing chart API";
                const listOfChartsToUpsert: Chart[] = createListOfRandCharts();
                for (let i = 0; i < listOfChartsToUpsert.length; i++) {
                    const chartResponse = await dataVisualisationService.postChartAsync(generalService, listOfChartsToUpsert[i]);
                    const chartAuditLogAsync = await generalService.getAuditLogResultObjectIfValid(chartResponse.Body.URI, 40);
                    expect(chartAuditLogAsync["Status"]["Name"]).to.equal('Success');
                    const jsonDataFromAuditLog = JSON.parse(chartAuditLogAsync.AuditInfo.ResultObject);
                    expect(jsonDataFromAuditLog).to.have.own.property('Key');
                    listOfChartsToUpsert[i]["Key"] = jsonDataFromAuditLog["Key"];
                    expect(jsonDataFromAuditLog).to.have.own.property('Name');
                    expect(jsonDataFromAuditLog["Name"]).to.equal(listOfChartsToUpsert[i]["Name"]);
                    expect(jsonDataFromAuditLog).to.have.own.property('Description');
                    expect(jsonDataFromAuditLog["Description"]).to.equal(listOfChartsToUpsert[i]["Description"]);
                    expect(jsonDataFromAuditLog).to.have.own.property('Type');
                    expect(jsonDataFromAuditLog["Type"]).to.equal(listOfChartsToUpsert[i]["Type"]);
                    expect(jsonDataFromAuditLog).to.have.own.property('ScriptURI');
                    listOfChartsToUpsert[i]["ScriptURI"] = jsonDataFromAuditLog["ScriptURI"];
                    expect(jsonDataFromAuditLog).to.have.own.property('ReadOnly');
                    expect(jsonDataFromAuditLog["ReadOnly"]).to.be.an('Boolean');
                    listOfChartsToUpsert[i] = jsonDataFromAuditLog["ReadOnly"];
                }
                const chartResponse = await dataVisualisationService.getChartsAsync();
                const chartAuditLogAsync = await generalService.getAuditLogResultObjectIfValid(chartResponse.URI, 40);
                expect(chartAuditLogAsync["Status"]["Name"]).to.equal('Success');
                const jsonDataFromAuditLog = JSON.parse(chartAuditLogAsync.AuditInfo.ResultObject);
                let upsertedChartFound = 0;
                jsonDataFromAuditLog.forEach(jsonChartData => {
                    if (objectsEqual(jsonChartData, listOfChartsToUpsert))
                        upsertedChartFound++;
                });
                expect(upsertedChartFound).to.be.equal(listOfChartsToUpsert.length);
            });
        });
    });


}


async function testPostEndPointWithoutMandatoryField(chartFieldToNull, dataVisualisationService, generalService, tester, dataToPass?) {
    const expect = tester.expect;
    chart["ScriptURI"] = corrcetScriptUri;
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

function objectsEqual(o1, listOfCharts) {
    listOfCharts.array.forEach(element => {
        if (o1["Key"] === element["Key"] &&
            o1["Description"] === element["Description"] &&
            o1["Name"] === element["Name"] &&
            o1["ReadOnly"] === element["ReadOnly"] &&
            o1["ScriptURI"] === element["ScriptURI"] &&
            o1["Type"] !== element["Type"])
            return true;
    });
    return false;
}

function createListOfRandCharts(): Chart[] {
    let listOfCharts: Chart[] = [];
    for (let i = 0; i < 5; i++) {
        const chartToPush: Chart = {
            Description: `test-${i}`,
            Name: `chart-name-${i}`,
            ReadOnly: false,
            ScriptURI: corrcetScriptUri,
            Type: possibaleTypes[i % 3]
        };
        listOfCharts.push(chartToPush);
    }
    return listOfCharts;
}

// CreationDateTime?: string;
// Hidden?: boolean;
// ModificationDateTime?: string;
// Description: string;
// Key:string;
// Name:string;
// ReadOnly:boolean;
// ScriptURI:string;
// Type: string;
//["Single", "Series", "MultiSeries"]