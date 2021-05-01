exports.yoni = (Client, Request) => {
    this.response = {};
    Client.addLogEntry("Info", "multiplyResult");
    response = { success: "true", errorMessage: "", resultObject: {} };
    function multiply(a, b) {
        var res = { 'multiplyResult': a * b };
        Client.addLogEntry("Info", "Yoni webhook result =" + res);
        this.response.resultObject = res;
        response.errorMessage = "test msg";
        response.success = true;
        return (response);
    }
    return multiply(3, 2);
};
