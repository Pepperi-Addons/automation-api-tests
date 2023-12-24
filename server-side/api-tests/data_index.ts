import { DataIndexService } from './../services/data-index.service';
import GeneralService, { TesterFunctions } from '../services/general.service';
import { ObjectsService } from '../services/objects.service';

export async function DataIndexTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const dataIndexService = new DataIndexService(generalService);

    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
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
            // { fieldID: 'DeliveryDate', type: 'DateTime' },
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
        // 'DeliveryDate',
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
                expect(postFieldsResponse.Hidden).to.be.false;
                expect(postFieldsResponse.Key).to.be.equal('meta_data');
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
                debugger;
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
            it('Clean Data Index', async () => {
                // debugger;
                const deleteResponse = await dataIndexService.cleanDataIndexAsInUI();
                expect(deleteResponse.Ok).to.equal(true);
                expect(deleteResponse.Status).to.equal(200);
                expect(deleteResponse.Body.success).to.equal(true);
            });
            it('Publish Data Index', async () => {
                const publishResponse = await dataIndexService.publishDataIndex();
                expect(publishResponse.Ok).to.equal(true);
                expect(publishResponse.Status).to.equal(200);
                expect(publishResponse.Body.success).to.equal(true);
                debugger;
                let pollingResponse;
                let loopCounter = 0;
                do {
                    pollingResponse = await dataIndexService.getProgressOfDataIndexBuilding();
                    loopCounter++;
                    generalService.sleep(5 * 1000);
                } while (pollingResponse.Body.ProgressData.Status !== 'Success' && loopCounter < 9);
                expect(pollingResponse.Body.ProgressData.all_activities_progress.Precentag).to.equal(100);
                expect(pollingResponse.Body.ProgressData.all_activities_progress.Status).to.equal('Success');
                expect(pollingResponse.Body.ProgressData.transaction_lines_progress.Precentag).to.equal(100);
                expect(pollingResponse.Body.ProgressData.transaction_lines_progress.Status).to.equal('Success');
            });
            it('DI-25539 bug verification: create transaction, see we can GET it from both all_activities and transaction_lines, change the remark, see it was updated both on trans_lines & all_act', async () => {
                //1. create transaction with remark & transaction lines
                const objectsService = new ObjectsService(generalService);
                const [firstRemark, createdTransaction] = await createTransaction(
                    objectsService,
                    generalService,
                    expect,
                );
                await addTransLines(objectsService, createdTransaction, expect);
                const transactionInternalID = createdTransaction.InternalID;
                const allActivitiesURL =
                    '/addons/shared_index/index/papi_data_index/search/10979a11-d7f4-41df-8993-f06bfd778304/all_activities';
                const transactionLinesURL =
                    '/addons/shared_index/index/papi_data_index/search/10979a11-d7f4-41df-8993-f06bfd778304/transaction_lines';
                //2. see we can get the data using data index transaction AND transaction-line
                const allActivitiesBody = {
                    Where: `InternalID=${transactionInternalID}`,
                    Fields: ['Remark'],
                };
                // debugger;
                const allActivitiesResponse = await generalService.fetchStatus(allActivitiesURL, {
                    method: 'POST',
                    body: JSON.stringify(allActivitiesBody),
                });
                expect(allActivitiesResponse.Body.Objects[0].Remark).to.equal(firstRemark);
                const transLinesBody = {
                    Where: `Transaction.InternalID=${transactionInternalID}`,
                    Fields: ['Transaction.Remark'],
                };
                const transLinesResponse = await generalService.fetchStatus(transactionLinesURL, {
                    method: 'POST',
                    body: JSON.stringify(transLinesBody),
                });
                expect(transLinesResponse.Body.Objects[0]['Transaction.Remark']).to.equal(firstRemark);
                //3. change the remark
                const secondRemark = await updateTransaction(generalService, createdTransaction, expect);
                //4. see it returns correctly on both transaction and transaction-line
                const allActivitiesResponseAfterUpdate = await generalService.fetchStatus(allActivitiesURL, {
                    method: 'POST',
                    body: JSON.stringify(allActivitiesBody),
                });
                expect(allActivitiesResponseAfterUpdate.Body.Objects[0].Remark).to.equal(secondRemark);
                const transLinesResponseAfterUpdate = await generalService.fetchStatus(transactionLinesURL, {
                    method: 'POST',
                    body: JSON.stringify(transLinesBody),
                });
                expect(transLinesResponseAfterUpdate.Body.Objects[0]['Transaction.Remark']).to.equal(secondRemark);
            });
        });
    });
}

async function createTransaction(objectsService, generalService, expect) {
    const atdArr = await objectsService.getATD('transactions');
    const transactionAccount = await objectsService.getAccounts({ page_size: 1 }).then((res) => {
        return res[0];
    });
    const transactionExternalID = 'Automated API Transaction ' + Math.floor(Math.random() * 1000000).toString();
    const firstRemark = generalService.generateRandomString(6);
    const catalogArr = await generalService.getCatalogs();
    const createdTransaction = await objectsService.createTransaction({
        ExternalID: transactionExternalID,
        ActivityTypeID: atdArr[0].TypeID,
        Remark: firstRemark,
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
    expect(getCreatedTransactionResponse[0]).to.include({
        ExternalID: transactionExternalID,
        ActivityTypeID: atdArr[0].TypeID,
        Status: 1,
    });
    expect(JSON.stringify(getCreatedTransactionResponse[0].Account)).equals(
        JSON.stringify({
            Data: {
                InternalID: transactionAccount.InternalID,
                UUID: transactionAccount.UUID,
                ExternalID: transactionAccount.ExternalID,
            },
            URI: '/accounts/' + transactionAccount.InternalID,
        }),
    );
    expect(getCreatedTransactionResponse[0].InternalID).to.equal(createdTransaction.InternalID),
        expect(getCreatedTransactionResponse[0].Remark).to.equal(firstRemark),
        expect(getCreatedTransactionResponse[0].UUID).to.include(createdTransaction.UUID),
        expect(getCreatedTransactionResponse[0].CreationDateTime).to.contain(new Date().toISOString().split('T')[0]);
    expect(getCreatedTransactionResponse[0].CreationDateTime).to.contain('Z'),
        expect(getCreatedTransactionResponse[0].ModificationDateTime).to.contain(
            new Date().toISOString().split('T')[0],
        );
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
        });
    return [firstRemark, createdTransaction];
}

async function addTransLines(objectsService, createdTransaction, expect) {
    const items = await objectsService.getItems();
    const createdTransactionLines = await objectsService.createTransactionLine({
        TransactionInternalID: createdTransaction.InternalID,
        LineNumber: 0,
        ItemExternalID: items[0].ExternalID,
        UnitsQuantity: 1,
    });

    const getCreatedTransactionLine = await objectsService.getTransactionLines({
        where: `TransactionInternalID=${createdTransaction.InternalID}`,
    });

    expect(getCreatedTransactionLine[0]).to.include({
        LineNumber: 0,
        UnitsQuantity: 1.0,
        TotalUnitsPriceAfterDiscount: 0.0,
        TotalUnitsPriceBeforeDiscount: 0.0,
        UnitDiscountPercentage: 0.0,
        UnitPrice: 0.0,
        UnitPriceAfterDiscount: 0.0,
    });
    expect(JSON.stringify(getCreatedTransactionLine[0].Item)).equals(
        JSON.stringify({
            Data: {
                InternalID: items[0].InternalID,
                UUID: items[0].UUID,
                ExternalID: items[0].ExternalID,
            },
            URI: '/items/' + items[0].InternalID,
        }),
    );
    expect(JSON.stringify(getCreatedTransactionLine[0].Transaction)).equals(
        JSON.stringify({
            Data: {
                InternalID: createdTransaction.InternalID,
                UUID: createdTransaction.UUID,
                ExternalID: createdTransaction.ExternalID,
            },
            URI: '/transactions/' + createdTransaction.InternalID,
        }),
    );
    expect(getCreatedTransactionLine[0].InternalID).to.equal(createdTransactionLines.InternalID);
    expect(getCreatedTransactionLine[0].UUID).to.include(createdTransactionLines.UUID);
    expect(getCreatedTransactionLine[0].CreationDateTime).to.contain(new Date().toISOString().split('T')[0]);
    expect(getCreatedTransactionLine[0].CreationDateTime).to.contain('Z');
    expect(getCreatedTransactionLine[0].ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
    expect(getCreatedTransactionLine[0].ModificationDateTime).to.contain('Z');
    expect(getCreatedTransactionLine[0].Archive).to.be.false;
    expect(getCreatedTransactionLine[0].Hidden).to.be.false;
    expect(
        await objectsService.getTransactionLines({
            where: `TransactionInternalID=${createdTransaction.InternalID}`,
        }),
    )
        .to.be.an('array')
        .with.lengthOf(1);
}

async function updateTransaction(generalService, createdTransaction, expect) {
    const secondRemark = generalService.generateRandomString(6);
    const bodyToSend = { Remark: secondRemark, InternalID: createdTransaction.InternalID };
    const updateResponse = await generalService.fetchStatus(`/transactions`, {
        method: 'POST',
        body: JSON.stringify(bodyToSend),
    });
    expect(updateResponse.Ok).to.equal(true);
    expect(updateResponse.Status).to.equal(200);
    expect(updateResponse.Body.InternalID).to.equal(createdTransaction.InternalID);
    expect(updateResponse.Body.Remark).to.equal(secondRemark);
    generalService.sleep(1000 * 15);
    return secondRemark;
}
