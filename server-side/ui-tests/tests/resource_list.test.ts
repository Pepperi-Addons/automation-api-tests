import addContext from 'mochawesome/addContext';
import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
// import { DataViewsService } from '../../services/data-views.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { BrandedApp, WebAppHeader, WebAppHomePage, WebAppLoginPage } from '../pom';
import { ResourceList, ResourceEditors, ResourceViews } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import E2EUtils from '../utilities/e2e_utils';
import {
    BaseFormDataViewField,
    DataViewFieldType,
    // MenuDataViewField
} from '@pepperi-addons/papi-sdk';
import { v4 as uuidv4 } from 'uuid';
// import { UpsertFieldsToMappedSlugs } from '../blueprints/DataViewBlueprints';

import {
    BasePageLayoutSectionColumn,
    ResourceViewEditorBlock,
    // ResourceListBasicViewerEditorBlocksStructurePage
} from '../blueprints/PageBlocksBlueprints';
import { ResourceListBlock } from '../pom/ResourceList.block';
import { Slugs } from '../pom/addons/Slugs';

chai.use(promised);

export async function ResourceListTests(email: string, password: string, varPass: string, client: Client) {
    const date = new Date();
    const generalService = new GeneralService(client);
    // const dataViewsService = new DataViewsService(generalService.papiClient);
    // const papi_resources = ['accounts', 'items', 'users', 'catalogs', 'account_users', 'contacts'];

    const installedResourceListVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Resource List',
    )?.Version;

    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    // let webAppList: WebAppList;
    // let webAppDialog: WebAppDialog;
    let resourceList: ResourceList;
    let resourceEditors: ResourceEditors;
    let resourceViews: ResourceViews;
    let pageBuilder: PageBuilder;
    let slugs: Slugs;
    let resourceListUtils: E2EUtils;
    let resourceListBlock: ResourceListBlock;
    let brandedApp: BrandedApp;

    let random_name: string;
    const test_generic_decsription = 'for RL automated testing';
    let resource_name: string;
    let editorName: string;
    let editor_decsription: string;
    let view_decsription: string;
    let editorKey: string;
    let viewKey: string;
    let viewName: string;
    let slugDisplayName: string;
    let slug_path: string;
    let pageName: string;
    let pageKey: string;
    let createdPage;
    let deletePageResponse;
    // let createdPage: { page: any; name: string };
    // let resource_at_block: string;

    const detailsByResource = {
        accounts: {
            view_fields_names: ['Name', 'Email', 'Country', 'City', 'Type', 'UUID'],
            view_fields: [
                { fieldName: 'Name', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Email', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Country', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'City', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Type', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'UUID', dataViewType: 'TextBox', mandatory: true, readonly: true },
            ],
        },
        items: {
            view_fields_names: ['Name', 'Price', 'Discount', 'UPC', 'UUID', 'Image', 'ExternalID'],
            view_fields: [
                { fieldName: 'Name', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Price', dataViewType: 'NumberReal', mandatory: true, readonly: true },
                { fieldName: 'Discount', dataViewType: 'NumberReal', mandatory: true, readonly: true },
                { fieldName: 'UPC', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'UUID', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Image', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: true, readonly: true },
            ],
        },
        users: {
            view_fields_names: [
                'ExternalID',
                'Email',
                'FirstName',
                'LastName',
                'Mobile',
                'Phone',
                'IsInTradeShowMode',
                'UUID',
            ],
            view_fields: [
                { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Email', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'FirstName', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'LastName', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Mobile', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Phone', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'IsInTradeShowMode', dataViewType: 'Boolean', mandatory: true, readonly: true },
                { fieldName: 'UUID', dataViewType: 'TextBox', mandatory: true, readonly: true },
            ],
        },
        catalogs: {
            view_fields_names: ['UUID', 'ExternalID', 'Description', 'ExpirationDate', 'IsActive', 'TSAImage'],
            view_fields: [
                { fieldName: 'UUID', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Description', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'ExpirationDate', dataViewType: 'DateAndTime', mandatory: true, readonly: true },
                { fieldName: 'IsActive', dataViewType: 'Boolean', mandatory: true, readonly: true },
                { fieldName: 'TSAImage', dataViewType: 'TextBox', mandatory: true, readonly: true },
            ],
        },
        account_users: {
            view_fields_names: ['Account', 'User', 'ConnectedWithFullAccountAccess', 'UUID'],
            view_fields: [
                { fieldName: 'Account', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'User', dataViewType: 'TextBox', mandatory: true, readonly: true },
                {
                    fieldName: 'ConnectedWithFullAccountAccess',
                    dataViewType: 'Boolean',
                    mandatory: true,
                    readonly: true,
                },
                { fieldName: 'UUID', dataViewType: 'TextBox', mandatory: true, readonly: true },
            ],
        },
        contacts: {
            view_fields_names: ['FirstName', 'LastName', 'Email', 'IsBuyer', 'Role', 'TypeDefinitionID', 'Status'],
            view_fields: [
                { fieldName: 'FirstName', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'LastName', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Email', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'IsBuyer', dataViewType: 'Boolean', mandatory: true, readonly: true },
                { fieldName: 'Role', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'TypeDefinitionID', dataViewType: 'NumberInteger', mandatory: true, readonly: true },
                { fieldName: 'Status', dataViewType: 'NumberInteger', mandatory: true, readonly: true },
            ],
        },
        // OfflineArraysToOnline: {
        //     view_fields_names: ['strArr', 'intArr', 'doubArr'],
        // },
        NameAgeAuto: {
            view_fields_names: ['name', 'age', 'Key'],
        },
        ArraysOfPrimitivesAuto: {
            view_fields_names: ['name', 'age', 'Key'],
        },
        FiltersAccRefAuto: {
            view_fields_names: ['name', 'age', 'Key'],
        },
        IndexedFieldsAuto: {
            view_fields_names: ['name', 'age', 'Key'],
        },
        IndexedNameAgeAuto: {
            view_fields_names: ['name', 'age', 'Key'],
        },
        ReferenceAccountAuto: {
            view_fields_names: ['name', 'age', 'Key'],
        },
        // Dataless: {
        //     view_fields_names: ['Key', 'integerhavenodata'],
        // },
    };

    const simpleResources = ['accounts', 'items', 'users', 'catalogs', 'account_users', 'contacts'];
    // const complexResources = ['ArraysOfPrimitivesAuto', 'FiltersAccRefAuto', 'IndexedFieldsAuto', 'IndexedNameAgeAuto', 'ReferenceAccountAuto'];

    describe(`Resource List UI tests  - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } || Ver ${installedResourceListVersion} || ${date}`, async () => {
        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
            webAppHeader = new WebAppHeader(driver);
            // webAppList = new WebAppList(driver);
            // webAppDialog = new WebAppDialog(driver);
            resourceList = new ResourceList(driver);
            resourceEditors = new ResourceEditors(driver);
            resourceViews = new ResourceViews(driver);
            pageBuilder = new PageBuilder(driver);
            slugs = new Slugs(driver);
            resourceListUtils = new E2EUtils(driver);
            brandedApp = new BrandedApp(driver);
            random_name = generalService.generateRandomString(5);
        });

        after(async function () {
            await driver.close();
            await driver.quit();
        });

        it('Login', async () => {
            await webAppLoginPage.login(email, password);
        });

        describe('Views & Editors Full Functionality test', async () => {
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Resource Views settings is loaded and Elements exist', async () => {
                // navigation
                await resourceListUtils.navigateTo('Resource Views');
                await resourceList.isSpinnerDone();
                /* test logics */
                // title is currect
                const addonSettingsTitle = await (await driver.findElement(resourceList.PepTopArea_title)).getText();
                expect(addonSettingsTitle).to.contain('Views & Editors');

                // tabs are the right amount, the currect text and the right one (Views) is selected while the other isn't
                await driver.untilIsVisible(resourceList.GenericList_Content);
                await driver.untilIsVisible(resourceList.TabsContainer);
                const tabs = await driver.findElements(resourceList.AddonContainerTabs);
                expect(tabs.length).to.equal(2);
                const viewsTab_isSelected = await (
                    await driver.findElement(resourceList.Views_Tab)
                ).getAttribute('aria-selected');
                expect(viewsTab_isSelected).to.equal('true');
                const editorsTab_isSelected = await (
                    await driver.findElement(resourceList.Editors_Tab)
                ).getAttribute('aria-selected');
                expect(editorsTab_isSelected).to.equal('false');

                // list title is "Views" - contains number and "results"/"result", number of results is 0 and the text "No Data Found" appears
                const listTitle = await (await driver.findElement(resourceList.GenericList_Title)).getText();
                expect(listTitle).to.equal('Views');
                const resultsDivText = await (await driver.findElement(resourceList.ResultsDiv)).getText();
                expect(resultsDivText).to.contain('result');
                // await resourceViews.deleteAll();
                // const numberOfResults = await (await driver.findElement(resourceList.NumberOfItemsInList)).getText();
                // expect(Number(numberOfResults)).to.be.equal(0);
                // const noData = (await (await driver.findElement(resourceList.List_NoDataFound)).getText()).trim();
                // expect(noData).to.be.oneOf(['No Data Found', 'No results were found.']);
            });

            // it('Editors Tab', async () => {
            //     await resourceList.clickTab('Editors_Tab');
            //     //TODO
            // });
        });

        describe('Operations (e.g Addition, Deletion)', async () => {
            it('Neviagte to Editors, Add Editor and Delete it', async () => {
                resource_name = 'SchemeOnlyObject';
                editorName = `RL_Editors_${resource_name}_Test_${random_name}`;
                editor_decsription = `Editor ${resource_name} ${test_generic_decsription}`;
                await resourceListUtils.navigateTo('Resource Views');
                await resourceList.isSpinnerDone();
                await resourceEditors.clickTab('Editors_Tab');
                await resourceEditors.validateEditorsListPageIsLoaded();
                await resourceEditors.addToResourceList(editorName, editor_decsription, resource_name);
                await resourceEditors.verifyEditorEditPageOpen(editorName);
                await resourceEditors.click(resourceEditors.EditPage_BackToList_Button);
                await resourceEditors.clickTab('Editors_Tab');
                await resourceEditors.deleteFromListByName(editorName);
            });
        });

        // describe('Pre-clean', async () => {
        //     before(function () {
        //         resource_name = 'NameAge';
        //         random_name = generalService.generateRandomString(5);
        //     });
        //     afterEach(async function () {
        //         driver.sleep(500);
        //         await webAppHomePage.collectEndTestData(this);
        //     });

        //     it('Delete All Views', async () => {
        //         await resourceListUtils.deleteAllViewsViaUI();
        //     });
        //     it('Delete All Editors', async () => {
        //         await resourceListUtils.deleteAllEditorsViaUI();
        //     });
        //     it('Delete All Pages', async () => {
        //         await resourceListUtils.deleteAllPagesViaUI();
        //     });
        // });

        describe('Pipeline', async () => {
            // conditions for this section: tested user must have UDC = NameAgeAuto
            before(function () {
                resource_name = 'NameAgeAuto';
                // random_name = generalService.generateRandomString(5);
            });
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Add & Configure Editor', async () => {
                // Add Editor
                editorName = `${resource_name} Editor _(${random_name})`;
                editor_decsription = `Editor of resource: ${resource_name} - ${test_generic_decsription}`;
                await resourceListUtils.addEditor({
                    nameOfEditor: editorName,
                    descriptionOfEditor: editor_decsription,
                    nameOfResource: resource_name,
                });
                // Configure Editor
                await resourceListUtils.gotoEditPageOfSelectedEditorByName(editorName);
                editorKey = await resourceListUtils.getUUIDfromURL();
                const editorFields: BaseFormDataViewField[] =
                    resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                        { fieldName: 'name', dataViewType: 'TextBox', mandatory: false, readonly: false },
                        { fieldName: 'age', dataViewType: 'TextBox', mandatory: false, readonly: false },
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
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `In Editor "${resource_name}"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                resourceEditors.pause(5 * 1000);
            });
            it('Add & Configure View', async () => {
                // Add View
                viewName = `${resource_name} View _(${random_name})`;
                view_decsription = `View of resource: ${resource_name} - ${test_generic_decsription}`;
                await resourceListUtils.addView({
                    nameOfView: viewName,
                    descriptionOfView: view_decsription,
                    nameOfResource: resource_name,
                });
                // Configure View
                await resourceListUtils.gotoEditPageOfSelectedViewByName(viewName);
                viewKey = await resourceListUtils.getUUIDfromURL();
                const viewFields: {
                    fieldName: string;
                    dataViewType: DataViewFieldType;
                    mandatory: boolean;
                    readonly: boolean;
                }[] = [
                    { fieldName: 'name', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'age', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
                ];
                await resourceViews.customViewConfig(client, {
                    matchingEditorName: editorName,
                    viewKey: viewKey,
                    fieldsToConfigureInView: viewFields,
                });
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `In View "${resource_name}"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                resourceViews.pause(5 * 1000);
            });
            it('Create Page', async () => {
                await resourceListUtils.navigateTo('Page Builder');
                // debugger
                await pageBuilder.validatePageBuilderIsLoaded();
                // await pageBuilder.deleteAll();
                pageName = `${resource_name} Page Auto_(${random_name})`;
                await pageBuilder.addBlankPage(pageName, `Automation Testing Page for resource ${resource_name}`);
                driver.sleep(0.2 * 1000);
                pageKey = await resourceListUtils.getUUIDfromURL();
                createdPage = await pageBuilder.getPageByUUID(pageKey, client);
                console.info(`createdPage before blocks addition: ${JSON.stringify(createdPage, null, 2)}`);
                const editorBlockKey = uuidv4();
                console.info('Newly generated editor block key: ', editorBlockKey);
                const viewBlockKey = uuidv4();
                console.info('Newly generated view block key: ', viewBlockKey);
                const selectedViews = [
                    {
                        collectionName: resource_name,
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
                    collectionName: resource_name,
                    editorUUID: editorKey,
                });
                console.info(`editor block: ${JSON.stringify(editorBlock, null, 2)}`);
                createdPage.Blocks.push(editorBlock);
                createdPage.Blocks.push(viewerBlock);
                createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(viewBlockKey);
                createdPage.Layout.Sections[0].Columns.push(new BasePageLayoutSectionColumn(editorBlockKey));

                const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                console.info(`RESPONSE: ${JSON.stringify(responseOfPublishPage, null, 2)}`);
                expect(responseOfPublishPage.Ok).to.be.true;
                expect(responseOfPublishPage.Status).to.equal(200);
                pageBuilder.pause(1 * 1000);
                await webAppHeader.goHome();
            });
            it('Create & Map Slug', async () => {
                slugDisplayName = `${resource_name} ${random_name}`;
                slug_path = `${resource_name.toLowerCase()}_${random_name}`;
                await resourceListUtils.createSlug(slugDisplayName, slug_path, pageKey, email, password, client);
            });
            it('Create A Button On Homepage', async function () {
                await webAppHeader.openSettings();
                await webAppHeader.isSpinnerDone();
                driver.sleep(0.1 * 1000);
                await brandedApp.addAdminHomePageButtons(slugDisplayName);
                await webAppHomePage.manualResync(client);
                await webAppHomePage.validateATDIsApearingOnHomeScreen(slugDisplayName);
            });
            it('Go to Block', async () => {
                resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
                await webAppHomePage.isSpinnerDone();
                await webAppHomePage.clickOnBtn(slugDisplayName);
                await resourceListBlock.isSpinnerDone();
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `In Block "${resource_name}"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                driver.sleep(0.5 * 1000);
                const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                const expectedViewFieldsNames = detailsByResource[resource_name].view_fields_names;
                expect(columnsTitles.length).to.equal(expectedViewFieldsNames.length);
                columnsTitles.forEach(async (columnTitle) => {
                    const columnTitleText = await columnTitle.getText();
                    expect(columnTitleText).to.be.oneOf(expectedViewFieldsNames);
                });
                driver.sleep(15 * 1000);
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
            });
        });

        describe('Teardown', async () => {
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });
            it('Delete Page', async function () {
                deletePageResponse = await pageBuilder.removePageByUUID(pageKey, client);
            });
            it('Delete Slug', async function () {
                const deleteSlugResponse = await slugs.deleteSlugByName(slug_path, client);
                expect(deleteSlugResponse.Ok).to.equal(true);
                expect(deleteSlugResponse.Status).to.equal(200);
                expect(deleteSlugResponse.Body.success).to.equal(true);
            });
            it('Delete Editor Via API', async () => {
                const deleteEditorResponse = await resourceEditors.deleteEditorViaAPI(editorKey, client);
                expect(deleteEditorResponse.Ok).to.equal(true);
                expect(deleteEditorResponse.Status).to.equal(200);
                expect(deleteEditorResponse.Body.Name).to.equal(editorName);
                expect(deleteEditorResponse.Body.Hidden).to.equal(true);
            });
            it('Delete View Via API', async () => {
                const deleteViewResponse = await resourceViews.deleteViewViaApiByUUID(viewKey, client);
                expect(deleteViewResponse.Ok).to.equal(true);
                expect(deleteViewResponse.Status).to.equal(200);
                expect(deleteViewResponse.Body.Name).to.equal(viewName);
                expect(deleteViewResponse.Body.Hidden).to.equal(true);
            });
            //     it('Delete Editor', async () => {
            //     for (let index = 0; index < 3; index++) {
            //         try {
            //             await resourceListUtils.navigateTo('Resource Views');
            //             await resourceEditors.clickTab('Editors_Tab');
            //             await resourceEditors.deleteFromListByName(editorName);
            //             await webAppHeader.goHome();
            //             break;
            //         } catch (error) {
            //             console.error(error);
            //         }
            //     }
            // });
            // it('Delete View', async () => {
            //     await webAppHeader.goHome();
            //     for (let index = 0; index < 3; index++) {
            //         try {
            //             await resourceListUtils.navigateTo('Resource Views');
            //             await resourceViews.deleteFromListByName(viewName);
            //             await webAppHeader.goHome();
            //             break;
            //         } catch (error) {
            //             console.error(error);
            //         }
            //     }
            // });
            it('Remove button from home screen', async function () {
                await webAppHeader.goHome();
                await webAppHeader.openSettings();
                await webAppHomePage.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                await brandedApp.removeAdminHomePageButtons(slugDisplayName);
                await webAppHomePage.manualResync(client);
                const isNotFound = await webAppHomePage.validateATDIsNOTApearingOnHomeScreen(slugDisplayName);
                expect(isNotFound).to.equal(true);
            });
            it('Validating Deletion of Page', async function () {
                console.info(`deletePageResponse: ${JSON.stringify(deletePageResponse, null, 2)}`);
                driver.sleep(0.5 * 1000);
                expect(deletePageResponse.Ok).to.equal(true);
                expect(deletePageResponse.Status).to.equal(200);
                expect(deletePageResponse.Body.Hidden).to.equal(true);
                expect(deletePageResponse.Body.Name).to.equal(pageName);
            });
        });

        simpleResources.forEach((resource) => {
            describe(`Flow Tests for "${resource}"`, async () => {
                // conditions for this section: tested user must have UDC = NameAgeAuto
                before(function () {
                    slugDisplayName = 'Auto Test';
                    slug_path = 'auto_test';
                    resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
                });
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it('Add & Configure View', async () => {
                    // Add View
                    viewName = `${resource} View _(${random_name})`;
                    view_decsription = `View of resource: ${resource} - ${test_generic_decsription}`;
                    for (let index = 0; index < 3; index++) {
                        try {
                            await resourceListUtils.addView({
                                nameOfView: viewName,
                                descriptionOfView: view_decsription,
                                nameOfResource: resource,
                            });
                            break;
                        } catch (error) {
                            console.error(error);
                            await driver.refresh();
                        }
                    }
                    // Configure View
                    await resourceListUtils.gotoEditPageOfSelectedViewByName(viewName);
                    viewKey = await resourceListUtils.getUUIDfromURL();
                    const viewFields = detailsByResource[resource].view_fields;
                    console.info(`viewFields: ${JSON.stringify(viewFields, null, 2)}`);
                    await resourceViews.customViewConfig(client, {
                        matchingEditorName: '',
                        viewKey: viewKey,
                        fieldsToConfigureInView: viewFields,
                    });
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `In View "${resource}"`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    resourceViews.pause(5 * 1000);
                });
                it('Perform Manual Sync', async () => {
                    await resourceListUtils.performManualSync(client);
                });
                it('Create Page', async () => {
                    await resourceListUtils.navigateTo('Page Builder');
                    await driver.refresh();
                    await resourceList.isSpinnerDone();
                    await pageBuilder.validatePageBuilderIsLoaded();
                    // for (let index = 0; index < 3; index++) {
                    //     try {
                    //         break;
                    //     } catch (error) {
                    //         console.error(error);
                    //     }
                    // }
                    pageName = `${resource} Page Auto_(${random_name})`;
                    await pageBuilder.addBlankPage(pageName, `Automation Testing Page for resource '${resource}'`);
                    driver.sleep(0.2 * 1000);
                    pageKey = await resourceListUtils.getUUIDfromURL();
                    createdPage = await pageBuilder.getPageByUUID(pageKey, client);
                    console.info(`createdPage before blocks addition: ${JSON.stringify(createdPage, null, 2)}`);
                    const viewBlockKey = uuidv4();
                    console.info('Newly generated view block key: ', viewBlockKey);
                    const selectedViews = [
                        {
                            collectionName: resource,
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
                    createdPage.Blocks.push(viewerBlock);
                    createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(viewBlockKey);

                    const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                    console.info(`RESPONSE: ${JSON.stringify(responseOfPublishPage, null, 2)}`);
                    expect(responseOfPublishPage.Ok).to.be.true;
                    expect(responseOfPublishPage.Status).to.equal(200);
                    pageBuilder.pause(1 * 1000);
                    await webAppHeader.goHome();
                });
                it('Perform Manual Sync', async () => {
                    await resourceListUtils.performManualSync(client);
                });
                it('Map the Slug with the Page', async () => {
                    // const mapPage = await resourceListUtils.changePageAtMappedSlugs([{ slug_path: slug_path, pageUUID: pageKey }], client); // TODO
                    const mapPage = await resourceListUtils.addToMappedSlugs(
                        [{ slug_path: slug_path, pageUUID: pageKey }],
                        client,
                    );
                    console.info(`Map Page To Slug: ${JSON.stringify(mapPage, null, 2)}`);
                    // await resourceListUtils.performManualSync(client);
                    // expect(mapPage.postResponse.Ok).to.be.true;
                    // expect(mapPage.postResponse.Status).to.equal(200);
                });
                it('Perform Manual Sync', async () => {
                    await resourceListUtils.performManualSync(client);
                });
                it('Block Tests', async () => {
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn(slugDisplayName);
                    await resourceListBlock.isSpinnerDone();
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `In Block "${resource}"`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(0.5 * 1000);
                    const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                    const expectedViewFieldsNames = detailsByResource[resource].view_fields_names;
                    expect(columnsTitles.length).to.equal(expectedViewFieldsNames.length);
                    columnsTitles.forEach(async (columnTitle) => {
                        const columnTitleText = await columnTitle.getText();
                        expect(columnTitleText).to.be.oneOf(expectedViewFieldsNames);
                    });
                    driver.sleep(15 * 1000);
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                });
                it('Delete Page', async function () {
                    deletePageResponse = await pageBuilder.removePageByUUID(pageKey, client);
                    console.info(`deletePageResponse: ${JSON.stringify(deletePageResponse, null, 2)}`);
                    driver.sleep(0.5 * 1000);
                    expect(deletePageResponse.Ok).to.equal(true);
                    expect(deletePageResponse.Status).to.equal(200);
                    expect(deletePageResponse.Body.Hidden).to.equal(true);
                    expect(deletePageResponse.Body.Name).to.equal(pageName);
                });
                it('Delete View Via API', async () => {
                    const deleteViewResponse = await resourceViews.deleteViewViaApiByUUID(viewKey, client);
                    expect(deleteViewResponse.Ok).to.equal(true);
                    expect(deleteViewResponse.Status).to.equal(200);
                    expect(deleteViewResponse.Body.Name).to.equal(viewName);
                    expect(deleteViewResponse.Body.Hidden).to.equal(true);
                });
            });
        });
        // describe('E2E Method', async () => {
        //     beforeEach(async function () {
        //         random_name = generalService.generateRandomString(5);
        //     });
        //     afterEach(async function () {
        //         driver.sleep(500);
        //         await webAppHomePage.collectEndTestData(this);
        //     });

        //     it('Full Flow for resource: accounts', async () => {
        //         await resourceListUtils.createBlock('accounts', random_name);
        //     });
        // });

        // describe('Blocks', async () => {
        //     beforeEach(async function () {
        //         await driver.navigate(`https://app.pepperi.com/HomePage`);
        //         await webAppHomePage.isSpinnerDone();
        //     });
        //     describe('PAPI Resources', async () => {
        //         before(function () {
        //             slugDisplayName = 'Auto Test';
        //             slug_path = 'auto_test';
        //             resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
        //         });
        //         afterEach(async function () {
        //             driver.sleep(500);
        //             await webAppHomePage.collectEndTestData(this);
        //         });

        //         it(`accounts`, async () => {
        //             resource_at_block = 'accounts';
        //             pageName = `${resource_at_block} Page`;
        //             await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
        //             await webAppHeader.goHome();
        //             await webAppHomePage.isSpinnerDone();
        //             await resourceListUtils.logOutLogIn(email, password);
        //             await webAppHomePage.isSpinnerDone();
        //             await webAppHomePage.clickOnBtn(slugDisplayName);
        //             await resourceListBlock.isSpinnerDone();
        //             await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
        //             driver.sleep(5 * 1000);
        //             const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
        //             expect(columnsTitles.length).to.equal(
        //                 detailsByResource[resource_at_block].view_fields_names.length,
        //             );
        //             columnsTitles.forEach(async (columnTitle) => {
        //                 const columnTitleText = await columnTitle.getText();
        //                 expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
        //             });
        //             driver.sleep(10 * 1000);
        //         });
        //         it('users', async () => {
        //             resource_at_block = 'users';
        //             pageName = `${resource_at_block} Page`;
        //             await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
        //             await webAppHeader.goHome();
        //             await webAppHomePage.isSpinnerDone();
        //             await resourceListUtils.logOutLogIn(email, password);
        //             await webAppHomePage.isSpinnerDone();
        //             await resourceListBlock.navigate();
        //             await resourceListBlock.isSpinnerDone();
        //             await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
        //             driver.sleep(5 * 1000);
        //             const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
        //             expect(columnsTitles.length).to.equal(
        //                 detailsByResource[resource_at_block].view_fields_names.length,
        //             );
        //             columnsTitles.forEach(async (columnTitle) => {
        //                 const columnTitleText = await columnTitle.getText();
        //                 expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
        //             });
        //             driver.sleep(10 * 1000);
        //         });
        //         it('items', async () => {
        //             resource_at_block = 'items';
        //             pageName = `${resource_at_block} Page`;
        //             await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
        //             await webAppHeader.goHome();
        //             await webAppHomePage.isSpinnerDone();
        //             await resourceListUtils.logOutLogIn(email, password);
        //             await webAppHomePage.isSpinnerDone();
        //             await webAppHomePage.clickOnBtn(slugDisplayName);
        //             await resourceListBlock.isSpinnerDone();
        //             await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
        //             driver.sleep(5 * 1000);
        //             const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
        //             expect(columnsTitles.length).to.equal(
        //                 detailsByResource[resource_at_block].view_fields_names.length,
        //             );
        //             columnsTitles.forEach(async (columnTitle) => {
        //                 const columnTitleText = await columnTitle.getText();
        //                 expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
        //             });
        //             driver.sleep(10 * 1000);
        //         });
        //     });
        //     describe('Arrays Block', async () => {
        //         before(function () {
        //             slugDisplayName = 'Arrays';
        //             slug_path = 'arrays';
        //             resource_at_block = 'OfflineArraysToOnline';
        //             pageName = `${resource_at_block} Page`;
        //             resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
        //         });
        //         afterEach(async function () {
        //             driver.sleep(500);
        //             await webAppHomePage.collectEndTestData(this);
        //         });

        //         it('Arrays Block is Shown in Table', async () => {
        //             await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
        //             await webAppHeader.goHome();
        //             await webAppHomePage.isSpinnerDone();
        //             await resourceListUtils.logOutLogIn(email, password);
        //             await webAppHomePage.isSpinnerDone();
        //             await resourceListBlock.navigate();
        //             await resourceListBlock.isSpinnerDone();
        //             await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
        //             driver.sleep(5 * 1000);
        //             const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
        //             expect(columnsTitles.length).to.equal(
        //                 detailsByResource[resource_at_block].view_fields_names.length,
        //             );
        //             columnsTitles.forEach(async (columnTitle) => {
        //                 const columnTitleText = await columnTitle.getText();
        //                 expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
        //             });
        //             driver.sleep(10 * 1000);
        //         });
        //     });
        //     describe('Simple Collection Block', async () => {
        //         before(function () {
        //             slugDisplayName = 'Manual Tests';
        //             slug_path = 'manual_tests';
        //             resource_at_block = 'NameAge';
        //             pageName = `${resource_at_block} Page`;
        //             resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
        //         });
        //         afterEach(async function () {
        //             driver.sleep(500);
        //             await webAppHomePage.collectEndTestData(this);
        //         });

        //         it(`Mapping Page to Slug`, async () => {
        //             await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
        //             await webAppHeader.goHome();
        //             await webAppHomePage.isSpinnerDone();
        //             await resourceListUtils.logOutLogIn(email, password);
        //             await webAppHomePage.isSpinnerDone();
        //             // expect(await webAppHeader.safeUntilIsVisible(webAppHeader.UserBtn)).eventually.to.be.true;
        //         });
        //         it('Navigating to Slug via Deeplink', async () => {
        //             // Check Data Viewer Block Table Appears
        //             await resourceListBlock.navigate();
        //             await resourceListBlock.isSpinnerDone();
        //         });
        //         it('NameAge Block is Shown in Table', async () => {
        //             await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
        //             driver.sleep(5 * 1000);
        //             const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
        //             expect(columnsTitles.length).to.equal(
        //                 detailsByResource[resource_at_block].view_fields_names.length,
        //             );
        //             columnsTitles.forEach(async (columnTitle) => {
        //                 const columnTitleText = await columnTitle.getText();
        //                 expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
        //             });
        //             driver.sleep(10 * 1000);
        //         });
        //     });
        //     describe('NoScheme Block', async () => {
        //         before(function () {
        //             slugDisplayName = 'Manual Tests';
        //             slug_path = 'manual_tests';
        //             resource_at_block = 'Dataless';
        //             pageName = `${resource_at_block} (yitjj)`;
        //             resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
        //         });
        //         afterEach(async function () {
        //             driver.sleep(500);
        //             await webAppHomePage.collectEndTestData(this);
        //         });

        //         it(`Mapping Page to Slug`, async () => {
        //             await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
        //             await webAppHeader.goHome();
        //             await webAppHomePage.isSpinnerDone();
        //             await resourceListUtils.logOutLogIn(email, password);
        //             await webAppHomePage.isSpinnerDone();
        //             // expect(await webAppHeader.safeUntilIsVisible(webAppHeader.UserBtn)).eventually.to.be.true;
        //         });
        //         it('Click Button from Homepage', async () => {
        //             // Check Data Viewer Block Table Appears
        //             await webAppHeader.goHome();
        //             await webAppHomePage.isSpinnerDone();
        //             await webAppHomePage.clickOnBtn(slugDisplayName);
        //             await resourceListBlock.isSpinnerDone();
        //             await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
        //             driver.sleep(5 * 1000);
        //             await webAppHeader.goHome();
        //             await webAppHomePage.isSpinnerDone();
        //         });
        //         it('Navigating to Slug via Deeplink', async () => {
        //             // Check Data Viewer Block Table Appears
        //             await resourceListBlock.navigate();
        //             await resourceListBlock.isSpinnerDone();
        //         });
        //         it('Dataless Block is Shown in Table', async () => {
        //             await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
        //             driver.sleep(5 * 1000);
        //             const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
        //             expect(columnsTitles.length).to.equal(
        //                 detailsByResource[resource_at_block].view_fields_names.length,
        //             );
        //             columnsTitles.forEach(async (columnTitle) => {
        //                 const columnTitleText = await columnTitle.getText();
        //                 expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
        //             });
        //             driver.sleep(10 * 1000);
        //         });
        //     });
        // });
    });
}
