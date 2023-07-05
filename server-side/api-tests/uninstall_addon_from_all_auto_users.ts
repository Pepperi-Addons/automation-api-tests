import GeneralService, { TesterFunctions } from '../services/general.service';
import { initiateTester } from '../services/general.service';

export async function UnistallAddonFromAllUsers(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    interface AutomationUser {
        email: string;
        pass: string;
        env: string;
    }

    const ADDON_UUID = 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f'; //TODO: get this from CLI

    const SBUsers: AutomationUser[] = [
        { email: 'DataIndexSB@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'DimxAppSB@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'AdalSB@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'PnsAppTestSB@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'CoreAppSB@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'UdcAppTestSB@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'schedulerAppTestSB@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'CpiDataTestSB@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'Tester5Automation@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'Yoni1@pepperitest.com', pass: '123456', env: 'stage' },
        { email: 'CodeJobAutomation@pepperitest.com', pass: '123456', env: 'stage' },
        { email: 'UITests2Jenkins@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'udcTestingSB@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'Neo4JSyncSB@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'febulaSB@pepperitest.com', pass: 'Aa123456', env: 'stage' },
        { email: 'syncNeo4JSB@pepperitest.com', pass: 'Aa123456', env: 'stage' },
    ];

    const ProdUsers: AutomationUser[] = [
        { email: 'AdalProd@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'DIMXAppProd@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'DataIndexProd@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'PfsCpiTestProd@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'PnsAppTestProd@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'CoreAppProd@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'UdcAppTestProd@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'schedulerAppTestProd@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'CpiDataTestProd@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'oren1@pepperitest.com', pass: '123456', env: 'prod' },
        { email: 'yoni1prod@pepperitest.com', pass: '123456', env: 'prod' },
        { email: 'UITests2Jenkins@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'udcTesting@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'Neo4JSyncProd@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'febulaProd@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'syncNeo4JProd@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'surveyTest@pepperitest.com', pass: 'Aa123456', env: 'prod' },
    ];

    const EUUsers: AutomationUser[] = [
        { email: 'AdalEU@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'DIMXAppEU@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'DataIndexEU@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'ido.h@pepperi.com', pass: '123456', env: 'prod' },
        { email: 'PnsAppTestEU@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'CoreAppEU@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'UdcAppTestEU@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'schedulerAppTestEU@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'CpiDataTestEU@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'oren.eu@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'UITests2Jenkins_EU@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'udcTestingEU2@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'neo4JSyncEU@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'febulaEU@pepperitest.com', pass: 'Aa123456', env: 'prod' },
        { email: 'syncNeo4JEU@pepperitest.com', pass: 'Aa123456', env: 'prod' },
    ];

    const whichEnvsToRuns = ['PROD']; //TODO: get this from CLI

    // let varKey;
    // if (generalService.papiClient['options'].baseURL.includes('staging')) {
    //     varKey = request.body.varKeyStage;
    // } else {
    //     varKey = request.body.varKeyPro;
    // }

    describe(`Uninstall A Certain Addon From All Test Users`, () => {
        if (whichEnvsToRuns.includes('SB'))
            it('uninstall SB', async () => {
                for (let index = 0; index < SBUsers.length; index++) {
                    const sbUser = SBUsers[index];
                    console.log(
                        `Deleting Addon: ${ADDON_UUID} From User: ${sbUser.email}, User Number: ${index + 1} Out Of ${
                            SBUsers.length
                        } SB Users`,
                    );
                    const client = await initiateTester(sbUser.email, sbUser.pass, sbUser.env);
                    const service = new GeneralService(client);
                    const response = await service.uninstallAddon(ADDON_UUID);
                    const auditLogResponseForUninstall = await service.getAuditLogResultObjectIfValid(
                        response.URI as string,
                        120,
                        7000,
                    );
                    expect((auditLogResponseForUninstall as any).Event.User.Email).to.equal(sbUser.email);
                    if (
                        (auditLogResponseForUninstall as any).Status.Name === 'Failure' &&
                        (auditLogResponseForUninstall as any).Status.ID === 0
                    ) {
                        expect(auditLogResponseForUninstall.AuditInfo.ErrorMessage).to.include(
                            `Cant uninstall - Addon with UUID ${ADDON_UUID} is not installed for distributor`,
                        );
                        console.log(`${sbUser.email} Had No Addon ${ADDON_UUID} Installed`);
                    } else {
                        expect((auditLogResponseForUninstall as any).Status.Name).to.equal('Success');
                        expect((auditLogResponseForUninstall as any).Status.ID).to.equal(1);
                        expect(auditLogResponseForUninstall.AuditInfo.Addon.UUID).to.equal(ADDON_UUID);
                        expect(auditLogResponseForUninstall.AuditInfo.Type).to.equal('uninstall');
                        const deletedVersion = auditLogResponseForUninstall.AuditInfo.FromVersion;
                        console.log(
                            `DELETED Addon ${ADDON_UUID}, Version: ${deletedVersion} From User ${sbUser.email}`,
                        );
                    }
                }
            });
        if (whichEnvsToRuns.includes('PROD'))
            it('uninstall Prod', async () => {
                for (let index = 0; index < ProdUsers.length; index++) {
                    const prodUser = ProdUsers[index];
                    console.log(
                        `Deleting Addon: ${ADDON_UUID} From User: ${prodUser.email}, User Number: ${index + 1} Out Of ${
                            ProdUsers.length
                        } PROD Users`,
                    );
                    const client = await initiateTester(prodUser.email, prodUser.pass, prodUser.env);
                    const service = new GeneralService(client);
                    const response = await service.uninstallAddon(ADDON_UUID);
                    const auditLogResponseForUninstall = await service.getAuditLogResultObjectIfValid(
                        response.URI as string,
                        120,
                        7000,
                    );
                    expect((auditLogResponseForUninstall as any).Event.User.Email).to.equal(prodUser.email);
                    if (
                        (auditLogResponseForUninstall as any).Status.Name === 'Failure' &&
                        (auditLogResponseForUninstall as any).Status.ID === 0
                    ) {
                        expect(auditLogResponseForUninstall.AuditInfo.ErrorMessage).to.include(
                            `Cant uninstall - Addon with UUID ${ADDON_UUID} is not installed for distributor`,
                        );
                        console.log(`${prodUser.email} Had No Addon ${ADDON_UUID} Installed`);
                    } else {
                        expect((auditLogResponseForUninstall as any).Status.Name).to.equal('Success');
                        expect((auditLogResponseForUninstall as any).Status.ID).to.equal(1);
                        expect(auditLogResponseForUninstall.AuditInfo.Addon.UUID).to.equal(ADDON_UUID);
                        expect(auditLogResponseForUninstall.AuditInfo.Type).to.equal('uninstall');
                        const deletedVersion = auditLogResponseForUninstall.AuditInfo.FromVersion;
                        console.log(
                            `DELETED Addon ${ADDON_UUID}, Version: ${deletedVersion} From User ${prodUser.email}`,
                        );
                    }
                }
            });
        if (whichEnvsToRuns.includes('EU'))
            it('uninstall EU', async () => {
                for (let index = 0; index < EUUsers.length; index++) {
                    const euUser = EUUsers[index];
                    console.log(
                        `Deleting Addon: ${ADDON_UUID} From User: ${euUser.email}, User Number: ${index + 1} Out Of ${
                            SBUsers.length
                        } EU Users`,
                    );
                    const client = await initiateTester(euUser.email, euUser.pass, euUser.env);
                    const service = new GeneralService(client);
                    const response = await service.uninstallAddon(ADDON_UUID);
                    const auditLogResponseForUninstall = await service.getAuditLogResultObjectIfValid(
                        response.URI as string,
                        120,
                        7000,
                    );
                    expect((auditLogResponseForUninstall as any).Event.User.Email).to.equal(euUser.email);
                    if (
                        (auditLogResponseForUninstall as any).Status.Name === 'Failure' &&
                        (auditLogResponseForUninstall as any).Status.ID === 0
                    ) {
                        expect(auditLogResponseForUninstall.AuditInfo.ErrorMessage).to.include(
                            `Cant uninstall - Addon with UUID ${ADDON_UUID} is not installed for distributor`,
                        );
                        console.log(`${euUser.email} Had No Addon ${ADDON_UUID} Installed`);
                    } else {
                        expect((auditLogResponseForUninstall as any).Status.Name).to.equal('Success');
                        expect((auditLogResponseForUninstall as any).Status.ID).to.equal(1);
                        expect(auditLogResponseForUninstall.AuditInfo.Addon.UUID).to.equal(ADDON_UUID);
                        expect(auditLogResponseForUninstall.AuditInfo.Type).to.equal('uninstall');
                        const deletedVersion = auditLogResponseForUninstall.AuditInfo.FromVersion;
                        console.log(
                            `DELETED Addon ${ADDON_UUID}, Version: ${deletedVersion} From User ${euUser.email}`,
                        );
                    }
                }
            });
    });
}
