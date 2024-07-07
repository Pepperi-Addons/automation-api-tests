import { Client, Request } from '@pepperi-addons/debug-server';
import { PapiClient } from '@pepperi-addons/papi-sdk';

//#region Service Tests
export async function async_test(client: Client, request: Request) {
    const ret = {};
    ret['resultObject'] = {};
    ret['success'] = false;
    console.log('Message from Callback first');

    if (request.body.Result.resultObject.msg == 'hello world') {
        ret['success'] = true;
        ret['resultObject'].msg = 'hello world - returned from callback function';
    } else {
        ret['resultObject'].msg = 'callback function not worked';
    }
    const bodyValue = {
        Headers: ['MapDataExternalID', 'MainKey', 'SecondaryKey', 'Values'],
        Lines: [['Scheduler data table', 'CAllback function verification', ret['resultObject'].msg, ret['success']]],
    };

    const papiClient = new PapiClient({
        baseURL: client.BaseURL,
        token: client.OAuthAccessToken,
        actionUUID: client.ActionUUID,
    });

    //const res =
    await papiClient.post('/bulk/user_defined_tables/json', bodyValue);
    console.log('Message from Callback after' + ret['resultObject'].msg);

    return ret;
}
