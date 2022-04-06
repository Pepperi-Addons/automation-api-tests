import GeneralService, { TesterFunctions } from '../../services/general.service';
import fs from 'fs';
import path from 'path';

export async function LocalAddonFileCreatorTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const version = '0.0.5';
    /**
     * After changing to new .js file, must run 'npm run build'
     * To compile and crearte the files in the build folder in server-side
     */
    const addonFileName = 'test_functions.js';

    //#region Upgrade Pepperitest (Jenkins Special Addon) - Code Jobs
    const testData = {
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, version],
    };
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Upgrade Pepperitest (Jenkins Special Addon) - Code Jobs

    describe('Addon Data Import Export Tests Suites', () => {
        describe('Prerequisites Addon Data Import Export Tests', () => {
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

        describe(`Create Function For Relation, File: ${addonFileName}`, () => {
            it(`Post Function`, async () => {
                const adoonVersionResponse = await generalService.papiClient.addons.versions.find({
                    where: `AddonUUID='${addonUUID}' AND Version='${version}'`,
                });
                expect(adoonVersionResponse[0].AddonUUID).to.equal(addonUUID);
                expect(adoonVersionResponse[0].Version).to.equal(version);

                let base64File;
                if (generalService['client'].AssetsBaseUrl.includes('/localhost:')) {
                    base64File = fs.readFileSync(
                        path.resolve(
                            __dirname.replace('\\build\\server-side\\api-tests\\test-service', ''),
                            './api-tests/test-data/test_functions.js',
                        ),
                        {
                            encoding: 'base64',
                        },
                    );
                } else {
                    //Changed to not use local files, but always the same file
                    base64File = Buffer.from(
                        'exports.AsIs = async (Client, Request) => {\n' +
                            '    return Request.body;\n' +
                            '};\n' +
                            'exports.RemoveObject = async (Client, Request) => {\n' +
                            '    for (let i = 0; i < Request.body.DIMXObjects.length; i++) {\n' +
                            '        if (Request.body.DIMXObjects[i]) {\n' +
                            '            delete Request.body.DIMXObjects[i].Object.object;\n' +
                            '            delete Request.body.DIMXObjects[i].Object.ModificationDateTime;\n' +
                            '            delete Request.body.DIMXObjects[i].Object.CreationDateTime;\n' +
                            '            delete Request.body.DIMXObjects[i].Object.Hidden;\n' +
                            '        }\n' +
                            '    }\n' +
                            '    return Request.body;\n' +
                            '};\n' +
                            'exports.RemoveColumn1 = async (Client, Request) => {\n' +
                            '    for (let i = 0; i < Request.body.DIMXObjects.length; i++) {\n' +
                            '        if (Request.body.DIMXObjects[i].Object.Column1) {\n' +
                            '            delete Request.body.DIMXObjects[i].Object.Column1;\n' +
                            '        }\n' +
                            '   }\n' +
                            '    return Request.body;\n' +
                            '};\n',
                    ).toString('base64');
                }

                const versionTestDataBody = {
                    AddonUUID: addonUUID,
                    UUID: adoonVersionResponse[0].UUID,
                    Version: version,
                    Files: [{ FileName: addonFileName, URL: '', Base64Content: base64File }],
                };

                const updateVersionResponse = await generalService.fetchStatus(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: `Basic ${Buffer.from(varKey).toString('base64')}`,
                        },
                        body: JSON.stringify(versionTestDataBody),
                    },
                );
                expect(updateVersionResponse.Status).to.equal(200);
            });
        });
    });
}
