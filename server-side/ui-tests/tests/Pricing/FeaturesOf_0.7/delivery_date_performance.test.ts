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
import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import { OrderPage } from '../../../pom/Pages/OrderPage';
import { ObjectsService } from '../../../../services';
import { PricingService } from '../../../../services/pricing.service';
import PricingRules from '../../../pom/addons/PricingRules';
import GeneralService from '../../../../services/general.service';
import addContext from 'mochawesome/addContext';
import E2EUtils from '../../../utilities/e2e_utils';
import { PricingData07 } from '../../../pom/addons/PricingData07';
import { PricingDataNoUom } from '../../../pom/addons/PricingDataNoUom';
import { Key } from 'selenium-webdriver';

chai.use(promised);

export async function PricingDeliveryDatePerformanceUdtErrorsTests(
    email: string,
    password: string,
    client: Client,
    specialTestData?: 'noUom',
) {
    /*
________________________ 
_________________ Brief:
          
* Pricing Performance and Error of UDT rules
______________________________________ 
_________________ The Relevant Blocks:
            
. 'Base' -> ['ZBASE']

__________________________________________ 
_________________ The Relevant Conditions:
            
. 'ZBASE' -> ['A002', 'A001', 'A003', 'A005', 'A004']

______________________________________ 
_________________ The Relevant Tables:
    
. 'A005' -> ['ItemMainCategory']

_____________________________________ 
_________________ The Relevant Rules:
          
. 'ZBASE@A005@dummyItem': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",100,"P"]]]]',
 
. 'ZTEST@A002@Acc01@Frag005':
    '[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",10,"P"]]]]',
 
. 'ZBASE@A202@Acc01@Frag005':
    '[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",10,"P"]]]]',
 
_________________ 
_________________ Order Of Actions:
          
1. Looping over accounts
 
_________________ 
_________________ 
*/
    const dateTime = new Date();
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const baseUrl = `https://${client.BaseURL.includes('staging') ? 'app.sandbox.pepperi.com' : 'app.pepperi.com'}`;
    const pricingRules = new PricingRules();
    const pricingData = specialTestData === 'noUom' ? new PricingDataNoUom() : new PricingData07();
    const udtFirstTableName = 'PPM_Values';

    const installedPricingVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Pricing',
    )?.Version;

    console.info('Installed Pricing Version: ', JSON.stringify(installedPricingVersion, null, 2));

    const ppmValues_content =
        specialTestData === 'noUom'
            ? {
                  ...pricingRules[udtFirstTableName].features05noUom,
                  ...pricingRules[udtFirstTableName].features06noUom,
                  ...pricingRules[udtFirstTableName].features07,
              }
            : {
                  ...pricingRules[udtFirstTableName].features05,
                  ...pricingRules[udtFirstTableName].features06,
                  ...pricingRules[udtFirstTableName].features07,
              };

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
    let e2eutils: E2EUtils;
    let transactionUUID: string;
    let duration: string;
    let accountName: string;
    let ppmValues: UserDefinedTableRow[];
    let screenShot;

    const nameOfAccount = 'My Store';
    const testAccounts = ['Acc01', 'OtherAcc'];
    const testDates = ['BlankDate', 'CurrentDate', '15 Dec 2023', '30 Nov 2023'];
    const testDatesForInput = {
        '15 Dec 2023': '12/15/2023 5:55 PM',
        '30 Nov 2023': '11/30/2023 5:55 PM',
    };
    const deliveryDateTestItems = ['Frag007'];
    const deliveryDateTestStates = ['baseline', '1 Each', '2 Each', '3 Each'];
    const deliveryDateTestCartStates = ['1 Each', '2 Each', '3 Each'];
    const priceDeliveryDateDiscountFields = ['PriceDiscount2UnitPriceAfter1'];
    const priceFields = [
        'PriceBaseUnitPriceAfter1',
        'PriceDiscountUnitPriceAfter1',
        'PriceGroupDiscountUnitPriceAfter1',
        'PriceManualLineUnitPriceAfter1',
        'PriceTaxUnitPriceAfter1',
    ];

    if (!installedPricingVersion?.startsWith('0.5') && !installedPricingVersion?.startsWith('0.6')) {
        describe(`Pricing ** Delivery Date, Performance and UDT Errors ** UI tests  - ${
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
                e2eutils = new E2EUtils(driver);
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

            // afterEach(async function () {
            //     driver.sleep(500);
            //     await webAppHomePage.isDialogOnHomePAge(this);
            //     await webAppHomePage.collectEndTestData(this);
            // });

            it('Login', async function () {
                await webAppLoginPage.login(email, password);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Manual Resync', async function () {
                await e2eutils.performManualResync.bind(this)(client, driver);
            });

            it('If Error popup appear - close it', async function () {
                await driver.refresh();
                const accessToken = await webAppAPI.getAccessToken();
                await webAppAPI.pollForResyncResponse(accessToken, 100);
                try {
                    await webAppHomePage.isDialogOnHomePAge(this);
                } catch (error) {
                    console.error(error);
                } finally {
                    await driver.navigate(`${baseUrl}/HomePage`);
                }
                await webAppAPI.pollForResyncResponse(accessToken);
            });

            it('get UDT Values (PPM_Values)', async function () {
                ppmValues = await objectsService.getUDT({ where: "MapDataExternalID='PPM_Values'", page_size: -1 });
                console.info('PPM_Values Length: ', JSON.stringify(ppmValues.length, null, 2));
            });

            it('validating "PPM_Values" via API', async function () {
                const expectedPPMValuesLength =
                    Object.keys(ppmValues_content).length + pricingRules.dummyPPM_Values_length;
                console.info(
                    'EXPECTED: Object.keys(ppmValues_content).length + dummyPPM_ValuesKeys.length: ',
                    expectedPPMValuesLength,
                    'ACTUAL: ppmValues.length: ',
                    ppmValues.length,
                );
                addContext(this, {
                    title: `PPM Values Length`,
                    value: `ACTUAL: ${ppmValues.length} \nEXPECTED: ${expectedPPMValuesLength}`,
                });
                expect(ppmValues.length).equals(expectedPPMValuesLength);
                Object.keys(ppmValues_content).forEach((mainKey) => {
                    console.info('mainKey: ', mainKey);
                    const matchingRowOfppmValues = ppmValues.find((tableRow) => {
                        if (tableRow.MainKey === mainKey) {
                            return tableRow;
                        }
                    });
                    matchingRowOfppmValues &&
                        console.info('EXPECTED: matchingRowOfppmValues: ', matchingRowOfppmValues['Values'][0]);
                    console.info('ACTUAL: ppmValues_content[mainKey]: ', ppmValues_content[mainKey]);
                    matchingRowOfppmValues &&
                        addContext(this, {
                            title: `PPM Key "${mainKey}"`,
                            value: `ACTUAL  : ${ppmValues_content[mainKey]} \nEXPECTED: ${matchingRowOfppmValues['Values'][0]}`,
                        });
                    matchingRowOfppmValues &&
                        expect(ppmValues_content[mainKey]).equals(
                            client.BaseURL.includes('staging')
                                ? matchingRowOfppmValues['Values'].join()
                                : matchingRowOfppmValues['Values'][0],
                        );
                });
            });

            testAccounts.forEach((account) => {
                describe(`ACCOUNT "${account == 'Acc01' ? 'My Store' : 'Account for order scenarios'}"`, function () {
                    it('Creating new transaction', async function () {
                        screenShot = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Before Transaction created`,
                            value: 'data:image/png;base64,' + screenShot,
                        });
                        await webAppHomePage.isDialogOnHomePAge(this);
                        account == 'Acc01' ? (accountName = 'My Store') : (accountName = 'Account for order scenarios');
                        transactionUUID = await pricingService.startNewSalesOrderTransaction(accountName);
                        console.info('transactionUUID:', transactionUUID);
                        await orderPage.changeOrderCenterPageView('Line View');
                    });

                    it(`PERFORMANCE: making sure Sales Order Loading Duration is acceptable`, async function () {
                        let limit: number;
                        switch (true) {
                            case installedPricingVersion?.startsWith('0.5'):
                            case installedPricingVersion?.startsWith('0.6'):
                                limit = 650;
                                break;

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
                });
            });

            testDates.forEach((date) => {
                describe(`Testing ${
                    date === 'CurrentDate'
                        ? `${dateTime.toUTCString()} (CURRENT DATE)`
                        : date === 'BlankDate'
                        ? 'Default'
                        : date
                }`, function () {
                    it('Creating new transaction', async function () {
                        screenShot = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Before Transaction created`,
                            value: 'data:image/png;base64,' + screenShot,
                        });
                        await webAppHomePage.isDialogOnHomePAge(this);
                        transactionUUID = await pricingService.startNewSalesOrderTransaction(nameOfAccount);
                        console.info('transactionUUID:', transactionUUID);
                        await orderPage.changeOrderCenterPageView('Line View');
                    });

                    it(`PERFORMANCE: making sure Sales Order Loading Duration is acceptable`, async function () {
                        let limit: number;
                        switch (true) {
                            case installedPricingVersion?.startsWith('0.5'):
                            case installedPricingVersion?.startsWith('0.6'):
                                limit = 650;
                                break;

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

                    it(`${
                        date === 'BlankDate'
                            ? 'NO Change in Delivery Date'
                            : `Changing Delivery Date (${date === 'CurrentDate' ? dateTime.toDateString() : date})`
                    }`, async function () {
                        screenShot = await driver.saveScreenshots();
                        addContext(this, {
                            title: `At Order Center - before Delivery Date Pencil is clicked`,
                            value: 'data:image/png;base64,' + screenShot,
                        });
                        if (date !== 'BlankDate') {
                            await driver.click(orderPage.DeliveryDate);
                            screenShot = await driver.saveScreenshots();
                            addContext(this, {
                                title: `after Delivery Date Pencil is clicked`,
                                value: 'data:image/png;base64,' + screenShot,
                            });
                            await driver.untilIsVisible(orderPage.DatePicker_popup);
                            await driver.untilIsVisible(orderPage.DarkBackdrop_of_DatePicker);

                            if (date === 'CurrentDate') {
                                await driver.click(orderPage.DatePicker_currentDate); // choosing today from the calendar
                                screenShot = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `after Today was picked from the calendar`,
                                    value: 'data:image/png;base64,' + screenShot,
                                });
                                await driver.untilIsVisible(orderPage.TimePicker_clock);
                                await driver.click(orderPage.TimePicker_currentHour); // choosing current hour from the clock
                                screenShot = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `after current Hour was picked from the clock`,
                                    value: 'data:image/png;base64,' + screenShot,
                                });
                                await driver.untilIsVisible(orderPage.TimePicker_minutes_active);
                                await driver.click(orderPage.TimePicker_minutes_00); // choosing 00 minutes from the clock
                                screenShot = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `after 00 Minutes was picked from the clock`,
                                    value: 'data:image/png;base64,' + screenShot,
                                });
                            } else {
                                await driver.sendKeyWithoutElement(Key.ESCAPE);
                                screenShot = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `after Date Picker is canceled (ESCAPE clicked)`,
                                    value: 'data:image/png;base64,' + screenShot,
                                });
                                await driver.untilIsVisible(orderPage.DeliveryDate_input_active);
                                await driver.sendStringWithoutElement(testDatesForInput[date]);
                                driver.sleep(0.05 * 1000);
                                await driver.click(orderPage.TransactionID); // getting the input out of focus
                            }
                            await orderPage.isSpinnerDone();
                            driver.sleep(0.1 * 1000);
                        }
                    });

                    describe(`Delivery Date - ${
                        date === 'BlankDate'
                            ? 'Default'
                            : date === 'CurrentDate'
                            ? `Today (${dateTime.toDateString()})`
                            : date
                    }`, function () {
                        it('Navigating to "Great Perfumes" at Sidebar', async function () {
                            await driver.untilIsVisible(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                            await driver.click(
                                orderPage.getSelectorOfSidebarSectionInOrderCenterByName('Great Perfumes'),
                            );
                            driver.sleep(0.1 * 1000);
                        });
                        deliveryDateTestItems.forEach((deliveryDateTestItem) => {
                            describe(`Item: ***${deliveryDateTestItem}`, function () {
                                describe('ORDER CENTER', function () {
                                    it(`Looking for "${deliveryDateTestItem}" using the search box`, async function () {
                                        await pricingService.searchInOrderCenter.bind(this)(
                                            deliveryDateTestItem,
                                            driver,
                                        );
                                        driver.sleep(1 * 1000);
                                    });

                                    deliveryDateTestStates.forEach((deliveryDateTestState) => {
                                        it(`Checking "${deliveryDateTestState}"`, async function () {
                                            if (deliveryDateTestState != 'baseline') {
                                                const splitedStateArgs = deliveryDateTestState.split(' ');
                                                const chosenUOM = splitedStateArgs[1];
                                                const amount = Number(splitedStateArgs[0]);
                                                addContext(this, {
                                                    title: `State Args`,
                                                    value: `Chosen UOM: ${chosenUOM}, Amount: ${amount}`,
                                                });
                                                await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                    this,
                                                )(chosenUOM, deliveryDateTestItem, amount, driver);
                                            }
                                            const priceTSAs = await pricingService.getItemTSAs(
                                                'OrderCenter',
                                                deliveryDateTestItem,
                                            );
                                            console.info(
                                                `${deliveryDateTestItem} ${deliveryDateTestState} priceTSAs:`,
                                                JSON.stringify(priceTSAs, null, 2),
                                            );
                                            const priceTSA_Discount2 = await pricingService.getItemTSAs_Discount2(
                                                'OrderCenter',
                                                deliveryDateTestItem,
                                            );
                                            console.info(
                                                `OC ${deliveryDateTestItem} ${deliveryDateTestState} priceTSA_Discount2:`,
                                                JSON.stringify(priceTSA_Discount2, null, 2),
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
                                            expect(typeof priceTSA_Discount2).equals('object');
                                            expect(Object.keys(priceTSA_Discount2)).to.eql(
                                                priceDeliveryDateDiscountFields,
                                            );

                                            const UI_NPMCalcMessage = priceTSAs['NPMCalcMessage'];
                                            const baseline_NPMCalcMessage =
                                                pricingData.testItemsValues.DeliveryDate[deliveryDateTestItem][
                                                    'NPMCalcMessage'
                                                ][date]['baseline'];
                                            const data_NPMCalcMessage =
                                                pricingData.testItemsValues.DeliveryDate[deliveryDateTestItem][
                                                    'NPMCalcMessage'
                                                ][date][deliveryDateTestState];

                                            addContext(this, {
                                                title: `State Args`,
                                                value: `NPMCalcMessage from UI: ${JSON.stringify(
                                                    UI_NPMCalcMessage,
                                                    null,
                                                    2,
                                                )}, \nNPMCalcMessage (at baseline) from Data: ${JSON.stringify(
                                                    baseline_NPMCalcMessage,
                                                    null,
                                                    2,
                                                )}, \nNPMCalcMessage (at ${deliveryDateTestState}) from Data: ${JSON.stringify(
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
                                                    pricingData.testItemsValues.DeliveryDate[deliveryDateTestItem][
                                                        priceField
                                                    ][date][deliveryDateTestState];
                                                addContext(this, {
                                                    title: `${priceField}`,
                                                    value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                                });
                                                expect(fieldValue).equals(expectedFieldValue);
                                            });

                                            priceDeliveryDateDiscountFields.forEach((priceField) => {
                                                const fieldValue = priceTSA_Discount2[priceField];
                                                const expectedFieldValue =
                                                    pricingData.testItemsValues.DeliveryDate[deliveryDateTestItem][
                                                        priceField
                                                    ][date][deliveryDateTestState];
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
                                        expect(Number(itemsInCart)).to.equal(deliveryDateTestItems.length);
                                        driver.sleep(1 * 1000);
                                    });

                                    deliveryDateTestItems.forEach(async (item) => {
                                        deliveryDateTestCartStates.forEach((deliveryDateTestState) => {
                                            describe(`Checking "${deliveryDateTestState}"`, function () {
                                                it(`switch to 'Grid View'`, async function () {
                                                    await orderPage.changeCartView('Grid');
                                                    screenShot = await driver.saveScreenshots();
                                                    addContext(this, {
                                                        title: `After "Grid" View was selected`,
                                                        value: 'data:image/png;base64,' + screenShot,
                                                    });
                                                });

                                                it(`change ${item} quantity to ${deliveryDateTestState}`, async function () {
                                                    const splitedStateArgs = deliveryDateTestState.split(' ');
                                                    const amount = Number(splitedStateArgs[0]);
                                                    await pricingService.changeSelectedQuantityOfSpecificItemInCart.bind(
                                                        this,
                                                    )('Each', item, amount, driver);
                                                    driver.sleep(0.2 * 1000);
                                                });

                                                it(`switch to 'Lines View'`, async function () {
                                                    await orderPage.changeCartView('Lines');
                                                    screenShot = await driver.saveScreenshots();
                                                    addContext(this, {
                                                        title: `After "Lines" View was selected`,
                                                        value: 'data:image/png;base64,' + screenShot,
                                                    });
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
                                                    const priceTSA_Discount2 =
                                                        await pricingService.getItemTSAs_Discount2(
                                                            'Cart',
                                                            item,
                                                            undefined,
                                                            undefined,
                                                            'LinesView',
                                                        );
                                                    console.info(
                                                        `CART ${item} ${deliveryDateTestState} priceTSA_Discount2:`,
                                                        JSON.stringify(priceTSA_Discount2, null, 2),
                                                    );
                                                    const expectedAmount = deliveryDateTestState.split(' ')[0];
                                                    addContext(this, {
                                                        title: `Total Units Amount`,
                                                        value: `From UI: ${totalUnitsAmount}, expected: ${expectedAmount}`,
                                                    });
                                                    priceFields.forEach((priceField) => {
                                                        const expextedValue =
                                                            pricingData.testItemsValues.DeliveryDate[item][priceField][
                                                                date
                                                            ].cart[deliveryDateTestState];
                                                        expect(priceTSAs[priceField]).equals(expextedValue);
                                                    });
                                                    priceDeliveryDateDiscountFields.forEach((priceField) => {
                                                        const expextedValue =
                                                            pricingData.testItemsValues.DeliveryDate[item][priceField][
                                                                date
                                                            ].cart[deliveryDateTestState];
                                                        expect(priceTSA_Discount2[priceField]).equals(expextedValue);
                                                    });
                                                });
                                            });
                                        });
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
