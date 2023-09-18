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
import { PricingData } from '../pom/addons/Pricing';
// import { PricingData05 } from '../pom/addons/Pricing05';
import { PriceTsaFields, PricingService } from '../../services/pricing.service';
// import { PricingData06 } from '../pom/addons/Pricing06';

chai.use(promised);

export async function Pricing06Tests(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const installedPricingVersion = (await generalService.getInstalledAddons())
        .find((addon) => addon.Addon.Name == 'pricing')
        ?.Version?.split('.')[1];
    console.info('Installed Pricing Version: 0.', JSON.stringify(installedPricingVersion, null, 2));

    let pricingData;

    switch (installedPricingVersion) {
        // case '5':
        //     pricingData = new PricingData05();
        //     break;
        // case '6':
        //     pricingData = new PricingData06();
        //     break;

        default:
            pricingData = new PricingData();
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
    let transactionID: number;
    let transactionUUID: string;
    let transactionUUID_Acc01: string;
    let transactionUUID_OtherAcc: string;
    let accountName: string;
    let Acc01TransactionByUUID;
    let transactionInternalID;
    let updatedUDTRowPOST;
    let item_forFreeGoods: string;
    let item_forGroupRules: string;
    let ToBr55priceTSAs_OC: PriceTsaFields;
    let Drug0002priceTSAs_OC: PriceTsaFields;
    let Drug0004priceTSAs_OC: PriceTsaFields;
    let base64ImageComponent;

    // const testAccounts = ['Acc01'];
    const testAccounts = ['Acc01', 'OtherAcc'];
    // const testStates = ['baseline', '3units', '4cases(24units)'];
    const testStates = ['baseline', '1unit', '3units', '1case(6units)', '4cases(24units)'];
    // const testItems = ['Lipstick no.1', 'Spring Loaded Frizz-Fighting Conditioner', 'Frag005'];
    const testItems = [
        'Lipstick no.1',
        'Spring Loaded Frizz-Fighting Conditioner',
        'Frag005',
        'Frag012',
        'ToBr56',
        'Drug0001',
        'Drug0003',
    ];
    const itemsAddedToGetFreeGoods = ['ToBr55', 'Drug0002', 'Drug0004'];
    const freeGoodsReceived = {
        Acc01: [
            { ToBr55_5units: { freeItem: 'ToBr10', amount: 1 }, ToBr55_20units: { freeItem: 'ToBr55', amount: 1 * 6 } },
            { Drug0002_10cases: { freeItem: 'Drug0002', amount: 2 * 6 } },
            { Drug0004_3cases: { freeItem: 'Drug0002', amount: 2 } },
        ],
        OtherAcc: [
            { Drug0002_10cases: { freeItem: 'Drug0002', amount: 2 * 6 } },
            { Drug0004_3cases: { freeItem: 'Drug0002', amount: 2 } },
        ],
    };
    const priceFields = [
        'PriceBaseUnitPriceAfter1',
        'PriceDiscountUnitPriceAfter1',
        'PriceGroupDiscountUnitPriceAfter1',
        'PriceManualLineUnitPriceAfter1',
        'PriceTaxUnitPriceAfter1',
    ];

    describe('Pricing UI tests', () => {
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

        testAccounts.forEach((account) => {
            describe(`ACCOUNT "${account == 'Acc01' ? 'My Store' : 'Account for order scenarios'}"`, () => {
                it('Creating new transaction', async function () {
                    switch (account) {
                        case 'Acc01':
                            accountName = 'My Store';
                            transactionUUID_Acc01 = await pricingService.startNewSalesOrderTransaction(accountName);
                            console.info('transactionUUID_Acc01:', transactionUUID_Acc01);
                            transactionUUID = transactionUUID_Acc01;
                            break;

                        default:
                            accountName = 'Account for order scenarios';
                            transactionUUID_OtherAcc = await pricingService.startNewSalesOrderTransaction(accountName);
                            console.info('transactionUUID_OtherAcc:', transactionUUID_OtherAcc);
                            transactionUUID = transactionUUID_OtherAcc;
                            break;
                    }
                    await orderPage.changeOrderCenterPageView('Line View');
                    // base64ImageComponent = await driver.saveScreenshots();
                    // addContext(this, {
                    //     title: `New Slaes Order trasaction started`,
                    //     value: 'data:image/png;base64,' + base64ImageComponent,
                    // });
                });

                testStates.forEach((state) => {
                    describe(`ORDER CENTER "${state}"`, () => {
                        testItems.forEach((item) => {
                            it(`checking item "${item}"`, async function () {
                                await pricingService.searchInOrderCenter.bind(this)(item, driver);
                                switch (
                                    state //'baseline', '1unit', '3units', '1case(6units)', '4cases(24units)'
                                ) {
                                    case '1unit':
                                        await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                            this,
                                        )('Each', item, 1, driver);
                                        break;
                                    case '3units':
                                        await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                            this,
                                        )('Each', item, 3, driver);
                                        break;
                                    case '1case(6units)':
                                        await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                            this,
                                        )('Case', item, 1, driver);
                                        break;
                                    case '4cases(24units)':
                                        await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                            this,
                                        )('Case', item, 4, driver);
                                        break;

                                    default:
                                        break;
                                }
                                const priceTSAs = await pricingService.getItemTSAs('OrderCenter', item);
                                console.info(`${item} ${state} priceTSAs:`, priceTSAs);

                                expect(typeof priceTSAs).equals('object');
                                expect(Object.keys(priceTSAs)).to.eql([
                                    'PriceBaseUnitPriceAfter1',
                                    'PriceDiscountUnitPriceAfter1',
                                    'PriceGroupDiscountUnitPriceAfter1',
                                    'PriceManualLineUnitPriceAfter1',
                                    'PriceTaxUnitPriceAfter1',
                                    'NPMCalcMessage',
                                ]);
                                switch (state) {
                                    case 'baseline':
                                        expect(priceTSAs['NPMCalcMessage'].length).equals(
                                            pricingData.testItemsValues[item]['NPMCalcMessage'][account][state].length,
                                        );
                                        break;

                                    default:
                                        expect(priceTSAs['NPMCalcMessage'].length).equals(
                                            pricingData.testItemsValues[item]['NPMCalcMessage'][account]['baseline']
                                                .length +
                                                pricingData.testItemsValues[item]['NPMCalcMessage'][account][state]
                                                    .length,
                                        );
                                        break;
                                }
                                priceFields.forEach((priceField) => {
                                    expect(priceTSAs[priceField]).equals(
                                        pricingData.testItemsValues[item][priceField][account][state],
                                    );
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
                                    // base64ImageComponent = await driver.saveScreenshots();
                                    // addContext(this, {
                                    //     title: `Entered Cart`,
                                    //     value: 'data:image/png;base64,' + base64ImageComponent,
                                    // });
                                    await driver.untilIsVisible(orderPage.Cart_Total_Header);
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
                                    it(`checking item "${item}"`, async () => {
                                        const priceTSAs = await pricingService.getItemTSAs('Cart', item);
                                        console.info(`Cart ${item} priceTSAs:`, priceTSAs);

                                        priceFields.forEach((priceField) => {
                                            expect(priceTSAs[priceField]).equals(
                                                pricingData.testItemsValues[item][priceField][account][state],
                                            );
                                        });
                                    });
                                });
                                describe('back to Order Center', () => {
                                    it('Click "Continue ordering" button', async function () {
                                        await driver.click(orderPage.Cart_ContinueOrdering_Button);
                                        await orderPage.isSpinnerDone();
                                        await orderPage.changeOrderCenterPageView('Line View');
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

                describe('Additional Items (Free Goods)', () => {
                    // 'ToBr55', 'Drug0002', 'Drug0004'
                    describe('ORDER CENTER', () => {
                        describe('item "ToBr55" - quantity that gets 1 item of "ToBr10" for free (from 5 units "Each") (only on "My store")', () => {
                            ['4 Each', '5 Each', '20 Each'].forEach(function (unitAmount, index) {
                                it(`${unitAmount}`, async function () {
                                    item_forFreeGoods = 'ToBr55';
                                    const states = ['baseline', '5units', '20units'];
                                    switch (unitAmount) {
                                        case '4 Each':
                                            driver.sleep(1 * 1000);
                                            await pricingService.searchInOrderCenter.bind(this)(
                                                item_forFreeGoods,
                                                driver,
                                            );
                                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                this,
                                            )('Each', item_forFreeGoods, 4, driver);
                                            break;

                                        case '5 Each':
                                            await driver.click(
                                                orderPage.getSelectorOfItemQuantityPlusButtonInOrderCenterByName(
                                                    item_forFreeGoods,
                                                ),
                                            );
                                            driver.sleep(0.5 * 1000);
                                            break;

                                        case '20 Each':
                                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                this,
                                            )('Each', item_forFreeGoods, 20, driver);
                                            break;

                                        default:
                                            break;
                                    }
                                    ToBr55priceTSAs_OC = await pricingService.getItemTSAs(
                                        'OrderCenter',
                                        item_forFreeGoods,
                                    );
                                    console.info(`ToBr55priceTSAs_OC (${unitAmount}): `, ToBr55priceTSAs_OC);

                                    expect(typeof ToBr55priceTSAs_OC).equals('object');
                                    expect(Object.keys(ToBr55priceTSAs_OC)).to.eql([
                                        'PriceBaseUnitPriceAfter1',
                                        'PriceDiscountUnitPriceAfter1',
                                        'PriceGroupDiscountUnitPriceAfter1',
                                        'PriceManualLineUnitPriceAfter1',
                                        'PriceTaxUnitPriceAfter1',
                                        'NPMCalcMessage',
                                    ]);
                                    expect(ToBr55priceTSAs_OC.NPMCalcMessage.length).equals(
                                        pricingData.testItemsValues[item_forFreeGoods]['NPMCalcMessage'][account][
                                            'baseline'
                                        ].length +
                                            pricingData.testItemsValues[item_forFreeGoods]['NPMCalcMessage'][account][
                                                states[index]
                                            ].length,
                                    );
                                    priceFields.forEach((priceField) => {
                                        expect(ToBr55priceTSAs_OC[priceField]).equals(
                                            pricingData.testItemsValues[item_forFreeGoods][priceField][account][
                                                states[index]
                                            ],
                                        );
                                    });
                                    driver.sleep(0.2 * 1000);
                                });
                            });

                            it('Back to 4 Each', async function () {
                                await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(this)(
                                    'Each',
                                    item_forFreeGoods,
                                    4,

                                    driver,
                                );
                                driver.sleep(0.5 * 1000);
                                ToBr55priceTSAs_OC = await pricingService.getItemTSAs('OrderCenter', item_forFreeGoods);
                                console.info('ToBr55priceTSAs_OC (4 Each): ', ToBr55priceTSAs_OC);

                                expect(typeof ToBr55priceTSAs_OC).equals('object');
                                expect(Object.keys(ToBr55priceTSAs_OC)).to.eql([
                                    'PriceBaseUnitPriceAfter1',
                                    'PriceDiscountUnitPriceAfter1',
                                    'PriceGroupDiscountUnitPriceAfter1',
                                    'PriceManualLineUnitPriceAfter1',
                                    'PriceTaxUnitPriceAfter1',
                                    'NPMCalcMessage',
                                ]);
                                expect(ToBr55priceTSAs_OC.NPMCalcMessage.length).equals(
                                    pricingData.testItemsValues[item_forFreeGoods]['NPMCalcMessage'][account][
                                        'baseline'
                                    ].length,
                                );
                                priceFields.forEach((priceField) => {
                                    expect(ToBr55priceTSAs_OC[priceField]).equals(
                                        pricingData.testItemsValues[item_forFreeGoods][priceField][account]['baseline'],
                                    );
                                });
                                await pricingService.clearOrderCenterSearch();
                                driver.sleep(0.5 * 1000);
                            });
                        });
                        describe('item "Drug0002" - quantity that gets 2 "Cases" of items for free (from 10 in "Case")', () => {
                            ['9 Cases', '10 Cases'].forEach(function (unitAmount, index) {
                                it(`${unitAmount}`, async function () {
                                    item_forFreeGoods = 'Drug0002';
                                    const states = ['9case(54units)', '10cases(60units)'];
                                    switch (unitAmount) {
                                        case '9 Cases':
                                            await pricingService.searchInOrderCenter.bind(this)(
                                                item_forFreeGoods,
                                                driver,
                                            );
                                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                this,
                                            )('Case', item_forFreeGoods, 9, driver);
                                            break;

                                        case '10 Cases':
                                            await driver.click(
                                                orderPage.getSelectorOfItemQuantityPlusButtonInOrderCenterByName(
                                                    item_forFreeGoods,
                                                ),
                                            );
                                            driver.sleep(0.5 * 1000);
                                            break;

                                        default:
                                            break;
                                    }
                                    Drug0002priceTSAs_OC = await pricingService.getItemTSAs(
                                        'OrderCenter',
                                        item_forFreeGoods,
                                    );
                                    console.info(`Drug0002priceTSAs_OC (${unitAmount}): `, Drug0002priceTSAs_OC);

                                    expect(typeof Drug0002priceTSAs_OC).equals('object');
                                    expect(Object.keys(Drug0002priceTSAs_OC)).to.eql([
                                        'PriceBaseUnitPriceAfter1',
                                        'PriceDiscountUnitPriceAfter1',
                                        'PriceGroupDiscountUnitPriceAfter1',
                                        'PriceManualLineUnitPriceAfter1',
                                        'PriceTaxUnitPriceAfter1',
                                        'NPMCalcMessage',
                                    ]);
                                    expect(Drug0002priceTSAs_OC['NPMCalcMessage'].length).equals(
                                        pricingData.testItemsValues[item_forFreeGoods]['NPMCalcMessage'][account][
                                            'baseline'
                                        ].length +
                                            pricingData.testItemsValues[item_forFreeGoods]['NPMCalcMessage'][account][
                                                states[index]
                                            ].length,
                                    );
                                    priceFields.forEach((priceField) => {
                                        expect(Drug0002priceTSAs_OC[priceField]).equals(
                                            pricingData.testItemsValues[item_forFreeGoods][priceField][account][
                                                states[index]
                                            ],
                                        );
                                    });
                                    driver.sleep(0.2 * 1000);
                                });
                            });

                            it('Back to 9 Cases', async () => {
                                await driver.click(
                                    orderPage.getSelectorOfItemQuantityMinusButtonInOrderCenterByName(
                                        item_forFreeGoods,
                                    ),
                                );
                                driver.sleep(0.75 * 1000);
                                Drug0002priceTSAs_OC = await pricingService.getItemTSAs(
                                    'OrderCenter',
                                    item_forFreeGoods,
                                );
                                console.info('Drug0002priceTSAs_OC (9 Cases): ', Drug0002priceTSAs_OC);

                                expect(typeof Drug0002priceTSAs_OC).equals('object');
                                expect(Object.keys(Drug0002priceTSAs_OC)).to.eql([
                                    'PriceBaseUnitPriceAfter1',
                                    'PriceDiscountUnitPriceAfter1',
                                    'PriceGroupDiscountUnitPriceAfter1',
                                    'PriceManualLineUnitPriceAfter1',
                                    'PriceTaxUnitPriceAfter1',
                                    'NPMCalcMessage',
                                ]);
                                expect(Drug0002priceTSAs_OC['NPMCalcMessage'].length).equals(
                                    pricingData.testItemsValues[item_forFreeGoods]['NPMCalcMessage'][account][
                                        'baseline'
                                    ].length,
                                );
                                priceFields.forEach((priceField) => {
                                    expect(Drug0002priceTSAs_OC[priceField]).equals(
                                        pricingData.testItemsValues[item_forFreeGoods][priceField][account]['baseline'],
                                    );
                                });
                                await pricingService.clearOrderCenterSearch();
                                driver.sleep(0.5 * 1000);
                            });
                        });
                        describe('item "Drug0004" - quantity that gets 2 items (in "Each") of "Drug0002" for free (from 3 in "Case")', () => {
                            ['2 Cases', '3 Cases'].forEach(function (unitAmount, index) {
                                it(`${unitAmount}`, async function () {
                                    item_forFreeGoods = 'Drug0004';
                                    const states = ['2case(12units)', '3cases(18units)'];
                                    switch (unitAmount) {
                                        case '2 Cases':
                                            driver.sleep(1 * 1000);
                                            await pricingService.searchInOrderCenter.bind(this)(
                                                item_forFreeGoods,
                                                driver,
                                            );
                                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                this,
                                            )('Case', item_forFreeGoods, 2, driver);
                                            break;

                                        case '3 Cases':
                                            await driver.click(
                                                orderPage.getSelectorOfItemQuantityPlusButtonInOrderCenterByName(
                                                    item_forFreeGoods,
                                                ),
                                            );
                                            driver.sleep(0.5 * 1000);
                                            break;

                                        default:
                                            break;
                                    }
                                    Drug0004priceTSAs_OC = await pricingService.getItemTSAs(
                                        'OrderCenter',
                                        item_forFreeGoods,
                                    );
                                    console.info(`Drug0004priceTSAs_OC (${unitAmount}): `, Drug0004priceTSAs_OC);

                                    expect(typeof Drug0004priceTSAs_OC).equals('object');
                                    expect(Object.keys(Drug0004priceTSAs_OC)).to.eql([
                                        'PriceBaseUnitPriceAfter1',
                                        'PriceDiscountUnitPriceAfter1',
                                        'PriceGroupDiscountUnitPriceAfter1',
                                        'PriceManualLineUnitPriceAfter1',
                                        'PriceTaxUnitPriceAfter1',
                                        'NPMCalcMessage',
                                    ]);
                                    expect(Drug0004priceTSAs_OC['NPMCalcMessage'].length).equals(
                                        pricingData.testItemsValues[item_forFreeGoods]['NPMCalcMessage'][account][
                                            'baseline'
                                        ].length +
                                            pricingData.testItemsValues[item_forFreeGoods]['NPMCalcMessage'][account][
                                                states[index]
                                            ].length,
                                    );
                                    priceFields.forEach((priceField) => {
                                        expect(Drug0004priceTSAs_OC[priceField]).equals(
                                            pricingData.testItemsValues[item_forFreeGoods][priceField][account][
                                                states[index]
                                            ],
                                        );
                                    });
                                    driver.sleep(0.2 * 1000);
                                });
                            });

                            it('Back to 2 Cases', async () => {
                                await driver.click(
                                    orderPage.getSelectorOfItemQuantityMinusButtonInOrderCenterByName(
                                        item_forFreeGoods,
                                    ),
                                );
                                driver.sleep(0.5 * 1000);
                                Drug0004priceTSAs_OC = await pricingService.getItemTSAs(
                                    'OrderCenter',
                                    item_forFreeGoods,
                                );
                                console.info(`Drug0004priceTSAs_OC (2 cases): `, Drug0004priceTSAs_OC);

                                expect(typeof Drug0004priceTSAs_OC).equals('object');
                                expect(Object.keys(Drug0004priceTSAs_OC)).to.eql([
                                    'PriceBaseUnitPriceAfter1',
                                    'PriceDiscountUnitPriceAfter1',
                                    'PriceGroupDiscountUnitPriceAfter1',
                                    'PriceManualLineUnitPriceAfter1',
                                    'PriceTaxUnitPriceAfter1',
                                    'NPMCalcMessage',
                                ]);
                                expect(Drug0004priceTSAs_OC['NPMCalcMessage'].length).equals(
                                    pricingData.testItemsValues[item_forFreeGoods]['NPMCalcMessage'][account][
                                        'baseline'
                                    ].length,
                                );
                                priceFields.forEach((priceField) => {
                                    expect(Drug0004priceTSAs_OC[priceField]).equals(
                                        pricingData.testItemsValues[item_forFreeGoods][priceField][account]['baseline'],
                                    );
                                });
                                await pricingService.clearOrderCenterSearch();
                                driver.sleep(0.5 * 1000);
                            });
                        });
                    });
                    describe('Transaction ID', () => {
                        it('getting the transaction ID through the UI', async () => {
                            await driver.refresh();
                            await orderPage.isSpinnerDone();
                            transactionID = Number(
                                await (await driver.findElement(orderPage.TransactionID)).getAttribute('title'),
                            );
                        });
                    });
                    describe('Transition and Validation', () => {
                        it('exiting the transaction without submission', async () => {
                            await webAppHeader.goHome();
                            await webAppHomePage.isSpinnerDone();
                            await driver.untilIsVisible(webAppHomePage.MainHomePageBtn);
                            driver.sleep(1 * 1000);
                        });
                        it('verifying transaction ID', async () => {
                            console.info('transactionUUID:', transactionUUID);
                            driver.sleep(0.1 * 1000);
                            Acc01TransactionByUUID = await objectsService.getTransaction({
                                where: `UUID='${transactionUUID}'`,
                            });
                            console.info('Acc01TransactionByUUID:', Acc01TransactionByUUID);
                            driver.sleep(2 * 1000);
                            transactionInternalID = Acc01TransactionByUUID[0].InternalID;
                            driver.sleep(1 * 1000);
                            console.info('transactionInternalID:', transactionInternalID);
                            expect(Acc01TransactionByUUID).to.be.an('array').with.lengthOf(1);
                            expect(transactionInternalID).to.be.a('number');
                            if (transactionID > 0) {
                                expect(transactionInternalID).equals(transactionID);
                            }
                        });
                        it(`navigating to the account "${
                            account == 'Acc01' ? 'My Store' : 'Account for order scenarios'
                        }"`, async () => {
                            await webAppHomePage.clickOnBtn('Accounts');
                            await webAppHeader.isSpinnerDone();
                            driver.sleep(0.1 * 1000);
                            await webAppList.clickOnFromListRowWebElementByName(accountName);
                            await webAppList.isSpinnerDone();
                            await webAppList.clickOnLinkFromListRowWebElementByText(`${accountName}`);
                            await webAppList.isSpinnerDone();
                        });
                        it('checking the latest activity - type: Sales Order, status: In Creation', async () => {
                            driver.sleep(0.1 * 1000);
                            const latestActivityID = await (
                                await driver.findElement(webAppList.Activities_TopActivityInList_ID)
                            ).getAttribute('title');
                            const latestActivityType = await (
                                await driver.findElement(webAppList.Activities_TopActivityInList_Type)
                            ).getAttribute('title');
                            const latestActivityStatus = await (
                                await driver.findElement(webAppList.Activities_TopActivityInList_Status)
                            ).getAttribute('title');
                            expect(latestActivityType).to.equal('Sales Order');
                            expect(latestActivityStatus).to.equal('In Creation');
                            expect(Number(latestActivityID)).to.equal(transactionInternalID);
                        });
                        it('entering the same transaction through activity list', async function () {
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Back into Order Center after exiting the transaction`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await webAppList.clickOnLinkFromListRowWebElement();
                            await webAppList.isSpinnerDone();
                            await driver.untilIsVisible(orderPage.Cart_ContinueOrdering_Button);
                            driver.sleep(0.1 * 1000);
                        });
                    });
                    describe('CART', () => {
                        it('verifying that the sum total of items in the cart is correct', async () => {
                            await driver.untilIsVisible(orderPage.Cart_Total_Header); // check to be in cart
                            const itemsInCart = await (
                                await driver.findElement(orderPage.Cart_Headline_Results_Number)
                            ).getText();
                            driver.sleep(0.2 * 1000);
                            expect(Number(itemsInCart)).to.equal(testItems.length + itemsAddedToGetFreeGoods.length);
                            driver.sleep(1 * 1000);
                        });
                        it('changing the amount of "ToBr55" to produce free goods', async function () {
                            const item = 'ToBr55';
                            await pricingService.changeSelectedQuantityOfSpecificItemInCart.bind(this)(
                                'Each',
                                item,
                                5,
                                driver,
                            );
                            driver.sleep(0.2 * 1000);
                        });
                        it('changing the amount of "Drug0002" to produce free goods', async function () {
                            const item = 'Drug0002';
                            await pricingService.changeSelectedQuantityOfSpecificItemInCart.bind(this)(
                                'Case',
                                item,
                                10,
                                driver,
                            );
                            driver.sleep(0.2 * 1000);
                        });
                        it('changing the amount of "Drug0004" to produce free goods', async function () {
                            const item = 'Drug0004';
                            await pricingService.changeSelectedQuantityOfSpecificItemInCart.bind(this)(
                                'Case',
                                item,
                                3,
                                driver,
                            );
                            driver.sleep(0.2 * 1000);
                        });
                        it('verifying that the sum total of items after the free goods were received is correct', async function () {
                            const itemsInCart = await (
                                await driver.findElement(orderPage.Cart_Headline_Results_Number)
                            ).getText();
                            driver.sleep(0.2 * 1000);
                            expect(Number(itemsInCart)).to.equal(
                                testItems.length + itemsAddedToGetFreeGoods.length + freeGoodsReceived[account].length,
                            );
                            driver.sleep(1 * 1000);
                        });
                        it('verifying the specific item "Drug0002" was added to the cart', async () => {
                            const cartFreeItemElements = await driver.findElements(
                                orderPage.getSelectorOfFreeItemInCartByName(''),
                            );
                            driver.sleep(0.3 * 1000);
                            expect(cartFreeItemElements)
                                .to.be.an('array')
                                .with.lengthOf(freeGoodsReceived[account].length);
                            const item = 'Drug0002';
                            const Drug0002_itemsList = await driver.findElements(
                                orderPage.getSelectorOfItemInCartByName(item),
                            );
                            driver.sleep(0.1 * 1000);
                            expect(Drug0002_itemsList).to.be.an('array').with.lengthOf(3);
                            const Drug0002_freeItems = await driver.findElements(
                                orderPage.getSelectorOfFreeItemInCartByName(item),
                            );
                            expect(Drug0002_freeItems).to.be.an('array').with.lengthOf(2);

                            Drug0002_freeItems.forEach(async (Drug0002_freeItem, index) => {
                                expect(await Drug0002_freeItem.getAttribute('style')).to.equal(
                                    'background-color: rgb(165, 235, 255);',
                                );

                                const Drug0002_priceTSAsCart = await pricingService.getItemTSAs(
                                    'Cart',
                                    item,
                                    'Free',
                                    index,
                                );
                                priceFields.forEach((priceField) => {
                                    switch (priceField) {
                                        case 'PriceBaseUnitPriceAfter1':
                                            expect(Drug0002_priceTSAsCart[priceField]).to.equal(
                                                pricingData.testItemsValues[item]['PriceBaseUnitPriceAfter1'][account][
                                                    'baseline'
                                                ],
                                            );
                                            break;

                                        default:
                                            expect(Drug0002_priceTSAsCart[priceField]).equals(0.0);
                                            break;
                                    }
                                });
                            });
                            driver.sleep(0.2 * 1000);
                        });
                        it('verify additional item "Drug0002" quantity is correct', async () => {
                            const item = 'Drug0002';
                            const numberOfUnits = await driver.findElements(
                                orderPage.getSelectorOfNumberOfUnitsInCartByItemName(item),
                            );
                            const Drug0002_freeItem_numberOfUnits_fromDrug0004 = Number(
                                await numberOfUnits[0].getAttribute('title'),
                            );
                            expect(Drug0002_freeItem_numberOfUnits_fromDrug0004).equals(2);

                            const Drug0002_freeItem_numberOfUnits_fromDrug0002 = Number(
                                await numberOfUnits[2].getAttribute('title'),
                            );
                            expect(Drug0002_freeItem_numberOfUnits_fromDrug0002).equals(12);
                            const numberOfAOQM = await driver.findElements(
                                orderPage.getSelectorOfReadOnlyAoqmQuantityInCartByAdditionalItemName(item),
                            );
                            const Drug0002_freeItem_numberOfAOQM = Number(await numberOfAOQM[0].getAttribute('title'));
                            expect(Drug0002_freeItem_numberOfAOQM).equals(2);
                        });
                        it('verifying the specific item "ToBr10" was added to the cart on account "My Store" and NOT added on other account', async () => {
                            const item = 'ToBr10';
                            switch (account) {
                                case 'Acc01':
                                    const ToBr10_item = await driver.findElement(
                                        orderPage.getSelectorOfItemInCartByName(item),
                                    );
                                    expect(await ToBr10_item.getAttribute('style')).to.equal(
                                        'background-color: rgb(165, 235, 255);',
                                    );
                                    const ToBr10_priceTSAsCart = await pricingService.getItemTSAs('Cart', item, 'Free');
                                    priceFields.forEach((priceField) => {
                                        switch (priceField) {
                                            case 'PriceBaseUnitPriceAfter1':
                                                expect(ToBr10_priceTSAsCart[priceField]).to.equal(
                                                    pricingData.testItemsValues[item].ItemPrice,
                                                );
                                                break;

                                            default:
                                                expect(ToBr10_priceTSAsCart[priceField]).equals(0.0);
                                                break;
                                        }
                                    });
                                    break;

                                default:
                                    try {
                                        await driver.findElement(orderPage.getSelectorOfItemInCartByName(item));
                                    } catch (error) {
                                        const caughtError: any = error;
                                        expect(caughtError.message).to.equal(
                                            `After wait time of: 15000, for selector of '//pep-textbox[@data-qa="ItemExternalID"]/span[contains(@title,"ToBr10")]/ancestor::fieldset/ancestor::fieldset', The test must end, The element is: undefined`,
                                        );
                                    }
                                    break;
                            }
                            driver.sleep(2 * 1000);
                        });
                        if (account === 'Acc01') {
                            it('verify additional item "ToBr10" quantity is correct', async () => {
                                const item = 'ToBr10';
                                const numberOfUnits = await driver.findElements(
                                    orderPage.getSelectorOfNumberOfUnitsInCartByItemName(item),
                                );
                                const ToBr10_freeItem_numberOfUnits = Number(
                                    await numberOfUnits[0].getAttribute('title'),
                                );
                                expect(ToBr10_freeItem_numberOfUnits).equals(1);
                                const numberOfAOQM = await driver.findElements(
                                    orderPage.getSelectorOfReadOnlyAoqmQuantityInCartByAdditionalItemName(item),
                                );
                                const ToBr10_freeItem_numberOfAOQM = Number(
                                    await numberOfAOQM[0].getAttribute('title'),
                                );
                                expect(ToBr10_freeItem_numberOfAOQM).equals(1);
                            });
                            it('increase quantity of item "ToBr55" over 20 units (Each) and see the additional item change to 1 case of "ToBr55"', async function () {
                                const item = 'ToBr55';
                                await pricingService.changeSelectedQuantityOfSpecificItemInCart.bind(this)(
                                    'Case',
                                    item,
                                    4,
                                    driver,
                                );
                            });
                            it('verify additional item type have changed', async () => {
                                let item = 'ToBr55';
                                const ToBr55_itemsList = await driver.findElements(
                                    orderPage.getSelectorOfItemInCartByName(item),
                                );
                                driver.sleep(0.1 * 1000);
                                expect(ToBr55_itemsList).to.be.an('array').with.lengthOf(2);
                                driver.sleep(0.1 * 1000);
                                const ToBr55_freeItem = await driver.findElements(
                                    orderPage.getSelectorOfFreeItemInCartByName(item),
                                );
                                driver.sleep(0.1 * 1000);
                                expect(ToBr55_freeItem).to.be.an('array').with.lengthOf(1);
                                driver.sleep(0.1 * 1000);
                                expect(await ToBr55_freeItem[0].getAttribute('style')).to.equal(
                                    'background-color: rgb(165, 235, 255);',
                                );
                                const ToBr55_priceTSAsCart = await pricingService.getItemTSAs('Cart', item, 'Free');
                                priceFields.forEach((priceField) => {
                                    switch (priceField) {
                                        case 'PriceBaseUnitPriceAfter1':
                                            expect(ToBr55_priceTSAsCart[priceField]).to.equal(
                                                pricingData.testItemsValues[item].ItemPrice,
                                            );
                                            break;

                                        default:
                                            expect(ToBr55_priceTSAsCart[priceField]).equals(0.0);
                                            break;
                                    }
                                });

                                item = 'ToBr10';
                                try {
                                    await driver.findElement(orderPage.getSelectorOfItemInCartByName(item));
                                } catch (error) {
                                    const caughtError: any = error;
                                    expect(caughtError.message).to.equal(
                                        `After wait time of: 15000, for selector of '//pep-textbox[@data-qa="ItemExternalID"]/span[contains(@title,"ToBr10")]/ancestor::fieldset/ancestor::fieldset', The test must end, The element is: undefined`,
                                    );
                                }
                            });
                            it('verify additional item "ToBr55" quantity have changed', async () => {
                                const item = 'ToBr55';
                                const numberOfUnits = await driver.findElements(
                                    orderPage.getSelectorOfNumberOfUnitsInCartByItemName(item),
                                );
                                const ToBr55_freeItem_numberOfUnits = Number(
                                    await numberOfUnits[1].getAttribute('title'),
                                );
                                expect(ToBr55_freeItem_numberOfUnits).equals(6);
                                const numberOfAOQM = await driver.findElements(
                                    orderPage.getSelectorOfReadOnlyAoqmQuantityInCartByAdditionalItemName(item),
                                );
                                expect(numberOfAOQM).to.be.an('array').with.lengthOf(1);
                                const ToBr55_freeItem_numberOfAOQM = Number(
                                    await numberOfAOQM[0].getAttribute('title'),
                                );
                                expect(ToBr55_freeItem_numberOfAOQM).equals(1);
                            });
                        }
                        it('Click "Continue ordering" button', async () => {
                            await driver.click(orderPage.Cart_ContinueOrdering_Button);
                            await orderPage.isSpinnerDone();
                            await orderPage.changeOrderCenterPageView('Line View');
                            await orderPage.isSpinnerDone();
                            await driver.untilIsVisible(orderPage.getSelectorOfItemInOrderCenterByName(''));
                            driver.sleep(0.2 * 1000);
                        });
                    });
                });

                describe('Group Rules', () => {
                    describe('ORDER CENTER', () => {
                        it('Adding Group Rules Items', async () => {
                            await driver.untilIsVisible(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                            await driver.click(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                            driver.sleep(0.1 * 1000);
                        });

                        ['MakeUp001', 'MakeUp002'].forEach(function (item) {
                            it(`Checking ${item} at Baseline`, async function () {
                                await pricingService.searchInOrderCenter.bind(this)(item, driver);
                                driver.sleep(0.1 * 1000);
                                const MakeUpItem_priceTSAsCart = await pricingService.getItemTSAs('OrderCenter', item);
                                driver.sleep(0.1 * 1000);
                                expect(MakeUpItem_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(0);
                                driver.sleep(0.1 * 1000);
                                await pricingService.clearOrderCenterSearch();
                                driver.sleep(0.5 * 1000);
                                base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Group Rules item - at baseline`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                            });
                        });

                        ['MakeUp001', 'MakeUp002'].forEach(function (item) {
                            it(`Adding ${item} at quantity of 1 Each and Checking at Order Center`, async function () {
                                base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Group Rules item - before adding`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                                await pricingService.searchInOrderCenter.bind(this)(item, driver);
                                driver.sleep(0.1 * 1000);
                                const itemContainer = await driver.findElement(
                                    orderPage.getSelectorOfItemInOrderCenterByName(item),
                                );
                                let itemUomValue = await driver.findElement(orderPage.UnitOfMeasure_Selector_Value);
                                await driver.click(orderPage.UnitOfMeasure_Selector_Value);
                                driver.sleep(0.2 * 1000);
                                await driver.click(orderPage.getSelectorOfUnitOfMeasureOptionByText('Each'));
                                driver.sleep(0.2 * 1000);
                                await itemContainer.click();
                                driver.sleep(0.1 * 1000);
                                itemUomValue = await driver.findElement(orderPage.UnitOfMeasure_Selector_Value);
                                driver.sleep(0.1 * 1000);
                                await orderPage.isSpinnerDone();
                                driver.sleep(0.2 * 1000);
                                expect(await itemUomValue.getText()).equals('Each');
                                await driver.click(
                                    orderPage.getSelectorOfItemQuantityPlusButtonInOrderCenterByName(item),
                                );
                                base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Group Rules item - after adding (by clicking the Plus button)`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
                                });
                                const uomXnumber = await driver.findElement(
                                    orderPage.getSelectorOfCustomFieldInOrderCenterByItemName(
                                        'ItemQuantity_byUOM_InteractableNumber',
                                        item,
                                    ),
                                );
                                await itemContainer.click();
                                await orderPage.isSpinnerDone();
                                driver.sleep(1 * 1000);
                                const numberByUOM = await uomXnumber.getAttribute('title');
                                driver.sleep(0.5 * 1000);
                                expect(Number(numberByUOM)).equals(1);
                                driver.sleep(0.1 * 1000);
                                const MakeUpItem_priceTSAsCart = await pricingService.getItemTSAs('OrderCenter', item);
                                driver.sleep(0.2 * 1000);
                                expect(MakeUpItem_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(0);
                                driver.sleep(0.1 * 1000);
                                await pricingService.clearOrderCenterSearch();
                                driver.sleep(0.5 * 1000);
                            });
                        });

                        it('Adding "MakeUp003" at quantity of 1 Each and Checking at Order Center (3 units in group)', async function () {
                            item_forGroupRules = 'MakeUp003';
                            await pricingService.searchInOrderCenter.bind(this)(item_forGroupRules, driver);
                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(this)(
                                'Each',
                                item_forGroupRules,
                                1,

                                driver,
                            );
                            const MakeUp003_priceTSAsCart = await pricingService.getItemTSAs(
                                'OrderCenter',
                                item_forGroupRules,
                            );
                            driver.sleep(0.1 * 1000);
                            switch (account) {
                                case 'Acc01':
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(1);
                                    expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage[0])).eql([
                                        'Name',
                                        'Base',
                                        'Conditions',
                                        'New',
                                        'Amount',
                                    ]);
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0].Name,
                                    );
                                    expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0])).eql(
                                        ['Name', 'Type', 'Value', 'Amount'],
                                    );
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                            .Conditions[0].Name,
                                    );
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                            .Conditions[0].Type,
                                    );
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                            .Conditions[0].Value,
                                    );
                                    break;

                                default:
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(0);
                                    expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage)).eql(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.OtherAcc['3units'],
                                    );
                                    break;
                            }
                            driver.sleep(0.1 * 1000);
                            await pricingService.clearOrderCenterSearch();
                            driver.sleep(0.5 * 1000);
                        });

                        ['MakeUp001', 'MakeUp002'].forEach((item) => {
                            it(`Checking ${item} after amount of 3 in the group at Order Center`, async () => {
                                await pricingService.searchInOrderCenter.bind(this)(item, driver);
                                const MakeUpItem_priceTSAsCart = await pricingService.getItemTSAs('OrderCenter', item);
                                driver.sleep(0.1 * 1000);
                                switch (account) {
                                    case 'Acc01':
                                        expect(MakeUpItem_priceTSAsCart.NPMCalcMessage)
                                            .to.be.an('array')
                                            .with.lengthOf(1);
                                        expect(Object.keys(MakeUpItem_priceTSAsCart.NPMCalcMessage[0])).eql([
                                            'Name',
                                            'Base',
                                            'Conditions',
                                            'New',
                                            'Amount',
                                        ]);
                                        expect(MakeUpItem_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                            pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                .Name,
                                        );
                                        expect(
                                            Object.keys(MakeUpItem_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0]),
                                        ).eql(['Name', 'Type', 'Value', 'Amount']);
                                        expect(MakeUpItem_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name).equals(
                                            pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                .Conditions[0].Name,
                                        );
                                        expect(MakeUpItem_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type).equals(
                                            pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                .Conditions[0].Type,
                                        );
                                        break;

                                    default:
                                        expect(MakeUpItem_priceTSAsCart.NPMCalcMessage)
                                            .to.be.an('array')
                                            .with.lengthOf(0);
                                        expect(Object.keys(MakeUpItem_priceTSAsCart.NPMCalcMessage)).eql(
                                            pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.OtherAcc['3units'],
                                        );
                                        break;
                                }
                                driver.sleep(0.1 * 1000);
                                await pricingService.clearOrderCenterSearch();
                                driver.sleep(0.5 * 1000);
                            });
                        });

                        it('Adding "MakeUp018" at quantity of 1 Each and Checking at Order Center (4 units in group)', async function () {
                            item_forGroupRules = 'MakeUp018';
                            await pricingService.searchInOrderCenter.bind(this)(item_forGroupRules, driver);
                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(this)(
                                'Each',
                                item_forGroupRules,
                                1,

                                driver,
                            );
                            const MakeUp018_priceTSAsCart = await pricingService.getItemTSAs(
                                'OrderCenter',
                                item_forGroupRules,
                            );
                            driver.sleep(0.1 * 1000);
                            switch (account) {
                                case 'Acc01':
                                    expect(MakeUp018_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(1);
                                    expect(Object.keys(MakeUp018_priceTSAsCart.NPMCalcMessage[0])).eql([
                                        'Name',
                                        'Base',
                                        'Conditions',
                                        'New',
                                        'Amount',
                                    ]);
                                    expect(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0].Name,
                                    );
                                    expect(Object.keys(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0])).eql(
                                        ['Name', 'Type', 'Value', 'Amount'],
                                    );
                                    expect(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                            .Conditions[0].Name,
                                    );
                                    expect(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                            .Conditions[0].Type,
                                    );
                                    expect(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                            .Conditions[0].Value,
                                    );
                                    break;

                                default:
                                    expect(MakeUp018_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(0);
                                    expect(Object.keys(MakeUp018_priceTSAsCart.NPMCalcMessage)).eql(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.OtherAcc['3units'],
                                    );
                                    break;
                            }
                            driver.sleep(0.1 * 1000);
                            await pricingService.clearOrderCenterSearch();
                            driver.sleep(0.5 * 1000);
                        });

                        it('Changing "MakeUp018" value to 2 Each and Checking at Order Center (5 units in group)', async function () {
                            item_forGroupRules = 'MakeUp018';
                            await pricingService.searchInOrderCenter.bind(this)(item_forGroupRules, driver);
                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(this)(
                                'Each',
                                item_forGroupRules,
                                2,

                                driver,
                            );
                            const MakeUp018_priceTSAsCart = await pricingService.getItemTSAs(
                                'OrderCenter',
                                item_forGroupRules,
                            );
                            driver.sleep(0.1 * 1000);
                            switch (account) {
                                case 'Acc01':
                                    expect(MakeUp018_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(1);
                                    expect(Object.keys(MakeUp018_priceTSAsCart.NPMCalcMessage[0])).eql([
                                        'Name',
                                        'Base',
                                        'Conditions',
                                        'New',
                                        'Amount',
                                    ]);
                                    expect(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0].Name,
                                    );
                                    expect(Object.keys(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0])).eql(
                                        ['Name', 'Type', 'Value', 'Amount'],
                                    );
                                    expect(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                            .Conditions[0].Name,
                                    );
                                    expect(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                            .Conditions[0].Type,
                                    );
                                    expect(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                            .Conditions[0].Value,
                                    );
                                    break;

                                default:
                                    expect(MakeUp018_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(0);
                                    expect(Object.keys(MakeUp018_priceTSAsCart.NPMCalcMessage)).eql(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.OtherAcc['3units'],
                                    );
                                    break;
                            }
                            driver.sleep(0.1 * 1000);
                            await pricingService.clearOrderCenterSearch();
                            driver.sleep(0.5 * 1000);
                        });

                        it('Changing "MakeUp001" value to 2 Each and Checking at Order Center (6 units in group)', async function () {
                            item_forGroupRules = 'MakeUp001';
                            await pricingService.searchInOrderCenter.bind(this)(item_forGroupRules, driver);
                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(this)(
                                'Each',
                                item_forGroupRules,
                                2,

                                driver,
                            );
                            const MakeUp001_priceTSAsCart = await pricingService.getItemTSAs(
                                'OrderCenter',
                                item_forGroupRules,
                            );
                            driver.sleep(0.1 * 1000);
                            switch (account) {
                                case 'Acc01':
                                    expect(MakeUp001_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(1);
                                    expect(Object.keys(MakeUp001_priceTSAsCart.NPMCalcMessage[0])).eql([
                                        'Name',
                                        'Base',
                                        'Conditions',
                                        'New',
                                        'Amount',
                                    ]);
                                    expect(MakeUp001_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['6units'][0].Name,
                                    );
                                    expect(Object.keys(MakeUp001_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0])).eql(
                                        ['Name', 'Type', 'Value', 'Amount'],
                                    );
                                    expect(MakeUp001_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['6units'][0]
                                            .Conditions[0].Name,
                                    );
                                    expect(MakeUp001_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['6units'][0]
                                            .Conditions[0].Type,
                                    );
                                    expect(MakeUp001_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['6units'][0]
                                            .Conditions[0].Value,
                                    );
                                    break;

                                default:
                                    expect(MakeUp001_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(0);
                                    expect(Object.keys(MakeUp001_priceTSAsCart.NPMCalcMessage)).eql(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.OtherAcc['6units'],
                                    );
                                    break;
                            }
                            driver.sleep(0.1 * 1000);
                            await pricingService.clearOrderCenterSearch();
                            driver.sleep(0.5 * 1000);
                        });

                        it('Changing "MakeUp002" value to 2 Each and Checking at Order Center (7 units in group)', async function () {
                            item_forGroupRules = 'MakeUp002';
                            await pricingService.searchInOrderCenter.bind(this)(item_forGroupRules, driver);
                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(this)(
                                'Each',
                                item_forGroupRules,
                                2,

                                driver,
                            );
                            const MakeUp002_priceTSAsCart = await pricingService.getItemTSAs(
                                'OrderCenter',
                                item_forGroupRules,
                            );
                            driver.sleep(0.1 * 1000);
                            switch (account) {
                                case 'Acc01':
                                    expect(MakeUp002_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(1);
                                    expect(Object.keys(MakeUp002_priceTSAsCart.NPMCalcMessage[0])).eql([
                                        'Name',
                                        'Base',
                                        'Conditions',
                                        'New',
                                        'Amount',
                                    ]);
                                    expect(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0].Name,
                                    );
                                    expect(Object.keys(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0])).eql(
                                        ['Name', 'Type', 'Value', 'Amount'],
                                    );
                                    expect(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0]
                                            .Conditions[0].Name,
                                    );
                                    expect(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0]
                                            .Conditions[0].Type,
                                    );
                                    expect(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0]
                                            .Conditions[0].Value,
                                    );
                                    break;

                                default:
                                    expect(MakeUp002_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(0);
                                    expect(Object.keys(MakeUp002_priceTSAsCart.NPMCalcMessage)).eql(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.OtherAcc['7units'],
                                    );
                                    break;
                            }
                            driver.sleep(0.1 * 1000);
                            await pricingService.clearOrderCenterSearch();
                            driver.sleep(0.5 * 1000);
                        });

                        it('Changing "MakeUp003" value to 5 Each and Checking at Order Center (11 units in group)', async function () {
                            item_forGroupRules = 'MakeUp003';
                            await pricingService.searchInOrderCenter.bind(this)(item_forGroupRules, driver);
                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(this)(
                                'Each',
                                item_forGroupRules,
                                5,

                                driver,
                            );
                            const MakeUp003_priceTSAsCart = await pricingService.getItemTSAs(
                                'OrderCenter',
                                item_forGroupRules,
                            );
                            driver.sleep(0.1 * 1000);
                            switch (account) {
                                case 'Acc01':
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(1);
                                    expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage[0])).eql([
                                        'Name',
                                        'Base',
                                        'Conditions',
                                        'New',
                                        'Amount',
                                    ]);
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['11units'][0]
                                            .Name,
                                    );
                                    expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0])).eql(
                                        ['Name', 'Type', 'Value', 'Amount'],
                                    );
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['11units'][0]
                                            .Conditions[0].Name,
                                    );
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['11units'][0]
                                            .Conditions[0].Type,
                                    );
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['11units'][0]
                                            .Conditions[0].Value,
                                    );
                                    break;

                                default:
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(0);
                                    expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage)).eql(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.OtherAcc['11units'],
                                    );
                                    break;
                            }
                            driver.sleep(0.1 * 1000);
                            await pricingService.clearOrderCenterSearch();
                            driver.sleep(0.5 * 1000);
                        });

                        it('Adding "MakeUp006" at quantity of 1 Each and Checking at Order Center (12 units in group)', async function () {
                            item_forGroupRules = 'MakeUp006';
                            await pricingService.searchInOrderCenter.bind(this)(item_forGroupRules, driver);
                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(this)(
                                'Each',
                                item_forGroupRules,
                                1,

                                driver,
                            );
                            const MakeUp006_priceTSAsCart = await pricingService.getItemTSAs(
                                'OrderCenter',
                                item_forGroupRules,
                            );
                            driver.sleep(0.1 * 1000);
                            switch (account) {
                                case 'Acc01':
                                    expect(MakeUp006_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(1);
                                    expect(Object.keys(MakeUp006_priceTSAsCart.NPMCalcMessage[0])).eql([
                                        'Name',
                                        'Base',
                                        'Conditions',
                                        'New',
                                        'Amount',
                                    ]);
                                    expect(MakeUp006_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                            .Name,
                                    );
                                    expect(Object.keys(MakeUp006_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0])).eql(
                                        ['Name', 'Type', 'Value', 'Amount'],
                                    );
                                    expect(MakeUp006_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                            .Conditions[0].Name,
                                    );
                                    expect(MakeUp006_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                            .Conditions[0].Type,
                                    );
                                    expect(MakeUp006_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                            .Conditions[0].Value,
                                    );
                                    expect(MakeUp006_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Amount).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                            .Conditions[0].Amount,
                                    );
                                    break;

                                default:
                                    expect(MakeUp006_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(0);
                                    expect(Object.keys(MakeUp006_priceTSAsCart.NPMCalcMessage)).eql(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.OtherAcc['12units'],
                                    );
                                    break;
                            }
                            driver.sleep(0.1 * 1000);
                            await pricingService.clearOrderCenterSearch();
                            driver.sleep(0.5 * 1000);
                        });

                        it('Changing "MakeUp003" value to 10 Each and Checking at Order Center (additional item from singular rule)', async function () {
                            item_forGroupRules = 'MakeUp003';
                            await pricingService.searchInOrderCenter.bind(this)(item_forGroupRules, driver);
                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(this)(
                                'Each',
                                item_forGroupRules,
                                10,

                                driver,
                            );
                            const MakeUp003_priceTSAsCart = await pricingService.getItemTSAs(
                                'OrderCenter',
                                item_forGroupRules,
                            );
                            driver.sleep(0.1 * 1000);
                            switch (account) {
                                case 'Acc01':
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(1);
                                    expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage[0])).eql(
                                        Object.keys(
                                            pricingData.testItemsValues[item_forGroupRules].NPMCalcMessage[account][
                                                '10units'
                                            ][0],
                                        ),
                                    );
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0].Name).eql(
                                        pricingData.testItemsValues[item_forGroupRules].NPMCalcMessage[account][
                                            '10units'
                                        ][0].Name,
                                    );
                                    expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage[0].Conditions[0])).eql(
                                        Object.keys(
                                            pricingData.testItemsValues[item_forGroupRules].NPMCalcMessage[account][
                                                '10units'
                                            ][0].Conditions[0],
                                        ),
                                    );
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0].Conditions[0].Name).eql(
                                        pricingData.testItemsValues[item_forGroupRules].NPMCalcMessage[account][
                                            '10units'
                                        ][0].Conditions[0].Name,
                                    );
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0].Conditions[0].Type).eql(
                                        pricingData.testItemsValues[item_forGroupRules].NPMCalcMessage[account][
                                            '10units'
                                        ][0].Conditions[0].Type,
                                    );
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0].Conditions[0].Value).eql(
                                        pricingData.testItemsValues[item_forGroupRules].NPMCalcMessage[account][
                                            '10units'
                                        ][0].Conditions[0].Value,
                                    );
                                    break;

                                default:
                                    expect(MakeUp003_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(0);
                                    expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage)).eql(
                                        pricingData.testItemsValues[item_forGroupRules].NPMCalcMessage[account]
                                            .baseline,
                                    );
                                    break;
                            }
                            driver.sleep(0.1 * 1000);
                            await pricingService.clearOrderCenterSearch();
                            driver.sleep(0.5 * 1000);
                        });

                        it('Checking "MakeUp002" at Order Center (7 units in group)', async () => {
                            item_forGroupRules = 'MakeUp002';
                            await pricingService.searchInOrderCenter.bind(this)(item_forGroupRules, driver);
                            const MakeUp002_priceTSAsCart = await pricingService.getItemTSAs(
                                'OrderCenter',
                                item_forGroupRules,
                            );
                            driver.sleep(0.1 * 1000);
                            switch (account) {
                                case 'Acc01':
                                    expect(MakeUp002_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(1);
                                    expect(Object.keys(MakeUp002_priceTSAsCart.NPMCalcMessage[0])).eql([
                                        'Name',
                                        'Base',
                                        'Conditions',
                                        'New',
                                        'Amount',
                                    ]);
                                    expect(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0].Name,
                                    );
                                    expect(Object.keys(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0])).eql(
                                        ['Name', 'Type', 'Value', 'Amount'],
                                    );
                                    expect(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0]
                                            .Conditions[0].Name,
                                    );
                                    expect(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0]
                                            .Conditions[0].Type,
                                    );
                                    break;

                                default:
                                    expect(MakeUp002_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(0);
                                    expect(Object.keys(MakeUp002_priceTSAsCart.NPMCalcMessage)).eql(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.OtherAcc['7units'],
                                    );
                                    break;
                            }
                            driver.sleep(0.1 * 1000);
                            await pricingService.clearOrderCenterSearch();
                            driver.sleep(0.5 * 1000);
                        });

                        it('Adding "MakeUp019" at quantity of 5 Each and Checking at Order Center (12 units in group)', async function () {
                            item_forGroupRules = 'MakeUp019';
                            await pricingService.searchInOrderCenter.bind(this)(item_forGroupRules, driver);
                            await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(this)(
                                'Each',
                                item_forGroupRules,
                                5,

                                driver,
                            );
                            const MakeUp019_priceTSAsCart = await pricingService.getItemTSAs(
                                'OrderCenter',
                                item_forGroupRules,
                            );
                            driver.sleep(0.1 * 1000);
                            switch (account) {
                                case 'Acc01':
                                    expect(MakeUp019_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(1);
                                    expect(Object.keys(MakeUp019_priceTSAsCart.NPMCalcMessage[0])).eql([
                                        'Name',
                                        'Base',
                                        'Conditions',
                                        'New',
                                        'Amount',
                                    ]);
                                    expect(MakeUp019_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                            .Name,
                                    );
                                    expect(Object.keys(MakeUp019_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0])).eql(
                                        ['Name', 'Type', 'Value', 'Amount'],
                                    );
                                    expect(MakeUp019_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                            .Conditions[0].Name,
                                    );
                                    expect(MakeUp019_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type).equals(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                            .Conditions[0].Type,
                                    );
                                    break;

                                default:
                                    expect(MakeUp019_priceTSAsCart.NPMCalcMessage).to.be.an('array').with.lengthOf(0);
                                    expect(Object.keys(MakeUp019_priceTSAsCart.NPMCalcMessage)).eql(
                                        pricingData.testItemsValues.BeautyMakeUp.NPMCalcMessage.OtherAcc['12units'],
                                    );
                                    break;
                            }
                            driver.sleep(0.1 * 1000);
                            await pricingService.clearOrderCenterSearch();
                            driver.sleep(0.5 * 1000);
                        });
                    });

                    describe('CART', () => {
                        it('Entering and verifying being in Cart', async () => {
                            driver.sleep(0.1 * 1000);
                            await driver.click(orderPage.HtmlBody);
                            await driver.untilIsVisible(orderPage.getSelectorOfItemInOrderCenterByName(''));
                            driver.sleep(0.1 * 1000);
                            await driver.click(orderPage.Cart_Button);
                            await driver.untilIsVisible(orderPage.Cart_Totals);
                            driver.sleep(0.1 * 1000);
                        });
                        it('Checking Cart', async () => {
                            // TODO
                            driver.sleep(1 * 1000);
                        });
                        it('Click "Submit" button', async () => {
                            await orderPage.isSpinnerDone();
                            await driver.untilIsVisible(orderPage.Cart_Total_Header);
                            await driver.click(orderPage.Cart_Submit_Button);
                            driver.sleep(0.1 * 1000);
                        });
                    });
                });

                describe('Read Only', () => {
                    it('entering the same transaction post submission, checking the latest activity - ID', async function () {
                        await webAppList.isSpinnerDone();
                        await webAppList.untilIsVisible(webAppList.Activities_TopActivityInList_ID);
                        const latestActivityID = await (
                            await driver.findElement(webAppList.Activities_TopActivityInList_ID)
                        ).getAttribute('title');
                        await driver.click(webAppList.HtmlBody);
                        expect(Number(latestActivityID)).to.equal(transactionInternalID);
                    });
                    it('checking the latest activity - type: Sales Order', async function () {
                        base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Checking the latest activity`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                        await webAppList.untilIsVisible(webAppList.Activities_TopActivityInList_Type);
                        const latestActivityType = await (
                            await driver.findElement(webAppList.Activities_TopActivityInList_Type)
                        ).getAttribute('title');
                        await driver.click(webAppList.HtmlBody);
                        expect(latestActivityType).to.equal('Sales Order');
                    });
                    it('checking the latest activity - status: Submitted', async () => {
                        await webAppList.untilIsVisible(webAppList.Activities_TopActivityInList_Status);
                        const latestActivityStatus = await (
                            await driver.findElement(webAppList.Activities_TopActivityInList_Status)
                        ).getAttribute('title');
                        await driver.click(webAppList.HtmlBody);
                        expect(latestActivityStatus).to.equal('Submitted');
                    });
                    it('changing values in "PPM_Values" UDT', async () => {
                        const tableName = 'PPM_Values';

                        updatedUDTRowPOST = await objectsService.postUDT({
                            MapDataExternalID: tableName,
                            MainKey: 'ZDS3@A001@Drug0004',
                            SecondaryKey: '',
                            Values: [
                                '[[true,"1555891200000","2534022144999","1","","additionalItem",[[6,"D",100,"%","",1,"EA","Drug0002",0]],"EA"]]',
                            ],
                        });
                        expect(updatedUDTRowPOST).to.deep.include({
                            MapDataExternalID: tableName,
                            MainKey: 'ZDS3@A001@Drug0004',
                            SecondaryKey: null,
                            Values: [
                                '[[true,"1555891200000","2534022144999","1","","additionalItem",[[6,"D",100,"%","",1,"EA","Drug0002",0]],"EA"]]',
                            ],
                        });
                        expect(updatedUDTRowPOST).to.have.property('CreationDateTime').that.contains('Z');
                        expect(updatedUDTRowPOST)
                            .to.have.property('ModificationDateTime')
                            .that.contains(new Date().toISOString().split('T')[0]);
                        expect(updatedUDTRowPOST).to.have.property('ModificationDateTime').that.contains('Z');
                        expect(updatedUDTRowPOST).to.have.property('Hidden').that.is.false;
                        expect(updatedUDTRowPOST).to.have.property('InternalID').that.is.above(0);
                    });
                    it('performing sync', async () => {
                        await webAppHeader.goHome();
                        driver.sleep(0.2 * 1000);
                        await webAppHomePage.isSpinnerDone();
                        await webAppHomePage.manualResync(client);
                    });
                    it('validating "PPM_Values" UDT values via API', async () => {
                        const tableName = 'PPM_Values';
                        const updatedUDT = await objectsService.getUDT({
                            where: "MapDataExternalID='" + tableName + "'",
                            page_size: -1,
                        });
                        console.info('updatedUDT: ', JSON.stringify(updatedUDT, null, 2));
                        expect(updatedUDT)
                            .to.be.an('array')
                            .with.lengthOf(Object.keys(pricingData.documentsIn_PPM_Values).length);
                        // Add verification tests
                    });
                    it(`navigating to the account "${
                        account == 'Acc01' ? 'My Store' : 'Account for order scenarios'
                    }"`, async function () {
                        await webAppHomePage.clickOnBtn('Accounts');
                        await webAppHeader.isSpinnerDone();
                        driver.sleep(0.1 * 1000);
                        addContext(this, {
                            title: `About to select account "${account}"`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                        await webAppList.clickOnFromListRowWebElementByName(accountName);
                        await webAppList.isSpinnerDone();
                        await webAppList.clickOnLinkFromListRowWebElementByText(`${accountName}`);
                        await webAppList.isSpinnerDone();
                        base64ImageComponent = await driver.saveScreenshots();
                    });
                    it('entering the same transaction through activity list', async function () {
                        await webAppList.untilIsVisible(webAppList.Activities_TopActivityInList_ID);
                        base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `At activity list - before entering the trasaction`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                        await webAppList.clickOnLinkFromListRowWebElement();
                        await webAppList.isSpinnerDone();
                        await driver.untilIsVisible(orderPage.getSelectorOfItemInCartByName(''));
                        try {
                            await driver.findElement(orderPage.Cart_Submit_Button);
                        } catch (error) {
                            const caughtError: any = error;
                            expect(caughtError.message).to.equal(
                                `After wait time of: 15000, for selector of '//button[@data-qa="Submit"]', The test must end, The element is: undefined`,
                            );
                        }
                        try {
                            await driver.findElement(orderPage.Cart_ContinueOrdering_Button);
                        } catch (error) {
                            const caughtError: any = error;
                            expect(caughtError.message).to.equal(
                                `After wait time of: 15000, for selector of '//button[@data-qa="Continue ordering"]', The test must end, The element is: undefined`,
                            );
                        }
                        driver.sleep(0.1 * 1000);
                        base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Entered the trasaction`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                    });
                    it('reverting values in "PPM_Values" UDT to the original values', async () => {
                        const tableName = 'PPM_Values';
                        updatedUDTRowPOST = await objectsService.postUDT({
                            MapDataExternalID: tableName,
                            MainKey: 'ZDS3@A001@Drug0004',
                            SecondaryKey: '',
                            Values: [
                                '[[true,"1555891200000","2534022144999","1","","additionalItem",[[3,"D",100,"%","",2,"EA","Drug0002",0]],"CS"]]',
                            ],
                        });
                        expect(updatedUDTRowPOST).to.deep.include({
                            MapDataExternalID: tableName,
                            MainKey: 'ZDS3@A001@Drug0004',
                            SecondaryKey: null,
                            Values: [
                                '[[true,"1555891200000","2534022144999","1","","additionalItem",[[3,"D",100,"%","",2,"EA","Drug0002",0]],"CS"]]',
                            ],
                        });
                        expect(updatedUDTRowPOST).to.have.property('CreationDateTime').that.contains('Z');
                        expect(updatedUDTRowPOST)
                            .to.have.property('ModificationDateTime')
                            .that.contains(new Date().toISOString().split('T')[0]);
                        expect(updatedUDTRowPOST).to.have.property('ModificationDateTime').that.contains('Z');
                        expect(updatedUDTRowPOST).to.have.property('Hidden').that.is.false;
                        expect(updatedUDTRowPOST).to.have.property('InternalID').that.is.above(0);
                    });
                    it('performing sync', async () => {
                        await webAppHeader.goHome();
                        driver.sleep(0.2 * 1000);
                        await webAppHomePage.isSpinnerDone();
                        await webAppHomePage.manualResync(client);
                    });
                    it('validating "PPM_Values" UDT values via API', async () => {
                        const ppmVluesEnd = await objectsService.getUDT({
                            where: "MapDataExternalID='PPM_Values'",
                            page_size: -1,
                        });

                        expect(ppmVluesEnd.length).equals(Object.keys(pricingData.documentsIn_PPM_Values).length);
                        ppmVluesEnd.forEach((tableRow) => {
                            expect(tableRow['Values'][0]).equals(pricingData.documentsIn_PPM_Values[tableRow.MainKey]);
                        });
                    });
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
                    // await webAppList.clickOnPencilMenuButton();
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
