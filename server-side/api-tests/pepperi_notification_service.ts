import { Catalog, Subscription } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../services/general.service';
import { PepperiNotificationServiceService } from '../services/pepperi-notification-service.service';
import { ObjectsService } from '../services/objects.service';
import { ADALService } from '../services/adal.service';
import { ResourceTypes } from '../services/general.service';

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

    //#region Upgrade Pepperi Notification Service
    const testData = {
        'Pepperi Notification Service': ['00000000-0000-0000-0000-000000040fa9', ''],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.chnageVersion(request.body.varKey, testData, false);
    //#endregion Upgrade Pepperi Notification Service

    describe('Pepperi Notification Service Tests Suites', () => {
        const schemaName = 'PNS Test';
        const _MAX_LOOPS = 12;
        let atdArr;
        let catalogArr: Catalog[];
        let transactionAccount;
        let createdTransaction;
        let transactionExternalID;
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
                const schemaNameArr = [schemaName];
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

        it(`Reset Schema`, async () => {
            const subscriptionBody: Subscription = {
                AddonRelativeURL: '/logger/update_pns_test',
                Type: 'data',
                AddonUUID: PepperiOwnerID,
                FilterPolicy: {
                    Resource: ['transactions' as ResourceTypes],
                    Action: ['update'],
                    ModifiedFields: ['Remark', 'TaxPercentage', 'ExternalID'],
                    AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                },
                Name: 'Test_Update_PNS',
            };
            const subscribeResponse = await pepperiNotificationServiceService.subscribe(subscriptionBody);
            expect(subscribeResponse).to.have.property('Name').a('string').that.is.equal(subscriptionBody.Name);

            const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                'Test_Update_PNS',
            );
            expect(getSubscribeResponse[0]).to.have.property('Name').a('string').that.is.equal(subscriptionBody.Name);
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

                it('Update Transaction With SDK', async () => {
                    const updatedTransaction = await objectsService.createTransaction({
                        InternalID: createdTransaction.InternalID,
                        Remark: 'PNS Tests',
                        TaxPercentage: 95,
                        ExternalID: `(Deleted) ${createdTransaction.ExternalID}`,
                    });

                    expect(updatedTransaction.InternalID).to.equal(createdTransaction.InternalID);
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
                        (!schema[0].Key.startsWith('Log_Update_PNS_Test') ||
                            schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].FieldID !=
                                'UnitDiscountPercentage') &&
                        maxLoopsCounter > 0
                    );

                    expect(schema[0].Key).to.be.a('String').and.contain('Log_Update_PNS_Test') ||
                        expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                            createdTransaction.UUID,
                        );
                    expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0]).to.deep.equal([
                        {
                            NewValue: 'PNS Tests',
                            OldValue: '',
                            FieldID: 'Remark',
                        },
                        {
                            NewValue: 95,
                            OldValue: 0,
                            FieldID: 'TaxPercentage',
                        },
                        {
                            NewValue: `(Deleted) ${createdTransaction.ExternalID}`,
                            OldValue: createdTransaction.ExternalID,
                            FieldID: 'ExternalID',
                        },
                        {
                            NewValue: null,
                            OldValue: 1,
                            FieldID: 'CatalogPriceFactor',
                        },
                    ]);
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
            });
        });
    });
}
