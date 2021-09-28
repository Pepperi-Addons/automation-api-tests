import { Locator } from 'selenium-webdriver';
import { Browser } from '../../utilities/browser';

export abstract class Page {
    private url: string;

    protected setUrl(url: string) {
        this.url = url;
    }

    public async navigate(): Promise<void> {
        return await this.browser.navigate(this.url);
    }

    public async click(selector: Locator, index = 0): Promise<void> {
        return await this.browser.click(selector, index);
    }

    public async sendKeys(selector: Locator, keys: string | number, index = 0): Promise<void> {
        return await this.browser.sendKeys(selector, keys, index);
    }

    public async untilIsVisible(selector: Locator, waitUntil = 30000): Promise<boolean> {
        return await this.browser.untilIsVisible(selector, waitUntil);
    }

    public constructor(protected browser: Browser, url: string) {
        this.url = url;
    }
}
