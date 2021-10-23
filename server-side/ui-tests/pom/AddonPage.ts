import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Locator, By } from 'selenium-webdriver';

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
}
