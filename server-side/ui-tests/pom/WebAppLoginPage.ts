import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { By, Locator } from 'selenium-webdriver';

export class WebAppLoginPage extends Page {
    constructor(browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public Email: Locator = By.css('#email');
    public Password: Locator = By.css('input[type="password"]');
    public Next: Locator = By.css('#nextBtn');
    public LoginBtn: Locator = By.css('#loginBtn');

    public async signInAs(email: string, password: string) {
        try {
            await this.browser.sendKeys(this.Email, email);
        } catch (error) {
            console.log(`Login page not loaded, attempting again before failing the test, Error was: ${error}`);
            const thisURL = await this.browser.getCurrentUrl();
            await this.browser.clearCookies((thisURL.split('com/')[0] + 'com/').replace('app', 'idp'));
            this.browser.sleep(4004);
            await this.browser.sendKeys(this.Email, email);
        }
        await this.browser.click(this.Next);
        await this.browser.sendKeys(this.Password, password);
        await this.browser.click(this.LoginBtn);
    }
}
