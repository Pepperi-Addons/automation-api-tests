import { Browser } from '../ui-tests/utilities/browser';
import { Context } from 'vm';
import { WebAppLoginPage, WebAppHomePage, WebAppHeader, WebAppList, WebAppTopBar, WebAppDialog } from '../ui-tests/pom';
import addContext from 'mochawesome/addContext';
import { NeltPerformance } from '../ui-tests/pom/NeltPerformance';

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

    public async startNewSalesOrderTransaction(nameOfAccount: string): Promise<string> {
        await this.webAppHeader.goHome();
        await this.webAppHomePage.isSpinnerDone();
        await this.webAppHomePage.click(this.webAppHomePage.MainHomePageBtn);
        this.browser.sleep(0.1 * 1000);
        await this.webAppHeader.isSpinnerDone();
        await this.webAppList.clickOnFromListRowWebElementByName(nameOfAccount);
        this.browser.sleep(0.1 * 1000);
        await this.webAppHeader.click(this.webAppTopBar.DoneBtn);
        await this.webAppHeader.isSpinnerDone();
        if (await this.webAppHeader.safeUntilIsVisible(this.webAppDialog.Dialog, 5000)) {
            this.browser.sleep(0.1 * 1000);
            await this.webAppDialog.selectDialogBoxBeforeNewOrder();
        }
        this.browser.sleep(0.1 * 1000);
        await this.webAppHeader.isSpinnerDone();
        await this.browser.untilIsVisible(this.neltPerformance.Cart_Button);
        await this.browser.untilIsVisible(this.neltPerformance.TransactionUUID);
        const trnUUID = await (await this.browser.findElement(this.neltPerformance.TransactionUUID)).getText();
        this.browser.sleep(0.1 * 1000);
        return trnUUID;
    }

    public async clearOrderCenterSearch(): Promise<void> {
        await this.neltPerformance.isSpinnerDone();
        await this.browser.click(this.neltPerformance.Search_X_Button);
        this.browser.sleep(0.1 * 1000);
        await this.neltPerformance.isSpinnerDone();
    }

    public async searchInAccounts(this: Context, nameOfItem: string, driver: Browser): Promise<void> {
        const neltPerformance = new NeltPerformance(driver);
        await neltPerformance.isSpinnerDone();
        const searchInput = await driver.findElement(neltPerformance.Search_Input);
        await searchInput.clear();
        driver.sleep(0.1 * 1000);
        await searchInput.sendKeys(nameOfItem + '\n');
        driver.sleep(0.5 * 1000);
        await driver.click(neltPerformance.HtmlBody);
        driver.sleep(0.1 * 1000);
        await driver.click(neltPerformance.Search_Magnifier_Button);
        driver.sleep(0.1 * 1000);
        await neltPerformance.isSpinnerDone();
        this.base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Accounts - after Search for "${nameOfItem}"`,
            value: 'data:image/png;base64,' + this.base64Image,
        });
    }
}
