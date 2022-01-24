import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Locator, By } from 'selenium-webdriver';

export class WebAppHeader extends Page {
    constructor(browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public CompanyLogo: Locator = By.css('[data-qa="orgLogo"]'); //'app-root header pepperi-header #header'
    public Settings: Locator = By.css('[data-qa="systemSettings"]');
    public Help: Locator = By.css('[data-qa="systemSuppot"]');
    public UserBtn: Locator = By.css('[data-qa="systemAvatar"]');
    public Home: Locator = By.css('[data-qa="systemHome"]');

    public async openSettings() {
        await this.browser.click(this.Settings);
        return;
    }
}
