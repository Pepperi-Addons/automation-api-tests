import GeneralService, { TesterFunctions } from '../services/general.service';
import { SyncService } from '../services/sync.service';
import { SyncBody, Account, Transaction, GeneralActivity } from '@pepperi-addons/papi-sdk';

declare type TestResult = 'Pass' | 'Fail';
declare type SyncStatus = 'New' | 'SyncStart' | 'Skipped' | 'Done';
interface TestObject {
    TestResult?: string;
    apiGetResponse?: Record<string, unknown>;
    testBody?: Record<string, unknown>;
}
const apiCallsInterval = 4000;
let isBase = true;
let isSkipMechanisem = false;
let isSkipMechanisemHundredGets = false;
let isSkipMechanisemHundredPuts = false;
let isSkipMechanisemErrors = false;
let isGetResync = false;
let isPutResync = false;
let isBigData = false;
let isCleanAfterTests = false;

let _localData;
let _agentExternalID;
let _catalogExternalID;

// All Sync Tests
export async function SyncClean(generalService: GeneralService, tester: TesterFunctions) {
    isBase = false;
    isSkipMechanisem = false;
    isSkipMechanisemHundredGets = false;
    isSkipMechanisemHundredPuts = false;
    isGetResync = false;
    isPutResync = false;
    isBigData = false;
    isCleanAfterTests = true;
    await ExecuteSyncTests(generalService, tester);
}

export async function SyncWithBigData(generalService: GeneralService, tester: TesterFunctions) {
    isBase = false;
    isSkipMechanisem = false;
    isSkipMechanisemHundredGets = false;
    isSkipMechanisemHundredPuts = false;
    isGetResync = false;
    isPutResync = false;
    isBigData = true;
    isCleanAfterTests = false;
    await ExecuteSyncTests(generalService, tester);
}

export async function SyncLongTests(generalService: GeneralService, tester: TesterFunctions) {
    isBase = false;
    isSkipMechanisem = true;
    isSkipMechanisemHundredGets = false;
    isSkipMechanisemHundredPuts = false;
    isSkipMechanisemErrors = false;
    isGetResync = false;
    isPutResync = true;
    isBigData = false;
    isCleanAfterTests = true;
    await ExecuteSyncTests(generalService, tester);
}

export async function SyncTests(generalService: GeneralService, tester: TesterFunctions) {
    isBase = true;
    isSkipMechanisem = false;
    isSkipMechanisemHundredGets = false;
    isSkipMechanisemHundredPuts = false;
    isGetResync = false;
    isPutResync = false;
    isBigData = false;
    isCleanAfterTests = true;
    await ExecuteSyncTests(generalService, tester);
}

export async function ExecuteSyncTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = new SyncService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    console.log('Initiate Sync Tests | ' + generalService.getTime());

    let accounts: Account[];
    let transactions: Transaction[];
    let _body = {} as SyncBody;
    let isSkip = false;
    let _accountExternalIDStr;
    let _accountUUID;
    let _activityTypeIDStr;

    //Test Prerequisites
    try {
        accounts = await service.papiClient.accounts.find({ page_size: 1 });
        _accountExternalIDStr = accounts[0].ExternalID?.toString();
        _accountUUID = accounts[0].UUID;
        let transaction: Transaction;
        try {
            transactions = await service.papiClient.transactions.find({ where: `Type='Sales Order'`, page_size: 1 });
            transaction = transactions[0];
            _activityTypeIDStr = transaction.ActivityTypeID;
        } catch (error) {
            console.log(error);
            transactions = await service.papiClient.transactions.find({
                where: `Type LIKE '%Sales Order%'`,
                page_size: 1,
            });
            transaction = transactions[0];
            _activityTypeIDStr = transaction.ActivityTypeID;
        }
        _agentExternalID = generalService.getClientData('UserID');
        const catalogs = await generalService.getCatalogs();
        _catalogExternalID = catalogs[0].InternalID;
        _localData = {
            jsonBody: {
                2: {
                    Headers: [
                        'AccountExternalID',
                        'AccountUUID',
                        'DiscountPercentage',
                        'ExternalID',
                        'ActivityTypeID',
                        'AgentWrntyID',
                        'CatalogWrntyID',
                        'Remark',
                        'WrntyID',
                    ],
                    Lines: [
                        [
                            _accountExternalIDStr,
                            _accountUUID,
                            Math.floor(Math.random() * 100),
                            Math.floor(Math.random() * 100000000000).toString() +
                                Math.random().toString(36).substring(10),
                            _activityTypeIDStr,
                            _agentExternalID,
                            _catalogExternalID,
                            `Test ${Math.floor(Math.random() * 1000000).toString()}`,
                            `-${Math.floor(Math.random() * 1000123).toString()}`,
                        ],
                        [
                            _accountExternalIDStr,
                            _accountUUID,
                            Math.floor(Math.random() * 100),
                            Math.floor(Math.random() * 100000000000).toString() +
                                Math.random().toString(36).substring(10),
                            _activityTypeIDStr,
                            _agentExternalID,
                            _catalogExternalID,
                            `Test ${Math.floor(Math.random() * 1000000).toString()}`,
                            `-${Math.floor(Math.random() * 1000321).toString()}`,
                        ],
                    ],
                },
            },
        };
        generalService.sleep(Math.floor(Math.random() * 10));
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
        console.log(error);
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
    const tenPutDataResponsArr = [] as any;
    const tenPutsResponsArr = [] as any;
    let tenOrderLinesValidationResult;

    if (isSkipMechanisem) {
        await Promise.all([
            isSkipMechanisemHundredGets ? createOneHundredGets() : undefined,
            isSkipMechanisemHundredPuts ? createOneHundredPuts() : undefined,
            isSkipMechanisemErrors ? fail50Syncs() : undefined,
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

        describe('Endpoints And Data Members Validations', () => {
            if (isSkip) {
                throw new Error('Test Skipped: Prerequisites not met');
            }

            if (isBase) {
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
                        testBody['LocalDataUpdates' as any].jsonBody[2].Lines[index][3] =
                            Math.floor(Math.random() * 100000000000).toString() +
                            Math.random().toString(36).substring(10);
                    }
                    testBody.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                    const syncDataMembersValidationPut: TestObject = await syncDataMembersValidation(testBody);
                    if (syncDataMembersValidationPut.TestResult == ('Pass' as TestResult)) {
                        return Promise.all[
                            (await expect(
                                syncPostGetValidation(
                                    syncDataMembersValidationPut.apiGetResponse,
                                    syncDataMembersValidationPut.testBody,
                                ),
                            )
                                .eventually.to.have.property('TestResult')
                                .that.contain('Pass' as TestResult),
                            expect(
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
                            syncPostGetValidation(
                                syncDataMembersValidationGet.apiGetResponse,
                                syncDataMembersValidationGet.testBody,
                            ),
                        )
                            .eventually.to.have.property('TestResult')
                            .that.contain('Pass' as TestResult);
                    }
                    return expect(syncDataMembersValidationGet.TestResult).to.contain('Pass' as TestResult);
                });

                it('Simple Sync Put Data Members Validation (Missing AccountExternalID - NUC 9.5.89)', async () => {
                    const testBody = {} as SyncBody;
                    Object.assign(testBody, _body);
                    testBody.LocalDataUpdates = {} as any;
                    Object.assign(testBody.LocalDataUpdates, _localData);
                    for (let index = 0; index < testBody['LocalDataUpdates' as any].jsonBody[2].Lines.length; index++) {
                        testBody['LocalDataUpdates' as any].jsonBody[2].Lines[index][0] = '';
                        testBody['LocalDataUpdates' as any].jsonBody[2].Lines[index][3] =
                            Math.floor(Math.random() * 100000000000).toString() +
                            Math.random().toString(36).substring(10);
                    }
                    testBody.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
                    const syncDataMembersValidationPut: TestObject = await syncDataMembersValidation(testBody);
                    if (syncDataMembersValidationPut.TestResult == ('Pass' as TestResult)) {
                        return Promise.all[
                            (await expect(
                                syncPostGetValidation(
                                    syncDataMembersValidationPut.apiGetResponse,
                                    syncDataMembersValidationPut.testBody,
                                ),
                            )
                                .eventually.to.have.property('TestResult')
                                .that.contain('Pass' as TestResult),
                            expect(
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
            }

            if (isPutResync) {
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
            }

            if (isGetResync) {
                it('Resync Get Data Members Validation', async () => {
                    //Creating a sync that will be stuck
                    const testBody = {} as SyncBody;
                    Object.assign(testBody, _body);
                    testBody.LocalDataUpdates = {} as any;
                    Object.assign(testBody.LocalDataUpdates, _localData);
                    for (let index = 0; index < testBody['LocalDataUpdates' as any].jsonBody[2].Lines.length; index++) {
                        testBody['LocalDataUpdates' as any].jsonBody[2].Lines[index][3] =
                            Math.floor(Math.random() * 100000000000).toString() +
                            Math.random().toString(36).substring(10);
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
                        testBody['LocalDataUpdates' as any].jsonBody[2].Lines[index][3] =
                            Math.floor(Math.random() * 100000000000).toString() +
                            Math.random().toString(36).substring(10);
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

            if (isBigData) {
                describe('Big Data', () => {
                    it('500KB Sync (DI-17093)', async () => {
                        //Creating a 500KB sync for big data endpoint
                        const testBody = {} as SyncBody;
                        Object.assign(testBody, _body);
                        testBody.LocalDataUpdates = {} as any;
                        Object.assign(testBody.LocalDataUpdates, _localData);
                        testBody['LocalDataUpdates' as any].jsonBody[2].Lines.length = 100;
                        const syncDataArray = testBody['LocalDataUpdates' as any].jsonBody[2].Lines;
                        for (let index = 0; index < syncDataArray.length; index++) {
                            syncDataArray[index] = [];
                            syncDataArray[index][0] = _accountExternalIDStr;
                            syncDataArray[index][1] = _accountUUID;
                            syncDataArray[index][2] = Math.floor(Math.random() * 100);
                            syncDataArray[index][3] =
                                Math.floor(Math.random() * 100000000000).toString() +
                                Math.random().toString(36).substring(10);
                            syncDataArray[index][4] = _activityTypeIDStr;
                            syncDataArray[index][5] = _agentExternalID;
                            syncDataArray[index][6] = _catalogExternalID;
                            syncDataArray[index][7] =
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec sapien ipsum. Curabitur vel scelerisque tortor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse potenti. Aliquam lacus metus, pulvinar sit amet elit quis, dictum maximus leo. Suspendisse potenti. Pellentesque suscipit, ante non ullamcorper porta, mauris tortor bibendum orci, et tincidunt lacus risus semper urna. Cras quis neque ligula. Aenean id ex eu diam sodales placerat id nec metus. Sed at vulputate ipsum. Duis aliquam sapien ligula, ut gravida urna congue in. Suspendisse molestie nisl quis volutpat commodo. Vivamus laoreet viverra dui et consectetur. Aenean egestas maximus urna quis maximus. Nullam suscipit faucibus magna, in dignissim dui aliquam quis. Sed dapibus neque vitae ante dignissim, eget consectetur est viverra. Nunc massa justo, sagittis vitae tortor vitae, aliquet laoreet leo. Quisque volutpat mollis metus, ac sodales enim euismod et. Nunc leo justo, scelerisque sit amet pellentesque sed, congue ut libero. Mauris bibendum metus eros, cursus tristique metus tristique et. Donec ac vehicula massa. Aliquam pharetra sit amet nunc sed tincidunt. Mauris bibendum euismod augue vel rhoncus. Aenean egestas tellus leo, sed egestas odio vehicula a. Sed facilisis vulputate mi, a imperdiet ipsum sollicitudin sit amet. Phasellus gravida gravida orci non imperdiet. Vivamus quis libero nec lorem porttitor maximus. Duis placerat sagittis sem. Suspendisse ut faucibus justo. Pellentesque quis sapien elit. Donec dapibus sed nisi at euismod. Sed ac fringilla nisl. Duis nec purus dolor. Aenean vestibulum vehicula risus eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur porttitor non lorem sed placerat. Quisque sodales maximus lorem, nec porta nunc fermentum sit amet. Integer euismod sollicitudin euismod. Ut consequat nec ligula et dapibus. Quisque ipsum nulla, convallis id ultricies sed, pharetra quis risus. Praesent vel laoreet sem. In sagittis purus at justo blandit maximus. Integer vulputate blandit lectus nec auctor. Phasellus facilisis, libero quis malesuada egestas, lacus felis cursus ex, nec faucibus dolor mauris nec ipsum. In nibh purus, imperdiet a magna ut, gravida vulputate justo. Interdum et malesuada fames ac ante ipsum primis in faucibus. In eget leo eget lectus auctor tincidunt. Nullam quis vestibulum augue, id sodales est. Fusce faucibus risus velit, vestibulum tincidunt lectus hendrerit id. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In hac habitasse platea dictumst. Praesent elementum consectetur purus. Aliquam ut neque consectetur, gravida velit ac, venenatis nisl. Etiam iaculis ligula ipsum, eget placerat lacus vestibulum sed. Vestibulum non risus sollicitudin, elementum ante quis, convallis orci. Ut sed mattis magna, non tincidunt tortor. Ut pulvinar, neque id feugiat lacinia, est erat volutpat lacus, ut elementum diam sem at diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In auctor consectetur accumsan. Quisque aliquam euismod viverra. Pellentesque finibus non orci sollicitudin consectetur. Aenean nulla massa, bibendum sed lectus sit amet, iaculis sodales nibh. Nulla convallis mi ac magna rutrum, consectetur condimentum nibh rutrum. Integer rhoncus sed ligula ut pharetra. Maecenas tortor erat, interdum vitae interdum sit amet, malesuada vel nulla. Aliquam a ex euismod, malesuada sapien ac, suscipit neque. Curabitur eget lectus enim. Integer feugiat lorem orci, non ornare justo aliquet ut. Pellentesque dignissim, est eu hendrerit ultrices, ipsum justo semper mi, mattis suscipit ligula sapien id ex. Fusce vitae sem vehicula, finibus nulla ultricies, commodo nisi. Etiam finibus odio ut lacinia dictum. Aenean a magna sit amet massa feugiat laoreet hendrerit id nisl. Fusce eu diam at nunc maximus lobortis ut sit amet lacus. In pharetra nisi justo, sed porta tellus euismod in. Sed at tincidunt magna, ut volutpat justo. Aliquam mollis euismod velit, in sollicitudin libero ultricies at. Etiam quis erat id turpis interdum facilisis. Praesent sodales nisl id dolor porttitor malesuada. Integer vitae consequat magna. Nullam gravida ultricies arcu, sit amet volutpat diam efficitur ut. In tincidunt mattis metus a scelerisque. Donec sit amet urna vehicula dui aliquet cursus vitae eget diam. Maecenas ac faucibus mauris. Suspendisse lectus tortor, pretium nec est in, luctus accumsan erat. Duis suscipit leo elementum lacus sagittis, sit amet tempor nulla mollis. Quisque lectus lectus, laoreet et dapibus id, aliquam vel arcu. Morbi sapien libero, malesuada a sem quis, iaculis iaculis mauris. Proin diam elit, semper a libero vitae, pulvinar auctor dui. Morbi quis turpis a neque condimentum feugiat. Nulla euismod lacus sed nunc ullamcorper ultrices. Quisque facilisis ullamcorper metus. In posuere ac sapien a sagittis. Nullam quis pharetra turpis. Aliquam consequat lacus a augue gravida posuere. Quisque porta, orci ac malesuada congue, lectus ligula bibendum sem, vel condimentum erat velit sed urna. Vivamus elementum felis quis dui vestibulum, volutpat consectetur odio dictum. Praesent non mattis augue, vitae facilisis metus. Praesent varius risus eu gravida ultrices. Ut arcu tellus, gravida eu elit sed, congue scelerisque orci. Etiam at ipsum pharetra, cursus nulla at, congue urna. Phasellus id ultricies nisl. Nullam id mi sit amet magna euismod euismod at et turpis. Suspendisse congue dolor id massa lobortis condimentum sed eget magna. Sed a lectus sit amet magna dapibus fringilla. Cras lectus enim, facilisis ac blandit id, ullamcorper id ante. Donec sed leo et erat convallis dapibus ac id eros. Vestibulum non rutrum diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec vel faucibus mauris, a pulvinar sem. Donec vitae suscipit purus, porttitor consequat vel.';
                            syncDataArray[index][8] = `-${Math.floor(Math.random() * 1000100).toString()}`;
                            generalService.sleep(Math.floor(Math.random() * 10));
                        }
                        testBody['LocalDataUpdates' as any].jsonBody[2].Line = syncDataArray;

                        const syncDataMembersValidationPut: TestObject = await syncDataMembersValidation(testBody);

                        if (syncDataMembersValidationPut.TestResult == ('Pass' as TestResult)) {
                            return Promise.all[
                                (await expect(
                                    syncPostGetValidation(
                                        syncDataMembersValidationPut.apiGetResponse,
                                        syncDataMembersValidationPut.testBody,
                                    ),
                                )
                                    .eventually.to.have.property('TestResult')
                                    .that.contain('Pass' as TestResult),
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
                                .with.lengthOf(100);
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
                                .with.lengthOf(100);
                        });
                    }

                    it('Ten Puts With Added Lines', async () => {
                        console.log(tenPutDataResponsArr);
                        expect(tenPutDataResponsArr.join()).to.not.include('Missmatch');
                        console.log(tenPutsResponsArr);
                        expect(tenPutsResponsArr.join()).to.not.include('<');
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
                            .with.with.lengthOf(10);
                    });
                });
            }
            if (isCleanAfterTests) {
                describe('Exit Test', () => {
                    it('Test Clean Up', async () => {
                        return expect((await cleanUpTest()).TestResult).to.contain('Pass' as TestResult);
                    });
                });
            }
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
        const allActivitiesArr: GeneralActivity | Transaction = await service.papiClient.allActivities.find({
            where: "CreationDateTime>'2020-07-07Z'",
            page_size: -1,
            order_by: 'ModificationDateTime DESC',
        });

        for (let index = 0; index < allActivitiesArr.length; index++) {
            const activityToHide: GeneralActivity | Transaction = allActivitiesArr[index];
            if (
                (activityToHide.Remark.startsWith('Test ') && parseInt(activityToHide.Remark.split(' ')[1]) > 200) ||
                activityToHide.Remark.startsWith('Lorem ipsum dolor')
            ) {
                const transaction = {
                    InternalID: activityToHide.InternalID,
                    Hidden: true,
                };
                countHiddenTransactions++;
                try {
                    // if (index % 2 == 0) { //This can verify that DI-16911 is fixed, but its not yet developed by Maor Akav 17/09/2020
                    //         await service.papiClient.post('/transactions', transaction);
                    // } else {
                    await service.papiClient.transactions.delete(activityToHide.InternalID as any);
                    //}
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
                await waitForSyncStatus(tempPostOneHundredGetsPromiseArr[index].SyncJobUUID, 3.5 * 60000),
            );
        }
    }

    async function fail50Syncs() {
        const testBody = {} as SyncBody;
        Object.assign(testBody, _body);
        testBody.LastSyncDateTime = 62610367500000; //This Uses c# DateTime.Ticks
        testBody['LocalDataUpdates' as any] = 'this sync should fail';
        testBody.ClientDBUUID = 'OrenSyncTest-' + Math.floor(Math.random() * 1000000).toString();
        for (let index = 0; index < getsSize; index++) {
            //POST sync job
            tempPostOneHundredGetsPromiseArr.push(await service.post(testBody));
        }
        for (let index = 0; index < getsSize; index++) {
            oneHundredGetResponsArr.push(
                await waitForSyncStatus(tempPostOneHundredGetsPromiseArr[index].SyncJobUUID, 3.5 * 60000),
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
                await waitForSyncStatus(tempPostOneHundredPutssPromiseArr[index].SyncJobUUID, 3.5 * 60000),
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
                _accountUUID,
                Math.floor(Math.random() * 100),
                Math.floor(Math.random() * 1000000000000).toString() + Math.random().toString(36).substring(10),
                _localData.jsonBody[2].Lines[0][4],
                _agentExternalID,
                _catalogExternalID,
                `Test ${Math.floor(Math.random() * 1000000).toString()}`,
                `-${Math.floor(Math.random() * 1000100).toString()}`,
            ]);
            generalService.sleep(Math.floor(Math.random() * 10));
            //POST sync job
            tempPostTenPutssPromiseArr.push(await service.post(testBody));
        }

        for (let index = 0; index < tenPutsSize; index++) {
            //get the last data and put response
            if (index + 1 >= tenPutsSize) {
                //GET sync data
                let getSyncDataResponse;
                let putXmlResponse;

                let isSyncLocalDataUpdatesValid = false;
                if (testBody['LocalDataUpdates'] != null) {
                    getSyncDataResponse = await service.SyncData(tempPostTenPutssPromiseArr[index].SyncJobUUID);
                    if (getSyncDataResponse.LocalDataUpdates != null) {
                        isSyncLocalDataUpdatesValid =
                            JSON.stringify(getSyncDataResponse.LocalDataUpdates) ==
                            JSON.stringify(testBody.LocalDataUpdates);
                    } else {
                        //This should never happen
                        isSyncLocalDataUpdatesValid = false;
                    }
                }

                const loopsCounter = 0;
                let syncJobInfo;
                let syncJobInfoURL: string;
                do {
                    syncJobInfo = await service.jobInfo(tempPostTenPutssPromiseArr[index].SyncJobUUID);
                    syncJobInfoURL = syncJobInfo.SentData?.ResponseURL as any;
                    generalService.sleep(500);
                } while (syncJobInfoURL == null && loopsCounter < 30);

                let counter = 0;
                do {
                    generalService.sleep(500);
                    try {
                        putXmlResponse = await generalService.fetchStatus(syncJobInfoURL).then((res) => res.Body);
                    } catch (error) {
                        return {
                            TestResult: `Error in sync job info: ${JSON.stringify(syncJobInfo)}, Error: ${error}`,
                        } as TestObject;
                    }

                    console.log({ In_the_Puts_Xml: putXmlResponse });
                    counter++;
                } while (JSON.stringify(putXmlResponse).includes('Message>Access Denied') && counter < 30);

                if (JSON.stringify(putXmlResponse).includes('<Successful>true</Successful>')) {
                    const putXmlResponseArr = JSON.stringify(putXmlResponse).split('<PutObjectResult>');
                    if (
                        !putXmlResponseArr[putXmlResponseArr.length - 1].includes('Row inserted.') ||
                        !putXmlResponseArr[putXmlResponseArr.length - 1].includes('<Successful>true</Successful>')
                    ) {
                        tenPutsResponsArr.push(`Error in put: ${putXmlResponseArr[putXmlResponseArr.length - 1]}`);
                    }
                } else {
                    tenPutsResponsArr.push(`Error in put: ${putXmlResponse}`);
                }
                console.log({ In_the_Puts: getSyncDataResponse });

                if (!isSyncLocalDataUpdatesValid) {
                    for (let index = 0; index < tenPutResponsArr.length; index++) {
                        tenPutResponsArr[index] = tenPutResponsArr[index].Status;
                    }
                    tenPutDataResponsArr.push(
                        `Missmatch in the LocalDataUpdates, the get sync data response: ${JSON.stringify(
                            getSyncDataResponse.LocalDataUpdates,
                        )}, not match to the sent data: ${JSON.stringify(
                            testBody.LocalDataUpdates,
                        )}, the Sync UUID is: ${
                            tempPostTenPutssPromiseArr[index].SyncJobUUID
                        }, And the other ten put responses are: ${JSON.stringify(
                            tempPostTenPutssPromiseArr,
                        )}, With thess Sync Staus: ${JSON.stringify(tenPutResponsArr)}.`,
                    );
                }
            }
            tenPutResponsArr.push(await waitForSyncStatus(tempPostTenPutssPromiseArr[index].SyncJobUUID, 3.5 * 60000));
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

        //GET sync data
        let getSyncDataResponse;
        let putXmlResponse;

        let isSyncLocalDataUpdatesValid = true;
        if (testBody['LocalDataUpdates'] != null && !testBody['LocalDataUpdates'].toString().includes('Bug')) {
            getSyncDataResponse = await service.SyncData(syncPostApiResponse.SyncJobUUID);
            if (getSyncDataResponse.LocalDataUpdates != null) {
                isSyncLocalDataUpdatesValid =
                    JSON.stringify(getSyncDataResponse.LocalDataUpdates) == JSON.stringify(testBody.LocalDataUpdates);
            }

            const loopsCounter = 0;
            let syncJobInfo;
            let syncJobInfoURL: string;
            do {
                syncJobInfo = await service.jobInfo(syncPostApiResponse.SyncJobUUID);
                syncJobInfoURL = syncJobInfo.SentData?.ResponseURL as any;
                generalService.sleep(500);
            } while (syncJobInfoURL == null && loopsCounter < 30);

            let counter = 0;
            do {
                generalService.sleep(500);
                try {
                    putXmlResponse = await generalService.fetchStatus(syncJobInfoURL).then((res) => res.Body);
                } catch (error) {
                    return {
                        TestResult: `Error in sync job info: ${JSON.stringify(syncJobInfo)}, Error: ${error}`,
                    } as TestObject;
                }
                console.log({ In_the_Data_Members_Xml: putXmlResponse });
                counter++;
            } while (JSON.stringify(putXmlResponse).includes('Message>Access Denied') && counter < 30);
            if (JSON.stringify(putXmlResponse).includes('<Successful>true</Successful>')) {
                const putXmlResponseArr = JSON.stringify(putXmlResponse).split('<PutObjectResult>');
                for (let i = 1; i < putXmlResponseArr.length; i++) {
                    if (
                        !putXmlResponseArr[i].includes('Row inserted.') ||
                        !putXmlResponseArr[i].includes('<Successful>true</Successful>')
                    ) {
                        isSyncLocalDataUpdatesValid = false;
                        console.log({ Error_In_the_Data_Members: putXmlResponseArr[i] });
                    }
                }
                console.log({ In_the_Data_Members: getSyncDataResponse });
            } else {
                isSyncLocalDataUpdatesValid = false;
                console.log({ Error_In_the_Data_Members: putXmlResponse });
            }

            console.log({ In_the_Data_Members: getSyncDataResponse });
        }

        //GET sync jobinfo
        const apiGetResponse = await waitForSyncStatus(syncPostApiResponse.SyncJobUUID, 3.5 * 60000);
        if (
            apiGetResponse.Status == 'Done' &&
            apiGetResponse.ProgressPercentage == 100 &&
            isSyncLocalDataUpdatesValid
        ) {
            return {
                TestResult: 'Pass',
                apiGetResponse: apiGetResponse,
                testBody: testBody as any,
            } as TestObject;
        } else {
            if (isSyncLocalDataUpdatesValid) {
                return {
                    TestResult: `The Get Status is: ${apiGetResponse.Status} , and the Progress Percentage is: ${apiGetResponse.ProgressPercentage} after 210 sec The Sync UUID is: ${apiGetResponse.SyncUUID}. The DB-UUID is: ${apiGetResponse.ClientInfo.ClientDBUUID}.`,
                } as TestObject;
            } else {
                if (putXmlResponse == undefined) {
                    return {
                        TestResult: `Missmatch in the LocalDataUpdates, the get sync data response: ${JSON.stringify(
                            getSyncDataResponse.LocalDataUpdates,
                        )}, not match to the sent data: ${JSON.stringify(
                            testBody.LocalDataUpdates,
                        )}, the get stutus is: ${apiGetResponse.Status}, the Progress Percentage is: ${
                            apiGetResponse.ProgressPercentage
                        }, the Sync UUID is: ${apiGetResponse.SyncUUID}, the DB-UUID is: ${
                            apiGetResponse.ClientInfo.ClientDBUUID
                        }.`,
                    } as TestObject;
                }
                let parsedXmlResponse;
                try {
                    parsedXmlResponse = JSON.stringify(putXmlResponse);
                } catch (error) {
                    parsedXmlResponse = putXmlResponse;
                }
                return {
                    TestResult: `Error in the put: ${parsedXmlResponse}.`,
                } as TestObject;
            }
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
        const apiGetResponse = await waitForSyncStatus(syncPostApiResponse.SyncJobUUID, 1.5 * 60000);
        if (apiGetResponse.Status == 'SyncStart' && apiGetResponse.ProgressPercentage == 1) {
            return {
                TestResult: 'Pass',
                apiGetResponse: apiGetResponse,
                testBody: testBody as any,
            } as TestObject;
        } else {
            return {
                TestResult: `The Get Status is: ${apiGetResponse.Status}, and the Progress Percentage is: ${apiGetResponse.ProgressPercentage} after 90 sec The Sync UUID is: ${apiGetResponse.SyncUUID}. The DB-UUID is: ${apiGetResponse.ClientInfo.ClientDBUUID}.`,
            } as TestObject;
        }
    }
    //#endregion syncStuckValidation

    //#region wait for status
    async function waitForSyncStatus(uuid: string, maxTime: number) {
        const maxLoops = maxTime / apiCallsInterval;
        let counter = 0;
        let apiGetResponse;
        do {
            if (apiGetResponse != undefined) {
                generalService.sleep(apiCallsInterval);
            }
            counter++;
            apiGetResponse = await service.jobInfo(uuid);
        } while (
            (apiGetResponse.Status == ('SyncStart' as SyncStatus) || apiGetResponse.Status == ('New' as SyncStatus)) &&
            apiGetResponse.ModificationDateTime - apiGetResponse.CreationDateTime < maxTime &&
            new Date().getTime() - apiGetResponse.CreationDateTime < maxTime &&
            counter < maxLoops
        );
        return apiGetResponse;
    }
    //#endregion wait for status

    //#region orderCreationValidation
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
            let skipTransactionsSize = 1;
            //Make sure max of 10 transactions will be tests, or else it will take so much time
            if (testBody['LocalDataUpdates' as any].jsonBody[2].Lines.length > 10) {
                skipTransactionsSize = Math.floor(testBody['LocalDataUpdates' as any].jsonBody[2].Lines.length / 10);
            }
            // test that correct transactions created
            for (
                let j = 0;
                j < testBody['LocalDataUpdates' as any].jsonBody[2].Lines.length;
                j = j + skipTransactionsSize
            ) {
                const getTransactionsLines = await service.papiClient.allActivities.find({
                    where: `ExternalID='${testBody['LocalDataUpdates' as any].jsonBody[2].Lines[j][2]}'`,
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
    //#endregion orderCreationValidation

    //#region syncPostGetValidation
    async function syncPostGetValidation(apiGetResponse, testBody) {
        let errorMessage = '';
        let isFormattedDate = false;
        try {
            // test the date format of the jobInfo
            for (const prop in apiGetResponse) {
                try {
                    if (prop.includes('Formatted')) {
                        isFormattedDate = true;
                        if (
                            apiGetResponse[prop].substring(0, 18) !=
                            new Date(apiGetResponse[prop.substring(9)]).toISOString().substring(0, 18)
                        ) {
                            console.log(
                                `Is this: ${apiGetResponse[prop]}, represent this: ${new Date(
                                    apiGetResponse[prop.substring(9)],
                                ).toISOString()}`,
                            );
                            errorMessage += `Missmatch sent Property: ${
                                apiGetResponse[prop]
                            } Not represent the time of: ${apiGetResponse[prop.substring(9)]} | `;
                        }
                        if (apiGetResponse[prop].slice(-1) != 'Z') {
                            errorMessage += `Date Don't Contain "Z" That Indicate UTC DateTime Format: ${apiGetResponse[prop]} | `;
                        }
                    }
                } catch (error) {
                    console.log(`Error for: ${prop} | ${error}`);
                    errorMessage += `For Client Info Prop: ${prop} Error was thrown: ${error} | `;
                }
            }
            // test that the data we sent was the same data we got from the API
            for (const prop in apiGetResponse.ClientInfo) {
                try {
                    if (
                        prop != 'LocalDataUpdates' &&
                        !prop.includes('Formatted') &&
                        apiGetResponse.ClientInfo[prop] != testBody[prop].toString()
                    ) {
                        console.log(`Is this: ${apiGetResponse.ClientInfo[prop]}, equal to this: ${testBody[prop]}`);
                        errorMessage += `Missmatch sent Property: ${apiGetResponse.ClientInfo[prop]} Not identical to recived Property: ${testBody[prop]} | `;
                    } else if (prop.includes('Formatted')) {
                        isFormattedDate = true;
                        if (
                            apiGetResponse.ClientInfo[prop].substring(0, 18) !=
                            new Date(apiGetResponse.ClientInfo[prop.substring(9)]).toISOString().substring(0, 18)
                        ) {
                            console.log(
                                `Is this: ${apiGetResponse.ClientInfo[prop]}, represent this: ${new Date(
                                    apiGetResponse.ClientInfo[prop.substring(9)],
                                ).toISOString()}`,
                            );
                            errorMessage += `Missmatch sent Property: ${
                                apiGetResponse.ClientInfo[prop]
                            } Not represent the time of: ${apiGetResponse.ClientInfo[prop.substring(9)]} | `;
                        }
                        if (apiGetResponse.ClientInfo[prop].slice(-1) != 'Z') {
                            errorMessage += `Date Don't Contain "Z" That Indicate UTC DateTime Format: ${apiGetResponse.ClientInfo[prop]} | `;
                        }
                    }
                } catch (error) {
                    console.log(`Error for: ${prop} | ${error}`);
                    errorMessage += `For Client Info Prop: ${prop} Error was thrown: ${error} | `;
                }
            }
            if (!isFormattedDate) {
                errorMessage += `ClientInfo missing formatted dates: ${JSON.stringify(apiGetResponse.ClientInfo)} | `;
            }
            //test that the file was created in the server
            if (!(await checkFile(apiGetResponse.DataUpdates.URL))) {
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
    function checkFile(url) {
        return generalService
            .fetchStatus(url, {
                size: 10000, // maximum response body size in bytes, 10000 = 10KB
            })
            .then((res) => {
                if (res.Error.message.includes('over limit: 10000')) {
                    console.log(`File size was bigger then 10KB ${res}`);
                    return true;
                } else {
                    console.log(`File size was smaller then 10KB`);
                    return false;
                }
            });
        //return (encodeURI(fileContent).split(/%..|./).length - 1) / 1000 > 10;
    }
    //#endregion check file
}
