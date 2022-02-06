import { By, Key, Locator } from 'selenium-webdriver';
import { AddonPage, WebAppHomePage, WebAppSettingsSidePanel } from '..';
import { ConsoleColors } from '../../../services/general.service';
import { AddonLoadCondition } from './base/AddonPageBase';

export class BrandedApp extends AddonPage {
    //Branded App Locators
    public BrandedAppChangeCompanyLogo: Locator = By.id('btnChangeCompLogo');
    public BrandedAppUploadInputArr: Locator = By.css("input[type='file']");

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
        await super.browser.click(webAppSettingsSidePanel.SettingsFrameworkHomeButtons);

        await super.isSpinnerDone();
        await super.browser.switchTo(this.AddonContainerIframe);
        await super.isAddonFullyLoaded(AddonLoadCondition.Content);

        await super.browser.click(this.AddonContainerEditAdmin);
        await super.browser.sendKeys(this.SettingsFrameworkEditorSearch, activtiyName + Key.ENTER);
        await super.browser.click(this.AddonContainerEditorSave);

        await super.browser.switchToDefaultContent();
        const webAppHomePage = new WebAppHomePage(this.browser);
        await webAppHomePage.returnToHomePage();
        return;
    }

    /**
     *
     * @param activtiyName name of the ATD to delete
     * @returns
     */
    public async removeAdminHomePageButtons(activtiyName: string): Promise<void> {
        //keep for now
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Company Profile');
        await super.browser.click(webAppSettingsSidePanel.SettingsFrameworkHomeButtons);

        await super.isSpinnerDone();
        await super.browser.switchTo(this.AddonContainerIframe);
        await super.isAddonFullyLoaded(AddonLoadCondition.Content);

        await super.browser.click(this.AddonContainerEditAdmin);

        const buttonsLocator = Object.assign({}, this.AddonContainerEditorTrashBtn);
        buttonsLocator['value'] = buttonsLocator['value'].replace('ATD_PLACE_HOLDER', activtiyName);

        let isRemovable;
        try {
            isRemovable = await super.browser.untilIsVisible(buttonsLocator);
        } catch (error) {
            console.log('%cNo Button To Remove, Test Continue', ConsoleColors.PageMessage);
        }
        if (isRemovable) {
            const buttonsToRemove = await super.browser.findElements(buttonsLocator);
            for (let i = 0; i < buttonsToRemove.length; i++) {
                await super.browser.click(buttonsLocator);
            }
            await super.browser.click(this.AddonContainerEditorSave);
        }

        const webAppHomePage = new WebAppHomePage(super.browser);
        await webAppHomePage.returnToHomePage();
        return;
    }
}
