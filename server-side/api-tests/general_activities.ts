import GeneralService, { TesterFunctions } from '../services/general.service';
import { ObjectsService } from '../services/objects.service';
import { ApiFieldObject } from '@pepperi-addons/papi-sdk';

export async function GeneralActivitiesTests(generalService: GeneralService, tester: TesterFunctions) {
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

    describe('General Activities Test Suites', () => {
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

            const getCreatedActivity = await service.getActivity({
                where: `InternalID=${createdActivity.InternalID}`,
            });

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
                expect(getCreatedActivity[0].ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]),
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
                            URL: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Platt_Rogers_Spencer_signature.png',
                            Content: '',
                        },
                        TSASingleLineAPI: 'Random updated text',
                    })),
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
            expect(await service.deleteActivity(createdActivity.InternalID)).to.be.true,
                expect(await service.deleteActivity(createdActivity.InternalID)).to.be.false,
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
                expect(await service.getBulk('activities', "?where=ExternalID like '%" + bulkActivityExternalID + "%'"))
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
                expect(await service.getBulk('activities', "?where=ExternalID like '%" + bulkActivityExternalID + "%'"))
                    .to.be.an('array')
                    .with.lengthOf(0),
            ]);
        });

        it('Delete activity test account and TSAs', async () => {
            expect(activityTSAs.length == (await service.deleteBulkTSA('activities', TSAarr, atds[0].TypeID)).length).to
                .be.true,
                expect(await service.deleteAccount(activityAccount.InternalID)).to.be.true,
                expect(await service.deleteAccount(activityAccount.InternalID)).to.be.false,
                expect(await service.getAccounts({ where: `InternalID=${activityAccount.InternalID}` }))
                    .to.be.an('array')
                    .with.lengthOf(0);
        });
    });
}
