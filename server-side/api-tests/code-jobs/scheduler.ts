import GeneralService, { TesterFunctions } from '../../services/general.service';

export async function SchedulerTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const assert = tester.assert;
    const it = tester.it;

    const logcash: any = {};
    let logTimeCount = 0;
    const logTimeRetryNum = 19;
    const CallbackCash: any = {};
    let CodeJobBody: any = {};
    let CodeJobUUIDCron;

    service['options'].addonUUID = '';
    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const jsFileName = 'test_functions.js'; //'test.js';
    // let functionName = 'ido';
    //const functionNameUpdateDrafrCodeWithoutResult = 'updateDrafrCodeWithoutResult';
    const functionNamecreateNewCodeJobRetryTest = 'scheduler';
    const version = '0.0.5';

    // this will run the first test that will run the second and so on..
    await installAddonToDist();

    describe('Cron Expression Test Case', () => {
        it('Insert New AddonJob For Cron Verification Test: Finished', () => {
            assert(logcash.insertNewCJtoCronVerification, logcash.insertNewCJtoCronVerificationErrorMsg);
        });
        // it('Execute New Addon Job For Cron Verification Test: Finished', () => {
        //     assert(logcash.executeDraftCodeWithoutRetry, logcash.ErrorFromexecuteDraftCodeWithoutRetry);
        // });

        it('Validate Empty log (The Log should Be Empty): Finished', () => {
            assert(logcash.emtyLogResponsCron, logcash.emtyLogResponsCronError);
        });
        it('Validate First Log After Execution: Finished', () => {
            assert(logcash.ResponseExecutedLogsCronTest, logcash.ResponseExecutedLogsErrorMsgCronTest);
        });
        it('Validate Logs After Two Executions: Finished', () => {
            assert(logcash.ResponseExecutedLogsCronTestSecond, logcash.ResponseExecutedLogsCronTestSecondErrorMsg);
        });
        it('Update Crone To 4 Minutes (From 2): Finished', () => {
            assert(logcash.updateNewCJtoCronVerification, logcash.updateNewCJtoCronVerificationErrorMsg);
        });
        it('Validate Log After 4 Minutes: Finished', () => {
            assert(logcash.ResponseExecutedLogsCronTestLast, logcash.ResponseExecutedLogsCronTestLastErrorMsg);
        });
        it('Update IsScheduled: False To Stop Executions: Finished', () => {
            assert(
                logcash.updateCronToChroneTestIsScheduledFalse,
                logcash.updateCronToChroneTestIsScheduledFalseErrorMsg,
            );
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
            CronExpression: '*/2 * * * *',
            NextRunTime: null,
            IsScheduled: true,
            FailureAlertEmailTo: ['qa@pepperi.com'],
            FailureAlertEmailSubject: 'Execution section',
            ExecutedCode: '',
            Type: 'AddonJob',
            // DraftCode:
            //     'exports.main=async(Client)=>{\r\nvar response;\r\nClient.addLogEntry("Info", "multiplyResult");\r\nresponse={success:"true",errorMessage:"",resultObject:{}};\r\nfunction multiply(a=2,b=3){\r\nvar res = {\'multiplyResult\':a*b};\r\nClient.addLogEntry("Info","Start Funcion multiply =" + res);\r\nresponse.resultObject=res;\r\nresponse.errorMessage="test msg";\r\nresponse.success=true;\r\nreturn(response);\r\n}\r\nreturn multiply(2,3);\r\n};',
            CodeJobIsHidden: false,
            CreationDateTime: '',
            ModificationDateTime: '',
            ExecutionMemoryLevel: 1,
            AddonPath: jsFileName, // Only for AddonJob
            AddonUUID: addonUUID, // Only for AddonJob
            FunctionName: functionNamecreateNewCodeJobRetryTest,
        };

        CallbackCash.insertNewCJtoCronVerification = await service.codeJobs.upsert(CodeJobBody);

        //var status = CallbackCash.insertNewCJtoCronVerification.success;
        //CodeJobUUIDCron = CallbackCash.insertNewCJtoCronVerification.UUID;
        logcash.insertNewCJtoCronVerification = true;
        //debugger;
        if (CallbackCash.insertNewCJtoCronVerification.CodeJobName == CodeJobBody.CodeJobName) {
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
        generalService.sleep(100000);
        await getLogsToExecutedCronTest();
    }

    async function getLogsToExecutedCronTest() {
        //CallbackCash.ResponseExecutedLogsCronTest = API.Call.Sync("Get", "code_jobs/" + CodeJobUUIDCron + "/executions");
        CallbackCash.ResponseExecutedLogsCronTest = await service.auditLogs.find({
            where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
        });

        //debugger;
        if (logTimeCount > logTimeRetryNum) {
            logcash.ResponseExecutedLogsCronTest = false;
            logcash.ResponseExecutedLogsErrorMsgCronTest =
                'Executed logs API failed. ' + '\nCodeJobUUId : ' + CodeJobUUIDCron;
            await updateCronToChroneTestIsScheduledFalse();
        } else {
            if (CallbackCash.ResponseExecutedLogsCronTest.length == 0) {
                logTimeCount = logTimeCount + 1;
                generalService.sleep(20000);
                await getLogsToExecutedCronTest();
            } else {
                if (
                    CallbackCash.ResponseExecutedLogsCronTest[CallbackCash.ResponseExecutedLogsCronTest.length - 1]
                        .Status.Name == 'InProgress'
                ) {
                    generalService.sleep(20000);
                    logTimeCount = logTimeCount + 1;
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
                    logTimeCount = 0;
                    generalService.sleep(100000); // test after 2 min instead of 4 06-07-20
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
                    logTimeCount = 0; //added
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
        if (logTimeCount > logTimeRetryNum) {
            logcash.ResponseExecutedLogsCronTestSecond = false;
            logcash.ResponseExecutedLogsCronTestSecondErrorMsg =
                'The execution log not created after 10 minutes 45 sec wheiting . CodeJobUUID: ' + CodeJobUUIDCron;
            await updateCronToChroneTestIsScheduledFalse();
        } else {
            // if (CallbackCash.ResponseExecutedLogsCronTestSecond.length < 3 )
            if (CallbackCash.ResponseExecutedLogsCronTestSecond.length < 2) {
                generalService.sleep(20000);
                await getLogsToExecutedCronSecondTest();
                logTimeCount = logTimeCount + 1;
            } else {
                if (
                    // && CallbackCash.ResponseExecutedLogsCronTestSecond.length == 3
                    CallbackCash.ResponseExecutedLogsCronTestSecond.length == 2 && //changed to 2 objects after 4 min
                    CallbackCash.ResponseExecutedLogsCronTestSecond[0].Status.Name == 'Success' &&
                    CallbackCash.ResponseExecutedLogsCronTestSecond[1].Status.Name == 'Success'
                    // && CallbackCash.ResponseExecutedLogsCronTestSecond[2].Status.Name == "Success"
                ) {
                    logcash.ResponseExecutedLogsCronTestSecond = true;
                    logTimeCount = 0;
                    CallbackCash.LogLenght = CallbackCash.ResponseExecutedLogsCronTestSecond.length;
                    await updateCronToChroneTest();
                } else {
                    if (
                        CallbackCash.ResponseExecutedLogsCronTestSecond[0].Status.Name == 'InProgress' ||
                        CallbackCash.ResponseExecutedLogsCronTestSecond[1].Status.Name == 'InProgress'
                        // || CallbackCash.ResponseExecutedLogsCronTestSecond[2].Status.Name == "InProgress"
                    ) {
                        generalService.sleep(20000);
                        logTimeCount = logTimeCount + 1;
                        await getLogsToExecutedCronSecondTest();
                        //logTimeCount = logTimeCount + 1;
                    } else {
                        logcash.ResponseExecutedLogsCronTestSecond = false;
                        logcash.ResponseExecutedLogsCronTestSecondErrorMsg =
                            'Executed logs API failed. CodeJobUUId : ' + CodeJobUUIDCron;
                        logTimeCount = 0; //added
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
        // cerate new code about Cron test case
        CodeJobBody = {
            UUID: CodeJobUUIDCron,
            CodeJobName: 'Cron updating t 4 minutes',
            Description: 'Cron verification',
            CronExpression: '*/4 * * * *', // cron updated to 4 min
        };

        CallbackCash.updateNewCJtoCronVerification = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: JSON.stringify(CodeJobBody),
        });
        //var status = CallbackCash.updateNewCJtoCronVerification.success;
        logcash.updateNewCJtoCronVerification = true;

        if (CallbackCash.updateNewCJtoCronVerification.Status == 200 && CodeJobUUIDCron != '') {
            generalService.sleep(250000);
            await getLogsToExecutedCronLastTest();
        } else {
            logcash.updateNewCJtoCronVerification = false;
            logcash.updateNewCJtoCronVerificationErrorMsg =
                'Post to CodeJob on Cron Verification section failed. CodeJobUUD is : ' + CodeJobUUIDCron;
            await updateCronToChroneTestIsScheduledFalse();
        }
    }

    async function getLogsToExecutedCronLastTest() {
        //CallbackCash.ResponseExecutedLogsCronTestLast = API.Call.Sync("Get", "code_jobs/" + CodeJobUUIDCron + "/executions");
        CallbackCash.ResponseExecutedLogsCronTestLast = await service.auditLogs.find({
            where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
        });
        //v243
        //debugger;
        if (
            CallbackCash.ResponseExecutedLogsCronTestLast.length == CallbackCash.LogLenght + 1 && // changed  to formula
            CallbackCash.ResponseExecutedLogsCronTestLast[CallbackCash.LogLenght].Status.Name == 'Success'
            //&& CallbackCash.ResponseExecutedLogsCronTestLast[3].Status.Name == "Success"
        ) {
            logcash.ResponseExecutedLogsCronTestLast = true;
        } else {
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
