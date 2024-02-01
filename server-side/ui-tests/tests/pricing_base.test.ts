import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService, { ConsoleColors } from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Browser } from '../utilities/browser';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppTopBar } from '../pom';
import { ObjectsService } from '../../services';
import { OrderPage } from '../pom/Pages/OrderPage';
import { PricingData05 } from '../pom/addons/Pricing05';
import { PricingData06 } from '../pom/addons/Pricing06';
import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import { PricingService } from '../../services/pricing.service';
import { PricingData07 } from '../pom/addons/Pricing07';

chai.use(promised);

export async function PricingBaseTests(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const installedPricingVersionLong = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'pricing',
    )?.Version;
    const installedPricingVersion = installedPricingVersionLong?.split('.')[1];
    console.info('Installed Pricing Version: 0.', JSON.stringify(installedPricingVersion, null, 2));
    let pricingData;
    switch (true) {
        case installedPricingVersion === '5':
            pricingData = new PricingData05();
            break;
        case installedPricingVersion === '6':
            pricingData = new PricingData06();
            break;

        default:
            pricingData = new PricingData07();
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
    let ppmVluesEnd: UserDefinedTableRow[];

    const tableName = 'PPM_Values';
    const dummyPPM_Values_length = 49999;
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

    describe(`Pricing Base UI tests | Ver ${installedPricingVersionLong}`, () => {
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

        it('inserting valid rules to the UDT "PPM_Values"', async () => {
            const dataToBatch: {
                MapDataExternalID: string;
                MainKey: string;
                SecondaryKey: string;
                Values: string[];
            }[] = [];
            Object.keys(pricingData.documentsIn_PPM_Values).forEach((mainKey) => {
                dataToBatch.push({
                    MapDataExternalID: pricingData.tableName,
                    MainKey: mainKey,
                    SecondaryKey: '',
                    Values: [pricingData.documentsIn_PPM_Values[mainKey]],
                });
            });
            const batchUDTresponse = await objectsService.postBatchUDT(dataToBatch);
            expect(batchUDTresponse).to.be.an('array').with.lengthOf(dataToBatch.length);
            console.info('insertion to PPM_Values RESPONSE: ', JSON.stringify(batchUDTresponse, null, 2));
            batchUDTresponse.map((row) => {
                expect(row).to.have.property('InternalID').that.is.above(0);
                expect(row).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000');
                expect(row).to.have.property('Status').that.is.oneOf(['Insert', 'Ignore', 'Update']);
                expect(row)
                    .to.have.property('Message')
                    .that.is.oneOf([
                        'Row inserted.',
                        'No changes in this row. The row is being ignored.',
                        'Row updated.',
                    ]);
                expect(row)
                    .to.have.property('URI')
                    .that.equals('/user_defined_tables/' + row.InternalID);
            });
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
                    duration = await (await driver.findElement(orderPage.Duration_Span)).getAttribute('title');
                    console.info(`DURATION at Sales Order Load: ${duration}`);
                    addContext(this, {
                        title: `Sales Order - Loading Time`,
                        value: `${duration} ms`,
                    });
                    const duration_num = Number(duration);
                    expect(typeof duration_num).equals('number');
                    expect(duration_num).to.be.below(550);
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
                                switch (state) {
                                    case 'baseline':
                                        expect(priceTSAs['NPMCalcMessage'].length).equals(
                                            pricingData.testItemsValues[item.name]['NPMCalcMessage'][account][state]
                                                .length,
                                        );
                                        break;

                                    default:
                                        expect(priceTSAs['NPMCalcMessage'].length).equals(
                                            pricingData.testItemsValues[item.name]['NPMCalcMessage'][account][
                                                'baseline'
                                            ].length +
                                                pricingData.testItemsValues[item.name]['NPMCalcMessage'][account][state]
                                                    .length,
                                        );
                                        break;
                                }
                                priceFields.forEach((priceField) => {
                                    expect(priceTSAs[priceField]).equals(
                                        pricingData.testItemsValues[item.name][priceField][account][state],
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
                                    it(`checking item "${item.name}"`, async () => {
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
                                            expect(priceTSAs[priceField]).equals(
                                                pricingData.testItemsValues[item.name][priceField][account][state],
                                            );
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

            it('deleting valid rules from the UDT "PPM_Values"', async () => {
                const valueObjs: UserDefinedTableRow[] = [];
                const validPPM_ValuesKeys = Object.keys(pricingData.documentsIn_PPM_Values);
                const deleteResponses = await Promise.all(
                    validPPM_ValuesKeys.map(async (validPPM_Key) => {
                        const valueObj: UserDefinedTableRow | undefined = ppmVluesEnd.find((listing) => {
                            if (listing.MainKey === validPPM_Key) return listing;
                        });
                        console.info(
                            'validPPM_Key:',
                            validPPM_Key,
                            ', validPPM_ValueObj: ',
                            JSON.stringify(valueObj, null, 2),
                        );
                        if (valueObj) {
                            console.info('valueObj EXIST!');
                            valueObjs.push(valueObj);
                            valueObj.Hidden = true;
                            return await objectsService.postUDT(valueObj);
                        }
                    }),
                );
                expect(valueObjs.length).equals(validPPM_ValuesKeys.length);
                deleteResponses.forEach((deleteUDTresponse) => {
                    console.info(
                        `${deleteUDTresponse?.MainKey} Delete RESPONSE: `,
                        JSON.stringify(deleteUDTresponse, null, 2),
                    );
                    if (deleteUDTresponse) {
                        console.info('UDT delete response exist!');
                        const PPMvalue = pricingData.documentsIn_PPM_Values[deleteUDTresponse.MainKey];
                        expect(deleteUDTresponse).to.deep.include({
                            MapDataExternalID: tableName,
                            SecondaryKey: null,
                            Values: [PPMvalue],
                        });
                        expect(deleteUDTresponse).to.have.property('MainKey');
                        expect(deleteUDTresponse).to.have.property('CreationDateTime').that.contains('Z');
                        expect(deleteUDTresponse)
                            .to.have.property('ModificationDateTime')
                            .that.contains(new Date().toISOString().split('T')[0]);
                        expect(deleteUDTresponse).to.have.property('ModificationDateTime').that.contains('Z');
                        expect(deleteUDTresponse).to.have.property('Hidden').that.is.true;
                        expect(deleteUDTresponse).to.have.property('InternalID');
                    }
                });
            });

            it('performing sync', async () => {
                await webAppHeader.goHome();
                driver.sleep(0.2 * 1000);
                await webAppHomePage.isSpinnerDone();
                await webAppHomePage.manualResync(client);
            });

            it('validating "PPM_Values" UDT values via API', async () => {
                ppmVluesEnd = await objectsService.getUDT({
                    where: `MapDataExternalID='${tableName}'`,
                    page_size: -1,
                });
                expect(ppmVluesEnd.length).equals(dummyPPM_Values_length);
            });
        });
    });
}
