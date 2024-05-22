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

chai.use(promised);

export async function PricingNoUomTests(email: string, password: string, client: Client) {
    /*
_________________ 
_________________ Brief:
          
* Pricing configuration without UOM definition
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
        ...pricingRules[udtFirstTableName].features08,
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

    if (!installedPricingVersion?.startsWith('0.5') && !installedPricingVersion?.startsWith('0.6')) {
        describe(`Pricing ** UOM ** UI tests  - ${
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
