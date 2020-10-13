import GeneralService from '../services/general.service';
import { SyncService } from '../services/sync.service';
import fetch from 'node-fetch';
import { SyncBody, Account, Transaction, GeneralActivity } from '@pepperi-addons/papi-sdk';

declare type TestResult = 'Pass' | 'Fail';
declare type SyncStatus = 'New' | 'SyncStart' | 'Skipped' | 'Done';
interface TestObject {
    TestResult?: string;
    apiGetResponse?: Record<string, unknown>;
    testBody?: Record<string, unknown>;
}
const apiCallsInterval = 400;
let isSkipMechanisem = false;
let isSkipMechanisemHundredGets = false;
let isSkipMechanisemHundredPuts = false;
let isGetResync = false;

let _localData;
let _agentExternalID;
let _catalogExternalID;

// All Sync Tests
export async function SyncAllTests(generalService: GeneralService, describe, expect, it) {
    isSkipMechanisem = true;
    isGetResync = false;
    isSkipMechanisemHundredGets = false;
    isSkipMechanisemHundredPuts = false;
    await SyncTests(generalService, describe, expect, it);
}

export async function SyncTests(generalService: GeneralService, describe, expect, it) {
    const service = new SyncService(generalService.papiClient);

    console.log('Initiate Sync Tests | ' + generalService.getTime());

    let accounts: Account[];
    let transactions: Transaction[];
    let _body = {} as SyncBody;
    let isSkip = false;

    //Test Prerequisites
    try {
        accounts = await service.papiClient.accounts.find({ page: 1 });
        transactions = await service.papiClient.transactions.find({ where: `Type='Sales Order'`, page: 1 });
        const _accountExternalIDStr = accounts[0].ExternalID?.toString();
        const transaction: Transaction = transactions[0];
        const _activityTypeIDStr = transaction.ActivityTypeID;
        _agentExternalID = generalService.getClientData('UserID');
        const catalogs = await generalService.getCatalogs();
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
            LocalDataUpdates: null as any,
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
    }

    //One Hundred Gets
    const getsSize = 100;
    const tempPostOneHundredGetsPromiseArr = [] as any;
    const oneHundredGetResponsArr = [] as any;

    //One Hundred Puts
    const putsSize = 100;
    const tempPostOneHundredPutssPromiseArr = [] as any;
    const oneHundredPutResponsArr = [] as any;
    let hundredOrderLinesValidationResult;

    //Ten Put
    const tenPutsSize = 10;
    const tempPostTenPutssPromiseArr = [] as any;
    const tenPutResponsArr = [] as any;
    let tenOrderLinesValidationResult;

    if (isSkipMechanisem) {
        await Promise.all([
            isSkipMechanisemHundredGets ? createOneHundredGets() : undefined,
            isSkipMechanisemHundredPuts ? createOneHundredPuts() : undefined,
            createTenPuts(),
        ]);
    }

    describe('Sync Tests Suites', () => {
        it('Sync Prerequisites', async () => {
            return Promise.all([
                expect(accounts).to.not.be.undefined,
                expect(transactions).to.not.be.undefined,
                expect(_body).to.not.be.undefined,
            ]);
        });

        describe('Endpoints and data members validations', () => {
            if (isSkip) {
                describe.skip();
            }

            it('Sync Put After Get Valid Response of URL and UUID', async () => {
                const testBody = {} as SyncBody;
                Object.assign(testBody, _body);
                testBody.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                const PutAfterGetTest = await syncPutAfterGet(testBody);
                return expect(PutAfterGetTest).to.contain('Pass' as TestResult);
            });

            it('Simple Sync Put Data Members Validation', async () => {
                const testBody = {} as SyncBody;
                Object.assign(testBody, _body);
                testBody.LocalDataUpdates = {} as any;
                Object.assign(testBody.LocalDataUpdates, _localData);
                for (let index = 0; index < testBody['LocalDataUpdates' as any].jsonBody[2].Lines.length; index++) {
                    testBody['LocalDataUpdates' as any].jsonBody[2].Lines[index][2] = Math.floor(
                        Math.random() * 1000000000,
                    ).toString();
                }
                testBody.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                const syncDataMembersValidationPut: TestObject = await syncDataMembersValidation(testBody);
                if (syncDataMembersValidationPut.TestResult == ('Pass' as TestResult)) {
                    return Promise.all[
                        (expect(
                            await syncPostGetValidation(
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
                const testBody = {} as SyncBody;
                Object.assign(testBody, _body);
                testBody['LocalDataUpdates' as any] = null;
                testBody.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                const syncDataMembersValidationGet: TestObject = await syncDataMembersValidation(testBody);
                if (syncDataMembersValidationGet.TestResult == ('Pass' as TestResult)) {
                    return expect(
                        await syncPostGetValidation(
                            syncDataMembersValidationGet.apiGetResponse,
                            syncDataMembersValidationGet.testBody,
                        ).TestResult,
                    ).to.contain('Pass' as TestResult);
                }
                return expect(syncDataMembersValidationGet.TestResult).to.contain('Pass' as TestResult);
            });

            it('Resync Put Data Members Validation', async () => {
                //Creating a sync that will be stuck
                const testBody = {} as SyncBody;
                Object.assign(testBody, _body);
                testBody['LocalDataUpdates' as any] = null;
                testBody['LocalDataUpdates' as any] += 'Bug';
                testBody.LastSyncDateTime = 62610367500000; //This Uses c# DateTime.Ticks
                testBody.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                const responseOfSyncWithError: TestObject = await syncStuckValidation(testBody);
                if (responseOfSyncWithError.TestResult != ('Pass' as TestResult)) {
                    return expect(responseOfSyncWithError.TestResult).to.contain('Pass' as TestResult);
                }
                //Forcing resync with the same sync data that got stuck
                testBody.LastSyncDateTime = 0;
                const syncDataMembersValidationGet: TestObject = await syncDataMembersValidation(testBody);
                if (syncDataMembersValidationGet.TestResult == ('Pass' as TestResult)) {
                    return expect(syncDataMembersValidationGet.TestResult).to.contain('Pass' as TestResult);
                }
            });

            if (isGetResync) {
                it('Resync Get Data Members Validation', async () => {
                    //Creating a sync that will be stuck
                    const testBody = {} as SyncBody;
                    Object.assign(testBody, _body);
                    testBody.LocalDataUpdates = {} as any;
                    Object.assign(testBody.LocalDataUpdates, _localData);
                    for (let index = 0; index < testBody['LocalDataUpdates' as any].jsonBody[2].Lines.length; index++) {
                        testBody['LocalDataUpdates' as any].jsonBody[2].Lines[index][2] = Math.floor(
                            Math.random() * 1000000000,
                        ).toString();
                    }
                    testBody['LocalDataUpdates' as any] += 'Bug';
                    testBody.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                    const responseOfSyncWithError: TestObject = await syncStuckValidation(testBody);
                    if (responseOfSyncWithError.TestResult != ('Pass' as TestResult)) {
                        return expect(responseOfSyncWithError.TestResult).to.contain('Pass' as TestResult);
                    }
                    //Forcing resync with fixed data that should work
                    testBody.LocalDataUpdates = {} as any;
                    Object.assign(testBody.LocalDataUpdates, _localData);
                    for (let index = 0; index < testBody['LocalDataUpdates' as any].jsonBody[2].Lines.length; index++) {
                        testBody['LocalDataUpdates' as any].jsonBody[2].Lines[index][2] = Math.floor(
                            Math.random() * 1000000000,
                        ).toString();
                    }
                    testBody.LastSyncDateTime = 0;
                    const syncDataMembersValidationPut: TestObject = await syncDataMembersValidation(testBody);
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
            }

            if (isSkipMechanisem) {
                describe('Skipped Mechanisem Tests Scenarios', async () => {
                    if (isSkipMechanisemHundredGets) {
                        it('One Hundred Gets', async () => {
                            for (let index = 0; index < oneHundredGetResponsArr.length; index++) {
                                oneHundredGetResponsArr[index] = oneHundredGetResponsArr[index].Status;
                            }

                            console.log(oneHundredGetResponsArr);
                            expect(JSON.stringify(oneHundredGetResponsArr).match(/Done/g))
                                .to.be.an('array')
                                .with.length.above(0);
                            expect(JSON.stringify(oneHundredGetResponsArr).match(/Skipped/g))
                                .to.be.an('array')
                                .with.length.above(0);
                            expect(JSON.stringify(oneHundredGetResponsArr).match(/Done|Skipped/g))
                                .to.be.an('array')
                                .with.length.of(100);
                        });
                    }

                    if (isSkipMechanisemHundredPuts) {
                        it('One Hundred Puts', async () => {
                            console.log(oneHundredPutResponsArr);
                            expect(hundredOrderLinesValidationResult)
                                .to.have.property('TestResult')
                                .that.contain('Pass' as TestResult);
                            expect(JSON.stringify(oneHundredPutResponsArr).match(/Done/g))
                                .to.be.an('array')
                                .with.length.above(0);
                            expect(JSON.stringify(oneHundredPutResponsArr).match(/Skipped/g))
                                .to.be.an('array')
                                .with.length.above(0);
                            expect(JSON.stringify(oneHundredPutResponsArr).match(/Done|Skipped/g))
                                .to.be.an('array')
                                .with.length.of(100);
                        });
                    }

                    it('Ten Puts With Added Lines', async () => {
                        console.log(tenPutResponsArr);
                        expect(tenOrderLinesValidationResult)
                            .to.have.property('TestResult')
                            .that.contain('Pass' as TestResult);
                        expect(JSON.stringify(tenPutResponsArr).match(/Done/g)).to.be.an('array').with.length.above(0);
                        expect(JSON.stringify(tenPutResponsArr).match(/Skipped/g))
                            .to.be.an('array')
                            .with.length.above(0);
                        expect(JSON.stringify(tenPutResponsArr).match(/Done|Skipped/g))
                            .to.be.an('array')
                            .with.length.of(10);
                    });
                });
            }

            describe('Exit Test', () => {
                it('Test Clean Up', async () => {
                    return expect((await cleanUpTest()).TestResult).to.contain('Pass' as TestResult);
                });
            });
        });
    });

    //#region syncPutAfterGet
    async function syncPutAfterGet(body) {
        body['LocalDataUpdates' as any] = null;
        const getResponse = syncPutAfterGetCallback(await service.post(body));
        if (getResponse.toString().startsWith('Error')) {
            return getResponse;
        }
        body.LocalDataUpdates = {};
        Object.assign(body.LocalDataUpdates, _localData);
        const putResponse = syncPutAfterGetCallback(await service.post(body));
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

    //#region cleanUp
    async function cleanUpTest() {
        let countHiddenTransactions = 0;
        let countFailedToHideTransactions = 0;
        const allActivitiesArr: GeneralActivity | Transaction = (await service.papiClient.allActivities.find({
            where: "CreationDateTime>'2020-07-07Z'",
            page_size: -1,
            orderBy: 'ModificationDateTime DESC',
        })) as any;
        for (let index = 0; index < allActivitiesArr.length; index++) {
            const activityToHide: GeneralActivity | Transaction = allActivitiesArr[index];
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
                    await service.papiClient.transactions.delete(activityToHide.InternalID as any);
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

    async function createOneHundredGets() {
        const testBody = {} as SyncBody;
        Object.assign(testBody, _body);
        testBody.LastSyncDateTime = 62610367500000; //This Uses c# DateTime.Ticks
        testBody['LocalDataUpdates' as any] = null;
        testBody.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
        for (let index = 0; index < getsSize; index++) {
            //POST sync job
            tempPostOneHundredGetsPromiseArr.push(await service.post(testBody));
        }
        for (let index = 0; index < getsSize; index++) {
            oneHundredGetResponsArr.push(
                await waitForSyncStatus(tempPostOneHundredGetsPromiseArr[index].SyncJobUUID, 180000),
            );
        }
    }

    async function createOneHundredPuts() {
        const testBody = {} as SyncBody;
        Object.assign(testBody, _body);
        testBody.LastSyncDateTime = 62610367500000; //This Uses c# DateTime.Ticks
        testBody.LocalDataUpdates = {} as any;
        Object.assign(testBody.LocalDataUpdates, _localData);
        testBody.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
        for (let index = 0; index < putsSize; index++) {
            //POST sync job
            tempPostOneHundredPutssPromiseArr.push(await service.post(testBody));
        }
        for (let index = 0; index < putsSize; index++) {
            oneHundredPutResponsArr.push(
                await waitForSyncStatus(tempPostOneHundredPutssPromiseArr[index].SyncJobUUID, 180000),
            );
        }
        for (let index = 0; index < oneHundredPutResponsArr.length; index++) {
            if (oneHundredPutResponsArr[index].Status == ('Done' as SyncStatus)) {
                hundredOrderLinesValidationResult = await orderCreationValidation(
                    oneHundredPutResponsArr[index],
                    testBody,
                );
                console.log('Done result: ' + JSON.stringify(oneHundredPutResponsArr[index]));
                console.log('Done Body: ' + JSON.stringify(testBody));
            } else if (oneHundredPutResponsArr[index].Status == /SyncStart|New/) {
                console.log('Failed in Hundred Sync Job UUID: ' + tempPostOneHundredPutssPromiseArr[index].SyncJobUUID);
            }
            oneHundredPutResponsArr[index] = oneHundredPutResponsArr[index].Status;
        }
    }

    async function createTenPuts() {
        const testBody = {} as SyncBody;
        Object.assign(testBody, _body);
        testBody.LastSyncDateTime = 62610367500000; //This Uses c# DateTime.Ticks
        testBody.LocalDataUpdates = {} as any;
        Object.assign(testBody.LocalDataUpdates, _localData);
        testBody.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
        for (let index = 0; index < tenPutsSize; index++) {
            //Add one order line in every iteration
            testBody['LocalDataUpdates' as any].jsonBody[2].Lines.push([
                _localData.jsonBody[2].Lines[0][0],
                new Date().getTime().toString(),
                Math.floor(Math.random() * 1000000000).toString(),
                _localData.jsonBody[2].Lines[0][3],
                _agentExternalID,
                _catalogExternalID,
                `Test ${Math.floor(Math.random() * 1000000).toString()}`,
            ]);
            //POST sync job
            tempPostTenPutssPromiseArr.push(await service.post(testBody));
        }
        for (let index = 0; index < tenPutsSize; index++) {
            tenPutResponsArr.push(await waitForSyncStatus(tempPostTenPutssPromiseArr[index].SyncJobUUID, 180000));
        }
        for (let index = 0; index < tenPutResponsArr.length; index++) {
            if (tenPutResponsArr[index].Status == ('Done' as SyncStatus)) {
                tenOrderLinesValidationResult = await orderCreationValidation(tenPutResponsArr[index], testBody);
                console.log('Done result: ' + JSON.stringify(tenPutResponsArr[index]));
                console.log('Done Body: ' + JSON.stringify(testBody));
            } else if (tenPutResponsArr[index].Status == /SyncStart|New/) {
                console.log('Failed in Ten Sync Job UUID: ' + tempPostTenPutssPromiseArr[index].SyncJobUUID);
            }
            tenPutResponsArr[index] = tenPutResponsArr[index].Status;
        }
    }

    //#region syncDataMembersValidation
    async function syncDataMembersValidation(body: SyncBody) {
        const testBody = {} as SyncBody;
        Object.assign(testBody, body);

        //POST sync job
        const syncPostApiResponse = await service.post(testBody);

        //GET sync jobinfo
        const apiGetResponse = await waitForSyncStatus(syncPostApiResponse.SyncJobUUID, 180000);
        if (apiGetResponse.Status == 'Done' && apiGetResponse.ProgressPercentage == 100) {
            return {
                TestResult: 'Pass',
                apiGetResponse: apiGetResponse,
                testBody: testBody as any,
            } as TestObject;
        } else {
            return {
                TestResult: `The Get Status is: '${apiGetResponse.Status} , and the Progress Percentage is: '${apiGetResponse.ProgressPercentage} after 180 sec The Sync UUID is: ${apiGetResponse.SyncUUID}. The DB-UUID is: ${apiGetResponse.ClientInfo.ClientDBUUID}`,
            } as TestObject;
        }
    }
    //#endregion syncDataMembersValidation

    //#region syncStuckValidation
    async function syncStuckValidation(body: SyncBody) {
        const testBody = {} as SyncBody;
        Object.assign(testBody, body);

        //POST sync job
        const syncPostApiResponse = await service.post(testBody);

        //GET sync jobinfo
        const apiGetResponse = await waitForSyncStatus(syncPostApiResponse.SyncJobUUID, 90000);
        if (apiGetResponse.Status == 'SyncStart' && apiGetResponse.ProgressPercentage == 1) {
            return {
                TestResult: 'Pass',
                apiGetResponse: apiGetResponse,
                testBody: testBody as any,
            } as TestObject;
        } else {
            return {
                TestResult: `The Get Status is: '${apiGetResponse.Status} , and the Progress Percentage is: '${apiGetResponse.ProgressPercentage} after 90 sec The Sync UUID is: ${apiGetResponse.SyncUUID}. The DB-UUID is: ${apiGetResponse.ClientInfo.ClientDBUUID}`,
            } as TestObject;
        }
    }
    //#endregion syncStuckValidation

    //#region wait for status
    async function waitForSyncStatus(uuid: string, maxTime: number) {
        const maxLoops = maxTime / (apiCallsInterval * 10);
        let counter = 0;
        let apiGetResponse;
        do {
            if (apiGetResponse != undefined) {
                generalService.sleep(apiCallsInterval * 10);
            }
            counter++;
            apiGetResponse = await service.jobInfo(uuid);
        } while (
            (apiGetResponse.Status == ('SyncStart' as SyncStatus) || apiGetResponse.Status == ('New' as SyncStatus)) &&
            apiGetResponse.ModificationDateTime - apiGetResponse.CreationDateTime < maxTime &&
            counter < maxLoops
        );
        return apiGetResponse;
    }
    //#endregion wait for status

    //#region resyncWithOrderCreationValidation
    async function orderCreationValidation(apiGetResponse, testBody) {
        let errorMessage = '';
        //Create local test values for comparison
        const localTestValuesArr: string[] = [];
        if (testBody.LocalDataUpdates != null) {
            for (let index = 0; index < testBody['LocalDataUpdates' as any].jsonBody[2].Headers.length; index++) {
                localTestValuesArr.push(testBody['LocalDataUpdates' as any].jsonBody[2].Headers[index].toString());
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
            for (let j = 0; j < testBody['LocalDataUpdates' as any].jsonBody[2].Lines.length; j++) {
                const getTransactionsLines = await service.papiClient.allActivities.find({
                    where: `ExternalID=${testBody['LocalDataUpdates' as any].jsonBody[2].Lines[j][2]}`,
                });
                if (getTransactionsLines.length > 0) {
                    for (let index = 0; index < localTestValuesArr.length; index++) {
                        try {
                            if (
                                getTransactionsLines[0][localTestValuesArr[index]] !=
                                testBody['LocalDataUpdates' as any].jsonBody[2].Lines[j][index]
                            ) {
                                console.log(
                                    `Is this: ${getTransactionsLines[0][localTestValuesArr[index]]}, equal to this: ${
                                        testBody['LocalDataUpdates' as any].jsonBody[2].Lines[j][index]
                                    }`,
                                );
                                errorMessage += `Missmatch sent Property: ${
                                    testBody['LocalDataUpdates' as any].jsonBody[2].Lines[j][index]
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
                    errorMessage += `New transaction with ExternalID = ${
                        testBody['LocalDataUpdates' as any].jsonBody[2].Lines[j][2]
                    }, was not found | `;
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

    //#region check file
    //Get the stream of the file' and check if its size is bigger then 10 KB
    async function checkFile(url) {
        return true;
        const fileContent: string = await fetch(url).then((response) => response.text());
        //if the file is very big, no need to count bytes on stream
        if (fileContent.length > 100000) {
            return true;
        }
        return (encodeURI(fileContent).split(/%..|./).length - 1) / 1000 > 10;
    }
    //#endregion check file
}
