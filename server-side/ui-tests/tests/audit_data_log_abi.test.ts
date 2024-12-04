import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Client } from '@pepperi-addons/debug-server/dist';
import { Browser } from '../utilities/browser';
import {
    WebAppHeader,
    // WebAppHomePage,
    WebAppLoginPage,
    WebAppSettingsSidePanel,
} from '../pom';
import {
    describe,
    it,
    // afterEach,
    before,
    after,
} from 'mocha';
import chai, { expect } from 'chai';
import GeneralService, { FetchStatusResponse } from '../../services/general.service';
import E2EUtils from '../utilities/e2e_utils';
import { AuditDataLog } from '../pom/addons/AuditDataLog';

chai.use(promised);

export async function AuditDataLogAbiTests(email: string, password: string, client: Client, varPass: string) {
    /** Description **/

    const generalService = new GeneralService(client);
    const dateTime = new Date();
    const performanceMeasurements = {};
    // const baseUrl = `https://app${client.BaseURL.includes('staging') ? '.sandbox' : ''}.pepperi.com`;

    await generalService.baseAddonVersionsInstallation(varPass);

    const testData = {
        'Audit Log': ['00000000-0000-0000-0000-00000da1a109', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''], // open-sync 2.0.% or 3.%
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        Nebulus: ['e8b5bb3a-d2df-4828-90f4-32cc3d49f207', ''], // dependency of UDC
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''], // UDC current phased version 0.8.29 | dependency > 0.8.11
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '18.3.3'],
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [
            client.BaseURL.includes('staging')
                ? '48d20f0b-369a-4b34-b48a-ffe245088513'
                : '78696fc6-a04f-4f82-aadf-8f823776473f',
            '0.0.1',
        ],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);

    const installedAuditLogVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Audit Log',
    )?.Version;

    describe(`Prerequisites Addons for Audit Data Log ABI Tests - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } | Ver. ${installedAuditLogVersion} | Tested user: ${email} | ${dateTime}`, () => {
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            const currentAddonChnageVersionResponse = chnageVersionResponseArr[addonName];
            const varLatestVersion = currentAddonChnageVersionResponse[2];
            const changeType = currentAddonChnageVersionResponse[3];
            const status = currentAddonChnageVersionResponse[4];
            const note = currentAddonChnageVersionResponse[5];

            describe(`"${addonName}"`, () => {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                    if (status == 'Failure') {
                        expect(note).to.include('is already working on version');
                    } else {
                        expect(status).to.include('Success');
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

    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let settingsSidePanel: WebAppSettingsSidePanel;
    // let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let e2eUtils: E2EUtils;
    let auditDataLog: AuditDataLog;
    let screenShot;
    let auditDataLogURL;
    let dataLog_objectKey: string;
    let dataLog_resource: string;
    let dataLog_fieldId: string;
    let dataLog_addonUUID: string;
    let codeJob_UUID: string;
    let executionUUID: string;
    let dataLogOfExecute: FetchStatusResponse;

    describe(`Audit Data Log ABI Test Suite`, async () => {
        describe('UI Tests', async () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHeader = new WebAppHeader(driver);
                settingsSidePanel = new WebAppSettingsSidePanel(driver);
                e2eUtils = new E2EUtils(driver);
                auditDataLog = new AuditDataLog(driver);
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async () => {
                await webAppLoginPage.login(email, password);
            });

            it('Perform Manual Sync With Time Measurement', async function () {
                const syncTime = await e2eUtils.performManualSyncWithTimeMeasurement.bind(this)(client, driver);
                addContext(this, {
                    title: `Sync Time Interval`,
                    value: `milisec: ${syncTime} , ${(syncTime / 1000).toFixed(1)} S`,
                });
                performanceMeasurements['No Data Sync'] = {
                    milisec: syncTime,
                    sec: Number((syncTime / 1000).toFixed(1)),
                };
                expect(syncTime).to.be.a('number').and.greaterThan(0);
            });

            it('Perform Manual Resync With Time Measurement', async function () {
                const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
                addContext(this, {
                    title: `Resync Time Interval`,
                    value: `milisec: ${resyncTime} , ${(resyncTime / 1000).toFixed(1)} S`,
                });
                performanceMeasurements['No Data Resync'] = {
                    milisec: resyncTime,
                    sec: Number((resyncTime / 1000).toFixed(1)),
                };
                expect(resyncTime).to.be.a('number').and.greaterThan(0);
            });

            it('Navigate to Settings->System Monitor->Audit Data Log', async function () {
                await webAppHeader.goHome();
                await webAppHeader.isSpinnerDone();
                await webAppHeader.openSettings();
                await webAppHeader.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                await settingsSidePanel.selectSettingsByID('System Monitor');
                await settingsSidePanel.clickSettingsSubCategory('audit_data_log', 'System Monitor');
                await webAppHeader.isSpinnerDone();
                driver.sleep(2.5 * 1000);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Settings->System Monitor->Audit Data Log`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                auditDataLogURL = await driver.getCurrentUrl();
                console.info('auditDataLogURL: ', auditDataLogURL);
            });

            describe('Data Log', async () => {
                it('Adding query params with valid values (for data log) to current URL', async function () {
                    const allAuditLogData = await generalService.fetchStatus(
                        '/addons/api/00000000-0000-0000-0000-00000da1a109/api/get_audit_log_data?search_string_fields=ActionUUID.keyword,ObjectKey.keyword,UpdatedFields.FieldID,UpdatedFields.NewValue,UpdatedFields.OldValue&order_by=ObjectModificationDateTime%20desc&page_size=200',
                        {
                            method: 'GET',
                        },
                    );
                    console.info('allAuditLogData: ', JSON.stringify(allAuditLogData, null, 2));
                    const firstListingOfDataLog = allAuditLogData.Body.AuditLogs[1];
                    console.info('first listing from AuditLogData: ', JSON.stringify(firstListingOfDataLog, null, 2));
                    dataLog_objectKey = firstListingOfDataLog.ObjectKey;
                    dataLog_resource = firstListingOfDataLog.Resource;
                    dataLog_fieldId = firstListingOfDataLog.UpdatedFields[1].FieldID;
                    dataLog_addonUUID = firstListingOfDataLog.AddonUUID;
                    const validQueyParams = `?showAuditDataFieldLogButton=true&ObjectKey=${dataLog_objectKey}&Resource=${dataLog_resource}&FieldID=${dataLog_fieldId}&Title=Valid Test&AddonUUID=${dataLog_addonUUID}`;
                    console.info('validQueyParams: ', validQueyParams);
                    addContext(this, {
                        title: `The provided valid query params`,
                        value: validQueyParams,
                    });
                    await driver.navigate(auditDataLogURL + validQueyParams);
                    driver.sleep(10 * 1000);
                });

                it('Checking that the relevant button appears (for data log)', async function () {
                    await driver.untilIsVisible(auditDataLog.openFieldLogABI_button);
                    screenShot = await driver.saveScreenshots();
                    addContext(this, {
                        title: `"Open Audit Data Log" Button should appear`,
                        value: 'data:image/png;base64,' + screenShot,
                    });
                });

                it('clicking button (data log) and checking that dialog with data appears', async function () {
                    driver.sleep(1 * 1000);
                    await driver.click(auditDataLog.openFieldLogABI_button);
                    driver.sleep(1 * 1000);
                    await driver.untilIsVisible(auditDataLog.dialogContainer);
                    await driver.untilIsVisible(auditDataLog.auditDataFieldLogBlock_element);
                    screenShot = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Field validations starts`,
                        value: 'data:image/png;base64,' + screenShot,
                    });
                    await driver.untilIsVisible(auditDataLog.ceationDateTime_field);
                    await driver.untilIsVisible(auditDataLog.email_field);
                    await driver.untilIsVisible(auditDataLog.name_field);
                    await driver.untilIsVisible(auditDataLog.updatedFields_field);
                    await driver.untilIsVisible(auditDataLog.externalID_field);
                    await driver.untilIsVisible(auditDataLog.userID_field);
                    await driver.untilIsVisible(auditDataLog.actionUUID_field);
                });

                it('Changing query params to invalid values (nighther ObjectKey, Resource nor AddonUUID are provided)', async function () {
                    const invalidQueyParams = `?showAuditDataFieldLogButton=true&ObjectKey=&Resource=&FieldID=SystemData&Title=Invalid Test&AddonUUID=`;
                    addContext(this, {
                        title: `The provided invalid query params`,
                        value: invalidQueyParams,
                    });
                    await driver.navigate(auditDataLogURL + invalidQueyParams);
                    driver.sleep(10 * 1000);
                    await driver.untilIsVisible(auditDataLog.openFieldLogABI_button);
                    screenShot = await driver.saveScreenshots();
                    addContext(this, {
                        title: `"Open Audit Data Log" Button should appear`,
                        value: 'data:image/png;base64,' + screenShot,
                    });
                    driver.sleep(1 * 1000);
                    await driver.click(auditDataLog.openFieldLogABI_button);
                    driver.sleep(2 * 1000);
                    await driver.untilIsVisible(auditDataLog.dialogContainer);
                    await driver.untilIsVisible(auditDataLog.auditDataFieldLogBlock_element);
                });

                it('Checking that the correct error message shows ("In where query, ObjectKey or Resource or AddonUUID is required")', async function () {
                    const emptyListTitle = await (await driver.findElement(auditDataLog.emptyListTitle_div)).getText();
                    expect(emptyListTitle).to.equal('No results were found');
                    const emptyListDescription = await (
                        await driver.findElement(auditDataLog.emptyListDescription_div)
                    ).getText();
                    expect(emptyListDescription).to.contain('ObjectKey or Resource or AddonUUID is required');
                    screenShot = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Error message with "ObjectKey or Resource or AddonUUID is required"`,
                        value: 'data:image/png;base64,' + screenShot,
                    });
                });

                it('Changing query params to invalid values (FieldID is not provided)', async function () {
                    const invalidQueyParams = `?showAuditDataFieldLogButton=true&ObjectKey=${dataLog_objectKey}&Resource=${dataLog_resource}&FieldID=&Title=Valid Test&AddonUUID=${dataLog_addonUUID}`;
                    addContext(this, {
                        title: `The provided invalid query params`,
                        value: invalidQueyParams,
                    });
                    await driver.navigate(auditDataLogURL + invalidQueyParams);
                    driver.sleep(10 * 1000);
                    await driver.untilIsVisible(auditDataLog.openFieldLogABI_button);
                    screenShot = await driver.saveScreenshots();
                    addContext(this, {
                        title: `"Open Audit Data Log" Button should appear`,
                        value: 'data:image/png;base64,' + screenShot,
                    });
                    driver.sleep(1 * 1000);
                    await driver.click(auditDataLog.openFieldLogABI_button);
                    driver.sleep(2 * 1000);
                    await driver.untilIsVisible(auditDataLog.dialogContainer);
                    await driver.untilIsVisible(auditDataLog.auditDataFieldLogBlock_element);
                });

                it('Checking that the correct error message shows ("FieldID is required")', async function () {
                    const emptyListTitle = await (await driver.findElement(auditDataLog.emptyListTitle_div)).getText();
                    expect(emptyListTitle).to.equal('No results were found');
                    const emptyListDescription = await (
                        await driver.findElement(auditDataLog.emptyListDescription_div)
                    ).getText();
                    expect(emptyListDescription).to.contain('FieldID is required');
                    screenShot = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Error message with "FieldID is required"`,
                        value: 'data:image/png;base64,' + screenShot,
                    });
                });
            });

            describe('Async Job', async () => {
                it('Creating Async Job', async function () {
                    const bodyOfAsyncJob = {
                        CodeJobName: 'AddonJob with values',
                        Description: 'Audit Data Log ABI auto test',
                        Type: 'AddonJob',
                        IsScheduled: false,
                        CodeJobIsHidden: false,
                        ExecutionMemoryLevel: 1,
                        NumberOfTries: 1,
                        AddonPath: 'test.js',
                        AddonUUID: client.BaseURL.includes('staging')
                            ? '48d20f0b-369a-4b34-b48a-ffe245088513'
                            : '78696fc6-a04f-4f82-aadf-8f823776473f',
                        FunctionName: 'getTransactions',
                    };
                    const createdAsyncJob = await generalService.fetchStatus('/code_jobs', {
                        method: 'POST',
                        body: JSON.stringify(bodyOfAsyncJob),
                    });
                    console.info('createdAsyncJob: ', JSON.stringify(createdAsyncJob, null, 2));
                    const createdCodeJobBody = createdAsyncJob.Body;
                    console.info('first listing from createdAsyncJob: ', JSON.stringify(createdCodeJobBody, null, 2));
                    codeJob_UUID = createdCodeJobBody.UUID;
                    console.info('createdCodeJob_UUID: ', codeJob_UUID);
                    addContext(this, {
                        title: `createdCodeJob_UUID`,
                        value: codeJob_UUID,
                    });
                    const executedAsyncJob = await generalService.fetchStatus(
                        `/code_jobs/async/${codeJob_UUID}/execute`,
                        {
                            method: 'POST',
                        },
                    );
                    console.info('executedAsyncJob: ', JSON.stringify(executedAsyncJob, null, 2));
                    addContext(this, {
                        title: `executedAsyncJob`,
                        value: JSON.stringify(executedAsyncJob, null, 2),
                    });
                    executionUUID = executedAsyncJob.Body.ExecutionUUID;
                    driver.sleep(2 * 1000);
                    dataLogOfExecute = await generalService.fetchStatus(`/audit_logs/${executionUUID}`, {
                        method: 'GET',
                    });
                    console.info('dataLogOfExecute: ', JSON.stringify(dataLogOfExecute, null, 2));
                    addContext(this, {
                        title: `dataLogOfExecute`,
                        value: JSON.stringify(dataLogOfExecute, null, 2),
                    });
                    driver.sleep(10 * 1000);
                });

                it('Adding query params with valid values (for async job) to current URL', async function () {
                    // the following section counts on existing data:

                    // const allCodeJobsData = await generalService.fetchStatus('/code_jobs', {
                    //     method: 'GET',
                    // });
                    // console.info('allCodeJobsData: ', JSON.stringify(allCodeJobsData, null, 2));
                    // const firstListingOfCodeJobs = allCodeJobsData.Body[0];
                    // console.info(
                    //     'first listing from allCodeJobsData: ',
                    //     JSON.stringify(firstListingOfCodeJobs, null, 2),
                    // );
                    // codeJob_UUID = firstListingOfCodeJobs.UUID;

                    // since we are creating our own async job data - we do not need to GET the existing data.   Hagit Dec. 2024
                    const validQueyParams = `?showAsyncJobButton=true&where=AuditInfo.JobMessageData.CodeJobUUID='${codeJob_UUID}'`;
                    console.info('validQueyParams: ', validQueyParams);
                    addContext(this, {
                        title: `The provided valid query params`,
                        value: validQueyParams,
                    });
                    console.info('Navigate to URL: ', auditDataLogURL + validQueyParams);
                    await driver.navigate(auditDataLogURL + validQueyParams);
                    driver.sleep(10 * 1000);
                });

                it('Checking that the relevant button appears (for async job)', async function () {
                    await driver.untilIsVisible(auditDataLog.openAsyncJob_button);
                    screenShot = await driver.saveScreenshots();
                    addContext(this, {
                        title: `"Open Async Job" Button should appear`,
                        value: 'data:image/png;base64,' + screenShot,
                    });
                });

                it('clicking button (async job) and checking that dialog with data appears', async function () {
                    driver.sleep(1 * 1000);
                    await driver.click(auditDataLog.openAsyncJob_button);
                    driver.sleep(2 * 1000);
                    await driver.untilIsVisible(auditDataLog.dialogContainer);
                    await driver.untilIsVisible(auditDataLog.asyncJobBlock_element);
                    screenShot = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Field validations starts`,
                        value: 'data:image/png;base64,' + screenShot,
                    });
                    await driver.untilIsVisible(auditDataLog.executionUUID_link);
                    await driver.untilIsVisible(auditDataLog.status_field);
                    await driver.untilIsVisible(auditDataLog.numberOfTries_field);
                    await driver.untilIsVisible(auditDataLog.startTime_field);
                    await driver.untilIsVisible(auditDataLog.endTime_field);
                });

                it('Comparing UI fetched data to API', async function () {
                    const executionUUID_element = await driver.findElement(auditDataLog.executionUUID_a);
                    const executionUUID_element_value = await executionUUID_element.getText();
                    const statusContent_element = await driver.findElement(auditDataLog.status_field_content);
                    const statusContent_element_value = await statusContent_element.getText();
                    screenShot = await driver.saveScreenshots();
                    console.info('executionUUID from API: ', executionUUID);
                    addContext(this, {
                        title: `Execution UUID from the API request`,
                        value: executionUUID,
                    });
                    console.info('executionUUID from UI: ', executionUUID_element_value);
                    addContext(this, {
                        title: `Execution UUID from the UI`,
                        value: executionUUID_element_value,
                    });
                    addContext(this, {
                        title: `"Async Job" display`,
                        value: 'data:image/png;base64,' + screenShot,
                    });
                    expect(executionUUID_element_value).equals(executionUUID);
                    expect(dataLogOfExecute)
                        .to.haveOwnProperty('Body')
                        .that.haveOwnProperty('UUID')
                        .that.is.equal(executionUUID);
                    expect(statusContent_element_value).equals('Success');
                    expect(dataLogOfExecute.Body)
                        .to.haveOwnProperty('Status')
                        .that.haveOwnProperty('Name')
                        .that.is.equal('Success');
                });

                it('Changing query params to invalid values (CodeJobUUID is not provided)', async function () {
                    const invalidQueyParams = `?showAsyncJobButton=true&where=AuditInfo.JobMessageData.CodeJobUUID=''`;
                    addContext(this, {
                        title: `The provided invalid query params`,
                        value: invalidQueyParams,
                    });
                    await driver.navigate(auditDataLogURL + invalidQueyParams);
                    driver.sleep(10 * 1000);
                    await driver.untilIsVisible(auditDataLog.openAsyncJob_button);
                    screenShot = await driver.saveScreenshots();
                    addContext(this, {
                        title: `"Open Async Job" Button should appear`,
                        value: 'data:image/png;base64,' + screenShot,
                    });
                    driver.sleep(1 * 1000);
                    await driver.click(auditDataLog.openAsyncJob_button);
                    driver.sleep(2 * 1000);
                    await driver.untilIsVisible(auditDataLog.dialogContainer);
                    await driver.untilIsVisible(auditDataLog.asyncJobBlock_element);
                });

                it('Checking that the correct error message shows ("There are no async jobs available")', async function () {
                    const emptyListTitle = await (await driver.findElement(auditDataLog.emptyListTitle_div)).getText();
                    expect(emptyListTitle).to.equal('No async jobs available');
                    const emptyListDescription = await (
                        await driver.findElement(auditDataLog.emptyListDescription_div)
                    ).getText();
                    expect(emptyListDescription).to.contain('no async jobs available');
                    screenShot = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Error message with "There are no async jobs available"`,
                        value: 'data:image/png;base64,' + screenShot,
                    });
                });
            });
        });
    });
}
