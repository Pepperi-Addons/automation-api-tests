import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import { DataViewsService } from '../../services/data-views.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage, WebAppLoginPage } from '../pom';
import { ResourceList, ResourceEditors, ResourceViews } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import ResourceListUtils from '../utilities/resource_list';
import { BaseFormDataViewField, GridDataViewField, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import {
    UpsertResourceFieldsToEditor,
    UpsertResourceFieldsToView,
    UpsertFieldsToMappedSlugs,
} from '../blueprints/DataViewBlueprints';
import { ResourceListSlugs } from '../pom/slugs/ResourceList.slug';
import { ResourceListBasicViewerEditorBlocksStructurePage } from '../blueprints/PageBlocksBlueprints';

chai.use(promised);

export async function ResourceListTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const dataViewsService = new DataViewsService(generalService.papiClient);
    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    // let webAppHeader: WebAppHeader;
    // let webAppList: WebAppList;
    // let webAppDialog: WebAppDialog;
    let resourceList: ResourceList;
    let resourceEditors: ResourceEditors;
    let resourceViews: ResourceViews;
    let pageBuilder: PageBuilder;
    // let slugs: Slugs;
    let resourceListUtils: ResourceListUtils;
    let resourceListSlugs: ResourceListSlugs;
    let random_name: string;
    const test_generic_decsription = 'for RL automated testing';
    let test_name: string;
    let test_decsription: string;
    let resource_name: string;
    let editor_name: string;
    let editor_decsription: string;
    let view_name: string;
    let view_decsription: string;

    /* Addons Installation */
    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies
    const testData = {
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', '0.7.69'],
        'Generic Resources': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', '0.5.6'],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', '0.5.1'],
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', '0.7.24'],
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '17.15.105'],
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.10'],
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '1.1.31'],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', '0.5.5'],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '0.2.36'],
        Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', '0.9.18'],
        'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', '0.5.3'],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    describe('Prerequisites Addons for Resource List Tests', () => {
        //Resource List - for the 1st step: making sure 'Resource List' and 'Generic Resources' are installed, and 'Core Resources' and 'User Defined Collections' are not.
        const addonsList = Object.keys(testData);

        isInstalledArr.forEach((isInstalled, index) => {
            it(`Validate That Needed Addon Is Installed: ${addonsList[index]}`, () => {
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

    describe('UI tests', async () => {
        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
            // webAppHeader = new WebAppHeader(driver);
            // webAppList = new WebAppList(driver);
            // webAppDialog = new WebAppDialog(driver);
            resourceList = new ResourceList(driver);
            resourceEditors = new ResourceEditors(driver);
            resourceViews = new ResourceViews(driver);
            pageBuilder = new PageBuilder(driver);
            // slugs = new Slugs(driver);
            resourceListUtils = new ResourceListUtils(driver);
            resourceListSlugs = new ResourceListSlugs();
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
                await resourceViews.deleteAll();
                const numberOfResults = await (await driver.findElement(resourceList.NumberOfItemsInList)).getText();
                expect(Number(numberOfResults)).to.be.equal(0);
                const noData = (await (await driver.findElement(resourceList.List_NoDataFound)).getText()).trim();
                expect(noData).to.be.oneOf(['No Data Found', 'No results were found.']);
            });

            it('Editors Tab', async () => {
                await resourceList.clickTab('Editors_Tab');
                //TODO
            });
        });

        describe('Operations (e.g Addition, Deletion)', async () => {
            it('Delete Editor by Name: Neviagte to Editors, Add Editor and Delete it', async () => {
                resource_name = 'NoData';
                // resourceEditors.setResourceName(resource_name);
                test_name = `RL_Editors_${resource_name}_Test_${random_name}`;
                test_decsription = `Editor ${resource_name} ${test_generic_decsription}`;
                await resourceListUtils.navigateTo('Resource Views');
                await resourceEditors.clickTab('Editors_Tab');
                await resourceEditors.validateEditorsListPageIsLoaded();
                await resourceEditors.addToResourceList(test_name, test_decsription, resource_name);
                await resourceEditors.verifyEditPageOpen(test_name);
                // resourceEditors.setEditorName(test_name);
                await resourceEditors.clickElement('EditPage_BackToList_Button');
                await resourceEditors.clickTab('Editors_Tab');
                await resourceEditors.deleteFromListByName(test_name);
            });
        });

        describe('Flow', async () => {
            before(function () {
                resource_name = 'ArraysNumbersNamesReals';
                random_name = generalService.generateRandomString(5);
            });
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Add Editor', async () => {
                editor_name = `${resource_name}_${random_name}_RL_Editors_Test`;
                editor_decsription = `Editor ${resource_name} ${test_generic_decsription}`;
                await resourceListUtils.navigateTo('Resource Views');
                await resourceEditors.clickTab('Editors_Tab');
                await resourceEditors.validateEditorsListPageIsLoaded();
                // await resourceEditors.deleteAll();
                await resourceEditors.addToResourceList(editor_name, editor_decsription, resource_name);
                await resourceEditors.verifyEditorEditPageOpen(editor_name);
            });
            it('Configure Editor', async () => {
                // let editorFields: BaseFormDataViewField[];
                const currentUrl = (await driver.getCurrentUrl()).split('/');
                const editorUuid = currentUrl[currentUrl.length - 1];
                // console.info(`EDITOR UUID: ${editorUuid}`);
                await resourceEditors.clickElement('Form_Tab');
                await resourceEditors.waitTillVisible(resourceEditors.EditPage_ConfigProfileCard_Rep, 15000);
                await resourceEditors.clickElement('EditPage_ConfigProfileCard_EditButton_Rep');
                resourceEditors.pause(500);
                await resourceEditors.clickElement('EditPage_MappedFields_DeleteButton_ByText_CreationDateTime');
                resourceEditors.pause(500);
                await resourceEditors.clickElement('EditPage_MappedFields_DeleteButton_ByText_ModificationDateTime');
                resourceEditors.pause(500);
                await resourceEditors.clickElement('EditPage_MappedFields_ReadOnly_CheckBox_ByText_Key');
                resourceEditors.pause(500);
                await resourceEditors.clickElement('EditPage_ProfileEditButton_Save');
                resourceEditors.pause(500);
                await resourceEditors.waitTillVisible(resourceEditors.Save_Popup_PepDialog, 5000);
                expect(await (await driver.findElement(resourceEditors.Save_Popup_MessageDiv)).getText()).to.contain(
                    'Saved successfully',
                );
                await resourceEditors.clickElement('Save_Popup_Close_Button');
                await resourceEditors.clickElement('EditPage_ProfileEditButton_Back');
                const editorFields: BaseFormDataViewField[] =
                    resourceListUtils.prepareDataForDragAndDropAtEditorAndView([['reals', 'TextBox', true, false]]);
                // console.info(`editorFields: ${JSON.stringify(editorFields, null, 2)}`)
                const resourceFieldsToAddToEditorObj = new UpsertResourceFieldsToEditor(editorUuid, editorFields);
                const upsertFieldsToEditor = await dataViewsService.postDataView(resourceFieldsToAddToEditorObj);
                console.info(`RESPONSE of API: ${JSON.stringify(upsertFieldsToEditor, null, 2)}`);
                await resourceEditors.clickElement('EditPage_ConfigProfileCard_EditButton_Rep');
                resourceEditors.pause(5000);
                await resourceEditors.clickElement('EditPage_ProfileEditButton_Back');
                resourceEditors.pause(5000);
                await resourceEditors.clickElement('EditPage_BackToList_Button');
            });
            it('Add View', async () => {
                view_name = `${resource_name}_${random_name}_RL_Views_Test`;
                view_decsription = `View ${resource_name} ${test_generic_decsription}`;
                await resourceListUtils.navigateTo('Resource Views');
                await resourceViews.validateViewsListPageIsLoaded();
                // await resourceViews.deleteAll();
                await resourceViews.addToResourceList(view_name, view_decsription, resource_name);
                await resourceViews.verifyViewEditPageOpen(view_name); // IS DIFFERENT than: Editor Edit Page !  DO NOT CHANGE (Hagit, Dec2022)
            });
            it('Configure View', async () => {
                let viewFields: GridDataViewField[];
                const currentUrl = (await driver.getCurrentUrl()).split('/');
                const viewUuid = currentUrl[currentUrl.length - 1];
                await resourceViews.selectEditor(resourceViews.SelectEditor_DropDown, editor_name);
                await resourceViews.clickElement('EditPage_Update_Button');
                await resourceViews.waitTillVisible(resourceViews.Update_Popup_PepDialog, 5000);
                expect(await (await driver.findElement(resourceViews.Update_Popup_MessageDiv)).getText()).to.contain(
                    'Successfully updated',
                );
                await resourceViews.clickElement('Update_Popup_Close_Button');
                resourceViews.pause(500);
                await resourceViews.clickElement('Form_Tab');
                await resourceViews.waitTillVisible(resourceViews.EditPage_ConfigProfileCard_Rep, 15000);
                await resourceViews.clickElement('EditPage_ConfigProfileCard_EditButton_Rep');
                resourceViews.pause(500);
                await resourceViews.clickElement('EditPage_ProfileEditButton_Save');
                resourceViews.pause(500);
                await resourceViews.waitTillVisible(resourceViews.Save_Popup_PepDialog, 5000);
                expect(await (await driver.findElement(resourceViews.Save_Popup_MessageDiv)).getText()).to.contain(
                    'Saved successfully',
                );
                await resourceViews.clickElement('Save_Popup_Close_Button');
                await resourceViews.clickElement('EditPage_ProfileEditButton_Back');
                viewFields = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                    ['reals', 'TextBox', true, false],
                ]);
                viewFields = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                    ['item', 'TextBox', true, false],
                    ['quantity', 'TextBox', true, false],
                    ['price', 'TextBox', true, false],
                    ['instock', 'TextBox', true, true],
                    ['description', 'TextBox', false, false],
                    ['sold', 'TextBox', false, true],
                    ['discount', 'TextBox', false, false],
                    ['replacement_available', 'TextBox', false, false],
                ]);
                const resourceFieldsToAddToViewObj = new UpsertResourceFieldsToView(viewUuid, viewFields);
                // console.info(`resourceFieldsToAddToViewObj: ${JSON.stringify(resourceFieldsToAddToViewObj, null, 2)}`);
                const upsertFieldsToView = await dataViewsService.postDataView(resourceFieldsToAddToViewObj);
                console.info(`RESPONSE of API: ${JSON.stringify(upsertFieldsToView, null, 2)}`);
                resourceViews.pause(5000);
            });
            it('Create Page', async () => {
                await resourceListUtils.navigateTo('Page Builder');
                // debugger
                await pageBuilder.validatePageBuilderIsLoaded();
                // await pageBuilder.deleteAll();
                // await pageBuilder.addBlankPage(`${resource_name} ${random_name}`, `Automation Testing Page for resource ${resource_name}`);
                const pageKey = '0e1225dc-7bc3-4aba-8676-9ae2072fcb1e';
                const viewerBlockKey = '2cb38ac8-3952-9ee5-7e17-860f97ac4de1';
                const configurationBlockKey = 'f0eedf57-fbe6-168f-dca0-a498da63bb07';
                const pageObj = new ResourceListBasicViewerEditorBlocksStructurePage(
                    pageKey,
                    [
                        {
                            blockKey: viewerBlockKey,
                            blockResource: 'DataViewerBlock',
                            collectionName: 'OnlineOffline',
                            selectedView: {
                                selectedViewUUID: '1a743d5d-7a83-40b7-b476-9d6c40250d4a',
                                selectedViewName: 'OnlineOffline View',
                            },
                        },
                        {
                            blockKey: configurationBlockKey,
                            blockResource: 'DataConfigurationBlock',
                            collectionName: 'OnlineOffline',
                            editorUUID: 'be4041b8-3ddf-4769-a047-2f474273fa34',
                        },
                    ],
                    [
                        {
                            sectionKey: 'b0898d2e-cf49-2d2d-d7e7-b9911b9c5779',
                            listOfBlockKeys: [viewerBlockKey],
                        },
                        {
                            sectionKey: 'ac8457e0-f0e5-39bf-658d-445b840e4ed1',
                            listOfBlockKeys: [configurationBlockKey],
                        },
                    ],
                );
                // console.info(`pageObj: ${JSON.stringify(pageObj, null, 2)}`)
                const publishPageResponse = await generalService.fetchStatus(
                    'https://papi.pepperi.com/V1.0/addons/api/50062e0c-9967-4ed4-9102-f2bc50602d41/internal_api/publish_page',
                    {
                        method: 'POST',
                        body: JSON.stringify(pageObj),
                    },
                );
                console.info(`publishPageResponse: ${JSON.stringify(publishPageResponse, null, 2)}`);
                pageBuilder.pause(6000);
            });
            it('Nevigate to Slugs', async () => {
                // let slugsFields: MenuDataViewField[];
                await resourceListUtils.navigateTo('Slugs');
                // await slugs.createSlug('RL0.6', 'resource-list-0-6', 'Used for previous implementation testing');
                const slugsFields: MenuDataViewField[] = resourceListUtils.prepareDataForDragAndDropAtSlugs([
                    ['arrays', 'cad05942-35d9-4828-b092-e3b54b7fa4c8'],
                    ['resource-list-0-7', 'dc4035b8-6251-4aaf-a7f3-61367369f368'],
                ]);
                // console.info(`slugsFields: ${JSON.stringify(slugsFields, null, 2)}`)
                const slugsFieldsToAddToMappedSlugsObj = new UpsertFieldsToMappedSlugs(slugsFields);
                // console.info(`slugsFieldsToAddToMappedSlugs: ${JSON.stringify(slugsFieldsToAddToMappedSlugsObj, null, 2)}`)
                const upsertFieldsToMappedSlugs = await dataViewsService.postDataView(slugsFieldsToAddToMappedSlugsObj);
                console.info(`RESPONSE of API: ${JSON.stringify(upsertFieldsToMappedSlugs, null, 2)}`);
                driver.sleep(7000);
            });
            // it('Add Slug to Home Screen', async () => {});
        });

        describe('E2E Method', async () => {
            beforeEach(async function () {
                random_name = generalService.generateRandomString(5);
            });
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Full Flow for resource: accounts', async () => {
                await resourceListUtils.createBlockFullFlowE2E('accounts', random_name);
            });

            it('Full Flow for resource: items', async () => {
                await resourceListUtils.createBlockFullFlowE2E('items', random_name);
            });

            it('Full Flow for resource: users', async () => {
                await resourceListUtils.createBlockFullFlowE2E('users', random_name);
            });

            it('Full Flow for resource: NameAge', async () => {
                await resourceListUtils.createBlockFullFlowE2E('NameAge', random_name);
            });

            it('Full Flow for resource: IntegerArray', async () => {
                await resourceListUtils.createBlockFullFlowE2E('IntegerArray', random_name);
            });

            it('Full Flow for resource: IntegerArray', async () => {
                await resourceListUtils.createBlockFullFlowE2E('DoubleArray', random_name);
            });

            it('Full Flow for resource: IntegerArray', async () => {
                await resourceListUtils.createBlockFullFlowE2E('StringArray', random_name);
            });

            it('Full Flow for resource: ContainedArrayNoScheme', async () => {
                await resourceListUtils.createBlockFullFlowE2E('ContainedArrayNoScheme', random_name);
            });
        });

        describe('Resource List 0.7', async () => {
            describe('DI-19954 Resource List - Data Viewer - Offline - Data', async () => {
                // before(async () => {});
                afterEach(async () => {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });
                // it('', async () => {});
                // it('', async () => {});
            });
            describe('DI-20285 Support Views Filter', async () => {
                /***  UDC Fields Have to be Indexed  ***/
                before(async () => {
                    await resourceListUtils.mappingSlugWithPage('resource-list-0-7', 'IndexedFields AT');
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.clickOnBtn('RL0.7');
                });
                afterEach(async () => {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });
                it('', async () => {
                    await driver.untilIsVisible(resourceListSlugs.pepRemoteLoaderElement);
                    driver.sleep(1 * 60 * 1000);
                });
                // it('', async () => {});
            });
            describe('DI-21009 Data Viewer Block - Array fields', async () => {
                /***  Fields that are an array should be shown in the list as following: 1.All types: show as string concatenated by ','  2.Array of contained??  ***/
                before(async () => {
                    await resourceListUtils.mappingSlugWithPage('arrays', 'ArraysNumbersNamesReals AT');
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.clickOnBtn('Arrays');
                });
                afterEach(async () => {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });
                it('Data is presented', async () => {
                    await driver.untilIsVisible(resourceListSlugs.pepRemoteLoaderElement);
                    driver.sleep(2 * 60 * 1000);
                });
                // it('Can Delete Data', async () => {

                // });
                // it('Can Add new Data', async () => {

                // });
                // it('Can Edit Data', async () => {

                // });
            });
            describe('DI-21010 Data Editor - support basic array fields', async () => {
                /*** | Should be at the bottom of the form | 
                    1. remove from DV, and add all arrays of resources at the bottom by order that they are in the DV 
                 | Basic fields - Use generic list with one column |
                    The list will include:
                    1. Add - opens dialog to enter value
                    2. pencil menu (single selection) with Edit & Delete  ***/
                before(async () => {
                    await resourceListUtils.mappingSlugWithPage('resource-list-0-7', 'ArraysNumbersNamesReals AT');
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.clickOnBtn('RL0.7');
                });
                afterEach(async () => {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });
                it('Data is presented', async () => {
                    await driver.untilIsVisible(resourceListSlugs.pepRemoteLoaderElement);
                    driver.sleep(2 * 60 * 1000);
                });
                // it('', async () => {

                // });
            });
            describe('DI-21550 Data Editor - support contained array fields', async () => {
                /*** Should be at the bottom of the form
                 * list shows properties as columns (configuration in the resource settings)
                 * use Generic Resource Viewer component
                 * add/edit opens form with (form should be form component) ***/
                before(async () => {
                    await resourceListUtils.mappingSlugWithPage('resource-list-0-7', 'ContainedArrayNoScheme AT');
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.clickOnBtn('RL0.7');
                });
                afterEach(async () => {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });
                it('Data is presented', async () => {
                    await driver.untilIsVisible(resourceListSlugs.pepRemoteLoaderElement);
                    driver.sleep(15000);
                });
            });
            describe('DI-21778 Resource List - Data Viewer - Offline support - Meta Data', async () => {
                before(() => {
                    resource_name = 'ArraysNumbersNamesReals';
                    random_name = generalService.generateRandomString(5);
                });
                afterEach(async () => {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });
                // it('', async () => {});
                // it('', async () => {});
            });
            describe('DI-21859 Available fields - support fields from references', async () => {
                before(() => {
                    resource_name = 'ArraysNumbersNamesReals';
                    random_name = generalService.generateRandomString(5);
                });
                afterEach(async () => {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });
                // it('', async () => {});
                // it('', async () => {});
            });
            describe('DI-21780 Refactor Resource List component to make it work for contained resources', async () => {
                before(() => {
                    resource_name = 'ArraysNumbersNamesReals';
                    random_name = generalService.generateRandomString(5);
                });
                afterEach(async () => {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });
                // it('', async () => {});
                // it('', async () => {});
            });
        });
    });
}
