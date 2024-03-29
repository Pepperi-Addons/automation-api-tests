import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Browser } from '../../../utilities/browser';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppTopBar } from '../../../pom';
import { OrderPage } from '../../../pom/Pages/OrderPage';
import { PricingService } from '../../../../services/pricing.service';
import { PricingData06 } from '../../../pom/addons/PricingData06';
import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import { ObjectsService } from '../../../../services';
import PricingRules from '../../../pom/addons/PricingRules';

chai.use(promised);

export async function PricingPartialValueTests(email: string, password: string, client: Client) {
    /*
_________________ 
_________________ Brief:
    
* Pricing Partial Value
* at the account level there is a string definition (field "PricingHierarchy" on account Edit - value: 100020030)  
* there is an option at configuration to define a length of the main string as "table" by itself at the condition level, the code:
* 
* PPM_Conditions: [
    .
    .
    .
    {
        Key: 'ZDH1',
        Name: 'ZDH1 Hierarchy Discount',
        TablesSearchOrder: [
            { Name: 'A011' },
            { Name: 'A011', Keys: [{ Name: 'TransactionAccountTSAPricingHierarchy', Split: 7 }] },
            { Name: 'A011', Keys: [{ Name: 'TransactionAccountTSAPricingHierarchy', Split: 4 }] },
        ],
    },
],

* UDT rules are defined with the actual partial string as a key (for example: 'ZDH1@A011@1000200@Frag008' , the third key is a 7 letter partial value)

* the test agenda is to 
_________________ 
_________________ The Relevant Rules:
    
. 'ZDH1@A011@1000@Frag006':
    '[[true,"1555891200000","2534022144999","1","","ZDH1_A011 (4 Letters)",[[10,"D",20,"%"]],"EA"]]',

. 'ZDH1@A011@1000200@Frag008':
    '[[true,"1555891200000","2534022144999","1","","ZDH1_A011 (7 Letters)",[[10,"D",30,"%"]],"EA"]]',

. 'ZDH1@A011@100020030@Frag009':
    '[[true,"1555891200000","2534022144999","1","","ZDH1_A011 (9 Letters - full)",[[10,"D",10,"%"]],"EA"]]',

. 'ZDH1@A011@100020030@Frag011':
    '[[true,"1555891200000","2534022144999","1","","ZDH1_A011 (9 Letters - full)",[[10,"D",10,"%"]],"EA"]]',

. 'ZDH1@A011@1000200@Frag011':
    '[[true,"1555891200000","2534022144999","1","","ZDH1_A011 (7 Letters)",[[10,"D",30,"%"]],"EA"]]',

_________________ 
_________________ Order Of Actions:
    
1. MakeUp001 - clicking plus button once
2. MakeUp002 - clicking plus button once
3. MakeUp003 - changing value to 1
----> checking that discount for total of 3 group items is applied

_________________ 
_________________ 
*/
    const dateTime = new Date();
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const pricingData = new PricingData06();
    const pricingRules = new PricingRules();

    const installedPricingVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'pricing',
    )?.Version;
    const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    console.info('Installed Pricing Version: ', JSON.stringify(installedPricingVersion, null, 2));

    let ppmValues_content;
    switch (installedPricingVersionShort) {
        case '6':
            console.info('AT installedPricingVersion CASE 6');
            ppmValues_content = pricingRules.version06;
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
    let transactionUUID: string;
    let accountName: string;
    let duration: string;
    let ppmValues: UserDefinedTableRow[];
    let base64ImageComponent;

    const testAccounts = ['Acc01', 'OtherAcc'];
    const partialValueTestItems = ['Frag006', 'Frag008', 'Frag009', 'Frag011', 'Frag021'];
    const partialValueCartTestItemsSets = [
        ['Frag021', 'Frag011', 'Frag009'],
        ['Frag008', 'Frag006'],
    ];
    const partialValueTestStates = [
        'baseline',
        '9 Each',
        '10 Each',
        '11 Each',
        '10 Each',
        '9 Each',
        '0 Each',
        '1 Case',
        '2 Case',
        '3 Case',
        '2 Case',
        '1 Case',
        '1 Box',
        '2 Box',
        '1 Box',
    ];
    const pricePartialFields = ['PricePartial'];

    if (installedPricingVersionShort !== '5') {
        describe(`Pricing ** Partial Value ** UI tests  - ${
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

            it('Manual Sync', async function () {
                await webAppHomePage.manualResync(client);
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
                describe(`ACCOUNT "My Store"`, function () {
                    it('Creating new transaction', async function () {
                        account == 'Acc01' ? (accountName = 'My Store') : (accountName = 'Account for order scenarios');
                        transactionUUID = await pricingService.startNewSalesOrderTransaction(accountName);
                        console.info('transactionUUID:', transactionUUID);
                        await orderPage.changeOrderCenterPageView('Line View');
                    });

                    it(`PERFORMANCE: making sure Sales Order Loading Duration is acceptable`, async function () {
                        let limit: number;
                        switch (installedPricingVersionShort) {
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
                            title: `Sales Order - Loading Time, Version 0.${installedPricingVersionShort}`,
                            value: `Duration: ${duration} ms (limit: ${limit})`,
                        });
                        const duration_num = Number(duration);
                        expect(typeof duration_num).equals('number');
                        expect(duration_num).to.be.below(limit);
                    });

                    describe('Partial Value', () => {
                        it('Navigating to "Great Perfumes" at Sidebar', async function () {
                            await driver.untilIsVisible(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                            await driver.click(
                                orderPage.getSelectorOfSidebarSectionInOrderCenterByName('Great Perfumes'),
                            );
                            driver.sleep(0.1 * 1000);
                        });
                        partialValueTestItems.forEach((partialValueTestItem) => {
                            describe(`Item: ***${partialValueTestItem}`, function () {
                                describe('ORDER CENTER', function () {
                                    it(`Looking for "${partialValueTestItem}" using the search box`, async function () {
                                        await pricingService.searchInOrderCenter.bind(this)(
                                            partialValueTestItem,
                                            driver,
                                        );
                                        driver.sleep(1 * 1000);
                                    });
                                    partialValueTestStates.forEach((partialValueTestState) => {
                                        it(`Checking "${partialValueTestState}"`, async function () {
                                            if (partialValueTestState != 'baseline') {
                                                const splitedStateArgs = partialValueTestState.split(' ');
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
                                                    partialValueTestItem,
                                                    amount,
                                                    driver,
                                                    chosenUom === 'Each' ? '2' : undefined,
                                                );
                                            }
                                            const pricePartialTSAs = await pricingService.getTSAsOfPartialPerItem(
                                                'OrderCenter',
                                                partialValueTestItem,
                                            );

                                            const NPMCalcMessage = await pricingService.getItemNPMCalcMessage(
                                                'OrderCenter',
                                                partialValueTestItem,
                                            );
                                            console.info(
                                                `${partialValueTestItem} ${partialValueTestItem} NPMCalcMessage:`,
                                                NPMCalcMessage,
                                            );
                                            addContext(this, {
                                                title: `NPM Calc Message:`,
                                                value: `NPMCalcMessage: ${JSON.stringify(NPMCalcMessage, null, 2)}`,
                                            });

                                            expect(typeof pricePartialTSAs).equals('object');
                                            expect(Object.keys(pricePartialTSAs)).to.eql(['PricePartial']);
                                            pricePartialFields.forEach((priceField) => {
                                                const fieldValue = pricePartialTSAs[priceField];
                                                const expectedFieldValue =
                                                    pricingData.testItemsValues.Partial[partialValueTestItem][
                                                        priceField
                                                    ][account][partialValueTestState]['expectedValue'];
                                                const expectedRules =
                                                    pricingData.testItemsValues.Partial[partialValueTestItem][
                                                        priceField
                                                    ][account][partialValueTestState]['rules'];
                                                addContext(this, {
                                                    title: `${priceField}`,
                                                    value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                                });
                                                console.info(
                                                    `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                                                );
                                                expectedRules.forEach((expectedRule, index) => {
                                                    const udtKey = expectedRule.split(`' ->`)[0].replace(`'`, '');
                                                    const udtRuleValueObj: UserDefinedTableRow | undefined =
                                                        ppmValues.find((listing) => {
                                                            if (listing.MainKey === udtKey) return listing;
                                                        });
                                                    console.info(
                                                        `Expected Rule: ${expectedRule}\nUDT Rule: ${udtKey}: ${
                                                            udtRuleValueObj
                                                                ? udtRuleValueObj['Values']
                                                                : 'Key not found'
                                                        }`,
                                                    );
                                                    addContext(this, {
                                                        title: `Rule number ${index}:`,
                                                        value: `Expected Rule: ${expectedRule}\nUDT Rule: ${udtKey}: ${
                                                            udtRuleValueObj
                                                                ? udtRuleValueObj['Values']
                                                                : 'Key not found'
                                                        }`,
                                                    });
                                                });
                                            });

                                            const expectedPricePartial =
                                                pricingData.testItemsValues.Partial[partialValueTestItem][
                                                    'PricePartial'
                                                ][account][partialValueTestState]['expectedValue'];
                                            const actualPricePartial = pricePartialTSAs['PricePartial'];
                                            expect(actualPricePartial).equals(expectedPricePartial);
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
                                const numberOfItemsInCart = partialValueTestItems.length;
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
                            partialValueCartTestItemsSets.forEach((partialValueCartTestItems, index) => {
                                it(`filtering cart using smart filter Item External ID - Group ${
                                    index + 1
                                }`, async function () {
                                    await driver.click(orderPage.Cart_SmartFilter_ItemExternalID);
                                    driver.sleep(0.3 * 1000);
                                    partialValueCartTestItems.forEach(async (partialValueTestCartItem) => {
                                        await driver.click(
                                            orderPage.getSelectorOfCheckboxOfSmartFilterItemExternalIdAtCartByText(
                                                partialValueTestCartItem,
                                            ),
                                        );
                                        driver.sleep(0.3 * 1000);
                                    });
                                    await driver.untilIsVisible(orderPage.Cart_SmartFilter_ApplyButton);
                                    await driver.click(orderPage.Cart_SmartFilter_ApplyButton);
                                    await orderPage.isSpinnerDone();
                                    driver.sleep(2 * 1000);
                                    const itemsInCart = await (
                                        await driver.findElement(orderPage.Cart_Headline_Results_Number)
                                    ).getText();
                                    driver.sleep(0.2 * 1000);
                                    base64ImageComponent = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `After Smart Filter Activated`,
                                        value: 'data:image/png;base64,' + base64ImageComponent,
                                    });
                                    addContext(this, {
                                        title: `After Smart Filter - Number of Items in Cart`,
                                        value: `form UI: ${itemsInCart} , expected: ${partialValueCartTestItems.length}`,
                                    });
                                    expect(Number(itemsInCart)).to.equal(partialValueCartTestItems.length);
                                });
                                partialValueCartTestItems.forEach((partialValueTestCartItem) => {
                                    it(`checking item "${partialValueTestCartItem}"`, async function () {
                                        const pricePartialTSAs = await pricingService.getTSAsOfPartialPerItem(
                                            'Cart',
                                            partialValueTestCartItem,
                                            undefined,
                                            undefined,
                                            'LinesView',
                                        );
                                        const totalUnitsAmount = await pricingService.getItemTotalAmount(
                                            'Cart',
                                            partialValueTestCartItem,
                                            undefined,
                                            undefined,
                                            'LinesView',
                                        );
                                        const expectedPricePartial =
                                            pricingData.testItemsValues.Partial[partialValueTestCartItem][
                                                'PricePartial'
                                            ]['cart'][account];
                                        const actualPricePartial = pricePartialTSAs['PricePartial'];
                                        const expectedTotalUnitsAmount =
                                            pricingData.testItemsValues.Partial[partialValueTestCartItem]['Cart'][
                                                account
                                            ];
                                        console.info(
                                            `Cart ${partialValueTestCartItem} totalUnitsAmount: ${totalUnitsAmount}`,
                                        );
                                        expect(totalUnitsAmount).equals(expectedTotalUnitsAmount);
                                        expect(actualPricePartial).equals(expectedPricePartial);
                                        driver.sleep(1 * 1000);
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
                                    base64ImageComponent = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `After Smart Filter Cleared`,
                                        value: 'data:image/png;base64,' + base64ImageComponent,
                                    });
                                    addContext(this, {
                                        title: `After Smart Filter Cleared - Number of Items in Cart`,
                                        value: `form UI: ${itemsInCart} , expected: ${partialValueTestItems.length}`,
                                    });
                                    expect(Number(itemsInCart)).to.equal(partialValueTestItems.length);
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
