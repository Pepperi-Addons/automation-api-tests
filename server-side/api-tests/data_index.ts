//import { ObjectsService } from './../services/objects.service';
//import { ElasticSearchService } from './../services/elastic-search.service';
import { DataIndexService } from './../services/data-index.service';

import GeneralService, { TesterFunctions } from '../services/general.service';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

export async function DataIndexTests(generalService: GeneralService, tester: TesterFunctions) {
    //const elasticSearchService = new ElasticSearchService(generalService.papiClient);
    //const objectsService = new ObjectsService(generalService);
    const dataIndexService = new DataIndexService(generalService);

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    // const transactionLinesIndexFieldsArr = [
    //     'InternalID',
    //     'UUID',
    //     'LineNumber',
    //     'DeliveryDate',
    //     'Archive',
    //     'UnitsQuantity',
    //     'UnitDiscountPercentage',
    //     'TSATestIndexString',
    //     'TSATestIndexTime',
    //     'TSATestIndexCalculated',
    //     'TSATestIndexNumber',
    //     'TSATestIndexDecimalNumber',
    //     'Item.InternalID',
    //     'Item.Name',
    //     'Transaction.InternalID',
    //     'Transaction.Status',
    //     'Transaction.ActionDateTime',
    //     'Transaction.ActivityTypeID',
    //     'Transaction.Account.InternalID',
    //     'Transaction.Account.ExternalID',
    //     'Transaction.Account.TSAPaymentMethod',
    //     'Transaction.Account.ZipCode',
    //     'Transaction.Account.Status',
    //     'Transaction.ContactPerson.ExternalID',
    //     'Transaction.ContactPerson.FirstName',
    //     'Transaction.ContactPerson.Mobile',
    //     'Transaction.Agent.ExternalID',
    //     'Transaction.Agent.FirstName',
    //     'Transaction.Agent.Mobile',
    // ];

    const allActivitiesIndexFieldsArr = [
        // 'InternalID',
        // 'Status',
        // 'UUID',
        // 'ActionDateTime',
        // 'ActivityTypeID',
        // 'ExternalID',
        // 'Archive',
        // 'BillToCity',
        // 'BillToCountry',
        // 'BillToFax',
        // 'Type',
        // 'TaxPercentage',
        // 'TSATestIndexString',
        // 'TSATestIndexTime',
        // 'TSATestIndexCalculated',
        // 'TSATestIndexAttachment',
        // 'TSATestIndexNumber',
        // 'TSATestIndexDecimalNumber',
        // 'Account.InternalID',
        // 'Account.ExternalID',
        'Account.City',
        // 'Account.Country',
        // 'Account.Status',
        // 'Catalog.InternalID',
        // 'Catalog.ExternalID',
        // 'Catalog.Description',
        // 'Catalog.TSAImage',
        // 'ContactPerson.InternalID',
        // 'ContactPerson.ExternalID',
        // 'ContactPerson.FirstName',
        // 'ContactPerson.Mobile',
        // 'Creator.InternalID',
        // 'Creator.ExternalID',
        // 'Creator.FirstName',
        // 'Creator.Mobile',
    ];

    const allActivitiesArr = await generalService.getAllActivities({
        page_size: -1,
        fields: ['InternalID', ...allActivitiesIndexFieldsArr],
    });

    describe('Data Index Tests Suites', () => {
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
                                testDataAccount = await dataIndexService.apiCallWithFetch('POST', '/accounts', {
                                    ExternalID: 'oren test 11111',
                                    City: 'oren city',
                                });
                                expect(testDataAccount.Status).to.equal(201);
                            });
                        }

                        it(`Create Transaction With The New ${allActivitiesIndexFieldsArrName}`, async () => {
                            const testDataTransaction = await dataIndexService.apiCallWithFetch(
                                'POST',
                                '/transactions',
                                {
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
                                },
                            );
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
