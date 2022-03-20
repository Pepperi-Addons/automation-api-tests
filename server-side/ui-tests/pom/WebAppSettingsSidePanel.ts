import { Browser } from '../utilities/browser';
import { Page } from './base/Page';
import config from '../../config';
import { Locator, By } from 'selenium-webdriver';

export class WebAppSettingsSidePanel extends Page {
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    //TODO: Replace SettingsBarContainer for:
    //WebApp Platform | Version: 16.60.38 = settings-bar-container
    //WebApp Platform | Version: 16.65.30/16.65.34 = pep-side-bar-container
    //public SettingsBarContainer: Locator = By.xpath('.//*[@class="settings-bar-container"]//*[@role="button"]');
    public SettingsBarContainer: Locator = By.xpath('//*[@class="pep-side-bar-container"]//*[@role="button"]');
    public static readonly PepSideBarContainer = By.xpath('//pep-side-bar');
    public static getCategoryBtn(categoryId: string): By {
        return By.xpath(
            `${WebAppSettingsSidePanel.PepSideBarContainer.value}//*[@id='${categoryId}']/ancestor::mat-expansion-panel-header[@role="button"]`,
        );
    }

    public static getSubCategoryBtn(subCategoryId: string, categoryId: string): By {
        return By.xpath(
            `${
                WebAppSettingsSidePanel.getCategoryBtn(categoryId).value
            }/parent::mat-expansion-panel//li[contains(@id,'${categoryId}')]`,
        );
    }

    //Object Types Editor Locators
    public ObjectEditorAccounts: Locator = By.id('settings/04de9428-8658-4bf7-8171-b59f6327bbf1/accounts/types');
    public ObjectEditorTransactions: Locator = By.id(
        'settings/04de9428-8658-4bf7-8171-b59f6327bbf1/transactions/types',
    );
    public ObjectEditorActivities: Locator = By.id('settings/04de9428-8658-4bf7-8171-b59f6327bbf1/activities/types');

    //Branded App / Settings Framework Locators
    public SettingsFrameworkHomeButtons: Locator = By.id(
        'settings/354c5123-a7d0-4f52-8fce-3cf1ebc95314/editor?view=company_webapp_homebuttons',
    );
    public BrandedAppBranding: Locator = By.id(
        'settings/354c5123-a7d0-4f52-8fce-3cf1ebc95314/editor?view=company_branding',
    );
    public CatalogsSection: Locator = By.id(
        'settings/354c5123-a7d0-4f52-8fce-3cf1ebc95314/editor?view=catalogs_manage',
    );

    //Promotion Locators
    public ItemTPEditor: Locator = By.id('custom_plugin/b5c00007-0941-44ab-9f0e-5da2773f2f04/default_editor');
    public OrderTPEditor: Locator = By.id('custom_plugin/375425f5-cd2f-4372-bb88-6ff878f40630/default_editor');
    public PackageTPEditor: Locator = By.id('custom_plugin/90b11a55-b36d-48f1-88dc-6d8e06d08286/default_editor');

    public async selectSettingsByID(settingsButtonID: string): Promise<void> {
        const selectedSettings = Object.assign({}, this.SettingsBarContainer);
        selectedSettings['value'] += `//*[contains(@id,"${settingsButtonID}")]/../../..`;
        await this.browser.click(selectedSettings);
        return;
    }

    public async isCategoryExpanded(categoryId: string): Promise<boolean> {
        return this.browser
            .getElementAttribute(WebAppSettingsSidePanel.getCategoryBtn(categoryId), 'aria-expanded')
            .then((ariaExpanded) => ariaExpanded === 'true');
    }

    public async expandSettingsCategory(categoryId: string): Promise<void> {
        return this.isCategoryExpanded(categoryId).then((isExpanded) => {
            if (!isExpanded) {
                return this.browser.click(WebAppSettingsSidePanel.getCategoryBtn(categoryId));
            }
        });
    }

    public async clickSettingsSubCategory(subCategoryId: string, categoryId: string): Promise<void> {
        this.browser.click(WebAppSettingsSidePanel.getSubCategoryBtn(subCategoryId, categoryId));
        return;
    }

    public async enterSettingsPage(categoryId: string, subCategoryId: string): Promise<void> {
        this.expandSettingsCategory(categoryId).then(() => this.clickSettingsSubCategory(subCategoryId, categoryId));
    }
}
