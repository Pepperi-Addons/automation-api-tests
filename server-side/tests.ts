import { Client, Request } from '@pepperi-addons/debug-server';
import tester from './tester';
import GeneralService, { TesterFunctions } from './services/general.service';

//#region Service Tests
import { TestDataTest } from './api-tests/test_data';
import { UpgradeDependenciesTests } from './api-tests/upgrade_dependencies';
//#endregion Service Tests

//#region All Tests
import { FileStorageTests } from './api-tests/file_storage';
import { DataViewsTestsBase, DataViewsTestsPositive, DataViewsTestsNegative } from './api-tests/data_views';
import { FieldsTests } from './api-tests/fields';
import { SyncLongTests, SyncTests, SyncWithBigData, SyncClean } from './api-tests/sync';
//#endregion All Tests

//#region Old Framwork Tests
import {
    BaseAddonsTests,
    UninstallAddonsTests,
    SingleMaintenanceAndDependenciesAddonsTests,
    MaintenanceFullTests,
} from './api-tests/addons';
import { VarTests } from './api-tests/var';
import { AuditLogsTests } from './api-tests/audit_logs';
//#endregion Old Framwork Tests

//#region Yonis Tests
import { ObjectsTests } from './api-tests/objects';
import { ElasticSearchTests } from './api-tests/elastic_search';
import { OpenCatalogTests } from './api-tests/open_catalog';
//#endregion Yonis Tests

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
import { DataIndexTests } from './api-tests/data_index';
import { CPINodeTests } from './api-tests/cpi_node';

let testName = '';
let testEnvironment = '';

function CalculateUsedMemory() {
    const used = process.memoryUsage();
    const memoryUsed = {};
    for (const key in used) {
        memoryUsed[key] = Math.round((used[key] / 1024 / 1024) * 100) / 100;
    }
    console.log(`memoryUse in MB = ${JSON.stringify(memoryUsed)}`);
}

function PrintMemoryUseToLog(state, testName) {
    console.log(`${state} Test: ${testName}`);
    CalculateUsedMemory();
}

//#region Service Tests
export async function test_data(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName == '') {
        testName = 'Test_Data';
        PrintMemoryUseToLog('Start', testName);
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(testName, testEnvironment);
        testerFunctions = {
            describe,
            expect,
            it,
            run,
        };
        const testResult = await Promise.all([await test_data(client, testerFunctions)]).then(() =>
            testerFunctions.run(),
        );
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return TestDataTest(service, testerFunctions);
    }
}

export async function upgrade_dependencies(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Upgrade_Dependencies';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}
//#endregion Service Tests

//#region All Tests
export async function all(client: Client, testerFunctions: TesterFunctions) {
    testName = 'All';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
    testerFunctions = { describe, expect, it, run };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        sync(client, testerFunctions),
        file_storage(client, testerFunctions),
        fields(client, testerFunctions),
    ]).then(() => testerFunctions.run());
    PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
}

export async function sanity(client: Client, testerFunctions: TesterFunctions) {
    testName = 'Sanity';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
        testName,
        testEnvironment,
    );
    testerFunctions = { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        audit_logs(client, testerFunctions),
        objects(client, testerFunctions),
    ]).then(() => testerFunctions.run());
    PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
}

export async function file_storage(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'File_Storage' && testName != 'All') {
        testName = 'File_Storage';
        PrintMemoryUseToLog('Start', testName);
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(testName, testEnvironment);
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
        PrintMemoryUseToLog('End', testName);
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
        PrintMemoryUseToLog('Start', testName);
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(testName, testEnvironment);
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
        PrintMemoryUseToLog('End', testName);
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
        PrintMemoryUseToLog('Start', testName);
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(testName, testEnvironment);
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
        PrintMemoryUseToLog('End', testName);
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
        PrintMemoryUseToLog('Start', testName);
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(testName, testEnvironment);
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
        PrintMemoryUseToLog('End', testName);
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
        PrintMemoryUseToLog('Start', testName);
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(testName, testEnvironment);
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
        PrintMemoryUseToLog('End', testName);
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
        PrintMemoryUseToLog('Start', testName);
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(testName, testEnvironment);
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
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return SyncTests(service, testerFunctions);
    }
}

export async function sync_big_data(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Sync_Big_Data';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
}

export async function sync_clean(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Sync_Clean';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
}
//#endregion All Tests

//#region Old Framwork Tests
export async function audit_logs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'Audit_Logs' && testName != 'Sanity') {
        testName = 'Audit_Logs';
        PrintMemoryUseToLog('Start', testName);
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
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
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return AuditLogsTests(service, testerFunctions);
    }
}

export async function var_api(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Var';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function addons(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addons';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function addons_uninstall(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Addons_Uninstall';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function maintenance(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Maintenance_and_Dependencies';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function maintenance_full(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Maintenance_Full';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}
//#endregion Old Framwork Tests

//#region Yonis Tests
export async function objects(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName != 'Objects' && testName != 'Sanity') {
        testName = 'Objects';
        PrintMemoryUseToLog('Start', testName);
        testEnvironment = client.BaseURL.includes('staging')
            ? 'Sandbox'
            : client.BaseURL.includes('papi-eu')
            ? 'Production-EU'
            : 'Production';
        const { describe, expect, it, run } = tester(testName, testEnvironment);
        testerFunctions = {
            describe,
            expect,
            it,
            run,
        };
        const testResult = await Promise.all([
            await test_data(client, testerFunctions),
            ObjectsTests(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return ObjectsTests(service, testerFunctions);
    }
}

export async function elastic_search(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Elastic_Search';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function open_catalog(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Open_catalog';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
}
//#endregion Yonis Tests

//#region import export ATD Tests
export async function import_export_atd_activities(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Activities';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function import_export_atd_transactions(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Transactions';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function import_export_atd_activities_box(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Activities_Box';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function import_export_atd_transactions_box(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Transactions_Box';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function import_export_atd_activities_override(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Activities_Override';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function import_export_atd_transactions_override(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Transactions_Override';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function import_export_atd_transactions_override_winzer(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Transactions_Override_Winzer';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function import_export_atd_local(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Import_Export_ATD_Local';
    ImportExportATDLocalTests;
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}
//#endregion import export ATD Tests

export async function adal(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'ADAL';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function pepperi_notification_service(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Pepperi_Notification_Service';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function data_index(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'Data_Index';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}

export async function cpi_node(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    testName = 'CPI_Node';
    PrintMemoryUseToLog('Start', testName);
    testEnvironment = client.BaseURL.includes('staging')
        ? 'Sandbox'
        : client.BaseURL.includes('papi-eu')
        ? 'Production-EU'
        : 'Production';
    const { describe, expect, it, run } = tester(testName, testEnvironment);
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
    PrintMemoryUseToLog('End', testName);
    return testResult;
}
