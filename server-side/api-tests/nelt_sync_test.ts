import { DataCreation, Resource } from '../services/data-creation.service';
import GeneralService, { TesterFunctions } from '../services/general.service';
import { UdcField, UDCService } from '../services/user-defined-collections.service';
import fetch, { RequestInit, Response } from "node-fetch";
import { PapiClient } from '@pepperi-addons/papi-sdk';
import { ADALService } from '../services/adal.service';


export async function NeltSyncestser(generalService: GeneralService, request, tester: TesterFunctions) {
    await NeltSyncTest(generalService, request, tester);
}
export async function NeltSyncTest(generalService: GeneralService, request, tester: TesterFunctions) {
    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    const udcService = new UDCService(generalService);
    const dataCreator = new DataCreation(generalService["client"]);
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
                await dataCreator.createData();
                //run on all deafult resources and get text data
                const usersURL = (dataCreator.resourceList.find((resource) => resource.scheme.Name.toLocaleLowerCase() === 'users') as Resource).urlToResource;
                const dataToUpsert = await (await fetch(usersURL!)).text();
                //create PFS scheme
                const adalService = new ADALService(generalService.papiClient);
                const schemaName = "pfsForNelt";
                const newSchema = await adalService.postSchema({
                    Name: schemaName,
                    Type: 'pfs',
                    SyncData: { Sync: true },
                } as any);
                //post empty call to create presignedURL
                const papiClient: PapiClient = generalService.papiClient;
                let pfsSchemeResponse;
                try {
                    pfsSchemeResponse = await papiClient.addons.pfs.uuid("eb26afcd-3cf2-482e-9ab1-b53c41a6adbe").schema(schemaName).post({ Key: "currentData.csv", MIME: "application/vnd.ms-excel", Cache: false });
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
                        "Content-Length": buffer.length.toString(),
                        "Content-Type": "application/vnd.ms-excel"
                    }
                };
                let putResponse;
                try {
                    putResponse = await fetch(presignedURL, requestOptions);
                } catch (error) {
                    debugger;
                }
                //import the data from PFS scheme to the resource
                const body = {
                    'URI': urlToImport,
                    'OverwriteObject': true,
                    'Delimiter': ',',
                    "TableOverwrite": true
                };
                const importToUsers = await generalService.fetchStatus('/addons/data/import/file/fc5a5974-3b30-4430-8feb-7d5b9699bc9f/users', {
                    method: "POST",
                    body: JSON.stringify(body)
                });
                const auditLogResponse = await generalService.getAuditLogResultObjectIfValid(
                    importToUsers.Body.URI,
                    90,
                );
                debugger;
            });
            it('create the data and set UDCs', async () => {
                debugger;
                const divisionFields: UdcField[] = [{ Name: "Code", Mandatory: true, Type: "String" }];
                const divisionResponse = await createUDC(udcService, "DivisionsUDC", "Automation Division UDC", divisionFields, divisionFields);
                const companiesFields: UdcField[] = [{ Name: "Code", Mandatory: true, Type: "String" }];
                const companiesResponse = await createUDC(udcService, "CompaniesUDC", "Automation Companies UDC", companiesFields, companiesFields);
                const userInfoFields: UdcField[] = [{
                    Name: 'userRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "users",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'divisionRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "DivisionUDC",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'companyRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "CompaniesUDC",
                    ApplySystemFilter: true,
                }
                ];
                const userInfoResponse = await createUDC(udcService, "UserInfoUDC", "Automation UserInfo UDC", userInfoFields, userInfoFields);
                const AccountData1Fields: UdcField[] = [{
                    Name: 'accountRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "accounts",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'value1',
                    Mandatory: true,
                    Type: 'String',
                },
                ];
                const AccountData1Response = await createUDC(udcService, "AccountData1UDC", "Automation AccountData1 UDC", AccountData1Fields, [AccountData1Fields[0]]);
                const DivisionData1: UdcField[] = [{
                    Name: 'divisionRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "DivisionUDC",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'value1',
                    Mandatory: true,
                    Type: 'String',
                },
                ];
                const DivisionData1Response = await createUDC(udcService, "DivisionData1UDC", "Automation DivisionData1 UDC", DivisionData1, [DivisionData1[0]]);
                const Data2XRef: UdcField[] = [{
                    Name: 'divisionRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "DivisionUDC",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'companyRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "CompaniesUDC",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'value1',
                    Mandatory: true,
                    Type: 'String',
                },
                {
                    Name: 'value2',
                    Mandatory: true,
                    Type: 'String',
                },
                ];
                const Data2XRefResponse = await createUDC(udcService, "Data2XRefUDC", "Automation Data2XRef UDC", Data2XRef, [Data2XRef[0], Data2XRef[1]]);
                const DataX3Ref: UdcField[] = [{
                    Name: 'accountRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "accounts",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'divisionRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "DivisionsUDC",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'companyRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "CompaniesUDC",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'value1',
                    Mandatory: true,
                    Type: 'String',
                },
                {
                    Name: 'value2',
                    Mandatory: true,
                    Type: 'String',
                },
                ];
                const DataX3RefResponse = await createUDC(udcService, "DataX3RefUDC", "Automation DataX3Ref UDC", DataX3Ref, [DataX3Ref[0], DataX3Ref[1], DataX3Ref[2]]);
                const Lists: UdcField[] = [{
                    Name: 'code',
                    Mandatory: true,
                    Type: 'String',
                },
                ];
                const ListsResponse = await createUDC(udcService, "ListsUDC", "Automation Lists UDC", Lists, Lists);
                const ListItems: UdcField[] = [{
                    Name: 'listRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "Lists",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'itemRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "items",
                    ApplySystemFilter: true,
                },
                ];
                const ListItemsResponse = await createUDC(udcService, "ListItemsUDC", "Automation ListItems UDC", ListItems, ListItems);
                const AccountLists: UdcField[] = [{
                    Name: 'divisionRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "DivisionsUDC",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'companyRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "CompaniesUDC",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'accountRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "accounts",
                    ApplySystemFilter: true,
                },
                {
                    Name: 'listRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: "ListsUDC",
                    ApplySystemFilter: true,
                },
                ];
                const AccountListsResponse = await createUDC(udcService, "ListItemsUDC", "Automation ListItems UDC", ListItems, ListItems);

            });
        });
    });
}

async function createUDC(udcService, name, desc, fields: UdcField[], keys: UdcField[]) {
    const response = await udcService.createUDCWithFields(
        name,
        fields,
        desc,
        undefined,
        undefined,
        keys
    );
    return response;
}