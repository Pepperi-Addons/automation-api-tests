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
let isActivitiesTestsOverride = false;
let isTransactionsTestsOverrideBase = false;
let isTransactionsTestsOverrideWinzer = false;
let isLocalFilesComparison = false;

// All Import Export ATD Tests
export async function ImportExportATDActivitiesTests(generalService: GeneralService, request, tester: TesterFunctions) {
    isActivitiesTests = true;
    isTransactionsTests = false;
    isActivitiesTestsBox = false;
    isTransactionsTestsBox = false;
    isActivitiesTestsOverride = false;
    isTransactionsTestsOverrideBase = false;
    isTransactionsTestsOverrideWinzer = false;
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
    isActivitiesTestsOverride = false;
    isTransactionsTestsOverrideBase = false;
    isTransactionsTestsOverrideWinzer = false;
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
    isActivitiesTestsOverride = false;
    isTransactionsTestsOverrideBase = false;
    isTransactionsTestsOverrideWinzer = false;
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
    isActivitiesTestsOverride = false;
    isTransactionsTestsOverrideBase = false;
    isTransactionsTestsOverrideWinzer = false;
    await ImportExportATDTests(generalService, request, tester);
}

export async function ImportExportATDActivitiesOverrideTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    isActivitiesTests = false;
    isTransactionsTests = false;
    isActivitiesTestsBox = false;
    isTransactionsTestsBox = false;
    isActivitiesTestsOverride = true;
    isTransactionsTestsOverrideBase = false;
    isTransactionsTestsOverrideWinzer = false;
    await ImportExportATDTests(generalService, request, tester);
}

export async function ImportExportATDTransactionsOverrideTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    isActivitiesTests = false;
    isTransactionsTests = false;
    isActivitiesTestsBox = false;
    isTransactionsTestsBox = false;
    isActivitiesTestsOverride = false;
    isTransactionsTestsOverrideBase = true;
    isTransactionsTestsOverrideWinzer = false;
    await ImportExportATDTests(generalService, request, tester);
}

export async function ImportExportATDTransactionsOverrideWinzerTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    isActivitiesTests = false;
    isTransactionsTests = false;
    isActivitiesTestsBox = false;
    isTransactionsTestsBox = false;
    isActivitiesTestsOverride = false;
    isTransactionsTestsOverrideBase = false;
    isTransactionsTestsOverrideWinzer = true;
    await ImportExportATDTests(generalService, request, tester);
}

export async function ImportExportATDLocalTests(generalService: GeneralService, request, tester: TesterFunctions) {
    isActivitiesTests = false;
    isTransactionsTests = false;
    isActivitiesTestsBox = false;
    isTransactionsTestsBox = false;
    isActivitiesTestsOverride = false;
    isTransactionsTestsOverrideBase = false;
    isTransactionsTestsOverrideWinzer = false;
    isLocalFilesComparison = true;
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

    //In case of local test
    let beforeURL;
    let afterURL;
    if (isLocalFilesComparison) {
        beforeURL = request.body.before;
        afterURL = request.body.after;
    }

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

    let testDataPostUDT;
    if (
        !isActivitiesTestsOverride &&
        !isTransactionsTestsOverrideBase &&
        !isLocalFilesComparison &&
        !isTransactionsTestsOverrideWinzer
    ) {
        testDataPostUDT = await importExportATDService.postUDT({
            TableID: `Test UDT ${Math.floor(Math.random() * 1000000).toString()}`,
            MainKeyType: { ID: 23, Name: '' },
            SecondaryKeyType: { ID: 35, Name: '' },
            MemoryMode: {
                Dormant: true,
                Volatile: false,
            },
        });
    }

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

    const testATD = await importExportATDService
        .getAllTransactionsATD()
        .then((res) => res.find((atd) => atd.ExternalID == 'Jenkins Automation ATD 1.1.168'));

    const dataViewsAddonUUID = '484e7f22-796a-45f8-9082-12a734bac4e8';
    const dataViewsVersion = '1.';
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

    let isInstalled = false;
    let installedAddonVersion;
    const installedAddonsArr = await generalService.getAddons();
    for (let i = 0; i < installedAddonsArr.length; i++) {
        if (installedAddonsArr[i].Addon !== null) {
            if (installedAddonsArr[i].Addon.Name == 'Data Views API') {
                installedAddonVersion = installedAddonsArr[i].Version;
                isInstalled = true;
                break;
            }
        }
    }
    if (!isInstalled) {
        await service.addons.installedAddons.addonUUID(`${dataViewsAddonUUID}`).install();
        generalService.sleep(20000); //If addon needed to be installed, just wait 20 seconds, this should not happen.
    }

    let dataViewsUpgradeAuditLogResponse;
    let dataViewsInstalledAddonVersion;
    let dataViewsAuditLogResponse;
    if (installedAddonVersion != dataViewsVarLatestVersion) {
        dataViewsUpgradeAuditLogResponse = await service.addons.installedAddons
            .addonUUID(`${dataViewsAddonUUID}`)
            .upgrade(dataViewsVarLatestVersion);

        generalService.sleep(4000); //Test installation status only after 4 seconds.
        dataViewsAuditLogResponse = await service.auditLogs.uuid(dataViewsUpgradeAuditLogResponse.ExecutionUUID).get();
        if (dataViewsAuditLogResponse.Status.Name == 'InProgress') {
            generalService.sleep(20000); //Wait another 20 seconds and try again (fail the test if client wait more then 20+4 seconds)
            dataViewsAuditLogResponse = await service.auditLogs
                .uuid(dataViewsUpgradeAuditLogResponse.ExecutionUUID)
                .get();
        }
        dataViewsInstalledAddonVersion = await (
            await service.addons.installedAddons.addonUUID(`${dataViewsAddonUUID}`).get()
        ).Version;
    } else {
        dataViewsUpgradeAuditLogResponse = 'Skipped';
        dataViewsInstalledAddonVersion = installedAddonVersion;
    }
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

    isInstalled = false;
    installedAddonVersion = undefined;
    for (let i = 0; i < installedAddonsArr.length; i++) {
        if (installedAddonsArr[i].Addon !== null) {
            if (installedAddonsArr[i].Addon.Name == 'ImportExportATD') {
                installedAddonVersion = installedAddonsArr[i].Version;
                isInstalled = true;
                break;
            }
        }
    }
    if (!isInstalled) {
        await service.addons.installedAddons.addonUUID(`${importExportATDAddonUUID}`).install();
        generalService.sleep(20000); //If addon needed to be installed, just wait 20 seconds, this should not happen.
    }

    let importExportATDUpgradeAuditLogResponse;
    let importExportATDInstalledAddonVersion;
    let importExportATDAuditLogResponse;
    if (installedAddonVersion != importExportATDVarLatestVersion) {
        importExportATDUpgradeAuditLogResponse = await service.addons.installedAddons
            .addonUUID(`${importExportATDAddonUUID}`)
            .upgrade(importExportATDVarLatestVersion);

        generalService.sleep(4000); //Test installation status only after 4 seconds.
        importExportATDAuditLogResponse = await service.auditLogs
            .uuid(importExportATDUpgradeAuditLogResponse.ExecutionUUID)
            .get();
        if (importExportATDAuditLogResponse.Status.Name == 'InProgress') {
            generalService.sleep(20000); //Wait another 20 seconds and try again (fail the test if client wait more then 20+4 seconds)
            importExportATDAuditLogResponse = await service.auditLogs
                .uuid(importExportATDUpgradeAuditLogResponse.ExecutionUUID)
                .get();
        }
        importExportATDInstalledAddonVersion = await (
            await service.addons.installedAddons.addonUUID(`${importExportATDAddonUUID}`).get()
        ).Version;
    } else {
        importExportATDUpgradeAuditLogResponse = 'Skipped';
        importExportATDInstalledAddonVersion = installedAddonVersion;
    }
    //#endregion Upgrade Import Export ATD

    describe('Export And Import ATD Tests Suites', () => {
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

        it(`Test Data: Tested Addon: ImportExportATD - Version: ${importExportATDInstalledAddonVersion}`, () => {
            expect(importExportATDInstalledAddonVersion).to.contain('.');
        });

        describe('Prerequisites Addon for ImportExportATD Tests', () => {
            it('Upgarde To Latest Version of Data Views Addon', async () => {
                if (dataViewsUpgradeAuditLogResponse != 'Skipped') {
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
                }
            });

            it(`Latest Version Is Installed`, () => {
                expect(dataViewsInstalledAddonVersion).to.equal(dataViewsVarLatestVersion);
            });

            it('Upgarde To Latest Version of Import Export Addon', async () => {
                if (importExportATDUpgradeAuditLogResponse != 'Skipped') {
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
                }
            });

            it(`Latest Version Is Installed`, () => {
                expect(importExportATDInstalledAddonVersion).to.equal(importExportATDVarLatestVersion);
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
                            //     expect.fail(
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
                            //     );
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

        describe('Endpoints', () => {
            describe('Get (DI-17200, DI-17258)', () => {
                if (isActivitiesTests) {
                    for (let index = 0; index < activitiesTypeArr.length; index++) {
                        if (index > 0) {
                            index = 999;
                            break;
                        }
                        const activityName = activitiesTypeArr[index];
                        const activityID = activitiesTypeArr[activitiesTypeArr[index]];
                        let ATDExportObj;
                        let ATDExportResponse;
                        it(`Export Activities ATD ${activityName}`, async () => {
                            expect(
                                (ATDExportResponse = await importExportATDService.exportATD('activities', activityID)),
                            )
                                .to.have.property('URI')
                                .that.contain('/audit_logs/');

                            let maxLoopsCounter = 90;
                            do {
                                generalService.sleep(2000);
                                ATDExportObj = await generalService.papiClient.get(ATDExportResponse.URI);
                                maxLoopsCounter--;
                            } while (
                                !ATDExportObj ||
                                !ATDExportObj.Status ||
                                (ATDExportObj.Status.ID == 2 && maxLoopsCounter > 0)
                            );

                            expect(JSON.parse(ATDExportObj.AuditInfo.ResultObject))
                                .to.have.property('URL')
                                .that.contain('https://')
                                .and.contain('cdn.')
                                .and.contain('/TemporaryFiles/');
                        });
                    }
                }

                if (isTransactionsTests) {
                    for (let index = 0; index < transactionsTypeArr.length - 1; index++) {
                        if (index > 0) {
                            index = 999;
                            break;
                        }
                        const transactionName = transactionsTypeArr[index];
                        const transactionID = transactionsTypeArr[transactionsTypeArr[index]];
                        let ATDExportObj;
                        let ATDExportResponse;
                        it(`Export Transactions ATD ${transactionName}`, async () => {
                            expect(
                                (ATDExportResponse = await importExportATDService.exportATD(
                                    'transactions',
                                    transactionID,
                                )),
                            )
                                .to.have.property('URI')
                                .that.contain('/audit_logs/');

                            let maxLoopsCounter = 90;
                            do {
                                generalService.sleep(2000);
                                ATDExportObj = await generalService.papiClient.get(ATDExportResponse.URI);
                                maxLoopsCounter--;
                            } while (
                                !ATDExportObj ||
                                !ATDExportObj.Status ||
                                (ATDExportObj.Status.ID == 2 && maxLoopsCounter > 0)
                            );

                            expect(JSON.parse(ATDExportObj.AuditInfo.ResultObject))
                                .to.have.property('URL')
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
                        if (index > 0) {
                            index = 999;
                            break;
                        }
                        const activityName = activitiesTypeArr[index];
                        const activityID = activitiesTypeArr[activitiesTypeArr[index]];
                        let ATDExportObj;
                        let ATDExportResponse;
                        it(`Export Mapping Of Activities ATD ${activityName}`, async () => {
                            expect(
                                (ATDExportResponse = await importExportATDService.exportATD('activities', activityID)),
                            )
                                .to.have.property('URI')
                                .that.contain('/audit_logs/');

                            let maxLoopsCounter = 90;
                            do {
                                generalService.sleep(2000);
                                ATDExportObj = await generalService.papiClient.get(ATDExportResponse.URI);
                                maxLoopsCounter--;
                            } while (
                                !ATDExportObj ||
                                !ATDExportObj.Status ||
                                (ATDExportObj.Status.ID == 2 && maxLoopsCounter > 0)
                            );

                            expect(JSON.parse(ATDExportObj.AuditInfo.ResultObject))
                                .to.have.property('URL')
                                .that.contain('https://')
                                .and.contain('cdn.')
                                .and.contain('/TemporaryFiles/');

                            const references = await fetch(JSON.parse(ATDExportObj.AuditInfo.ResultObject).URL)
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
                        if (index > 0) {
                            index = 999;
                            break;
                        }
                        const transactionName = transactionsTypeArr[index];
                        const transactionID = transactionsTypeArr[transactionsTypeArr[index]];
                        let ATDExportObj;
                        let ATDExportResponse;
                        it(`Export Mapping Of Transactions ATD ${transactionName}`, async () => {
                            expect(
                                (ATDExportResponse = await importExportATDService.exportATD(
                                    'transactions',
                                    transactionID,
                                )),
                            )
                                .to.have.property('URI')
                                .that.contain('/audit_logs/');

                            let maxLoopsCounter = 90;
                            do {
                                generalService.sleep(2000);
                                ATDExportObj = await generalService.papiClient.get(ATDExportResponse.URI);
                                maxLoopsCounter--;
                            } while (
                                !ATDExportObj ||
                                !ATDExportObj.Status ||
                                (ATDExportObj.Status.ID == 2 && maxLoopsCounter > 0)
                            );

                            expect(JSON.parse(ATDExportObj.AuditInfo.ResultObject))
                                .to.have.property('URL')
                                .that.contain('https://')
                                .and.contain('cdn.')
                                .and.contain('/TemporaryFiles/');

                            const references = await fetch(JSON.parse(ATDExportObj.AuditInfo.ResultObject).URL)
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
                        if (index > 0) {
                            index = 999;
                            break;
                        }
                        const activityName = activitiesTypeArr[index];
                        const originalATDID = activitiesTypeArr[activitiesTypeArr[index]];
                        let existingATDID;
                        let newATDID;
                        let originalATDExportResponse;
                        let existingATDExportResponse;
                        let newATDExportResponse = { URL: 'Skipped until bug DI-17656 will be fixed' };
                        let originalATDExportObj;
                        let existingATDExportObj;
                        let newATDExportObj = {
                            LineFields: 'Skipped until bug DI-17656 will be fixed',
                            Settings: 'Skipped until bug DI-17656 will be fixed',
                            Fields: 'Skipped until bug DI-17656 will be fixed',
                            References: 'Skipped until bug DI-17656 will be fixed',
                            DataViews: 'Skipped until bug DI-17656 will be fixed',
                            Workflow: 'Skipped until bug DI-17656 will be fixed',
                        };
                        let testDataExistingActivityATD;
                        const isNewATD = false;
                        let ATDExportObj;
                        let ATDExportResponse;
                        describe(`Import and Export ${activityName} ATD`, () => {
                            it(`Activity: ${activityName} copy to existing ATD`, async () => {
                                expect(
                                    (ATDExportResponse = await importExportATDService.exportATD(
                                        'activities',
                                        originalATDID,
                                    )),
                                )
                                    .to.have.property('URI')
                                    .that.contain('/audit_logs/');

                                let maxLoopsCounter = 90;
                                do {
                                    generalService.sleep(2000);
                                    ATDExportObj = await generalService.papiClient.get(ATDExportResponse.URI);
                                    maxLoopsCounter--;
                                } while (
                                    !ATDExportObj ||
                                    !ATDExportObj.Status ||
                                    (ATDExportObj.Status.ID == 2 && maxLoopsCounter > 0)
                                );

                                originalATDExportResponse = JSON.parse(ATDExportObj.AuditInfo.ResultObject);
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
                                expect(
                                    (ATDExportResponse = await importExportATDService.exportATD(
                                        'activities',
                                        existingATDID,
                                    )),
                                )
                                    .to.have.property('URI')
                                    .that.contain('/audit_logs/');

                                let maxLoopsCounter = 90;
                                do {
                                    generalService.sleep(2000);
                                    ATDExportObj = await generalService.papiClient.get(ATDExportResponse.URI);
                                    maxLoopsCounter--;
                                } while (
                                    !ATDExportObj ||
                                    !ATDExportObj.Status ||
                                    (ATDExportObj.Status.ID == 2 && maxLoopsCounter > 0)
                                );

                                existingATDExportResponse = JSON.parse(ATDExportObj.AuditInfo.ResultObject);
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
                                if (isNewATD) {
                                    await expect(
                                        importExportATDService.importToNewATD('activities', originalATDExportResponse),
                                    )
                                        .eventually.to.have.property('status')
                                        .that.is.a('Number')
                                        .that.equals(200);
                                } else {
                                    expect(isNewATD).to.be.false;
                                }
                            });

                            let testDataRenameATD;
                            it('Rename new ATD', async () => {
                                if (isNewATD) {
                                    const testDataNewActivityATDNewExport = await importExportATDService
                                        .getAllActivitiesATD()
                                        .then((responseArray) => responseArray.slice(-1).pop());

                                    testDataRenameATD = await importExportATDService.postActivitiesATD({
                                        InternalID: testDataNewActivityATDNewExport.InternalID,
                                        ExternalID: `Test ATD ${
                                            Math.floor(Math.random() * 10000000).toString() +
                                            ' ' +
                                            Math.random().toString(36).substring(10)
                                        }`,
                                        Description: testDataNewActivityATDNewExport.Description.replace(
                                            'Override',
                                            'New',
                                        ),
                                    });
                                    newATDID = testDataRenameATD.InternalID;
                                    expect(testDataRenameATD).to.have.property('ExternalID').to.contains('Test ATD ');
                                } else {
                                    expect(isNewATD).to.be.false;
                                }
                            });

                            it(`Activity: ${activityName} export from new ATD`, async () => {
                                if (isNewATD) {
                                    expect(
                                        (ATDExportResponse = await importExportATDService.exportATD(
                                            'activities',
                                            newATDID,
                                        )),
                                    )
                                        .to.have.property('URI')
                                        .that.contain('/audit_logs/');

                                    let maxLoopsCounter = 90;
                                    do {
                                        generalService.sleep(2000);
                                        ATDExportObj = await generalService.papiClient.get(ATDExportResponse.URI);
                                        maxLoopsCounter--;
                                    } while (
                                        !ATDExportObj ||
                                        !ATDExportObj.Status ||
                                        (ATDExportObj.Status.ID == 2 && maxLoopsCounter > 0)
                                    );

                                    newATDExportResponse = JSON.parse(ATDExportObj.AuditInfo.ResultObject);
                                    console.log({
                                        TestData_Activity_New_ATD_Export_Response: newATDExportResponse,
                                    });

                                    expect(newATDExportResponse)
                                        .to.have.property('URL')
                                        .that.contain('https://')
                                        .and.contain('cdn.')
                                        .and.contain('/TemporaryFiles/');
                                    newATDExportObj = await fetch(newATDExportResponse.URL).then((response) =>
                                        response.json(),
                                    );
                                } else {
                                    expect(isNewATD).to.be.false;
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
                                    expect(isNewATD).to.be.false;
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
                                RemoveUntestedMembers(originalATDExportObj);
                                RemoveUntestedMembers(existingATDExportObj);
                                if (isNewATD) {
                                    RemoveUntestedMembers(newATDExportObj);
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
                                    expect.fail(
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
                                    );
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
                                    (isNewATD &&
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.DataViews).length -
                                                JSON.stringify(newATDExportObj.DataViews).length,
                                        ) > 2) ||
                                    originalATDExportObj.DataViews.length == 0
                                ) {
                                    expect.fail(
                                        `Origin DataViews length ${
                                            JSON.stringify(originalATDExportObj.DataViews).length
                                        }, Copy to existing DataViews length ${
                                            JSON.stringify(existingATDExportObj.DataViews).length
                                        }, Created new DataViews length ${
                                            JSON.stringify(newATDExportObj.DataViews).length
                                        }.`,
                                    );
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
                                    (isNewATD &&
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.Fields).length -
                                                JSON.stringify(newATDExportObj.Fields).length,
                                        ) > 2) ||
                                    originalATDExportObj.Fields.length == 0
                                ) {
                                    expect.fail(
                                        `Origin Fields length ${
                                            JSON.stringify(originalATDExportObj.Fields).length
                                        }, Copy to existing Fields length ${
                                            JSON.stringify(existingATDExportObj.Fields).length
                                        }, Created new Fields length ${JSON.stringify(newATDExportObj.Fields).length}.`,
                                    );
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
                                    (isNewATD &&
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.References).length -
                                                JSON.stringify(newATDExportObj.References).length,
                                        ) > 2) ||
                                    originalATDExportObj.References.length == 0
                                ) {
                                    expect.fail(
                                        `Origin References length ${
                                            JSON.stringify(originalATDExportObj.References).length
                                        }, Copy to existing References length ${
                                            JSON.stringify(existingATDExportObj.References).length
                                        }, Created new References length ${
                                            JSON.stringify(newATDExportObj.References).length
                                        }.`,
                                    );
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
                                    (isNewATD &&
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.Workflow).length -
                                                JSON.stringify(newATDExportObj.Workflow).length,
                                        ) > 2) ||
                                    originalATDExportObj.Workflow.length == 0
                                ) {
                                    expect.fail(
                                        `Origin Workflow length ${
                                            JSON.stringify(originalATDExportObj.Workflow).length
                                        }, Copy to existing Workflow length ${
                                            JSON.stringify(existingATDExportObj.Workflow).length
                                        }, Created new Workflow length ${
                                            JSON.stringify(newATDExportObj.Workflow).length
                                        }.`,
                                    );
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
                                    (isNewATD &&
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.Settings).length -
                                                JSON.stringify(newATDExportObj.Settings).length,
                                        ) > 2) ||
                                    originalATDExportObj.Settings.length == 0
                                ) {
                                    expect.fail(
                                        `Origin Settings length ${
                                            JSON.stringify(originalATDExportObj.Settings).length
                                        }, Copy to Settings DataViews length ${
                                            JSON.stringify(existingATDExportObj.Settings).length
                                        }, Created new Settings length ${
                                            JSON.stringify(newATDExportObj.Settings).length
                                        }.`,
                                    );
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
                    for (let index = 0; index < transactionsTypeArr.length; index++) {
                        if (index > 0) {
                            index = 999;
                            break;
                        }
                        const transactionName = transactionsTypeArr[index];
                        const originalATDID = transactionsTypeArr[transactionsTypeArr[index]];
                        let existingATDID;
                        let newATDID;
                        let originalATDExportResponse;
                        let existingATDExportResponse;
                        let newATDExportResponse = { URL: 'Skipped until bug DI-17656 will be fixed' };
                        let originalATDExportObj;
                        let existingATDExportObj;
                        let newATDExportObj = {
                            LineFields: 'Skipped until bug DI-17656 will be fixed',
                            Settings: 'Skipped until bug DI-17656 will be fixed',
                            Fields: 'Skipped until bug DI-17656 will be fixed',
                            References: 'Skipped until bug DI-17656 will be fixed',
                            DataViews: 'Skipped until bug DI-17656 will be fixed',
                            Workflow: 'Skipped until bug DI-17656 will be fixed',
                        };
                        let testDataExistingTransactionATD;
                        const isNewATD = false;
                        let ATDExportObj;
                        let ATDExportResponse;
                        describe(`Import and Export ${transactionName} ATD`, () => {
                            it(`Transaction: ${transactionName} copy to existing ATD`, async () => {
                                expect(
                                    (ATDExportResponse = await importExportATDService.exportATD(
                                        'transactions',
                                        originalATDID,
                                    )),
                                )
                                    .to.have.property('URI')
                                    .that.contain('/audit_logs/');

                                let maxLoopsCounter = 90;
                                do {
                                    generalService.sleep(2000);
                                    ATDExportObj = await generalService.papiClient.get(ATDExportResponse.URI);
                                    maxLoopsCounter--;
                                } while (
                                    !ATDExportObj ||
                                    !ATDExportObj.Status ||
                                    (ATDExportObj.Status.ID == 2 && maxLoopsCounter > 0)
                                );

                                originalATDExportResponse = JSON.parse(ATDExportObj.AuditInfo.ResultObject);
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

                                expect(
                                    (existingATDExportResponse = await importExportATDService.exportATD(
                                        'transactions',
                                        existingATDID,
                                    )),
                                )
                                    .to.have.property('URI')
                                    .that.contain('/audit_logs/');

                                let maxLoopsCounter = 90;
                                do {
                                    generalService.sleep(2000);
                                    existingATDExportObj = await generalService.papiClient.get(
                                        existingATDExportResponse.URI,
                                    );
                                    maxLoopsCounter--;
                                } while (
                                    !existingATDExportObj ||
                                    !existingATDExportObj.Status ||
                                    (existingATDExportObj.Status.ID == 2 && maxLoopsCounter > 0)
                                );

                                existingATDExportResponse = JSON.parse(existingATDExportObj.AuditInfo.ResultObject);
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
                                if (isNewATD) {
                                    await expect(
                                        importExportATDService.importToNewATD(
                                            'transactions',
                                            originalATDExportResponse,
                                        ),
                                    )
                                        .eventually.to.have.property('status')
                                        .that.is.a('Number')
                                        .that.equals(200);
                                } else {
                                    expect(isNewATD).to.be.false;
                                }
                            });

                            let testDataRenameATD;
                            it('Rename new ATD', async () => {
                                if (isNewATD) {
                                    const testDataNewTransactionATDNewExport = await importExportATDService
                                        .getAllTransactionsATD()
                                        .then((responseArray) => responseArray.slice(-1).pop());

                                    testDataRenameATD = await importExportATDService.postTransactionsATD({
                                        InternalID: testDataNewTransactionATDNewExport.InternalID,
                                        ExternalID: `Test ATD ${
                                            Math.floor(Math.random() * 10000000).toString() +
                                            ' ' +
                                            Math.random().toString(36).substring(10)
                                        }`,
                                        Description: testDataNewTransactionATDNewExport.Description.replace(
                                            'Override',
                                            'New',
                                        ),
                                    });
                                    newATDID = testDataRenameATD.InternalID;
                                    expect(testDataRenameATD).to.have.property('ExternalID').to.contains('Test ATD ');
                                } else {
                                    expect(isNewATD).to.be.false;
                                }
                            });

                            it(`Transaction: ${transactionName} export from new ATD`, async () => {
                                if (isNewATD) {
                                    expect(
                                        (ATDExportResponse = await importExportATDService.exportATD(
                                            'transactions',
                                            newATDID,
                                        )),
                                    )
                                        .to.have.property('URI')
                                        .that.contain('/audit_logs/');

                                    let maxLoopsCounter = 90;
                                    do {
                                        generalService.sleep(2000);
                                        ATDExportObj = await generalService.papiClient.get(ATDExportResponse.URI);
                                        maxLoopsCounter--;
                                    } while (
                                        !ATDExportObj ||
                                        !ATDExportObj.Status ||
                                        (ATDExportObj.Status.ID == 2 && maxLoopsCounter > 0)
                                    );

                                    newATDExportResponse = JSON.parse(ATDExportObj.AuditInfo.ResultObject);
                                    console.log({
                                        TestData_Transaction_New_ATD_Export_Response: newATDExportResponse,
                                    });

                                    expect(newATDExportResponse)
                                        .to.have.property('URL')
                                        .that.contain('https://')
                                        .and.contain('cdn.')
                                        .and.contain('/TemporaryFiles/');
                                    newATDExportObj = await fetch(newATDExportResponse.URL).then((response) =>
                                        response.json(),
                                    );
                                } else {
                                    expect(isNewATD).to.be.false;
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
                                    expect(isNewATD).to.be.false;
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
                                RemoveUntestedMembers(originalATDExportObj);
                                RemoveUntestedMembers(existingATDExportObj);
                                if (isNewATD) {
                                    RemoveUntestedMembers(newATDExportObj);
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
                                    expect.fail(
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
                                    );
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
                                    (isNewATD &&
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.DataViews).length -
                                                JSON.stringify(newATDExportObj.DataViews).length,
                                        ) > 2) ||
                                    originalATDExportObj.DataViews.length == 0
                                ) {
                                    expect.fail(
                                        `Origin DataViews length ${
                                            JSON.stringify(originalATDExportObj.DataViews).length
                                        }, Copy to existing DataViews length ${
                                            JSON.stringify(existingATDExportObj.DataViews).length
                                        }, Created new DataViews length ${
                                            JSON.stringify(newATDExportObj.DataViews).length
                                        }.`,
                                    );
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
                                    (isNewATD &&
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.Fields).length -
                                                JSON.stringify(newATDExportObj.Fields).length,
                                        ) > 2) ||
                                    originalATDExportObj.Fields.length == 0
                                ) {
                                    expect.fail(
                                        `Origin Fields length ${
                                            JSON.stringify(originalATDExportObj.Fields).length
                                        }, Copy to existing Fields length ${
                                            JSON.stringify(existingATDExportObj.Fields).length
                                        }, Created new Fields length ${JSON.stringify(newATDExportObj.Fields).length}.`,
                                    );
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
                                    (isNewATD &&
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.References).length -
                                                JSON.stringify(newATDExportObj.References).length,
                                        ) > 2) ||
                                    originalATDExportObj.References.length == 0
                                ) {
                                    expect.fail(
                                        `Origin References length ${
                                            JSON.stringify(originalATDExportObj.References).length
                                        }, Copy to existing References length ${
                                            JSON.stringify(existingATDExportObj.References).length
                                        }, Created new References length ${
                                            JSON.stringify(newATDExportObj.References).length
                                        }.`,
                                    );
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
                                    (isNewATD &&
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.Workflow).length -
                                                JSON.stringify(newATDExportObj.Workflow).length,
                                        ) > 2) ||
                                    originalATDExportObj.Workflow.length == 0
                                ) {
                                    expect.fail(
                                        `Origin Workflow length ${
                                            JSON.stringify(originalATDExportObj.Workflow).length
                                        }, Copy to existing Workflow length ${
                                            JSON.stringify(existingATDExportObj.Workflow).length
                                        }, Created new Workflow length ${
                                            JSON.stringify(newATDExportObj.Workflow).length
                                        }.`,
                                    );
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
                                    (isNewATD &&
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.Settings).length -
                                                JSON.stringify(newATDExportObj.Settings).length,
                                        ) > 2) ||
                                    originalATDExportObj.Settings.length == 0
                                ) {
                                    expect.fail(
                                        `Origin Settings length ${
                                            JSON.stringify(originalATDExportObj.Settings).length
                                        }, Copy to Settings DataViews length ${
                                            JSON.stringify(existingATDExportObj.Settings).length
                                        }, Created new Settings length ${
                                            JSON.stringify(newATDExportObj.Settings).length
                                        }.`,
                                    );
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
                                    (isNewATD &&
                                        Math.abs(
                                            JSON.stringify(existingATDExportObj.LineFields).length -
                                                JSON.stringify(newATDExportObj.LineFields).length,
                                        ) > 2) ||
                                    originalATDExportObj.LineFields.length == 0
                                ) {
                                    expect.fail(
                                        `Origin LineFields length ${
                                            JSON.stringify(originalATDExportObj.LineFields).length
                                        }, Copy to LineFields DataViews length ${
                                            JSON.stringify(existingATDExportObj.LineFields).length
                                        }, Created new LineFields length ${
                                            JSON.stringify(newATDExportObj.LineFields).length
                                        }.`,
                                    );
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

        if (
            !isActivitiesTestsOverride &&
            !isTransactionsTestsOverrideBase &&
            !isLocalFilesComparison &&
            !isTransactionsTestsOverrideWinzer
        ) {
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
        }

        if (isTransactionsTestsOverrideBase || isTransactionsTestsOverrideWinzer) {
            let TransactionsATDArr;
            if (isTransactionsTestsOverrideBase) {
                TransactionsATDArr = [
                    //Base Sandbox - S3
                    {
                        InternalID: 320562,
                        Description: 'Exported from Sandbox in 30.03.2021',
                        FileName: 'Base_ATD_SB_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'Base ATD SB - 1.1.176',
                        URL:
                            'https://cdn.staging.pepperi.com/30014740/CustomizationFile/aeda4ee7-11be-4577-bbb8-c7484f4ced1b/Base_ATD_SB_1_1_176.json',
                    },
                    //Base Production - S3
                    {
                        InternalID: 305084,
                        Description: 'Exported from Production in 30.03.2021',
                        FileName: 'Base_ATD_PRO_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'Base ATD PRO - 1.1.177',
                        URL:
                            'https://cdn.pepperi.com/30013064/CustomizationFile/83e55247-fd6b-45d9-8cd8-248cf963ed43/Base_ATD_PRO_1_1_176.json',
                    },
                    //Base EU - S3
                    {
                        InternalID: 6716,
                        Description: 'Exported from EU in 30.03.2021',
                        FileName: 'Base_ATD_EU_1_1_168.json',
                        MimeType: 'application/json',
                        Title: 'Base ATD EU - 1.1.168',
                        URL:
                            'https://eucdn.pepperi.com/30010075/CustomizationFile/04fb286e-580c-4dbd-ba7d-c878b271459b/Base_ATD_EU_1_1_168.json',
                    },
                    //Sandbox - S3
                    {
                        InternalID: 320563,
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'Winzer_Sales_Order_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'Winzer Sales Order',
                        URL:
                            'https://cdn.staging.pepperi.com/30014740/CustomizationFile/18c11539-7e65-4615-80f3-1340079426b7/Winzer_Sales_Order_1_1_176.json',
                    },
                    //Production - S3
                    {
                        InternalID: 305085,
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'Sales_Order_Winzer_DEV_(New)_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'Sales Order Winzer DEV (New)',
                        URL:
                            'https://cdn.pepperi.com/30013064/CustomizationFile/08914b6b-372c-42ed-b5af-052fbf1f3e34/Sales_Order_Winzer_DEV_(New)_1_1_176.json',
                    },
                    //Production - S3
                    {
                        InternalID: 305086,

                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'Sales_Order_Legacy_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'Sales Order Legacy',
                        URL:
                            'https://cdn.pepperi.com/30013064/CustomizationFile/c05d52b8-9e14-470c-907c-7943032cd2f5/Sales_Order_Legacy_1_1_176.json',
                    },
                    //EU - S3
                    {
                        InternalID: 6717,
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'Sales_Order_New_Pricing_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'Sales Order New Pricing',
                        URL:
                            'https://eucdn.pepperi.com/30010075/CustomizationFile/b735eeca-dc7a-43e5-9ecf-fcd8623c95df/Sales_Order_New_Pricing_1_1_176.json',
                    },
                ];
            }
            if (isTransactionsTestsOverrideWinzer) {
                TransactionsATDArr = [
                    //Sandbox - S3
                    {
                        InternalID: 320566,
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'VSN_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'VSN',
                        URL:
                            'https://cdn.staging.pepperi.com/30014740/CustomizationFile/c1b2e701-9e56-4be6-ab98-d4980b90daad/VSN_1_1_176.json',
                    },
                    //Sandbox - S3
                    {
                        InternalID: 320567,
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'VSN_TEST_(268995)_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'VSN TEST (268995)',
                        URL:
                            'https://cdn.staging.pepperi.com/30014740/CustomizationFile/3435332d-21b1-4d7c-a5fa-a6a6923972fc/VSN_TEST_(268995)_1_1_176.json',
                    },
                    //Production - S3
                    {
                        InternalID: 305087,
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'CustomKits_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'CustomKits',
                        URL:
                            'https://cdn.pepperi.com/30013064/CustomizationFile/9e7b4493-c34f-457f-8ae7-553b9a9e7f5c/CustomKits_1_1_176.json',
                    },
                    //Production - S3
                    {
                        InternalID: 305088,
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'Custom_Kit_TEST_(268997)_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'Custom Kit TEST (268997)',
                        URL:
                            'https://cdn.pepperi.com/30013064/CustomizationFile/7beb1317-4ed5-42c7-b89f-87ae2a46ed09/Custom_Kit_TEST_(268997)_1_1_176.json',
                    },
                    //Production - S3
                    {
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'BillOnly_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'BillOnly',
                        URL: 'https://cdn.pepperi.com/TemporaryFiles/f0bd8e22-b31b-489e-accf-6f574f484325',
                    },
                    //Production - S3
                    {
                        InternalID: 305090,
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'FDP_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'FDP',
                        URL:
                            'https://cdn.pepperi.com/30013064/CustomizationFile/01c06a53-4617-4241-9855-89f40610893b/FDP_1_1_176.json',
                    },
                    //EU - S3
                    {
                        InternalID: 6718,
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'Label_Only_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'Label Only',
                        URL:
                            'https://eucdn.pepperi.com/30010075/CustomizationFile/7c44ef18-6c35-4109-8d7d-ce4cb5adb4e3/Label_Only_1_1_176.json',
                    },
                    //EU - S3
                    {
                        InternalID: 6719,
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'Update_Prices_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'Update Prices',
                        URL:
                            'https://eucdn.pepperi.com/30010075/CustomizationFile/bd46cc94-dc56-47af-bd23-345b45016315/Update_Prices_1_1_176.json',
                    },
                    //EU - S3
                    {
                        InternalID: 6721,
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'Winzer_Sales_Order_V2_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'Winzer Sales Order V2',
                        URL:
                            'https://eucdn.pepperi.com/30010075/CustomizationFile/7579ae17-b5c3-45e2-82cb-fff397d860e0/Winzer_Sales_Order_V2_1_1_176.json',
                    },
                    //EU - S3
                    {
                        InternalID: 6722,
                        Description: 'Exported from Winzer in 30.03.2021',
                        FileName: 'Sales_Order_DEV_V3_1_1_176.json',
                        MimeType: 'application/json',
                        Title: 'Sales Order DEV V3',
                        URL:
                            'https://eucdn.pepperi.com/30010075/CustomizationFile/bfd1b6c1-62a1-4b5f-958f-bbc95991a087/Sales_Order_DEV_V3_1_1_176.json',
                    },
                ];
            }

            describe('Test Transactions Override', () => {
                const testATDInternalID = testATD.InternalID; // 290418; //Production 'Automation ATD 1.1.165 2'
                for (let index = 0; index < TransactionsATDArr.length; index++) {
                    describe(`Tested ATD: ${TransactionsATDArr[index].Title}`, () => {
                        let afterATDExportResponse;
                        let beforeATDExportObj;
                        let afterATDExportObj;
                        let ATDExportObj;
                        let ATDExportResponse;
                        let ATDImportResponse;
                        it('Post ATD to Override Existing ATD', async () => {
                            const references = await fetch(TransactionsATDArr[index].URL)
                                .then((response) => response.json())
                                .then((atd) => atd.References);
                            const mappingResponse = await importExportATDService.exportMappingATD({
                                References: references,
                            });

                            ATDImportResponse = await importExportATDService
                                .importATD('transactions', testATDInternalID, {
                                    URL: TransactionsATDArr[index].URL,
                                    References: mappingResponse,
                                })
                                .then((res) => res.text())
                                .then((res) => (res ? JSON.parse(res) : ''));

                            expect(ATDImportResponse).to.have.property('URI').that.contain('/audit_logs/');

                            let maxLoopsCounter = 90;
                            do {
                                generalService.sleep(2000);
                                ATDExportObj = await generalService.papiClient.get(ATDImportResponse.URI);
                                maxLoopsCounter--;
                            } while (
                                !ATDExportObj ||
                                !ATDExportObj.Status ||
                                (ATDExportObj.Status.ID == 2 && maxLoopsCounter > 0)
                            );

                            expect(ATDExportObj)
                                .to.have.property('AuditInfo')
                                .that.have.property('ResultObject')
                                .to.be.a('string')
                                .that.contains('InternalID');
                        });

                        it('Export The Overriden Transactions ATD', async () => {
                            expect(
                                (ATDExportResponse = await importExportATDService.exportATD(
                                    'transactions',
                                    testATDInternalID,
                                )),
                            )
                                .to.have.property('URI')
                                .that.contain('/audit_logs/');

                            let maxLoopsCounter = 90;
                            do {
                                generalService.sleep(2000);
                                ATDExportObj = await generalService.papiClient.get(ATDExportResponse.URI);
                                maxLoopsCounter--;
                            } while (
                                !ATDExportObj ||
                                !ATDExportObj.Status ||
                                (ATDExportObj.Status.ID == 2 && maxLoopsCounter > 0)
                            );

                            afterATDExportResponse = JSON.parse(ATDExportObj.AuditInfo.ResultObject);

                            expect(afterATDExportResponse)
                                .to.have.property('URL')
                                .that.contain('https://')
                                .and.contain('cdn.')
                                .and.contain('/TemporaryFiles/');

                            beforeATDExportObj = await fetch(TransactionsATDArr[index].URL).then((response) =>
                                response.json(),
                            );

                            afterATDExportObj = await fetch(afterATDExportResponse.URL).then((response) =>
                                response.json(),
                            );

                            RemoveUntestedMembers(beforeATDExportObj);
                            RemoveUntestedMembers(afterATDExportObj);

                            if (
                                Math.abs(
                                    JSON.stringify(afterATDExportObj).length -
                                        JSON.stringify(beforeATDExportObj).length,
                                ) > 10
                            ) {
                                expect(`The Content Length of: ${afterATDExportResponse.URL}`).to.equal(
                                    `The Content Length of: ${TransactionsATDArr[index].URL}`,
                                );
                            }
                        });

                        it(`New Total Length of: ${TransactionsATDArr[index].Title} is as expected`, async () => {
                            if (
                                Math.abs(
                                    JSON.stringify(afterATDExportObj).length -
                                        JSON.stringify(beforeATDExportObj).length,
                                ) > 10
                            ) {
                                expect(JSON.stringify(afterATDExportObj).length).to.equal(
                                    JSON.stringify(beforeATDExportObj).length,
                                );
                            }
                        });

                        it(`New Amount of: ${TransactionsATDArr[index].Title} - Data Views is as expected`, async () => {
                            expect(afterATDExportObj.DataViews.length).to.equal(beforeATDExportObj.DataViews.length);
                        });

                        it(`New Length of: ${TransactionsATDArr[index].Title} - Data Views is as expected`, async () => {
                            if (
                                Math.abs(
                                    JSON.stringify(afterATDExportObj.DataViews).length -
                                        JSON.stringify(beforeATDExportObj.DataViews).length,
                                ) > 2
                            ) {
                                beforeATDExportObj.DataViews.sort(compareByContextName);
                                afterATDExportObj.DataViews.sort(compareByContextName);

                                const beforeDataViewsArr = [] as any;
                                beforeATDExportObj.DataViews.forEach((DataView) => {
                                    beforeDataViewsArr.push({
                                        Before_Name: DataView.Context.Name,
                                        Length: JSON.stringify(DataView).length,
                                        Obj: DataView,
                                    });
                                });

                                const afterDataViewsArr = [] as any;
                                afterATDExportObj.DataViews.forEach((DataView) => {
                                    afterDataViewsArr.push({
                                        After_Name: DataView.Context.Name,
                                        Length: JSON.stringify(DataView).length,
                                        Obj: DataView,
                                    });
                                });

                                const forLoopSize =
                                    beforeDataViewsArr.length > afterDataViewsArr.length
                                        ? beforeDataViewsArr.length
                                        : afterDataViewsArr.length;
                                const errorsArr = [] as any;
                                for (let index = 0; index < forLoopSize; index++) {
                                    if (
                                        beforeDataViewsArr[
                                            index < beforeDataViewsArr.length ? index : beforeDataViewsArr.length - 1
                                        ].Length !=
                                        afterDataViewsArr[
                                            index < afterDataViewsArr.length ? index : afterDataViewsArr.length - 1
                                        ].Length
                                    ) {
                                        errorsArr.push(
                                            {
                                                Before:
                                                    beforeDataViewsArr[
                                                        index < beforeDataViewsArr.length
                                                            ? index
                                                            : beforeDataViewsArr.length - 1
                                                    ],
                                            },
                                            {
                                                After:
                                                    afterDataViewsArr[
                                                        index < afterDataViewsArr.length
                                                            ? index
                                                            : afterDataViewsArr.length - 1
                                                    ],
                                            },
                                        );
                                    }
                                }
                                expect(JSON.stringify(errorsArr)).to.equal('[]');
                            }
                        });

                        it(`New Amount of: ${TransactionsATDArr[index].Title} - Fields is as expected`, async () => {
                            expect(afterATDExportObj.Fields.length).to.equal(beforeATDExportObj.Fields.length);
                        });

                        it(`New Length of: ${TransactionsATDArr[index].Title} - Fields is as expected`, async () => {
                            if (
                                Math.abs(
                                    JSON.stringify(afterATDExportObj.Fields).length -
                                        JSON.stringify(beforeATDExportObj.Fields).length,
                                ) > 2
                            ) {
                                beforeATDExportObj.Fields.sort(compareByFieldID);
                                afterATDExportObj.Fields.sort(compareByFieldID);

                                const beforeFieldsArr = [] as any;
                                beforeATDExportObj.Fields.forEach((Field) => {
                                    beforeFieldsArr.push({
                                        Before_FieldID: Field.FieldID,
                                        Length: JSON.stringify(Field).length,
                                        Obj: Field,
                                    });
                                });

                                const afterFieldsArr = [] as any;
                                afterATDExportObj.Fields.forEach((Field) => {
                                    afterFieldsArr.push({
                                        After_FieldID: Field.FieldID,
                                        Length: JSON.stringify(Field).length,
                                        Obj: Field,
                                    });
                                });

                                const forLoopSize =
                                    beforeFieldsArr.length > afterFieldsArr.length
                                        ? beforeFieldsArr.length
                                        : afterFieldsArr.length;
                                const errorsArr = [] as any;

                                for (let index = 0; index < forLoopSize; index++) {
                                    if (
                                        beforeFieldsArr[
                                            index < beforeFieldsArr.length ? index : beforeFieldsArr.length - 1
                                        ].Length !=
                                        afterFieldsArr[
                                            index < afterFieldsArr.length ? index : afterFieldsArr.length - 1
                                        ].Length
                                    ) {
                                        errorsArr.push(
                                            {
                                                Before:
                                                    beforeFieldsArr[
                                                        index < beforeFieldsArr.length
                                                            ? index
                                                            : beforeFieldsArr.length - 1
                                                    ],
                                            },
                                            {
                                                After:
                                                    afterFieldsArr[
                                                        index < afterFieldsArr.length
                                                            ? index
                                                            : afterFieldsArr.length - 1
                                                    ],
                                            },
                                        );
                                    }
                                }
                                expect(JSON.stringify(errorsArr)).to.equal('[]');
                            }
                        });

                        it(`New Amount of: ${TransactionsATDArr[index].Title} - LineFields is as expected`, async () => {
                            expect(afterATDExportObj.LineFields.length).to.equal(beforeATDExportObj.LineFields.length);
                        });

                        it(`New Length of: ${TransactionsATDArr[index].Title} - LineFields is as expected`, async () => {
                            if (
                                Math.abs(
                                    JSON.stringify(afterATDExportObj.LineFields).length -
                                        JSON.stringify(beforeATDExportObj.LineFields).length,
                                ) > 2
                            ) {
                                beforeATDExportObj.LineFields.sort(compareByFieldID);
                                afterATDExportObj.LineFields.sort(compareByFieldID);

                                const beforeLineFieldsArr = [] as any;
                                beforeATDExportObj.LineFields.forEach((LineField) => {
                                    beforeLineFieldsArr.push({
                                        Before_Name: LineField.FieldID,
                                        Length: JSON.stringify(LineField).length,
                                        Obj: LineField,
                                    });
                                });

                                const afterLineFieldsArr = [] as any;
                                afterATDExportObj.LineFields.forEach((LineField) => {
                                    afterLineFieldsArr.push({
                                        After_Name: LineField.FieldID,
                                        Length: JSON.stringify(LineField).length,
                                        Obj: LineField,
                                    });
                                });

                                const forLoopSize =
                                    beforeLineFieldsArr.length > afterLineFieldsArr.length
                                        ? beforeLineFieldsArr.length
                                        : afterLineFieldsArr.length;
                                const errorsArr = [] as any;
                                for (let index = 0; index < forLoopSize; index++) {
                                    if (
                                        beforeLineFieldsArr[
                                            index < beforeLineFieldsArr.length ? index : beforeLineFieldsArr.length - 1
                                        ].Length !=
                                        afterLineFieldsArr[
                                            index < afterLineFieldsArr.length ? index : afterLineFieldsArr.length - 1
                                        ].Length
                                    ) {
                                        errorsArr.push(
                                            {
                                                Before:
                                                    beforeLineFieldsArr[
                                                        index < beforeLineFieldsArr.length
                                                            ? index
                                                            : beforeLineFieldsArr.length - 1
                                                    ],
                                            },
                                            {
                                                After:
                                                    afterLineFieldsArr[
                                                        index < afterLineFieldsArr.length
                                                            ? index
                                                            : afterLineFieldsArr.length - 1
                                                    ],
                                            },
                                        );
                                    }
                                }
                                expect(JSON.stringify(errorsArr)).to.equal('[]');
                            }
                        });

                        it(`New Amount of: ${TransactionsATDArr[index].Title} - References is as expected`, async () => {
                            expect(afterATDExportObj.References.length).to.equal(beforeATDExportObj.References.length);
                        });

                        it(`Hidden References of: ${TransactionsATDArr[index].Title} (DI-17304)`, async () => {
                            for (let index = 0; index < beforeATDExportObj.References.length; index++) {
                                if (beforeATDExportObj.References[index].Type == 'user_defined_table') {
                                    const tmpContent = JSON.parse(beforeATDExportObj.References[index].Content);
                                    if (tmpContent.Hidden) {
                                        tmpContent.Hidden = false;
                                        beforeATDExportObj.References[index].Content = JSON.stringify(tmpContent);

                                        const beforeHiddenReference = beforeATDExportObj.References[index];

                                        afterATDExportObj.References.forEach((Reference) => {
                                            if (Reference.Name == beforeHiddenReference.Name) {
                                                expect(JSON.parse(Reference.Content).Hidden).to.be.false;
                                            }
                                        });
                                    }
                                }
                            }
                        });

                        it(`New Length of: ${TransactionsATDArr[index].Title} - References is as expected`, async () => {
                            if (
                                Math.abs(
                                    JSON.stringify(afterATDExportObj.References).length -
                                        JSON.stringify(beforeATDExportObj.References).length,
                                ) > 2
                            ) {
                                beforeATDExportObj.References.sort(compareByName);
                                afterATDExportObj.References.sort(compareByName);

                                const beforeReferenceArr = [] as any;
                                beforeATDExportObj.References.forEach((Reference) => {
                                    beforeReferenceArr.push({
                                        Before_Name: Reference.Name,
                                        Length: JSON.stringify(Reference).length,
                                        Obj: Reference,
                                    });
                                });

                                const afterReferenceArr = [] as any;
                                afterATDExportObj.References.forEach((Reference) => {
                                    afterReferenceArr.push({
                                        After_Name: Reference.Name,
                                        Length: JSON.stringify(Reference).length,
                                        Obj: Reference,
                                    });
                                });

                                const forLoopSize =
                                    beforeReferenceArr.length > afterReferenceArr.length
                                        ? beforeReferenceArr.length
                                        : afterReferenceArr.length;

                                const errorsArr = [] as any;
                                for (let index = 0; index < forLoopSize; index++) {
                                    if (
                                        beforeReferenceArr[
                                            index < beforeReferenceArr.length ? index : beforeReferenceArr.length - 1
                                        ].Length !=
                                        afterReferenceArr[
                                            index < afterReferenceArr.length ? index : afterReferenceArr.length - 1
                                        ].Length
                                    ) {
                                        errorsArr.push(
                                            {
                                                Before:
                                                    beforeReferenceArr[
                                                        index < beforeReferenceArr.length
                                                            ? index
                                                            : beforeReferenceArr.length - 1
                                                    ],
                                            },
                                            {
                                                After:
                                                    afterReferenceArr[
                                                        index < afterReferenceArr.length
                                                            ? index
                                                            : afterReferenceArr.length - 1
                                                    ],
                                            },
                                        );
                                    }
                                }
                                expect.fail(
                                    `These items are not match: ${JSON.stringify(errorsArr)}, The URL Before: ${
                                        TransactionsATDArr[index].URL
                                    }, The URL After of: ${afterATDExportResponse.URL}`,
                                );
                            }
                        });

                        it(`New Amount of: ${TransactionsATDArr[index].Title} - Settings is as expected`, async () => {
                            expect(afterATDExportObj.Settings.length).to.equal(beforeATDExportObj.Settings.length);
                        });

                        it(`New Length of: ${TransactionsATDArr[index].Title} - Settings is as expected`, async () => {
                            const errorsArr = [] as any;
                            if (
                                Math.abs(
                                    JSON.stringify(afterATDExportObj.Settings).length -
                                        JSON.stringify(beforeATDExportObj.Settings).length,
                                ) > 2
                            ) {
                                errorsArr.push(
                                    {
                                        Before_Settings: beforeATDExportObj.Settings,
                                        Length: JSON.stringify(beforeATDExportObj.Settings).length,
                                        Obj: beforeATDExportObj.Settings,
                                    },
                                    {
                                        After_Settings: afterATDExportObj.Settings,
                                        Length: JSON.stringify(afterATDExportObj.Settings).length,
                                        Obj: afterATDExportObj.Settings,
                                    },
                                );
                            }
                            expect(JSON.stringify(errorsArr)).to.equal('[]');
                        });

                        it(`Test Icon of: ${TransactionsATDArr[index].Title}`, async () => {
                            if (afterATDExportObj.Settings.Icon != beforeATDExportObj.Settings.Icon) {
                                expect.fail(
                                    `${afterATDExportObj.Settings.Icon} to equal ${beforeATDExportObj.Settings.Icon}, The URL Before: ${TransactionsATDArr[index].URL}, The URL After of: ${afterATDExportResponse.URL}`,
                                );
                            }
                        });

                        it(`Test InventoryLimitation.Name of: ${TransactionsATDArr[index].Title}`, async () => {
                            if (
                                afterATDExportObj.Settings.InventoryLimitation?.Name !=
                                beforeATDExportObj.Settings.InventoryLimitation?.Name
                            ) {
                                expect.fail(
                                    `These items are not the same: Before: ${beforeATDExportObj.Settings.InventoryLimitation?.Name} and After: ${afterATDExportObj.Settings.InventoryLimitation?.Name}, The URL Before: ${TransactionsATDArr[index].URL}, The URL After of: ${afterATDExportResponse.URL}`,
                                );
                            }
                        });

                        it(`Test CaseQuantityLimitation.Name of: ${TransactionsATDArr[index].Title}`, async () => {
                            if (
                                afterATDExportObj.Settings.CaseQuantityLimitation?.Name !=
                                beforeATDExportObj.Settings.CaseQuantityLimitation?.Name
                            ) {
                                expect(afterATDExportObj.Settings.CaseQuantityLimitation?.Name).to.equal(
                                    beforeATDExportObj.Settings.CaseQuantityLimitation?.Name,
                                );
                                expect.fail(
                                    `These items are not the same: Before: ${beforeATDExportObj.Settings.CaseQuantityLimitation?.Name} and After: ${afterATDExportObj.Settings.CaseQuantityLimitation?.Name}, The URL Before: ${TransactionsATDArr[index].URL}, The URL After of: ${afterATDExportResponse.URL}`,
                                );
                            }
                        });

                        //TODO: 28.02.2021 it was decided with Hadar that this should be tested with the meta_data/filters/id tests
                        // it(`Test TransactionLinesFilter.advancedFormula of: ${TransactionsATDArr[index].Title}`, async () => {
                        //     if (
                        //         afterATDExportObj.Settings.TransactionLinesFilter?.advancedFormula !=
                        //         beforeATDExportObj.Settings.TransactionLinesFilter?.advancedFormula
                        //     ) {
                        //         expect.fail(
                        //             `These items are not the same: Before: ${beforeATDExportObj.Settings.TransactionLinesFilter?.advancedFormula} and After: ${afterATDExportObj.Settings.TransactionLinesFilter?.advancedFormula}, The URL Before: ${TransactionsATDArr[index].URL}, The URL After of: ${afterATDExportResponse.URL}`,
                        //         );
                        //     }
                        // });

                        it(`New Amount of: ${TransactionsATDArr[index].Title} - Workflow is as expected`, async () => {
                            expect(afterATDExportObj.Workflow.length).to.equal(beforeATDExportObj.Workflow.length);
                        });

                        it(`New Length of: ${TransactionsATDArr[index].Title} - Workflow is as expected`, async () => {
                            const errorsArr = [] as any;
                            if (
                                Math.abs(
                                    JSON.stringify(afterATDExportObj.Workflow).length -
                                        JSON.stringify(beforeATDExportObj.Workflow).length,
                                ) > 2
                            ) {
                                errorsArr.push(
                                    {
                                        Before_Settings: beforeATDExportObj.Workflow,
                                        Length: JSON.stringify(beforeATDExportObj.Workflow).length,
                                        Obj: beforeATDExportObj.Workflow,
                                    },
                                    {
                                        After_Settings: afterATDExportObj.Workflow,
                                        Length: JSON.stringify(afterATDExportObj.Workflow).length,
                                        Obj: afterATDExportObj.Workflow,
                                    },
                                );
                            }
                            expect(JSON.stringify(errorsArr)).to.equal('[]');
                        });
                    });
                }
            });
        }

        if (isLocalFilesComparison) {
            describe('Test Local Response URL', () => {
                describe(`Tested ATD URL: ${beforeURL}`, () => {
                    let beforeATDExportObj;
                    let afterATDExportObj;

                    it("Export JSON Objects From Both URL's", async () => {
                        beforeATDExportObj = await fetch(beforeURL).then((response) => response.json());

                        afterATDExportObj = await fetch(afterURL).then((response) => response.json());

                        RemoveUntestedMembers(beforeATDExportObj);
                        RemoveUntestedMembers(afterATDExportObj);

                        if (
                            Math.abs(
                                JSON.stringify(afterATDExportObj).length - JSON.stringify(beforeATDExportObj).length,
                            ) > 10
                        ) {
                            expect(`The Content Length of: ${afterURL}`).to.equal(
                                `The Content Length of: ${beforeURL}`,
                            );
                        }
                    });

                    it(`New Total Length of: ${beforeURL} is as expected`, async () => {
                        if (
                            Math.abs(
                                JSON.stringify(afterATDExportObj).length - JSON.stringify(beforeATDExportObj).length,
                            ) > 10
                        ) {
                            expect(JSON.stringify(afterATDExportObj).length).to.equal(
                                JSON.stringify(beforeATDExportObj).length,
                            );
                        }
                    });

                    it(`New Amount of: ${beforeURL} - Data Views is as expected`, async () => {
                        expect(afterATDExportObj.DataViews.length).to.equal(beforeATDExportObj.DataViews.length);
                    });

                    it(`New Length of: ${beforeURL} - Data Views is as expected`, async () => {
                        if (
                            Math.abs(
                                JSON.stringify(afterATDExportObj.DataViews).length -
                                    JSON.stringify(beforeATDExportObj.DataViews).length,
                            ) > 2
                        ) {
                            beforeATDExportObj.DataViews.sort(compareByContextName);
                            afterATDExportObj.DataViews.sort(compareByContextName);

                            const beforeDataViewsArr = [] as any;
                            beforeATDExportObj.DataViews.forEach((DataView) => {
                                beforeDataViewsArr.push({
                                    Before_Name: DataView.Context.Name,
                                    Length: JSON.stringify(DataView).length,
                                    Obj: DataView,
                                });
                            });

                            const afterDataViewsArr = [] as any;
                            afterATDExportObj.DataViews.forEach((DataView) => {
                                afterDataViewsArr.push({
                                    After_Name: DataView.Context.Name,
                                    Length: JSON.stringify(DataView).length,
                                    Obj: DataView,
                                });
                            });

                            const forLoopSize =
                                beforeDataViewsArr.length > afterDataViewsArr.length
                                    ? beforeDataViewsArr.length
                                    : afterDataViewsArr.length;
                            const errorsArr = [] as any;
                            for (let index = 0; index < forLoopSize; index++) {
                                if (
                                    beforeDataViewsArr[
                                        index < beforeDataViewsArr.length ? index : beforeDataViewsArr.length - 1
                                    ].Length !=
                                    afterDataViewsArr[
                                        index < afterDataViewsArr.length ? index : afterDataViewsArr.length - 1
                                    ].Length
                                ) {
                                    errorsArr.push(
                                        {
                                            Before:
                                                beforeDataViewsArr[
                                                    index < beforeDataViewsArr.length
                                                        ? index
                                                        : beforeDataViewsArr.length - 1
                                                ],
                                        },
                                        {
                                            After:
                                                afterDataViewsArr[
                                                    index < afterDataViewsArr.length
                                                        ? index
                                                        : afterDataViewsArr.length - 1
                                                ],
                                        },
                                    );
                                }
                            }
                            expect(JSON.stringify(errorsArr)).to.equal('[]');
                        }
                    });

                    it(`New Amount of: ${beforeURL} - Fields is as expected`, async () => {
                        expect(afterATDExportObj.Fields.length).to.equal(beforeATDExportObj.Fields.length);
                    });

                    it(`New Length of: ${beforeURL} - Fields is as expected`, async () => {
                        if (
                            Math.abs(
                                JSON.stringify(afterATDExportObj.Fields).length -
                                    JSON.stringify(beforeATDExportObj.Fields).length,
                            ) > 2
                        ) {
                            beforeATDExportObj.Fields.sort(compareByFieldID);
                            afterATDExportObj.Fields.sort(compareByFieldID);

                            const beforeFieldsArr = [] as any;
                            beforeATDExportObj.Fields.forEach((Field) => {
                                beforeFieldsArr.push({
                                    Before_FieldID: Field.FieldID,
                                    Length: JSON.stringify(Field).length,
                                    Obj: Field,
                                });
                            });

                            const afterFieldsArr = [] as any;
                            afterATDExportObj.Fields.forEach((Field) => {
                                afterFieldsArr.push({
                                    After_FieldID: Field.FieldID,
                                    Length: JSON.stringify(Field).length,
                                    Obj: Field,
                                });
                            });

                            const forLoopSize =
                                beforeFieldsArr.length > afterFieldsArr.length
                                    ? beforeFieldsArr.length
                                    : afterFieldsArr.length;
                            const errorsArr = [] as any;

                            for (let index = 0; index < forLoopSize; index++) {
                                if (
                                    beforeFieldsArr[index < beforeFieldsArr.length ? index : beforeFieldsArr.length - 1]
                                        .Length !=
                                    afterFieldsArr[index < afterFieldsArr.length ? index : afterFieldsArr.length - 1]
                                        .Length
                                ) {
                                    errorsArr.push(
                                        {
                                            Before:
                                                beforeFieldsArr[
                                                    index < beforeFieldsArr.length ? index : beforeFieldsArr.length - 1
                                                ],
                                        },
                                        {
                                            After:
                                                afterFieldsArr[
                                                    index < afterFieldsArr.length ? index : afterFieldsArr.length - 1
                                                ],
                                        },
                                    );
                                }
                            }
                            expect(JSON.stringify(errorsArr)).to.equal('[]');
                        }
                    });

                    it(`New Amount of: ${beforeURL} - LineFields is as expected`, async () => {
                        expect(afterATDExportObj.LineFields.length).to.equal(beforeATDExportObj.LineFields.length);
                    });

                    it(`New Length of: ${beforeURL} - LineFields is as expected`, async () => {
                        if (
                            Math.abs(
                                JSON.stringify(afterATDExportObj.LineFields).length -
                                    JSON.stringify(beforeATDExportObj.LineFields).length,
                            ) > 2
                        ) {
                            beforeATDExportObj.LineFields.sort(compareByFieldID);
                            afterATDExportObj.LineFields.sort(compareByFieldID);

                            const beforeLineFieldsArr = [] as any;
                            beforeATDExportObj.LineFields.forEach((LineField) => {
                                beforeLineFieldsArr.push({
                                    Before_Name: LineField.FieldID,
                                    Length: JSON.stringify(LineField).length,
                                    Obj: LineField,
                                });
                            });

                            const afterLineFieldsArr = [] as any;
                            afterATDExportObj.LineFields.forEach((LineField) => {
                                afterLineFieldsArr.push({
                                    After_Name: LineField.FieldID,
                                    Length: JSON.stringify(LineField).length,
                                    Obj: LineField,
                                });
                            });

                            const forLoopSize =
                                beforeLineFieldsArr.length > afterLineFieldsArr.length
                                    ? beforeLineFieldsArr.length
                                    : afterLineFieldsArr.length;
                            const errorsArr = [] as any;
                            for (let index = 0; index < forLoopSize; index++) {
                                if (
                                    beforeLineFieldsArr[
                                        index < beforeLineFieldsArr.length ? index : beforeLineFieldsArr.length - 1
                                    ].Length !=
                                    afterLineFieldsArr[
                                        index < afterLineFieldsArr.length ? index : afterLineFieldsArr.length - 1
                                    ].Length
                                ) {
                                    errorsArr.push(
                                        {
                                            Before:
                                                beforeLineFieldsArr[
                                                    index < beforeLineFieldsArr.length
                                                        ? index
                                                        : beforeLineFieldsArr.length - 1
                                                ],
                                        },
                                        {
                                            After:
                                                afterLineFieldsArr[
                                                    index < afterLineFieldsArr.length
                                                        ? index
                                                        : afterLineFieldsArr.length - 1
                                                ],
                                        },
                                    );
                                }
                            }
                            expect(JSON.stringify(errorsArr)).to.equal('[]');
                        }
                    });

                    it(`New Amount of: ${beforeURL} - References is as expected`, async () => {
                        expect(afterATDExportObj.References.length).to.equal(beforeATDExportObj.References.length);
                    });

                    it(`Hidden References of: ${beforeURL} (DI-17304)`, async () => {
                        for (let index = 0; index < beforeATDExportObj.References.length; index++) {
                            if (beforeATDExportObj.References[index].Type == 'user_defined_table') {
                                const tmpContent = JSON.parse(beforeATDExportObj.References[index].Content);
                                if (tmpContent.Hidden) {
                                    tmpContent.Hidden = false;
                                    beforeATDExportObj.References[index].Content = JSON.stringify(tmpContent);

                                    const beforeHiddenReference = beforeATDExportObj.References[index];

                                    afterATDExportObj.References.forEach((Reference) => {
                                        if (Reference.Name == beforeHiddenReference.Name) {
                                            expect(JSON.parse(Reference.Content).Hidden).to.be.false;
                                        }
                                    });
                                }
                            }
                        }
                    });

                    it(`New Length of: ${beforeURL} - References is as expected`, async () => {
                        if (
                            Math.abs(
                                JSON.stringify(afterATDExportObj.References).length -
                                    JSON.stringify(beforeATDExportObj.References).length,
                            ) > 2
                        ) {
                            beforeATDExportObj.References.sort(compareByName);
                            afterATDExportObj.References.sort(compareByName);

                            const beforeReferenceArr = [] as any;
                            beforeATDExportObj.References.forEach((Reference) => {
                                beforeReferenceArr.push({
                                    Before_Name: Reference.Name,
                                    Length: JSON.stringify(Reference).length,
                                    Obj: Reference,
                                });
                            });

                            const afterReferenceArr = [] as any;
                            afterATDExportObj.References.forEach((Reference) => {
                                afterReferenceArr.push({
                                    After_Name: Reference.Name,
                                    Length: JSON.stringify(Reference).length,
                                    Obj: Reference,
                                });
                            });

                            const forLoopSize =
                                beforeReferenceArr.length > afterReferenceArr.length
                                    ? beforeReferenceArr.length
                                    : afterReferenceArr.length;

                            const errorsArr = [] as any;
                            for (let index = 0; index < forLoopSize; index++) {
                                if (
                                    beforeReferenceArr[
                                        index < beforeReferenceArr.length ? index : beforeReferenceArr.length - 1
                                    ].Length !=
                                    afterReferenceArr[
                                        index < afterReferenceArr.length ? index : afterReferenceArr.length - 1
                                    ].Length
                                ) {
                                    errorsArr.push(
                                        {
                                            Before:
                                                beforeReferenceArr[
                                                    index < beforeReferenceArr.length
                                                        ? index
                                                        : beforeReferenceArr.length - 1
                                                ],
                                        },
                                        {
                                            After:
                                                afterReferenceArr[
                                                    index < afterReferenceArr.length
                                                        ? index
                                                        : afterReferenceArr.length - 1
                                                ],
                                        },
                                    );
                                }
                            }
                            expect.fail(
                                `These items are not match: ${JSON.stringify(
                                    errorsArr,
                                )}, The URL Before: ${beforeURL}, The URL After of: ${afterURL}`,
                            );
                        }
                    });

                    it(`New Amount of: ${beforeURL} - Settings is as expected`, async () => {
                        expect(afterATDExportObj.Settings.length).to.equal(beforeATDExportObj.Settings.length);
                    });

                    it(`New Length of: ${beforeURL} - Settings is as expected`, async () => {
                        const errorsArr = [] as any;
                        if (
                            Math.abs(
                                JSON.stringify(afterATDExportObj.Settings).length -
                                    JSON.stringify(beforeATDExportObj.Settings).length,
                            ) > 2
                        ) {
                            errorsArr.push(
                                {
                                    Before_Settings: beforeATDExportObj.Settings,
                                    Length: JSON.stringify(beforeATDExportObj.Settings).length,
                                    Obj: beforeATDExportObj.Settings,
                                },
                                {
                                    After_Settings: afterATDExportObj.Settings,
                                    Length: JSON.stringify(afterATDExportObj.Settings).length,
                                    Obj: afterATDExportObj.Settings,
                                },
                            );
                        }
                        expect(JSON.stringify(errorsArr)).to.equal('[]');
                    });

                    it(`Test Icon of: ${beforeURL}`, async () => {
                        if (afterATDExportObj.Settings.Icon != beforeATDExportObj.Settings.Icon) {
                            expect.fail(
                                `${afterATDExportObj.Settings.Icon} to equal ${beforeATDExportObj.Settings.Icon}, The URL Before: ${beforeURL}, The URL After of: ${afterURL}`,
                            );
                        }
                    });

                    it(`Test InventoryLimitation.Name of: ${beforeURL}`, async () => {
                        if (
                            afterATDExportObj.Settings.InventoryLimitation?.Name !=
                            beforeATDExportObj.Settings.InventoryLimitation?.Name
                        ) {
                            expect.fail(
                                `These items are not the same: Before: ${beforeATDExportObj.Settings.InventoryLimitation?.Name} and After: ${afterATDExportObj.Settings.InventoryLimitation?.Name}, The URL Before: ${beforeURL}, The URL After of: ${afterURL}`,
                            );
                        }
                    });

                    it(`Test CaseQuantityLimitation.Name of: ${beforeURL}`, async () => {
                        if (
                            afterATDExportObj.Settings.CaseQuantityLimitation?.Name !=
                            beforeATDExportObj.Settings.CaseQuantityLimitation?.Name
                        ) {
                            expect(afterATDExportObj.Settings.CaseQuantityLimitation?.Name).to.equal(
                                beforeATDExportObj.Settings.CaseQuantityLimitation?.Name,
                            );
                            expect.fail(
                                `These items are not the same: Before: ${beforeATDExportObj.Settings.CaseQuantityLimitation?.Name} and After: ${afterATDExportObj.Settings.CaseQuantityLimitation?.Name}, The URL Before: ${beforeURL}, The URL After of: ${afterURL}`,
                            );
                        }
                    });

                    //TODO: 28.02.2021 it was decided with Hadar that this should be tested with the meta_data/filters/id tests
                    // it(`Test TransactionLinesFilter.advancedFormula of: ${TransactionsATDArr[index].Title}`, async () => {
                    //     if (
                    //         afterATDExportObj.Settings.TransactionLinesFilter?.advancedFormula !=
                    //         beforeATDExportObj.Settings.TransactionLinesFilter?.advancedFormula
                    //     ) {
                    //         expect.fail(
                    //             `These items are not the same: Before: ${beforeATDExportObj.Settings.TransactionLinesFilter?.advancedFormula} and After: ${afterATDExportObj.Settings.TransactionLinesFilter?.advancedFormula}, The URL Before: ${TransactionsATDArr[index].URL}, The URL After of: ${afterATDExportResponse.URL}`,
                    //         );
                    //     }
                    // });

                    it(`New Amount of: ${beforeURL} - Workflow is as expected`, async () => {
                        expect(afterATDExportObj.Workflow.length).to.equal(beforeATDExportObj.Workflow.length);
                    });

                    it(`New Length of: ${beforeURL} - Workflow is as expected`, async () => {
                        const errorsArr = [] as any;
                        if (
                            Math.abs(
                                JSON.stringify(afterATDExportObj.Workflow).length -
                                    JSON.stringify(beforeATDExportObj.Workflow).length,
                            ) > 2
                        ) {
                            errorsArr.push(
                                {
                                    Before_Settings: beforeATDExportObj.Workflow,
                                    Length: JSON.stringify(beforeATDExportObj.Workflow).length,
                                    Obj: beforeATDExportObj.Workflow,
                                },
                                {
                                    After_Settings: afterATDExportObj.Workflow,
                                    Length: JSON.stringify(afterATDExportObj.Workflow).length,
                                    Obj: afterATDExportObj.Workflow,
                                },
                            );
                        }
                        expect(JSON.stringify(errorsArr)).to.equal('[]');
                    });
                });
            });
        }

        if (isActivitiesTestsOverride) {
            // describe('Test Activities Override', () => {
            //     it('Make sure an ATD removed in the end of the tests', async () => {
            //         //Make sure an ATD removed in the end of the tests
            //         return expect(TestCleanUpATD(importExportATDService)).eventually.to.be.above(0);
            //     });
            //     it('Make sure an UDT removed in the end of the tests', async () => {
            //         //Make sure an ATD removed in the end of the tests
            //         return expect(TestCleanUpUDT(importExportATDService)).eventually.to.be.above(0);
            //     });
            // });
        }
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

//Remove untested members from the tested Object
function RemoveUntestedMembers(testedObject) {
    if (testedObject.Addons) {
        delete testedObject.Addons;
    }
    delete testedObject.Settings?.EPayment;
    delete testedObject.Settings?.CatalogIDs;
    delete testedObject.Settings?.TransactionItemsScopeFilterID;
    delete testedObject.Settings?.DestinationAccountsData.IDs;
    delete testedObject.ExternalID;
    delete testedObject.Description;
    delete testedObject.CreationDateTime;
    delete testedObject.ModificationDateTime;
    for (let index = 0; index < testedObject.LineFields?.length; index++) {
        delete testedObject.LineFields[index].CreationDateTime;
        delete testedObject.LineFields[index].ModificationDateTime;
        delete testedObject.LineFields[index].InternalID;
        delete testedObject.LineFields[index].CSVMappedColumnName;
        //This was removed since it was tested manually by Oren Vilderman and all values worked
        //it can contianl objects and arrays but of they are emtpy then this comparison will fail since comparing empty array to nulll
        if (testedObject.LineFields[index].Type == 'Boolean') {
            delete testedObject.LineFields[index].TypeSpecificFields;
        }
        //readOnlyDisplayValue was an old field and if its value is null or empty then it will not be created
        if (
            testedObject.LineFields[index].TypeSpecificFields &&
            testedObject.LineFields[index].TypeSpecificFields.readOnlyDisplayValue == ''
        ) {
            delete testedObject.LineFields[index].TypeSpecificFields;
        }
        //TypeSpecificFields is some times null with emtpy null data membes, so better to remove it from the comparison in case its null
        if ((testedObject.LineFields[index].TypeSpecificFields = '')) {
            delete testedObject.LineFields[index].TypeSpecificFields;
        }
    }
    for (let index = 0; index < testedObject.Fields.length; index++) {
        delete testedObject.Fields[index].CreationDateTime;
        delete testedObject.Fields[index].ModificationDateTime;
        delete testedObject.Fields[index].InternalID;
        delete testedObject.Fields[index].CSVMappedColumnName;
        if (
            testedObject.Fields[index].UserDefinedTableSource &&
            testedObject.Fields[index].UserDefinedTableSource.SecondaryKey
        ) {
            delete testedObject.Fields[index].UserDefinedTableSource.SecondaryKey;
        }
        //This was removed since it was tested manually by Oren Vilderman and all values worked
        //it can contianl objects and arrays but of they are emtpy then this comparison will fail since comparing empty array to nulll
        if (testedObject.Fields[index].Type == 'Boolean') {
            delete testedObject.Fields[index].TypeSpecificFields;
        }
        //readOnlyDisplayValue was an old field and if its value is null or empty then it will not be created
        if (
            testedObject.Fields[index].TypeSpecificFields &&
            testedObject.Fields[index].TypeSpecificFields.readOnlyDisplayValue == ''
        ) {
            delete testedObject.Fields[index].TypeSpecificFields;
        }
        //TypeSpecificFields is some times null with emtpy null data membes, so better to remove it from the comparison in case its null
        if ((testedObject.Fields[index].TypeSpecificFields = '')) {
            delete testedObject.Fields[index].TypeSpecificFields;
        }
    }
    for (let index = 0; index < testedObject.DataViews.length; index++) {
        delete testedObject.DataViews[index].CreationDateTime;
        delete testedObject.DataViews[index].ModificationDateTime;
        delete testedObject.DataViews[index].Context.Object.InternalID;
        delete testedObject.DataViews[index].Context.Object.Name;
        delete testedObject.DataViews[index].Context.Object.InternalID;
        delete testedObject.DataViews[index].InternalID;
        delete testedObject.DataViews[index].Context.Profile.InternalID;
    }
    for (let index = 0; index < testedObject.References.length; index++) {
        //Added in 24/02/2021 the 'Transaction Item Scope' is created automatically in the UI and won't be created in the API
        //Have to add ref and creating will not help
        if (testedObject.References[index].Name == 'Transaction Item Scope') {
            testedObject.References.splice(index, 1);
        }
    }
    for (let index = 0; index < testedObject.References.length; index++) {
        delete testedObject.References[index].ID;
        if (testedObject.References[index].Type == 'file_storage') {
            delete testedObject.References[index].Path;
        }
        if (testedObject.References[index].Type == 'user_defined_table') {
            const tmpContent = JSON.parse(testedObject.References[index].Content);
            delete tmpContent.InternalID;
            delete tmpContent.CreationDateTime;
            delete tmpContent.ModificationDateTime;
            testedObject.References[index].Content = JSON.stringify(tmpContent);
        }
    }
    for (let j = 0; j < testedObject.Workflow.WorkflowObject.WorkflowTransitions.length; j++) {
        for (
            let index = 0;
            index < testedObject.Workflow.WorkflowObject.WorkflowTransitions[j].Actions.length;
            index++
        ) {
            if (testedObject.Workflow.WorkflowObject.WorkflowTransitions[j].Actions[index].KeyValue) {
                if (testedObject.Workflow.WorkflowObject.WorkflowTransitions[j].Actions[index].KeyValue.HTML_FILE_ID) {
                    delete testedObject.Workflow.WorkflowObject.WorkflowTransitions[j].Actions[index].KeyValue
                        .HTML_FILE_ID;
                }
            }
        }
    }
    for (let j = 0; j < testedObject.Workflow.WorkflowObject.WorkflowPrograms.length; j++) {
        for (let index = 0; index < testedObject.Workflow.WorkflowObject.WorkflowPrograms[j].Actions.length; index++) {
            if (testedObject.Workflow.WorkflowObject.WorkflowPrograms[j].Actions[index].KeyValue) {
                if (testedObject.Workflow.WorkflowObject.WorkflowPrograms[j].Actions[index].KeyValue.HTML_FILE_ID) {
                    delete testedObject.Workflow.WorkflowObject.WorkflowPrograms[j].Actions[index].KeyValue
                        .HTML_FILE_ID;
                }
                if (
                    testedObject.Workflow.WorkflowObject.WorkflowPrograms[j].Actions[index].KeyValue.DESTINATION_ATD_ID
                ) {
                    delete testedObject.Workflow.WorkflowObject.WorkflowPrograms[j].Actions[index].KeyValue
                        .DESTINATION_ATD_ID;
                }
            }
        }
    }
    for (let index = 0; index < testedObject.Workflow.WorkflowReferences.length; index++) {
        delete testedObject.Workflow.WorkflowReferences[index].ID;
    }
}

function compareByName(a, b) {
    const beforeName = a.Name;
    const afterName = b.Name;

    let comparison = 0;
    if (beforeName > afterName) {
        comparison = 1;
    } else if (beforeName < afterName) {
        comparison = -1;
    }
    return comparison;
}

function compareByContextName(a, b) {
    const beforeName = a.Context.Name;
    const afterName = b.Context.Name;

    let comparison = 0;
    if (beforeName > afterName) {
        comparison = 1;
    } else if (beforeName < afterName) {
        comparison = -1;
    }
    return comparison;
}

function compareByFieldID(a, b) {
    const beforeFieldID = a.FieldID;
    const afterFieldID = b.FieldID;

    let comparison = 0;
    if (beforeFieldID > afterFieldID) {
        comparison = 1;
    } else if (beforeFieldID < afterFieldID) {
        comparison = -1;
    }
    return comparison;
}
