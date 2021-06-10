import { Client, Request } from '@pepperi-addons/debug-server';
import tester from './tester';
import GeneralService, { TesterFunctions } from './services/general.service';

//#region Service Tests
import { TestDataTest } from './api-tests/test-service/test_data';
import { UpgradeDependenciesTests } from './api-tests/test-service/upgrade_dependencies';
//#endregion Service Tests

//#region All Tests
import { FileStorageTests } from './api-tests/objects/file_storage';
import { DataViewsTestsBase, DataViewsTestsPositive, DataViewsTestsNegative } from './api-tests/objects/data_views';
import { FieldsTests } from './api-tests/objects/fields';
import { SyncLongTests, SyncTests, SyncWithBigData, SyncClean } from './api-tests/sync';
//#endregion All Tests

//#region Old Framwork Tests
import {
    BaseAddonsTests,
    UninstallAddonsTests,
    SingleMaintenanceAndDependenciesAddonsTests,
    MaintenanceFullTests,
} from './api-tests/addons';
import { VarTests, CreateTestDataAddon } from './api-tests/var';
import { AuditLogsTests } from './api-tests/audit_logs';
//#endregion Old Framwork Tests

//#region Oleg's Framwork Tests
import { DBSchemaTests } from './api-tests/schema';
import { SchedulerTests } from './api-tests/code-jobs/scheduler';
import { CodeJobsTests } from './api-tests/code-jobs/code_jobs';
import { InstallTests } from './api-tests/code-jobs/install';
import { CodeJobsRetryTests } from './api-tests/code-jobs/code_jobs_retry';
import { CodeJobsAddonTests } from './api-tests/code-jobs/code_jobs_addon';
import { AddonRelationTests } from './api-tests/addon_relation';
//#endregion Oleg's Framwork Tests

//#region Yoni's Tests
import { UDTTests } from './api-tests/objects/udt';
import { UsersTests } from './api-tests/objects/users';
import { AccountsTests } from './api-tests/objects/accounts';
import { BulkBigDataTests } from './api-tests/objects/bulk_big_data';
import { ContactsTests } from './api-tests/objects/contacts';
import { GeneralActivitiesTests } from './api-tests/objects/general_activities';
import { TransactionTests } from './api-tests/objects/transactions';
import { ElasticSearchTests } from './api-tests/elastic_search';
import { OpenCatalogTests } from './api-tests/open_catalog';
//#endregion Yoni's Tests

import {
    ImportExportATDActivitiesTests,
    ImportExportATDTransactionsTests,
    ImportExportATDActivitiesBoxTests,
    ImportExportATDTransactionsBoxTests,
    ImportExportATDActivitiesOverrideTests,
    ImportExportATDTransactionsOverrideTests,
    ImportExportATDTransactionsOverrideWinzerTests,
    ImportExportATDLocalTests,
} from './api-tests/import_export_atd';
import { ADALTests } from './api-tests/adal';
import { PepperiNotificationServiceTests } from './api-tests/pepperi_notification_service';
import { NucRecoveryTests } from './api-tests/nuc_recovery';
import { DataIndexTests } from './api-tests/data_index';
import { CPINodeTests } from './api-tests/cpi_node';
import { CodeJobsCleanTests } from './api-tests/code-jobs/code_jobs_clean';

let testName = '';
let testEnvironment = '';

//#region Service Tests
export async function test_data(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName == '') {
        testName = 'Test_Data';
        service.PrintMemoryUseToLog('Start', testName);
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(client, testName, testEnvironment);
        testerFunctions = {
            describe,
            expect,
            it,
            run,
        };
        const testResult = await Promise.all([await test_data(client, testerFunctions)]).then(() =>
            testerFunctions.run(),
        );
        service.PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return TestDataTest(service, testerFunctions);
    }
}

export async function upgrade_dependencies(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Upgrade_Dependencies';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        UpgradeDependenciesTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}
//#endregion Service Tests

//#region All Tests
export async function all(client: Client, testerFunctions: TesterFunctions) {
    testName = 'All';
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = { describe, expect, it, run };
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
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(client, testName, testEnvironment);
        testerFunctions = {
            describe,
            expect,
            it,
            run,
        };
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
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(client, testName, testEnvironment);
        testerFunctions = {
            describe,
            expect,
            it,
            run,
        };
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
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(client, testName, testEnvironment);
        testerFunctions = {
            describe,
            expect,
            it,
            run,
        };
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
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(client, testName, testEnvironment);
        testerFunctions = {
            describe,
            expect,
            it,
            run,
        };
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
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(client, testName, testEnvironment);
        testerFunctions = {
            describe,
            expect,
            it,
            run,
        };
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
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(client, testName, testEnvironment);
        testerFunctions = {
            describe,
            expect,
            it,
            run,
        };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        SyncWithBigData(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
}

export async function sync_clean(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Sync_Clean';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        SyncClean(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
}
//#endregion All Tests

//#region Old Framwork Tests
export async function audit_logs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'Audit_Logs' && testName != 'Sanity') {
        testName = 'Audit_Logs';
        service.PrintMemoryUseToLog('Start', testName);
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
            client,
            testName,
            testEnvironment,
        );
        testerFunctions = {
            describe,
            expect,
            it,
            run,
            setNewTestHeadline,
            addTestResultUnderHeadline,
            printTestResults,
        };
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

export async function var_api(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Var';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
        client,
        testName,
        testEnvironment,
    );
    testerFunctions = {
        describe,
        expect,
        it,
        run,
        setNewTestHeadline,
        addTestResultUnderHeadline,
        printTestResults,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        VarTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function create_test_data_addon(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Create_Test_Data_Addon';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
        client,
        testName,
        testEnvironment,
    );
    testerFunctions = {
        describe,
        expect,
        it,
        run,
        setNewTestHeadline,
        addTestResultUnderHeadline,
        printTestResults,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
        client,
        testName,
        testEnvironment,
    );
    testerFunctions = {
        describe,
        expect,
        it,
        run,
        setNewTestHeadline,
        addTestResultUnderHeadline,
        printTestResults,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
        client,
        testName,
        testEnvironment,
    );
    testerFunctions = {
        describe,
        expect,
        it,
        run,
        setNewTestHeadline,
        addTestResultUnderHeadline,
        printTestResults,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
        client,
        testName,
        testEnvironment,
    );
    testerFunctions = {
        describe,
        expect,
        it,
        run,
        setNewTestHeadline,
        addTestResultUnderHeadline,
        printTestResults,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
        client,
        testName,
        testEnvironment,
    );
    testerFunctions = {
        describe,
        expect,
        it,
        run,
        setNewTestHeadline,
        addTestResultUnderHeadline,
        printTestResults,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, assert, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        assert,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        DBSchemaTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function scheduler(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Scheduler';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, assert, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        assert,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        SchedulerTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function code_jobs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Code_Jobs';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, assert, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        assert,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        CodeJobsTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function install(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Install';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, assert, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        assert,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, assert, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        assert,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, assert, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        assert,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, assert, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        AddonRelationTests(service, request, testerFunctions),
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ElasticSearchTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function open_catalog(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Open_catalog';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        OpenCatalogTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
}
//#endregion Yoni's Tests

//#region import export ATD Tests
export async function import_export_atd_activities(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Activities';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDTransactionsOverrideWinzerTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function import_export_atd_local(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Local';
    ImportExportATDLocalTests;
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ImportExportATDLocalTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}
//#endregion import export ATD Tests

export async function adal(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'ADAL';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        ADALTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function pepperi_notification_service(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Pepperi_Notification_Service';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        NucRecoveryTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function data_index(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Data_Index';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        DataIndexTests(service, request, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function cpi_node(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'CPI_Node';
    service.PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        it,
        run,
    };
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
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, assert, it, run } = tester(client, testName, testEnvironment);
    testerFunctions = {
        describe,
        expect,
        assert,
        it,
        run,
    };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        CodeJobsCleanTests(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    service.PrintMemoryUseToLog('End', testName);
    return testResult;
}
