import { expect } from 'chai';
import GeneralService, { TesterFunctions } from '../../services/general.service';

export async function SchedulerTester(generalService: GeneralService, request, tester: TesterFunctions) {
    await SchedulerTests(generalService, request, tester);
}

export async function SchedulerTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const it = tester.it;

    const logcash: any = {};
    let logTimeCount1 = 0;
    let logTimeCount2 = 0;
    const logTimeRetryNum = 19;
    const CallbackCash: any = {};
    let CodeJobBody: any = {};
    let CodeJobUUIDCron;
    let didRunOnce = false;

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    await generalService.baseAddonVersionsInstallation(varKey, undefined, true);
    const testData = {
        Scheduler: ['8bc903d1-d97a-46b8-990b-50bea356e35b', ''],
        'Async Task Execution': ['00000000-0000-0000-0000-0000000a594c', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    service['options'].addonUUID = '';
    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const jsFileName = 'test_functions.js'; //'test.js';
    const functionNamecreateNewCodeJobRetryTest = 'scheduler';
    const version = '0.0.5';

    describe('Cron Expression Test Case', async function () {
        describe('Prerequisites Addons for Scheduler Tests', () => {
            //Test Data
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
        describe('Scheduler Tests', async () => {
            it('Run Actual Test', async () => {
                // this will run the first test that will run the second and so on..
                await installAddonToDist();
            });
            it('Insert New AddonJob For Cron Verification Test: Finished', () => {
                expect(logcash.insertNewCJtoCronVerification).to.equal(true); //, logcash.insertNewCJtoCronVerificationErrorMsg
            });
            it('Validate Empty log (The Log should Be Empty): Finished', () => {
                expect(logcash.emtyLogResponsCron).to.equal(true); //, logcash.emtyLogResponsCronError);
            });
            it('Validate First Log After Execution: Finished', () => {
                expect(logcash.ResponseExecutedLogsCronTest).to.equal(true); //, logcash.ResponseExecutedLogsErrorMsgCronTest);
            });
            it('Validate Logs After Two Executions: Finished', () => {
                expect(logcash.ResponseExecutedLogsCronTestSecond).to.equal(true); // logcash.ResponseExecutedLogsCronTestSecondErrorMsg);
            });
            it('Update Crone To 4 Minutes (From 2): Finished', () => {
                expect(logcash.updateNewCJtoCronVerification).to.equal(true); // logcash.updateNewCJtoCronVerificationErrorMsg);
            });
            it('Validate Log After 4 Minutes: Finished', () => {
                expect(logcash.ResponseExecutedLogsCronTestLast).to.equal(true); // logcash.ResponseExecutedLogsCronTestLastErrorMsg);
            });
            it('Update IsScheduled: False To Stop Executions: Finished', () => {
                expect(logcash.updateCronToChroneTestIsScheduledFalse).to.equal(true);
                //logcash.updateCronToChroneTestIsScheduledFalseErrorMsg,
            });
            //TODO:
            // it('Testing /jobs/stop: Stopping A Running Code Job', async () => {
            //     //1. create a code job to use cpi automation test file
            //     const longCodeJob = {
            //         UUID: '',
            //         CodeJobName: 'long code job',
            //         Description: 'automation testing',
            //         Owner: '',
            //         CronExpression: '*/2 * * * *',
            //         NextRunTime: undefined,
            //         IsScheduled: true,
            //         Type: 'AddonJob',
            //         CodeJobIsHidden: false,
            //         ExecutionMemoryLevel: 1,
            //         AddonPath: 'test.js',
            //         AddonUUID: '2b39d63e-0982-4ada-8cbb-737b03b9ee58', // Only for AddonJob
            //         FunctionName: 'longTest',
            //     };
            //     const upsertCodeJobResponse = await service.codeJobs.upsert(longCodeJob);
            //     //2. validate everything is created successfully
            //     expect(upsertCodeJobResponse).to.haveOwnProperty('UUID');
            //     const longCodeJobUUID = upsertCodeJobResponse.UUID;
            //     console.log(longCodeJobUUID);
            //     expect(upsertCodeJobResponse.CronExpression).to.equal('*/2 * * * *');
            //     expect(upsertCodeJobResponse.CodeJobIsHidden).to.equal(false);
            //     expect(upsertCodeJobResponse.IsScheduled).to.equal(true);
            //     expect(upsertCodeJobResponse.NextRunTime).to.not.equal(undefined);
            //     expect(upsertCodeJobResponse.NextRunTime).to.not.equal(null);
            //     //3. sleep for 2.4 minutes
            //     generalService.sleep(144000);
            //     //4. stop the job
            //     const stopBody = { KeyList: [longCodeJobUUID] };
            //     const stopResponse = await generalService.fetchStatus('/addons/jobs/stop', {
            //         method: 'POST',
            //         body: JSON.stringify(stopBody)
            //     });
            //     debugger;
            //     const bodyToHide = {
            //         "UUID": longCodeJobUUID,
            //         "IsScheduled": false,
            //         "CodeJobIsHidden": true
            //     };
            //     const hideCodeJob = await generalService.fetchStatus('/code_jobs', {
            //         method: 'POST',
            //         body: JSON.stringify(bodyToHide)
            //     });
            //     expect(hideCodeJob.Body.UUID).to.equal(longCodeJobUUID);
            //     expect(hideCodeJob.Body.IsScheduled).to.equal(false);
            //     expect(hideCodeJob.Body.CodeJobIsHidden).to.equal(true);
            // });
            // it('Testing /jobs/restart: Restarting A Finished CodeJob', async () => {
            //     //1. create a code job to basic test file
            //     const restartCodeJob = {
            //         UUID: '',
            //         CodeJobName: 'restart test',
            //         Description: 'automation testing',
            //         Owner: '',
            //         CronExpression: '*/10 * * * *',
            //         NextRunTime: undefined,
            //         IsScheduled: true,
            //         Type: 'AddonJob',
            //         CodeJobIsHidden: false,
            //         ExecutionMemoryLevel: 1,
            //         AddonPath: jsFileName, // Only for AddonJob
            //         AddonUUID: addonUUID, // Only for AddonJob
            //         FunctionName: functionNamecreateNewCodeJobRetryTest,
            //     };
            //     const upsertCodeJobResponse = await service.codeJobs.upsert(restartCodeJob);
            //     //2. validate everything is created successfully
            //     expect(upsertCodeJobResponse).to.haveOwnProperty('UUID');
            //     const restartCodeJobUUID = upsertCodeJobResponse.UUID;
            //     console.log(restartCodeJobUUID);
            //     expect(upsertCodeJobResponse.CronExpression).to.equal('*/10 * * * *');
            //     expect(upsertCodeJobResponse.CodeJobIsHidden).to.equal(false);
            //     expect(upsertCodeJobResponse.IsScheduled).to.equal(true);
            //     expect(upsertCodeJobResponse.NextRunTime).to.not.equal(undefined);
            //     expect(upsertCodeJobResponse.NextRunTime).to.not.equal(null);
            //     //3. restart the job
            //     const restartBody = { Key: restartCodeJobUUID, NumnerOfTries: 1 };
            //     const restartResponse = await generalService.fetchStatus('/addons/jobs/restart', {
            //         method: 'POST',
            //         body: JSON.stringify(restartBody)
            //     });
            //     debugger;
            //     const bodyToHide = {
            //         "UUID": restartCodeJobUUID,
            //         "IsScheduled": false,
            //         "CodeJobIsHidden": true
            //     };
            //     const hideCodeJob = await generalService.fetchStatus('/code_jobs', {
            //         method: 'POST',
            //         body: JSON.stringify(bodyToHide)
            //     });
            //     expect(hideCodeJob.Body.UUID).to.equal(restartCodeJobUUID);
            //     expect(hideCodeJob.Body.IsScheduled).to.equal(false);
            //     expect(hideCodeJob.Body.CodeJobIsHidden).to.equal(true);
            // });
        });
    });

    async function installAddonToDist() {
        await generalService.fetchStatus('/addons/installed_addons/' + addonUUID + '/install' + '/' + version, {
            method: 'POST',
        });
        //#region Upgrade Pepperitest (Jenkins Special Addon)
        const testData = {
            'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, version],
        };
        CallbackCash.installAddonToDist = await generalService.changeToAnyAvailableVersion(testData);
        expect(CallbackCash.installAddonToDist['Pepperitest (Jenkins Special Addon) - Code Jobs'][1]).to.equal(version);
        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
            .eventually.to.have.property('Version')
            .a('string')
            .that.is.equal(version);
        const installedVersion = await (
            await generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get()
        ).Version;
        console.log(`installed version ${installedVersion} of testing addon ${addonUUID}`);
        //#endregion Upgrade Pepperitest (Jenkins Special Addon)
        //debugger;
        await createNewCJToChroneTest();
    }

    async function createNewCJToChroneTest() {
        CodeJobBody = {
            UUID: '',
            CodeJobName: 'New CodeJob with IsScheduled true',
            Description: 'Cron verification',
            Owner: '',
            CronExpression: '*/3 * * * *',
            NextRunTime: null,
            IsScheduled: true,
            Type: 'AddonJob',
            CodeJobIsHidden: false,
            CreationDateTime: '',
            ModificationDateTime: '',
            ExecutionMemoryLevel: 1,
            AddonPath: jsFileName, // Only for AddonJob
            AddonUUID: addonUUID, // Only for AddonJob
            FunctionName: functionNamecreateNewCodeJobRetryTest,
        };

        CallbackCash.insertNewCJtoCronVerification = await service.codeJobs.upsert(CodeJobBody);
        const codeJobResponse = (
            await generalService.fetchStatus('/code_jobs/' + CallbackCash.insertNewCJtoCronVerification.UUID, {
                method: 'GET',
            })
        ).Body;

        //var status = CallbackCash.insertNewCJtoCronVerification.success;
        //CodeJobUUIDCron = CallbackCash.insertNewCJtoCronVerification.UUID;
        logcash.insertNewCJtoCronVerification = true;
        // debugger;
        if (
            CallbackCash.insertNewCJtoCronVerification.CodeJobName == CodeJobBody.CodeJobName &&
            codeJobResponse.CodeJobIsHidden === false &&
            codeJobResponse.IsScheduled === true
        ) {
            // CodeJobUUIDCron != "" removed from IF
            CodeJobUUIDCron = CallbackCash.insertNewCJtoCronVerification.UUID;
            //await executeDraftCodeWithoutRetry();
            await getEmptyLogsToExecutedCronTest();
        } else {
            logcash.insertNewCJtoCronVerification = false;
            logcash.insertNewCJtoCronVerificationErrorMsg =
                'Post to CodeJob with Draft failed.CodeJobUUID is ' +
                CodeJobUUIDCron +
                '\n' +
                CallbackCash.insertNewCJtoCronVerification.statusText;
        }

        // async function executeDraftCodeWithoutRetry() {
        //     CallbackCash.executeDraftCodeWithoutRetry = await generalService.fetchStatus(
        //         '/code_jobs/async/' + CallbackCash.insertNewCJtoCronVerification.UUID + '/execute',
        //         { method: 'POST' },
        //     ); // changed to .Body.UUID from .Body.CodeJobUUID

        //     if (
        //         CallbackCash.executeDraftCodeWithoutRetry.Status == 200 && // status changed to Status
        //         CallbackCash.executeDraftCodeWithoutRetry.Body.ExecutionUUID != '' &&
        //         CallbackCash.executeDraftCodeWithoutRetry.Body.URI != ''
        //     ) {
        //         logcash.executeDraftCodeWithoutRetry = true;
        //     } else {
        //         logcash.executeDraftCodeWithoutRetry = false;
        //         logcash.ErrorFromexecuteDraftCodeWithoutRetry = 'Post to execute CodeJob with draft code failed';
        //     }
        //     //debugger;
        //     generalService.sleep(20000);
        //     await getEmptyLogsToExecutedCronTest();
        // }
        // service .httpPost("/code_jobs", CodeJobBody, (success) => {
        //     logcash.insertNewCJtoCronVerification = true;
        //     CodeJobUUIDCron = CallbackCash.insertNewCJtoCronVerification.UUID;  // result.CodeJobUUID to result.UUID
        //     publishCodeJobCronTest();
        // }, (error) => {
        //     logcash.insertNewCJtoCronVerification = false;
        //     logcash.insertNewCJtoCronVerificationErrorMsg = ("Post to CodeJob with Draft failed.CodeJobUUID is " + CodeJobUUIDCron + "\n" + CallbackCash.insertNewCJtoCronVerification.statusText);
        // });

        // const res = await service.getAddons();
        // return res
    }

    // async function publishCodeJobCronTest() {
    //     // publish this job code
    //     CallbackCash.publishCodeJobCronTest = await generalService.fetchStatus(
    //         `/code_jobs/${CodeJobUUIDCron}/publish`,
    //         {
    //             method: 'POST',
    //         },
    //     );
    //     if (CallbackCash.publishCodeJobCronTest.Status == 200) {
    //         CallbackCash.publishCodeJobCronTest = true;
    //         generalService.sleep(5000);
    //         await getEmptyLogsToExecutedCronTest();
    //     } else {
    //         CallbackCash.publishCodeJobCronTest = false;
    //         CallbackCash.publishCodeJobCronTestError = 'The publish  failed . CodeJobUUID is ' + CodeJobUUIDCron;
    //         await updateCronToChroneTestIsScheduledFalse();
    //     }
    //     CallbackCash.publishCodeJobCronRunTime = new Date().toISOString();
    // }
    async function getEmptyLogsToExecutedCronTest() {
        //CallbackCash.ResponseEmptyExecutedLogsCronTest = API.Call.Sync("Get", "code_jobs/" + CodeJobUUIDCron + "/executions");
        CallbackCash.ResponseEmptyExecutedLogsCronTest = await service.auditLogs.find({
            where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
        });
        try {
            if (CallbackCash.ResponseEmptyExecutedLogsCronTest.length == 0) {
                logcash.emtyLogResponsCron = true;
            } else {
                logcash.emtyLogResponsCron = false;
                logcash.emtyLogResponsCronError =
                    'Get CodeJobs Execution logs will be empty on the first 2 minutes after publish. ' +
                    'CodeJobUUID is : ' +
                    CodeJobUUIDCron;
            }
        } catch (error) {
            logcash.emtyLogResponsCron = true; //when log is empty get failure exeption
        }
        generalService.sleep(165000);
        await getLogsToExecutedCronTest();
    }

    async function getLogsToExecutedCronTest() {
        //CallbackCash.ResponseExecutedLogsCronTest = API.Call.Sync("Get", "code_jobs/" + CodeJobUUIDCron + "/executions");
        CallbackCash.ResponseExecutedLogsCronTest = await service.auditLogs.find({
            where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
        });

        //debugger;
        if (logTimeCount1 > logTimeRetryNum) {
            logcash.ResponseExecutedLogsCronTest = false;
            logcash.ResponseExecutedLogsErrorMsgCronTest =
                'Executed logs API failed. ' + '\nCodeJobUUId : ' + CodeJobUUIDCron;
            console.log(
                'ERROR:' +
                    logcash.ResponseExecutedLogsErrorMsgCronTest +
                    'DIDNT RUN, RECIVED THE NEXT JOB ARRAY:' +
                    CallbackCash.ResponseExecutedLogsCronTest,
            );
            await updateCronToChroneTestIsScheduledFalse();
        } else {
            if (CallbackCash.ResponseExecutedLogsCronTest.length == 0) {
                logTimeCount1++;
                generalService.sleep(30000);
                await getLogsToExecutedCronTest();
            } else {
                if (
                    CallbackCash.ResponseExecutedLogsCronTest[CallbackCash.ResponseExecutedLogsCronTest.length - 1]
                        .Status.Name == 'InProgress'
                ) {
                    generalService.sleep(30000);
                    logTimeCount1++;
                    await getLogsToExecutedCronTest();
                    //logTimeCount = logTimeCount + 1;
                }
                //var tmp = JSON.parse(CallbackCash.ResponseExecutedLogsCronTest[0]Object);
                else if (
                    CallbackCash.ResponseExecutedLogsCronTest[CallbackCash.ResponseExecutedLogsCronTest.length - 1]
                        .Status.Name == 'Success' &&
                    CallbackCash.ResponseExecutedLogsCronTest[0].Status.Name == 'Success' &&
                    CallbackCash.ResponseExecutedLogsCronTest.length == 1 &&
                    //&& CallbackCash.ResponseExecutedLogsCronTest[0].Success == true
                    JSON.parse(CallbackCash.ResponseExecutedLogsCronTest[0].AuditInfo.ResultObject).resultObject
                        .multiplyResult == 6 &&
                    CallbackCash.ResponseExecutedLogsCronTest[0].AuditInfo.JobMessageData.CodeJobUUID == CodeJobUUIDCron
                ) {
                    logcash.ResponseExecutedLogsCronTest = true;
                    generalService.sleep(165000); // test after 2 min instead of 4 06-07-20
                    await getLogsToExecutedCronSecondTest();
                } else {
                    logcash.ResponseExecutedLogsCronTest = false; //changed from CallbackCash.ResponseExecutedLogsCronTest[0].AuditLogUUID
                    logcash.ResponseExecutedLogsErrorMsgCronTest =
                        'Executed logs API failed. AuditLogUUID Is  :' +
                        CallbackCash.ResponseExecutedLogsCronTest[0].UUID +
                        '\nCodeJobUUId : ' +
                        CodeJobUUIDCron +
                        '\nDistributorUUID : ' +
                        CallbackCash.ResponseExecutedLogsCronTest[0].DistributorUUID;
                    if (
                        CallbackCash.ResponseExecutedLogsCronTest[CallbackCash.ResponseExecutedLogsCronTest.length - 1]
                            .Status.Name != 'Success'
                    )
                        console.log(
                            'ERORR MESSAGE RECIVED:' +
                                (CallbackCash.ResponseExecutedLogsCronTest[
                                    CallbackCash.ResponseExecutedLogsCronTest.length - 1
                                ].AuditInfo.ErrorMessage
                                    ? CallbackCash.ResponseExecutedLogsCronTest[
                                          CallbackCash.ResponseExecutedLogsCronTest.length - 1
                                      ].AuditInfo.ErrorMessage
                                    : ''),
                        );
                    if (CallbackCash.ResponseExecutedLogsCronTest[0].Status.Name != 'Success')
                        console.log(
                            'ERORR MESSAGE RECIVED:' +
                                (CallbackCash.ResponseExecutedLogsCronTest[0].AuditInfo.ErrorMessage
                                    ? CallbackCash.ResponseExecutedLogsCronTest[0].AuditInfo.ErrorMessage
                                    : ''),
                        );
                    if (CallbackCash.ResponseExecutedLogsCronTest.length != 1)
                        console.log(
                            'GOT: ' + CallbackCash.ResponseExecutedLogsCronTest.length + 'RESPONSES INSTEAD OF ONE',
                        );
                    await updateCronToChroneTestIsScheduledFalse();
                }
            }
        }
    }

    async function getLogsToExecutedCronSecondTest() {
        //CallbackCash.ResponseExecutedLogsCronTestSecond = API.Call.Sync("Get", "code_jobs/" + CodeJobUUIDCron + "/executions");
        CallbackCash.ResponseExecutedLogsCronTestSecond = await service.auditLogs.find({
            where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
        });

        //debugger;
        if (logTimeCount2 > logTimeRetryNum) {
            logcash.ResponseExecutedLogsCronTestSecond = false;
            logcash.ResponseExecutedLogsCronTestSecondErrorMsg =
                'The execution log not created after 10 minutes 45 sec wheiting . CodeJobUUID: ' + CodeJobUUIDCron;
            await updateCronToChroneTestIsScheduledFalse();
        } else {
            // if (CallbackCash.ResponseExecutedLogsCronTestSecond.length < 3 )
            if (CallbackCash.ResponseExecutedLogsCronTestSecond.length < 2) {
                generalService.sleep(30000);
                await getLogsToExecutedCronSecondTest();
                logTimeCount2++;
            } else {
                if (
                    // && CallbackCash.ResponseExecutedLogsCronTestSecond.length == 3
                    CallbackCash.ResponseExecutedLogsCronTestSecond.length == 2 && //changed to 2 objects after 4 min
                    CallbackCash.ResponseExecutedLogsCronTestSecond[0].Status.Name == 'Success' &&
                    CallbackCash.ResponseExecutedLogsCronTestSecond[1].Status.Name == 'Success'
                    // && CallbackCash.ResponseExecutedLogsCronTestSecond[2].Status.Name == "Success"
                ) {
                    logcash.ResponseExecutedLogsCronTestSecond = true;
                    // logTimeCount = 0;
                    CallbackCash.LogLenght = CallbackCash.ResponseExecutedLogsCronTestSecond.length;
                    await updateCronToChroneTest();
                } else {
                    if (
                        CallbackCash.ResponseExecutedLogsCronTestSecond[0].Status.Name == 'InProgress' ||
                        CallbackCash.ResponseExecutedLogsCronTestSecond[1].Status.Name == 'InProgress'
                        // || CallbackCash.ResponseExecutedLogsCronTestSecond[2].Status.Name == "InProgress"
                    ) {
                        generalService.sleep(30000);
                        logTimeCount2++;
                        await getLogsToExecutedCronSecondTest();
                        //logTimeCount = logTimeCount + 1;
                    } else {
                        logcash.ResponseExecutedLogsCronTestSecond = false;
                        logcash.ResponseExecutedLogsCronTestSecondErrorMsg =
                            'Executed logs API failed. CodeJobUUId : ' + CodeJobUUIDCron;
                        CallbackCash.LogLenght = CallbackCash.ResponseExecutedLogsCronTestSecond.length; // added on 06-05-20
                        await updateCronToChroneTest();
                    }

                    //updateCronToChroneTestIsScheduledFalse();
                }
            }
        }
        //CallbackCash.LogLenght = CallbackCash.ResponseExecutedLogsCronTestSecond.length;
    }

    async function updateCronToChroneTest() {
        const nextRunTimePrebv = (
            await generalService.fetchStatus('/code_jobs/' + CodeJobUUIDCron, {
                method: 'GET',
            })
        ).Body.NextRunTime;
        debugger;
        // cerate new code about Cron test case
        CodeJobBody = {
            UUID: CodeJobUUIDCron,
            CodeJobName: 'Cron updating t 7 minutes',
            Description: 'Cron verification',
            CronExpression: '*/7 * * * *', // cron updated to 4 min
        };
        CallbackCash.updateNewCJtoCronVerification = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: JSON.stringify(CodeJobBody),
        });
        logcash.updateNewCJtoCronVerification = true;
        const nextRunTimeNew = CallbackCash.updateNewCJtoCronVerification.Body.NextRunTime;
        const codeJobResponse = (
            await generalService.fetchStatus('/code_jobs/' + CodeJobUUIDCron, {
                method: 'GET',
            })
        ).Body;
        console.log(
            `GOTTEN CODE JOB AFTER UPDATING NAME, DESC AND CRON EXPRESSION IS:\n${JSON.stringify(codeJobResponse)}`,
        );
        const codeJobResponseScheduled = codeJobResponse.IsScheduled;
        const codeJobResponseCron = codeJobResponse.CronExpression;
        const codeJobResponseHidden = codeJobResponse.CodeJobIsHidden;
        if (nextRunTimePrebv === nextRunTimeNew) {
            console.log(`ERROR: Next Run Time Didn't Change, Was: ${nextRunTimePrebv}, Now: ${nextRunTimeNew}`);
        }
        if (codeJobResponseScheduled == false) {
            console.log(`ERROR: IsScheduled Returned Fasle!`);
        }
        if (codeJobResponseCron !== '*/7 * * * *') {
            console.log(`ERROR: CronExpression Returned As: ${codeJobResponseCron}`);
        }
        if (codeJobResponseHidden == true) {
            console.log(`ERROR: Code Job Returned IsHidden = True`);
        }
        if (
            CallbackCash.updateNewCJtoCronVerification.Status == 200 &&
            CodeJobUUIDCron != '' &&
            nextRunTimePrebv !== nextRunTimeNew &&
            codeJobResponseScheduled === true &&
            codeJobResponseCron === '*/7 * * * *' &&
            codeJobResponseHidden === false
        ) {
            generalService.sleep(420000);
            await getLogsToExecutedCronLastTest();
        } else {
            logcash.updateNewCJtoCronVerification = false;
            logcash.updateNewCJtoCronVerificationErrorMsg =
                'Post to CodeJob on Cron Verification section failed. CodeJobUUD is : ' + CodeJobUUIDCron;
            await updateCronToChroneTestIsScheduledFalse();
        }
    }

    async function getLogsToExecutedCronLastTest() {
        CallbackCash.ResponseExecutedLogsCronTestLast = await service.auditLogs.find({
            where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
        });
        //v243
        if (
            CallbackCash.ResponseExecutedLogsCronTestLast.length == CallbackCash.LogLenght + 1 && // Oleg on 31/10/23 changed from CallbackCash.LogLenght + 2 to +1
            CallbackCash.ResponseExecutedLogsCronTestLast[CallbackCash.LogLenght].Status.Name == 'Success'
        ) {
            logcash.ResponseExecutedLogsCronTestLast = true;
        } else {
            if (!didRunOnce) {
                didRunOnce = true;
                generalService.sleep(1000 * 45);
                await getLogsToExecutedCronLastTest();
            }
            logcash.ResponseExecutedLogsCronTestLast = false;
            logcash.ResponseExecutedLogsCronTestLastErrorMsg =
                'Executed logs API failed. ' +
                'CodeJobUUId : ' +
                CodeJobUUIDCron +
                '\nDistributorUUID : ' +
                CallbackCash.ResponseExecutedLogsCronTest[0].DistributorUUID;
        }
        await updateCronToChroneTestIsScheduledFalse();
    }

    async function updateCronToChroneTestIsScheduledFalse() {
        // stop automated execution - IsScheduled = False
        CodeJobBody = {
            UUID: CodeJobUUIDCron,
            IsScheduled: false,
        };

        CallbackCash.updateCronToChroneTestIsScheduledFalse = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: JSON.stringify(CodeJobBody),
        });
        logcash.updateCronToChroneTestIsScheduledFalse = true;

        if (CallbackCash.updateCronToChroneTestIsScheduledFalse.Status != 200 || CodeJobUUIDCron == '') {
            logcash.updateCronToChroneTestIsScheduledFalse = false;
            logcash.updateCronToChroneTestIsScheduledFalseErrorMsg =
                'Post to CodeJob on Cron Verification section  failed. CodeJobUUD is : ' + CodeJobUUIDCron;
        }
    }
}
