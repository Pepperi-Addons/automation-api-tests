import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Locator, By } from 'selenium-webdriver';

export class WebAppHomePage extends Page {
    constructor(browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public Main: Locator = By.css('#mainButton');

    public HomeScreenButtonArr: Locator = By.css('#homepage-footer-btns button');

    public async clickOnBtn(btnTxt: string) {
        const buttonsArr = await this.browser.findElements(this.HomeScreenButtonArr);
        for (let index = 0; index < buttonsArr.length; index++) {
            const element = buttonsArr[index];
            if ((await element.getText()) == btnTxt) {
                element.click();
            }
        }
    }
}
