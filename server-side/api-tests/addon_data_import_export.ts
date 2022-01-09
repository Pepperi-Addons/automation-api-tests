import GeneralService, { TesterFunctions } from '../services/general.service';
import { AddonRelationService } from '../services/addon-relation.service';
import { ADALService } from '../services/adal.service';
import { DMXService } from '../services/addon-data-import-export.service';

export async function AddonDataImportExportTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    const relationService = new AddonRelationService(generalService);
    const dmxService = new DMXService(generalService.papiClient);

    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const secretKey = await generalService.getSecretKey(addonUUID);
    const version = '0.0.5';

    //#region Upgrade Relations Framework, ADAL And Pepperitest (Jenkins Special Addon) - Code Jobs
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', ''],
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, version],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(request.body.varKey, testData, false);
    //#endregion Upgrade Relations Framework, ADAL And Pepperitest (Jenkins Special Addon) - Code Jobs

    describe('Addon Data Import Export Tests Suites', () => {
        describe('Prerequisites Addon Data Import Export Tests', () => {
            //Test Data
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
        describe(`Set Relation`, () => {
            it(`Post Relation`, async () => {
                const relationResponse = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    {
                        Name: 'Get Result From PositiveTest', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'PositiveTest', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        Description: 'PositiveTest 1',
                        AddonRelativeURL: 'test/PositiveTest', // mandatory on create
                    },
                );
                expect(relationResponse).to.equal(200);
            });

            it(`Get Positive Relation`, async () => {
                const relationBody = {
                    Name: 'Get Result From PositiveTest', // mandatory
                    AddonUUID: addonUUID, // mandatory
                    RelationName: 'PositiveTest', // mandatory
                    Type: 'AddonAPI', // mandatory on create
                    Description: 'PositiveTest 1',
                    AddonRelativeURL: 'test/PositiveTest', // mandatory on create
                };
                const relationResponse = await relationService.getRelationWithName(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    relationBody.Name,
                );
                expect(relationResponse[0]).to.include({
                    ...relationBody,
                    Key: `${relationBody.Name}_${relationBody.AddonUUID}_${relationBody.RelationName}`,
                    Hidden: false,
                });
            });
        });

        describe(`ADAL`, () => {
            it(`Add Data To Table`, async () => {
                // generalService.papiClient['options'].addonUUID = addonUUID;
                // generalService.papiClient['options'].addonSecretKey = secretKey;
                const adalService = new ADALService(generalService.papiClient);
                adalService.papiClient['options'].addonUUID = addonUUID;
                adalService.papiClient['options'].addonSecretKey = secretKey;
                const schemaName = 'Oren111';
                await adalService.postDataToSchema(addonUUID, schemaName, {
                    Name: 'Oren111',
                    Description: 'Oren Updaed This 2',
                    Column1: ['Value1', 'Value2', 'Value3'],
                    Key: 'testKey1',
                    Oren: true,
                    object: {
                        object: {},
                        String: 'String',
                        Object: {},
                        Array: [],
                    },
                });
            });
        });

        describe(`DMX`, () => {
            it(`Export From Relation`, async () => {
                const relationResponse = await dmxService.dataExport(addonUUID, 'Oren111');
                const dmxExport = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI);
                expect(dmxExport.Status?.ID).to.equal(1);
            });
        });
    });
}
