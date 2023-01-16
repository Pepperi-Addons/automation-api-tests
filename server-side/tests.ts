import { Client, Request } from '@pepperi-addons/debug-server';
import GeneralService, { TesterFunctions } from './services/general.service';
import {
    TestDataTests,
    UpgradeDependenciesTests,
    LocalAddonFileCreatorTests,
    FileStorageTests,
    DataViewsTestsBase,
    DataViewsTestsPositive,
    DataViewsTestsNegative,
    FieldsTests,
    SyncLongTests,
    SyncTests,
    PermissionsTests,
    SyncWithBigDataTests,
    SyncCleanTests,
    PagesTestSuite,
    BaseAddonsTests,
    UninstallAddonsTests,
    SingleMaintenanceAndDependenciesAddonsTestsPart1,
    SingleMaintenanceAndDependenciesAddonsTestsPart2,
    MaintenanceFullTests,
    VarTests,
    CreateTestDataAddon,
    AuditLogsTests,
    AddonAuditLogsTests,
    AddonAsyncExecutionTests,
    DBSchemaTests,
    DBSchemaTestsPart2,
    SchemaTypeDataIndexedTests,
    DocDBIndexedAdal,
    BatchUpsertTests,
    DimxDataImportTests,
    SchedulerTests,
    TimeOutAddonJobsTests,
    AddonJobsTests,
    InstallTests,
    CodeJobsRetryTests,
    CodeJobsAddonTests,
    AddonRelationTests,
    UsageMonitorTests,
    UDTTests,
    UsersTests,
    AccountsTests,
    LegacyResourcesTests,
    BulkBigDataTests,
    ContactsTests,
    GeneralActivitiesTests,
    TransactionTests,
    ElasticSearchTests,
    OpenCatalogTests,
    DistributorTests,
    PFSTests,
    DIMXrecursive,
    UDCTests,
    ChartManagerTests,
    ImportExportATDActivitiesTests,
    ImportExportATDTransactionsTests,
    ImportExportATDActivitiesBoxTests,
    ImportExportATDTransactionsBoxTests,
    ImportExportATDActivitiesOverrideTests,
    ImportExportATDTransactionsOverrideTests,
    ImportExportATDTransactionsOverrideWinzerTests,
    ImportExportATDTransactionsOverrideWinzerTestsTwo,
    ImportExportATDTransactionsOverrideWinzerTestsThree,
    ImportExportATDLocalTests,
    ImportExportATDTransactionsOverridBugReproductionTests,
    ADALTests,
    PepperiNotificationServiceTests,
    NucRecoveryTests,
    NucRecoverySDKTests,
    NucRecoveryWACDTests,
    CPINodeTests,
    DataIndexTests,
    DataIndexADALTests,
    MaintenanceJobTests,
    CodeJobsCleanTests,
    VarSystemAddonsTests,
    AddonDataImportExportTests,
    AddonDataImportExportPerformanceTests,
    AddonDataImportExportReferenceTests,
    ADALStressTests,
    DataQueriesTests,
    AWSLogsTest,
    SecurityTests,
    AsyncAddonGetRemoveTests,
} from './api-tests/index';
import { SingleMaintenanceAndDependenciesAddonsTestsPart3 } from './api-tests/addons';
// import { checkVersionsTest } from './api-tests/check_versions';

let testName = '';

//#region Service Tests
export async function test_data(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName == '') {
        testName = 'Test_Data';
        service.PrintMemoryUseToLog('Start', testName);
        testerFunctions = service.initiateTesterFunctions(client, testName);
        await test_data(client, testerFunctions);
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return await testerFunctions.run();
    } else {
        return TestDataTests(service, testerFunctions);
    }
}

export async function upgrade_dependencies(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Upgrade_Dependencies';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await UpgradeDependenciesTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function upload_local_file(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Local_Addon_File_Creator_Tests';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await LocalAddonFileCreatorTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}
//#endregion Service Tests

//#region All Tests
export async function all(client: Client, testerFunctions: TesterFunctions) {
    testName = 'All';
    const service = new GeneralService(client);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await sync(client, testerFunctions);
    await file_storage(client, testerFunctions);
    await fields(client, testerFunctions);
    await test_data(client, testerFunctions);
    testName = '';
    return await testerFunctions.run();
}

export async function file_storage(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'File_Storage' && testName != 'All') {
        testName = 'File_Storage';
        service.PrintMemoryUseToLog('Start', testName);
        testerFunctions = service.initiateTesterFunctions(client, testName);
        await FileStorageTests(service, testerFunctions);
        await test_data(client, testerFunctions);
        service.PrintMemoryUseToLog('End', testName);
        return await testerFunctions.run();
    } else {
        return FileStorageTests(service, testerFunctions);
    }
}

export async function data_views(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'Data_Views' && testName != 'All' && testName != 'Sanity') {
        testName = 'Data_Views';
        service.PrintMemoryUseToLog('Start', testName);
        testerFunctions = service.initiateTesterFunctions(client, testName);
        await DataViewsTestsBase(service, testerFunctions);
        await test_data(client, testerFunctions);
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return await testerFunctions.run();
    } else {
        return DataViewsTestsBase(service, testerFunctions);
    }
}

export async function data_views_positive(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'Data_Views_Positive' && testName != 'All' && testName != 'Sanity') {
        testName = 'Data_Views_Positive';
        service.PrintMemoryUseToLog('Start', testName);
        testerFunctions = service.initiateTesterFunctions(client, testName);
        await DataViewsTestsPositive(service, testerFunctions), await test_data(client, testerFunctions);
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return await testerFunctions.run();
    } else {
        return DataViewsTestsPositive(service, testerFunctions);
    }
}

export async function data_views_negative(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'Data_Views_Negative' && testName != 'All' && testName != 'Sanity') {
        testName = 'Data_Views_Negative';
        service.PrintMemoryUseToLog('Start', testName);
        testerFunctions = service.initiateTesterFunctions(client, testName);
        await DataViewsTestsNegative(service, testerFunctions);
        await test_data(client, testerFunctions);
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return await testerFunctions.run();
    } else {
        return DataViewsTestsNegative(service, testerFunctions);
    }
}

export async function fields(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'Fields' && testName != 'All' && testName != 'Sanity') {
        testName = 'Fields';
        service.PrintMemoryUseToLog('Start', testName);
        testerFunctions = service.initiateTesterFunctions(client, testName);
        await FieldsTests(service, testerFunctions);
        await test_data(client, testerFunctions);
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return await testerFunctions.run();
    } else {
        return FieldsTests(service, testerFunctions);
    }
}

export async function sync(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'Sync' && testName != 'All' && testName != 'Sanity') {
        testName = 'Sync';
        service.PrintMemoryUseToLog('Start', testName);
        testerFunctions = service.initiateTesterFunctions(client, testName);
        await SyncLongTests(service, testerFunctions);
        await test_data(client, testerFunctions);
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return await testerFunctions.run();
    } else {
        return SyncTests(service, testerFunctions);
    }
}

export async function sync_big_data(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Sync_Big_Data';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await SyncWithBigDataTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    testName = '';
    return await testerFunctions.run();
}

export async function sync_clean(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Sync_Clean';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await SyncCleanTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    testName = '';
    return await testerFunctions.run();
}

export async function user_events() {
    return {
        Events: [
            {
                Title: 'loading survey object',
                EventKey: 'SurveyLoad',
                EventFilter: {
                    HasQuestions: false,
                },
                EventData: {
                    SurveyName: {
                        Type: 'String',
                    },
                    HasQuestions: {
                        Type: 'Boolean',
                    },
                    Survey: {
                        Type: 'Object',
                    },
                    SurveyID: {
                        Type: 'Integer',
                    },
                    Factor: {
                        Type: 'Double',
                    },
                },
            },
            {
                Title: 'loading transaction scope',
                EventKey: 'TransactionScopeLoaded',
                EventFilter: {
                    DataObject: {
                        TypeDefinition: {
                            InternalID: 255154,
                        },
                    },
                },
                EventData: {
                    DataObject: {
                        Type: 'Object',
                    },
                    HasQuestions: {
                        Type: 'Boolean',
                    },
                },
            },
        ],
    };
}

export async function user_events2() {
    return {
        Events: [
            {
                Title: 'evgenyEvent',
                EventKey: 'evgeny',
                EventFilter: {},
                EventData: {},
            },
        ],
    };
}

export async function user_eventsF() {
    return {
        Events: [
            {
                Title: 'evgenyEvent',
                EventKey: 'evgeny',
                EventFilter: {},
                EventData: {
                    str: {
                        Type: 'String',
                    },
                },
            },
        ],
    };
}

//#endregion All Tests
export async function pages_api(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    // service.papiClient = new PapiClient({
    //     baseURL: client.BaseURL,
    //     token: client.OAuthAccessToken,
    //     addonUUID: client.AddonUUID.length > 10 ? client.AddonUUID : 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
    //     addonSecretKey: client.AddonSecretKey,
    //     suppressLogging: true
    // });
    testName = 'Pages_Api';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await PagesTestSuite(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

//#region Old Framwork Tests
export async function audit_logs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'Audit_Logs' && testName != 'Sanity') {
        testName = 'Audit_Logs';
        service.PrintMemoryUseToLog('Start', testName);
        testerFunctions = service.initiateTesterFunctions(client, testName);
        await AuditLogsTests(service, testerFunctions);
        await test_data(client, testerFunctions);
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return await testerFunctions.run();
    } else {
        return AuditLogsTests(service, testerFunctions);
    }
}

export async function addon_audit_logs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'Addon_Audit_Logs' && testName != 'Sanity') {
        testName = 'Addon_Audit_Logs';
        service.PrintMemoryUseToLog('Start', testName);
        testerFunctions = service.initiateTesterFunctions(client, testName);
        await AddonAuditLogsTests(service, testerFunctions);
        await test_data(client, testerFunctions);
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return await testerFunctions.run();
    } else {
        return AddonAuditLogsTests(service, testerFunctions);
    }
}

export async function addon_async_execution(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addon_Async_Execution';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await AddonAsyncExecutionTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    testName = '';
    return testerFunctions.run();
}

export async function var_api(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Var';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await VarTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function var_system_addons(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Var System Addons';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await VarSystemAddonsTests(service, request, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function create_test_data_addon(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Create_Test_Data_Addon';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await CreateTestDataAddon(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function addons(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addons';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await BaseAddonsTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function addons_uninstall(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addons_Uninstall';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await UninstallAddonsTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}
//TODO: once it works: add comments
export async function maintenance1(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Maintenance_and_Dependencies1';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await SingleMaintenanceAndDependenciesAddonsTestsPart1(service, request, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function maintenance2(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Maintenance_and_Dependencies2';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await SingleMaintenanceAndDependenciesAddonsTestsPart2(service, request, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function maintenance3(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Maintenance_and_Dependencies3';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await SingleMaintenanceAndDependenciesAddonsTestsPart3(service, request, testerFunctions),
        service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function maintenance_full(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Maintenance_Full';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await MaintenanceFullTests(service, request, testerFunctions);
    await test_data(client, testerFunctions), service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}
//#endregion Old Framwork Tests

//#region Oleg's Framwork Tests
export async function schema(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Schema';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await DBSchemaTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function schema_part2(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'SchemaPart2';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await DBSchemaTestsPart2(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function schema_type_data_index(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Schema_Type_Data_Indexed';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await SchemaTypeDataIndexedTests(service, request, testerFunctions), await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function doc_db_indexed_adal(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Doc_DB_Indexed_ADAL';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await DocDBIndexedAdal(service, request, testerFunctions), await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function batch_upsert(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Batch_Upsert';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await BatchUpsertTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function dimx_data_import(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'dimx_data_import';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await DimxDataImportTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function scheduler(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Scheduler';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await SchedulerTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function code_jobs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Code_Jobs';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await AddonJobsTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function addon_jobs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addon_Jobs';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await AddonJobsTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function timeout_addon_jobs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'TimeOut_Addon_Jobs';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await TimeOutAddonJobsTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function install(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Install';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await InstallTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function code_jobs_addon(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Code_Jobs_Addon';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await CodeJobsAddonTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function code_jobs_retry(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Code_Jobs_Retry';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await CodeJobsRetryTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function addon_relations(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Relations';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await AddonRelationTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function usage_monitor(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Usage_Monitor';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await UsageMonitorTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}
//#endregion Oleg's Framwork Tests

//#region Yoni's Tests
export async function objects(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Objects';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await UDTTests(service, testerFunctions);
    await UsersTests(service, testerFunctions);
    await AccountsTests(service, testerFunctions);
    await ContactsTests(service, testerFunctions);
    await GeneralActivitiesTests(service, testerFunctions);
    await TransactionTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function udt(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'UDT';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await UDTTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function users(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Users';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await UsersTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function accounts(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Accounts';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await AccountsTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function bulk_big_data(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Bulk_Big_Data';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await test_data(client, testerFunctions);
    await BulkBigDataTests(service, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function contacts(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Contacts';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ContactsTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function general_activities(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'General_Activities';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await GeneralActivitiesTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function transactions(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Transactions';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await TransactionTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    return await testerFunctions.run();
}

export async function elastic_search(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Elastic_Search';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ElasticSearchTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return testerFunctions.run();
}

export async function open_catalog(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Open_Catalog';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await OpenCatalogTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return testerFunctions.run();
}

export async function distributor(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Distributor';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await DistributorTests(service, request, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function pfs(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'PFS';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await PFSTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function permissions(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Permissions';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await PermissionsTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function dimxrecursive(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'DIMX Recursive';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await DIMXrecursive(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

// export async function checkVersions(client: Client, request: Request, testerFunctions: TesterFunctions) {
//     const service = new GeneralService(client);
//     testName = 'DIMX Recursive';
//     service.PrintMemoryUseToLog('Start', testName);
//     testerFunctions = service.initiateTesterFunctions(client, testName);
//     await checkVersionsTest(service, request, testerFunctions);
//     // await test_data(client, testerFunctions);
//     service.PrintMemoryUseToLog('End', testName);
//     return await testerFunctions.run();
// }

export async function udc(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'UDC';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await UDCTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}
//#endregion Yoni's Tests

//#region Evgeny's Tests
export async function charts_manager(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Charts_Manager';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ChartManagerTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function data_queries(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Data_Queries';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await DataQueriesTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function aws_logs(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Data_Queries';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await AWSLogsTest(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}
//#endregion Evgeny's Tests

//#region import export ATD Tests
export async function import_export_atd_activities(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Activities';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ImportExportATDActivitiesTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function import_export_atd_transactions(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Transactions';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ImportExportATDTransactionsTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function import_export_atd_activities_box(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Activities_Box';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ImportExportATDActivitiesBoxTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function import_export_atd_transactions_box(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Transactions_Box';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ImportExportATDTransactionsBoxTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return testerFunctions.run();
}

export async function import_export_atd_activities_override(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Activities_Override';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ImportExportATDActivitiesOverrideTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function import_export_atd_transactions_override(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Transactions_Override';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ImportExportATDTransactionsOverrideTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function import_export_atd_transactions_override_winzer(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Transactions_Override_Winzer';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ImportExportATDTransactionsOverrideWinzerTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function import_export_atd_transactions_override_winzer_two(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Transactions_Override_Winzer_Two';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ImportExportATDTransactionsOverrideWinzerTestsTwo(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function import_export_atd_transactions_override_winzer_three(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Transactions_Override_Winzer_Three';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ImportExportATDTransactionsOverrideWinzerTestsThree(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function import_export_atd_local(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Local';
    ImportExportATDLocalTests;
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ImportExportATDLocalTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function import_export_atd_bug_reproduction(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Bug_Reproduction';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ImportExportATDTransactionsOverridBugReproductionTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}
//#endregion import export ATD Tests

export async function adal(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'ADAL';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ADALTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function adal_stress(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'ADAL_Stress';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await ADALStressTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function pepperi_notification_service(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Pepperi_Notification_Service';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await PepperiNotificationServiceTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function nuc_recovery(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'NUC_Recovery';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await NucRecoveryTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function nuc_recovery_sdk(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'NUC_Recovery_SDK';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await NucRecoverySDKTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function nuc_recovery_wacd(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'NUC_Recovery_WACD';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await test_data(client, testerFunctions);
    await NucRecoveryWACDTests(service, request, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function data_index(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Data_Index';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await DataIndexTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function data_index_adal(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Data_Index_ADAL';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await DataIndexADALTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function legacy_resources(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Legacy_Resources';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await LegacyResourcesTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    const results = await testerFunctions.run();
    service.PrintMemoryUseToLog('End', testName);
    return results;
}

export async function maintenance_job(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Maintenance_Job';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await MaintenanceJobTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function cpi_node(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'CPI_Node';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await CPINodeTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function code_jobs_clean(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Code_Jobs_Clean';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await CodeJobsCleanTests(service, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function addon_data_import_export(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addon_Data_Import_Export';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await AddonDataImportExportTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function addon_data_import_export_performanc(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Addon_Data_Import_Export_Performanc';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await AddonDataImportExportPerformanceTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function addon_data_import_export_reference(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Addon_Data_Import_Export_Reference';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await AddonDataImportExportReferenceTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function security(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addon_Data_Import_Export_Reference';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await SecurityTests(service, request, testerFunctions);
    await test_data(client, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

export async function async_addon_get_remove_codejobs(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'AsyncAddonGetUninstallCJ';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    await AsyncAddonGetRemoveTests(service, request, testerFunctions);
    service.PrintMemoryUseToLog('End', testName);
    return await testerFunctions.run();
}

//test fixtures by Addons (this is the future o:)
// export async function ADAL_FIXTURE(client: Client, request: Request, testerFunctions: TesterFunctions) {
//     const service = new GeneralService(client);
//     testName = 'ADAL Fixture';
//     service.PrintMemoryUseToLog('Start', testName);
//     testerFunctions = service.initiateTesterFunctions(client, testName);
//     //all ADAL relevant tests
//     await DBSchemaTests(service, request, testerFunctions);
//     await DBSchemaTestsPart2(service, request, testerFunctions);
//     await SchemaTypeDataIndexedTests(service, request, testerFunctions),
//         await BatchUpsertTests(service, request, testerFunctions);
//     await DimxDataImportTests(service, request, testerFunctions);
//     await DIMXrecursive(service, request, testerFunctions);
//     await ADALTests(service, request, testerFunctions);
//     await DataIndexTests(service, request, testerFunctions);
//     await DataIndexADALTests(service, request, testerFunctions);
//     service.PrintMemoryUseToLog('End', testName);
//     return await testerFunctions.run();
// }

// export async function Remote_Jenkins_Handler(client: Client, request: Request, testerFunctions: TesterFunctions) {
//     const service = new GeneralService(client);
//     const addonName = request.body.addon;
//     const addonVersion = request.body.addonVersion;
//     console.log(`Asked To Run '${addonName}' Approvment Tests On Version: ${addonVersion}`);
//     //1. realise which addon should run
//     const jobResponse = 'FAILURE';
//     // switch (addonName) {
//     //     case "ADAL":
//     //         jobResponse = await service.runJenkinsJobRemotely('JenkinsBuildUserCred',
//     //             'API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20Production%20-%20ADAL/build?token=ADALApprovmentTests',
//     //             'Test - A1 Production - ADAL');
//     //         break;
//     // }
//     debugger;
//     const bodyToSend = {
//         Name: `${addonName} Approvment Tests Status`,
//         Description: `Approvment Tests On ${addonName} Status Is ${jobResponse}`,
//         Status: jobResponse === 'FAILURE' ? 'ERROR' : 'SUCCESS',
//         Message: 'evgeny :)',
//         NotificationWebhook:
//             'https://wrnty.webhook.office.com/webhookb2/1e9787b3-a1e5-4c2c-99c0-96bd61c0ff5e@2f2b54b7-0141-4ba7-8fcd-ab7d17a60547/IncomingWebhook/b5117c82e129495fabbe8291e0cb615e/83111104-c68a-4d02-bd4e-0b6ce9f14aa0',
//         SendNotification: 'Always',
//     };
//     const addonsSK = service.getSecret()[1];
//     const testingAddonUUID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
//     const response = await service.fetchStatus('https://papi.pepperi.com/v1.0/system_health/notifications', {
//         method: 'POST',
//         headers: {
//             'X-Pepperi-SecretKey': addonsSK,
//             'X-Pepperi-OwnerID': testingAddonUUID,
//         },
//         body: JSON.stringify(bodyToSend),
//     });
//     debugger;

// const service = new GeneralService(client);
// testName = 'ADAL Fixture';
// service.PrintMemoryUseToLog('Start', testName);
// testerFunctions = service.initiateTesterFunctions(client, testName);
// //all ADAL relevant tests
// await DBSchemaTests(service, request, testerFunctions);
// await DBSchemaTestsPart2(service, request, testerFunctions);
// await SchemaTypeDataIndexedTests(service, request, testerFunctions),
// await BatchUpsertTests(service, request, testerFunctions);
// await DimxDataImportTests(service, request, testerFunctions);
// await DIMXrecursive(service, request, testerFunctions);
// await ADALTests(service, request, testerFunctions);
// await DataIndexTests(service, request, testerFunctions);
// await DataIndexADALTests(service, request, testerFunctions);
// service.PrintMemoryUseToLog('End', testName);
// return await testerFunctions.run();
// }

// testerFunctions = service.initiateTesterFunctions(client, testName);
//     await UDTTests(service, testerFunctions);
//     await UsersTests(service, testerFunctions);
//     await AccountsTests(service, testerFunctions);
//     await ContactsTests(service, testerFunctions);
//     await GeneralActivitiesTests(service, testerFunctions);
//     await TransactionTests(service, testerFunctions);
//     await test_data(client, testerFunctions);
//     service.PrintMemoryUseToLog('End', testName);
//     return await testerFunctions.run();
