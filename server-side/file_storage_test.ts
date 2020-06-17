import { PapiClient } from '@pepperi-addons/papi-sdk'
import { Client, Request } from '@pepperi-addons/debug-server'
import TestService from './test.service'
import tester from './tester';

// Test Functions /file_storage_test/CRUDOneFileFromFileStorageTest
export async function CRUDOneFileFromFileStorageTest(Client: Client, Request: Request) {
    const { describe, expect, it, run } = tester();

    const fetch = require("node-fetch");

    const service = new TestService(Client);

    //#region Prerequisites
    //#region CRUD One File Using The File Storage in Base64
    //Get the current (before) files from the File Storage
    let allfilesBeforeAddFromBase64 = await service.getFilesFromStorage();

    //Add a file to the File Storage
    let testDataFileNameFromBase64 = "Test " + Math.floor(Math.random() * 1000000).toString();
    await service.postFilesToStorage(service.createNewTextFileFromBase64(testDataFileNameFromBase64, testDataFileNameFromBase64));

    //Get the current (after) files from the File Storage
    let allfilesAfterBase64 = await service.getFilesFromStorage();

    //Save the created file information
    var fileObjectBase64;
    for (let index = 0; index < allfilesAfterBase64.length; index++) {
        if (allfilesAfterBase64[index].FileName?.toString().startsWith(testDataFileNameFromBase64)) {
            fileObjectBase64 = allfilesAfterBase64[index];
            break;
        }
    }

    //Get the created file content
    var uriFromBase64 = fileObjectBase64.URL;
    var fileContentFromBase64 = await fetch(uriFromBase64)
        .then((response) => response.text());

    //Update the new added file
    var updatedFileObjectBase64 = {};
    Object.assign(updatedFileObjectBase64, fileObjectBase64);
    updatedFileObjectBase64["Description"] = "New description";
    updatedFileObjectBase64["Content"] = Buffer.from('EDCBA').toString('base64');
    updatedFileObjectBase64["CreationDate"] = "1999-09-09Z";
    updatedFileObjectBase64["FileName"] = "Test 9999999.txt"; //TODO: Changing the name to a name without ".txt" sufix should be prevented or something
    updatedFileObjectBase64["IsSync"] = true;
    updatedFileObjectBase64["MimeType"] = "text/xml";
    updatedFileObjectBase64["ModificationDate"] = "1999-09-09Z";
    updatedFileObjectBase64["Title"] = "Test 9999999";
    updatedFileObjectBase64["URL"] = "https://cdn.Test";

    await service.postFilesToStorage(updatedFileObjectBase64);

    //Get the current (after the update) files from the File Storage
    let allfilesAfterBase64Update = await service.getFilesFromStorage();

    let updatedFileObjectBase64NewUrl;
    for (let index = 0; index < allfilesAfterBase64Update.length; index++) {
        if (allfilesAfterBase64Update[index].InternalID == fileObjectBase64.InternalID) {
            updatedFileObjectBase64NewUrl = allfilesAfterBase64Update[index];
            break;
        }
    }

    //Get the updated file content
    var updateduriFromBase64 = updatedFileObjectBase64NewUrl.URL;
    var updatedFileContentFromBase64 = await fetch(updateduriFromBase64)
        .then((response) => response.text());

    //#endregion CRUD One File Using The File Storage in Base64

    //#region CRD One File Using The File Storage using URL
    //Get the current (before) files from the File Storage
    let allfilesBeforeAddFromURL = await service.getFilesFromStorage();

    //Add a file to the File Storage with URL
    let testDataFileNameFromURL = "Test " + Math.floor(Math.random() * 1000000).toString();
    let testDataFileURL = "https://cdn.staging.pepperi.com/30013175/CustomizationFile/9e57eea7-0277-441d-beae-0de365cbdd8b/TestData.txt";
    await service.postFilesToStorage(service.createNewTextFileFromUrl(testDataFileNameFromURL, testDataFileNameFromURL, "", testDataFileURL));

    //Get the current (after) files from the File Storage
    let allfilesAfterURL = await service.getFilesFromStorage();

    //Save the created file information
    let fileObjectURL;
    for (let index = 0; index < allfilesAfterURL.length; index++) {
        if (allfilesAfterURL[index].FileName?.toString().startsWith(testDataFileNameFromURL)) {
            fileObjectURL = allfilesAfterURL[index];
            break;
        }
    }

    //Get the created file content
    var uriFromURL = fileObjectURL.URL;
    var fileContentFromURL = await fetch(uriFromURL)
        .then((response) => response.text());

    //#endregion CRD One File Using The File Storage using URL

    //#region CRD One File Using The File Storage With IsSync = true
    //Get the current (before) files from the File Storage
    let allfilesBeforeIsSync = await service.getFilesFromStorage();

    //Add a file to the File Storage with URL
    let testDataFileNameIsSync = "Test " + Math.floor(Math.random() * 1000000).toString();
    let testDataFileIsSync = await service.createNewTextFileFromBase64(testDataFileNameIsSync, testDataFileNameIsSync);
    testDataFileIsSync["IsSync"] = true;
    await service.postFilesToStorage(testDataFileIsSync);

    //Get the current (after) files from the File Storage
    let allfilesAfterIsSync = await service.getFilesFromStorage();

    //Save the created file information
    let fileObjectIsSync;
    for (let index = 0; index < allfilesAfterIsSync.length; index++) {
        if (allfilesAfterIsSync[index].FileName?.toString().startsWith(testDataFileNameIsSync)) {
            fileObjectIsSync = allfilesAfterIsSync[index];
            break;
        }
    }

    //Get the created file content
    var uriFromIsSync = fileObjectIsSync.URL;
    var fileContentFromIsSync = await fetch(uriFromIsSync)
        .then((response) => response.text());

    //#endregion CRD One File Using The File Storage using URL

    //#region Make sure file uploaded via Base64 when using both Base64 and URL
    //Get the current (before) files from the File Storage
    let allfilesBeforeAddFromURLAndBase64 = await service.getFilesFromStorage();

    //Add a file to the File Storage with URL
    let testDataFileNameFromURLAndBase64 = "Test " + Math.floor(Math.random() * 1000000).toString();
    let testDataFileURLAndBase64 = "https://cdn.staging.pepperi.com/30013175/CustomizationFile/9e57eea7-0277-441d-beae-0de365cbdd8b/TestData.txt";
    let testDataFileURLAndBase64Body = await service.createNewTextFileFromBase64(testDataFileNameFromURLAndBase64, testDataFileNameFromURLAndBase64);
    testDataFileURLAndBase64Body["URL"] = testDataFileURLAndBase64;
    await service.postFilesToStorage(testDataFileURLAndBase64Body);

    //Get the current (after) files from the File Storage
    let allfilesAfterURLAndBase64 = await service.getFilesFromStorage();

    //Save the created file information
    let fileObjectURLAndBase64;
    for (let index = 0; index < allfilesAfterURLAndBase64.length; index++) {
        if (allfilesAfterURLAndBase64[index].FileName?.toString().startsWith(testDataFileNameFromURLAndBase64)) {
            fileObjectURLAndBase64 = allfilesAfterURLAndBase64[index];
            break;
        }
    }

    //Get the created file content
    var uriFromURLAndBase64 = fileObjectURLAndBase64.URL;
    var fileContentFromURLAndBase64 = await fetch(uriFromURLAndBase64)
        .then((response) => response.text());

    //#endregion Make sure file uploaded via Base64 when using both Base64 and URL

    //#region Mandatory Title test (negative)
    //Get the current (before) files from the File Storage
    let allfilesBeforeAddNonTitle = await service.getFilesFromStorage();

    //Add a file to the File Storage without Title
    let testDataFileNameNonTitle = "Test " + Math.floor(Math.random() * 1000000).toString();
    let testDataFileNonTitle = await service.createNewTextFileFromBase64(testDataFileNameNonTitle, testDataFileNameNonTitle);
    let tempBodyNonTitle = {};
    tempBodyNonTitle["Content"] = testDataFileNonTitle.Content;
    tempBodyNonTitle["FileName"] = testDataFileNonTitle.FileName;
    let postWithoutTitleResponse = await service.postFilesToStorage(tempBodyNonTitle);

    //Get the current (after) files from the File Storage
    let allfilesAfterNonTitle = await service.getFilesFromStorage();

    //#endregion Mandatory Title test (negative).

    //#region Mandatory FileName test (negative)
    //Get the current (before) files from the File Storage
    let allfilesBeforeAddNonFileName = await service.getFilesFromStorage();

    //Add a file to the File Storage without Title
    let testDataFileNameNonFileName = "Test " + Math.floor(Math.random() * 1000000).toString();
    let testDataFileNonFileName = await service.createNewTextFileFromBase64(testDataFileNameNonFileName, testDataFileNameNonFileName);
    let tempBodyNonFileName = {};
    tempBodyNonFileName["Content"] = testDataFileNonFileName.Content;
    tempBodyNonFileName["Title"] = testDataFileNonFileName.Title;
    let postWithoutFileNameResponse = await service.postFilesToStorage(tempBodyNonFileName);

    //Get the current (after) files from the File Storage
    let allfilesAfterNonFileName = await service.getFilesFromStorage();

    //#endregion Mandatory FileName test (negative).

    //#endregion Prerequisites

    //#region Tests
    describe('CRUD One File Using The File Storage in Base64', () => {

        it('Create a file in the file storage', () => {
            expect(allfilesBeforeAddFromBase64.length).to.be.equal(allfilesAfterBase64.length - 1);
        });

        it('Read the new added file properties', () => {
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

        it('Read the new added file content', () => {
            expect(fileContentFromBase64).to.contain("ABCD");
        });

        let inItUpdatedFileObjectBase64;

        it('Update the new added file', () => {
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
            expect(inItUpdatedFileObjectBase64.Description).to.be.equal(updatedFileObjectBase64["Description"]);
            expect(inItUpdatedFileObjectBase64.FileName).to.be.equal(updatedFileObjectBase64["FileName"]);
            expect(inItUpdatedFileObjectBase64.Hidden).to.be.false;
            expect(inItUpdatedFileObjectBase64.IsSync).to.be.equal(updatedFileObjectBase64["IsSync"]);
            expect(inItUpdatedFileObjectBase64.MimeType).to.be.equal("text/plain");
            expect(inItUpdatedFileObjectBase64.ModificationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(inItUpdatedFileObjectBase64.Title).to.be.equal(updatedFileObjectBase64["Title"]);
            expect(inItUpdatedFileObjectBase64.URL).to.be.contain(updateduriFromBase64);
        });

        it('Read the updated file content', () => {
            expect(updatedFileContentFromBase64).to.contain("EDCBA");
        });

        let allfilesAfterBase64Deleted;

        it('Make sure all clean ups are finished', () => {
            //Make sure all the files are removed in the end of the tests
            TestCleanUp(Client);

            //Get the current (after) files from the File Storage
            allfilesAfterBase64Deleted = service.getFilesFromStorage();
        });

        it('Delete the new file', () => {
            let deletedfileObjectBase64;

            for (let index = 0; index < allfilesAfterBase64Deleted.length; index++) {
                if (allfilesAfterBase64Deleted[index].FileName?.toString().startsWith(testDataFileNameFromURLAndBase64)) {
                    deletedfileObjectBase64 = allfilesAfterBase64Deleted[index];
                    break;
                }
            }
            expect(deletedfileObjectBase64).to.be.undefined
        });
    });

    describe('CRD One File Using The File Storage using URL', () => {

        it('Create a file in the file storage', () => {
            expect(allfilesBeforeAddFromURL.length).to.be.equal(allfilesAfterURL.length - 1);
        });

        it('Read the new added file properties', () => {
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

        it('Read the new added file content', () => {
            expect(fileContentFromURL).to.contain("Test Data for File Storage");
        });

        let allfilesAfterURLDeleted;

        it('Make sure all clean ups are finished', () => {
            //Make sure all the files are removed in the end of the tests
            TestCleanUp(Client);

            //Get the current (after) files from the File Storage
            allfilesAfterURLDeleted = service.getFilesFromStorage();
        });

        it('Delete the new file', () => {
            let deletedfileObjectURL;

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

        it('Create a file in the file storage', () => {
            expect(allfilesBeforeIsSync.length).to.be.equal(allfilesAfterIsSync.length - 1);
        });

        it('Read the new added file properties', () => {
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

        let allfilesAfterIsSyncDeleted;

        it('Make sure all clean ups are finished', () => {
            //Make sure all the files are removed in the end of the tests
            TestCleanUp(Client);

            //Get the current (after) files from the File Storage
            allfilesAfterIsSyncDeleted = service.getFilesFromStorage();
        });

        it('Delete the new file', () => {
            let deletedfileObjectIsSync;

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

        it('Create a file in the file storage', () => {
            expect(allfilesBeforeAddFromURLAndBase64.length).to.be.equal(allfilesAfterURLAndBase64.length - 1);
        });

        it('Read the new added file properties', () => {
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

        it('Read the new added file content', () => {
            expect(fileContentFromURLAndBase64).to.contain("ABCD");
        });

        let allfilesAfterURLAndBase64Deleted;

        it('Make sure all clean ups are finished', () => {
            //Make sure all the files are removed in the end of the tests
            TestCleanUp(Client);

            //Get the current (after) files from the File Storage
            allfilesAfterURLAndBase64Deleted = service.getFilesFromStorage();
        });

        it('Delete the new file', () => {
            let deletedfileObjectURLAndBase64;

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

        it('Don\'t Create a file in the file storage', () => {
            expect(allfilesBeforeAddNonTitle.length).to.be.equal(allfilesAfterNonTitle.length);
        });

        it('Correct exception message for Title', () => {
            expect(postWithoutTitleResponse["fault"]["faultstring"]).to.contain("The mandatory property \"Title\" can't be ignore.");
        });

    });

    describe('Mandatory FileName test (negative)', () => {

        it('Don\'t Create a file in the file storage', () => {
            expect(allfilesBeforeAddNonFileName.length).to.be.equal(allfilesAfterNonFileName.length);
        });

        it('Correct exception message for FileName', () => {
            expect(postWithoutFileNameResponse["fault"]["faultstring"]).to.contain("The mandatory property \"FileName\" can't be ignore.");//FileName
        });

    });

    return run();
    //#endregion Tests
}

//Service Functions
//Remove all test files from Files Storage
async function TestCleanUp(Client: Client) {
    const service = new TestService(Client);
    let allfilesObject = await service.getFilesFromStorage();
    let tempBody = {};
    for (let index = 0; index < allfilesObject.length; index++) {
        if (allfilesObject[index].FileName?.toString().startsWith("Test ") &&
            Number(allfilesObject[index].FileName?.toString().split(' ')[1].split('.')[0]) > 1000) {
            tempBody["InternalID"] = allfilesObject[index].InternalID;
            tempBody["Hidden"] = true;
            await service.postFilesToStorage(tempBody);
        }
    }
}

//TODO: remoave this old functions when they won't be needed
//#region Original experimental function
export async function failTest(Client, Request) {
    var Success = false;
    var Message = "something failed";

    return {
        Success,
        Message
    };
}

export async function passTest(Client, Request) {
    var Success = true;
    var Message = "something successed";

    return {
        Success,
        Message
    };
}

export async function allTests(Client, Request) {
    const results: Object[] = [];
    results.push(await failTest(Client, Request));
    results.push(await passTest(Client, Request));
    return results;
}

export async function getFiles(Client, Request) {
    var Success = true;
    const service = new TestService(Client);
    var Message = await service.getFilesFromStorage();

    return {
        Success,
        Message
    };
}

export async function getFileConfigurationById(Client: Client, Request: Request) {
    var Success = true;
    const service = new TestService(Client);
    var Message = await service.getFileConfigurationByID(286918);

    return {
        Success,
        Message
    };
}

export async function test1(Client: Client, Request: Request) {
    const { describe, expect, it, run } = tester();

    describe('Array', () => {
        describe('#indexOf', () => {
            it('should return -1 when item is not in list', () => {
                expect([1, 2, 3].indexOf(4)).to.be.equal(-1);
            })

            it('should return 1 when item is in list', () => {
                expect([1, 2, 3].indexOf(2)).to.be.equal(1);
            })
        })

        describe('#filter', () => {
            it('should return 2 objects', () => {
                const res = [1, 2, 3].filter(x => x < 3)
                expect(res).to.have.lengthOf(2);
                expect(res[0]).to.be.equal(1);
                expect(res[1]).to.be.equal(2);
            })
        })
    })

    describe('Object', () => {

        const obj = { a: 1, b: '2' };
        describe('#Keys', () => {
            it('should return array of the keys', () => {
                const res = Object.keys(obj);
                expect(res).to.have.lengthOf(2);
            })
        })
    })

    return await run();
}
/*
exports.PassTest = async function (Client, Request) {
    const papiClient = new PapiClient({
        baseURL: Client.BaseURL,
        token: Client.OAuthAccessToken
    });

    const addons = await papiClient.userDefinedTables.find({
       page_size:-1
    });
    console.log(addons);

    const expected = addons.filter(udt => {
        return udt.MapDataExternalID === 'TSAExample'
    }).length;

    const addons2 = await papiClient.userDefinedTables.find({
        where: `MapDataExternalID='TSAExample'`,
        page_size:-1
    });
    console.log(addons2);
    const actual = addons2.length;

    var Success = expected == actual;
    var Message = `${expected} - ${actual}`;

    return {
        Success,
        Message
    };
};
*/

//#endregion Original experimental function
