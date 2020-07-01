import GeneralService from '../services/general.service'
import tester from '../tester';
import { FileStorageService } from '../services/file-storage.service';
import { FileStorage } from '@pepperi-addons/papi-sdk';
import { Url } from 'url';
import { StreamPriorityOptions } from 'http2';

// Test Functions /file_storage_test/CRUDOneFileFromFileStorageTest
export async function CRUDOneFileFromFileStorageTest(generalService: GeneralService) {
    const service = new FileStorageService(generalService.papiClient);
    const { describe, expect, it, run } = tester();
    const fetch = require("node-fetch");

    //#region Tests
    describe('CRUD One File Using The File Storage in Base64', () => {

        let allfilesAfterBase64: FileStorage[];
        let testDataFileNameFromBase64: string;
        it('Create a file in the file storage', async () => {

            //Get the current (before) files from the File Storage
            let allfilesBeforeAddFromBase64: FileStorage[] = await service.getFilesFromStorage();

            //Add a file to the File Storage
            testDataFileNameFromBase64 = "Test " + Math.floor(Math.random() * 1000000).toString();
            await service.postFilesToStorage(service.createNewTextFileFromBase64(testDataFileNameFromBase64, testDataFileNameFromBase64));

            //Get the current (after) files from the File Storage
            await expect(allfilesAfterBase64 = await service.getFilesFromStorage()).to.be.an('array').with.lengthOf(allfilesBeforeAddFromBase64.length + 1);
        });

        let fileObjectBase64: FileStorage;
        it('Read the new added file properties', async () => {

            //Save the created file information
            for (let index = 0; index < allfilesAfterBase64.length; index++) {
                if (allfilesAfterBase64[index].FileName?.toString().startsWith(testDataFileNameFromBase64)) {
                    fileObjectBase64 = allfilesAfterBase64[index];
                    break;
                }
            }

            expect(Number(fileObjectBase64.InternalID) > 200000);
            expect(fileObjectBase64.Configuration).to.be.null;
            expect(fileObjectBase64.Content).to.be.null;
            expect(fileObjectBase64.CreationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectBase64.Description).to.be.equal("");//undefined //TODO: Wait for ido to decide - DB cant contian undefined
            expect(fileObjectBase64.FileName).to.be.equal(testDataFileNameFromBase64 + ".txt");
            expect(fileObjectBase64.Hidden).to.be.false;
            expect(fileObjectBase64.IsSync).to.be.false;
            expect(fileObjectBase64.MimeType).to.be.equal("text/plain");
            expect(fileObjectBase64.ModificationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectBase64.Title).to.be.equal(testDataFileNameFromBase64);
            expect(fileObjectBase64.URL).to.be.contain(testDataFileNameFromBase64 + ".txt");
        });

        let uriFromBase64: string;
        it('Read the new added file content', async () => {

            //Get the created file content
            uriFromBase64 = fileObjectBase64.URL as any;
            let fileContentFromBase64: string = await fetch(uriFromBase64)
                .then((response) => response.text());

            expect(fileContentFromBase64).to.contain("ABCD");
        });

        let inItUpdatedFileObjectBase64: FileStorage;
        let updatedFileContentFromBase64: string;
        it('Update the new added file', async () => {

            //Update the new added file
            const updatedFileObjectBase64: FileStorage = {
                Configuration: fileObjectBase64.Configuration,
                Hidden: fileObjectBase64.Hidden,
                InternalID: fileObjectBase64.InternalID,
                Description: "New description",
                Content: Buffer.from('EDCBA').toString('base64'),
                CreationDate: "1999-09-09Z",
                FileName: "Test 9999999.txt", //TODO: Changing the name to a name without ".txt" sufix should be prevented or something
                IsSync: true,
                MimeType: "text/xml",
                ModificationDate: "1999-09-09Z",
                Title: "Test 9999999",
                URL: "https://cdn.Test"
            }

            await service.postFilesToStorage(updatedFileObjectBase64);

            //Get the current (after the update) files from the File Storage
            let allfilesAfterBase64Update: FileStorage[] = await service.getFilesFromStorage();

            let updatedFileObjectBase64NewUrl;
            for (let index = 0; index < allfilesAfterBase64Update.length; index++) {
                if (allfilesAfterBase64Update[index].InternalID == fileObjectBase64.InternalID) {
                    updatedFileObjectBase64NewUrl = allfilesAfterBase64Update[index];
                    break;
                }
            }

            //Get the updated file content
            let updateduriFromBase64 = updatedFileObjectBase64NewUrl.URL;
            updatedFileContentFromBase64 = await fetch(updateduriFromBase64)
                .then((response) => response.text());

            for (let index = 0; index < allfilesAfterBase64Update.length; index++) {
                if (allfilesAfterBase64Update[index].InternalID == fileObjectBase64.InternalID) {
                    inItUpdatedFileObjectBase64 = allfilesAfterBase64Update[index];
                    break;
                }
            }
            expect(Number(inItUpdatedFileObjectBase64.InternalID) == fileObjectBase64.InternalID);
            expect(inItUpdatedFileObjectBase64.Configuration).to.be.null;
            expect(inItUpdatedFileObjectBase64.Content).to.be.null;
            expect(inItUpdatedFileObjectBase64.CreationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(inItUpdatedFileObjectBase64.Description).to.be.equal(updatedFileObjectBase64.Description);
            expect(inItUpdatedFileObjectBase64.FileName).to.be.equal(updatedFileObjectBase64.FileName);
            expect(inItUpdatedFileObjectBase64.Hidden).to.be.false;
            expect(inItUpdatedFileObjectBase64.IsSync).to.be.equal(updatedFileObjectBase64.IsSync);
            expect(inItUpdatedFileObjectBase64.MimeType).to.be.equal("text/plain");
            expect(inItUpdatedFileObjectBase64.ModificationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(inItUpdatedFileObjectBase64.Title).to.be.equal(updatedFileObjectBase64.Title);
            expect(inItUpdatedFileObjectBase64.URL).to.be.contain(updatedFileObjectBase64NewUrl.URL);
        });

        it('Read the updated file content', () => {
            expect(updatedFileContentFromBase64).to.contain("EDCBA");
        });

        it('Read the first added file content again after updated the new file', async () => {

            //Get the created file content
            let fileContentFromBase64AfterUpdate: string = await fetch(uriFromBase64)
                .then((response) => response.text());

            expect(fileContentFromBase64AfterUpdate).to.contain("ABCD");
        });

        it('Make sure files removed in the end of the tests', async () => {

            //Make sure files removed in the end of the tests
            await expect(TestCleanUp(service)).eventually.to.be.above(0)
        });

        it('Delete the new file', async () => {

            //Get the current (after) files from the File Storage
            let allfilesAfterBase64Deleted: FileStorage[] = await service.getFilesFromStorage();
            let deletedfileObjectBase64: any;

            for (let index = 0; index < allfilesAfterBase64Deleted.length; index++) {
                if (allfilesAfterBase64Deleted[index].FileName?.toString().startsWith(testDataFileNameFromBase64)) {
                    deletedfileObjectBase64 = allfilesAfterBase64Deleted[index];
                    break;
                }
            }
            expect(deletedfileObjectBase64).to.be.undefined
        });

    });

    describe('CRD One File Using The File Storage using URL', () => {

        let fileObjectURL: FileStorage;
        let testDataFileNameFromURL: string;
        it('Create a file in the file storage', async () => {

            //Get the current (before) files from the File Storage
            let allfilesBeforeAddFromURL: FileStorage[] = await service.getFilesFromStorage();

            //Add a file to the File Storage with URL
            testDataFileNameFromURL = "Test " + Math.floor(Math.random() * 1000000).toString();
            let testDataFileURL: string = "https://cdn.staging.pepperi.com/30013175/CustomizationFile/9e57eea7-0277-441d-beae-0de365cbdd8b/TestData.txt";
            await service.postFilesToStorage(service.createNewTextFileFromUrl(testDataFileNameFromURL, testDataFileNameFromURL, "", testDataFileURL));

            let allfilesAfterURL: FileStorage[];

            //Get the current (after) files from the File Storage
            await expect(allfilesAfterURL = await service.getFilesFromStorage()).to.be.an('array').with.lengthOf(allfilesBeforeAddFromURL.length + 1);

            //Save the created file information
            for (let index = 0; index < allfilesAfterURL.length; index++) {
                if (allfilesAfterURL[index].FileName?.toString().startsWith(testDataFileNameFromURL)) {
                    fileObjectURL = allfilesAfterURL[index];
                    break;
                }
            }
        });

        it('Read the new added file properties', async () => {

            expect(Number(fileObjectURL.InternalID) > 200000);
            expect(fileObjectURL.Configuration).to.be.null;
            expect(fileObjectURL.Content).to.be.null;
            expect(fileObjectURL.CreationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectURL.Description).to.be.equal("");//undefined //TODO: Wait for ido to decide - DB cant contian undefined
            expect(fileObjectURL.FileName).to.be.equal(testDataFileNameFromURL + ".txt");
            expect(fileObjectURL.Hidden).to.be.false;
            expect(fileObjectURL.IsSync).to.be.false;
            expect(fileObjectURL.MimeType).to.be.equal("text/plain");
            expect(fileObjectURL.ModificationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectURL.Title).to.be.equal(testDataFileNameFromURL);
            expect(fileObjectURL.URL).to.be.contain(testDataFileNameFromURL + ".txt");
        });

        it('Read the new added file content', async () => {

            //Get the created file content
            let uriFromURL: string = fileObjectURL.URL as any;
            let fileContentFromURL: string = await fetch(uriFromURL)
                .then((response) => response.text());

            expect(fileContentFromURL).to.contain("Test Data for File Storage");
        });

        it('Make sure files removed in the end of the tests', async () => {

            //Make sure files removed in the end of the tests
            await expect(TestCleanUp(service)).eventually.to.be.above(0)
        });

        it('Delete the new file', async () => {

            //Get the current (after) files from the File Storage
            let allfilesAfterURLDeleted: FileStorage[] = await service.getFilesFromStorage();
            let deletedfileObjectURL: any;

            for (let index = 0; index < allfilesAfterURLDeleted.length; index++) {
                if (allfilesAfterURLDeleted[index].FileName?.toString().startsWith(testDataFileNameFromURL)) {
                    deletedfileObjectURL = allfilesAfterURLDeleted[index];
                    break;
                }
            }
            expect(deletedfileObjectURL).to.be.undefined
        });

    });

    describe('CRD One File Using The File Storage With IsSync = true', () => {

        let testDataFileNameIsSync: string;
        let allfilesAfterIsSync: FileStorage[];
        let fileObjectIsSync: FileStorage;
        it('Create a file in the file storage', async () => {

            //Get the current (before) files from the File Storage
            let allfilesBeforeIsSync: FileStorage[] = await service.getFilesFromStorage();

            //Add a file to the File Storage with URL
            testDataFileNameIsSync = "Test " + Math.floor(Math.random() * 1000000).toString();
            let testDataFileIsSync: FileStorage = await service.createNewTextFileFromBase64(testDataFileNameIsSync, testDataFileNameIsSync);
            testDataFileIsSync.IsSync = true;
            await service.postFilesToStorage(testDataFileIsSync);

            //Get the current (after) files from the File Storage
            await expect(allfilesAfterIsSync = await service.getFilesFromStorage()).to.be.an('array').with.lengthOf(allfilesBeforeIsSync.length + 1);
        });

        //I STOPED HERE 30/06/2020

        let fileContentFromIsSync: string;
        it('Read the new added file properties', async () => {

            //Save the created file information
            for (let index = 0; index < allfilesAfterIsSync.length; index++) {
                if (allfilesAfterIsSync[index].FileName?.toString().startsWith(testDataFileNameIsSync)) {
                    fileObjectIsSync = allfilesAfterIsSync[index];
                    break;
                }
            }

            //Get the created file content
            let uriFromIsSync: string = fileObjectIsSync.URL as any;
            fileContentFromIsSync = await fetch(uriFromIsSync)
                .then((response) => response.text());

            expect(Number(fileObjectIsSync.InternalID) > 200000);
            expect(fileObjectIsSync.Configuration).to.be.null;
            expect(fileObjectIsSync.Content).to.be.null;
            expect(fileObjectIsSync.CreationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectIsSync.Description).to.be.equal("");//undefined //TODO: Wait for ido to decide - DB cant contian undefined
            expect(fileObjectIsSync.FileName).to.be.equal(testDataFileNameIsSync + ".txt");
            expect(fileObjectIsSync.Hidden).to.be.false;
            expect(fileObjectIsSync.IsSync).to.be.true;
            expect(fileObjectIsSync.MimeType).to.be.equal("text/plain");
            expect(fileObjectIsSync.ModificationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectIsSync.Title).to.be.equal(testDataFileNameIsSync);
            expect(fileObjectIsSync.URL).to.be.contain(testDataFileNameIsSync + ".txt");
        });

        it('Read the new added file content', () => {
            expect(fileContentFromIsSync).to.contain("ABCD");
        });

        it('Make sure files removed in the end of the tests', async () => {

            //Make sure files removed in the end of the tests
            await expect(TestCleanUp(service)).eventually.to.be.above(0)
        });

        it('Delete the new file', async () => {

            //Get the current (after) files from the File Storage
            let allfilesAfterIsSyncDeleted: FileStorage[] = await service.getFilesFromStorage();
            let deletedfileObjectIsSync: any;

            for (let index = 0; index < allfilesAfterIsSyncDeleted.length; index++) {
                if (allfilesAfterIsSyncDeleted[index].FileName?.toString().startsWith(testDataFileNameIsSync)) {
                    deletedfileObjectIsSync = allfilesAfterIsSyncDeleted[index];
                    break;
                }
            }
            expect(deletedfileObjectIsSync).to.be.undefined
        });

    });

    describe('Make sure file uploaded via Base64 when using both Base64 and URL', () => {

        let testDataFileNameFromURLAndBase64: string;
        let allfilesAfterURLAndBase64: FileStorage[];
        it('Create a file in the file storage', async () => {

            //Get the current (before) files from the File Storage
            let allfilesBeforeAddFromURLAndBase64: FileStorage[] = await service.getFilesFromStorage();

            //Add a file to the File Storage with URL
            testDataFileNameFromURLAndBase64 = "Test " + Math.floor(Math.random() * 1000000).toString();
            let testDataFileURLAndBase64: string = "https://cdn.staging.pepperi.com/30013175/CustomizationFile/9e57eea7-0277-441d-beae-0de365cbdd8b/TestData.txt";
            let testDataFileURLAndBase64Body: FileStorage = await service.createNewTextFileFromBase64(testDataFileNameFromURLAndBase64, testDataFileNameFromURLAndBase64);
            testDataFileURLAndBase64Body.URL = testDataFileURLAndBase64;
            await service.postFilesToStorage(testDataFileURLAndBase64Body);

            //Get the current (after) files from the File Storage
            await expect(allfilesAfterURLAndBase64 = await service.getFilesFromStorage()).to.be.an('array').with.lengthOf(allfilesBeforeAddFromURLAndBase64.length + 1);
        });

        let fileObjectURLAndBase64: FileStorage;
        it('Read the new added file properties', async () => {

            //Save the created file information
            for (let index = 0; index < allfilesAfterURLAndBase64.length; index++) {
                if (allfilesAfterURLAndBase64[index].FileName?.toString().startsWith(testDataFileNameFromURLAndBase64)) {
                    fileObjectURLAndBase64 = allfilesAfterURLAndBase64[index];
                    break;
                }
            }

            expect(Number(fileObjectURLAndBase64.InternalID) > 200000);
            expect(fileObjectURLAndBase64.Configuration).to.be.null;
            expect(fileObjectURLAndBase64.Content).to.be.null;
            expect(fileObjectURLAndBase64.CreationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectURLAndBase64.Description).to.be.equal("");//undefined //TODO: Wait for ido to decide - DB cant contian undefined
            expect(fileObjectURLAndBase64.FileName).to.be.equal(testDataFileNameFromURLAndBase64 + ".txt");
            expect(fileObjectURLAndBase64.Hidden).to.be.false;
            expect(fileObjectURLAndBase64.IsSync).to.be.false;
            expect(fileObjectURLAndBase64.MimeType).to.be.equal("text/plain");
            expect(fileObjectURLAndBase64.ModificationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectURLAndBase64.Title).to.be.equal(testDataFileNameFromURLAndBase64);
            expect(fileObjectURLAndBase64.URL).to.be.contain(testDataFileNameFromURLAndBase64 + ".txt");
        });

        it('Read the new added file content', async () => {

            //Get the created file content
            let uriFromURLAndBase64: string = fileObjectURLAndBase64.URL as any;
            let fileContentFromURLAndBase64: String = await fetch(uriFromURLAndBase64)
                .then((response) => response.text());

            expect(fileContentFromURLAndBase64).to.contain("ABCD");
        });

        it('Make sure files removed in the end of the tests', async () => {

            //Make sure files removed in the end of the tests
            await expect(TestCleanUp(service)).eventually.to.be.above(0);
        });

        it('Delete the new file', async () => {

            //Get the current (after) files from the File Storage
            let allfilesAfterURLAndBase64Deleted: FileStorage[] = await service.getFilesFromStorage();
            let deletedfileObjectURLAndBase64: any;

            for (let index = 0; index < allfilesAfterURLAndBase64Deleted.length; index++) {
                if (allfilesAfterURLAndBase64Deleted[index].FileName?.toString().startsWith(testDataFileNameFromURLAndBase64)) {
                    deletedfileObjectURLAndBase64 = allfilesAfterURLAndBase64Deleted[index];
                    break;
                }
            }
            expect(deletedfileObjectURLAndBase64).to.be.undefined
        });

    });

    describe('Mandatory Title test (negative)', () => {

        let letallfilesBeforeAddNonTitle: FileStorage[];
        it('Correct exception message for Title', async () => {

            //Get the current (before) files from the File Storage
            letallfilesBeforeAddNonTitle = await service.getFilesFromStorage();

            //Add a file to the File Storage without Title
            let testDataFileNameNonTitle: string = "Test " + Math.floor(Math.random() * 1000000).toString();
            let testDataFileNonTitle: FileStorage = await service.createNewTextFileFromBase64(testDataFileNameNonTitle, testDataFileNameNonTitle);
            let tempBodyNonTitle = {};
            tempBodyNonTitle['Content'] = testDataFileNonTitle.Content;
            tempBodyNonTitle['FileName'] = testDataFileNonTitle.FileName;

            await expect(service.postFilesToStorage(tempBodyNonTitle as any)).to.be.rejectedWith('The mandatory property \\\"Title\\\" can\'t be ignore.');
        });

        it('Don\'t Create a file in the file storage', async () => {

            //Get the current (after) files from the File Storage
            await expect(service.getFilesFromStorage()).eventually.to.be.an('array').with.lengthOf(letallfilesBeforeAddNonTitle.length);
        });

    });

    describe('Mandatory FileName test (negative)', () => {

        let allfilesBeforeAddNonFileName: FileStorage[];
        it('Correct exception message for FileName', async () => {

            //Get the current (before) files from the File Storage
            allfilesBeforeAddNonFileName = await service.getFilesFromStorage();

            //Add a file to the File Storage without FileName
            let testDataFileNameNonFileName = "Test " + Math.floor(Math.random() * 1000000).toString();
            let testDataFileNonFileName: FileStorage = await service.createNewTextFileFromBase64(testDataFileNameNonFileName, testDataFileNameNonFileName);
            let tempBodyNonFileName = {};
            tempBodyNonFileName['Content'] = testDataFileNonFileName.Content;
            tempBodyNonFileName['Title'] = testDataFileNonFileName.Title;

            await expect(service.postFilesToStorage(tempBodyNonFileName as any)).to.be.rejectedWith('The mandatory property \\\"FileName\\\" can\'t be ignore.');
        });

        it('Don\'t Create a file in the file storage', async () => {

            //Get the current (after) files from the File Storage
            await expect(service.getFilesFromStorage()).eventually.to.be.an('array').with.lengthOf(allfilesBeforeAddNonFileName.length);
        });

    });

    describe('Mandatory fields test (negative)', () => {

        let allfilesBeforeAddNonMandatory: FileStorage[];
        it('Correct exception message for FileName', async () => {

            //Get the current (before) files from the File Storage
            allfilesBeforeAddNonMandatory = await service.getFilesFromStorage();

            //Add a file to the File Storage without Mandatory
            let testDataFileNameNonMandatory = "Test " + Math.floor(Math.random() * 1000000).toString();
            let testDataFileNonMandatory: FileStorage = await service.createNewTextFileFromBase64(testDataFileNameNonMandatory, testDataFileNameNonMandatory);
            let tempBodyNonMandatory = {};
            tempBodyNonMandatory['Content'] = testDataFileNonMandatory.Content;

            await expect(service.postFilesToStorage(tempBodyNonMandatory as any)).to.be.rejectedWith('The mandatory properties \\\"Title\\\", \\\"FileName\\\" can\'t be ignore.');
        });

        it('Don\'t Create a file in the file storage', async () => {

            //Get the current (after) files from the File Storage
            await expect(service.getFilesFromStorage()).eventually.to.be.an('array').with.lengthOf(allfilesBeforeAddNonMandatory.length);
        });

    });

    return run();
    //#endregion Tests
}

//Service Functionss
//Remove all test files from Files Storage
async function TestCleanUp(service: FileStorageService) {
    let allfilesObject: FileStorage[] = await service.getFilesFromStorage();
    let deletedCounter: number = 0;
    for (let index = 0; index < allfilesObject.length; index++) {
        if (allfilesObject[index].FileName?.toString().startsWith("Test ") &&
            Number(allfilesObject[index].FileName?.toString().split(' ')[1].split('.')[0]) > 100) {
            const tempBody: FileStorage = {
                FileName: allfilesObject[index].FileName,
                Title: allfilesObject[index].Title,
                InternalID: allfilesObject[index].InternalID,
                Hidden: true
            }
            await service.postFilesToStorage(tempBody);
            deletedCounter++;
        }
    }
    return deletedCounter;
}
