import GeneralService, { TesterFunctions } from '../services/general.service';

export async function BatchUpsertTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const assert = tester.assert;
    const expect = tester.expect;
    const it = tester.it;

    const logcash: any = {};
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
    });
    describe('Create Schema ', () => {
        it('Test Initiation', async () => {
            // this will run the first test that will run the second and so on..Its test initiation
            await getSecretKey();
        });
        it('Schema with name created', async () => {
            assert(logcash.createSchemaWithMandFieldNameStatus, logcash.createSchemaWithMandFieldNameErrorMessage);
        });
    });
    describe('Insert objects to created schema ', () => {
        it('Insert two obects(overwrite is default [false])', async () => {
            assert(logcash.insertDataToTableWithOwnerIDStatus, logcash.insertDataToTableWithOwnerIDError);
        });
        it('Negative - Update data one of created key with >400Kb(overwrite is default [false])  ', async () => {
            assert(logcash.insertDataToTableWithOwnerID400kStatus, logcash.insertDataToTableWithOwnerID400kError);
        });
        it('Update one of two inserted objects(overwrite is default [false])  ', async () => {
            assert(logcash.updateDataToTableStatus, logcash.updateDataToTableError);
        });
        it('Get from this schema. Will get 2 objects , one will be updated(overwrite is default [false])  ', async () => {
            assert(logcash.getDataToTableWithOwnerIDStatus, logcash.getDataToTableWithOwnerIDError);
        });
        it('Update one of two inserted objects(overwrite is updated [true])  ', async () => {
            assert(logcash.updateDataToTableOverwriteTrueStatus, logcash.updateDataToTableOverwriteTrueError);
        });
        it('Get from this schema. Will get 2 objects , one will be updated(overwrite is [true])  ', async () => {
            assert(logcash.getDataToTableOverwriteTrueStatus, logcash.getDataToTableOverwriteTrueError);
        });
        it('Negative - Insert 10 objects with one duplicated key(overwrite is [true]. All 10 rows will fail)  ', async () => {
            assert(logcash.addDataToTableOverwriteTrueStatus, logcash.addDataToTableOverwriteTrueError);
        });
        it('Negative/Positive - The test will faill on 25 and will succeed for the other 25 inserted keys (ovewrite=true))  ', async () => {
            assert(logcash.add50InsertsToTableOverwriteTrueStatus, logcash.add50InsertsToTableOverwriteTrueError);
        });
        it('Negative - The test will faill on GET on all 50 inserted keys (ovewrite=false))  ', async () => {
            assert(logcash.add50InsertsToTableOverwriteFalseStatus, logcash.add50InsertsToTableOverwriteFalseError);
        });
        it('Negative - The test will fail on bigger to 500 inserts)  ', async () => {
            assert(logcash.add50InsertsToTableOverwriteFalseStatus, logcash.add50InsertsToTableOverwriteFalseError);
        });
        it('Negative - Page Size changing.The test will faill on all 105 inserted keys on GET after get page saize changed to 110 (ovewrite=false))  ', async () => {
            assert(logcash.pageSizeChngesOverwriteFalseStatus, logcash.pageSizeChngesOverwriteFalseError);
        });
        it('Negative - Update (one objects) with saved word INDEXES will faile)  ', async () => {
            assert(logcash.updateDataToTableNegativeStatus, logcash.updateDataToTableNegativeError);
        });
        it('Insert data to schema by type DATA ', async () => {
            assert(logcash.insertDataToTableStatus, logcash.insertDataToTableError);
        });
        it('Drop schema by type DATA  ', async () => {
            assert(logcash.dropShemaDataStatus, logcash.dropShemaDataError);
        });
        it('Insert data to schema by type INDEXED_DATA  ', async () => {
            assert(logcash.insertDataToTableIndexedDataStatus, logcash.insertDataToTableError);
        });
        it('Drop schema by type INDEXED_DATA  ', async () => {
            assert(logcash.dropIndexedShemaDataStatus, logcash.dropIndexedShemaDataError);
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
                    //Type: 'data'
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
            logcash.createSchemaWithMandFieldName.Type == 'meta_data'
        ) {
            logcash.createSchemaWithMandFieldNameStatus = true;
        } else {
            logcash.createSchemaWithMandFieldNameStatus = false;
            logcash.createSchemaWithMandFieldNameErrorMessage =
                'One of parameters on Schema creation get with wrong value: ' + logcash.createSchemaWithMandFieldName;
        }
        await insertDataToTableWithOwnerID();
    }

    async function insertDataToTableWithOwnerID() {
        logcash.insertDataToTableWithOwnerID = await generalService
            .fetchStatus(
                baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
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
        if (
            logcash.insertDataToTableWithOwnerID[0].Key == 'testKey1' &&
            logcash.insertDataToTableWithOwnerID[1].Key == 'testKey2' &&
            logcash.insertDataToTableWithOwnerID[0].Status == 'Insert' &&
            logcash.insertDataToTableWithOwnerID[0].Status == 'Insert'
        ) {
            logcash.insertDataToTableWithOwnerIDStatus = true;
        } else {
            logcash.insertDataToTableWithOwnerIDStatus = false;
            logcash.insertDataToTableWithOwnerIDError = 'Insert (two objects) failed  ';
        }
        await insertDataToTableWithOwnerID400K();
    }

    async function insertDataToTableWithOwnerID400K() {
        logcash.insertDataToTableWithOwnerID400k = await generalService
            .fetchStatus(
                baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
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
                baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
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
                baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
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
            logcash.getDataToTableWithOwnerID[1].Column2 == 'Value3-1'
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
                baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
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
        const object = createObjects(num); // add 9 unique inserts
        object[num] = object[num - 1]; // + 1 duplicated key
        //debugger;
        logcash.addDataToTableOverwriteTrue = await generalService
            .fetchStatus(
                baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
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
                logcash.addDataToTableOverwriteTrue[index].Status == 'Error' &&
                logcash.addDataToTableOverwriteTrue[index].Details == 'Provided list of item keys contains duplicates'
            ) {
                tst++;
                if (tst == num) {
                    logcash.addDataToTableOverwriteTrueStatus = true;
                }
            } else {
                logcash.addDataToTableOverwriteTrueStatus = false;
                logcash.addDataToTableOverwriteTrueError =
                    'The test will faill on all 10 inserted keys (ovewrite=true) , but actuall not get error  ';
            }
        }
        await add50InsertsToTableOverwriteTrue();
    }

    async function add50InsertsToTableOverwriteTrue() {
        const num = 49;
        let tst = 0;
        let tst1 = 0;
        const object = createObjects(num); // add 9 unique inserts
        object[num] = object[num - 1]; // + 1 duplicated key
        //debugger;
        logcash.add50InsertsToTableOverwriteTrue = await generalService
            .fetchStatus(
                baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
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
            if (logcash.add50InsertsToTableOverwriteTrue[index].Status == 'Error') {
                tst++;
            } else if (logcash.add50InsertsToTableOverwriteTrue[index].Status == 'Insert') {
                tst1++;
            }
        }
        if (tst + tst1 == num + 1 && tst == tst1) {
            logcash.add50InsertsToTableOverwriteTrueStatus = true;
        } else {
            logcash.add50InsertsToTableOverwriteTrueStatus = false;
            logcash.add50InsertsToTableOverwriteTrueError =
                'The test will faill on 25 and will succeed for the other 25 inserted keys (ovewrite=true) , but actuall not get error ! ';
        }
        //debugger;

        await add50InsertsToTableOverwriteFalse();
    }

    async function add50InsertsToTableOverwriteFalse() {
        const num = 49;
        let tst = 0;
        // const tst1 = 0;
        const object = createObjects(num); // add 49 unique inserts
        object[num] = object[num - 1]; // + 1 duplicated key
        //debugger;
        logcash.add50InsertsToTableOverwriteFalse = await generalService
            .fetchStatus(
                baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
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
            if (
                logcash.add50InsertsToTableOverwriteFalse[index].Status == 'Error' &&
                logcash.add50InsertsToTableOverwriteFalse[index].Details ==
                    'Provided list of item keys contains duplicates'
            ) {
                tst++;
                if (tst == num) {
                    logcash.add50InsertsToTableOverwriteFalseStatus = true;
                }
            } else {
                logcash.add50InsertsToTableOverwriteFalseStatus = false;
                logcash.add50InsertsToTableOverwriteFalseError =
                    'The test will faill on GET on all 50 inserted keys (ovewrite=false) , but actuall not get error  ';
            }
        }
        //debugger;
        await insert501ObjectsToTableOverwriteFalse();
    }

    async function insert501ObjectsToTableOverwriteFalse() {
        const num = 501;
        // const tst = 0;
        // let tst1 = 0;
        const object = createObjects(num); // add 501 unique inserts
        // object[num] = object[num - 1];              // + 1 duplicated key
        //debugger;
        logcash.add50InsertsToTableOverwriteFalse = await generalService
            .fetchStatus(
                baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
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
        await pageSizeChngesOverwriteFalse();
    }

    async function pageSizeChngesOverwriteFalse() {
        const num = 104;
        let tst = 0;
        const object = createObjects(num); // add 9 unique inserts
        object[num] = object[num - 1]; // + 1 duplicated key
        //debugger;
        logcash.pageSizeChngesOverwriteFalse = await generalService
            .fetchStatus(
                baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName.Name,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },

                    body: JSON.stringify({
                        Objects: object,
                        //'Overwrite': true
                        //PageSize: 110,
                        MaxPageSize: 110,
                    }),
                },
            )
            .then((res) => res.Body);
        //debugger;
        for (let index = 0; index <= num; index++) {
            if (
                logcash.pageSizeChngesOverwriteFalse[index].Status == 'Error' &&
                logcash.pageSizeChngesOverwriteFalse[index].Details == 'Provided list of item keys contains duplicates'
            ) {
                tst++;
                if (tst == num) {
                    logcash.pageSizeChngesOverwriteFalseStatus = true;
                }
            } else {
                logcash.pageSizeChngesOverwriteFalseStatus = false;
                logcash.pageSizeChngesOverwriteFalseError =
                    'The test will faill on all 105 inserted keys on GET after get page saize changed to 110 (ovewrite=false) , but actuall not get error  ';
            }
        }
        //debugger;
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

    /////////////////////////////test anoteher types of schema (data and index_data)
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
                    Name: 'createSchemaTypeData ' + Date(),
                    Type: 'data',
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
            logcash.createSchemaTypeData.Type == 'data'
        ) {
            logcash.createSchemaTypeDataStatus = true;
        } else {
            logcash.createSchemaTypeDataStatus = false;
            logcash.createSchemaTypeDataErrorMessage =
                'One of parameters on Schema creation get with wrong value: ' + logcash.createSchemaTypeData;
        }
        await insertDataToTable();
    }

    async function insertDataToTable() {
        logcash.insertDataToTable = await generalService
            .fetchStatus(baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaTypeData.Name, {
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
        const res = await dropSchema(logcash.createSchemaTypeData.Name);
        if (res == true) {
            logcash.dropShemaDataStatus = true;
        } else {
            logcash.dropShemaDataStatus = false;
            logcash.dropShemaDataError = 'Shema on type DATA not droped';
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
                    Name: 'createSchemaTypeIndexedData ' + Date(),
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
        await insertDataToTableIndexedData();
    }

    async function insertDataToTableIndexedData() {
        logcash.insertDataToTableIndexedData = await generalService
            .fetchStatus(baseURL + '/addons/data/batch/' + addonUUID + '/' + logcash.createSchemaTypeIndexedData.Name, {
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
            })
            .then((res) => res.Body);
        //debugger;
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
