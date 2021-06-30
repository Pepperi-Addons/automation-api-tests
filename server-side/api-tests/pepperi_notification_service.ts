import { Catalog, Subscription, Addon, AddonVersion } from '@pepperi-addons/papi-sdk';
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

            describe(`Subscription And Trigger Scenarios`, () => {
                describe(`Transactions (DI-17682)`, () => {
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

                    it(`Subscribe And Validate Get With Where (DI-18054)`, async () => {
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
                        expect(subscribeResponse)
                            .to.have.property('Name')
                            .a('string')
                            .that.is.equal(subscriptionBody.Name);
                        expect(subscribeResponse)
                            .to.have.property('FilterPolicy')
                            .to.deep.equal({
                                Resource: ['transactions' as ResourceTypes],
                                Action: ['update'],
                                ModifiedFields: ['Remark', 'TaxPercentage', 'ExternalID'],
                                AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                            });

                        const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                            'Test_Update_PNS',
                        );
                        expect(getSubscribeResponse[0])
                            .to.have.property('Name')
                            .a('string')
                            .that.is.equal(subscriptionBody.Name);
                        expect(getSubscribeResponse[0])
                            .to.have.property('FilterPolicy')
                            .to.deep.equal({
                                Resource: ['transactions' as ResourceTypes],
                                Action: ['update'],
                                ModifiedFields: ['Remark', 'TaxPercentage', 'ExternalID'],
                                AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                            });
                    });

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
                            TaxPercentage: 0,
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

                    it('Update Transaction', async () => {
                        const updatedTransaction = await objectsService.createTransaction({
                            InternalID: createdTransaction.InternalID,
                            Remark: 'PNS Tests',
                            TaxPercentage: 95,
                            ExternalID: `(Deleted) ${createdTransaction.ExternalID}`,
                        });

                        expect(updatedTransaction.InternalID).to.equal(createdTransaction.InternalID);
                    });

                    it('Validate PNS Triggered After Update', async () => {
                        let schema;
                        let maxLoopsCounter = _MAX_LOOPS;
                        do {
                            generalService.sleep(1500);
                            schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                                order_by: 'CreationDateTime DESC',
                            });
                            maxLoopsCounter--;
                        } while (
                            !schema[0] ||
                            (!schema[0].Key.startsWith('Log_Update_PNS_Test') && maxLoopsCounter > 0)
                        );
                        expect(schema[0].Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                            createdTransaction.UUID,
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields).to.deep.equal([
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

                    it(`Unsubscribe And Validate Get With Where (DI-18054)`, async () => {
                        const subscriptionBody: Subscription = {
                            AddonRelativeURL: '/logger/update_pns_test',
                            Type: 'data',
                            Hidden: true,
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
                        expect(subscribeResponse)
                            .to.have.property('Name')
                            .a('string')
                            .that.is.equal(subscriptionBody.Name);
                        expect(subscribeResponse).to.have.property('Hidden').a('boolean').that.is.true;

                        const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                            'Test_Update_PNS',
                        );
                        expect(getSubscribeResponse).to.deep.equal([]);
                    });

                    it('Update Transaction', async () => {
                        const updatedTransaction = await objectsService.createTransaction({
                            InternalID: createdTransaction.InternalID,
                            Remark: 'PNS Negatice Tests',
                            TaxPercentage: 50,
                            ExternalID: `(Test) ${createdTransaction.ExternalID}`,
                        });

                        expect(updatedTransaction.InternalID).to.equal(createdTransaction.InternalID);
                    });

                    it('Validate PNS Not Triggered After Update', async () => {
                        let schema;
                        let maxLoopsCounter = _MAX_LOOPS;
                        do {
                            generalService.sleep(1500);
                            schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                                order_by: 'CreationDateTime DESC',
                            });
                            maxLoopsCounter--;
                        } while (
                            (!schema[0] || !schema[0].Key.startsWith('Log_Update_PNS_Test') || schema.length < 2) &&
                            maxLoopsCounter > 0
                        );
                        expect(schema[0].Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                            createdTransaction.UUID,
                        );
                        expect(schema[1]).to.be.undefined;
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields).to.deep.equal([
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

                describe(`Addons`, () => {
                    let createdAddon;
                    let installedAddon;
                    const testAddon: Addon = {
                        Name: 'Pepperitest Test ' + Math.floor(Math.random() * 1000000).toString(),
                    }; //Name here can't be changed or it will send messages VIA teams
                    const versionsArr: AddonVersion[] = [];
                    versionsArr.length = 3;
                    let versiontestAddon;

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

                    it(`Subscribe And Validate Get With Where (DI-18054)`, async () => {
                        const subscriptionBody: Subscription = {
                            AddonRelativeURL: '/logger/update_pns_test',
                            Type: 'data',
                            AddonUUID: PepperiOwnerID,
                            FilterPolicy: {
                                Resource: ['installed_addons' as ResourceTypes],
                                AddonUUID: ['00000000-0000-0000-0000-000000000a91'],
                            },
                            Name: 'Test_Update_PNS',
                        };
                        const subscribeResponse = await pepperiNotificationServiceService.subscribe(subscriptionBody);
                        expect(subscribeResponse)
                            .to.have.property('Name')
                            .a('string')
                            .that.is.equal(subscriptionBody.Name);
                        expect(subscribeResponse)
                            .to.have.property('FilterPolicy')
                            .to.deep.equal({
                                Resource: ['installed_addons' as ResourceTypes],
                                AddonUUID: ['00000000-0000-0000-0000-000000000a91'],
                            });

                        const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                            'Test_Update_PNS',
                        );
                        expect(getSubscribeResponse[0])
                            .to.have.property('Name')
                            .a('string')
                            .that.is.equal(subscriptionBody.Name);
                        expect(getSubscribeResponse[0])
                            .to.have.property('FilterPolicy')
                            .to.deep.equal({
                                Resource: ['installed_addons' as ResourceTypes],
                                AddonUUID: ['00000000-0000-0000-0000-000000000a91'],
                            });
                    });

                    it('Create Addon', async () => {
                        //Create
                        //To make sure eddon is deleted no matter what
                        createdAddon = await generalService.fetchStatus(
                            generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                            {
                                method: `POST`,
                                headers: {
                                    Authorization: request.body.varKey,
                                },
                                body: JSON.stringify(testAddon),
                            },
                        );

                        for (let index = 0; index < versionsArr.length; index++) {
                            versiontestAddon = {
                                AddonUUID: createdAddon.Body.UUID,
                                Version: 'Pepperitest Test Version ' + Math.floor(Math.random() * 1000000).toString(), //Name here can't be changed or it will send messages VIA teams
                            };
                            versiontestAddon.Phased = true;
                            versiontestAddon.StartPhasedDateTime = new Date().toJSON();
                            versionsArr[index] = await generalService
                                .fetchStatus(
                                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                                        '/var/addons/versions',
                                    {
                                        method: `POST`,
                                        headers: {
                                            Authorization: request.body.varKey,
                                        },
                                        body: JSON.stringify(versiontestAddon),
                                    },
                                )
                                .then((res) => res.Body);
                        }
                        expect(createdAddon.Body.Name).to.equal(testAddon.Name);
                        expect(versionsArr[0].Version).to.contain('Pepperitest Test Version ');
                        expect(versionsArr[1].Version).to.contain('Pepperitest Test Version ');
                        expect(versionsArr[2].Version).to.contain('Pepperitest Test Version ');
                    });

                    it('Install Addon', async () => {
                        //Install with available version
                        const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                            .addonUUID(createdAddon.Body.UUID)
                            .install(versionsArr[0].Version);
                        //console.log({ Post_Addon_with_Version: postInstallAddonApiResponse });

                        let postAddonApiResponse;
                        let maxLoopsCounter = 90;
                        do {
                            generalService.sleep(2000);
                            postAddonApiResponse = await generalService.papiClient.get(
                                postInstallAddonApiResponse.URI as any,
                            );
                            maxLoopsCounter--;
                        } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                        //console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

                        //If no Audit log was found
                        if (postAddonApiResponse == undefined) {
                            postAddonApiResponse = {};
                            //postAddonApiResponse.result = {};
                            postAddonApiResponse.AuditInfo = {};
                            postAddonApiResponse.AuditInfo.ToVersion = {};
                            postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
                        }

                        //Save Installed addon
                        installedAddon = await generalService.papiClient.addons.installedAddons
                            .find({
                                where: `AddonUUID='${postAddonApiResponse.AuditInfo.Addon.UUID}'`,
                            })
                            .then((addonsArr) => addonsArr[0]);

                        //Install results
                        expect(postAddonApiResponse.Status.Name).to.equal('Success');

                        //Installed version results
                        expect(versionsArr[0].Version).to.equal(postAddonApiResponse.AuditInfo.ToVersion);
                    });

                    it('Validate PNS Triggered After Addon Installation', async () => {
                        let schema;
                        let maxLoopsCounter = _MAX_LOOPS;
                        do {
                            generalService.sleep(1500);
                            schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                                order_by: 'CreationDateTime DESC',
                            });
                            maxLoopsCounter--;
                        } while (
                            (!schema[0] || !schema[0].Key.startsWith('Log_Update_PNS_Test') || schema.length < 2) &&
                            maxLoopsCounter > 0
                        );
                        expect(schema[0].Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                        expect(schema[1].Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                            installedAddon.UUID,
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(0);
                        expect(schema[0].Message.FilterAttributes.Resource).to.equal('installed_addons');
                        expect(schema[0].Message.FilterAttributes.Action).to.equal('update');
                        expect(schema[0].Message.FilterAttributes.ModifiedFields).to.deep.equal([]);
                        expect(schema[1].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                            '00000000-0000-0000-0000-000000000000',
                        );
                        expect(schema[1].Message.Message.ModifiedObjects[0].ModifiedFields).to.be.null;
                        expect(schema[1].Message.FilterAttributes.Resource).to.equal('installed_addons');
                        expect(schema[1].Message.FilterAttributes.Action).to.equal('insert');
                        expect(schema[1].Message.FilterAttributes.ModifiedFields).to.deep.equal([]);
                    });

                    it('Upgrade Addon', async () => {
                        //Upgrade with available version
                        const postUpgradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                            .addonUUID(createdAddon.Body.UUID)
                            .upgrade(versionsArr[2].Version);
                        //console.log({ Post_Addon_with_Version: postUpgradeAddonApiResponse });

                        let postAddonApiResponse;
                        let maxLoopsCounter = 90;
                        do {
                            generalService.sleep(2000);
                            postAddonApiResponse = await generalService.papiClient.get(
                                postUpgradeAddonApiResponse.URI as any,
                            );
                            maxLoopsCounter--;
                        } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                        //console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

                        //If no Audit log was found
                        if (postAddonApiResponse == undefined) {
                            postAddonApiResponse = {};
                            //postAddonApiResponse.result = {};
                            postAddonApiResponse.AuditInfo = {};
                            postAddonApiResponse.AuditInfo.ToVersion = {};
                            postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
                        }

                        //Upgrade results
                        expect(postAddonApiResponse.Status.Name).to.equal('Success');

                        //Upgrade version results
                        expect(versionsArr[2].Version).to.equal(postAddonApiResponse.AuditInfo.ToVersion);
                    });

                    it('Validate PNS Triggered After Addon Upgrade', async () => {
                        let schema;
                        let maxLoopsCounter = _MAX_LOOPS;
                        do {
                            generalService.sleep(1500);
                            schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                                order_by: 'CreationDateTime DESC',
                            });
                            maxLoopsCounter--;
                        } while (
                            (!schema[0] || !schema[0].Key.startsWith('Log_Update_PNS_Test') || schema.length < 3) &&
                            maxLoopsCounter > 0
                        );
                        expect(schema[0].Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                            installedAddon.UUID,
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(4);
                        expect(schema[0].Message.FilterAttributes.Resource).to.equal('installed_addons');
                        expect(schema[0].Message.FilterAttributes.Action).to.equal('update');
                        expect(schema[0].Message.FilterAttributes.ModifiedFields).to.deep.equal([
                            'SystemData',
                            'ModificationDate',
                            'Version',
                            'LastUpgradeDateTime',
                        ]);
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].NewValue).to.include(
                            'Pepperitest Test Version ',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].OldValue).to.equal('{}');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].FieldID).to.equal(
                            'SystemData',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[1].NewValue).to.include('T');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[1].OldValue).to.include('T');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[1].FieldID).to.equal(
                            'ModificationDate',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[2].NewValue).to.include(
                            versionsArr[2].Version,
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[2].OldValue).to.include(
                            versionsArr[0].Version,
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[2].FieldID).to.equal(
                            'Version',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[3].NewValue).to.include('T');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[3].OldValue).to.include('T');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[3].FieldID).to.equal(
                            'LastUpgradeDateTime',
                        );
                    });

                    it('Downgrade Addon', async () => {
                        //Downgrade with available version
                        const postDowngradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                            .addonUUID(createdAddon.Body.UUID)
                            .downgrade(versionsArr[1].Version);
                        //console.log({ Post_Addon_with_Version: postDowngradeAddonApiResponse });

                        let postAddonApiResponse;
                        let maxLoopsCounter = 90;
                        do {
                            generalService.sleep(2000);
                            postAddonApiResponse = await generalService.papiClient.get(
                                postDowngradeAddonApiResponse.URI as any,
                            );
                            maxLoopsCounter--;
                        } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                        //console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

                        //If no Audit log was found
                        if (postAddonApiResponse == undefined) {
                            postAddonApiResponse = {};
                            //postAddonApiResponse.result = {};
                            postAddonApiResponse.AuditInfo = {};
                            postAddonApiResponse.AuditInfo.ToVersion = {};
                            postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
                        }

                        //Downgrade results
                        expect(postAddonApiResponse.Status.Name).to.equal('Success');

                        //Downgrade version results
                        expect(versionsArr[1].Version).to.equal(postAddonApiResponse.AuditInfo.ToVersion);
                    });

                    it('Validate PNS Triggered After Addon Downgrade', async () => {
                        let schema;
                        let maxLoopsCounter = _MAX_LOOPS;
                        do {
                            generalService.sleep(1500);
                            schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                                order_by: 'CreationDateTime DESC',
                            });
                            maxLoopsCounter--;
                        } while (
                            (!schema[0] || !schema[0].Key.startsWith('Log_Update_PNS_Test') || schema.length < 4) &&
                            maxLoopsCounter > 0
                        );
                        expect(schema[0].Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                            installedAddon.UUID,
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(4);
                        expect(schema[0].Message.FilterAttributes.Resource).to.equal('installed_addons');
                        expect(schema[0].Message.FilterAttributes.Action).to.equal('update');
                        expect(schema[0].Message.FilterAttributes.ModifiedFields).to.deep.equal([
                            'SystemData',
                            'ModificationDate',
                            'Version',
                            'LastUpgradeDateTime',
                        ]);
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].NewValue).to.include(
                            'Pepperitest Test Version ',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].OldValue).to.include(
                            'Pepperitest Test Version ',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].FieldID).to.equal(
                            'SystemData',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[1].NewValue).to.include('T');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[1].OldValue).to.include('T');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[1].FieldID).to.equal(
                            'ModificationDate',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[2].NewValue).to.include(
                            versionsArr[1].Version,
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[2].OldValue).to.include(
                            versionsArr[2].Version,
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[2].FieldID).to.equal(
                            'Version',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[3].NewValue).to.include('T');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[3].OldValue).to.include('T');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[3].FieldID).to.equal(
                            'LastUpgradeDateTime',
                        );
                    });

                    it('Uninstall Addon', async () => {
                        //Uninstall addon
                        const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                            .addonUUID(createdAddon.Body.UUID)
                            .uninstall();
                        //console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

                        let postAddonApiResponse;
                        let maxLoopsCounter = 90;
                        if (postUninstallAddonApiResponse.URI != undefined) {
                            do {
                                generalService.sleep(2000);
                                postAddonApiResponse = await generalService.papiClient.get(
                                    postUninstallAddonApiResponse.URI,
                                );
                                maxLoopsCounter--;
                            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                            //console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                            //Uninstall results
                            expect(postAddonApiResponse.Status.ID).to.equal(1);
                        }
                        //Uninstall Audit Log
                        expect(postUninstallAddonApiResponse).to.have.property('URI');
                    });

                    it('Validate PNS Triggered After Addon Uninstall', async () => {
                        let schema;
                        let maxLoopsCounter = _MAX_LOOPS;
                        do {
                            generalService.sleep(1500);
                            schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                                order_by: 'CreationDateTime DESC',
                            });
                            maxLoopsCounter--;
                        } while (
                            (!schema[0] || !schema[0].Key.startsWith('Log_Update_PNS_Test') || schema.length < 5) &&
                            maxLoopsCounter > 0
                        );
                        expect(schema[0].Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                            installedAddon.UUID,
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(2);
                        expect(schema[0].Message.FilterAttributes.Resource).to.equal('installed_addons');
                        expect(schema[0].Message.FilterAttributes.Action).to.equal('update');
                        expect(schema[0].Message.FilterAttributes.ModifiedFields).to.deep.equal([
                            'Hidden',
                            'ModificationDate',
                        ]);
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].NewValue).to.be.true;
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].OldValue).to.be.false;
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[0].FieldID).to.equal(
                            'Hidden',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[1].NewValue).to.include('T');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[1].OldValue).to.include('T');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[1].FieldID).to.equal(
                            'ModificationDate',
                        );
                    });

                    it('Delete Addon versions', async () => {
                        //Delete Addon
                        for (let index = 0; index < versionsArr.length; index++) {
                            const deleteVersionApiResponse = await generalService.fetchStatus(
                                generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                                    '/var/addons/versions/' +
                                    versionsArr[index].UUID,
                                {
                                    method: `DELETE`,
                                    headers: {
                                        Authorization: request.body.varKey,
                                    },
                                },
                            );
                            if (!deleteVersionApiResponse) {
                                console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                            }
                            expect(deleteVersionApiResponse.Status).to.equal(200);
                            expect(deleteVersionApiResponse.Body).to.be.true;
                        }
                    });

                    it('Delete Addon', async () => {
                        const deleteApiResponse = await generalService.fetchStatus(
                            generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                                '/var/addons/' +
                                createdAddon.Body.UUID,
                            {
                                method: `DELETE`,
                                headers: {
                                    Authorization: request.body.varKey,
                                },
                            },
                        );
                        //console.log({ Post_Var_Addons_Delete: deleteApiResponse });
                        expect(JSON.stringify(deleteApiResponse)).to.not.include('fault');
                        expect(deleteApiResponse.Status).to.equal(200);
                        expect(deleteApiResponse.Body.Success).to.be.true;
                    });

                    it(`Unsubscribe And Validate Get With Where (DI-18054)`, async () => {
                        const subscriptionBody: Subscription = {
                            AddonRelativeURL: '/logger/update_pns_test',
                            Type: 'data',
                            Hidden: true,
                            AddonUUID: PepperiOwnerID,
                            FilterPolicy: {
                                Resource: ['installed_addons' as ResourceTypes],
                                AddonUUID: ['00000000-0000-0000-0000-000000000a91'],
                            },
                            Name: 'Test_Update_PNS',
                        };
                        const subscribeResponse = await pepperiNotificationServiceService.subscribe(subscriptionBody);
                        expect(subscribeResponse)
                            .to.have.property('Name')
                            .a('string')
                            .that.is.equal(subscriptionBody.Name);
                        expect(subscribeResponse).to.have.property('Hidden').a('boolean').that.is.true;

                        const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                            'Test_Update_PNS',
                        );
                        expect(getSubscribeResponse).to.deep.equal([]);
                    });
                });

                describe(`ADAL`, () => {
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

                    it(`Subscribe And Validate Get With Where (DI-18054)`, async () => {
                        generalService.sleep(20000); //To make sure the Subscription is after the Schema changes PNS sent
                        const subscriptionBody: Subscription = {
                            AddonRelativeURL: '/logger/update_pns_test',
                            Type: 'data',
                            AddonUUID: PepperiOwnerID,
                            FilterPolicy: {
                                Resource: ['schemes' as ResourceTypes],
                                AddonUUID: ['00000000-0000-0000-0000-00000000ada1'],
                            },
                            Name: 'Test_Update_PNS',
                        };
                        const subscribeResponse = await pepperiNotificationServiceService.subscribe(subscriptionBody);
                        expect(subscribeResponse)
                            .to.have.property('Name')
                            .a('string')
                            .that.is.equal(subscriptionBody.Name);
                        expect(subscribeResponse)
                            .to.have.property('FilterPolicy')
                            .to.deep.equal({
                                Resource: ['schemes' as ResourceTypes],
                                AddonUUID: ['00000000-0000-0000-0000-00000000ada1'],
                            });

                        const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                            'Test_Update_PNS',
                        );
                        expect(getSubscribeResponse[0])
                            .to.have.property('Name')
                            .a('string')
                            .that.is.equal(subscriptionBody.Name);
                        expect(getSubscribeResponse[0])
                            .to.have.property('FilterPolicy')
                            .to.deep.equal({
                                Resource: ['schemes' as ResourceTypes],
                                AddonUUID: ['00000000-0000-0000-0000-00000000ada1'],
                            });
                    });

                    it(`Create New Schema`, async () => {
                        const schemaName = 'PNS Schema Test';
                        const newSchema = await adalService.postSchema({ Name: schemaName });
                        expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaName);
                        expect(newSchema).to.have.property('Type').a('string').that.is.equal('meta_data');
                    });

                    it('Validate PNS Triggered After New Schema Creation (DI-18069)', async () => {
                        let schema;
                        let maxLoopsCounter = _MAX_LOOPS;
                        do {
                            generalService.sleep(1500);
                            schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                                order_by: 'CreationDateTime DESC',
                            });
                            maxLoopsCounter--;
                        } while (
                            (!schema[0] || !schema[0].Key.startsWith('Log_Update_PNS_Test')) &&
                            maxLoopsCounter > 0
                        );
                        expect(schema[0].Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.include(
                            'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe_PNS Schema Test',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(0);
                        expect(schema[0].Message.FilterAttributes.Resource).to.equal('schemes');
                        expect(schema[0].Message.FilterAttributes.Action).to.equal('insert');
                        expect(schema[0].Message.FilterAttributes.ModifiedFields).to.deep.equal([]);
                    });

                    it(`Create New Schema`, async () => {
                        const schemaName = 'PNS Schema Test';
                        const newSchema = await adalService.postSchema({
                            Name: schemaName,
                            Values: ['Value1', 'Value2', 'Value3'],
                        } as any);
                        expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaName);
                        expect(newSchema['Values'][0]).to.equal('Value1');
                        expect(newSchema['Values'][1]).to.equal('Value2');
                        expect(newSchema['Values'][2]).to.equal('Value3');
                    });

                    it('Validate PNS Triggered After Existing Schema Update (DI-17875)', async () => {
                        let schema;
                        let maxLoopsCounter = _MAX_LOOPS;
                        do {
                            generalService.sleep(1500);
                            schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                                order_by: 'CreationDateTime DESC',
                            });
                            maxLoopsCounter--;
                        } while (
                            (!schema[0] || !schema[0].Key.startsWith('Log_Update_PNS_Test') || schema.length < 2) &&
                            maxLoopsCounter > 0
                        );
                        expect(schema[0].Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.include(
                            'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe_PNS Schema Test',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(3);
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[2].FieldID).to.equal(
                            'Values',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[2].OldValue).to.be.null;
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[2].NewValue[0]).to.equal(
                            'Value1',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[2].NewValue[1]).to.equal(
                            'Value2',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields[2].NewValue[2]).to.equal(
                            'Value3',
                        );
                        expect(schema[0].Message.FilterAttributes.Resource).to.equal('schemes');
                        expect(schema[0].Message.FilterAttributes.Action).to.equal('update');
                        expect(schema[0].Message.FilterAttributes.ModifiedFields).to.deep.equal([
                            'ModificationActionUUID',
                            'ModificationDateTime',
                            'Values',
                        ]);
                    });

                    it(`Delete New Schema`, async () => {
                        const schemaName = 'PNS Schema Test';
                        let purgedSchema;
                        try {
                            purgedSchema = await adalService.deleteSchema(schemaName);
                        } catch (error) {
                            expect(error.message).to.includes(
                                `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must be exist`,
                            );
                        }
                        expect(purgedSchema).to.equal('');
                    });

                    it('Validate PNS Triggered After New Schema Purge', async () => {
                        let schema;
                        let maxLoopsCounter = _MAX_LOOPS;
                        do {
                            generalService.sleep(1500);
                            schema = await adalService.getDataFromSchema(PepperiOwnerID, schemaName, {
                                order_by: 'CreationDateTime DESC',
                            });
                            maxLoopsCounter--;
                        } while (
                            (!schema[0] || !schema[0].Key.startsWith('Log_Update_PNS_Test') || schema.length < 3) &&
                            maxLoopsCounter > 0
                        );
                        expect(schema[0].Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                        expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.include(
                            'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe_PNS Schema Test',
                        );
                        expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(0);
                        expect(schema[0].Message.FilterAttributes.Resource).to.equal('schemes');
                        expect(schema[0].Message.FilterAttributes.Action).to.equal('remove');
                        expect(schema[0].Message.FilterAttributes.ModifiedFields).to.deep.equal([]);
                    });

                    it(`Unsubscribe And Validate Get With Where (DI-18054)`, async () => {
                        const subscriptionBody: Subscription = {
                            AddonRelativeURL: '/logger/update_pns_test',
                            Type: 'data',
                            Hidden: true,
                            AddonUUID: PepperiOwnerID,
                            FilterPolicy: {
                                Resource: ['schemes' as ResourceTypes],
                                AddonUUID: ['00000000-0000-0000-0000-00000000ada1'],
                            },
                            Name: 'Test_Update_PNS',
                        };
                        const subscribeResponse = await pepperiNotificationServiceService.subscribe(subscriptionBody);
                        expect(subscribeResponse)
                            .to.have.property('Name')
                            .a('string')
                            .that.is.equal(subscriptionBody.Name);
                        expect(subscribeResponse).to.have.property('Hidden').a('boolean').that.is.true;

                        const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                            'Test_Update_PNS',
                        );
                        expect(getSubscribeResponse).to.deep.equal([]);
                    });
                });
            });

            describe(`Bugs Verification Scenarios`, () => {
                it(`AddonUUID Is Mandatory When Resource Is Used (DI-18240)`, async () => {
                    const subscriptionBody: Subscription = {
                        AddonRelativeURL: '/logger/update_pns_test',
                        Type: 'data',
                        AddonUUID: PepperiOwnerID,
                        FilterPolicy: {
                            Resource: ['transactions' as ResourceTypes],
                            Action: ['update'],
                            ModifiedFields: ['Remark', 'TaxPercentage', 'ExternalID'],
                            // AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                        },
                        Name: 'Test_Update_PNS',
                    };
                    expect(pepperiNotificationServiceService.subscribe(subscriptionBody)).eventually.to.be.rejectedWith(
                        'notification/subscriptions failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: User cannot subscribe to resource without provide addon uuid and the opposite"',
                    );
                });

                it(`AddonUUID Is Not Mandatory When Resource Is Not Used (DI-18240)`, async () => {
                    const subscriptionBody: Subscription = {
                        AddonRelativeURL: '/logger/update_pns_test',
                        Type: 'data',
                        AddonUUID: PepperiOwnerID,
                        FilterPolicy: {
                            Action: ['update'],
                            ModifiedFields: ['Remark', 'TaxPercentage', 'ExternalID'],
                        },
                        Name: 'Test_Update_PNS',
                    };
                    const subscribeResponse = await pepperiNotificationServiceService.subscribe(subscriptionBody);
                    expect(subscribeResponse).to.have.property('Name').a('string').that.is.equal(subscriptionBody.Name);

                    expect(subscribeResponse)
                        .to.have.property('FilterPolicy')
                        .to.deep.equal({
                            Action: ['update'],
                            ModifiedFields: ['Remark', 'TaxPercentage', 'ExternalID'],
                        });

                    const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                        'Test_Update_PNS',
                    );
                    expect(getSubscribeResponse[0])
                        .to.have.property('Name')
                        .a('string')
                        .that.is.equal(subscriptionBody.Name);

                    expect(getSubscribeResponse[0])
                        .to.have.property('FilterPolicy')
                        .to.deep.equal({
                            Action: ['update'],
                            ModifiedFields: ['Remark', 'TaxPercentage', 'ExternalID'],
                        });
                });

                it(`Uninstall with Hidden Subscription (DI-18241)`, async () => {
                    let deleteAddon = await generalService.papiClient
                        .delete('/addons/installed_addons/00000000-0000-0000-0000-000000040fa9')
                        .then((res) => res.text())
                        .then((res) => (res ? JSON.parse(res) : ''));

                    await expect(deleteAddon).to.have.property('Status').that.is.true;

                    deleteAddon = await generalService.papiClient
                        .delete('/addons/installed_addons/00000000-0000-0000-0000-000000040fa9')
                        .catch((res) => res);

                    await expect(deleteAddon.message).to.include(
                        'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Current user cannot delete this, or UUID was not in the database',
                    );

                    deleteAddon = await generalService.areAddonsInstalled(testData);
                    await expect(deleteAddon[0]).to.be.true;
                });
            });
        });
    });
}
