import { By, Key, Locator } from 'selenium-webdriver';
import { AddonPageBase, WebAppHomePage, WebAppSettingsSidePanel } from '..';
import { AddonLoadCondition } from './AddonPageBase';

export class SettingsFramework extends AddonPageBase {
    //Settings Framework Locators
    public SettingsFrameworkEditorSearch: Locator = By.css('#txtSearchBankFields');

    /**
     *
     * @param activtiyName the name of ATD should be added to home screen
     * @returns
     */
    public async addAdminHomePageButtons(activtiyName: string): Promise<void> {
        //keep for now
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Company Profile');
        await this.browser.click(webAppSettingsSidePanel.SettingsFrameworkHomeButtons);

        await this.isSpinnerDone();
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Content);

        await this.browser.click(this.AddonContainerEditAdmin);
        await this.browser.sendKeys(this.SettingsFrameworkEditorSearch, activtiyName + Key.ENTER);
        await this.browser.click(this.AddonContainerEditorSave);

        await this.browser.switchToDefaultContent();
        const webAppHomePage = new WebAppHomePage(this.browser);
        await webAppHomePage.returnToHomePage();
        return;
    }
}
