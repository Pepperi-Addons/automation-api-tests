import { describe, it, before, after, afterEach } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService, { FetchStatusResponse } from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Browser } from '../utilities/browser';
import { WebAppHeader, WebAppHomePage, WebAppLoginPage, WebAppList, WebAppAPI } from '../pom';
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

export async function VisitFlowTests(varPass: string, client: Client, email: string, password: string) {
    /** Description **/
    /* full user flow of the Visit Flow feature *
     * including: Addons upgrades, configuration of Visit Flow UDCs values via API, configuration of Page & Slug, adding them to Account Dashboard Layout *
     * TEST STEPS:
     *   1. Addons Upgrade
     *   2. Login
     *   3. Manual Resync (via UI and listening to endpoint GetSyncStatus)
     *   4. Pages Leftovers Cleanup (starting with "VisitFlow Page Auto_") via API
     *   5. Pages Leftovers Cleanup (starting with "Blank") via API
     *   6. Making sure UDCs custom (manually inserted) fields are NOT removed upon version upgrade (via API)
     *   7. Inserting Data to the UDC VisitFlowGroups (via API)
     *   8. Creating a Page with VisitFlow Block (via UI + block addition via API)
     *   9. Inserting Data to the UDC: VisitFlows (via API)
     *   10. Creating and Mapping a Slug (via UI + mapping the created page to the created slug via API)
     *   11. Configuring Account Dashboard (adding the slug to the menu of a specific user dashboard display)
     *       -> Logout & Login + Manual Sync (activated through 'Accounts' list and listening to endpoint GetSyncStatus)
     *   12. Going Through a Basic Visit Flow:
     *       1. Navigating to a specific Account & Entering Visit Flow slug from Menu
     *       2. If more than one visit - Choosing a Visit Flow
     *       3. Checking off "Start" (Visit Flow Activity Form)
     *       4. Checking off "Orders" (picking one item -> entering cart -> submitting order)
     *       5. Checking off "End" (Visit Flow Activity Form - and making sure the visit is closed)
     *   13. Survey Prep
     *       1. Configuring Survey (via UI - survey builder)
     *       2. Configuring Survey in UDC: Flows
     *       3. Performing Manual Sync
     *       4. Loging Out and Loging In as Rep
     *       5. Navigating to a specific Account & Entering Visit Flow slug from Menu
     *       6. If more than one visit - Choosing a Visit Flow
     *       7. Checking off "Start" (Visit Flow Activity Form)
     *       8. Checking off "Survey" (only validating the step appears in the flow - survey DO NOT OPEN!!!)
     *       9. Checking off "End" (Visit Flow Activity Form - and making sure the visit is closed)
     *       10. Deleting Activities (via UI)
     *       11. Sign back in as Admin
     *   14. Teardown
     *       1. Getting VF_VisitFlowMainActivity activity (via API)  (to make sure it was created)
     *       2. Getting Sales Order transaction (via API)
     *       3. Unconfiguring Slug from Account Dashboard
     *       4. Deleting Survey Template via API
     *       5. Deleting Slug via API
     *       6. Deleting Page via UI
     *       7. Verifying VF_VisitFlowMainActivity activity was formed
     *       8. Verifying Sales Order transaction was formed
     *       9. Deleting UDCs "VisitFlowGroups" listings
     *       10. Deleting UDCs "VisitFlows" listings
     *       11. Deleting LEFTOVERS UDCs "VisitFlowGroups" listings
     *       12. Deleting LEFTOVERS UDCs "VisitFlows" listings
     *       13. Deleting LEFTOVERS "MockVisit" listings from UDC "VisitFlows"
     *       14. Deleting Activities (via UI)
     *   15. Displaying Addons installed versions
     */

    const date = new Date();
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const udcService = new UDCService(generalService);
    const repEmail = email.split('@')[0] + '.rep@pepperitest.com';
    const buyerEmail = email.split('@')[0] + '.buyer@pepperitest.com';
    const baseUrl = `https://${client.BaseURL.includes('staging') ? 'app.sandbox.pepperi.com' : 'app.pepperi.com'}`;

    const testData = {
        VisitFlow: ['2b462e9e-16b5-4e7a-b1e6-9e2bfb61db7e', ''],
        'pepperi-pack': ['4817f4fe-9ff6-435e-9415-96b1142675eb', ''],
        Nebula: ['00000000-0000-0000-0000-000000006a91', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''], // dependency > 0.2.58
        // sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '1.%'], // versions 2.0.% are open sync and are irrelevant to this test
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        Nebulus: ['e8b5bb3a-d2df-4828-90f4-32cc3d49f207', ''], // dependency of UDC
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', ''], // PFS makes create session loop
        // 'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', '1.3.88'], // PFS makes create session loop
        'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', ''], // current phased version 0.5.10 | dependency > 0.5.7
        // Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', '0.6.26'], // current phased version 0.6.26 | dependency > 0.6.3
        // 'Abstract Activity': ['92b9bd68-1660-4998-91bc-3b745b4bab11', '0.0.8'],
        // 'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', '0.8.34'], // UDC current phased version 0.8.29 | dependency > 0.8.11
        // Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', '1.0.%'], // current phased version 0.9.38 | dependency > 0.9.31
        // Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''], // current phased version 1.0.23 | dependency > 1.0.23
        survey: ['dd0a85ea-7ef0-4bc1-b14f-959e0372877a', ''],
        'Survey Builder': ['cf17b569-1af4-45a9-aac5-99f23cae45d8', '0.8.%'], //15/5/24: phased version is 0.7.50, once we'll phase 0.8.x and avaliable 0.9.x this has to change
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', '1.3.7'], //slugs above 1.3.7 (1.3.8 and so on) require config  >=1.0.18 but we cant upgrade as its for open sync
        // Slideshow: ['f93658be-17b6-4c92-9df3-4e6c7151e038', '1.1.23'],
        // 'API Testing Framework': ['eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', '0.0.793'], //OUR TESTING ADDON --
        // 'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.34'], // PAPI
        // 'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.41'], // CPAPI
        // 'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '17.20.10'], // CPAS
        // 'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''], // CPAS
        // 'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''], // CPAS
        // 'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '17.16.137'],
        // 'Settings Framework': ['354c5123-a7d0-4f52-8fce-3cf1ebc95314', '9.6.369'],
        // 'Addons Manager': ['bd629d5f-a7b4-4d03-9e7c-67865a6d82a9', '1.1.3'],
        // 'Data Views API': ['484e7f22-796a-45f8-9082-12a734bac4e8', '1.0.5'],
        // 'ADAL': ['00000000-0000-0000-0000-00000000ada1', '1.6.15'],
        // 'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', '1.4.31'],
        // 'Activity Data Index': ['10979a11-d7f4-41df-8993-f06bfd778304', '1.1.22'],
        // 'Audit Log': ['00000000-0000-0000-0000-00000da1a109', '1.0.38'],
        // 'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', '1.0.2'],
        // 'Object Types Editor': ['04de9428-8658-4bf7-8171-b59f6327bbf1', '1.0.134'],
        // 'Notification Service': ['00000000-0000-0000-0000-000000040fa9', '1.0.118'],
        // 'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', '1.0.1'],
        // 'Item Trade Promotions': ['b5c00007-0941-44ab-9f0e-5da2773f2f04', '6.3.66'],
        // 'Order Trade Promotions': ['375425f5-cd2f-4372-bb88-6ff878f40630', '6.3.77'],
        // 'Package Trade Promotions': ['90b11a55-b36d-48f1-88dc-6d8e06d08286', '6.4.64'],
        // 'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '1.4.19'], // CPI_Node current phased version 1.1.92 | dependency > 1.1.85
        // 'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''], // CPI_Node current phased version 1.1.92 | dependency > 1.1.85
        // 'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''], // CPI_Node current phased version 1.1.92 | dependency > 1.1.85
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''], // CPI_Node_data current phased version 0.6.14 | dependency > 0.6.11
        // 'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', '0.6.%'], // CPI_Node_data current phased version 0.6.14 | dependency > 0.6.11
        // 'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', '0.6.52'], // current phased version 0.6.48 | dependency > 0.6.41
        // 'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', '0.6.%'], // current phased version 0.6.41 | dependency > 0.6.35
        // 'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''], // current phased version 0.6.2 | dependency > 0.6.2
        // 'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''], // current phased version 0.7.112 | dependency > 0.7.104
        // Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''],
    };

    await generalService.baseAddonVersionsInstallation(varPass);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    console.info('chnageVersionResponseArr: ', JSON.stringify(chnageVersionResponseArr, null, 2));

    let driver: Browser;
    let e2eUtils: E2EUtils;
    let webAppAPI: WebAppAPI;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let webAppList: WebAppList;
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
    let salesOrderItemName: string;
    let base64ImageComponent;

    const installedVisitFlowVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'VisitFlow',
    )?.Version;

    describe(`Visit Flow Test Suite - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } || Ver: ${installedVisitFlowVersion} || ${date}`, async () => {
        describe('Visit Flow UI tests', () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppAPI = new WebAppAPI(driver, client);
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                webAppList = new WebAppList(driver);
                accountDashboardLayout = new AccountDashboardLayout(driver);
                surveyService = new SurveyTemplateBuilder(driver);
                e2eUtils = new E2EUtils(driver);
                orderPage = new OrderPage(driver);
                visitFlow = new VisitFlow(driver);
                pageBuilder = new PageBuilder(driver);
                slugs = new Slugs(driver);
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

            it('Login', async function () {
                await webAppLoginPage.login(email, password);
            });

            it('Manual Resync', async function () {
                await e2eUtils.performManualResync.bind(this)(client, driver);
            });

            it('Pages Leftovers Cleanup (starting with "VisitFlow Page Auto_")', async function () {
                const allPages = await pageBuilder.getAllPages(client);
                const pagesOfAutoTest = allPages?.Body.filter((page) => {
                    if (page.Name.includes('VisitFlow Page Auto_')) {
                        return page.Key;
                    }
                });
                console.info(`allPages: ${JSON.stringify(allPages.Body, null, 4)}`);
                console.info(`pagesOfAutoTest: ${JSON.stringify(pagesOfAutoTest, null, 4)}`);
                const deleteAutoPagesResponse: FetchStatusResponse[] = await Promise.all(
                    pagesOfAutoTest.map(async (autoPage) => {
                        const deleteAutoPageResponse = await pageBuilder.removePageByUUID(autoPage.Key, client);
                        console.info(`deleteAutoPageResponse: ${JSON.stringify(deleteAutoPageResponse, null, 4)}`);
                        return deleteAutoPageResponse;
                    }),
                );
                console.info(`deleteAutoPagesResponse: ${JSON.stringify(deleteAutoPagesResponse, null, 4)}`);
                generalService.sleep(5 * 1000);
                const allPagesAfterCleanup = await pageBuilder.getAllPages(client);
                const findAutoPageAfterCleanup = allPagesAfterCleanup?.Body.find((page) => page.Name.includes('Auto_'));
                console.info(`findAutoPageAfterCleanup: ${JSON.stringify(findAutoPageAfterCleanup, null, 4)}`);
                expect(findAutoPageAfterCleanup).to.be.undefined;
            });

            it('Pages Leftovers Cleanup (starting with "Blank")', async function () {
                const allPages = await pageBuilder.getDraftPages(client);
                console.info(
                    `allPages.Body.length (looking for Blank Page): ${JSON.stringify(allPages.Body.length, null, 4)}`,
                );
                const blankPages = allPages?.Body.filter((page) => {
                    if (page.Name.includes('Blank Page ')) {
                        return page.Key;
                    }
                });
                console.info(`allPages: ${JSON.stringify(allPages.Body, null, 4)}`);
                console.info(`blankPages: ${JSON.stringify(blankPages, null, 4)}`);
                const deleteBlankPagesResponse: FetchStatusResponse[] = await Promise.all(
                    blankPages.map(async (blankPage) => {
                        const deleteAutoPageResponse = await pageBuilder.removePageByUUID(blankPage.Key, client);
                        console.info(`deleteAutoPageResponse: ${JSON.stringify(deleteAutoPageResponse, null, 4)}`);
                        return deleteAutoPageResponse;
                    }),
                );
                console.info(`deleteBlankPagesResponse: ${JSON.stringify(deleteBlankPagesResponse, null, 4)}`);
                generalService.sleep(5 * 1000);
                const allPagesAfterCleanup = await pageBuilder.getDraftPages(client);
                const findBlankPageAfterCleanup = allPagesAfterCleanup?.Body.find((page) =>
                    page.Name.includes('Blank Page'),
                );
                console.info(`findBlankPageAfterCleanup: ${JSON.stringify(findBlankPageAfterCleanup, null, 4)}`);
                expect(findBlankPageAfterCleanup).to.be.undefined;
            });

            it('Making sure UDCs custom (manually inserted) fields are NOT removed upon version upgrade', async function () {
                // custom field "manuallyAddedField" was added to "VisitFlows" collection, and needs to be there after version upgrade
                const visitFlowsSchemes = await udcService.getSchemes({
                    where: 'Name="VisitFlows"',
                });
                expect(visitFlowsSchemes).to.be.an('array').with.lengthOf(1);
                expect(visitFlowsSchemes[0]).to.haveOwnProperty('Fields');
                expect(visitFlowsSchemes[0].Fields).to.haveOwnProperty('manuallyAddedField');
                console.info('visitFlowsSchemes: ', JSON.stringify(visitFlowsSchemes[0].Fields, null, 2));
                // custom field "manuallyAddedStepField" was added to "VisitFlowSteps" collection, and needs to be there after version upgrade
                const visitFlowStepsSchemes = await udcService.getSchemes({
                    where: 'Name="VisitFlowSteps"',
                });
                expect(visitFlowStepsSchemes).to.be.an('array').with.lengthOf(1);
                expect(visitFlowStepsSchemes[0]).to.haveOwnProperty('Fields');
                expect(visitFlowStepsSchemes[0].Fields).to.haveOwnProperty('manuallyAddedStepField');
                console.info('visitFlowStepsSchemes: ', JSON.stringify(visitFlowStepsSchemes[0].Fields, null, 2));
                // custom field "manuallyAddedGroupField" was added to "VisitFlowSteps" collection, and needs to be there after version upgrade
                const visitFlowGroupsSchemes = await udcService.getSchemes({
                    where: 'Name="VisitFlowGroups"',
                });
                expect(visitFlowGroupsSchemes).to.be.an('array').with.lengthOf(1);
                expect(visitFlowGroupsSchemes[0]).to.haveOwnProperty('Fields');
                expect(visitFlowGroupsSchemes[0].Fields).to.haveOwnProperty('manuallyAddedGroupField');
                console.info('visitFlowGroupsSchemes: ', JSON.stringify(visitFlowGroupsSchemes[0].Fields, null, 2));
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
                it('Configuring UDC: Visit Flow Groups', async function () {
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
                        console.info(
                            `Insertion to Visit Flow Groups Response: ${JSON.stringify(
                                upsertingValues_Response,
                                null,
                                4,
                            )}`,
                        );
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

                it('If Error popup appear - close it', async function () {
                    await driver.refresh();
                    const accessToken = await webAppAPI.getAccessToken();
                    let errorDialogAppear = true;
                    do {
                        await webAppAPI.pollForResyncResponse(accessToken, 100);
                        try {
                            errorDialogAppear = await webAppHomePage.isErrorDialogOnHomePage(this);
                        } catch (error) {
                            console.error(error);
                        } finally {
                            await driver.navigate(`${baseUrl}/HomePage`);
                        }
                        await webAppAPI.pollForResyncResponse(accessToken);
                    } while (errorDialogAppear);
                });

                it('New Page through the UI + VisitFlow Block through API', async function () {
                    await driver.refresh();
                    // pageUUID = await e2eUtils.addPage(pageName, 'Visit Flow 0.5 tests');
                    await driver.untilIsVisible(webAppHomePage.MainHomePageBtn);
                    await e2eUtils.navigateTo('Page Builder');
                    pageBuilder.pause(1000);
                    await pageBuilder.addBlankPage(pageName, 'Visit Flow 0.5 tests');
                    pageBuilder.pause(2 * 1000);
                    pageUUID = await e2eUtils.getUUIDfromURL();
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
                    pageBuilder.pause(0.2 * 1000);
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
                });
            });

            describe('Inserting Data to the UDC: VisitFlows', () => {
                it('Configuring Flows', async function () {
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
                                    Completed: ['In Creation'],
                                    Resource: 'activities',
                                    Title: 'Start Visit',
                                    Group: group_Start ? group_Start.Key : '',
                                    ResourceCreationData: 'VF_VisitFlowMainActivity',
                                    Mandatory: true,
                                },
                                {
                                    Completed: ['In Progress'],
                                    Resource: 'transactions',
                                    Title: 'Sales Order',
                                    Group: group_Orders ? group_Orders.Key : '',
                                    ResourceCreationData: 'Sales Order',
                                },
                                {
                                    Completed: ['Submitted'],
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
                        console.info(
                            `Insertion to VisitFlows Response: ${JSON.stringify(upsertingValues_Response, null, 4)}`,
                        );
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
                    driver.sleep(2 * 1000);
                    await e2eUtils.logOutLogIn(email, password, client);
                    await webAppHomePage.isSpinnerDone();
                    await e2eUtils.navigateTo('Slugs');
                    await slugs.clickTab('Mapping_Tab');
                    await webAppHomePage.isSpinnerDone();
                    await slugs.waitTillVisible(slugs.MappingTab_RepCard_InnerListOfMappedSlugs, 15000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Slug Mapped`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
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
                it('Navigating to Account Dashboard Layout -> Menu (Pencil) -> Rep (Pencil)', async function () {
                    await accountDashboardLayout.configureToAccountMenuRepCard(
                        driver,
                        slugDisplayName,
                        randomString,
                        slug_path,
                    );
                });

                it('Performing Manual Sync', async function () {
                    await e2eUtils.logOutLogIn(email, password, client);
                    await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
                    await e2eUtils.performManualSync.bind(this)(client, driver);
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
                        base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Choosing a Visit`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
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
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_Groups_Content, 15000);
                    await visitFlow.clickElement('VisitFlow_GroupButton_Start');
                    visitFlow.pause(0.5 * 1000);
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
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlow_GroupButton_Orders');
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_SalesOrder, 15000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Selecting 'Orders' Group`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlow_StepButton_SalesOrder');
                    await visitFlow.isSpinnerDone();
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_OrdersChooseCatalogDialog_Content, 15000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Selecting Catalog`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.clickElement('VisitFlow_OrdersChooseCatalogDialog_FirstCatalogInList_RadioButton');
                    await visitFlow.waitTillVisible(
                        visitFlow.VisitFlow_OrdersChooseCatalogDialog_SelectedCatalog_RadioButton,
                        15000,
                    );
                    await visitFlow.clickElement('VisitFlow_OrdersChooseCatalogDialog_DoneButton');
                    await visitFlow.isSpinnerDone();
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `at Order Center`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    // Choosing an item in Order Center:
                    await driver.untilIsVisible(webAppList.ListCardViewElement);
                    await orderPage.searchInOrderCenter(salesOrderItemName);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Searched for a spesific item in order center`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await driver.click(
                        orderPage.getSelectorOfItemQuantityPlusButtonInOrderCenterByName(salesOrderItemName),
                    );
                    await orderPage.clearOrderCenterSearch();
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_DefaultCatalog_CartButton, 15000);
                    await visitFlow.clickElement('VisitFlow_DefaultCatalog_CartButton');
                    await visitFlow.isSpinnerDone();
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `at Cart`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_DefaultCatalog_SubmitButton, 15000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Order Finished - before submission`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.clickElement('VisitFlow_DefaultCatalog_SubmitButton');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                    visitFlow.pause(0.5 * 1000);
                });

                it('Checking off "End"', async function () {
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
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_FormPage_FormContent, 15000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `End Visit Step Clicked`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.click(visitFlow.HtmlBody);
                    visitFlow.pause(1 * 1000);
                    if (email.startsWith('visit.flow.eu')) {
                        await visitFlow.waitTillVisible(
                            visitFlow.VisitFlowMainActivity_FormPage_Header_SubmitButton,
                            15000,
                        );
                        await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_SubmitButton');
                    } else {
                        await visitFlow.waitTillVisible(
                            visitFlow.VisitFlowMainActivity_FormPage_Header_DoneButton,
                            15000,
                        );
                        await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_DoneButton');
                    }
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

            /* commented out on 24.6.24 because survey configuration started failing 
            Error: After wait time of: 15000, for selector of '//pep-button[@iconname="arrow_down"]', The test must end, The element is: undefined
                at Browser.findElements (ui-tests\utilities\browser.ts:598:19)
                at processTicksAndRejections (node:internal/process/task_queues:95:5)
                at Browser.click (ui-tests\utilities\browser.ts:193:20)
                at SurveyTemplateBuilder.addQuestionToSurvey (ui-tests\pom\addons\SurveyTemplateBuilder.ts:394:25)
                at SurveyTemplateBuilder.configureTheSurveyTemplate (ui-tests\pom\addons\SurveyTemplateBuilder.ts:293:17)
                at Context.<anonymous> (ui-tests\tests\visit_flow.test.ts:717:34) */
            describe('Survey Prep', () => {
                it('Configuring Survey', async function () {
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

                it('Configuring Survey in UDC: Flows', async function () {
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
                        Completed: ['In Progress'],
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

                it('Performing Manual Sync', async function () {
                    await e2eUtils.performManualSync.bind(this)(client, driver);
                });

                it('Loging Out and Loging In as Rep', async function () {
                    await e2eUtils.logOutLogIn(repEmail, password, client);
                    await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
                    await e2eUtils.performManualSync.bind(this)(client, driver);
                });

                it('Negative - Verifying settings button not available on rep', async function () {
                    await e2eUtils.verifySettingsButtonNotAvailable();
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
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_Groups_Content, 15000);
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

                it('Checking off "Survey"', async function () {
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
                    await visitFlow.clickElement('VisitFlow_GroupButton_End');
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_EndVisit, 15000);
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlow_StepButton_EndVisit');
                    await visitFlow.isSpinnerDone();
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `End Step at Survey Visit Clicked`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_FormPage_FormContent, 15000);
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.click(visitFlow.HtmlBody);
                    visitFlow.pause(1 * 1000);
                    if (email.includes('.eu@')) {
                        await visitFlow.waitTillVisible(
                            visitFlow.VisitFlowMainActivity_FormPage_Header_SubmitButton,
                            15000,
                        );
                        await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_SubmitButton');
                    } else {
                        await visitFlow.waitTillVisible(
                            visitFlow.VisitFlowMainActivity_FormPage_Header_DoneButton,
                            15000,
                        );
                        await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_DoneButton');
                    }
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
                        title: `Survey Visit Finished`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('Deleting Activities', async function () {
                    await e2eUtils.logOutLogIn(repEmail, password, client);
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
                // moved to decribe below (line 1063)
                //  it('Sign back in as Admin', async function () {
                //     await e2eUtils.logOutLogIn(email, password, client);
                //     await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
                // });
            });

            describe('Verifying no settings button with buyer', () => {
                it('Loging Out and Loging In as Buyer', async function () {
                    await e2eUtils.logOutLogIn(buyerEmail, password, client);
                    await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
                    await e2eUtils.performManualSync.bind(this)(client, driver);
                });

                it('Negative - Verifying settings button not available on buyer', async function () {
                    await e2eUtils.verifySettingsButtonNotAvailable();
                });

                it('Sign back in as Admin', async function () {
                    await e2eUtils.logOutLogIn(email, password, client);
                    await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
                });
            });

            describe('Teardown', () => {
                it('Getting VF_VisitFlowMainActivity activity (via API)', async function () {
                    getCreatedVisitFlowMainActivity = await objectsService.getActivity({
                        where: `'TSASubject="Automated test (${randomString}) of Visit Flow started"'`,
                    });
                });

                it('Getting Sales Order transaction (via API)', async function () {
                    getCreatedSalesOrderTransaction = await objectsService.getTransaction({
                        order_by: `CreationDateTime DESC`,
                    });
                });

                it('Unconfiguring Slug from Account Dashboard', async function () {
                    await accountDashboardLayout.unconfigureFromAccountMenuRepCard(driver, slug_path, '_auto_');
                });

                it('Deleting Survey Template via API', async function () {
                    await surveyService.deleteTemplateByKeyViaAPI(surveyUUID, client);
                });

                it('Deleting Slug via API', async function () {
                    const res = await slugs.deleteSlugByName(slug_path, client);
                    expect(res.Ok).to.be.true;
                    expect(res.Status).to.equal(200);
                    expect(res.Error).to.eql({});
                    expect(res.Body.success).to.be.true;
                    expect(await (await slugs.getSlugs(client)).Body.find((item) => item.Slug === slug_path)).to.be
                        .undefined;
                });

                it('Deleting Page via UI', async function () {
                    await e2eUtils.navigateTo('Page Builder');
                    await pageBuilder.isSpinnerDone();
                    await pageBuilder.waitTillVisible(pageBuilder.PagesList_Title, 15000);
                    await pageBuilder.waitTillVisible(pageBuilder.PagesList_NumberOfItemsInList, 15000);
                    await pageBuilder.searchForPageByName(pageName);
                    pageBuilder.pause(0.2 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Search for ${pageName} before deletion`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await pageBuilder.deleteFromListByName.bind(this)(pageName, driver);
                    pageBuilder.pause(3 * 1000);
                    await pageBuilder.isSpinnerDone();
                    await pageBuilder.searchForPageByName(pageName);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Search for ${pageName} after deletion`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    expect(
                        await (await driver.findElement(pageBuilder.PagesList_EmptyList_Paragraph)).getText(),
                    ).to.contain('No results were found.');
                    await pageBuilder.isSpinnerDone();
                    pageBuilder.pause(0.2 * 1000);
                    await driver.click(pageBuilder.PageBuilder_Search_Clear);
                });

                it('Verifying VF_VisitFlowMainActivity activity was formed', async function () {
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
                });

                it('Verifying Sales Order transaction was formed', async function () {
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

                it('Deleting UDCs "VisitFlowGroups" listings', async function () {
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
                });

                it('Deleting UDCs "VisitFlows" listings', async function () {
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
                });

                it('Deleting LEFTOVERS UDCs "VisitFlowGroups" listings', async function () {
                    // deleting any leftovers from unsuccessful previous tests
                    let visitFlowGroupsDocuments = await udcService.getDocuments('VisitFlowGroups', {
                        where: 'Title like "%Auto%"',
                    });
                    console.info('visitFlowGroupsDocuments: ', visitFlowGroupsDocuments);
                    visitFlowGroupsDocuments.forEach(async (visitFlowGroupsDocument) => {
                        await udcService.hideObjectInACollection('VisitFlowGroups', visitFlowGroupsDocument.Key);
                    });
                    driver.sleep(5 * 1000);
                    visitFlowGroupsDocuments = await udcService.getDocuments('VisitFlowGroups', {
                        where: 'Title like "%Auto%"',
                    });
                    expect(visitFlowGroupsDocuments).to.be.an('array').with.lengthOf(0);
                });

                it('Deleting LEFTOVERS UDCs "VisitFlows" listings', async function () {
                    // deleting any leftovers from unsuccessful previous tests
                    let visitFlowsDocuments = await udcService.getDocuments('VisitFlows', {
                        where: 'Name like "Auto%"',
                    });
                    console.info('visitFlowsDocuments: ', visitFlowsDocuments);
                    visitFlowsDocuments.forEach(async (visitFlowsDocument) => {
                        await udcService.hideObjectInACollection('VisitFlows', visitFlowsDocument.Key);
                    });
                    driver.sleep(5 * 1000);
                    visitFlowsDocuments = await udcService.getDocuments('VisitFlows', {
                        where: 'Name like "Auto%"',
                    });
                    expect(visitFlowsDocuments).to.be.an('array').with.lengthOf(0);
                });

                it('Deleting LEFTOVERS "MockVisit" listings from UDC "VisitFlows"', async function () {
                    let visitFlowsDocuments = await udcService.getDocuments('VisitFlows', {
                        where: 'Name="MockVisit"',
                    });
                    console.info('visitFlowsDocuments: ', visitFlowsDocuments);
                    visitFlowsDocuments.forEach(async (visitFlowsDocument) => {
                        await udcService.hideObjectInACollection('VisitFlows', visitFlowsDocument.Key);
                    });
                    driver.sleep(5 * 1000);
                    visitFlowsDocuments = await udcService.getDocuments('VisitFlows', {
                        where: 'Name="MockVisit"',
                    });
                    expect(visitFlowsDocuments).to.be.an('array').with.lengthOf(0);
                });

                it('Deleting Activities', async function () {
                    try {
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
                    } catch (error) {
                        console.error(error);
                        base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `UI deletion of Activities FAILED!`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                        const allActivities = await objectsService.getActivity();
                        console.info('Length of All Activity List: ', allActivities.length);
                        const deleteResponse = await Promise.all(
                            allActivities.map(async (activity) => {
                                return await objectsService.deleteActivity(activity.InternalID || 0);
                            }),
                        );
                        console.info('deleteResponse: ', JSON.stringify(deleteResponse, null, 2));
                        expect('UI deletion of Activities FAILED!').to.equal('API deletion was performed');
                    }
                });
            });
        });

        describe(`Prerequisites Addons for Visit Flow Tests`, async () => {
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
    });
}
