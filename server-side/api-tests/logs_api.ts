import GeneralService, { TesterFunctions } from '../services/general.service';
import { AwsCloudwatchGroups, LogsPayload, LogsResponse, LogsService } from '../services/logas_api.service';

export async function AWSLogsTester(generalService: GeneralService, request, tester: TesterFunctions) {
    await AWSLogsTest(generalService, request, tester);
}

export async function AWSLogsTest(generalService: GeneralService, request, tester: TesterFunctions) {
    const logsService = new LogsService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    let _startTime;
    const distUUID = generalService.getClientData('DistributorUUID');
    const userUUID = generalService.getClientData('UserUUID');
    const todaysDate = new Date().toJSON().slice(0, 10);
    const FIVE_MINS = 1000 * 60 * 5;
    const TEN_MINS = 1000 * 60 * 10;
    const HOUR = 1000 * 60 * 60; //1000 * 60 * 60 milliseconds is an hour
    const TimeZoneDiffWithAWS = HOUR * 3;
    let _envUrlBase;

    //#region Upgrade Logs Addon
    const testData = {
        Logs: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', ''], //alway take the newest version of 'logsAPI' addon
    };
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
        _envUrlBase = 'webapi.sandbox';
    } else {
        varKey = request.body.varKeyPro;
        _envUrlBase = 'webapi';
    }

    const addonVersions = await generalService.baseAddonVersionsInstallation(varKey);
    const webAPIVersion = addonVersions.chnageVersionResponseArr['WebApp API Framework'][2];
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Upgrade Logs Addon

    describe('Logs API Tests Suites', () => {
        describe('Prerequisites Addon for Chart Manager Tests', () => {
            //Test Data
            //Logs Addon Service
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
            it('POST - Basic Get Logs Functionality - Validating Format Of Deafult Payload', async () => {
                const payload: LogsPayload = {
                    Groups: ['PAPI'],
                };
                const jsonDataFromAuditLog: LogsResponse[] = await logsService.getLogsByPayload(payload);
                //Default:
                // ["DistributorUUID", "ActionUUID", "UserUUID", "Level", "Message", "DateTimeStamp"]
                expect(jsonDataFromAuditLog.length).to.be.above(0);
                jsonDataFromAuditLog.forEach((jsonLogResponse) => {
                    expect(jsonLogResponse).to.have.own.property('DistributorUUID');
                    expect(jsonLogResponse.DistributorUUID).to.equal(distUUID);
                    expect(jsonLogResponse).to.have.own.property('UserUUID');
                    expect(jsonLogResponse.UserUUID).to.equal(userUUID);
                    expect(jsonLogResponse).to.have.own.property('Level');
                    expect(jsonLogResponse.Level).to.be.oneOf(['DEBUG', 'INFO', 'ERROR', 'WARN']);
                    expect(jsonLogResponse).to.have.own.property('Message');
                    expect(jsonLogResponse).to.have.own.property('DateTimeStamp');
                    expect(jsonLogResponse.DateTimeStamp).to.include(todaysDate);
                    if (jsonLogResponse.ActionUUID) {
                        expect(jsonLogResponse).to.have.own.property('ActionUUID');
                    }
                    let dateTimeFromJson;
                    if (jsonLogResponse.DateTimeStamp) {
                        //should always be true - done for the linter
                        dateTimeFromJson = jsonLogResponse.DateTimeStamp;
                    }
                    expect(
                        generalService.isLessThanGivenTimeAgo(Date.parse(dateTimeFromJson), HOUR, TimeZoneDiffWithAWS),
                    ).to.be.true;
                });
            });
            it('POST - Basic Get Logs Functionality - Validating All Groups Exist', async () => {
                const allExpectedGropus: AwsCloudwatchGroups[] = [
                    'AsyncAddon',
                    'CodeJobs',
                    'SyncOperation',
                    'CustomDomain',
                    'LogFetcher',
                    'CPAPI',
                    'PFS',
                    'PNS',
                    'CPAS',
                    'OperationInvoker',
                    'FileIntegration',
                    'Addon',
                ];

                for (let index = 0; index < allExpectedGropus.length; index++) {
                    const payload: LogsPayload = {
                        Groups: [allExpectedGropus[index]],
                    };

                    try {
                        await logsService.getLogsByPayload(payload);
                    } catch (e) {
                        const errorMessage = (e as Error).message;
                        expect.fail(`group: '${allExpectedGropus[index]}';   failed on:'${errorMessage}'`);
                    }
                }
            });
            describe('POST - Negative Payload Testing', () => {
                it('No Payload', async () => {
                    const emptyPayload = {};
                    const jsonDataFromAuditLog = await generalService.fetchStatus('/logs', {
                        method: 'POST',
                        body: JSON.stringify(emptyPayload),
                    });
                    expect(jsonDataFromAuditLog.Ok).to.equal(false);
                    expect(jsonDataFromAuditLog.Status).to.equal(400);
                    expect(jsonDataFromAuditLog.Body.fault.faultstring).to.include('Bad Request: Groups is required');
                });
                it('Group As An Empty Array', async () => {
                    let jsonDataFromAuditLog;
                    const payload: LogsPayload = {
                        Groups: [],
                    };
                    try {
                        jsonDataFromAuditLog = await logsService.getLogsByPayload(payload);
                    } catch (e) {
                        const errorMessage = (e as Error).message;
                        expect(errorMessage).to.include('Bad Request: Groups does not meet minimum length of 1');
                    }
                    expect(jsonDataFromAuditLog).to.be.undefined;
                });
                it('Empty Filter', async () => {
                    const payload: LogsPayload = {
                        Groups: ['PAPI'],
                        Filter: '',
                    };
                    try {
                        await logsService.getLogsByPayload(payload);
                    } catch (e) {
                        const errorMessage = (e as Error).message;
                        expect(errorMessage).to.include('Bad Request: Filter does not meet minimum length of 1');
                    }
                });
                it('Negative PageSize', async () => {
                    const payload: LogsPayload = {
                        Groups: ['PAPI'],
                        Filter: "Level = 'ERROR'",
                        PageSize: -5,
                    };
                    try {
                        await logsService.getLogsByPayload(payload);
                    } catch (e) {
                        const errorMessage = (e as Error).message;
                        expect(errorMessage).to.include('Bad Request: PageSize must be greater than or equal to 1');
                    }
                });
                it('String PageSize', async () => {
                    const payload: any = {
                        Groups: ['PAPI'],
                        Filter: "Level = 'ERROR'",
                        PageSize: 'one',
                    };
                    const jsonDataFromAuditLog = await generalService.fetchStatus('/logs', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });
                    expect(jsonDataFromAuditLog.Ok).to.equal(false);
                    expect(jsonDataFromAuditLog.Status).to.equal(400);
                    expect(jsonDataFromAuditLog.Body.fault.faultstring).to.include(
                        'Bad Request: PageSize is not of a type(s) number',
                    );
                });
                it('Negative Page', async () => {
                    const payload: LogsPayload = {
                        Groups: ['PAPI'],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: -500,
                    };
                    try {
                        await logsService.getLogsByPayload(payload);
                    } catch (e) {
                        const errorMessage = (e as Error).message;
                        expect(errorMessage).to.include('Bad Request: Page must be greater than or equal to 1');
                    }
                });
                it('String Page', async () => {
                    const payload: any = {
                        Groups: ['PAPI'],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: 'one',
                    };
                    const jsonDataFromAuditLog = await generalService.fetchStatus('/logs', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });
                    expect(jsonDataFromAuditLog.Ok).to.equal(false);
                    expect(jsonDataFromAuditLog.Status).to.equal(400);
                    expect(jsonDataFromAuditLog.Body.fault.faultstring).to.include(
                        'Bad Request: Page is not of a type(s) number',
                    );
                });
                it('Empty Fields', async () => {
                    const payload: LogsPayload = {
                        Groups: ['PAPI'],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: 1,
                        Fields: [],
                    };
                    try {
                        await logsService.getLogsByPayload(payload);
                    } catch (e) {
                        const errorMessage = (e as Error).message;
                        expect(errorMessage).to.include('Bad Request: Fields does not meet minimum length of 1');
                    }
                });
                it('Empty DateTimeStamp', async () => {
                    const payload: any = {
                        Groups: ['PAPI'],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: 1,
                        Fields: ['ActionUUID'],
                        DateTimeStamp: {},
                    };
                    const jsonDataFromAuditLog = await generalService.fetchStatus('/logs', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });
                    expect(jsonDataFromAuditLog.Ok).to.equal(false);
                    expect(jsonDataFromAuditLog.Status).to.equal(400);
                    expect(jsonDataFromAuditLog.Body.fault.faultstring).to.include(
                        'Bad Request: DateTimeStamp.Start is required, DateTimeStamp.End is required',
                    );
                });
                it('Partial DateTimeStamp: start only', async () => {
                    const payload: any = {
                        Groups: ['PAPI'],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: 1,
                        Fields: ['ActionUUID'],
                        DateTimeStamp: { Start: '2022-03-15T12:35:00Z' },
                    };
                    const jsonDataFromAuditLog = await generalService.fetchStatus('/logs', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });
                    expect(jsonDataFromAuditLog.Ok).to.equal(false);
                    expect(jsonDataFromAuditLog.Status).to.equal(400);
                    expect(jsonDataFromAuditLog.Body.fault.faultstring).to.include(
                        ' Bad Request: DateTimeStamp.End is required',
                    );
                });
                it('Partial DateTimeStamp: end only', async () => {
                    const payload: any = {
                        Groups: ['PAPI'],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: 1,
                        Fields: ['ActionUUID'],
                        DateTimeStamp: { End: '2022-03-15T12:35:00Z' },
                    };
                    const jsonDataFromAuditLog = await generalService.fetchStatus('/logs', {
                        method: 'POST',
                        body: JSON.stringify(payload),
                    });
                    expect(jsonDataFromAuditLog.Ok).to.equal(false);
                    expect(jsonDataFromAuditLog.Status).to.equal(400);
                    expect(jsonDataFromAuditLog.Body.fault.faultstring).to.include(
                        'Bad Request: DateTimeStamp.Start is required',
                    );
                });
                it('Empty OrderBy', async () => {
                    const payload: LogsPayload = {
                        Groups: ['PAPI'],
                        Filter: "Level = 'ERROR'",
                        PageSize: 20,
                        Page: 1,
                        Fields: ['ActionUUID'],
                        DateTimeStamp: { Start: '2022-03-15T12:30:00Z', End: '2022-03-15T12:35:00Z' },
                        OrderBy: '',
                    };
                    try {
                        await logsService.getLogsByPayload(payload);
                    } catch (e) {
                        const errorMessage = (e as Error).message;
                        expect(errorMessage).to.include('Bad Request: OrderBy does not meet minimum length of 1');
                    }
                });
                it('All Payload Errors Stacked', async () => {
                    const payload: LogsPayload = {
                        Groups: [],
                        Filter: '',
                        PageSize: -20,
                        Page: -1,
                        Fields: [],
                        DateTimeStamp: { Start: '2022-03-15T12:30:00Z' },
                        OrderBy: '',
                    };
                    try {
                        await logsService.getLogsByPayload(payload);
                    } catch (e) {
                        const errorMessage = (e as Error).message;
                        expect(errorMessage).to.include('Bad Request: Groups does not meet minimum length of 1');
                        expect(errorMessage).to.include('Filter does not meet minimum length of 1');
                        expect(errorMessage).to.include('Fields does not meet minimum length of 1');
                        expect(errorMessage).to.include('OrderBy does not meet minimum length of 1');
                        expect(errorMessage).to.include('DateTimeStamp.End is required');
                        expect(errorMessage).to.include('PageSize must be greater than or equal to 1');
                        expect(errorMessage).to.include('Page must be greater than or equal to 1');
                    }
                });
            });
        });
        describe('Verifying Data Validity', () => {
            it('performing PAPI call', async () => {
                _startTime = new Date().toISOString();
                const PAPIcall = await generalService.fetchStatus('/addons/installed_addons?page_size=-1');
                expect(PAPIcall.Ok).to.equal(true);
                expect(PAPIcall.Status).to.equal(200);
                console.log(`PAPI call performed at:${_startTime}`);
            });
            it('PAPI group', async () => {
                generalService.sleep(1000 * 60 * 3); //3 min sleep
                const endTime = new Date().toISOString();
                const payload: LogsPayload = {
                    Groups: ['PAPI'],
                    DateTimeStamp: { Start: _startTime, End: endTime },
                };
                _startTime = new Date().toISOString();
                const jsonDataFromAuditLog: LogsResponse[] = await logsService.getLogsByPayload(payload);
                let isCorrectDataMessageFound = false;
                jsonDataFromAuditLog.forEach((cloudwatchDataPoint) => {
                    if (
                        cloudwatchDataPoint.Message?.includes(
                            '/pepperiapint.addon.svc/v1.0/addons/installed_addons?page_size=-1 Method: GET',
                        ) &&
                        cloudwatchDataPoint.UserUUID === userUUID
                    ) {
                        isCorrectDataMessageFound = true;
                        expect(cloudwatchDataPoint).to.have.own.property('DistributorUUID');
                        expect(cloudwatchDataPoint.DistributorUUID).to.equal(distUUID);
                        expect(cloudwatchDataPoint).to.have.own.property('DateTimeStamp');
                        expect(cloudwatchDataPoint.DateTimeStamp).to.include(todaysDate);
                        expect(cloudwatchDataPoint).to.have.own.property('Level');
                        expect(cloudwatchDataPoint.Level).to.equal('DEBUG');
                        const time = cloudwatchDataPoint.DateTimeStamp ? cloudwatchDataPoint.DateTimeStamp : ''; //done for the linter - shouldnt be empty
                        expect(generalService.isLessThanGivenTimeAgo(Date.parse(time), TEN_MINS, TimeZoneDiffWithAWS))
                            .to.be.true;
                    }
                });
                expect(isCorrectDataMessageFound).to.be.true;
            });
            it('LogFetcher group', async () => {
                generalService.sleep(1000 * 60 * 3); //3 min sleep
                const endTime = new Date().toISOString();
                const payload: LogsPayload = {
                    Groups: ['LogFetcher'],
                    DateTimeStamp: { Start: _startTime, End: endTime },
                };
                const jsonDataFromAuditLog: LogsResponse[] = await logsService.getLogsByPayload(payload);
                let isCorrectDataMessageFound = false;
                jsonDataFromAuditLog.forEach((cloudwatchDataPoint) => {
                    if (
                        cloudwatchDataPoint.Message?.includes(
                            '/pepperiapint.addon.svc/v1.0/addons/installed_addons?page_size=-1 Method: GET',
                        ) &&
                        cloudwatchDataPoint.UserUUID === userUUID
                    ) {
                        isCorrectDataMessageFound = true;
                        expect(cloudwatchDataPoint).to.have.own.property('DistributorUUID');
                        expect(cloudwatchDataPoint.DistributorUUID).to.equal(distUUID);
                        expect(cloudwatchDataPoint).to.have.own.property('DateTimeStamp');
                        expect(cloudwatchDataPoint.DateTimeStamp).to.include(todaysDate);
                        expect(cloudwatchDataPoint).to.have.own.property('Level');
                        expect(cloudwatchDataPoint.Level).to.equal('INFO');
                        const time = cloudwatchDataPoint.DateTimeStamp ? cloudwatchDataPoint.DateTimeStamp : ''; //done for the linter - shouldnt be empty
                        expect(generalService.isLessThanGivenTimeAgo(Date.parse(time), FIVE_MINS, TimeZoneDiffWithAWS))
                            .to.be.true;
                    }
                });
                expect(isCorrectDataMessageFound).to.be.true;
            });
            it('performing SyncOperation call', async () => {
                _startTime = new Date().toISOString();
                let createSessionResponse;
                let numOfTries = 0;
                do {
                    createSessionResponse = await generalService.fetchStatus(
                        `https://${_envUrlBase}.pepperi.com/${webAPIVersion}/webapi/Service1.svc/v1/CreateSession`,
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                accessToken: generalService['client'].OAuthAccessToken,
                                culture: 'en-US',
                            }),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                    );
                    numOfTries++;
                } while (!createSessionResponse.Body.AccessToken && numOfTries < 150);
                expect(numOfTries).to.be.lessThan(150);
                expect(createSessionResponse.Ok).to.equal(true);
                expect(createSessionResponse.Status).to.equal(200);
                const URL = `https://${_envUrlBase}.pepperi.com/${webAPIVersion}/webapi/Service1.svc/v1/GetSyncStatus`;
                const syncStatusReposnse = await generalService.fetchStatus(URL, {
                    method: 'GET',
                    headers: {
                        PepperiSessionToken: createSessionResponse.Body.AccessToken,
                        'Content-Type': 'application/json',
                    },
                });
                expect(syncStatusReposnse.Ok).to.equal(true);
                expect(syncStatusReposnse.Status).to.equal(200);
                console.log(`SyncOperation call performed at:${_startTime}`);
            });
            it('SyncOperation group', async () => {
                generalService.sleep(1000 * 60 * 3); //3 min sleep
                const endTime = new Date().toISOString();
                const payload: LogsPayload = {
                    Groups: ['SyncOperation'],
                    DateTimeStamp: { Start: _startTime, End: endTime },
                };
                const jsonDataFromAuditLog: LogsResponse[] = await logsService.getLogsByPayload(payload);
                let isCorrectDataMessageFound = false;
                jsonDataFromAuditLog.forEach((cloudwatchDataPoint) => {
                    if (
                        cloudwatchDataPoint.Message?.includes('Authorization request granted to:') &&
                        cloudwatchDataPoint.UserUUID === userUUID
                    ) {
                        isCorrectDataMessageFound = true;
                        expect(cloudwatchDataPoint).to.have.own.property('DistributorUUID');
                        expect(cloudwatchDataPoint.DistributorUUID).to.equal(distUUID);
                        expect(cloudwatchDataPoint).to.have.own.property('DateTimeStamp');
                        expect(cloudwatchDataPoint.DateTimeStamp).to.include(todaysDate);
                        expect(cloudwatchDataPoint).to.have.own.property('Level');
                        expect(cloudwatchDataPoint.Level).to.equal('INFO');
                        const time = cloudwatchDataPoint.DateTimeStamp ? cloudwatchDataPoint.DateTimeStamp : ''; //done for the linter - shouldnt be empty in any state
                        expect(generalService.isLessThanGivenTimeAgo(Date.parse(time), FIVE_MINS, TimeZoneDiffWithAWS))
                            .to.be.true;
                    }
                });
                expect(isCorrectDataMessageFound).to.be.true;
            });
        });
    });
}
