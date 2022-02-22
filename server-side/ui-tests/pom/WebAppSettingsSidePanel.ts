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
    public SettingsBarContainer: Locator = By.xpath('.//*[@class="pep-side-bar-container"]//*[@role="button"]');

    //Object Types Editor Locators
    public ObjectEditorAccounts: Locator = By.id('settings/04de9428-8658-4bf7-8171-b59f6327bbf1/accounts/types');
    public ObjectEditorTransactions: Locator = By.id(
        'settings/04de9428-8658-4bf7-8171-b59f6327bbf1/transactions/types',
    );
    public ObjectEditorNGX: Locator = By.id('settings/47db1b61-e1a7-42bd-9d55-93dd85044e91/Buttons');
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
}
