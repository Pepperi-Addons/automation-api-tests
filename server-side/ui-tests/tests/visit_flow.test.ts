import { describe, it, before, after, afterEach } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Browser } from '../utilities/browser';
import {
    // WebAppDialog,
    WebAppHeader,
    WebAppHomePage,
    WebAppLoginPage,
    // WebAppSettingsSidePanel
} from '../pom';
// import { ResourceEditors, ResourceList, ResourceViews } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { Slugs } from '../pom/addons/Slugs';
import E2EUtils from '../utilities/e2e_utils';
import { VisitFlowPage } from '../blueprints/PageBlocksBlueprints';
import { VisitFlow } from '../pom/addons/VisitFlow';
import { v4 as newUuid } from 'uuid';
import { UDCService } from '../../services/user-defined-collections.service';
import { ObjectsService } from '../../services';
import { OrderPage } from '../pom/Pages/OrderPage';
import { SurveyTemplateBuilder } from '../pom/addons/SurveyTemplateBuilder';
import { AccountDashboardLayout } from '../pom/AccountDashboardLayout';

chai.use(promised);

export async function VisitFlowTests(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const udcService = new UDCService(generalService);

    let driver: Browser;
    let e2eUtils: E2EUtils;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    // let webAppDialog: WebAppDialog;
    // let settingsSidePanel: WebAppSettingsSidePanel;
    let accountDashboardLayout: AccountDashboardLayout;
    let orderPage: OrderPage;
    let visitFlow: VisitFlow;
    let pageBuilder: PageBuilder;
    let slugs: Slugs;
    let surveyService: SurveyTemplateBuilder;
    let randomString: string;
    let upsertedListingsToVisitFlowGroups: {
        Title: string;
        SortIndex: number;
        Key: string;
        Hidden: boolean;
        CreationDateTime?: Date;
        ModificationDateTime?: Date;
    }[];
    let upsertedListingsToVisitFlows: {
        Completed: string;
        Resource: string;
        Title: string;
        Group: string;
        ResourceCreationData: string;
        Mandatory: boolean;
        Key: string;
        Hidden: boolean;
        CreationDateTime?: Date;
        ModificationDateTime?: Date;
    }[];
    let pageUUID: string;
    let pageName: string;
    let surveyTemplateName: string;
    let surveyTemplateDesc: string;
    let surveyUUID: string;
    let visitFlowName: string;
    let visitFlowDescription: string;
    let slugDisplayName: string;
    let slug_path: string;
    let slugUUID: string;
    let getCreatedVisitFlowMainActivity;
    let getCreatedSalesOrderTransaction;
    // let resourceViews: ResourceViews;
    let salesOrderItemName: string;
    let base64ImageComponent;

    describe('Visit Flow Test Suite', async () => {
        describe('Visit Flow UI tests', () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                // webAppDialog = new WebAppDialog(driver);
                // settingsSidePanel = new WebAppSettingsSidePanel(driver);
                accountDashboardLayout = new AccountDashboardLayout(driver);
                surveyService = new SurveyTemplateBuilder(driver);
                e2eUtils = new E2EUtils(driver);
                orderPage = new OrderPage(driver);
                visitFlow = new VisitFlow(driver);
                pageBuilder = new PageBuilder(driver);
                slugs = new Slugs(driver);
                // resourceViews = new ResourceViews(driver);
                randomString = generalService.generateRandomString(5);
                surveyTemplateName = ``;
                surveyTemplateDesc = ``;
                visitFlowName = `Auto VisiT ${randomString}`;
                visitFlowDescription = `Auto Visit ${randomString}`;
                slugDisplayName = `Visit Flow Auto ${randomString}`;
                slug_path = `visit_flow_auto_${randomString}`;
                upsertedListingsToVisitFlowGroups = [];
                upsertedListingsToVisitFlows = [];
                salesOrderItemName = 'MaNa22';
            });

            after(async function () {
                await driver.quit();
            });

            it('Making sure UDCs custom (manually inserted) fields are NOT removed upon version upgrade', async () => {
                // custom field "manuallyAddedField" was added to "VisitFlows" collection, and needs to be there after version upgrade
                const visitFlowsSchemes = await udcService.getSchemes({
                    where: 'Name="VisitFlows"',
                });
                expect(visitFlowsSchemes).to.be.an('array').with.lengthOf(1);
                expect(visitFlowsSchemes[0]).to.haveOwnProperty('Fields');
                expect(visitFlowsSchemes[0].Fields).to.haveOwnProperty('manuallyAddedField');
                console.info('visitFlowsSchemes: ', visitFlowsSchemes[0].Fields);
                // custom field "manuallyAddedStepField" was added to "VisitFlowSteps" collection, and needs to be there after version upgrade
                const visitFlowStepsSchemes = await udcService.getSchemes({
                    where: 'Name="VisitFlowSteps"',
                });
                expect(visitFlowStepsSchemes).to.be.an('array').with.lengthOf(1);
                expect(visitFlowStepsSchemes[0]).to.haveOwnProperty('Fields');
                expect(visitFlowStepsSchemes[0].Fields).to.haveOwnProperty('manuallyAddedStepField');
                console.info('visitFlowStepsSchemes: ', visitFlowStepsSchemes[0].Fields);
                // custom field "manuallyAddedGroupField" was added to "VisitFlowSteps" collection, and needs to be there after version upgrade
                const visitFlowGroupsSchemes = await udcService.getSchemes({
                    where: 'Name="VisitFlowGroups"',
                });
                expect(visitFlowGroupsSchemes).to.be.an('array').with.lengthOf(1);
                expect(visitFlowGroupsSchemes[0]).to.haveOwnProperty('Fields');
                expect(visitFlowGroupsSchemes[0].Fields).to.haveOwnProperty('manuallyAddedGroupField');
                console.info('visitFlowGroupsSchemes: ', visitFlowGroupsSchemes[0].Fields);
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

            describe('Inserting Data to the UDC VisitFlowGroups', () => {
                it('Configuring UDC: Visit Flow Groups', async () => {
                    const collectionName = 'VisitFlowGroups';
                    const groupsDocumentsToUpsert = [
                        { Title: `Start Auto ${randomString}`, SortIndex: 0 },
                        { Title: `Orders Auto ${randomString}`, SortIndex: 10 },
                        { Title: `Surveys Auto ${randomString}`, SortIndex: 20 },
                        { Title: `End Auto ${randomString}`, SortIndex: 100 },
                    ];
                    let upsertingValues_Response;
                    groupsDocumentsToUpsert.forEach(async (documentToUpsert) => {
                        // POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/documents?name=VisitFlowGroups
                        upsertingValues_Response = await udcService.upsertValuesToCollection(
                            documentToUpsert,
                            collectionName,
                        );
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
                it('New Page through the UI + VisitFlow Block through API', async function () {
                    pageUUID = await e2eUtils.addPage(pageName, 'Visit Flow 0.5 tests');
                    expect(pageUUID).to.not.be.undefined;
                    console.info('pageUUID: ', pageUUID);
                    const createdPage = await pageBuilder.getPageByUUID(pageUUID, client);
                    const sectionKey = createdPage.Layout.Sections[0].Key;
                    const blockKey = newUuid();
                    const visitFlowPage = new VisitFlowPage(pageUUID, blockKey, sectionKey, pageName, 'VF Auto Test');
                    const responseOfPublishPage = await pageBuilder.publishPage(visitFlowPage, client);
                    console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 4));
                });
                it('Verifying Page was created successfully', async function () {
                    await e2eUtils.navigateTo('Page Builder');
                    await pageBuilder.searchForPageByName(pageName);
                    await visitFlow.isSpinnerDone();
                    pageBuilder.pause(0.2 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Page created`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    const newPageExist = await pageBuilder.checkPageExist(pageName);
                    console.info('newPageExist: ', JSON.stringify(typeof newPageExist, null, 4));
                    // expect(typeof newPageExist).to.equal('WebElement');
                });
            });

            describe('Inserting Data to the UDC: VisitFlows', () => {
                it('Configuring Flows', async () => {
                    driver.sleep(0.5 * 1000);
                    const collectionName = 'VisitFlows';
                    const group_Start = upsertedListingsToVisitFlowGroups.length
                        ? upsertedListingsToVisitFlowGroups.find((group) => {
                              if (group.Title.includes('Start')) {
                                  return group.Key;
                              }
                          })
                        : '';
                    const group_Orders = upsertedListingsToVisitFlowGroups.length
                        ? upsertedListingsToVisitFlowGroups.find((group) => {
                              if (group.Title.includes('Orders')) {
                                  return group.Key;
                              }
                          })
                        : '';
                    const group_End = upsertedListingsToVisitFlowGroups.length
                        ? upsertedListingsToVisitFlowGroups.find((group) => {
                              if (group.Title.includes('End')) {
                                  return group.Key;
                              }
                          })
                        : '';
                    const visitsDocumentsToUpsert = [
                        {
                            Name: visitFlowName,
                            Description: visitFlowDescription,
                            Active: true,
                            steps: [
                                {
                                    Completed: 'In Creation',
                                    Resource: 'activities',
                                    Title: 'Start Visit',
                                    Group: group_Start ? group_Start.Key : '',
                                    ResourceCreationData: 'VF_VisitFlowMainActivity',
                                    Mandatory: true,
                                },
                                {
                                    Completed: 'In Progress',
                                    Resource: 'transactions',
                                    Title: 'Sales Order',
                                    Group: group_Orders ? group_Orders.Key : '',
                                    ResourceCreationData: 'Sales Order',
                                },
                                {
                                    Completed: 'Submitted',
                                    Resource: 'activities',
                                    Title: 'End Visit',
                                    Group: group_End ? group_End.Key : '',
                                    ResourceCreationData: 'VF_VisitFlowMainActivity',
                                    Mandatory: true,
                                },
                            ],
                        },
                        {
                            Name: 'MockVisit',
                            Description: 'Mock Visit',
                            Active: true,
                            steps: [],
                        },
                    ];
                    let upsertingValues_Response;
                    visitsDocumentsToUpsert.forEach(async (documentToUpsert) => {
                        // POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/documents?name=VisitFlows
                        upsertingValues_Response = await udcService.upsertValuesToCollection(
                            documentToUpsert,
                            collectionName,
                        );
                        console.info(`Response: ${JSON.stringify(upsertingValues_Response, null, 4)}`);
                        expect(upsertingValues_Response.Ok).to.be.true;
                        expect(upsertingValues_Response.Status).to.equal(200);
                        expect(upsertingValues_Response.Error).to.eql({});
                        upsertedListingsToVisitFlows.push(upsertingValues_Response.Body);
                    });
                });
            });

            describe('Creating and Mapping a Slug', () => {
                it('Creating a Visit Flow Slug for Automation', async function () {
                    await e2eUtils.navigateTo('Slugs');
                    await slugs.createSlug(slugDisplayName, slug_path, 'slug for Visit Flow Automation');
                    slugs.pause(3 * 1000);
                    slugUUID = await slugs.getSlugUUIDbySlugName(slug_path, client);
                    console.info('slugUUID: ', slugUUID);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Slug created`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await webAppHeader.goHome();
                    expect(slugUUID).to.not.be.undefined;
                });

                it('Dragging the created slug to the mapped fields section and Posting via API', async function () {
                    const mappedSlugsUpsertResponse = await e2eUtils.addToMappedSlugs(
                        [{ slug_path: slug_path, pageUUID: pageUUID }],
                        client,
                    );
                    console.info(`mappedSlugsUpsertResponse: ${JSON.stringify(mappedSlugsUpsertResponse, null, 4)}`);
                    await e2eUtils.navigateTo('Slugs');
                    await slugs.clickTab('Mapping_Tab');
                    await slugs.waitTillVisible(slugs.EditPage_ConfigProfileCard_EditButton_Rep, 5000);
                    await slugs.click(slugs.EditPage_ConfigProfileCard_EditButton_Rep);
                    await slugs.isSpinnerDone();
                    await slugs.waitTillVisible(slugs.MappedSlugs_Title, 15000);
                    // await slugs.clickTab('Slugs_Tab');
                    driver.sleep(2 * 1000);
                    await e2eUtils.logOutLogIn(email, password);
                    await webAppHomePage.isSpinnerDone();
                    await e2eUtils.navigateTo('Slugs');
                    await slugs.clickTab('Mapping_Tab');
                    await webAppHomePage.isSpinnerDone();
                    await slugs.waitTillVisible(slugs.MappingTab_RepCard_InnerListOfMappedSlugs, 15000);
                    const slugNameAtMappedSlugsSmallDisplayInRepCard = await driver.findElement(
                        slugs.getSelectorOfMappedSlugInRepCardSmallDisplayByText(slug_path),
                        10000,
                    );
                    expect(await slugNameAtMappedSlugsSmallDisplayInRepCard.getText()).to.contain(slug_path);
                    await slugs.clickTab('Slugs_Tab');
                    driver.sleep(1 * 1000);
                });
            });

            describe('Configuring Account Dashboard', () => {
                it('Navigating to Account Dashboard Layout -> Menu (Pencil) -> Rep (Pencil)', async () => {
                    await accountDashboardLayout.configureToAccountMenuRepCard(
                        driver,
                        slugDisplayName,
                        randomString,
                        slug_path,
                    );
                });

                it('Performing Manual Sync', async () => {
                    await e2eUtils.logOutLogIn(email, password);
                    await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
                    await e2eUtils.performManualSync(client);
                });
            });

            describe('Going Through a Basic Visit Flow', () => {
                it('Navigating to a specific Account & Entering Visit Flow slug from Menu', async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Accounts');
                    await webAppHeader.isSpinnerDone();
                    driver.sleep(1 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `At Accounts`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.waitTillVisible(visitFlow.FirstAccountInList, 15000);
                    await visitFlow.clickElement('FirstAccountInList');
                    await visitFlow.isSpinnerDone();
                    driver.sleep(1 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Inside first account in list`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_HamburgerMenu_Button, 15000);
                    await visitFlow.clickElement('AccountHomePage_HamburgerMenu_Button');
                    visitFlow.pause(0.2 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Hamburger Menu opened`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_HamburgerMenu_Content, 15000);
                    visitFlow.pause(1 * 1000);
                    await visitFlow.click(
                        visitFlow.getSelectorOfAccountHomePageHamburgerMenuVisitFlowAutomatedSlug(slugDisplayName),
                    );
                    visitFlow.pause(1 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Clicked Wanted Slug at hamburger menu`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('If more than one visit - Choosing a Visit Flow', async function () {
                    if (await driver.isElementVisible(visitFlow.VisitFlow_SelectVisit_Title)) {
                        visitFlow.pause(1.5 * 1000);
                        await visitFlow.click(visitFlow.getSelectorOfVisitFlowButtonByName(visitFlowName));
                    } else {
                        await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                    }
                    visitFlow.pause(1 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Entered Visit`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('Checking off "Start"', async function () {
                    // debugger
                    await visitFlow.clickElement('VisitFlow_GroupButton_Start');
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_StartVisit, 15000);
                    visitFlow.pause(0.5 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Start Group Clicked`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.clickElement('VisitFlow_StepButton_StartVisit');
                    await visitFlow.isSpinnerDone();
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Start Visit Step Clicked`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_FormPage_FormContent, 15000);
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.insertTextToInputElement(
                        `Automated test (${randomString}) of Visit Flow started`,
                        visitFlow.VisitFlowMainActivity_FormPage_TitleInput,
                    );
                    visitFlow.pause(0.5 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Input content inserted`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_CancelButton');
                    await visitFlow.waitTillVisible(
                        visitFlow.VisitFlowMainActivity_CancelDialog_Notice_Headline,
                        15000,
                    );
                    await visitFlow.waitTillVisible(
                        visitFlow.VisitFlowMainActivity_CancelDialog_SaveChanges_Button,
                        15000,
                    );
                    await visitFlow.clickElement('VisitFlowMainActivity_CancelDialog_SaveChanges_Button');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                    visitFlow.pause(0.5 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Start Finished`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('Checking off "Orders"', async function () {
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
                    // Choosing an item in Order Center:
                    await orderPage.searchInOrderCenter(salesOrderItemName);
                    await driver.click(
                        orderPage.getSelectorOfItemQuantityPlusButtonInOrderCenterByName(salesOrderItemName),
                    );
                    await orderPage.clearOrderCenterSearch();
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_DefaultCatalog_CartButton, 15000);
                    await visitFlow.clickElement('VisitFlow_DefaultCatalog_CartButton');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_DefaultCatalog_SubmitButton, 15000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Order Finished`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.clickElement('VisitFlow_DefaultCatalog_SubmitButton');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                    visitFlow.pause(0.5 * 1000);
                });

                it('Checking off "End"', async function () {
                    // debugger;
                    await visitFlow.clickElement('VisitFlow_GroupButton_End');
                    visitFlow.pause(0.2 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_EndVisit, 15000);
                    visitFlow.pause(0.3 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `End Group Clicked`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.clickElement('VisitFlow_StepButton_EndVisit');
                    await visitFlow.isSpinnerDone();
                    // await visitFlow.click(visitFlow.HtmlBody);
                    await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_FormPage_FormContent, 15000);
                    visitFlow.pause(0.5 * 1000);
                    // await visitFlow.insertTextToInputElement(
                    //     `Automated test (${randomString}) finished Visit`,
                    //     visitFlow.VisitFlowMainActivity_FormPage_TitleInput,
                    // );
                    // visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_SubmitButton');
                    // await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_CancelButton');
                    // await visitFlow.waitTillVisible(
                    //     visitFlow.VisitFlowMainActivity_CancelDialog_Notice_Headline,
                    //     15000,
                    // );
                    // await visitFlow.waitTillVisible(
                    //     visitFlow.VisitFlowMainActivity_CancelDialog_SaveChanges_Button,
                    //     15000,
                    // );
                    // await visitFlow.clickElement('VisitFlowMainActivity_CancelDialog_SaveChanges_Button');
                    await visitFlow.isSpinnerDone();
                    if (await driver.isElementVisible(visitFlow.VisitFlow_SelectVisit_Title)) {
                        visitFlow.pause(1.5 * 1000);
                        await visitFlow.click(visitFlow.getSelectorOfVisitFlowButtonByName(visitFlowName));
                    } else {
                        await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                    }
                    visitFlow.pause(0.5 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Finished Visit`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
            });

            describe('Survey Prep', () => {
                it('Configuring Survey', async () => {
                    surveyTemplateName = `VF_Survey_${randomString}`;
                    surveyTemplateDesc = 'Survey in Visit Flow Automated Test';
                    await surveyService.enterSurveyBuilderSettingsPage();
                    await surveyService.enterSurveyBuilderActualBuilder();
                    surveyUUID = await surveyService.configureTheSurveyTemplate(
                        surveyTemplateName,
                        surveyTemplateDesc,
                        surveyService.surveyTemplateToCreate,
                    );
                    console.info('surveyUUID: ', surveyUUID);
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                });
                it('Configuring Survey in UDC: Flows', async () => {
                    driver.sleep(0.5 * 1000);
                    const collectionName = 'VisitFlows';
                    const group_Surveys = upsertedListingsToVisitFlowGroups.length
                        ? upsertedListingsToVisitFlowGroups.find((group) => {
                              if (group.Title.includes('Surveys')) {
                                  return group.Key;
                              }
                          })
                        : '';
                    console.info('group_Surveys: ', group_Surveys);
                    const visitFlowDocumentResponse = await udcService.getDocuments(collectionName, {
                        where: `Name LIKE "${visitFlowName}"`,
                    });
                    console.info('visitFlowDocumentResponse: ', JSON.stringify(visitFlowDocumentResponse, null, 2));
                    visitFlowDocumentResponse[0]['steps'].push({
                        Completed: 'In Progress',
                        Resource: 'MySurveys',
                        Title: 'Visit Survey',
                        Group: group_Surveys ? group_Surveys.Key : '',
                        ResourceCreationData: surveyUUID,
                        Mandatory: false,
                    });
                    console.info(
                        'visitFlowDocument after Survey push: ',
                        JSON.stringify(visitFlowDocumentResponse, null, 2),
                    );
                    let upsertingValues_Response;
                    visitFlowDocumentResponse.forEach(async (documentToUpsert) => {
                        // POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/documents?name=VisitFlows
                        upsertingValues_Response = await udcService.upsertValuesToCollection(
                            documentToUpsert,
                            collectionName,
                        );
                        console.info(`Response: ${JSON.stringify(upsertingValues_Response, null, 4)}`);
                        expect(upsertingValues_Response.Ok).to.be.true;
                        expect(upsertingValues_Response.Status).to.equal(200);
                        expect(upsertingValues_Response.Error).to.eql({});
                        upsertedListingsToVisitFlows.push(upsertingValues_Response.Body);
                    });
                });
                it('Performing Manual Sync', async () => {
                    await e2eUtils.performManualSync(client);
                });
                it('Loging Out and Loging In as Rep', async () => {
                    await e2eUtils.logOutLogIn('visit.flow.rep@pepperitest.com', password);
                    await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
                    await e2eUtils.performManualSync(client);
                });
                it('Navigating to a specific Account & Entering Visit Flow slug from Menu', async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Accounts');
                    await webAppHeader.isSpinnerDone();
                    driver.sleep(1 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.FirstAccountInList, 15000);
                    await visitFlow.clickElement('FirstAccountInList');
                    await visitFlow.isSpinnerDone();
                    driver.sleep(1 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_HamburgerMenu_Button, 15000);
                    await visitFlow.clickElement('AccountHomePage_HamburgerMenu_Button');
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_HamburgerMenu_Content, 15000);
                    visitFlow.pause(1 * 1000);
                    await visitFlow.click(
                        visitFlow.getSelectorOfAccountHomePageHamburgerMenuVisitFlowAutomatedSlug(slugDisplayName),
                    );
                    visitFlow.pause(1 * 1000);
                });
                it('If more than one visit - Choosing a Visit Flow', async function () {
                    if (await driver.isElementVisible(visitFlow.VisitFlow_SelectVisit_Title)) {
                        visitFlow.pause(1.5 * 1000);
                        await visitFlow.click(visitFlow.getSelectorOfVisitFlowButtonByName(visitFlowName));
                    } else {
                        await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                    }
                    visitFlow.pause(1 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Survey Visit Started`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                it('Checking off "Start"', async function () {
                    await visitFlow.clickElement('VisitFlow_GroupButton_Start');
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_StartVisit, 15000);
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlow_StepButton_StartVisit');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_FormPage_FormContent, 15000);
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.insertTextToInputElement(
                        `Automated test (${randomString}) of Visit Flow started`,
                        visitFlow.VisitFlowMainActivity_FormPage_TitleInput,
                    );
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_CancelButton');
                    await visitFlow.waitTillVisible(
                        visitFlow.VisitFlowMainActivity_CancelDialog_Notice_Headline,
                        15000,
                    );
                    await visitFlow.waitTillVisible(
                        visitFlow.VisitFlowMainActivity_CancelDialog_SaveChanges_Button,
                        15000,
                    );
                    await visitFlow.clickElement('VisitFlowMainActivity_CancelDialog_SaveChanges_Button');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                    visitFlow.pause(0.5 * 1000);
                });
                it('Checking off "Survey"', async function () {
                    // debugger
                    await visitFlow.clickElement('VisitFlow_GroupButton_Surveys');
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_Survey, 15000);
                    visitFlow.pause(0.5 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Survey Group Clicked`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    // await visitFlow.clickElement('VisitFlow_StepButton_Survey');
                    await visitFlow.isSpinnerDone();
                    visitFlow.pause(0.5 * 1000);
                    // await webAppDialog.isErrorDialogShown(this); // There is an open Bug DI-23784
                    // await webAppDialog.selectDialogBox('Ok');
                    // await visitFlow.waitTillVisible(isitFlow.VisitFlow_OrdersChooseCatalogDialog_Content, 15000); // change to survey
                    visitFlow.pause(5 * 1000);
                });
                it('Checking off "End"', async function () {
                    // debugger
                    await visitFlow.clickElement('VisitFlow_GroupButton_End');
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_EndVisit, 15000);
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlow_StepButton_EndVisit');
                    await visitFlow.isSpinnerDone();
                    // await visitFlow.click(visitFlow.HtmlBody);
                    // await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_FormPage_FormContent, 15000);
                    // visitFlow.pause(0.5 * 1000);
                    // await visitFlow.insertTextToInputElement(
                    //     'Automated test finished Visit',
                    //     visitFlow.VisitFlowMainActivity_FormPage_TitleInput,
                    // );
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_SubmitButton');
                    // await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_CancelButton');
                    // await visitFlow.waitTillVisible(
                    //     visitFlow.VisitFlowMainActivity_CancelDialog_Notice_Headline,
                    //     15000,
                    // );
                    // await visitFlow.waitTillVisible(
                    //     visitFlow.VisitFlowMainActivity_CancelDialog_SaveChanges_Button,
                    //     15000,
                    // );
                    // await visitFlow.clickElement('VisitFlowMainActivity_CancelDialog_SaveChanges_Button');
                    await visitFlow.isSpinnerDone();
                    if (await driver.isElementVisible(visitFlow.VisitFlow_SelectVisit_Title)) {
                        visitFlow.pause(1.5 * 1000);
                        await visitFlow.click(visitFlow.getSelectorOfVisitFlowButtonByName(visitFlowName));
                    } else {
                        await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                    }
                    visitFlow.pause(0.5 * 1000);
                });
                it('Deleting Activities', async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Accounts');
                    driver.sleep(0.5 * 1000);
                    await webAppHeader.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.FirstAccountInList, 15000);
                    await visitFlow.clickElement('FirstAccountInList');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_ListSelectAll_Checkbox, 15000);
                    await visitFlow.clickElement('AccountHomePage_ListSelectAll_Checkbox');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_List_PencilButton, 15000);
                    await visitFlow.clickElement('AccountHomePage_List_PencilButton');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_List_UnderPencilButton_Delete, 15000);
                    await visitFlow.clickElement('AccountHomePage_List_UnderPencilButton_Delete');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(
                        visitFlow.AccountHomePage_List_DeletePopUpDialog_RedDeleteButton,
                        15000,
                    );
                    await visitFlow.clickElement('AccountHomePage_List_DeletePopUpDialog_RedDeleteButton');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_List_EmptyList_Message, 15000);
                    driver.sleep(2.5 * 1000);
                });
                it('Sign back in as Admin', async () => {
                    await e2eUtils.logOutLogIn(email, password);
                    await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
                });
            });

            describe('Teardown', () => {
                it('Unconfiguring Slug from Account Dashboard', async () => {
                    await accountDashboardLayout.unconfigureFromAccountMenuRepCard(driver, slug_path, '_auto_');
                });

                it('Getting VF_VisitFlowMainActivity activity (via API)', async () => {
                    getCreatedVisitFlowMainActivity = await objectsService.getActivity({
                        where: `'TSASubject="Automated test (${randomString}) of Visit Flow started"'`,
                    });
                });

                it('Getting Sales Order transaction (via API)', async () => {
                    getCreatedSalesOrderTransaction = await objectsService.getTransaction({
                        order_by: `CreationDateTime DESC`,
                    });
                });

                it('Deleting Survey Template via API', async () => {
                    await surveyService.deleteTemplateByKeyViaAPI(surveyUUID, client);
                });

                it('Deleting Slug via API', async () => {
                    const res = await slugs.deleteSlugByName(slug_path, client);
                    expect(res.Ok).to.be.true;
                    expect(res.Status).to.equal(200);
                    expect(res.Error).to.eql({});
                    expect(res.Body.success).to.be.true;
                    expect(await (await slugs.getSlugs(client)).Body.find((item) => item.Slug === slug_path)).to.be
                        .undefined;

                    // to be removed when DI-22793 is resolved:
                    // const clearMappedSlugsUpsertResponse = await e2eUtils.runOverMappedSlugs([], client);
                    // console.info(`existingMappedSlugs: ${JSON.stringify(clearMappedSlugsUpsertResponse, null, 4)}`);
                });

                it('Deleting Page via UI', async function () {
                    await e2eUtils.navigateTo('Page Builder');
                    await pageBuilder.isSpinnerDone();
                    await pageBuilder.waitTillVisible(pageBuilder.PagesList_Title, 15000);
                    await pageBuilder.waitTillVisible(pageBuilder.PagesList_NumberOfItemsInList, 15000);
                    await pageBuilder.searchForPageByName(pageName);
                    pageBuilder.pause(0.2 * 1000);
                    await pageBuilder.deleteFromListByName(pageName);
                    pageBuilder.pause(3 * 1000);
                    await pageBuilder.isSpinnerDone();
                    await pageBuilder.searchForPageByName(pageName);
                    expect(
                        await (await driver.findElement(pageBuilder.PagesList_EmptyList_Paragraph)).getText(),
                    ).to.contain('No results were found.');
                    await pageBuilder.isSpinnerDone();
                    pageBuilder.pause(0.2 * 1000);
                    await driver.click(pageBuilder.PageBuilder_Search_Clear);
                });

                // it('Deleting Pages leftovers via UI', async () => {
                //     pageBuilder.pause(0.1 * 1000);
                //     try {
                //         const allPages = await driver.findElements(pageBuilder.Page_Listing_aLink);
                //         do {
                //             const page = allPages.pop();
                //             if (page) {
                //                 const pageName = await page.getAttribute('title');
                //                 await pageBuilder.searchForPageByName(pageName);
                //                 pageBuilder.pause(0.2 * 1000);
                //                 await pageBuilder.deleteFromListByName(pageName);
                //                 await pageBuilder.searchForPageByName(pageName);
                //                 expect(
                //                     await (
                //                         await driver.findElement(pageBuilder.PagesList_EmptyList_Paragraph)
                //                     ).getText(),
                //                 ).to.contain('No results were found.');
                //                 await pageBuilder.isSpinnerDone();
                //                 pageBuilder.pause(0.1 * 1000);
                //                 await driver.click(pageBuilder.PageBuilder_Search_Clear);
                //             }
                //         } while (allPages.length);
                //         pageBuilder.pause(0.1 * 1000);
                //     } catch (error) {
                //         console.error(error);
                //     }
                // });

                // it('Verifying Mapped Slugs were cleared', async function () {
                //     await e2eUtils.logOutLogIn(email, password);
                //     await e2eUtils.navigateTo('Slugs');
                //     await slugs.clickTab('Mapping_Tab');
                //     await pageBuilder.isSpinnerDone();
                //     await slugs.waitTillVisible(lugs.EditPage_ConfigProfileCard_Rep_EmptyContent, 15000);
                //     const repCard_editButton = await driver.findElement(
                //         slugs.EditPage_ConfigProfileCard_EditButton_Rep,
                //         15000,
                //     );
                //     await repCard_editButton.click();
                //     await slugs.isSpinnerDone();
                //     await slugs.waitTillVisible(lugs.MappedSlugs_Title, 15000);
                //     await slugs.waitTillVisible(lugs.MappedSlugs_Container, 15000);
                //     await slugs.waitTillVisible(lugs.MappedSlugs_Empty, 15000);
                // });

                it('Verifying VF_VisitFlowMainActivity activity was formed', async () => {
                    console.info(
                        `getCreatedVisitFlowMainActivity: ${JSON.stringify(getCreatedVisitFlowMainActivity, null, 4)}`,
                    );
                    expect(getCreatedVisitFlowMainActivity).to.be.an('array').with.lengthOf(1);
                    expect(getCreatedVisitFlowMainActivity[0]).to.haveOwnProperty('Type');
                    expect(getCreatedVisitFlowMainActivity[0].Type).to.equal('VF_VisitFlowMainActivity');
                    expect(getCreatedVisitFlowMainActivity[0]).to.haveOwnProperty('TSAFlowID');
                    expect(getCreatedVisitFlowMainActivity[0]).to.haveOwnProperty('TSAVisitSelectedGroup');
                    expect(getCreatedVisitFlowMainActivity[0]).to.haveOwnProperty('Title');
                    expect(getCreatedVisitFlowMainActivity[0].Title).to.contain(`Automated test (${randomString}) `);
                    // expect(getCreatedVisitFlowMainActivity[0]).to.haveOwnProperty('TSASubject');
                    // expect(getCreatedVisitFlowMainActivity[0].TSASubject).to.equal(
                    //     `Automated test (${randomString}) of Visit Flow started`,
                    // );
                });

                it('Verifying Sales Order transaction was formed', async () => {
                    console.info(
                        `getCreatedSalesOrderTransaction: ${JSON.stringify(getCreatedSalesOrderTransaction, null, 4)}`,
                    );
                    expect(getCreatedSalesOrderTransaction).to.be.an('array').with.lengthOf(1);
                    expect(getCreatedSalesOrderTransaction[0].Type).to.equal('Sales Order');
                    expect(getCreatedSalesOrderTransaction[0]).to.haveOwnProperty('StatusName');
                    expect(getCreatedSalesOrderTransaction[0].StatusName).to.equal('Submitted');
                    expect(getCreatedSalesOrderTransaction[0]).to.haveOwnProperty('ItemsCount');
                    expect(getCreatedSalesOrderTransaction[0].ItemsCount).to.equal(1);
                    expect(getCreatedSalesOrderTransaction[0]).to.haveOwnProperty('Account');
                    expect(getCreatedSalesOrderTransaction[0]).to.haveOwnProperty('Catalog');
                    expect(getCreatedSalesOrderTransaction[0].Catalog.Data.ExternalID).to.equal('Default Catalog');
                    expect(getCreatedSalesOrderTransaction[0]).to.haveOwnProperty('TransactionLines');
                });

                it('Deleting UDCs listings', async () => {
                    // deleting created VisitFlowGroups documents
                    upsertedListingsToVisitFlowGroups.forEach(async (documentBody) => {
                        const deleteResponse = await udcService.hideObjectInACollection(
                            'VisitFlowGroups',
                            documentBody.Key,
                        );
                        expect(deleteResponse.Ok).to.be.true;
                        expect(deleteResponse.Status).to.equal(200);
                        expect(deleteResponse.Error).to.eql({});
                        expect(deleteResponse.Body.Hidden).to.be.true;
                        expect(deleteResponse.Body.Key).to.equal(documentBody.Key);
                        expect(deleteResponse.Body.Title).to.equal(documentBody.Title);
                        expect(deleteResponse.Body.SortIndex).to.equal(documentBody.SortIndex);
                    });

                    // deleting created VisitFlows documents
                    upsertedListingsToVisitFlows.forEach(async (documentBody) => {
                        const deleteResponse = await udcService.hideObjectInACollection('VisitFlows', documentBody.Key);
                        expect(deleteResponse.Ok).to.be.true;
                        expect(deleteResponse.Status).to.equal(200);
                        expect(deleteResponse.Error).to.eql({});
                        expect(deleteResponse.Body.Hidden).to.be.true;
                        expect(deleteResponse.Body.Key).to.equal(documentBody.Key);
                        expect(deleteResponse.Body.Title).to.equal(documentBody.Title);
                    });

                    // deleting any leftovers from unsuccessful previous tests
                    let visitFlowGroupsDocuments = await udcService.getDocuments('VisitFlowGroups', {
                        where: 'Title like "%Auto%"',
                    });
                    console.info('visitFlowGroupsDocuments: ', visitFlowGroupsDocuments);
                    visitFlowGroupsDocuments.forEach(async (visitFlowGroupsDocument) => {
                        await udcService.hideObjectInACollection('VisitFlowGroups', visitFlowGroupsDocument.Key);
                    });
                    driver.sleep(2.5 * 1000);
                    visitFlowGroupsDocuments = await udcService.getDocuments('VisitFlowGroups', {
                        where: 'Title like "%Auto%"',
                    });
                    expect(visitFlowGroupsDocuments).to.be.an('array').with.lengthOf(0);

                    let visitFlowsDocuments = await udcService.getDocuments('VisitFlows', {
                        where: 'Name like "Auto%"',
                    });
                    console.info('visitFlowsDocuments: ', visitFlowsDocuments);
                    visitFlowsDocuments.forEach(async (visitFlowsDocument) => {
                        await udcService.hideObjectInACollection('VisitFlows', visitFlowsDocument.Key);
                    });
                    driver.sleep(2.5 * 1000);
                    visitFlowsDocuments = await udcService.getDocuments('VisitFlows', {
                        where: 'Name like "Auto%"',
                    });
                    expect(visitFlowsDocuments).to.be.an('array').with.lengthOf(0);

                    visitFlowsDocuments = await udcService.getDocuments('VisitFlows', {
                        where: 'Name="MockVisit"',
                    });
                    console.info('visitFlowsDocuments: ', visitFlowsDocuments);
                    visitFlowsDocuments.forEach(async (visitFlowsDocument) => {
                        await udcService.hideObjectInACollection('VisitFlows', visitFlowsDocument.Key);
                    });
                    driver.sleep(2.5 * 1000);
                    visitFlowsDocuments = await udcService.getDocuments('VisitFlows', {
                        where: 'Name="MockVisit"',
                    });
                    expect(visitFlowsDocuments).to.be.an('array').with.lengthOf(0);
                });

                it('Deleting Activities', async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Accounts');
                    driver.sleep(0.5 * 1000);
                    await webAppHeader.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.FirstAccountInList, 15000);
                    await visitFlow.clickElement('FirstAccountInList');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_ListSelectAll_Checkbox, 15000);
                    await visitFlow.clickElement('AccountHomePage_ListSelectAll_Checkbox');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_List_PencilButton, 15000);
                    await visitFlow.clickElement('AccountHomePage_List_PencilButton');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_List_UnderPencilButton_Delete, 15000);
                    await visitFlow.clickElement('AccountHomePage_List_UnderPencilButton_Delete');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(
                        visitFlow.AccountHomePage_List_DeletePopUpDialog_RedDeleteButton,
                        15000,
                    );
                    await visitFlow.clickElement('AccountHomePage_List_DeletePopUpDialog_RedDeleteButton');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_List_EmptyList_Message, 15000);
                    driver.sleep(2.5 * 1000);
                });
            });
        });
    });
}
