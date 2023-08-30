import { By, Key } from 'selenium-webdriver';
import { AddonPage, WebAppHomePage, WebAppSettingsSidePanel } from '..';
import { ConsoleColors } from '../../../services/general.service';
import { AddonLoadCondition } from './base/AddonPage';

export class BrandedApp extends AddonPage {
    //Branded App Locators
    public BrandedAppChangeCompanyLogo: By = By.id('btnChangeCompLogo');
    public BrandedAppUploadInputArr: By = By.css("input[type='file']");

    //Settings Framework Locators
    public SettingsFrameworkEditorSearch: By = By.css('#txtSearchBankFields');

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
        try {
            await this.isSpinnerDone();
            await this.browser.switchTo(this.AddonContainerIframe);
            await this.isAddonFullyLoaded(AddonLoadCondition.Content);
        } catch (error) {
            this.browser.refresh();
            this.browser.sleep(6500);
            await this.isSpinnerDone();
            await this.browser.switchTo(this.AddonContainerIframe);
            await this.isAddonFullyLoaded(AddonLoadCondition.Content);
        }

        await this.browser.click(this.AddonContainerEditAdmin);

        await this.browser.sendKeys(this.SettingsFrameworkEditorSearch, activtiyName + Key.ENTER);
        await this.browser.click(this.AddonContainerEditorSave);
        this.browser.sleep(3500);

        await this.browser.switchToDefaultContent();
        const webAppHomePage = new WebAppHomePage(this.browser);
        await webAppHomePage.returnToHomePage();
        return;
    }

    public async addRepHomePageButtons(activtiyName: string): Promise<void> {
        //keep for now
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Company Profile');
        await this.browser.click(webAppSettingsSidePanel.SettingsFrameworkHomeButtons);
        try {
            await this.isSpinnerDone();
            await this.browser.switchTo(this.AddonContainerIframe);
            await this.isAddonFullyLoaded(AddonLoadCondition.Content);
        } catch (error) {
            this.browser.refresh();
            this.browser.sleep(6500);
            await this.isSpinnerDone();
            await this.browser.switchTo(this.AddonContainerIframe);
            await this.isAddonFullyLoaded(AddonLoadCondition.Content);
        }

        await this.browser.click(this.AddonContainerEditRep);

        await this.browser.sendKeys(this.SettingsFrameworkEditorSearch, activtiyName + Key.ENTER);
        await this.browser.click(this.AddonContainerEditorSave);
        this.browser.sleep(3500);

        await this.browser.switchToDefaultContent();
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
        await this.browser.click(webAppSettingsSidePanel.SettingsFrameworkHomeButtons);

        try {
            await this.isSpinnerDone();
            await this.browser.switchTo(this.AddonContainerIframe);
            await this.isAddonFullyLoaded(AddonLoadCondition.Content);
        } catch (error) {
            this.browser.refresh();
            this.browser.sleep(6500);
            await this.isSpinnerDone();
            await this.browser.switchTo(this.AddonContainerIframe);
            await this.isAddonFullyLoaded(AddonLoadCondition.Content);
        }

        await this.browser.click(this.AddonContainerEditAdmin);

        const buttonsLocator = Object.assign({}, this.AddonContainerEditorTrashBtn);
        buttonsLocator['value'] = buttonsLocator['value'].replace('ATD_PLACE_HOLDER', activtiyName);

        let isRemovable;
        try {
            this.browser.sleep(3000);
            isRemovable = await this.browser.untilIsVisible(buttonsLocator);
        } catch (error) {
            console.log('%cNo Button To Remove, Test Continue', ConsoleColors.PageMessage);
        }
        if (isRemovable) {
            const buttonsToRemove = await this.browser.findElements(buttonsLocator);
            for (let i = 0; i < buttonsToRemove.length; i++) {
                await this.browser.click(buttonsLocator);
            }
            await this.browser.click(this.AddonContainerEditorSave);
        }

        const webAppHomePage = new WebAppHomePage(this.browser);
        await webAppHomePage.returnToHomePage();
        return;
    }

    public async removeRepHomePageButtons(activtiyName: string): Promise<void> {
        //keep for now
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Company Profile');
        await this.browser.click(webAppSettingsSidePanel.SettingsFrameworkHomeButtons);

        try {
            await this.isSpinnerDone();
            await this.browser.switchTo(this.AddonContainerIframe);
            await this.isAddonFullyLoaded(AddonLoadCondition.Content);
        } catch (error) {
            this.browser.refresh();
            this.browser.sleep(6500);
            await this.isSpinnerDone();
            await this.browser.switchTo(this.AddonContainerIframe);
            await this.isAddonFullyLoaded(AddonLoadCondition.Content);
        }

        await this.browser.click(this.AddonContainerEditRep);

        const buttonsLocator = Object.assign({}, this.AddonContainerEditorTrashBtn);
        buttonsLocator['value'] = buttonsLocator['value'].replace('ATD_PLACE_HOLDER', activtiyName);

        let isRemovable;
        try {
            this.browser.sleep(3000);
            isRemovable = await this.browser.untilIsVisible(buttonsLocator);
        } catch (error) {
            console.log('%cNo Button To Remove, Test Continue', ConsoleColors.PageMessage);
        }
        if (isRemovable) {
            const buttonsToRemove = await this.browser.findElements(buttonsLocator);
            for (let i = 0; i < buttonsToRemove.length; i++) {
                await this.browser.click(buttonsLocator);
            }
            await this.browser.click(this.AddonContainerEditorSave);
        }

        const webAppHomePage = new WebAppHomePage(this.browser);
        await webAppHomePage.returnToHomePage();
        return;
    }
}
