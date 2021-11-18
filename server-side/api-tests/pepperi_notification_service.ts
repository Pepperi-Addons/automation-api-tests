import { Catalog, Subscription, Addon, AddonVersion } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions, ResourceTypes, FilterAttributes } from '../services/general.service';
import { PepperiNotificationServiceService } from '../services/pepperi-notification-service.service';
import { ObjectsService } from '../services/objects.service';
import { ADALService } from '../services/adal.service';
import { v4 as uuidv4 } from 'uuid';

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

    const _Test_UUID_Subscription = uuidv4();
    const _Test_UUID_Second_Addon = uuidv4();
    pepperiNotificationServiceService.papiClient['options'].actionUUID = _Test_UUID_Subscription;

    //#region Upgrade Pepperi Notification Service
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Pepperi Notification Service': ['00000000-0000-0000-0000-000000040fa9', ''],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.chnageVersion(request.body.varKey, testData, false);
    //#endregion Upgrade Pepperi Notification Service

    describe('Pepperi Notification Service Tests Suites', () => {
        const schemaName = 'PNS Test';
        const _MAX_LOOPS = 40;
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
        });

        describe(`Subscription And Trigger Scenarios`, () => {
            describe(`Transactions (DI-17682)`, () => {
                it(`Reset Schema`, async () => {
                    const schemaNameArr = [schemaName];
                    let purgedSchema;
                    for (let index = 0; index < schemaNameArr.length; index++) {
                        try {
                            purgedSchema = await adalService.deleteSchema(schemaNameArr[index]);
                        } catch (error) {
                            expect(error)
                                .to.have.property('message')
                                .that.includes(
                                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist`,
                                );
                        }
                        const newSchema = await adalService.postSchema({ Name: schemaNameArr[index] });
                        expect(purgedSchema).to.equal('');
                        expect(newSchema).to.have.property('Name').a('string').that.is.equal(schemaNameArr[index]);
                        expect(newSchema).to.have.property('Type').a('string').that.is.equal('meta_data');
                    }
                });

                it(`Subscribe And Validate Get With Where (DI-18054) (Test GUID: ${_Test_UUID_Subscription}`, async () => {
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
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                        Resource: ['transactions'],
                        Action: ['update'],
                        ModifiedFields: ['Remark', 'TaxPercentage', 'ExternalID'],
                    };
                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_PNS_Test',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );
                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(createdTransaction.UUID);
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields).to.deep.equal([
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
                    expect(subscribeResponse).to.have.property('Name').a('string').that.is.equal(subscriptionBody.Name);
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
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                        Resource: ['transactions'],
                        Action: ['update'],
                        ModifiedFields: ['Remark', 'TaxPercentage', 'ExternalID'],
                    };
                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_PNS_Test',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );
                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(createdTransaction.UUID);
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields).to.deep.equal([
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
                            expect(error)
                                .to.have.property('message')
                                .that.includes(
                                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist`,
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
                    expect(subscribeResponse).to.have.property('Name').a('string').that.is.equal(subscriptionBody.Name);
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
                            Version: '0.0.' + (index + 1), //Name here can't be changed or it will send messages VIA teams
                        };
                        versiontestAddon.Phased = true;
                        versiontestAddon.StartPhasedDateTime = new Date().toJSON();
                        versionsArr[index] = await generalService
                            .fetchStatus(
                                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
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
                    expect(versionsArr[0].Version).to.contain('0.0.1');
                    expect(versionsArr[1].Version).to.contain('0.0.2');
                    expect(versionsArr[2].Version).to.contain('0.0.3');
                });

                it('Install Addon', async () => {
                    //Install with available version
                    const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                        .addonUUID(createdAddon.Body.UUID)
                        .install(versionsArr[0].Version);
                    //console.log({ Post_Addon_with_Version: postInstallAddonApiResponse });

                    let postAddonApiResponse;
                    let maxLoopsCounter = _MAX_LOOPS;
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

                it(`Subscribe With New Addon With Wrong AddonRelativeURL (Negative) ${_Test_UUID_Second_Addon}`, async () => {
                    const addonSK = await generalService.getSecretKey(createdAddon.Body.UUID);
                    const subscriptionBody: Subscription = {
                        AddonRelativeURL: '/test',
                        Type: 'data',
                        AddonUUID: createdAddon.Body.UUID,
                        FilterPolicy: {},
                        Name: 'Subscription_Removal_Test',
                    };

                    const negativeSubsciptionPostResponse = await generalService.fetchStatus(
                        '/notification/subscriptions',
                        {
                            method: 'POST',
                            body: JSON.stringify(subscriptionBody),
                            headers: {
                                'X-Pepperi-ActionID': _Test_UUID_Second_Addon,
                                'X-Pepperi-OwnerID': createdAddon.Body.UUID,
                                'X-Pepperi-SecretKey': addonSK,
                            },
                        },
                    );

                    expect(negativeSubsciptionPostResponse.Status).to.equal(400);
                    expect(negativeSubsciptionPostResponse.Body.fault.faultstring).to.contain(
                        'Failed due to exception: Invalid parameter AddonRelativeURL',
                    );
                });

                it(`Subscribe With New Addon (Test GUID: ${_Test_UUID_Second_Addon}`, async () => {
                    const addonSK = await generalService.getSecretKey(createdAddon.Body.UUID);
                    const subscriptionBody: Subscription = {
                        AddonRelativeURL: '/test/go',
                        Type: 'data',
                        AddonUUID: createdAddon.Body.UUID,
                        FilterPolicy: {},
                        Name: 'Subscription_Removal_Test',
                    };

                    const subsciptionPostResponse = await generalService.fetchStatus('/notification/subscriptions', {
                        method: 'POST',
                        body: JSON.stringify(subscriptionBody),
                        headers: {
                            'X-Pepperi-ActionID': _Test_UUID_Second_Addon,
                            'X-Pepperi-OwnerID': createdAddon.Body.UUID,
                            'X-Pepperi-SecretKey': addonSK,
                        },
                    });

                    expect(subsciptionPostResponse.Status).to.equal(200);
                    expect(subsciptionPostResponse.Body.Name).to.equal('Subscription_Removal_Test');

                    const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                        'Subscription_Removal_Test',
                    );

                    expect(getSubscribeResponse[0])
                        .to.have.property('Name')
                        .a('string')
                        .that.is.equal(subscriptionBody.Name);
                    expect(getSubscribeResponse[0]).to.have.property('FilterPolicy').to.deep.equal({});
                });

                it('Validate PNS Triggered After Addon Installation', async () => {
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-000000000a91'],
                        Resource: ['installed_addons'],
                        Action: ['insert'],
                        ModifiedFields: [],
                    };
                    let schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_PNS_Test',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );
                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(
                        '00000000-0000-0000-0000-000000000000',
                    );
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields).to.be.null;
                    expect(schema.Message.FilterAttributes.Resource).to.equal('installed_addons');
                    expect(schema.Message.FilterAttributes.Action).to.equal('insert');
                    expect(schema.Message.FilterAttributes.ModifiedFields).to.deep.equal([]);

                    filter.Action = ['update'];
                    schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_PNS_Test',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );
                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(installedAddon.UUID);
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(0);
                    expect(schema.Message.FilterAttributes.Resource).to.equal('installed_addons');
                    expect(schema.Message.FilterAttributes.Action).to.equal('update');
                    expect(schema.Message.FilterAttributes.ModifiedFields).to.deep.equal([]);
                });

                it('Upgrade Addon', async () => {
                    //Upgrade with available version
                    const postUpgradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                        .addonUUID(createdAddon.Body.UUID)
                        .upgrade(versionsArr[2].Version);
                    //console.log({ Post_Addon_with_Version: postUpgradeAddonApiResponse });

                    let postAddonApiResponse;
                    let maxLoopsCounter = _MAX_LOOPS;
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
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-000000000a91'],
                        Resource: ['installed_addons'],
                        Action: ['update'],
                        ModifiedFields: ['SystemData', 'ModificationDate', 'Version', 'LastUpgradeDateTime'],
                    };
                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_PNS_Test',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );
                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(installedAddon.UUID);
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(4);
                    expect(schema.Message.FilterAttributes.Resource).to.equal('installed_addons');
                    expect(schema.Message.FilterAttributes.Action).to.equal('update');
                    expect(schema.Message.FilterAttributes.ModifiedFields).to.deep.equal([
                        'SystemData',
                        'ModificationDate',
                        'Version',
                        'LastUpgradeDateTime',
                    ]);
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0].NewValue).to.include('0.0.');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0].OldValue).to.equal('{}');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0].FieldID).to.equal('SystemData');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].NewValue).to.include('T');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].OldValue).to.include('T');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].FieldID).to.equal(
                        'ModificationDate',
                    );
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[2].NewValue).to.include(
                        versionsArr[2].Version,
                    );
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[2].OldValue).to.include(
                        versionsArr[0].Version,
                    );
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[2].FieldID).to.equal('Version');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[3].NewValue).to.include('T');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[3].OldValue).to.include('T');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[3].FieldID).to.equal(
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
                    let maxLoopsCounter = _MAX_LOOPS;
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
                    generalService.sleep(5000); //This is added to reduce flakyness of this test on the server - but as any PNS test - this can be flaky
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-000000000a91'],
                        Resource: ['installed_addons'],
                        Action: ['update'],
                        ModifiedFields: ['SystemData', 'ModificationDate', 'Version', 'LastUpgradeDateTime'],
                    };
                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_PNS_Test',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );
                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(installedAddon.UUID);
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(4);
                    expect(schema.Message.FilterAttributes.Resource).to.equal('installed_addons');
                    expect(schema.Message.FilterAttributes.Action).to.equal('update');
                    expect(schema.Message.FilterAttributes.ModifiedFields).to.deep.equal([
                        'SystemData',
                        'ModificationDate',
                        'Version',
                        'LastUpgradeDateTime',
                    ]);
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0].NewValue).to.include('0.0.');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0].OldValue).to.include('0.0.');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0].FieldID).to.equal('SystemData');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].NewValue).to.include('T');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].OldValue).to.include('T');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].FieldID).to.equal(
                        'ModificationDate',
                    );
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[2].NewValue).to.include(
                        versionsArr[1].Version,
                    );
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[2].OldValue).to.include(
                        versionsArr[2].Version,
                    );
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[2].FieldID).to.equal('Version');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[3].NewValue).to.include('T');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[3].OldValue).to.include('T');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[3].FieldID).to.equal(
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
                    let maxLoopsCounter = _MAX_LOOPS;
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

                it('Validate Subscription Removed After Addon Uninstall (DI-17910)', async () => {
                    let getSubscribeResponse;
                    let maxLoopsCounter = _MAX_LOOPS;
                    do {
                        generalService.sleep(2000);
                        getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                            'Subscription_Removal_Test',
                        );
                        maxLoopsCounter--;
                    } while (getSubscribeResponse[0] && maxLoopsCounter > 0);
                    expect(getSubscribeResponse).to.deep.equal([]);
                });

                it('Validate PNS Triggered After Addon Uninstall', async () => {
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-000000000a91'],
                        Resource: ['installed_addons'],
                        Action: ['update'],
                        ModifiedFields: ['Hidden', 'ModificationDate'],
                    };
                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_PNS_Test',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );
                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.deep.equal(installedAddon.UUID);
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(2);
                    expect(schema.Message.FilterAttributes.Resource).to.equal('installed_addons');
                    expect(schema.Message.FilterAttributes.Action).to.equal('update');
                    expect(schema.Message.FilterAttributes.ModifiedFields).to.deep.equal([
                        'Hidden',
                        'ModificationDate',
                    ]);
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0].NewValue).to.be.true;
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0].OldValue).to.be.false;
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[0].FieldID).to.equal('Hidden');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].NewValue).to.include('T');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].OldValue).to.include('T');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].FieldID).to.equal(
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
                    expect(subscribeResponse).to.have.property('Name').a('string').that.is.equal(subscriptionBody.Name);
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
                            expect(error)
                                .to.have.property('message')
                                .that.includes(
                                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist`,
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
                    expect(subscribeResponse).to.have.property('Name').a('string').that.is.equal(subscriptionBody.Name);
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
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-00000000ada1'],
                        Resource: ['schemes'],
                        Action: ['insert'],
                        ModifiedFields: [],
                    };
                    let schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_PNS_Test',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );

                    //In case of mixing the order of schemas, remove the schema and try to get the correct one again
                    if (!Array.isArray(schema)) {
                        await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
                            Key: schema.Key,
                            IsTested: true,
                        });
                        if (schema.Message.Message.ModifiedObjects[0].ObjectKey.includes('PNS Test')) {
                            schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                                'Log_Update_PNS_Test',
                                PepperiOwnerID,
                                schemaName,
                                filter,
                            );
                        }
                    }

                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.include(
                        'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe_PNS Schema Test',
                    );
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(0);
                    expect(schema.Message.FilterAttributes.Resource).to.equal('schemes');
                    expect(schema.Message.FilterAttributes.Action).to.equal('insert');
                    expect(schema.Message.FilterAttributes.ModifiedFields).to.deep.equal([]);
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
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-00000000ada1'],
                        Resource: ['schemes'],
                        Action: ['update'],
                        ModifiedFields: ['ModificationDateTime', 'Values'],
                    };
                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_PNS_Test',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );
                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.include(
                        'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe_PNS Schema Test',
                    );
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(2); //(3); Changed when Action ID was added to PNS (12/07/2021)
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].FieldID).to.equal('Values');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].OldValue).to.be.null;
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].NewValue[0]).to.equal('Value1');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].NewValue[1]).to.equal('Value2');
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields[1].NewValue[2]).to.equal('Value3');
                    expect(schema.Message.FilterAttributes.Resource).to.equal('schemes');
                    expect(schema.Message.FilterAttributes.Action).to.equal('update');
                    expect(schema.Message.FilterAttributes.ModifiedFields).to.deep.equal([
                        //'ModificationActionUUID', // Changed when Action ID was added to PNS (12/07/2021)
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
                        expect(error)
                            .to.have.property('message')
                            .that.includes(
                                `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist`,
                            );
                    }
                    expect(purgedSchema).to.equal('');
                });

                it('Validate PNS Triggered After New Schema Purge', async () => {
                    const filter: FilterAttributes = {
                        AddonUUID: ['00000000-0000-0000-0000-00000000ada1'],
                        Resource: ['schemes'],
                        Action: ['remove'],
                        ModifiedFields: [],
                    };
                    const schema = await generalService.getLatestSchemaByKeyAndFilterAttributes(
                        'Log_Update_PNS_Test',
                        PepperiOwnerID,
                        schemaName,
                        filter,
                    );
                    expect(schema, JSON.stringify(schema)).to.not.be.an('array');
                    expect(schema.Key).to.be.a('String').and.contain('Log_Update_PNS_Test');
                    expect(schema.Message.Message.ModifiedObjects[0].ObjectKey).to.include(
                        'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe_PNS Schema Test',
                    );
                    expect(schema.Message.Message.ModifiedObjects[0].ModifiedFields.length).to.equal(0);
                    expect(schema.Message.FilterAttributes.Resource).to.equal('schemes');
                    expect(schema.Message.FilterAttributes.Action).to.equal('remove');
                    expect(schema.Message.FilterAttributes.ModifiedFields).to.deep.equal([]);
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
                    expect(subscribeResponse).to.have.property('Name').a('string').that.is.equal(subscriptionBody.Name);
                    expect(subscribeResponse).to.have.property('Hidden').a('boolean').that.is.true;

                    const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                        'Test_Update_PNS',
                    );
                    expect(getSubscribeResponse).to.deep.equal([]);
                });
            });

            describe(`Sync And Async PNS Scenarios`, () => {
                const _SYNC_SCHEMA_NAME = 'PNS Sync Test';
                it(`Reset Schema`, async () => {
                    let purgedSchema;
                    try {
                        purgedSchema = await adalService.deleteSchema(_SYNC_SCHEMA_NAME);
                    } catch (error) {
                        expect(error)
                            .to.have.property('message')
                            .that.includes(
                                `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist`,
                            );
                    }
                    const newSchema = await adalService.postSchema({ Name: _SYNC_SCHEMA_NAME });
                    expect(purgedSchema).to.equal('');
                    expect(newSchema).to.have.property('Name').a('string').that.is.equal(_SYNC_SCHEMA_NAME);
                    expect(newSchema).to.have.property('Type').a('string').that.is.equal('meta_data');
                });

                it(`Subscribe And Validate Get With Where (DI-18054) (Test GUID: ${_Test_UUID_Subscription}`, async () => {
                    const subscriptionBody: Subscription = {
                        AddonRelativeURL: '/logger/sync_pns_test',
                        Type: 'data',
                        AddonUUID: PepperiOwnerID,
                        FilterPolicy: {
                            Resource: ['transactions' as ResourceTypes],
                            Action: ['insert'],
                            AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                        },
                        Name: 'Test_Update_PNS',
                    };
                    const subscribeResponse = await pepperiNotificationServiceService.subscribe(subscriptionBody);
                    expect(subscribeResponse).to.have.property('Name').a('string').that.is.equal(subscriptionBody.Name);
                    expect(subscribeResponse)
                        .to.have.property('FilterPolicy')
                        .to.deep.equal({
                            Resource: ['transactions' as ResourceTypes],
                            Action: ['insert'],
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
                            Action: ['insert'],
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

                it('Validate PNS Triggered After Creation', async () => {
                    let schemaArr;
                    //Loops should take more then 45 seconds, since sleep time in the server side is 40 second before response is sent + 30 second until first api call fails
                    let maxLoopsCounter = 120;
                    do {
                        generalService.sleep(1500);
                        schemaArr = await adalService.getDataFromSchema(PepperiOwnerID, _SYNC_SCHEMA_NAME, {
                            order_by: 'CreationDateTime DESC',
                        });
                        maxLoopsCounter--;
                    } while (
                        schemaArr.filter(
                            (schema) => schema.Description === 'This schema update created after 40 seconds of sleep',
                        ).length <= 0 &&
                        maxLoopsCounter > 0
                    );

                    const firstSyncSchema = schemaArr.pop();
                    let secondAsyncShema = schemaArr.filter(
                        (schema) => schema.Description === 'This schema update created after 40 seconds of sleep',
                    );
                    secondAsyncShema = secondAsyncShema.pop();
                    expect(firstSyncSchema.Description).to.equal('This schema update created synchronically');
                    expect(secondAsyncShema.Description).to.equal(
                        'This schema update created after 40 seconds of sleep',
                    );

                    delete firstSyncSchema.Body.ModifiedFields;
                    delete secondAsyncShema.Body.ModifiedFields;
                    expect(firstSyncSchema.Body).to.deep.equal(secondAsyncShema.Body);

                    expect(firstSyncSchema.Path).to.not.equal(secondAsyncShema.Path);
                    expect(firstSyncSchema.Path).to.include(
                        '/addons/api/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/logger/sync_pns_test',
                    );
                    expect(secondAsyncShema.Path).to.include(
                        '/addons/api/async/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/logger/sync_pns_test',
                    );
                });

                it(`Unsubscribe And Validate Get With Where (DI-18054)`, async () => {
                    const subscriptionBody: Subscription = {
                        AddonRelativeURL: '/logger/update_pns_test',
                        Type: 'data',
                        Hidden: true,
                        AddonUUID: PepperiOwnerID,
                        FilterPolicy: {
                            Resource: ['transactions' as ResourceTypes],
                            Action: ['insert'],
                            AddonUUID: ['00000000-0000-0000-0000-00000000c07e'],
                        },
                        Name: 'Test_Update_PNS',
                    };
                    const subscribeResponse = await pepperiNotificationServiceService.subscribe(subscriptionBody);
                    expect(subscribeResponse).to.have.property('Name').a('string').that.is.equal(subscriptionBody.Name);
                    expect(subscribeResponse).to.have.property('Hidden').a('boolean').that.is.true;

                    const getSubscribeResponse = await pepperiNotificationServiceService.getSubscriptionsbyName(
                        'Test_Update_PNS',
                    );
                    expect(getSubscribeResponse).to.deep.equal([]);
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
                    'notification/subscriptions failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Invalid parameter addon_uuid and resource, User cannot subscribe to resource without provide addon uuid and the opposite"',
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

            it(`PNS Remove And Restore Subscription Inside Installation (DI-18555, DI-18570, DI-18389)`, async () => {
                const testDataAddonUUID = 'd9999883-ef9a-4295-99db-2f1d3fc34af6';
                const testDataAddonVersion = '0.0.36';
                const testDataAddonSchemaName = 'TypeScript Installation Schema';

                //Uninstall
                const uninstallAddonBeforeTest = await generalService.papiClient.addons.installedAddons
                    .addonUUID(testDataAddonUUID)
                    .uninstall();

                expect(uninstallAddonBeforeTest).to.have.property('URI');
                const uninstallAddonBeforeTestApiResponse = await generalService.getAuditLogResultObjectIfValid(
                    uninstallAddonBeforeTest.URI as string,
                    40,
                );
                expect(uninstallAddonBeforeTestApiResponse.Status?.ID).to.be.not.equal(
                    2,
                    'Failed To Remove NG-10 Addon',
                );

                //Install
                const installedAddon = await generalService.papiClient.addons.installedAddons
                    .addonUUID(testDataAddonUUID)
                    .install(testDataAddonVersion);

                expect(installedAddon).to.have.property('URI');
                const installedAddonApiResponse = await generalService.getAuditLogResultObjectIfValid(
                    installedAddon.URI as string,
                    40,
                );
                expect(installedAddonApiResponse.Status?.ID).to.be.equal(1, 'Install Failed');

                //Validate Subscription created
                generalService.sleep(4000); //The test if flaky in EU - This should solve it but if not, the test should fail
                let getSubscriptionsResponse = await pepperiNotificationServiceService.findSubscriptions();
                const expectedSubscriptions = [
                    'uninstalled-addon-adal-subscription',
                    'uninstalled-addon-pns-subscription',
                    'Test_Update_PNS',
                ];
                let testResults = [false, false, false];
                for (let index = 0; index < getSubscriptionsResponse.length; index++) {
                    const subscription = getSubscriptionsResponse[index];
                    if (
                        subscription.Name == expectedSubscriptions[0] &&
                        subscription.AddonUUID == '00000000-0000-0000-0000-00000000ada1'
                    ) {
                        testResults[0] = true;
                    } else if (
                        subscription.Name == expectedSubscriptions[1] &&
                        subscription.AddonUUID == '00000000-0000-0000-0000-000000040fa9'
                    ) {
                        testResults[1] = true;
                    } else if (
                        subscription.Name == expectedSubscriptions[2] &&
                        subscription.AddonUUID == 'd9999883-ef9a-4295-99db-2f1d3fc34af6'
                    ) {
                        testResults[2] = true;
                    }
                }

                expect(testResults[0]).to.be.equal(true, 'Missing Subscription: uninstalled-addon-adal-subscription');
                expect(testResults[1]).to.be.equal(true, 'Missing Subscription: uninstalled-addon-pns-subscription');
                expect(testResults[2]).to.be.equal(true, 'Missing Subscription: Test_Update_PNS');

                //Validate Schema created
                let schema;
                let maxLoopsCounter = 12;
                do {
                    generalService.sleep(1500);
                    schema = await adalService.getDataFromSchema(testDataAddonUUID, testDataAddonSchemaName);
                    maxLoopsCounter--;
                } while (schema[0] == undefined && maxLoopsCounter > 0);

                expect(schema[0]).to.be.undefined;
                schema = await generalService.fetchStatus('/addons/data/schemes', {
                    method: `GET`,
                    headers: {
                        'X-Pepperi-OwnerID': testDataAddonUUID,
                    },
                });
                expect(schema.Body[0].Name).to.equal(testDataAddonSchemaName);

                const uninstallAddon = await generalService.papiClient.addons.installedAddons
                    .addonUUID(testDataAddonUUID)
                    .uninstall();
                expect(uninstallAddon).to.have.property('URI');

                const uninstallAddonApiResponse = await generalService.getAuditLogResultObjectIfValid(
                    uninstallAddon.URI as string,
                    40,
                );
                expect(uninstallAddonApiResponse.Status?.ID).to.be.equal(1, 'Uninstall Faild');
                generalService.sleep(1500);

                //Validate Subscription created
                maxLoopsCounter = _MAX_LOOPS;
                let removedSubscription;
                do {
                    generalService.sleep(3000);
                    getSubscriptionsResponse = await pepperiNotificationServiceService.findSubscriptions();
                    maxLoopsCounter--;
                    removedSubscription = getSubscriptionsResponse.filter((subscription) => {
                        subscription.Name == expectedSubscriptions[2];
                    });
                } while (removedSubscription.length != 0 && maxLoopsCounter > 0);

                testResults = [false, false, false];
                for (let index = 0; index < getSubscriptionsResponse.length; index++) {
                    const subscription = getSubscriptionsResponse[index];
                    if (
                        subscription.Name == expectedSubscriptions[0] &&
                        subscription.AddonUUID == '00000000-0000-0000-0000-00000000ada1'
                    ) {
                        testResults[0] = true;
                    } else if (
                        subscription.Name == expectedSubscriptions[1] &&
                        subscription.AddonUUID == '00000000-0000-0000-0000-000000040fa9'
                    ) {
                        testResults[1] = true;
                    } else if (
                        subscription.Name == expectedSubscriptions[2] &&
                        subscription.AddonUUID == 'd9999883-ef9a-4295-99db-2f1d3fc34af6'
                    ) {
                        testResults[2] = true;
                    }
                }

                expect(testResults[0]).to.be.equal(true, 'Missing Subscription: uninstalled-addon-adal-subscription');
                expect(testResults[1]).to.be.equal(true, 'Missing Subscription: uninstalled-addon-pns-subscription');
                expect(testResults[2]).to.be.equal(false, 'Subscription Not Remved (DI-18555): Test_Update_PNS');

                //Validate Schema created
                await expect(
                    adalService.getDataFromSchema(testDataAddonUUID, testDataAddonSchemaName),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Table schema must exist, for table = TypeScript Installation Schema`,
                );
            });

            it(`Uninstall with Hidden Subscription (DI-18241)`, async () => {
                const uninstalledAddon = await generalService.papiClient.addons.installedAddons
                    .addonUUID(testData['Pepperi Notification Service'][0])
                    .uninstall();

                expect(uninstalledAddon).to.have.property('URI');

                const postAddonApiResponse = await generalService.getAuditLogResultObjectIfValid(
                    uninstalledAddon.URI as string,
                    40,
                );

                expect(postAddonApiResponse.Status?.ID).to.be.equal(1);

                const deleteAddon = await generalService.papiClient
                    .delete(`/addons/installed_addons/${testData['Pepperi Notification Service'][0]}`)
                    .catch((res) => res);

                expect(deleteAddon.message).to.include(
                    'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Current user cannot delete this, or UUID was not in the database',
                );

                const installAddon = await generalService.areAddonsInstalled(testData);
                expect(installAddon[0]).to.be.true;
                expect(installAddon[1]).to.be.true;
            });

            it(`Verify ADAL Upgraded After PNS`, async () => {
                //Downgrade ADAL
                let downgradeAddon = await generalService.papiClient.addons.installedAddons
                    .addonUUID(testData['Pepperi Notification Service'][0])
                    .downgrade('1.0.101');

                expect(downgradeAddon).to.have.property('URI');

                let postDowngradeApiResponse = await generalService.getAuditLogResultObjectIfValid(
                    downgradeAddon.URI as string,
                    40,
                );

                expect(postDowngradeApiResponse.Status?.ID).to.be.equal(1);

                //Downgrade PNS
                downgradeAddon = await generalService.papiClient.addons.installedAddons
                    .addonUUID(testData['ADAL'][0])
                    .downgrade('1.0.131');

                expect(downgradeAddon).to.have.property('URI');

                postDowngradeApiResponse = await generalService.getAuditLogResultObjectIfValid(
                    downgradeAddon.URI as string,
                    40,
                );

                expect(postDowngradeApiResponse.Status?.ID).to.be.equal(1);

                //Upgrade ADAL
                let upgradeAddon = await generalService.papiClient.addons.installedAddons
                    .addonUUID(testData['Pepperi Notification Service'][0])
                    .upgrade('1.0.110');

                expect(upgradeAddon).to.have.property('URI');

                let postUpgradeApiResponse = await generalService.getAuditLogResultObjectIfValid(
                    upgradeAddon.URI as string,
                    40,
                );

                expect(postUpgradeApiResponse.Status?.ID).to.be.equal(1);

                //Upgrade PNS
                upgradeAddon = await generalService.papiClient.addons.installedAddons
                    .addonUUID(testData['ADAL'][0])
                    .upgrade('1.0.167');

                expect(upgradeAddon).to.have.property('URI');

                postUpgradeApiResponse = await generalService.getAuditLogResultObjectIfValid(
                    upgradeAddon.URI as string,
                    40,
                );

                expect(postUpgradeApiResponse.Status?.ID).to.be.equal(1);
            });
        });
    });
}
