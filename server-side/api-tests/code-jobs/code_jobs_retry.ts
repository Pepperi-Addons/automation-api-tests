import GeneralService, { TesterFunctions } from '../../services/general.service';

export async function CodeJobsRetryTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const assert = tester.assert;
    const it = tester.it;

    service['options'].addonUUID = '';

    const logcash: any = {};
    const CallbackCash: any = {};
    let insertBodyRetryTest: any = {};
    let logDataNoRetry: any = {};
    //const logDataRetry: any = {};
    const executionLog: any = {};
    let logDataWithRetry: any = {};
    let logDataWithRetry2: any = {};

    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const jsFileName = 'test.js';
    // let functionName = 'ido';
    //const functionNameUpdateDrafrCodeWithoutResult = 'updateDrafrCodeWithoutResult';
    const functionNamecreateNewCodeJobRetryTest = 'createNewCodeJobRetryTest';
    const version = '0.0.4';

    // this will run the first test that will run the second and so on..
    //await createNewCodeJobRetryTest();
    await installAddonToDist();

    describe('Retry Mechanism Verification ', () => {
        it('Failure With One Try. The Retry Mechanism Stoped: Finished', () => {
            assert(executionLog.StatusWithoutRetry, executionLog.ErrorStatusWithoutRetry);
        });
        it('Get Status: 4 - InRetry, With Two Tries: Finished', () => {
            assert(executionLog.StatusExecutonLogWithRetry, executionLog.ErrorExecutonLogWithRetry);
        });
        it('GET Status: 0 - Failure: Finished', () => {
            assert(executionLog.StatusExecutonLogWithRetry2, executionLog.ErrorExecutonLogWithRetry2);
        });
    });

    // async function installAddonToDist() {
    //     CallbackCash.installAddonToDist = await generalService.fetchStatus(
    //         '/addons/installed_addons/' + addonUUID + '/install' + '/' + version,
    //         { method: 'POST' },
    //     );
    //     await createNewCodeJobRetryTest();
    // }

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
        await createNewCodeJobRetryTest();
    }


    async function createNewCodeJobRetryTest() {
        insertBodyRetryTest = {
            UUID: '',
            CodeJobName: 'CodeJob creation with values',
            Description: 'created desription',
            Owner: null,
            CronExpression: '0 9 16 12 *',
            NextRunTime: null,
            IsScheduled: false,
            Type: 'AddonJob',
            FailureAlertEmailTo: ['oleg.y@pepperi.com'],
            FailureAlertEmailSubject: 'test creation',
            ExecutedCode: '',
            // DraftCode:
            //     'exports.main = async (Client) => {\r\nvar response = {};\r\nClient.addLogEntry("Info","Start throw new error");\r\nthrow new Error(\'nofartest\');\r\nreturn (response);\r\n};',
            CodeJobIsHidden: false,
            CreationDateTime: '',
            ModificationDateTime: '',
            ExecutionMemoryLevel: 1,
            NumberOfTries: 1,
            AddonPath: jsFileName, // Only for AddonJob
            AddonUUID: addonUUID, // Only for AddonJob
            FunctionName: functionNamecreateNewCodeJobRetryTest,
        };
        CallbackCash.ResponseRetryTest = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: insertBodyRetryTest,
        });
        const status = CallbackCash.ResponseRetryTest.Status;
        if (status == 200 && CallbackCash.ResponseRetryTest.Body.UUID != '') {
            logcash.statusInsert1 = true;
        } else {
            logcash.statusInsert1 = false;
        }

        await executeDraftCodeWithoutRetry();
    }

    async function executeDraftCodeWithoutRetry() {
        CallbackCash.executeDraftCodeWithoutRetry = await generalService.fetchStatus(
            '/code_jobs/async/' + CallbackCash.ResponseRetryTest.Body.UUID + '/execute', //'/execute_draft'
            { method: 'POST' },
        ); // changed to .Body.UUID from .Body.CodeJobUUID

        if (
            CallbackCash.executeDraftCodeWithoutRetry.Status == 200 && // status changed to Status
            CallbackCash.executeDraftCodeWithoutRetry.Body.ExecutionUUID != '' &&
            CallbackCash.executeDraftCodeWithoutRetry.Body.URI != ''
        ) {
            logcash.executeDraftCodeWithoutRetry = true;
        } else {
            logcash.executeDraftCodeWithoutRetry = false;
            logcash.ErrorFromexecuteDraftCodeWithoutRetry = 'Post to execute CodeJobe with draft code failed';
        }

        generalService.sleep(20000);
        await getSingleExecutonLogWithoutRetry();
    }

    async function getSingleExecutonLogWithoutRetry() {
        logDataNoRetry = await generalService.fetchStatus(
            '/audit_logs/' + CallbackCash.executeDraftCodeWithoutRetry.Body.ExecutionUUID,
            { method: 'GET' },
        );
        //cacheLog.ExecutionResult = JSON.parse(logData.Body.AuditInfo.ResultObject);
        if (
            logDataNoRetry.Status == 200 &&
            logDataNoRetry.Body.UUID == CallbackCash.executeDraftCodeWithoutRetry.Body.ExecutionUUID &&
            logDataNoRetry.Body.Event.Type == 'addon_job_execution' //'code_job_execution'
        ) {
            if (logDataNoRetry.Body.Status.ID == 0) {
                executionLog.StatusWithoutRetry = true;
            } else {
                executionLog.StatusWithoutRetry = false;
            }
        } else {
            executionLog.StatusWithoutRetry = false;
            executionLog.ErrorStatusWithoutRetry =
                'Audit log Status returned wrong (status will be failure (0)), but returned: \n' +
                logDataNoRetry.Body.Status.ID +
                'returned ExecutionUUID  is' +
                CallbackCash.executeDraftCodeWithoutRetry.Body.ExecutionUUID +
                ' and CodeJobeUUID is  ' +
                CallbackCash.ResponseRetryTest.Body.UUID;
        }

        await updateCodeJobRetryTest();
    }

    async function updateCodeJobRetryTest() {
        insertBodyRetryTest = {
            UUID: CallbackCash.ResponseRetryTest.Body.UUID,
            NumberOfTries: 2,
        };
        CallbackCash.ResponseRetryTestUpdated = await generalService.fetchStatus('/code_jobs', {
            method: 'POST',
            body: insertBodyRetryTest,
        });
        const status = CallbackCash.ResponseRetryTestUpdated.Status;
        if (status == 200) {
            logcash.statusInsert2 = true;
        } else {
            logcash.statusInsert2 = false;
        }
        ////sleep
        //m_globalTestService .sleep(2000);
        await executeDraftCodeWithRetry();
    }

    async function executeDraftCodeWithRetry() {
        CallbackCash.executeDraftCodeWithRetry = await generalService.fetchStatus(
            '/code_jobs/async/' + CallbackCash.ResponseRetryTest.Body.UUID + '/execute', //'/execute_draft'
            { method: 'POST' },
        );
        if (
            CallbackCash.executeDraftCodeWithRetry.Status == 200 &&
            CallbackCash.executeDraftCodeWithRetry.Body.ExecutionUUID != '' &&
            CallbackCash.executeDraftCodeWithRetry.Body.URI != ''
        ) {
            logcash.executeDraftCodeWithRetry = true;
        } else {
            logcash.executeDraftCodeWithRetry = false;
            logcash.ErrorFromexecuteDraftCodeWithRetry = 'Post to execute CodeJobe with draft code failed';
        }

        generalService.sleep(20000);
        await getSingleExecutonLogWithRetry();
    }

    async function getSingleExecutonLogWithRetry() {
        logDataWithRetry = await generalService.fetchStatus(
            '/audit_logs/' + CallbackCash.executeDraftCodeWithRetry.Body.ExecutionUUID,
            { method: 'GET' },
        );
        //cacheLog.ExecutionResult = JSON.parse(logData.Body.AuditInfo.ResultObject);
        if (
            logDataWithRetry.Status == 200 &&
            logDataWithRetry.Body.UUID == CallbackCash.executeDraftCodeWithRetry.Body.ExecutionUUID &&
            logDataWithRetry.Body.Event.Type == 'addon_job_execution' //'code_job_execution'
        ) {
            if (logDataWithRetry.Body.Status.ID == 4) {
                executionLog.StatusExecutonLogWithRetry = true;
            } else {
                executionLog.StatusExecutonLogWithRetry = false;
                executionLog.ErrorExecutonLogWithRetry =
                    'Audit log Status returned wrong (status will be retry (4)), but returned: ' +
                    logDataWithRetry.Body.Status.ID +
                    '\nreturned ExecutionUUID  is: ' +
                    CallbackCash.executeDraftCodeWithoutRetry.Body.ExecutionUUID +
                    ' and CodeJobeUUID is  ' +
                    CallbackCash.ResponseRetryTest.Body.UUID;
            }
        } else {
            executionLog.StatusExecutonLogWithRetry = false;
            executionLog.ErrorExecutonLogWithRetry =
                'Audit log Status returned wrong (status will be retry (4)), but returned: \n' +
                logDataWithRetry.Body.Status.ID +
                'returned ExecutionUUID  is' +
                CallbackCash.executeDraftCodeWithoutRetry.Body.ExecutionUUID +
                ' and CodeJobeUUID is  ' +
                CallbackCash.ResponseRetryTest.Body.UUID;
        }
        generalService.sleep(320000);
        await getSingleExecutonLogWithRetry2();
    }

    async function getSingleExecutonLogWithRetry2() {
        logDataWithRetry2 = await generalService.fetchStatus(
            '/audit_logs/' + CallbackCash.executeDraftCodeWithRetry.Body.ExecutionUUID,
            { method: 'GET' },
        );
        //cacheLog.ExecutionResult = JSON.parse(logData.Body.AuditInfo.ResultObject);
        if (
            logDataWithRetry2.Status == 200 &&
            logDataWithRetry2.Body.UUID == CallbackCash.executeDraftCodeWithRetry.Body.ExecutionUUID &&
            logDataWithRetry2.Body.Event.Type == 'addon_job_execution' //'code_job_execution'
        ) {
            if (logDataWithRetry2.Body.Status.ID == 0) {
                executionLog.StatusExecutonLogWithRetry2 = true;
            } else {
                executionLog.StatusExecutonLogWithRetry2 = false;
                executionLog.ErrorExecutonLogWithRetry2 =
                    'Audit log Status returned wrong (status will be retry (0 - failure)), but returned: ' +
                    CallbackCash.executeDraftCodeWithRetry.Body.ExecutionUUID +
                    ' and CodeJobeUUID is  ' +
                    CallbackCash.ResponseRetryTest.Body.UUID;
            }
        } else {
            executionLog.StatusExecutonLogWithRetry2 = false;
            executionLog.ErrorExecutonLogWithRetry2 =
                'Audit log Status returned wrong (status will be retry (0 - failure)), but returned: ' +
                logDataWithRetry2.Body.Status.ID +
                '\nreturned ExecutionUUID  is: ' +
                CallbackCash.executeDraftCodeWithRetry.Body.ExecutionUUID +
                ' and CodeJobeUUID is  ' +
                CallbackCash.ResponseRetryTest.Body.UUID;
        }
    }
}
