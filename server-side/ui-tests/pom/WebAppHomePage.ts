import { Browser } from '../utilities/browser';
import { Page } from './base/Page';
import config from '../../config';
import { Locator, By } from 'selenium-webdriver';
import { WebAppDialog, WebAppHeader, WebAppList, WebAppTopBar } from './index';
import addContext from 'mochawesome/addContext';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppAPI } from './WebAppAPI';
import { Client } from '@pepperi-addons/debug-server/dist';

chai.use(promised);

export class WebAppHomePage extends Page {
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}/HomePage`);
    }

    public Main: Locator = By.css('#mainButton');
    public HomeScreenButtonArr: Locator = By.css('#homepage-footer-btns button');
    public HomeScreenSpesificButton: Locator = By.xpath(`//button[@title='|textToFill|']`);

    public async clickOnBtn(btnTxt: string): Promise<void> {
        await this.browser.ClickByText(this.HomeScreenButtonArr, btnTxt);
        return;
    }
    public async manualResync(client: Client): Promise<void> {
        const webAppAPI = new WebAppAPI(this.browser, client);
        const accessToken = await webAppAPI.getAccessToken();
        let syncResponse = await webAppAPI.getSyncResponse(accessToken);
        expect(syncResponse.Status).to.equal('UpToDate');
        const webAppList = new WebAppList(this.browser);
        const webAppHeader = new WebAppHeader(this.browser);
        //Resync - Going to Accounts and back to Home Page
        console.log('Wait Before Loading Accounts');
        await this.browser.sleep(2002);
        await this.clickOnBtn('Accounts');
        await webAppList.validateListRowElements();
        await this.browser.click(webAppHeader.Home);
        console.log('Wait On Home Page Before Starting New Transaction');
        await this.browser.sleep(5005);
        await this.isSpinnerDone();
        syncResponse = await webAppAPI.getSyncResponse(accessToken);
        expect(syncResponse.Status).to.equal('UpToDate');
        return;
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
    public async initiateSalesActivity(nameOfATD?: string, nameOfAccount?: string): Promise<void> {
        //Start New Workflow
        if (nameOfATD) {
            await this.clickOnBtn(nameOfATD);
        } else {
            await this.click(this.Main);
        }

        //Get to Items
        const webAppList = new WebAppList(this.browser);
        try {
            if (nameOfAccount) await webAppList.clickOnFromListRowWebElementByName(nameOfAccount);
            else await webAppList.clickOnFromListRowWebElement();
            const webAppTopBar = new WebAppTopBar(this.browser);
            await webAppTopBar.click(webAppTopBar.DoneBtn);
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

    public async validateATDIsApearingOnHomeScreen(ATDname: string): Promise<void> {
        const specificATDInjectedBtn = this.HomeScreenSpesificButton.valueOf()
            ['value'].slice()
            .replace('|textToFill|', ATDname);
        await this.browser.untilIsVisible(By.xpath(specificATDInjectedBtn), 5000);
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
