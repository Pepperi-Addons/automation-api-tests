import { Browser } from '../../utilities/browser';
import { Locator, By, WebElement } from 'selenium-webdriver';
import addContext from 'mochawesome/addContext';
import fs from 'fs';
import path from 'path';
import { ConsoleColors } from '../../../services/general.service';

export abstract class Page {
    private url: string;
    protected browser: Browser;

    public constructor(browser: Browser, url: string) {
        this.url = url;
        this.browser = browser;
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
        console.log('%cVerify Spinner Status', ConsoleColors.PageMessage);
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

    /**
     *
     * @param that Should be the "this" of the mocha test, this will help connect data from this function to test reports
     */
    public async collectEndTestData(that): Promise<void> {
        if (that.currentTest.state != 'passed') {
            console.log('%cTest Failed', ConsoleColors.Error);
            const imagePath = `${__dirname.split('server-side')[0]}server-side\\api-tests\\test-data\\Error_Image.jpg`;
            const file = fs.readFileSync(path.resolve(imagePath));
            let base64Image = file.toString('base64');
            let url = 'Error In Getting URL';
            let consoleLogs = ['Error In Console Logs'];
            try {
                base64Image = await this.browser.saveScreenshots();
            } catch (error) {
                console.log(`%cError in collectEndTestData saveScreenshots: ${error}`, ConsoleColors.Error);
            }
            try {
                url = await this.browser.getCurrentUrl();
            } catch (error) {
                console.log(`%cError in collectEndTestData getCurrentUrl: ${error}`, ConsoleColors.Error);
            }
            try {
                //Wait for all the logs to be printed (this usually take more then 3 seconds)
                this.browser.sleep(6006);
                consoleLogs = await this.browser.getConsoleLogs();
            } catch (error) {
                console.log(`%cError in collectEndTestData getConsoleLogs: ${error}`, ConsoleColors.Error);
            }
            addContext(that, {
                title: 'URL',
                value: url,
            });
            addContext(that, {
                title: `Image`,
                value: 'data:image/png;base64,' + base64Image,
            });
            addContext(that, {
                title: 'Console Logs',
                value: consoleLogs,
            });
        } else if (that.currentTest.state == 'passed') {
            console.log('%cTest Passed', ConsoleColors.Success);
        } else {
            console.log(`%cTest Ended With State: ${that.currentTest.state}`, ConsoleColors.Information);
        }
        return;
    }
}
