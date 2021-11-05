import { Browser } from '../../utilities/browser';
import { Locator, By, WebElement } from 'selenium-webdriver';

export abstract class Page {
    private url: string;
    public constructor(protected browser: Browser, url: string) {
        this.url = url;
    }

    public PepperiHiddenLoadingSpinner: Locator = By.css('#loadingSpinnerModal[hidden]');
    public HtmlBody: Locator = By.css('html body');

    protected setUrl(url: string) {
        this.url = url;
    }

    public async navigate(): Promise<void> {
        return await this.browser.navigate(this.url);
    }

    public async click(selector: Locator, index = 0, waitUntil = 15000): Promise<void> {
        return await this.browser.click(selector, index, waitUntil);
    }

    public async sendKeys(selector: Locator, keys: string | number, index = 0): Promise<void> {
        return await this.browser.sendKeys(selector, keys, index);
    }

    public async untilIsVisible(selector: Locator, waitUntil = 15000): Promise<boolean> {
        return await this.browser.untilIsVisible(selector, waitUntil);
    }

    public async isSpinnerDone(): Promise<boolean> {
        const isHidden = [false, false];
        console.log('Verify Spinner Status');
        let loadingCounter = 0;
        do {
            const hiddenEl_1 = await this.browser.findElement(this.PepperiHiddenLoadingSpinner, 45000, false);
            if (hiddenEl_1 instanceof WebElement) {
                isHidden[0] = true;
            }
            this.browser.sleep(200 + loadingCounter);
            const hiddenEl_2 = await this.browser.findElement(this.PepperiHiddenLoadingSpinner, 45000, false);
            if (hiddenEl_2 instanceof WebElement) {
                isHidden[1] = true;
            }
            loadingCounter++;
        } while (!isHidden[0] || !isHidden[1]);
        return true;
    }
}
