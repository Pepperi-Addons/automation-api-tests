import GeneralService, { testDataForNebulaDists, TesterFunctions } from '../../services/general.service';

export async function UpgradeDependenciesForNebulaTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testDataForNebulaDists, true);
    const isInstalledArr = await generalService.areAddonsInstalled(testDataForNebulaDists);

    //Services Framework, Cross Platforms API, WebApp Platform, Addons Manager, Data Views API, Settings Framework, ADAL
    describe('Upgrade Dependencies Addons', () => {
        isInstalledArr.forEach((isInstalled, index) => {
            it(`Validate That Needed Addon Is Installed: ${Object.keys(testDataForNebulaDists)[index]}`, () => {
                expect(isInstalled).to.be.true;
            });
        });

        for (const addonName in testDataForNebulaDists) {
            const addonUUID = testDataForNebulaDists[addonName][0];
            const version = testDataForNebulaDists[addonName][1];
            const varLatestVersion = chnageVersionResponseArr[addonName][2];
            const changeType = chnageVersionResponseArr[addonName][3];
            describe(`${addonName}`, () => {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                    if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                        expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                    } else {
                        expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                    }
                });

                it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                    const currentInstalledVersion = await service.addons.installedAddons
                        .addonUUID(`${addonUUID}`)
                        .get();
                    expect(currentInstalledVersion)
                        .to.have.property('Version')
                        .a('string')
                        .that.is.equal(varLatestVersion);
                });
            });
        }
    });
}
