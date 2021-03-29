import GeneralService, { TesterFunctions } from '../services/general.service';
//import { FieldsService } from '../services/fields.service';
import { PepperiNotificationServiceService } from '../services/pepperi-notification-service.service';
import fetch from 'node-fetch';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

export async function PepperiNotificationServiceTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    const service = generalService.papiClient;
    //const fieldsService = new FieldsService(generalService.papiClient);
    const pepperiNotificationServiceService = new PepperiNotificationServiceService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //00000000-0000-0000-0000-000000040fa9

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
            describe('Post', () => {
                const testID = Math.floor(Math.random() * 10000000);
                it(`Post PUT that Stop After DB TestID: ${testID + 0}`, async () => {
                    const putSyncResponse = await pepperiNotificationServiceService.putSync(
                        {
                            putData: {
                                10: {
                                    SubType: '',
                                    Headers: [
                                        'CreationDateTime',
                                        'DeliveryDate',
                                        'Hidden',
                                        'IsDuplicated',
                                        'IsFixedDiscount',
                                        'IsFixedUnitPriceAfterDiscount',
                                        'ItemExternalID',
                                        'ItemWrntyID',
                                        'LineNumber',
                                        'PortfolioItemTSAttributes',
                                        'ReadOnly',
                                        'Remark4',
                                        'SpecialOfferLeadingOrderPortfolioItemUUID',
                                        'SuppressedSpecialOffer',
                                        'TSAttributes',
                                        'TransactionUUID',
                                        'UUID',
                                        'UnitDiscountPercentage',
                                        'UnitFinalPrice',
                                        'UnitPrice',
                                        'UnitPriceAfterDiscount',
                                        'UnitsQuantity',
                                        'WrntyID',
                                    ],
                                    Lines: [
                                        [
                                            '1594960700',
                                            '18459',
                                            '0',
                                            '0',
                                            '0',
                                            '1',
                                            'MCR00102',
                                            '55316814',
                                            '0',
                                            '<A />\n',
                                            '0',
                                            '',
                                            '',
                                            '0',
                                            '<A />\n',
                                            'FB89438F-62BB-4904-B863-6BA757AF5337',
                                            'b87278de-e1cc-52c2-a771-9796fd8bbe4f',
                                            '0',
                                            '906366498589870',
                                            '0',
                                            '0',
                                            '1',
                                            '-8876',
                                        ],
                                    ],
                                },
                            },
                            nucleus_crud_type: 'stop_after_db',
                        },
                        testID,
                    );
                    console.log({ putSyncResponse_stop_after_db: putSyncResponse });
                    expect(putSyncResponse).to.be.true;
                });

                it(`Post PUT that dont stop After DB TestID: ${testID + 1}`, async () => {
                    const putSyncResponse = await pepperiNotificationServiceService.putSync(
                        {
                            putData: {
                                10: {
                                    SubType: '',
                                    Headers: [
                                        'CreationDateTime',
                                        'DeliveryDate',
                                        'Hidden',
                                        'IsDuplicated',
                                        'IsFixedDiscount',
                                        'IsFixedUnitPriceAfterDiscount',
                                        'ItemExternalID',
                                        'ItemWrntyID',
                                        'LineNumber',
                                        'PortfolioItemTSAttributes',
                                        'ReadOnly',
                                        'Remark4',
                                        'SpecialOfferLeadingOrderPortfolioItemUUID',
                                        'SuppressedSpecialOffer',
                                        'TSAttributes',
                                        'TransactionUUID',
                                        'UUID',
                                        'UnitDiscountPercentage',
                                        'UnitFinalPrice',
                                        'UnitPrice',
                                        'UnitPriceAfterDiscount',
                                        'UnitsQuantity',
                                        'WrntyID',
                                    ],
                                    Lines: [
                                        [
                                            '1594960700',
                                            '18459',
                                            '0',
                                            '0',
                                            '0',
                                            '1',
                                            'MCR00102',
                                            '55316814',
                                            '0',
                                            '<A />\n',
                                            '0',
                                            '',
                                            '',
                                            '0',
                                            '<A />\n',
                                            'FB89438F-62BB-4904-B863-6BA757AF5337',
                                            'b87278de-e1cc-52c2-a771-9796fd8bbe4f',
                                            '0',
                                            '906366498589870',
                                            '0',
                                            '0',
                                            '1',
                                            '-8876',
                                        ],
                                    ],
                                },
                            },
                        } as any,
                        testID + 1,
                    );
                    console.log({ putSyncResponse: putSyncResponse });
                    expect(putSyncResponse).to.be.true;
                });

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
    });
}
