import GeneralService, { TesterFunctions } from '../services/general.service';
import { FileStorageService } from '../services/file-storage.service';
import { FileStorage } from '@pepperi-addons/papi-sdk';
import fetch from 'node-fetch';

// All File Storage Tests
export async function FileStorageTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = new FileStorageService(generalService.papiClient);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Tests
    describe('File Storage Tests Suites', () => {
        //#region Endpoints
        describe('Endpoints', () => {
            describe('Upsert', () => {
                it('Upsert File Valid Response', async () => {
                    const testDataFileName: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postFileToStorage({
                            Title: testDataFileName,
                            FileName: testDataFileName + '.txt',
                            Content: service.createTestDataInBase64Format(),
                        }),
                    )
                        .eventually.to.have.property('InternalID')
                        .that.is.a('number')
                        .and.is.above(0);
                });
            });

            describe('Get', () => {
                it('Get File Valid Response', async () => {
                    const testDataFileName: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    const created = await service.postFileToStorage({
                        Title: testDataFileName,
                        FileName: testDataFileName + '.txt',
                        Content: service.createTestDataInBase64Format(),
                    });

                    const getFileResponseObj = await service.getFilesFromStorage({
                        where: `InternalID=${created.InternalID}`,
                    });
                    return expect(getFileResponseObj[0]).to.include({
                        Title: testDataFileName,
                        InternalID: created.InternalID,
                        FileName: testDataFileName + '.txt',
                    });
                });
            });
        });
        //#endregion Endpoints

        //#region Scenarios
        describe('Scenarios', () => {
            describe('Positive', () => {
                describe('CRUD One File Using The File Storage in Base64', () => {
                    it('Add file to the file storage', async () => {
                        const allfilesBefore: FileStorage[] = await service.getFilesFromStorage({ page_size: -1 });
                        const testDataFileName: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        return Promise.all([
                            await expect(
                                service.postFileToStorage({
                                    Title: testDataFileName,
                                    FileName: testDataFileName + '.txt',
                                    Content: service.createTestDataInBase64Format(),
                                }),
                            )
                                .eventually.to.have.property('InternalID')
                                .a('number')
                                .above(0),

                            expect(await service.getFilesFromStorage({ page_size: -1 }))
                                .to.be.an('array')
                                .with.lengthOf(allfilesBefore.length + 1),
                        ]);
                    });

                    it('Read file from the file storage', async () => {
                        const testDataFileName: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        await expect(
                            service.postFileToStorage({
                                Title: testDataFileName,
                                FileName: testDataFileName + '.txt',
                                Content: service.createTestDataInBase64Format(),
                            }),
                        )
                            .eventually.to.have.property('InternalID')
                            .a('number')
                            .above(0);

                        const fileObjectArr = await service.getFilesFromStorage({
                            where: `Title='${testDataFileName}'`,
                        });

                        expect(fileObjectArr[0].InternalID).to.be.above(0);
                        expect(fileObjectArr[0]).to.include({
                            Configuration: null,
                            Content: null,
                            FileName: testDataFileName + '.txt',
                            Hidden: false,
                            IsSync: false,
                            MimeType: 'text/plain',
                            Title: testDataFileName,
                        });
                        expect(fileObjectArr[0].CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                        expect(fileObjectArr[0].CreationDate).to.contain('Z');
                        expect(fileObjectArr[0].ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                        expect(fileObjectArr[0].ModificationDate).to.contain('Z');
                        expect(fileObjectArr[0].URL).to.contain(testDataFileName + '.txt');
                    });

                    let allFilesAfter: FileStorage[];
                    let testDataFileName: string;
                    it('Create file in the file storage', async () => {
                        //Get the current (before) files from the File Storage
                        const allfilesBefore: FileStorage[] = await service.getFilesFromStorage({ page_size: -1 });

                        //Add file to the File Storage
                        testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        await service.postFileToStorage({
                            Title: testDataFileName,
                            FileName: testDataFileName + '.txt',
                            Content: service.createTestDataInBase64Format(),
                        });

                        //Get the current (after) files from the File Storage
                        await expect((allFilesAfter = await service.getFilesFromStorage({ page_size: -1 })))
                            .to.be.an('array')
                            .with.lengthOf(allfilesBefore.length + 1);

                        let fileObject;
                        //Save the created file information
                        for (let index = 0; index < allFilesAfter.length; index++) {
                            if (allFilesAfter[index].FileName?.toString().startsWith(`${testDataFileName}.txt`)) {
                                fileObject = allFilesAfter[index];
                                break;
                            }
                        }

                        expect(fileObject.InternalID).to.be.above(0);
                        expect(fileObject).to.include({
                            Configuration: null,
                            Content: null,
                            FileName: testDataFileName + '.txt',
                            Hidden: false,
                            IsSync: false,
                            MimeType: 'text/plain',
                            Title: testDataFileName,
                        });
                        expect(fileObject.CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                        expect(fileObject.CreationDate).to.contain('Z');
                        expect(fileObject.ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                        expect(fileObject.ModificationDate).to.contain('Z');
                        expect(fileObject.URL).to.contain(testDataFileName + '.txt');
                    });

                    let fileObject: FileStorage;
                    it('Read the new added file properties', async () => {
                        //Save the created file information
                        for (let index = 0; index < allFilesAfter.length; index++) {
                            if (allFilesAfter[index].FileName?.toString().startsWith(`${testDataFileName}.txt`)) {
                                fileObject = allFilesAfter[index];
                                break;
                            }
                        }

                        expect(fileObject.InternalID).to.be.above(0);
                        expect(fileObject).to.include({
                            Configuration: null,
                            Content: null,
                            //Description: 'Test Description', //undefined //TODO: Wait for ido to decide - DB cant contian undefined
                            FileName: testDataFileName + '.txt',
                            Hidden: false,
                            IsSync: false,
                            MimeType: 'text/plain',
                            Title: testDataFileName,
                        });
                        expect(fileObject.CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                        expect(fileObject.CreationDate).to.contain('Z');
                        expect(fileObject.ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                        expect(fileObject.ModificationDate).to.contain('Z');
                        expect(fileObject.URL).to.contain(testDataFileName + '.txt');
                    });

                    let uriStr: string;
                    it('Read the new added file content', async () => {
                        //Get the created file content
                        uriStr = fileObject.URL as any;
                        const fileContent: string = await fetch(uriStr).then((response) => response.text());
                        expect(fileContent).to.contain('ABCD');
                    });

                    let inUpdatedFileObject: FileStorage;
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
                            FileName: 'Test 9999999.txt', //TODO: Changing the name to name without ".txt" sufix should be prevented or something
                            IsSync: true,
                            MimeType: 'text/xml',
                            ModificationDate: '1999-09-09Z',
                            Title: 'Test 9999999',
                            URL: 'https://cdn.Test',
                        };

                        await service.postFileToStorage(updatedFileObject);

                        //Get the current (after the update) files from the File Storage
                        const allFilesAfter: FileStorage[] = await service.getFilesFromStorage({ page_size: -1 });

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
                                inUpdatedFileObject = allFilesAfter[index];
                                break;
                            }
                        }
                        expect(inUpdatedFileObject.InternalID).to.be.eql(fileObject.InternalID);
                        expect(inUpdatedFileObject).to.include({
                            Configuration: null,
                            Content: null,
                            Description: updatedFileObject.Description,
                            FileName: updatedFileObject.FileName,
                            Hidden: false,
                            IsSync: updatedFileObject.IsSync,
                            MimeType: 'text/plain',
                            Title: updatedFileObject.Title,
                        });
                        expect(inUpdatedFileObject.CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                        expect(inUpdatedFileObject.CreationDate).to.contain('Z');
                        expect(inUpdatedFileObject.ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                        expect(inUpdatedFileObject.ModificationDate).to.contain('Z');
                        expect(inUpdatedFileObject.URL).to.contain(updatedFileObjectNewUrl.URL);
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
                        const allFilesAfter: FileStorage[] = await service.getFilesFromStorage({ page_size: -1 });
                        let deletedFileObject: any;

                        for (let index = 0; index < allFilesAfter.length; index++) {
                            if (allFilesAfter[index].FileName?.toString().startsWith(`${testDataFileName}.txt`)) {
                                deletedFileObject = allFilesAfter[index];
                                break;
                            }
                        }
                        expect(deletedFileObject).to.be.undefined;
                    });
                });

                describe('CRD One File Using The File Storage using URL', () => {
                    let fileObject: FileStorage;
                    let testDataFileName: string;
                    it('Create file in the file storage', async () => {
                        //Get the current (before) files from the File Storage
                        const allfilesBefore: FileStorage[] = await service.getFilesFromStorage({ page_size: -1 });

                        //Add file to the File Storage with URL
                        testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        await service.postFileToStorage({
                            Title: testDataFileName,
                            FileName: testDataFileName + '.txt',
                            URL:
                                'https://cdn.staging.pepperi.com/30013175/CustomizationFile/9e57eea7-0277-441d-beae-0de365cbdd8b/TestData.txt',
                        });

                        let allFilesAfter: FileStorage[];

                        //Get the current (after) files from the File Storage
                        await expect((allFilesAfter = await service.getFilesFromStorage({ page_size: -1 })))
                            .to.be.an('array')
                            .with.lengthOf(allfilesBefore.length + 1);

                        //Save the created file information
                        for (let index = 0; index < allFilesAfter.length; index++) {
                            if (allFilesAfter[index].FileName?.toString().startsWith(`${testDataFileName}.txt`)) {
                                fileObject = allFilesAfter[index];
                                break;
                            }
                        }
                    });

                    it('Read the new added file properties', async () => {
                        expect(fileObject.InternalID).to.be.above(0);
                        expect(fileObject).to.include({
                            Configuration: null,
                            Content: null,
                            FileName: testDataFileName + '.txt',
                            Hidden: false,
                            IsSync: false,
                            MimeType: 'text/plain',
                            Title: testDataFileName,
                        });
                        expect(fileObject.CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                        expect(fileObject.CreationDate).to.contain('Z');
                        expect(fileObject.ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                        expect(fileObject.ModificationDate).to.contain('Z');
                        expect(fileObject.URL).to.contain(testDataFileName + '.txt');
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
                        const allFilesAfter: FileStorage[] = await service.getFilesFromStorage({ page_size: -1 });
                        let deletedFileObject: any;

                        for (let index = 0; index < allFilesAfter.length; index++) {
                            if (allFilesAfter[index].FileName?.toString().startsWith(`${testDataFileName}.txt`)) {
                                deletedFileObject = allFilesAfter[index];
                                break;
                            }
                        }
                        expect(deletedFileObject).to.be.undefined;
                    });
                });

                describe('CRD One File Using The File Storage with IsSync = true', () => {
                    let testDataFileName: string;
                    let allFilesAfter: FileStorage[];
                    let fileObject: FileStorage;
                    it('Create file in the file storage', async () => {
                        //Get the current (before) files from the File Storage
                        const allfilesBefore: FileStorage[] = await service.getFilesFromStorage({ page_size: -1 });

                        //Add file to the File Storage with URL
                        testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        await service.postFileToStorage({
                            Title: testDataFileName,
                            FileName: testDataFileName + '.txt',
                            Content: service.createTestDataInBase64Format(),
                            IsSync: true,
                        });
                        //Get the current (after) files from the File Storage
                        return expect((allFilesAfter = await service.getFilesFromStorage({ page_size: -1 })))
                            .to.be.an('array')
                            .with.lengthOf(allfilesBefore.length + 1);
                    });

                    let fileContent: string;
                    it('Read the new added file properties', async () => {
                        //Save the created file information
                        for (let index = 0; index < allFilesAfter.length; index++) {
                            if (allFilesAfter[index].FileName?.toString().startsWith(`${testDataFileName}.txt`)) {
                                fileObject = allFilesAfter[index];
                                break;
                            }
                        }

                        //Get the created file content
                        const uriStr: string = fileObject.URL as any;
                        fileContent = await fetch(uriStr).then((response) => response.text());

                        expect(fileObject.InternalID).to.be.above(0);
                        expect(fileObject).to.include({
                            Configuration: null,
                            Content: null,
                            FileName: testDataFileName + '.txt',
                            Hidden: false,
                            IsSync: true,
                            MimeType: 'text/plain',
                            Title: testDataFileName,
                        });
                        expect(fileObject.CreationDate).to.contain(new Date().toISOString().split('T')[0]);
                        expect(fileObject.CreationDate).to.contain('Z');
                        expect(fileObject.ModificationDate).to.contain(new Date().toISOString().split('T')[0]);
                        expect(fileObject.ModificationDate).to.contain('Z');
                        expect(fileObject.URL).to.contain(testDataFileName + '.txt');
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
                        const allFilesAfter: FileStorage[] = await service.getFilesFromStorage({ page_size: -1 });
                        let deletedFileObject: any;

                        for (let index = 0; index < allFilesAfter.length; index++) {
                            if (allFilesAfter[index].FileName?.toString().startsWith(`${testDataFileName}.txt`)) {
                                deletedFileObject = allFilesAfter[index];
                                break;
                            }
                        }
                        expect(deletedFileObject).to.be.undefined;
                    });
                });

                describe('Make Sure File Uploaded Via Base64 When Using Both Base64 and URL', () => {
                    let testDataFileName: string;
                    let allFilesAfter: FileStorage[];
                    it('Create file in the file storage', async () => {
                        //Get the current (before) files from the File Storage
                        const allfilesBefore: FileStorage[] = await service.getFilesFromStorage({ page_size: -1 });

                        //Add file to the File Storage with URL
                        testDataFileName = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        await service.postFileToStorage({
                            Title: testDataFileName,
                            FileName: testDataFileName + '.txt',
                            Content: service.createTestDataInBase64Format(),
                            URL:
                                'https://cdn.staging.pepperi.com/30013175/CustomizationFile/9e57eea7-0277-441d-beae-0de365cbdd8b/TestData.txt',
                        });
                        //Get the current (after) files from the File Storage
                        return expect((allFilesAfter = await service.getFilesFromStorage({ page_size: -1 })))
                            .to.be.an('array')
                            .with.lengthOf(allfilesBefore.length + 1);
                    });

                    let fileObject: FileStorage;
                    it('Read the new added file properties', async () => {
                        //Save the created file information
                        for (let index = 0; index < allFilesAfter.length; index++) {
                            if (allFilesAfter[index].FileName?.toString().startsWith(`${testDataFileName}.txt`)) {
                                fileObject = allFilesAfter[index];
                                break;
                            }
                        }

                        expect(fileObject.InternalID).to.be.above(0);
                        expect(fileObject).to.include({
                            Configuration: null,
                            Content: null,
                            FileName: testDataFileName + '.txt',
                            Hidden: false,
                            IsSync: false,
                            MimeType: 'text/plain',
                            Title: testDataFileName,
                        });
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
                        const allFilesAfter: FileStorage[] = await service.getFilesFromStorage({ page_size: -1 });
                        let deletedFileObject: any;

                        for (let index = 0; index < allFilesAfter.length; index++) {
                            if (allFilesAfter[index].FileName?.toString().startsWith(`${testDataFileName}.txt`)) {
                                deletedFileObject = allFilesAfter[index];
                                break;
                            }
                        }
                        expect(deletedFileObject).to.be.undefined;
                    });
                });
            });

            describe('Negative', () => {
                describe('Mandatory Title test (negative)', () => {
                    let allfilesBefore: FileStorage[];
                    it('Correct exception message for Title', async () => {
                        //Get the current (before) files from the File Storage
                        allfilesBefore = await service.getFilesFromStorage({ page_size: -1 });

                        //Add file to the File Storage without Title
                        const testDataFileName: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        return expect(
                            service.postFileToStorage({
                                FileName: testDataFileName + '.txt',
                                Content: service.createTestDataInBase64Format(),
                            } as any),
                        ).to.be.rejectedWith('The mandatory property \\"Title\\" can\'t be ignore.');
                    });

                    it("Don't Create file in the file storage", async () => {
                        //Get the current (after) files from the File Storage
                        return expect(service.getFilesFromStorage({ page_size: -1 }))
                            .eventually.to.be.an('array')
                            .with.lengthOf(allfilesBefore.length);
                    });
                });

                describe('Mandatory FileName test (negative)', () => {
                    let allfilesBefore: FileStorage[];
                    it('Correct exception message for FileName', async () => {
                        //Get the current (before) files from the File Storage
                        allfilesBefore = await service.getFilesFromStorage({ page_size: -1 });

                        //Add file to the File Storage without FileName
                        const testDataFileName: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        return expect(
                            service.postFileToStorage({
                                Title: testDataFileName + '.txt',
                                Content: service.createTestDataInBase64Format(),
                            } as any),
                        ).to.be.rejectedWith('The mandatory property \\"FileName\\" can\'t be ignore.');
                    });

                    it("Don't Create file in the file storage", async () => {
                        //Get the current (after) files from the File Storage
                        return expect(service.getFilesFromStorage({ page_size: -1 }))
                            .eventually.to.be.an('array')
                            .with.lengthOf(allfilesBefore.length);
                    });
                });

                describe('Mandatory Properties test (negative)', () => {
                    let allfilesBefore: FileStorage[];
                    it('Correct exception message for mandatory properties', async () => {
                        //Get the current (before) files from the File Storage
                        allfilesBefore = await service.getFilesFromStorage({ page_size: -1 });

                        //Add file to the File Storage without any Mandatory
                        return expect(
                            service.postFileToStorage({
                                Content: service.createTestDataInBase64Format(),
                            } as any),
                        ).to.be.rejectedWith('The mandatory properties \\"Title\\", \\"FileName\\" can\'t be ignore.');
                    });

                    it("Don't Create file in the file storage", async () => {
                        //Get the current (after) files from the File Storage
                        return expect(service.getFilesFromStorage({ page_size: -1 }))
                            .eventually.to.be.an('array')
                            .with.lengthOf(allfilesBefore.length);
                    });
                });
            });
        });
    });
    //#endregion Scenarios
    //#endregion Tests
}

//Service Functions
//Remove all test files from Files Storage
async function TestCleanUp(service: FileStorageService) {
    const allfilesObject: FileStorage[] = await service.getFilesFromStorage({ page_size: -1 });
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
