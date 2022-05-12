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
    let _sumOfLoginDurationAfterRecycling = 0;
    let _sumOfLoginNoRecycleDurations = 0;
    const numOfRuns = 10;
    const localAVGAfterRec = 82776;
    const localAVGNoRec = 7188;
    const numOfTries = 10000;

    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        _envUrlBase = 'webapi.sandbox';
    } else {
        _envUrlBase = 'webapi';
    }
    const testData = {};

    const addonVersions = await generalService.baseAddonVersionsInstallation(varPass);
    const webAPIVersion = addonVersions.chnageVersionResponseArr['WebApp API Framework'][2];
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const urlToLookFor = `https://${_envUrlBase}.pepperi.com/${webAPIVersion}/webapi/Service1.svc/v1/HomePage`;

    //#endregion Upgrade Cloudwatch Addon

    describe('Logs API Tests Suites', () => {
        // describe('Prerequisites Addon for Chart Manager Tests', () => {
        //     //Test Data
        //     //Cloudwatch Addon Service
        //     isInstalledArr.forEach((isInstalled, index) => {
        //         it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
        //             expect(isInstalled).to.be.true;
        //         });
        //     });
        //     for (const addonName in testData) {
        //         const addonUUID = testData[addonName][0];
        //         const version = testData[addonName][1];
        //         const varLatestVersion = chnageVersionResponseArr[addonName][2];
        //         const changeType = chnageVersionResponseArr[addonName][3];
        //         describe(`Test Data: ${addonName}`, () => {
        //             it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
        //                 if (chnageVersionResponseArr[addonName][4] == 'Failure') {
        //                     expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
        //                 } else {
        //                     expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
        //                 }
        //             });

        //             it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
        //                 await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
        //                     .eventually.to.have.property('Version')
        //                     .a('string')
        //                     .that.is.equal(varLatestVersion);
        //             });
        //         });
        //     }
        // });

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
            for (let index = 1; index < numOfRuns + 1; index++) {
                it(`Loggin With VAR User For The ${index} Time And Reset Nuc For The User About To Be Tested Using VAR UI`, async function () {
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
                    await expect(varListOfDistsPage.untilIsVisible(varListOfDistsPage.IdRowTitle, 90000)).eventually.to
                        .be.true;
                    await varListOfDistsPage.search.enterSearch(email + Key.ENTER);
                    expect(await varListOfDistsPage.editPresentedDist()).to.be.true;
                    expect(await varListOfDistsPage.enterSupportSettings()).to.be.true;
                    await varListOfDistsPage.recycleNuc(this);
                });

                it(`Login With The Recycled User For The ${index} Time And Measure Time The Process Took After Recycling`, async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.navigate();
                    await driver.clearCookies();
                    await webAppLoginPage.signIn(email, password);
                    // starting as soon as the btton was pressed
                    const duration = await driver.queryNetworkLogsForCertainResponseAndReturnTiming(
                        urlToLookFor,
                        numOfTries,
                    );
                    addContext(this, {
                        title: `duration after recycl time is`,
                        value: `duration:${duration}`,
                    });
                    _sumOfLoginDurationAfterRecycling += duration;
                });
            }

            for (let index = 1; index < numOfRuns + 1; index++) {
                it(`Login Again With The User: For The ${index} Time And Measure Time The Process Took`, async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.navigate();
                    await driver.clearCookies();
                    await webAppLoginPage.signIn(email, password);
                    // starting as soon as the btton was pressed
                    const duration = await driver.queryNetworkLogsForCertainResponseAndReturnTiming(
                        urlToLookFor,
                        numOfTries,
                    );
                    addContext(this, {
                        title: `duration for ${index} run is`,
                        value: `this run duration: ${duration}`,
                    });
                    _sumOfLoginNoRecycleDurations += duration;
                });
            }

            it(`Testing All Collected Results: is the timing increased by 120% or more of the averages + is the timing decreased by 20% or more than the averages`, async function () {
                const afterRecyclingAVG = parseInt((_sumOfLoginDurationAfterRecycling / numOfRuns).toFixed(0));
                const noRecyclingAVG = parseInt((_sumOfLoginNoRecycleDurations / numOfRuns).toFixed(0));
                addContext(this, {
                    title: `avarage duration of loggin in AFTER recycling AVG`,
                    value: `duration: ${afterRecyclingAVG}`,
                });
                addContext(this, {
                    title: `avarage duration of loggin in W/O recycling AVG`,
                    value: `duration: ${noRecyclingAVG}`,
                });
                const avg120Rec = parseInt((localAVGAfterRec * 1.2).toFixed(0));
                expect(afterRecyclingAVG).to.be.lessThan(
                    avg120Rec,
                    'after recycle login is bigger then avg by more then 20%',
                );
                const avg120NoRec = parseInt((localAVGNoRec * 1.2).toFixed(0));
                expect(afterRecyclingAVG).to.be.lessThan(
                    avg120NoRec,
                    'no recycle login is bigger then avg by more then 20%',
                );
                const avg0point8Rec = parseInt((localAVGAfterRec * 0.8).toFixed(0));
                const avg0point8NoRec = parseInt((localAVGNoRec * 0.8).toFixed(0));
                if (afterRecyclingAVG < avg0point8Rec) {
                    addContext(this, {
                        title: `the avarage after recycling is lower in 20% or more then the current one`,
                        value: `avarage after recycling: ${afterRecyclingAVG}, current AVG:${localAVGAfterRec}`,
                    });
                }
                if (noRecyclingAVG < avg0point8NoRec) {
                    addContext(this, {
                        title: `the avarage with NO recycling is lower in 20% or more then the current one`,
                        value: `avarage after recycling: ${noRecyclingAVG}, current AVG:${localAVGNoRec}`,
                    });
                }
            });
        });
    });
}

// expect(duration).to.be.lessThan(
//     localAVG,
//     `this run duration took ${(((duration - localAVG) / localAVG) * 100).toFixed(
//         3,
//     )} present longer then the local AVG`,
// );
