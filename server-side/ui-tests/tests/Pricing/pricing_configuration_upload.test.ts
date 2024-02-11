import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { PricingData05 } from '../../pom/addons/Pricing05';
import { PricingData06 } from '../../pom/addons/Pricing06';
import { PricingData07 } from '../../pom/addons/Pricing07';
import { Browser } from '../../utilities/browser';
import { WebAppLoginPage, WebAppHomePage } from '../../pom';
import addContext from 'mochawesome/addContext';

chai.use(promised);

export async function PricingConfigUpload(client: Client, email: string, password: string) {
    const generalService = new GeneralService(client);
    const allInstalledAddons = await generalService.getInstalledAddons({ page_size: -1 });
    const installedPricingVersion = allInstalledAddons.find((addon) => addon.Addon.Name == 'pricing')?.Version;
    const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    let pricingData;
    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let base64ImageComponent;

    describe('Setting Configuration File', () => {
        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
        });

        after(async function () {
            await driver.quit();
        });

        it('Sending configuration object to end point', async () => {
            switch (installedPricingVersionShort) {
                case '5':
                    console.info('AT installedPricingVersion CASE 5');
                    pricingData = new PricingData05();
                    // await uploadConfiguration(pricingData.config_05);
                    break;
                case '6':
                    console.info('AT installedPricingVersion CASE 6');
                    pricingData = new PricingData06();
                    break;
                case '7':
                    console.info('AT installedPricingVersion CASE 7');
                    pricingData = new PricingData07();
                    break;

                default:
                    console.info('AT installedPricingVersion Default');
                    pricingData = new PricingData07();
                    break;
            }
            await uploadConfiguration(pricingData.config);
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
