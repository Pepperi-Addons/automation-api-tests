import GeneralService, { TesterFunctions } from '../../services/general.service';
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

export async function DistributorTests(generalService: GeneralService, request, tester: TesterFunctions) {
    let password = request.body.varKey;
    if (request.body.varKeyEU) {
        password = request.body.varKeyEU;
    }
    const distributorService = new DistributorService(generalService, { body: { varKey: password } });
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    describe('Distributor Test Suites', async () => {
        const clientArr: ClientObject[] = [];
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
            expect(newDistributor.Body.Status.ID).to.equal(1);
            expect(newDistributor.Body.DistributorUUID).to.have.lengthOf(36);
        });

        it(`Get Test Data`, async () => {
            const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
            const adminService = new GeneralService(adminClient);
            await TestDataTests(adminService, { describe, expect, it } as TesterFunctions, {
                IsAllAddons: false,
                IsUUID: true,
            });
        });

        it(`Get Installed Addons`, async () => {
            const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
            const adminService = new GeneralService(adminClient);
            const adminAddons = await adminService.getInstalledAddons();
            expect(adminAddons.length).to.be.above(10);
            const adminObjectsService = new ObjectsService(adminService);
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

            describe('Verify Missing Details', async () => {
                for (let index = 0; index < arrayOfAddonsDiff.length; index++) {
                    if (arrayOfAddonsDiff[index]['Installed'] == 'Addon Missing') {
                        it(`System Addon Is Not Installed: ${arrayOfAddonsDiff[index]['System'].Name}`, async () => {
                            expect.fail(`Addon.Name: ${JSON.stringify(arrayOfAddonsDiff[index]['System'].Name)}`);
                        });
                    }
                    if (arrayOfAddonsDiff[index]['System'] == 'Addon Missing') {
                        it(`Addon Is Installed That Is Not System: ${arrayOfAddonsDiff[index]['Installed'].Name}`, async () => {
                            expect.fail(`Addon.Name: ${JSON.stringify(arrayOfAddonsDiff[index]['Installed'].Name)}`);
                        });
                    }
                }
            });

            describe('Verify Installed Details', async () => {
                for (let j = 0; j < arrayOfAddonsDiff.length; j++) {
                    for (let i = j + 1; i < arrayOfAddonsDiff.length; i++) {
                        if (arrayOfAddonsDiff[j]['Installed'].Name == arrayOfAddonsDiff[i]['Installed'].Name) {
                            it(`System Addon Is Installed Two Times ${arrayOfAddonsDiff[i]['Installed'].Name}`, async () => {
                                expect.fail(`Addon.Name: ${JSON.stringify(arrayOfAddonsDiff[i]['Installed'].Name)}`);
                            });
                        }
                    }
                }
            });

            describe('Verify Installed Versions Is Phased', async () => {
                for (let i = 0; i < installedAddonTestData.length; i++) {
                    it(`System Addon: ${installedAddonTestData[i].Name} Is Installed With Phased Version ${installedAddonTestData[i].CurrentPhasedVersion}`, async () => {
                        expect(installedAddonTestData[i].Version).to.equal(
                            installedAddonTestData[i].CurrentPhasedVersion,
                        );
                    });
                }
            });
        });
    });
}
