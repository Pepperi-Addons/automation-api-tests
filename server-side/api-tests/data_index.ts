//import { ObjectsService } from './../services/objects.service';
//import { ElasticSearchService } from './../services/elastic-search.service';
//import { DataIndexService } from './../services/data-index.service';
import GeneralService, { TesterFunctions } from '../services/general.service';
import fetch from 'node-fetch';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

export async function DataIndexTests(generalService: GeneralService, request, tester: TesterFunctions) {
    //const elasticSearchService = new ElasticSearchService(generalService.papiClient);
    //const objectsService = new ObjectsService(generalService);
    //  const dataIndexService = new DataIndexService(generalService.papiClient);
    const service = generalService.papiClient;

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    // all_activities_fields
    const allActivitiesIndexFieldsArr = [
        //     'ExternalID',
        //     'TaxPercentage',
        //     'Remark',
        //     'CreationDateTime',
        //     'SubTotal',
        //     'Status',
        //     'DiscountPercentage',
        //     'TSATestIndexString',
        //     'TSATestIndexTime',
        //     'TSATestIndexCalculated',
        //     'TSATestIndexAttachment',
        //     'TSATestIndexNumber',
        //     'TSATestIndexDecimalNumber',
        //     'Account.ExternalID',
        'Account.City',
        //     'Account.Country',
        //     'Account.Status',
        //     'Catalog.Description',
        //     'Catalog.ExternalID',
        //     'Catalog.TSAImage',
        //     'ContactPerson.ExternalID',
        //     'ContactPerson.FirstName',
        //     'ContactPerson.Mobile',
        //     'Creator.ExternalID',
        //     'Creator.FirstName',
        //     'Creator.Mobile',
    ];

    // transaction_lines_fields
    //const transactionLinesIndexFieldsArr = [
    /*'TSATestIndexString',
    'TSATestIndexTime',
    'TSATestIndexCalculated',
    'TSATestIndexNumber',
    'TSATestIndexDecimalNumber',
    'LineNumber',
    'DeliveryDate',*/
    // Replace with next 'UnitsQuantity',
    //TotalUnitsPriceAfterDiscount - Don't ask for UnitQuantity and UnitPriceAfterDiscount
    //TotalUnitsPriceBeforeDiscount - Don't ask for UnitQuantity and UnitPrice
    /*'Item.ExternalID',
    'Item.Name',
    'UnitDiscountPercentage',
    'CreationDateTime',
    'Transaction.ExternalID',
    'Transaction.InternalID',
    'Transaction.Remark',
    'Transaction.CreationDateTime',
    'Transaction.SubTotal',
    'Transaction.Status',
    'Transaction.DiscountPercentage',
    'Transaction.Account.ExternalID',
    'Transaction.Account.TSAPaymentMethod',
    'Transaction.Account.ZipCode',
    'Transaction.Account.Status',*/
    // Shuold work 'Transaction.Agent.ExternalID',
    // Shuold work 'Transaction.Agent.FirstName',
    // Shuold work 'Transaction.Agent.Mobile',
    // Shuold work 'Transaction.ContactPerson.ExternalID',
    // Shuold work 'Transaction.ContactPerson.FirstName',
    // Shuold work 'Transaction.ContactPerson.Mobile',
    //];

    const allActivitiesArr = await generalService.getAllActivities({
        page_size: -1,
        fields: ['InternalID', ...allActivitiesIndexFieldsArr],
    });
    //Data Index Addon 10979a11-d7f4-41df-8993-f06bfd778304
    const pepperiNotificationServiceAddonUUID = '00000000-0000-0000-0000-000000040fa9';
    //TODO: Remove this (1.0.50) and work on the actually latest version
    //when shir or meital will refactor Data Index to work with the new framework changes
    const pepperiNotificationServiceVersion = '';

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

    describe('Data Index Tests Suites', () => {
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
                        if (
                            !pepperiNotificationServiceAuditLogResponse.AuditInfo.ErrorMessage.includes(
                                'is already working on newer version',
                            )
                        ) {
                            expect(pepperiNotificationServiceAuditLogResponse.AuditInfo.ErrorMessage).to.include(
                                'is already working on version',
                            );
                        } else {
                            await expect(
                                service.addons.installedAddons
                                    .addonUUID(`${pepperiNotificationServiceAddonUUID}`)
                                    .downgrade(pepperiNotificationServiceVarLatestVersion),
                            )
                                .eventually.to.have.property('ExecutionUUID')
                                .a('string')
                                .with.lengthOf(36)
                                .then(async (executionUUID) => {
                                    generalService.sleep(4000); //Test downgrade status only after 4 seconds.
                                    let auditLogResponse = await service.auditLogs.uuid(executionUUID).get();
                                    if (auditLogResponse.Status.Name == 'InProgress') {
                                        generalService.sleep(20000); //Wait another 20 seconds and try again (fail the test if client wait more then 20+4 seconds)
                                        auditLogResponse = await service.auditLogs.uuid(executionUUID).get();
                                    }
                                    pepperiNotificationServiceInstalledAddonVersion;
                                    expect(auditLogResponse.Status.Name).to.include('Success');
                                });
                        }
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

        describe('All Activities', () => {
            it(`Test Data: Amount of All Activities: ${allActivitiesArr.length}`, async () => {
                expect(allActivitiesArr.length).to.be.above(0);
            });
            describe('CRUD Index of Fields', () => {
                for (let index = 0; index < allActivitiesIndexFieldsArr.length; index++) {
                    const allActivitiesIndexFieldsArrName = allActivitiesIndexFieldsArr[index];
                    describe(allActivitiesIndexFieldsArrName, () => {
                        const sortedAndCountedMap: Map<string, number> = new Map();
                        it(`Sort by ${allActivitiesIndexFieldsArrName} with count`, () => {
                            for (let index = 0; index < allActivitiesArr.length; index++) {
                                if (sortedAndCountedMap.has(allActivitiesArr[index][allActivitiesIndexFieldsArrName])) {
                                    sortedAndCountedMap.set(
                                        allActivitiesArr[index][allActivitiesIndexFieldsArrName],
                                        (sortedAndCountedMap.get(
                                            allActivitiesArr[index][allActivitiesIndexFieldsArrName],
                                        ) as number) + 1,
                                    );
                                } else {
                                    sortedAndCountedMap.set(
                                        allActivitiesArr[index][allActivitiesIndexFieldsArrName],
                                        1,
                                    );
                                }
                            }

                            sortedAndCountedMap.forEach((value, key) => {
                                console.log(`sortedAndCountedMap[${key}] = ${value}`);
                                expect(value).to.be.above(0);
                            });
                        });

                        let testDataAccount;
                        if (allActivitiesIndexFieldsArrName.includes('.')) {
                            it(`Create ${allActivitiesIndexFieldsArrName.split('.')[0]} With New ${
                                allActivitiesIndexFieldsArrName.split('.')[1]
                            }`, async () => {
                                testDataAccount = await generalService.fetchStatus('POST', '/accounts', {
                                    ExternalID: 'oren test 11111',
                                    City: 'oren city',
                                });
                                expect(testDataAccount.Status).to.equal(201);
                            });
                        }

                        it(`Create Transaction With The New ${allActivitiesIndexFieldsArrName}`, async () => {
                            const testDataTransaction = await generalService.fetchStatus('POST', '/transactions', {
                                ExternalID: 'Automated API Transaction 46500388818',
                                ActivityTypeID: 268428,
                                Account: {
                                    Data: {
                                        InternalID: 20527148,
                                    },
                                },
                                Catalog: {
                                    Data: {
                                        InternalID: 76449,
                                    },
                                },
                            });
                            expect(testDataTransaction.Status).to.equal(201);
                        });

                        //Done //CRUD Index of Fields -  Account.City
                        //Done //1 (create)	API call GET: https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City
                        //Done //2 (create)	API call POST: https://papi.staging.pepperi.com/V1.0/accounts (With Account.City from test data – city 1234)
                        //3 (create)	API call POST: https://papi.staging.pepperi.com/V1.0/transaction (With the new Account)
                        //4 (create)	API call: https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City
                        //5 (create)	Compare the counts from  Account.City (1), with the counts from Totals (4)
                        //6 (update)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City
                        //7 (update)	API call POST: https://papi.staging.pepperi.com/V1.0/accounts (With Account.City as the first existing)
                        //8 (update)	API call GET : https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City
                        //9 (update)	Compare the counts from Account.City (6), with the counts from Totals (8)
                        //10 (Update to empty)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City
                        //11 (Update to empty)	API call POST: https://papi.staging.pepperi.com/V1.0/accounts (With Account.City as empty string or null if possible)
                        //12 (Update to empty)	API call GET : https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City
                        //13 (Update to empty)	Compare the counts from Account.City (10), with the counts from Totals (12)
                        //14 (clean up)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)
                        //15 (clean up)	API call DELETE: https://papi.staging.pepperi.com/V1.0/transactions (Clean the test transaction and restore previous condition)
                        //16 (clean up)	API call GET :   https://papi.staging.pepperi.com/V1.0/elasticsearch/all_activities?where=InternalID=86411390
                        //17 (clean up)	https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?
                        //18 (clean up)	Compare the counts from Account.City (14), with the counts from Totals (16)
                    });
                }
            });
        });

        // describe('Transaction Lines', () => {
        //     it(`Test Data: Amount of Transaction Lines: ${transactionLinesArr.length}`, () => {
        //         expect(transactionLinesArr.length).to.be.above(0);
        //     });
        //     describe('Create Index of Fields', () => {
        //         for (let index = 0; index < transactionLinesIndexFieldsArr.length; index++) {
        //             const transactionLinesIndexFieldName = transactionLinesIndexFieldsArr[index];
        //             it(transactionLinesIndexFieldName, () => {
        //                 transactionLinesFieldsMappedIndex;
        //                 for (let index = 0; index < transactionLinesFieldsMappedIndex.length; index++) {
        //                     const transactionLinesFields = transactionLinesFieldsMappedIndex[index];
        //                 }
        //                 //Done//Create Index of Fields - Account.City
        //                 //Done//API call GET:
        //                 //Done//https://papi.staging.pepperi.com/V1.0/all_activities?page_size=-1	Array > 0
        //                 //Sort by AccountExternalID with count.Count > 0
        //                 //API call GET: (for each different AccountExternalID)
        //                 //https://papi.staging.pepperi.com/V1.0/accounts?where=ExternalID='c28024'	Response Code 200
        //                 //Map Account.City and count.
        //                 //API call GET: https://papi.staging.pepperi.com/V1.0/elasticsearch/all_activities?page_size=-1	Array > 0
        //                 //Map Account.City and count	Count > 0
        //                 //Compare the counts from City(4), with the counts from Account.City(6)	Is Equal
        //                 //API call GET: https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Response Code 200
        //                 //Compare the counts from  Account.City(4), with the counts from Totals(8)	Is Equal
        //                 expect(true).to.be.true;
        //             });

        //             if (false) {
        //                 describe('POST', () => {
        //                     it('Create transaction', async () => {
        //                         const oren = await elasticSearchService.getElasticSearch('all_activities', {
        //                             page_size: -1,
        //                         });
        //                         console.log({ oren: oren });
        //                         expect(JSON.stringify(oren)).to.include('oren');
        //                     });

        //                     it('Create transaction', async () => {
        //                         const oren = await elasticSearchService.getElasticSearch('transaction_lines', {
        //                             page_size: -1,
        //                         });
        //                         console.log({ oren: oren });
        //                         expect(JSON.stringify(oren)).to.include('oren');
        //                     });

        //                     it('Get totals', async () => {
        //                         const getTotalsData = await elasticSearchService.getTotals('all_activities', {
        //                             select: [
        //                                 'sum(Status)',
        //                                 'avg(Status)',
        //                                 'min(Status)',
        //                                 'max(Status)',
        //                                 'count(Status)',
        //                             ],
        //                         });
        //                         console.log({ getTotalsData: getTotalsData });
        //                         expect(getTotalsData[0]).to.have.property('avg_RetailPrice').that.equals(243.5);
        //                     });

        //                     it('Get totals with group by', async () => {
        //                         const getTotalsData = await elasticSearchService.getTotals('all_activities', {
        //                             select: [
        //                                 'sum(Status)',
        //                                 'avg(Status)',
        //                                 'min(Status)',
        //                                 'max(Status)',
        //                                 'count(Status)',
        //                             ],
        //                             group_by: 'Catalog.ExternalID',
        //                         });
        //                         console.log({ getTotalsData: getTotalsData });
        //                         expect(getTotalsData[0]).to.have.property('avg_RetailPrice').that.equals(243.5);
        //                     });
        //                 });
        //             }
        //         }
        //     });
        // });
    });
}
