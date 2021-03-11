import { Client, Request } from '@pepperi-addons/debug-server';
import tester from './tester';
import GeneralService, { TesterFunctions } from './services/general.service';
import { TestDataTest } from './api-tests/test_data';
import { FileStorageTests } from './api-tests/file_storage';
import { DataViewsTestsBase, DataViewsTestsPositive, DataViewsTestsNegative } from './api-tests/data_views';
import { FieldsTests } from './api-tests/fields';
import { SyncLongTests, SyncTests, SyncWithBigData, SyncClean } from './api-tests/sync';
import { ObjectsTests } from './api-tests/objects';
import { ElasticSearchTests } from './api-tests/elasticSearch';
import { AuditLogsTests } from './api-tests/audit_logs';
import { VarTests } from './api-tests/var';
import {
    BaseAddonsTests,
    UninstallAddonsTests,
    SingleMaintenanceAndDependenciesAddonsTests,
    MaintenanceFullTests,
} from './api-tests/addons';
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
import { UpgradeDependenciesTests } from './api-tests/upgrade_dependencies';

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

export async function all(client: Client, testerFunctions: TesterFunctions) {
    testName = 'All';
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

export async function file_storage(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'File_Storage' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'File_Storage';
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
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Data_Views' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Data_Views';
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
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Data_Views_Positive' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Data_Views_Positive';
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
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Data_Views_Negative' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Data_Views_Negative';
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
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Fields' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Fields';
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
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Sync' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Sync';
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
        SyncClean(service, testerFunctions),
    ]).then(() => testerFunctions.run());
    PrintMemoryUseToLog('End', testName);
    testName = '';
    return testResult;
}

export async function objects(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);

    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Objects' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Objects';
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
            ObjectsTests(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return ObjectsTests(service, testerFunctions);
    }
}

export async function elastic_search(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);

    if (client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') || testName != 'Elastic_Search') {
        testName = 'Elastic_Search';
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
            ElasticSearchTests(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return ElasticSearchTests(service, testerFunctions);
    }
}

export async function audit_logs(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Audit_Logs' && testName != 'All' && testName != 'Sanity')
    ) {
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
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Var' && testName != 'All' && testName != 'Sanity')
    ) {
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
        testName = '';
        return testResult;
    } else {
        return VarTests(service, request, testerFunctions);
    }
}

export async function addons(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Addons' && testName != 'All' && testName != 'Sanity')
    ) {
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
        testName = '';
        return testResult;
    } else {
        return BaseAddonsTests(service, request, testerFunctions);
    }
}

export async function addons_uninstall(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Addons_Uninstall' && testName != 'All' && testName != 'Sanity')
    ) {
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
        testName = '';
        return testResult;
    } else {
        return UninstallAddonsTests(service, request, testerFunctions);
    }
}

export async function maintenance(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Addons' && testName != 'All' && testName != 'Sanity')
    ) {
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
        testName = '';
        return testResult;
    } else {
        return SingleMaintenanceAndDependenciesAddonsTests(service, request, testerFunctions);
    }
}

export async function maintenance_full(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Addons' && testName != 'All' && testName != 'Sanity')
    ) {
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
        testName = '';
        return testResult;
    } else {
        return MaintenanceFullTests(service, request, testerFunctions);
    }
}

export async function import_export_atd_activities(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Import_Export_ATD_Activities' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Import_Export_ATD_Activities';
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
            ImportExportATDActivitiesTests(service, request, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return ImportExportATDActivitiesTests(service, request, testerFunctions);
    }
}

export async function import_export_atd_transactions(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Import_Export_ATD_Transactions' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Import_Export_ATD_Transactions';
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
            ImportExportATDTransactionsTests(service, request, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return ImportExportATDTransactionsTests(service, request, testerFunctions);
    }
}

export async function import_export_atd_activities_box(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Import_Export_ATD_Activities_Box' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Import_Export_ATD_Activities_Box';
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
            ImportExportATDActivitiesBoxTests(service, request, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return ImportExportATDActivitiesBoxTests(service, request, testerFunctions);
    }
}

export async function import_export_atd_transactions_box(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Import_Export_ATD_Transactions_Box' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Import_Export_ATD_Transactions_Box';
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
            ImportExportATDTransactionsBoxTests(service, request, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return ImportExportATDTransactionsBoxTests(service, request, testerFunctions);
    }
}

export async function import_export_atd_activities_override(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Import_Export_ATD_Activities_Override' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Import_Export_ATD_Activities_Override';
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
            ImportExportATDActivitiesOverrideTests(service, request, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return ImportExportATDActivitiesOverrideTests(service, request, testerFunctions);
    }
}

export async function import_export_atd_transactions_override(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Import_Export_ATD_Transactions_Override' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Import_Export_ATD_Transactions_Override';
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
            ImportExportATDTransactionsOverrideTests(service, request, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return ImportExportATDTransactionsOverrideTests(service, request, testerFunctions);
    }
}

export async function import_export_atd_transactions_override_winzer(
    client: Client,
    request: Request,
    testerFunctions: TesterFunctions,
) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Import_Export_ATD_Transactions_Override_Winzer' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Import_Export_ATD_Transactions_Override_Winzer';
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
            ImportExportATDTransactionsOverrideWinzerTests(service, request, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return ImportExportATDTransactionsOverrideWinzerTests(service, request, testerFunctions);
    }
}

export async function import_export_atd_local(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Import_Export_ATD_Local' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Import_Export_ATD_Local';
        ImportExportATDLocalTests;
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
            ImportExportATDLocalTests(service, request, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return ImportExportATDLocalTests(service, request, testerFunctions);
    }
}

export async function upgrade_dependencies(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Upgrade_Dependencies' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Upgrade_Dependencies';
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
            UpgradeDependenciesTests(service, request, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return UpgradeDependenciesTests(service, request, testerFunctions);
    }
}
