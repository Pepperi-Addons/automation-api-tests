import GeneralService, { TesterFunctions } from '../../services/general.service';
//import { Client, Request } from '@pepperi-addons/debug-server/dist';

const jsFileName = 'test.js';
// let functionName = 'ido';
const functionNameUpdateDrafrCodeWithoutResult = 'updateDrafrCodeWithoutResult';
//const functionNameUpdateCodeJob = 'UpdateCodeJob';
const version = '0.0.5';
//const functionNameCreateNewCJToBudgetTest = 'createNewCJToBudgetTest';

const logcash: any = {};
let logTimeCount = 0;
const logTimeRetryNum = 19;
//let cashCallJobsList: any = {};
//let listLength;
//const cacheLog: any = {};
const CallbackCash: any = {};
//const JobName: any = {};
//let parsedData;
//let UserUUID;
//let UserID;
// const CodeJobUUID = '';
// const defaultValues = {
//     UUID: CodeJobUUID,
//     CodeJobName: JobName,
//     Description: '',
//     Owner: null,
//     CronExpression: '',
//     NextRunTime: null,
//     IsScheduled: false,
//     FailureAlertEmailTo: [],
//     FailureAlertEmailSubject: '',
//     ExecutedCode: '',
//     DraftCode: '',
//     CodeJobIsHidden: false,
//     CreationDateTime: '',
//     ModificationDateTime: '',
//     ExecutionMemoryLevel: 4,
//     NumberOfTries: 1,
// };
export async function TimeOutAddonJobsTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const assert = tester.assert;
    const it = tester.it;

    service['options'].addonUUID = '';

    //if(generalService['client'].NumberOfTry == 1 ){
    if (generalService['client'].NumberOfTry == 1) {
        //debugger;

        const addonUUID = generalService['client'].BaseURL.includes('staging')
            ? '48d20f0b-369a-4b34-b48a-ffe245088513'
            : '78696fc6-a04f-4f82-aadf-8f823776473f';

        // let updateValues: any = {};
        // let CodJobeBodyBudgetTest: any = {};
        // let codeJobUUIDforBudget: any = {};
        // let UpdateDraftCodeWithoutResult: any = {};

        //#region AllTests log and return object

        // this will run the first test that will run the second and so on..

        await installAddonToDist(addonUUID);
        // describe('Insert New Code Job', () => {
        //     it('Insert New Code Job With Manadatory Parameter: Name', () => {
        //         assert(logcash.statusA, 'Insert new Code Job with CodeJobName failed');
        //     });
        //     it('Get Single CodeJob With Mandatory Parameter CodeJobName: Name', () => {
        //         assert(logcash.statusb, logcash.errorMessageb);
        //     });
        //     it('Update CodeJob Params (From Default Values): Finished', () => {
        //         assert(logcash.statusc, 'Update Code Job failed');
        //     });
        //     it('Get Single CodeJob After Update: Name', () => {
        //         assert(logcash.statusd, logcash.errorMessaged);
        //     });

        // });

        // describe('Get List Of CodeJobs, Phase 1 (Phase 2 Will Be Done On The End Of All Tests)', () => {
        //     it('Get List Of CodeJobse (https://api.pepperi.com/v1.0/code_jobs) Phase 1: Finished', () => {
        //         const statusA = cashCallJobsList.status;
        //         assert(statusA, cashCallJobsList.message);
        //     });
        // });

        // describe('CodeJob Audit Log Verification', () => {
        //     it('CodeJob Audit Log Verification On Status: Insert, Publish, Update, Rollback: Finished', () => {
        //         assert(CallbackCash.auditLogStatus, CallbackCash.auditLogErrMsg);
        //     });
        // });
        // describe('Insert New CodJob Without Mandatory Field CodeJob Name', () => {
        //     it('Insert new CodJob Without Mandatory Field CodeJob Name: Finished', () => {
        //         assert(logcash.MandatoryCheck, logcash.MandatoryCheckError);
        //     });
        // });
        describe('TimeOut From Executed Draft Code', () => {
            it('Test Case TimeOut From Executed Draft Code: Finished', () => {
                assert(logcash.ResponseExecutedTimeoutTest, logcash.ResponseExecutedTimeoutTestErrorMsg);
            });
        });
        // describe('Distributor Execution. Budget Updating (not 0)', () => {
        //     it('Get Distributor Budget Function: Finished', () => {
        //         assert(logcash.getDistributorBudgetTest, logcash.getDistributorBudgetTestErrorMsg);
        //     });
        //     it('Insert New CodeJob To Budget Verification: Finished', () => {
        //         assert(logcash.insertNewCodJobToBudgetTest, logcash.insertNewCodJobToBudgetTestErrorMsg);
        //     });
        //     it('Get Distributor Budget Function: Finished', () => {
        //         assert(logcash.getDistributorBudgetTestThird, logcash.getDistributorBudgetTestThirdErrorMsg);
        //     });
        // });
        // describe('Distributor Execution Budget = 0', () => {
        //     // it('Execute Draft Code With No Distributor Budget: Finished', () => {
        //     //     assert(logcash.LogToEmptyBudgetTest, logcash.LogToEmptyBudgetTestError);
        //     // });
        //     it('Execute Draft Code After Budget Updated To 2 min: Finished', () => {
        //         assert(logcash.LogToLastBudgetTest, logcash.LogToLastBudgetTestError);
        //     });
        // });
    } else {
        await getLogsToExecutedTimeoutTest();
    }
    //#endregion

    async function installAddonToDist(addonUUID) {
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
        await updateDrafrCodeWithoutResult(addonUUID);
    }

    async function updateDrafrCodeWithoutResult(addonUUID) {
        //  update draft . Removed returnResult(result) and we will get timeout + email
        const UpdateDraftCodeWithoutResult = {
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
            //listLength += 1;
            await executeWithDraftWithoutResult();
        } else {
            logcash.UpdatedDraftCodeWithoutResult = false;
            logcash.UpdatedDraftCodeWithoutResult =
                'Post to CodeJobe with Draft failed. Error message: ' +
                JSON.stringify(CallbackCash.UpdatedDraftCodeWithoutResult.Body.fault.faultstring);
            //await getDistributorExecutionBudget();
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
        //generalService.sleep(130000); // weit to get log with timeout exeption

        //logTimeCount = 0;

        await getLogsToExecutedTimeoutTest();
    }

    async function getLogsToExecutedTimeoutTest() {
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //!!!!!!! Should be updated after bug https://pepperi.atlassian.net/browse/DI-16024 fixing .
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        CallbackCash.ResponseExecutedTimeoutTest = await service.auditLogs
            .uuid(CallbackCash.WithDraftWithoutResult.Body.ExecutionUUID)
            .get();
        //debugger;
        if (logTimeCount > logTimeRetryNum) {
            logcash.ResponseExecutedTimeoutTest = false;
            logcash.ResponseExecutedTimeoutTestErrorMsg = 'The execution log not created after 540000 ms wheiting ';
            logTimeCount = 0;
            // await getDistributorExecutionBudget();
        } else {
            try {
                // addet try and catch
                // if (CallbackCash.ResponseExecutedTimeoutTest.length < 1){
                if (
                    CallbackCash.ResponseExecutedTimeoutTest == null ||
                    CallbackCash.ResponseExecutedTimeoutTest.Status.Name == 'InProgress'
                ) {
                    //generalService.sleep(20000);
                    generalService['client'].Retry(60 * 1000);
                    // logTimeCount = logTimeCount + 1;
                    // await getLogsToExecutedTimeoutTest();
                } else {
                    //var tmp = JSON.parse(CallbackCash.ResponseExecutedLogsCronTest[0].ResultObject);
                    if (
                        CallbackCash.ResponseExecutedTimeoutTest.AuditInfo.ErrorMessage.includes('timed out') == true &&
                        //&& CallbackCash.ResponseExecutedTimeoutTest.length == 1
                        (CallbackCash.ResponseExecutedTimeoutTest.Status.Name == 'Failure' ||
                            CallbackCash.ResponseExecutedTimeoutTest.Status.Name == 'InRetry') &&
                        CallbackCash.ResponseExecutedTimeoutTest.AuditInfo.JobMessageData.CodeJobUUID ==
                            CallbackCash.UpdatedDraftCodeWithoutResult.Body.UUID
                    ) {
                        logcash.ResponseExecutedTimeoutTest = true;
                        logTimeCount = 0;
                        // describe("TimeOut from executed draft code ", ()=> {
                        //    it("Test case TimeOut from executed draft code: Finished", ()=> {
                        //         assert(logcash.ResponseExecutedTimeoutTest, logcash.ResponseExecutedTimeoutTestErrorMsg);
                        //     });
                        // });
                        //await getDistributorExecutionBudget();
                        //throw "Elastic created without error message"
                    } else {
                        logcash.ResponseExecutedTimeoutTest = false;
                        logcash.ResponseExecutedTimeoutTestErrorMsg =
                            'Executed logs API failed. Log is empty (row 1221 for QA automation)';
                        logTimeCount = 0; //added
                        // describe("TimeOut from executed draft code ", ()=> {
                        //    it("Test case TimeOut from executed draft code: Finished", ()=> {
                        //         assert(logcash.ResponseExecutedTimeoutTest, logcash.ResponseExecutedTimeoutTestErrorMsg);
                        //     });
                        // });
                        //await getDistributorExecutionBudget();
                    }
                }
            } catch (error) {
                logcash.ResponseExecutedTimeoutTest = false;
                logcash.ResponseExecutedTimeoutTestErrorMsg = error + 'Executed logs API failed on catch ';
                logTimeCount = 0;
            }
        }
    }
    //#endregion
}
