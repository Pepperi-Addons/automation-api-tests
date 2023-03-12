import { describe, it, before, after, afterEach } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { Browser } from '../utilities/browser';
import {
    WebAppDialog,
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppLoginPage,
    WebAppSettingsSidePanel,
    WebAppTopBar,
} from '../pom';
// import E2EUtils from '../utilities/e2e_utils';
import { ObjectsService } from '../../services';
import { OrderPage } from '../pom/Pages/OrderPage';

chai.use(promised);

export async function PricingTests(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);

    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let webAppList: WebAppList;
    let webAppTopBar: WebAppTopBar;
    let webAppDialog: WebAppDialog;
    let settingsSidePanel: WebAppSettingsSidePanel;
    let orderPage: OrderPage;
    // let randomString: string;
    // let e2eUtils: E2EUtils;
    let batchUDTresponse;
    let itemName;

    describe('Pricing Test Suite', async () => {
        describe('Pricing UI tests', () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                webAppList = new WebAppList(driver);
                webAppTopBar = new WebAppTopBar(driver);
                webAppDialog = new WebAppDialog(driver);
                settingsSidePanel = new WebAppSettingsSidePanel(driver);
                orderPage = new OrderPage(driver);
                // e2eUtils = new E2EUtils(driver);
                // randomString = generalService.generateRandomString(5);
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                try {
                    await webAppHeader.goHome();
                } catch (error) {
                    console.error(error);
                }
            });

            it('Login', async () => {
                await webAppLoginPage.login(email, password);
            });

            // it('Pre-clean: deleting all Pages', async () => {
            //     await e2eUtils.deleteAllPagesViaUI();
            //     await webAppHeader.goHome();
            // });

            describe('Pricing Sales Order', () => {
                it('Data Prep (inserting rules to UDT PPM_Values)', async () => {
                    const dataToBatch = [
                        {
                            MapDataExternalID: 'PPM_Values',
                            MainKey: 'MTAX@A002@Pharmacy',
                            SecondaryKey: '',
                            Values: ['[[true,"1555891200000","2534022144999","1","1","MTAX_A002",[[0,"I",17,"%"]]]]'],
                        },
                        // {
                        //     MapDataExternalID: 'PPM_Values',
                        //     MainKey: 'batch API Test row 2',
                        //     SecondaryKey: '',
                        //     Values: ['Api Test value 2'],
                        // },
                        // {
                        //     MapDataExternalID: 'PPM_Values',
                        //     MainKey: 'batch API Test row 3',
                        //     SecondaryKey: '',
                        //     Values: ['Api Test value 3'],
                        // },
                        // {
                        //     MapDataExternalID: 'PPM_Values',
                        //     MainKey: 'batch API Test row 4',
                        //     SecondaryKey: '',
                        //     Values: ['Api Test value 4'],
                        // },
                    ];
                    batchUDTresponse = await objectsService.postBatchUDT(dataToBatch);
                    expect(batchUDTresponse).to.be.an('array').with.lengthOf(dataToBatch.length);
                    batchUDTresponse.map((row) => {
                        expect(row).to.have.property('InternalID').that.is.above(0);
                        expect(row).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000');
                        expect(row).to.have.property('Status').that.equals('Insert');
                        expect(row).to.have.property('Message').that.equals('Row inserted.');
                        expect(row)
                            .to.have.property('URI')
                            .that.equals('/user_defined_tables/' + row.InternalID);
                    });
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHeader.openSettings();
                    await webAppHeader.isSpinnerDone();
                    driver.sleep(0.5 * 1000);
                    await settingsSidePanel.selectSettingsByID('Configuration');
                    await settingsSidePanel.clickSettingsSubCategory('user_defined_tables', 'Configuration');
                    await webAppHeader.isSpinnerDone();
                    driver.sleep(10 * 1000);
                });
                it('', async () => {
                    await startNewSalesOrderTransaction('My Store');
                    itemName = 'Frag005';
                    const Frag005priceTSAs_start = await getItemTSAs(itemName);
                    console.info('Frag005priceTSAs_start', Frag005priceTSAs_start);
                });

                it('Cleanup: deleting all Activities', async () => {
                    await webAppHeader.goHome();
                });
            });
        });
    });

    async function startNewSalesOrderTransaction(nameOfAccount: string) {
        await webAppHeader.goHome();
        await webAppHomePage.isSpinnerDone();
        await webAppHomePage.click(webAppHomePage.MainHomePageBtn);
        driver.sleep(1 * 1000);
        await webAppHeader.isSpinnerDone();
        await webAppList.clickOnFromListRowWebElementByName(nameOfAccount);
        driver.sleep(0.5 * 1000);
        await webAppHeader.click(webAppTopBar.DoneBtn);
        await webAppHeader.isSpinnerDone();
        if (await webAppHeader.safeUntilIsVisible(webAppDialog.Dialog, 5000)) {
            driver.sleep(0.5 * 1000);
            await webAppDialog.selectDialogBoxBeforeNewOrder();
        }
        driver.sleep(0.5 * 1000);
        await webAppHeader.isSpinnerDone();
        driver.sleep(0.5 * 1000);
    }

    async function getItemTSAs(nameOfItem: string) {
        const searchInput = await driver.findElement(orderPage.Search_Input);
        searchInput.sendKeys(nameOfItem);
        driver.sleep(0.5 * 1000);
        await driver.click(orderPage.Search_Magnifier_Button);
        driver.sleep(0.5 * 1000);
        const PriceBaseUnitPriceAfter1_Selector = orderPage.getSelectorOfCustomFieldByItemName(
            'PriceBaseUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceBaseUnitPriceAfter1_Value = await (
            await driver.findElement(PriceBaseUnitPriceAfter1_Selector)
        ).getText();
        console.info(`${nameOfItem} PriceBaseUnitPriceAfter1_Value: `, PriceBaseUnitPriceAfter1_Value);
        const PriceDiscountUnitPriceAfter1_Selector = orderPage.getSelectorOfCustomFieldByItemName(
            'PriceDiscountUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceDiscountUnitPriceAfter1_Value = await (
            await driver.findElement(PriceDiscountUnitPriceAfter1_Selector)
        ).getText();
        console.info(`${nameOfItem} PriceDiscountUnitPriceAfter1_Value: `, PriceDiscountUnitPriceAfter1_Value);
        const PriceGroupDiscountUnitPriceAfter1_Selector = orderPage.getSelectorOfCustomFieldByItemName(
            'PriceGroupDiscountUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceGroupDiscountUnitPriceAfter1_Value = await (
            await driver.findElement(PriceGroupDiscountUnitPriceAfter1_Selector)
        ).getText();
        console.info(
            `${nameOfItem} PriceGroupDiscountUnitPriceAfter1_Value: `,
            PriceGroupDiscountUnitPriceAfter1_Value,
        );
        const PriceManualLineUnitPriceAfter1_Selector = orderPage.getSelectorOfCustomFieldByItemName(
            'PriceManualLineUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceManualLineUnitPriceAfter1_Value = await (
            await driver.findElement(PriceManualLineUnitPriceAfter1_Selector)
        ).getText();
        console.info(`${nameOfItem} PriceManualLineUnitPriceAfter1_Value: `, PriceManualLineUnitPriceAfter1_Value);
        const PriceTaxUnitPriceAfter1_Selector = orderPage.getSelectorOfCustomFieldByItemName(
            'PriceTaxUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceTaxUnitPriceAfter1_Value = await (
            await driver.findElement(PriceTaxUnitPriceAfter1_Selector)
        ).getText();
        console.info(`${nameOfItem} PriceTaxUnitPriceAfter1_Value: `, PriceTaxUnitPriceAfter1_Value);
        const NPMCalcMessage_Selector = orderPage.getSelectorOfCustomFieldByItemName(
            'NPMCalcMessage_Value',
            nameOfItem,
        );
        const NPMCalcMessage_Value = await (await driver.findElement(NPMCalcMessage_Selector)).getText();
        console.info(`${nameOfItem} NPMCalcMessage_Value: `, NPMCalcMessage_Value);
        driver.sleep(5 * 1000);
        await driver.click(orderPage.Search_X_Button);
        driver.sleep(5 * 1000);
        return {
            PriceBaseUnitPriceAfter1: PriceBaseUnitPriceAfter1_Value,
            PriceDiscountUnitPriceAfter1: PriceDiscountUnitPriceAfter1_Value,
            PriceGroupDiscountUnitPriceAfter1: PriceGroupDiscountUnitPriceAfter1_Value,
            PriceManualLineUnitPriceAfter1: PriceManualLineUnitPriceAfter1_Value,
            PriceTaxUnitPriceAfter1: PriceTaxUnitPriceAfter1_Value,
            NPMCalcMessage: NPMCalcMessage_Value,
        };
    }
}
