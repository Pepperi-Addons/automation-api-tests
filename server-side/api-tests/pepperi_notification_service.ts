import { Catalog, Item } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../services/general.service';
//import { FieldsService } from '../services/fields.service';
import { PepperiNotificationServiceService } from '../services/pepperi-notification-service.service';
import { ObjectsService } from '../services/objects.service';
import fetch from 'node-fetch';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

export async function PepperiNotificationServiceTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    const service = generalService.papiClient;
    const pepperiNotificationServiceService = new PepperiNotificationServiceService(generalService);
    const objectsService = new ObjectsService(generalService.papiClient);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

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
    const installedAddonsArr = await generalService.getAddons(pepperiNotificationServiceVarLatestVersion);
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
                    const getCreatedTransactionLineResponse = await objectsService.getTransactionLinesTODO(
                        createdTransaction.InternalID,
                    );
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
                        expect(await objectsService.getTransactionLinesTODO(createdTransaction.InternalID))
                            .to.be.an('array')
                            .with.lengthOf(1),
                    ]);
                });

                const testID = Math.floor(Math.random() * 10000000);
                it(`Create transaction line with WAKAD ${testID + 0}`, async () => {
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

                    console.log({ putSyncResponse_stop_after_db: putSyncResponse });
                    expect(putSyncResponse).to.be.true;

                    const getCreatedTransactionLineResponse = await objectsService.getTransactionLinesTODO(
                        createdTransaction.InternalID,
                    );
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
                        expect(await objectsService.getTransactionLinesTODO(createdTransaction.InternalID))
                            .to.be.an('array')
                            .with.lengthOf(1),
                    ]);
                });
            });

            describe('GET', () => {
                it('Read from PNS', () => {
                    expect(true).to.be.true;
                });
            });

            describe('WACD', () => {
                describe('PNS Tests Scenarios', () => {
                    // const testID = Math.floor(Math.random() * 10000000);
                    // it(`Post PUT that Stop After DB TestID: ${testID + 0}`, async () => {
                    //     const putSyncResponse = await pepperiNotificationServiceService.putSync(
                    //         {
                    //             putData: {
                    //                 10: {
                    //                     SubType: '',
                    //                     Headers: [
                    //                         'CreationDateTime',
                    //                         'DeliveryDate',
                    //                         'Hidden',
                    //                         'IsDuplicated',
                    //                         'IsFixedDiscount',
                    //                         'IsFixedUnitPriceAfterDiscount',
                    //                         'ItemExternalID',
                    //                         'ItemWrntyID',
                    //                         'LineNumber',
                    //                         'PortfolioItemTSAttributes',
                    //                         'ReadOnly',
                    //                         'Remark4',
                    //                         'SpecialOfferLeadingOrderPortfolioItemUUID',
                    //                         'SuppressedSpecialOffer',
                    //                         'TSAttributes',
                    //                         'TransactionUUID',
                    //                         'UUID',
                    //                         'UnitDiscountPercentage',
                    //                         'UnitFinalPrice',
                    //                         'UnitPrice',
                    //                         'UnitPriceAfterDiscount',
                    //                         'UnitsQuantity',
                    //                         'WrntyID',
                    //                     ],
                    //                     Lines: [
                    //                         [
                    //                             '1594960700',
                    //                             '18459',
                    //                             '0',
                    //                             '0',
                    //                             '0',
                    //                             '1',
                    //                             'MCR00102',
                    //                             '55316814',
                    //                             '0',
                    //                             '<A />\n',
                    //                             '0',
                    //                             '',
                    //                             '',
                    //                             '0',
                    //                             '<A />\n',
                    //                             'FB89438F-62BB-4904-B863-6BA757AF5337',
                    //                             'b87278de-e1cc-52c2-a771-9796fd8bbe4f',
                    //                             '0',
                    //                             '906366498589870',
                    //                             '0',
                    //                             '0',
                    //                             '1',
                    //                             '-8876',
                    //                         ],
                    //                     ],
                    //                 },
                    //             },
                    //             nucleus_crud_type: 'stop_after_db',
                    //         },
                    //         testID,
                    //     );
                    //     console.log({ putSyncResponse_stop_after_db: putSyncResponse });
                    //     expect(putSyncResponse).to.be.true;
                    // });
                    // it(`Post PUT that dont stop After DB TestID: ${testID + 1}`, async () => {
                    //     const putSyncResponse = await pepperiNotificationServiceService.putSync(
                    //         {
                    //             putData: {
                    //                 10: {
                    //                     SubType: '',
                    //                     Headers: [
                    //                         'CreationDateTime',
                    //                         'DeliveryDate',
                    //                         'Hidden',
                    //                         'IsDuplicated',
                    //                         'IsFixedDiscount',
                    //                         'IsFixedUnitPriceAfterDiscount',
                    //                         'ItemExternalID',
                    //                         'ItemWrntyID',
                    //                         'LineNumber',
                    //                         'PortfolioItemTSAttributes',
                    //                         'ReadOnly',
                    //                         'Remark4',
                    //                         'SpecialOfferLeadingOrderPortfolioItemUUID',
                    //                         'SuppressedSpecialOffer',
                    //                         'TSAttributes',
                    //                         'TransactionUUID',
                    //                         'UUID',
                    //                         'UnitDiscountPercentage',
                    //                         'UnitFinalPrice',
                    //                         'UnitPrice',
                    //                         'UnitPriceAfterDiscount',
                    //                         'UnitsQuantity',
                    //                         'WrntyID',
                    //                     ],
                    //                     Lines: [
                    //                         [
                    //                             '1594960700',
                    //                             '18459',
                    //                             '0',
                    //                             '0',
                    //                             '0',
                    //                             '1',
                    //                             'MCR00102',
                    //                             '55316814',
                    //                             '0',
                    //                             '<A />\n',
                    //                             '0',
                    //                             '',
                    //                             '',
                    //                             '0',
                    //                             '<A />\n',
                    //                             'FB89438F-62BB-4904-B863-6BA757AF5337',
                    //                             'b87278de-e1cc-52c2-a771-9796fd8bbe4f',
                    //                             '0',
                    //                             '906366498589870',
                    //                             '0',
                    //                             '0',
                    //                             '1',
                    //                             '-8876',
                    //                         ],
                    //                     ],
                    //                 },
                    //             },
                    //         } as any,
                    //         testID + 1,
                    //     );
                    //     console.log({ putSyncResponse: putSyncResponse });
                    //     expect(putSyncResponse).to.be.true;
                    // });
                    // it(`Post PUT that Stop After Nucleus TestID: ${testID + 1}`, async () => {
                    //     const putSyncResponse = await pepperiNotificationServiceService.putSync(
                    //         {
                    //             putData: {
                    //                 10: {
                    //                     SubType: '',
                    //                     Headers: [
                    //                         'CreationDateTime',
                    //                         'DeliveryDate',
                    //                         'Hidden',
                    //                         'IsDuplicated',
                    //                         'IsFixedDiscount',
                    //                         'IsFixedUnitPriceAfterDiscount',
                    //                         'ItemExternalID',
                    //                         'ItemWrntyID',
                    //                         'LineNumber',
                    //                         'PortfolioItemTSAttributes',
                    //                         'ReadOnly',
                    //                         'Remark4',
                    //                         'SpecialOfferLeadingOrderPortfolioItemUUID',
                    //                         'SuppressedSpecialOffer',
                    //                         'TSAttributes',
                    //                         'TransactionUUID',
                    //                         'UUID',
                    //                         'UnitDiscountPercentage',
                    //                         'UnitFinalPrice',
                    //                         'UnitPrice',
                    //                         'UnitPriceAfterDiscount',
                    //                         'UnitsQuantity',
                    //                         'WrntyID',
                    //                     ],
                    //                     Lines: [
                    //                         [
                    //                             '1594960700',
                    //                             '18459',
                    //                             '0',
                    //                             '0',
                    //                             '0',
                    //                             '1',
                    //                             'MCR00102',
                    //                             '55316814',
                    //                             '0',
                    //                             '<A />\n',
                    //                             '0',
                    //                             '',
                    //                             '',
                    //                             '0',
                    //                             '<A />\n',
                    //                             'FB89438F-62BB-4904-B863-6BA757AF5337',
                    //                             'b87278de-e1cc-52c2-a771-9796fd8bbe4f',
                    //                             '0',
                    //                             '906366498589870',
                    //                             '0',
                    //                             '0',
                    //                             '1',
                    //                             '-8876',
                    //                         ],
                    //                     ],
                    //                 },
                    //             },
                    //             nucleus_crud_type: 'stop_after_nucleus',
                    //         },
                    //         testID + 1,
                    //     );
                    //     console.log({ putSyncResponse_stop_after_nucleus: putSyncResponse });
                    //     expect(putSyncResponse).to.be.true;
                    // });
                    // it(`Post PUT that Stop After Redis TestID: ${testID + 2}`, async () => {
                    //     const putSyncResponse = await pepperiNotificationServiceService.putSync(
                    //         {
                    //             putData: {
                    //                 10: {
                    //                     SubType: '',
                    //                     Headers: [
                    //                         'CreationDateTime',
                    //                         'DeliveryDate',
                    //                         'Hidden',
                    //                         'IsDuplicated',
                    //                         'IsFixedDiscount',
                    //                         'IsFixedUnitPriceAfterDiscount',
                    //                         'ItemExternalID',
                    //                         'ItemWrntyID',
                    //                         'LineNumber',
                    //                         'PortfolioItemTSAttributes',
                    //                         'ReadOnly',
                    //                         'Remark4',
                    //                         'SpecialOfferLeadingOrderPortfolioItemUUID',
                    //                         'SuppressedSpecialOffer',
                    //                         'TSAttributes',
                    //                         'TransactionUUID',
                    //                         'UUID',
                    //                         'UnitDiscountPercentage',
                    //                         'UnitFinalPrice',
                    //                         'UnitPrice',
                    //                         'UnitPriceAfterDiscount',
                    //                         'UnitsQuantity',
                    //                         'WrntyID',
                    //                     ],
                    //                     Lines: [
                    //                         [
                    //                             '1594960700',
                    //                             '18459',
                    //                             '0',
                    //                             '0',
                    //                             '0',
                    //                             '1',
                    //                             'MCR00102',
                    //                             '55316814',
                    //                             '0',
                    //                             '<A />\n',
                    //                             '0',
                    //                             '',
                    //                             '',
                    //                             '0',
                    //                             '<A />\n',
                    //                             'FB89438F-62BB-4904-B863-6BA757AF5337',
                    //                             'b87278de-e1cc-52c2-a771-9796fd8bbe4f',
                    //                             '0',
                    //                             '906366498589870',
                    //                             '0',
                    //                             '0',
                    //                             '1',
                    //                             '-8876',
                    //                         ],
                    //                     ],
                    //                 },
                    //             },
                    //             nucleus_crud_type: 'stop_after_redis',
                    //         },
                    //         testID + 2,
                    //     );
                    //     console.log({ putSyncResponse_stop_after_redis: putSyncResponse });
                    //     expect(putSyncResponse).to.be.true;
                    // });
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
