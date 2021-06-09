import GeneralService, { TesterFunctions } from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';
import { ApiFieldObject } from '@pepperi-addons/papi-sdk';

export async function ContactsTests(generalService: GeneralService, tester: TesterFunctions) {
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

    describe('Contacts Test Suites', () => {
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
                expect(getCreatedContact[0].TSAImageAPI.URL).to.include('cdn'),
                expect(getCreatedContact[0].TSASignatureAPI.URL).to.include('sign2.png'),
                expect(getCreatedContact[0].TSASignatureAPI.URL).to.include('cdn'),
                expect(getCreatedContact[0].TSAAttachmentAPI.URL).to.include('sample.pdf'),
                expect(getCreatedContact[0].TSAAttachmentAPI.URL).to.include('cdn'),
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
                            URL: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Platt_Rogers_Spencer_signature.png',
                            Content: '',
                        },
                        TSASingleLineAPI: 'Random Updated text',
                    })),
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
                expect(updatedContact.TSAImageAPI.URL).to.include('cdn'),
                expect(updatedContact.TSASignatureAPI.URL).to.include('platt_rogers_spencer_signature.png'),
                expect(updatedContact.TSASignatureAPI.URL).to.include('cdn'),
                expect(updatedContact.TSAAttachmentAPI.URL).to.include('dummy.pdf'),
                expect(updatedContact.TSAAttachmentAPI.URL).to.include('cdn'),
            ]);
        });

        it('Delete contact', async () => {
            return Promise.all([
                expect(await service.deleteContact(createdContact.InternalID)).to.be.true,
                expect(await service.deleteContact(createdContact.InternalID)).to.be.false,
                expect(await service.getContacts(createdContact.InternalID))
                    .to.be.an('array')
                    .with.lengthOf(0),
            ]);
        });

        it('Check Hidden=false after update', async () => {
            return (
                Promise.all([
                    expect(
                        await service.getContactsSDK({
                            where: `InternalID=${createdContact.InternalID}`,
                            include_deleted: true,
                        }),
                    )
                        .to.be.an('array')
                        .with.lengthOf(1),
                ]),
                (updatedContact = await service.createContact({
                    ExternalID: contactExternalID,
                    Email: 'ContactUpdateTest@mail.com',
                    Phone: '123-45678900',
                    Mobile: '123-45678900',
                })),
                expect(updatedContact).to.have.property('Hidden').that.is.a('boolean').and.is.false,
                expect(await service.deleteContact(createdContact.InternalID)).to.be.true,
                expect(await service.deleteContact(createdContact.InternalID)).to.be.false,
                expect(await service.getContacts(createdContact.InternalID))
                    .to.be.an('array')
                    .with.lengthOf(0)
            );
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
                expect(await service.getBulk('contacts', "?where=ExternalID like '%" + bulkContactExternalID + "%'"))
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
                        expect(buyer, 'Connect as buyer message').to.have.property('message').that.is.a('string').and.is
                            .empty,
                        expect(buyer, 'Connect as buyer password').to.have.property('password').that.is.not.empty;
                });

            const connectedContacts = await service.getBulk(
                'contacts',
                "?where=ExternalID like '%" + bulkContactExternalID + "%'&fields=SecurityGroupUUID,IsBuyer",
            );
            connectedContacts.map((contact) => {
                expect(contact, 'Buyer security group UUID').to.have.property('SecurityGroupUUID').that.is.a('string')
                    .and.is.not.empty,
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
                expect(await service.getBulk('contacts', "?where=ExternalID like '%" + bulkContactExternalID + "%'"))
                    .to.be.an('array')
                    .with.lengthOf(0),
            ]);
        });

        it('Delete contact test account and TSAs', async () => {
            expect(contactTSAs.length == (await service.deleteBulkTSA('contacts', TSAarr)).length).to.be.true,
                expect(await service.deleteAccount(contactAccount.InternalID)).to.be.true;
        });
    });
}
