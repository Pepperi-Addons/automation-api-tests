import { Catalog, Subscription, Item } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions, ResourceTypes, FilterAttributes } from '../services/general.service';
import { NucleusFlagType, NucRecoveryService } from '../services/nuc-recovery.service';
import { ObjectsService } from '../services/objects.service';
import { ADALService } from '../services/adal.service';
import { PepperiNotificationServiceService } from '../services/pepperi-notification-service.service';

let isWACD = false;
let isSDK = false;

export async function NucRecoveryWACDTests(generalService: GeneralService, request, tester: TesterFunctions) {
    isWACD = true;
    await NucRecoveryTests(generalService, request, tester);
}

export async function NucRecoverySDKTests(generalService: GeneralService, request, tester: TesterFunctions) {
    isSDK = true;
    await NucRecoveryTests(generalService, request, tester);
}

export async function NucRecoveryTests(generalService: GeneralService, request, tester: TesterFunctions) {
    NucRecoveryService;
    const nucRecoveryService = new NucRecoveryService(generalService);
    const objectsService = new ObjectsService(generalService);
    const adalService = new ADALService(generalService.papiClient);
    const pepperiNotificationServiceService = new PepperiNotificationServiceService(generalService);

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const PepperiOwnerID = generalService.papiClient['options'].addonUUID;

    //#region Upgrade Pepperi Notification Service
    const testData = {
        'Pepperi Notification Service': ['00000000-0000-0000-0000-000000040fa9', ''],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.chnageVersion(request.body.varKey, testData, false);
    //#endregion Upgrade Pepperi Notification Service

    describe('Pepperi Notification Service Tests Suites', () => {
        const testID = Math.floor(Math.random() * 10000000);
        const schemaName = 'NUC Test';
        let atdArr;
        let catalogArr: Catalog[];
        let itemArr: Item[];
        let transactionAccount;
        let createdTransaction;
        let transactionExternalID;
        let createdTransactionLines;
        describe('Prerequisites Addon for PepperiNotificationService Tests', () => {
            //Test Data
            //Pepperi Notification Service
            it('Validate That All The Needed Addons Installed', async () => {
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

            it(`Subscribe To Insert Of NUC PNS And Validate Get With Where (DI-18054)`, async () => {
                const subscriptionBody: Subscription = {
                    AddonRelativeURL: '/logger/insert_pns',
                    Type: 'data',
                    AddonUUID: PepperiOwnerID,
                    FilterPolicy: {
                        Resource: ['transaction_lines' as ResourceTypes],
                        Action: ['insert'],
                        AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                    },
                    Name: 'Test_PNS_Insert_PNS',
                };
                const subscribeResponse = await pepperiNotificationServiceService.subscribe(subscriptionBody);
                expect(subscribeResponse).to.have.property('Name').a('string').that.is.equal(subscriptionBody.Name);

                const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                    'Test_PNS_Insert_PNS',
                );
                expect(getSubscribeResponse[0])
                    .to.have.property('Name')
                    .a('string')
                    .that.is.equal(subscriptionBody.Name);
            });

            it(`Subscribe To Update Of NUC PNS And Validate Get With Where (DI-18054)`, async () => {
                const subscriptionBody: Subscription = {
                    AddonRelativeURL: '/logger/update_pns',
                    Type: 'data',
                    AddonUUID: PepperiOwnerID,
                    FilterPolicy: {
                        Resource: ['transaction_lines' as ResourceTypes],
                        Action: ['update'],
                        ModifiedFields: [
                            'TSATestIndexString',
                            'TSATestIndexTime',
                            'TSATestIndexCalculated',
                            'TSATestIndexNumber',
                            'TSATestIndexDecimalNumber',
                            'LineNumber',
                            'DeliveryDate',
                            'TotalUnitsPriceAfterDiscount',
                            'TotalUnitsPriceBeforeDiscount',
                            'ItemInternalID',
                            'UnitDiscountPercentage',
                            'CreationDateTime',
                            'TransactionInternalID',
                            'InternalID',
                            'UUID',
                            'UnitsQuantity',
                        ],
                        AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                    },
                    Name: 'Test_PNS_Update_PNS',
                };
                const subscribeResponse = await pepperiNotificationServiceService.subscribe(subscriptionBody);
                expect(subscribeResponse).to.have.property('Name').a('string').that.is.equal(subscriptionBody.Name);

                const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                    'Test_PNS_Update_PNS',
                );
                expect(getSubscribeResponse[0])
                    .to.have.property('Name')
                    .a('string')
                    .that.is.equal(subscriptionBody.Name);
            });

            it(`Reset Schema`, async () => {
                const schemaNameArr = ['Index Logs', 'NUC Test'];
                let purgedSchema;
                for (let index = 0; index < schemaNameArr.length; index++) {
                    try {
                        purgedSchema = await adalService.deleteSchema(schemaNameArr[index]);
                    } catch (error) {
                        purgedSchema = await adalService.postSchema({ Name: schemaNameArr[index] });
                        expect(error)
                            .to.have.property('message')
                            .that.includes(
                                `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist`,
                            );
                    }
                    const newSchema = await adalService.postSchema({ Name: schemaNameArr[index] });
                    expect(purgedSchema).to.equal('');
                    expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaNameArr[index]);
                    expect(newSchema).to.have.property('Type').a('string').that.is.equal('meta_data');
                }
            });
        });

        describe('Endpoints', () => {
            describe('POST', () => {
                it('Create Transaction', async () => {
                    atdArr = await objectsService.getATD('transactions');
                    transactionAccount = await objectsService.getAccounts({ page_size: 1 }).then((res) => {
                        return res[0];
                    });
                    transactionExternalID =
                        'Automated API Transaction ' + Math.floor(Math.random() * 1000000).toString();
                    catalogArr = await generalService.getCatalogs();
                    createdTransaction = await objectsService.createTransaction({
                        ExternalID: transactionExternalID,
                        ActivityTypeID: atdArr[0].TypeID,
                        Status: 1,
                        Account: {
                            Data: {
                                InternalID: transactionAccount.InternalID,
                            },
                        },
                        Catalog: {
                            Data: {
                                ExternalID: catalogArr[0].ExternalID,
                            },
                        },
                    });
                    const getCreatedTransactionResponse = await objectsService.getTransaction({
                        where: `InternalID=${createdTransaction.InternalID}`,
                    });

                    return Promise.all([
                        expect(getCreatedTransactionResponse[0]).to.include({
                            ExternalID: transactionExternalID,
                            ActivityTypeID: atdArr[0].TypeID,
                            Status: 1,
                        }),
                        expect(JSON.stringify(getCreatedTransactionResponse[0].Account)).equals(
                            JSON.stringify({
                                Data: {
                                    InternalID: transactionAccount.InternalID,
                                    UUID: transactionAccount.UUID,
                                    ExternalID: transactionAccount.ExternalID,
                                },
                                URI: '/accounts/' + transactionAccount.InternalID,
                            }),
                        ),
                        expect(getCreatedTransactionResponse[0].InternalID).to.equal(createdTransaction.InternalID),
                        expect(getCreatedTransactionResponse[0].UUID).to.include(createdTransaction.UUID),
                        expect(getCreatedTransactionResponse[0].CreationDateTime).to.contain(
                            new Date().toISOString().split('T')[0],
                        ),
                        expect(getCreatedTransactionResponse[0].CreationDateTime).to.contain('Z'),
                        expect(getCreatedTransactionResponse[0].ModificationDateTime).to.contain(
                            new Date().toISOString().split('T')[0],
                        ),
                        expect(getCreatedTransactionResponse[0].ModificationDateTime).to.contain('Z'),
                        expect(getCreatedTransactionResponse[0].Archive).to.be.false,
                        expect(getCreatedTransactionResponse[0].Hidden).to.be.false,
                        expect(getCreatedTransactionResponse[0].StatusName).to.include('InCreation'),
                        expect(getCreatedTransactionResponse[0].Agent).to.be.null,
                        expect(getCreatedTransactionResponse[0].ContactPerson).to.be.null,
                        expect(getCreatedTransactionResponse[0].Creator).to.be.null,
                        expect(getCreatedTransactionResponse[0].OriginAccount).to.be.null,
                        expect(getCreatedTransactionResponse[0].TransactionLines).to.include({
                            URI: '/transaction_lines?where=TransactionInternalID=' + createdTransaction.InternalID,
                        }),
                    ]);
                });

                it('Create Transaction Line With SDK (TSA1 - UnitsQuantity = 25)', async () => {
                    itemArr = await objectsService.getItems({ page_size: 1 });
                    createdTransactionLines = await objectsService.createTransactionLine({
                        LineNumber: 0,
                        UnitsQuantity: 25,
                        UnitDiscountPercentage: 0,
                        Item: {
                            Data: {
                                ExternalID: itemArr[0].ExternalID,
                            },
                        },
                        Transaction: {
                            Data: {
                                InternalID: createdTransaction.InternalID,
                            },
                        },
                    });

                    //console.log({ createdTransactionLines: createdTransactionLines });
                    const getCreatedTransactionLineResponse = await objectsService.getTransactionLines({
                        where: `TransactionInternalID=${createdTransaction.InternalID}`,
                    });
                    //console.log({ getCreatedTransactionLineResponse: getCreatedTransactionLineResponse });

                    return Promise.all([
                        expect(getCreatedTransactionLineResponse[0]).to.include({
                            LineNumber: 0,
                            UnitsQuantity: 25,
                        }),
                        expect(JSON.stringify(getCreatedTransactionLineResponse[0].Item)).equals(
                            JSON.stringify({
                                Data: {
                                    InternalID: itemArr[0].InternalID,
                                    UUID: itemArr[0].UUID,
                                    ExternalID: itemArr[0].ExternalID,
                                },
                                URI: '/items/' + itemArr[0].InternalID,
                            }),
                        ),
                        expect(JSON.stringify(getCreatedTransactionLineResponse[0].Transaction)).equals(
                            JSON.stringify({
                                Data: {
                                    InternalID: createdTransaction.InternalID,
                                    UUID: createdTransaction.UUID,
                                    ExternalID: createdTransaction.ExternalID,
                                },
                                URI: '/transactions/' + createdTransaction.InternalID,
                            }),
                        ),
                        expect(getCreatedTransactionLineResponse[0].InternalID).to.equal(
                            createdTransactionLines.InternalID,
                        ),
                        expect(getCreatedTransactionLineResponse[0].UUID).to.include(createdTransactionLines.UUID),
                        expect(getCreatedTransactionLineResponse[0].CreationDateTime).to.contain(
                            new Date().toISOString().split('T')[0],
                        ),
                        expect(getCreatedTransactionLineResponse[0].CreationDateTime).to.contain('Z'),
                        expect(getCreatedTransactionLineResponse[0].ModificationDateTime).to.contain(
                            new Date().toISOString().split('T')[0],
                        ),
                        expect(getCreatedTransactionLineResponse[0].ModificationDateTime).to.contain('Z'),
                        expect(getCreatedTransactionLineResponse[0].Archive).to.be.false,
                        expect(getCreatedTransactionLineResponse[0].Hidden).to.be.false,
                        expect(getCreatedTransactionLineResponse[1]).to.be.undefined,
                        expect(
                            await objectsService.getTransactionLines({
                                where: `TransactionInternalID=${createdTransaction.InternalID}`,
                            }),
                        )
                            .to.be.an('array')
                            .with.lengthOf(1),
                    ]);
                });

                it('Validate PNS Triggered for Insert', async () => {
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                        Resource: ['transaction_lines'],
                        Action: ['insert'],
                        ModifiedFields: [],
                    };

                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Insert',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );

                    if (!Array.isArray(schema)) {
                        await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
                            Key: schema.Key,
                            IsTested: true,
                        });
                    }

                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.equal(createdTransactionLines.UUID);
                });

                it('Validate New Transaction Line Created (TSA1 - UnitsQuantity = 25)', async () => {
                    const createdObject = await objectsService.getTransactionByID(createdTransaction.InternalID);
                    expect(createdObject['TransactionLines' as any].Data[0].InternalID).to.equal(
                        createdTransactionLines.InternalID,
                    );
                    expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(25);
                    expect(createdObject['TransactionLines' as any].Data[0].UnitDiscountPercentage).to.equal(0);
                    expect(createdObject['TransactionLines' as any].Data[1]).to.be.undefined;
                });

                it('Update Transaction Line With SDK (TSA2 - UnitDiscountPercentage = 40)', async () => {
                    const updatedTransactionLine = await objectsService.createTransactionLine({
                        InternalID: createdTransactionLines.InternalID,
                        UUID: createdTransactionLines.UUID,
                        UnitDiscountPercentage: 40,
                    } as any);
                    expect(updatedTransactionLine.InternalID).to.equal(createdTransactionLines.InternalID);
                });

                it('Validate PNS Triggered for SDK Update (TSA2 - UnitDiscountPercentage = 40)', async () => {
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                        Resource: ['transaction_lines'],
                        Action: ['update'],
                        ModifiedFields: ['UnitDiscountPercentage'],
                    };
                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_Transaction_Line',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );

                    if (!Array.isArray(schema)) {
                        await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
                            Key: schema.Key,
                            IsTested: true,
                        });
                    }

                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                        createdTransactionLines.UUID,
                    );
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0]).to.deep.equal({
                        NewValue: 40,
                        OldValue: 0,
                        FieldID: 'UnitDiscountPercentage',
                    });
                });

                it('Validate Transaction Line Updated (TSA2 - UnitDiscountPercentage = 40)', async () => {
                    const updatedTransactionLine = await objectsService.getTransactionLinesByID(
                        createdTransactionLines.InternalID,
                    );
                    expect(updatedTransactionLine.InternalID).to.equal(createdTransactionLines.InternalID);
                    expect(updatedTransactionLine.UnitsQuantity).to.equal(25);
                    expect(updatedTransactionLine.UnitDiscountPercentage).to.equal(40);
                });

                it(`Update Transaction Line with WACD (ID: ${testID + 0}) (TSA1 - UnitsQuantity = 15)`, async () => {
                    const putSyncResponse = await nucRecoveryService.putSync(
                        {
                            putData: {
                                10: {
                                    SubType: '',
                                    Headers: [
                                        'UUID',
                                        'ItemWrntyID',
                                        'ItemExternalID',
                                        'LineNumber',
                                        'TransactionUUID',
                                        'UnitsQuantity',
                                        'WrntyID',
                                        'Hidden',
                                    ],
                                    Lines: [
                                        [
                                            createdTransactionLines.UUID,
                                            String(itemArr[0].InternalID),
                                            itemArr[0].ExternalID,
                                            '0',
                                            String(createdTransaction.UUID),
                                            '15',
                                            String(Math.floor(Math.random() * -1000000)),
                                            '0',
                                        ],
                                    ],
                                },
                            },
                        },
                        testID,
                    );

                    console.log({ putSyncResponse_create_from_wacd: putSyncResponse });
                    expect(putSyncResponse).to.be.true;

                    const getCreatedTransactionLineResponse = await objectsService.getTransactionLines({
                        where: `TransactionInternalID=${createdTransaction.InternalID}`,
                    });
                    //console.log({ getCreatedTransactionLineResponse: getCreatedTransactionLineResponse });

                    return Promise.all([
                        expect(getCreatedTransactionLineResponse[0]).to.include({
                            LineNumber: 0,
                            UnitsQuantity: 15,
                        }),
                        expect(JSON.stringify(getCreatedTransactionLineResponse[0].Item)).equals(
                            JSON.stringify({
                                Data: {
                                    InternalID: itemArr[0].InternalID,
                                    UUID: itemArr[0].UUID,
                                    ExternalID: itemArr[0].ExternalID,
                                },
                                URI: '/items/' + itemArr[0].InternalID,
                            }),
                        ),
                        expect(JSON.stringify(getCreatedTransactionLineResponse[0].Transaction)).equals(
                            JSON.stringify({
                                Data: {
                                    InternalID: createdTransaction.InternalID,
                                    UUID: createdTransaction.UUID,
                                    ExternalID: createdTransaction.ExternalID,
                                },
                                URI: '/transactions/' + createdTransaction.InternalID,
                            }),
                        ),
                        expect(getCreatedTransactionLineResponse[0].InternalID).to.equal(
                            createdTransactionLines.InternalID,
                        ),
                        expect(getCreatedTransactionLineResponse[0].UUID).to.include(createdTransactionLines.UUID),
                        expect(getCreatedTransactionLineResponse[0].CreationDateTime).to.contain(
                            new Date().toISOString().split('T')[0],
                        ),
                        expect(getCreatedTransactionLineResponse[0].CreationDateTime).to.contain('Z'),
                        expect(getCreatedTransactionLineResponse[0].ModificationDateTime).to.contain(
                            new Date().toISOString().split('T')[0],
                        ),
                        expect(getCreatedTransactionLineResponse[0].ModificationDateTime).to.contain('Z'),
                        expect(getCreatedTransactionLineResponse[0].Archive).to.be.false,
                        expect(getCreatedTransactionLineResponse[0].Hidden).to.be.false,
                        expect(getCreatedTransactionLineResponse[1]).to.be.undefined,
                        expect(
                            await objectsService.getTransactionLines({
                                where: `TransactionInternalID=${createdTransaction.InternalID}`,
                            }),
                        )
                            .to.be.an('array')
                            .with.lengthOf(1),
                    ]);
                });

                it('Validate PNS Triggered for WACD Update (TSA1 - UnitsQuantity = 15)', async () => {
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                        Resource: ['transaction_lines'],
                        Action: ['update'],
                        ModifiedFields: ['UnitsQuantity'],
                    };
                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_Transaction_Line',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );

                    if (!Array.isArray(schema)) {
                        await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
                            Key: schema.Key,
                            IsTested: true,
                        });
                    }

                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.equal(createdTransactionLines.UUID);
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0]).to.deep.equal({
                        NewValue: 15,
                        OldValue: 25,
                        FieldID: 'UnitsQuantity',
                    });
                });

                it('Validate New Transaction Line WACD Updated (TSA1 - UnitsQuantity = 15)', async () => {
                    const createdObject = await objectsService.getTransactionByID(createdTransaction.InternalID);
                    expect(createdObject['TransactionLines' as any].Data[0].InternalID).to.equal(
                        createdTransactionLines.InternalID,
                    );
                    expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(15);
                    expect(createdObject['TransactionLines' as any].Data[0].UnitDiscountPercentage).to.equal(40);
                    expect(createdObject['TransactionLines' as any].Data[1]).to.be.undefined;
                });

                it('Update Transaction Line With SDK (TSA2 - UnitDiscountPercentage = 60)', async () => {
                    const updatedTransactionLine = await objectsService.createTransactionLine({
                        InternalID: createdTransactionLines.InternalID,
                        UUID: createdTransactionLines.UUID,
                        UnitDiscountPercentage: 60,
                    } as any);
                    expect(updatedTransactionLine.InternalID).to.equal(createdTransactionLines.InternalID);
                });

                it('Validate PNS Triggered for SDK Update (TSA2 - UnitDiscountPercentage = 60)', async () => {
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                        Resource: ['transaction_lines'],
                        Action: ['update'],
                        ModifiedFields: ['UnitDiscountPercentage'],
                    };
                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_Transaction_Line',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );

                    if (!Array.isArray(schema)) {
                        await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
                            Key: schema.Key,
                            IsTested: true,
                        });
                    }

                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.equal(createdTransactionLines.UUID);
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0]).to.deep.equal({
                        NewValue: 60,
                        OldValue: 40,
                        FieldID: 'UnitDiscountPercentage',
                    });
                });

                it('Validate Transaction Line SDK Updated (TSA2 - UnitDiscountPercentage = 60)', async () => {
                    const updatedTransactionLine = await objectsService.getTransactionLinesByID(
                        createdTransactionLines.InternalID,
                    );
                    expect(updatedTransactionLine.InternalID).to.equal(createdTransactionLines.InternalID);
                    expect(updatedTransactionLine.UnitsQuantity).to.equal(15);
                    expect(updatedTransactionLine.UnitDiscountPercentage).to.equal(60);
                });
            });

            describe('WACD', () => {
                const pnsTestScenariosEndpointsArr = [
                    {
                        Type: 'SDK',
                        Name: 'PNS Tests Scenarios',
                    },
                    {
                        Type: 'WACD',
                        Name: 'PNS Tests Scenarios Without POST from SDK Endpoints',
                    },
                ];
                if (isWACD) {
                    delete pnsTestScenariosEndpointsArr[1];
                    pnsTestScenariosEndpointsArr.length = 1;
                } else if (isSDK) {
                    delete pnsTestScenariosEndpointsArr[2];
                    pnsTestScenariosEndpointsArr.length = 1;
                }
                for (let endpoint = 0; endpoint < pnsTestScenariosEndpointsArr.length; endpoint++) {
                    const testEndpointName = pnsTestScenariosEndpointsArr[endpoint].Name;
                    const testEndpointType = pnsTestScenariosEndpointsArr[endpoint].Type;
                    describe(testEndpointName, () => {
                        const pnsTestScenariosArr = [
                            {
                                Type: 'stop_after_db' as NucleusFlagType,
                                Name: 'Stop After DB',
                            },
                            {
                                Type: 'stop_after_nucleus' as NucleusFlagType,
                                Name: 'Stop After NUC',
                            },
                            {
                                Type: 'stop_after_redis' as NucleusFlagType,
                                Name: 'Stop After Redis',
                            },
                            {
                                Type: 'stop_after_pns' as NucleusFlagType,
                                Name: 'Stop After PNS',
                            },
                        ];
                        for (let scenario = 0; scenario < pnsTestScenariosArr.length; scenario++) {
                            const testName = pnsTestScenariosArr[scenario].Name;
                            const testType = pnsTestScenariosArr[scenario].Type;
                            describe(testName, () => {
                                it('Reset The Transaction With SDK (TSA2 - UnitDiscountPercentage = 0)', async () => {
                                    const updatedTransactionLine = await objectsService.createTransactionLine({
                                        InternalID: createdTransactionLines.InternalID,
                                        UUID: createdTransactionLines.UUID,
                                        UnitDiscountPercentage: 0,
                                    } as any);
                                    expect(updatedTransactionLine.InternalID).to.equal(
                                        createdTransactionLines.InternalID,
                                    );
                                    expect(updatedTransactionLine.UnitDiscountPercentage).to.equal(0);
                                });

                                it('Validate PNS Triggered for SDK Rest (TSA2 - UnitDiscountPercentage = 0)', async () => {
                                    const filter: FilterAttributes = {
                                        AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                                        Resource: ['transaction_lines'],
                                        Action: ['update'],
                                        ModifiedFields: ['UnitDiscountPercentage'],
                                    };
                                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                                        'Log_Update_Transaction_Line',
                                        PepperiOwnerID,
                                        schemaName,
                                        filter,
                                    );

                                    if (!Array.isArray(schema)) {
                                        await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
                                            Key: schema.Key,
                                            IsTested: true,
                                        });
                                    }

                                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.equal(
                                        createdTransactionLines.UUID,
                                    );
                                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0]).to.deep.equal({
                                        NewValue: 0,
                                        OldValue: 60,
                                        FieldID: 'UnitDiscountPercentage',
                                    });
                                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(1);
                                });

                                it(`Post PUT That ${testName} TestID ${
                                    testID + scenario + 1 + endpoint * pnsTestScenariosArr.length
                                } (TSA1 - UnitsQuantity = ${endpoint > 0 ? 44 : 11 * (1 + scenario)})`, async () => {
                                    const putSyncResponse = await nucRecoveryService.putSync(
                                        {
                                            putData: {
                                                10: {
                                                    SubType: '',
                                                    Headers: [
                                                        'UUID',
                                                        'ItemWrntyID',
                                                        'ItemExternalID',
                                                        'LineNumber',
                                                        'TransactionUUID',
                                                        'UnitsQuantity',
                                                        'WrntyID',
                                                        'Hidden',
                                                    ],
                                                    Lines: [
                                                        [
                                                            createdTransactionLines.UUID,
                                                            String(itemArr[0].InternalID),
                                                            itemArr[0].ExternalID,
                                                            '0',
                                                            String(createdTransaction.UUID),
                                                            `${11 * (1 + scenario)}`,
                                                            String(Math.floor(Math.random() * -1000000)),
                                                            '0',
                                                        ],
                                                    ],
                                                },
                                            },
                                            nucleus_crud_type: testType,
                                        },
                                        testID + scenario + 1 + endpoint * pnsTestScenariosArr.length,
                                    );

                                    console.log({ testType: putSyncResponse });
                                    expect(putSyncResponse).to.be.true;

                                    const getCreatedTransactionLineResponse = await objectsService.getTransactionLines({
                                        where: `TransactionInternalID=${createdTransaction.InternalID}`,
                                    });
                                    //console.log({ getCreatedTransactionLineResponse: getCreatedTransactionLineResponse });

                                    if (testName == 'Stop After DB') {
                                        if (endpoint > 0) {
                                            expect(getCreatedTransactionLineResponse[0].UnitsQuantity).to.equal(44);
                                        } else {
                                            expect(getCreatedTransactionLineResponse[0].UnitsQuantity).to.equal(15);
                                        }
                                    } else if (testName == 'Stop After Redis') {
                                        expect(getCreatedTransactionLineResponse[0].UnitsQuantity).to.equal(
                                            11 * (1 + scenario - 1),
                                        );
                                    } else {
                                        return Promise.all([
                                            expect(getCreatedTransactionLineResponse[0]).to.include({
                                                LineNumber: 0,
                                                UnitsQuantity: 11 * (1 + scenario),
                                            }),
                                            expect(JSON.stringify(getCreatedTransactionLineResponse[0].Item)).equals(
                                                JSON.stringify({
                                                    Data: {
                                                        InternalID: itemArr[0].InternalID,
                                                        UUID: itemArr[0].UUID,
                                                        ExternalID: itemArr[0].ExternalID,
                                                    },
                                                    URI: '/items/' + itemArr[0].InternalID,
                                                }),
                                            ),
                                            expect(
                                                JSON.stringify(getCreatedTransactionLineResponse[0].Transaction),
                                            ).equals(
                                                JSON.stringify({
                                                    Data: {
                                                        InternalID: createdTransaction.InternalID,
                                                        UUID: createdTransaction.UUID,
                                                        ExternalID: createdTransaction.ExternalID,
                                                    },
                                                    URI: '/transactions/' + createdTransaction.InternalID,
                                                }),
                                            ),
                                            expect(getCreatedTransactionLineResponse[0].InternalID).to.equal(
                                                createdTransactionLines.InternalID,
                                            ),
                                            expect(getCreatedTransactionLineResponse[0].UUID).to.include(
                                                createdTransactionLines.UUID,
                                            ),
                                            expect(getCreatedTransactionLineResponse[0].CreationDateTime).to.contain(
                                                new Date().toISOString().split('T')[0],
                                            ),
                                            expect(getCreatedTransactionLineResponse[0].CreationDateTime).to.contain(
                                                'Z',
                                            ),
                                            expect(
                                                getCreatedTransactionLineResponse[0].ModificationDateTime,
                                            ).to.contain(new Date().toISOString().split('T')[0]),
                                            expect(
                                                getCreatedTransactionLineResponse[0].ModificationDateTime,
                                            ).to.contain('Z'),
                                            expect(getCreatedTransactionLineResponse[0].Archive).to.be.false,
                                            expect(getCreatedTransactionLineResponse[0].Hidden).to.be.false,
                                            expect(getCreatedTransactionLineResponse[1]).to.be.undefined,
                                            expect(
                                                await objectsService.getTransactionLines({
                                                    where: `TransactionInternalID=${createdTransaction.InternalID}`,
                                                }),
                                            )
                                                .to.be.an('array')
                                                .with.lengthOf(1),
                                            expect(getCreatedTransactionLineResponse[1]).to.be.undefined,
                                        ]);
                                    }
                                });

                                if (testName == 'Stop After PNS') {
                                    it(`Validate PNS Triggered for WACD Update (TSA1 - UnitsQuantity = ${
                                        11 * (1 + scenario)
                                    } (Negative)`, async () => {
                                        const filter: FilterAttributes = {
                                            AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                                            Resource: ['transaction_lines'],
                                            Action: ['update'],
                                            ModifiedFields: ['UnitsQuantity'],
                                        };
                                        const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                                            'Log_Update_Transaction_Line',
                                            PepperiOwnerID,
                                            schemaName,
                                            filter,
                                        );

                                        if (!Array.isArray(schema)) {
                                            await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
                                                Key: schema.Key,
                                                IsTested: true,
                                            });
                                        }

                                        expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                                        expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.equal(
                                            createdTransactionLines.UUID,
                                        );
                                        expect(
                                            schema.Message.Message.ModifiedObjects[0].ModifiedFields[0],
                                        ).to.deep.equal({
                                            NewValue: 11 * (1 + scenario),
                                            OldValue: 11 * (1 + scenario - 2),
                                            FieldID: 'UnitsQuantity',
                                        });
                                        expect(
                                            schema.Message.Message.ModifiedObjects[0].ModifiedFields.length,
                                        ).to.equal(1);
                                    });
                                } else {
                                    it(`Validate PNS Not Triggered for WACD Update (TSA1 - UnitsQuantity = ${
                                        11 * (1 + scenario)
                                    } (Negative)`, async () => {
                                        const filter: FilterAttributes = {
                                            AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                                            Resource: ['transaction_lines'],
                                            Action: ['update'],
                                            ModifiedFields: ['UnitsQuantity'],
                                        };
                                        const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                                            'Log_Update_Transaction_Line',
                                            PepperiOwnerID,
                                            schemaName,
                                            filter,
                                        );
                                        if (!Array.isArray(schema)) {
                                            await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
                                                Key: schema.Key,
                                                IsTested: true,
                                            });
                                            expect(
                                                schema.Message.Message.ModifiedObjects[0].ModifiedFields[0],
                                            ).to.deep.equal({
                                                NewValue: scenario == 1 ? 11 : scenario == 0 ? 44 : 22,
                                                OldValue:
                                                    scenario == 1 ? (endpoint == 0 ? 15 : 44) : scenario == 0 ? 22 : 11,
                                                FieldID: 'UnitsQuantity',
                                            });
                                        } else {
                                            expect(schema, JSON.stringify(schema)).to.be.an('array');
                                        }
                                    });
                                }

                                it(`Validate New Transaction Line Updated (TSA1 - UnitsQuantity = ${
                                    scenario == 0
                                        ? endpoint > 0
                                            ? 44
                                            : 15
                                        : scenario == 2
                                        ? 11 * (1 + scenario - 1)
                                        : 11 * (1 + scenario)
                                })${scenario == 0 ? ' (Negative)' : scenario == 2 ? ' (Negative)' : ''}`, async () => {
                                    const createdObject = await objectsService.getTransactionByID(
                                        createdTransaction.InternalID,
                                    );
                                    expect(createdObject['TransactionLines' as any].Data[0].InternalID).to.equal(
                                        createdTransactionLines.InternalID,
                                    );
                                    if (scenario == 0) {
                                        if (endpoint > 0) {
                                            expect(
                                                createdObject['TransactionLines' as any].Data[0].UnitsQuantity,
                                            ).to.equal(44);
                                        } else {
                                            expect(
                                                createdObject['TransactionLines' as any].Data[0].UnitsQuantity,
                                            ).to.equal(15);
                                        }
                                    } else if (scenario == 2) {
                                        expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(
                                            11 * (1 + scenario - 1),
                                        );
                                    } else {
                                        expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(
                                            11 * (1 + scenario),
                                        );
                                    }
                                    expect(
                                        createdObject['TransactionLines' as any].Data[0].UnitDiscountPercentage,
                                    ).to.equal(0);
                                    expect(createdObject['TransactionLines' as any].Data[1]).to.be.undefined;
                                });

                                if (testEndpointType == 'WACD') {
                                    it(`Update Transaction Line With WACD TestID ${
                                        testID +
                                        scenario +
                                        1 +
                                        endpoint * pnsTestScenariosArr.length +
                                        pnsTestScenariosArr.length
                                    } (TSA2 - UnitDiscountPercentage = 60)`, async () => {
                                        const putSyncResponse = await nucRecoveryService.putSync(
                                            {
                                                putData: {
                                                    10: {
                                                        SubType: '',
                                                        Headers: [
                                                            'UUID',
                                                            'ItemWrntyID',
                                                            'ItemExternalID',
                                                            'LineNumber',
                                                            'TransactionUUID',
                                                            'UnitDiscountPercentage',
                                                            'WrntyID',
                                                            'Hidden',
                                                        ],
                                                        Lines: [
                                                            [
                                                                createdTransactionLines.UUID,
                                                                String(itemArr[0].InternalID),
                                                                itemArr[0].ExternalID,
                                                                '0',
                                                                String(createdTransaction.UUID),
                                                                `60`,
                                                                String(Math.floor(Math.random() * -1000000)),
                                                                '0',
                                                            ],
                                                        ],
                                                    },
                                                },
                                            },
                                            testID +
                                                scenario +
                                                1 +
                                                endpoint * pnsTestScenariosArr.length +
                                                pnsTestScenariosArr.length,
                                        );

                                        console.log({ testType: putSyncResponse });
                                        expect(putSyncResponse).to.be.true;

                                        const getCreatedTransactionLineResponse =
                                            await objectsService.getTransactionLines({
                                                where: `TransactionInternalID=${createdTransaction.InternalID}`,
                                            });
                                        //console.log({ getCreatedTransactionLineResponse: getCreatedTransactionLineResponse });

                                        if (testName == 'Stop After Redis') {
                                            expect(getCreatedTransactionLineResponse[0]).to.include({
                                                LineNumber: 0,
                                                UnitsQuantity: 11 * (1 + scenario - 1),
                                                UnitDiscountPercentage: 60,
                                            });
                                        } else {
                                            return Promise.all([
                                                expect(getCreatedTransactionLineResponse[0]).to.include({
                                                    LineNumber: 0,
                                                    UnitsQuantity: 11 * (1 + scenario),
                                                    UnitDiscountPercentage: 60,
                                                }),
                                                expect(
                                                    JSON.stringify(getCreatedTransactionLineResponse[0].Item),
                                                ).equals(
                                                    JSON.stringify({
                                                        Data: {
                                                            InternalID: itemArr[0].InternalID,
                                                            UUID: itemArr[0].UUID,
                                                            ExternalID: itemArr[0].ExternalID,
                                                        },
                                                        URI: '/items/' + itemArr[0].InternalID,
                                                    }),
                                                ),
                                                expect(
                                                    JSON.stringify(getCreatedTransactionLineResponse[0].Transaction),
                                                ).equals(
                                                    JSON.stringify({
                                                        Data: {
                                                            InternalID: createdTransaction.InternalID,
                                                            UUID: createdTransaction.UUID,
                                                            ExternalID: createdTransaction.ExternalID,
                                                        },
                                                        URI: '/transactions/' + createdTransaction.InternalID,
                                                    }),
                                                ),
                                                expect(getCreatedTransactionLineResponse[0].InternalID).to.equal(
                                                    createdTransactionLines.InternalID,
                                                ),
                                                expect(getCreatedTransactionLineResponse[0].UUID).to.include(
                                                    createdTransactionLines.UUID,
                                                ),
                                                expect(
                                                    getCreatedTransactionLineResponse[0].CreationDateTime,
                                                ).to.contain(new Date().toISOString().split('T')[0]),
                                                expect(
                                                    getCreatedTransactionLineResponse[0].CreationDateTime,
                                                ).to.contain('Z'),
                                                expect(
                                                    getCreatedTransactionLineResponse[0].ModificationDateTime,
                                                ).to.contain(new Date().toISOString().split('T')[0]),
                                                expect(
                                                    getCreatedTransactionLineResponse[0].ModificationDateTime,
                                                ).to.contain('Z'),
                                                expect(getCreatedTransactionLineResponse[0].Archive).to.be.false,
                                                expect(getCreatedTransactionLineResponse[0].Hidden).to.be.false,
                                                expect(getCreatedTransactionLineResponse[1]).to.be.undefined,
                                                expect(
                                                    await objectsService.getTransactionLines({
                                                        where: `TransactionInternalID=${createdTransaction.InternalID}`,
                                                    }),
                                                )
                                                    .to.be.an('array')
                                                    .with.lengthOf(1),
                                                expect(getCreatedTransactionLineResponse[1]).to.be.undefined,
                                            ]);
                                        }
                                    });
                                } else {
                                    it('Update Transaction Line With SDK (TSA2 - UnitDiscountPercentage = 60)', async () => {
                                        const updatedTransactionLine = await objectsService.createTransactionLine({
                                            InternalID: createdTransactionLines.InternalID,
                                            UUID: createdTransactionLines.UUID,
                                            UnitDiscountPercentage: 60,
                                        } as any);
                                        expect(updatedTransactionLine.InternalID).to.equal(
                                            createdTransactionLines.InternalID,
                                        );
                                    });
                                }

                                it('Validate PNS Triggered for SDK Update (TSA2 - UnitDiscountPercentage = 60)', async () => {
                                    const filter: FilterAttributes = {
                                        AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                                        Resource: ['transaction_lines'],
                                        Action: ['update'],
                                        ModifiedFields: ['UnitDiscountPercentage'],
                                    };
                                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                                        'Log_Update_Transaction_Line',
                                        PepperiOwnerID,
                                        schemaName,
                                        filter,
                                    );

                                    if (!Array.isArray(schema)) {
                                        await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
                                            Key: schema.Key,
                                            IsTested: true,
                                        });
                                    }

                                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                                        createdTransactionLines.UUID,
                                    );
                                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0]).to.deep.equal({
                                        NewValue: 60,
                                        OldValue: 0,
                                        FieldID: 'UnitDiscountPercentage',
                                    });
                                });

                                it(`Validate Transaction Line Updated (TSA2 - UnitDiscountPercentage = 60)${
                                    scenario == 2
                                        ? ` (TSA1 - UnitsQuantity = ${11 * (1 + scenario - 1)}) (Negative)`
                                        : ` (TSA1 - UnitsQuantity = ${11 * (1 + scenario)})`
                                }`, async () => {
                                    const updatedTransactionLine = await objectsService.getTransactionLinesByID(
                                        createdTransactionLines.InternalID,
                                    );
                                    expect(updatedTransactionLine.InternalID).to.equal(
                                        createdTransactionLines.InternalID,
                                    );
                                    if (scenario == 2) {
                                        expect(updatedTransactionLine.UnitsQuantity).to.equal(11 * (1 + scenario - 1));
                                    } else {
                                        expect(updatedTransactionLine.UnitsQuantity).to.equal(11 * (1 + scenario));
                                    }
                                    expect(updatedTransactionLine.UnitDiscountPercentage).to.equal(60);
                                });

                                it(`Validate Transaction Updated (TSA2 - UnitDiscountPercentage = 60)${
                                    scenario == 2
                                        ? ` (TSA1 - UnitsQuantity = ${11 * (1 + scenario - 1)}) (Negative)`
                                        : ` (TSA1 - UnitsQuantity = ${11 * (1 + scenario)})`
                                }`, async () => {
                                    const createdObject = await objectsService.getTransactionByID(
                                        createdTransaction.InternalID,
                                    );
                                    expect(createdObject['TransactionLines' as any].Data[0].InternalID).to.equal(
                                        createdTransactionLines.InternalID,
                                    );
                                    if (scenario == 2) {
                                        expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(
                                            11 * (1 + scenario - 1),
                                        );
                                    } else {
                                        expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(
                                            11 * (1 + scenario),
                                        );
                                    }
                                    expect(
                                        createdObject['TransactionLines' as any].Data[0].UnitDiscountPercentage,
                                    ).to.equal(60);
                                    expect(createdObject['TransactionLines' as any].Data[1]).to.be.undefined;
                                });
                            });
                        }
                    });
                }
            });

            describe('Delete', () => {
                it('Delete transaction', async () => {
                    expect(await objectsService.deleteTransaction(createdTransaction.InternalID)).to.be.true,
                        expect(await objectsService.deleteTransaction(createdTransaction.InternalID)).to.be.false,
                        expect(
                            await objectsService.getTransaction({
                                where: `InternalID=${createdTransaction.InternalID}`,
                            }),
                        )
                            .to.be.an('array')
                            .with.lengthOf(0);
                });

                it('Delete transaction lines', async () => {
                    expect(await objectsService.deleteTransactionLine(createdTransactionLines.InternalID)).to.be.true;
                    expect(await objectsService.deleteTransactionLine(createdTransactionLines.InternalID)).to.be.false;
                    expect(await objectsService.getTransactionByID(createdTransaction.InternalID))
                        .to.have.property('TransactionLines')
                        .to.deep.equal({
                            Data: [],
                            URI: `/transaction_lines?where=TransactionInternalID=${createdTransaction.InternalID}`,
                        });
                });
            });
        });
    });
}
