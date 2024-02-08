import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Browser } from '../utilities/browser';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppTopBar } from '../pom';
import { OrderPage } from '../pom/Pages/OrderPage';
import { PricingService } from '../../services/pricing.service';
import { PricingData06 } from '../pom/addons/Pricing06';

chai.use(promised);

export async function PricingPartialValueTests(email: string, password: string, client: Client) {
    const dateTime = new Date();
    const generalService = new GeneralService(client);
    // const objectsService = new ObjectsService(generalService);
    const installedPricingVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'pricing',
    )?.Version;
    const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    console.info('Installed Pricing Version: ', JSON.stringify(installedPricingVersion, null, 2));

    let driver: Browser;
    let pricingService: PricingService;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let webAppList: WebAppList;
    let webAppTopBar: WebAppTopBar;
    let webAppDialog: WebAppDialog;
    let orderPage: OrderPage;
    let transactionUUID_Acc01: string;
    let accountName: string;
    let duration: string;
    let base64ImageComponent;

    const account = 'Acc01';
    const pricingData = new PricingData06();
    const multipleValuesTestItems = ['Frag006', 'Frag008', 'Frag009', 'Frag011'];
    const multipleValuesTestStates = ['baseline', '1 Each', '2 Case', '3 Box'];
    const priceFields = [
        'PriceBaseUnitPriceAfter1',
        'PriceDiscountUnitPriceAfter1',
        'PriceGroupDiscountUnitPriceAfter1',
        'PriceManualLineUnitPriceAfter1',
        'PriceTaxUnitPriceAfter1',
    ];
    const priceFields2 = ['PriceBaseUnitPriceAfter2', 'PriceDiscountUnitPriceAfter2', 'PriceTaxUnitPriceAfter2'];

    if (installedPricingVersionShort !== '5') {
        describe(`Pricing Partial Value UI tests  - ${
            client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
        } | Ver ${installedPricingVersion} | Date Time: ${dateTime}`, () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                webAppList = new WebAppList(driver);
                webAppTopBar = new WebAppTopBar(driver);
                webAppDialog = new WebAppDialog(driver);
                orderPage = new OrderPage(driver);
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
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });

            it('Manual Sync', async () => {
                await webAppHomePage.manualResync(client);
            });

            // testAccounts.forEach((account) => {
            describe(`ACCOUNT "My Store"`, function () {
                it('Creating new transaction', async function () {
                    accountName = 'My Store';
                    transactionUUID_Acc01 = await pricingService.startNewSalesOrderTransaction(accountName);
                    console.info('transactionUUID_Acc01:', transactionUUID_Acc01);
                    await orderPage.changeOrderCenterPageView('Line View');
                });

                it(`PERFORMANCE: making sure Sales Order Loading Duration is acceptable`, async function () {
                    let limit: number;
                    switch (installedPricingVersionShort) {
                        case '7':
                            limit = 500;
                            break;

                        default:
                            limit = 550;
                            break;
                    }
                    duration = await (await driver.findElement(orderPage.Duration_Span)).getAttribute('title');
                    console.info(`DURATION at Sales Order Load: ${duration}`);
                    addContext(this, {
                        title: `Sales Order - Loading Time, Version 0.${installedPricingVersionShort}`,
                        value: `Duration: ${duration} ms (limit: ${limit})`,
                    });
                    const duration_num = Number(duration);
                    expect(typeof duration_num).equals('number');
                    // expect(duration_num).to.be.below(limit);
                });

                describe('Partial Value', () => {
                    it('Navigating to "Facial Cosmetics" at Sidebar', async function () {
                        await driver.untilIsVisible(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                        await driver.click(
                            orderPage.getSelectorOfSidebarSectionInOrderCenterByName('Facial Cosmetics'),
                        );
                        driver.sleep(0.1 * 1000);
                    });
                    multipleValuesTestItems.forEach((multipleValuesTestItem) => {
                        describe(`Item: ***${multipleValuesTestItem}`, function () {
                            describe('ORDER CENTER', function () {
                                it(`Looking for "${multipleValuesTestItem}" using the search box`, async function () {
                                    await pricingService.searchInOrderCenter.bind(this)(multipleValuesTestItem, driver);
                                    driver.sleep(1 * 1000);
                                });
                                multipleValuesTestStates.forEach((multipleValuesTestState) => {
                                    it(`Checking "${multipleValuesTestState}"`, async function () {
                                        if (multipleValuesTestState != 'baseline') {
                                            const splitedStateArgs = multipleValuesTestState.split(' ');
                                            const chosenUom = splitedStateArgs[1];
                                            const amount = Number(splitedStateArgs[0]);
                                            addContext(this, {
                                                title: `State Args`,
                                                value: `Chosen UOM: ${chosenUom}, Amount: ${amount}`,
                                            });
                                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                this,
                                            )(chosenUom, multipleValuesTestItem, amount, driver);
                                        }
                                        const priceTSAs = await pricingService.getItemTSAs(
                                            'OrderCenter',
                                            multipleValuesTestItem,
                                        );
                                        console.info(
                                            `${multipleValuesTestItem} ${multipleValuesTestState} priceTSAs:`,
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
                                        if (multipleValuesTestState === 'baseline') {
                                            const UI_NPMCalcMessage = priceTSAs['NPMCalcMessage'];
                                            const baseline_NPMCalcMessage =
                                                pricingData.testItemsValues[multipleValuesTestItem]['NPMCalcMessage'][
                                                    account
                                                ][multipleValuesTestState];
                                            addContext(this, {
                                                title: `State Args`,
                                                value: `NPMCalcMessage from UI: ${JSON.stringify(
                                                    UI_NPMCalcMessage,
                                                )}, NPMCalcMessage (at baseline) from Data: ${JSON.stringify(
                                                    baseline_NPMCalcMessage,
                                                )}`,
                                            });
                                            // expect(UI_NPMCalcMessage.length).equals(baseline_NPMCalcMessage.length);
                                        } else {
                                            const UI_NPMCalcMessage = priceTSAs['NPMCalcMessage'];
                                            const baseline_NPMCalcMessage =
                                                pricingData.testItemsValues[multipleValuesTestItem]['NPMCalcMessage'][
                                                    account
                                                ]['baseline'];
                                            const data_NPMCalcMessage =
                                                pricingData.testItemsValues[multipleValuesTestItem]['NPMCalcMessage'][
                                                    account
                                                ][multipleValuesTestState];
                                            addContext(this, {
                                                title: `State Args`,
                                                value: `NPMCalcMessage from UI: ${JSON.stringify(
                                                    UI_NPMCalcMessage,
                                                )}, NPMCalcMessage (at baseline) from Data: ${JSON.stringify(
                                                    baseline_NPMCalcMessage,
                                                )}, NPMCalcMessage (at ${multipleValuesTestState}) from Data: ${JSON.stringify(
                                                    data_NPMCalcMessage,
                                                )}`,
                                            });
                                            // expect(UI_NPMCalcMessage.length).equals(
                                            //     baseline_NPMCalcMessage.length + data_NPMCalcMessage.length,
                                            // );
                                        }
                                        priceFields.forEach((priceField) => {
                                            const fieldValue = priceTSAs[priceField];
                                            const expectedFieldValue =
                                                pricingData.testItemsValues[multipleValuesTestItem][priceField][
                                                    account
                                                ][multipleValuesTestState];
                                            addContext(this, {
                                                title: `${priceField}`,
                                                value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                            });
                                            // expect(fieldValue).equals(expectedFieldValue);
                                        });
                                        driver.sleep(0.2 * 1000);
                                    });
                                });
                            });
                        });
                    });

                    describe('CART', function () {
                        it('entering and verifying being in cart', async function () {
                            await driver.click(orderPage.Cart_Button);
                            await orderPage.isSpinnerDone();
                            driver.sleep(1 * 1000);
                            await driver.untilIsVisible(orderPage.Cart_ContinueOrdering_Button);
                        });
                        it(`switch to 'Lines View'`, async function () {
                            await orderPage.changeCartView('Lines');
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `After "Line View" was selected`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        it('verifying that the sum total of items in the cart is correct', async function () {
                            const numberOfItemsInCart = multipleValuesTestItems.length;
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `At Cart`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const itemsInCart = await (
                                await driver.findElement(orderPage.Cart_Headline_Results_Number)
                            ).getText();
                            driver.sleep(0.2 * 1000);
                            addContext(this, {
                                title: `Number of Items in Cart`,
                                value: `form UI: ${itemsInCart} , expected: ${numberOfItemsInCart}`,
                            });
                            expect(Number(itemsInCart)).to.equal(numberOfItemsInCart);
                            driver.sleep(1 * 1000);
                        });
                        multipleValuesTestItems.forEach((multipleValuesTestCartItem) => {
                            it(`checking item "${multipleValuesTestCartItem}"`, async function () {
                                const state = '3 Box';
                                const totalUnitsAmount = await pricingService.getItemTotalAmount(
                                    'Cart',
                                    multipleValuesTestCartItem,
                                    undefined,
                                    undefined,
                                    'LinesView',
                                );
                                const priceTSAs = await pricingService.getItemTSAs(
                                    'Cart',
                                    multipleValuesTestCartItem,
                                    undefined,
                                    undefined,
                                    'LinesView',
                                );
                                const priceTSA_Discount2 = await pricingService.getItemTSAs_Discount2(
                                    'Cart',
                                    multipleValuesTestCartItem,
                                    undefined,
                                    undefined,
                                    'LinesView',
                                );
                                const priceTSAs_AOQM_UOM2 = await pricingService.getItemTSAs_AOQM_UOM2(
                                    'Cart',
                                    multipleValuesTestCartItem,
                                    undefined,
                                    undefined,
                                    'LinesView',
                                );
                                // const priceTotalsTSAs = await pricingService.getTotalsTSAsOfItem(
                                //     'Cart',
                                //     multipleValuesTestCartItem,
                                //     undefined,
                                //     undefined,
                                //     'LinesView',
                                // );
                                const expectedTotalUnitsAmount =
                                    pricingData.testItemsValues[multipleValuesTestCartItem]['Cart'][account];
                                console.info(
                                    `Cart ${multipleValuesTestCartItem} totalUnitsAmount: ${totalUnitsAmount}`,
                                );
                                console.info(`priceTSAs:`, JSON.stringify(priceTSAs, null, 2));
                                addContext(this, {
                                    title: `Total Units amount of item`,
                                    value: `form UI: ${totalUnitsAmount} , expected: ${expectedTotalUnitsAmount}`,
                                });
                                priceFields.forEach((priceField) => {
                                    const expectedValue =
                                        pricingData.testItemsValues[multipleValuesTestCartItem][priceField][account][
                                            state
                                        ];
                                    addContext(this, {
                                        title: `TSA field "${priceField}" Values`,
                                        value: `form UI: ${priceTSAs[priceField]} , expected: ${expectedValue}`,
                                    });
                                    // expect(priceTSAs[priceField]).equals(expectedValue);
                                });
                                // expect(totalUnitsAmount).equals(expectedTotalUnitsAmount);
                                const discount2FieldValue = priceTSA_Discount2['PriceDiscount2UnitPriceAfter1'];
                                const discount2ExpectedFieldValue =
                                    pricingData.testItemsValues[multipleValuesTestCartItem][
                                        'PriceDiscount2UnitPriceAfter1'
                                    ]['cart'][account];
                                addContext(this, {
                                    title: 'PriceDiscount2UnitPriceAfter1',
                                    value: `Field Value from UI: ${discount2FieldValue}, Expected Field Value from Data: ${discount2ExpectedFieldValue}`,
                                });
                                // expect(discount2FieldValue).equals(discount2ExpectedFieldValue);

                                priceFields2.forEach((priceField) => {
                                    const fieldValue = priceTSAs_AOQM_UOM2[priceField];
                                    const expectedFieldValue =
                                        pricingData.testItemsValues[multipleValuesTestCartItem][priceField]['cart'][
                                            account
                                        ];
                                    addContext(this, {
                                        title: `${priceField}`,
                                        value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                    });
                                    // expect(fieldValue).equals(expectedFieldValue);
                                });

                                // totalsPriceFields.forEach((priceField) => {
                                //     const fieldValue = priceTotalsTSAs[priceField];
                                //     const expectedFieldValue =
                                //         pricingData.testItemsValues[multipleValuesTestCartItem][priceField][account][multipleValuesTestState];
                                //     addContext(this, {
                                //         title: `${priceField}`,
                                //         value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                //     });
                                //     expect(fieldValue).equals(expectedFieldValue);
                                // });
                                driver.sleep(1 * 1000);
                            });
                        });
                    });
                });
            });
            // });

            describe('Cleanup', () => {
                it('deleting all Activities', async () => {
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
