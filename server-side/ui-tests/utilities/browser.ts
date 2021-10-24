import 'chromedriver';
import { Builder, ThenableWebDriver, WebElement, until, Locator } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

export class Browser {
    private driver: ThenableWebDriver;
    private options: chrome.Options;
    private TIMEOUT = 15000;
    public constructor(private browserName: string) {
        this.options = new chrome.Options();
        if (process.env.npm_config_chrome_headless == 'true') {
            this.options.addArguments('--headless');
            this.options.addArguments('--window-size=1920,1080');
        }
        this.options.addArguments('--disable-gpu');
        this.options.addArguments(' --disable-software-rasterizer');
        this.options.excludeSwitches('enable-logging');
        this.options.setLoggingPrefs({
            browser: 'ALL',
            driver: 'ALL',
            performance: 'ALL',
        });

        this.driver = new Builder().forBrowser(browserName).withCapabilities(this.options).build();
        this.driver.manage().window().maximize();
        this.driver.manage().setTimeouts({ implicit: this.TIMEOUT, pageLoad: this.TIMEOUT, script: this.TIMEOUT });
    }

    public async getCurrentUrl(): Promise<string> {
        return await this.driver.getCurrentUrl();
    }

    public async navigate(url: string): Promise<void> {
        return await this.driver.navigate().to(url);
    }

    public async switchTo(iframeLocator: Locator): Promise<void> {
        let iframe = await this.findElement(iframeLocator);
        console.log(iframe);
        await this.driver
            .switchTo()
            .frame(iframe)
            .then(
                (res) => res,
                async (error) => {
                    console.log(`Iframe Error: ${error}, Try again to get the Iframe`);
                    debugger;
                    this.sleep(4000);
                    iframe = await this.findElement(iframeLocator);
                    console.log(iframe);
                    await this.driver.switchTo().frame(iframe);
                },
            );
        return;
    }

    public async switchToDefaultContent(): Promise<void> {
        return await this.driver.switchTo().defaultContent();
    }

    public async click(selector: Locator, index = 0, waitUntil = 15000): Promise<void> {
        try {
            await (await this.findElements(selector, waitUntil))[index].click();
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'StaleElementReferenceError') {
                } else if (
                    error.name === 'ElementClickInterceptedError' ||
                    error.name === 'TypeError' ||
                    error.name === 'JavascriptError'
                ) {
                    await this.driver.executeScript(
                        `document.querySelectorAll("${selector['value']}")[${index}].click();`,
                    );
                } else {
                    throw error;
                }
            } else {
                throw error;
            }
        }
        return;
    }

    public async sendKeys(selector: Locator, keys: string | number, index = 0): Promise<void> {
        try {
            await (await this.findElements(selector))[index].clear();
            await (await this.findElements(selector))[index].sendKeys(keys);
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'StaleElementReferenceError') {
                } else if (
                    error.name === 'ElementClickInterceptedError' ||
                    error.name === 'TypeError' ||
                    error.name === 'JavascriptError'
                ) {
                    await this.driver.executeScript(
                        `document.querySelectorAll("${selector['value']}")[${index}].value='${keys}';`,
                    );
                } else {
                    throw error;
                }
            } else {
                throw error;
            }
        }
        return;
    }

    public async findElement(selector: Locator, waitUntil = 15000): Promise<WebElement> {
        return await this.findElements(selector, waitUntil).then((webElement) =>
            webElement ? webElement[0] : webElement,
        );
    }

    public async findElements(selector: Locator, waitUntil = 15000): Promise<WebElement[]> {
        await this.driver.manage().setTimeouts({ implicit: waitUntil, pageLoad: this.TIMEOUT, script: this.TIMEOUT });
        let isElVisible = false;
        const elArr = await this.driver.wait(until.elementsLocated(selector), waitUntil).then(
            (webElement) => webElement,
            (error) => {
                console.log(error.message);
            },
        );
        if (elArr && elArr[0]) {
            isElVisible = await this.driver.wait(until.elementIsVisible(elArr[0]), waitUntil).then(
                async (res) => {
                    return await res.isDisplayed();
                },
                (error) => {
                    if (error.name === 'StaleElementReferenceError' || error.name === 'TimeoutError') {
                        return false;
                    } else {
                        throw new Error(`Element.isDisplayed throw error: ${error}`);
                    }
                },
            );
        } else {
            isElVisible = false;
        }
        await this.driver
            .manage()
            .setTimeouts({ implicit: this.TIMEOUT, pageLoad: this.TIMEOUT, script: this.TIMEOUT });
        if (elArr === undefined) {
            throw new Error(
                `After wait time of: ${waitUntil}, for selector of ${selector['value']}, The test must end, The element is: ${elArr}`,
            );
        }
        if (isElVisible === false) {
            throw new Error(
                `After wait time of: ${waitUntil}, for selector of ${selector['value']}, The test must end, The element is not visible`,
            );
        }
        return elArr;
    }

    public async untilIsVisible(selector: Locator, waitUntil = 15000): Promise<boolean> {
        if ((await this.findElement(selector, waitUntil)) === undefined) {
            return false;
        }
        return true;
    }

    public saveScreenshots() {
        return this.driver.takeScreenshot();
    }

    public sleep(ms: number) {
        console.debug(`%cSleep: ${ms} milliseconds`, 'color: #f7df1e');
        const start = new Date().getTime(),
            expire = start + ms;
        while (new Date().getTime() < expire) {}
        return;
    }

    public async clearCookies(url?: string): Promise<void> {
        if (url) {
            const currentUrl = await this.driver.getCurrentUrl();
            await this.navigate(url);
            await this.driver.manage().deleteAllCookies();
            await this.navigate(currentUrl);
        } else {
            await this.driver.manage().deleteAllCookies();
        }
        return;
    }

    public async getConsoleLogs(): Promise<string[]> {
        const logsArr: string[] = [];
        const logsObj = await this.driver.manage().logs().get('browser');
        for (const key in logsObj) {
            if (logsObj[key].level.name != 'WARNING') {
                const logLevelName = logsObj[key].level.name;
                const logMessage = logsObj[key].message;
                logsArr.push(`${logLevelName}: ${logMessage}`);
            }
        }
        return logsArr;
    }

    public async close(): Promise<void> {
        return await this.driver.close();
    }

    public async quit(): Promise<void> {
        return await this.driver.quit();
    }
}
