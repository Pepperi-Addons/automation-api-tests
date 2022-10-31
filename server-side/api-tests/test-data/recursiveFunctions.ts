exports.AsIs = async (Client, Request) => {
    return Request.body;
};

exports.RecursiveImportTestHost_ImportRelativeURL = async (Client, Request) => {
    const addonUUID = Client.BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const name = 'recursiveImportTestHost';
    const refName = 'recursiveImportTestReference';
    const addonUUIDName = addonUUID + '_' + name;
    const addonUUIDrefName = addonUUID + '_' + refName;

    // this is our general mapping object, containing the mapping objects of all resources
    if (Request.body['Mapping']) {
        const mappingObject: {
            [addonUUID_resource: string]: {
                [original_key: string]: { Action: 'Replace'; NewKey: string };
            };
        } = Request.body['Mapping'];

        if (mappingObject[addonUUIDName] && mappingObject[addonUUIDrefName]) {
            // myMapping is the specific mapping object of the Host resource
            const myMapping = mappingObject[addonUUIDName];
            // regMapping is the specific mapping object of the Reference resource
            const refMapping = mappingObject[addonUUIDrefName];

            if (Request.body && Request.body.DIMXObjects) {
                for (let index = 0; index < Request.body.DIMXObjects.length; index++) {
                    const element = Request.body.DIMXObjects[index];
                    // change own key if myMapping contains a mapping for it
                    if (myMapping[element.Object.Key]) {
                        element.Object.Key = myMapping[element.Object.Key].NewKey;
                    }
                    // change referenced key if refMapping contains a mapping for it
                    if (refMapping[element.Object.Prop2]) {
                        element.Object.Prop2 = refMapping[element.Object.Prop2].NewKey;
                    }
                }
            }
        }
    }

    return Request.body;
};

exports.RecursiveImportTestReference_ImportRelativeURL = async (Client, Request) => {
    const addonUUID = Client.BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const name = 'recursiveImportTestReference';
    const addonUUIDName = addonUUID + '_' + name;
    // this is our general mapping object, containing the mapping objects of all resources
    if (Request.body['Mapping']) {
        const mappingObject: {
            [addonUUID_resource: string]: {
                [original_key: string]: { Action: 'Replace'; NewKey: string };
            };
        } = Request.body['Mapping'];

        if (mappingObject[addonUUIDName]) {
            // myMapping is the specific mapping object of the Reference resource
            const myMapping = mappingObject[addonUUIDName];
            if (Request.body && Request.body.DIMXObjects) {
                for (let index = 0; index < Request.body.DIMXObjects.length; index++) {
                    const element = Request.body.DIMXObjects[index];
                    // change own key if myMapping contains a mapping for it
                    if (myMapping[element.Object.Key]) {
                        element.Object.Key = myMapping[element.Object.Key].NewKey;
                    }
                }
            }
        }
    }
    return Request.body;
};

exports.RecursiveImportTestHost_MappingRelativeURL = async (Client, Request) => {
    const mappingArray: { [original_key: string]: { Action: 'Replace'; NewKey: string } } = {};
    const objects: any[] = Request.body.Objects;
    objects.forEach((el) => {
        mappingArray[el.Key] = { Action: 'Replace', NewKey: 'Mapped ' + el.Key };
    });
    return { Mapping: mappingArray };
};

exports.RecursiveImportTestReference_MappingRelativeURL = async (Client, Request) => {
    const mappingArray: { [original_key: string]: { Action: 'Replace'; NewKey: string } } = {};
    const objects: any[] = Request.body.Objects;
    objects.forEach((el) => {
        mappingArray[el.Key] = { Action: 'Replace', NewKey: 'Mapped ' + el.Key };
    });
    return { Mapping: mappingArray };
};

exports.RecursiveImportTestContained_FixRelativeURL = async (Client, Request) => {
    const obj = Request.body['Object'];
    obj['ContainedProp1'] = 'Fixed ' + obj['ContainedProp1'];
    return obj;
};
