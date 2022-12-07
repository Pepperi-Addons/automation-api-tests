import GeneralService, { TesterFunctions } from '../services/general.service';
import { v4 as newUuid } from 'uuid';

export async function DocDBIndexedAdal(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const assert = tester.assert;
    const expect = tester.expect;
    const it = tester.it;

    const whaitOwnerUUID = '2c199913-dba2-4533-ad78-747b6553acf8';
    const whaitSecretKey = '55cd2b56-2def-4e4e-b461-a56eb3e31689';
    //const adalOwnerId = '00000000-0000-0000-0000-00000000ada1';

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
        'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', '1.1.1'],
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
            it('Create Schema (name accounts) with owner not from white list and without indexed fields', async () => {
                assert(logcash.createMainSchemaStatus, logcash.createMainSchemaErrorMessage);
            });
            it('Insert data to created account schema', () => {
                assert(logcash.insertDataToAccountsTableStatus, logcash.insertDataToAccountsTableError);
            });
            it('Create Schema (name survey) with white liste owner and indexeded fields with resource fields from accounts schema', () => {
                assert(logcash.createSecondSchemaStatus, logcash.createSecondSchemaErrorMessage);
            });
            it('Insert data to created survey schema ', () => {
                assert(logcash.insertDataToSurveyTableStatus, logcash.insertDataToSurveyTableError);
            });
        });
        describe('Drop created schemas of the end of test', () => {
            it('Drop account schema', () => {
                assert(logcash.dropAccountsTableStatus, logcash.dropAccountsTableError);
            });
            it('Drop survey schema', () => {
                assert(logcash.dropSurveyTableStatus, logcash.dropSurveyTableError);
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
        //await installADallAddon();
        await createMainSchema();
    }

    //#region First Schema creation

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
                    Name: 'account_test' + newUuid(),
                    Type: 'data',
                    DataSourceData: {
                        IndexName: 'my_index',
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
            logcash.createMainSchema.Fields.Name.Type == 'String'
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
        await createSecondSchema();
    }

    async function createSecondSchema() {
        logcash.createSecondSchema = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Name: 'survey_test' + newUuid(),
                    Type: 'data',
                    DataSourceData: {
                        IndexName: 'my_index',
                        //NumberOfShards: 3
                    },
                    StringIndexName: 'my_index',
                    Fields: {
                        test: { Type: 'Integer', Indexed: true },
                    },
                    Account: {
                        Type: 'Resource',
                        AddonUUID: addonUUID,
                        Indexed: true,
                        IndexedFields: {
                            Name: { Type: 'String', Indexed: true },
                        },
                    },
                }),
            })
            .then((res) => res.Body);
        debugger;
        if (
            logcash.createSecondSchema.Name.includes('survey_test') &&
            logcash.createSecondSchema.Hidden == false &&
            logcash.createSecondSchema.Type == 'data' &&
            logcash.createSecondSchema.Fields.test.Type == 'Integer' &&
            logcash.createSecondSchema.Account.AddonUUID == addonUUID &&
            logcash.createSecondSchema.Account.Type == 'Resource' &&
            logcash.createSecondSchema.Account.IndexedFields.Name.Indexed == true
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
                    Account: '5',
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
        await getSurveyScheme();
    }

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
        debugger;
        if (
            logcash.getSurveyScheme.AddonUUID == whaitOwnerUUID //&&
            // logcash.getSurveyScheme.Fields.CreationDateTime.Indexed == true &&
            // logcash.getSurveyScheme.Fields.CreationDateTime.Type == 'DateTime' &&
            // logcash.getSurveyScheme.Fields.Hidden.Indexed == true &&
            // logcash.getSurveyScheme.Fields.Hidden.Type == 'Bool' &&
            // logcash.getSurveyScheme.Fields.Key.Keyword == true &&
            // logcash.getSurveyScheme.Fields.Key.Indexed == true &&
            // logcash.getSurveyScheme.Fields.Key.Type == 'String' &&
            // logcash.getSurveyScheme.Fields.ModificationDateTime.Indexed == true &&
            // logcash.getSurveyScheme.Fields.ModificationDateTime.Type == 'DateTime' &&
            // logcash.getSurveyScheme.Fields.TestDateTime.Indexed == true &&
            // logcash.getSurveyScheme.Fields.TestDateTime.Type == 'DateTime' &&
            // logcash.getSurveyScheme.Fields.testString.Indexed == true &&
            // logcash.getSurveyScheme.Fields.testString.Type == 'String'
        ) {
            logcash.getSurveySchemeStatus = true;
        } else {
            logcash.getSurveySchemeStatus = false;
            logcash.getSurveySchemeErrorMessage = 'The survey scheme will be created, but actuall get empty ';
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
        //await createSchemaTypeDataIndex();
    }
}
