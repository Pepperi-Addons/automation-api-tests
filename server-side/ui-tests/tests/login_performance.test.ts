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
            // const webAppLoginPage = new WebAppLoginPage(driver);
            // await webAppLoginPage.login(varPass.split(":")[0], varPass.split(":")[1]);
            // const webAppHeader = new WebAppHeader(driver);
            // await webAppHeader.openSettings();
            // const webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
            // await webAppSettingsSidePanel.selectSettingsByID('Var');
            // await driver.click(webAppSettingsSidePanel.VarDistsEditor);
            // const varListOfDistsPage = new VarDistPage(driver);
            // await varListOfDistsPage.isSpinnerDone();
            // await driver.switchTo(varListOfDistsPage.AddonContainerIframe);
            // await expect(varListOfDistsPage.untilIsVisible(varListOfDistsPage.list.IdRowTitle, 90000)).eventually.to.be.true;
            // await varListOfDistsPage.search.enterSearch(email + Key.ENTER);
            // expect(await varListOfDistsPage.editPresentedDist()).to.be.true;
            // expect(await varListOfDistsPage.enterSupportSettings()).to.be.true;
        });

        for (let i = 0; i < 10; i++) {
            it('Reset Nuc For The User Using VAR UI', async function () {
                const localAVG = 8500;
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.navigate();
                await webAppLoginPage.signIn(email, password);
                let consoleLogs: any[] = [];
                const webAppHeader = new WebAppHeader(driver);
                const start = Date.now();// starting as soon as the btton was pressed 
                let duration;
                //have to wait untill this - GET: https://webapi.pepperi.com/16.80.7/webapi/Service1.svc/v1/HomePage gets a 200
                outerloop: do {
                    const prefLogs = await driver.getPerformanceLogs();
                    prefLogs.forEach(logEntry => consoleLogs.push(logEntry));
                    for (let index = 0; index < consoleLogs.length; index++) {
                        if (consoleLogs[index].message.method === 'Network.responseReceived') {
                            if (consoleLogs[index].message.params.response.url === 'https://webapi.pepperi.com/16.80.7/webapi/Service1.svc/v1/HomePage' &&
                                consoleLogs[index].message.params.response.status === 200 &&
                                consoleLogs[index].message.params.response.statusText === 'OK') {
                                console.log("found as Network.responseReceived");
                                duration = Date.now() - start;
                                break outerloop;
                            }
                        }
                    }
                } while (true);
                addContext(this, {
                    title: `duration time is:`,
                    value: `${duration}`,
                });
                expect(duration).to.be.lessThan(localAVG);
            });
        }
    });
}
