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
    ResourceListAbiTests,
    InstallationsTest,
    StorybookColorPickerTests,
    StorybookIconTests,
    StorybookAttachmentTests,
    StorybookButtonTests,
    StorybookCheckboxTests,
    StorybookChipsTests,
    StorybookDateTimeTests,
    StorybookDraggableItemsTests,
    StorybookGroupButtonsTests,
    StorybookImageFilmstripTests,
    StorybookImageTests,
    StorybookLinkTests,
    StorybookMenuTests,
    StorybookQuantitySelectorTests,
    StorybookRichHtmlTextareaTests,
    StorybookSearchTests,
    StorybookSelectTests,
    StorybookSelectPanelTests,
    StorybookSeparatorTests,
    StorybookSignatureTests,
    StorybookSkeletonLoaderTests,
    StorybookSliderTests,
    StorybookTextareaTests,
    StorybookTextboxTests,
    Pricing06DataPrep,
    Pricing06Tests,
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
import { SchedulerTester } from '../../api-tests/code-jobs/scheduler';
import { CiCdFlow } from '../../services/cicd-flow.service copy';
import { UnistallAddonFromAllUsersTester } from '../../api-tests/uninstall_addon_from_all_auto_users';
// import { FlowAPITest } from '../../api-tests/flows_api_part';
import { FlowTests } from './flows_builder.test';
import { Import250KToAdalFromDimx } from './import_250k_DIMX.test';
import { UDCImportExportTests } from '../../api-tests/user_defined_collections_import_export';
import { Import200KToAdalFromDimx } from './import_200k_DIMX.test';
import { Import150KToAdalFromDimx } from './import_150k_DIMX.test';
import { SyncTests } from './sync.test';
import { TestDataTestsNewSync } from '../../api-tests/test-service/test_data_new_sync';

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
const whichEnvToRun = process.env.npm_config_envs as string;
const whichAddonToUninstall = process.env.npm_config_which_addon as string;

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

    if (tests.includes('FlowBuilder')) {
        await FlowTests(email, pass, client, {
            body: {
                varKeyStage: varPass,
                varKeyPro: varPass,
                varKeyEU: varPassEU,
            },
        });
        await TestDataTestsNewSync(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('evgeny')) {
        await Import250KToAdalFromDimx(client, {
            body: {
                varKeyStage: varPass,
                varKeyPro: varPass,
                varKeyEU: varPassEU,
            },
        }); //
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('UDCImportExport')) {
        await UDCImportExportTests(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            { describe, expect, it } as TesterFunctions,
        ); //
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Dimx250KUpload')) {
        await Import250KToAdalFromDimx(client, {
            body: {
                varKeyStage: varPass,
                varKeyPro: varPass,
                varKeyEU: varPassEU,
            },
        }); //
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Dimx200KUpload')) {
        await Import200KToAdalFromDimx(client, {
            body: {
                varKeyStage: varPass,
                varKeyPro: varPass,
                varKeyEU: varPassEU,
            },
        }); //
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Dimx150KUpload')) {
        await Import150KToAdalFromDimx(client, {
            body: {
                varKeyStage: varPass,
                varKeyPro: varPass,
                varKeyEU: varPassEU,
            },
        }); //
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Scheduler')) {
        const testerFunctions = generalService.initiateTesterFunctions(client, 'Scheduler');
        await SchedulerTester(
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

    if (tests.includes('AbiRL')) {
        await ResourceListAbiTests(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('VisitFlow')) {
        await VFdataPrep(varPass, client);
        await VisitFlowTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests === 'DataPrepPrc') {
        await PricingDataPrep(varPass, client);
    }

    if (tests.includes('DataPrepPrc06')) {
        await Pricing06DataPrep(varPass, client);
    }

    if (tests === 'Pricing') {
        await PricingDataPrep(varPass, client);
        await PricingTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Pricing06')) {
        await Pricing06DataPrep(varPass, client);
        await Pricing06Tests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('StorybookAttachment')) {
        await StorybookAttachmentTests();
    }

    if (tests.includes('StorybookButton')) {
        await StorybookButtonTests();
    }

    if (tests.includes('StorybookCheckbox')) {
        await StorybookCheckboxTests();
    }

    if (tests.includes('StorybookChips')) {
        await StorybookChipsTests();
    }

    if (tests.includes('StorybookColorPicker')) {
        await StorybookColorPickerTests();
    }

    if (tests.includes('StorybookDateTime')) {
        await StorybookDateTimeTests();
    }

    if (tests.includes('StorybookDraggableItems')) {
        await StorybookDraggableItemsTests();
    }

    if (tests.includes('StorybookGroupButtons')) {
        await StorybookGroupButtonsTests();
    }

    if (tests.includes('StorybookIcon')) {
        await StorybookIconTests();
    }

    if (tests.includes('StorybookImageFilmstrip')) {
        await StorybookImageFilmstripTests();
    }

    if (tests === 'StorybookImage') {
        await StorybookImageTests();
    }

    if (tests.includes('StorybookLink')) {
        await StorybookLinkTests();
    }

    if (tests.includes('StorybookMenu')) {
        await StorybookMenuTests();
    }

    if (tests.includes('StorybookQuantitySelector')) {
        await StorybookQuantitySelectorTests();
    }

    if (tests.includes('StorybookRichHtmlTextarea')) {
        await StorybookRichHtmlTextareaTests();
    }

    if (tests.includes('StorybookSearch')) {
        await StorybookSearchTests();
    }

    if (tests === 'StorybookSelect') {
        await StorybookSelectTests();
    }

    if (tests.includes('StorybookSelectPanel')) {
        await StorybookSelectPanelTests();
    }

    if (tests.includes('StorybookSeparator')) {
        await StorybookSeparatorTests();
    }

    if (tests.includes('StorybookSignature')) {
        await StorybookSignatureTests();
    }

    if (tests.includes('StorybookSkeletonLoader')) {
        await StorybookSkeletonLoaderTests();
    }

    if (tests.includes('StorybookSlider')) {
        await StorybookSliderTests();
    }

    if (tests.includes('StorybookTextarea')) {
        await StorybookTextareaTests();
    }

    if (tests.includes('StorybookTextbox')) {
        await StorybookTextboxTests();
    }

    if (tests.includes('MockTest')) {
        await MockTest(email, pass, client);
        // await ResourceListTests(email, pass, varPass, client);
    }

    if (tests.includes('InstallationsTest')) {
        await InstallationsTest(varPass, client);
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
    if (tests.includes('SyncE2E')) {
        await SyncTests(email, pass, client, varPass);
        await TestDataTestsNewSync(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Survey')) {
        await SurveyTests(email, pass, client, varPass); //
        await TestDataTestsNewSync(generalService, { describe, expect, it } as TesterFunctions);
    }
    if (tests.includes('NGX_POC')) {
        await NgxLibPOC(); // all is needed is the client for general service as were not using an actual pepperi user
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }
    if (tests.includes('login_performance')) {
        await LoginPerfTests(email, pass, varPass, client, varPassEU);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }
    if (tests.includes('uninstall_addon_from_all_auto_users')) {
        if (!whichEnvToRun) {
            throw new Error(`Error: You Have To Pass '--envs=' To Run This Job`);
        }
        const envsAsArray = whichEnvToRun.split(',');
        const envsAsArrayCapital = envsAsArray.map((env) => env.toLocaleUpperCase());
        for (let index = 0; index < envsAsArrayCapital.length; index++) {
            const env = envsAsArrayCapital[index];
            if (env !== 'SB' && env !== 'PROD' && env !== 'EU') {
                throw new Error(
                    `Error: You Must Provide Only Value That Are From The Form EU/eu/Eu/eU/SB/sb/Sb/sB/PROD/prod/Prod/.... As Env - ${env} Is Not Recognised`,
                );
            }
        }
        if (!whichAddonToUninstall) {
            throw new Error(`Error: You Have To Pass '--which_addon=' To Run This Job`);
        }
        if (whichAddonToUninstall.length < 36) {
            throw new Error(`Error: Provided UUID Is Too Short: '${whichAddonToUninstall}'`);
        }
        if (whichAddonToUninstall.length > 36) {
            throw new Error(`Error: Provided UUID Is Too Long: '${whichAddonToUninstall}'`);
        }
        await UnistallAddonFromAllUsersTester(
            { describe, expect, it } as TesterFunctions,
            envsAsArrayCapital,
            whichAddonToUninstall,
        );
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
    if (tests.includes('Jenkins_Neptune')) {
        let isLocal = true;
        //For local run that run on Jenkins this is needed since Jenkins dont inject SK to the test execution folder
        if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
            generalService['client'].AddonSecretKey = await generalService.getSecretKey(
                generalService['client'].AddonUUID,
                varPass,
            );
            isLocal = false;
        }
        let jenkinsLink;
        // getting VAR credentials for all envs
        // const base64VARCredentialsProd = Buffer.from(varPass).toString('base64');
        // const base64VARCredentialsEU = Buffer.from(varPassEU).toString('base64');
        // const base64VARCredentialsSB = Buffer.from(varPassSB).toString('base64');
        const service = new GeneralService(client);
        const addonName = addon.toUpperCase();
        const failedSuitesProd: any[] = [];
        const failedSuitesEU: any[] = [];
        const failedSuitesSB: any[] = [];
        // const arrayOfFailedTests: any[] = [];
        // const passedTests: string[] = [];
        // const passedTestsEnv: string[] = [];
        // const failingTestsEnv: string[] = [];
        let testsList: string[] = [];
        const addonUUID = generalService.convertNameToUUIDForDevTests(addonName);
        if (addonUUID === 'none') {
            console.log('No Dev Test For This Addon - Proceeding To Run Approvment');
        } else {
            const [euUser, prodUser, sbUser] = resolveUserPerTestNeptune(addonName); //
            console.log(
                `####################### Running For: ${addonName}(${addonUUID}) - NEPTUNE #######################`,
            );
            // 1. install all dependencys latest available versions on testing user + template addon latest available version
            let latestVersionOfTestedAddonProd, latestVersionOfTestedAddonEu, latestVersionOfTestedAddonSb;
            try {
                [latestVersionOfTestedAddonProd] = await generalService.getLatestAvailableVersion(
                    addonUUID,
                    varPass,
                    null,
                    'prod',
                );
                [latestVersionOfTestedAddonEu] = await generalService.getLatestAvailableVersion(
                    addonUUID,
                    varPassEU,
                    null,
                    'prod',
                );
                [latestVersionOfTestedAddonSb] = await generalService.getLatestAvailableVersion(
                    addonUUID,
                    varPassSB,
                    null,
                    'stage',
                );
            } catch (error) {
                debugger;
                const errorString = `Error: Couldn't Get Latest Available Versions Of ${addonName}: ${
                    (error as any).message
                }`;
                await reportToTeamsMessageNeptune(
                    addonName,
                    addonUUID,
                    latestVersionOfTestedAddonProd,
                    errorString,
                    service,
                );
                throw new Error(errorString);
            }
            if (
                latestVersionOfTestedAddonSb !== latestVersionOfTestedAddonEu ||
                latestVersionOfTestedAddonProd !== latestVersionOfTestedAddonEu ||
                latestVersionOfTestedAddonProd !== latestVersionOfTestedAddonSb
            ) {
                const errorString = `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${latestVersionOfTestedAddonProd}, sb - ${latestVersionOfTestedAddonSb}, eu - ${latestVersionOfTestedAddonEu}`;
                debugger;
                await reportToTeamsMessageNeptune(
                    addonName,
                    addonUUID,
                    latestVersionOfTestedAddonProd,
                    errorString,
                    service,
                );
                throw new Error(errorString);
            }
            console.log(
                `####################### Running For: ${addonName}(${addonUUID}) - NEPTUNE, version: ${latestVersionOfTestedAddonProd} #######################`,
            );
            debugger;
            await reportBuildStarted(addonName, addonUUID, latestVersionOfTestedAddonProd, generalService);
            // debugger;
            try {
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
            } catch (error) {
                debugger;
                const errorString = (error as any).message;
                await reportToTeamsMessageNeptune(
                    addonName,
                    addonUUID,
                    latestVersionOfTestedAddonProd,
                    errorString,
                    service,
                );
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
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
            const devPassingEnvs: any[] = [];
            const devFailedEnvs: any[] = [];
            for (let index = 0; index < isInstalled.length; index++) {
                const isTestedAddonInstalled = isInstalled[index];
                if (isTestedAddonInstalled === false) {
                    throw new Error(
                        `Error: didn't install ${addonName} - ${addonUUID}, version: ${latestVersionOfTestedAddonProd}`,
                    );
                }
            }
            debugger;
            //3. run the test on latest version of the template addon
            const [latestVersionOfAutomationTemplateAddon, entryUUID] = await generalService.getLatestAvailableVersion(
                '02754342-e0b5-4300-b728-a94ea5e0e8f4',
                varPass,
            );
            console.log(entryUUID);
            // debugger;
            //3.1 get test names
            try {
                testsList = await getTestNames(
                    addonName,
                    prodUser,
                    'prod',
                    latestVersionOfAutomationTemplateAddon,
                    addonUUID,
                );
            } catch (error) {
                debugger;
                const errorString = `Error: got exception trying to get test Names: ${(error as any).message}`;
                await reportToTeamsMessageNeptune(
                    addonName,
                    addonUUID,
                    latestVersionOfTestedAddonProd,
                    errorString,
                    service,
                );
                throw new Error(`Error: got exception trying to get test Names: ${(error as any).message} `);
            }
            //4. iterate on all test names and call each
            for (let index = 0; index < testsList.length; index++) {
                const currentTestName = testsList[index];
                const body = prepareTestBody(addonName, currentTestName);
                console.log(
                    `####################### Running: ${currentTestName}, number: ${index + 1} out of: ${
                        testsList.length
                    }  #######################`,
                );
                let addonSk = null;
                if (addonName === 'DATA INDEX' || addonName === 'DATA-INDEX') {
                    addonSk = await service.getSecretfromKMS(email, pass, 'AutomationAddonSecretKey');
                }
                //4.1. call current test async->
                const [devTestResponseEu, devTestResponseProd, devTestResponseSb] = await Promise.all([
                    //devTestResponseEu,
                    runDevTestOnCertainEnv(
                        euUser,
                        'prod',
                        latestVersionOfAutomationTemplateAddon,
                        body,
                        addonName,
                        addonSk,
                    ),
                    runDevTestOnCertainEnv(
                        prodUser,
                        'prod',
                        latestVersionOfAutomationTemplateAddon,
                        body,
                        addonName,
                        addonSk,
                    ),
                    runDevTestOnCertainEnv(
                        sbUser,
                        'stage',
                        latestVersionOfAutomationTemplateAddon,
                        body,
                        addonName,
                        addonSk,
                    ),
                ]);
                if (
                    devTestResponseEu === undefined ||
                    devTestResponseProd === undefined ||
                    devTestResponseSb === undefined
                ) {
                    let whichEnvs = devTestResponseEu === undefined ? 'EU,,' : '';
                    whichEnvs += devTestResponseProd === undefined ? 'PRDO,' : '';
                    whichEnvs += devTestResponseSb === undefined ? 'SB' : '';
                    const errorString = `Error: got undefined when trying to run ${whichEnvs} tests - no EXECUTION UUID!`;
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                        errorString,
                        service,
                    );
                    throw new Error(`${errorString}`);
                }
                if (
                    devTestResponseEu.Body.URI === undefined ||
                    devTestResponseProd.Body.URI === undefined ||
                    devTestResponseSb.Body.URI === undefined
                ) {
                    let whichEnvs = devTestResponseEu.Body.URI === undefined ? 'EU,,' : '';
                    whichEnvs += devTestResponseProd.Body.URI === undefined ? 'PRDO,' : '';
                    whichEnvs += devTestResponseSb.Body.URI === undefined ? 'SB' : '';
                    const errorString = `Error: got undefined when trying to run ${whichEnvs} tests - no EXECUTION UUID!`;
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                        errorString,
                        service,
                    );
                    throw new Error(`${errorString}`);
                }
                //4.2. poll audit log response for each env
                console.log(
                    `####################### ${currentTestName}: EXECUTION UUIDS:\nEU - ${devTestResponseEu.Body.URI}\nPROD - ${devTestResponseProd.Body.URI}\nSB - ${devTestResponseSb.Body.URI}`,
                );
                const testObject = {
                    name: currentTestName,
                    prodExecution: devTestResponseProd.Body.URI,
                    sbExecution: devTestResponseSb.Body.URI,
                    euExecution: devTestResponseEu.Body.URI,
                };
                generalService.sleep(1000 * 15);
                // debugger;
                const devTestResutsEu = await getTestResponseFromAuditLog(euUser, 'prod', devTestResponseEu.Body.URI);
                const devTestResultsProd = await getTestResponseFromAuditLog(
                    prodUser,
                    'prod',
                    devTestResponseProd.Body.URI,
                );
                const devTestResultsSb = await getTestResponseFromAuditLog(sbUser, 'stage', devTestResponseSb.Body.URI);
                if (
                    (devTestResutsEu.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResutsEu.AuditInfo.ErrorMessage.includes('Task timed out after')) ||
                    (devTestResultsProd.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResultsProd.AuditInfo.ErrorMessage.includes('Task timed out after')) ||
                    (devTestResultsSb.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResultsSb.AuditInfo.ErrorMessage.includes('Task timed out after'))
                ) {
                    debugger;
                    let errorString = '';
                    if (
                        devTestResutsEu.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResutsEu.AuditInfo.ErrorMessage.includes('Task timed out after')
                    ) {
                        errorString += `${euUser} got the error: ${devTestResutsEu.AuditInfo.ErrorMessage} from Audit Log, EXECUTION UUID: ${devTestResponseEu.Body.URI},\n`;
                    }
                    if (
                        devTestResultsProd.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResultsProd.AuditInfo.ErrorMessage.includes('Task timed out after')
                    ) {
                        errorString += `${prodUser} got the error: ${devTestResultsProd.AuditInfo.ErrorMessage} from Audit Log, EXECUTION UUID: ${devTestResponseProd.Body.URI},\n`;
                    }
                    if (
                        devTestResultsSb.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResultsSb.AuditInfo.ErrorMessage.includes('Task timed out after')
                    ) {
                        errorString += `${sbUser} got the error: ${devTestResultsSb.AuditInfo.ErrorMessage} from Audit Log, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                    }
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonEu,
                        errorString,
                        service,
                    );
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                //4.3. parse the response
                let testResultArrayEu;
                let testResultArrayProd;
                let testResultArraySB;
                try {
                    testResultArrayEu = JSON.parse(devTestResutsEu.AuditInfo.ResultObject);
                    testResultArrayProd = JSON.parse(devTestResultsProd.AuditInfo.ResultObject);
                    testResultArraySB = JSON.parse(devTestResultsSb.AuditInfo.ResultObject);
                } catch (error) {
                    debugger;
                    let errorString = '';
                    if (!devTestResutsEu.AuditInfo.ResultObject) {
                        errorString += `${euUser} got the error: ${
                            devTestResutsEu.AuditInfo.ErrorMessage
                        } from Audit Log, Returned Audit Log Is: ${JSON.parse(
                            devTestResutsEu.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseEu.Body.URI},\n`;
                    }
                    if (!devTestResultsProd.AuditInfo.ResultObject) {
                        errorString += `${prodUser} got the error: ${
                            devTestResultsProd.AuditInfo.ErrorMessage
                        } from Audit Log, Returned Audit Log Is: ${JSON.parse(
                            devTestResultsProd.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseProd.Body.URI},\n`;
                    }
                    if (!devTestResultsSb.AuditInfo.ResultObject) {
                        errorString += `${sbUser} got the error: ${
                            devTestResultsSb.AuditInfo.ErrorMessage
                        } from Audit Log, Returned Audit Log Is: ${JSON.parse(
                            devTestResultsSb.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                    }
                    await reportToTeamsMessageNeptune(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                        errorString,
                        service,
                    );
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                // debugger;
                // debugger;
                //4.4. print results to log
                //4.5. print the results
                let objectToPrintEu;
                let objectToPrintProd;
                let objectToPrintSB;
                let shouldAlsoPrintVer = false;
                if (
                    testResultArrayProd.results === undefined &&
                    testResultArraySB.results === undefined &&
                    testResultArrayEu.results === undefined &&
                    testResultArrayProd.tests === undefined &&
                    testResultArraySB.tests === undefined &&
                    testResultArrayEu.tests === undefined
                ) {
                    const errorString = `Cannot Parse Result Object, Recieved: Prod: ${JSON.stringify(
                        testResultArrayProd,
                    )}, EU: ${JSON.stringify(testResultArrayEu)}, SB: ${JSON.stringify(
                        testResultArraySB,
                    )}, On: ${currentTestName} Test`;
                    debugger;
                    await reportToTeamsMessageNeptune(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                        errorString,
                        service,
                    );
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
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
                    objectToPrintSB = testResultArraySB.tests;
                }
                if (objectToPrintEu === undefined || objectToPrintProd === undefined || objectToPrintSB === undefined) {
                    debugger;
                    let errorString = '';
                    if (!objectToPrintEu) {
                        errorString += `${euUser} got the error: ${
                            devTestResutsEu.AuditInfo.ErrorMessage
                        } from Audit Log, Recived Audit Log: ${JSON.stringify(
                            devTestResutsEu.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseEu.Body.URI},\n`;
                    }
                    if (!objectToPrintProd) {
                        errorString += `${prodUser} got the error: ${
                            devTestResultsProd.AuditInfo.ErrorMessage
                        } from Audit Log, Recived Audit Log: ${JSON.stringify(
                            devTestResultsProd.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseProd.Body.URI},\n`;
                    }
                    if (!objectToPrintSB) {
                        errorString += `${sbUser} got the error: ${
                            devTestResultsSb.AuditInfo.ErrorMessage
                        } from Audit Log, Recived Audit Log: ${JSON.stringify(
                            devTestResultsSb.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
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
                for (let index = 0; index < objectToPrintProd.length; index++) {
                    const result = objectToPrintProd[index];
                    console.log(`\n***${currentTestName} PROD result object: ${JSON.stringify(result)}***\n`);
                }
                for (let index = 0; index < objectToPrintSB.length; index++) {
                    const result = objectToPrintSB[index];
                    console.log(`\n***${currentTestName} SB result object: ${JSON.stringify(result)}***\n`);
                }
                for (let index = 0; index < objectToPrintEu.length; index++) {
                    const result = objectToPrintEu[index];
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
                // debugger;
                if (euResults.didSucceed) {
                    devPassingEnvs.push('Eu');
                } else {
                    devFailedEnvs.push('Eu');
                    failedSuitesEU.push({ testName: currentTestName, executionUUID: testObject.euExecution });
                }
                if (prodResults.didSucceed) {
                    devPassingEnvs.push('Production');
                } else {
                    devFailedEnvs.push('Production');
                    failedSuitesProd.push({ testName: currentTestName, executionUUID: testObject.prodExecution });
                }
                if (sbResults.didSucceed) {
                    devPassingEnvs.push('Stage');
                } else {
                    devFailedEnvs.push('Stage');
                    failedSuitesSB.push({ testName: currentTestName, executionUUID: testObject.sbExecution });
                }
            }
            // debugger;
            const devPassingEnvs2: string[] = [];
            const devFailedEnvs2: string[] = [];
            if (
                devPassingEnvs.filter((v) => v === 'Eu').length === testsList.length &&
                devFailedEnvs.filter((v) => v === 'Eu').length === 0
            ) {
                devPassingEnvs2.push('EU');
            } else {
                devFailedEnvs2.push('EU');
            }
            if (
                devPassingEnvs.filter((v) => v === 'Production').length === testsList.length &&
                devFailedEnvs.filter((v) => v === 'Production').length === 0
            ) {
                devPassingEnvs2.push('PROD');
            } else {
                devFailedEnvs2.push('PROD');
            }
            if (
                devPassingEnvs.filter((v) => v === 'Stage').length === testsList.length &&
                devFailedEnvs.filter((v) => v === 'Stage').length === 0
            ) {
                devPassingEnvs2.push('STAGING');
            } else {
                devFailedEnvs2.push('STAGING');
            }
            // debugger;
            if (isLocal) {
                jenkinsLink = 'none, running locally';
            } else {
                const kmsSecret = await generalService.getSecretfromKMS(email, pass, 'JenkinsBuildUserCred');
                const latestRun = await generalService.getLatestJenkinsJobExecutionId(
                    kmsSecret,
                    'API%20Testing%20Framework/job/Addons%20Api%20Tests/job/GitHubAddons',
                );
                jenkinsLink = `https://admin-box.pepperi.com/job/API%20Testing%20Framework/job/Addons%20Api%20Tests/job/GitHubAddons/${latestRun}/console`;
            }
            debugger;
            await reportToTeamsNeptune(
                service,
                email,
                pass,
                addonName,
                addonUUID,
                latestVersionOfTestedAddonProd,
                devPassingEnvs2,
                devFailedEnvs2,
                true,
                [euUser, prodUser, sbUser],
                failedSuitesProd,
                failedSuitesEU,
                failedSuitesSB,
                jenkinsLink,
            );
            console.log('Dev Test Didnt Pass - No Point In Running Approvment');
        }
    }
    if (tests.includes('Remote_Jenkins_Handler')) {
        let isLocal = true;
        //For local run that run on Jenkins this is needed since Jenkins dont inject SK to the test execution folder
        if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
            generalService['client'].AddonSecretKey = await generalService.getSecretKey(
                generalService['client'].AddonUUID,
                varPass,
            );
            isLocal = false;
        }
        let jenkinsLink;
        // getting VAR credentials for all envs
        const base64VARCredentialsProd = Buffer.from(varPass).toString('base64');
        const base64VARCredentialsEU = Buffer.from(varPassEU).toString('base64');
        const base64VARCredentialsSB = Buffer.from(varPassSB).toString('base64');
        const service = new GeneralService(client);
        const addonName = addon.toUpperCase();
        let addonUUID;
        const failedSuitesProd: any[] = [];
        const failedSuitesEU: any[] = [];
        const failedSuitesSB: any[] = [];
        // const arrayOfFailedTests: any[] = [];
        // const passedTests: string[] = [];
        // const passedTestsEnv: string[] = [];
        // const failingTestsEnv: string[] = [];
        let testsList: string[] = [];
        addonUUID = generalService.convertNameToUUIDForDevTests(addonName);
        if (addonUUID === 'none') {
            console.log('No Dev Test For This Addon - Proceeding To Run Approvment');
        } else if (addonUUID === '5122dc6d-745b-4f46-bb8e-bd25225d350a') {
            //sync - shouldnt run on PROD!
            const [euUser, sbUser] = resolveUserPerTest(addonName); //
            console.log(`####################### Running For: ${addonName}(${addonUUID}) #######################`);
            // 1. install all dependencys latest available versions on testing user + template addon latest available version
            let latestVersionOfTestedAddonEu, addonEntryUUIDEU, latestVersionOfTestedAddonSb, addonEntryUUIDSb;
            try {
                [latestVersionOfTestedAddonEu, addonEntryUUIDEU] = await generalService.getLatestAvailableVersion(
                    addonUUID,
                    varPassEU,
                    null,
                    'prod',
                );
                [latestVersionOfTestedAddonSb, addonEntryUUIDSb] = await generalService.getLatestAvailableVersion(
                    addonUUID,
                    varPassSB,
                    null,
                    'stage',
                );
            } catch (error) {
                debugger;
                const errorString = `Error: Couldn't Get Latest Available Versions Of ${addonName}: ${
                    (error as any).message
                }`;
                await reportToTeamsMessage(addonName, addonUUID, latestVersionOfTestedAddonEu, errorString, service);
                throw new Error(errorString);
            }
            if (latestVersionOfTestedAddonSb !== latestVersionOfTestedAddonEu) {
                const errorString = `Error: Latest Avalibale Addon Versions Across Envs Are Different: sb - ${latestVersionOfTestedAddonSb}, eu - ${latestVersionOfTestedAddonEu}`;
                debugger;
                await reportToTeamsMessage(addonName, addonUUID, latestVersionOfTestedAddonEu, errorString, service);
                await Promise.all([
                    unavailableAddonVersion(
                        'prod',
                        addonName,
                        addonEntryUUIDEU,
                        latestVersionOfTestedAddonEu,
                        addonUUID,
                        varPassEU,
                    ),
                    unavailableAddonVersion(
                        'stage',
                        addonName,
                        addonEntryUUIDSb,
                        latestVersionOfTestedAddonEu,
                        addonUUID,
                        varPassSB,
                    ),
                ]);
                throw new Error(errorString);
            }
            console.log(
                `####################### Running For: ${addonName}(${addonUUID}), version: ${latestVersionOfTestedAddonEu} #######################`,
            );
            debugger;
            await reportBuildStarted(addonName, addonUUID, latestVersionOfTestedAddonEu, generalService);
            // debugger;
            try {
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
                        sbUser,
                        addonName,
                        addonUUID,
                        { describe, expect, it } as TesterFunctions,
                        varPassSB,
                        'stage',
                    ),
                ]);
            } catch (error) {
                debugger;
                const errorString = (error as any).message;
                await reportToTeamsMessage(addonName, addonUUID, latestVersionOfTestedAddonEu, errorString, service);
                await Promise.all([
                    unavailableAddonVersion(
                        'prod',
                        addonName,
                        addonEntryUUIDEU,
                        latestVersionOfTestedAddonEu,
                        addonUUID,
                        varPassEU,
                    ),
                    unavailableAddonVersion(
                        'stage',
                        addonName,
                        addonEntryUUIDSb,
                        latestVersionOfTestedAddonEu,
                        addonUUID,
                        varPassSB,
                    ),
                ]);
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }
            console.log(
                `####################### ${addonName} Version: ${latestVersionOfTestedAddonEu} #######################`,
            );

            debugger;
            const isInstalled = await Promise.all([
                validateLatestVersionOfAddonIsInstalled(euUser, addonUUID, latestVersionOfTestedAddonEu, 'prod'),
                validateLatestVersionOfAddonIsInstalled(sbUser, addonUUID, latestVersionOfTestedAddonSb, 'stage'),
            ]);
            const devPassingEnvs: any[] = [];
            const devFailedEnvs: any[] = [];
            for (let index = 0; index < isInstalled.length; index++) {
                const isTestedAddonInstalled = isInstalled[index];
                if (isTestedAddonInstalled === false) {
                    throw new Error(
                        `Error: didn't install ${addonName} - ${addonUUID}, version: ${latestVersionOfTestedAddonEu}`,
                    );
                }
            }
            debugger;
            //3. run the test on latest version of the template addon
            const [latestVersionOfAutomationTemplateAddon, entryUUID] = await generalService.getLatestAvailableVersion(
                '02754342-e0b5-4300-b728-a94ea5e0e8f4',
                varPass,
            );
            console.log(entryUUID);
            // debugger;
            //3.1 get test names
            try {
                testsList = await getTestNames(
                    addonName,
                    euUser,
                    'prod',
                    latestVersionOfAutomationTemplateAddon,
                    addonUUID,
                );
            } catch (error) {
                debugger;
                const errorString = `Error: got exception trying to get test Names: ${(error as any).message}`;
                await reportToTeamsMessage(addonName, addonUUID, latestVersionOfTestedAddonEu, errorString, service);
                throw new Error(`Error: got exception trying to get test Names: ${(error as any).message} `);
            }
            //4. iterate on all test names and call each
            for (let index = 0; index < testsList.length; index++) {
                const currentTestName = testsList[index];
                const body = prepareTestBody(addonName, currentTestName);
                console.log(
                    `####################### Running: ${currentTestName}, number: ${index + 1} out of: ${
                        testsList.length
                    }  #######################`,
                );
                let addonSk = null;
                if (addonName === 'DATA INDEX' || addonName === 'DATA-INDEX') {
                    addonSk = await service.getSecretfromKMS(email, pass, 'AutomationAddonSecretKey');
                }
                //4.1. call current test async->
                const [devTestResponseEu, devTestResponseSb] = await Promise.all([
                    //devTestResponseEu,
                    runDevTestOnCertainEnv(
                        euUser,
                        'prod',
                        latestVersionOfAutomationTemplateAddon,
                        body,
                        addonName,
                        addonSk,
                    ),
                    runDevTestOnCertainEnv(
                        sbUser,
                        'stage',
                        latestVersionOfAutomationTemplateAddon,
                        body,
                        addonName,
                        addonSk,
                    ),
                ]);
                if (devTestResponseEu === undefined || devTestResponseSb === undefined) {
                    let whichEnvs = devTestResponseEu === undefined ? 'EU,,' : '';
                    whichEnvs += devTestResponseSb === undefined ? 'SB' : '';
                    const errorString = `Error: got undefined when trying to run ${whichEnvs} tests - no EXECUTION UUID!`;
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonEu,
                        errorString,
                        service,
                    );
                    throw new Error(`${errorString}`);
                }
                if (devTestResponseEu.Body.URI === undefined || devTestResponseSb.Body.URI === undefined) {
                    let whichEnvs = devTestResponseEu.Body.URI === undefined ? 'EU,,' : '';
                    whichEnvs += devTestResponseSb.Body.URI === undefined ? 'SB' : '';
                    const errorString = `Error: got undefined when trying to run ${whichEnvs} tests - no EXECUTION UUID!`;
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonEu,
                        errorString,
                        service,
                    );
                    throw new Error(`${errorString}`);
                }
                //4.2. poll audit log response for each env
                console.log(
                    `####################### ${currentTestName}: EXECUTION UUIDS:\nEU - ${devTestResponseEu.Body.URI}\nSB - ${devTestResponseSb.Body.URI}`,
                );
                const testObject = {
                    name: currentTestName,
                    sbExecution: devTestResponseSb.Body.URI,
                    euExecution: devTestResponseEu.Body.URI,
                };
                // debugger;
                generalService.sleep(1000 * 15);
                const devTestResutsEu = await getTestResponseFromAuditLog(euUser, 'prod', devTestResponseEu.Body.URI);
                const devTestResultsSb = await getTestResponseFromAuditLog(sbUser, 'stage', devTestResponseSb.Body.URI);
                if (
                    (devTestResutsEu.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResutsEu.AuditInfo.ErrorMessage.includes('Task timed out after')) ||
                    (devTestResultsSb.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResultsSb.AuditInfo.ErrorMessage.includes('Task timed out after'))
                ) {
                    debugger;
                    let errorString = '';
                    if (
                        devTestResutsEu.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResutsEu.AuditInfo.ErrorMessage.includes('Task timed out after')
                    ) {
                        errorString += `${euUser} got the error: ${devTestResutsEu.AuditInfo.ErrorMessage} from Audit Log, EXECUTION UUID: ${devTestResponseEu.Body.URI},\n`;
                    }
                    if (
                        devTestResultsSb.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResultsSb.AuditInfo.ErrorMessage.includes('Task timed out after')
                    ) {
                        errorString += `${sbUser} got the error: ${devTestResultsSb.AuditInfo.ErrorMessage} from Audit Log, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                    }
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonEu,
                        errorString,
                        service,
                    );
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                //4.3. parse the response
                let testResultArrayEu;
                let testResultArraySB;
                try {
                    testResultArrayEu = JSON.parse(devTestResutsEu.AuditInfo.ResultObject);
                    testResultArraySB = JSON.parse(devTestResultsSb.AuditInfo.ResultObject);
                } catch (error) {
                    debugger;
                    let errorString = '';
                    if (!devTestResutsEu.AuditInfo.ResultObject) {
                        errorString += `${euUser} got the error: ${
                            devTestResutsEu.AuditInfo.ErrorMessage
                        } from Audit Log, Returned Audit Log Is: ${JSON.parse(
                            devTestResutsEu.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseEu.Body.URI},\n`;
                    }
                    if (!devTestResultsSb.AuditInfo.ResultObject) {
                        errorString += `${sbUser} got the error: ${
                            devTestResultsSb.AuditInfo.ErrorMessage
                        } from Audit Log, Returned Audit Log Is: ${JSON.parse(
                            devTestResultsSb.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                    }
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonEu,
                        errorString,
                        service,
                    );
                    await Promise.all([
                        unavailableAddonVersion(
                            'prod',
                            addonName,
                            addonEntryUUIDEU,
                            latestVersionOfTestedAddonEu,
                            addonUUID,
                            varPassEU,
                        ),
                        unavailableAddonVersion(
                            'stage',
                            addonName,
                            addonEntryUUIDSb,
                            latestVersionOfTestedAddonEu,
                            addonUUID,
                            varPassSB,
                        ),
                    ]);
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                // debugger;
                // debugger;
                //4.4. print results to log
                //4.5. print the results
                let objectToPrintEu;
                let objectToPrintSB;
                let shouldAlsoPrintVer = false;
                if (
                    testResultArraySB.results === undefined &&
                    testResultArrayEu.results === undefined &&
                    testResultArraySB.tests === undefined &&
                    testResultArrayEu.tests === undefined
                ) {
                    const errorString = `Cannot Parse Result Object, Recieved: EU: ${JSON.stringify(
                        testResultArrayEu,
                    )}, SB: ${JSON.stringify(testResultArraySB)}, On: ${currentTestName} Test`;
                    debugger;
                    await Promise.all([
                        unavailableAddonVersion(
                            'prod',
                            addonName,
                            addonEntryUUIDEU,
                            latestVersionOfTestedAddonEu,
                            addonUUID,
                            varPassEU,
                        ),
                        unavailableAddonVersion(
                            'stage',
                            addonName,
                            addonEntryUUIDSb,
                            latestVersionOfTestedAddonEu,
                            addonUUID,
                            varPassSB,
                        ),
                    ]);
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonEu,
                        errorString,
                        service,
                    );
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                if (
                    testResultArrayEu.results &&
                    testResultArrayEu.results[0].suites[0].suites &&
                    testResultArrayEu.results[0].suites[0].suites.length > 0
                ) {
                    shouldAlsoPrintVer = true;
                    objectToPrintEu = testResultArrayEu.results[0].suites[0].suites;
                    objectToPrintSB = testResultArraySB.results[0].suites[0].suites;
                } else if (testResultArrayEu.results) {
                    //add an if to catch the other result config also
                    objectToPrintEu = testResultArrayEu.results[0].suites;
                    objectToPrintSB = testResultArraySB.results[0].suites;
                } else {
                    objectToPrintEu = testResultArrayEu.tests;
                    objectToPrintSB = testResultArraySB.tests;
                }
                if (objectToPrintEu === undefined || objectToPrintSB === undefined) {
                    debugger;
                    let errorString = '';
                    if (!objectToPrintEu) {
                        errorString += `${euUser} got the error: ${
                            devTestResutsEu.AuditInfo.ErrorMessage
                        } from Audit Log, Recived Audit Log: ${JSON.stringify(
                            devTestResutsEu.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseEu.Body.URI},\n`;
                    }
                    if (!objectToPrintSB) {
                        errorString += `${sbUser} got the error: ${
                            devTestResultsSb.AuditInfo.ErrorMessage
                        } from Audit Log, Recived Audit Log: ${JSON.stringify(
                            devTestResultsSb.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                    }
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonEu,
                        errorString,
                        service,
                    );
                    await Promise.all([
                        unavailableAddonVersion(
                            'prod',
                            addonName,
                            addonEntryUUIDEU,
                            latestVersionOfTestedAddonEu,
                            addonUUID,
                            varPassEU,
                        ),
                        unavailableAddonVersion(
                            'stage',
                            addonName,
                            addonEntryUUIDSb,
                            latestVersionOfTestedAddonEu,
                            addonUUID,
                            varPassSB,
                        ),
                    ]);
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                for (let index = 0; index < objectToPrintSB.length; index++) {
                    const result = objectToPrintSB[index];
                    console.log(`\n***${currentTestName} SB result object: ${JSON.stringify(result)}***\n`);
                }
                for (let index = 0; index < objectToPrintEu.length; index++) {
                    const result = objectToPrintEu[index];
                    console.log(`\n***${currentTestName} EU result object: ${JSON.stringify(result)}***\n`);
                }
                const euResults = await printResultsTestObject(
                    objectToPrintEu,
                    euUser,
                    'prod',
                    addonUUID,
                    latestVersionOfTestedAddonEu,
                );
                const sbResults = await printResultsTestObject(
                    objectToPrintSB,
                    sbUser,
                    'stage',
                    addonUUID,
                    latestVersionOfTestedAddonEu,
                );
                if (shouldAlsoPrintVer) {
                    objectToPrintEu = testResultArrayEu.results[0].suites[1].suites;
                    objectToPrintSB = testResultArraySB.results[0].suites[1].suites;
                    await printResultsTestObject(
                        objectToPrintEu,
                        euUser,
                        'prod',
                        addonUUID,
                        latestVersionOfTestedAddonEu,
                    );
                    await printResultsTestObject(
                        objectToPrintSB,
                        sbUser,
                        'stage',
                        addonUUID,
                        latestVersionOfTestedAddonEu,
                    );
                }
                // debugger;
                //4.6. create the array of passing / failing tests
                // debugger;
                if (euResults.didSucceed) {
                    devPassingEnvs.push('Eu');
                } else {
                    devFailedEnvs.push('Eu');
                    failedSuitesEU.push({ testName: currentTestName, executionUUID: testObject.euExecution });
                }
                if (sbResults.didSucceed) {
                    devPassingEnvs.push('Stage');
                } else {
                    devFailedEnvs.push('Stage');
                    failedSuitesSB.push({ testName: currentTestName, executionUUID: testObject.sbExecution });
                }
            }
            // debugger;
            const devPassingEnvs2: string[] = [];
            const devFailedEnvs2: string[] = [];
            if (
                devPassingEnvs.filter((v) => v === 'Eu').length === testsList.length &&
                devFailedEnvs.filter((v) => v === 'Eu').length === 0
            ) {
                devPassingEnvs2.push('EU');
            } else {
                devFailedEnvs2.push('EU');
            }
            if (
                devPassingEnvs.filter((v) => v === 'Stage').length === testsList.length &&
                devFailedEnvs.filter((v) => v === 'Stage').length === 0
            ) {
                devPassingEnvs2.push('STAGING');
            } else {
                devFailedEnvs2.push('STAGING');
            }
            // debugger;
            if (isLocal) {
                jenkinsLink = 'none, running locally';
            } else {
                const kmsSecret = await generalService.getSecretfromKMS(email, pass, 'JenkinsBuildUserCred');
                const latestRun = await generalService.getLatestJenkinsJobExecutionId(
                    kmsSecret,
                    'API%20Testing%20Framework/job/Addons%20Api%20Tests/job/GitHubAddons',
                );
                jenkinsLink = `https://admin-box.pepperi.com/job/API%20Testing%20Framework/job/Addons%20Api%20Tests/job/GitHubAddons/${latestRun}/console`;
            }
            if (devFailedEnvs2.length != 0) {
                debugger;
                await Promise.all([
                    unavailableAddonVersion(
                        'prod',
                        addonName,
                        addonEntryUUIDEU,
                        latestVersionOfTestedAddonEu,
                        addonUUID,
                        varPassEU,
                    ),
                    unavailableAddonVersion(
                        'stage',
                        addonName,
                        addonEntryUUIDSb,
                        latestVersionOfTestedAddonEu,
                        addonUUID,
                        varPassSB,
                    ),
                ]);
                await reportToTeams(
                    service,
                    email,
                    pass,
                    addonName,
                    addonUUID,
                    latestVersionOfTestedAddonEu,
                    devPassingEnvs2,
                    devFailedEnvs2,
                    true,
                    [euUser, sbUser],
                    failedSuitesProd,
                    failedSuitesEU,
                    failedSuitesSB,
                    jenkinsLink,
                );
                console.log('Dev Test Didnt Pass - No Point In Running Approvment');
                return;
            } else if (!doWeHaveSuchAppTest(addonName)) {
                await reportToTeams(
                    service,
                    email,
                    pass,
                    addonName,
                    addonUUID,
                    latestVersionOfTestedAddonEu,
                    devPassingEnvs2,
                    devFailedEnvs2,
                    true,
                    [euUser, sbUser],
                    failedSuitesProd,
                    failedSuitesEU,
                    failedSuitesSB,
                    jenkinsLink,
                );
            }
        } else {
            const [euUser, prodUser, sbUser] = resolveUserPerTest(addonName); //
            console.log(`####################### Running For: ${addonName}(${addonUUID}) #######################`);
            // 1. install all dependencys latest available versions on testing user + template addon latest available version
            let latestVersionOfTestedAddonProd,
                addonEntryUUIDProd,
                latestVersionOfTestedAddonEu,
                addonEntryUUIDEU,
                latestVersionOfTestedAddonSb,
                addonEntryUUIDSb;
            try {
                [latestVersionOfTestedAddonProd, addonEntryUUIDProd] = await generalService.getLatestAvailableVersion(
                    addonUUID,
                    varPass,
                    null,
                    'prod',
                );
                [latestVersionOfTestedAddonEu, addonEntryUUIDEU] = await generalService.getLatestAvailableVersion(
                    addonUUID,
                    varPassEU,
                    null,
                    'prod',
                );
                [latestVersionOfTestedAddonSb, addonEntryUUIDSb] = await generalService.getLatestAvailableVersion(
                    addonUUID,
                    varPassSB,
                    null,
                    'stage',
                );
            } catch (error) {
                debugger;
                const errorString = `Error: Couldn't Get Latest Available Versions Of ${addonName}: ${
                    (error as any).message
                }`;
                await reportToTeamsMessage(addonName, addonUUID, latestVersionOfTestedAddonProd, errorString, service);
                throw new Error(errorString);
            }
            if (
                latestVersionOfTestedAddonSb !== latestVersionOfTestedAddonEu ||
                latestVersionOfTestedAddonProd !== latestVersionOfTestedAddonEu ||
                latestVersionOfTestedAddonProd !== latestVersionOfTestedAddonSb
            ) {
                const errorString = `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${latestVersionOfTestedAddonProd}, sb - ${latestVersionOfTestedAddonSb}, eu - ${latestVersionOfTestedAddonEu}`;
                debugger;
                await reportToTeamsMessage(addonName, addonUUID, latestVersionOfTestedAddonProd, errorString, service);
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
                throw new Error(errorString);
            }
            console.log(
                `####################### Running For: ${addonName}(${addonUUID}), version: ${latestVersionOfTestedAddonProd} #######################`,
            );
            debugger;
            await reportBuildStarted(addonName, addonUUID, latestVersionOfTestedAddonProd, generalService);
            debugger;
            try {
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
            } catch (error) {
                debugger;
                const errorString = (error as any).message;
                await reportToTeamsMessage(addonName, addonUUID, latestVersionOfTestedAddonProd, errorString, service);
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
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
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
            const devPassingEnvs: any[] = [];
            const devFailedEnvs: any[] = [];
            for (let index = 0; index < isInstalled.length; index++) {
                const isTestedAddonInstalled = isInstalled[index];
                if (isTestedAddonInstalled === false) {
                    throw new Error(
                        `Error: didn't install ${addonName} - ${addonUUID}, version: ${latestVersionOfTestedAddonProd}`,
                    );
                }
            }
            debugger;
            //3. run the test on latest version of the template addon
            const [latestVersionOfAutomationTemplateAddon, entryUUID] = await generalService.getLatestAvailableVersion(
                '02754342-e0b5-4300-b728-a94ea5e0e8f4',
                varPass,
            );
            console.log(entryUUID);
            // debugger;
            //3.1 get test names
            try {
                testsList = await getTestNames(
                    addonName,
                    prodUser,
                    'prod',
                    latestVersionOfAutomationTemplateAddon,
                    addonUUID,
                );
            } catch (error) {
                debugger;
                const errorString = `Error: got exception trying to get test Names: ${(error as any).message}`;
                await reportToTeamsMessage(addonName, addonUUID, latestVersionOfTestedAddonProd, errorString, service);
                throw new Error(`Error: got exception trying to get test Names: ${(error as any).message} `);
            }
            //4. iterate on all test names and call each
            for (let index = 0; index < testsList.length; index++) {
                const currentTestName = testsList[index];
                const body = prepareTestBody(addonName, currentTestName);
                console.log(
                    `####################### Running: ${currentTestName}, number: ${index + 1} out of: ${
                        testsList.length
                    }  #######################`,
                );
                let addonSk = null;
                if (addonName === 'DATA INDEX' || addonName === 'DATA-INDEX' || addonName === 'ADAL') {
                    addonSk = await service.getSecretfromKMS(email, pass, 'AutomationAddonSecretKey');
                }
                //4.1. call current test async->
                const [devTestResponseEu, devTestResponseProd, devTestResponseSb] = await Promise.all([
                    //devTestResponseEu,
                    runDevTestOnCertainEnv(
                        euUser,
                        'prod',
                        latestVersionOfAutomationTemplateAddon,
                        body,
                        addonName,
                        addonSk,
                    ),
                    runDevTestOnCertainEnv(
                        prodUser,
                        'prod',
                        latestVersionOfAutomationTemplateAddon,
                        body,
                        addonName,
                        addonSk,
                    ),
                    runDevTestOnCertainEnv(
                        sbUser,
                        'stage',
                        latestVersionOfAutomationTemplateAddon,
                        body,
                        addonName,
                        addonSk,
                    ),
                ]);
                if (
                    devTestResponseEu === undefined ||
                    devTestResponseProd === undefined ||
                    devTestResponseSb === undefined
                ) {
                    let whichEnvs = devTestResponseEu === undefined ? 'EU,,' : '';
                    whichEnvs += devTestResponseProd === undefined ? 'PRDO,' : '';
                    whichEnvs += devTestResponseSb === undefined ? 'SB' : '';
                    const errorString = `Error: got undefined when trying to run ${whichEnvs} tests - no EXECUTION UUID!`;
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                        errorString,
                        service,
                    );
                    throw new Error(`${errorString}`);
                }
                if (
                    devTestResponseEu.Body.URI === undefined ||
                    devTestResponseProd.Body.URI === undefined ||
                    devTestResponseSb.Body.URI === undefined
                ) {
                    let whichEnvs = devTestResponseEu.Body.URI === undefined ? 'EU,,' : '';
                    whichEnvs += devTestResponseProd.Body.URI === undefined ? 'PRDO,' : '';
                    whichEnvs += devTestResponseSb.Body.URI === undefined ? 'SB' : '';
                    const errorString = `Error: got undefined when trying to run ${whichEnvs} tests - no EXECUTION UUID!`;
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                        errorString,
                        service,
                    );
                    throw new Error(`${errorString}`);
                }
                //4.2. poll audit log response for each env
                console.log(
                    `####################### ${currentTestName}: EXECUTION UUIDS:\nEU - ${devTestResponseEu.Body.URI}\nPROD - ${devTestResponseProd.Body.URI}\nSB - ${devTestResponseSb.Body.URI}`,
                );
                const testObject = {
                    name: currentTestName,
                    prodExecution: devTestResponseProd.Body.URI,
                    sbExecution: devTestResponseSb.Body.URI,
                    euExecution: devTestResponseEu.Body.URI,
                };
                debugger;
                generalService.sleep(1000 * 15);
                const devTestResutsEu = await getTestResponseFromAuditLog(euUser, 'prod', devTestResponseEu.Body.URI);
                const devTestResultsProd = await getTestResponseFromAuditLog(
                    prodUser,
                    'prod',
                    devTestResponseProd.Body.URI,
                );
                const devTestResultsSb = await getTestResponseFromAuditLog(sbUser, 'stage', devTestResponseSb.Body.URI);
                debugger;
                if (
                    (devTestResutsEu.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResutsEu.AuditInfo.ErrorMessage.includes('Task timed out after')) ||
                    (devTestResultsProd.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResultsProd.AuditInfo.ErrorMessage.includes('Task timed out after')) ||
                    (devTestResultsSb.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResultsSb.AuditInfo.ErrorMessage.includes('Task timed out after'))
                ) {
                    debugger;
                    let errorString = '';
                    if (
                        devTestResutsEu.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResutsEu.AuditInfo.ErrorMessage.includes('Task timed out after')
                    ) {
                        errorString += `${euUser} got the error: ${devTestResutsEu.AuditInfo.ErrorMessage} from Audit Log, EXECUTION UUID: ${devTestResponseEu.Body.URI},\n`;
                    }
                    if (
                        devTestResultsProd.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResultsProd.AuditInfo.ErrorMessage.includes('Task timed out after')
                    ) {
                        errorString += `${prodUser} got the error: ${devTestResultsProd.AuditInfo.ErrorMessage} from Audit Log, EXECUTION UUID: ${devTestResponseProd.Body.URI},\n`;
                    }
                    if (
                        devTestResultsSb.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResultsSb.AuditInfo.ErrorMessage.includes('Task timed out after')
                    ) {
                        errorString += `${sbUser} got the error: ${devTestResultsSb.AuditInfo.ErrorMessage} from Audit Log, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                    }
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                        errorString,
                        service,
                    );
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
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                debugger;
                //4.3. parse the response
                let testResultArrayEu;
                let testResultArrayProd;
                let testResultArraySB;
                try {
                    testResultArrayEu = JSON.parse(devTestResutsEu.AuditInfo.ResultObject);
                    testResultArrayProd = JSON.parse(devTestResultsProd.AuditInfo.ResultObject);
                    testResultArraySB = JSON.parse(devTestResultsSb.AuditInfo.ResultObject);
                } catch (error) {
                    debugger;
                    let errorString = '';
                    if (!devTestResutsEu.AuditInfo.ResultObject) {
                        errorString += `${euUser} got the error: ${
                            devTestResutsEu.AuditInfo.ErrorMessage
                        } from Audit Log, Returned Audit Log Is: ${JSON.parse(
                            devTestResutsEu.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseEu.Body.URI},\n`;
                    }
                    if (!devTestResultsProd.AuditInfo.ResultObject) {
                        errorString += `${prodUser} got the error: ${
                            devTestResultsProd.AuditInfo.ErrorMessage
                        } from Audit Log, Returned Audit Log Is: ${JSON.parse(
                            devTestResultsProd.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseProd.Body.URI},\n`;
                    }
                    if (!devTestResultsSb.AuditInfo.ResultObject) {
                        errorString += `${sbUser} got the error: ${
                            devTestResultsSb.AuditInfo.ErrorMessage
                        } from Audit Log, Returned Audit Log Is: ${JSON.parse(
                            devTestResultsSb.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                    }
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                        errorString,
                        service,
                    );
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
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                // debugger;
                // debugger;
                //4.4. print results to log
                //4.5. print the results
                let objectToPrintEu;
                let objectToPrintProd;
                let objectToPrintSB;
                let shouldAlsoPrintVer = false;
                if (
                    testResultArrayProd.results === undefined &&
                    testResultArraySB.results === undefined &&
                    testResultArrayEu.results === undefined &&
                    testResultArrayProd.tests === undefined &&
                    testResultArraySB.tests === undefined &&
                    testResultArrayEu.tests === undefined
                ) {
                    const errorString = `Cannot Parse Result Object, Recieved: Prod: ${JSON.stringify(
                        testResultArrayProd,
                    )}, EU: ${JSON.stringify(testResultArrayEu)}, SB: ${JSON.stringify(
                        testResultArraySB,
                    )}, On: ${currentTestName} Test`;
                    debugger;
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
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                        errorString,
                        service,
                    );
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
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
                    objectToPrintSB = testResultArraySB.tests;
                }
                if (objectToPrintEu === undefined || objectToPrintProd === undefined || objectToPrintSB === undefined) {
                    debugger;
                    let errorString = '';
                    if (!objectToPrintEu) {
                        errorString += `${euUser} got the error: ${
                            devTestResutsEu.AuditInfo.ErrorMessage
                        } from Audit Log, Recived Audit Log: ${JSON.stringify(
                            devTestResutsEu.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseEu.Body.URI},\n`;
                    }
                    if (!objectToPrintProd) {
                        errorString += `${prodUser} got the error: ${
                            devTestResultsProd.AuditInfo.ErrorMessage
                        } from Audit Log, Recived Audit Log: ${JSON.stringify(
                            devTestResultsProd.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseProd.Body.URI},\n`;
                    }
                    if (!objectToPrintSB) {
                        errorString += `${sbUser} got the error: ${
                            devTestResultsSb.AuditInfo.ErrorMessage
                        } from Audit Log, Recived Audit Log: ${JSON.stringify(
                            devTestResultsSb.AuditInfo,
                        )}, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                    }
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonProd,
                        errorString,
                        service,
                    );
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
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
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
                    const result = objectToPrintEu[index];
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
                // debugger;
                if (euResults.didSucceed) {
                    devPassingEnvs.push('Eu');
                } else {
                    devFailedEnvs.push('Eu');
                    failedSuitesEU.push({ testName: currentTestName, executionUUID: testObject.euExecution });
                }
                if (prodResults.didSucceed) {
                    devPassingEnvs.push('Production');
                } else {
                    devFailedEnvs.push('Production');
                    failedSuitesProd.push({ testName: currentTestName, executionUUID: testObject.prodExecution });
                }
                if (sbResults.didSucceed) {
                    devPassingEnvs.push('Stage');
                } else {
                    devFailedEnvs.push('Stage');
                    failedSuitesSB.push({ testName: currentTestName, executionUUID: testObject.sbExecution });
                }
            }
            // debugger;
            const devPassingEnvs2: string[] = [];
            const devFailedEnvs2: string[] = [];
            if (
                devPassingEnvs.filter((v) => v === 'Eu').length === testsList.length &&
                devFailedEnvs.filter((v) => v === 'Eu').length === 0
            ) {
                devPassingEnvs2.push('EU');
            } else {
                devFailedEnvs2.push('EU');
            }
            if (
                devPassingEnvs.filter((v) => v === 'Production').length === testsList.length &&
                devFailedEnvs.filter((v) => v === 'Production').length === 0
            ) {
                devPassingEnvs2.push('PROD');
            } else {
                devFailedEnvs2.push('PROD');
            }
            if (
                devPassingEnvs.filter((v) => v === 'Stage').length === testsList.length &&
                devFailedEnvs.filter((v) => v === 'Stage').length === 0
            ) {
                devPassingEnvs2.push('STAGING');
            } else {
                devFailedEnvs2.push('STAGING');
            }
            // debugger;
            if (isLocal) {
                jenkinsLink = 'none, running locally';
            } else {
                const kmsSecret = await generalService.getSecretfromKMS(email, pass, 'JenkinsBuildUserCred');
                const latestRun = await generalService.getLatestJenkinsJobExecutionId(
                    kmsSecret,
                    'API%20Testing%20Framework/job/Addons%20Api%20Tests/job/GitHubAddons',
                );
                jenkinsLink = `https://admin-box.pepperi.com/job/API%20Testing%20Framework/job/Addons%20Api%20Tests/job/GitHubAddons/${latestRun}/console`;
            }
            if (devFailedEnvs2.length != 0) {
                debugger;
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
                await reportToTeams(
                    service,
                    email,
                    pass,
                    addonName,
                    addonUUID,
                    latestVersionOfTestedAddonProd,
                    devPassingEnvs2,
                    devFailedEnvs2,
                    true,
                    [euUser, prodUser, sbUser],
                    failedSuitesProd,
                    failedSuitesEU,
                    failedSuitesSB,
                    jenkinsLink,
                );
                console.log('Dev Test Didnt Pass - No Point In Running Approvment');
                return;
            } else if (!doWeHaveSuchAppTest(addonName)) {
                await reportToTeams(
                    service,
                    email,
                    pass,
                    addonName,
                    addonUUID,
                    latestVersionOfTestedAddonProd,
                    devPassingEnvs2,
                    devFailedEnvs2,
                    true,
                    [euUser, prodUser, sbUser],
                    failedSuitesProd,
                    failedSuitesEU,
                    failedSuitesSB,
                    jenkinsLink,
                );
            }
        }
        ///////////////////////APPROVMENT TESTS///////////////////////////////////
        // global ugly variable
        let JenkinsBuildResultsAllEnvsEx: string[][] = [[]];
        // let addonUUID = '';
        let addonVersionProdEx = '';
        let addonVersionEUEx = '';
        let addonVersionSbEx = '';
        let latestRunProdEx = '';
        let latestRunEUEx = '';
        let latestRunSBEx = '';
        let pathProdEx = '';
        let pathEUEx = '';
        let pathSBEx = '';
        let addonEntryUUIDProdEx;
        let addonEntryUUIDEuEx;
        let addonEntryUUIDSbEx;
        console.log(`####################### Approvment Tests For ${addonName} #######################`);
        const runnnerService = new CiCdFlow(
            generalService,
            base64VARCredentialsProd,
            base64VARCredentialsEU,
            base64VARCredentialsSB,
        );
        // 1. parse which addon should run and on which version, run the test on Jenkins
        switch (addonName) {
            //add another 'case' here when adding new addons to this mehcanisem
            case 'ADAL': {
                addonUUID = '00000000-0000-0000-0000-00000000ada1';
                const buildToken = 'ADALApprovmentTests';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20Production%20-%20ADAL';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20EU%20-%20ADAL';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20Stage%20-%20ADAL';
                const {
                    JenkinsBuildResultsAllEnvs,
                    latestRunProd,
                    latestRunEU,
                    latestRunSB,
                    addonEntryUUIDProd,
                    addonEntryUUIDEu,
                    addonEntryUUIDSb,
                    addonVersionProd,
                    addonVersionEU,
                    addonVersionSb,
                } = await runnnerService.jenkinsSingleJobTestRunner(
                    email,
                    pass,
                    addonName,
                    addonUUID,
                    jobPathPROD,
                    jobPathEU,
                    jobPathSB,
                    buildToken,
                );
                JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvs;
                latestRunProdEx = latestRunProd;
                latestRunEUEx = latestRunEU;
                latestRunSBEx = latestRunSB;
                pathProdEx = jobPathPROD;
                pathEUEx = jobPathEU;
                pathSBEx = jobPathSB;
                addonEntryUUIDProdEx = addonEntryUUIDProd;
                addonEntryUUIDEuEx = addonEntryUUIDEu;
                addonEntryUUIDSbEx = addonEntryUUIDSb;
                addonVersionProdEx = addonVersionProd;
                addonVersionEUEx = addonVersionEU;
                addonVersionSbEx = addonVersionSb;
                break;
            }
            case 'PAPI-DATA-INDEX':
            case 'PAPI INDEX': {
                addonUUID = '10979a11-d7f4-41df-8993-f06bfd778304';
                const buildToken = 'PapiDataIndexApprovmentTests';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20K1%20Production%20-%20Papi%20Data%20Index';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20K1%20EU%20-%20Papi%20Data%20Index';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20K1%20Stage%20%20-%20Papi%20Data%20Index';
                const {
                    JenkinsBuildResultsAllEnvs,
                    latestRunProd,
                    latestRunEU,
                    latestRunSB,
                    addonEntryUUIDProd,
                    addonEntryUUIDEu,
                    addonEntryUUIDSb,
                    addonVersionProd,
                    addonVersionEU,
                    addonVersionSb,
                } = await runnnerService.jenkinsSingleJobTestRunner(
                    email,
                    pass,
                    addonName,
                    addonUUID,
                    jobPathPROD,
                    jobPathEU,
                    jobPathSB,
                    buildToken,
                );
                JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvs;
                latestRunProdEx = latestRunProd;
                latestRunEUEx = latestRunEU;
                latestRunSBEx = latestRunSB;
                pathProdEx = jobPathPROD;
                pathEUEx = jobPathEU;
                pathSBEx = jobPathSB;
                addonEntryUUIDProdEx = addonEntryUUIDProd;
                addonEntryUUIDEuEx = addonEntryUUIDEu;
                addonEntryUUIDSbEx = addonEntryUUIDSb;
                addonVersionProdEx = addonVersionProd;
                addonVersionEUEx = addonVersionEU;
                addonVersionSbEx = addonVersionSb;
                break;
            }
            case 'GENERIC RESOURCE':
            case 'GENERIC-RESOURCE': {
                addonUUID = 'df90dba6-e7cc-477b-95cf-2c70114e44e0';
                const buildToken = 'CPIDATAApprovmentTests';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20J1%20Production%20-%20CPI%20DATA%20+%20GENERIC%20RESOURCE';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20J1%20EU%20-%20CPI%20DATA%20+%20GENERIC%20RESOURCE';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20J1%20Staging%20-%20CPI%20DATA%20+%20GENERIC%20RESOURCE';
                const {
                    JenkinsBuildResultsAllEnvs,
                    latestRunProd,
                    latestRunEU,
                    latestRunSB,
                    addonEntryUUIDProd,
                    addonEntryUUIDEu,
                    addonEntryUUIDSb,
                    addonVersionProd,
                    addonVersionEU,
                    addonVersionSb,
                } = await runnnerService.jenkinsSingleJobTestRunner(
                    email,
                    pass,
                    addonName,
                    addonUUID,
                    jobPathPROD,
                    jobPathEU,
                    jobPathSB,
                    buildToken,
                );
                JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvs;
                latestRunProdEx = latestRunProd;
                latestRunEUEx = latestRunEU;
                latestRunSBEx = latestRunSB;
                pathProdEx = jobPathPROD;
                pathEUEx = jobPathEU;
                pathSBEx = jobPathSB;
                addonEntryUUIDProdEx = addonEntryUUIDProd;
                addonEntryUUIDEuEx = addonEntryUUIDEu;
                addonEntryUUIDSbEx = addonEntryUUIDSb;
                addonVersionProdEx = addonVersionProd;
                addonVersionEUEx = addonVersionEU;
                addonVersionSbEx = addonVersionSb;
                break;
            }
            case 'CPI DATA':
            case 'ADDONS-CPI-DATA':
            case 'CPI-DATA': {
                addonUUID = 'd6b06ad0-a2c1-4f15-bebb-83ecc4dca74b';
                const buildToken = 'CPIDATAApprovmentTests';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20J1%20Production%20-%20CPI%20DATA%20+%20GENERIC%20RESOURCE';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20J1%20EU%20-%20CPI%20DATA%20+%20GENERIC%20RESOURCE';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20J1%20Staging%20-%20CPI%20DATA%20+%20GENERIC%20RESOURCE';
                const {
                    JenkinsBuildResultsAllEnvs,
                    latestRunProd,
                    latestRunEU,
                    latestRunSB,
                    addonEntryUUIDProd,
                    addonEntryUUIDEu,
                    addonEntryUUIDSb,
                    addonVersionProd,
                    addonVersionEU,
                    addonVersionSb,
                } = await runnnerService.jenkinsSingleJobTestRunner(
                    email,
                    pass,
                    addonName,
                    addonUUID,
                    jobPathPROD,
                    jobPathEU,
                    jobPathSB,
                    buildToken,
                );
                JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvs;
                latestRunProdEx = latestRunProd;
                latestRunEUEx = latestRunEU;
                latestRunSBEx = latestRunSB;
                pathProdEx = jobPathPROD;
                pathEUEx = jobPathEU;
                pathSBEx = jobPathSB;
                addonEntryUUIDProdEx = addonEntryUUIDProd;
                addonEntryUUIDEuEx = addonEntryUUIDEu;
                addonEntryUUIDSbEx = addonEntryUUIDSb;
                addonVersionProdEx = addonVersionProd;
                addonVersionEUEx = addonVersionEU;
                addonVersionSbEx = addonVersionSb;
                break;
            }
            case 'PNS': {
                addonUUID = '00000000-0000-0000-0000-000000040fa9';
                const buildToken = 'PNSApprovmentTests';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20E1%20Production%20-%20PNS';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20E1%20EU%20-%20PNS';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20E1%20Stage%20-%20PNS';
                const {
                    JenkinsBuildResultsAllEnvs,
                    latestRunProd,
                    latestRunEU,
                    latestRunSB,
                    addonEntryUUIDProd,
                    addonEntryUUIDEu,
                    addonEntryUUIDSb,
                    addonVersionProd,
                    addonVersionEU,
                    addonVersionSb,
                } = await runnnerService.jenkinsSingleJobTestRunner(
                    email,
                    pass,
                    addonName,
                    addonUUID,
                    jobPathPROD,
                    jobPathEU,
                    jobPathSB,
                    buildToken,
                );
                JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvs;
                latestRunProdEx = latestRunProd;
                latestRunEUEx = latestRunEU;
                latestRunSBEx = latestRunSB;
                pathProdEx = jobPathPROD;
                pathEUEx = jobPathEU;
                pathSBEx = jobPathSB;
                addonEntryUUIDProdEx = addonEntryUUIDProd;
                addonEntryUUIDEuEx = addonEntryUUIDEu;
                addonEntryUUIDSbEx = addonEntryUUIDSb;
                addonVersionProdEx = addonVersionProd;
                addonVersionEUEx = addonVersionEU;
                addonVersionSbEx = addonVersionSb;
                break;
            }
            case 'USER-DEFINED-COLLECTIONS':
            case 'UDC': {
                addonUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
                const buildToken = 'UDCApprovmentTests';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20G1%20Production%20-%20UDC';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20G1%20EU%20-%20UDC';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20G1%20Stage%20-%20UDC';
                const jobPathPROD2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20G2%20Production%20-%20UDC%20Import%20Export%2010K';
                const jobPathEU2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20G2%20EU%20-%20UDC%20Import%20Export%2010K';
                const jobPathSB2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20G2%20Stage%20-%20UDC%20Import%20Export%2010K';
                const {
                    addonEntryUUIDProd,
                    addonEntryUUIDEu,
                    addonEntryUUIDSb,
                    latestRunProdReturn,
                    latestRunEUReturn,
                    latestRunSBReturn,
                    JenkinsBuildResultsAllEnvsToReturn,
                    addonVersionProd,
                    addonVersionEU,
                    addonVersionSb,
                    jobPathToReturnProd,
                    jobPathToReturnSB,
                    jobPathToReturnEU,
                } = await runnnerService.jenkinsDoubleJobTestRunner(
                    addonName,
                    addonUUID,
                    jobPathPROD,
                    jobPathEU,
                    jobPathSB,
                    buildToken,
                    jobPathPROD2,
                    jobPathEU2,
                    jobPathSB2,
                );
                JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvsToReturn;
                latestRunProdEx = latestRunProdReturn;
                latestRunEUEx = latestRunEUReturn;
                latestRunSBEx = latestRunSBReturn;
                pathProdEx = jobPathToReturnProd;
                pathEUEx = jobPathToReturnEU;
                pathSBEx = jobPathToReturnSB;
                addonEntryUUIDProdEx = addonEntryUUIDProd;
                addonEntryUUIDEuEx = addonEntryUUIDEu;
                addonEntryUUIDSbEx = addonEntryUUIDSb;
                addonVersionProdEx = addonVersionProd;
                addonVersionEUEx = addonVersionEU;
                addonVersionSbEx = addonVersionSb;
                break;
            }
            case 'SCHEDULER': {
                addonUUID = '8bc903d1-d97a-46b8-990b-50bea356e35b';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20H1%20Production%20-%20%20Scheduler';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20H1%20EU%20-%20%20Scheduler';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20H1%20Stage%20-%20Scheduler';
                const buildToken = 'SchedulerApprovmentTests';
                const jobPathPROD2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20H2%20Production%20-%20CodeJobs';
                const jobPathEU2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20H2%20EU%20-%20CodeJobs';
                const jobPathSB2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20H2%20Stage%20-%20CodeJobs';
                const {
                    addonEntryUUIDProd,
                    addonEntryUUIDEu,
                    addonEntryUUIDSb,
                    latestRunProdReturn,
                    latestRunEUReturn,
                    latestRunSBReturn,
                    JenkinsBuildResultsAllEnvsToReturn,
                    addonVersionProd,
                    addonVersionEU,
                    addonVersionSb,
                    jobPathToReturnProd,
                    jobPathToReturnSB,
                    jobPathToReturnEU,
                } = await runnnerService.jenkinsDoubleJobTestRunner(
                    addonName,
                    addonUUID,
                    jobPathPROD,
                    jobPathEU,
                    jobPathSB,
                    buildToken,
                    jobPathPROD2,
                    jobPathEU2,
                    jobPathSB2,
                );
                JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvsToReturn;
                latestRunProdEx = latestRunProdReturn;
                latestRunEUEx = latestRunEUReturn;
                latestRunSBEx = latestRunSBReturn;
                pathProdEx = jobPathToReturnProd;
                pathEUEx = jobPathToReturnEU;
                pathSBEx = jobPathToReturnSB;
                addonEntryUUIDProdEx = addonEntryUUIDProd;
                addonEntryUUIDEuEx = addonEntryUUIDEu;
                addonEntryUUIDSbEx = addonEntryUUIDSb;
                addonVersionProdEx = addonVersionProd;
                addonVersionEUEx = addonVersionEU;
                addonVersionSbEx = addonVersionSb;
                break;
            }
            case 'DIMX': {
                addonUUID = '44c97115-6d14-4626-91dc-83f176e9a0fc';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20B1%20Production%20-%20DIMX';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20B1%20EU%20-%20DIMX';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20B1%20Stage%20-%20DIMX';
                const buildToken = 'DIMXApprovmentTests';
                const jobPathPROD2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20B2%20Production%20-%20DIMX%20Part%202%20-%20CLI';
                const jobPathEU2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20B2%20EU%20-%20DIMX%20Part%202%20-%20CLI';
                const jobPathSB2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20B2%20Stage%20-%20DIMX%20Part%202%20-%20CLI';
                const {
                    addonEntryUUIDProd,
                    addonEntryUUIDEu,
                    addonEntryUUIDSb,
                    latestRunProdReturn,
                    latestRunEUReturn,
                    latestRunSBReturn,
                    JenkinsBuildResultsAllEnvsToReturn,
                    addonVersionProd,
                    addonVersionEU,
                    addonVersionSb,
                    jobPathToReturnProd,
                    jobPathToReturnSB,
                    jobPathToReturnEU,
                } = await runnnerService.jenkinsDoubleJobTestRunner(
                    addonName,
                    addonUUID,
                    jobPathPROD,
                    jobPathEU,
                    jobPathSB,
                    buildToken,
                    jobPathPROD2,
                    jobPathEU2,
                    jobPathSB2,
                );
                JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvsToReturn;
                latestRunProdEx = latestRunProdReturn;
                latestRunEUEx = latestRunEUReturn;
                latestRunSBEx = latestRunSBReturn;
                pathProdEx = jobPathToReturnProd;
                pathEUEx = jobPathToReturnEU;
                pathSBEx = jobPathToReturnSB;
                addonEntryUUIDProdEx = addonEntryUUIDProd;
                addonEntryUUIDEuEx = addonEntryUUIDEu;
                addonEntryUUIDSbEx = addonEntryUUIDSb;
                addonVersionProdEx = addonVersionProd;
                addonVersionEUEx = addonVersionEU;
                addonVersionSbEx = addonVersionSb;
                break;
            }
            case 'RESOURCE LIST':
            case 'RESOURCE-LIST': {
                addonUUID = '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/E2E%20Test%20-%20A1%20Production%20-%20Resource%20List%20ABI%20-%20CLI';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/E2E%20Test%20-%20A1%20EU%20-%20Resource%20List%20ABI%20-%20CLI';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/E2E%20Test%20-%20A1%20Stage%20-%20Resource%20List%20ABI%20-%20CLI';
                const buildToken = 'ResourceListABIApprovmentTests';
                const {
                    JenkinsBuildResultsAllEnvs,
                    latestRunProd,
                    latestRunEU,
                    latestRunSB,
                    addonEntryUUIDProd,
                    addonEntryUUIDEu,
                    addonEntryUUIDSb,
                    addonVersionProd,
                    addonVersionEU,
                    addonVersionSb,
                } = await runnnerService.jenkinsSingleJobTestRunner(
                    email,
                    pass,
                    addonName,
                    addonUUID,
                    jobPathPROD,
                    jobPathEU,
                    jobPathSB,
                    buildToken,
                );
                JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvs;
                latestRunProdEx = latestRunProd;
                latestRunEUEx = latestRunEU;
                latestRunSBEx = latestRunSB;
                pathProdEx = jobPathPROD;
                pathEUEx = jobPathEU;
                pathSBEx = jobPathSB;
                addonEntryUUIDProdEx = addonEntryUUIDProd;
                addonEntryUUIDEuEx = addonEntryUUIDEu;
                addonEntryUUIDSbEx = addonEntryUUIDSb;
                addonVersionProdEx = addonVersionProd;
                addonVersionEUEx = addonVersionEU;
                addonVersionSbEx = addonVersionSb;
                break;
            }
            case 'DATA INDEX':
            case 'DATA-INDEX': {
                addonUUID = '00000000-0000-0000-0000-00000e1a571c';
                const buildToken = 'DATAINDEXApprovmentTests';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20C1%20Production%20-%20DATA%20INDEX%20FRAMEWORK';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20C1%20EU%20-%20DATA%20INDEX%20FRAMEWORK';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20C1%20Stage%20-%20DATA%20INDEX%20FRAMEWORK';
                const {
                    JenkinsBuildResultsAllEnvs,
                    latestRunProd,
                    latestRunEU,
                    latestRunSB,
                    addonEntryUUIDProd,
                    addonEntryUUIDEu,
                    addonEntryUUIDSb,
                    addonVersionProd,
                    addonVersionEU,
                    addonVersionSb,
                } = await runnnerService.jenkinsSingleJobTestRunner(
                    email,
                    pass,
                    addonName,
                    addonUUID,
                    jobPathPROD,
                    jobPathEU,
                    jobPathSB,
                    buildToken,
                );
                JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvs;
                latestRunProdEx = latestRunProd;
                latestRunEUEx = latestRunEU;
                latestRunSBEx = latestRunSB;
                pathProdEx = jobPathPROD;
                pathEUEx = jobPathEU;
                pathSBEx = jobPathSB;
                addonEntryUUIDProdEx = addonEntryUUIDProd;
                addonEntryUUIDEuEx = addonEntryUUIDEu;
                addonEntryUUIDSbEx = addonEntryUUIDSb;
                addonVersionProdEx = addonVersionProd;
                addonVersionEUEx = addonVersionEU;
                addonVersionSbEx = addonVersionSb;
                break;
            }
            case 'PEPPERI-FILE-STORAGE':
            case 'PFS': {
                addonUUID = '00000000-0000-0000-0000-0000000f11e5';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20D1%20Production%20-%20PFS';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20D1%20EU%20-%20PFS';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20D1%20Stage%20-%20PFS';
                const buildToken = 'PFSApprovmentTests';
                const jobPathPROD2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20D2%20Production%20-%20CPI%20PFS';
                const {
                    addonEntryUUIDProd,
                    addonEntryUUIDEu,
                    addonEntryUUIDSb,
                    latestRunProdReturn,
                    latestRunEUReturn,
                    latestRunSBReturn,
                    JenkinsBuildResultsAllEnvsToReturn,
                    addonVersionProd,
                    addonVersionEU,
                    addonVersionSb,
                    jobPathToReturnProd,
                    jobPathToReturnSB,
                    jobPathToReturnEU,
                } = await runnnerService.jenkinsDoubleJobTestRunner(
                    addonName,
                    addonUUID,
                    jobPathPROD,
                    jobPathEU,
                    jobPathSB,
                    buildToken,
                    jobPathPROD2,
                );
                JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvsToReturn;
                latestRunProdEx = latestRunProdReturn;
                latestRunEUEx = latestRunEUReturn;
                latestRunSBEx = latestRunSBReturn;
                pathProdEx = jobPathToReturnProd;
                pathEUEx = jobPathToReturnEU;
                pathSBEx = jobPathToReturnSB;
                addonEntryUUIDProdEx = addonEntryUUIDProd;
                addonEntryUUIDEuEx = addonEntryUUIDEu;
                addonEntryUUIDSbEx = addonEntryUUIDSb;
                addonVersionProdEx = addonVersionProd;
                addonVersionEUEx = addonVersionEU;
                addonVersionSbEx = addonVersionSb;
                break;
            }
            case 'CORE':
            case 'CORE-GENERIC-RESOURCES': {
                addonUUID = 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f';
                const buildToken = 'COREApprovmentTests';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20F1%20Production%20-%20Core';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20F1%20EU%20-%20Core';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20F1%20Stage%20-%20Core';
                const {
                    JenkinsBuildResultsAllEnvs,
                    latestRunProd,
                    latestRunEU,
                    latestRunSB,
                    addonEntryUUIDProd,
                    addonEntryUUIDEu,
                    addonEntryUUIDSb,
                    addonVersionProd,
                    addonVersionEU,
                    addonVersionSb,
                } = await runnnerService.jenkinsSingleJobTestRunner(
                    email,
                    pass,
                    addonName,
                    addonUUID,
                    jobPathPROD,
                    jobPathEU,
                    jobPathSB,
                    buildToken,
                );
                JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvs;
                latestRunProdEx = latestRunProd;
                latestRunEUEx = latestRunEU;
                latestRunSBEx = latestRunSB;
                pathProdEx = jobPathPROD;
                pathEUEx = jobPathEU;
                pathSBEx = jobPathSB;
                addonEntryUUIDProdEx = addonEntryUUIDProd;
                addonEntryUUIDEuEx = addonEntryUUIDEu;
                addonEntryUUIDSbEx = addonEntryUUIDSb;
                addonVersionProdEx = addonVersionProd;
                addonVersionEUEx = addonVersionEU;
                addonVersionSbEx = addonVersionSb;
                break;
            }
            default:
                console.log(`no approvement tests for addon: ${addonName}`);
                return;
        }
        await runnnerService.resultParser(
            JenkinsBuildResultsAllEnvsEx,
            addonEntryUUIDEuEx,
            addonEntryUUIDProdEx,
            addonEntryUUIDSbEx,
            addonVersionEUEx,
            addonVersionProdEx,
            addonVersionSbEx,
            addonUUID,
            addonName,
            pathProdEx,
            latestRunProdEx,
            pathEUEx,
            latestRunEUEx,
            pathSBEx,
            latestRunSBEx,
        );
    }
    run();
})();

export async function handleTeamsURL(addonName, service, email, pass) {
    //-->eb26afcd-3cf2-482e-9ab1-b53c41a6adbe
    switch (addonName) {
        case 'QA':
            return await service.getSecretfromKMS(email, pass, 'QAWebHook');
        case 'PAPI-DATA-INDEX':
        case 'PAPI INDEX': //evgeny todo
            return await service.getSecretfromKMS(email, pass, 'PapiDataIndexWebHook');
        case 'SYNC':
            return await service.getSecretfromKMS(email, pass, 'SyncTeamsWebHook');
        case 'ADAL': //new teams
            return await service.getSecretfromKMS(email, pass, 'ADALTeamsWebHook');
        case 'NEBULA':
        case 'FEBULA': //new teams
            return await service.getSecretfromKMS(email, pass, 'NebulaTeamsWebHook');
        case 'DIMX':
            return await service.getSecretfromKMS(email, pass, 'DIMXTeamsWebHook');
        case 'DATA INDEX': //new teams
        case 'DATA-INDEX':
            return await service.getSecretfromKMS(email, pass, 'DataIndexTeamsWebHook');
        case 'PFS':
        case 'PEPPERI-FILE-STORAGE':
            return await service.getSecretfromKMS(email, pass, 'PFSTeamsWebHook');
        case 'PNS':
            return await service.getSecretfromKMS(email, pass, 'PNSTeamsWebHook');
        case 'USER-DEFINED-COLLECTIONS':
        case 'UDC':
            return await service.getSecretfromKMS(email, pass, 'UDCTeamsWebHook');
        case 'SCHEDULER':
            return await service.getSecretfromKMS(email, pass, 'SchedulerTeamsWebHook');
        case 'CPI-DATA': //new teams
        case 'CPI DATA':
            return await service.getSecretfromKMS(email, pass, 'ADALTeamsWebHook');
        case 'CORE': //new teams
        case 'CORE-GENERIC-RESOURCES':
            return await service.getSecretfromKMS(email, pass, 'CORETeamsWebHook');
        case 'RESOURCE-LIST': //new teams
        case 'RESOURCE LIST':
            return await service.getSecretfromKMS(email, pass, 'ResourceListTeamsWebHook');
        case 'UDB':
        case 'USER DEFINED BLOCKS':
            return await service.getSecretfromKMS(email, pass, 'UDBTeamsWebHook');
        case 'CONFIGURATIONS':
            return await service.getSecretfromKMS(email, pass, 'CONFIGURATIONSTeamsWebHook');
        case 'RELATED-ITEMS':
            return await service.getSecretfromKMS(email, pass, 'RelatedItemsTeamsWebHook');
        case 'GENERIC-RESOURCE': //new teams
        case 'GENERIC RESOURCE':
            return await service.getSecretfromKMS(email, pass, 'GenericResourceTeamsWebHook');
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

export async function reportToTeams(
    generalService: GeneralService,
    email,
    pass,
    addonName,
    addonUUID,
    addonVersion,
    passingEnvs,
    failingEnvs,
    isDev,
    users?: string[],
    failedSuitesProd?,
    failedSuitesEU?,
    failedSuitesSB?,
    jenkinsLink?,
    jobPathPROD?,
    latestRunProd?,
    jobPathEU?,
    latestRunEU?,
    jobPathSB?,
    latestRunSB?,
) {
    let message;
    let message2;
    await reportBuildEnded(addonName, addonUUID, addonVersion, generalService);
    if (isDev) {
        const stringUsers = users?.join(',');
        const uniqFailingEnvs = [...new Set(failingEnvs)];
        debugger;
        message = `Dev Test: ${addonName} - (${addonUUID}), Version:${addonVersion}, Test Users:<br>${stringUsers}<br>${
            passingEnvs.length === 0 ? '' : 'Passed On: ' + passingEnvs.join(', ') + ' |||'
        } ${failingEnvs.length === 0 ? '' : 'Failed On: ' + uniqFailingEnvs.join(', ')},<br>Link: ${jenkinsLink}`;
        message2 = `${
            failedSuitesProd.length === 0
                ? ''
                : 'FAILED TESTS AND EXECUTION UUIDS:<br>PROD:' +
                  failedSuitesProd.map((obj) => `${obj.testName} - ${obj.executionUUID}`).join(',<br>')
        }${
            failedSuitesEU.length === 0
                ? ''
                : ',<br>EU:' + failedSuitesEU.map((obj) => `${obj.testName} - ${obj.executionUUID}`).join(',<br>')
        }${
            failedSuitesSB.length === 0
                ? ''
                : ',<br>SB:' + failedSuitesSB.map((obj) => `${obj.testName} - ${obj.executionUUID}`).join(',<br>')
        }`;
    } else {
        message = `QA Approvment Test: ${addonName} - (${addonUUID}), Version:${addonVersion} ||| ${
            passingEnvs.length === 0 ? '' : 'Passed On: ' + passingEnvs.join(', ') + '|||'
        }  ${failingEnvs.length === 0 ? '' : 'Failed On: ' + failingEnvs.join(', ')}`;
        message2 = `Test Link:<br>PROD:   https://admin-box.pepperi.com/job/${jobPathPROD}/${latestRunProd}/console<br>EU:    https://admin-box.pepperi.com/job/${jobPathEU}/${latestRunEU}/console<br>SB:    https://admin-box.pepperi.com/job/${jobPathSB}/${latestRunSB}/console`;
    }
    const bodyToSend = {
        Name: isDev ? `${addonName} Dev Test Result Status` : `${addonName} Approvment Tests Status`,
        Description: message,
        Status: passingEnvs.length < 3 ? 'ERROR' : 'SUCCESS',
        Message: message2 === '' ? '~' : message2,
        UserWebhook: await handleTeamsURL(addonName, generalService, email, pass),
    };
    const monitoringResponse = await generalService.fetchStatus(
        'https://papi.pepperi.com/v1.0/system_health/notifications',
        {
            method: 'POST',
            headers: {
                'X-Pepperi-SecretKey': await generalService.getSecret()[1],
                'X-Pepperi-OwnerID': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
            },
            body: JSON.stringify(bodyToSend),
        },
    );
    if (monitoringResponse.Ok !== true) {
        throw new Error(
            `Error: system monitor returned error OK: ${monitoringResponse.Ok}, Response: ${JSON.stringify(
                monitoringResponse,
            )}`,
        );
    }
    if (monitoringResponse.Status !== 200) {
        throw new Error(
            `Error: system monitor returned error STATUS: ${monitoringResponse.Status}, Response: ${JSON.stringify(
                monitoringResponse,
            )}`,
        );
    }
    if (Object.keys(monitoringResponse.Error).length !== 0) {
        throw new Error(
            `Error: system monitor returned ERROR: ${monitoringResponse.Error}, Response: ${JSON.stringify(
                monitoringResponse,
            )}`,
        );
    }
}

export async function reportToTeamsNeptune(
    generalService: GeneralService,
    email,
    pass,
    addonName,
    addonUUID,
    addonVersion,
    passingEnvs,
    failingEnvs,
    isDev,
    users?: string[],
    failedSuitesProd?,
    failedSuitesEU?,
    failedSuitesSB?,
    jenkinsLink?,
    jobPathPROD?,
    latestRunProd?,
    jobPathEU?,
    latestRunEU?,
    jobPathSB?,
    latestRunSB?,
) {
    let message;
    let message2;
    await reportBuildEnded(addonName, addonUUID, addonVersion, generalService);
    if (isDev) {
        const stringUsers = users?.join(',');
        const uniqFailingEnvs = [...new Set(failingEnvs)];
        debugger;
        message = `Dev Test: ${addonName} - (${addonUUID}) - NEPTUNE, Version:${addonVersion}, Test Users:<br>${stringUsers}<br>${
            passingEnvs.length === 0 ? '' : 'Passed On: ' + passingEnvs.join(', ') + ' |||'
        } ${failingEnvs.length === 0 ? '' : 'Failed On: ' + uniqFailingEnvs.join(', ')},<br>Link: ${jenkinsLink}`;
        message2 = `${
            failedSuitesProd.length === 0
                ? ''
                : 'FAILED TESTS AND EXECUTION UUIDS:<br>PROD:' +
                  failedSuitesProd.map((obj) => `${obj.testName} - ${obj.executionUUID}`).join(',<br>')
        }${
            failedSuitesEU.length === 0
                ? ''
                : ',<br>EU:' + failedSuitesEU.map((obj) => `${obj.testName} - ${obj.executionUUID}`).join(',<br>')
        }${
            failedSuitesSB.length === 0
                ? ''
                : ',<br>SB:' + failedSuitesSB.map((obj) => `${obj.testName} - ${obj.executionUUID}`).join(',<br>')
        }`;
    } else {
        message = `QA Approvment Test: ${addonName} - (${addonUUID}), Version:${addonVersion} ||| ${
            passingEnvs.length === 0 ? '' : 'Passed On: ' + passingEnvs.join(', ') + '|||'
        }  ${failingEnvs.length === 0 ? '' : 'Failed On: ' + failingEnvs.join(', ')}`;
        message2 = `Test Link:<br>PROD:   https://admin-box.pepperi.com/job/${jobPathPROD}/${latestRunProd}/console<br>EU:    https://admin-box.pepperi.com/job/${jobPathEU}/${latestRunEU}/console<br>SB:    https://admin-box.pepperi.com/job/${jobPathSB}/${latestRunSB}/console`;
    }
    const bodyToSend = {
        Name: isDev ? `${addonName} Dev Test Result Status` : `${addonName} Approvment Tests Status`,
        Description: message,
        Status: passingEnvs.length < 3 ? 'ERROR' : 'SUCCESS',
        Message: message2 === '' ? '~' : message2,
        UserWebhook: await handleTeamsURL(addonName, generalService, email, pass),
    };
    const monitoringResponse = await generalService.fetchStatus(
        'https://papi.pepperi.com/v1.0/system_health/notifications',
        {
            method: 'POST',
            headers: {
                'X-Pepperi-SecretKey': await generalService.getSecret()[1],
                'X-Pepperi-OwnerID': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
            },
            body: JSON.stringify(bodyToSend),
        },
    );
    if (monitoringResponse.Ok !== true) {
        throw new Error(
            `Error: system monitor returned error OK: ${monitoringResponse.Ok}, Response: ${JSON.stringify(
                monitoringResponse,
            )}`,
        );
    }
    if (monitoringResponse.Status !== 200) {
        throw new Error(
            `Error: system monitor returned error STATUS: ${monitoringResponse.Status}, Response: ${JSON.stringify(
                monitoringResponse,
            )}`,
        );
    }
    if (Object.keys(monitoringResponse.Error).length !== 0) {
        throw new Error(
            `Error: system monitor returned ERROR: ${monitoringResponse.Error}, Response: ${JSON.stringify(
                monitoringResponse,
            )}`,
        );
    }
}

export async function reportToTeamsMessage(addonName, addonUUID, addonVersion, error, service: GeneralService) {
    await reportBuildEnded(addonName, addonUUID, addonVersion, service);
    const message = `${addonName} - (${addonUUID}), Version:${addonVersion}, Failed On: ${error}`;
    const bodyToSend = {
        Name: `${addonName} Approvment Tests Status: Failed Due CI/CD Process Exception`,
        Description: message,
        Status: 'ERROR',
        Message: message,
        UserWebhook: await handleTeamsURL(addonName, service, email, pass),
    };
    const testAddonSecretKey = await service.getSecret()[1];
    const testAddonUUID = await service.getSecret()[0];
    debugger;
    const monitoringResponse = await service.fetchStatus('https://papi.pepperi.com/v1.0/system_health/notifications', {
        method: 'POST',
        headers: {
            'X-Pepperi-SecretKey': testAddonSecretKey,
            'X-Pepperi-OwnerID': testAddonUUID,
        },
        body: JSON.stringify(bodyToSend),
    });
    debugger;
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

export async function reportToTeamsMessageNeptune(addonName, addonUUID, addonVersion, error, service: GeneralService) {
    await reportBuildEnded(addonName, addonUUID, addonVersion, service);
    const message = `${addonName} - (${addonUUID}), Version:${addonVersion}, Failed On: ${error}`;
    const bodyToSend = {
        Name: `${addonName} - NEPTUNE Approvment Tests Status: Failed Due CI/CD Process Exception`,
        Description: message,
        Status: 'ERROR',
        Message: message,
        UserWebhook: await handleTeamsURL(addonName, service, email, pass),
    };
    const testAddonSecretKey = await service.getSecret()[1];
    const testAddonUUID = await service.getSecret()[0];
    debugger;
    const monitoringResponse = await service.fetchStatus('https://papi.pepperi.com/v1.0/system_health/notifications', {
        method: 'POST',
        headers: {
            'X-Pepperi-SecretKey': testAddonSecretKey,
            'X-Pepperi-OwnerID': testAddonUUID,
        },
        body: JSON.stringify(bodyToSend),
    });
    debugger;
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

export async function reportBuildStarted(addonName, addonUUID, addonVersion, service: GeneralService) {
    const message = `${addonName} - (${addonUUID}), Version:${addonVersion}, Started Building`;
    const bodyToSend = {
        Name: `${addonName}, ${addonUUID}, ${addonVersion}`,
        Description: message,
        Status: 'INFO',
        Message: message,
        UserWebhook: await handleTeamsURL('QA', service, email, pass),
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

export async function reportBuildEnded(addonName, addonUUID, addonVersion, service: GeneralService) {
    const message = `${addonName} - (${addonUUID}), Version:${addonVersion}, Ended Testing`;
    const bodyToSend = {
        Name: `${addonName}, ${addonUUID}, ${addonVersion}`,
        Description: message,
        Status: 'INFO',
        Message: message,
        UserWebhook: await handleTeamsURL('QA', service, email, pass),
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
            return ['syncNeo4JEU@pepperitest.com', 'syncNeo4JSB@pepperitest.com']; //'syncNeo4JProd@pepperitest.com',
        case 'CORE':
        case 'CORE-GENERIC-RESOURCES':
            return ['CoreAppEU@pepperitest.com', 'CoreAppProd@pepperitest.com', 'CoreAppSB@pepperitest.com'];
        case 'PEPPERI-FILE-STORAGE':
        case 'PFS':
            return ['PfsCpiTestEU@pepperitest.com', 'PfsCpiTestProd@pepperitest.com', 'PfsCpiTestSB@pepperitest.com'];
        case 'CONFIGURATIONS':
            return ['configEU@pepperitest.com', 'configProd@pepperitest.com', 'configSB@pepperitest.com'];
        case 'RELATED-ITEMS':
            return [
                'relatedItemsTestEU@pepperitest.com',
                'relatedItemsTestProd@pepperitest.com',
                'relatedItemsTestSB@pepperitest.com',
            ];
        case 'UDB':
        case 'USER DEFINED BLOCKS':
            return [
                'UserDefinedBlocksEUApp2@pepperitest.com',
                'UserDefinedBlocksEUApp5@pepperitest.com',
                'UserDefinedBlocksSBApp2@pepperitest.com',
            ];
        default:
            return [];
    }
}

function resolveUserPerTestNeptune(addonName): any[] {
    switch (addonName) {
        case 'NEBULA': //0.7.x neo4j
            return [
                '⁠NebulaNeptuneEU@pepperitest.com',
                '⁠NebulaNeptuneProd@pepperitest.com',
                'NebulaNeptuneSB@pepperitest.com',
            ]; //
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

async function getFebulaTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/cebb251f-1c80-4d80-b62c-442e48e678e8/tests/tests`, {
            method: 'GET',
        })
    ).Body;
    let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
    toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
    return toReturn;
}

async function getSyncTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/5122dc6d-745b-4f46-bb8e-bd25225d350a/tests/tests`, {
            method: 'GET',
        })
    ).Body;
    let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
    toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
    return toReturn;
}

async function getDataIndexTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/00000000-0000-0000-0000-00000e1a571c/tests/tests`, {
            method: 'GET',
        })
    ).Body;
    let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
    toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
    return toReturn;
}

async function getCoreTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/fc5a5974-3b30-4430-8feb-7d5b9699bc9f/tests/tests`, {
            method: 'GET',
        })
    ).Body;
    let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
    toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
    return toReturn;
}

async function getConfifurationsTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/84c999c3-84b7-454e-9a86-71b7abc96554/tests/tests`, {
            method: 'GET',
        })
    ).Body;
    let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
    toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
    return toReturn;
}

async function getRelatedItemsTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/4f9f10f3-cd7d-43f8-b969-5029dad9d02b/tests/tests`, {
            method: 'GET',
        })
    ).Body;
    let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
    toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
    return toReturn;
}

async function getPFSTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/00000000-0000-0000-0000-0000000f11e5/tests/tests`, {
            method: 'GET',
        })
    ).Body;
    let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
    toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
    return toReturn;
}

async function getUDBTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/9abbb634-9df5-49ab-91d1-41ad7a2632a6/tests/tests`, {
            method: 'GET',
        })
    ).Body;
    let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
    toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
    return toReturn;
}

async function runDevTestOnCertainEnv(
    userName,
    env,
    latestVersionOfAutomationTemplateAddon,
    bodyToSend,
    addonName,
    addonSk?,
) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    let urlToCall;
    let headers;
    if (addonName === 'NEBULA') {
        urlToCall = '/addons/api/async/00000000-0000-0000-0000-000000006a91/tests/tests';
    } else if (addonName === 'FEBULA') {
        urlToCall = '/addons/api/async/cebb251f-1c80-4d80-b62c-442e48e678e8/tests/tests';
    } else if (addonName === 'SYNC') {
        urlToCall = '/addons/api/async/5122dc6d-745b-4f46-bb8e-bd25225d350a/tests/tests';
    } else if (addonName === 'CORE' || addonName === 'CORE-GENERIC-RESOURCES') {
        urlToCall = '/addons/api/async/fc5a5974-3b30-4430-8feb-7d5b9699bc9f/tests/tests';
    } else if (addonName === 'CONFIGURATIONS') {
        urlToCall = '/addons/api/async/84c999c3-84b7-454e-9a86-71b7abc96554/tests/tests';
    } else if (addonName === 'RELATED-ITEMS') {
        urlToCall = '/addons/api/async/4f9f10f3-cd7d-43f8-b969-5029dad9d02b/tests/tests';
    } else if (addonName === 'DATA INDEX' || addonName === 'DATA-INDEX' || addonName === 'ADAL') {
        urlToCall = '/addons/api/async/00000000-0000-0000-0000-00000e1a571c/tests/tests';
        headers = {
            'x-pepperi-ownerid': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
            'x-pepperi-secretkey': addonSk,
            Authorization: `Bearer ${service['client'].OAuthAccessToken}`,
        };
    } else if (addonName === 'UDB' || addonName === 'USER DEFINED BLOCKS') {
        urlToCall = '/addons/api/async/9abbb634-9df5-49ab-91d1-41ad7a2632a6/tests/tests';
    } else if (addonName === 'PFS' || addonName === 'PEPPERI-FILE-STORAGE') {
        urlToCall = '/addons/api/async/00000000-0000-0000-0000-0000000f11e5/tests/tests';
    } else {
        urlToCall = `/addons/api/async/02754342-e0b5-4300-b728-a94ea5e0e8f4/version/${latestVersionOfAutomationTemplateAddon}/tests/run`;
    }
    let testResponse;
    if (addonName === 'DATA INDEX' || addonName === 'DATA-INDEX' || addonName === 'ADAL') {
        testResponse = await service.fetchStatus(urlToCall, {
            body: JSON.stringify(bodyToSend),
            method: 'POST',
            headers: headers,
        });
    } else {
        testResponse = await service.fetchStatus(urlToCall, {
            body: JSON.stringify(bodyToSend),
            method: 'POST',
            headers: {
                Authorization: `Bearer ${service['client'].OAuthAccessToken}`,
            },
        });
    }

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
        return await getNebulaTests(user, 'prod');
    } else if (addonName === 'FEBULA') {
        return await getFebulaTests(user, 'prod');
    } else if (addonName === 'SYNC') {
        return await getSyncTests(user, 'prod');
    } else if (addonName === 'DATA INDEX' || addonName === 'DATA-INDEX' || addonName === 'ADAL') {
        return await getDataIndexTests(user, 'prod');
    } else if (addonName === 'CORE' || addonName === 'CORE-GENERIC-RESOURCES') {
        return await getCoreTests(user, 'prod');
    } else if (addonName === 'USER DEFINED BLOCKS' || addonName === 'UDB') {
        return await getUDBTests(user, 'prod');
    } else if (addonName === 'CONFIGURATIONS') {
        return await getConfifurationsTests(user, 'prod');
    } else if (addonName === 'RELATED-ITEMS') {
        return await getRelatedItemsTests(user, 'prod');
    } else if (addonName === 'PEPPERI-FILE-STORAGE' || 'PFS') {
        return await getPFSTests(user, 'prod');
    } else {
        const client = await initiateTester(user, 'Aa123456', env);
        const service = new GeneralService(client);
        if (addonUUID === '00000000-0000-0000-0000-00000000ada1') {
            // in case of ADAL we want to run data index dev tests
            addonUUID = '00000000-0000-0000-0000-00000e1a571c'; // data index framework UUID
        }
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

function prepareTestBody(addonName, currentTestName) {
    let body;
    if (
        addonName === 'NEBULA' ||
        addonName === 'ADAL' ||
        addonName === 'FEBULA' ||
        addonName === 'SYNC' ||
        addonName === 'DATA INDEX' ||
        addonName === 'DATA-INDEX' ||
        addonName === 'CORE' ||
        addonName === 'CORE-GENERIC-RESOURCES' ||
        addonName === 'UDB' ||
        addonName === 'CONFIGURATIONS' ||
        addonName === 'RELATED-ITEMS' ||
        addonName === 'USER DEFINED BLOCKS' ||
        addonName === 'PFS' ||
        addonName === 'PEPPERI-FILE-STORAGE'
    ) {
        body = {
            Name: currentTestName,
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
                if (!test.passed || test.failed || (test.hasOwnProperty('failure') && test.failure.length > 0)) {
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
        case 'CORE-GENERIC-RESOURCES':
        case 'CORE': {
            return true;
        }
        default:
            return false;
    }
}
