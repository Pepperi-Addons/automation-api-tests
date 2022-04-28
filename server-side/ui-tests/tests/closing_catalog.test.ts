import { Client } from '@pepperi-addons/debug-server/dist';
import { GeneralService } from '../../services';
import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppLoginPage } from '../pom';
import { By } from 'selenium-webdriver';
import { expect } from 'chai';

export async function CloseCatalogTest(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    let driver: Browser;

    await generalService.baseAddonVersionsInstallation(varPass);
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

        it('Login - Goto Sales Order And Test If Closing Catalog Create A General Error', async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            const WebAppHomePage = await webAppLoginPage.login(email, password);
            await WebAppHomePage.initiateSalesActivity(undefined, undefined, false);
            await driver.click(WebAppHomePage.MainHomePageBtn);
            driver.sleep(2000);
            try {
                const erroDialog = await driver.findElement(By.css('pep-dialog > div > span'));
                const errorText = await erroDialog.getText();
                expect(errorText).to.include('Error');
                expect.fail('general error message recived after closgin catalog and returning to order center');
            } catch (e) {
                const errorMessage = (e as Error).message;
                if (errorMessage === 'general error message recived after closgin catalog and returning to order center') {
                    expect.fail('general error message recived after closgin catalog and returning to order center');
                } else {
                    return;
                }
            }
        });
    });
}
