import GeneralService, { TesterFunctions } from '../services/general.service';

export async function DBSchemaTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const assert = tester.assert;
    const expect = tester.expect;
    const it = tester.it;

    const logcash: any = {};
    // const addonJobBody: any = {};
    // const CallbackCash: any = {};
    // const insertBodyRetryTest: any = {};
    // const logDataNoRetry: any = {};
    // const logDataRetry: any = {};
    // const executionLog: any = {};
    // const functionResult: any = {};
    // const addonUUIDWithoutSchema = 'f3e2a0cd-9105-464a-b5b2-f99ff7b84d2b';
    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '7aac5451-2fc7-44d2-99dc-52c592adfb70'
        : '94f08439-6480-4533-8176-a04f651f5fdf';
    const baseURL = generalService['client'].BaseURL;
    const token = generalService['client'].OAuthAccessToken;

    //#region Upgrade ADAL
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.chnageVersion(request.body.varKey, testData, false);
    //#endregion Upgrade ADAL

    describe('ADAL Tests Suites', () => {
        describe('Prerequisites Addon for ADAL Tests', () => {
            //Test Data
            //ADAL
            it('Validate that all the needed addons are installed', async () => {
                isInstalledArr.forEach((isInstalled) => {
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

        describe('Create Schema (Negative)', () => {
            it('Get Empty Schema: Finished', async () => {
                // this will run the first test that will run the second and so on..
                await getSecretKey();
                if (logcash.getEmptySchemaStatus) {
                }
                assert(logcash.getEmptySchemaStatus, logcash.getEmptySchemaError);
            });
            it('Try To Create New Schema Without Mandatory Field <Name>: Finished', () => {
                assert(logcash.createSchemaWithoutNameStatus, logcash.createSchemaWithoutNameError);
            });
        });
        describe('Create schema, Positive And Upsert Data To Dinamo', () => {
            it('Create Scheme With One Mandatory Field Name: Finished', () => {
                assert(logcash.createSchemaWithMandFieldNameStatus, logcash.createSchemaWithMandFieldNameErrorMessage);
            });
            it('Create Scheme With All Parameters: Finished', () => {
                assert(logcash.createSchemaWithPropertiesStatus, logcash.createSchemaWithPropertiesErrorMessage);
            });
            it('Insert Data To Schema With Type meta_data Without OwnerId (Negative): Finished', () => {
                assert(
                    logcash.insertDataToTableWithoutOwnerIDNegativeStatus,
                    logcash.insertDataToTableWithoutOwnerIDNegativeError,
                );
            });
            it('Insert Data To Schema With Type meta_data With OwnerId, Key And One Column Values: Finished', () => {
                assert(logcash.insertDataToTableWithOwnerIDStatus, logcash.insertDataToTableWithOwnerIDError);
            });
            it('Get Data From Table and Compere It From Posted Body: Finished', () => {
                assert(logcash.getDataToTableWithOwnerIDStatus, logcash.getDataToTableWithOwnerIDError);
            });
            it('Upsert Data With Key Created On Previos Test + Insert Values To All Fields: Finished', () => {
                assert(logcash.upsertDataToTableWithOwnerIDStatus, logcash.upsertDataToTableWithOwnerIDError);
            });
            it('Get Data From Table (With Two Objects): Finished', () => {
                assert(logcash.getDataFromTableTwoKeys.Status, logcash.getDataFromTableTwoKeys.Error);
            });
            it('Get Data From Table When One Objects Is Hidden: Finished', () => {
                assert(logcash.getDataFromTableHidden.Status, logcash.getDataFromTableHidden.Error);
            });
            it('Drop Existing Table: Finished', () => {
                assert(logcash.dropExistingTableStatus, logcash.dropExistingTableError);
            });
            it('Drop Deleted Table: Finished', () => {
                assert(logcash.dropDeletedTableStatus, logcash.dropDeletedTableError);
            });
        });
    });

    //get secret key
    async function getSecretKey() {
        logcash.getAuditData = await generalService
            .fetchStatus(baseURL + '/code_jobs/get_data_for_job_execution', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify({
                    JobMessageData: {
                        UUID: '14ca5951-06e6-4f4c-a8fd-92fa243a662c',
                        MessageType: 'AddonMessage',
                        SchemaVersion: 2,
                        DistributorUUID: '547dc30b-bb56-46f7-8c89-864f54402cdb',
                        FunctionPath: 'Addon/Public/fff02926-7aac-467f-8f1b-2ec2154a6bc7/Ver3/test.js',
                        ExecutionMemoryLevel: 4,
                        UserUUID: '3e4d1f14-6760-4c2c-9977-4f438e591c56',
                        NumberOfTry: 1,
                        NumberOfTries: 1,
                        FunctionName: 'ido',
                        StartDateTime: '2020-11-03T11:34:15.916Z',
                        EndDateTime: '2020-11-03T11:34:16.508Z',
                        Request: {
                            path: '/addons/api/async/fff02926-7aac-467f-8f1b-2ec2154a6bc7/test.js/ido',
                            method: 'GET',
                            originalUrl: '/pjobs/addons/api/async/fff02926-7aac-467f-8f1b-2ec2154a6bc7/test.js/ido',
                            query: {},
                            body: null,
                            header: {},
                        },
                        CodeJobUUID: null,
                        CodeJobName: null,
                        CodeJobDescription: null,
                        IsScheduled: false,
                        IsPublished: false,
                        AddonData: {
                            AddonUUID: addonUUID, //"fff02926-7aac-467f-8f1b-2ec2154a6bc7",
                            AddonPath: 'test.js',
                            AddonVersion: null,
                        },
                        CallbackUUID: null,
                    },
                }),
            })
            .then((res) => res.Body);
        //Oren added this to improve logs of failed tests
        try {
            logcash.secretKey = logcash.getAuditData.ClientObject.AddonSecretKey;
        } catch (error) {
            throw new Error(`Fail To Get Addon Secret Key ${error}`);
        }
        //Oren added this to skip insatll after I talked with Oleg, the installADallAddon, upgradADallAddon and getAuditLogInstallStatus functions are suspended for now
        //await installADallAddon();
        await getEmptySchema();
    }

    // async function installADallAddon() {
    //     logcash.installAddonResult = await generalService
    //         .fetchStatus(baseURL + '/addons/installed_addons/00000000-0000-0000-0000-00000000ADA1/install/1.0.94', {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: 'Bearer ' + token,
    //                 'X-Pepperi-OwnerID': addonUUID,
    //                 'X-Pepperi-SecretKey': logcash.secretKey,
    //             },
    //         })
    //         .then((res) => res.Body);

    //     //logcash.installAddonResult.URI
    //     await upgradADallAddon();
    // }

    // async function upgradADallAddon() {
    //     logcash.upgradellAddonResult = await generalService
    //         .fetchStatus(baseURL + '/addons/installed_addons/00000000-0000-0000-0000-00000000ADA1/upgrade/1.0.98', {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: 'Bearer ' + token,
    //                 'X-Pepperi-OwnerID': addonUUID,
    //                 'X-Pepperi-SecretKey': logcash.secretKey,
    //             },
    //         })
    //         .then((res) => res.Body);

    //     //logcash.installAddonResult.URI
    //     await getAuditLogInstallStatus();
    // }

    // async function getAuditLogInstallStatus() {
    //     logcash.getAuditLogInstallStatus = await service.auditLogs.get(logcash.installAddonResult.ExecutionUUID);
    //     //debugger;
    //     if (
    //         logcash.getAuditLogInstallStatus.Status.ID == 1 ||
    //         (logcash.getAuditLogInstallStatus.Status.ID == 0 &&
    //             logcash.getAuditLogInstallStatus.AuditInfo.ErrorMessage == 'Addon already installed')
    //     ) {
    //         logcash.getAuditLogInstallStatusLog = true;
    //     } else {
    //         logcash.getAuditLogInstallStatusLog = false;
    //         logcash.getAuditLogInstallStatusError =
    //             'The install failed . Addon not installed. The auditLog URI is: ' + logcash.getAuditLogInstallStatus;
    //     }
    //     await getEmptySchema();
    // }

    async function getEmptySchema() {
        logcash.getEmptySchema = await generalService
            .fetchStatus(baseURL + '/addons/data/addonUUIDWithoutSchema/test', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.getEmptySchema.fault.faultstring != undefined) {
            if ((logcash.getEmptySchema.fault.faultstring = 'Failed due to exception: Table schema must be exist')) {
                logcash.getEmptySchemaStatus = true;
            } else {
                logcash.getEmptySchemaStatus = false;
                logcash.getEmptySchemaError =
                    'Get empty schema finished with wrong exeption.Will get: Table schema must be exist, but result is: ' +
                    logcash.getEmptySchema.fault.faultstring;
            }
        } else {
            logcash.getEmptySchemaStatus == false;
            logcash.getEmptySchemaError ==
                'Get empty schema finished without exeption.Will get: Table schema must be exist, but result is: ' +
                    logcash.getEmptySchema;
        }
        await createSchemaWithoutName();
    }

    async function createSchemaWithoutName() {
        logcash.createSchemaWithoutName = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.createSchemaWithoutName.fault.faultstring != undefined) {
            //if (logcash.createSchemaWithoutName.fault.faultstring.includes("Cannot read property 'Name' of null") == true) {-- error message changed on 1.0.95
            if (
                logcash.createSchemaWithoutName.fault.faultstring.includes('Required request body is missing') == true
            ) {
                logcash.createSchemaWithoutNameStatus = true;
            } else {
                logcash.createSchemaWithoutNameStatus = false;
                logcash.createSchemaWithoutNameError =
                    'Will get error: Cannot read property <Name> of null, but acctually get:' +
                    logcash.createSchemaWithoutName;
            }
        } else {
            logcash.createSchemaWithoutNameStatus == false;
            logcash.createSchemaWithoutNameError ==
                'Will get error: Cannot read property <Name> of null, but function finished successfully: ' +
                    logcash.createSchemaWithoutName;
        }
        await createSchemaWithMandFieldName();
    }

    async function createSchemaWithMandFieldName() {
        logcash.createSchemaWithMandFieldName = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'CreateSchemaWithMandatoryField ' + Date(),
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaWithMandFieldName.CreationDateTime.includes(new Date().toISOString().split('T')[0]) ==
                true &&
            logcash.createSchemaWithMandFieldName.ModificationDateTime.includes(
                new Date().toISOString().split('T')[0],
            ) == true &&
            logcash.createSchemaWithMandFieldName.Name != '' &&
            logcash.createSchemaWithMandFieldName.Hidden == false &&
            logcash.createSchemaWithMandFieldName.Type == 'meta_data'
        ) {
            logcash.createSchemaWithMandFieldNameStatus = true;
        } else {
            logcash.createSchemaWithMandFieldNameStatus = false;
            logcash.createSchemaWithMandFieldNameErrorMessage =
                'One of parameters on Schema creation get with wrong value: ' + logcash.createSchemaWithMandFieldName;
        }
        await createSchemaWithProperties();
    }

    async function createSchemaWithProperties() {
        logcash.createSchemaWithProperties = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaWithMandFieldName.Name,
                    Type: 'meta_data',
                    Fields: {
                        testString: { Type: 'String' },
                        testBoolean: { Type: 'Bool' },
                        TestInteger: { Type: 'Integer' },
                        TestMultipleStringValues: { Type: 'MultipleStringValues' },
                    },
                    CreationDateTime: '2020-10-08T10:19:00.677Z',
                    ModificationDateTime: '2020-10-08T10:19:00.677Z',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaWithProperties.CreationDateTime ==
                logcash.createSchemaWithMandFieldName.CreationDateTime &&
            logcash.createSchemaWithProperties.ModificationDateTime != '2020-10-08T10:19:00.677Z' &&
            logcash.createSchemaWithProperties.Name == logcash.createSchemaWithMandFieldName.Name &&
            logcash.createSchemaWithProperties.Hidden == false &&
            logcash.createSchemaWithProperties.Type == 'meta_data' &&
            logcash.createSchemaWithProperties.Fields.testBoolean.Type == 'Bool' &&
            logcash.createSchemaWithProperties.Fields.TestInteger.Type == 'Integer' &&
            logcash.createSchemaWithProperties.Fields.testString.Type == 'String' &&
            logcash.createSchemaWithProperties.Fields.TestMultipleStringValues.Type == 'MultipleStringValues'
        ) {
            logcash.createSchemaWithPropertiesStatus = true;
        } else {
            logcash.createSchemaWithPropertiesStatus = false;
            logcash.createSchemaWithPropertiesErrorMessage =
                'One of parameters on Schema updating get with wrong value: ' + logcash.createSchemaWithProperties;
        }
        await insertDataToTableWithoutOwnerIDNegative();
    }

    async function insertDataToTableWithoutOwnerIDNegative() {
        logcash.insertDataToTableWithoutOwnerIDNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID'  : addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testKey1',
                    Column1: ['Value1', 'Value2', 'Value3'],
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.insertDataToTableWithoutOwnerIDNegative.fault.faultstring.includes(
                'Failed due to exception: OwnerUUID is invalid',
            ) == true
        ) {
            logcash.insertDataToTableWithoutOwnerIDNegativeStatus = true;
        } else {
            logcash.insertDataToTableWithoutOwnerIDNegativeStatus = false;
            logcash.insertDataToTableWithoutOwnerIDNegativeError =
                'Insert data to meta_data type without OwnerID will failed , but actually worked: ' +
                logcash.insertDataToTableWithoutOwnerIDNegative;
        }
        await insertDataToTableWithOwnerID();
    }

    async function insertDataToTableWithOwnerID() {
        logcash.insertDataToTableWithOwnerID = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testKey1',
                    Column1: ['Value1', 'Value2', 'Value3'],
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.insertDataToTableWithOwnerID.Column1[0] == 'Value1' &&
            logcash.insertDataToTableWithOwnerID.Column1[1] == 'Value2' &&
            logcash.insertDataToTableWithOwnerID.Column1[2] == 'Value3' &&
            logcash.insertDataToTableWithOwnerID.CreationDateTime ==
                logcash.insertDataToTableWithOwnerID.ModificationDateTime &&
            logcash.insertDataToTableWithOwnerID.Key == 'testKey1'
        ) {
            logcash.insertDataToTableWithOwnerIDStatus = true;
        } else {
            logcash.insertDataToTableWithOwnerIDStatus = false;
            logcash.insertDataToTableWithOwnerIDError =
                'One of parameters is wrong: ' + logcash.insertDataToTableWithOwnerID;
        }
        await getDataToTableWithOwnerID();
    }

    async function getDataToTableWithOwnerID() {
        logcash.getDataToTableWithOwnerIDStatus = true;
        logcash.getDataToTableWithOwnerID = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        for (const key in logcash.getDataToTableWithOwnerID[0]) {
            if (key == 'Column1') {
                for (let index = 0; index < logcash.getDataToTableWithOwnerID[0].Column1.length; index++) {
                    if (
                        logcash.getDataToTableWithOwnerID[0].Column1[index] !=
                        logcash.insertDataToTableWithOwnerID[key][index]
                    ) {
                        logcash.getDataToTableWithOwnerIDStatus = false;
                        logcash.getDataToTableWithOwnerIDError =
                            'Objects (fields data) between POST body and get is different.Post result is: ' +
                            logcash.insertDataToTableWithOwnerID +
                            'Get result: ' +
                            logcash.getDataToTableWithOwnerID;
                    }
                }
            } else {
                if (logcash.insertDataToTableWithOwnerID[key] != logcash.getDataToTableWithOwnerID[0][key]) {
                    logcash.getDataToTableWithOwnerIDStatus = false;
                    logcash.getDataToTableWithOwnerIDError =
                        'Objects (fields data) between POST body and get is different.Post result is: ' +
                        logcash.insertDataToTableWithOwnerID +
                        'Get result: ' +
                        logcash.getDataToTableWithOwnerID;
                }
            }
        }
        //debugger;
        await upsertDataToTableWithOwnerID();
    }

    async function upsertDataToTableWithOwnerID() {
        logcash.upsertDataToTableWithOwnerID = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testKey1',
                    Column1: ['Value1-2', 'Value2-2'],
                    testString: ['string1', 'String2'],
                    testBoolean: [true, false],
                    TestInteger: 4,
                    TestMultipleStringValues: [
                        [1, 2, 3],
                        ['a', 'b', 'c'],
                    ],
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.upsertDataToTableWithOwnerID.Column1[0] == 'Value1-2' &&
            logcash.upsertDataToTableWithOwnerID.Column1[1] == 'Value2-2' &&
            logcash.upsertDataToTableWithOwnerID.Column1.length == 2 &&
            logcash.upsertDataToTableWithOwnerID.CreationDateTime ==
                logcash.insertDataToTableWithOwnerID.ModificationDateTime &&
            logcash.upsertDataToTableWithOwnerID.Key == 'testKey1' &&
            logcash.upsertDataToTableWithOwnerID.testString[0] == 'string1' &&
            logcash.upsertDataToTableWithOwnerID.testString.length == 2 &&
            logcash.upsertDataToTableWithOwnerID.testBoolean[0] == true &&
            logcash.upsertDataToTableWithOwnerID.testBoolean[1] == false &&
            logcash.upsertDataToTableWithOwnerID.testBoolean.length == 2 &&
            logcash.upsertDataToTableWithOwnerID.TestInteger == 4 &&
            logcash.upsertDataToTableWithOwnerID.TestMultipleStringValues.length == 2 &&
            logcash.upsertDataToTableWithOwnerID.TestMultipleStringValues[0][0] == 1 &&
            logcash.upsertDataToTableWithOwnerID.TestMultipleStringValues[0][1] == 2 &&
            logcash.upsertDataToTableWithOwnerID.TestMultipleStringValues[0][2] == 3 &&
            logcash.upsertDataToTableWithOwnerID.TestMultipleStringValues[1][0] == 'a' &&
            logcash.upsertDataToTableWithOwnerID.TestMultipleStringValues[1][1] == 'b' &&
            logcash.upsertDataToTableWithOwnerID.TestMultipleStringValues[1][2] == 'c'
        ) {
            logcash.upsertDataToTableWithOwnerIDStatus = true;
        } else {
            logcash.upsertDataToTableWithOwnerIDStatus = false;
            logcash.upsertDataToTableWithOwnerIDError =
                'One of parameters is wrong: ' + logcash.upsertDataToTableWithOwnerID;
        }
        await upsertDataToSameTableWithAnotherKey();
    }

    async function upsertDataToSameTableWithAnotherKey() {
        logcash.upsertDataToSameTableWithAnotherKey = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testKey2',
                    Column1: 'Value2-2',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.upsertDataToSameTableWithAnotherKey.Column1 == 'Value2-2' &&
            logcash.upsertDataToSameTableWithAnotherKey.CreationDateTime ==
                logcash.upsertDataToSameTableWithAnotherKey.ModificationDateTime &&
            logcash.upsertDataToSameTableWithAnotherKey.Key == 'testKey2'
        ) {
            logcash.upsertDataToSameTableWithAnotherKeyStatus = true;
        } else {
            logcash.upsertDataToSameTableWithAnotherKeyStatus = false;
            logcash.upsertDataToSameTableWithAnotherKeyError =
                'One of parameters is wrong (Key2 data set verification)): ' +
                logcash.upsertDataToSameTableWithAnotherKey;
        }
        await getDataFromTableTwoKeys();
    }

    async function getDataFromTableTwoKeys() {
        //logcash.getDataFromTableTwoKeystatus = true;
        logcash.getDataFromTableTwoKeys = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDataFromTableTwoKeys.length == 2 &&
            logcash.getDataFromTableTwoKeys[1].CreationDateTime ==
                logcash.upsertDataToSameTableWithAnotherKey.CreationDateTime &&
            logcash.getDataFromTableTwoKeys[0].CreationDateTime == logcash.upsertDataToTableWithOwnerID.CreationDateTime
        ) {
            logcash.getDataFromTableTwoKeys.Status = true;
        } else {
            logcash.getDataFromTableTwoKeys.Status = false;
            logcash.getDataFromTableTwoKeys.Error =
                'will get 2 object , but actual result is: ' + logcash.getDataFromTableTwoKeys;
        }
        //debugger;
        await changeHiddenToTrue();
    }

    async function changeHiddenToTrue() {
        logcash.changeHiddenToTrue = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testKey2',
                    Hidden: true,
                }),
            })
            .then((res) => res.Body);
        //debugger;
        await getDataFromTableHidden();
    }

    async function getDataFromTableHidden() {
        //logcash.getDataFromTableTwoKeystatus = true;
        logcash.getDataFromTableHidden = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.getDataFromTableHidden.length == 1) {
            logcash.getDataFromTableHidden.Status = true;
        } else {
            logcash.getDataFromTableHidden.Status = false;
            logcash.getDataFromTableHidden.Error =
                'Result will be one object, and not: ' + logcash.getDataFromTableHidden;
        }
        await dropExistingTable();
    }

    //#region drop table testing
    async function dropExistingTable() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge',
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
            logcash.dropExistingTableStatus = true;
        } else {
            logcash.dropExistingTableStatus = false;
            logcash.dropExistingTableError =
                'Drop schema failed. Error message is: ' + logcash.dropExistingTable.faultstring;
        }
        await dropDeletedTable();
    }

    async function dropDeletedTable() {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge',
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
        if (res.Ok == false) {
            logcash.dropDeletedTableStatus = true;
        } else {
            logcash.dropDeletedTableStatus = false;
            logcash.dropDeletedTableError =
                'Drop schema negative test failed.A message is: ' + logcash.dropExistingTable.faultstring;
        }
    }
    //#endregion drop table testin
}
