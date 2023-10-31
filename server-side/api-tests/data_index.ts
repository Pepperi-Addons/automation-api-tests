// import { ObjectsService } from './../services/objects.service';
import { DataIndexService } from './../services/data-index.service';
import GeneralService, { TesterFunctions } from '../services/general.service';
// import { ObjectsService } from '../services/objects.service';
// import { ElasticSearchService } from '../services/elastic-search.service';

export async function DataIndexTests(generalService: GeneralService, request, tester: TesterFunctions) {
    // const objectsService = new ObjectsService(generalService);
    const dataIndexService = new DataIndexService(generalService);

    // const _MAX_LOOPS = 10;
    // const _INTERVAL_TIMER = 5000;

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    // const all_activities_fields = [
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
    // 'Account.City',
    // 'Account.UUID'
    // 'Account.Country',
    // 'Account.Status',
    // 'Account.Parent.City',
    // 'Catalog.Description',
    // 'Catalog.ExternalID',
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
    // ];

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

    // const uiDataObject = {
    //     all_activities_fields: [
    //         'ExternalID',
    //         'TaxPercentage',
    //         'Remark',
    //         'CreationDateTime',
    //         'SubTotal',
    //         'Status',
    //         'DiscountPercentage',
    //         // 'TSATestIndexString',
    //         // 'TSATestIndexTime',
    //         // 'TSATestIndexCalculated',
    //         // 'TSATestIndexAttachment',
    //         // 'TSATestIndexNumber',
    //         // 'TSATestIndexDecimalNumber',
    //         'Account.ExternalID',
    //         'Account.City',
    //         'Account.Country',
    //         'Account.Status',
    //         'Account.Parent.City',
    //         'Catalog.Description',
    //         'Catalog.ExternalID',
    //         // 'Catalog.TSAImage',
    //         'ContactPerson.ExternalID',
    //         'ContactPerson.FirstName',
    //         'ContactPerson.Mobile',
    //         'Creator.ExternalID',
    //         'Creator.FirstName',
    //         'Creator.Mobile',
    //         'Agent.ExternalID',
    //         'Agent.FirstName',
    //         'Agent.Mobile',
    //         'OriginAccount.ExternalID',
    //         'OriginAccount.City',
    //         'OriginAccount.Status',
    //         'AdditionalAccount.ExternalID',
    //         'AdditionalAccount.City',
    //         'AdditionalAccount.Status',
    //     ],
    //     transaction_lines_fields: [
    //         // 'TSATestIndexString',
    //         // 'TSATestIndexTime',
    //         // 'TSATestIndexCalculated',
    //         // 'TSATestIndexNumber',
    //         // 'TSATestIndexDecimalNumber',
    //         'LineNumber',
    //         'DeliveryDate',
    //         'TotalUnitsPriceAfterDiscount',
    //         'TotalUnitsPriceBeforeDiscount',
    //         'Item.ExternalID',
    //         'Item.Name',
    //         'UnitDiscountPercentage',
    //         'CreationDateTime',
    //         'Transaction.ExternalID',
    //         'Transaction.InternalID',
    //         'Transaction.Remark',
    //         'Transaction.CreationDateTime',
    //         'Transaction.SubTotal',
    //         'Transaction.Status',
    //         'Transaction.DiscountPercentage',
    //         'Transaction.Account.ExternalID',
    //         // 'Transaction.Account.TSAPaymentMethod',
    //         'Transaction.Account.ZipCode',
    //         'Transaction.Account.Status',
    //         'Transaction.Account.City',
    //         'Transaction.Account.Parent.City',
    //         'Transaction.Agent.ExternalID',
    //         'Transaction.Agent.FirstName',
    //         'Transaction.Agent.Mobile',
    //         'Transaction.ContactPerson.ExternalID',
    //         'Transaction.ContactPerson.FirstName',
    //         'Transaction.ContactPerson.Mobile',
    //         'Transaction.OriginAccount.ExternalID',
    //         'Transaction.OriginAccount.City',
    //         'Transaction.OriginAccount.Status',
    //         'Transaction.AdditionalAccount.ExternalID',
    //         'Transaction.AdditionalAccount.City',
    //         'Transaction.AdditionalAccount.Status',
    //     ],
    // };

    const uiDataObject = {
        all_activities_fields: [
            { fieldID: 'ExternalID', type: 'String' },
            { fieldID: 'TaxPercentage', type: 'Double' },
            { fieldID: 'Remark', type: 'String' },
            { fieldID: 'CreationDateTime', type: 'DateTime' },
            { fieldID: 'SubTotal', type: 'Double' },
            { fieldID: 'Status', type: 'Integer' },
            { fieldID: 'DiscountPercentage', type: 'Double' },
            // {'fieldID':'TSATestIndexString','type':'String'},
            // {'fieldID':'TSATestIndexTime','type':'DateTime'},
            // {'fieldID':'TSATestIndexCalculated','type':'Integer'},
            // {'fieldID':'TSATestIndexAttachment','type':'String'},
            // {'fieldID':'TSATestIndexNumber','type':'Integer'},
            // {'fieldID':'TSATestIndexDecimalNumber','type':'Double'},
            { fieldID: 'Account.ExternalID', type: 'String' },
            { fieldID: 'Account.City', type: 'String' },
            { fieldID: 'Account.UUID', type: 'String' },
            { fieldID: 'Account.Country', type: 'String' },
            { fieldID: 'Account.Status', type: 'Integer' },
            { fieldID: 'Account.Parent.City', type: 'String' },
            { fieldID: 'Catalog.Description', type: 'String' },
            { fieldID: 'Catalog.ExternalID', type: 'String' },
            // {'fieldID':'Catalog.TSAImage','type':'String'},
            { fieldID: 'ContactPerson.ExternalID', type: 'String' },
            { fieldID: 'ContactPerson.FirstName', type: 'String' },
            { fieldID: 'ContactPerson.Mobile', type: 'String' },
            { fieldID: 'Creator.ExternalID', type: 'String' },
            { fieldID: 'Creator.FirstName', type: 'String' },
            { fieldID: 'Creator.Mobile', type: 'String' },
            { fieldID: 'Agent.ExternalID', type: 'String' },
            { fieldID: 'Agent.FirstName', type: 'String' },
            { fieldID: 'Agent.Mobile', type: 'String' },
            { fieldID: 'OriginAccount.ExternalID', type: 'String' },
            { fieldID: 'OriginAccount.City', type: 'String' },
            { fieldID: 'OriginAccount.Status', type: 'Integer' },
            { fieldID: 'AdditionalAccount.ExternalID', type: 'String' },
            { fieldID: 'AdditionalAccount.City', type: 'String' },
            { fieldID: 'AdditionalAccount.Status', type: 'Integer' },
        ],
        transaction_lines_fields: [
            // {'fieldID':'TSATestIndexString','type':'String'},
            // {'fieldID':'TSATestIndexTime','type':'DateTime'},
            // {'fieldID':'TSATestIndexCalculated','type':'Integer'},
            // {'fieldID':'TSATestIndexNumber','type':'Integer'},
            // {'fieldID':'TSATestIndexDecimalNumber','type':'Double'},
            { fieldID: 'LineNumber', type: 'Integer' },
            { fieldID: 'DeliveryDate', type: 'DateTime' },
            { fieldID: 'TotalUnitsPriceAfterDiscount', type: 'Double' },
            { fieldID: 'TotalUnitsPriceBeforeDiscount', type: 'Double' },
            { fieldID: 'Item.ExternalID', type: 'String' },
            { fieldID: 'Item.Name', type: 'String' },
            { fieldID: 'UnitDiscountPercentage', type: 'Double' },
            { fieldID: 'CreationDateTime', type: 'DateTime' },
            { fieldID: 'Transaction.ExternalID', type: 'String' },
            { fieldID: 'Transaction.InternalID', type: 'Integer' },
            { fieldID: 'Transaction.Remark', type: 'String' },
            { fieldID: 'Transaction.CreationDateTime', type: 'DateTime' },
            { fieldID: 'Transaction.SubTotal', type: 'Double' },
            { fieldID: 'Transaction.Status', type: 'Integer' },
            { fieldID: 'Transaction.DiscountPercentage', type: 'Double' },
            { fieldID: 'Transaction.Account.ExternalID', type: 'String' },
            { fieldID: 'Transaction.Account.UUID', type: 'String' },
            // {'fieldID':'Transaction.Account.TSAPaymentMethod','type':'String'},
            { fieldID: 'Transaction.Account.ZipCode', type: 'String' },
            { fieldID: 'Transaction.Account.Status', type: 'Integer' },
            { fieldID: 'Transaction.Account.City', type: 'String' },
            { fieldID: 'Transaction.Account.Parent.City', type: 'String' },
            { fieldID: 'Transaction.Agent.ExternalID', type: 'String' },
            { fieldID: 'Transaction.Agent.FirstName', type: 'String' },
            { fieldID: 'Transaction.Agent.Mobile', type: 'String' },
            { fieldID: 'Transaction.ContactPerson.ExternalID', type: 'String' },
            { fieldID: 'Transaction.ContactPerson.FirstName', type: 'String' },
            { fieldID: 'Transaction.ContactPerson.Mobile', type: 'String' },
            { fieldID: 'Transaction.OriginAccount.ExternalID', type: 'String' },
            { fieldID: 'Transaction.OriginAccount.City', type: 'String' },
            { fieldID: 'Transaction.OriginAccount.Status', type: 'Integer' },
            { fieldID: 'Transaction.AdditionalAccount.ExternalID', type: 'String' },
            { fieldID: 'Transaction.AdditionalAccount.City', type: 'String' },
            { fieldID: 'Transaction.AdditionalAccount.Status', type: 'Integer' },
        ],
    };

    const all_activities_fields_to_test_response = [
        'ExternalID',
        'TaxPercentage',
        'Remark',
        'CreationDateTime',
        'SubTotal',
        'Status',
        'DiscountPercentage',
        // 'TSATestIndexString',
        // 'TSATestIndexTime',
        // 'TSATestIndexCalculated',
        // 'TSATestIndexAttachment',
        // 'TSATestIndexNumber',
        // 'TSATestIndexDecimalNumber',
        'Account.ExternalID',
        'Account.City',
        'Account.Country',
        'Account.Status',
        'Account.Parent.City',
        'Catalog.Description',
        'Catalog.ExternalID',
        // 'Catalog.TSAImage',
        'ContactPerson.ExternalID',
        'ContactPerson.FirstName',
        'ContactPerson.Mobile',
        'Creator.ExternalID',
        'Creator.FirstName',
        'Creator.Mobile',
        'Agent.ExternalID',
        'Agent.FirstName',
        'Agent.Mobile',
        'OriginAccount.ExternalID',
        'OriginAccount.City',
        'OriginAccount.Status',
        'AdditionalAccount.ExternalID',
        'AdditionalAccount.City',
        'AdditionalAccount.Status',
    ];

    const transaction_lines_fields_to_test_response = [
        // 'TSATestIndexString',
        // 'TSATestIndexTime',
        // 'TSATestIndexCalculated',
        // 'TSATestIndexNumber',
        // 'TSATestIndexDecimalNumber',
        'LineNumber',
        'DeliveryDate',
        'TotalUnitsPriceAfterDiscount',
        'TotalUnitsPriceBeforeDiscount',
        'Item.ExternalID',
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
        // 'Transaction.Account.TSAPaymentMethod',
        'Transaction.Account.ZipCode',
        'Transaction.Account.Status',
        'Transaction.Account.City',
        'Transaction.Account.Parent.City',
        'Transaction.Agent.ExternalID',
        'Transaction.Agent.FirstName',
        'Transaction.Agent.Mobile',
        'Transaction.ContactPerson.ExternalID',
        'Transaction.ContactPerson.FirstName',
        'Transaction.ContactPerson.Mobile',
        'Transaction.OriginAccount.ExternalID',
        'Transaction.OriginAccount.City',
        'Transaction.OriginAccount.Status',
        'Transaction.AdditionalAccount.ExternalID',
        'Transaction.AdditionalAccount.City',
        'Transaction.AdditionalAccount.Status',
    ];

    //#region Upgrade Data Index
    const testData = {
        'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', ''],
        'Activity Data Index': ['10979a11-d7f4-41df-8993-f06bfd778304', ''],
        Logs: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', ''],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Notification Service': ['00000000-0000-0000-0000-000000040fa9', ''],
    };
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    //debugger;
    //#endregion Upgrade Data Index

    // var date = new Date();
    // date.setMonth(date.getMonth() - 4);
    // const dateToCleanFrom = date.toISOString().split('.')[0] + 'Z';
    // const accountArr = await objectsService.getAccounts({ where: `CreationDate>'${dateToCleanFrom}'` });
    // describe('Clean Accounts', () => {
    //     for (let index = 0; index < accountArr.length; index++) {
    //         it(`Clean Account: ${accountArr[index].ExternalID}`, async () => {
    //             const isAccountDeleted = await objectsService.deleteAccount(accountArr[index].InternalID as number);
    //             expect(isAccountDeleted).to.be.true;
    //         })
    //     }
    // })

    // const transactionArr = await objectsService.getTransaction({ where: `CreationDateTime>'${dateToCleanFrom}'` });
    // describe('Clean Transactions', () => {
    //     for (let index = 0; index < transactionArr.length; index++) {
    //         it(`Clean Transaction: ${transactionArr[index].ExternalID}`, async () => {
    //             const isTransactionDeleted = await objectsService.deleteTransaction(transactionArr[index].InternalID as number);
    //             expect(isTransactionDeleted).to.be.true;
    //         })
    //     }
    // })

    describe('Data Index Tests Suites', () => {
        describe('Prerequisites Addon for Data Index Tests', () => {
            //Test Datas
            //Data Index, Pepperi Notification Service
            isInstalledArr.forEach((isInstalled, index) => {
                it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
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

        describe('Export', () => {
            it('Clean Data Index', async () => {
                // debugger;
                const auditLogCreate = await dataIndexService.cleanDataIndex();
                expect(auditLogCreate).to.have.property('URI');

                const auditLogResponse = await generalService.getAuditLogResultObjectIfValid(auditLogCreate.URI, 40);
                expect(auditLogResponse.Status?.ID).to.be.equal(1);

                const exportResponse = JSON.parse(auditLogResponse.AuditInfo.ResultObject);
                expect(exportResponse.success).to.be.true;
                // expect(exportResponse.resultObject.Message).to.include('Clear index successfully on ElasticSearch');
            });

            it('Post Fields To Export', async () => {
                // debugger;
                const auditLogCreate = await dataIndexService.exportDataToDataIndex(uiDataObject);
                expect(auditLogCreate).to.have.property('URI');

                const auditLogResponse = await generalService.getAuditLogResultObjectIfValid(auditLogCreate.URI, 40);
                generalService.sleep(2000);
                expect(auditLogResponse.Status?.ID).to.be.equal(1);

                const postFieldsResponse = await JSON.parse(auditLogResponse.AuditInfo.ResultObject);
                expect(postFieldsResponse.CreationDateTime).to.include('Z');
                expect(postFieldsResponse.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(postFieldsResponse.ModificationDateTime).to.include('Z');
                //expect(postFieldsResponse.FullPublish).to.be.false;
                expect(postFieldsResponse.Hidden).to.be.false;
                expect(postFieldsResponse.Key).to.be.equal('meta_data');
                //expect(postFieldsResponse.RunDateTime).to.be.null;
                expect(postFieldsResponse.RunTime).to.be.null;
                expect(postFieldsResponse.all_activities_fields).to.include.members(
                    all_activities_fields_to_test_response,
                );
                expect(postFieldsResponse.transaction_lines_fields).to.include.members(
                    transaction_lines_fields_to_test_response,
                );
            });

            it('All Activities Rebuild', async () => {
                // debugger;
                generalService.sleep(4000);
                const auditLogCreate = await dataIndexService.rebuildAllActivities();
                expect(auditLogCreate).to.have.property('URI');

                const auditLogResponse = await generalService.getAuditLogResultObjectIfValid(auditLogCreate.URI, 40);
                expect(auditLogResponse.Status?.ID).to.be.equal(1);

                const rebuildResponse = await JSON.parse(auditLogResponse.AuditInfo.ResultObject);
                expect(rebuildResponse.success).to.be.true;
            });

            it('All Activities Polling', async () => {
                // debugger;
                let pollingResponse;
                let maxLoopsCounter = 90;
                do {
                    generalService.sleep(2000);
                    const auditLogCreate = await dataIndexService.pollAllActivities();
                    expect(auditLogCreate).to.have.property('URI');

                    const auditLogResponse = await generalService.getAuditLogResultObjectIfValid(
                        auditLogCreate.URI,
                        40,
                    );
                    expect(auditLogResponse.Status?.ID).to.be.equal(1);
                    pollingResponse = await JSON.parse(auditLogResponse.AuditInfo.ResultObject);
                    maxLoopsCounter--;
                } while (
                    (pollingResponse.Status == 'InProgress' || pollingResponse.Status == '') &&
                    maxLoopsCounter > 0
                );
                // debugger;
                expect(pollingResponse.FieldsToExport).to.include.members(all_activities_fields_to_test_response);
                expect(pollingResponse.Message).to.equal('');
                expect(pollingResponse.Status).to.equal('Success');
            });

            it('Transaction Lines Rebuild', async () => {
                // debugger;
                generalService.sleep(4000);
                const auditLogCreate = await dataIndexService.rebuildTransactionLines();
                expect(auditLogCreate).to.have.property('URI');

                const auditLogResponse = await generalService.getAuditLogResultObjectIfValid(auditLogCreate.URI, 40);
                expect(auditLogResponse.Status?.ID).to.be.equal(1);

                const rebuildResponse = await JSON.parse(auditLogResponse.AuditInfo.ResultObject);
                expect(rebuildResponse.success).to.be.true;
            });

            it('Transaction Lines Polling', async () => {
                // debugger;
                let pollingResponse;
                let maxLoopsCounter = 90;
                do {
                    generalService.sleep(2000);
                    const auditLogCreate = await dataIndexService.pollTransactionLines();
                    expect(auditLogCreate).to.have.property('URI');
                    const auditLogResponse = await generalService.getAuditLogResultObjectIfValid(
                        auditLogCreate.URI,
                        40,
                    );
                    expect(auditLogResponse.Status?.ID).to.be.equal(1);
                    pollingResponse = await JSON.parse(auditLogResponse.AuditInfo.ResultObject);
                    maxLoopsCounter--;
                } while (
                    (pollingResponse.Status == 'InProgress' || pollingResponse.Status == '') &&
                    maxLoopsCounter > 0
                );
                expect(pollingResponse.FieldsToExport).to.include.members(transaction_lines_fields_to_test_response);
                expect(pollingResponse.Message).to.equal('');
                expect(pollingResponse.Status).to.equal('Success');
            });
        });

        describe('Bug Verification', () => {
            // it('DI-25539 bug verification', async () => {
            //     // debugger;
            //     //1. create transaction with remark
            //     const objectsService = new ObjectsService(generalService);
            //     const atdArr = await objectsService.getATD('transactions');
            //     debugger;
            //     const transactionAccount = await objectsService.getAccounts({ page_size: 1 }).then((res) => {
            //         return res[0];
            //     });
            //     const transactionExternalID =
            //         'Automated API Transaction ' + Math.floor(Math.random() * 1000000).toString();
            //     const firstRemark = generalService.generateRandomString(6);
            //     const catalogArr = await generalService.getCatalogs();
            //     const createdTransaction = await objectsService.createTransaction({
            //         ExternalID: transactionExternalID,
            //         ActivityTypeID: atdArr[0].TypeID,
            //         Remark: firstRemark,
            //         Status: 1,
            //         Account: {
            //             Data: {
            //                 InternalID: transactionAccount.InternalID,
            //             },
            //         },
            //         Catalog: {
            //             Data: {
            //                 ExternalID: catalogArr[0].ExternalID,
            //             },
            //         },
            //     });
            //     const getCreatedTransactionResponse = await objectsService.getTransaction({
            //         where: `InternalID=${createdTransaction.InternalID}`,
            //     });
            //     expect(getCreatedTransactionResponse[0]).to.include({
            //         ExternalID: transactionExternalID,
            //         ActivityTypeID: atdArr[0].TypeID,
            //         Status: 1,
            //     });
            //     expect(JSON.stringify(getCreatedTransactionResponse[0].Account)).equals(
            //         JSON.stringify({
            //             Data: {
            //                 InternalID: transactionAccount.InternalID,
            //                 UUID: transactionAccount.UUID,
            //                 ExternalID: transactionAccount.ExternalID,
            //             },
            //             URI: '/accounts/' + transactionAccount.InternalID,
            //         }),
            //     );
            //     expect(getCreatedTransactionResponse[0].InternalID).to.equal(createdTransaction.InternalID),
            //         expect(getCreatedTransactionResponse[0].Remark).to.equal(firstRemark),
            //         expect(getCreatedTransactionResponse[0].UUID).to.include(createdTransaction.UUID),
            //         expect(getCreatedTransactionResponse[0].CreationDateTime).to.contain(
            //             new Date().toISOString().split('T')[0],
            //         );
            //     expect(getCreatedTransactionResponse[0].CreationDateTime).to.contain('Z'),
            //         expect(getCreatedTransactionResponse[0].ModificationDateTime).to.contain(
            //             new Date().toISOString().split('T')[0],
            //         );
            //     expect(getCreatedTransactionResponse[0].ModificationDateTime).to.contain('Z'),
            //         expect(getCreatedTransactionResponse[0].Archive).to.be.false,
            //         expect(getCreatedTransactionResponse[0].Hidden).to.be.false,
            //         expect(getCreatedTransactionResponse[0].StatusName).to.include('InCreation'),
            //         expect(getCreatedTransactionResponse[0].Agent).to.be.null,
            //         expect(getCreatedTransactionResponse[0].ContactPerson).to.be.null,
            //         expect(getCreatedTransactionResponse[0].Creator).to.be.null,
            //         expect(getCreatedTransactionResponse[0].OriginAccount).to.be.null,
            //         expect(getCreatedTransactionResponse[0].TransactionLines).to.include({
            //             URI: '/transaction_lines?where=TransactionInternalID=' + createdTransaction.InternalID,
            //         });
            //     debugger;
            //     //2. see we can get the data using data index transaction AND transaction-line
            //     const elasticSearchService = new ElasticSearchService(generalService);
            //     try {
            //         const getWhereData = await elasticSearchService.whereClause(
            //             'Remark',
            //             'Remark=' + firstRemark,
            //         );
            //     }catch(error){
            //         debugger;
            //     }
            //     debugger;
            //     //3. change the remark
            //     //4. see it returns correctly on both transaction and transaction-line
            // });
            // describe('CRUD Index of Fields', () => {
            //     for (let index = 0; index < all_activities_fields.length; index++) {
            //         const allActivitiesFieldName = all_activities_fields[index];
            //         //Test Data
            //         const testDataAccountExternalID: string =
            //             'Test Data Account - Data Index Test ' + Math.floor(Math.random() * 1000000).toString();
            //         const testDataTransactionExternalID: string =
            //             'Test Data Transaction - Data Index Test ' + Math.floor(Math.random() * 1000000).toString();
            //         describe(allActivitiesFieldName, () => {
            //             let createdField: any;
            //             let existedField: any;
            //             let emptyField: any;
            //             let activityTypeID: number;
            //             let createdAccountInternalID: number;
            //             let existedAccountInternalID: number;
            //             let createdTransactionInternalID: number;
            //             let catalogInternalID: number;
            //             let baseSortedAndCountedMap: Map<string, number> = new Map();
            //             let updatedSortedAndCountedMap: Map<string, number> = new Map();
            //             describe('Create', () => {
            //                 it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                     // debugger;
            //                     baseSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                         allActivitiesFieldName,
            //                     );
            //                     // debugger;
            //                     baseSortedAndCountedMap.forEach((value) => {
            //                         //, key) => {
            //                         //console.log(`baseSortedAndCountedMap[${key}] = ${value}`);
            //                         expect(value).to.be.above(0);
            //                     });
            //                 });
            //                 if (allActivitiesFieldName.includes('.')) {
            //                     it(`Create ${allActivitiesFieldName.split('.')[0]} With New ${
            //                         allActivitiesFieldName.split('.')[1]
            //                     }`, async () => {
            //                         if (allActivitiesFieldName.split('.')[0] != 'Account') {
            //                             throw new Error(
            //                                 `NotImplementedException - Reference Type: ${
            //                                     allActivitiesFieldName.split('.')[0]
            //                                 }`,
            //                             );
            //                         }
            //                         createdField = dataIndexService.createTestDataForField(
            //                             allActivitiesFieldName.split('.')[1],
            //                         );
            //                         const createAccountResponse = await generalService.fetchStatus('/accounts', {
            //                             method: 'POST',
            //                             body: JSON.stringify({
            //                                 Name: 'Data Index Tests',
            //                                 ExternalID: testDataAccountExternalID,
            //                                 [allActivitiesFieldName.split('.')[1]]: createdField,
            //                             }),
            //                         });
            //                         createdAccountInternalID = createAccountResponse.Body.InternalID;
            //                         expect(createAccountResponse.Status).to.equal(201);
            //                     });
            //                 }
            //                 it(`Create Transaction With The New ${allActivitiesFieldName}`, async () => {
            //                     // debugger;
            //                     const transactionArr = await objectsService.getTransaction({
            //                         where: `Type LIKE '%Sales Order%'`,
            //                         page_size: 1,
            //                     });
            //                     activityTypeID = transactionArr[0].ActivityTypeID as number;
            //                     const catalogsArr = await objectsService.getCatalogs({ page_size: 1 });
            //                     catalogInternalID = catalogsArr[0].InternalID;
            //                     if (!createdAccountInternalID) {
            //                         const accountsArr = await objectsService.getAccounts({ page_size: 1 });
            //                         createdAccountInternalID = accountsArr[0].InternalID as number;
            //                     }
            //                     if (!allActivitiesFieldName.includes('.')) {
            //                         createdField = dataIndexService.createTestDataForField(allActivitiesFieldName);
            //                     }
            //                     const testDataTransaction = await generalService.fetchStatus('/transactions', {
            //                         method: 'POST',
            //                         body: JSON.stringify({
            //                             ExternalID: testDataTransactionExternalID,
            //                             ActivityTypeID: activityTypeID,
            //                             [allActivitiesFieldName.includes('.')
            //                                 ? 'Test Data'
            //                                 : allActivitiesFieldName.split('.')[0]]: createdField,
            //                             Account: {
            //                                 Data: {
            //                                     InternalID: createdAccountInternalID,
            //                                 },
            //                             },
            //                             Catalog: {
            //                                 Data: {
            //                                     InternalID: catalogInternalID,
            //                                 },
            //                             },
            //                         }),
            //                     });
            //                     createdTransactionInternalID = testDataTransaction.Body.InternalID;
            //                     expect(testDataTransaction.Status).to.equal(201);
            //                 });
            //                 it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                     // debugger;
            //                     //try for 50 seconds to get the updated fields
            //                     let maxLoopsCounter = _MAX_LOOPS;
            //                     let isCreatedField = false;
            //                     do {
            //                         maxLoopsCounter--;
            //                         generalService.sleep(_INTERVAL_TIMER);
            //                         updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                             allActivitiesFieldName,
            //                         );
            //                         if (
            //                             updatedSortedAndCountedMap.has(createdField) &&
            //                             baseSortedAndCountedMap.has(createdField)
            //                         ) {
            //                             if (
            //                                 (updatedSortedAndCountedMap.get(createdField) as number) !=
            //                                 (baseSortedAndCountedMap.get(createdField) as number)
            //                             ) {
            //                                 isCreatedField = true;
            //                             }
            //                         } else if (updatedSortedAndCountedMap.has(createdField)) {
            //                             isCreatedField = true;
            //                         }
            //                         console.log({ updatedSortedAndCountedMap_Field_Created: isCreatedField });
            //                     } while (!isCreatedField && maxLoopsCounter > 0);
            //                     updatedSortedAndCountedMap.forEach((value, key) => {
            //                         console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
            //                         expect(value).to.be.above(0);
            //                     });
            //                     if (!isCreatedField) {
            //                         //Brake the next steps of the test if the updated field change failed
            //                         updatedSortedAndCountedMap = undefined as any;
            //                         throw new Error(
            //                             `updatedSortedAndCountedMap don't contain the field ${allActivitiesFieldName}: ${createdField}`,
            //                         );
            //                     }
            //                 });
            //                 it(`Compare The Counts From Totals ${allActivitiesFieldName}`, async () => {
            //                     baseSortedAndCountedMap.forEach((value, key) => {
            //                         if (key == createdField) {
            //                             expect(value).to.be.equal((updatedSortedAndCountedMap.get(key) as number) - 1);
            //                         } else {
            //                             expect(value).to.be.equal(updatedSortedAndCountedMap.get(key));
            //                         }
            //                     });
            //                     if (!baseSortedAndCountedMap.has(createdField)) {
            //                         expect(updatedSortedAndCountedMap.get(createdField)).to.be.equal(1);
            //                     }
            //                 });
            //             });
            //             describe('Update', () => {
            //                 it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                     // debugger;
            //                     baseSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                         allActivitiesFieldName,
            //                     );
            //                     baseSortedAndCountedMap.forEach((value) => {
            //                         //, key) => {
            //                         //console.log(`baseSortedAndCountedMap[${key}] = ${value}`);
            //                         expect(value).to.be.above(0);
            //                     });
            //                 });
            //                 if (allActivitiesFieldName.includes('.')) {
            //                     it(`Get Existed ${allActivitiesFieldName.split('.')[0]} With Existed ${
            //                         allActivitiesFieldName.split('.')[1]
            //                     }`, async () => {
            //                         if (allActivitiesFieldName.split('.')[0] != 'Account') {
            //                             throw new Error(
            //                                 `NotImplementedException - Reference Type: ${
            //                                     allActivitiesFieldName.split('.')[0]
            //                                 }`,
            //                             );
            //                         }
            //                         const accountsArr = await objectsService.getAccounts({
            //                             where: `${allActivitiesFieldName.split('.')[1]}!='' AND ${
            //                                 allActivitiesFieldName.split('.')[1]
            //                             }!='${createdField}'`,
            //                             page_size: 1,
            //                         });
            //                         existedAccountInternalID = accountsArr[0].InternalID as number;
            //                         existedField = accountsArr[0][allActivitiesFieldName.split('.')[1]];
            //                         expect(accountsArr.length).to.be.above(0);
            //                     });
            //                 }
            //                 it(`Update Transaction With Existed ${allActivitiesFieldName}`, async () => {
            //                     const testDataTransaction = await generalService.fetchStatus('/transactions', {
            //                         method: 'POST',
            //                         body: JSON.stringify({
            //                             InternalID: createdTransactionInternalID,
            //                             ExternalID: testDataTransactionExternalID,
            //                             ActivityTypeID: activityTypeID,
            //                             [allActivitiesFieldName.includes('.')
            //                                 ? 'Test Data'
            //                                 : allActivitiesFieldName.split('.')[0]]: createdField,
            //                             Account: {
            //                                 Data: {
            //                                     InternalID: existedAccountInternalID,
            //                                 },
            //                             },
            //                             Catalog: {
            //                                 Data: {
            //                                     InternalID: catalogInternalID,
            //                                 },
            //                             },
            //                         }),
            //                     });
            //                     expect(testDataTransaction.Status).to.equal(200);
            //                 });
            //                 it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                     // debugger;
            //                     //try for 50 seconds to get the updated fields
            //                     let maxLoopsCounter = _MAX_LOOPS;
            //                     let isExistedField = false;
            //                     do {
            //                         maxLoopsCounter--;
            //                         generalService.sleep(_INTERVAL_TIMER);
            //                         updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                             allActivitiesFieldName,
            //                         );
            //                         if (
            //                             updatedSortedAndCountedMap.has(existedField) &&
            //                             baseSortedAndCountedMap.has(existedField)
            //                         ) {
            //                             if (
            //                                 (updatedSortedAndCountedMap.get(existedField) as number) !=
            //                                 (baseSortedAndCountedMap.get(existedField) as number)
            //                             ) {
            //                                 isExistedField = true;
            //                             }
            //                         } else if (updatedSortedAndCountedMap.has(existedField)) {
            //                             isExistedField = true;
            //                         }
            //                         console.log({ updatedSortedAndCountedMap_Field_Existed: isExistedField });
            //                     } while (!isExistedField && maxLoopsCounter > 0);
            //                     updatedSortedAndCountedMap.forEach((value, key) => {
            //                         console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
            //                         expect(value).to.be.above(0);
            //                     });
            //                     if (!isExistedField) {
            //                         //Brake the next steps of the test if the updated field change failed
            //                         updatedSortedAndCountedMap = undefined as any;
            //                         throw new Error(
            //                             `updatedSortedAndCountedMap don't contain the field ${allActivitiesFieldName}: ${existedField}`,
            //                         );
            //                     }
            //                 });
            //                 it(`Compare The Counts From Totals ${allActivitiesFieldName}`, async () => {
            //                     baseSortedAndCountedMap.forEach((value, key) => {
            //                         if (key == existedField) {
            //                             expect(value).to.be.equal((updatedSortedAndCountedMap.get(key) as number) - 1);
            //                         } else if (key == createdField) {
            //                             if (updatedSortedAndCountedMap.has(key)) {
            //                                 expect(value).to.be.equal(
            //                                     (updatedSortedAndCountedMap.get(key) as number) + 1,
            //                                 );
            //                             }
            //                         } else {
            //                             expect(value).to.be.equal(updatedSortedAndCountedMap.get(key));
            //                         }
            //                     });
            //                     if (updatedSortedAndCountedMap.has(createdField)) {
            //                         expect(updatedSortedAndCountedMap.get(createdField)).to.be.equal(
            //                             (baseSortedAndCountedMap.get(createdField) as number) - 1,
            //                         );
            //                     }
            //                 });
            //             });
            //             describe('Update To Empty', () => {
            //                 it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                     baseSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                         allActivitiesFieldName,
            //                     );
            //                     baseSortedAndCountedMap.forEach((value) => {
            //                         //, key) => {
            //                         //console.log(`baseSortedAndCountedMap[${key}] = ${value}`);
            //                         expect(value).to.be.above(0);
            //                     });
            //                 });
            //                 if (allActivitiesFieldName.includes('.')) {
            //                     it(`Update The New ${allActivitiesFieldName.split('.')[0]} With Empty ${
            //                         allActivitiesFieldName.split('.')[1]
            //                     }`, async () => {
            //                         if (allActivitiesFieldName.split('.')[0] != 'Account') {
            //                             throw new Error(
            //                                 `NotImplementedException - Reference Type: ${
            //                                     allActivitiesFieldName.split('.')[0]
            //                                 }`,
            //                             );
            //                         }
            //                         const updateAccountResponse = await generalService.fetchStatus('/accounts', {
            //                             method: 'POST',
            //                             body: JSON.stringify({
            //                                 InternalID: createdAccountInternalID,
            //                                 [allActivitiesFieldName.split('.')[1]]: null,
            //                             }),
            //                         });
            //                         emptyField = updateAccountResponse.Body[allActivitiesFieldName.split('.')[1]];
            //                         expect(updateAccountResponse.Status).to.equal(200);
            //                     });
            //                 }
            //                 it(`Update Transaction To Empty ${allActivitiesFieldName}`, async () => {
            //                     const testDataTransaction = await generalService.fetchStatus('/transactions', {
            //                         method: 'POST',
            //                         body: JSON.stringify({
            //                             InternalID: createdTransactionInternalID,
            //                             ExternalID: testDataTransactionExternalID,
            //                             ActivityTypeID: activityTypeID,
            //                             Account: {
            //                                 Data: {
            //                                     InternalID: createdAccountInternalID,
            //                                 },
            //                             },
            //                             Catalog: {
            //                                 Data: {
            //                                     InternalID: catalogInternalID,
            //                                 },
            //                             },
            //                         }),
            //                     });
            //                     expect(testDataTransaction.Status).to.equal(200);
            //                 });
            //                 it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                     //try for 50 seconds to get the updated fields
            //                     let maxLoopsCounter = _MAX_LOOPS;
            //                     let isEmptyField = false;
            //                     do {
            //                         maxLoopsCounter--;
            //                         generalService.sleep(_INTERVAL_TIMER);
            //                         updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                             allActivitiesFieldName,
            //                         );
            //                         if (
            //                             updatedSortedAndCountedMap.has(emptyField) &&
            //                             baseSortedAndCountedMap.has(emptyField)
            //                         ) {
            //                             if (
            //                                 (updatedSortedAndCountedMap.get(emptyField) as number) !=
            //                                 (baseSortedAndCountedMap.get(emptyField) as number)
            //                             ) {
            //                                 isEmptyField = true;
            //                             }
            //                         } else if (updatedSortedAndCountedMap.has(emptyField)) {
            //                             isEmptyField = true;
            //                         }
            //                         console.log({ updatedSortedAndCountedMap_Field_Empty: isEmptyField });
            //                     } while (!isEmptyField && maxLoopsCounter > 0);
            //                     updatedSortedAndCountedMap.forEach((value, key) => {
            //                         console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
            //                         expect(value).to.be.above(0);
            //                     });
            //                     if (!isEmptyField) {
            //                         //Brake the next steps of the test if the updated field change failed
            //                         updatedSortedAndCountedMap = undefined as any;
            //                         throw new Error(
            //                             `updatedSortedAndCountedMap don't contain the field ${allActivitiesFieldName}: ${emptyField}`,
            //                         );
            //                     }
            //                 });
            //                 it(`Compare The Counts From Totals ${allActivitiesFieldName}`, async () => {
            //                     baseSortedAndCountedMap.forEach((value, key) => {
            //                         if (key == emptyField) {
            //                             expect(value).to.be.equal((updatedSortedAndCountedMap.get(key) as number) - 1);
            //                         } else if (key == existedField) {
            //                             if (updatedSortedAndCountedMap.has(key)) {
            //                                 expect(value).to.be.equal(
            //                                     (updatedSortedAndCountedMap.get(key) as number) + 1,
            //                                 );
            //                             }
            //                         } else {
            //                             expect(value).to.be.equal(updatedSortedAndCountedMap.get(key));
            //                         }
            //                     });
            //                     if (baseSortedAndCountedMap.has(emptyField)) {
            //                         expect(updatedSortedAndCountedMap.get(emptyField)).to.be.equal(
            //                             (baseSortedAndCountedMap.get(emptyField) as number) + 1,
            //                         );
            //                     }
            //                 });
            //             });
            //             describe('Delete', () => {
            //                 it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                     baseSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                         allActivitiesFieldName,
            //                     );
            //                     baseSortedAndCountedMap.forEach((value) => {
            //                         //, key) => {
            //                         //console.log(`baseSortedAndCountedMap[${key}] = ${value}`);
            //                         expect(value).to.be.above(0);
            //                     });
            //                 });
            //                 it(`Delete The New Transaction With ${allActivitiesFieldName}`, async () => {
            //                     const isTransactionDeleted = await objectsService.deleteTransaction(
            //                         createdTransactionInternalID,
            //                     );
            //                     expect(isTransactionDeleted).to.be.true;
            //                     const getDeletedTransaction = await objectsService.getTransactionByID(
            //                         createdTransactionInternalID,
            //                     );
            //                     expect(getDeletedTransaction.Hidden).to.be.true;
            //                 });
            //                 it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                     //try for 50 seconds to get the updated fields
            //                     let maxLoopsCounter = _MAX_LOOPS;
            //                     let isEmptyField = false;
            //                     do {
            //                         maxLoopsCounter--;
            //                         generalService.sleep(_INTERVAL_TIMER);
            //                         updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                             allActivitiesFieldName,
            //                         );
            //                         if (
            //                             updatedSortedAndCountedMap.has(emptyField) &&
            //                             baseSortedAndCountedMap.has(emptyField)
            //                         ) {
            //                             if (
            //                                 (updatedSortedAndCountedMap.get(emptyField) as number) !=
            //                                 (baseSortedAndCountedMap.get(emptyField) as number)
            //                             ) {
            //                                 isEmptyField = true;
            //                             }
            //                         } else if (!updatedSortedAndCountedMap.has(emptyField)) {
            //                             isEmptyField = true;
            //                         }
            //                         console.log({ updatedSortedAndCountedMap_Field_Empty: isEmptyField });
            //                     } while (!isEmptyField && maxLoopsCounter > 0);
            //                     updatedSortedAndCountedMap.forEach((value) => {
            //                         //, key) => {
            //                         //console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
            //                         expect(value).to.be.above(0);
            //                     });
            //                     if (!isEmptyField) {
            //                         //Brake the next steps of the test if the updated have empty but same as the base
            //                         updatedSortedAndCountedMap = undefined as any;
            //                         throw new Error(
            //                             `updatedSortedAndCountedMap and baseSortedAndCountedMap contain the same field ${allActivitiesFieldName}: ${emptyField}`,
            //                         );
            //                     }
            //                 });
            //                 it(`Compare The Counts From Totals ${allActivitiesFieldName}`, async () => {
            //                     updatedSortedAndCountedMap.forEach((value, key) => {
            //                         if (key == emptyField) {
            //                             expect(value).to.be.equal((baseSortedAndCountedMap.get(key) as number) - 1);
            //                         } else {
            //                             expect(value).to.be.equal(baseSortedAndCountedMap.get(key));
            //                         }
            //                     });
            //                     if (!updatedSortedAndCountedMap.has(emptyField)) {
            //                         expect(baseSortedAndCountedMap.get(emptyField)).to.equal(1);
            //                     }
            //                 });
            //             });
            //             describe('Clean UP', () => {
            //                 if (allActivitiesFieldName.includes('.')) {
            //                     it(`Clean Up The New ${allActivitiesFieldName.split('.')[0]} With ${
            //                         allActivitiesFieldName.split('.')[1]
            //                     }`, async () => {
            //                         if (allActivitiesFieldName.split('.')[0] != 'Account') {
            //                             throw new Error(
            //                                 `NotImplementedException - Reference Type: ${
            //                                     allActivitiesFieldName.split('.')[0]
            //                                 }`,
            //                             );
            //                         }
            //                         const isAccountDeleted = await objectsService.deleteAccount(
            //                             createdAccountInternalID,
            //                         );
            //                         expect(isAccountDeleted).to.be.true;
            //                         const getDeletedAccount = await objectsService.getAccountByID(
            //                             createdAccountInternalID,
            //                         );
            //                         expect(getDeletedAccount.Hidden).to.be.true;
            //                     });
            //                 }
            //             });
            //             //Done 1 (create)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
            //             //Done 2 (create) *Only for cases where internal object created	API call POST: https://papi.staging.pepperi.com/V1.0/accounts (With Account.City from test data – city 1234)	Response Code 201
            //             //Done 3 (create)	API call POST: https://papi.staging.pepperi.com/V1.0/transactions (With the new Account)	Response Code 201
            //             //Done 4 (create)	API call: https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
            //             //?? 5 (create)	Compare The Counts From Totals Account.City (1), with the counts from Totals Account.City (4)	Is +1
            //             //Maybe 6 (update)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
            //             //Maybe 7 (update)	API call POST: https://papi.staging.pepperi.com/V1.0/accounts (With Account.City as the first existed)	Response Code 200
            //             //Maybe 8 (update)	API call GET: https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
            //             //Maybe 9 (update)	Compare The Counts From Totals Account.City (6), with the counts from Totals Account.City (8)	Is +1 and Is -1
            //             // Maybe 2 10 (Update to empty)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
            //             // Maybe 2 11 (Update to empty)	API call POST: https://papi.staging.pepperi.com/V1.0/accounts (With Account.City as empty string or null if possible)	Response Code 200
            //             // Maybe 2 12 (Update to empty)	API call GET: https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
            //             // Maybe 2 13 (Update to empty)	Compare The Counts From Totals Account.City (10), with the counts from Totals Account.City (12)	Is +1 and Is -1
            //             // Maybe 3 14 (clean up)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)	Count > 0
            //             // Maybe 3 15 (clean up)	API call DELETE: https://papi.staging.pepperi.com/V1.0/transactions  (Clean the test transaction and restore previous condition)	Response Code 200
            //             // Maybe 3 16 (clean up)	API call GET:   https://papi.staging.pepperi.com/V1.0/elasticsearch/all_activities?where=InternalID=86411390	Body = []
            //             // Maybe 3 17 (clean up)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)	Count > 0
            //             // Maybe 3 18 (clean up)	Compare The Counts From Totals Account.City (14), with the counts from Totals Account.City (16)	Is -1
            //             //Skipped after meeting with Ido 19 (clean up) *Only for Transaction Lines	API call DELETE: https://papi.staging.pepperi.com/V1.0/transactions_lines (Clean the test transaction_lines and restore previous condition)	Response Code 200
            //             //Skipped after meeting with Ido 20 (clean up) *Only for Transaction Lines	API call GET:   https://papi.staging.pepperi.com/V1.0/transaction_lines/813929257	Hidden = true
            //             // Maybe 3 21 (clean up)*Only for cases where internal object created	API call DELETE: https://papi.staging.pepperi.com/V1.0/accounts	Response Code 200
            //             // Maybe 3 22 (clean up) *Only for cases where internal object created	API call GET: https://papi.staging.pepperi.com/V1.0/accounts/20520635	Hidden = true
            //             //All Activities: 'SubTotal','Account.City',
            //             //Transaction Lines:'TotalUnitsPriceAfterDiscount', 'Transaction.Account.City
            //         });
            //     }
            // });
            // describe('CRUD Index of Objects', () => {
            //     for (let index = 0; index < all_activities_fields.length; index++) {
            //         const allActivitiesFieldName = all_activities_fields[index];
            //         //Test Data
            //         const testDataAccountExternalID: string =
            //             'Test Data Account - Data Index Test ' + Math.floor(Math.random() * 1000000).toString();
            //         const testDataTransactionExternalID: string =
            //             'Test Data Transaction - Data Index Test ' + Math.floor(Math.random() * 1000000).toString();
            //         describe(allActivitiesFieldName, () => {
            //             let createdField: any;
            //             let existedField: any;
            //             let emptyField: any;
            //             let activityTypeID: number;
            //             let createdAccountInternalID: number;
            //             let existedAccountInternalID: number;
            //             let createdTransactionInternalID: number;
            //             let catalogInternalID: number;
            //             let baseSortedAndCountedMap: Map<string, number> = new Map();
            //             let updatedSortedAndCountedMap: Map<string, number> = new Map();
            //             if (allActivitiesFieldName.includes('.')) {
            //                 describe('Create', () => {
            //                     it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                         baseSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                             allActivitiesFieldName,
            //                         );
            //                         baseSortedAndCountedMap.forEach((value) => {
            //                             //, key) => {
            //                             //console.log(`baseSortedAndCountedMap[${key}] = ${value}`);
            //                             expect(value).to.be.above(0);
            //                         });
            //                     });
            //                     it(`Create ${allActivitiesFieldName.split('.')[0]} With New ${
            //                         allActivitiesFieldName.split('.')[1]
            //                     }`, async () => {
            //                         if (allActivitiesFieldName.split('.')[0] != 'Account') {
            //                             throw new Error(
            //                                 `NotImplementedException - Reference Type: ${
            //                                     allActivitiesFieldName.split('.')[0]
            //                                 }`,
            //                             );
            //                         }
            //                         createdField = dataIndexService.createTestDataForField(
            //                             allActivitiesFieldName.split('.')[1],
            //                         );
            //                         const createAccountResponse = await generalService.fetchStatus('/accounts', {
            //                             method: 'POST',
            //                             body: JSON.stringify({
            //                                 ExternalID: testDataAccountExternalID,
            //                                 [allActivitiesFieldName.split('.')[1]]: createdField,
            //                             }),
            //                         });
            //                         createdAccountInternalID = createAccountResponse.Body.InternalID;
            //                         expect(createAccountResponse.Status).to.equal(201);
            //                     });
            //                     it(`Create Transaction With Existed ${allActivitiesFieldName}`, async () => {
            //                         const transactionArr = await objectsService.getTransaction({
            //                             where: `Type LIKE '%Sales Order%'`,
            //                             page_size: 1,
            //                         });
            //                         activityTypeID = transactionArr[0].ActivityTypeID as number;
            //                         const catalogsArr = await objectsService.getCatalogs({ page_size: 1 });
            //                         catalogInternalID = catalogsArr[0].InternalID;
            //                         const accountsArr = await objectsService.getAccounts({
            //                             where: `${allActivitiesFieldName.split('.')[1]}!=''`,
            //                             page_size: 1,
            //                         });
            //                         existedAccountInternalID = accountsArr[0].InternalID as number;
            //                         existedField = accountsArr[0][allActivitiesFieldName.split('.')[1]];
            //                         expect(accountsArr.length).to.be.above(0);
            //                         const testDataTransaction = await generalService.fetchStatus('/transactions', {
            //                             method: 'POST',
            //                             body: JSON.stringify({
            //                                 ExternalID: testDataTransactionExternalID,
            //                                 ActivityTypeID: activityTypeID,
            //                                 Account: {
            //                                     Data: {
            //                                         InternalID: existedAccountInternalID,
            //                                     },
            //                                 },
            //                                 Catalog: {
            //                                     Data: {
            //                                         InternalID: catalogInternalID,
            //                                     },
            //                                 },
            //                             }),
            //                         });
            //                         createdTransactionInternalID = testDataTransaction.Body.InternalID;
            //                         expect(testDataTransaction.Status).to.equal(201);
            //                     });
            //                     it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                         //try for 50 seconds to get the updated fields
            //                         let maxLoopsCounter = _MAX_LOOPS;
            //                         let isExistedField = false;
            //                         do {
            //                             maxLoopsCounter--;
            //                             generalService.sleep(_INTERVAL_TIMER);
            //                             updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                                 allActivitiesFieldName,
            //                             );
            //                             if (
            //                                 updatedSortedAndCountedMap.has(existedField) &&
            //                                 baseSortedAndCountedMap.has(existedField)
            //                             ) {
            //                                 if (
            //                                     (updatedSortedAndCountedMap.get(existedField) as number) !=
            //                                     (baseSortedAndCountedMap.get(existedField) as number)
            //                                 ) {
            //                                     isExistedField = true;
            //                                 }
            //                             } else if (updatedSortedAndCountedMap.has(existedField)) {
            //                                 isExistedField = true;
            //                             }
            //                             console.log({ updatedSortedAndCountedMap_Field_Existed: isExistedField });
            //                         } while (!isExistedField && maxLoopsCounter > 0);
            //                         updatedSortedAndCountedMap.forEach((value, key) => {
            //                             console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
            //                             expect(value).to.be.above(0);
            //                         });
            //                         if (!isExistedField) {
            //                             //Brake the next steps of the test if the updated field change failed
            //                             updatedSortedAndCountedMap = undefined as any;
            //                             throw new Error(
            //                                 `updatedSortedAndCountedMap don't contain the field ${allActivitiesFieldName}: ${existedField}`,
            //                             );
            //                         }
            //                     });
            //                     it(`Compare The Counts From Totals ${allActivitiesFieldName}`, async () => {
            //                         baseSortedAndCountedMap.forEach((value, key) => {
            //                             if (key == existedField) {
            //                                 expect(value).to.be.equal(
            //                                     (updatedSortedAndCountedMap.get(key) as number) - 1,
            //                                 );
            //                             } else {
            //                                 expect(value).to.be.equal(updatedSortedAndCountedMap.get(key));
            //                             }
            //                         });
            //                         expect(baseSortedAndCountedMap.has(existedField)).to.be.true;
            //                     });
            //                 });
            //                 describe('Update', () => {
            //                     it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                         baseSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                             allActivitiesFieldName,
            //                         );
            //                         baseSortedAndCountedMap.forEach((value) => {
            //                             //, key) => {
            //                             //console.log(`baseSortedAndCountedMap[${key}] = ${value}`);
            //                             expect(value).to.be.above(0);
            //                         });
            //                     });
            //                     it(`Update Transaction With New Referance Object that has new: ${allActivitiesFieldName}`, async () => {
            //                         const testDataTransaction = await generalService.fetchStatus('/transactions', {
            //                             method: 'POST',
            //                             body: JSON.stringify({
            //                                 InternalID: createdTransactionInternalID,
            //                                 ExternalID: testDataTransactionExternalID,
            //                                 ActivityTypeID: activityTypeID,
            //                                 Account: {
            //                                     Data: {
            //                                         InternalID: createdAccountInternalID,
            //                                     },
            //                                 },
            //                                 Catalog: {
            //                                     Data: {
            //                                         InternalID: catalogInternalID,
            //                                     },
            //                                 },
            //                             }),
            //                         });
            //                         expect(testDataTransaction.Status).to.equal(200);
            //                     });
            //                     it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                         //try for 50 seconds to get the updated fields
            //                         let maxLoopsCounter = _MAX_LOOPS;
            //                         let isCreatedField = false;
            //                         do {
            //                             maxLoopsCounter--;
            //                             generalService.sleep(_INTERVAL_TIMER);
            //                             updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                                 allActivitiesFieldName,
            //                             );
            //                             if (
            //                                 updatedSortedAndCountedMap.has(createdField) &&
            //                                 baseSortedAndCountedMap.has(createdField)
            //                             ) {
            //                                 if (
            //                                     (updatedSortedAndCountedMap.get(createdField) as number) !=
            //                                     (baseSortedAndCountedMap.get(createdField) as number)
            //                                 ) {
            //                                     isCreatedField = true;
            //                                 }
            //                             } else if (updatedSortedAndCountedMap.has(createdField)) {
            //                                 isCreatedField = true;
            //                             }
            //                             console.log({ updatedSortedAndCountedMap_Field_Created: isCreatedField });
            //                         } while (!isCreatedField && maxLoopsCounter > 0);
            //                         updatedSortedAndCountedMap.forEach((value, key) => {
            //                             console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
            //                             expect(value).to.be.above(0);
            //                         });
            //                         if (!isCreatedField) {
            //                             //Brake the next steps of the test if the updated field change failed
            //                             updatedSortedAndCountedMap = undefined as any;
            //                             throw new Error(
            //                                 `updatedSortedAndCountedMap don't contain the field ${allActivitiesFieldName}: ${createdField}`,
            //                             );
            //                         }
            //                     });
            //                     it(`Compare The Counts From Totals ${allActivitiesFieldName}`, async () => {
            //                         baseSortedAndCountedMap.forEach((value, key) => {
            //                             if (key == existedField) {
            //                                 expect(value).to.be.equal(
            //                                     (updatedSortedAndCountedMap.get(key) as number) + 1,
            //                                 );
            //                             } else if (key == createdField) {
            //                                 if (updatedSortedAndCountedMap.has(key)) {
            //                                     expect(value).to.be.equal(
            //                                         (updatedSortedAndCountedMap.get(key) as number) - 1,
            //                                     );
            //                                 }
            //                             } else {
            //                                 expect(value).to.be.equal(updatedSortedAndCountedMap.get(key));
            //                             }
            //                         });
            //                         if (baseSortedAndCountedMap.has(createdField)) {
            //                             expect(updatedSortedAndCountedMap.get(createdField)).to.be.equal(
            //                                 (baseSortedAndCountedMap.get(createdField) as number) + 1,
            //                             );
            //                         }
            //                     });
            //                 });
            //                 describe('Update To Empty', () => {
            //                     it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                         baseSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                             allActivitiesFieldName,
            //                         );
            //                         baseSortedAndCountedMap.forEach((value) => {
            //                             //, key) => {
            //                             //console.log(`baseSortedAndCountedMap[${key}] = ${value}`);
            //                             expect(value).to.be.above(0);
            //                         });
            //                     });
            //                     if (allActivitiesFieldName.includes('.')) {
            //                         it(`Update The New ${allActivitiesFieldName.split('.')[0]} With Empty ${
            //                             allActivitiesFieldName.split('.')[1]
            //                         }`, async () => {
            //                             if (allActivitiesFieldName.split('.')[0] != 'Account') {
            //                                 throw new Error(
            //                                     `NotImplementedException - Reference Type: ${
            //                                         allActivitiesFieldName.split('.')[0]
            //                                     }`,
            //                                 );
            //                             }
            //                             const updateAccountResponse = await generalService.fetchStatus('/accounts', {
            //                                 method: 'POST',
            //                                 body: JSON.stringify({
            //                                     InternalID: createdAccountInternalID,
            //                                     [allActivitiesFieldName.split('.')[1]]: null,
            //                                 }),
            //                             });
            //                             emptyField = updateAccountResponse.Body[allActivitiesFieldName.split('.')[1]];
            //                             expect(updateAccountResponse.Status).to.equal(200);
            //                         });
            //                     }
            //                     it(`Update Transaction To Empty ${allActivitiesFieldName}`, async () => {
            //                         const testDataTransaction = await generalService.fetchStatus('/transactions', {
            //                             method: 'POST',
            //                             body: JSON.stringify({
            //                                 InternalID: createdTransactionInternalID,
            //                                 ExternalID: testDataTransactionExternalID,
            //                                 ActivityTypeID: activityTypeID,
            //                                 Account: {
            //                                     Data: {
            //                                         InternalID: createdAccountInternalID,
            //                                     },
            //                                 },
            //                                 Catalog: {
            //                                     Data: {
            //                                         InternalID: catalogInternalID,
            //                                     },
            //                                 },
            //                             }),
            //                         });
            //                         expect(testDataTransaction.Status).to.equal(200);
            //                     });
            //                     it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                         //try for 50 seconds to get the updated fields
            //                         let maxLoopsCounter = _MAX_LOOPS;
            //                         let isEmptyField = false;
            //                         do {
            //                             maxLoopsCounter--;
            //                             generalService.sleep(_INTERVAL_TIMER);
            //                             updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                                 allActivitiesFieldName,
            //                             );
            //                             if (
            //                                 updatedSortedAndCountedMap.has(emptyField) &&
            //                                 baseSortedAndCountedMap.has(emptyField)
            //                             ) {
            //                                 if (
            //                                     (updatedSortedAndCountedMap.get(emptyField) as number) !=
            //                                     (baseSortedAndCountedMap.get(emptyField) as number)
            //                                 ) {
            //                                     isEmptyField = true;
            //                                 }
            //                             } else if (updatedSortedAndCountedMap.has(emptyField)) {
            //                                 isEmptyField = true;
            //                             }
            //                             console.log({ updatedSortedAndCountedMap_Field_Empty: isEmptyField });
            //                         } while (!isEmptyField && maxLoopsCounter > 0);
            //                         updatedSortedAndCountedMap.forEach((value, key) => {
            //                             console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
            //                             expect(value).to.be.above(0);
            //                         });
            //                         if (!isEmptyField) {
            //                             //Brake the next steps of the test if the updated field change failed
            //                             updatedSortedAndCountedMap = undefined as any;
            //                             throw new Error(
            //                                 `updatedSortedAndCountedMap don't contain the field ${allActivitiesFieldName}: ${emptyField}`,
            //                             );
            //                         }
            //                     });
            //                     it(`Compare The Counts From Totals ${allActivitiesFieldName}`, async () => {
            //                         baseSortedAndCountedMap.forEach((value, key) => {
            //                             if (key == emptyField) {
            //                                 expect(value).to.be.equal(
            //                                     (updatedSortedAndCountedMap.get(key) as number) - 1,
            //                                 );
            //                             } else if (key == existedField) {
            //                                 if (updatedSortedAndCountedMap.has(key)) {
            //                                     expect(value).to.be.equal(
            //                                         (updatedSortedAndCountedMap.get(key) as number) + 1,
            //                                     );
            //                                 }
            //                             } else {
            //                                 expect(value).to.be.equal(updatedSortedAndCountedMap.get(key));
            //                             }
            //                         });
            //                         if (baseSortedAndCountedMap.has(emptyField)) {
            //                             expect(updatedSortedAndCountedMap.get(emptyField)).to.be.equal(
            //                                 (baseSortedAndCountedMap.get(emptyField) as number) + 1,
            //                             );
            //                         }
            //                     });
            //                 });
            //                 describe('Delete', () => {
            //                     it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                         baseSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                             allActivitiesFieldName,
            //                         );
            //                         baseSortedAndCountedMap.forEach((value) => {
            //                             //, key) => {
            //                             //console.log(`baseSortedAndCountedMap[${key}] = ${value}`);
            //                             expect(value).to.be.above(0);
            //                         });
            //                     });
            //                     it(`Delete The New Transaction With ${allActivitiesFieldName}`, async () => {
            //                         const isTransactionDeleted = await objectsService.deleteTransaction(
            //                             createdTransactionInternalID,
            //                         );
            //                         expect(isTransactionDeleted).to.be.true;
            //                         const getDeletedTransaction = await objectsService.getTransactionByID(
            //                             createdTransactionInternalID,
            //                         );
            //                         expect(getDeletedTransaction.Hidden).to.be.true;
            //                     });
            //                     it(`${allActivitiesFieldName} Total Count Above 0`, async () => {
            //                         //try for 50 seconds to get the updated fields
            //                         let maxLoopsCounter = _MAX_LOOPS;
            //                         let isEmptyField = false;
            //                         do {
            //                             maxLoopsCounter--;
            //                             generalService.sleep(_INTERVAL_TIMER);
            //                             updatedSortedAndCountedMap = await dataIndexService.createTotalsMapOfField(
            //                                 allActivitiesFieldName,
            //                             );
            //                             if (
            //                                 updatedSortedAndCountedMap.has(emptyField) &&
            //                                 baseSortedAndCountedMap.has(emptyField)
            //                             ) {
            //                                 if (
            //                                     (updatedSortedAndCountedMap.get(emptyField) as number) !=
            //                                     (baseSortedAndCountedMap.get(emptyField) as number)
            //                                 ) {
            //                                     isEmptyField = true;
            //                                 }
            //                             } else if (!updatedSortedAndCountedMap.has(emptyField)) {
            //                                 isEmptyField = true;
            //                             }
            //                             console.log({ updatedSortedAndCountedMap_Field_Empty: isEmptyField });
            //                         } while (!isEmptyField && maxLoopsCounter > 0);
            //                         updatedSortedAndCountedMap.forEach((value) => {
            //                             //, key) => {
            //                             //console.log(`updatedSortedAndCountedMap[${key}] = ${value}`);
            //                             expect(value).to.be.above(0);
            //                         });
            //                         if (!isEmptyField) {
            //                             //Brake the next steps of the test if the updated have empty but same as the base
            //                             updatedSortedAndCountedMap = undefined as any;
            //                             throw new Error(
            //                                 `updatedSortedAndCountedMap and baseSortedAndCountedMap contain the same field ${allActivitiesFieldName}: ${emptyField}`,
            //                             );
            //                         }
            //                     });
            //                     it(`Compare The Counts From Totals ${allActivitiesFieldName}`, async () => {
            //                         updatedSortedAndCountedMap.forEach((value, key) => {
            //                             if (key == emptyField) {
            //                                 expect(value).to.be.equal((baseSortedAndCountedMap.get(key) as number) - 1);
            //                             } else {
            //                                 expect(value).to.be.equal(baseSortedAndCountedMap.get(key));
            //                             }
            //                         });
            //                         if (!updatedSortedAndCountedMap.has(emptyField)) {
            //                             expect(baseSortedAndCountedMap.get(emptyField)).to.equal(1);
            //                         }
            //                     });
            //                 });
            //                 describe('Clean UP', () => {
            //                     if (allActivitiesFieldName.includes('.')) {
            //                         it(`Clean Up The New ${allActivitiesFieldName.split('.')[0]} With ${
            //                             allActivitiesFieldName.split('.')[1]
            //                         }`, async () => {
            //                             if (allActivitiesFieldName.split('.')[0] != 'Account') {
            //                                 throw new Error(
            //                                     `NotImplementedException - Reference Type: ${
            //                                         allActivitiesFieldName.split('.')[0]
            //                                     }`,
            //                                 );
            //                             }
            //                             const isAccountDeleted = await objectsService.deleteAccount(
            //                                 createdAccountInternalID,
            //                             );
            //                             expect(isAccountDeleted).to.be.true;
            //                             const getDeletedAccount = await objectsService.getAccountByID(
            //                                 createdAccountInternalID,
            //                             );
            //                             expect(getDeletedAccount.Hidden).to.be.true;
            //                         });
            //                     }
            //                 });
            //             }
            //             //Done 1 (create)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
            //             //Done 2 (create) *Only for cases where internal object created	API call POST: https://papi.staging.pepperi.com/V1.0/accounts (With Account.City from test data – city 1234)	Response Code 201
            //             //Done 3 (create)	API call POST: https://papi.staging.pepperi.com/V1.0/transactions (With the new Account)	Response Code 201
            //             //Done 4 (create)	API call: https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
            //             //?? 5 (create)	Compare The Counts From Totals Account.City (1), with the counts from Totals Account.City (4)	Is +1
            //             //Maybe 6 (update)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
            //             //Maybe 7 (update)	API call POST: https://papi.staging.pepperi.com/V1.0/accounts (With Account.City as the first existed)	Response Code 200
            //             //Maybe 8 (update)	API call GET: https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
            //             //Maybe 9 (update)	Compare The Counts From Totals Account.City (6), with the counts from Totals Account.City (8)	Is +1 and Is -1
            //             // Maybe 2 10 (Update to empty)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
            //             // Maybe 2 11 (Update to empty)	API call POST: https://papi.staging.pepperi.com/V1.0/accounts (With Account.City as empty string or null if possible)	Response Code 200
            //             // Maybe 2 12 (Update to empty)	API call GET: https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)&group_by=Account.City	Count > 0
            //             // Maybe 2 13 (Update to empty)	Compare The Counts From Totals Account.City (10), with the counts from Totals Account.City (12)	Is +1 and Is -1
            //             // Maybe 3 14 (clean up)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)	Count > 0
            //             // Maybe 3 15 (clean up)	API call DELETE: https://papi.staging.pepperi.com/V1.0/transactions  (Clean the test transaction and restore previous condition)	Response Code 200
            //             // Maybe 3 16 (clean up)	API call GET:   https://papi.staging.pepperi.com/V1.0/elasticsearch/all_activities?where=InternalID=86411390	Body = []
            //             // Maybe 3 17 (clean up)	API call GET:  https://papi.staging.pepperi.com/V1.0/elasticsearch/totals/all_activities?select=count(Account.City)	Count > 0
            //             // Maybe 3 18 (clean up)	Compare The Counts From Totals Account.City (14), with the counts from Totals Account.City (16)	Is -1
            //             //Skipped after meeting with Ido 19 (clean up) *Only for Transaction Lines	API call DELETE: https://papi.staging.pepperi.com/V1.0/transactions_lines (Clean the test transaction_lines and restore previous condition)	Response Code 200
            //             //Skipped after meeting with Ido 20 (clean up) *Only for Transaction Lines	API call GET:   https://papi.staging.pepperi.com/V1.0/transaction_lines/813929257	Hidden = true
            //             // Maybe 3 21 (clean up)*Only for cases where internal object created	API call DELETE: https://papi.staging.pepperi.com/V1.0/accounts	Response Code 200
            //             // Maybe 3 22 (clean up) *Only for cases where internal object created	API call GET: https://papi.staging.pepperi.com/V1.0/accounts/20520635	Hidden = true
            //             //All Activities: 'SubTotal','Account.City',
            //             //Transaction Lines:'TotalUnitsPriceAfterDiscount', 'Transaction.Account.City
            //         });
            //     }
            // });
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
