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
import { ResourceList, ResourceEditors } from '../pom/addons/ResourceList';

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
    const random_name: string = generalService.generateRandomString(5);
    const test_generic_decsription = 'for RL automated testing';
    let test_name: string;
    let test_decsription: string;
    let numOfElementsBeforeAdding: number;
    let numOfElementsBeforeDeleting: number;

    // Selectors
    const ResourceViews_path = 'settings/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/views_and_editors'; //id

    /* Addons Installation */
    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies
    const testData = {
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        'Generic Resources': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    describe('Prerequisites Addons for Scripts Tests', () => {
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

    describe('UI test - Editors tab', async () => {
        //this.retries(1);

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
        });

        after(async function () {
            await driver.quit();
        });

        describe('Editors Full Functionality test', async () => {
            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Resource Views settings is loaded and Elements exist', async () => {
                // navigation
                await webAppLoginPage.login(email, password);
                await webAppHeader.openSettings();
                await webAppSettingsSidePanel.selectSettingsByID('Pages');
                await webAppSettingsSidePanel.clickSettingsSubCategory(ResourceViews_path, 'Pages');
                driver.sleep(500);
                driver.untilIsVisible(resourceList.PepTopArea_title);

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
                const numberOfResults = await (await driver.findElement(resourceList.NumberOfItemsInList)).getText();
                expect(Number(numberOfResults)).to.equal(0);
                const noData = await (await driver.findElement(resourceList.List_NoDataFound)).getText();
                expect(noData).to.contain('No Data Found');
            });

            it('Editors Tab', async () => {
                await resourceList.clickTab('Editors_Tab');
                //TODO
            });
        });

        describe('Operations (e.g Addition, Deletion)', async () => {
            // describe('Login and Open Settings', async () => {
            //     // this.retries(2);

            //     afterEach(async function () {
            //         driver.sleep(500);
            //         await webAppHomePage.collectEndTestData(this);
            //     });

            //     it('Pepperi Login', async () => {
            //         await webAppLoginPage.login(email, password);
            //     });
            //     it('Open Settings', async () => {
            //         await webAppHeader.openSettings();
            //     });
            // });

            // describe('Open Resource Views', async () => {
            //     // this.retries(2);

            //     afterEach(async function () {
            //         driver.sleep(500);
            //         await webAppHomePage.collectEndTestData(this);
            //     });

            //     it('Click on Pages (under Settings)', async () => {
            //         await webAppSettingsSidePanel.selectSettingsByID('Pages');
            //     });
            //     it('Click on Resource Views (under Pages)', async () => {
            //         await webAppSettingsSidePanel.clickSettingsSubCategory(ResourceViews_path, 'Pages');
            //         // await this.browser.click(webAppSettingsSidePanel.ResourceViews);
            //     });
            //     it('Verify that Resource Views Page is loaded', async () => {
            //         await resourceList.waitTillVisible(resourceList.PepTopArea, 15000);
            //     });
            // });

            // describe('Go to Editors tab', async () => {
            //     // this.retries(1);

            //     afterEach(async function () {
            //         driver.sleep(500);
            //         await webAppHomePage.collectEndTestData(this);
            //     });

            //     it('Click Editors Tab (under Resource Views)', async () => {
            //         await resourceList.clickTab('Editors_Tab');
            //     });
            //     // it('Verify that Editors List Content is loaded', async () => {
            //     //     await resourceEditors.validateEditorsListPageIsLoaded();
            //     // });
            // });

            /* JUST FOR THE PURPOSE OF EXPLORING THE AVAILABLE TESTING COMPONENTS */
            describe('Count Items in List', async () => {
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
                    await driver.click(resourceEditors.AddEditorPopup_Cancel);
                });
            });

            describe('Add Editor for accounts', async () => {
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it('Set Resource Name to "accounts"', async () => {
                    resourceEditors.setResourceName('accounts');
                });
                it('Set Test Name', async () => {
                    test_name = `RL_Editors_${resourceEditors.resourceName}_Test_${random_name}`;
                });
                it('Set Test Description', async () => {
                    test_decsription = `Editor ${resourceEditors.resourceName} ${test_generic_decsription}`;
                });
                it('Wait untill Add Button on Editors page is visible', async () => {
                    await resourceEditors.waitTillVisible(resourceEditors.AddEditor_Button, 5000);
                });
                it('Get Number of Elements in List', async () => {
                    numOfElementsBeforeAdding = Number(await webAppList.getNumOfElementsTitle());
                    console.info(`type of numOfElementsBeforeAdding: ${typeof numOfElementsBeforeAdding}`);
                });
                it('Click on Add Editor Button', async () => {
                    await resourceEditors.clickElement('AddEditor_Button');
                });
                it('Wait for the title "Add" to be displayed', async () => {
                    await resourceEditors.waitTillVisible(resourceEditors.AddEditorPopup_Title, 15000);
                });
                it('Wait for the input "Name" to be displayed', async () => {
                    await resourceEditors.waitTillVisible(resourceEditors.AddEditorPopup_Name, 5000);
                });
                it('Writing into the input "Name"', async () => {
                    await resourceEditors.insertTextToInputElement(test_name, resourceEditors.AddEditorPopup_Name);
                });
                it('Writing into the input "Description"', async () => {
                    await resourceEditors.insertTextToInputElement(
                        test_decsription,
                        resourceEditors.AddEditorPopup_Description,
                    );
                });
                it('Select Resource', async () => {
                    await resourceEditors.selectResource(
                        resourceEditors.resourceName,
                        resourceEditors.AddEditorPopupResourceDropdownSingleOption,
                    );
                });
                it('Verify Resource has been selected', async () => {
                    await resourceEditors.verifyResourceSelected();
                });
                it('Click Save', async () => {
                    await resourceEditors.clickElement('AddEditorPopup_Save');
                });
                it('Edit Page opened', async () => {
                    await resourceEditors.verifyEditPageOpen(test_name);
                });
            });

            describe('Go back to List, then Editors tab', async () => {
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it('Go back to List', async () => {
                    await resourceEditors.clickElement('EditPageEditors_BackToList_Button');
                });
                it('Click Editors Tab (under Resource Views)', async () => {
                    await resourceList.clickTab('Editors_Tab');
                });
                it('Verify Editor Added', async () => {
                    const numOfElementsAfterAdding = Number(await webAppList.getNumOfElementsTitle());
                    expect(numOfElementsAfterAdding).to.equal(numOfElementsBeforeAdding + 1);
                });
                // it('Verify that Editors List Content is loaded', async () => {
                //     await resourceEditors.validateEditorsListPageIsLoaded();
                // });
            });

            describe('Delete the Editor Created by the test', async () => {
                // let editorName = test_name;

                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it('Get Number of Elements in List', async () => {
                    numOfElementsBeforeDeleting = Number(await webAppList.getNumOfElementsTitle());
                    console.info(`type of numOfElementsBeforeAdding: ${typeof numOfElementsBeforeDeleting}`);
                });
                it('Select by name', async () => {
                    await resourceEditors.pause(3000);
                    await driver.untilIsVisible(resourceEditors.Label_Name);
                    await webAppList.searchInAddonList(test_name);
                    await resourceEditors.selectFromListByName(test_name);
                    // debugger
                });
                it('Click Pencil Button', async () => {
                    await resourceEditors.openPencilMenu();
                    // await driver.untilIsVisible(resourceEditors.Pencil_Button);
                    // await driver.click(resourceEditors.Pencil_Button);
                });
                it('Get to Delete Popup', async () => {
                    await resourceEditors.selectUnderPencil('Delete');
                    // await resourceEditors.deleteEditor();
                });
                it('Click RED Delete button', async () => {
                    await resourceEditors.confirmDeleteClickRedButton();
                    // await driver.click(resourceEditors.DeletePopup_Delete_Button);
                });
                it('Verify that Deleted', async () => {
                    await resourceList.clickTab('EditorsTab');
                    const numOfElementsAfterDeleting = Number(await webAppList.getNumOfElementsTitle());
                    expect(numOfElementsAfterDeleting).to.equal(numOfElementsBeforeDeleting - 1);
                    try {
                        await resourceEditors.selectFromListByName(test_name);
                    } catch (error) {
                        expect(error).to.not.be.undefined;
                    }
                });
            });

            describe('Add Editor for items', async () => {
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it("Test's settings", async () => {
                    resourceEditors.setResourceName('items');
                    test_name = `RL_Editors_${resourceEditors.resourceName}_Test_${random_name}`;
                    test_decsription = `Editor ${resourceEditors.resourceName} ${test_generic_decsription}`;
                });
                it('Go to Resource Views Editors tab', async () => {
                    await webAppSettingsSidePanel.selectSettingsByID('Pages');
                    await webAppSettingsSidePanel.clickSettingsSubCategory(ResourceViews_path, 'Pages');
                    await resourceList.waitTillVisible(resourceList.PepTopArea_title, 15000);
                    await resourceList.clickTab('Editors_Tab');
                    await resourceEditors.validateEditorsListPageIsLoaded();
                });
                it('Opening Add Form', async () => {
                    await resourceEditors.waitTillVisible(resourceEditors.AddEditor_Button, 5000);
                    await resourceEditors.clickElement('AddEditor_Button');
                    await resourceEditors.waitTillVisible(resourceEditors.AddEditorPopup_Title, 15000);
                    await resourceEditors.waitTillVisible(resourceEditors.AddEditorPopup_Name, 5000);
                });
                it('Filling and Submitting Form', async () => {
                    await resourceEditors.insertTextToInputElement(test_name, resourceEditors.AddEditorPopup_Name);
                    await resourceEditors.insertTextToInputElement(
                        test_decsription,
                        resourceEditors.AddEditorPopup_Description,
                    );
                    await resourceEditors.selectResource(
                        resourceEditors.resourceName,
                        resourceEditors.AddEditorPopupResourceDropdownSingleOption,
                    );
                    await resourceEditors.verifyResourceSelected();
                    await resourceEditors.clickElement('AddEditorPopup_Save');
                    resourceEditors.pause(5000);
                });
                it('Edit Page loaded', async () => {
                    await resourceEditors.verifyEditPageOpen(test_name);
                });
            });

            // describe('Go back to List then Editors tab', async () => {
            //     afterEach(async function () {
            //         driver.sleep(500);
            //         await webAppHomePage.collectEndTestData(this);
            //     });

            //     it('Go back to List', async () => {
            //         await resourceEditors.clickElement('EditPageEditors_BackToList_Button');
            //     });
            //     it('Click Editors Tab (under Resource Views)', async () => {
            //         await resourceList.clickTab('EditorsTab');
            //     });
            //     // it('Verify that Editors List Content is loaded', async () => {
            //     //     await resourceEditors.validateEditorsListPageIsLoaded();
            //     // });
            // });

            // describe('Delete Editor', async () => {

            //     afterEach(async function () {
            //         driver.sleep(500);
            //         await webAppHomePage.collectEndTestData(this);
            //     });

            //     it('Delete', async () => {
            //         await resourceEditors.deleteEditorByName(test_name);
            //     });

            // });

            describe('Delete All Editors', async () => {
                // this.retries(5);

                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it('Delete All', async () => {
                    // get to Editors tab
                    await webAppSettingsSidePanel.clickSettingsSubCategory(ResourceViews_path, 'Pages');
                    await resourceList.waitTillVisible(resourceList.PepTopArea_title, 15000);
                    await resourceList.clickTab('Editors_Tab');

                    // actual deletion
                    await resourceEditors.deleteAllEditors();
                    driver.sleep(15000);
                });

                // it('Wait', async () => {
                // });
            });
        });
    });
}
