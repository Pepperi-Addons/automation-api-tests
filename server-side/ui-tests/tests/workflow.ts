import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import {
    WebAppLoginPage,
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppTopBar,
    WebAppDialog,
    WebAppSettingsSidePanel,
    AddonPage,
} from '../pom/index';
import addContext from 'mochawesome/addContext';
import { Key } from 'selenium-webdriver';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import { ImportExportATDService } from '../../services/import-export-atd.service';

chai.use(promised);

export async function WorkflowTest(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const importExportATDService = new ImportExportATDService(generalService.papiClient);
    let driver: Browser;

    describe('Workflow UI Tests Suit', async function () {
        this.retries(0);

        before(async function () {
            driver = new Browser('chrome');
        });

        after(async function () {
            await driver.quit();
        });

        afterEach(async function () {
            if (this.currentTest.state != 'passed') {
                const base64Image = await driver.saveScreenshots();
                const url = await driver.getCurrentUrl();
                //Wait for all the logs to be printed (this usually take more then 3 seconds)
                driver.sleep(6000);
                const consoleLogs = await driver.getConsoleLogs();
                addContext(this, {
                    title: 'URL',
                    value: url,
                });
                addContext(this, {
                    title: `Image`,
                    value: 'data:image/png;base64,' + base64Image,
                });
                addContext(this, {
                    title: 'Console Logs',
                    value: consoleLogs,
                });
            }
        });

        it('Basic Workflow Scenario', async function () {
            //LogIn
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.navigate();
            await webAppLoginPage.signInAs(email, password);
            const webAppHeader = new WebAppHeader(driver);
            await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo, 90000)).eventually.to.be.true;

            //Create new ATD
            await driver.click(webAppHeader.Settings);

            const webAppSettingsBar = new WebAppSettingsSidePanel(driver);
            await webAppSettingsBar.selectSettingsByID('Sales Activities');
            await driver.click(webAppSettingsBar.ObjectEditorTransactions);

            const webAppTopBar = new WebAppTopBar(driver);
            await driver.click(webAppTopBar.EditorAddBtn);

            const webAppDialog = new WebAppDialog(driver);
            await driver.sendKeys(webAppDialog.EditorTextBoxInput, 'UI Workflow Test ATD');
            await driver.sendKeys(webAppDialog.EditorTextAreaInput, 'UI Workflow Test ATD Description' + Key.TAB);
            await webAppDialog.selectDialogBoxByText('Save');

            const addonPage = new AddonPage(driver);

            //If not in new ATD, try to remove ATD and recreate new ATD
            try {
                await driver.switchTo(addonPage.AddonContainerIframe);
                expect(await addonPage.isEditorTabVisible('GeneralInfo', 45000)).to.be.true;
                //Wait for all I freames to load after the main Iframe finished before switching between freames.
                driver.sleep(1000);

                await driver.switchToDefaultContent();
                await addonPage.selectTabByText('Workflows');
            } catch (error) {
                await driver.switchToDefaultContent();
                const isPupUP = await (await driver.findElement(webAppDialog.Content)).getText();
                if (isPupUP == 'UI Workflow Test ATD already exists.') {
                    const base64Image = await driver.saveScreenshots();
                    addContext(this, {
                        title: `This should never happen since this bugwas solved in Object Types Editor Version 1.0.14`,
                        value: 'data:image/png;base64,' + base64Image,
                    });

                    await webAppDialog.selectDialogBox('Close');

                    //Rename the ATD and Remove it with UI Delete to Reproduce the bug from version 1.0.8
                    const tempATDExternalID = `UI Workflow Test ATD ${uuidv4()}`;

                    const atdToRemove = await generalService.getAllTypes({
                        where: `Name='UI Workflow Test ATD'`,
                        include_deleted: true,
                        page_size: -1,
                    });

                    await importExportATDService.postTransactionsATD({
                        ExternalID: tempATDExternalID,
                        InternalID: atdToRemove[0].InternalID,
                        UUID: atdToRemove[0].UUID,
                        Hidden: false,
                        Description: 'UI Workflow Test ATD Description',
                    });

                    const webAppList = new WebAppList(driver);

                    //Wait after POST new ATD from the API before getting it in the UI
                    driver.sleep(4000);

                    await driver.sendKeys(webAppTopBar.EditorSearchField, tempATDExternalID + Key.ENTER);

                    //Make sure ATD finish to load after search
                    driver.sleep(2000);

                    await webAppList.clickOnFromListRowWebElement();

                    await webAppTopBar.selectFromMenuByText(webAppTopBar.EditorEditBtn, 'Delete');

                    //Sleep here is mandatory in the test since in case of pop-up the previous pop-up will be shown first
                    driver.sleep(1000);
                    let isPupUP = await (await driver.findElement(webAppDialog.Content)).getText();

                    expect(isPupUP).to.equal('Are you sure you want to proceed?');

                    await webAppDialog.selectDialogBox('Continue');

                    //Sleep here is mandatory in the test since in case of pop-up the previous pop-up will be shown first
                    driver.sleep(1000);
                    isPupUP = await (await driver.findElement(webAppDialog.Content)).getText();

                    expect(isPupUP).to.equal('Task Delete completed successfully.');

                    await webAppDialog.selectDialogBox('Close');

                    try {
                        //Wait after refresh for the ATD list to load before searching for new list
                        driver.sleep(1000);
                        await driver.sendKeys(webAppTopBar.EditorSearchField, 'UI Workflow Test ATD' + Key.ENTER);

                        //Make sure ATD finish to load after search
                        driver.sleep(2000);

                        await webAppList.clickOnFromListRowWebElement();
                        throw new Error('The list should be empty, this is a bug');
                    } catch (error) {
                        if (error instanceof Error && error.message == 'The list should be empty, this is a bug') {
                            throw error;
                        }
                    }

                    //Create new ATD
                    await driver.click(webAppSettingsBar.ObjectEditorTransactions);

                    await driver.click(webAppTopBar.EditorAddBtn);
                    await driver.sendKeys(webAppDialog.EditorTextBoxInput, `UI Workflow Test ATD`);
                    await driver.sendKeys(
                        webAppDialog.EditorTextAreaInput,
                        'UI Workflow Test ATD Description' + Key.TAB,
                    );
                    await webAppDialog.selectDialogBoxByText('Save');

                    await driver.switchTo(addonPage.AddonContainerIframe);
                    expect(await addonPage.isEditorTabVisible('GeneralInfo', 45000)).to.be.true;
                    //Wait for all I freames to load after the main Iframe finished before switching between freames.
                    driver.sleep(1000);

                    await driver.switchToDefaultContent();
                    await addonPage.selectTabByText('Workflows');
                }
            }

            await driver.switchTo(addonPage.AddonContainerIframe);
            expect(await addonPage.isEditorTabVisible('WorkflowV2', 45000)).to.be.true;
            throw new Error('4Fun');

            debugger;
            //StartOrder
            const webAppHomePage = new WebAppHomePage(driver);
            await webAppHomePage.click(webAppHomePage.Main);

            //Get to Items
            const webAppList = new WebAppList(driver);
            await webAppList.clickOnFromListRowWebElement();
            await webAppTopBar.click(webAppTopBar.DoneBtn);
            await webAppList.click(webAppList.CardListElements);

            //Validating new order
            await webAppDialog.selectDialogBoxBeforeNewOrder();

            //Sorting items by price
            await webAppTopBar.selectFromMenuByText(webAppTopBar.ChangeViewButton, 'Grid View');
            await webAppList.click(webAppList.CartListGridLineHeaderItemPrice);

            //This sleep is mandaroy while the list is re-sorting after the sorting click
            driver.sleep(3000);
            const cartItems = await driver.findElements(webAppList.CartListElements);
            let topPrice = webAppList.getPriceFromLineOfMatrix(await cartItems[0].getText());
            let secondPrice = webAppList.getPriceFromLineOfMatrix(await cartItems[1].getText());

            //Verify that matrix is sorted as expected
            if (topPrice < secondPrice) {
                await webAppList.click(webAppList.CartListGridLineHeaderItemPrice);

                //This sleep is mandaroy while the list is re-sorting after the sorting click
                driver.sleep(3000);
                const cartItems = await driver.findElements(webAppList.CartListElements);
                topPrice = webAppList.getPriceFromLineOfMatrix(await cartItems[0].getText());
                secondPrice = webAppList.getPriceFromLineOfMatrix(await cartItems[1].getText());
            }

            addContext(this, {
                title: `The two top items after the sort`,
                value: [topPrice, secondPrice],
            });

            expect(topPrice).to.be.above(secondPrice);
        });
    });
}
