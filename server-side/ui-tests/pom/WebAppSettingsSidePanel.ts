import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Locator, By } from 'selenium-webdriver';

export class WebAppSettingsSidePanel extends Page {
    constructor(browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public SettingsBarContainer: Locator = By.xpath('.//*[@class="settings-bar-container"]//*[@role="button"]');

    //Object Types Editor Locators
    public ObjectEditorAccounts: Locator = By.id('settings/04de9428-8658-4bf7-8171-b59f6327bbf1/accounts/types');
    public ObjectEditorTransactions: Locator = By.id(
        'settings/04de9428-8658-4bf7-8171-b59f6327bbf1/transactions/types',
    );
    public ObjectEditorActivities: Locator = By.id('settings/04de9428-8658-4bf7-8171-b59f6327bbf1/activities/types');

    //Settings Framework Locators
    public SettingsFrameworkHomeButtons: Locator = By.id(
        'settings/354c5123-a7d0-4f52-8fce-3cf1ebc95314/editor?view=company_webapp_homebuttons',
    );

    public async selectSettingsByID(settingsButtonID: string): Promise<void> {
        const selectedSettings = Object.assign({}, this.SettingsBarContainer);
        selectedSettings['value'] += `//*[@id="${settingsButtonID}"]/../../..`;
        await this.browser.click(selectedSettings);
        return;
    }
}
