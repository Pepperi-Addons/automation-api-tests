exports.ido = (Client, Request) => {
    var ret = {};
    ret.success = true;
    ret.resultObject = {};
    ret.resultObject.msg = "hello world";
    return ret;
}

exports.oleg = (Client, Request) => {
    var response = {};
    Client.addLogEntry("Info", "multiplyResult");
    response = { success: "true", errorMessage: "", resultObject: {} };
    function multiply(a, b) {
        var res = { 'multiplyResult': a * b };
        Client.addLogEntry("Info", "Start Funcion multiply =" + res);
        response.resultObject = res;
        response.errorMessage = "test msg";
        response.success = true;
        return (response);
    }
    return multiply(Request.body.a, 2);
};

exports.idoVersionTest = (Client, Request) => {
    var ret = {};
    ret.success = true;
    ret.resultObject = {};
    ret.resultObject.msg = "hello world.Version test";
    return ret;
}

exports.olegVersionTest = (Client, Request) => {
    var response = {};
    Client.addLogEntry("Info", "multiplyResult");
    response = { success: "true", errorMessage: "", resultObject: {} };
    function multiply(a, b) {
        var res = { 'multiplyResult': a * b };
        Client.addLogEntry("Info", "Start Funcion multiply =" + res);
        response.resultObject = res;
        response.errorMessage = "test msg";
        response.success = true;
        return (response);
    }
    return multiply(Request.body.a, 10);
};

exports.getTransactions = async (Client) => {
    var response = {};
    debugger;// test1
    Client.addLogEntry("Info", "Start get curent version");
    response = { success: "true", errorMessage: "", resultObject: {} };
    var options = {
        uri: Client.BaseURL + '/transactions',
        qs: {
            'page_size': 1
        },
        headers: {
            'Authorization': ' Bearer ' + Client.OAuthAccessToken
        },
        json: true
    };
    try {
        const res = await Client.Module.rp(options);
        Client.addLogEntry("Info", "Got result = " + JSON.stringify(res));
        response.success = true;
        response.resultObject = res;
    }
    catch (error) {
        Client.addLogEntry("Error", "Failed get curent version: " + error);
        response.success = false;
        response.errorMessage = error;
        response.resultObject = null;
    }
    return (response);
};

// part of callback tests.
exports.callback = async (Client, Request, Response) => {
    var ret = {};
    ret.resultObject = {};
    ret.success = false;
    Client.addLogEntry("Info", "Message from Callback first");
    if (Response.resultObject.msg == "hello world") {
        ret.success = true;
        ret.resultObject.msg = "hello world - returned from callback function";
    }
    else {
        ret.resultObject.msg = "callback function not worked";
    }
    var bodyValue = {
        "Headers": [
            "MapDataExternalID",
            "MainKey",
            "SecondaryKey",
            "Values"
        ],
        "Lines": [
            ["Scheduler data table",
                "Returned from CAllback function",
                ret.resultObject.msg,
                ret.success]
        ]
    }
    var options = {
        method: 'POST',
        uri: Client.BaseURL + '/bulk/user_defined_tables/json',
        headers: {
            'Authorization': ' Bearer ' + Client.OAuthAccessToken
        },
        body: bodyValue,
        json: true
    };
    const res = await Client.Module.rp(options);
    Client.addLogEntry("Info", "Message from Callback after" + ret.resultObject.msg);
    return (ret);
};
