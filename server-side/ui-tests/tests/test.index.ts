import GeneralService, {
    ConsoleColors,
    TesterFunctions,
    ResourceTypes,
    testDataForInitUser,
    initiateTester,
} from '../../services/general.service';
import fs from 'fs';
import { describe, it, after, beforeEach, afterEach, run } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import {
    TestDataTests,
    DistributorTests,
    AddonDataImportExportTests,
    AddonDataImportExportPerformanceTests,
    AddonDataImportExportReferenceTests,
} from '../../api-tests/index';
import {
    LoginTests,
    OrderTests,
    WorkflowTests,
    DeepLinkTests,
    PromotionTests,
    SecurityPolicyTests,
    CreateDistributorTests,
    UomTests,
    AWSLogsTester,
    PageBuilderTests,
    UDCTests,
    CloseCatalogTest,
    LoginPerfTests,
    LoginPerfSqlitefTests,
    ResourceListTests,
    RLdataPrep,
    VisitFlowTests,
    VFdataPrep,
    MockTest,
    SurveyTests,
    PricingTests,
    PricingDataPrep,
} from './index';
import { ObjectsService } from '../../services/objects.service';
import { Client } from '@pepperi-addons/debug-server';
import { UIControl } from '@pepperi-addons/papi-sdk';
// import { testData } from './../../services/general.service';
import {} from './script_picker.test';
import { PFSTestser } from '../../api-tests/pepperi_file_service';
import { AsyncAddonGetRemoveTestser } from '../../api-tests/objects/async_addon_get_remove_codejobs';
import { DimxDataImportTestsTestser } from '../../api-tests/dimx_data_import';
import { LoginPerfTestsReload } from './login_performance_reload.test';
import { UDCTestser } from '../../api-tests/user_defined_collections';
import { maintenance3APITestser } from '../../api-tests/addons';
import { handleDevTestInstallation } from '../../tests';
import { NgxLibPOC } from './NgxLibPOC.test';
import { PurgeAllUcds } from './purge_all_udcs_script.test copy';

/**
 * To run this script from CLI please replace each <> with the correct user information:
 * npm run ui-show-report --server=stage/prod --chrome_headless=false --user_email='<>' --user_pass='<>' --var_pass='<>' --tests='<>'
 *
 * There are two scripts that should be used with the default seetings:
 * 1. ui-cli-report - This script for executing the script in Jenkins.
 * 2. ui-show-repor - This will open the browser with the report when the test finished.
 *
 * Used Params are:
 * 1. server - This switch between 'stage' for stage or any for 'production'.
 * 2. chrome_headless - This switch accept boolean value
 */

chai.use(promised);

const tests = process.env.npm_config_tests as string;
const email = process.env.npm_config_user_email as string;
const pass = process.env.npm_config_user_pass as string;
const varPass = process.env.npm_config_var_pass as string;
const varPassEU = process.env.npm_config_var_pass_eu as string;
const varPassSB = process.env.npm_config_var_pass_sb as string;
const addon = process.env.npm_config_addon as string;
const userNameCreate = process.env.npm_config_user_name_create as string;
const passCreate = process.env.npm_config_pass_create as string;

(async function () {
    const tempGeneralService = new GeneralService({
        AddonUUID: '',
        AddonSecretKey: '',
        BaseURL: '',
        OAuthAccessToken: '',
        AssetsBaseUrl: '',
        Retry: function () {
            return;
        },
        ValidatePermission: async function (policyName: string) {
            console.log(policyName);
            return;
        },
    });

    const client: Client = await tempGeneralService.initiateTester(email, pass);

    const generalService = new GeneralService(client);
    //SYS REPORTING
    // const arrayOfItResules: string[] = [];
    // let testSuitName = '';

    let nestedGap = '';
    let startedTestSuiteTitle = '';

    generalService.PrintMemoryUseToLog('Start', tests);
    after(async function () {
        //SYS REPORTING
        // const arrAfterFilter = arrayOfItResules.filter((elem) => elem === 'FAIL');
        // const testSuitStatus = arrAfterFilter.length === 0 ? 'SUCCESS' : 'ERROR';
        // if (testSuitStatus === 'SUCCESS') {
        //     const monitoringResult = await generalService.sendResultsToMonitoringAddon(
        //         'user',
        //         testSuitName,
        //         testSuitStatus,
        //         'env',
        //     );
        // if (monitoringResult.Ok !== true || monitoringResult.Status !== 200) {
        //     console.log('FAILED TO SEND REPORT TO MOINITORING ADDON', ConsoleColors.Error);
        // }
        // }
        generalService.PrintMemoryUseToLog('End', tests);
    });

    beforeEach(function () {
        let isCorrectNestedGap = false;
        // testSuitName = testSuitName === '' ? this.currentTest.parent.title : testSuitName;
        do {
            if (
                this.currentTest.parent.suites.length > nestedGap.length &&
                this.currentTest.parent.title != startedTestSuiteTitle
            ) {
                const suiteTitle = this.currentTest.parent.title;
                nestedGap += '\t';
                console.log(
                    `%c${nestedGap.slice(1)}Test Suite Start: '${suiteTitle}'`,
                    ConsoleColors.SystemInformation,
                );
                startedTestSuiteTitle = suiteTitle;
            } else if (
                this.currentTest.parent.suites.length < nestedGap.length &&
                this.currentTest.parent.title != startedTestSuiteTitle
            ) {
                console.log(
                    `%c${nestedGap.slice(1)}Test Suite End: '${startedTestSuiteTitle}'\n`,
                    ConsoleColors.SystemInformation,
                );
                nestedGap = nestedGap.slice(1);
            } else if (
                this.currentTest.parent.suites.length == 0 &&
                this.currentTest.parent.title != startedTestSuiteTitle
            ) {
                isCorrectNestedGap = true;
                nestedGap = '\t';
                console.log(`%cTest Suite Start: '${this.currentTest.parent.title}'`, ConsoleColors.SystemInformation);
                console.log(`%c${nestedGap}Test Start: '${this.currentTest.title}'`, ConsoleColors.SystemInformation);
                startedTestSuiteTitle = this.currentTest.parent.title;
            } else {
                isCorrectNestedGap = true;
                console.log(`%c${nestedGap}Test Start: '${this.currentTest.title}'`, ConsoleColors.SystemInformation);
            }
        } while (!isCorrectNestedGap);
    });

    afterEach(async function () {
        if (this.currentTest.state != 'passed') {
            console.log(
                `%c${nestedGap}Test End: '${this.currentTest.title}': Result: '${this.currentTest.state}'`,
                ConsoleColors.Error,
            );
            //SYS REPORTING
            // arrayOfItResules.push('FAIL');
            // const indexOfParentheses =
            //     this.currentTest.parent.title.indexOf('(') === -1
            //         ? this.currentTest.parent.title.length
            //         : this.currentTest.parent.title.indexOf('(');
            // const testSuitName = this.currentTest.parent.title.substring(0, indexOfParentheses);
            // const testName = `${testSuitName} : ${this.currentTest.title}_retry:${this.currentTest._currentRetry} / ${this.currentTest._retries}`;
            // const monitoringResult = await generalService.sendResultsToMonitoringAddon(
            //     'user',
            //     testName,
            //     'ERROR',
            //     'env',
            // );
            // if (monitoringResult.Ok !== true || monitoringResult.Status !== 200) {
            //     console.log('FAILED TO SEND REPORT TO MOINITORING ADDON', ConsoleColors.Error);
            // }
        } else {
            console.log(
                `%c${nestedGap}Test End: '${this.currentTest.title}': Result: '${this.currentTest.state}'`,
                ConsoleColors.Success,
            );
            // arrayOfItResules.push('PASS');
            // const testSuitName = this.currentTest.parent.title.substring(0, this.currentTest.parent.title.indexOf('('));
            // const testName = `${testSuitName}:${this.currentTest.title}`;
            // const monitoringResult = await generalService.sendResultsToMonitoringAddon(testName, "SUCCESS");
            // if (monitoringResult.Ok !== true || monitoringResult.Status !== 200) {
            //     console.log("FAILED TO SEND REPORT TO MOINITORING ADDON", ConsoleColors.Error);
            // }
        }
        if (this.currentTest.parent.tests.slice(-1)[0].title == this.currentTest.title) {
            console.log(
                `%c${nestedGap.slice(1)}Test Suite End: '${startedTestSuiteTitle}'\n`,
                ConsoleColors.SystemInformation,
            );
            nestedGap = nestedGap.slice(1);
        }
    });

    // if (tests != 'Create') {
    //     await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    // }

    if (tests.includes('Reset')) {
        //Reset the needed UI Controls for the UI tests.
        await replaceUIControlsTests(this, generalService);

        //Verify all items exist or replace them
        await replaceItemsTests(generalService);

        await newUserDependenciesTests(generalService, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Sanity')) {
        await LoginTests(email, pass);
        await OrderTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('evgeny')) {
        await PurgeAllUcds(client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Workflow')) {
        await WorkflowTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('DeepLink')) {
        await DeepLinkTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Promotion')) {
        await PromotionTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Security')) {
        await SecurityPolicyTests(email, pass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Create')) {
        debugger;
        if (userNameCreate && passCreate) {
            await CreateDistributorTests(generalService, varPass, varPassEU, userNameCreate, passCreate);
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        } else {
            await CreateDistributorTests(generalService, varPass, varPassEU);
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        }
    }

    if (tests.includes('Uom')) {
        await UomTests(email, pass, varPass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('CloseCatalog')) {
        await CloseCatalogTest(email, pass, varPass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('PageBuilder')) {
        await PageBuilderTests(email, pass, varPass, generalService);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('DataPrepRL')) {
        await RLdataPrep(varPass, client);
    }

    if (tests.includes('DataPrepVF')) {
        await VFdataPrep(varPass, client);
    }

    if (tests.includes('ResourceList')) {
        // await RLdataPrep(client);
        await ResourceListTests(email, pass, varPass, client);
    }

    if (tests.includes('VisitFlow')) {
        await VFdataPrep(varPass, client);
        await VisitFlowTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('DataPrepPrc')) {
        await PricingDataPrep(varPass, client);
    }

    if (tests.includes('Pricing')) {
        await PricingDataPrep(varPass, client);
        await PricingTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('MockTest')) {
        await MockTest(email, pass, client);
        // await ResourceListTests(email, pass, varPass, client);
    }

    if (tests.includes('Distributor')) {
        await DistributorTests(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            { describe, expect, it } as TesterFunctions,
        );
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('DimxAPI')) {
        await AddonDataImportExportTests(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            { describe, expect, it } as TesterFunctions,
        );
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('PfsAPI')) {
        await PFSTestser(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            { describe, expect, it } as TesterFunctions,
        );
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('ApiUDC')) {
        await UDCTestser(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            { describe, expect, it } as TesterFunctions,
        );
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('maintenance3API')) {
        const service = new GeneralService(client);
        const testerFunctions = service.initiateTesterFunctions(client, 'maintenance3API');
        await maintenance3APITestser(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            testerFunctions,
        );
        await TestDataTests(generalService, testerFunctions);
    }

    if (tests.includes('AsyncAddonGetRemoveCodeJobsCLI')) {
        await AsyncAddonGetRemoveTestser(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            { describe, expect, it } as TesterFunctions,
        );
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('DimxDataImport')) {
        await DimxDataImportTestsTestser(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            { describe, expect, it } as TesterFunctions,
        );
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('DimxPerformance')) {
        await AddonDataImportExportPerformanceTests(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            { describe, expect, it } as TesterFunctions,
        );
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('DimxReference')) {
        await AddonDataImportExportReferenceTests(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            { describe, expect, it } as TesterFunctions,
        );
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('UdcUI')) {
        await UDCTests(email, pass, varPass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }
    if (tests.includes('Survey')) {
        await SurveyTests(email, pass, client, varPass); //, varPass, client
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }
    if (tests.includes('NGX_POC')) {
        await NgxLibPOC(); // all is needed is the client for general service as were not using an actual pepperi user
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }
    if (tests.includes('login_performance')) {
        await LoginPerfTests(email, pass, varPass, client, varPassEU);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }
    if (tests.includes('login_perf_sqlite')) {
        await LoginPerfSqlitefTests(email, pass, varPass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }
    if (tests.includes('login_perf_reload')) {
        await LoginPerfTestsReload(email, pass, varPass, client, varPassEU);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }
    if (tests.includes('aws_logs')) {
        await AWSLogsTester(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            { describe, expect, it } as TesterFunctions,
        );
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Remote_Jenkins_Handler')) {
        //For local run that run on Jenkins this is needed since Jenkins dont inject SK to the test execution folder
        if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
            generalService['client'].AddonSecretKey = await generalService.getSecretKey(
                generalService['client'].AddonUUID,
                varPass,
            );
        }
        // getting VAR credentials for all envs
        const base64VARCredentialsProd = Buffer.from(varPass).toString('base64');
        const base64VARCredentialsEU = Buffer.from(varPassEU).toString('base64');
        const base64VARCredentialsSB = Buffer.from(varPassSB).toString('base64');
        const service = new GeneralService(client);
        const addonName = addon.toUpperCase();
        let addonEntryUUIDProd = '';
        let addonEntryUUIDEu = '';
        let addonEntryUUIDSb = '';
        let addonUUID;
        const passedTests: string[] = [];
        const passedTestsEnv: string[] = [];
        const failingTestsEnv: string[] = [];
        let testsList: string[] = [];
        addonUUID = generalService.convertNameToUUIDForDevTests(addonName);
        if (addonUUID === 'none') {
            console.log('No Dev Test For This Addon - Proceeding To Run Approvment');
        } else {
            const [euUser, prodUser, sbUser] = resolveUserPerTest(addonName); //
            console.log(`####################### Running For: ${addonName}(${addonUUID}) #######################`);
            // 1. install all dependencys latest available versions on testing user + template addon latest available version
            await Promise.all([
                handleDevTestInstallation(
                    euUser,
                    addonName,
                    addonUUID,
                    { describe, expect, it } as TesterFunctions,
                    varPass,
                    'prod',
                ),
                handleDevTestInstallation(
                    prodUser,
                    addonName,
                    addonUUID,
                    { describe, expect, it } as TesterFunctions,
                    varPass,
                    'prod',
                ),
                handleDevTestInstallation(
                    sbUser,
                    addonName,
                    addonUUID,
                    { describe, expect, it } as TesterFunctions,
                    varPassSB,
                    'stage',
                ),
            ]);
            //2. validate tested addon is installed on latest available version
            const [latestVersionOfTestedAddonProd, addonEntryUUIDProd] = await generalService.getLatestAvailableVersion(
                addonUUID,
                varPass,
                null,
                'prod',
            );
            const [latestVersionOfTestedAddonEu, addonEntryUUIDEU] = await generalService.getLatestAvailableVersion(
                addonUUID,
                varPassEU,
                null,
                'prod',
            );
            const [latestVersionOfTestedAddonSb, addonEntryUUIDSb] = await generalService.getLatestAvailableVersion(
                addonUUID,
                varPassSB,
                null,
                'stage',
            );
            if (
                latestVersionOfTestedAddonSb !== latestVersionOfTestedAddonEu ||
                latestVersionOfTestedAddonProd !== latestVersionOfTestedAddonEu ||
                latestVersionOfTestedAddonProd !== latestVersionOfTestedAddonSb
            ) {
                throw new Error(
                    `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${latestVersionOfTestedAddonProd}, sb - ${latestVersionOfTestedAddonSb}, eu - ${latestVersionOfTestedAddonEu}`,
                );
            }
            console.log(
                `####################### ${addonName} Version: ${latestVersionOfTestedAddonProd} #######################`,
            );
            debugger;
            const isInstalled = await Promise.all([
                validateLatestVersionOfAddonIsInstalled(euUser, addonUUID, latestVersionOfTestedAddonEu, 'prod'),
                validateLatestVersionOfAddonIsInstalled(prodUser, addonUUID, latestVersionOfTestedAddonProd, 'prod'),
                validateLatestVersionOfAddonIsInstalled(sbUser, addonUUID, latestVersionOfTestedAddonSb, 'stage'),
            ]);
            for (let index = 0; index < isInstalled.length; index++) {
                const isTestedAddonInstalled = isInstalled[index];
                if (isTestedAddonInstalled === false) {
                    throw new Error(
                        `Error: didn't install ${addonName} - ${addonUUID}, version: ${latestVersionOfTestedAddonProd}`,
                    );
                }
            }
            //3. run the test on latest version of the template addon
            const [latestVersionOfAutomationTemplateAddon, entryUUID] = await generalService.getLatestAvailableVersion(
                '02754342-e0b5-4300-b728-a94ea5e0e8f4',
                varPass,
            );
            console.log(entryUUID);
            //3.1 get test names
            testsList = await getTestNames(
                addonName,
                prodUser,
                'prod',
                latestVersionOfAutomationTemplateAddon,
                addonUUID,
            );
            //4. iterate on all test names and call each
            for (let index = 0; index < testsList.length; index++) {
                const currentTestName = testsList[index];
                const body = prepareTestBody(addonName, currentTestName, addonUUID);
                console.log(
                    `####################### Running: ${currentTestName}, number: ${index + 1} out of: ${
                        testsList.length
                    }  #######################`,
                );
                //4.1. call current test async->
                const [devTestResponseEu, devTestResponseProd, devTestResponseSb] = await Promise.all([
                    //devTestResponseEu,
                    runDevTestOnCertainEnv(euUser, 'prod', latestVersionOfAutomationTemplateAddon, body, addonName),
                    runDevTestOnCertainEnv(prodUser, 'prod', latestVersionOfAutomationTemplateAddon, body, addonName),
                    runDevTestOnCertainEnv(sbUser, 'stage', latestVersionOfAutomationTemplateAddon, body, addonName),
                ]);
                //4.2. poll audit log response for each env->devTestResutsEu,
                const [devTestResutsEu, devTestResultsProd, devTestResultsSb] = await Promise.all([
                    //devTestResutsEu,
                    getTestResponseFromAuditLog(euUser, 'prod', devTestResponseEu.Body.URI),
                    getTestResponseFromAuditLog(prodUser, 'prod', devTestResponseProd.Body.URI),
                    getTestResponseFromAuditLog(sbUser, 'stage', devTestResponseSb.Body.URI),
                ]);
                //4.3. parse the response
                let testResultArrayEu;
                let testResultArrayProd;
                let testResultArraySB;
                try {
                    testResultArrayEu = JSON.parse(devTestResutsEu.AuditInfo.ResultObject);
                    testResultArrayProd = JSON.parse(devTestResultsProd.AuditInfo.ResultObject);
                    testResultArraySB = JSON.parse(devTestResultsSb.AuditInfo.ResultObject);
                } catch (error) {
                    let errorString = '';
                    if (!devTestResutsEu.AuditInfo.ResultObject) {
                        errorString += `${euUser} got the error: ${devTestResutsEu.AuditInfo.ErrorMessage},\n`;
                    }
                    if (!devTestResultsProd.AuditInfo.ResultObject) {
                        errorString += `${prodUser} got the error: ${devTestResultsProd.AuditInfo.ErrorMessage},\n`;
                    }
                    if (!devTestResultsSb.AuditInfo.ResultObject) {
                        errorString += `${sbUser} got the error: ${devTestResultsSb.AuditInfo.ErrorMessage},\n`;
                    }
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                        errorString,
                        service,
                    );
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                // debugger;
                //4.4. print results to log
                const devPassingEnvs: any[] = [];
                const devFailedEnvs: any[] = [];
                //4.5. print the results
                let objectToPrintEu;
                let objectToPrintProd;
                let objectToPrintSB;
                let shouldAlsoPrintVer = false;
                if (
                    testResultArrayProd.results &&
                    testResultArrayProd.results[0].suites[0].suites &&
                    testResultArrayProd.results[0].suites[0].suites.length > 0
                ) {
                    shouldAlsoPrintVer = true;
                    objectToPrintEu = testResultArrayEu.results[0].suites[0].suites;
                    objectToPrintProd = testResultArrayProd.results[0].suites[0].suites;
                    objectToPrintSB = testResultArraySB.results[0].suites[0].suites;
                } else if (testResultArrayProd.results) {
                    //add an if to catch the other result config also
                    objectToPrintEu = testResultArrayEu.results[0].suites;
                    objectToPrintProd = testResultArrayProd.results[0].suites;
                    objectToPrintSB = testResultArraySB.results[0].suites;
                } else {
                    objectToPrintEu = testResultArrayEu.tests;
                    objectToPrintProd = testResultArrayProd.tests;
                    objectToPrintSB = testResultArrayProd.tests;
                }
                for (let index = 0; index < objectToPrintProd.length; index++) {
                    const result = objectToPrintProd[index];
                    console.log(`\n***${currentTestName} PROD result object: ${JSON.stringify(result)}***\n`);
                }
                for (let index = 0; index < objectToPrintSB.length; index++) {
                    const result = objectToPrintSB[index];
                    console.log(`\n***${currentTestName} SB result object: ${JSON.stringify(result)}***\n`);
                }
                for (let index = 0; index < objectToPrintEu.length; index++) {
                    const result = objectToPrintSB[index];
                    console.log(`\n***${currentTestName} EU result object: ${JSON.stringify(result)}***\n`);
                }
                const euResults = await printResultsTestObject(
                    objectToPrintEu,
                    euUser,
                    'prod',
                    addonUUID,
                    latestVersionOfTestedAddonProd,
                );
                const prodResults = await printResultsTestObject(
                    objectToPrintProd,
                    prodUser,
                    'prod',
                    addonUUID,
                    latestVersionOfTestedAddonProd,
                );
                const sbResults = await printResultsTestObject(
                    objectToPrintSB,
                    sbUser,
                    'stage',
                    addonUUID,
                    latestVersionOfTestedAddonProd,
                );
                if (shouldAlsoPrintVer) {
                    objectToPrintEu = testResultArrayEu.results[0].suites[1].suites;
                    objectToPrintProd = testResultArrayProd.results[0].suites[1].suites;
                    objectToPrintSB = testResultArraySB.results[0].suites[1].suites;
                    await printResultsTestObject(
                        objectToPrintEu,
                        euUser,
                        'prod',
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                    );
                    await printResultsTestObject(
                        objectToPrintProd,
                        prodUser,
                        'prod',
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                    );
                    await printResultsTestObject(
                        objectToPrintSB,
                        sbUser,
                        'stage',
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                    );
                }
                // debugger;
                //4.6. create the array of passing / failing tests
                if (euResults.didSucceed) {
                    devPassingEnvs.push('Eu');
                } else {
                    devFailedEnvs.push('Eu');
                }
                if (prodResults.didSucceed) {
                    devPassingEnvs.push('Production');
                } else {
                    devFailedEnvs.push('Production');
                }
                if (sbResults.didSucceed) {
                    devPassingEnvs.push('Stage');
                } else {
                    devFailedEnvs.push('Stage');
                }
                // debugger;
                //5. un - available this version if needed
                //!euResults.didSucceed ||
                if (!euResults.didSucceed || !prodResults.didSucceed || !sbResults.didSucceed) {
                    if (!euResults.didSucceed && !failingTestsEnv.includes('eu')) {
                        failingTestsEnv.push('eu');
                    } else if (euResults.didSucceed) {
                        passedTestsEnv.push('eu');
                    }
                    if (!prodResults.didSucceed && !failingTestsEnv.includes('prod')) {
                        failingTestsEnv.push('prod');
                    } else if (prodResults.didSucceed) {
                        passedTestsEnv.push('prod');
                    }
                    if (!sbResults.didSucceed && !failingTestsEnv.includes('sb')) {
                        failingTestsEnv.push('sb');
                    } else if (sbResults.didSucceed) {
                        passedTestsEnv.push('sb');
                    }
                    // debugger;
                    // const addonToInstall = {};
                    // addonToInstall[addonName] = [addonUUID, ''];
                    // debugger;
                } else {
                    passedTests.push(currentTestName);
                    if (euResults.didSucceed && !failingTestsEnv.includes('eu')) {
                        passedTestsEnv.push('eu');
                    }
                    if (prodResults.didSucceed && !failingTestsEnv.includes('prod')) {
                        passedTestsEnv.push('prod');
                    }
                    if (sbResults.didSucceed && !failingTestsEnv.includes('sb')) {
                        passedTestsEnv.push('sb');
                    }
                }
            }
            const devPassingEnvs: string[] = [];
            if (passedTestsEnv.filter((v) => v === 'eu').length === testsList.length) {
                devPassingEnvs.push('EU');
            }
            if (passedTestsEnv.filter((v) => v === 'prod').length === testsList.length) {
                devPassingEnvs.push('PROD');
            }
            if (passedTestsEnv.filter((v) => v === 'sb').length === testsList.length) {
                devPassingEnvs.push('STAGING');
            }
            if (passedTests.length != testsList.length) {
                if (failingTestsEnv.length != 0) {
                    await Promise.all([
                        unavailableAddonVersion(
                            'prod',
                            addonName,
                            addonEntryUUIDEU,
                            latestVersionOfTestedAddonProd,
                            addonUUID,
                            varPassEU,
                        ),
                        unavailableAddonVersion(
                            'prod',
                            addonName,
                            addonEntryUUIDProd,
                            latestVersionOfTestedAddonProd,
                            addonUUID,
                            varPass,
                        ),
                        unavailableAddonVersion(
                            'stage',
                            addonName,
                            addonEntryUUIDSb,
                            latestVersionOfTestedAddonProd,
                            addonUUID,
                            varPassSB,
                        ),
                    ]);
                }
                await reportToTeams(
                    addonName,
                    addonUUID,
                    service,
                    latestVersionOfTestedAddonProd,
                    devPassingEnvs,
                    failingTestsEnv,
                    true,
                );
                console.log('Dev Test Didnt Pass - No Point In Running Approvment');
                return;
            } else if (!doWeHaveSuchAppTest(addonName)) {
                await reportToTeams(
                    addonName,
                    addonUUID,
                    service,
                    latestVersionOfTestedAddonProd,
                    devPassingEnvs,
                    failingTestsEnv,
                    true,
                );
            }
        }
        ///////////////////////APPROVMENT TESTS///////////////////////////////////
        // global ugly variable
        let JenkinsBuildResultsAllEnvs: string[][] = [[]];
        // let addonUUID = '';
        let addonVersionProd = '';
        let addonVersionEU = '';
        let addonVersionSb = '';

        let latestRunProd = '';
        let latestRunEU = '';
        let latestRunSB = '';
        let jobPathEU = '';
        let jobPathPROD = '';
        let jobPathSB = '';
        console.log(`####################### Approvment Tests For ${addonName} #######################`);
        // 1. parse which addon should run and on which version, run the test on Jenkins
        switch (addonName) {
            //add another 'case' here when adding new addons to this mehcanisem
            case 'ADAL': {
                addonUUID = '00000000-0000-0000-0000-00000000ada1';
                const responseProd = await service.fetchStatus(
                    `https://papi.pepperi.com/v1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsProd}`,
                        },
                    },
                );
                addonVersionProd = responseProd.Body[0].Version;
                addonEntryUUIDProd = responseProd.Body[0].UUID;
                const responseEu = await service.fetchStatus(
                    `https://papi-eu.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsEU}`,
                        },
                    },
                );
                addonVersionEU = responseEu.Body[0].Version;
                addonEntryUUIDEu = responseEu.Body[0].UUID;
                const responseSb = await service.fetchStatus(
                    `https://papi.staging.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsSB}`,
                        },
                    },
                );
                addonVersionSb = responseSb.Body[0].Version;
                addonEntryUUIDSb = responseSb.Body[0].UUID;
                if (
                    addonVersionSb !== addonVersionEU ||
                    addonVersionProd !== addonVersionEU ||
                    addonVersionProd !== addonVersionSb
                ) {
                    throw new Error(
                        `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`,
                    );
                }
                console.log(`Asked To Run: '${addonName}' (${addonUUID}), On Version: ${addonVersionProd}`);
                const kmsSecret = await generalService.getSecretfromKMS(email, pass, 'JenkinsBuildUserCred');
                jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20Production%20-%20ADAL';
                jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20EU%20-%20ADAL';
                jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20Stage%20-%20ADAL';
                JenkinsBuildResultsAllEnvs = await Promise.all([
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathPROD}/build?token=ADALApprovmentTests`,
                        'Test - E1 Production - PNS',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathEU}/build?token=ADALApprovmentTests`,
                        'Test - E1 EU - PNS',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathSB}/build?token=ADALApprovmentTests`,
                        'Test - E1 Stage - PNS',
                    ),
                ]);
                latestRunProd = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathPROD);
                latestRunEU = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathEU);
                latestRunSB = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathSB);
                break;
            }
            case 'PNS': {
                addonUUID = '00000000-0000-0000-0000-000000040fa9';
                const responseProd = await service.fetchStatus(
                    `https://papi.pepperi.com/v1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsProd}`,
                        },
                    },
                );
                addonVersionProd = responseProd.Body[0].Version;
                addonEntryUUIDProd = responseProd.Body[0].UUID;
                const responseEu = await service.fetchStatus(
                    `https://papi-eu.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsEU}`,
                        },
                    },
                );
                addonVersionEU = responseEu.Body[0].Version;
                addonEntryUUIDEu = responseEu.Body[0].UUID;
                const responseSb = await service.fetchStatus(
                    `https://papi.staging.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsSB}`,
                        },
                    },
                );
                addonVersionSb = responseSb.Body[0].Version;
                addonEntryUUIDSb = responseSb.Body[0].UUID;
                if (
                    addonVersionSb !== addonVersionEU ||
                    addonVersionProd !== addonVersionEU ||
                    addonVersionProd !== addonVersionSb
                ) {
                    throw new Error(
                        `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`,
                    );
                }
                console.log(`Asked To Run: '${addonName}' (${addonUUID}), On Version: ${addonVersionProd}`);
                const kmsSecret = await generalService.getSecretfromKMS(email, pass, 'JenkinsBuildUserCred');
                jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20E1%20Production%20-%20PNS';
                jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20E1%20EU%20-%20PNS';
                jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20E1%20Stage%20-%20PNS';
                JenkinsBuildResultsAllEnvs = await Promise.all([
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathPROD}/build?token=PNSApprovmentTests`,
                        'Test - E1 Production - PNS',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathEU}/build?token=PNSApprovmentTests`,
                        'Test - E1 EU - PNS',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathSB}/build?token=PNSApprovmentTests`,
                        'Test - E1 Stage - PNS',
                    ),
                ]);
                latestRunProd = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathPROD);
                latestRunEU = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathEU);
                latestRunSB = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathSB);
                break;
            }
            case 'USER-DEFINED-COLLECTIONS':
            case 'UDC': {
                addonUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
                const responseProd = await service.fetchStatus(
                    `https://papi.pepperi.com/v1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsProd}`,
                        },
                    },
                );
                addonVersionProd = responseProd.Body[0].Version;
                addonEntryUUIDProd = responseProd.Body[0].UUID;
                const responseEu = await service.fetchStatus(
                    `https://papi-eu.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsEU}`,
                        },
                    },
                );
                addonVersionEU = responseEu.Body[0].Version;
                addonEntryUUIDEu = responseEu.Body[0].UUID;
                const responseSb = await service.fetchStatus(
                    `https://papi.staging.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsSB}`,
                        },
                    },
                );
                addonVersionSb = responseSb.Body[0].Version;
                addonEntryUUIDSb = responseSb.Body[0].UUID;
                if (
                    addonVersionSb !== addonVersionEU ||
                    addonVersionProd !== addonVersionEU ||
                    addonVersionProd !== addonVersionSb
                ) {
                    throw new Error(
                        `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`,
                    );
                }
                console.log(`Asked To Run: '${addonName}' (${addonUUID}), On Version: ${addonVersionProd}`);
                const kmsSecret = await generalService.getSecretfromKMS(email, pass, 'JenkinsBuildUserCred');
                jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20G1%20Production%20-%20UDC';
                jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20G1%20EU%20-%20UDC';
                jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20G1%20Stage%20-%20UDC';
                JenkinsBuildResultsAllEnvs = await Promise.all([
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathPROD}/build?token=UDCApprovmentTests`,
                        'Test - G1 Production - UDC',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathEU}/build?token=UDCApprovmentTests`,
                        'Test - G1 EU - UDC',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathSB}/build?token=UDCApprovmentTests`,
                        'Test - G1 Stage - UDC',
                    ),
                ]);
                latestRunProd = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathPROD);
                latestRunEU = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathEU);
                latestRunSB = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathSB);
                break;
            }
            case 'DIMX': {
                addonUUID = '44c97115-6d14-4626-91dc-83f176e9a0fc';
                const responseProd = await service.fetchStatus(
                    `https://papi.pepperi.com/v1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsProd}`,
                        },
                    },
                );
                addonVersionProd = responseProd.Body[0].Version;
                addonEntryUUIDProd = responseProd.Body[0].UUID;
                const responseEu = await service.fetchStatus(
                    `https://papi-eu.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsEU}`,
                        },
                    },
                );
                addonVersionEU = responseEu.Body[0].Version;
                addonEntryUUIDEu = responseEu.Body[0].UUID;
                const responseSb = await service.fetchStatus(
                    `https://papi.staging.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsSB}`,
                        },
                    },
                );
                addonVersionSb = responseSb.Body[0].Version;
                addonEntryUUIDSb = responseSb.Body[0].UUID;
                if (
                    addonVersionSb !== addonVersionEU ||
                    addonVersionProd !== addonVersionEU ||
                    addonVersionProd !== addonVersionSb
                ) {
                    throw new Error(
                        `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`,
                    );
                }
                console.log(`Asked To Run: '${addonName}' (${addonUUID}), On Version: ${addonVersionProd}`);
                const kmsSecret = await generalService.getSecretfromKMS(email, pass, 'JenkinsBuildUserCred');
                jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20B1%20Production%20-%20DIMX';
                jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20B1%20EU%20-%20DIMX';
                jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20B1%20Stage%20-%20DIMX';
                JenkinsBuildResultsAllEnvs = await Promise.all([
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathPROD}/build?token=DIMXApprovmentTests`,
                        'Test - B1 Production - DIMX',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathEU}/build?token=DIMXApprovmentTests`,
                        'Test - A1 EU - DIMX',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathSB}/build?token=DIMXApprovmentTests`,
                        'Test - B1 Stage - DIMX',
                    ),
                ]);
                latestRunProd = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathPROD);
                latestRunEU = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathEU);
                latestRunSB = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathSB);
                let didFailFirstTest = false;
                for (let index = 0; index < JenkinsBuildResultsAllEnvs.length; index++) {
                    const resultAndEnv = JenkinsBuildResultsAllEnvs[index];
                    if (resultAndEnv[0] === 'FAILURE') {
                        didFailFirstTest = true;
                        break;
                    }
                }
                if (!didFailFirstTest) {
                    //if we already failed - dont run second part just keep running to the end
                    jobPathPROD =
                        'API%API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20B2%20Production%20-%20DIMX%20Part%202%20-%20CLI';
                    jobPathEU =
                        'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20B2%20EU%20-%20DIMX%20Part%202%20-%20CLI';
                    jobPathSB =
                        'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20B2%20Staging%20-%20DIMX%20Part%202%20-%20CLI';
                    JenkinsBuildResultsAllEnvs = await Promise.all([
                        //if well fail here - well get to the regular reporting etc
                        service.runJenkinsJobRemotely(
                            kmsSecret,
                            `${jobPathPROD}/build?token=DIMXApprovmentTests`,
                            'Test - B2 Production - DIMX Part 2 - CLI',
                        ),
                        service.runJenkinsJobRemotely(
                            kmsSecret,
                            `${jobPathEU}/build?token=DIMXApprovmentTests`,
                            'Test - B2 EU - DIMX Part 2 - CLI',
                        ),
                        service.runJenkinsJobRemotely(
                            kmsSecret,
                            `${jobPathSB}/build?token=DIMXApprovmentTests`,
                            'Test - B2 Staging - DIMX Part 2 - CLI',
                        ),
                    ]);
                    latestRunProd = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathPROD);
                    latestRunEU = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathEU);
                    latestRunSB = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathSB);
                }
                break;
            }
            case 'DATA INDEX':
            case 'DATA-INDEX': {
                addonUUID = '00000000-0000-0000-0000-00000e1a571c';
                const responseProd = await service.fetchStatus(
                    `https://papi.pepperi.com/v1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsProd}`,
                        },
                    },
                );
                addonVersionProd = responseProd.Body[0].Version;
                addonEntryUUIDProd = responseProd.Body[0].UUID;
                const responseEu = await service.fetchStatus(
                    `https://papi-eu.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsEU}`,
                        },
                    },
                );
                addonVersionEU = responseEu.Body[0].Version;
                addonEntryUUIDEu = responseEu.Body[0].UUID;
                const responseSb = await service.fetchStatus(
                    `https://papi.staging.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsSB}`,
                        },
                    },
                );
                addonVersionSb = responseSb.Body[0].Version;
                addonEntryUUIDSb = responseSb.Body[0].UUID;
                if (
                    addonVersionSb !== addonVersionEU ||
                    addonVersionProd !== addonVersionEU ||
                    addonVersionProd !== addonVersionSb
                ) {
                    throw new Error(
                        `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`,
                    );
                }
                console.log(`Asked To Run: '${addonName}' (${addonUUID}), On Version: ${addonVersionProd}`);
                const kmsSecret = await generalService.getSecretfromKMS(email, pass, 'JenkinsBuildUserCred');
                jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20C1%20Production%20-%20DATA%20INDEX%20FRAMEWORK';
                jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20C1%20EU%20-%20DATA%20INDEX%20FRAMEWORK';
                jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20C1%20Stage%20-%20DATA%20INDEX%20FRAMEWORK';
                JenkinsBuildResultsAllEnvs = await Promise.all([
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathPROD}/build?token=DATAINDEXApprovmentTests`,
                        'Test - C1 Production - DATA INDEX FRAMEWORK',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathEU}/build?token=DATAINDEXApprovmentTests`,
                        'Test - C1 EU - DATA INDEX FRAMEWORK',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathSB}/build?token=DATAINDEXApprovmentTests`,
                        'Test - C1 Stage - DATA INDEX FRAMEWORK',
                    ),
                ]);
                latestRunProd = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathPROD);
                latestRunEU = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathEU);
                latestRunSB = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathSB);
                break;
            }
            case 'PEPPERI-FILE-STORAGE':
            case 'PFS': {
                addonUUID = '00000000-0000-0000-0000-0000000f11e5';
                const responseProd = await service.fetchStatus(
                    `https://papi.pepperi.com/v1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsProd}`,
                        },
                    },
                );
                addonVersionProd = responseProd.Body[0].Version;
                addonEntryUUIDProd = responseProd.Body[0].UUID;
                const responseEu = await service.fetchStatus(
                    `https://papi-eu.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsEU}`,
                        },
                    },
                );
                addonVersionEU = responseEu.Body[0].Version;
                addonEntryUUIDEu = responseEu.Body[0].UUID;
                const responseSb = await service.fetchStatus(
                    `https://papi.staging.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsSB}`,
                        },
                    },
                );
                addonVersionSb = responseSb.Body[0].Version;
                addonEntryUUIDSb = responseSb.Body[0].UUID;
                if (
                    addonVersionSb !== addonVersionEU ||
                    addonVersionProd !== addonVersionEU ||
                    addonVersionProd !== addonVersionSb
                ) {
                    throw new Error(
                        `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`,
                    );
                }
                console.log(`Asked To Run: '${addonName}' (${addonUUID}), On Version: ${addonVersionProd}`);
                const kmsSecret = await generalService.getSecretfromKMS(email, pass, 'JenkinsBuildUserCred');
                jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20D1%20Production%20-%20PFS';
                jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20D1%20EU%20-%20PFS';
                jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20D1%20Stage%20-%20PFS';
                JenkinsBuildResultsAllEnvs = await Promise.all([
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathPROD}/build?token=PFSApprovmentTests`,
                        'Test - D1 Production - PFS',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathEU}/build?token=PFSApprovmentTests`,
                        'Test - D1 EU - PFS',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathSB}/build?token=PFSApprovmentTests`,
                        'Test - D1 Stage - PFS',
                    ),
                ]);
                latestRunProd = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathPROD);
                latestRunEU = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathEU);
                latestRunSB = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathSB);
                break;
            }
            case 'CORE':
            case 'CORE-GENERIC-RESOURCES': {
                addonUUID =
                    addonName === 'CORE'
                        ? '00000000-0000-0000-0000-00000000c07e'
                        : 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f';
                const responseProd = await service.fetchStatus(
                    `https://papi.pepperi.com/v1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsProd}`,
                        },
                    },
                );
                addonVersionProd = responseProd.Body[0].Version;
                addonEntryUUIDProd = responseProd.Body[0].UUID;
                const responseEu = await service.fetchStatus(
                    `https://papi-eu.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsEU}`,
                        },
                    },
                );
                addonVersionEU = responseEu.Body[0].Version;
                addonEntryUUIDEu = responseEu.Body[0].UUID;
                const responseSb = await service.fetchStatus(
                    `https://papi.staging.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${base64VARCredentialsSB}`,
                        },
                    },
                );
                addonVersionSb = responseSb.Body[0].Version;
                addonEntryUUIDSb = responseSb.Body[0].UUID;
                if (
                    addonVersionSb !== addonVersionEU ||
                    addonVersionProd !== addonVersionEU ||
                    addonVersionProd !== addonVersionSb
                ) {
                    throw new Error(
                        `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`,
                    );
                }
                console.log(`Asked To Run: '${addonName}' (${addonUUID}), On Version: ${addonVersionProd}`);
                const kmsSecret = await generalService.getSecretfromKMS(email, pass, 'JenkinsBuildUserCred');
                jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20F1%20EU%20-%20Core';
                jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20D1%20EU%20-%20PFS';
                jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20D1%20Stage%20-%20PFS';
                JenkinsBuildResultsAllEnvs = await Promise.all([
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathPROD}/build?token=COREApprovmentTests`,
                        'Test - F1 Production - Core',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathEU}/build?token=COREApprovmentTests`,
                        'Test - F1 EU - Core',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        `${jobPathSB}/build?token=COREApprovmentTests`,
                        'Test - F1 Stage - Core',
                    ),
                ]);
                latestRunProd = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathPROD);
                latestRunEU = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathEU);
                latestRunSB = await generalService.getLatestJenkinsJobExecutionId(kmsSecret, jobPathSB);
                break;
            }
            default:
                console.log(`no approvement tests for addon: ${addonName}`);
                return;
        }
        // 2. parse which envs failed
        const passingEnvs: string[] = [];
        const failingEnvs: string[] = [];
        // debugger;
        let isOneOfTestFailed = false;
        for (let index = 0; index < JenkinsBuildResultsAllEnvs.length; index++) {
            const resultAndEnv = JenkinsBuildResultsAllEnvs[index];
            if (resultAndEnv[0] === 'FAILURE') {
                isOneOfTestFailed = true;
                failingEnvs.push(resultAndEnv[1]);
            }
            if (isOneOfTestFailed) {
                await unavailableVersionAfterAppTestFail(
                    addonEntryUUIDEu,
                    addonEntryUUIDProd,
                    addonEntryUUIDSb,
                    addonVersionEU,
                    addonVersionProd,
                    addonVersionSb,
                    addonUUID,
                    service,
                    base64VARCredentialsEU,
                    base64VARCredentialsProd,
                    base64VARCredentialsSB,
                    addonName,
                );
            }
        }
        // debugger;
        if (!failingEnvs.includes('EU')) {
            passingEnvs.push('EU');
        }
        if (!failingEnvs.includes('Stage') && !failingEnvs.includes('Staging')) {
            passingEnvs.push('Stage');
        }
        if (!failingEnvs.includes('Production')) {
            passingEnvs.push('Production');
        }

        //3. send to Teams
        await reportToTeams(
            addonName,
            addonUUID,
            service,
            addonVersionProd,
            passingEnvs,
            failingEnvs,
            false,
            jobPathPROD,
            latestRunProd,
            jobPathEU,
            latestRunEU,
            jobPathSB,
            latestRunSB,
        );

        //4. run again on prev version to make tests green again
        if (failingEnvs.includes('Production') || failingEnvs.includes('EU') || failingEnvs.includes('Stage')) {
            const response = await getLatestAvailableVersionAndValidateAllEnvsAreSimilar(
                addonUUID,
                service,
                base64VARCredentialsProd,
                base64VARCredentialsEU,
                base64VARCredentialsSB,
            );
            console.log(
                `Runnig: '${addonName}' (${addonUUID}), AGAIN AS IT FAILED ON VERSION: ${addonVersionProd} , THIS TIME On Version: ${response[0]}`,
            );
            const kmsSecret = await generalService.getSecretfromKMS(email, pass, 'JenkinsBuildUserCred');
            const addonJenkToken = convertAddonNameToToken(addonName);
            JenkinsBuildResultsAllEnvs = await Promise.all([
                service.runJenkinsJobRemotely(
                    kmsSecret,
                    `${jobPathPROD}/build?token=${addonJenkToken}ApprovmentTests`,
                    `Re-Run Of ${addonName}`,
                ),
                service.runJenkinsJobRemotely(
                    kmsSecret,
                    `${jobPathEU}/build?token=${addonJenkToken}ApprovmentTests`,
                    `Re-Run Of ${addonName}`,
                ),
                service.runJenkinsJobRemotely(
                    kmsSecret,
                    `${jobPathSB}/build?token=${addonJenkToken}ApprovmentTests`,
                    `Re-Run Of ${addonName}`,
                ),
            ]);
        }
    }
    run();
})();

function handleTeamsURL(addonName) {
    switch (addonName) {
        case 'ADAL':
            return 'https://wrnty.webhook.office.com/webhookb2/1e9787b3-a1e5-4c2c-99c0-96bd61c0ff5e@2f2b54b7-0141-4ba7-8fcd-ab7d17a60547/IncomingWebhook/b5117c82e129495fabbe8291e0cb615e/83111104-c68a-4d02-bd4e-0b6ce9f14aa0';
        case 'NEBULA':
            return 'https://wrnty.webhook.office.com/webhookb2/1e9787b3-a1e5-4c2c-99c0-96bd61c0ff5e@2f2b54b7-0141-4ba7-8fcd-ab7d17a60547/IncomingWebhook/e20f96ddfa3d48768922c8489eb5e604/83111104-c68a-4d02-bd4e-0b6ce9f14aa0';
        case 'DIMX':
            return 'https://wrnty.webhook.office.com/webhookb2/1e9787b3-a1e5-4c2c-99c0-96bd61c0ff5e@2f2b54b7-0141-4ba7-8fcd-ab7d17a60547/IncomingWebhook/a5c62481e39743cb9d6651fa88284deb/83111104-c68a-4d02-bd4e-0b6ce9f14aa0';
        case 'DATA INDEX':
        case 'DATA-INDEX':
            return 'https://wrnty.webhook.office.com/webhookb2/1e9787b3-a1e5-4c2c-99c0-96bd61c0ff5e@2f2b54b7-0141-4ba7-8fcd-ab7d17a60547/IncomingWebhook/8a8345b9eace4c74a7a7fdf19df1200f/83111104-c68a-4d02-bd4e-0b6ce9f14aa0';
        case 'PFS':
        case 'PEPPERI-FILE-STORAGE':
            return 'https://wrnty.webhook.office.com/webhookb2/1e9787b3-a1e5-4c2c-99c0-96bd61c0ff5e@2f2b54b7-0141-4ba7-8fcd-ab7d17a60547/IncomingWebhook/29c9fb687840407fa70dce5576356af8/83111104-c68a-4d02-bd4e-0b6ce9f14aa0';
        case 'PNS':
            return 'https://wrnty.webhook.office.com/webhookb2/1e9787b3-a1e5-4c2c-99c0-96bd61c0ff5e@2f2b54b7-0141-4ba7-8fcd-ab7d17a60547/IncomingWebhook/5a784ad87c4b4f4a9ffab80e4ed61113/83111104-c68a-4d02-bd4e-0b6ce9f14aa0';
        case 'USER-DEFINED-COLLECTIONS':
        case 'UDC':
            return 'https://wrnty.webhook.office.com/webhookb2/1e9787b3-a1e5-4c2c-99c0-96bd61c0ff5e@2f2b54b7-0141-4ba7-8fcd-ab7d17a60547/IncomingWebhook/a40ddc371df64933aa4bc369a060b1d6/83111104-c68a-4d02-bd4e-0b6ce9f14aa0';
    }
}

export async function newUserDependenciesTests(generalService: GeneralService, varPass: string) {
    const baseAddonVersionsInstallationResponseObj = await generalService.baseAddonVersionsInstallation(
        varPass,
        testDataForInitUser,
    );
    const chnageVersionResponseArr = baseAddonVersionsInstallationResponseObj.chnageVersionResponseArr;
    const isInstalledArr = baseAddonVersionsInstallationResponseObj.isInstalledArr;

    //Services Framework, Cross Platforms API, WebApp Platform, Addons Manager, Data Views API, Settings Framework, ADAL
    describe('Upgrade Dependencies Addons', function () {
        this.retries(1);

        isInstalledArr.forEach((isInstalled, index) => {
            it(`Validate That Needed Addon Is Installed: ${Object.keys(testDataForInitUser)[index]}`, () => {
                expect(isInstalled).to.be.true;
            });
        });

        for (const addonName in testDataForInitUser) {
            const addonUUID = testDataForInitUser[addonName][0];
            const version = testDataForInitUser[addonName][1];
            const varLatestVersion = chnageVersionResponseArr[addonName][2];
            const changeType = chnageVersionResponseArr[addonName][3];
            describe(`${addonName}`, function () {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, function () {
                    if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                        expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                    } else {
                        expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                    }
                });

                it(`Latest Version Is Installed ${varLatestVersion}`, async function () {
                    await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                        .eventually.to.have.property('Version')
                        .a('string')
                        .that.is.equal(varLatestVersion);
                });
            });
        }
    });
}

export async function replaceItemsTests(generalService: GeneralService) {
    const objectsService = new ObjectsService(generalService);
    const getAllItems = await objectsService.getItems();
    if (getAllItems.length > 5) {
        describe("Don't Replace Items", function () {
            it("The Test Of Repleace Items Is Limited For Safty Reasons - Won't Run When More Then 5 Items Exist", async function () {
                expect(true).to.be.true;
            });
        });
    } else {
        describe('Replace Items', function () {
            this.retries(1);

            it('Remove Existing Items', async function () {
                //Remove old items
                const itemsArr = await generalService.papiClient.items.find({ page_size: -1 });
                for (let i = 0; i < itemsArr.length; i++) {
                    const deleted = await generalService.papiClient.items.delete(itemsArr[i].InternalID as number);
                    expect(deleted).to.be.true;
                }
            });

            it('Add New Items', async function () {
                //Add new items from local file
                const filesFromFile = fs.readFileSync('../server-side/api-tests/test-data/items.json', {
                    encoding: 'utf8',
                    flag: 'r',
                });
                const objects = JSON.parse(filesFromFile);
                const filteredArray = objects.filter((item) => item.hasOwnProperty('Image'));
                for (let j = 0; j < filteredArray.length; j++) {
                    for (const key in filteredArray[j]) {
                        if (
                            filteredArray[j][key] === null ||
                            JSON.stringify(filteredArray[j][key]) === '{}' ||
                            objects[j][key] === ''
                        ) {
                            delete filteredArray[j][key];
                            continue;
                        }
                        if (
                            key === 'Hidden' ||
                            key === 'InternalID' ||
                            key === 'UUID' ||
                            key === 'Inventory' ||
                            key === 'CreationDateTime' ||
                            key === 'ModificationDateTime'
                        ) {
                            delete filteredArray[j][key];
                            continue;
                        }
                        if (key === 'Parent') {
                            delete filteredArray[j][key].URI;
                            delete filteredArray[j][key].Data.InternalID;
                            delete filteredArray[j][key].Data.UUID;
                        }
                    }
                    //In cases when post item randomally fails, retry 4 times before failing the test
                    let postItemsResponse;
                    let maxLoopsCounter = 5;
                    let isItemPosted = false;
                    do {
                        try {
                            postItemsResponse = await objectsService.postItem(filteredArray[j]);
                            isItemPosted = true;
                        } catch (error) {
                            console.log(`POST item faild for item: ${JSON.stringify(filteredArray[j])}`);
                            console.log(
                                `Wait ${6 * (6 - maxLoopsCounter)} seconds, and retry ${
                                    maxLoopsCounter - 1
                                } more times`,
                            );
                            generalService.sleep(6000 * (6 - maxLoopsCounter));
                        }
                        maxLoopsCounter--;
                    } while (!isItemPosted && maxLoopsCounter > 0);
                    expect(postItemsResponse.Hidden).to.be.false;
                    expect(postItemsResponse.InternalID).to.be.above(0);
                }

                // Create json object from the sorted objects
                // fs.writeFileSync('sorted_items.json', JSON.stringify(filteredArray), 'utf8');
            });
        });
    }
}

/**
 * this function is used as a TEST for replacing UI controls using the API - should be used in creating a dist kind of situations
 * @param that 'this' of the TEST class which the function called from
 * @param generalService general service instance to use inside the function
 */
export async function replaceUIControlsTests(that: any, generalService: GeneralService) {
    describe('Replace UIControls', async function () {
        this.retries(1);

        //Add new UIControls from local file
        const uIControlArrFromFile = fs.readFileSync('../server-side/api-tests/test-data/UIControls.json', {
            encoding: 'utf8',
            flag: 'r',
        });
        const uIControlArr = JSON.parse(uIControlArrFromFile);

        for (let j = 0; j < uIControlArr.length; j++) {
            if (uIControlArr[j]['Type'] == 'CatalogSelectionCard') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setCatalogSelectionCardUIBinded = setCatalogSelectionCardUI.bind(that);
                    await setCatalogSelectionCardUIBinded(generalService, uIControlArr[j]);
                });
            } else if (uIControlArr[j]['Type'] == 'CatalogForm') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setCatalogFormUIBinded = setCatalogFormUI.bind(that);
                    await setCatalogFormUIBinded(generalService, uIControlArr[j]);
                });
            } else if (uIControlArr[j]['Type'] == '[OA#0]OrderViewsMenu') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setOrderViewsMenuBinded = setOrderViewsMenu.bind(that);
                    await setOrderViewsMenuBinded(generalService, uIControlArr[j]);
                });
            } else if (uIControlArr[j]['Type'] == '[OA#0]OrderCartGrid') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setOrderCartGridBinded = setOrderCartGrid.bind(that);
                    await setOrderCartGridBinded(generalService, uIControlArr[j]);
                });
                // } else if (uIControlArr[j]['Type'] == '[OA#0]OrderBanner') {
                //     it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                //         const setOrderBannerBinded = setOrderBanner.bind(that);
                //         await setOrderBannerBinded(generalService, uIControlArr[j]);
                //     });
            } else if (uIControlArr[j]['Type'] == '[OA#0]OrderCartOpenedFooter') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setOrderCartOpenedFooterBinded = setOrderCartOpenedFooter.bind(that);
                    await setOrderCartOpenedFooterBinded(generalService, uIControlArr[j]);
                });
            } else if (uIControlArr[j]['Type'] == '[OA#0]OrderCenterClosedFooter') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setOrderCenterClosedFooterBinded = setOrderCenterClosedFooter.bind(that);
                    await setOrderCenterClosedFooterBinded(generalService, uIControlArr[j]);
                });
            }
        }
    });
}

/**
 * this function is used as a routine inside a flow to validate all UI controls are configured correctly before starting the test
 * @param that 'this' of the TEST class which the function called from
 * @param generalService general service instance to use inside the function
 */
export async function replaceUIControls(that: any, generalService: GeneralService) {
    //Add new UIControls from local file
    const uIControlArrFromFile = fs.readFileSync('../server-side/api-tests/test-data/UIControls.json', {
        encoding: 'utf8',
        flag: 'r',
    });
    const uIControlArr = JSON.parse(uIControlArrFromFile);
    for (let j = 0; j < uIControlArr.length; j++) {
        if (uIControlArr[j]['Type'] == 'CatalogSelectionCard') {
            const setCatalogSelectionCardUIBinded = setCatalogSelectionCardUI.bind(that);
            await setCatalogSelectionCardUIBinded(generalService, uIControlArr[j]);
        } else if (uIControlArr[j]['Type'] == 'CatalogForm') {
            const setCatalogFormUIBinded = setCatalogFormUI.bind(that);
            await setCatalogFormUIBinded(generalService, uIControlArr[j]);
        } else if (uIControlArr[j]['Type'] == '[OA#0]OrderViewsMenu') {
            const setOrderViewsMenuBinded = setOrderViewsMenu.bind(that);
            await setOrderViewsMenuBinded(generalService, uIControlArr[j]);
        } else if (uIControlArr[j]['Type'] == '[OA#0]OrderCartGrid') {
            const setOrderCartGridBinded = setOrderCartGrid.bind(that);
            await setOrderCartGridBinded(generalService, uIControlArr[j]);
        } else if (uIControlArr[j]['Type'] == '[OA#0]OrderBanner') {
            const setOrderBannerBinded = setOrderBanner.bind(that);
            await setOrderBannerBinded(generalService, uIControlArr[j]);
        } else if (uIControlArr[j]['Type'] == '[OA#0]OrderCartOpenedFooter') {
            const setOrderCartOpenedFooterBinded = setOrderCartOpenedFooter.bind(that);
            await setOrderCartOpenedFooterBinded(generalService, uIControlArr[j]);
        } else if (uIControlArr[j]['Type'] == '[OA#0]OrderCenterClosedFooter') {
            const setOrderCenterClosedFooterBinded = setOrderCenterClosedFooter.bind(that);
            await setOrderCenterClosedFooterBinded(generalService, uIControlArr[j]);
        }
    }
}

//#region Replacing UI Functions
async function setCatalogSelectionCardUI(generalService: GeneralService, catalogSelectionUIControl: UIControl) {
    const catalogSelectionCard: UIControl[] = await generalService.papiClient.uiControls.find({
        where: `Type='CatalogSelectionCard'`,
    });
    expect(catalogSelectionCard).to.have.length.that.is.above(0);
    for (let i = 0; i < catalogSelectionCard.length; i++) {
        // addContext(this, {
        //     title: 'Test Data',
        //     value: `Add UIControls ${catalogSelectionCard[i]['Type']}, ${catalogSelectionCard[i]['InternalID']}`,
        // });
        const uiControlFromAPI = catalogSelectionCard[i].UIControlData.split('CatalogSelectionCard');
        const uiControlFromFile = catalogSelectionUIControl.UIControlData.split('CatalogSelectionCard');
        catalogSelectionCard[i].UIControlData = `${uiControlFromAPI[0]}CatalogSelectionCard${uiControlFromFile[1]}`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(catalogSelectionCard[i]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('CatalogSelectionCard');
    }
}

async function setCatalogFormUI(generalService: GeneralService, catalogSelectionUIControl: UIControl) {
    const catalogForm: UIControl[] = await generalService.papiClient.uiControls.find({
        where: `Type='CatalogForm'`,
    });
    expect(catalogForm).to.have.length.that.is.above(0);
    for (let i = 0; i < catalogForm.length; i++) {
        // addContext(this, {
        //     title: 'Test Data',
        //     value: `Add UIControls ${catalogForm[i]['Type']}, ${catalogForm[i]['InternalID']}`,
        // });
        const uiControlFromAPI = catalogForm[i].UIControlData.split('CatalogForm');
        const uiControlFromFile = catalogSelectionUIControl.UIControlData.split('CatalogForm');
        catalogForm[i].UIControlData = `${uiControlFromAPI[0]}CatalogForm${uiControlFromFile[1]}`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(catalogForm[i]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('CatalogForm');
    }
}

async function setOrderViewsMenu(generalService: GeneralService, orderViewsMenuUIControl: UIControl) {
    const orderViewsMenu = await generalService.papiClient.uiControls.find({
        where: "Type LIKE '%OrderViewsMenu'",
    });
    expect(orderViewsMenu).to.have.length.that.is.above(0);
    for (let i = 0; i < orderViewsMenu.length; i++) {
        // addContext(this, {
        //     title: 'Test Data',
        //     value: `Add UIControls ${orderViewsMenu[i]['Type']}, ${orderViewsMenu[i]['InternalID']}`,
        // });
        const uiControlFromAPI = orderViewsMenu[i].UIControlData.split('OrderViewsMenu');
        const uiControlFromFile = orderViewsMenuUIControl.UIControlData.split('OrderViewsMenu');
        orderViewsMenu[i].UIControlData = `${uiControlFromAPI[0]}OrderViewsMenu${uiControlFromFile[1]}`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(orderViewsMenu[i]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('OrderViewsMenu');
    }
}

async function setOrderCartGrid(generalService: GeneralService, orderCartGridUIControl: UIControl) {
    const orderCartGrid = await generalService.papiClient.uiControls.find({
        where: "Type LIKE '%OrderCartGrid'",
    });
    expect(orderCartGrid).to.have.length.that.is.above(0);
    for (let i = 0; i < orderCartGrid.length; i++) {
        // addContext(this, {
        //     title: 'Test Data',
        //     value: `Add UIControls ${orderCartGrid[i]['Type']}, ${orderCartGrid[i]['InternalID']}`,
        // });
        const uiControlFromAPI = orderCartGrid[i].UIControlData.split('OrderCartGrid');
        const uiControlFromFile = orderCartGridUIControl.UIControlData.split('OrderCartGrid');
        orderCartGrid[i].UIControlData = `${uiControlFromAPI[0]}OrderCartGrid${uiControlFromFile[1]}`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(orderCartGrid[i]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('OrderCartGrid');
    }
}

async function setOrderBanner(generalService: GeneralService, OrderBannerUIControl: UIControl) {
    const orderBanner = await generalService.papiClient.uiControls.find({
        where: "Type LIKE '%OrderBanner'",
    });
    expect(orderBanner).to.have.length.that.is.above(0);
    for (let i = 0; i < orderBanner.length; i++) {
        // addContext(this, {
        //     title: 'Test Data',
        //     value: `Add UIControls ${orderBanner[i]['Type']}, ${orderBanner[i]['InternalID']}`,
        // });
        const uiControlFromAPI = orderBanner[i].UIControlData.split('OrderBanner');
        const uiControlFromFile = OrderBannerUIControl.UIControlData.split('OrderBanner');
        orderBanner[i].UIControlData = `${uiControlFromAPI[0]}OrderBanner${uiControlFromFile[1]}`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(orderBanner[i]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('OrderBanner');
    }
}

async function setOrderCartOpenedFooter(generalService: GeneralService, OrderCartOpenedFooterUIControl: UIControl) {
    const orderCartOpenedFooter = await generalService.papiClient.uiControls.find({
        where: "Type LIKE '%OrderCartOpenedFooter'",
    });
    expect(orderCartOpenedFooter).to.have.length.that.is.above(0);
    for (let i = 0; i < orderCartOpenedFooter.length; i++) {
        // addContext(this, {
        //     title: 'Test Data',
        //     value: `Add UIControls ${orderCartOpenedFooter[i]['Type']}, ${orderCartOpenedFooter[i]['InternalID']}`,
        // });
        const uiControlFromAPI = orderCartOpenedFooter[i].UIControlData.split('OrderCartOpenedFooter');
        const uiControlFromFile = OrderCartOpenedFooterUIControl.UIControlData.split('OrderCartOpenedFooter');
        orderCartOpenedFooter[i].UIControlData = `${uiControlFromAPI[0]}OrderCartOpenedFooter${uiControlFromFile[1]}`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(orderCartOpenedFooter[i]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('OrderCartOpenedFooter');
    }
}

async function setOrderCenterClosedFooter(generalService: GeneralService, OrderCenterClosedFooterUIControl: UIControl) {
    const orderCenterClosedFooter: any = await generalService.papiClient.uiControls.find({
        where: "Type LIKE '%OrderCenterClosedFooter'",
    });
    expect(orderCenterClosedFooter).to.have.length.that.is.above(0);
    const atdArray: any = await generalService.papiClient.metaData.type('transactions' as ResourceTypes).types.get();
    let orderOrigenUpdateCounter = 0;
    for (let i = 0; i < atdArray.length; i++) {
        const uiControlFromAPI = orderCenterClosedFooter[0].UIControlData.split('OrderCenterClosedFooter');
        uiControlFromAPI[0] = `${uiControlFromAPI[0].split('OA#')[0]}OA#${atdArray[i]['InternalID']}]`;
        const uiControlFromFile = OrderCenterClosedFooterUIControl.UIControlData.split('OrderCenterClosedFooter');
        // addContext(this, {
        //     title: 'Test Data',
        //     value: `Add UIControls ${uiControlFromAPI[0]}OrderCenterClosedFooter${uiControlFromFile[1]}, ${atdArray[i]['InternalID']}`,
        // });
        if (JSON.stringify(orderCenterClosedFooter).includes(atdArray[i].InternalID)) {
            orderCenterClosedFooter[0]['InternalID'] = orderCenterClosedFooter[orderOrigenUpdateCounter].InternalID;
            orderOrigenUpdateCounter++;
        } else {
            delete orderCenterClosedFooter[0].InternalID;
        }
        orderCenterClosedFooter[0].UIControlData = `${uiControlFromAPI[0]}OrderCenterClosedFooter${uiControlFromFile[1]}`;
        orderCenterClosedFooter[0].Type = `[OA#${atdArray[i]['InternalID']}]OrderCenterClosedFooter`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(orderCenterClosedFooter[0]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('OrderCenterClosedFooter');
    }
}

async function unavailableAddonVersion(env, addonName, addonEntryUUID, addonVersion, addonUUID, varCredentials) {
    const [varUserName, varPassword] = varCredentials.split(':');
    const client = await initiateTester(varUserName, varPassword, env);
    const service = new GeneralService(client);
    const bodyToSendVARProd = {
        UUID: addonEntryUUID,
        Version: addonVersion,
        Available: false,
        AddonUUID: addonUUID,
    };
    const varCredBase64 = Buffer.from(varCredentials).toString('base64');
    // const baseURL = env === 'prod' ? 'papi' : userName.includes('eu') ? 'papi-eu' : 'papi.staging';
    const varResponseProd = await service.fetchStatus(
        `/var/addons/versions?where=AddonUUID='${addonUUID}' AND Version='${addonVersion}' AND Available=1`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${varCredBase64}`,
            },
            body: JSON.stringify(bodyToSendVARProd),
        },
    );
    if (varResponseProd.Ok !== true) {
        throw new Error(`Error: calling var to make ${addonName} unavailable returned error OK: ${varResponseProd.Ok}`);
    }
    if (varResponseProd.Status !== 200) {
        throw new Error(
            `Error: calling var to make ${addonName} unavailable returned error Status: ${varResponseProd.Status}`,
        );
    }
    if (varResponseProd.Body.AddonUUID !== addonUUID) {
        throw new Error(
            `Error: var call to make ${addonName} unavailable returned WRONG ADDON-UUID: ${varResponseProd.Body.AddonUUID} instead of ${addonUUID}`,
        );
    }
    if (varResponseProd.Body.Version !== addonVersion) {
        throw new Error(
            `Error: var call to make ${addonName} unavailable returned WRONG ADDON-VERSION: ${varResponseProd.Body.Version} instead of ${addonVersion}`,
        );
    }
    if (varResponseProd.Body.Available !== false) {
        throw new Error(
            `Error: var call to make ${addonName} unavailable returned WRONG ADDON-AVALIBILITY: ${varResponseProd.Body.Available} instead of false`,
        );
    }
    console.log(
        `${addonName}, version: ${addonVersion}  on Production became unavailable: Approvment tests didnt pass`,
    );
}

async function reportToTeams(
    addonName,
    addonUUID,
    service: GeneralService,
    addonVersion,
    passingEnvs,
    failingEnvs,
    isDev,
    jobPathPROD?,
    latestRunProd?,
    jobPathEU?,
    latestRunEU?,
    jobPathSB?,
    latestRunSB?,
) {
    let message;
    let message2;
    if (isDev) {
        const uniqFailingEnvs = [...new Set(failingEnvs)];
        message = `Dev Test: ${addonName} - (${addonUUID}), Version:${addonVersion} ||| Passed On: ${
            passingEnvs.length === 0 ? 'None' : passingEnvs.join(', ')
        } ||| Failed On: ${failingEnvs.length === 0 ? 'None' : uniqFailingEnvs.join(', ')}`;
        message2 = `DEV TEST RESULT`;
    } else {
        message = `QA Approvment Test: ${addonName} - (${addonUUID}), Version:${addonVersion} ||| Passed On: ${
            passingEnvs.length === 0 ? 'None' : passingEnvs.join(', ')
        } ||| Failed On: ${failingEnvs.length === 0 ? 'None' : failingEnvs.join(', ')}`;
        message2 = `Test Link:<br>PROD:   https://admin-box.pepperi.com/job/${jobPathPROD}/${latestRunProd}/console<br>EU:    https://admin-box.pepperi.com/job/${jobPathEU}/${latestRunEU}/console<br>SB:    https://admin-box.pepperi.com/job/${jobPathSB}/${latestRunSB}/console`;
    }
    const bodyToSend = {
        Name: isDev ? `${addonName} Dev Test Result Status` : `${addonName} Approvment Tests Status`,
        Description: message,
        Status: passingEnvs.length < 3 ? 'ERROR' : 'SUCCESS',
        Message: message2,
        UserWebhook: handleTeamsURL(addonName),
    };
    const monitoringResponse = await service.fetchStatus('https://papi.pepperi.com/v1.0/system_health/notifications', {
        method: 'POST',
        headers: {
            'X-Pepperi-SecretKey': await service.getSecret()[1],
            'X-Pepperi-OwnerID': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
        },
        body: JSON.stringify(bodyToSend),
    });
    if (monitoringResponse.Ok !== true) {
        throw new Error(`Error: system monitor returned error OK: ${monitoringResponse.Ok}`);
    }
    if (monitoringResponse.Status !== 200) {
        throw new Error(`Error: system monitor returned error STATUS: ${monitoringResponse.Status}`);
    }
    if (Object.keys(monitoringResponse.Error).length !== 0) {
        throw new Error(`Error: system monitor returned ERROR: ${monitoringResponse.Error}`);
    }
}

async function reportToTeamsMessage(addonName, addonUUID, addonVersion, error, service: GeneralService) {
    const message = `${addonName} - (${addonUUID}), Version:${addonVersion}, Failed On: ${error}`;
    const bodyToSend = {
        Name: `${addonName} Approvment Tests Status: Failed Due CICD Process Exception`,
        Description: message,
        Status: 'ERROR',
        Message: message,
        UserWebhook: handleTeamsURL(addonName),
    };
    const monitoringResponse = await service.fetchStatus('https://papi.pepperi.com/v1.0/system_health/notifications', {
        method: 'POST',
        headers: {
            'X-Pepperi-SecretKey': await service.getSecret()[1],
            'X-Pepperi-OwnerID': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
        },
        body: JSON.stringify(bodyToSend),
    });
    if (monitoringResponse.Ok !== true) {
        throw new Error(`Error: system monitor returned error OK: ${monitoringResponse.Ok}`);
    }
    if (monitoringResponse.Status !== 200) {
        throw new Error(`Error: system monitor returned error STATUS: ${monitoringResponse.Status}`);
    }
    if (Object.keys(monitoringResponse.Error).length !== 0) {
        throw new Error(`Error: system monitor returned ERROR: ${monitoringResponse.Error}`);
    }
}

function resolveUserPerTest(addonName): any[] {
    switch (addonName) {
        case 'DATA INDEX':
        case 'DATA-INDEX':
            return ['DataIndexEU@pepperitest.com', 'DataIndexProd@pepperitest.com', 'DataIndexSB@pepperitest.com'];
        // case 'NEBULA'://0.6.x neptune
        //     return ['NebulaTestEU@pepperitest.com', 'NebulaTestProd@pepperitest.com', 'NebulaTestSB@pepperitest.com'];
        case 'NEBULA': //0.7.x neo4j
            return ['neo4JSyncEU@pepperitest.com', 'Neo4JSyncProd@pepperitest.com', 'Neo4JSyncSB@pepperitest.com']; //
        case 'FEBULA':
            return ['febulaEU@pepperitest.com', 'febulaProd@pepperitest.com', 'febulaSB@pepperitest.com']; //
        case 'ADAL':
            return ['AdalEU@pepperitest.com', 'AdalProd@pepperitest.com', 'AdalSB@pepperitest.com'];
        case 'SYNC':
            return ['syncNeo4JEU@pepperitest.com', 'syncNeo4JProd@pepperitest.com', 'syncNeo4JSB@pepperitest.com']; //'syncTestEU@pepperitest.com',
        default:
            return [];
    }
}

async function validateLatestVersionOfAddonIsInstalled(userName, addonUUID, latestVersionOfTestedAddon, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const installedAddonsArr = await service.getInstalledAddons({ page_size: -1 });
    const isInstalled = installedAddonsArr.find(
        (addon) => addon.Addon.UUID == addonUUID && addon.Version == latestVersionOfTestedAddon,
    )
        ? true
        : false;
    return isInstalled;
}

async function getNebulaTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/00000000-0000-0000-0000-000000006a91/tests/tests`, {
            method: 'GET',
        })
    ).Body;
    let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
    toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
    return toReturn;
}

async function runDevTestOnCertainEnv(userName, env, latestVersionOfAutomationTemplateAddon, bodyToSend, addonName) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    let urlToCall;
    if (addonName === 'NEBULA') {
        urlToCall = '/addons/api/async/00000000-0000-0000-0000-000000006a91/tests/tests';
    } else {
        urlToCall = `/addons/api/async/02754342-e0b5-4300-b728-a94ea5e0e8f4/version/${latestVersionOfAutomationTemplateAddon}/tests/run`;
    }
    const testResponse = await service.fetchStatus(urlToCall, {
        body: JSON.stringify(bodyToSend),
        method: 'POST',
        headers: {
            Authorization: `Bearer ${service['client'].OAuthAccessToken}`,
        },
    });
    return testResponse;
}

async function getTestResponseFromAuditLog(userName, env, URI: string) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const auditLogDevTestResponse = await service.getAuditLogResultObjectIfValid(URI as string, 120, 7000);
    return auditLogDevTestResponse;
}

async function getTestNames(addonName, user, env, latestVersionOfAutomationTemplateAddon, addonUUID) {
    if (addonName === 'NEBULA') {
        // testsList
        return getNebulaTests(user, 'prod');
    } else {
        const client = await initiateTester(user, 'Aa123456', env);
        const service = new GeneralService(client);
        return (
            await service.fetchStatus(
                `/addons/api/02754342-e0b5-4300-b728-a94ea5e0e8f4/version/${latestVersionOfAutomationTemplateAddon}/tests/which_tests_for_addonUUID`,
                {
                    method: 'POST',
                    body: JSON.stringify({ AddonUUID: addonUUID }),
                },
            )
        ).Body;
    }
}

function prepareTestBody(addonName, currentTestName, addonUUID) {
    let body;
    if (addonName === 'NEBULA') {
        body = {
            Name: currentTestName,
        };
    } else {
        body = {
            AddonUUID: addonUUID,
            TestName: currentTestName,
            isLocal: false,
        };
    }
    return body;
}

async function printResultsTestObject(testResultArray, userName, env, addonUUID, latestVersionOfTestedAddon) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const installedAddonsArr = await service.getInstalledAddons({ page_size: -1 });
    let didSucceed = true;
    // debugger;
    console.log(
        `####################### ${
            userName.includes('EU') ? 'EU' : env
        } Dev Test Results For Addon ${addonUUID} #######################`,
    );
    for (let index = 0; index < testResultArray.length; index++) {
        const testResult = testResultArray[index];
        if (testResult.title.includes('Test Data')) {
            if (testResult.failures.length > 1) {
                didSucceed = false;
            }
        } else if (testResult.failures) {
            if (testResult.failures.length > 0) didSucceed = false;
        } else {
            for (let index = 0; index < testResultArray.length; index++) {
                const test = testResultArray[index];
                if (!test.passed) {
                    didSucceed = false;
                }
            }
        }
        if (testResultArray.length > 1) {
            for (let index = 0; index < testResultArray.length; index++) {
                const test = testResultArray[index];
                service.reportResults2(
                    test,
                    installedAddonsArr.find(
                        (addon) => addon.Addon.UUID == addonUUID && addon.Version == latestVersionOfTestedAddon,
                    ),
                );
            }
        } else {
            service.reportResults2(
                testResult,
                installedAddonsArr.find(
                    (addon) => addon.Addon.UUID == addonUUID && addon.Version == latestVersionOfTestedAddon,
                ),
            );
        }
    }
    console.log(`##############################################`);
    return { didSucceed };
}

function convertAddonNameToToken(addonName) {
    switch (addonName) {
        case 'ADAL':
            return 'ADAL';
        case 'PFS':
        case 'PEPPERI-FILE-STORAGE':
            return 'PFS';
        case 'DIMX':
            return 'DIMX';
        case 'DATA INDEX':
        case 'DATA-INDEX':
            return 'DATAINDEX';
    }
}

async function getLatestAvailableVersionAndValidateAllEnvsAreSimilar(
    addonUUID,
    service,
    base64VARCredentialsProd,
    base64VARCredentialsEU,
    base64VARCredentialsSB,
) {
    const responseProd = await service.fetchStatus(
        `https://papi.pepperi.com/v1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
        {
            method: 'GET',
            headers: {
                Authorization: `Basic ${base64VARCredentialsProd}`,
            },
        },
    );
    const addonVersionProd = responseProd.Body[0].Version;
    const addonEntryUUIDProd = responseProd.Body[0].UUID;
    const responseEu = await service.fetchStatus(
        `https://papi-eu.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
        {
            method: 'GET',
            headers: {
                Authorization: `Basic ${base64VARCredentialsEU}`,
            },
        },
    );
    const addonVersionEU = responseEu.Body[0].Version;
    const addonEntryUUIDEu = responseEu.Body[0].UUID;
    const responseSb = await service.fetchStatus(
        `https://papi.staging.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
        {
            method: 'GET',
            headers: {
                Authorization: `Basic ${base64VARCredentialsSB}`,
            },
        },
    );
    const addonVersionSb = responseSb.Body[0].Version;
    const addonEntryUUIDSb = responseSb.Body[0].UUID;
    if (
        addonVersionSb !== addonVersionEU ||
        addonVersionProd !== addonVersionEU ||
        addonVersionProd !== addonVersionSb
    ) {
        throw new Error(
            `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`,
        );
    }
    return [addonVersionProd, addonEntryUUIDProd, addonVersionEU, addonEntryUUIDEu, addonVersionSb, addonEntryUUIDSb];
}
//#endregion Replacing UI Functions

function doWeHaveSuchAppTest(addonName: string) {
    switch (addonName) {
        //add another 'case' here when adding new addons to this mehcanisem
        case 'ADAL': {
            return true;
        }
        case 'DIMX': {
            return true;
        }
        case 'DATA INDEX':
        case 'DATA-INDEX': {
            return true;
        }
        case 'PEPPERI-FILE-STORAGE':
        case 'PFS': {
            return true;
        }
        default:
            return false;
    }
}

async function unavailableVersionAfterAppTestFail(
    addonEntryUUIDEu,
    addonEntryUUIDProd,
    addonEntryUUIDSb,
    addonVersionEU,
    addonVersionProd,
    addonVersionSb,
    addonUUID,
    service,
    base64VARCredentialsEU,
    base64VARCredentialsProd,
    base64VARCredentialsSB,
    addonName,
) {
    const bodyToSendVAREU = {
        UUID: addonEntryUUIDEu,
        Version: addonVersionEU,
        Available: false,
        AddonUUID: addonUUID,
    };
    const varResponseEU = await service.fetchStatus(
        `https://papi-eu.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Version='${addonVersionEU}' AND Available=1`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${base64VARCredentialsEU}`,
            },
            body: JSON.stringify(bodyToSendVAREU),
        },
    );
    const bodyToSendVARProd = {
        UUID: addonEntryUUIDProd,
        Version: addonVersionProd,
        Available: false,
        AddonUUID: addonUUID,
    };
    const varResponseProd = await service.fetchStatus(
        `https://papi.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Version='${addonVersionEU}' AND Available=1`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${base64VARCredentialsProd}`,
            },
            body: JSON.stringify(bodyToSendVARProd),
        },
    );
    const bodyToSendVARSb = {
        UUID: addonEntryUUIDSb,
        Version: addonVersionSb,
        Available: false,
        AddonUUID: addonUUID,
    };
    const varResponseSb = await service.fetchStatus(
        `https://papi.staging.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Version='${addonVersionEU}' AND Available=1`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${base64VARCredentialsSB}`,
            },
            body: JSON.stringify(bodyToSendVARSb),
        },
    );
    if (varResponseEU.Ok !== true) {
        throw new Error(`Error: calling var to make ${addonName} unavailable returned error OK: ${varResponseEU.Ok}`);
    }
    if (varResponseEU.Status !== 200) {
        throw new Error(
            `Error: calling var to make ${addonName} unavailable returned error Status: ${varResponseEU.Status}`,
        );
    }
    if (varResponseEU.Body.AddonUUID !== addonUUID) {
        throw new Error(
            `Error: var call to make ${addonName} unavailable returned WRONG ADDON-UUID: ${varResponseEU.Body.AddonUUID} instead of ${addonUUID}`,
        );
    }
    if (varResponseEU.Body.Version !== addonVersionEU) {
        throw new Error(
            `Error: var call to make ${addonName} unavailable returned WRONG ADDON-VERSION: ${varResponseEU.Body.Version} instead of ${addonVersionEU}`,
        );
    }
    if (varResponseEU.Body.Available !== false) {
        throw new Error(
            `Error: var call to make ${addonName} unavailable returned WRONG ADDON-AVALIBILITY: ${varResponseEU.Body.Available} instead of false`,
        );
    }
    console.log(`${addonName}, version: ${addonVersionEU}  on EU became unavailable: Approvment tests didnt pass`);
    if (varResponseProd.Ok !== true) {
        throw new Error(`Error: calling var to make ${addonName} unavailable returned error OK: ${varResponseProd.Ok}`);
    }
    if (varResponseProd.Status !== 200) {
        throw new Error(
            `Error: calling var to make ${addonName} unavailable returned error Status: ${varResponseProd.Status}`,
        );
    }
    if (varResponseProd.Body.AddonUUID !== addonUUID) {
        throw new Error(
            `Error: var call to make ${addonName} unavailable returned WRONG ADDON-UUID: ${varResponseProd.Body.AddonUUID} instead of ${addonUUID}`,
        );
    }
    if (varResponseProd.Body.Version !== addonVersionProd) {
        throw new Error(
            `Error: var call to make ${addonName} unavailable returned WRONG ADDON-VERSION: ${varResponseProd.Body.Version} instead of ${addonVersionProd}`,
        );
    }
    if (varResponseProd.Body.Available !== false) {
        throw new Error(
            `Error: var call to make ${addonName} unavailable returned WRONG ADDON-AVALIBILITY: ${varResponseProd.Body.Available} instead of false`,
        );
    }
    console.log(
        `${addonName}, version: ${addonVersionProd}  on Production became unavailable: Approvment tests didnt pass`,
    );
    if (varResponseSb.Ok !== true) {
        throw new Error(`Error: calling var to make ${addonName} unavailable returned error OK: ${varResponseSb.Ok}`);
    }
    if (varResponseSb.Status !== 200) {
        throw new Error(
            `Error: calling var to make ${addonName} unavailable returned error Status: ${varResponseSb.Status}`,
        );
    }
    if (varResponseSb.Body.AddonUUID !== addonUUID) {
        throw new Error(
            `Error: var call to make ${addonName} unavailable returned WRONG ADDON-UUID: ${varResponseSb.Body.AddonUUID} instead of ${addonUUID}`,
        );
    }
    if (varResponseSb.Body.Version !== addonVersionSb) {
        throw new Error(
            `Error: var call to make ${addonName} unavailable returned WRONG ADDON-VERSION: ${varResponseSb.Body.Version} instead of ${addonVersionSb}`,
        );
    }
    if (varResponseSb.Body.Available !== false) {
        throw new Error(
            `Error: var call to make ${addonName} unavailable returned WRONG ADDON-AVALIBILITY: ${varResponseSb.Body.Available} instead of false`,
        );
    }
    console.log(`${addonName}, version: ${addonVersionSb} on Staging became unavailable: Approvment tests didnt pass`);
}
