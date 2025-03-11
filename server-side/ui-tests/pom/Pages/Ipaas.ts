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
    public SearchBy_DropList_Item: By = By.xpath(`//ul[@id="Search_kendoPanel"]/li/span`);
    public SearchBy_DropList_SubProperty: By = By.xpath(`//ul[@id="Search_ClientTask_kendoPanel"]/li/span`);
    public TaskName_textField: By = By.xpath(`//*[@id="Search_TaskName"]`);
    public TaskType_dropList: By = By.xpath(
        `//ul[@id="Search_ClientTask_kendoPanel"]/li[contains(@class,"k-state-highlight k-state-active")]//span[contains(text(),"Select Task Type")]/following-sibling::span[@role="button"]`,
    );
    public TaskType_webook_from_dropList: By = By.xpath(`//*[@id="Search_MappingActionTypeId-list"]/span/input`);
    public TaskDetails_search_button: By = By.xpath(
        `//div[@id="Search_RightUpperContainer"]//span[contains(text(), "Search")]/parent::div`,
    );
    public TaskDetails_open_button_triger_job_test: By = By.xpath(
        `//div[@id="mainKendoGrid"]//table/tbody//td[contains(text(),"Trigger Job - Test Dataflows")]/following-sibling::td[@class="k-command-cell k-command-cell"]/child::*[1]`, //press on open button on table with Trigger Job - Test Dataflows DO NOT TOUCH
    );

    public async getSelectorOfSearchByDropListItemByText(text: string): Promise<By> {
        return By.xpath(`${this.SearchBy_DropList_Item.value}[contains(text(),"${text}")]`);
    }

    public async getSearchByDropListSubPropertyByText(text: string): Promise<By> {
        return By.xpath(`${this.SearchBy_DropList_SubProperty.value}[contains(text(),"${text}")]`);
    }

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
