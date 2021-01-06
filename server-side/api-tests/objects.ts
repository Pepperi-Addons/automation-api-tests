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

    //#endregion Array of TSAs

    describe('Objects Test Suites', () => {
        describe('Accounts', () => {

            let createdTSAs;
            let accountExternalID;
            let updatedAccount;
            let createdAccount;

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
                    expect(getCreatedAccount[0].TSAAttachmentAPI.URL).to.include('sample.pdf')
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
                expect(createdTSAs.length == (await service.deleteBulkTSA('accounts', TSAarr)).length).to.be.true
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
                    )
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
                        .with.lengthOf(0)
                ]);
            });

            it('Delete contact test account and TSAs', async () => {
                expect(contactTSAs.length == (await service.deleteBulkTSA('contacts', TSAarr)).length).to.be.true
            });
        });

        describe('General Activities', () => {

            let activityTSAs;
            let updatedActivity;
            let atds;
            let activityExternalID;
            let activityAccount;
            let createdActivity;

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
                    expect(updatedActivity.Creator).to.be.null
                ]);
            });

            it('Delete activity', async () => {
                expect(await service.deleteActivity(createdActivity.InternalID as any)).to.be.true,
                    expect(await service.deleteActivity(createdActivity.InternalID as any)).to.be.false,
                    expect(await service.getActivity({ where: `InternalID=${createdActivity.InternalID}` }))
                        .to.be.an('array')
                        .with.lengthOf(0)
            });

            it('Delete activity test account and TSAs', async () => {
                expect(
                    activityTSAs.length == (await service.deleteBulkTSA('activities', TSAarr, atds[0].TypeID)).length,
                ).to.be.true,
                    expect(await service.deleteAccount(activityAccount.InternalID as any)).to.be.true,
                    expect(await service.deleteAccount(activityAccount.InternalID as any)).to.be.false,
                    expect(await service.getAccounts({ where: `InternalID=${activityAccount.InternalID}` }))
                        .to.be.an('array')
                        .with.lengthOf(0)
            });
        });*/

    });


    // describe('Transactions', () => {
    //     it('CRUD', async () => {
    //         const atds = await service.getATD('transactions');

    //         // Create TSAs for transactions test

    //         const createdTSAs = await service.createBulkTSA('transactions', TSAarr, atds[0].TypeID);
    //         console.log('The following fields were created:\n' + createdTSAs);
    //         const transactionExternalID: string = 'Automated API Transaction ' + Math.floor(Math.random() * 1000000).toString();
    //         let updatedTransaction;

    //         // Create account for transaction test

    //         const transactionAccount = await service.createAccount({
    //             ExternalID: "TransactionTestAccount",
    //             Name: "Transaction Test Account",
    //         });

    //         // Create transaction

    //         const createdActivity = await service.createTransaction({
    //             ExternalID: transactionExternalID,
    //             ActivityTypeID: atds[0].TypeID,
    //             Status: 1,
    //             Title: 'Testing',
    //             Account: {
    //                 Data: {
    //                     InternalID: transactionAccount.InternalID,
    //                 },
    //             },
    //             TSAAttachmentAPI: {
    //                 URL: 'http://www.africau.edu/images/default/sample.pdf',
    //                 Content: '',
    //             },
    //             TSACheckboxAPI: true,
    //             TSACurrencyAPI: 10.0,
    //             TSADateAPI: '2020-09-01Z',
    //             TSADateTimeAPI: '2020-08-31T21:00:00Z',
    //             TSADecimalNumberAPI: 5.5,
    //             TSADropdownAPI: '1',
    //             TSAEmailAPI: 'Test@test.com',
    //             TSAHtmlAPI: '<h1>My First Heading</h1>\r\n<p>My first paragraph.</p>',
    //             TSAImageAPI: {
    //                 URL:
    //                     'https://filedn.com/ltOdFv1aqz1YIFhf4gTY8D7/ingus-info/BLOGS/Photography-stocks3/stock-photography-slider.jpg',
    //                 Content: '',
    //             },
    //             TSALimitedLineAPI: 'Limit text',
    //             TSALinkAPI: 'https://www.ynet.co.il',
    //             TSAMultiChoiceAPI: 'A',
    //             TSANumberAPI: 5,
    //             TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nAmaze',
    //             TSAPhoneNumberAPI: '9725554325',
    //             TSASignatureAPI: {
    //                 URL: 'https://capitalstars.com/qpay/assets/images/sign2.png',
    //                 Content: '',
    //             },
    //             TSASingleLineAPI: 'Random text',
    //         } as any);

    //         const getCreatedActivity = (await service.getActivity({
    //             where: `InternalID=${createdActivity.InternalID}`,
    //         })) as any;

    //         console.log(getCreatedActivity[0]);

    //         return Promise.all([
    //             expect(getCreatedActivity[0]).to.include({
    //                 ExternalID: activityExternalID,
    //                 ActivityTypeID: atds[0].TypeID,
    //                 Status: 1,
    //                 Title: 'Testing',
    //                 TSACheckboxAPI: true,
    //                 TSACurrencyAPI: 10.0,
    //                 TSADateAPI: '2020-09-01Z',
    //                 TSADateTimeAPI: '2020-08-31T21:00:00Z',
    //                 TSADecimalNumberAPI: 5.5,
    //                 TSADropdownAPI: '1',
    //                 TSAEmailAPI: 'Test@test.com',
    //                 TSAHtmlAPI: '<h1>My First Heading</h1>\r\n<p>My first paragraph.</p>',
    //                 TSALimitedLineAPI: 'Limit text',
    //                 TSALinkAPI: 'https://www.ynet.co.il',
    //                 TSAMultiChoiceAPI: 'A',
    //                 TSANumberAPI: 5,
    //                 TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nAmaze',
    //                 TSAPhoneNumberAPI: '9725554325',
    //                 TSASingleLineAPI: 'Random text',
    //             }),
    //             expect(getCreatedActivity[0].TSAImageAPI.URL).to.include('stock-photography-slider.jpg'),
    //             expect(getCreatedActivity[0].TSASignatureAPI.URL).to.include('sign2.png'),
    //             expect(getCreatedActivity[0].TSAAttachmentAPI.URL).to.include('sample.pdf'),
    //             expect(JSON.stringify(getCreatedActivity[0].Account)).equals(JSON.stringify({
    //                 Data: {
    //                     InternalID: activityAccount.InternalID,
    //                     UUID: activityAccount.UUID,
    //                     ExternalID: activityAccount.ExternalID,
    //                 },
    //                 URI: '/accounts/' + activityAccount.InternalID
    //             })),
    //             expect(getCreatedActivity[0].InternalID).to.equal(createdActivity.InternalID),
    //             expect(getCreatedActivity[0].UUID).to.include(createdActivity.UUID),
    //             expect(getCreatedActivity[0].CreationDateTime).to.contain(new Date().toISOString().split('T')[0]),
    //             expect(getCreatedActivity[0].CreationDateTime).to.contain('Z'),
    //             expect(getCreatedActivity[0].ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]),
    //             expect(getCreatedActivity[0].ModificationDateTime).to.contain('Z'),
    //             // expect(getCreatedActivity[0].Archive).to.be.false,   (waiting for DI-17121)
    //             expect(getCreatedActivity[0].Hidden).to.be.false,
    //             expect(getCreatedActivity[0].StatusName).to.include('InCreation'),
    //             expect(getCreatedActivity[0].Agent).to.be.null,
    //             expect(getCreatedActivity[0].ContactPerson).to.be.null,
    //             expect(getCreatedActivity[0].Creator).to.be.null,

    //             //Update activity

    //             expect(updatedActivity = await service.createActivity({
    //                 ExternalID: activityExternalID,
    //                 Status: 2,
    //                 Title: 'Testing Update',
    //                 Account: {
    //                     Data: {
    //                         InternalID: activityAccount.InternalID,
    //                     },
    //                 },
    //                 TSAAttachmentAPI: {
    //                     URL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    //                     Content: '',
    //                 },
    //                 TSACheckboxAPI: false,
    //                 TSACurrencyAPI: 15.0,
    //                 TSADateAPI: '2020-09-05Z',
    //                 TSADateTimeAPI: '2020-09-30T21:00:00Z',
    //                 TSADecimalNumberAPI: 0.5,
    //                 TSADropdownAPI: '2',
    //                 TSAEmailAPI: 'TestUpdate@test.com',
    //                 TSAHtmlAPI: '<h1>My First Updated Heading</h1>\r\n<p>My first paragraph.</p>',
    //                 TSAImageAPI: {
    //                     URL:
    //                         'https://image.freepik.com/free-photo/image-human-brain_99433-298.jpg',
    //                     Content: '',
    //                 },
    //                 TSALimitedLineAPI: 'Limit Update',
    //                 TSALinkAPI: 'https://www.google.com',
    //                 TSAMultiChoiceAPI: 'B',
    //                 TSANumberAPI: 2,
    //                 TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nUpdate',
    //                 TSAPhoneNumberAPI: '972555432512',
    //                 TSASignatureAPI: {
    //                     URL: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Platt_Rogers_Spencer_signature.png',
    //                     Content: '',
    //                 },
    //                 TSASingleLineAPI: 'Random updated text'
    //             } as any))
    //                 .to.be.include({
    //                     ExternalID: activityExternalID,
    //                     ActivityTypeID: atds[0].TypeID,
    //                     Status: 2,
    //                     Title: 'Testing Update',
    //                     TSACheckboxAPI: false,
    //                     TSACurrencyAPI: 15.0,
    //                     TSADateAPI: '2020-09-05Z',
    //                     TSADateTimeAPI: '2020-09-30T21:00:00Z',
    //                     TSADecimalNumberAPI: 0.5,
    //                     TSADropdownAPI: '2',
    //                     TSAEmailAPI: 'TestUpdate@test.com',
    //                     TSAHtmlAPI: '<h1>My First Updated Heading</h1>\r\n<p>My first paragraph.</p>',
    //                     TSALimitedLineAPI: 'Limit Update',
    //                     TSALinkAPI: 'https://www.google.com',
    //                     TSAMultiChoiceAPI: 'B',
    //                     TSANumberAPI: 2,
    //                     TSAParagraphAPI: 'Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nUpdate',
    //                     TSAPhoneNumberAPI: '972555432512',
    //                     TSASingleLineAPI: 'Random updated text'
    //                 }),
    //             expect(updatedActivity.TSAImageAPI.URL).to.include('image-human-brain_99433-298.jpg'),
    //             expect(updatedActivity.TSASignatureAPI.URL).to.include('platt_rogers_spencer_signature.png'),
    //             expect(updatedActivity.TSAAttachmentAPI.URL).to.include('dummy.pdf'),
    //             expect(JSON.stringify(updatedActivity.Account)).equals(JSON.stringify({
    //                 Data: {
    //                     InternalID: activityAccount.InternalID,
    //                     UUID: activityAccount.UUID,
    //                     ExternalID: activityAccount.ExternalID,
    //                 },
    //                 URI: '/accounts/' + activityAccount.InternalID
    //             })),
    //             expect(updatedActivity.InternalID).to.equal(createdActivity.InternalID),
    //             expect(updatedActivity.UUID).to.include(createdActivity.UUID),
    //             expect(updatedActivity.CreationDateTime).to.contain(new Date().toISOString().split('T')[0]),
    //             expect(updatedActivity.CreationDateTime).to.contain('Z'),
    //             expect(updatedActivity.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]),
    //             expect(updatedActivity.ModificationDateTime).to.contain('Z'),
    //             // expect(updatedActivity.Archive).to.be.false,   (waiting for DI-17121)
    //             expect(updatedActivity.Hidden).to.be.false,
    //             expect(updatedActivity.StatusName).to.include('Submitted'),
    //             expect(updatedActivity.Agent).to.be.null,
    //             expect(updatedActivity.ContactPerson).to.be.null,
    //             expect(updatedActivity.Creator).to.be.null,

    //             // Delete activity and TSAs

    //             expect(await service.deleteActivity(createdActivity.InternalID as any)).to.be.true,
    //             expect(await service.deleteActivity(createdActivity.InternalID as any)).to.be.false,
    //             expect(await service.getActivity({ where: `InternalID=${createdActivity.InternalID}` }))
    //                 .to.be.an('array')
    //                 .with.lengthOf(0),
    //             expect(createdTSAs.length == (await service.deleteBulkTSA('activities', TSAarr, atds[0].TypeID)).length).to.be.true,
    //             expect(await service.deleteAccount(activityAccount.InternalID as any)).to.be.true,
    //             expect(await service.deleteAccount(activityAccount.InternalID as any)).to.be.false,
    //             expect(await service.getAccounts({ where: `InternalID=${activityAccount.InternalID}` }))
    //                 .to.be.an('array')
    //                 .with.lengthOf(0)
    //         ]);
    //     });
    // });
}
