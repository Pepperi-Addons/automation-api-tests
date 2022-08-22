import { PermissionsService } from '../services/permissions.service';
import GeneralService, { TesterFunctions } from '../services/general.service';
import { ObjectsService } from '../services/objects.service';
import { DistributorService } from '../services/distributor.service';

export async function PermissionsTests(generalService: GeneralService, request, tester: TesterFunctions) {
    let password;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        password = request.body.varKeyStage;
    } else if (generalService.papiClient['options'].baseURL.includes('papi-eu')) {
        password = request.body.varKeyEU;
    } else {
        password = request.body.varKeyPro;
    }
    const permissionsService = new PermissionsService(generalService);
    const objectsService = new ObjectsService(generalService);
    const distributorService = new DistributorService(generalService, password);
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
            const policyName = 'AutomationTestPolicy' + Math.floor(Math.random() * 10000000);
            const addonUUID = generalService.papiClient['options'].addonUUID;
            let buyerClient;
            let contactAccount;
            let createdContact;
            let repClient;
            let startingPoliciesLength;
            let startingProfilesLength;
            it('Create Policy', async () => {
                startingPoliciesLength = await permissionsService.getPolicies();
                const createPolicyResponse = await permissionsService.createPolicy({
                    AddonUUID: addonUUID,
                    Name: policyName,
                    Description: 'Testing 1 2 3',
                });
                expect(createPolicyResponse)
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName);
                expect(createPolicyResponse).to.have.property('Name').that.equals(policyName);
                expect(createPolicyResponse).to.have.property('Description').that.equals('Testing 1 2 3');
                expect(createPolicyResponse).to.have.property('Hidden').that.is.false;
                expect(createPolicyResponse)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createPolicyResponse).to.have.property('ModificationDateTime').that.includes('Z');
                expect(createPolicyResponse)
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createPolicyResponse).to.have.property('CreationDateTime').that.includes('Z');
            });

            it('Get Policy', async () => {
                const getPoliciesLength = await permissionsService.getPolicies();
                const getPoliciesResponse = await permissionsService.getPolicies({
                    where: `Name='${policyName}'`,
                });
                expect(getPoliciesResponse[0])
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName);
                expect(getPoliciesResponse[0]).to.have.property('Name').that.equals(policyName);
                expect(getPoliciesResponse[0]).to.have.property('Description').that.equals('Testing 1 2 3');
                expect(getPoliciesResponse[0]).to.have.property('Hidden').that.is.false;
                expect(getPoliciesResponse[0])
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(getPoliciesResponse[0]).to.have.property('ModificationDateTime').that.includes('Z');
                expect(getPoliciesResponse[0])
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(getPoliciesResponse[0]).to.have.property('CreationDateTime').that.includes('Z');
                expect(getPoliciesLength)
                    .to.be.an('Array')
                    .with.lengthOf(startingPoliciesLength.length + 1);
            });

            it('Update Policy', async () => {
                const updatePolicyResponse = await permissionsService.createPolicy({
                    AddonUUID: addonUUID,
                    Name: policyName,
                    Description: 'Testing 1 2 3 4 5 6',
                });
                expect(updatePolicyResponse)
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName);
                expect(updatePolicyResponse).to.have.property('Name').that.equals(policyName);
                expect(updatePolicyResponse).to.have.property('Description').that.equals('Testing 1 2 3 4 5 6');
                expect(updatePolicyResponse).to.have.property('Hidden').that.is.false;
            });

            it('Create Profiles', async () => {
                startingProfilesLength = await permissionsService.getProfiles();
                const createProfileResponse = await permissionsService.createProfile({
                    PolicyAddonUUID: addonUUID,
                    PolicyName: policyName,
                    ProfileID: '1',
                    Allowed: true,
                });
                expect(createProfileResponse)
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName + '_1');
                expect(createProfileResponse).to.have.property('PolicyName').that.equals(policyName);
                expect(createProfileResponse).to.have.property('ProfileID').that.equals('1');
                expect(createProfileResponse).to.have.property('Hidden').that.is.false;
                expect(createProfileResponse).to.have.property('Allowed').that.is.true;
                expect(createProfileResponse)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createProfileResponse).to.have.property('ModificationDateTime').that.includes('Z');
                expect(createProfileResponse)
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createProfileResponse).to.have.property('CreationDateTime').that.includes('Z');

                const createRepProfileResponse = await permissionsService.createProfile({
                    PolicyAddonUUID: addonUUID,
                    PolicyName: policyName,
                    ProfileID: '2',
                    Allowed: false,
                });
                expect(createRepProfileResponse)
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName + '_2');
                expect(createRepProfileResponse).to.have.property('PolicyName').that.equals(policyName);
                expect(createRepProfileResponse).to.have.property('ProfileID').that.equals('2');
                expect(createRepProfileResponse).to.have.property('Hidden').that.is.false;
                expect(createRepProfileResponse).to.have.property('Allowed').that.is.false;
                expect(createRepProfileResponse)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createRepProfileResponse).to.have.property('ModificationDateTime').that.includes('Z');
                expect(createRepProfileResponse)
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createRepProfileResponse).to.have.property('CreationDateTime').that.includes('Z');
            });

            it('Get Profile', async () => {
                const getProfilesLength = await permissionsService.getProfiles();
                const getProfilesResponse = await permissionsService.getProfiles({
                    where: `PolicyName='${policyName}'`,
                });
                expect(getProfilesResponse).to.be.an('array').with.lengthOf(2);
                expect(getProfilesResponse[0])
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName + '_1');
                expect(getProfilesResponse[0]).to.have.property('PolicyName').that.equals(policyName);
                expect(getProfilesResponse[0]).to.have.property('ProfileID').that.equals('1');
                expect(getProfilesResponse[0]).to.have.property('Hidden').that.is.false;
                expect(getProfilesResponse[0]).to.have.property('Allowed').that.is.true;
                expect(getProfilesResponse[0])
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(getProfilesResponse[0]).to.have.property('ModificationDateTime').that.includes('Z');
                expect(getProfilesResponse[0])
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(getProfilesResponse[0]).to.have.property('CreationDateTime').that.includes('Z');
                expect(getProfilesResponse[1])
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName + '_2');
                expect(getProfilesResponse[1]).to.have.property('PolicyName').that.equals(policyName);
                expect(getProfilesResponse[1]).to.have.property('ProfileID').that.equals('2');
                expect(getProfilesResponse[1]).to.have.property('Hidden').that.is.false;
                expect(getProfilesResponse[1]).to.have.property('Allowed').that.is.false;
                expect(getProfilesResponse[1])
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(getProfilesResponse[1]).to.have.property('ModificationDateTime').that.includes('Z');
                expect(getProfilesResponse[1])
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(getProfilesResponse[1]).to.have.property('CreationDateTime').that.includes('Z');
                expect(getProfilesLength)
                    .to.be.an('Array')
                    .with.lengthOf(startingProfilesLength.length + 2);
            });

            it(`Create rep user and try to add policy + test client validate`, async () => {
                const userExternalID = 'Permissions Test User ' + Math.floor(Math.random() * 1000000).toString();
                const userEmail =
                    'UserEmail' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '@' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '.com';
                const createdUser = await objectsService.createUser({
                    ExternalID: userExternalID,
                    Email: userEmail,
                    FirstName: Math.random().toString(36).substring(7),
                    LastName: Math.random().toString(36).substring(7),
                    Mobile: Math.floor(Math.random() * 1000000).toString(),
                    Phone: Math.floor(Math.random() * 1000000).toString(),
                    IsInTradeShowMode: true,
                });
                expect(createdUser, 'InternalID').to.have.property('InternalID').that.is.a('number').and.is.above(0);
                expect(createdUser, 'UUID').to.have.property('UUID').that.is.a('string').and.is.not.empty;
                expect(createdUser, 'ExternalID')
                    .to.have.property('ExternalID')
                    .that.is.a('string')
                    .and.equals(userExternalID);
                const createdUserPass = await distributorService.resetUserPassword(createdUser.InternalID);
                repClient = await generalService.initiateTester(userEmail, createdUserPass.Password);
                const repService = new GeneralService(repClient);
                const repPermissionsService = new PermissionsService(repService);
                await expect(
                    repPermissionsService.createPolicy({
                        AddonUUID: addonUUID,
                        Name: policyName + '_repUser',
                        Description: 'Testing Rep',
                    }),
                ).eventually.to.be.rejectedWith(
                    `${generalService.papiClient['options'].baseURL}/policies failed with status: 403 - Forbidden error: {"fault":{"faultstring":"Failed due to exception: User '${createdUser.InternalID}' is not an admin","detail":{"errorcode":"Forbidden"}}}`,
                );
                let gotError = false;
                let message = '';
                try {
                    await generalService['client'].ValidatePermission(policyName);
                } catch (error) {
                    message = (error as any).message;
                    gotError = true;
                }
                expect(gotError, message).to.be.false;
                await expect(repClient.ValidatePermission(policyName)).eventually.to.be.rejectedWith(
                    `Failed due to exception: You don't have permissions to call this endpoint`,
                );
                expect(await permissionsService.deleteUser('InternalID', createdUser.InternalID)).to.be.true;
                expect(await permissionsService.deleteUser('InternalID', createdUser.InternalID)).to.be.false;
            });

            it('Set REP profile to Allow=true and validate permission', async () => {
                const createRepProfileResponse = await permissionsService.createProfile({
                    PolicyAddonUUID: addonUUID,
                    PolicyName: policyName,
                    ProfileID: '2',
                    Allowed: true,
                });
                expect(createRepProfileResponse)
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName + '_2');
                expect(createRepProfileResponse).to.have.property('PolicyName').that.equals(policyName);
                expect(createRepProfileResponse).to.have.property('ProfileID').that.equals('2');
                expect(createRepProfileResponse).to.have.property('Hidden').that.is.false;
                expect(createRepProfileResponse).to.have.property('Allowed').that.is.true;
                expect(createRepProfileResponse)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createRepProfileResponse).to.have.property('ModificationDateTime').that.includes('Z');
                expect(createRepProfileResponse)
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createRepProfileResponse).to.have.property('CreationDateTime').that.includes('Z');
                let gotError = false;
                let message = '';
                try {
                    repClient.ValidatePermission(policyName);
                } catch (error) {
                    message = (error as any).message;
                    gotError = true;
                }
                expect(gotError, message).to.be.false;
            });

            it(`Create account + contact and connect as buyer`, async () => {
                const contactEmail =
                    'Email' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '@' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '.com';
                contactAccount = await objectsService.createAccount({
                    ExternalID: 'ContactTestAccount',
                    Name: 'Contact Test Account',
                });
                const contactExternalID = 'Automated API ' + Math.floor(Math.random() * 1000000).toString();
                createdContact = await objectsService.createContact({
                    ExternalID: contactExternalID,
                    Email: contactEmail,
                    Phone: '123-45678',
                    Mobile: '123-45678',
                    FirstName: 'Contact',
                    LastName: 'Test',
                    Account: {
                        Data: {
                            InternalID: contactAccount.InternalID,
                        },
                    },
                });
                const getCreatedContact = await objectsService.getContacts(createdContact.InternalID);
                expect(getCreatedContact[0].Email).to.include(contactEmail);
                const connectAsBuyer = await objectsService.connectAsBuyer({
                    UUIDs: [`${getCreatedContact[0].UUID}`],
                    SelectAll: false,
                });
                expect(connectAsBuyer).to.be.an('array').with.lengthOf(1);
                expect(connectAsBuyer[0]).to.have.property('name').that.is.not.empty;
                expect(connectAsBuyer[0]).to.have.property('email').that.is.not.empty;
                expect(connectAsBuyer[0]).to.have.property('message').that.is.a('string').and.is.empty;
                expect(connectAsBuyer[0]).to.have.property('password').that.is.not.empty;
                buyerClient = await generalService.initiateTester(connectAsBuyer[0].email, connectAsBuyer[0].password);
                const createBuyerProfileResponse = await permissionsService.createProfile({
                    PolicyAddonUUID: addonUUID,
                    PolicyName: policyName,
                    ProfileID: '3',
                    Allowed: false,
                });
                expect(createBuyerProfileResponse)
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName + '_3');
                expect(createBuyerProfileResponse).to.have.property('PolicyName').that.equals(policyName);
                expect(createBuyerProfileResponse).to.have.property('ProfileID').that.equals('3');
                expect(createBuyerProfileResponse).to.have.property('Hidden').that.is.false;
                expect(createBuyerProfileResponse).to.have.property('Allowed').that.is.false;
                expect(createBuyerProfileResponse)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createBuyerProfileResponse).to.have.property('ModificationDateTime').that.includes('Z');
                expect(createBuyerProfileResponse)
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createBuyerProfileResponse).to.have.property('CreationDateTime').that.includes('Z');
                await expect(buyerClient.ValidatePermission(policyName)).eventually.to.be.rejectedWith(
                    `Failed due to exception: You don't have permissions to call this endpoint`,
                );
            });

            it('Create Buyer Profile + validate permission + delete account and buyer', async () => {
                startingProfilesLength = await permissionsService.getProfiles();
                const createBuyerProfileResponse = await permissionsService.createProfile({
                    PolicyAddonUUID: addonUUID,
                    PolicyName: policyName,
                    ProfileID: '3',
                    Allowed: true,
                });
                expect(createBuyerProfileResponse)
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName + '_3');
                expect(createBuyerProfileResponse).to.have.property('PolicyName').that.equals(policyName);
                expect(createBuyerProfileResponse).to.have.property('ProfileID').that.equals('3');
                expect(createBuyerProfileResponse).to.have.property('Hidden').that.is.false;
                expect(createBuyerProfileResponse).to.have.property('Allowed').that.is.true;
                expect(createBuyerProfileResponse)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createBuyerProfileResponse).to.have.property('ModificationDateTime').that.includes('Z');
                expect(createBuyerProfileResponse)
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createBuyerProfileResponse).to.have.property('CreationDateTime').that.includes('Z');
                let gotError = false;
                let message = '';
                try {
                    buyerClient.ValidatePermission(policyName);
                } catch (error) {
                    message = (error as any).message;
                    gotError = true;
                }
                expect(gotError, message).to.be.false;
                expect(await objectsService.deleteContact(createdContact.InternalID)).to.be.true,
                    expect(await objectsService.deleteContact(createdContact.InternalID)).to.be.false,
                    expect(await objectsService.deleteAccount(contactAccount.InternalID)).to.be.true;
            });

            it('Delete Profile', async () => {
                const deletedProfileResponse = await permissionsService.deleteProfile({
                    PolicyAddonUUID: addonUUID,
                    PolicyName: policyName,
                    ProfileID: '1',
                    Hidden: true,
                });
                expect(deletedProfileResponse)
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName + '_1');
                expect(deletedProfileResponse).to.have.property('PolicyName').that.equals(policyName);
                expect(deletedProfileResponse).to.have.property('ProfileID').that.equals('1');
                expect(deletedProfileResponse).to.have.property('Hidden').that.is.true;
                expect(deletedProfileResponse).to.have.property('Allowed').that.is.true;
                expect(deletedProfileResponse)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(deletedProfileResponse).to.have.property('ModificationDateTime').that.includes('Z');
                expect(deletedProfileResponse)
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(deletedProfileResponse).to.have.property('CreationDateTime').that.includes('Z');

                const deletedRepProfileResponse = await permissionsService.deleteProfile({
                    PolicyAddonUUID: addonUUID,
                    PolicyName: policyName,
                    ProfileID: '2',
                    Hidden: true,
                });
                expect(deletedRepProfileResponse)
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName + '_2');
                expect(deletedRepProfileResponse).to.have.property('PolicyName').that.equals(policyName);
                expect(deletedRepProfileResponse).to.have.property('ProfileID').that.equals('2');
                expect(deletedRepProfileResponse).to.have.property('Hidden').that.is.true;
                expect(deletedRepProfileResponse).to.have.property('Allowed').that.is.true;
                expect(deletedRepProfileResponse)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(deletedRepProfileResponse).to.have.property('ModificationDateTime').that.includes('Z');
                expect(deletedRepProfileResponse)
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(deletedRepProfileResponse).to.have.property('CreationDateTime').that.includes('Z');

                const deletedBuyerProfileResponse = await permissionsService.deleteProfile({
                    PolicyAddonUUID: addonUUID,
                    PolicyName: policyName,
                    ProfileID: '3',
                    Hidden: true,
                });
                expect(deletedBuyerProfileResponse)
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName + '_3');
                expect(deletedBuyerProfileResponse).to.have.property('PolicyName').that.equals(policyName);
                expect(deletedBuyerProfileResponse).to.have.property('ProfileID').that.equals('3');
                expect(deletedBuyerProfileResponse).to.have.property('Hidden').that.is.true;
                expect(deletedBuyerProfileResponse).to.have.property('Allowed').that.is.true;
                expect(deletedBuyerProfileResponse)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(deletedBuyerProfileResponse).to.have.property('ModificationDateTime').that.includes('Z');
                expect(deletedBuyerProfileResponse)
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(deletedBuyerProfileResponse).to.have.property('CreationDateTime').that.includes('Z');
            });

            it('Delete Policy', async () => {
                const deletePolicyResponse = await permissionsService.createPolicy({
                    AddonUUID: addonUUID,
                    Name: policyName,
                    Hidden: true,
                });
                expect(deletePolicyResponse)
                    .to.have.property('Key')
                    .that.equals(addonUUID + '_' + policyName);
                expect(deletePolicyResponse).to.have.property('Name').that.equals(policyName);
                expect(deletePolicyResponse).to.have.property('Description').that.equals('Testing 1 2 3 4 5 6');
                expect(deletePolicyResponse).to.have.property('Hidden').that.is.true;
            });
        });
    });
}
