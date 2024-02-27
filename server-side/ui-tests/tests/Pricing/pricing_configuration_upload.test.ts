import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import { Browser } from '../../utilities/browser';
import { WebAppLoginPage, WebAppHomePage } from '../../pom';
import addContext from 'mochawesome/addContext';
import GeneralService from '../../../services/general.service';
import PricingConfiguration from '../../pom/addons/PricingConfiguration';

chai.use(promised);

export async function PricingConfigUpload(
    client: Client,
    email: string,
    password: string,
    specificVersion: 'version07for05data' | undefined = undefined,
) {
    const pricingConfiguration = new PricingConfiguration();
    const generalService = new GeneralService(client);
    const allInstalledAddons = await generalService.getInstalledAddons({ page_size: -1 });
    const installedPricingVersion = allInstalledAddons.find((addon) => addon.Addon.Name == 'pricing')?.Version;
    const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let base64ImageComponent;
    let pricingConfig;

    describe(`Setting Configuration File - Pricing Version: ${installedPricingVersion} ${
        specificVersion ? `| with 05 data` : ''
    }`, () => {
        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
        });

        after(async function () {
            await driver.quit();
        });

        specificVersion === undefined &&
            it('Sending configuration object to end point', async function () {
                switch (installedPricingVersionShort) {
                    case '5':
                        console.info('AT installedPricingVersion CASE 5');
                        pricingConfig = pricingConfiguration.version05;
                        break;
                    case '6':
                        console.info('AT installedPricingVersion CASE 6');
                        pricingConfig = pricingConfiguration.version06;
                        break;

                    default:
                        console.info('AT installedPricingVersion Default');
                        pricingConfig = pricingConfiguration.version07;
                        break;
                }
                await uploadConfiguration(pricingConfig);
                addContext(this, {
                    title: `Config =`,
                    value: JSON.stringify(pricingConfig, null, 2),
                });
            });

        specificVersion !== undefined &&
            it('Sending version07 for 05data configuration object to end point', async function () {
                pricingConfig = pricingConfiguration[specificVersion];
                await uploadConfiguration(pricingConfig);
                addContext(this, {
                    title: `Config =`,
                    value: JSON.stringify(pricingConfig, null, 2),
                });
            });

        describe(`Login to Pricing Test User after Configuration Upload | Ver ${installedPricingVersion}`, () => {
            it('Login', async function () {
                await webAppLoginPage.login(email, password);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });

            it('Manual Sync', async () => {
                await webAppHomePage.manualResync(client);
            });

            it('Logout', async function () {
                await webAppLoginPage.logout();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Logged out`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
        });
    });

    async function uploadConfiguration(payload: any) {
        const uploadConfigResponse = await generalService.fetchStatus(
            `/addons/api/adb3c829-110c-4706-9168-40fba9c0eb52/api/configuration`,
            {
                method: 'POST',
                body: JSON.stringify({
                    Key: 'main',
                    Config: JSON.stringify(payload),
                }),
            },
        );
        console.info('uploadConfigResponse: ', JSON.stringify(uploadConfigResponse, null, 2));
        expect(uploadConfigResponse.Ok).to.equal(true);
        expect(uploadConfigResponse.Status).to.equal(200);
        expect(Object.keys(uploadConfigResponse.Body)).to.eql([
            'ModificationDateTime',
            'Hidden',
            'CreationDateTime',
            'Config',
            'Key',
        ]);
        expect(uploadConfigResponse.Body.Key).to.equal('main');
    }
}
