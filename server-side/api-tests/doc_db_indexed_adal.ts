import GeneralService, { TesterFunctions } from '../services/general.service';
//import { v4 as newUuid } from 'uuid';

export async function DocDBIndexedAdal(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const assert = tester.assert;
    const expect = tester.expect;
    const it = tester.it;

    const whaitOwnerUUID = '2c199913-dba2-4533-ad78-747b6553acf8';
    const whaitSecretKey = '55cd2b56-2def-4e4e-b461-a56eb3e31689';
    //const adalOwnerId = '00000000-0000-0000-0000-00000000ada1';
    const adalOwnerId = '00000000-0000-0000-0000-00000000ada1';
    const logcash: any = {};
    //const counter = 0;
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
        training: ['2c199913-dba2-4533-ad78-747b6553acf8', '0.0.12'],
        Logs: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', ''],
        'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', ''],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
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
    describe('ADAL type DATA Tests Suites', () => {
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

        describe('Doc DB adal 1.4 tests set', () => {
            it('Test Initiation', async () => {
                // this will run the first test that will run the second and so on..Its test initiation
                await getSecretKey();
            });
            it('Get schema from GR (type PAPI, name accounts', async () => {
                assert(logcash.getPapiSchemaStatus, logcash.getPapiSchemaErrorMessage);
            });
            it('Create Schema (name accounts) with owner not from white list and without indexed fields', async () => {
                assert(logcash.createMainSchemaStatus, logcash.createMainSchemaErrorMessage);
            }); //
            it('Insert data to created account schema', () => {
                assert(logcash.insertDataToAccountsTableStatus, logcash.insertDataToAccountsTableError);
            }); //
            it('Create Schema (name survey) with white liste owner and indexeded fields with resource fields from accounts schema and resource field from PAPI type schema', () => {
                assert(logcash.createSecondSchemaStatus, logcash.createSecondSchemaErrorMessage);
            }); //
            it('Insert data to created survey schema ', () => {
                assert(logcash.insertDataToSurveyTableStatus, logcash.insertDataToSurveyTableError);
            }); //
            it('GET survey (second) schema with referance to account schema from ADAL', () => {
                assert(logcash.getSurveySchemeStatus, logcash.getSurveySchemeErrorMessage);
            }); //
            it('GET survey (second) schema with referance to account schema from Elastic', () => {
                assert(logcash.getFromElasticStatus, logcash.getFromElasticMessage);
            }); //
            it('Update Account(main) schema Name field value(referanced field)', () => {
                assert(logcash.updateSurveyTableStatus, logcash.updateSurveyTableError);
            }); //
            it('GET survey (second) schema with referance to account schema after update from ADAL', () => {
                assert(logcash.getFromAdal2Status, logcash.getFromAdal2Error);
            }); //
            it('GET survey (second) schema with referance to account schema from Elastic', () => {
                assert(logcash.getFromElastic2Status, logcash.getFromElastic2Error);
            }); //
            it('Insert new key + field value to Accounts(main) taible', () => {
                assert(logcash.insertNewKeyToAccountsTableStatus, logcash.insertNewKeyToAccountsTableError);
            }); //
            it('Update survey table - change key value from account table (the value will be changed to new inserted value)', () => {
                assert(logcash.updateSurveyAccountStatus, logcash.updateSurveyAccountError);
            }); //
            it('GET survey (second) schema with referance to account schema after update from ADAL', () => {
                assert(logcash.getFromAdal3Status, logcash.getFromElastic3Error);
            }); //
            it('GET survey (second) schema with referance to account schema from Elastic', () => {
                assert(logcash.getFromElastic3Status, logcash.getFromElastic3Error);
            }); //
            it('Update survey table - change test field value(not referenced from account))', () => {
                assert(logcash.updateSurveyTestFieldStatus, logcash.updateSurveyTestFieldError);
            }); //
            it('GET survey (second) schema with referance to account schema after update from ADAL', () => {
                assert(logcash.getFromAdal4Status, logcash.getFromAdal4Error);
            }); //
            it('GET survey (second) schema with referance to account schema from Elastic', () => {
                assert(logcash.getFromElastic4Status, logcash.getFromElastic4Error);
            }); //
            it('Hard limit of numbers of indexed filelds (hard limit = 20)', () => {
                assert(logcash.createSchemaHardLimitNegativeStatus, logcash.createSchemaHardLimitNegativeErrorMessage);
            }); //
            it('Search URL verification', () => {
                assert(logcash.searchURLStatus, logcash.searchURLError);
            }); //
        });
        describe('Drop created schemas of the end of test', () => {
            it('Drop account schema', () => {
                assert(logcash.dropAccountsTableStatus, logcash.dropAccountsTableError);
            });
            it('Drop survey schema', () => {
                assert(logcash.dropSurveyTableStatus, logcash.dropSurveyTableError);
            });
        });
        describe('Search by KeyList(on elastic) and SuperTypes verification', () => {
            it('Get dedicated schema - SuperTypes verification', () => {
                assert(logcash.getFromDedicatedStatus, logcash.getFromDedicatedError);
            });
            it('Search by Keys', () => {
                assert(logcash.searchPostStatus, logcash.searchPostError);
            });
            it('Drop created schems ', () => {
                assert(logcash.dropTablesStatus, logcash.dropTablesError);
            });
        });
    });

    //#endregion Mocha

    //get secret key
    async function getSecretKey() {
        //Oren added this to improve logs of failed tests
        try {
            logcash.secretKey = await generalService.getSecretKey(addonUUID, varKey);
        } catch (error) {
            throw new Error(`Fail To Get Addon Secret Key ${error}`);
        }
        //Oren added this to skip insatll after I talked with Oleg, the installADallAddon, upgradADallAddon and getAuditLogInstallStatus functions are suspended for now
        //await  createAbstractSchemaPositive();
        await getPapiSchema();
    }

    //#region First Schema creation
    async function getPapiSchema() {
        logcash.getPapiSchema = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes' + "?where=Type LIKE 'papi' AND Name='accounts'", {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': ,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getPapiSchema[0].Type == 'papi' && //logcash.getPapiSchema[0].Fields.Country     logcash.getPapiSchema[0].Fields.City
            logcash.getPapiSchema[0].Name == 'accounts'
        ) {
            logcash.getPapiSchemaStatus = true;
        } else {
            logcash.getPapiSchemaStatus = false;
            logcash.getPapiSchemaErrorMessage = 'The schema by TYPE papi and name account not found';
        }
        await getDataFromPappiAccounts();
    }

    async function getDataFromPappiAccounts() {
        logcash.getDataFromPappiAccountsStatus = true;
        logcash.getDataFromPappiAccounts = await generalService
            .fetchStatus(
                baseURL + '/addons/data/' + logcash.getPapiSchema[0].AddonUUID + '/' + logcash.getPapiSchema[0].Name, //+
                //"?where=Key LIKE '%25Key4%25'",
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
        if (logcash.getDataFromPappiAccounts[0].Key != '') {
            logcash.getDataFromPappiAccountsStatus = true;
        } else {
            logcash.getDataFromPappiAccountsStatus = false;
            logcash.getDataFromPappiAccountsError = 'Not get data wro';
        }

        await createMainSchema();
    }

    // create schema type data (Account_test) with owner/secret not from white list.
    async function createMainSchema() {
        logcash.createMainSchema = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    // Name: 'account_test' + newUuid(),
                    Name: 'account_test' + generalService.generateRandomString(16),
                    Type: 'data',
                    DataSourceData: {
                        IndexName: 'my_index_' + generalService.generateRandomString(3),
                        //NumberOfShards: 3
                    },
                    StringIndexName: 'my_index',
                    Fields: {
                        Name: { Type: 'String' },
                    },
                }),
            })
            .then((res) => res.Body);

        //debugger;
        if (
            logcash.createMainSchema.Name.includes('account_test') &&
            logcash.createMainSchema.Hidden == false &&
            logcash.createMainSchema.Type == 'data' &&
            logcash.createMainSchema.Fields.Name.Type == 'String' &&
            logcash.createMainSchema.DataSourceData.IndexName.includes('my_index')
        ) {
            logcash.createMainSchemaStatus = true;
        } else {
            logcash.createMainSchemaStatus = false;
            logcash.createMainSchemaErrorMessage = 'MAin Schema creation failed';
        }
        await insertDataToAccountsTable();
    }

    async function insertDataToAccountsTable() {
        logcash.insertDataToAccountsTable = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createMainSchema.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: '5',
                    Name: 'First Table',
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.insertDataToAccountsTable[0] == 200) {
            logcash.insertDataToAccountsTableStatus = true;
        } else {
            logcash.insertDataToAccountsTableStatus = false;
            logcash.insertDataToAccountsTableError = 'Insert data to Accounts table failed';
        }
        //debugger;
        //await createSecondSchema();
        await createSecondSchema1();
    }

    ////////// test case to validate rebuild (dedicated schema) on referance fields
    async function createSecondSchema1() {
        logcash.createSecondSchema1 = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    //Name: 'survey_test' + newUuid(),
                    Name: 'survey_test' + generalService.generateRandomString(16),
                    Type: 'data',
                    DataSourceData: {
                        IndexName: 'my_index_' + generalService.generateRandomString(3),
                        //NumberOfShards: 3
                    },
                    StringIndexName: 'my_index',
                    Fields: {
                        test: { Type: 'Integer', Indexed: true },
                        // },
                        Account: { Type: 'String' },
                        //     Type: 'Resource',
                        //     Resource: logcash.createMainSchema.Name,
                        //     AddonUUID: addonUUID,
                        //     Indexed: true,
                        //     IndexedFields: {
                        //         Name: { Type: 'String', Indexed: true },
                        //     },
                        // },
                        PappiAccount: {
                            Type: 'Resource',
                            Resource: logcash.getPapiSchema[0].Name,
                            AddonUUID: logcash.getPapiSchema[0].AddonUUID,
                            Indexed: true,
                            IndexedFields: {
                                Country: { Type: 'String', Indexed: true },
                            },
                        },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSecondSchema1.Name.includes('survey_test') &&
            logcash.createSecondSchema1.Hidden == false &&
            logcash.createSecondSchema1.Type == 'data' &&
            logcash.createSecondSchema1.Fields.test.Type == 'Integer' &&
            logcash.createSecondSchema1.Fields.Account.Type == 'String' &&
            logcash.createSecondSchema1.DataSourceData.IndexName.includes('my_index') &&
            logcash.createSecondSchema1.Fields.PappiAccount.IndexedFields.Country.Indexed == true &&
            logcash.createSecondSchema1.Fields.PappiAccount.Type == 'Resource' //&&
            // logcash.createSecondSchema.Fields.Account.IndexedFields.Name.Indexed == true
        ) {
            logcash.createSecondSchemaStatus = true;
        } else {
            logcash.createSecondSchemaStatus = false;
            logcash.createSecondSchemaErrorMessage = 'Second Schema (from white list addon) creation failed';
        }
        //debugger;
        await insertDataToSurveyTable();
    }

    async function insertDataToSurveyTable() {
        logcash.insertDataToSurveyTable = await generalService
            .fetchStatus(baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSecondSchema1.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Key: '1',
                    test: '123',
                    Account: '5',
                    PappiAccount: logcash.getDataFromPappiAccounts[0].Key,
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.insertDataToSurveyTable[0] == 200) {
            logcash.insertDataToSurveyTableStatus = true;
        } else {
            logcash.insertDataToSurveyTableStatus = false;
            logcash.insertDataToSurveyTableError = 'Insert data to Survey table failed';
        }
        //debugger;
        //await getSurveyScheme();
        generalService.sleep(5000);
        await createSecondSchema();
    }

    async function createSecondSchema() {
        // upsert survey schema with referance fild(account field changed to resource fild to verify deticated schema rebuild)
        logcash.createSecondSchema = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    //Name: 'survey_test' + newUuid(),
                    Name: logcash.createSecondSchema1.Name, //'survey_test' + generalService.generateRandomString(16),
                    Type: 'data',
                    DataSourceData: {
                        IndexName: logcash.createSecondSchema1.DataSourceData.IndexName,
                        //NumberOfShards: 3
                    },
                    StringIndexName: 'my_index',
                    Fields: {
                        test: { Type: 'Integer', Indexed: true },
                        // },
                        Account: {
                            Type: 'Resource',
                            Resource: logcash.createMainSchema.Name,
                            AddonUUID: addonUUID,
                            Indexed: true,
                            IndexedFields: {
                                Name: { Type: 'String', Indexed: true },
                            },
                        },
                        PappiAccount: {
                            Type: 'Resource',
                            Resource: logcash.getPapiSchema[0].Name,
                            AddonUUID: logcash.getPapiSchema[0].AddonUUID,
                            Indexed: true,
                            IndexedFields: {
                                Country: { Type: 'String', Indexed: true },
                            },
                        },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSecondSchema.Name.includes('survey_test') &&
            logcash.createSecondSchema.Hidden == false &&
            logcash.createSecondSchema.Type == 'data' &&
            logcash.createSecondSchema.Fields.test.Type == 'Integer' &&
            logcash.createSecondSchema.Fields.Account.AddonUUID == addonUUID &&
            logcash.createSecondSchema.Fields.Account.Type == 'Resource' &&
            logcash.createSecondSchema.Fields.Account.IndexedFields.Name.Indexed == true &&
            logcash.createSecondSchema.Fields.PappiAccount.IndexedFields.Country.Indexed == true
        ) {
            logcash.createSecondSchemaStatus = true;
        } else {
            logcash.createSecondSchemaStatus = false;
            logcash.createSecondSchemaErrorMessage = 'Second Schema (from white list addon) creation failed';
        }
        //debugger;
        //await insertDataToSurveyTable();
        await getDataDedicated();
    }

    // async function insertDataToSurveyTable() {
    //     logcash.insertDataToSurveyTable = await generalService
    //         .fetchStatus(baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSecondSchema.Name, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: 'Bearer ' + token,
    //                 //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
    //                 'X-Pepperi-SecretKey': whaitSecretKey,
    //             },
    //             body: JSON.stringify({
    //                 Key: '1',
    //                 test: '123',
    //                 Account: '5',
    //             }),
    //         })
    //         .then((res) => [res.Status, res.Body]);
    //     //debugger;
    //     if (logcash.insertDataToSurveyTable[0] == 200) {
    //         logcash.insertDataToSurveyTableStatus = true;
    //     } else {
    //         logcash.insertDataToSurveyTableStatus = false;
    //         logcash.insertDataToSurveyTableError = 'Insert data to Survey table failed';
    //     }
    //     //debugger;
    //     await getSurveyScheme();
    // }

    async function getDataDedicated() {
        // get data from elastic
        //logcash.getDataDedicatedStatus = true;
        logcash.getDataDedicated = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/shared_index/index/' +
                    logcash.createSecondSchema1.DataSourceData.IndexName +
                    '/' +
                    adalOwnerId +
                    '/' +
                    whaitOwnerUUID +
                    '~' +
                    logcash.createSecondSchema.Name,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        // if (logcash.getDataDedicated.length == 10) {
        //     for (let index = 0; index < logcash.getDataDedicated.length - 1; index++) {
        if (logcash.getDataDedicated[0].test == '123' && logcash.getDataDedicated[0]['PappiAccount.Country'] != '') {
            logcash.getDataDedicatedStatus = true;
        } else {
            logcash.getDataDedicatedStatus = false;
            logcash.getDataDedicatedError = 'Will get one field value';
        }
        //debugger;
        await cleanRebuild();
    }

    async function cleanRebuild() {
        logcash.cleanRebuild = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/api/async/' +
                    adalOwnerId +
                    '/' +
                    'indexed_adal_api/clean_rebuild?table_name=' +
                    logcash.createSecondSchema.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': whaitOwnerUUID,
                        'X-Pepperi-SecretKey': whaitSecretKey,
                    },
                },
            )
            .then((res) => [res.Status, res.Body]);
        //debugger;
        //Failed due to exception: Table schema must exist, for table
        if (logcash.cleanRebuild[0] == 200) {
            logcash.cleanRebuildStatus = true;
        } else {
            logcash.cleanRebuildStatus = false;
            logcash.cleanRebuildError = 'Clean rebuild failed';
        }

        //debugger;
        generalService.sleep(50000);
        await searchURL();
    }

    ///////////////////////////////////////
    async function searchURL() {
        logcash.searchURL = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/api/' +
                    adalOwnerId +
                    '/indexed_adal_api/get_search_url?table_name=' +
                    logcash.createSecondSchema.Name,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': whaitOwnerUUID,
                        'X-Pepperi-SecretKey': whaitSecretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        // if (logcash.getDataDedicated.length == 10) {
        //     for (let index = 0; index < logcash.getDataDedicated.length - 1; index++) {
        if (
            logcash.searchURL ==
            '/addons/shared_index/index/' +
                logcash.createSecondSchema1.DataSourceData.IndexName +
                '/search/' +
                adalOwnerId +
                '/' +
                whaitOwnerUUID +
                '~' +
                logcash.createSecondSchema1.Name
        ) {
            logcash.searchURLStatus = true;
        } else {
            logcash.searchURLStatus = false;
            logcash.searchURLError = ' GET wrong URL';
        }
        //debugger;
        await getDataDedicated1();
    }
    ///////////////////////////////////////

    async function getDataDedicated1() {
        // get data from elastic
        //logcash.getDataDedicatedStatus = true;
        logcash.getDataDedicated1 = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/shared_index/index/' +
                    logcash.createSecondSchema1.DataSourceData.IndexName +
                    '/' +
                    adalOwnerId +
                    '/' +
                    whaitOwnerUUID +
                    '~' +
                    logcash.createSecondSchema1.Name,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        // if (logcash.getDataDedicated.length == 10) {
        //     for (let index = 0; index < logcash.getDataDedicated.length - 1; index++) {
        if (
            logcash.getDataDedicated1[0]['Account.Name'] == 'First Table' &&
            logcash.getDataDedicated1[0]['PappiAccount.Country'] != '' &&
            logcash.getDataDedicated1[0].test == '123'
        ) {
            logcash.getDataDedicated1Status = true;
        } else {
            logcash.getDataDedicated1Status = false;
            logcash.getDataDedicated1Error = 'URL is wrong';
        }
        //debugger;
        await getSurveyScheme();
    }

    /////////////////////////
    async function getSurveyScheme() {
        logcash.getSurveyScheme = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    whaitOwnerUUID +
                    '/' +
                    logcash.createSecondSchema.Name +
                    '?fields=test,Account.Name',
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': whaitOwnerUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (logcash.getSurveyScheme[0].test == '123' && logcash.getSurveyScheme[0]['Account.Name'] == 'First Table') {
            logcash.getSurveySchemeStatus = true;
        } else {
            logcash.getSurveySchemeStatus = false;
            logcash.getSurveySchemeErrorMessage = 'The survey scheme will be created, but actuall get empty ';
        }
        generalService.sleep(2000);
        await getFromElastic();
    }

    async function getFromElastic() {
        logcash.getFromElastic = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    whaitOwnerUUID +
                    '/' +
                    logcash.createSecondSchema.Name +
                    '?where=Key="1"&fields=test,Account.Name',
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': whaitOwnerUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (logcash.getFromElastic[0].test == '123' && logcash.getFromElastic[0]['Account.Name'] == 'First Table') {
            logcash.getFromElasticStatus = true;
        } else {
            logcash.getFromElasticStatus = false;
            logcash.getFromElasticMessage = 'The survey scheme will be created, but actuall get empty ';
        }
        await updateSurveyTable();
    }

    async function updateSurveyTable() {
        logcash.updateSurveyTable = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createMainSchema.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: '5',
                    Name: 'Updated first table',
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.updateSurveyTable[0] == 200) {
            logcash.updateSurveyTableStatus = true;
        } else {
            logcash.updateSurveyTableStatus = false;
            logcash.updateSurveyTableError = 'Insert data to Accounts table failed';
        }
        //debugger;
        const res = await getSurveyScheme1();
        //debugger;
        if (res.test == '123' && res['Account.Name'] == 'Updated first table') {
            logcash.getFromAdal2Status = true;
        } else {
            logcash.getFromAdal2Status = false;
            logcash.getFromAdal2Error = 'Accounts table document with key 5 not updated on ADAL table';
        }
        generalService.sleep(40000);
        const res2 = await getFromElastic1();
        //debugger;
        if (res2.test == '123' && res2['Account.Name'] == 'Updated first table') {
            logcash.getFromElastic2Status = true;
        } else {
            logcash.getFromElastic2Status = false;
            logcash.getFromElastic2Error = 'Accounts table document with key 5 not updated on elastic table';
        }
        await insertNewKeyToAccountsTable();
    }

    async function insertNewKeyToAccountsTable() {
        logcash.insertNewKeyToAccountsTable = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createMainSchema.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: '6',
                    Name: 'Second table',
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.insertNewKeyToAccountsTable[0] == 200) {
            logcash.insertNewKeyToAccountsTableStatus = true;
        } else {
            logcash.insertNewKeyToAccountsTableStatus = false;
            logcash.insertNewKeyToAccountsTableError = 'Insert data to Accounts table failed';
        }
        //debugger;
        await updateSurveyAccount();
    }

    async function updateSurveyAccount() {
        logcash.updateSurveyAccount = await generalService
            .fetchStatus(baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSecondSchema.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Key: '1',
                    test: '123',
                    Account: '6',
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.updateSurveyAccount[0] == 200) {
            logcash.updateSurveyAccountStatus = true;
        } else {
            logcash.updateSurveyAccountStatus = false;
            logcash.updateSurveyAccountError = 'Update data on Survey table failed';
        }
        //debugger;
        const res = await getSurveyScheme1();
        //debugger;
        if (res.test == '123' && res['Account.Name'] == 'Second table') {
            logcash.getFromAdal3Status = true;
        } else {
            logcash.getFromAdal3Status = false;
            logcash.getFromAdal3Error = 'Survey table document not updated to key 6 on adal table';
        }
        generalService.sleep(15000);
        const res2 = await getFromElastic1();
        //debugger;
        if (res2.test == '123' && res2['Account.Name'] == 'Second table') {
            logcash.getFromElastic3Status = true;
        } else {
            logcash.getFromElastic3Status = false;
            logcash.getFromElastic3Error = 'Survey table document not updated to key 6 on elastic table';
        }
        await updateSurveyTestField();
    }

    async function updateSurveyTestField() {
        logcash.updateSurveyTestField = await generalService
            .fetchStatus(baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSecondSchema.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Key: '1',
                    test: '456',
                    Account: '6',
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.updateSurveyTestField[0] == 200) {
            logcash.updateSurveyTestFieldStatus = true;
        } else {
            logcash.updateSurveyTestFieldStatus = false;
            logcash.updateSurveyTestFieldError = 'Update data on Survey table (test field) failed';
        }
        //debugger;
        const res = await getSurveyScheme1();
        //debugger;
        if (res.test == '456' && res['Account.Name'] == 'Second table') {
            logcash.getFromAdal4Status = true;
        } else {
            logcash.getFromAdal4Status = false;
            logcash.getFromAdal4Error = 'Survey table test field value not updated on ADAL table';
        }
        generalService.sleep(15000);
        const res2 = await getFromElastic1();
        //debugger;
        if (res2.test == '456' && res2['Account.Name'] == 'Second table') {
            logcash.getFromElastic4Status = true;
        } else {
            logcash.getFromElastic4Status = false;
            logcash.getFromElastic4Error = 'Survey table test field value not updated on elastic table';
        }
        await dropAccountsTable();
    }

    async function dropAccountsTable() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createMainSchema.Name + '/purge',
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
            logcash.dropAccountsTableStatus = true;
        } else {
            logcash.dropAccountsTableStatus = false;
            logcash.dropAccountsTableError = 'Drop account schema failed. Error message';
        }
        await dropSurveyTable();
    }
    async function dropSurveyTable() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSecondSchema.Name + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
            },
        ); //.then((data) => data.json())
        //debugger;

        //if(logcash.dropExistingTable.success == true){
        if (res.Ok) {
            logcash.dropSurveyTableStatus = true;
        } else {
            logcash.dropSurveyTableStatus = false;
            logcash.dropSurveyTableError = 'Drop survry schema failed. Error message';
        }
        await createSchemaHardLimitNegative();
    }

    //#region ////////////////////Hard limit - 20 indexed fields

    async function createSchemaHardLimitNegative() {
        const Fields = {};
        for (let counter = 0; counter < 21; counter++) {
            Fields['teststring' + counter] = { Type: 'Integer', Indexed: true };
        }
        logcash.createSchemaHardLimitNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Name: 'Hard_limit_negative' + generalService.generateRandomString(3),
                    Type: 'data',
                    //StringIndexName: 'my_index_table',
                    Fields: Fields,
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaHardLimitNegative.fault.faultstring.includes(
                'Too many indexed fields. Allowed: 20, Got: 21',
            )
        ) {
            logcash.createSchemaHardLimitNegativeStatus = true;
        } else {
            logcash.createSchemaHardLimitNegativeStatus = false;
            logcash.createSchemaHardLimitNegativeErrorMessage =
                'The schema creation will failed. The indexed fields hard limit is 20';
        }
        await createAbstractSchemaPositive();
    }
    //#endregion - hard limit

    //#region New search by Keys function
    async function createAbstractSchemaPositive() {
        //extendet schema
        //user define is default = false
        logcash.createAbstractSchemaPositive = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    //Name: 'Test-positive' + newUuid(),
                    Name: 'Test_positive' + generalService.generateRandomString(16),
                    Type: 'abstract', // will be abstract type
                    DataSourceData: {
                        IndexName: 'my_index_' + generalService.generateRandomString(3),
                    },
                    UserDefined: true,
                    Fields: {
                        testString1: { Type: 'String', Indexed: true },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.createAbstractSchemaPositive.Name.includes('Test_positive')) {
            logcash.createAbstractSchemaPositiveStatus = true;
        } else {
            logcash.createAbstractSchemaPositiveStatus = false;
            logcash.createAbstractSchemaPositiveErrorMessage =
                'Schema will be created successfully, but actually failed';
        }
        await createSchema1();
    }

    async function createSchema1() {
        logcash.createSchema1 = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Name: 'search1_test' + generalService.generateRandomString(16),
                    Type: 'data',
                    DataSourceData: {
                        IndexName: 'my_index_' + generalService.generateRandomString(3),
                        //NumberOfShards: 3
                    },
                    StringIndexName: 'my_index',
                    Fields: {
                        Name1: { Type: 'String' },
                        Name2: { Type: 'String', Indexed: true },
                        Num1: { Type: 'Integer', Indexed: true },
                    },
                    Extends: {
                        AddonUUID: whaitOwnerUUID,
                        Name: logcash.createAbstractSchemaPositive.Name,
                    },
                }),
            })
            .then((res) => res.Body);

        //debugger;
        if (
            logcash.createSchema1.Name.includes('search1_test') &&
            logcash.createSchema1.Hidden == false &&
            logcash.createSchema1.Type == 'data' &&
            logcash.createSchema1.Fields.Name1.Type == 'String'
            // logcash.createMainSchema.DataSourceData.IndexName.includes('my_index')
        ) {
            logcash.createSchema1Status = true;
        } else {
            logcash.createSchema1Status = false;
            logcash.createSchema1ErrorMessage = 'Schema1 creation failed';
        }
        await insertDataToSchema1();
    }

    async function insertDataToSchema1() {
        logcash.insertDataToSchema1 = await generalService
            .fetchStatus(baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSchema1.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Key: '5',
                    Name1: 'Tab1',
                    Name2: 'Tab2',
                    Num1: 10,
                    testString1: 'abs1',
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.insertDataToSchema1[0] == 200) {
            logcash.insertDataToSchema1Status = true;
        } else {
            logcash.insertDataToSchema1Status = false;
            logcash.insertDataToSchema1Error = 'Insert data to Schema1 table failed';
        }
        //debugger;
        //await createSecondSchema();
        await createSchema2();
    }
    async function createSchema2() {
        logcash.createSchema2 = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Name: 'search2_test' + generalService.generateRandomString(16),
                    Type: 'data',
                    // DataSourceData: {
                    //     IndexName: 'my_index_' + generalService.generateRandomString(3),
                    //NumberOfShards: 3
                    // },
                    StringIndexName: 'my_index',
                    Fields: {
                        Name1_1: { Type: 'String' },
                        Name2_1: { Type: 'String', Indexed: true },
                        Num1: { Type: 'Integer', Indexed: true },
                    },
                    Extends: {
                        AddonUUID: whaitOwnerUUID,
                        Name: logcash.createAbstractSchemaPositive.Name,
                    },
                }),
            })
            .then((res) => res.Body);

        //debugger;
        if (
            logcash.createSchema2.Name.includes('search2_test') &&
            logcash.createSchema2.Hidden == false &&
            logcash.createSchema2.Type == 'data' //&&
            //logcash.createSchema1.Fields.Name.Type == 'String'
            // logcash.createMainSchema.DataSourceData.IndexName.includes('my_index')
        ) {
            logcash.createSchema2Status = true;
        } else {
            logcash.createSchema2Status = false;
            logcash.createSchema2ErrorMessage = 'Schema2 creation failed';
        }
        await insertDataToSchema2();
    }

    async function insertDataToSchema2() {
        logcash.insertDataToSchema2 = await generalService
            .fetchStatus(baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSchema2.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Key: '7',
                    Name1_1: 'Tab1_2',
                    Name2_1: 'Tab2_2',
                    Num1: 5,
                    testString1: 'abs2',
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.insertDataToSchema2[0] == 200) {
            logcash.insertDataToSchema2Status = true;
        } else {
            logcash.insertDataToSchema2Status = false;
            logcash.insertDataToSchema2Error = 'Insert data to Schema1 table failed';
        }
        //debugger;
        //await createSecondSchema();
        generalService.sleep(20000);
        await getFromDedicated();
    }

    async function getFromDedicated() {
        // get data from elastic
        //logcash.getDataDedicatedStatus = true;
        logcash.getFromDedicated = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/shared_index/index/' +
                    logcash.createSchema2.DataSourceData.IndexName +
                    '/' +
                    adalOwnerId +
                    '/' +
                    whaitOwnerUUID +
                    '~' +
                    logcash.createSchema2.Name +
                    '?fields=testString1,ElasticSearchType,Key',
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        // if (logcash.getDataDedicated.length == 10) {
        //     for (let index = 0; index < logcash.getDataDedicated.length - 1; index++) {
        if (
            logcash.getFromDedicated.length == 1 &&
            logcash.getFromDedicated[0].ElasticSearchType.includes('search2_test') &&
            logcash.getFromDedicated[0].Key &&
            logcash.getFromDedicated[0].testString1 == 'abs2'
        ) {
            logcash.getFromDedicatedStatus = true;
        } else {
            logcash.getFromDedicatedStatus = false;
            logcash.getFromDedicatedError = 'Will get SuperTypes value';
        }
        //debugger;
        await searchPost();
    }

    async function searchPost() {
        //logcash.searchPostStatus = false;
        logcash.searchPost = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/api/' +
                    adalOwnerId +
                    '/api/search_abstract?table=' +
                    logcash.createAbstractSchemaPositive.Name +
                    '&addon_uuid=' +
                    whaitOwnerUUID,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //  'X-Pepperi-OwnerID': addonUUID,
                        //  'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        KeyList: [
                            { Key: '5', ElasticSearchType: logcash.createSchema1.Name },
                            { Key: '7', ElasticSearchType: logcash.createSchema2.Name },
                        ],
                        Fields: 'Name1,Name1_1,Num1,testString1',
                    }),
                },
            )
            .then((res) => res.Body);

        //debugger;
        if (logcash.searchPost.Objects.length == 2 && logcash.searchPost.Objects[0].Name1 == undefined) {
            if (
                logcash.searchPost.Objects[0].Name1_1 == 'Tab1_2' &&
                logcash.searchPost.Objects[0].testString1 == 'abs2' &&
                logcash.searchPost.Objects[0].Num1 == 5 &&
                logcash.searchPost.Objects[1].Name1 == 'Tab1' &&
                logcash.searchPost.Objects[1].testString1 == 'abs1' &&
                logcash.searchPost.Objects[1].Num1 == 10
            ) {
                logcash.searchPostStatus = true;
            } else {
                logcash.searchPostStatus = false;
                logcash.searchPostError = 'The search by key return wrong values';
            }
        } else if (logcash.searchPost.Objects.length == 2 && logcash.searchPost.Objects[0].Name1_1 == undefined) {
            if (
                logcash.searchPost.Objects[1].Name1_1 == 'Tab1_2' &&
                logcash.searchPost.Objects[1].testString1 == 'abs2' &&
                logcash.searchPost.Objects[1].Num1 == 5 &&
                logcash.searchPost.Objects[0].Name1 == 'Tab1' &&
                logcash.searchPost.Objects[0].testString1 == 'abs1' &&
                logcash.searchPost.Objects[0].Num1 == 10
            ) {
                logcash.searchPostStatus = true;
            } else {
                logcash.searchPostStatus = false;
                logcash.searchPostError = 'The search by key return wrong values';
            }
        }
        logcash.dropTablesCount = 0;
        logcash.dropTablesSchemaName = logcash.createAbstractSchemaPositive.Name;
        await dropTables();
    }

    async function dropTables() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.dropTablesSchemaName + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
            },
        ); //.then((data) => data.json())
        debugger;

        //if(logcash.dropExistingTable.success == true){
        if (res.Ok) {
            logcash.dropTablesCount++;
            if (logcash.dropTablesCount == 1) {
                logcash.dropTablesSchemaName = logcash.createSchema1.Name;
                await dropTables();
            } else if (logcash.dropTablesCount == 2) {
                logcash.dropTablesSchemaName = logcash.createSchema2.Name;
                //await dropTables();
                logcash.dropTablesStatus = true;
            }
        } else {
            logcash.dropTablesStatus = false;
            logcash.dropTablesError = 'Drop tables failed.';
        }
        //await dropExtendingTable();
    }

    //#endregion
    /////////////////////////////////Get from ADAL and from Elastic
    async function getSurveyScheme1() {
        logcash.getSurveyScheme1 = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    whaitOwnerUUID +
                    '/' +
                    logcash.createSecondSchema.Name +
                    '?fields=test,Account.Name',
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': whaitOwnerUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;

        return logcash.getSurveyScheme1[0];
    }

    async function getFromElastic1() {
        logcash.getFromElastic1 = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    whaitOwnerUUID +
                    '/' +
                    logcash.createSecondSchema.Name +
                    '?where=Key="1"&fields=test,Account.Name',
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': whaitOwnerUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;

        return logcash.getFromElastic1[0];
    }
}
