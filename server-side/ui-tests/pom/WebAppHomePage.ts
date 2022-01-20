import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Locator, By, WebElement } from 'selenium-webdriver';
import { WebAppDialog, WebAppHeader, WebAppList, WebAppTopBar } from './index';
import addContext from 'mochawesome/addContext';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';

chai.use(promised);

export class WebAppHomePage extends Page {
    constructor(browser: Browser) {
        super(browser, `${config.baseUrl}/HomePage`);
    }

    public Main: Locator = By.css('#mainButton');
    public HomeScreenButtonArr: Locator = By.css('#homepage-footer-btns button');

    public async clickOnBtn(btnTxt: string): Promise<void> {
        const buttonsArr = await this.browser.findElements(this.HomeScreenButtonArr);
        for (let index = 0; index < buttonsArr.length; index++) {
            const element = buttonsArr[index];
            if ((await element.getText()) == btnTxt) {
                await element.click();
                break;
            }
        }
        return;
    }
    public async manualResync(): Promise<void> {
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
                'After wait time of: 5000, for selector of pep-dialog .dialog-title, The test must end',
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
    public async initiateSalesActivity(name?: string): Promise<void> {
        //Start New Workflow
        if (name) {
            await this.clickOnBtn(name);
        } else {
            await this.click(this.Main);
        }

        //Get to Items
        const webAppList = new WebAppList(this.browser);
        try {
            await webAppList.clickOnFromListRowWebElement(); //Accounts
            const webAppTopBar = new WebAppTopBar(this.browser);
            await webAppTopBar.click(webAppTopBar.DoneBtn);
        } catch (error) {
            if (error instanceof Error) {
                if (
                    !error.message.includes(
                        'pep-list .table-row-fieldset, The test must end, The element is: undefined',
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
        this.browser.sleep(1000);

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
        await this.browser.untilIsVisible(By.xpath(`//button[@title='${ATDname}']`), 5000);
    }

    public async initiateUOMActivity(ATDname: string, accountName: string, viewType = 'Medium'): Promise<void> {
        await this.browser.click(By.xpath(`//button[@title='${ATDname}']`));
        await this.browser.sleep(1500);
        await this.browser.untilIsVisible(
            By.xpath("//span[@class='dialog-title ng-star-inserted' and text()=' Select Account  ']"),
            1500,
        );
        await this.browser.click(By.xpath(`//span[@title='${accountName}']/../../../../mat-radio-button`));
        await this.browser.sleep(1500);
        await this.browser.click(By.css("[data-qa='doneButton']"));
        await this.browser.sleep(3500);
        const webAppDialog = new WebAppDialog(this.browser);
        let isPupUP;
        try {
            isPupUP = await (await this.browser.findElement(webAppDialog.Content)).getText();
        } catch (Error) {
            console.log('no popup while opening UOM ATD');
        }
        if (isPupUP) {
            expect(isPupUP).to.equal(
                'You already have an open order which you have previously started. To start a new order anyway click Continue/Yes. To be directed to the open order click Cancel/No.',
            );
            await webAppDialog.selectDialogBox('Yes');
            await this.isSpinnerDone();
        }
        //switch to medium view:
        //1. click on btn to open drop down
        await this.browser.click(By.xpath("//mat-icon[@title='Change View']"));
        await this.browser.sleep(1500);
        //2. pick wanted view
        await this.browser.click(By.xpath(`//span[text()='${viewType}']`));
        await this.isSpinnerDone();
        //validate there are 5 items on screen
        const allItemPresented: WebElement[] = await this.browser.findElements(By.xpath('//fieldset'));
        expect(allItemPresented.length).to.equal(5);
        //validate 4 are UOM items
        const allUOMItemPresented: WebElement[] = await this.browser.findElements(
            By.xpath("//span[@id='TSAAOQMUOM2' and text()='Single']"),
        );
        expect(allUOMItemPresented.length).to.equal(4);
    }
}
