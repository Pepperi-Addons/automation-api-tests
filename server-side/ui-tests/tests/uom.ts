import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { AddonPage, WebAppHeader, WebAppHomePage, WebAppLoginPage } from '../pom/index';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { ObjectsService } from '../../services/objects.service';
import { Item, TransactionLines } from '@pepperi-addons/papi-sdk';

chai.use(promised);

export async function UomTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    let driver: Browser;

    const _TEST_DATA_ATD_NAME = "UOM_ jzwdgqfuajxyyax";//`UOM_${generalService.generateRandomString(15)}`;//"UOM_ jzwdgqfuajxyyax"; 
    const _TEST_DATA_ATD_DESCRIPTION = 'ATD for uom automation testing';

    //#region Upgrade cpi-node & UOM
    const testData = {
        'cpi-node': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        uom: ['1238582e-9b32-4d21-9567-4e17379f41bb', ''],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    //#endregion Upgrade cpi-node & UOM

    describe('Basic UI Tests Suit', async function () {
        describe('UOM Tests Suites', () => {
            describe('Prerequisites Addon for UOM Tests', () => {
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

            describe('Data Preparation Using Endpoints', () => {
                it('Post items for uom', async function () {
                    let numOfGoodItems = 0;
                    const itemList: Item[] = await objectsService.getItems();
                    if (itemList.length === 5) {
                        for (let i = 0; i < itemList.length; i++) {
                            if (itemList[i].MainCategoryID === "NOT uom item" || itemList[i].MainCategoryID === "uom item") {
                                numOfGoodItems++;
                            }
                        }
                    }
                    if (numOfGoodItems != 5) {
                        if (numOfGoodItems != 0) {
                            //Remove all items
                            const itemsArr = await generalService.papiClient.items.find({ page_size: -1 });
                            for (let i = 0; i < itemsArr.length; i++) {
                                const deleted = await generalService.papiClient.items.delete(
                                    itemsArr[i].InternalID as number,
                                );
                                expect(deleted).to.be.true;
                            }
                        }
                        const itemsToPost = createItemsList();
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
                    const uomItemsToPost: UomItem[] = createUomItemsList();
                    const postUomItemsResponse: any[] = [];
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

                describe('UI Tests', () => {
                    this.retries(1);

                    beforeEach(async function () {
                        driver = await Browser.initiateChrome();
                    });

                    afterEach(async function () {
                        const webAppLoginPage = new WebAppLoginPage(driver);
                        await webAppLoginPage.collectEndTestData(this);
                        await driver.quit();
                    });

                    it('Set Up UOM ATD', async function () {
                        // const webAppLoginPage = new WebAppLoginPage(driver);
                        // await webAppLoginPage.loginNoCompanyLogo(email, password);
                        // //1. validating all items are added to the main catalog
                        // const addonPage = new AddonPage(driver);
                        // await addonPage.selectCatalogItemsByCategory('uom item', 'NOT uom item');
                        // //2. goto ATD editor - create new ATD UOM_{random-hashstring}
                        // await addonPage.createNewATD(
                        //     this,
                        //     generalService,
                        //     _TEST_DATA_ATD_NAME,
                        //     _TEST_DATA_ATD_DESCRIPTION,
                        // );
                        // //3. goto new ATD and configure everything needed for the test - 3 calculated fields
                        // //3.1.configure Allowed UOMs Field as AllowedUomFieldsForTest, UOM Configuration Field as ItemConfig and uom data field as ConstInventory
                        // //3.2. add fields to UI control of ATD
                        // await addonPage.configUomATD();
                        // let webAppHomePage = new WebAppHomePage(driver);
                        // await webAppHomePage.returnToHomePage();
                        // const webAppHeader = new WebAppHeader(driver);
                        // await webAppHeader.openSettings();
                        // //4. add the ATD to home screen
                        // await addonPage.addAdminHomePageButtons(_TEST_DATA_ATD_NAME);
                        // webAppHomePage = new WebAppHomePage(driver);
                        // await webAppHomePage.manualResync();
                        // await webAppHomePage.validateATDIsApearingOnHomeScreen(_TEST_DATA_ATD_NAME);
                    });

                    it('UI Test UOM ATD', async function () {
                        // const webAppLoginPage = new WebAppLoginPage(driver);
                        // await webAppLoginPage.loginNoCompanyLogo(email, password);
                        // const webAppHomePage = new WebAppHomePage(driver);
                        // await webAppHomePage.manualResync();
                        // await webAppHomePage.initiateUOMActivity(_TEST_DATA_ATD_NAME, 'uom');
                        // const addonPage = new AddonPage(driver);
                        // await addonPage.testUomAtdUI();
                        // const orderId: string = await addonPage.testUOMCartUI();
                        // await addonPage.submitOrder();
                        // const service = new ObjectsService(generalService);
                        // const orderResponse = await service.getTransactionLines({
                        //     where: `TransactionInternalID=${orderId}`,
                        // });
                        // expect(orderResponse).to.be.an('array').with.lengthOf(4);
                        // validateResponseOfOrderPerformed(orderResponse);
                    });

                    it('UI Test UOM ATD -- testing item configuration field', async function () {
                        const webAppLoginPage = new WebAppLoginPage(driver);
                        await webAppLoginPage.loginNoCompanyLogo(email, password);
                        let addonPage = new AddonPage(driver);
                        // await addonPage.EditItemConfigFeld(_TEST_DATA_ATD_NAME);
                        const webAppHomePage = new WebAppHomePage(driver);
                        // await webAppHomePage.returnToHomePage();
                        // await webAppHomePage.manualResync();
                        await webAppHomePage.initiateUOMActivity(_TEST_DATA_ATD_NAME, 'uom');
                        addonPage = new AddonPage(driver);
                        await addonPage.testUomAtdUIWithItemConfig();
                        const orderId: string = await addonPage.testUOMCartUI();//work here - TODO
                        debugger;
                        // await addonPage.submitOrder();
                        // const service = new ObjectsService(generalService);
                        // const orderResponse = await service.getTransactionLines({
                        //     where: `TransactionInternalID=${orderId}`,
                        // });
                        // expect(orderResponse).to.be.an('array').with.lengthOf(4);
                        // validateResponseOfOrderPerformed(orderResponse);
                    });

                    it('Delete test ATD from dist + home screen using UI', async function () {
                        // const webAppLoginPage = new WebAppLoginPage(driver);
                        // await webAppLoginPage.loginNoCompanyLogo(email, password);
                        // debugger;
                        // const webAppHeader = new WebAppHeader(driver);
                        // await webAppHeader.openSettings();
                        // const addonPage = new AddonPage(driver);
                        // await addonPage.removeAdminHomePageButtons(_TEST_DATA_ATD_NAME);
                        // await addonPage.removeATD(generalService, _TEST_DATA_ATD_NAME, _TEST_DATA_ATD_DESCRIPTION);
                    });
                });
                describe('Test Data Cleansing using API', () => {
                    it('Reset Existing Items', async function () {
                        // //Remove all items
                        // const itemsArr = await generalService.papiClient.items.find({ page_size: -1 });
                        // for (let i = 0; i < itemsArr.length; i++) {
                        //     const deleted = await generalService.papiClient.items.delete(
                        //         itemsArr[i].InternalID as number,
                        //     );
                        //     expect(deleted).to.be.true;
                        // }
                    });
                });
            });
        });
    });
}

function validateResponseOfOrderPerformed(orderResponse: TransactionLines[]) {
    orderResponse.forEach((element: TransactionLines) => {
        switch (element.Item?.Data?.ExternalID) {
            case '1232':
                expect(element.TotalUnitsPriceAfterDiscount).to.equal(48);
                expect(element.UnitsQuantity).to.equal(48);
                expect(element.TSAAOQMQuantity1).to.equal(12);
                expect(element.TSAAOQMUOM1).to.equal('DOU');
                expect(element.TSAAOQMQuantity2).to.equal(24);
                expect(element.TSAAOQMUOM2).to.equal('SIN');
                break;
            case '1233':
                expect(element.TotalUnitsPriceAfterDiscount).to.equal(48);
                expect(element.UnitsQuantity).to.equal(48);
                expect(element.TSAAOQMQuantity1).to.equal(5);
                expect(element.TSAAOQMUOM1).to.equal('PK');
                expect(element.TSAAOQMQuantity2).to.equal(9);
                expect(element.TSAAOQMUOM2).to.equal('DOU');
                break;
            case '1234':
                expect(element.TotalUnitsPriceAfterDiscount).to.equal(37);
                expect(element.UnitsQuantity).to.equal(37);
                expect(element.TSAAOQMQuantity1).to.equal(1);
                expect(element.TSAAOQMUOM1).to.equal('CS');
                expect(element.TSAAOQMQuantity2).to.equal(1);
                expect(element.TSAAOQMUOM2).to.equal('Bx');
                break;
            case '1231':
                expect(element.TotalUnitsPriceAfterDiscount).to.equal(48);
                expect(element.UnitsQuantity).to.equal(48);
                expect(element.TSAAOQMQuantity1).to.equal(2);
                expect(element.TSAAOQMUOM1).to.equal('Bx');
                expect(element.TSAAOQMQuantity2).to.equal(22);
                expect(element.TSAAOQMUOM2).to.equal('SIN');
                break;
        }
    });
}

function createItemsList() {
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

function createUomItemsList() {
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


