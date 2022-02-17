import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppHeader, WebAppLoginPage } from '../pom/index';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { ObjectsService } from '../../services/objects.service';
import { upgradeDependenciesTests } from './test.index';
import { NgxLibComponents } from '../pom/addons/NgxLibComponents';

chai.use(promised);

export async function NgxTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    let driver: Browser;

    //#region Upgrade ngx-lib-testing addon + dependencies 
    const testData = {
        'ngx-lib-testing': ['47db1b61-e1a7-42bd-9d55-93dd85044e91', '0.0.9']
    };

    await upgradeDependenciesTests(generalService, varPass);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    //#endregion Upgrade ngx-lib-testing addon + dependencies
    describe('Basic UI Tests Suit', async function () {
        describe('UOM Tests Suites', () => {
            describe('Prerequisites Addons for UOM Tests', () => {
                //Test Data
                //UOM
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

            describe('NGX COMPONENETS UI TEST', () => {
                this.retries(1);

                beforeEach(async function () {
                    driver = await Browser.initiateChrome();
                });

                afterEach(async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.collectEndTestData(this);
                    await driver.quit();
                });

                it('POC1: clickig the change btn and reading the logs', async () => {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.login(email, password);
                    const webAppHeader = new WebAppHeader(driver);
                    await webAppHeader.openSettings();
                    await driver.getALLConsoleLogs();//clear logs created before entering the addon
                    const ngxLibAddon = new NgxLibComponents(driver);
                    await ngxLibAddon.gotoNgxAddon();
                    driver.sleep(1200);
                    debugger;
                    let consoleLog = await driver.getALLConsoleLogs();
                    let consoleLogJoined = consoleLog.join();
                    expect(consoleLogJoined).to.not.include("We could not find the Icon with the name arrow_back_left,\\n                did you add it to the Icon registry?");
                    let componentData = await ngxLibAddon.getComponentName();
                    await ngxLibAddon.clickComponent();
                    consoleLog = await driver.getALLConsoleLogs();
                    expect(consoleLogJoined).to.include(`clicked button: ${componentData}`);
                });
            });




        });
    });
}

//We could not find the Icon with the name <arrow_back_left>,\\n                did you add it to the Icon registry?