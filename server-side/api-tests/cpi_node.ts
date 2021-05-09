import GeneralService, { TesterFunctions } from '../services/general.service';
import { CPINodeService } from '../services/cpi-node.service';
import { Item, User, Account } from '@pepperi-addons/papi-sdk';

export async function CPINodeTests(generalService: GeneralService, tester: TesterFunctions) {
    const cpiNodeService = new CPINodeService(generalService.papiClient);
    //const clientService = generalService; // only use to execute tests on specifc clients - canceled on 04/02/2021
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    let userExID: string;
    let userInternalID: number;
    // const usersArr = await cpiNodeService.papiClient.get('/users');
    // usersArr.forEach((element) => {
    //     debugger;
    // });

    // generalService.sleep(200);

    // const oren = await generalService.fetchStatus('GET', '/');
    // console.log({ oren: oren });

    // const oren2 = await generalService.fetchStatus('GET', '/%');
    // console.log({ oren2: oren2 });

    // const oren3 = await generalService.fetchStatus('GET', '/users',undefined,undefined,undefined,100);
    // console.log({ oren3: oren3 });

    // debugger;

    //#region Tests for practive
    describe('CPI Node Tests Suites', () => {
        describe('Endpoints', async () => {
            it('Validate GET Users', async () => {
                const res = await generalService.fetchStatus('/Users', { method: 'GET' });
                expect(res.Status).to.be.a('number').equal(200),
                    expect(res.Ok).that.is.a('boolean').and.is.true,
                    expect(res.Error).that.is.an('object').and.is.empty,
                    expect(res.Body.length).to.be.above(0),
                    expect(res.Body[0].UUID).that.is.a('string').and.is.not.empty,
                    expect(res.Body[0].ExternalID).that.is.a('string'),
                    expect(res.Body[0].Email).that.is.a('string').and.is.not.empty,
                    expect(res.Body[0].FirstName).that.is.a('string'),
                    expect(res.Body[0].LastName).that.is.a('string'),
                    expect(res.Body[0].Hidden).that.is.a('boolean').and.is.false;
            });

            const userExternalID = 'Automated API User ' + Math.floor(Math.random() * 1000000).toString();
            userExID = userExternalID;
            const userEmail =
                'Email' +
                Math.floor(Math.random() * 1000000).toString() +
                '@' +
                Math.floor(Math.random() * 1000000).toString() +
                '.com';
            const userBody = {
                ExternalID: userExternalID,
                Email: userEmail,
                FirstName: Math.random().toString(36).substring(7),
                LastName: Math.random().toString(36).substring(7),
                Mobile: Math.floor(Math.random() * 1000000).toString(),
                Phone: Math.floor(Math.random() * 1000000).toString(),
                IsInTradeShowMode: false,
            };

            it('Validate CreateUser Post', async () => {
                const user = await generalService.fetchStatus('/CreateUser', {
                    method: 'POST',
                    body: JSON.stringify(userBody),
                });
                //debugger;
                userInternalID = user.Body.InternalID;
                expect(user.Status, 'Should return 201 ,DI-18052').to.be.a('number').equal(200), //should return 201 on creation - DI-18052
                    expect(user.Body).to.have.property('InternalID').that.is.a('number').and.is.above(0),
                    expect(user.Ok).that.is.a('boolean').and.is.true,
                    expect(user.Error).that.is.an('object').and.is.empty,
                    expect(user.Body).to.have.property('UUID').that.is.a('string').and.is.not.empty,
                    expect(user.Body).to.have.property('ExternalID').that.is.a('string').and.is.equal(userExternalID),
                    expect(user.Body).to.have.property('FirstName').that.is.a('string').and.is.not.empty,
                    expect(user.Body).to.have.property('LastName').that.is.a('string').and.is.not.empty,
                    expect(user.Body).to.have.property('Mobile').that.is.a('string').and.is.not.empty,
                    expect(user.Body).to.have.property('Email').that.is.a('string').and.is.not.empty,
                    expect(user.Body).to.have.property('Hidden').that.is.a('boolean').and.is.false,
                    expect(user.Body).to.have.property('IsInTradeShowMode').that.is.a('boolean').and.is.false,
                    expect(user.Body)
                        .to.have.property('CreationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(user.Body).to.have.property('CreationDateTime').that.contains('Z'),
                    expect(user.Body)
                        .to.have.property('ModificationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(user.Body).to.have.property('ModificationDateTime').that.contains('Z'),
                    expect(user.Body).to.have.property('Phone').that.is.a('string').and.is.not.empty,
                    expect(user.Body).to.have.property('Profile').that.is.an('object').and.is.not.empty,
                    expect(user.Body.Profile).to.deep.equal({
                        Data: {
                            InternalID: user.Body.Profile.Data.InternalID,
                            Name: 'Rep',
                        },
                        URI: '/profiles/' + user.Body.Profile.Data.InternalID,
                    }),
                    expect(user.Body, 'Role').to.have.property('Role');
            });

            it('Validate update user', async () => {
                (userBody.FirstName = Math.random().toString(36).substring(7)),
                    (userBody.LastName = Math.floor(Date.now() / 1000).toString()),
                    (userBody.Mobile = Math.floor(Math.random() * 1000000).toString()),
                    (userBody.Phone = Math.floor(Math.random() * 1000000).toString());

                const user = await generalService.fetchStatus('/Users?where=ExternalID=' + userBody.ExternalID, {
                    method: 'POST',
                    body: JSON.stringify(userBody),
                });

                expect(user.Status).to.be.a('number').equal(200),
                    expect(user.Ok).that.is.a('boolean').and.is.true,
                    expect(user.Error).that.is.an('object').and.is.empty,
                    expect(user.Body).to.have.property('FirstName').to.be.a('string').and.equals(userBody.FirstName),
                    expect(user.Body).to.have.property('LastName').to.be.a('string').and.equals(userBody.LastName),
                    expect(user.Body).to.have.property('Mobile').to.be.a('string').and.equals(userBody.Mobile),
                    expect(user.Body).to.have.property('Phone').to.be.a('string').and.equals(userBody.Phone);
            });
        });

        describe('Scenarios', async () => {
            it('Validating responses for objects creation', async () => {
                //create account
                const accountExternalID: string = 'AutomatedAPI' + Math.floor(Math.random() * 1000000).toString();
                const accountObj: Account = {
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
                };

                const account = await generalService.fetchStatus('/Accounts', {
                    method: 'POST',
                    body: JSON.stringify(accountObj),
                });

                expect(account.Ok).that.is.a('boolean').and.is.true,
                    expect(account.Error).that.is.an('object').and.is.empty,
                    expect(account.Status).to.be.a('number').equal(201);

                //update Account
                accountObj.Prop1 = 'Prop 11';
                accountObj.Prop2 = 'Prop 22';
                accountObj.Prop3 = 'Prop 33';
                accountObj.Prop4 = 'Prop 44';
                accountObj.Prop5 = 'Prop 55';
                const updatedAccount = await generalService.fetchStatus('/Accounts', {
                    method: 'POST',
                    body: JSON.stringify(accountObj),
                });
                expect(updatedAccount.Ok).that.is.a('boolean').and.is.true,
                    expect(updatedAccount.Error).that.is.an('object').and.is.empty,
                    expect(updatedAccount.Status).to.be.a('number').equal(200);

                //create contacts
                const contactExternalID = 'Automated API ' + Math.floor(Math.random() * 1000000).toString();
                const contactObj = {
                    ExternalID: contactExternalID,
                    Email: 'ContactTest@mail.com',
                    Phone: '123-45678',
                    Mobile: '123-45678',
                    FirstName: 'Contact',
                    LastName: 'Test',
                    Account: {
                        Data: {
                            InternalID: account.Body.InternalID,
                        },
                    },
                };

                const contact = await generalService.fetchStatus('/Contacts', {
                    method: 'POST',
                    body: JSON.stringify(contactObj),
                });
                expect(contact.Ok).that.is.a('boolean').and.is.true,
                    expect(contact.Error).that.is.an('object').and.is.empty,
                    expect(contact.Status).to.be.a('number').equal(201);

                //update contact
                contactObj.Phone = '123-45678-1337';
                contactObj.Mobile = '123-45678-1337';
                contactObj.FirstName = 'Contact_updated';
                const updatedContact = await generalService.fetchStatus('/Contacts', {
                    method: 'POST',
                    body: JSON.stringify(contactObj),
                });
                expect(updatedContact.Ok).that.is.a('boolean').and.is.true,
                    expect(updatedContact.Error).that.is.an('object').and.is.empty,
                    expect(updatedContact.Status).to.be.a('number').equal(200);

                //create activities
                const activityExternalID = 'Automated API Activity ' + Math.floor(Math.random() * 1000000).toString();
                const activityObj = {
                    ExternalID: activityExternalID,
                    ActivityTypeID: 134047,
                    Status: 1,
                    Title: 'Testing',
                    Account: {
                        Data: {
                            InternalID: account.Body.InternalID,
                        },
                    },
                };

                const activity = await generalService.fetchStatus('/Activities', {
                    method: 'POST',
                    body: JSON.stringify(activityObj),
                });
                expect(activity.Ok).that.is.a('boolean').and.is.true,
                    expect(activity.Error).that.is.an('object').and.is.empty,
                    expect(activity.Status).to.be.a('number').equal(201);

                //update activities
                activityObj.Status = 2;
                activityObj.Title = 'Testing updated';
                const updatedActivity = await generalService.fetchStatus('/Activities', {
                    method: 'POST',
                    body: JSON.stringify(activityObj),
                });
                expect(updatedActivity.Ok).that.is.a('boolean').and.is.true,
                    expect(updatedActivity.Error).that.is.an('object').and.is.empty,
                    expect(updatedActivity.Status).to.be.a('number').equal(200);

                //Transactions
                const transactionExternalID =
                    'Automated API Transaction' + Math.floor(Math.random() * 1000000).toString();
                const transactionObj = {
                    ExternalID: transactionExternalID,
                    ActivityTypeID: 138725,
                    Status: 1,
                    Account: {
                        Data: {
                            InternalID: account.Body.InternalID,
                        },
                    },
                    Catalog: {
                        Data: {
                            ExternalID: 'Default Catalog',
                        },
                    },
                };

                const transaction = await generalService.fetchStatus('/transactions', {
                    method: 'POST',
                    body: JSON.stringify(transactionObj),
                });
                expect(transaction.Ok).that.is.a('boolean').and.is.true,
                    expect(transaction.Error).that.is.an('object').and.is.empty,
                    expect(transaction.Status).to.be.a('number').equal(201);

                //update Transaction
                transactionObj.Status = 2;
                const updatedTransaction = await generalService.fetchStatus('/transactions', {
                    method: 'POST',
                    body: JSON.stringify(transactionObj),
                });
                expect(updatedTransaction.Ok).that.is.a('boolean').and.is.true,
                    expect(updatedTransaction.Error).that.is.an('object').and.is.empty,
                    expect(updatedTransaction.Status).to.be.a('number').equal(200);

                //create Items
                const itemExternalID = 'Automated API Item' + Math.floor(Math.random() * 1000000).toString();
                const itemObj = {
                    ExternalID: itemExternalID,
                    MainCategoryID: 'Test',
                    UPC: 'SameCode1',
                    Name: itemExternalID,
                    LongDescription: itemExternalID,
                    Price: 1.0,
                    SecondaryPrice: 1.5,
                    CostPrice: 0.5,
                    Discount: 0,
                    AllowDecimal: false,
                    CaseQuantity: 1,
                    MinimumQuantity: 1,
                    Hidden: false,
                };

                const item = await generalService.fetchStatus('/items', {
                    method: 'POST',
                    body: JSON.stringify(itemObj),
                });
                expect(item.Ok).that.is.a('boolean').and.is.true,
                    expect(item.Error).that.is.an('object').and.is.empty,
                    expect(item.Status).to.be.a('number').equal(201);

                //update items
                itemObj.Price = 2.0;
                itemObj.SecondaryPrice = 3;
                itemObj.CostPrice = 1;
                itemObj.Discount = 1;

                const updatedItem = await generalService.fetchStatus('/items', {
                    method: 'POST',
                    body: JSON.stringify(itemObj),
                });
                expect(updatedItem.Ok).that.is.a('boolean').and.is.true,
                    expect(updatedItem.Error).that.is.an('object').and.is.empty,
                    expect(updatedItem.Status).to.be.a('number').equal(200);

                //create inventory
                const inventoryObj = {
                    InternalID: item.Body.InternalID,
                    ItemExternalID: item.Body.ExternalID,
                    InStockQuantity: 2,
                    Item: {
                        Data: {
                            InternalID: item.Body.InternalID,
                            ExternalID: item.Body.ExternalID,
                        },
                    },
                };

                const inventory = await generalService.fetchStatus('/inventory', {
                    method: 'POST',
                    body: JSON.stringify(inventoryObj),
                });
                expect(inventory.Ok).that.is.a('boolean').and.is.true,
                    expect(inventory.Error).that.is.an('object').and.is.empty,
                    expect(inventory.Status).to.be.a('number').equal(201);

                //update inventory
                inventoryObj.InStockQuantity = 4;

                const updateInventory = await generalService.fetchStatus('/inventory', {
                    method: 'POST',
                    body: JSON.stringify(inventoryObj),
                });
                expect(updateInventory.Ok).that.is.a('boolean').and.is.true,
                    expect(updateInventory.Error).that.is.an('object').and.is.empty,
                    expect(updateInventory.Status).to.be.a('number').equal(200);

                //create Lines
                const lineObj = {
                    TransactionInternalID: transaction.Body.InternalID,
                    LineNumber: 0,
                    ItemExternalID: item.Body.ExternalID,
                    UnitsQuantity: 1,
                };

                const line = await generalService.fetchStatus('/transaction_lines', {
                    method: 'POST',
                    body: JSON.stringify(lineObj),
                });
                expect(line.Ok).that.is.a('boolean').and.is.true,
                    expect(line.Error).that.is.an('object').and.is.empty,
                    expect(line.Status).to.be.a('number').equal(201);

                //update lines
                lineObj.UnitsQuantity = 3;

                const upcatedLine = await generalService.fetchStatus('/transaction_lines', {
                    method: 'POST',
                    body: JSON.stringify(lineObj),
                });
                expect(upcatedLine.Ok).that.is.a('boolean').and.is.true,
                    expect(upcatedLine.Error).that.is.an('object').and.is.empty,
                    expect(upcatedLine.Status).to.be.a('number').equal(200);

                //create Account-Users
                const relationObj = {
                    UserExternalID: userExID,
                    AccountExternalID: accountExternalID,
                    Hidden: false,
                    Account: {
                        Data: {
                            InternalID: account.Body.InternalID,
                            ExternalID: account.Body.ExternalID,
                        },
                    },
                    User: {
                        Data: {
                            InternalID: userInternalID,
                            ExternalID: userExID,
                        },
                    },
                };

                const relation = await generalService.fetchStatus('/account_users', {
                    method: 'POST',
                    body: JSON.stringify(relationObj),
                });
                expect(relation.Ok).that.is.a('boolean').and.is.true,
                    expect(relation.Error).that.is.an('object').and.is.empty,
                    expect(relation.Status).to.be.a('number').equal(201);

                //update Account-Users
                relationObj.Hidden = true;

                const updatedRelation = await generalService.fetchStatus('/account_users', {
                    method: 'POST',
                    body: JSON.stringify(relationObj),
                });
                expect(updatedRelation.Ok).that.is.a('boolean').and.is.true,
                    expect(updatedRelation.Error).that.is.an('object').and.is.empty,
                    expect(updatedRelation.Status).to.be.a('number').equal(200);

                //deletion for all objects
                //lines
                const deletedLine = await generalService.fetchStatus('/transaction_lines/' + line.Body.InternalID, {
                    method: 'DELETE',
                });
                expect(deletedLine.Ok).that.is.a('boolean').and.is.true,
                    expect(deletedLine.Error).that.is.an('object').and.is.empty,
                    expect(deletedLine.Status).to.be.a('number').equal(200);

                //Transactions
                const deletedTransaction = await generalService.fetchStatus(
                    '/transactions/' + transaction.Body.InternalID,
                    { method: 'DELETE' },
                );
                expect(deletedTransaction.Ok).that.is.a('boolean').and.is.true,
                    expect(deletedTransaction.Error).that.is.an('object').and.is.empty,
                    expect(deletedTransaction.Status).to.be.a('number').equal(200);

                //Item
                const deletedItem = await generalService.fetchStatus('/items/' + item.Body.InternalID, {
                    method: 'DELETE',
                });
                expect(deletedItem.Ok).that.is.a('boolean').and.is.true,
                    expect(deletedItem.Error).that.is.an('object').and.is.empty,
                    expect(deletedItem.Status).to.be.a('number').equal(200);

                //Activities
                const deletedActivity = await generalService.fetchStatus('/activities/' + activity.Body.InternalID, {
                    method: 'DELETE',
                });
                expect(deletedActivity.Ok).that.is.a('boolean').and.is.true,
                    expect(deletedActivity.Error).that.is.an('object').and.is.empty,
                    expect(deletedActivity.Status).to.be.a('number').equal(200);

                //Contacts
                const deletedContact = await generalService.fetchStatus('/contacts/' + contact.Body.InternalID, {
                    method: 'DELETE',
                });
                expect(deletedContact.Ok).that.is.a('boolean').and.is.true,
                    expect(deletedContact.Error).that.is.an('object').and.is.empty,
                    expect(deletedContact.Status).to.be.a('number').equal(200);

                //Accounts
                const deletedAccount = await generalService.fetchStatus('/accounts/' + account.Body.InternalID, {
                    method: 'DELETE',
                });
                expect(deletedAccount.Ok).that.is.a('boolean').and.is.true,
                    expect(deletedAccount.Error).that.is.an('object').and.is.empty,
                    expect(deletedAccount.Status).to.be.a('number').equal(200);
            });
        });

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
                                expect(LngDesc).to.be.a('string');
                        });
                });
            });

            describe('Get Transactions tests', () => {
                it('Checking items count', async () => {
                    const count: number = await cpiNodeService.countTransactions({
                        where: `Hidden = 0`,
                        include_deleted: false,
                    });
                    expect(count).to.be.a('number').and.is.above(0);
                });
            });

            ///accounts
            describe('Account object tests', () => {
                it('Account Creation', async () => {
                    const accountExternalID: string = 'AutomatedAPI' + Math.floor(Math.random() * 1000000).toString();
                    const accountObj: Account = {
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
                    };

                    const createdAccount = await cpiNodeService.postAccount(accountObj);

                    const gottenAccount = await cpiNodeService.findAccount({
                        where: `InternalID=${createdAccount.InternalID}`,
                        order_by: 'CreationDate',
                    });

                    expect(gottenAccount[0].State).to.include('New York');
                    gottenAccount[0].State = 'NY';
                    expect(gottenAccount[0]).to.include(accountObj);
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
