import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Browser } from '../utilities/browser';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppTopBar } from '../pom';
import { ObjectsService } from '../../services';
import { OrderPage } from '../pom/Pages/OrderPage';
import { PricingService } from '../../services/pricing.service';
import { PricingData06 } from '../pom/addons/Pricing06';
import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';

chai.use(promised);

export async function PricingMultipleValuesTests(email: string, password: string, client: Client) {
    const dateTime = new Date();
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
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
    let transactionUUID_OtherAcc: string;
    let accountName: string;
    let duration: string;
    let base64ImageComponent;
    let ppmValues: UserDefinedTableRow[];

    const pricingData = new PricingData06();
    const testAccounts = ['Acc01', 'OtherAcc'];
    // const multipleValuesTestItems_outOfCategory = ['Shampoo Three'];
    const multipleValuesTestItems = [
        // 'Shampoo Three',
        'MaFa25',
        'MaLi37',
        'MaLi38',
    ];
    const multipleValuesTestStates_each = [
        'baseline',
        '1 Each',
        '2 Each',
        '1 Each',
        '3 Each',
        '2 Each',
        '5 Each',
        '9 Each',
        '5 Each',
        '10 Each',
        '11 Each',
        '10 Each',
    ];
    const multipleValuesTestStates_case = [
        '1 Case',
        '2 Case',
        '1 Case',
        '4 Case',
        '2 Case',
        '5 Case',
        '4 Case',
        '9 Case',
        '5 Case',
        '10 Case',
        '11 Case',
        '10 Case',
    ];
    const multipleValuesTestStates_box = [
        '1 Box',
        '2 Box',
        '1 Box',
        '3 Box',
        '5 Box',
        '3 Box',
        '6 Box',
        '5 Box',
        '7 Box',
        '6 Box',
    ];
    // const priceFields = [
    //     'PriceBaseUnitPriceAfter1',
    //     'PriceDiscountUnitPriceAfter1',
    //     'PriceGroupDiscountUnitPriceAfter1',
    //     'PriceManualLineUnitPriceAfter1',
    //     'PriceTaxUnitPriceAfter1',
    // ];
    // const priceFields2 = ['PriceBaseUnitPriceAfter2', 'PriceDiscountUnitPriceAfter2', 'PriceTaxUnitPriceAfter2'];
    const priceMultiFields = ['PriceMultiAfter1', 'PriceMultiAfter2'];

    if (installedPricingVersionShort !== '5') {
        describe(`Pricing Multiple Values UI tests  - ${
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

            it('get UDT Values (PPM_Values)', async () => {
                ppmValues = await objectsService.getUDT({ where: "MapDataExternalID='PPM_Values'", page_size: -1 });
                console.info('PPM_Values Length: ', JSON.stringify(ppmValues.length, null, 2));
            });

            it('validating "PPM_Values" via API', async () => {
                const expectedPPMValuesLength =
                    Object.keys(pricingData.documentsIn_PPM_Values).length + pricingData.dummyPPM_Values_length;
                console.info(
                    'EXPECTED: Object.keys(pricingData.documentsIn_PPM_Values).length + dummyPPM_ValuesKeys.length: ',
                    expectedPPMValuesLength,
                    'ACTUAL: ppmValues.length: ',
                    ppmValues.length,
                );
                addContext(this, {
                    title: `PPM Values Length`,
                    value: `EXPECTED: ${expectedPPMValuesLength} ACTUAL: ${ppmValues.length}`,
                });
                expect(ppmValues.length).equals(expectedPPMValuesLength);
                Object.keys(pricingData.documentsIn_PPM_Values).forEach((mainKey) => {
                    console.info('mainKey: ', mainKey);
                    const matchingRowOfppmValues = ppmValues.find((tableRow) => {
                        if (tableRow.MainKey === mainKey) {
                            return tableRow;
                        }
                    });
                    matchingRowOfppmValues &&
                        console.info('EXPECTED: matchingRowOfppmValues: ', matchingRowOfppmValues['Values'][0]);
                    console.info(
                        'ACTUAL: pricingData.documentsIn_PPM_Values[mainKey]: ',
                        pricingData.documentsIn_PPM_Values[mainKey],
                    );
                    matchingRowOfppmValues &&
                        addContext(this, {
                            title: `PPM Value for the Key "${mainKey}"`,
                            value: `EXPECTED: ${matchingRowOfppmValues['Values'][0]} ACTUAL: ${pricingData.documentsIn_PPM_Values[mainKey]}`,
                        });
                    matchingRowOfppmValues &&
                        expect(pricingData.documentsIn_PPM_Values[mainKey]).equals(
                            client.BaseURL.includes('staging')
                                ? matchingRowOfppmValues['Values'].join()
                                : matchingRowOfppmValues['Values'][0],
                        );
                });
            });

            testAccounts.forEach((account) => {
                describe(`ACCOUNT "${account == 'Acc01' ? 'My Store' : 'Account for order scenarios'}"`, function () {
                    it('Creating new transaction', async function () {
                        switch (account) {
                            case 'Acc01':
                                accountName = 'My Store';
                                transactionUUID_Acc01 = await pricingService.startNewSalesOrderTransaction(accountName);
                                console.info('transactionUUID_Acc01:', transactionUUID_Acc01);
                                break;

                            default:
                                accountName = 'Account for order scenarios';
                                transactionUUID_OtherAcc = await pricingService.startNewSalesOrderTransaction(
                                    accountName,
                                );
                                console.info('transactionUUID_OtherAcc:', transactionUUID_OtherAcc);
                                break;
                        }
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
                    // describe('Multiple Values (Out Of Category Item)', () => {
                    // });
                    describe('Multiple Values (Category Items)', () => {
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
                                        await pricingService.searchInOrderCenter.bind(this)(
                                            multipleValuesTestItem,
                                            driver,
                                        );
                                        driver.sleep(1 * 1000);
                                    });
                                    describe('Each', () => {
                                        multipleValuesTestStates_each.forEach((multipleValuesTestState) => {
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
                                                    )(
                                                        chosenUom,
                                                        multipleValuesTestItem,
                                                        amount,
                                                        driver,
                                                        chosenUom === 'Each' ? '2' : undefined,
                                                    );
                                                }
                                                const priceMultiTSAs = await pricingService.getTSAsOfMultiPerItem(
                                                    'OrderCenter',
                                                    multipleValuesTestItem,
                                                );
                                                // console.info(
                                                //     `${multipleValuesTestItem} ${multipleValuesTestState} priceMultiTSAs:`,
                                                //     priceMultiTSAs,
                                                // );

                                                const NPMCalcMessage = await pricingService.getItemNPMCalcMessage(
                                                    'OrderCenter',
                                                    multipleValuesTestItem,
                                                );
                                                console.info(
                                                    `${multipleValuesTestItem} ${multipleValuesTestState} NPMCalcMessage:`,
                                                    NPMCalcMessage,
                                                );
                                                addContext(this, {
                                                    title: `NPM Calc Message:`,
                                                    value: `NPMCalcMessage: ${JSON.stringify(NPMCalcMessage, null, 2)}`,
                                                });

                                                expect(typeof priceMultiTSAs).equals('object');
                                                expect(Object.keys(priceMultiTSAs)).to.eql([
                                                    'PriceMultiAfter1',
                                                    'PriceMultiAfter2',
                                                ]);
                                                priceMultiFields.forEach((priceField) => {
                                                    const fieldValue = priceMultiTSAs[priceField];
                                                    const expectedFieldValue =
                                                        pricingData.testItemsValues[multipleValuesTestItem][priceField][
                                                            account
                                                        ][multipleValuesTestState]['expectedValue'];
                                                    const expectedRule =
                                                        pricingData.testItemsValues[multipleValuesTestItem][priceField][
                                                            account
                                                        ][multipleValuesTestState]['rule'];
                                                    const udtKey = expectedRule.split(`' ->`)[0].replace(`'`, '');
                                                    const udtRuleValueObj: UserDefinedTableRow | undefined =
                                                        ppmValues.find((listing) => {
                                                            if (listing.MainKey === udtKey) return listing;
                                                        });
                                                    console.info(`Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                                                        \nExpected Rule: ${expectedRule}
                                                        \nUDT Rule: ${udtKey}:${
                                                        udtRuleValueObj ? udtRuleValueObj['Values'] : 'Key not found'
                                                    }`);
                                                    addContext(this, {
                                                        title: `${priceField}`,
                                                        value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                                                            \nExpected Rule: ${expectedRule}
                                                            \nUDT Rule: ${udtKey}:${
                                                            udtRuleValueObj
                                                                ? udtRuleValueObj['Values']
                                                                : 'Key not found'
                                                        }`,
                                                    });
                                                });

                                                const expectedPriceMultiAfter1 =
                                                    pricingData.testItemsValues[multipleValuesTestItem][
                                                        'PriceMultiAfter1'
                                                    ][account][multipleValuesTestState]['expectedValue'];
                                                const expectedPriceMultiAfter2 =
                                                    pricingData.testItemsValues[multipleValuesTestItem][
                                                        'PriceMultiAfter2'
                                                    ][account][multipleValuesTestState]['expectedValue'];
                                                const actualPriceMultiAfter1 = priceMultiTSAs['PriceMultiAfter1'];
                                                const actualPriceMultiAfter2 = priceMultiTSAs['PriceMultiAfter2'];
                                                expect(actualPriceMultiAfter1).equals(expectedPriceMultiAfter1);
                                                expect(actualPriceMultiAfter2).equals(expectedPriceMultiAfter2);
                                                driver.sleep(0.2 * 1000);
                                            });
                                        });
                                        // it('Setting AOQM2 to 0', async function () {
                                        //     await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                        //         this,
                                        //     )('Each', multipleValuesTestItem, 0, driver, '2');
                                        //     driver.sleep(0.1 * 1000);
                                        // });
                                    });
                                    describe('Case', () => {
                                        multipleValuesTestStates_case.forEach((multipleValuesTestState) => {
                                            it(`Checking "${multipleValuesTestState}"`, async function () {
                                                const splitedStateArgs = multipleValuesTestState.split(' ');
                                                const chosenUom = splitedStateArgs[1];
                                                const amount = Number(splitedStateArgs[0]);
                                                addContext(this, {
                                                    title: `State Args`,
                                                    value: `Chosen UOM: ${chosenUom}, Amount: ${amount}`,
                                                });
                                                await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                    this,
                                                )(chosenUom + '&Totals', multipleValuesTestItem, amount, driver);
                                                const priceMultiTSAs = await pricingService.getTSAsOfMultiPerItem(
                                                    'OrderCenter',
                                                    multipleValuesTestItem,
                                                );
                                                console.info(
                                                    `${multipleValuesTestItem} ${multipleValuesTestState} priceMultiTSAs:`,
                                                    priceMultiTSAs,
                                                );

                                                const NPMCalcMessage = await pricingService.getItemNPMCalcMessage(
                                                    'OrderCenter',
                                                    multipleValuesTestItem,
                                                );
                                                console.info(
                                                    `${multipleValuesTestItem} ${multipleValuesTestState} NPMCalcMessage:`,
                                                    NPMCalcMessage,
                                                );
                                                addContext(this, {
                                                    title: `NPM Calc Message:`,
                                                    value: `NPMCalcMessage: ${JSON.stringify(NPMCalcMessage, null, 2)}`,
                                                });

                                                expect(typeof priceMultiTSAs).equals('object');
                                                expect(Object.keys(priceMultiTSAs)).to.eql([
                                                    'PriceMultiAfter1',
                                                    'PriceMultiAfter2',
                                                ]);
                                                priceMultiFields.forEach((priceField) => {
                                                    const fieldValue = priceMultiTSAs[priceField];
                                                    const expectedFieldValue =
                                                        pricingData.testItemsValues[multipleValuesTestItem][priceField][
                                                            account
                                                        ][multipleValuesTestState]['expectedValue'];
                                                    const expectedRule =
                                                        pricingData.testItemsValues[multipleValuesTestItem][priceField][
                                                            account
                                                        ][multipleValuesTestState]['rule'];
                                                    const udtKey = expectedRule.split(`' ->`)[0].replace(`'`, '');
                                                    const udtRuleValueObj: UserDefinedTableRow | undefined =
                                                        ppmValues.find((listing) => {
                                                            if (listing.MainKey === udtKey) return listing;
                                                        });
                                                    console.info(`Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                                                            \nExpected Rule: ${expectedRule}
                                                            \nUDT Rule: ${udtKey}:${
                                                        udtRuleValueObj ? udtRuleValueObj['Values'] : 'Key not found'
                                                    }`);
                                                    addContext(this, {
                                                        title: `${priceField}`,
                                                        value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                                                                \nExpected Rule: ${expectedRule}
                                                                \nUDT Rule: ${udtKey}:${
                                                            udtRuleValueObj
                                                                ? udtRuleValueObj['Values']
                                                                : 'Key not found'
                                                        }`,
                                                    });
                                                });

                                                const expectedPriceMultiAfter1 =
                                                    pricingData.testItemsValues[multipleValuesTestItem][
                                                        'PriceMultiAfter1'
                                                    ][account][multipleValuesTestState]['expectedValue'];
                                                const expectedPriceMultiAfter2 =
                                                    pricingData.testItemsValues[multipleValuesTestItem][
                                                        'PriceMultiAfter2'
                                                    ][account][multipleValuesTestState]['expectedValue'];
                                                const actualPriceMultiAfter1 = priceMultiTSAs['PriceMultiAfter1'];
                                                const actualPriceMultiAfter2 = priceMultiTSAs['PriceMultiAfter2'];
                                                expect(actualPriceMultiAfter1).equals(expectedPriceMultiAfter1);
                                                expect(actualPriceMultiAfter2).equals(expectedPriceMultiAfter2);
                                                driver.sleep(0.2 * 1000);
                                            });
                                        });
                                    });
                                    describe('Box', () => {
                                        multipleValuesTestStates_box.forEach((multipleValuesTestState) => {
                                            it(`Checking "${multipleValuesTestState}"`, async function () {
                                                const splitedStateArgs = multipleValuesTestState.split(' ');
                                                const chosenUom = splitedStateArgs[1];
                                                const amount = Number(splitedStateArgs[0]);
                                                addContext(this, {
                                                    title: `State Args`,
                                                    value: `Chosen UOM: ${chosenUom}, Amount: ${amount}`,
                                                });
                                                await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                    this,
                                                )(chosenUom + '&Totals', multipleValuesTestItem, amount, driver);
                                                const priceMultiTSAs = await pricingService.getTSAsOfMultiPerItem(
                                                    'OrderCenter',
                                                    multipleValuesTestItem,
                                                );
                                                console.info(
                                                    `${multipleValuesTestItem} ${multipleValuesTestState} priceMultiTSAs:`,
                                                    priceMultiTSAs,
                                                );

                                                const NPMCalcMessage = await pricingService.getItemNPMCalcMessage(
                                                    'OrderCenter',
                                                    multipleValuesTestItem,
                                                );
                                                console.info(
                                                    `${multipleValuesTestItem} ${multipleValuesTestState} NPMCalcMessage:`,
                                                    NPMCalcMessage,
                                                );
                                                addContext(this, {
                                                    title: `NPM Calc Message:`,
                                                    value: `NPMCalcMessage: ${JSON.stringify(NPMCalcMessage, null, 2)}`,
                                                });

                                                expect(typeof priceMultiTSAs).equals('object');
                                                expect(Object.keys(priceMultiTSAs)).to.eql([
                                                    'PriceMultiAfter1',
                                                    'PriceMultiAfter2',
                                                ]);
                                                priceMultiFields.forEach((priceField) => {
                                                    const fieldValue = priceMultiTSAs[priceField];
                                                    const expectedFieldValue =
                                                        pricingData.testItemsValues[multipleValuesTestItem][priceField][
                                                            account
                                                        ][multipleValuesTestState]['expectedValue'];
                                                    const expectedRule =
                                                        pricingData.testItemsValues[multipleValuesTestItem][priceField][
                                                            account
                                                        ][multipleValuesTestState]['rule'];
                                                    const udtKey = expectedRule.split(`' ->`)[0].replace(`'`, '');
                                                    const udtRuleValueObj: UserDefinedTableRow | undefined =
                                                        ppmValues.find((listing) => {
                                                            if (listing.MainKey === udtKey) return listing;
                                                        });
                                                    console.info(`Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                                                            \nExpected Rule: ${expectedRule}
                                                            \nUDT Rule: ${udtKey}:${
                                                        udtRuleValueObj ? udtRuleValueObj['Values'] : 'Key not found'
                                                    }`);
                                                    addContext(this, {
                                                        title: `${priceField}`,
                                                        value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                                                                \nExpected Rule: ${expectedRule}
                                                                \nUDT Rule: ${udtKey}:${
                                                            udtRuleValueObj
                                                                ? udtRuleValueObj['Values']
                                                                : 'Key not found'
                                                        }`,
                                                    });
                                                });

                                                const expectedPriceMultiAfter1 =
                                                    pricingData.testItemsValues[multipleValuesTestItem][
                                                        'PriceMultiAfter1'
                                                    ][account][multipleValuesTestState]['expectedValue'];
                                                const expectedPriceMultiAfter2 =
                                                    pricingData.testItemsValues[multipleValuesTestItem][
                                                        'PriceMultiAfter2'
                                                    ][account][multipleValuesTestState]['expectedValue'];
                                                const actualPriceMultiAfter1 = priceMultiTSAs['PriceMultiAfter1'];
                                                const actualPriceMultiAfter2 = priceMultiTSAs['PriceMultiAfter2'];
                                                expect(actualPriceMultiAfter1).equals(expectedPriceMultiAfter1);
                                                expect(actualPriceMultiAfter2).equals(expectedPriceMultiAfter2);
                                                driver.sleep(0.2 * 1000);
                                            });
                                        });
                                        // it('Setting AOQM1 to 0', async function () {
                                        //     await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                        //         this,
                                        //     )('Case', multipleValuesTestItem, 0, driver);
                                        //     driver.sleep(0.1 * 1000);
                                        // });
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
                                    // const totalUnitsAmount = await pricingService.getItemTotalAmount(
                                    //     'Cart',
                                    //     multipleValuesTestCartItem,
                                    //     undefined,
                                    //     undefined,
                                    //     'LinesView',
                                    // );
                                    const priceMultiTSAs = await pricingService.getTSAsOfMultiPerItem(
                                        'Cart',
                                        multipleValuesTestCartItem,
                                        undefined,
                                        undefined,
                                        'LinesView',
                                    );
                                    // const priceTSA_Discount2 = await pricingService.getItemTSAs_Discount2(
                                    //     'Cart',
                                    //     multipleValuesTestCartItem,
                                    //     undefined,
                                    //     undefined,
                                    //     'LinesView',
                                    // );
                                    // const priceTSAs_AOQM_UOM2 = await pricingService.getItemTSAs_AOQM_UOM2(
                                    //     'Cart',
                                    //     multipleValuesTestCartItem,
                                    //     undefined,
                                    //     undefined,
                                    //     'LinesView',
                                    // );
                                    // const priceTotalsTSAs = await pricingService.getTotalsTSAsOfItem(
                                    //     'Cart',
                                    //     multipleValuesTestCartItem,
                                    //     undefined,
                                    //     undefined,
                                    //     'LinesView',
                                    // );
                                    // const expectedTotalUnitsAmount =
                                    //     pricingData.testItemsValues[multipleValuesTestCartItem]['Cart'][account];
                                    // console.info(
                                    //     `Cart ${multipleValuesTestCartItem} totalUnitsAmount: ${totalUnitsAmount}`,
                                    // );
                                    // console.info(`priceTSAs:`, JSON.stringify(priceTSAs, null, 2));
                                    // addContext(this, {
                                    //     title: `Total Units amount of item`,
                                    //     value: `form UI: ${totalUnitsAmount} , expected: ${expectedTotalUnitsAmount}`,
                                    // });
                                    priceMultiFields.forEach((priceField) => {
                                        const expectedValue =
                                            pricingData.testItemsValues[multipleValuesTestCartItem][priceField][
                                                account
                                            ][state]['expectedValue'];
                                        const expectedRule =
                                            pricingData.testItemsValues[multipleValuesTestCartItem][priceField][
                                                account
                                            ][state]['rule'];
                                        addContext(this, {
                                            title: `TSA field "${priceField}" Values`,
                                            value: `Form UI: ${priceMultiTSAs[priceField]} , Expected Value: ${expectedValue}\nExpected Rule: ${expectedRule}`,
                                        });
                                        // expect(priceTSAs[priceField]).equals(expectedValue);
                                    });
                                    // expect(totalUnitsAmount).equals(expectedTotalUnitsAmount);
                                    // const discount2FieldValue = priceTSA_Discount2['PriceDiscount2UnitPriceAfter1'];
                                    // const discount2ExpectedFieldValue =
                                    //     pricingData.testItemsValues[multipleValuesTestCartItem][
                                    //     'PriceDiscount2UnitPriceAfter1'
                                    //     ]['cart'][account];
                                    // addContext(this, {
                                    //     title: 'PriceDiscount2UnitPriceAfter1',
                                    //     value: `Field Value from UI: ${discount2FieldValue}, Expected Field Value from Data: ${discount2ExpectedFieldValue}`,
                                    // });
                                    // expect(discount2FieldValue).equals(discount2ExpectedFieldValue);

                                    // priceFields2.forEach((priceField) => {
                                    //     const fieldValue = priceTSAs_AOQM_UOM2[priceField];
                                    //     const expectedFieldValue =
                                    //         pricingData.testItemsValues[multipleValuesTestCartItem][priceField]['cart'][
                                    //         account
                                    //         ];
                                    //     addContext(this, {
                                    //         title: `${priceField}`,
                                    //         value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                    //     });
                                    //     // expect(fieldValue).equals(expectedFieldValue);
                                    // });

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
            });

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
