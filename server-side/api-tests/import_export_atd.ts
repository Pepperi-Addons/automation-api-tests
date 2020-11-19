import GeneralService, { TesterFunctions } from '../services/general.service';
//import { FieldsService } from '../services/fields.service';
import { ImportExportATDService } from '../services/import-export-atd.service';
import fetch from 'node-fetch';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

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
        `${generalService['client'].BaseURL}/var/addons/versions?where=AddonUUID='${addonUUID}' AND Version Like '${version}%'&order_by=CreationDateTime DESC`,
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

    //#region Tests
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

        //#region Endpoints
        describe('Endpoints', () => {
            describe('Get', () => {
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
                        expect(JSON.stringify(mappingResponse.Mapping)).to.include('Destination');
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
                        expect(JSON.stringify(mappingResponse.Mapping)).to.include('Destination');
                    });
                }
            });

            // describe('Get', () => {
            //     it('Get Transaction With The Type Sales Order', async () => {
            //         return expect(transactionsTypeArr).to.have.property('Sales Order');
            //     });

            //     it('Get Sales Order Fields', async () => {
            //         const transactionTypes = await generalService.getTypes('transactions');
            //         const salesOrderTypeID = transactionTypes[0].TypeID;
            //         return expect(fieldsService.getFields('transactions', salesOrderTypeID))
            //             .eventually.to.be.an('array')
            //             .with.length.above(5);
            //     });

            //     it('Get An Activity TypeID', async () => {
            //         return expect(activitiesTypeArr[activitiesTypeArr[0]]).to.be.a('number').and.is.above(0);
            //     });
            // });
        });
    });
}
