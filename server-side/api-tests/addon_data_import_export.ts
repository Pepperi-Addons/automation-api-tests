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
    };
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
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
                const newSchema = await adalService.postSchema({
                    Name: schemaName,
                    Type: 'data',
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
            describe(`Export JSON`, () => {
                let dimxExportDefult;
                it(`Export From Relation`, async () => {
                    const relationResponse = await dimxService.dataExport(addonUUID, schemaName);
                    dimxExportDefult = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI);
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
                            path.resolve(__dirname.replace('\\build\\server-side', ''), './test-data/import.json.js'),
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
                    dimxExportDefult = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI);
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
                        { Key: 'testKeyDIMX3', Status: 'Ignore' },
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
                    dimxExportDefult = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI);
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
                    const newDimxExport = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI);

                    let contentFromFileAsArr;
                    if (generalService['client'].AssetsBaseUrl.includes('/localhost:')) {
                        //js instead of json since build process ignore json in intention
                        const file = fs.readFileSync(
                            path.resolve(__dirname.replace('\\build\\server-side', ''), './test-data/import.json.js'),
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

            describe(`Export CSV`, () => {
                let dimxExportCsv;
                it(`Export From Relation`, async () => {
                    const relationResponse = await dimxService.dataExport(addonUUID, schemaName, {
                        Format: 'csv',
                    });
                    dimxExportCsv = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI);
                    expect(dimxExportCsv.Status?.ID, JSON.stringify(dimxExportCsv.AuditInfo.ResultObject)).to.equal(1);
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

                it(`Export Content`, async () => {
                    const relationResponse = await generalService.fetchStatus(
                        JSON.parse(dimxExportCsv.AuditInfo.ResultObject).DownloadURL,
                    );
                    console.log({ URL: JSON.parse(dimxExportCsv.AuditInfo.ResultObject) });
                    expect(relationResponse.Body.Text, JSON.stringify(dimxExportCsv.AuditInfo.ResultObject)).to.equal(
                        'Description;Column1.0;Column1.1;Column1.2;Name;Key\n' +
                            'DIMX Test 1;Value1;Value2;Value3;DIMX Test;testKeyDIMX1\n' +
                            'DIMX Test 2;Value1;Value2;Value3;DIMX Test;testKeyDIMX2\n' +
                            'DIMX Test 3;Value1;Value2;Value3;DIMX Test;testKeyDIMX3',
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
                            path.resolve(__dirname.replace('\\build\\server-side', ''), './test-data/import.csv.js'),
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
                    dimxExportCsv = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI);
                    expect(dimxExportCsv.Status?.ID, JSON.stringify(dimxExportCsv.AuditInfo.ResultObject)).to.equal(1);
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
                        { Key: 'testKeyDIMX1', Status: 'Ignore' },
                        { Key: 'testKeyDIMX2', Status: 'Ignore' },
                        { Key: 'testKeyDIMX3', Status: 'Ignore' },
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
                    dimxExportCsv = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI);
                    expect(dimxExportCsv.Status?.ID, JSON.stringify(dimxExportCsv.AuditInfo.ResultObject)).to.equal(1);
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
                    const newDimxExport = await generalService.getAuditLogResultObjectIfValid(relationResponse.URI);

                    let contentFromFileAsArr;
                    if (generalService['client'].AssetsBaseUrl.includes('/localhost:')) {
                        //js instead of json since build process ignore json in intention
                        const file = fs.readFileSync(
                            path.resolve(__dirname.replace('\\build\\server-side', ''), './test-data/import.csv.js'),
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
                    const contentFromFileWithFixedDelimiterAsArr:string[] = []
                    for (let i = 0; i < contentFromFileAsArr.length; i++) {
                        contentFromFileWithFixedDelimiterAsArr.push(contentFromFileAsArr[i].replaceAll(',', ';'));
                    }
                    expect(NewRelationResponseArr, JSON.stringify(NewRelationResponse)).to.deep.equal(
                        contentFromFileWithFixedDelimiterAsArr,
                    );
                });
            });
        });
    });
}
