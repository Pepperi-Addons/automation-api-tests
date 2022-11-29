import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import {
    WebAppLoginPage,
    WebAppList,
    WebAppTopBar,
    WebAppHomePage,
    WebAppTransaction,
    WebAppHeader,
    ObjectTypeEditor,
    BrandedApp,
} from '../pom/index';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import { InventoryService } from '../../services/inventory.service';
import { WorkflowAction } from '../pom/Enumerations/WorkflowAction';
import { Key } from 'selenium-webdriver';

chai.use(promised);

export async function WorkflowTests(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const inventoryService = new InventoryService(generalService.papiClient);

    let driver: Browser;

    describe('Workflow UI Tests Suit', async function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
        });

        after(async function () {
            await driver.quit();
        });

        afterEach(async function () {
            const webAppHomePage = new WebAppHomePage(driver);
            await webAppHomePage.collectEndTestData(this);
        });

        it('Pre Test: Remove Workflow ATD', async function () {
            // debugger;
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.loginWithImage(email, password);

            const objectTypeEditor = new ObjectTypeEditor(driver);

            const _TEST_DATA_ATD_NAME = `UI Workflow Test ATD`;
            const _TEST_DATA_ATD_DESCRIPTION = 'UI Workflow Test ATD Description';

            const atdToRemove = await generalService.getAllTypes({
                where: `Name LIKE '${_TEST_DATA_ATD_NAME}%'`,
                include_deleted: false,
                page_size: -1,
            });

            for (let i = 0; i < atdToRemove.length; i++) {
                await objectTypeEditor.removeATD(generalService, atdToRemove[i].Name, _TEST_DATA_ATD_DESCRIPTION);
            }

            const webAppHeader = new WebAppHeader(driver);
            await webAppHeader.navigate();
            await driver.click(webAppHeader.Settings);
            const brandedApp = new BrandedApp(driver);
            // debugger;
            await brandedApp.removeAdminHomePageButtons(`${_TEST_DATA_ATD_NAME}`);
        });

        it('Workflow Scenario: Update Inventory', async function () {
            driver.sleep(5 * 1000);
            // debugger;
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.loginWithImage(email, password);

            const objectTypeEditor = new ObjectTypeEditor(driver);

            const _TEST_DATA_ATD_NAME = `UI Workflow Test ATD ${generalService.generateRandomString(5)}`;
            const _TEST_DATA_ATD_DESCRIPTION = 'UI Workflow Test ATD Description';

            await objectTypeEditor.createNewATD(this, generalService, _TEST_DATA_ATD_NAME, _TEST_DATA_ATD_DESCRIPTION);
            await objectTypeEditor.editATDWorkflow(WorkflowAction.UpdateInventory);

            const brandedApp = new BrandedApp(driver);
            await brandedApp.addAdminHomePageButtons(_TEST_DATA_ATD_NAME);

            //Set the inventory to 100:
            const _TEST_DATA_ITEM_EXTERNALID = 'MakeUp012'; //This item exist in the test data that is replaced when "replaceItems" test runs
            const _TEST_DATA_ITEM_QUANTITY_TO_BUY = 6;
            const updatedInventory = await inventoryService.postInventory({
                InStockQuantity: 100.0,
                Item: {
                    Data: {
                        ExternalID: _TEST_DATA_ITEM_EXTERNALID,
                    },
                },
            });
            expect(updatedInventory.InStockQuantity).to.equal(100);

            const webAppHomePage = new WebAppHomePage(driver);
            await webAppHomePage.manualResync(client);
            driver.sleep(5 * 1000);
            await webAppHomePage.initiateSalesActivity(_TEST_DATA_ATD_NAME);

            //Create new transaction from the UI
            const itemsScopeURL = await driver.getCurrentUrl();
            const transactionUUID = itemsScopeURL.split(/[/'|'?']/)[5];
            const webAppTransaction = new WebAppTransaction(driver, transactionUUID);
            console.log(`trans UUID: ${transactionUUID}`);
            driver.sleep(5 * 1000);
            await webAppTransaction.addItemToCart(
                this,
                _TEST_DATA_ITEM_EXTERNALID,
                _TEST_DATA_ITEM_QUANTITY_TO_BUY,
                true,
            );

            //Submit Order
            const webAppList = new WebAppList(driver);
            const webAppTopBar = new WebAppTopBar(driver);
            driver.sleep(5 * 1000);
            await webAppList.click(webAppTopBar.CartViewBtn);
            driver.sleep(5 * 1000);
            await webAppList.click(webAppTopBar.CartSumbitBtn);
            driver.sleep(5 * 1000);

            //Validating transaction created via the API
            let inventoryAfter;
            let loopCounter = 30;
            do {
                inventoryAfter = await inventoryService.getInventoryByItemExternalID(_TEST_DATA_ITEM_EXTERNALID);
                if (inventoryAfter[0].InStockQuantity == 100) {
                    console.log('Tested Item Quantity Is At Start Condition (100)');
                    generalService.sleep(2002);
                }
                loopCounter--;
            } while (inventoryAfter[0].InStockQuantity == 100 && loopCounter > 0);

            expect(inventoryAfter[0].InStockQuantity).to.equal(100 - _TEST_DATA_ITEM_QUANTITY_TO_BUY);

            await webAppHomePage.isDialogOnHomePAge(this);

            await objectTypeEditor.removeATD(generalService, _TEST_DATA_ATD_NAME, _TEST_DATA_ATD_DESCRIPTION);

            //Wait after refresh for the ATD list to load before searching in list
            await objectTypeEditor.isSpinnerDone();
            await driver.sendKeys(webAppTopBar.EditorSearchField, _TEST_DATA_ATD_NAME + Key.ENTER);

            //Validate the list of ATD is empty after the test finished
            await expect(webAppList.clickOnFromListRowWebElement(0, 6000)).eventually.to.be.rejectedWith(
                `After wait time of: 6000, for selector of 'pep-list .table-row-fieldset', The test must end, The element is: undefined`,
            );
        });
    });
}
