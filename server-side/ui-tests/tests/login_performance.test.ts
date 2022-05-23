import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppHeader, WebAppHomePage, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
import { expect } from 'chai';
import { VarDistPage } from '../pom/addons/VarDistPage';
import { Key } from 'selenium-webdriver';
import addContext from 'mochawesome/addContext';
import { GeneralService } from '../../services';
import { ADALService } from '../../services/adal.service';

export async function LoginPerfTests(email: string, password: string, varPass, client) {
    //TODO: 1. change to work on any env // 2. refactor to be more readable

    let driver: Browser;
    // let _envUrlBase;
    const generalService = new GeneralService(client);
    const adalService = new ADALService(generalService.papiClient);
    let _sumOfLoginFrontendDurationAfterRecycling = 0;
    let _sumOfLoginFrontenddDurationNoRecycle = 0;
    const numOfRuns = 1;
    // const numOfTries = 10000;
    //locally collected avg's
    // const localAVGAfterRec = 82776;
    // const localAVGNoRec = 7188;
    let _adalNoRecAVG = 0;
    let _adalWithRecAVG = 0;

    // if (generalService.papiClient['options'].baseURL.includes('staging')) {
    //     _envUrlBase = 'webapi.sandbox';
    // } else {
    //     _envUrlBase = 'webapi';
    // }
    const testData = {};

    // const addonVersions =
    await generalService.baseAddonVersionsInstallation(varPass);
    // const webAPIVersion = addonVersions.chnageVersionResponseArr['WebApp API Framework'][2];
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    // const urlToLookFor = `https://${_envUrlBase}.pepperi.com/${webAPIVersion}/webapi/Service1.svc/v1/HomePage`;

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
            it('getting the AVG from ADAL', async function () {
                const adalResponse = await adalService.getDataFromSchema(
                    'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                    'LoginPerormanceData',
                );
                expect(adalResponse).to.be.not.empty; //ADAL response
                const prodEntry = adalResponse.filter((response) => response.env === 'prod');
                expect(prodEntry).to.be.not.empty; //after filter
                _adalWithRecAVG = prodEntry[0].duration_with_rec;
                _adalNoRecAVG = prodEntry[0].duration_no_rec;
            });
            for (let index = 1; index < numOfRuns + 1; index++) {
                it(`Loggin With VAR User For The ${index} Time And Reset Nuc For The User About To Be Tested Using VAR UI`, async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.login(varPass.split(':')[0], varPass.split(':')[1]); //VAR credentials
                    const webAppHeader = new WebAppHeader(driver);
                    await webAppHeader.openSettings();
                    const webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
                    await webAppSettingsSidePanel.selectSettingsByID('Var');
                    await driver.click(webAppSettingsSidePanel.VarDistsEditor);
                    const varListOfDistsPage = new VarDistPage(driver);
                    await varListOfDistsPage.isSpinnerDone();
                    await driver.switchTo(varListOfDistsPage.AddonContainerIframe);
                    await expect(varListOfDistsPage.untilIsVisible(varListOfDistsPage.IdRowTitle, 90000)).eventually.to
                        .be.true; //var dist page is loaded
                    await varListOfDistsPage.search.enterSearch(email + Key.ENTER); //searching the user to recycle hes nuc
                    expect(await varListOfDistsPage.editPresentedDist()).to.be.true; //VAR dist edit page is loaded
                    expect(await varListOfDistsPage.enterSupportSettings()).to.be.true; //support settings VAR page is loaded
                    await varListOfDistsPage.recycleNuc(this); //menu interaction
                });

                it(`Login With The Recycled User For The ${index} Time And Measure Time The Process Took After Recycling`, async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.navigate();
                    await driver.clearCookies(); //to make sure we have no prev data
                    await webAppLoginPage.signIn(email, password);
                    const start = Date.now();
                    const webappHomePage = new WebAppHomePage(driver);
                    while (!(await webAppLoginPage.safeUntilIsVisible(webappHomePage.MainHomePageBtn))); //TODO: add limitation of querys here
                    const duration = Date.now() - start;
                    // starting as soon as the btton was pressed
                    // const backendPerformance = await driver.queryNetworkLogsForCertainResponseAndReturnTiming(
                    //     urlToLookFor,
                    //     numOfTries,
                    // );
                    // const duration = await driver.getTimingOfLoadingThePage();
                    const base64Image = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Homepage is loaded`,
                        value: 'data:image/png;base64,' + base64Image,
                    });
                    addContext(this, {
                        title: `duration after recycl time is`,
                        value: `duration backend:${duration}`,
                    });
                    //collecting data to calculate AVG
                    // _sumOfLoginBackendDurationAfterRecycling += duration.backendPerformance;
                    _sumOfLoginFrontendDurationAfterRecycling += duration;
                });
            }

            for (let index = 1; index < numOfRuns + 1; index++) {
                it(`Login Again With The User: For The ${index} Time And Measure Time The Process Took`, async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.navigate();
                    await driver.clearCookies(); //to make sure we have no prev data
                    await webAppLoginPage.signIn(email, password);
                    const start = Date.now();
                    const webappHomePage = new WebAppHomePage(driver);
                    while (!(await webAppLoginPage.safeUntilIsVisible(webappHomePage.MainHomePageBtn))); //TODO: add limitation of querys here
                    const duration = Date.now() - start;
                    // starting as soon as the btton was pressed
                    // const backendPerformance = await driver.queryNetworkLogsForCertainResponseAndReturnTiming(
                    //     urlToLookFor,
                    //     numOfTries,
                    // );
                    // const duration = await driver.getTimingOfLoadingThePage();
                    const base64Image = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Homepage is loaded:`,
                        value: 'data:image/png;base64,' + base64Image,
                    });
                    addContext(this, {
                        title: `duration after recycl time is`,
                        value: `duration backend:${duration}`,
                    });
                    //collecting data to calculate AVG
                    // _sumOfLoginBackendDurationAfterRecycling += duration.backendPerformance;
                    _sumOfLoginFrontenddDurationNoRecycle += duration;
                });
            }

            it(`Testing All Collected Results: is the timing increased by 120% or more of the averages + is the timing decreased by 10% or more than the averages`, async function () {
                //TODO: comment here
                const afterRecyclingFronendAVG = parseInt(
                    (_sumOfLoginFrontendDurationAfterRecycling / numOfRuns).toFixed(0),
                );
                const noRecyclingFronendAVG = parseInt((_sumOfLoginFrontenddDurationNoRecycle / numOfRuns).toFixed(0));
                addContext(this, {
                    title: `avarage frontend duration of loggin in AFTER recycling, current ADAL AVG:${_adalWithRecAVG}, in seconds: ${(
                        _adalWithRecAVG / 1000
                    ).toFixed(3)}`,
                    value: `duration: ${afterRecyclingFronendAVG}, in seconds: ${(
                        afterRecyclingFronendAVG / 1000
                    ).toFixed(3)}`,
                });
                addContext(this, {
                    title: `avarage frontend duration of loggin in NO recycling, current ADAL AVG:${_adalNoRecAVG}, in seconds: ${(
                        _adalNoRecAVG / 1000
                    ).toFixed(3)}`,
                    value: `duration: ${noRecyclingFronendAVG}, in seconds: ${(noRecyclingFronendAVG / 1000).toFixed(
                        3,
                    )}`,
                });
                const avg120Rec = parseInt((_adalWithRecAVG * 1.2).toFixed(0));
                expect(afterRecyclingFronendAVG).to.be.lessThan(
                    avg120Rec,
                    'after recycle login is bigger then avg by more then 20%',
                );
                const avg120NoRec = parseInt((_adalNoRecAVG * 1.2).toFixed(0));
                expect(noRecyclingFronendAVG).to.be.lessThan(
                    avg120NoRec,
                    'no recycle login is bigger then avg by more then 20%',
                );
                const avg0point8Rec = parseInt((_adalWithRecAVG * 0.9).toFixed(0));
                const avg0point8NoRec = parseInt((_adalNoRecAVG * 0.9).toFixed(0));
                if (afterRecyclingFronendAVG < avg0point8Rec) {
                    const newAvgForADAL = parseInt(((_adalWithRecAVG + afterRecyclingFronendAVG) / 2).toFixed(0));
                    const adalResponse = await adalService.postDataToSchema(
                        'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                        'LoginPerormanceData',
                        {
                            Key: 'prod_perf',
                            duration_with_rec: newAvgForADAL,
                        },
                    );
                    expect(adalResponse.env).to.equal('prod');
                    expect(adalResponse.Hidden).to.equal('false');
                    expect(adalResponse.Key).to.equal('prod_perf');
                    expect(adalResponse.duration_with_rec).to.equal(newAvgForADAL);
                    addContext(this, {
                        title: `the avarage after recycling is lower in 20% or more then the current one`,
                        value: `avarage after recycling: ${afterRecyclingFronendAVG}, current AVG:${_adalWithRecAVG}`,
                    });
                }
                if (noRecyclingFronendAVG < avg0point8NoRec) {
                    const newAvgForADAL = parseInt(((_adalNoRecAVG + noRecyclingFronendAVG) / 2).toFixed(0));
                    const adalResponse = await adalService.postDataToSchema(
                        'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                        'LoginPerormanceData',
                        {
                            Key: 'prod_perf',
                            duration_no_rec: newAvgForADAL,
                        },
                    );
                    expect(adalResponse.env).to.equal('prod');
                    expect(adalResponse.Hidden).to.equal('false');
                    expect(adalResponse.Key).to.equal('prod_perf');
                    expect(adalResponse.duration_no_rec).to.equal(newAvgForADAL);
                    addContext(this, {
                        title: `the avarage with NO recycling is lower in 20% or more then the current one`,
                        value: `avarage after recycling: ${noRecyclingFronendAVG}, current AVG:${_adalNoRecAVG}`,
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
