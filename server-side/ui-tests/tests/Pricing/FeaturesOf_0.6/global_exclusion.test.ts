import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it, before, after } from 'mocha';
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
import { PricingDataNoUom } from '../../../pom/addons/PricingDataNoUom';

chai.use(promised);

export async function PricingGlobalExclusionTests(
    email: string,
    password: string,
    client: Client,
    specialTestData?: 'noUom',
) {
    /*
________________________ 
_________________ Brief:
 
* Pricing Exclusion Rules
* once a condition is met - other rules which are difined excluded will be over-looked
* the definition at configuration:
* 
* PPM_CalcProcedures: [
    {
        .
        .
        .
        ExclusionRules: [
            {
                Condition: 'ZDS4',
                ExcludeConditions: ['ZDS6', 'ZDS7'],
            },
            {
                Condition: 'ZDS1',
                ExcludeConditions: ['ZDS6'],
            },
        ],
        .
        .
        .
    }
* 
* exclusion can be defined between conditions that are operated through the same block, or through different blocks
*  'ZDS1' & 'ZDS6' belong to different blocks
*  'ZDS4' & 'ZDS6' & 'ZDS7' belong to the same block
* 
* the test agenda is to check that at the same NPMCalcMessage 2 rules that are excluding one another will never show together
*
______________________________________ 
_________________ The Relevant Blocks:
            
. 'Discount' -> ['ZDS1', 'ZDS2', 'ZDS3']
. 'Discount2' -> ['ZDS4', 'ZDS5', 'ZDS6', 'ZDS7']

__________________________________________ 
_________________ The Relevant Conditions:
            
. 'ZDS1' -> ['A001', 'A002', 'A003']
. 'ZDS4' -> ['A001']
. 'ZDS6' -> ['A003', 'A004', 'A001']
. 'ZDS7' -> ['A002', 'A004', 'A005']

______________________________________ 
_________________ The Relevant Tables:
    
. 'A001' -> ['ItemExternalID']
. 'A002' -> ['TransactionAccountExternalID', 'ItemExternalID']
. 'A003' -> ['TransactionAccountExternalID', 'ItemMainCategory']
. 'A004' -> ['TransactionAccountExternalID']
. 'A005' -> ['ItemMainCategory']

________________________________ 
____________ The Relevant Rules:
 
. 'ZDS4@A001@PMS-03-FBC6_l_2': 
    '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[275,"D",20,"%"]]]]',

. 'ZDS7@A005@Paul Pitchell': 
    '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[250,"D",10,"%"]]]]',

. 'ZDS7@A002@Acc01@PMS-03-FBC6_l_2':
    '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[260,"D",25,"%"]]]]',

. 'ZDS7@A004@Account for order scenarios':
    '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[255,"D",15,"%"]]]]',

. 'ZDS7@A002@Account for order scenarios@MaLi36':
    '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[260,"D",40,"%"]]]]',

. 'ZDS1@A002@Acc01@Frag008':
    '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[260,"D",40,"%"]]]]',

. 'ZDS6@A004@Acc01': 
    '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[260,"D",40,"%"]]]]',

. 'ZDS6@A001@Frag008': 
    '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[255,"D",40,"%"]]]]',

. 'ZDS6@A003@Acc01@Paul Pitchell':
            '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[260,"D",40,"%"]]]]',

____________ 
____________ Order Of Actions:
           
   1. Looping over accounts
 
       2. At Order Center: Looping over items
 
           2.1. Looping over states
           ----> retrieving pricing fields values from UI and comparing to expected data 
                    ( pricingData.testItemsValues.Exclusion[exclusionRulesTestItem][account][exclusionRulesTestState][priceField] )
           ----> deep equaly comparing NPMCalcMessage
 
       3. At Cart: Looping over items
       ----> same check as at order center (just for the last state that OC got to)
 
_____________________________________________________________________________________________________________________________________________________________ 
_____________________________________________________________________________________________________________________________________________________________ 
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
    let transactionUUID_Acc01: string;
    let transactionUUID_OtherAcc: string;
    let accountName: string;
    let duration: string;
    let ppmValues: UserDefinedTableRow[];
    let base64ImageComponent;

    const testAccounts = ['Acc01', 'OtherAcc'];
    const exclusionRulesTestItems = ['PMS-03-FBC6_l_2', 'MaLi36', 'Frag008'];
    const exclusionRulesTestStates = [
        'baseline',
        '250 Each',
        '253 Each',
        '255 Each',
        '260 Each',
        '275 Each',
        '42 Case', // 252 units
        '43 Case', // 258 units
        '45 Case', // 270 units
        '46 Case', // 276 units
        '10 Box', // 240 units
        '11 Box', // 264 units
        '12 Box', // 288 units
    ];

    const priceExclusionDiscountFields = ['PriceDiscount2UnitPriceAfter1'];

    if (!installedPricingVersion?.startsWith('0.5')) {
        describe(`Pricing ** Exclusion Rules ** UI tests  - ${
            client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
        } | Ver ${installedPricingVersion} | Date Time: ${dateTime}`, () => {
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

            it('If Error popup appear - close it', async function () {
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

                    describe('Exclusion Rules', () => {
                        exclusionRulesTestItems.forEach((exclusionRulesTestItem) => {
                            describe(`Item: ***${exclusionRulesTestItem}`, function () {
                                describe('ORDER CENTER', function () {
                                    it(`Looking for "${exclusionRulesTestItem}" using the search box`, async function () {
                                        await pricingService.searchInOrderCenter.bind(this)(
                                            exclusionRulesTestItem,
                                            driver,
                                        );
                                        driver.sleep(1 * 1000);
                                    });
                                    exclusionRulesTestStates.forEach((exclusionRulesTestState) => {
                                        it(`Checking "${exclusionRulesTestState}"`, async function () {
                                            if (exclusionRulesTestState != 'baseline') {
                                                const splitedStateArgs = exclusionRulesTestState.split(' ');
                                                const chosenUom = splitedStateArgs[1];
                                                const amount = Number(splitedStateArgs[0]);
                                                addContext(this, {
                                                    title: `State Args`,
                                                    value: `Chosen UOM: ${chosenUom}, Amount: ${amount}`,
                                                });
                                                await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                    this,
                                                )(chosenUom, exclusionRulesTestItem, amount, driver);
                                            }
                                            const NPMCalcMessage = await pricingService.getItemNPMCalcMessage(
                                                'OrderCenter',
                                                exclusionRulesTestItem,
                                            );
                                            console.info(
                                                `${exclusionRulesTestItem} ${exclusionRulesTestItem} NPMCalcMessage:`,
                                                NPMCalcMessage,
                                            );
                                            expect(typeof NPMCalcMessage).equals('object');
                                            expect(Object.keys(NPMCalcMessage)).to.eql(['NPMCalcMessage']);

                                            const priceTSA_Discount2 = await pricingService.getItemTSAs_Discount2(
                                                'OrderCenter',
                                                exclusionRulesTestItem,
                                            );
                                            console.info(
                                                `${exclusionRulesTestItem} ${exclusionRulesTestState} priceTSA_Discount2:`,
                                                priceTSA_Discount2,
                                            );
                                            expect(typeof priceTSA_Discount2).equals('object');
                                            expect(Object.keys(priceTSA_Discount2)).to.eql(
                                                priceExclusionDiscountFields,
                                            );

                                            const UI_NPMCalcMessage = NPMCalcMessage['NPMCalcMessage'];
                                            const data_NPMCalcMessage =
                                                pricingData.testItemsValues.Exclusion[exclusionRulesTestItem][account][
                                                    exclusionRulesTestState
                                                ]['NPMCalcMessage'];
                                            addContext(this, {
                                                title: `NPMCalcMessage (at ${exclusionRulesTestState})`,
                                                value: `From UI  : ${JSON.stringify(
                                                    UI_NPMCalcMessage,
                                                    null,
                                                    2,
                                                )}, \nFrom Data: ${JSON.stringify(data_NPMCalcMessage, null, 2)}`,
                                            });
                                            expect(UI_NPMCalcMessage.length).equals(data_NPMCalcMessage.length);
                                            expect(UI_NPMCalcMessage).eql(data_NPMCalcMessage);

                                            priceExclusionDiscountFields.forEach((priceField) => {
                                                const fieldValue = priceTSA_Discount2[priceField];
                                                const expectedFieldValue =
                                                    pricingData.testItemsValues.Exclusion[exclusionRulesTestItem][
                                                        account
                                                    ][exclusionRulesTestState][priceField];
                                                addContext(this, {
                                                    title: `${priceField}`,
                                                    value: `Field Value from UI           : ${fieldValue} \nExpected Field Value from Data: ${expectedFieldValue}`,
                                                });
                                                expect(fieldValue).equals(expectedFieldValue);
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
                                const numberOfItemsInCart = exclusionRulesTestItems.length;
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
                            exclusionRulesTestItems.forEach((exclusionRulesTestCartItem) => {
                                it(`checking item "${exclusionRulesTestCartItem}"`, async function () {
                                    const NPMCalcMessage = await pricingService.getItemNPMCalcMessage(
                                        'Cart',
                                        exclusionRulesTestCartItem,
                                        undefined,
                                        undefined,
                                        'LinesView',
                                    );
                                    const totalUnitsAmount = await pricingService.getItemTotalAmount(
                                        'Cart',
                                        exclusionRulesTestCartItem,
                                        undefined,
                                        undefined,
                                        'LinesView',
                                    );
                                    const priceTSA_Discount2 = await pricingService.getItemTSAs_Discount2(
                                        'Cart',
                                        exclusionRulesTestCartItem,
                                        undefined,
                                        undefined,
                                        'LinesView',
                                    );
                                    const expectedNPMCalcMessage =
                                        pricingData.testItemsValues.Exclusion[exclusionRulesTestCartItem][account][
                                            'cart'
                                        ]['NPMCalcMessage'];
                                    console.info(
                                        `Cart NPMCalcMessage \nFrom UI : ${JSON.stringify(
                                            NPMCalcMessage['NPMCalcMessage'],
                                            null,
                                            2,
                                        )} \nExpected: ${JSON.stringify(expectedNPMCalcMessage, null, 2)}`,
                                    );
                                    console.info(`priceTSA_Discount2:`, JSON.stringify(priceTSA_Discount2, null, 2));
                                    addContext(this, {
                                        title: `Cart NPMCalcMessage`,
                                        value: `From UI : ${JSON.stringify(
                                            NPMCalcMessage['NPMCalcMessage'],
                                            null,
                                            2,
                                        )} \nExpected: ${JSON.stringify(expectedNPMCalcMessage, null, 2)}`,
                                    });
                                    const expectedTotalUnitsAmount =
                                        pricingData.testItemsValues.Exclusion[exclusionRulesTestCartItem][account][
                                            'Cart'
                                        ];
                                    console.info(
                                        `Cart ${exclusionRulesTestCartItem} totalUnitsAmount: ${totalUnitsAmount}`,
                                    );
                                    console.info(`priceTSA_Discount2:`, JSON.stringify(priceTSA_Discount2, null, 2));
                                    addContext(this, {
                                        title: `Total Units amount of item`,
                                        value: `form UI: ${totalUnitsAmount} , expected: ${expectedTotalUnitsAmount}`,
                                    });
                                    priceExclusionDiscountFields.forEach((priceField) => {
                                        const expectedValue =
                                            pricingData.testItemsValues.Exclusion[exclusionRulesTestCartItem][account][
                                                'cart'
                                            ][priceField];
                                        addContext(this, {
                                            title: `TSA field "${priceField}" Values`,
                                            value: `form UI: ${priceTSA_Discount2[priceField]} , expected: ${expectedValue}`,
                                        });
                                        expect(priceTSA_Discount2[priceField]).equals(expectedValue);
                                    });
                                    expect(totalUnitsAmount).equals(expectedTotalUnitsAmount);
                                    expect(NPMCalcMessage['NPMCalcMessage'].length).equals(
                                        expectedNPMCalcMessage.length,
                                    );
                                    expect(NPMCalcMessage['NPMCalcMessage']).eql(expectedNPMCalcMessage);
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
