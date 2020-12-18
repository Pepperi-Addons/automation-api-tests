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

    const testDataNewATD = await importExportATDService.postTransactionsATD(
        testDataATD(Math.floor(Math.random() * 1000000).toString(), 'Description of Test ATD'),
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

    const addonUUID = 'e9029d7f-af32-4b0e-a513-8d9ced6f8186';
    const version = '1.';

    const varLatestVersion = await fetch(
        `${generalService['client'].BaseURL.replace(
            'papi-eu',
            'papi',
        )}/var/addons/versions?where=AddonUUID='${addonUUID}' AND Version Like '${version}%'&order_by=CreationDateTime DESC`,
        {
            method: `GET`,
            headers: {
                Authorization: `${request.body.varKey}`,
            },
        },
    )
        .then((response) => response.json())
        .then((addon) => addon[0].Version);

    const upgradeAuditLogResponse = await service.addons.installedAddons
        .addonUUID(`${addonUUID}`)
        .upgrade(varLatestVersion);

    generalService.sleep(4000); //Test installation status only after 4 seconds.
    let auditLogResponse = await service.auditLogs.uuid(upgradeAuditLogResponse.ExecutionUUID as any).get();
    if (auditLogResponse.Status.Name == 'InProgress') {
        generalService.sleep(20000); //Wait another 20 seconds and try again (fail the test if client wait more then 20+4 seconds)
        auditLogResponse = await service.auditLogs.uuid(upgradeAuditLogResponse.ExecutionUUID as any).get();
    }
    const installedAddonVersion = await service.addons.installedAddons.addonUUID(`${addonUUID}`).get();

    describe('Import And Export ATD Tests Suites', () => {
        describe('Prerequisites Addon for ImportExportATD Tests', () => {
            it('Upgarde To Latest Version', async () => {
                expect(upgradeAuditLogResponse).to.have.property('ExecutionUUID').a('string').with.lengthOf(36);
                if (auditLogResponse.Status.Name == 'Failure') {
                    expect(auditLogResponse.AuditInfo.ErrorMessage).to.include('is already working on version');
                } else {
                    expect(auditLogResponse.Status.Name).to.include('Success');
                }
            });

            it(`Latest Version Is Installed`, () => {
                expect(installedAddonVersion).to.have.property('Version').a('string').that.is.equal(varLatestVersion);
            });

            describe('Endpoints', () => {
                describe('ATD', () => {
                    it(`Create New ATD (DI-17195)`, async () => {
                        expect(testDataNewATD)
                            .to.have.property('Description')
                            .a('string')
                            .that.contains('Description of Test ATD');
                        expect(testDataNewATD).to.have.property('TypeID').a('number').that.is.above(0);
                        expect(testDataNewATD).to.have.property('InternalID').a('number').that.above(0);
                        expect(testDataNewATD).to.have.property('ExternalID').a('string').that.contains('Test ATD ');
                        expect(testDataNewATD).to.have.property('Hidden').a('boolean').that.is.false;
                        expect(testDataNewATD).to.have.property('Icon').a('string').that.contains('icon');
                        expect(testDataNewATD)
                            .to.have.property('ModificationDateTime')
                            .a('string')
                            .that.contains(new Date().toISOString().substring(0, 11));
                        expect(testDataNewATD).to.have.property('ModificationDateTime').a('string').that.contains('Z');
                        expect(testDataNewATD)
                            .to.have.property('CreationDateTime')
                            .a('string')
                            .that.contains(new Date().toISOString().substring(0, 11));
                        expect(testDataNewATD).to.have.property('CreationDateTime').a('string').that.contains('Z');
                        expect(testDataNewATD).to.have.property('UUID').a('string').that.have.lengthOf(36);
                    });

                    it(`CRUD ATD`, async () => {
                        //Update + Delete
                        console.log({ ATD_Post_Response: testDataNewATD });
                        const testDataUpdatedATD = await importExportATDService.postTransactionsATD({
                            TypeID: 0,
                            InternalID: testDataNewATD.InternalID,
                            ExternalID: testDataNewATD.ExternalID + 1,
                            UUID: 'Test String',
                            Description: 'Updated Description of Test ATD',
                            Icon: testDataNewATD.Icon.slice(0, -1) + 3,
                            Hidden: true,
                            CreationDateTime: testDataNewATD.CreationDateTime,
                            ModificationDateTime: 'Test String',
                        });
                        console.log({ ATD_Update_Response: testDataUpdatedATD });

                        expect(testDataUpdatedATD)
                            .to.have.property('Description')
                            .a('string')
                            .that.contains('Updated Description of Test ATD');
                        expect(testDataNewATD)
                            .to.have.property('TypeID')
                            .a('number')
                            .that.is.equal(testDataUpdatedATD.TypeID);
                        expect(testDataNewATD)
                            .to.have.property('InternalID')
                            .a('number')
                            .that.is.equal(testDataUpdatedATD.InternalID);
                        expect(testDataUpdatedATD)
                            .to.have.property('ExternalID')
                            .a('string')
                            .that.contains(testDataNewATD.ExternalID + 1);
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
                        expect(testDataNewATD)
                            .to.have.property('CreationDateTime')
                            .a('string')
                            .that.contains(testDataUpdatedATD.CreationDateTime);
                        expect(testDataNewATD)
                            .to.have.property('UUID')
                            .a('string')
                            .that.contains(testDataUpdatedATD.UUID);

                        //Restore
                        const testDataRestoreATD = await importExportATDService.postTransactionsATD({
                            InternalID: testDataUpdatedATD.InternalID,
                            ExternalID: testDataNewATD.ExternalID,
                            Description: testDataUpdatedATD.Description,
                            Hidden: false,
                        });

                        expect(testDataRestoreATD).to.have.property('Hidden').a('boolean').that.is.false;
                        console.log({ ATD_Restore_Response: testDataRestoreATD });
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
                });

                describe('UDT', () => {
                    it('CRUD UDT', async () => {
                        console.log({ UDT_Post_Response: testDataPostUDT });
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

        it(`Test Data: Tested Addon: ImportExportATD - Version: ${installedAddonVersion.Version}`, () => {
            expect(installedAddonVersion.Version).to.be.a('string').that.is.contain('.');
        });

        describe('Endpoints', () => {
            describe('Get (DI-17200, DI-17258)', () => {
                for (let index = 0; index < transactionsTypeArr.length; index++) {
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
            });

            describe('Post', () => {
                for (let index = 0; index < transactionsTypeArr.length; index++) {
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
                for (let index = 0; index < transactionsTypeArr.length; index++) {
                    const transactionName = transactionsTypeArr[index];
                    const transactionID = transactionsTypeArr[transactionsTypeArr[index]];
                    it(`Transaction: ${transactionName}`, async () => {
                        const testDataExportATDToCopyResponse = await importExportATDService.exportATD(
                            'transactions',
                            transactionID,
                        );
                        console.log({ testDataExportATDToCopyResponse: testDataExportATDToCopyResponse });

                        expect(testDataExportATDToCopyResponse)
                            .to.have.property('URL')
                            .that.contain('https://')
                            .and.contain('cdn.')
                            .and.contain('/TemporaryFiles/');
                        const exportATDObject = await fetch(testDataExportATDToCopyResponse.URL).then((response) =>
                            response.json(),
                        );

                        // console.log({ exportATDObject: exportATDObject });
                        // console.log({ Fields: exportATDObject.Fields });
                        // console.log({ Workflow: exportATDObject.Workflow });
                        // console.log({ References: exportATDObject.References });
                        // console.log({ DataViews: exportATDObject.DataViews });
                        // console.log({ LineFields: exportATDObject.LineFields });
                        // console.log({ Settings: exportATDObject.Settings });

                        const testDataNewATDCopy = await importExportATDService.postTransactionsATD(
                            testDataATD(Math.floor(Math.random() * 1000000).toString(), `Copy of ${transactionName}`),
                        );
                        console.log({ testDataNewATDCopy: testDataNewATDCopy });

                        await expect(
                            importExportATDService.importATD(
                                'transactions',
                                testDataNewATDCopy.InternalID,
                                testDataExportATDToCopyResponse,
                            ),
                        ).eventually.to.contains('success');

                        const copyExportATDResponse = await importExportATDService.exportATD(
                            'transactions',
                            testDataNewATDCopy.InternalID,
                        );
                        console.log({ copyExportATDResponse: copyExportATDResponse });

                        expect(copyExportATDResponse)
                            .to.have.property('URL')
                            .that.contain('https://')
                            .and.contain('cdn.')
                            .and.contain('/TemporaryFiles/');
                        const copyExportATDObject = await fetch(copyExportATDResponse.URL).then((response) =>
                            response.json(),
                        );

                        // console.log({ copyExportATDObject: copyExportATDObject });
                        // console.log({ Fields: copyExportATDObject.Fields });
                        // console.log({ Workflow: copyExportATDObject.Workflow });
                        // console.log({ References: copyExportATDObject.References });
                        // console.log({ DataViews: copyExportATDObject.DataViews });
                        // console.log({ LineFields: copyExportATDObject.LineFields });
                        // console.log({ Settings: copyExportATDObject.Settings });

                        if (JSON.stringify(copyExportATDObject).length != JSON.stringify(exportATDObject).length) {
                            expect(
                                `The length of the new ATD is ${
                                    JSON.stringify(copyExportATDObject).length
                                }, expected to be in length of ${
                                    JSON.stringify(exportATDObject).length
                                }, Origina ATD Export URL: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=transactions&subtype=${transactionID}, Origina ATD Export Response: ${
                                    testDataExportATDToCopyResponse.URL
                                }, New ATD Export URL: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=transactions&subtype=${
                                    testDataNewATDCopy.InternalID
                                }, New ATD Export Response: ${copyExportATDResponse.URL}`,
                            ).to.be.true;
                        } else {
                            expect(JSON.stringify(copyExportATDObject).length).to.equal(
                                JSON.stringify(exportATDObject).length,
                            );
                        }
                    });
                }

                for (let index = 0; index < activitiesTypeArr.length; index++) {
                    const activityName = activitiesTypeArr[index];
                    const activityID = activitiesTypeArr[activitiesTypeArr[index]];
                    it(`Activity: ${activityName}`, async () => {
                        const testDataExportATDToCopyResponse = await importExportATDService.exportATD(
                            'activities',
                            activityID,
                        );
                        console.log({ testDataExportATDToCopyResponse: testDataExportATDToCopyResponse });

                        expect(testDataExportATDToCopyResponse)
                            .to.have.property('URL')
                            .that.contain('https://')
                            .and.contain('cdn.')
                            .and.contain('/TemporaryFiles/');
                        const exportATDObject = await fetch(testDataExportATDToCopyResponse.URL).then((response) =>
                            response.json(),
                        );

                        // console.log({ exportATDObject: exportATDObject });
                        // console.log({ Fields: exportATDObject.Fields });
                        // console.log({ Workflow: exportATDObject.Workflow });
                        // console.log({ References: exportATDObject.References });
                        // console.log({ DataViews: exportATDObject.DataViews });
                        // console.log({ LineFields: exportATDObject.LineFields });
                        // console.log({ Settings: exportATDObject.Settings });

                        const testDataNewATDCopy = await importExportATDService.postActivitiesATD(
                            testDataATD(Math.floor(Math.random() * 1000000).toString(), `Copy of ${activityName}`),
                        );
                        console.log({ testDataNewATDCopy: testDataNewATDCopy });

                        await expect(
                            importExportATDService.importATD(
                                'activities',
                                testDataNewATDCopy.InternalID,
                                testDataExportATDToCopyResponse,
                            ),
                        ).eventually.to.contains('success');

                        const copyExportATDResponse = await importExportATDService.exportATD(
                            'activities',
                            testDataNewATDCopy.InternalID,
                        );
                        console.log({ copyExportATDResponse: copyExportATDResponse });

                        expect(copyExportATDResponse)
                            .to.have.property('URL')
                            .that.contain('https://')
                            .and.contain('cdn.')
                            .and.contain('/TemporaryFiles/');
                        const copyExportATDObject = await fetch(copyExportATDResponse.URL).then((response) =>
                            response.json(),
                        );

                        // console.log({ copyExportATDObject: copyExportATDObject });
                        // console.log({ Fields: copyExportATDObject.Fields });
                        // console.log({ Workflow: copyExportATDObject.Workflow });
                        // console.log({ References: copyExportATDObject.References });
                        // console.log({ DataViews: copyExportATDObject.DataViews });
                        // console.log({ LineFields: copyExportATDObject.LineFields });
                        // console.log({ Settings: copyExportATDObject.Settings });

                        if (JSON.stringify(copyExportATDObject).length != JSON.stringify(exportATDObject).length) {
                            expect(
                                `The length of the new ATD is ${
                                    JSON.stringify(copyExportATDObject).length
                                }, expected to be in length of ${
                                    JSON.stringify(exportATDObject).length
                                }, Origina ATD Export URL: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=activities&subtype=${activityID}, Origina ATD Export Response: ${
                                    testDataExportATDToCopyResponse.URL
                                }, New ATD Export URL: /addons/api/e9029d7f-af32-4b0e-a513-8d9ced6f8186/api/export_type_definition?type=activities&subtype=${
                                    testDataNewATDCopy.InternalID
                                }, New ATD Export Response: ${copyExportATDResponse.URL}`,
                            ).to.be.true;
                        } else {
                            expect(JSON.stringify(copyExportATDObject).length).to.equal(
                                JSON.stringify(exportATDObject).length,
                            );
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
