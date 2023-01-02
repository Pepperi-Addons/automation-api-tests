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

    let random_name: string;
    const test_generic_decsription = 'for RL automated testing';
    let test_name: string;
    let test_decsription: string;
    let resource_name: string;
    let editor_name: string;
    let editor_decsription: string;
    let view_decsription: string;
    let editorKey: string;
    let viewKey: string;
    let viewName: string;

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
                resource_name = 'ArraysOfPrimitivesAuto';
                random_name = generalService.generateRandomString(5);
            });
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Add Editor', async () => {
                editor_name = `${resource_name} Editor (${random_name})`;
                editor_decsription = `Editor of resource: ${resource_name} - ${test_generic_decsription}`;
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
                // const editorUuid = currentUrl[currentUrl.length - 1];
                editorKey = currentUrl[currentUrl.length - 1];
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
                    resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                        { fieldName: 'reals', dataViewType: 'TextBox', mandatory: true, readonly: false },
                    ]);
                // console.info(`editorFields: ${JSON.stringify(editorFields, null, 2)}`)
                const resourceFieldsToAddToEditorObj = new UpsertResourceFieldsToEditor(editorKey, editorFields);
                const upsertFieldsToEditor = await dataViewsService.postDataView(resourceFieldsToAddToEditorObj);
                console.info(`RESPONSE of API: ${JSON.stringify(upsertFieldsToEditor, null, 2)}`);
                await resourceEditors.clickElement('EditPage_ConfigProfileCard_EditButton_Rep');
                resourceEditors.pause(5000);
                await resourceEditors.clickElement('EditPage_ProfileEditButton_Back');
                resourceEditors.pause(5000);
                await resourceEditors.clickElement('EditPage_BackToList_Button');
            });
            it('Add View', async () => {
                viewName = `${resource_name} View ${random_name}`;
                view_decsription = `View of resource: ${resource_name} - ${test_generic_decsription}`;
                await resourceListUtils.navigateTo('Resource Views');
                await resourceViews.validateViewsListPageIsLoaded();
                // await resourceViews.deleteAll();
                await resourceViews.addToResourceList(viewName, view_decsription, resource_name);
                await resourceViews.verifyViewEditPageOpen(viewName); // IS DIFFERENT than: Editor Edit Page !  DO NOT CHANGE (Hagit, Dec2022)
            });
            it('Configure View', async () => {
                const currentUrl = (await driver.getCurrentUrl()).split('/');
                viewKey = currentUrl[currentUrl.length - 1];
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
                // viewFields = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                //     ['reals', 'TextBox', true, false],
                // ]);
                const viewFields: GridDataViewField[] = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                    { fieldName: 'item', dataViewType: 'TextBox', mandatory: true, readonly: false },
                    { fieldName: 'quantity', dataViewType: 'TextBox', mandatory: true, readonly: false },
                    { fieldName: 'price', dataViewType: 'TextBox', mandatory: true, readonly: false },
                    { fieldName: 'instock', dataViewType: 'TextBox', mandatory: true, readonly: true },
                    { fieldName: 'description', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'sold', dataViewType: 'TextBox', mandatory: false, readonly: true },
                    { fieldName: 'discount', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'replacement_available', dataViewType: 'TextBox', mandatory: false, readonly: false },
                ]);
                const resourceFieldsToAddToViewObj = new UpsertResourceFieldsToView(viewKey, viewFields);
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
                // await pageBuilder.addBlankPage(`My Page`, `Manual Testing`);
                const pageKey = '0e1225dc-7bc3-4aba-8676-9ae2072fcb1e';
                const viewerBlockKey = '2cb38ac8-3952-9ee5-7e17-860f97ac4de1';
                const configurationBlockKey = 'f0eedf57-fbe6-168f-dca0-a498da63bb07';
                const pageObj = new ResourceListBasicViewerEditorBlocksStructurePage(
                    pageKey,
                    [
                        {
                            blockKey: viewerBlockKey,
                            blockResource: 'DataViewerBlock',
                            collectionName: resource_name,
                            selectedView: {
                                selectedViewUUID: viewKey,
                                selectedViewName: viewName,
                            },
                        },
                        {
                            blockKey: configurationBlockKey,
                            blockResource: 'DataConfigurationBlock',
                            collectionName: resource_name,
                            editorUUID: editorKey,
                        },
                    ],
                    [
                        {
                            sectionKey: 'daef8f6c-1d91-cfba-ec3c-9da2828fb800',
                            listOfBlockKeys: [viewerBlockKey],
                        },
                        {
                            sectionKey: 'e23cc2d1-3e2a-f745-d41c-60b8020fb167',
                            listOfBlockKeys: [configurationBlockKey],
                        },
                    ],
                );
                // console.info(`pageObj: ${JSON.stringify(pageObj, null, 2)}`)
                const responseOfPublishPage = await pageBuilder.publishPage(pageObj, client);
                expect(responseOfPublishPage.Ok).to.be.true;
                expect(responseOfPublishPage.Status).to.equal(200);
                console.info(`responseOfPublishPage: ${JSON.stringify(responseOfPublishPage, null, 2)}`);
                pageBuilder.pause(6000);
            });
            it('Map Page to Slugs', async () => {
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

            // it('Full Flow for resource: items', async () => {
            //     await resourceListUtils.createBlockFullFlowE2E('items', random_name);
            // });

            // it('Full Flow for resource: users', async () => {
            //     await resourceListUtils.createBlockFullFlowE2E('users', random_name);
            // });

            // it('Full Flow for resource: NameAge', async () => {
            //     await resourceListUtils.createBlockFullFlowE2E('NameAge', random_name);
            // });

            // it('Full Flow for resource: IntegerArray', async () => {
            //     await resourceListUtils.createBlockFullFlowE2E('IntegerArray', random_name);
            // });

            // it('Full Flow for resource: IntegerArray', async () => {
            //     await resourceListUtils.createBlockFullFlowE2E('DoubleArray', random_name);
            // });

            // it('Full Flow for resource: IntegerArray', async () => {
            //     await resourceListUtils.createBlockFullFlowE2E('StringArray', random_name);
            // });

            // it('Full Flow for resource: ContainedArrayNoScheme', async () => {
            //     await resourceListUtils.createBlockFullFlowE2E('ContainedArrayNoScheme', random_name);
            // });
        });

        // describe('Resource List 0.7', async () => {
        //     describe('DI-19954 Resource List - Data Viewer - Offline - Data', async () => {
        //         // before(async () => {});
        //         afterEach(async () => {
        //             driver.sleep(500);
        //             await webAppHomePage.collectEndTestData(this);
        //         });
        //         // it('', async () => {});
        //         // it('', async () => {});
        //     });
        //     describe('DI-20285 Support Views Filter', async () => {
        //         /***  UDC Fields Have to be Indexed  ***/
        //         before(async () => {
        //             await resourceListUtils.mappingSlugWithPage('resource-list-0-7', 'IndexedFields AT');
        //             await resourceListUtils.logOutLogIn(email, password);
        //             await webAppHomePage.clickOnBtn('RL0.7');
        //         });
        //         afterEach(async () => {
        //             driver.sleep(500);
        //             await webAppHomePage.collectEndTestData(this);
        //         });
        //         it('', async () => {
        //             await driver.untilIsVisible(resourceListSlugs.pepRemoteLoaderElement);
        //             driver.sleep(1 * 60 * 1000);
        //         });
        //         // it('', async () => {});
        //     });
        //     describe('DI-21009 Data Viewer Block - Array fields', async () => {
        //         /***  Fields that are an array should be shown in the list as following: 1.All types: show as string concatenated by ','  2.Array of contained??  ***/
        //         before(async () => {
        //             await resourceListUtils.mappingSlugWithPage('arrays', 'ArraysNumbersNamesReals AT');
        //             await resourceListUtils.logOutLogIn(email, password);
        //             await webAppHomePage.clickOnBtn('Arrays');
        //         });
        //         afterEach(async () => {
        //             driver.sleep(500);
        //             await webAppHomePage.collectEndTestData(this);
        //         });
        //         it('Data is presented', async () => {
        //             await driver.untilIsVisible(resourceListSlugs.pepRemoteLoaderElement);
        //             driver.sleep(2 * 60 * 1000);
        //         });
        //         // it('Can Delete Data', async () => {

        //         // });
        //         // it('Can Add new Data', async () => {

        //         // });
        //         // it('Can Edit Data', async () => {

        //         // });
        //     });
        //     describe('DI-21010 Data Editor - support basic array fields', async () => {
        //         /*** | Should be at the bottom of the form |
        //             1. remove from DV, and add all arrays of resources at the bottom by order that they are in the DV
        //          | Basic fields - Use generic list with one column |
        //             The list will include:
        //             1. Add - opens dialog to enter value
        //             2. pencil menu (single selection) with Edit & Delete  ***/
        //         before(async () => {
        //             await resourceListUtils.mappingSlugWithPage('resource-list-0-7', 'ArraysNumbersNamesReals AT');
        //             await resourceListUtils.logOutLogIn(email, password);
        //             await webAppHomePage.clickOnBtn('RL0.7');
        //         });
        //         afterEach(async () => {
        //             driver.sleep(500);
        //             await webAppHomePage.collectEndTestData(this);
        //         });
        //         it('Data is presented', async () => {
        //             await driver.untilIsVisible(resourceListSlugs.pepRemoteLoaderElement);
        //             driver.sleep(2 * 60 * 1000);
        //         });
        //         // it('', async () => {

        //         // });
        //     });
        //     describe('DI-21550 Data Editor - support contained array fields', async () => {
        //         /*** Should be at the bottom of the form
        //          * list shows properties as columns (configuration in the resource settings)
        //          * use Generic Resource Viewer component
        //          * add/edit opens form with (form should be form component) ***/
        //         before(async () => {
        //             await resourceListUtils.mappingSlugWithPage('resource-list-0-7', 'ContainedArrayNoScheme AT');
        //             await resourceListUtils.logOutLogIn(email, password);
        //             await webAppHomePage.clickOnBtn('RL0.7');
        //         });
        //         afterEach(async () => {
        //             driver.sleep(500);
        //             await webAppHomePage.collectEndTestData(this);
        //         });
        //         it('Data is presented', async () => {
        //             await driver.untilIsVisible(resourceListSlugs.pepRemoteLoaderElement);
        //             driver.sleep(15000);
        //         });
        //     });
        //     describe('DI-21778 Resource List - Data Viewer - Offline support - Meta Data', async () => {
        //         before(() => {
        //             resource_name = 'ArraysNumbersNamesReals';
        //             random_name = generalService.generateRandomString(5);
        //         });
        //         afterEach(async () => {
        //             driver.sleep(500);
        //             await webAppHomePage.collectEndTestData(this);
        //         });
        //         // it('', async () => {});
        //         // it('', async () => {});
        //     });
        //     describe('DI-21859 Available fields - support fields from references', async () => {
        //         before(() => {
        //             resource_name = 'ArraysNumbersNamesReals';
        //             random_name = generalService.generateRandomString(5);
        //         });
        //         afterEach(async () => {
        //             driver.sleep(500);
        //             await webAppHomePage.collectEndTestData(this);
        //         });
        //         // it('', async () => {});
        //         // it('', async () => {});
        //     });
        //     describe('DI-21780 Refactor Resource List component to make it work for contained resources', async () => {
        //         before(() => {
        //             resource_name = 'ArraysNumbersNamesReals';
        //             random_name = generalService.generateRandomString(5);
        //         });
        //         afterEach(async () => {
        //             driver.sleep(500);
        //             await webAppHomePage.collectEndTestData(this);
        //         });
        //         // it('', async () => {});
        //         // it('', async () => {});
        //     });
        // });
    });
}
