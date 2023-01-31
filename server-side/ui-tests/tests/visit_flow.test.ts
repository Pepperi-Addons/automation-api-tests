import { describe, it, before, after, afterEach } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { Browser } from '../utilities/browser';
import { WebAppHeader, WebAppHomePage, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
// import { ResourceEditors, ResourceList, ResourceViews } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { Slugs } from '../pom/addons/Slugs';
import E2EUtils from '../utilities/e2e_utils';
import { VisitFlowPage } from '../blueprints/PageBlocksBlueprints';
import { VisitFlow } from '../pom/addons/VisitFlow';
import { v4 as newUuid } from 'uuid';
import { MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { DataViewsService } from '../../services/data-views.service';
import { UpsertFieldsToMappedSlugs } from '../blueprints/DataViewBlueprints';
import { UDCService } from '../../services/user-defined-collections.service';

chai.use(promised);

export async function VisitFlowTests(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const dataViewsService = new DataViewsService(generalService.papiClient);

    let driver: Browser;
    let e2eUtils: E2EUtils;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let settingsSidePanel: WebAppSettingsSidePanel;
    let visitFlow: VisitFlow;
    let pageBuilder: PageBuilder;
    let slugs: Slugs;
    let randomString: string;
    let upsertedListingsToVisitFlowGroups: any[];
    let upsertedListingsToVisitFlows: any[];
    let pageUUID: string;
    let pageName: string;
    let slugDisplayName: string;
    let slug_path: string;
    let slugUUID: string;
    // let resourceList: ResourceList;
    // let resourceEditors: ResourceEditors;
    // let resourceViews: ResourceViews;

    describe('Visit Flow UI tests', () => {
        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
            webAppHeader = new WebAppHeader(driver);
            settingsSidePanel = new WebAppSettingsSidePanel(driver);
            e2eUtils = new E2EUtils(driver);
            visitFlow = new VisitFlow(driver);
            pageBuilder = new PageBuilder(driver);
            slugs = new Slugs(driver);
            // resourceList = new ResourceList(driver);
            // resourceEditors = new ResourceEditors(driver);
            // resourceViews = new ResourceViews(driver);
            slugDisplayName = 'Visit Flow Auto';
            slug_path = 'visit_flow_auto';
            randomString = generalService.generateRandomString(5);
            upsertedListingsToVisitFlowGroups = [];
            upsertedListingsToVisitFlows = [];
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

        // describe('Creating a Catalogs View (if does not exist)', () => {
        //     it('Configuring Groups', async () => {
        //     });
        //     it('Configuring Flows', async () => {
        //     });
        // });

        describe('Inserting Data to the UDCs', () => {
            it('Configuring Groups', async () => {
                const collectionName = 'VisitFlowGroups';
                const groupsDocumentsToUpsert = [
                    { Title: `Start Auto ${randomString}`, SortIndex: 0 },
                    { Title: `Orders Auto ${randomString}`, SortIndex: 10 },
                    { Title: `End Auto ${randomString}`, SortIndex: 100 }
                ]
                let upsertingValues_Response;
                groupsDocumentsToUpsert.forEach(async (documentToUpsert) => {
                    // POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/documents?name=VisitFlowGroups
                    upsertingValues_Response = await udcService.upsertValuesToCollection(documentToUpsert, collectionName);
                    console.info(`Response: ${JSON.stringify(upsertingValues_Response, null, 4)}`);
                    expect(upsertingValues_Response.Ok).to.be.true;
                    expect(upsertingValues_Response.Status).to.equal(200);
                    expect(upsertingValues_Response.Error).to.eql({});
                    upsertedListingsToVisitFlowGroups.push(upsertingValues_Response.Body);
                });
            });
            it('Configuring Flows', async () => {
                const collectionName = 'VisitFlows';
                const visitsDocumentsToUpsert = [
                    { Name: `AutoVis${randomString}`, Description: `Auto Visit ${randomString}`, Active: true, steps: [
                        {}
                    ]},
                ]
                let upsertingValues_Response;
                visitsDocumentsToUpsert.forEach(async (documentToUpsert) => {
                    // POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/documents?name=VisitFlows
                    upsertingValues_Response = await udcService.upsertValuesToCollection(documentToUpsert, collectionName);
                    console.info(`Response: ${JSON.stringify(upsertingValues_Response, null, 4)}`);
                    expect(upsertingValues_Response.Ok).to.be.true;
                    expect(upsertingValues_Response.Status).to.equal(200);
                    expect(upsertingValues_Response.Error).to.eql({});
                    upsertedListingsToVisitFlowGroups.push(upsertingValues_Response.Body);
                });
            });
        });

        describe('Creating a Page with VisitFlow Block', () => {
            before(() => {
                pageName = `VisitFlow Page Auto_${randomString}`;
            });
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });
            it('New Page through the UI + VisitFlow Block through API', async () => {
                pageUUID = await e2eUtils.addPage(pageName, 'Visit Flow 0.5 tests');
                // console.info('pageUUID: ', pageUUID);
                const createdPage = await pageBuilder.getPageByUUID(pageUUID, client);
                // console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
                const sectionKey = createdPage.Layout.Sections[0].Key;
                const blockKey = newUuid();
                const visitFlowPage = new VisitFlowPage(pageUUID, blockKey, sectionKey, pageName, 'pageDescription');
                // console.info('visitFlowPage: ', JSON.stringify(visitFlowPage, null, 2));
                const responseOfPublishPage = await pageBuilder.publishPage(visitFlowPage, client);
                console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 4));
            });
            it('Verifying Page was created successfully', async () => {
                await e2eUtils.navigateTo('Page Builder');
                await pageBuilder.searchForPageByName(pageName);
                pageBuilder.pause(2 * 1000);
                // add expect
            });
        });

        describe('Creating and Mapping a Slug', () => {
            it('Creating a Visit Flow Slug for Automation', async () => {
                await e2eUtils.navigateTo('Slugs');
                await slugs.createSlug(slugDisplayName, slug_path, 'slug for Visit Flow Automation');
            });

            it('Dragging the created slug to the mapped fields section and Posting via API', async () => {
                await slugs.clickTab('Mapping_Tab');
                await slugs.waitTillVisible(slugs.EditPage_ConfigProfileCard_EditButton_Rep, 5000);
                await slugs.click(slugs.EditPage_ConfigProfileCard_EditButton_Rep);
                await slugs.isSpinnerDone();
                await slugs.waitTillVisible(slugs.MappedSlugs, 5000);
                const existingMappedSlugs = await slugs.getExistingMappedSlugsList(dataViewsService);
                const slugsFields: MenuDataViewField[] = e2eUtils.prepareDataForDragAndDropAtSlugs(
                    [
                        { slug_path: slug_path, pageUUID: pageUUID },
                    ],
                    existingMappedSlugs
                );
                console.info(`slugsFields: ${JSON.stringify(slugsFields, null, 2)}`);
                const slugsFieldsToAddToMappedSlugsObj = new UpsertFieldsToMappedSlugs(slugsFields);
                console.info(`slugsFieldsToAddToMappedSlugs: ${JSON.stringify(slugsFieldsToAddToMappedSlugsObj, null, 2)}`)
                const upsertFieldsToMappedSlugs = await dataViewsService.postDataView(slugsFieldsToAddToMappedSlugsObj);
                console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToMappedSlugs, null, 2)}`);
                driver.sleep(2 * 1000);
                await e2eUtils.logOutLogIn(email, password);
                await webAppHomePage.isSpinnerDone();
                await e2eUtils.navigateTo('Slugs');
                await slugs.clickTab('Mapping_Tab');
                driver.sleep(15 * 1000);
            });

            // it('Mapping Visit Flow Page on Visit Flow Slug using an API call', async () => {
            //     await e2eUtils.navigateTo('Slugs');
            //     await slugs.mapPageToSlug(slug_path, pageName);
            // });
        });

        // describe('Configuring Account Dashboard', () => {
        //     it('Navigating to Account Dashboard Layout -> Menu (Pencil) -> Rep (Pencil)', async () => {
        //         await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
        //         driver.sleep(7 * 1000);
        //     });

        //     it('Adding the Visit Flow Slug by the search input, clicking the (+) button and Save', async () => {
        //     });
        // });

        describe('Going Through a Basic Visit', () => {
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

        describe('Teardown', () => {
            // it('Unconfiguring Slug from Account Dashboard', async () => {
            // });

            // it('Deleting Slug', async () => {
            //     await e2eUtils.navigateTo('Slugs');
            //     // doesn't work:
            //     // await slugs.deleteFromListByName(slugDisplayName);
            // });

            it('Deleting Page', async () => {
                await e2eUtils.navigateTo('Page Builder');
                await pageBuilder.waitTillVisible(pageBuilder.PagesList_Title, 15000);
                await pageBuilder.waitTillVisible(pageBuilder.PagesList_NumberOfItemsInList, 15000);
                await pageBuilder.searchForPageByName(pageName);
                pageBuilder.pause(2 * 1000);
                await pageBuilder.deleteFromListByName(pageName);
                pageBuilder.pause(5 * 1000);
                await pageBuilder.searchForPageByName(pageName);
                expect(await (await driver.findElement(pageBuilder.PagesList_EmptyList_Paragraph)).getText()).to.contain('No results were found.');
                pageBuilder.pause(1 * 1000);
            });

            it('Deleting UDCs listings', async () => {
                // deleting created VisitFlowGroups documents
                upsertedListingsToVisitFlowGroups.forEach(async (documentBody) => {
                    const deleteResponse = await udcService.hideObjectInACollection('VisitFlowGroups', documentBody.Key);
                    expect(deleteResponse.Ok).to.be.true;
                    expect(deleteResponse.Status).to.equal(200);
                    expect(deleteResponse.Error).to.eql({});
                    expect(deleteResponse.Body.Hidden).to.be.true;
                    expect(deleteResponse.Body.Key).to.equal(documentBody.Key);
                    expect(deleteResponse.Body.Title).to.equal(documentBody.Title);
                    expect(deleteResponse.Body.SortIndex).to.equal(documentBody.SortIndex);
                });
            });

            // it('Deleting Catalogs View', async () => {
            // });

            // it('Deleting Activities', async () => {
            // });
        });
    });
}
