import GeneralService, {
    ConsoleColors,
    TesterFunctions,
    ResourceTypes,
    testDataForInitUser,
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
    ScriptPickerTests,
    LoginPerfSqlitefTests,
    ResourceListTests,
    RLdataPrep,
    VisitFlowTests,
    MockTest,
    SurveyTests,
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
        await OrderTests(email, pass, client);
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
        await CreateDistributorTests(generalService, varPass, varPassEU);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
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

    if (tests.includes('ResourceList')) {
        // await RLdataPrep(client);
        await ResourceListTests(email, pass, varPass, client);
    }

    if (tests.includes('VisitFlow')) {
        await VisitFlowTests(email, pass, client);
    }

    if (tests.includes('MockTest')) {
        await MockTest(client);
        await ResourceListTests(email, pass, varPass, client);
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
        await SurveyTests(email, pass, client); //, varPass, client
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }
    if (tests.includes('login_performance')) {
        await LoginPerfTests(email, pass, varPass, client, varPassEU);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }
    if (tests.includes('script_picker')) {
        await ScriptPickerTests(email, pass, varPass, client);
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
        const service = new GeneralService(client);
        const addonName = addon.toUpperCase();
        // getting VAR credentials for all envs
        const base64VARCredentialsProd = Buffer.from(varPass).toString('base64');
        const base64VARCredentialsEU = Buffer.from(varPassEU).toString('base64');
        const base64VARCredentialsSB = Buffer.from(varPassSB).toString('base64');
        // global ugly variable
        let JenkinsBuildResultsAllEnvs: string[][] = [[]];
        let addonUUID = '';
        let addonVersionProd = '';
        let addonVersionEU = '';
        let addonVersionSb = '';
        let addonEntryUUIDProd = '';
        let addonEntryUUIDEu = '';
        let addonEntryUUIDSb = '';
        let latestRunProd = '';
        let latestRunEU = '';
        let latestRunSB = '';
        let jobPathEU = '';
        let jobPathPROD = '';
        let jobPathSB = '';
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
                    throw `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`;
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
                        'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20Production%20-%20ADAL/build?token=ADALApprovmentTests',
                        'Test - A1 Production - ADAL',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20EU%20-%20ADAL/build?token=ADALApprovmentTests',
                        'Test - A1 EU - ADAL',
                    ),
                    service.runJenkinsJobRemotely(
                        kmsSecret,
                        'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20Stage%20-%20ADAL/build?token=ADALApprovmentTests',
                        'Test - A1 Stage - ADAL',
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
                    throw `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`;
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
                break;
            }
            case 'DATA INDEX': {
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
                    throw `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`;
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
        }
        // 2. parse which envs failed
        const passingEnvs: string[] = [];
        const failingEnvs: string[] = [];
        for (let index = 0; index < JenkinsBuildResultsAllEnvs.length; index++) {
            const resultAndEnv = JenkinsBuildResultsAllEnvs[index];
            if (resultAndEnv[0] === 'FAILURE') {
                switch (resultAndEnv[1]) {
                    case 'EU':
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
                        if (varResponseEU.Ok !== true) {
                            throw `Error: calling var to make ${addonName} unavailable returned error OK: ${varResponseEU.Ok}`;
                        }
                        if (varResponseEU.Status !== 200) {
                            throw `Error: calling var to make ${addonName} unavailable returned error Status: ${varResponseEU.Status}`;
                        }
                        if (varResponseEU.Body.AddonUUID !== addonUUID) {
                            throw `Error: var call to make ${addonName} unavailable returned WRONG ADDON-UUID: ${varResponseEU.Body.AddonUUID} instead of ${addonUUID}`;
                        }
                        if (varResponseEU.Body.Version !== addonVersionEU) {
                            throw `Error: var call to make ${addonName} unavailable returned WRONG ADDON-VERSION: ${varResponseEU.Body.Version} instead of ${addonVersionEU}`;
                        }
                        if (varResponseEU.Body.Available !== false) {
                            throw `Error: var call to make ${addonName} unavailable returned WRONG ADDON-AVALIBILITY: ${varResponseEU.Body.Available} instead of false`;
                        }
                        console.log(
                            `${addonName}, version: ${addonVersionEU}  on EU became unavailable: Approvment tests didnt pass`,
                        );
                        failingEnvs.push(resultAndEnv[1]);
                        break;
                    case 'Production':
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
                        if (varResponseProd.Ok !== true) {
                            throw `Error: calling var to make ${addonName} unavailable returned error OK: ${varResponseProd.Ok}`;
                        }
                        if (varResponseProd.Status !== 200) {
                            throw `Error: calling var to make ${addonName} unavailable returned error Status: ${varResponseProd.Status}`;
                        }
                        if (varResponseProd.Body.AddonUUID !== addonUUID) {
                            throw `Error: var call to make ${addonName} unavailable returned WRONG ADDON-UUID: ${varResponseProd.Body.AddonUUID} instead of ${addonUUID}`;
                        }
                        if (varResponseProd.Body.Version !== addonVersionProd) {
                            throw `Error: var call to make ${addonName} unavailable returned WRONG ADDON-VERSION: ${varResponseProd.Body.Version} instead of ${addonVersionProd}`;
                        }
                        if (varResponseProd.Body.Available !== false) {
                            throw `Error: var call to make ${addonName} unavailable returned WRONG ADDON-AVALIBILITY: ${varResponseProd.Body.Available} instead of false`;
                        }
                        console.log(
                            `${addonName}, version: ${addonVersionProd}  on Production became unavailable: Approvment tests didnt pass`,
                        );
                        failingEnvs.push(resultAndEnv[1]);
                        break;
                    case 'Stage':
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
                        if (varResponseSb.Ok !== true) {
                            throw `Error: calling var to make ${addonName} unavailable returned error OK: ${varResponseSb.Ok}`;
                        }
                        if (varResponseSb.Status !== 200) {
                            throw `Error: calling var to make ${addonName} unavailable returned error Status: ${varResponseSb.Status}`;
                        }
                        if (varResponseSb.Body.AddonUUID !== addonUUID) {
                            throw `Error: var call to make ${addonName} unavailable returned WRONG ADDON-UUID: ${varResponseSb.Body.AddonUUID} instead of ${addonUUID}`;
                        }
                        if (varResponseSb.Body.Version !== addonVersionSb) {
                            throw `Error: var call to make ${addonName} unavailable returned WRONG ADDON-VERSION: ${varResponseSb.Body.Version} instead of ${addonVersionSb}`;
                        }
                        if (varResponseSb.Body.Available !== false) {
                            throw `Error: var call to make ${addonName} unavailable returned WRONG ADDON-AVALIBILITY: ${varResponseSb.Body.Available} instead of false`;
                        }
                        console.log(
                            `${addonName}, version: ${addonVersionSb} on Staging became unavailable: Approvment tests didnt pass`,
                        );
                        failingEnvs.push(resultAndEnv[1]);
                        break;
                }
            }
        }

        if (!failingEnvs.includes('EU')) {
            passingEnvs.push('EU');
        }
        if (!failingEnvs.includes('Stage') || failingEnvs.includes('Staging')) {
            passingEnvs.push('Stage');
        }
        if (!failingEnvs.includes('Production')) {
            passingEnvs.push('Production');
        }

        //3. send to Teams
        // if (failingEnvs.length > 0) {
        //     const message = `${addonName}(${addonUUID}), Version:${addonVersionProd} ||| Passed On: ${
        //         passingEnvs.length === 0 ? 'None' : passingEnvs.join(', ')
        //     } ||| Failed On: ${failingEnvs.join(', ')}`;
        //     const message2 = `Test Link:<br>PROD:   https://admin-box.pepperi.com/job/${jobPathPROD}/${latestRunProd}/console<br>EU:    https://admin-box.pepperi.com/job/${jobPathEU}/${latestRunEU}/console<br>SB:    https://admin-box.pepperi.com/job/${jobPathSB}/${latestRunSB}/console`;
        //     const bodyToSend = {
        //         Name: `${addonName} Approvment Tests Status`,
        //         Description: message,
        //         Status: passingEnvs.length !== 3 ? 'ERROR' : 'SUCCESS',
        //         Message: message2,
        //         UserWebhook: handleTeamsURL(addonName),
        //     };
        //     const monitoringResponse = await service.fetchStatus(
        //         'https://papi.pepperi.com/v1.0/system_health/notifications',
        //         {
        //             method: 'POST',
        //             headers: {
        //                 'X-Pepperi-SecretKey': await generalService.getSecret()[1],
        //                 'X-Pepperi-OwnerID': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
        //             },
        //             body: JSON.stringify(bodyToSend),
        //         },
        //     );
        //     if (monitoringResponse.Ok !== true) {
        //         throw `Error: system monitor returned error OK: ${monitoringResponse.Ok}`;
        //     }
        //     if (monitoringResponse.Status !== 200) {
        //         throw `Error: system monitor returned error STATUS: ${monitoringResponse.Status}`;
        //     }
        //     if (Object.keys(monitoringResponse.Error).length !== 0) {
        //         throw `Error: system monitor returned ERROR: ${monitoringResponse.Error}`;
        //     }
        // } else {
        //     const message = `${addonName}(${addonUUID}), Version:${addonVersionProd} ||| Passed On: ${
        //         passingEnvs.length === 0 ? 'None' : passingEnvs.join(', ')
        //     } ||| Failed On:  ${failingEnvs.length === 0 ? 'None' : failingEnvs.join(', ')}`;
        //     const message2 = `Test Link:<br>PROD:   https://admin-box.pepperi.com/job/${jobPathPROD}/${latestRunProd}/console<br>EU:    https://admin-box.pepperi.com/job/${jobPathEU}/${latestRunEU}/console<br>SB:    https://admin-box.pepperi.com/job/${jobPathSB}/${latestRunSB}/console`;
        //     const bodyToSend = {
        //         Name: `${addonName} Approvment Tests Status`,
        //         Description: message,
        //         Status: passingEnvs.length !== 3 ? 'ERROR' : 'SUCCESS',
        //         Message: message2,
        //         UserWebhook:
        //             'https://wrnty.webhook.office.com/webhookb2/89287949-3767-4525-ac10-80a303806a44@2f2b54b7-0141-4ba7-8fcd-ab7d17a60547/IncomingWebhook/39160258118a4430bf577aebeabe1c7d/83111104-c68a-4d02-bd4e-0b6ce9f14aa0',
        //     };
        //     const monitoringResponse = await service.fetchStatus(
        //         'https://papi.pepperi.com/v1.0/system_health/notifications',
        //         {
        //             method: 'POST',
        //             headers: {
        //                 'X-Pepperi-SecretKey': await generalService.getSecret()[1],
        //                 'X-Pepperi-OwnerID': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
        //             },
        //             body: JSON.stringify(bodyToSend),
        //         },
        //     );
        //     if (monitoringResponse.Ok !== true) {
        //         throw `Error: system monitor returned error OK: ${monitoringResponse.Ok}`;
        //     }
        //     if (monitoringResponse.Status !== 200) {
        //         throw `Error: system monitor returned error STATUS: ${monitoringResponse.Status}`;
        //     }
        //     if (Object.keys(monitoringResponse.Error).length !== 0) {
        //         throw `Error: system monitor returned ERROR: ${monitoringResponse.Error}`;
        //     }
        // }
    }
    run();
})();

function handleTeamsURL(addonName) {
    switch (addonName) {
        case 'ADAL':
            return 'https://wrnty.webhook.office.com/webhookb2/1e9787b3-a1e5-4c2c-99c0-96bd61c0ff5e@2f2b54b7-0141-4ba7-8fcd-ab7d17a60547/IncomingWebhook/b5117c82e129495fabbe8291e0cb615e/83111104-c68a-4d02-bd4e-0b6ce9f14aa0';
        case 'DIMX':
            return 'https://wrnty.webhook.office.com/webhookb2/1e9787b3-a1e5-4c2c-99c0-96bd61c0ff5e@2f2b54b7-0141-4ba7-8fcd-ab7d17a60547/IncomingWebhook/a5c62481e39743cb9d6651fa88284deb/83111104-c68a-4d02-bd4e-0b6ce9f14aa0';
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
//#endregion Replacing UI Functions
