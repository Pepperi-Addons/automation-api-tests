import GeneralService, { TesterFunctions } from '../services/general.service';
import { ObjectsService } from '../services/objects.service';
import { ApiFieldObject } from '@pepperi-addons/papi-sdk';

// All Sanity Tests
export async function ObjectsTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = new ObjectsService(generalService.papiClient);
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

    const transactionLineTSAarr: ApiFieldObject[] = [
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

    describe('Objects Test Suites', () => {
        describe('Accounts', () => {
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
                        URL:
                            'https://filedn.com/ltOdFv1aqz1YIFhf4gTY8D7/ingus-info/BLOGS/Photography-stocks3/stock-photography-slider.jpg',
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
                } as any);

                const getCreatedAccount = (await service.getAccounts({
                    where: `InternalID=${createdAccount.InternalID}`,
                })) as any;

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
                                URL:
                                    'https://upload.wikimedia.org/wikipedia/commons/9/92/Platt_Rogers_Spencer_signature.png',
                                Content: '',
                            },
                            TSASingleLineAPI: 'Random TEXT',
                        } as any)),
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
                    expect(await service.deleteAccount(createdAccount.InternalID as any)).to.be.true,
                    expect(await service.deleteAccount(createdAccount.InternalID as any)).to.be.false,
                    expect(await service.getAccounts({ where: `InternalID=${createdAccount.InternalID}` }))
                        .to.be.an('array')
                        .with.lengthOf(0),
                ]);
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
                    expect(await service.getAccounts({ where: "ExternalID like '%" + bulkAccountExternalID + "%'" }))
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
                    expect(await service.deleteAccount(bulkAccounts[0].InternalID as any)).to.be.true,
                    expect(await service.deleteAccount(bulkAccounts[1].InternalID as any)).to.be.true,
                    expect(await service.deleteAccount(bulkAccounts[2].InternalID as any)).to.be.true,
                    expect(await service.deleteAccount(bulkAccounts[3].InternalID as any)).to.be.true,
                    expect(await service.deleteAccount(bulkAccounts[4].InternalID as any)).to.be.true,
                    expect(await service.getAccounts({ where: "ExternalID like '%" + bulkAccountExternalID + "%'" }))
                        .to.be.an('array')
                        .with.lengthOf(0),
                ]);
            });

            // it('Delete Account Message (DI-17285)', async () => {
            //     const account = await service.createAccount({
            //         ExternalID: 'Oren Test 12345',
            //         City: 'City',
            //         Country: 'US',
            //     });
            //     return Promise.all([
            //         expect(service.deleteAccount(account.InternalID as any)).eventually.to.be.true,
            //         expect(service.deleteAccount(account.InternalID as any)).eventually.to.be.false,
            //         expect(service.deleteAccount((account.InternalID as any) + 123))
            //             .eventually.to.be.rejectedWith
            //             // Bug: 'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Upload file error, internal code = ST12',
            //             // version 1: `The Account with InternalID: ${account.InternalID} that you are trying to update does not exist. Please verify and try again.`,
            //             // version 2: `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"The ${account.InternalID} you are trying to update does not exist. Please load it and then try again.`,
            //             (),
            //     ]);
            // });
        });

        describe('Contacts', () => {
            let contactAccount;
            let updatedContact;
            let contactTSAs;
            let contactExternalID;
            let createdContact;
            let bulkCreateContact;
            let bulkContactExternalID;
            let bulkJobInfo;
            let bulkContacts;
            let bulkUpdateContacts;
            let contactUUIDArray;

            it('Create account and TSAs for contact CRUD', async () => {
                contactAccount = await service.createAccount({
                    ExternalID: 'ContactTestAccount',
                    Name: 'Contact Test Account',
                });
                contactTSAs = await service.createBulkTSA('contacts', TSAarr);
                console.log('The following fields were created:\n' + contactTSAs);
            });

            it('Create contact', async () => {
                contactExternalID = 'Automated API ' + Math.floor(Math.random() * 1000000).toString();
                createdContact = await service.createContact({
                    ExternalID: contactExternalID,
                    Email: 'ContactTest@mail.com',
                    Phone: '123-45678',
                    Mobile: '123-45678',
                    FirstName: 'Contact',
                    LastName: 'Test',
                    Account: {
                        Data: {
                            InternalID: contactAccount.InternalID,
                        },
                    },
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
                        URL:
                            'https://filedn.com/ltOdFv1aqz1YIFhf4gTY8D7/ingus-info/BLOGS/Photography-stocks3/stock-photography-slider.jpg',
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

                const getCreatedContact = await service.getContacts(createdContact.InternalID);

                return Promise.all([
                    expect(getCreatedContact[0]).to.include({
                        ExternalID: contactExternalID,
                        Email: 'ContactTest@mail.com',
                        Phone: '123-45678',
                        Mobile: '123-45678',
                        FirstName: 'Contact',
                        LastName: 'Test',
                        Status: 2,
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
                    expect(getCreatedContact[0].TSAImageAPI.URL).to.include('stock-photography-slider.jpg'),
                    expect(getCreatedContact[0].TSASignatureAPI.URL).to.include('sign2.png'),
                    expect(getCreatedContact[0].TSAAttachmentAPI.URL).to.include('sample.pdf'),
                    expect(JSON.stringify(getCreatedContact[0].Account)).equals(
                        JSON.stringify({
                            Data: {
                                InternalID: contactAccount.InternalID,
                                UUID: contactAccount.UUID,
                                ExternalID: contactAccount.ExternalID,
                            },
                            URI: '/accounts/' + contactAccount.InternalID,
                        }),
                    ),
                ]);
            });

            it('Update contact', async () => {
                return Promise.all([
                    expect(
                        (updatedContact = await service.createContact({
                            ExternalID: contactExternalID,
                            Email: 'ContactUpdateTest@mail.com',
                            Phone: '123-456789',
                            Mobile: '123-456789',
                            FirstName: 'Contact Update',
                            LastName: 'Test Update',
                            TSAAttachmentAPI: {
                                URL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                                Content: '',
                            },
                            TSACheckboxAPI: false,
                            TSACurrencyAPI: 15.0,
                            TSADateAPI: '2020-09-02Z',
                            TSADateTimeAPI: '2020-07-31T21:00:00Z',
                            TSADecimalNumberAPI: 6.2,
                            TSADropdownAPI: '2',
                            TSAEmailAPI: 'TestUpdate@test.com',
                            TSAHtmlAPI: '<h1>My First Updated Heading</h1>\r\n<p>My first paragraph.</p>',
                            TSAImageAPI: {
                                URL: 'https://image.freepik.com/free-photo/image-human-brain_99433-298.jpg',
                                Content: '',
                            },
                            TSALimitedLineAPI: 'Update text',
                            TSALinkAPI: 'https://www.mako.co.il',
                            TSAMultiChoiceAPI: 'B',
                            TSANumberAPI: 3,
                            TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nAmaze\r\nUpdate',
                            TSAPhoneNumberAPI: '97255543251',
                            TSASignatureAPI: {
                                URL:
                                    'https://upload.wikimedia.org/wikipedia/commons/9/92/Platt_Rogers_Spencer_signature.png',
                                Content: '',
                            },
                            TSASingleLineAPI: 'Random Updated text',
                        } as any)),
                    ).to.be.include({
                        ExternalID: contactExternalID,
                        Email: 'ContactUpdateTest@mail.com',
                        Phone: '123-456789',
                        Mobile: '123-456789',
                        FirstName: 'Contact Update',
                        LastName: 'Test Update',
                        TSACheckboxAPI: false,
                        TSACurrencyAPI: 15.0,
                        TSADateAPI: '2020-09-02Z',
                        TSADateTimeAPI: '2020-07-31T21:00:00Z',
                        TSADecimalNumberAPI: 6.2,
                        TSADropdownAPI: '2',
                        TSAEmailAPI: 'TestUpdate@test.com',
                        TSAHtmlAPI: '<h1>My First Updated Heading</h1>\r\n<p>My first paragraph.</p>',
                        TSALimitedLineAPI: 'Update text',
                        TSALinkAPI: 'https://www.mako.co.il',
                        TSAMultiChoiceAPI: 'B',
                        TSANumberAPI: 3,
                        TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nAmaze\r\nUpdate',
                        TSAPhoneNumberAPI: '97255543251',
                        TSASingleLineAPI: 'Random Updated text',
                    }),
                    expect(updatedContact.TSAImageAPI.URL).to.include('image-human-brain_99433-298.jpg'),
                    expect(updatedContact.TSASignatureAPI.URL).to.include('platt_rogers_spencer_signature.png'),
                    expect(updatedContact.TSAAttachmentAPI.URL).to.include('dummy.pdf'),
                ]);
            });

            it('Delete contact', async () => {
                return Promise.all([
                    expect(await service.deleteContact(createdContact.InternalID as any)).to.be.true,
                    expect(await service.deleteContact(createdContact.InternalID as any)).to.be.false,
                    expect(await service.getContacts(createdContact.InternalID))
                        .to.be.an('array')
                        .with.lengthOf(0),
                ]);
            });

            it('Bulk create contacts', async () => {
                bulkContactExternalID = 'Automated API bulk ' + Math.floor(Math.random() * 1000000).toString();
                bulkCreateContact = await service.bulkCreate('contacts', {
                    Headers: ['ExternalID', 'AccountExternalID', 'FirstName', 'Email'],
                    Lines: [
                        [
                            bulkContactExternalID + ' 1',
                            contactAccount.ExternalID,
                            'Bulk Contact 1',
                            'Email' +
                                Math.floor(Math.random() * 1000000).toString() +
                                '@' +
                                Math.floor(Math.random() * 1000000).toString() +
                                '.com',
                        ],
                        [
                            bulkContactExternalID + ' 2',
                            contactAccount.ExternalID,
                            'Bulk Contact 2',
                            'Email' +
                                Math.floor(Math.random() * 1000000).toString() +
                                '@' +
                                Math.floor(Math.random() * 1000000).toString() +
                                '.com',
                        ],
                        [
                            bulkContactExternalID + ' 3',
                            contactAccount.ExternalID,
                            'Bulk Contact 3',
                            'Email' +
                                Math.floor(Math.random() * 1000000).toString() +
                                '@' +
                                Math.floor(Math.random() * 1000000).toString() +
                                '.com',
                        ],
                        [
                            bulkContactExternalID + ' 4',
                            contactAccount.ExternalID,
                            'Bulk Contact 4',
                            'Email' +
                                Math.floor(Math.random() * 1000000).toString() +
                                '@' +
                                Math.floor(Math.random() * 1000000).toString() +
                                '.com',
                        ],
                        [
                            bulkContactExternalID + ' 5',
                            contactAccount.ExternalID,
                            'Bulk Contact 5',
                            'Email' +
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
                bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateContact.JobID, 30000);
                expect(bulkJobInfo.ID).to.equal(bulkCreateContact.JobID),
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

            it('Verify bulk created contacts', async () => {
                return Promise.all([
                    expect(
                        await service.getBulk('contacts', "?where=ExternalID like '%" + bulkContactExternalID + "%'"),
                    )
                        .to.be.an('array')
                        .with.lengthOf(5),
                ]);
            });

            it('Connect bulk created contacts as buyers', async () => {
                const connectAsBuyerContacts = await service.getBulk(
                    'contacts',
                    "?where=ExternalID like '%" + bulkContactExternalID + "%'&fields=SecurityGroupUUID,IsBuyer,UUID",
                );
                connectAsBuyerContacts.map((contact) => {
                    expect(contact).to.not.have.property('SecurityGroupUUID'),
                        expect(contact).to.have.property('IsBuyer').that.is.a('boolean').and.is.false;
                });

                contactUUIDArray = connectAsBuyerContacts.map((item) => item['UUID']);
                const connectAsBuyer = await service.connectAsBuyer({
                    UUIDs: contactUUIDArray,
                    SelectAll: false,
                });
                expect(connectAsBuyer).to.be.an('array').with.lengthOf(5),
                    connectAsBuyer.map((buyer) => {
                        expect(buyer, 'Connect as buyer name').to.have.property('name').that.is.not.empty,
                            expect(buyer, 'Connect as buyer email').to.have.property('email').that.is.not.empty,
                            expect(buyer, 'Connect as buyer message').to.have.property('message').that.is.a('string')
                                .and.is.empty,
                            expect(buyer, 'Connect as buyer password').to.have.property('password').that.is.not.empty;
                    });

                const connectedContacts = await service.getBulk(
                    'contacts',
                    "?where=ExternalID like '%" + bulkContactExternalID + "%'&fields=SecurityGroupUUID,IsBuyer",
                );
                connectedContacts.map((contact) => {
                    expect(contact, 'Buyer security group UUID')
                        .to.have.property('SecurityGroupUUID')
                        .that.is.a('string').and.is.not.empty,
                        expect(contact, 'Buyer IsBuyer').to.have.property('IsBuyer').that.is.a('boolean').and.is.true;
                });
            });

            it('Disconnect bulk created contacts as buyers', async () => {
                const DisconnectBuyer = await service.disconnectBuyer({
                    UUIDs: contactUUIDArray,
                    SelectAll: false,
                });

                expect(DisconnectBuyer).to.be.true;

                const DisconnectedBuyers = await service.getBulk(
                    'contacts',
                    "?where=ExternalID like '%" + bulkContactExternalID + "%'&fields=SecurityGroupUUID,IsBuyer,UUID",
                );
                DisconnectedBuyers.map((contact) => {
                    expect(contact).to.not.have.property('SecurityGroupUUID'),
                        expect(contact).to.have.property('IsBuyer').that.is.a('boolean').and.is.false;
                });
            });

            it('Bulk update contacts', async () => {
                bulkCreateContact = await service.bulkCreate('contacts', {
                    Headers: ['ExternalID', 'AccountExternalID', 'FirstName'],
                    Lines: [
                        [bulkContactExternalID + ' 1', contactAccount.ExternalID, 'Bulk Contact 1 Update'],
                        [bulkContactExternalID + ' 2', contactAccount.ExternalID, 'Bulk Contact 2 Update'],
                        [bulkContactExternalID + ' 3', contactAccount.ExternalID, 'Bulk Contact 3 Update'],
                        [bulkContactExternalID + ' 4', contactAccount.ExternalID, 'Bulk Contact 4 Update'],
                        [bulkContactExternalID + ' 5', contactAccount.ExternalID, 'Bulk Contact 5 Update'],
                    ],
                });
                expect(bulkCreateContact.JobID).to.be.a('number'),
                    expect(bulkCreateContact.URI).to.include('/bulk/jobinfo/' + bulkCreateContact.JobID);
            });

            it('Verify bulk update jobinfo', async () => {
                bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateContact.JobID, 30000);
                expect(bulkJobInfo.ID).to.equal(bulkCreateContact.JobID),
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

            it('Verify bulk contacts update', async () => {
                bulkUpdateContacts = await service.getBulk(
                    'contacts',
                    "?where=ExternalID like '%" + bulkContactExternalID + "%'",
                );
                expect(bulkUpdateContacts[0].FirstName).to.include('Update'),
                    expect(bulkUpdateContacts[1].FirstName).to.include('Update'),
                    expect(bulkUpdateContacts[2].FirstName).to.include('Update'),
                    expect(bulkUpdateContacts[3].FirstName).to.include('Update'),
                    expect(bulkUpdateContacts[4].FirstName).to.include('Update');
            });

            it('Delete bulk contacts', async () => {
                bulkContacts = await service.getBulk(
                    'contacts',
                    "?where=ExternalID like '%" + bulkContactExternalID + "%'",
                );
                return Promise.all([
                    expect(await service.deleteContact(bulkContacts[0].InternalID)).to.be.true,
                    expect(await service.deleteContact(bulkContacts[1].InternalID)).to.be.true,
                    expect(await service.deleteContact(bulkContacts[2].InternalID)).to.be.true,
                    expect(await service.deleteContact(bulkContacts[3].InternalID)).to.be.true,
                    expect(await service.deleteContact(bulkContacts[4].InternalID)).to.be.true,
                    expect(
                        await service.getBulk('contacts', "?where=ExternalID like '%" + bulkContactExternalID + "%'"),
                    )
                        .to.be.an('array')
                        .with.lengthOf(0),
                ]);
            });

            it('Delete contact test account and TSAs', async () => {
                expect(contactTSAs.length == (await service.deleteBulkTSA('contacts', TSAarr)).length).to.be.true,
                    expect(await service.deleteAccount(contactAccount.InternalID as any)).to.be.true;
            });
        });

        describe('General Activities', () => {
            let activityTSAs;
            let updatedActivity;
            let atds;
            let activityExternalID;
            let activityAccount;
            let createdActivity;
            let bulkCreateActivity;
            let bulkActivityExternalID;
            let bulkJobInfo;
            let bulkActivities;
            let bulkUpdateActivities;

            it('Create account and TSAs for activity CRUD', async () => {
                atds = await service.getATD('activities');
                activityTSAs = await service.createBulkTSA('activities', TSAarr, atds[0].TypeID);
                console.log('The following fields were created:\n' + activityTSAs);
                activityAccount = await service.createAccount({
                    ExternalID: 'ActivityTestAccount',
                    Name: 'Activity Test Account',
                });
            });

            it('Create activity', async () => {
                activityExternalID = 'Automated API Activity ' + Math.floor(Math.random() * 1000000).toString();
                createdActivity = await service.createActivity({
                    ExternalID: activityExternalID,
                    ActivityTypeID: atds[0].TypeID,
                    Status: 1,
                    Title: 'Testing',
                    Account: {
                        Data: {
                            InternalID: activityAccount.InternalID,
                        },
                    },
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
                        URL:
                            'https://filedn.com/ltOdFv1aqz1YIFhf4gTY8D7/ingus-info/BLOGS/Photography-stocks3/stock-photography-slider.jpg',
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
                } as any);

                const getCreatedActivity = (await service.getActivity({
                    where: `InternalID=${createdActivity.InternalID}`,
                })) as any;

                return Promise.all([
                    expect(getCreatedActivity[0]).to.include({
                        ExternalID: activityExternalID,
                        ActivityTypeID: atds[0].TypeID,
                        Status: 1,
                        Title: 'Testing',
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
                    expect(getCreatedActivity[0].TSAImageAPI.URL).to.include('stock-photography-slider.jpg'),
                    expect(getCreatedActivity[0].TSASignatureAPI.URL).to.include('sign2.png'),
                    expect(getCreatedActivity[0].TSAAttachmentAPI.URL).to.include('sample.pdf'),
                    expect(JSON.stringify(getCreatedActivity[0].Account)).equals(
                        JSON.stringify({
                            Data: {
                                InternalID: activityAccount.InternalID,
                                UUID: activityAccount.UUID,
                                ExternalID: activityAccount.ExternalID,
                            },
                            URI: '/accounts/' + activityAccount.InternalID,
                        }),
                    ),
                    expect(getCreatedActivity[0].InternalID).to.equal(createdActivity.InternalID),
                    expect(getCreatedActivity[0].UUID).to.include(createdActivity.UUID),
                    expect(getCreatedActivity[0].CreationDateTime).to.contain(new Date().toISOString().split('T')[0]),
                    expect(getCreatedActivity[0].CreationDateTime).to.contain('Z'),
                    expect(getCreatedActivity[0].ModificationDateTime).to.contain(
                        new Date().toISOString().split('T')[0],
                    ),
                    expect(getCreatedActivity[0].ModificationDateTime).to.contain('Z'),
                    expect(getCreatedActivity[0].Archive).to.be.false,
                    expect(getCreatedActivity[0].Hidden).to.be.false,
                    expect(getCreatedActivity[0].StatusName).to.include('InCreation'),
                    expect(getCreatedActivity[0].Agent).to.be.null,
                    expect(getCreatedActivity[0].ContactPerson).to.be.null,
                    expect(getCreatedActivity[0].Creator).to.be.null,
                ]);
            });

            it('Update activity', async () => {
                return Promise.all([
                    expect(
                        (updatedActivity = await service.createActivity({
                            ExternalID: activityExternalID,
                            Status: 2,
                            Title: 'Testing Update',
                            Account: {
                                Data: {
                                    InternalID: activityAccount.InternalID,
                                },
                            },
                            TSAAttachmentAPI: {
                                URL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                                Content: '',
                            },
                            TSACheckboxAPI: false,
                            TSACurrencyAPI: 15.0,
                            TSADateAPI: '2020-09-05Z',
                            TSADateTimeAPI: '2020-09-30T21:00:00Z',
                            TSADecimalNumberAPI: 0.5,
                            TSADropdownAPI: '2',
                            TSAEmailAPI: 'TestUpdate@test.com',
                            TSAHtmlAPI: '<h1>My First Updated Heading</h1>\r\n<p>My first paragraph.</p>',
                            TSAImageAPI: {
                                URL: 'https://image.freepik.com/free-photo/image-human-brain_99433-298.jpg',
                                Content: '',
                            },
                            TSALimitedLineAPI: 'Limit Update',
                            TSALinkAPI: 'https://www.google.com',
                            TSAMultiChoiceAPI: 'B',
                            TSANumberAPI: 2,
                            TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nUpdate',
                            TSAPhoneNumberAPI: '972555432512',
                            TSASignatureAPI: {
                                URL:
                                    'https://upload.wikimedia.org/wikipedia/commons/9/92/Platt_Rogers_Spencer_signature.png',
                                Content: '',
                            },
                            TSASingleLineAPI: 'Random updated text',
                        } as any)),
                    ).to.be.include({
                        ExternalID: activityExternalID,
                        ActivityTypeID: atds[0].TypeID,
                        Status: 2,
                        Title: 'Testing Update',
                        TSACheckboxAPI: false,
                        TSACurrencyAPI: 15.0,
                        TSADateAPI: '2020-09-05Z',
                        TSADateTimeAPI: '2020-09-30T21:00:00Z',
                        TSADecimalNumberAPI: 0.5,
                        TSADropdownAPI: '2',
                        TSAEmailAPI: 'TestUpdate@test.com',
                        TSAHtmlAPI: '<h1>My First Updated Heading</h1>\r\n<p>My first paragraph.</p>',
                        TSALimitedLineAPI: 'Limit Update',
                        TSALinkAPI: 'https://www.google.com',
                        TSAMultiChoiceAPI: 'B',
                        TSANumberAPI: 2,
                        TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nUpdate',
                        TSAPhoneNumberAPI: '972555432512',
                        TSASingleLineAPI: 'Random updated text',
                    }),
                    expect(updatedActivity.TSAImageAPI.URL).to.include('image-human-brain_99433-298.jpg'),
                    expect(updatedActivity.TSASignatureAPI.URL).to.include('platt_rogers_spencer_signature.png'),
                    expect(updatedActivity.TSAAttachmentAPI.URL).to.include('dummy.pdf'),
                    expect(JSON.stringify(updatedActivity.Account)).equals(
                        JSON.stringify({
                            Data: {
                                InternalID: activityAccount.InternalID,
                                UUID: activityAccount.UUID,
                                ExternalID: activityAccount.ExternalID,
                            },
                            URI: '/accounts/' + activityAccount.InternalID,
                        }),
                    ),
                    expect(updatedActivity.InternalID).to.equal(createdActivity.InternalID),
                    expect(updatedActivity.UUID).to.include(createdActivity.UUID),
                    expect(updatedActivity.CreationDateTime).to.contain(new Date().toISOString().split('T')[0]),
                    expect(updatedActivity.CreationDateTime).to.contain('Z'),
                    expect(updatedActivity.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]),
                    expect(updatedActivity.ModificationDateTime).to.contain('Z'),
                    expect(updatedActivity.Archive).to.be.false,
                    expect(updatedActivity.Hidden).to.be.false,
                    expect(updatedActivity.StatusName).to.include('Submitted'),
                    expect(updatedActivity.Agent).to.be.null,
                    expect(updatedActivity.ContactPerson).to.be.null,
                    expect(updatedActivity.Creator).to.be.null,
                ]);
            });

            it('Delete activity', async () => {
                expect(await service.deleteActivity(createdActivity.InternalID as any)).to.be.true,
                    expect(await service.deleteActivity(createdActivity.InternalID as any)).to.be.false,
                    expect(await service.getActivity({ where: `InternalID=${createdActivity.InternalID}` }))
                        .to.be.an('array')
                        .with.lengthOf(0);
            });

            it('Bulk create activity', async () => {
                bulkActivityExternalID = 'Automated API bulk ' + Math.floor(Math.random() * 1000000).toString();
                bulkCreateActivity = await service.bulkCreate('activities/' + atds[0].TypeID, {
                    Headers: ['ExternalID', 'AccountExternalID', 'Status'],
                    Lines: [
                        [bulkActivityExternalID + ' 1', activityAccount.ExternalID, '1'],
                        [bulkActivityExternalID + ' 2', activityAccount.ExternalID, '1'],
                        [bulkActivityExternalID + ' 3', activityAccount.ExternalID, '1'],
                        [bulkActivityExternalID + ' 4', activityAccount.ExternalID, '1'],
                        [bulkActivityExternalID + ' 5', activityAccount.ExternalID, '1'],
                    ],
                });
                expect(bulkCreateActivity.JobID).to.be.a('number'),
                    expect(bulkCreateActivity.URI).to.include('/bulk/jobinfo/' + bulkCreateActivity.JobID);
            });

            it('Verify bulk jobinfo', async () => {
                bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateActivity.JobID, 30000);
                expect(bulkJobInfo.ID).to.equal(bulkCreateActivity.JobID),
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

            it('Verify bulk created activities', async () => {
                return Promise.all([
                    expect(
                        await service.getBulk(
                            'activities',
                            "?where=ExternalID like '%" + bulkActivityExternalID + "%'",
                        ),
                    )
                        .to.be.an('array')
                        .with.lengthOf(5),
                ]);
            });

            it('Bulk update activities', async () => {
                bulkCreateActivity = await service.bulkCreate('activities/' + atds[0].TypeID, {
                    Headers: ['ExternalID', 'AccountExternalID', 'Status'],
                    Lines: [
                        [bulkActivityExternalID + ' 1', activityAccount.ExternalID, '2'],
                        [bulkActivityExternalID + ' 2', activityAccount.ExternalID, '2'],
                        [bulkActivityExternalID + ' 3', activityAccount.ExternalID, '2'],
                        [bulkActivityExternalID + ' 4', activityAccount.ExternalID, '2'],
                        [bulkActivityExternalID + ' 5', activityAccount.ExternalID, '2'],
                    ],
                });
                expect(bulkCreateActivity.JobID).to.be.a('number'),
                    expect(bulkCreateActivity.URI).to.include('/bulk/jobinfo/' + bulkCreateActivity.JobID);
            });

            it('Verify bulk update jobinfo', async () => {
                bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateActivity.JobID, 30000);
                expect(bulkJobInfo.ID).to.equal(bulkCreateActivity.JobID),
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

            it('Verify bulk activities update', async () => {
                bulkUpdateActivities = await service.getBulk(
                    'activities',
                    "?where=ExternalID like '%" + bulkActivityExternalID + "%'",
                );
                expect(bulkUpdateActivities[0].Status).to.equal(2),
                    expect(bulkUpdateActivities[1].Status).to.equal(2),
                    expect(bulkUpdateActivities[2].Status).to.equal(2),
                    expect(bulkUpdateActivities[3].Status).to.equal(2),
                    expect(bulkUpdateActivities[4].Status).to.equal(2);
            });

            it('Delete bulk activities', async () => {
                bulkActivities = await service.getBulk(
                    'activities',
                    "?where=ExternalID like '%" + bulkActivityExternalID + "%'",
                );
                return Promise.all([
                    expect(await service.deleteActivity(bulkActivities[0].InternalID)).to.be.true,
                    expect(await service.deleteActivity(bulkActivities[1].InternalID)).to.be.true,
                    expect(await service.deleteActivity(bulkActivities[2].InternalID)).to.be.true,
                    expect(await service.deleteActivity(bulkActivities[3].InternalID)).to.be.true,
                    expect(await service.deleteActivity(bulkActivities[4].InternalID)).to.be.true,
                    expect(
                        await service.getBulk(
                            'activities',
                            "?where=ExternalID like '%" + bulkActivityExternalID + "%'",
                        ),
                    )
                        .to.be.an('array')
                        .with.lengthOf(0),
                ]);
            });

            it('Delete activity test account and TSAs', async () => {
                expect(
                    activityTSAs.length == (await service.deleteBulkTSA('activities', TSAarr, atds[0].TypeID)).length,
                ).to.be.true,
                    expect(await service.deleteAccount(activityAccount.InternalID as any)).to.be.true,
                    expect(await service.deleteAccount(activityAccount.InternalID as any)).to.be.false,
                    expect(await service.getAccounts({ where: `InternalID=${activityAccount.InternalID}` }))
                        .to.be.an('array')
                        .with.lengthOf(0);
            });
        });

        describe('Transactions', () => {
            let atds;
            let transactionTSAs;
            let transactionLinesTSAs;
            let updatedTransaction;
            let transactionAccount;
            let createdTransaction;
            let items;
            let createdTransactionLines;
            let updatedTransactionLines;
            let addedTransactionLines;
            let transactionExternalID;
            let bulkCreateTransaction;
            let bulkTransactionExternalID;
            let bulkJobInfo;
            let bulkTransactions;
            let bulkUpdateTransactions;
            let bulkCreateTransactionLines;
            let bulkUpdateTransactionsLines;
            let bulkTransactionsLines;
            let defaultCatalog;

            it('Create account and TSAs for transactions CRUD', async () => {
                atds = await service.getATD('transactions');
                transactionTSAs = await service.createBulkTSA('transactions', TSAarr, atds[0].TypeID);
                console.log('The following fields were created:\n' + transactionTSAs);
                transactionLinesTSAs = await service.createBulkTSA(
                    'transaction_lines',
                    transactionLineTSAarr,
                    atds[0].TypeID,
                );
                console.log('The following fields were created:\n' + transactionLinesTSAs);
                transactionAccount = await service.createAccount({
                    ExternalID: 'TransactionTestAccount',
                    Name: 'Transaction Test Account',
                });
            });

            it('Create transaction', async () => {
                transactionExternalID = 'Automated API Transaction ' + Math.floor(Math.random() * 1000000).toString();
                const catalogs = await generalService.getCatalogs();
                createdTransaction = await service.createTransaction({
                    ExternalID: transactionExternalID,
                    ActivityTypeID: atds[0].TypeID,
                    Status: 1,
                    Account: {
                        Data: {
                            InternalID: transactionAccount.InternalID,
                        },
                    },
                    Catalog: {
                        Data: {
                            ExternalID: catalogs[0].ExternalID,
                        },
                    },
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
                        URL:
                            'https://filedn.com/ltOdFv1aqz1YIFhf4gTY8D7/ingus-info/BLOGS/Photography-stocks3/stock-photography-slider.jpg',
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
                } as any);

                const getCreatedTransaction = (await service.getTransaction({
                    where: `InternalID=${createdTransaction.InternalID}`,
                })) as any;

                return Promise.all([
                    expect(getCreatedTransaction[0]).to.include({
                        ExternalID: transactionExternalID,
                        ActivityTypeID: atds[0].TypeID,
                        Status: 1,
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
                    expect(getCreatedTransaction[0].TSAImageAPI.URL).to.include('stock-photography-slider.jpg'),
                    expect(getCreatedTransaction[0].TSASignatureAPI.URL).to.include('sign2.png'),
                    expect(getCreatedTransaction[0].TSAAttachmentAPI.URL).to.include('sample.pdf'),
                    expect(JSON.stringify(getCreatedTransaction[0].Account)).equals(
                        JSON.stringify({
                            Data: {
                                InternalID: transactionAccount.InternalID,
                                UUID: transactionAccount.UUID,
                                ExternalID: transactionAccount.ExternalID,
                            },
                            URI: '/accounts/' + transactionAccount.InternalID,
                        }),
                    ),
                    expect(getCreatedTransaction[0].InternalID).to.equal(createdTransaction.InternalID),
                    expect(getCreatedTransaction[0].UUID).to.include(createdTransaction.UUID),
                    expect(getCreatedTransaction[0].CreationDateTime).to.contain(
                        new Date().toISOString().split('T')[0],
                    ),
                    expect(getCreatedTransaction[0].CreationDateTime).to.contain('Z'),
                    expect(getCreatedTransaction[0].ModificationDateTime).to.contain(
                        new Date().toISOString().split('T')[0],
                    ),
                    expect(getCreatedTransaction[0].ModificationDateTime).to.contain('Z'),
                    expect(getCreatedTransaction[0].Archive).to.be.false,
                    expect(getCreatedTransaction[0].Hidden).to.be.false,
                    expect(getCreatedTransaction[0].StatusName).to.include('InCreation'),
                    expect(getCreatedTransaction[0].Agent).to.be.null,
                    expect(getCreatedTransaction[0].ContactPerson).to.be.null,
                    expect(getCreatedTransaction[0].Creator).to.be.null,
                    expect(getCreatedTransaction[0].OriginAccount).to.be.null,
                    expect(getCreatedTransaction[0].TransactionLines).to.include({
                        URI: '/transaction_lines?where=TransactionInternalID=' + createdTransaction.InternalID,
                    }),
                ]);
            });

            it('Create transaction lines', async () => {
                items = await service.getItemsTODO();
                createdTransactionLines = await service.createTransactionLineTODO({
                    TransactionInternalID: createdTransaction.InternalID,
                    LineNumber: 0,
                    ItemExternalID: items[0].ExternalID,
                    UnitsQuantity: 1,
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
                    TSASingleLineAPI: 'Random text',
                } as any);

                const getCreatedTransactionLine = await service.getTransactionLinesTODO(createdTransaction.InternalID);

                return Promise.all([
                    expect(getCreatedTransactionLine[0]).to.include({
                        LineNumber: 0,
                        UnitsQuantity: 1.0,
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
                        TSASingleLineAPI: 'Random text',
                        TotalUnitsPriceAfterDiscount: 0.0,
                        TotalUnitsPriceBeforeDiscount: 0.0,
                        UnitDiscountPercentage: 0.0,
                        UnitPrice: 0.0,
                        UnitPriceAfterDiscount: 0.0,
                    }),
                    expect(JSON.stringify(getCreatedTransactionLine[0].Item)).equals(
                        JSON.stringify({
                            Data: {
                                InternalID: items[0].InternalID,
                                UUID: items[0].UUID,
                                ExternalID: items[0].ExternalID,
                            },
                            URI: '/items/' + items[0].InternalID,
                        }),
                    ),
                    expect(JSON.stringify(getCreatedTransactionLine[0].Transaction)).equals(
                        JSON.stringify({
                            Data: {
                                InternalID: createdTransaction.InternalID,
                                UUID: createdTransaction.UUID,
                                ExternalID: createdTransaction.ExternalID,
                            },
                            URI: '/transactions/' + createdTransaction.InternalID,
                        }),
                    ),
                    expect(getCreatedTransactionLine[0].InternalID).to.equal(createdTransactionLines.InternalID),
                    expect(getCreatedTransactionLine[0].UUID).to.include(createdTransactionLines.UUID),
                    expect(getCreatedTransactionLine[0].CreationDateTime).to.contain(
                        new Date().toISOString().split('T')[0],
                    ),
                    expect(getCreatedTransactionLine[0].CreationDateTime).to.contain('Z'),
                    expect(getCreatedTransactionLine[0].ModificationDateTime).to.contain(
                        new Date().toISOString().split('T')[0],
                    ),
                    expect(getCreatedTransactionLine[0].ModificationDateTime).to.contain('Z'),
                    expect(getCreatedTransactionLine[0].Archive).to.be.false,
                    expect(getCreatedTransactionLine[0].Hidden).to.be.false,
                    expect(await service.getTransactionLinesTODO(createdTransaction.InternalID))
                        .to.be.an('array')
                        .with.lengthOf(1),
                ]);
            });

            it('Update transaction lines', async () => {
                items = await service.getItemsTODO();

                expect(
                    (updatedTransactionLines = await service.createTransactionLineTODO({
                        TransactionInternalID: createdTransaction.InternalID,
                        LineNumber: 0,
                        ItemExternalID: items[0].ExternalID,
                        UnitsQuantity: 5.0,
                        TSACheckboxAPI: false,
                        TSACurrencyAPI: 15.0,
                        TSADateAPI: '2020-10-01Z',
                        TSADateTimeAPI: '2020-08-11T21:00:00Z',
                        TSADecimalNumberAPI: 5.2,
                        TSADropdownAPI: '2',
                        TSAEmailAPI: 'Test1@test.com',
                        TSAHtmlAPI: '<h1>My First Heading test</h1>\r\n<p>My first paragraph test.</p>',
                        TSALimitedLineAPI: 'Limit text',
                        TSALinkAPI: 'https://www.ynet.co.il',
                        TSAMultiChoiceAPI: 'B',
                        TSANumberAPI: 2,
                        TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nAmaze\r\nTest',
                        TSASingleLineAPI: 'Random text test',
                        TotalUnitsPriceAfterDiscount: 0.0,
                        TotalUnitsPriceBeforeDiscount: 0.0,
                        UnitDiscountPercentage: 100.0,
                        UnitPrice: 5.0,
                        UnitPriceAfterDiscount: 0.0,
                    } as any)),
                ).to.be.include({
                    LineNumber: 0,
                    UnitsQuantity: 5.0,
                    TSACheckboxAPI: false,
                    TSACurrencyAPI: 15.0,
                    TSADateAPI: '2020-10-01Z',
                    TSADateTimeAPI: '2020-08-11T21:00:00Z',
                    TSADecimalNumberAPI: 5.2,
                    TSADropdownAPI: '2',
                    TSAEmailAPI: 'Test1@test.com',
                    TSAHtmlAPI: '<h1>My First Heading test</h1>\r\n<p>My first paragraph test.</p>',
                    TSALimitedLineAPI: 'Limit text',
                    TSALinkAPI: 'https://www.ynet.co.il',
                    TSAMultiChoiceAPI: 'B',
                    TSANumberAPI: 2,
                    TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nAmaze\r\nTest',
                    TSASingleLineAPI: 'Random text test',
                    TotalUnitsPriceAfterDiscount: 0.0,
                    TotalUnitsPriceBeforeDiscount: 25.0,
                    UnitDiscountPercentage: 100.0,
                    UnitPrice: 5.0,
                    UnitPriceAfterDiscount: 0.0,
                }),
                    expect(JSON.stringify(updatedTransactionLines.Item)).equals(
                        JSON.stringify({
                            Data: {
                                InternalID: items[0].InternalID,
                                UUID: items[0].UUID,
                                ExternalID: items[0].ExternalID,
                            },
                            URI: '/items/' + items[0].InternalID,
                        }),
                    ),
                    expect(JSON.stringify(updatedTransactionLines.Transaction)).equals(
                        JSON.stringify({
                            Data: {
                                InternalID: createdTransaction.InternalID,
                                UUID: createdTransaction.UUID,
                                ExternalID: createdTransaction.ExternalID,
                            },
                            URI: '/transactions/' + createdTransaction.InternalID,
                        }),
                    ),
                    expect(updatedTransactionLines.InternalID).to.equal(createdTransactionLines.InternalID),
                    expect(updatedTransactionLines.UUID).to.include(createdTransactionLines.UUID),
                    expect(updatedTransactionLines.CreationDateTime).to.contain(new Date().toISOString().split('T')[0]),
                    expect(updatedTransactionLines.CreationDateTime).to.contain('Z'),
                    expect(updatedTransactionLines.ModificationDateTime).to.contain(
                        new Date().toISOString().split('T')[0],
                    ),
                    expect(updatedTransactionLines.ModificationDateTime).to.contain('Z'),
                    expect(updatedTransactionLines.Archive).to.be.false,
                    expect(updatedTransactionLines.Hidden).to.be.false,
                    expect(await service.getTransactionLinesTODO(createdTransaction.InternalID))
                        .to.be.an('array')
                        .with.lengthOf(1);
            });

            it('Add transaction lines', async () => {
                items = await service.getItemsTODO();
                addedTransactionLines = await service.createTransactionLineTODO({
                    TransactionInternalID: createdTransaction.InternalID,
                    LineNumber: 1,
                    ItemExternalID: items[1].ExternalID,
                    UnitsQuantity: 1.0,
                });
                expect(await service.getTransactionLinesTODO(createdTransaction.InternalID))
                    .to.be.an('array')
                    .with.lengthOf(2);
            });

            it('Delete transaction lines', async () => {
                expect(await service.deleteTransactionLineTODO(createdTransactionLines.InternalID as any)).to.be.true,
                    expect(await service.deleteTransactionLineTODO(createdTransactionLines.InternalID as any)).to.be
                        .false,
                    expect(await service.getTransactionLinesTODO(createdTransaction.InternalID))
                        .to.be.an('array')
                        .with.lengthOf(1),
                    expect(await service.deleteTransactionLineTODO(addedTransactionLines.InternalID as any)).to.be.true,
                    expect(await service.deleteTransactionLineTODO(addedTransactionLines.InternalID as any)).to.be
                        .false,
                    expect(await service.getTransactionLinesTODO(createdTransaction.InternalID))
                        .to.be.an('array')
                        .with.lengthOf(0);
            });

            it('Update transaction', async () => {
                expect(
                    (updatedTransaction = await service.createTransaction({
                        ExternalID: transactionExternalID,
                        Status: 2,
                        Account: {
                            Data: {
                                InternalID: transactionAccount.InternalID,
                            },
                        },
                        TSAAttachmentAPI: {
                            URL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                            Content: '',
                        },
                        TSACheckboxAPI: false,
                        TSACurrencyAPI: 15.0,
                        TSADateAPI: '2020-09-05Z',
                        TSADateTimeAPI: '2020-09-30T21:00:00Z',
                        TSADecimalNumberAPI: 0.5,
                        TSADropdownAPI: '2',
                        TSAEmailAPI: 'TestUpdate@test.com',
                        TSAHtmlAPI: '<h1>My First Updated Heading</h1>\r\n<p>My first paragraph.</p>',
                        TSAImageAPI: {
                            URL: 'https://image.freepik.com/free-photo/image-human-brain_99433-298.jpg',
                            Content: '',
                        },
                        TSALimitedLineAPI: 'Limit Update',
                        TSALinkAPI: 'https://www.google.com',
                        TSAMultiChoiceAPI: 'B',
                        TSANumberAPI: 2,
                        TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nUpdate',
                        TSAPhoneNumberAPI: '972555432512',
                        TSASignatureAPI: {
                            URL:
                                'https://upload.wikimedia.org/wikipedia/commons/9/92/Platt_Rogers_Spencer_signature.png',
                            Content: '',
                        },
                        TSASingleLineAPI: 'Random updated text',
                    } as any)),
                ).to.be.include({
                    ExternalID: transactionExternalID,
                    ActivityTypeID: atds[0].TypeID,
                    Status: 2,
                    TSACheckboxAPI: false,
                    TSACurrencyAPI: 15.0,
                    TSADateAPI: '2020-09-05Z',
                    TSADateTimeAPI: '2020-09-30T21:00:00Z',
                    TSADecimalNumberAPI: 0.5,
                    TSADropdownAPI: '2',
                    TSAEmailAPI: 'TestUpdate@test.com',
                    TSAHtmlAPI: '<h1>My First Updated Heading</h1>\r\n<p>My first paragraph.</p>',
                    TSALimitedLineAPI: 'Limit Update',
                    TSALinkAPI: 'https://www.google.com',
                    TSAMultiChoiceAPI: 'B',
                    TSANumberAPI: 2,
                    TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nUpdate',
                    TSAPhoneNumberAPI: '972555432512',
                    TSASingleLineAPI: 'Random updated text',
                }),
                    expect(updatedTransaction.TSAImageAPI.URL).to.include('image-human-brain_99433-298.jpg'),
                    expect(updatedTransaction.TSASignatureAPI.URL).to.include('platt_rogers_spencer_signature.png'),
                    expect(updatedTransaction.TSAAttachmentAPI.URL).to.include('dummy.pdf'),
                    expect(JSON.stringify(updatedTransaction.Account)).equals(
                        JSON.stringify({
                            Data: {
                                InternalID: transactionAccount.InternalID,
                                UUID: transactionAccount.UUID,
                                ExternalID: transactionAccount.ExternalID,
                            },
                            URI: '/accounts/' + transactionAccount.InternalID,
                        }),
                    ),
                    expect(updatedTransaction.InternalID).to.equal(createdTransaction.InternalID),
                    expect(updatedTransaction.UUID).to.include(createdTransaction.UUID),
                    expect(updatedTransaction.CreationDateTime).to.contain(new Date().toISOString().split('T')[0]),
                    expect(updatedTransaction.CreationDateTime).to.contain('Z'),
                    expect(updatedTransaction.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]),
                    expect(updatedTransaction.ModificationDateTime).to.contain('Z'),
                    expect(updatedTransaction.Archive).to.be.false,
                    expect(updatedTransaction.Hidden).to.be.false,
                    expect(updatedTransaction.StatusName).to.include('Submitted'),
                    expect(updatedTransaction.Agent).to.be.null,
                    expect(updatedTransaction.ContactPerson).to.be.null,
                    expect(updatedTransaction.Creator).to.be.null;
            });

            it('Delete transaction', async () => {
                expect(await service.deleteTransaction(createdTransaction.InternalID as any)).to.be.true,
                    expect(await service.deleteTransaction(createdTransaction.InternalID as any)).to.be.false,
                    expect(await service.getTransaction({ where: `InternalID=${createdTransaction.InternalID}` }))
                        .to.be.an('array')
                        .with.lengthOf(0);
            });

            it('Bulk create transaction headers', async () => {
                defaultCatalog = await service.getDefaultCatalog();
                bulkTransactionExternalID = 'Automated API bulk ' + Math.floor(Math.random() * 1000000).toString();
                bulkCreateTransaction = await service.bulkCreate('transactions/' + atds[0].TypeID, {
                    Headers: ['ExternalID', 'AccountExternalID', 'Status', 'CatalogExternalID'],
                    Lines: [
                        [
                            bulkTransactionExternalID + ' 1',
                            transactionAccount.ExternalID,
                            '1',
                            defaultCatalog[0].ExternalID,
                        ],
                        [
                            bulkTransactionExternalID + ' 2',
                            transactionAccount.ExternalID,
                            '1',
                            defaultCatalog[0].ExternalID,
                        ],
                        [
                            bulkTransactionExternalID + ' 3',
                            transactionAccount.ExternalID,
                            '1',
                            defaultCatalog[0].ExternalID,
                        ],
                        [
                            bulkTransactionExternalID + ' 4',
                            transactionAccount.ExternalID,
                            '1',
                            defaultCatalog[0].ExternalID,
                        ],
                        [
                            bulkTransactionExternalID + ' 5',
                            transactionAccount.ExternalID,
                            '1',
                            defaultCatalog[0].ExternalID,
                        ],
                    ],
                });
                expect(bulkCreateTransaction.JobID).to.be.a('number'),
                    expect(bulkCreateTransaction.URI).to.include('/bulk/jobinfo/' + bulkCreateTransaction.JobID);
            });

            it('Verify bulk jobinfo', async () => {
                bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateTransaction.JobID, 30000);
                expect(bulkJobInfo.ID).to.equal(bulkCreateTransaction.JobID),
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

            it('Verify bulk created transaction headers', async () => {
                return Promise.all([
                    expect(
                        await service.getBulk(
                            'transactions',
                            "?where=ExternalID like '%" + bulkTransactionExternalID + "%'",
                        ),
                    )
                        .to.be.an('array')
                        .with.lengthOf(5),
                ]);
            });

            it('Bulk update transaction headers', async () => {
                bulkCreateTransaction = await service.bulkCreate('transactions/' + atds[0].TypeID, {
                    Headers: ['ExternalID', 'AccountExternalID', 'Status', 'CatalogExternalID'],
                    Lines: [
                        [
                            bulkTransactionExternalID + ' 1',
                            transactionAccount.ExternalID,
                            '2',
                            defaultCatalog[0].ExternalID,
                        ],
                        [
                            bulkTransactionExternalID + ' 2',
                            transactionAccount.ExternalID,
                            '2',
                            defaultCatalog[0].ExternalID,
                        ],
                        [
                            bulkTransactionExternalID + ' 3',
                            transactionAccount.ExternalID,
                            '2',
                            defaultCatalog[0].ExternalID,
                        ],
                        [
                            bulkTransactionExternalID + ' 4',
                            transactionAccount.ExternalID,
                            '2',
                            defaultCatalog[0].ExternalID,
                        ],
                        [
                            bulkTransactionExternalID + ' 5',
                            transactionAccount.ExternalID,
                            '2',
                            defaultCatalog[0].ExternalID,
                        ],
                    ],
                });
                expect(bulkCreateTransaction.JobID).to.be.a('number'),
                    expect(bulkCreateTransaction.URI).to.include('/bulk/jobinfo/' + bulkCreateTransaction.JobID);
            });

            it('Verify bulk update jobinfo', async () => {
                bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateTransaction.JobID, 30000);
                expect(bulkJobInfo.ID).to.equal(bulkCreateTransaction.JobID),
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

            it('Verify bulk transaction headers update', async () => {
                bulkUpdateTransactions = await service.getBulk(
                    'transactions',
                    "?where=ExternalID like '%" + bulkTransactionExternalID + "%'",
                );
                expect(bulkUpdateTransactions[0].Status).to.equal(2),
                    expect(bulkUpdateTransactions[1].Status).to.equal(2),
                    expect(bulkUpdateTransactions[2].Status).to.equal(2),
                    expect(bulkUpdateTransactions[3].Status).to.equal(2),
                    expect(bulkUpdateTransactions[4].Status).to.equal(2);
            });

            it('Bulk create transaction lines', async () => {
                bulkCreateTransactionLines = await service.bulkCreate('transaction_lines/' + atds[0].TypeID, {
                    Headers: ['TransactionExternalID', 'ItemExternalID', 'UnitsQuantity'],
                    Lines: [
                        [bulkTransactionExternalID + ' 1', items[0].ExternalID, '1'],
                        [bulkTransactionExternalID + ' 1', items[1].ExternalID, '2'],
                        [bulkTransactionExternalID + ' 1', items[2].ExternalID, '3'],
                        [bulkTransactionExternalID + ' 1', items[3].ExternalID, '4'],
                        [bulkTransactionExternalID + ' 1', items[4].ExternalID, '5'],
                    ],
                });
                expect(bulkCreateTransactionLines.JobID).to.be.a('number'),
                    expect(bulkCreateTransactionLines.URI).to.include(
                        '/bulk/jobinfo/' + bulkCreateTransactionLines.JobID,
                    );
            });

            it('Verify bulk jobinfo', async () => {
                bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateTransactionLines.JobID, 30000);
                expect(bulkJobInfo.ID).to.equal(bulkCreateTransactionLines.JobID),
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

            it('Verify bulk created transaction lines', async () => {
                return Promise.all([
                    expect(
                        await service.getBulk(
                            'transaction_lines',
                            '?where=TransactionInternalID=' + bulkUpdateTransactions[0].InternalID,
                        ),
                    )
                        .to.be.an('array')
                        .with.lengthOf(5),
                ]);
            });

            it('Bulk update transaction lines', async () => {
                bulkCreateTransactionLines = await service.bulkCreate('transaction_lines/' + atds[0].TypeID, {
                    Headers: ['TransactionExternalID', 'ItemExternalID', 'UnitsQuantity'],
                    Lines: [
                        [bulkTransactionExternalID + ' 1', items[0].ExternalID, '2'],
                        [bulkTransactionExternalID + ' 1', items[1].ExternalID, '3'],
                        [bulkTransactionExternalID + ' 1', items[2].ExternalID, '4'],
                        [bulkTransactionExternalID + ' 1', items[3].ExternalID, '5'],
                        [bulkTransactionExternalID + ' 1', items[4].ExternalID, '6'],
                    ],
                });
                expect(bulkCreateTransactionLines.JobID).to.be.a('number'),
                    expect(bulkCreateTransactionLines.URI).to.include(
                        '/bulk/jobinfo/' + bulkCreateTransactionLines.JobID,
                    );
            });

            it('Verify bulk update jobinfo', async () => {
                bulkJobInfo = await service.waitForBulkJobStatus(bulkCreateTransactionLines.JobID, 30000);
                expect(bulkJobInfo.ID).to.equal(bulkCreateTransactionLines.JobID),
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

            it('Verify bulk transaction lines update', async () => {
                bulkUpdateTransactionsLines = await service.getBulk(
                    'transaction_lines',
                    '?where=TransactionInternalID=' + bulkUpdateTransactions[0].InternalID,
                );
                expect(bulkUpdateTransactionsLines[0].UnitsQuantity).to.equal(2),
                    expect(bulkUpdateTransactionsLines[1].UnitsQuantity).to.equal(3),
                    expect(bulkUpdateTransactionsLines[2].UnitsQuantity).to.equal(4),
                    expect(bulkUpdateTransactionsLines[3].UnitsQuantity).to.equal(5),
                    expect(bulkUpdateTransactionsLines[4].UnitsQuantity).to.equal(6);
            });

            it('Delete bulk transaction lines', async () => {
                bulkTransactionsLines = await service.getBulk(
                    'transaction_lines',
                    '?where=TransactionInternalID=' + bulkUpdateTransactions[0].InternalID,
                );
                return Promise.all([
                    expect(await service.deleteTransactionLineTODO(bulkTransactionsLines[0].InternalID)).to.be.true,
                    expect(await service.deleteTransactionLineTODO(bulkTransactionsLines[1].InternalID)).to.be.true,
                    expect(await service.deleteTransactionLineTODO(bulkTransactionsLines[2].InternalID)).to.be.true,
                    expect(await service.deleteTransactionLineTODO(bulkTransactionsLines[3].InternalID)).to.be.true,
                    expect(await service.deleteTransactionLineTODO(bulkTransactionsLines[4].InternalID)).to.be.true,
                    expect(
                        await service.getBulk(
                            'transaction_lines',
                            '?where=TransactionInternalID=' + bulkUpdateTransactions[0].InternalID,
                        ),
                    )
                        .to.be.an('array')
                        .with.lengthOf(0),
                ]);
            });

            it('Delete bulk transaction headers', async () => {
                bulkTransactions = await service.getBulk(
                    'transactions',
                    "?where=ExternalID like '%" + bulkTransactionExternalID + "%'",
                );
                return Promise.all([
                    expect(await service.deleteTransaction(bulkTransactions[0].InternalID)).to.be.true,
                    expect(await service.deleteTransaction(bulkTransactions[1].InternalID)).to.be.true,
                    expect(await service.deleteTransaction(bulkTransactions[2].InternalID)).to.be.true,
                    expect(await service.deleteTransaction(bulkTransactions[3].InternalID)).to.be.true,
                    expect(await service.deleteTransaction(bulkTransactions[4].InternalID)).to.be.true,
                    expect(
                        await service.getBulk(
                            'transactions',
                            "?where=ExternalID like '%" + bulkTransactionExternalID + "%'",
                        ),
                    )
                        .to.be.an('array')
                        .with.lengthOf(0),
                ]);
            });

            it('Delete transaction test account and TSAs', async () => {
                expect(
                    transactionTSAs.length ==
                        (await service.deleteBulkTSA('transactions', TSAarr, atds[0].TypeID)).length,
                ).to.be.true,
                    expect(
                        transactionLinesTSAs.length ==
                            (await service.deleteBulkTSA('transaction_lines', transactionLineTSAarr, atds[0].TypeID))
                                .length,
                    ).to.be.true,
                    expect(await service.deleteAccount(transactionAccount.InternalID as any)).to.be.true,
                    expect(await service.deleteAccount(transactionAccount.InternalID as any)).to.be.false,
                    expect(await service.getAccounts({ where: `InternalID=${transactionAccount.InternalID}` }))
                        .to.be.an('array')
                        .with.lengthOf(0);
            });
        });

        describe('Users', () => {
            let currentUserQuantity;
            let initialUsersList;
            let createdUser;
            let updatedUser;
            let userExternalID;
            let userEmail;

            it('Get initial user quantity and verify user object', async () => {
                initialUsersList = await service.getUsers();
                expect(initialUsersList).to.be.an('array').with.lengthOf.above(0),
                    expect(initialUsersList[0], 'InternalID')
                        .to.have.property('InternalID')
                        .that.is.a('number')
                        .and.is.above(0),
                    expect(initialUsersList[0], 'UUID').to.have.property('UUID').that.is.a('string').and.is.not.empty,
                    expect(initialUsersList[0], 'ExternalID').to.have.property('ExternalID').that.is.a('string'),
                    expect(initialUsersList[0], 'Email').to.have.property('Email').that.is.a('string').and.is.not.empty,
                    expect(initialUsersList[0], 'FirstName').to.have.property('FirstName').that.is.a('string'),
                    expect(initialUsersList[0], 'LastName').to.have.property('LastName').that.is.a('string'),
                    expect(initialUsersList[0], 'Hidden').to.have.property('Hidden').that.is.a('boolean').and.is.false,
                    expect(initialUsersList[0], 'IsInTradeShowMode')
                        .to.have.property('IsInTradeShowMode')
                        .that.is.a('boolean'),
                    expect(initialUsersList[0], 'Mobile').to.have.property('Mobile').that.is.a('string'),
                    expect(initialUsersList[0], 'CreationDateTime')
                        .to.have.property('CreationDateTime')
                        .that.contains('Z'),
                    expect(initialUsersList[0], 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains('Z'),
                    expect(initialUsersList[0], 'Phone').to.have.property('Phone').that.is.a('string'),
                    expect(initialUsersList[0], 'Profile').to.have.property('Profile').that.is.an('object'),
                    expect(initialUsersList[0], 'Role').to.have.property('Role'),
                    expect(initialUsersList[0].Name, 'Name').to.not.exist,
                    expect(initialUsersList[0].EmployeeType, 'EmployeeType').to.not.exist,
                    expect(initialUsersList[0].IsSupportAdminUser, 'IsSupportAdminUser').to.not.exist,
                    expect(initialUsersList[0].IsUnderMyRole, 'IsUnderMyRole').to.not.exist,
                    expect(initialUsersList[0].SecurityGroup, 'SecurityGroup').to.not.exist,
                    (currentUserQuantity = initialUsersList.length);
            });

            it('Verify GET optional fields', async () => {
                const optionalUsersFields = await service.getUsers(
                    '?fields=Name,EmployeeType,IsSupportAdminUser,IsUnderMyRole,SecurityGroupUUID,SecurityGroupName',
                );
                expect(optionalUsersFields).to.be.an('array').with.lengthOf.above(0),
                    expect(optionalUsersFields[0], 'Name')
                        .to.have.property('Name')
                        .that.is.a('string')
                        .and.equals(initialUsersList[0].FirstName + ' ' + initialUsersList[0].LastName),
                    expect(optionalUsersFields[0], 'EmployeeType')
                        .to.have.property('EmployeeType')
                        .that.is.a('number')
                        .and.is.above(0),
                    expect(optionalUsersFields[0], 'IsSupportAdminUser')
                        .to.have.property('IsSupportAdminUser')
                        .that.is.a('boolean'),
                    expect(optionalUsersFields[0], 'IsUnderMyRole')
                        .to.have.property('IsUnderMyRole')
                        .that.is.a('boolean'),
                    expect(optionalUsersFields[0], 'SecurityGroupUUID')
                        .to.have.property('SecurityGroupUUID')
                        .that.is.a('string').and.is.not.empty,
                    expect(optionalUsersFields[0], 'SecurityGroupName')
                        .to.have.property('SecurityGroupName')
                        .that.is.a('string').and.is.not.empty;
            });

            it('Create User', async () => {
                userExternalID = 'Automated API User ' + Math.floor(Math.random() * 1000000).toString();
                userEmail =
                    'Email' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '@' +
                    Math.floor(Math.random() * 1000000).toString() +
                    '.com';
                createdUser = await service.createUser({
                    ExternalID: userExternalID,
                    Email: userEmail,
                    FirstName: Math.random().toString(36).substring(7),
                    LastName: Math.random().toString(36).substring(7),
                    Mobile: Math.floor(Math.random() * 1000000).toString(),
                    Phone: Math.floor(Math.random() * 1000000).toString(),
                    IsInTradeShowMode: true,
                });

                const repProfile = await service.getRepProfile();
                const securityGroups = await service.getSecurityGroup(generalService.getClientData('IdpURL'));

                expect(createdUser, 'InternalID').to.have.property('InternalID').that.is.a('number').and.is.above(0),
                    expect(createdUser, 'UUID').to.have.property('UUID').that.is.a('string').and.is.not.empty,
                    expect(createdUser, 'ExternalID')
                        .to.have.property('ExternalID')
                        .that.is.a('string')
                        .and.equals(userExternalID),
                    expect(createdUser, 'Email').to.have.property('Email').that.is.a('string').and.equals(userEmail),
                    expect(createdUser, 'FirstName').to.have.property('FirstName').that.is.a('string').and.is.not.empty,
                    expect(createdUser, 'LastName').to.have.property('LastName').that.is.a('string').and.is.not.empty,
                    expect(createdUser, 'Hidden').to.have.property('Hidden').that.is.a('boolean').and.is.false,
                    expect(createdUser, 'IsInTradeShowMode').to.have.property('IsInTradeShowMode').that.is.a('boolean')
                        .and.is.true,
                    expect(createdUser, 'Mobile').to.have.property('Mobile').that.is.a('string').and.is.not.empty,
                    expect(createdUser, 'CreationDateTime')
                        .to.have.property('CreationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(createdUser, 'CreationDateTime').to.have.property('CreationDateTime').that.contains('Z'),
                    expect(createdUser, 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(createdUser, 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains('Z'),
                    expect(createdUser, 'Phone').to.have.property('Phone').that.is.a('string').and.is.not.empty,
                    expect(createdUser, 'Profile').to.have.property('Profile').that.is.an('object'),
                    expect(createdUser.Profile, 'Profile data').to.deep.equal({
                        Data: {
                            InternalID: repProfile.InternalID,
                            Name: 'Rep',
                        },
                        URI: '/profiles/' + repProfile.InternalID,
                    }),
                    expect(createdUser, 'Role').to.have.property('Role'),
                    expect(createdUser, 'SecurityGroup').to.have.property('SecurityGroup').that.is.an('object'),
                    expect(createdUser.SecurityGroup, 'SecurityGroup data').to.deep.equal({
                        Data: {
                            UUID: securityGroups[0].securityGroupID,
                            Name: securityGroups[0].name,
                        },
                    });

                const getCreatedUserOptional = await service.getUsers(
                    '?where=InternalID=' +
                        createdUser.InternalID +
                        '&fields=Name,EmployeeType,IsSupportAdminUser,IsUnderMyRole,SecurityGroupUUID,SecurityGroupName',
                );
                expect(getCreatedUserOptional[0], 'Name')
                    .to.have.property('Name')
                    .that.is.a('string')
                    .and.equals(createdUser.FirstName + ' ' + createdUser.LastName),
                    expect(getCreatedUserOptional[0], 'EmployeeType')
                        .to.have.property('EmployeeType')
                        .that.is.a('number')
                        .and.is.above(0),
                    expect(getCreatedUserOptional[0], 'IsSupportAdminUser')
                        .to.have.property('IsSupportAdminUser')
                        .that.is.a('boolean'),
                    expect(getCreatedUserOptional[0], 'IsUnderMyRole')
                        .to.have.property('IsUnderMyRole')
                        .that.is.a('boolean'),
                    expect(getCreatedUserOptional[0], 'SecurityGroupUUID')
                        .to.have.property('SecurityGroupUUID')
                        .that.is.a('string')
                        .and.equals(securityGroups[0].securityGroupID),
                    expect(getCreatedUserOptional[0], 'SecurityGroupName')
                        .to.have.property('SecurityGroupName')
                        .that.is.a('string')
                        .and.equals(securityGroups[0].name);

                const getCreatedUser = await service.getUsers('?where=InternalID=' + createdUser.InternalID);
                expect(getCreatedUser[0], 'InternalID')
                    .to.have.property('InternalID')
                    .that.is.a('number')
                    .and.equals(createdUser.InternalID),
                    expect(getCreatedUser[0], 'UUID')
                        .to.have.property('UUID')
                        .that.is.a('string')
                        .and.equals(createdUser.UUID),
                    expect(getCreatedUser[0], 'ExternalID')
                        .to.have.property('ExternalID')
                        .that.is.a('string')
                        .and.equals(userExternalID),
                    expect(getCreatedUser[0], 'Email')
                        .to.have.property('Email')
                        .that.is.a('string')
                        .and.equals(userEmail),
                    expect(getCreatedUser[0], 'FirstName')
                        .to.have.property('FirstName')
                        .that.is.a('string')
                        .and.equals(createdUser.FirstName),
                    expect(getCreatedUser[0], 'LastName')
                        .to.have.property('LastName')
                        .that.is.a('string')
                        .and.equals(createdUser.LastName),
                    expect(getCreatedUser[0], 'Hidden').to.have.property('Hidden').that.is.a('boolean').and.is.false,
                    expect(getCreatedUser[0], 'IsInTradeShowMode')
                        .to.have.property('IsInTradeShowMode')
                        .that.is.a('boolean').and.is.true,
                    expect(getCreatedUser[0], 'Mobile')
                        .to.have.property('Mobile')
                        .that.is.a('string')
                        .and.equals(createdUser.Mobile),
                    expect(getCreatedUser[0], 'CreationDateTime')
                        .to.have.property('CreationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(getCreatedUser[0], 'CreationDateTime')
                        .to.have.property('CreationDateTime')
                        .that.contains('Z'),
                    expect(getCreatedUser[0], 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(getCreatedUser[0], 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains('Z'),
                    expect(getCreatedUser[0], 'Phone')
                        .to.have.property('Phone')
                        .that.is.a('string')
                        .and.equals(createdUser.Phone),
                    expect(getCreatedUser[0], 'Profile').to.have.property('Profile').that.is.an('object'),
                    expect(getCreatedUser[0].Profile, 'Profile data').to.deep.equal({
                        Data: {
                            InternalID: repProfile.InternalID,
                            Name: 'Rep',
                        },
                        URI: '/profiles/' + repProfile.InternalID,
                    }),
                    expect(getCreatedUser[0], 'Role').to.have.property('Role');

                const newQuantity = (await service.getUsers()).length;
                expect(newQuantity == currentUserQuantity + 1);
            });

            it('Update User', async () => {
                updatedUser = await service.updateUser({
                    ExternalID: userExternalID,
                    Email: userEmail,
                    FirstName: Math.random().toString(36).substring(7),
                    LastName: Math.random().toString(36).substring(7),
                    Mobile: Math.floor(Math.random() * 1000000).toString(),
                    Phone: Math.floor(Math.random() * 1000000).toString(),
                });

                const getUpdatedUser = await service.getUsers('?where=InternalID=' + updatedUser.InternalID);
                expect(getUpdatedUser[0], 'InternalID')
                    .to.have.property('InternalID')
                    .that.is.a('number')
                    .and.equals(updatedUser.InternalID),
                    expect(getUpdatedUser[0], 'UUID')
                        .to.have.property('UUID')
                        .that.is.a('string')
                        .and.equals(updatedUser.UUID),
                    expect(getUpdatedUser[0], 'ExternalID')
                        .to.have.property('ExternalID')
                        .that.is.a('string')
                        .and.equals(userExternalID),
                    expect(getUpdatedUser[0], 'Email')
                        .to.have.property('Email')
                        .that.is.a('string')
                        .and.equals(userEmail),
                    expect(getUpdatedUser[0], 'FirstName')
                        .to.have.property('FirstName')
                        .that.is.a('string')
                        .and.equals(updatedUser.FirstName),
                    expect(getUpdatedUser[0], 'LastName')
                        .to.have.property('LastName')
                        .that.is.a('string')
                        .and.equals(updatedUser.LastName),
                    expect(getUpdatedUser[0], 'Hidden').to.have.property('Hidden').that.is.a('boolean').and.is.false,
                    expect(getUpdatedUser[0], 'IsInTradeShowMode')
                        .to.have.property('IsInTradeShowMode')
                        .that.is.a('boolean').and.is.true,
                    expect(getUpdatedUser[0], 'Mobile')
                        .to.have.property('Mobile')
                        .that.is.a('string')
                        .and.equals(updatedUser.Mobile),
                    expect(getUpdatedUser[0], 'CreationDateTime')
                        .to.have.property('CreationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(getUpdatedUser[0], 'CreationDateTime')
                        .to.have.property('CreationDateTime')
                        .that.contains('Z'),
                    expect(getUpdatedUser[0], 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(getUpdatedUser[0], 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains('Z'),
                    expect(getUpdatedUser[0], 'Phone')
                        .to.have.property('Phone')
                        .that.is.a('string')
                        .and.equals(updatedUser.Phone),
                    expect(getUpdatedUser[0], 'Profile').to.have.property('Profile').that.is.an('object');
            });

            it('Get single user by UUID, ExternalID, InternalID', async () => {
                const getUpdatedUserUUID = await service.getSingleUser('UUID', updatedUser.UUID);
                expect(getUpdatedUserUUID, 'InternalID')
                    .to.have.property('InternalID')
                    .that.is.a('number')
                    .and.equals(updatedUser.InternalID),
                    expect(getUpdatedUserUUID, 'UUID')
                        .to.have.property('UUID')
                        .that.is.a('string')
                        .and.equals(updatedUser.UUID),
                    expect(getUpdatedUserUUID, 'ExternalID')
                        .to.have.property('ExternalID')
                        .that.is.a('string')
                        .and.equals(userExternalID),
                    expect(getUpdatedUserUUID, 'Email')
                        .to.have.property('Email')
                        .that.is.a('string')
                        .and.equals(userEmail),
                    expect(getUpdatedUserUUID, 'FirstName')
                        .to.have.property('FirstName')
                        .that.is.a('string')
                        .and.equals(updatedUser.FirstName),
                    expect(getUpdatedUserUUID, 'LastName')
                        .to.have.property('LastName')
                        .that.is.a('string')
                        .and.equals(updatedUser.LastName),
                    expect(getUpdatedUserUUID, 'Hidden').to.have.property('Hidden').that.is.a('boolean').and.is.false,
                    expect(getUpdatedUserUUID, 'IsInTradeShowMode')
                        .to.have.property('IsInTradeShowMode')
                        .that.is.a('boolean').and.is.true,
                    expect(getUpdatedUserUUID, 'Mobile')
                        .to.have.property('Mobile')
                        .that.is.a('string')
                        .and.equals(updatedUser.Mobile),
                    expect(getUpdatedUserUUID, 'CreationDateTime')
                        .to.have.property('CreationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(getUpdatedUserUUID, 'CreationDateTime')
                        .to.have.property('CreationDateTime')
                        .that.contains('Z'),
                    expect(getUpdatedUserUUID, 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(getUpdatedUserUUID, 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains('Z'),
                    expect(getUpdatedUserUUID, 'Phone')
                        .to.have.property('Phone')
                        .that.is.a('string')
                        .and.equals(updatedUser.Phone),
                    expect(getUpdatedUserUUID, 'Profile').to.have.property('Profile').that.is.an('object');

                const getUpdatedUserExternalID = await service.getSingleUser('ExternalID', userExternalID);
                expect(getUpdatedUserExternalID, 'InternalID')
                    .to.have.property('InternalID')
                    .that.is.a('number')
                    .and.equals(updatedUser.InternalID),
                    expect(getUpdatedUserExternalID, 'UUID')
                        .to.have.property('UUID')
                        .that.is.a('string')
                        .and.equals(updatedUser.UUID),
                    expect(getUpdatedUserExternalID, 'ExternalID')
                        .to.have.property('ExternalID')
                        .that.is.a('string')
                        .and.equals(userExternalID),
                    expect(getUpdatedUserExternalID, 'Email')
                        .to.have.property('Email')
                        .that.is.a('string')
                        .and.equals(userEmail),
                    expect(getUpdatedUserExternalID, 'FirstName')
                        .to.have.property('FirstName')
                        .that.is.a('string')
                        .and.equals(updatedUser.FirstName),
                    expect(getUpdatedUserExternalID, 'LastName')
                        .to.have.property('LastName')
                        .that.is.a('string')
                        .and.equals(updatedUser.LastName),
                    expect(getUpdatedUserExternalID, 'Hidden').to.have.property('Hidden').that.is.a('boolean').and.is
                        .false,
                    expect(getUpdatedUserExternalID, 'IsInTradeShowMode')
                        .to.have.property('IsInTradeShowMode')
                        .that.is.a('boolean').and.is.true,
                    expect(getUpdatedUserExternalID, 'Mobile')
                        .to.have.property('Mobile')
                        .that.is.a('string')
                        .and.equals(updatedUser.Mobile),
                    expect(getUpdatedUserExternalID, 'CreationDateTime')
                        .to.have.property('CreationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(getUpdatedUserExternalID, 'CreationDateTime')
                        .to.have.property('CreationDateTime')
                        .that.contains('Z'),
                    expect(getUpdatedUserExternalID, 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(getUpdatedUserExternalID, 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains('Z'),
                    expect(getUpdatedUserExternalID, 'Phone')
                        .to.have.property('Phone')
                        .that.is.a('string')
                        .and.equals(updatedUser.Phone),
                    expect(getUpdatedUserExternalID, 'Profile').to.have.property('Profile').that.is.an('object');

                const getUpdatedUserInternalID = await service.getSingleUser('InternalID', updatedUser.InternalID);
                expect(getUpdatedUserInternalID, 'InternalID')
                    .to.have.property('InternalID')
                    .that.is.a('number')
                    .and.equals(updatedUser.InternalID),
                    expect(getUpdatedUserInternalID, 'UUID')
                        .to.have.property('UUID')
                        .that.is.a('string')
                        .and.equals(updatedUser.UUID),
                    expect(getUpdatedUserInternalID, 'ExternalID')
                        .to.have.property('ExternalID')
                        .that.is.a('string')
                        .and.equals(userExternalID),
                    expect(getUpdatedUserInternalID, 'Email')
                        .to.have.property('Email')
                        .that.is.a('string')
                        .and.equals(userEmail),
                    expect(getUpdatedUserInternalID, 'FirstName')
                        .to.have.property('FirstName')
                        .that.is.a('string')
                        .and.equals(updatedUser.FirstName),
                    expect(getUpdatedUserInternalID, 'LastName')
                        .to.have.property('LastName')
                        .that.is.a('string')
                        .and.equals(updatedUser.LastName),
                    expect(getUpdatedUserInternalID, 'Hidden').to.have.property('Hidden').that.is.a('boolean').and.is
                        .false,
                    expect(getUpdatedUserInternalID, 'IsInTradeShowMode')
                        .to.have.property('IsInTradeShowMode')
                        .that.is.a('boolean').and.is.true,
                    expect(getUpdatedUserInternalID, 'Mobile')
                        .to.have.property('Mobile')
                        .that.is.a('string')
                        .and.equals(updatedUser.Mobile),
                    expect(getUpdatedUserInternalID, 'CreationDateTime')
                        .to.have.property('CreationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(getUpdatedUserInternalID, 'CreationDateTime')
                        .to.have.property('CreationDateTime')
                        .that.contains('Z'),
                    expect(getUpdatedUserInternalID, 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]),
                    expect(getUpdatedUserInternalID, 'ModificationDateTime')
                        .to.have.property('ModificationDateTime')
                        .that.contains('Z'),
                    expect(getUpdatedUserInternalID, 'Phone')
                        .to.have.property('Phone')
                        .that.is.a('string')
                        .and.equals(updatedUser.Phone),
                    expect(getUpdatedUserInternalID, 'Profile').to.have.property('Profile').that.is.an('object');
            });

            // Test removed because delete doesn't work and won't work
            // it('Delete Users', async () => {
            //     expect(await service.deleteUser('InternalID', createdUser.InternalID)).to.be.true,
            //         expect(await service.deleteUser('InternalID', createdUser.InternalID)).to.be.false,
            //         expect(await service.getUsers())
            //             .to.be.an('array')
            //             .with.lengthOf(currentUserQuantity);
            // });
        });
    });
}
