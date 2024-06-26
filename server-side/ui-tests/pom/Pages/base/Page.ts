import { Browser } from '../../../utilities/browser';
import { By, WebElement } from 'selenium-webdriver';
// import addContext from 'mochawesome/addContext';
// import fs from 'fs';
// import path from 'path';
import { ConsoleColors } from '../../../../services/general.service';
import { BasePomObject } from '../../base/BasePomObject';

export abstract class Page extends BasePomObject {
    protected url: string;
    public constructor(protected browser: Browser, url: string) {
        super(browser);
        this.url = url;
    }

    public PepperiHiddenLoadingSpinner: By = By.css('#loadingSpinnerModal[hidden]');
    public HtmlBody: By = By.css('html body');
    public TopBarContainer: By = By.xpath('//div[contains(@class,"top-bar-container")]');
    public SearchBankFields_input: By = By.xpath('//input[@id="txtSearchBankFields"]');

    public getSelectorOfCardContainerByProfile(profile: 'Rep' | 'Admin' | 'Buyer' = 'Rep') {
        return By.xpath(`//span[@title="${profile}"]/parent::div/parent::div`);
    }

    public getSelectorOfEditCardByProfile(profile: 'Rep' | 'Admin' | 'Buyer' = 'Rep') {
        return By.xpath(
            `${this.getSelectorOfCardContainerByProfile(profile).value}//span[contains(@class,"editPenIcon")]`,
        );
    }

    public getSelectorOfSearchResultListRowPlusButtonByPartialTextAtCardEdit(text: string) {
        return By.xpath(`//span[contains(text(),"${text}")]/ancestor::li//div[contains(@class,"plusIcon")]`);
    }

    public getSelectorOfItemConfiguredToCardByTextAtCardEdit(text: string) {
        return By.xpath(`//div[text()="Layout"]/following-sibling::ul//div[@title="${text}"]/ancestor::li`);
    }

    public getSelectorOfItemConfiguredToCardDeleteButtonByTextAtCardEdit(text: string) {
        return By.xpath(
            `//div[text()="Layout"]/following-sibling::ul//div[@title="${text}"]/ancestor::li//span[contains(@class,"trashCanIcon")]`,
        );
    }

    public getSelectorOfItemConfiguredToCardDeleteButtonByPartialTextAtCardEdit(text: string) {
        return By.xpath(
            `//div[text()="Layout"]/following-sibling::ul//div[contains(@title,"${text}")]/ancestor::li//span[contains(@class,"trashCanIcon")]`,
        );
    }

    public getSelectorOfFooterButtonByText(text: string) {
        return By.xpath(`//div[contains(@class,"footer-buttons")]//div[contains(text(),"${text}")]`);
    }

    public getSelectorOfProfileCardsContainerButtonByText(text: string) {
        return By.xpath(`//div[@id="tamplateListCont"]//div[contains(text(),"${text}")]`);
    }

    protected setUrl(url: string) {
        this.url = url;
    }

    public async navigate(url?: string): Promise<void> {
        if (url) {
            return await this.browser.navigate(url);
        } else {
            return await this.browser.navigate(this.url);
        }
    }

    public async getUrlParamValue(paramName: string): Promise<string> {
        const currentUrlSplittedByUrlParams = (await this.browser.getCurrentUrl()).split('?');
        let isParamNameIncludedInUrlParams = false;
        for (let index = 0; index < currentUrlSplittedByUrlParams.length; index++) {
            const urlSplit = currentUrlSplittedByUrlParams[index];
            if (urlSplit.includes(paramName)) {
                isParamNameIncludedInUrlParams = true;
                break;
            }
        }
        if (!isParamNameIncludedInUrlParams) {
            return '';
        }
        const urlParamsOnly = currentUrlSplittedByUrlParams[1];
        const splitByParamKeyNoAndSymbol = urlParamsOnly.split(`${paramName}=`)[1];
        const actualParamVal = splitByParamKeyNoAndSymbol.split('&')[0];
        return actualParamVal;
    }

    public async click(selector: By, index = 0, waitUntil = 15000): Promise<void> {
        return await this.browser.click(selector, index, waitUntil);
    }

    public async sendKeys(selector: By, keys: string | number, index = 0): Promise<void> {
        return await this.browser.sendKeys(selector, keys, index);
    }

    public async untilIsVisible(selector: By, waitUntil = 15000): Promise<boolean> {
        return await this.browser.untilIsVisible(selector, waitUntil);
    }

    public async safeUntilIsVisible(selector: By, waitUntil = 15000): Promise<boolean> {
        let isVisibale = false;
        try {
            isVisibale = await this.browser.untilIsVisibleRaw(selector, waitUntil);
        } catch (e) {
            const errorMessage = (e as Error).message;
            if (
                errorMessage.includes('The test must end, The element is: undefined') ||
                errorMessage.includes('The test must end, The element is not visible')
            ) {
                return false;
            } else {
                throw e;
            }
        }
        return isVisibale;
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

    public async longerIsSpinnerDone(): Promise<boolean> {
        const isHidden = [false, false];
        console.log('%cVerify Spinner Status', ConsoleColors.PageMessage);
        let loadingCounter = 0;
        do {
            const hiddenEl_1 = await this.browser.findElement(this.PepperiHiddenLoadingSpinner, 45000 * 3, false);
            if (hiddenEl_1 instanceof WebElement) {
                isHidden[0] = true;
            }
            this.browser.sleep(200 + loadingCounter);
            const hiddenEl_2 = await this.browser.findElement(this.PepperiHiddenLoadingSpinner, 45000 * 3, false);
            if (hiddenEl_2 instanceof WebElement) {
                isHidden[1] = true;
            }
            loadingCounter++;
        } while (!isHidden[0] || !isHidden[1]);
        return true;
    }

    // /**
    //  *
    //  * @param that Should be the "this" of the mocha test, this will help connect data from this function to test reports
    //  */
    // public async collectEndTestData(that): Promise<void> {
    //     if (that.currentTest.state != 'passed') {
    //         console.log('%cTest Failed', ConsoleColors.Error);
    //         const imagePath = `${__dirname.split('server-side')[0]}server-side\\api-tests\\test-data\\Error_Image.jpg`;
    //         const file = fs.readFileSync(path.resolve(imagePath));
    //         let base64Image = file.toString('base64');
    //         let url = 'Error In Getting URL';
    //         let consoleLogs = ['Error In Console Logs'];
    //         try {
    //             base64Image = await this.browser.saveScreenshots();
    //         } catch (error) {
    //             console.log(`%cError in collectEndTestData saveScreenshots: ${error}`, ConsoleColors.Error);
    //         }
    //         try {
    //             url = await this.browser.getCurrentUrl();
    //         } catch (error) {
    //             console.log(`%cError in collectEndTestData getCurrentUrl: ${error}`, ConsoleColors.Error);
    //         }
    //         try {
    //             //Wait for all the logs to be printed (this usually take more then 3 seconds)
    //             this.browser.sleep(6006);
    //             consoleLogs = await this.browser.getConsoleLogs();
    //         } catch (error) {
    //             console.log(`%cError in collectEndTestData getConsoleLogs: ${error}`, ConsoleColors.Error);
    //         }
    //         addContext(that, {
    //             title: 'URL',
    //             value: url,
    //         });
    //         addContext(that, {
    //             title: `Image`,
    //             value: 'data:image/png;base64,' + base64Image,
    //         });
    //         debugger;
    //         addContext(that, {
    //             title: 'Console Logs',
    //             value: consoleLogs,
    //         });
    //         debugger;
    //     } else if (that.currentTest.state == 'passed') {
    //         console.log('%cTest Passed', ConsoleColors.Success);
    //     } else {
    //         console.log(`%cTest Ended With State: ${that.currentTest.state}`, ConsoleColors.Information);
    //     }
    //     return;
    // }
}
