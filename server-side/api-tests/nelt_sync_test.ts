import { DataCreation, Resource } from '../services/data-creation.service';
import GeneralService, { TesterFunctions } from '../services/general.service';
import { UdcField, UDCService } from '../services/user-defined-collections.service';
import fetch, { RequestInit, Response } from 'node-fetch';
import { PapiClient } from '@pepperi-addons/papi-sdk';
import { ADALService } from '../services/adal.service';
import { DataCreation2 } from '../services/data-creation2.service';

export async function NeltSyncestser(generalService: GeneralService, request, tester: TesterFunctions) {
    await NeltSyncTest(generalService, request, tester);
}
export async function NeltSyncTest(generalService: GeneralService, request, tester: TesterFunctions) {
    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    const udcService = new UDCService(generalService);
    const dataCreator = new DataCreation2(generalService['client']);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }

    // await generalService.baseAddonVersionsInstallation(varKey);
    //#region Upgrade UDC
    const testData = {
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''],
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', '1.2.%'],
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
        describe('setup', () => {
            it('create and upload the data to deafult resources', async () => {
                //generate the data
                // await dataCreator.createData();
                // debugger;
                // //running on all created deafult resources
                // for (let index = 0; index < 3; index++) {
                //     const currentResource = dataCreator.resourceList[index];
                //     //[todo]=>test if we already have this number of "things" on the resource before pushing to save time
                //     expect(currentResource).to.not.equal(undefined);
                //     //get the data generated for this resource
                //     const dataToUpsertAsCSV = await (await fetch(currentResource.urlToResource!)).text();
                //     //parse generated data to use in loop
                //     expect(dataToUpsertAsCSV).to.not.equal(undefined);
                //     const dataToUpsertParsed = dataToUpsertAsCSV.split("\n").slice(1, dataToUpsertAsCSV.split("\n").length);
                //     //run on all generated data and push to dist using papi
                //     for (let index1 = 0; index1 < currentResource.count; index1++) {
                //         let objectToSend = {};
                //         //prepare data body to send
                //         for (let index2 = 0; index2 < Object.keys(currentResource.scheme.Fields!).length; index2++) {
                //             const field = Object.keys(currentResource.scheme.Fields!)[index2];
                //             objectToSend[field] = dataToUpsertParsed[index1].split(",")[index2];
                //         }
                //         const endpoint = resolveEndPointByResource(currentResource.scheme.Name);
                //         const response = await generalService.fetchStatus(endpoint as any, {
                //             method: "POST",
                //             body: JSON.stringify(objectToSend),
                //         });
                //         if (response.Status === 400) {
                //             expect(response.Body.fault.faultstring).to.include('is already in use');
                //         } else {
                //             expect(response.Ok).to.be.true;
                //         }
                //     }
                // }
                // debugger;
                // //upload data to the dist using papi
                // const currentResource = (dataCreator.resourceList.find((resource) => resource.scheme.Name.toLocaleLowerCase() === 'users') as Resource);
                // debugger;
                // // const dataToUpsert = await (await fetch(usersURL!)).text();
                // // //run on the data and push using papi
                // // for (let index = 0; index < array.length; index++) {
                // //     const element = array[index];
                // // }
                // // debugger;
            });
            // it('create the data and set UDCs', async () => {
            //     debugger;
            //     const divisionFields: UdcField[] = [{ Name: "code", Mandatory: true, Type: "String" }];
            //     const divisionResponse = await createUDC(udcService, "DivisionsUDC1", "Automation Division UDC", divisionFields, divisionFields);
            //     const companiesFields: UdcField[] = [{ Name: "code", Mandatory: true, Type: "String" }];
            //     const companiesResponse = await createUDC(udcService, "CompaniesUDC1", "Automation Companies UDC", companiesFields, companiesFields);
            //     const userInfoFields: UdcField[] = [{
            //         Name: 'userRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "users",
            //         ApplySystemFilter: true,
            //         AdddonUID: "fc5a5974-3b30-4430-8feb-7d5b9699bc9f"
            //     },
            //     {
            //         Name: 'divisionRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "DivisionUDC",
            //         ApplySystemFilter: true,
            //         AdddonUID: "122c0e9d-c240-4865-b446-f37ece866c22"
            //     },
            //     {
            //         Name: 'companyRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "CompaniesUDC",
            //         ApplySystemFilter: true,
            //         AdddonUID: "122c0e9d-c240-4865-b446-f37ece866c22"
            //     }
            //     ];
            //     const userInfoResponse = await createUDC(udcService, "UserInfoUDC1", "Automation UserInfo UDC", userInfoFields, userInfoFields);
            //     const AccountData1Fields: UdcField[] = [{
            //         Name: 'accountRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "accounts",
            //         ApplySystemFilter: true,
            //         AdddonUID: "fc5a5974-3b30-4430-8feb-7d5b9699bc9f"
            //     },
            //     {
            //         Name: 'value1',
            //         Mandatory: true,
            //         Type: 'String',
            //     },
            //     ];
            //     const AccountData1Response = await createUDC(udcService, "AccountData1UDC1", "Automation AccountData1 UDC", AccountData1Fields, [AccountData1Fields[0]]);
            //     const DivisionData1: UdcField[] = [{
            //         Name: 'divisionRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "DivisionUDC",
            //         ApplySystemFilter: true,
            //         AdddonUID: "122c0e9d-c240-4865-b446-f37ece866c22"
            //     },
            //     {
            //         Name: 'value1',
            //         Mandatory: true,
            //         Type: 'String',
            //     },
            //     ];
            //     const DivisionData1Response = await createUDC(udcService, "DivisionData1UDC1", "Automation DivisionData1 UDC", DivisionData1, [DivisionData1[0]]);
            //     const Data2XRef: UdcField[] = [{
            //         Name: 'divisionRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "DivisionUDC",
            //         ApplySystemFilter: true,
            //         AdddonUID: "122c0e9d-c240-4865-b446-f37ece866c22"
            //     },
            //     {
            //         Name: 'companyRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "CompaniesUDC",
            //         ApplySystemFilter: true,
            //         AdddonUID: "122c0e9d-c240-4865-b446-f37ece866c22"
            //     },
            //     {
            //         Name: 'value1',
            //         Mandatory: true,
            //         Type: 'String',
            //     },
            //     {
            //         Name: 'value2',
            //         Mandatory: true,
            //         Type: 'String',
            //     },
            //     ];
            //     const Data2XRefResponse = await createUDC(udcService, "Data2XRefUDC1", "Automation Data2XRef UDC", Data2XRef, [Data2XRef[0], Data2XRef[1]]);
            //     const DataX3Ref: UdcField[] = [{
            //         Name: 'accountRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "accounts",
            //         ApplySystemFilter: true,
            //         AdddonUID: "fc5a5974-3b30-4430-8feb-7d5b9699bc9f"
            //     },
            //     {
            //         Name: 'divisionRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "DivisionsUDC",
            //         ApplySystemFilter: true,
            //         AdddonUID: "122c0e9d-c240-4865-b446-f37ece866c22"
            //     },
            //     {
            //         Name: 'companyRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "CompaniesUDC",
            //         ApplySystemFilter: true,
            //         AdddonUID: "122c0e9d-c240-4865-b446-f37ece866c22"
            //     },
            //     {
            //         Name: 'value1',
            //         Mandatory: true,
            //         Type: 'String',
            //     },
            //     {
            //         Name: 'value2',
            //         Mandatory: true,
            //         Type: 'String',
            //     },
            //     ];
            //     const DataX3RefResponse = await createUDC(udcService, "DataX3RefUDC1", "Automation DataX3Ref UDC", DataX3Ref, [DataX3Ref[0], DataX3Ref[1], DataX3Ref[2]]);
            //     const Lists: UdcField[] = [{
            //         Name: 'code',
            //         Mandatory: true,
            //         Type: 'String',
            //     },
            //     ];
            //     const ListsResponse = await createUDC(udcService, "ListsUDC1", "Automation Lists UDC", Lists, Lists);
            //     const ListItems: UdcField[] = [{
            //         Name: 'listRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "Lists",
            //         ApplySystemFilter: true,
            //         AdddonUID: "122c0e9d-c240-4865-b446-f37ece866c22"
            //     },
            //     {
            //         Name: 'itemRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "items",
            //         ApplySystemFilter: true,
            //         AdddonUID: "fc5a5974-3b30-4430-8feb-7d5b9699bc9f"
            //     },
            //     ];
            //     const ListItemsResponse = await createUDC(udcService, "ListItemsUDC1", "Automation ListItems UDC", ListItems, ListItems);
            //     const AccountLists: UdcField[] = [{
            //         Name: 'divisionRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "DivisionsUDC",
            //         ApplySystemFilter: true,
            //         AdddonUID: "122c0e9d-c240-4865-b446-f37ece866c22"
            //     },
            //     {
            //         Name: 'companyRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "CompaniesUDC",
            //         ApplySystemFilter: true,
            //         AdddonUID: "122c0e9d-c240-4865-b446-f37ece866c22"
            //     },
            //     {
            //         Name: 'accountRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "accounts",
            //         ApplySystemFilter: true,
            //         AdddonUID: "fc5a5974-3b30-4430-8feb-7d5b9699bc9f"
            //     },
            //     {
            //         Name: 'listRef',
            //         Mandatory: true,
            //         Type: 'Resource',
            //         Resource: "ListsUDC",
            //         ApplySystemFilter: true,
            //         AdddonUID: "122c0e9d-c240-4865-b446-f37ece866c22"
            //     },
            //     ];
            //     const AccountListsResponse = await createUDC(udcService, "AccountListsUDC1", "Automation ListItems UDC", AccountLists, AccountLists);
            //     debugger;
            // });
            it('insert data to UDCs', async () => {
                await dataCreator.createData();
                debugger;
                //run on all UDC resource
                // for (let index = 3; index < dataCreator.resourceList.length; index++) {
                //     const resource = dataCreator.resourceList[index];
                //     // get the data generated for this resource
                //     const dataToUpsertAsCSV = await (await fetch(resource.urlToResource!)).text();
                //     //parse generated data to use in loop
                //     expect(dataToUpsertAsCSV).to.not.equal(undefined);
                //     const dataToUpsertParsed = dataToUpsertAsCSV.split("\n").slice(1, dataToUpsertAsCSV.split("\n").length);
                //     debugger;
                //     for (let index1 = 0; index1 < resource.count; index1++) {
                //         let objectToSend = {};
                //         //prepare data body to send
                //         for (let index2 = 0; index2 < Object.keys(resource.scheme.Fields!).length; index2++) {
                //             const field = Object.keys(resource.scheme.Fields!)[index2];
                //             objectToSend[field] = dataToUpsertParsed[index1].split(",")[index2];
                //         }
                //         const endpoint = resolveEndPointByResource(resource.scheme.Name);
                //         const response = await generalService.fetchStatus(endpoint as any, {
                //             method: "POST",
                //             body: JSON.stringify(objectToSend),
                //         });
                //     }
                // }
                // const response = await udcService.sendDataToField(basicOnlineCollectionName, fieldValues);
            });
        });
    });
}

async function createUDC(udcService, name, desc, fields: UdcField[], keys: UdcField[]) {
    const response = await udcService.createUDCWithFields(name, fields, desc, undefined, undefined, keys);
    return response;
}

function resolveEndPointByResource(resourceName: string) {
    switch (resourceName) {
        case 'users':
            return '/createUser';
        case 'accounts':
            return '/accounts';
        case 'items':
            return '/items';
    }
}

async function todo(generalService, dataToUpsert) {
    const adalService = new ADALService(generalService.papiClient);
    const schemaName = 'pfsForNelt';
    const newSchema = await adalService.postSchema({
        Name: schemaName,
        Type: 'pfs',
        SyncData: { Sync: true },
    } as any);
    //post empty call to create presignedURL
    const papiClient: PapiClient = generalService.papiClient;
    let pfsSchemeResponse;
    try {
        pfsSchemeResponse = await papiClient.addons.pfs
            .uuid('eb26afcd-3cf2-482e-9ab1-b53c41a6adbe')
            .schema(schemaName)
            .post({ Key: 'currentData44.csv', MIME: 'text/csv', Cache: false });
    } catch (error) {
        debugger;
    }
    //put the data to the PresignedURL of PFS scheme
    const presignedURL = pfsSchemeResponse.PresignedURL;
    const urlToImport = pfsSchemeResponse.URL;
    const buffer = Buffer.from(dataToUpsert, 'utf-8');
    const requestOptions: RequestInit = {
        method: 'PUT',
        body: buffer,
        headers: {
            'Content-Length': buffer.length.toString(),
            'Content-Type': 'text/csv',
        },
    };
    let putResponse;
    try {
        putResponse = await fetch(presignedURL, requestOptions);
    } catch (error) {
        debugger;
    }
    //import the data from PFS scheme to the resource
    const body = {
        URI: urlToImport,
        // 'OverwriteObject': true,
        Delimiter: ',',
        // "TableOverwrite": true
    };
    const importToUsers = await generalService.fetchStatus(
        '/addons/data/import/file/fc5a5974-3b30-4430-8feb-7d5b9699bc9f/accounts',
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
    );
    const auditLogResponse = await generalService.getAuditLogResultObjectIfValid(importToUsers.Body.URI, 90);
}
