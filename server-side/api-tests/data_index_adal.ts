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
                DocumentDouble: 112.2,
                DocumentDate: new Date(1800, 1).toISOString().split('.')[0] + 'Z',
                DocumentMixedFormat: new Date(2200, 12).toISOString().split('.')[0] + 'Z',
                Key: 1,
            };
            const updateDocumentTestData = {
                DocumentName: 'Dor - Update',
                DocumentBool: false,
                DocumentNumber: 0,
                DocumentDouble: -1,
                DocumentDate: new Date().toISOString().split('.')[0] + 'Z',
                DocumentMixedFormat: new Date(15, 7).toISOString().split('.')[0] + 'Z',
                Key: 1,
            };

            it('Create', async () => {
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

            it('Read Document', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByKey(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    1,
                );
                expect(readDocumentResponse).to.deep.equal(createDocumentTestData);
            });

            it('Read All Documents', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByKey(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                );
                expect(readDocumentResponse[0]).to.deep.equal(createDocumentTestData);
                expect(readDocumentResponse.length).to.equal(1);
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
                const readDocumentResponse = await dataIndexAdalService.getDocumentByKey(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                    1,
                );
                expect(readDocumentResponse).to.deep.equal(updateDocumentTestData);
            });

            // it('Update Document With Query', async () => {
            //     const createDocumentResponse = await dataIndexAdalService.updateDocument(
            //         generalService.papiClient['options'].addonUUID,
            //         SchemeName,
            //         {
            //             query: {
            //                 match: {
            //                     Key: '1',
            //                 },
            //                 script: {
            //                     source: 'ctx._source.DocumentNumber = 5',
            //                     lang: 'painless',
            //                 },
            //             },
            //         },
            //     );
            //     expect(createDocumentResponse).to.deep.equal(updateDocumentTestData);
            // });

            // it('Read Updated Document After Update Query', async () => {
            //     const readDocumentResponse = await dataIndexAdalService.getDocumentByKey(
            //         generalService.papiClient['options'].addonUUID,
            //         SchemeName,
            //         1,
            //     );
            //     debugger;
            //     expect(readDocumentResponse).to.deep.equal(updateDocumentTestData);
            // });

            it('Clean Document', async () => {
                const cleanDocumentResponse = await dataIndexAdalService.cleanDocument(
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
                expect(cleanDocumentResponse).to.have.property('resultObject').to.include({ deleted: 1 });
                expect(cleanDocumentResponse).to.have.property('success').to.be.true;
            });

            it('Read After Delete Document', async () => {
                const readDocumentResponse = await dataIndexAdalService.getDocumentByKey(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                );
                expect(readDocumentResponse).to.deep.equal([]);
            });

            it('Clean Scheme', async () => {
                const readDocumentResponse = await dataIndexAdalService.cleanScheme(
                    generalService.papiClient['options'].addonUUID,
                    SchemeName,
                );
                expect(readDocumentResponse).to.have.property('resultObject').to.deep.equal({ acknowledged: true });
                expect(readDocumentResponse).to.have.property('success').to.be.true;
            });
        });
    });
}
