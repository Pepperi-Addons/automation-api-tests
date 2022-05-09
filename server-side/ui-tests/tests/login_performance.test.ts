import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import { WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
import { expect } from 'chai';
import { VarListOfDists } from '../pom/addons/VarListOfDists';

export async function LoginPerfTests(email: string, password: string, varPass, client) {
    let driver: Browser;
    
    describe('Basic UI Tests Suit', async function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
        });

        after(async function () {
            await driver.quit();
        });

        afterEach(async function () {
            const webAppHomePage = new WebAppHomePage(driver);
            await webAppHomePage.collectEndTestData(this);
        });

        it('Reset Nuc For The User Using VAR UI', async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.login(varPass.split(":")[0], varPass.split(":")[1]);
            const webAppHeader = new WebAppHeader(driver);
            await webAppHeader.openSettings();
            const webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
            await webAppSettingsSidePanel.selectSettingsByID('Var');
            await driver.click(webAppSettingsSidePanel.VarDistsEditor);
            const varListOfDistsPage = new VarListOfDists(driver);
            await varListOfDistsPage.isSpinnerDone();
            await driver.switchTo(varListOfDistsPage.AddonContainerIframe);
            await expect(varListOfDistsPage.untilIsVisible(varListOfDistsPage.IdRowTitle, 90000)).eventually.to.be.true;
            // const webAppList = new WebAppList(driver);
            // const cartMatrix: string[][] = await webAppList.getCartListGridlineAsMatrix();
            // console.table(cartMatrix);
            debugger;
        });
    });
}
