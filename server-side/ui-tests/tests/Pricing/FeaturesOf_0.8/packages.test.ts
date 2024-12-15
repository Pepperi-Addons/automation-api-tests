import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import {
    describe,
    it,
    before,
    after,
    // afterEach
} from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import { Browser } from '../../../utilities/browser';
import {
    WebAppAPI,
    WebAppDialog,
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppLoginPage,
    WebAppTopBar,
} from '../../../pom';
// import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import { OrderPage } from '../../../pom/Pages/OrderPage';
// import { ObjectsService } from '../../../../services';
import { PricingService } from '../../../../services/pricing.service';
import { PricingData08 } from '../../../pom/addons/PricingData08';
// import PricingRules from '../../../pom/addons/PricingRules';
import GeneralService from '../../../../services/general.service';
import addContext from 'mochawesome/addContext';
import E2EUtils from '../../../utilities/e2e_utils';

chai.use(promised);

export async function PricingPackagesTests(email: string, password: string, client: Client) {
    /*
________________________ 
_________________ Brief:
          
* Pricing Promotion Packages test 
    TODO

* DI-27332 :
    1. Package transaction - test for pricing in package

    2. Sales order - test for group pricing calculation using packages lines
_________________ 
_________________ The Relevant Blocks:
            
. 'Base' -> ['ZBASE']
. 'Discount' -> ['ZDS1', 'ZDS2', 'ZDS3']
. 'GroupDiscount' -> ['ZGD1', 'ZGD2']
. 'ManualLine' -> []
. 'Tax' -> ['MTAX']

_________________ 
_________________ The Relevant Conditions:
            
. 'ZBASE' -> ['A002', 'A001', 'A003', 'A005', 'A004']
. 'ZDS1' -> ['A001', 'A002', 'A003']
. 'ZDS2' -> ['A002']
. 'ZDS3' -> ['A001']
. 'ZDS4' -> ['A001']
. 'ZDS5' -> ['A001']
. 'ZDS6' -> ['A003', 'A004', 'A001']
. 'ZDS7' -> ['A002', 'A004', 'A005']
. 'ZGD1' -> ['A002', 'A003']
. 'ZGD2' -> ['A004', 'A003', 'A002']
. 'MTAX' -> ['A002', 'A004']

_________________ 
_________________ The Relevant Tables:
    
. 'A001' -> ['ItemExternalID']
. 'A002' -> ['TransactionAccountExternalID', 'ItemExternalID']
. 'A003' -> ['TransactionAccountExternalID', 'ItemMainCategory']
. 'A004' -> ['TransactionAccountExternalID']
. 'A005' -> ['ItemMainCategory']
. 'A006' -> ['TransactionAccountTSAPricingContracts']
. 'A007' -> ['TransactionAccountTSAPricingContracts', 'ItemMainCategory']
. 'A008' -> ['TransactionAccountTSAPricingContracts', 'ItemExternalID']
. 'A009' -> ['TransactionAccountExternalID', 'TransactionAccountTSAPricingContracts']
. 'A010' -> ['TransactionAccountExternalID', 'TransactionAccountTSAPricingContracts', 'ItemExternalID']
. 'A011' -> ['TransactionAccountTSAPricingHierarchy', 'ItemExternalID']
_________________ 
_________________ The Relevant Rules:
          
. 'ZBASE@A005@dummyItem': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",100,"P"]]]]',
 
_________________ 
_________________ Order Of Actions:
          
1. Looping over accounts
 
_________________ 
_________________ 
*/
    const dateTime = new Date();
    const generalService = new GeneralService(client);
    // const objectsService = new ObjectsService(generalService);
    const baseUrl = `https://${client.BaseURL.includes('staging') ? 'app.sandbox.pepperi.com' : 'app.pepperi.com'}`;
    const pricingData = new PricingData08();
    // const pricingRules = new PricingRules();

    const installedPricingVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Pricing',
    )?.Version;

    console.info('Installed Pricing Version: ', JSON.stringify(installedPricingVersion, null, 2));

    let driver: Browser;
    let pricingService: PricingService;
    let webAppAPI: WebAppAPI;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let webAppList: WebAppList;
    let webAppTopBar: WebAppTopBar;
    let webAppDialog: WebAppDialog;
    let orderPage: OrderPage;
    let e2eUtils: E2EUtils;
    let transactionUUID: string;
    let accountName: string;
    let duration: string;
    let screenShot;

    const testAccounts = ['Acc01', 'OtherAcc'];
    const mainPackagesTestItems = ['PPI_1722164109733'];
    const packagesTestItems = {
        Drug0001: {
            states: ['baseline', '1 Each', '1 Case'],
            cartState: '1 Case',
        },
        Drug0003: {
            states: ['baseline', '1 Case', '1 Box'],
            cartState: '1 Box',
        },
        Drug0002: {
            states: ['baseline', '5 Case', '10 Case'],
            cartState: '10 Case',
        },
        Drug0004: {
            states: ['baseline', '1 Case', '3 Case'],
            cartState: '3 Case',
        },
        Drug0005: {
            states: ['baseline', '1 Case', '1 Each'],
            cartState: '1 Each',
        },
        Drug0009: {
            states: ['baseline', '1 Fraction'],
            cartState: '1 Fraction',
        },
    };
    // const packagesTestStates = ['baseline', '1 Each', '1 Case'];
    // const packagesTestCartState = '1 Case';
    const priceFields = [
        'PriceBaseUnitPriceAfter1',
        'PriceDiscountUnitPriceAfter1',
        'PriceGroupDiscountUnitPriceAfter1',
        'PriceManualLineUnitPriceAfter1',
        'PriceTaxUnitPriceAfter1',
    ];

    if (
        !client.BaseURL.includes('staging') // Packages are NOT installed on sandbox !
    ) {
        describe(`Pricing ** Packages ** UI tests  - ${
            client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
        } | Ver ${installedPricingVersion} | Date Time: ${dateTime}`, function () {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppAPI = new WebAppAPI(driver, client);
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                webAppList = new WebAppList(driver);
                webAppTopBar = new WebAppTopBar(driver);
                webAppDialog = new WebAppDialog(driver);
                orderPage = new OrderPage(driver);
                e2eUtils = new E2EUtils(driver);
                pricingService = new PricingService(
                    driver,
                    webAppLoginPage,
                    webAppHomePage,
                    webAppHeader,
                    webAppList,
                    webAppTopBar,
                    webAppDialog,
                    orderPage,
                );
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async function () {
                await webAppLoginPage.login(email, password);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Manual Resync', async function () {
                await e2eUtils.performManualResync.bind(this)(client, driver);
            });

            it('If Error popup appear - close it', async function () {
                await driver.refresh();
                const accessToken = await webAppAPI.getAccessToken();
                let errorDialogAppear = true;
                do {
                    await webAppAPI.pollForResyncResponse(accessToken, 100);
                    try {
                        errorDialogAppear = await webAppHomePage.isErrorDialogOnHomePage(this);
                    } catch (error) {
                        console.error(error);
                    } finally {
                        await driver.navigate(`${baseUrl}/HomePage`);
                    }
                    await webAppAPI.pollForResyncResponse(accessToken);
                } while (errorDialogAppear);
            });

            testAccounts.forEach((account) => {
                describe(`ACCOUNT "${
                    account == 'Acc01'
                        ? 'My Store'
                        : account == 'Acc02'
                        ? 'Store 2'
                        : account == 'Acc03'
                        ? 'Store 3'
                        : 'Account for order scenarios'
                }"`, function () {
                    it('Creating new transaction', async function () {
                        screenShot = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Before Transaction created`,
                            value: 'data:image/png;base64,' + screenShot,
                        });
                        await webAppHomePage.isDialogOnHomePAge(this);
                        account == 'Acc01'
                            ? (accountName = 'My Store')
                            : account == 'Acc02'
                            ? (accountName = 'Store 2')
                            : account == 'Acc03'
                            ? (accountName = 'Store 3')
                            : (accountName = 'Account for order scenarios');
                        transactionUUID = await pricingService.startNewSalesOrderTransaction(accountName);
                        console.info('transactionUUID:', transactionUUID);
                    });

                    it(`PERFORMANCE: making sure Sales Order Loading Duration is acceptable`, async function () {
                        let limit: number;
                        switch (true) {
                            default:
                                limit = 600;
                                break;
                        }
                        duration = await (await driver.findElement(orderPage.Duration_Span)).getAttribute('title');
                        console.info(`DURATION at Sales Order Load: ${duration}`);
                        addContext(this, {
                            title: `Sales Order - Loading Time, Version ${installedPricingVersion}`,
                            value: `Duration: ${duration} ms (limit: ${limit})`,
                        });
                        const duration_num = Number(duration);
                        expect(typeof duration_num).equals('number');
                        expect(duration_num).to.be.below(limit);
                    });

                    describe(`Pharmacy Packages`, function () {
                        it('Navigating to "Pharmacy" at Sidebar', async function () {
                            await driver.untilIsVisible(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                            await driver.click(orderPage.getSelectorOfSidebarSectionInOrderCenterByName('Pharmacy'));
                            driver.sleep(0.1 * 1000);
                        });

                        mainPackagesTestItems.forEach((mainPackagesTestItem) => {
                            it(`switching to 'Lines View'`, async function () {
                                await orderPage.changeOrderCenterPageView('Line View');
                                screenShot = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `After "Lines View" was selected`,
                                    value: 'data:image/png;base64,' + screenShot,
                                });
                            });
                            it(`Looking for "${mainPackagesTestItem}" using the search box`, async function () {
                                await pricingService.searchInOrderCenter.bind(this)(mainPackagesTestItem, driver);
                                driver.sleep(1 * 1000);
                            });
                            it(`Clicking ${mainPackagesTestItem}'s "Order" button`, async function () {
                                await pricingService.pickPackageItem.bind(this)(mainPackagesTestItem, driver);
                                driver.sleep(1 * 1000);
                            });
                            it(`Validating Package transaction is loaded`, async function () {
                                await driver.untilIsVisible(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                                await driver.untilIsVisible(orderPage.ChangeViewButton);
                                await driver.untilIsVisible(orderPage.TransactionUUID);
                                await driver.untilIsVisible(orderPage.TransactionTypeName);
                                const transactionTypeName_element = await driver.findElement(
                                    orderPage.TransactionTypeName,
                                );
                                const transactionTypeName_text = await transactionTypeName_element.getAttribute(
                                    'title',
                                );
                                driver.sleep(1 * 1000);
                                screenShot = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `After "${mainPackagesTestItem}" Order Button was clicked`,
                                    value: 'data:image/png;base64,' + screenShot,
                                });
                                expect(transactionTypeName_text).equals('PPI_PackagePromotion (336841)');
                            });
                            it(`switching to 'Lines' View`, async function () {
                                await orderPage.changeOrderCenterPageView('Lines');
                                screenShot = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `After "Lines" View was selected`,
                                    value: 'data:image/png;base64,' + screenShot,
                                });
                            });
                            it(`Looking for "${mainPackagesTestItem}" using the search box`, async function () {
                                await pricingService.searchInOrderCenter.bind(this)(mainPackagesTestItem, driver);
                                driver.sleep(1 * 1000);
                            });
                            it(`Checking "${mainPackagesTestItem}" at baseline state`, async function () {
                                const priceTSAs = await pricingService.getItemTSAs('OrderCenter', mainPackagesTestItem);
                                console.info(`${mainPackagesTestItem} baseline priceTSAs:`, priceTSAs);
                                expect(typeof priceTSAs).equals('object');
                                expect(Object.keys(priceTSAs)).to.eql([
                                    'PriceBaseUnitPriceAfter1',
                                    'PriceDiscountUnitPriceAfter1',
                                    'PriceGroupDiscountUnitPriceAfter1',
                                    'PriceManualLineUnitPriceAfter1',
                                    'PriceTaxUnitPriceAfter1',
                                    'NPMCalcMessage',
                                ]);
                                const UI_NPMCalcMessage = priceTSAs['NPMCalcMessage'];
                                const data_NPMCalcMessage =
                                    pricingData.testItemsValues.Packages[mainPackagesTestItem]['NPMCalcMessage'][
                                        account
                                    ]['baseline'];
                                addContext(this, {
                                    title: `State Args`,
                                    value: `NPMCalcMessage from UI: ${JSON.stringify(
                                        UI_NPMCalcMessage,
                                        null,
                                        2,
                                    )}, \nNPMCalcMessage (at baseline) from Data: ${JSON.stringify(
                                        data_NPMCalcMessage,
                                        null,
                                        2,
                                    )}`,
                                });
                                expect(UI_NPMCalcMessage.length).equals(data_NPMCalcMessage.length);
                                expect(UI_NPMCalcMessage).to.deep.equal(data_NPMCalcMessage);

                                priceFields.forEach((priceField) => {
                                    const fieldValue = priceTSAs[priceField];
                                    const expectedFieldValue =
                                        pricingData.testItemsValues.Packages[mainPackagesTestItem][priceField][account][
                                            'baseline'
                                        ];
                                    addContext(this, {
                                        title: `${priceField}`,
                                        value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                    });
                                    expect(fieldValue).equals(expectedFieldValue);
                                });
                                driver.sleep(0.2 * 1000);
                            });

                            Object.keys(packagesTestItems).forEach((packagesTestItem) => {
                                describe(`Item: ***${packagesTestItem}`, function () {
                                    describe('ORDER CENTER', function () {
                                        it(`Looking for "${packagesTestItem}" using the search box`, async function () {
                                            await pricingService.searchInOrderCenter.bind(this)(
                                                packagesTestItem,
                                                driver,
                                            );
                                            driver.sleep(1 * 1000);
                                        });
                                        it(`switching to 'Lines' View`, async function () {
                                            await orderPage.changeOrderCenterPageView('Lines');
                                            driver.sleep(1 * 1000);
                                            screenShot = await driver.saveScreenshots();
                                            addContext(this, {
                                                title: `After "Lines" View was selected`,
                                                value: 'data:image/png;base64,' + screenShot,
                                            });
                                        });

                                        packagesTestItems[packagesTestItem].states.forEach((packagesTestState) => {
                                            it(`Checking "${packagesTestState}"`, async function () {
                                                if (packagesTestState != 'baseline') {
                                                    const splitedStateArgs = packagesTestState.split(' ');
                                                    const chosenUOM = splitedStateArgs[1];
                                                    const amount = Number(splitedStateArgs[0]);
                                                    addContext(this, {
                                                        title: `State Args`,
                                                        value: `Chosen UOM: ${chosenUOM}, Amount: ${amount}`,
                                                    });
                                                    await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                        this,
                                                    )(chosenUOM, packagesTestItem, amount, driver);
                                                }
                                                const priceTSAs = await pricingService.getItemTSAs(
                                                    'OrderCenter',
                                                    packagesTestItem,
                                                );
                                                console.info(
                                                    `${packagesTestItem} ${packagesTestState} priceTSAs:`,
                                                    priceTSAs,
                                                );
                                                expect(typeof priceTSAs).equals('object');
                                                expect(Object.keys(priceTSAs)).to.eql([
                                                    'PriceBaseUnitPriceAfter1',
                                                    'PriceDiscountUnitPriceAfter1',
                                                    'PriceGroupDiscountUnitPriceAfter1',
                                                    'PriceManualLineUnitPriceAfter1',
                                                    'PriceTaxUnitPriceAfter1',
                                                    'NPMCalcMessage',
                                                ]);
                                                const UI_NPMCalcMessage = priceTSAs['NPMCalcMessage'];
                                                const data_NPMCalcMessage =
                                                    pricingData.testItemsValues.Packages[packagesTestItem][
                                                        'NPMCalcMessage'
                                                    ][account][packagesTestState];
                                                addContext(this, {
                                                    title: `State Args`,
                                                    value: `NPMCalcMessage from UI: ${JSON.stringify(
                                                        UI_NPMCalcMessage,
                                                        null,
                                                        2,
                                                    )}, \nNPMCalcMessage (at ${packagesTestState}) from Data: ${JSON.stringify(
                                                        data_NPMCalcMessage,
                                                        null,
                                                        2,
                                                    )}`,
                                                });
                                                expect(UI_NPMCalcMessage.length).equals(data_NPMCalcMessage.length);
                                                expect(UI_NPMCalcMessage).to.deep.equal(data_NPMCalcMessage);

                                                priceFields.forEach((priceField) => {
                                                    const fieldValue = priceTSAs[priceField];
                                                    const expectedFieldValue =
                                                        pricingData.testItemsValues.Packages[packagesTestItem][
                                                            priceField
                                                        ][account][packagesTestState];
                                                    addContext(this, {
                                                        title: `${priceField}`,
                                                        value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                                    });
                                                    expect(fieldValue).equals(expectedFieldValue);
                                                });
                                                driver.sleep(0.2 * 1000);
                                            });
                                        });
                                    });
                                });
                            });
                            describe('Concluding package items pick', function () {
                                it('clicking "Done" button', async function () {
                                    driver.sleep(1 * 1000);
                                    await driver.click(orderPage.Package_Done_Button);
                                    await orderPage.isSpinnerDone();
                                    driver.sleep(1 * 1000);
                                    screenShot = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `After "Done" button clicked`,
                                        value: 'data:image/png;base64,' + screenShot,
                                    });
                                    try {
                                        await driver.untilIsVisible(orderPage.Cart_Button);
                                    } catch (error) {
                                        console.error(error);
                                        try {
                                            await driver.untilIsVisible(orderPage.Cart_ContinueOrdering_Button);
                                        } catch (error) {
                                            console.error(error);
                                            throw new Error('Problem in Order Center validation');
                                        }
                                    }
                                });
                            });
                        });

                        describe(`CART`, function () {
                            it('entering and verifying being in cart', async function () {
                                await driver.click(orderPage.Cart_Button);
                                await orderPage.isSpinnerDone();
                                driver.sleep(1 * 1000);
                                try {
                                    await driver.untilIsVisible(orderPage.Cart_List_container);
                                } catch (error) {
                                    console.error(error);
                                    try {
                                        await driver.untilIsVisible(orderPage.Cart_ContinueOrdering_Button);
                                    } catch (error) {
                                        console.error(error);
                                        throw new Error('Problem in Cart validation');
                                    }
                                }
                            });

                            it('verify that the sum total of items in the cart is correct', async function () {
                                screenShot = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `At Cart`,
                                    value: 'data:image/png;base64,' + screenShot,
                                });
                                const itemsInCart = await (
                                    await driver.findElement(orderPage.Cart_Headline_Results_Number)
                                ).getText();
                                driver.sleep(0.2 * 1000);
                                expect(Number(itemsInCart)).to.equal(
                                    mainPackagesTestItems.length + Object.keys(packagesTestItems).length,
                                );
                                driver.sleep(1 * 1000);
                            });

                            it(`switch to 'Lines View'`, async function () {
                                await orderPage.changeCartView('Lines');
                                screenShot = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `After "Lines" View was selected`,
                                    value: 'data:image/png;base64,' + screenShot,
                                });
                            });

                            it(`open side-bar menu to see smart filters`, async function () {
                                await orderPage.openSmartFilterMenu();
                                screenShot = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `After Side Bar that displays Smart Filters was opened`,
                                    value: 'data:image/png;base64,' + screenShot,
                                });
                            });

                            Object.keys(packagesTestItems).forEach(async (item) => {
                                describe(`Checking "${item}"`, function () {
                                    it(`filtering cart using smart filter Item External ID`, async function () {
                                        await driver.click(orderPage.Cart_SmartFilter_ItemExternalID);
                                        driver.sleep(0.3 * 1000);
                                        await driver.click(
                                            orderPage.getSelectorOfCheckboxOfSmartFilterItemExternalIdAtCartByText(
                                                item,
                                            ),
                                        );
                                        driver.sleep(0.3 * 1000);
                                        await driver.untilIsVisible(orderPage.Cart_SmartFilter_ApplyButton);
                                        await driver.click(orderPage.Cart_SmartFilter_ApplyButton);
                                        await orderPage.isSpinnerDone();
                                        driver.sleep(2 * 1000);
                                        const itemsInCart = await (
                                            await driver.findElement(orderPage.Cart_Headline_Results_Number)
                                        ).getText();
                                        driver.sleep(0.2 * 1000);
                                        screenShot = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `After Smart Filter Activated`,
                                            value: 'data:image/png;base64,' + screenShot,
                                        });
                                        addContext(this, {
                                            title: `After Smart Filter - Number of Items in Cart`,
                                            value: `form UI: ${itemsInCart} , expected: 1`,
                                        });
                                        expect(Number(itemsInCart)).to.equal(1);
                                    });

                                    it(`Checking TSAs`, async function () {
                                        const totalUnitsAmount = await pricingService.getItemTotalAmount(
                                            'Cart',
                                            item,
                                            undefined,
                                            undefined,
                                            'LinesView',
                                        );
                                        const priceTSAs = await pricingService.getItemTSAs(
                                            'Cart',
                                            item,
                                            undefined,
                                            undefined,
                                            'LinesView',
                                        );
                                        console.info(`Cart ${item} totalUnitsAmount:`, totalUnitsAmount);
                                        console.info(`priceTSAs:`, JSON.stringify(priceTSAs, null, 2));
                                        const priceTSA_Discount2 = await pricingService.getItemTSAs_Discount2(
                                            'Cart',
                                            item,
                                            undefined,
                                            undefined,
                                            'LinesView',
                                        );
                                        console.info(
                                            `CART ${item} '${packagesTestItems[item].cartState}' priceTSA_Discount2:`,
                                            JSON.stringify(priceTSA_Discount2, null, 2),
                                        );
                                        const expectedAmount = 1;
                                        addContext(this, {
                                            title: `Total Units Amount`,
                                            value: `From UI: ${totalUnitsAmount}, expected: ${expectedAmount}`,
                                        });
                                        priceFields.forEach((priceField) => {
                                            const expectedValue =
                                                pricingData.testItemsValues.Packages[item][priceField][account].cart[
                                                    packagesTestItems[item].cartState
                                                ];
                                            expect(priceTSAs[priceField]).equals(expectedValue);
                                        });
                                    });

                                    it(`clearing smart filter`, async function () {
                                        await driver.click(orderPage.Cart_SmartFilter_ClearButton);
                                        await orderPage.isSpinnerDone();
                                        driver.sleep(0.8 * 1000);
                                        await driver.click(orderPage.Cart_SmartFilter_ItemExternalID);
                                        driver.sleep(0.5 * 1000);
                                        const itemsInCart = await (
                                            await driver.findElement(orderPage.Cart_Headline_Results_Number)
                                        ).getText();
                                        driver.sleep(0.2 * 1000);
                                        screenShot = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `After Smart Filter Cleared`,
                                            value: 'data:image/png;base64,' + screenShot,
                                        });
                                        addContext(this, {
                                            title: `After Smart Filter Cleared - Number of Items in Cart`,
                                            value: `form UI: ${itemsInCart} , expected: ${
                                                mainPackagesTestItems.length + Object.keys(packagesTestItems).length
                                            }`,
                                        });
                                        expect(Number(itemsInCart)).to.equal(
                                            mainPackagesTestItems.length + Object.keys(packagesTestItems).length,
                                        );
                                    });
                                });
                            });
                        });
                    });
                });
            });

            describe('Cleanup', function () {
                it('deleting all Activities', async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Activities');
                    await webAppHomePage.isSpinnerDone();
                    driver.sleep(0.1 * 1000);
                    try {
                        await webAppList.checkAllListElements();
                        driver.sleep(0.1 * 1000);
                        await webAppList.clickOnListActionsButton();
                        driver.sleep(0.1 * 1000);
                        await webAppList.selectUnderPencilMenu('Delete');
                        driver.sleep(0.1 * 1000);
                        await driver.untilIsVisible(webAppDialog.ButtonArr);
                        driver.sleep(0.1 * 1000);
                        await webAppDialog.selectDialogBoxByText('Delete');
                        await webAppDialog.isSpinnerDone();
                        driver.sleep(0.1 * 1000);
                        await webAppHeader.goHome();
                        await webAppHomePage.isSpinnerDone();
                    } catch (error) {
                        console.error(error);
                        if (await driver.untilIsVisible(webAppList.NoActivitiesFound_Text)) {
                            console.info('List is EMPTY - no activities found');
                        }
                    }
                });
            });
        });
    }
}
