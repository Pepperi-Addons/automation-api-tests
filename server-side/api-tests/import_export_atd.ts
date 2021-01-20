import GeneralService, { TesterFunctions } from '../services/general.service';
//import { FieldsService } from '../services/fields.service';
import { ImportExportATDService, MetaDataATD, MetaDataUDT } from '../services/import-export-atd.service';
import fetch from 'node-fetch';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

function testDataATD(externaID: string, description: string) {
    return {
        ExternalID: `Test ATD ${externaID}`,
        Description: description,
    } as MetaDataATD;
}

let isActivitiesTests = false;
let isTransactionsTests = false;
let isActivitiesTestsBox = false;
let isTransactionsTestsBox = false;

// All Import Export ATD Tests
export async function ImportExportATDActivitiesTests(generalService: GeneralService, request, tester: TesterFunctions) {
    isActivitiesTests = true;
    isTransactionsTests = false;
    isActivitiesTestsBox = false;
    isTransactionsTestsBox = false;
    await ImportExportATDTests(generalService, request, tester);
}

export async function ImportExportATDTransactionsTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    isActivitiesTests = false;
    isTransactionsTests = true;
    isActivitiesTestsBox = false;
    isTransactionsTestsBox = false;
    await ImportExportATDTests(generalService, request, tester);
}

export async function ImportExportATDActivitiesBoxTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    isActivitiesTests = false;
    isTransactionsTests = false;
    isActivitiesTestsBox = true;
    isTransactionsTestsBox = false;
    await ImportExportATDTests(generalService, request, tester);
}

export async function ImportExportATDTransactionsBoxTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    isActivitiesTests = false;
    isTransactionsTests = false;
    isActivitiesTestsBox = false;
    isTransactionsTestsBox = true;
    await ImportExportATDTests(generalService, request, tester);
}

async function ImportExportATDTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const service = generalService.papiClient;
    //const fieldsService = new FieldsService(generalService.papiClient);
    const importExportATDService = new ImportExportATDService(generalService.papiClient);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //Prerequisites Test Data
    const transactionsTypeArr = [] as any;
    const activitiesTypeArr = [] as any;

    //Clean the ATD and UDT from failed tests before starting a new test
    await TestCleanUpATD(importExportATDService);
    await TestCleanUpUDT(importExportATDService);

    //DI-17369 was changed from bug to improvment - then this part is needed for now 23/12/2020
    //These will go into ImportExport tests and will not go into CRUD tests
    if (isActivitiesTests || isActivitiesTestsBox) {
        await importExportATDService.postActivitiesATD(
            testDataATD(
                Math.floor(Math.random() * 10000000).toString() + ' ' + Math.random().toString(36).substring(10),
                'Description of Test ATD',
            ),
        );
    }

    if (isTransactionsTests || isTransactionsTestsBox) {
        await importExportATDService.postTransactionsATD(
            testDataATD(
                Math.floor(Math.random() * 10000000).toString() + ' ' + Math.random().toString(36).substring(10),
                'Description of Test ATD',
            ),
        );
    }

    //These will go into CRUD tests and can't be use for ImportExport tests
    let testDataNewActivitiesATD;
    let testDataNewTransactionATD;
    if (isTransactionsTests) {
        testDataNewActivitiesATD = await importExportATDService.postActivitiesATD(
            testDataATD(
                Math.floor(Math.random() * 10000000).toString() + ' ' + Math.random().toString(36).substring(10),
                'Description of Test ATD',
            ),
        );

        testDataNewTransactionATD = await importExportATDService.postTransactionsATD(
            testDataATD(
                Math.floor(Math.random() * 10000000).toString() + ' ' + Math.random().toString(36).substring(10),
                'Description of Test ATD',
            ),
        );
    }

    const testDataPostUDT = await importExportATDService.postUDT({
        TableID: `Test UDT ${Math.floor(Math.random() * 1000000).toString()}`,
        MainKeyType: { ID: 23, Name: '' },
        SecondaryKeyType: { ID: 35, Name: '' },
        MemoryMode: {
            Dormant: true,
            Volatile: false,
        },
    });

    const transactionsArr = await generalService.getTypes('transactions');
    transactionsArr.forEach((element) => {
        if (!element.ExternalID.includes('(') && !element.ExternalID.includes(')')) {
            transactionsTypeArr.push(element.ExternalID);
            transactionsTypeArr[element.ExternalID] = element.TypeID;
        }
    });

    const activitiesArr = await generalService.getTypes('activities');
    activitiesArr.forEach((element) => {
        if (!element.ExternalID.includes('(') && !element.ExternalID.includes(')')) {
            activitiesTypeArr.push(element.ExternalID);
            activitiesTypeArr[element.ExternalID] = element.TypeID;
        }
    });

    const dataViewsAddonUUID = '484e7f22-796a-45f8-9082-12a734bac4e8';
    const dataViewsVersion = '0.';
    const importExportATDAddonUUID = 'e9029d7f-af32-4b0e-a513-8d9ced6f8186';
    const importExportATDVersion = '1.';

    //#region Upgrade Data Views
    const dataViewsVarLatestVersion = await fetch(
        `${generalService['client'].BaseURL.replace(
            'papi-eu',
            'papi',
        )}/var/addons/versions?where=AddonUUID='${dataViewsAddonUUID}' AND Version Like '${dataViewsVersion}%'&order_by=CreationDateTime DESC`,
        {
            method: `GET`,
            headers: {
                Authorization: `${request.body.varKey}`,
            },
        },
    )
        .then((response) => response.json())
        .then((addon) => addon[0].Version);

    const dataViewsUpgradeAuditLogResponse = await service.addons.installedAddons
        .addonUUID(`${dataViewsAddonUUID}`)
        .upgrade(dataViewsVarLatestVersion);

    generalService.sleep(4000); //Test installation status only after 4 seconds.
    let dataViewsAuditLogResponse = await service.auditLogs
        .uuid(dataViewsUpgradeAuditLogResponse.ExecutionUUID as any)
        .get();
    if (dataViewsAuditLogResponse.Status.Name == 'InProgress') {
        generalService.sleep(20000); //Wait another 20 seconds and try again (fail the test if client wait more then 20+4 seconds)
        dataViewsAuditLogResponse = await service.auditLogs
            .uuid(dataViewsUpgradeAuditLogResponse.ExecutionUUID as any)
            .get();
    }
    const dataViewsInstalledAddonVersion = await service.addons.installedAddons
        .addonUUID(`${dataViewsAddonUUID}`)
        .get();
    //#endregion Upgrade Data Views

    //#region Upgrade Import Export ATD
    const importExportATDVarLatestVersion = await fetch(
        `${generalService['client'].BaseURL.replace(
            'papi-eu',
            'papi',
        )}/var/addons/versions?where=AddonUUID='${importExportATDAddonUUID}' AND Version Like '${importExportATDVersion}%'&order_by=CreationDateTime DESC`,
        {
            method: `GET`,
            headers: {
                Authorization: `${request.body.varKey}`,
            },
        },
    )
        .then((response) => response.json())
        .then((addon) => addon[0].Version);

    const importExportATDUpgradeAuditLogResponse = await service.addons.installedAddons
        .addonUUID(`${importExportATDAddonUUID}`)
        .upgrade(importExportATDVarLatestVersion);

    generalService.sleep(4000); //Test installation status only after 4 seconds.
    let importExportATDAuditLogResponse = await service.auditLogs
        .uuid(importExportATDUpgradeAuditLogResponse.ExecutionUUID as any)
        .get();
    if (importExportATDAuditLogResponse.Status.Name == 'InProgress') {
        generalService.sleep(20000); //Wait another 20 seconds and try again (fail the test if client wait more then 20+4 seconds)
        importExportATDAuditLogResponse = await service.auditLogs
            .uuid(importExportATDUpgradeAuditLogResponse.ExecutionUUID as any)
            .get();
    }
    const importExportATDInstalledAddonVersion = await service.addons.installedAddons
        .addonUUID(`${importExportATDAddonUUID}`)
        .get();
    //#endregion Upgrade Import Export ATD

    describe('Export And Import ATD Tests Suites', () => {
        describe('Prerequisites Addon for ImportExportATD Tests', () => {
            it('Upgarde To Latest Version of Data Views Addon', async () => {
                expect(dataViewsUpgradeAuditLogResponse)
                    .to.have.property('ExecutionUUID')
                    .a('string')
                    .with.lengthOf(36);
                if (dataViewsAuditLogResponse.Status.Name == 'Failure') {
                    expect(dataViewsAuditLogResponse.AuditInfo.ErrorMessage).to.include(
                        'is already working on version',
                    );
                } else {
                    expect(dataViewsAuditLogResponse.Status.Name).to.include('Success');
                }
            });

            it(`Latest Version Is Installed`, () => {
                expect(dataViewsInstalledAddonVersion)
                    .to.have.property('Version')
                    .a('string')
                    .that.is.equal(dataViewsVarLatestVersion);
            });

            it('Upgarde To Latest Version of Import Export Addon', async () => {
                expect(importExportATDUpgradeAuditLogResponse)
                    .to.have.property('ExecutionUUID')
                    .a('string')
                    .with.lengthOf(36);
                if (importExportATDAuditLogResponse.Status.Name == 'Failure') {
                    expect(importExportATDAuditLogResponse.AuditInfo.ErrorMessage).to.include(
                        'is already working on version',
                    );
                } else {
                    expect(importExportATDAuditLogResponse.Status.Name).to.include('Success');
                }
            });

            it(`Latest Version Is Installed`, () => {
                expect(importExportATDInstalledAddonVersion)
                    .to.have.property('Version')
                    .a('string')
                    .that.is.equal(importExportATDVarLatestVersion);
            });

            if (isTransactionsTests) {
                describe('Endpoints', () => {
                    describe('ATD', () => {
                        it(`Create New ATD (DI-17195)`, async () => {
                            expect(testDataNewTransactionATD)
                                .to.have.property('Description')
                                .a('string')
                                .that.contains('Description of Test ATD');
                            expect(testDataNewTransactionATD).to.have.property('TypeID').a('number').that.is.above(0);
                            expect(testDataNewTransactionATD).to.have.property('InternalID').a('number').that.above(0);
                            expect(testDataNewTransactionATD)
                                .to.have.property('ExternalID')
                                .a('string')
                                .that.contains('Test ATD ');
                            expect(testDataNewTransactionATD).to.have.property('Hidden').a('boolean').that.is.false;
                            expect(testDataNewTransactionATD)
                                .to.have.property('Icon')
                                .a('string')
                                .that.contains('icon');
                            expect(testDataNewTransactionATD)
                                .to.have.property('ModificationDateTime')
                                .a('string')
                                .that.contains(new Date().toISOString().substring(0, 11));
                            expect(testDataNewTransactionATD)
                                .to.have.property('ModificationDateTime')
                                .a('string')
                                .that.contains('Z');
                            expect(testDataNewTransactionATD)
                                .to.have.property('CreationDateTime')
                                .a('string')
                                .that.contains(new Date().toISOString().substring(0, 11));
                            expect(testDataNewTransactionATD)
                                .to.have.property('CreationDateTime')
                                .a('string')
                                .that.contains('Z');
                            expect(testDataNewTransactionATD)
                                .to.have.property('UUID')
                                .a('string')
                                .that.have.lengthOf(36);
                        });

                        it(`CRUD ATD`, async () => {
                            //Update + Delete
                            console.log({ CRUD_ATD_Post_Response: testDataNewTransactionATD });
                            const testDataUpdatedATD = await importExportATDService.postTransactionsATD({
                                TypeID: 0,
                                InternalID: testDataNewTransactionATD.InternalID,
                                ExternalID: testDataNewTransactionATD.ExternalID + 1,
                                UUID: 'Test String',
                                Description: 'Updated Description of Test ATD',
                                Icon: testDataNewTransactionATD.Icon.slice(0, -1) + 3,
                                Hidden: true,
                                CreationDateTime: testDataNewTransactionATD.CreationDateTime,
                                ModificationDateTime: 'Test String',
                            });
                            console.log({ CRUD_ATD_Update_Response: testDataUpdatedATD });

                            expect(testDataUpdatedATD)
                                .to.have.property('Description')
                                .a('string')
                                .that.contains('Updated Description of Test ATD');
                            expect(testDataNewTransactionATD)
                                .to.have.property('TypeID')
                                .a('number')
                                .that.is.equal(testDataUpdatedATD.TypeID);
                            expect(testDataNewTransactionATD)
                                .to.have.property('InternalID')
                                .a('number')
                                .that.is.equal(testDataUpdatedATD.InternalID);
                            expect(testDataUpdatedATD)
                                .to.have.property('ExternalID')
                                .a('string')
                                .that.contains(testDataNewTransactionATD.ExternalID + 1);
                            expect(testDataUpdatedATD).to.have.property('Hidden').a('boolean').that.is.true;
                            expect(testDataUpdatedATD).to.have.property('Icon').a('string').that.contains('icon3');
                            expect(testDataUpdatedATD)
                                .to.have.property('ModificationDateTime')
                                .a('string')
                                .that.contains(new Date().toISOString().substring(0, 11));
                            expect(testDataUpdatedATD)
                                .to.have.property('ModificationDateTime')
                                .a('string')
                                .that.contains('Z');
                            expect(testDataNewTransactionATD)
                                .to.have.property('CreationDateTime')
                                .a('string')
                                .that.contains(testDataUpdatedATD.CreationDateTime);
                            expect(testDataNewTransactionATD)
                                .to.have.property('UUID')
                                .a('string')
                                .that.contains(testDataUpdatedATD.UUID);

                            //Restore
                            const testDataRestoreATD = await importExportATDService.postTransactionsATD({
                                InternalID: testDataUpdatedATD.InternalID,
                                ExternalID: testDataNewTransactionATD.ExternalID,
                                Description: testDataUpdatedATD.Description,
                                Hidden: false,
                            });

                            expect(testDataRestoreATD).to.have.property('Hidden').a('boolean').that.is.false;
                            console.log({ CRUD_ATD_Restore_Response: testDataRestoreATD });

                            //Hide the ATD - Full restore is not yet supported - see:
                            //DI-17369 was changed from bug to improvment - then this part is not relevant for now 23/12/2020
                            const testDataRestoreATDTemp = await importExportATDService.postTransactionsATD({
                                InternalID: testDataUpdatedATD.InternalID,
                                ExternalID: testDataNewTransactionATD.ExternalID,
                                Description: testDataUpdatedATD.Description,
                                Hidden: true,
                            });
                            expect(testDataRestoreATDTemp).to.have.property('Hidden').a('boolean').that.is.true;
                        });

                        it(`Create New ATD With Wrong Icon (DI-17201)`, async () => {
                            const tempATD = testDataATD(
                                Math.floor(Math.random() * 1000000).toString(),
                                'Description of Test ATD',
                            );
                            tempATD.Icon = 'icon1';
                            return expect(
                                importExportATDService.postTransactionsATD(tempATD),
                            ).eventually.to.be.rejectedWith(
                                'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Icon for activity type definition must be with the following format: `icon(number between 2-25)`',
                            );
                        });

                        it(`Get Hidden ATD (DI-17049)`, async () => {
                            //DI-17369 was changed from bug to improvment
                            //it(`Get Hidden ATD (DI-17049, DI-17369)`, async () => {

                            //importToNewATD

                            //Test Data
                            expect(testDataNewActivitiesATD).to.have.property('Hidden').a('boolean').that.is.false;
                            //DI-17369 was changed from bug to improvment - then this part is not relevant for now 23/12/2020
                            // const exportATDResponseBeforeHidden = await importExportATDService.exportATD(
                            //     'activities',
                            //     testDataNewActivitiesATD.TypeID,
                            // );

                            // expect(exportATDResponseBeforeHidden)
                            //     .to.have.property('URL')
                            //     .that.contain('https://')
                            //     .and.contain('cdn.')
                            //     .and.contain('/TemporaryFiles/');
                            // const exportATDResponseBeforeHiddenObject = await fetch(
                            //     exportATDResponseBeforeHidden.URL,
                            // ).then((response) => response.json());

                            //Delete
                            const testDeleteATD = await importExportATDService.postActivitiesATD({
                                InternalID: testDataNewActivitiesATD.InternalID,
                                ExternalID: testDataNewActivitiesATD.ExternalID,
                                Description: testDataNewActivitiesATD.Description,
                                Hidden: true,
                            });
                            expect(testDeleteATD).to.have.property('Hidden').a('boolean').that.is.true;

                            //GET
                            const getDeletedATD = await importExportATDService.getActivitiesATD(
                                testDataNewActivitiesATD.TypeID,
                            );
                            expect(getDeletedATD).to.have.property('Hidden').a('boolean').that.is.true;

                            //Restore
                            const testDataRestoreATD = await importExportATDService.postActivitiesATD({
                                InternalID: testDataNewActivitiesATD.InternalID,
                                ExternalID: testDataNewActivitiesATD.ExternalID,
                                Description: testDataNewActivitiesATD.Description,
                                Hidden: false,
                            });
                            expect(testDataRestoreATD).to.have.property('Hidden').a('boolean').that.is.false;

                            //Delete - this can be removed from here once DI-17369 will be ready and this test can be executed again
                            const testDeleteATDTemp = await importExportATDService.postActivitiesATD({
                                InternalID: testDataNewActivitiesATD.InternalID,
                                ExternalID: testDataNewActivitiesATD.ExternalID,
                                Description: testDataNewActivitiesATD.Description,
                                Hidden: true,
                            });
                            expect(testDeleteATDTemp).to.have.property('Hidden').a('boolean').that.is.true;

                            //DI-17369 was changed from bug to improvment - then this part is not relevant for now 23/12/2020
                            // const exportATDResponseAfterRestore = await importExportATDService.exportATD(
                            //     'activities',
                            //     testDataNewActivitiesATD.TypeID,
                            // );

                            // expect(exportATDResponseAfterRestore)
                            //     .to.have.property('URL')
                            //     .that.contain('https://')
                            //     .and.contain('cdn.')
                            //     .and.contain('/TemporaryFiles/');
                            // const exportATDResponseAfterRestoreObject = await fetch(
                            //     exportATDResponseAfterRestore.URL,
                            // ).then((response) => response.json());
                            // if (
                            //     Math.abs(
                            //         JSON.stringify(exportATDResponseBeforeHiddenObject).length -
                            //             JSON.stringify(exportATDResponseAfterRestoreObject).length,
                            //     ) > 0.5 ||
                            //     Math.abs(
                            //         JSON.stringify(exportATDResponseBeforeHiddenObject.DataViews).length -
                            //             JSON.stringify(exportATDResponseAfterRestoreObject.DataViews).length,
                            //     ) > 0.5 ||
                            //     Math.abs(
                            //         JSON.stringify(exportATDResponseBeforeHiddenObject.Fields).length -
                            //             JSON.stringify(exportATDResponseAfterRestoreObject.Fields).length,
                            //     ) > 0.5
                            // ) {
                            //     expect(
                            //         `The length of the ATD after the restore is ${
                            //             JSON.stringify(exportATDResponseAfterRestoreObject).length
                            //         }, expected to be in length of ${
                            //             JSON.stringify(exportATDResponseBeforeHiddenObject).length
                            //         }, but the difference in length is: ${Math.abs(
                            //             JSON.stringify(exportATDResponseAfterRestoreObject).length -
                            //                 JSON.stringify(exportATDResponseBeforeHiddenObject).length,
                            //         )}, Before the ATD was Hidden, the Export URL was: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=activities&subtype=${
                            //             testDataNewActivitiesATD.InternalID
                            //         }, and the Export Response was: ${
                            //             exportATDResponseBeforeHidden.URL
                            //         }, After the ATD restored, the Export URL was: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=activities&subtype=${
                            //             testDataNewActivitiesATD.InternalID
                            //         }, and the Export Response was: ${
                            //             exportATDResponseAfterRestore.URL
                            //         }, Before there was: ${
                            //             exportATDResponseBeforeHiddenObject.DataViews.length
                            //         } DataViews in total length of: ${
                            //             JSON.stringify(exportATDResponseBeforeHiddenObject.DataViews).length
                            //         },  ${exportATDResponseBeforeHiddenObject.Fields.length} Fields in total length of: ${
                            //             JSON.stringify(exportATDResponseBeforeHiddenObject.Fields).length
                            //         }, ${
                            //             exportATDResponseBeforeHiddenObject.References.length
                            //         } References in total length of: ${
                            //             JSON.stringify(exportATDResponseBeforeHiddenObject.References).length
                            //         }, and Workflow in length of: ${
                            //             JSON.stringify(exportATDResponseBeforeHiddenObject.Workflow).length
                            //         }, After there was: ${
                            //             exportATDResponseAfterRestoreObject.DataViews.length
                            //         } DataViews in total length of: ${
                            //             JSON.stringify(exportATDResponseAfterRestoreObject.DataViews).length
                            //         },  ${exportATDResponseAfterRestoreObject.Fields.length} Fields in total length of: ${
                            //             JSON.stringify(exportATDResponseAfterRestoreObject.Fields).length
                            //         }, ${
                            //             exportATDResponseAfterRestoreObject.References.length
                            //         } References in total length of: ${
                            //             JSON.stringify(exportATDResponseAfterRestoreObject.References).length
                            //         }, and Workflow in length of: ${
                            //             JSON.stringify(exportATDResponseAfterRestoreObject.Workflow).length
                            //         }`,
                            //     ).to.be.true;
                            // } else {
                            //     expect(
                            //         Math.abs(
                            //             JSON.stringify(exportATDResponseAfterRestoreObject).length -
                            //                 JSON.stringify(exportATDResponseBeforeHiddenObject).length,
                            //         ),
                            //     ).to.be.below(20);
                            // }
                        });
                    });

                    describe('UDT', () => {
                        it('CRUD UDT', async () => {
                            console.log({ CRUD_UDT_Post_Response: testDataPostUDT });
                            expect(testDataPostUDT).to.have.property('TableID');
                        });

                        it('Get Deleted UDT (DI-17251)', async () => {
                            await importExportATDService.deleteUDT(testDataPostUDT.TableID);
                            return expect(
                                importExportATDService.getUDT(testDataPostUDT.TableID),
                            ).eventually.to.have.property('TableID');
                        });

                        it('Delete Deleted UDT (DI-17265)', async () => {
                            return expect(importExportATDService.deleteUDT(testDataPostUDT.TableID)).eventually.to.be
                                .false;
                        });

                        it('Delete Non Existing UDT (DI-17265)', async () => {
                            return expect(
                                importExportATDService.deleteUDT('Non Existing UDT 1234'),
                            ).eventually.to.be.rejectedWith(
                                `failed with status: 404 - Not Found error: {"fault":{"faultstring":"User defined table: Non Existing UDT 1234 doesn't exist.`,
                            );
                        });

                        it('Restore Deleted UDT', async () => {
                            await importExportATDService.postUDT({
                                MainKeyType: testDataPostUDT.MainKeyType,
                                SecondaryKeyType: testDataPostUDT.SecondaryKeyType,
                                TableID: testDataPostUDT.TableID,
                                Hidden: false,
                            });
                            return expect(importExportATDService.getUDT(testDataPostUDT.TableID))
                                .eventually.to.have.property('Hidden')
                                .a('boolean').that.is.false;
                        });

                        it('Restore Deleted UDT (DI-17304)', async () => {
                            await importExportATDService.postUDT({
                                MainKeyType: testDataPostUDT.MainKeyType,
                                SecondaryKeyType: testDataPostUDT.SecondaryKeyType,
                                TableID: testDataPostUDT.TableID,
                                Hidden: true,
                            });

                            const getUTDObject = await importExportATDService.getUDT(testDataPostUDT.TableID);

                            await Promise.all([
                                expect(getUTDObject).to.have.property('Hidden').a('boolean').that.is.true,
                                expect(
                                    importExportATDService.postUDT({
                                        MainKeyType: testDataPostUDT.MainKeyType,
                                        SecondaryKeyType: testDataPostUDT.SecondaryKeyType,
                                        TableID: testDataPostUDT.TableID,
                                    }),
                                )
                                    .eventually.to.have.property('Hidden')
                                    .a('boolean').that.is.false,
                            ]);
                        });

                        it('Correct Error Message for MainKeyType (DI-17269)', async () => {
                            return expect(
                                importExportATDService.postUDT({
                                    TableID: `Test UDT ${Math.floor(Math.random() * 1000000).toString()}`,
                                    MainKeyType: { ID: 1, Name: '' },
                                    SecondaryKeyType: { ID: 35, Name: '' },
                                    MemoryMode: {},
                                }),
                            ).eventually.to.be.rejectedWith(
                                'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"MainKey: 1 is not valid"',
                            );
                        });

                        it('Correct Error Message for SecondaryKeyType (DI-17332)', async () => {
                            return expect(
                                importExportATDService.postUDT({
                                    TableID: `Test UDT ${Math.floor(Math.random() * 1000000).toString()}`,
                                    MainKeyType: { ID: 35, Name: '' },
                                    SecondaryKeyType: { ID: 1, Name: '' },
                                    MemoryMode: {},
                                }),
                            ).eventually.to.be.rejectedWith(
                                'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"SecondaryKey: 1 is not valid"',
                            );
                        });

                        it('Correct Error Message for Same MemoryMode Types true (DI-17271)', async () => {
                            return expect(
                                importExportATDService.postUDT({
                                    TableID: `Test UDT ${Math.floor(Math.random() * 1000000).toString()}`,
                                    MainKeyType: { ID: 0, Name: '' },
                                    SecondaryKeyType: { ID: 0, Name: '' },
                                    MemoryMode: {
                                        Dormant: true,
                                        Volatile: true,
                                    },
                                }),
                            ).eventually.to.be.rejectedWith(
                                'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"User defined table cannot be both volatile and dormant at the same time"',
                            );
                        });

                        it("Don't Store Non Valid Data Members (DI-17268)", async () => {
                            const baseATD = await importExportATDService.getUDT(testDataPostUDT.TableID);
                            const modifiedATD = await importExportATDService.postUDT({
                                TableID: testDataPostUDT.TableID,
                                MemoryMode: {
                                    sdas: 'dfsdf',
                                },
                            } as any);
                            expect(baseATD).to.have.property('MemoryMode').to.have.property('Dormant').a('boolean').that
                                .is.true;
                            expect(baseATD).to.have.property('MemoryMode').to.have.property('Volatile').a('boolean')
                                .that.is.false;
                            expect(modifiedATD).to.have.property('MemoryMode').to.have.property('Dormant').a('boolean')
                                .that.is.false;
                            expect(modifiedATD).to.have.property('MemoryMode').to.have.property('Volatile').a('boolean')
                                .that.is.false;
                            expect(modifiedATD).to.have.property('MemoryMode').to.not.have.property('sdas');
                        });
                    });
                });
            }
        });

        //Test Data
        it(`Test Data: Transaction - Name: ${transactionsTypeArr[0]}, TypeID:${
            transactionsTypeArr[transactionsTypeArr[0]]
        }`, () => {
            expect(transactionsTypeArr[transactionsTypeArr[0]]).to.be.a('number').that.is.above(0);
        });

        it(`Test Data: Activity - Name: ${activitiesTypeArr[0]}, TypeID:${
            activitiesTypeArr[activitiesTypeArr[0]]
        }`, () => {
            expect(activitiesTypeArr[activitiesTypeArr[0]]).to.be.a('number').that.is.above(0);
        });

        it(`Test Data: Tested Addon: ImportExportATD - Version: ${importExportATDInstalledAddonVersion.Version}`, () => {
            expect(importExportATDInstalledAddonVersion.Version).to.be.a('string').that.is.contain('.');
        });

        describe('Endpoints', () => {
            describe('Get (DI-17200, DI-17258)', () => {
                if (isActivitiesTests) {
                    for (let index = 0; index < activitiesTypeArr.length; index++) {
                        const activityName = activitiesTypeArr[index];
                        const activityID = activitiesTypeArr[activitiesTypeArr[index]];
                        it(`Export Activities ATD ${activityName}`, async () => {
                            return expect(importExportATDService.exportATD('activities', activityID))
                                .eventually.to.have.property('URL')
                                .that.contain('https://')
                                .and.contain('cdn.')
                                .and.contain('/TemporaryFiles/');
                        });
                    }
                }

                if (isTransactionsTests) {
                    for (let index = 0; index < transactionsTypeArr.length - 1; index++) {
                        const transactionName = transactionsTypeArr[index];
                        const transactionID = transactionsTypeArr[transactionsTypeArr[index]];
                        it(`Export Transactions ATD ${transactionName}`, async () => {
                            return expect(importExportATDService.exportATD('transactions', transactionID))
                                .eventually.to.have.property('URL')
                                .that.contain('https://')
                                .and.contain('cdn.')
                                .and.contain('/TemporaryFiles/');
                        });
                    }
                }
            });

            describe('Post', () => {
                if (isActivitiesTests) {
                    for (let index = 0; index < activitiesTypeArr.length; index++) {
                        const activityName = activitiesTypeArr[index];
                        const activityID = activitiesTypeArr[activitiesTypeArr[index]];
                        it(`Export Mapping Of Activities ATD ${activityName}`, async () => {
                            const exportATDResponse = await importExportATDService.exportATD('activities', activityID);
                            expect(exportATDResponse)
                                .to.have.property('URL')
                                .that.contain('https://')
                                .and.contain('cdn.')
                                .and.contain('/TemporaryFiles/');
                            const references = await fetch(exportATDResponse.URL)
                                .then((response) => response.json())
                                .then((atd) => atd.References);
                            references[0].ID = 0;
                            const mappingResponse = await importExportATDService.exportMappingATD({
                                References: references,
                            });
                            expect(mappingResponse).to.have.property('Mapping').that.is.an('array');
                            expect(JSON.stringify(mappingResponse.Mapping)).to.include('Origin');
                            expect(JSON.stringify(mappingResponse.Mapping)).to.include('ID');
                            expect(JSON.stringify(mappingResponse.Mapping)).to.include('Name');
                            expect(JSON.stringify(mappingResponse.Mapping)).to.include('Type');
                            //Destination was removed and moved to another object in 15/12/2020 - it was decided with Chasky and Oleg to not test the object,
                            //The test continue from this point as a Black Box test, where the result will only be tested for their functionality,
                            //But in case of bugs it will be hardr to find what went wrong in the process of import and export.
                            //expect(JSON.stringify(mappingResponse.Mapping)).to.include('Destination');
                        });
                    }
                }

                if (isTransactionsTests) {
                    for (let index = 0; index < transactionsTypeArr.length - 1; index++) {
                        const transactionName = transactionsTypeArr[index];
                        const transactionID = transactionsTypeArr[transactionsTypeArr[index]];
                        it(`Export Mapping Of Transactions ATD ${transactionName}`, async () => {
                            const exportATDResponse = await importExportATDService.exportATD(
                                'transactions',
                                transactionID,
                            );
                            expect(exportATDResponse)
                                .to.have.property('URL')
                                .that.contain('https://')
                                .and.contain('cdn.')
                                .and.contain('/TemporaryFiles/');
                            const references = await fetch(exportATDResponse.URL)
                                .then((response) => response.json())
                                .then((atd) => atd.References);
                            references[0].ID = 0;
                            const mappingResponse = await importExportATDService.exportMappingATD({
                                References: references,
                            });
                            expect(mappingResponse).to.have.property('Mapping').that.is.an('array');
                            expect(JSON.stringify(mappingResponse.Mapping)).to.include('Origin');
                            expect(JSON.stringify(mappingResponse.Mapping)).to.include('ID');
                            expect(JSON.stringify(mappingResponse.Mapping)).to.include('Name');
                            expect(JSON.stringify(mappingResponse.Mapping)).to.include('Type');
                            //Destination was removed and moved to another object in 15/12/2020 - it was decided with Chasky and Oleg to not test the object,
                            //The test continue from this point as a Black Box test, where the result will only be tested for their functionality,
                            //But in case of bugs it will be hardr to find what went wrong in the process of import and export.
                            //expect(JSON.stringify(mappingResponse.Mapping)).to.include('Destination');
                        });
                    }
                }
            });
        });

        describe('Black Box Scenarios', () => {
            describe('Import and Export ATD Scenarios', () => {
                if (isActivitiesTestsBox) {
                    for (let index = 0; index < activitiesTypeArr.length; index++) {
                        if (index > 5) {
                            index = 999;
                            break;
                        }
                        const activityName = activitiesTypeArr[index];
                        const originalATDID = activitiesTypeArr[activitiesTypeArr[index]];
                        let existingATDID;
                        let newATDID;
                        let originalATDExportResponse;
                        let existingATDExportResponse;
                        let newATDExportResponse;
                        let originalATDExportObj;
                        let existingATDExportObj;
                        let newATDExportObj;
                        let testDataExistingActivityATD;
                        let isNewATD = false;
                        describe(`Import and Export ${activityName} ATD`, () => {
                            it(`Activity: ${activityName} copy to existing ATD`, async () => {
                                originalATDExportResponse = await importExportATDService.exportATD(
                                    'activities',
                                    originalATDID,
                                );
                                console.log({ TestData_Activity_Original_ATD_Export: originalATDExportResponse });

                                expect(originalATDExportResponse)
                                    .to.have.property('URL')
                                    .that.contain('https://')
                                    .and.contain('cdn.')
                                    .and.contain('/TemporaryFiles/');

                                originalATDExportObj = await fetch(originalATDExportResponse.URL).then((response) =>
                                    response.json(),
                                );

                                testDataExistingActivityATD = await importExportATDService.postActivitiesATD(
                                    testDataATD(
                                        Math.floor(Math.random() * 10000000).toString() +
                                            ' ' +
                                            Math.random().toString(36).substring(10),
                                        `Copy of ${activityName} Override`,
                                    ),
                                );
                                console.log({ TestData_Activity_Existing_ATD: testDataExistingActivityATD });

                                existingATDID = testDataExistingActivityATD.InternalID;
                                await expect(
                                    importExportATDService.importATD(
                                        'activities',
                                        existingATDID,
                                        originalATDExportResponse,
                                    ),
                                )
                                    .eventually.to.have.property('status')
                                    .that.is.a('Number')
                                    .that.equals(200);
                            });

                            it(`Activity: ${activityName} export from existing ATD`, async () => {
                                existingATDExportResponse = await importExportATDService.exportATD(
                                    'activities',
                                    existingATDID,
                                );
                                console.log({
                                    TestData_Activity_Existing_ATD_Export_Response: existingATDExportResponse,
                                });

                                expect(existingATDExportResponse)
                                    .to.have.property('URL')
                                    .that.contain('https://')
                                    .and.contain('cdn.')
                                    .and.contain('/TemporaryFiles/');

                                existingATDExportObj = await fetch(existingATDExportResponse.URL).then((response) =>
                                    response.json(),
                                );
                            });

                            it(`Activity: ${activityName} copy to new ATD`, async () => {
                                await expect(
                                    importExportATDService.importToNewATD('activities', originalATDExportResponse),
                                )
                                    .eventually.to.have.property('status')
                                    .that.is.a('Number')
                                    .that.equals(200);

                                isNewATD = true;
                            });

                            let testDataRenameATD;
                            it('Rename new ATD', async () => {
                                if (isNewATD) {
                                    const testDataNewActivityATDNewCopy = await importExportATDService
                                        .getAllActivitiesATD()
                                        .then((responseArray) => responseArray.slice(-1).pop());

                                    testDataRenameATD = await importExportATDService.postActivitiesATD({
                                        InternalID: testDataNewActivityATDNewCopy.InternalID,
                                        ExternalID: `Test ATD ${
                                            Math.floor(Math.random() * 10000000).toString() +
                                            ' ' +
                                            Math.random().toString(36).substring(10)
                                        }`,
                                        Description: testDataNewActivityATDNewCopy.Description.replace(
                                            'Override',
                                            'New',
                                        ),
                                    });
                                    newATDID = testDataRenameATD.InternalID;
                                    expect(testDataRenameATD).to.have.property('ExternalID').to.contains('Test ATD ');
                                } else {
                                    expect(isNewATD).to.be.true;
                                }
                            });

                            it(`Activity: ${activityName} export from new ATD`, async () => {
                                if (isNewATD) {
                                    newATDExportResponse = await importExportATDService.exportATD(
                                        'activities',
                                        newATDID,
                                    );
                                    console.log({ TestData_Activity_New_ATD_Export_Response: newATDExportResponse });

                                    expect(newATDExportResponse)
                                        .to.have.property('URL')
                                        .that.contain('https://')
                                        .and.contain('cdn.')
                                        .and.contain('/TemporaryFiles/');

                                    newATDExportObj = await fetch(newATDExportResponse.URL).then((response) =>
                                        response.json(),
                                    );
                                } else {
                                    expect(isNewATD).to.be.true;
                                }
                            });

                            it(`Deleted the new ATD`, async () => {
                                if (isNewATD) {
                                    testDataRenameATD = await importExportATDService.postActivitiesATD({
                                        InternalID: newATDID,
                                        ExternalID: testDataRenameATD.ExternalID,
                                        Description: testDataRenameATD.Description,
                                        Hidden: true,
                                    });

                                    expect(testDataRenameATD).to.have.property('Hidden').a('boolean').that.is.true;
                                    expect(testDataRenameATD).to.have.property('ExternalID').to.contains('Test ATD ');
                                } else {
                                    expect(isNewATD).to.be.true;
                                }
                            });

                            const ATDArr = [] as any;
                            it(`Activity: ${activityName} Validate Path Creation (DI-17423, DI-17416)`, async () => {
                                //Validate known bugs: 17423 17416
                                ATDArr.push(originalATDExportObj);
                                ATDArr.push(existingATDExportObj);
                                if (isNewATD) {
                                    ATDArr.push(newATDExportObj);
                                }

                                for (let j = 0; j < ATDArr.length; j++) {
                                    const referencesArr = ATDArr[j].References;
                                    for (let i = 0; i < referencesArr.length; i++) {
                                        const reference = referencesArr[i];
                                        if (reference.Type == 'file_storage') {
                                            //console.log({ reference: reference });
                                            expect(reference)
                                                .to.have.property('Path')
                                                .that.contain('https://')
                                                .and.contain('cdn.')
                                                .and.contain('.pepperi.');
                                        }
                                    }
                                }
                            });

                            it(`Activity: ${activityName}, Exported Objects Match`, async () => {
                                const regexStr = new RegExp(`"Name":"${activityName}"`, 'g');
                                const regexStrForCopy = new RegExp(
                                    `"Name":"${testDataExistingActivityATD.ExternalID}"`,
                                    'g',
                                );
                                const regexStrForNewCopy = new RegExp(`"Name":"${testDataRenameATD.ExternalID}"`, 'g');

                                delete originalATDExportObj.ExternalID;
                                delete originalATDExportObj.Description;
                                delete originalATDExportObj.CreationDateTime;
                                delete originalATDExportObj.ModificationDateTime;
                                for (let index = 0; index < originalATDExportObj.Fields.length; index++) {
                                    delete originalATDExportObj.Fields[index].CreationDateTime;
                                    delete originalATDExportObj.Fields[index].ModificationDateTime;
                                    delete originalATDExportObj.Fields[index].CSVMappedColumnName;
                                    if (
                                        originalATDExportObj.Fields[index].UserDefinedTableSource &&
                                        originalATDExportObj.Fields[index].UserDefinedTableSource.SecondaryKey
                                    ) {
                                        delete originalATDExportObj.Fields[index].UserDefinedTableSource.SecondaryKey;
                                    }
                                    if (originalATDExportObj.Fields[index].Type == 'Boolean') {
                                        delete originalATDExportObj.Fields[index].TypeSpecificFields;
                                    }
                                }
                                for (let index = 0; index < originalATDExportObj.DataViews.length; index++) {
                                    delete originalATDExportObj.DataViews[index].CreationDateTime;
                                    delete originalATDExportObj.DataViews[index].ModificationDateTime;
                                }
                                delete existingATDExportObj.ExternalID;
                                delete existingATDExportObj.Description;
                                delete existingATDExportObj.CreationDateTime;
                                delete existingATDExportObj.ModificationDateTime;
                                for (let index = 0; index < existingATDExportObj.Fields.length; index++) {
                                    delete existingATDExportObj.Fields[index].CreationDateTime;
                                    delete existingATDExportObj.Fields[index].ModificationDateTime;
                                    delete existingATDExportObj.Fields[index].CSVMappedColumnName;
                                    if (
                                        existingATDExportObj.Fields[index].UserDefinedTableSource &&
                                        existingATDExportObj.Fields[index].UserDefinedTableSource.SecondaryKey
                                    ) {
                                        delete existingATDExportObj.Fields[index].UserDefinedTableSource.SecondaryKey;
                                    }
                                    if (existingATDExportObj.Fields[index].Type == 'Boolean') {
                                        delete existingATDExportObj.Fields[index].TypeSpecificFields;
                                    }
                                }
                                for (let index = 0; index < existingATDExportObj.DataViews.length; index++) {
                                    delete existingATDExportObj.DataViews[index].CreationDateTime;
                                    delete existingATDExportObj.DataViews[index].ModificationDateTime;
                                }
                                if (isNewATD) {
                                    delete newATDExportObj.ExternalID;
                                    delete newATDExportObj.Description;
                                    delete newATDExportObj.CreationDateTime;
                                    delete newATDExportObj.ModificationDateTime;
                                    for (let index = 0; index < newATDExportObj.Fields.length; index++) {
                                        delete newATDExportObj.Fields[index].CreationDateTime;
                                        delete newATDExportObj.Fields[index].ModificationDateTime;
                                        delete newATDExportObj.Fields[index].CSVMappedColumnName;
                                        if (
                                            newATDExportObj.Fields[index].UserDefinedTableSource &&
                                            newATDExportObj.Fields[index].UserDefinedTableSource.SecondaryKey
                                        ) {
                                            delete newATDExportObj.Fields[index].UserDefinedTableSource.SecondaryKey;
                                        }
                                        if (newATDExportObj.Fields[index].Type == 'Boolean') {
                                            delete newATDExportObj.Fields[index].TypeSpecificFields;
                                        }
                                    }
                                    for (let index = 0; index < newATDExportObj.DataViews.length; index++) {
                                        delete newATDExportObj.DataViews[index].CreationDateTime;
                                        delete newATDExportObj.DataViews[index].ModificationDateTime;
                                    }
                                }

                                existingATDExportObj = JSON.parse(
                                    JSON.stringify(existingATDExportObj)
                                        .replace(regexStrForCopy, '"Name":"test"')
                                        .replace(/\s/g, ''),
                                );
                                originalATDExportObj = JSON.parse(
                                    JSON.stringify(originalATDExportObj)
                                        .replace(regexStr, '"Name":"test"')
                                        .replace(/\s/g, ''),
                                );

                                if (isNewATD) {
                                    newATDExportObj = JSON.parse(
                                        JSON.stringify(newATDExportObj)
                                            .replace(regexStrForNewCopy, '"Name":"test"')
                                            .replace(/\s/g, ''),
                                    );
                                }

                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj).length -
                                            JSON.stringify(originalATDExportObj).length,
                                    ) > 10 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.DataViews).length -
                                            JSON.stringify(originalATDExportObj.DataViews).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Fields).length -
                                            JSON.stringify(originalATDExportObj.Fields).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.References).length -
                                            JSON.stringify(originalATDExportObj.References).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Workflow).length -
                                            JSON.stringify(originalATDExportObj.Workflow).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Settings).length -
                                            JSON.stringify(originalATDExportObj.Settings).length,
                                    ) > 2 ||
                                    originalATDExportObj.Fields.length == 0 ||
                                    originalATDExportObj.DataViews.length == 0 ||
                                    originalATDExportObj.References.length == 0 ||
                                    originalATDExportObj.Workflow.length == 0 ||
                                    originalATDExportObj.Settings.length == 0
                                ) {
                                    expect(
                                        `Origin ATD length ${
                                            JSON.stringify(originalATDExportObj).length
                                        }, Copy to existing ATD length ${
                                            JSON.stringify(existingATDExportObj).length
                                        }, Created new ATD length ${
                                            JSON.stringify(newATDExportObj).length
                                        }, Origin ATD Export URL was: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=activities&subtype=${originalATDID}, New ATD Export URL was: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=activities&subtype=${existingATDID},  The Origin ATD Response was: ${
                                            originalATDExportResponse.URL
                                        },  The copy to existing ATD Response was: ${
                                            existingATDExportResponse.URL
                                        }, The copy to new ATD Response was: ${newATDExportResponse.URL}.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj).length -
                                                JSON.stringify(originalATDExportObj).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });

                            it(`Activity: ${activityName}, Exported DataViews Match`, async () => {
                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.DataViews).length -
                                            JSON.stringify(originalATDExportObj.DataViews).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.DataViews).length -
                                            JSON.stringify(newATDExportObj.DataViews).length,
                                    ) > 2 ||
                                    originalATDExportObj.DataViews.length == 0
                                ) {
                                    expect(
                                        `Origin DataViews length ${
                                            JSON.stringify(originalATDExportObj.DataViews).length
                                        }, Copy to existing DataViews length ${
                                            JSON.stringify(existingATDExportObj.DataViews).length
                                        }, Created new DataViews length ${
                                            JSON.stringify(newATDExportObj.DataViews).length
                                        }.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.DataViews).length -
                                                JSON.stringify(originalATDExportObj.DataViews).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });

                            it(`Activity: ${activityName}, Exported Fields Match`, async () => {
                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Fields).length -
                                            JSON.stringify(originalATDExportObj.Fields).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Fields).length -
                                            JSON.stringify(newATDExportObj.Fields).length,
                                    ) > 2 ||
                                    originalATDExportObj.Fields.length == 0
                                ) {
                                    expect(
                                        `Origin Fields length ${
                                            JSON.stringify(originalATDExportObj.Fields).length
                                        }, Copy to existing Fields length ${
                                            JSON.stringify(existingATDExportObj.Fields).length
                                        }, Created new Fields length ${JSON.stringify(newATDExportObj.Fields).length}.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.Fields).length -
                                                JSON.stringify(originalATDExportObj.Fields).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });

                            it(`Activity: ${activityName}, Exported References Match`, async () => {
                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.References).length -
                                            JSON.stringify(originalATDExportObj.References).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.References).length -
                                            JSON.stringify(newATDExportObj.References).length,
                                    ) > 2 ||
                                    originalATDExportObj.References.length == 0
                                ) {
                                    expect(
                                        `Origin References length ${
                                            JSON.stringify(originalATDExportObj.References).length
                                        }, Copy to existing References length ${
                                            JSON.stringify(existingATDExportObj.References).length
                                        }, Created new References length ${
                                            JSON.stringify(newATDExportObj.References).length
                                        }.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.References).length -
                                                JSON.stringify(originalATDExportObj.References).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });

                            it(`Activity: ${activityName}, Exported Workflow Match`, async () => {
                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Workflow).length -
                                            JSON.stringify(originalATDExportObj.Workflow).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Workflow).length -
                                            JSON.stringify(newATDExportObj.Workflow).length,
                                    ) > 2 ||
                                    originalATDExportObj.Workflow.length == 0
                                ) {
                                    expect(
                                        `Origin Workflow length ${
                                            JSON.stringify(originalATDExportObj.Workflow).length
                                        }, Copy to existing Workflow length ${
                                            JSON.stringify(existingATDExportObj.Workflow).length
                                        }, Created new Workflow length ${
                                            JSON.stringify(newATDExportObj.Workflow).length
                                        }.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.Workflow).length -
                                                JSON.stringify(originalATDExportObj.Workflow).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });

                            it(`Activity: ${activityName}, Exported Settings Match`, async () => {
                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Settings).length -
                                            JSON.stringify(originalATDExportObj.Settings).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Settings).length -
                                            JSON.stringify(newATDExportObj.Settings).length,
                                    ) > 2 ||
                                    originalATDExportObj.Settings.length == 0
                                ) {
                                    expect(
                                        `Origin Settings length ${
                                            JSON.stringify(originalATDExportObj.Settings).length
                                        }, Copy to Settings DataViews length ${
                                            JSON.stringify(existingATDExportObj.Settings).length
                                        }, Created new Settings length ${
                                            JSON.stringify(newATDExportObj.Settings).length
                                        }.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.Settings).length -
                                                JSON.stringify(originalATDExportObj.Settings).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });
                        });
                    }
                }

                if (isTransactionsTestsBox) {
                    for (let index = 1; index < transactionsTypeArr.length; index++) {
                        if (index > 5) {
                            index = 999;
                            break;
                        }
                        const transactionName = transactionsTypeArr[index];
                        const originalATDID = transactionsTypeArr[transactionsTypeArr[index]];
                        let existingATDID;
                        let newATDID;
                        let originalATDExportResponse;
                        let existingATDExportResponse;
                        let newATDExportResponse;
                        let originalATDExportObj;
                        let existingATDExportObj;
                        let newATDExportObj;
                        let testDataExistingTransactionATD;
                        let isNewATD = false;
                        describe(`Import and Export ${transactionName} ATD`, () => {
                            it(`Transaction: ${transactionName} copy to existing ATD`, async () => {
                                originalATDExportResponse = await importExportATDService.exportATD(
                                    'transactions',
                                    originalATDID,
                                );
                                console.log({ TestData_Transaction_Original_ATD_Export: originalATDExportResponse });

                                expect(originalATDExportResponse)
                                    .to.have.property('URL')
                                    .that.contain('https://')
                                    .and.contain('cdn.')
                                    .and.contain('/TemporaryFiles/');

                                originalATDExportObj = await fetch(originalATDExportResponse.URL).then((response) =>
                                    response.json(),
                                );

                                testDataExistingTransactionATD = await importExportATDService.postTransactionsATD(
                                    testDataATD(
                                        Math.floor(Math.random() * 10000000).toString() +
                                            ' ' +
                                            Math.random().toString(36).substring(10),
                                        `Copy of ${transactionName} Override`,
                                    ),
                                );
                                console.log({ TestData_Transaction_Existing_ATD: testDataExistingTransactionATD });

                                existingATDID = testDataExistingTransactionATD.InternalID;
                                await expect(
                                    importExportATDService.importATD(
                                        'transactions',
                                        existingATDID,
                                        originalATDExportResponse,
                                    ),
                                )
                                    .eventually.to.have.property('status')
                                    .that.is.a('Number')
                                    .that.equals(200);
                            });

                            it(`Transaction: ${transactionName} export from existing ATD`, async () => {
                                existingATDExportResponse = await importExportATDService.exportATD(
                                    'transactions',
                                    existingATDID,
                                );
                                console.log({
                                    TestData_Transaction_Existing_ATD_Export_Response: existingATDExportResponse,
                                });

                                expect(existingATDExportResponse)
                                    .to.have.property('URL')
                                    .that.contain('https://')
                                    .and.contain('cdn.')
                                    .and.contain('/TemporaryFiles/');

                                existingATDExportObj = await fetch(existingATDExportResponse.URL).then((response) =>
                                    response.json(),
                                );
                            });

                            it(`Transaction: ${transactionName} copy to new ATD`, async () => {
                                await expect(
                                    importExportATDService.importToNewATD('transactions', originalATDExportResponse),
                                )
                                    .eventually.to.have.property('status')
                                    .that.is.a('Number')
                                    .that.equals(200);

                                isNewATD = true;
                            });

                            let testDataRenameATD;
                            it('Rename new ATD', async () => {
                                if (isNewATD) {
                                    const testDataNewTransactionATDNewCopy = await importExportATDService
                                        .getAllTransactionsATD()
                                        .then((responseArray) => responseArray.slice(-1).pop());

                                    testDataRenameATD = await importExportATDService.postTransactionsATD({
                                        InternalID: testDataNewTransactionATDNewCopy.InternalID,
                                        ExternalID: `Test ATD ${
                                            Math.floor(Math.random() * 10000000).toString() +
                                            ' ' +
                                            Math.random().toString(36).substring(10)
                                        }`,
                                        Description: testDataNewTransactionATDNewCopy.Description.replace(
                                            'Override',
                                            'New',
                                        ),
                                    });
                                    newATDID = testDataRenameATD.InternalID;
                                    expect(testDataRenameATD).to.have.property('ExternalID').to.contains('Test ATD ');
                                } else {
                                    expect(isNewATD).to.be.true;
                                }
                            });

                            it(`Transaction: ${transactionName} export from new ATD`, async () => {
                                if (isNewATD) {
                                    newATDExportResponse = await importExportATDService.exportATD(
                                        'transactions',
                                        newATDID,
                                    );
                                    console.log({ TestData_Transaction_New_ATD_Export_Response: newATDExportResponse });

                                    expect(newATDExportResponse)
                                        .to.have.property('URL')
                                        .that.contain('https://')
                                        .and.contain('cdn.')
                                        .and.contain('/TemporaryFiles/');

                                    newATDExportObj = await fetch(newATDExportResponse.URL).then((response) =>
                                        response.json(),
                                    );
                                } else {
                                    expect(isNewATD).to.be.true;
                                }
                            });

                            it(`Deleted the new ATD`, async () => {
                                if (isNewATD) {
                                    testDataRenameATD = await importExportATDService.postTransactionsATD({
                                        InternalID: newATDID,
                                        ExternalID: testDataRenameATD.ExternalID,
                                        Description: testDataRenameATD.Description,
                                        Hidden: true,
                                    });

                                    expect(testDataRenameATD).to.have.property('Hidden').a('boolean').that.is.true;
                                    expect(testDataRenameATD).to.have.property('ExternalID').to.contains('Test ATD ');
                                } else {
                                    expect(isNewATD).to.be.true;
                                }
                            });

                            const ATDArr = [] as any;
                            it(`Transaction: ${transactionName} Validate Path Creation (DI-17423, DI-17416)`, async () => {
                                //Validate known bugs: 17423 17416
                                ATDArr.push(originalATDExportObj);
                                ATDArr.push(existingATDExportObj);
                                if (isNewATD) {
                                    ATDArr.push(newATDExportObj);
                                }

                                for (let j = 0; j < ATDArr.length; j++) {
                                    const referencesArr = ATDArr[j].References;
                                    for (let i = 0; i < referencesArr.length; i++) {
                                        const reference = referencesArr[i];
                                        if (reference.Type == 'file_storage') {
                                            //console.log({ reference: reference });
                                            expect(reference)
                                                .to.have.property('Path')
                                                .that.contain('https://')
                                                .and.contain('cdn.')
                                                .and.contain('.pepperi.');
                                        }
                                    }
                                }
                            });

                            it(`Transaction: ${transactionName}, Exported Objects Match`, async () => {
                                const regexStr = new RegExp(`"Name":"${transactionName}"`, 'g');
                                const regexStrForCopy = new RegExp(
                                    `"Name":"${testDataExistingTransactionATD.ExternalID}"`,
                                    'g',
                                );
                                let regexStrForNewCopy;
                                if (isNewATD) {
                                    regexStrForNewCopy = new RegExp(`"Name":"${testDataRenameATD.ExternalID}"`, 'g');
                                }
                                delete originalATDExportObj.ExternalID;
                                delete originalATDExportObj.Description;
                                delete originalATDExportObj.Settings.EPayment;
                                delete originalATDExportObj.Settings.CatalogIDs;
                                delete originalATDExportObj.CreationDateTime;
                                delete originalATDExportObj.ModificationDateTime;
                                for (let index = 0; index < originalATDExportObj.Fields.length; index++) {
                                    delete originalATDExportObj.Fields[index].CreationDateTime;
                                    delete originalATDExportObj.Fields[index].ModificationDateTime;
                                    delete originalATDExportObj.Fields[index].CSVMappedColumnName;
                                    if (
                                        originalATDExportObj.Fields[index].UserDefinedTableSource &&
                                        originalATDExportObj.Fields[index].UserDefinedTableSource.SecondaryKey
                                    ) {
                                        delete originalATDExportObj.Fields[index].UserDefinedTableSource.SecondaryKey;
                                    }
                                    if (originalATDExportObj.Fields[index].Type == 'Boolean') {
                                        delete originalATDExportObj.Fields[index].TypeSpecificFields;
                                    }
                                }
                                for (let index = 0; index < originalATDExportObj.DataViews.length; index++) {
                                    delete originalATDExportObj.DataViews[index].CreationDateTime;
                                    delete originalATDExportObj.DataViews[index].ModificationDateTime;
                                }
                                for (let index = 0; index < originalATDExportObj.LineFields.length; index++) {
                                    delete originalATDExportObj.LineFields[index].CreationDateTime;
                                    delete originalATDExportObj.LineFields[index].ModificationDateTime;
                                }
                                delete existingATDExportObj.ExternalID;
                                delete existingATDExportObj.Description;
                                delete existingATDExportObj.Settings.EPayment;
                                delete existingATDExportObj.Settings.CatalogIDs;
                                delete existingATDExportObj.CreationDateTime;
                                delete existingATDExportObj.ModificationDateTime;
                                for (let index = 0; index < existingATDExportObj.Fields.length; index++) {
                                    delete existingATDExportObj.Fields[index].CreationDateTime;
                                    delete existingATDExportObj.Fields[index].ModificationDateTime;
                                    delete existingATDExportObj.Fields[index].CSVMappedColumnName;
                                    if (
                                        existingATDExportObj.Fields[index].UserDefinedTableSource &&
                                        existingATDExportObj.Fields[index].UserDefinedTableSource.SecondaryKey
                                    ) {
                                        delete existingATDExportObj.Fields[index].UserDefinedTableSource.SecondaryKey;
                                    }
                                    if (existingATDExportObj.Fields[index].Type == 'Boolean') {
                                        delete existingATDExportObj.Fields[index].TypeSpecificFields;
                                    }
                                }
                                for (let index = 0; index < existingATDExportObj.DataViews.length; index++) {
                                    delete existingATDExportObj.DataViews[index].CreationDateTime;
                                    delete existingATDExportObj.DataViews[index].ModificationDateTime;
                                }
                                for (let index = 0; index < existingATDExportObj.LineFields.length; index++) {
                                    delete existingATDExportObj.LineFields[index].CreationDateTime;
                                    delete existingATDExportObj.LineFields[index].ModificationDateTime;
                                }
                                if (isNewATD) {
                                    delete newATDExportObj.ExternalID;
                                    delete newATDExportObj.Description;
                                    delete newATDExportObj.Settings.EPayment;
                                    delete newATDExportObj.Settings.CatalogIDs;
                                    delete newATDExportObj.CreationDateTime;
                                    delete newATDExportObj.ModificationDateTime;
                                    for (let index = 0; index < newATDExportObj.Fields.length; index++) {
                                        delete newATDExportObj.Fields[index].CreationDateTime;
                                        delete newATDExportObj.Fields[index].ModificationDateTime;
                                        delete newATDExportObj.Fields[index].CSVMappedColumnName;
                                        if (
                                            newATDExportObj.Fields[index].UserDefinedTableSource &&
                                            newATDExportObj.Fields[index].UserDefinedTableSource.SecondaryKey
                                        ) {
                                            delete newATDExportObj.Fields[index].UserDefinedTableSource.SecondaryKey;
                                        }
                                        if (newATDExportObj.Fields[index].Type == 'Boolean') {
                                            delete newATDExportObj.Fields[index].TypeSpecificFields;
                                        }
                                    }
                                    for (let index = 0; index < newATDExportObj.DataViews.length; index++) {
                                        delete newATDExportObj.DataViews[index].CreationDateTime;
                                        delete newATDExportObj.DataViews[index].ModificationDateTime;
                                    }
                                    for (let index = 0; index < newATDExportObj.LineFields.length; index++) {
                                        delete newATDExportObj.LineFields[index].CreationDateTime;
                                        delete newATDExportObj.LineFields[index].ModificationDateTime;
                                    }
                                }

                                existingATDExportObj = JSON.parse(
                                    JSON.stringify(existingATDExportObj)
                                        .replace(regexStrForCopy, '"Name":"test"')
                                        .replace(/\s/g, ''),
                                );
                                originalATDExportObj = JSON.parse(
                                    JSON.stringify(originalATDExportObj)
                                        .replace(regexStr, '"Name":"test"')
                                        .replace(/\s/g, ''),
                                );
                                if (isNewATD) {
                                    newATDExportObj = JSON.parse(
                                        JSON.stringify(newATDExportObj)
                                            .replace(regexStrForNewCopy, '"Name":"test"')
                                            .replace(/\s/g, ''),
                                    );
                                }

                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj).length -
                                            JSON.stringify(originalATDExportObj).length,
                                    ) > 10 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.DataViews).length -
                                            JSON.stringify(originalATDExportObj.DataViews).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Fields).length -
                                            JSON.stringify(originalATDExportObj.Fields).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.References).length -
                                            JSON.stringify(originalATDExportObj.References).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Workflow).length -
                                            JSON.stringify(originalATDExportObj.Workflow).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Settings).length -
                                            JSON.stringify(originalATDExportObj.Settings).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.LineFields).length -
                                            JSON.stringify(originalATDExportObj.LineFields).length,
                                    ) > 2 ||
                                    originalATDExportObj.Fields.length == 0 ||
                                    originalATDExportObj.DataViews.length == 0 ||
                                    originalATDExportObj.References.length == 0 ||
                                    originalATDExportObj.Workflow.length == 0 ||
                                    originalATDExportObj.Settings.length == 0 ||
                                    originalATDExportObj.Settings.LineFields == 0
                                ) {
                                    expect(
                                        `Origin ATD length ${
                                            JSON.stringify(originalATDExportObj).length
                                        }, Copy to existing ATD length ${
                                            JSON.stringify(existingATDExportObj).length
                                        }, Created new ATD length ${
                                            JSON.stringify(newATDExportObj).length
                                        }, Origin ATD Export URL was: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=activities&subtype=${originalATDID}, New ATD Export URL was: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=activities&subtype=${existingATDID},  The Origin ATD Response was: ${
                                            originalATDExportResponse.URL
                                        },  The copy to existing ATD Response was: ${
                                            existingATDExportResponse.URL
                                        }, The copy to new ATD Response was: ${newATDExportResponse.URL}.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj).length -
                                                JSON.stringify(originalATDExportObj).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });

                            it(`Transaction: ${transactionName}, Exported DataViews Match`, async () => {
                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.DataViews).length -
                                            JSON.stringify(originalATDExportObj.DataViews).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.DataViews).length -
                                            JSON.stringify(newATDExportObj.DataViews).length,
                                    ) > 2 ||
                                    originalATDExportObj.DataViews.length == 0
                                ) {
                                    expect(
                                        `Origin DataViews length ${
                                            JSON.stringify(originalATDExportObj.DataViews).length
                                        }, Copy to existing DataViews length ${
                                            JSON.stringify(existingATDExportObj.DataViews).length
                                        }, Created new DataViews length ${
                                            JSON.stringify(newATDExportObj.DataViews).length
                                        }.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.DataViews).length -
                                                JSON.stringify(originalATDExportObj.DataViews).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });

                            it(`Transaction: ${transactionName}, Exported Fields Match`, async () => {
                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Fields).length -
                                            JSON.stringify(originalATDExportObj.Fields).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Fields).length -
                                            JSON.stringify(newATDExportObj.Fields).length,
                                    ) > 2 ||
                                    originalATDExportObj.Fields.length == 0
                                ) {
                                    expect(
                                        `Origin Fields length ${
                                            JSON.stringify(originalATDExportObj.Fields).length
                                        }, Copy to existing Fields length ${
                                            JSON.stringify(existingATDExportObj.Fields).length
                                        }, Created new Fields length ${JSON.stringify(newATDExportObj.Fields).length}.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.Fields).length -
                                                JSON.stringify(originalATDExportObj.Fields).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });

                            it(`Transaction: ${transactionName}, Exported References Match`, async () => {
                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.References).length -
                                            JSON.stringify(originalATDExportObj.References).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.References).length -
                                            JSON.stringify(newATDExportObj.References).length,
                                    ) > 2 ||
                                    originalATDExportObj.References.length == 0
                                ) {
                                    expect(
                                        `Origin References length ${
                                            JSON.stringify(originalATDExportObj.References).length
                                        }, Copy to existing References length ${
                                            JSON.stringify(existingATDExportObj.References).length
                                        }, Created new References length ${
                                            JSON.stringify(newATDExportObj.References).length
                                        }.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.References).length -
                                                JSON.stringify(originalATDExportObj.References).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });

                            it(`Transaction: ${transactionName}, Exported Workflow Match`, async () => {
                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Workflow).length -
                                            JSON.stringify(originalATDExportObj.Workflow).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Workflow).length -
                                            JSON.stringify(newATDExportObj.Workflow).length,
                                    ) > 2 ||
                                    originalATDExportObj.Workflow.length == 0
                                ) {
                                    expect(
                                        `Origin Workflow length ${
                                            JSON.stringify(originalATDExportObj.Workflow).length
                                        }, Copy to existing Workflow length ${
                                            JSON.stringify(existingATDExportObj.Workflow).length
                                        }, Created new Workflow length ${
                                            JSON.stringify(newATDExportObj.Workflow).length
                                        }.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.Workflow).length -
                                                JSON.stringify(originalATDExportObj.Workflow).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });

                            it(`Transaction: ${transactionName}, Exported Settings Match`, async () => {
                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Settings).length -
                                            JSON.stringify(originalATDExportObj.Settings).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.Settings).length -
                                            JSON.stringify(newATDExportObj.Settings).length,
                                    ) > 2 ||
                                    originalATDExportObj.Settings.length == 0
                                ) {
                                    expect(
                                        `Origin Settings length ${
                                            JSON.stringify(originalATDExportObj.Settings).length
                                        }, Copy to Settings DataViews length ${
                                            JSON.stringify(existingATDExportObj.Settings).length
                                        }, Created new Settings length ${
                                            JSON.stringify(newATDExportObj.Settings).length
                                        }.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.Settings).length -
                                                JSON.stringify(originalATDExportObj.Settings).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });

                            it(`Transaction: ${transactionName}, Exported LineFields Match`, async () => {
                                if (
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.LineFields).length -
                                            JSON.stringify(originalATDExportObj.LineFields).length,
                                    ) > 2 ||
                                    Math.abs(
                                        JSON.stringify(existingATDExportObj.LineFields).length -
                                            JSON.stringify(newATDExportObj.LineFields).length,
                                    ) > 2 ||
                                    originalATDExportObj.LineFields.length == 0
                                ) {
                                    expect(
                                        `Origin LineFields length ${
                                            JSON.stringify(originalATDExportObj.LineFields).length
                                        }, Copy to LineFields DataViews length ${
                                            JSON.stringify(existingATDExportObj.LineFields).length
                                        }, Created new LineFields length ${
                                            JSON.stringify(newATDExportObj.LineFields).length
                                        }.`,
                                    ).to.be.true;
                                } else {
                                    expect(
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.LineFields).length -
                                                JSON.stringify(originalATDExportObj.LineFields).length,
                                        ),
                                    ).to.be.below(10);
                                }
                            });
                        });
                    }
                }
            });
        });

        describe('Test Clean up', () => {
            it('Make sure an ATD removed in the end of the tests', async () => {
                //Make sure an ATD removed in the end of the tests
                return expect(TestCleanUpATD(importExportATDService)).eventually.to.be.above(0);
            });

            it('Make sure an UDT removed in the end of the tests', async () => {
                //Make sure an ATD removed in the end of the tests
                return expect(TestCleanUpUDT(importExportATDService)).eventually.to.be.above(0);
            });
        });
    });
}

//Remove all Test Data ATD
async function TestCleanUpATD(service: ImportExportATDService) {
    let deletedCounter = 0;
    if (isActivitiesTests || isActivitiesTestsBox) {
        const allActivitiesATDObject: MetaDataATD[] = await service.getAllActivitiesATD();
        for (let index = 0; index < allActivitiesATDObject.length; index++) {
            if (
                allActivitiesATDObject[index].ExternalID?.toString().startsWith('Test ATD ') &&
                Number(allActivitiesATDObject[index].ExternalID?.toString().split(' ')[2].split('.')[0]) > 100
            ) {
                const tempBody: MetaDataATD = {
                    InternalID: allActivitiesATDObject[index].InternalID,
                    ExternalID: allActivitiesATDObject[index].ExternalID,
                    Description: allActivitiesATDObject[index].Description,
                    Hidden: true,
                };
                await service.postActivitiesATD(tempBody);
                deletedCounter++;
            }
        }
    }

    if (isTransactionsTests || isTransactionsTestsBox) {
        const allTransactionsATDObject: MetaDataATD[] = await service.getAllTransactionsATD();
        for (let index = 0; index < allTransactionsATDObject.length; index++) {
            if (
                allTransactionsATDObject[index].ExternalID?.toString().startsWith('Test ATD ') &&
                Number(allTransactionsATDObject[index].ExternalID?.toString().split(' ')[2].split('.')[0]) > 100
            ) {
                const tempBody: MetaDataATD = {
                    InternalID: allTransactionsATDObject[index].InternalID,
                    ExternalID: allTransactionsATDObject[index].ExternalID,
                    Description: allTransactionsATDObject[index].Description,
                    Hidden: true,
                };
                await service.postTransactionsATD(tempBody);
                deletedCounter++;
            }
        }
    }
    return deletedCounter;
}

//Remove all Test Data UDT
async function TestCleanUpUDT(service: ImportExportATDService) {
    const allUDTObject: MetaDataUDT[] = await service.getAllUDT();
    let deletedCounter = 0;
    for (let index = 0; index < allUDTObject.length; index++) {
        if (
            allUDTObject[index].TableID?.toString().startsWith('Test UDT ') &&
            Number(allUDTObject[index].TableID?.toString().split(' ')[2].split('.')[0]) > 100
        ) {
            await service.deleteUDT(allUDTObject[index].TableID);
            deletedCounter++;
        }
    }
    return deletedCounter;
}
