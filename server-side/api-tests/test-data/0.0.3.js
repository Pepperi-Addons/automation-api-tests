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
    const response = { success: true, errorMessage: '', resultObject: {} };
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

exports.getTransactions = async (Client) => {
    debugger; // test3
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
