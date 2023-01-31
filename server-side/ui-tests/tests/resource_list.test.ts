import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import { DataViewsService } from '../../services/data-views.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHeader, WebAppHomePage, WebAppLoginPage } from '../pom';
import { ResourceList, ResourceEditors, ResourceViews } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import E2EUtils from '../utilities/e2e_utils';
import { BaseFormDataViewField, GridDataViewField, MenuDataViewField } from '@pepperi-addons/papi-sdk';

import { UpsertFieldsToMappedSlugs } from '../blueprints/DataViewBlueprints';

import { ResourceListBasicViewerEditorBlocksStructurePage } from '../blueprints/PageBlocksBlueprints';
import { ResourceListBlock } from '../pom/ResourceList.block';
import { Slugs } from '../pom/addons/Slugs';

chai.use(promised);

export async function ResourceListTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const dataViewsService = new DataViewsService(generalService.papiClient);
    // const papi_resources = ['accounts', 'items', 'users', 'catalogs', 'account_users', 'contacts'];

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
    let createdPage: { page: any; name: string };
    let resource_at_block: string;

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
        OfflineArraysToOnline: {
            view_fields_names: ['strArr', 'intArr', 'doubArr'],
        },
        NameAge: {
            view_fields_names: ['name', 'age', 'Key'],
        },
        Dataless: {
            view_fields_names: ['Key', 'integerhavenodata'],
        },
    };

    describe('Resource List UI tests', async () => {
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
        });

        after(async function () {
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
                const listTitle = await (
                    await driver.findElement(resourceList.AddonSettingsContent_ListTitle)
                ).getText();
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
            it('Delete Editor by Name: Neviagte to Editors, Add Editor and Delete it', async () => {
                resource_name = 'NoData';
                editorName = `RL_Editors_${resource_name}_Test_${random_name}`;
                editor_decsription = `Editor ${resource_name} ${test_generic_decsription}`;
                await resourceListUtils.navigateTo('Resource Views');
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
            before(function () {
                resource_name = 'NameAge';
                random_name = generalService.generateRandomString(5);
            });
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Add & Configure Editor', async () => {
                // Add Editor
                editorName = `${resource_name} Editor Auto_(${random_name})`;
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
                await resourceEditors.customEditorConfig(dataViewsService, {
                    editorKey: editorKey,
                    fieldsToConfigureInView: editorFields,
                });
                resourceEditors.pause(5 * 1000);
            });
            it('Add & Configure View', async () => {
                // Add View
                viewName = `${resource_name} View Auto_(${random_name})`;
                view_decsription = `View of resource: ${resource_name} - ${test_generic_decsription}`;
                await resourceListUtils.addView({
                    nameOfView: viewName,
                    descriptionOfView: view_decsription,
                    nameOfResource: resource_name,
                });
                // Configure View
                await resourceListUtils.gotoEditPageOfSelectedViewByName(viewName);
                viewKey = await resourceListUtils.getUUIDfromURL();
                const viewFields: GridDataViewField[] = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                    { fieldName: 'name', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'age', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
                ]);
                await resourceViews.customViewConfig(dataViewsService, {
                    matchingEditorName: editorName,
                    viewKey: viewKey,
                    fieldsToConfigureInView: viewFields,
                });
                resourceViews.pause(5 * 1000);
            });
            // it('Get Editor UUID', async () => {
            //     await resourceListUtils.gotoEditPageOfSelectedEditorByName(editorName);
            //     editorKey = await resourceListUtils.getUUIDfromURL();
            //     await webAppHeader.goHome();
            // });
            // it('Get View UUID', async () => {
            //     await resourceListUtils.gotoEditPageOfSelectedViewByName(viewName);
            //     viewKey = await resourceListUtils.getUUIDfromURL();
            //     await webAppHeader.goHome();
            // });
            it('Create Page', async () => {
                await resourceListUtils.navigateTo('Page Builder');
                // debugger
                await pageBuilder.validatePageBuilderIsLoaded();
                // await pageBuilder.deleteAll();
                pageName = `${resource_name} Page Auto_(${random_name})`;
                await pageBuilder.addBlankPage(pageName, `Automation Testing Page for resource ${resource_name}`);
                driver.sleep(2 * 1000);
                // await pageBuilder.addBlankPage(`My Page`, `Manual Testing`);
                const pageKey = await resourceListUtils.getUUIDfromURL();
                createdPage = await pageBuilder.getPageByUUID(pageKey, client);
                const viewerBlockKey = createdPage.page.Blocks.find((block) => {
                    if (block.Configuration.Resource === 'DataViewerBlock') {
                        return block.Key;
                    }
                }); //'2cb38ac8-3952-9ee5-7e17-860f97ac4de1';
                const configurationBlockKey = createdPage.page.Blocks.find((block) => {
                    if (block.Configuration.Resource === 'DataConfigurationBlock') {
                        return block.Key;
                    }
                }); //'f0eedf57-fbe6-168f-dca0-a498da63bb07';

                console.info(`createdPage: ${JSON.stringify(createdPage, null, 2)}`);
                // console.info(`viewerBlockKey: ${JSON.stringify(viewerBlockKey, null, 2)}`);
                console.info(`viewerBlockKey: ${viewerBlockKey.Key}`);
                // console.info(`configurationBlockKey: ${JSON.stringify(configurationBlockKey, null, 2)}`);
                console.info(`configurationBlockKey: ${configurationBlockKey.Key}`);

                const pageObj = new ResourceListBasicViewerEditorBlocksStructurePage(
                    pageKey,
                    [
                        {
                            blockKey: viewerBlockKey,
                            blockResource: 'DataViewerBlock',
                            selectedViews: [
                                {
                                    collectionName: resource_name,
                                    collectionID: '',
                                    selectedViewUUID: viewKey,
                                    selectedViewName: viewName,
                                },
                            ],
                        },
                        {
                            blockKey: configurationBlockKey,
                            blockResource: 'DataConfigurationBlock',
                            selectedEditor: { collectionName: resource_name, editorUUID: editorKey },
                        },
                    ],
                    [
                        {
                            sectionKey: 'daef8f6c-1d91-cfba-ec3c-9da2828fb800',
                            blockKeysForSectionColumns: [viewerBlockKey],
                        },
                        {
                            sectionKey: 'e23cc2d1-3e2a-f745-d41c-60b8020fb167',
                            blockKeysForSectionColumns: [configurationBlockKey],
                        },
                    ],
                );
                // console.info(`pageObj: ${JSON.stringify(pageObj, null, 2)}`)
                const responseOfPublishPage = await pageBuilder.publishPage(pageObj, client);
                expect(responseOfPublishPage.Ok).to.be.true;
                expect(responseOfPublishPage.Status).to.equal(200);
                console.info(`RESPONSE: ${JSON.stringify(responseOfPublishPage, null, 2)}`);
                pageBuilder.pause(6 * 1000);
            });
            it('Drag & Drop Cards to Mapped slugs', async () => {
                await resourceListUtils.navigateTo('Slugs');
                await slugs.isSpinnerDone();
                await slugs.clickTab('Mapping_Tab');
                const slugsFields: MenuDataViewField[] = resourceListUtils.prepareDataForDragAndDropAtSlugs(
                    [
                        { slug_path: 'arrays', pageUUID: await slugs.getSlugUUIDbySlugName('arrays', client) },
                        {
                            slug_path: 'manual_tests',
                            pageUUID: await slugs.getSlugUUIDbySlugName('manual_tests', client),
                        },
                        {
                            slug_path: 'resource-list-0-6',
                            pageUUID: await slugs.getSlugUUIDbySlugName('resource-list-0-6', client),
                        },
                    ],
                    [],
                );
                // console.info(`slugsFields: ${JSON.stringify(slugsFields, null, 2)}`)
                const slugsFieldsToAddToMappedSlugsObj = new UpsertFieldsToMappedSlugs(slugsFields);
                // console.info(`slugsFieldsToAddToMappedSlugs: ${JSON.stringify(slugsFieldsToAddToMappedSlugsObj, null, 2)}`)
                const upsertFieldsToMappedSlugs = await dataViewsService.postDataView(slugsFieldsToAddToMappedSlugsObj);
                console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToMappedSlugs, null, 2)}`);
                driver.sleep(2 * 1000);
                await resourceListUtils.logOutLogIn(email, password);
                await webAppHomePage.isSpinnerDone();
                await resourceListUtils.navigateTo('Slugs');
                await slugs.clickTab('Mapping_Tab');
                driver.sleep(7 * 1000);
            });
            it('Map Page to Slug and go to Block', async () => {
                slugDisplayName = 'Manual Tests';
                slug_path = 'manual_tests';
                resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
                await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await resourceListUtils.logOutLogIn(email, password);
                await webAppHomePage.isSpinnerDone();
                await webAppHomePage.clickOnBtn(slugDisplayName);
                await resourceListBlock.isSpinnerDone();
                await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                driver.sleep(0.5 * 1000);
                const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                expect(columnsTitles.length).to.equal(detailsByResource[resource_at_block].view_fields_names.length);
                columnsTitles.forEach(async (columnTitle) => {
                    const columnTitleText = await columnTitle.getText();
                    expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
                });
                driver.sleep(15 * 1000);
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
            });
        });

        describe('Teardown', async () => {
            beforeEach(async function () {
                await driver.navigate(`https://app.pepperi.com/HomePage`);
                await webAppHomePage.isSpinnerDone();
            });
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Delete Editor', async () => {
                await resourceListUtils.navigateTo('Resource Views');
                await resourceEditors.clickTab('Editors_Tab');
                await resourceEditors.deleteFromListByName(editorName);
            });
            it('Delete View', async () => {
                await resourceListUtils.navigateTo('Resource Views');
                await resourceViews.deleteFromListByName(viewName);
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

        describe('Blocks', async () => {
            beforeEach(async function () {
                await driver.navigate(`https://app.pepperi.com/HomePage`);
                await webAppHomePage.isSpinnerDone();
            });
            describe('PAPI Resources', async () => {
                before(function () {
                    slugDisplayName = 'RL0.6';
                    slug_path = 'resource-list-0-6';
                    resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
                });
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it(`accounts`, async () => {
                    resource_at_block = 'accounts';
                    pageName = `${resource_at_block} Page`;
                    await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn(slugDisplayName);
                    await resourceListBlock.isSpinnerDone();
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(5 * 1000);
                    const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                    expect(columnsTitles.length).to.equal(
                        detailsByResource[resource_at_block].view_fields_names.length,
                    );
                    columnsTitles.forEach(async (columnTitle) => {
                        const columnTitleText = await columnTitle.getText();
                        expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
                    });
                    driver.sleep(10 * 1000);
                });
                it('users', async () => {
                    resource_at_block = 'users';
                    pageName = `${resource_at_block} Page`;
                    await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.isSpinnerDone();
                    await resourceListBlock.navigate();
                    await resourceListBlock.isSpinnerDone();
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(5 * 1000);
                    const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                    expect(columnsTitles.length).to.equal(
                        detailsByResource[resource_at_block].view_fields_names.length,
                    );
                    columnsTitles.forEach(async (columnTitle) => {
                        const columnTitleText = await columnTitle.getText();
                        expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
                    });
                    driver.sleep(10 * 1000);
                });
                it('items', async () => {
                    resource_at_block = 'items';
                    pageName = `${resource_at_block} Page`;
                    await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn(slugDisplayName);
                    await resourceListBlock.isSpinnerDone();
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(5 * 1000);
                    const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                    expect(columnsTitles.length).to.equal(
                        detailsByResource[resource_at_block].view_fields_names.length,
                    );
                    columnsTitles.forEach(async (columnTitle) => {
                        const columnTitleText = await columnTitle.getText();
                        expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
                    });
                    driver.sleep(10 * 1000);
                });
            });
            describe('Arrays Block', async () => {
                before(function () {
                    slugDisplayName = 'Arrays';
                    slug_path = 'arrays';
                    resource_at_block = 'OfflineArraysToOnline';
                    pageName = `${resource_at_block} Page`;
                    resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
                });
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it('Arrays Block is Shown in Table', async () => {
                    await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.isSpinnerDone();
                    await resourceListBlock.navigate();
                    await resourceListBlock.isSpinnerDone();
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(5 * 1000);
                    const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                    expect(columnsTitles.length).to.equal(
                        detailsByResource[resource_at_block].view_fields_names.length,
                    );
                    columnsTitles.forEach(async (columnTitle) => {
                        const columnTitleText = await columnTitle.getText();
                        expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
                    });
                    driver.sleep(10 * 1000);
                });
            });
            describe('Simple Collection Block', async () => {
                before(function () {
                    slugDisplayName = 'Manual Tests';
                    slug_path = 'manual_tests';
                    resource_at_block = 'NameAge';
                    pageName = `${resource_at_block} Page`;
                    resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
                });
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it(`Mapping Page to Slug`, async () => {
                    await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.isSpinnerDone();
                    // expect(await webAppHeader.safeUntilIsVisible(webAppHeader.UserBtn)).eventually.to.be.true;
                });
                it('Navigating to Slug via Deeplink', async () => {
                    // Check Data Viewer Block Table Appears
                    await resourceListBlock.navigate();
                    await resourceListBlock.isSpinnerDone();
                });
                it('NameAge Block is Shown in Table', async () => {
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(5 * 1000);
                    const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                    expect(columnsTitles.length).to.equal(
                        detailsByResource[resource_at_block].view_fields_names.length,
                    );
                    columnsTitles.forEach(async (columnTitle) => {
                        const columnTitleText = await columnTitle.getText();
                        expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
                    });
                    driver.sleep(10 * 1000);
                });
            });
            describe('NoScheme Block', async () => {
                before(function () {
                    slugDisplayName = 'Manual Tests';
                    slug_path = 'manual_tests';
                    resource_at_block = 'Dataless';
                    pageName = `${resource_at_block} (yitjj)`;
                    resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
                });
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it(`Mapping Page to Slug`, async () => {
                    await resourceListUtils.mappingSlugWithPage(slug_path, pageName);
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.isSpinnerDone();
                    // expect(await webAppHeader.safeUntilIsVisible(webAppHeader.UserBtn)).eventually.to.be.true;
                });
                it('Click Button from Homepage', async () => {
                    // Check Data Viewer Block Table Appears
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn(slugDisplayName);
                    await resourceListBlock.isSpinnerDone();
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(5 * 1000);
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                });
                it('Navigating to Slug via Deeplink', async () => {
                    // Check Data Viewer Block Table Appears
                    await resourceListBlock.navigate();
                    await resourceListBlock.isSpinnerDone();
                });
                it('Dataless Block is Shown in Table', async () => {
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(5 * 1000);
                    const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                    expect(columnsTitles.length).to.equal(
                        detailsByResource[resource_at_block].view_fields_names.length,
                    );
                    columnsTitles.forEach(async (columnTitle) => {
                        const columnTitleText = await columnTitle.getText();
                        expect(columnTitleText).to.be.oneOf(detailsByResource[resource_at_block].view_fields_names);
                    });
                    driver.sleep(10 * 1000);
                });
            });
        });
    });
}
