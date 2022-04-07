import { Browser } from '../utilities/browser';
import { Page } from './Pages/base/Page';
import config from '../../config';
import { WebAppList, WebAppTopBar, WebAppDialog } from './index';
import { Key } from 'selenium-webdriver';
import addContext from 'mochawesome/addContext';

export class WebAppTransaction extends Page {
    table: string[][] = [];
    constructor(protected browser: Browser, uuid: string) {
        super(browser, `${config.baseUrl}/transactions/scope_items/${uuid}`);
    }

    /**
     *
     * @param that Should be the "this" of the mocha test, this will help connect data from this function to test reports
     * @param itemExternalID ExternalID Of the item to add to cart
     * @param quantity Quantity Of the item to add to cart (Select -1 for buttons that open order)
     */
    public async addItemToCart(that: any, itemExternalID: string, quantity: number, addScreenshots = false) {
        //Adding items to cart
        const webAppList = new WebAppList(this.browser);
        const webAppTopBar = new WebAppTopBar(this.browser);

        await webAppList.sendKeys(webAppTopBar.SearchFieldInput, itemExternalID + Key.ENTER);

        console.log('Wait for item list to refresh after search');
        this.browser.sleep(1000);
        await webAppList.isSpinnerDone();
        await webAppList.validateCardListElements();

        if (quantity == -1) {
            //Open Order
            await webAppList.clickOnCartRemoveButtonByIndex(0);
        } else {
            //Change Quantity
            await webAppList.sendKysToInputListRowWebElement(0, quantity);
        }

        console.log('Wait for item list to refresh in case of promotion changes');
        this.browser.sleep(2000); //Wait for promotion to change the order

        await webAppList.isSpinnerDone();

        if (addScreenshots) {
            const base64Image = await this.browser.saveScreenshots();
            addContext(that, {
                title: `Image of cart item: ExternalID: ${itemExternalID}, Quantity: ${quantity}`,
                value: 'data:image/png;base64,' + base64Image,
            });
        }
    }

    /**
     *
     * @param that Should be the "this" of the mocha test, this will help connect data from this function to test reports
     * @param itemExternalID ExternalID Of the item to add to cart
     * @param quantity Quantity Of the item to add to cart
     */
    public async changeItemInCart(that: any, quantity: number, addScreenshots = false) {
        //Adding items to cart
        const webAppList = new WebAppList(this.browser);
        await webAppList.sendKysToInputListRowWebElement(0, quantity);

        const webAppDialog = new WebAppDialog(this.browser);
        await webAppDialog.selectDialogBox('Cancel');

        console.log('Wait for item list to refresh after promotion changes');
        this.browser.sleep(1000); //Wait for promotion to change the order
        await webAppDialog.isSpinnerDone();
        await webAppList.validateCardListElements();

        if (addScreenshots) {
            const base64Image = await this.browser.saveScreenshots();
            addContext(that, {
                title: `Image of cart item: Quantity: ${quantity}`,
                value: 'data:image/png;base64,' + base64Image,
            });
        }
    }
}
