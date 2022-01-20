import { Browser } from '../../utilities/browser';
import { Locator, By, WebElement } from 'selenium-webdriver';
import addContext from 'mochawesome/addContext';
import fs from 'fs';
import path from 'path';

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

    /**
     *
     * @param that Should be the "this" of the mocha test, this will help connect data from this function to test reports
     */
    public async collectEndTestData(that): Promise<void> {
        if (that.currentTest.state != 'passed') {
            console.log('Test Failed');
            const imagePath = `${__dirname.split('server-side')[0]}server-side\\api-tests\\test-data\\Error_Image.jpg`;

            const file = fs.readFileSync(path.resolve(imagePath));
            let base64Image = file.toString('base64');
            let url = 'Error In Getting URL';
            let consoleLogs = ['Error In Console Logs'];
            try {
                base64Image = await this.browser.saveScreenshots();
            } catch (error) {
                console.log(`Error in collectEndTestData saveScreenshots: ${error}`);
            }
            try {
                url = await this.browser.getCurrentUrl();
            } catch (error) {
                console.log(`Error in collectEndTestData getCurrentUrl: ${error}`);
            }
            try {
                //Wait for all the logs to be printed (this usually take more then 3 seconds)
                this.browser.sleep(6006);
                consoleLogs = await this.browser.getConsoleLogs();
            } catch (error) {
                console.log(`Error in collectEndTestData getConsoleLogs: ${error}`);
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
        }
        return;
    }
}
