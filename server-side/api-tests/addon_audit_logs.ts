import GeneralService, { TesterFunctions } from '../services/general.service';

interface TestResults {
    Name: string;
    Results: any[];
}

// All Fields Tests
export async function AddonAuditLogsTests(generalService: GeneralService, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Prerequisites for Audit Logs Tests
    //TestData
    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const jsFileName = 'test.js';
    const functionNamePositiveTest = 'PositiveTest';
    const version = '0.0.5';
    const functionNameNegativeTest = 'NegativeTest';

    const testDataAddonJobToExecuteInPositiveTest = {
        UUID: '',
        CodeJobName: 'New CodeJob with addon code for Audit Logs Positive Test',
        Description: 'Execute Job Using Addon Code',
        //This can be used to test the Scheduler addon (1/3)
        // "CodeJobName": "004" + "  Published no Sceduled Positive",
        // "Description": "Published no Sceduled",
        Type: 'AddonJob',
        AddonPath: jsFileName,
        AddonUUID: addonUUID,
        FunctionName: functionNamePositiveTest,
        Owner: '',
        CronExpression: '0/20 * 1/1 * *', //Every 20   minutes
        NextRunTime: null,
        IsScheduled: false,
        FailureAlertEmailTo: ['qa@pepperi.com'],
        FailureAlertEmailSubject: 'Execution section',
        ExecutedCode: '',
        CodeJobIsHidden: false,
        CreationDateTime: '',
        ModificationDateTime: '',
        ExecutionMemoryLevel: 4,
        NumberOfTries: 1,
    };

    const testDataAddonJobToExecuteInNegativeTest = {
        UUID: '',
        CodeJobName: 'New CodeJob with addon code for Audit Logs Negative Test',
        Description: 'Fail to Execute Job Using Addon Code',
        //This can be used to test the Scheduler addon (2/3)
        // "CodeJobName": "004" + " Published no Sceduled Negative",
        // "Description": "Published no Sceduled",
        Type: 'AddonJob',
        AddonPath: jsFileName,
        AddonUUID: addonUUID,
        FunctionName: functionNameNegativeTest,
        Owner: '',
        CronExpression: '0/20 * 1/1 * *', //Every 20 minutes
        NextRunTime: null,
        IsScheduled: false,
        FailureAlertEmailTo: ['qa@pepperi.com'],
        FailureAlertEmailSubject: 'Execution section',
        ExecutedCode: '',
        CreationDateTime: '',
        ModificationDateTime: '',
        ExecutionMemoryLevel: 4,
        NumberOfTries: 1,
    };

    //#region Upgrade Pepperitest (Jenkins Special Addon)
    const testData = {
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, version],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeToAnyAvailableVersion(testData);
    //#endregion Upgrade Pepperitest (Jenkins Special Addon)

    //Print Test Results
    describe('Addon Audit Logs Tests Suites', async () => {
        describe('Prerequisites Addon for Addon Audit Logs Tests', () => {
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

        describe('Audit Logs Positive Async CodeJob Test', async () => {
            let positiveAsyncCodeJobUUID;
            let executeTestResults;

            it(`Post CodeJob with AddonJob`, async () => {
                const updateApiResponse = await createCodeJobUsingAddonJobTest(testDataAddonJobToExecuteInPositiveTest);
                positiveAsyncCodeJobUUID = updateApiResponse.UUID;
                expect(positiveAsyncCodeJobUUID.length).to.equal(36);
            });

            it(`Post execute CodeJob with AddonJob`, async () => {
                executeTestResults = await executeAddonJobCodeJobTest(
                    positiveAsyncCodeJobUUID,
                    testDataAddonJobToExecuteInPositiveTest,
                );
                let testExist = false;
                for (let i = 0; i < executeTestResults.length; i++) {
                    if (executeTestResults[i].Name == 'Post execute CodeJob with AddonJob') {
                        testExist = true;
                        expect(executeTestResults[i].Results[0].ExecutionUUID.length).to.equal(36);
                        expect(executeTestResults[i].Results[0].URI.length).to.equal(48);
                    }
                }
                expect(testExist, JSON.stringify(executeTestResults)).to.be.true;
            });

            it(`Audit Logs of Code Job - Interval Timer`, async () => {
                for (let i = 0; i < executeTestResults.length; i++) {
                    if (executeTestResults[i].Name == 'Audit Logs of Code Job - Interval Timer') {
                        expect.fail(`Test end without timout, Results: ${JSON.stringify(executeTestResults)}`);
                    }
                }
            });

            it(`Execute AddonJob Code Job Valid Response`, async () => {
                debugger;
                let testExist = false;
                for (let i = 0; i < executeTestResults.length; i++) {
                    if (executeTestResults[i].Name == 'Execute AddonJob Code Job Valid Response') {
                        testExist = true;
                        expect(executeTestResults[i].Results[0], JSON.stringify(executeTestResults)).to.be.true;
                    }
                }
                expect(testExist, JSON.stringify(executeTestResults)).to.be.true;
            });

            it(`Audit Logs of AddonJob Code Job Valid Response`, async () => {
                let testExist = false;
                for (let i = 0; i < executeTestResults.length; i++) {
                    if (executeTestResults[i].Name == 'Audit Logs of AddonJob Code Job Valid Response') {
                        testExist = true;
                        expect(
                            executeTestResults[i].Results[0].AuditInfo.ResultObject,
                            JSON.stringify(executeTestResults),
                        ).to.include('success":true');
                    }
                }
                expect(testExist, JSON.stringify(executeTestResults)).to.be.true;
            });
        });

        describe('Audit Logs Negative Async CodeJob Test', async () => {
            let positiveAsyncCodeJobUUID;
            let executeTestResults;

            it(`Post CodeJob with AddonJob`, async () => {
                const updateApiResponse = await createCodeJobUsingAddonJobTest(testDataAddonJobToExecuteInNegativeTest);
                positiveAsyncCodeJobUUID = updateApiResponse.UUID;
                expect(positiveAsyncCodeJobUUID.length).to.equal(36);
            });

            it(`Post execute CodeJob with AddonJob`, async () => {
                executeTestResults = await executeAddonJobCodeJobTest(
                    positiveAsyncCodeJobUUID,
                    testDataAddonJobToExecuteInNegativeTest,
                );
                let testExist = false;
                for (let i = 0; i < executeTestResults.length; i++) {
                    if (executeTestResults[i].Name == 'Post execute CodeJob with AddonJob') {
                        testExist = true;
                        expect(executeTestResults[i].Results[0].ExecutionUUID.length).to.equal(36);
                        expect(executeTestResults[i].Results[0].URI.length).to.equal(48);
                    }
                }
                expect(testExist, JSON.stringify(executeTestResults)).to.be.true;
            });

            it(`Audit Logs of Code Job - Interval Timer`, async () => {
                for (let i = 0; i < executeTestResults.length; i++) {
                    if (executeTestResults[i].Name == 'Audit Logs of Code Job - Interval Timer') {
                        expect.fail(`Test end without timout, Results: ${JSON.stringify(executeTestResults)}`);
                    }
                }
            });

            it(`Execute AddonJob Code Job Valid Response`, async () => {
                let testExist = false;
                for (let i = 0; i < executeTestResults.length; i++) {
                    if (executeTestResults[i].Name == 'Execute AddonJob Code Job Valid Response') {
                        testExist = true;
                        expect(executeTestResults[i].Results[0], JSON.stringify(executeTestResults)).to.be.true;
                    }
                }
                expect(testExist, JSON.stringify(executeTestResults)).to.be.true;
            });

            it(`Audit Logs of AddonJob Code Job Valid Response`, async () => {
                let testExist = false;
                for (let i = 0; i < executeTestResults.length; i++) {
                    if (executeTestResults[i].Name == 'Audit Logs of AddonJob Code Job Valid Response') {
                        testExist = true;
                        expect(
                            executeTestResults[i].Results[0].AuditInfo.ResultObject,
                            JSON.stringify(executeTestResults),
                        ).to.include('Failed due to exception: orenTest');
                    }
                }
                expect(testExist, JSON.stringify(executeTestResults)).to.be.true;
            });
        });

        //Test
        async function createCodeJobUsingAddonJobTest(AddonJobExecuteableCode) {
            const updateValuesToAddonJobExecute = {
                Description: AddonJobExecuteableCode.Description,
                CodeJobName: AddonJobExecuteableCode.CodeJobName,
                Type: AddonJobExecuteableCode.Type,
                AddonPath: AddonJobExecuteableCode.AddonPath,
                AddonUUID: AddonJobExecuteableCode.AddonUUID,
                FunctionName: AddonJobExecuteableCode.FunctionName,
            };
            return await generalService.papiClient.post('/code_jobs', updateValuesToAddonJobExecute);
        }

        //Test
        async function executeAddonJobCodeJobTest(codeJobUUID, testDataBody) {
            const executeResultData: TestResults[] = [];
            //This can be used to test the Scheduler addon (3/3)
            //let phasedTest = await generalService.papiClient.post("/code_jobs/" + codeJobUUID + "/publish");
            let executeAddonJobCodeApiResponse;
            try {
                executeAddonJobCodeApiResponse = await generalService.papiClient.post(
                    '/code_jobs/async/' + codeJobUUID + '/execute',
                );
            } catch (error) {
                executeAddonJobCodeApiResponse = error;
            }

            console.log({ executeAddonJobCodeApiResponse: executeAddonJobCodeApiResponse });

            executeResultData.push({
                Name: 'Post execute CodeJob with AddonJob',
                Results: [executeAddonJobCodeApiResponse],
            });

            if (codeJobUUID != undefined) {
                let inetrvalLimit = 180000;
                const SetIntervalEvery = 6000;
                return await new Promise((resolve) => {
                    const getResultObjectInterval = setInterval(async () => {
                        inetrvalLimit -= SetIntervalEvery;
                        if (inetrvalLimit < 1) {
                            clearInterval(getResultObjectInterval);
                            await removeAllSchedulerCodeJobFromDistributor(codeJobUUID);
                            executeResultData.push({
                                Name: 'Audit Logs of Code Job - Interval Timer',
                                Results: [false],
                            });
                            return resolve(executeResultData);
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
                            executeResultData.push({ Name: 'Audit Logs of Code Job - Error', Results: [apiResponse] });

                            return resolve(executeResultData);
                        }

                        if (JSON.stringify(apiResponse).includes('"ResultObject":')) {
                            clearInterval(getResultObjectInterval);
                            await removeAllSchedulerCodeJobFromDistributor(codeJobUUID);

                            //Print the API response
                            console.log({ Code_Job_Result_Object: apiResponse });

                            const codeJobResultObject = isExecuteAddonJobCodeJobValidResponse(
                                apiResponse,
                                testDataBody,
                            );
                            console.log('CodeJobResultObject return result: ' + codeJobResultObject);
                            executeResultData.push({
                                Name: 'Execute AddonJob Code Job Valid Response',
                                Results: [codeJobResultObject],
                            });

                            const auditLogsResultObject = await generalService.getAuditLogResultObjectIfValid(
                                getAuditLogURI,
                            );

                            //Print the AuditLogs Result Object
                            console.log({ Code_Job_Audit_Logs_Object: auditLogsResultObject });

                            //Report test result
                            executeResultData.push({
                                Name: 'Audit Logs of AddonJob Code Job Valid Response',
                                Results: [auditLogsResultObject],
                            });
                            resolve(executeResultData);
                        }
                    }, SetIntervalEvery);
                });
            }

            //This can be use to easily extract the token to the console
            //console.log({Token : API._Token})
        }

        //Base Functions
        function isExecuteAddonJobCodeJobValidResponse(codeJobAPIResponse, testDataBody) {
            debugger;
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
                    tempObj.AuditInfo.JobMessageData.FunctionPath.split('/')[2] == tempObj.DistributorUUID ||
                    tempObj.AuditInfo.JobMessageData.FunctionPath.split('/')[2] ==
                    tempObj.AuditInfo.JobMessageData.CodeJobUUID ||
                    tempObj.Event.User.UUID != generalService.getClientData('UserUUID')
                ) {
                    return 'Error in UUID in Code Job API Response';
                }
            } catch (error) {
                if (error instanceof Error) {
                    error.stack = 'UUID in Code Job API Response:\n' + error.stack;
                }
                return error;
            }
            //Check Date and Time
            try {
                if (
                    !tempObj.CreationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z') ||
                    !tempObj.ModificationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z')
                ) {
                    return 'Error in Date and Time in Code Job API Response';
                }
            } catch (error) {
                if (error instanceof Error) {
                    error.stack = 'Date and Time in Code Job API Response:\n' + error.stack;
                }
                return error;
            }
            //Check Type and Event
            try {
                debugger;
                if (
                    (tempObj.AuditType != 'action' && tempObj.AuditType != 'action') ||
                    tempObj.Event.Type != 'addon_job_execution' ||
                    tempObj.Event.User.Email != generalService.getClientData('UserEmail') ||
                    tempObj.Event.User.InternalID != generalService.getClientData('UserID') ||
                    tempObj.Event.User.UUID != generalService.getClientData('UserUUID') ||
                    tempObj.AuditInfo.JobMessageData.CodeJobName != testDataBody.CodeJobName ||
                    tempObj.AuditInfo.JobMessageData.CodeJobDescription != testDataBody.Description
                ) {
                    return 'The Type or Event contain wrong data';
                }
            } catch (error) {
                if (error instanceof Error) {
                    error.stack = 'Type and Event in Code Job API Response:\n' + error.stack;
                }
                return error;
            }
            //Check Result Object
            try {
                //Verify that ErrorMessage exist
                if (tempObj.AuditInfo.ErrorMessage != undefined) {
                    //Old apy was tempObj.AuditInfo.ResultObject.toString().includes("ERROR")
                    //Old apy was tempObj.AuditInfo.ResultObject.toString().includes("Error") //Changed in 26/07 investigated with nofar
                    if (
                        tempObj.AuditInfo.ErrorMessage.includes('Failed') ^
                        testDataBody.FunctionName.includes('Negative')
                    ) {
                        return 'Error in execution result';
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    error.stack = 'AddonJob Code Error in Code Job API Response:\n' + error.stack;
                }
                return error;
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
                await generalService.fetchStatus(generalService['client'].BaseURL + '/code_jobs', {
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
    });
}
