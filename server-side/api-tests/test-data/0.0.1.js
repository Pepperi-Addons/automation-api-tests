exports.ido = () => {
    const ret = {
        success: true,
        errorMessage: '',
        resultObject: new Object(),
    };
    ret.success = true;
    ret.resultObject = {};
    ret.resultObject['msg'] = 'hello world';
    return ret;
};

exports.oleg = (Client, Request) => {
    Client.addLogEntry('Info', 'multiplyResult');
    const response = {
        success: true,
        errorMessage: '',
        resultObject: {},
    };
    function multiply(a, b) {
        const res = { multiplyResult: a * b };
        Client.addLogEntry('Info', 'Start Funcion multiply =' + res);
        response.resultObject = res;
        response.errorMessage = 'test msg';
        response.success = true;
        return response;
    }
    return multiply(Request.body.a, 2);
};

exports.idoVersionTest = () => {
    const ret = {
        success: true,
        errorMessage: '',
        resultObject: new Object(),
    };
    ret.success = true;
    ret.resultObject = {};
    ret.resultObject['msg'] = 'hello world.Version test';
    return ret;
};

exports.olegVersionTest = (Client, Request) => {
    Client.addLogEntry('Info', 'multiplyResult');
    const response = { success: true, errorMessage: '', resultObject: {} };
    function multiply(a, b) {
        const res = { multiplyResult: a * b };
        Client.addLogEntry('Info', 'Start Funcion multiply =' + res);
        response.resultObject = res;
        response.errorMessage = 'test msg';
        response.success = true;
        return response;
    }
    return multiply(Request.body.a, 10);
};

exports.getTransactions = async (Client) => {
    debugger; // test1
    Client.addLogEntry('Info', 'Start get curent version');
    const response = { success: true, errorMessage: '', resultObject: {} };
    const options = {
        uri: Client.BaseURL + '/transactions',
        qs: {
            page_size: 1,
        },
        headers: {
            Authorization: ' Bearer ' + Client.OAuthAccessToken,
        },
        json: true,
    };
    try {
        const res = await Client.Module.rp(options);
        Client.addLogEntry('Info', 'Got result = ' + JSON.stringify(res));
        response.success = true;
        response.resultObject = res;
    } catch (error) {
        Client.addLogEntry('Error', 'Failed get curent version: ' + error);
        response.success = false;
        response.errorMessage = error;
        response.resultObject = null;
    }
    return response;
};

// part of callback tests.
exports.callback = async (Client, Request, Response) => {
    const ret = {
        success: true,
        errorMessage: '',
        resultObject: new Object(),
    };
    ret.resultObject = {};
    ret.success = false;
    Client.addLogEntry('Info', 'Message from Callback first');
    if (Response.resultObject.msg == 'hello world') {
        ret.success = true;
        ret.resultObject['msg'] = 'hello world - returned from callback function';
    } else {
        ret.resultObject['msg'] = 'callback function not worked';
    }
    const bodyValue = {
        Headers: ['MapDataExternalID', 'MainKey', 'SecondaryKey', 'Values'],
        Lines: [['Scheduler data table', 'Returned from CAllback function', ret.resultObject['msg'], ret.success]],
    };
    const options = {
        method: 'POST',
        uri: Client.BaseURL + '/bulk/user_defined_tables/json',
        headers: {
            Authorization: ' Bearer ' + Client.OAuthAccessToken,
        },
        body: bodyValue,
        json: true,
    };
    await Client.Module.rp(options);
    Client.addLogEntry('Info', 'Message from Callback after' + ret.resultObject['msg']);
    return ret;
};
