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
import PricingRules from '../../../pom/addons/PricingRules';
import GeneralService from '../../../../services/general.service';
import addContext from 'mochawesome/addContext';
import E2EUtils from '../../../utilities/e2e_utils';
import { PricingData07 } from '../../../pom/addons/PricingData07';
import { PricingDataNoUom } from '../../../pom/addons/PricingDataNoUom';

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
    let base64ImageComponent;

    const nameOfAccount = 'My Store';
    const testAccounts = ['Acc01', 'OtherAcc'];
    const testDates = ['CurrentDate', '15Dec2023', '30Nov2023'];
    const deliveryDateTestItems = ['Frag007'];
    const deliveryDateTestStates = ['baseline', '1 Each', '2 Each', '3 Each'];
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

            it('Login', async function () {
                await webAppLoginPage.login(email, password);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });

            it('Manual Resync', async () => {
                await e2eutils.performManualResync.bind(this)(client, driver);
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
                });
            });

            testDates.forEach((date) => {
                describe(`Testing ${
                    date == 'CurrentDate'
                        ? `Current Date (${dateTime.toISOString().split('T')[0]})`
                        : 'DATE - 15 Dec 2023'
                }`, function () {
                    it('Creating new transaction', async function () {
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
                                            const priceTSA_Discount2 = await pricingService.getItemTSAs_Discount2(
                                                'OrderCenter',
                                                deliveryDateTestItem,
                                            );
                                            console.info(
                                                `${deliveryDateTestItem} ${deliveryDateTestState} priceTSA_Discount2:`,
                                                priceTSA_Discount2,
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
                                            // if (deliveryDateTestState === 'baseline') {
                                            //     const UI_NPMCalcMessage = priceTSAs['NPMCalcMessage'];
                                            //     const baseline_NPMCalcMessage =
                                            //         pricingData.testItemsValues.DeliveryDate[deliveryDateTestItem][
                                            //             'NPMCalcMessage'
                                            //         ][date][deliveryDateTestState];
                                            //     addContext(this, {
                                            //         title: `State Args`,
                                            //         value: `NPMCalcMessage from UI: ${JSON.stringify(
                                            //             UI_NPMCalcMessage,
                                            //         )}, NPMCalcMessage (at baseline) from Data: ${JSON.stringify(
                                            //             baseline_NPMCalcMessage,
                                            //         )}`,
                                            //     });
                                            //     expect(UI_NPMCalcMessage.length).equals(baseline_NPMCalcMessage.length);
                                            // } else {
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
                                            // expect(UI_NPMCalcMessage.length).equals(
                                            //     baseline_NPMCalcMessage.length + data_NPMCalcMessage.length,
                                            // );
                                            // }
                                            expect(UI_NPMCalcMessage.length).equals(data_NPMCalcMessage.length);
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
