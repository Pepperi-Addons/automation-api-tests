import GeneralService, { TesterFunctions } from '../services/general.service';
import { AddonRelationService } from '../services/addon-relation.service';
import { ADALService } from '../services/adal.service';
import { DIMXService } from '../services/addon-data-import-export.service';
import fs from 'fs';
import path from 'path';

export async function AddonDataImportExportTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    const relationService = new AddonRelationService(generalService);
    const dimxService = new DIMXService(generalService.papiClient);

    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const secretKey = await generalService.getSecretKey(addonUUID);
    const version = '0.0.5';
    const schemaName = 'DIMX Test';
    const addonFileName = 'dimx11.js';
    const addonExportFunctionName = 'RemoveObject';
    const addonImportFunctionName = 'RemoveColumn1';

    //#region Upgrade Relations Framework, ADAL And Pepperitest (Jenkins Special Addon) - Code Jobs
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', ''],
        Import_Export: ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, version],
    };
    let varKey;
    if (request.body.varKeyPro) {
        varKey = request.body.varKeyPro;
    } else {
        varKey = request.body.varKeyStage;
    }
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
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

        describe(`Create Function For Relation, File: ${addonFileName}, Function Name: ${addonExportFunctionName}`, () => {
            it(`Post Function`, async () => {
                const adoonVersionResponse = await generalService.papiClient.addons.versions.find({
                    where: `AddonUUID='${addonUUID}' AND Version='${version}'`,
                });
                expect(adoonVersionResponse[0].AddonUUID).to.equal(addonUUID);
                expect(adoonVersionResponse[0].Version).to.equal(version);

                const file = fs.readFileSync(path.resolve(__dirname, './test-data/relations.js'));
                const base64File = file.toString('base64');
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

        describe(`Set Relations`, () => {
            it(`Post Export Relation`, async () => {
                const relationResponse = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    {
                        Name: 'Get Export From DIMX', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'DataExportResource', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        Description: 'DIMX Export',
                        AddonRelativeURL: `/${addonFileName}/${addonExportFunctionName}`, // mandatory on create
                    },
                );
                expect(relationResponse).to.equal(200);
            });

            it(`Get Export Relation`, async () => {
                const relationBody = {
                    Name: 'Get Export From DIMX', // mandatory
                    AddonUUID: addonUUID, // mandatory
                    RelationName: 'DataExportResource', // mandatory
                    Type: 'AddonAPI', // mandatory on create
                    Description: 'DIMX Export',
                    AddonRelativeURL: `/${addonFileName}/${addonExportFunctionName}`, // mandatory on create
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

            it(`Post Import Relation`, async () => {
                const relationResponse = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    {
                        Name: 'Import With DIMX', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ImportDataSource', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        Description: 'DIMX Import',
                        AddonRelativeURL: `/${addonFileName}/${addonImportFunctionName}`, // mandatory on create
                    },
                );
                expect(relationResponse).to.equal(200);
            });

            it(`Get Import Relation`, async () => {
                const relationBody = {
                    Name: 'Import With DIMX', // mandatory
                    AddonUUID: addonUUID, // mandatory
                    RelationName: 'ImportDataSource', // mandatory
                    Type: 'AddonAPI', // mandatory on create
                    Description: 'DIMX Import',
                    AddonRelativeURL: `/${addonFileName}/${addonImportFunctionName}`, // mandatory on create
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

        describe(`Create Schema: ${schemaName}`, () => {
            it(`Reset Schema`, async () => {
                const adalService = new ADALService(generalService.papiClient);
                adalService.papiClient['options'].addonUUID = addonUUID;
                adalService.papiClient['options'].addonSecretKey = secretKey;
                let purgedSchema;
                try {
                    purgedSchema = await adalService.deleteSchema(schemaName);
                } catch (error) {
                    purgedSchema = '';
                    expect(error)
                        .to.have.property('message')
                        .that.includes(
                            `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist`,
                        );
                }
                const newSchema = await adalService.postSchema({ Name: schemaName });
                expect(purgedSchema).to.equal('');
                expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaName);
                expect(newSchema).to.have.property('Type').a('string').that.is.equal('meta_data');
            });

            it(`Add Data To Table`, async () => {
                const adalService = new ADALService(generalService.papiClient);
                adalService.papiClient['options'].addonUUID = addonUUID;
                adalService.papiClient['options'].addonSecretKey = secretKey;
                for (let i = 1; i < 4; i++) {
                    await adalService.postDataToSchema(addonUUID, schemaName, {
                        Name: schemaName,
                        Description: `DIMX Test ${i}`,
                        Column1: ['Value1', 'Value2', 'Value3'],
                        Key: `testKeyDIMX${i}`,
                        object: {
                            Object: { Value1: 1, Value2: 2, Value3: 3 },
                            String: `DIMX Test ${i}`,
                            Array: ['Value1', 'Value2', 'Value3'],
                        },
                    });
                }
            });
        });

        describe(`DIMX`, () => {
            let dimxExport;
            it(`Export From Relation`, async () => {
                const relationResponse = await dimxService.dataExport(addonUUID, schemaName);
                dimxExport = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI);
                expect(dimxExport.Status?.ID, JSON.stringify(dimxExport.AuditInfo.ResultObject)).to.equal(1);
                expect(dimxExport.AuditInfo.ResultObject, JSON.stringify(dimxExport.AuditInfo.ResultObject)).to.include(
                    'https://cdn.',
                );
            });

            it(`Export Content`, async () => {
                const relationResponse = await generalService.fetchStatus(
                    JSON.parse(dimxExport.AuditInfo.ResultObject),
                );
                console.log({ URL: JSON.parse(dimxExport.AuditInfo.ResultObject) });
                expect(relationResponse.Body, JSON.stringify(dimxExport.AuditInfo.ResultObject)).to.deep.equal([
                    {
                        Description: 'DIMX Test 1',
                        Column1: ['Value1', 'Value2', 'Value3'],
                        Name: 'DIMX Test',
                        Key: 'testKeyDIMX1',
                    },
                    {
                        Description: 'DIMX Test 2',
                        Column1: ['Value1', 'Value2', 'Value3'],
                        Name: 'DIMX Test',
                        Key: 'testKeyDIMX2',
                    },
                    {
                        Description: 'DIMX Test 3',
                        Column1: ['Value1', 'Value2', 'Value3'],
                        Name: 'DIMX Test',
                        Key: 'testKeyDIMX3',
                    },
                ]);
            });

            it(`Import With Relation`, async () => {
                const relationResponse = await dimxService.dataImport(addonUUID, schemaName, {
                    Objects: [
                        {
                            Description: `DIMX Test ${1}`,
                            Column1: ['Value1', 'Value2', 'Value3'],
                            Key: `testKeyDIMX${1}`,
                            object: {
                                Object: { Value1: 1, Value2: 2, Value3: 3 },
                                String: `DIMX Test ${1}`,
                                Array: ['Value1', 'Value2', 'Value3'],
                            },
                        },
                        {
                            Description: `DIMX Test ${2}`,
                            Column1: ['Value1', 'Value2', 'Value3'],
                            Key: `testKeyDIMX${2}`,
                            object: {
                                Object: { Value1: 1, Value2: 2, Value3: 3 },
                                String: `DIMX Test ${2}`,
                                Array: ['Value1', 'Value2', 'Value3'],
                            },
                        },
                        {
                            Description: `DIMX Test ${3}`,
                            Column1: ['Value1', 'Value2', 'Value3'],
                            Key: `testKeyDIMX${3}`,
                            object: {
                                Object: { Value1: 1, Value2: 2, Value3: 3 },
                                String: `DIMX Test ${3}`,
                                Array: ['Value1', 'Value2', 'Value3'],
                            },
                        },
                    ],
                });
                dimxExport = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI);
                expect(dimxExport.Status?.ID, JSON.stringify(dimxExport.AuditInfo.ResultObject)).to.equal(1);
                expect(dimxExport.AuditInfo.ResultObject, JSON.stringify(dimxExport.AuditInfo.ResultObject)).to.include(
                    'https://cdn.',
                );
            });

            it(`Import Content`, async () => {
                const relationResponse = await generalService.fetchStatus(
                    JSON.parse(dimxExport.AuditInfo.ResultObject),
                );
                console.log({ URL: JSON.parse(dimxExport.AuditInfo.ResultObject) });
                expect(relationResponse.Body, JSON.stringify(dimxExport.AuditInfo.ResultObject)).to.deep.equal([
                    {
                        Description: 'DIMX Test 1',
                        Column1: ['Value1', 'Value2', 'Value3'],
                        Name: 'DIMX Test',
                        Key: 'testKeyDIMX1',
                    },
                    {
                        Description: 'DIMX Test 2',
                        Column1: ['Value1', 'Value2', 'Value3'],
                        Name: 'DIMX Test',
                        Key: 'testKeyDIMX2',
                    },
                    {
                        Description: 'DIMX Test 3',
                        Column1: ['Value1', 'Value2', 'Value3'],
                        Name: 'DIMX Test',
                        Key: 'testKeyDIMX3',
                    },
                ]);
            });
        });
    });
}
