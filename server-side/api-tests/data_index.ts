import { ObjectsService } from './../services/objects.service';
import { DataIndexService } from './../services/data-index.service';
import GeneralService, { TesterFunctions } from '../services/general.service';

export async function DataIndexTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const objectsService = new ObjectsService(generalService);
    const dataIndexService = new DataIndexService(generalService.papiClient);

    const _MAX_LOOPS_COUNTER = 2; //10;
    const _INTERVAL_TIMER = 500; //5000;

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const all_activities_fields = [
        //'ExternalID',
        // 'TaxPercentage',
        // 'Remark',
        // 'CreationDateTime',
        // 'SubTotal',
        // 'Status',
        // 'DiscountPercentage',
        // 'TSATestIndexString',
        // 'TSATestIndexTime',
        // 'TSATestIndexCalculated',
        // 'TSATestIndexAttachment',
        // 'TSATestIndexNumber',
        // 'TSATestIndexDecimalNumber',
        // 'Account.ExternalID',
        'Account.City',
        // 'Account.Country',
        // 'Account.Status',
        // 'Account.Parent.City',
        // 'Catalog.Description',
        'Catalog.ExternalID',
        // 'Catalog.TSAImage',
        // 'ContactPerson.ExternalID',
        // 'ContactPerson.FirstName',
        // 'ContactPerson.Mobile',
        // 'Creator.ExternalID',
        // 'Creator.FirstName',
        // 'Creator.Mobile',
        // 'Agent.ExternalID',
        // 'Agent.FirstName',
        // 'Agent.Mobile',
        // 'OriginAccount.ExternalID',
        // 'OriginAccount.City',
        // 'OriginAccount.Status',
        // 'AdditionalAccount.ExternalID',
        // 'AdditionalAccount.City',
        // 'AdditionalAccount.Status',
    ];

    // const transaction_lines_fields = [
    //     'TSATestIndexString',
    //     'TSATestIndexTime',
    //     'TSATestIndexCalculated',
    //     'TSATestIndexNumber',
    //     'TSATestIndexDecimalNumber',
    //     'LineNumber',
    //     'DeliveryDate',
    //     'TotalUnitsPriceAfterDiscount',
    //     'TotalUnitsPriceBeforeDiscount',
    //     'Item.ExternalID',
    //     'Item.Name',
    //     'UnitDiscountPercentage',
    //     'CreationDateTime',
    //     'Transaction.ExternalID',
    //     'Transaction.InternalID',
    //     'Transaction.Remark',
    //     'Transaction.CreationDateTime',
    //     'Transaction.SubTotal',
    //     'Transaction.Status',
    //     'Transaction.DiscountPercentage',
    //     'Transaction.Account.ExternalID',
    //     'Transaction.Account.TSAPaymentMethod',
    //     'Transaction.Account.ZipCode',
    //     'Transaction.Account.Status',
    //     'Transaction.Account.City',
    //     'Transaction.Account.Parent.City',
    //     'Transaction.Agent.ExternalID',
    //     'Transaction.Agent.FirstName',
    //     'Transaction.Agent.Mobile',
    //     'Transaction.ContactPerson.ExternalID',
    //     'Transaction.ContactPerson.FirstName',
    //     'Transaction.ContactPerson.Mobile',
    //     'Transaction.OriginAccount.ExternalID',
    //     'Transaction.OriginAccount.City',
    //     'Transaction.OriginAccount.Status',
    //     'Transaction.AdditionalAccount.ExternalID',
    //     'Transaction.AdditionalAccount.City',
    //     'Transaction.AdditionalAccount.Status',
    // ];

    //#region Upgrade Data Index
    //TODO: Remove this (1.0.50) and work on the actually latest version
    //when shir or meital will refactor Data Index to work with the new framework changes
    const testData = {
        'Pepperi Notification Service': ['00000000-0000-0000-0000-000000040fa9', ''], //1.0.62
        'Data Index': ['10979a11-d7f4-41df-8993-f06bfd778304', ''], //0.0.89
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.chnageVersion(request.body.varKey, testData, false);
    //#endregion Upgrade Data Index

    describe('Data Index Tests Suites', () => {
        //Test Data
        const accountExternalID: string =
            'Test Data Account - Data Index Test' + Math.floor(Math.random() * 1000000).toString();
        const transactionExternalID: string =
            'Test Data Transaction - Data Index Test' + Math.floor(Math.random() * 1000000).toString();
        describe('Prerequisites Addon for PepperiNotificationService Tests', () => {
            //Test Datas
            //Data Index, Pepperi Notification Service
            it('Validate that all the needed addons are installed', async () => {
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

        describe('All Activities', () => {
            describe('CRUD Index of Fields', () => {
                for (let index = 0; index < all_activities_fields.length; index++) {
                    const allActivitiesFieldName = all_activities_fields[index];
                    describe(allActivitiesFieldName, () => {
                        let createdField: any;
                        let existedField: any;
                        let emptyField: any;
                        let activityTypeID: number;
                        let accountInternalID: number;
                        let tempAccountInternalID: number;
                        let transactionInternalID: number;
                        let catalogInternalID: number;
                        let baseSortedAndCountedMap: Map<string, number> = new Map();

                        //#region Create
                        it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
                            baseSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
                                allActivitiesFieldName,
                            );
                            baseSortedAndCountedMap.forEach((value /*, key*/) => {
                                //console.log(`baseSortedAndCountedMap[${key}] = ${value}`);
                                expect(value).to.be.above(0);
                            });
                        });

                        if (allActivitiesFieldName.includes('.')) {
                            it(`Create ${allActivitiesFieldName.split('.')[0]} With New ${allActivitiesFieldName.split('.')[1]
                                }`, async () => {
                                    if (allActivitiesFieldName.split('.')[0] != 'Account') {
                                        throw new Error('NotImplementedException');
                                    }
                                    createdField = dataIndexService.createTestDataForField(
                                        allActivitiesFieldName.split('.')[1],
                                    );
                                    const createAccountResponse = await generalService.fetchStatus('POST', '/accounts', {
                                        ExternalID: accountExternalID,
                                        [allActivitiesFieldName.split('.')[1]]: createdField,
                                    });
                                    accountInternalID = createAccountResponse.Body.InternalID;
                                    expect(createAccountResponse.Status).to.equal(201);
                                });
                        }

                        it(`Create Transaction With The New ${allActivitiesFieldName}`, async () => {
                            const transactionArr = await objectsService.getTransaction({
                                where: `Type LIKE '%Sales Order%'`,
                                page_size: 1,
                            });
                            activityTypeID = transactionArr[0].ActivityTypeID as number;
                            const catalogsArr = await objectsService.getCatalogs({ page_size: 1 });
                            catalogInternalID = catalogsArr[0].InternalID;
                            if (!accountInternalID) {
                                const accountsArr = await objectsService.getAccounts({ page_size: 1 });
                                accountInternalID = accountsArr[0].InternalID as number;
                            }
                            const testDataTransaction = await generalService.fetchStatus('POST', '/transactions', {
                                ExternalID: transactionExternalID,
                                ActivityTypeID: activityTypeID,
                                Account: {
                                    Data: {
                                        InternalID: accountInternalID,
                                    },
                                },
                                Catalog: {
                                    Data: {
                                        InternalID: catalogInternalID,
                                    },
                                },
                            });
                            debugger;
                            transactionInternalID = testDataTransaction.Body.InternalID
                            expect(testDataTransaction.Status).to.equal(201);
                        });

                        let updatedSortedAndCountedMap: Map<string, number> = new Map();
                        it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
                            //try for 50 seconds to get the updated fields
                            let maxLoopsCounter = _MAX_LOOPS_COUNTER;
                            do {
                                updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
                                    allActivitiesFieldName,
                                );
                                if (!updatedSortedAndCountedMap.has(createdField)) {
                                    maxLoopsCounter--;
                                    generalService.sleep(_INTERVAL_TIMER);
                                    console.log({
                                        updatedSortedAndCountedMap_Field: updatedSortedAndCountedMap.has(createdField),
                                    });
                                }
                            } while (!updatedSortedAndCountedMap.has(createdField) && maxLoopsCounter > 0);

                            updatedSortedAndCountedMap.forEach((value /*, key*/) => {
                                //console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
                                expect(value).to.be.above(0);
                            });

                            if (!updatedSortedAndCountedMap.has(createdField)) {
                                //Brake the next steps of the test if the updated field creation failed
                                updatedSortedAndCountedMap = undefined as any;
                                throw new Error(
                                    `updatedSortedAndCountedMap don't contain the field ${allActivitiesFieldName}: ${createdField}`,
                                );
                            }
                        });

                        it(`Compare The Counts From Totals ${allActivitiesFieldName}`, async () => {
                            baseSortedAndCountedMap.forEach((value, key) => {
                                if (key == createdField) {
                                    expect(value).to.be.equal((updatedSortedAndCountedMap.get(key) as number) + 1);
                                } else {
                                    expect(value).to.be.equal(updatedSortedAndCountedMap.get(key));
                                }
                            });
                            if (!baseSortedAndCountedMap.has(createdField)) {
                                expect(updatedSortedAndCountedMap.get(createdField)).to.be.equal(1);
                            }
                        });
                        //#endregion Create

                        //#region Update
                        it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
                            baseSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
                                allActivitiesFieldName,
                            );
                            baseSortedAndCountedMap.forEach((value /*, key*/) => {
                                //console.log(`baseSortedAndCountedMap[${key}] = ${value}`);
                                expect(value).to.be.above(0);
                            });
                        });

                        if (allActivitiesFieldName.includes('.')) {
                            it(`Get Existing ${allActivitiesFieldName.split('.')[0]} With Existing ${allActivitiesFieldName.split('.')[1]
                                }`, async () => {
                                    if (allActivitiesFieldName.split('.')[0] != 'Account') {
                                        throw new Error('NotImplementedException');
                                    }
                                    const accountsArr = await objectsService.getAccounts({ page_size: 1 });
                                    tempAccountInternalID = accountsArr[0].InternalID as number;
                                    existedField = accountsArr[0][allActivitiesFieldName.split('.')[1]];
                                    expect(accountsArr.length).to.be.above(0);
                                });
                        }

                        it(`Update Transaction With Existing ${allActivitiesFieldName}`, async () => {
                            const testDataTransaction = await generalService.fetchStatus('POST', '/transactions', {
                                InternalID: transactionInternalID,
                                ExternalID: transactionExternalID,
                                ActivityTypeID: activityTypeID,
                                Account: {
                                    Data: {
                                        InternalID: tempAccountInternalID,
                                    },
                                },
                                Catalog: {
                                    Data: {
                                        InternalID: catalogInternalID,
                                    },
                                },
                            });
                            expect(testDataTransaction.Status).to.equal(200);
                        });

                        it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
                            //try for 50 seconds to get the updated fields
                            let maxLoopsCounter = _MAX_LOOPS_COUNTER;
                            do {
                                updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
                                    allActivitiesFieldName,
                                );
                                if (updatedSortedAndCountedMap.has(createdField)) {
                                    maxLoopsCounter--;
                                    generalService.sleep(_INTERVAL_TIMER);
                                    console.log({
                                        updatedSortedAndCountedMap_Field: updatedSortedAndCountedMap.has(createdField),
                                    });
                                }
                            } while (updatedSortedAndCountedMap.has(createdField) && maxLoopsCounter > 0);

                            updatedSortedAndCountedMap.forEach((value /*, key*/) => {
                                //console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
                                expect(value).to.be.above(0);
                            });

                            if (updatedSortedAndCountedMap.has(createdField)) {
                                //Brake the next steps of the test if the updated field change failed
                                updatedSortedAndCountedMap = undefined as any;
                                throw new Error(
                                    `updatedSortedAndCountedMap contain the field ${allActivitiesFieldName}: ${createdField}`,
                                );
                            }
                        });

                        it(`Compare The Counts From Totals ${allActivitiesFieldName}`, async () => {
                            baseSortedAndCountedMap.forEach((value, key) => {
                                if (key == existedField) {
                                    expect(value).to.be.equal((updatedSortedAndCountedMap.get(key) as number) - 1);
                                } else if (key == createdField) {
                                    expect(value).to.be.equal((updatedSortedAndCountedMap.get(key) as number) + 1);
                                } else {
                                    expect(value).to.be.equal(updatedSortedAndCountedMap.get(key));
                                }
                            });
                            if (updatedSortedAndCountedMap.has(createdField)) {
                                expect(updatedSortedAndCountedMap.get(createdField)).to.be.equal(
                                    (baseSortedAndCountedMap.get(createdField) as number) + 1,
                                );
                            }
                        });
                        //#endregion Update

                        //#region Update to empty
                        it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
                            baseSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
                                allActivitiesFieldName,
                            );
                            baseSortedAndCountedMap.forEach((value /*, key*/) => {
                                //console.log(`baseSortedAndCountedMap[${key}] = ${value}`);
                                expect(value).to.be.above(0);
                            });
                        });

                        if (allActivitiesFieldName.includes('.')) {
                            it(`Update The New ${allActivitiesFieldName.split('.')[0]} With Empty ${allActivitiesFieldName.split('.')[1]
                                }`, async () => {
                                    if (allActivitiesFieldName.split('.')[0] != 'Account') {
                                        throw new Error('NotImplementedException');
                                    }
                                    const updateAccountResponse = await generalService.fetchStatus('POST', '/accounts', {
                                        InternalID: accountInternalID,
                                        [allActivitiesFieldName.split('.')[1]]: null,
                                    });
                                    emptyField = updateAccountResponse.Body[allActivitiesFieldName.split('.')[1]];
                                    expect(updateAccountResponse.Status).to.equal(200);
                                });
                        }

                        it(`Update Transaction To Empty ${allActivitiesFieldName}`, async () => {
                            const testDataTransaction = await generalService.fetchStatus('POST', '/transactions', {
                                InternalID: transactionInternalID,
                                ExternalID: transactionExternalID,
                                ActivityTypeID: activityTypeID,
                                Account: {
                                    Data: {
                                        InternalID: accountInternalID,
                                    },
                                },
                                Catalog: {
                                    Data: {
                                        InternalID: catalogInternalID,
                                    },
                                },
                            });
                            expect(testDataTransaction.Status).to.equal(200);
                        });

                        it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
                            //try for 50 seconds to get the updated fields
                            let maxLoopsCounter = _MAX_LOOPS_COUNTER;
                            do {
                                updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
                                    allActivitiesFieldName,
                                );
                                if (
                                    updatedSortedAndCountedMap.has(emptyField) &&
                                    baseSortedAndCountedMap.has(emptyField) &&
                                    (updatedSortedAndCountedMap.get(emptyField) as number) ==
                                    (baseSortedAndCountedMap.get(emptyField) as number)
                                ) {
                                    maxLoopsCounter--;
                                    generalService.sleep(_INTERVAL_TIMER);
                                    console.log({
                                        updatedSortedAndCountedMap_Field: updatedSortedAndCountedMap.has(createdField),
                                    });
                                }
                            } while (updatedSortedAndCountedMap.has(createdField) && maxLoopsCounter > 0);

                            updatedSortedAndCountedMap.forEach((value /*, key*/) => {
                                //console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
                                expect(value).to.be.above(0);
                            });

                            if (!updatedSortedAndCountedMap.has(emptyField)) {
                                //Brake the next steps of the test if the updated field change failed
                                updatedSortedAndCountedMap = undefined as any;
                                throw new Error(
                                    `updatedSortedAndCountedMap don't contain the field ${allActivitiesFieldName}: ${emptyField}`,
                                );
                            }
                        });

                        it(`Compare The Counts From Totals ${allActivitiesFieldName}`, async () => {
                            baseSortedAndCountedMap.forEach((value, key) => {
                                if (key == emptyField) {
                                    expect(value).to.be.equal((updatedSortedAndCountedMap.get(key) as number) - 1);
                                } else {
                                    expect(value).to.be.equal(updatedSortedAndCountedMap.get(key));
                                }
                            });
                            if (baseSortedAndCountedMap.has(emptyField)) {
                                expect(updatedSortedAndCountedMap.get(createdField)).to.be.equal(
                                    (baseSortedAndCountedMap.get(createdField) as number) + 1,
                                );
                            }
                        });
                        //#endregion Update to empty

                        //#region Clean Up
                        it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
                            baseSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
                                allActivitiesFieldName,
                            );
                            baseSortedAndCountedMap.forEach((value /*, key*/) => {
                                //console.log(`baseSortedAndCountedMap[${key}] = ${value}`);
                                expect(value).to.be.above(0);
                            });
                        });

                        it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
                            updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
                                allActivitiesFieldName,
                            );
                            updatedSortedAndCountedMap.forEach((value /*, key*/) => {
                                //console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
                                expect(value).to.be.above(0);
                            });
                        });

                        it(`Clean Up The New Transaction With ${allActivitiesFieldName}`, async () => {
                            debugger;
                            const isAccountDeleted = await objectsService.deleteTransaction(transactionInternalID);
                            expect(isAccountDeleted).to.be.true;

                            debugger;
                            const getDeletedAccount = await objectsService.getTransactionByID(transactionInternalID);
                            expect(getDeletedAccount[0].Hidden).to.be.true;
                        });

                        it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
                            updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
                                allActivitiesFieldName,
                            );
                            updatedSortedAndCountedMap.forEach((value /*, key*/) => {
                                //console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
                                expect(value).to.be.above(0);
                            });
                        });

                        it(`Compare The Counts From Totals ${allActivitiesFieldName}`, async () => {
                            baseSortedAndCountedMap.forEach((value, key) => {
                                if (key == emptyField) {
                                    expect(value).to.be.equal((updatedSortedAndCountedMap.get(key) as number) - 1);
                                } else {
                                    expect(value).to.be.equal(updatedSortedAndCountedMap.get(key));
                                }
                            });
                            if (baseSortedAndCountedMap.has(emptyField)) {
                                expect(updatedSortedAndCountedMap.get(createdField)).to.be.equal(
                                    (baseSortedAndCountedMap.get(createdField) as number) + 1,
                                );
                            }
                        });

                        if (allActivitiesFieldName.includes('.')) {
                            it(`Clean Up The New ${allActivitiesFieldName.split('.')[0]} With ${allActivitiesFieldName.split('.')[1]
                                }`, async () => {
                                    if (allActivitiesFieldName.split('.')[0] != 'Account') {
                                        throw new Error('NotImplementedException');
                                    }
                                    debugger;
                                    const isAccountDeleted = await objectsService.deleteAccount(accountInternalID);
                                    expect(isAccountDeleted).to.be.true;

                                    debugger;
                                    const getDeletedAccount = await objectsService.getAccountByID(accountInternalID);
                                    expect(getDeletedAccount[0].Hidden).to.be.true;
                                });
                        }
                        //#endregion Clean Up

                        //Done 1 (create)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
                        //Done 2 (create) *Only for cases where internal object created	API call POST: https://papi.staging.pepperi.com/V1.0/accounts (With Account.City from test data – city 1234)	Response Code 201
                        //Done 3 (create)	API call POST: https://papi.staging.pepperi.com/V1.0/transactions (With the new Account)	Response Code 201
                        //Done 4 (create)	API call: https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
                        //?? 5 (create)	Compare The Counts From Totals Account.City (1), with the counts from Totals Account.City (4)	Is +1
                        //Maybe 6 (update)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
                        //Maybe 7 (update)	API call POST: https://papi.staging.pepperi.com/V1.0/accounts (With Account.City as the first existing)	Response Code 200
                        //Maybe 8 (update)	API call GET: https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
                        //Maybe 9 (update)	Compare The Counts From Totals Account.City (6), with the counts from Totals Account.City (8)	Is +1 and Is -1
                        // Maybe 2 10 (Update to empty)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
                        // Maybe 2 11 (Update to empty)	API call POST: https://papi.staging.pepperi.com/V1.0/accounts (With Account.City as empty string or null if possible)	Response Code 200
                        // Maybe 2 12 (Update to empty)	API call GET: https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
                        // Maybe 2 13 (Update to empty)	Compare The Counts From Totals Account.City (10), with the counts from Totals Account.City (12)	Is +1 and Is -1
                        // Maybe 3 14 (clean up)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)	Count > 0
                        // 15 (clean up)	API call DELETE: https://papi.staging.pepperi.com/V1.0/transactions  (Clean the test transaction and restore previous condition)	Response Code 200
                        // 16 (clean up)	API call GET:   https://papi.staging.pepperi.com/V1.0/elasticsearch/all_activities?where=InternalID=86411390	Body = []
                        // 17 (clean up)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)	Count > 0
                        // 18 (clean up)	Compare The Counts From Totals Account.City (14), with the counts from Totals Account.City (16)	Is -1
                        //Skipped after meeting with Ido 19 (clean up) *Only for Transaction Lines	API call DELETE: https://papi.staging.pepperi.com/V1.0/transactions_lines (Clean the test transaction_lines and restore previous condition)	Response Code 200
                        //Skipped after meeting with Ido 20 (clean up) *Only for Transaction Lines	API call GET:   https://papi.staging.pepperi.com/V1.0/transaction_lines/813929257	Hidden = true
                        // Maybe 3 21 (clean up)*Only for cases where internal object created	API call DELETE: https://papi.staging.pepperi.com/V1.0/accounts	Response Code 200
                        // Maybe 3 22 (clean up) *Only for cases where internal object created	API call GET: https://papi.staging.pepperi.com/V1.0/accounts/20520635	Hidden = true
                    });
                }
            });
        });

        // describe('Transaction Lines', () => {
        //     it(`Test Data: Amount of Transaction Lines: ${transactionLinesArr.length}`, () => {
        //         expect(transactionLinesArr.length).to.be.above(0);
        //     });
        //     describe('Create Index of Fields', () => {
        //         for (let index = 0; index < transaction_lines_fields.length; index++) {
        //             const transactionLinesIndexFieldName = transaction_lines_fields[index];
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
