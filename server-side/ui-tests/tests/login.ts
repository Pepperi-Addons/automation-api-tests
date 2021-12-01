import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppLoginPage } from '../pom/index';

export async function LoginTest(email: string, password: string) {
    let driver: Browser;

    describe('First UI Tests Suit', async function () {
        this.retries(2);

        beforeEach(async function () {
            driver = new Browser('chrome');
        });

        afterEach(async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.collectEndTestData(this);
            await driver.quit();
        });

        it('Login', async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.login(email, password);
        });
    });
}
