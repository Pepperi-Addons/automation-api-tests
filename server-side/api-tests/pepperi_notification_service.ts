import { Catalog, Item } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../services/general.service';
import { PepperiNotificationServiceService } from '../services/pepperi-notification-service.service';
import { ObjectsService } from '../services/objects.service';
import { ADALService } from '../services/adal.service';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

export async function PepperiNotificationServiceTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    const pepperiNotificationServiceService = new PepperiNotificationServiceService(generalService);
    const objectsService = new ObjectsService(generalService);
    const adalService = new ADALService(generalService.papiClient);

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const PepperiOwnerID = generalService.papiClient['options'].addonUUID;


        const oren = await pepperiNotificationServiceService.subscribe({
            AddonRelativeURL: '/logger/insert_pns',
            Type: 'data',
            AddonUUID: PepperiOwnerID,
            FilterPolicy: {
                Resource: ['transaction_lines'],
                Action: ['update'],
                ModifiedFields: [
                    'UnitsQuantity',
                    'TSAPrecioPorBotella',
                    'ModificationDateTime',
                    'TSATestIndexString'
                ],
                AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
            },
            Name: 'Test_Objects_PNS_Update_PNS',
        });
        
        const oren1 = await pepperiNotificationServiceService.getSubscriptionsbyKey('10979a11-d7f4-41df-8993-f06bfd778304_all_activities_pns_accounts_update');
        const oren2 = await pepperiNotificationServiceService.findSubscriptions();

        debugger;


    debugger;
    //#region Upgrade Pepperi Notification Service
    const testData = {
        'Pepperi Notification Service': ['00000000-0000-0000-0000-000000040fa9', '1.'],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.chnageVersion(request.body.varKey, testData, false);
    //#endregion Upgrade Pepperi Notification Service

    describe('Pepperi Notification Service Tests Suites', () => {
        const testID = Math.floor(Math.random() * 10000000);
        const schemaName = 'PNS Test';
        const _MAX_LOOPS = 12;
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

            it(`Reset Schema`, async () => {
                const schemaNameArr = ['Index Logs', 'PNS Test'];
                let purgedSchema;
                for (let index = 0; index < schemaNameArr.length; index++) {
                    try {
                        purgedSchema = await adalService.deleteSchema(schemaNameArr[index]);
                    } catch (error) {
                        expect(error.message).to.includes(
                            `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must be exist`,
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
                    let schema;
                    let maxLoopsCounter = _MAX_LOOPS;
                    do {
                        generalService.sleep(1500);
                        schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                            order_by: 'CreationDateTime DESC',
                        });
                        maxLoopsCounter--;
                    } while ((schema.length <= 0 || !schema[0].Key.startsWith('Log_Insert')) && maxLoopsCounter > 0);
                    expect(schema[0].Key).to.be.a('String').and.contain('Insert');
                    expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.equal(
                        createdTransactionLines.UUID,
                    );
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
                    let schema;
                    let maxLoopsCounter = _MAX_LOOPS;
                    do {
                        generalService.sleep(1500);
                        schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                            order_by: 'CreationDateTime DESC',
                        });
                        maxLoopsCounter--;
                    } while (
                        (!schema[0].Key.startsWith('Log_Update') ||
                            schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].FieldID !=
                                'UnitDiscountPercentage') &&
                        maxLoopsCounter > 0
                    );
                    expect(schema[0].Key).to.be.a('String').and.contain('Log_Update');
                    expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                        createdTransactionLines.UUID,
                    );
                    expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0]).to.deep.equal({
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

                it('Validate PNS Triggered for WACD Update (TSA1 - UnitsQuantity = 15)', async () => {
                    let schema;
                    let maxLoopsCounter = _MAX_LOOPS;
                    do {
                        generalService.sleep(1500);
                        schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                            order_by: 'CreationDateTime DESC',
                        });
                        maxLoopsCounter--;
                    } while (
                        (!schema[0].Key.startsWith('Log_Update') ||
                            schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].FieldID !=
                                'UnitsQuantity') &&
                        maxLoopsCounter > 0
                    );
                    expect(schema[0].Key).to.be.a('String').and.contain('Log_Update');
                    expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.equal(
                        createdTransactionLines.UUID,
                    );
                    expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0]).to.deep.equal({
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
                    let schema;
                    let maxLoopsCounter = _MAX_LOOPS;
                    do {
                        generalService.sleep(1500);
                        schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                            order_by: 'CreationDateTime DESC',
                        });
                        maxLoopsCounter--;
                    } while (
                        (!schema[0].Key.startsWith('Log_Update') ||
                            schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].FieldID !=
                                'UnitDiscountPercentage') &&
                        maxLoopsCounter > 0
                    );
                    expect(schema[0].Key).to.be.a('String').and.contain('Log_Update');
                    expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.equal(
                        createdTransactionLines.UUID,
                    );
                    expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0]).to.deep.equal({
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
