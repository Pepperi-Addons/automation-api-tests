import { Browser } from '../../utilities/browser';
import { By } from 'selenium-webdriver';
import { Page } from './base/Page';
import { expect } from 'chai';

export class IpaasLoginPage extends Page {
    constructor(browser: Browser) {
        super(browser, 'https://integration.pepperi.com/mgr');
    }

    public PepperiBrandImg: By = By.xpath(
        `//img[@src="https://storage.pepperi.com/PepperiBranding/Square-Icon/Pepperi-logo-green.png"]`,
    );
    public MainHeadline: By = By.xpath(`//h2[contains(text(),"Pepperi iPaaS")]`);
    public NeutralElement: By = By.xpath(`//div[@id="mainWrapper"]`);
    public EmailInput: By = By.xpath(`//input[@id="UserName"]`);
    public PasswordInput: By = By.xpath(`//input[@id="Password"]`);
    public LoginButton: By = By.xpath(`//input[@type="submit"][@value="Login"]`);
    public PostLoginIndicationHeadline: By = By.xpath(
        `//h1[contains(@class,"mainHeader")][contains(text(),"dashboard")]`,
    );

    public async navigateToLoginPage(): Promise<void> {
        return await this.browser.navigate(this.url);
    }

    public async performLogin(email: string, pass: string) {
        try {
            await this.browser.untilIsVisible(this.PepperiBrandImg);
            await this.browser.untilIsVisible(this.MainHeadline);
            const emailInput = await this.browser.findElement(this.EmailInput);
            const passwordInput = await this.browser.findElement(this.PasswordInput);
            await emailInput.clear();
            this.browser.sleep(0.1 * 1000);
            await emailInput.sendKeys(email + '\n');
            this.browser.sleep(0.5 * 1000);
            await this.browser.click(this.NeutralElement);
            this.browser.sleep(0.1 * 1000);
            await passwordInput.clear();
            this.browser.sleep(0.1 * 1000);
            await passwordInput.sendKeys(pass + '\n');
            this.browser.sleep(0.5 * 1000);
            await this.browser.click(this.NeutralElement);
            this.browser.sleep(0.1 * 1000);
            await this.browser.click(this.LoginButton);
            this.browser.sleep(0.1 * 1000);
        } catch (error) {
            const theError = error as Error;
            expect(theError.message).to.contain('After wait time of: 15000, for selector');
        }
    }
}
