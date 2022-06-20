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
    let driver: Browser;
    const generalService = new GeneralService(client);
    const adalService = new ADALService(generalService.papiClient);
    //GLOBALS
    let _sumOfDurationAfterRecycling = 0;
    let _sumODurationNoRecycle = 0;
    const numOfRuns = 10;
    let _adalNoRecBaseLine = 0;
    let _adalWithRecBaseLine = 0;
    const today = new Date();
    const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ||| ' + time;
    let _envUrlBase;
    let _env;

    // if (generalService.papiClient['options'].baseURL.includes('staging')) {
    //     _envUrlBase = 'webapi.sandbox';
    // } else {
    //     _envUrlBase = 'webapi';
    // }
    const testData = {
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '16.85.53'],
        'Settings Framework': ['354c5123-a7d0-4f52-8fce-3cf1ebc95314', '9.5.317'],
    };

    // const addonVersions =
    // await generalService.baseAddonVersionsInstallation(varPass);
    // const webAPIVersion = addonVersions.chnageVersionResponseArr['WebApp API Framework'][2];
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    await generalService.areAddonsInstalled(testData);
    // const urlToLookFor = `https://${_envUrlBase}.pepperi.com/${webAPIVersion}/webapi/Service1.svc/v1/HomePage`;

    describe('Login Performance Tests Suites', () => {
        describe('Prerequisites Addon for Login Performance Test', () => {
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
            it(`THIS TEST WAS PERFORMED AT: ${dateTime}`, function () {
                console.log(`THIS TEST WAS PERFORMED AT: ${dateTime}`);
            });
            it('getting the AVG from ADAL', async function () {
                const adalResponse = await adalService.getDataFromSchema(
                    //querying the ADAL scheme to get saved avarages
                    'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                    'LoginPerormanceData',
                );
                expect(adalResponse).to.be.not.empty; //ADAL response
                const prodEntry = adalResponse.filter((response) => response.env === _env);
                expect(prodEntry).to.be.not.empty; //after filter
                _adalWithRecBaseLine = prodEntry[0].duration_with_rec;
                _adalNoRecBaseLine = prodEntry[0].duration_no_rec;
            });
            for (let index = 1; index < numOfRuns + 1; index++) {
                it(`Loggin With VAR User For The ${index}/${numOfRuns} Time And Reset Nuc For The User About To Be Tested Using VAR UI`, async function () {
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

                it(`Login With The Recycled User For The ${index}/${numOfRuns} Time And Measure Time The Process Took After Recycling`, async function () {
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
                    _sumOfDurationAfterRecycling += duration;
                });
            }

            for (let index = 1; index < numOfRuns + 1; index++) {
                it(`Login Again With The User: For The ${index}/${numOfRuns} Time And Measure Time The Process Took`, async function () {
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
                        title: `Homepage is loaded:`,
                        value: 'data:image/png;base64,' + base64Image,
                    });
                    addContext(this, {
                        title: `this login duration NO recycle`,
                        value: `${duration} milliseconds`,
                    });
                    _sumODurationNoRecycle += duration;
                });
            }

            it(`Testing All Collected Results: is the timing increased by 120% or more of the averages + is the timing decreased by 10% or more than the averages`, async function () {
                //1. calculating duration avarage if this run
                const recyclingAVG = parseInt((_sumOfDurationAfterRecycling / numOfRuns).toFixed(0));
                const noRecyclingAVG = parseInt((_sumODurationNoRecycle / numOfRuns).toFixed(0));
                //2. printing the durations to the report
                addContext(this, {
                    title: `THS RUN avarage duration of loggin in AFTER recycling: ${recyclingAVG}, current ADAL AVG: ${_adalWithRecBaseLine}, in seconds: ${(
                        _adalWithRecBaseLine / 1000
                    ).toFixed(3)}`,
                    value: `THIS RUN duration in seconds: ${(recyclingAVG / 1000).toFixed(
                        3,
                    )},current ADAL AVG in seconds: ${(_adalWithRecBaseLine / 1000).toFixed(3)} `,
                });
                addContext(this, {
                    title: `THS RUN avarage duration of loggin in NO recycling: ${noRecyclingAVG}, current ADAL AVG: ${_adalNoRecBaseLine}, in seconds: ${(
                        _adalNoRecBaseLine / 1000
                    ).toFixed(3)}`,
                    value: `THIS RUN duration in seconds: ${(noRecyclingAVG / 1000).toFixed(
                        3,
                    )},current ADAL AVG in seconds: ${(_adalNoRecBaseLine / 1000).toFixed(3)} `,
                });
                //3. calculating 120% of the avarage saved in ADAL for AFTER recycle
                const adal120precAVG = parseInt((_adalWithRecBaseLine * 1.2).toFixed(0));
                //3.1. testing whether we passed the saved avarage by more than 20%
                expect(recyclingAVG).to.be.lessThan(
                    adal120precAVG,
                    `after recycle login is bigger than baseline by: ${(
                        ((recyclingAVG - _adalWithRecBaseLine) / _adalWithRecBaseLine) *
                        100
                    ).toFixed(3)}, current baseline:${_adalWithRecBaseLine}, current run result" ${recyclingAVG}`,
                );
                //4. calculating 120% of the avarage saved in ADAL for NO recycle
                const adal120precAVGNoRec = parseInt((_adalNoRecBaseLine * 1.2).toFixed(0));
                //4.1. testing whether we passed the saved avarage by more than 20%
                expect(noRecyclingAVG).to.be.lessThan(
                    adal120precAVGNoRec,
                    `no recycle login is bigger than baseline by: ${(
                        ((noRecyclingAVG - _adalNoRecBaseLine) / _adalNoRecBaseLine) *
                        100
                    ).toFixed(3)}, current baseline:${_adalNoRecBaseLine}, current run result" ${noRecyclingAVG}`,
                );
                //5. calculating 90% of the avarage saved in ADAL for AFTER recycle
                const avg90 = parseInt((_adalWithRecBaseLine * 0.9).toFixed(0));
                if (recyclingAVG < avg90) {
                    //5.1. testing whether we sucseed to run in less than 90% of saved duration
                    //5.2. if so - use 'Weighted arithmetic mean' which takes only 5% of the calculated baseline to create the updated baseline in ADAL
                    //this way ADAL's baseline will really 'MOVE' only if a number of runs was this good
                    const newBaseLineForADAL = parseInt(
                        ((_adalWithRecBaseLine * 0.95 + recyclingAVG * 0.05) / 1).toFixed(0),
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
                    // printing both to console and report
                    const improvmentPrec = (
                        ((_adalWithRecBaseLine - recyclingAVG) / _adalWithRecBaseLine) *
                        100
                    ).toFixed(3);
                    console.log(
                        `the average in this run improved by: ${improvmentPrec} % comparing to the baseline: current run AVG after recycling: ${recyclingAVG}, current BASELINE:${_adalWithRecBaseLine}`,
                    );
                    addContext(this, {
                        title: `the average of this run with recycling is lower by: ${improvmentPrec}% then baseline`,
                        value: `current run avarage after recycling: ${recyclingAVG}, current baseline:${_adalWithRecBaseLine}, new baseline to push to ADAL: ${newBaseLineForADAL}`,
                    });
                }
                // 6. calculating 90% of the avarage saved in ADAL for NO recycle
                const avg90NoRec = parseInt((_adalNoRecBaseLine * 0.9).toFixed(0));
                if (noRecyclingAVG < avg90NoRec) {
                    //6.1. testing whether we sucseed to run in less than 90% of saved duration
                    //6.2. if so - use 'Weighted arithmetic mean' which takes only 5% of the calculated baseline to create the updated baseline in ADAL
                    //this way ADAL's baseline will really 'MOVE' only if a number of runs was this good
                    const newBaseLineForADAL = parseInt(
                        ((_adalNoRecBaseLine * 0.95 + noRecyclingAVG * 0.05) / 1).toFixed(0),
                    );
                    const bodyToSend = {
                        Key: `${_env}_perf`,
                        duration_no_rec: newBaseLineForADAL,
                    };
                    const adalResponse = await postToADAL(varPass, generalService, bodyToSend, _envUrlBase);
                    expect(adalResponse.Ok).to.equal(true);
                    expect(adalResponse.Status).to.equal(200);
                    expect(adalResponse.Body.env).to.equal(_env);
                    expect(adalResponse.Body.Hidden).to.equal(false);
                    expect(adalResponse.Body.Key).to.equal(`${_env}_perf`);
                    expect(adalResponse.Body.duration_no_rec).to.equal(newBaseLineForADAL);
                    //printing both to console and report
                    const improvmentPrec = (((_adalNoRecBaseLine - noRecyclingAVG) / _adalNoRecBaseLine) * 100).toFixed(
                        3,
                    );
                    console.log(
                        `the average in this run improved by: ${improvmentPrec}% comparing to the baseline: current run AVG after recycling: ${noRecyclingAVG}, current BASELINE:${_adalNoRecBaseLine}`,
                    );
                    addContext(this, {
                        title: `the average of this run with NO recycling is lower by: ${improvmentPrec}% then baseline`,
                        value: `current run average NO recycling: ${noRecyclingAVG}, current baseline:${_adalNoRecBaseLine}, new baseline to push to ADAL: ${newBaseLineForADAL}`,
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
