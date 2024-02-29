import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { SingleDevTestRunner } from './SingleDevTestRunner';

chai.use(promised);

export async function ConfigurationTests(email: string, password: string, client: Client, varPass) {
    const generalService = new GeneralService(client);
    const addonVersion = (
        await generalService.getAddonLatestAvailableVersion('84c999c3-84b7-454e-9a86-71b7abc96554', varPass)
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
        'CONFIGURATIONS',
        addonVersion,
        varPass,
    );
    await generalService.baseAddonVersionsInstallationNewSync(varPass);
    const testData = {
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade survey dependencies

    describe('Configuration Dev Tests Suit', async function () {
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

        describe('Configuration Addon Dev Tests Runner', () => {
            this.retries(0);
            it(`1. Get Test Names`, async function () {
                testNames = (await devTestRunner.getTestNames()) as string[];
                console.log(
                    `Configuration - ${devTestRunner.addonUUID}, Version: ${addonVersion}, Got These Dev Tests From '/tests' Endpoint: [${testNames}]`,
                );
            });
            it(`2. Run Tests`, async function () {
                debugger;
                const configDevResults = await devTestRunner.runDevTest(testNames);
                expect(configDevResults).to.be.true;
                debugger;
            });
        });
    });
}
