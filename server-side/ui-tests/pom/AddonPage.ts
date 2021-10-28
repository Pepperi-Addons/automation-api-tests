import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Locator, By, WebElement } from 'selenium-webdriver';

export class AddonPage extends Page {
    constructor(browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public AddonContainerTopButton: Locator = By.css('.addon-page-container button');
    public AddonContainerTitle: Locator = By.css('.addon-page-container [title]');
    public AddonContainerTabs: Locator = By.css('.pep-main-area [role="tablist"] [role="tab"]');
    public AddonContainerTablistXpath: Locator = By.xpath(
        './/div[@class="pep-main-area"] //div[@role="tablist"] //div[@role="tab"]',
    );
    public AddonContainerTabsContent: Locator = By.css('#addNewOrderTypesCont');
    public AddonContainerIframe: Locator = By.css('iframe#myFrame');
    public AddonContainerHiddenTabs: Locator = By.css('.ui-tabs-hide');
    public AddonContainerFooterDisplay: Locator = By.css('#FotterCont[style="display: block;"]');

    ///Object Types Editor Locators
    public AddonContainerATDEditorWorkflowFlowchartIndicator: Locator = By.css('span[name="flowchart"].disabled');

    public async selectTabByText(tabText: string): Promise<void> {
        const selectedTab = Object.assign({}, this.AddonContainerTablistXpath);
        selectedTab['value'] += ` [contains(., '${tabText}')]`;
        await this.browser.click(selectedTab);
        return;
    }

    public async isEditorTabVisible(tabID: string, waitUntil = 15000): Promise<boolean> {
        const selectedTab = Object.assign({}, this.AddonContainerTabsContent);
        selectedTab['value'] += ` #${tabID}`;
        return await this.browser.untilIsVisible(selectedTab, waitUntil);
    }

    public async isEditorHiddenTabExist(tabID: string, waitUntil = 15000): Promise<boolean> {
        const selectedTab = Object.assign({}, this.AddonContainerHiddenTabs);
        selectedTab['value'] += `#${tabID}`;
        const hiddenEl = await this.browser.findElement(selectedTab, waitUntil, false);
        if (hiddenEl instanceof WebElement) {
            return true;
        }
        return false;
    }

    public async isAdoonFullyLoaded(): Promise<boolean> {
        await this.browser.untilIsVisible(this.AddonContainerFooterDisplay, 45000);
        let bodySize = 0;
        do {
            let htmlBody = await this.browser.findElement(this.HtmlBody);
            bodySize = (await htmlBody.getAttribute('innerHTML')).length;
            this.browser.sleep(1000);
            htmlBody = await this.browser.findElement(this.HtmlBody);
            if ((await htmlBody.getAttribute('innerHTML')).length == bodySize) {
                bodySize = -1;
            }
        } while (bodySize != -1);
        return true;
    }
}
