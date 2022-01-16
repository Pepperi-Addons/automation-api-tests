import GeneralService, { TesterFunctions } from '../services/general.service';
import { UsageMonitorService } from '../services/usage-monitor.service';

export async function UsageMonitorTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    const usageMonitorService = new UsageMonitorService(generalService);

    const testBaseVersion = '1.0.58';

    //#region Upgrade ADAL
    const testData = {
        'Usage Monitor': ['00000000-0000-0000-0000-000000005A9E', ''],
    };
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Upgrade ADAL

    describe('Addon Relation Tests Suites', () => {
        describe('Prerequisites Addon for relation Tests', () => {
            //Test Data
            //ADAL
            it('Validate that all the needed addons are installed', async () => {
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
        describe(`Compare data from base and last versions`, () => {
            it(`Negative: AddonUUID not equale to OwnerID`, async () => {
                //const secretKey = await relationService.getSecretKey()
                // console.log(usageMonitorService.papiClient['options'].addonUUID,usageMonitorService.papiClient['options'].addonSecretKey )
                // usageMonitorService.papiClient['options'].addonUUID = {}
                // usageMonitorService.papiClient['options'].addonSecretKey = {}
                // console.log(usageMonitorService.papiClient['options'].addonUUID,usageMonitorService.papiClient['options'].addonSecretKey )

                // debugger

                //usageMonitorService
                const lastVersion = await usageMonitorService.get();
                //debugger;

                const tempTestData = {
                    'Usage Monitor': ['00000000-0000-0000-0000-000000005A9E', testBaseVersion],
                };
                await generalService.changeVersion(varKey, tempTestData, false);
                const baseVersion = await usageMonitorService.get();
                //debugger;
                delete baseVersion.ExpirationDateTime;
                delete baseVersion.Key;
                delete lastVersion.ExpirationDateTime;
                delete lastVersion.Key;
                delete baseVersion.ExternalData;
                delete lastVersion.ExternalData;
                delete baseVersion.RelationsData;
                delete lastVersion.RelationsData;
                delete baseVersion.Usage;
                delete lastVersion.Usage;
                // oleg2.Setup.Contacts
                // oleg2.Setup.LicensedUsers
                expect(lastVersion).to.deep.equal(baseVersion);

                //debugger
            });

            ///////////////////////////////////
        });
    });
}
