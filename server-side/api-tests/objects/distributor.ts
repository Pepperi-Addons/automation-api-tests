import GeneralService, { TesterFunctions } from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';
import { DistributorService } from '../../services/distributor.service';
import { LoremIpsum } from 'lorem-ipsum';
import { TestDataTests } from '../test-service/test_data';

export interface ClientObject {
    Email: string;
    Password: string;
}

export interface AddonVersionTestData {
    Name?: string;
    Version?: string;
    CurrentPhasedVersion?: string;
}

export async function DistributorTests(generalService: GeneralService, request, tester: TesterFunctions) {
    let password = request.body.varKey;
    if (request.body.varKeyEU) {
        password = request.body.varKeyEU;
    }
    const distributorService = new DistributorService(generalService, { body: { varKey: password } });
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    describe('Distributor Test Suites', async () => {
        const clientArr: ClientObject[] = [];
        let distributor = {};
        it(`Start Test Server Time And Date: ${generalService.getServer()} ${generalService.getTime()} ${generalService.getDate()}`, () => {
            expect(generalService.getDate().length == 10 && generalService.getTime().length == 8).to.be.true;
        });

        it(`Create New Distributor`, async function () {
            const lorem = new LoremIpsum({});
            const distributorFirstName = lorem.generateWords(1);
            const distributorLastName = lorem.generateWords(1);
            const distributorEmail = `${
                distributorFirstName + (Math.random() * 10000000000).toString().substring(0, 4)
            }.${distributorLastName}@pepperitest.com`;
            const distributorCompany = lorem.generateWords(3);
            const lettersGenerator = lorem.generateWords(1).substring(0, 2);
            const distributorPassword =
                lettersGenerator[0].toUpperCase() +
                lettersGenerator[1] +
                (Math.random() * 10000000000).toString().substring(0, 6);

            clientArr.push({ Email: distributorEmail, Password: distributorPassword });

            const newDistributor = await distributorService.createDistributor({
                FirstName: distributorFirstName,
                LastName: distributorLastName,
                Email: distributorEmail,
                Company: distributorCompany,
                Password: distributorPassword,
            });
            expect(newDistributor.Status).to.equal(200);
            expect(newDistributor.Body.Status.ID).to.equal(1);
            expect(newDistributor.Body.DistributorUUID).to.have.lengthOf(36);
        });

        it(`Get Test Data`, async () => {
            const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
            const adminService = new GeneralService(adminClient);
            await TestDataTests(adminService, { describe, expect, it } as TesterFunctions, {
                IsAllAddons: false,
                IsUUID: true,
            });
        });

        it(`Get Installed Addons`, async () => {
            const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
            const adminService = new GeneralService(adminClient);
            const adminAddons = await adminService.getInstalledAddons();
            expect(adminAddons.length).to.be.above(10);
            const adminObjectsService = new ObjectsService(adminService);
            const adminDistributorService = new DistributorService(adminService);
            const newDistributorUsers = await adminObjectsService.getUsers();
            const systemAddons = await adminService.getSystemAddons();
            const installedAddons = await adminService.getInstalledAddons();
            expect(newDistributorUsers.length).to.be.above(0);
            expect(systemAddons.length).to.be.above(10);
            expect(installedAddons.length).to.be.above(10);
            const systemAddonTestData: AddonVersionTestData[] = [];
            for (let index = 0; index < systemAddons.length; index++) {
                const phasedVersion = JSON.parse(systemAddons[index].SystemData);
                systemAddonTestData.push({
                    Name: systemAddons[index].Name,
                    Version: phasedVersion['CurrentPhasedVersion'],
                });
            }
            const installedAddonTestData: AddonVersionTestData[] = [];
            for (let index = 0; index < installedAddons.length; index++) {
                const phasedVersion = JSON.parse(installedAddons[index].Addon.SystemData);
                installedAddonTestData.push({
                    Name: installedAddons[index].Addon.Name,
                    Version: installedAddons[index].Version,
                    CurrentPhasedVersion: phasedVersion.CurrentPhasedVersion,
                });
            }

            const arrayOfAddonsDiff = [{}];
            arrayOfAddonsDiff.pop();

            for (let j = 0; j < installedAddonTestData.length; j++) {
                for (let i = 0; i < systemAddonTestData.length; i++) {
                    if (installedAddonTestData[j].Name?.includes(systemAddonTestData[i].Name as string)) {
                        arrayOfAddonsDiff.push({
                            Installed: installedAddonTestData[j],
                            System: systemAddonTestData[i],
                        });
                        break;
                    }
                    if (i == systemAddonTestData.length - 1) {
                        arrayOfAddonsDiff.push({ Installed: installedAddonTestData[j], System: 'Addon Missing' });
                    }
                }
            }
            const tempArrLength = arrayOfAddonsDiff.length;
            for (let j = 0; j < systemAddonTestData.length; j++) {
                for (let i = 0; i < tempArrLength; i++) {
                    if (systemAddonTestData[j].Name?.includes(arrayOfAddonsDiff[i]['Installed'].Name)) {
                        break;
                    }
                    if (i == tempArrLength - 1) {
                        arrayOfAddonsDiff.push({ Installed: 'Addon Missing', System: systemAddonTestData[j] });
                    }
                }
            }

            describe('Verify Missing Details', async () => {
                for (let index = 0; index < arrayOfAddonsDiff.length; index++) {
                    if (arrayOfAddonsDiff[index]['Installed'] == 'Addon Missing') {
                        it(`System Addon Is Not Installed: ${arrayOfAddonsDiff[index]['System'].Name}`, async () => {
                            expect.fail(`Addon.Name: ${JSON.stringify(arrayOfAddonsDiff[index]['System'].Name)}`);
                        });
                    }
                    if (arrayOfAddonsDiff[index]['System'] == 'Addon Missing') {
                        it(`Addon Is Installed That Is Not System: ${arrayOfAddonsDiff[index]['Installed'].Name}`, async () => {
                            expect.fail(`Addon.Name: ${JSON.stringify(arrayOfAddonsDiff[index]['Installed'].Name)}`);
                        });
                    }
                }
            });

            describe('Verify Installed Details', async () => {
                for (let j = 0; j < arrayOfAddonsDiff.length; j++) {
                    for (let i = j + 1; i < arrayOfAddonsDiff.length; i++) {
                        if (arrayOfAddonsDiff[j]['Installed'].Name == arrayOfAddonsDiff[i]['Installed'].Name) {
                            it(`System Addon Is Installed Two Times ${arrayOfAddonsDiff[i]['Installed'].Name}`, async () => {
                                expect.fail(`Addon.Name: ${JSON.stringify(arrayOfAddonsDiff[i]['Installed'].Name)}`);
                            });
                        }
                    }
                }
            });

            describe('Verify Installed Versions Is Phased', async () => {
                for (let i = 0; i < installedAddonTestData.length; i++) {
                    it(`System Addon: ${installedAddonTestData[i].Name} Is Installed With Phased Version ${installedAddonTestData[i].CurrentPhasedVersion}`, async () => {
                        expect(installedAddonTestData[i].Version).to.equal(
                            installedAddonTestData[i].CurrentPhasedVersion,
                        );
                    });
                }
            });

            describe('Create users and buyers + hide one user and buyer', async () => {
                let contactAccount;
                let bulkCreateContact;
                let bulkContactExternalID;
                let bulkJobInfo;
                let contactUUIDArray;

                it(`Create user`, async () => {
                    const userExternalID =
                        'Automated Distributor API User ' + Math.floor(Math.random() * 1000000).toString();
                    const userEmail =
                        'UserEmail' +
                        Math.floor(Math.random() * 1000000).toString() +
                        '@' +
                        Math.floor(Math.random() * 1000000).toString() +
                        '.com';
                    const createdUser = await adminObjectsService.createUser({
                        ExternalID: userExternalID,
                        Email: userEmail,
                        FirstName: Math.random().toString(36).substring(7),
                        LastName: Math.random().toString(36).substring(7),
                        Mobile: Math.floor(Math.random() * 1000000).toString(),
                        Phone: Math.floor(Math.random() * 1000000).toString(),
                        IsInTradeShowMode: true,
                    });
                    expect(createdUser, 'InternalID')
                        .to.have.property('InternalID')
                        .that.is.a('number')
                        .and.is.above(0),
                        expect(createdUser, 'UUID').to.have.property('UUID').that.is.a('string').and.is.not.empty,
                        expect(createdUser, 'ExternalID')
                            .to.have.property('ExternalID')
                            .that.is.a('string')
                            .and.equals(userExternalID);
                    const createdUserPass = await adminDistributorService.resetUserPassword(createdUser.InternalID);
                    clientArr.push({ Email: createdUserPass.Email, Password: createdUserPass.Password });
                    expect(await adminObjectsService.deleteUser('InternalID', createdUser.InternalID)).to.be.true,
                        expect(await adminObjectsService.deleteUser('InternalID', createdUser.InternalID)).to.be.false;
                });

                it('Create account for buyers', async () => {
                    contactAccount = await adminObjectsService.createAccount({
                        ExternalID: 'ContactTestAccount',
                        Name: 'Contact Test Account',
                    });
                });

                it('Bulk create contacts', async () => {
                    bulkContactExternalID =
                        'Automated Distributor API bulk ' + Math.floor(Math.random() * 1000000).toString();
                    bulkCreateContact = await adminObjectsService.bulkCreate('contacts', {
                        Headers: ['ExternalID', 'AccountExternalID', 'FirstName', 'Email'],
                        Lines: [
                            [
                                bulkContactExternalID + ' 1',
                                contactAccount.ExternalID,
                                'Bulk Contact 1',
                                'BuyerEmail' +
                                    Math.floor(Math.random() * 1000000).toString() +
                                    '@' +
                                    Math.floor(Math.random() * 1000000).toString() +
                                    '.com',
                            ],
                            [
                                bulkContactExternalID + ' 2',
                                contactAccount.ExternalID,
                                'Bulk Contact 2',
                                'BuyerEmail' +
                                    Math.floor(Math.random() * 1000000).toString() +
                                    '@' +
                                    Math.floor(Math.random() * 1000000).toString() +
                                    '.com',
                            ],
                        ],
                    });
                    expect(bulkCreateContact.JobID).to.be.a('number'),
                        expect(bulkCreateContact.URI).to.include('/bulk/jobinfo/' + bulkCreateContact.JobID);
                });

                it('Verify bulk jobinfo', async () => {
                    bulkJobInfo = await adminObjectsService.waitForBulkJobStatus(bulkCreateContact.JobID, 30000);
                    expect(bulkJobInfo.ID).to.equal(bulkCreateContact.JobID),
                        expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain(
                            new Date().toISOString().split('T')[0],
                        ),
                        expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain('Z'),
                        expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain(
                            new Date().toISOString().split('T')[0],
                        ),
                        expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain('Z'),
                        expect(bulkJobInfo.Status, 'Status').to.equal('Ok'),
                        expect(bulkJobInfo.StatusCode, 'StatusCode').to.equal(3),
                        expect(bulkJobInfo.Records, 'Records').to.equal(2),
                        expect(bulkJobInfo.RecordsInserted, 'RecordsInserted').to.equal(2),
                        expect(bulkJobInfo.RecordsIgnored, 'RecordsIgnored').to.equal(0),
                        expect(bulkJobInfo.RecordsUpdated, 'RecordsUpdated').to.equal(0),
                        expect(bulkJobInfo.RecordsFailed, 'RecordsFailed').to.equal(0),
                        expect(bulkJobInfo.TotalProcessingTime, 'TotalProcessingTime').to.be.above(0),
                        expect(bulkJobInfo.OverwriteType, 'OverwriteType').to.equal(0),
                        expect(bulkJobInfo.Error, 'Error').to.equal('');
                });

                it('Verify bulk created contacts', async () => {
                    return Promise.all([
                        expect(
                            await adminObjectsService.getBulk(
                                'contacts',
                                "?where=ExternalID LIKE '%" + bulkContactExternalID + "%'",
                            ),
                        )
                            .to.be.an('array')
                            .with.lengthOf(2),
                    ]);
                });

                it('Connect bulk created contacts as buyers', async () => {
                    const connectAsBuyerContacts = await adminObjectsService.getBulk(
                        'contacts',
                        "?where=ExternalID LIKE '%" +
                            bulkContactExternalID +
                            "%'&fields=SecurityGroupUUID,IsBuyer,UUID",
                    );
                    connectAsBuyerContacts.map((contact) => {
                        expect(contact).to.not.have.property('SecurityGroupUUID'),
                            expect(contact).to.have.property('IsBuyer').that.is.a('boolean').and.is.false;
                    });

                    contactUUIDArray = connectAsBuyerContacts.map((item) => item['UUID']);
                    const connectAsBuyer = await adminObjectsService.connectAsBuyer({
                        UUIDs: contactUUIDArray,
                        SelectAll: false,
                    });
                    expect(connectAsBuyer).to.be.an('array').with.lengthOf(2),
                        connectAsBuyer.map((buyer) => {
                            expect(buyer, 'Connect as buyer name').to.have.property('name').that.is.not.empty,
                                expect(buyer, 'Connect as buyer email').to.have.property('email').that.is.not.empty,
                                expect(buyer, 'Connect as buyer message')
                                    .to.have.property('message')
                                    .that.is.a('string').and.is.empty,
                                expect(buyer, 'Connect as buyer password').to.have.property('password').that.is.not
                                    .empty;
                        });

                    const connectedContacts = await adminObjectsService.getBulk(
                        'contacts',
                        "?where=ExternalID LIKE '%" + bulkContactExternalID + "%'&fields=SecurityGroupUUID,IsBuyer",
                    );
                    connectedContacts.map((contact) => {
                        expect(contact, 'Buyer security group UUID')
                            .to.have.property('SecurityGroupUUID')
                            .that.is.a('string').and.is.not.empty,
                            expect(contact, 'Buyer IsBuyer').to.have.property('IsBuyer').that.is.a('boolean').and.is
                                .true;
                    });

                    clientArr.push({ Email: connectAsBuyer[0].email, Password: connectAsBuyer[0].password });
                    clientArr.push({ Email: connectAsBuyer[1].email, Password: connectAsBuyer[1].password });
                    const buyerToDelete = await adminObjectsService.getBulk(
                        'contacts',
                        "?where=Email='" + connectAsBuyer[1].email + "'",
                    );
                    expect(await adminObjectsService.deleteContact(buyerToDelete[0].InternalID)).to.be.true,
                        expect(await adminObjectsService.deleteContact(buyerToDelete[0].InternalID)).to.be.false;
                });

                it('Get distributor and support admin user', async () => {
                    distributor = await adminService.getDistributor();
                    const supportAdmin = await adminDistributorService.resetUserPassword(
                        distributor['SupportAdminUser'].ID,
                    );
                    clientArr.push({ Email: supportAdmin.Email, Password: supportAdmin.Password });
                });
            });

            describe('Set distributor to trial with less than 6 months and verify users+buyers', async () => {
                let supportAdminClient;
                let supportAdminService;
                //   let supportAdminObjectsService;
                let supportAdminDistributorService;
                it(`Initiate support admin client`, async () => {
                    supportAdminClient = await generalService.initiateTester(clientArr[4].Email, clientArr[4].Password);
                    supportAdminService = new GeneralService(supportAdminClient);
                    //        supportAdminObjectsService = new ObjectsService(supportAdminService);
                    supportAdminDistributorService = new DistributorService(supportAdminService);
                });

                it(`Set trial expiration to less than 6 months`, async () => {
                    const datePlusZero = new Date();
                    const minusThreeMonths = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * -90);
                    const distributorResponse = await distributorService.setTrialExpirationDate({
                        UUID: distributor['UUID'],
                        TrialExpirationDateTime: minusThreeMonths.toISOString().split('.')[0],
                    });
                    expect(distributorResponse.Body.TrialExpirationDateTime).to.equal(
                        minusThreeMonths.toISOString().split('.')[0],
                    );
                    const expirationResponse = await supportAdminDistributorService.runExpirationProtocol();
                    expect(expirationResponse.Status.Name).to.equal('Success');
                });
            });
        });
    });
}
