import 'chromedriver';
import { Builder, ThenableWebDriver, WebElement, until, Locator, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import GeneralService, { ConsoleColors } from '../../services/general.service';

export class Browser {
    private driver: ThenableWebDriver;
    private options: chrome.Options;
    private TIMEOUT = 15000;
    private tempGeneralService = new GeneralService({
        AddonUUID: '',
        AddonSecretKey: '',
        BaseURL: '',
        OAuthAccessToken: '',
        AssetsBaseUrl: '',
        Retry: function () {
            return;
        },
    });

    /**
     * Chrome driver should only be initiate by using initiateChrome
     * @param browserName
     */
    private constructor(private browserName: string) {
        this.options = new chrome.Options();
        if (process.env.npm_config_chrome_headless == 'true') {
            this.options.addArguments('--headless');
            this.options.addArguments('--window-size=1920,1080');
        }
        this.options.addArguments('--no-sandbox');
        this.options.addArguments('--disable-gpu');
        this.options.addArguments('--disable-software-rasterizer');
        this.options.excludeSwitches('enable-logging');
        this.options.setLoggingPrefs({
            browser: 'ALL',
            driver: 'ALL',
            performance: 'ALL',
        });
        this.driver = new Builder().forBrowser(browserName).setChromeOptions(this.options).build();
        this.driver.manage().window().maximize();
        this.driver
            .manage()
            .setTimeouts({ implicit: this.TIMEOUT, pageLoad: this.TIMEOUT * 4, script: this.TIMEOUT * 4 });
    }

    /**
     * This is the correct function to use for starting new chrome browser
     * @returns
     */
    public static async initiateChrome(): Promise<Browser> {
        let chromeDriver: Browser;
        let isNevigated = false;
        let maxLoopsCounter = 4;
        do {
            chromeDriver = new Browser('chrome');
            try {
                await chromeDriver.navigate('https://www.google.com');
                isNevigated = true;
            } catch (error) {
                isNevigated = false;
                console.log(`%cError in initiation of Chrome: ${error}`, ConsoleColors.Error);
                await chromeDriver.sleepTimeout(4000);
            }
            maxLoopsCounter--;
        } while (!isNevigated && maxLoopsCounter > 0);
        return chromeDriver;
    }

    public async getCurrentUrl(): Promise<string> {
        return await this.driver.getCurrentUrl();
    }

    public async navigate(url: string): Promise<void> {
        console.log(`%cNevigate To: ${url}`, ConsoleColors.NevigationMessage);
        return await this.driver.navigate().to(url);
    }

    public async switchTo(iframeLocator: Locator): Promise<void> {
        const iframe = await this.findElement(iframeLocator, 45000);
        return await this.driver.switchTo().frame(iframe);
    }

    public async switchToDefaultContent(): Promise<void> {
        return await this.driver.switchTo().defaultContent();
    }

    public async switchToActiveElement(): Promise<WebElement> {
        return await this.driver.switchTo().activeElement();
    }

    public async click(selector: Locator, index = 0, waitUntil = 15000): Promise<void> {
        try {
            await (await this.findElements(selector, waitUntil))[index].click();
            console.log(
                `%cClicked with defult selector: ${selector.valueOf()['value']}, on element with index of: ${index}`,
                ConsoleColors.ClickedMessage,
            );
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'StaleElementReferenceError') {
                } else if (
                    error.name === 'ElementClickInterceptedError' ||
                    error.name === 'TypeError' ||
                    error.name === 'JavascriptError'
                ) {
                    if (selector['using'] == 'xpath') {
                        await this.driver.executeScript(
                            `document.evaluate("${selector['value']}", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(${index}).click();`,
                        );
                        console.log(
                            `%cClicked with xpath selector: ${
                                selector.valueOf()['value']
                            }, on element with index of: ${index}`,
                            ConsoleColors.ClickedMessage,
                        );
                    } else {
                        await this.driver.executeScript(
                            `document.querySelectorAll("${selector['value']}")[${index}].click();`,
                        );
                        console.log(
                            `%cClicked with css selector: ${
                                selector.valueOf()['value']
                            }, on element with index of: ${index}`,
                            ConsoleColors.ClickedMessage,
                        );
                    }
                } else {
                    throw error;
                }
            } else {
                throw error;
            }
        }
        return;
    }

    public async ClickByText(selector: Locator, btnTxt: string) {
        const buttonsArr: WebElement[] = await this.findElements(selector);
        for (let i = 0; i < buttonsArr.length; i++) {
            if ((await buttonsArr[i].getText()) == btnTxt) {
                await this.click(selector, i);
                break;
            }
        }
        return;
    }

    public async sendKeys(selector: Locator, keys: string | number, index = 0, waitUntil = 15000): Promise<void> {
        const isSecret = selector.valueOf()['value'].includes(`input[type="password"]`);
        try {
            await (await this.findElements(selector, waitUntil))[index].clear();
            console.log('Wait after clear, beofre send keys');
            this.sleep(400);
            await (await this.findElements(selector, waitUntil))[index].sendKeys(keys);
            console.log(
                `%cSentKeys with defult selector: ${
                    selector.valueOf()['value']
                }, on element with index of: ${index}, Keys: '${isSecret ? '******' : keys}'`,
                ConsoleColors.SentKeysMessage,
            );
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'StaleElementReferenceError') {
                } else if (
                    error.name === 'ElementClickInterceptedError' ||
                    error.name === 'TypeError' ||
                    error.name === 'JavascriptError' ||
                    error.name === 'InvalidElementStateError' ||
                    (error.name === 'Error' && error.message.includes('textarea'))
                ) {
                    try {
                        const el = await this.driver.findElements(selector);
                        await this.driver.actions().keyDown(Key.CONTROL).sendKeys('a').keyUp(Key.CONTROL).perform();
                        await el[index].sendKeys(keys);
                        console.log(
                            `%cSentKeys with actions and defult selector: ${
                                selector.valueOf()['value']
                            }, on element with index of: ${index}, Keys: '${isSecret ? '******' : keys}'`,
                            ConsoleColors.SentKeysMessage,
                        );
                    } catch (error) {
                        if (selector['using'] == 'xpath') {
                            await this.driver.executeScript(
                                `document.evaluate("${selector['value']}", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(${index}).value='${keys}';`,
                            );
                            console.log(
                                `%cSet value with xpath selector: ${
                                    selector.valueOf()['value']
                                }, on element with index of: ${index}, Keys: '${isSecret ? '******' : keys}'`,
                                ConsoleColors.SentKeysMessage,
                            );
                        } else {
                            await this.driver.executeScript(
                                `document.querySelectorAll("${selector['value']}")[${index}].value='${keys}';`,
                            );
                            console.log(
                                `%cSet value with css selector: ${
                                    selector.valueOf()['value']
                                }, on element with index of: ${index}, Keys: '${isSecret ? '******' : keys}'`,
                                ConsoleColors.SentKeysMessage,
                            );
                        }
                    }
                } else {
                    throw error;
                }
            } else {
                throw error;
            }
        }
        return;
    }

    public async findElement(selector: Locator, waitUntil = 15000, isVisible = true): Promise<WebElement> {
        return await this.findElements(selector, waitUntil, isVisible).then((webElement) =>
            webElement ? webElement[0] : webElement,
        );
    }

    public async findElements(selector: Locator, waitUntil = 15000, isVisible = true): Promise<WebElement[]> {
        await this.driver.manage().setTimeouts({ implicit: waitUntil });
        let isElVisible = false;
        const elArr = await this.driver.wait(until.elementsLocated(selector), waitUntil).then(
            (webElement) => webElement,
            (error) => {
                console.log(error.message);
            },
        );
        if (isVisible && elArr && elArr[0]) {
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
        } else if (!isVisible) {
            isElVisible = true;
        } else {
            isElVisible = false;
        }
        await this.driver.manage().setTimeouts({ implicit: this.TIMEOUT });
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

    /**
     * This is Async/Non-Blocking sleep
     * @param ms
     * @returns
     */
    public sleepTimeout(ms: number) {
        return this.tempGeneralService.sleepTimeout(ms);
    }

    /**
     * This is Synchronic/Blocking sleep
     * This should be used in most cases
     * @param ms
     * @returns
     */
    public sleep(ms: number) {
        this.tempGeneralService.sleep(ms);
    }

    public async clearCookies(url?: string): Promise<void> {
        if (url) {
            await this.navigate(url);
            await this.driver.manage().deleteAllCookies();
            await this.navigate(url);
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
                const logLevelName = logsObj[key].level.name == 'SEVERE' ? 'ERROR' : logsObj[key].level.name;
                const logMessage = logsObj[key].message;
                logsArr.push(`${logLevelName}: ${logMessage}`);
            }
        }
        return logsArr;
    }

    public async getPerformanceLogs(): Promise<any[]> {
        const logsArr: any[] = [];
        const logsObj = await this.driver.manage().logs().get('performance');
        for (let index = 0; index < logsObj.length; index++) {
            if (logsObj[index].message.includes(`"method":"Network.requestWillBeSent"`)) {
                const tempPerformanceObj = JSON.parse(logsObj[index].message);
                delete tempPerformanceObj.webview;
                delete tempPerformanceObj.message.params.frameId;
                delete tempPerformanceObj.message.params.hasUserGesture;
                delete tempPerformanceObj.message.params.initiator;
                delete tempPerformanceObj.message.params.loaderId;
                delete tempPerformanceObj.message.params.requestId;
                delete tempPerformanceObj.message.params.clientSecurityState;
                delete tempPerformanceObj.message.params.connectTiming;
                delete tempPerformanceObj.message.params.request.headers;
                delete tempPerformanceObj.message.params.request.hasPostData;
                delete tempPerformanceObj.message.params.request.initialPriority;
                delete tempPerformanceObj.message.params.request.isSameSite;
                delete tempPerformanceObj.message.params.request.mixedContentType;
                delete tempPerformanceObj.message.params.request.postDataEntries;
                delete tempPerformanceObj.message.params.request.referrerPolicy;

                logsArr.push(tempPerformanceObj);
            } else if (logsObj[index].message.includes(`"method":"Network.responseReceived"`)) {
                const tempPerformanceObj = JSON.parse(logsObj[index].message);
                delete tempPerformanceObj.webview;
                delete tempPerformanceObj.message.params.frameId;
                delete tempPerformanceObj.message.params.hasUserGesture;
                delete tempPerformanceObj.message.params.initiator;
                delete tempPerformanceObj.message.params.loaderId;
                delete tempPerformanceObj.message.params.requestId;
                delete tempPerformanceObj.message.params.response.timing;
                delete tempPerformanceObj.message.params.response.headers;
                delete tempPerformanceObj.message.params.response.connectionId;
                delete tempPerformanceObj.message.params.response.encodedDataLength;
                delete tempPerformanceObj.message.params.response.mimeType;
                delete tempPerformanceObj.message.params.response.protocol;
                delete tempPerformanceObj.message.params.response.remoteIPAddress;
                delete tempPerformanceObj.message.params.response.remotePort;
                delete tempPerformanceObj.message.params.response.responseTime;
                delete tempPerformanceObj.message.params.response.securityState;
                logsArr.push(tempPerformanceObj);
            }
        }
        return logsArr;
    }

    /**
     * closes the child window in focus, the parent window is still open
     * @returns
     */
    public async close(): Promise<void> {
        //This line is needed, to not remove! (this wait to driver before trying to close it)
        const windowTitle = await this.driver.getTitle();
        console.log(`%cClose Window With Title: ${windowTitle}`, ConsoleColors.Success);
        return await this.driver.close();
    }

    /**
     * close all the webdriver instances, so parent window will close
     * @returns
     */
    public async quit(): Promise<void> {
        //This line is needed, to not remove! (this wait to driver before trying to close it)
        try {
            const windowTitle = await this.driver.getTitle();
            console.log(`%cQuit Window With Title: ${windowTitle}`, ConsoleColors.SystemInformation);
        } catch (error) {
            console.log(`%cQuit Window With Title Error: ${error}`, ConsoleColors.Error);
        }

        //Print Driver Info Before Quit
        const driverInfo = await this.driver.getCapabilities();
        const browserName = driverInfo.get('browserName');
        const browserVersion = driverInfo.get('browserVersion');
        const browserInfo = driverInfo.get(browserName);
        console.log(`%cBrowser Name: ${browserName}, Version: ${browserVersion}`, ConsoleColors.SystemInformation);
        console.log(`%cBrowser Info: ${JSON.stringify(browserInfo)}`, ConsoleColors.SystemInformation);

        try {
            await this.driver
                .quit()
                .then(
                    async (res) => {
                        console.log(
                            `%cBrowser Quit Response: ${res === undefined ? 'As Expected' : `Error: ${res}`}`,
                            ConsoleColors.Success,
                        );
                        await this.sleepTimeout(2000);
                        console.log(
                            '%cWaited 2 seconds for browser closing process will be done',
                            ConsoleColors.Success,
                        );
                    },
                    (error) => {
                        console.log(`%cBrowser Quit Error In Response: ${error}`, ConsoleColors.Error);
                    },
                )
                .catch((error) => {
                    console.log(`%cBrowser Quit Error In Catch: ${error}`, ConsoleColors.Error);
                });
        } catch (error) {
            console.log(`%cBrowser Error: ${error}`, ConsoleColors.Error);
        }
        return;
    }
}
