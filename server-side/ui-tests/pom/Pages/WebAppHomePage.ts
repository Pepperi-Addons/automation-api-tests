import { Browser } from '../../utilities/browser';
import config from '../../../config';
import { By } from 'selenium-webdriver';
import { WebAppDialog, WebAppHeader, WebAppList, WebAppTopBar } from '../index';
import addContext from 'mochawesome/addContext';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppAPI } from '../WebAppAPI';
import { Client } from '@pepperi-addons/debug-server/dist';
import { WebAppPage } from './base/WebAppPage';

chai.use(promised);

export class WebAppHomePage extends WebAppPage {
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}/HomePage`);
    }

    public MainHomePageBtn: By = By.css('#mainButton');
    public HomeScreenButtonArr: By = By.css('#homepage-footer-btns button');
    public HomeScreenSpesificButton: By = By.xpath(`//button[@title='|textToFill|']`);

    // supportmenu popup
    public SupportMenuPopup_Container: By = By.xpath('//div[contains(@class,"supportMenu")]');
    public SupportMenuPopup_Refresh: By = By.xpath('//a[@data-toggle="dropdown"][contains(text(),"Refresh")]');
    public SupportMenuPopup_RefreshData: By = By.xpath('//a[text()="Refresh Data"]');

    public async clickOnBtn(btnTxt: string): Promise<void> {
        await this.browser.ClickByText(this.HomeScreenButtonArr, btnTxt);
        return;
    }
    public async manualResync(client: Client): Promise<void> {
        const webAppAPI = new WebAppAPI(this.browser, client);
        const accessToken = await webAppAPI.getAccessToken();
        let syncResponse = await webAppAPI.getSyncResponse(accessToken);
        console.log(`received sync response: ${JSON.stringify(syncResponse)}`);
        expect(syncResponse.Status).to.be.oneOf(['UpToDate', 'HasChanges']);
        const webAppList = new WebAppList(this.browser);
        //Resync - Going to Accounts and back to Home Page
        console.log('Wait Before Loading Accounts');
        this.browser.sleep(2002);
        await this.clickOnBtn('Accounts');
        this.browser.sleep(2002);
        await webAppList.validateListRowElements();
        this.browser.sleep(1500);
        await this.returnToHomePage();
        this.browser.sleep(5005);
        syncResponse = await webAppAPI.getSyncResponse(accessToken);
        console.log(`received sync response: ${JSON.stringify(syncResponse)}`);
        expect(syncResponse.Status).to.be.oneOf(['UpToDate', 'HasChanges']);
        return;
    }

    public async reSyncApp() {
        const urlWithSupportMenu = (await this.browser.getCurrentUrl()) + '/supportmenu';
        await this.browser.navigate(urlWithSupportMenu);
        await this.browser.untilIsVisible(this.SupportMenuPopup_Refresh);
        await this.browser.click(this.SupportMenuPopup_Refresh);
        await this.browser.untilIsVisible(this.SupportMenuPopup_RefreshData);
        await this.browser.click(this.SupportMenuPopup_RefreshData);
        await this.isSpinnerDone();
    }

    /**
     * Example on how to write test over a known bug - let the test pass but add information to the report
     * @param that Should be the "this" of the mocha test, this will help connect data from this function to test reports
     */
    public async isDialogOnHomePAge(that): Promise<void> {
        const webAppDialog = new WebAppDialog(this.browser);
        //Wait 5 seconds and validate there are no dialogs opening up after placing order
        try {
            await expect(this.browser.findElement(webAppDialog.Title, 5000)).eventually.to.be.rejectedWith(
                `After wait time of: 5000, for selector of 'pep-dialog .dialog-title', The test must end`,
            );
        } catch (error) {
            const base64Image = await this.browser.saveScreenshots();
            addContext(that, {
                title: `This bug happen some time, don't stop the test here, but add this as link`,
                value: 'https://pepperi.atlassian.net/browse/DI-17083',
            });
            addContext(that, {
                title: `This bug happen some time, don't stop the test here, but add this as image`,
                value: 'data:image/png;base64,' + base64Image,
            });

            //Remove this dialog box and continue the test
            await webAppDialog.selectDialogBox('Close');
        }
        return;
    }

    /**
     * This can only be used from HomePage and when HomePage include button that lead to Transaction ATD
     * This will nevigate to the scope_items of a new transaction, deep link "/transactions/scope_items/${newUUID}"
     */
    public async initiateSalesActivity(
        nameOfATD?: string,
        nameOfAccount?: string,
        shouldSelectCatalog?: boolean,
    ): Promise<void> {
        //Start New Workflow
        if (nameOfATD) {
            await this.clickOnBtn(nameOfATD);
        } else {
            await this.click(this.MainHomePageBtn);
        }

        //Get to Items
        const webAppList = new WebAppList(this.browser);
        try {
            if (nameOfAccount) await webAppList.clickOnFromListRowWebElementByName(nameOfAccount);
            else await webAppList.clickOnFromListRowWebElement();
            const webAppTopBar = new WebAppTopBar(this.browser);
            await this.click(webAppTopBar.DoneBtn);
        } catch (error) {
            if (error instanceof Error) {
                if (
                    !error.message.includes(
                        `'pep-list .table-row-fieldset', The test must end, The element is: undefined`,
                    )
                ) {
                    throw error;
                }
            }
        }

        if (shouldSelectCatalog === false) {
            //if shouldnt select catalog from dialog - click 'cancel' button and return to homepage
            const webAppDialog = new WebAppDialog(this.browser);
            if (await this.safeUntilIsVisible(webAppDialog.xBtn, 5000)) {
                await this.browser.click(webAppDialog.xBtn, 0);
                this.browser.sleep(2500);
            } else {
                await this.browser.click(webAppDialog.cancelBtn, 0);
                this.browser.sleep(2500);
            }
        } else {
            try {
                //wait one sec before cliking on catalog, to prevent click on other screen
                console.log('Change to Catalog Cards List');
                this.browser.sleep(1000);
                await this.isSpinnerDone();
                const webAppTopBar = new WebAppTopBar(this.browser);
                if (await this.browser.untilIsVisible(webAppTopBar.CatalogSelectHeader)) {
                    await webAppList.click(webAppList.CardListElements);
                }
            } catch (error) {
                if (error instanceof Error) {
                    if (!error.message.includes('The test must end, The element is: undefined')) {
                        throw error;
                    }
                }
            }
            //This sleep is mandaroy while pop up message of existing order is calculated
            //TODO: Replace with explicit wait.
            console.log('Wait for existing orders');
            this.browser.sleep(2500);

            //Validate nothing is loading before clicking on dialog box
            await webAppList.isSpinnerDone();

            //Validating new order
            const webAppDialog = new WebAppDialog(this.browser);
            await webAppDialog.selectDialogBoxBeforeNewOrder();

            //This sleep is mandaroy while the list is loading
            console.log('Loading List');
            this.browser.sleep(3000);

            //Validate nothing is loading before starting to add items to cart
            await webAppList.isSpinnerDone();
            return;
        }
    }

    //TODO: POM should not contain Business Logic related checks/validations, move this to the relevant test suite or 'helper service'.
    public async validateATDIsApearingOnHomeScreen(ATDname: string): Promise<void> {
        const specificATDInjectedBtn = this.HomeScreenSpesificButton.valueOf()
            ['value'].slice()
            .replace('|textToFill|', ATDname);
        await this.browser.untilIsVisible(By.xpath(specificATDInjectedBtn), 10000);
    }

    public async validateATDIsNOTApearingOnHomeScreen(ATDname: string): Promise<boolean> {
        const specificATDInjectedBtn = this.HomeScreenSpesificButton.valueOf()
            ['value'].slice()
            .replace('|textToFill|', ATDname);
        const isFound = await this.browser.untilIsVisible(By.xpath(specificATDInjectedBtn), 10000);
        return !isFound;
    }

    public async returnToHomePage(): Promise<void> {
        //Go To HomePage
        await this.browser.switchToDefaultContent();
        const webAppHeader = new WebAppHeader(this.browser);
        await this.browser.click(webAppHeader.Home);
        await this.isSpinnerDone();
        return;
    }
}
