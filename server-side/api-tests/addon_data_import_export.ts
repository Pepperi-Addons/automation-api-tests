import GeneralService, { TesterFunctions } from '../services/general.service';
import { AddonRelationService } from '../services/addon-relation.service';
import { ADALService } from '../services/adal.service';
import { DIMXService } from '../services/addon-data-import-export.service';
import fs from 'fs';
import path from 'path';
import { AddonData } from '@pepperi-addons/papi-sdk';

let isPerformance = false;
export async function AddonDataImportExportPerformanceTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    isPerformance = true;
    AddonDataImportExportTests(generalService, request, tester);
}

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
    const importJSONFileName = 'import3.json';
    const importCSVFileName = 'import2.csv';
    const addonFunctionsFileName = 'dimx11.js';
    const addonExportFunctionName = 'RemoveObject';
    const addonImportFunctionName = 'RemoveColumn1';

    //#region Upgrade Relations Framework, ADAL And Pepperitest (Jenkins Special Addon) - Code Jobs
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', ''],
        Import_Export: ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, version],
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', '0.0.72'],
    };
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    // #endregion Upgrade Relations Framework, ADAL And Pepperitest (Jenkins Special Addon) - Code Jobs

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

        describe(`Create Function For Relation, File: ${addonFunctionsFileName}, Function Name: ${addonExportFunctionName}`, () => {
            it(`Post Function`, async () => {
                const adoonVersionResponse = await generalService.papiClient.addons.versions.find({
                    where: `AddonUUID='${addonUUID}' AND Version='${version}'`,
                });
                expect(adoonVersionResponse[0].AddonUUID).to.equal(addonUUID);
                expect(adoonVersionResponse[0].Version).to.equal(version);

                let base64File;
                if (generalService['client'].AssetsBaseUrl.includes('/localhost:')) {
                    const file = fs.readFileSync(
                        path.resolve(__dirname.replace('\\build\\server-side', ''), './test-data/relations.js'),
                    );
                    base64File = file.toString('base64');
                } else {
                    //Changed to not use local files, but always the same file
                    base64File = Buffer.from(
                        'exports.AsIs = async (Client, Request) => {\n' +
                            '    return Request.body;\n' +
                            '};\n' +
                            '\n' +
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
                            '\n' +
                            'exports.RemoveColumn1 = async (Client, Request) => {\n' +
                            '    for (let i = 0; i < Request.body.DIMXObjects.length; i++) {\n' +
                            '        if (Request.body.DIMXObjects[i].Object.Column1) {\n' +
                            '            delete Request.body.DIMXObjects[i].Object.Column1;\n' +
                            '        }\n' +
                            '    }\n' +
                            '    return Request.body;\n' +
                            '};\n',
                    ).toString('base64');
                }

                const versionTestDataBody = {
                    AddonUUID: addonUUID,
                    UUID: adoonVersionResponse[0].UUID,
                    Version: version,
                    Files: [{ FileName: addonFunctionsFileName, URL: '', Base64Content: base64File }],
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
                        AddonRelativeURL: `/${addonFunctionsFileName}/${addonExportFunctionName}`, // mandatory on create
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
                    AddonRelativeURL: `/${addonFunctionsFileName}/${addonExportFunctionName}`, // mandatory on create
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
                        RelationName: 'DataImportResource', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        Description: 'DIMX Import',
                        AddonRelativeURL: `/${addonFunctionsFileName}/${addonImportFunctionName}`, // mandatory on create
                    },
                );
                expect(relationResponse).to.equal(200);
            });

            it(`Get Import Relation`, async () => {
                const relationBody = {
                    Name: 'Import With DIMX', // mandatory
                    AddonUUID: addonUUID, // mandatory
                    RelationName: 'DataImportResource', // mandatory
                    Type: 'AddonAPI', // mandatory on create
                    Description: 'DIMX Import',
                    AddonRelativeURL: `/${addonFunctionsFileName}/${addonImportFunctionName}`, // mandatory on create
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

        if (!isPerformance) {
            describe(`DIMX CRUD`, () => {
                describe(`Create Schema For DIMX With JSON: ${schemaName}`, () => {
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
                        const newSchema = await adalService.postSchema({
                            Name: schemaName,
                            Type: 'data',
                            Fields: {
                                Name: { Type: 'String' },
                                Description: { Type: 'String' },
                                Key: { Type: 'String' },
                                Column1: {
                                    Type: 'Array',
                                    Items: {
                                        Type: 'String',
                                    },
                                } as any,
                                object: {
                                    Type: 'Object',
                                    Fields: {
                                        Object: {
                                            Type: 'Object',
                                            Fields: {
                                                Value1: { Type: 'Integer' },
                                                Value2: { Type: 'Integer' },
                                                Value3: { Type: 'Integer' },
                                            },
                                        },
                                        String: { Type: 'String' },
                                        Array: {
                                            Type: 'Array',
                                            Items: { Type: 'String' },
                                        },
                                    },
                                } as any,
                            },
                        });
                        expect(purgedSchema).to.equal('');
                        expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaName);
                        expect(newSchema).to.have.property('Type').a('string').that.is.equal('data');
                    });

                    it(`Add Data To Table`, async () => {
                        const adalService = new ADALService(generalService.papiClient);
                        adalService.papiClient['options'].addonUUID = addonUUID;
                        adalService.papiClient['options'].addonSecretKey = secretKey;
                        for (let i = 1; i < 4; i++) {
                            if (i < 3) {
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
                            } else {
                                await adalService.postDataToSchema(addonUUID, schemaName, {
                                    Name: schemaName,
                                    Description: `DIMX Test ${i}`,
                                    Column1: ['Value1', 'Value2', 'Value3'],
                                    Key: `testKeyDIMX${i}`,
                                    object: {
                                        Object: { Value1: 1, Value2: 2, Value3: 3 },
                                        String: `DIMX Test ${i}`,
                                        Array: ['Value3', 'Value4', 'Value5'],
                                    },
                                });
                            }
                        }
                    });
                });

                describe(`Export JSON`, () => {
                    let dimxExportDefult;
                    it(`Export From Relation`, async () => {
                        const relationResponse = await dimxService.dataExport(addonUUID, schemaName);
                        dimxExportDefult = await generalService.getAuditLogResultObjectIfValid(
                            relationResponse.URI,
                            90,
                        );
                        expect(
                            dimxExportDefult.Status?.ID,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.equal(1);
                        const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                            ? 'pfs.staging.pepperi'
                            : generalService['client'].BaseURL.includes('papi-eu')
                            ? 'eu.pfs.pepperi'
                            : 'pfs.pepperi';
                        expect(
                            dimxExportDefult.AuditInfo.ResultObject,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.include(`https://${testResponseEnvironment}`);
                    });

                    it(`Export Content`, async () => {
                        const relationResponse = await generalService.fetchStatus(
                            JSON.parse(dimxExportDefult.AuditInfo.ResultObject).DownloadURL,
                        );
                        console.log({ URL: JSON.parse(dimxExportDefult.AuditInfo.ResultObject) });
                        expect(
                            relationResponse.Body,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.deep.equal([
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

                    it(`Post File in JSON Format`, async () => {
                        const adoonVersionResponse = await generalService.papiClient.addons.versions.find({
                            where: `AddonUUID='${addonUUID}' AND Version='${version}'`,
                        });
                        expect(adoonVersionResponse[0].AddonUUID).to.equal(addonUUID);
                        expect(adoonVersionResponse[0].Version).to.equal(version);

                        let base64File;
                        if (generalService['client'].AssetsBaseUrl.includes('/localhost:')) {
                            //js instead of json since build process ignore json in intention
                            const file = fs.readFileSync(
                                path.resolve(
                                    __dirname.replace('\\build\\server-side', ''),
                                    './test-data/import.json.js',
                                ),
                                {
                                    encoding: 'utf8',
                                },
                            );
                            base64File = Buffer.from(file).toString('base64');
                        } else {
                            // Changed to not use local files, but always the same content
                            base64File = Buffer.from(
                                '[{"Name":"DIMX Test","Description":"DIMX Test 0","Column1":["Value1","Value2","Value3"],"Key":"testKeyDIMX0","object":{"Object":{"Value1":1,"Value2":2,"Value3":3},"String":"DIMX Test 0","Array":["Value1","Value2","Value3"]}},{"Name":"DIMX Test","Description":"DIMX Test 1","Column1":["Value1","Value2","Value3"],"Key":"testKeyDIMX1","object":{"Object":{"Value1":1,"Value2":2,"Value3":3},"String":"DIMX Test 1","Array":["Value1","Value2","Value3"]}},{"Name":"DIMX Test","Description":"DIMX Test 2","Column1":["Value1","Value2","Value3"],"Key":"testKeyDIMX2","object":{"Object":{"Value1":1,"Value2":2,"Value3":3},"String":"DIMX Test 2","Array":["Value1","Value2","Value3"]}},{"Name":"DIMX Test","Description":"DIMX Test 3","Column1":["Value1","Value2","Value3"],"Key":"testKeyDIMX3","object":{"Object":{"Value1":1,"Value2":2,"Value3":3},"String":"DIMX Test 3","Array":["Value1","Value2","Value3"]}},{"Name":"DIMX Test","Description":"DIMX Test 4","Column1":["Value1","Value2","Value3"],"Key":"testKeyDIMX4","object":{"Object":{"Value1":1,"Value2":2,"Value3":3},"String":"DIMX Test 4","Array":["Value1","Value2","Value3"]}},{"Name":"DIMX Test","Description":"DIMX Test 5","Column1":["Value1","Value2","Value3"],"Key":"testKeyDIMX5","object":{"Object":{"Value1":1,"Value2":2,"Value3":3},"String":"DIMX Test 5","Array":["Value1","Value2","Value3"]}}]',
                            ).toString('base64');
                        }

                        const versionTestDataBody = {
                            AddonUUID: addonUUID,
                            UUID: adoonVersionResponse[0].UUID,
                            Version: version,
                            Files: [{ FileName: importJSONFileName, URL: '', Base64Content: base64File }],
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

                    it(`Import With Relation (Not Forced)`, async () => {
                        const testEnvironment = generalService['client'].BaseURL.includes('staging')
                            ? 'cdn.staging.pepperi'
                            : 'cdn.pepperi';
                        const relationResponse = await dimxService.dataImport(addonUUID, schemaName, {
                            URI: `https://${testEnvironment}.com/Addon/Public/${addonUUID}/${version}/${importJSONFileName}`,
                            OverwriteObject: false,
                        });
                        dimxExportDefult = await generalService.getAuditLogResultObjectIfValid(
                            relationResponse.URI,
                            90,
                        );
                        expect(
                            dimxExportDefult.Status?.ID,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.equal(1);
                        const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                            ? 'cdn.staging.pepperi'
                            : generalService['client'].BaseURL.includes('papi-eu')
                            ? 'eucdn.pepperi'
                            : 'cdn.pepperi';
                        expect(
                            dimxExportDefult.AuditInfo.ResultObject,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.include(`https://${testResponseEnvironment}`);
                    });

                    it(`Import Content`, async () => {
                        const relationResponse = await generalService.fetchStatus(
                            JSON.parse(dimxExportDefult.AuditInfo.ResultObject).DownloadURL,
                        );
                        console.log({ URL: JSON.parse(dimxExportDefult.AuditInfo.ResultObject).DownloadURL });
                        expect(relationResponse.Body).to.deep.equal([
                            { Key: 'testKeyDIMX0', Status: 'Insert' },
                            { Key: 'testKeyDIMX1', Status: 'Ignore' },
                            { Key: 'testKeyDIMX2', Status: 'Ignore' },
                            { Key: 'testKeyDIMX3', Status: 'Update' },
                            { Key: 'testKeyDIMX4', Status: 'Insert' },
                            { Key: 'testKeyDIMX5', Status: 'Insert' },
                        ]);
                    });

                    it(`Import With Relation (Forced)`, async () => {
                        const testEnvironment = generalService['client'].BaseURL.includes('staging')
                            ? 'cdn.staging.pepperi'
                            : 'cdn.pepperi';
                        const relationResponse = await dimxService.dataImport(addonUUID, schemaName, {
                            URI: `https://${testEnvironment}.com/Addon/Public/${addonUUID}/${version}/${importJSONFileName}`,
                            OverwriteObject: true,
                        });
                        dimxExportDefult = await generalService.getAuditLogResultObjectIfValid(
                            relationResponse.URI,
                            90,
                        );
                        expect(
                            dimxExportDefult.Status?.ID,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.equal(1);
                        const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                            ? 'cdn.staging.pepperi'
                            : generalService['client'].BaseURL.includes('papi-eu')
                            ? 'eucdn.pepperi'
                            : 'cdn.pepperi';
                        expect(
                            dimxExportDefult.AuditInfo.ResultObject,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.include(`https://${testResponseEnvironment}`);
                    });

                    it(`Import Content`, async () => {
                        const relationResponse = await generalService.fetchStatus(
                            JSON.parse(dimxExportDefult.AuditInfo.ResultObject).DownloadURL,
                        );
                        console.log({ URL: JSON.parse(dimxExportDefult.AuditInfo.ResultObject).DownloadURL });
                        expect(relationResponse.Body).to.deep.equal([
                            { Key: 'testKeyDIMX0', Status: 'Insert' },
                            { Key: 'testKeyDIMX1', Status: 'Insert' },
                            { Key: 'testKeyDIMX2', Status: 'Insert' },
                            { Key: 'testKeyDIMX3', Status: 'Insert' },
                            { Key: 'testKeyDIMX4', Status: 'Insert' },
                            { Key: 'testKeyDIMX5', Status: 'Insert' },
                        ]);
                    });

                    it(`Export the Imported Content`, async () => {
                        const relationResponse = await dimxService.dataExport(addonUUID, schemaName);
                        const newDimxExport = await generalService.getAuditLogResultObjectIfValid(
                            relationResponse.URI,
                            90,
                        );

                        let contentFromFileAsArr;
                        if (generalService['client'].AssetsBaseUrl.includes('/localhost:')) {
                            //js instead of json since build process ignore json in intention
                            const file = fs.readFileSync(
                                path.resolve(
                                    __dirname.replace('\\build\\server-side', ''),
                                    './test-data/import.json.js',
                                ),
                                {
                                    encoding: 'utf8',
                                },
                            );
                            contentFromFileAsArr = JSON.parse(file);

                            for (let i = 0; i < contentFromFileAsArr.length; i++) {
                                const object = contentFromFileAsArr[i];
                                delete object.Column1;
                                delete object.object;
                            }
                        } else {
                            contentFromFileAsArr = [
                                { Name: 'DIMX Test', Description: 'DIMX Test 0', Key: 'testKeyDIMX0' },
                                { Name: 'DIMX Test', Description: 'DIMX Test 1', Key: 'testKeyDIMX1' },
                                { Name: 'DIMX Test', Description: 'DIMX Test 2', Key: 'testKeyDIMX2' },
                                { Name: 'DIMX Test', Description: 'DIMX Test 3', Key: 'testKeyDIMX3' },
                                { Name: 'DIMX Test', Description: 'DIMX Test 4', Key: 'testKeyDIMX4' },
                                { Name: 'DIMX Test', Description: 'DIMX Test 5', Key: 'testKeyDIMX5' },
                            ];
                        }

                        const NewRelationResponse = await generalService.fetchStatus(
                            JSON.parse(newDimxExport.AuditInfo.ResultObject).DownloadURL,
                        );
                        console.log({ URL: JSON.parse(newDimxExport.AuditInfo.ResultObject).DownloadURL });

                        NewRelationResponse.Body.sort((a, b) => (a.Key > b.Key ? 1 : -1));

                        expect(NewRelationResponse.Body, JSON.stringify(NewRelationResponse)).to.deep.equal(
                            contentFromFileAsArr,
                        );
                    });
                });

                describe(`Create Schema For DIMX With CSV: ${schemaName}`, () => {
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
                        const newSchema = await adalService.postSchema({
                            Name: schemaName,
                            Type: 'data',
                            Fields: {
                                Name: { Type: 'String' },
                                Description: { Type: 'String' },
                                Key: { Type: 'String' },
                                Column1: {
                                    Type: 'Array',
                                    Items: {
                                        Type: 'String',
                                    },
                                } as any,
                                object: {
                                    Type: 'Object',
                                    Fields: {
                                        Object: {
                                            Type: 'Object',
                                            Fields: {
                                                Value1: { Type: 'Integer' },
                                                Value2: { Type: 'Integer' },
                                                Value3: { Type: 'Integer' },
                                            },
                                        },
                                        String: { Type: 'String' },
                                        Array: {
                                            Type: 'Array',
                                            Items: { Type: 'String' },
                                        },
                                    },
                                } as any,
                            },
                        });
                        expect(purgedSchema).to.equal('');
                        expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaName);
                        expect(newSchema).to.have.property('Type').a('string').that.is.equal('data');
                    });

                    it(`Add Data To Table`, async () => {
                        const adalService = new ADALService(generalService.papiClient);
                        adalService.papiClient['options'].addonUUID = addonUUID;
                        adalService.papiClient['options'].addonSecretKey = secretKey;
                        for (let i = 1; i < 4; i++) {
                            if (i < 3) {
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
                            } else {
                                await adalService.postDataToSchema(addonUUID, schemaName, {
                                    Name: schemaName,
                                    Description: `DIMX Test ${i}`,
                                    Column1: ['Value1', 'Value2', 'Value3'],
                                    Key: `testKeyDIMX${i}`,
                                    object: {
                                        Object: { Value1: 1, Value2: 2, Value3: 3 },
                                        String: `DIMX Test ${i}`,
                                        Array: ['Value3', 'Value4', 'Value5'],
                                    },
                                });
                            }
                        }
                    });
                });

                describe(`Export CSV`, () => {
                    let dimxExportCsv;
                    it(`Export From Relation`, async () => {
                        const relationResponse = await dimxService.dataExport(addonUUID, schemaName, {
                            Format: 'csv',
                        });
                        dimxExportCsv = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI, 90);
                        expect(dimxExportCsv.Status?.ID, JSON.stringify(dimxExportCsv.AuditInfo.ResultObject)).to.equal(
                            1,
                        );
                        const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                            ? 'pfs.staging.pepperi'
                            : generalService['client'].BaseURL.includes('papi-eu')
                            ? 'eu.pfs.pepperi'
                            : 'pfs.pepperi';
                        expect(
                            dimxExportCsv.AuditInfo.ResultObject,
                            JSON.stringify(dimxExportCsv.AuditInfo.ResultObject),
                        ).to.include(`https://${testResponseEnvironment}`);
                    });

                    it(`Export Content`, async () => {
                        const relationResponse = await generalService.fetchStatus(
                            JSON.parse(dimxExportCsv.AuditInfo.ResultObject).DownloadURL,
                        );
                        console.log({ URL: JSON.parse(dimxExportCsv.AuditInfo.ResultObject) });
                        expect(
                            relationResponse.Body.Text,
                            JSON.stringify(dimxExportCsv.AuditInfo.ResultObject),
                        ).to.equal(
                            'Description;Column1;Name;Key\n' +
                                `DIMX Test 1;['Value1','Value2','Value3'];DIMX Test;testKeyDIMX1\n` +
                                `DIMX Test 2;['Value1','Value2','Value3'];DIMX Test;testKeyDIMX2\n` +
                                `DIMX Test 3;['Value1','Value2','Value3'];DIMX Test;testKeyDIMX3`,
                        );
                    });

                    it(`Post File in CSV Format`, async () => {
                        const adoonVersionResponse = await generalService.papiClient.addons.versions.find({
                            where: `AddonUUID='${addonUUID}' AND Version='${version}'`,
                        });
                        expect(adoonVersionResponse[0].AddonUUID).to.equal(addonUUID);
                        expect(adoonVersionResponse[0].Version).to.equal(version);

                        let base64File;
                        if (generalService['client'].AssetsBaseUrl.includes('/localhost:')) {
                            //js instead of json since build process ignore json in intention
                            const file = fs.readFileSync(
                                path.resolve(
                                    __dirname.replace('\\build\\server-side', ''),
                                    './test-data/import.csv.js',
                                ),
                                {
                                    encoding: 'utf8',
                                },
                            );
                            const fileJSContent = file.split(`/*\r\n`)[1].split('\r\n*/')[0];
                            base64File = Buffer.from(fileJSContent).toString('base64');
                        } else {
                            // Changed to not use local files, but always the same content
                            base64File = Buffer.from(
                                'object.Array.0,object.Array.1,object.Array.2,object.Object.Value3,object.Object.Value1,object.Object.Value2,object.String,Description,Column1.0,Column1.1,Column1.2,Name,Key\n' +
                                    'Value1,Value2,Value3,3,1,2,DIMX Test 0,DIMX Test 0,Value1,Value2,Value3,DIMX Test,testKeyDIMX0\n' +
                                    'Value1,Value2,Value3,3,1,2,DIMX Test 1,DIMX Test 1,Value1,Value2,Value3,DIMX Test,testKeyDIMX1\n' +
                                    'Value1,Value2,Value3,3,1,2,DIMX Test 2,DIMX Test 2,Value1,Value2,Value3,DIMX Test,testKeyDIMX2\n' +
                                    'Value1,Value2,Value3,3,1,2,DIMX Test 3,DIMX Test 3,Value1,Value2,Value3,DIMX Test,testKeyDIMX3\n' +
                                    'Value1,Value2,Value3,3,1,2,DIMX Test 4,DIMX Test 4,Value1,Value2,Value3,DIMX Test,testKeyDIMX4\n' +
                                    'Value1,Value2,Value3,3,1,2,DIMX Test 5,DIMX Test 5,Value1,Value2,Value3,DIMX Test,testKeyDIMX5',
                            ).toString('base64');
                        }

                        const versionTestDataBody = {
                            AddonUUID: addonUUID,
                            UUID: adoonVersionResponse[0].UUID,
                            Version: version,
                            Files: [{ FileName: importCSVFileName, URL: '', Base64Content: base64File }],
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
                        //This can be used to make sure the sent file look as expected
                        //console.log({ File_Sent: Buffer.from(base64File, 'base64').toString('utf-8') })
                        expect(updateVersionResponse.Status).to.equal(200);
                    });

                    it(`Import With Relation (Not Forced)`, async () => {
                        const testEnvironment = generalService['client'].BaseURL.includes('staging')
                            ? 'cdn.staging.pepperi'
                            : 'cdn.pepperi';
                        const relationResponse = await dimxService.dataImport(addonUUID, schemaName, {
                            URI: `https://${testEnvironment}.com/Addon/Public/${addonUUID}/${version}/${importCSVFileName}`,
                            OverwriteObject: false,
                            Delimiter: ',',
                        });
                        dimxExportCsv = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI, 90);
                        expect(dimxExportCsv.Status?.ID, JSON.stringify(dimxExportCsv.AuditInfo.ResultObject)).to.equal(
                            1,
                        );
                        const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                            ? 'cdn.staging.pepperi'
                            : generalService['client'].BaseURL.includes('papi-eu')
                            ? 'eucdn.pepperi'
                            : 'cdn.pepperi';
                        expect(
                            dimxExportCsv.AuditInfo.ResultObject,
                            JSON.stringify(dimxExportCsv.AuditInfo.ResultObject),
                        ).to.include(`https://${testResponseEnvironment}`);
                    });

                    it(`Import Content (DI-19419)`, async () => {
                        const relationResponse = await generalService.fetchStatus(
                            JSON.parse(dimxExportCsv.AuditInfo.ResultObject).DownloadURL,
                        );
                        console.log({ URL: JSON.parse(dimxExportCsv.AuditInfo.ResultObject).DownloadURL });
                        expect(relationResponse.Body).to.deep.equal([
                            { Key: 'testKeyDIMX0', Status: 'Insert' },
                            { Key: 'testKeyDIMX1', Status: 'Ignore' },
                            { Key: 'testKeyDIMX2', Status: 'Ignore' },
                            { Key: 'testKeyDIMX3', Status: 'Update' },
                            { Key: 'testKeyDIMX4', Status: 'Insert' },
                            { Key: 'testKeyDIMX5', Status: 'Insert' },
                        ]);
                    });

                    it(`Import With Relation (Forced)`, async () => {
                        const testEnvironment = generalService['client'].BaseURL.includes('staging')
                            ? 'cdn.staging.pepperi'
                            : 'cdn.pepperi';
                        const relationResponse = await dimxService.dataImport(addonUUID, schemaName, {
                            URI: `https://${testEnvironment}.com/Addon/Public/${addonUUID}/${version}/${importCSVFileName}`,
                            OverwriteObject: true,
                            Delimiter: ',',
                        });
                        dimxExportCsv = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI, 90);
                        expect(dimxExportCsv.Status?.ID, JSON.stringify(dimxExportCsv.AuditInfo.ResultObject)).to.equal(
                            1,
                        );
                        const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                            ? 'cdn.staging.pepperi'
                            : generalService['client'].BaseURL.includes('papi-eu')
                            ? 'eucdn.pepperi'
                            : 'cdn.pepperi';
                        expect(
                            dimxExportCsv.AuditInfo.ResultObject,
                            JSON.stringify(dimxExportCsv.AuditInfo.ResultObject),
                        ).to.include(`https://${testResponseEnvironment}`);
                    });

                    it(`Import Content`, async () => {
                        const relationResponse = await generalService.fetchStatus(
                            JSON.parse(dimxExportCsv.AuditInfo.ResultObject).DownloadURL,
                        );
                        console.log({ URL: JSON.parse(dimxExportCsv.AuditInfo.ResultObject).DownloadURL });
                        expect(relationResponse.Body).to.deep.equal([
                            { Key: 'testKeyDIMX0', Status: 'Insert' },
                            { Key: 'testKeyDIMX1', Status: 'Insert' },
                            { Key: 'testKeyDIMX2', Status: 'Insert' },
                            { Key: 'testKeyDIMX3', Status: 'Insert' },
                            { Key: 'testKeyDIMX4', Status: 'Insert' },
                            { Key: 'testKeyDIMX5', Status: 'Insert' },
                        ]);
                    });

                    it(`Export the Imported Content`, async () => {
                        const relationResponse = await dimxService.dataExport(addonUUID, schemaName, {
                            Format: 'csv',
                        });
                        const newDimxExport = await generalService.getAuditLogResultObjectIfValid(
                            relationResponse.URI,
                            90,
                        );

                        let contentFromFileAsArr;
                        if (generalService['client'].AssetsBaseUrl.includes('/localhost:')) {
                            //js instead of json since build process ignore json in intention
                            const file = fs.readFileSync(
                                path.resolve(
                                    __dirname.replace('\\build\\server-side', ''),
                                    './test-data/import.csv.js',
                                ),
                                {
                                    encoding: 'utf8',
                                },
                            );
                            const fileJSContent = file.split(`/*\r\n`)[1].split(`\r\n*/`)[0];
                            contentFromFileAsArr = fileJSContent.split('\r\n');

                            for (let i = 0; i < contentFromFileAsArr.length; i++) {
                                const lineArr = contentFromFileAsArr[i].split(',');
                                lineArr.splice(0, 7);
                                lineArr.splice(1, 3);
                                contentFromFileAsArr[i] = lineArr.join();
                            }
                        } else {
                            contentFromFileAsArr = [
                                'Description,Name,Key',
                                'DIMX Test 0,DIMX Test,testKeyDIMX0',
                                'DIMX Test 1,DIMX Test,testKeyDIMX1',
                                'DIMX Test 2,DIMX Test,testKeyDIMX2',
                                'DIMX Test 3,DIMX Test,testKeyDIMX3',
                                'DIMX Test 4,DIMX Test,testKeyDIMX4',
                                'DIMX Test 5,DIMX Test,testKeyDIMX5',
                            ];
                        }

                        const NewRelationResponse = await generalService.fetchStatus(
                            JSON.parse(newDimxExport.AuditInfo.ResultObject).DownloadURL,
                        );

                        console.log({ URL: JSON.parse(newDimxExport.AuditInfo.ResultObject).DownloadURL });

                        const NewRelationResponseArr = NewRelationResponse.Body.Text.split('\n');
                        NewRelationResponseArr.sort();
                        contentFromFileAsArr.sort();
                        const contentFromFileWithFixedDelimiterAsArr: string[] = [];
                        for (let i = 0; i < contentFromFileAsArr.length; i++) {
                            contentFromFileWithFixedDelimiterAsArr.push(contentFromFileAsArr[i].replaceAll(',', ';'));
                        }
                        expect(NewRelationResponseArr, JSON.stringify(NewRelationResponse)).to.deep.equal(
                            contentFromFileWithFixedDelimiterAsArr,
                        );
                    });
                });
            });

            describe(`Bug Verification`, async () => {
                describe(`ADAL Schema is not purged (DI-19464)`, async () => {
                    let dimxExportDefult;
                    it(`Reset Schema Before`, async () => {
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
                        const newSchema = await adalService.postSchema({
                            Name: schemaName,
                            Type: 'data',
                            Fields: {
                                Name: { Type: 'String' },
                                Description: { Type: 'String' },
                                Key: { Type: 'String' },
                                Column1: {
                                    Type: 'Array',
                                    Items: {
                                        Type: 'String',
                                    },
                                } as any,
                                object: {
                                    Type: 'Object',
                                    Fields: {
                                        Object: {
                                            Type: 'Object',
                                            Fields: {
                                                Value1: { Type: 'Integer' },
                                                Value2: { Type: 'Integer' },
                                                Value3: { Type: 'Integer' },
                                            },
                                        },
                                        String: { Type: 'String' },
                                        Array: {
                                            Type: 'Array',
                                            Items: { Type: 'String' },
                                        },
                                    },
                                } as any,
                            },
                        });
                        expect(purgedSchema).to.equal('');
                        expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaName);
                        expect(newSchema).to.have.property('Type').a('string').that.is.equal('data');
                    });

                    it(`Export From Relation`, async () => {
                        const relationResponse = await dimxService.dataExport(addonUUID, schemaName);
                        dimxExportDefult = await generalService.getAuditLogResultObjectIfValid(
                            relationResponse.URI,
                            90,
                        );
                        expect(
                            dimxExportDefult.Status?.ID,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.equal(1);
                        const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                            ? 'pfs.staging.pepperi'
                            : generalService['client'].BaseURL.includes('papi-eu')
                            ? 'eu.pfs.pepperi'
                            : 'pfs.pepperi';
                        expect(
                            dimxExportDefult.AuditInfo.ResultObject,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.include(`https://${testResponseEnvironment}`);
                    });

                    it(`Export Content`, async () => {
                        const relationResponse = await generalService.fetchStatus(
                            JSON.parse(dimxExportDefult.AuditInfo.ResultObject).DownloadURL,
                        );
                        console.log({ URL: JSON.parse(dimxExportDefult.AuditInfo.ResultObject) });
                        expect(
                            relationResponse.Body,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.have.lengthOf(0);
                    });

                    it(`Add Data To Schema (20K)`, async () => {
                        const adalService = new ADALService(generalService.papiClient);
                        adalService.papiClient['options'].addonUUID = addonUUID;
                        adalService.papiClient['options'].addonSecretKey = secretKey;
                        for (let j = 0; j < 20; j++) {
                            const dataArr: AddonData[] = [];
                            for (let i = 0; i < 500; i++) {
                                dataArr.push({
                                    Name: schemaName,
                                    Description: `DIMX Test ${j * 500 + i}`,
                                    Version: 'TestFor20KBug',
                                    Key: `testKeyDIMX${j * 500 + i}`,
                                });
                            }
                            const adalResponse = await adalService.postBatchDataToSchema(
                                addonUUID,
                                schemaName,
                                dataArr,
                            );
                            expect(adalResponse[0], JSON.stringify(adalResponse)).to.deep.equal({
                                Status: 'Insert',
                                Key: `testKeyDIMX${j * 500}`,
                            });
                        }
                    });

                    it(`Reset Schema After`, async () => {
                        const adalService = new ADALService(generalService.papiClient);
                        adalService.papiClient['options'].addonUUID = addonUUID;
                        adalService.papiClient['options'].addonSecretKey = secretKey;
                        let purgedSchema;
                        //TODO: This sleep does nothing so it should be removed
                        // await generalService.sleepAsync(1000 * 60 * 2);
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
                        //TODO: This sleep does nothing so it should be removed
                        // await generalService.sleepAsync(1000 * 60 * 2);
                        const newSchema = await adalService.postSchema({
                            Name: schemaName,
                            Type: 'data',
                            Fields: {
                                Name: { Type: 'String' },
                                Description: { Type: 'String' },
                                Key: { Type: 'String' },
                                Column1: {
                                    Type: 'Array',
                                    Items: {
                                        Type: 'String',
                                    },
                                } as any,
                                object: {
                                    Type: 'Object',
                                    Fields: {
                                        Object: {
                                            Type: 'Object',
                                            Fields: {
                                                Value1: { Type: 'Integer' },
                                                Value2: { Type: 'Integer' },
                                                Value3: { Type: 'Integer' },
                                            },
                                        },
                                        String: { Type: 'String' },
                                        Array: {
                                            Type: 'Array',
                                            Items: { Type: 'String' },
                                        },
                                    },
                                } as any,
                            },
                        });
                        expect(purgedSchema).to.equal('');
                        expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaName);
                        expect(newSchema).to.have.property('Type').a('string').that.is.equal('data');
                    });

                    it(`Export From Relation`, async () => {
                        const relationResponse = await dimxService.dataExport(addonUUID, schemaName);
                        dimxExportDefult = await generalService.getAuditLogResultObjectIfValid(
                            relationResponse.URI,
                            90,
                        );
                        expect(
                            dimxExportDefult.Status?.ID,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.equal(1);
                        const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                            ? 'pfs.staging.pepperi'
                            : generalService['client'].BaseURL.includes('papi-eu')
                            ? 'eu.pfs.pepperi'
                            : 'pfs.pepperi';
                        expect(
                            dimxExportDefult.AuditInfo.ResultObject,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.include(`https://${testResponseEnvironment}`);
                    });

                    it(`Export Content`, async () => {
                        const relationResponse = await generalService.fetchStatus(
                            JSON.parse(dimxExportDefult.AuditInfo.ResultObject).DownloadURL,
                        );
                        console.log({ URL: JSON.parse(dimxExportDefult.AuditInfo.ResultObject) });
                        expect(
                            relationResponse.Body,
                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                        ).to.have.lengthOf(0);
                    });
                });

                describe(`Where Clause From Body (DI-19326)`, async () => {
                    let dimxExportDefult;
                    const whereToTestArr = [
                        "Key in 'testKeyDIMX555'",
                        //"Key Like '%KeyDIMX555'", //TODO: This for now should not be tested 10/03/2022
                        "Key LIKE 'testKeyDIMX%'",
                        "Key LIKE '%KeyDIMX5%'",
                    ];
                    const jsonCsv = ['json', 'csv'];
                    it(`Create Schema For Where Clause Tests`, async () => {
                        const adalService = new ADALService(generalService.papiClient);
                        adalService.papiClient['options'].addonUUID = addonUUID;
                        adalService.papiClient['options'].addonSecretKey = secretKey;
                        const dataArr: AddonData[] = [];
                        for (let index = 0; index < 10; index++) {
                            dataArr.push({
                                Name: schemaName,
                                Description: `DIMX Test ${111 * index}`,
                                Version: 'TestForClauseBug',
                                Key: `testKeyDIMX${111 * index}`,
                            });
                        }
                        const adalResponse = await adalService.postBatchDataToSchema(addonUUID, schemaName, dataArr);
                        expect(adalResponse[0], JSON.stringify(adalResponse)).to.deep.equal({
                            Status: 'Insert',
                            Key: `testKeyDIMX0`,
                        });
                    });

                    for (let j = 0; j < jsonCsv.length; j++) {
                        for (let i = 0; i < whereToTestArr.length; i++) {
                            describe(`Type: ${jsonCsv[j]}, Query WHERE: ${whereToTestArr[i]}`, async () => {
                                it(`Export From Relation`, async () => {
                                    const relationResponse = await dimxService.dataExport(addonUUID, schemaName, {
                                        Format: jsonCsv[j],
                                        Where: whereToTestArr[i],
                                    });

                                    dimxExportDefult = await generalService.getAuditLogResultObjectIfValid(
                                        relationResponse.URI,
                                        90,
                                    );
                                    expect(
                                        dimxExportDefult.Status?.ID,
                                        JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                                    ).to.equal(1);
                                    const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                                        ? 'pfs.staging.pepperi'
                                        : generalService['client'].BaseURL.includes('papi-eu')
                                        ? 'eu.pfs.pepperi'
                                        : 'pfs.pepperi';
                                    expect(
                                        dimxExportDefult.AuditInfo.ResultObject,
                                        JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                                    ).to.include(`https://${testResponseEnvironment}`);
                                });

                                it(`Export Content`, async () => {
                                    const relationResponse = await generalService.fetchStatus(
                                        JSON.parse(dimxExportDefult.AuditInfo.ResultObject).DownloadURL,
                                    );
                                    console.log({ URL: JSON.parse(dimxExportDefult.AuditInfo.ResultObject) });
                                    if (jsonCsv[j] == 'csv') {
                                        expect(
                                            relationResponse.Body.Text.split('\n').length,
                                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                                        ).to.be.above(1);
                                    } else {
                                        expect(
                                            relationResponse.Body.length,
                                            JSON.stringify(dimxExportDefult.AuditInfo.ResultObject),
                                        ).to.be.above(0);
                                    }
                                });
                            });
                        }
                    }
                });

                describe(`Check Object Schema (DI-19026)`, async () => {
                    let dimxExport;
                    let dimxExportAfterChange;
                    let dimxImport;
                    let dimxExportAfterRestore;
                    let dimxImportInsert;
                    let dimxExportAfterInsert;
                    const jsonCsv = ['json', 'csv'];
                    for (let i = 0; i < jsonCsv.length; i++) {
                        describe(`Type: ${jsonCsv[i]}`, async () => {
                            it(`Reset Schema Before`, async () => {
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
                                const newSchema = await adalService.postSchema({
                                    Name: schemaName,
                                    Type: 'data',
                                    Fields: {
                                        Name: { Type: 'String' },
                                        Description: { Type: 'String' },
                                        Key: { Type: 'String' },
                                        Column1: {
                                            Type: 'Array',
                                            Items: {
                                                Type: 'String',
                                            },
                                        } as any,
                                        object: {
                                            Type: 'Object',
                                            Fields: {
                                                Object: {
                                                    Type: 'Object',
                                                    Fields: {
                                                        Value1: { Type: 'Integer' },
                                                        Value2: { Type: 'Integer' },
                                                        Value3: { Type: 'Integer' },
                                                    },
                                                },
                                                String: { Type: 'String' },
                                                Array: {
                                                    Type: 'Array',
                                                    Items: { Type: 'String' },
                                                },
                                            },
                                        } as any,
                                        Number: { Type: 'Integer' },
                                        ArrayOfNumbers: {
                                            Type: 'Array',
                                            Items: { Type: 'Integer' },
                                        } as any,
                                        ObjectOfNumbers: {
                                            Type: 'Object',
                                            Fields: {
                                                a: { Type: 'Integer' },
                                                b: { Type: 'Integer' },
                                                c: { Type: 'Integer' },
                                                d: { Type: 'Integer' },
                                            },
                                        } as any,
                                        String: { Type: 'String' },
                                        ArrayOfStrings: {
                                            Type: 'Array',
                                            Items: { Type: 'String' },
                                        } as any,
                                        ObjectOfStrings: {
                                            Type: 'Object',
                                            Fields: {
                                                a: { Type: 'String' },
                                                b: { Type: 'String' },
                                                c: { Type: 'String' },
                                                d: { Type: 'String' },
                                            },
                                        } as any,
                                    },
                                });
                                expect(purgedSchema).to.equal('');
                                expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaName);
                                expect(newSchema).to.have.property('Type').a('string').that.is.equal('data');
                            });

                            it(`Create Schema With Array, Object and Number`, async () => {
                                const adalService = new ADALService(generalService.papiClient);
                                adalService.papiClient['options'].addonUUID = addonUUID;
                                adalService.papiClient['options'].addonSecretKey = secretKey;
                                const dataArr: AddonData[] = [];
                                for (let j = 0; j < 10; j++) {
                                    dataArr.push({
                                        Name: schemaName,
                                        Description: `DIMX Test ${j}`,
                                        Version: 'TestForObjectSchema',
                                        Key: `testKeyDIMX${j}`,
                                        Number: 5,
                                        String: '5',
                                        ArrayOfNumbers: [4, 33, 0, 11],
                                        ObjectOfNumbers: { a: 11, b: 0, c: 33, d: 4 },
                                        ArrayOfStrings: ['4', '33', '0', '11'],
                                        ObjectOfStrings: { a: '11', b: '0', c: '33', d: '4' },
                                    });
                                }
                                const adalResponse = await adalService.postBatchDataToSchema(
                                    addonUUID,
                                    schemaName,
                                    dataArr,
                                );
                                expect(adalResponse[0], JSON.stringify(adalResponse)).to.deep.equal({
                                    Status: 'Insert',
                                    Key: `testKeyDIMX0`,
                                });
                                expect(adalResponse[9], JSON.stringify(adalResponse)).to.deep.equal({
                                    Status: 'Insert',
                                    Key: `testKeyDIMX9`,
                                });
                            });

                            it(`Export From Relation`, async () => {
                                const relationResponse = await dimxService.dataExport(addonUUID, schemaName, {
                                    Format: jsonCsv[i],
                                    Delimiter: ',',
                                });

                                dimxExport = await generalService.getAuditLogResultObjectIfValid(
                                    relationResponse.URI,
                                    90,
                                );

                                expect(
                                    dimxExport.Status?.ID,
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.equal(1);
                                const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                                    ? 'pfs.staging.pepperi'
                                    : generalService['client'].BaseURL.includes('papi-eu')
                                    ? 'eu.pfs.pepperi'
                                    : 'pfs.pepperi';
                                expect(
                                    dimxExport.AuditInfo.ResultObject,
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.include(`https://${testResponseEnvironment}`);

                                if (jsonCsv[i] == 'json') {
                                    expect(
                                        dimxExport.AuditInfo.ResultObject,
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.include(`.json`);
                                } else {
                                    expect(
                                        dimxExport.AuditInfo.ResultObject,
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.include(`.csv`);
                                }
                            });

                            it(`Export Content`, async () => {
                                const relationResponse = await generalService.fetchStatus(
                                    JSON.parse(dimxExport.AuditInfo.ResultObject).DownloadURL,
                                );
                                console.log({ URL: JSON.parse(dimxExport.AuditInfo.ResultObject) });
                                if (jsonCsv[i] == 'json') {
                                    relationResponse.Body.sort(compareByDescription);
                                    expect(
                                        relationResponse.Body[0],
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.contain({
                                        Version: 'TestForObjectSchema',
                                        Description: 'DIMX Test 0',
                                        Name: 'DIMX Test',
                                        Key: 'testKeyDIMX0',
                                        Number: 5,
                                        String: '5',
                                    });
                                    expect(
                                        relationResponse.Body[0].ArrayOfNumbers,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal([4, 33, 0, 11]);
                                    expect(
                                        relationResponse.Body[0].ArrayOfStrings,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal(['4', '33', '0', '11']);
                                    expect(
                                        relationResponse.Body[0].ObjectOfNumbers,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal({ a: 11, b: 0, c: 33, d: 4 });
                                    expect(
                                        relationResponse.Body[0].ObjectOfStrings,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal({ a: '11', b: '0', c: '33', d: '4' });
                                    expect(
                                        relationResponse.Body[9],
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.contain({
                                        Version: 'TestForObjectSchema',
                                        Description: 'DIMX Test 9',
                                        Name: 'DIMX Test',
                                        Key: 'testKeyDIMX9',
                                        Number: 5,
                                        String: '5',
                                    });
                                    expect(
                                        relationResponse.Body[9].ArrayOfNumbers,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal([4, 33, 0, 11]);
                                    expect(
                                        relationResponse.Body[9].ArrayOfStrings,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal(['4', '33', '0', '11']);
                                    expect(
                                        relationResponse.Body[9].ObjectOfNumbers,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal({ a: 11, b: 0, c: 33, d: 4 });
                                    expect(
                                        relationResponse.Body[9].ObjectOfStrings,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal({ a: '11', b: '0', c: '33', d: '4' });
                                } else {
                                    const NewRelationResponseArr =
                                        relationResponse.Body.Text.split('\n').sort(compareByDescription);
                                    expect(
                                        NewRelationResponseArr[1],
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.equal(
                                        `11,0,33,4,DIMX Test 0,5,"['4','33','0','11']",5,"[4,33,0,11]",TestForObjectSchema,11,0,33,4,DIMX Test,testKeyDIMX0`,
                                    );
                                    expect(
                                        NewRelationResponseArr[10],
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.equal(
                                        `11,0,33,4,DIMX Test 9,5,"['4','33','0','11']",5,"[4,33,0,11]",TestForObjectSchema,11,0,33,4,DIMX Test,testKeyDIMX9`,
                                    );
                                }
                            });

                            it(`Change Data Of Schema`, async () => {
                                const adalService = new ADALService(generalService.papiClient);
                                adalService.papiClient['options'].addonUUID = addonUUID;
                                adalService.papiClient['options'].addonSecretKey = secretKey;
                                const dataArr: AddonData[] = [];
                                for (let j = 0; j < 10; j++) {
                                    dataArr.push({
                                        Name: schemaName,
                                        Description: `DIMX Test ${j}`,
                                        Version: 'TestForObjectSchema Changed',
                                        Key: `testKeyDIMX${j}`,
                                        Number: 0,
                                        String: '0',
                                        ArrayOfNumbers: [11, 0, 33, 4],
                                        ObjectOfNumbers: { a: 4, b: 33, c: 0, d: 11 },
                                        ArrayOfStrings: ['11', '0', '33', '4'],
                                        ObjectOfStrings: { a: '4', b: '33', c: '0', d: '11' },
                                    });
                                }
                                const adalResponse = await adalService.postBatchDataToSchema(
                                    addonUUID,
                                    schemaName,
                                    dataArr,
                                );
                                expect(adalResponse[9], JSON.stringify(adalResponse)).to.deep.equal({
                                    Status: 'Update',
                                    Key: `testKeyDIMX9`,
                                });
                            });

                            it(`Export From Relation After Change`, async () => {
                                const relationResponse = await dimxService.dataExport(addonUUID, schemaName, {
                                    Format: jsonCsv[i],
                                    Delimiter: ',',
                                });
                                dimxExportAfterChange = await generalService.getAuditLogResultObjectIfValid(
                                    relationResponse.URI,
                                    90,
                                );

                                expect(
                                    dimxExportAfterChange.Status?.ID,
                                    JSON.stringify(dimxExportAfterChange.AuditInfo.ResultObject),
                                ).to.equal(1);
                                const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                                    ? 'pfs.staging.pepperi'
                                    : generalService['client'].BaseURL.includes('papi-eu')
                                    ? 'eu.pfs.pepperi'
                                    : 'pfs.pepperi';
                                expect(
                                    dimxExportAfterChange.AuditInfo.ResultObject,
                                    JSON.stringify(dimxExportAfterChange.AuditInfo.ResultObject),
                                ).to.include(`https://${testResponseEnvironment}`);

                                if (jsonCsv[i] == 'json') {
                                    expect(
                                        dimxExportAfterChange.AuditInfo.ResultObject,
                                        JSON.stringify(dimxExportAfterChange.AuditInfo.ResultObject),
                                    ).to.include(`.json`);
                                } else {
                                    expect(
                                        dimxExportAfterChange.AuditInfo.ResultObject,
                                        JSON.stringify(dimxExportAfterChange.AuditInfo.ResultObject),
                                    ).to.include(`.csv`);
                                }
                            });

                            it(`Export Content After Change (DI-19592)`, async () => {
                                const relationResponse = await generalService.fetchStatus(
                                    JSON.parse(dimxExportAfterChange.AuditInfo.ResultObject).DownloadURL,
                                );
                                console.log({ URL: JSON.parse(dimxExportAfterChange.AuditInfo.ResultObject) });

                                if (jsonCsv[i] == 'json') {
                                    relationResponse.Body.sort(compareByDescription);
                                    expect(
                                        relationResponse.Body[0],
                                        JSON.stringify(dimxExportAfterChange.AuditInfo.ResultObject),
                                    ).to.contain({
                                        Version: 'TestForObjectSchema Changed',
                                        Description: 'DIMX Test 0',
                                        Name: 'DIMX Test',
                                        Key: 'testKeyDIMX0',
                                        Number: 0,
                                        String: '0',
                                    });
                                    expect(
                                        relationResponse.Body[0].ArrayOfNumbers,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal([11, 0, 33, 4]);
                                    expect(
                                        relationResponse.Body[0].ArrayOfStrings,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal(['11', '0', '33', '4']);
                                    expect(
                                        relationResponse.Body[0].ObjectOfNumbers,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal({ a: 4, b: 33, c: 0, d: 11 });
                                    expect(
                                        relationResponse.Body[0].ObjectOfStrings,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal({ a: '4', b: '33', c: '0', d: '11' });
                                    expect(
                                        relationResponse.Body[9],
                                        JSON.stringify(dimxExportAfterChange.AuditInfo.ResultObject),
                                    ).to.contain({
                                        Version: 'TestForObjectSchema Changed',
                                        Description: 'DIMX Test 9',
                                        Name: 'DIMX Test',
                                        Key: 'testKeyDIMX9',
                                        Number: 0,
                                        String: '0',
                                    });
                                    expect(
                                        relationResponse.Body[9].ArrayOfNumbers,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal([11, 0, 33, 4]);
                                    expect(
                                        relationResponse.Body[9].ArrayOfStrings,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal(['11', '0', '33', '4']);
                                    expect(
                                        relationResponse.Body[9].ObjectOfNumbers,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal({ a: 4, b: 33, c: 0, d: 11 });
                                    expect(
                                        relationResponse.Body[9].ObjectOfStrings,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal({ a: '4', b: '33', c: '0', d: '11' });
                                } else {
                                    relationResponse.Body.Text = relationResponse.Body.Text.replaceAll(
                                        ' Changed',
                                        'Changed',
                                    );
                                    const NewRelationResponseArr =
                                        relationResponse.Body.Text.split('\n').sort(compareByDescription);
                                    expect(
                                        NewRelationResponseArr[1],
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.equal(
                                        `4,33,0,11,DIMX Test 0,0,"['11','0','33','4']",0,"[11,0,33,4]",TestForObjectSchemaChanged,4,33,0,11,DIMX Test,testKeyDIMX0`,
                                    );
                                    expect(
                                        NewRelationResponseArr[10],
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.equal(
                                        `4,33,0,11,DIMX Test 9,0,"['11','0','33','4']",0,"[11,0,33,4]",TestForObjectSchemaChanged,4,33,0,11,DIMX Test,testKeyDIMX9`,
                                    );
                                }
                            });

                            it(`Import With Relation Restore`, async () => {
                                const relationResponse = await dimxService.dataImport(addonUUID, schemaName, {
                                    URI: JSON.parse(dimxExport.AuditInfo.ResultObject).DownloadURL,
                                    OverwriteObject: false,
                                    Delimiter: ',',
                                });
                                dimxImport = await generalService.getAuditLogResultObjectIfValid(
                                    relationResponse.URI,
                                    90,
                                );

                                expect(
                                    dimxImport.Status?.ID,
                                    JSON.stringify(dimxImport.AuditInfo.ResultObject),
                                ).to.equal(1);
                                const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                                    ? 'cdn.staging.pepperi'
                                    : generalService['client'].BaseURL.includes('papi-eu')
                                    ? 'eucdn.pepperi'
                                    : 'cdn.pepperi';
                                expect(
                                    dimxImport.AuditInfo.ResultObject,
                                    JSON.stringify(dimxImport.AuditInfo.ResultObject),
                                ).to.include(`https://${testResponseEnvironment}`);
                            });

                            it(`Import Content After Restore`, async () => {
                                const relationResponse = await generalService.fetchStatus(
                                    JSON.parse(dimxImport.AuditInfo.ResultObject).DownloadURL,
                                );
                                console.log({ URL: JSON.parse(dimxImport.AuditInfo.ResultObject).DownloadURL });
                                relationResponse.Body.sort(compareByKey);
                                expect(
                                    relationResponse.Body[0],
                                    JSON.stringify(dimxImport.AuditInfo.ResultObject),
                                ).to.deep.equal({
                                    Status: 'Update',
                                    Key: 'testKeyDIMX0',
                                });
                                expect(
                                    relationResponse.Body[9],
                                    JSON.stringify(dimxImport.AuditInfo.ResultObject),
                                ).to.deep.equal({
                                    Status: 'Update',
                                    Key: 'testKeyDIMX9',
                                });
                            });

                            it(`Export From Relation After Restore`, async () => {
                                const relationResponse = await dimxService.dataExport(addonUUID, schemaName, {
                                    Format: jsonCsv[i],
                                    Delimiter: ',',
                                });
                                dimxExportAfterRestore = await generalService.getAuditLogResultObjectIfValid(
                                    relationResponse.URI,
                                    90,
                                );
                                expect(
                                    dimxExportAfterRestore.Status?.ID,
                                    JSON.stringify(dimxExportAfterRestore.AuditInfo.ResultObject),
                                ).to.equal(1);
                                const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                                    ? 'pfs.staging.pepperi'
                                    : generalService['client'].BaseURL.includes('papi-eu')
                                    ? 'eu.pfs.pepperi'
                                    : 'pfs.pepperi';
                                expect(
                                    dimxExportAfterRestore.AuditInfo.ResultObject,
                                    JSON.stringify(dimxExportAfterRestore.AuditInfo.ResultObject),
                                ).to.include(`https://${testResponseEnvironment}`);

                                if (jsonCsv[i] == 'json') {
                                    expect(
                                        dimxExport.AuditInfo.ResultObject,
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.include(`.json`);
                                } else {
                                    expect(
                                        dimxExport.AuditInfo.ResultObject,
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.include(`.csv`);
                                }
                            });

                            it(`Export Content After Restore`, async () => {
                                const relationResponse = await generalService.fetchStatus(
                                    JSON.parse(dimxExportAfterRestore.AuditInfo.ResultObject).DownloadURL,
                                );
                                console.log({ URL: JSON.parse(dimxExportAfterRestore.AuditInfo.ResultObject) });
                                if (jsonCsv[i] == 'json') {
                                    relationResponse.Body.sort(compareByDescription);
                                    expect(
                                        relationResponse.Body[0],
                                        JSON.stringify(dimxExportAfterRestore.AuditInfo.ResultObject),
                                    ).to.contain({
                                        Version: 'TestForObjectSchema',
                                        Description: 'DIMX Test 0',
                                        Name: 'DIMX Test',
                                        Key: 'testKeyDIMX0',
                                        Number: 5,
                                        String: '5',
                                    });
                                    expect(
                                        relationResponse.Body[0].ArrayOfNumbers,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal([4, 33, 0, 11]);
                                    expect(
                                        relationResponse.Body[0].ArrayOfStrings,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal(['4', '33', '0', '11']);
                                    expect(
                                        relationResponse.Body[0].ObjectOfNumbers,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal({ a: 11, b: 0, c: 33, d: 4 });
                                    expect(
                                        relationResponse.Body[0].ObjectOfStrings,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal({ a: '11', b: '0', c: '33', d: '4' });
                                    expect(
                                        relationResponse.Body[9],
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.contain({
                                        Version: 'TestForObjectSchema',
                                        Description: 'DIMX Test 9',
                                        Name: 'DIMX Test',
                                        Key: 'testKeyDIMX9',
                                        Number: 5,
                                        String: '5',
                                    });
                                    expect(
                                        relationResponse.Body[9].ArrayOfNumbers,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal([4, 33, 0, 11]);
                                    expect(
                                        relationResponse.Body[9].ArrayOfStrings,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal(['4', '33', '0', '11']);
                                    expect(
                                        relationResponse.Body[9].ObjectOfNumbers,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal({ a: 11, b: 0, c: 33, d: 4 });
                                    expect(
                                        relationResponse.Body[9].ObjectOfStrings,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal({ a: '11', b: '0', c: '33', d: '4' });
                                } else {
                                    const NewRelationResponseArr =
                                        relationResponse.Body.Text.split('\n').sort(compareByDescription);
                                    expect(
                                        NewRelationResponseArr[1],
                                        JSON.stringify(dimxExportAfterRestore.AuditInfo.ResultObject),
                                    ).to.equal(
                                        `11,0,33,4,DIMX Test 0,5,"['4','33','0','11']",5,"[4,33,0,11]",TestForObjectSchema,11,0,33,4,DIMX Test,testKeyDIMX0`,
                                    );
                                    expect(
                                        NewRelationResponseArr[10],
                                        JSON.stringify(dimxExportAfterRestore.AuditInfo.ResultObject),
                                    ).to.equal(
                                        `11,0,33,4,DIMX Test 9,5,"['4','33','0','11']",5,"[4,33,0,11]",TestForObjectSchema,11,0,33,4,DIMX Test,testKeyDIMX9`,
                                    );
                                }
                            });

                            it(`Reset Schema After`, async () => {
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
                                const newSchema = await adalService.postSchema({
                                    Name: schemaName,
                                    Type: 'data',
                                    Fields: {
                                        Name: { Type: 'String' },
                                        Description: { Type: 'String' },
                                        Key: { Type: 'String' },
                                        Column1: {
                                            Type: 'Array',
                                            Items: {
                                                Type: 'String',
                                            },
                                        } as any,
                                        object: {
                                            Type: 'Object',
                                            Fields: {
                                                Object: {
                                                    Type: 'Object',
                                                    Fields: {
                                                        Value1: { Type: 'Integer' },
                                                        Value2: { Type: 'Integer' },
                                                        Value3: { Type: 'Integer' },
                                                    },
                                                },
                                                String: { Type: 'String' },
                                                Array: {
                                                    Type: 'Array',
                                                    Items: { Type: 'String' },
                                                },
                                            },
                                        } as any,
                                        Number: { Type: 'Integer' },
                                        ArrayOfNumbers: {
                                            Type: 'Array',
                                            Items: { Type: 'Integer' },
                                        } as any,
                                        ObjectOfNumbers: {
                                            Type: 'Object',
                                            Fields: {
                                                a: { Type: 'Integer' },
                                                b: { Type: 'Integer' },
                                                c: { Type: 'Integer' },
                                                d: { Type: 'Integer' },
                                            },
                                        } as any,
                                    },
                                });
                                expect(purgedSchema).to.equal('');
                                expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaName);
                                expect(newSchema).to.have.property('Type').a('string').that.is.equal('data');
                            });

                            it(`Import With Relation Insert`, async () => {
                                const relationResponse = await dimxService.dataImport(addonUUID, schemaName, {
                                    URI: JSON.parse(dimxExport.AuditInfo.ResultObject).DownloadURL,
                                    OverwriteObject: false,
                                    Delimiter: ',',
                                });
                                dimxImportInsert = await generalService.getAuditLogResultObjectIfValid(
                                    relationResponse.URI,
                                    90,
                                );

                                expect(
                                    dimxImportInsert.Status?.ID,
                                    JSON.stringify(dimxImportInsert.AuditInfo.ResultObject),
                                ).to.equal(1);
                                const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                                    ? 'cdn.staging.pepperi'
                                    : generalService['client'].BaseURL.includes('papi-eu')
                                    ? 'eucdn.pepperi'
                                    : 'cdn.pepperi';
                                expect(
                                    dimxImportInsert.AuditInfo.ResultObject,
                                    JSON.stringify(dimxImportInsert.AuditInfo.ResultObject),
                                ).to.include(`https://${testResponseEnvironment}`);
                            });

                            it(`Import Content After Insert`, async () => {
                                const relationResponse = await generalService.fetchStatus(
                                    JSON.parse(dimxImportInsert.AuditInfo.ResultObject).DownloadURL,
                                );
                                console.log({ URL: JSON.parse(dimxImportInsert.AuditInfo.ResultObject).DownloadURL });
                                relationResponse.Body.sort(compareByKey);
                                expect(
                                    relationResponse.Body[0],
                                    JSON.stringify(dimxImportInsert.AuditInfo.ResultObject),
                                ).to.deep.equal({
                                    Status: 'Insert',
                                    Key: 'testKeyDIMX0',
                                });
                                expect(
                                    relationResponse.Body[9],
                                    JSON.stringify(dimxImportInsert.AuditInfo.ResultObject),
                                ).to.deep.equal({
                                    Status: 'Insert',
                                    Key: 'testKeyDIMX9',
                                });
                            });

                            it(`Export From Relation After Insert`, async () => {
                                const relationResponse = await dimxService.dataExport(addonUUID, schemaName, {
                                    Format: jsonCsv[i],
                                    Delimiter: ',',
                                });
                                dimxExportAfterInsert = await generalService.getAuditLogResultObjectIfValid(
                                    relationResponse.URI,
                                    90,
                                );
                                expect(
                                    dimxExportAfterInsert.Status?.ID,
                                    JSON.stringify(dimxExportAfterInsert.AuditInfo.ResultObject),
                                ).to.equal(1);
                                const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                                    ? 'pfs.staging.pepperi'
                                    : generalService['client'].BaseURL.includes('papi-eu')
                                    ? 'eu.pfs.pepperi'
                                    : 'pfs.pepperi';
                                expect(
                                    dimxExportAfterInsert.AuditInfo.ResultObject,
                                    JSON.stringify(dimxExportAfterInsert.AuditInfo.ResultObject),
                                ).to.include(`https://${testResponseEnvironment}`);

                                if (jsonCsv[i] == 'json') {
                                    expect(
                                        dimxExport.AuditInfo.ResultObject,
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.include(`.json`);
                                } else {
                                    expect(
                                        dimxExport.AuditInfo.ResultObject,
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.include(`.csv`);
                                }
                            });

                            it(`Export Content After Insert (DI-19592)`, async () => {
                                const relationResponse = await generalService.fetchStatus(
                                    JSON.parse(dimxExportAfterInsert.AuditInfo.ResultObject).DownloadURL,
                                );
                                console.log({ URL: JSON.parse(dimxExportAfterInsert.AuditInfo.ResultObject) });
                                if (jsonCsv[i] == 'json') {
                                    relationResponse.Body.sort(compareByDescription);
                                    expect(
                                        relationResponse.Body[0],
                                        JSON.stringify(dimxExportAfterInsert.AuditInfo.ResultObject),
                                    ).to.contain({
                                        Version: 'TestForObjectSchema',
                                        Description: 'DIMX Test 0',
                                        Name: 'DIMX Test',
                                        Key: 'testKeyDIMX0',
                                        Number: 5,
                                        String: '5',
                                    });
                                    expect(
                                        relationResponse.Body[0].ArrayOfNumbers,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal([4, 33, 0, 11]);
                                    expect(
                                        relationResponse.Body[0].ArrayOfStrings,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal(['4', '33', '0', '11']);
                                    expect(
                                        relationResponse.Body[0].ObjectOfNumbers,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal({ a: 11, b: 0, c: 33, d: 4 });
                                    expect(
                                        relationResponse.Body[0].ObjectOfStrings,
                                        JSON.stringify(relationResponse.Body[0]),
                                    ).to.deep.equal({ a: '11', b: '0', c: '33', d: '4' });
                                    expect(
                                        relationResponse.Body[9],
                                        JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                    ).to.contain({
                                        Version: 'TestForObjectSchema',
                                        Description: 'DIMX Test 9',
                                        Name: 'DIMX Test',
                                        Key: 'testKeyDIMX9',
                                        Number: 5,
                                        String: '5',
                                    });
                                    expect(
                                        relationResponse.Body[9].ArrayOfNumbers,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal([4, 33, 0, 11]);
                                    expect(
                                        relationResponse.Body[9].ArrayOfStrings,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal(['4', '33', '0', '11']);
                                    expect(
                                        relationResponse.Body[9].ObjectOfNumbers,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal({ a: 11, b: 0, c: 33, d: 4 });
                                    expect(
                                        relationResponse.Body[9].ObjectOfStrings,
                                        JSON.stringify(relationResponse.Body[9]),
                                    ).to.deep.equal({ a: '11', b: '0', c: '33', d: '4' });
                                } else {
                                    const NewRelationResponseArr =
                                        relationResponse.Body.Text.split('\n').sort(compareByDescription);
                                    expect(
                                        NewRelationResponseArr[1],
                                        JSON.stringify(dimxExportAfterInsert.AuditInfo.ResultObject),
                                    ).to.equal(
                                        `11,0,33,4,DIMX Test 0,5,"['4','33','0','11']",5,"[4,33,0,11]",TestForObjectSchema,11,0,33,4,DIMX Test,testKeyDIMX0`,
                                    );
                                    expect(
                                        NewRelationResponseArr[10],
                                        JSON.stringify(dimxExportAfterInsert.AuditInfo.ResultObject),
                                    ).to.equal(
                                        `11,0,33,4,DIMX Test 9,5,"['4','33','0','11']",5,"[4,33,0,11]",TestForObjectSchema,11,0,33,4,DIMX Test,testKeyDIMX9`,
                                    );
                                }
                            });
                        });
                    }
                });
            });
        }

        if (isPerformance) {
            describe(`Performance DIMX`, () => {
                const performanceTestArr = [
                    { SchemaSize: 100, Sufix: 'json', Name: '100JSON' },
                    { SchemaSize: 100, Sufix: 'csv', Name: '100CSV' },
                    { SchemaSize: 500, Sufix: 'json', Name: '500JSON' },
                    { SchemaSize: 500, Sufix: 'csv', Name: '500CSV' },
                    { SchemaSize: 2000, Sufix: 'json', Name: '2000JSON' },
                    { SchemaSize: 2000, Sufix: 'csv', Name: '2000CSV' },
                    // { SchemaSize: 8000, Sufix: 'json', Name: '8000JSON' },
                    // { SchemaSize: 8000, Sufix: 'csv', Name: '8000CSV' },
                    // { SchemaSize: 9500, Sufix: 'json', Name: '9500JSON' },
                    // { SchemaSize: 9500, Sufix: 'csv', Name: '9500CSV' },
                    // { SchemaSize: 9501, Sufix: 'json', Name: '9501JSON' },
                    // { SchemaSize: 9501, Sufix: 'csv', Name: '9501CSV' },
                    // { SchemaSize: 14000, Sufix: 'json', Name: '14000JSON' },
                    // { SchemaSize: 14000, Sufix: 'csv', Name: '14000CSV' },
                ];
                const dimxExportExportChangeImportExportAfterResultArr: {
                    Export?: number;
                    ExportChange?: number;
                    Import?: number;
                    ExportAfter?: number;
                }[] = [];
                for (let i = 0; i < performanceTestArr.length; i++) {
                    const performanceTest = performanceTestArr[i];
                    describe(`Create Schema For DIMX With: ${performanceTest.Name}`, () => {
                        let dimxImport;
                        let dimxExport;
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
                            const newSchema = await adalService.postSchema({
                                Name: schemaName,
                                Type: 'data',
                                Fields: {
                                    Name: { Type: 'String' },
                                    Description: { Type: 'String' },
                                    Key: { Type: 'String' },
                                    Column1: {
                                        Type: 'Array',
                                        Items: {
                                            Type: 'String',
                                        },
                                    } as any,
                                    object: {
                                        Type: 'Object',
                                        Fields: {
                                            Object: {
                                                Type: 'Object',
                                                Fields: {
                                                    Value1: { Type: 'Integer' },
                                                    Value2: { Type: 'Integer' },
                                                    Value3: { Type: 'Integer' },
                                                },
                                            },
                                            String: { Type: 'String' },
                                            Array: {
                                                Type: 'Array',
                                                Items: { Type: 'String' },
                                            },
                                        },
                                    } as any,
                                },
                            });
                            expect(purgedSchema).to.equal('');
                            expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaName);
                            expect(newSchema).to.have.property('Type').a('string').that.is.equal('data');
                        });

                        it(`Add Data To Schema`, async () => {
                            const adalService = new ADALService(generalService.papiClient);
                            adalService.papiClient['options'].addonUUID = addonUUID;
                            adalService.papiClient['options'].addonSecretKey = secretKey;
                            const SchemaPages = Math.ceil(performanceTest.SchemaSize / 500);
                            for (let j = 0; j < SchemaPages; j++) {
                                const dataArr: AddonData[] = [];
                                const SchemaSize = performanceTest.SchemaSize > 500 ? 500 : performanceTest.SchemaSize;
                                for (let i = 0; i < SchemaSize; i++) {
                                    dataArr.push({
                                        Name: schemaName,
                                        Description: `DIMX Test ${j * SchemaSize + i}`,
                                        Version: performanceTest.Name,
                                        Key: `testKeyDIMX${j * SchemaSize + i}`,
                                    });
                                }
                                const adalResponse = await adalService.postBatchDataToSchema(
                                    addonUUID,
                                    schemaName,
                                    dataArr,
                                );
                                expect(adalResponse[0], JSON.stringify(adalResponse)).to.deep.equal({
                                    Status: 'Insert',
                                    Key: `testKeyDIMX0${j * SchemaSize}`,
                                });
                            }
                        });

                        it(`Export From Relation`, async () => {
                            const relationResponse = await dimxService.dataExport(addonUUID, schemaName, {
                                Format: performanceTest.Sufix,
                                Delimiter: ',',
                            });
                            const start = performance.now();
                            dimxExport = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI, 90);
                            const end = performance.now();
                            dimxExportExportChangeImportExportAfterResultArr[i] = {
                                Export: Number(((end - start) / 1000).toFixed(2)),
                            };

                            expect(dimxExport.Status?.ID, JSON.stringify(dimxExport.AuditInfo.ResultObject)).to.equal(
                                1,
                            );
                            const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                                ? 'pfs.staging.pepperi'
                                : generalService['client'].BaseURL.includes('papi-eu')
                                ? 'eu.pfs.pepperi'
                                : 'pfs.pepperi';
                            expect(
                                dimxExport.AuditInfo.ResultObject,
                                JSON.stringify(dimxExport.AuditInfo.ResultObject),
                            ).to.include(`https://${testResponseEnvironment}`);
                        });

                        it(`Export Content`, async () => {
                            const relationResponse = await generalService.fetchStatus(
                                JSON.parse(dimxExport.AuditInfo.ResultObject).DownloadURL,
                            );
                            console.log({ URL: JSON.parse(dimxExport.AuditInfo.ResultObject) });
                            if (performanceTest.Sufix == 'json') {
                                relationResponse.Body.sort(compareByDescription);
                                expect(
                                    relationResponse.Body[0],
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal({
                                    Version: performanceTest.Name,
                                    Description: 'DIMX Test 0',
                                    Name: 'DIMX Test',
                                    Key: 'testKeyDIMX0',
                                });
                                expect(
                                    relationResponse.Body[performanceTest.SchemaSize - 1],
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal({
                                    Version: performanceTest.Name,
                                    Description: `DIMX Test ${performanceTest.SchemaSize - 1}`,
                                    Name: 'DIMX Test',
                                    Key: `testKeyDIMX${performanceTest.SchemaSize - 1}`,
                                });
                            } else {
                                const NewRelationResponseArr =
                                    relationResponse.Body.Text.split('\n').sort(compareByDescription);
                                expect(
                                    NewRelationResponseArr[1].split(','),
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal([performanceTest.Name, 'DIMX Test 0', 'DIMX Test', 'testKeyDIMX0']);
                                expect(
                                    NewRelationResponseArr[performanceTest.SchemaSize].split(','),
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal([
                                    performanceTest.Name,
                                    `DIMX Test ${performanceTest.SchemaSize - 1}`,
                                    `DIMX Test`,
                                    `testKeyDIMX${performanceTest.SchemaSize - 1}`,
                                ]);
                            }
                        });

                        it(`Change Data Of Schema`, async () => {
                            const adalService = new ADALService(generalService.papiClient);
                            adalService.papiClient['options'].addonUUID = addonUUID;
                            adalService.papiClient['options'].addonSecretKey = secretKey;
                            const SchemaPages = Math.ceil(performanceTest.SchemaSize / 500);
                            for (let j = 0; j < SchemaPages; j++) {
                                const dataArr: AddonData[] = [];
                                const SchemaSize = performanceTest.SchemaSize > 500 ? 500 : performanceTest.SchemaSize;
                                for (let i = 0; i < SchemaSize; i++) {
                                    dataArr.push({
                                        Name: schemaName,
                                        Description: `DIMX Test ${j * SchemaSize + i}`,
                                        Version: `${performanceTest.Name} Changed`,
                                        Key: `testKeyDIMX${j * SchemaSize + i}`,
                                    });
                                }
                                const adalResponse = await adalService.postBatchDataToSchema(
                                    addonUUID,
                                    schemaName,
                                    dataArr,
                                );
                                expect(adalResponse[0], JSON.stringify(adalResponse)).to.deep.equal({
                                    Status: 'Insert',
                                    Key: `testKeyDIMX${j * 500}`,
                                });
                                expect(
                                    adalResponse[
                                        performanceTest.SchemaSize > 499 ? 499 : performanceTest.SchemaSize - 1
                                    ],
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal({
                                    Status: 'Insert',
                                    Key: `testKeyDIMX${
                                        performanceTest.SchemaSize > 499
                                            ? (j + 1) * 500 - 1
                                            : performanceTest.SchemaSize - 1
                                    }`,
                                });
                            }
                        });

                        it(`Export From Relation After Change`, async () => {
                            const relationResponse = await dimxService.dataExport(addonUUID, schemaName, {
                                Format: performanceTest.Sufix,
                                Delimiter: ',',
                            });
                            const start = performance.now();
                            dimxExport = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI, 90);
                            const end = performance.now();
                            dimxExportExportChangeImportExportAfterResultArr[i] = {
                                Export: dimxExportExportChangeImportExportAfterResultArr[i].Export,
                                ExportChange: Number(((end - start) / 1000).toFixed(2)),
                            };
                            expect(dimxExport.Status?.ID, JSON.stringify(dimxExport.AuditInfo.ResultObject)).to.equal(
                                1,
                            );
                            const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                                ? 'pfs.staging.pepperi'
                                : generalService['client'].BaseURL.includes('papi-eu')
                                ? 'eu.pfs.pepperi'
                                : 'pfs.pepperi';
                            expect(
                                dimxExport.AuditInfo.ResultObject,
                                JSON.stringify(dimxExport.AuditInfo.ResultObject),
                            ).to.include(`https://${testResponseEnvironment}`);
                        });

                        it(`Export Content After Change`, async () => {
                            const relationResponse = await generalService.fetchStatus(
                                JSON.parse(dimxExport.AuditInfo.ResultObject).DownloadURL,
                            );
                            console.log({ URL: JSON.parse(dimxExport.AuditInfo.ResultObject) });
                            if (performanceTest.Sufix == 'json') {
                                relationResponse.Body.sort(compareByDescription);
                                expect(
                                    relationResponse.Body[0],
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal({
                                    Version: `${performanceTest.Name} Changed`,
                                    Description: 'DIMX Test 0',
                                    Name: 'DIMX Test',
                                    Key: 'testKeyDIMX0',
                                });
                                expect(
                                    relationResponse.Body[performanceTest.SchemaSize - 1],
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal({
                                    Version: `${performanceTest.Name} Changed`,
                                    Description: `DIMX Test ${performanceTest.SchemaSize - 1}`,
                                    Name: 'DIMX Test',
                                    Key: `testKeyDIMX${performanceTest.SchemaSize - 1}`,
                                });
                            } else {
                                relationResponse.Body.Text = relationResponse.Body.Text.replaceAll(
                                    ' Changed',
                                    'Changed',
                                );
                                const NewRelationResponseArr =
                                    relationResponse.Body.Text.split('\n').sort(compareByDescription);
                                expect(
                                    NewRelationResponseArr[1].split(','),
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal([
                                    `${performanceTest.Name}Changed`,
                                    'DIMX Test 0',
                                    'DIMX Test',
                                    'testKeyDIMX0',
                                ]);
                                expect(
                                    NewRelationResponseArr[performanceTest.SchemaSize].split(','),
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal([
                                    `${performanceTest.Name}Changed`,
                                    `DIMX Test ${performanceTest.SchemaSize - 1}`,
                                    `DIMX Test`,
                                    `testKeyDIMX${performanceTest.SchemaSize - 1}`,
                                ]);
                            }
                        });

                        it(`Import With Relation Restore`, async () => {
                            const relationResponse = await dimxService.dataImport(addonUUID, schemaName, {
                                URI: JSON.parse(dimxExport.AuditInfo.ResultObject).DownloadURL,
                                OverwriteObject: false,
                                Delimiter: ',',
                            });
                            const start = performance.now();
                            dimxImport = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI, 90);
                            const end = performance.now();
                            dimxExportExportChangeImportExportAfterResultArr[i] = {
                                Export: dimxExportExportChangeImportExportAfterResultArr[i].Export,
                                ExportChange: dimxExportExportChangeImportExportAfterResultArr[i].ExportChange,
                                Import: Number(((end - start) / 1000).toFixed(2)),
                            };
                            expect(dimxImport.Status?.ID, JSON.stringify(dimxImport.AuditInfo.ResultObject)).to.equal(
                                1,
                            );
                            const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                                ? 'pfs.staging.pepperi'
                                : generalService['client'].BaseURL.includes('papi-eu')
                                ? 'eu.pfs.pepperi'
                                : 'pfs.pepperi';
                            expect(
                                dimxImport.AuditInfo.ResultObject,
                                JSON.stringify(dimxImport.AuditInfo.ResultObject),
                            ).to.include(`https://${testResponseEnvironment}`);
                        });

                        it(`Import Content After Restore`, async () => {
                            const relationResponse = await generalService.fetchStatus(
                                JSON.parse(dimxImport.AuditInfo.ResultObject).DownloadURL,
                            );
                            console.log({ URL: JSON.parse(dimxImport.AuditInfo.ResultObject).DownloadURL });
                            relationResponse.Body.sort(compareByKey);
                            expect(
                                relationResponse.Body[0],
                                JSON.stringify(dimxExport.AuditInfo.ResultObject),
                            ).to.deep.equal({
                                Status: 'Update',
                                Key: 'testKeyDIMX0',
                            });
                            expect(
                                relationResponse.Body[performanceTest.SchemaSize - 1],
                                JSON.stringify(dimxExport.AuditInfo.ResultObject),
                            ).to.deep.equal({
                                Status: 'Update',
                                Key: `testKeyDIMX${performanceTest.SchemaSize - 1}`,
                            });
                        });

                        it(`Export From Relation After Restore`, async () => {
                            const relationResponse = await dimxService.dataExport(addonUUID, schemaName, {
                                Format: performanceTest.Sufix,
                                Delimiter: ',',
                            });
                            const start = performance.now();
                            dimxExport = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI, 90);
                            const end = performance.now();
                            dimxExportExportChangeImportExportAfterResultArr[i] = {
                                Export: dimxExportExportChangeImportExportAfterResultArr[i].Export,
                                ExportChange: dimxExportExportChangeImportExportAfterResultArr[i].ExportChange,
                                Import: dimxExportExportChangeImportExportAfterResultArr[i].Import,
                                ExportAfter: Number(((end - start) / 1000).toFixed(2)),
                            };
                            expect(dimxExport.Status?.ID, JSON.stringify(dimxExport.AuditInfo.ResultObject)).to.equal(
                                1,
                            );
                            const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                                ? 'pfs.staging.pepperi'
                                : generalService['client'].BaseURL.includes('papi-eu')
                                ? 'eu.pfs.pepperi'
                                : 'pfs.pepperi';
                            expect(
                                dimxExport.AuditInfo.ResultObject,
                                JSON.stringify(dimxExport.AuditInfo.ResultObject),
                            ).to.include(`https://${testResponseEnvironment}`);
                        });

                        it(`Export Content After Restore`, async () => {
                            const relationResponse = await generalService.fetchStatus(
                                JSON.parse(dimxExport.AuditInfo.ResultObject).DownloadURL,
                            );
                            console.log({ URL: JSON.parse(dimxExport.AuditInfo.ResultObject) });
                            if (performanceTest.Sufix == 'json') {
                                relationResponse.Body.sort(compareByDescription);
                                expect(
                                    relationResponse.Body[0],
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal({
                                    Version: performanceTest.Name,
                                    Description: 'DIMX Test 0',
                                    Name: 'DIMX Test',
                                    Key: 'testKeyDIMX0',
                                });
                                expect(
                                    relationResponse.Body[performanceTest.SchemaSize - 1],
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal({
                                    Version: performanceTest.Name,
                                    Description: `DIMX Test ${performanceTest.SchemaSize - 1}`,
                                    Name: 'DIMX Test',
                                    Key: `testKeyDIMX${performanceTest.SchemaSize - 1}`,
                                });
                            } else {
                                const NewRelationResponseArr =
                                    relationResponse.Body.Text.split('\n').sort(compareByDescription);
                                expect(
                                    NewRelationResponseArr[1].split(','),
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal([performanceTest.Name, 'DIMX Test 0', 'DIMX Test', 'testKeyDIMX0']);
                                expect(
                                    NewRelationResponseArr[performanceTest.SchemaSize].split(','),
                                    JSON.stringify(dimxExport.AuditInfo.ResultObject),
                                ).to.deep.equal([
                                    performanceTest.Name,
                                    `DIMX Test ${performanceTest.SchemaSize - 1}`,
                                    `DIMX Test`,
                                    `testKeyDIMX${performanceTest.SchemaSize - 1}`,
                                ]);
                            }
                        });
                    });
                }

                describe(`Performance Results`, () => {
                    for (let i = 2; i < performanceTestArr.length; i++) {
                        it(`For DIMX Of ${performanceTestArr[i].Name}`, async () => {
                            console.log(
                                `First: ${JSON.stringify(dimxExportExportChangeImportExportAfterResultArr[0])}`,
                            );
                            console.log(`This: ${JSON.stringify(dimxExportExportChangeImportExportAfterResultArr[i])}`);
                            const diffFromBase =
                                (performanceTestArr[i].SchemaSize / (performanceTestArr[0].SchemaSize * 5)) * 1.5;
                            console.log(JSON.stringify({ diffFromBase: diffFromBase }));
                            console.log(
                                `Export ${dimxExportExportChangeImportExportAfterResultArr[i].Export} below ${(
                                    Number(dimxExportExportChangeImportExportAfterResultArr[0].Export) * diffFromBase
                                ).toFixed(2)}`,
                            );
                            expect(
                                dimxExportExportChangeImportExportAfterResultArr[i].Export,
                                JSON.stringify(dimxExportExportChangeImportExportAfterResultArr),
                            ).to.be.below(
                                Number(dimxExportExportChangeImportExportAfterResultArr[0].Export) * diffFromBase,
                            );
                            console.log(
                                `ExportChange ${
                                    dimxExportExportChangeImportExportAfterResultArr[i].ExportChange
                                } below ${(
                                    Number(dimxExportExportChangeImportExportAfterResultArr[0].ExportChange) *
                                    diffFromBase
                                ).toFixed(2)}`,
                            );
                            expect(
                                dimxExportExportChangeImportExportAfterResultArr[i].ExportChange,
                                JSON.stringify(dimxExportExportChangeImportExportAfterResultArr),
                            ).to.be.below(
                                Number(dimxExportExportChangeImportExportAfterResultArr[0].ExportChange) * diffFromBase,
                            );
                            console.log(
                                `Import ${dimxExportExportChangeImportExportAfterResultArr[i].Import} below ${(
                                    Number(dimxExportExportChangeImportExportAfterResultArr[0].Import) * diffFromBase
                                ).toFixed(2)}`,
                            );
                            expect(
                                dimxExportExportChangeImportExportAfterResultArr[i].Import,
                                JSON.stringify(dimxExportExportChangeImportExportAfterResultArr),
                            ).to.be.below(
                                Number(dimxExportExportChangeImportExportAfterResultArr[0].Import) * diffFromBase,
                            );
                            console.log(
                                `ExportAfter ${
                                    dimxExportExportChangeImportExportAfterResultArr[i].ExportAfter
                                } below ${(
                                    Number(dimxExportExportChangeImportExportAfterResultArr[0].ExportAfter) *
                                    diffFromBase
                                ).toFixed(2)}`,
                            );
                            expect(
                                dimxExportExportChangeImportExportAfterResultArr[i].ExportAfter,
                                JSON.stringify(dimxExportExportChangeImportExportAfterResultArr),
                            ).to.be.below(
                                Number(dimxExportExportChangeImportExportAfterResultArr[0].ExportAfter) * diffFromBase,
                            );
                        });
                    }
                });
            });
        }
    });
}

const compareByDescription = (a, b) => {
    if (a.Description && b.Description) {
        const numA = Number(a.Description.split(' ')[2]);
        const numB = Number(b.Description.split(' ')[2]);
        if (numA < numB) {
            return -1;
        } else if (numA > numB) {
            return 1;
        } else {
            return 0;
        }
    } else {
        const numA = Number(a.split(/\DIMX Test /)[1]?.split(',')[0]);
        const numB = Number(b.split(/\DIMX Test /)[1]?.split(',')[0]);
        if (numA < numB) {
            return -1;
        } else if (numA > numB) {
            return 1;
        } else {
            return 0;
        }
    }
};

const compareByKey = (a, b) => {
    if (a.Key && b.Key) {
        const numA = Number(a.Key.split('DIMX')[1]);
        const numB = Number(b.Key.split('DIMX')[1]);
        if (numA < numB) {
            return -1;
        } else if (numA > numB) {
            return 1;
        } else {
            return 0;
        }
    } else {
        const numA = Number(a.split('DIMX')[3]);
        const numB = Number(b.split('DIMX')[3]);
        if (numA < numB) {
            return -1;
        } else if (numA > numB) {
            return 1;
        } else {
            return 0;
        }
    }
};
