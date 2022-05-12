import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppHeader, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
import { expect } from 'chai';
import { VarDistPage } from '../pom/addons/VarDistPage';
import { Key } from 'selenium-webdriver';
import addContext from 'mochawesome/addContext';
import { GeneralService } from '../../services';

export async function LoginPerfTests(email: string, password: string, varPass, client) {
    let driver: Browser;
    let _envUrlBase;
    const generalService = new GeneralService(client);

    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        _envUrlBase = 'webapi.sandbox';
    } else {
        _envUrlBase = 'webapi';
    }
    const testData = {
    };

    const addonVersions = await generalService.baseAddonVersionsInstallation(varPass);
    const webAPIVersion = addonVersions.chnageVersionResponseArr['WebApp API Framework'][2];
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    //#endregion Upgrade Cloudwatch Addon

    describe('Logs API Tests Suites', () => {
        describe('Prerequisites Addon for Chart Manager Tests', () => {
            //Test Data
            //Cloudwatch Addon Service
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


        describe('Basic UI Tests Suit', async function () {
            this.retries(0);

            beforeEach(async function () {
                driver = await Browser.initiateChrome();
            });

            afterEach(async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.collectEndTestData(this);
                await driver.quit();
            });
            it('Loggin With VAR User And Reset Nuc For The User About To Be Tested Using VAR UI', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(varPass.split(':')[0], varPass.split(':')[1]);
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.openSettings();
                const webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
                await webAppSettingsSidePanel.selectSettingsByID('Var');
                await driver.click(webAppSettingsSidePanel.VarDistsEditor);
                const varListOfDistsPage = new VarDistPage(driver);
                await varListOfDistsPage.isSpinnerDone();
                await driver.switchTo(varListOfDistsPage.AddonContainerIframe);
                await expect(varListOfDistsPage.untilIsVisible(varListOfDistsPage.IdRowTitle, 90000)).eventually.to.be.true;
                await varListOfDistsPage.search.enterSearch(email + Key.ENTER);
                expect(await varListOfDistsPage.editPresentedDist()).to.be.true;
                expect(await varListOfDistsPage.enterSupportSettings()).to.be.true;
                await varListOfDistsPage.recycleNuc();
            });

            it('Login With The Recycled User And Measure Time The Process Took', async function () {
                const localAVG = 9900;
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.navigate();
                await webAppLoginPage.signIn(email, password);
                // starting as soon as the btton was pressed
                const duration = await driver.queryNetworkLogsForCertainResponseAndReturnTiming(
                    `https://${_envUrlBase}.pepperi.com/${webAPIVersion}/webapi/Service1.svc/v1/HomePage`,
                );
                addContext(this, {
                    title: `duration time is:`,
                    value: `local AVG: ${localAVG}, this run duration:${duration}`,
                });
                expect(duration).to.be.lessThan(
                    localAVG,
                    `this run duration took ${(((duration - localAVG) / localAVG) * 100).toFixed(
                        3,
                    )} present longer then the local AVG`,
                );
            });
        });
    });
}
