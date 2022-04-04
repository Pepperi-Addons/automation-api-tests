import GeneralService, { TesterFunctions } from '../services/general.service';
import { UDCService } from '../services/user-defined-collections.service';

export async function UDCTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const udcService = new UDCService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade UDC
    const testData = {
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', '0.0.13'],
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
            it('Validate That All The Needed Addons Installed', async () => {
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

        describe('POST/GET metadata', () => {
            const tempDescription = 'Description' + Math.floor(Math.random() * 1000000).toString();
            const tempName = 'Collection Name' + Math.floor(Math.random() * 1000000).toString();
            let collectionsLength;
            let documentsLength;

            it(`Get collections length`, async () => {
                collectionsLength = await udcService.getCollections();
                expect(collectionsLength).to.be.an('array');
            });

            it(`Post collection and verify`, async () => {
                const postCollectionResponse = await udcService.postCollection({
                    Name: tempName,
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
                expect(postCollectionResponse.CompositeKeyFields)
                    .to.be.an('array')
                    .that.deep.equals(['Field1', 'Field2']);
                expect(postCollectionResponse.CompositeKeyType).to.equal('Key');
                expect(postCollectionResponse.Description).to.equal(tempDescription);
                expect(postCollectionResponse.Name).to.equal(tempName);
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
                const newCollectionsLength = await udcService.getCollections();
                expect(newCollectionsLength.length).to.equal(collectionsLength.length + 1);
            });

            it(`Get documents length`, async () => {
                documentsLength = await udcService.getDocuments(tempName);
                expect(collectionsLength).to.be.an('array');
            });

            it(`Post document and verify`, async () => {
                const postDocumentResponse = await udcService.postDocument(tempName, {
                    Key: tempName + 'Key',
                    StringField1: 'String 1 Test',
                    StringField2: 'String 2 Test',
                    IntegerField1: '1',
                    IntegerField2: '2',
                    OptionalValuesField: '1',
                    StringArray: ['String array 1', 'String array 2', 'String array 3'],
                    IntegerArray: ['1', '2', '3'],
                });
                expect(postDocumentResponse.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postDocumentResponse.CreationDateTime).to.include('Z');
                expect(postDocumentResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postDocumentResponse.ModificationDateTime).to.include('Z');
                expect(postDocumentResponse.Key).to.equal(tempName + 'Key');
                expect(postDocumentResponse.StringArray)
                    .to.be.an('array')
                    .that.deep.equals(['String array 1', 'String array 2', 'String array 3']);
                expect(postDocumentResponse.IntegerArray).to.be.an('array').that.deep.equals(['1', '2', '3']);
                expect(postDocumentResponse.IntegerField1).to.equal('1');
                expect(postDocumentResponse.IntegerField2).to.equal('2');
                expect(postDocumentResponse.StringField1).to.equal('String 1 Test');
                expect(postDocumentResponse.StringField2).to.equal('String 2 Test');
                expect(postDocumentResponse.OptionalValuesField).to.equal('1');
                const newDocumentsLength = await udcService.getDocuments(tempName);
                expect(newDocumentsLength.length).to.equal(documentsLength.length + 1);
            });

            it(`Verfiy relation with DIMX`, async () => {
                const getKeyViaDIMX = await udcService.getDIMX('122c0e9d-c240-4865-b446-f37ece866c22', tempName);
                expect(getKeyViaDIMX).to.be.an('array').with.lengthOf(1);
                expect(getKeyViaDIMX[0].CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getKeyViaDIMX[0].CreationDateTime).to.include('Z');
                expect(getKeyViaDIMX[0].ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(getKeyViaDIMX[0].ModificationDateTime).to.include('Z');
                expect(getKeyViaDIMX[0].Key).to.equal(tempName + 'Key');
                expect(getKeyViaDIMX[0].StringArray)
                    .to.be.an('array')
                    .that.deep.equals(['String array 1', 'String array 2', 'String array 3']);
                expect(getKeyViaDIMX[0].IntegerArray).to.be.an('array').that.deep.equals(['1', '2', '3']);
                expect(getKeyViaDIMX[0].IntegerField1).to.equal('1');
                expect(getKeyViaDIMX[0].IntegerField2).to.equal('2');
                expect(getKeyViaDIMX[0].StringField1).to.equal('String 1 Test');
                expect(getKeyViaDIMX[0].StringField2).to.equal('String 2 Test');
                expect(getKeyViaDIMX[0].OptionalValuesField).to.equal('1');
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
