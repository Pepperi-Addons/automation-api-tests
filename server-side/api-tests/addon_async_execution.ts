import GeneralService, { TesterFunctions } from '../services/general.service';

interface TestResults {
    Name: string;
    Results: any[];
}

// All Fields Tests
export async function AddonAsyncExecutionTests(generalService: GeneralService, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Prerequisites for Addon Async Execution Tests
    //TestData
    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';

    //#region Upgrade Pepperitest (Jenkins Special Addon)
    const testData = {
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, '0.0.5'],
        AsyncAddon: ['00000000-0000-0000-0000-0000000a594c', '1.0.51'],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeToAnyAvailableVersion(testData);
    //#endregion Upgrade Pepperitest (Jenkins Special Addon)

    //Print Test Results
    describe('Addon Addon Async Execution Tests Suites', async () => {
        describe('Prerequisites Addon for Addon Async Execution Tests', () => {
            //Test Data
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

        describe('Async Execution Audit Logs Positive Async CodeJob Test', async () => {
            let executeTestResults;
            let testAuditUUID;
            let testAuditURI;
            let auditLogBody;
            let adalLogBody;

            it(`Execute CodeJob with AddonJob`, async () => {
                executeTestResults = await executeAddonJobCodeJobTest(addonUUID, 'PositiveTest');

                let testExist = false;
                for (let i = 0; i < executeTestResults.length; i++) {
                    if (executeTestResults[i].Name == 'Post execute CodeJob with AddonJob') {
                        testExist = true;
                        testAuditUUID = executeTestResults[i].Results[0].ExecutionUUID;
                        testAuditURI = executeTestResults[i].Results[0].URI;
                        expect(executeTestResults[i].Results[0].ExecutionUUID.length).to.equal(36);
                        expect(executeTestResults[i].Results[0].URI.length).to.equal(48);
                    }
                }
                expect(testExist, JSON.stringify(executeTestResults)).to.be.true;
            });

            it(`Audit Logs of Async Execution - Interval Timer`, async () => {
                for (let i = 0; i < executeTestResults.length; i++) {
                    if (executeTestResults[i].Name == 'Audit Logs of Async Execution - Interval Timer') {
                        expect.fail(`Test end without timout, Results: ${JSON.stringify(executeTestResults)}`);
                    }
                }
            });

            it(`Execute AddonJob Code Job Valid Response (DI-19153)`, async () => {
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

            it(`Get Audit Log And Adal Data`, async () => {
                auditLogBody = await generalService.papiClient.get(testAuditURI);
                adalLogBody = await generalService.papiClient.addons.data
                    .uuid(testData.AsyncAddon[0])
                    .table('actions')
                    .key(testAuditUUID)
                    .get();
                expect(auditLogBody.UUID == adalLogBody.Key);
            });

            it(`Validae Audit Log And Adal Pass`, async () => {
                expect(auditLogBody.Status.Name).to.equal('Success');
                expect(adalLogBody.Status).to.equal('Success');
            });

            it(`Validae Audit Log And Adal Result Object`, async () => {
                expect(auditLogBody.AuditInfo.ResultObject).to.equal(
                    '{"success":true,"errorMessage":"test msg","resultObject":{"multiplyResult":8}}',
                );
                expect(adalLogBody.ResultObject).to.equal(
                    '{"success":true,"errorMessage":"test msg","resultObject":{"multiplyResult":8}}',
                );
            });
        });

        describe('Audit Logs Negative Async CodeJob Test', async () => {
            let executeTestResults;
            let testAuditUUID;
            let testAuditURI;
            let auditLogBody;
            let adalLogBody;

            it(`Post execute CodeJob with AddonJob`, async () => {
                executeTestResults = await executeAddonJobCodeJobTest(addonUUID, 'NegativeTest');

                let testExist = false;
                for (let i = 0; i < executeTestResults.length; i++) {
                    if (executeTestResults[i].Name == 'Post execute CodeJob with AddonJob') {
                        testExist = true;
                        testAuditUUID = executeTestResults[i].Results[0].ExecutionUUID;
                        testAuditURI = executeTestResults[i].Results[0].URI;
                        expect(executeTestResults[i].Results[0].ExecutionUUID.length).to.equal(36);
                        expect(executeTestResults[i].Results[0].URI.length).to.equal(48);
                    }
                }
                expect(testExist, JSON.stringify(executeTestResults)).to.be.true;
            });

            it(`Audit Logs of Async Execution - Interval Timer`, async () => {
                for (let i = 0; i < executeTestResults.length; i++) {
                    if (executeTestResults[i].Name == 'Audit Logs of Async Execution - Interval Timer') {
                        expect.fail(`Test end without timout, Results: ${JSON.stringify(executeTestResults)}`);
                    }
                }
            });

            it(`Execute AddonJob Code Job Valid Response (DI-19153)`, async () => {
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

            it(`Get Audit Log And Adal Data`, async () => {
                auditLogBody = await generalService.papiClient.get(testAuditURI);
                adalLogBody = await generalService.papiClient.addons.data
                    .uuid(testData.AsyncAddon[0])
                    .table('actions')
                    .key(testAuditUUID)
                    .get();
                expect(auditLogBody.UUID == adalLogBody.Key);
            });

            it(`Validae Audit Log And Adal Pass`, async () => {
                expect(auditLogBody.Status.Name).to.equal('Failure');
                expect(adalLogBody.Status).to.equal('Failure');
            });

            it(`Validae Audit Log And Adal Result Object`, async () => {
                expect(auditLogBody.AuditInfo.ResultObject).to.equal(
                    '{"success":"Exception","errorMessage":"Failed due to exception: orenTest","resultObject":null}',
                );
                expect(adalLogBody.ResultObject).to.equal(
                    '{"success":"Exception","errorMessage":"Failed due to exception: orenTest","resultObject":null}',
                );
            });
        });

        //Test
        async function executeAddonJobCodeJobTest(codeJobUUID, executeFunction) {
            const executeResultData: TestResults[] = [];
            //This can be used to test the Scheduler addon (3/3)
            //let phasedTest = await generalService.papiClient.post("/code_jobs/" + codeJobUUID + "/publish");
            let executeAddonJobCodeApiResponse;
            try {
                executeAddonJobCodeApiResponse = await generalService.papiClient.post(
                    `/addons/api/async/${codeJobUUID}/test/${executeFunction}`,
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
                                Name: 'Audit Logs of Async Execution - Interval Timer',
                                Results: [false],
                            });
                            return resolve(executeResultData);
                        }
                        const getAuditLogURI = executeAddonJobCodeApiResponse.URI;

                        let apiResponse;
                        try {
                            apiResponse = await generalService.papiClient.get(getAuditLogURI);
                        } catch (error) {
                            clearInterval(getResultObjectInterval);
                            apiResponse = error;
                            console.log({ getAuditLogApiResponse: apiResponse });

                            await removeAllSchedulerCodeJobFromDistributor(codeJobUUID);
                            executeResultData.push({
                                Name: 'Audit Logs of Async Execution - Error',
                                Results: [apiResponse],
                            });

                            return resolve(executeResultData);
                        }

                        if (JSON.stringify(apiResponse).includes('"ResultObject":')) {
                            clearInterval(getResultObjectInterval);
                            await removeAllSchedulerCodeJobFromDistributor(codeJobUUID);

                            //Print the API response
                            console.log({ Code_Job_Result_Object: apiResponse });

                            const codeJobResultObject = isExecuteAddonJobCodeJobValidResponse(
                                apiResponse,
                                executeFunction,
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
            let tempObj = {} as any;
            if (codeJobAPIResponse[0] === undefined) {
                if (codeJobAPIResponse.result) {
                    tempObj = codeJobAPIResponse.result;
                } else {
                    tempObj = codeJobAPIResponse;
                }
            } else {
                tempObj = codeJobAPIResponse[0];
            }
            //Check UUID
            try {
                if (
                    tempObj.DistributorUUID != tempObj.AuditInfo.JobMessageData.DistributorUUID ||
                    tempObj.DistributorUUID == tempObj.UUID ||
                    tempObj.DistributorUUID == tempObj.Event.User.UUID ||
                    tempObj.DistributorUUID == tempObj.AuditInfo.JobMessageData.UserUUID ||
                    tempObj.UUID == tempObj.Event.User.UUID ||
                    tempObj.Event.User.UUID != tempObj.AuditInfo.JobMessageData.UserUUID ||
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
                if (
                    (tempObj.AuditType != 'action' && tempObj.AuditType != 'action') ||
                    tempObj.Event.Type != 'addon_job_execution' ||
                    tempObj.Event.User.Email != generalService.getClientData('UserEmail') ||
                    tempObj.Event.User.InternalID != generalService.getClientData('UserID') ||
                    tempObj.Event.User.UUID != generalService.getClientData('UserUUID') ||
                    tempObj.AuditInfo.JobMessageData.FunctionName != testDataBody
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
                    if (tempObj.AuditInfo.ErrorMessage.includes('Failed') ^ testDataBody.includes('Negative')) {
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
