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
    SyncWithBigDataTests,
    SyncCleanTests,
    PagesTestSuite,
    BaseAddonsTests,
    UninstallAddonsTests,
    SingleMaintenanceAndDependenciesAddonsTests,
    MaintenanceFullTests,
    VarTests,
    CreateTestDataAddon,
    AuditLogsTests,
    AddonAuditLogsTests,
    AddonAsyncExecutionTests,
    DBSchemaTests,
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
} from './api-tests/index';

let testName = '';

//#region Service Tests
export async function test_data(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName == '') {
        testName = 'Test_Data';
        service.PrintMemoryUseToLog('Start', testName);
        testerFunctions = service.initiateTesterFunctions(client, testName);
        const testResult = await Promise.all([await test_data(client, testerFunctions)]).then(() =>
            testerFunctions.run(),
        );
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return TestDataTests(service, testerFunctions);
    }
}

export async function upgrade_dependencies(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Upgrade_Dependencies';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await UpgradeDependenciesTests(service, request, testerFunctions),
        await test_data(client, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function upload_local_file(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Local_Addon_File_Creator_Tests';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        LocalAddonFileCreatorTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}
//#endregion Service Tests

//#region All Tests
export async function all(client: Client, testerFunctions: TesterFunctions) {
    testName = 'All';
    const service = new GeneralService(client);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        sync(client, testerFunctions),
        file_storage(client, testerFunctions),
        fields(client, testerFunctions),
    ]).then(() => testerFunctions.run());
    testName = '';
    return testResult;
}

export async function file_storage(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'File_Storage' && testName != 'All') {
        testName = 'File_Storage';
        service.PrintMemoryUseToLog('Start', testName);
        testerFunctions = service.initiateTesterFunctions(client, testName);
        const testResult = await Promise.all([
            await test_data(client, testerFunctions),
            FileStorageTests(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
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
        const testResult = await Promise.all([
            await test_data(client, testerFunctions),
            DataViewsTestsBase(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
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
        const testResult = await Promise.all([
            await test_data(client, testerFunctions),
            DataViewsTestsPositive(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
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
        const testResult = await Promise.all([
            await test_data(client, testerFunctions),
            DataViewsTestsNegative(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
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
        const testResult = await Promise.all([
            await test_data(client, testerFunctions),
            FieldsTests(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
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
        const testResult = await Promise.all([
            await test_data(client, testerFunctions),
            SyncLongTests(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return SyncTests(service, testerFunctions);
    }
}

export async function sync_big_data(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Sync_Big_Data';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        SyncWithBigDataTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
}

export async function sync_clean(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Sync_Clean';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        SyncCleanTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
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
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        PagesTestSuite(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

//#region Old Framwork Tests
export async function audit_logs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'Audit_Logs' && testName != 'Sanity') {
        testName = 'Audit_Logs';
        service.PrintMemoryUseToLog('Start', testName);
        testerFunctions = service.initiateTesterFunctions(client, testName);

        const testResult = await Promise.all([
            await test_data(client, testerFunctions),
            AuditLogsTests(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
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

        const testResult = await Promise.all([
            await test_data(client, testerFunctions),
            AddonAuditLogsTests(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return AddonAuditLogsTests(service, testerFunctions);
    }
}

export async function addon_async_execution(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addon_Async_Execution';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await AddonAsyncExecutionTests(service, testerFunctions),
        await test_data(client, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
}

export async function var_api(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Var';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        VarTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function var_system_addons(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Var System Addons';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([VarSystemAddonsTests(service, request, testerFunctions)]).then(() =>
        testerFunctions.run(),
    );
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function create_test_data_addon(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Create_Test_Data_Addon';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        CreateTestDataAddon(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function addons(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addons';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        BaseAddonsTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function addons_uninstall(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addons_Uninstall';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        UninstallAddonsTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function maintenance(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Maintenance_and_Dependencies';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        SingleMaintenanceAndDependenciesAddonsTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function maintenance_full(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Maintenance_Full';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        MaintenanceFullTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}
//#endregion Old Framwork Tests

//#region Oleg's Framwork Tests
export async function schema(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Schema';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        DBSchemaTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function batch_upsert(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Batch_Upsert';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        BatchUpsertTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function dimx_data_import(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'dimx_data_import';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        DimxDataImportTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function scheduler(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Scheduler';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    // let testResult;
    //TODO: Run new SchedulerTests on Stage and old SchedulerTests on other
    //TODO: If tests pass on 13/03/2022 remove these comments
    // if (client.BaseURL.includes('staging')) {
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        SchedulerTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    // } else {
    //     testResult = await Promise.all([
    //         await test_data(client, testerFunctions),
    //         SchedulerTestsOld(service, testerFunctions),
    //     ]).then(() => testerFunctions.run());
    // }
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function code_jobs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Code_Jobs';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    // let testResult;
    //TODO: Remove the code_jobs endpoint from Jenkins, This test was removed from Stage: "CodeJobsTests", This test was added for now: "AddonJobsTests"
    //TODO: If tests pass on 13/03/2022 remove these comments
    // if (client.BaseURL.includes('staging')) {
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        AddonJobsTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    // } else {
    //     testResult = await Promise.all([
    //         await test_data(client, testerFunctions),
    //         CodeJobsTests(service, testerFunctions),
    //     ]).then(() => testerFunctions.run());
    // }
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function addon_jobs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addon_Jobs';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        AddonJobsTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function timeout_addon_jobs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'TimeOut_Addon_Jobs';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        TimeOutAddonJobsTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function install(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Install';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        InstallTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function code_jobs_addon(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Code_Jobs_Addon';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        CodeJobsAddonTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function code_jobs_retry(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Code_Jobs_Retry';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        CodeJobsRetryTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function addon_relations(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Relations';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        AddonRelationTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function usage_monitor(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Usage_Monitor';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        UsageMonitorTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}
//#endregion Oleg's Framwork Tests

//#region Yoni's Tests
export async function objects(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Objects';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        UDTTests(service, testerFunctions),
        UsersTests(service, testerFunctions),
        AccountsTests(service, testerFunctions),
        ContactsTests(service, testerFunctions),
        GeneralActivitiesTests(service, testerFunctions),
        TransactionTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function udt(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'UDT';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        UDTTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function users(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Users';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        UsersTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function accounts(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Accounts';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        AccountsTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function bulk_big_data(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Bulk_Big_Data';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        BulkBigDataTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function contacts(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Contacts';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ContactsTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function general_activities(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'General_Activities';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        GeneralActivitiesTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function transactions(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Transactions';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        TransactionTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function elastic_search(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Elastic_Search';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ElasticSearchTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function open_catalog(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Open_Catalog';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        OpenCatalogTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
}

export async function distributor(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Distributor';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([DistributorTests(service, request, testerFunctions)]).then(() =>
        testerFunctions.run(),
    );
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function pfs(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'PFS';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        PFSTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function dimxrecursive(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'DIMX Recursive';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        DIMXrecursive(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function udc(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'UDC';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        UDCTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}
//#endregion Yoni's Tests

//#region Evgeny's Tests
export async function charts_manager(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Charts_Manager';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ChartManagerTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function data_queries(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Data_Queries';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        DataQueriesTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function aws_logs(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Data_Queries';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        AWSLogsTest(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}
//#endregion Evgeny's Tests

//#region import export ATD Tests
export async function import_export_atd_activities(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Activities';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDActivitiesTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
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
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDTransactionsTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
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
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDActivitiesBoxTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
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
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDTransactionsBoxTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
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
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDActivitiesOverrideTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
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
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDTransactionsOverrideTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
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
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDTransactionsOverrideWinzerTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
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
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDTransactionsOverrideWinzerTestsTwo(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
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
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDTransactionsOverrideWinzerTestsThree(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function import_export_atd_local(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Local';
    ImportExportATDLocalTests;
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDLocalTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
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
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDTransactionsOverridBugReproductionTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}
//#endregion import export ATD Tests

export async function adal(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'ADAL';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ADALTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function adal_stress(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'ADAL_Stress';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ADALStressTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function pepperi_notification_service(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Pepperi_Notification_Service';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        PepperiNotificationServiceTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function nuc_recovery(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'NUC_Recovery';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        NucRecoveryTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function nuc_recovery_sdk(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'NUC_Recovery_SDK';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        NucRecoverySDKTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function nuc_recovery_wacd(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'NUC_Recovery_WACD';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        NucRecoveryWACDTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function data_index(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Data_Index';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        DataIndexTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function data_index_adal(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Data_Index_ADAL';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        DataIndexADALTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function maintenance_job(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Maintenance_Job';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        MaintenanceJobTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function cpi_node(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'CPI_Node';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        CPINodeTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function code_jobs_clean(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Code_Jobs_Clean';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        CodeJobsCleanTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function addon_data_import_export(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addon_Data_Import_Export';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        AddonDataImportExportTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
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
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        AddonDataImportExportPerformanceTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
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
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        AddonDataImportExportReferenceTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function security(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addon_Data_Import_Export_Reference';
    service.PrintMemoryUseToLog('Start', testName);
    testerFunctions = service.initiateTesterFunctions(client, testName);
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        SecurityTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}
