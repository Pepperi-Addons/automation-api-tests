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
        'User Defined Collections': [UserDefinedCollectionsUUID, '0.0.13'],
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

        describe('CRUD Collection', () => {
            const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
            const collectionName = 'Collection Name' + Math.floor(Math.random() * 1000000).toString();
            let collectionBeforeArr;
            let collectionAfterArr;

            it(`Get Collections Before`, async () => {
                collectionBeforeArr = await udcService.getCollectionschemes();
                expect(collectionBeforeArr).to.be.an('array');
            });

            it(`Create`, async () => {
                const postCollectionResponse = await udcService.postCollectionschemes({
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
                });
                expect(postCollectionResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postCollectionResponse.CreationDateTime).to.include('Z');
                expect(postCollectionResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postCollectionResponse.ModificationDateTime).to.include('Z');
                expect(postCollectionResponse['CompositeKeyFields'])
                    .to.be.an('array')
                    .that.deep.equals(['Field1', 'Field2']);
                expect(postCollectionResponse['CompositeKeyType']).to.equal('Key');
                expect(postCollectionResponse.Description).to.equal(tempDescription);
                expect(postCollectionResponse.Name).to.equal(collectionName);
                expect(postCollectionResponse.Type).to.equal('meta_data');
                expect(postCollectionResponse.Hidden).to.be.false;
                expect(postCollectionResponse.Fields).to.deep.equal({
                    OptionalValuesField: {
                        Type: 'Integer',
                        OptionalValues: ['1', '2', '3'],
                        Mandatory: false,
                    },
                    StringField2: {
                        Type: 'String',
                        Mandatory: true,
                    },
                    StringArray: {
                        Type: 'Array',
                        Items: {
                            Type: 'String',
                        },
                        Mandatory: false,
                    },
                    StringField1: {
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
                    IntegerArray: {
                        Type: 'Array',
                        Items: {
                            Type: 'Integer',
                        },
                        Mandatory: false,
                    },
                });
                const collectionAfterPostArr = await udcService.getCollectionschemes();
                expect(collectionAfterPostArr.length).to.equal(collectionBeforeArr.length + 1);
            });

            it(`Validate Plus One`, async () => {
                const collectionAfterPostArr = await udcService.getCollectionschemes();
                expect(collectionAfterPostArr.length).to.equal(collectionBeforeArr.length + 1);
            });

            it(`Read`, async () => {
                const collectionAfterPostArr = await udcService.getCollectionschemes({
                    where: `Name='${collectionName}'`,
                });
                expect(collectionAfterPostArr.length).to.equal(1);
                const readCollectionResponse = collectionAfterPostArr[0];
                expect(readCollectionResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(readCollectionResponse.CreationDateTime).to.include('Z');
                expect(readCollectionResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(readCollectionResponse.ModificationDateTime).to.include('Z');
                expect(readCollectionResponse['CompositeKeyFields'])
                    .to.be.an('array')
                    .that.deep.equals(['Field1', 'Field2']);
                expect(readCollectionResponse['CompositeKeyType']).to.equal('Key');
                expect(readCollectionResponse.Description).to.equal(tempDescription);
                expect(readCollectionResponse.Name).to.equal(collectionName);
                expect(readCollectionResponse.Type).to.equal('meta_data');
                expect(readCollectionResponse.Hidden).to.be.false;
                expect(readCollectionResponse.Fields).to.deep.equal({
                    OptionalValuesField: {
                        Type: 'Integer',
                        OptionalValues: ['1', '2', '3'],
                        Mandatory: false,
                    },
                    StringField2: {
                        Type: 'String',
                        Mandatory: true,
                    },
                    StringArray: {
                        Type: 'Array',
                        Items: {
                            Type: 'String',
                        },
                        Mandatory: false,
                    },
                    StringField1: {
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
                    IntegerArray: {
                        Type: 'Array',
                        Items: {
                            Type: 'Integer',
                        },
                        Mandatory: false,
                    },
                });
            });

            it(`Get documents length`, async () => {
                collectionAfterArr = await udcService.getDocuments(collectionName);
                debugger;
                expect(collectionAfterArr).to.be.an('array');
            });

            it(`Update`, async () => {
                const postDocumentResponse = await udcService.postDocument(collectionName, {
                    Key: collectionName,
                    StringField1: 'String 1 Test',
                    StringField2: 'String 2 Test',
                    IntegerField1: '1',
                    IntegerField2: '2',
                    OptionalValuesField: '1',
                    StringArray: ['String array 1', 'String array 2', 'String array 3'],
                    IntegerArray: ['1', '2', '3'],
                });
                debugger;
                expect(postDocumentResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postDocumentResponse.CreationDateTime).to.include('Z');
                expect(postDocumentResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postDocumentResponse.ModificationDateTime).to.include('Z');
                expect(postDocumentResponse.Key).to.equal(collectionName + 'Key');
                expect(postDocumentResponse.StringArray)
                    .to.be.an('array')
                    .that.deep.equals(['String array 1', 'String array 2', 'String array 3']);
                expect(postDocumentResponse.IntegerArray).to.be.an('array').that.deep.equals(['1', '2', '3']);
                expect(postDocumentResponse.IntegerField1).to.equal('1');
                expect(postDocumentResponse.IntegerField2).to.equal('2');
                expect(postDocumentResponse.StringField1).to.equal('String 1 Test');
                expect(postDocumentResponse.StringField2).to.equal('String 2 Test');
                expect(postDocumentResponse.OptionalValuesField).to.equal('1');
                const collectionAfterPostArr = await udcService.getDocuments(collectionName);
                expect(collectionAfterPostArr.length).to.equal(collectionAfterArr.length + 1);
            });

            it(`Verfiy relation with ADAL`, async () => {
                const getKeyViaADAL = await udcService.getCollectionFromADAL(collectionName);
                expect(getKeyViaADAL).to.be.an('array').with.lengthOf(1);
                expect(getKeyViaADAL[0].CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getKeyViaADAL[0].CreationDateTime).to.include('Z');
                expect(getKeyViaADAL[0].ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getKeyViaADAL[0].ModificationDateTime).to.include('Z');
                expect(getKeyViaADAL[0].Key).to.equal(collectionName + 'Key');
                expect(getKeyViaADAL[0].StringArray)
                    .to.be.an('array')
                    .that.deep.equals(['String array 1', 'String array 2', 'String array 3']);
                expect(getKeyViaADAL[0].IntegerArray).to.be.an('array').that.deep.equals(['1', '2', '3']);
                expect(getKeyViaADAL[0].IntegerField1).to.equal('1');
                expect(getKeyViaADAL[0].IntegerField2).to.equal('2');
                expect(getKeyViaADAL[0].StringField1).to.equal('String 1 Test');
                expect(getKeyViaADAL[0].StringField2).to.equal('String 2 Test');
                expect(getKeyViaADAL[0].OptionalValuesField).to.equal('1');
            });

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
