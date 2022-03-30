exports.yoni = (Client /*, Request*/) => {
    Client.addLogEntry('Info', 'multiplyResult');
    const response = { success: true, errorMessage: '', resultObject: {} };
    function multiply(a, b) {
        const res = { multiplyResult: a * b };
        Client.addLogEntry('Info', 'Yoni webhook result =' + res);
        this.response.resultObject = res;
        response.errorMessage = 'test msg';
        response.success = true;
        return response;
    }
    return multiply(3, 2);
};
