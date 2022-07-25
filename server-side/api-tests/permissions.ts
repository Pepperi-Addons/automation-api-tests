import { PermissionsService } from '../services/permissions.service';
import GeneralService, { TesterFunctions } from '../services/general.service';

export async function PermissionsTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const permissionsService = new PermissionsService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade Data Index ADAL Pepperitest (Jenkins Special Addon)
    const testData = {
        'permission-manager': ['3c888823-8556-4956-a49c-77a189805d22', ''],
    };

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }

    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Upgrade Data Index ADAL Pepperitest (Jenkins Special Addon)

    describe('Permissions Tests Suites', () => {
        describe('Prerequisites Addon for Permissions Tests', () => {
            //Test Datas
            //Permissions
            isInstalledArr.forEach((isInstalled, index) => {
                it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
                    expect(isInstalled).to.be.true;
                });
            });

            for (const addonName in testData) {
                const addonUUID = testData[addonName][0];
                const version = testData[addonName][1];
                const varLatestVersion = chnageVersionResponseArr[addonName][2];
                const changeType = chnageVersionResponseArr[addonName][3];
                describe(`Test Data: ${addonName}`, () => {
                    it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                        if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                            expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                        } else {
                            expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                        }
                    });

                    it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(varLatestVersion);
                    });
                });
            }
        });

        describe('Permissions CRUD', () => {
            const policyName = 'AutomationTestPolicy' + Math.floor(Math.random() * 10000000)
            const addonUUID = generalService.papiClient['options'].addonUUID
            let startingPoliciesLength;
            it('Create Policy', async () => {
                startingPoliciesLength = await permissionsService.getPolicies();
                const createPolicyResponse = await permissionsService.createPolicy(
                    {
                        AddonUUID: addonUUID,
                        Name: policyName,
                        Description: 'Testing 1 2 3'
                    }
                );
                expect(createPolicyResponse).to.have.property('Key').that.equals(addonUUID + '_' + policyName);
                expect(createPolicyResponse).to.have.property('Name').that.equals(policyName);
                expect(createPolicyResponse).to.have.property('Description').that.equals('Testing 1 2 3');
                expect(createPolicyResponse).to.have.property('Hidden').that.is.false;
                expect(createPolicyResponse).to.have.property('ModificationDateTime').that.includes(new Date().toISOString().split('T')[0]);
                expect(createPolicyResponse).to.have.property('ModificationDateTime').that.includes('Z');
                expect(createPolicyResponse).to.have.property('CreationDateTime').that.includes(new Date().toISOString().split('T')[0]);
                expect(createPolicyResponse).to.have.property('CreationDateTime').that.includes('Z');
            });

            it('Get Policy', async () => {
                const getPoliciesLength = await permissionsService.getPolicies();
                const getPoliciesResponse = await permissionsService.getPolicies({
                    where: `Name='${policyName}'`,
                });
                expect(getPoliciesResponse[0]).to.have.property('Key').that.equals(addonUUID + '_' + policyName);
                expect(getPoliciesResponse[0]).to.have.property('Name').that.equals(policyName);
                expect(getPoliciesResponse[0]).to.have.property('Description').that.equals('Testing 1 2 3');
                expect(getPoliciesResponse[0]).to.have.property('Hidden').that.is.false;
                expect(getPoliciesResponse[0]).to.have.property('ModificationDateTime').that.includes(new Date().toISOString().split('T')[0]);
                expect(getPoliciesResponse[0]).to.have.property('ModificationDateTime').that.includes('Z');
                expect(getPoliciesResponse[0]).to.have.property('CreationDateTime').that.includes(new Date().toISOString().split('T')[0]);
                expect(getPoliciesResponse[0]).to.have.property('CreationDateTime').that.includes('Z');
                expect(getPoliciesLength).to.be.an('Array').with.lengthOf(startingPoliciesLength.length + 1);
            });

            it('Update Policy', async () => {
                const updatePolicyResponse = await permissionsService.createPolicy(
                    {
                        AddonUUID: addonUUID,
                        Name: policyName,
                        Description: 'Testing 1 2 3 4 5 6'
                    }
                );
                expect(updatePolicyResponse).to.have.property('Key').that.equals(addonUUID + '_' + policyName);
                expect(updatePolicyResponse).to.have.property('Name').that.equals(policyName);
                expect(updatePolicyResponse).to.have.property('Description').that.equals('Testing 1 2 3 4 5 6');
                expect(updatePolicyResponse).to.have.property('Hidden').that.is.false;
            });
    });
});
}
