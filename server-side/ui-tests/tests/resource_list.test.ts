import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
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

chai.use(promised);

export async function ResourceListTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppSettingsSidePanel: WebAppSettingsSidePanel;
    let webAppHeader: WebAppHeader;
    let webAppList: WebAppList;
    let webAppDialog: WebAppDialog;
    let resourceList: ResourceList;
    let resourceEditors: ResourceEditors;
    let resourceViews: ResourceViews;
    const random_name: string = generalService.generateRandomString(5);
    const test_generic_decsription = 'for RL automated testing';
    let test_name: string;
    let test_decsription: string;
    let resource_name: string;
    let numOfElementsBeforeAdding: number;
    let numOfElementsBeforeDeleting: number;

    /* Addons Installation */
    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies
    const testData = {
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', '0.7.10'],
        'Generic Resources': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    describe('Prerequisites Addons for Resource List Tests', () => {
        //Resource List - making sure 'Resource List' and 'Generic Resources' are installed, and 'Core Resources' and 'User Defined Collections' are not.
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
            webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
            webAppHeader = new WebAppHeader(driver);
            webAppList = new WebAppList(driver);
            webAppDialog = new WebAppDialog(driver);
            resourceList = new ResourceList(driver);
            resourceEditors = new ResourceEditors(driver);
            resourceViews = new ResourceViews(driver);
        });

        after(async function () {
            await driver.quit();
        });

        it('Login', async () => {
            await webAppLoginPage.login(email, password);
        });

        describe('Editors Full Functionality test', async () => {
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Resource Views settings is loaded and Elements exist', async () => {
                // navigation
                await nevigateTo('Resource Views', driver);

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
                expect(noData).to.be.oneOf(['No Data Found','No results were found.']);
            });

            it('Editors Tab', async () => {
                await resourceList.clickTab('Editors_Tab');
                //TODO
            });
        });

        describe('Operations (e.g Addition, Deletion)', async () => {
            /* JUST FOR THE PURPOSE OF EXPLORING THE AVAILABLE TESTING COMPONENTS */

            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Exploring WebAppList', async () => {
                const elementAsArray = await webAppList.getAddonListAsTable();
                console.info(`webAppList.getListElementsAsArray: `);
                console.table(elementAsArray);
            });

            it('Display Num of Elements in List from Title', async () => {
                const numOfElements = await webAppList.getNumOfElementsTitle();
                console.info(`webAppList.getNumOfElementsTitle: ${numOfElements}`);
            });

            it('Exploring WebAppDialog', async () => {
                await driver.click(resourceList.Add_Button);
                const dialogTitle = await driver.findElement(webAppDialog.Title);
                console.info(`webAppDialog.Title: ${dialogTitle}`);
                await driver.click(webAppDialog.cancelBtn);
            });

            it('Close Open Dialog', async () => {
                await driver.click(resourceEditors.AddPopup_Cancel);
            });

            it('Delete Editor by Name: Neviagte to Editors, Add Editor and Delete it', async () => {
                resource_name = 'items';
                resourceEditors.setResourceName(resource_name);
                test_name = `RL_Editors_${resourceEditors.resourceName}_Test_${random_name}`;
                test_decsription = `Editor ${resourceEditors.resourceName} ${test_generic_decsription}`;
                await nevigateTo('Resource Views', driver);
                await resourceEditors.clickTab('Editors_Tab');
                await resourceEditors.validateEditorsListPageIsLoaded();
                await addToResourceList(resourceEditors, test_name, test_decsription);
                await resourceEditors.verifyEditPageOpen(test_name);
                resourceEditors.setEditorName(test_name);
                await resourceEditors.clickElement('EditPage_BackToList_Button');
                await resourceEditors.clickTab('Editors_Tab');
                await resourceEditors.deleteFromListByName(test_name);
            });

        });

        describe('Flow', async () => {
            before(function () {
                resource_name = 'accounts';
                resourceEditors.setResourceName(resource_name);
                resourceViews.setResourceName(resource_name);
            });
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it("Add Editor", async () => {
                test_name = `RL_Editors_${resourceEditors.resourceName}_Test_${random_name}`;
                test_decsription = `Editor ${resourceEditors.resourceName} ${test_generic_decsription}`;
                await nevigateTo('Resource Views', driver);
                await resourceEditors.clickTab('Editors_Tab');
                await resourceEditors.validateEditorsListPageIsLoaded();
                await resourceEditors.deleteAll();
                await addToResourceList(resourceViews, test_name, test_decsription);
                await resourceEditors.verifyEditorEditPageOpen(test_name);
                resourceEditors.setEditorName(test_name);
            });
            it("Configure Editor", async () => {
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
                expect(await (await driver.findElement(resourceEditors.Save_Popup_MessageDiv)).getText()).to.contain('Saved successfully');
                await resourceEditors.clickElement('Save_Popup_Close_Button');
                await resourceEditors.clickElement('EditPage_ProfileEditButton_Back');
                await resourceEditors.clickElement('EditPage_BackToList_Button');
            });
            it("Add View", async () => {
                test_name = `RL_Views_${resourceViews.resourceName}_Test_${random_name}`;
                test_decsription = `View ${resourceViews.resourceName} ${test_generic_decsription}`;
                await nevigateTo('Resource Views', driver);
                await resourceViews.validateViewsListPageIsLoaded();
                await resourceViews.deleteAll();
                await addToResourceList(resourceViews, test_name, test_decsription);
                await resourceViews.verifyViewEditPageOpen(test_name); // IS DIFFERENT than: Editor Edit Page !  DO NOT CHANGE (Hagit, Dec2022)
                resourceViews.setViewName(test_name);
            });
            it("Configure View", async () => {
                await resourceViews.selectEditor(resourceViews.SelectEditor_DropDown, resourceEditors.editorName);
                await resourceViews.clickElement('EditPage_Update_Button');
                await resourceViews.waitTillVisible(resourceViews.Update_Popup_PepDialog, 5000);
                expect(await (await driver.findElement(resourceViews.Update_Popup_MessageDiv)).getText()).to.contain('Successfully updated');
                await resourceViews.clickElement('Update_Popup_Close_Button');
                resourceViews.pause(5000);
            });
            it('Nevigate to Page Builder', async () => {
                await nevigateTo('Page Builder', driver);
                driver.sleep(7000);
            });
            it('Nevigate to Slugs', async () => {
                await nevigateTo('Slugs', driver);
                driver.sleep(7000);
            });
        });
    });
}

// Utils
async function nevigateTo(destiny: string, browser: Browser) {
    const header: WebAppHeader = new WebAppHeader(browser);
    const settingsSidePanel: WebAppSettingsSidePanel = new WebAppSettingsSidePanel(browser);
    try {
        if (!(await browser.getCurrentUrl()).includes('HomePage')) {
            await header.goHome();
        }
        await header.openSettings();
        await settingsSidePanel.selectSettingsByID('Pages');
        switch (destiny) {
            case 'Resource Views':
                const resourceList: ResourceList = new ResourceList(browser);
                await settingsSidePanel.clickSettingsSubCategory('views_and_editors', 'Pages');
                if (await browser.isElementVisible(resourceList.EditPage_BackToList_Button)) {
                    await resourceList.clickElement('EditPage_BackToList_Button');
                }
                await resourceList.waitTillVisible(resourceList.PepTopArea_title, 30000);
                break;
            case 'Slugs':
                await settingsSidePanel.clickSettingsSubCategory('slugs', 'Pages');
                break;
            case 'Page Builder':
                await settingsSidePanel.clickSettingsSubCategory('pages', 'Pages');
                break;
            default:
                throw new Error('Incorrect Path Chosen!');
        }
    } catch (error) {
        console.error(error);
    }
    return
}

async function addToResourceList(rlComponent: ResourceEditors | ResourceViews, testName: string, testDescription: string) {
    await rlComponent.waitTillVisible(rlComponent.Add_Button, 5000);
    await rlComponent.clickElement('Add_Button');
    await rlComponent.waitTillVisible(rlComponent.AddPopup_Title, 15000);
    await rlComponent.waitTillVisible(rlComponent.AddPopup_Name, 5000);
    await rlComponent.insertTextToInputElement(testName, rlComponent.AddPopup_Name);
    await rlComponent.insertTextToInputElement(
        testDescription,
        rlComponent.AddPopup_Description,
    );
    await rlComponent.selectResource(
        rlComponent.resourceName,
        rlComponent.AddPopupResourceDropdownSingleOption,
    );
    await rlComponent.verifyResourceSelected();
    await rlComponent.clickElement('AddPopup_Save');
    rlComponent.pause(1000);
}
