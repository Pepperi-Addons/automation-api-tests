import GeneralService, { TesterFunctions } from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';
import { ApiFieldObject } from '@pepperi-addons/papi-sdk';

export async function TransactionTests(generalService: GeneralService, tester: TesterFunctions) {
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

    describe('Transactions Test Suites', () => {
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

            const getCreatedTransaction = await service.getTransaction({
                where: `InternalID=${createdTransaction.InternalID}`,
            });

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
                expect(getCreatedTransaction[0].CreationDateTime).to.contain(new Date().toISOString().split('T')[0]),
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
            items = await service.getItems();
            createdTransactionLines = await service.createTransactionLine({
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
            });

            const getCreatedTransactionLine = await service.getTransactionLines({
                where: `TransactionInternalID=${createdTransaction.InternalID}`,
            });

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
                expect(
                    await service.getTransactionLines({
                        where: `TransactionInternalID=${createdTransaction.InternalID}`,
                    }),
                )
                    .to.be.an('array')
                    .with.lengthOf(1),
            ]);
        });

        it('Update transaction lines', async () => {
            items = await service.getItems();

            expect(
                (updatedTransactionLines = await service.createTransactionLine({
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
                })),
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
                expect(updatedTransactionLines.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]),
                expect(updatedTransactionLines.ModificationDateTime).to.contain('Z'),
                expect(updatedTransactionLines.Archive).to.be.false,
                expect(updatedTransactionLines.Hidden).to.be.false,
                expect(
                    await service.getTransactionLines({
                        where: `TransactionInternalID=${createdTransaction.InternalID}`,
                    }),
                )
                    .to.be.an('array')
                    .with.lengthOf(1);
        });

        it('Add transaction lines', async () => {
            items = await service.getItems();
            addedTransactionLines = await service.createTransactionLine({
                TransactionInternalID: createdTransaction.InternalID,
                LineNumber: 1,
                ItemExternalID: items[1].ExternalID,
                UnitsQuantity: 1.0,
            });
            expect(
                await service.getTransactionLines({
                    where: `TransactionInternalID=${createdTransaction.InternalID}`,
                }),
            )
                .to.be.an('array')
                .with.lengthOf(2);
        });

        it('Delete transaction lines', async () => {
            expect(await service.deleteTransactionLine(createdTransactionLines.InternalID)).to.be.true,
                expect(await service.deleteTransactionLine(createdTransactionLines.InternalID)).to.be.false,
                expect(
                    await service.getTransactionLines({
                        where: `TransactionInternalID=${createdTransaction.InternalID}`,
                    }),
                )
                    .to.be.an('array')
                    .with.lengthOf(1),
                expect(await service.deleteTransactionLine(addedTransactionLines.InternalID)).to.be.true,
                expect(await service.deleteTransactionLine(addedTransactionLines.InternalID)).to.be.false,
                expect(
                    await service.getTransactionLines({
                        where: `TransactionInternalID=${createdTransaction.InternalID}`,
                    }),
                )
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
                        URL: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Platt_Rogers_Spencer_signature.png',
                        Content: '',
                    },
                    TSASingleLineAPI: 'Random updated text',
                })),
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
            expect(await service.deleteTransaction(createdTransaction.InternalID)).to.be.true,
                expect(await service.deleteTransaction(createdTransaction.InternalID)).to.be.false,
                expect(await service.getTransaction({ where: `InternalID=${createdTransaction.InternalID}` }))
                    .to.be.an('array')
                    .with.lengthOf(0);
        });

        it('Bulk create transaction headers', async () => {
            defaultCatalog = await service.getCatalogs({ where: `ExternalID='Default Catalog'` });
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
                expect(bulkCreateTransactionLines.URI).to.include('/bulk/jobinfo/' + bulkCreateTransactionLines.JobID);
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
                expect(bulkCreateTransactionLines.URI).to.include('/bulk/jobinfo/' + bulkCreateTransactionLines.JobID);
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
                expect(await service.deleteTransactionLine(bulkTransactionsLines[0].InternalID)).to.be.true,
                expect(await service.deleteTransactionLine(bulkTransactionsLines[1].InternalID)).to.be.true,
                expect(await service.deleteTransactionLine(bulkTransactionsLines[2].InternalID)).to.be.true,
                expect(await service.deleteTransactionLine(bulkTransactionsLines[3].InternalID)).to.be.true,
                expect(await service.deleteTransactionLine(bulkTransactionsLines[4].InternalID)).to.be.true,
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
                transactionTSAs.length == (await service.deleteBulkTSA('transactions', TSAarr, atds[0].TypeID)).length,
            ).to.be.true,
                expect(
                    transactionLinesTSAs.length ==
                        (await service.deleteBulkTSA('transaction_lines', transactionLineTSAarr, atds[0].TypeID))
                            .length,
                ).to.be.true,
                expect(await service.deleteAccount(transactionAccount.InternalID)).to.be.true,
                expect(await service.deleteAccount(transactionAccount.InternalID)).to.be.false,
                expect(await service.getAccounts({ where: `InternalID=${transactionAccount.InternalID}` }))
                    .to.be.an('array')
                    .with.lengthOf(0);
        });
    });
}
