import GeneralService from '../services/general.service';
import { FieldsService } from '../services/fields.service';
import fetch from 'node-fetch';

declare type TestResult = 'Pass' | 'Fail';
declare type Stats = 'Done' | 'Skipp' | 'SyncStart';
interface TestObject {
    TestResult?: string;
    apiGetResponse?: Record<string, unknown>;
    testBody?: Record<string, unknown>;
}

let _localData;
let _agentWrntyID;
let _catalogWrntyID;

// All Sync Tests
export async function SyncTests(generalService: GeneralService, describe, expect, it) {
    const service = new FieldsService(generalService.papiClient);

    console.log('Initiate Sync Tests | ' + getDateAndTime());

    const accounts = await service.papiClient.accounts.find({ page: 1 });
    const activities = await service.papiClient.transactions
        .iter({
            where: `Type='Sales Order'`,
            page: 1,
        })
        .toArray();

    const _accountExternalIDStr = accounts[0].ExternalID?.toString();
    const activiy = activities[0];

    const _activityTypeIDStr = activiy.ActivityTypeID;

    _agentWrntyID = generalService.getClientData('UserID');
    const catalogs = await service.papiClient.get('/catalogs');
    _catalogWrntyID = catalogs[0].InternalID;
    _localData = {
        jsonBody: {
            2: {
                Headers: [
                    'AccountExternalID',
                    'DiscountPercentage',
                    'ExternalID',
                    'ActivityTypeID',
                    'AgentWrntyID',
                    'CatalogWrntyID',
                    'Remark',
                ],
                Lines: [
                    [
                        _accountExternalIDStr,
                        new Date().getTime().toString(),
                        Math.floor(Math.random() * 1000000000).toString(),
                        _activityTypeIDStr,
                        _agentWrntyID,
                        _catalogWrntyID,
                        `Test ${Math.floor(Math.random() * 1000000).toString()}`,
                    ],
                    [
                        _accountExternalIDStr,
                        new Date().getTime().toString(),
                        Math.floor(Math.random() * 1000000000).toString(),
                        _activityTypeIDStr,
                        _agentWrntyID,
                        _catalogWrntyID,
                        `Test ${Math.floor(Math.random() * 1000000).toString()}`,
                    ],
                ],
            },
        },
    };
    //GET
    const _body = {
        LocalDataUpdates: null,
        LastSyncDateTime: 62610367500000 /*This Uses c# DateTime.Ticks*/,
        DeviceExternalID: 'OrenSyncTest',
        CPIVersion: '16.40',
        TimeZoneDiff: 0,
        Locale: true,
        BrandedAppID: 5555,
        UserFullName: 'Samuray_Pong',
        SoftwareVersion: 9001,
        SourceType: '5',
        DeviceModel: 'SynkingOren',
        DeviceName: 'OrenSynKing',
        DeviceScreenSize: 9000,
        SystemName: 'OREN-PC',
        ClientDBUUID: 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString(),
    };

    /*if (testConfigObj.isGetTest) {
        _body.LocalDataUpdates = null;
        _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
        testResultsObj.GetTest = sync(_body, 'Simple Get');
    }

    if (testConfigObj.isResyncFullTest) {
        _body.LocalDataUpdates = _localData;
        _body.LastSyncDateTime = 0;
        _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
        testResultsObj.ResyncFullTest = sync(_body, 'Resync with data');
    }

    if (testConfigObj.isResyncEmptyTest) {
        _body.LocalDataUpdates = null;
        _body.LastSyncDateTime = 0;
        _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
        testResultsObj.ResyncEmptyTest = sync(_body, 'Resync with no data');
    }*/

    describe('Sync Tests Suites', () => {
        describe('Endpoints and data members validations', () => {
            it('Sync Put After Get Valid Response of URL and UUID', async () => {
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                const PutAfterGetTest = await syncPutAfterGet(_body);
                return expect(PutAfterGetTest).to.contain('Pass' as TestResult);
            });

            it('Simple Sync Put Data Members Validation', async () => {
                _body.LocalDataUpdates = _localData;
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                const syncDataMembersValidationPut: TestObject = await syncDataMembersValidation(_body);
                if (syncDataMembersValidationPut.TestResult == ('Pass' as TestResult)) {
                    return expect(
                        syncPostGetValidation(
                            syncDataMembersValidationPut.apiGetResponse,
                            syncDataMembersValidationPut.testBody,
                        ).TestResult,
                    ).to.contain('Pass' as TestResult);
                } else {
                    return expect(syncDataMembersValidationPut.TestResult).to.contain('Pass' as TestResult);
                }
            });

            it('Simple Sync Get Data Members Validation', async () => {
                _body.LocalDataUpdates = null;
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                const syncDataMembersValidationGet: TestObject = await syncDataMembersValidation(_body);
                if (syncDataMembersValidationGet.TestResult == ('Pass' as TestResult)) {
                    return expect(
                        syncPostGetValidation(
                            syncDataMembersValidationGet.apiGetResponse,
                            syncDataMembersValidationGet.testBody,
                        ).TestResult,
                    ).to.contain('Pass' as TestResult);
                }
                return expect(syncDataMembersValidationGet.TestResult).to.contain('Pass' as TestResult);
            });

            /*it('Simple Sync Get', async () => {
                return expect(syncDataMembersValidationGet).to.contain('Pass' as TestResult);
            });*/

            /*
 
                    if (testConfigObj.isResyncFullTest) {
                        it('Resync With Data', async () => {
                            const ResyncFullTest = await testResultsObj.ResyncFullTest.then(function (result) {
                                return result;
                            });
                            return expect(ResyncFullTest).to.contain('Pass' as TestResult);
                        });
                    }
            
                    if (testConfigObj.isResyncEmptyTest) {
                        it('Resync With No Data', async () => {
                            const ResyncEmptyTest = await testResultsObj.ResyncEmptyTest.then(function (result) {
                                return result;
                            });
                            return expect(ResyncEmptyTest).to.contain('Pass' as TestResult);
                        });
                    }*/

            it('Test Clean Up', async () => {
                return expect((await cleanUpTest()).TestResult).to.contain('Pass' as TestResult);
            });
        });
    });

    //#region syncPutAfterGet
    async function syncPutAfterGet(body) {
        body.LocalDataUpdates = _localData;
        const getResponse = syncPutAfterGetCallback(await service.papiClient.post('/application/sync', body));
        if (getResponse.toString().startsWith('Error')) {
            return getResponse;
        }
        body.LocalDataUpdates = _localData;
        body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
        const putResponse = syncPutAfterGetCallback(await service.papiClient.post('/application/sync', body));
        return putResponse;
    }

    function syncPutAfterGetCallback(response) {
        if (response.SyncJobUUID.length == 36 && response.URI.startsWith('/application/sync/jobinfo/')) {
            return 'Pass' as TestResult;
        } else {
            return 'Error found in: UUID or URI';
        }
    }
    //#endregion syncPutAfterGet

    //#region syncDataMembersValidation
    async function syncDataMembersValidation(body) {
        const testBody = {};
        Object.assign(testBody, body);

        //POST sync job
        const syncPostApiResponse = await service.papiClient.post('/application/sync', testBody);

        //GET sync jobinfo
        const apiGetResponse = await waitForStatus(
            'Done',
            '/application/sync/jobinfo/' + syncPostApiResponse.SyncJobUUID,
            180000,
        );
        if (apiGetResponse.Status == 'Done' && apiGetResponse.ProgressPercentage == 100) {
            return {
                TestResult: 'Pass',
                apiGetResponse: apiGetResponse,
                testBody: testBody,
            } as TestObject;
        } else {
            return {
                TestResult: `The Get Status is: '${apiGetResponse.Status} , after 180 sec The Sync UUID is: ${apiGetResponse.SyncUUID}. The DB-UUID is: ${apiGetResponse.ClientInfo.ClientDBUUID}`,
            } as TestObject;
        }
    }
    //#endregion syncDataMembersValidation

    //#region syncPostGetValidation
    function syncPostGetValidation(apiGetResponse, testBody) {
        let errorMessage = '';
        try {
            // test that the data we sent was the same data we got from the API
            for (const prop in apiGetResponse.ClientInfo) {
                try {
                    if (prop != 'LocalDataUpdates' && apiGetResponse.ClientInfo[prop] != testBody[prop].toString()) {
                        console.log(`Is this: ${apiGetResponse.ClientInfo[prop]}, equal to this: ${testBody[prop]}`);
                        errorMessage += `Missmatch sent Property: ${apiGetResponse.ClientInfo[prop]} Not identical to recived Property: ${testBody[prop]} | `;
                    }
                } catch (error) {
                    console.log(`Error for: ${prop} | ${error}`);
                    errorMessage += `For Client Info Prop: ${prop} Error was thrown: ${error} | `;
                }
            }
            //test that the file was created in the serverd
            if (!checkFile(apiGetResponse.DataUpdates.URL)) {
                errorMessage += 'File was not created on the sever | ';
            }
        } catch (error) {
            errorMessage += `${error} | `;
        }
        if (errorMessage == '') {
            return { TestResult: 'Pass' } as TestObject;
        } else {
            return { TestResult: errorMessage } as TestObject;
        }
    }
    //#endregion syncPostGetValidation

    //#region cleanUp
    async function cleanUpTest() {
        let countHiddenTransactions = 0;
        let countFailedToHideTransactions = 0;
        const allActivitiesArr = await service.papiClient.get(
            "/all_activities?where=CreationDateTime>'2020-07-07Z'&page_size=-1&order_by=ModificationDateTime DESC",
        );
        for (let index = 0; index < allActivitiesArr.length; index++) {
            const activityToHide = allActivitiesArr[index];
            if (activityToHide.Remark.startsWith('Test ') && parseInt(activityToHide.Remark.split(' ')[1]) > 200) {
                const transaction = {
                    InternalID: activityToHide.InternalID,
                    Hidden: true,
                };
                countHiddenTransactions++;
                try {
                    await service.papiClient.post('/transactions', transaction);
                } catch (error) {
                    countFailedToHideTransactions++;
                    console.log(
                        `Error when trying to delete transaction with InternalID of: ${transaction.InternalID} Error: ${error}`,
                    );
                }
            }
        }
        if (countFailedToHideTransactions > 0) {
            console.log(
                `Error: hidden failed for some transaction (${countFailedToHideTransactions}) and sucssfuly for (${
                    countHiddenTransactions - countFailedToHideTransactions
                })are Hidden = true | ${getDateAndTime()}`,
            );
        } else {
            console.log(
                `Done: all the new transactions (${countHiddenTransactions}) are Hidden = true | ${getDateAndTime()}`,
            );
        }
        if (countFailedToHideTransactions > 0) {
            return {
                TestResult: `Error: hidden failed for some transaction (${countFailedToHideTransactions}) and sucssfuly for (${
                    countHiddenTransactions - countFailedToHideTransactions
                }) that are now with Hidden = true | ${getDateAndTime()}`,
            } as TestObject;
        } else {
            return { TestResult: 'Pass' } as TestObject;
        }
    }
    //#endregion cleanUp

    //#region getDate
    function getDateAndTime() {
        const getDate = new Date();
        return (
            getDate.getHours().toString().padStart(2, '0') +
            ' : ' +
            getDate.getMinutes().toString().padStart(2, '0') +
            ' : ' +
            getDate.getSeconds().toString().padStart(2, '0')
        );
    }
    //#endregion getDate

    /* //this interval no longer needed and it never worked
        let inetrvalLimit = 600000;
    const SetIntervalEvery = 6000;
    new Promise((resolve) => {
        const waitForAllTestResults = setInterval(() => {
            inetrvalLimit -= SetIntervalEvery;
            if (inetrvalLimit < 1) {
                console.log('Interval Timout');
                clearInterval(waitForAllTestResults);
                resolve();
            } else if (_syncTestCount == 0) {
                console.log('Test Done | ' + getDateAndTime());
                clearInterval(waitForAllTestResults);
                resolve();
                return run();
            }
        }, SetIntervalEvery);
    });
    */
    /*
    }).then(async () => {
        let getNewResyncFileSize;
        let getResyncFileSize;
        await new Promise(async (resolve) => {
            if (apiGetResponse.Status != 'Done') {
                // test fails
                errorMessage += `The Get Status is: '${apiGetResponse.Status} , after 180 sec The Sync UUID is: ${apiGetResponse.SyncUUID}. The DB-UUID is: ${apiGetResponse.ClientInfo.ClientDBUUID} | `;
            } else {
                // test wasn't fail
                try {
                    // test that the data we sent was the same data we got from the API
                    for (const prop in apiGetResponse.ClientInfo) {
                        try {
                            if (
                                prop != 'LocalDataUpdates' &&
                                apiGetResponse.ClientInfo[prop] != testBody[prop].toString()
                            ) {
                                console.log(
                                    `Is this: ${apiGetResponse.ClientInfo[prop]}, equal to this: ${testBody[prop]}`,
                                );
                                errorMessage += `Missmatch sent Property: ${apiGetResponse.ClientInfo[prop]} Not identical to recived Property: ${testBody[prop]} | `;
                            }
                        } catch (error) {
                            console.log(`Error for: ${prop} | ${error}`);
                            errorMessage += `For Client Info Prop: ${prop} Error was thrown: ${error} | `;
                        }
                    }
                    //test that the file was created in the serverd
                    if (!checkFile(apiGetResponse.DataUpdates.URL)) {
                        errorMessage += 'File was not created on the sever | ';
                    }
                } catch (error) {
                    errorMessage += `${error} | `;
                }
            }
            if (testName.includes('Resync')) {
                if (getResyncFileSize == undefined) {
                    const isTransactionValid = checkTransactionExits(apiGetResponse.DataUpdates.URL);
                    if (isTransactionValid) {
                    } else {
                        errorMessage += 'Failed to create transaction | ';
                    }
                }
            }
        }).then(async () => {
            await new Promise(async (resolve) => {
                // now we will add an object and post it again
                testBody['LocalDataUpdates'] = _localData;
                testBody['ClientDBUUID'] = Math.floor(Math.random() * 1000000000).toString();
                postOrder();
    
                let newSyncPostApiResponse;
                let apiGetAfterResponse;
                inetrvalLimit = 180000;
                const getResultObjectResyncInterval = setInterval(() => {
                    async function waitForPostGetResponse() {
                        // now we will do a full sync and make sure that the size of the new file, is bigger then the last one
                        if (newSyncPostApiResponse == undefined) {
                            testBody['LocalDataUpdates'] = null;
                            newSyncPostApiResponse = await service.papiClient.post('/application/sync', testBody);
                        }
                        //wait until resync is done
                        apiGetAfterResponse = await service.papiClient.get(
                            '/application/sync/jobinfo/' + newSyncPostApiResponse.SyncJobUUID,
                        );
                        getDate = new Date();
                        dateStr =
                            `${getDate.getHours().toString().padStart(2, '0')}` +
                            ' : ' +
                            +`${getDate.getMinutes().toString().padStart(2, '0')}` +
                            ' : ' +
                            +`${getDate.getSeconds().toString().padStart(2, '0')}`;
                    }
    
                    waitForPostGetResponse();
    
                    inetrvalLimit -= SetIntervalEvery;
                    if (inetrvalLimit < 1) {
                        console.log(`Resync Interval Timeout For: ${testName} | ${dateStr}`);
                        clearInterval(getResultObjectResyncInterval);
                        errorMessage += `Resync Interval Timeout For: ${testName} | ${dateStr} | `;
                        resolve();
                    } else if (
                        apiGetAfterResponse.Status == 'Done' &&
                        apiGetAfterResponse.ProgressPercentage == 100
                    ) {
                        if (getNewResyncFileSize == undefined) {
                            const isTransactionValid = checkTransactionExits(apiGetResponse.DataUpdates.URL);
                            if (isTransactionValid) {
                            } else {
                                errorMessage += 'Failed to create transaction | ';
                            }
                        }
                    }
                    if (getResyncFileSize != null && getNewResyncFileSize != null) {
                        console.log(`Resync Interval Done For: ${testName} | ${dateStr}`);
                        if (getNewResyncFileSize < getResyncFileSize) {
                            errorMessage += `This is a problem with the resync file size. the size of the first resync was: ${getResyncFileSize} , and after we add 2 orders the size was: ${getNewResyncFileSize} | `;
                        }
                        clearInterval(getResultObjectResyncInterval);
                        resolve();
                    } else {
                        console.log('Response is done but a data file is emtpy');
                        errorMessage += 'Response is done but a data file is emtpy | ';
                        clearInterval(getResultObjectResyncInterval);
                        resolve();
                    }
                });
            });
        });
    */

    //Get the stream of the file' and check if its size is bigger then 10 KB
    async function checkFile(url) {
        const fileContent: string = await fetch(url).then((response) => response.text());
        return (encodeURI(fileContent).split(/%..|./).length - 1) / 1000 > 10;
    }

    /*async function checkTransactionExits(url) {
        return true;
    }*/

    /*async function postOrder() {
        _body.LocalDataUpdates = _localData;
        _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
        const apiPostResponse = await service.papiClient.post('/application/sync', _body);
        return waitForStatus('Done', '/application/sync/jobinfo/' + apiPostResponse.SyncJobUUID, 180000);
    }*/

    async function waitForStatus(status: Stats, url: string, time: number) {
        const maxLoops = time / 3000;
        let counter = 0;
        let apiGetResponse;
        do {
            generalService.sleep(3000);
            counter++;
            apiGetResponse = await service.papiClient.get(url);
        } while (apiGetResponse.Status != status && counter < maxLoops);
        return apiGetResponse;
    }
}
