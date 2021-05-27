import GeneralService, { TesterFunctions } from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';
import { ApiFieldObject } from '@pepperi-addons/papi-sdk';

export async function AccountsTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = new ObjectsService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Array of TSAs
    const TSAarr: ApiFieldObject[] = [
        {
            FieldID: 'TSAAttachmentAPI',
            Label: 'AttachmentAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 24,
                Name: 'Attachment',
            },
            Type: 'String',
            Format: 'String',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {},
        },
        {
            FieldID: 'TSACheckboxAPI',
            Label: 'CheckboxAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 10,
                Name: 'Boolean',
            },
            Type: 'Boolean',
            Format: 'Boolean',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {
                CheckBoxTrueValue: 'true',
                CheckBoxFalseValue: 'false',
            },
        },
        {
            FieldID: 'TSACurrencyAPI',
            Label: 'CurrencyAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 9,
                Name: 'Currency',
            },
            Type: 'Number',
            Format: 'Double',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {},
        },
        {
            FieldID: 'TSADateAPI',
            Label: 'DateAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 5,
                Name: 'Date',
            },
            Type: 'String',
            Format: 'DateTime',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {},
        },
        {
            FieldID: 'TSADateTimeAPI',
            Label: 'DateTimeAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 6,
                Name: 'DateAndTime',
            },
            Type: 'String',
            Format: 'DateTime',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {},
        },
        {
            FieldID: 'TSADecimalNumberAPI',
            Label: 'DecimalNumberAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 8,
                Name: 'NumberReal',
            },
            Type: 'Number',
            Format: 'Double',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {
                DecimalScale: 2,
            },
        },
        {
            FieldID: 'TSADropdownAPI',
            Label: 'DropdownAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 11,
                Name: 'ComboBox',
            },
            Type: 'String',
            Format: 'String',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {
                PicklistValues: ['1', '2', '3', '4', '5'],
            },
        },
        {
            FieldID: 'TSAEmailAPI',
            Label: 'EmailAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 18,
                Name: 'Email',
            },
            Type: 'String',
            Format: 'String',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {},
        },
        {
            FieldID: 'TSAHtmlAPI',
            Label: 'HtmlAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 56,
                Name: 'RichTextHTML',
            },
            Type: 'String',
            Format: 'String',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {},
        },
        {
            FieldID: 'TSAImageAPI',
            Label: 'ImageAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 20,
                Name: 'Image',
            },
            Type: 'String',
            Format: 'String',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {
                IsImageDeviceUploadable: false,
                ImageMegaPixels: 2.0,
                ImageQualityPercentage: 50,
            },
        },
        {
            FieldID: 'TSALimitedLineAPI',
            Label: 'LimitedLineAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 2,
                Name: 'LimitedLengthTextBox',
            },
            Type: 'String',
            Format: 'String',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {
                StringLength: 10,
            },
        },
        {
            FieldID: 'TSALinkAPI',
            Label: 'LinkAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 26,
                Name: 'Link',
            },
            Type: 'String',
            Format: 'String',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {
                readOnlyDisplayValue: '',
            },
        },
        {
            FieldID: 'TSAMultiChoiceAPI',
            Label: 'MultiChoiceAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 12,
                Name: 'MultiTickBox',
            },
            Format: 'String[]',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {
                PicklistValues: ['A', 'B', 'C', 'D'],
            },
        },
        {
            FieldID: 'TSANumberAPI',
            Label: 'NumberAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 7,
                Name: 'NumberInetger',
            },
            Type: 'Integer',
            Format: 'Int64',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {},
        },
        {
            FieldID: 'TSAParagraphAPI',
            Label: 'ParagraphAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 3,
                Name: 'TextArea',
            },
            Type: 'String',
            Format: 'String',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {},
        },
        {
            FieldID: 'TSAPhoneNumberAPI',
            Label: 'PhoneNumberAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 44,
                Name: 'Phone',
            },
            Type: 'String',
            Format: 'String',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {},
        },
        {
            FieldID: 'TSASignatureAPI',
            Label: 'SignatureAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 25,
                Name: 'Signature',
            },
            Type: 'String',
            Format: 'String',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {},
        },
        {
            FieldID: 'TSASingleLineAPI',
            Label: 'SingleLineAPI',
            Description: '',
            IsUserDefinedField: true,
            UIType: {
                ID: 1,
                Name: 'TextBox',
            },
            Type: 'String',
            Format: 'String',
            Hidden: false,
            UserDefinedTableSource: null,
            CalculatedRuleEngine: null,
            TypeSpecificFields: {},
        },
    ];
    //#endregion Array of TSAs

    describe('Accounts Test Suites', () => {
        let createdTSAs;
        let accountExternalID;
        let updatedAccount;
        let createdAccount;
        let bulkCreateAccount;
        let bulkAccountExternalID;
        let bulkJobInfo;
        let bulkAccounts;
        let bulkUpdateAccounts;

        it('Create TSAs for account CRUD', async () => {
            createdTSAs = await service.createBulkTSA('accounts', TSAarr);
            console.log('The following fields created:\n' + createdTSAs);
        });

        it('Create account', async () => {
            accountExternalID = 'Automated API ' + Math.floor(Math.random() * 1000000).toString();

            createdAccount = await service.createAccount({
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
                TSAAttachmentAPI: {
                    URL: 'http://www.africau.edu/images/default/sample.pdf',
                    Content: '',
                },
                TSACheckboxAPI: true,
                TSACurrencyAPI: 10.0,
                TSADateAPI: '2020-09-01Z',
                TSADateTimeAPI: '2020-08-31T21:00:00Z',
                TSADecimalNumberAPI: 5.5,
                TSADropdownAPI: '1',
                TSAEmailAPI: 'Test@test.com',
                TSAHtmlAPI: '<h1>My First Heading</h1>\r\n<p>My first paragraph.</p>',
                TSAImageAPI: {
                    URL: 'https://filedn.com/ltOdFv1aqz1YIFhf4gTY8D7/ingus-info/BLOGS/Photography-stocks3/stock-photography-slider.jpg',
                    Content: '',
                },
                TSALimitedLineAPI: 'Limit text',
                TSALinkAPI: 'https://www.ynet.co.il',
                TSAMultiChoiceAPI: 'A',
                TSANumberAPI: 5,
                TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nAmaze',
                TSAPhoneNumberAPI: '9725554325',
                TSASignatureAPI: {
                    URL: 'https://capitalstars.com/qpay/assets/images/sign2.png',
                    Content: '',
                },
                TSASingleLineAPI: 'Random text',
            });

            const getCreatedAccount = await service.getAccounts({
                where: `InternalID=${createdAccount.InternalID}`,
            });

            return Promise.all([
                expect(getCreatedAccount[0]).to.include({
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
                    State: 'New York',
                    Status: 2,
                    Street: 'Street 1',
                    Type: 'Customer',
                    ZipCode: '12345',
                    TSACheckboxAPI: true,
                    TSACurrencyAPI: 10.0,
                    TSADateAPI: '2020-09-01Z',
                    TSADateTimeAPI: '2020-08-31T21:00:00Z',
                    TSADecimalNumberAPI: 5.5,
                    TSADropdownAPI: '1',
                    TSAEmailAPI: 'Test@test.com',
                    TSAHtmlAPI: '<h1>My First Heading</h1>\r\n<p>My first paragraph.</p>',
                    TSALimitedLineAPI: 'Limit text',
                    TSALinkAPI: 'https://www.ynet.co.il',
                    TSAMultiChoiceAPI: 'A',
                    TSANumberAPI: 5,
                    TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nAmaze',
                    TSAPhoneNumberAPI: '9725554325',
                    TSASingleLineAPI: 'Random text',
                }),
                expect(getCreatedAccount[0].TSAImageAPI.URL).to.include('stock-photography-slider.jpg'),
                expect(getCreatedAccount[0].TSASignatureAPI.URL).to.include('sign2.png'),
                expect(getCreatedAccount[0].TSAAttachmentAPI.URL).to.include('sample.pdf'),
            ]);
        });

        it('Update account', async () => {
            return Promise.all([
                expect(
                    (updatedAccount = await service.createAccount({
                        ExternalID: accountExternalID,
                        City: 'City update',
                        Country: 'US',
                        Debts30: 35,
                        Debts60: 65,
                        Debts90: 95,
                        DebtsAbove90: 105,
                        Discount: 15,
                        Email: 'Test2@test.com',
                        Mobile: '555-123456',
                        Name: accountExternalID + ' Update',
                        Note: 'Note 5',
                        Phone: '555-43210',
                        Prop1: 'Prop 11',
                        Prop2: 'Prop 22',
                        Prop3: 'Prop 33',
                        Prop4: 'Prop 44',
                        Prop5: 'Prop 55',
                        State: 'CA',
                        Status: 2,
                        Street: 'Street 5',
                        Type: 'Customer',
                        ZipCode: '1234567',
                        TSAAttachmentAPI: {
                            URL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                            Content: '',
                        },
                        TSACheckboxAPI: true,
                        TSACurrencyAPI: 15.0,
                        TSADateAPI: '2020-09-05Z',
                        TSADateTimeAPI: '2020-08-25T22:00:00Z',
                        TSADecimalNumberAPI: 5.2,
                        TSADropdownAPI: '1',
                        TSAEmailAPI: 'Test@test.com',
                        TSAHtmlAPI: '<h1>My First Heading</h1>\r\n<p>My first paragraph.</p>',
                        TSAImageAPI: {
                            URL: 'https://image.freepik.com/free-photo/image-human-brain_99433-298.jpg',
                            Content: '',
                        },
                        TSALimitedLineAPI: 'Limit text',
                        TSALinkAPI: 'https://www.ynet.co.il',
                        TSAMultiChoiceAPI: 'C',
                        TSANumberAPI: 2,
                        TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nAmaze\r\nUpdated',
                        TSAPhoneNumberAPI: '972555432512',
                        TSASignatureAPI: {
                            URL: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Platt_Rogers_Spencer_signature.png',
                            Content: '',
                        },
                        TSASingleLineAPI: 'Random TEXT',
                    })),
                ).to.be.include({
                    ExternalID: accountExternalID,
                    City: 'City update',
                    Country: 'US',
                    Debts30: 35,
                    Debts60: 65,
                    Debts90: 95,
                    DebtsAbove90: 105,
                    Discount: 15,
                    Email: 'Test2@test.com',
                    Mobile: '555-123456',
                    Name: accountExternalID + ' Update',
                    Note: 'Note 5',
                    Phone: '555-43210',
                    Prop1: 'Prop 11',
                    Prop2: 'Prop 22',
                    Prop3: 'Prop 33',
                    Prop4: 'Prop 44',
                    Prop5: 'Prop 55',
                    State: 'California',
                    Status: 2,
                    Street: 'Street 5',
                    Type: 'Customer',
                    ZipCode: '1234567',
                    TSACheckboxAPI: true,
                    TSACurrencyAPI: 15.0,
                    TSADateAPI: '2020-09-05Z',
                    TSADateTimeAPI: '2020-08-25T22:00:00Z',
                    TSADecimalNumberAPI: 5.2,
                    TSADropdownAPI: '1',
                    TSAEmailAPI: 'Test@test.com',
                    TSAHtmlAPI: '<h1>My First Heading</h1>\r\n<p>My first paragraph.</p>',
                    TSALimitedLineAPI: 'Limit text',
                    TSALinkAPI: 'https://www.ynet.co.il',
                    TSAMultiChoiceAPI: 'C',
                    TSANumberAPI: 2,
                    TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nAmaze\r\nUpdated',
                    TSAPhoneNumberAPI: '972555432512',
                    TSASingleLineAPI: 'Random TEXT',
                }),
                expect(updatedAccount.TSAImageAPI.URL).to.include('image-human-brain_99433-298.jpg'),
                expect(updatedAccount.TSASignatureAPI.URL).to.include('platt_rogers_spencer_signature.png'),
                expect(updatedAccount.TSAAttachmentAPI.URL).to.include('dummy.pdf'),
            ]);
        });

        it('Delete account', async () => {
            return Promise.all([
                expect(await service.deleteAccount(createdAccount.InternalID)).to.be.true,
                expect(await service.deleteAccount(createdAccount.InternalID)).to.be.false,
                expect(await service.getAccounts({ where: `InternalID=${createdAccount.InternalID}` }))
                    .to.be.an('array')
                    .with.lengthOf(0),
            ]);
        });

        it('Check Hidden=false after update', async () => {
            return Promise.all([
                expect(await service.getAccounts({ where: `InternalID=${createdAccount.InternalID}`, include_deleted: true }))
                    .to.be.an('array')
                    .with.lengthOf(1),
            ]),
                updatedAccount = await service.createAccount({
                    ExternalID: accountExternalID,
                    City: 'City update 1',
                    Name: accountExternalID + ' Update 1',
                }),
                expect(updatedAccount).to.have.property('Hidden').that.is.a('boolean').and.is.false,
                expect(await service.deleteAccount(createdAccount.InternalID)).to.be.true,
                expect(await service.deleteAccount(createdAccount.InternalID)).to.be.false,
                expect(await service.getAccounts({ where: `InternalID=${createdAccount.InternalID}` }))
                    .to.be.an('array')
                    .with.lengthOf(0);
        });


        it('Delete account TSAs', async () => {
            expect(createdTSAs.length == (await service.deleteBulkTSA('accounts', TSAarr)).length).to.be.true;
        });

        it('Bulk create accounts', async () => {
            bulkAccountExternalID = 'Automated API bulk ' + Math.floor(Math.random() * 1000000).toString();
            bulkCreateAccount = await service.bulkCreate('accounts', {
                Headers: ['ExternalID', 'Name'],
                Lines: [
                    [bulkAccountExternalID + ' 1', 'Bulk Account 1'],
                    [bulkAccountExternalID + ' 2', 'Bulk Account 2'],
                    [bulkAccountExternalID + ' 3', 'Bulk Account 3'],
                    [bulkAccountExternalID + ' 4', 'Bulk Account 4'],
                    [bulkAccountExternalID + ' 5', 'Bulk Account 5'],
                ],
            });
            expect(bulkCreateAccount.JobID).to.be.a('number'),
                expect(bulkCreateAccount.URI).to.include('/bulk/jobinfo/' + bulkCreateAccount.JobID);
        });

        it('Verify bulk jobinfo', async () => {
            bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateAccount.JobID, 30000);
            expect(bulkJobInfo.ID).to.equal(bulkCreateAccount.JobID),
                expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain(new Date().toISOString().split('T')[0]),
                expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain('Z'),
                expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain(
                    new Date().toISOString().split('T')[0],
                ),
                expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain('Z'),
                expect(bulkJobInfo.Status, 'Status').to.equal('Ok'),
                expect(bulkJobInfo.StatusCode, 'StatusCode').to.equal(3),
                expect(bulkJobInfo.Records, 'Records').to.equal(5),
                expect(bulkJobInfo.RecordsInserted, 'RecordsInserted').to.equal(5),
                expect(bulkJobInfo.RecordsIgnored, 'RecordsIgnored').to.equal(0),
                expect(bulkJobInfo.RecordsUpdated, 'RecordsUpdated').to.equal(0),
                expect(bulkJobInfo.RecordsFailed, 'RecordsFailed').to.equal(0),
                expect(bulkJobInfo.TotalProcessingTime, 'TotalProcessingTime').to.be.above(0),
                expect(bulkJobInfo.OverwriteType, 'OverwriteType').to.equal(0),
                expect(bulkJobInfo.Error, 'Error').to.equal('');
        });

        it('Verify bulk created accounts', async () => {
            return Promise.all([
                expect(
                    await service.getAccounts({
                        where: "ExternalID like '%" + bulkAccountExternalID + "%'",
                    }),
                )
                    .to.be.an('array')
                    .with.lengthOf(5),
            ]);
        });

        it('Bulk update accounts', async () => {
            bulkCreateAccount = await service.bulkCreate('accounts', {
                Headers: ['ExternalID', 'Name'],
                Lines: [
                    [bulkAccountExternalID + ' 1', 'Bulk Account 1 Update'],
                    [bulkAccountExternalID + ' 2', 'Bulk Account 2 Update'],
                    [bulkAccountExternalID + ' 3', 'Bulk Account 3 Update'],
                    [bulkAccountExternalID + ' 4', 'Bulk Account 4 Update'],
                    [bulkAccountExternalID + ' 5', 'Bulk Account 5 Update'],
                ],
            });
            expect(bulkCreateAccount.JobID).to.be.a('number'),
                expect(bulkCreateAccount.URI).to.include('/bulk/jobinfo/' + bulkCreateAccount.JobID);
        });

        it('Verify bulk update jobinfo', async () => {
            bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateAccount.JobID, 30000);
            expect(bulkJobInfo.ID).to.equal(bulkCreateAccount.JobID),
                expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain(new Date().toISOString().split('T')[0]),
                expect(bulkJobInfo.CreationDate, 'CreationDate').to.contain('Z'),
                expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain(
                    new Date().toISOString().split('T')[0],
                ),
                expect(bulkJobInfo.ModificationDate, 'ModificationDate').to.contain('Z'),
                expect(bulkJobInfo.Status, 'Status').to.equal('Ok'),
                expect(bulkJobInfo.StatusCode, 'StatusCode').to.equal(3),
                expect(bulkJobInfo.Records, 'Records').to.equal(5),
                expect(bulkJobInfo.RecordsInserted, 'RecordsInserted').to.equal(0),
                expect(bulkJobInfo.RecordsIgnored, 'RecordsIgnored').to.equal(0),
                expect(bulkJobInfo.RecordsUpdated, 'RecordsUpdated').to.equal(5),
                expect(bulkJobInfo.RecordsFailed, 'RecordsFailed').to.equal(0),
                expect(bulkJobInfo.TotalProcessingTime, 'TotalProcessingTime').to.be.above(0),
                expect(bulkJobInfo.OverwriteType, 'OverwriteType').to.equal(0),
                expect(bulkJobInfo.Error, 'Error').to.equal('');
        });

        it('Verify bulk accounts update', async () => {
            bulkUpdateAccounts = await service.getAccounts({
                where: "ExternalID like '%" + bulkAccountExternalID + "%'",
            });
            expect(bulkUpdateAccounts[0].Name).to.include('Update'),
                expect(bulkUpdateAccounts[1].Name).to.include('Update'),
                expect(bulkUpdateAccounts[2].Name).to.include('Update'),
                expect(bulkUpdateAccounts[3].Name).to.include('Update'),
                expect(bulkUpdateAccounts[4].Name).to.include('Update');
        });

        it('Delete bulk accounts', async () => {
            bulkAccounts = await service.getAccounts({
                where: "ExternalID like '%" + bulkAccountExternalID + "%'",
            });
            return Promise.all([
                expect(await service.deleteAccount(bulkAccounts[0].InternalID)).to.be.true,
                expect(await service.deleteAccount(bulkAccounts[1].InternalID)).to.be.true,
                expect(await service.deleteAccount(bulkAccounts[2].InternalID)).to.be.true,
                expect(await service.deleteAccount(bulkAccounts[3].InternalID)).to.be.true,
                expect(await service.deleteAccount(bulkAccounts[4].InternalID)).to.be.true,
                expect(
                    await service.getAccounts({
                        where: "ExternalID like '%" + bulkAccountExternalID + "%'",
                    }),
                )
                    .to.be.an('array')
                    .with.lengthOf(0),
            ]);
        });

        // it('BATCH Account Insert', async () => {
        //     accountExternalID = 'Automated API ' + Math.floor(Math.random() * 1000000).toString();
        //     batchAcccountResponse = await service.postBatchAccount([
        //         {
        //         ExternalID: accountExternalID + ' 1',
        //         City: 'City',
        //         Name: accountExternalID + ' 1',
        //         Type: 'Customer',
        //         ZipCode: '12345'
        //         },
        //         {
        //         ExternalID: accountExternalID + ' 2',
        //         City: 'City',
        //         Name: accountExternalID + ' 2',
        //         Type: 'Customer',
        //         ZipCode: '12345'
        //         },
        //         {
        //         ExternalID: accountExternalID + ' 3',
        //         City: 'City',
        //         Name: accountExternalID + ' 3',
        //         Type: 'Customer',
        //         ZipCode: '12345'
        //         },
        //         {
        //         ExternalID: accountExternalID + ' 4',
        //         City: 'City',
        //         Name: accountExternalID + ' 4',
        //         Type: 'Customer',
        //         ZipCode: '12345'
        //         },
        //     ]);
        //     expect(batchAcccountResponse).to.be.an('array').with.lengthOf(4),
        //     batchAcccountResponse.map((row) => {
        //             expect(row).to.have.property('InternalID').that.is.above(0),
        //                 expect(row).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000'),
        //                 expect(row).to.have.property('Status').that.equals('Insert'),
        //                 expect(row).to.have.property('Message').that.equals('Row inserted.'),
        //                 expect(row)
        //                     .to.have.property('URI')
        //                     .that.equals('/user_defined_tables/' + row.InternalID);
        //         });
        // });

        // it('BATCH Account statuses', async () => {
        //     batchAccountresponse = await service.postBatchUDT([
        //         {
        //             MapDataExternalID: UDTRandom,
        //             MainKey: 'batch API Test row 1',
        //             SecondaryKey: '1',
        //             Values: ['Api Test value 1'],
        //         },
        //         {
        //             MapDataExternalID: UDTRandom,
        //             MainKey: 'batch API Test row 2',
        //             SecondaryKey: '2',
        //             Values: ['Api Test value 222'],
        //         },
        //         {
        //             MapDataExternalID: UDTRandom,
        //             MainKey: 'batch API Test row 33',
        //             SecondaryKey: '33',
        //             Values: ['Api Test value 33'],
        //         },
        //         {
        //             MapDataExternalID: 'This is need to get error status',
        //             MainKey: 'batch API Test row 4',
        //             SecondaryKey: '4',
        //             Values: ['Api Test value 4'],
        //         },
        //     ]);
        //     expect(batchUDTresponse).to.be.an('array').with.lengthOf(4),
        //         expect(batchUDTresponse[0]).have.property('InternalID').that.is.above(0),
        //         expect(batchUDTresponse[0])
        //             .to.have.property('UUID')
        //             .that.equals('00000000-0000-0000-0000-000000000000'),
        //         expect(batchUDTresponse[0]).to.have.property('Status').that.equals('Ignore'),
        //         expect(batchUDTresponse[0])
        //             .to.have.property('Message')
        //             .that.equals('No changes in this row. The row is being ignored.'),
        //         expect(batchUDTresponse[0])
        //             .to.have.property('URI')
        //             .that.equals('/user_defined_tables/' + batchUDTresponse[0].InternalID),
        //         expect(batchUDTresponse[1]).have.property('InternalID').that.is.above(0),
        //         expect(batchUDTresponse[1])
        //             .to.have.property('UUID')
        //             .that.equals('00000000-0000-0000-0000-000000000000'),
        //         expect(batchUDTresponse[1]).to.have.property('Status').that.equals('Update'),
        //         expect(batchUDTresponse[1]).to.have.property('Message').that.equals('Row updated.'),
        //         expect(batchUDTresponse[1])
        //             .to.have.property('URI')
        //             .that.equals('/user_defined_tables/' + batchUDTresponse[1].InternalID),
        //         expect(batchUDTresponse[2]).have.property('InternalID').that.is.above(0),
        //         expect(batchUDTresponse[2])
        //             .to.have.property('UUID')
        //             .that.equals('00000000-0000-0000-0000-000000000000'),
        //         expect(batchUDTresponse[2]).to.have.property('Status').that.equals('Insert'),
        //         expect(batchUDTresponse[2]).to.have.property('Message').that.equals('Row inserted.'),
        //         expect(batchUDTresponse[2])
        //             .to.have.property('URI')
        //             .that.equals('/user_defined_tables/' + batchUDTresponse[2].InternalID),
        //         expect(batchUDTresponse[3]).have.property('InternalID').that.equals(0),
        //         expect(batchUDTresponse[3])
        //             .to.have.property('UUID')
        //             .that.equals('00000000-0000-0000-0000-000000000000'),
        //         expect(batchUDTresponse[3]).to.have.property('Status').that.equals('Error'),
        //         expect(batchUDTresponse[3])
        //             .to.have.property('Message')
        //             .that.equals('@MapDataExternalID does not exist.value: This is need to get error status'),
        //         expect(batchUDTresponse[3]).to.have.property('URI').that.equals('');
        // });

        it('Delete Account Message (DI-17285)', async () => {
            const account = await service.createAccount({
                ExternalID: 'Delete Account Test 12345',
                City: 'City',
                Country: 'US',
            });
            return Promise.all([
                await expect(service.deleteAccount(account.InternalID as number)).eventually.to.be.true,
                expect(service.deleteAccount(account.InternalID as number)).eventually.to.be.false,
                expect(service.deleteAccount((account.InternalID as number) + 123456789)).eventually.to.be.rejectedWith(
                    `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"The @InternalID:${
                        (account.InternalID as number) + 123456789
                    } you are trying to update does not exist. Please load it and then try again."`,
                ),
            ]);
        });
    });
}
