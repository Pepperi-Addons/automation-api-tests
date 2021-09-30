import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Locator, By } from 'selenium-webdriver';

export class WebAppDialog extends Page {
    constructor(browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public Dialog: Locator = By.css('pep-dialog');
    public Title: Locator = By.css('pep-dialog .dialog-title');
    public Content: Locator = By.css('pep-dialog-content');
    public ButtonArr: Locator = By.css('pep-dialog button');

    public async selectDialogBoxBeforeNewOrder(buttonText = 'Yes'): Promise<void> {
        //Click to dismiss if dialog box found
        await this.browser.findElements(this.ButtonArr, 5000, 6).then(
            async (res) => {
                for (let i = 0; i < res.length; i++) {
                    if ((await res[i].getText()).trim() == buttonText) {
                        res[i].click();
                    }
                }
            },
            () => {
                console.log(`Element ${this.ButtonArr.toString()} not found`);
            },
        );
        return;
    }

    public async selectDialogBox(buttonText: string): Promise<void> {
        //Click to dismiss if dialog box found
        await this.browser.findElements(this.ButtonArr, 5000, 6).then(
            async (res) => {
                for (let i = 0; i < res.length; i++) {
                    if ((await res[i].getText()).trim() == buttonText) {
                        res[i].click();
                    }
                }
            },
            () => {
                console.log(`Element ${this.ButtonArr.toString()} not found`);
            },
        );
        return;
    }
}
