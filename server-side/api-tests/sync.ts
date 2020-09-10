import GeneralService from '../services/general.service';
import tester from '../tester';
import { FieldsService } from '../services/fields.service';
import fetch from 'node-fetch';

declare type TestResult = 'Pass' | 'Fail';
declare type Stats = 'Done' | 'Skipp' | 'SyncStart';

let _localData;
let _syncTestCount = 0;
const _syncCache = {
    Get: {},
    Put: {},
    CleanUp: {},
};
let _agentWrntyID;
let _catalogWrntyID;

// All File Storage Tests //NeedToCover: [] Covered: [Grid, Details, Configuration, Menu, Map, Grid, Form, Card, Large, Line, CardsGrid]
export async function SyncTests(generalService: GeneralService) {
    const service = new FieldsService(generalService.papiClient);
    const { describe, expect, it, run } = tester();

    console.log('Initiate Sync Tests | ' + getDateAndTime());

    const accounts = await service.papiClient.accounts.find({ page: 1 });
    const activities = await service.papiClient.transactions.find({
        where: `Type='Sales Order'`,
        page: 1,
    });

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

    //Test Config
    const testConfigObj = {
        PutAfterGetTest: '' as any,
        syncDataMembersValidationPut: '' as any,
        syncDataMembersValidationGet: '' as any,
        //PutAfterGetTest: "" as any,
        //PutAfterGetTest: "" as any,
    };

    _syncTestCount = Object.keys(testConfigObj).length;

    async function syncPutAfterGetTest() {
        _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
        const PutAfterGetTest = await syncPutAfterGet(_body);
        return PutAfterGetTest;
    }
    testConfigObj.PutAfterGetTest = await syncPutAfterGetTest();
    _syncTestCount--;

    async function syncDataMembersValidationPut() {
        _body.LocalDataUpdates = _localData;
        _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
        const syncDataMembersValidationPut = await syncDataMembersValidation(_body);
        return syncDataMembersValidationPut;
    }
    let validationPutResponse = await syncDataMembersValidationPut();
    if (validationPutResponse['TestResult'] == ('Pass' as TestResult)) {
        validationPutResponse = await syncPostGetValidation(
            validationPutResponse['apiGetResponse'],
            validationPutResponse['testBody'],
        );
        if (validationPutResponse == ('Pass' as TestResult)) {
            testConfigObj.syncDataMembersValidationPut = validationPutResponse;
            _syncTestCount--;
        } else {
            testConfigObj.syncDataMembersValidationPut = validationPutResponse;
            _syncTestCount--;
        }
    } else {
        testConfigObj.syncDataMembersValidationPut = validationPutResponse;
        _syncTestCount--;
    }

    async function syncDataMembersValidationGet() {
        _body.LocalDataUpdates = null;
        _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
        const syncDataMembersValidationGet = await syncDataMembersValidation(_body);
        return syncDataMembersValidationGet;
    }
    let validationGetResponse = await syncDataMembersValidationGet();
    if (validationGetResponse['TestResult'] == ('Pass' as TestResult)) {
        validationGetResponse = await syncPostGetValidation(
            validationGetResponse['apiGetResponse'],
            validationGetResponse['testBody'],
        );
        if (validationGetResponse == ('Pass' as TestResult)) {
            testConfigObj.syncDataMembersValidationGet = validationGetResponse;
            _syncTestCount--;
        } else {
            testConfigObj.syncDataMembersValidationGet = validationGetResponse;
            _syncTestCount--;
        }
    } else {
        testConfigObj.syncDataMembersValidationGet = validationGetResponse;
        _syncTestCount--;
    }

    let inetrvalLimit = 600000;
    const SetIntervalEvery = 6000;
    await new Promise((resolve) => {
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
            }
        }, SetIntervalEvery);
    });

    describe('Sync Tests Suites', () => {
        describe('Endpoints and data members validations', () => {
            it('Sync Put After Get Valid Response of URL and UUID', async () => {
                return expect(testConfigObj.PutAfterGetTest).to.contain('Pass' as TestResult);
            });

            it('Simple Sync Put Data Members Validation', async () => {
                _body.LocalDataUpdates = _localData;
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                return expect(testConfigObj.syncDataMembersValidationPut).to.contain('Pass' as TestResult);
            });

            it('Simple Sync Get Data Members Validation', async () => {
                _body.LocalDataUpdates = null;
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                return expect(testConfigObj.syncDataMembersValidationGet).to.contain('Pass' as TestResult);
            });

            it('Simple Sync Get', async () => {
                _body.LocalDataUpdates = null;
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                return expect(testConfigObj.syncDataMembersValidationGet).to.contain('Pass' as TestResult);
            });

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
                const CleanUpTest = await cleanUpTest().then(function (result) {
                    return result;
                });
                return expect(CleanUpTest).to.contain('Pass' as TestResult);
            });
        });
    });

    return run();

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
            return { TestResult: 'Pass', apiGetResponse: apiGetResponse, testBody: testBody };
        } else {
            return `The Get Status is: '${apiGetResponse.Status} , after 180 sec The Sync UUID is: ${apiGetResponse.SyncUUID}. The DB-UUID is: ${apiGetResponse.ClientInfo.ClientDBUUID}`;
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
            return 'Pass' as TestResult;
        } else {
            return errorMessage;
        }
    }
    //#endregion syncPostGetValidation

    //#region cleanUp
    async function cleanUpTest() {
        _syncCache.CleanUp['Hide All The New Transactions'] = {};
        _syncCache.CleanUp['Hide All The New Transactions'].ErrorMessage = '';
        let countHiddenTransactions = 0;
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
                await service.papiClient.post('/transactions', transaction);
            }
        }
        console.log(
            `Done: all the new transactions (${countHiddenTransactions}) are Hidden = true | ${getDateAndTime()}`,
        );
        return 'Pass' as TestResult;
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
