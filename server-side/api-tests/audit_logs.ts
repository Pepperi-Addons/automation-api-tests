import GeneralService, { TesterFunctions } from '../services/general.service';
import fetch from 'node-fetch';

declare type SyncStatus = 'New' | 'SyncStart' | 'Skipped' | 'Done';
declare type ServerTypes = 'sandbox' | 'eu' | 'prod';

// All Fields Tests
export async function AuditLogsTests(generalService: GeneralService, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    const setNewTestHeadline = tester.setNewTestHeadline;
    const addTestResultUnderHeadline = tester.addTestResultUnderHeadline;
    const printTestResults = tester.printTestResults;

    //#region Prerequisites for Audit Logs Tests
    //TestData
    const testDataDraftToExecuteInPositiveTest = {
        UUID: '',
        CodeJobName: 'New CodeJob with draft code for Audit Logs Positive Test',
        Description: 'Execute Job Using Draft Code',
        //This can be used to test the Scheduler addon (1/3)
        // "CodeJobName": "004" + "  Published no Sceduled Positive",
        // "Description": "Published no Sceduled",
        Owner: '',
        CronExpression: '0/20 * 1/1 * *', //Every 20   minutes
        NextRunTime: null,
        IsScheduled: false,
        FailureAlertEmailTo: ['qa@pepperi.com'],
        FailureAlertEmailSubject: 'Execution section',
        ExecutedCode: '',
        DraftCode:
            'exports.main=async(Client)=>{' +
            'var response;' +
            "Client.addLogEntry('Info', 'Start Code Test');" +
            'response = {' +
            "success:'true'," +
            "errorMessage:''," +
            'resultObject: new Object()' +
            '};' +
            'function multiply(a,b){' +
            'var res = {' +
            "'multiplyResult':a*b" +
            '};' +
            "Client.addLogEntry('Info','Start Funcion multiply = ' + JSON.stringify(res));" +
            'response.resultObject=res;' +
            "response.errorMessage='test msg';" +
            'response.success=true;' +
            'return(response);' +
            '}' +
            'return multiply(4,2);' +
            '};',
        CodeJobIsHidden: false,
        CreationDateTime: '',
        ModificationDateTime: '',
        ExecutionMemoryLevel: 1,
        NumberOfTries: 1,
    };

    const testDataDraftToExecuteInNegativeTest = {
        UUID: '',
        CodeJobName: 'New CodeJob with draft code for Audit Logs Negative Test',
        Description: 'Fail to Execute Job Using Draft Code',
        //This can be used to test the Scheduler addon (2/3)
        // "CodeJobName": "004" + " Published no Sceduled Negative",
        // "Description": "Published no Sceduled",
        Owner: '',
        CronExpression: '0/20 * 1/1 * *', //Every 20 minutes
        NextRunTime: null,
        IsScheduled: false,
        FailureAlertEmailTo: ['qa@pepperi.com'],
        FailureAlertEmailSubject: 'Execution section',
        ExecutedCode: '',
        DraftCode:
            'exports.main = async (Client) => {' +
            'var response = {};' +
            "Client.addLogEntry('Info', 'Start throw new error');" +
            "throw new Error('orenTest');" +
            'return (response);' +
            '};',
        CreationDateTime: '',
        ModificationDateTime: '',
        ExecutionMemoryLevel: 1,
        NumberOfTries: 1,
    };

    const testDataBodySyncTest = {
        LocalDataUpdates: null,
        LastSyncDateTime: 62610367500000 /*This Uses c# DateTime.Ticks*/,
        DeviceExternalID: 'OrenSyncTest',
        CPIVersion: '16.40',
        TimeZoneDiff: 0,
        Locale: true,
        BrandedAppID: 5555,
        UserFullName: 'Samuray_Pong',
        SoftwareVersion: 9001,
        SourceType: '5',
        DeviceModel: 'SynkingOren',
        DeviceName: 'OrenSynKing',
        DeviceScreenSize: 9000,
        SystemName: 'OREN-PC',
        ClientDBUUID: 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString(),
    };
    //#endregion Prerequisites for Audit Logs Tests

    const syncTest = 'Audit Logs Sync Test';
    setNewTestHeadline(syncTest);

    const syncOldTest = 'Old Sync Test';
    setNewTestHeadline(syncOldTest);

    const syncOldNegativeTest = 'Old Sync Negative Test';
    setNewTestHeadline(syncOldNegativeTest);

    const codeJobPositiveTest = 'Audit Logs Positive CodeJob Test';
    setNewTestHeadline(codeJobPositiveTest);

    const codeJobNegativeTest = 'Audit Logs Negative CodeJob Test';
    setNewTestHeadline(codeJobNegativeTest);

    const codeJobPositiveAsyncTest = 'Audit Logs Positive Async CodeJob Test';
    setNewTestHeadline(codeJobPositiveAsyncTest);

    const codeJobNegativeAsyncTest = 'Audit Logs Negative Async CodeJob Test';
    setNewTestHeadline(codeJobNegativeAsyncTest);

    //#endregion Test Config area

    //Do not use this function unless you know what it does.
    ///*//removeAllSchedulerCodeJobFromDistributor();*/

    //Print Test Results
    await Promise.all([
        //Sync Test
        await executeSyncTest(syncTest, testDataBodySyncTest),
        await executeSyncOldTest(syncOldTest, testDataBodySyncTest),
        await executeSyncOldTest(syncOldNegativeTest, testDataBodySyncTest),
        //These tests are for the old Sync Enpoint
        //The old Sync endpoint canceled at 17/01/2021 in PAPI version 9.5.378
        // createCodeJobUsingDraftTest(codeJobPositiveTest, testDataDraftToExecuteInPositiveTest).then(
        //     async (positiveCodeJobUUID) => {
        //         await executeDraftCodeJobTest(
        //             codeJobPositiveTest,
        //             positiveCodeJobUUID,
        //             testDataDraftToExecuteInPositiveTest,
        //             false,
        //         );
        //     },
        // ),
        // createCodeJobUsingDraftTest(codeJobNegativeTest, testDataDraftToExecuteInNegativeTest).then(
        //     async (negativeCodeJobUUID) => {
        //         //The response objects in case of exceptions for sync calls - changed in 06/11/2021
        //         // await executeDraftCodeJobTest(
        //         //     codeJobNegativeTest,
        //         //     negativeCodeJobUUID,
        //         //     testDataDraftToExecuteInNegativeTest,
        //         //     false,
        //         // );
        //         await generalService.papiClient
        //             .post('/code_jobs/' + negativeCodeJobUUID + '/execute_draft')
        //             .then((res) => {
        //                 addTestResultUnderHeadline(codeJobNegativeTest, 'Post execute CodeJobe with draft', res);
        //             })
        //             .catch((err) => {
        //                 if (
        //                     err.message.includes(
        //                         'execute_draft failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: orenTest","detail":{"errorcode":"InnerException"}}}',
        //                     )
        //                 ) {
        //                     addTestResultUnderHeadline(codeJobNegativeTest, 'Post execute CodeJobe with draft');
        //                 } else {
        //                     addTestResultUnderHeadline(
        //                         codeJobNegativeTest,
        //                         'Post execute CodeJobe with draft',
        //                         err.message,
        //                     );
        //                 }
        //             });
        //     },
        // ),
        //These tests are for the new Async Enpoint
        createCodeJobUsingDraftTest(codeJobPositiveAsyncTest, testDataDraftToExecuteInPositiveTest).then(
            async (positiveAsyncCodeJobUUID) => {
                await executeDraftCodeJobTest(
                    codeJobPositiveAsyncTest,
                    positiveAsyncCodeJobUUID,
                    testDataDraftToExecuteInPositiveTest,
                    true,
                );
            },
        ),
        createCodeJobUsingDraftTest(codeJobNegativeAsyncTest, testDataDraftToExecuteInNegativeTest).then(
            async (negativeAsyncCodeJobUUID) => {
                await executeDraftCodeJobTest(
                    codeJobNegativeAsyncTest,
                    negativeAsyncCodeJobUUID,
                    testDataDraftToExecuteInNegativeTest,
                    true,
                );
            },
        ),
    ]).then(() => printTestResults(describe, expect, it, 'Audit Logs'));

    //Test
    async function createCodeJobUsingDraftTest(testName, draftExecuteableCode) {
        let codeJobUUID;
        const updateValuesToDraftExecute = draftExecuteableCode;
        const UpdateApiResponse = await generalService.papiClient.post('/code_jobs', updateValuesToDraftExecute);
        if (UpdateApiResponse.UUID.length < 36) {
            addTestResultUnderHeadline(testName, 'Post CodeJobe with Draft', UpdateApiResponse);
        } else {
            codeJobUUID = UpdateApiResponse.UUID;
            addTestResultUnderHeadline(testName, 'Post CodeJobe with Draft');
        }
        return codeJobUUID;
    }

    //Test
    async function executeDraftCodeJobTest(testName, codeJobUUID, testDataBody, async) {
        //This can be used to test the Scheduler addon (3/3)
        //let phasedTest = await generalService.papiClient.post("/code_jobs/" + codeJobUUID + "/publish");
        let executeDraftCodeApiResponse;
        try {
            if (async) {
                executeDraftCodeApiResponse = await generalService.papiClient.post(
                    '/code_jobs/async/' + codeJobUUID + '/execute_draft',
                );
            } else {
                executeDraftCodeApiResponse = await generalService.papiClient.post(
                    '/code_jobs/' + codeJobUUID + '/execute_draft',
                );
            }
        } catch (error) {
            executeDraftCodeApiResponse = error;
        }
        //asyne is a new end point that was changed by Yossi in 07/06/2020 and for now it replace the old one

        console.log({ executeDraftCodeApiResponse: executeDraftCodeApiResponse });

        if (async) {
            if (executeDraftCodeApiResponse.ExecutionUUID.length > 36 || executeDraftCodeApiResponse.URI.length > 48) {
                addTestResultUnderHeadline(testName, 'Post execute CodeJobe with draft', executeDraftCodeApiResponse);
            } else {
                addTestResultUnderHeadline(testName, 'Post execute CodeJobe with draft');
            }
        } else {
            if (executeDraftCodeApiResponse.success === undefined) {
                addTestResultUnderHeadline(testName, 'Post execute CodeJobe with draft', executeDraftCodeApiResponse);
            } else {
                addTestResultUnderHeadline(testName, 'Post execute CodeJobe with draft');
            }
        }

        if (codeJobUUID != undefined) {
            let inetrvalLimit = 180000;
            const SetIntervalEvery = 6000;
            await new Promise((resolve) => {
                const getResultObjectInterval = setInterval(async () => {
                    inetrvalLimit -= SetIntervalEvery;
                    if (inetrvalLimit < 1) {
                        clearInterval(getResultObjectInterval);
                        await removeAllSchedulerCodeJobFromDistributor(codeJobUUID);
                        addTestResultUnderHeadline(testName, 'Audit Logs of Code Job - Interval Timer', false);
                        return resolve(null);
                    }
                    const getAuditLogURI =
                        "/audit_logs?Where=AuditInfo.JobMessageData.CodeJobUUID='" + codeJobUUID + "'";

                    let apiResponse;
                    try {
                        apiResponse = await generalService.papiClient.get(getAuditLogURI);
                    } catch (error) {
                        clearInterval(getResultObjectInterval);
                        apiResponse = error;
                        console.log({ getAuditLogApiResponse: apiResponse });

                        await removeAllSchedulerCodeJobFromDistributor(codeJobUUID);
                        addTestResultUnderHeadline(testName, 'Audit Logs of Code Job - Throwing Error: ', apiResponse);
                        return resolve(null);
                    }

                    if (JSON.stringify(apiResponse).includes('"ResultObject":')) {
                        clearInterval(getResultObjectInterval);
                        await removeAllSchedulerCodeJobFromDistributor(codeJobUUID);

                        //Print the API response
                        console.log({ Code_Job_Result_Object: apiResponse });

                        const codeJobResultObject = isExecuteDraftCodeJobValidResponse(apiResponse, testDataBody);
                        console.log('CodeJobResultObject return result: ' + codeJobResultObject);
                        addTestResultUnderHeadline(
                            testName,
                            'Execute Draft Code Job Valid Response',
                            codeJobResultObject,
                        );
                        const auditLogsResultObject = await generalService.getAuditLogResultObjectIfValid(
                            getAuditLogURI,
                        );

                        //Print the AuditLogs Result Object
                        console.log({ Code_Job_Audit_Logs_Object: auditLogsResultObject });

                        //Report test result
                        if (JSON.stringify(auditLogsResultObject).includes('AuditInfo')) {
                            addTestResultUnderHeadline(testName, 'Audit Logs of Draft Code Job Valid Response');
                        } else {
                            addTestResultUnderHeadline(
                                testName,
                                'Audit Logs of Draft Code Job Valid Response',
                                auditLogsResultObject,
                            );
                        }
                        resolve(null);
                    }
                }, SetIntervalEvery);
            });
        }

        //This can be use to easily extract the token to the console
        //console.log({Token : API._Token})
    }

    //Test
    async function executeSyncTest(testName, testDataBody) {
        let UpdateApiResponse = await generalService.papiClient.post('/application/sync', testDataBody);
        let syncJobUUID;
        let syncURI;
        const mandatoryStepsNewInproDoneObj = {
            //Status: "New" and ProgressPercentage: 0, are not mandatory
            //newSyncStatus: false,
            //newSyncProgressPercentage: false,
            inProgressSyncStatus: false,
            inProgressSyncProgressPercentage: false,
            doneSyncStatus: false,
            doneSyncProgressPercentage: false,
        };

        if (UpdateApiResponse.SyncJobUUID.length < 36) {
            addTestResultUnderHeadline(testName, 'Post Sync', UpdateApiResponse);
        } else {
            syncJobUUID = UpdateApiResponse.SyncJobUUID;
            syncURI = UpdateApiResponse.URI;
            addTestResultUnderHeadline(testName, 'Post Sync');
        }
        //Status: "New" and ProgressPercentage: 0, are not mandatory.
        // var newSyncAPIResponse = await generalService.papiClient.get(syncURI);
        //  addTestResultUnderHeadline(testName, "Get New Sync Status Test", newSyncAPIResponse.Status == "New" ? mandatoryStepsNewInproDoneObj.newSyncStatus = true : "Status is: " + newSyncAPIResponse.Status);
        //  addTestResultUnderHeadline(testName, "Get New Sync ProgressPercentage Test", newSyncAPIResponse.ProgressPercentage == 0 ? mandatoryStepsNewInproDoneObj.newSyncProgressPercentage = true : "ProgressPercentage is: " + newSyncAPIResponse.ProgressPercentage);
        // console.log({ Sync_Result_Object_New: newSyncAPIResponse });

        let newSyncAPIResponse = await generalService.papiClient.get(syncURI);

        //Not Mandatory - rarely happen in new sync 18/10/2020
        //  addTestResultUnderHeadline(
        //     testName,
        //     'Get New Audit Log Sync Status Test',
        //     newSyncAPIResponse.Status == 'New' as SyncStatus ? true : 'Status is: ' + newSyncAPIResponse.Status,
        // );

        //  addTestResultUnderHeadline(
        //     testName,
        //     'Get New Audit Log Sync ProgressPercentage Test',
        //     newSyncAPIResponse.ProgressPercentage >= 0
        //         ? true
        //         : 'ProgressPercentage is: ' + newSyncAPIResponse.ProgressPercentage,
        // );
        // console.log({ Audit_Log_Sync_Result_Object_New: newSyncAPIResponse });

        //If Sync already Done, try 5 times to get sync that is not done yet.
        if (newSyncAPIResponse.Status == ('Done' as SyncStatus)) {
            for (let index = 0; index < 5; index++) {
                UpdateApiResponse = await generalService.papiClient.post('/application/sync', testDataBody);
                syncURI = UpdateApiResponse.URI;
                newSyncAPIResponse = await generalService.papiClient.get(syncURI);
                if (newSyncAPIResponse.Status == ('Done' as SyncStatus)) {
                    index = 5;
                    break;
                }
            }
        }

        addTestResultUnderHeadline(
            testName,
            'Get Sync Status Test',
            newSyncAPIResponse.Status == ('SyncStart' as SyncStatus) ||
                newSyncAPIResponse.Status == ('New' as SyncStatus)
                ? (mandatoryStepsNewInproDoneObj.inProgressSyncStatus = true)
                : 'Status is: ' + newSyncAPIResponse.Status,
        );
        addTestResultUnderHeadline(
            testName,
            'Get Sync ProgressPercentage Test',
            newSyncAPIResponse.ProgressPercentage >= 0
                ? (mandatoryStepsNewInproDoneObj.inProgressSyncProgressPercentage = true)
                : 'ProgressPercentage is: ' + newSyncAPIResponse.ProgressPercentage,
        );
        console.log({ Sync_Result_Object_In_Progress: newSyncAPIResponse });

        if (syncJobUUID != undefined && syncURI != undefined) {
            let lastStatusStr = '';
            let inetrvalLimit = 180000;
            const SetIntervalEvery = 2000; //Intervals changed from 4000 to 100 since in some users 4000 is skipping the GetInProgress Audit Log
            await new Promise((resolve) => {
                const getResultObjectInterval = setInterval(async () => {
                    inetrvalLimit -= SetIntervalEvery;
                    if (inetrvalLimit < 1) {
                        clearInterval(getResultObjectInterval);
                        //Report test results
                        addTestResultUnderHeadline(testName, 'Audit Logs of Sync - Interval Timer', false);
                        return resolve(null);
                    }
                    const auditLogSyncResponse = await generalService.papiClient.get(syncURI);
                    if (JSON.stringify(auditLogSyncResponse).includes('"ProgressPercentage":')) {
                        if (lastStatusStr != auditLogSyncResponse.Status) {
                            lastStatusStr = auditLogSyncResponse.Status;
                            if (
                                auditLogSyncResponse.Status == ('Done' as SyncStatus) &&
                                auditLogSyncResponse.ProgressPercentage == 100
                            ) {
                                mandatoryStepsNewInproDoneObj.doneSyncStatus = true;
                                mandatoryStepsNewInproDoneObj.doneSyncProgressPercentage = true;
                                clearInterval(getResultObjectInterval);
                                console.log({ Sync_Result_Object_Done: auditLogSyncResponse });

                                //Status: "New" and ProgressPercentage: 0, are not mandatory.
                                if (
                                    /*mandatoryStepsNewInproDoneObj.newSyncStatus && mandatoryStepsNewInproDoneObj.newSyncProgressPercentage &&*/
                                    mandatoryStepsNewInproDoneObj.inProgressSyncStatus &&
                                    mandatoryStepsNewInproDoneObj.inProgressSyncProgressPercentage &&
                                    mandatoryStepsNewInproDoneObj.doneSyncStatus &&
                                    mandatoryStepsNewInproDoneObj.doneSyncProgressPercentage
                                ) {
                                    addTestResultUnderHeadline(testName, 'All Sync test mandatory steps complete');
                                } else {
                                    addTestResultUnderHeadline(
                                        testName,
                                        'All Sync test mandatory steps complete',
                                        mandatoryStepsNewInproDoneObj,
                                    );
                                }
                                //Report test results
                                if (JSON.stringify(auditLogSyncResponse).includes('ClientInfo')) {
                                    addTestResultUnderHeadline(testName, 'Audit Logs of Sync Valid Response');
                                } else {
                                    addTestResultUnderHeadline(
                                        testName,
                                        'Audit Logs of Sync Valid Response',
                                        auditLogSyncResponse,
                                    );
                                }
                                console.log({
                                    Audit_Log_Sync_Result_Object_Done: auditLogSyncResponse,
                                });
                                return resolve(null);
                            } else if (
                                JSON.stringify(auditLogSyncResponse).includes('SyncStart' as SyncStatus) ||
                                JSON.stringify(auditLogSyncResponse).includes('New' as SyncStatus)
                            ) {
                                console.log({ Sync_Result_Object_In_Progress: auditLogSyncResponse });
                            } else {
                                clearInterval(getResultObjectInterval);
                                console.log('SyncResultObject return');
                                console.log({ Sync_Result_Object_Is_Bugged: auditLogSyncResponse });

                                //Report test results
                                addTestResultUnderHeadline(
                                    testName,
                                    'Audit Logs of Sync Is not Done - Error: ',
                                    auditLogSyncResponse,
                                );
                                return resolve(null);
                            }
                        }
                    }
                }, SetIntervalEvery);
            });
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    async function executeSyncOldTest(testName, testDataBody) {
        let url;
        const installedCPIVersion = await generalService
            .getAddons({
                where: "AddonUUID='00000000-0000-0000-0000-000000abcdef'",
            })
            .then((addon) => addon[0].Version);
        console.log({ installedCPIVersion: installedCPIVersion });
        const server = await generalService.getClientData('Server');
        switch (server) {
            case 'prod':
                url = `https://cpapi.pepperi.com/${installedCPIVersion}/Agent3.svc/soap`;
                break;
            case 'eu':
                url = `https://eucpapi.pepperi.com/${installedCPIVersion}/Agent3.svc/soap`;
                break;
            case 'sandbox':
                url = `https://cpapi.staging.pepperi.com/${installedCPIVersion}/Agent3.svc/soap`;
                break;
            default:
                throw new Error(`Test can't run on the server: ${server}`);
        }

        let raw;
        if (testName.includes('Negative')) {
            raw =
                '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\r\n    <s:Header>\r\n        <h:AgentID xmlns:h="WrntyAgentClientDevice.BLL.Agent3">11442503</h:AgentID>\r\n        <h:ClientMachineID xmlns:h="WrntyAgentClientDevice.BLL.Agent3">OrenSyncTest</h:ClientMachineID>\r\n        <h:LastSyncTime xmlns:h="WrntyAgentClientDevice.BLL.Agent3">73747156750000</h:LastSyncTime>\r\n        <h:TimeZoneDiff xmlns:h="WrntyAgentClientDevice.BLL.Agent3">0</h:TimeZoneDiff>\r\n    </s:Header>\r\n    <s:Body>\r\n        <GetDataRequest xmlns="WrntyAgentClientDevice.BLL.Agent3"/>\r\n    </s:Body>\r\n</s:Envelope>';
        } else {
            raw =
                '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\r\n    <s:Header>\r\n        <h:AgentID xmlns:h="WrntyAgentClientDevice.BLL.Agent3">11442503</h:AgentID>\r\n        <h:ClientMachineID xmlns:h="WrntyAgentClientDevice.BLL.Agent3">OrenSyncTest</h:ClientMachineID>\r\n        <h:LastSyncTime xmlns:h="WrntyAgentClientDevice.BLL.Agent3">63747156750000</h:LastSyncTime>\r\n        <h:TimeZoneDiff xmlns:h="WrntyAgentClientDevice.BLL.Agent3">0</h:TimeZoneDiff>\r\n    </s:Header>\r\n    <s:Body>\r\n        <GetDataRequest xmlns="WrntyAgentClientDevice.BLL.Agent3"/>\r\n    </s:Body>\r\n</s:Envelope>';
        }

        const syncResponse = await fetch(url, {
            method: 'POST',
            headers: {
                SOAPAction: `WrntyAgentClientDevice.BLL.Agent3/IAgent3/GetData`,
                Expect: `100-continue`,
                'Content-Type': `text/xml; charset=utf-8`,
                ClientDBVersion: '16',
                ClientDBVersionMinor: '50',
                DeviceID: `${testDataBody.DeviceExternalID}`,
                SoftwareVersion: `${testDataBody.SoftwareVersion}`,
                SourceType: `${testDataBody.SourceType}`,
                SystemName: `${testDataBody.SystemName}`,
                Authorization: `Bearer ${generalService['client'].OAuthAccessToken}`,
            },
            body: raw,
            redirect: 'follow',
        })
            .then((response) => response.text())
            .then((result) => result)
            .catch((error) => error);

        if (testName.includes('Negative')) {
            addTestResultUnderHeadline(
                testName,
                'No Server Error',
                syncResponse.includes('/h:ServerError') ? syncResponse : true,
            );

            addTestResultUnderHeadline(
                testName,
                'No Sync FileName',
                syncResponse.includes('/h:FileName') ? syncResponse : true,
            );

            const Length = syncResponse
                .split('h:Length')[1]
                .slice(-5, -2)
                .replace(/[^0-9]/g, '');
            addTestResultUnderHeadline(testName, 'Get Sync Length', Length == 1 ? true : 'Length is: ' + Length);

            const Status = syncResponse.split('h:Status')[1];
            addTestResultUnderHeadline(
                testName,
                'Get Sync Status',
                Status.includes('NoDataToSent') ? true : 'Status is: ' + Status,
            );

            const GetDataResponse = syncResponse.split('GetDataResponse')[1];
            addTestResultUnderHeadline(
                testName,
                'Get Sync GetDataResponse',
                GetDataResponse.includes('IA==') ? true : 'Status is: ' + GetDataResponse,
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'No Server Error',
                syncResponse.includes('/h:ServerError') ? syncResponse : true,
            );

            const FileName = syncResponse.split('h:FileName')[1];
            addTestResultUnderHeadline(
                testName,
                'Get Sync FileName',
                FileName.includes('GetData.sqlite') ? true : 'FileName is: ' + FileName,
            );

            const Length = syncResponse
                .split('h:Length')[1]
                .slice(-10, -2)
                .replace(/[^0-9]/g, '');
            addTestResultUnderHeadline(testName, 'Get Sync Length', Length > 200 ? true : 'Length is: ' + Length);

            const Status = syncResponse.split('h:Status')[1];
            addTestResultUnderHeadline(
                testName,
                'Get Sync Status',
                Status.includes('DataSent') ? true : 'Status is: ' + Status,
            );

            const GetDataResponse = syncResponse.split('GetDataResponse')[1];
            addTestResultUnderHeadline(
                testName,
                'Get Sync GetDataResponse',
                GetDataResponse.length > 200 ? true : 'GetDataResponse is: ' + GetDataResponse,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Base Functions
    function isExecuteDraftCodeJobValidResponse(codeJobAPIResponse, testDataBody) {
        let tempObj = {} as any;
        if (codeJobAPIResponse[0] === undefined) {
            tempObj = codeJobAPIResponse.result;
        } else {
            tempObj = codeJobAPIResponse[0];
        }
        //Check UUID
        try {
            if (
                tempObj.DistributorUUID == tempObj.UUID ||
                tempObj.DistributorUUID == tempObj.Event.User.UUID ||
                tempObj.DistributorUUID == tempObj.AuditInfo.JobMessageData.CodeJobUUID ||
                tempObj.UUID == tempObj.Event.User.UUID ||
                tempObj.UUID == tempObj.AuditInfo.JobMessageData.CodeJobUUID ||
                tempObj.Event.User.UUID == tempObj.AuditInfo.JobMessageData.CodeJobUUID ||
                tempObj.UUID != tempObj.UUID ||
                tempObj.AuditInfo.JobMessageData.FunctionPath.split('/')[1] != tempObj.DistributorUUID ||
                tempObj.AuditInfo.JobMessageData.FunctionPath.split('/')[3] !=
                    tempObj.AuditInfo.JobMessageData.CodeJobUUID ||
                tempObj.Event.User.UUID != generalService.getClientData('UserUUID')
            ) {
                return 'Error in UUID in Code Job API Response';
            }
        } catch (e) {
            e.stack = 'UUID in Code Job API Response:\n' + e.stack;
            return e;
        }
        //Check Date and Time
        try {
            if (
                !tempObj.CreationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z') ||
                !tempObj.ModificationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z')
            ) {
                return 'Error in Date and Time in Code Job API Response';
            }
        } catch (e) {
            e.stack = 'Date and Time in Code Job API Response:\n' + e.stack;
            return e;
        }
        //Check Type and Event
        try {
            if (
                (tempObj.AuditType != 'action' && tempObj.AuditType != 'data') ||
                tempObj.Event.Type != 'code_job_execution' ||
                tempObj.Event.User.Email != generalService.getClientData('UserEmail') ||
                tempObj.Event.User.InternalID != generalService.getClientData('UserID') ||
                tempObj.Event.User.UUID != generalService.getClientData('UserUUID') ||
                tempObj.AuditInfo.JobMessageData.CodeJobName != testDataBody.CodeJobName ||
                tempObj.AuditInfo.JobMessageData.CodeJobDescription != testDataBody.Description
            ) {
                return 'The Type or Event contain wrong data';
            }
        } catch (e) {
            e.stack = 'Type and Event in Code Job API Response:\n' + e.stack;
            return e;
        }
        //Check Result Object
        try {
            //Verify that ErrorMessage exist
            if (tempObj.AuditInfo.ErrorMessage != undefined) {
                //Old apy was tempObj.AuditInfo.ResultObject.toString().includes("ERROR")
                //Old apy was tempObj.AuditInfo.ResultObject.toString().includes("Error") //Changed in 26/07 investigated with nofar
                if (tempObj.AuditInfo.ErrorMessage.includes('Failed') ^ testDataBody.DraftCode.includes('Error')) {
                    return 'Error in execution result';
                }
            }
        } catch (e) {
            e.stack = 'Draft Code Error in Code Job API Response:\n' + e.stack;
            return e;
        }
        return true;
    }

    //Function to remove all the Scheduler Code Jobs from Distributor
    async function removeAllSchedulerCodeJobFromDistributor(codeJobUUID?: string) {
        //codeJobUUID = undefined;
        //for (var index = 100; index > 0; index--) {
        let getAllCodeJobs = [] as any;
        if (codeJobUUID == undefined) {
            getAllCodeJobs = await generalService.papiClient.get('/code_jobs?Fields=UUID');
        } else {
            getAllCodeJobs.push({ UUID: codeJobUUID });
        }
        // if (getAllCodeJobs.length == 0) {
        //     break;
        // }
        for (let i = 0; i < getAllCodeJobs.length; i++) {
            const codeJobObject = {
                CodeJobIsHidden: true,
                UUID: getAllCodeJobs[i].UUID,
                IsScheduled: false,
            };
            await fetch(generalService['client'].BaseURL + '/code_jobs', {
                method: 'POST',
                body: JSON.stringify(codeJobObject),
                headers: {
                    Authorization: `Bearer ${generalService['client'].OAuthAccessToken}`,
                    //X-Pepperi-OwnerID is the ID of the Addon
                    'X-Pepperi-OwnerID': '9b00d684-4615-4293-9727-63da81802a8d',
                },
            });

            console.log(i);
            console.log(JSON.stringify(codeJobObject.UUID));
            if (getAllCodeJobs.length == 1) {
                i = 0;
                break;
            }
        }
    }
}
