import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppLoginPage } from '../pom/index';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { upgradeDependenciesTests } from './test.index';

chai.use(promised);

export async function PageBuilderTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    let driver: Browser;
    
    //#region Upgrade cpi-node & UOM
    const testData = {
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''], //16.65.12
        Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''], //Page Builder Addon 0.0.81
        PageBuilderTester: ['5046a9e4-ffa4-41bc-8b62-db1c2cf3e455', ''],
    };

    await upgradeDependenciesTests(generalService, varPass);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    //#endregion Upgrade cpi-node & UOM

    describe('Page Builder Hybrid Tests Suite', async function () {
        describe('Prerequisites Addons for Page Builder Tests', () => {
            //Test Data
            it('Validate That All The Needed Addons Installed', async () => {
                isInstalledArr.forEach((isInstalled) => {
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
                            expect(chnageVersionResponseArr[addonName][5]).to.include(
                                'is already working on version',
                            );
                        } else {
                            expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                        }
                    });
                    it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                        await expect(
                            generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get(),
                        )
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(varLatestVersion);
                    });
                });
            }
        });
        describe('Page Builder Tests', () => {
            this.retries(1);

            beforeEach(async function () {
                driver = await Browser.initiateChrome();
            });

            afterEach(async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.collectEndTestData(this);
                await driver.quit();
            });


        });

    });
}


