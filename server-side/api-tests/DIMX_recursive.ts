import GeneralService, { TesterFunctions } from '../services/general.service';
import { AddonRelationService } from '../services/addon-relation.service';
import { ADALService } from '../services/adal.service';
import { DIMXService } from '../services/addon-data-import-export.service';
import { PFSService } from '../services/pfs.service';
import fs from 'fs';
import path from 'path';

export async function DIMXrecursive(generalService: GeneralService, request, tester: TesterFunctions) {
    const relationService = new AddonRelationService(generalService);
    const dimxService = new DIMXService(generalService.papiClient);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    let varKey;

    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const secretKey = await generalService.getSecretKey(addonUUID, varKey);
    const version = '0.0.5';

    const dimxName = generalService.papiClient['options'].baseURL.includes('staging')
        ? 'Export and Import Framework'
        : 'Export and Import Framework (DIMX)'; //to handle different DIMX names between envs
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', ''],
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, version],
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', ''],
    };
    testData[`${dimxName}`] = ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''];
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);

    if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
        generalService['client'].AddonSecretKey = await generalService.getSecretKey(
            generalService['client'].AddonUUID,
            varKey,
        );
    }

    //#region Upgrade Addons

    const hostSchemaName = 'recursiveImportTestHost';
    const referenceSchemaName = 'recursiveImportTestReference';
    const containedSchemaName = 'recursiveImportTestContained';
    const addonFunctionsFileName = 'recursive17.js';
    const addonRecursiveTestHostFunction = 'RecursiveImportTestHost_ImportRelativeURL';
    const addonRecursiveTestReferenceFunction = 'RecursiveImportTestReference_ImportRelativeURL';
    const addonRecursiveHostMappingFunction = 'RecursiveImportTestHost_MappingRelativeURL';
    const addonRecursiveReferenceTestReferenceFunction = 'RecursiveImportTestReference_MappingRelativeURL';
    const addonRecursiveImportTestContainedFunction = 'RecursiveImportTestContained_FixRelativeURL';
    //#endregion Upgrade Addons

    describe('DIMX recursive Tests Suites', () => {
        describe('Prerequisites Addon for DIMX recursive Tests', () => {
            //Test Data
            //DIMX recursive
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

        describe(`Create Function For Relation, File: ${addonFunctionsFileName}`, () => {
            it(`Post Function`, async () => {
                const adoonVersionResponse = await generalService.papiClient.addons.versions.find({
                    where: `AddonUUID='${addonUUID}' AND Version='${version}'`,
                });
                expect(adoonVersionResponse[0].AddonUUID).to.equal(addonUUID);
                expect(adoonVersionResponse[0].Version).to.equal(version);

                let base64File;
                if (generalService['client'].AssetsBaseUrl.includes('/localhost:')) {
                    const file = fs.readFileSync(
                        path.resolve(
                            __dirname.replace('\\build\\server-side', ''),
                            './test-data/recursiveFunctions.ts',
                        ),
                    );
                    base64File = file.toString('base64');
                } else {
                    //Changed to not use local files, but always the same file
                    base64File = Buffer.from(
                        `exports.AsIs = async (Client, Request) => {
                            return Request.body;
                        };

                        exports.RecursiveImportTestHost_ImportRelativeURL = async (Client, Request) => {
                            const addonUUID = Client.BaseURL.includes('staging')
                            ? '48d20f0b-369a-4b34-b48a-ffe245088513'
                            : '78696fc6-a04f-4f82-aadf-8f823776473f';
                            const name= 'recursiveImportTestHost';
                            const refName = 'recursiveImportTestReference';
                            const addonUUIDName = addonUUID + '_' + name;
                            const addonUUIDrefName = addonUUID + '_' + refName;

                            // this is our general mapping object, containing the mapping objects of all resources
                            if(Request.body["Mapping"]){
                                const mappingObject:{[addonUUID_resource:string]:{
                                    [original_key:string]:{Action:"Replace", NewKey:string}
                                }} = Request.body["Mapping"];

                                if(mappingObject[addonUUIDName] && mappingObject[addonUUIDrefName]){
                                    // myMapping is the specific mapping object of the Host resource
                                    const myMapping = mappingObject[addonUUIDName];
                                    // regMapping is the specific mapping object of the Reference resource
                                    const refMapping = mappingObject[addonUUIDrefName];

                                    if (Request.body && Request.body.DIMXObjects){
                                        for (let index = 0; index < Request.body.DIMXObjects.length; index++) {
                                            const element = Request.body.DIMXObjects[index];
                                            // change own key if myMapping contains a mapping for it
                                            if (myMapping[element.Object.Key]){
                                                element.Object.Key = myMapping[element.Object.Key].NewKey;
                                            }
                                            // change referenced key if refMapping contains a mapping for it
                                            if (refMapping[element.Object.Prop2]){
                                                element.Object.Prop2 = refMapping[element.Object.Prop2].NewKey;
                                            }
                                        }
                                    }
                                }
                            }

                            return Request.body;
                        };

                        exports.RecursiveImportTestReference_ImportRelativeURL = async (Client, Request) => {
                            const addonUUID = Client.BaseURL.includes('staging')
                            ? '48d20f0b-369a-4b34-b48a-ffe245088513'
                            : '78696fc6-a04f-4f82-aadf-8f823776473f';
                            const name= 'recursiveImportTestReference';
                            const addonUUIDName = addonUUID + '_' + name;
                            // this is our general mapping object, containing the mapping objects of all resources
                            if(Request.body["Mapping"]){
                                const mappingObject:{[addonUUID_resource:string]:{
                                    [original_key:string]:{Action:"Replace", NewKey:string}
                                }} = Request.body["Mapping"];

                                if(mappingObject[addonUUIDName]){
                                    // myMapping is the specific mapping object of the Reference resource
                                    const myMapping = mappingObject[addonUUIDName];
                                    if (Request.body && Request.body.DIMXObjects){
                                        for (let index = 0; index < Request.body.DIMXObjects.length; index++) {
                                            const element = Request.body.DIMXObjects[index];
                                            // change own key if myMapping contains a mapping for it
                                            if(myMapping[element.Object.Key]){
                                                element.Object.Key = myMapping[element.Object.Key].NewKey;
                                            }
                                        }
                                    }
                                }
                            }
                            return Request.body;
                        };

                        exports.RecursiveImportTestHost_MappingRelativeURL = async (Client, Request) => {
                            const mappingArray:{[original_key:string]:{Action:"Replace", NewKey:string}} = {};
                            const objects:any[] = Request.body.Objects;
                            objects.forEach(el => {
                                mappingArray[el.Key]= {Action:"Replace", NewKey:'Mapped ' + el.Key}
                            })
                            return {Mapping:mappingArray};
                        };

                        exports.RecursiveImportTestReference_MappingRelativeURL = async (Client, Request) => {
                            const mappingArray:{[original_key:string]:{Action:"Replace", NewKey:string}} = {};
                            const objects:any[] = Request.body.Objects;
                            objects.forEach(el => {
                                mappingArray[el.Key]= {Action:"Replace", NewKey:'Mapped ' + el.Key}
                            })
                            return {Mapping:mappingArray};
                        };

                        exports.RecursiveImportTestContained_FixRelativeURL = async (Client, Request) => {
                            const obj = Request.body["Object"];
                            obj["ContainedProp1"] = 'Fixed ' + obj["ContainedProp1"];
                            return obj;
                        };
                        `,
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
            it(`Post RecursiveImportTestContained Relation`, async () => {
                const relationResponse = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    {
                        Name: 'recursiveImportTestContained', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'DataImportResource', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        AddonRelativeURL: '', // mandatory on create
                        MappingRelativeURL: null,
                        FixRelativeURL: `/${addonFunctionsFileName}/${addonRecursiveImportTestContainedFunction}`,
                    },
                );
                expect(relationResponse).to.equal(200);
            });

            it(`Get RecursiveImportTestContained Relation`, async () => {
                const relationBody = {
                    Name: 'recursiveImportTestContained', // mandatory
                    AddonUUID: addonUUID, // mandatory
                    RelationName: 'DataImportResource', // mandatory
                    Type: 'AddonAPI', // mandatory on create
                    AddonRelativeURL: '', // mandatory on create
                };
                const relationResponse = await relationService.getRelationWithNameAndUUID(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    relationBody.Name,
                    addonUUID,
                );
                expect(relationResponse[0]).to.include({
                    ...relationBody,
                    Key: `${relationBody.Name}_${relationBody.AddonUUID}_${relationBody.RelationName}`,
                    Hidden: false,
                });
            });

            it(`Post RecursiveImportTestReference Relation`, async () => {
                const relationResponse = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    {
                        Name: 'recursiveImportTestReference', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'DataImportResource', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        AddonRelativeURL: `/${addonFunctionsFileName}/${addonRecursiveTestReferenceFunction}`, // mandatory on create
                        MappingRelativeURL: `/${addonFunctionsFileName}/${addonRecursiveReferenceTestReferenceFunction}`,
                    },
                );
                expect(relationResponse).to.equal(200);
            });

            // it(`Get RecursiveImportTestReference Relation`, async () => {
            //     const relationBody = {
            //         Name: 'recursiveImportTestReference', // mandatory
            //         AddonUUID: addonUUID, // mandatory
            //         RelationName: 'DataImportResource', // mandatory
            //         Type: 'AddonAPI', // mandatory on create
            //         AddonRelativeURL: `/${addonFunctionsFileName}/${addonRecursiveTestReferenceFunction}`, // mandatory on create
            //         MappingRelativeURL: `/${addonFunctionsFileName}/${addonRecursiveReferenceTestReferenceFunction}`,
            //     };
            //     const relationResponse = await relationService.getRelationWithNameAndUUID(
            //         {
            //             'X-Pepperi-OwnerID': addonUUID,
            //             'X-Pepperi-SecretKey': secretKey,
            //         },
            //         relationBody.Name,
            //         addonUUID,
            //     );
            //     expect(relationResponse[0]).to.include({
            //         ...relationBody,
            //         Key: `${relationBody.Name}_${relationBody.AddonUUID}_${relationBody.RelationName}`,
            //         Hidden: false,
            //     });
            // });

            it(`Post RecursiveImportTestHost Relation`, async () => {
                const relationResponse = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    {
                        Name: 'recursiveImportTestHost', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'DataImportResource', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        AddonRelativeURL: `/${addonFunctionsFileName}/${addonRecursiveTestHostFunction}`, // mandatory on create
                        MappingRelativeURL: `/${addonFunctionsFileName}/${addonRecursiveHostMappingFunction}`,
                    },
                );
                expect(relationResponse).to.equal(200);
            });

            // it(`Get RecursiveImportTestHost Relation`, async () => {
            //     const relationBody = {
            //         Name: 'recursiveImportTestHost', // mandatory
            //         AddonUUID: addonUUID, // mandatory
            //         RelationName: 'DataImportResource', // mandatory
            //         Type: 'AddonAPI', // mandatory on create
            //         AddonRelativeURL: `/${addonFunctionsFileName}/${addonRecursiveTestHostFunction}`, // mandatory on create
            //         MappingRelativeURL: `/${addonFunctionsFileName}/${addonRecursiveHostMappingFunction}`,
            //     };
            //     const relationResponse = await relationService.getRelationWithNameAndUUID(
            //         {
            //             'X-Pepperi-OwnerID': addonUUID,
            //             'X-Pepperi-SecretKey': secretKey,
            //         },
            //         relationBody.Name,
            //         addonUUID,
            //     );
            //     expect(relationResponse[0]).to.include({
            //         ...relationBody,
            //         Key: `${relationBody.Name}_${relationBody.AddonUUID}_${relationBody.RelationName}`,
            //         Hidden: false,
            //     });
            // });

            it(`Post RecursiveImportTestReference Relation`, async () => {
                const relationResponse = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    {
                        Name: 'recursiveImportTestReference', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'DataExportResource', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        AddonRelativeURL: '', // mandatory on create
                    },
                );
                expect(relationResponse).to.equal(200);
            });

            it(`Get RecursiveImportTestReference Relation`, async () => {
                const relationBody = {
                    Name: 'recursiveImportTestReference', // mandatory
                    AddonUUID: addonUUID, // mandatory
                    RelationName: 'DataExportResource', // mandatory
                    Type: 'AddonAPI', // mandatory on create
                    AddonRelativeURL: '', // mandatory on create
                };
                const relationResponse = await relationService.getRelationWithNameAndUUID(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    relationBody.Name,
                    addonUUID,
                );
                expect(relationResponse[0]).to.include({
                    ...relationBody,
                    Key: `${relationBody.Name}_${relationBody.AddonUUID}_${relationBody.RelationName}`,
                    Hidden: false,
                });
            });

            it(`Post RecursiveImportTestHost Relation`, async () => {
                const relationResponse = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    {
                        Name: 'recursiveImportTestHost', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'DataExportResource', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        AddonRelativeURL: '', // mandatory on create
                    },
                );
                expect(relationResponse).to.equal(200);
            });

            it(`Get RecursiveImportTestHost Relation`, async () => {
                const relationBody = {
                    Name: 'recursiveImportTestHost', // mandatory
                    AddonUUID: addonUUID, // mandatory
                    RelationName: 'DataExportResource', // mandatory
                    Type: 'AddonAPI', // mandatory on create
                    AddonRelativeURL: '', // mandatory on create
                };
                const relationResponse = await relationService.getRelationWithNameAndUUID(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    relationBody.Name,
                    addonUUID,
                );
                expect(relationResponse[0]).to.include({
                    ...relationBody,
                    Key: `${relationBody.Name}_${relationBody.AddonUUID}_${relationBody.RelationName}`,
                    Hidden: false,
                });
            });
        });

        describe(`Create Schemas For Recursive DIMX With JSON`, () => {
            let recursiveExportResponse;
            it(`Reset host Schema`, async () => {
                const adalService = new ADALService(generalService.papiClient);
                adalService.papiClient['options'].addonUUID = addonUUID;
                adalService.papiClient['options'].addonSecretKey = secretKey;
                let purgedSchema;
                try {
                    purgedSchema = await adalService.deleteSchema(hostSchemaName);
                } catch (error) {
                    purgedSchema = '';
                    expect(error)
                        .to.have.property('message')
                        .that.includes(
                            `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist`,
                        );
                }
                const newSchema = await adalService.postSchema({
                    Name: hostSchemaName,
                    Type: 'data',
                    Fields: {
                        Key: { Type: 'String' },
                        Prop1: { Type: 'String' },
                        Prop2: {
                            Type: 'Resource',
                            AddonUUID: addonUUID,
                            Resource: referenceSchemaName,
                        },
                        Prop3: {
                            Type: 'Object',
                        },
                    },
                } as any);
                expect(purgedSchema).to.equal('');
                expect(newSchema).to.have.property('Name').a('string').that.is.equal(hostSchemaName);
                expect(newSchema).to.have.property('Type').a('string').that.is.equal('data');
            });

            it(`Reset reference Schema`, async () => {
                const adalService = new ADALService(generalService.papiClient);
                adalService.papiClient['options'].addonUUID = addonUUID;
                adalService.papiClient['options'].addonSecretKey = secretKey;
                let purgedSchema;
                try {
                    purgedSchema = await adalService.deleteSchema(referenceSchemaName);
                } catch (error) {
                    purgedSchema = '';
                    expect(error)
                        .to.have.property('message')
                        .that.includes(
                            `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist`,
                        );
                }
                const newSchema = await adalService.postSchema({
                    Name: referenceSchemaName,
                    Type: 'data',
                    Fields: {
                        ContainedInnerStringData: { Type: 'String' },
                        ContainedInnerIntegerData: { Type: 'Integer' },
                    },
                } as any);
                expect(purgedSchema).to.equal('');
                expect(newSchema).to.have.property('Name').a('string').that.is.equal(referenceSchemaName);
                expect(newSchema).to.have.property('Type').a('string').that.is.equal('data');
            });

            it(`Reset contained Schema`, async () => {
                const adalService = new ADALService(generalService.papiClient);
                adalService.papiClient['options'].addonUUID = addonUUID;
                adalService.papiClient['options'].addonSecretKey = secretKey;
                let purgedSchema;
                try {
                    purgedSchema = await adalService.deleteSchema(containedSchemaName);
                } catch (error) {
                    purgedSchema = '';
                    expect(error)
                        .to.have.property('message')
                        .that.includes(
                            `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist`,
                        );
                }
                const newSchema = await adalService.postSchema({
                    Name: containedSchemaName,
                    Type: 'data',
                    Fields: {
                        ContainedProp1: { Type: 'String' },
                    },
                } as any);
                expect(purgedSchema).to.equal('');
                expect(newSchema).to.have.property('Name').a('string').that.is.equal(containedSchemaName);
                expect(newSchema).to.have.property('Type').a('string').that.is.equal('data');
            });

            it(`Add Data To RecursiveImportTestHost Table`, async () => {
                const adalService = new ADALService(generalService.papiClient);
                adalService.papiClient['options'].addonUUID = addonUUID;
                adalService.papiClient['options'].addonSecretKey = secretKey;
                await dimxService.insertDataToSchemeDIMX(addonUUID, hostSchemaName, {
                    Objects: [
                        {
                            Key: 'HostKey1',
                            Prop1: 'HostValue1',
                            Prop2: 'ReferenceKey1',
                        },
                        {
                            Key: 'HostKey2',
                            Prop1: 'HostValue2',
                            Prop2: 'ReferenceKey2',
                        },
                        {
                            Key: 'HostKey3',
                            Prop1: 'HostValue3',
                            Prop2: 'ReferenceKey3',
                        },
                    ],
                });
            });

            it(`Add Data To RecursiveImportTestReference Table`, async () => {
                const adalService = new ADALService(generalService.papiClient);
                adalService.papiClient['options'].addonUUID = addonUUID;
                adalService.papiClient['options'].addonSecretKey = secretKey;
                await dimxService.insertDataToSchemeDIMX(addonUUID, referenceSchemaName, {
                    Objects: [
                        {
                            Key: 'ReferenceKey1',
                            Prop1: 'ReferenceValue1',
                            Prop2: {
                                ContainedProp1: 'ContainedValue1',
                            },
                        },
                        {
                            Key: 'ReferenceKey2',
                            Prop1: 'ReferenceValue2',
                            Prop2: {
                                ContainedProp1: 'ContainedValue2',
                            },
                        },
                        {
                            Key: 'ReferenceKey3',
                            Prop1: 'ReferenceValue3',
                            Prop2: {
                                ContainedProp1: 'ContainedValue3',
                            },
                        },
                    ],
                });
            });

            it(`Recursive export`, async () => {
                debugger;
                const pfsService = new PFSService(generalService);
                const distributor = await pfsService.getDistributor();
                const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                    ? 'pfs.staging.pepperi'
                    : generalService['client'].BaseURL.includes('papi-eu')
                    ? 'eupfs.pepperi'
                    : 'pfs.pepperi';
                const mappingObject = {};
                mappingObject[`${addonUUID}_recursiveImportTestReference`] = {
                    ReferenceKey2: {
                        Action: 'Replace',
                        NewKey: 'Mapped ReferenceKey2',
                    },
                    ReferenceKey1: {
                        Action: 'Replace',
                        NewKey: 'Mapped ReferenceKey1',
                    },
                    ReferenceKey3: {
                        Action: 'Replace',
                        NewKey: 'Mapped ReferenceKey3',
                    },
                };
                mappingObject[`${addonUUID}_recursiveImportTestHost`] = {
                    HostKey2: {
                        Action: 'Replace',
                        NewKey: 'Mapped HostKey2',
                    },
                    HostKey1: {
                        Action: 'Replace',
                        NewKey: 'Mapped HostKey1',
                    },
                    HostKey3: {
                        Action: 'Replace',
                        NewKey: 'Mapped HostKey3',
                    },
                };
                recursiveExportResponse = await dimxService.recursiveExport(addonUUID, hostSchemaName);
                expect(recursiveExportResponse)
                    .to.have.property('URI')
                    .that.is.a('string')
                    .and.includes('/audit_logs/');
                expect(recursiveExportResponse).to.have.property('ExecutionUUID').that.is.a('string').and.is.not.empty;
                const getAuditResponse = await generalService.getAuditLogResultObjectIfValid(
                    recursiveExportResponse.URI,
                    30,
                );
                const resultObject = JSON.parse(getAuditResponse.AuditInfo.ResultObject);
                expect(resultObject).to.have.property('URI').that.is.a('string').and.includes(distributor.UUID);
                expect(resultObject).to.have.property('URI').that.is.a('string').and.includes('/DIMXUploadedFiles/');
                expect(resultObject).to.have.property('URI').that.is.a('string').and.includes(testResponseEnvironment);
                expect(resultObject)
                    .to.have.property('DistributorUUID')
                    .that.is.a('string')
                    .and.equals(distributor.UUID);
                expect(resultObject).to.have.property('Version').that.is.a('string');
                expect(resultObject).to.have.property('Resources').that.is.an('array');
                recursiveExportResponse = resultObject;
            });

            it(`Create Mapping`, async () => {
                const mappingObject = {};
                mappingObject[`${addonUUID}_recursiveImportTestReference`] = {
                    ReferenceKey2: {
                        Action: 'Replace',
                        NewKey: 'Mapped ReferenceKey2',
                    },
                    ReferenceKey1: {
                        Action: 'Replace',
                        NewKey: 'Mapped ReferenceKey1',
                    },
                    ReferenceKey3: {
                        Action: 'Replace',
                        NewKey: 'Mapped ReferenceKey3',
                    },
                };
                mappingObject[`${addonUUID}_recursiveImportTestHost`] = {
                    HostKey2: {
                        Action: 'Replace',
                        NewKey: 'Mapped HostKey2',
                    },
                    HostKey1: {
                        Action: 'Replace',
                        NewKey: 'Mapped HostKey1',
                    },
                    HostKey3: {
                        Action: 'Replace',
                        NewKey: 'Mapped HostKey3',
                    },
                };
                const mappingResponse = await dimxService.mapping(addonUUID, hostSchemaName, recursiveExportResponse);
                expect(mappingResponse.Mapping).to.deep.equal(mappingObject);
            });

            it(`Recursive import + verify files`, async () => {
                const testResponseEnvironment = generalService['client'].BaseURL.includes('staging')
                    ? 'cdn.staging.pepperi'
                    : generalService['client'].BaseURL.includes('papi-eu')
                    ? 'eucdn.pepperi'
                    : 'cdn.pepperi';
                const mappingObject = {};
                mappingObject[`${addonUUID}_recursiveImportTestReference`] = {
                    ReferenceKey2: {
                        Action: 'Replace',
                        NewKey: 'Mapped ReferenceKey2',
                    },
                    ReferenceKey1: {
                        Action: 'Replace',
                        NewKey: 'Mapped ReferenceKey1',
                    },
                    ReferenceKey3: {
                        Action: 'Replace',
                        NewKey: 'Mapped ReferenceKey3',
                    },
                };
                mappingObject[`${addonUUID}_recursiveImportTestHost`] = {
                    HostKey2: {
                        Action: 'Replace',
                        NewKey: 'Mapped HostKey2',
                    },
                    HostKey1: {
                        Action: 'Replace',
                        NewKey: 'Mapped HostKey1',
                    },
                    HostKey3: {
                        Action: 'Replace',
                        NewKey: 'Mapped HostKey3',
                    },
                };
                recursiveExportResponse['Mapping'] = mappingObject;
                let recursiveImportResponse = await dimxService.recursiveImport(
                    addonUUID,
                    hostSchemaName,
                    recursiveExportResponse,
                );
                expect(recursiveImportResponse)
                    .to.have.property('URI')
                    .that.is.a('string')
                    .and.includes('/audit_logs/');
                expect(recursiveImportResponse).to.have.property('ExecutionUUID').that.is.a('string').and.is.not.empty;
                const getAuditResponse = await generalService.getAuditLogResultObjectIfValid(
                    recursiveImportResponse.URI,
                    30,
                );
                const resultObject = JSON.parse(getAuditResponse.AuditInfo.ResultObject);
                expect(resultObject).to.have.property('URI').that.is.a('string').and.includes(testResponseEnvironment);
                expect(resultObject).to.have.property('URI').that.is.a('string').and.includes('/TemporaryFiles/');
                expect(resultObject).to.have.property('AddonUUID').that.is.a('string').that.equals(addonUUID);
                expect(resultObject).to.have.property('Resources').that.is.an('array');
                expect(resultObject).to.have.property('Resource').that.equals(hostSchemaName);
                expect(resultObject.Resources[0])
                    .to.have.property('URI')
                    .that.is.a('string')
                    .and.includes(testResponseEnvironment);
                expect(resultObject.Resources[0])
                    .to.have.property('URI')
                    .that.is.a('string')
                    .and.includes('/TemporaryFiles/');
                expect(resultObject.Resources[0])
                    .to.have.property('AddonUUID')
                    .that.is.a('string')
                    .that.equals(addonUUID);
                expect(resultObject.Resources[0]).to.have.property('Resource').that.equals(referenceSchemaName);
                recursiveImportResponse = resultObject;
                const recursiveImportCDN = await generalService
                    .fetchStatus(recursiveImportResponse.URI, {
                        method: 'GET',
                    })
                    .then((res) => res.Body);
                const recursiveImportResourceCDN: any[] = await generalService
                    .fetchStatus(recursiveImportResponse.Resources[0].URI, {
                        method: 'GET',
                    })
                    .then((res) => res.Body);

                const recursiveImportResourceCDN0 = recursiveImportResourceCDN.find(
                    (elem) => elem.Key === 'Mapped ReferenceKey1',
                );
                const recursiveImportResourceCDN1 = recursiveImportResourceCDN.find(
                    (elem) => elem.Key === 'Mapped ReferenceKey2',
                );
                const recursiveImportResourceCDN3 = recursiveImportResourceCDN.find(
                    (elem) => elem.Key === 'Mapped ReferenceKey3',
                );
                const recursiveImportCDN0 = recursiveImportCDN.find((elem) => elem.Key === 'Mapped HostKey2');
                const recursiveImportCDN1 = recursiveImportCDN.find((elem) => elem.Key === 'Mapped HostKey1');
                const recursiveImportCDN2 = recursiveImportCDN.find((elem) => elem.Key === 'Mapped HostKey3');

                expect(recursiveImportResourceCDN).to.be.an('array').with.lengthOf(3);
                expect(recursiveImportResourceCDN1).to.have.property('Key').that.equals('Mapped ReferenceKey2');
                expect(recursiveImportResourceCDN1).to.have.property('Status').that.equals('Insert');
                expect(recursiveImportResourceCDN0).to.have.property('Key').that.equals('Mapped ReferenceKey1');
                expect(recursiveImportResourceCDN0).to.have.property('Status').that.equals('Insert');
                expect(recursiveImportResourceCDN3).to.have.property('Key').that.equals('Mapped ReferenceKey3');
                expect(recursiveImportResourceCDN3).to.have.property('Status').that.equals('Insert');
                expect(recursiveImportCDN0).to.have.property('Key').that.equals('Mapped HostKey2');
                expect(recursiveImportCDN0).to.have.property('Status').that.equals('Insert');
                expect(recursiveImportCDN1).to.have.property('Key').that.equals('Mapped HostKey1');
                expect(recursiveImportCDN1).to.have.property('Status').that.equals('Insert');
                expect(recursiveImportCDN2).to.have.property('Key').that.equals('Mapped HostKey3');
                expect(recursiveImportCDN2).to.have.property('Status').that.equals('Insert');
            });
        });
    });
}
