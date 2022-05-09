import { DataIndexAdalService } from '../services/index';
import GeneralService, { TesterFunctions } from '../services/general.service';

export async function DataIndexADALTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const dataIndexAdalService = new DataIndexAdalService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade Data Index ADAL
    const testData = {
        'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', ''],
    };

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }

    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Upgrade Data Index ADAL

    describe('Data Index ADAL Tests Suites', () => {
        describe('Prerequisites Addon for Data Index ADAL Tests', () => {
            //Test Datas
            //Data Index ADAL, Pepperi Notification Service
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

        describe('Index CRUD', () => {
            const SchemeName = 'test_index';
            const distributorUUID = generalService.getClientData('DistributorUUID');

            const createDocumentTestData = {
                DocumentName: 'Dor',
                DocumentBool: true,
                DocumentNumber: 5,
                DocumentDouble: 50.3,
                DocumentDate: new Date(1800, 1).toISOString().split('.')[0] + 'Z',
                DocumentMixedFormat: new Date(2200, 12).toISOString().split('.')[0] + 'Z',
                Key: 1,
            };

            const secondDocument = Object.assign({}, createDocumentTestData);
            secondDocument.Key = 'Second Document' as any;
            const thirdDocument = Object.assign({}, createDocumentTestData);
            thirdDocument.Key = 'Third Document' as any;

            const updateDocumentTestData = {
                DocumentName: 'Dor - Update',
                DocumentBool: false,
                DocumentNumber: 0,
                DocumentDouble: -1,
                DocumentDate: new Date().toISOString().split('.')[0] + 'Z',
                DocumentMixedFormat: new Date(15, 7).toISOString().split('.')[0] + 'Z',
                Key: 1,
            };

            it('Create Scheme', async () => {
                const createSchemeResponse = await dataIndexAdalService.createScheme(
                    generalService.papiClient['options'].addonUUID,
                    {
                        Name: SchemeName,
                        Hidden: false,
                        CreationDateTime: '1-1-2012',
                        ModificationDateTime: '1-1-2012',
                        Type: 'typed_index',
                        DataSourceURL: 'https://url',
                        DataSourceData: {
                            IndexName: 'tester',
                            NumberOfShards: 3,
                        },
                        StringIndexName: 'my_index',
                        Fields: {
                            DocumentName: {
                                Type: 'String',
                                Indexed: true,
                                Keyword: true,
                            },
                            DocumentBool: {
                                Type: 'Bool',
                            },
                            DocumentNumber: {
                                Type: 'Integer',
                            },
                            DocumentDouble: {
                                Type: 'Double',
                            },
                            DocumentDate: {
                                Type: 'DateTime',
                                Indexed: true,
                            },
                            DocumentMixedFormat: {
                                Type: 'DateTime',
                                Indexed: true,
                            },
                        },
                    },
                );
                expect(createSchemeResponse, JSON.stringify(createSchemeResponse)).to.have.property('acknowledged').to
                    .be.true;
                expect(createSchemeResponse, JSON.stringify(createSchemeResponse))
                    .to.have.property('index')
                    .to.equal(`${distributorUUID}_${generalService.papiClient['options'].addonUUID}_${SchemeName}`);
                expect(createSchemeResponse, JSON.stringify(createSchemeResponse)).to.have.property(
                    'shards_acknowledged',
                ).to.be.true;
            });

            it('Create Document', async () => {
                const createDocumentResponse = await dataIndexAdalService.createDocument(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    createDocumentTestData,
                );
                expect(createDocumentResponse).to.deep.equal(createDocumentTestData);
            });

            it('Bulk Create Document', async () => {
                const createDocumentResponse = await dataIndexAdalService.createBatchDocument(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    [createDocumentTestData, secondDocument, thirdDocument],
                );
                expect(createDocumentResponse).to.deep.equal([
                    {
                        Key: '1',
                        Status: 'Update',
                    },
                    {
                        Key: 'Second Document',
                        Status: 'Insert',
                    },
                    {
                        Key: 'Third Document',
                        Status: 'Insert',
                    },
                ]);
            });

            it('Read Document (Search By DSL: DI-19467)', async () => {
                const readDocumentResponse = await dataIndexAdalService.searchAllDocuments(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    {
                        query: {
                            match: {
                                DocumentName: createDocumentTestData.DocumentName,
                            },
                        },
                    },
                );
                expect(readDocumentResponse).to.deep.include.members([
                    secondDocument,
                    thirdDocument,
                    createDocumentTestData,
                ]);
            });

            it('Read All Documents', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                );
                expect(readDocumentResponse).to.deep.include.members([
                    secondDocument,
                    thirdDocument,
                    createDocumentTestData,
                ]);
                expect(readDocumentResponse.length).to.equal(3);
            });

            it('Update Document (Override With Create)', async () => {
                const createDocumentResponse = await dataIndexAdalService.createDocument(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    updateDocumentTestData,
                );
                expect(createDocumentResponse).to.deep.equal(updateDocumentTestData);
            });

            it('Read Updated Document After Override', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    1,
                );
                expect(readDocumentResponse).to.deep.equal(updateDocumentTestData);
            });

            it('Update Document With DSL Query (DI-19468)', async () => {
                const createDocumentResponse = await dataIndexAdalService.updateDocument(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    {
                        query: {
                            match: {
                                Key: '1',
                            },
                        },
                        script: {
                            source: 'ctx._source.DocumentNumber = 4;ctx._source.DocumentDouble*=-3',
                            lang: 'painless',
                        },
                    },
                );
                expect(createDocumentResponse).to.have.property('updated').to.equal(1);
            });

            it('Read Updated Document After Update Query', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    1,
                );
                expect(readDocumentResponse).to.have.property('DocumentDouble').to.equal(3);
                expect(readDocumentResponse).to.have.property('DocumentNumber').to.equal(4);
            });

            it('Update Bulk Documents With Query (DI-19450)', async () => {
                const createDocumentResponse = await dataIndexAdalService.updateDocument(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    {
                        query: {
                            match: {
                                DocumentName: createDocumentTestData.DocumentName,
                            },
                        },
                        script: {
                            source: 'ctx._source.DocumentNumber = 4;ctx._source.DocumentDouble*=-3',
                            lang: 'painless',
                        },
                    },
                );
                expect(createDocumentResponse).to.have.property('updated').to.equal(3);
            });

            it('Bulk Read Updated Document After Update Query', async () => {
                const readDocumentResponse = await dataIndexAdalService.searchAllDocuments(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    {
                        query: {
                            match: {
                                DocumentName: createDocumentTestData.DocumentName,
                            },
                        },
                    },
                );
                expect(readDocumentResponse[0]).to.have.property('DocumentDouble').to.equal(-150.89999999999998);
                expect(readDocumentResponse[0]).to.have.property('DocumentNumber').to.equal(4);
                expect(readDocumentResponse[1]).to.have.property('DocumentDouble').to.equal(-150.89999999999998);
                expect(readDocumentResponse[1]).to.have.property('DocumentNumber').to.equal(4);
                expect(readDocumentResponse[2]).to.have.property('DocumentDouble').to.equal(-9);
                expect(readDocumentResponse[2]).to.have.property('DocumentNumber').to.equal(4);
            });

            it('Bulk Remove Document', async () => {
                const removeDocumentResponse = await dataIndexAdalService.removeDocuments(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    {
                        query: {
                            match: {
                                Key: thirdDocument.Key,
                            },
                        },
                    },
                );
                expect(removeDocumentResponse).to.have.property('resultObject').to.include({ batches: 1 });
                expect(removeDocumentResponse).to.have.property('resultObject').to.include({ deleted: 1 });
                expect(removeDocumentResponse).to.have.property('success').to.be.true;
            });

            it('Bulk Read After Delete Document', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                );
                expect(readDocumentResponse.length).to.equal(2);
            });

            it('Remove Document', async () => {
                const removeDocumentResponse = await dataIndexAdalService.removeDocuments(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    {
                        query: {
                            match: {
                                DocumentName: updateDocumentTestData.DocumentName,
                            },
                        },
                    },
                );
                expect(removeDocumentResponse).to.have.property('resultObject').to.include({ batches: 1 });
                expect(removeDocumentResponse).to.have.property('resultObject').to.include({ deleted: 2 });
                expect(removeDocumentResponse).to.have.property('success').to.be.true;
            });

            it('Read After Delete Document', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                );
                expect(readDocumentResponse).to.deep.equal([]);
            });

            it('Remove Scheme', async () => {
                const readDocumentResponse = await dataIndexAdalService.removeScheme(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                );
                expect(readDocumentResponse).to.have.property('resultObject').to.deep.equal({ acknowledged: true });
                expect(readDocumentResponse).to.have.property('success').to.be.true;
            });
        });

        describe(`Bug Verification`, async () => {
            it('Create with no X-Pepperi-SecretKey header (DI-20210)', async () => {
                const SchemeName = 'test_index';
                dataIndexAdalService.generalService.papiClient['options'].addonSecretKey = '';
                const createSchemeResponse = await dataIndexAdalService.createScheme(
                    generalService.papiClient['options'].addonUUID,
                    {
                        Name: SchemeName,
                        Hidden: false,
                        CreationDateTime: '1-1-2012',
                        ModificationDateTime: '1-1-2012',
                        Type: 'typed_index',
                        DataSourceURL: 'https://url',
                        DataSourceData: {
                            IndexName: 'tester',
                            NumberOfShards: 3,
                        },
                        StringIndexName: 'my_index',
                        Fields: {
                            DocumentName: {
                                Type: 'String',
                                Indexed: true,
                                Keyword: true,
                            },
                            DocumentBool: {
                                Type: 'Bool',
                            },
                            DocumentNumber: {
                                Type: 'Integer',
                            },
                            DocumentDouble: {
                                Type: 'Double',
                            },
                            DocumentDate: {
                                Type: 'DateTime',
                                Indexed: true,
                            },
                            DocumentMixedFormat: {
                                Type: 'DateTime',
                                Indexed: true,
                            },
                        },
                    },
                );
                //TODO: This will start to fail when the bug will be solved, and then it should be changed to catch the correct error
                expect(createSchemeResponse, JSON.stringify(createSchemeResponse)).to.have.property('acknowledged').to
                    .be.true;
            });
        });
    });
}
