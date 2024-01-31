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
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
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
            it('Search on dot DI 23572 ', () => {
                assert(logcash.getDataDI23572Status, logcash.getDataDI23572Error);
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
            it('DI-23434 verification - upsert schema without fields and verify by GET the created fields on previos POST not removed', () => {
                assert(logcash.upsertSchema1Status, logcash.upsertSchema1ErrorMessage);
            });
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
        describe('GET from doc DB on schema with references fields doesnt return the default fields (except Key) - DI-22546', () => {
            it('Get schema - fields and data verification', () => {
                assert(logcash.getDataADAL2Status, logcash.getDataADAL2Error);
            });
            it('Get schema - get by referance fields', () => {
                assert(logcash.getDataADAL3Status, logcash.getDataADAL3Error);
            });
            it('Drop created schems ', () => {
                assert(logcash.dropTables1Status, logcash.dropTables1Error);
            });
        });
        describe('PageKey - search from elastic verification  ', () => {
            it('Get data with PageKey (NextPageKey)', () => {
                assert(logcash.getDataPageKey3Status, logcash.getDataPageKey3Error);
            });
            it('Drop created schema ', () => {
                assert(logcash.dropPageKeyTestTableStatus, logcash.dropPageKeyTestTableError);
            });
        });
        describe('PageKey verification - search from Dinamo ', () => {
            it('Get data with PageKey (NextPageKey)', () => {
                assert(logcash.getDataPageKeyFromDinamo3Status, logcash.getDataPageKeyFromDinamo3Error);
            });
            it('Drop created schema ', () => {
                assert(logcash.dropPageKeyTestTable1Status, logcash.dropPageKeyTestTable1Error);
            });
            it('Get data with PageKey (from PAPI type)', () => {
                assert(logcash.getDataPageKeyFromPapiStatus, logcash.getDataPageKeyFromPapiError);
            });
        });
        describe('Nelt issues + bug fixes', () => {
            it('indexed ADAL pns on value change upload not indexed fields DI-24110', () => {
                assert(logcash.createSchemaDI24110Status, logcash.createSchemaDI24110Message);
            });
            it('Insert data (one indexed field and one not indexed)', () => {
                assert(logcash.insertDataToTestTableStatus, logcash.insertDataToTestTableError);
            });
            it('Search by not indexed field DI-20949', () => {
                assert(logcash.getByNotIndexedFieldNegativeStatus, logcash.getByNotIndexedFieldNegativeError);
            });
            it('Drop Temp table(table with same index and field name(indexed)', () => {
                assert(logcash.dropTestTableTmpStatus, logcash.dropTestTableTmpError);
            });
            it('Get from elastic (jus indexed field)', () => {
                assert(logcash.getFromElasticTableStatus, logcash.getFromElasticTableError);
            });
            it('update values (index and not indexed)', () => {
                assert(logcash.updateTestTableStatus, logcash.updateTestTableError);
            });
            it('Get from elastic (jus indexed field) - verify updated value', () => {
                assert(logcash.getFromElasticTableSecStatus, logcash.getFromElasticTableSecError);
            });
            it('Post after rebuild DI-20949', () => {
                assert(logcash.getFromElasticTable3Status, logcash.getFromElasticTable3Error);
            });
            it('Drop created schema ', () => {
                assert(logcash.dropTestTableStatus, logcash.dropTestTableError);
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
        //await  createSchemaDI24110();
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

        await getDataPageKeyFromPapi();
    }

    async function getDataPageKeyFromPapi() {
        logcash.getDataPageKeyFromPapi = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/search/' +
                    logcash.getPapiSchema[0].AddonUUID +
                    '/' +
                    logcash.getPapiSchema[0].Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        PageSize: 1,
                        Fields: ['InternalID', 'Type', 'Country'],
                        //OrderBy: 'Field1',
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (logcash.getDataPageKeyFromPapi.Objects.length == 1 && logcash.getDataPageKeyFromPapi.NextPageKey != '') {
            logcash.getDataPageKeyFromPapiStatus = true;
        } else {
            logcash.getDataPageKeyFromPapiStatus = false;
            logcash.getDataPageKeyFromPapiError = 'Will get 1 docs on page';
        }
        //debugger;
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
                    'x-pepperi-await-indexing': 'true', //oleg DI-22540
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
        await getDataDI23572();
    }
    //////////DI-23572
    async function getDataDI23572() {
        logcash.getDataDI23572 = await generalService
            .fetchStatus(baseURL + '/addons/data/search/' + whaitOwnerUUID + '/' + logcash.createSecondSchema1.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': addonUUID,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    PageSize: 40,
                    //Fields: ['IndexedInt1', 'IndexedString2', 'Field1'],
                    //OrderBy: 'Field1',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDataDI23572.Objects.length == 1 &&
            logcash.getDataDI23572.Objects[0].PappiAccount.Type == undefined
        ) {
            logcash.getDataDI23572Status = true;
        } else {
            logcash.getDataDI23572Status = false;
            logcash.getDataDI23572Error = 'Will get 1 docs on page';
        }
        //debugger;
        await createSecondSchema();
    }
    /////////////////

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
        if (
            logcash.getDataDedicated[0].test == '123' &&
            logcash.getDataDedicated[0]['PappiAccount.Country'] != '' &&
            logcash.getDataDedicated[0].Key == '1' &&
            logcash.getDataDedicated[0].Hidden == false &&
            logcash.getDataDedicated[0]['PappiAccount.Key'] != '' &&
            logcash.getDataDedicated[0].CreationDateTime != '' &&
            logcash.getDataDedicated[0].ModificationDateTime != ''
        ) {
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
            logcash.getDataDedicated1[0].test == '123' &&
            logcash.getDataDedicated[0].Key == '1' &&
            logcash.getDataDedicated[0].Hidden == false &&
            logcash.getDataDedicated[0]['PappiAccount.Key'] != '' &&
            logcash.getDataDedicated[0].CreationDateTime != '' &&
            logcash.getDataDedicated[0].ModificationDateTime != ''
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
                    'x-pepperi-await-indexing': 'true', //oleg DI-22540
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
        const res = await getSurveyScheme1();//DI-23760
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
        await upsertSchema1();
    }
    // DI-23434 verification - upsert schema without fields and verify by GET the created fields on previos POST not removed
    async function upsertSchema1() {
        logcash.upsertSchema1 = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchema1.Name,
                    Type: 'data',
                    // DataSourceData: {
                    //     IndexName: 'my_index_' + generalService.generateRandomString(3),
                    //     //NumberOfShards: 3
                    // },
                    StringIndexName: 'my_index',
                    // Fields: {
                    //     Name1: { Type: 'String' },
                    //     Name2: { Type: 'String', Indexed: true },
                    //     Num1: { Type: 'Integer', Indexed: true },
                    // },
                    // Extends: {
                    //     AddonUUID: whaitOwnerUUID,
                    //     Name: logcash.createAbstractSchemaPositive.Name,
                    // },
                }),
            })
            .then((res) => res.Body);

        //debugger;
        if (
            logcash.upsertSchema1.Name == logcash.createSchema1.Name &&
            logcash.upsertSchema1.Hidden == false &&
            logcash.upsertSchema1.Type == 'data' &&
            logcash.upsertSchema1.Fields.Name1.Type == 'String' &&
            logcash.upsertSchema1.Fields.testString1.Type == 'String'
            // logcash.createMainSchema.DataSourceData.IndexName.includes('my_index')
        ) {
            logcash.upsertSchema1Status = true;
        } else {
            logcash.upsertSchema1Status = false;
            logcash.upsertSchema1ErrorMessage = 'Schema1 creation failed';
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
        //debugger;

        //if(logcash.dropExistingTable.success == true){
        if (res.Ok) {
            logcash.dropTablesCount++;
            if (logcash.dropTablesCount == 1) {
                logcash.dropTablesSchemaName = logcash.createSchema1.Name;
                await dropTables();
            } else if (logcash.dropTablesCount == 2) {
                logcash.dropTablesSchemaName = logcash.createSchema2.Name;
                await dropTables();
            } else if (logcash.dropTablesCount == 3) {
                logcash.dropTablesStatus = true;
                await createFirstSchema();
            }
        } else {
            logcash.dropTablesStatus = false;
            logcash.dropTablesError = 'Drop tables failed.';
        }
        //await createFirstSchema();
    }

    //#endregion

    //#region GET from doc DB on schema with references fields doesn't return the default fields (except Key)
    async function createFirstSchema() {
        logcash.createFirstSchema = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    // Name: 'account_test' + newUuid(),
                    Name: 'account_test1' + generalService.generateRandomString(16),
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
            logcash.createFirstSchema.Name.includes('account_test') &&
            logcash.createFirstSchema.Hidden == false &&
            logcash.createFirstSchema.Type == 'data' &&
            logcash.createFirstSchema.Fields.Name.Type == 'String' &&
            logcash.createFirstSchema.DataSourceData.IndexName.includes('my_index')
        ) {
            logcash.createFirstSchemaStatus = true;
        } else {
            logcash.createFirstSchemaStatus = false;
            logcash.createFirstSchemaErrorMessage = 'MAin Schema creation failed';
        }
        await insertDataToFirstTable();
    }

    async function insertDataToFirstTable() {
        logcash.insertDataToAccountsTable = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createFirstSchema.Name, {
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
            logcash.insertDataToAccountsTableError = 'Insert data to First table failed';
        }
        //debugger;
        //await createSecondSchema();
        await createSecondSchema2();
    }

    ////////// test case to validate rebuild (dedicated schema) on referance fields
    async function createSecondSchema2() {
        logcash.createSecondSchema2 = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
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
                        test: { Type: 'Integer' },
                        // },
                        Account: {
                            Type: 'Resource',
                            Resource: logcash.createFirstSchema.Name,
                            AddonUUID: addonUUID,
                            Indexed: false,
                            IndexedFields: {
                                Name: { Type: 'String' },
                            },
                        },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSecondSchema2.Name.includes('survey_test') &&
            logcash.createSecondSchema2.Hidden == false &&
            logcash.createSecondSchema2.Type == 'data' &&
            logcash.createSecondSchema2.Fields.test.Type == 'Integer' &&
            logcash.createSecondSchema2.Fields.Account.Type == 'Resource' &&
            logcash.createSecondSchema2.DataSourceData.IndexName.includes('my_index')
        ) {
            logcash.createSecondSchema2Status = true;
        } else {
            logcash.createSecondSchema2Status = false;
            logcash.createSecondSchema2ErrorMessage = 'Second Schema creation failed';
        }
        //debugger;
        await insertDataSecondTable();
    }

    async function insertDataSecondTable() {
        logcash.insertDataSecondTable = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSecondSchema2.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: '1',
                    test: '123',
                    Account: '5',
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.insertDataSecondTable[0] == 200) {
            logcash.insertDataSecondTableStatus = true;
        } else {
            logcash.insertDataSecondTableStatus = false;
            logcash.insertDataSecondTableError = 'Insert data to Survey table failed';
        }
        //debugger;
        //await getSurveyScheme();
        generalService.sleep(5000);
        await getDataADAL2();
    }

    async function getDataADAL2() {
        //logcash.getDataADALStatus = true;
        logcash.getDataADAL2 = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSecondSchema2.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDataADAL2[0].Account == '5' &&
            logcash.getDataADAL2[0]['Account.CreationDateTime'] == undefined &&
            logcash.getDataADAL2[0]['Account.Hidden'] == undefined &&
            logcash.getDataADAL2[0]['Account.ModificationDateTime'] == undefined &&
            logcash.getDataADAL2[0]['Account.Name'] == undefined && //Oleg - changed from buid 1.4.119
            logcash.getDataADAL2[0].CreationDateTime != '' &&
            logcash.getDataADAL2[0].Hidden == false &&
            logcash.getDataADAL2[0].Key == '1' &&
            logcash.getDataADAL2[0].ModificationDateTime != '' &&
            logcash.getDataADAL2[0].test == '123'
        ) {
            logcash.getDataADAL2Status = true;
        } else {
            logcash.getDataADAL2Status = false;
            logcash.getDataADAL2Error = 'GET value is wrong';
        }
        //debugger;
        // logcash.dropTablesSchemaName1 = logcash.createFirstSchema.Name;
        // logcash.dropTablesCount1 = 0;
        await getDataADAL3();
    }
    async function getDataADAL3() {
        //logcash.getDataADALStatus = true;
        logcash.getDataADAL3 = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/data/' +
                    addonUUID +
                    '/' +
                    logcash.createSecondSchema2.Name +
                    '?fields=Account,Account.Name,Account.Hidden,Key',
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDataADAL3[0].Account == '5' &&
            logcash.getDataADAL3[0]['Account.CreationDateTime'] == undefined &&
            logcash.getDataADAL3[0]['Account.Hidden'] == false &&
            logcash.getDataADAL3[0]['Account.ModificationDateTime'] == undefined &&
            logcash.getDataADAL3[0]['Account.Name'] == 'First Table' && //Oleg - changed from buid 1.4.119
            //logcash.getDataADAL3[0].CreationDateTime != '' &&
            //logcash.getDataADAL3[0].Hidden == false &&
            logcash.getDataADAL3[0].Key == '1' //&&
            //logcash.getDataADAL3[0].ModificationDateTime != '' &&
            //logcash.getDataADAL3[0].test == '123'
        ) {
            logcash.getDataADAL3Status = true;
        } else {
            logcash.getDataADAL3Status = false;
            logcash.getDataADAL3Error = 'GET value is wrong';
        }

        //debugger;
        logcash.dropTablesSchemaName1 = logcash.createFirstSchema.Name;
        logcash.dropTablesCount1 = 0;
        await dropTables1();
    }

    async function dropTables1() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.dropTablesSchemaName1 + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            },
        );
        if (res.Ok) {
            logcash.dropTablesCount1++;
            if (logcash.dropTablesCount1 == 1) {
                logcash.dropTablesSchemaName1 = logcash.createSecondSchema2.Name;
                await dropTables1();
            } else {
                logcash.dropTables1Status = true;
                await createSchemaToPageKeyTest();
            }
        } else {
            logcash.dropTables1Status = false;
            logcash.dropTables1Error = 'Drop tables failed.';
            await createSchemaToPageKeyTest();
        }
        //await createSchemaToPageKeyTest();
    }

    //#endregion GET from doc DB on schema with references fields doesn't return the default fields (except Key)

    //#region https://pepperi.atlassian.net/browse/DI-21960 PageKey -search on elastic with fields from dinamo

    async function createSchemaToPageKeyTest() {
        //positive: change field by type Int to indexed String
        logcash.createSchemaToPageKeyTest = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Name: 'pageKeyTest' + generalService.generateRandomString(6),
                    Type: 'data',
                    Fields: {
                        // IndexedString1: { Type: 'String', Indexed: true },
                        Field1: { Type: 'Integer', Indexed: true },
                        Field2: { Type: 'String' },
                        IndexedString2: { Type: 'String', Indexed: true },
                        IndexedInt1: { Type: 'Integer', Indexed: true },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaToPageKeyTest.Hidden == false &&
            logcash.createSchemaToPageKeyTest.Type == 'data' &&
            logcash.createSchemaToPageKeyTest.Fields.IndexedString2.Type == 'String' &&
            logcash.createSchemaToPageKeyTest.Fields.IndexedString2.Indexed == true &&
            logcash.createSchemaToPageKeyTest.Fields.IndexedInt1.Type == 'Integer' &&
            logcash.createSchemaToPageKeyTest.Fields.IndexedInt1.Indexed == true
        ) {
            logcash.createSchemaToPageKeyTestStatus = true;
        } else {
            logcash.createSchemaToPageKeyTestStatus = false;
            logcash.createSchemaToPageKeyTestErrorMessage = 'One of parameters on Schema creation get with wrong value';
        }
        await insertDataToIndexedTableFirst100();
    }

    async function insertDataToIndexedTableFirst100() {
        let counter = 0;
        for (counter; counter < 99; counter++) {
            logcash.randomInt = Math.floor(Math.random() * 5);
            logcash.insertDataToIndexedTableFirst100 = await generalService
                .fetchStatus(
                    baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSchemaToPageKeyTest.Name,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + token,
                            //'X-Pepperi-OwnerID': addonUUID,
                            'X-Pepperi-SecretKey': whaitSecretKey,
                            'x-pepperi-await-indexing': 'true', //oleg DI-22540
                        },
                        body: JSON.stringify({
                            Key: `${counter}`,
                            IndexedInt1: logcash.randomInt, //counter,
                            IndexedString2: 'IndexedString2-' + counter,
                            Field1: counter,
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
        await getDataPageKey1();
    }
    async function getDataPageKey1() {
        logcash.getDataPageKey1 = await generalService
            .fetchStatus(
                baseURL + '/addons/data/search/' + whaitOwnerUUID + '/' + logcash.createSchemaToPageKeyTest.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        PageSize: 40,
                        Fields: ['IndexedInt1', 'IndexedString2', 'Field1'],
                        OrderBy: 'Field1',
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (logcash.getDataPageKey1.Objects.length == 40) {
            logcash.getDataPageKey1Status = true;
        } else {
            logcash.getDataPageKey1Status = false;
            logcash.getDataPageKey1Error = 'Will get 40 docs on page';
        }
        //debugger;
        await getDataPageKey2();
    }
    async function getDataPageKey2() {
        logcash.getDataPageKey2 = await generalService
            .fetchStatus(
                baseURL + '/addons/data/search/' + whaitOwnerUUID + '/' + logcash.createSchemaToPageKeyTest.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        PageSize: 40,
                        Fields: ['IndexedInt1', 'IndexedString2', 'Field2'],
                        OrderBy: 'Field1',
                        PageKey: logcash.getDataPageKey1.NextPageKey,
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (logcash.getDataPageKey2.Objects.length == 40) {
            logcash.getDataPageKey2Status = true;
        } else {
            logcash.getDataPageKey2Status = false;
            logcash.getDataPageKey2Error = 'Will get 40 docs on page';
        }
        //debugger;
        await getDataPageKey3();
    }

    async function getDataPageKey3() {
        logcash.getDataPageKey3 = await generalService
            .fetchStatus(
                baseURL + '/addons/data/search/' + whaitOwnerUUID + '/' + logcash.createSchemaToPageKeyTest.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        PageSize: 40,
                        Fields: ['IndexedInt1', 'IndexedString2', 'Field1'],
                        OrderBy: 'Field1',
                        PageKey: logcash.getDataPageKey2.NextPageKey,
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDataPageKey3.Objects.length == 19 &&
            logcash.getDataPageKey1Status == true &&
            logcash.getDataPageKey2Status == true
        ) {
            logcash.getDataPageKey3Status = true;
        } else {
            logcash.getDataPageKey3Status = false;
            logcash.getDataPageKey3Error = 'Failed on one of 3 gets with PageKey';
        }
        //debugger;
        await dropPageKeyTestTable();
    }

    async function dropPageKeyTestTable() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaToPageKeyTest.Name + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
            },
        );
        //debugger;
        if (res.Ok) {
            logcash.dropPageKeyTestTableStatus = true;
        } else {
            logcash.dropPageKeyTestTableStatus = false;
            logcash.dropPageKeyTestTableError = 'Drop table failed.';
        }

        await createSchemaToPageKeyTestDinamo();
    }

    //#endregion search by PageKey - just not indexed fields

    async function createSchemaToPageKeyTestDinamo() {
        //positive: change field by type Int to indexed String
        logcash.createSchemaToPageKeyTestDinamo = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Name: 'pageKeyTest' + generalService.generateRandomString(6),
                    Type: 'data',
                    Fields: {
                        // IndexedString1: { Type: 'String', Indexed: true },
                        Field1: { Type: 'Integer' },
                        Field2: { Type: 'String' },
                        String2: { Type: 'String' },
                        Int1: { Type: 'Integer' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaToPageKeyTestDinamo.Hidden == false &&
            logcash.createSchemaToPageKeyTestDinamo.Type == 'data' &&
            logcash.createSchemaToPageKeyTestDinamo.Fields.String2.Type == 'String' &&
            //logcash.createSchemaToPageKeyTestDinamo.Fields.String2.Indexed == false &&
            logcash.createSchemaToPageKeyTestDinamo.Fields.Int1.Type == 'Integer' //&&
            //logcash.createSchemaToPageKeyTestDinamo.Fields.Int1.Indexed == false
        ) {
            logcash.createSchemaToPageKeyTestDinamoStatus = true;
        } else {
            logcash.createSchemaToPageKeyTestDinamoStatus = false;
            logcash.createSchemaToPageKeyTestErrorMessage = 'One of parameters on Schema creation get with wrong value';
        }
        await insertDataToIndexedTable25();
    }

    async function insertDataToIndexedTable25() {
        let counter = 0;
        for (counter; counter < 25; counter++) {
            logcash.randomInt = Math.floor(Math.random() * 5);
            logcash.insertDataToIndexedTable25 = await generalService
                .fetchStatus(
                    baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSchemaToPageKeyTestDinamo.Name,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + token,
                            //'X-Pepperi-OwnerID': addonUUID,
                            'X-Pepperi-SecretKey': whaitSecretKey,
                            'x-pepperi-await-indexing': 'true', //oleg DI-22540
                        },
                        body: JSON.stringify({
                            Key: `${counter}`,
                            Int1: logcash.randomInt, //counter,
                            String2: 'String2-' + counter,
                            Field1: counter,
                            Field2: 'String1-' + counter,
                        }),
                    },
                )
                .then((res) => [res.Status, res.Body]);
            //debugger;
            if (logcash.insertDataToIndexedTable25[0] == 200) {
                logcash.insertDataToIndexedTable25Status = true;
            } else {
                logcash.insertDataToIndexedTable25Status = false;
                logcash.insertDataToIndexedTable25Error = 'Insert data failed on try number: ' + counter;
            }
        }
        counter = 0;
        //debugger;
        await getDataPageKeyFromDinamo1();
    }
    async function getDataPageKeyFromDinamo1() {
        logcash.getDataPageKeyFromDinamo1 = await generalService
            .fetchStatus(
                baseURL + '/addons/data/search/' + whaitOwnerUUID + '/' + logcash.createSchemaToPageKeyTestDinamo.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        PageSize: 10,
                        Fields: ['Int1', 'String2', 'Field1'],
                        OrderBy: 'CreationDateTime', //https://pepperi.atlassian.net/browse/DI-22921 verification
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (logcash.getDataPageKeyFromDinamo1.Objects.length == 10) {
            logcash.getDataPageKeyFromDinamo1Status = true;
        } else {
            logcash.getDataPageKeyFromDinamo1Status = false;
            logcash.getDataPageKeyFromDinamo1Error = 'Will get 10 docs on page';
        }
        //debugger;
        await getDataPageKeyFromDinamo2();
    }
    async function getDataPageKeyFromDinamo2() {
        logcash.getDataPageKeyFromDinamo2 = await generalService
            .fetchStatus(
                baseURL + '/addons/data/search/' + whaitOwnerUUID + '/' + logcash.createSchemaToPageKeyTestDinamo.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        PageSize: 10,
                        Fields: ['Int1', 'String2', 'Field2'],
                        PageKey: logcash.getDataPageKeyFromDinamo1.NextPageKey,
                        OrderBy: 'CreationDateTime',
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (logcash.getDataPageKeyFromDinamo2.Objects.length == 10) {
            logcash.getDataPageKeyFromDinamo2Status = true;
        } else {
            logcash.getDataPageKeyFromDinamo2Status = false;
            logcash.getDataPageKeyFromDinamo2Error = 'Will get 10 docs on page';
        }
        //debugger;
        await getDataPageKeyFromDinamo3();
    }

    async function getDataPageKeyFromDinamo3() {
        logcash.getDataPageKeyFromDinamo3 = await generalService
            .fetchStatus(
                baseURL + '/addons/data/search/' + whaitOwnerUUID + '/' + logcash.createSchemaToPageKeyTestDinamo.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        PageSize: 10,
                        Fields: ['Int1', 'String2', 'Field1'],
                        OrderBy: 'CreationDateTime',
                        PageKey: logcash.getDataPageKeyFromDinamo2.NextPageKey,
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDataPageKeyFromDinamo3.Objects.length == 5 &&
            logcash.getDataPageKeyFromDinamo1Status == true &&
            logcash.getDataPageKeyFromDinamo2Status == true &&
            logcash.getDataPageKeyFromDinamo3.NextPageKey == undefined
        ) {
            logcash.getDataPageKeyFromDinamo3Status = true;
        } else {
            logcash.getDataPageKeyFromDinamo3Status = false;
            logcash.getDataPageKeyFromDinamo3Error = 'Failed on one of 3 gets with PageKey';
        }
        //debugger;
        await dropPageKeyTestTable1();
    }

    async function dropPageKeyTestTable1() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaToPageKeyTestDinamo.Name + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
            },
        );
        //debugger;
        if (res.Ok) {
            logcash.dropPageKeyTestTable1Status = true;
        } else {
            logcash.dropPageKeyTestTable1Status = false;
            logcash.dropPageKeyTestTable1Error = 'Drop table failed.';
        }
        await createSchemaDI24110();
    }

    //#region indexed ADAL pns on value change upload not indexed fields DI-24110

    async function createSchemaDI24110() {
        logcash.createSchemaDI24110 = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Name: 'testSchema' + generalService.generateRandomString(6),
                    Type: 'data',
                    DataSourceData: {
                        IndexName: 'my_index_' + generalService.generateRandomString(3),
                        //NumberOfShards: 3
                    },
                    StringIndexName: 'my_index',
                    Fields: {
                        // IndexedString1: { Type: 'String', Indexed: true },
                        Field1: { Type: 'String' },
                        Field2: { Type: 'Integer', Indexed: true },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaDI24110.Hidden == false &&
            logcash.createSchemaDI24110.Type == 'data' &&
            logcash.createSchemaDI24110.Fields.Field2.Type == 'Integer' &&
            logcash.createSchemaDI24110.Fields.Field1.Type == 'String' //&&
        ) {
            logcash.createSchemaDI24110Status = true;
        } else {
            logcash.createSchemaDI24110Status = false;
            logcash.createSchemaDI24110Message = 'One of parameters on Schema creation get with wrong value';
        }
        await insertDataToTestTable();
    }

    async function insertDataToTestTable() {
        let counter = 0;
        for (counter; counter < 25; counter++) {
            //logcash.randomInt = Math.floor(Math.random() * 5);
            logcash.insertDataToTestTable = await generalService
                .fetchStatus(baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSchemaDI24110.Name, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': whaitSecretKey,
                        'x-pepperi-await-indexing': 'true', //oleg DI-22540
                    },
                    body: JSON.stringify({
                        Key: `${counter}`,
                        Field2: counter,
                        Field1: 'String1-' + counter,
                    }),
                })
                .then((res) => [res.Status, res.Body]);
            //debugger;
            if (logcash.insertDataToTestTable[0] == 200) {
                logcash.insertDataToTestTableStatus = true;
            } else {
                logcash.insertDataToTestTableStatus = false;
                logcash.insertDataToTestTableError = 'Insert data failed on try number: ' + counter;
            }
        }
        counter = 0;
        //debugger;
        await createSchemaDI23704();
    }
    ////////// Search over fields that aren't indexed returns empty array DI-23704
    async function createSchemaDI23704() {
        logcash.createSchemaDI23704 = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Name: 'testSchemaTmp' + generalService.generateRandomString(6),
                    Type: 'data',
                    DataSourceData: {
                        IndexName: logcash.createSchemaDI24110.DataSourceData.IndexName,
                        //NumberOfShards: 3
                    },
                    StringIndexName: 'my_index',
                    Fields: {
                        // IndexedString1: { Type: 'String', Indexed: true },
                        Field1: { Type: 'String', Indexed: true },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaDI23704.Hidden == false &&
            logcash.createSchemaDI23704.Type == 'data' &&
            logcash.createSchemaDI23704.Fields.Field1.Type == 'String' //&&
        ) {
            logcash.createSchemaDI23704Status = true;
        } else {
            logcash.createSchemaDI23704Status = false;
            logcash.createSchemaDI23704Message = 'One of parameters on Schema creation get with wrong value';
        }
        await getByNotIndexedFieldNegative();
    }

    async function getByNotIndexedFieldNegative() {
        logcash.getByNotIndexedFieldNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/search/' + whaitOwnerUUID + '/' + logcash.createSchemaDI24110.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': addonUUID,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    PageSize: 40,
                    Fields: ['Field1'],
                    OrderBy: 'Field1',
                    //PageKey: logcash.getDataPageKey2.NextPageKey,
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getByNotIndexedFieldNegative.fault.faultstring ==
            'Failed due to exception: Field "Field1" is not indexed'
            // logcash.getDataPageKey1Status == true &&
            // logcash.getDataPageKey2Status == true
        ) {
            logcash.getByNotIndexedFieldNegativeStatus = true;
        } else {
            logcash.getByNotIndexedFieldNegativeStatus = false;
            logcash.getByNotIndexedFieldNegativeError = 'Will get error';
        }
        //debugger;
        await dropTestTableTmp();
    }

    async function dropTestTableTmp() {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaDI23704.Name + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
            },
        );
        //debugger;
        if (res.Ok) {
            logcash.dropTestTableTmpStatus = true;
        } else {
            logcash.dropTestTableTmpStatus = false;
            logcash.dropTestTableTmpError = 'Drop table failed.';
        }
        await getFromElasticTable();
    }
    ////////////
    async function getFromElasticTable() {
        // get data from elastic
        //logcash.getDataDedicatedStatus = true;
        logcash.getFromElasticTable = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/shared_index/index/' +
                    logcash.createSchemaDI24110.DataSourceData.IndexName +
                    '/' +
                    adalOwnerId +
                    '/' +
                    whaitOwnerUUID +
                    '~' +
                    logcash.createSchemaDI24110.Name,
                //  +
                // '?fields=testString1,ElasticSearchType,Key',
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                        'x-pepperi-await-indexing': 'true',
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getFromElasticTable.length == 25 &&
            //logcash.getFromElasticTable[0].Field2 == 0 &&
            logcash.getFromElasticTable[0].Field1 == undefined
        ) {
            logcash.getFromElasticTableStatus = true;
        } else {
            logcash.getFromElasticTableStatus = false;
            logcash.getFromElasticTableError = 'Wrong value in elastic table';
        }
        //debugger;
        await updateTestTable();
    }

    async function updateTestTable() {
        logcash.updateTestTable = await generalService
            .fetchStatus(baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSchemaDI24110.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Key: '0',
                    Field2: 99,
                    Field1: 'Updated table value',
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.updateTestTable[0] == 200) {
            logcash.updateTestTableStatus = true;
        } else {
            logcash.updateTestTableStatus = false;
            logcash.updateTestTableError = 'Update data to Accounts table failed';
        }
        generalService.sleep(3000);
        await getFromElasticTableSec();
    }

    async function getFromElasticTableSec() {
        // get data from elastic
        //logcash.getDataDedicatedStatus = true;
        logcash.getFromElasticTableSec = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/shared_index/index/' +
                    logcash.createSchemaDI24110.DataSourceData.IndexName +
                    '/' +
                    adalOwnerId +
                    '/' +
                    whaitOwnerUUID +
                    '~' +
                    logcash.createSchemaDI24110.Name +
                    '?where=Key="0"',
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                        'x-pepperi-await-indexing': 'true',
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getFromElasticTableSec.length == 1 &&
            logcash.getFromElasticTableSec[0].Field2 == 99 &&
            logcash.getFromElasticTableSec[0].Field1 == undefined
        ) {
            logcash.getFromElasticTableSecStatus = true;
        } else {
            logcash.getFromElasticTableSecStatus = false;
            logcash.getFromElasticTableSecError = 'Wrong value in elastic table';
        }
        //debugger;
        await cleanRebuildSec();
    }

    /////  clean rebuild - no need lock on post DI-23586
    async function cleanRebuildSec() {
        logcash.cleanRebuildSec = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/api/async/' +
                    adalOwnerId +
                    '/' +
                    'indexed_adal_api/clean_rebuild?table_name=' +
                    logcash.createSchemaDI24110.Name,
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
        if (logcash.cleanRebuildSec[0] == 200) {
            logcash.cleanRebuildSecStatus = true;
        } else {
            logcash.cleanRebuildSecStatus = false;
            logcash.cleanRebuildSecError = 'Clean rebuild failed';
        }

        //debugger;
        generalService.sleep(500);
        await updateTestTableSec();
    }

    async function updateTestTableSec() {
        logcash.updateTestTableSec = await generalService
            .fetchStatus(baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSchemaDI24110.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Key: '0',
                    Field2: 199,
                    Field1: 'Updated2 table value',
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (logcash.updateTestTableSec[0] == 200) {
            logcash.updateTestTableSecStatus = true;
        } else {
            logcash.updateTestTableSecStatus = false;
            logcash.updateTestTableSecError = 'Update data to Accounts table failed';
        }
        generalService.sleep(2000);
        await getFromElasticTable3();
    }

    async function getFromElasticTable3() {
        // get data from elastic
        //logcash.getDataDedicatedStatus = true;
        logcash.getFromElasticTable3 = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/shared_index/index/' +
                    logcash.createSchemaDI24110.DataSourceData.IndexName +
                    '/' +
                    adalOwnerId +
                    '/' +
                    whaitOwnerUUID +
                    '~' +
                    logcash.createSchemaDI24110.Name +
                    '?where=Key="0"',
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                        'x-pepperi-await-indexing': 'true',
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getFromElasticTable3.length == 1 &&
            logcash.getFromElasticTable3[0].Field2 == 199 &&
            logcash.getFromElasticTable3[0].Field1 == undefined
        ) {
            logcash.getFromElasticTable3Status = true;
        } else {
            logcash.getFromElasticTable3Status = false;
            logcash.getFromElasticTable3Error = 'Wrong value in elastic table';
        }
        //debugger;
        await truncateTestTableLast();
    }

    //truncate table
    async function truncateTestTableLast() {
        const res6 = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaDI24110.Name + '/truncate',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
            },
        );
        //debugger;
        if (res6.Ok && res6.Body.ProcessedCounter == 25 && res6.Ok && res6.Body.Done == true) {
            logcash.truncateTestTableLastStatus = true;
        } else {
            logcash.truncateTestTableLastStatus = false;
            logcash.truncateTestTableLastError = 'Truncate table failed.';
        }
        await getFromElasticTable4();
    }

    async function getFromElasticTable4() {
        // get data from elastic
        //logcash.getDataDedicatedStatus = true;
        logcash.getFromElasticTable4 = await generalService
            .fetchStatus(
                baseURL +
                    '/addons/shared_index/index/' +
                    logcash.createSchemaDI24110.DataSourceData.IndexName +
                    '/' +
                    adalOwnerId +
                    '/' +
                    whaitOwnerUUID +
                    '~' +
                    logcash.createSchemaDI24110.Name +
                    '?where=Key="0"',
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        //'X-Pepperi-SecretKey': logcash.secretKey,
                        'x-pepperi-await-indexing': 'true',
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (logcash.getFromElasticTable4[0] == undefined) {
            logcash.getFromElasticTable4Status = true;
        } else {
            logcash.getFromElasticTable4Status = false;
            logcash.getFromElasticTable4Error = 'Wrong value in elastic table';
        }
        //debugger;
        await getDataFromDinamoLast();
    }
    async function getDataFromDinamoLast() {
        logcash.getDataFromDinamoLast = await generalService
            .fetchStatus(baseURL + '/addons/data/search/' + whaitOwnerUUID + '/' + logcash.createSchemaDI24110.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': addonUUID,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    PageSize: 10,
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.getDataFromDinamoLast.Objects[0] == undefined) {
            logcash.getDataFromDinamoLastStatus = true;
        } else {
            logcash.getDataFromDinamoLastStatus = false;
            logcash.getDataFromDinamoLastError = 'The doc will be removed';
        }
        //debugger;
        await dropTestTableLast();
    }

    async function dropTestTableLast() {
        const res5 = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaDI24110.Name + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
            },
        );
        //debugger;
        if (res5.Ok) {
            logcash.dropTestTableStatus = true;
        } else {
            logcash.dropTestTableStatus = false;
            logcash.dropTestTableError = 'Drop table failed.';
        }
        //await createSchemaDI24110();
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
