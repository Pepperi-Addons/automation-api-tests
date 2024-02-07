import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Browser } from '../utilities/browser';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppTopBar } from '../pom';
// import { ObjectsService } from '../../services';
import { OrderPage } from '../pom/Pages/OrderPage';
import { PricingService } from '../../services/pricing.service';
import { PricingData06 } from '../pom/addons/Pricing06';
// import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';

chai.use(promised);

export async function PricingUomTests(email: string, password: string, client: Client) {
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
    let transactionUUID_OtherAcc: string;
    let accountName: string;
    // let ppmVluesEnd: UserDefinedTableRow[];
    let duration: string;
    let base64ImageComponent;

    const pricingData = new PricingData06();
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

    if (installedPricingVersionShort !== '5') {
        describe(`Pricing UOM UI tests  - ${
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

            // it('inserting valid rules to the UDT "PPM_Values"', async () => {
            //     const dataToBatch: {
            //         MapDataExternalID: string;
            //         MainKey: string;
            //         SecondaryKey: string;
            //         Values: string[];
            //     }[] = [];
            //     Object.keys(pricingData.documentsIn_PPM_Values).forEach((mainKey) => {
            //         dataToBatch.push({
            //             MapDataExternalID: pricingData.tableName,
            //             MainKey: mainKey,
            //             SecondaryKey: '',
            //             Values: [pricingData.documentsIn_PPM_Values[mainKey]],
            //         });
            //     });
            //     const batchUDTresponse = await objectsService.postBatchUDT(dataToBatch);
            //     expect(batchUDTresponse).to.be.an('array').with.lengthOf(dataToBatch.length);
            //     console.info('insertion to PPM_Values RESPONSE: ', JSON.stringify(batchUDTresponse, null, 2));
            //     batchUDTresponse.map((row) => {
            //         expect(row).to.have.property('InternalID').that.is.above(0);
            //         expect(row).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000');
            //         expect(row).to.have.property('Status').that.is.oneOf(['Insert', 'Ignore', 'Update']);
            //         expect(row)
            //             .to.have.property('Message')
            //             .that.is.oneOf([
            //                 'Row inserted.',
            //                 'No changes in this row. The row is being ignored.',
            //                 'Row updated.',
            //             ]);
            //         expect(row)
            //             .to.have.property('URI')
            //             .that.equals('/user_defined_tables/' + row.InternalID);
            //     });
            // });

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
                        expect(duration_num).to.be.below(limit);
                    });

                    describe('UOMs', () => {
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
                                                    pricingData.testItemsValues[uomTestItem]['NPMCalcMessage'][account][
                                                        uomTestState
                                                    ];
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
                                                    pricingData.testItemsValues[uomTestItem]['NPMCalcMessage'][account][
                                                        'baseline'
                                                    ];
                                                const data_NPMCalcMessage =
                                                    pricingData.testItemsValues[uomTestItem]['NPMCalcMessage'][account][
                                                        uomTestState
                                                    ];
                                                addContext(this, {
                                                    title: `State Args`,
                                                    value: `NPMCalcMessage from UI: ${JSON.stringify(
                                                        UI_NPMCalcMessage,
                                                    )}, NPMCalcMessage (at baseline) from Data: ${JSON.stringify(
                                                        baseline_NPMCalcMessage,
                                                    )}, NPMCalcMessage (at ${uomTestState}) from Data: ${JSON.stringify(
                                                        data_NPMCalcMessage,
                                                    )}`,
                                                });
                                                expect(UI_NPMCalcMessage.length).equals(
                                                    baseline_NPMCalcMessage.length + data_NPMCalcMessage.length,
                                                );
                                            }
                                            priceFields.forEach((priceField) => {
                                                const fieldValue = priceTSAs[priceField];
                                                const expectedFieldValue =
                                                    pricingData.testItemsValues[uomTestItem][priceField][account][
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
                                base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `After "Line View" was selected`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
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
                                base64ImageComponent = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `At Cart`,
                                    value: 'data:image/png;base64,' + base64ImageComponent,
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
                                                pricingData.testItemsValues[itemName][priceField][account][
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

            describe('Cleanup', () => {
                // it('getting "PPM_Values" UDT values via API', async () => {
                //     ppmVluesEnd = await objectsService.getUDT({
                //         where: `MapDataExternalID='${pricingData.tableName}'`,
                //         page_size: -1,
                //     });
                //     expect(ppmVluesEnd.length).equals(
                //         Object.keys(pricingData.documentsIn_PPM_Values).length + pricingData.dummyPPM_Values_length,
                //     );
                // });

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

                // it('deleting valid rules from the UDT "PPM_Values"', async () => {
                //     const valueObjs: UserDefinedTableRow[] = [];
                //     const validPPM_ValuesKeys = Object.keys(pricingData.documentsIn_PPM_Values);
                //     const deleteResponses = await Promise.all(
                //         validPPM_ValuesKeys.map(async (validPPM_Key) => {
                //             const valueObj: UserDefinedTableRow | undefined = ppmVluesEnd.find((listing) => {
                //                 if (listing.MainKey === validPPM_Key) return listing;
                //             });
                //             console.info(
                //                 'validPPM_Key:',
                //                 validPPM_Key,
                //                 ', validPPM_ValueObj: ',
                //                 JSON.stringify(valueObj, null, 2),
                //             );
                //             if (valueObj) {
                //                 console.info('valueObj EXIST!');
                //                 valueObjs.push(valueObj);
                //                 valueObj.Hidden = true;
                //                 return await objectsService.postUDT(valueObj);
                //             }
                //         }),
                //     );
                //     expect(valueObjs.length).equals(validPPM_ValuesKeys.length);
                //     deleteResponses.forEach((deleteUDTresponse) => {
                //         console.info(
                //             `${deleteUDTresponse?.MainKey} Delete RESPONSE: `,
                //             JSON.stringify(deleteUDTresponse, null, 2),
                //         );
                //         if (deleteUDTresponse) {
                //             console.info('UDT delete response exist!');
                //             const PPMvalue = pricingData.documentsIn_PPM_Values[deleteUDTresponse.MainKey];
                //             expect(deleteUDTresponse).to.deep.include({
                //                 MapDataExternalID: pricingData.tableName,
                //                 SecondaryKey: null,
                //                 Values: [PPMvalue],
                //             });
                //             expect(deleteUDTresponse).to.have.property('MainKey');
                //             expect(deleteUDTresponse).to.have.property('CreationDateTime').that.contains('Z');
                //             expect(deleteUDTresponse)
                //                 .to.have.property('ModificationDateTime')
                //                 .that.contains(new Date().toISOString().split('T')[0]);
                //             expect(deleteUDTresponse).to.have.property('ModificationDateTime').that.contains('Z');
                //             expect(deleteUDTresponse).to.have.property('Hidden').that.is.true;
                //             expect(deleteUDTresponse).to.have.property('InternalID');
                //         }
                //     });
                // });

                // it('performing sync', async () => {
                //     await webAppHeader.goHome();
                //     driver.sleep(0.2 * 1000);
                //     await webAppHomePage.isSpinnerDone();
                //     await webAppHomePage.manualResync(client);
                // });

                // it('validating "PPM_Values" UDT values via API', async () => {
                //     ppmVluesEnd = await objectsService.getUDT({
                //         where: `MapDataExternalID='${pricingData.tableName}'`,
                //         page_size: -1,
                //     });
                //     expect(ppmVluesEnd.length).equals(pricingData.dummyPPM_Values_length);
                // });
            });
        });
    }
}
