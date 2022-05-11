import GeneralService, { TesterFunctions } from '../services/general.service';
import { UDCService } from '../services/user-defined-collections.service';

export async function UDCTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    const udcService = new UDCService(generalService, UserDefinedCollectionsUUID);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade UDC
    const testData = {
        'User Defined Collections': [UserDefinedCollectionsUUID, ''],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
    };

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Upgrade UDC

    describe('UDC Tests Suites', () => {
        describe('Prerequisites Addon for UDC Tests', () => {
            //Test Data
            //UDC
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

        describe('CRUD Collection Scheme', () => {
            const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
            const collectionName = 'Collection_Name_' + Math.floor(Math.random() * 1000000).toString();
            const schemaTestData = {
                Name: collectionName,
                Description: tempDescription,
                CompositeKeyFields: ['Field1', 'Field2'],
                CompositeKeyType: 'Key',
                Fields: {
                    StringField1: {
                        Type: 'String',
                        Mandatory: true,
                    },
                    StringField2: {
                        Type: 'String',
                        Mandatory: true,
                    },
                    IntegerField1: {
                        Type: 'Integer',
                        Mandatory: false,
                    },
                    IntegerField2: {
                        Type: 'Integer',
                        Mandatory: false,
                    },
                    OptionalValuesField: {
                        OptionalValues: ['1', '2', '3'],
                        Type: 'Integer',
                        Mandatory: false,
                    },
                    StringArray: {
                        Type: 'Array',
                        Items: {
                            Type: 'String',
                        },
                        Mandatory: false,
                    },
                    IntegerArray: {
                        Type: 'Array',
                        Items: {
                            Type: 'Integer',
                        },
                        Mandatory: false,
                    },
                },
            };
            let schemeBeforeArr;

            it(`Get Collections Scheme Before`, async () => {
                schemeBeforeArr = await udcService.getSchemes();
                expect(schemeBeforeArr).to.be.an('array');
            });

            it(`Validate Correct Error Reject Message`, async () => {
                await expect(udcService.postScheme(schemaTestData)).eventually.to.be.rejectedWith(
                    `https://papi.staging.pepperi.com/V1.0/user_defined_collections/schemes failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Fields.OptionalValuesField does not match allOf schema [subschema 1] with 3 error[s]:\\nFields.OptionalValuesField.OptionalValues[0] does not meet maximum length of 0\\nFields.OptionalValuesField.OptionalValues[1] does not meet maximum length of 0\\nFields.OptionalValuesField.OptionalValues[2] does not meet maximum length of 0\\ninstance requires property \\"ListView\\"`,
                );
            });
            //TODO: Create CRUD test when possible after API changed to block some API configuration that are not supported by the UI
            /*it(`Create`, async () => {
                const postSchemeResponse = await udcService.postScheme(schemaTestData);
                expect(postSchemeResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postSchemeResponse.CreationDateTime).to.include('Z');
                expect(postSchemeResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postSchemeResponse.ModificationDateTime).to.include('Z');
                expect(postSchemeResponse['CompositeKeyFields'])
                    .to.be.an('array')
                    .that.deep.equals(schemaTestData.CompositeKeyFields);
                expect(postSchemeResponse['CompositeKeyType']).to.equal(schemaTestData.CompositeKeyType);
                expect(postSchemeResponse.Description).to.equal(tempDescription);
                expect(postSchemeResponse.Name).to.equal(collectionName);
                expect(postSchemeResponse.Type).to.equal('meta_data');
                expect(postSchemeResponse.Hidden).to.be.false;
                expect(postSchemeResponse.Fields).to.deep.equal(schemaTestData.Fields);
            });

            it(`Validate Plus One`, async () => {
                const collectionSchemeAfterPostArr = await udcService.getSchemes();
                expect(collectionSchemeAfterPostArr.length).to.equal(schemeBeforeArr.length + 1);
            });

            it(`Read`, async () => {
                const schemeAfterPostArr = await udcService.getSchemes({
                    where: `Name='${collectionName}'`,
                });
                expect(schemeAfterPostArr.length).to.equal(1);
                const readCollectionResponse = schemeAfterPostArr[0];
                expect(readCollectionResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(readCollectionResponse.CreationDateTime).to.include('Z');
                expect(readCollectionResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(readCollectionResponse.ModificationDateTime).to.include('Z');
                expect(readCollectionResponse['CompositeKeyFields'])
                    .to.be.an('array')
                    .that.deep.equals(schemaTestData.CompositeKeyFields);
                expect(readCollectionResponse['CompositeKeyType']).to.equal(schemaTestData.CompositeKeyType);
                expect(readCollectionResponse.Description).to.equal(tempDescription);
                expect(readCollectionResponse.Name).to.equal(collectionName);
                expect(readCollectionResponse.Type).to.equal('meta_data');
                expect(readCollectionResponse.Hidden).to.be.false;
                expect(readCollectionResponse.Fields).to.deep.equal(schemaTestData.Fields);
            });

            it(`Update`, async () => {
                schemaTestData.CompositeKeyFields = ['Field2', 'Field2', 'Field3'];
                schemaTestData.Fields.StringField1 = {
                    Type: 'String',
                    Mandatory: true,
                };
                schemaTestData.Fields.IntegerField1 = {
                    Type: 'Integer',
                    Mandatory: false,
                };
                schemaTestData.Fields.OptionalValuesField = {
                    OptionalValues: ['1', '2', '3'],
                    Type: 'Integer',
                    Mandatory: false,
                };
                schemaTestData.Fields.StringArray = {
                    Type: 'Array',
                    Items: {
                        Type: 'String',
                    },
                    Mandatory: true,
                };
                schemaTestData.Fields.IntegerArray = {
                    Type: 'Array',
                    Items: {
                        Type: 'Integer',
                    },
                    Mandatory: true,
                };

                const postSchemeResponse = await udcService.postScheme(schemaTestData);
                expect(postSchemeResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postSchemeResponse.CreationDateTime).to.include('Z');
                expect(postSchemeResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postSchemeResponse.ModificationDateTime).to.include('Z');
                expect(postSchemeResponse['CompositeKeyFields'])
                    .to.be.an('array')
                    .that.deep.equals(schemaTestData.CompositeKeyFields);
                expect(postSchemeResponse['CompositeKeyType']).to.equal(schemaTestData.CompositeKeyType);
                expect(postSchemeResponse.Description).to.equal(tempDescription);
                expect(postSchemeResponse.Name).to.equal(collectionName);
                expect(postSchemeResponse.Type).to.equal('meta_data');
                expect(postSchemeResponse.Hidden).to.be.false;
                expect(postSchemeResponse.Fields).to.deep.equal(schemaTestData.Fields);
            });

            it(`Validate Plus One After Update`, async () => {
                const collectionSchemeAfterPostArr = await udcService.getSchemes();
                expect(collectionSchemeAfterPostArr.length).to.equal(schemeBeforeArr.length + 1);
            });

            it(`Delete`, async () => {
                schemaTestData['Hidden'] = true;
                const postSchemeResponse = await udcService.postScheme(schemaTestData);
                expect(postSchemeResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postSchemeResponse.CreationDateTime).to.include('Z');
                expect(postSchemeResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postSchemeResponse.ModificationDateTime).to.include('Z');
                expect(postSchemeResponse['CompositeKeyFields'])
                    .to.be.an('array')
                    .that.deep.equals(schemaTestData.CompositeKeyFields);
                expect(postSchemeResponse['CompositeKeyType']).to.equal(schemaTestData.CompositeKeyType);
                expect(postSchemeResponse.Description).to.equal(tempDescription);
                expect(postSchemeResponse.Name).to.equal(collectionName);
                expect(postSchemeResponse.Type).to.equal('meta_data');
                expect(postSchemeResponse.Hidden).to.be.true;
                expect(postSchemeResponse.Fields).to.deep.equal(schemaTestData.Fields);
            });

            it(`Validate Sum Restore After Hidden = True`, async () => {
                const collectionSchemeAfterPostArr = await udcService.getSchemes();
                expect(collectionSchemeAfterPostArr.length).to.equal(schemeBeforeArr.length);
            });*/
        });

        describe('CRUD Collection Document', () => {
            const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
            const collectionName = 'Collection_Name_' + Math.floor(Math.random() * 1000000).toString();
            const schemaTestData = {
                Name: collectionName,
                Description: tempDescription,
                CompositeKeyFields: ['Field1', 'Field2'],
                CompositeKeyType: 'Key',
                Fields: {
                    StringField1: {
                        Type: 'String',
                        Mandatory: true,
                    },
                    StringField2: {
                        Type: 'String',
                        Mandatory: true,
                    },
                    IntegerField1: {
                        Type: 'Integer',
                        Mandatory: false,
                    },
                    IntegerField2: {
                        Type: 'Integer',
                        Mandatory: false,
                    },
                    OptionalValuesField: {
                        OptionalValues: ['1', '2', '3'],
                        Type: 'String',
                        Mandatory: false,
                    },
                    StringArray: {
                        Type: 'Array',
                        Items: {
                            Type: 'String',
                        },
                        Mandatory: false,
                    },
                    IntegerArray: {
                        Type: 'Array',
                        Items: {
                            Type: 'Integer',
                        },
                        Mandatory: false,
                    },
                },
            };
            // const documentTestData = {
            //     Key: collectionName + 'Key',
            //     StringField1: 'String 1 Test',
            //     StringField2: 'String 2 Test',
            //     IntegerField1: 1,
            //     IntegerField2: 2,
            //     OptionalValuesField: '1',
            //     StringArray: ['String array 1', 'String array 2', 'String array 3'],
            //     IntegerArray: [1, 2, 3],
            // };
            let schemeBeforeArr;

            it(`Get Collections Scheme Before`, async () => {
                schemeBeforeArr = await udcService.getSchemes();
                expect(schemeBeforeArr).to.be.an('array');
            });

            it(`Get Collections Before`, async () => {
                await expect(udcService.getDocuments(collectionName)).eventually.to.be.rejectedWith(
                    'Failed due to exception: Table schema must exist',
                );
            });

            it(`Validate Correct Error Reject Message`, async () => {
                await expect(udcService.postScheme(schemaTestData)).eventually.to.be.rejectedWith(
                    `https://papi.staging.pepperi.com/V1.0/user_defined_collections/schemes failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: instance requires property \\"ListView\\"`,
                );
            });
            //TODO: Create CRUD test when possible after API changed to block some API configuration that are not supported by the UI
            /*it(`Create Scheme`, async () => {
                const postSchemeResponse = await udcService.postScheme(schemaTestData);
                expect(postSchemeResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postSchemeResponse.CreationDateTime).to.include('Z');
                expect(postSchemeResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postSchemeResponse.ModificationDateTime).to.include('Z');
                expect(postSchemeResponse['CompositeKeyFields'])
                    .to.be.an('array')
                    .that.deep.equals(schemaTestData.CompositeKeyFields);
                expect(postSchemeResponse['CompositeKeyType']).to.equal(schemaTestData.CompositeKeyType);
                expect(postSchemeResponse.Description).to.equal(tempDescription);
                expect(postSchemeResponse.Name).to.equal(collectionName);
                expect(postSchemeResponse.Type).to.equal('meta_data');
                expect(postSchemeResponse.Hidden).to.be.false;
                expect(postSchemeResponse.Fields).to.deep.equal(schemaTestData.Fields);
            });

            it(`Create`, async () => {
                const postDocumentResponse = await udcService.postDocument(collectionName, documentTestData);
                expect(postDocumentResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postDocumentResponse.CreationDateTime).to.include('Z');
                expect(postDocumentResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postDocumentResponse.ModificationDateTime).to.include('Z');
                expect(postDocumentResponse.Hidden).to.be.false;
                expect(postDocumentResponse.Key).to.equal(documentTestData.Key);
                expect(postDocumentResponse.StringArray)
                    .to.be.an('array')
                    .that.deep.equals(documentTestData.StringArray);
                expect(postDocumentResponse.IntegerArray)
                    .to.be.an('array')
                    .that.deep.equals(documentTestData.IntegerArray);
                expect(postDocumentResponse.IntegerField1).to.equal(documentTestData.IntegerField1);
                expect(postDocumentResponse.IntegerField2).to.equal(documentTestData.IntegerField2);
                expect(postDocumentResponse.StringField1).to.equal(documentTestData.StringField1);
                expect(postDocumentResponse.StringField2).to.equal(documentTestData.StringField2);
                expect(postDocumentResponse.OptionalValuesField).to.equal(documentTestData.OptionalValuesField);
            });

            it(`Read`, async () => {
                const getDocument: any = await udcService.getDocuments(collectionName);
                expect(getDocument[0].CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getDocument[0].CreationDateTime).to.include('Z');
                expect(getDocument[0].ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getDocument[0].ModificationDateTime).to.include('Z');
                expect(getDocument[0].Hidden).to.be.false;
                expect(getDocument[0].Key).to.equal(documentTestData.Key);
                expect(getDocument[0].StringArray).to.be.an('array').that.deep.equals(documentTestData.StringArray);
                expect(getDocument[0].IntegerArray).to.be.an('array').that.deep.equals(documentTestData.IntegerArray);
                expect(getDocument[0].IntegerField1).to.equal(documentTestData.IntegerField1);
                expect(getDocument[0].IntegerField2).to.equal(documentTestData.IntegerField2);
                expect(getDocument[0].StringField1).to.equal(documentTestData.StringField1);
                expect(getDocument[0].StringField2).to.equal(documentTestData.StringField2);
                expect(getDocument[0].OptionalValuesField).to.equal(documentTestData.OptionalValuesField);
                expect(getDocument.length).to.equal(1);
            });

            it(`Verfiy Relation With ADAL`, async () => {
                const getFromADALResponse = await udcService.getCollectionFromADAL(collectionName, varKey);
                expect(getFromADALResponse).to.be.an('array').with.lengthOf(1);
                expect(getFromADALResponse[0].CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFromADALResponse[0].CreationDateTime).to.include('Z');
                expect(getFromADALResponse[0].ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getFromADALResponse[0].ModificationDateTime).to.include('Z');
                expect(getFromADALResponse[0].Hidden).to.be.false;
                expect(getFromADALResponse[0].Key).to.equal(documentTestData.Key);
                expect(getFromADALResponse[0].StringArray)
                    .to.be.an('array')
                    .that.deep.equals(documentTestData.StringArray);
                expect(getFromADALResponse[0].IntegerArray)
                    .to.be.an('array')
                    .that.deep.equals(documentTestData.IntegerArray);
                expect(getFromADALResponse[0].IntegerField1).to.equal(documentTestData.IntegerField1);
                expect(getFromADALResponse[0].IntegerField2).to.equal(documentTestData.IntegerField2);
                expect(getFromADALResponse[0].StringField1).to.equal(documentTestData.StringField1);
                expect(getFromADALResponse[0].StringField2).to.equal(documentTestData.StringField2);
                expect(getFromADALResponse[0].OptionalValuesField).to.equal(documentTestData.OptionalValuesField);
            });

            it(`Update`, async () => {
                documentTestData.StringField1 = 'String 3 Test';
                documentTestData.StringField2 = 'String 3 Test';
                documentTestData.OptionalValuesField = '3';
                documentTestData.StringArray = ['String array 1', 'String array 2', 'String array 4'];
                documentTestData.IntegerArray = [1, 2, 3];

                const getDocumentAfterUpdate = await udcService.postDocument(collectionName, documentTestData);
                expect(getDocumentAfterUpdate.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getDocumentAfterUpdate.CreationDateTime).to.include('Z');
                expect(getDocumentAfterUpdate.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getDocumentAfterUpdate.ModificationDateTime).to.include('Z');
                expect(getDocumentAfterUpdate.Hidden).to.be.false;
                expect(getDocumentAfterUpdate.Key).to.equal(documentTestData.Key);
                expect(getDocumentAfterUpdate.StringArray)
                    .to.be.an('array')
                    .that.deep.equals(documentTestData.StringArray);
                expect(getDocumentAfterUpdate.IntegerArray)
                    .to.be.an('array')
                    .that.deep.equals(documentTestData.IntegerArray);
                expect(getDocumentAfterUpdate.IntegerField1).to.equal(documentTestData.IntegerField1);
                expect(getDocumentAfterUpdate.IntegerField2).to.equal(documentTestData.IntegerField2);
                expect(getDocumentAfterUpdate.StringField1).to.equal(documentTestData.StringField1);
                expect(getDocumentAfterUpdate.StringField2).to.equal(documentTestData.StringField2);
                expect(getDocumentAfterUpdate.OptionalValuesField).to.equal(documentTestData.OptionalValuesField);
            });

            it(`Verfiy Relation With ADAL After Update`, async () => {
                const getFromADALAfterUpdateResponse = await udcService.getCollectionFromADAL(collectionName, varKey);
                expect(getFromADALAfterUpdateResponse).to.be.an('array').with.lengthOf(1);
                expect(getFromADALAfterUpdateResponse[0].CreationDateTime).to.include(
                    new Date().toISOString().split('T')[0],
                );
                expect(getFromADALAfterUpdateResponse[0].CreationDateTime).to.include('Z');
                expect(getFromADALAfterUpdateResponse[0].ModificationDateTime).to.include(
                    new Date().toISOString().split('T')[0],
                );
                expect(getFromADALAfterUpdateResponse[0].ModificationDateTime).to.include('Z');
                expect(getFromADALAfterUpdateResponse[0].Key).to.equal(documentTestData.Key);
                expect(getFromADALAfterUpdateResponse[0].Hidden).to.be.false;
                expect(getFromADALAfterUpdateResponse[0].StringArray)
                    .to.be.an('array')
                    .that.deep.equals(documentTestData.StringArray);
                expect(getFromADALAfterUpdateResponse[0].IntegerArray)
                    .to.be.an('array')
                    .that.deep.equals(documentTestData.IntegerArray);
                expect(getFromADALAfterUpdateResponse[0].IntegerField1).to.equal(documentTestData.IntegerField1);
                expect(getFromADALAfterUpdateResponse[0].IntegerField2).to.equal(documentTestData.IntegerField2);
                expect(getFromADALAfterUpdateResponse[0].StringField1).to.equal(documentTestData.StringField1);
                expect(getFromADALAfterUpdateResponse[0].StringField2).to.equal(documentTestData.StringField2);
                expect(getFromADALAfterUpdateResponse[0].OptionalValuesField).to.equal(
                    documentTestData.OptionalValuesField,
                );
            });

            it(`Delete`, async () => {
                documentTestData['Hidden'] = true;
                const getDocumentAfterDelete = await udcService.postDocument(collectionName, documentTestData);
                expect(getDocumentAfterDelete.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getDocumentAfterDelete.CreationDateTime).to.include('Z');
                expect(getDocumentAfterDelete.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getDocumentAfterDelete.ModificationDateTime).to.include('Z');
                expect(getDocumentAfterDelete.Hidden).to.be.true;
                expect(getDocumentAfterDelete.Key).to.equal(documentTestData.Key);
                expect(getDocumentAfterDelete.StringArray)
                    .to.be.an('array')
                    .that.deep.equals(documentTestData.StringArray);
                expect(getDocumentAfterDelete.IntegerArray)
                    .to.be.an('array')
                    .that.deep.equals(documentTestData.IntegerArray);
                expect(getDocumentAfterDelete.IntegerField1).to.equal(documentTestData.IntegerField1);
                expect(getDocumentAfterDelete.IntegerField2).to.equal(documentTestData.IntegerField2);
                expect(getDocumentAfterDelete.StringField1).to.equal(documentTestData.StringField1);
                expect(getDocumentAfterDelete.StringField2).to.equal(documentTestData.StringField2);
                expect(getDocumentAfterDelete.OptionalValuesField).to.equal(documentTestData.OptionalValuesField);
            });

            it(`Validate Sum Restore After Hidden = True`, async () => {
                const getDocumentAfterDeleteResponse = await udcService.getDocuments(collectionName);
                expect(getDocumentAfterDeleteResponse).to.be.an('array').with.lengthOf(0);
            });

            it(`Delete Schema`, async () => {
                schemaTestData['Hidden'] = true;
                const postSchemeResponse = await udcService.postScheme(schemaTestData);
                expect(postSchemeResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postSchemeResponse.CreationDateTime).to.include('Z');
                expect(postSchemeResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postSchemeResponse.ModificationDateTime).to.include('Z');
                expect(postSchemeResponse['CompositeKeyFields'])
                    .to.be.an('array')
                    .that.deep.equals(schemaTestData.CompositeKeyFields);
                expect(postSchemeResponse['CompositeKeyType']).to.equal(schemaTestData.CompositeKeyType);
                expect(postSchemeResponse.Description).to.equal(tempDescription);
                expect(postSchemeResponse.Name).to.equal(collectionName);
                expect(postSchemeResponse.Type).to.equal('meta_data');
                expect(postSchemeResponse.Hidden).to.be.true;
                expect(postSchemeResponse.Fields).to.deep.equal(schemaTestData.Fields);
            });

            it(`Validate Sum Restore After Hidden = True`, async () => {
                const collectionSchemeAfterPostArr = await udcService.getSchemes();
                expect(collectionSchemeAfterPostArr.length).to.equal(schemeBeforeArr.length);
            });*/

            // it(`Post file negative tests`, async () => {
            //     const tempKey = 'NegativeFile' + Math.floor(Math.random() * 1000000).toString() + '.txt';
            //     const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
            //     await expect(udcService.postFile({
            //         "URI": "data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u",
            //         "MIME": "file/plain",
            //         "Sync": "Device",
            //         "Description": tempDescription
            //     })).eventually.to.be.rejectedWith(`failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Missing mandatory field 'Key'","detail":{"errorcode":"BadRequest"}}}`);
            //     await expect(udcService.postFile({
            //         "Key": tempKey,
            //         "URI": "data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u",
            //         "Sync": "Device",
            //         "Description": tempDescription
            //     })).eventually.to.be.rejectedWith(`failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Missing mandatory field 'MIME'","detail":{"errorcode":"BadRequest"}}}`);
            //     await expect(udcService.postFile({
            //         "Key": tempKey + '/',
            //         "MIME": "file/plain",
            //         "URI": "data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u",
            //         "Sync": "Device",
            //         "Description": tempDescription
            //     })).eventually.to.be.rejectedWith(`failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: A filename cannot contain a '/'.","detail":{"errorcode":"BadRequest"}}}`);
            //     await expect(udcService.postFile({
            //         "Key": tempKey,
            //         "MIME": "pepperi/folder",
            //         "URI": "data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u",
            //         "Sync": "Device",
            //         "Description": tempDescription
            //     })).eventually.to.be.rejectedWith(`failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: On creation of a folder, the key must end with '/'","detail":{"errorcode":"BadRequest"}}}`);
            // });

            // it(`Delete file`, async () => {
            //     const tempKey = 'FileForDelete' + Math.floor(Math.random() * 1000000).toString() + '.txt';
            //     const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
            //     const postFileResponse = await udcService.postFile({
            //         "Key": tempKey,
            //         "URI": "data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u",
            //         "MIME": "file/plain",
            //         "Sync": "Device",
            //         "Description": tempDescription
            //     });
            //     expect(postFileResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
            //     expect(postFileResponse.CreationDateTime).to.include('Z');
            //     expect(postFileResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
            //     expect(postFileResponse.ModificationDateTime).to.include('Z');
            //     expect(postFileResponse.Description).to.equal(tempDescription);
            //     expect(postFileResponse.Folder).to.equal('/');
            //     expect(postFileResponse.Key).to.equal(tempKey);
            //     expect(postFileResponse.MIME).to.equal('file/plain');
            //     expect(postFileResponse.Name).to.equal(tempKey);
            //     expect(postFileResponse.Sync).to.equal('Device');
            //     expect(postFileResponse.URL).to.include('https://udc.');
            //     const deletedFileResponse = await udcService.deleteFile(tempKey);
            //     expect(deletedFileResponse.Key).to.equal(tempKey);
            //     expect(deletedFileResponse.Hidden).to.be.true
            //     expect(deletedFileResponse.ExpirationDateTime).to.include('Z');
            //     await expect(udcService.getFile(tempKey)).eventually.to.be.rejectedWith(`failed with status: 404 - Not Found error: {"fault":{"faultstring":"Failed due to exception: Could not find requested item:`);
            // });
        });
    });
}
