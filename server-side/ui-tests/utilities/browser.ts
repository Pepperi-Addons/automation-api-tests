import 'chromedriver';
import {
    Builder,
    ThenableWebDriver,
    WebElement,
    until,
    By,
    Key,
    WebElementPromise,
    ILocation,
} from 'selenium-webdriver';
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
        ValidatePermission: async function (policyName: string) {
            console.log(policyName);
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
                await chromeDriver.sleepAsync(4000);
            }
            maxLoopsCounter--;
        } while (!isNevigated && maxLoopsCounter > 0);
        return chromeDriver;
    }

    public async getCurrentUrl(): Promise<string> {
        return await this.driver.getCurrentUrl();
    }

    public async navigate(url: string): Promise<void> {
        console.log(`%cNavigate To: ${url}`, ConsoleColors.NevigationMessage);
        return await this.driver.navigate().to(url);
    }

    public async refresh(): Promise<void> {
        console.log(`%cRefreshing page`, ConsoleColors.NevigationMessage);
        return await this.driver.navigate().refresh();
    }

    public async switchTo(iframeLocator: By): Promise<void> {
        const iframe = await this.findElement(iframeLocator, 45000);
        return await this.driver.switchTo().frame(iframe);
    }

    public async switchToDefaultContent(): Promise<void> {
        return await this.driver.switchTo().defaultContent();
    }

    public async switchToActiveElement(): Promise<WebElement> {
        return await this.driver.switchTo().activeElement();
    }

    //TODO: 19/04 By Oren:
    //Try with this code:
    // const draggable = await driver.findElement(By.css('[title="Chart"]'));
    // const droppable = await driver.findElement(By.css('.cdk-drop-list.section-column.horizontal.ng-star-inserted'));
    // await driver.dragAndDrop(draggable, droppable);
    public async dragAndDrop(draggable: WebElement, droppable?: WebElement, x?: number, y?: number) {
        return await this.driver
            .actions()
            .dragAndDrop(draggable, droppable ? droppable : { x, y })
            .perform();
    }

    //TODO: 19/04 By Oren:
    //Try with this code:
    // const draggable = await driver.findElement(By.css('[title="Chart"]'));
    // const droppable = await driver.findElement(By.css('.cdk-drop-list.section-column.horizontal.ng-star-inserted'));
    // const draggablePoint = await draggable.getRect();
    // const droppablePoint = await droppable.getRect();
    // await driver.dragAndDropByLocation(
    //     { x: draggablePoint.x + draggablePoint.width / 2, y: draggablePoint.y + draggablePoint.height / 2 },
    //     { x: droppablePoint.x + droppablePoint.width / 2, y: droppablePoint.y + droppablePoint.height / 2 }
    // );
    public async dragAndDropByLocation(draggablePoint: ILocation, droppablePoint: ILocation) {
        console.log(draggablePoint, droppablePoint);
        await this.driver.actions().move(draggablePoint).press().move(droppablePoint).release().perform();
        return;
    }

    //TODO: 19/04 By Oren:
    //Try with this code:
    // const draggable = await driver.findElement(By.css('[title="Chart"]'));
    // const droppable = await driver.findElement(By.css('.cdk-drop-list.section-column.horizontal.ng-star-inserted'));
    // const droppablePoint = await droppable.getRect();
    // await driver.dragAndDropByJS(draggable, droppablePoint)
    public async dragAndDropByJS(draggable: WebElement, droppablePoint: ILocation) {
        await this.driver.executeScript(
            `function simulate(f, c, d, e) {
                var b, a = null;
                for (b in eventMatchers)
                    if (eventMatchers[b].test(c)) {
                        a = b;
                        break
                    } if (!a) return !1;
                document.createEvent ? (b = document.createEvent(a), a == "HTMLEvents" ? b.initEvent(c, !0, !0) : b.initMouseEvent(c, !0, !0, document.defaultView, 0, d, e, d, e, !1, !1, !1, !1, 0, null), f.dispatchEvent(b)) : (a = document.createEventObject(), a.detail = 0, a.screenX = d, a.screenY = e, a.clientX = d, a.clientY = e, a.ctrlKey = !1, a.altKey = !1, a.shiftKey = !1, a.metaKey = !1, a.button = 1, f.fireEvent("on" + c, a));
                return !0
            }
            var eventMatchers = {
                HTMLEvents: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
                MouseEvents: /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
            };
            simulate(arguments[0],"mousedown",0,0);
            simulate(arguments[0],"mousemove",arguments[1],arguments[2]);
            simulate(arguments[0],"mouseup",arguments[1],arguments[2]);`,
            draggable,
            droppablePoint.x,
            droppablePoint.y,
        );
    }

    public async executeCommandAdync(command: string, webElem: WebElement) {
        await this.driver.executeScript(command, webElem);
    }

    public async click(selector: By, index = 0, waitUntil = 15000): Promise<void> {
        try {
            await (await this.findElements(selector, waitUntil))[index].click();
            console.log(
                `%cClicked with defult selector: '${selector.valueOf()['value']}', on element with index of: ${index}`,
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
                            `%cClicked with xpath selector: '${
                                selector.valueOf()['value']
                            }', on element with index of: ${index}`,
                            ConsoleColors.ClickedMessage,
                        );
                    } else {
                        await this.driver.executeScript(
                            `document.querySelectorAll("${selector['value']}")[${index}].click();`,
                        );
                        console.log(
                            `%cClicked with css selector: '${
                                selector.valueOf()['value']
                            }', on element with index of: ${index}`,
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

    public async ClickByText(selector: By, btnTxt: string, waitUntil = 1500) {
        const buttonsArr: WebElement[] = await this.findElements(selector, waitUntil);
        for (let i = 0; i < buttonsArr.length; i++) {
            const elementsText = (await buttonsArr[i].getText()).trim();
            if (elementsText.includes(btnTxt)) {
                await this.click(selector, i, waitUntil);
                return;
            }
        }
        console.log(`element with selector: '${selector}' and text:'${btnTxt}' isn't found`);
        return;
    }

    /**
     * Used for clicking on element, sending keys to an element and clicking after on other element, waiting with given function
     * @param clickOnLocator Locator of element to click on
     * @param sendToLocator Locator of element to send the keys to
     * @param txtToSend The keys to send
     * @param afterClickLocator Optional locator for elemnt to click on after the keys sent
     * @param waitFunction Function to call to wait until
     * @param that This value of the class in which the wait function is found
     */
    public async activateTextInputFieldAndWaitUntillFunction(
        clickOnLocator: By,
        sendToLocator: By,
        txtToSend: string,
        afterClickLocator?: By,
        waitFunction?: () => Promise<boolean>,
        that?: any,
    ) {
        await this.click(clickOnLocator);
        await this.sendKeys(sendToLocator, txtToSend);
        this.sleep(1000);
        if (afterClickLocator) await this.click(afterClickLocator);
        if (waitFunction && that) await waitFunction.call(that);
    }

    public async sendKeys(selector: By, keys: string | number, index = 0, waitUntil = 15000): Promise<void> {
        const isSecret = selector.valueOf()['value'].includes(`input[type="password"]`);
        try {
            await (await this.findElements(selector, waitUntil))[index].clear();
            console.log('Wait after clear, beofre send keys');
            this.sleep(400);
            await (await this.findElements(selector, waitUntil))[index].sendKeys(keys);
            console.log(
                `%cSentKeys with defult selector: '${
                    selector.valueOf()['value']
                }', on element with index of: ${index}, Keys: '${isSecret ? '******' : keys}'`,
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
                            `%cSentKeys with actions and defult selector: '${
                                selector.valueOf()['value']
                            }', on element with index of: ${index}, Keys: '${isSecret ? '******' : keys}'`,
                            ConsoleColors.SentKeysMessage,
                        );
                    } catch (error) {
                        if (selector['using'] == 'xpath') {
                            await this.driver.executeScript(
                                `document.evaluate("${selector['value']}", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(${index}).value='${keys}';`,
                            );
                            console.log(
                                `%cSet value with xpath selector: '${
                                    selector.valueOf()['value']
                                }', on element with index of: ${index}, Keys: '${isSecret ? '******' : keys}'`,
                                ConsoleColors.SentKeysMessage,
                            );
                        } else {
                            await this.driver.executeScript(
                                `document.querySelectorAll("${selector['value']}")[${index}].value='${keys}';`,
                            );
                            console.log(
                                `%cSet value with css selector: '${
                                    selector.valueOf()['value']
                                }', on element with index of: ${index}, Keys: '${isSecret ? '******' : keys}'`,
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

    public async findElement(selector: By, waitUntil = 15000, isVisible = true): Promise<WebElement> {
        return await this.findElements(selector, waitUntil, isVisible).then((webElement) =>
            webElement ? webElement[0] : webElement,
        );
    }

    /**
     * Function to wait for loading element to appear and then disappear.
     * @param loadingLocator Locator of the loading element.
     * @param timeOut Timeout, in MS, until loading has ended (loading element no longer visible).
     * @param timeOutToDisplay Timeout, in MS, until loading first appears.
     * @param errorOnNoLoad Should an error be thrown when loading element is not displayed until defined threshold is reached.
     */
    public async waitForLoading(
        loadingLocator: By,
        timeOut = 30000,
        timeOutToDisplay = 1000,
        errorOnNoLoad = false,
    ): Promise<void> {
        const notVisibleMsg = `Loading element ${
            loadingLocator.valueOf()['value']
        } not visible after ${timeOutToDisplay}MS`;
        const loadTimeoutMsg = `Loading (${loadingLocator.valueOf()['value']}) timeout reached after ${timeOut}MS`;
        console.log(new Date().toTimeString() + ` - ${this.waitForLoading.name}: Start`);
        return this.driver
            .wait(until.elementIsVisible(this.findSingleElement(loadingLocator)), timeOutToDisplay, notVisibleMsg)
            .then(async () => {
                console.log(new Date().toTimeString() + ` - ${this.waitForLoading.name}: Loading found`);
                await this.driver.wait(
                    until.elementIsNotVisible(this.findSingleElement(loadingLocator, timeOut + 1)),
                    timeOut,
                    loadTimeoutMsg,
                );
                console.log(new Date().toTimeString() + ` - ${this.waitForLoading.name}: Loading finished`);
            })
            .catch((error) => {
                if (errorOnNoLoad) {
                    throw <Error>error;
                } else {
                    console.log(notVisibleMsg);
                }
            });
    }

    /**
     * Check if an element is located within the DOM
     * @param selector Element locator.
     * @param timeOut Timeout, in MS, to poll for element located until 'false' is returned. Default is 1000ms.
     * @param suppressLog Suppress writing error to log in case the function returns 'false'.
     * @returns Whether the element is located in the DOM.
     */
    public async isElementLocated(selector: By, timeOut = 1000, suppressLog = false): Promise<boolean> {
        await this.driver.manage().setTimeouts({ implicit: timeOut });
        const isLocated = this.driver
            .wait(
                until.elementLocated(selector),
                timeOut,
                `Element ${selector.valueOf()['value']} was not located in DOM`,
            )
            .then(() => {
                if (!suppressLog) {
                    console.log(
                        `Element ${selector.valueOf()['value']} is located in DOM`,
                        ConsoleColors.ElementFoundMessage,
                    );
                }
                return true;
            })
            .catch((error) => {
                if (!suppressLog) {
                    console.log(`%c${error.message}`, ConsoleColors.Error);
                }
                return false;
            });
        return isLocated;
    }

    /**
     * Check if an element is located within the DOM
     * @param selector Element locator.
     * @param timeOut Timeout, in MS, to poll for element located until 'false' is returned. Default is 1000ms.
     * @param suppressLog Suppress writing error to log in case the function returns 'false'.
     * @returns Whether the element is located in the DOM.
     */
    public async isElementVisible(selector: By, timeOut = 1000, suppressLog = false): Promise<boolean> {
        await this.driver.manage().setTimeouts({ implicit: timeOut });
        const isLocated = this.driver
            .wait(
                until.elementIsVisible(this.findSingleElement(selector)),
                timeOut,
                `Element ${selector.valueOf()['value']} is not visible`,
            )
            .then(() => {
                if (!suppressLog) {
                    console.log(`Element ${selector.valueOf()['value']} is visible`, ConsoleColors.ElementFoundMessage);
                }
                return true;
            })
            .catch((error) => {
                if (!suppressLog) {
                    console.log(`%c${error.message}`, ConsoleColors.Error);
                }
                return false;
            });
        return isLocated;
    }

    /**
     * Searches by selector and returns the first found element.
     * @param selector The locator to use.
     * @param waitUntil Implicit findElement timeout, in milliseconds.
     * @returns {@link WebElementPromise}
     */
    public findSingleElement(selector: By, waitUntil = 15000): WebElementPromise {
        const promise = this.driver.manage().setTimeouts({ implicit: waitUntil });

        Promise.all([promise]);
        const element = this.driver.findElement(selector);
        console.log(
            `%cElement with selector: '${selector.valueOf()['value']}' was successfully found `,
            ConsoleColors.ElementFoundMessage,
        );
        return element;
    }

    /**
     * Searches by selector and returns the first found element's attribute.
     * @param selector The locator to use.
     * @param attributeName Attribute name to retrieve.
     * @param waitUntil Implicit findElement timeout, in milliseconds.
     */
    public async getElementAttribute(selector: By, attributeName: string, waitUntil = 15000): Promise<string | null> {
        const attributeValue = this.findSingleElement(selector, waitUntil).getAttribute(attributeName);
        console.log(`%cSuccessfully retrieved the attribute '${attributeName}'`, ConsoleColors.PageMessage);
        return attributeValue;
    }

    //TODO:Possibly does not center the view on the element, needs testing.
    /**
     * Finds element by selector, moves the mouse to the middle of the element and scrolls it into view.
     * @param selector The locator to use.
     * @param offset Scrolling X and Y pixels relative to element found by selector
     * @param duration How long, in milliseconds, should the action take. Default is 100ms.
     */
    public async scrollToElement(
        selector: By,
        offset?: ILocation,
        duration?: number,
        waitUntil = 15000,
    ): Promise<void> {
        const actions = this.driver.actions({ async: true });
        this.findSingleElement(selector, waitUntil).then(
            async (element) =>
                await actions.move({ origin: element, x: offset?.x, y: offset?.y, duration: duration }).perform(),
        );
    }

    public async findElements(selector: By, waitUntil = 15000, isVisible = true): Promise<WebElement[]> {
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
                `After wait time of: ${waitUntil}, for selector of '${selector['value']}', The test must end, The element is: ${elArr}`,
            );
        } else if (isElVisible === false) {
            throw new Error(
                `After wait time of: ${waitUntil}, for selector of '${selector['value']}', The test must end, The element is not visible`,
            );
        } else {
            console.log(
                `%cElement with selector: '${selector.valueOf()['value']}' is successfully found `,
                ConsoleColors.ElementFoundMessage,
            );
        }
        return elArr;
    }

    public async untilIsVisible(selector: By, waitUntil = 15000): Promise<boolean> {
        if ((await this.findElement(selector, waitUntil)) === undefined) {
            return false;
        }
        console.log(`%cElement '${selector.valueOf()['value']}' is visibale`, ConsoleColors.ElementFoundMessage);
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
    public sleepAsync(ms: number) {
        return this.tempGeneralService.sleepAsync(ms);
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
     *
     * @param urlLookingFor which url address were wating for the response to
     * @param numOfTries how many times we should query the browser
     * @param responseCodeLookingFor which response code we search for in browser logs
     * @param responseStatusLookingFor which response status we search for in browser logs
     * @returns
     */
    public async queryNetworkLogsForCertainResponseAndReturnTiming(
        urlLookingFor: string,
        numOfTries = 5000,
        responseCodeLookingFor = 200,
        responseStatusLookingFor = 'OK',
    ): Promise<number> {
        let currentNumOfTries = 0;
        let consoleLogs: any[] = [];
        const duration: undefined | number = undefined;
        const start = Date.now();
        do {
            consoleLogs = await this.getPerformanceLogs();
            consoleLogs = consoleLogs.filter((log) => log.message.method === 'Network.responseReceived');
            consoleLogs = consoleLogs.filter((log) => log.message.params.response.url === urlLookingFor);
            consoleLogs = consoleLogs.filter((log) => log.message.params.response.status === responseCodeLookingFor);
            consoleLogs = consoleLogs.filter(
                (log) => log.message.params.response.statusText === responseStatusLookingFor,
            );
            consoleLogs = consoleLogs.filter((log) => log.message.params.type === 'XHR');
            if (consoleLogs.length === 1) {
                return Date.now() - start;
            }
            currentNumOfTries++;
        } while (true && numOfTries > currentNumOfTries);
        if (duration === undefined) {
            throw Error(`resopnse for '${urlLookingFor}' was not found for ${currentNumOfTries} tries`);
        }
        return duration; //dummy - will throw an error or will return before getting here
    }

    /**
     * closes the child window in focus, the parent window is still open
     * @returns
     */
    public async close(): Promise<void> {
        //This line is needed, to not remove! (this wait to driver before trying to close it)
        const windowTitle = await this.driver.getTitle();
        console.log(`%cClose Window With Title: '${windowTitle}'`, ConsoleColors.Success);
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
            console.log(`%cQuit Window With Title: '${windowTitle}'`, ConsoleColors.SystemInformation);
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
                        await this.sleepAsync(2000);
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
