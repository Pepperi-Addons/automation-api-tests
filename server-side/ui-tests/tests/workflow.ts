import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import {
    WebAppLoginPage,
    WebAppHeader,
    WebAppList,
    WebAppTopBar,
    WebAppDialog,
    WebAppSettingsSidePanel,
    AddonPage,
    WebAppHomePage,
} from '../pom/index';
import addContext from 'mochawesome/addContext';
import { Key } from 'selenium-webdriver';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import { ImportExportATDService } from '../../services/import-export-atd.service';
import { InventoryService } from '../../services/inventory.service';
import { SelectOption, SelectPostAction, AddonLoadCondition } from '../pom/AddonPage';
import { ObjectsService } from '../../services/objects.service';

chai.use(promised);

export async function WorkflowTest(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const importExportATDService = new ImportExportATDService(generalService.papiClient);
    const inventoryService = new InventoryService(generalService.papiClient);
    const objectsService = new ObjectsService(generalService);

    let driver: Browser;

    describe('Workflow UI Tests Suit', async function () {
        this.retries(1);

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
                driver.sleep(6006);
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
            const webAppList = new WebAppList(driver);

            //If not in new ATD, try to remove ATD and recreate new ATD
            try {
                //Make sure the page finish to load after creating new ATD
                await addonPage.isSpinnerDone();

                await driver.switchTo(addonPage.AddonContainerIframe);

                await addonPage.isAddonFullyLoaded(AddonLoadCondition.Footer);

                //Wait for all Ifreames to load after the main Iframe finished before switching between freames.
                expect(await addonPage.isEditorHiddenTabExist('WorkflowV2', 45000)).to.be.true;
                expect(await addonPage.isEditorTabVisible('GeneralInfo')).to.be.true;
                await driver.switchToDefaultContent();
                await addonPage.selectTabByText('Workflows');
                await driver.switchTo(addonPage.AddonContainerIframe);
                await addonPage.isAddonFullyLoaded(AddonLoadCondition.Footer);
                expect(await addonPage.isEditorTabVisible('WorkflowV2')).to.be.true;
            } catch (error) {
                await driver.switchToDefaultContent();
                const isPupUP = await (await driver.findElement(webAppDialog.Content)).getText();
                if (isPupUP == 'UI Workflow Test ATD already exists.') {
                    const base64Image = await driver.saveScreenshots();
                    addContext(this, {
                        title: `This should never happen since this bugwas solved in Object Types Editor Version 1.0.14`,
                        value: 'data:image/png;base64,' + base64Image,
                    });

                    addContext(this, {
                        title: `Known bug in Object Types Editor Version 1.0.8`,
                        value: 'https://pepperi.atlassian.net/browse/DI-18699',
                    });
                    await webAppDialog.selectDialogBox('Close');

                    //Remove all the transactions of this ATD, or the UI will block the manual removal
                    const transactionsToRemove = await objectsService.getTransaction({
                        where: `Type LIKE '%UI Workflow Test ATD%'`,
                    });

                    for (let index = 0; index < transactionsToRemove.length; index++) {
                        const isTransactionDeleted = await objectsService.deleteTransaction(
                            transactionsToRemove[index].InternalID as number,
                        );
                        expect(isTransactionDeleted).to.be.true;
                    }

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

                    //Wait after POST new ATD from the API before getting it in the UI
                    driver.sleep(4000);

                    await driver.sendKeys(webAppTopBar.EditorSearchField, tempATDExternalID + Key.ENTER);

                    //Make sure ATD finish to load after search
                    await addonPage.isSpinnerDone();

                    await webAppList.clickOnFromListRowWebElement();

                    await webAppTopBar.selectFromMenuByText(webAppTopBar.EditorEditBtn, 'Delete');

                    //Make sure all loading is done after Delete
                    await addonPage.isSpinnerDone();

                    let isPupUP = await (await driver.findElement(webAppDialog.Content)).getText();

                    expect(isPupUP).to.equal('Are you sure you want to proceed?');

                    await webAppDialog.selectDialogBox('Continue');

                    //Make sure all loading is done after Continue
                    await addonPage.isSpinnerDone();

                    isPupUP = await (await driver.findElement(webAppDialog.Content)).getText();

                    expect(isPupUP).to.equal('Task Delete completed successfully.');

                    await webAppDialog.selectDialogBox('Close');

                    try {
                        //Wait after refresh for the ATD list to load before searching for new list
                        await addonPage.isSpinnerDone();
                        await driver.sendKeys(webAppTopBar.EditorSearchField, 'UI Workflow Test ATD' + Key.ENTER);

                        //Make sure ATD finish to load after search
                        await addonPage.isSpinnerDone();

                        await webAppList.clickOnFromListRowWebElement(0, 6000);
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

                    //Make sure the page finish to load after creating new ATD
                    await addonPage.isSpinnerDone();

                    await driver.switchTo(addonPage.AddonContainerIframe);

                    await addonPage.isAddonFullyLoaded(AddonLoadCondition.Footer);

                    //Wait for all Ifreames to load after the main Iframe finished before switching between freames.
                    expect(await addonPage.isEditorHiddenTabExist('WorkflowV2', 45000)).to.be.true;
                    expect(await addonPage.isEditorTabVisible('GeneralInfo')).to.be.true;
                    await driver.switchToDefaultContent();
                    await addonPage.selectTabByText('Workflows');
                    await driver.switchTo(addonPage.AddonContainerIframe);
                    await addonPage.isAddonFullyLoaded(AddonLoadCondition.Footer);
                    expect(await addonPage.isEditorTabVisible('WorkflowV2')).to.be.true;
                }
            }

            expect(await driver.findElement(addonPage.AddonContainerATDEditorWorkflowFlowchartIndicator));

            //Edit the Workflow
            //Clear
            const workflowElmentsLength = await (
                await driver.findElements(addonPage.AddonContainerATDEditorWorkflowFlowchartEl)
            ).length;

            for (let index = workflowElmentsLength - 1; index >= 0; index--) {
                await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartEl, index);
                await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartElDeleteBtn);
                await driver.click(webAppDialog.IframeDialogApproveBtn);
                await addonPage.isAddonFullyLoaded(AddonLoadCondition.Footer);
            }

            //Add Steps
            await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartNewStepBtn);
            await driver.sendKeys(addonPage.AddonContainerATDEditorWorkflowFlowchartransitionNameBtn, 'Create');
            await addonPage.selectDropBoxByOption(
                addonPage.AddonContainerATDEditorWorkflowFlowchartFromStatusBtn,
                SelectOption.New,
            );
            await addonPage.selectDropBoxByOption(
                addonPage.AddonContainerATDEditorWorkflowFlowchartoStatusBtn,
                SelectOption.InCreation,
            );
            await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartSaveBtn);

            await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartNewStepBtn);
            await driver.sendKeys(addonPage.AddonContainerATDEditorWorkflowFlowchartransitionNameBtn, 'Submit');
            await addonPage.selectDropBoxByOption(
                addonPage.AddonContainerATDEditorWorkflowFlowchartFromStatusBtn,
                SelectOption.InCreation,
            );
            await addonPage.selectDropBoxByOption(
                addonPage.AddonContainerATDEditorWorkflowFlowchartoStatusBtn,
                SelectOption.Submitted,
            );
            await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartSaveBtn);

            await addonPage.isAddonFullyLoaded(AddonLoadCondition.Footer);

            //Edit Step
            await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartEl, 0);

            //Add Update Inventory
            await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartElEditBtn);
            await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartAddAction, 1);
            await addonPage.selectPostAction(SelectPostAction.UpdateInventory);
            await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartAddActionsSaveBtn);

            //Config Update Inventory
            await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartUpdateInventoryOriginInventoryCB);
            await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartUpdateInventoryDestinationAccountCB);
            await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartUpdateInventorySaveBtn);
            await driver.click(addonPage.AddonContainerATDEditorWorkflowFlowchartUpdateInventoryEditSaveBtn);

            await driver.switchToDefaultContent();

            //Config HomePage Buttons
            await webAppSettingsBar.selectSettingsByID('Company Profile');
            await driver.click(webAppSettingsBar.SettingsFrameworkHomeButtons);

            await addonPage.isSpinnerDone();
            await driver.switchTo(addonPage.AddonContainerIframe);
            await addonPage.isAddonFullyLoaded(AddonLoadCondition.Content);

            await driver.click(addonPage.SettingsFrameworkEditAdmin);
            await driver.sendKeys(addonPage.SettingsFrameworkEditorSearch, 'UI Workflow Test ATD' + Key.ENTER);
            await driver.click(addonPage.SettingsFrameworkEditorSave);

            //Go To HomePage Start New Workflow
            await driver.switchToDefaultContent();
            await driver.click(webAppHeader.Home);

            const webAppHomePage = new WebAppHomePage(driver);
            await webAppHomePage.isSpinnerDone();

            //Set the inventory to 100:
            const testDataItemExternalID = 'MakeUp012';
            const testDataItemQuantityToBuy = 6;
            const updatedInventory = await inventoryService.postInventory({
                InStockQuantity: 100.0,
                Item: {
                    Data: {
                        ExternalID: testDataItemExternalID,
                    },
                },
            });
            expect(updatedInventory.InStockQuantity).to.equal(100);

            await webAppHomePage.clickOnBtn('Accounts');
            await webAppHomePage.isSpinnerDone();

            await driver.click(webAppHeader.Home);
            await webAppHomePage.isSpinnerDone();

            //StartOrder
            await webAppHomePage.clickOnBtn('UI Workflow Test ATD');

            //Get to Items
            await webAppList.clickOnFromListRowWebElement();
            await webAppTopBar.click(webAppTopBar.DoneBtn);

            //wait one sec before cliking on catalog, to prevent click on other screen
            driver.sleep(1000);
            await webAppHomePage.isSpinnerDone();
            await webAppList.click(webAppList.CardListElements);

            //Validating new order
            await webAppDialog.selectDialogBoxBeforeNewOrder();

            //This sleep is mandaroy while the list is loading
            driver.sleep(3000);

            //Validate nothing is loading before starting to add items to cart
            await webAppList.isSpinnerDone();

            //Adding items to cart
            await webAppList.sendKeys(webAppTopBar.SearchFieldInput, testDataItemExternalID + Key.ENTER);
            //Make sure ATD finish to load after search
            await webAppList.isSpinnerDone();
            await webAppList.sendKysToInputListRowWebElement(0, testDataItemQuantityToBuy);

            //Take Image Before Cart
            const base64Image = await driver.saveScreenshots();
            addContext(this, {
                title: `Image of order item number befor going to cart`,
                value: 'data:image/png;base64,' + base64Image,
            });

            //Submit Order
            await webAppList.click(webAppTopBar.CartViewBtn);
            await webAppList.click(webAppTopBar.CartSumbitBtn);

            //Validating transaction created via the API
            let inventoryAfter;
            let loopCounter = 30;
            do {
                inventoryAfter = await inventoryService.getInventoryByItemExternalID(testDataItemExternalID);
                if (inventoryAfter[0].InStockQuantity == 100) {
                    generalService.sleep(2002);
                }
                loopCounter--;
            } while (inventoryAfter[0].InStockQuantity == 100 && loopCounter > 0);

            expect(inventoryAfter[0].InStockQuantity).to.equal(100 - testDataItemQuantityToBuy);

            //Wait 5 seconds and validate there are no dialogs opening up after placing order
            //Exmaple on how to write test over a known bug - let the test pass but add information to the report
            try {
                await expect(driver.findElement(webAppDialog.Title, 5000)).eventually.to.be.rejectedWith(
                    'After wait time of: 5000, for selector of pep-dialog .dialog-title, The test must end',
                );
            } catch (error) {
                const base64Image = await driver.saveScreenshots();
                addContext(this, {
                    title: `This bug happen some time, don't stop the test here, but add this as link`,
                    value: 'https://pepperi.atlassian.net/browse/DI-17083',
                });
                addContext(this, {
                    title: `This bug happen some time, don't stop the test here, but add this as image`,
                    value: 'data:image/png;base64,' + base64Image,
                });

                //Remove this dialog box and continue the test
                await webAppDialog.selectDialogBox('Close');
                driver.sleep(400);
                const base64Image2 = await driver.saveScreenshots();
                addContext(this, {
                    title: `Closed the dialog box`,
                    value: 'data:image/png;base64,' + base64Image2,
                });
            }

            //Remove the new ATD
            await driver.click(webAppHeader.Settings);

            await webAppSettingsBar.selectSettingsByID('Sales Activities');
            await driver.click(webAppSettingsBar.ObjectEditorTransactions);

            //Remove all the transactions of this ATD, or the UI will block the manual removal
            const transactionsToRemoveInCleanup = await objectsService.getTransaction({
                where: `Type LIKE '%UI Workflow Test ATD%'`,
            });

            for (let index = 0; index < transactionsToRemoveInCleanup.length; index++) {
                const isTransactionDeleted = await objectsService.deleteTransaction(
                    transactionsToRemoveInCleanup[index].InternalID as number,
                );
                expect(isTransactionDeleted).to.be.true;
            }

            //Rename the ATD and Remove it with UI Delete to Reproduce the bug from version 1.0.8
            const tempATDExternalIDInCleanup = `UI Workflow Test ATD ${uuidv4()}`;

            const atdToRemoveInCleanup = await generalService.getAllTypes({
                where: `Name='UI Workflow Test ATD'`,
                include_deleted: true,
                page_size: -1,
            });

            await importExportATDService.postTransactionsATD({
                ExternalID: tempATDExternalIDInCleanup,
                InternalID: atdToRemoveInCleanup[0].InternalID,
                UUID: atdToRemoveInCleanup[0].UUID,
                Hidden: false,
                Description: 'UI Workflow Test ATD Description',
            });

            //Wait after POST new ATD from the API before getting it in the UI
            driver.sleep(4000);

            await driver.sendKeys(webAppTopBar.EditorSearchField, tempATDExternalIDInCleanup + Key.ENTER);

            //Make sure ATD finish to load after search
            await addonPage.isSpinnerDone();

            await webAppList.clickOnFromListRowWebElement();

            await webAppTopBar.selectFromMenuByText(webAppTopBar.EditorEditBtn, 'Delete');

            //Make sure all loading is done after Delete
            await addonPage.isSpinnerDone();

            let isPupUP = await (await driver.findElement(webAppDialog.Content)).getText();

            expect(isPupUP).to.equal('Are you sure you want to proceed?');

            await webAppDialog.selectDialogBox('Continue');

            //Make sure all loading is done after Continue
            await addonPage.isSpinnerDone();

            isPupUP = await (await driver.findElement(webAppDialog.Content)).getText();

            expect(isPupUP).to.equal('Task Delete completed successfully.');

            await webAppDialog.selectDialogBox('Close');
        });
    });
}
