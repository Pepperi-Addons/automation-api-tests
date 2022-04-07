import { Browser } from '../utilities/browser';
import { Page } from './Pages/base/Page';
import config from '../../config';
import { Locator, By } from 'selenium-webdriver';
import { WebAppSettingsSidePanel } from './WebAppSettingsSidePanel';

export class WebAppHeader extends Page {
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public CompanyLogo: Locator = By.css('[data-qa="orgLogo"]'); //'app-root header pepperi-header #header'
    public Settings: Locator = By.css('[data-qa="systemSettings"]');
    public Help: Locator = By.css('[data-qa="systemSuppot"]');
    public UserBtn: Locator = By.css('[data-qa="systemAvatar"]');
    public Home: Locator = By.css('[data-qa="systemHome"]');

    public async openSettings() {
        await this.browser.click(this.Settings);
        await this.browser.sleep(1800);
        return;
    }

    /**
     * Possibly temp function (Hopefully replace 'openSettings' function)
     * Navigates to Webapp Settings via icon and waits for loading to complete.
     * @param loadingLocator Locator of the loading element.
     * @param timeOut Timeout, in MS, until loading has ended (loading element no longer visible).
     * @param timeOutToDisplay Timeout, in MS, until loading first appears.
     * @param errorOnNoLoad Should an error be thrown when loading element is not displayed until defined threshold is reached.
     * @returns An instance of {@link WebAppSettingsSidePanel} to continue navigation.
     */
    public async openSettingsAndLoad(
        loadingLocator: Locator = By.css('#loadingSpinnerModal'),
        timeOut = 30000,
        timeOutToDisplay = 1000,
        errorOnNoLoad = false,
    ): Promise<WebAppSettingsSidePanel> {
        await this.browser.click(this.Settings);
        await this.browser.waitForLoading(loadingLocator, timeOut, timeOutToDisplay, errorOnNoLoad);
        return new WebAppSettingsSidePanel(this.browser);
    }
}
