import promised from 'chai-as-promised';
import chai, { expect } from 'chai';
import {
    describe,
    it,
    // afterEach,
    before,
    after,
} from 'mocha';
import addContext from 'mochawesome/addContext';
import GeneralService, { FetchStatusResponse } from '../../services/general.service';
import E2EUtils from '../utilities/e2e_utils';
import { Browser } from '../utilities/browser';
import { UDCService } from '../../services/user-defined-collections.service';
import { ObjectsService } from '../../services';
import { Client } from '@pepperi-addons/debug-server/dist';
import { v4 as uuidv4 } from 'uuid';
import { BaseFormDataViewField, DataViewFieldType, UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import { WebAppAPI, WebAppHeader, WebAppHomePage, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
import { ResourceEditors, ResourceList, ResourceViews } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { Slugs } from '../pom/addons/Slugs';
import { AccountDashboardLayout } from '../pom/AccountDashboardLayout';
import { ResourceListBlock } from '../pom/ResourceList.block';
import { BasePageLayoutSectionColumn, ResourceViewEditorBlock } from '../blueprints/PageBlocksBlueprints';

chai.use(promised);

/** Description **/
/* This is a temaplate file - copy it's content and change for your own need
   it contains key functions as an example of use, but will probably not include ALL that you'll need
   steps to perform after copy:
       1. change function name
       2. import new function name at index.ts file
       3. add the new function name to the import list from index.ts at test.index.ts file (it's at the top section of the file)
       4. create an if with your desired test trigger keyword at test.index.ts, like this:
            if (tests === 'Example') {
                await ExampleTemplateToCopyTests(email, pass, client, varPass);
                await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
                run();
                return;
            }
        *(search for the word 'Example' at test.index.ts and add the new if statement around it)
       5. search for the word 'Example' & 'example' in this file and replace it with what suites your needs
       6. change this comment's content to contain the description of your test
*/
/*  To run the test using the CLI - turn on debugger mode (F5 on windows OR (at top bar): Run -> Start Debugging)
    (copy the relevant environment statement and change user email and tests keyword to match your test):

    PROD - 
npm run ui-show-report --server=prod --chrome_headless=false --user_email='test.user.qa@pepperitest.com' --user_pass='Aa123456' --var_pass='VarQA@pepperitest.com:8n@V5X' --tests='Homepage'
    
    STAGE -
npm run ui-show-report --server=stage --chrome_headless=false --user_email='test.user.qa.stage@pepperitest.com' --user_pass='Aa123456' --var_pass='VarQA@pepperitest.com:u6P8C#' --tests='Homepage'
    
    EU -
npm run ui-show-report --server=eu --chrome_headless=false --user_email='test.user.qa.eu@pepperitest.com' --user_pass='Aa123456' --var_pass_eu='VarQAEU@pepperitest.com:3#JSSt' --var_pass='VarQA@pepperitest.com:8n@V5X' --tests='Homepage'

    ** Than switch to DEBUG CONSOLE tab at the Terminal for nicer colorful view of the console 
*/

/*  This file contains the following steps (you can search by the number or text):
    1. Login
    2. Manual Resync
    3. Perform Manual Resync With Time Measurement // commented out
    4. If after Resync an Error popup appear - close it
    5. Logout Login
    6. Perform Manual Sync
    7. Perform Manual Sync With Time Measurement // commented out
    8. Navigate to Settings->System Monitor->Audit Data Log
    9. Adding query params with valid values (for data log) to current URL
    10. Add & Configure Editor (Resource List)
    11. Add & Configure View (Resource List)
    12. Create Page
    13. Create & Map Slug
    14. Create A Button On Homepage
    15. Go to Block (open the created slug & page) and perform checks
    16. Return to Home Page
    17. Adding Slug to Account Dashboard Menu (Admin Profile): Navigating to Account Dashboard Layout -> Menu (Pencil) -> Admin (Pencil) -> Adding Slug
    18. Manual Sync & Logout Login
    19. Navigating to a specific Account & Entering Resource View slug from Menu
    20. Unconfiguring Slug from Account Dashboard Menu (Admin profile)
    21. Delete Page
    22. Delete Slug
    23. Delete Editor (Resource List) Via API
    24. Delete View (Resource List) Via API
    25. Validating Deletion of Page
    26. UDTs Pre-clean via API
    27. Remove Leftovers Collections that starts with "
    28. Editors Leftovers Cleanup (containing " Editor _(")
    29. Views Leftovers Cleanup (containing " View _(")
    30. Pages Leftovers Cleanup (starting with "Blank Page")
    31. Remove Leftovers Buttons from home screen
    32. Print Screen
 */
export async function HomepageTests(email: string, password: string, client: Client, varPass: string) {
    // The following global variables can be used before a browser instance is initiated:
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const udcService = new UDCService(generalService);
    const dateTime = new Date();
    const baseUrl = `https://app${client.BaseURL.includes('staging') ? '.sandbox' : ''}.pepperi.com`;
    const testUniqueString = generalService.generateRandomString(5);
    // const performanceMeasurements = {}; // if you need to collect measurements throughout the test and present it collectively as a summery at the end

    await generalService.baseAddonVersionsInstallation(varPass);

    // add specific addon dependencies relevant to your test here:
    const testData = {
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''], // open-sync 2.0.% or 3.%
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        Nebulus: ['e8b5bb3a-d2df-4828-90f4-32cc3d49f207', ''], // dependency of UDC
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''], // UDC current phased version 0.8.29 | dependency > 0.8.11
        // 'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '18.3.3'],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);

    const installedExampleAddonVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Example Addon',
    )?.Version;

    describe(`Prerequisites Addons for Example Tests - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } | Ver. ${installedExampleAddonVersion} | Tested user: ${email} | ${dateTime}`, () => {
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            const currentAddonChnageVersionResponse = chnageVersionResponseArr[addonName];
            const varLatestVersion = currentAddonChnageVersionResponse[2];
            const changeType = currentAddonChnageVersionResponse[3];
            const status = currentAddonChnageVersionResponse[4];
            const note = currentAddonChnageVersionResponse[5];

            describe(`"${addonName}"`, () => {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                    if (status == 'Failure') {
                        expect(note).to.include('is already working on version');
                    } else {
                        expect(status).to.include('Success');
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

    // The following global variables are used for the UI section - can be recognaized by each of the it statements
    // (and names can appear in the headline at the report, if value is assigned globaly - like: const example = `Example` )
    const example = `Example`;
    const test_name = `Example_${testUniqueString}`;
    let driver: Browser;
    let webAppAPI: WebAppAPI;
    let webAppLoginPage: WebAppLoginPage;
    let settingsSidePanel: WebAppSettingsSidePanel;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let e2eUtils: E2EUtils;
    let resourceList: ResourceList;
    let resourceEditors: ResourceEditors;
    let resourceViews: ResourceViews;
    let pageBuilder: PageBuilder;
    let slugs: Slugs;
    let accountDashboardLayout: AccountDashboardLayout;
    let resourceListBlock: ResourceListBlock;
    let screenShot;
    let exampleCurrentURL: string;
    let editorName: string;
    let editor_decsription: string;
    let editorKey: string;
    let viewName: string;
    let view_decsription: string;
    let viewKey: string;
    let pageName: string;
    let pageKey: string;
    let slugDisplayName: string;
    let slug_path: string;
    let deletePageResponse;
    let udtsTableRows: UserDefinedTableRow[];
    let udtsTableRowsNoAddonCpi: UserDefinedTableRow[];
    let allUDTs;
    let udtsDeleteResponses;

    describe(`Example Test Suite`, async () => {
        describe('UI Tests', async () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppAPI = new WebAppAPI(driver, client);
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                settingsSidePanel = new WebAppSettingsSidePanel(driver);
                e2eUtils = new E2EUtils(driver);
                resourceList = new ResourceList(driver);
                resourceEditors = new ResourceEditors(driver);
                resourceViews = new ResourceViews(driver);
                pageBuilder = new PageBuilder(driver);
                slugs = new Slugs(driver);
                accountDashboardLayout = new AccountDashboardLayout(driver);
            });

            after(async function () {
                await driver.quit();
            });

            it('1. Login', async () => {
                await webAppLoginPage.login(email, password);
            });

            it('2. Manual Resync', async function () {
                await e2eUtils.performManualResync.bind(this)(client, driver);
            });

            // it('3. Perform Manual Resync With Time Measurement', async function () {
            //     const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
            //     addContext(this, {
            //         title: `Resync Time Interval`,
            //         value: `milisec: ${resyncTime} , ${(resyncTime / 1000).toFixed(1)} S`,
            //     });
            //     performanceMeasurements['No Data Resync'] = {
            //         milisec: resyncTime,
            //         sec: Number((resyncTime / 1000).toFixed(1)),
            //     };
            //     expect(resyncTime).to.be.a('number').and.greaterThan(0);
            // });

            it('4. If after Resync an Error popup appear - close it', async function () {
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

            it(`5. Logout Login`, async function () {
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                await e2eUtils.closeErrorPopupPostResync(client);
                await e2eUtils.logOutLogIn(email, password, client);
                await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
            });

            it('6. Perform Manual Sync', async function () {
                await e2eUtils.performManualSync.bind(this)(client, driver);
            });

            // it('7. Perform Manual Sync With Time Measurement', async function () {
            //     const syncTime = await e2eUtils.performManualSyncWithTimeMeasurement.bind(this)(client, driver);
            //     addContext(this, {
            //         title: `Sync Time Interval`,
            //         value: `milisec: ${syncTime} , ${(syncTime / 1000).toFixed(1)} S`,
            //     });
            //     performanceMeasurements['No Data Sync'] = {
            //         milisec: syncTime,
            //         sec: Number((syncTime / 1000).toFixed(1)),
            //     };
            //     expect(syncTime).to.be.a('number').and.greaterThan(0);
            // });

            it('8. Navigate to Settings->System Monitor->Audit Data Log', async function () {
                await webAppHeader.goHome();
                await webAppHeader.isSpinnerDone();
                await webAppHeader.openSettings();
                await webAppHeader.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                await settingsSidePanel.selectSettingsByID('System Monitor');
                // the first parameter that the function "clickSettingsSubCategory" receives needs to be part of the Slug of the sub section you want to navigate to
                await settingsSidePanel.clickSettingsSubCategory('audit_data_log', 'System Monitor');
                await webAppHeader.isSpinnerDone();
                driver.sleep(2.5 * 1000);

                // adding a print screen to the report:
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Settings->System Monitor->Audit Data Log`,
                    value: 'data:image/png;base64,' + screenShot,
                });

                exampleCurrentURL = await driver.getCurrentUrl();
                console.info('exampleCurrentURL: ', exampleCurrentURL);

                // adding informational data to the report:
                addContext(this, {
                    title: `Current URL`,
                    value: exampleCurrentURL,
                });
            });

            it('9. Adding query params with valid values (for data log) to current URL', async function () {
                const allAuditLogData: FetchStatusResponse = await generalService.fetchStatus(
                    '/addons/api/00000000-0000-0000-0000-00000da1a109/api/get_audit_log_data?search_string_fields=ActionUUID.keyword,ObjectKey.keyword,UpdatedFields.FieldID,UpdatedFields.NewValue,UpdatedFields.OldValue&order_by=ObjectModificationDateTime%20desc&page_size=200',
                    {
                        method: 'GET',
                    },
                );
                console.info('allAuditLogData: ', JSON.stringify(allAuditLogData, null, 2));
                const firstListingOfDataLog = allAuditLogData.Body.AuditLogs[1];
                console.info('first listing from AuditLogData: ', JSON.stringify(firstListingOfDataLog, null, 2));
                const dataLog_objectKey = firstListingOfDataLog.ObjectKey;
                const dataLog_resource = firstListingOfDataLog.Resource;
                const dataLog_fieldId = firstListingOfDataLog.UpdatedFields[1].FieldID;
                const dataLog_addonUUID = firstListingOfDataLog.AddonUUID;
                const validQueyParams = `?showAuditDataFieldLogButton=true&ObjectKey=${dataLog_objectKey}&Resource=${dataLog_resource}&FieldID=${dataLog_fieldId}&Title=Valid Test&AddonUUID=${dataLog_addonUUID}`;
                console.info('validQueyParams: ', validQueyParams);
                addContext(this, {
                    title: `The provided valid query params`,
                    value: validQueyParams,
                });
                await driver.navigate(exampleCurrentURL + validQueyParams); // would only work if exampleCurrentURL is the URL of Audit Data Log
                driver.sleep(10 * 1000); // long sleep that would make sure the operation completed
            });

            // Resource List Example:
            it('10. Add & Configure Editor (Resource List)', async function () {
                // Add Editor
                editorName = `${example} Editor _(${test_name})`;
                editor_decsription = `Editor of resource: ${example}`;
                await e2eUtils.addEditor({
                    nameOfEditor: editorName,
                    descriptionOfEditor: editor_decsription,
                    nameOfResource: example,
                });
                if (await driver.isElementVisible(resourceEditors.EditPage_BackToList_Button)) {
                    await driver.click(resourceEditors.EditPage_BackToList_Button);
                }
                // Configure Editor
                await e2eUtils.gotoEditPageOfSelectedEditorByName(editorName);
                editorKey = await e2eUtils.getUUIDfromURL();
                const editorFields: BaseFormDataViewField[] = e2eUtils.prepareDataForDragAndDropAtEditorAndView([
                    { fieldName: 'name', dataViewType: 'TextBox', mandatory: false, readonly: true },
                    { fieldName: 'age', dataViewType: 'TextBox', mandatory: false, readonly: true },
                ]);
                await resourceEditors.customEditorConfig(
                    generalService,
                    {
                        //this was changed due to the function changing - EVGENY 27/8/23
                        editorKey: editorKey,
                        fieldsToConfigureInView: editorFields,
                    },
                    editorName,
                );
                let base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `In Editor "${example}"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                resourceEditors.pause(0.5 * 1000);
                await driver.click(resourceEditors.EditPage_BackToList_Button);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Back at Editors List`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                resourceEditors.pause(0.5 * 1000);
            });

            it('11. Add & Configure View (Resource List)', async function () {
                // Add View
                viewName = `${example} View _(${test_name})`;
                view_decsription = `View of resource: ${example}`;
                await e2eUtils.addView({
                    nameOfView: viewName,
                    descriptionOfView: view_decsription,
                    nameOfResource: example,
                });
                if (await driver.isElementVisible(resourceViews.EditPage_BackToList_Button)) {
                    await driver.click(resourceViews.EditPage_BackToList_Button);
                }
                // Configure View
                await e2eUtils.gotoEditPageOfSelectedViewByName(viewName);
                viewKey = await e2eUtils.getUUIDfromURL();
                const viewFields: {
                    fieldName: string;
                    dataViewType: DataViewFieldType;
                    mandatory: boolean;
                    readonly: boolean;
                }[] = [
                    { fieldName: 'name', dataViewType: 'TextBox', mandatory: false, readonly: true },
                    { fieldName: 'age', dataViewType: 'TextBox', mandatory: false, readonly: true },
                    { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: true },
                ];
                await resourceViews.customViewConfig(client, {
                    matchingEditorName: editorName,
                    viewKey: viewKey,
                    fieldsToConfigureInView: viewFields,
                });
                let base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `In View "${example}"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                resourceViews.pause(0.5 * 1000);
                await driver.click(resourceViews.EditPage_BackToList_Button);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Back at Views List`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                resourceViews.pause(0.5 * 1000);
            });

            it(`Manual Sync`, async () => {
                await e2eUtils.performManualSync.bind(this)(client, driver);
            });

            it('12. Create Page', async function () {
                await e2eUtils.navigateTo('Page Builder');
                // debugger
                await pageBuilder.validatePageBuilderIsLoaded();
                // await pageBuilder.deleteAll();
                pageName = `${example} Page Auto_(${test_name})`;
                await pageBuilder.addBlankPage(pageName, `Automation Testing Page for resource ${example}`);
                driver.sleep(0.2 * 1000);
                pageKey = await e2eUtils.getUUIDfromURL();
                const createdPage = await pageBuilder.getPageByUUID(pageKey, client);
                console.info(`createdPage before blocks addition: ${JSON.stringify(createdPage, null, 2)}`);
                const editorBlockKey = uuidv4();
                console.info('Newly generated editor block key: ', editorBlockKey);
                const viewBlockKey = uuidv4();
                console.info('Newly generated view block key: ', viewBlockKey);
                const selectedViews = [
                    {
                        collectionName: example,
                        collectionID: '',
                        selectedViewUUID: viewKey,
                        selectedViewName: viewName,
                    },
                ];
                const viewerBlock = new ResourceViewEditorBlock(
                    viewBlockKey,
                    'DataViewerBlock',
                    undefined,
                    selectedViews,
                );
                console.info(`viewer block: ${JSON.stringify(viewerBlock, null, 2)}`);
                const editorBlock = new ResourceViewEditorBlock(editorBlockKey, 'DataConfigurationBlock', {
                    collectionName: example,
                    editorUUID: editorKey,
                });
                console.info(`editor block: ${JSON.stringify(editorBlock, null, 2)}`);
                createdPage.Blocks.push(editorBlock);
                createdPage.Blocks.push(viewerBlock);
                createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(viewBlockKey);
                createdPage.Layout.Sections[0].Columns.push(new BasePageLayoutSectionColumn(editorBlockKey));
                createdPage.Layout.Sections[0]['FillHeight'] = true;

                const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                console.info(`RESPONSE: ${JSON.stringify(responseOfPublishPage, null, 2)}`);
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Page Creation`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(responseOfPublishPage.Ok).to.be.true;
                expect(responseOfPublishPage.Status).to.equal(200);
                pageBuilder.pause(1 * 1000);
                await webAppHeader.goHome();
            });

            it(`Manual Sync`, async () => {
                await e2eUtils.performManualSync.bind(this)(client, driver);
            });

            it('13. Create & Map Slug', async function () {
                slugDisplayName = `${example} ${test_name}`;
                slug_path = `${example.toLowerCase()}_${test_name}`;
                await e2eUtils.createAndMapSlug(slugDisplayName, slug_path, pageKey, email, password, client);
            });

            it(`14. Create A Button On Homepage`, async function () {
                await webAppHeader.openSettings();
                await webAppHeader.isSpinnerDone();
                driver.sleep(0.1 * 1000);
                await e2eUtils.addHomePageButtonByProfile(slugDisplayName, 'Rep');
                await e2eUtils.performManualSync.bind(this)(client, driver);
                await webAppHomePage.validateATDIsApearingOnHomeScreen(slugDisplayName);
                addContext(this, {
                    title: `${slugDisplayName}`,
                    value: 'button name',
                });
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Home Page Button Creation`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });

            it('15. Go to Block (open the created slug & page) and perform checks', async function () {
                resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
                await webAppHomePage.isSpinnerDone();
                await webAppHomePage.clickOnBtn(slugDisplayName);
                await resourceListBlock.isSpinnerDone();
                addContext(this, {
                    title: `Current URL`,
                    value: `${await driver.getCurrentUrl()}`,
                });
                let base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `In Block "${example}"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                driver.sleep(0.5 * 1000);
                const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                const expectedViewFieldsNames = ['name', 'age', 'Key'];
                expect(columnsTitles.length).to.equal(expectedViewFieldsNames.length);
                columnsTitles.forEach(async (columnTitle) => {
                    const columnTitleText = await columnTitle.getText();
                    expect(columnTitleText).to.be.oneOf(expectedViewFieldsNames);
                });
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Assertions`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });

            it('16. Return to Home Page', async function () {
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
            });

            // Adding Slug to Account Dashboard Menu
            it('17. Adding Slug to Account Dashboard Menu (Admin Profile): Navigating to Account Dashboard Layout -> Menu (Pencil) -> Admin (Pencil) -> Adding Slug', async function () {
                await accountDashboardLayout.configureToAccountSelectedSectionByProfile.bind(this)(
                    driver,
                    slugDisplayName,
                    'Menu',
                    'Admin',
                );
            });

            it(`18. Manual Sync & Logout Login`, async () => {
                await e2eUtils.performManualSync.bind(this)(client, driver);
                await e2eUtils.logOutLogIn(email, password, client);
                await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
            });

            it(`19. Navigating to a specific Account & Entering Resource View slug from Menu`, async function () {
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHomePage.clickOnBtn('Accounts');
                await e2eUtils.selectAccountFromAccountList.bind(this)(driver, ''); // if you provide an empty string it would choose the first account in the list

                // You can search by account name:
                // await e2eUtils.selectAccountFromAccountList.bind(this)(driver, accountName, 'name');

                // Or by account ID:
                // await e2eUtils.selectAccountFromAccountList.bind(this)(driver, accountID, 'ID');

                await resourceList.isSpinnerDone();
                driver.sleep(1 * 1000);
                let base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At account dashboard`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await resourceList.waitTillVisible(accountDashboardLayout.AccountDashboard_HamburgerMenu_Button, 15000);
                await resourceList.click(accountDashboardLayout.AccountDashboard_HamburgerMenu_Button);
                resourceList.pause(0.2 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Hamburger Menu opened`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await resourceList.waitTillVisible(
                    accountDashboardLayout.AccountDashboard_HamburgerMenu_Content,
                    15000,
                );
                resourceList.pause(1 * 1000);
                await resourceList.click(
                    accountDashboardLayout.getSelectorOfAccountHomePageHamburgerMenuItemByText(slugDisplayName),
                );
                resourceList.pause(1 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Clicked Wanted Slug at hamburger menu`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });

            it('20. Unconfiguring Slug from Account Dashboard Menu (Admin profile)', async function () {
                await accountDashboardLayout.unconfigureFromAccountSelectedSectionByProfile.bind(this)(
                    driver,
                    slugDisplayName,
                    'Menu',
                    'Admin',
                    `cleanup text - to remove leftovers `,
                );
            });

            // DELETIONS:

            it('21. Delete Page', async function () {
                deletePageResponse = await pageBuilder.removePageByUUID(pageKey, client);
            });

            it('22. Delete Slug', async function () {
                const deleteSlugResponse = await slugs.deleteSlugByName(slug_path, client);
                expect(deleteSlugResponse.Ok).to.equal(true);
                expect(deleteSlugResponse.Status).to.equal(200);
                expect(deleteSlugResponse.Body.success).to.equal(true);
            });

            it('23. Delete Editor (Resource List) Via API', async function () {
                const deleteEditorResponse = await resourceEditors.deleteEditorViaAPI(editorKey, client);
                addContext(this, {
                    title: `Delete Response:`,
                    value: deleteEditorResponse,
                });
                expect(deleteEditorResponse.Ok).to.equal(true);
                expect(deleteEditorResponse.Status).to.equal(200);
                expect(deleteEditorResponse.Body.Name).to.equal(editorName);
                expect(deleteEditorResponse.Body.Hidden).to.equal(true);
            });

            it('24. Delete View (Resource List) Via API', async function () {
                const deleteViewResponse = await resourceViews.deleteViewViaApiByUUID(viewKey, client);
                expect(deleteViewResponse.Ok).to.equal(true);
                expect(deleteViewResponse.Status).to.equal(200);
                expect(deleteViewResponse.Body.Name).to.equal(viewName);
                expect(deleteViewResponse.Body.Hidden).to.equal(true);
            });

            it('25. Validating Deletion of Page', async function () {
                console.info(`deletePageResponse: ${JSON.stringify(deletePageResponse, null, 2)}`);
                driver.sleep(0.5 * 1000);
                expect(deletePageResponse.Ok).to.equal(true);
                expect(deletePageResponse.Status).to.equal(200);
                expect(deletePageResponse.Body.Hidden).to.equal(true);
                expect(deletePageResponse.Body.Name).to.equal(pageName);
            });

            // TO BE USED AS PRE-CLEAN:
            describe('Cleaning of failed test garbage', async () => {
                // UDT
                it('26. UDTs Pre-clean via API', async function () {
                    let index = 1;
                    do {
                        udtsTableRows = await objectsService.getUDT({ page_size: 250, page: index });
                        console.info('index: ', index, ' udtsTableRows length: ', udtsTableRows.length);

                        udtsTableRowsNoAddonCpi = udtsTableRows.filter((tableRow) => {
                            if (tableRow.MapDataExternalID != 'ADDON_CPI_SIDE_DATA') {
                                return tableRow;
                            }
                        });
                        console.info('udtsTableRowsNoAddonCpi length: ', udtsTableRowsNoAddonCpi.length);

                        udtsTableRowsNoAddonCpi.forEach((tableRow) => {
                            tableRow.Hidden = true;
                        });
                        console.info('first element in udtsTableRowsNoAddonCpi: ', udtsTableRowsNoAddonCpi[0]);

                        udtsDeleteResponses = await objectsService.postBatchUDT(udtsTableRowsNoAddonCpi);
                        udtsDeleteResponses.forEach((deleteResponse) => {
                            expect(deleteResponse.Status).to.be.oneOf(['Insert', 'Ignore', 'Update']);
                            expect(deleteResponse.Message).to.be.oneOf([
                                'Row inserted.',
                                'No changes in this row. The row is being ignored.',
                                'Row updated.',
                            ]);
                        });
                        index++;
                    } while (udtsTableRows.length > 0 && index < 402);

                    allUDTs = await objectsService.getUDTMetaDataList();
                    addContext(this, {
                        title: `index`,
                        value: `${index}`,
                    });
                    addContext(this, {
                        title: `All UDTs`,
                        value: JSON.stringify(allUDTs, null, 2),
                    });
                    console.info(JSON.stringify(allUDTs, null, 2));
                    const testUDTs = allUDTs.filter((table) => {
                        if (table['TableID'].startsWith(example)) return table;
                    });
                    console.info(JSON.stringify(testUDTs, null, 2));
                    udtsDeleteResponses = await Promise.all(
                        testUDTs.map(async (udt) => {
                            return await objectsService.deleteUDTMetaData(udt.TableID as number);
                        }),
                    );
                    udtsDeleteResponses.forEach((deleteResponse) => {
                        expect(deleteResponse).to.be.true;
                    });
                });

                // UDC
                it(`27. Remove Leftovers Collections that starts with "${example}_"`, async function () {
                    const allUdcs = await udcService.getSchemes();
                    const leftoversUdcs = allUdcs.filter((collection) => {
                        if (collection.Name.startsWith(`${example}_`)) {
                            return collection;
                        }
                    });
                    const purgeResponses = await Promise.all(
                        leftoversUdcs.map(async (leftoverUdc) => {
                            return await udcService.purgeScheme(leftoverUdc.Name);
                        }),
                    );
                    addContext(this, {
                        title: `Purge Responses: `,
                        value: JSON.stringify(purgeResponses, null, 2),
                    });
                    purgeResponses.forEach((purgeResponse) => {
                        console.info(`${example}_ purgeResponse: ${JSON.stringify(purgeResponse, null, 2)}`);
                        expect(purgeResponse.Ok).to.be.true;
                        expect(purgeResponse.Status).to.equal(200);
                        expect(purgeResponse.Error).to.eql({});
                        expect(Object.keys(purgeResponse.Body)).to.eql(['Done', 'ProcessedCounter']);
                        expect(purgeResponse.Body.Done).to.be.true;
                    });
                });

                // EDITORS
                it('28. Editors Leftovers Cleanup (containing " Editor _(")', async () => {
                    const allEditors = await resourceEditors.getAllEditors(client);
                    const editorsOfAutoTest = allEditors?.Body.filter((editor) => {
                        if (editor.Name.includes(' Editor _(')) {
                            return editor.Key;
                        }
                    });
                    console.info(`allEditors: ${JSON.stringify(allEditors.Body, null, 4)}`);
                    console.info(`editorsOfAutoTest: ${JSON.stringify(editorsOfAutoTest, null, 4)}`);
                    const deleteAutoEditorsResponse: FetchStatusResponse[] = await Promise.all(
                        editorsOfAutoTest.map(async (autoEditor) => {
                            const deleteAutoEditorResponse = await resourceEditors.deleteEditorViaAPI(
                                autoEditor.Key,
                                client,
                            );
                            // console.info(`deleteAutoEditorResponse: ${JSON.stringify(deleteAutoEditorResponse, null, 4)}`);
                            return deleteAutoEditorResponse;
                        }),
                    );
                    console.info(`deleteAutoEditorsResponse: ${JSON.stringify(deleteAutoEditorsResponse, null, 4)}`);
                    generalService.sleep(5 * 1000);
                    const allEditorsAfterCleanup = await resourceEditors.getAllEditors(client);
                    const findAutoEditorAfterCleanup = allEditorsAfterCleanup?.Body.find((editor) =>
                        editor.Name.includes(' Editor _('),
                    );
                    console.info(`findAutoEditorAfterCleanup: ${JSON.stringify(findAutoEditorAfterCleanup, null, 4)}`);
                    expect(findAutoEditorAfterCleanup).to.be.undefined;
                });

                // VIEWS
                it('29. Views Leftovers Cleanup (containing " View _(")', async () => {
                    const allViews = await resourceViews.getAllViews(client);
                    const viewsOfAutoTest = allViews?.Body.filter((view) => {
                        if (view.Name.includes(' View _(')) {
                            return view.Key;
                        }
                    });
                    console.info(`allViews Length: ${allViews.Body.length}`);
                    console.info(`viewsOfAutoTest Length: ${viewsOfAutoTest.length}`);
                    console.info(`allViews: ${JSON.stringify(allViews.Body, null, 4)}`);
                    console.info(`viewsOfAutoTest: ${JSON.stringify(viewsOfAutoTest, null, 4)}`);
                    const deleteAutoViewsResponse: FetchStatusResponse[] = await Promise.all(
                        viewsOfAutoTest.map(async (autoView) => {
                            const deleteAutoViewResponse = await resourceViews.deleteViewViaAPI(autoView.Key, client);
                            // console.info(`deleteAutoViewResponse: ${JSON.stringify(deleteAutoViewResponse, null, 4)}`);
                            return deleteAutoViewResponse;
                        }),
                    );
                    console.info(`deleteAutoViewResponse Length: ${deleteAutoViewsResponse.length}`);
                    console.info(`deleteAutoViewsResponse: ${JSON.stringify(deleteAutoViewsResponse, null, 4)}`);
                    generalService.sleep(5 * 1000);
                    const allViewsAfterCleanup = await resourceViews.getAllViews(client);
                    const findAutoViewAfterCleanup = allViewsAfterCleanup?.Body.find((view) =>
                        view.Name.includes(' View _('),
                    );
                    console.info(`findAutoViewAfterCleanup: ${JSON.stringify(findAutoViewAfterCleanup, null, 4)}`);
                    expect(findAutoViewAfterCleanup).to.be.undefined;
                });

                // PAGES
                it('30. Pages Leftovers Cleanup (starting with "Blank Page")', async () => {
                    const allPages = await pageBuilder.getDraftPages(client);
                    console.info(
                        `allPages.Body.length (looking for Blank Page): ${JSON.stringify(
                            allPages.Body.length,
                            null,
                            4,
                        )}`,
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

                // HOME PAGE BUTTONS
                it('31. Remove Leftovers Buttons from home screen', async function () {
                    await webAppHeader.goHome();
                    await webAppHeader.openSettings();
                    await webAppHomePage.isSpinnerDone();
                    driver.sleep(0.5 * 1000);
                    await e2eUtils.removeHomePageButtonsLeftoversByProfile(`${example} `, 'Rep');
                    await e2eUtils.performManualSync.bind(this)(client, driver);
                    const leftoversButtonsOnHomeScreen =
                        await webAppHomePage.buttonsApearingOnHomeScreenByPartialText.bind(this)(driver, `${example} `);
                    expect(leftoversButtonsOnHomeScreen).to.equal(false);
                });

                it('32. Print Screen', async function () {
                    driver.sleep(0.5 * 1000);
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `After Buttons Removal`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
            });
        });
    });
}
