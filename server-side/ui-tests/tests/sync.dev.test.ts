import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { SingleDevTestRunner } from './SingleDevTestRunner';

chai.use(promised);

export async function SyncTests(email: string, password: string, client: Client, varPass) {
    const generalService = new GeneralService(client);
    const addonVersion = (
        await generalService.getAddonsLatestAvailableVersion('5122dc6d-745b-4f46-bb8e-bd25225d350a', varPass)
    ).latestVersion;
    let env;
    let testNames: string[] = [];

    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        env = 'stage';
    } else if (generalService.papiClient['options'].baseURL.includes('eu')) {
        env = 'eu';
    } else {
        env = 'prod';
    }
    const devTestRunner = new SingleDevTestRunner(
        email,
        password,
        client,
        generalService,
        env,
        'SYNC',
        addonVersion,
        varPass,
    );
    await generalService.baseAddonVersionsInstallationNewSyncNoNebula(varPass);
    const testData = {
        automation_template_addon: ['d541b959-87af-4d18-9215-1b30dbe1bcf4', ''],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', ''],
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''],
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', ''],
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade survey dependencies

    describe('Sync Dev Tests Suit', async function () {
        describe('Prerequisites Addons for Sync Dev Tests', () => {
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

        describe('Sync Addon Dev Tests Runner', () => {
            this.retries(0);
            it(`1. Get Test Names`, async function () {
                testNames = (await devTestRunner.getTestNames()) as string[];
                console.log(
                    `Sync - ${devTestRunner.addonUUID}, Version: ${addonVersion}, Got These Dev Tests From '/tests' Endpoint: [${testNames}]`,
                );
            });
            it(`2. Run Tests`, async function () {
                const didTestsPassed = await devTestRunner.handleSingleDevTest(testNames, generalService);
                expect(didTestsPassed).to.equal(true);
            });
        });
    });
}
