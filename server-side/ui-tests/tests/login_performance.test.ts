import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
import { expect } from 'chai';
import { VarDistPage } from '../pom/addons/VarDistPage';
import { Key } from 'selenium-webdriver';
import addContext from 'mochawesome/addContext';


export async function LoginPerfTests(email: string, password: string, varPass, client) {
    let driver: Browser;

    describe('Basic UI Tests Suit', async function () {
        this.retries(0);

        beforeEach(async function () {
            driver = await Browser.initiateChrome();
        });

        afterEach(async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.collectEndTestData(this);
            await driver.quit();
        });
        it('Loggin With VAR User And Reset Nuc For The User About To Be Tested Using VAR UI', async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.login(varPass.split(":")[0], varPass.split(":")[1]);
            const webAppHeader = new WebAppHeader(driver);
            await webAppHeader.openSettings();
            const webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
            await webAppSettingsSidePanel.selectSettingsByID('Var');
            await driver.click(webAppSettingsSidePanel.VarDistsEditor);
            const varListOfDistsPage = new VarDistPage(driver);
            await varListOfDistsPage.isSpinnerDone();
            await driver.switchTo(varListOfDistsPage.AddonContainerIframe);
            await expect(varListOfDistsPage.untilIsVisible(varListOfDistsPage.list.IdRowTitle, 90000)).eventually.to.be.true;
            await varListOfDistsPage.search.enterSearch(email + Key.ENTER);
            expect(await varListOfDistsPage.editPresentedDist()).to.be.true;
            expect(await varListOfDistsPage.enterSupportSettings()).to.be.true;
            await varListOfDistsPage.recycleNuc();
        });

        it('Login With The Recycled User And Measure Time The Process Took', async function () {
            const localAVG = 9900;
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.navigate();
            await webAppLoginPage.signIn(email, password);
            const webAppHeader = new WebAppHeader(driver);
            // starting as soon as the btton was pressed 
            const duration = await driver.queryNetworkLogsForCertainResponseAndReturnTiming('https://webapi.pepperi.com/16.80.7/webapi/Service1.svc/v1/HomePage');
            addContext(this, {
                title: `duration time is:`,
                value: `local AVG: ${localAVG}, this run duration:${duration}`,
            });
            expect(duration).to.be.lessThan(localAVG, `this run duration took ${(((duration - localAVG) / localAVG) * 100).toFixed(3)} present longer then the local AVG`);
        });
    });
}


