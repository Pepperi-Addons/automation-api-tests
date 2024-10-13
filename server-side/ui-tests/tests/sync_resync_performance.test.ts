import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Client } from '@pepperi-addons/debug-server/dist';
import { Browser } from '../utilities/browser';
import {
    WebAppLoginPage,
    // WebAppHomePage,
    // WebAppHeader,
    // WebAppList
} from '../pom';
import {
    describe,
    it,
    // afterEach,
    before,
    after,
} from 'mocha';
import chai, { expect } from 'chai';
import GeneralService from '../../services/general.service';
import E2EUtils from '../utilities/e2e_utils';
// import { ObjectsService } from '../../services/objects.service';
// import { OpenCatalogService } from '../../services/open-catalog.service';
// import { UDCService } from '../../services/user-defined-collections.service';
// import { ListAbiTestData } from '../pom/addons/ListAbiTestData';
// import addContext from 'mochawesome/addContext';

chai.use(promised);

export async function SyncResyncPerformanceTests(email: string, password: string, client: Client, varPass: string) {
    /** Description **/
    /* the Nebulus / Nebula Performance Tests measure sync & resync perform time with the following scenarios:
        0 - sync
        add 10k - sync
        add/modify 1k - sync
        add 100k - sync
        add/modify 1k - sync
        in UDT, UDC+nebulus / UDC+nebula
        
        UDC should have 1 field with about 200 chars
    */

    const generalService = new GeneralService(client);
    // const udcService = new UDCService(generalService);
    // const objectsService = new ObjectsService(generalService);
    // const openCatalogService = new OpenCatalogService(generalService);
    const dateTime = new Date();

    await generalService.baseAddonVersionsInstallation(varPass);

    const testData = {
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''], // open-sync 2.0.% or 3.%
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        Nebulus: ['e8b5bb3a-d2df-4828-90f4-32cc3d49f207', ''], // dependency of UDC
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''], // UDC current phased version 0.8.29 | dependency > 0.8.11
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);

    describe(`Prerequisites Addons for Lists Tests - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } | Tested user: ${email} | Date Time: ${dateTime}`, () => {
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            const currentAddonChnageVersionResponse = chnageVersionResponseArr[addonName];
            const varLatestVersion = currentAddonChnageVersionResponse[2];
            const changeType = currentAddonChnageVersionResponse[3];
            const status = currentAddonChnageVersionResponse[4];
            const note = currentAddonChnageVersionResponse[5];

            describe(`"${addonName}"`, () => {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                    if (status == 'Failure') {
                        expect(note).to.include('is already working on version');
                    } else {
                        expect(status).to.include('Success');
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

    const installedSyncVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Sync',
    )?.Version;
    const installedNebulaVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Nebula',
    )?.Version;
    const installedNebulusVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Nebulus',
    )?.Version;

    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    // let webAppHomePage: WebAppHomePage;
    // let webAppHeader: WebAppHeader;
    // let webAppList: WebAppList;
    let e2eUtils: E2EUtils;

    describe(`Sync Resync Performance Test Suite |  Sync Ver: ${installedSyncVersion}, Nebulus Ver: ${installedNebulusVersion}, Nebula Ver: ${installedNebulaVersion}`, async () => {
        describe('Lists ABI UI tests', async () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                // webAppHomePage = new WebAppHomePage(driver);
                // webAppHeader = new WebAppHeader(driver);
                e2eUtils = new E2EUtils(driver);
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async () => {
                await webAppLoginPage.login(email, password);
            });

            it('Perform Manual Sync With Time Measurement', async function () {
                const syncTime = await e2eUtils.performManualSyncWithTimeMeasurement.bind(this)(client, driver);
                addContext(this, {
                    title: `Sync Time Interval`,
                    value: syncTime.toString(),
                });
                expect(syncTime).to.be('number').and.greaterThan(0);
            });

            it('Perform Manual Resync With Time Measurement', async function () {
                const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
                addContext(this, {
                    title: `Resync Time Interval`,
                    value: resyncTime.toString(),
                });
                expect(resyncTime).to.be('number').and.greaterThan(0);
            });
        });
    });
}
