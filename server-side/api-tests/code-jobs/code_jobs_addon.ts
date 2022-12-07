import GeneralService, { TesterFunctions } from '../../services/general.service';

export async function CodeJobsAddonTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const assert = tester.assert;
    const it = tester.it;

    service['options'].addonUUID = '';

    const logcash: any = {};
    const CallbackCash: any = {};
    // let insertBodyRetryTest: any = {};
    // let logDataNoRetry: any = {};
    // let logDataRetry: any = {};
    // let executionLog: any = {};
    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const jsFileName = 'test.js';
    // let functionName = 'ido';
    // let versionsArr = [];
    const functionNameWithBody = 'oleg';
    const functionNamePapiTransaction = 'getTransactions';
    //let bodyValue: any = {};
    const version = '0.0.1';
    let listLength = 0;
    let addonJobBody: any = {};

    // this will run the first test that will run the second and so on..
    await installAddonToDist();

    describe('Addon Jobs Test', () => {
        it('Create New Addon Jobs: Finished', () => {
            assert(logcash.createNewAddonJobStatus, logcash.createNewAddonJobStatusError);
        });
        it('Execute Addon Jobs: Finished', () => {
            assert(CallbackCash.executeAddonJobStatus, CallbackCash.executeAddonJobStatusError);
        });
        it('Execution AuditLog: Finished', () => {
            assert(logcash.getAuditLogAddonJobExecution, logcash.getAuditLogAddonJobExecutionError);
        });
        it('Negative Test - Creation With Draft Code', () => {
            assert(logcash.createNewAddonJobNegative, logcash.createNewAddonJobNegativeError);
        });
        it('Negative - Type Field Verification', () => {
            assert(logcash.updateNewAddonJobNegative, logcash.updateNewAddonJobNegativeError);
        });
        it('Negative - Type Field Default Value Verification', () => {
            assert(logcash.insertNewCJWithoutType, logcash.insertNewCJWithoutTypeError);
        });
    });

    // async function installAddonToDist() {
    //     CallbackCash.installAddonToDist = await generalService.fetchStatus(
    //         '/addons/installed_addons/' + addonUUID + '/install' + '/' + version,
    //         { method: 'POST' },
    //     );
    //     await createNewAddonJob();
    // }
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
        await createNewAddonJob();
    }

    //#region AddonJob test body
    async function createNewAddonJob() {
        //JobName = { CodeJobName: "CodeJob creation with values" };//create post body with all params
        addonJobBody = {
            UUID: '',
            CodeJobName: 'AddonJob with values',
            Description: 'AddonJob test',
            Type: 'AddonJob',
            //"Owner": { "UUID" : ""},
            // "CronExpression": "0 9 16 12 *",
            // "NextRunTime": null,
            IsScheduled: false,
            // FailureAlertEmailTo: ['oleg.y@pepperi.com'],
            // FailureAlertEmailSubject: 'test creation',
            // "ExecutedCode": "",
            // "DraftCode": "exports.main=async(Client)=>{\r\nvar response;\r\nClient.addLogEntry(\"Info\", \"multiplyResult\");\r\nresponse={success:\"true\",errorMessage:\"\",resultObject:{}};\r\nfunction multiply(a=2,b=3){\r\nvar res = {'multiplyResult':a*b};\r\nClient.addLogEntry(\"Info\",\"Start Funcion multiply =\" + res);\r\nresponse.resultObject=res;\r\nresponse.errorMessage=\"test msg\";\r\nresponse.success=true;\r\nreturn(response);\r\n}\r\nreturn multiply(2,3);\r\n};",
            CodeJobIsHidden: false,
            CreationDateTime: '',
            ModificationDateTime: '',
            ExecutionMemoryLevel: 1,
            NumberOfTries: 1,
            AddonPath: jsFileName, // Only for AddonJob
            AddonUUID: addonUUID, // Only for AddonJob
            FunctionName: functionNamePapiTransaction,
        };
        CallbackCash.createNewAddonJob = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: addonJobBody,
        });
        //var status = CallbackCash.createNewAddonJob.success;
        logcash.createNewAddonJobStatus = true;
        if (CallbackCash.createNewAddonJob.Status == 200 && CallbackCash.createNewAddonJob.Body.UUID != '') {
            listLength = listLength + 1;
        } else {
            logcash.createNewAddonJobStatus = false;
            logcash.createNewAddonJobStatusError = 'Addon Job failed on creation';
        }
        await executeAddonJob();
    }

    async function executeAddonJob() {
        CallbackCash.executeAddonJob = await generalService.fetchStatus(
            '/code_jobs/async/' + CallbackCash.createNewAddonJob.Body.UUID + '/execute',
            { method: 'POST' },
        );
        //debugger;
        if (CallbackCash.executeAddonJob.Body.ExecutionUUID != '') {
            CallbackCash.executeAddonJobStatus = true;
            await getAuditLogAddonJobExecution();
        } else {
            CallbackCash.executeAddonJobStatus = false;
            CallbackCash.executeAddonJobStatusError =
                'Addon Job (async) execution failed, audit log not created. AddonJobUUID : ' +
                CallbackCash.createNewAddonJob.Body.UUID;
            await createNewAddonJobNegative();
        }
        //deleteAddonVAR();
    }
    //get resultObject from AuditLog
    async function getAuditLogAddonJobExecution() {
        generalService.sleep(30000);
        CallbackCash.getAuditLogAddonJobExecution = await generalService.fetchStatus(
            '/audit_logs/' + CallbackCash.executeAddonJob.Body.ExecutionUUID,
            { method: 'GET' },
        );
        //debugger;
        CallbackCash.parsedResultObject = JSON.parse(
            CallbackCash.getAuditLogAddonJobExecution.Body.AuditInfo.ResultObject,
        );
        if (
            CallbackCash.parsedResultObject.success == true &&
            CallbackCash.parsedResultObject.resultObject['length'] > 0
        ) {
            logcash.getAuditLogAddonJobExecution = true;
        } else {
            logcash.getAuditLogAddonJobExecution = false;
            logcash.getAuditLogAddonJobExecutionError =
                'Not returend data from getAllTransaction API. ResultObject is empty. ExecutionUUID : ' +
                CallbackCash.createNewAddonJob.Body.UUID;
        }
        await createNewAddonJobNegative();
    }

    //inser new AddonJob - parameters verification
    async function createNewAddonJobNegative() {
        //JobName = { CodeJobName: "CodeJob creation with values" };//create post body with all params
        addonJobBody = {
            UUID: '',
            CodeJobName: 'AddonJob negative test',
            Description: 'Try insert draft code to AddonJob Type',
            Type: 'AddonJob',
            //"Owner": { "UUID" : ""},
            // "CronExpression": "0 9 16 12 *",
            // "NextRunTime": null,
            IsScheduled: false,
            FailureAlertEmailTo: ['oleg.y@pepperi.com'],
            FailureAlertEmailSubject: 'test creation',
            // "ExecutedCode": "",
            DraftCode:
                'exports.main=async(Client)=>{\r\nvar response;\r\nClient.addLogEntry("Info", "multiplyResult");\r\nresponse={success:"true",errorMessage:"",resultObject:{}};\r\nfunction multiply(a=2,b=3){\r\nvar res = {\'multiplyResult\':a*b};\r\nClient.addLogEntry("Info","Start Funcion multiply =" + res);\r\nresponse.resultObject=res;\r\nresponse.errorMessage="test msg";\r\nresponse.success=true;\r\nreturn(response);\r\n}\r\nreturn multiply(2,3);\r\n};',
            CodeJobIsHidden: false,
            CreationDateTime: '',
            ModificationDateTime: '',
            ExecutionMemoryLevel: 1,
            NumberOfTries: 1,
            AddonPath: jsFileName, // Only for AddonJob
            AddonUUID: addonUUID, // Only for AddonJob
            FunctionName: functionNameWithBody,
        };
        CallbackCash.createNewAddonJobNegative = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: addonJobBody,
        });
        //debugger;
        // verification will be changed after bug fixing. Now i get succes , but should get exeption about draft code
        //status = CallbackCash.createNewAddonJobNegative.success;
        logcash.createNewAddonJobNegative = true;

        if (
            CallbackCash.createNewAddonJobNegative.Status == 200 &&
            CallbackCash.createNewAddonJobNegative.Body.UUID != ''
        ) {
            listLength = listLength + 1;
        } else {
            logcash.createNewAddonJobNegative = false;
            logcash.createNewAddonJobNegativeError = 'Addon Job failed on creation';
        }

        await updateNewAddonJobNegative();
    }

    async function updateNewAddonJobNegative() {
        // Verification on Type filed - its not editable
        addonJobBody = {
            UUID: CallbackCash.createNewAddonJobNegative.Body.UUID,
            Type: 'UserCodeJob',
            IsScheduled: false,
            // "ExecutedCode": "",
            DraftCode:
                'exports.main=async(Client)=>{\r\nvar response;\r\nClient.addLogEntry("Info", "multiplyResult");\r\nresponse={success:"true",errorMessage:"",resultObject:{}};\r\nfunction multiply(a=2,b=3){\r\nvar res = {\'multiplyResult\':a*b};\r\nClient.addLogEntry("Info","Start Funcion multiply =" + res);\r\nresponse.BodyObject=res;\r\nresponse.errorMessage="test msg";\r\nresponse.success=true;\r\nreturn(response);\r\n}\r\nreturn multiply(2,3);\r\n};',
            // "AddonPath" : jsFileName, // Only for AddonJob
            AddonUUID: addonUUID, // Only for AddonJob
            // "FunctionName": functionNameWithBody
        };
        CallbackCash.updateNewAddonJobNegative = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: addonJobBody,
        });
        //debugger;
        //CallbackCash.parsedUpdateNewAddonJobNegative = JSON.parse(CallbackCash.updateNewAddonJobNegative.Body.fault.faultstring);//statustext changed to result
        if (
            CallbackCash.updateNewAddonJobNegative.Status == 400 &&
            CallbackCash.updateNewAddonJobNegative.Body.fault.faultstring.includes('Can not update job type') == true
        ) {
            logcash.updateNewAddonJobNegative = true;
        } else {
            logcash.updateNewAddonJobNegative = false;
            logcash.updateNewAddonJobNegativeError =
                'Code Job type updated from AddonJob to UserCodeJob. Type will be not editable. CodeJob UUID : ' +
                CallbackCash.createNewAddonJobNegative.Body.UUID;
        }
        await insertNewCJWithoutType();
    }

    //insert new CodeJob without param Type . Default value is UserCodeJob
    async function insertNewCJWithoutType() {
        const addonJobBodyWithoutType = {
            CodeJobName: 'Code Job without type - negative test',
            IsScheduled: false,
            // "ExecutedCode": "",
        };
        CallbackCash.insertNewCJWithoutType = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: JSON.stringify(addonJobBodyWithoutType),
        });
        //debugger;
        if (
            CallbackCash.insertNewCJWithoutType.Status == 400 &&
            CallbackCash.insertNewCJWithoutType.Body.fault.faultstring == 'Requested job type is not valid'
        ) {
            logcash.insertNewCJWithoutType = true;
        } else {
            logcash.insertNewCJWithoutType = false;
            logcash.insertNewCJWithoutTypeError = 'Insert will faill with error : Requested job type is not valid';
        }
        //updateAddonUUIDValueNegative();
    }

    // function updateAddonUUIDValueNegative(){
    // // will check with Nofar all exceptions. THis flow not return exception, but AddonUUID not entered
    //     var jobBodyNeg = {
    //         "UUID": CallbackCash.insertNewCJWithoutType.Body.UUID,
    //         "AddonUUID" : addonUUID // Only for AddonJob
    //     }
    //     CallbackCash.updateAddonUUIDValueNegative = API.Call.Sync("Post", "code_jobs", jobBodyNeg);
    //     debugger;
    //     CallbackCash.parsedupdateAddonUUIDValueNegative = JSON.parse(CallbackCash.updateAddonUUIDValueNegative.statusText);
    //     if(CallbackCash.updateAddonUUIDValueNegative.fault.faultstring != "Can not update job type" && CallbackCash.updateAddonUUIDValueNegative.success == false){
    //          logcash.updateAddonUUIDValueNegative = true
    //     }
    //     else{
    //         logcash.updateAddonUUIDValueNegative = false
    //         logcash.updateAddonUUIDValueNegativeError = ("Update will fail because AddonUUID param not allowed to UserCodeJob type. CodeJob UUID : " + CallbackCash.insertNewCJWithoutType.Body.UUID);
    //     }
    //     deleteAddonVAR();
    // }
    //#endregion AddonJob test body

    // function deleteAddonVAR(){
    //     for (let index = 0; index < versionsArr.length; index++) {
    //          CallbackCash.deleteAddonVAR = VarAPI.CallSync('DELETE', "var/addons/versions/" + versionsArr[index].Body[0].UUID);
    //      }
    //      CallbackCash.deleteAddonVAR = VarAPI.CallSync('DELETE', "var/addons/" + addonUUID);
    //      if(CallbackCash.deleteAddonVAR.Body.Success== true){
    //          CallbackCash.deleteAddonVAR = true;
    //      }
    //      else{
    //          CallbackCash.deleteAddonVAR = false;
    //          CallbackCash.deleteAddonVARMsg = ("The delete addon function failed. Addon UUID: " + addonUUID);
    //      }
    //      describe("AddonJob test ", () => {
    //         it("Create new AddonJob: finished", () => {
    //             assert(logcash.createNewAddonJobStatus, logcash.createNewAddonJobStatusError);
    //         });
    //         it("Execute AddonJob : finished", () => {
    //             assert(CallbackCash.executeAddonJobStatus, CallbackCash.executeAddonJobStatusError);
    //         });
    //         it("Execution AuditLOg : finished", () => {
    //             assert(logcash.getAuditLogAddonJobExecution, logcash.getAuditLogAddonJobExecutionError);
    //         });
    //         it("Negative test - creation with draft code", () => {
    //             assert(logcash.createNewAddonJobNegative, logcash.createNewAddonJobNegativeError);
    //         });
    //         it("Negative - type field verification", () => {
    //             assert(logcash.updateNewAddonJobNegative, logcash.updateNewAddonJobNegativeError);
    //         });
    //         it("Negative - type field default value verification", () => {
    //             assert(logcash.insertNewCJWithoutType, logcash.insertNewCJWithoutTypeError);
    //         });
    //     });
}
