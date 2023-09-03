import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage } from '../pom/index';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService, { FetchStatusResponse } from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { ObjectsService } from '../../services/objects.service';
import { Item, TransactionLines } from '@pepperi-addons/papi-sdk';
import { OrderPage, OrderPageItem } from '../pom/Pages/OrderPage';
import { Uom, UomUIObject } from '../pom/addons/Uom';
import { ObjectTypeEditor } from '../pom/addons/ObjectTypeEditor';
import { BrandedApp } from '../pom/addons/BrandedApp';
import { replaceUIControls } from './test.index';
import addContext from 'mochawesome/addContext';
import { AddonLoadCondition } from '../pom/addons/base/AddonPage';

chai.use(promised);

export async function UomTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);

    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let webAppList: WebAppList;
    let brandedApp: BrandedApp;
    let objectTypeEditor: ObjectTypeEditor;
    let uom: Uom;
    let workingUomObject: UomUIObject;
    let orderPage: OrderPage;

    const _TEST_DATA_ATD_NAME = `UOM_${generalService.generateRandomString(15)}`;
    const _TEST_DATA_ATD_DESCRIPTION = 'ATD for uom automation testing';

    //data validating lists to test the result of webapp flow with
    //1. expected order data of first phase - not using item config
    const expectedOrderNoConfigItems: OrderPageItem[] = [
        new OrderPageItem('1234', '37', '$ 37.00'),
        new OrderPageItem('1233', '48', '$ 48.00'),
        new OrderPageItem('1232', '48', '$ 48.00'),
        new OrderPageItem('1231', '48', '$ 48.00'),
    ];
    //2. expected order data of second phase - using item config
    const expectedOrderConfigItems: OrderPageItem[] = [
        new OrderPageItem('1233', '-20', '$ -20.00'),
        new OrderPageItem('1232', '8', '$ 8.00'),
        new OrderPageItem('1231', '48', '$ 48.00'),
    ];

    //3. expected response from server data of non item config order - first phase
    const expectedResultNoItemCondfig: UomOrderExpectedValues[] = [
        new UomOrderExpectedValues('1232', 48, 48, 12, 'DOU', 24, 'SIN'),
        new UomOrderExpectedValues('1233', 48, 48, 5, 'PK', 9, 'DOU'),
        new UomOrderExpectedValues('1234', 37, 37, 1, 'CS', 1, 'Bx'),
        new UomOrderExpectedValues('1231', 48, 48, 2, 'Bx', 22, 'SIN'),
    ];
    //4. expected response from server data of item config order - second phase
    const expectedResultItemCondfig: UomOrderExpectedValues[] = [
        new UomOrderExpectedValues('1233', -20, -20, -8, 'DOU'),
        new UomOrderExpectedValues('1232', 8, 8, 4, 'Bx'),
        new UomOrderExpectedValues('1231', 48, 48, 16, 'SIN'),
    ];

    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade cpi-node & UOM
    const testData = {
        // 'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '16.80.12'], //has to be hardcoded because upgrade dependencies cant handle this
        // 'cpi-node': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '0.3.7'],
        uom: ['1238582e-9b32-4d21-9567-4e17379f41bb', ''], //latest
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''],
        Nebula: ['00000000-0000-0000-0000-000000006a91', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    //#endregion Upgrade cpi-node & UOM

    describe('UOM Tests Suite', async function () {
        describe('Prerequisites Addons for UOM Tests', () => {
            //Test Data
            //UOM
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

        describe('Data Preparation For Test Using Endpoints', () => {
            it('Post items for uom', async function () {
                let numOfGoodItems = 0;
                const itemList: Item[] = await generalService.papiClient.items.find({ page_size: -1 });
                if (itemList.length === 5) {
                    for (let i = 0; i < itemList.length; i++) {
                        if (
                            itemList[i].MainCategoryID.toLowerCase().trim() === 'NOT uom item'.toLowerCase() ||
                            itemList[i].MainCategoryID.toLowerCase().trim() === 'uom item'
                        ) {
                            numOfGoodItems++;
                        }
                    }
                }
                if (numOfGoodItems != 5) {
                    if (numOfGoodItems != 0) {
                        //Remove all items
                        const itemsArr: Item[] = await generalService.papiClient.items.find({ page_size: -1 });
                        for (let i = 0; i < itemsArr.length; i++) {
                            const deleted: boolean = await generalService.papiClient.items.delete(
                                itemsArr[i].InternalID as number,
                            );
                            expect(deleted).to.be.true;
                        }
                    }
                    const itemsToPost: Item[] = createItemsListForUom();
                    const postItemsResponse: Item[] = [];
                    for (let i = 0; i < itemsToPost.length; i++) {
                        postItemsResponse.push(await objectsService.postItem(itemsToPost[i]));
                    }
                    for (let i = 0; i < postItemsResponse.length; i++) {
                        expect(postItemsResponse[i].ExternalID).to.equal(itemsToPost[i].ExternalID);
                        expect(postItemsResponse[i].MainCategoryID).to.equal(itemsToPost[i].MainCategoryID);
                        expect(postItemsResponse[i].Name).to.equal(itemsToPost[i].Name);
                        expect(postItemsResponse[i].Price).to.equal(itemsToPost[i].Price);
                    }
                }
            });
            it('Post items: UOM fields', async function () {
                const uomItemsToPost: UomItem[] = createAllowedUomTypesList();
                const postUomItemsResponse: FetchStatusResponse[] = [];
                for (let i = 0; i < uomItemsToPost.length; i++) {
                    postUomItemsResponse.push(
                        await generalService.fetchStatus(`/addons/api/1238582e-9b32-4d21-9567-4e17379f41bb/api/uoms`, {
                            method: 'POST',
                            body: JSON.stringify(uomItemsToPost[i]),
                        }),
                    );
                }
                for (let i = 0; i < postUomItemsResponse.length; i++) {
                    expect(postUomItemsResponse[i].Status).to.equal(200);
                    expect(postUomItemsResponse[i].Body.Key).to.equal(uomItemsToPost[i].Key);
                    expect(postUomItemsResponse[i].Body.Multiplier).to.equal(uomItemsToPost[i].Multiplier);
                    expect(postUomItemsResponse[i].Body.Title).to.equal(uomItemsToPost[i].Title);
                }
            });
        });

        describe('UOM UI Related', () => {
            this.retries(1);

            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                webAppList = new WebAppList(driver);
                brandedApp = new BrandedApp(driver);
                objectTypeEditor = new ObjectTypeEditor(driver);
                orderPage = new OrderPage(driver);
                uom = new Uom(driver);
            });

            afterEach(async function () {
                await webAppLoginPage.collectEndTestData(this);
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async function () {
                await webAppLoginPage.loginWithImage(email, password);
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Logged in`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Select Catalog', async function () {
                //1. validating all items are added to the main catalog
                await uom.selectCatalogItemsByCategory('uom item', 'NOT uom item');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Catalog selected`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Create ATD (Transaction Type) for UOM', async function () {
                //2. goto ATD editor - create new 'ATD UOM_{random string}'
                await objectTypeEditor.createNewATD(
                    this,
                    generalService,
                    _TEST_DATA_ATD_NAME,
                    _TEST_DATA_ATD_DESCRIPTION,
                );
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `ATD created`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Verifying UOM Transaction Type Content is Loaded', async function () {
                //3. goto new ATD and configure everything needed for the test - 3 calculated fields
                await driver.switchTo(uom.AddonContainerIframe);
                await uom.isAddonFullyLoaded(AddonLoadCondition.Footer);
                expect(await uom.isEditorHiddenTabExist('DataCustomization', 45000)).to.be.true;
                expect(await uom.isEditorTabVisible('GeneralInfo')).to.be.true;
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `UOM Transaction Type Content Loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.switchToDefaultContent();
            });
            it('Switch to UOM Tab and activate if needed', async function () {
                await uom.selectTabByText('Uom');
                //validate uom is loaded both if installed and if not
                let base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Entered UOM Tab`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(await driver.untilIsVisible(uom.UomHeader, 15000)).to.be.true;
                //testing whether already installed - after loading anyway
                if (await (await driver.findElement(uom.UomInstallBtn)).isDisplayed()) {
                    await driver.click(uom.UomInstallBtn);
                    const webAppDialog = new WebAppDialog(driver);
                    // ****text not finalized yet - once will be the test is relevant****
                    // const isPupUP = await (await driver.findElement(webAppDialog.Content)).getText();
                    // expect(isPupUP).to.equal('Are you sure you want to apply the module on the transaction?');
                    await webAppDialog.selectDialogBox('ok');
                    await uom.isSpinnerDone();
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `UOM Activated`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                }
                expect(await driver.untilIsVisible(uom.UomInstalledHeader, 15000)).to.be.true;
            });
            it('Switch to General Tab and add Calculated Field (first phase of test)', async function () {
                //3.1.configure Allowed UOMs Field as AllowedUomFieldsForTest
                await uom.selectTabByText('General');
                const objectTypeEditor = new ObjectTypeEditor(driver);
                await objectTypeEditor.addATDCalculatedField(
                    {
                        Label: 'AllowedUomFieldsForTest',
                        CalculatedRuleEngine: {
                            JSFormula:
                                "return ItemMainCategory==='uom item'?JSON.stringify(['Bx','SIN', 'DOU', 'TR', 'QU','PK','CS']):null;",
                        },
                    },
                    true,
                    'ItemMainCategory',
                );
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `First Phase Calculated Field configured`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Configure at General Tab a second Calculated Field (second phase of test)', async function () {
                //3.1.configure UOM Configuration Field as ItemConfig
                await driver.switchToDefaultContent();
                await uom.selectTabByText('General');
                //**first testing phase will be performed w/o this feature - second will test this only**
                await objectTypeEditor.addATDCalculatedField(
                    {
                        Label: 'ItemConfig',
                        CalculatedRuleEngine: {
                            JSFormula: `return null;`,
                        },
                    },
                    true,
                );
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Second Phase Calculated Field configured`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Adding UOM Values at General Tab', async function () {
                await driver.switchToDefaultContent();
                await uom.selectTabByText('General');
                await objectTypeEditor.addATDCalculatedField(
                    {
                        Label: 'UomValues',
                        CalculatedRuleEngine: {
                            JSFormula: `return JSON.stringify(["Bx","SIN", "DOU", "TR", "QU","PK","CS"]);`,
                        },
                    },
                    true,
                );
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `UOM Values configured`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Setting Inventory Const Value at General Tab', async function () {
                //3.1.configure uom data field as ConstInventory
                await driver.switchToDefaultContent();
                await uom.selectTabByText('General');
                await objectTypeEditor.addATDCalculatedField(
                    {
                        Label: 'ConstInventory',
                        CalculatedRuleEngine: {
                            JSFormula: `return 48;`,
                        },
                    },
                    true,
                    undefined,
                    'Number',
                );
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Inventory Const configured`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Configuring UOM Fields and Medium View (at UOM Tab)', async function () {
                try {
                    await uom.configureUomDataFields(
                        'AllowedUomFieldsForTest',
                        'ItemConfig',
                        'ConstInventory',
                        'Fix Quantity',
                        'Fix Quantity',
                        'Fix Quantity',
                    );
                } catch (error) {
                    console.error(error);
                    console.info('CONFIGURING UOM FIELDS FAILED!');
                    await driver.click(uom.UomHeader);
                    expect(error).to.be.undefined;
                }
            });
            it('Configuring Medium View to ATD (at Views Tab)', async function () {
                const objectTypeEditor = new ObjectTypeEditor(driver);
                try {
                    await objectTypeEditor.enterATDView('Order Center Views', 'Medium Thumbnails View');
                } catch (Error) {
                    //in case medium view isnt added yet
                    await driver.switchToDefaultContent();
                    await uom.selectTabByText('General');
                    await objectTypeEditor.addViewToATD('Order Center Views', 'Medium Thumbnails View');
                    await objectTypeEditor.enterATDView('Order Center Views', 'Medium Thumbnails View');
                }
                driver.sleep(7500);
            });
            it('Entering Rep View Editor & Configuring UI Controls (Deleting all first)', async function () {
                await driver.click(uom.RepViewEditIcon);
                await uom.deleteAllFieldFromUIControl();
                await uom.setFieldsInUIControl(
                    'Item External ID',
                    'Item Price',
                    'AOQM_UOM1',
                    'AOQM_QUANTITY1',
                    'AOQM_UOM2',
                    'AOQM_QUANTITY2',
                    'UomValues',
                    'ConstInventory',
                    'Transaction Total Sum',
                    'ItemConfig',
                    'Item ID',
                    'Unit Quantity',
                );
                driver.sleep(2000);
                let base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `UOM Fields and Medium View configured`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(uom.SaveUIControlBtn);
                driver.sleep(3500);
                await driver.switchToDefaultContent();
                await driver.click(objectTypeEditor.BackArrowButton); // Hagit, Aug 23 - back to list from specific transaction
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Back to Transaction Types List`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Adding ATD to Home Page', async function () {
                await webAppHomePage.returnToHomePage();
                await webAppHeader.openSettings();
                //4. add the ATD to home screen
                await brandedApp.addAdminHomePageButtons(_TEST_DATA_ATD_NAME);
                await webAppHomePage.manualResync(client);
            });
            it('Sync', async function () {
                await webAppHomePage.manualResync(client);
                for (let index = 0; index < 2; index++) {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Accounts');
                    await webAppList.isSpinnerDone();
                    await webAppList.validateListRowElements();
                }
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
            });
            it('Validating ATD Created on Home Page', async function () {
                await webAppHomePage.validateATDIsApearingOnHomeScreen(_TEST_DATA_ATD_NAME);
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `ATD added to Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            describe('UI Test UOM ATD', async function () {
                it('Go Home & Sync', async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.manualResync(client);
                });
                it("Replacing UI Controls Of All ATD's Before Starting Test", async function () {
                    await replaceUIControls(this, generalService);
                });
                describe("NO Config Items ['1230', '1231', '1232', '1233', '1234']", () => {
                    it('Initiating UOM Activity', async function () {
                        await uom.initiateUOMActivity(driver, _TEST_DATA_ATD_NAME, 'uom');
                        const base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `UOM Activity initiated`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                    });
                    describe('Item [1230]', () => {
                        it('Add 40 items of regular qty - see 40 items are shown (then getting up to 48 by plus clicks)', async function () {
                            //1. regular item testing
                            //1.1 add 40 items of regular qty - see 40 items are shown + correct price is presented
                            workingUomObject = new UomUIObject('1230');
                            await driver.click(workingUomObject.aoqmUom1Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom1Qty, '40');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom1Qty set to 40`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('40 items of regular qty - see that correct price is presented', async function () {
                            await uom.testQtysOfItem(workingUomObject, 40, undefined, 40, 20, 20);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Test Quantity of Item`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        for (let i = 1; i < 9; i++) {
                            it(`Plus button (click number ${i})`, async function () {
                                await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                                driver.sleep(1500);
                                await uom.isSpinnerDone();
                                await uom.testQtysOfItem(
                                    workingUomObject,
                                    40 + i,
                                    undefined,
                                    40 + i,
                                    20 + i * 0.5,
                                    20 + i * 0.5,
                                );
                                const base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `UOM1 Plus button - click number ${i}`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                            });
                        }
                        it('Try to add one more regular item - nothing should change (then lowering back to 40 by minus clicks)', async function () {
                            //1.2. try to add one more regular item - nothing should change
                            await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 48, undefined, 48, 48 / 2, 48 / 2);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 Plus button click`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        //1.3. lower qty back to 40 - see price + amount changed everywhere correctly
                        for (let i = 1; i < 9; i++) {
                            it(`Minus button (click number ${i})`, async function () {
                                await driver.click(workingUomObject.aoqmUom1MinusQtyButton);
                                driver.sleep(1500);
                                await uom.isSpinnerDone();
                                await uom.testQtysOfItem(
                                    workingUomObject,
                                    48 - i,
                                    undefined,
                                    48 - i,
                                    (48 - i) * 0.5,
                                    (48 - i) * 0.5,
                                );
                                const base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `UOM1 Minus button - click number ${i}`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                            });
                        }
                        it('Zeroing the amount of the regular item - see everythins changed correctly', async function () {
                            //1.4. zero the amount of the regular item - see everythins changed correctly
                            await driver.click(workingUomObject.aoqmUom1Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom1Qty, '0');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            await uom.testQtysOfItem(workingUomObject, 0, undefined, 0, 0, 0);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom1Qty set to 0`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                    });
                    describe('Item [1231] - fill the order with boxes & singles', () => {
                        //2. UOM item testing
                        it('UOM item testing - UOM1: [Box] & UOM2: [Single]', async function () {
                            //2.1. Box & single
                            workingUomObject = new UomUIObject('1231');
                            //set uom types to double in the upper field and single in lower
                            await uom.selectDropBoxByString(workingUomObject.aoqmUom1, 'Box');
                            driver.sleep(1500);
                            await uom.selectDropBoxByString(workingUomObject.aoqmUom2, 'Single');
                            driver.sleep(1500);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 - Box , UOM2 - Single`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        //2.1.2. fill the order with boxes - the rest in singel items
                        for (let i = 1; i < 4; i++) {
                            it(`Plus button (click number ${i}) [add Box]`, async function () {
                                await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                                driver.sleep(1500);
                                await uom.isSpinnerDone();
                                await uom.testQtysOfItem(workingUomObject, i, undefined, i * 13, i * 13, i * 13);
                                const base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Plus button - click number ${i}`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                            });
                        }
                        it('Nothing changes after plus click on UOM1 [Box] - as qty bigger than inventory', async function () {
                            //2.1.3. nothing changes as qty bigger than inventory
                            await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 3, undefined, 39, 39, 39);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Expected NO Change (After UOM1 [Box] Plus button clicked)`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Filling the rest with Single elements (9)', async function () {
                            //2.1.4. filling the rest with single elements
                            await driver.click(workingUomObject.aoqmUom2Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom2Qty, '9');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            await uom.testQtysOfItem(workingUomObject, 3, 9, 48, 48, 48);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom2Qty set to 9`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Nothing changes after plus click on UOM2 [Single] - as qty bigger than inventory', async function () {
                            //2.1.5. nothing changes as qty bigger than inventory
                            await driver.click(workingUomObject.aoqmUom2PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 3, 9, 48, 48, 48);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Expected NO Change (After UOM2 [Single] Plus button clicked)`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Lowering Box by 1 and adding 13 Singles', async function () {
                            //2.1.6. lowering box by 1 and adding 13 singles
                            await driver.click(workingUomObject.aoqmUom1MinusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 2, 9, 35, 35, 35);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 Minus button click`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(workingUomObject.aoqmUom2Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom2Qty, '22');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            await uom.testQtysOfItem(workingUomObject, 2, 22, 48, 48, 48);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom2Qty set to 22`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Nothing changes after plus click on UOM2 [Single] - as qty bigger than inventory', async function () {
                            //2.1.7. nothing changes as qty bigger than inventory
                            await driver.click(workingUomObject.aoqmUom2PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 2, 22, 48, 48, 48);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Expected NO Change (After UOM2 [Single] Plus button clicked)`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                    });
                    describe('Item [1232] - fill the order with Double & Singles', () => {
                        //2.2. Double & Single
                        it('UOM item testing - UOM1: [Double] & UOM2: [Single]', async function () {
                            workingUomObject = new UomUIObject('1232');
                            //set uom types to double in the upper field and single in lower
                            await uom.selectDropBoxByString(workingUomObject.aoqmUom1, 'double');
                            driver.sleep(1500);
                            await uom.selectDropBoxByString(workingUomObject.aoqmUom2, 'Single');
                            driver.sleep(1500);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 - Double , UOM2 - Single`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Fill the qty with Doubles (24)', async function () {
                            //2.2.1 fill the qty with double values
                            await driver.click(workingUomObject.aoqmUom1Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom1Qty, '24');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            await uom.testQtysOfItem(workingUomObject, 24, 0, 48, 48 + 24 * 2, 48 + 24 * 2);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom1Qty [Double] set to 24`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Nothing changes after plus click on UOM1 - as qty bigger than inventory', async function () {
                            //2.2.2 nothing changes as qty bigger than inventory
                            await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 24, 0, 48, 48 + 24 * 2, 48 + 24 * 2);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Expected NO Change (After UOM1 Plus button clicked)`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Lowering the double qty by half (to 12)', async function () {
                            //2.2.3 lowering the double qty by half
                            await driver.click(workingUomObject.aoqmUom1Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom1Qty, '12');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            await uom.testQtysOfItem(workingUomObject, 12, 0, 48 - 12 * 2, 96 - 12 * 2, 96 - 12 * 2);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom1Qty set to 12`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Filling the rest with single', async function () {
                            //2.2.4 filling the rest with single
                            await driver.click(workingUomObject.aoqmUom2Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom2Qty, '24');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            await uom.testQtysOfItem(workingUomObject, 12, 24, 48, 72 + 24, 72 + 24);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom2Qty set to 24`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Clicking Plus on UOM1 - Nothing changes as qty bigger than inventory', async function () {
                            //2.2.5 nothing changes as qty bigger than inventory
                            await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 12, 24, 48, 72 + 24, 72 + 24);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Expected NO Change (After UOM1 Plus button clicked)`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Clicking Plus on UOM2 - Nothing changes as qty bigger than inventory', async function () {
                            //2.2.6 nothing changes as qty bigger than inventory
                            await driver.click(workingUomObject.aoqmUom2PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 12, 24, 48, 72 + 24, 72 + 24);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Expected NO Change (After UOM2 Plus button clicked)`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                    });
                    describe('Item [1233]', () => {
                        //2.3. Pack & Double
                        it('UOM item testing - Pack & Double', async function () {
                            workingUomObject = new UomUIObject('1233');
                            //set uom types to double in the upper field and single in lower
                            await uom.selectDropBoxByString(workingUomObject.aoqmUom1, 'Pack');
                            driver.sleep(1500);
                            await uom.selectDropBoxByString(workingUomObject.aoqmUom2, 'double');
                            driver.sleep(1500);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 - Pack , UOM2 - Double`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Filling the amount by sending keys with bigger qty then inventory permits - expecting to get 8 packs', async function () {
                            //2.3.1 filling the amount by sending keys with bigger qty then inventory permits - expecting to get 8 packs
                            await driver.click(workingUomObject.aoqmUom1Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom1Qty, '20');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            await uom.testQtysOfItem(workingUomObject, 8, 0, 48, 144, 144);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom1Qty set to 20`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        //2.3.2 lowering pack amount by 3
                        for (let i = 1; i < 4; i++) {
                            it(`Minus button clicks - lowering pack amount by 3 in total (click number ${i})`, async function () {
                                await driver.click(workingUomObject.aoqmUom1MinusQtyButton);
                                driver.sleep(1500);
                                await uom.isSpinnerDone();
                                await uom.testQtysOfItem(
                                    workingUomObject,
                                    8 - i,
                                    0,
                                    48 - i * 6,
                                    144 - i * 6,
                                    144 - i * 6,
                                );
                                const base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `UOM1 Minus button - click number ${i}`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                            });
                        }
                        it("Filling the amount by sending keys with bigger qty than inventory permits - expecting to get 9 double's", async function () {
                            //2.3.3 filling the amount by sending keys with bigger qty then inventory permits - expecting to get 9 double's
                            await driver.click(workingUomObject.aoqmUom2Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom2Qty, '20');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom2Qty set to 20`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Validating all values', async function () {
                            //2.3.4 validating all values
                            await uom.testQtysOfItem(workingUomObject, 5, 9, 48, 144, 144);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `All`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                    });
                    describe('Item [1234]', () => {
                        //2.4. Case & Box
                        it('UOM item testing - Case & Box', async function () {
                            workingUomObject = new UomUIObject('1234');
                            //set uom types to case in the upper field and box in lower
                            await uom.selectDropBoxByString(workingUomObject.aoqmUom1, 'Case');
                            driver.sleep(1500);
                            await uom.selectDropBoxByString(workingUomObject.aoqmUom2, 'Box');
                            driver.sleep(1500);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 - Case , UOM2 - Box`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Raise the case qty by 1 and check all values', async function () {
                            //2.4.1 raise the case qty by 1 and check all values
                            await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                            await driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 1, 0, 24, 168, 168);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 Plus button clicked`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Filling the amount by sending keys with bigger qty then inventory permits - expecting to get 1 box', async function () {
                            //2.4.2 filling the amount by sending keys with bigger qty then inventory permits - expecting to get 1 box
                            await driver.click(workingUomObject.aoqmUom2Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom2Qty, '20');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom2Qty set to 20`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        //2.4.3 valdating all values
                        it('Valdating all values', async function () {
                            await uom.testQtysOfItem(workingUomObject, 1, 1, 37, 181, 181);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `All`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                    });
                    describe('Conclusion', () => {
                        //3. UOM order test ended - submiting to cart
                        it('Entering Cart', async function () {
                            await driver.click(orderPage.SubmitToCart);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Cart`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Validating Being in Cart', async function () {
                            await webAppList.isSpinnerDone();
                            try {
                                await orderPage.changeOrderCenterPageView('GridLine');
                            } catch (Error) {
                                await orderPage.clickViewMenu(); //to close the menu first
                                await orderPage.changeOrderCenterPageView('Grid');
                            }
                            await webAppList.validateListRowElements();
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Cart`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        expectedOrderNoConfigItems.forEach(async (expectedOrderNoConfigItem) => {
                            // Hagit Aug 23
                            it(`UI UOM Test: basic ATD order (testing: ${
                                expectedOrderNoConfigItem.qty.value.split('title=')[1].split(']')[0]
                            })`, async function () {
                                await uom.testCartItem('$ 181.00', expectedOrderNoConfigItem);
                                const itemName = expectedOrderNoConfigItem.qty.value.split('title=')[1].split(']')[0];
                                const base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Testing Item: ${itemName}`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                            });
                        });
                        it('Submit Order, Sync & Verify Via API', async () => {
                            await uom.submitOrder();
                            await webAppHomePage.manualResync(client);
                            const orderId: string = (
                                await generalService.fetchStatus(
                                    `/transactions?where=Type='${_TEST_DATA_ATD_NAME}'&order_by=CreationDateTime DESC`,
                                )
                            ).Body[0].InternalID;
                            const orderResponse: TransactionLines[] = await objectsService.getTransactionLines({
                                where: `TransactionInternalID=${orderId}`,
                            });
                            expect(orderResponse).to.be.an('array').with.lengthOf(4);
                            validateServerResponseOfOrderTransLines(orderResponse, expectedResultNoItemCondfig);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Order Submitted`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                    });
                });
                describe("Config Items ['1231','1232','1233']", () => {
                    it('Go Home & Edit Item Config', async function () {
                        await driver.switchToDefaultContent();
                        await webAppHeader.goHome();
                        await uom.editItemConfigField(_TEST_DATA_ATD_NAME);
                        const base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Item Configuration Edited`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                    });
                    it('Return to Home & Sync', async function () {
                        await webAppHomePage.returnToHomePage();
                        await webAppHomePage.manualResync(client);
                        const base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Home`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                    });
                    it('Initiating UOM Activity', async function () {
                        await uom.initiateUOMActivity(driver, _TEST_DATA_ATD_NAME, 'uom');
                        const base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `UOM Activity Initiated`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                    });
                    describe('Item [1231]', () => {
                        it('Testing UOM ATD with Item Config - Changing UOM1 to Single', async function () {
                            //1. single -> factor:3, minimum:2, case:1, decimal:0, negative:true
                            //set uom type to single
                            workingUomObject = new UomUIObject('1231');
                            await uom.selectDropBoxByString(workingUomObject.aoqmUom1, 'Single');
                            driver.sleep(1500);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 - Single`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Trying to add one single item - by clicking the Plus button', async function () {
                            //1.1. try to add one single item
                            await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 2, 0, 6, 6, 6);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 Plus button clicked`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Click on plus again - this time qty is bigger than minimum', async function () {
                            //1.2 click on plus again - this time qty is bigger than minimum
                            await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 3, 0, 9, 9, 9);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Uom1 Plus button clicked`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it("Zeroing the amount of Single (and then set qty by minus clicks to '-8')", async function () {
                            //1.3 zero the amount and set qty of single items to '-8'
                            await driver.click(workingUomObject.aoqmUom1Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom1Qty, '0');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            await uom.testQtysOfItem(workingUomObject, 0, 0, 0, 0, 0);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom1Qty set to 0`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        for (let i = 1; i < 9; i++) {
                            it(`Minus button clicks (click number ${i})`, async function () {
                                await driver.click(workingUomObject.aoqmUom1MinusQtyButton);
                                driver.sleep(1500);
                                await uom.isSpinnerDone();
                                await uom.testQtysOfItem(workingUomObject, -1 * i, 0, -3 * i, i * -3, i * -3);
                                const base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Minus button - click number ${i}`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                            });
                        }
                        it("Set qty of single items as '3.5'", async function () {
                            //1.4 set qty of single items as '3.5'
                            await driver.click(workingUomObject.aoqmUom1Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom1Qty, '3.5');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            await uom.testQtysOfItem(workingUomObject, 16, 0, 48, 48, 48);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom1Qty set to 3.5`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                    });
                    describe('Item [1232]', () => {
                        it('Box -> factor:2, min:1, case:2, negative:false, decimal: 3', async function () {
                            //2. Box -> factor:2, min:1, case:2, negative:false, decimal: 3
                            workingUomObject = new UomUIObject('1232');
                            //set uom type to Box
                            await uom.selectDropBoxByString(workingUomObject.aoqmUom1, 'Box');
                            driver.sleep(1500);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 - Box`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Try to add one box item', async function () {
                            //2.1. try to add one box item
                            await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 2, 0, 4, 52, 52);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 Plus button clicked`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Click on plus again - to see how many qtys of box are added', async function () {
                            //2.2 click on plus again - to see how many qtys of box are added
                            await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 4, 0, 8, 56, 56);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 Plus button clicked`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Zeroing the amount of Box (and then try to set it to negative couple of times - shouldnt work)', async function () {
                            //2.3 zero the qty and try to set it to negative couple of times - shouldnt work
                            await driver.click(workingUomObject.aoqmUom1Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom1Qty, '0');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            await uom.testQtysOfItem(workingUomObject, 0, 0, 0, 48, 48);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom1Qty set to 0`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        for (let i = 1; i < 4; i++) {
                            it(`Minus button clicks (click number ${i})`, async function () {
                                await driver.click(workingUomObject.aoqmUom1MinusQtyButton);
                                await driver.sleep(1500);
                                await uom.isSpinnerDone();
                                await uom.testQtysOfItem(workingUomObject, 0, 0, 0, 48, 48);
                                const base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Minus button - click number ${i}`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                            });
                        }
                        it("Set qty of single items to '3.5'", async function () {
                            //2.4 set qty of single items to '3.5'
                            await driver.click(workingUomObject.aoqmUom1Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom1Qty, '3.5');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            await uom.testQtysOfItem(workingUomObject, 4, 0, 8, 56, 56);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom1Qty set to 3.5`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                    });
                    describe('Item [1233]', () => {
                        it('Double -> factor:2.5, min:10, case:5, negative:true, decimal:1', async function () {
                            //3. Double -> factor:2.5, min:10, case:5, negative:true, decimal:1
                            workingUomObject = new UomUIObject('1233');
                            //set uom type to double
                            await uom.selectDropBoxByString(workingUomObject.aoqmUom1, 'double');
                            driver.sleep(1500);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 - Double`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Trying to add one double item (Expecting to get amout of 8)', async function () {
                            //3.1. try to add one double item
                            await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 8, 0, 20, 76, 76);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 Plus button clicked`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(workingUomObject.aoqmUom1PlusQtyButton);
                            driver.sleep(1500);
                            await uom.isSpinnerDone();
                            await uom.testQtysOfItem(workingUomObject, 12, 0, 30, 86, 86);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 Plus button clicked`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it("Zeroing the amount of Double (and then by minus clicks - set it to '-8')", async function () {
                            //3.3 zero qty of double and set it to '-8'
                            await driver.click(workingUomObject.aoqmUom1Qty);
                            await driver.sendKeys(workingUomObject.aoqmUom1Qty, '0');
                            driver.sleep(1000);
                            await driver.click(orderPage.blankSpaceOnScreenToClick);
                            await uom.isSpinnerDone();
                            driver.sleep(2500);
                            await uom.testQtysOfItem(workingUomObject, 0, 0, 0, 56, 56);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `aoqmUom1Qty set to 0`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        // for (let i = 1; i < 9; i++) { // commented out dut to https://pepperi.atlassian.net/browse/DI-24705 DO NOT DELETE!
                        //     it(`Minus button clicks - to reach Zero (click number ${i})`, async function () {
                        //         await driver.click(workingUomObject.aoqmUom1MinusQtyButton);
                        //         driver.sleep(1500);
                        //         await uom.isSpinnerDone();
                        //         await uom.testQtysOfItem(
                        //             workingUomObject,
                        //             -i,
                        //             0,
                        //             -(i * 2.5),
                        //             56 + i * -2.5,
                        //             56 + i * -2.5,
                        //         );
                        //         const base64ImageComponent = await driver.saveScreenshots();
                        //         addContext(this, {
                        //             title: `Minus button - click number ${i}`,
                        //             value: 'data:image/png;base64,' + base64ImageComponent,
                        //         });
                        //     });
                        // }
                        it(`DI-24705 - set qty to '-8' for the reset of the test to work`, async function () {
                            for (let i = 1; i < 9; i++) {
                                await driver.click(workingUomObject.aoqmUom1MinusQtyButton);
                                driver.sleep(1500);
                                await uom.isSpinnerDone();
                            }
                            await uom.testQtysOfItem(workingUomObject, -8, 0, -(8 * 2.5), 56 + 8 * -2.5, 56 + 8 * -2.5);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM1 qty set to '-8'`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });

                        //set lower uom type to Box
                        it('Set lower uom type to Box', async function () {
                            await uom.selectDropBoxByString(workingUomObject.aoqmUom2, 'Box');
                            driver.sleep(1500);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `UOM2 - Box`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        //3.4. add three more boxes - untill there are 0 items
                        for (let i = 1; i < 3; i++) {
                            it(`Plus button clicks - add three more boxes untill there are 0 items (click number ${i})`, async function () {
                                await driver.click(workingUomObject.aoqmUom2PlusQtyButton);
                                await driver.sleep(1500);
                                await uom.isSpinnerDone();
                                await uom.testQtysOfItem(
                                    workingUomObject,
                                    -8,
                                    i * 2,
                                    -20 + i * 4,
                                    36 + i * 4,
                                    36 + i * 4,
                                );
                                const base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `UOM2 Plus button - click number ${i}`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                            });
                        }
                        //3.5. click minus untill there are no more boxes
                        for (let i = 1; i < 3; i++) {
                            it(`Minus button clicks - untill there are no more boxes (click number ${i})`, async function () {
                                await driver.click(workingUomObject.aoqmUom2MinusQtyButton);
                                driver.sleep(1500);
                                await uom.isSpinnerDone();
                                await uom.testQtysOfItem(
                                    workingUomObject,
                                    -8,
                                    4 - i * 2,
                                    -12 - i * 4,
                                    44 - i * 4,
                                    44 - i * 4,
                                );
                                const base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `UOM2 Minus button - click number ${i}`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                            });
                        }
                    });
                    describe('Conclusion', () => {
                        //4. UOM order test ended - submiting to cart
                        it('Entering Cart', async function () {
                            await driver.click(orderPage.SubmitToCart);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Cart`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('Validating Being in Cart', async function () {
                            // await uom.gotoCart(orderPage);
                            await webAppList.isSpinnerDone();
                            try {
                                await orderPage.changeOrderCenterPageView('GridLine');
                            } catch (Error) {
                                await orderPage.clickViewMenu(); //to close the menu first
                                await orderPage.changeOrderCenterPageView('Grid');
                            }
                            await webAppList.validateListRowElements();
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Cart`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        expectedOrderConfigItems.forEach(async (expectedOrderConfigItem) => {
                            // Hagit Aug 23
                            it(`UI UOM Test: item configuration field ATD order (testing: ${
                                expectedOrderConfigItem.qty.value.split('title=')[1].split(']')[0]
                            })`, async function () {
                                await uom.testCartItem('$ 36.00', expectedOrderConfigItem);
                                const itemName = expectedOrderConfigItem.qty.value.split('title=')[1].split(']')[0];
                                const base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Testing Item: ${itemName}`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                            });
                        });
                        it('Submit Order, Sync & Verify Via API', async () => {
                            await uom.submitOrder();
                            await webAppHomePage.manualResync(client);
                            const orderId: string = (
                                await generalService.fetchStatus(
                                    `/transactions?where=Type='${_TEST_DATA_ATD_NAME}'&order_by=CreationDateTime DESC`,
                                )
                            ).Body[0].InternalID;
                            const orderResponse = await objectsService.getTransactionLines({
                                where: `TransactionInternalID=${orderId}`,
                            });
                            expect(orderResponse).to.be.an('array').with.lengthOf(3);
                            validateServerResponseOfOrderTransLines(orderResponse, expectedResultItemCondfig);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Order Submitted`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                    });
                });
            });
            describe('Data Cleansing', () => {
                it('Delete All UOM Transactions via API', async function () {
                    let uomTransactions = await generalService.papiClient.transactions.find({
                        where: `Type LIKE '%UOM_%'`,
                        page_size: -1,
                    });
                    console.info('Number of UOM Transactions found: ', uomTransactions.length);
                    const deleted = await Promise.all(
                        uomTransactions.map(async (transaction) => {
                            return await generalService.papiClient.transactions.delete(transaction.InternalID || 0);
                        }),
                    );
                    console.info('Deleted UOM Transactions Response Array: ', JSON.stringify(deleted, null, 2));
                    uomTransactions = await generalService.papiClient.transactions.find({
                        where: `Type LIKE '%UOM_%'`,
                        page_size: -1,
                    });
                    expect(uomTransactions.length).to.equal(0);
                });
                it('Delete test ATD from dist + home screen using UI', async function () {
                    await webAppHeader.goHome();
                    await webAppHeader.openSettings();
                    await brandedApp.removeAdminHomePageButtons(_TEST_DATA_ATD_NAME);
                    await objectTypeEditor.removeATD(generalService, _TEST_DATA_ATD_NAME, _TEST_DATA_ATD_DESCRIPTION);
                });
                it('Reset Existing Items', async function () {
                    // Remove all items
                    const itemsArr: Item[] = await generalService.papiClient.items.find({ page_size: -1 });
                    for (let i = 0; i < itemsArr.length; i++) {
                        const deleted: boolean = await generalService.papiClient.items.delete(
                            itemsArr[i].InternalID as number,
                        );
                        expect(deleted).to.be.true;
                    }
                });
            });
        });
    });
}

class UomOrderExpectedValues {
    public id: string;
    public itemTotalPrice: number;
    public itemTotalQty: number;
    public aoqm1Qty: number | undefined;
    public aoqm1Type: string | undefined;
    public aoqm2Qty: number | undefined;
    public aoqm2Type: string | undefined;

    constructor(
        id: string,
        itemTotalPrice: number,
        itemTotalQty: number,
        aoqm1Qty?: number,
        aoqm1Type?: string,
        aoqm2Qty?: number,
        aoqm2Type?: string,
    ) {
        this.id = id;
        this.itemTotalPrice = itemTotalPrice;
        this.itemTotalQty = itemTotalQty;
        if (aoqm1Qty) this.aoqm1Qty = aoqm1Qty;
        if (aoqm1Type) this.aoqm1Type = aoqm1Type;
        if (aoqm2Qty) this.aoqm2Qty = aoqm2Qty;
        if (aoqm2Type) this.aoqm2Type = aoqm2Type;
    }
}
function validateServerResponseOfOrderTransLines(
    orderResponse: TransactionLines[],
    expectedValues: UomOrderExpectedValues[],
): void {
    expect(orderResponse.length).to.be.equal(expectedValues.length);
    orderResponse.sort(compareServerResponseTransLinesByItemsID);
    expectedValues.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
    for (let i = 0; i < orderResponse.length; i++) {
        expect(orderResponse[i].TotalUnitsPriceAfterDiscount).to.equal(expectedValues[i].itemTotalPrice);
        expect(orderResponse[i].UnitsQuantity).to.equal(expectedValues[i].itemTotalQty);
        if (expectedValues[i].aoqm1Qty) expect(orderResponse[i].TSAAOQMQuantity1).to.equal(expectedValues[i].aoqm1Qty);
        if (expectedValues[i].aoqm1Type) expect(orderResponse[i].TSAAOQMUOM1).to.equal(expectedValues[i].aoqm1Type);
        if (expectedValues[i].aoqm2Qty) expect(orderResponse[i].TSAAOQMQuantity2).to.equal(expectedValues[i].aoqm2Qty);
        if (expectedValues[i].aoqm2Type) expect(orderResponse[i].TSAAOQMUOM2).to.equal(expectedValues[i].aoqm2Type);
    }
}

function compareServerResponseTransLinesByItemsID(transLine1: TransactionLines, transLine2: TransactionLines): number {
    if (
        transLine1.Item &&
        transLine1.Item.Data &&
        transLine1.Item.Data.ExternalID &&
        transLine2.Item &&
        transLine2.Item.Data &&
        transLine2.Item.Data.ExternalID
    ) {
        if (transLine1.Item.Data.ExternalID > transLine2.Item.Data.ExternalID) {
            return 1;
        } else if (transLine1.Item.Data.ExternalID < transLine2.Item.Data.ExternalID) {
            return -1;
        }
    }
    return 1; //dummy return for ts
}

function createItemsListForUom(): Item[] {
    const itemList: Item[] = [];
    for (let i = 0; i < 5; i++) {
        const item: Item = {
            ExternalID: `123${i}`,
            MainCategoryID: i === 0 ? 'NOT uom item' : 'uom item',
            Name: `${i === 0 ? 'non uom item' : 'uom item'}`,
            Price: i === 0 ? 0.5 : 1,
        };
        itemList.push(item);
    }
    return itemList;
}

function createAllowedUomTypesList(): UomItem[] {
    const itemList: UomItem[] = [];
    for (let i = 0; i < 5; i++) {
        itemList.push(resolveUomItem(i));
    }
    return itemList;
}

function resolveUomItem(i: number): UomItem {
    switch (i) {
        case 0:
            return {
                Key: 'SIN',
                Title: 'Single',
                Multiplier: '1',
            };
        case 1:
            return {
                Key: 'CS',
                Title: 'Case',
                Multiplier: '24',
            };
        case 2:
            return {
                Key: 'DOU',
                Title: 'double',
                Multiplier: '2',
            };
        case 3:
            return {
                Key: 'Bx',
                Title: 'Box',
                Multiplier: '13',
            };
        case 4:
            return {
                Key: 'PK',
                Title: 'Pack',
                Multiplier: '6',
            };
        default:
            return {
                //dummy return for ts
                Key: 'PK',
                Title: 'Pack',
                Multiplier: '6',
            };
    }
}

interface UomItem {
    Key: string;
    Title: string;
    Multiplier: string;
}
