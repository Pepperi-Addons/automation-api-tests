import GeneralService from '../services/general.service';
import { FieldsService } from '../services/fields.service';
import fetch from 'node-fetch';

declare type TestResult = 'Pass' | 'Fail';
declare type SyncStatus = 'New' | 'SyncStart' | 'Skipped' | 'Done';
interface TestObject {
    TestResult?: string;
    apiGetResponse?: Record<string, unknown>;
    testBody?: Record<string, unknown>;
}
const apiCallsInvterval = 400;
let _localData;
let _agentExternalID;
let _catalogExternalID;

// All Sync Tests
export async function SyncTests(generalService: GeneralService, describe, expect, it) {
    const service = new FieldsService(generalService.papiClient);

    console.log('Initiate Sync Tests | ' + generalService.getTime());

    let accounts;
    let activities;
    let _body;
    let isSkip = false;
    describe('Sync Tests Suites', async () => {
        it('Sync Prerequisites', async () => {
            try {
                accounts = await service.papiClient.accounts.find({ page: 1 });
                activities = await service.papiClient.transactions.find({ where: `Type='Sales Order'`, page: 1 });
                const _accountExternalIDStr = accounts[0].ExternalID?.toString();
                const activiy = activities[0];

                const _activityTypeIDStr = activiy.ActivityTypeID;

                _agentExternalID = generalService.getClientData('UserID');
                const catalogs = await service.papiClient.get('/catalogs');
                _catalogExternalID = catalogs[0].InternalID;
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
                                    _agentExternalID,
                                    _catalogExternalID,
                                    `Test ${Math.floor(Math.random() * 1000000).toString()}`,
                                ],
                                [
                                    _accountExternalIDStr,
                                    new Date().getTime().toString(),
                                    Math.floor(Math.random() * 1000000000).toString(),
                                    _activityTypeIDStr,
                                    _agentExternalID,
                                    _catalogExternalID,
                                    `Test ${Math.floor(Math.random() * 1000000).toString()}`,
                                ],
                            ],
                        },
                    },
                };
                //GET
                _body = {
                    LocalDataUpdates: null,
                    LastSyncDateTime: 62610367500000, //This Uses c# DateTime.Ticks
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
            } catch (error) {
                isSkip = true;
                return expect(error).to.be.null;
            }
            Promise.all([
                expect(accounts).to.not.be.undefined,
                expect(activities).to.not.be.undefined,
                expect(_body).to.not.be.undefined,
            ]);
        });

        describe('Endpoints and data members validations', () => {
            if (isSkip) {
                describe.skip();
            }

            it('Sync Put After Get Valid Response of URL and UUID', async () => {
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                const PutAfterGetTest = await syncPutAfterGet(_body);
                return expect(PutAfterGetTest).to.contain('Pass' as TestResult);
            });

            it('Simple Sync Put Data Members Validation', async () => {
                _body.LocalDataUpdates = _localData;
                for (let index = 0; index < _body.LocalDataUpdates.jsonBody[2].Lines.length; index++) {
                    _body.LocalDataUpdates.jsonBody[2].Lines[index][2] = Math.floor(
                        Math.random() * 1000000000,
                    ).toString();
                }
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                const syncDataMembersValidationPut: TestObject = await syncDataMembersValidation(_body);
                if (syncDataMembersValidationPut.TestResult == ('Pass' as TestResult)) {
                    return Promise.all[
                        (expect(
                            syncPostGetValidation(
                                syncDataMembersValidationPut.apiGetResponse,
                                syncDataMembersValidationPut.testBody,
                            ).TestResult,
                        ).to.contain('Pass' as TestResult),
                        await expect(
                            orderCreationValidation(
                                syncDataMembersValidationPut.apiGetResponse,
                                syncDataMembersValidationPut.testBody,
                            ),
                        )
                            .eventually.to.have.property('TestResult')
                            .that.contain('Pass' as TestResult))
                    ];
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

            it('Resync Put Data Members Validation', async () => {
                //Creating a sync that will be stuck
                _body.LocalDataUpdates = _localData;
                for (let index = 0; index < _body.LocalDataUpdates.jsonBody[2].Lines.length; index++) {
                    _body.LocalDataUpdates.jsonBody[2].Lines[index][2] = Math.floor(
                        Math.random() * 1000000000,
                    ).toString();
                }
                _body.LocalDataUpdates += 'Bug';
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                const responseOfSyncWithError: TestObject = await syncStuckValidation(_body);
                if (responseOfSyncWithError.TestResult != ('Pass' as TestResult)) {
                    return expect(responseOfSyncWithError.TestResult).to.contain('Pass' as TestResult);
                }

                //Forcing resync with fixed data that should work
                _body.LocalDataUpdates = _localData;
                for (let index = 0; index < _body.LocalDataUpdates.jsonBody[2].Lines.length; index++) {
                    _body.LocalDataUpdates.jsonBody[2].Lines[index][2] = Math.floor(
                        Math.random() * 1000000000,
                    ).toString();
                }
                _body.LastSyncDateTime = 0;
                const syncDataMembersValidationPut: TestObject = await syncDataMembersValidation(_body);
                if (syncDataMembersValidationPut.TestResult == ('Pass' as TestResult)) {
                    const resyncWithOrderCreationValidationPut = await orderCreationValidation(
                        syncDataMembersValidationPut.apiGetResponse,
                        syncDataMembersValidationPut.testBody,
                    );
                    return expect(resyncWithOrderCreationValidationPut.TestResult).to.contain('Pass' as TestResult);
                } else {
                    return expect(syncDataMembersValidationPut.TestResult).to.contain('Pass' as TestResult);
                }
            });

            it('Resync Get Data Members Validation', async () => {
                //Creating a sync that will be stuck
                _body.LocalDataUpdates = null;
                _body.LocalDataUpdates += 'Bug';
                _body.LastSyncDateTime = 62610367500000; //This Uses c# DateTime.Ticks
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                const responseOfSyncWithError: TestObject = await syncStuckValidation(_body);
                if (responseOfSyncWithError.TestResult != ('Pass' as TestResult)) {
                    return expect(responseOfSyncWithError.TestResult).to.contain('Pass' as TestResult);
                }

                //Forcing resync with the same sync data that got stuck
                _body.LastSyncDateTime = 0;
                const syncDataMembersValidationGet: TestObject = await syncDataMembersValidation(_body);
                if (syncDataMembersValidationGet.TestResult == ('Pass' as TestResult)) {
                    return expect(syncDataMembersValidationGet.TestResult).to.contain('Pass' as TestResult);
                }
            });
        });

        describe('Skipped Mechanisem Tests Scenarios', () => {
            it('One Hundred Gets', async () => {
                const getsSize = 100;
                const tempPostPromiseArr = [] as any;
                _body.LastSyncDateTime = 62610367500000; //This Uses c# DateTime.Ticks
                _body.LocalDataUpdates = null;
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                for (let index = 0; index < getsSize; index++) {
                    //POST sync job
                    tempPostPromiseArr.push(await service.papiClient.post('/application/sync', _body));
                }

                const oneHundredGetResponsArr = [] as any;
                for (let index = 0; index < getsSize; index++) {
                    oneHundredGetResponsArr.push(
                        await waitForStatus(
                            '/application/sync/jobinfo/' + tempPostPromiseArr[index].SyncJobUUID,
                            180000,
                        ),
                    );
                }

                for (let index = 0; index < oneHundredGetResponsArr.length; index++) {
                    oneHundredGetResponsArr[index] = oneHundredGetResponsArr[index].Status;
                }

                console.log(oneHundredGetResponsArr);
                expect(JSON.stringify(oneHundredGetResponsArr).match(/Done/g)).to.be.an('array').with.length.above(0);
                expect(JSON.stringify(oneHundredGetResponsArr).match(/Skipped/g))
                    .to.be.an('array')
                    .with.length.above(0);
                expect(JSON.stringify(oneHundredGetResponsArr).match(/Done|Skipped/g))
                    .to.be.an('array')
                    .with.length.of(100);
            });

            it('One Hundred Puts', async () => {
                const putsSize = 100;
                const tempPostPromiseArr = [] as any;
                _body.LastSyncDateTime = 62610367500000; //This Uses c# DateTime.Ticks
                _body.LocalDataUpdates = _localData;
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                for (let index = 0; index < putsSize; index++) {
                    //POST sync job
                    tempPostPromiseArr.push(await service.papiClient.post('/application/sync', _body));
                }

                const oneHundredPutResponsArr = [] as any;
                for (let index = 0; index < putsSize; index++) {
                    oneHundredPutResponsArr.push(
                        await waitForStatus(
                            '/application/sync/jobinfo/' + tempPostPromiseArr[index].SyncJobUUID,
                            180000,
                        ),
                    );
                }

                let orderLinesValidationResult;
                for (let index = 0; index < oneHundredPutResponsArr.length; index++) {
                    if (oneHundredPutResponsArr[index].Status == ('Done' as SyncStatus)) {
                        orderLinesValidationResult = await orderCreationValidation(
                            oneHundredPutResponsArr[index],
                            _body,
                        );
                        console.log('Done result: ' + JSON.stringify(oneHundredPutResponsArr[index]));
                        console.log('Done Body: ' + JSON.stringify(_body));
                    }
                    oneHundredPutResponsArr[index] = oneHundredPutResponsArr[index].Status;
                }

                console.log(oneHundredPutResponsArr);
                expect(orderLinesValidationResult)
                    .to.have.property('TestResult')
                    .that.contain('Pass' as TestResult);
                expect(JSON.stringify(oneHundredPutResponsArr).match(/Done/g)).to.be.an('array').with.length.above(0);
                expect(JSON.stringify(oneHundredPutResponsArr).match(/Skipped/g))
                    .to.be.an('array')
                    .with.length.above(0);
                expect(JSON.stringify(oneHundredPutResponsArr).match(/Done|Skipped/g))
                    .to.be.an('array')
                    .with.length.of(100);
            });

            it('Twenty Puts With Added Lines', async () => {
                const putsSize = 20;
                const tempPostPromiseArr = [] as any;
                _body.LastSyncDateTime = 62610367500000; //This Uses c# DateTime.Ticks
                _body.LocalDataUpdates = _localData;
                _body.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                for (let index = 0; index < putsSize; index++) {
                    //Add one order line in every iteration
                    _body.LocalDataUpdates.jsonBody[2].Lines.push([
                        _localData.jsonBody[2].Lines[0][0],
                        new Date().getTime().toString(),
                        Math.floor(Math.random() * 1000000000).toString(),
                        _localData.jsonBody[2].Lines[0][3],
                        _agentExternalID,
                        _catalogExternalID,
                        `Test ${Math.floor(Math.random() * 1000000).toString()}`,
                    ]);
                    //POST sync job
                    tempPostPromiseArr.push(await service.papiClient.post('/application/sync', _body));
                }

                const twentyPutResponsArr = [] as any;
                for (let index = 0; index < putsSize; index++) {
                    twentyPutResponsArr.push(
                        await waitForStatus(
                            '/application/sync/jobinfo/' + tempPostPromiseArr[index].SyncJobUUID,
                            180000,
                        ),
                    );
                }

                let orderLinesValidationResult;
                for (let index = 0; index < twentyPutResponsArr.length; index++) {
                    if (twentyPutResponsArr[index].Status == ('Done' as SyncStatus)) {
                        orderLinesValidationResult = await orderCreationValidation(twentyPutResponsArr[index], _body);
                        console.log('Done result: ' + JSON.stringify(twentyPutResponsArr[index]));
                        console.log('Done Body: ' + JSON.stringify(_body));
                    }
                    twentyPutResponsArr[index] = twentyPutResponsArr[index].Status;
                }

                console.log(twentyPutResponsArr);
                expect(orderLinesValidationResult)
                    .to.have.property('TestResult')
                    .that.contain('Pass' as TestResult);
                expect(JSON.stringify(twentyPutResponsArr).match(/Done/g)).to.be.an('array').with.length.above(0);
                expect(JSON.stringify(twentyPutResponsArr).match(/Skipped/g))
                    .to.be.an('array')
                    .with.length.above(0);
                expect(JSON.stringify(twentyPutResponsArr).match(/Done|Skipped/g))
                    .to.be.an('array')
                    .with.length.of(20);
            });
        });

        describe('Exit Test', () => {
            it('Test Clean Up', async () => {
                return expect((await cleanUpTest()).TestResult).to.contain('Pass' as TestResult);
            });
        });
    });

    //#region syncPutAfterGet
    async function syncPutAfterGet(body) {
        body.LocalDataUpdates = null;
        const getResponse = syncPutAfterGetCallback(await service.papiClient.post('/application/sync', body));
        if (getResponse.toString().startsWith('Error')) {
            return getResponse;
        }
        body.LocalDataUpdates = _localData;
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
                TestResult: `The Get Status is: '${apiGetResponse.Status} , and the Progress Percentage is: '${apiGetResponse.ProgressPercentage} after 180 sec The Sync UUID is: ${apiGetResponse.SyncUUID}. The DB-UUID is: ${apiGetResponse.ClientInfo.ClientDBUUID}`,
            } as TestObject;
        }
    }
    //#endregion syncDataMembersValidation

    //#region syncStuckValidation
    async function syncStuckValidation(body) {
        const testBody = {};
        Object.assign(testBody, body);

        //POST sync job
        const syncPostApiResponse = await service.papiClient.post('/application/sync', testBody);

        //GET sync jobinfo
        const apiGetResponse = await waitForStatus(
            '/application/sync/jobinfo/' + syncPostApiResponse.SyncJobUUID,
            90000,
        );
        if (apiGetResponse.Status == 'SyncStart' && apiGetResponse.ProgressPercentage == 1) {
            return {
                TestResult: 'Pass',
                apiGetResponse: apiGetResponse,
                testBody: testBody,
            } as TestObject;
        } else {
            return {
                TestResult: `The Get Status is: '${apiGetResponse.Status} , and the Progress Percentage is: '${apiGetResponse.ProgressPercentage} after 90 sec The Sync UUID is: ${apiGetResponse.SyncUUID}. The DB-UUID is: ${apiGetResponse.ClientInfo.ClientDBUUID}`,
            } as TestObject;
        }
    }
    //#endregion syncStuckValidation

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

    //#region resyncWithOrderCreationValidation
    async function orderCreationValidation(apiGetResponse, testBody) {
        let errorMessage = '';
        //Create local test values for comparison
        const localTestValuesArr: string[] = [];
        if (testBody.LocalDataUpdates != null) {
            for (let index = 0; index < testBody.LocalDataUpdates.jsonBody[2].Headers.length; index++) {
                localTestValuesArr.push(testBody.LocalDataUpdates.jsonBody[2].Headers[index].toString());
            }
            for (let index = 0; index < localTestValuesArr.length; index++) {
                if (localTestValuesArr[index] == 'AgentWrntyID') {
                    localTestValuesArr.pop();
                    index--;
                }
                if (localTestValuesArr[index] == 'CatalogWrntyID') {
                    localTestValuesArr.pop();
                    index--;
                }
            }
        }
        try {
            // test that correct transactions created
            for (let j = 0; j < testBody.LocalDataUpdates.jsonBody[2].Lines.length; j++) {
                const getTransactionsLines = await service.papiClient.allActivities.find({
                    where: `ExternalID=${testBody.LocalDataUpdates.jsonBody[2].Lines[j][2]}`,
                });
                if (getTransactionsLines.length > 0) {
                    for (let index = 0; index < localTestValuesArr.length; index++) {
                        try {
                            if (
                                getTransactionsLines[0][localTestValuesArr[index]] !=
                                testBody.LocalDataUpdates.jsonBody[2].Lines[j][index]
                            ) {
                                console.log(
                                    `Is this: ${getTransactionsLines[0][localTestValuesArr[index]]}, equal to this: ${
                                        testBody.LocalDataUpdates.jsonBody[2].Lines[j][index]
                                    }`,
                                );
                                errorMessage += `Missmatch sent Property: ${
                                    testBody.LocalDataUpdates.jsonBody[2].Lines[j][index]
                                } Not identical to recived Property: ${
                                    getTransactionsLines[0][localTestValuesArr[index]]
                                } | `;
                            }
                        } catch (error) {
                            console.log(`Error for: ${[localTestValuesArr[index]]} | ${error}`);
                            errorMessage += `For Client Info Prop: ${[
                                localTestValuesArr[index],
                            ]} Error was thrown: ${error} | `;
                        }
                    }
                    //test that the file was created in the serverd
                    if (!checkFile(apiGetResponse.DataUpdates.URL)) {
                        errorMessage += 'File was not created on the sever | ';
                    }
                } else {
                    errorMessage += `New transaction with ExternalID = ${testBody.LocalDataUpdates.jsonBody[2].Lines[j][2]}, was not found | `;
                }
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
    //#endregion resyncWithOrderCreationValidation

    //#region cleanUp
    async function cleanUpTest() {
        let countHiddenTransactions = 0;
        let countFailedToHideTransactions = 0;
        const allActivitiesArr = (await service.papiClient.allActivities.find({
            where: "CreationDateTime>'2020-07-07Z'",
            page_size: -1,
            orderBy: 'ModificationDateTime DESC',
        })) as any;
        for (let index = 0; index < allActivitiesArr.length; index++) {
            const activityToHide = allActivitiesArr[index];
            if (activityToHide.Remark.startsWith('Test ') && parseInt(activityToHide.Remark.split(' ')[1]) > 200) {
                const transaction = {
                    InternalID: activityToHide.InternalID,
                    Hidden: true,
                };
                countHiddenTransactions++;
                try {
                    /*if (index % 2 == 0) { //This can verify that DI-16911 is fixed, but its not yet developed by Maor Akav 17/09/2020
                        await service.papiClient.post('/transactions', transaction);*/
                    /*} else {*/
                    await service.papiClient.transactions.delete(activityToHide.InternalID);
                    /*}*/
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
                })are Hidden = true | ${generalService.getTime()}`,
            );
        } else {
            console.log(
                `Done: all the new transactions (${countHiddenTransactions}) are Hidden = true | ${generalService.getTime()}`,
            );
        }
        if (countFailedToHideTransactions > 0) {
            return {
                TestResult: `Error: hidden failed for some transaction (${countFailedToHideTransactions}) and sucssfuly for (${
                    countHiddenTransactions - countFailedToHideTransactions
                }) that are now with Hidden = true | ${generalService.getTime()}`,
            } as TestObject;
        } else {
            return { TestResult: 'Pass' } as TestObject;
        }
    }
    //#endregion cleanUp

    //#region check file
    //Get the stream of the file' and check if its size is bigger then 10 KB
    async function checkFile(url) {
        const fileContent: string = await fetch(url).then((response) => response.text());
        //if the file is very big, no need to count bytes on stream
        if (fileContent.length > 100000) {
            return true;
        }
        return (encodeURI(fileContent).split(/%..|./).length - 1) / 1000 > 10;
    }
    //#endregion check file

    //#region wait for status
    async function waitForStatus(url: string, maxTime: number) {
        const maxLoops = maxTime / (apiCallsInvterval * 10);
        let counter = 0;
        let apiGetResponse;
        do {
            if (apiGetResponse != undefined) {
                generalService.sleep(apiCallsInvterval * 10);
            }
            counter++;
            apiGetResponse = await service.papiClient.get(url);
        } while (
            (apiGetResponse.Status == ('SyncStart' as SyncStatus) || apiGetResponse.Status == ('New' as SyncStatus)) &&
            apiGetResponse.ModificationDateTime - apiGetResponse.CreationDateTime < maxTime &&
            counter < maxLoops
        );
        return apiGetResponse;
    }
    //#endregion wait for status
}
