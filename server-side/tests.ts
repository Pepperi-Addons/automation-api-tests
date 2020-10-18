import { Client, Request } from '@pepperi-addons/debug-server';
import tester from './tester';
import GeneralService from './services/general.service';
import { TestData } from './api-tests/test_data';
import { FileStorageTests } from './api-tests/file_storage';
import { DataViewsTests } from './api-tests/data_views';
import { FieldsTests } from './api-tests/fields';
import { SyncAllTests, SyncTests } from './api-tests/sync';
import { ObjectsTests } from './api-tests/objects';
import { AuditLogsTests } from './api-tests/audit_logs';
import { VarAPITests } from './api-tests/var_api';

export async function all(client: Client) {
    const { describe, expect, it, run } = tester('All', client.BaseURL.includes('staging') ? 'Sandbox' : 'Production');
    return Promise.all([
        await test_data(client, describe, expect, it),
        file_storage(client, describe, expect, it),
        data_views(client, describe, expect, it),
        fields(client, describe, expect, it),
        sync(client, describe, expect, it),
        objects(client, describe, expect, it),
        audit_logs(client, describe, expect, it),
    ]).then(() => run());
}

export async function sanity(client: Client) {
    const { describe, expect, it, run } = tester(
        'Sanity',
        client.BaseURL.includes('staging') ? 'Sandbox' : 'Production',
    );
    return Promise.all([
        await test_data(client, describe, expect, it),
        objects(client, describe, expect, it),
        audit_logs(client, describe, expect, it),
    ]).then(() => run());
}

export async function test_data(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester(
            'Test_Data',
            client.BaseURL.includes('staging') ? 'Sandbox' : 'Production',
        );
        return await test_data(client, describe, expect, it).then(() => run());
    } else {
        return TestData(service, describe, expect, it);
    }
}

export async function file_storage(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester(
            'File_Storage',
            client.BaseURL.includes('staging') ? 'Sandbox' : 'Production',
        );
        return Promise.all([
            await test_data(client, describe, expect, it),
            FileStorageTests(service, describe, expect, it),
        ]).then(() => run());
    } else {
        return FileStorageTests(service, describe, expect, it);
    }
}

export async function data_views(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester(
            'Data_Views',
            client.BaseURL.includes('staging') ? 'Sandbox' : 'Production',
        );
        return Promise.all([
            await test_data(client, describe, expect, it),
            DataViewsTests(service, describe, expect, it),
        ]).then(() => run());
    } else {
        return DataViewsTests(service, describe, expect, it);
    }
}

export async function fields(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester(
            'Fields',
            client.BaseURL.includes('staging') ? 'Sandbox' : 'Production',
        );
        return Promise.all([
            await test_data(client, describe, expect, it),
            FieldsTests(service, describe, expect, it),
        ]).then(() => run());
    } else {
        return FieldsTests(service, describe, expect, it);
    }
}

export async function sync(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester(
            'Sync',
            client.BaseURL.includes('staging') ? 'Sandbox' : 'Production',
        );
        return Promise.all([
            await test_data(client, describe, expect, it),
            SyncAllTests(service, describe, expect, it),
        ]).then(() => run());
    } else {
        return SyncTests(service, describe, expect, it);
    }
}

export async function objects(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester(
            'Objects',
            client.BaseURL.includes('staging') ? 'Sandbox' : 'Production',
        );
        return Promise.all([
            await test_data(client, describe, expect, it),
            ObjectsTests(service, describe, expect, it),
        ]).then(() => run());
    } else {
        return ObjectsTests(service, describe, expect, it);
    }
}

export async function audit_logs(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester(
            'Audit_Logs',
            client.BaseURL.includes('staging') ? 'Sandbox' : 'Production',
        );
        return Promise.all([
            await test_data(client, describe, expect, it),
            AuditLogsTests(service, describe, expect, it),
        ]).then(() => run());
    } else {
        return AuditLogsTests(service, describe, expect, it);
    }
}

export async function var_api(client: Client, request: Request, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester(
            'Var_API',
            client.BaseURL.includes('staging') ? 'Sandbox' : 'Production',
        );
        return Promise.all([
            await test_data(client, describe, expect, it),
            VarAPITests(service, request, describe, expect, it),
        ]).then(() => run());
    } else {
        return VarAPITests(service, request, describe, expect, it);
    }
}
