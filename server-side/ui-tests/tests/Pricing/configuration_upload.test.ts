import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import { Browser } from '../../utilities/browser';
import { WebAppLoginPage } from '../../pom';
import addContext from 'mochawesome/addContext';
import GeneralService from '../../../services/general.service';
import PricingConfiguration from '../../pom/addons/PricingConfiguration';
import E2EUtils from '../../utilities/e2e_utils';

chai.use(promised);

export async function PricingConfigUpload(
    client: Client,
    email: string,
    password: string,
    specificVersion: 'version07for05data' | 'noUom' | undefined = undefined,
) {
    const pricingConfiguration = new PricingConfiguration();
    const generalService = new GeneralService(client);
    const allInstalledAddons = await generalService.getInstalledAddons({ page_size: -1 });
    const installedPricingVersion = allInstalledAddons.find((addon) => addon.Addon.Name == 'Pricing')?.Version;
    // const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    let driver: Browser;
    let e2eUtils: E2EUtils;
    let webAppLoginPage: WebAppLoginPage;
    let base64ImageComponent;
    let pricingConfig;

    describe(`Setting Configuration File - Pricing Version: ${installedPricingVersion} ${
        specificVersion === 'version07for05data' ? `| with 05 data` : specificVersion === 'noUom' ? `| with NO UOM` : ''
    }`, () => {
        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            e2eUtils = new E2EUtils(driver);
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
                await uploadConfiguration(pricingConfig);
                addContext(this, {
                    title: `Config =`,
                    value: JSON.stringify(pricingConfig, null, 2),
                });
            });

        specificVersion === 'version07for05data' &&
            it(`Sending version07 for 05data configuration object to end point`, async function () {
                pricingConfig = pricingConfiguration.version07for05data;
                await uploadConfiguration(pricingConfig);
                addContext(this, {
                    title: `Config =`,
                    value: JSON.stringify(pricingConfig, null, 2),
                });
            });

        specificVersion === 'noUom' &&
            it('Sending configuration without UOM to end point', async function () {
                const configVersion = installedPricingVersion?.startsWith('0.8') ? 'version08noUom' : 'version1noUom'; // version1noUom does not exist yet (May 2024)
                pricingConfig = pricingConfiguration[configVersion];
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

            it('Manual Resync', async () => {
                await e2eUtils.performManualResync(client);
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