import { By } from 'selenium-webdriver';
import { AddonPage } from './addons/base/AddonPage';
import { Browser } from '../utilities/browser';
import { expect } from 'chai';
import { WebAppSettingsSidePanel } from './Components/WebAppSettingsSidePanel';
import { WebAppHomePage } from './Pages/WebAppHomePage';
import { WebAppHeader } from './WebAppHeader';

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

    public getSelectorOfSearchResultListRowPlusButtonByUniqueName(uniqueName: string) {
        return By.xpath(`//li[@data-id="SLUG_visit_flow_auto_${uniqueName}"]/div/div`);
    }

    public getSelectorOfSearchResultListRowPlusButtonByUniqueNameEVGENY(uniqueName: string) {
        return By.xpath(`//li[@data-id="SLUG_${uniqueName}"]/div/div`);
    }

    public getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText(slugpath: string) {
        return By.xpath(`//div[text()="Layout"]/following-sibling::ul/li[contains(@data-id,"${slugpath}")]`);
    }

    public getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(slugpath: string) {
        return By.xpath(`//div[text()="Layout"]/following-sibling::ul/li[contains(@data-id,"${slugpath}")]//span[4]`);
    }

    public getSelectorOfAccountHomePageHamburgerMenuVisitFlowAutomatedSlug(slugName: string) {
        return By.xpath(`//div[contains(@id,"cdk-overlay-")]//button[@title="${slugName}"]`);
    }

    public async configureToAccountMenuRepCard(
        driver: Browser,
        searchText: string,
        uniqueText?: string,
        validationText?: string,
    ) {
        const webAppHomePage = new WebAppHomePage(driver);
        const webAppHeader = new WebAppHeader(driver);
        const settingsSidePanel = new WebAppSettingsSidePanel(driver);
        for (let i = 0; i < 2; i++) {
            try {
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHeader.openSettings();
                await webAppHeader.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                await settingsSidePanel.selectSettingsByID('Accounts');
                await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
                await this.isSpinnerDone();
                driver.sleep(20 * 1000);
                await driver.switchTo(this.AddonContainerIframe);
                await this.waitTillVisible(this.AccountDashboardLayout_Container, 15000);
                await this.waitTillVisible(this.AccountDashboardLayout_Title, 15000);
                await this.waitTillVisible(this.AccountDashboardLayout_ListContainer, 15000);
                await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
                await this.clickElement('AccountDashboardLayout_MenuRow_Container');
                await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_PencilButton, 15000);
                await this.clickElement('AccountDashboardLayout_MenuRow_PencilButton');
                await this.waitTillVisible(this.AccountDashboardLayout_ConfigPage_Title, 15000);
                expect(
                    await (await driver.findElement(this.AccountDashboardLayout_ConfigPage_Title)).getText(),
                ).to.equal('Menu');
                await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
                await this.clickElement('AccountDashboardLayout_Menu_RepCard_PencilButton');
                await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_SearchBox, 15000);
                await this.insertTextToInputElement(searchText, this.AccountDashboardLayout_Menu_RepCard_SearchBox);
                const plusButton = await driver.findElement(
                    this.getSelectorOfSearchResultListRowPlusButtonByUniqueName(uniqueText || searchText),
                );
                await plusButton.click();
                await this.waitTillVisible(
                    this.getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText(validationText || searchText),
                    15000,
                );
                await this.clickElement('AccountDashboardLayout_Menu_RepCard_SaveButton');
                driver.sleep(5 * 1000);
                await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
                await this.clickElement('AccountDashboardLayout_Menu_CancelButton');
                await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
                driver.sleep(2 * 1000);
                await driver.switchToDefaultContent();
                driver.sleep(2 * 1000);
                await webAppHeader.goHome();
                break;
            } catch (error) {
                await driver.switchToDefaultContent();
                console.error(error);
                await webAppHeader.goHome();
            }
        }
    }

    public async configureToAccountMenuRepCardEVGENY(driver: Browser, searchText: string, validationText?: string) {
        const webAppHomePage = new WebAppHomePage(driver);
        const webAppHeader = new WebAppHeader(driver);
        const settingsSidePanel = new WebAppSettingsSidePanel(driver);
        for (let i = 0; i < 2; i++) {
            try {
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHeader.openSettings();
                await webAppHeader.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                await settingsSidePanel.selectSettingsByID('Accounts');
                await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
                await this.isSpinnerDone();
                driver.sleep(20 * 1000);
                await driver.switchTo(this.AddonContainerIframe);
                await this.waitTillVisible(this.AccountDashboardLayout_Container, 15000);
                await this.waitTillVisible(this.AccountDashboardLayout_Title, 15000);
                await this.waitTillVisible(this.AccountDashboardLayout_ListContainer, 15000);
                await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
                await this.clickElement('AccountDashboardLayout_MenuRow_Container');
                await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_PencilButton, 15000);
                await this.clickElement('AccountDashboardLayout_MenuRow_PencilButton');
                await this.waitTillVisible(this.AccountDashboardLayout_ConfigPage_Title, 15000);
                expect(
                    await (await driver.findElement(this.AccountDashboardLayout_ConfigPage_Title)).getText(),
                ).to.equal('Menu');
                await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
                await this.clickElement('AccountDashboardLayout_Menu_RepCard_PencilButton');
                await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_SearchBox, 15000);
                await this.insertTextToInputElement(searchText, this.AccountDashboardLayout_Menu_RepCard_SearchBox);
                const plusButton = await driver.findElement(
                    this.getSelectorOfSearchResultListRowPlusButtonByUniqueNameEVGENY(searchText),
                );
                await plusButton.click();
                await this.waitTillVisible(
                    this.getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText(validationText || searchText),
                    15000,
                );
                await this.clickElement('AccountDashboardLayout_Menu_RepCard_SaveButton');
                driver.sleep(5 * 1000);
                await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
                await this.clickElement('AccountDashboardLayout_Menu_CancelButton');
                await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
                driver.sleep(2 * 1000);
                await driver.switchToDefaultContent();
                driver.sleep(2 * 1000);
                await webAppHeader.goHome();
                break;
            } catch (error) {
                await driver.switchToDefaultContent();
                console.error(error);
                await webAppHeader.goHome();
            }
        }
    }

    public async unconfigureFromAccountMenuRepCardEVGENY(driver: Browser, deletionText: string, cleanupText?: string) {
        const webAppHomePage = new WebAppHomePage(driver);
        const webAppHeader = new WebAppHeader(driver);
        const settingsSidePanel = new WebAppSettingsSidePanel(driver);
        await webAppHeader.goHome();
        await webAppHomePage.isSpinnerDone();
        await webAppHeader.openSettings();
        await webAppHeader.isSpinnerDone();
        this.pause(0.5 * 1000);
        await settingsSidePanel.selectSettingsByID('Accounts');
        await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
        for (let i = 0; i < 2; i++) {
            this.pause(10 * 1000);
            try {
                await this.isSpinnerDone();
                await driver.switchTo(this.AddonContainerIframe);
                await this.waitTillVisible(this.AccountDashboardLayout_Container, 15000);
                break;
            } catch (error) {
                console.error(error);
            }
        }
        await this.waitTillVisible(this.AccountDashboardLayout_Title, 15000);
        await this.waitTillVisible(this.AccountDashboardLayout_ListContainer, 15000);
        await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
        await this.clickElement('AccountDashboardLayout_MenuRow_Container');
        await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_PencilButton, 15000);
        await this.clickElement('AccountDashboardLayout_MenuRow_PencilButton');
        await this.waitTillVisible(this.AccountDashboardLayout_ConfigPage_Title, 15000);
        expect(await (await driver.findElement(this.AccountDashboardLayout_ConfigPage_Title)).getText()).to.equal(
            'Menu',
        );
        await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
        await this.clickElement('AccountDashboardLayout_Menu_RepCard_PencilButton');
        await this.waitTillVisible(
            this.getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText(deletionText),
            15000,
        );
        await this.click(this.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(deletionText));
        if (
            cleanupText &&
            (await driver.isElementVisible(
                this.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(cleanupText),
            ))
        ) {
            const configuredSlugsLeftovers = await driver.findElements(
                this.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(cleanupText),
            );
            configuredSlugsLeftovers.forEach(async (leftoverSlugDeleteButton) => {
                await leftoverSlugDeleteButton.click();
            });
            driver.sleep(2 * 1000);
        }
        await this.clickElement('AccountDashboardLayout_Menu_RepCard_SaveButton');
        driver.sleep(3 * 1000);
        await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
        await this.clickElement('AccountDashboardLayout_Menu_CancelButton');
        await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
        driver.sleep(2 * 1000);
        await driver.switchToDefaultContent();
        driver.sleep(7 * 1000);
    }

    public async unconfigureFromAccountMenuRepCard(driver: Browser, deletionText: string, cleanupText?: string) {
        const webAppHomePage = new WebAppHomePage(driver);
        const webAppHeader = new WebAppHeader(driver);
        const settingsSidePanel = new WebAppSettingsSidePanel(driver);
        await webAppHeader.goHome();
        await webAppHomePage.isSpinnerDone();
        await webAppHeader.openSettings();
        await webAppHeader.isSpinnerDone();
        this.pause(0.5 * 1000);
        await settingsSidePanel.selectSettingsByID('Accounts');
        await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
        for (let i = 0; i < 2; i++) {
            this.pause(10 * 1000);
            try {
                await this.isSpinnerDone();
                await driver.switchTo(this.AddonContainerIframe);
                await this.waitTillVisible(this.AccountDashboardLayout_Container, 15000);
                break;
            } catch (error) {
                console.error(error);
            }
        }
        await this.waitTillVisible(this.AccountDashboardLayout_Title, 15000);
        await this.waitTillVisible(this.AccountDashboardLayout_ListContainer, 15000);
        await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
        await this.clickElement('AccountDashboardLayout_MenuRow_Container');
        await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_PencilButton, 15000);
        await this.clickElement('AccountDashboardLayout_MenuRow_PencilButton');
        await this.waitTillVisible(this.AccountDashboardLayout_ConfigPage_Title, 15000);
        expect(await (await driver.findElement(this.AccountDashboardLayout_ConfigPage_Title)).getText()).to.equal(
            'Menu',
        );
        await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
        await this.clickElement('AccountDashboardLayout_Menu_RepCard_PencilButton');
        await this.waitTillVisible(
            this.getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText(deletionText),
            15000,
        );
        await this.click(this.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(deletionText));
        if (
            cleanupText &&
            (await driver.isElementVisible(
                this.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(cleanupText),
            ))
        ) {
            const configuredSlugsLeftovers = await driver.findElements(
                this.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(cleanupText),
            );
            configuredSlugsLeftovers.forEach(async (leftoverSlugDeleteButton) => {
                await leftoverSlugDeleteButton.click();
            });
            driver.sleep(2 * 1000);
        }
        await this.clickElement('AccountDashboardLayout_Menu_RepCard_SaveButton');
        driver.sleep(3 * 1000);
        await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
        await this.clickElement('AccountDashboardLayout_Menu_CancelButton');
        await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
        driver.sleep(2 * 1000);
        await driver.switchToDefaultContent();
        driver.sleep(7 * 1000);
    }
}
