import { Browser } from '../../utilities/browser';
import { Page } from './base/Page';
import config from '../../../config';
import { By } from 'selenium-webdriver';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHeader, WebAppHomePage } from '../index';

chai.use(promised);

export class WebAppLoginPage extends Page {
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public Email: By = By.css('#email');
    public Password: By = By.css('input[type="password"]');
    public Next: By = By.css('#nextBtn');
    public LoginBtn: By = By.css('#loginBtn');
    public UserBtn: By = By.css('[data-qa="systemAvatar"]');
    public signOutBtn: By = By.id('btnSignOut');

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
    public async loginWithImage(email: string, password: string): Promise<WebAppHomePage> {
        await this.navigate();
        await this.signIn(email, password);
        const webAppHeader = new WebAppHeader(this.browser);
        await expect(this.untilIsVisible(webAppHeader.CompanyLogo, 90000)).eventually.to.be.true;
        return new WebAppHomePage(this.browser);
    }

    public async login(email: string, password: string): Promise<WebAppHomePage> {
        await this.navigate();
        await this.signIn(email, password);
        const homePage = new WebAppHomePage(this.browser);
        await expect(this.untilIsVisible(homePage.MainHomePageBtn, 90000)).eventually.to.be.true;
        console.log('Home Button Found -- HomePage Is Loaded');
        return new WebAppHomePage(this.browser);
    }

    public async longLoginForBuyer(email: string, password: string): Promise<WebAppHomePage> {
        await this.navigate();
        await this.signIn(email, password);
        const homePage = new WebAppHomePage(this.browser);
        await expect(this.untilIsVisible(homePage.MainHomePageBtn, 1000 * 400)).eventually.to.be.true;
        console.log('Home Button Found -- HomePage Is Loaded');
        return new WebAppHomePage(this.browser);
    }

    public async longLoginForRep(email: string, password: string): Promise<WebAppHomePage> {
        await this.navigate();
        await this.signIn(email, password);
        const homePage = new WebAppHomePage(this.browser);
        await expect(this.untilIsVisible(homePage.MainHomePageBtn, 1000 * 120)).eventually.to.be.true;
        console.log('Home Button Found -- HomePage Is Loaded');
        return new WebAppHomePage(this.browser);
    }

    public async loginDeepLink(url: string, email: string, password: string): Promise<void> {
        await this.browser.navigate(url);
        await this.signIn(email, password);
        const webAppHeader = new WebAppHeader(this.browser);
        await expect(this.untilIsVisible(webAppHeader.CompanyLogo, 30000)).eventually.to.be.true;
        return;
    }

    public async logout(): Promise<void> {
        await this.browser.click(this.UserBtn);
        await expect(this.untilIsVisible(this.signOutBtn, 50000)).eventually.to.be.true;
        await this.browser.click(this.signOutBtn);
        await expect(this.untilIsVisible(this.Next, 90000)).eventually.to.be.true;
        console.log('got to IDP page');
    }
}
