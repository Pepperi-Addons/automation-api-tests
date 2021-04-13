import { Catalog, Item } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../services/general.service';
import { NucleusFlagType, PepperiNotificationServiceService } from '../services/pepperi-notification-service.service';
import { ObjectsService } from '../services/objects.service';
import { ADALService } from '../services/adal.service';
import fetch from 'node-fetch';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

export async function PepperiNotificationServiceTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    const service = generalService.papiClient;
    const pepperiNotificationServiceService = new PepperiNotificationServiceService(generalService);
    const objectsService = new ObjectsService(generalService);
    const adalService = new ADALService(generalService.papiClient);

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const PepperiOwnerID = generalService.papiClient['options'].addonUUID;

    const pepperiNotificationServiceAddonUUID = '00000000-0000-0000-0000-000000040fa9';
    const pepperiNotificationServiceVersion = '1.';

    //#region Upgrade Pepperi Notification Service
    const pepperiNotificationServiceVarLatestVersion = await fetch(
        `${generalService['client'].BaseURL.replace(
            'papi-eu',
            'papi',
        )}/var/addons/versions?where=AddonUUID='${pepperiNotificationServiceAddonUUID}' AND Version Like '${pepperiNotificationServiceVersion}%'&order_by=CreationDateTime DESC`,
        {
            method: `GET`,
            headers: {
                Authorization: `${request.body.varKey}`,
            },
        },
    )
        .then((response) => response.json())
        .then((addon) => addon[0].Version);

    let isInstalled = false;
    let installedAddonVersion;
    const installedAddonsArr = await generalService.getAddons();
    for (let i = 0; i < installedAddonsArr.length; i++) {
        if (installedAddonsArr[i].Addon !== null) {
            if (installedAddonsArr[i].Addon.Name == 'Pepperi Notification Service API') {
                installedAddonVersion = installedAddonsArr[i].Version;
                isInstalled = true;
                break;
            }
        }
    }
    if (!isInstalled) {
        await service.addons.installedAddons.addonUUID(`${pepperiNotificationServiceAddonUUID}`).install();
        generalService.sleep(20000); //If addon needed to be installed, just wait 20 seconds, this should not happen.
    }

    let pepperiNotificationServiceUpgradeAuditLogResponse;
    let pepperiNotificationServiceInstalledAddonVersion;
    let pepperiNotificationServiceAuditLogResponse;
    if (installedAddonVersion != pepperiNotificationServiceVarLatestVersion) {
        pepperiNotificationServiceUpgradeAuditLogResponse = await service.addons.installedAddons
            .addonUUID(`${pepperiNotificationServiceAddonUUID}`)
            .upgrade(pepperiNotificationServiceVarLatestVersion);

        generalService.sleep(4000); //Test installation status only after 4 seconds.
        pepperiNotificationServiceAuditLogResponse = await service.auditLogs
            .uuid(pepperiNotificationServiceUpgradeAuditLogResponse.ExecutionUUID)
            .get();
        if (pepperiNotificationServiceAuditLogResponse.Status.Name == 'InProgress') {
            generalService.sleep(20000); //Wait another 20 seconds and try again (fail the test if client wait more then 20+4 seconds)
            pepperiNotificationServiceAuditLogResponse = await service.auditLogs
                .uuid(pepperiNotificationServiceUpgradeAuditLogResponse.ExecutionUUID)
                .get();
        }
        pepperiNotificationServiceInstalledAddonVersion = await (
            await service.addons.installedAddons.addonUUID(`${pepperiNotificationServiceAddonUUID}`).get()
        ).Version;
    } else {
        pepperiNotificationServiceUpgradeAuditLogResponse = 'Skipped';
        pepperiNotificationServiceInstalledAddonVersion = installedAddonVersion;
    }
    //#endregion Upgrade Pepperi Notification Service

    describe('Pepperi Notification Service Tests Suites', () => {
        const testID = Math.floor(Math.random() * 10000000);
        const schemaName = 'PNS Test';
        let atdArr;
        let catalogArr: Catalog[];
        let itemArr: Item[];
        let transactionAccount;
        let createdTransaction;
        let transactionExternalID;
        let createdTransactionLines;
        describe('Prerequisites Addon for PepperiNotificationService Tests', () => {
            //Test Data
            it(`Test Data: Tested Addon: PNS - Version: ${pepperiNotificationServiceInstalledAddonVersion}`, () => {
                expect(pepperiNotificationServiceInstalledAddonVersion).to.contain('.');
            });

            it('Upgarde To Latest Version of Pepperi Notification Service Addon', async () => {
                if (pepperiNotificationServiceUpgradeAuditLogResponse != 'Skipped') {
                    expect(pepperiNotificationServiceUpgradeAuditLogResponse)
                        .to.have.property('ExecutionUUID')
                        .a('string')
                        .with.lengthOf(36);
                    if (pepperiNotificationServiceAuditLogResponse.Status.Name == 'Failure') {
                        expect(pepperiNotificationServiceAuditLogResponse.AuditInfo.ErrorMessage).to.include(
                            'is already working on version',
                        );
                    } else {
                        expect(pepperiNotificationServiceAuditLogResponse.Status.Name).to.include('Success');
                    }
                }
            });

            it(`Latest Version Is Installed`, () => {
                expect(pepperiNotificationServiceInstalledAddonVersion).to.equal(
                    pepperiNotificationServiceVarLatestVersion,
                );
            });
        });

        describe('Endpoints', () => {
            describe('POST', () => {
                it('Create transaction', async () => {
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

                it('Create transaction line with SDK', async () => {
                    itemArr = await objectsService.getItems({ page_size: 1 });
                    createdTransactionLines = await objectsService.createTransactionLine({
                        LineNumber: 0,
                        UnitsQuantity: 25,
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

                    console.log({ createdTransactionLines: createdTransactionLines });
                    const getCreatedTransactionLineResponse = await objectsService.getTransactionLines({
                        where: `TransactionInternalID=${createdTransaction.InternalID}`,
                    });
                    console.log({ getCreatedTransactionLineResponse: getCreatedTransactionLineResponse });

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

                it('Validate PNS Triggered for Insert', async () => {
                    let schema;
                    let maxLoopsCounter = 30;
                    do {
                        generalService.sleep(1500);
                        schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                            order_by: 'ModificationDateTime DESC',
                        });
                        maxLoopsCounter--;
                    } while (
                        (!schema[0].Key.startsWith('Insert') ||
                            schema[0].TransactioInfo.UnitsQuantity != 25 ||
                            schema[0].TransactioInfo.ItemData.ExternalID != itemArr[0].ExternalID) &&
                        maxLoopsCounter > 0
                    );

                    expect(schema[0].Key).to.be.a('String').and.contain('Insert');
                    expect(schema[0].TransactioInfo.UnitsQuantity).to.equal(25);
                    expect(schema[0].TransactioInfo.ItemData.ExternalID).to.equal(itemArr[0].ExternalID);
                });

                it(`Create transaction line with WACD ${testID + 0}`, async () => {
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
                                            '77',
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
                    console.log({ getCreatedTransactionLineResponse: getCreatedTransactionLineResponse });

                    return Promise.all([
                        expect(getCreatedTransactionLineResponse[0]).to.include({
                            LineNumber: 0,
                            UnitsQuantity: 77,
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

                it('Validate PNS Triggered for Update', async () => {
                    let schema;
                    let maxLoopsCounter = 30;
                    do {
                        generalService.sleep(1500);
                        schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                            order_by: 'ModificationDateTime DESC',
                        });
                        maxLoopsCounter--;
                    } while (
                        (!schema[0].Key.startsWith('Update') ||
                            schema[0].TransactioInfo.UnitsQuantity != 77 ||
                            schema[0].TransactioInfo.ItemData.ExternalID != itemArr[0].ExternalID) &&
                        maxLoopsCounter > 0
                    );

                    expect(schema[0].Key).to.be.a('String').and.contain('Update');
                    expect(schema[0].TransactioInfo.UnitsQuantity).to.equal(77);
                    expect(schema[0].TransactioInfo.ItemData.ExternalID).to.equal(itemArr[0].ExternalID);
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
                        it(`Post PUT That ${testName} TestID ${testID + index + 1}`, async () => {
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
                                testID + index,
                            );

                            console.log({ testType: putSyncResponse });
                            if (testName == 'Stop After DB') {
                                expect(putSyncResponse).to.be.false;
                            } else {
                                expect(putSyncResponse).to.be.true;
                            }

                            const getCreatedTransactionLineResponse = await objectsService.getTransactionLines({
                                where: `TransactionInternalID=${createdTransaction.InternalID}`,
                            });
                            console.log({ getCreatedTransactionLineResponse: getCreatedTransactionLineResponse });

                            if (testName == 'Stop After DB') {
                                expect(getCreatedTransactionLineResponse[0]).to.not.include({
                                    LineNumber: 0,
                                    UnitsQuantity: 11 * (1 + index),
                                });
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
                            }
                        });

                        it(`Validate ${
                            testName == 'Stop After DB' ? 'No New' : ''
                        } PNS Triggered for Update When ${testName}`, async () => {
                            let schema;
                            let maxLoopsCounter = 15;
                            do {
                                generalService.sleep(1500);
                                schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                                    order_by: 'ModificationDateTime DESC',
                                });
                                maxLoopsCounter--;
                            } while (
                                (!schema[0].Key.startsWith('Update') ||
                                    schema[0].TransactioInfo.UnitsQuantity != 11 * (1 + index) ||
                                    schema[0].TransactioInfo.ItemData.ExternalID != itemArr[0].ExternalID) &&
                                maxLoopsCounter > 0
                            );
                            if (testName == 'Stop After DB') {
                                expect(schema[0].TransactioInfo.UnitsQuantity).to.not.equal(11 * (1 + index));
                            } else {
                                expect(schema[0].Key).to.be.a('String').and.contain('Update');
                                expect(schema[0].TransactioInfo.UnitsQuantity).to.equal(11 * (1 + index));
                                expect(schema[0].TransactioInfo.ItemData.ExternalID).to.equal(itemArr[0].ExternalID);
                            }
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
