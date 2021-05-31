import GeneralService, { TesterFunctions } from '../services/general.service';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

//#region Prerequisites for Var API Tests
let isTestData = false;
//TestData
function testDataNewAddon(testNumber) {
    return { Name: 'Pepperitest Test ' + testNumber }; //Name here can't be changed or it will send messages VIA teams
}

function testDataNewAddonVersion(addonUUID, testNumber) {
    return {
        AddonUUID: addonUUID,
        Version: 'Pepperitest Test Version ' + testNumber, //Name here can't be changed or it will send messages VIA teams
    };
}

//This was never used
// function testDataNewAddonVersionBulk(addonUUID, testNumberArr) {
//     for (let index = 0; index < testNumberArr.length; index++) {
//         return [
//             {
//                 AddonUUID: addonUUID,
//                 Version: 'Pepperitest Test Version ' + testNumberArr[index],
//             },
//         ];
//     }
// }

//This was replaces to prevent file reading from the server (it might cause crashes of node.js)
// function testDatagetBase64FileFromFileAtPath(pathOfFileToReadFrom) {
//     const request = new XMLHttpRequest();
//     request.open('GET', pathOfFileToReadFrom, false);
//     try {
//         request.send();
//     } catch (error) {
//         return error;
//     }
//     return btoa(unescape(encodeURIComponent(request.response)));
// }

function testDatagetBase64FileFromFileAtPath(pathOfFileToReadFrom): string {
    const file = fs.readFileSync(path.resolve(__dirname, pathOfFileToReadFrom));
    return file.toString('base64');
}

//Changed to not use local files, but always the same file
function testDatagetBase64FileFromText() {
    return Buffer.from(
        'exports.install = async (Client, Request) => {\n' +
            'return {success:true, resultObject:{}}\n};' +
            '\n\nexports.uninstall = async (Client, Request) => {\n' +
            'return {success:true, resultObject:{}}\n};' +
            '\n\nexports.upgrade = async (Client, Request) => {\n' +
            'return {success:true, resultObject:{}}\n};' +
            '\n\nexports.downgrade = async (Client, Request) => {\n' +
            'return {success:true, resultObject:{}}\n};' +
            '\n\nexports.ThisIsJustTestFileWithTestFunctions = async (Client, Request) => {\n' +
            'return {success:true, resultObject:{}}\n}',
    ).toString('base64');
}
//#endregion Prerequisites for Var API Tests

export async function CreateTestDataAddon(generalService: GeneralService, request, tester: TesterFunctions) {
    isTestData = true;
    await VarTests(generalService, request, tester);
}

// All Var API Tests
export async function VarTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const setNewTestHeadline = tester.setNewTestHeadline;
    const addTestResultUnderHeadline = tester.addTestResultUnderHeadline;
    const printTestResults = tester.printTestResults;

    console.log('Initiate Var API Tests | ' + generalService.getTime());

    //Fixed by Shir in 25/11/2020 - now this test can run on all servers - if the version name start with Pepperitest Test
    // if (!generalService.getClientData('Server').includes('sandbox')) {
    //     throw new Error(`Test can't run on: ${generalService.getClientData('Server')}`);
    // }

    //Prerequisites per test
    const crudAddonTest = 'CRUD Addon Test';
    setNewTestHeadline(crudAddonTest);

    const crudAddonWithUUIDTest = 'CRUD Addon With UUID Test';
    setNewTestHeadline(crudAddonWithUUIDTest);

    const crudAddonWithNonValidUUIDTest = 'CRUD Addon With Non Valid UUID Test (Negative)';
    setNewTestHeadline(crudAddonWithNonValidUUIDTest);

    const crudAddonVersionTest = 'CRUD Addon version Test';
    setNewTestHeadline(crudAddonVersionTest);

    const getDeletedAddonTest = 'Get Deleted Addon Test';
    setNewTestHeadline(getDeletedAddonTest);

    const dontGetDeletedAddonInListTest = 'Don’t Get Deleted Addon In List Test';
    setNewTestHeadline(dontGetDeletedAddonInListTest);

    const getSpecificDeletedAddonVersionTest = 'Get Specific Deleted Addon Version Test';
    setNewTestHeadline(getSpecificDeletedAddonVersionTest);

    const dontGetDeletedAddonVersionInListTest = 'Don’t Get Deleted Addon Version In List Test';
    setNewTestHeadline(dontGetDeletedAddonVersionInListTest);

    const postEmptyVersionObjectTest = 'Post Empty Version Object Test (Negative)';
    setNewTestHeadline(postEmptyVersionObjectTest);

    const postEmptyVersionsInBulkEndPointTest = 'Post Empty Versions Array In Bulk End Point Test (Negative)';
    setNewTestHeadline(postEmptyVersionsInBulkEndPointTest);

    const postVersionsInBulkEndPointTest = 'Post Versions Array In Bulk End Point Test';
    setNewTestHeadline(postVersionsInBulkEndPointTest);

    const postSingleVersionInBulkEndPointTest = 'Post Single Version In Bulk End Point Test (Negative)';
    setNewTestHeadline(postSingleVersionInBulkEndPointTest);

    const postVersionsWithoutBulkEndPointTest = 'Post Versions Array Without Bulk Test (Negative)';
    setNewTestHeadline(postVersionsWithoutBulkEndPointTest);

    const postVersionWithSameNameTest = 'Post Version With Same Name Test (Negative)';
    setNewTestHeadline(postVersionWithSameNameTest);

    const postAddonWithoutNameTest = 'Post Addon Without Name Test (Negative)';
    setNewTestHeadline(postAddonWithoutNameTest);

    const postAddonVersionWithoutVersionTest = 'Post Addon Version Without Version ID Test (Negative)';
    setNewTestHeadline(postAddonVersionWithoutVersionTest);

    const postAddonVersionWithoutAddonUUIDTest = 'Post Addon Version Without Addon UUID Test (Negative)';
    setNewTestHeadline(postAddonVersionWithoutAddonUUIDTest);

    const postAddonVersionWithWrongVersionTest =
        'Post Addon Version With Wrong Version ID And AddonUUID Test (Negative)';
    setNewTestHeadline(postAddonVersionWithWrongVersionTest);

    const postAddonVersionWithShorterUUIDTest = 'Post Addon Version With Wrong Addon UUID (shorter) Test (Negative)';
    setNewTestHeadline(postAddonVersionWithShorterUUIDTest);

    const postAddonVersionWithWrongUUIDTest = 'Post Addon Version With Wrong Addon UUID (Wrong Digit) Test (Negative)';
    setNewTestHeadline(postAddonVersionWithWrongUUIDTest);

    const validateInstallationFileCreatedTest = 'Validate Installation File Created Test';
    setNewTestHeadline(validateInstallationFileCreatedTest);

    const validateInstallationFileSentTest = 'Validate Installation File Sent Test';
    setNewTestHeadline(validateInstallationFileSentTest);

    const validateOtherFileSentTest = 'Validate Other File Sent Test';
    setNewTestHeadline(validateOtherFileSentTest);

    const validateOtherFilesSentInFolderTest = 'Validate Other Files Sent In Folder Test';
    setNewTestHeadline(validateOtherFilesSentInFolderTest);

    const validateOtherFilesSentInFolderNegativeTest = 'Validate Other Files Sent In Folder Test (Negative)';
    setNewTestHeadline(validateOtherFilesSentInFolderNegativeTest);

    const updateAllAddonDataMembersTest = 'Update All Addon Data Members';
    setNewTestHeadline(updateAllAddonDataMembersTest);

    const updateAllVersionDataMembersTest = 'Update All Version Data Members';
    setNewTestHeadline(updateAllVersionDataMembersTest);

    const updatePhasedWithoutMandatoryFieldTest =
        "Update Phased Without 'StartPhasedDateTime' Mandatory Field (Negative)";
    setNewTestHeadline(updatePhasedWithoutMandatoryFieldTest);

    const creataTestDataAddon = 'Create Test Data Addon';
    setNewTestHeadline(creataTestDataAddon);

    //#region Test Config area
    if (!isTestData) {
        await executeCrudAddonTest(crudAddonTest, testDataNewAddon(Math.floor(Math.random() * 1000000).toString()));

        await executeCrudAddonWithUUIDTestTest(
            crudAddonWithUUIDTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeCrudAddonWithNonValidUUIDTestTest(
            crudAddonWithNonValidUUIDTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeCrudAddonVersionTest(
            crudAddonVersionTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeGetDeletedAddonTest(
            getDeletedAddonTest,
            true,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeGetDeletedAddonTest(
            dontGetDeletedAddonInListTest,
            false,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeGetDeletedAddonVersionTest(
            getSpecificDeletedAddonVersionTest,
            true,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeGetDeletedAddonVersionTest(
            dontGetDeletedAddonVersionInListTest,
            false,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executePostEmptyVersionObjectTest(
            postEmptyVersionObjectTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executePostEmptyVersionsInBulkEndPointTest(
            postEmptyVersionsInBulkEndPointTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executePostVersionsInBulkEndPointTest(
            postVersionsInBulkEndPointTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        //Test was removed in 21/12/2020 since all the responses of 500 will return in HTML and are not formattable
        // await executePostSingleVersionInBulkEndPointTest(
        //     postSingleVersionInBulkEndPointTest,
        //     testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        // );

        await executePostVersionsWithoutBulkEndPointTest(
            postVersionsWithoutBulkEndPointTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executePostSameVersionNameTest(
            postVersionWithSameNameTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executePostAddonWithoutNameTest(postAddonWithoutNameTest, {});

        await executePostAddonVersionWithoutVersionTest(
            postAddonVersionWithoutVersionTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executePostAddonVersionWithoutAddonUUIDTest(
            postAddonVersionWithoutAddonUUIDTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executePostAddonVersionWithWrongVersionTest(
            postAddonVersionWithWrongVersionTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executePostAddonVersionWithShorterUUIDTest(
            postAddonVersionWithShorterUUIDTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executePostAddonVersionWithWrongUUIDTest(
            postAddonVersionWithWrongUUIDTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeValidateInstallationFileCreatedTest(
            validateInstallationFileCreatedTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeValidateInstallationFileSentTest(
            validateInstallationFileSentTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeValidateOtherFileSentTest(
            validateOtherFileSentTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeValidateOtherFilesSentInFolderTest(
            validateOtherFilesSentInFolderTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeValidateOtherFilesSentInFolderTest(
            validateOtherFilesSentInFolderNegativeTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUpdateAllAddonDataMembersTest(
            updateAllAddonDataMembersTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUpdateAllVersionDataMembersTest(
            updateAllVersionDataMembersTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUpdatePhasedWithoutMandatoryFieldTest(
            updatePhasedWithoutMandatoryFieldTest,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );
    } else {
        await executecreataTestDataAddonTest(creataTestDataAddon);
    }
    //#endregion Test Config area
    //Careful - This method can delete all the Addons!!!
    //Never change this, you can comment this out, but don't play with it.
    await executeRemoveAllWrongAddonsAndVersions();

    //Print Report
    printTestResults(describe, expect, it, 'Var API Tests Suites');

    //#region Tests
    //Test CRUD var addon
    async function executeCrudAddonTest(testName, testDataBody) {
        const mandatoryStepsCRUDAddon = {
            createTestResult: false,
            readTestResult: false,
            updateTestResult: false,
            deleteTestResult: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        //console.log({ Get_Var_Addons_CRUD_Create: createApiResponse });
        mandatoryStepsCRUDAddon.createTestResult = testDataBody.Name == createApiResponse.Body.Name;
        addTestResultUnderHeadline(
            testName,
            'Create New Addon Test',
            mandatoryStepsCRUDAddon.createTestResult
                ? true
                : 'The response is: ' + createApiResponse.Body.Name + ' Expected response is: ' + testDataBody.Name,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Creation Date Create Test',
            createApiResponse.Body.CreationDate.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The creation date response is: ' + createApiResponse.Body.CreationDate,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Modification Date Create Test',
            createApiResponse.Body.ModificationDate.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The modification date response is: ' + createApiResponse.Body.ModificationDate,
        );

        //Read
        let getAddonsApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Read: getAddonsApiResponse });

        mandatoryStepsCRUDAddon.readTestResult = testDataBody.Name == getAddonsApiResponse.Body.Name;
        //mandatoryStepsCRUDAddon.readTestResult = testDataBody.Name == getAddonsApiResponse.Body.Name;
        addTestResultUnderHeadline(
            testName,
            'Read Addon Test',
            mandatoryStepsCRUDAddon.readTestResult
                ? true
                : 'The response is: ' + getAddonsApiResponse.Body.Name + ' Expected response is: ' + testDataBody.Name,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Creation Date Read Test',
            getAddonsApiResponse.Body.CreationDate.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The creation date response is: ' + getAddonsApiResponse.Body.CreationDate,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Modification Date Read Test',
            getAddonsApiResponse.Body.ModificationDate.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The modification date response is: ' + getAddonsApiResponse.Body.ModificationDate,
        );

        //Update
        const tempNewAddonBody = createApiResponse.Body;
        tempNewAddonBody.Description = 'Update Test';
        getAddonsApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(tempNewAddonBody),
            },
        );

        //console.log({ Post_Var_Addons_Update: getAddonsApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Read Addon Creation Date Update Test',
            getAddonsApiResponse.Body.CreationDate.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The creation date response is: ' + getAddonsApiResponse.Body.CreationDate,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Modification Date Update Test',
            getAddonsApiResponse.Body.ModificationDate.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The modification date response is: ' + getAddonsApiResponse.Body.ModificationDate,
        );
        getAddonsApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Update_Read: getAddonsApiResponse });
        mandatoryStepsCRUDAddon.updateTestResult = tempNewAddonBody.Description == createApiResponse.Body.Description;
        addTestResultUnderHeadline(
            testName,
            'Update Addon Test',
            mandatoryStepsCRUDAddon.updateTestResult
                ? true
                : 'The response is: ' +
                      createApiResponse.Body.Description +
                      ' Expected response is: ' +
                      tempNewAddonBody.Description,
        );

        //Delete
        const countAllAddonsBeforeDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Before_Delete: countAllAddonsBeforeDelete });
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        console.log({ Post_Var_Addons_Delete: deleteApiResponse.Body });
        const countAllAddonsAfterDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_After_Delete: countAllAddonsAfterDelete });
        mandatoryStepsCRUDAddon.deleteTestResult =
            countAllAddonsBeforeDelete.Body.length == countAllAddonsAfterDelete.Body.length + 1;
        addTestResultUnderHeadline(
            testName,
            'Delete Addon Test',
            mandatoryStepsCRUDAddon.deleteTestResult
                ? true
                : 'The response is: ' +
                      countAllAddonsAfterDelete.Body.length +
                      ' Expected response is: ' +
                      (countAllAddonsBeforeDelete.Body.length - 1),
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Creation Date Delete Test',
            countAllAddonsBeforeDelete.Body[0].CreationDate.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The creation date response is: ' + countAllAddonsBeforeDelete.Body[0].CreationDate,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Modification Date Delete Test',
            countAllAddonsBeforeDelete.Body[0].ModificationDate.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The modification date response is: ' + countAllAddonsBeforeDelete.Body[0].ModificationDate,
        );

        if (
            mandatoryStepsCRUDAddon.createTestResult == true &&
            mandatoryStepsCRUDAddon.readTestResult == true &&
            mandatoryStepsCRUDAddon.updateTestResult == true &&
            mandatoryStepsCRUDAddon.deleteTestResult == true
        ) {
            addTestResultUnderHeadline(testName, 'All Var API CRUD Addon Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Var API CRUD Addon Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test CRUD var Addon with UUID
    async function executeCrudAddonWithUUIDTestTest(testName, testDataBody) {
        const mandatoryStepsCRUDAddon = {
            createTestResult: false,
            readTestResult: false,
            deleteTestResult: false,
        };

        //Create UUID with random UUID
        testDataBody.UUID = uuidv4();
        //console.log({ Random_UUID: testDataBody.UUID });
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        //console.log({ Get_Var_Addons_No_UUID_Create: createApiResponse });
        mandatoryStepsCRUDAddon.createTestResult = testDataBody.Name == createApiResponse.Body.Name;
        addTestResultUnderHeadline(
            testName,
            'Create New Addon With UUID Test',
            mandatoryStepsCRUDAddon.createTestResult
                ? true
                : 'The response is: ' + createApiResponse.Body.Name + ' Expected response is: ' + testDataBody.Name,
        );

        //Read
        const getAddonsApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Read_Custom_UUID: getAddonsApiResponse });
        mandatoryStepsCRUDAddon.readTestResult = testDataBody.UUID == getAddonsApiResponse.Body.UUID;
        addTestResultUnderHeadline(
            testName,
            'Read Addon Test',
            mandatoryStepsCRUDAddon.readTestResult
                ? true
                : 'The response is: ' + getAddonsApiResponse.Body.Name + ' Expected response is: ' + testDataBody.Name,
        );

        //Delete
        const countAllAddonsBeforeDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Before_Delete: countAllAddonsBeforeDelete });
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        console.log({ Post_Var_Addons_Delete: deleteApiResponse.Body });
        const countAllAddonsAfterDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_After_Delete: countAllAddonsAfterDelete });
        mandatoryStepsCRUDAddon.deleteTestResult =
            countAllAddonsBeforeDelete.Body.length == countAllAddonsAfterDelete.Body.length + 1;
        addTestResultUnderHeadline(
            testName,
            'Delete Addon Test',
            mandatoryStepsCRUDAddon.deleteTestResult
                ? true
                : 'The response is: ' +
                      countAllAddonsAfterDelete.Body.length +
                      ' Expected response is: ' +
                      (countAllAddonsBeforeDelete.Body.length - 1),
        );

        if (
            mandatoryStepsCRUDAddon.createTestResult == true &&
            mandatoryStepsCRUDAddon.readTestResult == true &&
            mandatoryStepsCRUDAddon.deleteTestResult == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Var API Create New Addon With UUID Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Var API Create New Addon With UUID Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test CRUD var Addon with non valid UUID
    async function executeCrudAddonWithNonValidUUIDTestTest(testName, testDataBody) {
        const mandatoryStepsCRUDAddon = {
            createTestResult: false,
        };

        //Create UUID with random UUID
        testDataBody.UUID = uuidv4();
        const tempUUID = testDataBody.UUID.split('-');
        tempUUID[1] = 'Oren';
        tempUUID[2] = 'Test';
        testDataBody.UUID = tempUUID.toString().split(',').join('-');
        //console.log({ Random_Non_Valid_UUID: testDataBody.UUID });
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        //console.log({ Response_Create_Var_Addons_With_Non_Valid_UUID: createApiResponse });
        mandatoryStepsCRUDAddon.createTestResult = JSON.stringify(createApiResponse).includes('is not vaild UUID');
        addTestResultUnderHeadline(
            testName,
            'Create Addon With Non Valid UUID Test',
            mandatoryStepsCRUDAddon.createTestResult
                ? true
                : 'The response is: ' +
                      JSON.stringify(createApiResponse) +
                      " Expected response is that Files > FileName > Includes 'is not vaild UUID'",
        );

        if (mandatoryStepsCRUDAddon.createTestResult == true) {
            addTestResultUnderHeadline(
                testName,
                'All Var API Create Addon  With Non Valid UUID Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Var API Create Addon With Non Valid UUID Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test CRUD var version addon
    async function executeCrudAddonVersionTest(testName, testDataBody) {
        const mandatoryStepsCRUDAddonVersion = {
            createVersionTestResult: false,
            readVersionTestResult: false,
            updateVersionTestResult: false,
            deleteVersionTestResult: false,
            deleteAddonTestResult: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        const versionTestDataBody = testDataNewAddonVersion(
            createApiResponse.Body.UUID,
            Math.floor(Math.random() * 1000000).toString(),
        ) as any;
        versionTestDataBody.Phased = true;
        versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Version_CRUD_Create: createVersionApiResponse });
        mandatoryStepsCRUDAddonVersion.createVersionTestResult =
            versionTestDataBody.Version == createVersionApiResponse.Body.Version;
        addTestResultUnderHeadline(
            testName,
            'Create New Addon Version Test',
            mandatoryStepsCRUDAddonVersion.createVersionTestResult
                ? true
                : 'The response is: ' +
                      createVersionApiResponse.Body.Version +
                      ' Expected response is: ' +
                      versionTestDataBody.Version,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Versions Creation Date Create Test',
            createVersionApiResponse.Body.CreationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The creation date response is: ' + createVersionApiResponse.Body.CreationDateTime,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Versions Modification Date Create Test',
            createVersionApiResponse.Body.ModificationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The modification date response is: ' + createVersionApiResponse.Body.ModificationDateTime,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Versions Start Phased Date Time Create Test',
            createVersionApiResponse.Body.StartPhasedDateTime.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The Start Phased Date Time response is: ' + createVersionApiResponse.Body.StartPhasedDateTime,
        );

        //Read
        const getAddonsApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Version_Read: getAddonsApiResponse });
        mandatoryStepsCRUDAddonVersion.readVersionTestResult =
            versionTestDataBody.Version == getAddonsApiResponse.Body.Version;
        addTestResultUnderHeadline(
            testName,
            'Read Addon Version Test',
            mandatoryStepsCRUDAddonVersion.readVersionTestResult
                ? true
                : 'The response is: ' +
                      getAddonsApiResponse.Body.Version +
                      ' Expected response is: ' +
                      versionTestDataBody.Version,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Versions Creation Date Read Test',
            getAddonsApiResponse.Body.CreationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The creation date response is: ' + getAddonsApiResponse.Body.CreationDateTime,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Versions Modification Date Read Test',
            getAddonsApiResponse.Body.ModificationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The modification date response is: ' + getAddonsApiResponse.Body.ModificationDateTime,
        );

        //Update
        const tempNewAddonVersionBody = createVersionApiResponse.Body;
        tempNewAddonVersionBody.Description = 'Update Version Test';
        let getAdonsVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(tempNewAddonVersionBody),
            },
        );
        //console.log({ Post_Var_Addons_Version_Update: getAdonsVersionApiResponse });
        getAdonsVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                getAdonsVersionApiResponse.Body.UUID,
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Version_Update_Read: getAdonsVersionApiResponse });
        mandatoryStepsCRUDAddonVersion.updateVersionTestResult =
            tempNewAddonVersionBody.Description == getAdonsVersionApiResponse.Body.Description;
        addTestResultUnderHeadline(
            testName,
            'Update Addon Version Test',
            mandatoryStepsCRUDAddonVersion.updateVersionTestResult
                ? true
                : 'The response is: ' +
                      getAdonsVersionApiResponse.Body.Description +
                      ' Expected response is: ' +
                      tempNewAddonVersionBody.Description,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Versions Creation Date Update Test',
            getAdonsVersionApiResponse.Body.CreationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The creation date response is: ' + getAdonsVersionApiResponse.Body.CreationDateTime,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Versions Modification Date Update Test',
            getAdonsVersionApiResponse.Body.ModificationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The modification date response is: ' + getAdonsVersionApiResponse.Body.ModificationDateTime,
        );

        //Delete Version
        const countAllAddonsVersionsBeforeDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                "/var/addons/versions?where=AddonUUID='" +
                getAdonsVersionApiResponse.Body.AddonUUID +
                "'",
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Versions_Before_Delete: countAllAddonsVersionsBeforeDelete });
        let deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                getAdonsVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        console.log({ Post_Var_Addons_Version_Delete: deleteApiResponse.Body });
        const countAllAddonsVersionsAfterDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                "/var/addons/versions?where=AddonUUID='" +
                getAdonsVersionApiResponse.Body.AddonUUID +
                "'",
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Versions_After_Delete: countAllAddonsVersionsAfterDelete });
        mandatoryStepsCRUDAddonVersion.deleteVersionTestResult =
            countAllAddonsVersionsBeforeDelete.Body.length == countAllAddonsVersionsAfterDelete.Body.length + 1;
        addTestResultUnderHeadline(
            testName,
            'Delete Addon Version Test',
            mandatoryStepsCRUDAddonVersion.deleteVersionTestResult
                ? true
                : 'The response is: ' +
                      countAllAddonsVersionsAfterDelete.Body.length +
                      ' Expected response is: ' +
                      (countAllAddonsVersionsBeforeDelete.Body.length - 1),
        );

        //Delete Addon Version
        const deleteVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        if (!deleteVersionApiResponse) {
            //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        }

        //Delete Addon
        const countAllAddonsBeforeDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Before_Delete: countAllAddonsBeforeDelete });
        deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        console.log({ Post_Var_Addons_Delete: deleteApiResponse.Body });
        const countAllAddonsAfterDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_After_Delete: countAllAddonsAfterDelete });
        mandatoryStepsCRUDAddonVersion.deleteAddonTestResult =
            countAllAddonsBeforeDelete.Body.length == countAllAddonsAfterDelete.Body.length + 1;
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            mandatoryStepsCRUDAddonVersion.deleteAddonTestResult
                ? true
                : 'The response is: ' +
                      countAllAddonsAfterDelete.Body.length +
                      ' Expected response is: ' +
                      (countAllAddonsBeforeDelete.Body.length - 1),
        );

        if (
            mandatoryStepsCRUDAddonVersion.createVersionTestResult == true &&
            mandatoryStepsCRUDAddonVersion.readVersionTestResult == true &&
            mandatoryStepsCRUDAddonVersion.updateVersionTestResult == true &&
            mandatoryStepsCRUDAddonVersion.deleteVersionTestResult == true &&
            mandatoryStepsCRUDAddonVersion.deleteAddonTestResult == true
        ) {
            addTestResultUnderHeadline(testName, 'All Var API CRUD Addon Version Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Var API CRUD Addon Version Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Get Deleted addon (Single/List)
    async function executeGetDeletedAddonTest(testName, isPositiveTest, testDataBody) {
        const mandatoryStepsGetDeletedAddonTest = {
            createAddon: false,
            deleteAddon: false,
            getDeleteAddon: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        mandatoryStepsGetDeletedAddonTest.createAddon = testDataBody.Name == createApiResponse.Body.Name;

        //Delete Addon
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Post_Var_Addons_Delete: deleteApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            !JSON.stringify(deleteApiResponse).includes('fault'),
        );
        mandatoryStepsGetDeletedAddonTest.deleteAddon = !JSON.stringify(deleteApiResponse).includes('fault');

        //Get Delted Addon
        let getDeletedAddonTest;
        if (isPositiveTest) {
            getDeletedAddonTest = await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                    '/var/addons/' +
                    createApiResponse.Body.UUID,
                {
                    method: `GET`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            );
            //console.log({ Get_Var_Addons_After_Delete: getDeletedAddonTest });
            addTestResultUnderHeadline(
                testName,
                'Get Deleted Addon Test',
                getDeletedAddonTest.Body.Hidden
                    ? true
                    : 'The response is: ' +
                          getDeletedAddonTest.Body.Hidden +
                          ' Expected response is: ' +
                          isPositiveTest,
            );
            mandatoryStepsGetDeletedAddonTest.getDeleteAddon = getDeletedAddonTest.Body.Hidden;
        } else {
            getDeletedAddonTest = await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
                {
                    method: `GET`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            );
            //console.log({ Get_Var_Addons_After_Delete: getDeletedAddonTest });
            mandatoryStep: {
                for (let index = 0; index < getDeletedAddonTest.Body.length; index++) {
                    const element = getDeletedAddonTest.Body[index];
                    if (element.UUID == createApiResponse.Body.UUID) {
                        addTestResultUnderHeadline(testName, 'Dont Get Deleted Addon Test In List', element);
                        mandatoryStepsGetDeletedAddonTest.getDeleteAddon = false;
                        break mandatoryStep;
                    }
                }
                mandatoryStepsGetDeletedAddonTest.getDeleteAddon = true;
                addTestResultUnderHeadline(testName, 'Dont Get Deleted Addon Test In List');
            }
        }

        if (
            mandatoryStepsGetDeletedAddonTest.createAddon == true &&
            mandatoryStepsGetDeletedAddonTest.deleteAddon == true &&
            mandatoryStepsGetDeletedAddonTest.getDeleteAddon == true
        ) {
            addTestResultUnderHeadline(testName, 'All Deleted addon Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Deleted addon Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Get Deleted version addon (Single/List)
    async function executeGetDeletedAddonVersionTest(testName, isPositiveTest, testDataBody) {
        const mandatoryStepsGetDeletedAddonVersionTest = {
            createAddonVersion: false,
            DeleteAddonVersion: false,
            correctHiddenStatusOfVersion: false,
            RemoveAddonEndTest: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        const versionTestDataBody = testDataNewAddonVersion(
            createApiResponse.Body.UUID,
            Math.floor(Math.random() * 1000000).toString(),
        ) as any;
        versionTestDataBody.Phased = true;
        versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        mandatoryStepsGetDeletedAddonVersionTest.createAddonVersion =
            versionTestDataBody.Version == createVersionApiResponse.Body.Version;

        //Delete Version
        let deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Post_Var_Addons_Version_Delete: deleteApiResponse.Body });
        addTestResultUnderHeadline(testName, 'Delete Addon Version Test', deleteApiResponse.Body);
        mandatoryStepsGetDeletedAddonVersionTest.DeleteAddonVersion = deleteApiResponse.Body;

        let getDeletedAddonVersionTest;
        if (isPositiveTest) {
            getDeletedAddonVersionTest = await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                    '/var/addons/versions/' +
                    createVersionApiResponse.Body.UUID,
                {
                    method: `GET`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            );
            //console.log({ Get_Var_Addons_Versions_After_Delete: getDeletedAddonVersionTest });
            addTestResultUnderHeadline(
                testName,
                'Get Deleted Addon Version Test',
                getDeletedAddonVersionTest.Body.Hidden
                    ? true
                    : 'The response is: ' +
                          getDeletedAddonVersionTest.Body.Hidden +
                          ' Expected response is: ' +
                          isPositiveTest,
            );
            mandatoryStepsGetDeletedAddonVersionTest.correctHiddenStatusOfVersion =
                getDeletedAddonVersionTest.Body.Hidden;
        } else {
            getDeletedAddonVersionTest = await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                {
                    method: `GET`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            );
            //console.log({ Get_Var_Addons_Versions_After_Delete: getDeletedAddonVersionTest });
            mandatoryStep: {
                for (let index = 0; index < getDeletedAddonVersionTest.Body.length; index++) {
                    const element = getDeletedAddonVersionTest.Body[index];
                    if (element.UUID == createVersionApiResponse.Body.UUID) {
                        //console.log({ Get_Var_Addons_Versions_After_Delete_In_List_Error: element });
                        addTestResultUnderHeadline(testName, 'Dont Get Deleted Addon Version Test In List', element);
                        mandatoryStepsGetDeletedAddonVersionTest.correctHiddenStatusOfVersion = false;
                        break mandatoryStep;
                    }
                }
                mandatoryStepsGetDeletedAddonVersionTest.correctHiddenStatusOfVersion = true;
                addTestResultUnderHeadline(testName, 'Dont Get Deleted Addon Version Test In List');
            }
        }

        //Delete Addon Version
        const deleteVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        if (!deleteVersionApiResponse) {
            //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        }

        //Delete Addon
        deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Post_Var_Addons_Delete: deleteApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            !JSON.stringify(deleteApiResponse).includes('fault'),
        );
        mandatoryStepsGetDeletedAddonVersionTest.RemoveAddonEndTest =
            !JSON.stringify(deleteApiResponse).includes('fault');

        if (
            mandatoryStepsGetDeletedAddonVersionTest.createAddonVersion == true &&
            mandatoryStepsGetDeletedAddonVersionTest.DeleteAddonVersion == true &&
            mandatoryStepsGetDeletedAddonVersionTest.correctHiddenStatusOfVersion == true &&
            mandatoryStepsGetDeletedAddonVersionTest.RemoveAddonEndTest == true
        ) {
            addTestResultUnderHeadline(testName, 'All Deleted addon Version Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Deleted addon Version Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Empty Version Object (Negative)
    async function executePostEmptyVersionObjectTest(testName, testDataBody) {
        const mandatoryStepsPostEmptyVersionTest = {
            FailToCreateAddonVersion: false,
            RemoveAddonEndTest: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );

        const versionTestDataBody = {};
        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Empty_Version_Create: createVersionApiResponse });

        //console.log({ Get_Var_Addons_Empty_Version_Create_Status_Text: createVersionApiResponse });
        mandatoryStepsPostEmptyVersionTest.FailToCreateAddonVersion = JSON.stringify(createVersionApiResponse).includes(
            'The mandatory field AddonUUID is missing',
        );
        addTestResultUnderHeadline(
            testName,
            'Create New Addon With Empty Version Test',
            mandatoryStepsPostEmptyVersionTest.FailToCreateAddonVersion
                ? true
                : 'The response is: ' +
                      JSON.stringify(createVersionApiResponse) +
                      " Expected response should include error mesage with the text : 'The mandatory field AddonUUID is missing'",
        );

        //Delete Addon
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Post_Var_Addons_Delete: deleteApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            !JSON.stringify(deleteApiResponse).includes('fault'),
        );
        mandatoryStepsPostEmptyVersionTest.RemoveAddonEndTest = !JSON.stringify(deleteApiResponse).includes('fault');

        if (
            mandatoryStepsPostEmptyVersionTest.FailToCreateAddonVersion == true &&
            mandatoryStepsPostEmptyVersionTest.RemoveAddonEndTest == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Post Empty Version Object Test (Negative) mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Post Empty Version Object Test (Negative) mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Post Empty Versions Array In Bulk End Point (Negative)
    async function executePostEmptyVersionsInBulkEndPointTest(testName, testDataBody) {
        const mandatoryStepsPostEmptyVersionsArrayTest = {
            FailToCreateAddonVersion: false,
            RemoveAddonEndTest: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );

        const versionTestDataBody = [{}];
        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions/bulk',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Empty_Versions_Array_Create: createVersionApiResponse });

        //console.log({ Get_Var_Addons_Empty_Versions_Array_Create_Status_Text: createVersionApiResponse });
        mandatoryStepsPostEmptyVersionsArrayTest.FailToCreateAddonVersion = JSON.stringify(
            createVersionApiResponse,
        ).includes('The mandatory field AddonUUID is missing');
        addTestResultUnderHeadline(
            testName,
            'Create New Addon With Empty Versions Array Test',
            mandatoryStepsPostEmptyVersionsArrayTest.FailToCreateAddonVersion
                ? true
                : 'The response is: ' +
                      JSON.stringify(createVersionApiResponse) +
                      " Expected response should include error mesage with the text : 'The mandatory field AddonUUID is missing'",
        );

        //Delete Addon
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Post_Var_Addons_Delete: deleteApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            !JSON.stringify(deleteApiResponse).includes('fault'),
        );
        mandatoryStepsPostEmptyVersionsArrayTest.RemoveAddonEndTest =
            !JSON.stringify(deleteApiResponse).includes('fault');

        if (
            mandatoryStepsPostEmptyVersionsArrayTest.FailToCreateAddonVersion == true &&
            mandatoryStepsPostEmptyVersionsArrayTest.RemoveAddonEndTest == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Post Empty Versions Array Of Objects Test (Negative) mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Post Empty Versions Array Of Objects Test (Negative) mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Post Versions Array In Bulk End Point
    async function executePostVersionsInBulkEndPointTest(testName, testDataBody) {
        const mandatoryStepsPostVersionsInBulkTest = {
            createAddonVersion: false,
            RemoveAddonEndTest: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        const versionTestDataBody = [, , ,] as any;
        for (let index = 0; index < versionTestDataBody.length; index++) {
            versionTestDataBody[index] = testDataNewAddonVersion(
                createApiResponse.Body.UUID,
                Math.floor(Math.random() * 1000000).toString(),
            );
            versionTestDataBody[index].Phased = true;
            versionTestDataBody[index].StartPhasedDateTime = new Date().toJSON();
        }

        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions/bulk',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Versions_Array_Create: createVersionApiResponse });
        mandatoryStepsPostVersionsInBulkTest.createAddonVersion =
            versionTestDataBody[0].Version == createVersionApiResponse.Body[0].Version;
        addTestResultUnderHeadline(
            testName,
            'Read Addon Bulk Versions Creation Date Create Test',
            createVersionApiResponse.Body[0].CreationDateTime.includes(new Date().toISOString().split('T')[0] && 'Z')
                ? true
                : 'The creation date response is: ' + createVersionApiResponse.Body[0].CreationDateTime,
        );
        addTestResultUnderHeadline(
            testName,
            'Read Addon Bulk Versions Modification Date Create Test',
            createVersionApiResponse.Body[0].ModificationDateTime.includes(
                new Date().toISOString().split('T')[0] && 'Z',
            )
                ? true
                : 'The modification date response is: ' + createVersionApiResponse.Body[0].ModificationDateTime,
        );

        //Delete Addon
        for (let index = 0; index < versionTestDataBody.length; index++) {
            const deleteVersionApiResponse = await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                    '/var/addons/versions/' +
                    createVersionApiResponse.Body[index].UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            );
            if (!deleteVersionApiResponse) {
                //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
            }
        }

        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Post_Var_Addons_Delete: deleteApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            !JSON.stringify(deleteApiResponse).includes('fault'),
        );
        mandatoryStepsPostVersionsInBulkTest.RemoveAddonEndTest = !JSON.stringify(deleteApiResponse).includes('fault');

        if (
            mandatoryStepsPostVersionsInBulkTest.createAddonVersion == true &&
            mandatoryStepsPostVersionsInBulkTest.RemoveAddonEndTest == true
        ) {
            addTestResultUnderHeadline(testName, 'All Post Versions Array Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Post Versions Array Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test was removed in 21/12/2020 since all the responses of 500 will return in HTML and are not formattable
    //Test Post Single Version In Bulk End Point (Negative)
    // async function executePostSingleVersionInBulkEndPointTest(testName, testDataBody) {
    //     const mandatoryStepsPostSingleVersionInBulkEndPointTest = {
    //         FailToCreateAddonVersion: false,
    //         RemoveAddonEndTest: false,
    //     };

    //     //Create
    //     const createApiResponse = await generalService.fetchStatus(
    //         generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
    //         {
    //             method: `POST`,
    //             headers: {
    //                 Authorization: request.body.varKey,
    //             },
    //             body: JSON.stringify(testDataBody),
    //         },
    //     ).then((response) => response.Body;

    //     const versionTestDataBody = testDataNewAddonVersion(
    //         createApiResponse.Body.UUID,
    //         Math.floor(Math.random() * 1000000).toString(),
    //     ) as any;
    //     versionTestDataBody.Phased = true;
    //     versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
    //     const createVersionApiResponse = await generalService.fetchStatus(
    //         generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions/bulk',
    //         {
    //             method: `POST`,
    //             headers: {
    //                 Authorization: request.body.varKey,
    //             },
    //             body: JSON.stringify(versionTestDataBody),
    //         },
    //     ).then((response) => response.Body;
    //     //console.log({ Get_Var_Addons_Empty_Versions_Array_Create: createVersionApiResponse });
    //     //console.log({ Get_Var_Addons_Single_Version_In_Bulk_End_Point_Create_Status_Text: createVersionApiResponse }); //statusText.split('<h2>')[1].split('</h2>')[0] });
    //     mandatoryStepsPostSingleVersionInBulkEndPointTest.FailToCreateAddonVersion = JSON.stringify(
    //         createVersionApiResponse,
    //     ).includes('fault'); //statusText.split('<h2>')[1].split('</h2>')[0].includes("500 - Internal server error.");
    //     addTestResultUnderHeadline(
    //         testName,
    //         'Create New Addon With Single Version In Bulk End Point Test',
    //         mandatoryStepsPostSingleVersionInBulkEndPointTest.FailToCreateAddonVersion
    //             ? true
    //             : 'The response is: ' +
    //               JSON.stringify(createVersionApiResponse) + //.statusText.split('<h2>')[1].split('</h2>')[0] +
    //                   " Expected response should include error mesage with the text : '500 - Internal server error.'",
    //     );

    //     //Delete Addon
    //     const deleteApiResponse = await generalService.fetchStatus(
    //         generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
    //         {
    //             method: `DELETE`,
    //             headers: {
    //                 Authorization: request.body.varKey,
    //             },
    //         },
    //     ).then((response) => response.Body;
    //     //console.log({ Post_Var_Addons_Delete: deleteApiResponse });
    //     addTestResultUnderHeadline(
    //         testName,
    //         'Delete Addon - End Test',
    //         !JSON.stringify(deleteApiResponse).includes('fault'),
    //     );
    //     mandatoryStepsPostSingleVersionInBulkEndPointTest.RemoveAddonEndTest = !JSON.stringify(
    //         deleteApiResponse,
    //     ).includes('fault');

    //     if (
    //         mandatoryStepsPostSingleVersionInBulkEndPointTest.FailToCreateAddonVersion == true &&
    //         mandatoryStepsPostSingleVersionInBulkEndPointTest.RemoveAddonEndTest == true
    //     ) {
    //         addTestResultUnderHeadline(
    //             testName,
    //             'All Post Single Version In Bulk End Point Test (Negative) mandatory steps complete',
    //         );
    //     } else {
    //         addTestResultUnderHeadline(
    //             testName,
    //             'All Post Single Version In Bulk End Point Test (Negative) mandatory steps complete',
    //             false,
    //         );
    //     }

    //     //This can be use to easily extract the token to the console
    //     //console.log({ Token: VarAPI._Token })
    // }

    //Test Post Versions Array Without Bulk (Negative)
    async function executePostVersionsWithoutBulkEndPointTest(testName, testDataBody) {
        const mandatoryStepsPostVersionsArrayWithoutBulkEndPointTest = {
            FailToCreateAddonVersion: false,
            RemoveAddonEndTest: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        const versionTestDataBody = [, , ,] as any;
        for (let index = 0; index < versionTestDataBody.length; index++) {
            versionTestDataBody[index] = testDataNewAddonVersion(
                createApiResponse.Body.UUID,
                Math.floor(Math.random() * 1000000).toString(),
            );
            versionTestDataBody[index].Phased = true;
            versionTestDataBody[index].StartPhasedDateTime = new Date().toJSON();
        }

        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Empty_Versions_Array_Create: createVersionApiResponse });

        //console.log({ Get_Var_Addons_Single_Version_In_Bulk_End_Point_Create_Status_Text: createVersionApiResponse }); //.statusText.split('<h2>')[1].split('</h2>')[0] });
        mandatoryStepsPostVersionsArrayWithoutBulkEndPointTest.FailToCreateAddonVersion =
            JSON.stringify(createVersionApiResponse).includes('fault'); //.statusText.split('<h2>')[1].split('</h2>')[0].includes("500 - Internal server error.");
        addTestResultUnderHeadline(
            testName,
            'Create New Addon With Single Version In Bulk End Point Test',
            mandatoryStepsPostVersionsArrayWithoutBulkEndPointTest.FailToCreateAddonVersion
                ? true
                : 'The response is: ' +
                      createVersionApiResponse + //.statusText.split('<h2>')[1].split('</h2>')[0] +
                      " Expected response should include error mesage with the text : '500 - Internal server error.'",
        );

        //Delete Addon
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Post_Var_Addons_Delete: deleteApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            !JSON.stringify(deleteApiResponse).includes('fault'),
        );
        mandatoryStepsPostVersionsArrayWithoutBulkEndPointTest.RemoveAddonEndTest =
            !JSON.stringify(deleteApiResponse).includes('fault');

        if (
            mandatoryStepsPostVersionsArrayWithoutBulkEndPointTest.FailToCreateAddonVersion == true &&
            mandatoryStepsPostVersionsArrayWithoutBulkEndPointTest.RemoveAddonEndTest == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Post Single Version In Bulk End Point Test (Negative) mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Post Single Version In Bulk End Point Test (Negative) mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Post addon version with the same name
    async function executePostSameVersionNameTest(testName, testDataBody) {
        const mandatoryStepsPostSameVersionNameTest = {
            createAddonVersion: false,
            FailToCreateAddonVersion: false,
            RemoveAddonEndTest: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        const versionTestDataBody = testDataNewAddonVersion(
            createApiResponse.Body.UUID,
            Math.floor(Math.random() * 1000000).toString(),
        ) as any;
        versionTestDataBody.Phased = true;
        versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Version_Same_Name_Create: createVersionApiResponse });
        mandatoryStepsPostSameVersionNameTest.createAddonVersion =
            versionTestDataBody.Version == createVersionApiResponse.Body.Version;

        const createVersionApiNegativeResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Version_Create: createVersionApiNegativeResponse });
        mandatoryStepsPostSameVersionNameTest.FailToCreateAddonVersion = JSON.stringify(
            createVersionApiNegativeResponse,
        ).includes('Addon version with name');
        addTestResultUnderHeadline(
            testName,
            'Create New Addon Version With Same Name Negative Test',
            mandatoryStepsPostSameVersionNameTest.FailToCreateAddonVersion
                ? true
                : 'The response is: ' +
                      JSON.stringify(createVersionApiNegativeResponse) +
                      " Expected response should include error mesage with the text : 'Addon version with name'",
        );

        //Delete Addon Version
        const deleteVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        if (!deleteVersionApiResponse) {
            //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        }

        //Delete Addon
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Post_Var_Addons_Delete: deleteApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            !JSON.stringify(deleteApiResponse).includes('fault'),
        );
        mandatoryStepsPostSameVersionNameTest.RemoveAddonEndTest = !JSON.stringify(deleteApiResponse).includes('fault');

        if (
            mandatoryStepsPostSameVersionNameTest.createAddonVersion == true &&
            mandatoryStepsPostSameVersionNameTest.FailToCreateAddonVersion == true &&
            mandatoryStepsPostSameVersionNameTest.RemoveAddonEndTest == true
        ) {
            addTestResultUnderHeadline(testName, 'All Post Same Version Name Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Post Same Version Name Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Post Addon Without Name Test
    async function executePostAddonWithoutNameTest(testName, testDataBody) {
        const mandatoryStepsPostAddonAddonWithoutNameTest = {
            FailToCreateAddonVersion: false,
            RemoveAddonEndTest: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        //console.log({ Post_Addon_Without_Name_Test: createApiResponse });
        mandatoryStepsPostAddonAddonWithoutNameTest.FailToCreateAddonVersion =
            JSON.stringify(createApiResponse).includes('fault');
        addTestResultUnderHeadline(
            testName,
            'Post Addon Without Name Negative Test',
            JSON.stringify(createApiResponse).includes('fault'),
        );

        if (mandatoryStepsPostAddonAddonWithoutNameTest.FailToCreateAddonVersion == true) {
            addTestResultUnderHeadline(testName, 'All Post Addon Without Name Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Post Addon Without Name Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Post Addon Version Without Version ID Test
    async function executePostAddonVersionWithoutVersionTest(testName, testDataBody) {
        const mandatoryStepsPostAddonVersionWithoutVersionTest = {
            FailToCreateAddonVersion: false,
            RemoveAddonEndTest: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        //console.log({ Addon_Created_For_No_Version_Test: createApiResponse });
        const versionTestDataBody = {
            AddonUUID: createApiResponse.Body.UUID,
        } as any;
        versionTestDataBody.Phased = true;
        versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
        const createVersionApiNegativeResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Post_Addon_Without_Version_ID_Test: createVersionApiNegativeResponse });
        addTestResultUnderHeadline(
            testName,
            'Create New Addon Without Version ID Negative Test',
            JSON.stringify(createVersionApiNegativeResponse).includes('fault'),
        );
        mandatoryStepsPostAddonVersionWithoutVersionTest.FailToCreateAddonVersion = JSON.stringify(
            createVersionApiNegativeResponse,
        ).includes('The mandatory field Version is missing');
        addTestResultUnderHeadline(
            testName,
            'Create New Addon Without Version ID Error Text Test',
            mandatoryStepsPostAddonVersionWithoutVersionTest.FailToCreateAddonVersion
                ? true
                : 'The response is: ' +
                      JSON.stringify(createVersionApiNegativeResponse) +
                      " Expected response should include error mesage with the text : 'The mandatory field Version is missing'",
        );

        //Delete Addon
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Delete_Addons: deleteApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            !JSON.stringify(deleteApiResponse).includes('fault'),
        );
        mandatoryStepsPostAddonVersionWithoutVersionTest.RemoveAddonEndTest =
            !JSON.stringify(deleteApiResponse).includes('fault');

        if (
            mandatoryStepsPostAddonVersionWithoutVersionTest.FailToCreateAddonVersion == true &&
            mandatoryStepsPostAddonVersionWithoutVersionTest.RemoveAddonEndTest == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Post Addon Version Without Version ID Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Post Addon Version Without Version ID Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Post Addon Version Without Addon UUID Test
    async function executePostAddonVersionWithoutAddonUUIDTest(testName, testDataBody) {
        const mandatoryStepsPostAddonVersionWithoutAddonUUIDTest = {
            FailToCreateAddonVersion: false,
            RemoveAddonEndTest: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        //console.log({ Addon_Created_For_No_UUID_Test: createApiResponse });
        const versionTestDataBody = {
            Version: 'Pepperitest Test Version ' + Math.floor(Math.random() * 1000000).toString(),
        } as any;
        versionTestDataBody.Phased = true;
        versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
        const createVersionApiNegativeResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Post_Addon_Version_Without_Addon_UUID_Test: createVersionApiNegativeResponse });
        addTestResultUnderHeadline(
            testName,
            'Create New Addon Version Without Addon UUID Negative Test',
            JSON.stringify(createVersionApiNegativeResponse).includes('fault'),
        );
        mandatoryStepsPostAddonVersionWithoutAddonUUIDTest.FailToCreateAddonVersion = JSON.stringify(
            createVersionApiNegativeResponse,
        ).includes('The mandatory field AddonUUID is missing');
        addTestResultUnderHeadline(
            testName,
            'Create New Addon Version Without Addon UUID Error Text Test',
            mandatoryStepsPostAddonVersionWithoutAddonUUIDTest.FailToCreateAddonVersion
                ? true
                : 'The response is: ' +
                      JSON.stringify(createVersionApiNegativeResponse) +
                      " Expected response should include error mesage with the text : 'The mandatory field Addon UUID is missing'",
        );

        //Delete Addon
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Delete_Addons: deleteApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            !JSON.stringify(deleteApiResponse).includes('fault'),
        );
        mandatoryStepsPostAddonVersionWithoutAddonUUIDTest.RemoveAddonEndTest =
            !JSON.stringify(deleteApiResponse).includes('fault');

        if (
            mandatoryStepsPostAddonVersionWithoutAddonUUIDTest.FailToCreateAddonVersion == true &&
            mandatoryStepsPostAddonVersionWithoutAddonUUIDTest.RemoveAddonEndTest == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Post Addon Version Without Addon UUID Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Post Addon Version Without Addon UUID Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Post Addon Version With Wrong Version ID And AddonUUID Negative Test
    async function executePostAddonVersionWithWrongVersionTest(testName, testDataBody) {
        const mandatoryStepsPostAddonVersionWithWrongVersionTest = {
            DontCreateAddonVersion: false,
            RemoveAddonEndTest: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        //console.log({ Addon_Created_For_Wrong_Version_Test: createApiResponse });

        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(
                    testDataNewAddonVersion(
                        createApiResponse.Body.UUID,
                        Math.floor(Math.random() * 1000000).toString(),
                    ),
                ),
            },
        );
        const versionTestDataBody = {
            Version: 'Pepperitest Test Version ' + Math.floor(Math.random() * 1000000).toString(),
            UUID: createVersionApiResponse.Body.UUID,
        };

        const createVersionApiNegativeResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        mandatoryStepsPostAddonVersionWithWrongVersionTest.DontCreateAddonVersion =
            createVersionApiResponse.Body.Version != versionTestDataBody.Version;
        addTestResultUnderHeadline(
            testName,
            'Create New Addon Version With Wrong Version ID And AddonUUID Test',
            mandatoryStepsPostAddonVersionWithWrongVersionTest.DontCreateAddonVersion
                ? true
                : 'The response is: ' +
                      createVersionApiNegativeResponse.Body.Version +
                      ' Expected response should include this Version : ' +
                      createVersionApiResponse.Body.Version,
        );

        //Delete Addon Version
        const deleteVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        if (!deleteVersionApiResponse) {
            //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        }

        //Delete Addon
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Delete_Addons: deleteApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            !JSON.stringify(deleteApiResponse).includes('fault'),
        );
        mandatoryStepsPostAddonVersionWithWrongVersionTest.RemoveAddonEndTest =
            !JSON.stringify(deleteApiResponse).includes('fault');

        if (
            mandatoryStepsPostAddonVersionWithWrongVersionTest.DontCreateAddonVersion == true &&
            mandatoryStepsPostAddonVersionWithWrongVersionTest.RemoveAddonEndTest == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Post Addon Version With Wrong Version ID And AddonUUID Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Post Addon Version With Wrong Version ID And AddonUUID Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Post Addon Version With Wrong Addon UUID (shorter) Negative Test
    async function executePostAddonVersionWithShorterUUIDTest(testName, testDataBody) {
        const mandatoryStepsPostAddonVersionWithWrongVersionTest = {
            DontCreateAddonVersion: false,
            RemoveAddonEndTest: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        //console.log({ Addon_Created_For_Shorter_UUID_Test: createApiResponse });

        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(
                    testDataNewAddonVersion(
                        createApiResponse.Body.UUID,
                        Math.floor(Math.random() * 1000000).toString(),
                    ),
                ),
            },
        );
        const versionTestDataBody = {
            UUID: createVersionApiResponse.Body.UUID.substring(0, createVersionApiResponse.Body.UUID.length - 1),
        };
        const createVersionApiNegativeResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Version_Create: createVersionApiNegativeResponse });
        mandatoryStepsPostAddonVersionWithWrongVersionTest.DontCreateAddonVersion = JSON.stringify(
            createVersionApiNegativeResponse,
        ).includes('is not vaild UUID');
        addTestResultUnderHeadline(
            testName,
            'Post Addon Version With Wrong (Short) UUID Error Message',
            mandatoryStepsPostAddonVersionWithWrongVersionTest.DontCreateAddonVersion
                ? true
                : 'The response is: ' +
                      JSON.stringify(createVersionApiNegativeResponse) +
                      " Expected response is that Files > FileName > Includes 'is not vaild UUID'",
        );

        //Delete Addon Version
        const deleteVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        if (!deleteVersionApiResponse) {
            //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        }

        //Delete Addon
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Delete_Addons: deleteApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            !JSON.stringify(deleteApiResponse).includes('fault'),
        );
        mandatoryStepsPostAddonVersionWithWrongVersionTest.RemoveAddonEndTest =
            !JSON.stringify(deleteApiResponse).includes('fault');

        if (
            mandatoryStepsPostAddonVersionWithWrongVersionTest.DontCreateAddonVersion == true &&
            mandatoryStepsPostAddonVersionWithWrongVersionTest.RemoveAddonEndTest == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Post Addon Version With Wrong (Short) UUID Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Post Addon Version With Wrong (Short) UUID Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Post Addon Version With Wrong Addon UUID (Wrong Digit) Negative Test
    async function executePostAddonVersionWithWrongUUIDTest(testName, testDataBody) {
        const mandatoryStepsPostAddonVersionWithWrongVersionTest = {
            DontCreateAddonVersion: false,
            RemoveAddonEndTest: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        //console.log({ Addon_Created_For_Wrong_UUID_Test: createApiResponse });

        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(
                    testDataNewAddonVersion(
                        createApiResponse.Body.UUID,
                        Math.floor(Math.random() * 1000000).toString(),
                    ),
                ),
            },
        );
        const versionTestDataBody = {
            Version: 'Pepperitest Test Version ' + Math.floor(Math.random() * 1000000).toString(),
            UUID: createVersionApiResponse.Body.UUID.substring(0, createVersionApiResponse.Body.UUID.length - 2) + '00',
        };
        const createVersionApiNegativeResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Version_Create: createVersionApiNegativeResponse });
        mandatoryStepsPostAddonVersionWithWrongVersionTest.DontCreateAddonVersion = JSON.stringify(
            createVersionApiNegativeResponse,
        ).includes('does not exist');
        addTestResultUnderHeadline(
            testName,
            'Post Addon Version With Wrong (Short) UUID Error Message',
            mandatoryStepsPostAddonVersionWithWrongVersionTest.DontCreateAddonVersion
                ? true
                : 'The response is: ' +
                      JSON.stringify(createVersionApiNegativeResponse) +
                      " Expected response is that Files > FileName > Includes 'does not exist'",
        );

        //Delete Addon Version
        const deleteVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        if (!deleteVersionApiResponse) {
            //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        }

        //Delete Addon
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Delete_Addons: deleteApiResponse });
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            !JSON.stringify(deleteApiResponse).includes('fault'),
        );
        mandatoryStepsPostAddonVersionWithWrongVersionTest.RemoveAddonEndTest =
            !JSON.stringify(deleteApiResponse).includes('fault');

        if (
            mandatoryStepsPostAddonVersionWithWrongVersionTest.DontCreateAddonVersion == true &&
            mandatoryStepsPostAddonVersionWithWrongVersionTest.RemoveAddonEndTest == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Post Addon Version With Wrong Version ID And AddonUUID Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Post Addon Version With Wrong Version ID And AddonUUID Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Validate Installation File Created
    async function executeValidateInstallationFileCreatedTest(testName, testDataBody) {
        const mandatoryStepsvalidateInstallationFileCreated = {
            createVersionTestResult: false,
            fileCreated: false,
            deleteAddonTestResult: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        const versionTestDataBody = testDataNewAddonVersion(
            createApiResponse.Body.UUID,
            Math.floor(Math.random() * 1000000).toString(),
        );
        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Version_File_Creation_Create: createVersionApiResponse });
        mandatoryStepsvalidateInstallationFileCreated.createVersionTestResult =
            versionTestDataBody.Version == createVersionApiResponse.Body.Version;
        addTestResultUnderHeadline(
            testName,
            'Create New Addon Version Test',
            mandatoryStepsvalidateInstallationFileCreated.createVersionTestResult
                ? true
                : 'The response is: ' +
                      createVersionApiResponse.Body.Version +
                      ' Expected response is: ' +
                      versionTestDataBody.Version,
        );

        //Read file
        const getVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Version: getVersionApiResponse });
        mandatoryStepsvalidateInstallationFileCreated.fileCreated =
            getVersionApiResponse.Body.Files[0].URL.includes('cdn');
        addTestResultUnderHeadline(
            testName,
            'Read File In Version Test',
            mandatoryStepsvalidateInstallationFileCreated.fileCreated
                ? true
                : 'The response is: ' +
                      getVersionApiResponse +
                      " Expected response is that Files > FileName > Includes 'cdn'",
        );

        //Delete Addon Version
        const deleteVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        if (!deleteVersionApiResponse) {
            //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        }

        //Delete Addon
        const countAllAddonsBeforeDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Before_Delete: countAllAddonsBeforeDelete });
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        console.log({ Post_Var_Addons_Delete: deleteApiResponse.Body });
        const countAllAddonsAfterDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_After_Delete: countAllAddonsAfterDelete });
        mandatoryStepsvalidateInstallationFileCreated.deleteAddonTestResult =
            countAllAddonsBeforeDelete.Body.length == countAllAddonsAfterDelete.Body.length + 1;
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            mandatoryStepsvalidateInstallationFileCreated.deleteAddonTestResult
                ? true
                : 'The response is: ' +
                      countAllAddonsAfterDelete.Body.length +
                      ' Expected response is: ' +
                      (countAllAddonsBeforeDelete.Body.length - 1),
        );

        if (
            mandatoryStepsvalidateInstallationFileCreated.createVersionTestResult == true &&
            mandatoryStepsvalidateInstallationFileCreated.fileCreated == true &&
            mandatoryStepsvalidateInstallationFileCreated.deleteAddonTestResult == true
        ) {
            addTestResultUnderHeadline(testName, 'All Read File In Version Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Read File In Version Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Validate Installation File Sent
    async function executeValidateInstallationFileSentTest(testName, testDataBody) {
        const mandatoryStepsvalidateInstallationFileSent = {
            createVersionTestResult: false,
            fileSent: false,
            deleteAddonTestResult: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );

        const fileAsSBase64 = await testDatagetBase64FileFromText();
        const versionTestDataBody = {
            AddonUUID: createApiResponse.Body.UUID,
            Version: 'Pepperitest Test Version ' + Math.floor(Math.random() * 1000000).toString(),
            //TODO: fix this capital letter when it will be decided
            //Capital letter no longer valid temp patch "installation" instead of "Installation"
            Files: [{ FileName: 'installation.js', URL: '', Base64Content: fileAsSBase64 }],
        };

        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Version_File_Sent_Create: createVersionApiResponse });
        mandatoryStepsvalidateInstallationFileSent.createVersionTestResult =
            !JSON.stringify(createVersionApiResponse).includes('fault');
        addTestResultUnderHeadline(
            testName,
            'Create New Addon Version Test',
            mandatoryStepsvalidateInstallationFileSent.createVersionTestResult
                ? true
                : 'The response is: ' +
                      createVersionApiResponse.Body.Version +
                      ' Expected response is: ' +
                      versionTestDataBody.Version,
        );

        //Read file
        const getVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Version: getVersionApiResponse });
        mandatoryStepsvalidateInstallationFileSent.fileSent = getVersionApiResponse.Body.Files[0].URL.includes('cdn');
        addTestResultUnderHeadline(
            testName,
            'Read Installation File Created Test',
            mandatoryStepsvalidateInstallationFileSent.fileSent
                ? true
                : 'The response is: ' +
                      getVersionApiResponse +
                      " Expected response is that Files > FileName > Includes 'cdn'",
        );

        //Delete Addon Version
        const deleteVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        if (!deleteVersionApiResponse) {
            //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        }

        //Delete Addon
        const countAllAddonsBeforeDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Before_Delete: countAllAddonsBeforeDelete });
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        console.log({ Post_Var_Addons_Delete: deleteApiResponse.Body });
        const countAllAddonsAfterDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_After_Delete: countAllAddonsAfterDelete });
        mandatoryStepsvalidateInstallationFileSent.deleteAddonTestResult =
            countAllAddonsBeforeDelete.Body.length == countAllAddonsAfterDelete.Body.length + 1;
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            mandatoryStepsvalidateInstallationFileSent.deleteAddonTestResult
                ? true
                : 'The response is: ' +
                      countAllAddonsAfterDelete.Body.length +
                      ' Expected response is: ' +
                      (countAllAddonsBeforeDelete.Body.length - 1),
        );

        if (
            mandatoryStepsvalidateInstallationFileSent.createVersionTestResult == true &&
            mandatoryStepsvalidateInstallationFileSent.fileSent == true &&
            mandatoryStepsvalidateInstallationFileSent.deleteAddonTestResult == true
        ) {
            addTestResultUnderHeadline(testName, 'All Read Installation Files Created Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Read Installation File Created Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Validate Other File Sent
    async function executeValidateOtherFileSentTest(testName, testDataBody) {
        const mandatoryStepsvalidateOtherFileSent = {
            createVersionTestResult: false,
            fileSent: false,
            fileCreated: false,
            deleteAddonTestResult: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );

        const fileAsSBase64 = await testDatagetBase64FileFromText();
        const versionTestDataBody = {
            AddonUUID: createApiResponse.Body.UUID,
            Version: 'Pepperitest Test Version ' + Math.floor(Math.random() * 1000000).toString(),
            //TODO: fix this capital letter when it will be decided
            //Capital letter no longer valid temp patch "other" instead of "Other"
            Files: [{ FileName: 'other.js', URL: '', Base64Content: fileAsSBase64 }],
        };

        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Version_Other_File_Create: createVersionApiResponse });
        mandatoryStepsvalidateOtherFileSent.createVersionTestResult =
            !JSON.stringify(createVersionApiResponse).includes('fault');
        addTestResultUnderHeadline(
            testName,
            'Create New Addon Version Test',
            mandatoryStepsvalidateOtherFileSent.createVersionTestResult
                ? true
                : 'The response is: ' +
                      createVersionApiResponse.Body.Version +
                      ' Expected response is: ' +
                      versionTestDataBody.Version,
        );

        //Read
        const getVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Version: getVersionApiResponse });
        mandatoryStepsvalidateOtherFileSent.fileSent = getVersionApiResponse.Body.Files[0].URL.includes('installation');
        addTestResultUnderHeadline(
            testName,
            'Read Other File Sent Test',
            mandatoryStepsvalidateOtherFileSent.fileSent
                ? true
                : 'The response is: ' +
                      getVersionApiResponse +
                      " Expected response is that Files > FileName > Includes 'other'",
        );
        mandatoryStepsvalidateOtherFileSent.fileCreated = getVersionApiResponse.Body.Files[1].URL.includes('other');
        addTestResultUnderHeadline(
            testName,
            'Read Installation File Created Test',
            mandatoryStepsvalidateOtherFileSent.fileCreated
                ? true
                : 'The response is: ' +
                      getVersionApiResponse +
                      " Expected response is that Files > FileName > Includes 'installation'",
        );

        //Delete Addon Version
        const deleteVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        if (!deleteVersionApiResponse) {
            //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        }

        //Delete Addon
        const countAllAddonsBeforeDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Before_Delete: countAllAddonsBeforeDelete });
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        console.log({ Post_Var_Addons_Delete: deleteApiResponse.Body });
        const countAllAddonsAfterDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_After_Delete: countAllAddonsAfterDelete });
        mandatoryStepsvalidateOtherFileSent.deleteAddonTestResult =
            countAllAddonsBeforeDelete.Body.length == countAllAddonsAfterDelete.Body.length + 1;
        addTestResultUnderHeadline(
            testName,
            'Delete Addon - End Test',
            mandatoryStepsvalidateOtherFileSent.deleteAddonTestResult
                ? true
                : 'The response is: ' +
                      countAllAddonsAfterDelete.Body.length +
                      ' Expected response is: ' +
                      (countAllAddonsBeforeDelete.Body.length - 1),
        );

        if (
            mandatoryStepsvalidateOtherFileSent.createVersionTestResult == true &&
            mandatoryStepsvalidateOtherFileSent.fileSent == true &&
            mandatoryStepsvalidateOtherFileSent.fileCreated == true &&
            mandatoryStepsvalidateOtherFileSent.deleteAddonTestResult == true
        ) {
            addTestResultUnderHeadline(testName, 'All Read Files In Other Files Sent Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Read Files In Other Files Sent Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Validate Other Files In Folder Sent
    async function executeValidateOtherFilesSentInFolderTest(testName, testDataBody) {
        const mandatoryStepsvalidateOtherFileSent = {
            createVersionTestResult: false,
            fileSent: false,
            fileCreated: false,
            deleteAddonTestResult: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );

        const fileAsSBase64 = await testDatagetBase64FileFromText();

        let versionTestDataBody;
        if (testName.includes('Negative')) {
            versionTestDataBody = {
                AddonUUID: createApiResponse.Body.UUID,
                Version: 'Pepperitest Test Version ' + Math.floor(Math.random() * 1000000).toString(),
                //TODO: fix this capital letter when it will be decided
                //Capital letter no longer valid temp patch "other" instead of "Other"
                Files: [
                    { FileName: 'other.js', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'ShirTheQueen/happy.txt', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'oren.js', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'Oren.js', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'ORen.txt', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'folderName/Data.js', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'folderName/savata.js', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'folderName/savata.txt', URL: '', Base64Content: fileAsSBase64 },
                ],
            };
        } else {
            versionTestDataBody = {
                AddonUUID: createApiResponse.Body.UUID,
                Version: 'Pepperitest Test Version ' + Math.floor(Math.random() * 1000000).toString(),
                //TODO: fix this capital letter when it will be decided
                //Capital letter no longer valid temp patch "other" instead of "Other"
                Files: [
                    { FileName: 'other.js', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'ShirTheQueen/happy.txt', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'oren.js', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'ORen.txt', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'folderName/Data.js', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'folderName/savata.js', URL: '', Base64Content: fileAsSBase64 },
                    { FileName: 'folderName/savata.txt', URL: '', Base64Content: fileAsSBase64 },
                ],
            };
        }

        const createVersionApiResponse = await generalService
            .fetchStatus(generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions', {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            })
            .then((obj) => {
                if (testName.includes('Negative')) {
                    if (
                        JSON.stringify(obj).includes(
                            `fault":{"faultstring":"Server side file with name \'Oren.js\' must be in lower case","detail":{"errorcode":"InvalidData`,
                        )
                    ) {
                        addTestResultUnderHeadline(
                            testName,
                            'Correct error when file not in lower case in root folder',
                        );
                    } else {
                        addTestResultUnderHeadline(
                            testName,
                            'Correct error when file not in lower case in root folder',
                            obj,
                        );
                    }
                }
                return obj;
            });

        //console.log({ Get_Var_Addons_Version_Other_File_Create: createVersionApiResponse });

        if (!testName.includes('Negative')) {
            mandatoryStepsvalidateOtherFileSent.createVersionTestResult =
                !JSON.stringify(createVersionApiResponse).includes('fault');
            addTestResultUnderHeadline(
                testName,
                'Create New Addon Version Test',
                mandatoryStepsvalidateOtherFileSent.createVersionTestResult
                    ? true
                    : 'The response is: ' +
                          createVersionApiResponse.Body.Version +
                          ' Expected response is: ' +
                          versionTestDataBody.Version,
            );

            //Read
            const getVersionApiResponse = await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                    '/var/addons/versions/' +
                    createVersionApiResponse.Body.UUID,
                {
                    method: `GET`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            );
            //console.log({ Get_Version: getVersionApiResponse });

            mandatoryStepsvalidateOtherFileSent.fileSent = JSON.stringify(getVersionApiResponse.Body.Files).includes(
                `${versionTestDataBody.Version}/installation.js`,
            );
            addTestResultUnderHeadline(
                testName,
                'Read Other File Sent Test',
                mandatoryStepsvalidateOtherFileSent.fileSent
                    ? true
                    : 'The response is: ' +
                          getVersionApiResponse +
                          " Expected response is that Files > FileName > Includes 'other'",
            );

            mandatoryStepsvalidateOtherFileSent.fileCreated = JSON.stringify(getVersionApiResponse.Body.Files).includes(
                `${versionTestDataBody.Version}/other.js`,
            );
            addTestResultUnderHeadline(
                testName,
                'Read Installation File Created Test',
                mandatoryStepsvalidateOtherFileSent.fileCreated
                    ? true
                    : 'The response is: ' +
                          getVersionApiResponse +
                          " Expected response is that Files > FileName > Includes 'installation'",
            );

            //Delete Addon Version
            const deleteVersionApiResponse = await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                    '/var/addons/versions/' +
                    createVersionApiResponse.Body.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            );
            if (!deleteVersionApiResponse) {
                //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
            }

            //Delete Addon
            const countAllAddonsBeforeDelete = await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
                {
                    method: `GET`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            );
            //console.log({ Get_Var_Addons_Before_Delete: countAllAddonsBeforeDelete });
            const deleteApiResponse = await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                    '/var/addons/' +
                    createApiResponse.Body.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            );
            console.log({ Post_Var_Addons_Delete: deleteApiResponse.Body });
            const countAllAddonsAfterDelete = await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
                {
                    method: `GET`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            );
            //console.log({ Get_Var_Addons_After_Delete: countAllAddonsAfterDelete });
            mandatoryStepsvalidateOtherFileSent.deleteAddonTestResult =
                countAllAddonsBeforeDelete.Body.length == countAllAddonsAfterDelete.Body.length + 1;
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                mandatoryStepsvalidateOtherFileSent.deleteAddonTestResult
                    ? true
                    : 'The response is: ' +
                          countAllAddonsAfterDelete.Body.length +
                          ' Expected response is: ' +
                          (countAllAddonsBeforeDelete.Body.length - 1),
            );

            if (
                mandatoryStepsvalidateOtherFileSent.createVersionTestResult == true &&
                mandatoryStepsvalidateOtherFileSent.fileSent == true &&
                mandatoryStepsvalidateOtherFileSent.fileCreated == true &&
                mandatoryStepsvalidateOtherFileSent.deleteAddonTestResult == true
            ) {
                addTestResultUnderHeadline(
                    testName,
                    'All Read Files In Other Files Sent Test mandatory steps complete',
                );
            } else {
                addTestResultUnderHeadline(
                    testName,
                    'All Read Files In Other Files Sent Test mandatory steps complete',
                    false,
                );
            }
        }
    }

    //Test Update All Addon Data Members
    async function executeUpdateAllAddonDataMembersTest(testName, testDataBody) {
        const mandatoryStepsUpdateAllAddonDataMembers = {
            createTestResult: false,
            updateTestResultDescription: false,
            updateTestResultName: false,
            updateTestResultType: false,
            deleteTestResult: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Update_Test_Create: createApiResponse });
        mandatoryStepsUpdateAllAddonDataMembers.createTestResult = testDataBody.Name == createApiResponse.Body.Name;
        addTestResultUnderHeadline(
            testName,
            'Create New Addon Test',
            mandatoryStepsUpdateAllAddonDataMembers.createTestResult
                ? true
                : 'The response is: ' + createApiResponse.Body.Name + ' Expected response is: ' + testDataBody.Name,
        );

        //Update
        const tempNewAddonBody = createApiResponse.Body;
        tempNewAddonBody.Description = 'Update Description Test';
        tempNewAddonBody.Name = 'Update Name Test';
        tempNewAddonBody.Type = 'Update Type Tess';
        let getAddonsApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(tempNewAddonBody),
            },
        );
        //console.log({ Post_Var_Addons_Update: getAddonsApiResponse });
        getAddonsApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        console.log({ Get_Var_Addons_Update_Read: getAddonsApiResponse.Body });
        //Description
        mandatoryStepsUpdateAllAddonDataMembers.updateTestResultDescription =
            tempNewAddonBody.Description == createApiResponse.Body.Description;
        addTestResultUnderHeadline(
            testName,
            'Update Description Test',
            mandatoryStepsUpdateAllAddonDataMembers.updateTestResultDescription
                ? true
                : 'The response is: ' +
                      createApiResponse.Body.Description +
                      ' Expected response is: ' +
                      tempNewAddonBody.Description,
        );
        //Name
        mandatoryStepsUpdateAllAddonDataMembers.updateTestResultName =
            tempNewAddonBody.Name == createApiResponse.Body.Name;
        addTestResultUnderHeadline(
            testName,
            'Update Name Test',
            mandatoryStepsUpdateAllAddonDataMembers.updateTestResultName
                ? true
                : 'The response is: ' + createApiResponse.Body.Name + ' Expected response is: ' + tempNewAddonBody.Name,
        );
        //Type
        mandatoryStepsUpdateAllAddonDataMembers.updateTestResultType =
            tempNewAddonBody.Type == createApiResponse.Body.Type;
        addTestResultUnderHeadline(
            testName,
            'Update Type Test',
            mandatoryStepsUpdateAllAddonDataMembers.updateTestResultType
                ? true
                : 'The response is: ' + createApiResponse.Body.Type + ' Expected response is: ' + tempNewAddonBody.Type,
        );

        //Delete
        const countAllAddonsBeforeDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Before_Delete: countAllAddonsBeforeDelete });
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        console.log({ Post_Var_Addons_Delete: deleteApiResponse.Body });
        const countAllAddonsAfterDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_After_Delete: countAllAddonsAfterDelete });
        mandatoryStepsUpdateAllAddonDataMembers.deleteTestResult =
            countAllAddonsBeforeDelete.Body.length == countAllAddonsAfterDelete.Body.length + 1;
        addTestResultUnderHeadline(
            testName,
            'Delete Addon Test',
            mandatoryStepsUpdateAllAddonDataMembers.deleteTestResult
                ? true
                : 'The response is: ' +
                      countAllAddonsAfterDelete.Body.length +
                      ' Expected response is: ' +
                      (countAllAddonsBeforeDelete.Body.length - 1),
        );

        if (
            mandatoryStepsUpdateAllAddonDataMembers.createTestResult == true &&
            mandatoryStepsUpdateAllAddonDataMembers.updateTestResultDescription == true &&
            mandatoryStepsUpdateAllAddonDataMembers.updateTestResultName == true &&
            mandatoryStepsUpdateAllAddonDataMembers.updateTestResultType == true &&
            mandatoryStepsUpdateAllAddonDataMembers.deleteTestResult == true
        ) {
            addTestResultUnderHeadline(testName, 'All Update All Addon Data Members Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Update All Addon Data Members Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Update All Addon Version Data Members
    async function executeUpdateAllVersionDataMembersTest(testName, testDataBody) {
        const mandatoryStepsUpdateAllAddonVersionDataMembers = {
            createAddonVersion: false,
            updateTestResultDescription: false,
            updateTestResultAvailable: false,
            updateTestResultPhased: false,
            updateTestResultPhasedFunction: false,
            updateTestResultStartPhasedDateTime: false,
            deleteTestResult: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        //console.log({ Addon_Created_For_Update_Version_Test: createApiResponse });

        const versionTestDataBody = testDataNewAddonVersion(
            createApiResponse.Body.UUID,
            Math.floor(Math.random() * 1000000).toString(),
        );
        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Version_Create: createVersionApiResponse });
        mandatoryStepsUpdateAllAddonVersionDataMembers.createAddonVersion =
            versionTestDataBody.Version == createVersionApiResponse.Body.Version;

        //Update
        const tempNewAddonVersionBody = createVersionApiResponse.Body;
        tempNewAddonVersionBody.Description = 'Update Version Description Test';
        tempNewAddonVersionBody.Available = true;
        tempNewAddonVersionBody.StartPhasedDateTime = new Date().toJSON();
        tempNewAddonVersionBody.Phased = true;
        tempNewAddonVersionBody.PhasedFunction = 'Update Version PhasedFunction Test';

        const getAdonsVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(tempNewAddonVersionBody),
            },
        );
        //console.log({ Post_Var_Addons_Version_Update: getAdonsVersionApiResponse });

        //Description
        mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultDescription =
            tempNewAddonVersionBody.Description == getAdonsVersionApiResponse.Body.Description;
        addTestResultUnderHeadline(
            testName,
            'Update Addon Version Description Test',
            mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultDescription
                ? true
                : 'The response is: ' +
                      getAdonsVersionApiResponse.Body.Description +
                      ' Expected response is: ' +
                      tempNewAddonVersionBody.Description,
        );

        //Available
        mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultAvailable =
            tempNewAddonVersionBody.Available == getAdonsVersionApiResponse.Body.Available;
        addTestResultUnderHeadline(
            testName,
            'Update Addon Version Available Test',
            mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultAvailable
                ? true
                : 'The response is: ' +
                      getAdonsVersionApiResponse.Body.Available +
                      ' Expected response is: ' +
                      tempNewAddonVersionBody.Available,
        );

        //Phased
        mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultPhased =
            tempNewAddonVersionBody.Phased == getAdonsVersionApiResponse.Body.Phased;
        addTestResultUnderHeadline(
            testName,
            'Update Addon Version Phased Test',
            mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultPhased
                ? true
                : 'The response is: ' +
                      getAdonsVersionApiResponse.Body.Phased +
                      ' Expected response is: ' +
                      tempNewAddonVersionBody.Phased,
        );

        //StartPhasedDateTime
        mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultStartPhasedDateTime =
            tempNewAddonVersionBody.StartPhasedDateTime.substring(0, 18) ==
            getAdonsVersionApiResponse.Body.StartPhasedDateTime.substring(0, 18);
        addTestResultUnderHeadline(
            testName,
            'Update Addon Version StartPhasedDateTime Test',
            mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultStartPhasedDateTime
                ? true
                : 'The response is: ' +
                      getAdonsVersionApiResponse.Body.StartPhasedDateTime +
                      ' Expected response is: ' +
                      tempNewAddonVersionBody.StartPhasedDateTime,
        );

        //PhasedFunction
        mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultPhasedFunction =
            tempNewAddonVersionBody.PhasedFunction == getAdonsVersionApiResponse.Body.PhasedFunction;
        addTestResultUnderHeadline(
            testName,
            'Update Addon Version PhasedFunction Test',
            mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultPhasedFunction
                ? true
                : 'The response is: ' +
                      getAdonsVersionApiResponse.Body.PhasedFunction +
                      ' Expected response is: ' +
                      tempNewAddonVersionBody.PhasedFunction,
        );

        //Delete Addon Version
        const deleteVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        if (!deleteVersionApiResponse) {
            //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        }

        //Delete
        const countAllAddonsBeforeDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Before_Delete: countAllAddonsBeforeDelete });
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        console.log({ Post_Var_Addons_Delete: deleteApiResponse.Body });
        const countAllAddonsAfterDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_After_Delete: countAllAddonsAfterDelete });
        mandatoryStepsUpdateAllAddonVersionDataMembers.deleteTestResult =
            countAllAddonsBeforeDelete.Body.length == countAllAddonsAfterDelete.Body.length + 1;
        addTestResultUnderHeadline(
            testName,
            'Delete Addon Test',
            mandatoryStepsUpdateAllAddonVersionDataMembers.deleteTestResult
                ? true
                : 'The response is: ' +
                      countAllAddonsAfterDelete.Body.length +
                      ' Expected response is: ' +
                      (countAllAddonsBeforeDelete.Body.length - 1),
        );

        if (
            mandatoryStepsUpdateAllAddonVersionDataMembers.createAddonVersion == true &&
            mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultDescription == true &&
            mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultAvailable == true &&
            mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultPhased == true &&
            mandatoryStepsUpdateAllAddonVersionDataMembers.updateTestResultPhasedFunction == true &&
            mandatoryStepsUpdateAllAddonVersionDataMembers.deleteTestResult == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Update All Addon Version Data Members Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Update All Addon Version Data Members Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Update Phased Without 'StartPhasedDateTime' Mandatory Field (Negative)
    async function executeUpdatePhasedWithoutMandatoryFieldTest(testName, testDataBody) {
        const mandatoryStepsUpdatePhasedWithoutMandatoryField = {
            createAddonVersion: false,
            FailToUpdateAddonVersion: false,
            deleteTestResult: false,
        };

        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataBody),
            },
        );
        //console.log({ Addon_Created_For_Update_Version_Test: createApiResponse });

        const versionTestDataBody = testDataNewAddonVersion(
            createApiResponse.Body.UUID,
            Math.floor(Math.random() * 1000000).toString(),
        );
        const createVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(versionTestDataBody),
            },
        );
        //console.log({ Get_Var_Addons_Version_Create: createVersionApiResponse });
        mandatoryStepsUpdatePhasedWithoutMandatoryField.createAddonVersion =
            versionTestDataBody.Version == createVersionApiResponse.Body.Version;

        //Update
        const tempNewAddonVersionBody = createVersionApiResponse.Body;
        tempNewAddonVersionBody.Description = 'Update Version Description Test';
        tempNewAddonVersionBody.Available = true;
        tempNewAddonVersionBody.Phased = true;
        tempNewAddonVersionBody.PhasedFunction = 'Update Version PhasedFunction Test';

        const getAdonsVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(tempNewAddonVersionBody),
            },
        );
        //console.log({ Post_Var_Addons_Version_Update: getAdonsVersionApiResponse });

        //console.log({ Get_Var_Addons_Empty_Version_Create_Status_Text: getAdonsVersionApiResponse });
        mandatoryStepsUpdatePhasedWithoutMandatoryField.FailToUpdateAddonVersion = JSON.stringify(
            getAdonsVersionApiResponse,
        ).includes(
            "When changing the Phased field to true the field StartPhasedDateTime is mandatory and can't be null",
        );
        addTestResultUnderHeadline(
            testName,
            "Update Phased Without 'StartPhasedDateTime' Mandatory Field Test",
            mandatoryStepsUpdatePhasedWithoutMandatoryField.FailToUpdateAddonVersion
                ? true
                : 'The response is: ' +
                      JSON.stringify(getAdonsVersionApiResponse) +
                      " Expected response should include error mesage with the text : 'When changing the Phased field to true the field StartPhasedDateTime is mandatory and can't be null",
        );

        //Delete Addon Version
        const deleteVersionApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                '/var/addons/versions/' +
                createVersionApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        if (!deleteVersionApiResponse) {
            //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        }

        //Delete
        const countAllAddonsBeforeDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_Before_Delete: countAllAddonsBeforeDelete });
        const deleteApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.Body.UUID,
            {
                method: `DELETE`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        console.log({ Post_Var_Addons_Delete: deleteApiResponse.Body });
        const countAllAddonsAfterDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        //console.log({ Get_Var_Addons_After_Delete: countAllAddonsAfterDelete });
        mandatoryStepsUpdatePhasedWithoutMandatoryField.deleteTestResult =
            countAllAddonsBeforeDelete.Body.length == countAllAddonsAfterDelete.Body.length + 1;
        addTestResultUnderHeadline(
            testName,
            'Delete Addon Test',
            mandatoryStepsUpdatePhasedWithoutMandatoryField.deleteTestResult
                ? true
                : 'The response is: ' +
                      countAllAddonsAfterDelete.Body.length +
                      ' Expected response is: ' +
                      (countAllAddonsBeforeDelete.Body.length - 1),
        );

        if (
            mandatoryStepsUpdatePhasedWithoutMandatoryField.createAddonVersion == true &&
            mandatoryStepsUpdatePhasedWithoutMandatoryField.FailToUpdateAddonVersion == true &&
            mandatoryStepsUpdatePhasedWithoutMandatoryField.deleteTestResult == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Update All Addon Version Data Members Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Update All Addon Version Data Members Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Creata Test Data Addon Test
    async function executecreataTestDataAddonTest(testName) {
        //Create
        const createApiResponse = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
            {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify({
                    Name: 'Pepperitest Test (Jenkins Special Addon) - Code Jobs',
                    Description: 'Part of Jenkins Tests',
                }),
            },
        );

        const fileAsSBase64Arr: string[] = [];
        const createVersionApiResponseArr: any[] = [];
        //Ver 1
        fileAsSBase64Arr.push(await testDatagetBase64FileFromFileAtPath('./test-data/ver1.js'));

        let versionTestDataBody = {
            AddonUUID: createApiResponse.Body.UUID,
            Version: 'Ver1',
            Files: [{ FileName: 'test.js', URL: '', Base64Content: fileAsSBase64Arr[0] }],
        };
        createVersionApiResponseArr.push(
            await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(versionTestDataBody),
                },
            ),
        );

        //Ver 2
        fileAsSBase64Arr.push(await testDatagetBase64FileFromFileAtPath('./test-data/ver2.js'));
        versionTestDataBody = {
            AddonUUID: createApiResponse.Body.UUID,
            Version: 'Ver2',
            Files: [{ FileName: 'test.js', URL: '', Base64Content: fileAsSBase64Arr[1] }],
        };
        createVersionApiResponseArr.push(
            await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(versionTestDataBody),
                },
            ),
        );

        //Ver 3
        fileAsSBase64Arr.push(await testDatagetBase64FileFromFileAtPath('./test-data/ver3.js'));
        versionTestDataBody = {
            AddonUUID: createApiResponse.Body.UUID,
            Version: 'Ver3',
            Files: [{ FileName: 'test.js', URL: '', Base64Content: fileAsSBase64Arr[2] }],
        };
        createVersionApiResponseArr.push(
            await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(versionTestDataBody),
                },
            ),
        );

        addTestResultUnderHeadline(
            testName,
            'Ver1 Creatred',
            createVersionApiResponseArr[0].Body.Version == 'Ver1'
                ? true
                : 'The Ver1 Creation failed with response of: ' + createVersionApiResponseArr[0],
        );

        addTestResultUnderHeadline(
            testName,
            'Ver1 Creatred',
            createVersionApiResponseArr[1].Body.Version == 'Ver2'
                ? true
                : 'The Ver2 Creation failed with response of: ' + createVersionApiResponseArr[1],
        );

        addTestResultUnderHeadline(
            testName,
            'Ver1 Creatred',
            createVersionApiResponseArr[2].Body.Version == 'Ver3'
                ? true
                : 'The Ver3 Creation failed with response of: ' + createVersionApiResponseArr[2],
        );

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }

    //Test Remove All Wrong Addons and Versions
    //Don't Change it if your name is not Oren Vilderman! (You can delete it if you want)
    async function executeRemoveAllWrongAddonsAndVersions() {
        const getAllAddonsBeforeDelete = await generalService.fetchStatus(
            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons?page_size=-1',
            {
                method: `GET`,
                headers: {
                    Authorization: request.body.varKey,
                },
            },
        );
        for (let index = 0; index < getAllAddonsBeforeDelete.Body.length; index++) {
            if (
                (getAllAddonsBeforeDelete.Body[index].Name.startsWith('Test') &&
                    (getAllAddonsBeforeDelete.Body[index].SystemData == '{}' ||
                        getAllAddonsBeforeDelete.Body[index].SystemData.includes('Version Test')) &&
                    parseInt(getAllAddonsBeforeDelete.Body[index].Name.split(' ')[1]) > 1000) ||
                getAllAddonsBeforeDelete.Body[index].Name.startsWith('Pepperitest Test ')
            ) {
                const deleteApiResponse = await generalService.fetchStatus(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/' +
                        getAllAddonsBeforeDelete.Body[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                );
                console.log('Addone deleted: ' + getAllAddonsBeforeDelete.Body[index].Name);
                console.log({ Post_Var_Addons_Delete: deleteApiResponse.Body });
            }
        }

        //var deleteApiResponse = VarAPI.CallSync('DELETE', "/var/addons/" + getAllInstalledAddonsBeforeDelete[index].Addon.UUID);
        //console.log({ Post_Var_Addons_Delete: deleteApiResponse });
        //var getAuditLogApiResponse = API.CallSync('GET', deleteApiResponse.Body.URI);
        //console.log({ Get_Audit_Log_Uninstall: getAuditLogApiResponse });

        // These are not uninstallable and not deleteable, need to remove from sandbox DB
        // 1bf3e1d6 - 8525 - 4dfc - a72a - 7eb2a0fc0da9
        // 8e04dd10 - 8f39 - 440c - a64d - 72d5dfeab9ba
        // 59496946 - 274e-4164 - 9362 - 861452fab01e
        // 40f45d19 - 1b4e - 4afc - a53f - 85bb7a22c5fb
        // 0d04aefe - 6234 - 44c6 - b5d9 - 3ac11ceb4f6a
        // adfd18db - 9b35 - 459b - ae4a - 9a847e4d0ba4
        // b632044e - a736 - 4528 - a3a3 - dda1aff82a87
        // f1e9c558 - f3a3 - 4d03 - 8a59 - cb3a7d500eba

        generalService;
        const getAllInstalledAddonsBeforeDelete = await generalService.papiClient.get(
            '/addons/installed_addons?page_size=-1',
        );
        for (let index = 0; index < getAllInstalledAddonsBeforeDelete.length; index++) {
            if (
                (getAllInstalledAddonsBeforeDelete[index].Addon != null &&
                    getAllInstalledAddonsBeforeDelete[index].Addon.Name.startsWith('Test') &&
                    getAllInstalledAddonsBeforeDelete[index].Addon.SystemData == '{}' &&
                    parseInt(getAllInstalledAddonsBeforeDelete[index].Addon.Name.split(' ')[1]) > 1) ||
                getAllInstalledAddonsBeforeDelete[index].Addon.Name.startsWith('Pepperitest Test')
            ) {
                //var deleteApiResponse = VarAPI.CallSync('DELETE', "/var/addons/" + getAllInstalledAddonsBeforeDelete[index].Addon.UUID);
                const deleteApiResponse = await generalService.papiClient.post(
                    '/addons/installed_addons/' + getAllInstalledAddonsBeforeDelete[index].Addon.UUID + '/uninstall',
                );
                console.log('Addone deleted: ' + getAllInstalledAddonsBeforeDelete[index].Addon.Name);
                //console.log({ Post_Var_Addons_Delete: deleteApiResponse });
                //const getAuditLogApiResponse =
                await generalService.papiClient.get(deleteApiResponse.Body.URI);
                //console.log({ Get_Audit_Log_Uninstall: getAuditLogApiResponse });
            }
        }

        //Delete Addon Version
        //     var deleteVersionApiResponse = await generalService.fetchStatus(generalService['client'].BaseURL.replace('papi-eu', 'papi') + "/var/addons/versions/" + createVersionApiResponse.Body.UUID, {
        //     method: `DELETE`,
        //     headers: {
        //         Authorization: request.body.varKey,
        //     },
        // }).then((response) => response.Body;
        //     if (!deleteVersionApiResponse) {
        //         //console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        //     }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }
}
