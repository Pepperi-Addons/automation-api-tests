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
    let AfterStop = 0;

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    // await generalService.baseAddonVersionsInstallation(varKey, undefined, true);
    const testData = {
        // Scheduler: ['8bc903d1-d97a-46b8-990b-50bea356e35b', ''],
        // 'Async Task Execution': ['00000000-0000-0000-0000-0000000a594c', ''],
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
            it(`2. Create A Job Based On Pepperitest Addon Version 0.0.5 To Run Every 2 Minutes`, async () => {
                CodeJobBody = {
                    UUID: '',
                    CodeJobName: 'New CodeJob with IsScheduled true',
                    Description: 'Cron verification',
                    Owner: '',
                    CronExpression: '*/2 * * * *',
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
                expect(CallbackCash.insertNewCJtoCronVerification.CodeJobName).to.equal(CodeJobBody.CodeJobName);
                expect(codeJobResponse.CodeJobIsHidden).to.equal(false);
                expect(codeJobResponse.IsScheduled).to.equal(true);
                expect(codeJobResponse.CronExpression).to.equal(CodeJobBody.CronExpression);
                CodeJobUUIDCron = CallbackCash.insertNewCJtoCronVerification.UUID;
            });
            it(`3. Get New Code Job Execution Response For At Least Two Runs`, async () => {
                generalService.sleep(130000);
                CallbackCash.ResponseEmptyExecutedLogsCronTest = await service.auditLogs.find({
                    where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
                });
                expect(CallbackCash.ResponseEmptyExecutedLogsCronTest.length).to.equal(1);
                expect(CallbackCash.ResponseEmptyExecutedLogsCronTest[0].Status.Name).to.equal('Success');
                expect(
                    JSON.parse(CallbackCash.ResponseEmptyExecutedLogsCronTest[0].AuditInfo.ResultObject).success,
                ).to.equal(true);
                expect(
                    JSON.parse(CallbackCash.ResponseEmptyExecutedLogsCronTest[0].AuditInfo.ResultObject).errorMessage,
                ).to.equal('test msg');
                expect(
                    JSON.parse(
                        JSON.parse(CallbackCash.ResponseEmptyExecutedLogsCronTest[0].AuditInfo.ResultObject)
                            .resultObject.multiplyResult,
                    ),
                ).to.equal(6);
                generalService.sleep(128000);
                CallbackCash.ResponseEmptyExecutedLogsCronTest = await service.auditLogs.find({
                    where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
                });
                expect(CallbackCash.ResponseEmptyExecutedLogsCronTest.length).to.be.at.least(2);
                for (let index = 0; index < CallbackCash.ResponseEmptyExecutedLogsCronTest.length; index++) {
                    expect(CallbackCash.ResponseEmptyExecutedLogsCronTest[index].Status.Name).to.equal('Success');
                    expect(
                        JSON.parse(CallbackCash.ResponseEmptyExecutedLogsCronTest[index].AuditInfo.ResultObject)
                            .success,
                    ).to.equal(true);
                    expect(
                        JSON.parse(CallbackCash.ResponseEmptyExecutedLogsCronTest[index].AuditInfo.ResultObject)
                            .errorMessage,
                    ).to.equal('test msg');
                    expect(
                        JSON.parse(
                            JSON.parse(CallbackCash.ResponseEmptyExecutedLogsCronTest[index].AuditInfo.ResultObject)
                                .resultObject.multiplyResult,
                        ),
                    ).to.equal(6);
                }
            });
            it(`4. Stop The Code Job`, async () => {
                const bodyToSend = { KeyList: [CodeJobUUIDCron] };
                const codeJobResponse = await generalService.fetchStatus('/addons/jobs/stop', {
                    method: 'POST',
                    body: JSON.stringify(bodyToSend),
                });
                expect(codeJobResponse.Ok).to.equal(true);
                expect(codeJobResponse.Status).to.equal(200);
                expect(codeJobResponse.Body).to.deep.equal({});
            });
            it(`5. Wait For 4.5 Minutes (Stopping Is Not Immediate) - Then See It Doesn't Run Anymore For 4 Minutes`, async () => {
                generalService.sleep(270000);
                CallbackCash.ResponseEmptyExecutedLogsCronTest = await service.auditLogs.find({
                    where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
                });
                const prevNumOfRuns = CallbackCash.ResponseEmptyExecutedLogsCronTest.length;
                generalService.sleep(240000);
                CallbackCash.ResponseEmptyExecutedLogsCronTest = await service.auditLogs.find({
                    where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
                });
                expect(CallbackCash.ResponseEmptyExecutedLogsCronTest.length).to.equal(prevNumOfRuns);
                AfterStop = CallbackCash.ResponseEmptyExecutedLogsCronTest.length;
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
            it(`7. Wait For 5 Minutes & See The Job Is Back Running`, async () => {
                generalService.sleep(300000);
                CallbackCash.ResponseEmptyExecutedLogsCronTest = await service.auditLogs.find({
                    where: `AuditInfo.JobMessageData.CodeJobUUID='${CodeJobUUIDCron}'`,
                });
                expect(CallbackCash.ResponseEmptyExecutedLogsCronTest.length).to.be.above(AfterStop);
            });
            it(`LAST: Clean Code Job`, async () => {
                CodeJobBody = {
                    UUID: CodeJobUUIDCron,
                    IsScheduled: false,
                };

                CallbackCash.updateCronToChroneTestIsScheduledFalse = await generalService.fetchStatus('/code_jobs', {
                    method: 'POST',
                    body: JSON.stringify(CodeJobBody),
                });
                expect(CallbackCash.updateCronToChroneTestIsScheduledFalse.Status).to.equal(200);
                expect(CallbackCash.updateCronToChroneTestIsScheduledFalse.Ok).to.equal(true);
                expect(CallbackCash.updateCronToChroneTestIsScheduledFalse.Body.UUID).to.equal(CodeJobUUIDCron);
            });
        });
    });
}
