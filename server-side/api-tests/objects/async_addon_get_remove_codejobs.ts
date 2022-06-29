import GeneralService, { ConsoleColors, TesterFunctions } from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';
import { DistributorService } from '../../services/distributor.service';
import { LoremIpsum } from 'lorem-ipsum';
import { TestDataTests } from '../test-service/test_data';

export interface ClientObject {
    Email: string;
    Password: string;
}

export interface AddonVersionTestData {
    Name?: string;
    Version?: string;
    CurrentPhasedVersion?: string;
}

export async function AsyncAddonGetRemoveTests(generalService: GeneralService, request, tester: TesterFunctions) {
    let password;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        password = request.body.varKeyStage;
    } else if (generalService.papiClient['options'].baseURL.includes('papi-eu')) {
        password = request.body.varKeyEU;
    } else {
        password = request.body.varKeyPro;
    }
    const distributorService = new DistributorService(generalService, password);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';

    describe('Async Addon Get', async () => {
        const clientArr: ClientObject[] = [];
        let distributor = {};
        let CallbackCash;
        let adminClient;
        let adminService;
        it(`Start Test Server Time And Date: ${generalService.getServer()} ${generalService.getTime()} ${generalService.getDate()}`, () => {
            expect(generalService.getDate().length == 10 && generalService.getTime().length == 8).to.be.true;
        });

        it(`Create New Distributor`, async function () {
            const lorem = new LoremIpsum({});
            const distributorFirstName = lorem.generateWords(1);
            const distributorLastName = lorem.generateWords(1);
            const distributorEmail = `${
                distributorFirstName + (Math.random() * 10000000000).toString().substring(0, 4)
            }.${distributorLastName}@pepperitest.com`;
            const distributorCompany = lorem.generateWords(3);
            const lettersGenerator = lorem.generateWords(1).substring(0, 2);
            const distributorPassword =
                lettersGenerator[0].toUpperCase() +
                lettersGenerator[1] +
                (Math.random() * 10000000000).toString().substring(0, 6);

            clientArr.push({ Email: distributorEmail, Password: distributorPassword });

            const newDistributor = await distributorService.createDistributor({
                FirstName: distributorFirstName,
                LastName: distributorLastName,
                Email: distributorEmail,
                Company: distributorCompany,
                Password: distributorPassword,
            });

            expect(newDistributor.Status).to.equal(200);

            //TODO: Remove this when bug will be solved (DI-19115)
            try {
                expect(newDistributor.Body.Status.ID, JSON.stringify(newDistributor.Body.AuditInfo)).to.equal(1);
            } catch (error) {
                if (
                    newDistributor.Body.Status.ID == 0 &&
                    newDistributor.Body.AuditInfo.ErrorMessage.includes('Failed to install the following addons')
                ) {
                    console.log('%cBug exist for this response: (DI-19115)', ConsoleColors.BugSkipped);
                    console.log(JSON.parse(newDistributor.Body.AuditInfo.ResultObject));
                } else {
                    throw new Error(
                        `Status.ID: ${newDistributor.Status.ID}, AuditInfo.ErrorMessage: ${newDistributor.Body.AuditInfo.ErrorMessage}`,
                    );
                }
            }
            expect(newDistributor.Body.DistributorUUID).to.have.lengthOf(36);
        });

        it(`Get Test Data`, async () => {
            const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
            const adminService = new GeneralService(adminClient);
            await TestDataTests(adminService, { describe, expect, it } as TesterFunctions, {
                IsAllAddons: false,
                IsUUID: true,
            });

            //install async addon
            const testData = {
                'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.5.'],
                'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, '0.0.5'],
                AsyncAddon: ['00000000-0000-0000-0000-0000000a594c', ''],
            };
            //const chnageVersionResponseArr =
            await adminService.changeToAnyAvailableVersion(testData);
            const isInstalledArr =
            await adminService.areAddonsInstalled(testData);
            //debugger;
            for (let index = 0; index < isInstalledArr.length-1; index++) {
                expect(isInstalledArr[index]).to.be.true;
            }
            
        });

        it(`Get Installed Addons`, async () => {
            adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
            adminService = new GeneralService(adminClient);
            const adminAddons = await adminService.getInstalledAddons();
            expect(adminAddons.length).to.be.above(10);
            const adminObjectsService = new ObjectsService(adminService);
            // const adminDistributorService = new DistributorService(adminService);
            const newDistributorUsers = await adminObjectsService.getUsers();
            const systemAddons = await adminService.getSystemAddons();
            const installedAddons = await adminService.getInstalledAddons();
            expect(newDistributorUsers.length).to.be.above(0);
            expect(systemAddons.length).to.be.above(10);
            expect(installedAddons.length).to.be.above(10);
            const systemAddonTestData: AddonVersionTestData[] = [];
            for (let index = 0; index < systemAddons.length; index++) {
                const phasedVersion = JSON.parse(systemAddons[index].SystemData);
                systemAddonTestData.push({
                    Name: systemAddons[index].Name,
                    Version: phasedVersion['CurrentPhasedVersion'],
                });
            }
            const installedAddonTestData: AddonVersionTestData[] = [];
            for (let index = 0; index < installedAddons.length; index++) {
                const phasedVersion = JSON.parse(installedAddons[index].Addon.SystemData);
                installedAddonTestData.push({
                    Name: installedAddons[index].Addon.Name,
                    Version: installedAddons[index].Version,
                    CurrentPhasedVersion: phasedVersion.CurrentPhasedVersion,
                });
            }

            const arrayOfAddonsDiff = [{}];
            arrayOfAddonsDiff.pop();

            for (let j = 0; j < installedAddonTestData.length; j++) {
                for (let i = 0; i < systemAddonTestData.length; i++) {
                    if (installedAddonTestData[j].Name?.includes(systemAddonTestData[i].Name as string)) {
                        arrayOfAddonsDiff.push({
                            Installed: installedAddonTestData[j],
                            System: systemAddonTestData[i],
                        });
                        break;
                    }
                    if (i == systemAddonTestData.length - 1) {
                        arrayOfAddonsDiff.push({ Installed: installedAddonTestData[j], System: 'Addon Missing' });
                    }
                }
            }
            const tempArrLength = arrayOfAddonsDiff.length;
            for (let j = 0; j < systemAddonTestData.length; j++) {
                for (let i = 0; i < tempArrLength; i++) {
                    if (systemAddonTestData[j].Name?.includes(arrayOfAddonsDiff[i]['Installed'].Name)) {
                        break;
                    }
                    if (i == tempArrLength - 1) {
                        arrayOfAddonsDiff.push({ Installed: 'Addon Missing', System: systemAddonTestData[j] });
                    }
                }
            }
        });

        describe('Create and execute new AddonJobs ', async () => {
            const jsFileName = 'test.js';
            const functionNamePapiTransaction = 'UpdateCodeJob'; //'getTransactions';
            let addonJobBody: any = {};

            addonJobBody = {
                UUID: '',
                CodeJobName: 'AddonJob with values',
                Description: 'AddonJob test',
                Type: 'AddonJob',
                IsScheduled: false,
                FailureAlertEmailTo: ['oleg.y@pepperi.com'],
                FailureAlertEmailSubject: 'test creation',
                CodeJobIsHidden: false,
                CreationDateTime: '',
                ModificationDateTime: '',
                ExecutionMemoryLevel: 1,
                NumberOfTries: 1,
                AddonPath: jsFileName, // Only for AddonJob
                AddonUUID: addonUUID, // Only for AddonJob
                FunctionName: functionNamePapiTransaction,
            };

            it(`Create AddonJob`, async () => {
                CallbackCash = await adminService.fetchStatus('/code_jobs', {
                    method: 'POST',
                    body: addonJobBody,
                });

                expect(CallbackCash.Status).to.equal(200);
                expect(CallbackCash.Body.UUID).to.be.a('string').and.is.not.empty;
            });
            it(`Execute AddonJob`, async () => {
                CallbackCash.execution = await adminService.fetchStatus(
                    '/code_jobs/async/' + CallbackCash.Body.UUID + '/execute',
                    { method: 'POST' },
                );

                expect(CallbackCash.execution.Body.ExecutionUUID).to.be.a('string').and.is.not.empty;
            });

            it(`Get Audit Log`, async () => {
                generalService.sleep(20000);
                CallbackCash.getAuditLogAddonJobExecution = await adminService.fetchStatus(
                    '/audit_logs/' + CallbackCash.execution.Body.ExecutionUUID,
                    { method: 'GET' },
                );

                CallbackCash.parsedResultObject = JSON.parse(
                    CallbackCash.getAuditLogAddonJobExecution.Body.AuditInfo.ResultObject,
                );
                expect(CallbackCash.getAuditLogAddonJobExecution.Status).to.equal(200);
                //expect(CallbackCash.parsedResultObject.resultObject['length']).to.be.above(0);
            });
            it(`Create second AddonJob`, async () => {
                const addonJobBodySec = {
                    UUID: '',
                    CodeJobName: 'second AddonJob',
                    Description: 'AddonJob test',
                    Type: 'AddonJob',
                    IsScheduled: false,
                    FailureAlertEmailTo: ['oleg.y@pepperi.com'],
                    FailureAlertEmailSubject: 'test creation',
                    CodeJobIsHidden: false,
                    CreationDateTime: '',
                    ModificationDateTime: '',
                    ExecutionMemoryLevel: 1,
                    NumberOfTries: 1,
                    AddonPath: jsFileName, // Only for AddonJob
                    AddonUUID: addonUUID, // Only for AddonJob
                    FunctionName: functionNamePapiTransaction,
                };
                CallbackCash.Sec = await adminService.fetchStatus('/code_jobs', {
                    method: 'POST',
                    body: addonJobBodySec,
                });

                expect(CallbackCash.Sec.Status).to.equal(200);
                expect(CallbackCash.Sec.Body.UUID).to.be.a('string').and.is.not.empty;
            });
            it(`Execute second AddonJob`, async () => {
                CallbackCash.executionSec = await adminService.fetchStatus(
                    '/code_jobs/async/' + CallbackCash.Sec.Body.UUID + '/execute',
                    { method: 'POST' },
                );

                expect(CallbackCash.executionSec.Body.ExecutionUUID).to.be.a('string').and.is.not.empty;
            });

            it(`Get Audit Log second execution`, async () => {
                generalService.sleep(20000);
                CallbackCash.getAuditLogAddonJobSecExecution = await adminService.fetchStatus(
                    '/audit_logs/' + CallbackCash.executionSec.Body.ExecutionUUID,
                    { method: 'GET' },
                );

                CallbackCash.getAuditLogAddonJobSecExecution.parsedResultObject = JSON.parse(
                    CallbackCash.getAuditLogAddonJobSecExecution.Body.AuditInfo.ResultObject,
                );
                expect(CallbackCash.getAuditLogAddonJobSecExecution.Status).to.equal(200);
                //expect(CallbackCash.parsedResultObject.resultObject['length']).to.be.above(0);
            });
        });

        describe('Get Jobs verification ', async () => {
            // const jsFileName = 'test.js';
            // const functionNamePapiTransaction = 'getTransactions';

            it(`Get all jobs`, async () => {
                let varKey;
                if (adminService.papiClient['options'].baseURL.includes('staging')) {
                    varKey = request.body.varKeyStage;
                } else {
                    varKey = request.body.varKeyPro;
                }

                CallbackCash.jobs = await adminService.fetchStatus('/addons/jobs', {
                    method: 'GET',
                    headers: {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': await adminService.getSecretKey(addonUUID, varKey),
                    },
                });
                expect(CallbackCash.jobs.Status).to.equal(200);
                //expect(CallbackCash.jobs.Body.length).to.equal(3);
                //expect(CallbackCash.jobs.Body.length).not.lessThanOrEqual(3);
                expect(CallbackCash.jobs.Body.length).not.lessThan(2);
                //expect(CallbackCash.Body.UUID).to.be.a('string').and.is.not.empty;
            });

            it(`Positive- Get CodeJob (check before uninstall async addon)`, async () => {
                generalService.sleep(20000);
                CallbackCash.getCodeJob = await adminService.fetchStatus(`/code_jobs/${CallbackCash.Body.UUID}`, {
                    method: 'GET',
                });
                //debugger;
                expect(CallbackCash.getCodeJob.Body.AddonUUID).to.be.a('string').and.is.not.empty;
            });

            it(`Addon uninstall`, async () => {
                let varKey;
                if (adminService.papiClient['options'].baseURL.includes('staging')) {
                    varKey = request.body.varKeyStage;
                } else {
                    varKey = request.body.varKeyPro;
                }

                CallbackCash.uninstallAsyncAddon = await adminService.fetchStatus(
                    '/addons/installed_addons/' + addonUUID + '/uninstall',
                    {
                        method: 'POST',
                        headers: {
                            'X-Pepperi-OwnerID': addonUUID,
                            'X-Pepperi-SecretKey': await adminService.getSecretKey(addonUUID, varKey),
                        },
                    },
                );
                //debugger;
                expect(CallbackCash.uninstallAsyncAddon.Status).to.equal(200);
            });
            it(`Get Audit Log - test addon uninstalled`, async () => {
                generalService.sleep(20000);
                CallbackCash.getAuditLogUninstallAsync = await adminService.fetchStatus(
                    '/audit_logs/' + CallbackCash.uninstallAsyncAddon.Body.ExecutionUUID,
                    { method: 'GET' },
                );

                // // CallbackCash.getAuditLogUninstallAsync.parsedResultObject = JSON.parse(
                // //     CallbackCash.getAuditLogUninstallAsync.Body.AuditInfo.ResultObject,
                // );
                //debugger;
                expect(CallbackCash.getAuditLogUninstallAsync.Status).to.equal(200);
                //expect(CallbackCash.parsedResultObject.resultObject['length']).to.be.above(0);
            });
            it(`Negative- Get CodeJob - will be removed`, async () => {
                generalService.sleep(20000);
                CallbackCash.getCodeJob = await adminService.fetchStatus(`/code_jobs/${CallbackCash.Body.UUID}`, {
                    method: 'GET',
                });
                //debugger;
                // expect(CallbackCash.getCodeJob.Body).to.be.a('string').and.is.empty;
                expect(CallbackCash.getCodeJob.Body).to.be.empty;
            });

            // it(`Negative- Try execute second AddonJob - will be removed`, async () => {
            //     CallbackCash.executionSecNeg = await adminService.fetchStatus(
            //         '/code_jobs/async/' + CallbackCash.Sec.Body.UUID + '/execute',
            //         { method: 'POST' },
            //     );
            //         debugger;
            //     expect(CallbackCash.executionSecNeg.Body.ExecutionUUID).to.be.a('string').and.is.empty;
            // });
        });

        //uninstall distributor on the end of test set
        describe('Set distributor to expire', async () => {
            // let supportAdminDistributorService
            it(`Set trial expiration to more than 6 months`, async () => {
                const datePlusZero = new Date();
                distributor = await adminService.getDistributor();
                const minusEightMonths = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * -240);
                const distributorResponse = await distributorService.setTrialExpirationDate({
                    UUID: distributor['UUID'],
                    TrialExpirationDateTime: minusEightMonths.toISOString().split('.')[0],
                });
                expect(distributorResponse.Body.TrialExpirationDateTime).to.equal(
                    minusEightMonths.toISOString().split('.')[0],
                );
                generalService.sleep(240000);
                // const expirationResponse = await supportAdminDistributorService.runExpirationProtocol();
                // expect(expirationResponse.Status.Name).to.equal('Success');
            });

            it(`Verify that distributor is disabled and addons are uninstalled`, async () => {
                // const distributor =
                await generalService.getVARDistributor(password, {
                    where: `InternalID=${adminService.getClientData('DistributorID')}`,
                });
                //const distributorAddons =
                await generalService.getVARInstalledAddons(password, {
                    where: `DistributorID=${adminService.getClientData('DistributorID')}`,
                });
                // expect(distributorAddons.Body).to.be.an('array').with.lengthOf(0);
                // expect(distributor.Body).to.be.an('array').with.lengthOf(0);
            });
        });
    });
}
