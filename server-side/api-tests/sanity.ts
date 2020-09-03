import GeneralService from '../services/general.service';
import tester from '../tester';
import { SanityService } from '../services/sanity.service';
import { PapiClient } from '@pepperi-addons/papi-sdk';

// All File Storage Tests
export async function sanityTest(generalService: GeneralService) {
    const service = new SanityService(generalService.papiClient);
    const { describe, expect, it, run } = tester();

    //#region Array of TSAs

    const TSAarr = [
        {
            "FieldID": "TSAAttachmentAPI",
            "Label": "AttachmentAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 24,
                "Name": "Attachment"
            },
            "Type": "String",
            "Format": "String",
            "CreationDate": "2020-09-01T10:52:51.917",
            "ModificationDate": "2020-09-01T10:52:51.917",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {}
        },
        {
            "FieldID": "TSACheckboxAPI",
            "Label": "CheckboxAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 10,
                "Name": "Boolean"
            },
            "Type": "Boolean",
            "Format": "Boolean",
            "CreationDate": "2020-09-01T10:50:38.76",
            "ModificationDate": "2020-09-01T10:50:38.76",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {
                "CheckBoxTrueValue": "true",
                "CheckBoxFalseValue": "false"
            }
        },
        {
            "FieldID": "TSACurrencyAPI",
            "Label": "CurrencyAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 9,
                "Name": "Currency"
            },
            "Type": "Number",
            "Format": "Double",
            "CreationDate": "2020-09-01T10:50:07.74",
            "ModificationDate": "2020-09-01T10:50:07.74",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {}
        },
        {
            "FieldID": "TSADateAPI",
            "Label": "DateAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 5,
                "Name": "Date"
            },
            "Type": "String",
            "Format": "DateTime",
            "CreationDate": "2020-09-01T10:48:09.647",
            "ModificationDate": "2020-09-01T10:48:09.647",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {}
        },
        {
            "FieldID": "TSADateTimeAPI",
            "Label": "DateTimeAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 6,
                "Name": "DateAndTime"
            },
            "Type": "String",
            "Format": "DateTime",
            "CreationDate": "2020-09-01T10:48:29.937",
            "ModificationDate": "2020-09-01T10:48:29.937",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {}
        },
        {
            "FieldID": "TSADecimalNumberAPI",
            "Label": "DecimalNumberAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 8,
                "Name": "NumberReal"
            },
            "Type": "Number",
            "Format": "Double",
            "CreationDate": "2020-09-01T10:49:39.13",
            "ModificationDate": "2020-09-01T10:49:39.13",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {
                "DecimalScale": 2
            }
        },
        {
            "FieldID": "TSADropdownAPI",
            "Label": "DropdownAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 11,
                "Name": "ComboBox"
            },
            "Type": "String",
            "Format": "String",
            "CreationDate": "2020-09-01T10:51:06.103",
            "ModificationDate": "2020-09-01T10:51:06.103",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {
                "PicklistValues": [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5"
                ]
            }
        },
        {
            "FieldID": "TSAEmailAPI",
            "Label": "EmailAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 18,
                "Name": "Email"
            },
            "Type": "String",
            "Format": "String",
            "CreationDate": "2020-09-01T10:54:01.48",
            "ModificationDate": "2020-09-01T10:54:01.48",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {}
        },
        {
            "FieldID": "TSAHtmlAPI",
            "Label": "HtmlAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 56,
                "Name": "RichTextHTML"
            },
            "Type": "String",
            "Format": "String",
            "CreationDate": "2020-09-01T10:56:38.57",
            "ModificationDate": "2020-09-01T10:56:38.57",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {}
        },
        {
            "FieldID": "TSAImageAPI",
            "Label": "ImageAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 20,
                "Name": "Image"
            },
            "Type": "String",
            "Format": "String",
            "CreationDate": "2020-09-01T10:52:31.25",
            "ModificationDate": "2020-09-01T10:52:31.25",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {
                "IsImageDeviceUploadable": false,
                "ImageMegaPixels": 2.0,
                "ImageQualityPercentage": 50
            }
        },
        {
            "FieldID": "TSALimitedLineAPI",
            "Label": "LimitedLineAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 2,
                "Name": "LimitedLengthTextBox"
            },
            "Type": "String",
            "Format": "String",
            "CreationDate": "2020-09-01T10:46:17.167",
            "ModificationDate": "2020-09-01T10:46:17.167",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {
                "StringLength": 10
            }
        },
        {
            "FieldID": "TSALinkAPI",
            "Label": "LinkAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 26,
                "Name": "Link"
            },
            "Type": "String",
            "Format": "String",
            "CreationDate": "2020-09-01T10:53:46.423",
            "ModificationDate": "2020-09-01T10:53:46.423",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {
                "readOnlyDisplayValue": ""
            }
        },
        {
            "FieldID": "TSAMultiChoiceAPI",
            "Label": "MultiChoiceAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 12,
                "Name": "MultiTickBox"
            },
            "Type": null,
            "Format": "String[]",
            "CreationDate": "2020-09-01T10:51:44.98",
            "ModificationDate": "2020-09-01T10:51:44.98",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {
                "PicklistValues": [
                    "A",
                    "B",
                    "C",
                    "D"
                ]
            }
        },
        {
            "FieldID": "TSANumberAPI",
            "Label": "NumberAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 7,
                "Name": "NumberInetger"
            },
            "Type": "Integer",
            "Format": "Int64",
            "CreationDate": "2020-09-01T10:49:04.013",
            "ModificationDate": "2020-09-01T10:49:04.013",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {}
        },
        {
            "FieldID": "TSAParagraphAPI",
            "Label": "ParagraphAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 3,
                "Name": "TextArea"
            },
            "Type": "String",
            "Format": "String",
            "CreationDate": "2020-09-01T10:46:49.367",
            "ModificationDate": "2020-09-01T10:47:32.28",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {}
        },
        {
            "FieldID": "TSAPhoneNumberAPI",
            "Label": "PhoneNumberAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 44,
                "Name": "Phone"
            },
            "Type": "String",
            "Format": "String",
            "CreationDate": "2020-09-01T10:53:27.443",
            "ModificationDate": "2020-09-01T10:53:27.443",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {}
        },
        {
            "FieldID": "TSAReferenceAPI",
            "Label": "ReferenceAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 48,
                "Name": "GuidReferenceType"
            },
            "Type": "String",
            "Format": "Guid",
            "CreationDate": "2020-09-01T10:56:19.537",
            "ModificationDate": "2020-09-01T10:56:19.537",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {
                "ReferenceToResourceType": {
                    "ID": 35,
                    "Name": "accounts"
                },
                "ReferenceTo": {
                    "ExternalID": "Customer",
                    "UUID": "2d10c36b-2b4f-4d29-a767-3f39720f5a8b"
                }
            }
        },
        {
            "FieldID": "TSASignatureAPI",
            "Label": "SignatureAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 25,
                "Name": "Signature"
            },
            "Type": "String",
            "Format": "String",
            "CreationDate": "2020-09-01T10:53:08.05",
            "ModificationDate": "2020-09-01T10:53:08.05",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {}
        },
        {
            "FieldID": "TSASingleLineAPI",
            "Label": "SingleLineAPI",
            "Description": "",
            "IsUserDefinedField": true,
            "UIType": {
                "ID": 1,
                "Name": "TextBox"
            },
            "Type": "String",
            "Format": "String",
            "CreationDate": "2020-09-01T10:45:41.447",
            "ModificationDate": "2020-09-01T10:47:50.113",
            "Hidden": false,
            "CSVMappedColumnName": null,
            "UserDefinedTableSource": null,
            "CalculatedRuleEngine": null,
            "TypeSpecificFields": {}
        }
    ]

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

    describe('Accounts', () => {
        describe('Account INSERT', () => {
            it('Create account', async () => {

                await service.createBulkTSA('accounts','Customer',TSAarr)

                // const createdAccount = await service.createAccount({
                //     ExternalID: "Automated API Test 1",
                //     City: "City",
                //     Country: "US",
                //     Debts30: 30,
                //     Debts60: 60,
                //     Debts90: 90,
                //     DebtsAbove90: 100,
                //     Discount: 10,
                //     Email: "Test1@test.com",
                //     Latitude: 5,
                //     Longitude: 10,
                //     Mobile: "555-1234",
                //     Name: "Automated API Test 1",
                //     Note: "Note 1",
                //     Phone: "555-4321",
                //     Prop1: "Prop 1",
                //     Prop2: "Prop 2",
                //     Prop3: "Prop 3",
                //     Prop4: "Prop 4",
                //     Prop5: "Prop 5",
                //     State: "NY",
                //     Status: 2,
                //     Street: "Street 1",
                //     Type: "Customer",
                //     ZipCode: "12345"
                // });

                // const getCreatedAccount = await service.getAccount(`InternalID=${createdAccount.InternalID}`);

                // return Promise.all([
                //     expect(getCreatedAccount[0]).to.include({
                //         ExternalID: "Automated API Test 1",
                //         City: "City",
                //         Country: "US",
                //         Debts30: 30,
                //         Debts60: 60,
                //         Debts90: 90,
                //         DebtsAbove90: 100,
                //         Discount: 10,
                //         Email: "Test1@test.com",
                //         Latitude: 5,
                //         Longitude: 10,
                //         Mobile: "555-1234",
                //         Name: "Automated API Test 1",
                //         Note: "Note 1",
                //         Phone: "555-4321",
                //         Prop1: "Prop 1",
                //         Prop2: "Prop 2",
                //         Prop3: "Prop 3",
                //         Prop4: "Prop 4",
                //         Prop5: "Prop 5",
                //         State: "New York",
                //         Status: 2,
                //         Street: "Street 1",
                //         Type: "Customer",
                //         ZipCode: "12345"
                //     }),
                //     expect(await service.deleteAccount(createdAccount.InternalID as any))
                //         .to.include({ statusText: 'OK' }),
                //     expect(await service.getAccount(`InternalID=${createdAccount.InternalID}`))
                //         .to.be.an('array')
                //         .with.lengthOf(0)
                // ]);
            });



        });
    });

    return run();

}
