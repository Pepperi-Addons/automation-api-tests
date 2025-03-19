import promised from 'chai-as-promised';
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
// import { By } from 'selenium-webdriver';
import GeneralService from '../../services/general.service';
// import { ObjectsService } from '../../services/objects.service';
// import { OpenCatalogService } from '../../services/open-catalog.service';
// import { UDCService } from '../../services/user-defined-collections.service';
import E2EUtils from '../utilities/e2e_utils';
// import addContext from 'mochawesome/addContext';

chai.use(promised);

export async function BuyerManagementTests(email: string, password: string, client: Client, varPass: string) {
    /** Description **/
    /*   */

    const generalService = new GeneralService(client);
    // const udcService = new UDCService(generalService);
    // const objectsService = new ObjectsService(generalService);
    // const openCatalogService = new OpenCatalogService(generalService);
    const dateTime = new Date();

    await generalService.baseAddonVersionsInstallation(varPass);

    const testData = {
        'Buyer Management': ['ee953146-b133-4ba2-bdc4-dd15ac2b76a4', ''],
        lists: ['c7928eb4-d931-43bb-83c6-90e939667b45', ''],
        forms: ['9ab9f9ea-8bc8-4d54-a1d5-af80abdcd847', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);

    describe(`Prerequisites Addons for Buyer Management Tests - ${
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

    const installedBuyerManagementVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Buyer Management',
    )?.Version;

    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    // let webAppHomePage: WebAppHomePage;
    // let webAppHeader: WebAppHeader;
    // let webAppList: WebAppList;
    let e2eUtils: E2EUtils;

    describe(`Buyer Management Test Suite | Ver: ${installedBuyerManagementVersion}`, async () => {
        describe('Buyer Management UI tests', async () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                // webAppHomePage = new WebAppHomePage(driver);
                // webAppHeader = new WebAppHeader(driver);
                // webAppList = new WebAppList(driver);
                e2eUtils = new E2EUtils(driver);
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async () => {
                await webAppLoginPage.login(email, password);
            });

            it('Perform Manual Sync', async function () {
                await e2eUtils.performManualSync.bind(this)(client, driver);
            });
        });
    });
}
