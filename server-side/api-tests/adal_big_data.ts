import GeneralService, { TesterFunctions } from '../services/general.service';

export async function AdalBigDataTestser(generalService: GeneralService, request, tester: TesterFunctions) {
    await AdalBigDataTests(generalService, request, tester);
}

export async function AdalBigDataTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const logcash: any = {};
    let counter = 0;
    let inserts_num = 0;
    logcash.randomInt = Math.floor(1000 + Math.random() * 9000);

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
    describe('ADAL BIG DATA Tests Suites', () => {
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
                expect(logcash.createSchemaWithPropertiesStatus, logcash.createSchemaWithPropertiesErrorMessage);
            });
            it('Insert 100K objects', () => {
                expect(logcash.insert500ObjectsStatus, logcash.add50InsertsToTableOverwriteFalseError);
            });
            it('Search not hidden objects', () => {
                expect(logcash.getDataNotHiddenStatus, logcash.getDataNotHiddenError);
            });
            it('Trancate created data', () => {
                expect(logcash.truncateTestTableLastStatus, logcash.truncateTestTableLastError);
            });
            it('Drop created schema', () => {
                expect(logcash.dropTableSecStatus, logcash.dropTableSecError);
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
        await createSchemaWithProperties();
    }

    async function createSchemaWithProperties() {
        logcash.createSchemaWithMandFieldName = 'adalBigDataTest_' + logcash.randomInt;
        //debugger;
        logcash.createSchemaWithProperties = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaWithMandFieldName,
                    Type: 'meta_data',
                    Fields: {
                        TestInteger: { Type: 'Integer' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaWithProperties.Name == logcash.createSchemaWithMandFieldName &&
            logcash.createSchemaWithProperties.Hidden == false &&
            logcash.createSchemaWithProperties.Type == 'meta_data' &&
            logcash.createSchemaWithProperties.Fields.TestInteger.Type == 'Integer'
        ) {
            logcash.createSchemaWithPropertiesStatus = true;
        } else {
            logcash.createSchemaWithPropertiesStatus = false;
            logcash.createSchemaWithPropertiesErrorMessage =
                'One of parameters on Schema updating get with wrong value: ' + logcash.createSchemaWithProperties;
        }
        await insert100Kdocs();
    }

    async function insert100Kdocs() {
        logcash.insert500ObjectsStatus = true;
        for (let index = 0; index < 200; index++) {
            //index < 200
            inserts_num = inserts_num + 500;
            await insert500Objects();
        }
        await upsertDataToHiddenFalse();
    }

    async function upsertDataToHiddenFalse() {
        for (counter; counter < 5; counter++) {
            logcash.insertDataToIndexedTableFirst100 = await generalService
                .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Key: 'value' + (90000 + counter * 20), //Key: 90000 + (counter * 20),
                        Hidden: false,
                    }),
                })
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
        await getDataNotHidden();
    }

    async function getDataNotHidden() {
        logcash.getDataNotHiddenStatus = true;
        logcash.getDataNotHidden = await generalService
            .fetchStatus(baseURL + '/addons/data/search/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    // 'X-Pepperi-OwnerID': addonUUID,
                    // 'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    IncludeCount: true,
                    Fields: ['Key', 'TestInteger'],
                    OrderBy: 'CreationDateTime',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        let count2 = 0;
        logcash.resp = new Set<any>();
        while (count2 < 30 && logcash.getDataNotHidden.NextPageKey) {
            //logcash.getDataNotHidden.Objects.length==0){
            logcash.getDataNotHidden = await generalService
                .fetchStatus(
                    baseURL + '/addons/data/search/' + addonUUID + '/' + logcash.createSchemaWithMandFieldName,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + token,
                            // 'X-Pepperi-OwnerID': addonUUID,
                            // 'X-Pepperi-SecretKey': logcash.secretKey,
                        },
                        body: JSON.stringify({
                            IncludeCount: true,
                            Fields: ['Key', 'TestInteger'],
                            OrderBy: 'CreationDateTime',
                            PageKey: logcash.getDataNotHidden.NextPageKey,
                        }),
                    },
                )
                .then((res) => res.Body);
            if (logcash.getDataNotHidden.Objects.length != 0) {
                for (let index = 0; index < logcash.getDataNotHidden.Objects.length; index++) {
                    logcash.resp.add(logcash.getDataNotHidden.Objects[index]);
                }
            }
            count2++;
            generalService.sleep(1000 * 10);
        }
        //debugger;
        if (logcash.resp.size == 5) {
        } else {
            logcash.getDataNotHiddenStatus = false;
            logcash.getDataNotHiddenError = 'will be get 5 objects ' + logcash.resp.size;
        }
        //debugger;  logcash.getDataNotHidden.NextPageKey
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
    async function insert500Objects() {
        const num = 500;
        // const tst = 0;
        // let tst1 = 0;
        const object = createObjects(num); // add 501 unique inserts
        logcash.insert500Objects = await generalService
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
        if (logcash.insert500Objects.length == num) {
            //logcash.insert500ObjectsStatus = true;
        } else {
            (logcash.insert500ObjectsStatus = false),
                (logcash.add50InsertsToTableOverwriteFalseError = 'Batch upsert failed');
        }
        //await dropTableSec();
    }
    function createObjects(num) {
        // create inserts unique key:value

        const array: { Key: string; TestInteger: number; Hidden: boolean }[] = [];
        for (let index = 0; index < num; index++) {
            array[index] = {
                Key: 'value' + (index + inserts_num - 500),
                TestInteger: index + inserts_num - 500,
                Hidden: true,
            };
        }

        return array;
    }
}
