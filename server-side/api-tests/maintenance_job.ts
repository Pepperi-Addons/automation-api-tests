import GeneralService, { TesterFunctions } from '../services/general.service';

export async function MaintenanceJobTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Downgrade Services Framework To Working version
    const testData = {
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.5.470'],
    };
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Downgrade Services Framework To Working version

    describe('Maintenance Job Tests Suites', () => {
        describe('Prerequisites Addon for Maintenance Tests', () => {
            //Test Datas
            //Maintenance
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

        describe('Maintenance Job', () => {
            it('Validate Maintenance Job Works On Phased Version', async () => {
                const maintenanceJobResponse = await generalService.papiClient.post(
                    '/addons/api/async/00000000-0000-0000-0000-000000000a91/installation/maintenanceJob',
                );
                const auditLogsResultObject = await generalService.getAuditLogResultObjectIfValid(
                    maintenanceJobResponse.URI,
                );
                expect(JSON.parse(auditLogsResultObject.AuditInfo.ResultObject).success).to.be.true;

                //TODO: Remove this region - This was add 25/12/2021 since the job need to be called only on the
                //TODO: Maintenance Window, and this need to be developed.
                //#region Restore Services Framework To Latest version
                const tempTestData = {
                    'Services Framework': ['00000000-0000-0000-0000-000000000a91', ''],
                };
                await generalService.changeVersion(varKey, tempTestData, false);
                //#endregion Restore Services Framework To Latest version

                //Validate Services Framework is on Phased version
                const installedPAPIVersion = await generalService.getAddonsByUUID(
                    '00000000-0000-0000-0000-000000000a91',
                );
                const testData = {
                    'Services Framework': ['00000000-0000-0000-0000-000000000a91', ''],
                };
                const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
                expect(installedPAPIVersion.Version, 'Services Framework is not on Phased Version').to.equal(
                    chnageVersionResponseArr['Services Framework'][2],
                );

                //Wait and validate that Maintenance Job works again on phased version
                generalService.sleep(5000);
                const maintenanceJobResponseAfter = await generalService.papiClient.post(
                    '/addons/api/00000000-0000-0000-0000-000000000a91/installation/maintenanceJob',
                );
                expect(maintenanceJobResponseAfter.success).to.be.true;
            });
        });
    });
}
