import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { AddonPage, WebAppHeader, WebAppHomePage, WebAppLoginPage } from '../pom/index';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService, { FetchStatusResponse } from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { ObjectsService } from '../../services/objects.service';
import { Item, TransactionLines } from '@pepperi-addons/papi-sdk';
import { OrderPageItem } from '../pom/OrderPage';
import { Uom } from '../pom/addons/Uom';
import { ObjectTypeEditor } from '../pom/addons/ObjectTypeEditor';
import { BrandedApp } from '../pom/addons/BrandedApp';
import { replaceUIControls, upgradeDependenciesTests } from './test.index';

chai.use(promised);

export async function UomTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    let driver: Browser;

    const _TEST_DATA_ATD_NAME = `UOM_${generalService.generateRandomString(15)}`;
    const _TEST_DATA_ATD_DESCRIPTION = 'ATD for uom automation testing';

    //data validating lists to test the result of webapp flow with
    //1. expected order data of first phase - not using item config
    const expectedOrderNoConfigItems: OrderPageItem[] = [
        new OrderPageItem('1234', '37', '$37.00'),
        new OrderPageItem('1233', '48', '$48.00'),
        new OrderPageItem('1232', '48', '$48.00'),
        new OrderPageItem('1231', '48', '$48.00'),
    ];
    //2. expected order data of second phase - using item config
    const expectedOrderConfigItems: OrderPageItem[] = [
        new OrderPageItem('1233', '-8', '$-8.00'),
        new OrderPageItem('1232', '8', '$8.00'),
        new OrderPageItem('1231', '12', '$12.00'),
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
        new UomOrderExpectedValues('1233', -8, -8, -8, 'DOU'),
        new UomOrderExpectedValues('1232', 8, 8, 4, 'Bx'),
        new UomOrderExpectedValues('1231', 12, 12, 4, 'SIN'),
    ];

    //#region Upgrade cpi-node & UOM
    const testData = {
        'cpi-node': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '0.3.5'], //because '0.3.7' which is the most progresive cannot be installed at the moment
        uom: ['1238582e-9b32-4d21-9567-4e17379f41bb', '1.2.240'],
    };

    await upgradeDependenciesTests(generalService, varPass);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    //#endregion Upgrade cpi-node & UOM

    describe('Basic UI Tests Suit', async function () {
        describe('UOM Tests Suites', () => {
            describe('Prerequisites Addons for UOM Tests', () => {
                //Test Data
                //UOM
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
                                expect(chnageVersionResponseArr[addonName][5]).to.include(
                                    'is already working on version',
                                );
                            } else {
                                expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                            }
                        });
                        it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                            await expect(
                                generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get(),
                            )
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
                                itemList[i].MainCategoryID.toLowerCase().trim() === 'NOT uom item' ||
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
                            await generalService.fetchStatus(
                                `/addons/api/1238582e-9b32-4d21-9567-4e17379f41bb/api/uoms`,
                                {
                                    method: 'POST',
                                    body: JSON.stringify(uomItemsToPost[i]),
                                },
                            ),
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

                beforeEach(async function () {
                    driver = await Browser.initiateChrome();
                });

                afterEach(async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.collectEndTestData(this);
                    await driver.quit();
                });

                it('Setting Up UOM ATD Using UI', async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.login(email, password);
                    //1. validating all items are added to the main catalog
                    const addonPage = new AddonPage(driver);
                    await addonPage.selectCatalogItemsByCategory('uom item', 'NOT uom item');
                    //2. goto ATD editor - create new 'ATD UOM_{random string}'
                    const objectTypeEditor = new ObjectTypeEditor(driver);
                    await objectTypeEditor.createNewATD(
                        this,
                        generalService,
                        _TEST_DATA_ATD_NAME,
                        _TEST_DATA_ATD_DESCRIPTION,
                    );
                    //3. goto new ATD and configure everything needed for the test - 3 calculated fields
                    //3.1.configure Allowed UOMs Field as AllowedUomFieldsForTest, UOM Configuration Field as ItemConfig and uom data field as ConstInventory
                    //3.2. add fields to UI control of ATD
                    const uom = new Uom(driver);
                    await uom.configUomATD();
                    let webAppHomePage = new WebAppHomePage(driver);
                    await webAppHomePage.returnToHomePage();
                    const webAppHeader = new WebAppHeader(driver);
                    await webAppHeader.openSettings();
                    //4. add the ATD to home screen
                    const brandedApp = new BrandedApp(driver);
                    await brandedApp.addAdminHomePageButtons(_TEST_DATA_ATD_NAME);
                    webAppHomePage = new WebAppHomePage(driver);
                    await webAppHomePage.manualResync(client);
                    await webAppHomePage.validateATDIsApearingOnHomeScreen(_TEST_DATA_ATD_NAME);
                });

                describe('UI Test UOM ATD', async function () {
                    it("Replacing UI Controls Of All ATD's Before Stating Test", async function () {
                        await replaceUIControls(this, generalService);
                    });
                    it('UI UOM Test: basic ATD order', async () => {
                        const webAppLoginPage = new WebAppLoginPage(driver);
                        await webAppLoginPage.login(email, password);
                        let webAppHomePage = new WebAppHomePage(driver);
                        await webAppHomePage.manualResync(client);
                        const uom = new Uom(driver);
                        await uom.initiateUOMActivity(_TEST_DATA_ATD_NAME, 'uom');
                        await uom.testUomAtdUI();
                        const addonPage = new AddonPage(driver);
                        await addonPage.testCartItems('$181.00', ...expectedOrderNoConfigItems);
                        await addonPage.submitOrder();
                        webAppHomePage = new WebAppHomePage(driver);
                        await webAppHomePage.manualResync(client);
                        const orderId: string = (
                            await generalService.fetchStatus(
                                `/transactions?where=Type='${_TEST_DATA_ATD_NAME}'&order_by=CreationDateTime DESC`,
                            )
                        ).Body[0].InternalID;
                        const service = new ObjectsService(generalService);
                        const orderResponse: TransactionLines[] = await service.getTransactionLines({
                            where: `TransactionInternalID=${orderId}`,
                        });
                        expect(orderResponse).to.be.an('array').with.lengthOf(4);
                        validateServerResponseOfOrderTransLines(orderResponse, expectedResultNoItemCondfig);
                    });

                    it('UI UOM Test: item configuration field ATD order', async function () {
                        const webAppLoginPage = new WebAppLoginPage(driver);
                        await webAppLoginPage.login(email, password);
                        const uom = new Uom(driver);
                        await uom.editItemConfigFeld(_TEST_DATA_ATD_NAME);
                        let webAppHomePage = new WebAppHomePage(driver);
                        await webAppHomePage.returnToHomePage();
                        await webAppHomePage.manualResync(client);
                        await uom.initiateUOMActivity(_TEST_DATA_ATD_NAME, 'uom');
                        await uom.testUomAtdUIWithItemConfig();
                        const addonPage = new AddonPage(driver);
                        await addonPage.testCartItems('$12.00', ...expectedOrderConfigItems);
                        await addonPage.submitOrder();
                        webAppHomePage = new WebAppHomePage(driver);
                        await webAppHomePage.manualResync(client);
                        const orderId: string = (
                            await generalService.fetchStatus(
                                `/transactions?where=Type='${_TEST_DATA_ATD_NAME}'&order_by=CreationDateTime DESC`,
                            )
                        ).Body[0].InternalID;
                        const service = new ObjectsService(generalService);
                        const orderResponse = await service.getTransactionLines({
                            where: `TransactionInternalID=${orderId}`,
                        });
                        expect(orderResponse).to.be.an('array').with.lengthOf(3);
                        validateServerResponseOfOrderTransLines(orderResponse, expectedResultItemCondfig);
                    });
                });
                describe('Data Cleansing', () => {
                    it('Delete test ATD from dist + home screen using UI', async function () {
                        const webAppLoginPage = new WebAppLoginPage(driver);
                        await webAppLoginPage.login(email, password);
                        const webAppHeader = new WebAppHeader(driver);
                        await webAppHeader.openSettings();
                        const brandedApp = new BrandedApp(driver);
                        await brandedApp.removeAdminHomePageButtons(_TEST_DATA_ATD_NAME);
                        const objectTypeEditor = new ObjectTypeEditor(driver);
                        await objectTypeEditor.removeATD(
                            generalService,
                            _TEST_DATA_ATD_NAME,
                            _TEST_DATA_ATD_DESCRIPTION,
                        );
                    });
                    it('Reset Existing Items', async function () {
                        //Remove all items
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
