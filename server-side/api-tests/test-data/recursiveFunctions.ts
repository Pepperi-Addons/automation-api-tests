exports.RecursiveImportTestHost_ImportRelativeURL = async (Client, Request) => {
    let addonUUID = Client.BaseURL.includes('staging')
    ? '48d20f0b-369a-4b34-b48a-ffe245088513'
    : '78696fc6-a04f-4f82-aadf-8f823776473f';
    let name= 'RecursiveImportTestHost';
    let refName = 'RecursiveImportTestReference';
    let addonUUIDName = addonUUID + '_' + name;
    let addonUUIDrefName = addonUUID + '_' + refName;

    // this is our general mapping object, containing the mapping objects of all resources
    if(Request.body["Mapping"]){
        let mappingObject = Request.body["Mapping"];

        if(mappingObject[addonUUIDName] && mappingObject[addonUUIDrefName]){
            // myMapping is the specific mapping object of the Host resource
            let myMapping = mappingObject[addonUUIDName];
            // regMapping is the specific mapping object of the Reference resource
            let refMapping = mappingObject[addonUUIDrefName];

            if (Request.body && Request.body.DIMXObjects){
                for (let index = 0; index < Request.body.DIMXObjects.length; index++) {
                    let element = Request.body.DIMXObjects[index];
                    // change own key if myMapping contains a mapping for it
                    if (myMapping[element.Object.Key]){
                        element.Object.Key = myMapping[element.Object.Key].NewKey;
                    }
                    // change referenced key if refMapping contains a mapping for it
                    if (refMapping[element.Object.Prop2]){
                        element.Object.Prop2 = refMapping[element.Object.Prop2].NewKey;
                    }
                }
            }
        }    
    }
    
    return Request.body;
};


exports.RecursiveImportTestReference_ImportRelativeURL = async (Client, Request) => {
    let addonUUID = Client.BaseURL.includes('staging')
    ? '48d20f0b-369a-4b34-b48a-ffe245088513'
    : '78696fc6-a04f-4f82-aadf-8f823776473f';
    let name= 'RecursiveImportTestReference';
    let addonUUIDName = addonUUID + '_' + name;
    // this is our general mapping object, containing the mapping objects of all resources
    if(Request.body["Mapping"]){
        let mappingObject = Request.body["Mapping"];
        
        if(mappingObject[addonUUIDName]){
            // myMapping is the specific mapping object of the Reference resource
            let myMapping = mappingObject[addonUUIDName];
            if (Request.body && Request.body.DIMXObjects){
                for (let index = 0; index < Request.body.DIMXObjects.length; index++) {
                    let element = Request.body.DIMXObjects[index];
                    // change own key if myMapping contains a mapping for it
                    if(myMapping[element.Object.Key]){
                        element.Object.Key = myMapping[element.Object.Key].NewKey;
                    }
                }
            }
        } 
    }
    return Request.body;
};

exports.RecursiveImportTestHost_MappingRelativeURL = async (Client, Request) => {
    let mappingArray = {};
    let objects = Request.body.Objects;
    objects.forEach(el => {
        mappingArray[el.Key]= {Action:"Replace", NewKey:'Mapped ' + el.Key}
    })
    return {Mapping:mappingArray};
};

exports.RecursiveImportTestReference_MappingRelativeURL = async (Client, Request) => {
    let mappingArray = {};
    let objects = Request.body.Objects;
    objects.forEach(el => {
        mappingArray[el.Key]= {Action:"Replace", NewKey:'Mapped ' + el.Key}
    })
    return {Mapping:mappingArray};
};

exports.RecursiveImportTestContained_FixRelativeURL = async (Client, Request) => {
    let obj = Request.body["Object"];
    obj["ContainedProp1"] = 'Fixed ' + obj["ContainedProp1"];
    return obj;
};