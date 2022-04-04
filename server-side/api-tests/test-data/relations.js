exports.AsIs = async (Client, Request) => {
    return Request.body;
};

exports.RemoveObject = async (Client, Request) => {
    for (let i = 0; i < Request.body.DIMXObjects.length; i++) {
        if (Request.body.DIMXObjects[i]) {
            delete Request.body.DIMXObjects[i].Object.object;
            delete Request.body.DIMXObjects[i].Object.ModificationDateTime;
            delete Request.body.DIMXObjects[i].Object.CreationDateTime;
            delete Request.body.DIMXObjects[i].Object.Hidden;
        }
    }
    return Request.body;
};

exports.RemoveColumn1 = async (Client, Request) => {
    for (let i = 0; i < Request.body.DIMXObjects.length; i++) {
        if (Request.body.DIMXObjects[i].Object.Column1) {
            delete Request.body.DIMXObjects[i].Object.Column1;
        }
    }
    return Request.body;
};

exports.ImportArrayManipulation = async (Client, Request) => {
    Request.body.DIMXObjects.sort((a, b) => (a.Object.Key > b.Object.Key ? 1 : -1));
    for (let i = 0; i < Request.body.DIMXObjects.length; i++) {
        if (Request.body.DIMXObjects[i].Object.Column1) {
            delete Request.body.DIMXObjects[i].Object.Column1;
        }
        if (i % 2 == 0) {
            Request.body.DIMXObjects[i].Object.ObjectOfArrayOfNumbersAndStrings.a[1] = 200;
            Request.body.DIMXObjects[i].Object.ObjectOfArrayOfNumbersAndStrings.b = ['This', 'Is', 'Test'];
        }
    }
    return Request.body;
};

exports.ExportArrayManipulation = async (Client, Request) => {
    Request.body.DIMXObjects.sort((a, b) => (a.Object.Key > b.Object.Key ? 1 : -1));
    for (let i = 0; i < Request.body.DIMXObjects.length; i++) {
        if (Request.body.DIMXObjects[i]) {
            delete Request.body.DIMXObjects[i].Object.object;
            delete Request.body.DIMXObjects[i].Object.ModificationDateTime;
            delete Request.body.DIMXObjects[i].Object.CreationDateTime;
            delete Request.body.DIMXObjects[i].Object.Hidden;
        }
        if (i % 2 == 0) {
            Request.body.DIMXObjects[i].Object.ObjectOfArrayOfNumbersAndStrings.a[0] = 100;
            Request.body.DIMXObjects[i].Object.ObjectOfArrayOfNumbersAndStrings.c.a = 'This_Is_Test';
            Request.body.DIMXObjects[i].Object.ObjectOfArrayOfNumbersAndStrings.c.b = 100;
        }
    }
    return Request.body;
};
