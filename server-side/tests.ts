import { Client } from '@pepperi-addons/debug-server';
import tester from './tester';
import GeneralService from './services/general.service';
import { TestData } from './api-tests/test_data';
import { FileStorageTests } from './api-tests/file_storage';
import { DataViewsTests } from './api-tests/data_views';
import { FieldsTests } from './api-tests/fields';
import { SyncTests } from './api-tests/sync';
import { ObjectsTests } from './api-tests/objects';

export async function all(client: Client) {
    const { describe, expect, it, run } = tester();
    return Promise.all([
        await test_data(client, describe, expect, it),
        file_storage(client, describe, expect, it),
        data_views(client, describe, expect, it),
        fields(client, describe, expect, it),
        sync(client, describe, expect, it),
        objects(client, describe, expect, it),
    ]).then(() => run());
}

export async function sanity(client: Client) {
    const { describe, expect, it, run } = tester();
    return Promise.all([
        await test_data(client, describe, expect, it),
        objects(client, describe, expect, it),
    ]).then(() => run());
}

export async function test_data(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester();
        return await test_data(client, describe, expect, it).then(() => run());
    } else {
        return TestData(service, describe, expect, it);
    }
}

export async function file_storage(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester();
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
        const { describe, expect, it, run } = tester();
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
        const { describe, expect, it, run } = tester();
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
        const { describe, expect, it, run } = tester();
        return Promise.all([
            await test_data(client, describe, expect, it),
            SyncTests(service, describe, expect, it),
        ]).then(() => run());
    } else {
        return SyncTests(service, describe, expect, it);
    }
}

export async function objects(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester();
        return Promise.all([
            await test_data(client, describe, expect, it),
            ObjectsTests(service, describe, expect, it),
        ]).then(() => run());
    } else {
        return ObjectsTests(service, describe, expect, it);
    }
}
