import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach ,before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import {
    WebAppHeader,
    WebAppHomePage,
    WebAppLoginPage,
    WebAppSettingsSidePanel,
    WebAppList,
    WebAppDialog,
} from '../pom';
import { ResourceList, ResourceEditors, ResourceViews } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { Slugs } from '../pom/addons/Slugs';
import ResourceListUtils from '../utilities/resource_list';

chai.use(promised);

export async function ResourceListTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppList: WebAppList;
    let webAppDialog: WebAppDialog;
    let resourceList: ResourceList;
    let resourceEditors: ResourceEditors;
    let resourceViews: ResourceViews;
    let pageBuilder: PageBuilder;
    let slugs: Slugs;
    let resourceListUtils: ResourceListUtils;
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
    // await generalService.baseAddonVersionsInstallation(varPass);
    // //#region Upgrade script dependencies
    // const testData = {
    //     'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', '0.7.65'],
    //     'Generic Resources': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', '0.5.6'],
    //     'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', '0.5.1'],
    //     'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', '0.7.24'],
    //     'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '17.15.94'],
    //     'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.10'],
    //     'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '1.1.31'],
    //     'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', '0.5.5'],
    //     'sync': ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '0.2.36'],
    //     'Pages': ['50062e0c-9967-4ed4-9102-f2bc50602d41', '0.9.11'],
    // };

    // const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    // const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // describe('Prerequisites Addons for Resource List Tests', () => {
    //     //Resource List - for the 1st step: making sure 'Resource List' and 'Generic Resources' are installed, and 'Core Resources' and 'User Defined Collections' are not.
    //     const addonsList = Object.keys(testData);

    //     isInstalledArr.forEach((isInstalled, index) => {
    //         it(`Validate That Needed Addon Is Installed: ${addonsList[index]}`, () => {
    //             expect(isInstalled).to.be.true;
    //         });
    //     });
    //     for (const addonName in testData) {
    //         const addonUUID = testData[addonName][0];
    //         const version = testData[addonName][1];
    //         const varLatestVersion = chnageVersionResponseArr[addonName][2];
    //         const changeType = chnageVersionResponseArr[addonName][3];
    //         describe(`Test Data: ${addonName}`, () => {
    //             it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
    //                 if (chnageVersionResponseArr[addonName][4] == 'Failure') {
    //                     expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
    //                 } else {
    //                     expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
    //                 }
    //             });
    //             it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
    //                 await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
    //                     .eventually.to.have.property('Version')
    //                     .a('string')
    //                     .that.is.equal(varLatestVersion);
    //             });
    //         });
    //     }
    // });

    describe('UI tests', async () => {
        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
            webAppList = new WebAppList(driver);
            webAppDialog = new WebAppDialog(driver);
            resourceList = new ResourceList(driver);
            resourceEditors = new ResourceEditors(driver);
            resourceViews = new ResourceViews(driver);
            pageBuilder = new PageBuilder(driver);
            slugs = new Slugs(driver);
            resourceListUtils = new ResourceListUtils(driver);
        });

        after(async function () {
            await driver.quit();
        });

        it('Login', async () => {
            await webAppLoginPage.login(email, password);
        });

        // describe('Editors Full Functionality test', async () => {
        //     afterEach(async function () {
        //         driver.sleep(500);
        //         await webAppHomePage.collectEndTestData(this);
        //     });

        //     it('Resource Views settings is loaded and Elements exist', async () => {
        //         // navigation
        //         await resourceListUtils.navigateTo('Resource Views');

        //         /* test logics */
        //         // title is currect
        //         const addonSettingsTitle = await (await driver.findElement(resourceList.PepTopArea_title)).getText();
        //         expect(addonSettingsTitle).to.contain('Views & Editors');

        //         // tabs are the right amount, the currect text and the right one (Views) is selected while the other isn't
        //         await driver.untilIsVisible(resourceList.GenericList_Content);
        //         await driver.untilIsVisible(resourceList.TabsContainer);
        //         const tabs = await driver.findElements(resourceList.AddonContainerTabs);
        //         expect(tabs.length).to.equal(2);
        //         const viewsTab_isSelected = await (
        //             await driver.findElement(resourceList.Views_Tab)
        //         ).getAttribute('aria-selected');
        //         expect(viewsTab_isSelected).to.equal('true');
        //         const editorsTab_isSelected = await (
        //             await driver.findElement(resourceList.Editors_Tab)
        //         ).getAttribute('aria-selected');
        //         expect(editorsTab_isSelected).to.equal('false');

        //         // list title is "Views" - contains number and "results"/"result", number of results is 0 and the text "No Data Found" appears
        //         const listTitle = await (
        //             await driver.findElement(resourceList.AddonSettingsContent_ListTitle)
        //         ).getText();
        //         expect(listTitle).to.equal('Views');
        //         const resultsDivText = await (await driver.findElement(resourceList.ResultsDiv)).getText();
        //         expect(resultsDivText).to.contain('result');
        //         await resourceViews.deleteAll();
        //         const numberOfResults = await (await driver.findElement(resourceList.NumberOfItemsInList)).getText();
        //         expect(Number(numberOfResults)).to.be.equal(0);
        //         const noData = (await (await driver.findElement(resourceList.List_NoDataFound)).getText()).trim();
        //         expect(noData).to.be.oneOf(['No Data Found', 'No results were found.']);
        //     });

        //     // it('Editors Tab', async () => {
        //     //     await resourceList.clickTab('Editors_Tab');
        //     //     //TODO
        //     // });
        // });

        // describe('Operations (e.g Addition, Deletion)', async () => {
        //     it('Delete Editor by Name: Neviagte to Editors, Add Editor and Delete it', async () => {
        //         resource_name = 'items';
        //         resourceEditors.setResourceName(resource_name);
        //         test_name = `RL_Editors_${resourceEditors.resourceName}_Test_${random_name}`;
        //         test_decsription = `Editor ${resourceEditors.resourceName} ${test_generic_decsription}`;
        //         await resourceListUtils.navigateTo('Resource Views');
        //         await resourceEditors.clickTab('Editors_Tab');
        //         await resourceEditors.validateEditorsListPageIsLoaded();
        //         await resourceListUtils.addToResourceList(resourceEditors, test_name, test_decsription);
        //         await resourceEditors.verifyEditPageOpen(test_name);
        //         resourceEditors.setEditorName(test_name);
        //         await resourceEditors.clickElement('EditPage_BackToList_Button');
        //         await resourceEditors.clickTab('Editors_Tab');
        //         await resourceEditors.deleteFromListByName(test_name);
        //     });
        // });

        describe('Flow', async () => {
            before(function () {
                resource_name = 'users';
                random_name = generalService.generateRandomString(5);
                // resourceEditors.setResourceName(resource_name);
                // resourceViews.setResourceName(resource_name);
            });
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Add Editor', async () => {
                editor_name = `${resource_name}_RL_Editors_Test_${random_name}`;
                editor_decsription = `Editor ${resource_name} ${test_generic_decsription}`;
                await resourceListUtils.navigateTo('Resource Views');
                await resourceEditors.clickTab('Editors_Tab');
                await resourceEditors.validateEditorsListPageIsLoaded();
                await resourceEditors.deleteAll();
                await resourceEditors.addToResourceList(editor_name, editor_decsription, resource_name);
                await resourceEditors.verifyEditorEditPageOpen(editor_name);
                // resourceEditors.setEditorName(editor_name);
            });
            it('Configure Editor', async () => {
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
                await resourceEditors.waitTillVisible(resourceEditors.Save_Popup_PepDialog, 5000);
                expect(await (await driver.findElement(resourceEditors.Save_Popup_MessageDiv)).getText()).to.contain(
                    'Saved successfully',
                );
                await resourceEditors.clickElement('Save_Popup_Close_Button');
                await resourceEditors.clickElement('EditPage_ProfileEditButton_Back');
                await resourceEditors.clickElement('EditPage_BackToList_Button');
            });
            it('Add View', async () => {
                view_name = `RL_Views_${resource_name}_Test_${random_name}`;
                view_decsription = `View ${resource_name} ${test_generic_decsription}`;
                await resourceListUtils.navigateTo('Resource Views');
                await resourceViews.validateViewsListPageIsLoaded();
                await resourceViews.deleteAll();
                await resourceViews.addToResourceList(view_name, view_decsription, resource_name);
                await resourceViews.verifyViewEditPageOpen(view_name); // IS DIFFERENT than: Editor Edit Page !  DO NOT CHANGE (Hagit, Dec2022)
                // resourceViews.setViewName(view_name);
            });
            it('Configure View', async () => {
                await resourceViews.selectEditor(resourceViews.SelectEditor_DropDown, editor_name);
                await resourceViews.clickElement('EditPage_Update_Button');
                await resourceViews.waitTillVisible(resourceViews.Update_Popup_PepDialog, 5000);
                expect(await (await driver.findElement(resourceViews.Update_Popup_MessageDiv)).getText()).to.contain(
                    'Successfully updated',
                );
                await resourceViews.clickElement('Update_Popup_Close_Button');
                resourceViews.pause(5000);
            });
            it('Create Page', async () => {
                await resourceListUtils.navigateTo('Page Builder');
                // debugger
                await pageBuilder.validatePageBuilderIsLoaded();
                await pageBuilder.deleteAll();
                await pageBuilder.addBlankPage(`${random_name}_Test Page ${resource_name}`, `Automation Testing Page for resource ${resource_name}`);
                pageBuilder.pause(6000);
            });
            it('Nevigate to Slugs', async () => {
                await resourceListUtils.navigateTo('Slugs');
                await slugs.clickTab('Mapping_Tab');
                // await slugs.createSlug('Automation Testing', 'auto_testing', 'Description Of the Slug');
                driver.sleep(7000);
            });
        });

        describe('E2E Method', async () => {
            beforeEach(async function () {
                random_name = generalService.generateRandomString(5);
            })
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

            // it('Full Flow for resource: users', async () => {
            //     await resourceListUtils.createBlockFullFlowE2E('users', random_name);
            // });

            it('Full Flow for resource: NameAge', async () => {
                await resourceListUtils.createBlockFullFlowE2E('NameAge', random_name);
            });

            it('Full Flow for resource: IntegerArray', async () => {
                await resourceListUtils.createBlockFullFlowE2E('IntegerArray', random_name);
            });

            it('Full Flow for resource: ContainedArrayNoScheme', async () => {
                await resourceListUtils.createBlockFullFlowE2E('ContainedArrayNoScheme', random_name);
            });
        });
    });
}
