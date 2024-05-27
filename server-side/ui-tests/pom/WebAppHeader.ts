import { Browser } from '../utilities/browser';
import { Page } from './Pages/base/Page';
import config from '../../config';
import { By } from 'selenium-webdriver';
import { WebAppSettingsSidePanel } from './Components/WebAppSettingsSidePanel';

export class WebAppHeader extends Page {
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public CompanyLogo: By = By.css('[data-qa="orgLogo"]'); //'app-root header pepperi-header #header'
    public Settings: By = By.css('[data-qa="systemSettings"]');
    public Help: By = By.css('[data-qa="systemSuppot"]');
    public UserBtn: By = By.xpath('//*[contains(@data-qa,"Avatar")]');
    public Home: By = By.css('[data-qa="systemHome"]');

    // User Details Popup
    public UserDetails_PopupList: By = By.xpath('//ul[@id="userMenu"]');
    public SignOutBtn: By = By.xpath('//li[@id="btnSignOut"]');

    public async openSettings() {
        await this.browser.click(this.Settings);
        this.browser.sleep(2.5 * 1000);
        return;
    }

    public async goHome() {
        try {
            if (!(await this.browser.getCurrentUrl()).includes('HomePage')) {
                await this.browser.click(this.Home);
                this.browser.sleep(1000);
            }
        } catch (error) {
            // bug: DI-27559
            console.error(error);
            await this.browser.navigate(`${this.url}/HomePage`);
        }
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
        loadingLocator: By = By.css('#loadingSpinnerModal'),
        timeOut = 30000,
        timeOutToDisplay = 1000,
        errorOnNoLoad = false,
    ): Promise<WebAppSettingsSidePanel> {
        await this.browser.click(this.Settings);
        await this.browser.waitForLoading(loadingLocator, timeOut, timeOutToDisplay, errorOnNoLoad);
        return new WebAppSettingsSidePanel(this.browser);
    }

    public async signOut() {
        await this.browser.click(this.UserBtn);
        await this.browser.untilIsVisible(this.UserDetails_PopupList);
        await this.browser.untilIsVisible(this.SignOutBtn);
        await this.browser.click(this.SignOutBtn);
    }
}
