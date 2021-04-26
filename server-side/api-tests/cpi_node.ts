import GeneralService, { TesterFunctions } from '../services/general.service';
import { CPINodeService } from '../services/cpi-node.service';
import { Item, User } from '@pepperi-addons/papi-sdk';

export async function CPINodeTests(generalService: GeneralService, tester: TesterFunctions) {
    const cpiNodeService = new CPINodeService(generalService.papiClient);
    //const clientService = generalService; // only use to execute tests on specifc clients - canceled on 04/02/2021
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    // const usersArr = await cpiNodeService.papiClient.get('/users');
    // usersArr.forEach((element) => {
    //     debugger;
    // });

    //#region Tests for practive
    describe('CPI Node Tests Suites', () => {
        describe('Endpoints', async () => {
            it('Validate GET', async () => {
                const res = await generalService.fetchStatus('GET', '/Users');
                expect(res.Status).to.be.an('number').equal(200),
                    expect(res.Body.length).to.be.above(0),
                    expect(res.Body[0].UUID).that.is.a('string').and.is.not.empty,
                    expect(res.Body[0].ExternalID).that.is.a('string'),
                    expect(res.Body[0].Email).that.is.a('string').and.is.not.empty,
                    expect(res.Body[0].FirstName).that.is.a('string'),
                    expect(res.Body[0].LastName).that.is.a('string'),
                    expect(res.Body[0].Hidden).that.is.a('boolean').and.is.false;
            });

            it('Validate POST', async () => {
                //  const user = await generalService.fetchStatus("POST","/Users");
            });
        });
        // describe('Scenarios', async () => {});
        // describe('Bug verifications', async () => {});

        describe('Endpoints', async () => {
            describe('Get Dor', () => {
                it('Validating Dor is awesome', async () => {
                    expect(cpiNodeService.getDorIsAwesome()).include('Cool');
                });
            });

            describe('Get', () => {
                it('Get All users with specific params', async () => {
                    const Dor: User[] = await cpiNodeService.findUsers({
                        where: 'ExternalID = 2',
                        fields: ['FirstName'],
                    });
                    expect(Dor[0]).to.have.property('FirstName').contain('kl');
                });

                it('Get UserData', async () => {
                    const Dor: User[] = await cpiNodeService.getUserData({
                        where: `Hidden = 0`,
                        order_by: 'CreationDateTime',
                    });
                    Dor.forEach((obj) => {
                        //debugger;
                        expect(obj).to.have.property('LastName').is.not.null;
                    });
                });
            });

            describe('Get Items tests', () => {
                // new test here
                it('Validating Items for specific params', async () => {
                    const Dor: Item[] = await cpiNodeService.getItemData({
                        where: `Hidden = 0`,
                        order_by: 'CreationDateTime',
                    });

                    expect(Dor).to.be.an('array').with.lengthOf(100),
                        expect(Dor[0]).to.have.property('ExternalID').to.contain('R'),
                        Dor.forEach((obj) => {
                            const LngDesc = obj.LongDescription;

                            expect(obj).to.be.an('object').to.have.property('LongDescription').not.to.be.null,
                                expect(LngDesc).to.be.an('string');
                        });
                });
            });

            describe('Get Transactions tests', () => {
                it('Checking items count', async () => {
                    const Dor: number = await cpiNodeService.countTransactions({
                        where: `Hidden = 0`,
                        include_deleted: false,
                    });
                    expect(Dor).to.be.an('number').and.is.above(0);
                });
            });

            ///accounts
            describe('Account object tests', () => {
                it('Account Creation', async () => {
                    const accountExternalID: string = 'AutomatedAPI' + Math.floor(Math.random() * 1000000).toString();
                    const createdAccount = await cpiNodeService.postAccount({
                        ExternalID: accountExternalID,
                        City: 'City',
                        Country: 'US',
                        Debts30: 30,
                        Debts60: 60,
                        Debts90: 90,
                        DebtsAbove90: 100,
                        Discount: 10,
                        Email: 'Test1@test.com',
                        Mobile: '555-1234',
                        Name: accountExternalID,
                        Note: 'Note 1',
                        Phone: '555-4321',
                        Prop1: 'Prop 1',
                        Prop2: 'Prop 2',
                        Prop3: 'Prop 3',
                        Prop4: 'Prop 4',
                        Prop5: 'Prop 5',
                        State: 'NY',
                        Status: 2,
                        Street: 'Street 1',
                        Type: 'Customer',
                        ZipCode: '12345',
                    });

                    const gottenAccount = await cpiNodeService.findAccount({
                        where: `InternalID=${createdAccount.InternalID}`,
                        order_by: 'CreationDate',
                    });

                    return Promise.all([
                        expect(gottenAccount[0]).to.include({
                            ExternalID: accountExternalID,
                            City: createdAccount.City,
                            Country: createdAccount.Country,
                            Debts30: createdAccount.Debts30,
                            Debts60: createdAccount.Debts60,
                            Debts90: createdAccount.Debts90,
                            DebtsAbove90: createdAccount.DebtsAbove90,
                            Discount: createdAccount.Discount,
                            Email: createdAccount.Email,
                            Mobile: createdAccount.Mobile,
                            Name: accountExternalID,
                            Note: createdAccount.Note,
                            Phone: createdAccount.Phone,
                            Prop1: createdAccount.Prop1,
                            Prop2: createdAccount.Prop2,
                            Prop3: createdAccount.Prop3,
                            Prop4: createdAccount.Prop4,
                            Prop5: createdAccount.Prop5,
                            State: createdAccount.State,
                            Status: createdAccount.Status,
                            Street: createdAccount.Street,
                            Type: createdAccount.Type,
                            ZipCode: createdAccount.ZipCode,
                        }),
                    ]);
                });

                // it('Account Data update test', async () => {
                //     const gottenAccount = await cpiNodeService.findAccount({
                //         where: `Hidden = 0`,
                //         order_by: 'CreationDate',
                //     });

                //     const ExternalID = gottenAccount[0].ExternalID;

                //     let gottenAccountNewData = await cpiNodeService.postAccount({
                //         ExternalID: ExternalID,
                //         Country: 'Israel',
                //     });

                //     let gottenAccountFromServer = await cpiNodeService.findAccount({
                //         where: `ExternalID = ${ExternalID}`,
                //         order_by: 'CreationDate',
                //     });

                //     expect(gottenAccountFromServer[0]).to.be.not.null,
                //         expect(gottenAccountFromServer[0].Country).to.be.equal('Israel');
                // });
            });
        });
    });

    //#endregion Tests for practice
}
