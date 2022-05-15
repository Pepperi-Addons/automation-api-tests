import { Client } from '@pepperi-addons/debug-server/dist';
import { GeneralService } from '../../services';
import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppLoginPage } from '../pom';
import { By } from 'selenium-webdriver';
import { expect } from 'chai';

/*/
this test is part of 'Bug Verification' group - created to verify specific bug scenarion found by users which havent been found by other tests
https://pepperi.atlassian.net/browse/DI-20093
/*/
export async function CloseCatalogTest(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    let driver: Browser;

    await generalService.baseAddonVersionsInstallation(varPass);
    const testData = {
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '16.%'], //has to receive the most advanced version
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    describe('Basic UI Tests Suit', async function () {
        describe('Prerequisites Addons for close catalog test', () => {
            isInstalledArr.forEach((isInstalled, index) => {
                it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
                    expect(isInstalled).to.be.true;
                });
            });
            for (const addonName in testData) {
                const addonUUID = testData[addonName][0];
                const version = testData[addonName][1];
                const varLatestVersion = chnageVersionResponseArr[addonName][2];
                const changeType = chnageVersionResponseArr[addonName][3];
                describe(`Test Data: ${addonName}`, () => {
                    it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                        if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                            expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                        } else {
                            expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                        }
                    });
                    it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(varLatestVersion);
                    });
                });
            }
        });

        describe('Loggin-in, Going Inside Order Center, Closing Catalog And Verifying If General Error Received', () => {
            this.retries(0);

            beforeEach(async function () {
                driver = await Browser.initiateChrome();
            });

            afterEach(async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.collectEndTestData(this);
                await driver.quit();
            });

            it('Login - Goto Sales Order And Test If Closing Catalog Create A General Error: DI-20093', async function () {
                //TODO: match this to the newest webapp without the 'x' button
                const webAppLoginPage = new WebAppLoginPage(driver);
                const WebAppHomePage = await webAppLoginPage.loginWithImage(email, password);
                await WebAppHomePage.initiateSalesActivity(undefined, undefined, false); //will exit the catalog menu by pressing 'x' because of last param
                await driver.click(WebAppHomePage.MainHomePageBtn);
                driver.sleep(2000);
                try {
                    const erroDialog = await driver.findElement(By.css('pep-dialog > div > span'));
                    const errorText = await erroDialog.getText();
                    expect(errorText).to.include('Error');
                    expect.fail('general error message recived after closgin catalog and returning to order center');
                } catch (e) {
                    const errorMessage = (e as Error).message;
                    if (
                        errorMessage ===
                        'general error message recived after closgin catalog and returning to order center'
                    ) {
                        expect.fail(
                            'general error message recived after closgin catalog and returning to order center',
                        );
                    } else {
                        return;
                    }
                }
            });
        });
    });
}
