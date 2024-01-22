import { Browser } from '../../utilities/browser';
import { Context } from 'vm';
import { WebAppLoginPage, WebAppHomePage, WebAppHeader, WebAppList, WebAppTopBar, WebAppDialog } from '../../pom';
import addContext from 'mochawesome/addContext';
import { NeltPerformance } from './NeltPerformance';

export class NeltPerformanceService {
    public browser: Browser;
    public webAppLoginPage: WebAppLoginPage;
    public webAppHomePage: WebAppHomePage;
    public webAppHeader: WebAppHeader;
    public webAppList: WebAppList;
    public webAppTopBar: WebAppTopBar;
    public webAppDialog: WebAppDialog;
    public neltPerformance: NeltPerformance;
    public base64Image;

    constructor(
        driver: Browser,
        webAppLoginPage: WebAppLoginPage,
        webAppHomePage: WebAppHomePage,
        webAppHeader: WebAppHeader,
        webAppList: WebAppList,
        webAppTopBar: WebAppTopBar,
        webAppDialog: WebAppDialog,
        neltPerformance: NeltPerformance,
    ) {
        this.browser = driver;
        this.webAppLoginPage = webAppLoginPage;
        this.webAppHomePage = webAppHomePage;
        this.webAppHeader = webAppHeader;
        this.webAppList = webAppList;
        this.webAppTopBar = webAppTopBar;
        this.webAppDialog = webAppDialog;
        this.neltPerformance = neltPerformance;
    }

    public async goHome() {
        if (!(await this.browser.getCurrentUrl()).includes('HomePage')) {
            await this.browser.click(this.neltPerformance.Home);
            this.browser.sleep(1000);
        }
        return;
    }

    public async toHomeScreen(this: Context, driver: Browser) {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        if (!(await driver.getCurrentUrl()).includes('HomePage')) {
            await driver.click(neltPerformanceSelectors.Home);
            driver.sleep(1000);
        }
        await neltPerformanceSelectors.isSpinnerDone();
        driver.sleep(0.5 * 1000);
        const base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Home Page`,
            value: 'data:image/png;base64,' + base64Image,
        });
    }

    public async searchInAccounts(this: Context, driver: Browser, nameOfItem: string): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await neltPerformanceSelectors.isSpinnerDone();
        const searchInput = await driver.findElement(neltPerformanceSelectors.Search_Input);
        await searchInput.clear();
        driver.sleep(0.1 * 1000);
        await searchInput.sendKeys(nameOfItem + '\n');
        driver.sleep(0.5 * 1000);
        await driver.click(neltPerformanceSelectors.HtmlBody);
        driver.sleep(0.1 * 1000);
        await driver.click(neltPerformanceSelectors.Search_Magnifier_Button);
        driver.sleep(0.1 * 1000);
        await neltPerformanceSelectors.isSpinnerDone();
        const base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Accounts - after Search for "${nameOfItem}"`,
            value: 'data:image/png;base64,' + base64Image,
        });
    }

    public async selectAccountViaHomePageMainButton(
        this: Context,
        driver: Browser,
        accountID: string,
        searchBy: 'ID' | 'name' = 'ID',
    ): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.click(neltPerformanceSelectors.KupciButtonAtHome);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Kupci`,
            value: 'data:image/png;base64,' + base64Image,
        });
        await neltPerformanceSelectors.isSpinnerDone();
        const searchInput = await driver.findElement(neltPerformanceSelectors.Search_Input);
        await searchInput.clear();
        driver.sleep(0.1 * 1000);
        await searchInput.sendKeys(accountID + '\n');
        driver.sleep(0.5 * 1000);
        await driver.click(neltPerformanceSelectors.HtmlBody);
        driver.sleep(0.1 * 1000);
        await driver.click(neltPerformanceSelectors.Search_Magnifier_Button);
        driver.sleep(0.1 * 1000);
        await neltPerformanceSelectors.isSpinnerDone();
        base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Accounts - after Search for "${accountID}"`,
            value: 'data:image/png;base64,' + base64Image,
        });
        const selector =
            accountID === ''
                ? neltPerformanceSelectors.FirstAccountInList
                : searchBy === 'name'
                ? neltPerformanceSelectors.getSelectorOfAccountHyperlinkByName(accountID)
                : neltPerformanceSelectors.getSelectorOfAccountHyperlinkByID(Number(accountID));
        await driver.click(selector);
        await neltPerformanceSelectors.isSpinnerDone();
        base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Account Activity List`,
            value: 'data:image/png;base64,' + base64Image,
        });
    }

    public async clickPlusButtonMenuAtAccountDashboard(this: Context, driver: Browser): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.click(neltPerformanceSelectors.AccountDashboard_PlusButton);
        await neltPerformanceSelectors.isSpinnerDone();
        const base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `After Plus Button Clicked`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
        driver.sleep(0.5 * 1000);
    }

    public async selectUnderPlusButtonMenuAtAccountDashboard(
        this: Context,
        driver: Browser,
        nameOfItem: string,
    ): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.click(neltPerformanceSelectors.AccountDashboard_PlusButton);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `After Plus Button Clicked`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
        await driver.click(neltPerformanceSelectors.getSelectorOfAccountDashboardPlusButtonMenuItemByName(nameOfItem));
        await neltPerformanceSelectors.isSpinnerDone();
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `"${nameOfItem}" chosen`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        driver.sleep(0.5 * 1000);
    }

    public async clickHamburgerMenuAtAccountDashboard(this: Context, driver: Browser): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.click(neltPerformanceSelectors.AccountDashboard_BurgerMenu);
        await neltPerformanceSelectors.isSpinnerDone();
        const base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `After Hamburger Menu Clicked`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
        driver.sleep(0.5 * 1000);
    }

    public async selectUnderHamburgerMenuAtAccountDashboard(
        this: Context,
        driver: Browser,
        nameOfItem: string,
    ): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.click(neltPerformanceSelectors.AccountDashboard_BurgerMenu);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `After Hamburger Menu Clicked`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
        await driver.click(neltPerformanceSelectors.getSelectorOfAccountDashboardHamburgerMenuItemByName(nameOfItem));
        await neltPerformanceSelectors.isSpinnerDone();
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `"${nameOfItem}" chosen`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        driver.sleep(0.5 * 1000);
    }

    public async choosingCatalogForOrder(this: Context, driver: Browser, nameOfCatalog: string): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.untilIsVisible(neltPerformanceSelectors.OrderCatalogItem);
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `Catalogs List loaded`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.click(neltPerformanceSelectors.getSelectorOfOrderCatalogByName(nameOfCatalog));
        await neltPerformanceSelectors.isSpinnerDone();
        await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
        await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
        await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_OrderButton_GridLineView);
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `At Order Center`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
    }

    public async selectVisitFlowFromMultipleVisitsSelection(
        this: Context,
        driver: Browser,
        nameOfItem: string,
    ): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `Visits Selection`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_visits_container);
        await driver.click(neltPerformanceSelectors.getSelectorOfVisitFlowAtMultipleVisitsSelectionByText(nameOfItem));
        await neltPerformanceSelectors.isSpinnerDone();
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `"${nameOfItem}" chosen`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        driver.sleep(0.5 * 1000);
    }

    public async selectVisitGroup(this: Context, driver: Browser, nameOfItem: string): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `Visit Groups`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_singleVisit_container);
        await driver.click(neltPerformanceSelectors.getSelectorOfVisitGroupByText(nameOfItem));
        await neltPerformanceSelectors.isSpinnerDone();
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `"${nameOfItem}" group chosen`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        driver.sleep(0.5 * 1000);
    }

    public async selectVisitStep(this: Context, driver: Browser, nameOfItem: string): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `Visit Steps`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_singleVisit_step);
        await driver.click(neltPerformanceSelectors.getSelectorOfVisitStepByText(nameOfItem));
        await neltPerformanceSelectors.isSpinnerDone();
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `"${nameOfItem}" step chosen`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        driver.sleep(0.5 * 1000);
    }
}
