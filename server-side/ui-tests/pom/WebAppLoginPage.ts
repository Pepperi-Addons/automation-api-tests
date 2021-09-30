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
        await this.browser.clearCookies();
        await this.browser.sendKeys(this.Email, email);
        await this.browser.click(this.Next);
        await this.browser.sendKeys(this.Password, password);
        await this.browser.click(this.LoginBtn);
    }
}
