import GeneralService, { TesterFunctions } from '../services/general.service';
//import { FieldsService } from '../services/fields.service';
import { ImportExportATDService } from '../services/import-export-atd.service';
import fetch from 'node-fetch';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

export async function PepperiNotificationServiceTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    const service = generalService.papiClient;
    //const fieldsService = new FieldsService(generalService.papiClient);
    const importExportATDService = new ImportExportATDService(generalService.papiClient);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

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
    let installedAddonsArr = await generalService.getAddons(dataViewsVarLatestVersion);
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
    installedAddonsArr = await generalService.getAddons(importExportATDVarLatestVersion);
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
        it(`Test Data: Tested Addon: ImportExportATD - Version: ${importExportATDInstalledAddonVersion}`, () => {
            expect(importExportATDInstalledAddonVersion).to.contain('.');
        });

        describe('Prerequisites Addon for ImportExportATD Tests', () => {
            it('Upgarde To Latest Version of Data Views Addon', async () => {
                expect(importExportATDService.exportATD('activities', 12312312))
                    .to.have.property('URI')
                    .that.contain('/audit_logs/');
            });

            it(`Latest Version Is Installed`, () => {
                expect(dataViewsInstalledAddonVersion).to.equal(dataViewsVarLatestVersion);
            });
        });

        describe('Endpoints', () => {
            describe('Get (DI-17200, DI-17258)', () => {
                it(`Export Activities ATD ${'dd'}`, async () => {
                    expect(importExportATDService.exportATD('activities', 12312312))
                        .to.have.property('URI')
                        .that.contain('/audit_logs/');

                    expect(JSON.parse('aaa'))
                        .to.have.property('URL')
                        .that.contain('https://')
                        .and.contain('cdn.')
                        .and.contain('/TemporaryFiles/');
                });
            });
        });
    });
}
