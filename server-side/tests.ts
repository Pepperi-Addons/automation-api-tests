import { Client, Request } from '@pepperi-addons/debug-server';
import tester from './tester';
import GeneralService, { TesterFunctions } from './services/general.service';
import { TestDataTest } from './api-tests/test_data';
import { FileStorageTests } from './api-tests/file_storage';
import { DataViewsTests } from './api-tests/data_views';
import { FieldsTests } from './api-tests/fields';
import { SyncAllTests, SyncTests } from './api-tests/sync';
import { ObjectsTests } from './api-tests/objects';
import { AuditLogsTests } from './api-tests/audit_logs';
import { VarTests } from './api-tests/var';
import { AddonsTests } from './api-tests/addons';

let testName = '';
let testEnvironment = '';

export async function all(client: Client, testerFunctions: TesterFunctions) {
    testName = 'All';
    testEnvironment = client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
    const { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults } = tester(
        testName,
        testEnvironment,
    );
    testerFunctions = { describe, expect, it, run, setNewTestHeadline, addTestResultUnderHeadline, printTestResults };
    const testResult = await Promise.all([
        await test_data(client, testerFunctions),
        sync(client, testerFunctions),
        data_views(client, testerFunctions),
        audit_logs(client, testerFunctions),
        file_storage(client, testerFunctions),
        fields(client, testerFunctions),
    ]).then(() => testerFunctions.run());
    testName = '';
    return testResult;
}

export async function sanity(client: Client, testerFunctions: TesterFunctions) {
    testName = 'Sanity';
    testEnvironment = client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
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
    testName = '';
    return testResult;
}

export async function test_data(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (testName == '') {
        testName = 'Test_Data';
        testEnvironment = client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
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
        testEnvironment = client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
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
        testEnvironment = client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
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
            DataViewsTests(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        testName = '';
        return testResult;
    } else {
        return DataViewsTests(service, testerFunctions);
    }
}
export async function fields(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Fields' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Fields';
        testEnvironment = client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
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
        testEnvironment = client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
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
            SyncTests(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        testName = '';
        return testResult;
    } else {
        return SyncAllTests(service, testerFunctions);
    }
}

export async function objects(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);

    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Objects' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Objects';
        testEnvironment = client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
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
        testEnvironment = client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
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
        testEnvironment = client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
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
        testName = '';
        return testResult;
    } else {
        return VarTests(service, request, testerFunctions);
    }
}

export async function addons(client: Client, testerFunctions: TesterFunctions) {
    const service = new GeneralService(client);
    if (
        client.BaseURL.includes('staging') != testEnvironment.includes('Sandbox') ||
        (testName != 'Addons' && testName != 'All' && testName != 'Sanity')
    ) {
        testName = 'Addons';
        testEnvironment = client.BaseURL.includes('staging') ? 'Sandbox' : 'Production';
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
            AddonsTests(service, testerFunctions),
        ]).then(() => testerFunctions.run());
        testName = '';
        return testResult;
    } else {
        return AddonsTests(service, testerFunctions);
    }
}
