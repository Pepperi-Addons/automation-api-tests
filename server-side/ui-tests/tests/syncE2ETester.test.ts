import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';

chai.use(promised);

export async function SyncE2ETester(email: string, password: string, client: Client, varPass) {
    const generalService = new GeneralService(client);
    let driver: Browser;
    await generalService.baseAddonVersionsInstallationNewSyncNoNebula(varPass);
    // #region Upgrade survey dependencies

    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '17.30.%'],
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.50'],
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'],
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '2.0.%'],
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''],
        'application-header': ['9bc8af38-dd67-4d33-beb0-7d6b39a6e98d', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade survey dependencies

    describe('Sync E2E Tests Suit', async function () {
        describe('Prerequisites Addons for Survey Builder Tests', () => {
            //Test Data
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

        describe('Sync E2E', () => {
            this.retries(0);

            before(async function () {
                debugger;
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.close();
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });
            it(`1. Basic UI Test: Using Admin Login To WebApp, Set App. Header Using Legacy Resources And See It Changes The Header On Admin And Buyer`, async function () {
                console.log('dsfsfds');
            });
            it(`2. Integration Test: Push Data To Configurations Which Is Our Source Addon And See It Changes The UI - Admin And Buyer`, async function () {
                console.log('dsfsfds');
            });
            it(`3. API Test: Check the Data Inside The ADAL Inside Chache And All This`, async function () {
                console.log('dsfsfds');
            });
        });
    });
}
