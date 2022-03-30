import GeneralService, { TesterFunctions } from '../services/general.service';

export async function DBSchemaTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const assert = tester.assert;
    const expect = tester.expect;
    const it = tester.it;

    const logcash: any = {};
    let counter = 0;
    //const keyCounter = 0;
    //const DataField = [];
    // const addonJobBody: any = {};
    // const CallbackCash: any = {};
    // const insertBodyRetryTest: any = {};
    // const logDataNoRetry: any = {};
    // const logDataRetry: any = {};
    // const executionLog: any = {};
    // const functionResult: any = {};
    // const addonUUIDWithoutSchema = 'f3e2a0cd-9105-464a-b5b2-f99ff7b84d2b';
    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const baseURL = generalService['client'].BaseURL;
    const token = generalService['client'].OAuthAccessToken;

    //#region Upgrade ADAL
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''], // 22-08-21 changed to last phased version 1.0.131. To run on last phased version will be empty
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, '0.0.1'],
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
            it('Test Initiation', async () => {
                // this will run the first test that will run the second and so on..Its test initiation
                await getSecretKey();
            });
            it('Get Empty Schema: Finished', async () => {
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
        describe('CPI_Meta_Data testing (Negative)', () => {
            it('Create schema with type CPI_meta_data', async () => {
                assert(
                    logcash.createSchemaWithTypeCPIMetadataStatus,
                    logcash.createSchemaWithTypeCPIMetadataErrorMessage,
                );
            });
            it('Insert data to created schema: Finished', () => {
                assert(logcash.insertDataToCPIMetaDataTableStatus, logcash.insertDataToCPIMetaDataTableError);
            });
            it('Get data by API and compare values between insert and get data: Finished', () => {
                assert(logcash.getDataFromCPIMetaDataTableStatus, logcash.getDataFromCPIMetaDataTableError);
            });
            it('Get data from created UDT table and compare values btween UDT and API results: Finished', () => {
                assert(logcash.getDataFromUDTTableStatus, logcash.getDataFromUDTTableError);
            });
        });
        describe('indexed_data schema functionality testing (Negative and Positive)', () => {
            it('Create schema with type indexed_data and add on indexed string colum', async () => {
                assert(
                    logcash.createSchemaWithIndexedDataTypeStatus,
                    logcash.createSchemaWithIndexedDataTypeErrorMessage,
                );
            });
            it('Negative: try to add two indexed integer fields', () => {
                assert(
                    logcash.updateSchemaTwoIndexedInstegerNegativeStatus,
                    logcash.updateSchemaTwoIndexedInstegerNegativeError,
                );
            });
            it('Change integer column to indexed string : Finished', () => {
                assert(logcash.updateSchemaAddIndexToStringStatus, logcash.updateSchemaAddIndexToStringErrorMessage);
            });
            it('Negative: try to add to indexed string columns(one new , and one updated from standard): Finished', () => {
                assert(
                    logcash.updateSchemaTwoIndexedStringsNegativeStatus,
                    logcash.updateSchemaTwoIndexedStringsNegativeError,
                );
            });
            it('Add two indexed columns (string and intger)', async () => {
                assert(
                    logcash.updateSchemaAddIndexStringAndNumStatus,
                    logcash.updateSchemaAddIndexStringAndNumErrorMessage,
                );
            });

            it('Negative : try change indexed column: Finished', () => {
                assert(
                    logcash.updateSchemaTryToChangeIndexedFieldNegativeStatus,
                    logcash.updateSchemaTryToChangeIndexedFieldNegativeError,
                );
            });
            //////////////////////////////////////////////////////////////////
            it('Insert data to indexed table : Finished', () => {
                assert(logcash.insertDataToIndexedTableFirst100Status, logcash.insertDataToIndexedTableFirst100Error);
            });
            it('Order by indexed field : finished', async () => {
                assert(logcash.getDataFromIndexedDataStatus, logcash.getDataFromIndexedDataError);
            });

            it('Negative : Order by not indexed field: Finished', () => {
                assert(logcash.getDataFromIndexedDataNegativeStatus, logcash.getDataFromIndexedDataNegativeError);
            });
            it('Where clause by indexed integer field: Finished, result: ' + logcash.totalTimeIndexed, () => {
                assert(logcash.getDataFromIndexedDataWhereClauseStatus, logcash.getDataFromIndexedDataWhereClauseError);
            });
            it('Where clause by NOT indexed integer field: Finished, result: ' + logcash.totalTimeNotIndexed, () => {
                assert(
                    logcash.getDataFromNotIndexedDataWhereClauseStatus,
                    logcash.getDataFromNotIndexedDataWhereClauseError,
                );
            });
        });

        describe('Single Hard Delete Data functionality(Negative and Positive)', () => {
            it('Negative: try to delete not hidden object', async () => {
                assert(logcash.hardDeleteOnNotHiddenNegativeStatus, logcash.hardDeleteOnNotHiddenNegativeError);
            });
            it('Hard Delete hidden object(meta_data type)', () => {
                assert(logcash.hardDeleteOnHiddenStatus, logcash.hardDeleteOnHiddenError);
            });
            it('Get data after hard_delete (verification after delete include hidden objects)', () => {
                assert(logcash.getDataFromTableIncludeHidden.Status, logcash.getDataFromTableIncludeHidden.Error);
            });
            it('Force Hard_delete on not hidden object', async () => {
                assert(logcash.hardDeleteForceStatus, logcash.hardDeleteForceError);
            });
            it('Get data after force hard_delete (verification after force delete include hidden objects)', () => {
                assert(
                    logcash.getDataFromTableIncludeHiddenAfterForce.Status,
                    logcash.getDataFromTableIncludeHiddenAfterForce.Error,
                );
            });
        });
        describe('Data Table, where clause testing on 199 objects', () => {
            it('Where clause on first value', async () => {
                assert(logcash.getDataFromDataTableWhereClouseStatus, logcash.getDataFromDataTableWhereClouseError);
            });
            it('Where clause on second value', () => {
                assert(
                    logcash.getDataFromDataTableWhereClouseSecStatus,
                    logcash.getDataFromDataTableWhereClouseSecError,
                );
            });
            it('Drop table ', () => {
                assert(logcash.dropTableDataStatus, logcash.dropTableDataError);
            });
        });
        describe('DateTime  filed verification (where clause with = and >=)', () => {
            it('Where clause on =', async () => {
                assert(logcash.getDataTimeFieldVerificationStatus, logcash.getDataTimeFieldVerificationError);
            });
            it('Where clause on >=', () => {
                assert(logcash.getDataTimeFieldVerificationSecStatus, logcash.getDataTimeFieldVerificationSecError);
            });
            it('Where clause on KEY LIKE on meta_data', () => {
                assert(
                    logcash.getDataFromTableKeyWhereClauseLikeStatus,
                    logcash.getDataFromTableKeyWhereClauseLikeError,
                );
            });
        });

        describe('ExpirationDateTime tests', () => {
            it('Default value (30 days) after hidden updated to true', async () => {
                assert(logcash.updateSchemaExpirationDateTimeStatus, logcash.updateSchemaExpirationDateTimeError);
            });
            it('ExpirationDateTime value  removed fter hidden updated to false', () => {
                assert(
                    logcash.updateSchemaExpirationDateTimeUnhiddeStatus,
                    logcash.updateSchemaExpirationDateTimeUnhiddeError,
                );
            });
            it('Update ExpirationDateTime manually (hidden = false) ', () => {
                assert(
                    logcash.updateSchemaExpirationDateTimeSetValueExpDateStatus,
                    logcash.updateSchemaExpirationDateTimeSetValueExpDateError,
                );
            });
            it('ExpirationDateTime Verification after updating hidden = true', () => {
                assert(
                    logcash.updateSchemaExpirationDateTimeHideStatus,
                    logcash.updateSchemaExpirationDateTimeHideError,
                );
            });
            it('ExpirationDateTime Verification after updating hidden = false ', () => {
                assert(
                    logcash.updateSchemaExpirationDateTimeUnhiddeSecStatus,
                    logcash.updateSchemaExpirationDateTimeUnhiddeSecError,
                );
            });
        });
        describe('Hidden automatic update , after property changes', () => {
            it('Updating property column1 on hidden = true object finished, the hidden changed to false', async () => {
                assert(
                    logcash.updateSchemaExpirationDateTimeUnhiddeStatus,
                    logcash.updateSchemaExpirationDateTimeUnhiddeError,
                );
            });
        });
        describe('querying a property of type Integer with !=', () => {
            it('querying a property of type Integer with !=', async () => {
                assert(
                    logcash.getDataFromTableTwoKeysWhereClause.Status,
                    logcash.getDataFromTableTwoKeysWhereClause.Error,
                );
            });
        });
        describe('where on key parameter return exception (DI-17519)', () => {
            it('where clause by Key', async () => {
                assert(logcash.getDataFromTableKeyWhereClause.Status, logcash.getDataFromTableKeyWhereClause.Error);
            });
        });

        describe('where clause with LIKE', () => {
            it('where clause by Key', async () => {
                assert(logcash.getDataFromCPIMetaDataTableSecStatus, logcash.getDataFromCPIMetaDataTableSecError);
            });
        });
    });

    //#endregion Mocha

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
                        FunctionPath: 'Addon/Public/fff02926-7aac-467f-8f1b-2ec2154a6bc7/0.0.3/test.js',
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
    //#region Schema creation
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
            if (
                logcash.getEmptySchema.fault.faultstring.includes('Failed due to exception: Table schema must exist') ==
                true
            ) {
                logcash.getEmptySchemaStatus = true;
            } else {
                logcash.getEmptySchemaStatus = false;
                logcash.getEmptySchemaError =
                    'Get empty schema finished with wrong exeption.Will get: Table schema must exist, but result is: ' +
                    logcash.getEmptySchema;
            }
        } else {
            logcash.getEmptySchemaStatus == false;
            logcash.getEmptySchemaError ==
                'Get empty schema finished without exeption.Will get: Table schema must exist, but result is: ' +
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
            //debugger;
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
    //#endregion Schema creation
    //#region Insert/upsert data
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
                    testString: ['string2-1', 'String2-2'], //added string,bulean,int,multi data on 19-05-21 to test hard_delete on meta data type
                    testBoolean: [true, false],
                    TestInteger: 14,
                    TestMultipleStringValues: [
                        [11, 12, 13],
                        ['d', 'e', 'f'],
                    ],
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
        //await changeHiddenToTrue();
        await getDataFromTableTwoKeysWhereClause();
    }

    async function getDataFromTableTwoKeysWhereClause() {
        //logcash.getDataFromTableTwoKeystatus = true;
        logcash.getDataFromTableTwoKeysWhereClause = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithMandFieldName.Name +
                    '?where=TestInteger!=14',
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
            logcash.getDataFromTableTwoKeysWhereClause.length == 1 &&
            logcash.getDataFromTableTwoKeysWhereClause[0].TestInteger == 4
        ) {
            logcash.getDataFromTableTwoKeysWhereClause.Status = true;
        } else {
            logcash.getDataFromTableTwoKeysWhereClause.Status = false;
            logcash.getDataFromTableTwoKeysWhereClause.Error =
                'will get 1 object after where clausu with != 14, but actual result is: ' +
                logcash.getDataFromTableTwoKeysWhereClause;
        }
        //debugger;
        //await changeHiddenToTrue();
        await getDataFromTableKeyWhereClause();
    }

    async function getDataFromTableKeyWhereClause() {
        //logcash.getDataFromTableTwoKeystatus = true;
        logcash.getDataFromTableKeyWhereClause = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithMandFieldName.Name +
                    "?where=Key='testKey2'",
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
            logcash.getDataFromTableKeyWhereClause.length == 1 &&
            logcash.getDataFromTableKeyWhereClause[0].TestInteger == 14
        ) {
            logcash.getDataFromTableKeyWhereClause.Status = true;
        } else {
            logcash.getDataFromTableKeyWhereClause.Status = false;
            logcash.getDataFromTableKeyWhereClause.Error =
                'will get 1 object after where clause with Key value, but actual result is: ' +
                logcash.getDataFromTableKeyWhereClause;
        }
        //debugger;
        //await changeHiddenToTrue();
        await getDataFromTableKeyWhereClauseLike();
    }

    async function getDataFromTableKeyWhereClauseLike() {
        //logcash.getDataFromTableTwoKeystatus = true;
        logcash.getDataFromTableKeyWhereClauseLike = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithMandFieldName.Name +
                    "?where=Key LIKE 'testKey2%25'",
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
            logcash.getDataFromTableKeyWhereClauseLike.length == 1 &&
            logcash.getDataFromTableKeyWhereClauseLike[0].TestInteger == 14
        ) {
            logcash.getDataFromTableKeyWhereClauseLikeStatus = true;
        } else {
            logcash.getDataFromTableKeyWhereClauseLikeStatus = false;

            logcash.getDataFromTableKeyWhereClauseLikeError =
                'will get 1 object after where clause with Key value, but actual result is ' +
                logcash.getDataFromTableKeyWhereClauseLike.length;
        }
        //debugger;
        //await changeHiddenToTrue();
        await hardDeleteOnNotHiddenNegative();
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////Negative : hard delete before change key to hidden/////////////////////////////////////////////////
    async function hardDeleteOnNotHiddenNegative() {
        logcash.hardDeleteOnNotHiddenNegative = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithMandFieldName.Name +
                    '/' +
                    'testKey2' +
                    '/hard_delete',
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    // body: JSON.stringify({
                    //     Key: 'testKey2',
                    //     Hidden: true,
                    // }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (logcash.hardDeleteOnNotHiddenNegative.fault.faultstring != undefined) {
            if (
                logcash.hardDeleteOnNotHiddenNegative.fault.faultstring.includes('Cannot delete non hidden items') ==
                true
            ) {
                logcash.hardDeleteOnNotHiddenNegativeStatus = true;
            } else {
                logcash.hardDeleteOnNotHiddenNegativeStatus = false;
                logcash.hardDeleteOnNotHiddenNegativeError =
                    'Hard delete will fail becouse object is not hidden, but actually not';
            }
        } else {
            logcash.hardDeleteOnNotHiddenNegativeStatus == false;
            //debugger;
            logcash.hardDeleteOnNotHiddenNegativeError ==
                'Hard delete will fail becouse object is not hidden, but actually get  ' +
                    logcash.hardDeleteOnNotHiddenNegative;
        }
        await changeHiddenToTrue();
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            //debugger;
            logcash.getDataFromTableHidden.Error =
                'Result will be one object, and not: ' + logcash.getDataFromTableHidden;
        }
        await hardDeleteOnHidden();
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////Negative: hard delete with another OwnerID        /////////////////////////////////////////////////
    //not running before bug https://pepperi.atlassian.net/browse/DI-18158 is closed
    // async function hardDeleteOnHiddenWithWrongOwnerIdNegative() {
    //     logcash.hardDeleteOnHiddenWithWrongOwnerIdNegative = await generalService
    //         .fetchStatus(
    //             baseURL +
    //                 '/addons/data/' +
    //                 addonUUID +
    //                 '/' +
    //                 logcash.createSchemaWithMandFieldName.Name +
    //                 '/' +
    //                 'testKey2' +
    //                 '/hard_delete',
    //             {
    //                 method: 'POST',
    //                 headers: {
    //                     Authorization: 'Bearer ' + token,
    //                     'X-Pepperi-OwnerID': '7aac5451-2fc7-44d2-99dc-52c592adfb71',
    //                     'X-Pepperi-SecretKey': logcash.secretKey,
    //                 },
    //                 // body: JSON.stringify({
    //                 //     Key: 'testKey2',
    //                 //     Hidden: true,
    //                 // }),
    //             },
    //         )
    //         .then((res) => [res.Body,res.Status]);
    //     //debugger;
    //     if (logcash.hardDeleteOnHiddenWithWrongOwnerIdNegative.fault.faultstring != undefined) {
    //         if (
    //             logcash.hardDeleteOnHiddenWithWrongOwnerIdNegative.fault.faultstring.includes('') ==
    //             true
    //         ) {
    //             logcash.hardDeleteOnHiddenWithWrongOwnerIdNegativeStatus = true;
    //         } else {
    //             logcash.hardDeleteOnHiddenWithWrongOwnerIdNegativeStatus = false;
    //             logcash.hardDeleteOnHiddenWithWrongOwnerIdNegativeError =
    //                 'Hard delete will fail becouse OwnerID is wrong, but actually not';
    //         }
    //     } else {
    //         logcash.hardDeleteOnHiddenWithWrongOwnerIdNegativeStatus == false;
    //         logcash.hardDeleteOnHiddenWithWrongOwnerIdNegativeError ==
    //             'Hard delete will fail becouse OwnerID is wrong, but actually get  ' +
    //                 logcash.hardDeleteOnHiddenWithWrongOwnerIdNegative;
    //     }
    //     //await dropExistingTable();
    // }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////Positive: hard delete hidden object 'testKey2'       /////////////////////////////////////////////////
    async function hardDeleteOnHidden() {
        logcash.hardDeleteOnHidden = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithMandFieldName.Name +
                    '/' +
                    'testKey2' +
                    '/hard_delete',
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    // body: JSON.stringify({
                    //     Key: 'testKey2',
                    //     Hidden: true,
                    // }),
                },
            )
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.hardDeleteOnHidden[0] == 200) {
            logcash.hardDeleteOnHiddenStatus = true;
        } else {
            logcash.hardDeleteOnHiddenStatus == false;
            logcash.hardDeleteOnHiddenError == 'Hard delete failed ' + logcash.hardDeleteOnHidden[0];
        }
        await getDataFromTableIncludeHidden();
    }

    async function getDataFromTableIncludeHidden() {
        //logcash.getDataFromTableTwoKeystatus = true;
        logcash.getDataFromTableIncludeHidden = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithMandFieldName.Name +
                    '?include_deleted=true',
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
        if (logcash.getDataFromTableIncludeHidden.length == 1) {
            logcash.getDataFromTableIncludeHidden.Status = true;
        } else {
            logcash.getDataFromTableIncludeHidden.Status = false;
            logcash.getDataFromTableIncludeHidden.Error =
                'Result will be one object, the hard_delete function is failed: ' +
                logcash.getDataFromTableIncludeHidden;
        }
        await hardDeleteForce();
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////Force hard_delete//////////////////////////////////////////////////////////////////////////
    async function hardDeleteForce() {
        logcash.hardDeleteForce = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithMandFieldName.Name +
                    '/' +
                    'testKey1' +
                    '/hard_delete',
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Force: true,
                    }),
                },
            )
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.hardDeleteForce[0] == 200) {
            logcash.hardDeleteForceStatus = true;
        } else {
            logcash.hardDeleteForceStatus == false;
            logcash.hardDeleteForceError == 'Force Hard delete failed ' + logcash.hardDeleteForce[0];
        }
        await getDataFromTableIncludeHiddenAfterForce();
    }

    async function getDataFromTableIncludeHiddenAfterForce() {
        //logcash.getDataFromTableTwoKeystatus = true;
        //debugger;
        logcash.getDataFromTableIncludeHiddenAfterForce = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithMandFieldName.Name +
                    '?include_deleted=true',
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
        if (logcash.getDataFromTableIncludeHiddenAfterForce.length == 0) {
            logcash.getDataFromTableIncludeHiddenAfterForce.Status = true;
        } else {
            logcash.getDataFromTableIncludeHiddenAfterForce.Status = false;
            //debugger;
            logcash.getDataFromTableIncludeHiddenAfterForce.Error =
                'Result will be one object, the hard_delete function is failed: ' +
                logcash.getDataFromTableIncludeHiddenAfterForce;
        }
        await dropExistingTable();
    }
    //#endregion Insert/upsert data
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
            logcash.dropExistingTableError = 'Drop schema failed. Error message is: ' + logcash.dropExistingTable;
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
                'Drop schema negative test failed.A message is: ' + logcash.dropExistingTable;
        }
        //debugger;
        await createSchemaWithTypeCPIMetadata();
    }
    //#endregion drop table testing

    //#region CPI_metadata testing (will add drop table on the end of test when it developed)

    async function createSchemaWithTypeCPIMetadata() {
        logcash.createSchemaWithTypeCPIMetadata = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    //Name: 'createSchemaWithTypeCPIMetadata ' + Date(),
                    Name: 'createSchemaWithTypeCPIMetadata' + new Date().getTime(),
                    Type: 'cpi_meta_data',
                    Fields: {
                        testString: { Type: 'String' },
                        TestInteger: { Type: 'Integer' },
                    }, // from build 1.0.119 create fields on cpi_meta_data not supported.from build 1.0.197 we can add fields to cpi_meta_data
                    CreationDateTime: '2020-10-08T10:19:00.677Z',
                    ModificationDateTime: '2020-10-08T10:19:00.677Z',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaWithTypeCPIMetadata.ModificationDateTime != '2020-10-08T10:19:00.677Z' &&
            logcash.createSchemaWithTypeCPIMetadata.Hidden == false &&
            logcash.createSchemaWithTypeCPIMetadata.Type == 'cpi_meta_data' &&

            logcash.createSchemaWithTypeCPIMetadata.Fields.TestInteger.Type == 'Integer' &&
            logcash.createSchemaWithTypeCPIMetadata.Fields.testString.Type == 'String'
        ) {
            logcash.createSchemaWithTypeCPIMetadataStatus = true;
        } else {
            logcash.createSchemaWithTypeCPIMetadataStatus = false;
            logcash.createSchemaWithTypeCPIMetadataErrorMessage =
                'One of parameters on Schema creation get with wrong value: ' + logcash.createSchemaWithTypeCPIMetadata;
        }
        await insertDataToCPIMetaDataTable();
    }

    async function insertDataToCPIMetaDataTable() {
        logcash.insertDataToCPIMetaDataTable = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithTypeCPIMetadata.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testKey3',
                    Column1: ['Value4', 'Value5', 'Value6'],
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.insertDataToCPIMetaDataTable.Column1[0] == 'Value4' &&
            logcash.insertDataToCPIMetaDataTable.Column1[1] == 'Value5' &&
            logcash.insertDataToCPIMetaDataTable.Column1[2] == 'Value6' &&
            logcash.insertDataToCPIMetaDataTable.Key == 'testKey3'
        ) {
            logcash.insertDataToCPIMetaDataTableStatus = true;
        } else {
            logcash.insertDataToCPIMetaDataTableStatus = false;
            logcash.insertDataToCPIMetaDataTableError =
                'One of parameters is wrong: ' + logcash.insertDataToCPIMetaDataTable;
        }
        await getDataFromCPIMetaDataTable();
    }

    async function getDataFromCPIMetaDataTable() {
        logcash.getDataFromCPIMetaDataTableStatus = true;
        logcash.getDataFromCPIMetaDataTable = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithTypeCPIMetadata.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        for (const key in logcash.getDataFromCPIMetaDataTable[0]) {
            if (key == 'Column1') {
                for (let index = 0; index < logcash.getDataFromCPIMetaDataTable[0].Column1.length; index++) {
                    if (
                        logcash.getDataFromCPIMetaDataTable[0].Column1[index] !=
                        logcash.insertDataToCPIMetaDataTable[key][index]
                    ) {
                        logcash.getDataFromCPIMetaDataTableStatus = false;
                        logcash.getDataFromCPIMetaDataTableError =
                            'Objects (fields data) between POST body and get is different.Post result is: ' +
                            logcash.insertDataToCPIMetaDataTable +
                            'Get result: ' +
                            logcash.getDataFromCPIMetaDataTable;
                    }
                }
            } else {
                if (logcash.insertDataToCPIMetaDataTable[key] != logcash.getDataFromCPIMetaDataTable[0][key]) {
                    logcash.getDataFromCPIMetaDataTableStatus = false;
                    logcash.getDataFromCPIMetaDataTableError =
                        'Objects (fields data) between POST body and get is different.Post result is: ' +
                        logcash.insertDataToCPIMetaDataTable +
                        'Get result: ' +
                        logcash.getDataFromCPIMetaDataTable;
                }
            }
            //debugger;
        }

        await getDataFromUDTTable();
    }

    async function getDataFromUDTTable() {
        logcash.getDataFromUDTTable = await generalService
            .fetchStatus(
                baseURL +
                    "/user_defined_tables?where=MainKey='" +
                    addonUUID +
                    '_' +
                    logcash.createSchemaWithTypeCPIMetadata.Name +
                    "'",
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        // 'X-Pepperi-OwnerID': addonUUID,
                        // 'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        logcash.getDataFromUDTTableTmp = JSON.parse(logcash.getDataFromUDTTable[0].Values).Column1;
        if (
            logcash.getDataFromUDTTable[0].CreationDateTime ==
                logcash.getDataFromCPIMetaDataTable[0].CreationDateTime &&
            logcash.getDataFromUDTTable[0].Hidden == logcash.getDataFromCPIMetaDataTable[0].Hidden &&
            logcash.getDataFromUDTTable[0].ModificationDateTime ==
                logcash.getDataFromCPIMetaDataTable[0].ModificationDateTime &&
            logcash.getDataFromUDTTable[0].SecondaryKey == logcash.getDataFromCPIMetaDataTable[0].Key &&
            logcash.getDataFromUDTTableTmp[0] == logcash.getDataFromCPIMetaDataTable[0].Column1[0] &&
            logcash.getDataFromUDTTableTmp[1] == logcash.getDataFromCPIMetaDataTable[0].Column1[1] &&
            logcash.getDataFromUDTTableTmp[2] == logcash.getDataFromCPIMetaDataTable[0].Column1[2]
        ) {
            logcash.getDataFromUDTTableStatus = true;
        } else {
            //debugger;
            logcash.getDataFromUDTTableStatus = false;
            logcash.getDataFromUDTTableError =
                'Created UDT table data with name ' +
                logcash.getDataFromUDTTable[0].MainKey +
                'is not equale to API data ' +
                logcash.getDataFromCPIMetaDataTable[0];
        }
        await createSchemaWithIndexedDataType();
    }
    //#endregion CPI_metadata

    //#region indexed_data: schema creation  functionality test

    async function createSchemaWithIndexedDataType() {
        logcash.createSchemaWithIndexedDataType = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'createSchemaWithIndexedDataType' + new Date().getTime(),
                    Type: 'indexed_data',
                    Fields: {
                        IndexedString1: { Type: 'String', Indexed: true },
                        Field1: { Type: 'String' },
                        Field2: { Type: 'String' },
                        Field3: { Type: 'String' },
                        Field4: { Type: 'String' },
                        Field5: { Type: 'Integer' },
                        Field6: { Type: 'Integer' },
                        Field7: { Type: 'Integer' },
                        Field8: { Type: 'Integer' },
                    },
                    CreationDateTime: '2020-10-08T10:19:00.677Z',
                    ModificationDateTime: '2020-10-08T10:19:00.677Z',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaWithIndexedDataType.CreationDateTime != '2020-10-08T10:19:00.677Z' &&
            logcash.createSchemaWithIndexedDataType.ModificationDateTime != '2020-10-08T10:19:00.677Z' &&
            logcash.createSchemaWithIndexedDataType.Hidden == false &&
            logcash.createSchemaWithIndexedDataType.Type == 'indexed_data' &&
            logcash.createSchemaWithIndexedDataType.Fields.IndexedString1.Type == 'String' &&
            logcash.createSchemaWithIndexedDataType.Fields.IndexedString1.Indexed == true
        ) {
            logcash.createSchemaWithIndexedDataTypeStatus = true;
        } else {
            logcash.createSchemaWithIndexedDataTypeStatus = false;
            logcash.createSchemaWithIndexedDataTypeErrorMessage =
                'One of parameters on Schema creation get with wrong value: ' + logcash.createSchemaWithIndexedDataType;
        }
        await updateSchemaTwoIndexedInstegerNegative();
    }

    async function updateSchemaTwoIndexedInstegerNegative() {
        logcash.updateSchemaTwoIndexedInstegerNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaWithIndexedDataType.Name,
                    //Type: 'indexed_data',
                    Fields: {
                        IndexedInt1_willFail: { Type: 'Integer', Indexed: true },
                        IndexedInt2_willFail: { Type: 'Integer', Indexed: true }, //try to create two indexed integer fields.
                    },
                    CreationDateTime: '2020-10-08T10:19:00.677Z',
                    ModificationDateTime: '2020-10-08T10:19:00.677Z',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.updateSchemaTwoIndexedInstegerNegative.fault.faultstring != undefined) {
            if (
                logcash.updateSchemaTwoIndexedInstegerNegative.fault.faultstring.includes('failed with status: 400') ==
                true
            ) {
                logcash.updateSchemaTwoIndexedInstegerNegativeStatus = true;
            } else {
                logcash.updateSchemaTwoIndexedInstegerNegativeStatus = false;
                logcash.updateSchemaTwoIndexedInstegerNegativeError =
                    'The schema update with two indexed integer fileld will fail, but actually not';
            }
        } else {
            logcash.updateSchemaTwoIndexedInstegerNegativeStatus == false;
            logcash.updateSchemaTwoIndexedInstegerNegativeError ==
                'The schema update with two indexed integer fileld will fail, but actually get  ' +
                    logcash.updateSchemaTwoIndexedInstegerNegative;
        }
        await updateSchemaAddIndexToString();
    }

    async function updateSchemaAddIndexToString() {
        //positive: change field by type Int to indexed String
        logcash.updateSchemaAddIndexToString = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaWithIndexedDataType.Name,
                    Fields: {
                        // IndexedString1: { Type: 'String', Indexed: true },
                        // Field1: { Type: 'String'},
                        // Field2: { Type: 'String'},
                        // Field3: { Type: 'String'},
                        // Field4: { Type: 'String'},
                        // Field5: { Type: 'Integer'},
                        // Field6: { Type: 'Integer'},
                        // Field7: { Type: 'Integer'},
                        Field8: { Type: 'String', Indexed: true },
                    },
                    CreationDateTime: '2020-10-08T10:19:00.677Z',
                    ModificationDateTime: '2020-10-08T10:19:00.677Z',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.updateSchemaAddIndexToString.CreationDateTime ==
                logcash.createSchemaWithIndexedDataType.CreationDateTime &&
            logcash.updateSchemaAddIndexToString.ModificationDateTime != '2020-10-08T10:19:00.677Z' &&
            logcash.updateSchemaAddIndexToString.Hidden == false &&
            logcash.updateSchemaAddIndexToString.Type == 'indexed_data' &&
            logcash.updateSchemaAddIndexToString.Fields.Field8.Type == 'String' &&
            logcash.updateSchemaAddIndexToString.Fields.Field8.Indexed == true
        ) {
            logcash.updateSchemaAddIndexToStringStatus = true;
        } else {
            logcash.updateSchemaAddIndexToStringStatus = false;
            logcash.updateSchemaAddIndexToStringErrorMessage =
                'One of parameters on Schema creation get with wrong value: ' + logcash.updateSchemaAddIndexToString;
        }
        await updateSchemaTwoIndexedStringsNegative();
    }

    async function updateSchemaTwoIndexedStringsNegative() {
        // try to add 1 indexed string and update one standard filed to indexed string. Will fail (can create just 3 indexed string fields)
        logcash.updateSchemaTwoIndexedStringsNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaWithIndexedDataType.Name,
                    //Type: 'indexed_data',
                    Fields: {
                        IndexedString1_willFail: { Type: 'String', Indexed: true },
                        Field7: { Type: 'String', Indexed: true },
                    },
                    CreationDateTime: '2020-10-08T10:19:00.677Z',
                    ModificationDateTime: '2020-10-08T10:19:00.677Z',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.updateSchemaTwoIndexedStringsNegative.fault.faultstring != undefined) {
            if (
                logcash.updateSchemaTwoIndexedStringsNegative.fault.faultstring.includes('Failed due to exception:') ==
                true
            ) {
                logcash.updateSchemaTwoIndexedStringsNegativeStatus = true;
            } else {
                logcash.updateSchemaTwoIndexedStringsNegativeStatus = false;
                logcash.updateSchemaTwoIndexedStringsNegativeError =
                    'The schema update with two indexed string fileld will fail(because we have 2 indexed strung fields before), but actually not';
            }
        } else {
            logcash.updateSchemaTwoIndexedStringsNegativeStatus == false;
            logcash.updateSchemaTwoIndexedStringsNegativeError ==
                'The schema update with two indexed string fileld will fail(because we have 2 indexed strung fields before), but actually get  ' +
                    logcash.updateSchemaTwoIndexedStringsNegative;
        }
        await updateSchemaAddIndexStringAndNum();
    }

    async function updateSchemaAddIndexStringAndNum() {
        //positive: change field by type Int to indexed String
        logcash.updateSchemaAddIndexStringAndNum = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaWithIndexedDataType.Name,
                    Fields: {
                        // IndexedString1: { Type: 'String', Indexed: true },
                        Field1: { Type: 'Integer' },
                        Field2: { Type: 'String' },
                        // Field3: { Type: 'String'},
                        // Field4: { Type: 'String'},
                        // Field5: { Type: 'Integer'},
                        // Field6: { Type: 'Integer'},
                        // Field7: { Type: 'Integer'},
                        IndexedString2: { Type: 'String', Indexed: true },
                        IndexedInt1: { Type: 'Integer', Indexed: true },
                    },
                    CreationDateTime: '2020-10-08T10:19:00.677Z',
                    ModificationDateTime: '2020-10-08T10:19:00.677Z',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.updateSchemaAddIndexStringAndNum.CreationDateTime ==
                logcash.createSchemaWithIndexedDataType.CreationDateTime &&
            logcash.updateSchemaAddIndexStringAndNum.ModificationDateTime != '2020-10-08T10:19:00.677Z' &&
            logcash.updateSchemaAddIndexStringAndNum.Hidden == false &&
            logcash.updateSchemaAddIndexStringAndNum.Type == 'indexed_data' &&
            // logcash.updateSchemaAddIndexStringAndNum.Fields.Field8.Type == 'String' &&
            // logcash.updateSchemaAddIndexStringAndNum.Fields.Field8.Indexed == true &&
            // logcash.updateSchemaAddIndexStringAndNum.Fields.Field7.Type == 'Integer' &&
            logcash.updateSchemaAddIndexStringAndNum.Fields.IndexedString2.Type == 'String' &&
            logcash.updateSchemaAddIndexStringAndNum.Fields.IndexedString2.Indexed == true &&
            logcash.updateSchemaAddIndexStringAndNum.Fields.IndexedInt1.Type == 'Integer' &&
            logcash.updateSchemaAddIndexStringAndNum.Fields.IndexedInt1.Indexed == true
        ) {
            logcash.updateSchemaAddIndexStringAndNumStatus = true;
        } else {
            logcash.updateSchemaAddIndexStringAndNumStatus = false;
            logcash.updateSchemaAddIndexStringAndNumErrorMessage =
                'One of parameters on Schema creation get with wrong value: ' +
                logcash.updateSchemaAddIndexStringAndNum;
        }
        await updateSchemaTryToChangeIndexedFieldNegative();
    }

    async function updateSchemaTryToChangeIndexedFieldNegative() {
        // try to add 1 indexed string and update one standard filed to indexed string. Will fail (can create just 3 indexed string fields)
        logcash.updateSchemaTryToChangeIndexedFieldNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaWithIndexedDataType.Name,
                    //Type: 'indexed_data',
                    Fields: {
                        IndexedString1: { Type: 'String' },
                    },
                    CreationDateTime: '2020-10-08T10:19:00.677Z',
                    ModificationDateTime: '2020-10-08T10:19:00.677Z',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        //
        if (logcash.updateSchemaTryToChangeIndexedFieldNegative.CreationDateTime != undefined) {
            logcash.updateSchemaTryToChangeIndexedFieldNegativeStatus == false;
            logcash.updateSchemaTryToChangeIndexedFieldNegativeError ==
                'The indexed field <IndexedString1> update will fail, but actually changed';
        }
        // else {
        //     logcash.updateSchemaTryToChangeIndexedFieldNegativeStatus = true;
        // }
        else {
            if (
                logcash.updateSchemaTryToChangeIndexedFieldNegative.fault.faultstring.includes(
                    'Index cannot be modified/removed',
                ) == true
            ) {
                logcash.updateSchemaTryToChangeIndexedFieldNegativeStatus = true;
            } else {
                logcash.updateSchemaTryToChangeIndexedFieldNegativeStatus = false;
                logcash.updateSchemaTryToChangeIndexedFieldNegativeError =
                    'The indexed field <IndexedString1> update fail, but we get wrong exeption :' +
                    logcash.updateSchemaTryToChangeIndexedFieldNegative.fault.faultstring;
            }
        }
        await insertDataToIndexedTableFirst100();
    }
    //#endregion schema creation  functionality test
    //#region insert data to indexed table + order by and where clause tests

    async function insertDataToIndexedTableFirst100() {
        for (counter; counter < 300; counter++) {
            logcash.randomInt = Math.floor(Math.random() * 5);
            logcash.insertDataToIndexedTableFirst100 = await generalService
                .fetchStatus(
                    baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithIndexedDataType.Name,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + token,
                            //'X-Pepperi-OwnerID': addonUUID,
                            'X-Pepperi-SecretKey': logcash.secretKey,
                        },
                        body: JSON.stringify({
                            Key: 'indexedTest ' + counter,
                            IndexedInt1: logcash.randomInt, //counter,
                            IndexedString1: 'IndexedString1-' + counter,
                            IndexedString2: 'IndexedString2-' + counter,
                            Field8: 'Stress1 ' + new Date(),
                            Field1: logcash.randomInt, //counter,
                            Field2: 'String1-' + counter,
                        }),
                    },
                )
                .then((res) => [res.Status, res.Body]);
            //debugger;
            if (logcash.insertDataToIndexedTableFirst100[0] == 200) {
                logcash.insertDataToIndexedTableFirst100Status = true;
            } else {
                logcash.insertDataToIndexedTableFirst100Status = false;
                logcash.insertDataToIndexedTableFirst100Error = 'Insert data failed on try number: ' + counter;
            }
        }
        counter = 0;
        //debugger;
        await getDataFromIndexedData();
    }

    async function getDataFromIndexedData() {
        logcash.getDataFromIndexedData = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithIndexedDataType.Name +
                    '?order_by=IndexedString1&page_size=-1', //desc
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
            logcash.getDataFromIndexedData.length == 300 &&
            logcash.getDataFromIndexedData[12].Field2 == 'String1-109' &&
            logcash.getDataFromIndexedData[189].Field2 == 'String1-269'
        ) {
            logcash.getDataFromIndexedDataStatus = true;
        } else {
            logcash.getDataFromIndexedDataStatus = false;
            logcash.getDataFromIndexedDataError =
                'The get wit order_by result is wrong.Will get 300 objects but result is :' +
                logcash.getDataFromDataTableWhereClouse.length;
        }
        logcash.count = 0;
        for (counter; counter < 300; counter++) {
            if (logcash.getDataFromIndexedData[counter].IndexedInt1 == 4) {
                logcash.count++;
            }
        }
        counter = 0;
        await getDataFromIndexedDataNegative();
    }

    async function getDataFromIndexedDataNegative() {
        logcash.getDataFromIndexedDataNegative = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithIndexedDataType.Name +
                    '?order_by=Field2&page_size=-1', //desc
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
        if (logcash.getDataFromIndexedDataNegative.fault != undefined) {
            if (
                logcash.getDataFromIndexedDataNegative.fault.faultstring.includes(
                    'Failed due to exception: Order by using non indexed parameter is invalid, requested index = undefined',
                )
            ) {
                logcash.getDataFromIndexedDataNegativeStatus = true;
            } else {
                logcash.getDataFromIndexedDataNegativeStatus = false;
                logcash.getDataFromIndexedDataNegativeError = 'The error message is wrong';
            }
        } else {
            logcash.getDataFromIndexedDataNegativeStatus = false;
            logcash.getDataFromIndexedDataNegativeError = 'Order_by not indexed field will fail , but actuall worked';
        }

        await getDataFromIndexedDataWhereClause();
    }

    async function getDataFromIndexedDataWhereClause() {
        logcash.startTimeIndexed = new Date().getTime();
        logcash.getDataFromIndexedDataWhereClause = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithIndexedDataType.Name +
                    '?order_by=IndexedInt1&where=IndexedInt1=4', //&page_size=-1',  //desc
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                        'X-Pepperi-ActionID': '26f69441-1ed4-4dd1-86d2-beb75e69725d',
                    },
                },
            )
            .then((res) => res.Body);
        logcash.endTimeIndexed = new Date().getTime();

        //debugger;
        logcash.totalTimeIndexed = logcash.endTimeIndexed - logcash.startTimeIndexed;
        if (logcash.getDataFromIndexedDataWhereClause.length == logcash.count) {
            logcash.getDataFromIndexedDataWhereClauseStatus = true;
        } else {
            logcash.getDataFromIndexedDataWhereClauseStatus = false;
            logcash.getDataFromIndexedDataWhereClauseError =
                'The get with where clause by indexed integer result is wrong.Will get ' +
                logcash.count +
                ' objects but result is :' +
                logcash.getDataFromIndexedDataWhereClause.length;
        }
        await getDataFromNotIndexedDataWhereClause();
    }

    async function getDataFromNotIndexedDataWhereClause() {
        logcash.startTimeNotIndexed = new Date().getTime();
        logcash.getDataFromNotIndexedDataWhereClause = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithIndexedDataType.Name +
                    '?where=Field1=4', //&page_size=-1',  //desc
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                        'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                },
            )
            .then((res) => res.Body);
        logcash.endTimeNotIndexed = new Date().getTime();

        //debugger;
        logcash.totalTimeNotIndexed = logcash.endTimeNotIndexed - logcash.startTimeNotIndexed;
        if (logcash.getDataFromNotIndexedDataWhereClause.length == logcash.getDataFromIndexedDataWhereClause.length) {
            if (logcash.totalTimeNotIndexed - logcash.totalTimeIndexed > 20) {
                logcash.getDataFromNotIndexedDataWhereClauseStatus = true;
            } else {
                logcash.getDataFromNotIndexedDataWhereClauseStatus = false;
                logcash.getDataFromNotIndexedDataWhereClauseError =
                    'where clause on indexed field and NOT indexed field is to small to 100 msec (on 100 inseret rows). On indexed field its take ' +
                    logcash.totalTimeIndexed +
                    ' msec, and on not indexed :' +
                    logcash.totalTimeNotIndexed +
                    ' msec';
            }
        } else {
            logcash.getDataFromNotIndexedDataWhereClauseStatus = false;
            logcash.getDataFromNotIndexedDataWhereClauseError =
                'The get with where clause by NOT indexed integer result is wrong.Will get 89 objects but result is :' +
                logcash.getDataFromNotIndexedDataWhereClause.length;
        }
        await dropTableIndexed();
    }

    //#endregion insert data to indexed table
    async function dropTableIndexed() {
        // the drop table function will be moved after indexed_table data verification when code is ready
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaWithIndexedDataType.Name + '/purge',
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
            logcash.dropTableIndexedStatus = true;
        } else {
            logcash.dropTableIndexedStatus = false;
            logcash.dropTableIndexedError = 'Drop schema failed. Error message is: ' + logcash.dropTableIndexed;
        }
        await createSchemaTypeData();
    }

    //#region  200 object creation (100 objects with property1 and 100 - property2), and where clouse on one of properties
    async function createSchemaTypeData() {
        logcash.createSchemaTypeData = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'createSchemaTypeData' + new Date().getTime(),
                    Type: 'data',
                    Fields: {
                        Field1: { Type: 'DateTime' },
                        Field2: { Type: 'String' },
                        Field3: { Type: 'String' },
                        Field4: { Type: 'String' },
                        Field5: { Type: 'Double' },
                        Field6: { Type: 'Integer' },
                        Field7: { Type: 'Integer' },
                        Field8: { Type: 'Integer' },
                    },
                    CreationDateTime: '2020-10-08T10:19:00.677Z',
                    ModificationDateTime: '2020-10-08T10:19:00.677Z',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaTypeData.CreationDateTime != '2020-10-08T10:19:00.677Z' &&
            logcash.createSchemaTypeData.ModificationDateTime != '2020-10-08T10:19:00.677Z' &&
            logcash.createSchemaTypeData.Hidden == false &&
            logcash.createSchemaTypeData.Type == 'data'
        ) {
            logcash.createSchemaTypeDataStatus = true;
        } else {
            logcash.createSchemaTypeDataStatus = false;
            logcash.createSchemaTypeDataErrorMessage =
                'One of parameters on data type Schema creation get with wrong value';
        }
        await insertDataToDataTableFirst100();
    }

    async function insertDataToDataTableFirst100() {
        for (counter; counter < 100; counter++) {
            logcash.insertDataToDataTableFirst100 = await generalService
                .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaTypeData.Name, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Key: 'stress ' + counter,
                        Field1: new Date(),
                        Field2: 'Stress1',
                    }),
                })
                .then((res) => [res.Status, res.Body]);
            //debugger;
            if (logcash.insertDataToDataTableFirst100[0] == 200) {
                logcash.insertDataToDataTableFirst100Status = true;
            } else {
                logcash.insertDataToDataTableFirst100Status = false;
                logcash.insertDataToDataTableFirst100Error = 'Insert data failed on try number: ' + counter;
            }
        }
        //debugger;
        await insertDataToDataTableSecond100();
    }

    async function insertDataToDataTableSecond100() {
        for (counter; counter < 199; counter++) {
            logcash.insertDataToDataTableSecond100 = await generalService
                .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaTypeData.Name, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Key: 'stress ' + counter,
                        Field1: new Date(),
                        Field2: 'Stress2',
                    }),
                })
                .then((res) => [res.Status, res.Body]);
            //debugger;
            if (logcash.insertDataToDataTableSecond100[0] == 200) {
                logcash.insertDataToDataTableSecond100Status = true;
            } else {
                logcash.insertDataToDataTableSecond100Status = false;
                logcash.insertDataToDataTableSecond100Error = 'Insert data failed on try number: ' + counter;
            }
        }
        //debugger;
        await getDataFromDataTableWhereClouse();
    }

    async function getDataFromDataTableWhereClouse() {
        logcash.getDataFromDataTableWhereClouse = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaTypeData.Name +
                    '?where=Field2=' +
                    "'Stress1'",
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
        if (logcash.getDataFromDataTableWhereClouse.length == 100) {
            logcash.getDataFromDataTableWhereClouseStatus = true;
        } else {
            logcash.getDataFromDataTableWhereClouseStatus = false;
            logcash.getDataFromDataTableWhereClouseError =
                'The get wit where clause result is wrong.Will get 100 objects but result is :' +
                logcash.getDataFromDataTableWhereClouse.length;
        }
        await getDataFromDataTableWhereClouseSec();
    }

    async function getDataFromDataTableWhereClouseSec() {
        logcash.getDataFromDataTableWhereClouseSec = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaTypeData.Name +
                    '?where=Field2=' +
                    "'Stress2'",
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
        if (logcash.getDataFromDataTableWhereClouseSec.length == 99) {
            logcash.getDataFromDataTableWhereClouseSecStatus = true;
        } else {
            logcash.getDataFromDataTableWhereClouseSecStatus = false;
            logcash.getDataFromDataTableWhereClouseSecError =
                'The get wit where clause result is wrong.Will get 99 objects but result is :' +
                logcash.getDataFromDataTableWhereClouseSec.length;
        }
        //debugger;
        await getDataTimeFieldVerification();
    }

    //#endregion 200 object creation
    //#region DataTime field verification

    async function getDataTimeFieldVerification() {
        logcash.getDataTimeFieldVerification = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaTypeData.Name +
                    '?where=Field1=' +
                    JSON.stringify(logcash.getDataFromDataTableWhereClouseSec[96].Field1),
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
        if (logcash.getDataTimeFieldVerification.length == 1) {
            logcash.getDataTimeFieldVerificationStatus = true;
        } else {
            logcash.getDataTimeFieldVerificationStatus = false;
            logcash.getDataTimeFieldVerificationError =
                'The get wit where clause result is wrong.Will get 1 object, but result is :' +
                logcash.getDataTimeFieldVerification.length;
        }
        await getDataTimeFieldVerificationSec();
    }

    async function getDataTimeFieldVerificationSec() {
        logcash.getDataTimeFieldVerificationSec = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaTypeData.Name +
                    '?where=Field1>=' +
                    JSON.stringify(logcash.getDataFromDataTableWhereClouseSec[96].Field1),
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
        if (logcash.getDataTimeFieldVerificationSec.length == 3) {
            logcash.getDataTimeFieldVerificationSecStatus = true;
        } else {
            logcash.getDataTimeFieldVerificationSecStatus = false;
            logcash.getDataTimeFieldVerificationSecError =
                'The get wit where clause result is wrong.Will get 3 objects, but result is :' +
                logcash.getDataTimeFieldVerificationSec.length;
        }
        await dropTableDataAterDataTimeTest();
    }
    //#endregion DataTime field verification

    async function dropTableDataAterDataTimeTest() {
        // the drop table function will be moved after indexed_table data verification when code is ready
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaTypeData.Name + '/purge',
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
            logcash.dropTableDataStatus = true;
        } else {
            logcash.dropTableDataStatus = false;
            logcash.dropTableDataError = 'Drop Data table failed.';
        }
        await createSchemaExpirationDateTime();
    }

    //#region ExpirationDateTime test

    async function createSchemaExpirationDateTime() {
        logcash.createSchemaExpirationDateTime = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'createSchemaExpirationDateTime' + new Date().getTime(),
                    Type: 'data',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaExpirationDateTime.ExpirationDateTime == undefined &&
            logcash.createSchemaExpirationDateTime.Hidden == false &&
            logcash.createSchemaExpirationDateTime.Type == 'data'
        ) {
            logcash.createSchemaExpirationDateTimeStatus = true;
        } else {
            logcash.createSchemaExpirationDateTimeStatus = false;
            logcash.createSchemaExpirationDateTimeErrorMessage =
                'One of parameters on data type Schema creation get with wrong value';
        }
        await insertSchemaExpirationDateTime();
    }

    async function insertSchemaExpirationDateTime() {
        logcash.SchemaExpirationDateTime = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaExpirationDateTime.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testExpDate',
                    Column1: 'Value1',
                }),
            })
            .then((res) => res.Status);
        //debugger;
        if (logcash.SchemaExpirationDateTime == 200) {
            logcash.SchemaExpirationDateTimeStatus = true;
        } else {
            logcash.SchemaExpirationDateTimeStatus = false;
            logcash.SchemaExpirationDateTimeError =
                'Insert data failed ' + logcash.insertDataToTableWithoutOwnerIDNegative;
        }
        await getDataExpirationDateTimeTest();
    }

    async function getDataExpirationDateTimeTest() {
        //logcash.getDataFromTableTwoKeystatus = true;
        logcash.getDataExpirationDateTimeTest = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaExpirationDateTime.Name, {
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
            logcash.getDataExpirationDateTimeTest.length == 1 &&
            logcash.getDataExpirationDateTimeTest[0].Key == 'testExpDate'
        ) {
            logcash.getDataExpirationDateTimeTest.Status = true;
        } else {
            logcash.getDataExpirationDateTimeTest.Status = false;
            logcash.getDataExpirationDateTimeTest.Error = 'Insert failed';
        }
        await updateSchemaExpirationDateTime();
    }

    async function updateSchemaExpirationDateTime() {
        logcash.updateSchemaExpirationDateTime = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaExpirationDateTime.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testExpDate',
                    Hidden: true,
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        const date = new Date();
        date.setDate(date.getDate() + 30);
        let isodate = date.toISOString();
        isodate.split('T')[0];
        isodate = isodate.split('T')[0];

        if (
            logcash.updateSchemaExpirationDateTime[0] == 200 &&
            logcash.updateSchemaExpirationDateTime[1].ExpirationDateTime.split('T')[0] == isodate
        ) {
            logcash.updateSchemaExpirationDateTimeStatus = true;
        } else {
            logcash.updateSchemaExpirationDateTimeStatus = false;
            logcash.updateSchemaExpirationDateTimeError = 'Insert data failed ';
        }
        await updateSchemaExpirationDateTimeUnhidde();
    }

    // on this test i will update any property , without changing hidden = false. After update the hidden will be changed automaticly to false
    async function updateSchemaExpirationDateTimeUnhidde() {
        logcash.updateSchemaExpirationDateTimeUnhidde = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaExpirationDateTime.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testExpDate',
                    //Hidden: false,
                    Column1: 'Value2',
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;

        if (
            logcash.updateSchemaExpirationDateTimeUnhidde[0] == 200 &&
            logcash.updateSchemaExpirationDateTimeUnhidde[1].ExpirationDateTime == undefined
        ) {
            logcash.updateSchemaExpirationDateTimeUnhiddeStatus = true;
        } else {
            logcash.updateSchemaExpirationDateTimeUnhiddeStatus = false;
            logcash.updateSchemaExpirationDateTimeUnhiddeError = 'ExpirationDateTime not removed after unhide';
        }
        await updateSchemaExpirationDateTimeSetValueExpDate();
    }

    // async function updateSchemaExpirationDateTimeUnhidde() {
    //     logcash.updateSchemaExpirationDateTimeUnhidde = await generalService
    //         .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaExpirationDateTime.Name, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: 'Bearer ' + token,
    //                 'X-Pepperi-OwnerID'  : addonUUID,
    //                 'X-Pepperi-SecretKey': logcash.secretKey,
    //             },
    //             body: JSON.stringify({
    //                 Key: 'testExpDate',
    //                 Hidden: false,
    //             }),
    //         })
    //         .then((res) => [res.Status,res.Body]);
    //     //debugger;

    //     if (
    //         logcash.updateSchemaExpirationDateTimeUnhidde[0] == 200 &&
    //         logcash.updateSchemaExpirationDateTimeUnhidde[1].ExpirationDateTime == undefined
    //     ) {
    //         logcash.updateSchemaExpirationDateTimeUnhiddeStatus = true;
    //     } else {
    //         logcash.updateSchemaExpirationDateTimeUnhiddeStatus = false;
    //         logcash.updateSchemaExpirationDateTimeUnhiddeError =
    //             'ExpirationDateTime not removed after unhide';
    //     }
    //     await updateSchemaExpirationDateTimeSetValueExpDate();
    // }

    async function updateSchemaExpirationDateTimeSetValueExpDate() {
        const date = new Date();
        date.setDate(date.getDate() + 10);
        const isodate = date.toISOString();
        // isodate.split('T')[0]
        // isodate = isodate.split('T')[0]

        logcash.updateSchemaExpirationDateTimeSetValueExpDate = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaExpirationDateTime.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testExpDate',
                    //Hidden: false,
                    ExpirationDateTime: isodate,
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;

        if (
            logcash.updateSchemaExpirationDateTimeSetValueExpDate[0] == 200 &&
            logcash.updateSchemaExpirationDateTimeSetValueExpDate[1].ExpirationDateTime.split('T')[0] ==
                isodate.split('T')[0]
        ) {
            logcash.updateSchemaExpirationDateTimeSetValueExpDateStatus = true;
        } else {
            logcash.updateSchemaExpirationDateTimeSetValueExpDateStatus = false;
            logcash.updateSchemaExpirationDateTimeSetValueExpDateError = 'ExpirationDateTime not updated';
        }
        await updateSchemaExpirationDateTimeHide();
    }

    async function updateSchemaExpirationDateTimeHide() {
        logcash.updateSchemaExpirationDateTimeHide = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaExpirationDateTime.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testExpDate',
                    Hidden: true,
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        const date = new Date();
        date.setDate(date.getDate() + 10);
        const isodate = date.toISOString();
        // isodate.split('T')[0]
        // isodate = isodate.split('T')[0]

        if (
            logcash.updateSchemaExpirationDateTimeHide[0] == 200 &&
            logcash.updateSchemaExpirationDateTimeHide[1].ExpirationDateTime.split('T')[0] == isodate.split('T')[0]
        ) {
            logcash.updateSchemaExpirationDateTimeHideStatus = true;
        } else {
            logcash.updateSchemaExpirationDateTimeHideStatus = false;
            logcash.updateSchemaExpirationDateTimeHideError = 'ExpirationDateTime get wrong value ';
        }
        await updateSchemaExpirationDateTimeUnhiddeSec();
    }

    async function updateSchemaExpirationDateTimeUnhiddeSec() {
        logcash.updateSchemaExpirationDateTimeUnhiddeSec = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaExpirationDateTime.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testExpDate',
                    Hidden: false,
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        const date = new Date();
        date.setDate(date.getDate() + 10);
        const isodate = date.toISOString();
        if (
            logcash.updateSchemaExpirationDateTimeUnhiddeSec[0] == 200 &&
            logcash.updateSchemaExpirationDateTimeUnhiddeSec[1].ExpirationDateTime.split('T')[0] ==
                isodate.split('T')[0]
        ) {
            logcash.updateSchemaExpirationDateTimeUnhiddeSecStatus = true;
        } else {
            logcash.updateSchemaExpirationDateTimeUnhiddeSecStatus = false;
            logcash.updateSchemaExpirationDateTimeUnhiddeSecError =
                'Manually inserted ExpirationDateTime removed after unhide';
        }
        await createSchemaWithTypeCPIMetadataSec();
    }
    //#endregion ExpirationDateTime

    //#region CPI_meta_data where clause
    async function createSchemaWithTypeCPIMetadataSec() {
        logcash.createSchemaWithTypeCPIMetadataSec = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    //Name: 'createSchemaWithTypeCPIMetadata ' + Date(),
                    Name: 'SchemaWithTypeCPIMetadata' + new Date().getTime(),
                    Type: 'cpi_meta_data',
                    CreationDateTime: '2020-10-08T10:19:00.677Z',
                    ModificationDateTime: '2020-10-08T10:19:00.677Z',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaWithTypeCPIMetadataSec.ModificationDateTime != '2020-10-08T10:19:00.677Z' &&
            logcash.createSchemaWithTypeCPIMetadataSec.Hidden == false &&
            logcash.createSchemaWithTypeCPIMetadataSec.Type == 'cpi_meta_data' //&&

            // logcash.createSchemaWithTypeCPIMetadata.Fields.TestInteger.Type == 'Integer' &&
            // logcash.createSchemaWithTypeCPIMetadata.Fields.testString.Type == 'String'
        ) {
            logcash.createSchemaWithTypeCPIMetadataSecStatus = true;
        } else {
            logcash.createSchemaWithTypeCPIMetadataSecStatus = false;
            logcash.createSchemaWithTypeCPIMetadataSecErrorMessage =
                'One of parameters on Schema creation get with wrong value: ' +
                logcash.createSchemaWithTypeCPIMetadataSec;
        }
        await insertDataToCPIMetaDataTableSec();
    }

    async function insertDataToCPIMetaDataTableSec() {
        logcash.insertDataToCPIMetaDataTableSec = await generalService
            .fetchStatus(
                baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithTypeCPIMetadataSec.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Key: 'testKey4',
                        Column1: ['Value4', 'Value5', 'Value6'],
                        ColStr1: 'testStr1',
                        ColStr2: 'testStr2',
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.insertDataToCPIMetaDataTableSec.Column1[0] == 'Value4' &&
            logcash.insertDataToCPIMetaDataTableSec.Column1[1] == 'Value5' &&
            logcash.insertDataToCPIMetaDataTableSec.Column1[2] == 'Value6' &&
            logcash.insertDataToCPIMetaDataTableSec.Key == 'testKey4' &&
            logcash.insertDataToCPIMetaDataTableSec.ColStr1 == 'testStr1' &&
            logcash.insertDataToCPIMetaDataTableSec.ColStr2 == 'testStr2'
        ) {
            logcash.insertDataToCPIMetaDataTableSecStatus = true;
        } else {
            logcash.insertDataToCPIMetaDataTableSecStatus = false;
            logcash.insertDataToCPIMetaDataTableSecError =
                'One of parameters is wrong: ' + logcash.insertDataToCPIMetaDataTableSec;
        }
        generalService.sleep(20000);
        await getDataFromCPIMetaDataTableSec();
    }

    async function getDataFromCPIMetaDataTableSec() {
        logcash.getDataFromCPIMetaDataTableSecStatus = true;
        logcash.getDataFromCPIMetaDataTable = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSchemaWithTypeCPIMetadataSec.Name +
                    "?where=Key LIKE '%25Key4%25'",
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
            logcash.getDataFromCPIMetaDataTable.length == 1 &&
            logcash.getDataFromCPIMetaDataTable[0].Key == 'testKey4'
        ) {
            logcash.getDataFromCPIMetaDataTableSecStatus = true;
        } else {
            logcash.getDataFromCPIMetaDataTableSecStatus = false;
            logcash.getDataFromCPIMetaDataTableSecError =
                'Get wrong Key. A reult will like to Key4, but actuall get ' +
                logcash.getDataFromCPIMetaDataTable[0].Key;
        }

        //await getDataFromUDTTable();
    }
    //#endregion CPI_meta_data where clause
}
