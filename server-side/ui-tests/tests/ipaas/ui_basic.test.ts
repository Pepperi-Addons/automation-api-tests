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

chai.use(promised);

/** Description **/
/* The Basic UI Test Flow for iPass 

*/
export async function IPaasBasicUITests(email: string, password: string) {
    const dateTime = new Date();

    let driver: Browser;
    let iPaasLoginPage: IpaasLoginPage;

    describe(`iPass Test Suite | ${dateTime}`, async () => {
        describe('UI Tests', async () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                iPaasLoginPage = new IpaasLoginPage(driver);
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
        });
    });
}
