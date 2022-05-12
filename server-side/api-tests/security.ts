import GeneralService, { TesterFunctions } from '../services/general.service';

export async function SecurityTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade PAPI and CPAPI
    const testData = {
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.5'],
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.'],
    };

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Upgrade PAPI and CPAPI

    describe('Security Tests Suites', () => {
        describe('Prerequisites Addon for Security Tests', () => {
            //Test Data
            //Security
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

        describe('Endpoints', () => {
            describe('PAPI - Security - SK is returned via the API (DI-20192)', () => {
                it(`Try to get SK of PAPI: ${testData['Services Framework'][0]}`, async () => {
                    const getDataForJobEexecutionResponse = await generalService.papiClient
                        .apiCall('POST', '/code_jobs/get_data_for_job_execution', {
                            JobMessageData: {
                                UUID: '00000000-0000-0000-0000-000000000000',
                                MessageType: 'AddonMessage',
                                AddonData: {
                                    AddonUUID: testData['Services Framework'][0],
                                    AddonPath: 0,
                                },
                            },
                        })
                        .then((data) => data.json());

                    expect(getDataForJobEexecutionResponse)
                        .to.have.property('ClientObject')
                        .to.not.have.property('AddonSecretKey');
                });

                it(`Try to get SK of Testing Addon: ${generalService.papiClient['options'].addonUUID}`, async () => {
                    const getDataForJobEexecutionResponse = await generalService.papiClient
                        .apiCall('POST', '/code_jobs/get_data_for_job_execution', {
                            JobMessageData: {
                                UUID: '00000000-0000-0000-0000-000000000000',
                                MessageType: 'AddonMessage',
                                AddonData: {
                                    AddonUUID: generalService.papiClient['options'].addonUUID,
                                    AddonPath: 0,
                                },
                            },
                        })
                        .then((data) => data.json());
                    expect(getDataForJobEexecutionResponse)
                        .to.have.property('ClientObject')
                        .to.not.have.property('AddonSecretKey');
                });
            });
        });
    });
}
