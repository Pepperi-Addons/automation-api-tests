import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService, { ConsoleColors } from '../../../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Browser } from '../../../utilities/browser';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppTopBar } from '../../../pom';
import { ObjectsService } from '../../../../services';
import { OrderPage } from '../../../pom/Pages/OrderPage';
import { PricingData05 } from '../../../pom/addons/PricingData05';
import { PricingData06 } from '../../../pom/addons/PricingData06';
import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import { PricingService } from '../../../../services/pricing.service';
import PricingRules from '../../../pom/addons/PricingRules';

chai.use(promised);

export async function PricingBaseTests(
    email: string,
    password: string,
    client: Client,
    specificVersion: 'version07for05data' | undefined = undefined,
) {
    /*
_________________ 
_________________ Brief:
            
* Basic Pricing tests
* Pricing is calculated according to Configuration and matching rules that are hosted at "PPM_Values" UDT
* 7 selected test items (some has rules applied to them and other don't), 2 test accounts, 5 test states, 5 pricing fields (Base, Discount, Group Discount, Manual Line, Tax)
* for each of the accounts, then each of the states - every one of the items UI values are being retrieved and compared with expected data (that is held in an object pricingData)
_________________ 
_________________ The Relevant Rules:
            
. 'ZBASE@A002@Acc01@Frag005': 
'[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",10,"P"]]]]',

. 'ZBASE@A002@Acc01@ToBr56': 
'[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",22,"P"]]]]',

. 'ZBASE@A001@ToBr56': 
'[[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",50,"P"]]]]',

. 'ZBASE@A001@Frag012':  
'[[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",20,"P"]]]]',

. 'ZBASE@A003@Acc01@Pharmacy':  
'[[true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",30,"P"]]]]',

. 'ZDS1@A001@ToBr56':   
'[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[2,"D",20,"%"]]]]',

. 'ZDS1@A001@Spring Loaded Frizz-Fighting Conditioner':
'[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[2,"D",5,"%"],[5,"D",10,"%"],[20,"D",15,"%"]]]]',

. 'MTAX@A002@Acc01@Frag005': 
'[[true,"1555891200000","2534022144999","1","1","MTAX_A002",[[0,"I",17,"%"]]]]',

. 'MTAX@A002@Acc01@Frag012': 
'[[true,"1555891200000","2534022144999","1","1","MTAX_A002",[[0,"I",17,"%"]]]]',

_________________ 
_________________ Order Of Actions:
            
1. Looping over accounts

    2. Looping over states

        3. At Order Center: Looping over items
        ----> retrieving pricing fields values from UI and comparing to expected data ( pricingData.testItemsValues.Base[item.name][priceField][account][state] )

        4. At Cart (for each state apart of "baseline"): Looping over items
        ----> same check as at order center

_________________ 
_________________ 
 */
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const installedPricingVersionLong = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'pricing',
    )?.Version;
    const installedPricingVersion = installedPricingVersionLong?.split('.')[1];
    console.info('Installed Pricing Version: 0.', JSON.stringify(installedPricingVersion, null, 2));
    const pricingData =
        installedPricingVersion === '5'
            ? new PricingData05()
            : specificVersion === 'version07for05data'
            ? new PricingData05()
            : new PricingData06();
    const pricingRules = new PricingRules();
    let ppmValues_content;
    switch (installedPricingVersion) {
        case '5':
            console.info('AT installedPricingVersion CASE 5');
            ppmValues_content = pricingRules.version05;
            break;

        case '6':
            console.info('AT installedPricingVersion CASE 6');
            ppmValues_content = pricingRules.version06;
            break;

        case '7':
            console.info('AT installedPricingVersion CASE 7');
            ppmValues_content =
                specificVersion === 'version07for05data' ? pricingRules.version05 : pricingRules.version07;
            break;

        default:
            console.info('AT installedPricingVersion Default');
            ppmValues_content = pricingRules.version07;
            break;
    }

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
    let base64ImageComponent;
    let duration: string;
    let ppmValues: UserDefinedTableRow[];

    const testAccounts = ['Acc01', 'OtherAcc'];
    const testStates = ['baseline', '1unit', '3units', '1case(6units)', '4cases(24units)'];
    const testItems = [
        { name: 'Lipstick no.1', cartAmount: 24 },
        { name: 'Spring Loaded Frizz-Fighting Conditioner', cartAmount: 24 },
        { name: 'Frag005', cartAmount: 24 },
        { name: 'Frag012', cartAmount: 24 },
        { name: 'ToBr56', cartAmount: 24 },
        { name: 'Drug0001', cartAmount: 24 },
        { name: 'Drug0003', cartAmount: 24 },
    ];
    const priceFields = [
        'PriceBaseUnitPriceAfter1',
        'PriceDiscountUnitPriceAfter1',
        'PriceGroupDiscountUnitPriceAfter1',
        'PriceManualLineUnitPriceAfter1',
        'PriceTaxUnitPriceAfter1',
    ];

    describe(`Pricing ** Base ** UI tests | Ver ${installedPricingVersionLong}`, () => {
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
            await driver.close();
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

        it('validating "PPM_Values" via API', async function () {
            const expectedPPMValuesLength = Object.keys(ppmValues_content).length + pricingRules.dummyPPM_Values_length;
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
            describe(`ACCOUNT "${account == 'Acc01' ? 'My Store' : 'Account for order scenarios'}"`, () => {
                it('Creating new transaction', async function () {
                    switch (account) {
                        case 'Acc01':
                            accountName = 'My Store';
                            transactionUUID_Acc01 = await pricingService.startNewSalesOrderTransaction(accountName);
                            console.info('transactionUUID_Acc01:', transactionUUID_Acc01);
                            break;

                        default:
                            accountName = 'Account for order scenarios';
                            transactionUUID_OtherAcc = await pricingService.startNewSalesOrderTransaction(accountName);
                            console.info('transactionUUID_OtherAcc:', transactionUUID_OtherAcc);
                            break;
                    }
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `New Slaes Order trasaction started`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it(`PERFORMANCE: making sure Sales Order Loading Duration is acceptable`, async function () {
                    let limit: number;
                    switch (installedPricingVersion) {
                        case '5':
                        case '6':
                            limit = 650;
                            break;

                        default:
                            limit = 600;
                            break;
                    }
                    duration = await (await driver.findElement(orderPage.Duration_Span)).getAttribute('title');
                    console.info(`DURATION at Sales Order Load: ${duration}`);
                    addContext(this, {
                        title: `Sales Order - Loading Time`,
                        value: `${duration} ms`,
                    });
                    const duration_num = Number(duration);
                    expect(typeof duration_num).equals('number');
                    expect(duration_num).to.be.below(limit);
                });

                it(`switch to 'Line View'`, async function () {
                    await orderPage.changeOrderCenterPageView('Line View');
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `After "Line View" was selected`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                testStates.forEach((state) => {
                    describe(`ORDER CENTER "${state}"`, () => {
                        testItems.forEach((item) => {
                            it(`checking item "${item.name}"`, async function () {
                                await pricingService.searchInOrderCenter.bind(this)(item.name, driver);
                                switch (
                                    state //'baseline', '1unit', '3units', '1case(6units)', '4cases(24units)'
                                ) {
                                    case '1unit':
                                        await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                            this,
                                        )('Each', item.name, 1, driver);
                                        duration = await (
                                            await driver.findElement(orderPage.Duration_Span)
                                        ).getAttribute('title');
                                        console.log(`DURATION after Quantity change (to 1 unit): ${duration}`, [
                                            ConsoleColors.PageMessage,
                                        ]);
                                        break;
                                    case '3units':
                                        await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                            this,
                                        )('Each', item.name, 3, driver);
                                        duration = await (
                                            await driver.findElement(orderPage.Duration_Span)
                                        ).getAttribute('title');
                                        console.log(`DURATION after Quantity change (to 3 units): ${duration}`, [
                                            ConsoleColors.PageMessage,
                                        ]);
                                        break;
                                    case '1case(6units)':
                                        await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                            this,
                                        )('Case', item.name, 1, driver);
                                        duration = await (
                                            await driver.findElement(orderPage.Duration_Span)
                                        ).getAttribute('title');
                                        console.log(`DURATION after Quantity change (to 1 case): ${duration}`, [
                                            ConsoleColors.PageMessage,
                                        ]);
                                        break;
                                    case '4cases(24units)':
                                        await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                            this,
                                        )('Case', item.name, 4, driver);
                                        duration = await (
                                            await driver.findElement(orderPage.Duration_Span)
                                        ).getAttribute('title');
                                        console.log(`DURATION after Quantity change (to 4 cases): ${duration}`, [
                                            ConsoleColors.PageMessage,
                                        ]);
                                        break;

                                    default:
                                        break;
                                }
                                addContext(this, {
                                    title: `Duration - After Change quantity of ${item.name}`,
                                    value: `${duration} ms`,
                                });
                                const priceTSAs = await pricingService.getItemTSAs('OrderCenter', item.name);
                                console.info(`${item.name} ${state} priceTSAs:`, priceTSAs);

                                expect(typeof priceTSAs).equals('object');
                                expect(Object.keys(priceTSAs)).to.eql([
                                    'PriceBaseUnitPriceAfter1',
                                    'PriceDiscountUnitPriceAfter1',
                                    'PriceGroupDiscountUnitPriceAfter1',
                                    'PriceManualLineUnitPriceAfter1',
                                    'PriceTaxUnitPriceAfter1',
                                    'NPMCalcMessage',
                                ]);
                                let expectedNPMCalcMessageLength;
                                switch (state) {
                                    case 'baseline':
                                        expectedNPMCalcMessageLength =
                                            pricingData.testItemsValues.Base[item.name]['NPMCalcMessage'][account][
                                                state
                                            ].length;
                                        expect(priceTSAs['NPMCalcMessage'].length).equals(expectedNPMCalcMessageLength);
                                        break;

                                    default:
                                        expectedNPMCalcMessageLength =
                                            pricingData.testItemsValues.Base[item.name]['NPMCalcMessage'][account][
                                                'baseline'
                                            ].length +
                                            pricingData.testItemsValues.Base[item.name]['NPMCalcMessage'][account][
                                                state
                                            ].length;
                                        expect(priceTSAs['NPMCalcMessage'].length).equals(expectedNPMCalcMessageLength);
                                        break;
                                }
                                priceFields.forEach((priceField) => {
                                    const expectedValue =
                                        pricingData.testItemsValues.Base[item.name][priceField][account][state];
                                    expect(priceTSAs[priceField]).equals(expectedValue);
                                });
                                driver.sleep(0.2 * 1000);
                                await pricingService.clearOrderCenterSearch();
                            });
                        });
                    });

                    switch (state) {
                        case 'baseline':
                            break;

                        default:
                            describe(`CART "${state}"`, () => {
                                it('entering and verifying being in cart', async function () {
                                    await driver.click(orderPage.Cart_Button);
                                    await orderPage.isSpinnerDone();
                                    driver.sleep(1 * 1000);
                                    await driver.untilIsVisible(orderPage.Cart_List_container);
                                });
                                it(`switch to 'Grid View'`, async function () {
                                    await orderPage.changeCartView('Grid');
                                    base64ImageComponent = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `After "Line View" was selected`,
                                        value: 'data:image/png;base64,' + base64ImageComponent,
                                    });
                                });
                                it('verify that the sum total of items in the cart is correct', async function () {
                                    base64ImageComponent = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `At Cart`,
                                        value: 'data:image/png;base64,' + base64ImageComponent,
                                    });
                                    const itemsInCart = await (
                                        await driver.findElement(orderPage.Cart_Headline_Results_Number)
                                    ).getText();
                                    driver.sleep(0.2 * 1000);
                                    expect(Number(itemsInCart)).to.equal(testItems.length);
                                    driver.sleep(1 * 1000);
                                });
                                testItems.forEach(async (item) => {
                                    it(`checking item "${item.name}"`, async function () {
                                        const totalUnitsAmount = await pricingService.getItemTotalAmount(
                                            'Cart',
                                            item.name,
                                        );
                                        const priceTSAs = await pricingService.getItemTSAs('Cart', item.name);
                                        console.info(`Cart ${item.name} totalUnitsAmount:`, totalUnitsAmount);
                                        console.info(`priceTSAs:`, priceTSAs);
                                        const expectedAmount =
                                            state === '1unit'
                                                ? 1
                                                : state === '3units'
                                                ? 3
                                                : state === '1case(6units)'
                                                ? 6
                                                : item.cartAmount;
                                        addContext(this, {
                                            title: `Total Units Amount`,
                                            value: `From UI: ${totalUnitsAmount}, expected: ${expectedAmount}`,
                                        });
                                        // expect(totalUnitsAmount).equals(expectedAmount);
                                        priceFields.forEach((priceField) => {
                                            const expextedValue =
                                                pricingData.testItemsValues.Base[item.name][priceField][account][state];
                                            expect(priceTSAs[priceField]).equals(expextedValue);
                                        });
                                    });
                                });
                                describe('back to Order Center and switch to Line View', () => {
                                    it('Click "Continue ordering" button', async function () {
                                        await driver.click(orderPage.Cart_ContinueOrdering_Button);
                                        await orderPage.isSpinnerDone();
                                        await orderPage.changeOrderCenterPageView('Line View');
                                        await orderPage.isSpinnerDone();
                                        base64ImageComponent = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `After "Line View" was selected`,
                                            value: 'data:image/png;base64,' + base64ImageComponent,
                                        });
                                        await driver.untilIsVisible(orderPage.getSelectorOfItemInOrderCenterByName(''));
                                        driver.sleep(1 * 1000);
                                        base64ImageComponent = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `Order Center - Loaded`,
                                            value: 'data:image/png;base64,' + base64ImageComponent,
                                        });
                                    });
                                });
                            });
                            break;
                    }
                });
            });
        });
        describe('Return to HomePage', () => {
            it('Go Home', async function () {
                await webAppHeader.goHome();
                driver.sleep(1 * 1000);
            });
        });

        describe('Cleanup', () => {
            it('Deleting all Activities', async () => {
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
