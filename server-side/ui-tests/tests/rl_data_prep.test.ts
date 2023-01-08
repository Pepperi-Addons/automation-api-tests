import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { UDCService } from '../../services/user-defined-collections.service';

chai.use(promised);

export async function RLdataPrep(varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);

    /* Addons Installation */
    // await generalService.baseAddonVersionsInstallation(varPass);
    // //#region Upgrade script dependencies
    // const testData = {
    //     'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', '0.7.69'],
    //     'Generic Resources': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', '0.5.6'],
    //     'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', '0.5.1'],
    //     'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', '0.7.24'],
    //     'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '17.15.105'],
    //     'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.10'],
    //     'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '1.1.31'],
    //     'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', '0.5.5'],
    //     sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '0.2.36'],
    //     Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', '0.9.18'],
    //     'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', '0.5.3'],
    // };

    // const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    // const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // describe('Prerequisites Addons for Resource List Tests', () => {
    //     //Resource List - for the 1st step: making sure 'Resource List' and 'Generic Resources' are installed, and 'Core Resources' and 'User Defined Collections' are not.
    //     const addonsList = Object.keys(testData);

    //     isInstalledArr.forEach((isInstalled, index) => {
    //         it(`Validate That Needed Addon Is Installed: ${addonsList[index]}`, () => {
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

    describe('API Creation of UDCs', () => {
        /*************************  RL Data Prep  *************************/
        it('Deleting All UDC Collections', async () => {
            // debugger
            const documents = await udcService.getSchemes();
            for (let index = 0; index < documents.length; index++) {
                const collectionToHide = documents[index];
                const collectionsObjcts = await udcService.getAllObjectFromCollection(collectionToHide.Name);
                if (collectionsObjcts.objects && collectionsObjcts.objects.length > 0) {
                    for (let index = 0; index < collectionsObjcts.objects.length; index++) {
                        const obj = collectionsObjcts.objects[index];
                        const hideResponse = await udcService.hideObjectInACollection(
                            collectionToHide.Name,
                            obj.Key,
                        );
                        expect(hideResponse.Body.Key).to.equal(obj.Key);
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
                    expect(hideResponse.Body.Hidden).to.equal(true);
                }
            }
        });
        // it('Creating UDC of Primiteve Types Fields with API', async () => {
        //     //  String  |  Integer  |  Double  |  Boolean  |  DateTime  //
        //     const collectionName = 'PrimitivesAuto';
        //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
        //         nameOfCollection: collectionName,
        //         fieldsOfCollection: [
        //             { classType: "Primitive", fieldName: "string_field", fieldType: "String", mandatory: false, indexed: false, fieldDescription: "field of name" },
        //             { classType: "Primitive", fieldName: "boolean_field", fieldType: "Bool", mandatory: false, indexed: false, fieldDescription: "field of exist" },
        //             { classType: "Primitive", fieldName: "integer_field", fieldType: "Integer", mandatory: false, indexed: false, fieldDescription: "field of amount" },
        //             { classType: "Primitive", fieldName: "double_field", fieldType: "Double", mandatory: false, indexed: false, fieldDescription: "field of price" },
        //             { classType: "Primitive", fieldName: "datetime_field", fieldType: "DateTime", mandatory: false, indexed: false, fieldDescription: "field of day" }
        //         ],
        //         descriptionOfCollection: 'Created with Automation'
        //     })
        //     const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
        //     console.info('Response of POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/schemes :\n', `${JSON.stringify(upsertResponse, null, 2)}`);
        //     expect(upsertResponse.Ok).to.be.true;
        //     expect(upsertResponse.Status).to.equal(200);
        //     expect(upsertResponse.Error).to.eql({});
        // });

        // // Collection: ==========>   PrimitivesAuto   <==========    //
        // it('Adding Values to Collection: PrimitivesAuto', async () => {
        //     const collectionName = 'PrimitivesAuto';
        //     const upsertingValues_Response = await udcService.upsertValuesToCollection({
        //         "string_field": "It's 2023!",
        //         "boolean_field": true,
        //         "integer_field": 2023,
        //         "double_field": 1.1,
        //         "datetime_field": "It's 2023!",
        //     }, collectionName);
        //     console.info('Response of POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/schemes :\n', `${JSON.stringify(upsertingValues_Response, null, 2)}`);
        //     expect(upsertingValues_Response.Ok).to.be.true;
        //     expect(upsertingValues_Response.Status).to.equal(200);
        //     expect(upsertingValues_Response.Error).to.eql({});
        // });

        // it('Creating UDC of Arrays of Primiteve Types Fields with API', async () => {
        //     //  Strings Array  |  Integers Array  |  Doubles Array  //
        //     const collectionName = 'ArraysPrimitivesAuto';
        //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
        //         nameOfCollection: collectionName,
        //         fieldsOfCollection: [
        //             { classType: "Array", fieldName: "numbers", fieldType: "String", mandatory: false, fieldDescription: "list of products" },
        //             { classType: "Array", fieldName: "names", fieldType: "Integer", mandatory: false, fieldDescription: "in stock quantity" },
        //             { classType: "Array", fieldName: "reals", fieldType: "Double", mandatory: false, fieldDescription: "average items sold per month" }
        //         ],
        //         descriptionOfCollection: 'Created with Automation'
        //     })
        //     const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
        //     console.info('Response of POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/schemes :\n', `${JSON.stringify(upsertResponse, null, 2)}`);
        //     expect(upsertResponse.Ok).to.be.true;
        //     expect(upsertResponse.Status).to.equal(200);
        //     expect(upsertResponse.Error).to.eql({});
        // });

        // // Collection: ==========>   ArraysPrimitivesAuto   <==========   //
        // it('Adding Values to Collection: ArraysPrimitivesAuto', async () => {
        //     const collectionName = 'ArraysPrimitivesAuto';
        //     const upsertingValues_Response = await udcService.upsertValuesToCollection({
        //         "numbers": [
        //             1,
        //             2,
        //             3,
        //             4
        //         ],
        //         "names": [
        //             "Happy",
        //             "New",
        //             "Year",
        //             "!!!"
        //         ],
        //         "reals": [
        //             0.1,
        //             0.2,
        //             0.3,
        //             0.4
        //         ]
        //     }, collectionName);
        //     console.info(`Response of POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/create?collection_name=${collectionName} :\n`, `${JSON.stringify(upsertingValues_Response, null, 2)}`);
        //     expect(upsertingValues_Response.Ok).to.be.true;
        //     expect(upsertingValues_Response.Status).to.equal(200);
        //     expect(upsertingValues_Response.Error).to.eql({});
        // });

        // // Collection: ==========>   ArraysNumbersNamesReals   <==========   //
        // it('Adding Values to Collection: ArraysNumbersNamesReals', async () => {
        //     const collectionName = 'ArraysNumbersNamesReals';
        //     const upsertingValues_Response = await udcService.upsertValuesToCollection(
        //         {
        //             numbers: [1, 2, 3, 4],
        //             names: ['Happy', 'New', 'Year', '!!!'],
        //             reals: [0.1, 0.2, 0.3, 0.4],
        //         },
        //         collectionName,
        //     );
        //     console.info(`Response of POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/create?collection_name=${collectionName} :\n`, `${JSON.stringify(upsertingValues_Response, null, 2)}`);
        //     expect(upsertingValues_Response.Ok).to.be.true;
        //     expect(upsertingValues_Response.Status).to.equal(200);
        //     expect(upsertingValues_Response.Error).to.eql({});
        // });

        // it('Creating UDC of Mix: String & String Array with API', async () => {
        //     const collectionName = 'StringPlusStringArrayAuto';
        //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
        //         nameOfCollection: collectionName,
        //         fieldsOfCollection: [
        //             { classType: "Array", fieldType: "String", fieldName: "string_arr", mandatory: false, fieldDescription: "list of products" },
        //             { classType: "Primitive", fieldType: "String", fieldName: "string_field", mandatory: false, indexed: false, fieldDescription: "field of name" }
        //         ],
        //         descriptionOfCollection: 'Created with method prepareDataForUdcCreation'
        //     })
        //     const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
        //     console.info('Response of POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/schemes :\n', `${JSON.stringify(upsertResponse, null, 2)}`);
        //     expect(upsertResponse.Ok).to.be.true;
        //     expect(upsertResponse.Status).to.equal(200);
        //     expect(upsertResponse.Error).to.eql({});
        // });

        // // Collection: ==========>   StringPlusStringArrayAuto   <==========  //
        // it('Adding Values to Collection: StringPlusStringArrayAuto', async () => {
        //     const collectionName = 'StringPlusStringArrayAuto';
        //     const upsertingValues_Response = await udcService.upsertValuesToCollection({
        //         "string_arr": [
        //             "Happy",
        //             "New",
        //             "Year",
        //             "!!!"
        //         ],
        //         "string_field": "It's 2023!",
        //     }, collectionName);
        //     console.info('Response of POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/schemes :\n', `${JSON.stringify(upsertingValues_Response, null, 2)}`);
        //     expect(upsertingValues_Response.Ok).to.be.true;
        //     expect(upsertingValues_Response.Status).to.equal(200);
        //     expect(upsertingValues_Response.Error).to.eql({});
        // });
    });
}
