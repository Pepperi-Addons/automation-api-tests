import { Client } from '@pepperi-addons/debug-server';
import tester from './tester';
import GeneralService from './services/general.service';
import { FileStorageTests } from './api-tests/file_storage';
import { DataViewsTests } from './api-tests/data_views';
import { FieldsTests } from './api-tests/fields';
import { sanityTest } from './api-tests/sanity';
import { SyncTests } from './api-tests/sync';

export async function all(client: Client) {
    const { describe, expect, it, run } = tester();
    return Promise.all([
        file_storage(client, describe, expect, it),
        data_views(client, describe, expect, it),
        fields(client, describe, expect, it),
        sync(client, describe, expect, it),
        sanity_Test(client, describe, expect, it),
    ]).then(() => run());
}

export async function file_storage(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester();
        return FileStorageTests(service, describe, expect, it).then(() => run());
    } else {
        return FileStorageTests(service, describe, expect, it);
    }
}

export async function data_views(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester();
        return DataViewsTests(service, describe, expect, it).then(() => run());
    } else {
        return DataViewsTests(service, describe, expect, it);
    }
}

export async function fields(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester();
        return FieldsTests(service, describe, expect, it).then(() => run());
    } else {
        return FieldsTests(service, describe, expect, it);
    }
}

export async function sync(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester();
        return SyncTests(service, describe, expect, it).then(() => run());
    } else {
        return SyncTests(service, describe, expect, it);
    }
}

export async function sanity_Test(client: Client, describe?, expect?, it?) {
    const service = new GeneralService(client);
    if (describe == undefined || expect == undefined || it == undefined) {
        const { describe, expect, it, run } = tester();
        return sanityTest(service, describe, expect, it).then(() => run());
    } else {
        return sanityTest(service, describe, expect, it);
    }

}