import { Browser } from '../../utilities/browser';
import { By } from 'selenium-webdriver';
import { Page } from './base/Page';
import { expect } from 'chai';

export class IpaasPage extends Page {
    constructor(browser: Browser) {
        super(browser, 'https://integration.pepperi.com/mgr/PluginManager/Reports');
    }

    public MainMenu_buttonList: By = By.xpath(`//ul[@data-role="menu"]`);
    public MainMenu_buttonItem: By = By.xpath(`//li[@role="menuitem"]`);
    public MainHeader_afterMenuItemClick: By = By.xpath(`//div[@id="k-block"]//div[contains(@class,"k-header")]/div`);

    public async getSelectorOfMainMenuButtonItemByText(text: string): Promise<By> {
        return By.xpath(`${this.MainMenu_buttonList.value}${this.MainMenu_buttonItem.value}/a[contains(.,"${text}")]`);
    }

    public async clickButtonAtTopMenuByText(text: string): Promise<void> {
        await this.browser.click(await this.getSelectorOfMainMenuButtonItemByText(text));
        this.browser.sleep(1 * 1000);
        const mainHeader = await this.browser.findElement(this.MainHeader_afterMenuItemClick);
        const mainHeader_text = await mainHeader.getText();
        expect(mainHeader_text).to.contain(text);
    }
}
