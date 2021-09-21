import GeneralService, { TesterFunctions } from '../../services/general.service';

export async function InstallTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const assert = tester.assert;
    const it = tester.it;

    service['options'].addonUUID = '';

    const logcash: any = {};
    const CallbackCash: any = {};
    //const insertBodyRetryTest: any = {};
    //const logDataNoRetry: any = {};
    //const logDataRetry: any = {};
    //const executionLog: any = {};
    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const jsFileName = 'test.js';
    const functionName = 'ido';
    //const versionsArr = [];
    const functionNameWithBody = 'oleg';
    let bodyValue: any = {};
    const version = '0.0.1';

    await installDistributorAddon();

    describe('Addons APIs (Sync, Async, Call With/Without Version Name And Callback) ', () => {
        it('GET Async Addon Value + AuditLog Verification: Finished', () => {
            assert(logcash.resultFromAsyncAddonValue, logcash.resultFromAsyncAddonValueError);
        });
        it('GET Async addon Value With Version: Finished', () => {
            assert(logcash.resultFromAsyncAddonValueWithVersion, logcash.resultFromAsyncAddonValueErrorWithVersion);
        });
        it('GET Sync Addon Value: Finished', () => {
            assert(logcash.resultFromSyncAddonValue, logcash.resultFromSyncAddonValueError);
        });
        it('GET Sync Addon Value With Version: Finished', () => {
            assert(logcash.resultFromSyncAddonValueWithVersion2, logcash.resultFromSyncAddonValueWithVersion2Error);
        });
        it('Post Async Addon Value With Body (AuditLog Verification): Finished', () => {
            assert(logcash.resultFromAsyncAddonValueWithBody, logcash.resultFromAsyncAddonValueWithBodyError);
        });
        it('Post Async Addon Value With Body (AuditLog Verification) And Version Name: Finished', () => {
            assert(
                logcash.resultFromAsyncAddonValueWithBodyWithVersion,
                logcash.resultFromAsyncAddonValueWithBodyWithVersionError,
            );
        });
        it('Post Sync Addon Value (Without Body): Finished', () => {
            assert(logcash.resultFromSyncAddonValueWitouthBody, logcash.resultFromSyncAddonValueWitouthBodyError);
        });
        it('Post Sync Addon Value (Without Body) With Version: Finished', () => {
            assert(
                logcash.resultFromSyncedAddonValueWithBodyWithVersion,
                logcash.resultFromSyncedAddonValueWithBodyWithVersionError,
            );
        });
        it('Get Async Addon Value Without Body: Finished', () => {
            assert(
                logcash.etAuditLogFromPostAsyncAddonValueWithoutBody,
                logcash.etAuditLogFromPostAsyncAddonValueWithoutBodyError,
            );
        });
        it('Callback Function Verification: Finished', () => {
            assert(logcash.getAsyncedCallback, logcash.getAsyncedCallbackError);
        });
    });

    async function installDistributorAddon() {
        //debugger;
        CallbackCash.installDistributorAddon = await service.addons.installedAddons
            .addonUUID(addonUUID)
            .install(version);
        await getAsyncAddonValue();
    }

    async function getAsyncAddonValue() {
        CallbackCash.addonValue = await service.addons.api
            .uuid(addonUUID)
            .file(jsFileName)
            .func(functionName)
            .async()
            .get();
        //debugger;
        await getAuditLogFromGetAddonValue();
    }

    async function getAuditLogFromGetAddonValue() {
        generalService.sleep(20000);
        CallbackCash.auditResult = await service.auditLogs.uuid(CallbackCash.addonValue.ExecutionUUID).get();
        //debugger;
        CallbackCash.resultFromAsyncAddonValue = JSON.parse(CallbackCash.auditResult.AuditInfo.ResultObject);
        if (CallbackCash.resultFromAsyncAddonValue.resultObject.msg == 'hello world') {
            // changed on 07-06 CallbackCash.resultFromAsyncAddonValue.msg
            logcash.resultFromAsyncAddonValue = true;
        } else {
            logcash.resultFromAsyncAddonValue = false;
            logcash.resultFromAsyncAddonValueError =
                'The async addon function without params not returned value on audit log. The addon UUID is ' +
                addonUUID +
                'JS file name is ' +
                jsFileName +
                'and function name is ' +
                functionName;
        }
        await getAsyncAddonValueWithVersion();
    }

    //#region assync addon test with version
    async function getAsyncAddonValueWithVersion() {
        CallbackCash.addonValueWithVersion = await service.get(
            '/addons/api/async/' + addonUUID + '/version/0.0.2/' + jsFileName + '/' + functionName,
        );
        //debugger;
        await getAuditLogFromGetAddonValueWithVersion();
    }

    async function getAuditLogFromGetAddonValueWithVersion() {
        generalService.sleep(20000);
        CallbackCash.auditResultWithVersion = await service.auditLogs
            .uuid(CallbackCash.addonValueWithVersion.ExecutionUUID)
            .get();
        //debugger;
        CallbackCash.resultFromAsyncAddonValueWithVersion = JSON.parse(
            CallbackCash.auditResultWithVersion.AuditInfo.ResultObject,
        );
        if (CallbackCash.resultFromAsyncAddonValueWithVersion.resultObject.msg == 'hello world - 0.0.2') {
            logcash.resultFromAsyncAddonValueWithVersion = true;
        } else {
            //
            logcash.resultFromAsyncAddonValueWithVersion = false;
            logcash.resultFromAsyncAddonValueErrorWithVersion =
                'The async addon (with addon var version 0.0.2) function without params not returned value on audit log. The addon UUID is ' +
                addonUUID +
                'JS file name is ' +
                jsFileName +
                'and function name is ' +
                functionName;
        }
        await getSyncedAddoValue();
    }
    //#endregion assync addon test with version

    async function getSyncedAddoValue() {
        CallbackCash.addonValue = await service.get('/addons/api/' + addonUUID + '/' + jsFileName + '/' + functionName);
        //debugger;
        if (CallbackCash.addonValue.success == true && CallbackCash.addonValue.resultObject.msg == 'hello world') {
            logcash.resultFromSyncAddonValue = true;
        } else {
            logcash.resultFromSyncAddonValue = false;
            logcash.resultFromSyncAddonValueError =
                'The addon function (sync with VAR addon version = 0.0.2) without params not returned value on function body. The addon UUID is ' +
                addonUUID +
                'JS file name is ' +
                jsFileName +
                'and function name is ' +
                functionName;
        }
        await getSyncedAddoValueWithVersion();
    }

    //#region synced addon test with version
    async function getSyncedAddoValueWithVersion() {
        CallbackCash.addonValueWithVersion2 = await service.get(
            '/addons/api/' + addonUUID + '/version/0.0.2/' + jsFileName + '/' + functionName,
        );
        //debugger;
        if (
            CallbackCash.addonValueWithVersion2.success == true &&
            CallbackCash.addonValueWithVersion2.resultObject.msg == 'hello world - 0.0.2'
        ) {
            logcash.resultFromSyncAddonValueWithVersion2 = true;
        } else {
            //
            logcash.resultFromSyncAddonValueWithVersion2 = false;
            logcash.resultFromSyncAddonValueWithVersion2Error =
                'The addon function (sync) without params not returned value on function body. The addon UUID is' +
                addonUUID +
                'JS file name is ' +
                jsFileName +
                'and function name is ' +
                functionName;
        }
        await postAsyncAddonValueWithBody();
    }
    //#endregion synced addon test with version

    async function postAsyncAddonValueWithBody() {
        bodyValue = {
            a: 5,
        };
        CallbackCash.addonValueWithBody = await service.post(
            '/addons/api/async/' + addonUUID + '/' + jsFileName + '/' + functionNameWithBody,
            bodyValue,
        );
        //debugger;
        await getAuditLogFromgetAsyncAddonValueWithBody();
    }

    async function getAuditLogFromgetAsyncAddonValueWithBody() {
        generalService.sleep(20000);
        CallbackCash.auditResultSec = await service.auditLogs.uuid(CallbackCash.addonValueWithBody.ExecutionUUID).get();
        //debugger;
        CallbackCash.resultFromAsyncAddonValueSec = JSON.parse(CallbackCash.auditResultSec.AuditInfo.ResultObject);
        if (CallbackCash.resultFromAsyncAddonValueSec.resultObject.multiplyResult == 10) {
            logcash.resultFromAsyncAddonValueWithBody = true;
        } else {
            logcash.resultFromAsyncAddonValueWithBody = false;
            logcash.resultFromAsyncAddonValueWithBodyError =
                'The async addon function with params not returned value on audit log. The addon UUID is ' +
                addonUUID +
                'JS file name is ' +
                jsFileName +
                'and function name is ' +
                functionNameWithBody;
        }
        await postAsyncAddonValueWithBodyWithVersion();
    }

    //#region Get async addon value with v=body with version 0.0.2
    async function postAsyncAddonValueWithBodyWithVersion() {
        bodyValue = {
            a: 5,
        };
        CallbackCash.addonValueWithBodyWithVersion = await service.post(
            '/addons/api/async/' + addonUUID + '/version/0.0.2/' + jsFileName + '/' + functionNameWithBody,
            bodyValue,
        );
        //debugger;
        await getAuditLogFromgetAsyncAddonValueWithBodyWithVersion();
    }

    async function getAuditLogFromgetAsyncAddonValueWithBodyWithVersion() {
        generalService.sleep(20000);
        CallbackCash.auditResultSecWithVersion = await service.auditLogs
            .uuid(CallbackCash.addonValueWithBodyWithVersion.ExecutionUUID)
            .get();
        //debugger;
        CallbackCash.resultFromAsyncAddonValueSecWithVersion = JSON.parse(
            CallbackCash.auditResultSecWithVersion.AuditInfo.ResultObject,
        );
        if (CallbackCash.resultFromAsyncAddonValueSecWithVersion.resultObject.multiplyResult == 15) {
            logcash.resultFromAsyncAddonValueWithBodyWithVersion = true;
        } else {
            //
            logcash.resultFromAsyncAddonValueWithBodyWithVersion = false;
            logcash.resultFromAsyncAddonValueWithBodyWithVersionError =
                'The async addon function with params and with Addon version 0.0.2 not returned value on audit log. The addon UUID is ' +
                addonUUID +
                'JS file name is ' +
                jsFileName +
                'and function name is ' +
                functionNameWithBody;
        }
        await postSyncAddonValueWithBody();
    }
    //#endregion Get async addon value with v=body with version 0.0.2

    async function postSyncAddonValueWithBody() {
        logcash.resultFromAsyncAddonValueWithBodyWithVersionError =
            'The async addon function with params and with Addon version 0.0.2 not returned value on audit log. The addon UUID is ' +
            addonUUID +
            'JS file name is ' +
            jsFileName +
            'and function name is ' +
            functionNameWithBody;
        bodyValue = {
            a: 6,
        };
        CallbackCash.syncedAddonValueWithBody = await service.post(
            '/addons/api/' + addonUUID + '/' + jsFileName + '/' + functionNameWithBody,
            bodyValue,
        );
        //debugger;
        if (
            CallbackCash.syncedAddonValueWithBody.success == true &&
            CallbackCash.syncedAddonValueWithBody.resultObject.multiplyResult == 12
        ) {
            logcash.resultFromSyncedAddonValueWithBody = true;
        } else {
            logcash.resultFromSyncedAddonValueWithBody = false;
            logcash.resultFromSyncedAddonValueWithBodyError =
                'The addon function (sync) without params not returned value (or value is wrong) on function body. The addon UUID is ' +
                addonUUID +
                'JS file name is ' +
                jsFileName +
                'and function name is ' +
                functionNameWithBody;
        }
        await postSyncAddonValueWithBodyWithVersion();
    }

    //#region post addon value (sync) with body and var addon version 0.0.2
    async function postSyncAddonValueWithBodyWithVersion() {
        bodyValue = {
            a: 6,
        };
        CallbackCash.syncedAddonValueWithBodyWithVersion = await service.post(
            '/addons/api/' + addonUUID + '/version/0.0.2/' + jsFileName + '/' + functionNameWithBody,
            bodyValue,
        );
        //debugger;
        if (
            CallbackCash.syncedAddonValueWithBodyWithVersion.success == true &&
            CallbackCash.syncedAddonValueWithBodyWithVersion.resultObject.multiplyResult == 18
        ) {
            logcash.resultFromSyncedAddonValueWithBodyWithVersion = true;
        } else {
            logcash.resultFromSyncedAddonValueWithBodyWithVersion = false;
            logcash.resultFromSyncedAddonValueWithBodyWithVersionError =
                'The addon function (sync) without params and with VAR addon version = 0.0.2 not returned value (or value is wrong) on function body. The addon UUID is ' +
                addonUUID +
                'JS file name is ' +
                jsFileName +
                'and function name is ' +
                functionNameWithBody;
        }

        await postSyncAddonValueWitouthBody();
    }
    //#endregion post addon value (sync) with body and var addon version 0.0.2

    async function postSyncAddonValueWitouthBody() {
        CallbackCash.syncAddonValueWitouthBody = await service.post(
            '/addons/api/' + addonUUID + '/' + jsFileName + '/' + functionName,
        );
        //debugger;
        if (
            CallbackCash.syncAddonValueWitouthBody.success == true &&
            CallbackCash.syncAddonValueWitouthBody.resultObject.msg == 'hello world'
        ) {
            logcash.resultFromSyncAddonValueWitouthBody = true;
        } else {
            logcash.resultFromSyncAddonValueWitouthBody = false;
            logcash.resultFromSyncAddonValueWitouthBodyError =
                'The addon function (post sync) without params not returned value on function body. The addon UUID is ' +
                addonUUID +
                'JS file name is ' +
                jsFileName +
                'and function name is ' +
                functionName;
        }
        await postAsyncAddonValueWithoutBody();
    }

    async function postAsyncAddonValueWithoutBody() {
        CallbackCash.postAsyncAddonValueWithoutBody = await service.post(
            '/addons/api/async/' + addonUUID + '/' + jsFileName + '/' + functionName,
        );
        //debugger;
        await getAuditLogFromPostAsyncAddonValueWithoutBody();
    }

    async function getAuditLogFromPostAsyncAddonValueWithoutBody() {
        generalService.sleep(20000);
        CallbackCash.getAuditLogFromPostAsyncAddonValueWithoutBody = await service.auditLogs
            .uuid(CallbackCash.postAsyncAddonValueWithoutBody.ExecutionUUID)
            .get();
        //debugger;
        CallbackCash.parsedResultFromPost = JSON.parse(
            CallbackCash.getAuditLogFromPostAsyncAddonValueWithoutBody.AuditInfo.ResultObject,
        );
        if (CallbackCash.parsedResultFromPost.resultObject.msg == 'hello world') {
            logcash.etAuditLogFromPostAsyncAddonValueWithoutBody = true;
        } else {
            logcash.etAuditLogFromPostAsyncAddonValueWithoutBody = false;
            logcash.etAuditLogFromPostAsyncAddonValueWithoutBodyError =
                'The async addon function post without params not returned value on audit log. The addon UUID is ' +
                addonUUID +
                'JS file name is ' +
                jsFileName +
                'and function name is ' +
                functionName;
        }
        await callbackForAddon();
    }

    async function callbackForAddon() {
        const callbackForAddonBody = {
            Callback:
                'exports.callback=async(Client, Request, Response)=>{\r\n        var ret = {};\r\n        ret.resultObject = {};\r\n        ret.success = false;\r\n        Client.addLogEntry("Info", "Message from Callback first");\r\n        if( Response.resultObject.msg  == "hello world"){\r\n            ret.success = true;\r\n            ret.resultObject.msg = "hello world - returned from callback function";\r\n        }\r\n        else{\r\n            ret.resultObject.msg = "callback function not worked";\r\n        }\r\n        var bodyValue = {\r\n            "Headers": [\r\n               "MapDataExternalID",\r\n               "MainKey",\r\n               "SecondaryKey",\r\n               "Values"\r\n            ],\r\n            "Lines": [\r\n                ["Scheduler data table",\r\n                "CAllback function verification",\r\n                ret.resultObject.msg,\r\n                ret.success]\r\n            ]\r\n        }\r\n        var options = {\r\n            method: \'POST\',\r\n            uri: Client.BaseURL + \'/bulk/user_defined_tables/json\',\r\n            headers: {\r\n                \'Authorization\': \' Bearer \' + Client.OAuthAccessToken\r\n            },\r\n            body: bodyValue,\r\n            json: true \r\n        };\r\n        const res = await Client.Module.rp(options);\r\n        Client.addLogEntry("Info", "Message from Callback after" + ret.resultObject.msg);\r\n        return(ret);\r\n        };',
        };
        //CallbackCash.callbackForAddon = await globalTestService.sync("Post", "addons/api/async/callback" , callbackForAddonBody);
        // API callback URL changed on 09-11-20
        CallbackCash.callbackForAddon = await service.post('/addons/api/async_callback', callbackForAddonBody);
        //debugger;
        await createUdtTable();
    }

    async function createUdtTable() {
        const udtTableBody = {
            TableID: 'Scheduler data table',
            MainKeyType: {
                ID: 0,
                Name: 'Any',
            },
            SecondaryKeyType: {
                ID: 0,
                Name: 'Any',
            },
            MemoryMode: { Dormant: false, Volatile: false },
            Hidden: false,
        };
        CallbackCash.UdtCreated = await service.post('/meta_data/user_defined_tables', udtTableBody);
        //debugger;
        await getAsyncedCallback();
    }

    async function getAsyncedCallback() {
        CallbackCash.getAsyncedCallback = await service.get(
            '/addons/api/async/' +
                addonUUID +
                '/' +
                jsFileName +
                '/' +
                functionName +
                '?callback=' +
                CallbackCash.callbackForAddon.result,
        );
        //debugger;
        if (
            CallbackCash.getAsyncedCallback.ExecutionUUID.length == 36 &&
            CallbackCash.getAsyncedCallback.URI.includes('/audit_logs')
        ) {
            logcash.getAsyncedCallback = true;
        } else {
            logcash.getAsyncedCallback = false;
            logcash.getAsyncedCallbackError =
                'The addon callback function not returned executionUUID or failed . The addon UUID is ' +
                addonUUID +
                'JS file name is ' +
                jsFileName +
                '= function name is ' +
                functionName +
                'and callback UUID is ' +
                CallbackCash.callbackForAddon.result;
        }
        //getCloudWatchFromAsyncedCallback();

        //debugger;
        //deleteVARAddon();
    }

    //Delete Addon
    // function deleteVARAddon(){
    //    for (let index = 0; index < versionsArr.length; index++) {
    //         CallbackCash.deleteVersionApiResponse = VarAPI.CallSync('DELETE', "var/addons/versions/" + versionsArr[index].result[0].UUID);
    //     }
    //     CallbackCash.deleteAddon = VarAPI.CallSync('DELETE', "var/addons/" + addonUUID);
    //     if(CallbackCash.deleteAddon.Success== true){
    //         CallbackCash.deleteAddonStatus = true;
    //     }
    //     else{
    //         CallbackCash.deleteAddonStatus = false;
    //         CallbackCash.deleteAddonStatusMsg = ("The delete addon function failed. Addon UUID: " + addonUUID);
    //     }
    //debugger;
    // describe("Addons APIs (sync, async , call with/without version number and callback) ", () => {
    //     it("GET async addon value + audit log verification: Finished", () => {
    //         assert(logcash.resultFromAsyncAddonValue, logcash.resultFromAsyncAddonValueError);
    //     });
    //     it("GET async addon value with Version: Finished", () => {
    //         assert(logcash.resultFromAsyncAddonValueWithVersion, logcash.resultFromAsyncAddonValueErrorWithVersion);
    //     });
    //     it("GET sync addon value: Finished", () => {
    //         assert(logcash.resultFromSyncAddonValue, logcash.resultFromSyncAddonValueError);
    //     });
    //     it("GET sync addon value with version: Finished", () => {
    //         assert(logcash.resultFromSyncAddonValueWithVersion2, logcash.resultFromSyncAddonValueWithVersion2Error);
    //     });
    //     it("Post async addon value with body(audit log verification): Finished", () => {
    //         assert(logcash.resultFromAsyncAddonValueWithBody, logcash.resultFromAsyncAddonValueWithBodyError);
    //     });
    //     it("Post async addon value with body (audit log verification) and version number : Finished", () => {
    //         assert(logcash.resultFromAsyncAddonValueWithBodyWithVersion, logcash.resultFromAsyncAddonValueWithBodyWithVersionError);
    //     });
    //     it("Post sync addon value (without body): Finished", () => {
    //         assert(logcash.resultFromSyncAddonValueWitouthBody, logcash.resultFromSyncAddonValueWitouthBodyError);
    //     });
    //     it("Post sync addon value (without body) with version : Finished", () => {
    //         assert(logcash.resultFromSyncedAddonValueWithBodyWithVersion, logcash.resultFromSyncedAddonValueWithBodyWithVersionError);
    //     });
    //     it("Get async addon value without body: Finished", () => {
    //         assert(logcash.etAuditLogFromPostAsyncAddonValueWithoutBody, logcash.etAuditLogFromPostAsyncAddonValueWithoutBodyError);
    //     });
    //     it("Callback function verification: Finished", () => {
    //         assert(logcash.getAsyncedCallback, logcash.getAsyncedCallbackError);
    //     });
    //     it("Delete VAR addon: Finished", () => {
    //         assert (CallbackCash.deleteAddonStatus, CallbackCash.deleteAddonStatusMsg);
    //     });
    // });
}
