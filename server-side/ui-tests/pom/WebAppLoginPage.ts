import { Browser } from '../utilities/browser';
import { Page } from './base/Page';
import config from '../../config';
import { By, Locator } from 'selenium-webdriver';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHeader, WebAppHomePage } from './index';

chai.use(promised);

export class WebAppLoginPage extends Page {
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public Email: Locator = By.css('#email');
    public Password: Locator = By.css('input[type="password"]');
    public Next: Locator = By.css('#nextBtn');
    public LoginBtn: Locator = By.css('#loginBtn');

    /**
     * This function should be used after nevigation to LoginPage was validate
     */
    public async signIn(email: string, password: string): Promise<void> {
        try {
            await this.browser.sendKeys(this.Email, email);
        } catch (error) {
            console.log(`Login page not loaded, attempting again before failing the test, Error was: ${error}`);
            await this.browser.clearCookies(config.baseUrl.replace('app', 'idp'));
            this.browser.sleep(4004);
            await this.browser.sendKeys(this.Email, email);
        }
        await this.browser.click(this.Next);

        console.log('Wait For Password Page After Email Page');
        await this.browser.sleep(500);
        await this.browser.sendKeys(this.Password, password);
        await this.browser.click(this.LoginBtn);
        return;
    }

    /**
     * This function will navigate to login page and login to home page
     * @returns A new instance of {@link WebAppHomePage}.
     */
    public async login(email: string, password: string): Promise<WebAppHomePage> {
        await this.navigate();
        await this.signIn(email, password);
        const webAppHeader = new WebAppHeader(this.browser);
        await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo, 90000)).eventually.to.be.true;
        return new WebAppHomePage(this.browser);
    }

    public async loginDeepLink(url: string, email: string, password: string): Promise<void> {
        await this.browser.navigate(url);
        await this.signIn(email, password);
        const webAppHeader = new WebAppHeader(this.browser);
        await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo, 30000)).eventually.to.be.true;
        return;
    }
}
