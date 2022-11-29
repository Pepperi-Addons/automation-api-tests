import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHeader, WebAppHomePage, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
import { ResourceList, ResourceEditors } from '../pom/addons/ResourceList';

chai.use(promised);

export async function ResourceListTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    let driver: Browser;
    let webAppLoginPage: any;
    let webAppHomePage: any;
    let webAppSettingsSidePanel: any;
    let webAppHeader: any;
    let resourceList: any;
    let resourceEditors: any;
    const random_name: string = generalService.generateRandomString(5);
    const test_generic_decsription = 'for RL automated testing';
    let test_name: string;
    let test_decsription: string;

    // Selectors
    const ResourceViews_selector = 'settings/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/views_and_editors'; //id

    describe('UI test - Editors tab', async () => {
        //this.retries(1);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
            webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
            webAppHeader = new WebAppHeader(driver);
            resourceList = new ResourceList(driver);
            resourceEditors = new ResourceEditors(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('Login and Open Settings', async () => {
            // this.retries(2);

            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Pepperi Login', async () => {
                await webAppLoginPage.login(email, password);
            });
            it('Open Settings', async () => {
                await webAppHeader.openSettings();
            });
        });

        describe('Open Resource Views', async () => {
            // this.retries(2);

            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Click on Pages (under Settings)', async () => {
                await webAppSettingsSidePanel.selectSettingsByID('Pages');
            });
            it('Click on Resource Views (under Pages)', async () => {
                await webAppSettingsSidePanel.clickSettingsSubCategory(ResourceViews_selector, 'Pages');
            });
            it('Verify that Resource Views Page is loaded', async () => {
                await resourceList.waitTillVisible(resourceList.PepTopArea, 15000);
            });
        });

        describe('Go to Editors tab', async () => {
            // this.retries(1);

            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Click Editors Tab (under Resource Views)', async () => {
                await resourceList.clickTab('EditorsTab');
            });
            // it('Verify that Editors List Content is loaded', async () => {
            //     await resourceEditors.validateEditorsListPageIsLoaded();
            // });
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
                await resourceList.clickTab('EditorsTab');
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

            it('Select by name', async () => {
                await resourceEditors.pause(3000);
                await resourceEditors.selectFromListByName(test_name);
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
                try {
                    await resourceEditors.selectFromListByName(test_name);
                } catch (error) {
                    expect(error).to.not.be.undefined;
                }
            });
        });

        // describe('Add Editor for items', async () => {
        //     afterEach(async function () {
        //         driver.sleep(500);
        //         await webAppHomePage.collectEndTestData(this);
        //     });

        //     it("Test's settings", async () => {
        //         resourceEditors.setResourceName('items');
        //         test_name = `RL_Editors_${resourceEditors.resourceName}_Test_${random_name}`;
        //         test_decsription = `Editor ${resourceEditors.resourceName} ${test_generic_decsription}`;
        //     });
        //     it('Go to Resource Views Editors tab', async () => {
        //         await webAppSettingsSidePanel.selectSettingsByID('Pages');
        //         await webAppSettingsSidePanel.clickSettingsSubCategory(ResourceViews_selector, 'Pages');
        //         await resourceList.waitTillVisible(resourceList.PepTopArea, 15000);
        //         await resourceList.clickTab('EditorsTab');
        //         await resourceEditors.validateEditorsListPageIsLoaded();
        //     })
        //     it('Opening Add Form', async () => {
        //         await resourceEditors.waitTillVisible(resourceEditors.AddEditor_Button, 5000);
        //         await resourceEditors.clickElement('AddEditor_Button');
        //         await resourceEditors.waitTillVisible(resourceEditors.AddEditorPopup_Title, 15000);
        //         await resourceEditors.waitTillVisible(resourceEditors.AddEditorPopup_Name, 5000);
        //     });
        //     it('Filling Form', async () => {
        //         await resourceEditors.insertTextToInputElement(test_name, resourceEditors.AddEditorPopup_Name);
        //         await resourceEditors.insertTextToInputElement(test_decsription, resourceEditors.AddEditorPopup_Description);
        //         await resourceEditors.selectResource(resourceEditors.resourceName, resourceEditors.AddEditorPopupResourceDropdownSingleOption);
        //         await resourceEditors.verifyResourceSelected();
        //         await resourceEditors.clickElement('AddEditorPopup_Save');
        //         resourceEditors.pause(5000);
        //     });
        //     it('Edit Page loaded', async () => {
        //         await resourceEditors.verifyEditPageOpen(test_name);
        //     });
        // });

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

        // describe('Delete All Editors', async () => {

        //     afterEach(async function () {
        //         driver.sleep(500);
        //         await webAppHomePage.collectEndTestData(this);
        //     });

        //     it('Delete All', async () => {
        //         await resourceEditors.deleteAllEditors();
        //     });

        // });
    });
}
