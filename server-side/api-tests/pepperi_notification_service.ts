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

            describe(`Subscription And Trigger Scenarios`, () => {
                describe(`Transactions`, () => {
                    it(`Subscribe`, async () => {
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

                        const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                            'Test_Update_PNS',
                        );
                        expect(getSubscribeResponse[0])
                            .to.have.property('Name')
                            .a('string')
                            .that.is.equal(subscriptionBody.Name);
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

                    it(`Un Subscribe`, async () => {
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
                    describe('Delete', () => {
                        it('Delete transaction', async () => {
                            expect(await objectsService.deleteTransaction(createdTransaction.InternalID)).to.be.true,
                                expect(await objectsService.deleteTransaction(createdTransaction.InternalID)).to.be
                                    .false,
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

                describe(`Addons`, () => {
                    let createdAddon;
                    let installedAddon;
                    const testAddon: Addon = {
                        Name: 'Pepperitest Test ' + Math.floor(Math.random() * 1000000).toString(),
                    }; //Name here can't be changed or it will send messages VIA teams
                    const versionsArr: AddonVersion[] = [];
                    versionsArr.length = 3;
                    let versiontestAddon;
                    it(`Subscribe`, async () => {
                        const subscriptionBody: Subscription = {
                            AddonRelativeURL: '/logger/update_pns_test',
                            Type: 'data',
                            AddonUUID: PepperiOwnerID,
                            FilterPolicy: {
                                Resource: ['installed_addons'],
                                AddonUUID: ['00000000-0000-0000-0000-000000000a91'],
                            },
                            Name: 'Test_Update_PNS',
                        };
                        const subscribeResponse = await pepperiNotificationServiceService.subscribe(subscriptionBody);
                        expect(subscribeResponse)
                            .to.have.property('Name')
                            .a('string')
                            .that.is.equal(subscriptionBody.Name);

                        const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                            'Test_Update_PNS',
                        );
                        expect(getSubscribeResponse[0])
                            .to.have.property('Name')
                            .a('string')
                            .that.is.equal(subscriptionBody.Name);
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

                        debugger;
                        //Save Installed addon
                        installedAddon = await generalService.papiClient.addons.installedAddons.find({
                            where: `AddonUUID='${postAddonApiResponse.AuditInfo.Addon.UUID}'`,
                        }).then((addonsArr) => addonsArr[0]);

                        debugger;
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
                        try {
                            expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                                installedAddon.UUID,
                            );
                            expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields).to.be.null;
                            expect(schema[0].Message.FilterAttributes.Resource).to.equal('InstalledAddon');
                            expect(schema[0].Message.FilterAttributes.Action).to.equal('update');
                            expect(schema[0].Message.FilterAttributes.ModifiedFields).to.deep.equal([]);
                            expect(schema[1].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                                '00000000-0000-0000-0000-000000000000',
                            );
                            expect(schema[1].Message.Message.ModifiedObjects[0].ModifiedFields).to.deep.equal([]);
                            expect(schema[1].Message.FilterAttributes.Resource).to.equal('InstalledAddon');
                            expect(schema[1].Message.FilterAttributes.Action).to.equal('insert');
                            expect(schema[1].Message.FilterAttributes.ModifiedFields).to.deep.equal([]);
                        } catch (error) {
                            debugger;
                            //The order of the PNS trigger can be diffrent it's not a bug
                            expect(schema[1].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                                installedAddon.UUID,
                            );
                            expect(schema[1].Message.Message.ModifiedObjects[0].ModifiedFields).to.be.null;
                            expect(schema[1].Message.FilterAttributes.Resource).to.equal('InstalledAddon');
                            expect(schema[1].Message.FilterAttributes.Action).to.equal('update');
                            expect(schema[1].Message.FilterAttributes.ModifiedFields).to.deep.equal([]);
                            expect(schema[0].Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                                '00000000-0000-0000-0000-000000000000',
                            );
                            expect(schema[0].Message.Message.ModifiedObjects[0].ModifiedFields).to.deep.equal([]);
                            expect(schema[0].Message.FilterAttributes.Resource).to.equal('InstalledAddon');
                            expect(schema[0].Message.FilterAttributes.Action).to.equal('insert');
                            expect(schema[0].Message.FilterAttributes.ModifiedFields).to.deep.equal([]);
                        }
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
                });
            });
        });
    });
}
