import promised from 'chai-as-promised';
import chai from 'chai';
import {
    describe,
    it,
    // afterEach,
    before,
    after,
} from 'mocha';
import addContext from 'mochawesome/addContext';
import { Browser } from '../../utilities/browser';
import { IpaasLoginPage } from '../../pom/Pages/IpaasLogin';
import { IpaasPage } from '../../pom/Pages/Ipaas';

chai.use(promised);

/** Description **/
/* The Basic UI Test Flow for iPass 
    to run the test on PROD:
    npm run ui-show-report --server=prod --chrome_headless=false --user_email='webapp.qa@pepperitest.com' --user_pass='Aa123456' --var_pass='VarQA@pepperitest.com:8n@V5X' --tests='IpaasDataflow' --ipaas_email='ipaas.automation@qatest.com' --ipaas_pass='3V=xin:J1J@7'
*/
export async function IPaasDataflowTests(email: string, password: string) {
    const dateTime = new Date();

    let driver: Browser;
    let iPaasLoginPage: IpaasLoginPage;
    let iPaasPage: IpaasPage;

    describe(`iPaaS DATAFLOW Test Suite | ${dateTime}`, async () => {
        describe('UI Tests', async () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                iPaasLoginPage = new IpaasLoginPage(driver);
                iPaasPage = new IpaasPage(driver);
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async function () {
                // await driver.navigate('https://integration.pepperi.com/mgr');
                await iPaasLoginPage.navigateToLoginPage();
                driver.sleep(1 * 1000);
                let screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Login Page`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                await iPaasLoginPage.performLogin(email, password);
                driver.sleep(1 * 1000);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Login Page`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "Dataflow Logs" at Top Menu', async function () {
                await iPaasPage.clickButtonAtTopMenuByText('Dataflow Logs');
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Dataflow Logs" button clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });
        });
    });
}
