import GeneralService, { TesterFunctions } from '../../services/general.service';

export async function AddonJobsTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const assert = tester.assert;
    const it = tester.it;

    service['options'].addonUUID = '';

    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const jsFileName = 'test.js';
    // let functionName = 'ido';
    const functionNameUpdateDrafrCodeWithoutResult = 'updateDrafrCodeWithoutResult';
    const functionNameUpdateCodeJob = 'UpdateCodeJob';
    const version = '0.0.4';
    const functionNameCreateNewCJToBudgetTest = 'createNewCJToBudgetTest';

    const logcash: any = {};
    let logTimeCount = 0;
    const logTimeRetryNum = 19;
    let cashCallJobsList: any = {};
    let listLength;
    const cacheLog: any = {};
    const CallbackCash: any = {};
    let JobName: any = {};
    let parsedData;
    let UserUUID;
    let UserID;
    let CodeJobUUID = '';
    const defaultValues = {
        UUID: CodeJobUUID,
        CodeJobName: JobName,
        Description: '',
        Owner: null,
        CronExpression: '',
        NextRunTime: null,
        IsScheduled: false,
        FailureAlertEmailTo: [],
        FailureAlertEmailSubject: '',
        ExecutedCode: '',
        DraftCode: '',
        CodeJobIsHidden: false,
        CreationDateTime: '',
        ModificationDateTime: '',
        ExecutionMemoryLevel: 4,
        NumberOfTries: 1,
    };
    let updateValues: any = {};
    let CodJobeBodyBudgetTest: any = {};
    let codeJobUUIDforBudget: any = {};
    let UpdateDraftCodeWithoutResult: any = {};

    //#region AllTests log and return object

    // this will run the first test that will run the second and so on..

    await installAddonToDist();
    describe('Insert New Code Job', () => {
        it('Insert New Code Job With Manadatory Parameter: Name', () => {
            assert(logcash.statusA, 'Insert new Code Job with CodeJobName failed');
        });
        it('Get Single CodeJob With Mandatory Parameter CodeJobName: Name', () => {
            assert(logcash.statusb, logcash.errorMessageb);
        });
        it('Update CodeJob Params (From Default Values): Finished', () => {
            assert(logcash.statusc, 'Update Code Job failed');
        });
        it('Get Single CodeJob After Update: Name', () => {
            assert(logcash.statusd, logcash.errorMessaged);
        });
        // it('Create CodeJob with Values: Finished', () => {
        //     assert(logcash.statuse, 'CodeJob creation with inserted values failed');
        // });
        // it('Create CodeJob With Parameters: Finished', () => {
        //     assert(logcash.statusf, logcash.errorMessagef);
        // });
    });
    // describe('Publish Code Job With/Without Draft Code', () => {
    // it('Insert New Code Job With Draft Code: Finished', () => {
    //     assert(logcash.statusPublishinsert, 'Insert new Code Job failed');
    // });
    // it('Publish Code Job With Draft Code: Finished', () => {
    //     assert(logcash.statusAfterFirstPublish, logcash.errorMessageAfterFirstPublish);
    // });
    //     it('Publish Code Job Without Draft Code: Finished', () => {
    //         assert(CallbackCash.StatusWithoutDraft, logcash.ErrorWithoutDraft);
    //     });
    // });
    describe('Get List Of CodeJobs, Phase 1 (Phase 2 Will Be Done On The End Of All Tests)', () => {
        it('Get List Of CodeJobse (https://api.pepperi.com/v1.0/code_jobs) Phase 1: Finished', () => {
            const statusA = cashCallJobsList.status;
            assert(statusA, cashCallJobsList.message);
        });
    });
    // describe('Execute Job Using Draft Code + single execution log and Code job execution logs verification', () => {
    // it('Execute job (one time) using DraftCode field: Finished', () => {
    //     assert(logcash.executeDraftCodeJobeOnce1, logcash.ErrorFromExecute);
    // });
    //     it('Get Single Execution Log: Finished', () => {
    //         assert(executionLog.Status, executionLog.Error);
    //     });
    // });
    // describe('Execute Job Using Published Code + Logs Verification', () => {
    // it('Create New CodeJob: Finished', () => {
    //     assert(logcash.createNewCJToPublish, logcash.createNewCJToPublishErrorMsg);
    // });
    // it('Publish Created CodeJob: Finished', () => {
    //     assert(CallbackCash.StatusPublished, CallbackCash.ErrorAfterPublish);
    // });
    // it('Udate Draft Code: Finished', () => {
    //     assert(logcash.UpdatedDraftCode, logcash.UpdatedDraftCode);
    // });
    // it('Execute CodeJob (Execution Code Will Run): Finished', () => {
    //     assert(logcash.executeWithDiff, logcash.executeWithDiffError);
    // });
    // it('Get CodeJob Execiotions Logs To Verify Log Format And Execution Result: Finished', () => {
    //     assert(logcash.ResponseExecutedLogs, logcash.ResponseExecutedLogsErrorMsg);
    // });

    //     it('The Verification Between Executed Code And Draft Code After Publish (Will Be Same): Finished', () => {
    //         assert(logcash.CheckBetveenDraftAndExecutedLastStatus, logcash.CheckBetveenDraftAndExecutedLastError);
    //     });
    // });
    // describe('Restore Executed CodeJob', () => {
    // it('Restore Executed CodeJob Negative Test - Restore With Wrong CodeJobUUID: Finished', () => {
    //     assert(
    //         CallbackCash.restoreNegativeWithWrongCodeJobUUIDStatus,
    //         CallbackCash.restoreNegativeWithWrongCodeJobUUIDErrorMsg,
    //     );
    // });
    // it('Restore Executed CodeJob Negative Test - AuditLogUUID Not Found (Wrong): Finished', () => {
    //     assert(
    //         CallbackCash.restoreNegativeAuditLogNotFoundStatus,
    //         CallbackCash.restoreNegativeAuditLogNotFoundErrorMsg,
    //     );
    // });
    // it('Restore Executed CodeJob Negative Test - AuditLogUUID From Wrong Status (Insert Instead Of Publish): Finished', () => {
    //     assert(
    //         CallbackCash.restoreNegativeAuditLogNotPublishStatus,
    //         CallbackCash.restoreNegativeAuditLogNotPublishErrorMsg,
    //     );
    // });

    // it('Restore Executed CodeJob: Finished', () => {
    //     assert(logcash.CheckBetveenDraftAndExecutedLastStatus, logcash.CheckBetveenDraftAndExecutedLastError);
    // });
    // });
    describe('CodeJob Audit Log Verification', () => {
        it('CodeJob Audit Log Verification On Status: Insert, Publish, Update, Rollback: Finished', () => {
            assert(CallbackCash.auditLogStatus, CallbackCash.auditLogErrMsg);
        });
    });
    describe('Insert New CodJob Without Mandatory Field CodeJob Name', () => {
        it('Insert new CodJob Without Mandatory Field CodeJob Name: Finished', () => {
            assert(logcash.MandatoryCheck, logcash.MandatoryCheckError);
        });
    });
    describe('TimeOut From Executed Draft Code', () => {
        it('Test Case TimeOut From Executed Draft Code: Finished', () => {
            assert(logcash.ResponseExecutedTimeoutTest, logcash.ResponseExecutedTimeoutTestErrorMsg);
        });
    });
    describe('Distributor Execution. Budget Updating (not 0)', () => {
        it('Get Distributor Budget Function: Finished', () => {
            assert(logcash.getDistributorBudgetTest, logcash.getDistributorBudgetTestErrorMsg);
        });
        it('Insert New CodeJob To Budget Verification: Finished', () => {
            assert(logcash.insertNewCodJobToBudgetTest, logcash.insertNewCodJobToBudgetTestErrorMsg);
        });
        it('Get Distributor Budget Function: Finished', () => {
            assert(logcash.getDistributorBudgetTestThird, logcash.getDistributorBudgetTestThirdErrorMsg);
        });
    });
    describe('Distributor Execution Budget = 0', () => {
        // it('Execute Draft Code With No Distributor Budget: Finished', () => {
        //     assert(logcash.LogToEmptyBudgetTest, logcash.LogToEmptyBudgetTestError);
        // });
        it('Execute Draft Code After Budget Updated To 2 min: Finished', () => {
            assert(logcash.LogToLastBudgetTest, logcash.LogToLastBudgetTestError);
        });
    });
    // describe('Call To PAPI From Executed Draft Code', () => {
    //     it('Single log Execution Verification (with Result From Draft Code): Finished', () => {
    //         assert(logcash.ResponseExecutedLogsPapiTest, logcash.ResponseExecutedLogsPapiTestErrorMsg);
    //     });
    // });
    //#endregion

    async function installAddonToDist() {
        await generalService.fetchStatus(
            '/addons/installed_addons/' + addonUUID + '/install' + '/' + version,
            { method: 'POST' },
        );
        //#region Upgrade Pepperitest (Jenkins Special Addon)
        const testData = {
            'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, version],
        };
        CallbackCash.installAddonToDist = await generalService.changeToAnyAvailableVersion(testData);
        //#endregion Upgrade Pepperitest (Jenkins Special Addon)
        //debugger;
        await getListOfCallJobs();
    }

    async function getListOfCallJobs() {
        cashCallJobsList = await service.codeJobs
            .iter({
                include_deleted: false,
                order_by: 'CodeJobName DESC',
                page_size: 1000,
            })
            .toArray(); //iter is include_count: true
        listLength = cashCallJobsList.length;
        //Oren 1/3: 02/05/2021 - Start from TimeOut test and continue after 130 seconds, since TimeOut logs can take up to 7 minutes.
        //await createNewCodeJobByName();
        //await getEmailStatus();
        await createNewCodeJobByName();
    }

    //#region Upsert code jobs
    //////////////////////////////////////////////////////////////////////////////////
    //                          Create new CodeJob
    //////////////////////////////////////////////////////////////////////////////////
    async function createNewCodeJobByName() {
        // JobName = { CodeJobName: 'First Olegs test' }; //create post body with one param: name
        JobName = {
            CodeJobName: 'First Olegs test',
            Type: 'AddonJob',
            AddonPath: jsFileName, // Only for AddonJob
            AddonUUID: addonUUID, // Only for AddonJob
            FunctionName: functionNameUpdateCodeJob,
            //FunctionName: functionNamePapiTransaction,
        };
        CallbackCash.ResponseCallback = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: JobName,
        });
        const status = CallbackCash.ResponseCallback.Status == 200 ? true : false;
        if (status == true && CallbackCash.ResponseCallback.Body.UUID != '') {
            logcash.statusA = true;
            CodeJobUUID = CallbackCash.ResponseCallback.Body.UUID; //replaced to if
            defaultValues.UUID = CodeJobUUID; //replaced to if
            listLength += 1;
        } else {
            logcash.statusA = false;
        }

        await getSingleCodeJobByApi();
    }

    async function getSingleCodeJobByApi() {
        CallbackCash.ResponseCallbackSingleByCJUUID = await generalService.fetchStatus(
            `/code_jobs/${CallbackCash.ResponseCallback.Body.UUID}`,
            { method: 'GET' },
        );
        // changed from CallbackCash.ResponseCallback.Body.CodeJobUUID
        try {
            const returnedObject = CallbackCash.ResponseCallbackSingleByCJUUID;
            // const CreationDateTime = new Date(returnedObject.Body.CreationDateTime);
            // const ModificationDateTime = new Date(returnedObject.Body.ModificationDateTime);
            // const successFlag = true;
            const jobNameValue = JobName.CodeJobName;
            logcash.statusb = true;
            logcash.errorMessageb = '';
            defaultValues.CodeJobName = jobNameValue;

            for (const param in returnedObject.Body) {
                if (returnedObject.Body[param] == defaultValues[param]) {
                } else if (param == 'NextRunTime' || param == 'CreationDateTime' || param == 'ModificationDateTime') {
                    returnedObject.Body[param].includes(new Date().toISOString().split('T')[0]);
                } else if (param == 'FailureAlertEmailTo') {
                    returnedObject.Body[param][0] == '';
                }
                //added new param verification 18-05-20 two else if functions
                else if (param == 'Type') {
                    returnedObject.Body[param] == 'AddonJob'; //  'UserCodeJob'
                } else if (param == 'FunctionName') {
                    returnedObject.Body[param] == functionNameUpdateCodeJob; // 'main'
                } else if (param == 'AddonPath') {
                    returnedObject.Body[param] == jsFileName;
                } else if (param == 'AddonUUID') {
                    returnedObject.Body[param] == addonUUID;
                } else {
                    logcash.statusb = false;
                    logcash.errorMessageb =
                        'The ' +
                        param +
                        'value will be ' +
                        defaultValues[param] +
                        ' ' +
                        'but the value is ' +
                        returnedObject.Body[param] +
                        ' \n';
                }
            }
        } catch (error) {
            generalService.sleep(1000);
            await getSingleCodeJobByApi();
        }
        await UpdateCodeJob();
    }

    async function UpdateCodeJob() {
        //const JobUUID = { CodeJobUUID: CallbackCash.ResponseCallback.Body.UUID }; // changed from CallbackCash.ResponseCallback.Body.CodeJobUUID
        updateValues = {
            UUID: CodeJobUUID,
            CodeJobName: defaultValues.CodeJobName + ' ' + 'updated',
            Description: 'updated desription',
            Owner: '206236',
            CronExpression: '0 9 16 12 *',
            NextRunTime: null,
            IsScheduled: false,
            FailureAlertEmailTo: ['oleg.y@pepperi.com'],
            FailureAlertEmailSubject: 'test updating',
            ExecutedCode: '',
            //Type: 'AddonJob',
            CodeJobIsHidden: false,
            CreationDateTime: '',
            ModificationDateTime: '',
            ExecutionMemoryLevel: 4,
            NumberOfTries: 1,
            AddonPath: jsFileName,
            AddonUUID: addonUUID,
            FunctionName: functionNameUpdateCodeJob,
        };

        CallbackCash.ResponseCallbackAfterUpdate = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: updateValues,
        });
        const status = CallbackCash.ResponseCallback.Status == 200 ? true : false;
        defaultValues.UUID = CodeJobUUID;
        logcash.statusc = true;

        if (status == true && CodeJobUUID != '') {
        } else {
            logcash.statusc = false;
        }
        await UpdateCodeJobVerification();
    }

    async function UpdateCodeJobVerification() {
        CallbackCash.ResponseCallbackSingleUpdated = await generalService.fetchStatus(`/code_jobs/${CodeJobUUID}`, {
            method: 'GET',
        });

        const returnedObject = CallbackCash.ResponseCallbackSingleUpdated;
        // const CreationDateTime = new Date(returnedObject.Body.CreationDateTime);
        // const ModificationDateTime = new Date(returnedObject.Body.ModificationDateTime);
        const jobNameValue = JobName.CodeJobName;
        logcash.statusd = true;

        const errorMessage = '';
        defaultValues.CodeJobName = jobNameValue;

        for (const param in returnedObject.Body) {
            if (returnedObject.Body[param] == updateValues[param]) {
            } else if (param == 'NextRunTime' || param == 'CreationDateTime' || param == 'ModificationDateTime') {
                returnedObject.Body[param].includes(new Date().toISOString().split('T')[0]);
            } else if (param == 'FailureAlertEmailTo') {
                returnedObject.Body[param][0] == 'oleg.y@pepperi.com';
            } else if (param == 'Owner') {
                //added owner validation 10/2/20
                returnedObject.Body[param] == null;
            }
            //added new param verification 18-05-20 two else if functions
            // else if (param == 'Type') {
            //     returnedObject.Body[param] == 'AddonJob';//  'UserCodeJob'
            // } else if (param == 'FunctionName') {
            //     returnedObject.Body[param] == 'main';
            else if (param == 'Type') {
                returnedObject.Body[param] == 'AddonJob'; //  'UserCodeJob'
            } else if (param == 'FunctionName') {
                returnedObject.Body[param] == functionNameUpdateCodeJob; // 'main'
            } else if (param == 'AddonPath') {
                returnedObject.Body[param] == jsFileName;
            } else if (param == 'AddonUUID') {
                returnedObject.Body[param] == addonUUID;
            } else {
                logcash.statusd = false;
                logcash.errorMessaged =
                    errorMessage +
                    ' ' +
                    'The ' +
                    param +
                    ' value will be ' +
                    updateValues[param] +
                    ' ' +
                    'but the value is ' +
                    returnedObject.Body[param] +
                    ' \n';
            }
        }
        await getListOfCallJobsLast();
    }

    // async function createNewCodeJobWithValue() {
    //     //JobName = { CodeJobName: "CodeJob creation with values" };//create post body with all params
    //     updateValuesLast = {
    //         UUID: '',
    //         CodeJobName: 'CodeJob creation with values',
    //         Description: 'created desription',
    //         Owner: null,
    //         CronExpression: '0 9 16 12 *',
    //         NextRunTime: null,
    //         IsScheduled: false,
    //         FailureAlertEmailTo: ['oleg.y@pepperi.com'],
    //         FailureAlertEmailSubject: 'test creation',
    //         ExecutedCode: '',
    //         DraftCode:
    //             'exports.main=async(Client)=>{\r\nvar response;\r\nClient.addLogEntry("Info", "multiplyResult");\r\nresponse={success:"true",errorMessage:"",resultObject:{}};\r\nfunction multiply(a=2,b=3){\r\nvar res = {\'multiplyResult\':a*b};\r\nClient.addLogEntry("Info","Start Funcion multiply =" + res);\r\nresponse.resultObject=res;\r\nresponse.errorMessage="test msg";\r\nresponse.success=true;\r\nreturn(response);\r\n}\r\nreturn multiply(2,3);\r\n};',
    //         CodeJobIsHidden: false,
    //         CreationDateTime: '',
    //         ModificationDateTime: '',
    //         ExecutionMemoryLevel: 1,
    //         NumberOfTries: 1,
    //     };
    //     CallbackCash.ResponseCallbackAfterCreation = await generalService.fetchStatus('/code_jobs', {
    //         method: 'POST',
    //         body: updateValuesLast,
    //     });

    //     const status = CallbackCash.ResponseCallbackAfterCreation.Status == 200 ? true : false; //changed to CallbackCash.ResponseCallbackAfterCreation.success from CallbackCash.ResponseCallbackAfterCreation.Body.Success
    //     logcash.statuse = true;

    //     if (status == true && CallbackCash.ResponseCallbackAfterCreation.Body.UUID != '') {
    //         listLength += 1;
    //     } else {
    //         logcash.statuse = false;
    //     }
    //     await CodeJobVerification();
    // }

    // async function CodeJobVerification() {
    //     //get single cod job
    //     // changed to .Body.UUID from .Body.CodeJobUUID
    //     CallbackCash.ResponseCallbacknew = await generalService.fetchStatus(
    //         `/code_jobs/${CallbackCash.ResponseCallbackAfterCreation.Body.UUID}`,
    //         { method: 'GET' },
    //     );

    //     const returnedObject = CallbackCash.ResponseCallbacknew;
    //     CodeJobUUID = CallbackCash.ResponseCallbackAfterCreation.Body.UUID;
    //     logcash.statusf = true;
    //     logcash.errorMessagef = '';

    //     for (const param in returnedObject.Body) {
    //         if (returnedObject.Body[param] == updateValuesLast[param]) {
    //         } else if (returnedObject.Body.UUID == CodeJobUUID) {
    //         } else if (param == 'NextRunTime' || param == 'CreationDateTime' || param == 'ModificationDateTime') {
    //             returnedObject.Body[param].includes(new Date().toISOString().split('T')[0]);
    //         } else if (param == 'FailureAlertEmailTo') {
    //             returnedObject.Body[param][0] == 'oleg.y@pepperi.com';
    //         }
    //         //added two new parameters
    //         else if (param == 'Type') {
    //             returnedObject.Body[param] == 'UserCodeJob';
    //         } else if (param == 'FunctionName') {
    //             returnedObject.Body[param] == 'main';
    //         } else {
    //             logcash.statusf = false;
    //             logcash.errorMessagef =
    //                 logcash.errorMessagef +
    //                 ' ' +
    //                 'The ' +
    //                 param +
    //                 ' value will be ' +
    //                 updateValues[param] +
    //                 ' ' +
    //                 'but the value is ' +
    //                 returnedObject.Body[param] +
    //                 ' \n';
    //         }
    //     }
    //     await createCodJobWithDraftToPublish();
    // }
    //#endregion

    //#region Publish a Single Code Job
    // async function createCodJobWithDraftToPublish() {
    //     updateValues = {
    //         UUID: '',
    //         CodeJobName: 'New CodeJob with draft code.',
    //         Description: 'Phase 1 to test publish',
    //         Owner: '',
    //         CronExpression: '0 9 16 12 *',
    //         NextRunTime: null,
    //         IsScheduled: false,
    //         FailureAlertEmailTo: ['qa@pepperi.com'],
    //         FailureAlertEmailSubject: 'Publish section',
    //         ExecutedCode: '',
    //         DraftCode:
    //             'exports.main=async(Client)=>{\r\nvar response;\r\nClient.addLogEntry("Info", "multiplyResult");\r\nresponse={success:"true",errorMessage:"",resultObject:{}};\r\nfunction multiply(a=2,b=3){\r\nvar res = {\'multiplyResult\':a*b};\r\nClient.addLogEntry("Info","Start Funcion multiply =" + res);\r\nresponse.resultObject=res;\r\nresponse.errorMessage="test msg";\r\nresponse.success=true;\r\nreturn(response);\r\n}\r\nreturn multiply(2,3);\r\n};',
    //         CodeJobIsHidden: false,
    //         CreationDateTime: '',
    //         ModificationDateTime: '',
    //         ExecutionMemoryLevel: 1,
    //         NumberOfTries: 1,
    //     };
    //     CallbackCash.PhaseTwoPost = await generalService.fetchStatus('/code_jobs', {
    //         method: 'POST',
    //         body: updateValues,
    //     });
    //     logcash.statusPublishinsert = true;

    //     if (CallbackCash.PhaseTwoPost.Status == 200 && CallbackCash.PhaseTwoPost.Body.UUID != '') {
    //         CodeJobUUID = CallbackCash.PhaseTwoPost.Body.UUID;
    //         listLength += 1;
    //     } else {
    //         logcash.statusPublishinsert = false;
    //     }
    //     await publishCodeJob();
    // }

    // async function publishCodeJob() {
    //     CallbackCash.postPublish = await generalService.fetchStatus(`/code_jobs/${CodeJobUUID}/publish`, {
    //         method: 'POST',
    //     });

    //     await CodeJobVerificationAfterPublish();
    // }

    // async function CodeJobVerificationAfterPublish() {
    //     CallbackCash.ResponseCallbacknew = await generalService.fetchStatus(`/code_jobs/${CodeJobUUID}`, {
    //         method: 'GET',
    //     });

    //     const returnedObject = CallbackCash.ResponseCallbacknew;
    //     CodeJobUUID = returnedObject.Body.UUID;
    //     logcash.statusAfterFirstPublish = true;
    //     logcash.errorMessagef = '';

    //     for (const param in returnedObject.Body) {
    //         if (returnedObject.Body[param] == updateValues[param]) {
    //         } else if (returnedObject.Body.UUID == CodeJobUUID) {
    //         } else if (param == 'NextRunTime' || param == 'CreationDateTime' || param == 'ModificationDateTime') {
    //             returnedObject.Body[param].includes(new Date().toISOString().split('T')[0]);
    //         } else if (param == 'FailureAlertEmailTo') {
    //             returnedObject.Body[param][0] == 'oleg.y@pepperi.com';
    //         } else if (param == 'Owner') {
    //             returnedObject.Body[param][0] == null;
    //         } else if (param == 'ExecutedCode') {
    //             returnedObject.Body[param][0] ==
    //                 'exports.main=async(Client)=>{\r\nvar response;\r\nClient.addLogEntry("Info", "multiplyResult");\r\nresponse={success:"true",errorMessage:"",resultObject:{}};\r\nfunction multiply(a=2,b=3){\r\nvar res = {\'multiplyResult\':a*b};\r\nClient.addLogEntry("Info","Start Funcion multiply =" + res);\r\nresponse.resultObject=res;\r\nresponse.errorMessage="test msg";\r\nresponse.success=true;\r\nreturn(response);\r\n}\r\nreturn multiply(2,3);\r\n};';
    //         }

    //         //else if(returnedObject.Body[param] == ) // will add check to modification and creation dates + email []
    //         else {
    //             logcash.statusAfterFirstPublish = false;
    //             logcash.errorMessageAfterFirstPublish =
    //                 logcash.errorMessageAfterFirstPublish +
    //                 ' ' +
    //                 'The ' +
    //                 param +
    //                 ' value will be ' +
    //                 updateValues[param] +
    //                 ' ' +
    //                 'but the value is ' +
    //                 returnedObject.Body[param] +
    //                 ' \n';
    //         }
    //     }
    //     await createCodJobWithoutDraftToPublish();
    // }

    // async function createCodJobWithoutDraftToPublish() {
    //     updateValuesWithoutDraft = {
    //         UUID: '',
    //         CodeJobName: 'New CodeJob with draft code.',
    //         Description: 'Phase 1 to test publish',
    //         Owner: '',
    //         CronExpression: '0 9 16 12 *',
    //         NextRunTime: null,
    //         IsScheduled: false,
    //         FailureAlertEmailTo: ['qa@pepperi.com'],
    //         FailureAlertEmailSubject: 'Publish section',
    //         ExecutedCode: '',
    //         DraftCode: '',
    //         CodeJobIsHidden: false,
    //         CreationDateTime: '',
    //         ModificationDateTime: '',
    //         ExecutionMemoryLevel: 1,
    //         NumberOfTries: 1,
    //     };

    //     CallbackCash.PhaseTwoPostDraftEmpty = await generalService.fetchStatus('/code_jobs', {
    //         method: 'POST',
    //         body: updateValuesWithoutDraft,
    //     });
    //     CallbackCash.postPublish = await generalService.fetchStatus(`/code_jobs/${CodeJobUUID}/publish`, {
    //         method: 'POST',
    //     });

    //     //var status = CallbackCash.PhaseTwoPostDraftEmpty.Body.Status == 200? true: false;
    //     CodeJobUUID = CallbackCash.PhaseTwoPostDraftEmpty.Body.UUID; // changed to .Body.UUID from .Body.CodeJobUUID
    //     logcash.statusPublishinsertLast = true;

    //     if (logcash.statusPublishinsertLast == true && CodeJobUUID != '') {
    //         listLength += 1;
    //     } else {
    //         logcash.statusPublishinsertLast = false;
    //     }
    //     await publishCodeJobNext();
    // }

    // async function publishCodeJobNext() {
    //     CallbackCash.postPublishNext = await generalService.fetchStatus(`/code_jobs/${CodeJobUUID}/publish`, {
    //         method: 'POST',
    //     });
    //     const tmp = CallbackCash.postPublishNext.Body.fault.faultstring;
    //     // if (tmp.fault.faultstring == "Invalid field value. Field:CodeDraft: Value cannot be null or empty.") {
    //     if (tmp.includes('Invalid field value. Field:CodeDraft: Value cannot be null or empty.')) {
    //         CallbackCash.StatusWithoutDraft = true;
    //     } else {
    //         CallbackCash.StatusWithoutDraft = false;
    //         logcash.ErrorWithoutDraft =
    //             'The publish will failed , but finnished success(you will get message:Invalid field value. Field:CodeDraft: Value cannot be null or empty)';
    //     }
    //     await getListOfCallJobsLast();
    // }

    //#endregion
    async function getListOfCallJobsLast() {
        cashCallJobsList = await service.codeJobs
            .iter({
                include_deleted: false,
                order_by: 'CodeJobName DESC',
                page_size: 1000,
            })
            .toArray(); //iter is include_count: true
        if (listLength == cashCallJobsList.length) {
            cashCallJobsList.status = true;
        } else {
            cashCallJobsList.status = false;
            cashCallJobsList.message =
                'the list lenght wil be ' + listLength + ' but actual lenght is ' + cashCallJobsList.length;
        }
        // the test outpuut will be on the end of all test cases , with werification on listLength counter on tests with CodeJob creation
        await mandatotyFieldInsertVerification();
    }

    //#region Execute code Job using draft code
    // async function executeCOdeJobUsingDraft() {
    //     updateValuesToDraftExecute = {
    //         UUID: '',
    //         CodeJobName: 'New CodeJob with draft code to execution test',
    //         Description: 'Execute Job Using Draft Code',
    //         Owner: '',
    //         CronExpression: '0 9 16 12 *',
    //         NextRunTime: null,
    //         IsScheduled: false,
    //         FailureAlertEmailTo: ['qa@pepperi.com'],
    //         FailureAlertEmailSubject: 'Execution section',
    //         ExecutedCode: '',
    //         DraftCode:
    //             'exports.main=async(Client)=>{\r\nvar response;\r\nClient.addLogEntry("Info", "multiplyResult");\r\nresponse={success:"true",errorMessage:"",resultObject:{}};\r\nfunction multiply(a=2,b=3){\r\nvar res = {\'multiplyResult\':a*b};\r\nClient.addLogEntry("Info","Start Funcion multiply =" + res);\r\nresponse.resultObject=res;\r\nresponse.errorMessage="test msg";\r\nresponse.success=true;\r\nreturn(response);\r\n}\r\nreturn multiply(2,3);\r\n};',
    //         CodeJobIsHidden: false,
    //         CreationDateTime: '',
    //         ModificationDateTime: '',
    //         ExecutionMemoryLevel: 1,
    //         NumberOfTries: 1,
    //     };

    //     CallbackCash.executeCOdeJobUsingDraft = await generalService.fetchStatus('/code_jobs', {
    //         method: 'POST',
    //         body: updateValuesToDraftExecute,
    //     });
    //     logcash.executeCOdeJobUsingDraft = true;

    //     if (
    //         CallbackCash.executeCOdeJobUsingDraft.Status == 200 &&
    //         CallbackCash.executeCOdeJobUsingDraft.Body.UUID != ''
    //     ) {
    //         CodeJobUUID = CallbackCash.executeCOdeJobUsingDraft.Body.UUID;
    //         listLength += 1;
    //     } else {
    //         logcash.executeCOdeJobUsingDraft = false;
    //         logcash.ErrorMsg = 'Post to CodeJobe with Draft failed.';
    //     }
    //     await executeDraftCodeJobeOnce();
    // }

    // async function executeDraftCodeJobeOnce() {
    //     CallbackCash.executeDraftCodeJobeOnce1 = await generalService.fetchStatus(
    //         `/code_jobs/async/${CallbackCash.executeCOdeJobUsingDraft.Body.UUID}/execute_draft`,
    //         { method: 'POST', body: updateValuesToDraftExecute },
    //     );

    //     if (
    //         CallbackCash.executeDraftCodeJobeOnce1.Status == 200 &&
    //         CallbackCash.executeDraftCodeJobeOnce1.Body.ExecutionUUID != '' &&
    //         CallbackCash.executeDraftCodeJobeOnce1.Body.URI != ''
    //     ) {
    //         logcash.executeDraftCodeJobeOnce1 = true;
    //     } else {
    //         logcash.executeDraftCodeJobeOnce1 = false;
    //         logcash.ErrorFromExecute = 'Post to execute CodeJobe with draft code failed';
    //     }
    //     generalService.sleep(20000);
    //     await getSingleExecutonLog();
    // }

    // async function getSingleExecutonLog() {
    //     logData = await service.auditLogs.uuid(CallbackCash.executeDraftCodeJobeOnce1.Body.ExecutionUUID).get();
    //     if (
    //         logData.UUID == CallbackCash.executeDraftCodeJobeOnce1.Body.ExecutionUUID &&
    //         logData.Event.Type == 'code_job_execution'
    //     ) {
    //         cacheLog.ExecutionResult = logData.AuditInfo.ResultObject
    //             ? JSON.parse(logData.AuditInfo.ResultObject)
    //             : null;
    //         if (logData.Status.ID == 1 && cacheLog.ExecutionResult.resultObject.multiplyResult == 6) {
    //             // before changes 7-06-20 cacheLog.ExecutionResult.multiplyResult
    //             cacheLog.DistributorUUID = logData.Event.User.UUID;
    //             //cacheLog.CodeRevisionURL = logData.AuditInfo.CodeRevisionURL;
    //             cacheLog.auditLogUUID = logData.UUID; //changed from logData.AuditLogUUID
    //             cacheLog.LogData = logData;
    //             executionLog.Status = true;
    //         } else if (logData.Status.ID != 1) {
    //             // changed to !=1 from ==1
    //             if (logTimeCount > logTimeRetryNum) {
    //                 executionLog.Status = false;
    //             } else {
    //                 generalService.sleep(5000);
    //                 logTimeCount = logTimeCount + 1;
    //                 await getSingleExecutonLog();
    //             }
    //         }
    //     } else {
    //         executionLog.Status = false;
    //         executionLog.Error =
    //             'One of parameters in single execution log is wrong or log is empty: \n' +
    //             'returned ExecutionUUID is' +
    //             CallbackCash.executeDraftCodeJobeOnce1.Body.ExecutionUUID +
    //             ' and CodeJobeUUID is ' +
    //             CodeJobUUID +
    //             '\nAudit log exeption: ' +
    //             logData;
    //     }
    //     //getExecutonLogs();
    //     await createNewCJToPublish();
    // }
    //#endregion

    //#region Execute Job Using Published Code
    // async function createNewCJToPublish() {
    //     // cerate new code job with draft code
    //     NewCJToPublish = {
    //         UUID: '',
    //         CodeJobName: 'New CodeJob with draft code to execution test after publish',
    //         Description: 'Execute Job Using Draft Code , test 2',
    //         Owner: '',
    //         CronExpression: '0 9 16 12 *',
    //         NextRunTime: null,
    //         IsScheduled: false,
    //         FailureAlertEmailTo: ['qa@pepperi.com'],
    //         FailureAlertEmailSubject: 'Execution section',
    //         ExecutedCode: '',
    //         DraftCode:
    //             'exports.main=async(Client)=>{\r\nvar response;\r\nClient.addLogEntry("Info", "multiplyResult");\r\nresponse={success:"true",errorMessage:"",resultObject:{}};\r\nfunction multiply(a=2,b=3){\r\nvar res = {\'multiplyResult\':a*b};\r\nClient.addLogEntry("Info","Start Funcion multiply =" + res);\r\nresponse.resultObject=res;\r\nresponse.errorMessage="test msg";\r\nresponse.success=true;\r\nreturn(response);\r\n}\r\nreturn multiply(2,3);\r\n};',
    //         CodeJobIsHidden: false,
    //         CreationDateTime: '',
    //         ModificationDateTime: '',
    //         ExecutionMemoryLevel: 1,
    //         NumberOfTries: 1,
    //     };
    //     CallbackCash.createNewCJToPublish = await generalService.fetchStatus('/code_jobs', {
    //         method: 'POST',
    //         body: NewCJToPublish,
    //     });

    //     logcash.createNewCJToPublish = true;
    //     if (CallbackCash.createNewCJToPublish.Status == 200 && CallbackCash.createNewCJToPublish.Body.UUID != '') {
    //         CodeJobUUID = CallbackCash.createNewCJToPublish.Body.UUID;
    //         listLength += 1;
    //         //publishNewCJToPublish();
    //     } else {
    //         logcash.createNewCJToPublish = false;
    //         logcash.createNewCJToPublishErrorMsg = 'Post to CodeJobe with Draft failed.';
    //     }
    //     await publishNewCJToPublish();
    // }

    // async function publishNewCJToPublish() {
    //     // publish this job code
    //     CallbackCash.publishNewCJ = await generalService.fetchStatus(
    //         `/code_jobs/${CallbackCash.createNewCJToPublish.Body.UUID}/publish`,
    //         { method: 'POST', body: NewCJToPublish },
    //     );
    //     // BODY CHANGED TO undefined
    //     if (CallbackCash.publishNewCJ.Status == 200) {
    //         CallbackCash.StatusPublished = true;
    //     } else {
    //         CallbackCash.StatusPublished = false;
    //         CallbackCash.ErrorAfterPublish = 'The publish failed ';
    //     }
    //     generalService.sleep(20000);
    //     await getAuditLogUUID();
    // }

    // async function getAuditLogUUID() {
    //     CallbackCash.auditLogResponseFromPublish = await service.auditLogs.find({
    //         where: `AuditInfo.ObjectUUID='${CallbackCash.createNewCJToPublish.Body.UUID}'`,
    //     });
    //     if (CallbackCash.auditLogResponseFromPublish.length == 2) {
    //         CallbackCash.auditLogResponseFromPublish.status = true;
    //         if (CallbackCash.auditLogResponseFromPublish[0].AuditInfo.Action == 'Publish') {
    //             CallbackCash.PublishAuditLogUUID = CallbackCash.auditLogResponseFromPublish[0].UUID; //4 rows chaged from CallbackCash.auditLogResponseFromPublish[0].auditLogUUID
    //             CallbackCash.insertAuditLogUUID = CallbackCash.auditLogResponseFromPublish[1].UUID; //4 rows chaged from CallbackCash.auditLogResponseFromPublish[0].auditLogUUID
    //         } else {
    //             CallbackCash.PublishAuditLogUUID = CallbackCash.auditLogResponseFromPublish[1].UUID; //4 rows chaged from CallbackCash.auditLogResponseFromPublish[0].auditLogUUID
    //             CallbackCash.insertAuditLogUUID = CallbackCash.auditLogResponseFromPublish[0].UUID; //4 rows chaged from CallbackCash.auditLogResponseFromPublish[0].auditLogUUID
    //         }
    //     } else {
    //         CallbackCash.auditLogResponseFromPublish.message =
    //             'not get result from AuditLog, codeJob UUID: ' + CallbackCash.createNewCJToPublish.Body.UUID;
    //         CallbackCash.auditLogResponseFromPublish.status = false;
    //     }
    //     await updateDrafrCode();
    // }

    // async function updateDrafrCode() {
    //     //  update draft code after publish. From now execution code and draft code is different. On execution code result is 6 and in draft: 16
    //     CodeJobUUID1 = CodeJobUUID;
    //     UpdateDraftCode = {
    //         UUID: CodeJobUUID1,
    //         CodeJobName: 'New CodeJob with draft code to execution test after publish',
    //         Description: 'DraftCode updated',
    //         DraftCode:
    //             'exports.main=async(Client)=>{\r\nvar response;\r\nClient.addLogEntry("Info", "multiplyResult");\r\nresponse={success:"true",errorMessage:"",resultObject:{}};\r\nfunction multiply(a=2,b=3){\r\nvar res = {\'multiplyResult\':a*b};\r\nClient.addLogEntry("Info","Start Funcion multiply =" + res);\r\nresponse.resultObject=res;\r\nresponse.errorMessage="test msg";\r\nresponse.success=true;\r\nreturn(response);\r\n}\r\nreturn multiply(4,4);\r\n};',
    //         ExecutionMemoryLevel: 1,
    //     };
    //     CallbackCash.UpdatedDraftCode = await generalService.fetchStatus('/code_jobs', {
    //         method: 'POST',
    //         body: UpdateDraftCode,
    //     });

    //     //var status = CallbackCash.UpdatedDraftCode.Body.Status == 200? true: false;
    //     logcash.UpdatedDraftCode = true;
    //     if (CallbackCash.UpdatedDraftCode.Status == 200 && CallbackCash.UpdatedDraftCode.Body.UUID == CodeJobUUID) {
    //         // CallbackCash.UpdatedDraftCode == true changed to CallbackCash.UpdatedDraftCode.Status == 200  because now we return body on upsert , and CallbackCash.UpdatedDraftCode.Body.CodeJobUUID changed to CallbackCash.UpdatedDraftCode.Body.UUID
    //         listLength += 1;
    //     } else {
    //         logcash.UpdatedDraftCode = false;
    //         logcash.UpdatedDraftCode = 'Post to CodeJobe with Draft failed. CodeJobUUID is: ' + CodeJobUUID;
    //     }
    //     await executeWithDiffBetweenDraftAndExecution();
    // }

    // async function executeWithDiffBetweenDraftAndExecution() {
    //     // execute
    //     CallbackCash.executeWithDiff = await generalService.fetchStatus(
    //         `/code_jobs/async/${CallbackCash.UpdatedDraftCode.Body.UUID}/execute`,
    //         { method: 'POST' },
    //     );
    //     if (
    //         CallbackCash.executeWithDiff.Status == 200 &&
    //         CallbackCash.executeWithDiff.Body.ExecutionUUID != '' &&
    //         CallbackCash.executeWithDiff.Body.URI != ''
    //     ) {
    //         logcash.executeWithDiff = true;
    //     } else {
    //         logcash.executeWithDiff = false;
    //         logcash.executeWithDiffError =
    //             'Post to execute CodeJobe with execute code failed. ExecutionUUID is: ' +
    //             CallbackCash.executeWithDiff.Body.ExecutionUUID;
    //     }

    //     await getSingleToCheckBetveenDraftAndExecuted();
    // }

    // async function getSingleToCheckBetveenDraftAndExecuted() {
    //     // verification between draft code and execution code - will be different
    //     CallbackCash.ResponseCallbackToCheck = await generalService.fetchStatus(`/code_jobs/${CodeJobUUID}`, {
    //         method: 'GET',
    //     });

    //     if (
    //         CallbackCash.ResponseCallbackToCheck.Body.ExecutedCode !=
    //         CallbackCash.ResponseCallbackToCheck.Body.DraftCode
    //     ) {
    //         logcash.CheckBetveenDraftAndExecutedStatus = true;
    //     } else {
    //         logcash.CheckBetveenDraftAndExecutedStatus = false;
    //         logcash.CheckBetveenDraftAndExecutedError =
    //             'The draft code and execution code is same. CodeJobUUID: ' + CodeJobUUID;
    //     }
    //     generalService.sleep(20000);
    //     await getLogsToExecuted();
    // }

    // async function getLogsToExecuted() {
    //     CallbackCash.ResponseExecutedLogs = await service.auditLogs
    //         .uuid(CallbackCash.executeWithDiff.Body.ExecutionUUID)
    //         .get();
    //     //debugger;
    //     logcash.ResponseExecutedLogs = true;
    //     if (CallbackCash.ResponseExecutedLogs.Status.Name == 'Success') {
    //         //CallbackCash.ExecutionUUIDFromExetionLogs = CallbackCash.ResponseExecutedLogs.UUID;
    //         CallbackCash.CodeJobUUIDFromExetionLogs =
    //             CallbackCash.ResponseExecutedLogs.AuditInfo.JobMessageData.CodeJobUUID;
    //         CallbackCash.DistributorUUIDFromExetionLogs = CallbackCash.ResponseExecutedLogs.Event.User.UUID;
    //         CallbackCash.CodeRevisionURLFromExetionLogs =
    //             CallbackCash.ResponseExecutedLogs.AuditInfo.JobMessageData.FunctionPath;
    //         CallbackCash.auditLogUUIDFromExetionLogs = CallbackCash.ResponseExecutedLogs.UUID; //changed from CallbackCash.ResponseExecutedLogs.auditLogUUID
    //         multiplayerResult = CallbackCash.ResponseExecutedLogs.AuditInfo.ResultObject;
    //         multiplayerResult = JSON.parse(multiplayerResult);
    //         if (
    //             //CallbackCash.ResponseExecutedLogs.AuditInfo.AuditComment == ""&&
    //             CallbackCash.ResponseExecutedLogs.AuditInfo.JobMessageData.IsPublished == true &&
    //             // && CallbackCash.ResponseExecutedLogs[0].Status == 200
    //             CallbackCash.ResponseExecutedLogs.AuditInfo.JobMessageData.IsScheduled == false &&
    //             multiplayerResult.resultObject.multiplyResult == 6 && //multiplayerResult.resultObject.multiplyResult changed on 07-06-2020 multiplayerResult.multiplyResult
    //             CallbackCash.ResponseExecutedLogs.AuditInfo.JobMessageData.StartDateTime.includes(
    //                 new Date().toISOString().split('T')[0],
    //             ) &&
    //             CallbackCash.ResponseExecutedLogs.AuditInfo.JobMessageData.EndDateTime.includes(
    //                 new Date().toISOString().split('T')[0],
    //             )
    //         ) {
    //         } else {
    //             logcash.ResponseExecutedLogs = false;
    //             logcash.ResponseExecutedLogsErrorMsg =
    //                 'One or more of parameters on executed log is not expected. ExecutionUUID Is: ' +
    //                 CallbackCash.ExecutionUUIDFromExetionLogs +
    //                 '\nCodeJobUUId: ' +
    //                 CallbackCash.CodeJobUUIDFromExetionLogs +
    //                 '\nDistributorUUID: ' +
    //                 CallbackCash.DistributorUUIDFromExetionLogs;
    //         }
    //     } else {
    //         logcash.ResponseExecutedLogs = false;
    //         logcash.ResponseExecutedLogsErrorMsg =
    //             'Executed logs API failed. ExecutionUUID Is: ' +
    //             CallbackCash.ExecutionUUIDFromExetionLogs +
    //             '\nCodeJobUUId: ' +
    //             CallbackCash.CodeJobUUIDFromExetionLogs +
    //             '\nDistributorUUID: ' +
    //             CallbackCash.DistributorUUIDFromExetionLogs;
    //     }
    //     await publishCJToPublish();
    // }

    // async function publishCJToPublish() {
    //     // publish this job code
    //     CallbackCash.publishNewCJ = await generalService.fetchStatus(`/code_jobs/${CodeJobUUID}/publish`, {
    //         method: 'POST',
    //     });
    //     if (CallbackCash.publishNewCJ.Status == 200) {
    //         CallbackCash.StatusPublished = true;
    //     } else {
    //         CallbackCash.StatusPublished = false;
    //         CallbackCash.ErrorAfterPublish = 'The publish failed, the CodeJobUUID is: ' + CodeJobUUID;
    //     }
    //     await getSingleToCheckBetveenDraftAndExecutedNew();
    // }

    // async function getSingleToCheckBetveenDraftAndExecutedNew() {
    //     // verification between draft code and execution code - will be the same
    //     CallbackCash.ResponseCallbackToCheckLast = await generalService.fetchStatus(`/code_jobs/${CodeJobUUID}`, {
    //         method: 'GET',
    //     });

    //     //debugger;
    //     if (
    //         CallbackCash.ResponseCallbackToCheckLast.Body.ExecutedCode ==
    //         CallbackCash.ResponseCallbackToCheckLast.Body.DraftCode
    //     ) {
    //         logcash.CheckBetveenDraftAndExecutedLastStatus = true;
    //     } else {
    //         logcash.CheckBetveenDraftAndExecutedLastStatus = false;
    //         logcash.CheckBetveenDraftAndExecutedLastError =
    //             'The draft code and execution code is not same. CodeJobUUID: ' + CodeJobUUID;
    //     }
    //     await restoreNegativeWithWrongCodeJobUUID();
    // }
    // //#endregion

    // //#region Restore executed code
    // async function restoreNegativeWithWrongCodeJobUUID() {
    //     CallbackCash.restoreNegativeWithWrongCodeJobUUID = await generalService.fetchStatus(
    //         `/code_jobs/20e6d067-0f77-nega-tive-bc2044892532/restore/${CallbackCash.PublishAuditLogUUID}`,
    //         { method: 'POST', body: UpdateDraftCode },
    //     );
    //     //debugger;
    //     if (
    //         CallbackCash.restoreNegativeWithWrongCodeJobUUID.Status == 404 &&
    //         JSON.stringify(CallbackCash.restoreNegativeWithWrongCodeJobUUID.Body.fault).includes(
    //             'InvalidParameterCJ004',
    //         ) &&
    //         JSON.stringify(CallbackCash.restoreNegativeWithWrongCodeJobUUID.Body.fault).includes(
    //             '20e6d067-0f77-nega-tive-bc2044892532 does not exist.',
    //         )
    //     ) {
    //         CallbackCash.restoreNegativeWithWrongCodeJobUUIDStatus = true;
    //     } else {
    //         CallbackCash.restoreNegativeWithWrongCodeJobUUIDStatus = false;
    //         CallbackCash.restoreNegativeWithWrongCodeJobUUIDErrorMsg =
    //             'The error will contain InvalidParameterCJ004, but actuall full error message is ' +
    //             CallbackCash.restoreNegativeWithWrongCodeJobUUID.Body.fault.faultstring;
    //     }
    //     await restoreNegativeAuditLogNotFound();
    // }

    // async function restoreNegativeAuditLogNotFound() {
    //     CallbackCash.restoreNegativeAuditLogNotFound = await generalService.fetchStatus(
    //         `/code_jobs/${CodeJobUUID}/restore/5560d92f-nega-tive-b440-441bf1de7602`,
    //         { method: 'POST', body: UpdateDraftCode },
    //     );
    //     //debugger;
    //     if (
    //         CallbackCash.restoreNegativeAuditLogNotFound.Status == 404 &&
    //         JSON.stringify(CallbackCash.restoreNegativeAuditLogNotFound.Body.fault).includes('InvalidParameterCJ009') &&
    //         JSON.stringify(CallbackCash.restoreNegativeAuditLogNotFound.Body.fault).includes(
    //             '5560d92f-nega-tive-b440-441bf1de7602 does not exist.',
    //         )
    //     ) {
    //         CallbackCash.restoreNegativeAuditLogNotFoundStatus = true;
    //     } else {
    //         CallbackCash.restoreNegativeAuditLogNotFoundStatus = false;
    //         CallbackCash.restoreNegativeAuditLogNotFoundErrorMsg =
    //             'The error will contain InvalidParameterCJ009, but actuall full error message is ' +
    //             CallbackCash.restoreNegativeAuditLogNotFound.Body.fault.faultstring;
    //     }
    //     await restoreNegativeAuditLogNotPublish();
    // }

    // async function restoreNegativeAuditLogNotPublish() {
    //     CallbackCash.restoreNegativeAuditLogNotPublish = await generalService.fetchStatus(
    //         `/code_jobs/${CodeJobUUID}/restore/${CallbackCash.insertAuditLogUUID}`,
    //         { method: 'POST', body: UpdateDraftCode },
    //     );
    //     //debugger;
    //     if (
    //         CallbackCash.restoreNegativeAuditLogNotPublish.Status == 400 &&
    //         JSON.stringify(CallbackCash.restoreNegativeAuditLogNotPublish.Body.fault).includes(
    //             'InvalidParameterCJ010',
    //         ) &&
    //         JSON.stringify(CallbackCash.restoreNegativeAuditLogNotPublish.Body.fault).includes(
    //             'Action = Insert is not valid.',
    //         )
    //     ) {
    //         CallbackCash.restoreNegativeAuditLogNotPublishStatus = true;
    //     } else {
    //         CallbackCash.restoreNegativeAuditLogNotPublishStatus = false;
    //         CallbackCash.restoreNegativeAuditLogNotPublishErrorMsg =
    //             'The error will contain InvalidParameterCJ010, but actuall full error message is ' +
    //             CallbackCash.restoreNegativeAuditLogNotPublish.Body.fault.faultstring;
    //     }
    //     await restoreExecutedCode();
    // }

    // async function restoreExecutedCode() {
    //     CallbackCash.publishNewCJ = await generalService.fetchStatus(
    //         `/code_jobs/${CodeJobUUID}/restore/${CallbackCash.PublishAuditLogUUID}`,
    //         { method: 'POST', body: UpdateDraftCode },
    //     );
    //     //debugger;
    //     if (CallbackCash.publishNewCJ.Status == 200) {
    //         CallbackCash.restoreStatus = true;
    //     } else {
    //         CallbackCash.restoreStatus = false;
    //         CallbackCash.restoreErrorMsg =
    //             'The Restore Executed Code API post failed. CodeJobUUID is ' +
    //             CodeJobUUID +
    //             'and AuditLogUUID = ' +
    //             CallbackCash.ResponseExecutedLogs.Body.UUID; //changed frpm CallbackCash.ResponseExecutedLogs.Body.auditLogUUID
    //     }
    //     await getSingleToCheckRestoredExecutedCode();
    // }

    // async function getSingleToCheckRestoredExecutedCode() {
    //     // restore executed code . From now will be different to draft code
    //     CallbackCash.RestoredExecutedCode = await generalService.fetchStatus(`/code_jobs/${CodeJobUUID}`, {
    //         method: 'GET',
    //     });
    //     //debugger;
    //     if (CallbackCash.RestoredExecutedCode.Body.ExecutedCode != CallbackCash.RestoredExecutedCode.Body.DraftCode) {
    //         logcash.CheckBetveenDraftAndExecutedLastStatus = true;
    //     } else {
    //         logcash.CheckBetveenDraftAndExecutedLastStatus = false;
    //         logcash.CheckBetveenDraftAndExecutedLastError =
    //             'The executed code not restored. CodeJobUUID: ' + CodeJobUUID;
    //     }
    //     generalService.sleep(10000);
    //     await auditLogverification();
    // }
    //#endregion

    //#region Audit log test
    // async function auditLogverification() {
    //     cacheLog.ParsedUserUUID = await generalService.getUsers();
    //     for (let i = 0; i < cacheLog.ParsedUserUUID.length; i++) {
    //         if (cacheLog.ParsedUserUUID[i].Email == generalService.getClientData('UserEmail')) {
    //             // general.API.userName will be changed to jwt
    //             cacheLog.UserUUID = cacheLog.ParsedUserUUID[i].UUID;
    //             cacheLog.UserID = cacheLog.ParsedUserUUID[i].InternalID;
    //             UserUUID = cacheLog.UserUUID;
    //             UserID = cacheLog.UserID;
    //             break;
    //         } else {
    //             cacheLog.Exeption = 'UserUUID not found';
    //         }
    //     }
    //     CallbackCash.auditLogResponse = await service.auditLogs.find({
    //         where: `AuditInfo.ObjectUUID='${CodeJobUUID}'`,
    //     });
    //     CallbackCash.auditLogStatus = true;
    //     if (CallbackCash.auditLogResponse.length == 2) {
    //         CallbackCash.auditLogResponse.forEach((element) => {
    //             for (const key in element) {
    //                 debugger;
    //                 if (key == 'UUID') {
    //                     if (element[key] == '') {
    //                         CallbackCash.auditLogErrMsg += '\n The Log UUID returned empty';
    //                     }
    //                 } else if (key == 'DistributorUUID') {
    //                     if (element[key] != CallbackCash.ResponseExecutedLogs.DistributorUUID) {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The DistributorUUID will be ' +
    //                             CallbackCash.ResponseExecutedLogs.DistributorUUID +
    //                             ' and not: ' +
    //                             element[key];
    //                     }
    //                 } else if (key == 'CreationDateTime') {
    //                     if (element[key].split('T')[0] != new Date().toISOString().split('T')[0]) {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The CreationDateTime will be ' +
    //                             new Date().toISOString().split('T')[0] +
    //                             ' and not: ' +
    //                             element[key].split('T')[0];
    //                     }
    //                 } else if (key == 'ModificationDateTime') {
    //                     if (element[key].split('T')[0] != new Date().toISOString().split('T')[0]) {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The ModificationDateTime will be ' +
    //                             new Date().toISOString().split('T')[0] +
    //                             ' and not: ' +
    //                             element[key].split('T')[0];
    //                     }
    //                 } else if (key == 'auditLogUUID') {
    //                     if (element[key] == '') {
    //                         CallbackCash.auditLogErrMsg += '\n The auditLogUUID will be not empty';
    //                     }
    //                 } else if (key == 'SourceAuditLog') {
    //                     if (element[key] != null) {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The SourceAuditLog will be null ' + ' and not: ' + element[key];
    //                     }
    //                 } else if (key == 'AuditType') {
    //                     if (element[key] != 'data') {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The AuditType will be data ' + ' and not: ' + element[key];
    //                     }
    //                 } else if (key == 'Event') {
    //                     if (element[key].Type != 'scheduler') {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The Event Type will be scheduler ' + ' and not: ' + element[key];
    //                     }

    //                     if (element[key].User.InternalID != UserID) {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The UserID will be ' + UserID + ' and not: ' + element[key].User.InternalID;
    //                     }

    //                     if (element[key].User.UserUUID != UserUUID) {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The UserID will be ' + UserUUID + ' and not: ' + element[key].User.UserUUID;
    //                     }

    //                     if (element[key].User.Email != generalService.getClientData('UserEmail')) {
    //                         //general.API will be changed
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The Email will be ' +
    //                             generalService.getClientData('UserEmail') +
    //                             ' and not: ' +
    //                             element[key].User.Email;
    //                     }
    //                 } else if (key == 'Status') {
    //                     if (element[key].Name != 'Success') {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The StatusName will be success' + ' and not: ' + element[key].Name;
    //                     }

    //                     if (element[key].ID != 0) {
    //                         CallbackCash.auditLogErrMsg += '\n The StatusID will be 0' + ' and not: ' + element[key].ID;
    //                     }
    //                 } else if (key == 'AuditInfo') {
    //                     if (element[key].ObjectUUID != CodeJobUUID) {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The ObjectUUID will be' + CodeJobUUID + ' and not: ' + element[key].ObjectUUID;
    //                     }

    //                     if (element[key].DataResource != 'codejobs') {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The DateResource will be codejobs ' + ' and not: ' + element[key].DataResource;
    //                     }

    //                     if (element[key].NucleusModified != false) {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The NucleusModified will be false ' + ' and not: ' + element[key].NucleusModified;
    //                     }

    //                     if (element[key].Function == 'Insert' && element[key].RevisedFields.length != 0) {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The RevisedFields lenght on function Insert will be 0' +
    //                             ' and not: ' +
    //                             element[key].RevisedFields.length;
    //                     }
    //                     if (element[key].Function == 'Update' && element[key].RevisedFields.length != 4) {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The RevisedFields lenght on function Update will be 4' +
    //                             ' and not: ' +
    //                             element[key].RevisedFields.length;
    //                     }
    //                     if (element[key].Function == 'Publish' && element[key].RevisedFields.length != 1) {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The RevisedFields lenght on function Update will be 1' +
    //                             ' and not: ' +
    //                             element[key].RevisedFields.length;
    //                     }
    //                     if (element[key].Function == 'RollBack' && element[key].RevisedFields.length != 1) {
    //                         CallbackCash.auditLogErrMsg +=
    //                             '\n The RevisedFields lenght on function Update will be 1' +
    //                             ' and not: ' +
    //                             element[key].RevisedFields.length;
    //                     }
    //                     if (element[key].Function == 'Update') {
    //                         element[key].RevisedFields.forEach((element1) => {
    //                             for (const key1 in element1) {
    //                                 if (
    //                                     element1[key1] == 'CodeJobName' ||
    //                                     element1[key1] == 'Description' ||
    //                                     //element1[key1] == 'DraftCode' ||
    //                                     element1[key1] == 'ExecutionMemoryLevel'
    //                                 ) {
    //                                 } else {
    //                                     CallbackCash.auditLogErrMsg +=
    //                                         '\n The RevisedFields FieldID will be CodeJobName or Description or DraftCode or ExecutionMemoryLevel and not: ' +
    //                                         element1[key1];
    //                                 }
    //                                 if (element1[key1] != '' || element1[key1] != null) {
    //                                 } else {
    //                                     CallbackCash.auditLogErrMsg +=
    //                                         '\n The RevisedFields FieldID will be not empty or null and not: ' +
    //                                         element1[key1];
    //                                 }
    //                             }
    //                         });
    //                     }
    //                 } else {
    //                     CallbackCash.auditLogErrMsg += 'Error from audit Log . ';
    //                 }
    //             }
    //         });
    //     } else {
    //         CallbackCash.auditLogStatus = false;
    //         CallbackCash.auditLogErrMsg =
    //             'Get CodeJob Audit log failed. CodeJobUUID is: ' +
    //             CodeJobUUID +
    //             '\nAuditLog error message is: ' +
    //             CallbackCash.auditLogResponse;
    //     }
    //     await mandatotyFieldInsertVerification();
    // }
    //#endregion

    //#region Mandatory fields
    async function mandatotyFieldInsertVerification() {
        const insertEmptyName = {
            UUID: '',
            CodeJobName: '',
            Description: 'Will failed on madatory field',
            Type: 'AddonJob',
            AddonPath: jsFileName, // Only for AddonJob
            AddonUUID: addonUUID, // Only for AddonJob
            FunctionName: functionNameUpdateCodeJob,
        };
        CallbackCash.insertWithoutName = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: JSON.stringify(insertEmptyName),
        });
        parsedData = CallbackCash.insertWithoutName;
        //const tmp = parsedData.Body.fault.faultstring;
        //CallbackCash.parsedMsg = JSON.parse(tmp);
        CallbackCash.parsedMsg = parsedData.Body;
        if (
            parsedData.Status == 400 &&
            CallbackCash.parsedMsg.fault.faultstring.includes(
                'Invalid field value. Field:CodeJobName: Value cannot be null or empty.',
            )
        ) {
            logcash.MandatoryCheck = true;
        } else {
            logcash.MandatoryCheck = false;
            logcash.MandatoryCheckError =
                'Get wrong exeption or not get exeption on insert new CodeJob without mandatory field CodeJob name';
        }
        //Oren 3/3: 02/05/2021 - Start from TimeOut test and continue after 130 seconds, since TimeOut logs can take up to 7 minutes.
        await getEmailStatus();
        //await getLogsToExecutedTimeoutTest();
    }
    //#endregion

   // #region TimeOut verification
    async function getEmailStatus() {
        CallbackCash.GetEmails = await generalService.fetchStatus(
            '/actions_queue?include_count=true&order_by=CreationDate DESC',
            { method: 'GET' },
        );
        CallbackCash.EmailsFromToDay = CallbackCash.GetEmails.Body.filter(
            (x) => x.CreationDate > new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        );
        CallbackCash.NumOfEmailsBeforeTimeOut = CallbackCash.EmailsFromToDay.length;
        await updateDrafrCodeWithoutResult();
    }

    async function updateDrafrCodeWithoutResult() {
        //  update draft . Removed returnResult(result) and we will get timeout + email
        UpdateDraftCodeWithoutResult = {
            UUID: '',
            CodeJobName: 'timeout test CodeJob - ',
            Description: 'DraftCode with Utilities.sleep 130000 ms before returResult',
            Type: 'AddonJob',
            FailureAlertEmailTo: ['oleg.y@pepperi.com'],
            // DraftCode:
            //     'exports.main=async(Client)=>{\r\n var response;\r\n Client.addLogEntry("Info", "multiplyResult");\r\n response={success:"true",errorMessage:"",resultObject:{}};\r\n   function multiply(a=2,b=3){\r\n\t\tvar res = {\'multiplyResult\':a*b};\r\n\t\tClient.addLogEntry("Info","Start Funcion multiply =" + res);\r\n\t\tresponse.resultObject=res;\r\n\t\tresponse.errorMessage="test msg";\r\n\t\tresponse.success=true;\r\n\t\treturn(response);\r\n\t}\r\n\tfunction sleep(ms){\r\nvar start=new Date().getTime(),expire=start+ms;\r\nwhile (new Date().getTime()<expire){}\r\nreturn;\r\n}\r\nsleep(130000);\r\n\treturn multiply(8,8);\r\n};',
            AddonPath: jsFileName, // Only for AddonJob
            AddonUUID: addonUUID, // Only for AddonJob
            FunctionName: functionNameUpdateDrafrCodeWithoutResult,
            ExecutionMemoryLevel: 4,
        };

        CallbackCash.UpdatedDraftCodeWithoutResult = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: JSON.stringify(UpdateDraftCodeWithoutResult),
        });
        logcash.UpdatedDraftCodeWithoutResult = true;
        if (
            CallbackCash.UpdatedDraftCodeWithoutResult.Status == 200 &&
            CallbackCash.UpdatedDraftCodeWithoutResult.Body.UUID != ''
        ) {
            listLength += 1;
            await executeWithDraftWithoutResult();
        } else {
            logcash.UpdatedDraftCodeWithoutResult = false;
            logcash.UpdatedDraftCodeWithoutResult =
                'Post to CodeJobe with Draft failed. Error message: ' +
                JSON.stringify(CallbackCash.UpdatedDraftCodeWithoutResult.Body.fault.faultstring);
            await getDistributorExecutionBudget();
        }
    }

    async function executeWithDraftWithoutResult() {
        // execute Draft code without result() , to get timeout
        CallbackCash.WithDraftWithoutResult = await generalService.fetchStatus(
            `/code_jobs/async/${CallbackCash.UpdatedDraftCodeWithoutResult.Body.UUID}/execute`, //  /execute_draft`
            { method: 'POST' },
        );
        if (
            CallbackCash.WithDraftWithoutResult.Status == 200 &&
            CallbackCash.WithDraftWithoutResult.Body.ExecutionUUID != '' &&
            CallbackCash.WithDraftWithoutResult.Body.URI != ''
        ) {
            logcash.WithDraftWithoutResult = true;
        } else {
            logcash.WithDraftWithoutResult = false;
            logcash.WithDraftWithoutResult =
                'Post failed. ExecutionUUID is: ' +
                CallbackCash.WithDraftWithoutResult.Body.ExecutionUUID +
                'CodeJobUUID is: ' +
                CallbackCash.UpdatedDraftCodeWithoutResult.Body.UUID;
        }
        generalService.sleep(130000); // weit to get log with timeout exeption
        logTimeCount = 0;

        
        //await getLogsToExecutedTimeoutTest();
        await getDistributorExecutionBudget();
    }

    // async function getLogsToExecutedTimeoutTest() {
    //     //////////////////////////////////////////////////////////////////////////////////////////////////////
    //     //!!!!!!! Should be updated after bug https://pepperi.atlassian.net/browse/DI-16024 fixing .
    //     //////////////////////////////////////////////////////////////////////////////////////////////////////
    //     CallbackCash.ResponseExecutedTimeoutTest = await service.auditLogs
    //         .uuid(CallbackCash.WithDraftWithoutResult.Body.ExecutionUUID)
    //         .get();
    //     //debugger;
    //     if (logTimeCount > logTimeRetryNum) {
    //         logcash.ResponseExecutedTimeoutTest = false;
    //         logcash.ResponseExecutedTimeoutTestErrorMsg = 'The execution log not created after 540000 ms wheiting ';
    //         logTimeCount = 0;
    //         await getDistributorExecutionBudget();
    //     } else {
    //         try {
    //             // addet try and catch
    //             // if (CallbackCash.ResponseExecutedTimeoutTest.length < 1){
    //             if (
    //                 CallbackCash.ResponseExecutedTimeoutTest == null ||
    //                 CallbackCash.ResponseExecutedTimeoutTest.Status.Name == 'InProgress'
    //             ) {
    //                 generalService.sleep(20000);
    //                 logTimeCount = logTimeCount + 1;
    //                 await getLogsToExecutedTimeoutTest();
    //             } else {
    //                 //var tmp = JSON.parse(CallbackCash.ResponseExecutedLogsCronTest[0].ResultObject);
    //                 if (
    //                     CallbackCash.ResponseExecutedTimeoutTest.AuditInfo.ErrorMessage.includes('timed out') == true &&
    //                     //&& CallbackCash.ResponseExecutedTimeoutTest.length == 1
    //                     (CallbackCash.ResponseExecutedTimeoutTest.Status.Name == 'Failure' ||
    //                         CallbackCash.ResponseExecutedTimeoutTest.Status.Name == 'InRetry') &&
    //                     CallbackCash.ResponseExecutedTimeoutTest.AuditInfo.JobMessageData.CodeJobUUID ==
    //                         CallbackCash.UpdatedDraftCodeWithoutResult.Body.UUID
    //                 ) {
    //                     logcash.ResponseExecutedTimeoutTest = true;
    //                     logTimeCount = 0;
    //                     // describe("TimeOut from executed draft code ", ()=> {
    //                     //    it("Test case TimeOut from executed draft code: Finished", ()=> {
    //                     //         assert(logcash.ResponseExecutedTimeoutTest, logcash.ResponseExecutedTimeoutTestErrorMsg);
    //                     //     });
    //                     // });
    //                     await getDistributorExecutionBudget();
    //                     //throw "Elastic created without error message"
    //                 } else {
    //                     logcash.ResponseExecutedTimeoutTest = false;
    //                     logcash.ResponseExecutedTimeoutTestErrorMsg =
    //                         'Executed logs API failed. Log is empty (row 1221 for QA automation)';
    //                     logTimeCount = 0; //added
    //                     // describe("TimeOut from executed draft code ", ()=> {
    //                     //    it("Test case TimeOut from executed draft code: Finished", ()=> {
    //                     //         assert(logcash.ResponseExecutedTimeoutTest, logcash.ResponseExecutedTimeoutTestErrorMsg);
    //                     //     });
    //                     // });
    //                     await getDistributorExecutionBudget();
    //                 }
    //             }
    //         } catch (error) {
    //             logcash.ResponseExecutedTimeoutTest = false;
    //             logcash.ResponseExecutedTimeoutTestErrorMsg = error + 'Executed logs API failed on catch ';
    //             logTimeCount = 0;
    //         }
    //     }
    // }
    //#endregion

    //#region Distributor Execution
    async function getDistributorExecutionBudget() {
        CallbackCash.ExecutionBudget = await generalService.fetchStatus('/code_jobs/execution_budget', {
            method: 'GET',
        });

        //debugger;
        logcash.getDistributorBudgetTest = true;
        if (CallbackCash.ExecutionBudget.Status == 200) {
            cacheLog.FreeBudget = CallbackCash.ExecutionBudget.Body.FreeBudget;
            cacheLog.UsedBudget = CallbackCash.ExecutionBudget.Body.UsedBudget;
            await createNewCJToBudgetTest();
        } else {
            logcash.getDistributorBudgetTest = false;
            logcash.getDistributorBudgetTestErrorMsg = 'Get distributor budget function failed ';
            await updateDistributorBudgetSecond();
        }
    }

    async function createNewCJToBudgetTest() {
        // cerate new code
        CodJobeBodyBudgetTest = {
            UUID: '',
            CodeJobName: 'New CodeJob to budget test',
            Type: 'AddonJob',
            // DraftCode:
            //     'exports.main=async(Client)=>{\r\n var response;\r\n Client.addLogEntry("Info", "multiplyResult");\r\n response={success:"true",errorMessage:"",resultObject:{}};\r\n   function multiply(a=2,b=3){\r\n\t\tvar res = {\'multiplyResult\':a*b};\r\n\t\tClient.addLogEntry("Info","Start Funcion multiply =" + res);\r\n\t\tresponse.resultObject=res;\r\n\t\tresponse.errorMessage="test msg";\r\n\t\tresponse.success=true;\r\n\t\treturn(response);\r\n\t}\r\n\tfunction sleep(ms){\r\nvar start=new Date().getTime(),expire=start+ms;\r\nwhile (new Date().getTime()<expire){}\r\nreturn;\r\n}\r\nsleep(5000);\r\n\treturn multiply(8,8);\r\n};',
            AddonPath: jsFileName, // Only for AddonJob
            AddonUUID: addonUUID, // Only for AddonJob
            FunctionName: functionNameCreateNewCJToBudgetTest,
            ExecutionMemoryLevel: 4,
        };

        CallbackCash.insertNewCodJobToBudgetTest = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: JSON.stringify(CodJobeBodyBudgetTest),
        });
        logcash.insertNewCodJobToBudgetTest = true;

        if (
            CallbackCash.insertNewCodJobToBudgetTest.Status == 200 &&
            CallbackCash.insertNewCodJobToBudgetTest.Body.UUID != ''
        ) {
            //CallbackCash.insertNewCodJobToBudgetTest.Body.Success changet to CallbackCash.insertNewCodJobToBudgetTest.success and CallbackCash.insertNewCodJobToBudgetTest.Body.CodeJobUUID  changed to .UUID
            listLength += 1;
            codeJobUUIDforBudget = CallbackCash.insertNewCodJobToBudgetTest.Body.UUID; //changed to .UUID
            await executeWithDraftBudgetTest();
        } else {
            logcash.insertNewCodJobToBudgetTest = false;
            logcash.insertNewCodJobToBudgetTestErrorMsg =
                'Post to CodeJobe with Draft failed.THe Budget test case not tested and will be tested again';
            await updateDistributorBudgetSecond();
            //await createNewCJToExecuteWithPapi();
        }
    }

    async function executeWithDraftBudgetTest() {
        // execute Draft code with small TimeOut 5000
        CallbackCash.WithDraftToBudgetTestFirst = await generalService.fetchStatus(
            `/code_jobs/async/${codeJobUUIDforBudget}/execute`, //   /execute_draft`
            { method: 'POST' },
        );
        generalService.sleep(20000);
        await getDistributorExecutionBudgetSecond();
    }

    async function getDistributorExecutionBudgetSecond() {
        CallbackCash.ExecutionBudget = await generalService.fetchStatus('/code_jobs/execution_budget', {
            method: 'GET',
        });

        //debugger;
        if (
            CallbackCash.ExecutionBudget.Status == 200 &&
            CallbackCash.ExecutionBudget.Body.FreeBudget < cacheLog.FreeBudget &&
            CallbackCash.ExecutionBudget.Body.UsedBudget > cacheLog.UsedBudget
        ) {
        } else {
            logcash.getDistributorBudgetTest = false;
            logcash.getDistributorBudgetTestErrorMsg =
                'Get distributor budget second function failed or one of parameters not updated. \nFreeBudget will be smaller to: ' +
                cacheLog.FreeBudget +
                'but actuall is: ' +
                CallbackCash.ExecutionBudget.Body.FreeBudget +
                '\nAnd Used budget will be biggest to: ' +
                cacheLog.UsedBudget +
                '  actuall value is: ' +
                CallbackCash.ExecutionBudget.Body.UsedBudget;
        }
        await executeWithDraftBudgetTestSecond();
    }

    async function executeWithDraftBudgetTestSecond() {
        // execute Draft code with small TimeOut 5000
        CallbackCash.WithDraftToBudgetTestSecond = await generalService.fetchStatus(
            `/code_jobs/async/${codeJobUUIDforBudget}/execute`, //   /execute_draft`
            { method: 'POST' },
        );
        generalService.sleep(10000);
        await getDistributorExecutionBudgetThird();
    }

    async function getDistributorExecutionBudgetThird() {
        CallbackCash.ExecutionBudgetThird = await generalService.fetchStatus('/code_jobs/execution_budget', {
            method: 'GET',
        });

        //debugger;
        if (
            CallbackCash.ExecutionBudgetThird.Status == 200 &&
            CallbackCash.ExecutionBudgetThird.Body.FreeBudget < cacheLog.FreeBudget &&
            CallbackCash.ExecutionBudgetThird.Body.UsedBudget > cacheLog.UsedBudget
        ) {
            logcash.getDistributorBudgetTestThird = true;
            //executeWithDraftBudgetTestSecond();
        } else {
            logcash.getDistributorBudgetTestThird = false;
            logcash.getDistributorBudgetTestThirdErrorMsg =
                'Get distributor budget third function failed or one of parameters not updated. \nFreeBudget will be smaller to: ' +
                cacheLog.FreeBudget +
                'but actuall is: ' +
                CallbackCash.ExecutionBudgetThird.Body.FreeBudget +
                '\nAnd Used budget will be biggest to: ' +
                cacheLog.UsedBudget +
                '  actuall value is: ' +
                CallbackCash.ExecutionBudgetThird.Body.UsedBudget;
        }
        await updateDistributorBudgetSecond();
    }
    //#endregion

    //#region Distributor Execution Budget
    // async function updateDistributorBudget() {
    //     // API to update distributor budget (in $)
    //     const updateBudget = {
    //         Budget: 0.0,
    //     };
    //     CallbackCash.UpdateBudget = await generalService.fetchStatus('/code_jobs/execution_budget/budget', {
    //         method: 'POST',
    //         body: JSON.stringify(updateBudget),
    //     });

    //     generalService.sleep(3000);
    //     await executeWithDraftWithoutBudget();
    // }

    // async function executeWithDraftWithoutBudget() {
    //     // execute Draft code with small TimeOut 5000
    //     CallbackCash.WithDraftWithoutBudget = await generalService.fetchStatus(
    //         `/code_jobs/async/${codeJobUUIDforBudget}/execute_draft`,
    //         { method: 'POST' },
    //     );

    //     generalService.sleep(50000);
    //     await getSingleExecutionLogToEmptyBudgetTest();
    // }

    // async function getSingleExecutionLogToEmptyBudgetTest() {
    //     CallbackCash.ResponseSingleExecutionLogToEmptyBudgetTest = await service.auditLogs
    //         .uuid(CallbackCash.WithDraftWithoutBudget.Body.ExecutionUUID)
    //         .get();
    //     //debugger;
    //     if (
    //         CallbackCash.ResponseSingleExecutionLogToEmptyBudgetTest.Status.Name == 'Failure' &&
    //         CallbackCash.ResponseSingleExecutionLogToEmptyBudgetTest.AuditInfo.ErrorMessage.includes(
    //             'You have reached 100% of your Jobs execution budget',
    //         ) == true
    //     ) {
    //         logcash.LogToEmptyBudgetTest = true;
    //     } else {
    //         logcash.LogToEmptyBudgetTest = false;
    //         logcash.LogToEmptyBudgetTestError =
    //             'The single execution log will return error message (the distributor budget is 0) to CodeJob: ' +
    //             codeJobUUIDforBudget;
    //     }
    //     await updateDistributorBudgetSecond();
    // }

    async function updateDistributorBudgetSecond() {
        // API to update distributor budget (in $)
        const updateBudget = {
            Budget: 2.0,
        };
        CallbackCash.UpdateBudget = await generalService.fetchStatus('/code_jobs/execution_budget/budget', {
            method: 'POST',
            body: JSON.stringify(updateBudget),
        });

        generalService.sleep(3000);
        await getDistributorExecutionBudgetLast();
    }

    async function getDistributorExecutionBudgetLast() {
        CallbackCash.ExecutionBudgetLast = await generalService.fetchStatus('/code_jobs/execution_budget', {
            method: 'GET',
        });

        //debugger;
        //logcash.ExecutionBudgetLast = true;
        if (CallbackCash.ExecutionBudgetLast.Status == 200) {
            logcash.ExecutionBudgetLast = true;
        } else {
            logcash.ExecutionBudgetLast = false;
        }
        await executeWithDraftWithBudget();
    }

    async function executeWithDraftWithBudget() {
        // execute Draft code with small TimeOut 5000
        CallbackCash.executeWithDraftWithBudget = await generalService.fetchStatus(
            `/code_jobs/async/${codeJobUUIDforBudget}/execute`, //   /execute_draft`
            { method: 'POST' },
        );

        generalService.sleep(30000);
        await getSingleExecutionLogToLastBudgetTest();
    }

    async function getSingleExecutionLogToLastBudgetTest() {
        CallbackCash.ResponseSingleExecutionLogToLastBudgetTest = await service.auditLogs
            .uuid(CallbackCash.executeWithDraftWithBudget.Body.ExecutionUUID)
            .get();
        //debugger;
        if (
            CallbackCash.ResponseSingleExecutionLogToLastBudgetTest.Status.Name == 'Success'
            //&& CallbackCash.ResponseSingleExecutionLogToLastBudgetTest.AuditInfo.AuditComment == ""
        ) {
            logcash.LogToLastBudgetTest = true;
        } else {
            logcash.LogToLastBudgetTest = false;
            logcash.LogToLastBudgetTestError =
                'The single execution log is empty or returned error code: ' + codeJobUUIDforBudget;
        }
        //await createNewCJToExecuteWithPapi();
    }
    //#endregion

    //#region execute with call to PAPI
    // async function createNewCJToExecuteWithPapi() {
    //     // cerate new code about Cron test case
    //     CodJobeBodyWithPapiCall = {
    //         UUID: '',
    //         CodeJobName: 'New CodeJob with PAPI in draft ',
    //         Description: 'PAPI call from draft/execute',
    //         CronExpression: '*/2 * * * *',
    //         NextRunTime: null,
    //         IsScheduled: false,
    //         FailureAlertEmailTo: ['qa@pepperi.com'],
    //         FailureAlertEmailSubject: 'Execution section',
    //         ExecutedCode: '',
    //         DraftCode:
    //             'exports.main = async (Client) => {\r\n    var response = {};\r\n   Client.addLogEntry("Info", "Start get curent version");\r\n\tresponse={success:"true",errorMessage:"",resultObject:{}};\r\n\tvar options = {\r\n\t\turi: Client.BaseURL + \'/transactions\',\r\n\t\tqs: {\r\n\t\t\t\'page_size\': 1\r\n\t\t},\r\n\t\theaders: {\r\n\t\t\t\'Authorization\': \' Bearer \' + Client.OAuthAccessToken\r\n\t\t},\r\n\t\tjson: true \r\n\t};\r\n\ttry{\r\n\t\tconst res = await Client.Module.rp(options);\r\n\t\tClient.addLogEntry("Info", "Got result = " + JSON.stringify(res));\r\n       response.success = true;\r\n       response.resultObject = res;\r\n\t}\r\n\tcatch(error){\r\n\t\tClient.addLogEntry("Error", "Failed get curent version: " + error);\r\n\t\tresponse.success = false;\r\n       response.errorMessage = error;\r\n       response.resultObject = null;\r\n\t}\r\n\treturn (response);\r\n};',
    //         CodeJobIsHidden: false,
    //         CreationDateTime: '',
    //         ModificationDateTime: '',
    //         ExecutionMemoryLevel: 1,
    //         //"NumberOfTries": 1
    //     };
    //     CallbackCash.insertNewCJtoPapiCall = await generalService.fetchStatus('/code_jobs', {
    //         method: 'POST',
    //         body: CodJobeBodyWithPapiCall,
    //     });
    //     logcash.insertNewCJtoPapiCall = true;

    //     if (CallbackCash.insertNewCJtoPapiCall.Status == 200) {
    //         listLength += 1;
    //         //CodeJobUUIDCron = CallbackCash.insertNewCJtoPapiCall.Body.UUID;
    //         await executeDraftCodeJobePapiTest();
    //     } else {
    //         logcash.insertNewCJtoCronVerification = false;
    //         logcash.insertNewCJtoCronVerificationErrorMsg =
    //             'Post to CodeJobe with Draft failed.Error message: ' +
    //             JSON.stringify(CallbackCash.insertNewCJtoPapiCall.Body.fault.faultstring);
    //     }
    // }

    // async function executeDraftCodeJobePapiTest() {
    //     CallbackCash.executeDraftCodeTestPapi = await generalService.fetchStatus(
    //         `/code_jobs/async/${CallbackCash.insertNewCJtoPapiCall.Body.UUID}/execute_draft`,
    //         { method: 'POST' },
    //     );
    //     if (
    //         CallbackCash.executeDraftCodeTestPapi.Status == 200 &&
    //         CallbackCash.executeDraftCodeTestPapi.Body.ExecutionUUID != '' &&
    //         CallbackCash.executeDraftCodeTestPapi.Body.URI != ''
    //     ) {
    //         logcash.executeDraftCodeTestPapi = true;
    //     } else {
    //         logcash.executeDraftCodeTestPapi = false;
    //         logcash.executeDraftCodeTestPapiError =
    //             'Post to execute CodeJobe with draft code failed. CodeJobUUID is: ' +
    //             CallbackCash.insertNewCJtoPapiCall.Body.UUID;
    //     }
    //     generalService.sleep(20000);
    //     await getSingleExecutonLogPapiTest();
    // }

    // async function getSingleExecutonLogPapiTest() {
    //     CallbackCash.ResponseExecutedLogsPapiTest = await service.auditLogs
    //         .uuid(CallbackCash.executeDraftCodeTestPapi.Body.ExecutionUUID)
    //         .get();
    //     //debugger;
    //     if (logTimeCount > logTimeRetryNum) {
    //         logcash.ResponseExecutedLogsPapiTest = false;
    //         logcash.ResponseExecutedLogsPapiTestErrorMsg = 'The execution log not created after 400 sec wheiting ';
    //     } else {
    //         if (CallbackCash.ResponseExecutedLogsPapiTest.Status.Name != 'Success') {
    //             // check if returned log , if not try after 20 sec
    //             generalService.sleep(40000);
    //             await getSingleExecutonLogPapiTest();
    //             logTimeCount = logTimeCount + 1;
    //         } else {
    //             //var tmp = JSON.parse(CallbackCash.ResponseExecutedLogsCronTest[0].ResultObject);
    //             if (
    //                 // && CallbackCash.ResponseExecutedLogsPapiTest.length == 1
    //                 CallbackCash.ResponseExecutedLogsPapiTest.Status.Name == 'Success' &&
    //                 //&& JSON.parse(CallbackCash.ResponseExecutedLogsPapiTest[0].ResultObject).multiplyResult == 6
    //                 CallbackCash.ResponseExecutedLogsPapiTest.AuditInfo.JobMessageData.CodeJobUUID ==
    //                     CallbackCash.insertNewCJtoPapiCall.Body.UUID &&
    //                 CallbackCash.ResponseExecutedLogsPapiTest.AuditInfo.ResultObject != ''
    //             ) {
    //                 logcash.ResponseExecutedLogsPapiTest = true;
    //                 logTimeCount = 0;
    //             } else {
    //                 logcash.ResponseExecutedLogsPapiTest = false; //changed from allbackCash.ResponseExecutedLogsPapiTest[0].auditLogUUID
    //                 logcash.ResponseExecutedLogsPapiTestErrorMsg =
    //                     'Executed logs API failed. AuditLogUUID Is: ' +
    //                     CallbackCash.ResponseExecutedLogsPapiTest[0].UUID +
    //                     '\nCodeJobUUId: ' +
    //                     CallbackCash.insertNewCJtoPapiCall.Body.UUID +
    //                     '\nDistributorUUID: ' +
    //                     CallbackCash.ResponseExecutedLogsPapiTest[0].DistributorUUID;
    //                 logTimeCount = 0; //added
    //             }
    //         }
    //         //appvarAddonCreation();
    //     }
    // }
    //#endregion
}
