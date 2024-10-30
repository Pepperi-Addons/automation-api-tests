import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Client } from '@pepperi-addons/debug-server/dist';
import { Browser } from '../utilities/browser';
import {
    WebAppHeader,
    // WebAppHomePage,
    WebAppLoginPage,
    WebAppSettingsSidePanel,
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

chai.use(promised);

export async function AuditDataLogAbiTests(email: string, password: string, client: Client, varPass: string) {
    /** Description **/

    const generalService = new GeneralService(client);
    const dateTime = new Date();
    const performanceMeasurements = {};

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

    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    // let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let e2eUtils: E2EUtils;
    let settingsSidePanel: WebAppSettingsSidePanel;
    let screenShot;

    describe(`Audit Data Log ABI Test Suite`, async () => {
        describe('UI Tests', async () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHeader = new WebAppHeader(driver);
                e2eUtils = new E2EUtils(driver);
                settingsSidePanel = new WebAppSettingsSidePanel(driver);
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
                    value: `milisec: ${syncTime} , ${(syncTime / 1000).toFixed(1)} S`,
                });
                performanceMeasurements['No Data Sync'] = {
                    milisec: syncTime,
                    sec: Number((syncTime / 1000).toFixed(1)),
                };
                expect(syncTime).to.be.a('number').and.greaterThan(0);
            });

            it('Perform Manual Resync With Time Measurement', async function () {
                const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
                addContext(this, {
                    title: `Resync Time Interval`,
                    value: `milisec: ${resyncTime} , ${(resyncTime / 1000).toFixed(1)} S`,
                });
                performanceMeasurements['No Data Resync'] = {
                    milisec: resyncTime,
                    sec: Number((resyncTime / 1000).toFixed(1)),
                };
                expect(resyncTime).to.be.a('number').and.greaterThan(0);
            });

            it('Navigate to Settings->System Monitor->Audit Data Log', async function () {
                await webAppHeader.goHome();
                await webAppHeader.isSpinnerDone();
                await webAppHeader.openSettings();
                await webAppHeader.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                await settingsSidePanel.selectSettingsByID('System Monitor');
                await settingsSidePanel.clickSettingsSubCategory('audit_data_log', 'System Monitor');
                await webAppHeader.isSpinnerDone();
                driver.sleep(2.5 * 1000);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            // it('Click Button "PropertyAuditLog ABI"', async function () {});

            // it('Checking for ...', async function () {});

            // it('Navigate to ... URL', async function () {});

            // it('Click Button "JobsExecutions"', async function () {});

            // it('Checking for ...', async function () {});
        });
    });
}
