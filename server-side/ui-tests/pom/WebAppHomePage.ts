import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Locator, By } from 'selenium-webdriver';
import { WebAppDialog, WebAppHeader, WebAppList } from './index';
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

    public async clickOnBtn(btnTxt: string) {
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
    public async manualResync() {
        const webAppList = new WebAppList(this.browser);
        const webAppHeader = new WebAppHeader(this.browser);

        //Resync - Going to Accounts and back to Home Page
        console.log('Wait Before Loading Accounts');
        await this.browser.sleep(2002);
        await this.clickOnBtn('Accounts');
        await this.isSpinnerDone();
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
    public async isDialogOnHomePAge(that) {
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
}
