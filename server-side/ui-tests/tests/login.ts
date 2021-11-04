import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppLoginPage, WebAppHeader } from '../pom/index';
import addContext from 'mochawesome/addContext';

chai.use(promised);

export async function LoginTest(email: string, password: string) {
    let driver: Browser;

    describe('First UI Tests Suit', async function () {
        this.retries(1);

        beforeEach(async function () {
            driver = new Browser('chrome');
        });

        afterEach(async function () {
            if (this.currentTest.state != 'passed') {
                const base64Image = await driver.saveScreenshots();
                const url = await driver.getCurrentUrl();
                //Wait for all the logs to be printed (this usually take more then 3 seconds)
                console.log('Test Failed');
                driver.sleep(6006);
                const consoleLogs = await driver.getConsoleLogs();
                addContext(this, {
                    title: 'URL',
                    value: url,
                });
                addContext(this, {
                    title: `Image`,
                    value: 'data:image/png;base64,' + base64Image,
                });
                addContext(this, {
                    title: 'Console Logs',
                    value: consoleLogs,
                });
            }
            await driver.close();
        });

        it('Login', async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.navigate();
            await webAppLoginPage.signInAs(email, password);
            const webAppHeader = new WebAppHeader(driver);
            await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo, 90000)).eventually.to.be.true;
        });
    });
}
