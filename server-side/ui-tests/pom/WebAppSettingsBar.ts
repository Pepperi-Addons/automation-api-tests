import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Locator, By } from 'selenium-webdriver';

export class WebAppSettingsBar extends Page {
    constructor(browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public SettingsBarContainer: Locator = By.xpath('.//*[@class="settings-bar-container"]//*[@role="button"]');

    public async selectSettingsByID(settingsButtonID: string): Promise<void> {
        const selectedSettings = Object.assign({}, this.SettingsBarContainer);
        selectedSettings['value'] += `//*[@id="${settingsButtonID}"]/../../..`
        debugger;
        await this.browser.click(selectedSettings).then(
            async (res) => {
               debugger;
            }, 
            (err) => {
                debugger;
                console.log(`Element ${selectedSettings.toString()} not found`);
            },
        );
        debugger;
        return;
    }
}

// [id='ERP Integrarion']
