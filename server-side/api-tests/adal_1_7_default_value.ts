import GeneralService, { TesterFunctions } from '../services/general.service';
//import { DateTime } from '../ui-tests/pom/Pages/StorybookComponents/DateTime';
//import { v4 as newUuid } from 'uuid';
//import { Fields } from '@pepperi-addons/papi-sdk/dist/endpoints';

export async function AdalDefaultValuesTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const assert = tester.assert;
    const expect = tester.expect;
    const it = tester.it;

    // const whaitOwnerUUID = '2c199913-dba2-4533-ad78-747b6553acf8';
    // const whaitSecretKey = '55cd2b56-2def-4e4e-b461-a56eb3e31689';
    // const adalOwnerId = '00000000-0000-0000-0000-00000000ada1';

    const logcash: any = {};
    logcash.randomInt = Math.floor(1000 + Math.random() * 9000);
    //logcash.Date = generalService.getDate();
    logcash.DateTime = new Date();

    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const baseURL = generalService['client'].BaseURL;
    const token = generalService['client'].OAuthAccessToken;

    //#region Upgrade ADAL
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, '0.0.1'],
        training: ['2c199913-dba2-4533-ad78-747b6553acf8', '0.0.12'],
        Logs: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', ''],
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
    //#endregion Upgrade ADAL
    //debugger;
    //const chnageVersionResponseArr1 = await generalService.chnageVersion(varKey, testData, false);
    //#region Mocha
    describe('ADAL 1.7 + default values Tests Suites', () => {
        describe('Prerequisites Addon for ADAL_type_data Tests', () => {
            //Test Data
            //ADAL
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

        describe('Default values test - ADAL 1.7', () => {
            it('Test Initiation', async () => {
                // this will run the first test that will run the second and so on..Its test initiation
                await getSecretKey();
            });
            it('Create Schema with fields with default values', async () => {
                assert(logcash.createSchemaDefaultValueStatus, logcash.createSchemaDefaultValueErrorMessage);
            });
            it('Insert 2 objects', () => {
                assert(logcash.insertObjectsStatus, logcash.insertObjectsError);
            });
            it('Get data and verify defaultValues', () => {
                assert(logcash.getDataTableOrderByKeyStatus, logcash.getDataTableOrderByKeyError);
            });
            it('Upsert fields with owerwrite false', () => {
                assert(logcash.upsertObjectsStatus, logcash.upsertObjectsError);
            });
            it('Get data and verify values after update', () => {
                assert(logcash.getDataTableOrderByKeyUpdatedStatus, logcash.getDataTableOrderByKeyUpdatedError);
            });
            it('Upsert data with owerwrite true. The will be updeted to default values', () => {
                assert(logcash.upsertObjectsOwerwriteTrueStatus, logcash.upsertObjectsOwerwriteTrueError);
            });
            it('Get data after update wuth owewrite true', () => {
                assert(logcash.getDataTableOrderByKeyUpdatedSecStatus, logcash.getDataTableOrderByKeyUpdatedSecError);
            });
            it('Truncate data', () => {
                assert(logcash.truncateTestTableLastStatus, logcash.truncateTestTableLastError);
            });
            it('Drop created schema', () => {
                assert(logcash.dropTableSecStatus, logcash.dropTableSecError);
            });
        });
    });

    //get secret key
    async function getSecretKey() {
        //Oren added this to improve logs of failed tests
        try {
            logcash.secretKey = await generalService.getSecretKey(addonUUID, varKey);
        } catch (error) {
            throw new Error(`Fail To Get Addon Secret Key ${error}`);
        }
        //Oren added this to skip insatll after I talked with Oleg, the installADallAddon, upgradADallAddon and getAuditLogInstallStatus functions are suspended for now
        //await installADallAddon();
        await createSchemaDefaultValue();
    }

    async function createSchemaDefaultValue() {
        logcash.createSchemaWithMandFieldName = 'adalDefaultValueTest_' + logcash.randomInt;
        //debugger;
        logcash.createSchemaDefaultValue = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaWithMandFieldName,
                    Type: 'data',
                    Fields: {
                        TestInteger: { Type: 'Integer', DefaultValue: 5 },
                        TestString: { Type: 'String', DefaultValue: 'DefaultVAlue test' },
                        TestBoolean: { Type: 'Bool', DefaultValue: true },
                        TestBoolean1: { Type: 'Bool', DefaultValue: false },
                        TestDate: { Type: 'DateTime', DefaultValue: logcash.DateTime },
                        TestDouble: { Type: 'Double', DefaultValue: 10.5 },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaDefaultValue.Name == logcash.createSchemaWithMandFieldName &&
            logcash.createSchemaDefaultValue.Hidden == false &&
            logcash.createSchemaDefaultValue.Type == 'data' &&
            logcash.createSchemaDefaultValue.Fields.TestInteger.Type == 'Integer' &&
            logcash.createSchemaDefaultValue.Fields.TestInteger.DefaultValue == 5 &&
            logcash.createSchemaDefaultValue.Fields.TestString.Type == 'String' &&
            logcash.createSchemaDefaultValue.Fields.TestString.DefaultValue == 'DefaultVAlue test' &&
            logcash.createSchemaDefaultValue.Fields.TestBoolean.Type == 'Bool' &&
            logcash.createSchemaDefaultValue.Fields.TestBoolean1.Type == 'Bool'
        ) {
            logcash.createSchemaDefaultValueStatus = true;
        } else {
            logcash.createSchemaDefaultValueStatus = false;
            logcash.createSchemaDefaultValueErrorMessage =
                'One of parameters on Schema updating get with wrong value: ' + logcash.createSchemaDefaultValue;
        }
        await insertObjects();
    }

    // async function insertDataToTable() {
    //         logcash.insertDataToTable = await generalService
    //             .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName, {
    //                 method: 'POST',
    //                 headers: {
    //                     Authorization: 'Bearer ' + token,
    //                     //'X-Pepperi-OwnerID': addonUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
    //                     'X-Pepperi-SecretKey': logcash.secretKey,
    //                 },
    //                 body: JSON.stringify({
    //                     Key: '1',
    //                 }),
    //             })
    //             .then((res) => [res.Status, res.Body]);
    //         //debugger;
    //         //Failed due to exception: Table schema must exist, for table
    //         if (logcash.insertDataToTable[0] == 200) {
    //             logcash.insertDataToTableStatus = true;
    //         } else {
    //             logcash.insertDataToTableStatus = false;
    //             logcash.insertDataToTableError = 'Insert data failed';
    //         }
    //     //debugger;
    //     generalService.sleep(1000);
    //     await getDataTableOrderByKey();
    // }

    async function insertObjects() {
        const num = 2;
        logcash.num = num;
        // const tst = 0;
        // let tst1 = 0;
        const object = createObjects(num);
        logcash.insertObjects = await generalService
            .fetchStatus(baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },

                body: JSON.stringify({
                    Objects: object,
                    //'Overwrite': false
                }),
            })
            .then((res) => res.Body);
        //countNum++;
        //debugger;
        if (logcash.insertObjects.length == num) {
            logcash.insertObjectsStatus = true;
        } else {
            (logcash.insertObjectsStatus = false), (logcash.insertObjectsError = 'Batch upsert failed');
        }
        await getDataTableOrderByKey();
    }

    async function getDataTableOrderByKey() {
        logcash.getDataTableOrderByKey = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithMandFieldName +
                    '?order_by=Key&page_size=-1', //desc
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDataTableOrderByKey.length == logcash.num &&
            logcash.getDataTableOrderByKey[0].Key == 'value0' &&
            logcash.getDataTableOrderByKey[0].TestBoolean == true &&
            logcash.getDataTableOrderByKey[0].TestBoolean1 == false &&
            JSON.stringify(logcash.getDataTableOrderByKey[0].TestDate) == JSON.stringify(logcash.DateTime) &&
            logcash.getDataTableOrderByKey[0].TestDouble == 10.5 &&
            logcash.getDataTableOrderByKey[0].TestInteger == 5 &&
            logcash.getDataTableOrderByKey[0].TestString == 'DefaultVAlue test' &&
            logcash.getDataTableOrderByKey[1].Key == 'value1' &&
            logcash.getDataTableOrderByKey[1].TestBoolean == true &&
            JSON.stringify(logcash.getDataTableOrderByKey[1].TestDate) == JSON.stringify(logcash.DateTime) &&
            logcash.getDataTableOrderByKey[1].TestDouble == 10.5 &&
            logcash.getDataTableOrderByKey[1].TestInteger == 5 &&
            logcash.getDataTableOrderByKey[1].TestString == 'DefaultVAlue test'
        ) {
            logcash.getDataTableOrderByKeyStatus = true;
        } else {
            logcash.getDataTableOrderByKeyStatus = false;
            logcash.getDataTableOrderByKeyError = 'Wrong data on GET :' + logcash.getDataTableOrderByKey.length;
        }
        await upsertObjects();
    }

    async function upsertObjects() {
        // const num = 1;
        // logcash.num = num;
        //const object = createObjects2(num);
        logcash.upsertObjects = await generalService
            .fetchStatus(baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },

                body: JSON.stringify({
                    Objects: [
                        {
                            Key: logcash.getDataTableOrderByKey[0].Key,
                            TestBoolean: false,
                            TestDate: new Date(),
                            TestDouble: 21.9,
                            TestInteger: 11,
                            TestString: 'NotDefaultVAlue test',
                        },
                        {
                            Key: logcash.getDataTableOrderByKey[1].Key,
                        },
                    ],
                    //'Overwrite': false
                    //OverwriteObject: true,
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.upsertObjects.length == 2) {
            logcash.upsertObjectsStatus = true;
        } else {
            (logcash.upsertObjectsStatus = false), (logcash.upsertObjectsError = 'Batch upsert failed');
        }
        await getDataTableOrderByKeyUpdated();
    }

    async function getDataTableOrderByKeyUpdated() {
        logcash.getDataTableOrderByKeyUpdated = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithMandFieldName +
                    '?order_by=Key&page_size=-1', //desc
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDataTableOrderByKeyUpdated[0].Key == 'value0' &&
            logcash.getDataTableOrderByKeyUpdated[0].TestBoolean == false &&
            JSON.stringify(logcash.getDataTableOrderByKeyUpdated[0].TestDate) != JSON.stringify(logcash.DateTime) &&
            logcash.getDataTableOrderByKeyUpdated[0].TestDouble == 21.9 &&
            logcash.getDataTableOrderByKeyUpdated[0].TestInteger == 11 &&
            logcash.getDataTableOrderByKeyUpdated[0].TestString == 'NotDefaultVAlue test' &&
            logcash.getDataTableOrderByKeyUpdated[1].Key == 'value1' &&
            logcash.getDataTableOrderByKeyUpdated[1].TestBoolean == true &&
            JSON.stringify(logcash.getDataTableOrderByKeyUpdated[1].TestDate) == JSON.stringify(logcash.DateTime) &&
            logcash.getDataTableOrderByKeyUpdated[1].TestDouble == 10.5 &&
            logcash.getDataTableOrderByKeyUpdated[1].TestInteger == 5 &&
            logcash.getDataTableOrderByKeyUpdated[1].TestString == 'DefaultVAlue test'
        ) {
            logcash.getDataTableOrderByKeyUpdatedStatus = true;
        } else {
            logcash.getDataTableOrderByKeyUpdatedStatus = false;
            logcash.getDataTableOrderByKeyUpdatedError = 'Wrong data on GET after upsert with owerwrite false';
        }
        await upsertObjectsOwerwriteTrue();
    }

    async function upsertObjectsOwerwriteTrue() {
        //const num = 1;
        //logcash.num = num;
        //const object = createObjects2(num);
        logcash.upsertObjectsOwerwriteTrue = await generalService
            .fetchStatus(baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },

                body: JSON.stringify({
                    Objects: [
                        {
                            Key: logcash.getDataTableOrderByKey[0].Key,
                        },
                        {
                            Key: logcash.getDataTableOrderByKey[1].Key,
                            TestBoolean: false,
                            TestDate: new Date(),
                            TestDouble: 21.9,
                            TestInteger: 11,
                            TestString: 'NotDefaultVAlue test',
                        },
                    ],
                    //'Overwrite': false
                    WriteMode: 'Overwrite',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.upsertObjectsOwerwriteTrue.length == 2) {
            logcash.upsertObjectsOwerwriteTrueStatus = true;
        } else {
            (logcash.upsertObjectsOwerwriteTrueStatus = false),
                (logcash.upsertObjectsOwerwriteTrueError = 'Batch upsert failed');
        }
        await getDataTableOrderByKeyUpdatedSec();
    }

    async function getDataTableOrderByKeyUpdatedSec() {
        logcash.getDataTableOrderByKeyUpdatedSec = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithMandFieldName +
                    '?order_by=Key&page_size=-1', //desc
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDataTableOrderByKeyUpdatedSec[0].Key == 'value0' &&
            logcash.getDataTableOrderByKeyUpdatedSec[1].TestBoolean == false &&
            JSON.stringify(logcash.getDataTableOrderByKeyUpdatedSec[1].TestDate) != JSON.stringify(logcash.DateTime) &&
            logcash.getDataTableOrderByKeyUpdatedSec[1].TestDouble == 21.9 &&
            logcash.getDataTableOrderByKeyUpdatedSec[1].TestInteger == 11 &&
            logcash.getDataTableOrderByKeyUpdatedSec[1].TestString == 'NotDefaultVAlue test' &&
            logcash.getDataTableOrderByKeyUpdatedSec[1].Key == 'value1' &&
            logcash.getDataTableOrderByKeyUpdatedSec[0].TestBoolean == true &&
            JSON.stringify(logcash.getDataTableOrderByKeyUpdatedSec[0].TestDate) == JSON.stringify(logcash.DateTime) &&
            logcash.getDataTableOrderByKeyUpdatedSec[0].TestDouble == 10.5 &&
            logcash.getDataTableOrderByKeyUpdatedSec[0].TestInteger == 5 &&
            logcash.getDataTableOrderByKeyUpdatedSec[0].TestString == 'DefaultVAlue test'
        ) {
            logcash.getDataTableOrderByKeyUpdatedSecStatus = true;
        } else {
            logcash.getDataTableOrderByKeyUpdatedSecStatus = false;
            logcash.getDataTableOrderByKeyUpdatedSecError = 'Wrong data on GET after upsert with owerwrite true';
        }
        await truncateTestTableLast();
    }

    async function truncateTestTableLast() {
        const res6 = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName + '/truncate',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            },
        );
        //debugger;
        if (res6.Ok && res6.Status == 200) {
            logcash.truncateTestTableLastStatus = true;
            logcash.res6 = res6.Body.URI;
        } else {
            logcash.truncateTestTableLastStatus = false;
            logcash.truncateTestTableLastError = 'Truncate table failed.';
            await dropTableSec();
        }
        await dropTableSec();
    }

    // async function exLog() {
    //     const executionURI = logcash.res6;
    //     logcash.exLog = await generalService.getAuditLogResultObjectIfValid(executionURI as string, 250, 7000);
    //     // debugger;
    //     if (
    //         logcash.exLog.Status.ID == 1 &&
    //         JSON.parse(logcash.exLog.AuditInfo.ResultObject).ProcessedCounter == 100000
    //     ) {
    //         logcash.truncateTestTableLastStatus = true;
    //     } else {
    //         logcash.truncateTestTableLastStatus = false;
    //         logcash.truncateTestTableLastError = 'Truncate table failed.';
    //     }

    //     await dropTableSec();
    // }

    async function dropTableSec() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            },
        ); //.then((data) => data.json())
        //debugger;

        //if(logcash.dropExistingTable.success == true){
        if (res.Ok) {
            logcash.dropTableSecStatus = true;
        } else {
            logcash.dropTableSecStatus = false;
            logcash.dropTableSecError = 'Drop schema failed. Error message is: ' + logcash.dropTableSec;
        }
        //generalService.sleep(20000);
        //await getDataDedicatedAfterDrop();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    function createObjects(num) {
        // create inserts unique key:value

        const array: { Key: string }[] = [];
        for (let index = 0; index < num; index++) {
            array[index] = {
                Key: 'value' + index,
            };
        }
        return array;
    }

    // function createObjects2(num) {
    //     // create inserts unique key:value
    //     const array: { Key: string,TestBoolean: Boolean,TestDate: Date,TestDouble: Number,TestInteger: Number, TestString:String}[] = [];
    //     for (let index = 0; index < num; index++) {
    //         array[index] = {
    //             Key: logcash.getDataTableOrderByKey[0].Key,
    //             TestBoolean: false,
    //             TestDate: new Date(),
    //             TestDouble: 21.9,
    //             TestInteger: 11,
    //             TestString: 'NotDefaultVAlue test'}
    //     }
    //     return array;
    // }
}
