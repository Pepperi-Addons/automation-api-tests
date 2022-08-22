import GeneralService, { TesterFunctions } from '../services/general.service';
import { v4 as newUuid } from 'uuid';

export async function SchemaTypeDataIndexedTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const assert = tester.assert;
    const expect = tester.expect;
    const it = tester.it;

    const whaitOwnerUUID = '2c199913-dba2-4533-ad78-747b6553acf8';
    const whaitSecretKey = '55cd2b56-2def-4e4e-b461-a56eb3e31689';
    const adalOwnerId ='00000000-0000-0000-0000-00000000ada1';
    

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
        'training' :['2c199913-dba2-4533-ad78-747b6553acf8','0.0.12'],
        Logs: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', ''],
        'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c','']
        
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
         
        
        describe('Create Schema type data with indexed fields + elastic verification', () => {
            it('Test Initiation', async () => {
                // this will run the first test that will run the second and so on..Its test initiation
                await getSecretKey();
            });
            it('Create Schema with indexed fileds with OwnerID - not from white list', async () => {

                assert(logcash.createSchemaTypeDataIndexNegativeStatus, logcash.createSchemaTypeDataIndexNegativeErrorMessage);
            });
            it('Get dedicated schema - negative', () => {
                assert(logcash.getDedicatedSchemeNegativeStatus, logcash.getDedicatedSchemeNegativeErrorMessage);
            });
            it('Drop created schema', () => {
                assert(logcash.dropTableStatus, logcash.dropTableError);
            });
        });
        describe('Create schema with indexed fields positive, Upsert Schema, Insert data, Clean rebuild', () => {
            it('Create Scheme with indexed fields and white list OwnerID ', () => {
                assert(logcash.createSchemaTypeDataIndexStatus, logcash.createSchemaTypeDataIndexErrorMessage);
            });
            it('Get dedicated schema', () => {
                assert( logcash.getDedicatedSchemeStatus, logcash.getDedicatedSchemeErrorMessage);
            });
            
            it('Upsert schema fields - change fields to indexed', () => {
                assert(logcash.upsertSchemaTypeDataIndexStatus, logcash.upsertSchemaTypeDataIndexErrorMessage);
            });
            it('Get dedicated schema after upsert', () => {
                assert(logcash.getDedicatedSchemeAferUpsertStatus, logcash.getDedicatedSchemeAferUpsertErrorMessage);
            });
            it('Insert Data(10 objects) to all fields ', () => {
                assert(logcash.insertDataToDataTableStatus, logcash.insertDataToDataTableError);
            });
            it('Get Data From dedicated table', () => {
                assert(logcash.getDataDedicatedStatus, logcash.getDataDedicatedError);     
            });
            it('Get Data From ADAL table', () => {
                assert(logcash.getDataDedicatedStatus, logcash.getDataDedicatedError);
            });
            it('Drop Existing Table: Finished', () => {
                assert(logcash.getDataADALStatus, logcash.getDataADALError);   
            });
            it('Upsert ADAL schema fields type to indexed', () => {
                assert(logcash.upsertSchemaAddIndexedFieldStatus, logcash.upsertSchemaAddIndexedFieldErrorMessage);
            });
            it('Clean rebuild elastic data', () => {
                assert(logcash.cleanRebuildStatus, logcash.cleanRebuildError);
            });
            it('Sudit log resoult', () => {
                assert(logcash.getAuditLogStatus, logcash.getAuditLogError);
            });
            it('Verify data on elastic after clean rebuild', () => {
                assert(logcash.getDataDedicatedAfterInsertStatus, logcash.getDataDedicatedAfterInsertError);
            });
            it('Drop schema', () => {
                assert(logcash.dropTableSecStatus, logcash.dropTableSecError);
            });
            it('Verify if the dedicated schema deleted ', () => {
                assert(logcash.getDataDedicatedAfterDropStatus, logcash.getDataDedicatedAfterDropError);
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
        await createSchemaTypeDataIndexNegative();
    }

   
    //#region Schema creation negative - owner and secret not from whait list addon
    
    // create schema type data with owner/secret not from white list. Just root schema will be created
    async function createSchemaTypeDataIndexNegative() {
        logcash.createSchemaTypeDataIndexNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'Negative_Index_not_created',
                    Type: 'data',
                    StringIndexName: 'my_index_table',
                    Fields: {
                        testString: { Type: 'String', Indexed: true },
                        testBoolean: { Type: 'Bool' },
                        TestInteger: { Type: 'Integer' },
                        TestDouble: { Type: 'Double' },
                        TestDateTime: {Type: 'DateTime', Indexed: true}
                    },
                    
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaTypeDataIndexNegative.Name == 'Negative_Index_not_created' &&
            logcash.createSchemaTypeDataIndexNegative.Hidden == false &&
            logcash.createSchemaTypeDataIndexNegative.Type == 'data' &&
            logcash.createSchemaTypeDataIndexNegative.Fields.testBoolean.Type == 'Bool' &&
            logcash.createSchemaTypeDataIndexNegative.Fields.TestInteger.Type == 'Integer' &&
            logcash.createSchemaTypeDataIndexNegative.Fields.testString.Type == 'String' &&
            logcash.createSchemaTypeDataIndexNegative.Fields.TestDouble.Type == 'Double' &&
            logcash.createSchemaTypeDataIndexNegative.Fields.TestDateTime.Type == 'DateTime'
        ) {
            logcash.createSchemaTypeDataIndexNegativeStatus = true;
        } else {
            logcash.createSchemaTypeDataIndexNegativeStatus = false;
            logcash.createSchemaTypeDataIndexNegativeErrorMessage =
                'One of parameters on Schema updating get with wrong value: ' + logcash.createSchemaTypeDataIndexNegative;
        }
        await getDedicatedSchemeNegative();
    }

    async function getDedicatedSchemeNegative() {
        logcash.getDedicatedSchemeNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes'+ '/' + addonUUID + '_' + logcash.createSchemaTypeDataIndexNegative.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': adalOwnerId,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
                
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDedicatedSchemeNegative.fault.faultstring.includes('Failed due to exception: Object ID does not exist.')
            
        ) {
            logcash.getDedicatedSchemeNegativeStatus = true;
        } else {
            logcash.getDedicatedSchemeNegativeStatus = false;
            logcash.getDedicatedSchemeNegativeErrorMessage =
                'The dedicated scheme will be not created, because the owner and secret is not from the whait list addon ';
        }
        await dropTable();
    }

    async function dropTable() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaTypeDataIndexNegative.Name + '/purge',
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
            logcash.dropTableStatus = true;
        } else {
            logcash.dropTableStatus = false;
            logcash.dropTableError = 'Drop schema failed. Error message is: ' + logcash.dropTable;
        }
        await createSchemaTypeDataIndex();
    }
    //#endregion Schema creation negative - owner and secret not from whait list addon

    //#region Schema creation positive - Owner and SekretKey fom white list addon
    async function createSchemaTypeDataIndex() {
        logcash.createSchemaTypeDataIndex = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    //Name: ('DataTypeIndexedTable' + Date()).replace(/\s+/g, ""),
                    Name: ('DataTypeIndexedTable' + newUuid()),
                    Type: 'data',
                    StringIndexName: 'my_index_table',
                    Fields: {
                        testString: { Type: 'String', Indexed: true },
                        testBoolean: { Type: 'Bool' },
                        TestInteger: { Type: 'Integer' },
                        TestDouble: { Type: 'Double' },
                        TestDateTime: {Type: 'DateTime', Indexed: true}
                    },
                    
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaTypeDataIndex.Name.includes('DataTypeIndexedTable') &&
            logcash.createSchemaTypeDataIndex.Hidden == false &&
            logcash.createSchemaTypeDataIndex.Type == 'data' &&
            logcash.createSchemaTypeDataIndex.Fields.testBoolean.Type == 'Bool' &&
            logcash.createSchemaTypeDataIndex.Fields.TestInteger.Type == 'Integer' &&
            logcash.createSchemaTypeDataIndex.Fields.testString.Type == 'String' &&
            logcash.createSchemaTypeDataIndex.Fields.TestDouble.Type == 'Double' &&
            logcash.createSchemaTypeDataIndex.Fields.TestDateTime.Type == 'DateTime'
        ) {
            logcash.createSchemaTypeDataIndexStatus = true;
        } else {
            logcash.createSchemaTypeDataIndexStatus = false;
            logcash.createSchemaTypeDataIndexErrorMessage =
                'One of parameters on Schema updating get with wrong value: ' + logcash.createSchemaTypeDataIndex;
        }
        await getDedicatedScheme();
    }

    async function getDedicatedScheme() {
        logcash.getDedicatedScheme = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes/' + whaitOwnerUUID + '_' + logcash.createSchemaTypeDataIndex.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': adalOwnerId,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
                
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDedicatedScheme.AddonUUID == adalOwnerId &&
            logcash.getDedicatedScheme.Fields.CreationDateTime.Indexed == true &&
            logcash.getDedicatedScheme.Fields.CreationDateTime.Type == 'DateTime' &&
            logcash.getDedicatedScheme.Fields.Hidden.Indexed == true &&
            logcash.getDedicatedScheme.Fields.Hidden.Type == 'Bool' &&
            logcash.getDedicatedScheme.Fields.Key.Keyword == true &&
            logcash.getDedicatedScheme.Fields.Key.Indexed == true &&
            logcash.getDedicatedScheme.Fields.Key.Type == 'String' &&
            logcash.getDedicatedScheme.Fields.ModificationDateTime.Indexed == true &&
            logcash.getDedicatedScheme.Fields.ModificationDateTime.Type == 'DateTime'&&
            logcash.getDedicatedScheme.Fields.TestDateTime.Indexed == true &&
            logcash.getDedicatedScheme.Fields.TestDateTime.Type == 'DateTime' &&
            logcash.getDedicatedScheme.Fields.testString.Indexed == true &&
            logcash.getDedicatedScheme.Fields.testString.Type =='String'

        ) {
            logcash.getDedicatedSchemeStatus = true;
        } else {
            logcash.getDedicatedSchemeStatus = false;
            logcash.getDedicatedSchemeErrorMessage =
                'The dedicated scheme will be created, but actuall get empty ';
        }
        await upsertSchemaTypeDataIndex();
    }

    // upsert fields : change bolean,integerand double to indexed and add secString and secInteger not indexed
    async function upsertSchemaTypeDataIndex() {
        logcash.upsertSchemaTypeDataIndex = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaTypeDataIndex.Name,
                    Type: 'data',
                    StringIndexName: 'my_index_table',
                    Fields: {
                        testString: { Type: 'String', Indexed: true },
                        testBoolean: { Type: 'Bool' , Indexed: true},
                        TestInteger: { Type: 'Integer' , Indexed: true },
                        TestDouble: { Type: 'Double' , Indexed: true},
                        TestDateTime: {Type: 'DateTime', Indexed: true},
                        secString: {Type: 'String'},
                        secInteger: { Type: 'Integer' }
                    },
                    
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.upsertSchemaTypeDataIndex.Name.includes ('DataTypeIndexedTable') &&
            logcash.upsertSchemaTypeDataIndex.Hidden == false &&
            logcash.upsertSchemaTypeDataIndex.Type == 'data' &&
            logcash.upsertSchemaTypeDataIndex.Fields.testBoolean.Type == 'Bool' &&
            logcash.upsertSchemaTypeDataIndex.Fields.TestInteger.Type == 'Integer' &&
            logcash.upsertSchemaTypeDataIndex.Fields.testString.Type == 'String' &&
            logcash.upsertSchemaTypeDataIndex.Fields.TestDouble.Type == 'Double' &&
            logcash.upsertSchemaTypeDataIndex.Fields.TestDateTime.Type == 'DateTime' &&
            logcash.upsertSchemaTypeDataIndex.Fields.secString.Type == 'String' &&
            logcash.upsertSchemaTypeDataIndex.Fields.secInteger.Type == 'Integer'
        ) {
            logcash.upsertSchemaTypeDataIndexStatus = true;
        } else {
            logcash.upsertSchemaTypeDataIndexStatus = false;
            logcash.upsertSchemaTypeDataIndexErrorMessage =
                'One of parameters on Schema updating get with wrong value: ' + logcash.upsertSchemaTypeDataIndex;
        }
        await getDedicatedSchemeAferUpsert();
    }

    async function getDedicatedSchemeAferUpsert() {
        logcash.getDedicatedSchemeAferUpsert = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes/' + whaitOwnerUUID + '_' + logcash.createSchemaTypeDataIndex.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': adalOwnerId,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
                
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDedicatedSchemeAferUpsert.AddonUUID == adalOwnerId &&
            logcash.getDedicatedSchemeAferUpsert.Fields.CreationDateTime.Indexed == true &&
            logcash.getDedicatedSchemeAferUpsert.Fields.CreationDateTime.Type == 'DateTime' &&
            logcash.getDedicatedSchemeAferUpsert.Fields.Hidden.Indexed == true &&
            logcash.getDedicatedSchemeAferUpsert.Fields.Hidden.Type == 'Bool' &&
            logcash.getDedicatedSchemeAferUpsert.Fields.Key.Keyword == true &&
            logcash.getDedicatedSchemeAferUpsert.Fields.Key.Indexed == true &&
            logcash.getDedicatedSchemeAferUpsert.Fields.Key.Type == 'String' &&
            logcash.getDedicatedSchemeAferUpsert.Fields.ModificationDateTime.Indexed == true &&
            logcash.getDedicatedSchemeAferUpsert.Fields.ModificationDateTime.Type == 'DateTime'&&
            logcash.getDedicatedSchemeAferUpsert.Fields.TestDateTime.Indexed == true &&
            logcash.getDedicatedSchemeAferUpsert.Fields.TestDateTime.Type == 'DateTime' &&
            logcash.getDedicatedSchemeAferUpsert.Fields.testString.Indexed == true &&
            logcash.getDedicatedSchemeAferUpsert.Fields.testString.Type =='String' &&
            logcash.getDedicatedSchemeAferUpsert.Fields.testBoolean.Indexed == true &&
            logcash.getDedicatedSchemeAferUpsert.Fields.testBoolean.Type == 'Bool' &&
            logcash.getDedicatedSchemeAferUpsert.Fields.TestInteger.Indexed == true &&
            logcash.getDedicatedSchemeAferUpsert.Fields.TestInteger.Type == 'Integer' &&
            logcash.getDedicatedSchemeAferUpsert.Fields.TestDouble.Indexed == true &&
            logcash.getDedicatedSchemeAferUpsert.Fields.TestDouble.Type == 'Double'
            
        ) {
            logcash.getDedicatedSchemeAferUpsertStatus = true;
        } else {
            logcash.getDedicatedSchemeAferUpsertStatus = false;
            logcash.getDedicatedSchemeAferUpsertErrorMessage =
                'The dedicated scheme will be created, but actuall get empty ';
        }
        await insertDataToDataTable();
    }

    async function insertDataToDataTable() {
        for (counter; counter < 10; counter++) {
            let boolData = false; 
            if(counter % 2 !=0){boolData = true};
            logcash.insertDataToDataTable = await generalService
                .fetchStatus(baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSchemaTypeDataIndex.Name, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                        'X-Pepperi-SecretKey': whaitSecretKey,
                    },
                    body: JSON.stringify({
                        Key: 'insert ' + counter,
                        testString: 'firstStrring-' + counter,
                        testBoolean: boolData,
                        TestInteger: counter,
                        TestDouble: counter + '.5',
                        TestDateTime: new Date(),
                        secString: 'secondStrring-' + counter,
                        secInteger: counter * 2
                    }),
                })
                .then((res) => [res.Status, res.Body]);
            //debugger;
            //Failed due to exception: Table schema must exist, for table
            if (logcash.insertDataToDataTable[0] == 200) {
                logcash.insertDataToDataTableStatus = true;
            } else {
                logcash.insertDataToDataTableStatus = false;
                logcash.insertDataToDataTableError = 'Insert data failed on try number: ' + counter;
            }
        }
        //debugger;
        generalService.sleep(20000);
        await getDataDedicated();
    }

    //#endregion Schema creation positive - Owner and SekretKey fom white list addon
    //#region  Get data from ADAL and ADAL indexed schemes
    async function getDataDedicated() { // get data from elastic
        logcash.getDataDedicatedStatus = true;
        logcash.getDataDedicated = await generalService
        .fetchStatus(baseURL + '/addons/shared_index/index/' + whaitOwnerUUID + '_data/' + adalOwnerId +'/' + whaitOwnerUUID + '_' + logcash.createSchemaTypeDataIndex.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': addonUUID,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if(logcash.getDataDedicated.length == 10){
            for (let index = 0; index < logcash.getDataDedicated.length -1; index++) {
                if (
                    Object.entries(logcash.getDataDedicated[index]).length == 9 &&
                    logcash.getDataDedicated[index]["testBoolean"] != undefined  &&
                    logcash.getDataDedicated[index]["TestDateTime"] != '' &&
                    logcash.getDataDedicated[index]["testString"] != '' &&
                    logcash.getDataDedicated[index]["TestDouble"] != '' &&
                    logcash.getDataDedicated[index]["TestInteger"] != undefined
                ) {
                    //logcash.getDataDedicatedStatus = true;
                }
                else{
                    logcash.getDataDedicatedStatus = false;
                    logcash.getDataDedicatedError = 'Only indexed fields will be added to dedicated scheme'
                }
            }
        }
        else{logcash.getDataDedicatedStatus = false;
             logcash.getDataDedicatedError = 'will be created 10 objects , but actually created ' + logcash.getDataDedicated.length
        }
        //debugger;
        await getDataADAL();
    }

    
    async function getDataADAL() {
        logcash.getDataADALStatus = true;
        logcash.getDataADAL = await generalService
        .fetchStatus(baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSchemaTypeDataIndex.Name +'?include_deleted=true', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    // 'X-Pepperi-OwnerID': addonUUID,
                    // 'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if(logcash.getDataADAL.length == 10){
            for (let index = 0; index < logcash.getDataADAL.length -1; index++) {
                if (
                    Object.entries(logcash.getDataADAL[index]).length == 11 //&&
                    // logcash.getDataADAL[index]["testBoolean"] != '' &&
                    // logcash.getDataADAL[index]["TestDateTime"] != '' &&
                    // logcash.getDataADAL[index]["testString"] != '' &&
                    // logcash.getDataADAL[index]["TestDouble"] != '' &&
                    // logcash.getDataADAL[index]["TestInteger"] != ''
                ) {
                    //logcash.getDataDedicatedStatus = true;
                }
                else{
                    logcash.getDataADALStatus = false;
                    logcash.getDataADALError = '--'
                }
            }
        }
        else{logcash.getDataDedicatedStatus = false;
             logcash.getDataDedicatedError = 'will be created 10 objects , but actually created ' + logcash.getDataADAL.length
        }
        //debugger;
        await getDataADALbyName();
    }

    async function getDataADALbyName() {
        logcash.getDataADALbyNameStatus = true;
        logcash.getDataADALbyName = await generalService
        .fetchStatus(baseURL + '/addons/data/' + whaitOwnerUUID + '/' + logcash.createSchemaTypeDataIndex.Name +'?include_deleted=true&fields=TestDateTime,Key&order_by=TestDateTime', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    // 'X-Pepperi-OwnerID': addonUUID,
                    // 'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if(logcash.getDataADALbyName.length == 10){
            for (let index = 0; index < logcash.getDataADALbyName.length -1; index++) {
                if (
                    Object.entries(logcash.getDataADALbyName[index]).length == 2 //&&
                    // logcash.getDataDedicated[index]["testBoolean"] != '' &&
                    // logcash.getDataDedicated[index]["TestDateTime"] != '' &&
                    // logcash.getDataDedicated[index]["testString"] != '' &&
                    // logcash.getDataDedicated[index]["TestDouble"] != '' &&
                    // logcash.getDataDedicated[index]["TestInteger"] != ''
                ) {
                    //logcash.getDataDedicatedStatus = true;
                }
                else{
                    logcash.getDataADALStatus = false;
                    logcash.getDataADALError = 'Get data by key failed'
                }
            }
        }
        else{logcash.getDataDedicatedStatus = false;
             logcash.getDataDedicatedError = 'will be get 10 objects , but actually get ' + logcash.getDataADALbyName.length
        }
        //debugger;
        await upsertSchemaAddIndexedField();
    }
    //#endregion

    //#region upsert schema - add indexed field and upload value
    async function upsertSchemaAddIndexedField() {
        logcash.upsertSchemaAddIndexedField = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': whaitOwnerUUID,
                    'X-Pepperi-SecretKey': whaitSecretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaTypeDataIndex.Name,
                    Type: 'data',
                    StringIndexName: 'my_index_table',
                    Fields: {
                        testString: { Type: 'String', Indexed: true },
                        testBoolean: { Type: 'Bool' , Indexed: true},
                        TestInteger: { Type: 'Integer' , Indexed: true },
                        TestDouble: { Type: 'Double' , Indexed: true},
                        TestDateTime: {Type: 'DateTime', Indexed: true},
                        secString: {Type: 'String', Indexed: true},
                        secInteger: { Type: 'Integer' }
                    },
                    
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.upsertSchemaAddIndexedField.Name.includes ('DataTypeIndexedTable') &&
            logcash.upsertSchemaAddIndexedField.Hidden == false &&
            logcash.upsertSchemaAddIndexedField.Type == 'data' &&
            logcash.upsertSchemaAddIndexedField.Fields.testBoolean.Type == 'Bool' &&
            logcash.upsertSchemaAddIndexedField.Fields.TestInteger.Type == 'Integer' &&
            logcash.upsertSchemaAddIndexedField.Fields.testString.Type == 'String' &&
            logcash.upsertSchemaAddIndexedField.Fields.TestDouble.Type == 'Double' &&
            logcash.upsertSchemaAddIndexedField.Fields.TestDateTime.Type == 'DateTime' &&
            logcash.upsertSchemaAddIndexedField.Fields.secString.Type == 'String' &&
            logcash.upsertSchemaAddIndexedField.Fields.secString.Indexed == true &&
            logcash.upsertSchemaAddIndexedField.Fields.secInteger.Type == 'Integer'
        ) {
            logcash.upsertSchemaAddIndexedFieldStatus = true;
        } else {
            logcash.upsertSchemaAddIndexedFieldStatus = false;
            logcash.upsertSchemaAddIndexedFieldErrorMessage =
                'One of parameters on Schema updating get with wrong value: ' + logcash.upsertSchemaAddIndexedField;
        }
        await cleanRebuild();
    }

    async function cleanRebuild() {

            logcash.cleanRebuild = await generalService
                .fetchStatus(baseURL + '/addons/api/async/' + adalOwnerId + '/' + 'indexed_adal_api/clean_rebuild?table_name=' + logcash.createSchemaTypeDataIndex.Name, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': whaitOwnerUUID,  
                        'X-Pepperi-SecretKey': whaitSecretKey,
                    },
                    
                })
                .then((res) => [res.Status, res.Body]);
            //debugger;
            //Failed due to exception: Table schema must exist, for table
            if (logcash.cleanRebuild[0] == 200) {
                logcash.cleanRebuildStatus = true;
            } else {
                logcash.cleanRebuildStatus = false;
                logcash.cleanRebuildError = 'Clean rebuild failed' ;
            }
        
        //debugger;
        generalService.sleep(50000);
        await getAuditLog();
    }


    async function getAuditLog(){ 
        logcash.getAuditLog = await generalService.fetchStatus(
        '/audit_logs/' + logcash.cleanRebuild[1].ExecutionUUID,
        { method: 'GET' },
    );

            logcash.getAuditLog.parsedResultObject = JSON.parse(
            logcash.getAuditLog.Body.AuditInfo.ResultObject,
    );
        if(logcash.getAuditLog .parsedResultObject.success==true){
            logcash.getAuditLogStatus = true
        }
        else{
            logcash.getAuditLogStatus = false
            logcash.getAuditLogError = 'get error on audit log'
        }
    //debugger;
    await getDataDedicatedAfterInsert();
    }

    async function getDataDedicatedAfterInsert() { // get data from elastic
        logcash.getDataDedicatedAfterInsertStatus = true;
        logcash.getDataDedicatedAfterInsert = await generalService
        .fetchStatus(baseURL + '/addons/shared_index/index/' + whaitOwnerUUID + '_data/' + adalOwnerId +'/' + whaitOwnerUUID + '_' + logcash.createSchemaTypeDataIndex.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': addonUUID,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if(logcash.getDataDedicatedAfterInsert.length == 10){
            for (let index = 0; index < logcash.getDataDedicatedAfterInsert.length -1; index++) {
                if (
                    Object.entries(logcash.getDataDedicatedAfterInsert[index]).length == 10 &&
                    logcash.getDataDedicatedAfterInsert[index]["testBoolean"] != undefined  &&
                    logcash.getDataDedicatedAfterInsert[index]["TestDateTime"] != '' &&
                    logcash.getDataDedicatedAfterInsert[index]["testString"] != '' &&
                    logcash.getDataDedicatedAfterInsert[index]["TestDouble"] != '' &&
                    logcash.getDataDedicatedAfterInsert[index]["TestInteger"] != undefined &&
                    logcash.getDataDedicatedAfterInsert[index]["secString"] != ''
                ) {
                    //logcash.getDataDedicatedStatus = true;
                }
                else{
                    logcash.getDataDedicatedAfterInsertStatus = false;
                    logcash.getDataDedicatedAfterInsertError = 'Only indexed fields will be added to dedicated scheme'
                }
            }
        }
        else{logcash.getDataDedicatedAfterInsertStatus = false;
             logcash.getDataDedicatedAfterInsertError = 'will be created 10 objects , but actually created ' + logcash.getDataDedicated.length
        }
        //debugger;
        await dropTableSec();
    }
    async function dropTableSec() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaTypeDataIndex.Name + '/purge',
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
            logcash.dropTableSecStatus = true;
        } else {
            logcash.dropTableSecStatus = false;
            logcash.dropTableSecError = 'Drop schema failed. Error message is: ' + logcash.dropTableSec;
        }
        generalService.sleep(20000);
        await getDataDedicatedAfterDrop();
    }
    //#endregion
    //#region  verify if elastic data and dedicated schemo deleted 
    async function getDataDedicatedAfterDrop() { // get data from elastic
        logcash.getDataDedicatedAfterDrop = await generalService
        .fetchStatus(baseURL + '/addons/shared_index/index/' + whaitOwnerUUID + '_data/' + adalOwnerId +'/' + whaitOwnerUUID + '_' + logcash.createSchemaTypeDataIndex.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    //'X-Pepperi-OwnerID': addonUUID,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if(logcash.getDataDedicatedAfterDrop.length == 0){
            logcash.getDataDedicatedAfterDropStatus = true;
        }
        else{logcash.getDataDedicatedAfterDropStatus = false;
             logcash.getDataDedicatedAfterDropError = 'Dedicated schema need be deleted '
        }
        //debugger;
        //await dropTableSec();
    }
    //#endregion

}
