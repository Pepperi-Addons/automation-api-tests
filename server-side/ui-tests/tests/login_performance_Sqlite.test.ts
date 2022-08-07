import { Browser } from '../utilities/browser';
import { describe, afterEach, beforeEach, it } from 'mocha';
import { WebAppHomePage, WebAppLoginPage } from '../pom';
import { expect } from 'chai';
// import { VarDistPage } from '../pom/addons/VarDistPage';
// import { Key } from 'selenium-webdriver';
import { GeneralService } from '../../services';
import { ADALService } from '../../services/adal.service';
import addContext from 'mochawesome/addContext';

export async function LoginPerfSqlitefTests(email: string, password: string, varPass, client) {
    let driver: Browser;
    const generalService = new GeneralService(client);
    const adalService = new ADALService(generalService.papiClient);
    //     //GLOBALS
    let _sumOfDurationAfterKillingSqlite = 0;
    const numOfRuns = 10;
    let _adalAfterKliingBaseLine = 0;
    const today = new Date();
    const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ||| ' + time;
    let _envUrlBase;
    let _env;

    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        _envUrlBase = 'papi.staging';
        _env = 'stage';
    } else {
        _envUrlBase = 'papi';
        _env = 'prod';
    }
    const testData = {
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''],
    };

    //     // const addonVersions =
    await generalService.baseAddonVersionsInstallation(varPass);
    //     // // const webAPIVersion = addonVersions.chnageVersionResponseArr['WebApp API Framework'][2];
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    await generalService.areAddonsInstalled(testData);
    //     // const urlToLookFor = `https://${_envUrlBase}.pepperi.com/${webAPIVersion}/webapi/Service1.svc/v1/HomePage`;

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
                    'LoginPerormanceDataKillSqlite',
                );
                expect(adalResponse).to.be.not.empty; //ADAL response
                const envsEntry = adalResponse.filter((response) => response.env === _env);
                expect(envsEntry).to.be.not.empty; //after filter
                _adalAfterKliingBaseLine = envsEntry[0].duration_after_kill;
            });

            for (let index = 1; index < numOfRuns + 1; index++) {
                it(`Use Jenkins Job: 'Project Performance Tests - Kill Webapp User' To Kill Users Sqlite For The ${index}/${numOfRuns} Time`, async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.navigate();
                    await driver.clearCookies(); //to make sure we have no prev data
                    await webAppLoginPage.signIn(email, password);
                    await generalService.runJenkinsJobRemotely(
                        'JenkinsBuildUserCred',
                        'Infra-Jenkins/job/Production-WebApp/job/Performance%20Tests%20-%20Kill%20Webapp%20User/build?token=PerformanceTestsKillWebApp',
                        'Performance Tests - Kill Webapp User',
                    );
                    await webAppLoginPage.logout();
                });
                it(`Login With The User Which For The ${index}/${numOfRuns} Time And Measure Time The Process Took After Recycling`, async function () {
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
                    _sumOfDurationAfterKillingSqlite += duration;
                });
            }

            it(`Testing All Collected Results: is the timing increased by 120% or more of the averages + is the timing decreased by 10% or more than the averages`, async function () {
                //1. calculating duration avarage if this run
                const killingAVG = parseInt((_sumOfDurationAfterKillingSqlite / numOfRuns).toFixed(0));
                //2. printing the durations to the report
                addContext(this, {
                    title: `THS RUN avarage duration of loggin in AFTER recycling: ${killingAVG}, current ADAL AVG: ${_adalAfterKliingBaseLine}, in seconds: ${(
                        _adalAfterKliingBaseLine / 1000
                    ).toFixed(3)}`,
                    value: `THIS RUN duration in seconds: ${(killingAVG / 1000).toFixed(
                        3,
                    )},current ADAL AVG in seconds: ${(_adalAfterKliingBaseLine / 1000).toFixed(3)} `,
                });
                //3. calculating 120% of the avarage saved in ADA
                const killing120precAVG = parseInt((_adalAfterKliingBaseLine * 1.2).toFixed(0));
                //3.1. testing whether we passed the saved avarage by more than 20%
                expect(killingAVG).to.be.lessThan(
                    killing120precAVG,
                    `after recycle login is bigger than baseline by: ${(
                        ((killingAVG - _adalAfterKliingBaseLine) / _adalAfterKliingBaseLine) *
                        100
                    ).toFixed(3)}, current baseline:${_adalAfterKliingBaseLine}, current run result" ${killingAVG}`,
                );
                //4. calculating 90% of the avarage saved in ADAL
                const avg90 = parseInt((_adalAfterKliingBaseLine * 0.9).toFixed(0));
                if (killingAVG < avg90) {
                    //5.1. testing whether we sucseed to run in less than 90% of saved duration
                    //5.2. if so - use 'Weighted arithmetic mean' which takes only 5% of the calculated baseline to create the updated baseline in ADAL
                    //this way ADAL's baseline will really 'MOVE' only if a number of runs was this good
                    const newBaseLineForADAL = parseInt(
                        ((_adalAfterKliingBaseLine * 0.95 + killingAVG * 0.05) / 1).toFixed(0),
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
                        ((_adalAfterKliingBaseLine - killingAVG) / _adalAfterKliingBaseLine) *
                        100
                    ).toFixed(3);
                    console.log(
                        `the average in this run improved by: ${improvmentPrec} % comparing to the baseline: current run AVG after recycling: ${killingAVG}, current BASELINE:${_adalAfterKliingBaseLine}`,
                    );
                    addContext(this, {
                        title: `the average of this run with recycling is lower by: ${improvmentPrec}% then baseline`,
                        value: `current run avarage after recycling: ${killingAVG}, current baseline:${_adalAfterKliingBaseLine}, new baseline to push to ADAL: ${newBaseLineForADAL}`,
                    });
                }
            });
        });
    });
}

async function postToADAL(varPass, generalService, bodyToSend, envUrlBase) {
    const secretKey = await generalService.getSecretKey('eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', varPass);
    const adalResponse = await generalService.fetchStatus(
        `https://${envUrlBase}.pepperi.com/V1.0/addons/data/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/LoginPerormanceDataKillSqlite`,
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
