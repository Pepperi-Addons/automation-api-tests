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
import { SelectPostAction, AddonLoadCondition } from '../pom/AddonPage';
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
                console.log('Test Failed');
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

        it('Workflow Scenario: Update Inventory', async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.login(email, password);

            const addonPage = new AddonPage(driver);

            const _TEST_DATA_ATD_NAME = 'UI Workflow Test ATD';
            const _TEST_DATA_ATD_DESCRIPTION = 'UI Workflow Test ATD Description';

            await addonPage.createNewATD(this, generalService, _TEST_DATA_ATD_NAME, _TEST_DATA_ATD_DESCRIPTION);

            await addonPage.editATDWorkflow(SelectPostAction.UpdateInventory);

            //Config HomePage Buttons
            const webAppSettingsBar = new WebAppSettingsSidePanel(driver);
            await webAppSettingsBar.selectSettingsByID('Company Profile');
            await driver.click(webAppSettingsBar.SettingsFrameworkHomeButtons);

            await addonPage.isSpinnerDone();
            await driver.switchTo(addonPage.AddonContainerIframe);
            await addonPage.isAddonFullyLoaded(AddonLoadCondition.Content);

            await driver.click(addonPage.SettingsFrameworkEditAdmin);
            await driver.sendKeys(addonPage.SettingsFrameworkEditorSearch, _TEST_DATA_ATD_NAME + Key.ENTER);
            await driver.click(addonPage.SettingsFrameworkEditorSave);

            //Go To HomePage Start New Workflow
            await driver.switchToDefaultContent();
            const webAppHeader = new WebAppHeader(driver);
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

            await webAppHomePage.manualResync();

            //StartOrder
            await webAppHomePage.clickOnBtn(_TEST_DATA_ATD_NAME);

            //Get to Items
            const webAppList = new WebAppList(driver);
            await webAppList.clickOnFromListRowWebElement();
            const webAppTopBar = new WebAppTopBar(driver);
            await webAppTopBar.click(webAppTopBar.DoneBtn);

            //wait one sec before cliking on catalog, to prevent click on other screen
            console.log('Change to Catalog Cards List');
            driver.sleep(1000);
            await webAppHomePage.isSpinnerDone();

            await webAppList.click(webAppList.CardListElements);

            //Validating new order
            const webAppDialog = new WebAppDialog(driver);
            await webAppDialog.selectDialogBoxBeforeNewOrder();

            //This sleep is mandaroy while the list is loading
            console.log('Loading List');
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
                    console.log('Tested Item Quantity Is At Start Condition (100)');
                    generalService.sleep(2002);
                }
                loopCounter--;
            } while (inventoryAfter[0].InStockQuantity == 100 && loopCounter > 0);

            expect(inventoryAfter[0].InStockQuantity).to.equal(100 - testDataItemQuantityToBuy);

            await webAppHomePage.isDialogOnHomePAge(this);

            //Remove the new ATD
            await driver.click(webAppHeader.Settings);

            await webAppSettingsBar.selectSettingsByID('Sales Activities');
            await driver.click(webAppSettingsBar.ObjectEditorTransactions);

            //Remove all the transactions of this ATD, or the UI will block the manual removal
            const transactionsToRemoveInCleanup = await objectsService.getTransaction({
                where: `Type LIKE '%${_TEST_DATA_ATD_NAME}%'`,
            });

            for (let index = 0; index < transactionsToRemoveInCleanup.length; index++) {
                const isTransactionDeleted = await objectsService.deleteTransaction(
                    transactionsToRemoveInCleanup[index].InternalID as number,
                );
                expect(isTransactionDeleted).to.be.true;
            }

            //Rename the ATD and Remove it with UI Delete to Reproduce the bug from version 1.0.8
            const tempATDExternalIDInCleanup = `${_TEST_DATA_ATD_NAME} ${uuidv4()}`;

            const atdToRemoveInCleanup = await generalService.getAllTypes({
                where: `Name='${_TEST_DATA_ATD_NAME}'`,
                include_deleted: true,
                page_size: -1,
            });

            await importExportATDService.postTransactionsATD({
                ExternalID: tempATDExternalIDInCleanup,
                InternalID: atdToRemoveInCleanup[0].InternalID,
                UUID: atdToRemoveInCleanup[0].UUID,
                Hidden: false,
                Description: _TEST_DATA_ATD_DESCRIPTION,
            });

            //Wait after POST new ATD from the API before getting it in the UI
            console.log('ATD Updated by using the API');
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
