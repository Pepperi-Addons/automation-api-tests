import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage, WebAppLoginPage } from '../pom';
import { Client } from '@pepperi-addons/debug-server/dist';

chai.use(promised);

export async function XTimesSync(email: string, password: string, client: Client, X) {
    let driver: Browser;

    describe('Sync X Times', async function () {
        describe('Sync', () => {
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
            it(`sync X times, this time X = ${X}`, async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < X; index++) {
                    console.log(`running fot the ${index + 1} time out of ${X} times`);
                    await webAppHomePage.manualResync(client);
                }
            });
        });
    });
}
