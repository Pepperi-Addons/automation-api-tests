import GeneralService, { TesterFunctions } from '../services/general.service';

export async function MaintenanceJobTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Downgrade Services Framework To Working version
    const testData = {
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.5.470'],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(request.body.varKey, testData, false);

    describe('Maintenance Job Tests Suites', () => {
        describe('Prerequisites Addon for Maintenance Tests', () => {
            //Test Datas
            //Maintenance
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

        describe('Maintenance Job', () => {
            it('Validate Maintenance Job Works On Phased Version', async () => {
                const maintenanceJobResponse = await generalService.papiClient.post(
                    '/addons/api/00000000-0000-0000-0000-000000000a91/installation/maintenanceJob',
                );
                expect(maintenanceJobResponse.success).to.be.true;

                //Wait and validate that Maintenance Job works again on phased version
                generalService.sleep(5000);
                const maintenanceJobResponseAfter = await generalService.papiClient.post(
                    '/addons/api/00000000-0000-0000-0000-000000000a91/installation/maintenanceJob',
                );
                debugger;
                expect(maintenanceJobResponseAfter.success).to.be.true;
            });
        });
    });
}
