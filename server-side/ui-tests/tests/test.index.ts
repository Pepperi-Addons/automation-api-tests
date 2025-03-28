import GeneralService, {
    ConsoleColors,
    TesterFunctions,
    ResourceTypes,
    systemAddons,
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
    PricingAddonsUpsert,
    PricingConfigUpload,
    PricingUdtInsertion,
    PricingUdtCleanup,
    PricingUdcInsertion,
    PricingUdcCleanup,
    PricingCalculatedFieldsManualLineTests,
    PricingAdditionalItemGroupsReadonlyTests,
    PricingApplyUomsTests,
    PricingTotalsTests,
    PricingGlobalExclusionTests,
    PricingPartialValueTests,
    PricingMultipleValuesTests,
    PricingDeliveryDatePerformanceUdtErrorsTests,
    PricingUdcSourceTests,
    PricingPackagesTests,
    PricingProfilesTests,
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
    StorybookQueryBuilderTests,
    StorybookSmartFiltersTests,
    NeltPerformanceTests,
    ListsFormsAbiTests,
    CustomCollectionsUpsert,
    SyncResyncPerformanceTests,
    AuditDataLogAbiTests,
    ExampleTemplateToCopyTests,
    IPaasBasicUITests,
    IPaasDataflowTests,
    IPaasWebhookTests,
    HomepageTests,
    BuyerManagementTests,
} from './index';
import { ObjectsService } from '../../services/objects.service';
import { Client } from '@pepperi-addons/debug-server';
import { UIControl } from '@pepperi-addons/papi-sdk';
import { PFSTestser } from '../../api-tests/pepperi_file_service';
import { AsyncAddonGetRemoveTestser } from '../../api-tests/objects/async_addon_get_remove_codejobs';
import { DimxDataImportTestsTestser } from '../../api-tests/dimx_data_import';
import { LoginPerfTestsReload } from './login_performance_reload.test';
import { UDCTestser } from '../../api-tests/user_defined_collections';
import { maintenance3APITestser } from '../../api-tests/addons';
import { handleDevTestInstallation } from '../../tests';
import { NgxLibPOC } from './NgxLibPOC.test';
import { SchedulerTester } from '../../api-tests/code-jobs/scheduler';
import { AppTest } from '../../services/app-tests-runner.service';
import { UnistallAddonFromAllUsersTester } from '../../api-tests/uninstall_addon_from_all_auto_users';
import { FlowTests } from './flows_builder.test';
import { Import250KToAdalFromDimx } from './import_250k_DIMX.test';
import { UDCImportExportTests } from '../../api-tests/user_defined_collections_import_export';
import { Import200KToAdalFromDimx } from './import_200k_DIMX.test';
import { Import150KToAdalFromDimx } from './import_150k_DIMX.test';
import { SyncTests } from './sync.test';
import { TestDataTestsNewSync } from '../../api-tests/test-service/test_data_new_sync';
import { UDC300KTestser } from '../../api-tests/user_defined_collections_300K_overwrite';
import { ImportLimitCSVAdalFromDimx } from './import_300k_DIMX.test';
import { UDC150KOverwriteTestser } from '../../api-tests/user_defined_collections_150K_overwrite';
import { UDC100KOverwriteTestser } from '../../api-tests/user_defined_collections_100K_overwrite';
import { AsyncTester_Part2_Stop_Restart } from '../../api-tests/code-jobs/scheduler_DI_23872';
import { DevTest } from './DevTests';
import { XTimesSync } from './XTimesSyncE2E.test';
import { IdosPapiTests } from './ido_papi_tests.test';
import { AdalBigDataTestser } from '../../api-tests/adal_big_data';
import { CreateDistributorSystemTests } from './create_distributor_SYSTEM.test';
import { ConfigurationTests } from './configurations.dev.test';
import { SyncTests as SyncDevTests } from './sync.dev.test';
import { DevTestReporter } from './dev.test.repoerter';
import { SyncE2ETester } from './syncE2ETester.test';
import { TestDataTestsNewSyncNoNebula } from '../../api-tests/test-service/test_data_new_syn_no_nebula';
import { UDCLimitationTestser } from '../../api-tests/user_defined_collections_limitations_data_creator';
import { UDCTestserPermission } from '../../api-tests/user_defined_collections_buyer_permission';
import { DocDBIndexedAdalTestser } from '../../api-tests/doc_db_indexed_adal';

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
const ipaasEmail = process.env.npm_config_ipaas_email as string;
const ipaasPassword = process.env.npm_config_ipaas_pass as string;
const prcVer = process.env.npm_config_pricing_version as string;
const varPass = process.env.npm_config_var_pass as string;
const varPassEU = process.env.npm_config_var_pass_eu as string;
const varPassSB = process.env.npm_config_var_pass_sb as string;
const addon = process.env.npm_config_addon as string;
const userNameCreate = process.env.npm_config_user_name_create as string;
const passCreate = process.env.npm_config_pass_create as string;
const whichEnvToRun = process.env.npm_config_envs as string;
const whichAddonToUninstall = process.env.npm_config_which_addon as string;
const XForSyncTimes = Number(process.env.npm_config_x as any);
const acc01UUID = process.env.npm_config_acc1 as string;
const acc02UUID = process.env.npm_config_acc2 as string;
const acc03UUID = process.env.npm_config_acc3 as string;
// const neltTestParams = process.env.npm_config_nelt_test_params as string;
const burgerMenuVisitFlowName = process.env.npm_config_nelt_burger_vf_name as string;
const divisionName = process.env.npm_config_nelt_division_name as string;
const nearExpiryVisitGroupName = process.env.npm_config_nelt_expiry_vf_group as string;
const nearExpiryVisitStepName = process.env.npm_config_nelt_expiry_vf_step as string;
const orderOfReturnsVisitGroupName = process.env.npm_config_nelt_returns_vf_group as string;
const orderOfReturnsVisitStepName = process.env.npm_config_nelt_returns_vf_step as string;
const orderVisitGroupName = process.env.npm_config_nelt_order_vf_group as string;
const orderVisitStepName = process.env.npm_config_nelt_order_vf_step as string;
const surveyVisitGroupName = process.env.npm_config_nelt_survey_vf_group as string;
const surveyVisitStepName = process.env.npm_config_nelt_survey_vf_step as string;
const chooseAccountBy = process.env.npm_config_nelt_choose_account_by as 'name' | 'ID';
const orderAccountName = process.env.npm_config_nelt_order_account as string;
const originalFilterName = process.env.npm_config_nelt_original_filter as string;
const filterCategoryName = process.env.npm_config_nelt_filter as string;
const filterSubCategoryName = process.env.npm_config_nelt_sub_filter as string;
const smartFilterCategoryName = process.env.npm_config_nelt_smart_filter as string;
const bundlePromotionString = process.env.npm_config_nelt_bundle as string;
const nonBundlePromotionString = process.env.npm_config_nelt_promotion as string;
const nonPromotionItemsString = process.env.npm_config_nelt_items as string;
// const nonPromotionItemsIndices = process.env.npm_config_nelt_items_indices ? JSON.parse(process.env.npm_config_nelt_items_indices as string) as number[] : undefined;
// const nonPromotionItemsQuantities = process.env.npm_config_nelt_items_qty ? JSON.parse(process.env.npm_config_nelt_items_qty as string) as number[] : undefined;
// const bundlePromotionItemsIndices = process.env.npm_config_nelt_promotion_indices ? JSON.parse(process.env.npm_config_nelt_promotion_indices as string) as number[] : undefined;
const udcNameAge = process.env.npm_config_udc_name_age as string;
const udcIndexedNameAge = process.env.npm_config_udc_indexed_name_age as string;
const udcIndexedFields = process.env.npm_config_udc_indexed_fields as string;
const udcArrays = process.env.npm_config_udc_arrays as string;
const udcReferenceAccount = process.env.npm_config_udc_reference_account as string;
const udcAccountFilter = process.env.npm_config_udc_account_filter as string;
const udcFiltersRefAccount = process.env.npm_config_udc_filters_ref_account as string;
const udcBigDataRefAccount = process.env.npm_config_udc_big_data_ref_account as string;
const udcContainedArray = process.env.npm_config_udc_contained_array as string;

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

    let nestedGap = '';
    let startedTestSuiteTitle = '';

    generalService.PrintMemoryUseToLog('Start', tests);
    after(async function () {
        generalService.PrintMemoryUseToLog('End', tests);
    });

    beforeEach(function () {
        let isCorrectNestedGap = false;
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
        } else {
            console.log(
                `%c${nestedGap}Test End: '${this.currentTest.title}': Result: '${this.currentTest.state}'`,
                ConsoleColors.Success,
            );
        }
        if (this.currentTest.parent.tests.slice(-1)[0].title == this.currentTest.title) {
            console.log(
                `%c${nestedGap.slice(1)}Test Suite End: '${startedTestSuiteTitle}'\n`,
                ConsoleColors.SystemInformation,
            );
            nestedGap = nestedGap.slice(1);
        }
    });

    if (tests === 'Reset') {
        //Reset the needed UI Controls for the UI tests.
        await replaceUIControlsTests(this, generalService);

        //Verify all items exist or replace them
        await replaceItemsTests(generalService);

        await newlyCretedDistDependenciesTests(generalService, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Sanity') {
        await LoginTests(email, pass);
        await OrderTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'XTimesSync') {
        await XTimesSync(email, pass, client, XForSyncTimes);
        run();
        return;
    }

    if (tests === 'FlowBuilder') {
        await FlowTests(email, pass, client, {
            body: {
                varKeyStage: varPass,
                varKeyPro: varPass,
                varKeyEU: varPassEU,
            },
        });
        await TestDataTestsNewSyncNoNebula(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'UDC_limitation') {
        await UDCLimitationTestser(
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
        await TestDataTestsNewSyncNoNebula(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    // if (tests.includes('evgeny')) {
    //     await XXXTestser(generalService, {
    //         body: {
    //             varKeyStage: varPass,
    //             varKeyPro: varPass,
    //             varKeyEU: varPassEU,
    //         }
    //     }, { describe, expect, it } as TesterFunctions); //
    //     await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    // }

    if (tests === 'UDCImportExport') {
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
        run();
        return;
    }

    //->

    if (tests === 'UDC300KOverwrite') {
        await UDC300KTestser(
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
        run();
        return;
    }

    if (tests === 'UDC150KOverwrite') {
        await UDC150KOverwriteTestser(
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
        run();
        return;
    }

    if (tests === 'UDC100KOverwrite') {
        await UDC100KOverwriteTestser(
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
        run();
        return;
    }

    if (tests === 'Dimx300KUpload') {
        await ImportLimitCSVAdalFromDimx(client, {
            body: {
                varKeyStage: varPass,
                varKeyPro: varPass,
                varKeyEU: varPassEU,
            },
        }); //
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Dimx250KUpload') {
        await Import250KToAdalFromDimx(client, {
            body: {
                varKeyStage: varPass,
                varKeyPro: varPass,
                varKeyEU: varPassEU,
            },
        }); //
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Dimx200KUpload') {
        await Import200KToAdalFromDimx(client, {
            body: {
                varKeyStage: varPass,
                varKeyPro: varPass,
                varKeyEU: varPassEU,
            },
        }); //
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Dimx150KUpload') {
        await Import150KToAdalFromDimx(client, {
            body: {
                varKeyStage: varPass,
                varKeyPro: varPass,
                varKeyEU: varPassEU,
            },
        }); //
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Scheduler') {
        await SchedulerTester(
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
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions, undefined, true);
        run();
        return;
    }

    if (tests === 'Workflow') {
        await WorkflowTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'DeepLink') {
        await DeepLinkTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Promotion') {
        await PromotionTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Security') {
        await SecurityPolicyTests(email, pass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Create') {
        // debugger;
        if (userNameCreate && passCreate) {
            await CreateDistributorTests(generalService, varPass, varPassEU, userNameCreate, passCreate);
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        } else {
            await CreateDistributorTests(generalService, varPass, varPassEU);
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        }
        run();
        return;
    }

    if (tests === 'Create_SYSTEM') {
        await CreateDistributorSystemTests(generalService, varPass, varPassEU, userNameCreate, passCreate);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'UdcsToUser') {
        await CustomCollectionsUpsert(
            email,
            client,
            acc01UUID,
            acc02UUID,
            acc03UUID,
            udcNameAge,
            udcIndexedNameAge,
            udcIndexedFields,
            udcArrays,
            udcReferenceAccount,
            udcAccountFilter,
            udcFiltersRefAccount,
            udcBigDataRefAccount,
            udcContainedArray,
        );
        run();
        return;
    }

    if (tests === 'Uom') {
        await UomTests(email, pass, varPass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'CloseCatalog') {
        await CloseCatalogTest(email, pass, varPass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PageBuilder') {
        await PageBuilderTests(email, pass, varPass, generalService);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'DataPrepRL') {
        await RLdataPrep(varPass, client);
        run();
        return;
    }

    if (tests === 'DataPrepVF') {
        await VFdataPrep(varPass, client);
        run();
        return;
    }

    if (tests === 'ResourceList') {
        // await RLdataPrep(client);
        await ResourceListTests(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'AbiRL') {
        await ResourceListAbiTests(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'ListsAbi') {
        await ListsFormsAbiTests(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'VisitFlow') {
        // await VFdataPrep(varPass, client);
        await VisitFlowTests(varPass, client, email, pass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'SyncPerformance') {
        await SyncResyncPerformanceTests(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'AuditLog') {
        await AuditDataLogAbiTests(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'BuyerManagement') {
        await BuyerManagementTests(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Homepage') {
        await HomepageTests(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Example') {
        await ExampleTemplateToCopyTests(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingSet') {
        await PricingUdtCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingConfigUpload(client, email, pass);
        await PricingUdtInsertion(client, email, pass, '1.0');
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingCleanUdt') {
        await PricingUdtCleanup(client);
        run();
        return;
    }

    if (tests === 'PricingUploadConfig') {
        await PricingConfigUpload(client, email, pass);
        run();
        return;
    }

    if (tests === 'PricingUploadConfigNoUom') {
        await PricingConfigUpload(client, email, pass, 'noUom');
        run();
        return;
    }

    if (tests === 'Pricing') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingConfigUpload(client, email, pass);
        await PricingUdtInsertion(client, email, pass, '0.5'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
        await PricingCalculatedFieldsManualLineTests(email, pass, client);
        await PricingAdditionalItemGroupsReadonlyTests(email, pass, client);
        await PricingUdtInsertion(client, email, pass, '0.6'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
        await PricingApplyUomsTests(email, pass, client);
        await PricingTotalsTests(email, pass, client);
        await PricingGlobalExclusionTests(email, pass, client);
        await PricingPartialValueTests(email, pass, client);
        await PricingMultipleValuesTests(email, pass, client);
        await PricingUdtInsertion(client, email, pass, '0.7'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
        await PricingDeliveryDatePerformanceUdtErrorsTests(email, pass, client);
        await PricingUdcInsertion(client, '0.8', ['PricingTest1', 'PricingTest2']);
        await PricingUdtInsertion(client, email, pass, '0.8'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
        await PricingConfigUpload(client, email, pass);
        await PricingUdcSourceTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingNoUom') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        // NO UOM belongs to version 0.8
        const installedPricingVersion = (await generalService.getInstalledAddons()).find(
            (addon) => addon.Addon.Name == 'Pricing',
        )?.Version;
        if (
            !installedPricingVersion?.startsWith('0.5') &&
            !installedPricingVersion?.startsWith('0.6') &&
            !installedPricingVersion?.startsWith('0.7')
        ) {
            await PricingConfigUpload(client, email, pass, 'noUom');
            await PricingUdtInsertion(client, email, pass, '0.5', 'noUom'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
            await PricingCalculatedFieldsManualLineTests(email, pass, client, 'noUom');
            await PricingAdditionalItemGroupsReadonlyTests(email, pass, client, 'noUom');
            await PricingUdtInsertion(client, email, pass, '0.6', 'noUom'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
            await PricingTotalsTests(email, pass, client, 'noUom');
            await PricingGlobalExclusionTests(email, pass, client, 'noUom');
            await PricingPartialValueTests(email, pass, client, 'noUom');
            await PricingMultipleValuesTests(email, pass, client, 'noUom');
            await PricingUdtInsertion(client, email, pass, '0.7', 'noUom'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
            await PricingDeliveryDatePerformanceUdtErrorsTests(email, pass, client, 'noUom');
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
            run();
            return;
        }
    }

    if (tests === 'Pricing05Features') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingConfigUpload(client, email, pass);
        await PricingUdtInsertion(client, email, pass, '0.5'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
        await PricingCalculatedFieldsManualLineTests(email, pass, client);
        // await PricingAdditionalItemGroupsReadonlyTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingFeatures05') {
        // Jenkins cannot run all the features together
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingConfigUpload(client, email, pass);
        await PricingUdtInsertion(client, email, pass, '0.5'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
        // await PricingCalculatedFieldsManualLineTests(email, pass, client);
        await PricingAdditionalItemGroupsReadonlyTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Pricing06Features') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingConfigUpload(client, email, pass);
        await PricingUdtInsertion(client, email, pass, '0.6'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
        await PricingApplyUomsTests(email, pass, client);
        await PricingTotalsTests(email, pass, client);
        await PricingGlobalExclusionTests(email, pass, client);
        // await PricingPartialValueTests(email, pass, client);
        // await PricingMultipleValuesTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingFeatures06') {
        // Jenkins cannot run all 5 features together
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingConfigUpload(client, email, pass);
        await PricingUdtInsertion(client, email, pass, '0.6'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
        await PricingPartialValueTests(email, pass, client);
        await PricingMultipleValuesTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Pricing07Features') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingConfigUpload(client, email, pass);
        await PricingUdtInsertion(client, email, pass, '0.7'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
        await PricingDeliveryDatePerformanceUdtErrorsTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Pricing08Features') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingUdcInsertion(client, '0.8', ['PricingTest1', 'PricingTest2']);
        await PricingUdtInsertion(client, email, pass, '0.8'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
        await PricingConfigUpload(client, email, pass);
        await PricingUdcSourceTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Pricing1Features') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingUdcInsertion(client, '1.0', ['PricingTest1', 'PricingTest2']);
        await PricingUdtInsertion(client, email, pass, '1.0'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
        await PricingConfigUpload(client, email, pass);
        await PricingProfilesTests(email, pass, client); // not ready yet JUNE 2024
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Pricing05FeaturesNoUom') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        // NO UOM belongs to version 0.8
        const installedPricingVersion = (await generalService.getInstalledAddons()).find(
            (addon) => addon.Addon.Name == 'Pricing',
        )?.Version;
        if (
            !installedPricingVersion?.startsWith('0.5') &&
            !installedPricingVersion?.startsWith('0.6') &&
            !installedPricingVersion?.startsWith('0.7')
        ) {
            await PricingConfigUpload(client, email, pass, 'noUom');
            await PricingUdtInsertion(client, email, pass, '0.5', 'noUom'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
            await PricingCalculatedFieldsManualLineTests(email, pass, client, 'noUom');
            await PricingAdditionalItemGroupsReadonlyTests(email, pass, client, 'noUom');
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
            run();
            return;
        }
    }

    if (tests === 'Pricing06FeaturesNoUom') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        // NO UOM belongs to version 0.8
        const installedPricingVersion = (await generalService.getInstalledAddons()).find(
            (addon) => addon.Addon.Name == 'Pricing',
        )?.Version;
        if (
            !installedPricingVersion?.startsWith('0.5') &&
            !installedPricingVersion?.startsWith('0.6') &&
            !installedPricingVersion?.startsWith('0.7')
        ) {
            await PricingConfigUpload(client, email, pass, 'noUom');
            await PricingUdtInsertion(client, email, pass, '0.6', 'noUom'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
            // await PricingTotalsTests(email, pass, client, 'noUom');
            await PricingGlobalExclusionTests(email, pass, client, 'noUom');
            await PricingPartialValueTests(email, pass, client, 'noUom');
            await PricingMultipleValuesTests(email, pass, client, 'noUom');
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
            run();
            return;
        }
    }

    if (tests === 'Pricing07FeaturesNoUom') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        // NO UOM belongs to version 0.8
        const installedPricingVersion = (await generalService.getInstalledAddons()).find(
            (addon) => addon.Addon.Name == 'Pricing',
        )?.Version;
        if (
            !installedPricingVersion?.startsWith('0.5') &&
            !installedPricingVersion?.startsWith('0.6') &&
            !installedPricingVersion?.startsWith('0.7')
        ) {
            await PricingConfigUpload(client, email, pass, 'noUom');
            await PricingUdtInsertion(client, email, pass, '0.6', 'noUom'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
            await PricingTotalsTests(email, pass, client, 'noUom');
            await PricingUdtInsertion(client, email, pass, '0.7', 'noUom'); // the argument 0.5|0.6|0.7 refers to the version from which the features originate, not to the installed version!
            await PricingDeliveryDatePerformanceUdtErrorsTests(email, pass, client, 'noUom');
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
            run();
            return;
        }
    }

    if (tests === 'Pricing07with05data') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, '0.7.%');
        await PricingUdtInsertion(client, email, pass, '0.5', 'version07for05data');
        await PricingConfigUpload(client, email, pass, 'version07for05data');
        await PricingCalculatedFieldsManualLineTests(email, pass, client, 'version07for05data');
        await PricingAdditionalItemGroupsReadonlyTests(email, pass, client, 'version07for05data');
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingBase') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingUdtInsertion(client, email, pass, '0.5');
        await PricingConfigUpload(client, email, pass);
        await PricingCalculatedFieldsManualLineTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingAdditional') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingUdtInsertion(client, email, pass, '0.5');
        await PricingConfigUpload(client, email, pass);
        await PricingAdditionalItemGroupsReadonlyTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingUom') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingUdtInsertion(client, email, pass, '0.6');
        await PricingConfigUpload(client, email, pass);
        await PricingApplyUomsTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingTotals') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingUdtInsertion(client, email, pass, '0.6');
        await PricingConfigUpload(client, email, pass);
        await PricingTotalsTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingMulti') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingUdtInsertion(client, email, pass, '0.6');
        await PricingConfigUpload(client, email, pass);
        await PricingMultipleValuesTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingPartial') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingUdtInsertion(client, email, pass, '0.6');
        await PricingConfigUpload(client, email, pass);
        await PricingPartialValueTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingExclusion') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingUdtInsertion(client, email, pass, '0.6');
        await PricingConfigUpload(client, email, pass);
        await PricingGlobalExclusionTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingDeliveryDate') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingUdtInsertion(client, email, pass, '0.7');
        await PricingConfigUpload(client, email, pass);
        await PricingDeliveryDatePerformanceUdtErrorsTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingUDC') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingUdtInsertion(client, email, pass, '0.8');
        await PricingUdcInsertion(client, '0.8', ['PricingTest1', 'PricingTest2']);
        await PricingConfigUpload(client, email, pass);
        await PricingUdcSourceTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'PricingTotalsNoUom') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        // NO UOM belongs to version 0.8
        const installedPricingVersion = (await generalService.getInstalledAddons()).find(
            (addon) => addon.Addon.Name == 'Pricing',
        )?.Version;
        if (
            !installedPricingVersion?.startsWith('0.5') &&
            !installedPricingVersion?.startsWith('0.6') &&
            !installedPricingVersion?.startsWith('0.7')
        ) {
            await PricingUdtInsertion(client, email, pass, '0.6', 'noUom');
            await PricingConfigUpload(client, email, pass, 'noUom');
            await PricingTotalsTests(email, pass, client, 'noUom');
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
            run();
            return;
        }
    }

    if (tests === 'PricingMultiNoUom') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        // NO UOM belongs to version 0.8
        const installedPricingVersion = (await generalService.getInstalledAddons()).find(
            (addon) => addon.Addon.Name == 'Pricing',
        )?.Version;
        if (
            !installedPricingVersion?.startsWith('0.5') &&
            !installedPricingVersion?.startsWith('0.6') &&
            !installedPricingVersion?.startsWith('0.7')
        ) {
            await PricingUdtInsertion(client, email, pass, '0.6', 'noUom');
            await PricingConfigUpload(client, email, pass, 'noUom');
            await PricingMultipleValuesTests(email, pass, client, 'noUom');
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
            run();
            return;
        }
    }

    if (tests === 'PricingPartialNoUom') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        // NO UOM belongs to version 0.8
        const installedPricingVersion = (await generalService.getInstalledAddons()).find(
            (addon) => addon.Addon.Name == 'Pricing',
        )?.Version;
        if (
            !installedPricingVersion?.startsWith('0.5') &&
            !installedPricingVersion?.startsWith('0.6') &&
            !installedPricingVersion?.startsWith('0.7')
        ) {
            await PricingUdtInsertion(client, email, pass, '0.6', 'noUom');
            await PricingConfigUpload(client, email, pass, 'noUom');
            await PricingPartialValueTests(email, pass, client, 'noUom');
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
            run();
            return;
        }
    }

    if (tests === 'PricingExclusionNoUom') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        // NO UOM belongs to version 0.8
        const installedPricingVersion = (await generalService.getInstalledAddons()).find(
            (addon) => addon.Addon.Name == 'Pricing',
        )?.Version;
        if (
            !installedPricingVersion?.startsWith('0.5') &&
            !installedPricingVersion?.startsWith('0.6') &&
            !installedPricingVersion?.startsWith('0.7')
        ) {
            await PricingUdtInsertion(client, email, pass, '0.6', 'noUom');
            await PricingConfigUpload(client, email, pass, 'noUom');
            await PricingGlobalExclusionTests(email, pass, client, 'noUom');
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
            run();
            return;
        }
    }

    if (tests === 'PricingDeliveryDateNoUom') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        // NO UOM belongs to version 0.8
        const installedPricingVersion = (await generalService.getInstalledAddons()).find(
            (addon) => addon.Addon.Name == 'Pricing',
        )?.Version;
        if (
            !installedPricingVersion?.startsWith('0.5') &&
            !installedPricingVersion?.startsWith('0.6') &&
            !installedPricingVersion?.startsWith('0.7')
        ) {
            await PricingUdtInsertion(client, email, pass, '0.7', 'noUom');
            await PricingConfigUpload(client, email, pass, 'noUom');
            await PricingDeliveryDatePerformanceUdtErrorsTests(email, pass, client, 'noUom');
            await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
            run();
            return;
        }
    }

    if (tests === 'PricingPackages') {
        await PricingUdtCleanup(client);
        await PricingUdcCleanup(client);
        await PricingAddonsUpsert(varPass, client, prcVer);
        await PricingUdtInsertion(client, email, pass, '1.0');
        await PricingConfigUpload(client, email, pass, 'packages');
        await PricingPackagesTests(email, pass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'IpaasUI') {
        await IPaasBasicUITests(ipaasEmail, ipaasPassword);
        run();
        return;
    }

    if (tests === 'IpaasDataflow') {
        await IPaasDataflowTests(ipaasEmail, ipaasPassword);
        run();
        return;
    }

    if (tests === 'IpaasWebhook') {
        await IPaasWebhookTests(ipaasEmail, ipaasPassword);
        run();
        return;
    }

    if (tests === 'StorybookAttachment') {
        await StorybookAttachmentTests();
        run();
        return;
    }

    if (tests === 'StorybookButton') {
        await StorybookButtonTests();
        run();
        return;
    }

    if (tests === 'StorybookCheckbox') {
        await StorybookCheckboxTests();
        run();
        return;
    }

    if (tests === 'StorybookChips') {
        await StorybookChipsTests();
        run();
        return;
    }

    if (tests === 'StorybookColorPicker') {
        await StorybookColorPickerTests();
        run();
        return;
    }

    if (tests === 'StorybookDateTime') {
        await StorybookDateTimeTests();
        run();
        return;
    }

    if (tests === 'StorybookDraggableItems') {
        await StorybookDraggableItemsTests();
        run();
        return;
    }

    if (tests === 'StorybookGroupButtons') {
        await StorybookGroupButtonsTests();
        run();
        return;
    }

    if (tests === 'StorybookIcon') {
        await StorybookIconTests();
        run();
        return;
    }

    if (tests === 'StorybookImageFilmstrip') {
        await StorybookImageFilmstripTests();
        run();
        return;
    }

    if (tests === 'StorybookImage') {
        await StorybookImageTests();
        run();
        return;
    }

    if (tests === 'StorybookLink') {
        await StorybookLinkTests();
        run();
        return;
    }

    if (tests === 'StorybookMenu') {
        await StorybookMenuTests();
        run();
        return;
    }

    if (tests === 'StorybookQuantitySelector') {
        await StorybookQuantitySelectorTests();
        run();
        return;
    }

    if (tests === 'StorybookRichHtmlTextarea') {
        await StorybookRichHtmlTextareaTests();
        run();
        return;
    }

    if (tests === 'StorybookSearch') {
        await StorybookSearchTests();
        run();
        return;
    }

    if (tests === 'StorybookSelect') {
        await StorybookSelectTests();
        run();
        return;
    }

    if (tests === 'StorybookSelectPanel') {
        await StorybookSelectPanelTests();
        run();
        return;
    }

    if (tests === 'StorybookSeparator') {
        await StorybookSeparatorTests();
        run();
        return;
    }

    if (tests === 'StorybookSignature') {
        await StorybookSignatureTests();
        run();
        return;
    }

    if (tests === 'StorybookSkeletonLoader') {
        await StorybookSkeletonLoaderTests();
        run();
        return;
    }

    if (tests === 'StorybookSlider') {
        await StorybookSliderTests();
        run();
        return;
    }

    if (tests === 'StorybookTextarea') {
        await StorybookTextareaTests();
        run();
        return;
    }

    if (tests === 'StorybookTextbox') {
        await StorybookTextboxTests();
        run();
        return;
    }

    if (tests === 'StorybookQueryBuilder') {
        await StorybookQueryBuilderTests();
        run();
        return;
    }

    if (tests === 'StorybookSmartFilters') {
        await StorybookSmartFiltersTests();
        run();
        return;
    }

    if (tests === 'NeltPerformance') {
        // await NeltPerformanceTests(email, pass);
        await NeltPerformanceTests(
            email,
            pass,
            client,
            burgerMenuVisitFlowName,
            divisionName,
            nearExpiryVisitGroupName,
            nearExpiryVisitStepName,
            orderOfReturnsVisitGroupName,
            orderOfReturnsVisitStepName,
            orderVisitGroupName,
            orderVisitStepName,
            surveyVisitGroupName,
            surveyVisitStepName,
            chooseAccountBy,
            orderAccountName,
            originalFilterName,
            filterCategoryName,
            filterSubCategoryName,
            smartFilterCategoryName,
            bundlePromotionString,
            nonBundlePromotionString,
            nonPromotionItemsString,
            // nonPromotionItemsIndices,
            // nonPromotionItemsQuantities,
            // nonBundlePromotionItemsIndices,
        );
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions, {
            IsAllAddons: false,
            IsUUID: false,
        });
        run();
        return;
    }

    if (tests === 'MockTest') {
        await MockTest(email, pass, client);
        // await ResourceListTests(email, pass, varPass, client);
        run();
        return;
    }

    if (tests === 'DocDBIndexedAdal') {
        await DocDBIndexedAdalTestser(
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
        run();
        return;
    }

    if (tests === 'InstallationsTest') {
        await InstallationsTest(varPass, client);
        run();
        return;
    }

    if (tests === 'Distributor') {
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
        run();
        return;
    }

    if (tests === 'DimxAPI') {
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
        run();
        return;
    }

    if (tests === 'PfsAPI') {
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
        run();
        return;
    }

    if (tests === 'ApiUDC') {
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
        run();
        return;
    }

    if (tests === 'PermissionsApiUDC') {
        await UDCTestserPermission(
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
        run();
        return;
    }

    if (tests === 'maintenance3API') {
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
        run();
        return;
    }

    if (tests === 'AsyncAddonGetRemoveCodeJobsCLI') {
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
        run();
        return;
    }

    if (tests === 'StopRestart_Async') {
        await AsyncTester_Part2_Stop_Restart(
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
        run();
        return;
    }

    if (tests === 'DimxDataImport') {
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
        run();
        return;
    }

    if (tests === 'DimxPerformance') {
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
        run();
        return;
    }

    if (tests === 'DimxReference') {
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
        run();
        return;
    }

    if (tests === 'UdcUI') {
        await UDCTests(email, pass, varPass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }
    if (tests === 'SyncE2ETester') {
        await SyncE2ETester(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }
    if (tests === 'IdoPapi') {
        await IdosPapiTests(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }
    if (tests === 'DevTest_Configuration') {
        await ConfigurationTests(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }
    if (tests === 'DevTest_Sync') {
        await SyncDevTests(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }
    if (tests === 'DevTest_Reporter') {
        await DevTestReporter(email, pass, client, varPass);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }
    if (tests === 'SyncE2E') {
        await SyncTests(email, pass, client, varPass);
        await TestDataTestsNewSync(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }

    if (tests === 'Survey') {
        await SurveyTests(email, pass, client, varPass); //
        await TestDataTestsNewSync(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }
    if (tests === 'NGX_POC') {
        await NgxLibPOC(); // all is needed is the client for general service as were not using an actual pepperi user
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }
    if (tests === 'login_performance') {
        await LoginPerfTests(email, pass, varPass, client, varPassEU);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }
    if (tests === 'uninstall_addon_from_all_auto_users') {
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
        run();
        return;
    }
    if (tests === 'login_perf_sqlite') {
        await LoginPerfSqlitefTests(email, pass, varPass, client);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }
    if (tests === 'login_perf_reload') {
        await LoginPerfTestsReload(email, pass, varPass, client, varPassEU);
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
        run();
        return;
    }
    if (tests === 'aws_logs') {
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
        run();
    }
    if (tests === 'big_data_adal') {
        await AdalBigDataTestser(
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
        run();
        return;
    }

    if (tests === 'second_part_adal_cli') {
        console.log('\n################ RUNNING UPGRADE DEP. OF FIRST TEST OUT OF 2: Adal Big Data ################\n');
        await AdalBigDataTestser(
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
        console.log(
            '\n################ RUNNING UPGRADE DEP. OF SECOND TEST OUT OF 2: Doc DB Indexed Adal ################\n',
        );
        await DocDBIndexedAdalTestser(
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
        run();
        return;
    }
    ///////////////////////~~~CI/CD Flow~~~///////////////////////////////////
    //****EVGENY: this code (VVV**DOWN-HERE**VVV) is ****temporary**** !!!!!! ---> once we will realize how nebula should work - with neptune or neo4J this will become redundant and nebula will run as any-other addon
    if (tests === 'Jenkins_Neptune') {
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
        const service = new GeneralService(client);
        const addonName = addon.toUpperCase();
        const failedSuitesSB: any[] = [];
        let testsList: string[] = [];
        const addonUUID = generalService.convertNameToUUIDForDevTests(addonName);
        if (addonUUID === 'none') {
            console.log('No Dev Test For This Addon - Proceeding To Run Approvment');
        } else {
            const [sbUser] = resolveUserPerTestNeptune(addonName); //
            console.log(
                `####################### Running For: ${addonName}(${addonUUID}) - NEPTUNE #######################`,
            );
            // 1. install all dependencys latest available versions on testing user + template addon latest available version
            let latestVersionOfTestedAddonSb;
            try {
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
                    latestVersionOfTestedAddonSb,
                    errorString,
                    service,
                );
                throw new Error(errorString);
            }
            console.log(
                `####################### Running For: ${addonName}(${addonUUID}) - NEPTUNE, version: ${latestVersionOfTestedAddonSb} #######################`,
            );
            debugger;
            await reportBuildStarted(addonName, addonUUID, latestVersionOfTestedAddonSb, generalService);
            // debugger;
            try {
                await Promise.all([
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
                    latestVersionOfTestedAddonSb,
                    errorString,
                    service,
                );
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }
            console.log(
                `####################### ${addonName} Version: ${latestVersionOfTestedAddonSb} #######################`,
            );

            debugger;
            const isInstalled = await Promise.all([
                validateLatestVersionOfAddonIsInstalled(sbUser, addonUUID, latestVersionOfTestedAddonSb, 'stage'),
            ]);
            const devPassingEnvs: any[] = [];
            const devFailedEnvs: any[] = [];
            for (let index = 0; index < isInstalled.length; index++) {
                const isTestedAddonInstalled = isInstalled[index];
                if (isTestedAddonInstalled === false) {
                    throw new Error(
                        `Error: didn't install ${addonName} - ${addonUUID}, version: ${latestVersionOfTestedAddonSb}`,
                    );
                }
            }
            debugger;
            // debugger;
            //3.1 get test names
            try {
                testsList = await getTestNames(addonName, sbUser, 'stage');
            } catch (error) {
                debugger;
                const errorString = `Error: got exception trying to get test Names: ${(error as any).message}`;
                await reportToTeamsMessageNeptune(
                    addonName,
                    addonUUID,
                    latestVersionOfTestedAddonSb,
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
                const [devTestResponseSb] = await Promise.all([
                    //devTestResponseEu,
                    runDevTestOnCertainEnv(sbUser, 'stage', body, addonName, addonSk),
                ]);
                if (devTestResponseSb === undefined) {
                    const whichEnvs = devTestResponseSb === undefined ? 'SB' : '';
                    const errorString = `Error: got undefined when trying to run ${whichEnvs} tests - no EXECUTION UUID!`;
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonSb,
                        errorString,
                        service,
                    );
                    throw new Error(`${errorString}`);
                }
                if (devTestResponseSb.Body.URI === undefined) {
                    const whichEnvs = devTestResponseSb.Body.URI === undefined ? 'SB' : '';
                    const errorString = `Error: got undefined when trying to run ${whichEnvs} tests - no EXECUTION UUID!`;
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonSb,
                        errorString,
                        service,
                    );
                    throw new Error(`${errorString}`);
                }
                //4.2. poll audit log response for each env
                console.log(
                    `####################### ${currentTestName}: EXECUTION UUIDS:\nSB - ${devTestResponseSb.Body.URI}`,
                );
                const testObject = {
                    name: currentTestName,
                    sbExecution: devTestResponseSb.Body.URI,
                };
                generalService.sleep(1000 * 15);
                // debugger;
                const devTestResultsSb = await getTestResponseFromAuditLog(sbUser, 'stage', devTestResponseSb.Body.URI);
                if (
                    devTestResultsSb.AuditInfo.hasOwnProperty('ErrorMessage') &&
                    devTestResultsSb.AuditInfo.ErrorMessage.includes('Task timed out after')
                ) {
                    debugger;
                    let errorString = '';
                    if (
                        devTestResultsSb.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        devTestResultsSb.AuditInfo.ErrorMessage.includes('Task timed out after')
                    ) {
                        errorString += `${sbUser} got the error: ${devTestResultsSb.AuditInfo.ErrorMessage} from Audit Log, On Test:${currentTestName}, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                    }
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonSb,
                        errorString,
                        service,
                    );
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                debugger;
                //4.3. parse the response
                let testResultArraySB;
                try {
                    testResultArraySB = JSON.parse(devTestResultsSb.AuditInfo.ResultObject);
                } catch (error) {
                    debugger;
                    let errorString = '';
                    if (!devTestResultsSb.AuditInfo.ResultObject) {
                        errorString += `${sbUser} got the error: ${devTestResultsSb.AuditInfo.ErrorMessage} from Audit Log, On Test ${currentTestName}, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                    }
                    await reportToTeamsMessage(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonSb,
                        errorString,
                        service,
                    );
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                // debugger;
                // debugger;
                //4.4. print results to log
                //4.5. print the results
                let objectToPrintSB;
                let shouldAlsoPrintVer = false;
                if (testResultArraySB.results === undefined && testResultArraySB.tests === undefined) {
                    const errorString = `Cannot Parse Result Object, Recieved: ,SB: ${JSON.stringify(
                        testResultArraySB,
                    )}, On: ${currentTestName} Test`;
                    debugger;
                    await reportToTeamsMessageNeptune(
                        addonName,
                        addonUUID,
                        latestVersionOfTestedAddonSb,
                        errorString,
                        service,
                    );
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                if (
                    testResultArraySB.results &&
                    testResultArraySB.results[0].suites[0].suites &&
                    testResultArraySB.results[0].suites[0].suites.length > 0
                ) {
                    shouldAlsoPrintVer = true;
                    objectToPrintSB = testResultArraySB.results[0].suites[0].suites;
                } else if (testResultArraySB.results) {
                    //add an if to catch the other result config also
                    objectToPrintSB = testResultArraySB.results[0].suites;
                } else {
                    objectToPrintSB = testResultArraySB.tests;
                }
                if (objectToPrintSB === undefined) {
                    debugger;
                    let errorString = '';
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
                        latestVersionOfTestedAddonSb,
                        errorString,
                        service,
                    );
                    throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                }
                for (let index = 0; index < objectToPrintSB.length; index++) {
                    const result = objectToPrintSB[index];
                    console.log(`\n***${currentTestName} SB result object: ${JSON.stringify(result)}***\n`);
                }
                const sbResults = await printResultsTestObject(
                    objectToPrintSB,
                    sbUser,
                    'stage',
                    addonUUID,
                    latestVersionOfTestedAddonSb,
                );
                if (shouldAlsoPrintVer) {
                    objectToPrintSB = testResultArraySB.results[0].suites[1].suites;
                    await printResultsTestObject(
                        objectToPrintSB,
                        sbUser,
                        'stage',
                        addonUUID,
                        latestVersionOfTestedAddonSb,
                    );
                }
                // debugger;
                //4.6. create the array of passing / failing tests
                // debugger;
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
                latestVersionOfTestedAddonSb,
                devPassingEnvs2,
                devFailedEnvs2,
                true,
                [sbUser],
                failedSuitesSB,
                jenkinsLink,
            );
            console.log('Dev Test Didnt Pass - No Point In Running Approvment');
        }
        run();
        return;
    }
    //****EVGENY: this is the actual CI/CD code for most addons ||| Nebula will be 'merged' here once it'll run as other addons
    if (tests === 'Remote_Jenkins_Handler') {
        let isLocal = true;
        //For local run that run on Jenkins this is needed since Jenkins dont inject SK to the test execution folder
        if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
            generalService['client'].AddonSecretKey = await generalService.getSecretKey(
                generalService['client'].AddonUUID,
                varPass,
            );
            isLocal = false;
        }
        const addonName = addon.toUpperCase(); // this will be used across the whole CI/CD flow (Dev & App. tests)
        ///////////////////////DEV TESTS///////////////////////////////////
        // // 1.VAR credentials for all envs - used for addon installations
        const base64VARCredentialsProd = Buffer.from(varPass).toString('base64');
        const base64VARCredentialsEU = Buffer.from(varPassEU).toString('base64');
        const base64VARCredentialsSB = Buffer.from(varPassSB).toString('base64');
        const service = new GeneralService(client);
        const initialAddonUUID = DevTest.convertAddonNameToUUIDForDevTests(addonName);
        let versionOfAddon = '';
        if (initialAddonUUID === '5122dc6d-745b-4f46-bb8e-bd25225d350a') {
            versionOfAddon = (
                await service.getAddonsLatestAvailableVersion('5122dc6d-745b-4f46-bb8e-bd25225d350a', varPass)
            ).latestVersion;
        }
        if (initialAddonUUID === '00000000-0000-0000-0000-0000000f11e5') {
            versionOfAddon = (
                await service.getAddonsLatestAvailableVersion('00000000-0000-0000-0000-0000000f11e5', varPass)
            ).latestVersion;
        }
        const devTest = new DevTest(
            addonName,
            varPass,
            varPassEU,
            varPassSB,
            generalService,
            email,
            pass,
            versionOfAddon,
        ); // adding new addons tests should be done using this 'DevTest' class
        let testsList: any;
        if (devTest.addonUUID === 'none') {
            //if we cant find the addon uuid - it means we dont have *DEV* tests for it (might have approvement)
            debugger;
            console.log('No Dev Test For This Addon - Proceeding To Run Approvment');
        } else {
            console.log(
                `####################### Running For: ${devTest.addonName} - (${devTest.addonUUID}) #######################`,
            );
            debugger;
            //2. validate latest available version of tested addon is equal between envs - if not: dont run
            await devTest.validateAllVersionsAreEqualBetweenEnvs();
            console.log(
                `####################### Running For: ${devTest.addonName} - (${devTest.addonUUID}), version: ${devTest.addonVersion} #######################`,
            );
            //this reports to QA build tracker in Teams [https://teams.microsoft.com/l/channel/19%3ac553a2dddecb497499e4df6fc1cf25af%40thread.tacv2/QA%2520Build%2520Tracker?groupId=84e28b5e-1f7f-4e05-820f-9728916558b2&tenantId=2f2b54b7-0141-4ba7-8fcd-ab7d17a60547]
            await reportBuildStarted(devTest.addonName, devTest.addonUUID, devTest.addonVersion, generalService);
            debugger;
            // 3. install all dependencys of tested addon latest available version on testing users then finaly install tested addon
            await devTest.installTestedAddonsDependencies();
            await devTest.valdateTestedAddonLatestAvaliVersionIsInstalled();
            console.log(
                `####################### Finished Installing: ${devTest.addonName} - (${devTest.addonUUID}), version: ${
                    devTest.addonVersion
                }, On: ${devTest.euUser.email}, ${await devTest.prodUser.email}, ${await devTest.sbUser
                    .email} #######################`,
            );
            debugger;
            //3.1 get test names by calling tested addon
            console.log(
                `####################### Calling GET:/tests/tests Of ${devTest.addonName} - (${devTest.addonUUID}) To Get All Test Names #######################`,
            );
            try {
                testsList = await devTest.getDevTestNames();
            } catch (error) {
                debugger;
                const errorString = `Error: Got Exception Trying To Get Test Names By Calling /tests/tests On: ${
                    devTest.addonName
                }, Version: ${devTest.addonVersion}, Error:\n ${(error as any).message}`;
                await reportToTeamsMessage(
                    devTest.addonName,
                    devTest.addonUUID,
                    devTest.addonVersion,
                    errorString,
                    service,
                );
                await devTest.unavailableVersion();
                throw new Error(`Error: got exception trying to get test Names: ${(error as any).message} `);
            }
            let numOfTests = 0;
            if (devTest.addonUUID === '00000000-0000-0000-0000-00000000ada1') {
                numOfTests = testsList.ADAL.length + testsList.DataIndex.length;
            } else {
                numOfTests = testsList.length;
            }
            console.log(`####################### Got ${numOfTests} Tests #######################`);
            console.log(`Array Of Tests:`);
            if (devTest.addonUUID === '00000000-0000-0000-0000-00000000ada1') {
                console.log(`Array Of Tests ADAL Tests: [${testsList.ADAL}]`);
                console.log(`Array Of Tests Data Index Tests: [${testsList.DataIndex}]`);
            } else {
                console.log(`[${testsList}]`);
            }
            debugger;
            //4. iterate on all test names and call each
            await devTest.runDevTest(testsList);
            //5. parse the response we got from the tests, print & report to Teams
            const didPass = await devTest.parseReportResults(isLocal, numOfTests);
            //6. no point in running app. tests after dev failed
            if (didPass !== undefined && didPass === false) {
                console.log(
                    `####################### **DEV** Tests For ${devTest.addonName} - (${devTest.addonUUID}), Version: ${devTest.addonVersion} DIDNT PASS SO WE EXIT THIS FLOW - No Point In Running Approvement #######################`,
                );
                return;
            }
        }
        ///////////////////////APPROVMENT TESTS///////////////////////////////////
        // global ugly variable
        let JenkinsBuildResultsAllEnvsEx: string[][] = [[]];
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

        let addonUUID: string;
        console.log(`####################### Approvment Tests For ${addonName} #######################`);
        const jenkinsBuildUserCred = await generalService.getSecretfromKMS(email, pass, 'JenkinsBuildUserCred');
        const appTestsRunnnerService = new AppTest( //utility class for app. tests functionality
            generalService,
            base64VARCredentialsProd,
            base64VARCredentialsEU,
            base64VARCredentialsSB,
            jenkinsBuildUserCred,
        );

        // 1. parse which addon should run and on which version, run the test on Jenkins
        switch (addonName) {
            //add another 'case' here when adding new addons to this mehcanisem
            case 'ADAL': {
                //add new ADAL BIG DATA test - here
                addonUUID = '00000000-0000-0000-0000-00000000ada1';
                debugger;
                const buildToken = 'ADALApprovmentTests';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20Production%20-%20ADAL';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20EU%20-%20ADAL';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20Stage%20-%20ADAL';
                const jobPathPROD2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A2%20Production%20-%20ADAL%20Part%202%20-%20CLI';
                const jobPathEU2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A2%20EU%20-%20ADAL%20Part%202%20-%20CLI';
                const jobPathSB2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A2%20Stage%20-%20ADAL%20Part%202%20-%20CLI';
                debugger;
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
                } = await appTestsRunnnerService.jenkinsDoubleJobTestRunner(
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
                debugger;
                break;
            }
            case 'ASYNCADDON': {
                addonUUID = '00000000-0000-0000-0000-0000000a594c';
                const buildToken = 'ASYNCApprovmentTests';
                const jobPathPROD =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20L1%20Production%20-%20Async%20Addon%20Stop%20Restart%20-%20CLI';
                const jobPathEU =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20L1%20EU%20-%20Async%20Addon%20Stop%20Restart%20-%20CLI';
                const jobPathSB =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20L1%20Stage%20-%20Async%20Addon%20Stop%20Restart%20-%20CLI';
                const jobPathPROD2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20L2%20Production%20-%20Async%20Addon%20Install%20And%20Execution';
                const jobPathEU2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20L2%20EU%20-%20Async%20Addon%20Install%20And%20Execution';
                const jobPathSB2 =
                    'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20L2%20Stage%20-%20Async%20Addon%20Install%20And%20Execution';
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
                } = await appTestsRunnnerService.jenkinsDoubleJobTestRunner(
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
                debugger;
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
                } = await appTestsRunnnerService.jenkinsSingleJobTestRunner(
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
                const jobPathPROD = 'API%20Testing%20Framework/job/Test%20-%20B4.7%20Production%20-%20Permissions';
                // 'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20J1%20Production%20-%20CPI%20DATA%20+%20GENERIC%20RESOURCE';
                const jobPathEU = 'API%20Testing%20Framework/job/Test%20-%20B4.7%20EU%20-%20Permissions';
                // 'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20J1%20EU%20-%20CPI%20DATA%20+%20GENERIC%20RESOURCE';
                const jobPathSB = 'API%20Testing%20Framework/job/Test%20-%20B4.7%20Stage%20-%20Permissions';
                // 'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20J1%20Staging%20-%20CPI%20DATA%20+%20GENERIC%20RESOURCE';
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
                } = await appTestsRunnnerService.jenkinsSingleJobTestRunner(
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
            //these tests (CPI-DATAs) are deprecated - because it has to run on Nebula
            // case 'CPI DATA':
            // case 'ADDONS-CPI-DATA':
            // case 'CPI-DATA': {
            //     addonUUID = 'd6b06ad0-a2c1-4f15-bebb-83ecc4dca74b';
            //     const buildToken = 'CPIDATAApprovmentTests';
            //     const jobPathPROD =
            //         'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20J1%20Production%20-%20CPI%20DATA%20+%20GENERIC%20RESOURCE';
            //     const jobPathEU =
            //         'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20J1%20EU%20-%20CPI%20DATA%20+%20GENERIC%20RESOURCE';
            //     const jobPathSB =
            //         'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20J1%20Staging%20-%20CPI%20DATA%20+%20GENERIC%20RESOURCE';
            //     const {
            //         JenkinsBuildResultsAllEnvs,
            //         latestRunProd,
            //         latestRunEU,
            //         latestRunSB,
            //         addonEntryUUIDProd,
            //         addonEntryUUIDEu,
            //         addonEntryUUIDSb,
            //         addonVersionProd,
            //         addonVersionEU,
            //         addonVersionSb,
            //     } = await appTestsRunnnerService.jenkinsSingleJobTestRunner(
            //         email,
            //         pass,
            //         addonName,
            //         addonUUID,
            //         jobPathPROD,
            //         jobPathEU,
            //         jobPathSB,
            //         buildToken,
            //     );
            //     JenkinsBuildResultsAllEnvsEx = JenkinsBuildResultsAllEnvs;
            //     latestRunProdEx = latestRunProd;
            //     latestRunEUEx = latestRunEU;
            //     latestRunSBEx = latestRunSB;
            //     pathProdEx = jobPathPROD;
            //     pathEUEx = jobPathEU;
            //     pathSBEx = jobPathSB;
            //     addonEntryUUIDProdEx = addonEntryUUIDProd;
            //     addonEntryUUIDEuEx = addonEntryUUIDEu;
            //     addonEntryUUIDSbEx = addonEntryUUIDSb;
            //     addonVersionProdEx = addonVersionProd;
            //     addonVersionEUEx = addonVersionEU;
            //     addonVersionSbEx = addonVersionSb;
            // //     break;
            // }
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
                } = await appTestsRunnnerService.jenkinsSingleJobTestRunner(
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
                } = await appTestsRunnnerService.jenkinsDoubleJobTestRunner(
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
                } = await appTestsRunnnerService.jenkinsDoubleJobTestRunner(
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
                } = await appTestsRunnnerService.jenkinsDoubleJobTestRunner(
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
                } = await appTestsRunnnerService.jenkinsSingleJobTestRunner(
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
                } = await appTestsRunnnerService.jenkinsSingleJobTestRunner(
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
                debugger;
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
                } = await appTestsRunnnerService.jenkinsSingleJobTestRunner(
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
            case 'CORE':
            case 'CORE-GENERIC-RESOURCES': {
                debugger;
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
                } = await appTestsRunnnerService.jenkinsSingleJobTestRunner(
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
                debugger;
                break;
            }
            default:
                console.log(`no approvement tests for addon: ${addonName}`);
                return;
        }
        await appTestsRunnnerService.resultParserAndReporter(
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
        run();
        return;
    } else {
        throw new Error(`Error: No Test Named: '${tests}' Found On CLI Test Index!`);
    }
})();

export async function newlyCretedDistDependenciesTests(generalService: GeneralService, varPass: string) {
    const baseAddonVersionsInstallationResponseObj = await generalService.baseAddonVersionsInstallation(
        varPass,
        systemAddons,
    );
    const chnageVersionResponseArr = baseAddonVersionsInstallationResponseObj.chnageVersionResponseArr;
    const isInstalledArr = baseAddonVersionsInstallationResponseObj.isInstalledArr;

    //Services Framework, Cross Platforms API, WebApp Platform, Addons Manager, Data Views API, Settings Framework, ADAL
    describe('Upgrade Dependencies Addons', function () {
        this.retries(1);

        isInstalledArr.forEach((isInstalled, index) => {
            it(`Validate That Needed Addon Is Installed: ${Object.keys(systemAddons)[index]}`, () => {
                expect(isInstalled).to.be.true;
            });
        });

        for (const addonName in systemAddons) {
            const addonUUID = systemAddons[addonName][0];
            const version = systemAddons[addonName][1];
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
            }
            // else if (uIControlArr[j]['Type'] == '[OA#0]OrderBanner') {
            //     it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
            //         const setOrderBannerBinded = setOrderBanner.bind(that);
            //         await setOrderBannerBinded(generalService, uIControlArr[j]);
            //     });
            // }
            // else if (uIControlArr[j]['Type'] == '[OA#0]OrderCartOpenedFooter') {
            //     it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
            //         const setOrderCartOpenedFooterBinded = setOrderCartOpenedFooter.bind(that);
            //         await setOrderCartOpenedFooterBinded(generalService, uIControlArr[j]);
            //     });
            // }
            // else if (uIControlArr[j]['Type'] == '[OA#0]OrderCenterClosedFooter') {
            //     it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
            //         const setOrderCenterClosedFooterBinded = setOrderCenterClosedFooter.bind(that);
            //         await setOrderCenterClosedFooterBinded(generalService, uIControlArr[j]);
            //     });
            // }
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
    failedAppTests?,
) {
    let message;
    let message2;
    await reportBuildEnded(addonName, addonUUID, addonVersion, generalService);
    debugger;
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
        //include new results printing here and copy the function to app-tests class
        debugger;
        const failedTestsOrdered: string[] = failedAppTests.map((element) => `${element.env}: ${element.text}`);
        debugger;
        message = `QA Approvment Test: ${addonName} - (${addonUUID}), Version: ${addonVersion} ||| ${
            passingEnvs.length === 0 ? '' : 'Passed On: ' + passingEnvs.join(', ') + '|||'
        }  ${failingEnvs.length === 0 ? '' : 'Failed On: ' + failingEnvs.join(', ')}`;
        message2 = `Test Link:<br>PROD:   https://admin-box.pepperi.com/job/${jobPathPROD}/${latestRunProd}/console<br>EU:    https://admin-box.pepperi.com/job/${jobPathEU}/${latestRunEU}/console<br>SB:    https://admin-box.pepperi.com/job/${jobPathSB}/${latestRunSB}/console<br><br>${
            failedTestsOrdered.length > 0 ? 'Failed Tests:<br>' : ''
        }${failedTestsOrdered.toString()}`;
        debugger;
        if (message2.length > 20000) {
            message2 =
                message2 = `Test Link:<br>PROD:   https://admin-box.pepperi.com/job/${jobPathPROD}/${latestRunProd}/console<br>EU:    https://admin-box.pepperi.com/job/${jobPathEU}/${latestRunEU}/console<br>SB:    https://admin-box.pepperi.com/job/${jobPathSB}/${latestRunSB}/console<br><br>Failed Tests:<br>ARE TOO MANY - CANNOT SEND SO MUCH DATA VIA TEAMS PLEASE CHECK JENKINS!`;
        }
    }
    const teamsURL = await generalService.handleTeamsURL(addonName, email, pass);
    const bodyToSend = {
        Name: isDev ? `${addonName} Dev Test Result Status` : `${addonName} Approvment Tests Status`,
        Description: message,
        Status: passingEnvs.length < 3 ? 'ERROR' : 'SUCCESS',
        Message: message2 === '' ? '~' : message2.trim(),
        UserWebhook: teamsURL,
    };
    console.log(
        `\n====> About To Send This Message To '/system_health/notifications': ${JSON.stringify(bodyToSend)}\n`,
    );
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
    console.log('system health respone -> ' + JSON.stringify(monitoringResponse));
    if (
        monitoringResponse.Ok !== true ||
        monitoringResponse.Status !== 200 ||
        Object.keys(monitoringResponse.Error).length !== 0
    ) {
        const body = `<b> /system_health/notifications call FAILED! </b> </br> <b> Name: </b> ${bodyToSend.Name} </br> <b> Description: </b> ${bodyToSend.Description} </br> <b> Status: </b> ${bodyToSend.Status} </br> <b> Message: </b> ${bodyToSend.Message}`;
        await generalService.fetchStatus(teamsURL, { method: 'POST', body: JSON.stringify({ Text: body }) });
    }
}

export async function genericReportToTeams(addonName, env, uuid, message, user, version, generalService) {
    const teamsURL = await generalService.handleTeamsURL(addonName, email, pass);
    const bodyToSend = {
        Name: `Nightly Regression Failure: ${addonName}, ${version}`,
        Description: `${env} user: ${user}`,
        Status: 'ERROR',
        Message: message,
        UserWebhook: teamsURL,
    };
    console.log(
        `\n====> About To Send This Message To '/system_health/notifications':\n ${JSON.stringify(bodyToSend)}\n`,
    );
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
    console.log('system health respone -> ' + JSON.stringify(monitoringResponse));
    if (
        monitoringResponse.Ok !== true ||
        monitoringResponse.Status !== 200 ||
        Object.keys(monitoringResponse.Error).length !== 0
    ) {
        const body = `<b> /system_health/notifications call FAILED! </b> </br> <b> Name: </b> ${bodyToSend.Name} </br> <b> Description: </b> ${bodyToSend.Description} </br> <b> Status: </b> ${bodyToSend.Status} </br> <b> Message: </b> ${bodyToSend.Message}`;
        await generalService.fetchStatus(teamsURL, { method: 'POST', body: JSON.stringify({ Text: body }) });
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

        message2 = `
        }${
            failedSuitesSB.length === 0
                ? ''
                : 'SB:' + failedSuitesSB.map((obj) => `${obj.testName} - ${obj.executionUUID}`).join(',<br>')
        }`;
    } else {
        message = `QA Approvment Test: ${addonName} - (${addonUUID}), Version:${addonVersion} ||| ${
            passingEnvs.length === 0 ? '' : 'Passed On: ' + passingEnvs.join(', ') + '|||'
        }  ${failingEnvs.length === 0 ? '' : 'Failed On: ' + failingEnvs.join(', ')}`;
        message2 = `Test Link:<br>PROD:   https://admin-box.pepperi.com/job/${jobPathPROD}/${latestRunProd}/console<br>EU:    https://admin-box.pepperi.com/job/${jobPathEU}/${latestRunEU}/console<br>SB:    https://admin-box.pepperi.com/job/${jobPathSB}/${latestRunSB}/console`;
    }
    const teamsURL = await generalService.handleTeamsURL(addonName, email, pass);
    const bodyToSend = {
        Name: isDev ? `${addonName} Dev Test Result Status` : `${addonName} Approvment Tests Status`,
        Description: message,
        Status: passingEnvs.length < 1 ? 'ERROR' : 'SUCCESS',
        Message: message2 === '' ? '~' : message2,
        UserWebhook: teamsURL,
    };
    console.log(
        `\n====> About To Send This Message To '/system_health/notifications': ${JSON.stringify(bodyToSend)}\n`,
    );
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
    console.log('system health respone -> ' + JSON.stringify(monitoringResponse));
    if (
        monitoringResponse.Ok !== true ||
        monitoringResponse.Status !== 200 ||
        Object.keys(monitoringResponse.Error).length !== 0
    ) {
        const body = `<b> /system_health/notifications call FAILED! </b> </br> <b> Name: </b> ${bodyToSend.Name} </br> <b> Description: </b> ${bodyToSend.Description} </br> <b> Status: </b> ${bodyToSend.Status} </br> <b> Message: </b> ${bodyToSend.Message}`;
        await generalService.fetchStatus(teamsURL, { method: 'POST', body: JSON.stringify({ Text: body }) });
    }
}

export async function reportToTeamsMessage(addonName, addonUUID, addonVersion, error, service: GeneralService) {
    await reportBuildEnded(addonName, addonUUID, addonVersion, service);
    const message = `${error}`;
    const teamsURL = await service.handleTeamsURL(addonName, email, pass);
    const bodyToSend = {
        Name: `${addonName} Approvment Tests Status: Failed Due CI/CD Process Exception`,
        Description: `${addonName} - (${addonUUID}), Version:${addonVersion}, Failed!`,
        Status: 'ERROR',
        Message: message,
        UserWebhook: teamsURL,
    };
    const testAddonSecretKey = await service.getSecret()[1];
    const testAddonUUID = await service.getSecret()[0];
    console.log(
        `\n====> About To Send This Message To '/system_health/notifications':\n ${JSON.stringify(bodyToSend)}\n`,
    );
    const monitoringResponse = await service.fetchStatus('https://papi.pepperi.com/v1.0/system_health/notifications', {
        method: 'POST',
        headers: {
            'X-Pepperi-SecretKey': testAddonSecretKey,
            'X-Pepperi-OwnerID': testAddonUUID,
        },
        body: JSON.stringify(bodyToSend),
    });
    console.log('system health respone -> ' + JSON.stringify(monitoringResponse));
    if (
        monitoringResponse.Ok !== true ||
        monitoringResponse.Status !== 200 ||
        Object.keys(monitoringResponse.Error).length !== 0
    ) {
        const body = `<b> /system_health/notifications call FAILED! </b> </br> <b> Name: </b> ${bodyToSend.Name} </br> <b> Description: </b> ${bodyToSend.Description} </br> <b> Status: </b> ${bodyToSend.Status} </br> <b> Message: </b> ${bodyToSend.Message}`;
        await service.fetchStatus(teamsURL, { method: 'POST', body: JSON.stringify({ Text: body }) });
    }
}

export async function reportToTeamsMessageNeptune(addonName, addonUUID, addonVersion, error, service: GeneralService) {
    await reportBuildEnded(addonName, addonUUID, addonVersion, service);
    const message = `${addonName} - (${addonUUID}), Version:${addonVersion}, Failed On: ${error}`;
    const teamsURL = await service.handleTeamsURL(addonName, email, pass);
    const bodyToSend = {
        Name: `${addonName} - NEPTUNE Approvment Tests Status: Failed Due CI/CD Process Exception`,
        Description: message,
        Status: 'ERROR',
        Message: message,
        UserWebhook: teamsURL,
    };
    const testAddonSecretKey = await service.getSecret()[1];
    const testAddonUUID = await service.getSecret()[0];
    debugger;
    console.log(
        `\n====> About To Send This Message To '/system_health/notifications': ${JSON.stringify(bodyToSend)}\n`,
    );
    const monitoringResponse = await service.fetchStatus('https://papi.pepperi.com/v1.0/system_health/notifications', {
        method: 'POST',
        headers: {
            'X-Pepperi-SecretKey': testAddonSecretKey,
            'X-Pepperi-OwnerID': testAddonUUID,
        },
        body: JSON.stringify(bodyToSend),
    });
    console.log('system health respone -> ' + JSON.stringify(monitoringResponse));
    debugger;
    if (
        monitoringResponse.Ok !== true ||
        monitoringResponse.Status !== 200 ||
        Object.keys(monitoringResponse.Error).length !== 0
    ) {
        const body = `<b> /system_health/notifications call FAILED! </b> </br> <b> Name: </b> ${bodyToSend.Name} </br> <b> Description: </b> ${bodyToSend.Description} </br> <b> Status: </b> ${bodyToSend.Status} </br> <b> Message: </b> ${bodyToSend.Message}`;
        await service.fetchStatus(teamsURL, { method: 'POST', body: JSON.stringify({ Text: body }) });
    }
}

export async function reportBuildStarted(addonName, addonUUID, addonVersion, service: GeneralService) {
    const message = `${addonName} - (${addonUUID}), Version:${addonVersion}, Started Building`;
    const teamsURL = await service.handleTeamsURL('QA', email, pass);
    const bodyToSend = {
        Name: `${addonName}, ${addonUUID}, ${addonVersion}`,
        Description: message,
        Status: 'SUCCESS',
        Message: message,
        UserWebhook: teamsURL,
    };
    console.log(
        `\n====> About To Send This Message To '/system_health/notifications': ${JSON.stringify(bodyToSend)}\n`,
    );
    const monitoringResponse = await service.fetchStatus('https://papi.pepperi.com/v1.0/system_health/notifications', {
        method: 'POST',
        headers: {
            'X-Pepperi-SecretKey': await service.getSecret()[1],
            'X-Pepperi-OwnerID': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
        },
        body: JSON.stringify(bodyToSend),
    });
    console.log('system health respone -> ' + JSON.stringify(monitoringResponse));
    if (
        monitoringResponse.Ok !== true ||
        monitoringResponse.Status !== 200 ||
        Object.keys(monitoringResponse.Error).length !== 0
    ) {
        const body = `<b> /system_health/notifications call FAILED! </b> </br> <b> Name: </b> ${bodyToSend.Name} </br> <b> Description: </b> ${bodyToSend.Description} </br> <b> Status: </b> ${bodyToSend.Status} </br> <b> Message: </b> ${bodyToSend.Message}`;
        await service.fetchStatus(teamsURL, { method: 'POST', body: JSON.stringify({ Text: body }) });
    }
}

export async function reportBuildEnded(addonName, addonUUID, addonVersion, service: GeneralService) {
    const message = `${addonName} - (${addonUUID}), Version:${addonVersion}, Ended Testing`;
    const teamsURL = await service.handleTeamsURL('QA', email, pass);
    const bodyToSend = {
        Name: `${addonName}, ${addonUUID}, ${addonVersion}`,
        Description: message,
        Status: 'SUCCESS',
        Message: message,
        UserWebhook: teamsURL,
    };
    console.log(
        `\n====> About To Send This Message To '/system_health/notifications': ${JSON.stringify(bodyToSend)}\n`,
    );
    const monitoringResponse = await service.fetchStatus('https://papi.pepperi.com/v1.0/system_health/notifications', {
        method: 'POST',
        headers: {
            'X-Pepperi-SecretKey': await service.getSecret()[1],
            'X-Pepperi-OwnerID': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
        },
        body: JSON.stringify(bodyToSend),
    });
    console.log('system health respone -> ' + JSON.stringify(monitoringResponse));
    if (
        monitoringResponse.Ok !== true ||
        monitoringResponse.Status !== 200 ||
        Object.keys(monitoringResponse.Error).length !== 0
    ) {
        const body = `<b> /system_health/notifications call FAILED! </b> </br> <b> Name: </b> ${bodyToSend.Name} </br> <b> Description: </b> ${bodyToSend.Description} </br> <b> Status: </b> ${bodyToSend.Status} </br> <b> Message: </b> ${bodyToSend.Message}`;
        await service.fetchStatus(teamsURL, { method: 'POST', body: JSON.stringify({ Text: body }) });
    }
}

function resolveUserPerTestNeptune(addonName): any[] {
    switch (addonName) {
        case 'NEBULA': //0.7.x neo4j
            return ['NebulaNeptuneSB@pepperitest.com']; //
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

async function getCrawlerTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/f489d076-381f-4cf7-aa63-33c6489eb017/tests/tests`, {
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

async function getJourneyTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/41011fbf-debf-40d8-8990-767738b8af03/tests/tests`, {
            method: 'GET',
        })
    ).Body;
    let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
    toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
    return toReturn;
}

async function getCPINodeTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/bb6ee826-1c6b-4a11-9758-40a46acb69c5/tests/tests`, {
            method: 'GET',
        })
    ).Body;
    let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
    toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
    return toReturn;
}

async function getAsyncAddonTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/00000000-0000-0000-0000-0000000a594c/tests/tests`, {
            method: 'GET',
        })
    ).Body;
    let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
    toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
    return toReturn;
}

async function getTranslationAddonTests(userName, env) {
    const client = await initiateTester(userName, 'Aa123456', env);
    const service = new GeneralService(client);
    const response = (
        await service.fetchStatus(`/addons/api/fbbac53c-c350-42c9-b9ad-17c238e55b42/tests/tests`, {
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

async function runDevTestOnCertainEnv(userName, env, bodyToSend, addonName, addonSk?) {
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
        headers = {
            'x-pepperi-ownerid': '84c999c3-84b7-454e-9a86-71b7abc96554',
            'x-pepperi-secretkey': addonSk,
            Authorization: `Bearer ${service['client'].OAuthAccessToken}`,
        };
    } else if (addonName === 'RELATED-ITEMS') {
        urlToCall = '/addons/api/async/4f9f10f3-cd7d-43f8-b969-5029dad9d02b/tests/tests';
    } else if (addonName === 'CRAWLER') {
        urlToCall = '/addons/api/async/f489d076-381f-4cf7-aa63-33c6489eb017/tests/tests';
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
    } else if (addonName === 'JOURNEY' || addonName === 'JOURNEY-TRACKER') {
        urlToCall = '/addons/api/async/41011fbf-debf-40d8-8990-767738b8af03/tests/tests';
    } else if (addonName === 'NODE' || addonName === 'CPI-NODE') {
        urlToCall = '/addons/api/async/bb6ee826-1c6b-4a11-9758-40a46acb69c5/tests/tests';
    } else if (addonName === 'ASYNCADDON') {
        urlToCall = '/addons/api/async/00000000-0000-0000-0000-0000000a594c/tests/tests';
    } else if (addonName === 'TRANSLATION') {
        urlToCall = '/addons/api/async/fbbac53c-c350-42c9-b9ad-17c238e55b42/tests/tests';
    }
    let testResponse;
    if (
        addonName === 'DATA INDEX' ||
        addonName === 'DATA-INDEX' ||
        addonName === 'ADAL' ||
        addonName === 'CONFIGURATIONS'
    ) {
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

async function getTestNames(addonName, user, env) {
    if (addonName === 'NEBULA') {
        // testsList
        return await getNebulaTests(user, env);
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
        return await getRelatedItemsTests(user, env);
    } else if (addonName === 'CRAWLER') {
        return await getCrawlerTests(user, env);
    } else if (addonName === 'PEPPERI-FILE-STORAGE' || addonName === 'PFS') {
        return await getPFSTests(user, 'prod');
    } else if (addonName === 'JOURNEY-TRACKER' || addonName === 'JOURNEY') {
        return await getJourneyTests(user, 'prod');
    } else if (addonName === 'CPI-NODE' || addonName === 'NODE') {
        return await getCPINodeTests(user, 'prod');
    } else if (addonName === 'ASYNCADDON') {
        return await getAsyncAddonTests(user, 'prod');
    } else if (addonName === 'TRANSLATION') {
        return await getTranslationAddonTests(user, 'prod');
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
        addonName === 'PEPPERI-FILE-STORAGE' ||
        addonName === 'JOURNEY' ||
        addonName === 'JOURNEY-TRACKER' ||
        addonName === 'NODE' ||
        addonName === 'CPI-NODE' ||
        addonName === 'CRAWLER' ||
        addonName === 'ASYNCADDON' ||
        addonName === 'TRANSLATION'
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
