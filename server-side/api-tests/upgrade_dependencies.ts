import GeneralService, { TesterFunctions } from '../services/general.service';
import fetch from 'node-fetch';

export async function UpgradeDependenciesTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const service = generalService.papiClient;
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    describe('Upgrade Dependencies Addons', () => {
        const testData = {
            'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.5'],
            'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', 'V'],
            'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '16.50'],
            'Addons Manager': ['bd629d5f-a7b4-4d03-9e7c-67865a6d82a9', '0.'],
            'Data Views API': ['484e7f22-796a-45f8-9082-12a734bac4e8', '0.'],
            'Settings Framework': ['354c5123-a7d0-4f52-8fce-3cf1ebc95314', '9.5'],
        };

        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            describe(`${addonName}`, () => {
                let varLatestVersion;
                it('Upgarde To Latest Version', async () => {
                    varLatestVersion = await fetch(
                        `${generalService['client'].BaseURL}/var/addons/versions?where=AddonUUID='${addonUUID}' AND Version Like '${version}%'&order_by=CreationDateTime DESC`,
                        {
                            method: `GET`,
                            headers: {
                                Authorization: request.body.varKey,
                            },
                        },
                    ).then((response) => response.json());
                    varLatestVersion = varLatestVersion[0].Version;

                    await expect(service.addons.installedAddons.addonUUID(`${addonUUID}`).upgrade(varLatestVersion))
                        .eventually.to.have.property('ExecutionUUID')
                        .a('string')
                        .with.lengthOf(36)
                        .then(async (executionUUID) => {
                            generalService.sleep(4000); //Test installation status only after 4 seconds.
                            let auditLogResponse = await service.auditLogs.uuid(executionUUID).get();
                            if (auditLogResponse.Status.Name == 'InProgress') {
                                generalService.sleep(20000); //Wait another 20 seconds and try again (fail the test if client wait more then 20+4 seconds)
                                auditLogResponse = await service.auditLogs.uuid(executionUUID).get();
                            }
                            if (auditLogResponse.Status.Name == 'Failure') {
                                expect(auditLogResponse.AuditInfo.ErrorMessage).to.include(
                                    'is already working on version',
                                );
                            } else {
                                expect(auditLogResponse.Status.Name).to.include('Success');
                            }
                        });
                });

                it(`Latest Version Is Installed`, async () => {
                    await expect(service.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                        .eventually.to.have.property('Version')
                        .a('string')
                        .that.is.equal(varLatestVersion);
                });
            });
        }
    });
}
