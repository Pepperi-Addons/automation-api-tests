import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage, WebAppLoginPage } from '../pom';
import { Client } from '@pepperi-addons/debug-server/dist';
import { GeneralService } from '../../services';

chai.use(promised);

export async function XTimesSync(email: string, password: string, client: Client, X) {
    let driver: Browser;
    // let env;
    const service = new GeneralService(client);
    // if (service.papiClient['options'].baseURL.includes('staging')) {
    //     env = 'SB';
    // } else if (service.papiClient['options'].baseURL.includes('eu')) {
    //     env = 'EU';
    // } else {
    //     env = 'PRDO';
    // }

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
                    if (index !== 0 && index % 150 === 0) {
                        client = await service.initiateTester(email, password);
                    }
                    console.log(`running fot the ${index + 1} time out of ${X} times`);
                    await webAppHomePage.manualResync(client);
                }
            });
        });
    });
}
