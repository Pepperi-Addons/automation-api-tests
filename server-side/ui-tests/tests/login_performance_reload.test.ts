import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppHeader, WebAppHomePage, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
import { expect } from 'chai';
import { VarDistPage } from '../pom/addons/VarDistPage';
import { Key } from 'selenium-webdriver';
import addContext from 'mochawesome/addContext';
import { GeneralService } from '../../services';
import { ADALService } from '../../services/adal.service';
import { testData as baseAddons } from '../../services/general.service';

export async function LoginPerfTestsReload(email: string, password: string, varPass, client, varPassEu) {
    let driver: Browser;
    const generalService = new GeneralService(client);
    const adalService = new ADALService(generalService.papiClient);
    //GLOBALS
    let _sumOfDurationAfterReloading = 0;
    const numOfRuns = 10;
    let _adalAfterReloadBaseLine = 0;
    let _adalAfterRecycleBaseLine = 0;
    const today = new Date();
    const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ||| ' + time;
    let _envUrlBase;
    let _env;

    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        _envUrlBase = 'papi.staging';
        _env = 'stage';
    } else if (generalService.papiClient['options'].baseURL.includes('papi-eu')) {
        //handle EU user
        _envUrlBase = 'papi-eu';
        _env = 'eu';
    } else {
        _envUrlBase = 'papi';
        _env = 'prod';
    }
    const varUserName = _env === 'eu' ? varPassEu.split(':')[0] : varPass.split(':')[0];
    const varPassword = _env === 'eu' ? varPassEu.split(':')[1] : varPass.split(':')[1];

    // const addonVersions =
    // await generalService.baseAddonVersionsInstallation(varPass);
    // // const webAPIVersion = addonVersions.chnageVersionResponseArr['WebApp API Framework'][2];
    const testData = {
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '17.14.74'],
    };

    // const addonVersions =
    await generalService.baseAddonVersionsInstallation(varPass);
    // const webAPIVersion = addonVersions.chnageVersionResponseArr['WebApp API Framework'][2];
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    await generalService.areAddonsInstalled(testData);

    // await generalService.areAddonsInstalled(baseAddons);
    // const urlToLookFor = `https://${_envUrlBase}.pepperi.com/${webAPIVersion}/webapi/Service1.svc/v1/HomePage`;

    describe('Login Performance Tests Suites', () => {
        describe('Prerequisites Addon for Login Performance Test', () => {
            for (const addonName in baseAddons) {
                const addonUUID = baseAddons[addonName][0];
                const version = baseAddons[addonName][1];
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
            it(`THIS TEST WAS PERFORMED AT: ${dateTime}`, function () {
                console.log(`THIS TEST WAS PERFORMED AT: ${dateTime}`);
            });
            it('getting the AVG from ADAL', async function () {
                debugger;
                const adalResponseReload = await adalService.getDataFromSchema(
                    //querying the ADAL scheme to get saved avarages
                    'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                    'LoginPerormanceDataReload',
                );
                expect(adalResponseReload).to.be.not.empty; //ADAL response
                const envsEntry = adalResponseReload.filter((response) => response.env === _env);
                expect(envsEntry).to.be.not.empty; //after filter
                _adalAfterReloadBaseLine = envsEntry[0].duration;

                const adalResponseRecycle = await adalService.getDataFromSchema(
                    //querying the ADAL scheme to get saved avarages
                    'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                    'LoginPerormanceData',
                );
                expect(adalResponseRecycle).to.be.not.empty; //ADAL response
                const envsEntryRecycle = adalResponseRecycle.filter((response) => response.env === _env);
                expect(envsEntryRecycle).to.be.not.empty; //after filter
                _adalAfterRecycleBaseLine = envsEntryRecycle[0].duration_with_rec;
            });
            for (let index = 1; index < numOfRuns + 1; index++) {
                it(`Loggin With VAR User For The ${index}/${numOfRuns} Time And Reload DB For The User About To Be Tested`, async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.login(varUserName, varPassword); //VAR credentials
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
                    await varListOfDistsPage.reloadDB(this);
                });

                it(`Login With The Reloaded DB User For The ${index}/${numOfRuns} Time And Measure How Much Time The Process Took`, async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.navigate();
                    await driver.clearCookies(); //to make sure we have no prev data
                    await webAppLoginPage.signIn(email, password);
                    const start = Date.now();
                    const webappHomePage = new WebAppHomePage(driver);
                    while (!(await webAppLoginPage.safeUntilIsVisible(webappHomePage.MainHomePageBtn))); //TODO: add limitation of querys here
                    const duration = Date.now() - start;
                    const base64Image = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Homepage is loaded`,
                        value: 'data:image/png;base64,' + base64Image,
                    });
                    addContext(this, {
                        title: `this login duration after recycle`,
                        value: `${duration} milliseconds`,
                    });
                    _sumOfDurationAfterReloading += duration;
                });
            }

            it(`Testing All Collected Results: is the timing increased by 120% or more of the averages + is the timing decreased by 10% or more than the averages`, async function () {
                //1. calculating duration avarage if this run
                const reloadingAVG = parseInt((_sumOfDurationAfterReloading / numOfRuns).toFixed(0));
                addContext(this, {
                    title: `THS RUN avarage duration of loggin in AFTER reloading: ${reloadingAVG}, current ADAL AVG: ${_adalAfterReloadBaseLine}, in seconds: ${(
                        reloadingAVG / 1000
                    ).toFixed(3)}`,
                    value: `THS RUN avarage duration of loggin in AFTER reloading: ${reloadingAVG}, current ADAL AVG: ${_adalAfterReloadBaseLine}, in seconds: ${(
                        reloadingAVG / 1000
                    ).toFixed(3)}`,
                });

                const newBaseLineAfterRun = parseInt(
                    ((_adalAfterReloadBaseLine * 0.95 + reloadingAVG * 0.05) / 1).toFixed(0),
                );

                addContext(this, {
                    title: `after THIS RUN the avarage duration of loggin in AFTER reloading  is:${newBaseLineAfterRun}, seconds:${(
                        reloadingAVG / 1000
                    ).toFixed(3)}, RECYCLE AVG IS: ${_adalAfterRecycleBaseLine}, seconds: ${(
                        reloadingAVG / 1000
                    ).toFixed(3)}`,
                    value: `after THIS RUN the avarage duration of loggin in AFTER reloading  is:${newBaseLineAfterRun}, seconds:${(
                        reloadingAVG / 1000
                    ).toFixed(3)}, RECYCLE AVG IS: ${_adalAfterRecycleBaseLine}, seconds: ${(
                        reloadingAVG / 1000
                    ).toFixed(3)}`,
                });

                //3. calculating 120% of the avarage saved in ADAL for AFTER recycle
                const adal120precAVG = parseInt((_adalAfterRecycleBaseLine * 1.2).toFixed(0));
                //3.1. testing whether we passed the saved avarage by more than 20%
                expect(reloadingAVG).to.be.lessThan(
                    adal120precAVG,
                    `after recycle login is bigger than baseline by: ${(
                        ((reloadingAVG - _adalAfterRecycleBaseLine) / _adalAfterRecycleBaseLine) *
                        100
                    ).toFixed(3)}, current baseline:${_adalAfterRecycleBaseLine}, current run result" ${reloadingAVG}`,
                );

                //5. calculating 90% of the avarage saved in ADAL for AFTER recycle
                const avg90 = parseInt((_adalAfterReloadBaseLine * 0.9).toFixed(0));
                if (reloadingAVG < avg90) {
                    //5.1.testing whether we sucseed to run in less than 90 % of saved duration
                    //5.2.if so - use 'Weighted arithmetic mean' which takes only 5 % of the calculated baseline to create the updated baseline in ADAL
                    //this way ADAL's baseline will really 'MOVE' only if a number of runs was this good
                    const newBaseLineForADAL = parseInt(
                        ((_adalAfterReloadBaseLine * 0.95 + reloadingAVG * 0.05) / 1).toFixed(0),
                    );
                    const bodyToSend = {
                        Key: `${_env}_perf`,
                        duration_with_rec: newBaseLineForADAL,
                    };
                    const adalResponse = await postToADAL(varPass, generalService, bodyToSend, _envUrlBase);
                    expect(adalResponse.Ok).to.equal(true);
                    expect(adalResponse.Status).to.equal(200);
                    expect(adalResponse.Body.env).to.equal(_env);
                    expect(adalResponse.Body.Hidden).to.equal(false);
                    expect(adalResponse.Body.Key).to.equal(`${_env}_perf`);
                    expect(adalResponse.Body.duration_with_rec).to.equal(newBaseLineForADAL);
                    //printing both to console and report
                    const improvmentPrec = (
                        ((_adalAfterReloadBaseLine - reloadingAVG) / _adalAfterReloadBaseLine) *
                        100
                    ).toFixed(3);
                    console.log(
                        `the average in this run improved by: ${improvmentPrec} % comparing to the baseline: current run AVG after recycling: ${reloadingAVG}, current BASELINE:${_adalAfterReloadBaseLine}`,
                    );
                    addContext(this, {
                        title: `the average of this run with recycling is lower by: ${improvmentPrec}% then baseline`,
                        value: `current run avarage after recycling: ${reloadingAVG}, current baseline:${_adalAfterReloadBaseLine}, new baseline to push to ADAL: ${newBaseLineForADAL}`,
                    });
                }
            });
        });
    });
}

async function postToADAL(varPass, generalService, bodyToSend, envUrlBase) {
    const secretKey = await generalService.getSecretKey('eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', varPass);
    const adalResponse = await generalService.fetchStatus(
        `https://${envUrlBase}.pepperi.com/V1.0/addons/data/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/LoginPerormanceData`,
        {
            method: 'POST',
            body: JSON.stringify(bodyToSend),
            headers: {
                Authorization: `Bearer ${generalService['client'].OAuthAccessToken}`,
                //X-Pepperi-OwnerID is the ID of the Addon
                'X-Pepperi-OwnerID': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                'X-Pepperi-SecretKey': secretKey,
            },
        },
    );
    return adalResponse;
}

// expect(duration).to.be.lessThan(
//     localAVG,
//     `this run duration took ${(((duration - localAVG) / localAVG) * 100).toFixed(
//         3,
//     )} present longer then the local AVG`,
// );
