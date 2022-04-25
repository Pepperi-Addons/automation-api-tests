import { Client } from '@pepperi-addons/debug-server/dist';
import { describe, it, afterEach, beforeEach } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../../services/general.service';
import { Browser } from '../../utilities/browser';
import {
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppLoginPage,
    WebAppSettingsSidePanel,
    WebAppTopBar,
    WebAppTransaction,
} from '../../pom';
import { PagesList } from '../../pom/addons/PageBuilder/PagesList';
import { PageBuilderSettings } from './pageSettings.POM';
import { PageClass } from '../../../models/pages/page.class';
import { PagesService } from 'c:/automation/api/automation-api-tests/server-side/services/pages/pages.service';
import { v4 as newUuid } from 'uuid';
import { SectionBlockFactory } from '../../../services/pages/section-block.factory';
import { ChartTester, query } from '../../pom/addons/Blocks/PageTester/ChartTester.block';

chai.use(promised);

export async function ChartBlockTest(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const pagesService = new PagesService(generalService);
    let driver: Browser;
    let _id;
    let _itemQty;
    let _initialValueOfQuery;
    let _nameOfPage;
    let _priceOfTrans;
    let _currentBlock;


    const testData = {
    };

    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    //#endregion Upgrade 

    describe('Chart Block Tests Suit', async function () {
        describe('Prerequisites Addons for Chart Block Tests', () => {
            //Test Data
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

            it('Set Up - Creating A Page With Chart Block Inside And Configuring Its Query To Return Number Of Activities', async function () {
                const returnedData = await createPageWithChartBlockUsingTheAPI(driver, generalService, pagesService, expect);
                _nameOfPage = returnedData.name;
                _currentBlock = returnedData.block;
                await loginAndNavigateToPages(driver, email, password);
                const pagesList = new PagesList(driver);
                const pageEditor = await pagesList.searchAndEditPage(_nameOfPage);
                const chartBlock = await getChartBlock(driver, pageEditor, _currentBlock);
                await chartBlock.loadBlock(pageEditor);
                await chartBlock.editBlock();
                expect(await chartBlock.isTitlePresented()).to.be.false;
                await chartBlock.setTitle(pageEditor, "testing");
                const blockTitle = await chartBlock.getTitle();
                expect(blockTitle).to.equal("testing");
                await pageEditor.goBack();
                await pageEditor.goToContent(chartBlock.addQueryBtn);
                const queryToUse: query = {
                    Name: "evgeny test",
                    Resource: "all_activities",
                    Metric: { Aggregator: "Count" },
                    Filter: { AccountFilter: "All accounts", UserFilter: "All users" },
                };
                await chartBlock.addQuery(queryToUse);
                _initialValueOfQuery = parseInt(await chartBlock.getDataPresentedInBlock(this));
            });
            it('Set up - Performe A Basic Transaction Using The UI And Record Its ID', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.initiateSalesActivity(undefined, 'Best Buy #163');
                const itemsScopeURL = await driver.getCurrentUrl();
                const transactionUUID = itemsScopeURL.split(/[/'|'?']/)[5];
                const webAppTransaction = new WebAppTransaction(driver, transactionUUID);
                const webAppList = new WebAppList(driver);
                const webAppTopBar = new WebAppTopBar(driver);
                await webAppTopBar.selectFromMenuByText(webAppTopBar.ChangeViewButton, 'Medium');
                await webAppTransaction.addItemToCart(this, 'SA4', 5, true);
                await webAppList.click(webAppTopBar.CartViewBtn);
                await webAppList.click(webAppTopBar.CartSumbitBtn);
                await webAppHomePage.isDialogOnHomePAge(this);
                const lastTransFromAPI = await (await generalService.fetchStatus(
                    `/transactions?page_size=-1&order_by=CreationDateTime DESC`
                )).Body[0];
                _priceOfTrans = lastTransFromAPI.SubTotalAfterItemsDiscount;
                _id = lastTransFromAPI.InternalID;
                _itemQty = lastTransFromAPI.QuantitiesTotal;
            });
            it('Chart Block Testing - Testing If The Chart Presents Correct Values After Adding The Transaction: Num Of Activities Presented Should Be Increased By One', async function () {
                await loginAndNavigateToPages(driver, email, password);
                const pagesList = new PagesList(driver);
                const pageEditor = await pagesList.searchAndEditPage(_nameOfPage);
                const chartBlock = await getChartBlock(driver, pageEditor, _currentBlock);
                await chartBlock.editBlock();
                driver.sleep(5000);//what should i wait for
                const updatedData = await chartBlock.getDataPresentedInBlock(this);
                expect(parseInt(updatedData)).to.equal(_initialValueOfQuery + 1);
            });
        });
    });
}


//private helpers - WIP
async function loginAndNavigateToPages(driver, email, password) {
    const webAppLoginPage = new WebAppLoginPage(driver);
    await webAppLoginPage.login(email, password);
    const webAppHeader = new WebAppHeader(driver);
    await driver.click(webAppHeader.Settings);
    const webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
    await webAppSettingsSidePanel.selectSettingsByID('Pages');
    await driver.click(webAppSettingsSidePanel.PageBuilderSection);
}

async function createPageWithChartBlockUsingTheAPI(driver, generalService, pagesService, expect) {
    const pageBuilderSettings = new PageBuilderSettings(driver);
    const workingPage: PageClass = new PageClass();
    workingPage.Key = newUuid();
    workingPage.Name = `EVGENY CHART TESTING ${generalService.generateRandomString(6)}`;
    const nameOfPage = workingPage.Name;
    const pageResult = await pageBuilderSettings.apiCreatePage(expect, pagesService, "Chart", workingPage);
    const currentBlock = pageResult.Blocks[0];
    return { name: nameOfPage, block: currentBlock, page: pageResult };
}

async function getChartBlock(driver, pageEditor, block) {
    const createBlockFactory = new SectionBlockFactory(driver);
    pageEditor.PageBlocks.setBlock(createBlockFactory.fromPageBlock(block));
    return pageEditor.PageBlocks.getBlock(block) as ChartTester;
}