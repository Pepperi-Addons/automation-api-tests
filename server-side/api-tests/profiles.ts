import { ProfilesService } from '../services/profiles.service';
import GeneralService, { TesterFunctions } from '../services/general.service';
import { ObjectsService } from '../services/objects.service';
import { DistributorService } from '../services/distributor.service';

export async function ProfilesTests(generalService: GeneralService, request, tester: TesterFunctions) {
    let password;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        password = request.body.varKeyStage;
    } else if (generalService.papiClient['options'].baseURL.includes('papi-eu')) {
        password = request.body.varKeyEU;
    } else {
        password = request.body.varKeyPro;
    }
    const profilesService = new ProfilesService(generalService);
    const objectsService = new ObjectsService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade Data Index ADAL Pepperitest (Jenkins Special Addon)
    const testData = {
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', ''],
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

    describe('Profiles Tests Suites', () => {
        describe('Prerequisites Addon for Profiles Tests', () => {
            //Test Datas
            //Profiles
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

        describe('Profiles CRUD', () => {
            let startProfilesLength;
            let repProfile;
            let adminProfile;
            let buyerProfile;
            let createdProfile;
            let createdUserUIProfile;
            let createdUserUIChildProfile;
            let updatedProfile;
            let deletedProfile;
            let batchProfiles;
            let startProfilesIncludeDeletedLength;
            let createdDataView;
            let createdUser;
            const profilesToPurgeArray: any[] = [];

            const profileName = 'AutomationTestProfile' + Math.floor(Math.random() * 10000000);

            it('Create Profile', async () => {
                console.log(`CREATE profile, name: ${profileName}`);
                startProfilesLength = await profilesService.getProfiles();
                startProfilesLength = startProfilesLength.length;
                repProfile = await profilesService.getProfiles({
                    where: `Name='Rep'`,
                });

                createdProfile = await profilesService.postProfile({
                    Name: profileName,
                    ParentInternalID: repProfile[0].InternalID,
                });
                expect(createdProfile).to.have.property('InternalID').that.is.a('number');
                expect(createdProfile).to.have.property('UUID').that.is.a('string').with.lengthOf(36);
                expect(createdProfile)
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createdProfile).to.have.property('CreationDateTime').that.includes('Z');
                expect(createdProfile).to.have.property('Hidden').that.is.false;
                expect(createdProfile)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createdProfile).to.have.property('ModificationDateTime').that.includes('Z');
                expect(createdProfile).to.have.property('Name').that.is.equals(profileName);
                expect(createdProfile).to.have.property('ParentInternalID').that.is.equals(repProfile[0].InternalID);
                let endProfilesLength = await profilesService.getProfiles();
                endProfilesLength = endProfilesLength.length;
                expect(endProfilesLength).to.equal(startProfilesLength + 1);
                console.log(`Finished CREATE profile and verify, name: ${profileName}`);
            });

            it('Verify PNS After insert via audit_data_logs', async () => {
                console.log(`Verify PNS after insert, name: ${profileName}`);
                const auditDataLogInsert = await profilesService.getAuditDataLog();
                auditDataLogInsert[0]['ObjectModificationDateTime'] = await profilesService.trimDate(
                    auditDataLogInsert[0]['ObjectModificationDateTime'],
                ); //Changing date format due to old bug
                expect(auditDataLogInsert[0]).to.have.property('ObjectKey').that.equals(createdProfile.UUID);
                expect(auditDataLogInsert[0])
                    .to.have.property('ObjectModificationDateTime')
                    .that.equals(createdProfile.ModificationDateTime);
                expect(auditDataLogInsert[0]).to.have.property('ActionType').that.equals('insert');
                expect(auditDataLogInsert[0]).to.have.property('Resource').that.equals('profiles');
                console.log(`Finished Verifying PNS after insert, name: ${profileName}`);
            });

            it('Get Profile', async () => {
                console.log(`GET profile, name: ${profileName}`);
                const getProfile = await profilesService.getProfiles({
                    where: `Name='${profileName}'`,
                });
                expect(createdProfile).to.deep.equal(getProfile[0]);
                console.log(`Finished GET profile, name: ${profileName}`);
            });

            it('Update Profile', async () => {
                console.log(`UPDATE profile, name: ${profileName}, UUID: ${createdProfile.UUID}`);
                updatedProfile = await profilesService.postProfile({
                    InternalID: createdProfile.InternalID,
                    Name: profileName + ' Update',
                });
                expect(updatedProfile)
                    .to.have.property('InternalID')
                    .that.is.a('number')
                    .that.equals(createdProfile.InternalID);
                expect(updatedProfile)
                    .to.have.property('UUID')
                    .that.is.a('string')
                    .with.lengthOf(36)
                    .that.equals(createdProfile.UUID);
                expect(updatedProfile)
                    .to.have.property('CreationDateTime')
                    .that.equals(createdProfile.CreationDateTime);
                expect(updatedProfile).to.have.property('Hidden').that.is.false;
                expect(updatedProfile)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(updatedProfile).to.have.property('ModificationDateTime').that.includes('Z');
                expect(updatedProfile)
                    .to.have.property('Name')
                    .that.is.equals(profileName + ' Update');
                expect(updatedProfile).to.have.property('ParentInternalID').that.is.equals(repProfile[0].InternalID);
                console.log(
                    `Finished UPDATE profile and verify, name after update: ${updatedProfile.Name}, UUID: ${updatedProfile.UUID}`,
                );
            });

            it('Verify PNS After update via audit_data_logs', async () => {
                console.log(`Verify PNS after update, name: ${profileName}`);
                const auditDataLogUpdate = await profilesService.getAuditDataLog();
                auditDataLogUpdate[0]['ObjectModificationDateTime'] = await profilesService.trimDate(
                    auditDataLogUpdate[0]['ObjectModificationDateTime'],
                );
                expect(auditDataLogUpdate[0]).to.have.property('ObjectKey').that.equals(createdProfile.UUID);
                expect(auditDataLogUpdate[0])
                    .to.have.property('ObjectModificationDateTime')
                    .that.equals(updatedProfile.ModificationDateTime);
                expect(auditDataLogUpdate[0]).to.have.property('ActionType').that.equals('update');
                expect(auditDataLogUpdate[0]).to.have.property('Resource').that.equals('profiles');
                expect(auditDataLogUpdate[0])
                    .to.have.property('UpdatedFields')
                    .that.deep.equals([
                        {
                            FieldID: 'Name',
                            NewValue: updatedProfile.Name,
                            OldValue: createdProfile.Name,
                        },
                    ]);
                console.log(`Finished Verifying PNS after update, name: ${profileName}`);
            });

            it('Delete Profile', async () => {
                console.log(`DELETE profile, name: ${updatedProfile.Name}, UUID: ${updatedProfile.UUID}`);
                deletedProfile = await profilesService.deleteProfile({
                    InternalID: createdProfile.InternalID,
                    Hidden: true,
                });
                expect(deletedProfile)
                    .to.have.property('InternalID')
                    .that.is.a('number')
                    .that.equals(createdProfile.InternalID);
                expect(deletedProfile)
                    .to.have.property('UUID')
                    .that.is.a('string')
                    .with.lengthOf(36)
                    .that.equals(createdProfile.UUID);
                expect(deletedProfile)
                    .to.have.property('CreationDateTime')
                    .that.equals(createdProfile.CreationDateTime);
                expect(deletedProfile).to.have.property('Hidden').that.is.true;
                expect(deletedProfile)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(deletedProfile).to.have.property('ModificationDateTime').that.includes('Z');
                expect(deletedProfile).to.have.property('Name').that.is.equals(updatedProfile.Name);
                expect(deletedProfile).to.have.property('ParentInternalID').that.is.equals(repProfile[0].InternalID);
                let deletedProfilesLength = await profilesService.getProfiles();
                deletedProfilesLength = deletedProfilesLength.length;
                expect(deletedProfilesLength).to.equal(startProfilesLength);
                console.log(
                    `Finished DELETE profile and verify, name: ${deletedProfile.Name}, UUID: ${deletedProfile.UUID}`,
                );
                profilesToPurgeArray.push(deletedProfile.InternalID.toString());
            });

            it('Verify PNS After delete via audit_data_logs', async () => {
                console.log(`Verify PNS after update, name: ${profileName}`);
                const auditDataLogDelete = await profilesService.getAuditDataLog();
                auditDataLogDelete[0]['ObjectModificationDateTime'] = await profilesService.trimDate(
                    auditDataLogDelete[0]['ObjectModificationDateTime'],
                );
                expect(auditDataLogDelete[0]).to.have.property('ObjectKey').that.equals(createdProfile.UUID);
                expect(auditDataLogDelete[0])
                    .to.have.property('ObjectModificationDateTime')
                    .that.equals(deletedProfile.ModificationDateTime);
                expect(auditDataLogDelete[0]).to.have.property('ActionType').that.equals('update');
                expect(auditDataLogDelete[0]).to.have.property('Resource').that.equals('profiles');
                expect(auditDataLogDelete[0])
                    .to.have.property('UpdatedFields')
                    .that.deep.equals([
                        {
                            FieldID: 'Hidden',
                            NewValue: true,
                            OldValue: false,
                        },
                    ]);
                console.log(`Finished Verifying PNS after delete, name: ${profileName}`);
            });

            it('Insert batch profiles', async () => {
                console.log(`INSERT batch profiles`);
                batchProfiles = await profilesService.postProfilesBatch([
                    {
                        Name: profileName + ' batch1',
                        ParentInternalID: repProfile[0].InternalID,
                    },
                    {
                        Name: profileName + ' batch2',
                        ParentInternalID: repProfile[0].InternalID,
                    },
                    {
                        Name: profileName + ' batch3',
                        ParentInternalID: repProfile[0].InternalID,
                    },
                    {
                        Name: profileName + ' batch4',
                        ParentInternalID: repProfile[0].InternalID,
                    },
                    {
                        Name: profileName + ' batch5',
                        ParentInternalID: repProfile[0].InternalID,
                    },
                ]);
                for (const key in batchProfiles) {
                    expect(batchProfiles[key]).to.have.property('InternalID').that.is.a('number');
                    expect(batchProfiles[key]).to.have.property('UUID').that.is.a('string').with.lengthOf(36);
                    expect(batchProfiles[key]).to.have.property('ExternalID').that.is.a('string');
                    expect(batchProfiles[key]).to.have.property('Status').that.equals('Insert');
                    expect(batchProfiles[key]).to.have.property('Message').that.equals('Row inserted.');
                    expect(batchProfiles[key])
                        .to.have.property('URI')
                        .that.equals('/profiles/' + batchProfiles[key].InternalID);
                }
                let batchProfilesLength = await profilesService.getProfiles();
                batchProfilesLength = batchProfilesLength.length;
                expect(batchProfilesLength).to.equal(startProfilesLength + 5);
                console.log(`Finished Insert batch profiles`);
            });

            it('Update + Delete batch profiles', async () => {
                console.log(`UDATE + Delete batch profiles`);
                const deleteBatchProfiles = await profilesService.postProfilesBatch([
                    {
                        InternalID: batchProfiles[0].InternalID,
                        Hidden: true,
                    },
                    {
                        InternalID: batchProfiles[1].InternalID,
                        Hidden: true,
                    },
                    {
                        InternalID: batchProfiles[2].InternalID,
                        Hidden: true,
                    },
                    {
                        InternalID: batchProfiles[3].InternalID,
                        Hidden: true,
                    },
                    {
                        InternalID: batchProfiles[4].InternalID,
                        Hidden: true,
                    },
                ]);
                for (const key in deleteBatchProfiles) {
                    expect(deleteBatchProfiles[key]).to.have.property('InternalID').that.is.a('number');
                    expect(deleteBatchProfiles[key]).to.have.property('UUID').that.is.a('string').with.lengthOf(36);
                    expect(deleteBatchProfiles[key]).to.have.property('ExternalID').that.is.a('string');
                    expect(deleteBatchProfiles[key]).to.have.property('Status').that.equals('Update');
                    expect(deleteBatchProfiles[key]).to.have.property('Message').that.equals('Row updated.');
                    expect(deleteBatchProfiles[key])
                        .to.have.property('URI')
                        .that.equals('/profiles/' + deleteBatchProfiles[key].InternalID);
                    profilesToPurgeArray.push(deleteBatchProfiles[key].InternalID);
                }
                let deleteBatchProfilesLength = await profilesService.getProfiles();
                deleteBatchProfilesLength = deleteBatchProfilesLength.length;
                expect(deleteBatchProfilesLength).to.equal(startProfilesLength);
                console.log(`Finished UPDATE + Delete batch profiles`);
            });

            it('Verify 100 profiles limit', async () => {
                console.log(`Start verifying 100 profiles limit`);
                startProfilesIncludeDeletedLength = await profilesService.getProfiles({
                    include_deleted: true,
                });
                startProfilesIncludeDeletedLength = startProfilesIncludeDeletedLength.length;
                const arrayOfProfiles = await profilesService.create110ProfilesArray(
                    profileName,
                    repProfile[0].InternalID,
                );
                batchProfiles = await profilesService.postProfilesBatch(arrayOfProfiles);
                for (const key in batchProfiles) {
                    expect(batchProfiles[key]).to.have.property('Status').that.equals('Error');
                    expect(batchProfiles[key])
                        .to.have.property('Message')
                        .that.equals(
                            `General error: There are ${startProfilesIncludeDeletedLength} existing profiles and you are trying to add ${arrayOfProfiles.length} and this exeeds the limit of 100`,
                        );
                }
                let batchProfilesLength = await profilesService.getProfiles();
                batchProfilesLength = batchProfilesLength.length;
                expect(batchProfilesLength).to.equal(startProfilesLength);
                console.log(`End verifying 100 profiles limit`);
            });

            it('Verify that system profiles cannot be changed (admin, rep, buyer)', async () => {
                console.log(`Verifying that system profiles cannot be changed`);
                adminProfile = await profilesService.getProfiles({
                    where: `Name='Admin'`,
                });
                buyerProfile = await profilesService.getProfiles({
                    where: `Name='Buyer'`,
                });
                await expect(
                    profilesService.postProfile({
                        InternalID: repProfile[0].InternalID,
                        Name: 'Rep 123',
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Cannot change system profile - Rep","detail":{"errorcode":"InvalidData"}}}`,
                );
                await expect(
                    profilesService.postProfile({
                        InternalID: adminProfile[0].InternalID,
                        Name: 'Admin 123',
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Cannot change system profile - Admin","detail":{"errorcode":"InvalidData"}}}`,
                );
                await expect(
                    profilesService.postProfile({
                        InternalID: buyerProfile[0].InternalID,
                        Name: 'Buyer 123',
                    }),
                ).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Cannot change system profile - Buyer","detail":{"errorcode":"InvalidData"}}}`,
                );
                console.log(`Finished verifying that system profiles cannot be changed`);
            });

            it('Verify that parent properties are available', async () => {
                console.log(`Verifying that parent properties are available in GET`);
                const profileForRepProperties = await profilesService.postProfile({
                    Name: profileName + ' parent rep',
                    ParentInternalID: repProfile[0].InternalID,
                });
                const profileForAdminProperties = await profilesService.postProfile({
                    Name: profileName + ' parent admin',
                    ParentInternalID: adminProfile[0].InternalID,
                });
                const profileForBuyerProperties = await profilesService.postProfile({
                    Name: profileName + ' parent buyer',
                    ParentInternalID: buyerProfile[0].InternalID,
                });
                expect(profileForRepProperties)
                    .to.have.property('Name')
                    .that.is.equals(profileName + ' parent rep');
                expect(profileForRepProperties)
                    .to.have.property('ParentInternalID')
                    .that.is.equals(repProfile[0].InternalID);
                expect(profileForAdminProperties)
                    .to.have.property('Name')
                    .that.is.equals(profileName + ' parent admin');
                expect(profileForAdminProperties)
                    .to.have.property('ParentInternalID')
                    .that.is.equals(adminProfile[0].InternalID);
                expect(profileForBuyerProperties)
                    .to.have.property('Name')
                    .that.is.equals(profileName + ' parent buyer');
                expect(profileForBuyerProperties)
                    .to.have.property('ParentInternalID')
                    .that.is.equals(buyerProfile[0].InternalID);
                const getRepParentFields = await profilesService.getProfiles({
                    where: `Name='${profileForRepProperties.Name}'`,
                    fields: [
                        'Parent.InternalID',
                        'Parent.UUID',
                        'Parent.CreationDateTime',
                        'Parent.Hidden',
                        'Parent.ModificationDateTime',
                        'Parent.Name',
                        'Parent.ParentInternalID',
                    ],
                });
                getRepParentFields[0]['Parent.CreationDateTime'] = await profilesService.trimDate(
                    getRepParentFields[0]['Parent.CreationDateTime'],
                ); //Changing date format due to old bug
                getRepParentFields[0]['Parent.ModificationDateTime'] = await profilesService.trimDate(
                    getRepParentFields[0]['Parent.ModificationDateTime'],
                ); //Changing date format due to old bug
                expect(getRepParentFields[0])
                    .to.have.property('Parent.InternalID')
                    .that.is.a('number')
                    .that.equals(repProfile[0].InternalID);
                expect(getRepParentFields[0])
                    .to.have.property('Parent.UUID')
                    .that.is.a('string')
                    .with.lengthOf(36)
                    .that.equals(repProfile[0].UUID);
                expect(getRepParentFields[0])
                    .to.have.property('Parent.CreationDateTime')
                    .that.equals(repProfile[0].CreationDateTime);
                expect(getRepParentFields[0]).to.have.property('Parent.Hidden').that.equals(repProfile[0].Hidden);
                expect(getRepParentFields[0])
                    .to.have.property('Parent.ModificationDateTime')
                    .that.equals(repProfile[0].ModificationDateTime);
                expect(getRepParentFields[0]).to.have.property('Parent.Name').that.equals(repProfile[0].Name);
                // expect(getRepParentFields[0]).to.have.property('Parent.ParentInternalID').that.is.equals(repProfile[0].ParentInternalID);        //IGNORED DUE TO OLD BUG THAT WON'T BE CHANGED
                const getAdminParentFields = await profilesService.getProfiles({
                    where: `Name='${profileForAdminProperties.Name}'`,
                    fields: [
                        'Parent.InternalID',
                        'Parent.UUID',
                        'Parent.CreationDateTime',
                        'Parent.Hidden',
                        'Parent.ModificationDateTime',
                        'Parent.Name',
                        'Parent.ParentInternalID',
                    ],
                });
                getAdminParentFields[0]['Parent.CreationDateTime'] = await profilesService.trimDate(
                    getAdminParentFields[0]['Parent.CreationDateTime'],
                ); //Changing date format due to old bug
                getAdminParentFields[0]['Parent.ModificationDateTime'] = await profilesService.trimDate(
                    getAdminParentFields[0]['Parent.ModificationDateTime'],
                ); //Changing date format due to old bug
                expect(getAdminParentFields[0])
                    .to.have.property('Parent.InternalID')
                    .that.is.a('number')
                    .that.equals(adminProfile[0].InternalID);
                expect(getAdminParentFields[0])
                    .to.have.property('Parent.UUID')
                    .that.is.a('string')
                    .with.lengthOf(36)
                    .that.equals(adminProfile[0].UUID);
                expect(getAdminParentFields[0])
                    .to.have.property('Parent.CreationDateTime')
                    .that.equals(adminProfile[0].CreationDateTime);
                expect(getAdminParentFields[0]).to.have.property('Parent.Hidden').that.equals(adminProfile[0].Hidden);
                expect(getAdminParentFields[0])
                    .to.have.property('Parent.ModificationDateTime')
                    .that.equals(adminProfile[0].ModificationDateTime);
                expect(getAdminParentFields[0]).to.have.property('Parent.Name').that.equals(adminProfile[0].Name);
                expect(getAdminParentFields[0])
                    .to.have.property('Parent.ParentInternalID')
                    .that.equals(adminProfile[0].InternalID);
                const getBuyerParentFields = await profilesService.getProfiles({
                    where: `Name='${profileForBuyerProperties.Name}'`,
                    fields: [
                        'Parent.InternalID',
                        'Parent.UUID',
                        'Parent.CreationDateTime',
                        'Parent.Hidden',
                        'Parent.ModificationDateTime',
                        'Parent.Name',
                        'Parent.ParentInternalID',
                    ],
                });
                getBuyerParentFields[0]['Parent.CreationDateTime'] = await profilesService.trimDate(
                    getBuyerParentFields[0]['Parent.CreationDateTime'],
                ); //Changing date format due to old bug
                getBuyerParentFields[0]['Parent.ModificationDateTime'] = await profilesService.trimDate(
                    getBuyerParentFields[0]['Parent.ModificationDateTime'],
                ); //Changing date format due to old bug
                expect(getBuyerParentFields[0])
                    .to.have.property('Parent.InternalID')
                    .that.is.a('number')
                    .that.equals(buyerProfile[0].InternalID);
                expect(getBuyerParentFields[0])
                    .to.have.property('Parent.UUID')
                    .that.is.a('string')
                    .with.lengthOf(36)
                    .that.equals(buyerProfile[0].UUID);
                expect(getBuyerParentFields[0])
                    .to.have.property('Parent.CreationDateTime')
                    .that.equals(buyerProfile[0].CreationDateTime);
                expect(getBuyerParentFields[0]).to.have.property('Parent.Hidden').that.equals(buyerProfile[0].Hidden);
                expect(getBuyerParentFields[0])
                    .to.have.property('Parent.ModificationDateTime')
                    .that.equals(buyerProfile[0].ModificationDateTime);
                expect(getBuyerParentFields[0]).to.have.property('Parent.Name').that.equals(buyerProfile[0].Name);
                expect(getBuyerParentFields[0])
                    .to.have.property('Parent.ParentInternalID')
                    .that.equals(buyerProfile[0].InternalID);
                const deletedProfileForRep = await profilesService.deleteProfile({
                    InternalID: profileForRepProperties.InternalID,
                    Hidden: true,
                });
                const deletedProfileForAdmin = await profilesService.deleteProfile({
                    InternalID: profileForAdminProperties.InternalID,
                    Hidden: true,
                });
                const deletedProfileForBuyer = await profilesService.deleteProfile({
                    InternalID: profileForBuyerProperties.InternalID,
                    Hidden: true,
                });
                expect(deletedProfileForRep).to.have.property('Hidden').that.is.true;
                expect(deletedProfileForAdmin).to.have.property('Hidden').that.is.true;
                expect(deletedProfileForBuyer).to.have.property('Hidden').that.is.true;
                profilesToPurgeArray.push(deletedProfileForRep.InternalID.toString());
                profilesToPurgeArray.push(deletedProfileForAdmin.InternalID.toString());
                profilesToPurgeArray.push(deletedProfileForBuyer.InternalID.toString());
                console.log(`Finished Verifying that parent properties are available in GET`);
            });

            it('Create Profile for user+UI control test', async () => {
                console.log(`CREATE profile for user+UI control test`);
                repProfile = await profilesService.getProfiles({
                    where: `Name='Rep'`,
                });

                createdUserUIProfile = await profilesService.postProfile({
                    Name: profileName + ' Parent',
                    ParentInternalID: repProfile[0].InternalID,
                });
                expect(createdUserUIProfile).to.have.property('InternalID').that.is.a('number');
                expect(createdUserUIProfile).to.have.property('UUID').that.is.a('string').with.lengthOf(36);
                expect(createdUserUIProfile)
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createdUserUIProfile).to.have.property('CreationDateTime').that.includes('Z');
                expect(createdUserUIProfile).to.have.property('Hidden').that.is.false;
                expect(createdUserUIProfile)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createdUserUIProfile).to.have.property('ModificationDateTime').that.includes('Z');
                expect(createdUserUIProfile)
                    .to.have.property('Name')
                    .that.is.equals(profileName + ' Parent');
                expect(createdUserUIProfile)
                    .to.have.property('ParentInternalID')
                    .that.is.equals(repProfile[0].InternalID);
                console.log(`Finished CREATE profile for user+UI control test`);
            });

            it(`Create user + assign profile to user`, async () => {
                const userExternalID = 'Profiles Test User ' + Math.floor(Math.random() * 1000000).toString();
                const userEmail =
                    'UserEmail' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '@' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '.com';
                createdUser = await objectsService.createUser({
                    ExternalID: userExternalID,
                    Email: userEmail,
                    FirstName: Math.random().toString(36).substring(7),
                    LastName: Math.random().toString(36).substring(7),
                    Mobile: Math.floor(Math.random() * 1000000).toString(),
                    Phone: Math.floor(Math.random() * 1000000).toString(),
                    Profile: {
                        Data: {
                            InternalID: createdUserUIProfile.InternalID,
                        },
                    },
                    IsInTradeShowMode: true,
                });
                expect(createdUser, 'InternalID').to.have.property('InternalID').that.is.a('number').and.is.above(0);
                expect(createdUser, 'UUID').to.have.property('UUID').that.is.a('string').and.is.not.empty;
                expect(createdUser, 'ExternalID')
                    .to.have.property('ExternalID')
                    .that.is.a('string')
                    .and.equals(userExternalID);
                expect(createdUser.Profile?.Data.InternalID).to.have.equal(createdUserUIProfile.InternalID);
                expect(createdUser.Profile?.Data.Name).to.have.equal(createdUserUIProfile.Name);
            });

            it(`Post data view for profile`, async () => {
                const atds = await objectsService.getATD('transactions');
                const atdInternalID = atds[0].InternalID;
                createdDataView = await profilesService.postDataView(atdInternalID, createdUserUIProfile.InternalID);
                expect(createdDataView).to.have.property('InternalID').that.is.a('number').and.is.above(0);
                expect(createdDataView).to.have.property('Type').that.is.equals('Grid');
                expect(createdDataView).to.have.property('Title').that.is.a('string');
                expect(createdDataView.Context.Object).to.deep.equal({
                    Resource: 'transactions',
                    InternalID: atds[0].InternalID,
                    Name: atds[0].ExternalID,
                });
                expect(createdDataView.Context.Profile).to.deep.equal({
                    InternalID: createdUserUIProfile.InternalID,
                    UUID: createdUserUIProfile.UUID,
                    CreationDateTime: createdUserUIProfile.CreationDateTime,
                    Hidden: createdUserUIProfile.Hidden,
                    ModificationDateTime: createdUserUIProfile.ModificationDateTime,
                    Name: createdUserUIProfile.Name,
                    ParentInternalID: createdUserUIProfile.ParentInternalID,
                });
                expect(createdDataView.Context).to.have.property('Name').that.is.not.empty;
                expect(createdDataView.Context).to.have.property('ScreenSize').that.equals('Tablet');
                expect(createdDataView).to.have.property('Hidden').that.is.false;
            });

            it('Create child Profile for user+UI control test', async () => {
                console.log(`CREATE child profile for user+UI control test`);
                createdUserUIChildProfile = await profilesService.postProfile({
                    Name: profileName + ' child',
                    ParentInternalID: createdUserUIProfile.InternalID,
                });
                expect(createdUserUIChildProfile).to.have.property('InternalID').that.is.a('number');
                expect(createdUserUIChildProfile).to.have.property('UUID').that.is.a('string').with.lengthOf(36);
                expect(createdUserUIChildProfile)
                    .to.have.property('CreationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createdUserUIChildProfile).to.have.property('CreationDateTime').that.includes('Z');
                expect(createdUserUIChildProfile).to.have.property('Hidden').that.is.false;
                expect(createdUserUIChildProfile)
                    .to.have.property('ModificationDateTime')
                    .that.includes(new Date().toISOString().split('T')[0]);
                expect(createdUserUIChildProfile).to.have.property('ModificationDateTime').that.includes('Z');
                expect(createdUserUIChildProfile)
                    .to.have.property('Name')
                    .that.is.equals(profileName + ' child');
                expect(createdUserUIChildProfile)
                    .to.have.property('ParentInternalID')
                    .that.is.equals(createdUserUIProfile.InternalID);
                console.log(`Finished child CREATE profile for user+UI control test`);
            });

            it('Delete Profile for user+UI control test', async () => {
                console.log(`DELETE profile for user+UI control test`);
                const deletedUIProfile = await profilesService.deleteProfile({
                    InternalID: createdUserUIProfile.InternalID,
                    Hidden: true,
                });
                expect(deletedUIProfile)
                    .to.have.property('InternalID')
                    .that.is.a('number')
                    .that.equals(createdUserUIProfile.InternalID);
                expect(deletedUIProfile).to.have.property('Hidden').that.is.true;
                expect(deletedUIProfile).to.have.property('ParentInternalID').that.equals(repProfile[0].InternalID);
                console.log(`Finished DELETE profile for user+UI control test`);
                profilesToPurgeArray.push(deletedUIProfile.InternalID.toString());
            });

            it('Get child Profile', async () => {
                console.log(`GET child profile and verify parent`);
                const getChildProfile = await profilesService.getProfiles({
                    where: `Name='${createdUserUIChildProfile.Name}'`,
                });
                expect(getChildProfile[0]).to.have.property('ParentInternalID').that.equals(repProfile[0].InternalID);
                console.log(`Finished GET child profile and verify parent`);
            });

            it('Get data view', async () => {
                console.log(`Verifying data view is hidden`);
                const getDataView = await profilesService.getDataView({
                    include_deleted: true,
                    where: `InternalID='${createdDataView.InternalID}'`,
                });
                expect(getDataView[0]).to.have.property('Hidden').that.true;
                console.log(`Finished verifying data view is hidden`);
            });

            it('Get User', async () => {
                const getUser = await objectsService.getSingleUser('InternalID', createdUser.InternalID);
                expect(getUser.Profile?.Data.InternalID).to.have.equal(repProfile[0].InternalID);
                expect(getUser.Profile?.Data.Name).to.have.equal(repProfile[0].Name);
            });

            it(`Delete user`, async () => {
                expect(await profilesService.deleteUser('InternalID', createdUser.InternalID)).to.be.true;
                expect(await profilesService.deleteUser('InternalID', createdUser.InternalID)).to.be.false;
            });

            it('Delete child Profile', async () => {
                console.log(`DELETE profile for user+UI control test`);
                const deletedChildProfile = await profilesService.deleteProfile({
                    InternalID: createdUserUIChildProfile.InternalID,
                    Hidden: true,
                });
                expect(deletedChildProfile)
                    .to.have.property('InternalID')
                    .that.is.a('number')
                    .that.equals(createdUserUIChildProfile.InternalID);
                expect(deletedChildProfile).to.have.property('Hidden').that.is.true;
                expect(deletedChildProfile).to.have.property('ParentInternalID').that.equals(repProfile[0].InternalID);
                console.log(`Finished DELETE child profile`);
                profilesToPurgeArray.push(deletedChildProfile.InternalID.toString());
            });

            it('Purge test profiles', async () => {
                console.log(`Start purging test profiles profiles`);
                const purgedProfiles = await profilesService.purgeProfiles({ InternalIDList: profilesToPurgeArray });
                expect(purgedProfiles).to.be.an('array').with.lengthOf(profilesToPurgeArray.length);
                console.log(`End purging test profiles profiles`);
            });

            // it(`Create account + contact and connect as buyer`, async () => {
            //     const contactEmail =
            //         'Email' +
            //         Math.floor(Math.random() * 1000000).toString() +
            //         '@' +
            //         Math.floor(Math.random() * 1000000).toString() +
            //         '.com';
            //     contactAccount = await objectsService.createAccount({
            //         ExternalID: 'ContactTestAccount',
            //         Name: 'Contact Test Account',
            //     });
            //     const contactExternalID = 'Automated API ' + Math.floor(Math.random() * 1000000).toString();
            //     createdContact = await objectsService.createContact({
            //         ExternalID: contactExternalID,
            //         Email: contactEmail,
            //         Phone: '123-65678',
            //         Mobile: '123-65678',
            //         FirstName: 'Contact',
            //         LastName: 'Test',
            //         Account: {
            //             Data: {
            //                 InternalID: contactAccount.InternalID,
            //             },
            //         },
            //     });
            //     const getCreatedContact = await objectsService.getContacts(createdContact.InternalID);
            //     expect(getCreatedContact[0].Email).to.include(contactEmail);
            //     const connectAsBuyer = await objectsService.connectAsBuyer({
            //         UUIDs: [`${getCreatedContact[0].UUID}`],
            //         SelectAll: false,
            //     });
            //     expect(connectAsBuyer).to.be.an('array').with.lengthOf(1);
            //     expect(connectAsBuyer[0]).to.have.property('name').that.is.not.empty;
            //     expect(connectAsBuyer[0]).to.have.property('email').that.is.not.empty;
            //     expect(connectAsBuyer[0]).to.have.property('message').that.is.a('string').and.is.empty;
            //     expect(connectAsBuyer[0]).to.have.property('password').that.is.not.empty;
            //     buyerClient = await generalService.initiateTester(connectAsBuyer[0].email, connectAsBuyer[0].password);
            //     const createBuyerProfileResponse = await permissionsService.createProfile({
            //         PolicyAddonUUID: addonUUID,
            //         PolicyName: policyName,
            //         ProfileID: '3',
            //         Allowed: false,
            //     });
            //     expect(createBuyerProfileResponse)
            //         .to.have.property('Key')
            //         .that.equals(addonUUID + '_' + policyName + '_3');
            //     expect(createBuyerProfileResponse).to.have.property('PolicyName').that.equals(policyName);
            //     expect(createBuyerProfileResponse).to.have.property('ProfileID').that.equals('3');
            //     expect(createBuyerProfileResponse).to.have.property('Hidden').that.is.false;
            //     expect(createBuyerProfileResponse).to.have.property('Allowed').that.is.false;
            //     expect(createBuyerProfileResponse)
            //         .to.have.property('ModificationDateTime')
            //         .that.includes(new Date().toISOString().split('T')[0]);
            //     expect(createBuyerProfileResponse).to.have.property('ModificationDateTime').that.includes('Z');
            //     expect(createBuyerProfileResponse)
            //         .to.have.property('CreationDateTime')
            //         .that.includes(new Date().toISOString().split('T')[0]);
            //     expect(createBuyerProfileResponse).to.have.property('CreationDateTime').that.includes('Z');
            //     await expect(buyerClient.ValidatePermission(policyName)).eventually.to.be.rejectedWith(
            //         `Failed due to exception: You don't have permissions to call this endpoint`,
            //     );
            // });
        });
    });
}
