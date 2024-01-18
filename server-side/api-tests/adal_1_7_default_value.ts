import GeneralService, { TesterFunctions } from '../services/general.service';
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
    logcash.DateTime = generalService.getDate();

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

        describe('Create Schema and insert 100K objects (just 5 not hidden objects on the end of list) -> search not hidden docs an truncate all data on the end of test', () => {
            it('Test Initiation', async () => {
                // this will run the first test that will run the second and so on..Its test initiation
                await getSecretKey();
            });
            it('Create Schema', async () => {
                assert(logcash.createSchemaWithPropertiesStatus, logcash.createSchemaWithPropertiesErrorMessage);
            });
            it('Insert 100K objects', () => {
                assert(logcash.insert500ObjectsStatus, logcash.add50InsertsToTableOverwriteFalseError);
            });
            it('Search not hidden objects', () => {
                assert(logcash.getDataNotHiddenStatus, logcash.getDataNotHiddenError);
            });
            it('Trancate created data', () => {
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
                        TestBoolean: { Type: 'Bool', DefaultValue: false },
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
            logcash.createSchemaDefaultValue.Fields.TestString.DefaultValue == 'DefaultVAlue test'){
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
            //logcash.insert500ObjectsStatus = true;
        } else {
            (logcash.insertObjectsStatus = false),
                (logcash.insertObjectsError = 'Batch upsert failed');
        }
        await getDataTableOrderByKey();
    }

    async function getDataTableOrderByKey() {
        logcash.getDataTableOrderByKey = await generalService
            .fetchStatus(
                baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName + '?order_by=Key&page_size=-1', //desc
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
        debugger;
        if (
            logcash.getDataTableOrderByKey.length == logcash.num
        ) {
            logcash.getDataTableOrderByKeyStatus = true;
        } else {
            logcash.getDataTableOrderByKeyStatus = false;
            logcash.getDataTableOrderByKeyError =
                'Wrong data on GET :' +
                logcash.getDataTableOrderByKey.length;
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
        if (res6.Ok && res6.Status == 200 && res6.Body.ExecutionUUID) {
            logcash.truncateTestTableLastStatus = true;
            logcash.res6 = res6.Body.URI;
        } else {
            logcash.truncateTestTableLastStatus = false;
            logcash.truncateTestTableLastError = 'Truncate table failed.';
            await dropTableSec();
        }
        await exLog();
    }

    async function exLog() {
        const executionURI = logcash.res6;
        logcash.exLog = await generalService.getAuditLogResultObjectIfValid(executionURI as string, 250, 7000);
        // debugger;
        if (
            logcash.exLog.Status.ID == 1 &&
            JSON.parse(logcash.exLog.AuditInfo.ResultObject).ProcessedCounter == 100000
        ) {
            logcash.truncateTestTableLastStatus = true;
        } else {
            logcash.truncateTestTableLastStatus = false;
            logcash.truncateTestTableLastError = 'Truncate table failed.';
        }

        await dropTableSec();
    }

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

        const array: { Key: string;}[] = [];
        for (let index = 0; index < num; index++) {
            array[index] = {
                Key: 'value' + index,
            };
        }
        return array;
    }
   
}
