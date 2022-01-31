exports.importRelation = async (client, request) => {
    try {
        if (request.body && request.body.ImportedObjects) {
            for (let index = 0; index < request.body.ImportedObjects.length; index++) {
                const element = request.body.ImportedObjects[index];
                element.Key = index.toString;
                if (index % 5 === 0) {
                    element.Status = 'Error';
                    element.Details = 'key divides by 5';
                }
            }
        }
        return request.body;
    } catch (err) {
        console.log(`in importRelation of todo: ${err}`);
        return request.body;
    }
};

exports.scheduler = async (Client) => {
    let response;
    Client.addLogEntry('Info', 'multiplyResult');
    response = {
        success: 'true',
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
