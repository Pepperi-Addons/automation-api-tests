import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHeader, WebAppHomePage, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
import { ResourceList, ResourceEditors } from '../pom/addons/ResourceList';

chai.use(promised);

export async function MockTest(email: string, password: string, varPass: string, client: Client) {
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
            it('Go to Editors Tab', async () => {
                await webAppSettingsSidePanel.selectSettingsByID('Pages');
                await webAppSettingsSidePanel.clickSettingsSubCategory(ResourceViews_selector, 'Pages');
                await resourceList.waitTillVisible(resourceList.PepTopArea, 15000);
                await resourceList.clickTab('EditorsTab');
            });
            it('Add Editor With Resource "accounts"', async () => {
                resourceEditors.setResourceName('accounts');
                test_name = `RL_Editors_${resourceEditors.resourceName}_Test_${random_name}`;
                test_decsription = `Editor ${resourceEditors.resourceName} ${test_generic_decsription}`;
                await resourceEditors.waitTillVisible(resourceEditors.AddEditor_Button, 5000);
                await resourceEditors.clickElement('AddEditor_Button');
                await resourceEditors.waitTillVisible(resourceEditors.AddEditorPopup_Title, 15000);
                await resourceEditors.waitTillVisible(resourceEditors.AddEditorPopup_Name, 5000);
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
                await resourceEditors.verifyEditPageOpen(test_name);
                await resourceEditors.clickElement('EditPageEditors_BackToList_Button');
                await resourceList.clickTab('EditorsTab');
            });
            it('Delete the Editor that was created', async () => {
                await resourceEditors.pause(5000);
                await resourceEditors.selectFromListByName(test_name);
                await resourceEditors.openPencilMenu();
                await resourceEditors.selectUnderPencil('Delete');
                await resourceEditors.confirmDeleteClickRedButton();
                await resourceList.clickTab('EditorsTab');
                expect(await resourceEditors.selectFromListByName(test_name)).to.be.undefined;
            });
        });
    });
}
