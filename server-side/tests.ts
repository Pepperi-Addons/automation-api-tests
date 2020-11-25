import { Client, Request } from '@pepperi-addons/debug-server';
import tester from './tester';
import GeneralService, { TesterFunctions } from './services/general.service';
import { TestDataTest } from './api-tests/test_data';
import { FileStorageTests } from './api-tests/file_storage';
import { DataViewsTestsBase, DataViewsTestsPositive, DataViewsTestsNegative } from './api-tests/data_views';
import { FieldsTests } from './api-tests/fields';
import { SyncLongTests, SyncTests, SyncWithBigData, SyncClean } from './api-tests/sync';
import { ObjectsTests } from './api-tests/objects';
import { AuditLogsTests } from './api-tests/audit_logs';
import { VarTests } from './api-tests/var';
import {
    BaseAddonsTests,
    UninstallAddonsTests,
    SingleMaintenanceAndDependenciesAddonsTests,
    MaintenanceFullTests,
} from './api-tests/addons';
import { ImportExportATDTests } from './api-tests/import_export_atd';
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

export async function import_export_atd(client: Client, request: Request, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Import_Export_Atd' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Import_Export_Atd';
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
            ImportExportATDTests(service, request, testerFunctions),
        ]).then(() => testerFunctions.run());
        PrintMemoryUseToLog('End', testName);
        testName = '';
        return testResult;
    } else {
        return ImportExportATDTests(service, request, testerFunctions);
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
