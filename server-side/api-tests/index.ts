//#region Service Tests
import { TestDataTests } from './test-service/test_data';
import { UpgradeDependenciesTests } from './test-service/upgrade_dependencies';
import { LocalAddonFileCreatorTests } from './test-service/local_addon_file_creator';
//#endregion Service Tests

//#region All Tests
import { FileStorageTests } from './objects/file_storage';
import { DataViewsTestsBase, DataViewsTestsPositive, DataViewsTestsNegative } from './objects/data_views';
import { FieldsTests } from './objects/fields';
import { SyncLongTests, SyncTests, SyncWithBigDataTests, SyncCleanTests } from './sync';
//#endregion All Tests

//#region Pages API test
import { PagesTestSuite } from './page-objects/pages';
//#endregion Pages API test

//#region Old Framwork Tests
import {
    BaseAddonsTests,
    UninstallAddonsTests,
    SingleMaintenanceAndDependenciesAddonsTests,
    MaintenanceFullTests,
} from './addons';
import { VarTests, CreateTestDataAddon } from './var';
import { AuditLogsTests } from './audit_logs';
import { AddonAuditLogsTests } from './addon_audit_logs';
import { AddonAsyncExecutionTests } from './addon_async_execution';
//#endregion Old Framwork Tests

//#region Oleg's Framwork Tests
import { DBSchemaTests } from './schema';
import { SchemaTypeDataIndexedTests } from './schema_type_data_index';
import { BatchUpsertTests } from './batch_upsert';
import { DimxDataImportTests } from './dimx_data_import';
import { SchedulerTests } from './code-jobs/scheduler';
import { SchedulerTestsOld } from './code-jobs/scheduler-old';
import { CodeJobsTests } from './code-jobs/code_jobs';
import { TimeOutAddonJobsTests } from './code-jobs/timeout_addon_jobs';
import { AddonJobsTests } from './code-jobs/addon_jobs';
import { InstallTests } from './code-jobs/install';
import { CodeJobsRetryTests } from './code-jobs/code_jobs_retry';
import { CodeJobsAddonTests } from './code-jobs/code_jobs_addon';
import { AddonRelationTests } from './addon_relation';
import { UsageMonitorTests } from './usage_monitor';
import { AsyncAddonGetRemoveTests } from './objects/async_addon_get_remove_codejobs';
//#endregion Oleg's Framwork Tests

//#region Yoni's Tests
import { UDTTests } from './objects/udt';
import { UsersTests } from './objects/users';
import { AccountsTests } from './objects/accounts';
import { BulkBigDataTests } from './objects/bulk_big_data';
import { ContactsTests } from './objects/contacts';
import { GeneralActivitiesTests } from './objects/general_activities';
import { TransactionTests } from './objects/transactions';
import { ElasticSearchTests } from './elastic_search';
import { OpenCatalogTests } from './open_catalog';
import { DistributorTests } from './objects/distributor';
import { UDCTests } from './user_defined_collections';
//#endregion Yoni's Tests

//#region Evgeny's Tests
import { ChartManagerTests } from './chart_manager';
import { DataQueriesTests } from './data_queries';
import { AWSLogsTest } from './logs_api';

//#endregion Evgenys's Tests

import {
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
} from './import_export_atd';
import { ADALTests } from './adal';
import { PepperiNotificationServiceTests } from './pepperi_notification_service';
import { NucRecoveryTests, NucRecoverySDKTests, NucRecoveryWACDTests } from './nuc_recovery';
import { DataIndexTests } from './data_index';
import { DataIndexADALTests } from './data_index_adal';
import { MaintenanceJobTests } from './maintenance_job';
import { CPINodeTests } from './cpi_node';
import { CodeJobsCleanTests } from './code-jobs/code_jobs_clean';
import { VarSystemAddonsTests } from './var_system_addons';
import {
    AddonDataImportExportTests,
    AddonDataImportExportPerformanceTests,
    AddonDataImportExportReferenceTests,
} from './addon_data_import_export';
import { ADALStressTests } from './adal_stress';
import { PFSTests } from './pepperi_file_service';
import { DIMXrecursive } from './DIMX_recursive';
import { SecurityTests } from './security';

export {
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
    SchemaTypeDataIndexedTests,
    BatchUpsertTests,
    DimxDataImportTests,
    SchedulerTests,
    SchedulerTestsOld,
    CodeJobsTests,
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
    AsyncAddonGetRemoveTests,
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
};
