import GeneralService, { TesterFunctions } from '../services/general.service';

export async function UpgradeDependenciesTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const testData = {
        'Services Framework': [
            '00000000-0000-0000-0000-000000000a91',
            request.body.servicesFramework ? `${request.body.servicesFramework}` : '9.5',
        ],
        'Cross Platforms API': [
            '00000000-0000-0000-0000-000000abcdef',
            request.body.crossPlatformsAPI ? `${request.body.crossPlatformsAPI}` : 'V',
        ],
        'WebApp Platform': [
            '00000000-0000-0000-1234-000000000b2b',
            request.body.webAppPlatform ? `${request.body.webAppPlatform}` : '16.55',
        ],
        'Addons Manager': [
            'bd629d5f-a7b4-4d03-9e7c-67865a6d82a9',
            request.body.addonsManager ? `${request.body.addonsManager}` : '0.',
        ],
        'Data Views API': [
            '484e7f22-796a-45f8-9082-12a734bac4e8',
            request.body.dataViewsAPI ? `${request.body.dataViewsAPI}` : '1.',
        ],
        'Settings Framework': [
            '354c5123-a7d0-4f52-8fce-3cf1ebc95314',
            request.body.settingsFramework ? `${request.body.settingsFramework}` : '9.5',
        ],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', request.body.adal ? `${request.body.adal}` : '1.'],
    };

    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    const chnageVersionResponseArr = await generalService.chnageVersion(request.body.varKey, testData, true);

    //Services Framework, Cross Platforms API, WebApp Platform, Addons Manager, Data Views API, Settings Framework, ADAL
    describe('Upgrade Dependencies Addons', () => {
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
            describe(`${addonName}`, () => {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                    if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                        expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                    } else {
                        expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                    }
                });

                it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                    await expect(service.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                        .eventually.to.have.property('Version')
                        .a('string')
                        .that.is.equal(varLatestVersion);
                });
            });
        }
    });
}
