import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppLoginPage } from '../pom/index';

export async function LoginTests(email: string, password: string, withImage?: boolean) {
    let driver: Browser;

    describe('Basic UI Tests Suit', async function () {
        this.retries(1);

        beforeEach(async function () {
            driver = await Browser.initiateChrome();
        });

        afterEach(async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.collectEndTestData(this);
            await driver.quit();
        });

        it('Login', async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            if (withImage != undefined && !withImage) {
                await webAppLoginPage.login(email, password);
            } else {
                await webAppLoginPage.loginWithImage(email, password);
            }
        });
    });
}
