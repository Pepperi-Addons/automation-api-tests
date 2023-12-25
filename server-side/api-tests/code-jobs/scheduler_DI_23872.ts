import { expect } from 'chai';
import GeneralService, { TesterFunctions } from '../../services/general.service';

export async function SchedulerTester_Part2(generalService: GeneralService, request, tester: TesterFunctions) {
    await SchedulerTests_Part2(generalService, request, tester);
}

export async function SchedulerTests_Part2(generalService: GeneralService, request, tester: TesterFunctions) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const it = tester.it;

    const CallbackCash: any = {};
    let CodeJobBody: any = {};
    let CodeJobUUIDCron;
    let codeJobExecuteResponse;

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
    const jsFileName = 'test.js';
    const functionNamecreateNewCodeJobRetryTest = 'createNewCodeJobRetryTest';
    const version = '0.0.4';

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
            it(`1. Validate Testing Addon Is Installed`, async () => {
                await generalService.fetchStatus('/addons/installed_addons/' + addonUUID + '/install' + '/' + version, {
                    method: 'POST',
                });
                //#region Upgrade Pepperitest (Jenkins Special Addon)
                const testData = {
                    'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, version],
                };
                CallbackCash.installAddonToDist = await generalService.changeToAnyAvailableVersion(testData);
                expect(CallbackCash.installAddonToDist['Pepperitest (Jenkins Special Addon) - Code Jobs'][1]).to.equal(
                    version,
                );
                await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                    .eventually.to.have.property('Version')
                    .a('string')
                    .that.is.equal(version);
                const installedVersion = await (
                    await generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get()
                ).Version;
                console.log(`installed version ${installedVersion} of testing addon ${addonUUID}`);
            });
            it(`2. Create A Job Based On Pepperitest Addon Version 0.0.4 - Not Schesuled With 10 Retries`, async () => {
                CodeJobBody = {
                    UUID: '',
                    CodeJobName: 'New CodeJob with IsScheduled true',
                    Description: 'Cron verification',
                    Owner: '',
                    CronExpression: '',
                    NextRunTime: null,
                    IsScheduled: false,
                    Type: 'AddonJob',
                    CodeJobIsHidden: false,
                    CreationDateTime: '',
                    ModificationDateTime: '',
                    ExecutionMemoryLevel: 1,
                    NumberOfTries: 10,
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
                expect(CallbackCash.insertNewCJtoCronVerification.CodeJobName).to.equal(CodeJobBody.CodeJobName);
                expect(codeJobResponse.CodeJobIsHidden).to.equal(CodeJobBody.CodeJobIsHidden);
                expect(codeJobResponse.IsScheduled).to.equal(CodeJobBody.IsScheduled);
                expect(codeJobResponse.CronExpression).to.equal(CodeJobBody.CronExpression);
                expect(codeJobResponse.NumberOfTries).to.equal(CodeJobBody.NumberOfTries);
                CodeJobUUIDCron = CallbackCash.insertNewCJtoCronVerification.UUID;
            });
            it(`3. Excute The  Job`, async () => {
                codeJobExecuteResponse = (
                    await generalService.fetchStatus(
                        '/code_jobs/async/' + CallbackCash.insertNewCJtoCronVerification.UUID + '/execute',
                        {
                            method: 'POST',
                            body: JSON.stringify({}),
                        },
                    )
                ).Body;
                expect(codeJobExecuteResponse).to.haveOwnProperty('URI');
                expect(codeJobExecuteResponse).to.haveOwnProperty('ExecutionUUID');
                console.log(
                    `got execution uuid for async run on job ${CallbackCash.insertNewCJtoCronVerification.UUID}: ${codeJobExecuteResponse.ExecutionUUID}`,
                );
            });
            it(`4. See It Returns A Run Entry On Audit Log - Poll Untill Its Status Is 4 => InRetry`, async () => {
                let codeJobResponse = await generalService.fetchStatus(
                    '/audit_logs/' + codeJobExecuteResponse.ExecutionUUID,
                    { method: 'GET' },
                );
                while (codeJobResponse.Body.Status.ID !== 4) {
                    generalService.sleep(1000);
                    codeJobResponse = await generalService.fetchStatus(
                        '/audit_logs/' + codeJobExecuteResponse.ExecutionUUID,
                        { method: 'GET' },
                    );
                }
                expect(codeJobResponse.Body.Status.ID).to.equal(4);
                expect(codeJobResponse.Body.Status.Name).to.equal('InRetry');
                expect(codeJobResponse.Body.AuditInfo.JobMessageData.NumberOfTry).to.equal(2);
                expect(codeJobResponse.Body.AuditInfo.JobMessageData.NumberOfTries).to.equal(10);
                expect(JSON.parse(codeJobResponse.Body.AuditInfo.ResultObject).errorMessage).to.equal(
                    'Failed due to exception: Nofar Test',
                );
            });
            it(`4. Stop The Code Job And Get It To See That: numOfTry = numOfTries+1`, async () => {
                const bodyToSend = { KeyList: [CodeJobUUIDCron] };
                const codeJobResponse = await generalService.fetchStatus('/addons/jobs/stop', {
                    method: 'POST',
                    body: JSON.stringify(bodyToSend),
                });
                expect(codeJobResponse.Ok).to.equal(true);
                expect(codeJobResponse.Status).to.equal(200);
                expect(codeJobResponse.Body).to.deep.equal({});
                const codeJobGet = await service.auditLogs.find({
                    where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
                });
                expect(codeJobGet[0].AuditInfo.JobMessageData.NumberOfTry).to.equal(
                    codeJobGet[0].AuditInfo.JobMessageData.NumberOfTries + 1,
                );
            });
            it(`5. Wait For 3 Minutes - And See The Job Execution Is 'Frozen'`, async () => {
                generalService.sleep(180000);
                const codeJobResponse = await service.auditLogs.find({
                    where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
                });
                expect(codeJobResponse.length).to.equal(1);
                expect((codeJobResponse[0] as any).Status.ID).to.equal(4);
                expect((codeJobResponse[0] as any).Status.Name).to.equal('InRetry');
                expect((codeJobResponse[0] as any).AuditInfo.JobMessageData.NumberOfTry).to.equal(2);
                expect((codeJobResponse[0] as any).AuditInfo.JobMessageData.NumberOfTries).to.equal(10);
                expect(JSON.parse((codeJobResponse[0] as any).AuditInfo.ResultObject).errorMessage).to.equal(
                    'Failed due to exception: Nofar Test',
                );
            });
            it(`6. Call Restart On This Job`, async () => {
                const bodyToSend = { KeyList: [CodeJobUUIDCron] };
                const codeJobResponse = await generalService.fetchStatus('/addons/jobs/restart', {
                    method: 'POST',
                    body: JSON.stringify(bodyToSend),
                });
                expect(codeJobResponse.Ok).to.equal(true);
                expect(codeJobResponse.Status).to.equal(200);
                expect(codeJobResponse.Body).to.deep.equal({});
            });
            it(`7. Wait For 2 Minutes & See The Job Is Back Running`, async () => {
                generalService.sleep(160000);
                CallbackCash.ResponseEmptyExecutedLogsCronTest = await service.auditLogs.find({
                    where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
                });
                expect(
                    CallbackCash.ResponseEmptyExecutedLogsCronTest[0].AuditInfo.JobMessageData.NumberOfTry,
                ).to.be.above(2);
                const prevNumOfTry =
                    CallbackCash.ResponseEmptyExecutedLogsCronTest[0].AuditInfo.JobMessageData.NumberOfTry;
                generalService.sleep(160000);
                CallbackCash.ResponseEmptyExecutedLogsCronTest = await service.auditLogs.find({
                    where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
                });
                expect(
                    CallbackCash.ResponseEmptyExecutedLogsCronTest[0].AuditInfo.JobMessageData.NumberOfTry,
                ).to.be.above(prevNumOfTry);
            });
            it(`8. Hide The Specific Code Job`, async () => {
                CodeJobBody = {
                    UUID: CodeJobUUIDCron,
                    CodeJobIsHidden: true,
                };
                CallbackCash.updateCronToChroneTestIsScheduledFalse = await generalService.fetchStatus('/code_jobs', {
                    method: 'POST',
                    body: JSON.stringify(CodeJobBody),
                });
                expect(CallbackCash.updateCronToChroneTestIsScheduledFalse.Status).to.equal(200);
                expect(CallbackCash.updateCronToChroneTestIsScheduledFalse.Ok).to.equal(true);
                expect(CallbackCash.updateCronToChroneTestIsScheduledFalse.Body.UUID).to.equal(CodeJobUUIDCron);
                expect(CallbackCash.updateCronToChroneTestIsScheduledFalse.Body.CodeJobIsHidden).to.equal(true);
                // const allCodeJobs = await generalService.fetchStatus('/code_jobs?page_size=-1', { method: "GET" });
                // const allTestCodeJobs = allCodeJobs.Body.filter(codeJob => codeJob.SupportAdminUUID === 'a8f60b30-0066-41fd-8a56-2f43fb5ab8b0' &&codeJob.Type === 'AddonJob');
                // for (let index = 0; index < allTestCodeJobs.length; index++) {
                //     const cj = allTestCodeJobs[index];
                //     const bodyToSend = { UUID: cj.UUID, CodeJobIsHidden: true };
                //     const codeJobHideResponse = await generalService.fetchStatus('/code_jobs', { method: "POST", body:JSON.stringify(bodyToSend)});
                //     expect(codeJobHideResponse.Body.UUID).to.equal(cj.UUID);
                //     expect(codeJobHideResponse.Body.CodeJobIsHidden).to.equal(true);
                // }
                // const allCodeJobsAfterHidding = await generalService.fetchStatus('/code_jobs?page_size=-1', { method: "GET" });
                // const allTestCodeJobsAfterHidding = allCodeJobs.Body.filter(codeJob => codeJob.SupportAdminUUID === 'a8f60b30-0066-41fd-8a56-2f43fb5ab8b0' &&codeJob.Type === 'AddonJob');
                // debugger;
            });
        });
    });
}
