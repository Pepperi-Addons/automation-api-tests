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
import { PricingData06 } from '../../../pom/addons/PricingData06';
import { PricingDataNoUom } from '../../../pom/addons/PricingDataNoUom';
import PricingRules from '../../../pom/addons/PricingRules';
import GeneralService from '../../../../services/general.service';
import addContext from 'mochawesome/addContext';
import E2EUtils from '../../../utilities/e2e_utils';

chai.use(promised);

export async function PricingTotalsTests(email: string, password: string, client: Client, specialTestData?: 'noUom') {
    /*
________________________ 
_________________ Brief:
             
   * Pricing Totals
   * the totals calculations are used for 2 purposes:  
   * 1. when there are different UOM price sets - that each quantity would be multiplied by the correct price and thus the total sum would be accurate
   * 2. to compare two blocks (or unit fields) results in terms of absolute value or percentage, and to able to say: this discount block saved X money or got % discount..
   * 
   * field "PriceTaxTotal" calculation:  PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
   * field "PriceTaxTotalDiff" calculation:  TaxTotal - BaseTotal  || operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
   * field "PriceTaxTotalPercent" calculation: (1 - (BaseTotal / TaxTotal)) * 100 || (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base"
   * field "PriceTaxUnitDiff" calculation: PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1 || operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base || by units , UomIndex = 1
   * 
   * the test agenda is to ...
______________________________________ 
_________________ The Relevant Blocks:
            
. 'Base' -> ['ZBASE']
. 'Discount' -> ['ZDS1', 'ZDS2', 'ZDS3']
. 'GroupDiscount' -> ['ZGD1', 'ZGD2']
. 'ManualLine' -> []
. 'Tax' -> ['MTAX']

__________________________________________ 
_________________ The Relevant Conditions:
            
. 'ZBASE' -> ['A002', 'A001', 'A003', 'A005', 'A004']
. 'ZDS1' -> ['A001', 'A002', 'A003']
. 'MTAX' -> ['A002', 'A004']

______________________________________ 
_________________ The Relevant Tables:
    
. 'A001' -> ['ItemExternalID']
. 'A002' -> ['TransactionAccountExternalID', 'ItemExternalID']
. 'A005' -> ['ItemMainCategory']

_____________________________________ 
_________________ The Relevant Rules:
             
. 'ZBASE@A005@Hand Cosmetics':
    '[[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",8,"P"]],"EA","EA"],
      [true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",40,"P"]],"CS","CS"],
      [true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",160,"P"]],"BOX","BOX"]]',
 
. 'MTAX@A002@Acc01@MaNa23': '[[true,"1555891200000","2534022144999","1","1","MTAX_A002",[[0,"I",20,"%"]]]]',

. 'ZDS1@A001@MaNa18':
    '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001 EA",[[1,"D",5,"%"]],"EA","EA"],
      [true,"1555891200000","2534022144999","1","1","ZDS1_A001 CS",[[3,"D",10,"%"]],"CS","CS"],
      [true,"1555891200000","2534022144999","1","1","ZDS1_A001 BOX",[[2,"D",2,"%"]],"BOX","BOX"]]',
 
_________________ 
_________________ Order Of Actions:
             
   1. Looping over accounts
 
       2. Looping over items
 
           3. At Order Center: Looping over states
           ----> retrieving pricing fields values from UI and comparing to expected data ( pricingData.testItemsValues.Totals[totalsTestItem][account][totalsTestState][priceField] )
 
           4. At Cart: Looping over states
           ----> same check as at order center
 
_________________ 
_________________ 
*/
    const dateTime = new Date();
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const pricingData = specialTestData === 'noUom' ? new PricingDataNoUom() : new PricingData06();
    const pricingRules = new PricingRules();
    const baseUrl = `https://${client.BaseURL.includes('staging') ? 'app.sandbox.pepperi.com' : 'app.pepperi.com'}`;
    const udtFirstTableName = 'PPM_Values';
    // const udtSecondTableName = 'PPM_AccountValues';

    const installedPricingVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Pricing',
    )?.Version;

    // const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    console.info('Installed Pricing Version: ', JSON.stringify(installedPricingVersion, null, 2));

    const ppmValues_content =
        specialTestData === 'noUom'
            ? {
                  ...pricingRules[udtFirstTableName].features05noUom,
                  ...pricingRules[udtFirstTableName].features06noUom,
              }
            : {
                  ...pricingRules[udtFirstTableName].features05,
                  ...pricingRules[udtFirstTableName].features06,
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
    let e2eUtils: E2EUtils;
    let transactionUUID_Acc01: string;
    let transactionUUID_OtherAcc: string;
    let accountName: string;
    let duration: string;
    let ppmValues: UserDefinedTableRow[];
    let screenShot;

    const testAccounts = ['Acc01', 'OtherAcc'];
    const totalsTestItems = ['MaNa142', 'MaNa23', 'MaNa18'];
    const totalsTestStates = ['baseline', 'state1', 'state2'];
    const priceFields = [
        'PriceBaseUnitPriceAfter1',
        'PriceDiscountUnitPriceAfter1',
        'PriceGroupDiscountUnitPriceAfter1',
        'PriceManualLineUnitPriceAfter1',
        'PriceTaxUnitPriceAfter1',
    ];
    const priceFields2 = ['PriceBaseUnitPriceAfter2', 'PriceDiscountUnitPriceAfter2', 'PriceTaxUnitPriceAfter2'];
    const totalsPriceFields = ['PriceTaxTotal', 'PriceTaxTotalPercent', 'PriceTaxTotalDiff', 'PriceTaxUnitDiff'];

    if (!installedPricingVersion?.startsWith('0.5')) {
        describe(`Pricing ** Totals ** UI tests  - ${
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

            it('get UDT Values (PPM_Values)', async () => {
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
                        console.info('ACTUAL: matchingRowOfppmValues: ', matchingRowOfppmValues['Values'][0]);
                    console.info('EXPECTED: ppmValues_content[mainKey]: ', ppmValues_content[mainKey]);
                    matchingRowOfppmValues &&
                        addContext(this, {
                            title: `PPM Key "${mainKey}"`,
                            value: `ACTUAL  : ${matchingRowOfppmValues['Values'][0]} \nEXPECTED: ${ppmValues_content[mainKey]}`,
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

                    describe('Totals', function () {
                        totalsTestStates.forEach((totalsTestState) => {
                            // "baseline" , "state1", "state2"
                            describe(`"${totalsTestState}"`, function () {
                                describe(`PREP`, function () {
                                    totalsTestState == 'state2' &&
                                        it('Click "Continue ordering" button', async function () {
                                            await driver.untilIsVisible(orderPage.Cart_ContinueOrdering_Button);
                                            await driver.click(orderPage.Cart_ContinueOrdering_Button);
                                            await orderPage.isSpinnerDone();
                                            await orderPage.changeOrderCenterPageView('Line View');
                                            await orderPage.isSpinnerDone();
                                            screenShot = await driver.saveScreenshots();
                                            addContext(this, {
                                                title: `After "Line View" was selected`,
                                                value: 'data:image/png;base64,' + screenShot,
                                            });
                                            await driver.untilIsVisible(
                                                orderPage.getSelectorOfItemInOrderCenterByName(''),
                                            );
                                            driver.sleep(1 * 1000);
                                            screenShot = await driver.saveScreenshots();
                                            addContext(this, {
                                                title: `Order Center - Loaded`,
                                                value: 'data:image/png;base64,' + screenShot,
                                            });
                                        });

                                    it('Navigating to "Hand Cosmetics" at Sidebar', async function () {
                                        await driver.untilIsVisible(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                                        await driver.click(
                                            orderPage.getSelectorOfSidebarSectionInOrderCenterByName('Hand Cosmetics'),
                                        );
                                        await orderPage.isSpinnerDone();
                                        driver.sleep(0.5 * 1000);
                                        screenShot = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `At "Hand Cosmetics"`,
                                            value: 'data:image/png;base64,' + screenShot,
                                        });
                                    });
                                });

                                describe(`ORDER CENTER`, function () {
                                    totalsTestItems.forEach((totalsTestItem) => {
                                        describe(`Item: ***${totalsTestItem}`, function () {
                                            it(`Looking for "${totalsTestItem}" using the search box`, async function () {
                                                await pricingService.searchInOrderCenter.bind(this)(
                                                    totalsTestItem,
                                                    driver,
                                                );
                                                driver.sleep(1 * 1000);
                                            });

                                            it(`Setting Amounts`, async function () {
                                                const uom1 =
                                                    pricingData.testItemsValues.Totals[totalsTestItem][account][
                                                        totalsTestState
                                                    ]['uom1'];
                                                const uom2 =
                                                    pricingData.testItemsValues.Totals[totalsTestItem][account][
                                                        totalsTestState
                                                    ]['uom2'];
                                                const quantity1 =
                                                    pricingData.testItemsValues.Totals[totalsTestItem][account][
                                                        totalsTestState
                                                    ]['qty1'];
                                                const quantity2 =
                                                    pricingData.testItemsValues.Totals[totalsTestItem][account][
                                                        totalsTestState
                                                    ]['qty2'];
                                                switch (totalsTestState) {
                                                    case 'baseline':
                                                        break;

                                                    default:
                                                        await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                            this,
                                                        )(uom1 + '&Totals', totalsTestItem, quantity1, driver);
                                                        driver.sleep(0.5 * 1000);
                                                        await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                            this,
                                                        )(uom2 + '&Totals', totalsTestItem, quantity2, driver, '2');
                                                        driver.sleep(0.5 * 1000);
                                                }
                                            });

                                            it(`Checking TSAs`, async function () {
                                                screenShot = await driver.saveScreenshots();
                                                addContext(this, {
                                                    title: `${totalsTestState}`,
                                                    value: 'data:image/png;base64,' + screenShot,
                                                });
                                                const priceTSAs = await pricingService.getItemTSAs(
                                                    'OrderCenter',
                                                    totalsTestItem,
                                                );
                                                const priceTSA_Discount2 = await pricingService.getItemTSAs_Discount2(
                                                    'OrderCenter',
                                                    totalsTestItem,
                                                );
                                                const priceTSAs_AOQM_UOM2 = await pricingService.getItemTSAs_AOQM_UOM2(
                                                    'OrderCenter',
                                                    totalsTestItem,
                                                );
                                                const priceTotalsTSAs = await pricingService.getTotalsTSAsOfItem(
                                                    'OrderCenter',
                                                    totalsTestItem,
                                                );
                                                console.info(
                                                    `${totalsTestItem} ${totalsTestState} priceTSAs:`,
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
                                                expect(typeof priceTSA_Discount2).equals('object');
                                                expect(Object.keys(priceTSA_Discount2)).to.eql([
                                                    'PriceDiscount2UnitPriceAfter1',
                                                ]);
                                                expect(typeof priceTSAs_AOQM_UOM2).equals('object');
                                                expect(Object.keys(priceTSAs_AOQM_UOM2)).to.eql([
                                                    'PriceBaseUnitPriceAfter2',
                                                    'PriceDiscountUnitPriceAfter2',
                                                    'PriceTaxUnitPriceAfter2',
                                                ]);
                                                expect(typeof priceTotalsTSAs).equals('object');
                                                expect(Object.keys(priceTotalsTSAs)).to.eql([
                                                    'PriceTaxTotal',
                                                    'PriceTaxTotalPercent',
                                                    'PriceTaxTotalDiff',
                                                    'PriceTaxUnitDiff',
                                                ]);
                                                const UI_NPMCalcMessage = priceTSAs['NPMCalcMessage'];
                                                const data_NPMCalcMessage =
                                                    pricingData.testItemsValues.Totals[totalsTestItem][account][
                                                        totalsTestState
                                                    ]['NPMCalcMessage'];
                                                addContext(this, {
                                                    title: `State Args`,
                                                    value: `NPMCalcMessage from UI: ${JSON.stringify(
                                                        UI_NPMCalcMessage,
                                                        null,
                                                        2,
                                                    )}, \nNPMCalcMessage (at ${totalsTestState}) from Data: ${JSON.stringify(
                                                        data_NPMCalcMessage,
                                                        null,
                                                        2,
                                                    )}`,
                                                });
                                                expect(UI_NPMCalcMessage.length).equals(data_NPMCalcMessage.length);

                                                priceFields.forEach((priceField) => {
                                                    const fieldValue = priceTSAs[priceField];
                                                    const expectedFieldValue =
                                                        pricingData.testItemsValues.Totals[totalsTestItem][account][
                                                            totalsTestState
                                                        ][priceField];
                                                    addContext(this, {
                                                        title: `${priceField}`,
                                                        value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                                    });
                                                    expect(fieldValue).equals(expectedFieldValue);
                                                });

                                                const discount2FieldValue =
                                                    priceTSA_Discount2['PriceDiscount2UnitPriceAfter1'];
                                                const discount2ExpectedFieldValue =
                                                    pricingData.testItemsValues.Totals[totalsTestItem][account][
                                                        totalsTestState
                                                    ]['PriceDiscount2UnitPriceAfter1'];
                                                addContext(this, {
                                                    title: 'PriceDiscount2UnitPriceAfter1',
                                                    value: `Field Value from UI: ${discount2FieldValue}, Expected Field Value from Data: ${discount2ExpectedFieldValue}`,
                                                });
                                                expect(discount2FieldValue).equals(discount2ExpectedFieldValue);

                                                priceFields2.forEach((priceField) => {
                                                    const fieldValue = priceTSAs_AOQM_UOM2[priceField];
                                                    const expectedFieldValue =
                                                        pricingData.testItemsValues.Totals[totalsTestItem][account][
                                                            totalsTestState
                                                        ][priceField];
                                                    addContext(this, {
                                                        title: `${priceField}`,
                                                        value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                                    });
                                                    expect(fieldValue).equals(expectedFieldValue);
                                                });

                                                totalsPriceFields.forEach((priceField) => {
                                                    const fieldValue = priceTotalsTSAs[priceField];
                                                    const expectedFieldValue =
                                                        pricingData.testItemsValues.Totals[totalsTestItem][account][
                                                            totalsTestState
                                                        ][priceField];
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

                                if (totalsTestState != 'baseline') {
                                    describe(`CART`, function () {
                                        it('entering and verifying being in cart', async function () {
                                            await driver.click(orderPage.Cart_Button);
                                            await orderPage.isSpinnerDone();
                                            driver.sleep(1 * 1000);
                                            switch (totalsTestState) {
                                                case 'state1':
                                                    // await driver.untilIsVisible(orderPage.Cart_List_container);
                                                    break;

                                                default:
                                                    break;
                                            }
                                        });

                                        it(`switch to 'Lines View'`, async function () {
                                            await orderPage.changeCartView('Lines');
                                            screenShot = await driver.saveScreenshots();
                                            addContext(this, {
                                                title: `After "Line View" was selected`,
                                                value: 'data:image/png;base64,' + screenShot,
                                            });
                                        });

                                        it('verifying that the sum total of items in the cart is correct', async function () {
                                            const numberOfItemsInCart = totalsTestItems.length;
                                            screenShot = await driver.saveScreenshots();
                                            addContext(this, {
                                                title: `At Cart`,
                                                value: 'data:image/png;base64,' + screenShot,
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

                                        totalsTestItems.forEach((totalsTest_CartItem) => {
                                            it(`checking item "${totalsTest_CartItem}"`, async function () {
                                                const priceTSAs = await pricingService.getItemTSAs(
                                                    'Cart',
                                                    totalsTest_CartItem,
                                                    undefined,
                                                    undefined,
                                                    'LinesView',
                                                );
                                                const priceTSA_Discount2 = await pricingService.getItemTSAs_Discount2(
                                                    'Cart',
                                                    totalsTest_CartItem,
                                                    undefined,
                                                    undefined,
                                                    'LinesView',
                                                );
                                                const priceTSAs_AOQM_UOM2 = await pricingService.getItemTSAs_AOQM_UOM2(
                                                    'Cart',
                                                    totalsTest_CartItem,
                                                    undefined,
                                                    undefined,
                                                    'LinesView',
                                                );
                                                const priceTotalsTSAs = await pricingService.getTotalsTSAsOfItem(
                                                    'Cart',
                                                    totalsTest_CartItem,
                                                    undefined,
                                                    undefined,
                                                    'LinesView',
                                                );

                                                priceFields.forEach((priceField) => {
                                                    const fieldValue = priceTSAs[priceField];
                                                    const expectedFieldValue =
                                                        pricingData.testItemsValues.Totals[totalsTest_CartItem][
                                                            account
                                                        ][totalsTestState][priceField];
                                                    addContext(this, {
                                                        title: `${priceField}`,
                                                        value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                                    });
                                                    expect(fieldValue).equals(expectedFieldValue);
                                                });

                                                const discount2FieldValue =
                                                    priceTSA_Discount2['PriceDiscount2UnitPriceAfter1'];
                                                const discount2ExpectedFieldValue =
                                                    pricingData.testItemsValues.Totals[totalsTest_CartItem][account][
                                                        totalsTestState
                                                    ]['PriceDiscount2UnitPriceAfter1'];
                                                addContext(this, {
                                                    title: 'PriceDiscount2UnitPriceAfter1',
                                                    value: `Field Value from UI: ${discount2FieldValue}, Expected Field Value from Data: ${discount2ExpectedFieldValue}`,
                                                });
                                                expect(discount2FieldValue).equals(discount2ExpectedFieldValue);

                                                priceFields2.forEach((priceField) => {
                                                    const fieldValue = priceTSAs_AOQM_UOM2[priceField];
                                                    const expectedFieldValue =
                                                        pricingData.testItemsValues.Totals[totalsTest_CartItem][
                                                            account
                                                        ][totalsTestState][priceField];
                                                    addContext(this, {
                                                        title: `${priceField}`,
                                                        value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                                    });
                                                    expect(fieldValue).equals(expectedFieldValue);
                                                });

                                                totalsPriceFields.forEach((priceField) => {
                                                    const fieldValue = priceTotalsTSAs[priceField];
                                                    const expectedFieldValue =
                                                        pricingData.testItemsValues.Totals[totalsTest_CartItem][
                                                            account
                                                        ][totalsTestState][priceField];
                                                    addContext(this, {
                                                        title: `${priceField}`,
                                                        value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                                    });
                                                    expect(fieldValue).equals(expectedFieldValue);
                                                });
                                            });
                                        });
                                    });
                                }
                            });
                        });
                    });
                });
            });

            describe('Cleanup', function () {
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
