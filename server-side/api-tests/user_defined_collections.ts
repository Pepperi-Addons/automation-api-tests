import GeneralService, { TesterFunctions } from '../services/general.service';
import { UdcField, UDCService } from '../services/user-defined-collections.service';

export async function UDCTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    const udcService = new UDCService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade UDC
    const dimxName = generalService.papiClient['options'].baseURL.includes('staging')
        ? 'Export and Import Framework'
        : 'Export and Import Framework (DIMX)'; //to handle different DIMX names between envs
    const testData = {
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''],
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', '1.0.2'],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        'User Defined Collections': [UserDefinedCollectionsUUID, ''],
    };
    testData[`${dimxName}`] = ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''];

    // let varKey;
    // if (generalService.papiClient['options'].baseURL.includes('staging')) {
    //     varKey = request.body.varKeyStage;
    // } else {
    //     varKey = request.body.varKeyPro;
    // }
    // const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    // const isInstalledArr = await generalService.areAddonsInstalled(testData);
    //#endregion Upgrade UDC

    describe('UDC Tests Suites', () => {
        // describe('Prerequisites Addon for UDC Tests', () => {
        //     //Test Data
        //     //UDC
        //     isInstalledArr.forEach((isInstalled, index) => {
        //         it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
        //             expect(isInstalled).to.be.true;
        //         });
        //     });
        //     for (const addonName in testData) {
        //         const addonUUID = testData[addonName][0];
        //         const version = testData[addonName][1];
        //         const varLatestVersion = chnageVersionResponseArr[addonName][2];
        //         const changeType = chnageVersionResponseArr[addonName][3];
        //         describe(`Test Data: ${addonName}`, () => {
        //             it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
        //                 if (chnageVersionResponseArr[addonName][4] == 'Failure') {
        //                     expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
        //                 } else {
        //                     expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
        //                 }
        //             });

        //             it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
        //                 await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
        //                     .eventually.to.have.property('Version')
        //                     .a('string')
        //                     .that.is.equal(varLatestVersion);
        //             });
        //         });
        //     }
        // });

        describe('Base Collection Testing', () => {
            let basicCollectionName = '';
            let containedCollectionName = '';
            let indexedCollectionName = '';
            let schemeOnlyCollectionName = '';
            const intVal = 15;
            const douVal = 0.129;
            const strVal = 'Test String UDC Feild';
            const boolVal = true;
            const today = generalService.getDate().split('/');
            const parsedTodayDate = `${today[2]}-${today[1]}-${today[0]}`; //year-month-day
            it('Negative Test: trying to create a collection with forbidden names:"smallLetter","NotSupported###%^"', async () => {
                const numOfInitialCollections = (await udcService.getSchemes()).length;
                const namesToTest = ['smallLetter', 'NotSupported###%^'];
                for (let index = 0; index < namesToTest.length; index++) {
                    const name = namesToTest[index];
                    const smallLetterResponse = await udcService.createUDCWithFields(name, []);
                    expect(smallLetterResponse.Ok).to.equal(false);
                    expect(smallLetterResponse.Status).to.equal(400);
                    expect(smallLetterResponse.Body.fault.faultstring).to.include(
                        'collection name must begin with capital letter, and can only contains URL safe characters',
                    );
                    expect(smallLetterResponse.Fail).to.include(
                        'collection name must begin with capital letter, and can only contains URL safe characters',
                    );
                }
                const documents = await udcService.getSchemes();
                expect(documents.length).to.equal(numOfInitialCollections);
            });
            it('Negative Test: trying to create a collection with forbidden field names:"UpperCase","123"', async () => {
                const numOfInitialCollections = (await udcService.getSchemes()).length;
                const forbiddenField1: UdcField = {
                    Name: 'UpperCase',
                    Mandatory: false,
                    Type: 'String',
                    Value: 'Test',
                };
                const forbiddenField2: UdcField = {
                    Name: '123',
                    Mandatory: false,
                    Type: 'String',
                    Value: 'Test',
                };
                const forbiddenFieldsArray = [forbiddenField1, forbiddenField2];
                for (let index = 0; index < forbiddenFieldsArray.length; index++) {
                    const field = forbiddenFieldsArray[index];
                    const name = generalService.generateRandomString(7)[0].toUpperCase();
                    const smallLetterResponse = await udcService.createUDCWithFields(name, [field]);
                    expect(smallLetterResponse.Ok).to.equal(false);
                    expect(smallLetterResponse.Status).to.equal(400);
                    expect(smallLetterResponse.Body.fault.faultstring).to.include(
                        `Field ${field.Name} must start with lowercase letter, and can only contains URL safe characters`,
                    );
                    expect(smallLetterResponse.Fail).to.include(
                        `Field ${field.Name} must start with lowercase letter, and can only contains URL safe characters`,
                    );
                }
                const documents = await udcService.getSchemes();
                expect(documents.length).to.equal(numOfInitialCollections);
            });
            it('Positive Test: creating an empty UDC with no fields', async () => {
                const numOfInitialCollections = (await udcService.getSchemes()).length;
                basicCollectionName = 'BasicTestingEmpty' + generalService.generateRandomString(7);
                const response = await udcService.createUDCWithFields(
                    basicCollectionName,
                    [],
                    'automation testing UDC',
                );
                expect(response).to.deep.equal({});
                const documents = await udcService.getSchemes();
                expect(documents.length).to.equal(numOfInitialCollections + 1);
            });
            it('Positive Test: creating a basic UDC with all correct data: no field values', async () => {
                const numOfInitialCollections = (await udcService.getSchemes()).length;
                basicCollectionName = 'BasicTesting' + generalService.generateRandomString(7);
                const fieldStr: UdcField = {
                    Name: 'str',
                    Mandatory: true,
                    Type: 'String',
                };
                const fieldBool: UdcField = {
                    Name: 'bool',
                    Mandatory: false,
                    Type: 'Bool',
                };
                const fieldInt: UdcField = {
                    Name: 'int',
                    Mandatory: false,
                    Type: 'Integer',
                };
                const ffieldDou: UdcField = {
                    Name: 'dou',
                    Mandatory: false,
                    Type: 'Double',
                };
                const fieldsArray = [fieldStr, fieldBool, fieldInt, ffieldDou];
                const response = await udcService.createUDCWithFields(
                    basicCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                );
                expect(response.bool.Type).to.equal('Bool');
                expect(response.dou.Type).to.equal('Double');
                expect(response.int.Type).to.equal('Integer');
                expect(response.str.Type).to.equal('String');
                const documents = await udcService.getSchemes();
                expect(documents.length).to.equal(numOfInitialCollections + 1);
                const newCollection = documents.filter((doc) => doc.Name === basicCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                let documentKey = {};
                if (newCollection.DocumentKey) {
                    documentKey = newCollection.DocumentKey;
                }
                expect(documentKey['Delimiter']).to.equal('@');
                expect(documentKey['Fields']).to.deep.equal([]);
                expect(documentKey['Type']).to.equal('AutoGenerate');
                expect(newCollection.Type).to.equal('data');
                expect(newCollection.Hidden).to.equal(false);
                expect(newCollection.GenericResource).to.equal(true);
            });
            //TODO:trying to upsert NOT matching values to types in udc just was created
            // it('Negative Test: trying to upsert NOT matching values to types in udc just was created', async () => {
            // const strValue = {
            //     "str": 115
            // };
            // const response = await udcService.postDocument("APITest", { strValue });
            //     debugger;
            // });
            //TODO: trying to upsert Without The Mandatory Field
            // it('Negative Test: trying to upsert Without The Mandatory Field', async () => {
            // const strValue = {
            //     "str": 115
            // };
            // const response = await udcService.postDocument("APITest", { strValue });
            //     debugger;
            // });
            it('Positive Test: adding data to just created UDC', async () => {
                const fieldValues = {
                    int: intVal,
                    dou: douVal,
                    str: strVal,
                    bool: boolVal,
                };
                const response = await udcService.sendDataToField(basicCollectionName, fieldValues);
                expect(response.Ok).to.equal(true);
                expect(response.Status).to.equal(200);
                expect(response.Body.bool).to.equal(boolVal);
                expect(response.Body.dou).to.equal(douVal);
                expect(response.Body.int).to.equal(intVal);
                expect(response.Body.str).to.equal(strVal);
                expect(response.Body.Hidden).to.equal(false);
                expect(response.Body).to.haveOwnProperty('Key');
                expect(response.Body.CreationDateTime).to.include(parsedTodayDate);
                expect(response.Body.ModificationDateTime).to.include(parsedTodayDate);
            });
            it('Positive Test: getting the new UDC data just upserted', async () => {
                const document = (await udcService.getDocuments(basicCollectionName))[0];
                expect(document.ModificationDateTime).to.include(parsedTodayDate);
                expect(document.CreationDateTime).to.include(parsedTodayDate);
                expect(document.bool).to.equal(boolVal);
                expect(document.dou).to.equal(douVal);
                expect(document.int).to.equal(intVal);
                expect(document.str).to.equal(strVal);
                expect(document.Hidden).to.equal(false);
                expect(document).to.haveOwnProperty('Key');
            });
            it('Positive Test: creating a UDC which field is the basic UDC as containd resource', async () => {
                const numOfInitialCollections = (await udcService.getSchemes()).length;
                containedCollectionName = 'ContainedTesting' + generalService.generateRandomString(7);
                const fieldContained: UdcField = {
                    Name: 'containedRes',
                    Mandatory: true,
                    Type: 'ContainedResource',
                    AdddonUID: UserDefinedCollectionsUUID,
                    Resource: basicCollectionName,
                };
                const fieldsArray = [fieldContained];
                const response = await udcService.createUDCWithFields(
                    containedCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                );
                expect(response).to.haveOwnProperty(fieldContained.Name);
                expect(response.containedRes.Resource).to.equal(fieldContained.Resource);
                expect(response.containedRes.Type).to.equal(fieldContained.Type);
                const numOfCollections = (await udcService.getSchemes()).length;
                expect(numOfCollections).to.equal(numOfInitialCollections + 1);
            });
            it('Positive Test: upserting data by basic UDC format which is the field of new UDC', async () => {
                const field = {};
                field['containedRes'] = {
                    int: intVal,
                    dou: douVal,
                    str: strVal,
                    bool: boolVal,
                };
                const response = await udcService.sendDataToField(containedCollectionName, field);
                expect(response.Ok).to.equal(true);
                expect(response.Status).to.equal(200);
                expect(response.Body.containedRes.bool).to.equal(boolVal);
                expect(response.Body.containedRes.dou).to.equal(douVal);
                expect(response.Body.containedRes.int).to.equal(intVal);
                expect(response.Body.containedRes.str).to.equal(strVal);
                expect(response.Body.Hidden).to.equal(false);
                expect(response.Body).to.haveOwnProperty('Key');
                expect(response.Body.CreationDateTime).to.include(parsedTodayDate);
                expect(response.Body.ModificationDateTime).to.include(parsedTodayDate);
            });
            it('Positive Test: getting the new UDC contained resource data just upserted', async () => {
                const document = (await udcService.getDocuments(containedCollectionName))[0];
                expect(document.ModificationDateTime).to.include(parsedTodayDate);
                expect(document.CreationDateTime).to.include(parsedTodayDate);
                expect(document.containedRes.bool).to.equal(boolVal);
                expect(document.containedRes.dou).to.equal(douVal);
                expect(document.containedRes.int).to.equal(intVal);
                expect(document.containedRes.str).to.equal(strVal);
                expect(document.Hidden).to.equal(false);
                expect(document).to.haveOwnProperty('Key');
            });
            //TODO:trying to upsert unmatching data to UDC which field is a containd resource of basic field
            // it('Negative Test: trying to upsert unmatching data to UDC which field is a containd resource of basic field', async () => {
            //     const field = {};
            //     field["containedRes"] = {
            //         "abc": 200,
            //     }
            //     const response = await udcService.sendDataToField(containedCollectionName, field);
            //     debugger;
            //     expect(response.Ok).to.equal(true);
            //     expect(response.Status).to.equal(200);
            //     expect(response.Body.bool).to.equal(boolVal);
            //     expect(response.Body.dou).to.equal(douVal);
            //     expect(response.Body.int).to.equal(intVal);
            //     expect(response.Body.str).to.equal(strVal);
            //     expect(response.Body.Hidden).to.equal(false);
            //     expect(response.Body).to.haveOwnProperty("Key");
            //     expect(response.Body.CreationDateTime).to.include(parsedTodayDate);
            //     expect(response.Body.ModificationDateTime).to.include(parsedTodayDate);
            // });
            it('Positive Test: creating a UDC with indexed fields', async () => {
                const numOfInitialCollections = (await udcService.getSchemes()).length;
                indexedCollectionName = 'IndexedTesting' + generalService.generateRandomString(7);
                const fieldStr: UdcField = {
                    Name: 'str',
                    Mandatory: true,
                    Type: 'String',
                    Indexed: true,
                };
                const fieldBool: UdcField = {
                    Name: 'bool',
                    Mandatory: false,
                    Type: 'Bool',
                    Indexed: true,
                };
                const fieldInt: UdcField = {
                    Name: 'int',
                    Mandatory: false,
                    Type: 'Integer',
                    Indexed: true,
                };
                const ffieldDou: UdcField = {
                    Name: 'dou',
                    Mandatory: false,
                    Type: 'Double',
                    Indexed: true,
                };
                const fieldsArray = [fieldStr, fieldBool, fieldInt, ffieldDou];
                const response = await udcService.createUDCWithFields(
                    indexedCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                );
                expect(response.bool.Type).to.equal('Bool');
                expect(response.bool.Indexed).to.equal(true);
                expect(response.dou.Type).to.equal('Double');
                expect(response.dou.Indexed).to.equal(true);
                expect(response.int.Type).to.equal('Integer');
                expect(response.int.Indexed).to.equal(true);
                expect(response.str.Type).to.equal('String');
                expect(response.str.Indexed).to.equal(true);
                const documents = await udcService.getSchemes();
                expect(documents.length).to.equal(numOfInitialCollections + 1);
                const newCollection = documents.filter((doc) => doc.Name === indexedCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                let documentKey = {};
                if (newCollection.DocumentKey) {
                    documentKey = newCollection.DocumentKey;
                }
                expect(documentKey['Delimiter']).to.equal('@');
                expect(documentKey['Fields']).to.deep.equal([]);
                expect(documentKey['Type']).to.equal('AutoGenerate');
                expect(newCollection.Type).to.equal('data');
                expect(newCollection.Hidden).to.equal(false);
                expect(newCollection.GenericResource).to.equal(true);
            });
            // it('Positive Test: upserting data to indexed UDC', async () => {
            //     let field = {};
            //     const arrayOfValues: any[] = [];
            //     for (let index = 0; index < 130; index++) {
            //         field = {
            //             int: Math.floor(Math.random() * 5),
            //             dou: Math.random(),
            //             str: generalService.generateRandomString(5),
            //             bool: Math.random() < 0.5,
            //         }
            //         arrayOfValues.push(field);
            //     }
            //     for (let index = 0; index < arrayOfValues.length; index++) {
            //         const field = arrayOfValues[index];
            //         const response = await udcService.sendDataToField(indexedCollectionName, field);
            //         expect(response.Ok).to.equal(true);
            //         expect(response.Status).to.equal(200);
            //         expect(response.Body.bool).to.equal(field.bool);
            //         expect(response.Body.dou).to.equal(field.dou);
            //         expect(response.Body.int).to.equal(field.int);
            //         expect(response.Body.str).to.equal(field.str);
            //         expect(response.Body.Hidden).to.equal(false);
            //         expect(response.Body).to.haveOwnProperty('Key');
            //         expect(response.Body.CreationDateTime).to.include(parsedTodayDate);
            //         expect(response.Body.ModificationDateTime).to.include(parsedTodayDate);
            //     }
            //     generalService.sleep(3000);
            //     const allObjects = await udcService.getAllObjectFromCollection(indexedCollectionName, 1, 130);
            //     expect(allObjects.objects.length).to.equal(arrayOfValues.length);
            //     expect(allObjects.count).to.equal(arrayOfValues.length);
            //     for (let index = 0; index < allObjects.objects.length; index++) {
            //         const returnedObj = allObjects.objects[index];
            //         const match = arrayOfValues.filter(field => field.bool === returnedObj.bool && field.int === returnedObj.int && field.str === returnedObj.str && field.dou === returnedObj.dou);
            //         expect(match.length).to.equal(1);
            //     }
            // });
            // it('Positive Test: getting indexed data from UDC - using paganation + count field', async () => {
            //     const allObjects50page1 = await udcService.getAllObjectFromCollection(indexedCollectionName, 1, 50);
            //     expect(allObjects50page1.objects.length).to.equal(50);
            //     expect(allObjects50page1.count).to.equal(130);
            //     const allObjects50page2 = await udcService.getAllObjectFromCollection(indexedCollectionName, 2, 50);
            //     expect(allObjects50page2.objects.length).to.equal(50);
            //     expect(allObjects50page2.count).to.equal(130);
            //     const allObjects50page3 = await udcService.getAllObjectFromCollection(indexedCollectionName, 3, 50);
            //     expect(allObjects50page3.objects.length).to.equal(30);
            //     expect(allObjects50page3.count).to.equal(130);
            //     const allObjects50page4 = await udcService.getAllObjectFromCollection(indexedCollectionName, 4, 50);
            //     expect(allObjects50page4.objects.length).to.equal(0);
            //     expect(allObjects50page4.count).to.equal(130);
            //     const allObjects100page1 = await udcService.getAllObjectFromCollection(indexedCollectionName, 1, 100);
            //     expect(allObjects100page1.objects.length).to.equal(100);
            //     expect(allObjects100page1.count).to.equal(130);
            //     const allObjects100page2 = await udcService.getAllObjectFromCollection(indexedCollectionName, 2, 100);
            //     expect(allObjects100page2.objects.length).to.equal(30);
            //     expect(allObjects100page2.count).to.equal(130);
            //     //hide an object and see the count changing
            //     const hideResponse = await udcService.hideObjectInACollection(
            //         indexedCollectionName,
            //         allObjects50page1.objects[0].Key,
            //     );
            //     expect(hideResponse.Body.Key).to.equal(allObjects50page1.objects[0].Key);
            //     expect(hideResponse.Body.ModificationDateTime).to.include(parsedTodayDate);
            //     expect(hideResponse.Body.Hidden).to.equal(true);
            //     generalService.sleep(3000);
            //     const allObjects = await udcService.getAllObjectFromCollection(indexedCollectionName, 1, 130);
            //     expect(allObjects.count).to.equal(129);
            // });
            //TODO: positive -> using it as a resource in another UDC
            it('Positive Test: creating a Scheme - Only UDC', async () => {
                const numOfInitialCollections = (await udcService.getSchemes()).length;
                schemeOnlyCollectionName = 'SchemeOnlyTesting' + generalService.generateRandomString(7);
                const fieldStr: UdcField = {
                    Name: 'str',
                    Mandatory: true,
                    Type: 'String',
                };
                const fieldBool: UdcField = {
                    Name: 'bool',
                    Mandatory: false,
                    Type: 'Bool',
                };
                const fieldInt: UdcField = {
                    Name: 'int',
                    Mandatory: false,
                    Type: 'Integer',
                };
                const ffieldDou: UdcField = {
                    Name: 'dou',
                    Mandatory: false,
                    Type: 'Double',
                };
                const fieldsArray = [fieldStr, fieldBool, fieldInt, ffieldDou];
                const response = await udcService.createUDCWithFields(
                    schemeOnlyCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                    'contained',
                );
                expect(response.bool.Type).to.equal('Bool');
                expect(response.dou.Type).to.equal('Double');
                expect(response.int.Type).to.equal('Integer');
                expect(response.str.Type).to.equal('String');
                const documents = await udcService.getSchemes();
                expect(documents.length).to.equal(numOfInitialCollections + 1);
                const newCollection = documents.filter((doc) => doc.Name === schemeOnlyCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                let documentKey = {};
                if (newCollection.DocumentKey) {
                    documentKey = newCollection.DocumentKey;
                }
                expect(documentKey['Delimiter']).to.equal('@');
                expect(documentKey['Fields']).to.deep.equal([]);
                expect(documentKey['Type']).to.equal('AutoGenerate');
                expect(newCollection.Hidden).to.equal(false);
                expect(newCollection.GenericResource).to.equal(true);
                expect(newCollection.Type).to.equal('contained');
            });
            it('Negative Test: trying to push data to scheme only UDC', async () => {
                const fieldValues = {
                    int: intVal,
                    dou: douVal,
                    str: strVal,
                    bool: boolVal,
                };
                const response = await udcService.sendDataToField(schemeOnlyCollectionName, fieldValues);
                expect(response.Ok).to.equal(false);
                expect(response.Status).to.equal(400);
                expect(response.Body).to.haveOwnProperty('fault');
                expect(response.Body.fault.faultstring).to.include("Unsupported schema type 'contained'");
            });
            //TODO: import export: basic and with dot notation on accounts
            it("Negative Test: trying to delete 'scheme only' UDC's", async () => {
                const documents = await udcService.getSchemes();
                const schemeOnlyCollections = documents.filter((doc) => doc.Type === 'contained');
                for (let index = 0; index < schemeOnlyCollections.length; index++) {
                    const collectionToHide = schemeOnlyCollections[index];
                    const hideResponse = await udcService.hideCollection(collectionToHide.Name);
                    expect(hideResponse.Body).to.haveOwnProperty('fault');
                    expect(hideResponse.Body.fault.faultstring).to.include("Unsupported schema type 'contained'");
                }
            });
            it("Tear Down: cleaning all upserted UDC's", async () => {
                const documents = await udcService.getSchemes();
                const toHideCollections = documents.filter(
                    (doc) =>
                        doc.Name.includes('BasicTesting') ||
                        doc.Name.includes('ContainedTesting') ||
                        doc.Name.includes('IndexedTesting'),
                );
                for (let index = 0; index < toHideCollections.length; index++) {
                    const collectionToHide = toHideCollections[index];
                    const collectionsObjcts = await udcService.getAllObjectFromCollection(collectionToHide.Name);
                    if (collectionsObjcts.objects && collectionsObjcts.objects.length > 0) {
                        for (let index = 0; index < collectionsObjcts.objects.length; index++) {
                            const obj = collectionsObjcts.objects[index];
                            const hideResponse = await udcService.hideObjectInACollection(
                                collectionToHide.Name,
                                obj.Key,
                            );
                            expect(hideResponse.Body.Key).to.equal(obj.Key);
                            expect(hideResponse.Body.ModificationDateTime).to.include(parsedTodayDate);
                            expect(hideResponse.Body.Hidden).to.equal(true);
                        }
                    }
                    const hideResponse = await udcService.hideCollection(collectionToHide.Name);
                    if (hideResponse.Body.fault) {
                        if (hideResponse.Body.fault.faultstring.includes("Unsupported schema type 'contained'")) {
                            console.log(`${collectionToHide.Name} is scheme only which shouldn't be deletable`);
                        }
                    } else {
                        expect(hideResponse.Body.Name).to.equal(collectionToHide.Name);
                        expect(hideResponse.Body.ModificationDateTime).to.include(parsedTodayDate);
                        expect(hideResponse.Body.Hidden).to.equal(true);
                    }
                }
            });
        });
    });
}
