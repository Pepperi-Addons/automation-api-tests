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
import PricingRules from '../../../pom/addons/PricingRules';
import GeneralService from '../../../../services/general.service';
import addContext from 'mochawesome/addContext';
import E2EUtils from '../../../utilities/e2e_utils';

chai.use(promised);

export async function PricingApplyUomsTests(email: string, password: string, client: Client) {
    /*
________________________ 
_________________ Brief:
          
* Pricing Per UOM
* in previous version there was set price to only one Unit Of Measure, and the others were multiplication by the UOM factor 
* now a set price is available for each UOM separately
* the test agenda is to make sure calculations per each UOM are performed correctly
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
. 'ZDS2' -> ['A002']

______________________________________ 
_________________ The Relevant Tables:
    
. 'A001' -> ['ItemExternalID']
. 'A002' -> ['TransactionAccountExternalID', 'ItemExternalID']
. 'A003' -> ['TransactionAccountExternalID', 'ItemMainCategory']

_____________________________________ 
_________________ The Relevant Rules:
          
. 'ZBASE@A003@Acc01@Hair4You':
'[[true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",10,"P"]],"EA","EA"],
  [true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",50,"P"]],"CS","CS"],
  [true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",200,"P"]],"BOX","BOX"]]',
 
. 'ZDS1@A001@Hair002':
'[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[2,"D",2,"%"],[5,"D",5,"%"],[20,"D",10,"%"]],"EA","EA"],
  [true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[4,"D",7.5,"P"]],"CS","CS"]]',
 
. 'ZDS2@A002@Acc01@Hair012':
'[[true,"1555891200000","2534022144999","1","","Free Goods",[[5,"D",100,"%","",1,"EA","Hair002",0],[20,"D",100,"%","",1,"CS","Hair012",0]],"EA","EA@CS"],
  [true,"1555891200000","2534022144999","1","","Free Goods",[[2,"D",100,"%","",1,"CS","Hair002",0],[4,"D",100,"%","",1,"CS","MaFa24",0]],"BOX","BOX"]]',
 
_________________ 
_________________ Order Of Actions:
          
1. Looping over accounts
 
    2. Looping over items
 
        3. At Order Center: Looping over states
        ----> retrieving pricing fields values from UI and comparing to expected data ( pricingData.testItemsValues.Uom[uomTestItem][priceField][account][uomTestState] )
 
        4. At Cart: Looping over states
        ----> same check as at order center
 
_________________ 
_________________ 
*/
    const dateTime = new Date();
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const pricingData = new PricingData06();
    const pricingRules = new PricingRules();
    const baseUrl = `https://${client.BaseURL.includes('staging') ? 'app.sandbox.pepperi.com' : 'app.pepperi.com'}`;
    const udtFirstTableName = 'PPM_Values';
    // const udtSecondTableName = 'PPM_AccountValues';

    const installedPricingVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Pricing',
    )?.Version;

    // const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    console.info('Installed Pricing Version: ', JSON.stringify(installedPricingVersion, null, 2));

    const ppmValues_content = {
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
    let transactionUUID: string;
    let accountName: string;
    let duration: string;
    let ppmValues: UserDefinedTableRow[];
    let screenShot;

    const testAccounts = ['Acc01', 'OtherAcc'];
    const uomTestStates = [
        'baseline',
        '1 Each',
        '2 Each',
        '4 Each',
        '5 Each',
        '19 Each',
        '20 Each',
        '1 Case',
        '2 Case',
        '4 Case',
        '5 Case',
        '19 Case',
        '20 Case',
        '1 Box',
        '2 Box',
        '3 Box',
        '4 Box',
    ];
    const uomTestItems = ['Hair001', 'Hair002', 'Hair012'];
    const uomTestCartItems = [
        { name: 'Hair001', amount: 96 },
        { name: 'Hair002', amount: 96 },
        { name: 'Hair012', amount: 96 },
        { name: 'MaFa24 Free Case', amount: 6 },
    ];
    const priceFields = [
        'PriceBaseUnitPriceAfter1',
        'PriceDiscountUnitPriceAfter1',
        'PriceGroupDiscountUnitPriceAfter1',
        'PriceManualLineUnitPriceAfter1',
        'PriceTaxUnitPriceAfter1',
    ];

    if (!installedPricingVersion?.startsWith('0.5')) {
        describe(`Pricing ** UOM ** UI tests  - ${
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

                    describe('UOMs', function () {
                        it('Navigating to "Hair4You" at Sidebar', async function () {
                            await driver.untilIsVisible(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                            await driver.click(orderPage.getSelectorOfSidebarSectionInOrderCenterByName('Hair4You'));
                            driver.sleep(0.1 * 1000);
                        });

                        uomTestItems.forEach((uomTestItem) => {
                            describe(`Item: ***${uomTestItem}`, function () {
                                describe('ORDER CENTER', function () {
                                    it(`Looking for "${uomTestItem}" using the search box`, async function () {
                                        await pricingService.searchInOrderCenter.bind(this)(uomTestItem, driver);
                                        driver.sleep(1 * 1000);
                                    });

                                    uomTestStates.forEach((uomTestState) => {
                                        it(`Checking "${uomTestState}"`, async function () {
                                            if (uomTestState != 'baseline') {
                                                const splitedStateArgs = uomTestState.split(' ');
                                                const chosenUom = splitedStateArgs[1];
                                                const amount = Number(splitedStateArgs[0]);
                                                addContext(this, {
                                                    title: `State Args`,
                                                    value: `Chosen UOM: ${chosenUom}, Amount: ${amount}`,
                                                });
                                                await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                    this,
                                                )(chosenUom, uomTestItem, amount, driver);
                                            }
                                            const priceTSAs = await pricingService.getItemTSAs(
                                                'OrderCenter',
                                                uomTestItem,
                                            );
                                            console.info(`${uomTestItem} ${uomTestState} priceTSAs:`, priceTSAs);
                                            expect(typeof priceTSAs).equals('object');
                                            expect(Object.keys(priceTSAs)).to.eql([
                                                'PriceBaseUnitPriceAfter1',
                                                'PriceDiscountUnitPriceAfter1',
                                                'PriceGroupDiscountUnitPriceAfter1',
                                                'PriceManualLineUnitPriceAfter1',
                                                'PriceTaxUnitPriceAfter1',
                                                'NPMCalcMessage',
                                            ]);
                                            if (uomTestState === 'baseline') {
                                                const UI_NPMCalcMessage = priceTSAs['NPMCalcMessage'];
                                                const baseline_NPMCalcMessage =
                                                    pricingData.testItemsValues.Uom[uomTestItem]['NPMCalcMessage'][
                                                        account
                                                    ][uomTestState];
                                                addContext(this, {
                                                    title: `State Args`,
                                                    value: `NPMCalcMessage from UI: ${JSON.stringify(
                                                        UI_NPMCalcMessage,
                                                    )}, NPMCalcMessage (at baseline) from Data: ${JSON.stringify(
                                                        baseline_NPMCalcMessage,
                                                    )}`,
                                                });
                                                expect(UI_NPMCalcMessage.length).equals(baseline_NPMCalcMessage.length);
                                            } else {
                                                const UI_NPMCalcMessage = priceTSAs['NPMCalcMessage'];
                                                const baseline_NPMCalcMessage =
                                                    pricingData.testItemsValues.Uom[uomTestItem]['NPMCalcMessage'][
                                                        account
                                                    ]['baseline'];
                                                const data_NPMCalcMessage =
                                                    pricingData.testItemsValues.Uom[uomTestItem]['NPMCalcMessage'][
                                                        account
                                                    ][uomTestState];
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
                                                    )}, \nNPMCalcMessage (at ${uomTestState}) from Data: ${JSON.stringify(
                                                        data_NPMCalcMessage,
                                                        null,
                                                        2,
                                                    )}`,
                                                });
                                                expect(UI_NPMCalcMessage.length).equals(
                                                    baseline_NPMCalcMessage.length + data_NPMCalcMessage.length,
                                                );
                                            }
                                            priceFields.forEach((priceField) => {
                                                const fieldValue = priceTSAs[priceField];
                                                const expectedFieldValue =
                                                    pricingData.testItemsValues.Uom[uomTestItem][priceField][account][
                                                        uomTestState
                                                    ];
                                                addContext(this, {
                                                    title: `${priceField}`,
                                                    value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                                });
                                                expect(fieldValue).equals(expectedFieldValue);
                                            });
                                            driver.sleep(0.2 * 1000);
                                        });
                                    });
                                    // switch (uomTestItem) {
                                    //     case 'Hair002':
                                    //         it(`Looking for "${uomTestItem}" using the search box`, async () => {});
                                    //         break;
                                    //     case 'Hair012':
                                    //         break;

                                    //     default:
                                    //         break;
                                    // }
                                });
                            });
                        });

                        describe('CART', function () {
                            it('entering and verifying being in cart', async function () {
                                await driver.click(orderPage.Cart_Button);
                                await orderPage.isSpinnerDone();
                                await orderPage.changeCartView('Grid');
                                screenShot = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `After "Line View" was selected`,
                                    value: 'data:image/png;base64,' + screenShot,
                                });
                                driver.sleep(1 * 1000);
                                await driver.untilIsVisible(orderPage.Cart_List_container);
                            });

                            // it(`switch to 'Grid View'`, async function () {
                            // });

                            it('verifying that the sum total of items in the cart is correct', async function () {
                                let numberOfItemsInCart = uomTestCartItems.length;
                                if (account === 'OtherAcc') {
                                    numberOfItemsInCart--;
                                }
                                screenShot = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `At Cart`,
                                    value: 'data:image/png;base64,' + screenShot,
                                });
                                const numberOfItemsElement = await driver.findElement(
                                    orderPage.Cart_Headline_Results_Number,
                                );
                                const itemsInCart = await numberOfItemsElement.getText();
                                // await driver.click(orderPage.HtmlBody);
                                await driver.click(orderPage.Cart_List_container);
                                driver.sleep(0.2 * 1000);
                                addContext(this, {
                                    title: `Number of Items in Cart`,
                                    value: `form UI: ${itemsInCart} , expected: ${numberOfItemsInCart}`,
                                });
                                expect(Number(itemsInCart)).to.equal(numberOfItemsInCart);
                                driver.sleep(1 * 1000);
                            });

                            uomTestCartItems.forEach((uomTestCartItem) => {
                                it(`${
                                    uomTestCartItem.name.includes('Free') && account === 'OtherAcc'
                                        ? 'no additional item found'
                                        : `checking item "${uomTestCartItem.name}"`
                                }`, async function () {
                                    const state = '4 Box';
                                    const uomTestCartItemSplited = uomTestCartItem.name.split(' ');
                                    const itemName = uomTestCartItemSplited[0];
                                    const isFreePlusUOM = uomTestCartItemSplited[1];
                                    let totalUnitsAmount: number;
                                    let priceTSAs;
                                    switch (true) {
                                        case isFreePlusUOM != undefined:
                                            if (account === 'Acc01') {
                                                totalUnitsAmount = await pricingService.getItemTotalAmount(
                                                    'Cart',
                                                    itemName,
                                                );
                                                priceTSAs = await pricingService.getItemTSAs('Cart', itemName);
                                            } else {
                                                totalUnitsAmount = 0;
                                                const additionalItems = await driver.isElementVisible(
                                                    orderPage.getSelectorOfFreeItemInCartByName(''),
                                                );
                                                expect(additionalItems).equals(false);
                                            }
                                            break;

                                        default:
                                            totalUnitsAmount = await pricingService.getItemTotalAmount(
                                                'Cart',
                                                itemName,
                                            );
                                            priceTSAs = await pricingService.getItemTSAs('Cart', itemName);
                                            break;
                                    }
                                    if (totalUnitsAmount > 0) {
                                        console.info(`Cart ${itemName} totalUnitsAmount: ${totalUnitsAmount}`);
                                        console.info(`priceTSAs:`, JSON.stringify(priceTSAs, null, 2));
                                        addContext(this, {
                                            title: `Total Units amount of item`,
                                            value: `form UI: ${totalUnitsAmount} , expected: ${uomTestCartItem.amount}`,
                                        });
                                        priceFields.forEach((priceField) => {
                                            const expectedValue =
                                                pricingData.testItemsValues.Uom[itemName][priceField][account][
                                                    isFreePlusUOM ? 'cart' : state
                                                ];
                                            addContext(this, {
                                                title: `TSA field "${priceField}" Values`,
                                                value: `form UI: ${priceTSAs[priceField]} , expected: ${expectedValue}`,
                                            });
                                            expect(priceTSAs[priceField]).equals(expectedValue);
                                        });
                                        expect(totalUnitsAmount).equals(uomTestCartItem.amount);
                                    }
                                    driver.sleep(1 * 1000);
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
