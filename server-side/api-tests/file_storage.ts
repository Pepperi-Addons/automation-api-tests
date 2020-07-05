import GeneralService from '../services/general.service';
import tester from '../tester';
import { FileStorageService } from '../services/file-storage.service';
import { FileStorage } from '@pepperi-addons/papi-sdk';
import fetch from 'node-fetch';

// All File Storage Tests
export async function FileStorageTests(generalService: GeneralService) {
    const service = new FileStorageService(generalService.papiClient);
    const { describe, expect, it, run } = tester();

    //#region Tests

    //#region Endpoints
    describe('Endpoints', () => {
        describe('Upsert', () => {
            it('Upsert a file valid response', async () => {
                const testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postFileToStorage({
                        Title: testDataFileName,
                        FileName: testDataFileName + '.txt',
                        Description: '',
                        Content: service.createTestDataInBase64Format(),
                    }),
                )
                    .eventually.to.have.property('InternalID')
                    .that.is.a('number')
                    .and.is.above(0);
            });
        });

        describe('Get', () => {
            it('Get a file valid response', async () => {
                const testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                const created = await service.postFileToStorage({
                    Title: testDataFileName,
                    FileName: testDataFileName + '.txt',
                    Description: '',
                    Content: service.createTestDataInBase64Format(),
                });

                const getFileResponseObj = await service.getFilesFromStorage(`InternalID=${created.InternalID}`);
                return expect(getFileResponseObj[0])
                    .to.include({ Title: testDataFileName })
                    .and.to.include({ InternalID: created.InternalID })
                    .and.to.include({ FileName: testDataFileName + '.txt' })
                    .and.to.include({ Description: '' });
            });
        });
    });
    //#endregion Endpoints

    //#region Scenarios
    describe('Scenarios', () => {
        describe('CRUD One File Using The File Storage in Base64', () => {
            it('Add a file to the file storage', async () => {
                const allfilesBefore: FileStorage[] = await service.getFilesFromStorage();

                const testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return Promise.all([
                    await expect(
                        service.postFileToStorage({
                            Title: testDataFileName,
                            FileName: testDataFileName + '.txt',
                            Description: '',
                            Content: service.createTestDataInBase64Format(),
                        }),
                    )
                        .eventually.to.have.property('InternalID')
                        .a('number')
                        .above(200000),

                    expect(await service.getFilesFromStorage())
                        .to.be.an('array')
                        .with.lengthOf(allfilesBefore.length + 1),
                ]);
            });

            it('Read a file from the file storage', async () => {
                const testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                await expect(
                    service.postFileToStorage({
                        Title: testDataFileName,
                        FileName: testDataFileName + '.txt',
                        Description: '',
                        Content: service.createTestDataInBase64Format(),
                    }),
                )
                    .eventually.to.have.property('InternalID')
                    .a('number')
                    .above(200000);

                    const fileObjectArr = await service.getFilesFromStorage(`Title='${testDataFileName}'`);
                    return expect(fileObjectArr[0])
                    .to.include({ Title: testDataFileName })
                    .and.to.include('Configuration').that.is.null
/*
                        .to.include({ Title: testDataFileName })
                        .and.to.include({ InternalID: created.InternalID })
                        .and.to.include({ FileName: testDataFileName + '.txt' })
                        .and.to.include({ Description: '' });

                expect(fileObject.Configuration).to.be.null;
                expect(fileObject.Content).to.be.null;
                expect(fileObject.CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(fileObject.Description).to.be.equal(''); //undefined //TODO: Wait for ido to decide - DB cant contian undefined
                expect(fileObject.FileName).to.be.equal(testDataFileName + '.txt');
                expect(fileObject.Hidden).to.be.false;
                expect(fileObject.IsSync).to.be.false;
                expect(fileObject.MimeType).to.be.equal('text/plain');
                expect(fileObject.ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(fileObject.Title).to.be.equal(testDataFileName);
                expect(fileObject.URL).to.be.contain(testDataFileName + '.txt');*/
            });

            let allFilesAfter: FileStorage[];
            let testDataFileName: string;
            it('Create a file in the file storage', async () => {
                //Get the current (before) files from the File Storage
                const allfilesBefore: FileStorage[] = await service.getFilesFromStorage();

                //Add a file to the File Storage
                testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                await service.postFileToStorage({
                    Title: testDataFileName,
                    FileName: testDataFileName + '.txt',
                    Description: '',
                    Content: service.createTestDataInBase64Format(),
                });

                //Get the current (after) files from the File Storage
                await expect((allFilesAfter = await service.getFilesFromStorage()))
                    .to.be.an('array')
                    .with.lengthOf(allfilesBefore.length + 1);

                let fileObject;
                //Save the created file information
                for (let index = 0; index < allFilesAfter.length; index++) {
                    if (allFilesAfter[index].FileName?.toString().startsWith(testDataFileName)) {
                        fileObject = allFilesAfter[index];
                        break;
                    }
                }

                expect(Number(fileObject.InternalID) > 200000);
                expect(fileObject.Configuration).to.be.null;
                expect(fileObject.Content).to.be.null;
                expect(fileObject.CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(fileObject.Description).to.be.equal(''); //undefined //TODO: Wait for ido to decide - DB cant contian undefined
                expect(fileObject.FileName).to.be.equal(testDataFileName + '.txt');
                expect(fileObject.Hidden).to.be.false;
                expect(fileObject.IsSync).to.be.false;
                expect(fileObject.MimeType).to.be.equal('text/plain');
                expect(fileObject.ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(fileObject.Title).to.be.equal(testDataFileName);
                expect(fileObject.URL).to.be.contain(testDataFileName + '.txt');
            });

            let fileObject: FileStorage;
            it('Read the new added file properties', async () => {
                //Save the created file information
                for (let index = 0; index < allFilesAfter.length; index++) {
                    if (allFilesAfter[index].FileName?.toString().startsWith(testDataFileName)) {
                        fileObject = allFilesAfter[index];
                        break;
                    }
                }

                expect(Number(fileObject.InternalID) > 200000);
                expect(fileObject.Configuration).to.be.null;
                expect(fileObject.Content).to.be.null;
                expect(fileObject.CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(fileObject.Description).to.be.equal(''); //undefined //TODO: Wait for ido to decide - DB cant contian undefined
                expect(fileObject.FileName).to.be.equal(testDataFileName + '.txt');
                expect(fileObject.Hidden).to.be.false;
                expect(fileObject.IsSync).to.be.false;
                expect(fileObject.MimeType).to.be.equal('text/plain');
                expect(fileObject.ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(fileObject.Title).to.be.equal(testDataFileName);
                expect(fileObject.URL).to.be.contain(testDataFileName + '.txt');
            });

            let uriStr: string;
            it('Read the new added file content', async () => {
                //Get the created file content
                uriStr = fileObject.URL as any;
                const fileContent: string = await fetch(uriStr).then((response) => response.text());

                expect(fileContent).to.contain('ABCD');
            });

            let inItupdatedFileObject: FileStorage;
            let updatedFileContent: string;
            it('Update the new added file', async () => {
                //Update the new added file
                const updatedFileObject: FileStorage = {
                    Configuration: fileObject.Configuration,
                    Hidden: fileObject.Hidden,
                    InternalID: fileObject.InternalID,
                    Description: 'New description',
                    Content: Buffer.from('EDCBA').toString('base64'),
                    CreationDate: '1999-09-09Z',
                    FileName: 'Test 9999999.txt', //TODO: Changing the name to a name without ".txt" sufix should be prevented or something
                    IsSync: true,
                    MimeType: 'text/xml',
                    ModificationDate: '1999-09-09Z',
                    Title: 'Test 9999999',
                    URL: 'https://cdn.Test',
                };

                await service.postFileToStorage(updatedFileObject);

                //Get the current (after the update) files from the File Storage
                const allFilesAfter: FileStorage[] = await service.getFilesFromStorage();

                let updatedFileObjectNewUrl;
                for (let index = 0; index < allFilesAfter.length; index++) {
                    if (allFilesAfter[index].InternalID == fileObject.InternalID) {
                        updatedFileObjectNewUrl = allFilesAfter[index];
                        break;
                    }
                }

                //Get the updated file content
                const updateduriStr = updatedFileObjectNewUrl.URL;
                updatedFileContent = await fetch(updateduriStr).then((response) => response.text());

                for (let index = 0; index < allFilesAfter.length; index++) {
                    if (allFilesAfter[index].InternalID == fileObject.InternalID) {
                        inItupdatedFileObject = allFilesAfter[index];
                        break;
                    }
                }
                expect(Number(inItupdatedFileObject.InternalID) == fileObject.InternalID);
                expect(inItupdatedFileObject.Configuration).to.be.null;
                expect(inItupdatedFileObject.Content).to.be.null;
                expect(inItupdatedFileObject.CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(inItupdatedFileObject.Description).to.be.equal(updatedFileObject.Description);
                expect(inItupdatedFileObject.FileName).to.be.equal(updatedFileObject.FileName);
                expect(inItupdatedFileObject.Hidden).to.be.false;
                expect(inItupdatedFileObject.IsSync).to.be.equal(updatedFileObject.IsSync);
                expect(inItupdatedFileObject.MimeType).to.be.equal('text/plain');
                expect(inItupdatedFileObject.ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(inItupdatedFileObject.Title).to.be.equal(updatedFileObject.Title);
                expect(inItupdatedFileObject.URL).to.be.contain(updatedFileObjectNewUrl.URL);
            });

            it('Read the updated file content', () => {
                expect(updatedFileContent).to.contain('EDCBA');
            });

            it('Read the first added file content again after updated the new file', async () => {
                //Get the created file content
                const fileContent: string = await fetch(uriStr).then((response) => response.text());

                expect(fileContent).to.contain('ABCD');
            });

            it('Make sure files removed in the end of the tests', async () => {
                //Make sure files removed in the end of the tests
                return expect(TestCleanUp(service)).eventually.to.be.above(0);
            });

            it('Delete the new file', async () => {
                //Get the current (after) files from the File Storage
                const allFilesAfter: FileStorage[] = await service.getFilesFromStorage();
                let deletedFileObject: any;

                for (let index = 0; index < allFilesAfter.length; index++) {
                    if (allFilesAfter[index].FileName?.toString().startsWith(testDataFileName)) {
                        deletedFileObject = allFilesAfter[index];
                        break;
                    }
                }
                expect(deletedFileObject).to.be.undefined;
            });
        });
/*
        describe('CRD One File Using The File Storage using URL', () => {
            let fileObject: FileStorage;
            let testDataFileName: string;
            it('Create a file in the file storage', async () => {
                //Get the current (before) files from the File Storage
                const allfilesBefore: FileStorage[] = await service.getFilesFromStorage();

                //Add a file to the File Storage with URL
                testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                await service.postFileToStorage({
                    Title: testDataFileName,
                    FileName: testDataFileName + '.txt',
                    Description: '',
                    URL:
                        'https://cdn.staging.pepperi.com/30013175/CustomizationFile/9e57eea7-0277-441d-beae-0de365cbdd8b/TestData.txt',
                });

                let allFilesAfter: FileStorage[];

                //Get the current (after) files from the File Storage
                await expect((allFilesAfter = await service.getFilesFromStorage()))
                    .to.be.an('array')
                    .with.lengthOf(allfilesBefore.length + 1);

                //Save the created file information
                for (let index = 0; index < allFilesAfter.length; index++) {
                    if (allFilesAfter[index].FileName?.toString().startsWith(testDataFileName)) {
                        fileObject = allFilesAfter[index];
                        break;
                    }
                }
            });

            it('Read the new added file properties', async () => {
                expect(Number(fileObject.InternalID) > 200000);
                expect(fileObject.Configuration).to.be.null;
                expect(fileObject.Content).to.be.null;
                expect(fileObject.CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(fileObject.Description).to.be.equal(''); //undefined //TODO: Wait for ido to decide - DB cant contian undefined
                expect(fileObject.FileName).to.be.equal(testDataFileName + '.txt');
                expect(fileObject.Hidden).to.be.false;
                expect(fileObject.IsSync).to.be.false;
                expect(fileObject.MimeType).to.be.equal('text/plain');
                expect(fileObject.ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(fileObject.Title).to.be.equal(testDataFileName);
                expect(fileObject.URL).to.be.contain(testDataFileName + '.txt');
            });

            it('Read the new added file content', async () => {
                //Get the created file content
                const uriStr: string = fileObject.URL as any;
                const fileContent: string = await fetch(uriStr).then((response) => response.text());

                expect(fileContent).to.contain('Test Data for File Storage');
            });

            it('Make sure files removed in the end of the tests', async () => {
                //Make sure files removed in the end of the tests
                return expect(TestCleanUp(service)).eventually.to.be.above(0);
            });

            it('Delete the new file', async () => {
                //Get the current (after) files from the File Storage
                const allFilesAfter: FileStorage[] = await service.getFilesFromStorage();
                let deletedFileObject: any;

                for (let index = 0; index < allFilesAfter.length; index++) {
                    if (allFilesAfter[index].FileName?.toString().startsWith(testDataFileName)) {
                        deletedFileObject = allFilesAfter[index];
                        break;
                    }
                }
                expect(deletedFileObject).to.be.undefined;
            });
        });

        describe('CRD One File Using The File Storage With IsSync = true', () => {
            let testDataFileName: string;
            let allFilesAfter: FileStorage[];
            let fileObject: FileStorage;
            it('Create a file in the file storage', async () => {
                //Get the current (before) files from the File Storage
                const allfilesBefore: FileStorage[] = await service.getFilesFromStorage();

                //Add a file to the File Storage with URL
                testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                await service.postFileToStorage({
                    Title: testDataFileName,
                    FileName: testDataFileName + '.txt',
                    Description: '',
                    Content: service.createTestDataInBase64Format(),
                    IsSync: true,
                });
                //Get the current (after) files from the File Storage
                return expect((allFilesAfter = await service.getFilesFromStorage()))
                    .to.be.an('array')
                    .with.lengthOf(allfilesBefore.length + 1);
            });

            let fileContent: string;
            it('Read the new added file properties', async () => {
                //Save the created file information
                for (let index = 0; index < allFilesAfter.length; index++) {
                    if (allFilesAfter[index].FileName?.toString().startsWith(testDataFileName)) {
                        fileObject = allFilesAfter[index];
                        break;
                    }
                }

                //Get the created file content
                const uriStr: string = fileObject.URL as any;
                fileContent = await fetch(uriStr).then((response) => response.text());

                expect(Number(fileObject.InternalID) > 200000);
                expect(fileObject.Configuration).to.be.null;
                expect(fileObject.Content).to.be.null;
                expect(fileObject.CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(fileObject.Description).to.be.equal(''); //undefined //TODO: Wait for ido to decide - DB cant contian undefined
                expect(fileObject.FileName).to.be.equal(testDataFileName + '.txt');
                expect(fileObject.Hidden).to.be.false;
                expect(fileObject.IsSync).to.be.true;
                expect(fileObject.MimeType).to.be.equal('text/plain');
                expect(fileObject.ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(fileObject.Title).to.be.equal(testDataFileName);
                expect(fileObject.URL).to.be.contain(testDataFileName + '.txt');
            });

            it('Read the new added file content', () => {
                expect(fileContent).to.contain('ABCD');
            });

            it('Make sure files removed in the end of the tests', async () => {
                //Make sure files removed in the end of the tests
                return expect(TestCleanUp(service)).eventually.to.be.above(0);
            });

            it('Delete the new file', async () => {
                //Get the current (after) files from the File Storage
                const allFilesAfter: FileStorage[] = await service.getFilesFromStorage();
                let deletedFileObject: any;

                for (let index = 0; index < allFilesAfter.length; index++) {
                    if (allFilesAfter[index].FileName?.toString().startsWith(testDataFileName)) {
                        deletedFileObject = allFilesAfter[index];
                        break;
                    }
                }
                expect(deletedFileObject).to.be.undefined;
            });
        });

        describe('Make sure file uploaded via Base64 when using both Base64 and URL', () => {
            let testDataFileName: string;
            let allFilesAfter: FileStorage[];
            it('Create a file in the file storage', async () => {
                //Get the current (before) files from the File Storage
                const allfilesBefore: FileStorage[] = await service.getFilesFromStorage();

                //Add a file to the File Storage with URL
                testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                await service.postFileToStorage({
                    Title: testDataFileName,
                    FileName: testDataFileName + '.txt',
                    Description: '',
                    Content: service.createTestDataInBase64Format(),
                    URL:
                        'https://cdn.staging.pepperi.com/30013175/CustomizationFile/9e57eea7-0277-441d-beae-0de365cbdd8b/TestData.txt',
                });
                //Get the current (after) files from the File Storage
                return expect((allFilesAfter = await service.getFilesFromStorage()))
                    .to.be.an('array')
                    .with.lengthOf(allfilesBefore.length + 1);
            });

            let fileObject: FileStorage;
            it('Read the new added file properties', async () => {
                //Save the created file information
                for (let index = 0; index < allFilesAfter.length; index++) {
                    if (allFilesAfter[index].FileName?.toString().startsWith(testDataFileName)) {
                        fileObject = allFilesAfter[index];
                        break;
                    }
                }

                expect(Number(fileObject.InternalID) > 200000);
                expect(fileObject.Configuration).to.be.null;
                expect(fileObject.Content).to.be.null;
                expect(fileObject.CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(fileObject.Description).to.be.equal(''); //undefined //TODO: Wait for ido to decide - DB cant contian undefined
                expect(fileObject.FileName).to.be.equal(testDataFileName + '.txt');
                expect(fileObject.Hidden).to.be.false;
                expect(fileObject.IsSync).to.be.false;
                expect(fileObject.MimeType).to.be.equal('text/plain');
                expect(fileObject.ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                expect(fileObject.Title).to.be.equal(testDataFileName);
                expect(fileObject.URL).to.be.contain(testDataFileName + '.txt');
            });

            it('Read the new added file content', async () => {
                //Get the created file content
                const uriStr: string = fileObject.URL as any;
                const fileContent: string = await fetch(uriStr).then((response) => response.text());

                expect(fileContent).to.contain('ABCD');
            });

            it('Make sure files removed in the end of the tests', async () => {
                //Make sure files removed in the end of the tests
                return expect(TestCleanUp(service)).eventually.to.be.above(0);
            });

            it('Delete the new file', async () => {
                //Get the current (after) files from the File Storage
                const allFilesAfter: FileStorage[] = await service.getFilesFromStorage();
                let deletedFileObject: any;

                for (let index = 0; index < allFilesAfter.length; index++) {
                    if (allFilesAfter[index].FileName?.toString().startsWith(testDataFileName)) {
                        deletedFileObject = allFilesAfter[index];
                        break;
                    }
                }
                expect(deletedFileObject).to.be.undefined;
            });
        });

        describe('Mandatory Title test (negative)', () => {
            let allfilesBefore: FileStorage[];
            it('Correct exception message for Title', async () => {
                //Get the current (before) files from the File Storage
                allfilesBefore = await service.getFilesFromStorage();

                //Add a file to the File Storage without Title
                const testDataFileName: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postFileToStorage({
                        FileName: testDataFileName + '.txt',
                        Description: '',
                        Content: service.createTestDataInBase64Format(),
                    } as any),
                ).to.be.rejectedWith('The mandatory property \\"Title\\" can\'t be ignore.');
            });

            it("Don't Create a file in the file storage", async () => {
                //Get the current (after) files from the File Storage
                return expect(service.getFilesFromStorage())
                    .eventually.to.be.an('array')
                    .with.lengthOf(allfilesBefore.length);
            });
        });

        describe('Mandatory FileName test (negative)', () => {
            let allfilesBefore: FileStorage[];
            it('Correct exception message for FileName', async () => {
                //Get the current (before) files from the File Storage
                allfilesBefore = await service.getFilesFromStorage();

                //Add a file to the File Storage without FileName
                const testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postFileToStorage({
                        Title: testDataFileName + '.txt',
                        Description: '',
                        Content: service.createTestDataInBase64Format(),
                    } as any),
                ).to.be.rejectedWith('The mandatory property \\"FileName\\" can\'t be ignore.');
            });

            it("Don't Create a file in the file storage", async () => {
                //Get the current (after) files from the File Storage
                return expect(service.getFilesFromStorage())
                    .eventually.to.be.an('array')
                    .with.lengthOf(allfilesBefore.length);
            });
        });

        describe('Mandatory properties test (negative)', () => {
            let allfilesBefore: FileStorage[];
            it('Correct exception message for mandatory properties', async () => {
                //Get the current (before) files from the File Storage
                allfilesBefore = await service.getFilesFromStorage();

                //Add a file to the File Storage without any Mandatory
                return expect(
                    service.postFileToStorage({
                        Description: '',
                        Content: service.createTestDataInBase64Format(),
                    } as any),
                ).to.be.rejectedWith('The mandatory properties \\"Title\\", \\"FileName\\" can\'t be ignore.');
            });

            it("Don't Create a file in the file storage", async () => {
                //Get the current (after) files from the File Storage
                return expect(service.getFilesFromStorage())
                    .eventually.to.be.an('array')
                    .with.lengthOf(allfilesBefore.length);
            });
        });*/
    });

    //#endregion Scenarios
    return run();
    //#endregion Tests
}

//Service Functionss
//Remove all test files from Files Storage
async function TestCleanUp(service: FileStorageService) {
    const allfilesObject: FileStorage[] = await service.getFilesFromStorage();
    let deletedCounter = 0;
    for (let index = 0; index < allfilesObject.length; index++) {
        if (
            allfilesObject[index].FileName?.toString().startsWith('Test ') &&
            Number(allfilesObject[index].FileName?.toString().split(' ')[1].split('.')[0]) > 100
        ) {
            const tempBody: FileStorage = {
                FileName: allfilesObject[index].FileName,
                Title: allfilesObject[index].Title,
                InternalID: allfilesObject[index].InternalID,
                Hidden: true,
            };
            await service.postFileToStorage(tempBody);
            deletedCounter++;
        }
    }
    return deletedCounter;
}
