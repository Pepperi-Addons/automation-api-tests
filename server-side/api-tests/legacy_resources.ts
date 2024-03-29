import GeneralService, { TesterFunctions } from '../services/general.service';
import { ObjectsService } from '../services/objects.service';
import { LegacyResourcesService } from '../services/legacy-resources.service';
import { v4 as newUuid } from 'uuid';

export async function LegacyResourcesTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const objectsService = new ObjectsService(generalService);
    const service = new LegacyResourcesService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade Legacy Resources
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
    };

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }

    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    //#endregion Upgrade Legacy Resources

    describe('Legacy Resources Test Suites', () => {
        describe('Prerequisites Addon for Legacy Resources Tests', () => {
            //Test Data
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

        describe('Items', () => {
            console.log('Saar: Items');
            let items;
            let legacyItemExternalID;
            let itemExternalID;
            let legacyCreatedItem;
            // let createdItem;
            let mainCategoryID;
            let updatedItem;
            let legacyUpdatedItem;
            let legacyPageItems;
            let itemAfterManipulation;

            it('Create Item', async () => {
                console.log('Saar: Create item');
                items = await objectsService.getItems();
                mainCategoryID = items[0].MainCategoryID;
                itemExternalID = 'Automated API Item' + Math.floor(Math.random() * 1000000).toString();
                legacyItemExternalID = 'Automated API Item' + Math.floor(Math.random() * 1000000).toString();

                // createdItem = await objectsService.postItem({
                //     ExternalID: itemExternalID,
                //     MainCategoryID: mainCategoryID,
                // });

                legacyCreatedItem = await service.post('items', {
                    ExternalID: legacyItemExternalID,
                    MainCategoryID: mainCategoryID,
                });

                expect(legacyCreatedItem).to.have.property('InternalID').that.is.a('number');
                expect(legacyCreatedItem).to.have.property('ExternalID').that.equals(legacyItemExternalID);
                expect(legacyCreatedItem).to.have.property('Key').that.is.a('string').with.lengthOf(36);
                expect(legacyCreatedItem).to.have.property('MainCategory').that.equals(mainCategoryID);
                expect(legacyCreatedItem).to.have.property('UPC');
                expect(legacyCreatedItem).to.have.property('Name');
                expect(legacyCreatedItem).to.have.property('LongDescription');
                expect(legacyCreatedItem).to.have.property('Image');
                expect(legacyCreatedItem).to.have.property('Price');
                expect(legacyCreatedItem).to.have.property('CostPrice');
                expect(legacyCreatedItem).to.have.property('AllowDecimal').that.is.a('boolean');
                expect(legacyCreatedItem).to.have.property('Prop1');
                expect(legacyCreatedItem).to.have.property('Prop2');
                expect(legacyCreatedItem).to.have.property('Prop3');
                expect(legacyCreatedItem).to.have.property('Prop4');
                expect(legacyCreatedItem).to.have.property('Prop5');
                expect(legacyCreatedItem).to.have.property('Prop6');
                expect(legacyCreatedItem).to.have.property('Prop7');
                expect(legacyCreatedItem).to.have.property('Prop8');
                expect(legacyCreatedItem).to.have.property('Prop9');
                expect(legacyCreatedItem).to.have.property('Hidden').that.is.a('boolean');
                expect(legacyCreatedItem.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedItem.CreationDateTime).to.include('Z');
                expect(legacyCreatedItem.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedItem.ModificationDateTime).to.include('Z');
            });

            it('Update Item', async () => {
                console.log('Saar: Update Item');
                updatedItem = await objectsService.postItem({
                    ExternalID: itemExternalID,
                    MainCategoryID: mainCategoryID,
                    CaseQuantity: 5,
                    Name: 'Testing12345',
                    Price: 25,
                });

                legacyUpdatedItem = await service.post('items', {
                    ExternalID: legacyItemExternalID,
                    MainCategoryID: mainCategoryID,
                    CaseQuantity: 5,
                    Name: 'Testing12345',
                    Price: 25,
                });
                expect(updatedItem.AllowDecimal).to.equal(legacyUpdatedItem.AllowDecimal);
                expect(updatedItem.CostPrice).to.equal(legacyUpdatedItem.CostPrice);
                expect(updatedItem.Hidden).to.equal(legacyUpdatedItem.Hidden);
                expect(updatedItem.LongDescription).to.equal(legacyUpdatedItem.LongDescription);
                expect(updatedItem.MainCategory).to.equal(legacyUpdatedItem.MainCategory);
                expect(updatedItem.Name).to.equal(legacyUpdatedItem.Name);
                expect(updatedItem.Price).to.equal(legacyUpdatedItem.Price);
                expect(updatedItem.Prop1).to.equal(legacyUpdatedItem.Prop1);
                expect(updatedItem.Prop2).to.equal(legacyUpdatedItem.Prop2);
                expect(updatedItem.Prop3).to.equal(legacyUpdatedItem.Prop3);
                expect(updatedItem.Prop4).to.equal(legacyUpdatedItem.Prop4);
                expect(updatedItem.Prop5).to.equal(legacyUpdatedItem.Prop5);
                expect(updatedItem.Prop6).to.equal(legacyUpdatedItem.Prop6);
                expect(updatedItem.Prop7).to.equal(legacyUpdatedItem.Prop7);
                expect(updatedItem.Prop8).to.equal(legacyUpdatedItem.Prop8);
                expect(updatedItem.Prop9).to.equal(legacyUpdatedItem.Prop9);
            });

            it('Get Item by key', async () => {
                console.log('Saar: Get Item by key');
                const itemAfterUpdate = await objectsService.getItems({
                    where: `InternalID like '${legacyCreatedItem.InternalID}'`,
                });
                itemAfterManipulation = await service.papiCoreComparisonSingle(itemAfterUpdate[0], 'items');
                const getByKeyItem = await service.getByKey('items', legacyCreatedItem.Key);
                delete getByKeyItem['ParentExternalID'];
                expect(getByKeyItem).to.deep.equal(itemAfterManipulation);
                await expect(service.getByKey('items', '1234')).eventually.to.be.rejected;
            });

            it('Get Item by Unique key', async () => {
                console.log('Saar: Get Item by Unique key');
                const getItemByInternalID = await service.getByUniqueKey(
                    'items',
                    'InternalID',
                    legacyCreatedItem.InternalID,
                );
                delete getItemByInternalID['ParentExternalID'];
                expect(getItemByInternalID).to.deep.equal(itemAfterManipulation);
                const getItemByExternalID = await service.getByUniqueKey(
                    'items',
                    'ExternalID',
                    legacyCreatedItem.ExternalID,
                );
                delete getItemByExternalID['ParentExternalID'];
                expect(getItemByExternalID).to.deep.equal(itemAfterManipulation);
                const getItemByKey = await service.getByUniqueKey('items', 'Key', legacyCreatedItem.Key);
                delete getItemByKey['ParentExternalID'];
                expect(getItemByKey).to.deep.equal(itemAfterManipulation);
                await expect(service.getByUniqueKey('items', 'InternalID', '123412')).eventually.to.be.rejected;
                await expect(service.getByUniqueKey('items', 'Price', '123412')).eventually.to.be.rejected;
            });

            describe('Items search', () => {
                let legacyItems;
                it('Where', async () => {
                    console.log('Saar: Items search WHERE');
                    const whereItems = await objectsService.getItems({
                        where: `ExternalID like '%Automated API Item%'`,
                    });
                    const legacyWhereItems = await service.search('items', {
                        Where: `ExternalID like '%Automated API Item%'`,
                    });
                    expect(whereItems.length).to.equal(legacyWhereItems.Objects.length);
                });

                it('Page and PageSize', async () => {
                    console.log('Saar: Items search Page and PageSize');
                    legacyItems = await service.get('items?page_size=-1');
                    legacyPageItems;
                    legacyPageItems = await service.search('items', {
                        Page: 1,
                        PageSize: 1,
                    });
                    expect(legacyPageItems.Objects.length).to.equal(1);
                    expect(legacyPageItems.Objects[0]).to.deep.equal(legacyItems[0]);
                    legacyPageItems = await service.search('items', {
                        Page: 2,
                        PageSize: 1,
                    });
                    expect(legacyPageItems.Objects.length).to.equal(1);
                    expect(legacyPageItems.Objects[0]).to.deep.equal(legacyItems[1]);
                    legacyPageItems = await service.search('items', {
                        PageSize: 5,
                    });
                    expect(legacyPageItems.Objects.length).to.equal(5);
                    legacyPageItems = await service.search('items', {
                        PageSize: -1,
                    });
                    expect(legacyPageItems.Objects.length).to.equal(legacyItems.length);
                });

                it('KeyList', async () => {
                    console.log('Saar: Items search Keylist');
                    legacyItems = await service.get(
                        `items?where=Key IN ('${items[0].UUID}','${items[1].UUID}','${items[2].UUID}','${items[3].UUID}')`,
                    );
                    const legacyKeyListItems = await service.search('items', {
                        KeyList: [items[0].UUID, items[1].UUID, items[2].UUID, items[3].UUID],
                    });
                    expect(legacyKeyListItems.Objects.length).to.equal(legacyItems.length);
                    expect(legacyKeyListItems.Objects).to.deep.equal(legacyItems);
                });

                it('UniqueFieldList', async () => {
                    console.log('Saar: Items search UniqueFieldList');
                    legacyItems = await service.get(
                        `items?where=InternalID IN ('${items[0].InternalID}','${items[1].InternalID}','${items[2].InternalID}','${items[3].InternalID}')`,
                    );
                    const legacyUniqueFieldItems = await service.search('items', {
                        UniqueFieldList: [
                            items[0].InternalID,
                            items[1].InternalID,
                            items[2].InternalID,
                            items[3].InternalID,
                        ],
                        UniqueFieldID: 'InternalID',
                    });
                    expect(legacyUniqueFieldItems.Objects.length).to.equal(legacyItems.length);
                    expect(legacyUniqueFieldItems.Objects).to.deep.equal(legacyItems);
                });

                it('Fields', async () => {
                    console.log('Saar: Items search Fields');
                    legacyItems = await service.get(`items?where=InternalID=${items[0].InternalID}`);
                    const legacyFieldsItems = await service.search(`items`, {
                        Where: `InternalID=${items[0].InternalID}`,
                        Fields: ['InternalID', 'ExternalID', 'Key'],
                    });
                    expect(legacyFieldsItems.Objects.length).to.equal(legacyItems.length);
                    expect(legacyFieldsItems.Objects).to.deep.equal([
                        { InternalID: items[0].InternalID, ExternalID: items[0].ExternalID, Key: items[0].UUID },
                    ]);
                });

                it('Include Count', async () => {
                    console.log('Saar: Items search Include Count');
                    const legacyIncludeCountItems = await service.search('items', {
                        IncludeCount: true,
                    });
                    expect(legacyIncludeCountItems).to.have.property('Count').that.is.a('number');
                });
            });

            describe('DIMX + Delete', () => {
                it('DIMX export', async () => {
                    console.log('Saar: Items DIMX export');
                    items = await objectsService.getItems({ page_size: -1 });
                    const exportAudit = await service.dimxExport('items');
                    const dimxResult = await service.getDimxResult(exportAudit.URI);
                    dimxResult.forEach((object) => {
                        delete object['ParentExternalID'];
                    });
                    const papiItemsSchemaManipulation = await service.papiCoreComparisonMulti(items, 'items');
                    papiItemsSchemaManipulation.sort((a, b) => {
                        return a.InternalID - b.InternalID;
                    });
                    dimxResult.sort((a, b) => {
                        return a.InternalID - b.InternalID;
                    });
                    expect(papiItemsSchemaManipulation.length).to.equal(dimxResult.length);
                    expect(papiItemsSchemaManipulation).to.deep.equal(dimxResult);
                });

                it('DIMX import insert + update', async () => {
                    console.log('Saar: Items DIMX import');
                    const uuidForImport = newUuid();
                    let dimxImportResult = await service.dimxImport('items', {
                        Objects: [
                            {
                                Key: uuidForImport,
                                ExternalID: itemExternalID + 'DIMX',
                                MainCategoryID: mainCategoryID,
                            },
                        ],
                    });
                    expect(dimxImportResult).to.deep.equal([
                        {
                            Key: uuidForImport,
                            Status: 'Insert',
                        },
                    ]);

                    dimxImportResult = await service.dimxImport('items', {
                        Objects: [
                            {
                                Key: uuidForImport,
                                ExternalID: itemExternalID + 'DIMX',
                                MainCategoryID: mainCategoryID,
                                Name: 'DIMX Import Test',
                            },
                        ],
                    });
                    expect(dimxImportResult).to.deep.equal([
                        {
                            Key: uuidForImport,
                            Status: 'Update',
                        },
                    ]);
                });

                it('Delete items', async () => {
                    console.log('Saar: Items DELETE');
                    const deletedItem = await objectsService.postItem({
                        ExternalID: itemExternalID,
                        MainCategoryID: mainCategoryID,
                        Hidden: true,
                    });

                    const legacyDeletedItem = await service.post('items', {
                        ExternalID: legacyItemExternalID,
                        MainCategoryID: mainCategoryID,
                        Hidden: true,
                    });

                    const DIMXDeletedItem = await service.post('items', {
                        ExternalID: itemExternalID + 'DIMX',
                        MainCategoryID: mainCategoryID,
                        Hidden: true,
                    });
                    expect(deletedItem).to.have.property('Hidden').that.is.true;
                    expect(legacyDeletedItem).to.have.property('Hidden').that.is.true;
                    expect(DIMXDeletedItem).to.have.property('Hidden').that.is.true;
                });
            });
        });

        describe('Accounts', () => {
            console.log('Saar: Accounts');
            let accounts;
            let legacyAccountExternalID;
            let accountExternalID;
            let legacyCreatedAccount;
            let createdAccount;
            let updatedAccount;
            let legacyUpdatedAccount;
            let legacyPageAccounts;
            let accountAfterManipulation;

            it('Create Account', async () => {
                console.log('Saar: Create Account');
                accounts = await objectsService.getAccounts();
                accountExternalID = 'Automated API Account' + Math.floor(Math.random() * 1000000).toString();
                legacyAccountExternalID = 'Automated API Account' + Math.floor(Math.random() * 1000000).toString();

                createdAccount = await objectsService.createAccount({
                    ExternalID: accountExternalID,
                });

                legacyCreatedAccount = await service.post('accounts', {
                    ExternalID: legacyAccountExternalID,
                });

                expect(legacyCreatedAccount).to.have.property('InternalID').that.is.a('number');
                expect(legacyCreatedAccount).to.have.property('Key').that.is.a('string').with.lengthOf(36);
                expect(legacyCreatedAccount).to.have.property('ExternalID').that.equals(legacyAccountExternalID);
                expect(legacyCreatedAccount).to.have.property('Name');
                expect(legacyCreatedAccount).to.have.property('Phone');
                expect(legacyCreatedAccount).to.have.property('Email').that.is.a('string');
                expect(legacyCreatedAccount).to.have.property('Note');
                expect(legacyCreatedAccount).to.have.property('Street');
                expect(legacyCreatedAccount).to.have.property('City').that.equals(createdAccount.City);
                expect(legacyCreatedAccount).to.have.property('Country').that.equals(createdAccount.Country);
                expect(legacyCreatedAccount).to.have.property('State');
                expect(legacyCreatedAccount).to.have.property('ZipCode');
                expect(legacyCreatedAccount).to.have.property('Discount').that.is.a('number');
                expect(legacyCreatedAccount).to.have.property('TypeDefinitionID').that.is.a('number');
                expect(legacyCreatedAccount).to.have.property('Type');
                expect(legacyCreatedAccount).to.have.property('Hidden').that.is.a('boolean').and.is.false;
                expect(legacyCreatedAccount).to.have.property('Latitude').that.is.a('number');
                expect(legacyCreatedAccount).to.have.property('Longitude').that.is.a('number');
                expect(legacyCreatedAccount.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedAccount.CreationDateTime).to.include('Z');
                expect(legacyCreatedAccount.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedAccount.ModificationDateTime).to.include('Z');
            });

            it('Update account', async () => {
                console.log('Saar: Update Account');
                updatedAccount = await objectsService.createAccount({
                    ExternalID: accountExternalID,
                    City: 'Holon',
                    Name: 'Testing12345',
                    Discount: 25,
                });

                legacyUpdatedAccount = await service.post('accounts', {
                    ExternalID: legacyAccountExternalID,
                    City: 'Holon',
                    Name: 'Testing12345',
                    Discount: 25,
                });

                expect(updatedAccount.Name).to.equal(legacyUpdatedAccount.Name);
                expect(updatedAccount.City).to.equal(legacyUpdatedAccount.City);
                expect(updatedAccount.Country).to.equal(legacyUpdatedAccount.Country);
                expect(updatedAccount.Discount).to.equal(legacyUpdatedAccount.Discount);
                expect(updatedAccount.Hidden).to.equal(legacyUpdatedAccount.Hidden);
                expect(updatedAccount.Latitude).to.equal(legacyUpdatedAccount.Latitude);
                expect(updatedAccount.Longitude).to.equal(legacyUpdatedAccount.Longitude);
                expect(updatedAccount.Note).to.equal(legacyUpdatedAccount.Note);
                expect(updatedAccount.Phone).to.equal(legacyUpdatedAccount.Phone);
                expect(updatedAccount.State).to.equal(legacyUpdatedAccount.State);
                expect(updatedAccount.Street).to.equal(legacyUpdatedAccount.Street);
                expect(updatedAccount.Type).to.equal(legacyUpdatedAccount.Type);
                expect(updatedAccount.ZipCode).to.equal(legacyUpdatedAccount.ZipCode);
            });

            it('Get account by key', async () => {
                console.log('Saar: Get Account by key');
                const accountAfterUpdate = await objectsService.getAccountByID(legacyCreatedAccount.InternalID);
                accountAfterManipulation = await service.papiCoreComparisonSingle(accountAfterUpdate, 'accounts');
                delete accountAfterManipulation.ModificationDateTime;
                delete accountAfterManipulation.Longitude;
                delete accountAfterManipulation.Latitude;
                const getByKeyAccount = await service.getByKey('accounts', legacyCreatedAccount.Key);
                delete getByKeyAccount.ModificationDateTime;
                delete getByKeyAccount.Longitude;
                delete getByKeyAccount.Latitude;
                delete getByKeyAccount.TSADateTime;
                delete getByKeyAccount.TSAContactBirthday;
                delete getByKeyAccount.TSAAttachmentAPI;
                delete getByKeyAccount.TSACheckboxAPI;
                delete getByKeyAccount.TSACurrencyAPI;
                delete getByKeyAccount.TSADateAPI;
                delete getByKeyAccount.TSADateTimeAPI;
                delete getByKeyAccount.TSADecimalNumberAPI;
                delete getByKeyAccount.TSADropdownAPI;
                delete getByKeyAccount.TSAEmailAPI;
                delete getByKeyAccount.TSAHtmlAPI;
                delete getByKeyAccount.TSAImageAPI;
                delete getByKeyAccount.TSALimitedLineAPI;
                delete getByKeyAccount.TSALinkAPI;
                delete getByKeyAccount.TSAMultiChoiceAPI;
                delete getByKeyAccount.TSANumberAPI;
                delete getByKeyAccount.TSAParagraphAPI;
                delete getByKeyAccount.TSASignatureAPI;
                delete getByKeyAccount.TSAPhoneNumberAPI;
                delete getByKeyAccount.TSASingleLineAPI;
                delete getByKeyAccount.TSAAccountCustomtextfield;
                delete getByKeyAccount.TSAAtt4;
                delete getByKeyAccount.TSAAtt5par;
                delete getByKeyAccount.TSAggggggggggggggggggggggggtest;
                delete getByKeyAccount.TSAtest1122;
                delete getByKeyAccount.TSAtestdropdown123;
                expect(getByKeyAccount).to.deep.equal(accountAfterManipulation);
                await expect(service.getByKey('accounts', '1234')).eventually.to.be.rejected;
            });

            it('Get account by Unique key', async () => {
                console.log('Saar: Get Account by unique key');
                const getAccountByInternalID = await service.getByUniqueKey(
                    'accounts',
                    'InternalID',
                    legacyCreatedAccount.InternalID,
                );
                delete getAccountByInternalID.ModificationDateTime;
                delete getAccountByInternalID.Longitude;
                delete getAccountByInternalID.Latitude;
                delete getAccountByInternalID.TSADateTime;
                delete getAccountByInternalID.TSAContactBirthday;
                delete getAccountByInternalID.TSAAttachmentAPI;
                delete getAccountByInternalID.TSACheckboxAPI;
                delete getAccountByInternalID.TSACurrencyAPI;
                delete getAccountByInternalID.TSADateAPI;
                delete getAccountByInternalID.TSADateTimeAPI;
                delete getAccountByInternalID.TSADecimalNumberAPI;
                delete getAccountByInternalID.TSADropdownAPI;
                delete getAccountByInternalID.TSAEmailAPI;
                delete getAccountByInternalID.TSAHtmlAPI;
                delete getAccountByInternalID.TSAImageAPI;
                delete getAccountByInternalID.TSALimitedLineAPI;
                delete getAccountByInternalID.TSALinkAPI;
                delete getAccountByInternalID.TSAMultiChoiceAPI;
                delete getAccountByInternalID.TSANumberAPI;
                delete getAccountByInternalID.TSAParagraphAPI;
                delete getAccountByInternalID.TSASignatureAPI;
                delete getAccountByInternalID.TSAPhoneNumberAPI;
                delete getAccountByInternalID.TSASingleLineAPI;
                delete getAccountByInternalID.TSAAccountCustomtextfield;
                delete getAccountByInternalID.TSAAtt4;
                delete getAccountByInternalID.TSAAtt5par;
                delete getAccountByInternalID.TSAggggggggggggggggggggggggtest;
                delete getAccountByInternalID.TSAtest1122;
                delete getAccountByInternalID.TSAtestdropdown123;
                expect(getAccountByInternalID).to.deep.equal(accountAfterManipulation);
                const getAccountByExternalID = await service.getByUniqueKey(
                    'accounts',
                    'ExternalID',
                    legacyCreatedAccount.ExternalID,
                );
                delete getAccountByExternalID.ModificationDateTime;
                delete getAccountByExternalID.Longitude;
                delete getAccountByExternalID.Latitude;
                delete getAccountByExternalID.TSADateTime;
                delete getAccountByExternalID.TSAContactBirthday;
                delete getAccountByExternalID.TSAAttachmentAPI;
                delete getAccountByExternalID.TSACheckboxAPI;
                delete getAccountByExternalID.TSACurrencyAPI;
                delete getAccountByExternalID.TSADateAPI;
                delete getAccountByExternalID.TSADateTimeAPI;
                delete getAccountByExternalID.TSADecimalNumberAPI;
                delete getAccountByExternalID.TSADropdownAPI;
                delete getAccountByExternalID.TSAEmailAPI;
                delete getAccountByExternalID.TSAHtmlAPI;
                delete getAccountByExternalID.TSAImageAPI;
                delete getAccountByExternalID.TSALimitedLineAPI;
                delete getAccountByExternalID.TSALinkAPI;
                delete getAccountByExternalID.TSAMultiChoiceAPI;
                delete getAccountByExternalID.TSANumberAPI;
                delete getAccountByExternalID.TSAParagraphAPI;
                delete getAccountByExternalID.TSASignatureAPI;
                delete getAccountByExternalID.TSAPhoneNumberAPI;
                delete getAccountByExternalID.TSASingleLineAPI;
                delete getAccountByExternalID.TSAAccountCustomtextfield;
                delete getAccountByExternalID.TSAAtt4;
                delete getAccountByExternalID.TSAAtt5par;
                delete getAccountByExternalID.TSAggggggggggggggggggggggggtest;
                delete getAccountByExternalID.TSAtest1122;
                delete getAccountByExternalID.TSAtestdropdown123;
                expect(getAccountByExternalID).to.deep.equal(accountAfterManipulation);
                const getAccountByKey = await service.getByUniqueKey('accounts', 'Key', legacyCreatedAccount.Key);
                delete getAccountByKey.ModificationDateTime;
                delete getAccountByKey.Longitude;
                delete getAccountByKey.Latitude;
                delete getAccountByKey.TSADateTime;
                delete getAccountByKey.TSAContactBirthday;
                delete getAccountByKey.TSAAttachmentAPI;
                delete getAccountByKey.TSACheckboxAPI;
                delete getAccountByKey.TSACurrencyAPI;
                delete getAccountByKey.TSADateAPI;
                delete getAccountByKey.TSADateTimeAPI;
                delete getAccountByKey.TSADecimalNumberAPI;
                delete getAccountByKey.TSADropdownAPI;
                delete getAccountByKey.TSAEmailAPI;
                delete getAccountByKey.TSAHtmlAPI;
                delete getAccountByKey.TSAImageAPI;
                delete getAccountByKey.TSALimitedLineAPI;
                delete getAccountByKey.TSALinkAPI;
                delete getAccountByKey.TSAMultiChoiceAPI;
                delete getAccountByKey.TSANumberAPI;
                delete getAccountByKey.TSAParagraphAPI;
                delete getAccountByKey.TSASignatureAPI;
                delete getAccountByKey.TSAPhoneNumberAPI;
                delete getAccountByKey.TSASingleLineAPI;
                delete getAccountByKey.TSAAccountCustomtextfield;
                delete getAccountByKey.TSAAtt4;
                delete getAccountByKey.TSAAtt5par;
                delete getAccountByKey.TSAggggggggggggggggggggggggtest;
                delete getAccountByKey.TSAtest1122;
                delete getAccountByKey.TSAtestdropdown123;
                expect(getAccountByKey).to.deep.equal(accountAfterManipulation);
                await expect(service.getByUniqueKey('accounts', 'InternalID', '12341223147776')).eventually.to.be
                    .rejected;
                await expect(service.getByUniqueKey('accounts', 'Price', '123412')).eventually.to.be.rejected;
            });

            describe('Accounts search', () => {
                let legacyAccounts;
                it('Where', async () => {
                    console.log('Saar: Account search WHERE');
                    const whereAccounts = await objectsService.getAccounts({
                        where: `ExternalID like '%Automated API Account%'`,
                    });
                    const legacyWhereAccounts = await service.search('accounts', {
                        Where: `ExternalID like '%Automated API Account%'`,
                    });
                    expect(whereAccounts.length).to.equal(legacyWhereAccounts.Objects.length);
                });

                it('Page and PageSize', async () => {
                    console.log('Saar: Account search Page and PageSize');
                    legacyAccounts = await service.get('accounts?page_size=-1');
                    legacyPageAccounts = await service.search('accounts', {
                        Page: 1,
                        PageSize: 1,
                    });
                    expect(legacyPageAccounts.Objects.length).to.equal(1);
                    expect(legacyPageAccounts.Objects[0]).to.deep.equal(legacyAccounts[0]);
                    legacyPageAccounts = await service.search('accounts', {
                        Page: 2,
                        PageSize: 1,
                    });
                    expect(legacyPageAccounts.Objects.length).to.equal(1);
                    expect(legacyPageAccounts.Objects[0]).to.deep.equal(legacyAccounts[1]);
                    legacyPageAccounts = await service.search('accounts', {
                        PageSize: 5,
                    });
                    expect(legacyPageAccounts.Objects.length).to.equal(5);
                    legacyPageAccounts = await service.search('accounts', {
                        PageSize: -1,
                    });
                    expect(legacyPageAccounts.Objects.length).to.equal(legacyAccounts.length);
                });

                it('KeyList', async () => {
                    console.log('Saar: Account search KeyList');
                    legacyAccounts = await service.get(
                        `accounts?where=Key IN ('${accounts[0].UUID}','${accounts[1].UUID}','${accounts[2].UUID}','${accounts[3].UUID}')`,
                    );
                    const legacyKeyListAccounts = await service.search('accounts', {
                        KeyList: [accounts[0].UUID, accounts[1].UUID, accounts[2].UUID, accounts[3].UUID],
                    });
                    expect(legacyKeyListAccounts.Objects.length).to.equal(legacyAccounts.length);
                    expect(legacyKeyListAccounts.Objects).to.deep.equal(legacyAccounts);
                });

                it('UniqueFieldList', async () => {
                    console.log('Saar: Account search UniqueFieldList');
                    legacyAccounts = await service.get(
                        `accounts?where=InternalID IN ('${accounts[0].InternalID}','${accounts[1].InternalID}','${accounts[2].InternalID}','${accounts[3].InternalID}')`,
                    );
                    const legacyUniqueFieldAccounts = await service.search('accounts', {
                        UniqueFieldList: [
                            accounts[0].InternalID,
                            accounts[1].InternalID,
                            accounts[2].InternalID,
                            accounts[3].InternalID,
                        ],
                        UniqueFieldID: 'InternalID',
                    });
                    expect(legacyUniqueFieldAccounts.Objects.length).to.equal(legacyAccounts.length);
                    expect(legacyUniqueFieldAccounts.Objects).to.deep.equal(legacyAccounts);
                });

                it('Fields', async () => {
                    console.log('Saar: Account search Fields');
                    legacyAccounts = await service.get(`accounts?where=InternalID=${accounts[0].InternalID}`);
                    const legacyFieldsAccounts = await service.search(`accounts`, {
                        Where: `InternalID=${accounts[0].InternalID}`,
                        Fields: ['InternalID', 'ExternalID', 'Key'],
                    });
                    expect(legacyFieldsAccounts.Objects.length).to.equal(legacyAccounts.length);
                    expect(legacyFieldsAccounts.Objects).to.deep.equal([
                        {
                            InternalID: accounts[0].InternalID,
                            ExternalID: accounts[0].ExternalID,
                            Key: accounts[0].UUID,
                        },
                    ]);
                });

                it('Include Count', async () => {
                    console.log('Saar: Account search Include Count');
                    const legacyIncludeCountAccounts = await service.search('accounts', {
                        IncludeCount: true,
                    });
                    expect(legacyIncludeCountAccounts).to.have.property('Count').that.is.a('number');
                });
            });

            describe('DIMX + Delete', () => {
                it('DIMX export', async () => {
                    console.log('Saar: Account DIMX export');
                    const accountsForComparison = await objectsService.getAccounts({ page_size: -1 });
                    const accountsAfterManipulation = await service.papiCoreComparisonMulti(
                        accountsForComparison,
                        'accounts',
                    );
                    const exportAudit = await service.dimxExport('accounts');
                    const dimxResult = await service.getDimxResult(exportAudit.URI);
                    dimxResult.forEach((object) => {
                        delete object['TSADateTime'];
                        delete object['TSAContactBirthday'];
                        delete object['TSAAttachmentAPI'];
                        delete object['TSACheckboxAPI'];
                        delete object['TSACurrencyAPI'];
                        delete object['TSADateAPI'];
                        delete object['TSADateTimeAPI'];
                        delete object['TSADecimalNumberAPI'];
                        delete object['TSADropdownAPI'];
                        delete object['TSAEmailAPI'];
                        delete object['TSAHtmlAPI'];
                        delete object['TSAImageAPI'];
                        delete object['TSALimitedLineAPI'];
                        delete object['TSALinkAPI'];
                        delete object['TSAMultiChoiceAPI'];
                        delete object['TSANumberAPI'];
                        delete object['TSAParagraphAPI'];
                        delete object['TSASignatureAPI'];
                        delete object['TSAPhoneNumberAPI'];
                        delete object['TSASingleLineAPI'];
                        delete object['TSAAccountCustomtextfield'];
                        delete object['TSAAtt4'];
                        delete object['TSAAtt5par'];
                        delete object['TSAggggggggggggggggggggggggtest'];
                        delete object['TSAtest1122'];
                        delete object['TSAtestdropdown123'];
                    });
                    accountsAfterManipulation.sort((a, b) => {
                        return (a as any).InternalID - (b as any).InternalID;
                    });
                    dimxResult.sort((a, b) => {
                        return a.InternalID - b.InternalID;
                    });
                    expect(accountsAfterManipulation.length).to.equal(dimxResult.length);
                    expect(accountsAfterManipulation).to.deep.equal(dimxResult);
                });

                it('DIMX import insert + update', async () => {
                    console.log('Saar: Account search DIMX Import');
                    const uuidForImport = newUuid();
                    let dimxImportResult = await service.dimxImport('accounts', {
                        Objects: [
                            {
                                Key: uuidForImport,
                                ExternalID: accountExternalID + 'DIMX',
                            },
                        ],
                    });
                    expect(dimxImportResult).to.deep.equal([
                        {
                            Key: uuidForImport,
                            Status: 'Insert',
                        },
                    ]);

                    dimxImportResult = await service.dimxImport('accounts', {
                        Objects: [
                            {
                                Key: uuidForImport,
                                ExternalID: accountExternalID + 'DIMX',
                                Name: 'DIMX Import Test',
                            },
                        ],
                    });
                    expect(dimxImportResult).to.deep.equal([
                        {
                            Key: uuidForImport,
                            Status: 'Update',
                        },
                    ]);
                });

                it('Delete accounts', async () => {
                    console.log('Saar: Delete Accounts');
                    const deletedAccount = await objectsService.createAccount({
                        ExternalID: accountExternalID,
                        Hidden: true,
                    });

                    const legacyDeletedAccount = await service.post('accounts', {
                        ExternalID: legacyAccountExternalID,
                        Hidden: true,
                    });

                    const dimxDeletedAccount = await objectsService.createAccount({
                        ExternalID: accountExternalID + 'DIMX',
                        Hidden: true,
                    });
                    expect(deletedAccount).to.have.property('Hidden').that.is.true;
                    expect(dimxDeletedAccount).to.have.property('Hidden').that.is.true;
                    expect(legacyDeletedAccount).to.have.property('Hidden').that.is.true;
                });
            });
        });

        // describe('Users', () => {
        //     let users;
        //     let legacyUserExternalID;
        //     let userExternalID;
        //     let legacyCreatedUser;
        //     let createdUser;
        //     let userEmail;
        //     let legacyUserEmail;
        //     let updatedUser;
        //     let legacyUpdatedUser;

        //     it('Create User', async () => {
        //         debugger;
        //         users = await objectsService.getUsers();
        //         userExternalID = 'Automated API User' + Math.floor(Math.random() * 1000000).toString();
        //         userEmail =
        //             'Email' +
        //             Math.floor(Math.random() * 1000000).toString() +
        //             '@' +
        //             Math.floor(Math.random() * 1000000).toString() +
        //             '.com';
        //         legacyUserExternalID = 'Automated API User' + Math.floor(Math.random() * 1000000).toString();
        //         legacyUserEmail =
        //             'Email' +
        //             Math.floor(Math.random() * 1000000).toString() +
        //             '@' +
        //             Math.floor(Math.random() * 1000000).toString() +
        //             '.com';

        //         createdUser = await objectsService.createUser({
        //             ExternalID: userExternalID,
        //             Email: userEmail,
        //         });

        //         legacyCreatedUser = await objectsService.createUser({
        //             ExternalID: legacyUserExternalID,
        //             Email: legacyUserEmail,
        //         });
        //         expect(createdUser).to.have.property('InternalID').that.is.a('number');
        //         expect(legacyCreatedUser).to.have.property('InternalID').that.is.a('number');
        //         expect(legacyCreatedUser).to.have.property('UUID').that.is.a('string').with.lengthOf(36);
        //         expect(legacyCreatedUser).to.have.property('ExternalID').that.equals(legacyUserExternalID);
        //         expect(legacyCreatedUser).to.have.property('Email').that.equals(legacyUserEmail);
        //         expect(legacyCreatedUser).to.have.property('FirstName').that.is.a('string');
        //         expect(legacyCreatedUser).to.have.property('Hidden').that.is.a('boolean').and.is.false;
        //         expect(legacyCreatedUser).to.have.property('LastName').that.is.a('string');
        //         expect(legacyCreatedUser).to.have.property('Mobile').that.is.a('string');
        //         expect(legacyCreatedUser.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
        //         expect(legacyCreatedUser.CreationDateTime).to.include('Z');
        //         expect(legacyCreatedUser.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
        //         expect(legacyCreatedUser.ModificationDateTime).to.include('Z');
        //     });

        //     it('Update user', async () => {
        //         updatedUser = await objectsService.updateUser({
        //             ExternalID: userExternalID,
        //             Email: userEmail,
        //             FirstName: 'Testing12345',
        //         });

        //         legacyUpdatedUser = await objectsService.updateUser({
        //             ExternalID: legacyUserExternalID,
        //             Email: legacyUserEmail,
        //             FirstName: 'Testing12345',
        //         });

        //         expect(updatedUser.FirstName).to.equal(legacyUpdatedUser.FirstName);
        //         expect(updatedUser.Hidden).to.equal(legacyUpdatedUser.Hidden);
        //         expect(updatedUser.LastName).to.equal(legacyUpdatedUser.LastName);
        //         expect(updatedUser.Mobile).to.equal(legacyUpdatedUser.Mobile);
        //     });

        //     it('Get user by key', async () => {
        //         generalService.sleep(5000);
        //         const getByKeyUser = await service.getByKey('users', legacyCreatedUser.UUID);
        //         expect(getByKeyUser).to.deep.equal(legacyUpdatedUser);
        //         await expect(service.getByKey('users', '1234')).eventually.to.be.rejected;
        //     });

        //     it('Get user by Unique key', async () => {
        //         const getUserByInternalID = await service.getByUniqueKey(
        //             'users',
        //             'InternalID',
        //             legacyCreatedUser.InternalID,
        //         );
        //         expect(getUserByInternalID).to.deep.equal(legacyUpdatedUser);
        //         const getUserByExternalID = await service.getByUniqueKey(
        //             'users',
        //             'ExternalID',
        //             legacyCreatedUser.ExternalID,
        //         );
        //         expect(getUserByExternalID).to.deep.equal(legacyUpdatedUser);
        //         const getUserByKey = await service.getByUniqueKey('users', 'Key', legacyCreatedUser.Key);
        //         expect(getUserByKey).to.deep.equal(legacyUpdatedUser);
        //         await expect(service.getByUniqueKey('users', 'InternalID', '123412')).eventually.to.be.rejected;
        //         await expect(service.getByUniqueKey('users', 'Price', '123412')).eventually.to.be.rejected;
        //     });

        //     describe('Users search', () => {
        //         let legacyUsers;
        //         it('Where', async () => {
        //             const whereUsers = await objectsService.getUsers({
        //                 where: `ExternalID like 'Automated API User%'`,
        //             });
        //             const legacyWhereUsers = await service.search('users', {
        //                 Where: `ExternalID like 'Automated API User%'`,
        //             });
        //             expect(whereUsers.length).to.equal(legacyWhereUsers.Objects.length);
        //         });

        //         it('Page and PageSize', async () => {
        //             legacyUsers = await service.get('users?page_size=-1');
        //             let legacyPageUsers;
        //             legacyPageUsers = await service.search('users', {
        //                 Page: 1,
        //                 PageSize: 1,
        //             });
        //             expect(legacyPageUsers.Objects.length).to.equal(1);
        //             expect(legacyPageUsers.Objects[0]).to.deep.equal(legacyUsers[0]);
        //             legacyPageUsers = await service.search('users', {
        //                 Page: 2,
        //                 PageSize: 1,
        //             });
        //             expect(legacyPageUsers.Objects.length).to.equal(1);
        //             expect(legacyPageUsers.Objects[0]).to.deep.equal(legacyUsers[1]);
        //             legacyPageUsers = await service.search('users', {
        //                 PageSize: 5,
        //             });
        //             expect(legacyPageUsers.Objects.length).to.equal(5);
        //             legacyPageUsers = await service.search('users', {
        //                 PageSize: -1,
        //             });
        //             expect(legacyPageUsers.Objects.length).to.equal(legacyUsers.length);
        //         });

        //         it('KeyList', async () => {
        //             legacyUsers = await service.get(
        //                 `users?where=UUID IN ('${users[0].UUID}','${users[1].UUID}','${users[2].UUID}','${users[3].UUID}')`,
        //             );
        //             const legacyKeyListUsers = await service.search('users', {
        //                 KeyList: [users[0].UUID, users[1].UUID, users[2].UUID, users[3].UUID],
        //             });
        //             expect(legacyKeyListUsers.Objects.length).to.equal(legacyUsers.length);
        //             expect(legacyKeyListUsers.Objects).to.deep.equal(legacyUsers);
        //         });

        //         it('UniqueFieldList', async () => {
        //             legacyUsers = await service.get(
        //                 `users?where=InternalID IN ('${users[0].InternalID}','${users[1].InternalID}','${users[2].InternalID}','${users[3].InternalID}')`,
        //             );
        //             const legacyUniqueFieldUsers = await service.search('users', {
        //                 UniqueFieldList: [
        //                     users[0].InternalID,
        //                     users[1].InternalID,
        //                     users[2].InternalID,
        //                     users[3].InternalID,
        //                 ],
        //                 UniqueFieldID: 'InternalID',
        //             });
        //             expect(legacyUniqueFieldUsers.Objects.length).to.equal(legacyUsers.length);
        //             expect(legacyUniqueFieldUsers.Objects).to.deep.equal(legacyUsers);
        //         });

        //         it('Fields', async () => {
        //             legacyUsers = await service.get(`users?where=InternalID=${users[0].InternalID}`);
        //             const legacyFieldsUsers = await service.search(`users`, {
        //                 Where: `InternalID=${users[0].InternalID}`,
        //                 Fields: ['InternalID', 'ExternalID', 'Key'],
        //             });
        //             expect(legacyFieldsUsers.Objects.length).to.equal(legacyUsers.length);
        //             expect(legacyFieldsUsers.Objects).to.deep.equal([
        //                 { InternalID: users[0].InternalID, ExternalID: users[0].ExternalID, Key: users[0].UUID },
        //             ]);
        //         });

        //         it('Include Count', async () => {
        //             const legacyIncludeCountUsers = await service.search('users', {
        //                 IncludeCount: true,
        //             });
        //             expect(legacyIncludeCountUsers).to.have.property('Count').that.is.a('number');
        //         });
        //     });

        //     it('Delete users', async () => {
        //         const deletedUser = await objectsService.updateUser({
        //             ExternalID: userExternalID,
        //             Email: userEmail,
        //             Hidden: true,
        //         });

        //         const legacyDeletedUser = await objectsService.updateUser({
        //             ExternalID: legacyUserExternalID,
        //             Email: legacyUserEmail,
        //             Hidden: true,
        //         });
        //         expect(deletedUser).to.have.property('Hidden').that.is.true;
        //         expect(legacyDeletedUser).to.have.property('Hidden').that.is.true;
        //     });
        // });

        describe('Contact', () => {
            console.log('Saar: Contact');
            let contacts;
            let legacyContactExternalID;
            let contactExternalID;
            let accountForContact;
            let legacyCreatedContact;
            // let createdContact;
            let contactEmail;
            let updatedContact;
            let legacyUpdatedContact;
            let contactAfterManipulation;

            it('Create Contact', async () => {
                console.log('Saar: Create Contact');
                contacts = await objectsService.getContacts();
                contactExternalID = 'Automated API Item' + Math.floor(Math.random() * 1000000).toString();
                legacyContactExternalID = 'Automated API Item' + Math.floor(Math.random() * 1000000).toString();
                contactEmail =
                    'Email' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '@' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '.com';
                accountForContact = await objectsService.getAccounts();
                accountForContact = accountForContact[0];

                // createdContact = await objectsService.createContact({
                //     ExternalID: contactExternalID,
                //     Email: contactEmail,
                //     Mobile: '123-45678',
                //     FirstName: 'Contact',
                //     LastName: 'Test',
                //     Account: {
                //         Data: {
                //             InternalID: accountForContact.InternalID,
                //         },
                //     },
                // });

                legacyCreatedContact = await service.post('contacts', {
                    ExternalID: legacyContactExternalID,
                    Email: contactEmail,
                    Mobile: '123-45678',
                    FirstName: 'Contact',
                    LastName: 'Test',
                    Account: {
                        Data: {
                            InternalID: accountForContact.InternalID,
                        },
                    },
                });

                expect(legacyCreatedContact).to.have.property('InternalID').that.is.a('number');
                expect(legacyCreatedContact).to.have.property('Key').that.is.a('string').with.lengthOf(36);
                expect(legacyCreatedContact).to.have.property('ExternalID').that.equals(legacyContactExternalID);
                expect(legacyCreatedContact).to.have.property('Email').that.equals(contactEmail);
                expect(legacyCreatedContact).to.have.property('Role').that.is.null;
                expect(legacyCreatedContact).to.have.property('FirstName').that.equals('Contact');
                expect(legacyCreatedContact).to.have.property('LastName').that.equals('Test');
                expect(legacyCreatedContact).to.have.property('Hidden').that.is.false;
                expect(legacyCreatedContact).to.have.property('Mobile').that.equals('123-45678');
                expect(legacyCreatedContact.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedContact.CreationDateTime).to.include('Z');
                expect(legacyCreatedContact.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedContact.ModificationDateTime).to.include('Z');
                expect(legacyCreatedContact).to.have.property('TypeDefinitionID').that.is.a('number');
                expect(legacyCreatedContact).to.have.property('Status').that.equals(2);
            });

            it('Update Contact', async () => {
                console.log('Saar: Update Contact');
                updatedContact = await objectsService.createContact({
                    ExternalID: contactExternalID,
                    Email: contactEmail,
                    Mobile: '1234-456789',
                    FirstName: 'Contact Update',
                    LastName: 'Test Update',
                    Account: {
                        Data: {
                            InternalID: accountForContact.InternalID,
                        },
                    },
                });

                legacyUpdatedContact = await service.post('contacts', {
                    ExternalID: legacyContactExternalID,
                    Email: contactEmail,
                    Mobile: '1234-456789',
                    FirstName: 'Contact Update',
                    LastName: 'Test Update',
                    Account: {
                        Data: {
                            InternalID: accountForContact.InternalID,
                        },
                    },
                });

                expect(updatedContact.Email).to.equal(legacyUpdatedContact.Email);
                expect(updatedContact.FirstName).to.equal(legacyUpdatedContact.FirstName);
                expect(updatedContact.Hidden).to.equal(legacyUpdatedContact.Hidden);
                expect(updatedContact.LastName).to.equal(legacyUpdatedContact.LastName);
                expect(updatedContact.Mobile).to.equal(legacyUpdatedContact.Mobile);
                expect(updatedContact.Role).to.equal(legacyUpdatedContact.Role);
                expect(updatedContact.Status).to.equal(legacyUpdatedContact.Status);
                expect(updatedContact.TypeDefinitionID).to.equal(legacyUpdatedContact.TypeDefinitionID);
            });

            it('Get Contact by key', async () => {
                console.log('Saar: Get Contact by key');
                const contactAfterUpdate = await objectsService.getContacts(legacyCreatedContact.InternalID);
                contactAfterManipulation = await service.papiCoreComparisonSingle(contactAfterUpdate[0], 'contacts');
                delete contactAfterManipulation.ModificationDateTime;
                delete contactAfterManipulation.Longitude;
                delete contactAfterManipulation.Latitude;
                const getByKeyContact = await service.getByKey('contacts', legacyCreatedContact.Key);
                delete getByKeyContact.ModificationDateTime;
                delete getByKeyContact.Longitude;
                delete getByKeyContact.Latitude;
                delete getByKeyContact.TSADateTime;
                delete getByKeyContact.TSAContactBirthday;
                delete getByKeyContact.TSAAttachmentAPI;
                delete getByKeyContact.TSACheckboxAPI;
                delete getByKeyContact.TSACurrencyAPI;
                delete getByKeyContact.TSADateAPI;
                delete getByKeyContact.TSADateTimeAPI;
                delete getByKeyContact.TSADecimalNumberAPI;
                delete getByKeyContact.TSADropdownAPI;
                delete getByKeyContact.TSAEmailAPI;
                delete getByKeyContact.TSAHtmlAPI;
                delete getByKeyContact.TSAImageAPI;
                delete getByKeyContact.TSALimitedLineAPI;
                delete getByKeyContact.TSALinkAPI;
                delete getByKeyContact.TSAMultiChoiceAPI;
                delete getByKeyContact.TSANumberAPI;
                delete getByKeyContact.TSAParagraphAPI;
                delete getByKeyContact.TSASignatureAPI;
                delete getByKeyContact.TSAPhoneNumberAPI;
                delete getByKeyContact.TSASingleLineAPI;
                expect(getByKeyContact).to.deep.equal(contactAfterManipulation);
                await expect(service.getByKey('contacts', '1234')).eventually.to.be.rejected;
            });

            it('Get Contact by Unique key', async () => {
                console.log('Saar: GET Contact by unique key');
                const getContactByInternalID = await service.getByUniqueKey(
                    'contacts',
                    'InternalID',
                    legacyCreatedContact.InternalID,
                );
                delete getContactByInternalID.ModificationDateTime;
                delete getContactByInternalID.Longitude;
                delete getContactByInternalID.Latitude;
                delete getContactByInternalID.TSADateTime;
                delete getContactByInternalID.TSAContactBirthday;
                delete getContactByInternalID.TSAAttachmentAPI;
                delete getContactByInternalID.TSACheckboxAPI;
                delete getContactByInternalID.TSACurrencyAPI;
                delete getContactByInternalID.TSADateAPI;
                delete getContactByInternalID.TSADateTimeAPI;
                delete getContactByInternalID.TSADecimalNumberAPI;
                delete getContactByInternalID.TSADropdownAPI;
                delete getContactByInternalID.TSAEmailAPI;
                delete getContactByInternalID.TSAHtmlAPI;
                delete getContactByInternalID.TSAImageAPI;
                delete getContactByInternalID.TSALimitedLineAPI;
                delete getContactByInternalID.TSALinkAPI;
                delete getContactByInternalID.TSAMultiChoiceAPI;
                delete getContactByInternalID.TSANumberAPI;
                delete getContactByInternalID.TSAParagraphAPI;
                delete getContactByInternalID.TSASignatureAPI;
                delete getContactByInternalID.TSAPhoneNumberAPI;
                delete getContactByInternalID.TSASingleLineAPI;
                expect(getContactByInternalID).to.deep.equal(contactAfterManipulation);
                const getContactByExternalID = await service.getByUniqueKey(
                    'contacts',
                    'ExternalID',
                    legacyCreatedContact.ExternalID,
                );
                delete getContactByExternalID.ModificationDateTime;
                delete getContactByExternalID.Longitude;
                delete getContactByExternalID.Latitude;
                delete getContactByExternalID.TSADateTime;
                delete getContactByExternalID.TSAContactBirthday;
                delete getContactByExternalID.TSAAttachmentAPI;
                delete getContactByExternalID.TSACheckboxAPI;
                delete getContactByExternalID.TSACurrencyAPI;
                delete getContactByExternalID.TSADateAPI;
                delete getContactByExternalID.TSADateTimeAPI;
                delete getContactByExternalID.TSADecimalNumberAPI;
                delete getContactByExternalID.TSADropdownAPI;
                delete getContactByExternalID.TSAEmailAPI;
                delete getContactByExternalID.TSAHtmlAPI;
                delete getContactByExternalID.TSAImageAPI;
                delete getContactByExternalID.TSALimitedLineAPI;
                delete getContactByExternalID.TSALinkAPI;
                delete getContactByExternalID.TSAMultiChoiceAPI;
                delete getContactByExternalID.TSANumberAPI;
                delete getContactByExternalID.TSAParagraphAPI;
                delete getContactByExternalID.TSASignatureAPI;
                delete getContactByExternalID.TSAPhoneNumberAPI;
                delete getContactByExternalID.TSASingleLineAPI;
                expect(getContactByExternalID).to.deep.equal(contactAfterManipulation);
                const getContactByKey = await service.getByUniqueKey('contacts', 'Key', legacyCreatedContact.Key);
                delete getContactByKey.ModificationDateTime;
                delete getContactByKey.Longitude;
                delete getContactByKey.Latitude;
                delete getContactByKey.TSADateTime;
                delete getContactByKey.TSAContactBirthday;
                delete getContactByKey.TSAAttachmentAPI;
                delete getContactByKey.TSACheckboxAPI;
                delete getContactByKey.TSACurrencyAPI;
                delete getContactByKey.TSADateAPI;
                delete getContactByKey.TSADateTimeAPI;
                delete getContactByKey.TSADecimalNumberAPI;
                delete getContactByKey.TSADropdownAPI;
                delete getContactByKey.TSAEmailAPI;
                delete getContactByKey.TSAHtmlAPI;
                delete getContactByKey.TSAImageAPI;
                delete getContactByKey.TSALimitedLineAPI;
                delete getContactByKey.TSALinkAPI;
                delete getContactByKey.TSAMultiChoiceAPI;
                delete getContactByKey.TSANumberAPI;
                delete getContactByKey.TSAParagraphAPI;
                delete getContactByKey.TSASignatureAPI;
                delete getContactByKey.TSAPhoneNumberAPI;
                delete getContactByKey.TSASingleLineAPI;
                expect(getContactByKey).to.deep.equal(contactAfterManipulation);
                await expect(service.getByUniqueKey('contacts', 'InternalID', '123412')).eventually.to.be.rejected;
                await expect(service.getByUniqueKey('contacts', 'Price', '123412')).eventually.to.be.rejected;
            });

            describe('Contacts search', () => {
                let legacyContacts;
                it('Where', async () => {
                    console.log('Saar: Contact Search WHERE');
                    const whereContacts = await objectsService.getContactsSDK({
                        where: `ExternalID like '%Automated API Item%'`,
                    });
                    const legacyWhereContacts = await service.search('contacts', {
                        Where: `ExternalID like '%Automated API Item%'`,
                    });
                    expect(whereContacts.length).to.equal(legacyWhereContacts.Objects.length);
                });

                it('Page and PageSize', async () => {
                    console.log('Saar: Contact Search Page and PageSize');
                    legacyContacts = await service.get('contacts?page_size=-1');
                    let legacyPageContacts;
                    legacyPageContacts = await service.search('contacts', {
                        Page: 1,
                        PageSize: 1,
                    });
                    expect(legacyPageContacts.Objects.length).to.equal(1);
                    expect(legacyPageContacts.Objects[0]).to.deep.equal(legacyContacts[0]);
                    legacyPageContacts = await service.search('contacts', {
                        Page: 2,
                        PageSize: 1,
                    });
                    expect(legacyPageContacts.Objects.length).to.equal(1);
                    expect(legacyPageContacts.Objects[0]).to.deep.equal(legacyContacts[1]);
                    legacyPageContacts = await service.search('contacts', {
                        PageSize: 5,
                    });
                    expect(legacyPageContacts.Objects.length).to.equal(5);
                    legacyPageContacts = await service.search('contacts', {
                        PageSize: -1,
                    });
                    expect(legacyPageContacts.Objects.length).to.equal(legacyContacts.length);
                });

                it('KeyList', async () => {
                    console.log('Saar: Contact Search KeyList');
                    legacyContacts = await service.get(
                        `contacts?where=Key IN ('${contacts[0].UUID}','${contacts[1].UUID}','${contacts[2].UUID}','${contacts[3].UUID}')`,
                    );
                    const legacyKeyListContacts = await service.search('contacts', {
                        KeyList: [contacts[0].UUID, contacts[1].UUID, contacts[2].UUID, contacts[3].UUID],
                    });
                    expect(legacyKeyListContacts.Objects.length).to.equal(legacyContacts.length);
                    expect(legacyKeyListContacts.Objects).to.deep.equal(legacyContacts);
                });

                it('UniqueFieldList', async () => {
                    console.log('Saar: Contact Search UniqueFieldList');
                    legacyContacts = await service.get(
                        `contacts?where=InternalID IN ('${contacts[0].InternalID}','${contacts[1].InternalID}','${contacts[2].InternalID}','${contacts[3].InternalID}')`,
                    );
                    const legacyUniqueFieldContacts = await service.search('contacts', {
                        UniqueFieldList: [
                            contacts[0].InternalID,
                            contacts[1].InternalID,
                            contacts[2].InternalID,
                            contacts[3].InternalID,
                        ],
                        UniqueFieldID: 'InternalID',
                    });
                    expect(legacyUniqueFieldContacts.Objects.length).to.equal(legacyContacts.length);
                    expect(legacyUniqueFieldContacts.Objects).to.deep.equal(legacyContacts);
                });

                it('Fields', async () => {
                    console.log('Saar: Contact Search Fields');
                    legacyContacts = await service.get(`contacts?where=InternalID=${contacts[0].InternalID}`);
                    const legacyFieldsContacts = await service.search(`contacts`, {
                        Where: `InternalID=${contacts[0].InternalID}`,
                        Fields: ['InternalID', 'ExternalID', 'Key'],
                    });
                    expect(legacyFieldsContacts.Objects.length).to.equal(legacyContacts.length);
                    expect(legacyFieldsContacts.Objects).to.deep.equal([
                        {
                            InternalID: contacts[0].InternalID,
                            ExternalID: contacts[0].ExternalID,
                            Key: contacts[0].UUID,
                        },
                    ]);
                });

                it('Include Count', async () => {
                    console.log('Saar: Contact Search Include Count');
                    const legacyIncludeCountContacts = await service.search('contacts', {
                        IncludeCount: true,
                    });
                    expect(legacyIncludeCountContacts).to.have.property('Count').that.is.a('number');
                });
            });

            it('Delete contacts', async () => {
                console.log('Saar: Contact Delete');
                const deletedContact = await objectsService.createContact({
                    ExternalID: contactExternalID,
                    Hidden: true,
                });

                const legacyDeletedContact = await service.post('contacts', {
                    ExternalID: legacyContactExternalID,
                    Hidden: true,
                });
                expect(deletedContact).to.have.property('Hidden').that.is.true;
                expect(legacyDeletedContact).to.have.property('Hidden').that.is.true;
            });
        });

        // describe('Catalog', () => {
        //     let catalogs;
        //     let legacyCatalogExternalID;
        //     let catalogExternalID;
        //     let legacyCreatedCatalog;
        //     let createdCatalog;
        //     let updatedCatalog;
        //     let legacyUpdatedCatalog;

        //     it('Create Catalog', async () => {
        //         catalogs = await objectsService.getCatalogs();
        //         catalogExternalID = 'Automated API Item' + Math.floor(Math.random() * 1000000).toString();
        //         legacyCatalogExternalID = 'Automated API Item' + Math.floor(Math.random() * 1000000).toString();

        //         createdCatalog = await objectsService.postCatalog({
        //             ExternalID: catalogExternalID,
        //             Description: catalogExternalID + ' Description',
        //         });

        //         legacyCreatedCatalog = await service.post('catalogs', {
        //             ExternalID: legacyCatalogExternalID,
        //             Description: legacyCatalogExternalID + ' Description',
        //         });

        //         createdCatalog.Key = createdCatalog.UUID;
        //         const createdCatalogKeys = Object.keys(createdCatalog);
        //         const legacyCreatedCatalogKeys = Object.keys(legacyCreatedCatalog);
        //         expect(createdCatalogKeys).to.deep.equal(legacyCreatedCatalogKeys);
        //         expect(legacyCreatedCatalog).to.have.property('InternalID').that.is.a('number');
        //         expect(legacyCreatedCatalog).to.have.property('UUID').that.is.a('string').with.lengthOf(36);
        //         expect(legacyCreatedCatalog).to.have.property('ExternalID').that.equals(legacyCatalogExternalID);
        //         expect(legacyCreatedCatalog).to.have.property('Description').that.equals(legacyCatalogExternalID + ' Description');
        //         expect(legacyCreatedCatalog.CreationDate).to.include(new Date().toISOString().split('T')[0]);
        //         expect(legacyCreatedCatalog.CreationDate).to.include('Z');
        //         expect(legacyCreatedCatalog.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
        //         expect(legacyCreatedCatalog.ModificationDateTime).to.include('Z');
        //         expect(legacyCreatedCatalog).to.have.property('ExpirationDate');
        //         expect(legacyCreatedCatalog).to.have.property('Key').that.equals(legacyCreatedCatalog.UUID);
        //         expect(legacyCreatedCatalog).to.have.property('Hidden').that.is.false;
        //         expect(legacyCreatedCatalog).to.have.property('IsActive').that.is.true;
        //     });

        //     it('Update Catalog', async () => {
        //         updatedCatalog = await objectsService.postCatalog({
        //             ExternalID: catalogExternalID,
        //             Description: catalogExternalID + ' Description Update',
        //         });

        //         legacyUpdatedCatalog = await service.post('catalogs', {
        //             ExternalID: legacyCatalogExternalID,
        //             Description: legacyCatalogExternalID + ' Description Update',
        //         });

        //         updatedCatalog.Key = updatedCatalog.UUID;
        //         const updatedCatalogKeys = Object.keys(updatedCatalog);
        //         const legacyUpdatedCatalogKeys = Object.keys(legacyUpdatedCatalog);
        //         expect(updatedCatalogKeys).to.deep.equal(legacyUpdatedCatalogKeys);
        //         expect(updatedCatalog.InternalID).to.equal(legacyUpdatedCatalog.InternalID);
        //         expect(updatedCatalog.CreationDate).to.equal(legacyUpdatedCatalog.CreationDate);
        //         expect(updatedCatalog.ExpirationDate).to.equal(legacyUpdatedCatalog.ExpirationDate);
        //         expect(updatedCatalog.Hidden).to.equal(legacyUpdatedCatalog.Hidden);
        //         expect(updatedCatalog.IsActive).to.equal(legacyUpdatedCatalog.IsActive);
        //     });

        //     it('Get Catalog by key', async () => {
        //         const getByKeyCatalog = await service.getByKey('catalogs', legacyCreatedCatalog.Key);
        //         expect(getByKeyCatalog).to.deep.equal(legacyUpdatedCatalog);
        //         await expect(service.getByKey('catalogs', '1234')).eventually.to.be.rejected;
        //     });

        //     it('Get Catalog by Unique key', async () => {
        //         const getCatalogByInternalID = await service.getByUniqueKey(
        //             'catalogs',
        //             'InternalID',
        //             legacyCreatedCatalog.InternalID,
        //         );
        //         expect(getCatalogByInternalID).to.deep.equal(legacyUpdatedCatalog);
        //         const getCatalogByUUID = await service.getByUniqueKey('catalogs', 'UUID', legacyCreatedCatalog.UUID);
        //         expect(getCatalogByUUID).to.deep.equal(legacyUpdatedCatalog);
        //         const getCatalogByExternalID = await service.getByUniqueKey(
        //             'catalogs',
        //             'ExternalID',
        //             legacyCreatedCatalog.ExternalID,
        //         );
        //         expect(getCatalogByExternalID).to.deep.equal(legacyUpdatedCatalog);
        //         const getCatalogByKey = await service.getByUniqueKey('catalogs', 'Key', legacyCreatedCatalog.Key);
        //         expect(getCatalogByKey).to.deep.equal(legacyUpdatedCatalog);
        //         await expect(service.getByUniqueKey('catalogs', 'InternalID', '123412')).eventually.to.be.rejected;
        //         await expect(service.getByUniqueKey('catalogs', 'Price', '123412')).eventually.to.be.rejected;
        //     });

        //     describe('catalogs search', () => {
        //         let legacyCatalogs;
        //         it('Where', async () => {
        //             const whereCatalogs = await objectsService.getCatalogs({
        //                 where: `ExternalID like '%Automated API Item%'`,
        //             });
        //             const legacyWhereCatalogs = await service.search('catalogs', {
        //                 Where: `ExternalID like '%Automated API Item%'`,
        //             });
        //             expect(whereCatalogs.length).to.equal(legacyWhereCatalogs.Objects.length);
        //         });

        //         it('Page and PageSize', async () => {
        //             legacyCatalogs = await service.get('catalogs?page_size=-1');
        //             let legacyPageCatalogs;
        //             legacyPageCatalogs = await service.search('catalogs', {
        //                 Page: 1,
        //                 PageSize: 1,
        //             });
        //             expect(legacyPageCatalogs.Objects.length).to.equal(1);
        //             expect(legacyPageCatalogs.Objects[0]).to.deep.equal(legacyCatalogs[0]);
        //             legacyPageCatalogs = await service.search('catalogs', {
        //                 Page: 2,
        //                 PageSize: 1,
        //             });
        //             expect(legacyPageCatalogs.Objects.length).to.equal(1);
        //             expect(legacyPageCatalogs.Objects[0]).to.deep.equal(legacyCatalogs[1]);
        //             legacyPageCatalogs = await service.search('catalogs', {
        //                 PageSize: 5,
        //             });
        //             expect(legacyPageCatalogs.Objects.length).to.equal(5);
        //             legacyPageCatalogs = await service.search('catalogs', {
        //                 PageSize: -1,
        //             });
        //             expect(legacyPageCatalogs.Objects.length).to.equal(legacyCatalogs.length);
        //         });

        //         it('KeyList', async () => {
        //             legacyCatalogs = await service.get(
        //                 `catalogs?where=UUID IN ('${catalogs[0].UUID}','${catalogs[1].UUID}','${catalogs[2].UUID}','${catalogs[3].UUID}')`,
        //             );
        //             const legacyKeyListCatalogs = await service.search('catalogs', {
        //                 KeyList: [catalogs[0].UUID, catalogs[1].UUID, catalogs[2].UUID, catalogs[3].UUID],
        //             });
        //             expect(legacyKeyListCatalogs.Objects.length).to.equal(legacyCatalogs.length);
        //             expect(legacyKeyListCatalogs.Objects).to.deep.equal(legacyCatalogs);
        //         });

        //         it('UniqueFieldList', async () => {
        //             legacyCatalogs = await service.get(
        //                 `catalogs?where=InternalID IN ('${catalogs[0].InternalID}','${catalogs[1].InternalID}','${catalogs[2].InternalID}','${catalogs[3].InternalID}')`,
        //             );
        //             const legacyUniqueFieldCatalogs = await service.search('catalogs', {
        //                 UniqueFieldList: [
        //                     catalogs[0].InternalID,
        //                     catalogs[1].InternalID,
        //                     catalogs[2].InternalID,
        //                     catalogs[3].InternalID,
        //                 ],
        //                 UniqueFieldID: 'InternalID',
        //             });
        //             expect(legacyUniqueFieldCatalogs.Objects.length).to.equal(legacyCatalogs.length);
        //             expect(legacyUniqueFieldCatalogs.Objects).to.deep.equal(legacyCatalogs);
        //         });

        //         it('Fields', async () => {
        //             legacyCatalogs = await service.get(`catalogs?where=InternalID=${catalogs[0].InternalID}`);
        //             const legacyFieldsCatalogs = await service.search(`catalogs`, {
        //                 Where: `InternalID=${catalogs[0].InternalID}`,
        //                 Fields: ['InternalID', 'ExternalID', 'Key'],
        //             });
        //             expect(legacyFieldsCatalogs.Objects.length).to.equal(legacyCatalogs.length);
        //             expect(legacyFieldsCatalogs.Objects).to.deep.equal([
        //                 { InternalID: catalogs[0].InternalID, ExternalID: catalogs[0].ExternalID, Key: catalogs[0].UUID },
        //             ]);
        //         });

        //         it('Include Count', async () => {
        //             const legacyIncludeCountCatalogs = await service.search('catalogs', {
        //                 IncludeCount: true,
        //             });
        //            expect(legacyIncludeCountCatalogs).to.have.property('Count').that.is.a('number');
        //         });
        //     });

        //     it('Delete catalogs', async () => {
        //         const deletedCatalog = await objectsService.postCatalog({
        //             ExternalID: catalogExternalID,
        //             Hidden: true,
        //         });

        //         const legacyDeletedCatalog = await service.post('catalogs', {
        //             ExternalID: legacyCatalogExternalID,
        //             Hidden: true,
        //         });
        //         expect(deletedCatalog).to.have.property('Hidden').that.is.true;
        //         expect(legacyDeletedCatalog).to.have.property('Hidden').that.is.true;
        //     });
        // });

        // describe('AccountUsers', () => {
        //     let account;
        //     let legacyAccount;
        //     const accountExternalID = 'Automated API ' + Math.floor(Math.random() * 1000000).toString();
        //     let users;
        //     let legacyCreatedAccountUsers;
        //     let createdAccountUsers;

        //     it('Create AccountUsers', async () => {
        //         account = await objectsService.createAccount({
        //             ExternalID: accountExternalID,
        //             Name: accountExternalID,
        //         });

        //         legacyAccount = await objectsService.createAccount({
        //             ExternalID: accountExternalID + ' L',
        //             Name: accountExternalID + ' L',
        //         });
        //         users = await objectsService.getUsers();

        //         createdAccountUsers = await objectsService.postAccountUsers({
        //             Account: { Data: { InternalID: account.InternalID } },
        //             User: { Data: { InternalID: users[0].InternalID } },
        //         });

        //         legacyCreatedAccountUsers = await service.post('account_users', {
        //             Account: legacyAccount.UUID,
        //             User: users[0].UUID,
        //         });

        //         expect(legacyCreatedAccountUsers).to.have.property('InternalID').that.is.a('Number');
        //         expect(legacyCreatedAccountUsers).to.have.property('Account').that.is.equals(legacyAccount.UUID);
        //         expect(legacyCreatedAccountUsers).to.have.property('Key').that.is.a('string').with.lengthOf(36);
        //         expect(legacyCreatedAccountUsers.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
        //         expect(legacyCreatedAccountUsers.CreationDateTime).to.include('Z');
        //         expect(legacyCreatedAccountUsers.ModificationDateTime).to.include(
        //             new Date().toISOString().split('T')[0],
        //         );
        //         expect(legacyCreatedAccountUsers.ModificationDateTime).to.include('Z');
        //         expect(legacyCreatedAccountUsers).to.have.property('User').that.is.equals(users[0].UUID);
        //         expect(legacyCreatedAccountUsers).to.have.property('Hidden').that.is.false;
        //     });

        //     it('Get AccountUsers by key', async () => {
        //         const getByKeyAccountUsers = await service.getByKey('account_users', legacyCreatedAccountUsers.Key);
        //         expect(getByKeyAccountUsers).to.deep.equal(legacyCreatedAccountUsers);
        //         await expect(service.getByKey('account_users', '1234')).eventually.to.be.rejected;
        //     });

        //     it('Get AccountUsers by Unique key', async () => {
        //         const getAccountUsersByInternalID = await service.getByUniqueKey(
        //             'account_users',
        //             'InternalID',
        //             legacyCreatedAccountUsers.InternalID,
        //         );
        //         expect(getAccountUsersByInternalID).to.deep.equal(legacyCreatedAccountUsers);
        //         const getAccountUsersByKey = await service.getByUniqueKey(
        //             'account_users',
        //             'Key',
        //             legacyCreatedAccountUsers.Key,
        //         );
        //         expect(getAccountUsersByKey).to.deep.equal(legacyCreatedAccountUsers);
        //         await expect(service.getByUniqueKey('account_users', 'InternalID', '123412')).eventually.to.be.rejected;
        //         await expect(service.getByUniqueKey('account_users', 'Price', '123412')).eventually.to.be.rejected;
        //     });

        //     describe('AccountUsers search', () => {
        //         let legacyAccountUsers;
        //         let legacyAccountUsersManipulation;
        //         it('Where', async () => {
        //             const whereAccountUsers = await objectsService.getAccountUsersClause(
        //                 `where=UUID like '${createdAccountUsers.UUID}'`,
        //             );
        //             const legacyWhereAccountUsers = await service.search('account_users', {
        //                 Where: `UUID like '${createdAccountUsers.UUID}'`,
        //             });
        //             expect(whereAccountUsers.length).to.equal(legacyWhereAccountUsers.Objects.length);
        //         });

        //         it('Page and PageSize', async () => {
        //             legacyAccountUsers = await objectsService.getAccountUsersClause('where=Hidden=0&page_size=-1');
        //             let legacyPageAccountUsers;
        //             legacyPageAccountUsers = await service.search('account_users', {
        //                 Page: 1,
        //                 PageSize: 1,
        //             });
        //             expect(legacyPageAccountUsers.Objects.length).to.equal(1);
        //             expect(legacyPageAccountUsers.Objects[0].Account).to.equal(legacyAccountUsers[0].Account.Data.UUID);
        //             expect(legacyPageAccountUsers.Objects[0].User).to.equal(legacyAccountUsers[0].User.Data.UUID);
        //             legacyPageAccountUsers = await service.search('account_users', {
        //                 Page: 2,
        //                 PageSize: 1,
        //             });
        //             expect(legacyPageAccountUsers.Objects.length).to.equal(1);
        //             expect(legacyPageAccountUsers.Objects[0].Account).to.equal(legacyAccountUsers[1].Account.Data.UUID);
        //             expect(legacyPageAccountUsers.Objects[0].User).to.equal(legacyAccountUsers[1].User.Data.UUID);
        //             legacyPageAccountUsers = await service.search('account_users', {
        //                 PageSize: 5,
        //             });
        //             expect(legacyPageAccountUsers.Objects.length).to.equal(5);
        //         });

        //         it('KeyList', async () => {
        //             legacyAccountUsers = await objectsService.getAccountUsersClause(
        //                 `where=UUID IN ('${legacyAccountUsers[0].UUID}','${legacyAccountUsers[1].UUID}','${legacyAccountUsers[2].UUID}','${legacyAccountUsers[3].UUID}')`,
        //             );
        //             legacyAccountUsersManipulation = JSON.parse(JSON.stringify(legacyAccountUsers));
        //             const legacyKeyListAccountUsers = await service.search('account_users', {
        //                 KeyList: [
        //                     legacyAccountUsers[0].UUID,
        //                     legacyAccountUsers[1].UUID,
        //                     legacyAccountUsers[2].UUID,
        //                     legacyAccountUsers[3].UUID,
        //                 ],
        //             });

        //             for (let index = 0; index < legacyAccountUsersManipulation.length; index++) {
        //                 legacyAccountUsersManipulation[index].Account = legacyAccountUsers[index].Account.Data.UUID;
        //                 legacyAccountUsersManipulation[index].User = legacyAccountUsers[index].User.Data.UUID;
        //                 legacyAccountUsersManipulation[index].Key = legacyAccountUsers[index].UUID;
        //                 delete legacyKeyListAccountUsers.Objects[index].CreationDateTime;
        //                 delete legacyKeyListAccountUsers.Objects[index].ModificationDateTime;
        //                 delete legacyAccountUsersManipulation[index].ModificationDateTime;
        //                 delete legacyAccountUsersManipulation[index].CreationDateTime;
        //                 delete legacyAccountUsersManipulation[index].UUID;
        //                 delete legacyAccountUsersManipulation[index].ConnectedWithFullAccountAccess;
        //                 delete legacyAccountUsersManipulation[index].FromERPIntegration;
        //             }
        //             expect(legacyKeyListAccountUsers.Objects.length).to.equal(legacyAccountUsersManipulation.length);
        //             expect(legacyKeyListAccountUsers.Objects).to.deep.equal(legacyAccountUsersManipulation);
        //         });

        //         it('UniqueFieldList', async () => {
        //             legacyAccountUsers = await objectsService.getAccountUsersClause(
        //                 `where=UUID IN ('${legacyAccountUsers[0].UUID}','${legacyAccountUsers[1].UUID}','${legacyAccountUsers[2].UUID}','${legacyAccountUsers[3].UUID}')`,
        //             );
        //             const legacyUniqueFieldAccountUsers = await service.search('account_users', {
        //                 UniqueFieldList: [
        //                     legacyAccountUsers[0].UUID,
        //                     legacyAccountUsers[1].UUID,
        //                     legacyAccountUsers[2].UUID,
        //                     legacyAccountUsers[3].UUID,
        //                 ],
        //                 UniqueFieldID: 'Key',
        //             });

        //             for (let index = 0; index < legacyUniqueFieldAccountUsers.Objects.length; index++) {
        //                 delete legacyUniqueFieldAccountUsers.Objects[index].CreationDateTime;
        //                 delete legacyUniqueFieldAccountUsers.Objects[index].ModificationDateTime;
        //             }

        //             expect(legacyUniqueFieldAccountUsers.Objects.length).to.equal(legacyAccountUsers.length);
        //             expect(legacyUniqueFieldAccountUsers.Objects).to.deep.equal(legacyAccountUsersManipulation);
        //         });

        //         it('Fields', async () => {
        //             legacyAccountUsers = await objectsService.getAccountUsersClause(
        //                 `where=InternalID=${legacyAccountUsers[0].InternalID}`,
        //             );
        //             const legacyFieldsAccountUsers = await service.search(`account_users`, {
        //                 Where: `InternalID=${legacyAccountUsers[0].InternalID}`,
        //                 Fields: ['Hidden', 'InternalID'],
        //             });
        //             expect(legacyFieldsAccountUsers.Objects.length).to.equal(legacyAccountUsers.length);
        //             expect(legacyFieldsAccountUsers.Objects).to.deep.equal([
        //                 {
        //                     Hidden: legacyAccountUsers[0].Hidden,
        //                     InternalID: legacyAccountUsers[0].InternalID,
        //                 },
        //             ]);
        //         });

        //         it('Include Count', async () => {
        //             const legacyIncludeCountAccountUsers = await service.search('account_users', {
        //                 IncludeCount: true,
        //             });
        //             expect(legacyIncludeCountAccountUsers).to.have.property('Count').that.is.a('number');
        //         });

        //         describe('DIMX + Delete', () => {
        //             it('DIMX export', async () => {
        //                 const accountsUsersForComparison = await objectsService.getAccountUsersClause(
        //                     'where=Hidden=0&page_size=-1',
        //                 );
        //                 const exportAudit = await service.dimxExport('account_users');
        //                 const dimxResult = await service.getDimxResult(exportAudit.URI);
        //                 dimxResult.forEach((object) => {
        //                     delete object['Key'];
        //                 });
        //                 accountsUsersForComparison.sort((a, b) => {
        //                     return a.InternalID - b.InternalID;
        //                 });
        //                 dimxResult.sort((a, b) => {
        //                     return a.InternalID - b.InternalID;
        //                 });
        //                 expect(accountsUsersForComparison.length).to.equal(dimxResult.length);
        //             });

        //             it('DIMX import insert', async () => {
        //                 const uuidForImport = newUuid();
        //                 const dimxImportResult = await service.dimxImport('account_users', {
        //                     Objects: [
        //                         {
        //                             Key: uuidForImport,
        //                             Account: legacyAccount.UUID,
        //                             User: users[1].UUID,
        //                         },
        //                     ],
        //                 });
        //                 expect(dimxImportResult).to.deep.equal([
        //                     {
        //                         Key: uuidForImport,
        //                         Status: 'Insert',
        //                     },
        //                 ]);
        //             });

        //             it('Delete AccountUsers and account', async () => {
        //                 const deletedAccountUsers = await objectsService.postAccountUsers({
        //                     UUID: createdAccountUsers.UUID,
        //                     Hidden: true,
        //                 });

        //                 const legacyDeletedAccountUsers = await service.post('account_users', {
        //                     Key: legacyCreatedAccountUsers.Key,
        //                     Hidden: true,
        //                 });

        //                 const DimxDeletedAccountUsers = await service.post('account_users', {
        //                     Key: legacyCreatedAccountUsers.Key,
        //                     Hidden: true,
        //                 });
        //                 expect(deletedAccountUsers).to.have.property('Hidden').that.is.true;
        //                 expect(legacyDeletedAccountUsers).to.have.property('Hidden').that.is.true;
        //                 const deletedAccount = await objectsService.createAccount({
        //                     ExternalID: accountExternalID,
        //                     Hidden: true,
        //                 });
        //                 expect(deletedAccount).to.have.property('Hidden').that.is.true;
        //                 const deletedAccount1 = await objectsService.createAccount({
        //                     ExternalID: accountExternalID + ' L',
        //                     Hidden: true,
        //                 });
        //                 expect(deletedAccount1).to.have.property('Hidden').that.is.true;
        //                 expect(DimxDeletedAccountUsers).to.have.property('Hidden').that.is.true;
        //             });
        //         });
        //     });
        // });
    });
}
