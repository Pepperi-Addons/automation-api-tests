import GeneralService, { TesterFunctions } from '../services/general.service';
import { LogsPayload, LogsResponse, LogsService } from '../services/logas_api.service';
// import { DataVisualisationService } from '../services/data-visualisation.service';
import jwt_decode from 'jwt-decode';


export async function AWSLogsTest(generalService: GeneralService, request, tester: TesterFunctions) {
    const logsService = new LogsService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    //#region Upgrade Data Visualisation
    const testData = {
        CloudWatch: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', '0.0.83'], //hardcoded version -- no phased one yet
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
            it('GET - Basic Get Functionality - Validating Format Of Deafult Payload', async () => {
                const distUUID = generalService.getClientData("DistributorUUID");
                const userUUID = generalService.getClientData("UserUUID");
                const todaysDate = new Date().toJSON().slice(0, 10);
                // debugger;
                const payload: LogsPayload = {
                    Groups: ["PAPI"],
                };
                const jsonDataFromAuditLog: LogsResponse[] = await logsService.getLogsByPayload(payload);
                //Default:
                // ["DistributorUUID", "ActionUUID", "UserUUID", "Level", "Message", "DateTimeStamp"]
                jsonDataFromAuditLog.forEach((jsonLogResponse) => {
                    expect(jsonLogResponse).to.have.own.property('DistributorUUID');
                    expect(jsonLogResponse.DistributorUUID).to.equal(distUUID);
                    expect(jsonLogResponse).to.have.own.property('UserUUID');
                    expect(jsonLogResponse.UserUUID).to.equal(userUUID);
                    expect(jsonLogResponse).to.have.own.property('Level');
                    expect(jsonLogResponse.Level).to.be.oneOf([
                        'DEBUG',
                        'INFO',
                        'ERROR',
                        'WARN',
                    ]);
                    expect(jsonLogResponse).to.have.own.property('Message');
                    expect(jsonLogResponse).to.have.own.property('DateTimeStamp');
                    expect(jsonLogResponse.DateTimeStamp).to.include(todaysDate);
                    if (jsonLogResponse.ActionUUID) {
                        expect(jsonLogResponse).to.have.own.property('ActionUUID');
                    }
                    expect(lessThanOneHourAgo(Date.parse(jsonLogResponse.DateTimeStamp!))).to.be.true;
                });
            });
            describe('POST - Negative Payload Testing', () => {
                it('No Payload', async () => {
                    let jsonDataFromAuditLog;
                    const emptyPayload = {};

                    jsonDataFromAuditLog = await generalService.fetchStatus('/logs', {
                        method: 'POST',
                        body: JSON.stringify(emptyPayload),
                    });
                    expect(jsonDataFromAuditLog.Ok).to.equal(false);
                    expect(jsonDataFromAuditLog.Status).to.equal(400);
                    expect(jsonDataFromAuditLog.Body.fault.faultstring).to.include("Bad Request: Groups is required");
                });
                it('Group As An Empty Array', async () => {
                    let jsonDataFromAuditLog;
                    let payload: LogsPayload = {
                        Groups: [],
                    };
                    try {
                        jsonDataFromAuditLog = await logsService.getLogsByPayload(payload);
                    } catch (e: any) {
                        expect(e.message).to.include('Bad Request: Groups does not meet minimum length of 1');
                    }
                    expect(jsonDataFromAuditLog).to.be.undefined;
                });
                it('Empty Filter', async () => {
                    let jsonDataFromAuditLog;
                    let payload: LogsPayload = {
                        Groups: ["PAPI"],
                        Filter: "",
                    };
                    try {
                        jsonDataFromAuditLog = await logsService.getLogsByPayload(payload);
                    } catch (e: any) {
                        expect(e.message).to.include('Bad Request: Filter does not meet minimum length of 1');
                    }
                    expect(jsonDataFromAuditLog).to.be.undefined;
                });
                it('Negative PageSize', async () => {
                    let jsonDataFromAuditLog;
                    let payload: LogsPayload = {
                        Groups: ["PAPI"],
                        Filter: "Level = 'ERROR'",
                        PageSize: -5,
                    };
                    try {
                        jsonDataFromAuditLog = await logsService.getLogsByPayload(payload);
                    } catch (e: any) {
                        expect(e.message).to.include('Bad Request: PageSize must be greater than or equal to 1');
                    }
                    expect(jsonDataFromAuditLog).to.be.undefined;
                });
                it('String PageSize', async () => {
                    let jsonDataFromAuditLog;
                    let payload: any = {
                        Groups: ["PAPI"],
                        Filter: "Level = 'ERROR'",
                        PageSize: "one",
                    };
                    jsonDataFromAuditLog = await generalService.fetchStatus('/logs', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });
                    expect(jsonDataFromAuditLog.Ok).to.equal(false);
                    expect(jsonDataFromAuditLog.Status).to.equal(400);
                    expect(jsonDataFromAuditLog.Body.fault.faultstring).to.include("Bad Request: PageSize is not of a type(s) number");
                });
                it('Negative Page', async () => {
                    let jsonDataFromAuditLog;
                    let payload: LogsPayload = {
                        Groups: ["PAPI"],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: -500,
                    };
                    try {
                        jsonDataFromAuditLog = await logsService.getLogsByPayload(payload);
                    } catch (e: any) {
                        expect(e.message).to.include('Bad Request: Page must be greater than or equal to 1');
                    }
                    expect(jsonDataFromAuditLog).to.be.undefined;
                });
                it('String Page', async () => {
                    let jsonDataFromAuditLog;
                    let payload: any = {
                        Groups: ["PAPI"],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: "one"
                    };
                    jsonDataFromAuditLog = await generalService.fetchStatus('/logs', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });
                    expect(jsonDataFromAuditLog.Ok).to.equal(false);
                    expect(jsonDataFromAuditLog.Status).to.equal(400);
                    expect(jsonDataFromAuditLog.Body.fault.faultstring).to.include("Bad Request: Page is not of a type(s) number");
                });
                it('Empty Fields', async () => {
                    let jsonDataFromAuditLog;
                    let payload: LogsPayload = {
                        Groups: ["PAPI"],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: 1,
                        Fields: [],
                    };
                    try {
                        jsonDataFromAuditLog = await logsService.getLogsByPayload(payload);
                    } catch (e: any) {
                        expect(e.message).to.include('Bad Request: Fields does not meet minimum length of 1');
                    }
                    expect(jsonDataFromAuditLog).to.be.undefined;
                });
                it('Empty DateTimeStamp', async () => {
                    let jsonDataFromAuditLog;
                    let payload: any = {
                        Groups: ["PAPI"],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: 1,
                        Fields: ["ActionUUID"],
                        DateTimeStamp: {},
                    };
                    jsonDataFromAuditLog = await generalService.fetchStatus('/logs', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });
                    expect(jsonDataFromAuditLog.Ok).to.equal(false);
                    expect(jsonDataFromAuditLog.Status).to.equal(400);
                    expect(jsonDataFromAuditLog.Body.fault.faultstring).to.include("Bad Request: DateTimeStamp.Start is required, DateTimeStamp.End is required");
                });
                it('Partial DateTimeStamp: start only', async () => {
                    let jsonDataFromAuditLog;
                    let payload: any = {
                        Groups: ["PAPI"],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: 1,
                        Fields: ["ActionUUID"],
                        DateTimeStamp: { "Start": "2022-03-15T12:35:00Z" },
                    };
                    jsonDataFromAuditLog = await generalService.fetchStatus('/logs', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });
                    expect(jsonDataFromAuditLog.Ok).to.equal(false);
                    expect(jsonDataFromAuditLog.Status).to.equal(400);
                    expect(jsonDataFromAuditLog.Body.fault.faultstring).to.include("Bad Request: DateTimeStamp.End is required");
                });
                it('Partial DateTimeStamp: end only', async () => {
                    let jsonDataFromAuditLog;
                    let payload: any = {
                        Groups: ["PAPI"],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: 1,
                        Fields: ["ActionUUID"],
                        DateTimeStamp: { "End": "2022-03-15T12:35:00Z" },
                    };
                    jsonDataFromAuditLog = await generalService.fetchStatus('/logs', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });
                    expect(jsonDataFromAuditLog.Ok).to.equal(false);
                    expect(jsonDataFromAuditLog.Status).to.equal(400);
                    expect(jsonDataFromAuditLog.Body.fault.faultstring).to.include("Bad Request: DateTimeStamp.Start is required");
                });
                it('Empty OrderBy', async () => {
                    let jsonDataFromAuditLog;
                    let payload: LogsPayload = {
                        Groups: ["PAPI"],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: 1,
                        Fields: ["ActionUUID"],
                        DateTimeStamp: { "Start": "2022-03-15T12:30:00Z", "End": "2022-03-15T12:35:00Z" },
                        OrderBy: ""
                    };
                    try {
                        jsonDataFromAuditLog = await logsService.getLogsByPayload(payload);
                    } catch (e: any) {
                        expect(e.message).to.include('Bad Request: OrderBy does not meet minimum length of 1');
                    }
                    expect(jsonDataFromAuditLog).to.be.undefined;
                });
                it('All Payload Errors Stacked', async () => {
                    let jsonDataFromAuditLog;
                    let payload: LogsPayload = {
                        Groups: [],
                        Filter: "",
                        PageSize: -20,
                        Page: -1,
                        Fields: [],
                        DateTimeStamp: { "Start": "2022-03-15T12:30:00Z"},
                        OrderBy: ""
                    };
                    try {
                        jsonDataFromAuditLog = await logsService.getLogsByPayload(payload);
                    } catch (e: any) {
                        expect(e.message).to.include('Bad Request: Groups does not meet minimum length of 1');
                        expect(e.message).to.include('Filter does not meet minimum length of 1');
                        expect(e.message).to.include('Fields does not meet minimum length of 1');
                        expect(e.message).to.include('OrderBy does not meet minimum length of 1');
                        expect(e.message).to.include('DateTimeStamp.End is required');
                        expect(e.message).to.include('PageSize must be greater than or equal to 1');
                        expect(e.message).to.include('Page must be greater than or equal to 1');
                    }
                    expect(jsonDataFromAuditLog).to.be.undefined;
                });
            });
        });

    });
}


const lessThanOneHourAgo = (date) => {
    const timeDiffWithAWS = (1000 * 60 * 60) * 3;//based on the formula (HOUR = (1000 * 60 * 60)) which is 3 hours
    const HOUR = 1000 * 60 * 60;
    const anHourAgo = Date.now() - HOUR;

    return (date + timeDiffWithAWS) > anHourAgo;
}