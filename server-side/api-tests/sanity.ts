import GeneralService from '../services/general.service';
import { SanityService } from '../services/sanity.service';
import { ApiFieldObject } from '@pepperi-addons/papi-sdk';

// All Sanity Tests
export async function ObjectsTests(generalService: GeneralService, describe, expect, it) {
    const service = new SanityService(generalService.papiClient);

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

    //#endregion

    //#region Tests

    //#region Endpoints
    // describe('אורן האפס', () => {
    //     describe('אורן אפס גדול', () => {
    //         it('מצא לי את כל האקוונטים צריכים להיות 100', async () => {
    //             return expect(generalService.papiClient.accounts.iter({ where: `ExternalID = '123'` }).toArray())
    //                 .eventually.to.be.an('array')
    //                 .that.have.property('0')
    //                 .that.include({ ExternalID: '1234' });
    //         });

    //         it('מצא לי את כל האקוונטים צריכים להיות 140', async () => {
    //             return expect(generalService.papiClient.accounts.iter().toArray())
    //                 .eventually.to.be.an('array')
    //                 .with.lengthOf(1204);
    //         });

    //         it('מצא לי את כל האקוונטים צריכים להיות אובייקטים', async () => {
    //             return expect(generalService.papiClient.accounts.iter().toArray())
    //                 .eventually.to.be.an('array')
    //                 .with.lengthOf(1204);
    //         });
    //     });
    // });
    describe('Objects Tests Suites', async () => {
        describe('Accounts', () => {
            it('POST/UPDATE/DELETE account', async () => {
                const createdTSAs = await service.createBulkTSA('accounts', TSAarr);
                console.log('The following fields were created:\n' + createdTSAs);
                const accountExternalID: string = 'Automated API ' + Math.floor(Math.random() * 1000000).toString();

                const createdAccount = await service.createAccount({
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

                const getCreatedAccount = (await service.getAccount(`InternalID=${createdAccount.InternalID}`)) as any;

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

                    // expect(await service.createAccount({
                    //     ExternalID: "Automated API Test 1",
                    //     City: "City update",
                    //     Country: "US",
                    //     Debts30: 35,
                    //     Debts60: 65,
                    //     Debts90: 95,
                    //     DebtsAbove90: 105,
                    //     Discount: 15,
                    //     Email: "Test2@test.com",
                    //     // Latitude: 8,
                    //     // Longitude: 12,
                    //     Mobile: "555-123456",
                    //     Name: "Automated API Test 5",
                    //     Note: "Note 5",
                    //     Phone: "555-43210",
                    //     Prop1: "Prop 11",
                    //     Prop2: "Prop 22",
                    //     Prop3: "Prop 33",
                    //     Prop4: "Prop 44",
                    //     Prop5: "Prop 55",
                    //     State: "CA",
                    //     Status: 2,
                    //     Street: "Street 5",
                    //     Type: "Customer",
                    //     ZipCode: "1234567",
                    //     // TSAAttachmentAPI: {
                    //     //     URL: "http://sandbox.pepperi.com/WrntyImages/30014280/2/1913272/sample.pdf",
                    //     //     Content: ""
                    //     // },
                    //     TSACheckboxAPI: true,
                    //     TSACurrencyAPI: 15.0,
                    //     TSADateAPI: "2020-09-05Z",
                    //     TSADateTimeAPI: "2020-08-25T22:00:00Z",
                    //     TSADecimalNumberAPI: 5.2,
                    //     TSADropdownAPI: "1",
                    //     TSAEmailAPI: "Test@test.com",
                    //     TSAHtmlAPI: "<h1>My First Heading</h1>\r\n<p>My first paragraph.</p>",
                    //     TSAImageAPI: {
                    //         URL: "https://sandbox.pepperi.com/Handlers/ResizeImage.ashx?imgPath=WrntyImages/30014280/1/1913271/download.png",
                    //         Content: ""
                    //     },
                    //     TSALimitedLineAPI: "Limit text",
                    //     TSALinkAPI: "https://www.ynet.co.il",
                    //     TSAMultiChoiceAPI: "C",
                    //     TSANumberAPI: 2,
                    //     TSAParagraphAPI: "Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nAmaze\r\nUpdated",
                    //     TSAPhoneNumberAPI: "972555432512",
                    //     TSASignatureAPI: {
                    //         URL: "https://sandbox.pepperi.com/Handlers/ResizeImage.ashx?imgPath=30014280/Attachments/e442f0a1f9dd4ab289f7c00f6ee11890.png",
                    //         Content: ""
                    //     },
                    //     TSASingleLineAPI: "Random TEXT"
                    // } as any))
                    //     .to.be.include({
                    //         ExternalID: "Automated API Test 1",
                    //         City: "City update",
                    //         Country: "US",
                    //         Debts30: 35,
                    //         Debts60: 65,
                    //         Debts90: 95,
                    //         DebtsAbove90: 105,
                    //         Discount: 15,
                    //         Email: "Test2@test.com",
                    //         // Latitude: 8,
                    //         // Longitude: 12,
                    //         Mobile: "555-123456",
                    //         Name: "Automated API Test 5",
                    //         Note: "Note 5",
                    //         Phone: "555-43210",
                    //         Prop1: "Prop 11",
                    //         Prop2: "Prop 22",
                    //         Prop3: "Prop 33",
                    //         Prop4: "Prop 44",
                    //         Prop5: "Prop 55",
                    //         State: "CA",
                    //         Status: 2,
                    //         Street: "Street 5",
                    //         Type: "Customer",
                    //         ZipCode: "1234567",
                    //         // TSAAttachmentAPI: {
                    //         //     URL: "http://sandbox.pepperi.com/WrntyImages/30014280/2/1913272/sample.pdf",
                    //         //     Content: ""
                    //         // },
                    //         TSACheckboxAPI: true,
                    //         TSACurrencyAPI: 15.0,
                    //         TSADateAPI: "2020-09-05Z",
                    //         TSADateTimeAPI: "2020-08-25T22:00:00Z",
                    //         TSADecimalNumberAPI: 5.2,
                    //         TSADropdownAPI: "1",
                    //         TSAEmailAPI: "Test@test.com",
                    //         TSAHtmlAPI: "<h1>My First Heading</h1>\r\n<p>My first paragraph.</p>",
                    //         TSAImageAPI: {
                    //             URL: "https://sandbox.pepperi.com/Handlers/ResizeImage.ashx?imgPath=WrntyImages/30014280/1/1913271/download.png",
                    //             Content: ""
                    //         },
                    //         TSALimitedLineAPI: "Limit text",
                    //         TSALinkAPI: "https://www.ynet.co.il",
                    //         TSAMultiChoiceAPI: "C",
                    //         TSANumberAPI: 2,
                    //         TSAParagraphAPI: "Paragraph Text\r\nMuch\r\nParagraph\r\nSo\r\nAmaze\r\nUpdated",
                    //         TSAPhoneNumberAPI: "972555432512",
                    //         TSASignatureAPI: {
                    //             URL: "https://sandbox.pepperi.com/Handlers/ResizeImage.ashx?imgPath=30014280/Attachments/e442f0a1f9dd4ab289f7c00f6ee11890.png",
                    //             Content: ""
                    //         },
                    //         TSASingleLineAPI: "Random TEXT"
                    //     }),
                    expect(await service.deleteAccount(createdAccount.InternalID as any)).to.be.true,
                    expect(await service.deleteAccount(createdAccount.InternalID as any)).to.be.false,
                    expect(await service.getAccount(`InternalID=${createdAccount.InternalID}`))
                        .to.be.an('array')
                        .with.lengthOf(0),
                    expect(createdTSAs.length == (await service.deleteBulkTSA('accounts', TSAarr)).length).to.be.true,
                ]);
            });
        });
    });
}
