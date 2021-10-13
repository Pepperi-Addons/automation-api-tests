import 'chromedriver';
import { Builder, ThenableWebDriver, WebElement, until, Locator } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

export class Browser {
    private driver: ThenableWebDriver;
    private options: chrome.Options;
    private TIMEOUT = 30000;
    public constructor(private browserName: string) {
        this.options = new chrome.Options();
        if (process.env.npm_config_chrome_headless == 'true') {
            this.options.addArguments('--headless');
            this.options.addArguments('--window-size=1920,1080');
        }
        this.options.addArguments('--disable-gpu');
        this.options.addArguments(' --disable-software-rasterizer');
        this.options.excludeSwitches('enable-logging');
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

    public async click(selector: Locator, index = 0, waitUntil = 20000, maxAttmpts = 6): Promise<void> {
        let allowRetry = false;
        let maxRefreshAllowed = 3;
        do {
            try {
                await (await this.findElements(selector, waitUntil, maxAttmpts))[index].click();
                allowRetry = false;
            } catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'StaleElementReferenceError') {
                        allowRetry = true;
                    } else if (
                        error.name === 'ElementClickInterceptedError' ||
                        error.name === 'TypeError' ||
                        error.name === 'JavascriptError'
                    ) {
                        try {
                            await this.driver.executeScript(
                                `document.querySelectorAll("${selector['value']}")[${index}].click();`,
                            );
                            allowRetry = false;
                        } catch (error) {
                            allowRetry = true;
                            await this.driver.navigate().refresh();
                            //This means that elements removed while scrolling (this is normal behavior of the webapp)
                            this.sleep(15000);
                            try {
                                await this.driver.executeScript(
                                    `document.querySelectorAll("${selector['value']}")[${index}].click();`,
                                );
                                allowRetry = false;
                            } catch (error) {
                                maxRefreshAllowed--;
                                console.log(`Max Refresh Allowed: ${maxRefreshAllowed}`);
                                console.log('This was thrown after refresh: ' + error);
                                if (maxRefreshAllowed <= 0) {
                                    throw new Error(`After few refresh the maxRefreshAllowed is: ${maxRefreshAllowed},
                                    The test must end, Last Error was: ${error}`);
                                }
                            }
                        }
                    } else {
                        throw error;
                    }
                } else {
                    throw error;
                }
            }
        } while (allowRetry);
        return;
    }

    public async sendKeys(selector: Locator, keys: string | number, index = 0): Promise<void> {
        let allowRetry = false;
        let maxRefreshAllowed = 3;
        do {
            try {
                await (await this.findElements(selector))[index].clear();
                await (await this.findElements(selector))[index].sendKeys(keys);
                allowRetry = false;
            } catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'StaleElementReferenceError') {
                        allowRetry = true;
                    } else if (
                        error.name === 'ElementClickInterceptedError' ||
                        error.name === 'TypeError' ||
                        error.name === 'JavascriptError'
                    ) {
                        try {
                            await this.driver.executeScript(
                                `document.querySelectorAll("${selector['value']}")[${index}].value='${keys}';`,
                            );
                            allowRetry = false;
                        } catch (error) {
                            allowRetry = true;
                            await this.driver.navigate().refresh();
                            //This means that elements removed while scrolling (this is normal behavior of the webapp)
                            this.sleep(15000);
                            try {
                                await this.driver.executeScript(
                                    `document.querySelectorAll("${selector['value']}")[${index}].value='${keys}';`,
                                );
                                allowRetry = false;
                            } catch (error) {
                                maxRefreshAllowed--;
                                console.log(`Max Refresh Allowed: ${maxRefreshAllowed}`);
                                console.log('This was thrown after refresh: ' + error);
                                if (maxRefreshAllowed <= 0) {
                                    throw new Error(`After few refresh the maxRefreshAllowed is: ${maxRefreshAllowed},
                                    The test must end, Last Error was: ${error}`);
                                }
                            }
                        }
                    } else {
                        throw error;
                    }
                } else {
                    throw error;
                }
            }
        } while (allowRetry);
        return;
    }

    public async findElement(selector: Locator, waitUntil = 20000, maxAttmpts = 6): Promise<WebElement> {
        return await this.findElements(selector, waitUntil, maxAttmpts).then((webElement) =>
            webElement ? webElement[0] : webElement,
        );
    }

    public async findElements(selector: Locator, waitUntil = 20000, maxAttmpts = 6): Promise<WebElement[]> {
        await this.driver.manage().setTimeouts({ implicit: waitUntil, pageLoad: this.TIMEOUT, script: this.TIMEOUT });
        let elArr;
        let isElVisible = false;
        let loopCounter = maxAttmpts > 20 ? 20 : maxAttmpts;
        do {
            this.sleep(600);
            elArr = await this.driver.wait(until.elementsLocated(selector), waitUntil).then(
                (webElement) => webElement,
                (error) => {
                    console.log(error.message);
                },
            );
            if (elArr && elArr[0]) {
                isElVisible = await elArr[0].isDisplayed().then(
                    (res) => res,
                    (error) => {
                        if (error.name === 'StaleElementReferenceError') {
                            return false;
                        } else {
                            throw new Error(`Element.isDisplayed throw error: ${error}`);
                        }
                    },
                );
            } else {
                isElVisible = false;
            }
            loopCounter--;
        } while (!isElVisible && loopCounter > 0);
        await this.driver
            .manage()
            .setTimeouts({ implicit: this.TIMEOUT, pageLoad: this.TIMEOUT, script: this.TIMEOUT });
        if (elArr === undefined) {
            throw new Error(
                `After few retires the maxAttmpts of: ${maxAttmpts}, Riched: ${loopCounter}, with wait time of: ${waitUntil}, for selector of ${selector}, The test must end, The element is: ${elArr}`,
            );
        }
        if (isElVisible === false) {
            throw new Error(
                `After few retires the maxAttmpts of: ${maxAttmpts}, Riched: ${loopCounter}, with wait time of: ${waitUntil}, for selector of ${selector}, The test must end, The element is not visible`,
            );
        }
        return elArr;
    }

    public async untilIsVisible(selector: Locator, waitUntil = 20000, maxAttmpts = 6): Promise<boolean> {
        if ((await this.findElement(selector, waitUntil, maxAttmpts)) === undefined) {
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

    public async close(): Promise<void> {
        return await this.driver.close();
    }

    public async quit(): Promise<void> {
        return await this.driver.quit();
    }
}
