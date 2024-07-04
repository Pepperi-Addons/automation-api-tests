import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import { Browser } from '../../utilities/browser';
import {
    WebAppAPI,
    WebAppDialog,
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppLoginPage,
    WebAppTopBar,
} from '../../pom';
import addContext from 'mochawesome/addContext';
import GeneralService from '../../../services/general.service';
import PricingConfiguration from '../../pom/addons/PricingConfiguration';
import E2EUtils from '../../utilities/e2e_utils';
import { PricingService } from '../../../services/pricing.service';
import { OrderPage } from '../../pom/Pages/OrderPage';

chai.use(promised);

export async function PricingConfigUpload(
    client: Client,
    email: string,
    password: string,
    specificVersion: 'version07for05data' | 'noUom' | undefined = undefined,
) {
    const baseUrl = `https://${client.BaseURL.includes('staging') ? 'app.sandbox.pepperi.com' : 'app.pepperi.com'}`;
    const pricingConfiguration = new PricingConfiguration();
    const generalService = new GeneralService(client);
    const allInstalledAddons = await generalService.getInstalledAddons({ page_size: -1 });
    const installedPricingVersion = allInstalledAddons.find((addon) => addon.Addon.Name == 'Pricing')?.Version;
    // const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    let driver: Browser;
    let e2eUtils: E2EUtils;
    let webAppAPI: WebAppAPI;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let webAppList: WebAppList;
    let webAppTopBar: WebAppTopBar;
    let webAppDialog: WebAppDialog;
    let orderPage: OrderPage;
    let pricingService: PricingService;
    let screenShot;
    let pricingConfig;

    describe(`Setting Configuration File - Pricing Version: ${installedPricingVersion} ${
        specificVersion === 'version07for05data' ? `| with 05 data` : specificVersion === 'noUom' ? `| with NO UOM` : ''
    }`, () => {
        before(async function () {
            driver = await Browser.initiateChrome();
            webAppAPI = new WebAppAPI(driver, client);
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
            webAppHeader = new WebAppHeader(driver);
            webAppList = new WebAppList(driver);
            webAppTopBar = new WebAppTopBar(driver);
            webAppDialog = new WebAppDialog(driver);
            orderPage = new OrderPage(driver);
            e2eUtils = new E2EUtils(driver);
            pricingService = new PricingService(
                driver,
                webAppLoginPage,
                webAppHomePage,
                webAppHeader,
                webAppList,
                webAppTopBar,
                webAppDialog,
                orderPage,
                generalService,
            );
        });

        after(async function () {
            await driver.quit();
        });

        specificVersion === undefined &&
            it('Sending configuration object to end point', async function () {
                switch (true) {
                    case installedPricingVersion?.startsWith('0.5'):
                        console.info('AT installedPricingVersion CASE 5');
                        pricingConfig = pricingConfiguration.version05;
                        break;
                    case installedPricingVersion?.startsWith('0.6'):
                        console.info('AT installedPricingVersion CASE 6');
                        pricingConfig = pricingConfiguration.version06;
                        break;
                    case installedPricingVersion?.startsWith('0.7'):
                        console.info('AT installedPricingVersion CASE 7');
                        pricingConfig = pricingConfiguration.version07;
                        break;
                    case installedPricingVersion?.startsWith('0.8'):
                        console.info('AT installedPricingVersion CASE 8');
                        pricingConfig = pricingConfiguration.version08;
                        break;

                    default:
                        console.info('AT installedPricingVersion Default');
                        pricingConfig = pricingConfiguration.version1; // version 1.0 is not ready yet (May 2024)
                        break;
                }
                await pricingService.uploadConfiguration(pricingConfig);
                addContext(this, {
                    title: `Sent Config`,
                    value: JSON.stringify(pricingConfig, null, 2),
                });
            });

        specificVersion === 'version07for05data' &&
            it(`Sending version07 for 05data configuration object to end point`, async function () {
                pricingConfig = pricingConfiguration.version07for05data;
                await pricingService.uploadConfiguration(pricingConfig);
                addContext(this, {
                    title: `Sent Config`,
                    value: JSON.stringify(pricingConfig, null, 2),
                });
            });

        specificVersion === 'noUom' &&
            it('Sending configuration without UOM to end point', async function () {
                const configVersion = installedPricingVersion?.startsWith('0.8') ? 'version08noUom' : 'version1noUom'; // version1noUom does not exist yet (May 2024)
                pricingConfig = pricingConfiguration[configVersion];
                await pricingService.uploadConfiguration(pricingConfig);
                addContext(this, {
                    title: `Sent Config`,
                    value: JSON.stringify(pricingConfig, null, 2),
                });
            });

        it('Validating configuration', async function () {
            const actualConfig = await pricingService.getConfiguration();
            addContext(this, {
                title: `Actual Retrieved Config`,
                value: JSON.stringify(actualConfig, null, 2),
            });
            expect(actualConfig).to.deep.equal(pricingConfig);
        });

        describe(`Login to Pricing Test User after Configuration Upload | Ver ${installedPricingVersion}`, () => {
            it('Login', async function () {
                await webAppLoginPage.login(email, password);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Manual Resync', async function () {
                await e2eUtils.performManualResync.bind(this)(client, driver);
            });

            it('If Error popup appear - close it', async function () {
                await driver.refresh();
                const accessToken = await webAppAPI.getAccessToken();
                await webAppAPI.pollForResyncResponse(accessToken, 100);
                try {
                    await webAppHomePage.isDialogOnHomePAge(this);
                } catch (error) {
                    console.error(error);
                } finally {
                    await driver.navigate(`${baseUrl}/HomePage`);
                }
                await webAppAPI.pollForResyncResponse(accessToken);
            });

            it('Logout', async function () {
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `Before logout`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                const accessToken = await webAppAPI.getAccessToken();
                await webAppAPI.pollForResyncResponse(accessToken, 100);
                try {
                    await webAppHomePage.isDialogOnHomePAge(this);
                } catch (error) {
                    console.error(error);
                } finally {
                    await driver.navigate(`${baseUrl}/HomePage`);
                }
                await webAppAPI.pollForResyncResponse(accessToken);
                await driver.untilIsVisible(webAppHomePage.MainHomePageBtn);
                await webAppLoginPage.logout();
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `Logged out`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });
        });
    });
}
