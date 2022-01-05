exports.UpdateCodeJob = async (Client) => {
    Client.addLogEntry('Info', 'multiplyResult');
    const response = {
        success: true,
        errorMessage: '',
        resultObject: {},
    };
    function multiply(a = 2, b = 3) {
        const res = {
            multiplyResult: a * b,
        };
        Client.addLogEntry('Info', 'Start Funcion multiply =' + res);
        response.resultObject = res;
        response.errorMessage = 'test msg';
        response.success = true;
        return response;
    }
    return multiply(2, 3);
};

exports.updateDrafrCodeWithoutResult = async (Client) => {
    Client.addLogEntry('Info', 'multiplyResult');
    const response = {
        success: true,
        errorMessage: '',
        resultObject: {},
    };
    function multiply(a = 2, b = 3) {
        const res = {
            multiplyResult: a * b,
        };
        Client.addLogEntry('Info', 'Start Funcion multiply =' + res);
        response.resultObject = res;
        response.errorMessage = 'test msg';
        response.success = true;
        return response;
    }
    function sleep(ms) {
        const start = new Date().getTime(),
            expire = start + ms;
        while (new Date().getTime() < expire) { }
        return;
    }
    sleep(1000 * 60 * 11);
    return multiply(8, 8);
};

exports.createNewCJToBudgetTest = async (Client) => {
    Client.addLogEntry('Info', 'multiplyResult');
    const response = {
        success: true,
        errorMessage: '',
        resultObject: {},
    };
    function multiply(a = 2, b = 3) {
        const res = {
            multiplyResult: a * b,
        };
        Client.addLogEntry('Info', 'Start Funcion multiply =' + res);
        response.resultObject = res;
        response.errorMessage = 'test msg';
        response.success = true;
        return response;
    }
    function sleep(ms) {
        const start = new Date().getTime(),
            expire = start + ms;
        while (new Date().getTime() < expire) { }
        return;
    }
    sleep(5000);
    return multiply(8, 8);
};

exports.createNewCodeJobRetryTest = async (Client) => {
    const response = {};
    Client.addLogEntry('Info', 'Start throw new error');
    throw new Error('Nofar Test');
    return response;
};

exports.PositiveTest = async (Client) => {
    Client.addLogEntry('Info', 'Start Code Test');
    const response = {
        success: true,
        errorMessage: '',
        resultObject: new Object(),
    };
    function multiply(a, b) {
        const res = {
            multiplyResult: a * b,
        };
        Client.addLogEntry('Info', 'Start Funcion multiply =  JSON.stringify(res)');
        response.resultObject = res;
        response.errorMessage = 'test msg';
        response.success = true;
        return response;
    }
    return multiply(4, 2);
};

exports.NegativeTest = async (Client) => {
    Client.addLogEntry('Info', 'Start throw new error');
    throw new Error('orenTest');
};
