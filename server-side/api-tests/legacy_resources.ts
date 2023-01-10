import GeneralService, { TesterFunctions } from '../services/general.service';
import { ObjectsService } from '../services/objects.service';
import { LegacyResourcesService } from '../services/legacy-resources.service';
// import { v4 as newUuid } from 'uuid';

export async function LegacyResourcesTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const objectsService = new ObjectsService(generalService);
    const service = new LegacyResourcesService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade Legacy Resources
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', '0.0.11'],
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', '0.6.27'],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', '0.6.26'],
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
            let legacyPageItems;

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
                    const whereItems = await objectsService.getItems({
                        where: `ExternalID like '%Automated API Item%'`,
                    });
                    const legacyWhereItems = await service.search('items', {
                        Where: `ExternalID like '%Automated API Item%'`,
                    });
                    expect(whereItems.length).to.equal(legacyWhereItems.Objects.length);
                });

                it('Page and PageSize', async () => {
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
                        Fields: ['InternalID', 'ExternalID', 'Key'],
                    });
                    expect(legacyFieldsItems.Objects.length).to.equal(legacyItems.length);
                    expect(legacyFieldsItems.Objects).to.deep.equal([
                        { InternalID: items[0].InternalID, ExternalID: items[0].ExternalID, Key: items[0].UUID },
                    ]);
                });

                it('Include Count', async () => {
                    const legacyIncludeCountItems = await service.search('items', {
                        IncludeCount: true,
                    });
                    expect(legacyIncludeCountItems).to.have.property('Count').that.is.a('number');
                });
            });

            describe('DIMX + Delete', () => {
                it('DIMX export', async () => {
                    const exportAudit = await service.dimxExport('items');
                    const dimxResult = await service.getDimxResult(exportAudit.URI);
                    legacyPageItems.Objects.sort((a, b) => {
                        return a.InternalID - b.InternalID;
                    });
                    dimxResult.sort((a, b) => {
                        return a.InternalID - b.InternalID;
                    });
                    expect(legacyPageItems.Objects.length).to.equal(dimxResult.length);
                    expect(legacyPageItems.Objects).to.deep.equal(dimxResult);
                });

                it('Delete items', async () => {
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
                    expect(deletedItem).to.have.property('Hidden').that.is.true;
                    expect(legacyDeletedItem).to.have.property('Hidden').that.is.true;
                });
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
            let legacyPageAccounts;

            it('Create Account', async () => {

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
                expect(legacyCreatedAccount.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedAccount.CreationDateTime).to.include('Z');
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
                const accountAfterUpdate = await objectsService.getAccountByID(legacyCreatedAccount.InternalID);
                accountAfterUpdate.Key = legacyCreatedAccount.UUID;
                const getByKeyAccount = await service.getByKey('accounts', legacyCreatedAccount.Key);
                expect(getByKeyAccount).to.deep.equal(accountAfterUpdate);
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
                        Fields: ['InternalID', 'ExternalID', 'Key'],
                    });
                    expect(legacyFieldsAccounts.Objects.length).to.equal(legacyAccounts.length);
                    expect(legacyFieldsAccounts.Objects).to.deep.equal([
                        { InternalID: accounts[0].InternalID, ExternalID: accounts[0].ExternalID, Key: accounts[0].UUID },
                    ]);
                });

                it('Include Count', async () => {
                    const legacyIncludeCountAccounts = await service.search('accounts', {
                        IncludeCount: true,
                    });
                    expect(legacyIncludeCountAccounts).to.have.property('Count').that.is.a('number');
                });
            });

            describe('DIMX + Delete', () => {
                it('DIMX export', async () => {
                    const accountsForComparison = await objectsService.getAccounts({page_size: -1});
                    const exportAudit = await service.dimxExport('accounts');
                    const dimxResult = await service.getDimxResult(exportAudit.URI);
                    dimxResult.forEach(object => {
                        delete object['Key'];
                      });
                    accountsForComparison.sort((a,b) => {return a.InternalID! - b.InternalID!});
                    dimxResult.sort((a,b) => {return a.InternalID - b.InternalID});
                    expect(accountsForComparison.length).to.equal(dimxResult.length);
                    expect(accountsForComparison).to.deep.equal(dimxResult);
                });

                it('Delete accounts', async () => {
                    const deletedAccount = await objectsService.createAccount({
                        ExternalID: accountExternalID,
                        Hidden: true,
                    });

                    const legacyDeletedAccount = await service.post('accounts', {
                        ExternalID: legacyAccountExternalID,
                        Hidden: true,
                    });
                    expect(deletedAccount).to.have.property('Hidden').that.is.true;
                    expect(legacyDeletedAccount).to.have.property('Hidden').that.is.true;
                });
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
                        Fields: ['InternalID', 'ExternalID', 'Key'],
                    });
                    expect(legacyFieldsUsers.Objects.length).to.equal(legacyUsers.length);
                    expect(legacyFieldsUsers.Objects).to.deep.equal([
                        { InternalID: users[0].InternalID, ExternalID: users[0].ExternalID, Key: users[0].UUID },
                    ]);
                });

                it('Include Count', async () => {
                    const legacyIncludeCountUsers = await service.search('users', {
                        IncludeCount: true,
                    });
                    expect(legacyIncludeCountUsers).to.have.property('Count').that.is.a('number');
                });
            });

            it('Delete users', async () => {
                const deletedUser = await objectsService.updateUser({
                    ExternalID: userExternalID,
                    Email: userEmail,
                    Hidden: true,
                });

                const legacyDeletedUser = await service.post('users', {
                    ExternalID: legacyUserExternalID,
                    Email: legacyUserEmail,
                    Hidden: true,
                });
                expect(deletedUser).to.have.property('Hidden').that.is.true;
                expect(legacyDeletedUser).to.have.property('Hidden').that.is.true;
            });
        });

        describe('Contact', () => {
            let contacts;
            let legacyContactExternalID;
            let contactExternalID;
            let accountForContact;
            let legacyCreatedContact;
            let createdContact;
            let contactEmail;
            let updatedContact;
            let legacyUpdatedContact;

            it('Create Contact', async () => {
                contacts = await objectsService.getContacts();
                contactExternalID = 'Automated API Item' + Math.floor(Math.random() * 1000000).toString();
                legacyContactExternalID = 'Automated API Item' + Math.floor(Math.random() * 1000000).toString();
                contactEmail = 'Email' + Math.floor(Math.random() * 1000000).toString() + '@' + Math.floor(Math.random() * 1000000).toString() + '.com'
                accountForContact = await objectsService.getAccounts();
                accountForContact = accountForContact[0];

                createdContact = await objectsService.createContact({
                    ExternalID: contactExternalID,
                    Email: contactEmail,
                    Phone: '123-45678',
                    Mobile: '123-45678',
                    FirstName: 'Contact',
                    LastName: 'Test',
                    Account: {
                        Data: {
                            InternalID: accountForContact.InternalID,
                        },
                    },
                });

                legacyCreatedContact = await service.post('contacts', {
                    ExternalID: legacyContactExternalID,
                    Email: contactEmail,
                    Phone: '123-45678',
                    Mobile: '123-45678',
                    FirstName: 'Contact',
                    LastName: 'Test',
                    Account: {
                        Data: {
                            InternalID: accountForContact.InternalID,
                        },
                    },
                });

                createdContact.Key = createdContact.UUID;
                const createdContactKeys = Object.keys(createdContact);
                const legacyCreatedContactKeys = Object.keys(legacyCreatedContact);
                expect(createdContactKeys).to.deep.equal(legacyCreatedContactKeys);
                expect(legacyCreatedContact).to.have.property('InternalID').that.is.a('number');
                expect(legacyCreatedContact).to.have.property('UUID').that.is.a('string').with.lengthOf(36);
                expect(legacyCreatedContact).to.have.property('ExternalID').that.equals(legacyContactExternalID);
                expect(legacyCreatedContact).to.have.property('Email').that.equals(contactEmail);
                expect(legacyCreatedContact).to.have.property('Email2').that.is.null;
                expect(legacyCreatedContact).to.have.property('FirstName').that.equals('Contact');
                expect(legacyCreatedContact).to.have.property('Hidden').that.is.false;
                expect(legacyCreatedContact).to.have.property('IsBuyer').that.is.false;
                expect(legacyCreatedContact).to.have.property('LastName').that.equals('Test');
                expect(legacyCreatedContact).to.have.property('Mobile').that.equals('123-45678');
                expect(legacyCreatedContact).to.have.property('Phone').that.equals('123-45678');
                expect(legacyCreatedContact).to.have.property('Role').that.is.null;
                expect(legacyCreatedContact).to.have.property('Status').that.equals(2);
                expect(legacyCreatedContact.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedContact.CreationDateTime).to.include('Z');
                expect(legacyCreatedContact.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedContact.ModificationDateTime).to.include('Z');
                expect(legacyCreatedContact).to.have.property('TypeDefinitionID').that.is.a('number');
                expect(legacyCreatedContact).to.have.property('Key').that.equals(legacyCreatedContact.UUID);
                expect(legacyCreatedContact.Account.Data).to.have.property('InternalID').that.equals(accountForContact.InternalID);
                expect(legacyCreatedContact.Account.Data).to.have.property('UUID').that.equals(accountForContact.UUID);
                expect(legacyCreatedContact.Account.Data).to.have.property('ExternalID').that.equals(accountForContact.ExternalID);
                expect(legacyCreatedContact.Account)
                .to.have.property('URI').that.equals(`/accounts/${accountForContact.InternalID}`);
                expect(legacyCreatedContact).to.have.property('Profile').that.is.null;
            });

            it('Update Contact', async () => {
                updatedContact = await objectsService.createContact({
                    ExternalID: contactExternalID,
                    Email: contactEmail,
                    Phone: '1234-456789',
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
                    Phone: '1234-456789',
                    Mobile: '1234-456789',
                    FirstName: 'Contact Update',
                    LastName: 'Test Update',
                    Account: {
                        Data: {
                            InternalID: accountForContact.InternalID,
                        },
                    },
                });

                updatedContact.Key = updatedContact.UUID;
                const updatedContactKeys = Object.keys(updatedContact);
                const legacyUpdatedContactKeys = Object.keys(legacyUpdatedContact);
                expect(updatedContactKeys).to.deep.equal(legacyUpdatedContactKeys);
                expect(updatedContact.Email).to.equal(legacyUpdatedContact.Email);
                expect(updatedContact.Email2).to.equal(legacyUpdatedContact.Email2);
                expect(updatedContact.FirstName).to.equal(legacyUpdatedContact.FirstName);
                expect(updatedContact.Hidden).to.equal(legacyUpdatedContact.Hidden);
                expect(updatedContact.IsBuyer).to.equal(legacyUpdatedContact.IsBuyer);
                expect(updatedContact.LastName).to.equal(legacyUpdatedContact.LastName);
                expect(updatedContact.Mobile).to.equal(legacyUpdatedContact.Mobile);
                expect(updatedContact.Phone).to.equal(legacyUpdatedContact.Phone);
                expect(updatedContact.Role).to.equal(legacyUpdatedContact.Role);
                expect(updatedContact.Status).to.equal(legacyUpdatedContact.Status);
                expect(updatedContact.TypeDefinitionID).to.equal(legacyUpdatedContact.TypeDefinitionID);
                expect(updatedContact.Profile).to.equal(legacyUpdatedContact.Profile);
            });

            it('Get Contact by key', async () => {
                const getByKeyContact = await service.getByKey('contacts', legacyCreatedContact.Key);
                expect(getByKeyContact).to.deep.equal(legacyUpdatedContact);
                await expect(service.getByKey('contacts', '1234')).eventually.to.be.rejected;
            });

            it('Get Contact by Unique key', async () => {
                const getContactByInternalID = await service.getByUniqueKey(
                    'contacts',
                    'InternalID',
                    legacyCreatedContact.InternalID,
                );
                expect(getContactByInternalID).to.deep.equal(legacyUpdatedContact);
                const getContactByUUID = await service.getByUniqueKey('contacts', 'UUID', legacyCreatedContact.UUID);
                expect(getContactByUUID).to.deep.equal(legacyUpdatedContact);
                const getContactByExternalID = await service.getByUniqueKey(
                    'contacts',
                    'ExternalID',
                    legacyCreatedContact.ExternalID,
                );
                expect(getContactByExternalID).to.deep.equal(legacyUpdatedContact);
                const getContactByKey = await service.getByUniqueKey('contacts', 'Key', legacyCreatedContact.Key);
                expect(getContactByKey).to.deep.equal(legacyUpdatedContact);
                await expect(service.getByUniqueKey('contacts', 'InternalID', '123412')).eventually.to.be.rejected;
                await expect(service.getByUniqueKey('contacts', 'Price', '123412')).eventually.to.be.rejected;
            });

            describe('Contacts search', () => {
                let legacyContacts;
                it('Where', async () => {
                    const whereContacts = await objectsService.getContactsSDK({
                        where: `ExternalID like '%Automated API Item%'`,
                    });
                    const legacyWhereContacts = await service.search('contacts', {
                        Where: `ExternalID like '%Automated API Item%'`,
                    });
                    expect(whereContacts.length).to.equal(legacyWhereContacts.Objects.length);
                });

                it('Page and PageSize', async () => {
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
                    legacyContacts = await service.get(
                        `contacts?where=UUID IN ('${contacts[0].UUID}','${contacts[1].UUID}','${contacts[2].UUID}','${contacts[3].UUID}')`,
                    );
                    const legacyKeyListContacts = await service.search('contacts', {
                        KeyList: [contacts[0].UUID, contacts[1].UUID, contacts[2].UUID, contacts[3].UUID],
                    });
                    expect(legacyKeyListContacts.Objects.length).to.equal(legacyContacts.length);
                    expect(legacyKeyListContacts.Objects).to.deep.equal(legacyContacts);
                });

                it('UniqueFieldList', async () => {
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
                    legacyContacts = await service.get(`contacts?where=InternalID=${contacts[0].InternalID}`);
                    const legacyFieldsContacts = await service.search(`contacts`, {
                        Where: `InternalID=${contacts[0].InternalID}`,
                        Fields: ['InternalID', 'ExternalID', 'Key'],
                    });
                    expect(legacyFieldsContacts.Objects.length).to.equal(legacyContacts.length);
                    expect(legacyFieldsContacts.Objects).to.deep.equal([
                        { InternalID: contacts[0].InternalID, ExternalID: contacts[0].ExternalID, Key: contacts[0].UUID },
                    ]);
                });

                it('Include Count', async () => {
                    const legacyIncludeCountContacts = await service.search('contacts', {
                        IncludeCount: true,
                    });
                    expect(legacyIncludeCountContacts).to.have.property('Count').that.is.a('number');
                });
            });

            it('Delete contacts', async () => {
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

        describe('AccountUsers', () => {
            let AccountUsers;
            let account;
            let legacyAccount;
            let accountExternalID = 'Automated API ' + Math.floor(Math.random() * 1000000).toString();
            let users;
            let legacyCreatedAccountUsers;
            let createdAccountUsers;

            it('Create AccountUsers', async () => {
                account = await objectsService.createAccount({
                    ExternalID: accountExternalID,
                    Name: accountExternalID
                });

                legacyAccount = await objectsService.createAccount({
                    ExternalID: accountExternalID + ' L',
                    Name: accountExternalID + ' L'
                });
                users = await objectsService.getUsers();
                AccountUsers = await objectsService.getAccountUsers();

                createdAccountUsers = await objectsService.postAccountUsers({
                    Account: {Data: {InternalID: account.InternalID}},
                    User: {Data: {InternalID: users[0].InternalID}}
                });

                legacyCreatedAccountUsers = await service.post('account_users', {
                    Account: legacyAccount.UUID,
                    User: users[0].UUID
                });

                createdAccountUsers.Key = createdAccountUsers.UUID;
                const createdAccountUsersKeys = Object.keys(createdAccountUsers);
                const legacyCreatedAccountUsersKeys = Object.keys(legacyCreatedAccountUsers);
                expect(createdAccountUsersKeys).to.deep.equal(legacyCreatedAccountUsersKeys);
                expect(legacyCreatedAccountUsers).to.have.property('Account').that.is.equals(legacyAccount.UUID);
                expect(legacyCreatedAccountUsers).to.have.property('UUID').that.is.a('string').with.lengthOf(36);
                expect(legacyCreatedAccountUsers).to.have.property('ConnectedWithFullAccountAccess').that.is.false;
                expect(legacyCreatedAccountUsers.CreationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedAccountUsers.CreationDateTime).to.include('Z');
                expect(legacyCreatedAccountUsers.ModificationDateTime).to.include(new Date().toISOString().split('T')[0]);
                expect(legacyCreatedAccountUsers.ModificationDateTime).to.include('Z');
                expect(legacyCreatedAccountUsers).to.have.property('InternalID').that.is.a('Number');
                expect(legacyCreatedAccountUsers).to.have.property('User').that.is.equals(users[0].UUID);
                expect(legacyCreatedAccountUsers).to.have.property('Key').that.equals(legacyCreatedAccountUsers.UUID);
                expect(legacyCreatedAccountUsers).to.have.property('Hidden').that.is.false;
            });

            it('Get AccountUsers by key', async () => {
                const getByKeyAccountUsers = await service.getByKey('account_users', legacyCreatedAccountUsers.Key);
                expect(getByKeyAccountUsers).to.deep.equal(legacyCreatedAccountUsers);
                await expect(service.getByKey('account_users', '1234')).eventually.to.be.rejected;
            });

            it('Get AccountUsers by Unique key', async () => {
                const getAccountUsersByInternalID = await service.getByUniqueKey(
                    'account_users',
                    'InternalID',
                    legacyCreatedAccountUsers.InternalID,
                );
                expect(getAccountUsersByInternalID).to.deep.equal(legacyCreatedAccountUsers);
                const getAccountUsersByUUID = await service.getByUniqueKey('account_users', 'UUID', legacyCreatedAccountUsers.UUID);
                expect(getAccountUsersByUUID).to.deep.equal(legacyCreatedAccountUsers);
                const getAccountUsersByKey = await service.getByUniqueKey('account_users', 'Key', legacyCreatedAccountUsers.Key);
                expect(getAccountUsersByKey).to.deep.equal(legacyCreatedAccountUsers);
                await expect(service.getByUniqueKey('account_users', 'InternalID', '123412')).eventually.to.be.rejected;
                await expect(service.getByUniqueKey('account_users', 'Price', '123412')).eventually.to.be.rejected;
            });

            describe('AccountUsers search', () => {
                let legacyAccountUsers;
                it('Where', async () => {
                    const whereAccountUsers = await objectsService.getAccountUsersClause(
                        `where=UUID like '${createdAccountUsers.UUID}'`,
                    );
                    const legacyWhereAccountUsers = await service.search('account_users', {
                        Where: `UUID like '${createdAccountUsers.UUID}'`,
                    });
                    expect(whereAccountUsers.length).to.equal(legacyWhereAccountUsers.Objects.length);
                });

                it('Page and PageSize', async () => {
                    legacyAccountUsers = await objectsService.getAccountUsersClause('where=Hidden=0&page_size=-1');
                    let legacyPageAccountUsers;
                    legacyPageAccountUsers = await service.search('account_users', {
                        Page: 1,
                        PageSize: 1,
                    });
                    expect(legacyPageAccountUsers.Objects.length).to.equal(1);
                    expect(legacyPageAccountUsers.Objects[0].Account).to.equal(legacyAccountUsers[0].Account.Data.UUID);
                    expect(legacyPageAccountUsers.Objects[0].User).to.equal(legacyAccountUsers[0].User.Data.UUID);
                    legacyPageAccountUsers = await service.search('account_users', {
                        Page: 2,
                        PageSize: 1,
                    });
                    expect(legacyPageAccountUsers.Objects.length).to.equal(1);
                    expect(legacyPageAccountUsers.Objects[0].Account).to.equal(legacyAccountUsers[1].Account.Data.UUID);
                    expect(legacyPageAccountUsers.Objects[0].User).to.equal(legacyAccountUsers[1].User.Data.UUID);
                    legacyPageAccountUsers = await service.search('account_users', {
                        PageSize: 5,
                    });
                    expect(legacyPageAccountUsers.Objects.length).to.equal(5);
                });

                it('KeyList', async () => {
                    legacyAccountUsers = await service.get(
                        `account_users?where=UUID IN ('${legacyAccountUsers[0].UUID}','${legacyAccountUsers[1].UUID}','${legacyAccountUsers[2].UUID}','${legacyAccountUsers[3].UUID}')`,
                    );
                    const legacyKeyListAccountUsers = await service.search('account_users', {
                        KeyList: [legacyAccountUsers[0].UUID, legacyAccountUsers[1].UUID, legacyAccountUsers[2].UUID, legacyAccountUsers[3].UUID],
                    });
                    expect(legacyKeyListAccountUsers.Objects.length).to.equal(legacyAccountUsers.length);
                    expect(legacyKeyListAccountUsers.Objects).to.deep.equal(legacyAccountUsers);
                });

                it('UniqueFieldList', async () => {
                    legacyAccountUsers = await service.get(
                        `account_users?where=UUID IN ('${legacyAccountUsers[0].UUID}','${legacyAccountUsers[1].UUID}','${legacyAccountUsers[2].UUID}','${legacyAccountUsers[3].UUID}')`,
                    );
                    const legacyUniqueFieldAccountUsers = await service.search('account_users', {
                        UniqueFieldList: [
                            legacyAccountUsers[0].UUID,
                            legacyAccountUsers[1].UUID,
                            legacyAccountUsers[2].UUID,
                            legacyAccountUsers[3].UUID,
                        ],
                        UniqueFieldID: 'UUID',
                    });
                    expect(legacyUniqueFieldAccountUsers.Objects.length).to.equal(legacyAccountUsers.length);
                    expect(legacyUniqueFieldAccountUsers.Objects).to.deep.equal(legacyAccountUsers);
                });

                it('Fields', async () => {
                    legacyAccountUsers = await service.get(`account_users?where=UUID='${legacyAccountUsers[0].UUID}'`);
                    const legacyFieldsAccountUsers = await service.search(`account_users`, {
                        Where: `UUID='${legacyAccountUsers[0].UUID}'`,
                        Fields: ['UUID', 'Hidden', 'Key'],
                    });
                    expect(legacyFieldsAccountUsers.Objects.length).to.equal(legacyAccountUsers.length);
                    expect(legacyFieldsAccountUsers.Objects).to.deep.equal([
                        { UUID: legacyAccountUsers[0].UUID, Hidden: legacyAccountUsers[0].Hidden, Key: legacyAccountUsers[0].UUID },
                    ]);
                });

                it('Include Count', async () => {
                    const legacyIncludeCountAccountUsers = await service.search('account_users', {
                        IncludeCount: true,
                    });
                    expect(legacyIncludeCountAccountUsers).to.have.property('Count').that.is.a('number');
                });

                describe('DIMX + Delete', () => {
                    it('DIMX export', async () => {
                        const accountsUsersForComparison = await objectsService.getAccountUsersClause('where=Hidden=0&page_size=-1');
                        const exportAudit = await service.dimxExport('account_users');
                        const dimxResult = await service.getDimxResult(exportAudit.URI);
                        dimxResult.forEach(object => {
                            delete object['Key'];
                          });
                          accountsUsersForComparison.sort((a,b) => {return a.InternalID - b.InternalID});
                        dimxResult.sort((a,b) => {return a.InternalID - b.InternalID});
                        expect(accountsUsersForComparison.length).to.equal(dimxResult.length);
                    });

                    it('Delete AccountUsers and account', async () => {
                        const deletedAccountUsers = await objectsService.postAccountUsers({
                            UUID: createdAccountUsers.UUID,
                            Hidden: true,
                        });

                        const legacyDeletedAccountUsers = await service.post('account_users', {
                            UUID: legacyCreatedAccountUsers.UUID,
                            Hidden: true,
                        });
                        expect(deletedAccountUsers).to.have.property('Hidden').that.is.true;
                        expect(legacyDeletedAccountUsers).to.have.property('Hidden').that.is.true;
                        const deletedAccount = await objectsService.createAccount({
                            ExternalID: accountExternalID,
                            Hidden: true,
                        });
                        expect(deletedAccount).to.have.property('Hidden').that.is.true;
                        const deletedAccount1 = await objectsService.createAccount({
                            ExternalID: accountExternalID + ' L',
                            Hidden: true,
                        });
                        expect(deletedAccount1).to.have.property('Hidden').that.is.true;
                    });
                });

            });
        });
    });
}
