import { Catalog, Item } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../services/general.service';
import { NucleusFlagType, PepperiNotificationServiceService } from '../services/pepperi-notification-service.service';
import { ObjectsService } from '../services/objects.service';
//import { ADALService } from '../services/adal.service';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

export async function PepperiNotificationServiceTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    const pepperiNotificationServiceService = new PepperiNotificationServiceService(generalService);
    const objectsService = new ObjectsService(generalService);
    //const adalService = new ADALService(generalService.papiClient);

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //const PepperiOwnerID = generalService.papiClient['options'].addonUUID;

    //#region Upgrade Pepperi Notification Service
    const testData = {
        'Pepperi Notification Service': ['00000000-0000-0000-0000-000000040fa9', '1.'],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.chnageVersion(request.body.varKey, testData, false);
    //#endregion Upgrade Pepperi Notification Service

    describe('Pepperi Notification Service Tests Suites', () => {
        const testID = Math.floor(Math.random() * 10000000);
        //const schemaName = 'PNS Test';
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
                        expect(
                            await objectsService.getTransactionLines({
                                where: `TransactionInternalID=${createdTransaction.InternalID}`,
                            }),
                        )
                            .to.be.an('array')
                            .with.lengthOf(1),
                    ]);
                });

                // it('Validate PNS Triggered for Insert', async () => {
                //     let schema;
                //     let maxLoopsCounter = 30;
                //     do {
                //         generalService.sleep(1500);
                //         schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                //             order_by: 'ModificationDateTime DESC',
                //         });
                //         maxLoopsCounter--;
                //     } while (
                //         (!schema[0].Key.startsWith('Insert') ||
                //             schema[0].TransactioInfo.UnitsQuantity != 25 ||
                //             schema[0].TransactioInfo.ItemData.ExternalID != itemArr[0].ExternalID) &&
                //         maxLoopsCounter > 0
                //     );

                //     expect(schema[0].Key).to.be.a('String').and.contain('Insert');
                //     expect(schema[0].TransactioInfo.UnitsQuantity).to.equal(25);
                //     expect(schema[0].TransactioInfo.ItemData.ExternalID).to.equal(itemArr[0].ExternalID);
                // });

                it('Validate New Transaction Line Created (TSA1 - UnitsQuantity = 25)', async () => {
                    const createdObject = await objectsService.getTransactionByID(createdTransaction.InternalID);
                    expect(createdObject['TransactionLines' as any].Data[0].InternalID).to.equal(
                        createdTransactionLines.InternalID,
                    );
                    expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(25);
                    expect(createdObject['TransactionLines' as any].Data[0].UnitDiscountPercentage).to.equal(0);
                });

                it('Update Transaction Line With SDK (TSA2 - UnitDiscountPercentage = 40)', async () => {
                    const updatedTransactionLine = await objectsService.createTransactionLine({
                        InternalID: createdTransactionLines.InternalID,
                        UUID: createdTransactionLines.UUID,
                        UnitDiscountPercentage: 40,
                    } as any);
                    expect(updatedTransactionLine.InternalID).to.equal(createdTransactionLines.InternalID);
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
                    const putSyncResponse = await pepperiNotificationServiceService.putSync(
                        {
                            putData: {
                                10: {
                                    SubType: '',
                                    Headers: [
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
                        expect(
                            await objectsService.getTransactionLines({
                                where: `TransactionInternalID=${createdTransaction.InternalID}`,
                            }),
                        )
                            .to.be.an('array')
                            .with.lengthOf(1),
                    ]);
                });

                // it('Validate PNS Triggered for Update', async () => {
                //     let schema;
                //     let maxLoopsCounter = 30;
                //     do {
                //         generalService.sleep(1500);
                //         schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                //             order_by: 'ModificationDateTime DESC',
                //         });
                //         maxLoopsCounter--;
                //     } while (
                //         (!schema[0].Key.startsWith('Update') ||
                //             schema[0].TransactioInfo.UnitsQuantity != 77 ||
                //             schema[0].TransactioInfo.ItemData.ExternalID != itemArr[0].ExternalID) &&
                //         maxLoopsCounter > 0
                //     );

                //     expect(schema[0].Key).to.be.a('String').and.contain('Update');
                //     expect(schema[0].TransactioInfo.UnitsQuantity).to.equal(77);
                //     expect(schema[0].TransactioInfo.ItemData.ExternalID).to.equal(itemArr[0].ExternalID);
                // });

                it('Validate New Transaction Line Updated (TSA1 - UnitsQuantity = 15)', async () => {
                    const createdObject = await objectsService.getTransactionByID(createdTransaction.InternalID);
                    expect(createdObject['TransactionLines' as any].Data[0].InternalID).to.equal(
                        createdTransactionLines.InternalID,
                    );
                    expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(15);
                    expect(createdObject['TransactionLines' as any].Data[0].UnitDiscountPercentage).to.equal(40);
                });

                it('Update Transaction Line With SDK (TSA2 - UnitDiscountPercentage = 60)', async () => {
                    const updatedTransactionLine = await objectsService.createTransactionLine({
                        InternalID: createdTransactionLines.InternalID,
                        UUID: createdTransactionLines.UUID,
                        UnitDiscountPercentage: 60,
                    } as any);
                    expect(updatedTransactionLine.InternalID).to.equal(createdTransactionLines.InternalID);
                });

                it('Validate Transaction Line Updated (TSA2 - UnitDiscountPercentage = 60)', async () => {
                    const updatedTransactionLine = await objectsService.getTransactionLinesByID(
                        createdTransactionLines.InternalID,
                    );
                    expect(updatedTransactionLine.InternalID).to.equal(createdTransactionLines.InternalID);
                    expect(updatedTransactionLine.UnitsQuantity).to.equal(15);
                    expect(updatedTransactionLine.UnitDiscountPercentage).to.equal(60);
                });
            });

            describe('WACD', () => {
                describe('PNS Tests Scenarios', () => {
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
                    ];
                    for (let index = 0; index < pnsTestScenariosArr.length; index++) {
                        const testName = pnsTestScenariosArr[index].Name;
                        const testType = pnsTestScenariosArr[index].Type;
                        describe(testName, () => {
                            it('Reset The Transaction With SDK (TSA2 - UnitDiscountPercentage = 0)', async () => {
                                const updatedTransactionLine = await objectsService.createTransactionLine({
                                    InternalID: createdTransactionLines.InternalID,
                                    UUID: createdTransactionLines.UUID,
                                    UnitDiscountPercentage: 0,
                                } as any);
                                expect(updatedTransactionLine.InternalID).to.equal(createdTransactionLines.InternalID);
                                expect(updatedTransactionLine.UnitDiscountPercentage).to.equal(0);
                            });

                            it(`Post PUT That ${testName} TestID ${testID + index + 1} (TSA1 - UnitsQuantity = ${
                                11 * (1 + index)
                            })`, async () => {
                                const putSyncResponse = await pepperiNotificationServiceService.putSync(
                                    {
                                        putData: {
                                            10: {
                                                SubType: '',
                                                Headers: [
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
                                                        String(itemArr[0].InternalID),
                                                        itemArr[0].ExternalID,
                                                        '0',
                                                        String(createdTransaction.UUID),
                                                        `${11 * (1 + index)}`,
                                                        String(Math.floor(Math.random() * -1000000)),
                                                        '0',
                                                    ],
                                                ],
                                            },
                                        },
                                        nucleus_crud_type: testType,
                                    },
                                    testID + index + 1,
                                );

                                console.log({ testType: putSyncResponse });
                                expect(putSyncResponse).to.be.true;

                                const getCreatedTransactionLineResponse = await objectsService.getTransactionLines({
                                    where: `TransactionInternalID=${createdTransaction.InternalID}`,
                                });
                                //console.log({ getCreatedTransactionLineResponse: getCreatedTransactionLineResponse });

                                if (testName == 'Stop After DB') {
                                    expect(getCreatedTransactionLineResponse[0].UnitsQuantity).to.equal(15);
                                } else if (testName == 'Stop After Redis') {
                                    expect(getCreatedTransactionLineResponse[0].UnitsQuantity).to.equal(
                                        11 * (1 + index - 1),
                                    );
                                } else {
                                    return Promise.all([
                                        expect(getCreatedTransactionLineResponse[0]).to.include({
                                            LineNumber: 0,
                                            UnitsQuantity: 11 * (1 + index),
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
                                        expect(getCreatedTransactionLineResponse[0].UUID).to.include(
                                            createdTransactionLines.UUID,
                                        ),
                                        expect(getCreatedTransactionLineResponse[0].CreationDateTime).to.contain(
                                            new Date().toISOString().split('T')[0],
                                        ),
                                        expect(getCreatedTransactionLineResponse[0].CreationDateTime).to.contain('Z'),
                                        expect(getCreatedTransactionLineResponse[0].ModificationDateTime).to.contain(
                                            new Date().toISOString().split('T')[0],
                                        ),
                                        expect(getCreatedTransactionLineResponse[0].ModificationDateTime).to.contain(
                                            'Z',
                                        ),
                                        expect(getCreatedTransactionLineResponse[0].Archive).to.be.false,
                                        expect(getCreatedTransactionLineResponse[0].Hidden).to.be.false,
                                        expect(
                                            await objectsService.getTransactionLines({
                                                where: `TransactionInternalID=${createdTransaction.InternalID}`,
                                            }),
                                        )
                                            .to.be.an('array')
                                            .with.lengthOf(1),
                                    ]);
                                }
                            });

                            // it(`Validate ${
                            //     testName == 'Stop After DB' ? 'No New' : ''
                            // } PNS Triggered for Update When ${testName}`, async () => {
                            //     let schema;
                            //     let maxLoopsCounter = 15;
                            //     do {
                            //         generalService.sleep(1500);
                            //         schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                            //             order_by: 'ModificationDateTime DESC',
                            //         });
                            //         maxLoopsCounter--;
                            //     } while (
                            //         (!schema[0].Key.startsWith('Update') ||
                            //             schema[0].TransactioInfo.UnitsQuantity != 11 * (1 + index) ||
                            //             schema[0].TransactioInfo.ItemData.ExternalID != itemArr[0].ExternalID) &&
                            //         maxLoopsCounter > 0
                            //     );
                            //     if (testName == 'Stop After DB') {
                            //         expect(schema[0].TransactioInfo.UnitsQuantity).to.not.equal(11 * (1 + index));
                            //     } else {
                            //         expect(schema[0].Key).to.be.a('String').and.contain('Update');
                            //         expect(schema[0].TransactioInfo.UnitsQuantity).to.equal(11 * (1 + index));
                            //         expect(schema[0].TransactioInfo.ItemData.ExternalID).to.equal(itemArr[0].ExternalID);
                            //     }
                            // });

                            it(`Validate New Transaction Line Updated (TSA1 - UnitsQuantity = ${
                                index == 0 ? 15 : index == 2 ? 11 * (1 + index - 1) : 11 * (1 + index)
                            })${index == 0 ? ' (Negative)' : index == 2 ? ' (Negative)' : ''}`, async () => {
                                const createdObject = await objectsService.getTransactionByID(
                                    createdTransaction.InternalID,
                                );
                                expect(createdObject['TransactionLines' as any].Data[0].InternalID).to.equal(
                                    createdTransactionLines.InternalID,
                                );
                                if (index == 0) {
                                    expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(15);
                                } else if (index == 2) {
                                    expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(
                                        11 * (1 + index - 1),
                                    );
                                } else {
                                    expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(
                                        11 * (1 + index),
                                    );
                                }
                                expect(
                                    createdObject['TransactionLines' as any].Data[0].UnitDiscountPercentage,
                                ).to.equal(0);
                            });

                            it('Update Transaction Line With SDK (TSA2 - UnitDiscountPercentage)', async () => {
                                let updatedTransactionLine;
                                try {
                                    updatedTransactionLine = await objectsService.createTransactionLine({
                                        InternalID: createdTransactionLines.InternalID,
                                        UUID: createdTransactionLines.UUID,
                                        UnitDiscountPercentage: 60,
                                    } as any);
                                } catch (error) {
                                    console.dir(error);
                                    updatedTransactionLine = await objectsService.createTransactionLine({
                                        InternalID: createdTransactionLines.InternalID,
                                        UUID: createdTransactionLines.UUID,
                                        UnitDiscountPercentage: 60,
                                    } as any);
                                }
                                expect(updatedTransactionLine.InternalID).to.equal(createdTransactionLines.InternalID);
                            });

                            it(`Validate Transaction Line Updated (TSA2 - UnitDiscountPercentage = 60)${
                                index == 2
                                    ? ` (TSA1 - UnitsQuantity = ${11 * (1 + index - 1)}) (Negative)`
                                    : ` (TSA1 - UnitsQuantity = ${11 * (1 + index)})`
                            }`, async () => {
                                const updatedTransactionLine = await objectsService.getTransactionLinesByID(
                                    createdTransactionLines.InternalID,
                                );
                                expect(updatedTransactionLine.InternalID).to.equal(createdTransactionLines.InternalID);
                                if (index == 2) {
                                    expect(updatedTransactionLine.UnitsQuantity).to.equal(11 * (1 + index - 1));
                                } else {
                                    expect(updatedTransactionLine.UnitsQuantity).to.equal(11 * (1 + index));
                                }
                                expect(updatedTransactionLine.UnitDiscountPercentage).to.equal(60);
                            });

                            it(`Validate Transaction Updated (TSA2 - UnitDiscountPercentage = 60)${
                                index == 2
                                    ? ` (TSA1 - UnitsQuantity = ${11 * (1 + index - 1)}) (Negative)`
                                    : ` (TSA1 - UnitsQuantity = ${11 * (1 + index)})`
                            }`, async () => {
                                const createdObject = await objectsService.getTransactionByID(
                                    createdTransaction.InternalID,
                                );
                                expect(createdObject['TransactionLines' as any].Data[0].InternalID).to.equal(
                                    createdTransactionLines.InternalID,
                                );
                                if (index == 2) {
                                    expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(
                                        11 * (1 + index - 1),
                                    );
                                } else {
                                    expect(createdObject['TransactionLines' as any].Data[0].UnitsQuantity).to.equal(
                                        11 * (1 + index),
                                    );
                                }
                                expect(
                                    createdObject['TransactionLines' as any].Data[0].UnitDiscountPercentage,
                                ).to.equal(60);
                            });
                        });
                    }
                });
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
