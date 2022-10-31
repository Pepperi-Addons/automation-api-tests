import GeneralService, { TesterFunctions } from '../services/general.service';
import { ObjectsService } from '../services/objects.service';
import { LegacyResourcesService } from '../services/legacy-resources.service';

export async function LegacyResourcesTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const objectsService = new ObjectsService(generalService);
    const service = new LegacyResourcesService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade Legacy Resources
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', '1.2.6'],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', '0.0.11'],
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', '0.0.33'],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', '0.0.8'],
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
            let items;
            let legacyItemExternalID;
            let itemExternalID;
            let legacyCreatedItem;
            let createdItem;
            let mainCategoryID;
            let updatedItem;
            let legacyUpdatedItem;

            it('Create Item', async () => {
                items = await objectsService.getItems();
                mainCategoryID = items[0].MainCategoryID;
                itemExternalID = 'Automated API Item' + Math.floor(Math.random() * 1000000).toString();
                legacyItemExternalID = 'Automated API Item' + Math.floor(Math.random() * 1000000).toString();

                createdItem = await objectsService.postItem({
                    ExternalID: itemExternalID,
                    MainCategoryID: mainCategoryID,
                });

                legacyCreatedItem = await service.post('items', {
                    ExternalID: legacyItemExternalID,
                    MainCategoryID: mainCategoryID,
                });

                createdItem.Key = createdItem.UUID;
                const createdItemKeys = Object.keys(createdItem);
                const legacyCreatedItemKeys = Object.keys(legacyCreatedItem);
                expect(createdItemKeys).to.deep.equal(legacyCreatedItemKeys);
                expect(legacyCreatedItem).to.have.property('InternalID').that.is.a('number');
                expect(legacyCreatedItem).to.have.property('UUID').that.is.a('string').with.lengthOf(36);
                expect(legacyCreatedItem).to.have.property('ExternalID').that.equals(legacyItemExternalID);
                expect(legacyCreatedItem).to.have.property('MainCategoryID').that.equals(mainCategoryID);
                expect(legacyCreatedItem).to.have.property('AllowDecimal').that.is.a('boolean');
                expect(legacyCreatedItem).to.have.property('CampaignID');
                expect(legacyCreatedItem).to.have.property('CaseQuantity').that.is.a('number');
                expect(legacyCreatedItem).to.have.property('CostPrice');
                expect(legacyCreatedItem).to.have.property('Discount');
                expect(legacyCreatedItem).to.have.property('FutureAvailabilityQuantity');
                expect(legacyCreatedItem).to.have.property('MinimumQuantity').that.is.a('number');
                expect(legacyCreatedItem).to.have.property('Price');
                expect(legacyCreatedItem).to.have.property('SecondaryPrice');
                expect(legacyCreatedItem.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedItem.CreationDateTime).to.include('Z');
                expect(legacyCreatedItem.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedItem.ModificationDateTime).to.include('Z');
                expect(legacyCreatedItem).to.have.property('Dimension1Code').that.is.a('string');
                expect(legacyCreatedItem).to.have.property('Dimension1Name').that.is.a('string');
                expect(legacyCreatedItem).to.have.property('Dimension2Code').that.is.a('string');
                expect(legacyCreatedItem).to.have.property('Dimension2Name').that.is.a('string');
                expect(legacyCreatedItem).to.have.property('FutureAvailabilityDate');
                expect(legacyCreatedItem).to.have.property('Hidden').that.is.a('boolean').and.is.false;
                expect(legacyCreatedItem).to.have.property('Key').that.equals(legacyCreatedItem.UUID);
                expect(legacyCreatedItem).to.have.property('Parent');
                expect(legacyCreatedItem).to.have.property('UPC');
                expect(legacyCreatedItem).to.have.property('Inventory');
                expect(legacyCreatedItem.Inventory)
                    .to.have.property('URI')
                    .that.equals(`/inventory?where=ItemInternalID=${legacyCreatedItem.InternalID}`);
                expect(legacyCreatedItem).to.have.property('Prop1');
                expect(legacyCreatedItem).to.have.property('Prop2');
                expect(legacyCreatedItem).to.have.property('Prop3');
                expect(legacyCreatedItem).to.have.property('Prop4');
                expect(legacyCreatedItem).to.have.property('Prop5');
                expect(legacyCreatedItem).to.have.property('Prop6');
                expect(legacyCreatedItem).to.have.property('Prop7');
                expect(legacyCreatedItem).to.have.property('Prop8');
                expect(legacyCreatedItem).to.have.property('Prop9');
            });

            it('Update Item', async () => {
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

                updatedItem.Key = updatedItem.UUID;
                const updatedItemKeys = Object.keys(createdItem);
                const legacyUpdatedItemKeys = Object.keys(legacyCreatedItem);
                expect(updatedItemKeys).to.deep.equal(legacyUpdatedItemKeys);
                expect(updatedItem.AllowDecimal).to.equal(legacyUpdatedItem.AllowDecimal);
                expect(updatedItem.MainCategoryID).to.equal(legacyUpdatedItem.MainCategoryID);
                expect(updatedItem.CampaignID).to.equal(legacyUpdatedItem.CampaignID);
                expect(updatedItem.CaseQuantity).to.equal(legacyUpdatedItem.CaseQuantity);
                expect(updatedItem.CostPrice).to.equal(legacyUpdatedItem.CostPrice);
                expect(updatedItem.Dimension1Code).to.equal(legacyUpdatedItem.Dimension1Code);
                expect(updatedItem.Dimension1Name).to.equal(legacyUpdatedItem.Dimension1Name);
                expect(updatedItem.Dimension2Code).to.equal(legacyUpdatedItem.Dimension2Code);
                expect(updatedItem.Dimension2Name).to.equal(legacyUpdatedItem.Dimension2Name);
                expect(updatedItem.Discount).to.equal(legacyUpdatedItem.Discount);
                expect(updatedItem.FutureAvailabilityDate).to.equal(legacyUpdatedItem.FutureAvailabilityDate);
                expect(updatedItem.FutureAvailabilityQuantity).to.equal(legacyUpdatedItem.FutureAvailabilityQuantity);
                expect(updatedItem.Hidden).to.equal(legacyUpdatedItem.Hidden);
                expect(updatedItem.CostPrice).to.equal(legacyUpdatedItem.CostPrice);
                expect(updatedItem.LongDescription).to.equal(legacyUpdatedItem.LongDescription);
                expect(updatedItem.MainCategory).to.equal(legacyUpdatedItem.MainCategory);
                expect(updatedItem.MinimumQuantity).to.equal(legacyUpdatedItem.MinimumQuantity);
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
                expect(updatedItem.SecondaryPrice).to.equal(legacyUpdatedItem.SecondaryPrice);
            });

            it('Get Item by key', async () => {
                const getByKeyItem = await service.getByKey('items', legacyCreatedItem.Key);
                expect(getByKeyItem).to.deep.equal(legacyUpdatedItem);
                await expect(service.getByKey('items', '1234')).eventually.to.be.rejected;
            });

            it('Get Item by Unique key', async () => {
                const getItemByInternalID = await service.getByUniqueKey(
                    'items',
                    'InternalID',
                    legacyCreatedItem.InternalID,
                );
                expect(getItemByInternalID).to.deep.equal(legacyUpdatedItem);
                const getItemByUUID = await service.getByUniqueKey('items', 'UUID', legacyCreatedItem.UUID);
                expect(getItemByUUID).to.deep.equal(legacyUpdatedItem);
                const getItemByExternalID = await service.getByUniqueKey(
                    'items',
                    'ExternalID',
                    legacyCreatedItem.ExternalID,
                );
                expect(getItemByExternalID).to.deep.equal(legacyUpdatedItem);
                const getItemByKey = await service.getByUniqueKey('items', 'Key', legacyCreatedItem.Key);
                expect(getItemByKey).to.deep.equal(legacyUpdatedItem);
                await expect(service.getByUniqueKey('items', 'InternalID', '123412')).eventually.to.be.rejected;
                await expect(service.getByUniqueKey('items', 'Price', '123412')).eventually.to.be.rejected;
            });

            describe('Items search', () => {
                let legacyItems;
                it('Where', async () => {
                    const whereItems = await objectsService.getItems({ where: `ExternalID like '%Automated API Item%'` });
                    const legacyWhereItems = await service.search('items', {
                        Where: `ExternalID like '%Automated API Item%'`,
                    });
                    expect(whereItems.length).to.equal(legacyWhereItems.Objects.length);
                });

                it('Page and PageSize', async () => {
                    legacyItems = await service.get('items?page_size=-1');
                    let legacyPageItems;
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
                    legacyItems = await service.get(
                        `items?where=UUID IN ('${items[0].UUID}','${items[1].UUID}','${items[2].UUID}','${items[3].UUID}')`,
                    );
                    const legacyKeyListItems = await service.search('items', {
                        KeyList: [items[0].UUID, items[1].UUID, items[2].UUID, items[3].UUID],
                    });
                    expect(legacyKeyListItems.Objects.length).to.equal(legacyItems.length);
                    expect(legacyKeyListItems.Objects).to.deep.equal(legacyItems);
                });

                it('UniqueFieldList', async () => {
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
                    legacyItems = await service.get(`items?where=InternalID=${items[0].InternalID}`);
                    const legacyFieldsItems = await service.search(`items`, {
                        Where: `InternalID=${items[0].InternalID}`,
                        Fields: ['InternalID', 'ExternalID'],
                    });
                    expect(legacyFieldsItems.Objects.length).to.equal(legacyItems.length);
                    expect(legacyFieldsItems.Objects).to.deep.equal([{ InternalID: items[0].InternalID, ExternalID: items[0].ExternalID }]);
                });

                it('Include Count', async () => {
                    legacyItems = await service.get(`items`);
                    let legacyIncludeCountItems;
                    legacyIncludeCountItems = await service.search('items', {
                        IncludeCount: true
                    });
                    expect(legacyIncludeCountItems.Objects.length).to.equal(legacyItems.length);
                    expect(legacyIncludeCountItems.Count).equal(legacyItems.length);
                });
            });

            it('Delete items', async () => {
                let deletedItem = await objectsService.postItem({
                    ExternalID: itemExternalID,
                    MainCategoryID: mainCategoryID,
                    Hidden: true
                });

                let legacyDeletedItem = await service.post('items', {
                    ExternalID: legacyItemExternalID,
                    MainCategoryID: mainCategoryID,
                    Hidden: true
                });
                expect(deletedItem).to.have.property('Hidden').that.is.true;
                expect(legacyDeletedItem).to.have.property('Hidden').that.is.true;
            });
        });

        describe('Accounts', () => {
            let accounts;
            let legacyAccountExternalID;
            let accountExternalID;
            let legacyCreatedAccount;
            let createdAccount;
            let updatedAccount;
            let legacyUpdatedAccount;

            it('Create Account', async () => {
                // debugger;
                accounts = await objectsService.getAccounts();
                accountExternalID = 'Automated API Account' + Math.floor(Math.random() * 1000000).toString();
                legacyAccountExternalID = 'Automated API Account' + Math.floor(Math.random() * 1000000).toString();

                createdAccount = await objectsService.createAccount({
                    ExternalID: accountExternalID,
                });

                legacyCreatedAccount = await service.post('accounts', {
                    ExternalID: legacyAccountExternalID,
                });

                createdAccount.Key = createdAccount.UUID;
                const createdAccountKeys = Object.keys(createdAccount);
                const legacyCreatedAccountKeys = Object.keys(legacyCreatedAccount);
                expect(createdAccountKeys).to.deep.equal(legacyCreatedAccountKeys);
                expect(legacyCreatedAccount).to.have.property('InternalID').that.is.a('number');
                expect(legacyCreatedAccount).to.have.property('UUID').that.is.a('string').with.lengthOf(36);
                expect(legacyCreatedAccount).to.have.property('ExternalID').that.equals(legacyAccountExternalID);
                expect(legacyCreatedAccount).to.have.property('City').that.equals(createdAccount.City);
                expect(legacyCreatedAccount).to.have.property('Country').that.equals(createdAccount.Country);
                expect(legacyCreatedAccount).to.have.property('Debts30').that.is.a('number');
                expect(legacyCreatedAccount).to.have.property('Debts60').that.is.a('number');
                expect(legacyCreatedAccount).to.have.property('Debts90').that.is.a('number');
                expect(legacyCreatedAccount).to.have.property('Discount').that.is.a('number');
                expect(legacyCreatedAccount).to.have.property('DebtsAbove90').that.is.a('number');
                expect(legacyCreatedAccount).to.have.property('Email').that.is.a('string');
                expect(legacyCreatedAccount).to.have.property('Latitude').that.is.a('number');
                expect(legacyCreatedAccount).to.have.property('Longitude').that.is.a('number');
                expect(legacyCreatedAccount.CreationDate).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedAccount.CreationDate).to.include('Z');
                expect(legacyCreatedAccount.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedAccount.ModificationDateTime).to.include('Z');
                expect(legacyCreatedAccount).to.have.property('Mobile');
                expect(legacyCreatedAccount).to.have.property('Name');
                expect(legacyCreatedAccount).to.have.property('Note');
                expect(legacyCreatedAccount).to.have.property('Phone');
                expect(legacyCreatedAccount).to.have.property('State');
                expect(legacyCreatedAccount).to.have.property('Hidden').that.is.a('boolean').and.is.false;
                expect(legacyCreatedAccount).to.have.property('Key').that.equals(legacyCreatedAccount.UUID);
                expect(legacyCreatedAccount).to.have.property('Status').that.is.a('number').and.equals(2);
                expect(legacyCreatedAccount).to.have.property('StatusName').that.is.a('string').and.equals('Submitted');
                expect(legacyCreatedAccount).to.have.property('Street');
                expect(legacyCreatedAccount.Catalogs)
                    .to.have.property('URI')
                    .that.equals(`/account_catalogs?where=AccountInternalID=${legacyCreatedAccount.InternalID}`);
                expect(legacyCreatedAccount).to.have.property('Prop1');
                expect(legacyCreatedAccount).to.have.property('Prop2');
                expect(legacyCreatedAccount).to.have.property('Prop3');
                expect(legacyCreatedAccount).to.have.property('Prop4');
                expect(legacyCreatedAccount).to.have.property('Prop5');
                expect(legacyCreatedAccount).to.have.property('Type');
                expect(legacyCreatedAccount).to.have.property('TypeDefinitionID').that.is.a('number');
                expect(legacyCreatedAccount).to.have.property('ZipCode');
                expect(legacyCreatedAccount).to.have.property('PriceList');
                expect(legacyCreatedAccount).to.have.property('SpecialPriceList');
                expect(legacyCreatedAccount).to.have.property('Users');
            });

            it('Update account', async () => {
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

                updatedAccount.Key = updatedAccount.UUID;
                const updatedAccountKeys = Object.keys(createdAccount);
                const legacyUpdatedAccountKeys = Object.keys(legacyCreatedAccount);
                expect(updatedAccountKeys).to.deep.equal(legacyUpdatedAccountKeys);
                expect(updatedAccount.City).to.equal(legacyUpdatedAccount.City);
                expect(updatedAccount.Country).to.equal(legacyUpdatedAccount.Country);
                expect(updatedAccount.Debts30).to.equal(legacyUpdatedAccount.Debts30);
                expect(updatedAccount.Debts60).to.equal(legacyUpdatedAccount.Debts60);
                expect(updatedAccount.Debts90).to.equal(legacyUpdatedAccount.Debts90);
                expect(updatedAccount.DebtsAbove90).to.equal(legacyUpdatedAccount.DebtsAbove90);
                expect(updatedAccount.Discount).to.equal(legacyUpdatedAccount.Discount);
                expect(updatedAccount.Hidden).to.equal(legacyUpdatedAccount.Hidden);
                expect(updatedAccount.Latitude).to.equal(legacyUpdatedAccount.Latitude);
                expect(updatedAccount.Longitude).to.equal(legacyUpdatedAccount.Longitude);
                expect(updatedAccount.Name).to.equal(legacyUpdatedAccount.Name);
                expect(updatedAccount.Note).to.equal(legacyUpdatedAccount.Note);
                expect(updatedAccount.Mobile).to.equal(legacyUpdatedAccount.Mobile);
                expect(updatedAccount.Phone).to.equal(legacyUpdatedAccount.Phone);
                expect(updatedAccount.State).to.equal(legacyUpdatedAccount.State);
                expect(updatedAccount.Status).to.equal(legacyUpdatedAccount.Status);
                expect(updatedAccount.StatusName).to.equal(legacyUpdatedAccount.StatusName);
                expect(updatedAccount.Street).to.equal(legacyUpdatedAccount.Street);
                expect(updatedAccount.Type).to.equal(legacyUpdatedAccount.Type);
                expect(updatedAccount.Prop1).to.equal(legacyUpdatedAccount.Prop1);
                expect(updatedAccount.Prop2).to.equal(legacyUpdatedAccount.Prop2);
                expect(updatedAccount.Prop3).to.equal(legacyUpdatedAccount.Prop3);
                expect(updatedAccount.Prop4).to.equal(legacyUpdatedAccount.Prop4);
                expect(updatedAccount.Prop5).to.equal(legacyUpdatedAccount.Prop5);
                expect(updatedAccount.TypeDefinitionID).to.equal(legacyUpdatedAccount.TypeDefinitionID);
                expect(updatedAccount.ZipCode).to.equal(legacyUpdatedAccount.ZipCode);
                expect(updatedAccount.Parent).to.equal(legacyUpdatedAccount.Parent);
                expect(updatedAccount.PriceList).to.equal(legacyUpdatedAccount.PriceList);
                expect(updatedAccount.SpecialPriceList).to.equal(legacyUpdatedAccount.SpecialPriceList);
            });

            it('Get account by key', async () => {
                const getByKeyAccount = await service.getByKey('accounts', legacyCreatedAccount.Key);
                expect(getByKeyAccount).to.deep.equal(legacyUpdatedAccount);
                await expect(service.getByKey('accounts', '1234')).eventually.to.be.rejected;
            });

            it('Get account by Unique key', async () => {
                const getAccountByInternalID = await service.getByUniqueKey(
                    'accounts',
                    'InternalID',
                    legacyCreatedAccount.InternalID,
                );
                expect(getAccountByInternalID).to.deep.equal(legacyUpdatedAccount);
                const getAccountByUUID = await service.getByUniqueKey('accounts', 'UUID', legacyCreatedAccount.UUID);
                expect(getAccountByUUID).to.deep.equal(legacyUpdatedAccount);
                const getAccountByExternalID = await service.getByUniqueKey(
                    'accounts',
                    'ExternalID',
                    legacyCreatedAccount.ExternalID,
                );
                expect(getAccountByExternalID).to.deep.equal(legacyUpdatedAccount);
                const getAccountByKey = await service.getByUniqueKey('accounts', 'Key', legacyCreatedAccount.Key);
                expect(getAccountByKey).to.deep.equal(legacyUpdatedAccount);
                await expect(service.getByUniqueKey('accounts', 'InternalID', '123412')).eventually.to.be.rejected;
                await expect(service.getByUniqueKey('accounts', 'Price', '123412')).eventually.to.be.rejected;
            });

            describe('Accounts search', () => {
                let legacyAccounts;
                it('Where', async () => {
                    const whereAccounts = await objectsService.getAccounts({
                        where: `ExternalID like '%Automated API Account%'`,
                    });
                    const legacyWhereAccounts = await service.search('accounts', {
                        Where: `ExternalID like '%Automated API Account%'`,
                    });
                    expect(whereAccounts.length).to.equal(legacyWhereAccounts.Objects.length);
                });

                it('Page and PageSize', async () => {
                    legacyAccounts = await service.get('accounts?page_size=-1');
                    let legacyPageAccounts;
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
                    legacyAccounts = await service.get(
                        `accounts?where=UUID IN ('${accounts[0].UUID}','${accounts[1].UUID}','${accounts[2].UUID}','${accounts[3].UUID}')`,
                    );
                    const legacyKeyListAccounts = await service.search('accounts', {
                        KeyList: [accounts[0].UUID, accounts[1].UUID, accounts[2].UUID, accounts[3].UUID],
                    });
                    expect(legacyKeyListAccounts.Objects.length).to.equal(legacyAccounts.length);
                    expect(legacyKeyListAccounts.Objects).to.deep.equal(legacyAccounts);
                });

                it('UniqueFieldList', async () => {
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
                    legacyAccounts = await service.get(`accounts?where=InternalID=${accounts[0].InternalID}`);
                    const legacyFieldsAccounts = await service.search(`accounts`, {
                        Where: `InternalID=${accounts[0].InternalID}`,
                        Fields: ['InternalID', 'ExternalID'],
                    });
                    expect(legacyFieldsAccounts.Objects.length).to.equal(legacyAccounts.length);
                    expect(legacyFieldsAccounts.Objects).to.deep.equal([{ InternalID: accounts[0].InternalID, ExternalID: accounts[0].ExternalID }]);
                });


                it('Include Count', async () => {
                    let legacyAccountsForCountValidation = await service.get(`accounts?page_size=-1`);
                    legacyAccounts = await service.get(`accounts`);
                    let legacyIncludeCountAccounts;
                    legacyIncludeCountAccounts = await service.search('accounts', {
                        IncludeCount: true
                    });
                    expect(legacyIncludeCountAccounts.Objects.length).to.equal(legacyAccounts.length);
                    expect(legacyIncludeCountAccounts.Count).equal(legacyAccountsForCountValidation.length);
                });
            });

            it('Delete accounts', async () => {
                let deletedAccount = await objectsService.createAccount({
                    ExternalID: accountExternalID,
                    Hidden: true
                });

                let legacyDeletedAccount = await service.post('accounts', {
                    ExternalID: legacyAccountExternalID,
                    Hidden: true
                });
                expect(deletedAccount).to.have.property('Hidden').that.is.true;
                expect(legacyDeletedAccount).to.have.property('Hidden').that.is.true;
            });
        });

        describe('Users', () => {
            let users;
            let legacyUserExternalID;
            let userExternalID;
            let legacyCreatedUser;
            let createdUser;
            let userEmail;
            let legacyUserEmail;
            let updatedUser;
            let legacyUpdatedUser;

            it('Create User', async () => {
                users = await objectsService.getUsers();
                userExternalID = 'Automated API User' + Math.floor(Math.random() * 1000000).toString();
                userEmail =
                    'Email' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '@' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '.com';
                legacyUserExternalID = 'Automated API User' + Math.floor(Math.random() * 1000000).toString();
                legacyUserEmail =
                    'Email' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '@' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '.com';

                createdUser = await objectsService.createUser({
                    ExternalID: userExternalID,
                    Email: userEmail,
                });

                legacyCreatedUser = await service.post('users', {
                    ExternalID: legacyUserExternalID,
                    Email: legacyUserEmail,
                });

                createdUser.Key = createdUser.UUID;
                const createdUserKeys = Object.keys(createdUser);
                const legacyCreatedUserKeys = Object.keys(legacyCreatedUser);
                expect(createdUserKeys).to.deep.equal(legacyCreatedUserKeys);
                expect(legacyCreatedUser).to.have.property('InternalID').that.is.a('number');
                expect(legacyCreatedUser).to.have.property('UUID').that.is.a('string').with.lengthOf(36);
                expect(legacyCreatedUser).to.have.property('ExternalID').that.equals(legacyUserExternalID);
                expect(legacyCreatedUser).to.have.property('Email').that.equals(legacyUserEmail);
                expect(legacyCreatedUser).to.have.property('FirstName').that.is.a('string');
                expect(legacyCreatedUser).to.have.property('Hidden').that.is.a('boolean').and.is.false;
                expect(legacyCreatedUser).to.have.property('IsInTradeShowMode').that.is.a('boolean').and.is.false;
                expect(legacyCreatedUser).to.have.property('LastName').that.is.a('string');
                expect(legacyCreatedUser).to.have.property('Mobile').that.is.a('string');
                expect(legacyCreatedUser).to.have.property('Phone').that.is.a('string');
                expect(legacyCreatedUser.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedUser.CreationDateTime).to.include('Z');
                expect(legacyCreatedUser.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedUser.ModificationDateTime).to.include('Z');
                expect(legacyCreatedUser).to.have.property('SecurityGroup');
                expect(legacyCreatedUser).to.have.property('Profile');
                expect(legacyCreatedUser).to.have.property('Role');
            });

            it('Update user', async () => {
                updatedUser = await objectsService.updateUser({
                    ExternalID: userExternalID,
                    Email: userEmail,
                    FirstName: 'Testing12345',
                });

                legacyUpdatedUser = await service.post('users', {
                    ExternalID: legacyUserExternalID,
                    Email: legacyUserEmail,
                    FirstName: 'Testing12345',
                });

                updatedUser.Key = updatedUser.UUID;
                const updatedUserKeys = Object.keys(createdUser);
                const legacyUpdatedUserKeys = Object.keys(legacyCreatedUser);
                expect(updatedUserKeys).to.deep.equal(legacyUpdatedUserKeys);
                expect(updatedUser.FirstName).to.equal(legacyUpdatedUser.FirstName);
                expect(updatedUser.Hidden).to.equal(legacyUpdatedUser.Hidden);
                expect(updatedUser.IsInTradeShowMode).to.equal(legacyUpdatedUser.IsInTradeShowMode);
                expect(updatedUser.LastName).to.equal(legacyUpdatedUser.LastName);
                expect(updatedUser.Mobile).to.equal(legacyUpdatedUser.Mobile);
                expect(updatedUser.Phone).to.equal(legacyUpdatedUser.Phone);
                expect(updatedUser.SecurityGroup).to.deep.equal(legacyUpdatedUser.SecurityGroup);
                expect(updatedUser.Profile).to.deep.equal(legacyUpdatedUser.Profile);
                expect(updatedUser.Role).to.deep.equal(legacyUpdatedUser.Role);
            });

            it('Get user by key', async () => {
                const getByKeyUser = await service.getByKey('users', legacyCreatedUser.Key);
                expect(getByKeyUser).to.deep.equal(legacyUpdatedUser);
                await expect(service.getByKey('users', '1234')).eventually.to.be.rejected;
            });

            it('Get user by Unique key', async () => {
                const getUserByInternalID = await service.getByUniqueKey(
                    'users',
                    'InternalID',
                    legacyCreatedUser.InternalID,
                );
                expect(getUserByInternalID).to.deep.equal(legacyUpdatedUser);
                const getUserByUUID = await service.getByUniqueKey('users', 'UUID', legacyCreatedUser.UUID);
                expect(getUserByUUID).to.deep.equal(legacyUpdatedUser);
                const getUserByExternalID = await service.getByUniqueKey(
                    'users',
                    'ExternalID',
                    legacyCreatedUser.ExternalID,
                );
                expect(getUserByExternalID).to.deep.equal(legacyUpdatedUser);
                const getUserByKey = await service.getByUniqueKey('users', 'Key', legacyCreatedUser.Key);
                expect(getUserByKey).to.deep.equal(legacyUpdatedUser);
                await expect(service.getByUniqueKey('users', 'InternalID', '123412')).eventually.to.be.rejected;
                await expect(service.getByUniqueKey('users', 'Price', '123412')).eventually.to.be.rejected;
            });

            describe('Users search', () => {
                let legacyUsers;
                it('Where', async () => {
                    const whereUsers = await objectsService.getUsers({ where: `ExternalID='Automated API User'` });
                    const legacyWhereUsers = await service.search('users', {
                        where: `ExternalID='Automated API User'`,
                    });
                    expect(whereUsers.length).to.equal(legacyWhereUsers.Objects.length);
                });

                it('Page and PageSize', async () => {
                    legacyUsers = await service.get('users?page_size=-1');
                    let legacyPageUsers;
                    legacyPageUsers = await service.search('users', {
                        Page: 1,
                        PageSize: 1,
                    });
                    expect(legacyPageUsers.Objects.length).to.equal(1);
                    expect(legacyPageUsers.Objects[0]).to.deep.equal(legacyUsers[0]);
                    legacyPageUsers = await service.search('users', {
                        Page: 2,
                        PageSize: 1,
                    });
                    expect(legacyPageUsers.Objects.length).to.equal(1);
                    expect(legacyPageUsers.Objects[0]).to.deep.equal(legacyUsers[1]);
                    legacyPageUsers = await service.search('users', {
                        PageSize: 5,
                    });
                    expect(legacyPageUsers.Objects.length).to.equal(5);
                    legacyPageUsers = await service.search('users', {
                        PageSize: -1,
                    });
                    expect(legacyPageUsers.Objects.length).to.equal(legacyUsers.length);
                });

                it('KeyList', async () => {
                    legacyUsers = await service.get(
                        `users?where=UUID IN ('${users[0].UUID}','${users[1].UUID}','${users[2].UUID}','${users[3].UUID}')`,
                    );
                    const legacyKeyListUsers = await service.search('users', {
                        KeyList: [users[0].UUID, users[1].UUID, users[2].UUID, users[3].UUID],
                    });
                    expect(legacyKeyListUsers.Objects.length).to.equal(legacyUsers.length);
                    expect(legacyKeyListUsers.Objects).to.deep.equal(legacyUsers);
                });

                it('UniqueFieldList', async () => {
                    legacyUsers = await service.get(
                        `users?where=InternalID IN ('${users[0].InternalID}','${users[1].InternalID}','${users[2].InternalID}','${users[3].InternalID}')`,
                    );
                    const legacyUniqueFieldUsers = await service.search('users', {
                        UniqueFieldList: [
                            users[0].InternalID,
                            users[1].InternalID,
                            users[2].InternalID,
                            users[3].InternalID,
                        ],
                        UniqueFieldID: 'InternalID',
                    });
                    expect(legacyUniqueFieldUsers.Objects.length).to.equal(legacyUsers.length);
                    expect(legacyUniqueFieldUsers.Objects).to.deep.equal(legacyUsers);
                });

                it('Fields', async () => {
                    legacyUsers = await service.get(`users?where=InternalID=${users[0].InternalID}`);
                    const legacyFieldsUsers = await service.search(`users`, {
                        Where: `InternalID=${users[0].InternalID}`,
                        Fields: ['InternalID','ExternalID'],
                    });
                    expect(legacyFieldsUsers.Objects.length).to.equal(legacyUsers.length);
                    expect(legacyFieldsUsers.Objects).to.deep.equal([{ InternalID: users[0].InternalID, ExternalID: users[0].ExternalID }]);
                });

                it('Include Count', async () => {
                    let legacyUsersForCountValidation = await service.get(`users?page_size=-1`);
                    legacyUsers = await service.get(`users`);
                    let legacyIncludeCountUsers;
                    legacyIncludeCountUsers = await service.search('users', {
                        IncludeCount: true
                    });
                    expect(legacyIncludeCountUsers.Objects.length).to.equal(legacyUsers.length);
                    expect(legacyIncludeCountUsers.Count).equal(legacyUsersForCountValidation.length);
                });
            });

            it('Delete users', async () => {
                let deletedUser = await objectsService.updateUser({
                    ExternalID: userExternalID,
                    Email: userEmail,
                    Hidden: true
                });

                let legacyDeletedUser = await service.post('users', {
                    ExternalID: legacyUserExternalID,
                    Email: legacyUserEmail,
                    Hidden: true
                });
                expect(deletedUser).to.have.property('Hidden').that.is.true;
                expect(legacyDeletedUser).to.have.property('Hidden').that.is.true;
            });
        });
    });
}
