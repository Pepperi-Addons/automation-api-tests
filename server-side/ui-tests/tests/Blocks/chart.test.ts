import { Client } from '@pepperi-addons/debug-server/dist';
import { describe, it, afterEach, before, after } from 'mocha';
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
import { PageEditor } from '../../pom/addons/PageBuilder/PageEditor';
import { PageBlock, Transaction } from '@pepperi-addons/papi-sdk';
import { ObjectsService } from '../../../services';

chai.use(promised);

export async function ChartBlockTest(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const pagesService = new PagesService(generalService);
    let driver: Browser;
    let _id;
    let _itemQty;
    let _initialValueOfQuery;
    let _nameOfPage;
    let _priceOfTrans;
    let _currentBlock;
    let _pagesKey;


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


            before(async function () {
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Set Up - Create A Fully Configured Page With A Chart Block VIA API', async function () {
                //1. create a complete page with all configured data via API
                //  {
                //     Key: blockKey,
                //     Relation: blockRelation,
                //     Configuration: {
                //         Resource: "Chart",
                //         AddonUUID: "00000000-0000-0000-0000-0da1a0de41e5",
                //         Data: {
                //             query: {
                //                 Key: "dcecaf3e-c4a5-43b3-877b-7a7f6690c068"
                //             },
                //             useDropShadow: true,
                //             dropShadow: {
                //                 type: "Regular",
                //                 intensity: 5
                //             },
                //             useBorder: false,
                //             border: {
                //                 color: "hsl(0, 0%, 57%)",
                //                 opacity: "50"
                //             },
                //             executeQuery: true,
                //             chart: {
                //                 Key: "2dd2b34e-ce0c-4d46-84bd-26fc9d6bb492",
                //                 ScriptURI: "https://pfs.pepperi.com/35247bab-7e80-444c-8c55-d0f144fdc88e/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/Bar.js"
                //             },
                //             useLabel: false,
                //             label: "testing",
                //             height: 22
                //         }
                //     }
                const returnedData = await createPageWithChartBlockUsingTheAPI(driver, generalService, pagesService, expect);
                _nameOfPage = returnedData.name;
                _currentBlock = returnedData.block;
                _pagesKey = returnedData.key;
            });
            it('Set Up - UI Test All Data In Page Is Correctly Presented And Save Its Current Data Presented', async function () {
                await loginAndNavigateToPages(driver, email, password);
                //2. enter the page using UI and see all is there - caputre the output of the chart
                let pagesList = new PagesList(driver);
                let pageEditor = await pagesList.searchAndEditPage(_nameOfPage);
                let chartBlock = await getChartBlock(driver, pageEditor, _currentBlock);
                await chartBlock.loadBlock(pageEditor);
                await chartBlock.editBlock();
                const blockTitle = await chartBlock.getTitle();
                expect(blockTitle).to.equal("testing");//test that the title is as configured via API
                await pageEditor.goToContent(chartBlock.addQueryBtn);
                const selectedQuery = await chartBlock.getSelectedQuery();
                expect(selectedQuery).to.equal('count activities');//test querys name is as configured via API
                _initialValueOfQuery = parseInt(await chartBlock.getDataPresentedInBlock(this));
                let webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.returnToHomePage();
            });
            it('Set Up - Create New Transaction Via API', async function () {
                //3. create new trans via API
                await createNewTransactionViaAPI(objectsService);
            });
            it('UI Test - Validate Chart Presents Valid Data After New Trans Created', async function () {
                //4. see charts output changed via UI
                await navToPages(driver);
                //pages UI bug
                driver.sleep(1500);//pages UI bug
                await driver.refresh();//pages UI bug
                //after refreshing - will work
                const pagesList = new PagesList(driver);
                const pageEditor = await pagesList.searchAndEditPage(_nameOfPage);
                const chartBlock = await getChartBlock(driver, pageEditor, _currentBlock);
                await chartBlock.editBlock();
                const newChartValue = parseInt(await chartBlock.getDataPresentedInBlock(this));
                expect(newChartValue).to.equal(_initialValueOfQuery + 1);
            });
        });
    });
}


//private helpers - WIP
async function loginAndNavigateToPages(driver, email, password) {
    const webAppLoginPage = new WebAppLoginPage(driver);
    await webAppLoginPage.login(email, password);
    await navToPages(driver);
}

async function navToPages(driver) {
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
    return { name: nameOfPage, block: currentBlock, page: pageResult, key: workingPage.Key };
}

async function getChartBlock(driver: Browser, pageEditor: PageEditor, block: PageBlock) {
    const createBlockFactory = new SectionBlockFactory(driver);
    pageEditor.PageBlocks.setBlock(createBlockFactory.fromPageBlock(block));
    return pageEditor.PageBlocks.getBlock(block) as ChartTester;//error
}

async function createNewTransactionViaAPI(objectsService) {
    const transactionArr: Transaction[] = await objectsService.getTransaction({
        where: `Type LIKE '%Sales Order%'`,
        page_size: 1,
        include_deleted: true,
    });
    const activityTypeId = transactionArr[0].ActivityTypeID as number;
    const accountId = transactionArr[0].Account?.Data?.InternalID as number;
    const catalogId = transactionArr[0].Catalog?.Data?.InternalID as number;
    const testDataTransaction: Transaction = await objectsService.createTransaction({
        ActivityTypeID: activityTypeId,
        UUID: newUuid(),
        Status: 2,
        DiscountPercentage: 0,
        Account: {
            Data: {
                InternalID: accountId,
            },
        },
        Catalog: {
            Data: {
                InternalID: catalogId,
            },
        },
    });
    const itemArr = await objectsService.getItems({ page_size: 1 });
    const createdTransactionLines = await objectsService.createTransactionLine({
        LineNumber: 0,
        UnitsQuantity: 25,
        UnitDiscountPercentage: 0,
        Item: {
            Data: {
                ExternalID: itemArr[0].ExternalID,
            },
        },
        Transaction: {
            Data: {
                InternalID: testDataTransaction.InternalID,
            },
        },
    });
}