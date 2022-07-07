import { DataIndexAdalService } from '../services/index';
import GeneralService, { TesterFunctions } from '../services/general.service';
import { ADALService } from '../services/adal.service';
import { DataIndexSchema } from '../services/data-index-adal.service';

export async function DataIndexADALTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const dataIndexAdalService = new DataIndexAdalService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';

    //#region Upgrade Data Index ADAL Pepperitest (Jenkins Special Addon)
    const testData = {
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, '0.0.5'],

        'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', '0.0.162'],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', '1.0.242'],
    };

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }

    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Upgrade Data Index ADAL Pepperitest (Jenkins Special Addon)

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
            const schemeName = 'test_index';
            const indexSchema = {
                Name: schemeName,
                Hidden: false,
                Type: 'index' as DataIndexSchema['Type'],
                DataSourceURL: 'https://url',
                DataSourceData: {
                    IndexName: 'tester',
                    NumberOfShards: 1,
                },
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
            };

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
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    indexSchema,
                );
                expect(createSchemeResponse, JSON.stringify(createSchemeResponse)).to.have.property('acknowledged').to
                    .be.true;
                expect(createSchemeResponse, JSON.stringify(createSchemeResponse))
                    .to.have.property('index')
                    .to.equal(`${distributorUUID}_${generalService.papiClient['options'].addonUUID}_${schemeName}`);
                expect(createSchemeResponse, JSON.stringify(createSchemeResponse)).to.have.property(
                    'shards_acknowledged',
                ).to.be.true;
            });

            it('Create Document', async () => {
                const createDocumentResponse = await dataIndexAdalService.createDocument(
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    createDocumentTestData,
                );
                expect(createDocumentResponse).to.deep.equal(createDocumentTestData);
            });

            it('Bulk Create Document', async () => {
                const createDocumentResponse = await dataIndexAdalService.createBatchDocument(
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
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
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    {
                        query: {
                            match: {
                                DocumentName: createDocumentTestData.DocumentName,
                            },
                        },
                    },
                    indexSchema
                );
                expect(readDocumentResponse).to.deep.include.members([
                    secondDocument,
                    thirdDocument,
                    createDocumentTestData,
                ]);
            });

            it('Read All Documents', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    indexSchema,
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
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
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    updateDocumentTestData,
                );
                expect(createDocumentResponse).to.deep.equal(updateDocumentTestData);
            });

            it('Read Updated Document After Override', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    indexSchema,
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    1,
                );
                expect(readDocumentResponse).to.deep.equal(updateDocumentTestData);
            });

            it('Update Document With DSL Query (DI-19468)', async () => {
                const createDocumentResponse = await dataIndexAdalService.updateDocument(
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
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
                    indexSchema
                );
                expect(createDocumentResponse, JSON.stringify(createDocumentResponse))
                    .to.have.property('updated')
                    .to.equal(1);
            });

            it('Read Updated Document After Update Query', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    indexSchema,
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    1,
                );
                expect(readDocumentResponse).to.have.property('DocumentDouble').to.equal(3);
                expect(readDocumentResponse).to.have.property('DocumentNumber').to.equal(4);
            });

            it('Update Bulk Documents With Query (DI-19450)', async () => {
                const createDocumentResponse = await dataIndexAdalService.updateDocument(
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
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
                    indexSchema
                );
                expect(createDocumentResponse).to.have.property('updated').to.equal(3);
            });

            it('Bulk Read Updated Document After Update Query', async () => {
                const readDocumentResponse = await dataIndexAdalService.searchAllDocuments(
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    {
                        query: {
                            match: {
                                DocumentName: createDocumentTestData.DocumentName,
                            },
                        },
                    },
                    indexSchema
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
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    indexSchema,
                    {
                        query: {
                            match: {
                                Key: thirdDocument.Key,
                            },
                        },
                    },
                );
                expect(removeDocumentResponse).to.include({ batches: 1 });
                expect(removeDocumentResponse).to.include({ deleted: 1 });
            });

            it('Bulk Read After Delete Document', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    indexSchema,
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                );
                expect(readDocumentResponse.length).to.equal(2);
            });

            it('Remove Document', async () => {
                const removeDocumentResponse = await dataIndexAdalService.removeDocuments(
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    indexSchema,
                    {
                        query: {
                            match: {
                                DocumentName: updateDocumentTestData.DocumentName,
                            },
                        },
                    },
                );
                expect(removeDocumentResponse).to.include({ batches: 1 });
                expect(removeDocumentResponse).to.include({ deleted: 2 });
            });

            it('Read After Delete Document', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    indexSchema,
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                );
                expect(readDocumentResponse).to.deep.equal([]);
            });

            it('Remove Scheme', async () => {
                const readDocumentResponse = await dataIndexAdalService.removeScheme(
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    indexSchema,
                );
                expect(readDocumentResponse).to.deep.equal({ acknowledged: true });
            });
        });

        //TODO: This test is related to Router ADAL - Talk with Shir - Yoni :D
        describe('Typed Index CRUD', () => {
            const schemeName = 'test_shared_index';
            const typedIndexSchema = {
                Name: schemeName,
                Hidden: false,
                Type: 'shared_index' as DataIndexSchema['Type'],
                DataSourceURL: 'https://url',
                DataSourceData: {
                    IndexName: 'tester',
                    NumberOfShards: 1,
                },
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
            };
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
                const adalService = new ADALService(generalService.papiClient);
                const createSchemeInAdalResponse = await adalService.postSchema(typedIndexSchema as any);

                delete createSchemeInAdalResponse.CreationDateTime;
                delete createSchemeInAdalResponse.ModificationDateTime;
                expect(createSchemeInAdalResponse).to.deep.equal(typedIndexSchema);
            });

            it('Create Document', async () => {
                const createDocumentResponse = await dataIndexAdalService.createDocument(
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    createDocumentTestData,
                    typedIndexSchema
                );
                expect(createDocumentResponse).to.deep.equal(createDocumentTestData);
            });

            it('Bulk Create Document', async () => {
                const createDocumentResponse = await dataIndexAdalService.createBatchDocument(
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    [createDocumentTestData, secondDocument, thirdDocument],
                    typedIndexSchema
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
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    {
                        query: {
                            match: {
                                DocumentName: createDocumentTestData.DocumentName,
                            },
                        },
                    },
                    typedIndexSchema
                );
                expect(readDocumentResponse).to.deep.include.members([
                    secondDocument,
                    thirdDocument,
                    createDocumentTestData,
                ]);
            });

            it('Read All Documents', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    typedIndexSchema,
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
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
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    updateDocumentTestData,
                    typedIndexSchema
                );
                expect(createDocumentResponse).to.deep.equal(updateDocumentTestData);
            });

            it('Read Updated Document After Override', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    typedIndexSchema,
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    1,
                );
                expect(readDocumentResponse).to.deep.equal(updateDocumentTestData);
            });

            it('Update Document With DSL Query (DI-19468)', async () => {
                const createDocumentResponse = await dataIndexAdalService.updateDocument(
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
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
                    typedIndexSchema
                );
                expect(createDocumentResponse, JSON.stringify(createDocumentResponse))
                    .to.have.property('updated')
                    .to.equal(1);
            });

            it('Read Updated Document After Update Query', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    typedIndexSchema,
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    1,
                );
                expect(readDocumentResponse).to.have.property('DocumentDouble').to.equal(3);
                expect(readDocumentResponse).to.have.property('DocumentNumber').to.equal(4);
            });

            it('Update Bulk Documents With Query (DI-19450)', async () => {
                const createDocumentResponse = await dataIndexAdalService.updateDocument(
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
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
                    typedIndexSchema
                );
                expect(createDocumentResponse).to.have.property('updated').to.equal(3);
            });

            it('Bulk Read Updated Document After Update Query', async () => {
                const readDocumentResponse = await dataIndexAdalService.searchAllDocuments(
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    {
                        query: {
                            match: {
                                DocumentName: createDocumentTestData.DocumentName,
                            },
                        },
                    },
                    typedIndexSchema
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
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    typedIndexSchema,
                    {
                        query: {
                            match: {
                                Key: thirdDocument.Key,
                            },
                        },
                    },
                );
                expect(removeDocumentResponse).to.include({ batches: 1 });
                expect(removeDocumentResponse).to.include({ deleted: 1 });
            });

            it('Bulk Read After Delete Document', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    typedIndexSchema,
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                );
                expect(readDocumentResponse.length).to.equal(2);
            });

            it('Remove Document', async () => {
                const removeDocumentResponse = await dataIndexAdalService.removeDocuments(
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                    typedIndexSchema,
                    {
                        query: {
                            match: {
                                DocumentName: updateDocumentTestData.DocumentName,
                            },
                        },
                    },
                );
                expect(removeDocumentResponse).to.include({ batches: 1 });
                expect(removeDocumentResponse).to.include({ deleted: 2 });
            });

            it('Read After Delete Document', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    typedIndexSchema,
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    schemeName,
                );
                expect(readDocumentResponse).to.deep.equal([]);
            });

            it('Remove Scheme', async () => {
                const readDocumentResponse = await dataIndexAdalService.removeScheme(
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    typedIndexSchema,
                );
                expect(readDocumentResponse).to.deep.equal({ acknowledged: true });
            });
        });

        describe('Validate Index and Typed Index Scheme and Documents Removed With Uninstall (DI-19803, DI-20220)', () => {
            const distributorUUID = generalService.getClientData('DistributorUUID');
            const indexSchemeName = 'test_index';
            const indexSchema = {
                Name: indexSchemeName,
                Hidden: false,
                Type: 'index' as DataIndexSchema['Type'],
                DataSourceURL: 'https://url',
                DataSourceData: {
                    IndexName: 'tester',
                    NumberOfShards: 1,
                },
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
            };

            const typedSchemeName = 'test_shared_index';
            const typedIndexSchema = {
                Name: typedSchemeName,
                Hidden: false,
                Type: 'shared_index' as DataIndexSchema['Type'],
                DataSourceURL: 'https://url',
                DataSourceData: {
                    IndexName: 'tester',
                    NumberOfShards: 1,
                },
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
            };
            const createDocumentTestData = {
                DocumentName: 'Dor',
                DocumentBool: true,
                DocumentNumber: 5,
                DocumentDouble: 50.3,
                DocumentDate: new Date(1800, 1).toISOString().split('.')[0] + 'Z',
                DocumentMixedFormat: new Date(2200, 12).toISOString().split('.')[0] + 'Z',
                Key: 1,
            };

            it('Change Services To Work For Other Addon And Create Schems', async () => {
                generalService.papiClient['options'].addonUUID = addonUUID;
                const addonUUIDSK = await generalService.getSecretKey(addonUUID, varKey);
                generalService.papiClient['options'].addonSecretKey = addonUUIDSK;
                const adalService = new ADALService(generalService.papiClient);

                adalService.papiClient['options'].addonUUID = addonUUID;
                adalService.papiClient['options'].addonSecretKey = addonUUIDSK;

                const createSchemeInAdalResponse = await adalService.postSchema(typedIndexSchema as any);

                delete createSchemeInAdalResponse.CreationDateTime;
                delete createSchemeInAdalResponse.ModificationDateTime;
                expect(createSchemeInAdalResponse).to.deep.equal(typedIndexSchema);
            });

            it('Create Scheme', async () => {
                const createSchemeResponse = await dataIndexAdalService.createScheme(
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    indexSchema,
                );
                expect(createSchemeResponse, JSON.stringify(createSchemeResponse)).to.have.property('acknowledged').to
                    .be.true;
                expect(createSchemeResponse, JSON.stringify(createSchemeResponse))
                    .to.have.property('index')
                    .to.equal(
                        `${distributorUUID}_${generalService.papiClient['options'].addonUUID}_${indexSchemeName}`,
                    );
                expect(createSchemeResponse, JSON.stringify(createSchemeResponse)).to.have.property(
                    'shards_acknowledged',
                ).to.be.true;
            });

            it('Create Index Document', async () => {
                const createDocumentResponse = await dataIndexAdalService.createDocument(
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    indexSchemeName,
                    createDocumentTestData,
                );
                expect(createDocumentResponse).to.deep.equal(createDocumentTestData);
            });

            it('Create Typed Index Document', async () => {
                const createDocumentResponse = await dataIndexAdalService.createDocument(
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    typedSchemeName,
                    createDocumentTestData,
                    typedIndexSchema
                );
                expect(createDocumentResponse).to.deep.equal(createDocumentTestData);
            });

            it('Read All Index Documents', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    typedIndexSchema,
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    typedSchemeName,
                );
                expect(readDocumentResponse.length).to.equal(1);
            });

            it('Read All Typed Index Documents', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    indexSchema,
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    indexSchemeName,
                );
                expect(readDocumentResponse.length).to.equal(1);
            });

            it('Uninstall Addon With Data Index Documents', async () => {
                const uninstallAddonResponse: any = await generalService.uninstallAddon(addonUUID);
                ;
                const uninstallAddonAuditLogResponse = await generalService.getAuditLogResultObjectIfValid(
                    uninstallAddonResponse.URI,
                    90,
                );
                expect(
                    uninstallAddonAuditLogResponse.Status?.ID,
                    JSON.stringify(uninstallAddonAuditLogResponse.AuditInfo.ResultObject),
                ).to.equal(1);
            });

            it('Read After Delete Index Document', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    typedIndexSchema,
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    typedSchemeName,
                );
                expect(readDocumentResponse).to.deep.equal([]);
            });

            it('Read After Delete Typed Index Document', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByNameAndOptionalKey(
                    indexSchema,
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    indexSchemeName,
                );
                expect(readDocumentResponse).to.deep.equal([]);
            });

            it('Remove Scheme Index', async () => {
                const readDocumentResponse = await dataIndexAdalService.removeScheme(
                    'index',
                    generalService.papiClient['options'].addonUUID,
                    indexSchema,
                );
                expect(readDocumentResponse).to.deep.equal({ acknowledged: true });
            });

            it('Remove Typed Index Scheme', async () => {
                const readDocumentResponse = await dataIndexAdalService.removeScheme(
                    'shared_index',
                    generalService.papiClient['options'].addonUUID,
                    typedIndexSchema,
                );
                expect(readDocumentResponse).to.deep.equal({ acknowledged: true });
            });
        });

        describe(`Bug Verification`, async () => {
            const schemeName = 'test_index';
            const typedIndexSchema = {
                Name: schemeName,
                Hidden: false,
                Type: 'index' as DataIndexSchema['Type'],
                DataSourceURL: 'https://url',
                DataSourceData: {
                    IndexName: 'tester',
                    NumberOfShards: 1,
                },
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
            };

            it('Create with no X-Pepperi-SecretKey header (DI-20210)', async () => {
                dataIndexAdalService.generalService.papiClient['options'].addonSecretKey = '';
                await expect(
                    dataIndexAdalService.createScheme(
                        'index',
                        generalService.papiClient['options'].addonUUID,
                        typedIndexSchema,
                    ),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Secret key is invalid","detail":{"errorcode":"BadRequest"}}}`,
                );
            });
        });
    });
}
