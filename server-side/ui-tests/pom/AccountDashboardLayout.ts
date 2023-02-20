import { By } from 'selenium-webdriver';
import { AddonPage } from './addons/base/AddonPage';

export class AccountDashboardLayout extends AddonPage {
    // Account Dashborad Layout
    public AccountDashboardLayout_Container: By = By.xpath('//div[@id="appContainer"]');
    public AccountDashboardLayout_Title: By = By.xpath('//h1[contains(@class,"page-title")]/span');
    public AccountDashboardLayout_ListContainer: By = By.xpath('//div[@id="tamplateListCont"]');
    public AccountDashboardLayout_MenuRow_Container: By = By.xpath('//div[text()="Menu"]/parent::div');
    // public AccountDashboardLayout_Menu_PencilButton: By = By.xpath('//div[text()="Menu"]/parent::div//div[@title="Edit"]');
    public AccountDashboardLayout_MenuRow_PencilButton: By = By.xpath(
        '//div[text()="Menu"]/parent::div[contains(@class,"active")]//div[@title="Edit"]',
    );
    public AccountDashboardLayout_ConfigPage_Title: By = By.xpath(
        '//div[contains(@class,"previewAndRestoreDiv")]/div/b',
    );
    public AccountDashboardLayout_Menu_CancelButton: By = By.xpath('//div[contains(@class,"cancel")][text()="Cancel"]');
    public AccountDashboardLayout_Menu_RepCard_PencilButton: By = By.xpath(
        '//span[@title="Rep"]/following-sibling::span[contains(@class,"editPenIcon")]',
    );
    public AccountDashboardLayout_Menu_RepCard_SearchBox: By = By.xpath('//input[@id="txtSearchBankFields"]');
    public AccountDashboardLayout_Menu_RepCard_SearchResult: By = By.xpath(
        '//div[text()="Available Fields"]/parent::div//ul/div[4]/ul/li[contains(@class,"filter-selected")]',
    );
    public AccountDashboardLayout_Menu_RepCard_SearchResult_PlusButton: By = By.xpath(
        '//div[text()="Available Fields"]/parent::div//ul/div[4]/ul/li[contains(@class,"filter-selected")]//div[contains(@class,"plusIcon")]',
    );
    public AccountDashboardLayout_Menu_RepCard_SaveButton: By = By.xpath(
        '//div[contains(@class,"footer-buttons")]/div[contains(@class,"save")]',
    );
}
