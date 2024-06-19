import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import { Browser } from '../../../utilities/browser';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppTopBar } from '../../../pom';
import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import { OrderPage } from '../../../pom/Pages/OrderPage';
import { ObjectsService } from '../../../../services';
import { PricingService } from '../../../../services/pricing.service';
import { PricingData07 } from '../../../pom/addons/PricingData07';
import PricingRules from '../../../pom/addons/PricingRules';
import GeneralService from '../../../../services/general.service';
import addContext from 'mochawesome/addContext';

chai.use(promised);

export async function PricingDeliveryDatePackagesTests(email: string, password: string, client: Client) {
    /*
________________________ 
_________________ Brief:
          
* Pricing Promotion Packages test 
    TODO

* DI-27332 :
    1. Package transaction - test for pricing in package

    2. Sales order - test for group pricing calculation using packages lines
_________________ 
_________________ The Relevant Blocks:
            
. 'Base' -> ['ZBASE']
. 'Discount' -> ['ZDS1', 'ZDS2', 'ZDS3']
. 'GroupDiscount' -> ['ZGD1', 'ZGD2']
. 'ManualLine' -> []
. 'Tax' -> ['MTAX']

_________________ 
_________________ The Relevant Conditions:
            
. 'ZBASE' -> ['A002', 'A001', 'A003', 'A005', 'A004']
. 'ZDS1' -> ['A001', 'A002', 'A003']
. 'ZDS2' -> ['A002']
. 'ZDS3' -> ['A001']
. 'ZDS4' -> ['A001']
. 'ZDS5' -> ['A001']
. 'ZDS6' -> ['A003', 'A004', 'A001']
. 'ZDS7' -> ['A002', 'A004', 'A005']
. 'ZGD1' -> ['A002', 'A003']
. 'ZGD2' -> ['A004', 'A003', 'A002']
. 'MTAX' -> ['A002', 'A004']

_________________ 
_________________ The Relevant Tables:
    
. 'A001' -> ['ItemExternalID']
. 'A002' -> ['TransactionAccountExternalID', 'ItemExternalID']
. 'A003' -> ['TransactionAccountExternalID', 'ItemMainCategory']
. 'A004' -> ['TransactionAccountExternalID']
. 'A005' -> ['ItemMainCategory']
. 'A006' -> ['TransactionAccountTSAPricingContracts']
. 'A007' -> ['TransactionAccountTSAPricingContracts', 'ItemMainCategory']
. 'A008' -> ['TransactionAccountTSAPricingContracts', 'ItemExternalID']
. 'A009' -> ['TransactionAccountExternalID', 'TransactionAccountTSAPricingContracts']
. 'A010' -> ['TransactionAccountExternalID', 'TransactionAccountTSAPricingContracts', 'ItemExternalID']
. 'A011' -> ['TransactionAccountTSAPricingHierarchy', 'ItemExternalID']
_________________ 
_________________ The Relevant Rules:
          
. 'ZBASE@A005@dummyItem': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",100,"P"]]]]',
 
_________________ 
_________________ Order Of Actions:
          
1. Looping over accounts
 
_________________ 
_________________ 
*/
    const dateTime = new Date();
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const pricingData = new PricingData07();
    const pricingRules = new PricingRules();
    const udtFirstTableName = 'PPM_Values';

    const installedPricingVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Pricing',
    )?.Version;

    console.info('Installed Pricing Version: ', JSON.stringify(installedPricingVersion, null, 2));

    const ppmValues_content = {
        ...pricingRules[udtFirstTableName].features05,
        ...pricingRules[udtFirstTableName].features06,
        ...pricingRules[udtFirstTableName].features07,
    };

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
    const deliveryDateTestItems = ['Frag007'];
    const deliveryDateTestStates = ['baseline', '1 Each', '2 Each', '3 Each'];
    // const packagesTestItems = ['Hair001', 'Hair002', 'Hair012'];
    // const packagesTestStates = ['baseline', '1 Each', '5 Case', '3 Box'];
    const priceFields = [
        'PriceBaseUnitPriceAfter1',
        'PriceDiscountUnitPriceAfter1',
        'PriceGroupDiscountUnitPriceAfter1',
        'PriceManualLineUnitPriceAfter1',
        'PriceTaxUnitPriceAfter1',
    ];

    if (!installedPricingVersion?.startsWith('0.5') && !installedPricingVersion?.startsWith('0.6')) {
        describe(`Pricing ** Delivery Date & Packages ** UI tests  - ${
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

                    describe('Delivery Date', () => {
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
                                            if (deliveryDateTestState === 'baseline') {
                                                const UI_NPMCalcMessage = priceTSAs['NPMCalcMessage'];
                                                const baseline_NPMCalcMessage =
                                                    pricingData.testItemsValues.DeliveryDate[deliveryDateTestItem][
                                                        'NPMCalcMessage'
                                                    ][account][deliveryDateTestState];
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
                                                    pricingData.testItemsValues.DeliveryDate[deliveryDateTestItem][
                                                        'NPMCalcMessage'
                                                    ][account]['baseline'];
                                                const data_NPMCalcMessage =
                                                    pricingData.testItemsValues.DeliveryDate[deliveryDateTestItem][
                                                        'NPMCalcMessage'
                                                    ][account][deliveryDateTestState];
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
                                                expect(UI_NPMCalcMessage.length).equals(
                                                    baseline_NPMCalcMessage.length + data_NPMCalcMessage.length,
                                                );
                                            }
                                            priceFields.forEach((priceField) => {
                                                const fieldValue = priceTSAs[priceField];
                                                const expectedFieldValue =
                                                    pricingData.testItemsValues.DeliveryDate[deliveryDateTestItem][
                                                        priceField
                                                    ][account][deliveryDateTestState];
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
                        });
                    });

                    // describe('Packages', () => {
                    //     it('Navigating to "Hair4You" at Sidebar', async function () {
                    //         await driver.untilIsVisible(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                    //         await driver.click(orderPage.getSelectorOfSidebarSectionInOrderCenterByName('Hair4You'));
                    //         driver.sleep(0.1 * 1000);
                    //     });
                    //     packagesTestItems.forEach((packagesTestItem) => {
                    //         describe(`Item: ***${packagesTestItem}`, function () {
                    //             describe('ORDER CENTER', function () {
                    //                 it(`Looking for "${packagesTestItem}" using the search box`, async function () {
                    //                     await pricingService.searchInOrderCenter.bind(this)(packagesTestItem, driver);
                    //                     driver.sleep(1 * 1000);
                    //                 });
                    //                 packagesTestStates.forEach((packagesTestState) => {
                    //                     it(`Checking "${packagesTestState}"`, async function () {
                    //                         if (packagesTestState != 'baseline') {
                    //                             const splitedStateArgs = packagesTestState.split(' ');
                    //                             const chosenUOM = splitedStateArgs[1];
                    //                             const amount = Number(splitedStateArgs[0]);
                    //                             addContext(this, {
                    //                                 title: `State Args`,
                    //                                 value: `Chosen UOM: ${chosenUOM}, Amount: ${amount}`,
                    //                             });
                    //                             await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                    //                                 this,
                    //                             )(chosenUOM, packagesTestItem, amount, driver);
                    //                         }
                    //                         const priceTSAs = await pricingService.getItemTSAs(
                    //                             'OrderCenter',
                    //                             packagesTestItem,
                    //                         );
                    //                         console.info(
                    //                             `${packagesTestItem} ${packagesTestState} priceTSAs:`,
                    //                             priceTSAs,
                    //                         );
                    //                         expect(typeof priceTSAs).equals('object');
                    //                         expect(Object.keys(priceTSAs)).to.eql([
                    //                             'PriceBaseUnitPriceAfter1',
                    //                             'PriceDiscountUnitPriceAfter1',
                    //                             'PriceGroupDiscountUnitPriceAfter1',
                    //                             'PriceManualLineUnitPriceAfter1',
                    //                             'PriceTaxUnitPriceAfter1',
                    //                             'NPMCalcMessage',
                    //                         ]);
                    //                         if (packagesTestState === 'baseline') {
                    //                             const UI_NPMCalcMessage = priceTSAs['NPMCalcMessage'];
                    //                             const baseline_NPMCalcMessage =
                    //                                 pricingData.testItemsValues.Packages[packagesTestItem][
                    //                                     'NPMCalcMessage'
                    //                                 ][account][packagesTestState];
                    //                             addContext(this, {
                    //                                 title: `State Args`,
                    //                                 value: `NPMCalcMessage from UI: ${JSON.stringify(
                    //                                     UI_NPMCalcMessage,
                    //                                 )}, NPMCalcMessage (at baseline) from Data: ${JSON.stringify(
                    //                                     baseline_NPMCalcMessage,
                    //                                 )}`,
                    //                             });
                    //                             expect(UI_NPMCalcMessage.length).equals(baseline_NPMCalcMessage.length);
                    //                         } else {
                    //                             const UI_NPMCalcMessage = priceTSAs['NPMCalcMessage'];
                    //                             const baseline_NPMCalcMessage =
                    //                                 pricingData.testItemsValues.Packages[packagesTestItem][
                    //                                     'NPMCalcMessage'
                    //                                 ][account]['baseline'];
                    //                             const data_NPMCalcMessage =
                    //                                 pricingData.testItemsValues.Packages[packagesTestItem][
                    //                                     'NPMCalcMessage'
                    //                                 ][account][packagesTestState];
                    //                             addContext(this, {
                    //                                 title: `State Args`,
                    //                                 value: `NPMCalcMessage from UI: ${JSON.stringify(
                    //                                     UI_NPMCalcMessage,
                    //                                     null,
                    //                                     2,
                    //                                 )}, \nNPMCalcMessage (at baseline) from Data: ${JSON.stringify(
                    //                                     baseline_NPMCalcMessage,
                    //                                     null,
                    //                                     2,
                    //                                 )}, \nNPMCalcMessage (at ${packagesTestState}) from Data: ${JSON.stringify(
                    //                                     data_NPMCalcMessage,
                    //                                     null,
                    //                                     2,
                    //                                 )}`,
                    //                             });
                    //                             expect(UI_NPMCalcMessage.length).equals(
                    //                                 baseline_NPMCalcMessage.length + data_NPMCalcMessage.length,
                    //                             );
                    //                         }
                    //                         priceFields.forEach((priceField) => {
                    //                             const fieldValue = priceTSAs[priceField];
                    //                             const expectedFieldValue =
                    //                                 pricingData.testItemsValues.Packages[packagesTestItem][priceField][
                    //                                     account
                    //                                 ][packagesTestState];
                    //                             addContext(this, {
                    //                                 title: `${priceField}`,
                    //                                 value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}`,
                    //                             });
                    //                             expect(fieldValue).equals(expectedFieldValue);
                    //                         });
                    //                         driver.sleep(0.2 * 1000);
                    //                     });
                    //                 });
                    //             });
                    //         });
                    //     });
                    // });
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
