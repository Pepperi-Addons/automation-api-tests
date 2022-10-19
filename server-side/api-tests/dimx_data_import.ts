import GeneralService, { TesterFunctions } from '../services/general.service';
import { AddonRelationService } from '../services/addon-relation.service';
import { v4 as newUuid } from 'uuid';

export async function DimxDataImportTestsTestser(generalService: GeneralService, request, tester: TesterFunctions) {
    await DimxDataImportTests(generalService, request, tester);
}

export async function DimxDataImportTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    // const assert = tester.assert;
    const expect = tester.expect;
    const it = tester.it;
    const relationService = new AddonRelationService(generalService);
    const logcash: any = {};
    // const executionLog: any = {};
    // const logDataWithRetry: any = {};

    // const counter = 0;
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
    let relationTmp: any = {};

    const relationBody = {
        Name: 'Addon relation positive1', // mandatory
        RelationName: 'DataImportResource', // mandatory
        AddonUUID: addonUUID, // mandatory
        Hidden: true,
        //Type: 'AddonAPI', // mandatory on create
        //Description: 'test1',
        //AddonRelativeURL: '/api/test1', // mandatory on create
    };

    //#region Upgrade ADAL
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''], // 22-08-21 changed to last phased version 1.0.131. To run on last phased version will be empty
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, '0.0.1'],
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
    };
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }

    //For local run that run on Jenkins this is needed since Jenkins dont inject SK to the test execution folder
    if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
        const addonSecretKey = await generalService.getSecretKey(generalService['client'].AddonUUID, varKey);
        generalService['client'].AddonSecretKey = addonSecretKey;
        generalService.papiClient['options'].addonSecretKey = addonSecretKey;
    }

    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    //#endregion Upgrade ADAL
    //debugger;
    //const chnageVersionResponseArr1 = await generalService.chnageVersion(varKey, testData, false);
    //#region Mocha

    describe('DIMX Data Import Tests Suites', () => {
        describe('Prerequisites Addon for DIMX Tests', () => {
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
    });
    describe('Create Schema ', () => {
        it('Test Initiation', async () => {
            // this will run the first test that will run the second and so on..Its test initiation
            logcash.secretKey = await generalService.getSecretKey(addonUUID, varKey);
            await getRelation();
        });
        it('Schema with name created', async () => {
            expect(logcash.createSchemaWithMandFieldNameStatus, logcash.createSchemaWithMandFieldNameErrorMessage).to.be
                .true;
        });
    });
    describe('Insert objects to created schema ', () => {
        it('Negative-Insert two obects(overwrite is default [false] without relation)', async () => {
            expect(logcash.insertDataToTableWithOwnerIDStatus, logcash.insertDataToTableWithOwnerIDError).to.be.true;
        });
        it('Insert two obects(overwrite is default [false] with relation)', async () => {
            expect(logcash.insertDataToTableWithRelationStatus, logcash.insertDataToTableWithRelationError).to.be.true;
        });
        it('Negative - Update data one of created key with >400Kb(overwrite is default [false])  ', async () => {
            expect(logcash.insertDataToTableWithOwnerID400kStatus, logcash.insertDataToTableWithOwnerID400kError).to.be
                .true;
        });
        it('Update one of two inserted objects(overwrite is default [false])  ', async () => {
            expect(logcash.updateDataToTableStatus, logcash.updateDataToTableError).to.be.true;
        });
        it('Get from this schema. Will get 2 objects , one will be updated(overwrite is default [false])  ', async () => {
            expect(logcash.getDataToTableWithOwnerIDStatus, logcash.getDataToTableWithOwnerIDError).to.be.true;
        });
        it('Get from this schema. Will get 2 objects , one will be updated and second will get error : KEY missing (overwrite is default [false])  ', async () => {
            expect(logcash.updateDataStatuseVerificationStatus, logcash.updateDataStatuseVerificationError).to.be.true;
        });
        it('Update one of two inserted objects(overwrite is updated [true])  ', async () => {
            expect(logcash.updateDataToTableOverwriteTrueStatus, logcash.updateDataToTableOverwriteTrueError).to.be
                .true;
        });
        it('Get from this schema. Will get 2 objects , one will be updated(overwrite is [true])  ', async () => {
            expect(logcash.getDataToTableOverwriteTrueStatus, logcash.getDataToTableOverwriteTrueError).to.be.true;
        });
        it('Negative - Insert 10 objects with one duplicated key(overwrite is [true]. All 10 rows will fail)  ', async () => {
            expect(logcash.addDataToTableOverwriteTrueStatus, logcash.addDataToTableOverwriteTrueError).to.be.true;
        });
        it('Negative/Positive - The test will faill on 25 and will succeed for the other 25 inserted keys (ovewrite=true))  ', async () => {
            expect(logcash.add50InsertsToTableOverwriteTrueStatus, logcash.add50InsertsToTableOverwriteTrueError).to.be
                .true;
        });
        it('Negative - The test will faill on GET on all 50 inserted keys (ovewrite=false))  ', async () => {
            expect(logcash.add50InsertsToTableOverwriteFalseStatus, logcash.add50InsertsToTableOverwriteFalseError).to
                .be.true;
        });
        it('Negative - The test will fail on bigger to 500 inserts)  ', async () => {
            expect(logcash.add50InsertsToTableOverwriteFalseStatus, logcash.add50InsertsToTableOverwriteFalseError).to
                .be.true;
        });
        it('RelativeURL function test)  ', async () => {
            expect(logcash.add50InsertsRelativeURLTestStatus, logcash.add50InsertsRelativeURLTestError).to.be.true;
        });
        it('Negative - Update (one objects) with saved word INDEXES will faile)  ', async () => {
            expect(logcash.updateDataToTableNegativeStatus, logcash.updateDataToTableNegativeError).to.be.true;
        });
        it('Insert data to schema by type META_DATA ', async () => {
            expect(logcash.insertDataToTableStatus, logcash.insertDataToTableError).to.be.true;
        });
        it('Negative-Insert data to schema by type META_DATA without OwnerID ', async () => {
            expect(logcash.insertDataToTableNegativeStatus, logcash.insertDataToTableNegativeError).to.be.true;
        });
        it('Drop schema by type META_DATA  ', async () => {
            expect(logcash.dropShemaDataStatus, logcash.dropShemaDataError).to.be.true;
        });
        it('Insert data to schema by type INDEXED_DATA  ', async () => {
            expect(logcash.insertDataToTableIndexedDataStatus, logcash.insertDataToTableError).to.be.true;
        });
        it('Drop schema by type INDEXED_DATA  ', async () => {
            expect(logcash.dropIndexedShemaDataStatus, logcash.dropIndexedShemaDataError).to.be.true;
        });
    });

    async function getRelation() {
        const relationResponse = await relationService.getRelationByRelationType(
            {
                'X-Pepperi-OwnerID': addonUUID,
                'X-Pepperi-SecretKey': logcash.secretKey,
            },
            relationBody.RelationName,
            addonUUID,
        );
        //debugger;
        if (relationResponse.length == 0 || relationResponse.length == undefined) {
            await createSchemaWithMandFieldName();
        } else {
            relationTmp = relationResponse[0];
            await setRelationHiidenTrue();
        }
    }

    async function setRelationHiidenTrue() {
        //const Response =
        await relationService.postRelation(
            {
                'X-Pepperi-OwnerID': addonUUID,
                'X-Pepperi-SecretKey': logcash.secretKey,
            },
            {
                Name: relationTmp.Name, // mandatory
                RelationName: relationTmp.RelationName, // mandatory
                AddonUUID: addonUUID, // mandatory
                Hidden: true,
                Type: relationTmp.Type, // mandatory on create
                //Description: 'test1',
                AddonRelativeURL: relationTmp.AddonRelativeURL, // mandatory on create
            },
        );
        //debugger;
        await getRelation();
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
                    //Name: 'CreateSchemaWithMandatoryField ' + Date(),
                    Name: 'CreateSchemaWithMandatoryField' + newUuid(),
                    Type: 'data',
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
            //logcash.createSchemaWithMandFieldName.Type == 'data'
            logcash.createSchemaWithMandFieldName.Type == 'data'
        ) {
            logcash.createSchemaWithMandFieldNameStatus = true;
        } else {
            logcash.createSchemaWithMandFieldNameStatus = false;
            logcash.createSchemaWithMandFieldNameErrorMessage =
                'One of parameters on Schema creation get with wrong value: ' + logcash.createSchemaWithMandFieldName;
        }
        await insertDataToTableNonRelation();
    }

    async function insertDataToTableNonRelation() {
        logcash.insertDataToTableNonRelation = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Objects: [
                            {
                                Key: 'testKey1',
                                Column1: 'Value3',
                            },
                            {
                                Key: 'testKey2',
                                Column1: 'Value3',
                            },
                        ],
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        // if (
        //     logcash.insertDataToTableNonRelation.ExecutionUUID != '' &&
        //     logcash.insertDataToTableNonRelation.URI != ''
        // ) {
        //     logcash.insertDataToTableNonRelationStatus = true;
        // } else {
        //     logcash.insertDataToTableNonRelationStatus = false;
        //     logcash.insertDataToTableNonRelationError = 'Insert without created relation will failed  ';
        // }
        if (
            logcash.insertDataToTableNonRelation.fault.faultstring.includes(
                'Failed due to exception: Relation: Permission denied. No results found for the query',
            )
        ) {
            logcash.insertDataToTableWithOwnerIDStatus = true;
        } else {
            logcash.insertDataToTableWithOwnerIDStatus = false;
            logcash.insertDataToTableWithOwnerIDError = 'Insert will failed , because relation not created';
        }
        await CreateRelation();
    }

    //add Audit log
    // async function getSingleExecutonLogWithRetry() {
    //     logDataWithRetry = await generalService.fetchStatus(
    //         '/audit_logs/' + logcash.insertDataToTableNonRelation.ExecutionUUID,
    //         { method: 'GET' },
    //     );
    //     //cacheLog.ExecutionResult = JSON.parse(logData.Body.AuditInfo.ResultObject);
    //     if (
    //         logDataWithRetry.Status == 200 &&
    //         //logDataWithRetry.Body.UUID == logcash.executeDraftCodeWithRetry.Body.ExecutionUUID &&
    //         logDataWithRetry.Body.Event.Type == 'addon_job_execution' //'code_job_execution'
    //     ) {
    //         if (logDataWithRetry.Body.Status.ID == 0 && logDataWithRetry.Body.AuditInfo.ResultObject.includes('Failed due to exception: Relation: Permission denied. No rsults found for the query') ) {
    //             executionLog.StatusExecutonLogWithRetry = true;
    //         } else {
    //             executionLog.StatusExecutonLogWithRetry = false;
    //             executionLog.ErrorExecutonLogWithRetry =
    //                 'Audit log returned wrong exeption.';
    //         }
    //     } else {
    //         executionLog.StatusExecutonLogWithRetry = false;
    //         executionLog.ErrorExecutonLogWithRetry =
    //             'Audit log Status returned wrong (status will be retry (0))';
    //     }
    //     //generalService.sleep(320000);
    //     await CreateRelation();
    // }

    // add relation
    async function CreateRelation() {
        //const secretKey = await generalService.getSecretKey(addonUUID, varKey);
        const relationResponce = await relationService.postRelationStatus(
            {
                'X-Pepperi-OwnerID': addonUUID,
                'X-Pepperi-SecretKey': logcash.secretKey,
                // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
            },
            {
                Name: logcash.createSchemaWithMandFieldName.Name, // relation name will be same to schema name 19/10/22
                //Name: 'DIMXDataImport_test', // mandatory
                AddonUUID: addonUUID, // mandatory
                RelationName: 'DataImportResource', // mandatory
                Type: 'AddonAPI', // mandatory on create
                Description: 'DIMX Data Import test',
                AddonRelativeURL: '', // mandatory on create
            },
        );
        //debugger;
        expect(relationResponce).to.equal(200);
        await insertDataToTableWithRelation();
    }

    async function insertDataToTableWithRelation() {
        logcash.insertDataToTableWithRelation = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Objects: [
                            {
                                Key: 'testKey1',
                                Column1: 'Value3',
                            },
                            {
                                Key: 'testKey2',
                                Column1: 'Value3',
                            },
                        ],
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        // if (
        //     logcash.insertDataToTableWithRelation.ExecutionUUID != '' &&
        //     logcash.insertDataToTableWithRelation.URI != ''
        // ) {
        //     logcash.insertDataToTableWithRelationStatus = true;
        // } else {
        //     logcash.insertDataToTableWithRelationStatus = false;
        //     logcash.insertDataToTableWithRelationError = 'Insert without created relation will failed  ';
        // }
        if (
            logcash.insertDataToTableWithRelation[0].Key == 'testKey1' &&
            logcash.insertDataToTableWithRelation[1].Key == 'testKey2' &&
            logcash.insertDataToTableWithRelation[0].Status == 'Insert' &&
            logcash.insertDataToTableWithRelation[0].Status == 'Insert'
        ) {
            logcash.insertDataToTableWithRelationStatus = true;
        } else {
            logcash.insertDataToTableWithRelationStatus = false;
            logcash.insertDataToTableWithRelationError = 'Insert (two objects) failed  ';
        }
        await insertDataToTableWithOwnerID400K();
    }

    // async function getAuditLog() {
    //     logDataWithRetry = await generalService.fetchStatus(
    //         '/audit_logs/' + logcash.insertDataToTableWithRelation.ExecutionUUID,
    //         { method: 'GET' },
    //     );
    //     //cacheLog.ExecutionResult = JSON.parse(logData.Body.AuditInfo.ResultObject);
    //     if (
    //         logDataWithRetry.Status == 200 &&
    //         //logDataWithRetry.Body.UUID == logcash.executeDraftCodeWithRetry.Body.ExecutionUUID &&
    //         logDataWithRetry.Body.Event.Type == 'addon_job_execution' //'code_job_execution'
    //     ) {
    //         if (logDataWithRetry.Body.Status.ID == 0 && logDataWithRetry.Body.AuditInfo.ResultObject.includes('Failed due to exception: Relation: Permission denied. No rsults found for the query') ) {
    //             executionLog.StatusExecutonLogWithRetry = true;
    //         } else {
    //             executionLog.StatusExecutonLogWithRetry = false;
    //             executionLog.ErrorExecutonLogWithRetry =
    //                 'Audit log returned wrong exeption.';
    //         }
    //     } else {
    //         executionLog.StatusExecutonLogWithRetry = false;
    //         executionLog.ErrorExecutonLogWithRetry =
    //             'Audit log Status returned wrong (status will be retry (0))';
    //     }
    //     //generalService.sleep(320000);
    //     await insertDataToTableWithOwnerID400K();
    // }

    async function insertDataToTableWithOwnerID400K() {
        logcash.insertDataToTableWithOwnerID400k = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Objects: [
                            {
                                Key: 'testKey1',
                                Column1: ['Value1', 'a'.repeat(400 * (1 << 10)), 'Value3'],
                            },
                        ],
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.insertDataToTableWithOwnerID400k[0].Details == "Object's size exceeds 400KB" &&
            logcash.insertDataToTableWithOwnerID400k.length == 1 &&
            logcash.insertDataToTableWithOwnerID400k[0].Key == 'testKey1'
        ) {
            logcash.insertDataToTableWithOwnerID400kStatus = true;
        } else {
            logcash.insertDataToTableWithOwnerID400kStatus = false;
            logcash.insertDataToTableWithOwnerID400kError =
                'Will fail with error about size exceeds 400KB, schema name is : ' +
                logcash.createSchemaWithMandFieldName.Name;
        }
        await updateDataToTable();
    }

    async function updateDataToTable() {
        logcash.updateDataToTable = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Objects: [
                            {
                                Key: 'testKey2',
                                Column2: 'Value3-1',
                            },
                        ],
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (logcash.updateDataToTable[0].Key == 'testKey2' && logcash.updateDataToTable[0].Status == 'Update') {
            logcash.updateDataToTableStatus = true;
        } else {
            logcash.updateDataToTableStatus = false;
            logcash.updateDataToTableError = 'Update (one objects) failed  ';
        }
        await updateDataToTableNegative();
    }

    async function updateDataToTableNegative() {
        logcash.updateDataToTableNegative = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Objects: [
                            {
                                Key: 'testKey2',
                                Indexes: 'Value5',
                            },
                        ],
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.updateDataToTableNegative[0].Status == 'Error' &&
            logcash.updateDataToTableNegative[0].Details == 'Indexes is saved word'
        ) {
            logcash.updateDataToTableNegativeStatus = true;
        } else {
            logcash.updateDataToTableNegativeStatus = false;
            logcash.updateDataToTableNegativeError = 'Update (one objects) with saved word indexes will failed  ';
        }
        await updateDataStatuseVerification();
    }

    async function updateDataStatuseVerification() {
        logcash.updateDataStatuseVerification = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Objects: [
                            {
                                Key: 'testKey2',
                                Column2: 'Value5-updated',
                            },
                            {
                                Key: '',
                                Column2: 'errorVerification',
                            },
                        ],
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.updateDataStatuseVerification[0].Key == 'testKey2' &&
            logcash.updateDataToTable[0].Status == 'Update' &&
            logcash.updateDataStatuseVerification[1].Status == 'Error' &&
            logcash.updateDataStatuseVerification[1].Details == 'Key property is missing'
        ) {
            logcash.updateDataStatuseVerificationStatus = true;
        } else {
            logcash.updateDataStatuseVerificationStatus = false;
            logcash.updateDataStatuseVerificationError = 'One object will be updated , and another one will fail  ';
        }
        await getDataToTableWithOwnerID();
    }

    async function getDataToTableWithOwnerID() {
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
        if (
            logcash.getDataToTableWithOwnerID.length == 2 &&
            logcash.getDataToTableWithOwnerID[0].Key == 'testKey1' &&
            logcash.getDataToTableWithOwnerID[1].Key == 'testKey2' &&
            logcash.getDataToTableWithOwnerID[0].Column1 == 'Value3' &&
            logcash.getDataToTableWithOwnerID[1].Column1 == 'Value3' &&
            logcash.getDataToTableWithOwnerID[1].Column2 == 'Value5-updated'
        ) {
            logcash.getDataToTableWithOwnerIDStatus = true;
        } else {
            logcash.getDataToTableWithOwnerIDStatus = false;
            logcash.getDataToTableWithOwnerIDError =
                'The GET resoult is wrong : ' + JSON.stringify(logcash.getDataToTableWithOwnerID);
        }

        //debugger;
        await updateDataToTableOverwriteTrue();
    }

    async function updateDataToTableOverwriteTrue() {
        logcash.updateDataToTableOverwriteTrue = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Objects: [
                            {
                                Key: 'testKey2',
                                Column3: 'updated-value',
                            },
                        ],
                        //Overwrite: true,
                        OverwriteObject: true,
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.updateDataToTableOverwriteTrue[0].Key == 'testKey2' &&
            logcash.updateDataToTableOverwriteTrue[0].Status == 'Insert'
        ) {
            logcash.updateDataToTableOverwriteTrueStatus = true;
        } else {
            logcash.updateDataToTableOverwriteTrueStatus = false;
            logcash.updateDataToTableOverwriteTrueError = 'Update (one objects) failed  ';
        }
        await getDataToTableOverwriteTrue();
    }

    async function getDataToTableOverwriteTrue() {
        logcash.getDataToTableOverwriteTrue = await generalService
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
            logcash.getDataToTableOverwriteTrue.length == 2 &&
            logcash.getDataToTableOverwriteTrue[0].Key == 'testKey1' &&
            logcash.getDataToTableOverwriteTrue[0].Column1 == 'Value3' &&
            logcash.getDataToTableOverwriteTrue[1].Key == 'testKey2' &&
            logcash.getDataToTableOverwriteTrue[1].Column3 == 'updated-value' &&
            logcash.getDataToTableOverwriteTrue[1].Column1 == undefined &&
            logcash.getDataToTableOverwriteTrue[1].Column2 == undefined
        ) {
            logcash.getDataToTableOverwriteTrueStatus = true;
        } else {
            logcash.getDataToTableOverwriteTrueStatus = false;
            logcash.getDataToTableOverwriteTrueError =
                'The GET resoult is wrong.Will get just one object - testKey3 : ' +
                JSON.stringify(logcash.getDataToTableOverwriteTrue);
        }

        //debugger;
        await addDataToTableOverwriteTrue();
    }

    async function addDataToTableOverwriteTrue() {
        const num = 9;
        let tst = 0;
        let tst1 = 0;
        const object = createObjects(num); // add 9 unique inserts
        object[num] = object[num - 1]; // + 1 duplicated key
        //debugger;
        logcash.addDataToTableOverwriteTrue = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },

                    body: JSON.stringify({
                        Objects: object,
                        //Overwrite: true,
                        OverwriteObject: true,
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        for (let index = 0; index <= num; index++) {
            if (
                logcash.addDataToTableOverwriteTrue[index].Status == 'Insert' //&&
                //index != 8
            ) {
                tst++;
            } else if (
                //index == 8 &&
                logcash.addDataToTableOverwriteTrue[index].Status == 'Merge' &&
                logcash.addDataToTableOverwriteTrue[index].Details == '9'
            ) {
                tst1++;
            }
        }
        if (tst == num && tst1 == 1) {
            logcash.addDataToTableOverwriteTrueStatus = true;
        } else {
            logcash.addDataToTableOverwriteTrueStatus = false;
            logcash.addDataToTableOverwriteTrueError = 'One insert with duplicated key will be merged ';
        }
        await add50InsertsToTableOverwriteTrue();
    }

    async function add50InsertsToTableOverwriteTrue() {
        const num = 49;
        let tst = 0;
        let tst1 = 0;
        const object = createObjects(num); // add 9 unique inserts
        object[num] = object[num - 1]; // + 1 duplicated key
        object[num + 1] = object[num - 1]; // + 1 duplicated on row 51
        //debugger;
        logcash.add50InsertsToTableOverwriteTrue = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },

                    body: JSON.stringify({
                        Objects: object,
                        //Overwrite: true,
                        OverwriteObject: true,
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        for (let index = 0; index <= num + 1; index++) {
            if (logcash.add50InsertsToTableOverwriteTrue[index].Status == 'Insert') {
                tst++;
            } else if (
                logcash.add50InsertsToTableOverwriteTrue[index].Status == 'Merge' //&&
                //logcash.add50InsertsToTableOverwriteTrue[index].Details == '9'
            ) {
                tst1++;
            }
        }
        if (tst == num && tst1 == 2) {
            logcash.add50InsertsToTableOverwriteTrueStatus = true;
        } else {
            logcash.add50InsertsToTableOverwriteTrueStatus = false;
            logcash.add50InsertsToTableOverwriteTrueError =
                'Two inserts with duplicated key will be merged and 49 - will be inserted ';
        }
        //debugger;

        await add50InsertsToTableOverwriteFalse();
    }

    async function add50InsertsToTableOverwriteFalse() {
        const num = 49;
        let tst = 0;
        let tst1 = 0;
        // const tst1 = 0;
        const object = createObjects(num); // add 49 unique inserts
        object[num] = object[num - 1]; // + 1 duplicated key
        //debugger;
        logcash.add50InsertsToTableOverwriteFalse = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },

                    body: JSON.stringify({
                        Objects: object,
                        //Overwrite: false,
                        OverwriteObject: false,
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        for (let index = 0; index <= num; index++) {
            if (logcash.add50InsertsToTableOverwriteFalse[index].Status == 'Ignore') {
                tst++;
            } else if (logcash.add50InsertsToTableOverwriteFalse[index].Status == 'Merge') {
                tst1++;
            }
        }
        if (tst == num && tst1 == 1) {
            logcash.add50InsertsToTableOverwriteFalseStatus = true;
        } else {
            logcash.add50InsertsToTableOverwriteFalseStatus = false;
            logcash.add50InsertsToTableOverwriteFalseError = '49 inserts will be ignore and one will be merged ';
        }
        //debugger;
        await insert501ObjectsToTableOverwriteFalse();
    }

    async function insert501ObjectsToTableOverwriteFalse() {
        const num = 550;
        // const tst = 0;
        // let tst1 = 0;
        const object = createObjects(num); // add 501 unique inserts
        // object[num] = object[num - 1];              // + 1 duplicated key
        //debugger;
        logcash.add50InsertsToTableOverwriteFalse = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
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
                },
            )
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.add50InsertsToTableOverwriteFalse.fault.faultstring ==
            'Failed due to exception: Objects array can contain at most 500 objects'
        ) {
            logcash.add50InsertsToTableOverwriteFalseStatus = true;
        } else {
            (logcash.add50InsertsToTableOverwriteFalseStatus = false),
                (logcash.add50InsertsToTableOverwriteFalseError =
                    'The test will fail on bigger to 500 inserts, but actuall not failed');
        }
        await UpdateRelation();
    }

    // async function pageSizeChngesOverwriteFalse() {
    //     const num = 104;
    //     let tst = 0;
    //     const object = createObjects(num); // add 9 unique inserts
    //     object[num] = object[num - 1]; // + 1 duplicated key
    //     //debugger;
    //     logcash.pageSizeChngesOverwriteFalse = await generalService
    //         .fetchStatus(
    //             baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
    //             {
    //                 method: 'POST',
    //                 headers: {
    //                     Authorization: 'Bearer ' + token,
    //                     'X-Pepperi-OwnerID': addonUUID,
    //                     'X-Pepperi-SecretKey': logcash.secretKey,
    //                 },

    //                 body: JSON.stringify({
    //                     Objects: object,
    //                     //'Overwrite': true
    //                     //PageSize: 110,
    //                     MaxPageSize: 110,
    //                 }),
    //             },
    //         )
    //         .then((res) => res.Body);
    //     debugger;
    //     for (let index = 0; index <= num; index++) {
    //         if (
    //             logcash.pageSizeChngesOverwriteFalse[index].Status == 'Error' &&
    //             logcash.pageSizeChngesOverwriteFalse[index].Details == 'Provided list of item keys contains duplicates'
    //         ) {
    //             tst++;
    //             if (tst == num) {
    //                 logcash.pageSizeChngesOverwriteFalseStatus = true;
    //             }
    //         } else {
    //             logcash.pageSizeChngesOverwriteFalseStatus = false;
    //             logcash.pageSizeChngesOverwriteFalseError =
    //                 'The test will faill on all 105 inserted keys on GET after get page saize changed to 110 (ovewrite=false) , but actuall not get error  ';
    //         }
    //     }
    //     //debugger;
    //     await dropExistingTable();
    // }

    async function UpdateRelation() {
        //const secretKey = await generalService.getSecretKey(addonUUID, varKey);
        const relationResponce = await relationService.postRelationStatus(
            {
                'X-Pepperi-OwnerID': addonUUID,
                'X-Pepperi-SecretKey': logcash.secretKey,
                // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
            },
            {
                Name: logcash.createSchemaWithMandFieldName.Name, // mandatory /
                AddonUUID: addonUUID, // mandatory
                RelationName: 'DataImportResource', // mandatory
                Type: 'AddonAPI', // mandatory on create
                Description: 'DIMX Data Import test',
                AddonRelativeURL: `/version/0.0.5/test_functions1.js/importRelation`, // mandatory on create
            },
        );
        //debugger;
        expect(relationResponce).to.equal(200);
        await add50InsertsRelativeURLTest();
    }

    async function add50InsertsRelativeURLTest() {
        const num = 49;
        let tst = 0;
        let tst1 = 0;
        let tst2 = 0;
        // const tst1 = 0;
        const object = createObjects(num); // add 49 unique inserts
        object[num] = object[num - 1]; // + 1 duplicated key
        //debugger;
        logcash.add50InsertsRelativeURLTest = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },

                    body: JSON.stringify({
                        Objects: object,
                        //Overwrite: false,
                        OverwriteObject: false,
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        for (let index = 0; index <= num; index++) {
            if (logcash.add50InsertsRelativeURLTest[index].Status == 'Ignore') {
                tst++;
            } else if (logcash.add50InsertsRelativeURLTest[index].Status == 'Merge') {
                tst1++;
            } else if (
                logcash.add50InsertsRelativeURLTest[index].Status == 'Error' &&
                logcash.add50InsertsRelativeURLTest[index].Details == 'key divides by 5'
            ) {
                tst2++;
            }
        }
        if (tst == num - 10 && tst1 == 1 && tst2 == 10) {
            logcash.add50InsertsRelativeURLTestStatus = true;
        } else {
            logcash.add50InsertsRelativeURLTestStatus = false;
            logcash.add50InsertsRelativeURLTestError = '40 inserts will be ignored, one will be merged and 9 - errors ';
        }
        //debugger;
        await UpdateRelatioSec();
    }

    async function UpdateRelatioSec() {
        //const secretKey = await generalService.getSecretKey(addonUUID, varKey);
        const UpdateRelatioSec = await relationService.postRelationStatus(
            {
                'X-Pepperi-OwnerID': addonUUID,
                'X-Pepperi-SecretKey': logcash.secretKey,
                // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
            },
            {
                Name: logcash.createSchemaWithMandFieldName.Name, // mandatory
                AddonUUID: addonUUID, // mandatory
                RelationName: 'DataImportResource', // mandatory
                Type: 'AddonAPI', // mandatory on create
                Description: 'DIMX Data Import test',
                AddonRelativeURL: '', // mandatory on create
            },
        );
        //debugger;
        expect(UpdateRelatioSec).to.equal(200);
        await dropExistingTable();
    }

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
        await createSchemaTypeData();
    }

    /////////////////////////////test anoteher types of schema (meta_data and index_data)
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
                    Name: 'createSchemaTypeData ' + newUuid(), //+ Date(),
                    Type: 'meta_data',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaTypeData.CreationDateTime.includes(new Date().toISOString().split('T')[0]) == true &&
            logcash.createSchemaTypeData.ModificationDateTime.includes(new Date().toISOString().split('T')[0]) ==
                true &&
            logcash.createSchemaTypeData.Name != '' &&
            logcash.createSchemaTypeData.Hidden == false &&
            //logcash.createSchemaWithMandFieldName.Type == 'data'
            logcash.createSchemaTypeData.Type == 'meta_data'
        ) {
            logcash.createSchemaTypeDataStatus = true;
        } else {
            logcash.createSchemaTypeDataStatus = false;
            logcash.createSchemaTypeDataErrorMessage =
                'One of parameters on Schema creation get with wrong value: ' + logcash.createSchemaTypeData;
        }
        await CreateRelation1();
    }

    async function CreateRelation1() {
        //const secretKey = await generalService.getSecretKey(addonUUID, varKey);
        const relationResponce = await relationService.postRelationStatus(
            {
                'X-Pepperi-OwnerID': addonUUID,
                'X-Pepperi-SecretKey': logcash.secretKey,
                // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
            },
            {
                Name: logcash.createSchemaTypeData.Name, // relation name will be same to schema name 19/10/22
                //Name: 'DIMXDataImport_test', // mandatory
                AddonUUID: addonUUID, // mandatory
                RelationName: 'DataImportResource', // mandatory
                Type: 'AddonAPI', // mandatory on create
                Description: 'DIMX Data Import test',
                AddonRelativeURL: '', // mandatory on create
            },
        );
        //debugger;
        expect(relationResponce).to.equal(200);
        await insertDataToTable();
    }

    async function insertDataToTable() {
        logcash.insertDataToTable = await generalService
            .fetchStatus(baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaTypeData.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Objects: [
                        {
                            Key: 'Key1',
                            Column1: 'Value3',
                        },
                        {
                            Key: 'Key2',
                            Column1: 'Value3',
                        },
                    ],
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.insertDataToTable[0].Key == 'Key1' &&
            logcash.insertDataToTable[1].Key == 'Key2' &&
            logcash.insertDataToTable[0].Status == 'Insert' &&
            logcash.insertDataToTable[0].Status == 'Insert'
        ) {
            logcash.insertDataToTableStatus = true;
        } else {
            logcash.insertDataToTableStatus = false;
            logcash.insertDataToTableError = 'Insert (two objects) on shema with type DATA failed  ';
        }
        // const res = await dropSchema(logcash.createSchemaTypeData.Name);
        // if (res == true) {
        //     logcash.dropShemaDataStatus = true;
        // } else {
        //     logcash.dropShemaDataStatus = false;
        //     logcash.dropShemaDataError = 'Shema on type DATA not droped';
        // }
        await insertDataToTableNegative();
    }

    async function insertDataToTableNegative() {
        logcash.insertDataToTableNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaTypeData.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': '',
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Objects: [
                        {
                            Key: 'Key11',
                            Column1: 'Value3',
                        },
                        {
                            Key: 'Key12',
                            Column1: 'Value3',
                        },
                    ],
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.insertDataToTableNegative[0].Details.includes(
                'X-Pepperi-OwnerID is a mandatory header for a resource of type meta-data.',
            ) &&
            logcash.insertDataToTableNegative[1].Details.includes(
                'X-Pepperi-OwnerID is a mandatory header for a resource of type meta-data.',
            )
        ) {
            logcash.insertDataToTableNegativeStatus = true;
        } else {
            (logcash.insertDataToTableNegativeStatus = false),
                (logcash.insertDataToTableNegativeError =
                    'The test will fail. Meta_data type of table will work just with OwnerID');
        }

        // if (
        //     logcash.insertDataToTableNegative.fault.faultstring ==''
        // ) {
        //     logcash.insertDataToTableNegativeStatus = true;
        // } else {
        //     logcash.insertDataToTableNegativeStatus = false,
        //     logcash.insertDataToTableNegativeError = 'The test will fail. Meta_data type of table will work just with OwnerID'
        // }
        const res = await dropSchema(logcash.createSchemaTypeData.Name);
        if (res == true) {
            logcash.dropShemaDataStatus = true;
        } else {
            logcash.dropShemaDataStatus = false;
            logcash.dropShemaDataError = 'Shema on type Meta_DATA not droped';
        }
        await createSchemaTypeIndexedData();
    }

    async function createSchemaTypeIndexedData() {
        logcash.createSchemaTypeIndexedData = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'CreateSchemaTypeIndexedData ' + newUuid(),
                    Type: 'indexed_data',
                    Fields: {
                        IndexedString: { Type: 'String', Indexed: true },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaTypeIndexedData.CreationDateTime.includes(new Date().toISOString().split('T')[0]) ==
                true &&
            logcash.createSchemaTypeIndexedData.ModificationDateTime.includes(new Date().toISOString().split('T')[0]) ==
                true &&
            logcash.createSchemaTypeIndexedData.Name != '' &&
            logcash.createSchemaTypeIndexedData.Hidden == false &&
            //logcash.createSchemaWithMandFieldName.Type == 'data'
            logcash.createSchemaTypeIndexedData.Type == 'indexed_data'
        ) {
            logcash.createSchemaTypeIndexedDataStatus = true;
        } else {
            logcash.createSchemaTypeIndexedDataStatus = false;
            logcash.createSchemaTypeIndexedDataErrorMessage =
                'One of parameters on Schema creation get with wrong value: ' + logcash.createSchemaTypeIndexedData;
        }
        await CreateRelation2();
    }

    async function CreateRelation2() {
        //const secretKey = await generalService.getSecretKey(addonUUID, varKey);
        const relationResponce = await relationService.postRelationStatus(
            {
                'X-Pepperi-OwnerID': addonUUID,
                'X-Pepperi-SecretKey': logcash.secretKey,
                // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
            },
            {
                Name: logcash.createSchemaTypeIndexedData.Name, // relation name will be same to schema name 19/10/22
                //Name: 'DIMXDataImport_test', // mandatory
                AddonUUID: addonUUID, // mandatory
                RelationName: 'DataImportResource', // mandatory
                Type: 'AddonAPI', // mandatory on create
                Description: 'DIMX Data Import test',
                AddonRelativeURL: '', // mandatory on create
            },
        );
        //debugger;
        expect(relationResponce).to.equal(200);
        await insertDataToTableIndexedData();
    }

    async function insertDataToTableIndexedData() {
        logcash.insertDataToTableIndexedData = await generalService
            .fetchStatus(
                baseURL + '/addons/data/import/' + addonUUID + '/' + logcash.createSchemaTypeIndexedData.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Objects: [
                            {
                                Key: 'Key1-1',
                                Column1: 'Value3',
                            },
                            {
                                Key: 'Key2-1',
                                Column1: 'Value3',
                            },
                        ],
                    }),
                },
            )
            .then((res) => res.Body);
        debugger;
        if (
            logcash.insertDataToTableIndexedData[0].Key == 'Key1-1' &&
            logcash.insertDataToTableIndexedData[1].Key == 'Key2-1' &&
            logcash.insertDataToTableIndexedData[0].Status == 'Insert' &&
            logcash.insertDataToTableIndexedData[0].Status == 'Insert'
        ) {
            logcash.insertDataToTableIndexedDataStatus = true;
        } else {
            logcash.insertDataToTableIndexedDataStatus = false;
            logcash.insertDataToTableError = 'Insert (two objects) on shema with type INDEXED_DATA failed  ';
        }
        const res = await dropSchema(logcash.createSchemaTypeIndexedData.Name);
        if (res == true) {
            logcash.dropIndexedShemaDataStatus = true;
        } else {
            logcash.dropIndexedShemaDataStatus = false;
            logcash.dropIndexedShemaDataError = 'Shema on type INDEXED_DATA not droped';
        }
        //await insertDataToTableWithOwnerID400K();
    }

    //////////////////////////////////////////functions//////////////////////////////////////////////////
    async function dropSchema(name) {
        const res = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + name + '/purge', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'X-Pepperi-OwnerID': addonUUID,
                'X-Pepperi-SecretKey': logcash.secretKey,
            },
        });
        if (res.Ok) {
            logcash.dropSchemaStatus = true;
        } else {
            logcash.dropSchemaStatus = false;
        }
        return logcash.dropSchemaStatus;
    }

    ////////////////////////////////////////inserts function
    function createObjects(num) {
        // create inserts unique key:value

        const array: { Key: string; Column4: string }[] = [];
        for (let index = 0; index < num; index++) {
            array[index] = { Key: 'value' + index, Column4: 'test' + index };
        }

        return array;
    }
}
