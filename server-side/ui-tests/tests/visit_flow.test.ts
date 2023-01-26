import { describe, it, before, after, afterEach } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai from 'chai';
import promised from 'chai-as-promised';
import { Browser } from '../utilities/browser';
import { WebAppHeader, WebAppHomePage, WebAppLoginPage } from '../pom';
// import { ResourceEditors, ResourceList, ResourceViews } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
// import { Slugs } from '../pom/addons/Slugs';
import E2EUtils from '../utilities/e2e_utils';
import { VisitFlowBlock, VisitFlowBlockColumn } from '../blueprints/PageBlocksBlueprints';
import { VisitFlow } from '../pom/addons/VisitFlow';

chai.use(promised);

export async function VisitFlowTests(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);

    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let visitFlow: VisitFlow;
    // let resourceList: ResourceList;
    // let resourceEditors: ResourceEditors;
    // let resourceViews: ResourceViews;
    let pageBuilder: PageBuilder;
    // let slugs: Slugs;
    let e2eUtils: E2EUtils;
    let pageUUID: string;
    let pageName: string;
    let randomString: string;

    describe('Visit Flow UI tests', () => {
        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
            webAppHeader = new WebAppHeader(driver);
            visitFlow = new VisitFlow(driver);
            // resourceList = new ResourceList(driver);
            // resourceEditors = new ResourceEditors(driver);
            // resourceViews = new ResourceViews(driver);
            pageBuilder = new PageBuilder(driver);
            // slugs = new Slugs(driver);
            e2eUtils = new E2EUtils(driver);
        });

        after(async function () {
            await driver.quit();
        });

        it('Login', async () => {
            await webAppLoginPage.login(email, password);
        });
        // describe("Verifying Addon's installation generated required data", () => {
        //     it('Three UDC collections were created (VisitFlows, VisitFlowGroups, VisitFlowSteps)', async () => {
        //     });
        //     it('Activity type "VF_VisitFlowMainActivity" was created', async () => {
        //     });
        // });
        // describe('Inserting Data to the UDCs', () => {
        //     it('Configuring Groups', async () => {
        //     });
        //     it('Configuring Flows', async () => {
        //     });
        // });
        describe('Creating a Page', () => {
            before(() => {
                randomString = generalService.generateRandomString(5);
                randomString = '';
                pageName = `VisitFlow Page Auto_${randomString}`;
            });
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });
            it('Performing an API call to create Visit Flow Page', async () => {
                pageUUID = await e2eUtils.addPage(pageName, 'Visit Flow 0.5 tests');
                console.info('pageUUID: ', pageUUID);
                const createdPage = await pageBuilder.getPageByUUID(pageUUID, client);
                createdPage.Blocks.push(new VisitFlowBlock());
                createdPage.Layout.Sections[0].Columns[0] = new VisitFlowBlockColumn();
                console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
                const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
            });
            it('Page cleanup', async () => {
                await e2eUtils.navigateTo('Page Builder');
                await pageBuilder.searchForPageByName(pageName);
                pageBuilder.pause(3 * 1000);
                // debugger
                await pageBuilder.selectFromListByName(pageName);
                pageBuilder.pause(10 * 1000);
            });
        });
        // describe('Creating and Mapping a Slug', () => {
        //     it('Creating a Visit Flow Slug', async () => {
        //     });
        //     it('Mapping Visit Flow Page on Visit Flow Slug using an API call', async () => {
        //     });
        // });
        // describe('Configuring Account Dashboard', () => {
        //     it('Navigating to Account Dashboard Layout -> Menu (Pencil) -> Rep (Pencil)', async () => {
        //     });
        //     it('Adding the Visit Flow Slug by the search input, clicking the (+) button and Save', async () => {
        //     });
        // });
        describe('Going Through a Basic Flow', () => {
            it('Navigating to a specific Account', async () => {
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHomePage.clickOnBtn('Accounts');
                driver.sleep(1 * 1000);
                await webAppHeader.isSpinnerDone();
            });
            it('Entering Visit Flow slug from Menu', async () => {
                await visitFlow.waitTillVisible(visitFlow.FirstAccountInList, 15000);
                await visitFlow.clickElement('FirstAccountInList');
                driver.sleep(1 * 1000);
                await visitFlow.waitTillVisible(visitFlow.AccountHomePage_HamburgerMenu_Button, 15000);
                await visitFlow.clickElement('AccountHomePage_HamburgerMenu_Button');
                await visitFlow.waitTillVisible(visitFlow.AccountHomePage_HamburgerMenu_Content, 15000);
                visitFlow.pause(1 * 1000);
                await visitFlow.clickElement('AccountHomePage_HamburgerMenu_VisitFlowSlug');
                await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                visitFlow.pause(1 * 1000);
            });
            it('Checking off "Start"', async () => {
                await visitFlow.clickElement('VisitFlow_GroupButton_Start');
                await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_StartVisit, 15000);
                visitFlow.pause(0.5 * 1000);
                await visitFlow.clickElement('VisitFlow_StepButton_StartVisit');
                await visitFlow.isSpinnerDone();
                await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_FormPage_FormContent, 15000);
                visitFlow.pause(0.5 * 1000);
                await visitFlow.insertTextToInputElement(
                    'Automated test of Visit Flow started',
                    visitFlow.VisitFlowMainActivity_FormPage_SubjectInput,
                );
                visitFlow.pause(0.5 * 1000);
                await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_CancelButton');
                await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_CancelDialog_Notice_Headline, 15000);
                await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_CancelDialog_SaveChanges_Button, 15000);
                await visitFlow.clickElement('VisitFlowMainActivity_CancelDialog_SaveChanges_Button');
                await visitFlow.isSpinnerDone();
                await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                visitFlow.pause(0.5 * 1000);
            });
            it('Checking off "Orders"', async () => {
                await visitFlow.clickElement('VisitFlow_GroupButton_Orders');
                await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_SalesOrder, 15000);
                visitFlow.pause(0.5 * 1000);
                await visitFlow.clickElement('VisitFlow_StepButton_SalesOrder');
                await visitFlow.isSpinnerDone();
                visitFlow.pause(0.5 * 1000);
                await visitFlow.waitTillVisible(visitFlow.VisitFlow_OrdersChooseCatalogDialog_Content, 15000);
                await visitFlow.clickElement('VisitFlow_OrdersChooseCatalogDialog_FirstCatalogInList_RadioButton');
                await visitFlow.waitTillVisible(
                    visitFlow.VisitFlow_OrdersChooseCatalogDialog_SelectedCatalog_RadioButton,
                    15000,
                );
                await visitFlow.clickElement('VisitFlow_OrdersChooseCatalogDialog_DoneButton');
                await visitFlow.isSpinnerDone();
                await visitFlow.waitTillVisible(visitFlow.VisitFlow_DefaultCatalog_OrderButton, 15000);
                await visitFlow.clickElement('VisitFlow_DefaultCatalog_OrderButton');
                await visitFlow.isSpinnerDone();
                await visitFlow.waitTillVisible(visitFlow.VisitFlow_DefaultCatalog_CartButton, 15000);
                await visitFlow.clickElement('VisitFlow_DefaultCatalog_CartButton');
                await visitFlow.isSpinnerDone();
                await visitFlow.waitTillVisible(visitFlow.VisitFlow_DefaultCatalog_SubmitButton, 15000);
                await visitFlow.clickElement('VisitFlow_DefaultCatalog_SubmitButton');
                await visitFlow.isSpinnerDone();
                await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                visitFlow.pause(5 * 1000);
            });
            it('Checking off "End"', async () => {
                await visitFlow.clickElement('VisitFlow_GroupButton_End');
                await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_EndVisit, 15000);
                visitFlow.pause(0.5 * 1000);
                await visitFlow.clickElement('VisitFlow_StepButton_EndVisit');
                await visitFlow.isSpinnerDone();
                await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_FormPage_FormContent, 15000);
                visitFlow.pause(0.5 * 1000);
                await visitFlow.insertTextToInputElement(
                    'Automated test finished Visit',
                    visitFlow.VisitFlowMainActivity_FormPage_VisitSummaryInput,
                );
                visitFlow.pause(0.5 * 1000);
                await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_SubmitButton');
                await visitFlow.isSpinnerDone();
                await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                visitFlow.pause(5 * 1000);
            });
        });
    });
}
