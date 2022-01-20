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