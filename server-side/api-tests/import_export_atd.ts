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

export async function ImportExportATDTests(generalService: GeneralService, request, tester: TesterFunctions) {
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
    //const testDataNewTransactionATDWithoutCrud =
    await importExportATDService.postTransactionsATD(
        testDataATD(
            Math.floor(Math.random() * 10000000).toString() + ' ' + Math.random().toString(36).substring(10),
            'Description of Test ATD',
        ),
    );

    //const testDataNewActivitiesATDWithoutCrud =
    await importExportATDService.postActivitiesATD(
        testDataATD(
            Math.floor(Math.random() * 10000000).toString() + ' ' + Math.random().toString(36).substring(10),
            'Description of Test ATD',
        ),
    );

    //These will go into CRUD tests and can't be use for ImportExport tests
    const testDataNewTransactionATD = await importExportATDService.postTransactionsATD(
        testDataATD(
            Math.floor(Math.random() * 10000000).toString() + ' ' + Math.random().toString(36).substring(10),
            'Description of Test ATD',
        ),
    );

    const testDataNewActivitiesATD = await importExportATDService.postActivitiesATD(
        testDataATD(
            Math.floor(Math.random() * 10000000).toString() + ' ' + Math.random().toString(36).substring(10),
            'Description of Test ATD',
        ),
    );

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
        transactionsTypeArr.push(element.ExternalID);
        transactionsTypeArr[element.ExternalID] = element.TypeID;
    });

    const activitiesArr = await generalService.getTypes('activities');
    activitiesArr.forEach((element) => {
        activitiesTypeArr.push(element.ExternalID);
        activitiesTypeArr[element.ExternalID] = element.TypeID;
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
                        expect(testDataNewTransactionATD).to.have.property('Icon').a('string').that.contains('icon');
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
                        expect(testDataNewTransactionATD).to.have.property('UUID').a('string').that.have.lengthOf(36);
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
                        return expect(importExportATDService.deleteUDT(testDataPostUDT.TableID)).eventually.to.be.false;
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
                        expect(baseATD).to.have.property('MemoryMode').to.have.property('Dormant').a('boolean').that.is
                            .true;
                        expect(baseATD).to.have.property('MemoryMode').to.have.property('Volatile').a('boolean').that.is
                            .false;
                        expect(modifiedATD).to.have.property('MemoryMode').to.have.property('Dormant').a('boolean').that
                            .is.false;
                        expect(modifiedATD).to.have.property('MemoryMode').to.have.property('Volatile').a('boolean')
                            .that.is.false;
                        expect(modifiedATD).to.have.property('MemoryMode').to.not.have.property('sdas');
                    });
                });
            });
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
                for (let index = 0; index < activitiesTypeArr.length - 1; index++) {
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
            });

            describe('Post', () => {
                for (let index = 0; index < transactionsTypeArr.length - 1; index++) {
                    const transactionName = transactionsTypeArr[index];
                    const transactionID = transactionsTypeArr[transactionsTypeArr[index]];
                    it(`Export Mapping Of Transactions ATD ${transactionName}`, async () => {
                        const exportATDResponse = await importExportATDService.exportATD('transactions', transactionID);
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
                        //Destination was removed and moved to another object in 15/12 - it was decided with Chasky and Oleg to not test the object,
                        //The test continue from this point as a Black Box test, where the result will only be tested for their functionality,
                        //But in case of bugs it will be hardr to find what went wrong in the process of import and export.
                        //expect(JSON.stringify(mappingResponse.Mapping)).to.include('Destination');
                    });
                }

                for (let index = 0; index < activitiesTypeArr.length - 1; index++) {
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
                        //Destination was removed and moved to another object in 15/12 - it was decided with Chasky and Oleg to not test the object,
                        //The test continue from this point as a Black Box test, where the result will only be tested for their functionality,
                        //But in case of bugs it will be hardr to find what went wrong in the process of import and export.
                        //expect(JSON.stringify(mappingResponse.Mapping)).to.include('Destination');
                    });
                }
            });
        });

        describe('Black Box Scenarios', () => {
            describe('Import and Export ATD', () => {
                for (let index = 0; index < transactionsTypeArr.length - 1; index++) {
                    const transactionName = transactionsTypeArr[index];
                    const transactionID = transactionsTypeArr[transactionsTypeArr[index]];
                    it(`Transaction: ${transactionName}`, async () => {
                        const testDataExportATDToCopyResponse = await importExportATDService.exportATD(
                            'transactions',
                            transactionID,
                        );
                        console.log({ TestData_Transactions_ExportATDToCopyResponse: testDataExportATDToCopyResponse });

                        expect(testDataExportATDToCopyResponse)
                            .to.have.property('URL')
                            .that.contain('https://')
                            .and.contain('cdn.')
                            .and.contain('/TemporaryFiles/');

                        let exportATDObject = await fetch(testDataExportATDToCopyResponse.URL).then((response) =>
                            response.json(),
                        );

                        // console.log({ exportATDObject: exportATDObject });
                        // console.log({ Fields: exportATDObject.Fields });
                        // console.log({ Workflow: exportATDObject.Workflow });
                        // console.log({ References: exportATDObject.References });
                        // console.log({ DataViews: exportATDObject.DataViews });
                        // console.log({ LineFields: exportATDObject.LineFields });
                        // console.log({ Settings: exportATDObject.Settings });

                        const testDataNewTransactionATDCopy = await importExportATDService.postTransactionsATD(
                            testDataATD(
                                Math.floor(Math.random() * 10000000).toString() +
                                    ' ' +
                                    Math.random().toString(36).substring(10),
                                `Copy of ${transactionName} Override`,
                            ),
                        );
                        console.log({ TestData_Transactions_DataNewTransactionATDCopy: testDataNewTransactionATDCopy });

                        await expect(
                            importExportATDService.importATD(
                                'transactions',
                                testDataNewTransactionATDCopy.InternalID,
                                testDataExportATDToCopyResponse,
                            ),
                        ).eventually.to.contains('success');

                        const copyExportATDResponse = await importExportATDService.exportATD(
                            'transactions',
                            testDataNewTransactionATDCopy.InternalID,
                        );
                        console.log({ TestData_Transactions_copyExportATDResponse: copyExportATDResponse });

                        expect(copyExportATDResponse)
                            .to.have.property('URL')
                            .that.contain('https://')
                            .and.contain('cdn.')
                            .and.contain('/TemporaryFiles/');

                        let copyExportATDObject = await fetch(copyExportATDResponse.URL).then((response) =>
                            response.json(),
                        );

                        // console.log({ copyExportATDObject: copyExportATDObject });
                        // console.log({ Fields: copyExportATDObject.Fields });
                        // console.log({ Workflow: copyExportATDObject.Workflow });
                        // console.log({ References: copyExportATDObject.References });
                        // console.log({ DataViews: copyExportATDObject.DataViews });
                        // console.log({ LineFields: copyExportATDObject.LineFields });
                        // console.log({ Settings: copyExportATDObject.Settings });

                        const testDataNewTransactionATDNewCopy = await importExportATDService
                            .getAllTransactionsATD()
                            .then((responseArray) => responseArray.slice(-1).pop());

                        let testDataRenameATD = await importExportATDService.postTransactionsATD({
                            InternalID: testDataNewTransactionATDNewCopy.InternalID,
                            ExternalID: `Test ATD ${
                                Math.floor(Math.random() * 10000000).toString() +
                                ' ' +
                                Math.random().toString(36).substring(10)
                            }`,
                            Description: testDataNewTransactionATDNewCopy.Description.replace('Override', 'New'),
                        });

                        const newCopyExportATDResponse = await importExportATDService.exportATD(
                            'transactions',
                            testDataRenameATD.InternalID,
                        );
                        console.log({ TestData_Transaction_newCopyExportATDResponse: newCopyExportATDResponse });

                        testDataRenameATD = await importExportATDService.postTransactionsATD({
                            InternalID: testDataRenameATD.InternalID,
                            ExternalID: testDataRenameATD.ExternalID,
                            Description: testDataRenameATD.Description,
                            Hidden: true,
                        });

                        expect(testDataRenameATD).to.have.property('Hidden').a('boolean').that.is.true;
                        expect(testDataRenameATD).to.have.property('ExternalID').to.contains('Test ATD ');

                        expect(newCopyExportATDResponse)
                            .to.have.property('URL')
                            .that.contain('https://')
                            .and.contain('cdn.')
                            .and.contain('/TemporaryFiles/');

                        let newCopyExportATDObject = await fetch(newCopyExportATDResponse.URL).then((response) =>
                            response.json(),
                        );

                        const regexStr = new RegExp(`"Name":"${transactionName}"`, 'g');
                        const regexStrForCopy = new RegExp(`"Name":"${testDataNewTransactionATDCopy.ExternalID}"`, 'g');
                        const regexStrForNewCopy = new RegExp(`"Name":"${testDataRenameATD.ExternalID}"`, 'g');

                        delete copyExportATDObject.ExternalID;
                        delete copyExportATDObject.Description;
                        delete copyExportATDObject.Settings.EPayment;
                        delete copyExportATDObject.Settings.CatalogIDs;
                        for (let index = 0; index < copyExportATDObject.Fields.length; index++) {
                            delete copyExportATDObject.Fields[index].CreationDateTime;
                            delete copyExportATDObject.Fields[index].ModificationDateTime;
                            delete copyExportATDObject.Fields[index].CSVMappedColumnName;
                            if (
                                copyExportATDObject.Fields[index].UserDefinedTableSource &&
                                copyExportATDObject.Fields[index].UserDefinedTableSource.SecondaryKey
                            )
                                delete copyExportATDObject.Fields[index].UserDefinedTableSource.SecondaryKey;
                        }
                        for (let index = 0; index < copyExportATDObject.DataViews.length; index++) {
                            delete copyExportATDObject.DataViews[index].CreationDateTime;
                            delete copyExportATDObject.DataViews[index].ModificationDateTime;
                        }
                        delete exportATDObject.ExternalID;
                        delete exportATDObject.Description;
                        delete exportATDObject.Settings.EPayment;
                        delete exportATDObject.Settings.CatalogIDs;
                        for (let index = 0; index < exportATDObject.Fields.length; index++) {
                            delete exportATDObject.Fields[index].CreationDateTime;
                            delete exportATDObject.Fields[index].ModificationDateTime;
                            delete exportATDObject.Fields[index].CSVMappedColumnName;
                            if (
                                exportATDObject.Fields[index].UserDefinedTableSource &&
                                copyExportATDObject.Fields[index].UserDefinedTableSource.SecondaryKey
                            )
                                delete exportATDObject.Fields[index].UserDefinedTableSource.SecondaryKey;
                        }
                        for (let index = 0; index < exportATDObject.DataViews.length; index++) {
                            delete exportATDObject.DataViews[index].CreationDateTime;
                            delete exportATDObject.DataViews[index].ModificationDateTime;
                        }
                        delete newCopyExportATDObject.ExternalID;
                        delete newCopyExportATDObject.Description;
                        delete newCopyExportATDObject.Settings.EPayment;
                        delete newCopyExportATDObject.Settings.CatalogIDs;
                        for (let index = 0; index < newCopyExportATDObject.Fields.length; index++) {
                            delete newCopyExportATDObject.Fields[index].CreationDateTime;
                            delete newCopyExportATDObject.Fields[index].ModificationDateTime;
                            delete newCopyExportATDObject.Fields[index].CSVMappedColumnName;
                            if (
                                copyExportATDObject.Fields[index].UserDefinedTableSource &&
                                copyExportATDObject.Fields[index].UserDefinedTableSource.SecondaryKey
                            )
                                delete copyExportATDObject.Fields[index].UserDefinedTableSource.SecondaryKey;
                        }
                        for (let index = 0; index < newCopyExportATDObject.DataViews.length; index++) {
                            delete newCopyExportATDObject.DataViews[index].CreationDateTime;
                            delete newCopyExportATDObject.DataViews[index].ModificationDateTime;
                        }

                        copyExportATDObject = JSON.parse(
                            JSON.stringify(copyExportATDObject)
                                .replace(regexStrForCopy, '"Name":"test"')
                                .replace(/\s/g, ''),
                        );
                        exportATDObject = JSON.parse(
                            JSON.stringify(exportATDObject).replace(regexStr, '"Name":"test"').replace(/\s/g, ''),
                        );
                        newCopyExportATDObject = JSON.parse(
                            JSON.stringify(newCopyExportATDObject)
                                .replace(regexStrForNewCopy, '"Name":"test"')
                                .replace(/\s/g, ''),
                        );

                        if (
                            Math.abs(
                                JSON.stringify(copyExportATDObject).length - JSON.stringify(exportATDObject).length,
                            ) > 10 ||
                            Math.abs(
                                JSON.stringify(copyExportATDObject.DataViews).length -
                                    JSON.stringify(exportATDObject.DataViews).length,
                            ) > 2 ||
                            Math.abs(
                                JSON.stringify(copyExportATDObject.Fields).length -
                                    JSON.stringify(exportATDObject.Fields).length,
                            ) > 2 ||
                            Math.abs(
                                JSON.stringify(newCopyExportATDObject).length -
                                    JSON.stringify(copyExportATDObject).length,
                            ) > 0 ||
                            exportATDObject.Fields.length == 0 ||
                            copyExportATDObject.Fields.length == 0 ||
                            exportATDObject.DataViews.length == 0 ||
                            copyExportATDObject.DataViews.length == 0
                        ) {
                            // console.log({ copyExportATDObject: copyExportATDObject });
                            // console.log({ exportATDObject: exportATDObject });

                            expect(
                                `The length of the new ATD override witout the ExternalID is ${
                                    JSON.stringify(copyExportATDObject).length
                                }, the length of the new ATD copy witout the ExternalID is ${
                                    JSON.stringify(newCopyExportATDObject).length
                                }, expected to be in length of ${
                                    JSON.stringify(exportATDObject).length
                                }, but the difference in length is: ${Math.abs(
                                    JSON.stringify(copyExportATDObject).length - JSON.stringify(exportATDObject).length,
                                )}, Existing ATD Export URL was: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=activities&subtype=${transactionID}, and the Export Response was: ${
                                    testDataExportATDToCopyResponse.URL
                                }, New ATD Export override URL was: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=activities&subtype=${
                                    testDataNewTransactionATDCopy.InternalID
                                }, and the Export Response was: ${copyExportATDResponse.URL}, Existing had: ${
                                    exportATDObject.DataViews.length
                                } DataViews in total length of: ${JSON.stringify(exportATDObject.DataViews).length},  ${
                                    exportATDObject.Fields.length
                                } Fields in total length of: ${JSON.stringify(exportATDObject.Fields).length}, ${
                                    exportATDObject.References.length
                                } References in total length of: ${
                                    JSON.stringify(exportATDObject.References).length
                                }, and Workflow in length of: ${
                                    JSON.stringify(exportATDObject.Workflow).length
                                } New had: ${copyExportATDObject.DataViews.length} DataViews in total length of: ${
                                    JSON.stringify(copyExportATDObject.DataViews).length
                                },  ${copyExportATDObject.Fields.length} Fields in total length of: ${
                                    JSON.stringify(copyExportATDObject.Fields).length
                                }, ${copyExportATDObject.References.length} References in total length of: ${
                                    JSON.stringify(copyExportATDObject.References).length
                                }, and Workflow in length of: ${
                                    JSON.stringify(copyExportATDObject.Workflow).length
                                }, the copy to new ATD Response was: ${newCopyExportATDResponse.URL}`,
                            ).to.be.true;
                        } else {
                            expect(
                                Math.abs(
                                    JSON.stringify(copyExportATDObject).length - JSON.stringify(exportATDObject).length,
                                ),
                            ).to.be.below(10);
                        }
                    });
                }

                for (let index = 0; index < activitiesTypeArr.length - 1; index++) {
                    const activityName = activitiesTypeArr[index];
                    const activityID = activitiesTypeArr[activitiesTypeArr[index]];
                    it(`Activity: ${activityName}`, async () => {
                        const testDataExportATDToCopyResponse = await importExportATDService.exportATD(
                            'activities',
                            activityID,
                        );
                        console.log({ TestData_Activity_ExportATDToCopyResponse: testDataExportATDToCopyResponse });

                        expect(testDataExportATDToCopyResponse)
                            .to.have.property('URL')
                            .that.contain('https://')
                            .and.contain('cdn.')
                            .and.contain('/TemporaryFiles/');

                        let exportATDObject = await fetch(testDataExportATDToCopyResponse.URL).then((response) =>
                            response.json(),
                        );

                        // console.log({ exportATDObject: exportATDObject });
                        // console.log({ Fields: exportATDObject.Fields });
                        // console.log({ Workflow: exportATDObject.Workflow });
                        // console.log({ References: exportATDObject.References });
                        // console.log({ DataViews: exportATDObject.DataViews });
                        // console.log({ LineFields: exportATDObject.LineFields });
                        // console.log({ Settings: exportATDObject.Settings });

                        const testDataNewActivityATDCopy = await importExportATDService.postActivitiesATD(
                            testDataATD(
                                Math.floor(Math.random() * 10000000).toString() +
                                    ' ' +
                                    Math.random().toString(36).substring(10),
                                `Copy of ${activityName} Override`,
                            ),
                        );
                        console.log({ TestData_Activity_NewActivityATDCopy: testDataNewActivityATDCopy });

                        await expect(
                            importExportATDService.importATD(
                                'activities',
                                testDataNewActivityATDCopy.InternalID,
                                testDataExportATDToCopyResponse,
                            ),
                        ).eventually.to.contains('success');

                        const copyExportATDResponse = await importExportATDService.exportATD(
                            'activities',
                            testDataNewActivityATDCopy.InternalID,
                        );
                        console.log({ TestData_Activity_copyExportATDResponse: copyExportATDResponse });

                        expect(copyExportATDResponse)
                            .to.have.property('URL')
                            .that.contain('https://')
                            .and.contain('cdn.')
                            .and.contain('/TemporaryFiles/');

                        let copyExportATDObject = await fetch(copyExportATDResponse.URL).then((response) =>
                            response.json(),
                        );

                        // console.log({ copyExportATDObject: copyExportATDObject });
                        // console.log({ Fields: copyExportATDObject.Fields });
                        // console.log({ Workflow: copyExportATDObject.Workflow });
                        // console.log({ References: copyExportATDObject.References });
                        // console.log({ DataViews: copyExportATDObject.DataViews });
                        // console.log({ LineFields: copyExportATDObject.LineFields });
                        // console.log({ Settings: copyExportATDObject.Settings });

                        await expect(
                            importExportATDService.importToNewATD('activities', testDataExportATDToCopyResponse),
                        ).eventually.to.contains('success');

                        const testDataNewActivityATDNewCopy = await importExportATDService
                            .getAllActivitiesATD()
                            .then((responseArray) => responseArray.slice(-1).pop());

                        let testDataRenameATD = await importExportATDService.postActivitiesATD({
                            InternalID: testDataNewActivityATDNewCopy.InternalID,
                            ExternalID: `Test ATD ${
                                Math.floor(Math.random() * 10000000).toString() +
                                ' ' +
                                Math.random().toString(36).substring(10)
                            }`,
                            Description: testDataNewActivityATDNewCopy.Description.replace('Override', 'New'),
                        });

                        const newCopyExportATDResponse = await importExportATDService.exportATD(
                            'activities',
                            testDataRenameATD.InternalID,
                        );
                        console.log({ TestData_Activity_newCopyExportATDResponse: newCopyExportATDResponse });

                        testDataRenameATD = await importExportATDService.postActivitiesATD({
                            InternalID: testDataRenameATD.InternalID,
                            ExternalID: testDataRenameATD.ExternalID,
                            Description: testDataRenameATD.Description,
                            Hidden: true,
                        });

                        expect(testDataRenameATD).to.have.property('Hidden').a('boolean').that.is.true;
                        expect(testDataRenameATD).to.have.property('ExternalID').to.contains('Test ATD ');

                        expect(newCopyExportATDResponse)
                            .to.have.property('URL')
                            .that.contain('https://')
                            .and.contain('cdn.')
                            .and.contain('/TemporaryFiles/');

                        let newCopyExportATDObject = await fetch(newCopyExportATDResponse.URL).then((response) =>
                            response.json(),
                        );

                        const regexStr = new RegExp(`"Name":"${activityName}"`, 'g');
                        const regexStrForCopy = new RegExp(`"Name":"${testDataNewActivityATDCopy.ExternalID}"`, 'g');
                        const regexStrForNewCopy = new RegExp(`"Name":"${testDataRenameATD.ExternalID}"`, 'g');

                        delete copyExportATDObject.ExternalID;
                        delete copyExportATDObject.Description;
                        for (let index = 0; index < copyExportATDObject.Fields.length; index++) {
                            delete copyExportATDObject.Fields[index].CreationDateTime;
                            delete copyExportATDObject.Fields[index].ModificationDateTime;
                            delete copyExportATDObject.Fields[index].CSVMappedColumnName;
                            if (
                                copyExportATDObject.Fields[index].UserDefinedTableSource &&
                                copyExportATDObject.Fields[index].UserDefinedTableSource.SecondaryKey
                            )
                                delete copyExportATDObject.Fields[index].UserDefinedTableSource.SecondaryKey;
                        }
                        for (let index = 0; index < copyExportATDObject.DataViews.length; index++) {
                            delete copyExportATDObject.DataViews[index].CreationDateTime;
                            delete copyExportATDObject.DataViews[index].ModificationDateTime;
                        }
                        delete exportATDObject.ExternalID;
                        delete exportATDObject.Description;
                        for (let index = 0; index < exportATDObject.Fields.length; index++) {
                            delete exportATDObject.Fields[index].CreationDateTime;
                            delete exportATDObject.Fields[index].ModificationDateTime;
                            delete exportATDObject.Fields[index].CSVMappedColumnName;
                            if (
                                exportATDObject.Fields[index].UserDefinedTableSource &&
                                exportATDObject.Fields[index].UserDefinedTableSource.SecondaryKey
                            )
                                delete exportATDObject.Fields[index].UserDefinedTableSource.SecondaryKey;
                        }
                        for (let index = 0; index < exportATDObject.DataViews.length; index++) {
                            delete exportATDObject.DataViews[index].CreationDateTime;
                            delete exportATDObject.DataViews[index].ModificationDateTime;
                        }
                        delete newCopyExportATDObject.ExternalID;
                        delete newCopyExportATDObject.Description;
                        for (let index = 0; index < newCopyExportATDObject.Fields.length; index++) {
                            delete newCopyExportATDObject.Fields[index].CreationDateTime;
                            delete newCopyExportATDObject.Fields[index].ModificationDateTime;
                            delete newCopyExportATDObject.Fields[index].CSVMappedColumnName;
                            if (
                                newCopyExportATDObject.Fields[index].UserDefinedTableSource &&
                                newCopyExportATDObject.Fields[index].UserDefinedTableSource.SecondaryKey
                            )
                                delete newCopyExportATDObject.Fields[index].UserDefinedTableSource.SecondaryKey;
                        }
                        for (let index = 0; index < newCopyExportATDObject.DataViews.length; index++) {
                            delete newCopyExportATDObject.DataViews[index].CreationDateTime;
                            delete newCopyExportATDObject.DataViews[index].ModificationDateTime;
                        }

                        copyExportATDObject = JSON.parse(
                            JSON.stringify(copyExportATDObject)
                                .replace(regexStrForCopy, '"Name":"test"')
                                .replace(/\s/g, ''),
                        );
                        exportATDObject = JSON.parse(
                            JSON.stringify(exportATDObject).replace(regexStr, '"Name":"test"').replace(/\s/g, ''),
                        );
                        newCopyExportATDObject = JSON.parse(
                            JSON.stringify(newCopyExportATDObject)
                                .replace(regexStrForNewCopy, '"Name":"test"')
                                .replace(/\s/g, ''),
                        );

                        if (
                            Math.abs(
                                JSON.stringify(copyExportATDObject).length - JSON.stringify(exportATDObject).length,
                            ) > 10 ||
                            Math.abs(
                                JSON.stringify(copyExportATDObject.DataViews).length -
                                    JSON.stringify(exportATDObject.DataViews).length,
                            ) > 2 ||
                            Math.abs(
                                JSON.stringify(copyExportATDObject.Fields).length -
                                    JSON.stringify(exportATDObject.Fields).length,
                            ) > 2 ||
                            Math.abs(
                                JSON.stringify(newCopyExportATDObject).length -
                                    JSON.stringify(copyExportATDObject).length,
                            ) > 0 ||
                            exportATDObject.Fields.length == 0 ||
                            copyExportATDObject.Fields.length == 0 ||
                            exportATDObject.DataViews.length == 0 ||
                            copyExportATDObject.DataViews.length == 0
                        ) {
                            // console.log({ copyExportATDObject: copyExportATDObject });
                            // console.log({ exportATDObject: exportATDObject });

                            expect(
                                `The length of the new ATD override witout the ExternalID is ${
                                    JSON.stringify(copyExportATDObject).length
                                }, the length of the new ATD copy witout the ExternalID is ${
                                    JSON.stringify(newCopyExportATDObject).length
                                }, expected to be in length of ${
                                    JSON.stringify(exportATDObject).length
                                }, but the difference in length is: ${Math.abs(
                                    JSON.stringify(copyExportATDObject).length - JSON.stringify(exportATDObject).length,
                                )}, Existing ATD Export URL was: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=activities&subtype=${activityID}, and the Export Response was: ${
                                    testDataExportATDToCopyResponse.URL
                                }, New ATD Export URL was: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=activities&subtype=${
                                    testDataNewActivityATDCopy.InternalID
                                }, and the Export Response was: ${copyExportATDResponse.URL}, Existing had: ${
                                    exportATDObject.DataViews.length
                                } DataViews in total length of: ${JSON.stringify(exportATDObject.DataViews).length},  ${
                                    exportATDObject.Fields.length
                                } Fields in total length of: ${JSON.stringify(exportATDObject.Fields).length}, ${
                                    exportATDObject.References.length
                                } References in total length of: ${
                                    JSON.stringify(exportATDObject.References).length
                                }, and Workflow in length of: ${
                                    JSON.stringify(exportATDObject.Workflow).length
                                } New had: ${copyExportATDObject.DataViews.length} DataViews in total length of: ${
                                    JSON.stringify(copyExportATDObject.DataViews).length
                                },  ${copyExportATDObject.Fields.length} Fields in total length of: ${
                                    JSON.stringify(copyExportATDObject.Fields).length
                                }, ${copyExportATDObject.References.length} References in total length of: ${
                                    JSON.stringify(copyExportATDObject.References).length
                                }, and Workflow in length of: ${
                                    JSON.stringify(copyExportATDObject.Workflow).length
                                }, the copy to new ATD Response was: ${newCopyExportATDResponse.URL}`,
                            ).to.be.true;
                        } else {
                            expect(
                                Math.abs(
                                    JSON.stringify(copyExportATDObject).length - JSON.stringify(exportATDObject).length,
                                ),
                            ).to.be.below(10);
                        }
                    });
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
    const allTransactionsATDObject: MetaDataATD[] = await service.getAllTransactionsATD();
    let deletedCounter = 0;
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
    const allActivitiesATDObject: MetaDataATD[] = await service.getAllActivitiesATD();
    deletedCounter = 0;
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
