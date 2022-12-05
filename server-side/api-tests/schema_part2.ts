import GeneralService, { TesterFunctions } from '../services/general.service';
import { v4 as newUuid } from 'uuid';
//('newSchema' + newUuid())

export async function DBSchemaTestsPart2(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const assert = tester.assert;
    const expect = tester.expect;
    const it = tester.it;

    const genericResoureUUID = 'df90dba6-e7cc-477b-95cf-2c70114e44e0';
    const logcash: any = {};
    let counter = 0;
    // const fieldname = 'test!1';

    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const baseURL = generalService['client'].BaseURL;
    const token = generalService['client'].OAuthAccessToken;
    //#region create random string by lenght
    // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // function generateString(length) {
    //     let result = ' ';
    //     const charactersLength = characters.length;
    //     for (let i = 0; i < length; i++) {
    //         result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //     }
    //     return result;
    // }
    //#endregion
    //#region Upgrade ADAL
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', '1.3.44'], // 22-08-21 changed to last phased version 1.0.131. To run on last phased version will be empty
        'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, '0.0.1'],
        // 'Generic Resource':['df90dba6-e7cc-477b-95cf-2c70114e44e0',''],
        // 'User Defined Collections' :['122c0e9d-c240-4865-b446-f37ece866c22', '0.6.126'],
    };
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    //#endregion Upgrade ADAL
    //debugger;
    //const chnageVersionResponseArr1 = await generalService.chnageVersion(varKey, testData, false);
    //#region Mocha
    describe('ADAL Tests Suites', () => {
        describe('Prerequisites Addon for ADAL Tests', () => {
            //Test Data
            //ADAL
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

        describe('Create Schema_Part2', () => {
            it('Test Initiation', async () => {
                // this will run the first test that will run the second and so on..Its test initiation
                await getSecretKey();
                //await getSecretKeyGR();
            });
            it('Negative - Try to create schema with UserDefine true with camelCase name', () => {
                assert(logcash.createSchemaUDFalseNegativeStatus, logcash.createSchemaUDFalseNegativeErrorMessage);
            });
            it('Negative - Try to create schema with UserDefine true with PascalCase on Field name', () => {
                assert(
                    logcash.createSchemaUDFalseFieldsNegativeStatus,
                    logcash.createSchemaUDFalseFieldsNegativeErrorMessage,
                );
            });
            it('Negative - Try to create schema with UserDefine true with " " on schema name', () => {
                assert(
                    logcash.createSchemaNegativePatternSpaceOnNameStatus,
                    logcash.createSchemaNegativePatternSpaceOnNameErrorMessage,
                );
            });
            it('Negative - Try to create schema with UserDefine true with special character [!] on schema name', () => {
                assert(
                    logcash.createSchemaNegativePatternSpecialCharOnNameStatus,
                    logcash.createSchemaNegativePatternSpecialCharOnNameErrorMessage,
                );
            });
            it('Create schema with UserDefine true', () => {
                assert(logcash.createSchemaPositiveStatus, logcash.createSchemaPositiveErrorMessage);
            });
            it('Negative - try to update UserDefine property on existing schema', () => {
                assert(logcash.updateSchemaNegativeStatus, logcash.updateSchemaNegativeErrorMessage);
            });
            it('Update schema type - negative schema fields', () => {
                assert(logcash.updateSchemaTypeNegativeStatus, logcash.updateSchemaTypeNegativeErrorMessage);
            });
            it('Create extending schema', () => {
                assert(logcash.createExtendingSchemePositiveStatus, logcash.createExtendingSchemePositiveErrorMessage);
            });
            it('Create abstract schema', () => {
                assert(logcash.createSchemaAbstractStatus, logcash.createSchemaAbstractErrorMessage);
            });
            it('Create abstract schema with UserDefine=false : camelCase/PascalCase - negative', () => {
                assert(
                    logcash.createSchemaAbstractNegativeCamelStatus,
                    logcash.createSchemaAbstractNegativeCamelErrorMessage,
                );
            });
            it('Update extended schema fields', () => {
                assert(logcash.updateExtendedSchemaStatus, logcash.updateExtendedSchemaErrorMessage);
            });
            it('GET extending schema - verify all extended fields updated and SuperTypes objects created', () => {
                assert(logcash.getDataADALStatus, logcash.getDataADALError);
            });
            it('Update extending schema fields', () => {
                assert(logcash.updateExtendingSchemeStatus, logcash.updateExtendingSchemeErrorMessage);
            });
            it('Negative - Update extending schema fields to same name of extended', () => {
                assert(logcash.updateExtendingSchemeNegativeStatus, logcash.updateExtendingSchemeNegativeErrorMessage);
            });
            it('Drop extended table ', () => {
                assert(logcash.dropExtendedTableStatus, logcash.dropExtendedTableError);
            });
            it('Drop extending table ', () => {
                assert(logcash.dropExtendingTableStatus, logcash.dropExtendingTableError);
            });
            it('Drop abstract table ', () => {
                assert(logcash.dropAbstractTableStatus, logcash.dropAbstractTableError);
            });
            it('Negative - create genericResouce = true schema with Name PascalCase', () => {
                assert(
                    logcash.createGenericResourceSchemaFirstNegativeStatus,
                    logcash.createGenericResourceSchemaFirstNegativeErrorMessage,
                );
            });
            it('Negative - create genericResouce = true schema with Name camelCase and Field on camelCase instead of PAscalCase', () => {
                assert(
                    logcash.createGenericResourceSchemaSecNegativeStatus,
                    logcash.createGenericResourceSchemaSecNegativeErrorMessage,
                );
            });
            it('Positieve - create genericResouce = true schema with Name camelCase and Field on PascalCese', () => {
                assert(
                    logcash.createGenericResourceSchemaPositiveStatus,
                    logcash.createGenericResourceSchemaPositiveErrorMessage,
                );
            });
            it('Drop created schema with GenericResource = true', () => {
                assert(logcash.dropTableGRStatus, logcash.dropTableGRError);
            });
        });
        describe('Contaned table type verification', () => {
            it('Create schema with type contained', async () => {
                assert(logcash.createContainedSchemaPositiveStatus, logcash.createContainedSchemaPositiveErrorMessage);
            });
            it('Update contained  schema - add fields ', () => {
                assert(logcash.updateContainedSchemaStatus, logcash.updateContainedSchemaErrorMessage);
            });
            it('Negative - try to insert data to contained table', () => {
                assert(
                    logcash.insertDataToContainedTableNegativeStatus,
                    logcash.insertDataToContainedTableNegativeError,
                );
            });
            it('Negative - Get data from contained table', () => {
                assert(logcash.getDataFromContainedTableNegativeStatus, logcash.getDataFromContainedTableNegativeError);
            });
            it('Drop created contained table', () => {
                assert(logcash.dropExtendingContainedTableStatus, logcash.dropExtendingContainedTableError);
            });
        });
        describe('Hide/unhide functionality test', () => {
            it('Create schema with type data', async () => {
                assert(logcash.createSchemeStatus, logcash.createSchemeErrorMessage);
            });
            it('Insert data to created schema : 3 objects, one object is hidden=true(whait 40 sec) ', () => {
                assert(logcash.insertDataToTableStatus, logcash.insertDataToTableError);
            });
            it('Update schema to hidden true', () => {
                assert(logcash.updateSchemeStatus, logcash.updateSchemeErrorMessage);
            });
            it('Update schema back to hidden false', () => {
                assert(logcash.updateSchemeHiddenFalseStatus, logcash.updateSchemeHiddenFalseErrorMessage);
            });
            it('Verify two objects status updated to false, and one stay true', () => {
                assert(logcash.getDataTableOrderByKeyStatus, logcash.getDataTableOrderByKeyError);
            });
            it('Drop created  table', () => {
                assert(logcash.dropTableStatus, logcash.dropTableError);
            });
        });
    });

    //#endregion Mocha

    //get secret key
    async function getSecretKey() {
        try {
            logcash.secretKey = await generalService.getSecretKey(addonUUID, varKey);
        } catch (error) {
            throw new Error(`Fail To Get Addon Secret Key ${error}`);
        }
        await createSchemaUDFalseNegative();
    }

    //#region Pascal and camel cases + UserDefined verification

    async function createSchemaUDFalseNegative() {
        //user define is default = false
        logcash.createSchemaUDFalseNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'negative-camelCase1',
                    Type: 'data',
                    UserDefined: true,
                    // Fields: {
                    //     testString: { Type: 'String' },
                    //     testBoolean: { Type: 'Bool' },
                    //     TestInteger: { Type: 'Integer' },
                    // },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaUDFalseNegative.fault.faultstring.includes(
                "Invalid schema name, the name 'negative-camelCase1' did not match the pattern",
            )
        ) {
            logcash.createSchemaUDFalseNegativeStatus = true;
        } else {
            logcash.createSchemaUDFalseNegativeStatus = false;
            logcash.createSchemaUDFalseNegativeErrorMessage =
                'Schema creation will failed because the schema name is camelCase instead of PascalCase';
        }
        await createSchemaUDFalseFieldsNegative();
    }

    async function createSchemaUDFalseFieldsNegative() {
        //user define is default = false
        logcash.createSchemaUDFalseFieldsNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'PascalCase',
                    Type: 'data',
                    UserDefined: true,
                    Fields: {
                        TestStringPascalCase: { Type: 'String' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaUDFalseFieldsNegative.fault.faultstring.includes(
                "Invalid field name, the fields name 'TestStringPascalCase' did not match the pattern",
            )
        ) {
            logcash.createSchemaUDFalseFieldsNegativeStatus = true;
        } else {
            logcash.createSchemaUDFalseFieldsNegativeStatus = false;
            logcash.createSchemaUDFalseFieldsNegativeErrorMessage =
                'Schema creation will failed because the field name is PascalCase instead of camelCase';
        }
        await createSchemaNegativePatternSpaceOnName();
    }
    async function createSchemaNegativePatternSpaceOnName() {
        //user define is default = false
        logcash.createSchemaNegativePatternSpaceOnName = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'PascalCase test',
                    Type: 'data',
                    UserDefined: true,
                    Fields: {
                        TestStringPascalCase: { Type: 'String' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaNegativePatternSpaceOnName.fault.faultstring.includes(
                "Failed due to exception: Invalid schema name, the name 'PascalCase test' did not match the pattern ^[A-Z][-a-zA-Z_0-9]*$",
            )
        ) {
            logcash.createSchemaNegativePatternSpaceOnNameStatus = true;
        } else {
            logcash.createSchemaNegativePatternSpaceOnNameStatus = false;
            logcash.createSchemaNegativePatternSpaceOnNameErrorMessage =
                'Schema creation will failed because the field name has spaces';
        }
        await createSchemaNegativePatternSpecialCharOnName();
    }
    async function createSchemaNegativePatternSpecialCharOnName() {
        //user define is default = false
        logcash.createSchemaNegativePatternSpecialCharOnName = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'PascalCase!test',
                    Type: 'data',
                    UserDefined: true,
                    Fields: {
                        TestStringPascalCase: { Type: 'String' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaNegativePatternSpecialCharOnName.fault.faultstring.includes(
                "Invalid schema name, the name 'PascalCase!test' did not match the pattern ^[A-Z][-a-zA-Z_0-9]*$",
            )
        ) {
            logcash.createSchemaNegativePatternSpecialCharOnNameStatus = true;
        } else {
            logcash.createSchemaNegativePatternSpecialCharOnNameStatus = false;
            logcash.createSchemaNegativePatternSpecialCharOnNameErrorMessage =
                'Schema creation will failed because the field name has special charcter';
        }
        await createSchemaPositive();
    }

    //let addonUDC = '122c0e9d-c240-4865-b446-f37ece866c22'

    async function createSchemaPositive() {
        //extendet schema
        //user define is default = false
        logcash.createSchemaPositive = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    //Name: 'Test-positive' + newUuid(),
                    Name: 'Test-positive' + generalService.generateRandomString(16),
                    Type: 'abstract', // will be abstract type
                    UserDefined: true,
                    Fields: {
                        testString1: { Type: 'String' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.createSchemaPositive.Name.includes('Test-positive')) {
            logcash.createSchemaPositiveStatus = true;
        } else {
            logcash.createSchemaPositiveStatus = false;
            logcash.createSchemaPositiveErrorMessage = 'Schema will be created successfully, but actually failed';
        }
        await updateSchemaNegative();
    }
    async function updateSchemaNegative() {
        //user define is default = false
        logcash.updateSchemaNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaPositive.Name,
                    //Type: 'data',
                    UserDefined: false,
                    // Fields: {
                    //     testString1: { Type: 'String' },
                    // },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.updateSchemaNegative.fault.faultstring.includes(
                "Failed due to exception: It's not possible to change UserDefined value after schema creation",
            )
        ) {
            logcash.updateSchemaNegativeStatus = true;
        } else {
            logcash.updateSchemaNegativeStatus = false;
            logcash.updateSchemaNegativeErrorMessage = 'UserDefined proproperty can only be set on creation';
        }
        await updateSchemaTypeNegative();
    }

    //added on 28/11/22 - on ADAL 13 - chnahe schema type after creation
    async function updateSchemaTypeNegative() {
        //user define is default = false
        logcash.updateSchemaTypeNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaPositive.Name,
                    Type: 'data',
                    UserDefined: true,
                    // Fields: {
                    //     testString1: { Type: 'String' },
                    // },
                }),
            })
            .then((res) => [res.Status, res.Body]);
        //debugger;
        if (
            logcash.updateSchemaTypeNegative[1].fault.faultstring.includes(
                'Failed due to exception: Cannot change a schema type',
            ) &&
            logcash.updateSchemaTypeNegative[0] == 400
        ) {
            logcash.updateSchemaTypeNegativeStatus = true;
        } else {
            logcash.updateSchemaTypeNegativeStatus = false;
            logcash.updateSchemaTypeNegativeErrorMessage = 'Schema type can only be set on creation';
        }
        await createSchemaAbstract();
    }

    async function createSchemaAbstract() {
        //extendet schema
        //user define is default = false
        logcash.createSchemaAbstract = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    //Name: 'Test-positive2' + newUuid(),    
                    Name: 'Test-positive2' + generalService.generateRandomString(16),
                    Type: 'abstract', // will be abstract type
                    UserDefined: true,
                    Fields: {
                        test2String: { Type: 'String' },
                    },
                    Extends: {
                        AddonUUID: addonUUID,
                        Name: logcash.createSchemaPositive.Name,
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.createSchemaAbstract.Name.includes('Test-positive2')) {
            logcash.createSchemaAbstractStatus = true;
        } else {
            logcash.createSchemaAbstractStatus = false;
            logcash.createSchemaAbstractErrorMessage = 'Schema will be created successfully, but actually failed';
        }
        await createExtendingSchemePositive();
    }

    //#endregion
    //#region Extending abstract Schemes

    async function createExtendingSchemePositive() {
        //user define is default = false
        logcash.createExtendingSchemePositive = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                   // Name: 'ExtendingSchema' + newUuid(),  
                   Name: 'ExtendingSchema' + generalService.generateRandomString(16),
                    Type: 'data',
                    UserDefined: true,
                    Fields: {
                        string_Field1: { Type: 'String' },
                        int_Field2: { Type: 'Integer' },
                    },
                    Extends: {
                        AddonUUID: addonUUID,
                        Name: logcash.createSchemaAbstract.Name,
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createExtendingSchemePositive.Name.includes('ExtendingSchema') &&
            logcash.createExtendingSchemePositive.Fields.testString1.ExtendedField == true &&
            logcash.createExtendingSchemePositive.Fields.string_Field1.ExtendedField == false &&
            logcash.createExtendingSchemePositive.Fields.int_Field2.ExtendedField == false
        ) {
            logcash.createExtendingSchemePositiveStatus = true;
        } else {
            logcash.createExtendingSchemePositiveStatus = false;
            logcash.createExtendingSchemePositiveErrorMessage =
                'Schema will be created successfully  with extended fields, but actually failed';
        }
        await createSchemaAbstractNegativeCamel();
    }

    //create abstract scheme negative - on abstract if userDefine false the schema name will be camelcase
    async function createSchemaAbstractNegativeCamel() {
        //extendet schema
        //user define is default = false
        logcash.createSchemaAbstractNegativeCamel = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    //Name: 'Test-negative' + newUuid(),  
                    Name: 'Test-negative' + generalService.generateRandomString(16),
                    Type: 'abstract', // will be abstract type
                    //UserDefined: true,
                    Fields: {
                        test2String: { Type: 'String' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createSchemaAbstractNegativeCamel.fault.faultstring.includes(
                'did not match the pattern ^[a-z][a-zA-Z_0-9]',
            )
        ) {
            logcash.createSchemaAbstractNegativeCamelStatus = true;
        } else {
            logcash.createSchemaAbstractNegativeCamelStatus = false;
            logcash.createSchemaAbstractNegativeCamelErrorMessage = 'Schema will not be created';
        }
        await updateExtendedSchema();
    }

    async function updateExtendedSchema() {
        //user define is default = false
        logcash.updateExtendedSchema = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createSchemaPositive.Name,
                    //Type: 'data',
                    //UserDefined: true,
                    Fields: {
                        testString1_updated: { Type: 'String' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.updateExtendedSchema.Fields.testString1_updated.Type == 'String') {
            logcash.updateExtendedSchemaStatus = true;
        } else {
            logcash.updateExtendedSchemaStatus = false;
            logcash.updateExtendedSchemaErrorMessage = 'Schema will be updated successfully, but actually failed';
        }
        generalService.sleep(15000);
        await getDataADAL2();
    }
    async function getDataADAL2() {
        //logcash.getDataADALStatus = true;
        logcash.getDataADAL2 = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaAbstract.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDataADAL2.Name.includes('Test-positive')
            // logcash.getDataADAL.Fields.testString1_updated.ExtendedField == true &&
            // logcash.getDataADAL.Fields.test2String.ExtendedField == true &&
            // logcash.getDataADAL.Fields.string_Field1.ExtendedField == false &&
            // logcash.getDataADAL.Fields.int_Field2.ExtendedField == false &&
            // logcash.getDataADAL.SuperTypes[0].includes('Test-positive') &&
            // logcash.getDataADAL.SuperTypes[1].includes('Test-positive2')
        ) {
            logcash.getDataADAL2Status = true;
        } else {
            logcash.getDataADAL2Status = false;
            logcash.getDataADAL2Error = 'Schema fields is wrong';
        }

        //debugger;
        await getDataADAL();
    }

    // add GET to verify if extending schema updated after extended schema changed - add sleep before
    async function getDataADAL() {
        //logcash.getDataADALStatus = true;
        logcash.getDataADAL = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createExtendingSchemePositive.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    //'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDataADAL.Fields.testString1_updated.ExtendedField == true &&
            logcash.getDataADAL.Fields.test2String.ExtendedField == true &&
            logcash.getDataADAL.Fields.string_Field1.ExtendedField == false &&
            logcash.getDataADAL.Fields.int_Field2.ExtendedField == false &&
            logcash.getDataADAL.SuperTypes[0].includes('Test-positive') &&
            logcash.getDataADAL.SuperTypes[1].includes('Test-positive2')
        ) {
            logcash.getDataADALStatus = true;
        } else {
            logcash.getDataADALStatus = false;
            logcash.getDataADALError = 'Schema fields is wrong';
        }

        //debugger;
        await updateExtendingScheme();
    }

    async function updateExtendingScheme() {
        //user define is default = false
        logcash.updateExtendingScheme = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createExtendingSchemePositive.Name,
                    Type: 'data',
                    UserDefined: true,
                    Fields: {
                        string_Field1: { Type: 'String' },
                        int_Field2_updated: { Type: 'Integer' },
                    },
                    // Extends: {
                    //     AddonUUID: addonUUID,
                    //     Name: logcash.createSchemaPositive.Name,
                    // },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.updateExtendingScheme.Name.includes('ExtendingSchema') &&
            logcash.updateExtendingScheme.Fields.testString1_updated.ExtendedField == true &&
            logcash.updateExtendingScheme.Fields.string_Field1.ExtendedField == false &&
            logcash.updateExtendingScheme.Fields.int_Field2_updated.ExtendedField == false
        ) {
            logcash.updateExtendingSchemeStatus = true;
        } else {
            logcash.updateExtendingSchemeStatus = false;
            logcash.updateExtendingSchemeErrorMessage =
                'Schema will be updated successfully(not exdend field), and extended field will be updated because the root schema is updated';
        }
        await updateExtendingSchemeNegative();
    }
    async function updateExtendingSchemeNegative() {
        //user define is default = false
        logcash.updateExtendingSchemeNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createExtendingSchemePositive.Name,
                    Type: 'data',
                    UserDefined: true,
                    Fields: {
                        string_Field1: { Type: 'String' },
                        int_Field2_updated: { Type: 'Integer' },
                        testString1_updated: { Type: 'Integer' },
                    },
                    // Extends: {
                    //     AddonUUID: addonUUID,
                    //     Name: logcash.createSchemaPositive.Name,
                    // },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.updateExtendingSchemeNegative.fault.faultstring.includes(
                'Failed due to exception: Cannot extend schema, properties [testString1_updated] of Fields exist in both schemas',
            )
        ) {
            logcash.updateExtendingSchemeNegativeStatus = true;
        } else {
            logcash.updateExtendingSchemeNegativeStatus = false;
            logcash.updateExtendingSchemeNegativeErrorMessage =
                'Tests will failed, bacouse the updated field appeared on extended schema';
        }
        await dropExtendedTable();
    }

    async function dropExtendedTable() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaPositive.Name + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            },
        ); //.then((data) => data.json())
        //debugger;

        //if(logcash.dropExistingTable.success == true){
        if (res.Ok) {
            logcash.dropExtendedTableStatus = true;
        } else {
            logcash.dropExtendedTableStatus = false;
            logcash.dropExtendedTableError = 'Drop extended schema failed.';
        }
        await dropExtendingTable();
    }

    async function dropExtendingTable() {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createExtendingSchemePositive.Name + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            },
        ); //.then((data) => data.json())
        //debugger;
        if (res.Ok) {
            logcash.dropExtendingTableStatus = true;
        } else {
            logcash.dropExtendingTableStatus = false;
            logcash.dropExtendingTableError = 'Drop extending schema failed';
        }
        //debugger;
        await dropAbstractTable();
    }

    async function dropAbstractTable() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createSchemaAbstract.Name + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            },
        ); //.then((data) => data.json())
        //debugger;

        //if(logcash.dropExistingTable.success == true){
        if (res.Ok) {
            logcash.dropAbstractTableStatus = true;
        } else {
            logcash.dropAbstractTableStatus = false;
            logcash.dropAbstractTableError = 'Drop abstract schema failed.';
        }
        await createGenericResourceSchemaFirstNegative();
    }
    //#endregion Extending Schemes
    //#region Generic resource - userDefine true/false - camel?pascal verification
    // async function getSecretKeyGR() {
    //     try {
    //         logcash.secretKeyGR = await generalService.getSecretKey(genericResoureUUID, varKey);
    //     } catch (error) {
    //         throw new Error(`Fail To Get Addon Secret Key ${error}`);
    //     }
    //     await createGenericResourceSchemaFirstNegative();
    // }

    async function createGenericResourceSchemaFirstNegative() {
        // userDefine = false Schem name must be camelCase
        //user define is default = false
        logcash.createGenericResourceSchemaFirstNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'CamelCaseNegative',
                    Type: 'data',
                    GenericResource: true,
                    UserDefined: false,
                    // Fields: {
                    //     testString: { Type: 'String' },
                    //     testInt: { Type: 'Integer' },
                    // },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createGenericResourceSchemaFirstNegative.fault.faultstring.includes(
                'Failed due to exception: Invalid schema name, the name',
            ) //&&
            // logcash.createContainedSchemaPositive.Fields.testString.Type == 'String' &&
            // logcash.createContainedSchemaPositive.Fields.testInt.Type == 'Integer'
        ) {
            logcash.createGenericResourceSchemaFirstNegativeStatus = true;
        } else {
            logcash.createGenericResourceSchemaFirstNegativeStatus = false;
            logcash.createGenericResourceSchemaFirstNegativeErrorMessage =
                'Schema creation will failed because on General resource schemes on UserDefine=false tne Schema name must be camelCase';
        }
        await createGenericResourceSchemaSecNegative();
    }

    async function createGenericResourceSchemaSecNegative() {
        // userDefine = false Field name must be PascalCase
        //user define is default = false
        logcash.createGenericResourceSchemaSecNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'camelCaseNegative', //+ newUuid(),
                    Type: 'data',
                    GenericResource: true,
                    UserDefined: false,
                    Fields: {
                        testString: { Type: 'String' },
                        TestInt: { Type: 'Integer' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createGenericResourceSchemaSecNegative.fault.faultstring.includes(
                'Invalid field name, the fields name ',
            ) //&&
            // logcash.createContainedSchemaPositive.Fields.testString.Type == 'String' &&
            // logcash.createContainedSchemaPositive.Fields.testInt.Type == 'Integer'
        ) {
            logcash.createGenericResourceSchemaSecNegativeStatus = true;
        } else {
            logcash.createGenericResourceSchemaSecNegativeStatus = false;
            logcash.createGenericResourceSchemaSecNegativeErrorMessage =
                'Schema creation will failed because on General resource schemes on UserDefine=false tne field name must be PascalCase';
        }
        await createGenericResourceSchemaPositive();
    }

    async function createGenericResourceSchemaPositive() {
        // userDefine = false Field name must be PascalCase
        //user define is default = false
        logcash.createGenericResourceSchemaPositive = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: 'camelCase', //+ newUuid(),
                    Type: 'data',
                    GenericResource: true,
                    UserDefined: false,
                    Fields: {
                        TestString: { Type: 'String' },
                        TestInt: { Type: 'Integer' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createGenericResourceSchemaPositive.Name == 'camelCase' &&
            logcash.createGenericResourceSchemaPositive.Fields.TestString.Type == 'String' &&
            logcash.createGenericResourceSchemaPositive.Fields.TestInt.Type == 'Integer'
        ) {
            logcash.createGenericResourceSchemaPositiveStatus = true;
        } else {
            logcash.createGenericResourceSchemaPositiveStatus = false;
            logcash.createGenericResourceSchemaPositiveErrorMessage = 'Schema creation failed';
        }
        await dropTableGR();
    }
    async function dropTableGR() {
        //logcash.dropExistingTable = await generalService.fetchStatus(baseURL + '/addons/data/schemes/' + logcash.createSchemaWithMandFieldName.Name + '/purge', {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createGenericResourceSchemaPositive.Name + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            },
        ); //.then((data) => data.json())
        //debugger;

        //if(logcash.dropExistingTable.success == true){
        if (res.Ok) {
            logcash.dropTableGRStatus = true;
        } else {
            logcash.dropTableGRStatus = false;
            logcash.dropTableGRError = 'Drop schema failed.';
        }
        await createContainedSchemaPositive();
    }

    //#endregion region Generic resource - userDefine true/false - camel?pascal verification
    //#region contained schema

    async function createContainedSchemaPositive() {
        //user define is default = false
        logcash.createContainedSchemaPositive = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    //Name: 'Conteined-positive' + newUuid(), 
                    Name: 'Conteined-positive' + generalService.generateRandomString(16),
                    Type: 'contained',
                    UserDefined: true,
                    Fields: {
                        testString: { Type: 'String' },
                        testInt: { Type: 'Integer' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createContainedSchemaPositive.Name.includes('Conteined-positive') &&
            logcash.createContainedSchemaPositive.Fields.testString.Type == 'String' &&
            logcash.createContainedSchemaPositive.Fields.testInt.Type == 'Integer'
        ) {
            logcash.createContainedSchemaPositiveStatus = true;
        } else {
            logcash.createContainedSchemaPositiveStatus = false;
            logcash.createContainedSchemaPositiveErrorMessage =
                'Schema by type contaned will be created successfully, but actually failed';
        }
        await updateContainedSchema();
    }
    async function updateContainedSchema() {
        //user define is default = false
        logcash.updateContainedSchema = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    //Name: 'Conteined-positive' + newUuid(), 
                    Name: 'Conteined-positive' + generalService.generateRandomString(16),
                    Type: 'contained',
                    UserDefined: true,
                    Fields: {
                        testString: { Type: 'String' },
                        testInt: { Type: 'Integer' },
                        testInt1: { Type: 'Integer' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.updateContainedSchema.Name.includes('Conteined-positive') &&
            logcash.updateContainedSchema.Fields.testString.Type == 'String' &&
            logcash.updateContainedSchema.Fields.testInt.Type == 'Integer' &&
            logcash.updateContainedSchema.Fields.testInt1.Type == 'Integer'
        ) {
            logcash.updateContainedSchemaStatus = true;
        } else {
            logcash.updateContainedSchemaStatus = false;
            logcash.updateContainedSchemaErrorMessage =
                'Schema by type contaned will be updated successfully, but actually failed';
        }
        await insertDataToContainedTableNegative();
    }

    async function insertDataToContainedTableNegative() {
        logcash.insertDataToContainedTableNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.updateContainedSchema.Name, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Key: 'testKeyNegative',
                    testString: 'test',
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.insertDataToContainedTableNegative.fault.faultstring.includes("Unsupported schema type 'contained")
        ) {
            logcash.insertDataToContainedTableNegativeStatus = true;
        } else {
            logcash.insertDataToContainedTableNegativeStatus = false;
            logcash.insertDataToContainedTableNegativeError = 'Insert data to contained table will fail';
        }
        await getDataFromContainedTableNegative();
    }

    async function getDataFromContainedTableNegative() {
        //logcash.getDataFromContainedTableNegativeStatus = true;
        logcash.getDataFromContainedTableNegative = await generalService
            .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.updateContainedSchema.Name, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.getDataFromContainedTableNegative.fault.faultstring.includes("Unsupported schema type 'contained")
        ) {
            logcash.getDataFromContainedTableNegativeStatus = true;
        } else {
            logcash.getDataFromContainedTableNegativeStatus = false;
            logcash.getDataFromContainedTableNegativeError = 'Get data from contained table will fail';
        }
        await dropExtendingContainedTable();
    }
    async function dropExtendingContainedTable() {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.updateContainedSchema.Name + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            },
        ); //.then((data) => data.json())
        //debugger;
        if (res.Ok) {
            logcash.dropExtendingContainedTableStatus = true;
        } else {
            logcash.dropExtendingContainedTableStatus = false;
            logcash.dropExtendingContainedTableError = 'Drop extending contained schema failed';
        }
        //debugger;
        await createScheme();
    }
    //#endregion contained schema

    //#region Hide/unhide schema and documents

    async function createScheme() {
        //user define is default = false
        logcash.createScheme = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    //Name: 'Hide_unhide_test' + newUuid(), 
                    Name: 'Hide_unhide_test' + generalService.generateRandomString(16),
                    Type: 'data',
                    //UserDefined: true,
                    Fields: {
                        string_Field1: { Type: 'String' },
                        int_Field2: { Type: 'Integer' },
                    },
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.createScheme.Fields.string_Field1.Type == 'String' &&
            logcash.createScheme.Fields.int_Field2.Type == 'Integer'
        ) {
            logcash.createSchemeStatus = true;
        } else {
            logcash.createSchemeStatus = false;
            logcash.createSchemeErrorMessage = 'Schema will be created successfully , but actually failed';
        }
        await insertDataToTable();
    }
    async function insertDataToTable() {
        for (counter; counter < 3; counter++) {
            let boolData = false;
            if (counter % 2 != 0) {
                boolData = true;
            } else {
                boolData = false;
            }
            logcash.insertDataToTable = await generalService
                .fetchStatus(baseURL + '/addons/data/' + addonUUID + '/' + logcash.createScheme.Name, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        //'X-Pepperi-OwnerID': whaitOwnerUUID,  // ownerID will be removed when BUG https://pepperi.atlassian.net/browse/DI-20949
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                    body: JSON.stringify({
                        Key: 'object-' + counter,
                        string_Field1: 'firstStrring-' + counter,
                        int_Field2: counter * 2,
                        int_const: 5,
                        Hidden: boolData,
                    }),
                })
                .then((res) => [res.Status, res.Body]);
            //debugger;
            //Failed due to exception: Table schema must exist, for table
            if (logcash.insertDataToTable[0] == 200) {
                logcash.insertDataToTableStatus = true;
            } else {
                logcash.insertDataToTableStatus = false;
                logcash.insertDataToTableError = 'Insert data failed on try number';
            }
        }
        //debugger;
        generalService.sleep(40000);
        await updateScheme();
    }
    async function updateScheme() {
        //user define is default = false
        logcash.updateScheme = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createScheme.Name,
                    Hidden: true,
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (logcash.updateScheme.Name == logcash.createScheme.Name && logcash.updateScheme.Hidden == true) {
            logcash.updateSchemeStatus = true;
        } else {
            logcash.updateSchemeStatus = false;
            logcash.updateSchemeErrorMessage = 'Schema will be updated to Hidden = true , but actually failed';
        }
        generalService.sleep(5000);
        await updateSchemeHiddenFalse();
    }

    async function updateSchemeHiddenFalse() {
        //user define is default = false
        logcash.updateSchemeHiddenFalse = await generalService
            .fetchStatus(baseURL + '/addons/data/schemes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
                body: JSON.stringify({
                    Name: logcash.createScheme.Name,
                    Hidden: false,
                }),
            })
            .then((res) => res.Body);
        //debugger;
        if (
            logcash.updateSchemeHiddenFalse.Name == logcash.createScheme.Name &&
            logcash.updateSchemeHiddenFalse.Hidden == false
        ) {
            logcash.updateSchemeHiddenFalseStatus = true;
            //logcash.updateSchemeHiddenFalse.ModificationDateTime
        } else {
            logcash.updateSchemeHiddenFalseStatus = false;
            logcash.updateSchemeHiddenFalseErrorMessage =
                'Schema will be updated to Hidden = false , but actually failed';
        }
        generalService.sleep(20000);
        await getDataTableOrderByKey();
    }
    async function getDataTableOrderByKey() {
        logcash.getDataTableOrderByKey = await generalService
            .fetchStatus(
                baseURL + '/addons/data/' + addonUUID + '/' + logcash.createScheme.Name + '?order_by=Key&page_size=-1', //desc
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': logcash.secretKey,
                    },
                },
            )
            .then((res) => res.Body);
        //debugger;
        const schemaModDate = new Date(logcash.updateScheme.ModificationDateTime);
        const millisecondsschemModification = schemaModDate.getTime();
        const objectModeDate1 = new Date(logcash.getDataTableOrderByKey[0].ModificationDateTime);
        const objectModification1 = objectModeDate1.getTime();
        const objectModeDate2 = new Date(logcash.getDataTableOrderByKey[1].ModificationDateTime);
        const objectModification2 = objectModeDate2.getTime();
        //debugger;
        if (
            logcash.getDataTableOrderByKey.length == 2 &&
            millisecondsschemModification < objectModification1 &&
            millisecondsschemModification < objectModification2
            // logcash.getDataFromIndexedData[189].Field2 == 'String1-269'
        ) {
            logcash.getDataTableOrderByKeyStatus = true;
        } else {
            logcash.getDataTableOrderByKeyStatus = false;
            logcash.getDataTableOrderByKeyError =
                'The get wit order_by result is wrong.Will get 3 objects but result is :' +
                logcash.getDataTableOrderByKey.length;
        }
        await dropTable();
    }

    // async function updateSchemeHiddenTrue2() {    //user define is default = false  // bug https://pepperi.atlassian.net/browse/DI-20252 reopened
    //     logcash.updateSchemeHiddenTrue2 = await generalService
    //         .fetchStatus(baseURL + '/addons/data/schemes', {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: 'Bearer ' + token,
    //                 'X-Pepperi-OwnerID': addonUUID,
    //                 'X-Pepperi-SecretKey': logcash.secretKey,
    //             },
    //             body: JSON.stringify({
    //                 Name: logcash.createScheme.Name,
    //                 Hidden: true,

    //             }),
    //         })
    //         .then((res) => res.Body);
    //     //debugger;
    //     if (
    //         logcash.updateSchemeHiddenTrue2.Name == logcash.createScheme.Name &&
    //         logcash.updateSchemeHiddenTrue2.Hidden == true
    //     ) {
    //         logcash.updateSchemeHiddenTrue2Status = true;
    //         //logcash.updateSchemeHiddenFalse.ModificationDateTime
    //     } else {
    //         logcash.updateSchemeHiddenTrue2Status = false;
    //         logcash.updateSchemeHiddenTrue2ErrorMessage =
    //             'Schema will be updated to Hidden = true , but actually failed'
    //     }
    //     generalService.sleep(5000);
    //     await dropTable();
    // }
    async function dropTable() {
        const res = await generalService.fetchStatus(
            baseURL + '/addons/data/schemes/' + logcash.createScheme.Name + '/purge',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': logcash.secretKey,
                },
            },
        ); //.then((data) => data.json())
        //debugger;
        if (res.Ok) {
            logcash.dropTableStatus = true;
        } else {
            logcash.dropTableStatus = false;
            logcash.dropTableError = 'Drop extending  schema failed';
        }
        //debugger;
        //await createScheme();
    }
    //#endregion Hide/unhide schema and documents
}
