import GeneralService, { TesterFunctions } from '../services/general.service';
import { UdcField, UDCService } from '../services/user-defined-collections.service';

export async function UDCTestser(generalService: GeneralService, request, tester: TesterFunctions) {
    await UDCTests(generalService, request, tester);
}
export async function UDCTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    const udcService = new UDCService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }

    await generalService.baseAddonVersionsInstallation(varKey);
    //#region Upgrade UDC
    const testData = {
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''],
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', ''],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''],
        'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', ''],
        'User Defined Collections': [UserDefinedCollectionsUUID, ''],
        'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', '1.1.25'],
        'Activity Data Index': ['10979a11-d7f4-41df-8993-f06bfd778304', '1.1.10'],
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
    };

    //For local run that run on Jenkins this is needed since Jenkins dont inject SK to the test execution folder
    if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
        const addonSecretKey = await generalService.getSecretKey(generalService['client'].AddonUUID, varKey);
        generalService['client'].AddonSecretKey = addonSecretKey;
        generalService.papiClient['options'].addonSecretKey = addonSecretKey;
    }
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    //#endregion Upgrade UDC

    describe('UDC Tests Suites', () => {
        describe('Prerequisites Addon for UDC Tests', () => {
            //Test Data
            //UDC
            isInstalledArr.forEach((isInstalled, index) => {
                it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
                    expect(isInstalled).to.be.true;
                });
            });
            for (const addonName in testData) {
                const addonUUID = testData[addonName][0];
                const version = testData[addonName][1];
                const varLatestVersion = chnageVersionResponseArr[addonName][2];
                const changeType = chnageVersionResponseArr[addonName][3];
                describe(`Test Data: ${addonName}`, () => {
                    it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                        if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                            expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                        } else {
                            expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                        }
                    });

                    it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(varLatestVersion);
                    });
                });
            }
        });
        describe('Base Collection Testing', () => {
            let basicCollectionName = '';
            let keyCollectionName = '';
            let containedCollectionName = '';
            let indexedCollectionName = '';
            let schemeOnlyCollectionName = '';
            let basicArrayCollectionName = '';
            let basicOnlineCollectionName = '';
            let baseedOnSchemeOnlyCollectionName = '';
            let accResourceCollectionName = '';
            const intVal = 15;
            const douVal = 0.129;
            const strVal = 'Test String UDC Feild';
            const boolVal = true;
            const today = generalService.getDate().split('/');
            const parsedTodayDate = `${today[2]}-${today[1]}-${today[0]}`; //year-month-day
            it(`Positive Test: testing DI-22319: mark 'scheme only' schemes with 'sync=true'`, async () => {
                const allUdcs = await udcService.getSchemes({ page_size: -1 });
                const filteredUdcs = allUdcs.filter((collection) => collection.Type === 'contained');
                const isError = filteredUdcs.filter((collection) => collection.SyncData?.Sync !== true);
                expect(isError.length).to.equal(0);
            });
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
                    const name = generalService.generateRandomString(15)[0].toUpperCase();
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
            it('Positive Test: creating an empty UDC with no fields configured', async () => {
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                basicCollectionName = 'BasicTestingEmpty' + generalService.generateRandomString(15);
                const response = await udcService.createUDCWithFields(
                    basicCollectionName,
                    [],
                    'automation testing UDC',
                );
                expect(response.Fail).to.be.undefined;
                expect(response).to.deep.equal({});
                generalService.sleep(5000);
                const documents = await udcService.getSchemes({ page_size: -1 });
                expect(documents.length).to.equal(numOfInitialCollections + 1);
            });
            it('Positive Test: creating a UDC with all types of basic fields', async () => {
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                basicCollectionName = 'BasicTesting' + generalService.generateRandomString(15);
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
                expect(response.Fail).to.be.undefined;
                expect(response.bool.Type).to.equal('Bool');
                expect(response.dou.Type).to.equal('Double');
                expect(response.int.Type).to.equal('Integer');
                expect(response.str.Type).to.equal('String');
                generalService.sleep(5000);
                const documents = await udcService.getSchemes({ page_size: -1 });
                expect(documents.length).to.equal(numOfInitialCollections + 1);
                const newCollection = documents.filter((doc) => doc.Name === basicCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                const fields: any[] = [];
                for (const i in newCollection.Fields) {
                    fields.push({ Name: i, Field: newCollection.Fields[i] });
                }
                for (let index = 0; index < fields.length; index++) {
                    const field = fields[index];
                    if (field.Name === 'str') {
                        expect(field.Field.Mandatory).to.equal(true);
                    } else {
                        expect(field.Field.Mandatory).to.equal(false);
                    }
                }
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
            it('Positive Test: change fields mandatory value BEFORE data is added', async () => {
                const fieldStr: UdcField = {
                    Name: 'str',
                    Mandatory: false,
                    Type: 'String',
                };
                const response = await udcService.EditCollection(basicCollectionName, [fieldStr]);
                expect(response.Ok).to.equal(true);
                expect(response.Status).to.equal(200);
                expect(response.Body.Name).to.equal(basicCollectionName);
                expect(response.Body.CreationDateTime).to.include(parsedTodayDate);
                expect(response.Body.ModificationDateTime).to.include(parsedTodayDate);
                expect(response.Body.Fields).to.haveOwnProperty('str');
                expect(response.Body.Fields.str.Type).to.equal('String');
                expect(response.Body.Fields.str.Mandatory).to.equal(fieldStr.Mandatory);
            });
            it('Negative Test: trying to upsert NOT matching values to types in udc just was created', async () => {
                const strValue = {
                    str: 115,
                };
                const response = await udcService.sendDataToField(basicCollectionName, strValue);
                expect(response.Ok).to.equal(false);
                expect(response.Status).to.equal(400);
                expect(response.Body.fault.faultstring).to.equal(
                    'Failed due to exception: str is not of a type(s) string',
                );
            });
            //TODO: trying to upsert Without The Mandatory Field
            // it('Negative Test: trying to upsert Without The Mandatory Field', async () => {
            // const strValue = {
            //     "str": 115
            // };
            // const response = await udcService.postDocument("APITest", { strValue });
            //     debugger;
            // });
            it('Positive Test: adding basic data to just created UDC - all basic types', async () => {
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
                generalService.sleep(5000);
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
            it('Positive Test: creating a UDC with all types of basic fields AND a Key Based On Fields', async () => {
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                keyCollectionName = 'KeyBasicTesting' + generalService.generateRandomString(15);
                const fieldStr: UdcField = {
                    Name: 'str',
                    Mandatory: true,
                    Type: 'String',
                };
                const fieldInt: UdcField = {
                    Name: 'int',
                    Mandatory: true,
                    Type: 'Integer',
                };
                const fieldsArray = [fieldStr, fieldInt];
                const response = await udcService.createUDCWithFields(
                    keyCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                    undefined,
                    undefined,
                    fieldsArray,
                );
                expect(response.Fail).to.be.undefined;
                expect(response.str.Type).to.equal('String');
                expect(response.str.Mandatory).to.equal(true);
                expect(response.int.Type).to.equal('Integer');
                expect(response.int.Mandatory).to.equal(true);
                generalService.sleep(5000);
                const documents = await udcService.getSchemes({ page_size: -1 });
                expect(documents.length).to.equal(numOfInitialCollections + 1);
                const newCollection = documents.filter((doc) => doc.Name === keyCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                let documentKey = {};
                if (newCollection.DocumentKey) {
                    documentKey = newCollection.DocumentKey;
                }
                expect(documentKey['Delimiter']).to.equal('@');
                expect(documentKey['Fields']).to.deep.equal(['str', 'int']);
                expect(documentKey['Type']).to.equal('Composite');
                expect(newCollection.Type).to.equal('data');
                expect(newCollection.Hidden).to.equal(false);
                expect(newCollection.GenericResource).to.equal(true);
            });
            it('Positive Test: adding data to just created User Defined Key Collection - testing the ket is indeed composed of included values', async () => {
                const intVal = 14;
                const strVal = 'testing';
                const fieldValues = {
                    int: intVal,
                    str: strVal,
                };
                const response = await udcService.sendDataToField(keyCollectionName, fieldValues);
                expect(response.Ok).to.equal(true);
                expect(response.Status).to.equal(200);
                expect(response.Body.int).to.equal(intVal);
                expect(response.Body.str).to.equal(strVal);
                expect(response.Body.Hidden).to.equal(false);
                expect(response.Body).to.haveOwnProperty('Key');
                expect(response.Body.Key).to.equal(`${strVal}@${intVal}`);
                expect(response.Body.CreationDateTime).to.include(parsedTodayDate);
                expect(response.Body.ModificationDateTime).to.include(parsedTodayDate);
            });
            it('Negative Test: trying to create a collection with exsisting name', async () => {
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                const response = await udcService.createUDCWithFields(
                    basicCollectionName,
                    [],
                    'automation testing UDC',
                );
                expect(response.Fail).to.contain('Object already Exist');
                expect(response.Ok).to.equal(false);
                expect(response.Status).to.equal(400);
                expect(response.Body.fault.faultstring).to.include('Object already Exist');
                generalService.sleep(5000);
                const documents = await udcService.getSchemes({ page_size: -1 });
                expect(documents.length).to.equal(numOfInitialCollections);
            });
            it('Positive Test: creating a UDC which field is the basic UDC as containd resource', async () => {
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                containedCollectionName = 'ContainedTesting' + generalService.generateRandomString(15);
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
                generalService.sleep(5000);
                expect(response.Fail).to.be.undefined;
                expect(response).to.haveOwnProperty(fieldContained.Name);
                expect(response.containedRes.Resource).to.equal(fieldContained.Resource);
                expect(response.containedRes.Type).to.equal(fieldContained.Type);
                const numOfCollections = (await udcService.getSchemes({ page_size: -1 })).length;
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
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                indexedCollectionName = 'IndexedTesting' + generalService.generateRandomString(15);
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
                expect(response.Fail).to.be.undefined;
                expect(response.bool.Type).to.equal('Bool');
                expect(response.bool.Indexed).to.equal(true);
                expect(response.dou.Type).to.equal('Double');
                expect(response.dou.Indexed).to.equal(true);
                expect(response.int.Type).to.equal('Integer');
                expect(response.int.Indexed).to.equal(true);
                expect(response.str.Type).to.equal('String');
                expect(response.str.Indexed).to.equal(true);
                generalService.sleep(5000);
                const documents = await udcService.getSchemes({ page_size: -1 });
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
            it('Positive Test: upserting data to indexed UDC', async () => {
                let field = {};
                const arrayOfValues: any[] = [];
                for (let index = 0; index < 130; index++) {
                    field = {
                        int: Math.floor(Math.random() * 5),
                        dou: Math.random(),
                        str: generalService.generateRandomString(5),
                        bool: Math.random() < 0.5,
                    };
                    arrayOfValues.push(field);
                }
                for (let index = 0; index < arrayOfValues.length; index++) {
                    const field = arrayOfValues[index];
                    const response = await udcService.sendDataToField(indexedCollectionName, field);
                    expect(response.Ok).to.equal(true);
                    expect(response.Status).to.equal(200);
                    expect(response.Body.bool).to.equal(field.bool);
                    expect(response.Body.dou).to.equal(field.dou);
                    expect(response.Body.int).to.equal(field.int);
                    expect(response.Body.str).to.equal(field.str);
                    expect(response.Body.Hidden).to.equal(false);
                    expect(response.Body).to.haveOwnProperty('Key');
                    expect(response.Body.CreationDateTime).to.include(parsedTodayDate);
                    expect(response.Body.ModificationDateTime).to.include(parsedTodayDate);
                }
                generalService.sleep(5000);
                const allObjects = await udcService.getAllObjectFromCollection(indexedCollectionName, 1, 130);
                expect(allObjects.objects.length).to.equal(arrayOfValues.length);
                expect(allObjects.count).to.equal(arrayOfValues.length);
                for (let index = 0; index < allObjects.objects.length; index++) {
                    const returnedObj = allObjects.objects[index];
                    const match = arrayOfValues.filter(
                        (field) =>
                            field.bool === returnedObj.bool &&
                            field.int === returnedObj.int &&
                            field.str === returnedObj.str &&
                            field.dou === returnedObj.dou,
                    );
                    expect(match.length).to.equal(1);
                }
            });
            it('Positive Test: getting indexed data from UDC - using paganation + count field', async () => {
                const allObjects50page1 = await udcService.getAllObjectFromCollection(indexedCollectionName, 1, 50);
                expect(allObjects50page1.objects.length).to.equal(50);
                expect(allObjects50page1.count).to.equal(130);
                const allObjects50page2 = await udcService.getAllObjectFromCollection(indexedCollectionName, 2, 50);
                expect(allObjects50page2.objects.length).to.equal(50);
                expect(allObjects50page2.count).to.equal(130);
                const allObjects50page3 = await udcService.getAllObjectFromCollection(indexedCollectionName, 3, 50);
                expect(allObjects50page3.objects.length).to.equal(30);
                expect(allObjects50page3.count).to.equal(130);
                const allObjects50page4 = await udcService.getAllObjectFromCollection(indexedCollectionName, 4, 50);
                expect(allObjects50page4.objects.length).to.equal(0);
                expect(allObjects50page4.count).to.equal(130);
                const allObjects100page1 = await udcService.getAllObjectFromCollection(indexedCollectionName, 1, 100);
                expect(allObjects100page1.objects.length).to.equal(100);
                expect(allObjects100page1.count).to.equal(130);
                const allObjects100page2 = await udcService.getAllObjectFromCollection(indexedCollectionName, 2, 100);
                expect(allObjects100page2.objects.length).to.equal(30);
                expect(allObjects100page2.count).to.equal(130);
                //hide an object and see the count changing
                const hideResponse = await udcService.hideObjectInACollection(
                    indexedCollectionName,
                    allObjects50page1.objects[0].Key,
                );
                expect(hideResponse.Body.Key).to.equal(allObjects50page1.objects[0].Key);
                expect(hideResponse.Body.ModificationDateTime).to.include(parsedTodayDate);
                expect(hideResponse.Body.Hidden).to.equal(true);
                generalService.sleep(5000);
                const allObjects = await udcService.getAllObjectFromCollection(indexedCollectionName, 1, 130);
                expect(allObjects.count).to.equal(129);
            });
            it('Positive Test: creating a "Scheme - Only" UDC', async () => {
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                schemeOnlyCollectionName = 'SchemeOnlyTesting' + generalService.generateRandomString(50);
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
                expect(response.Fail).to.be.undefined;
                expect(response.bool.Type).to.equal('Bool');
                expect(response.dou.Type).to.equal('Double');
                expect(response.int.Type).to.equal('Integer');
                expect(response.str.Type).to.equal('String');
                generalService.sleep(5000);
                const documents = await udcService.getSchemes({ page_size: -1 });
                expect(documents.length).to.equal(numOfInitialCollections + 1);
                const newCollection = documents.filter((doc) => doc.Name === schemeOnlyCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                let documentKey = {};
                if (newCollection.DocumentKey) {
                    documentKey = newCollection.DocumentKey;
                } else {
                    throw 'Error: No Document Key Recived';
                }
                expect(documentKey['Delimiter']).to.equal('@');
                expect(documentKey['Fields']).to.deep.equal([]);
                expect(documentKey['Type']).to.equal('AutoGenerate');
                expect(newCollection.Hidden).to.equal(false);
                expect(newCollection.GenericResource).to.equal(true);
                expect(newCollection.Type).to.equal('contained');
            });
            it('Negative Test: trying to push data to "scheme only" UDC', async () => {
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
                expect(response.Body.fault.faultstring).to.include('Unsupported schema type contained');
            });
            it('Positive Test: create a UDC based on "scheme only" UDC', async () => {
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                baseedOnSchemeOnlyCollectionName =
                    'SchemeBasedOnOnlySchemeTesting' + generalService.generateRandomString(15);
                const fieldBasedOnSchemeOnly: UdcField = {
                    Name: 'basedOn',
                    Mandatory: true,
                    Type: 'ContainedResource',
                    Resource: schemeOnlyCollectionName,
                };
                const response = await udcService.createUDCWithFields(
                    baseedOnSchemeOnlyCollectionName,
                    [fieldBasedOnSchemeOnly],
                    'automation testing UDC',
                );
                expect(response.Fail).to.be.undefined;
                expect(response.basedOn.Type).to.equal('ContainedResource');
                const documents = await udcService.getSchemes({ page_size: -1 });
                expect(documents.length).to.equal(numOfInitialCollections + 1);
                const newCollection = documents.filter((doc) => doc.Name === baseedOnSchemeOnlyCollectionName)[0];
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
                expect(newCollection.Type).to.equal('data');
            });
            it('Positive Test: pushing data to UDC which is based on "scheme only"', async () => {
                const field = {};
                field['basedOn'] = {
                    int: intVal,
                    dou: douVal,
                    str: strVal,
                    bool: boolVal,
                };
                const response = await udcService.sendDataToField(baseedOnSchemeOnlyCollectionName, field);
                expect(response.Ok).to.equal(true);
                expect(response.Status).to.equal(200);
                expect(response.Body.basedOn.bool).to.equal(boolVal);
                expect(response.Body.basedOn.dou).to.equal(douVal);
                expect(response.Body.basedOn.int).to.equal(intVal);
                expect(response.Body.basedOn.str).to.equal(strVal);
                expect(response.Body.Hidden).to.equal(false);
                expect(response.Body).to.haveOwnProperty('Key');
                expect(response.Body.CreationDateTime).to.include(parsedTodayDate);
                expect(response.Body.ModificationDateTime).to.include(parsedTodayDate);
            });
            it('Positive Test: creating a basic UDC with all array data for all fields', async () => {
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                basicArrayCollectionName = 'BasicArrayTesting' + generalService.generateRandomString(15);
                const arrayFieldInt: UdcField = {
                    Name: 'int2',
                    Mandatory: true,
                    Type: 'Integer',
                    isArray: true,
                };
                const arrayFieldStr: UdcField = {
                    Name: 'str2',
                    Mandatory: true,
                    Type: 'String',
                    isArray: true,
                };
                // const arrayFieldBool: UdcField = {
                //     Name: 'bool',
                //     Mandatory: false,
                //     Type: 'Bool',
                //     isArray: true
                // };
                const arrayFieldDou: UdcField = {
                    Name: 'dou2',
                    Mandatory: false,
                    Type: 'Double',
                    isArray: true,
                };
                const allFieldsToCreate = [arrayFieldInt, arrayFieldStr, arrayFieldDou];
                const response = await udcService.createUDCWithFields(
                    basicArrayCollectionName,
                    allFieldsToCreate,
                    'automation testing UDC',
                );
                expect(response.Fail).to.be.undefined;
                expect(response.int2.Type).to.equal('Array');
                expect(response.str2.Type).to.equal('Array');
                expect(response.dou2.Type).to.equal('Array');
                const documents = await udcService.getSchemes({ page_size: -1 });
                expect(documents.length).to.equal(numOfInitialCollections + 1);
                expect(response.int2.Items.Type).to.equal('Integer');
                expect(response.str2.Items.Type).to.equal('String');
                expect(response.dou2.Items.Type).to.equal('Double');
                expect(response.int2.Items.Mandatory).to.equal(false);
                expect(response.str2.Items.Mandatory).to.equal(false);
                expect(response.dou2.Items.Mandatory).to.equal(false);
                const newCollection = documents.filter((doc) => doc.Name === basicArrayCollectionName)[0];
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
            it('Positive Test: adding array data to just created array UDC', async () => {
                const fieldValues = {
                    int2: [1, 2, 3],
                    dou2: [1.1, 1.2, 1.3],
                    str2: ['a', 'b', 'c'],
                };
                const response = await udcService.sendDataToField(basicArrayCollectionName, fieldValues);
                expect(response.Ok).to.equal(true);
                expect(response.Status).to.equal(200);
                expect(response.Body.dou2).to.deep.equal([1.1, 1.2, 1.3]);
                expect(response.Body.int2).to.deep.equal([1, 2, 3]);
                expect(response.Body.str2).to.deep.equal(['a', 'b', 'c']);
                expect(response.Body.Hidden).to.equal(false);
                expect(response.Body).to.haveOwnProperty('Key');
                expect(response.Body.CreationDateTime).to.include(parsedTodayDate);
                expect(response.Body.ModificationDateTime).to.include(parsedTodayDate);
            });
            it('Positive Test: creating an ONLINE ONLY basic UDC', async () => {
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                basicOnlineCollectionName = 'BasicOnlineTesting' + generalService.generateRandomString(15);
                const fieldInt: UdcField = {
                    Name: 'int1',
                    Mandatory: true,
                    Type: 'Integer',
                };
                const fieldStr: UdcField = {
                    Name: 'str1',
                    Mandatory: true,
                    Type: 'String',
                };
                const fieldBool: UdcField = {
                    Name: 'bool1',
                    Mandatory: false,
                    Type: 'Bool',
                };
                const fieldDou: UdcField = {
                    Name: 'dou1',
                    Mandatory: false,
                    Type: 'Double',
                };
                const allFieldsToCreate = [fieldInt, fieldStr, fieldBool, fieldDou];
                const response = await udcService.createUDCWithFields(
                    basicOnlineCollectionName,
                    allFieldsToCreate,
                    'automation testing UDC',
                    undefined,
                    true,
                );
                expect(response.Fail).to.be.undefined;
                expect(response.bool1.Type).to.equal('Bool');
                expect(response.dou1.Type).to.equal('Double');
                expect(response.int1.Type).to.equal('Integer');
                expect(response.str1.Type).to.equal('String');
                const documents = await udcService.getSchemes({ page_size: -1 });
                expect(documents.length).to.equal(numOfInitialCollections + 1);
                const newCollection = documents.filter((doc) => doc.Name === basicOnlineCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                if (newCollection.SyncData) {
                    expect(newCollection.SyncData.Sync).to.equal(false);
                    expect(newCollection.SyncData.SyncFieldLevel).to.equal(false);
                } else {
                    expect(newCollection).to.haveOwnProperty('SyncData');
                }
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
            it('Positive Test: adding basic data to just created ONLINE ONLY UDC', async () => {
                const fieldValues = {
                    int1: intVal,
                    dou1: douVal,
                    str1: strVal,
                    bool1: boolVal,
                };
                const response = await udcService.sendDataToField(basicOnlineCollectionName, fieldValues);
                expect(response.Ok).to.equal(true);
                expect(response.Status).to.equal(200);
                expect(response.Body.bool1).to.equal(boolVal);
                expect(response.Body.dou1).to.equal(douVal);
                expect(response.Body.int1).to.equal(intVal);
                expect(response.Body.str1).to.equal(strVal);
                expect(response.Body.Hidden).to.equal(false);
                expect(response.Body).to.haveOwnProperty('Key');
                expect(response.Body.CreationDateTime).to.include(parsedTodayDate);
                expect(response.Body.ModificationDateTime).to.include(parsedTodayDate);
            });
            it('Positive Test: creating a UDC with account resource', async () => {
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                accResourceCollectionName = 'AccResource' + generalService.generateRandomString(15);
                const accField: UdcField = {
                    Name: 'myAcc',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: 'accounts',
                };
                const response = await udcService.createUDCWithFields(
                    accResourceCollectionName,
                    [accField],
                    'automation testing UDC',
                );
                expect(response.Fail).to.be.undefined;
                expect(response.myAcc.Type).to.equal('Resource');
                expect(response.myAcc.Resource).to.equal('accounts');
                const documents = await udcService.getSchemes({ page_size: -1 });
                expect(documents.length).to.equal(numOfInitialCollections + 1);
                const newCollection = documents.filter((doc) => doc.Name === accResourceCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                if (newCollection.SyncData) {
                    expect(newCollection.SyncData.Sync).to.equal(true);
                    expect(newCollection.SyncData.SyncFieldLevel).to.equal(false);
                } else {
                    expect(newCollection).to.haveOwnProperty('SyncData');
                }
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
            it('Positive Test: pushing accounts data to acc resource UDC', async () => {
                const fieldValues = {
                    'myAcc.ExternalID': 'Account for order scenarios',
                };
                let accUUID = '';
                if (generalService.papiClient['options'].baseURL.includes('staging')) {
                    accUUID = '56ea7184-c79d-496c-bb36-912f06f8c297';
                } else if (generalService.papiClient['options'].baseURL.includes('/papi.pepperi.com/V1.0')) {
                    accUUID = 'dbc958f7-e0cd-4014-a5cb-1b1764d4381e';
                } else {
                    accUUID = '257cd6cc-3e90-450b-bc16-1dc8f67a2ec8';
                }
                const response = await udcService.sendDataToField(accResourceCollectionName, fieldValues);
                expect(response.Ok).to.equal(true);
                expect(response.Status).to.equal(200);
                expect(response.Body.myAcc).to.equal(accUUID);
                expect(response.Body.Hidden).to.equal(false);
                expect(response.Body).to.haveOwnProperty('Key');
                expect(response.Body.CreationDateTime).to.include(parsedTodayDate);
                expect(response.Body.ModificationDateTime).to.include(parsedTodayDate);
            });
            it("Positive Test: exporting all created UDC's", async () => {
                const allCollectionNames = [
                    basicCollectionName,
                    containedCollectionName,
                    indexedCollectionName,
                    schemeOnlyCollectionName,
                    basicArrayCollectionName,
                    basicOnlineCollectionName,
                    baseedOnSchemeOnlyCollectionName,
                    accResourceCollectionName,
                    keyCollectionName,
                ];
                for (let index = 0; index < allCollectionNames.length; index++) {
                    const collectionName = allCollectionNames[index];
                    const bodyToSend = {
                        Format: 'csv',
                        IncludeDeleted: false,
                        Fields:
                            collectionName === basicOnlineCollectionName
                                ? 'str1,int1,dou1,Key'
                                : collectionName === accResourceCollectionName
                                ? 'myAcc,Key'
                                : collectionName === basicArrayCollectionName
                                ? 'Key,dou2,int2,str2'
                                : collectionName === baseedOnSchemeOnlyCollectionName
                                ? 'basedOn,Key'
                                : 'str,bool,int,dou,Key',
                        Delimiter: ',',
                    };
                    console.log(`Running The Test On:${collectionName},fields:${bodyToSend.Fields}`);
                    const a = await generalService.fetchStatus(
                        `/addons/data/export/file/122c0e9d-c240-4865-b446-f37ece866c22/${collectionName}`,
                        {
                            method: 'POST',
                            body: JSON.stringify(bodyToSend),
                        },
                    );
                    expect(a.Ok).to.equal(true);
                    expect(a.Status).to.equal(200);
                    const b = await generalService.getAuditLogResultObjectIfValid(a.Body.URI, 90);
                    if (collectionName.includes('SchemeOnlyTesting')) {
                        expect(b.AuditInfo.ErrorMessage).to.include('Unsupported schema type contained');
                    } else {
                        if (b.Status) {
                            expect(b.Status.ID).to.equal(1);
                            expect(b.Status.Name).to.equal('Success');
                        } else {
                            expect(b).to.haveOwnProperty('Status');
                        }
                        let uriToLookFor = ``;
                        let distUUIDToLookFor = ``;
                        if (generalService.papiClient['options'].baseURL.includes('staging')) {
                            uriToLookFor = `"URI":"https://pfs.staging.pepperi.com`;
                            distUUIDToLookFor = '9154dfe9-a1eb-466e-bf79-bc4fc53051c0';
                        } else if (generalService.papiClient['options'].baseURL.includes('/papi.pepperi.com/V1.0')) {
                            uriToLookFor = `"URI":"https://pfs.pepperi.com`;
                            distUUIDToLookFor = 'c87efcca-7170-4e46-8d58-04d2f6817b71';
                        } else {
                            uriToLookFor = `"URI":"https://eupfs.pepperi.com`;
                            distUUIDToLookFor = 'a9620f87-7990-428e-a7c6-7d0dda6c3f51';
                        }
                        expect(b.AuditInfo.ResultObject).to.contain(uriToLookFor);
                        expect(b.AuditInfo.ResultObject).to.contain(`"DistributorUUID":"${distUUIDToLookFor}"`);
                        const resultURL = b.AuditInfo.ResultObject.split(`,"V`)[0].split(`:"`)[1].replace('"', '');
                        const c = await generalService.fetchStatus(`${resultURL}`, {
                            method: 'GET',
                        });
                        const numOfVals = c.Body.Text.split('\n')[1].split(',').length;
                        expect(c.Ok).to.equal(true);
                        expect(c.Status).to.equal(200);
                        if (collectionName.includes('ContainedTesting')) {
                            expect(c.Body.Text).to.include('Key');
                            expect(numOfVals).to.equal(1);
                        } else {
                            if (collectionName.includes('KeyBasicTesting')) {
                                expect(c.Body.Text).to.include('Key');
                                expect(c.Body.Text).to.include('str');
                                expect(c.Body.Text).to.include('int');
                                expect(numOfVals).to.equal(3);
                            } else if (collectionName.includes('BasicArrayTesting')) {
                                expect(c.Body.Text).to.include('Key');
                                expect(c.Body.Text).to.include('dou2');
                                expect(c.Body.Text).to.include('str2');
                                expect(c.Body.Text).to.include('int2');
                                expect(numOfVals).to.equal(10);
                            } else {
                                if (collectionName.includes('BasicOnlineTesting')) {
                                    expect(c.Body.Text).to.include('Key');
                                    expect(c.Body.Text).to.include('dou1');
                                    expect(c.Body.Text).to.include('str1');
                                    expect(c.Body.Text).to.include('int1');
                                    expect(numOfVals).to.equal(4);
                                } else if (collectionName.includes('AccResource')) {
                                    expect(c.Body.Text).to.include('Key');
                                    expect(numOfVals).to.equal(2);
                                } else if (collectionName.includes('SchemeBasedOnOnlySchemeTesting')) {
                                    expect(c.Body.Text).to.include('Key');
                                    expect(c.Body.Text).to.include('basedOn.dou');
                                    expect(c.Body.Text).to.include('basedOn.str');
                                    expect(c.Body.Text).to.include('basedOn.int');
                                    expect(c.Body.Text).to.include('basedOn.bool');
                                    expect(numOfVals).to.equal(5);
                                } else {
                                    expect(c.Body.Text).to.include('Key');
                                    expect(c.Body.Text).to.include('dou');
                                    expect(c.Body.Text).to.include('str');
                                    expect(c.Body.Text).to.include('int');
                                    expect(c.Body.Text).to.include('bool');
                                    expect(numOfVals).to.equal(5);
                                }
                            }
                        }
                    }
                }
            });
            it('Positive Test: importing data to account resource UDC', async () => {
                let accUUID = '';
                if (generalService.papiClient['options'].baseURL.includes('staging')) {
                    accUUID = '56ea7184-c79d-496c-bb36-912f06f8c297';
                } else if (generalService.papiClient['options'].baseURL.includes('/papi.pepperi.com/V1.0')) {
                    accUUID = 'dbc958f7-e0cd-4014-a5cb-1b1764d4381e';
                } else {
                    accUUID = '257cd6cc-3e90-450b-bc16-1dc8f67a2ec8';
                }
                const bodyToImport = {};
                bodyToImport['Objects'] = [{ 'myAcc.ExternalID': 'Account for order scenarios' }];
                const response = await generalService.fetchStatus(
                    `/addons/data/import/122c0e9d-c240-4865-b446-f37ece866c22/${accResourceCollectionName}`,
                    { method: 'POST', body: JSON.stringify(bodyToImport) },
                );
                expect(response.Ok).to.equal(true);
                expect(response.Status).to.equal(200);
                expect(response.Body[0].Status).to.equal('Insert');
                expect(response.Body[0]).to.haveOwnProperty('Key');
                const document = (await udcService.getDocuments(accResourceCollectionName))[0];
                expect(document.myAcc).to.equal(accUUID);
            });
            it("Tear Down: cleaning all upserted UDC's", async () => {
                const documents = await udcService.getSchemes();
                const toHideCollections = documents.filter(
                    (doc) =>
                        doc.Name.includes('BasicTesting') ||
                        doc.Name.includes('ContainedTesting') ||
                        doc.Name.includes('IndexedTesting') ||
                        doc.Name.includes('BasicArrayTesting') ||
                        doc.Name.includes('BasicOnlineTesting') ||
                        doc.Name.includes('SchemeBasedOnOnlySchemeTesting') ||
                        doc.Name.includes('AccResource') ||
                        doc.Name.includes('KeyBasicTesting'),
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
