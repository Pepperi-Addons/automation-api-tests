import { Client } from '@pepperi-addons/debug-server/dist';
import { describe, it, afterEach, beforeEach } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../../services/general.service';
import { ObjectsService } from '../../../services/objects.service';
import { Browser } from '../../utilities/browser';
import {
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppLoginPage,
    WebAppSettingsSidePanel,
    WebAppTopBar,
    WebAppTransaction,
    WebAppDialog,
} from '../../pom';
import { PageTestRequirements } from '../PageBuilder/page_builder.test';
import { PagesList } from '../../pom/addons/PageBuilder/PagesList';
import { PageBuilderSettings, pageOptions } from './pageSettings.POM';
import { PageClass } from '../../../models/pages/page.class';
import { PagesService } from 'c:/automation/api/automation-api-tests/server-side/services/pages/pages.service';
import { PageSectionClass } from '../../../models/pages/page-section.class';
import { Page, PageBlock } from '@pepperi-addons/papi-sdk';
import { v4 as newUuid } from 'uuid';

chai.use(promised);

export async function ChartBlockTest(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const pagesService = new PagesService(generalService);
    let driver: Browser;
    let _id;
    let _itemQty;

    // await generalService.baseAddonVersionsInstallation(varPass);
    // //#region Upgrade cpi-node & UOM
    const testData = {
        //     'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '16.80.6'], //has to be hardcoded because upgrade dependencies cant handle this
        //     'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '16.65.38'], //has to be hardcoded because upgrade dependencies cant handle this
        //     'cpi-node': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '0.3.7'],
        //     uom: ['1238582e-9b32-4d21-9567-4e17379f41bb', ''], //latest
    };

    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    //#endregion Upgrade cpi-node & UOM

    describe('Chart Block Tests Suit', async function () {
        describe('Prerequisites Addons for Chart Block Tests', () => {
            //Test Data
            //UOM
            isInstalledArr.forEach((isInstalled, index) => {
                it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
                    expect(isInstalled).to.be.true;
                });
            });
            for (const addonName in testData) {
                const addonUUID = testData[addonName][0];
                const version = testData[addonName][1];
                const varLatestVersion = chnageVersionResponseArr[addonName][2];
                const changeType = chnageVersionResponseArr[addonName][3];
                describe(`Test Data: ${addonName}`, () => {
                    it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                        if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                            expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                        } else {
                            expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                        }
                    });
                    it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(varLatestVersion);
                    });
                });
            }
        });

        describe('Chart Block UI Related', () => {
            this.retries(1);

            beforeEach(async function () {
                driver = await Browser.initiateChrome();
            });

            afterEach(async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.collectEndTestData(this);
                await driver.quit();
            });

            // it('Set up - performe a basic transaction usgin the UI and record the ID', async function () {
            //     const webAppLoginPage = new WebAppLoginPage(driver);
            //     await webAppLoginPage.login(email, password);
            //     const webAppHomePage = new WebAppHomePage(driver);
            //     await webAppHomePage.initiateSalesActivity(undefined, 'Best Buy #163');
            //     const itemsScopeURL = await driver.getCurrentUrl();
            //     const transactionUUID = itemsScopeURL.split(/[/'|'?']/)[5];
            //     const webAppTransaction = new WebAppTransaction(driver, transactionUUID);
            //     const webAppList = new WebAppList(driver);
            //     const webAppTopBar = new WebAppTopBar(driver);
            //     await webAppTopBar.selectFromMenuByText(webAppTopBar.ChangeViewButton, 'Medium');
            //     await webAppTransaction.addItemToCart(this, 'SA4', 5, true);
            //     await webAppList.click(webAppTopBar.CartViewBtn);
            //     await webAppList.click(webAppTopBar.CartSumbitBtn);
            //     await webAppHomePage.isDialogOnHomePAge(this);
            //     const lastTransFromAPI = await (await generalService.fetchStatus(
            //         `/transactions?page_size=-1&order_by=CreationDateTime DESC`
            //     )).Body[0];
            //     _id = lastTransFromAPI.InternalID;
            //     _itemQty = lastTransFromAPI.QuantitiesTotal;
            // });
            it('Pages - goto Pages, add a Page, go inside, test Chart block', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                const homePage = await webAppLoginPage.login(email, password);
                const webAppHeader = new WebAppHeader(driver);
                await driver.click(webAppHeader.Settings);
                const webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
                await webAppSettingsSidePanel.selectSettingsByID('Pages');
                await driver.click(webAppSettingsSidePanel.PageBuilderSection);
                const pageBuilderSettings = new PageBuilderSettings(driver);
                //has to be moved to the class
                await driver.click(pageBuilderSettings.newPageBtn);
                await pageBuilderSettings.choosePageBuilderOptipn(pageOptions.Blank);
                await expect(pageBuilderSettings.untilIsVisible(pageBuilderSettings.pageSections, 5000)).eventually.to
                    .be.true;
                const workingPage: PageClass = new PageClass();
                const pageURL = (await driver.getCurrentUrl()).split('/');
                const pageUUID = pageURL[pageURL.length - 1];
                workingPage.Key = pageUUID;
                const pageName = 'EVGENY 66.66'; //generalService.generateRandomString(7);
                await pageBuilderSettings.changePageName(pageName);
                workingPage.Name = pageName;
                await pageBuilderSettings.backToPageList();
                driver.sleep(2000);
                let response = await pagesService.getPage(workingPage.Key);
                expect(response.Key).to.equal(workingPage.Key);
                expect(response.Name).to.equal(workingPage.Name);
                // debugger;
                // const chartsRelations = await pagesService.getBlockRelation('Chart');
                // const chartBlock: PageBlock = workingPage.Blocks.createAndAdd(chartsRelations);
                response = await pagesService.getPage(workingPage.Key);
                const oldSection = new PageSectionClass(response.Layout.Sections[0].Key);
                const newSection = new PageSectionClass(newUuid());
                // const a = {
                //     "query": null,
                //     "useDropShadow": true,
                //     "dropShadow": {
                //         "type": "Regular",
                //         "intensity": 5
                //     },
                //     "useBorder": false,
                //     "border": {
                //         "color": "hsl(0, 0%, 57%)",
                //         "opacity": "50"
                //     },
                //     "executeQuery": false,
                //     "chart": null,
                //     "useLabel": false,
                //     "label": "",
                //     "height": 22
                // };
                // chartBlock.Configuration.Data = a;
                // section.addBlock(chartBlock.Key);
                workingPage.Layout.Sections.add(oldSection);
                workingPage.Layout.Sections.add(newSection);
                debugger;
                const pageResult = await pagesService.createOrUpdatePage(workingPage).catch((error) => {
                    console.log((error as Error).message);
                    throw error;
                });
                // pagesService.deepCompareObjects(workingPage, pageResult, expect);
                await pageBuilderSettings.searchForPageAndEnter(workingPage.Name);
                debugger;
            });
        });
    });
}
