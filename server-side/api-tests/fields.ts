import GeneralService from '../services/general.service';
import { FieldsService } from '../services/fields.service';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

/*Create a test using UUID of other Addon
With the fetch header like in this example:
await fetch(url, {
    method:`PUT`,
    body:JSON.stringify(atd),
    headers:
        });
*/

// All Fields Tests
export async function FieldsTests(generalService: GeneralService, describe, expect, it) {
    const service = new FieldsService(generalService.papiClient);

    /*import/export ATD*/
    /*activity transactions*/

    //Prerequisites Test Data
    const transactionsTypeArr = [] as any;
    const activitiesTypeArr = [] as any;

    const transactionsArr = await generalService.getTypes('transactions');
    transactionsArr.forEach((element) => {
        transactionsTypeArr.push(element.ExternalID);
        transactionsTypeArr[element.ExternalID] = element.TypeID;
    });

    const activitiesArr = await generalService.getTypes('activities');
    activitiesArr.forEach((element) => {
        activitiesTypeArr.push(element.ExternalID);
        activitiesTypeArr[element.ExternalID] = element.TypeID;
    });

    //#region Tests
    describe('Fields Tests Suites', () => {
        //Test Data
        it(`Test Data: Transaction - Name: \xa0${transactionsTypeArr[0]}, \xa0 TypeID: \xa0${
            transactionsTypeArr[transactionsTypeArr[0]]
        }`, async () => {
            expect(transactionsTypeArr[transactionsTypeArr[0]]).to.be.a('number').that.is.above(0);
        });
        it(`Test Data: Activity \xa0\xa0 - Name: \xa0${activitiesTypeArr[0]}, \xa0 TypeID: \xa0${
            activitiesTypeArr[activitiesTypeArr[0]]
        }`, async () => {
            expect(activitiesTypeArr[activitiesTypeArr[0]]).to.be.a('number').that.is.above(0);
        });

        //#region Endpoints
        describe('Endpoints', () => {
            describe('Get', () => {
                it('Get Transaction With The Type Sales Order', async () => {
                    return expect(transactionsTypeArr).to.have.property('Sales Order');
                });

                it('Get Sales Order Fields', async () => {
                    const transactionTypes = await generalService.getTypes('transactions');
                    const salesOrderTypeID = transactionTypes[0].TypeID;
                    return expect(service.getFields('transactions', salesOrderTypeID))
                        .eventually.to.be.an('array')
                        .with.length.above(5);
                });

                it('Get An Activity TypeID', async () => {
                    return expect(activitiesTypeArr[activitiesTypeArr[0]]).to.be.a('number').and.is.above(0);
                });
            });

            describe('Upsert', () => {
                it('Upsert Fields', async () => {
                    const fieldId = `TSATest Upsert 1234`;
                    const postField = await service.upsertField(
                        'transactions',
                        {
                            FieldID: fieldId,
                            Label: '123',
                            UIType: {
                                ID: 1,
                            },
                        },
                        transactionsTypeArr[transactionsTypeArr[0]],
                    );

                    const upsertField = await service.upsertField(
                        'transactions',
                        {
                            FieldID: fieldId,
                            Label: '1234',
                            UIType: {
                                ID: 1,
                            },
                        },
                        transactionsTypeArr[transactionsTypeArr[0]],
                    );
                    return Promise.all([
                        expect(postField['InternalID']).not.to.be.undefined,
                        expect(postField['InternalID']).to.equals(upsertField['InternalID']), //Ineternal ID should be added to the new API
                        expect(postField.Label).to.not.equals(upsertField.Label),
                        //expect(postField.CreationDate).to.contain('Z'), // Should also be renamed to "CreationDateTime"
                        expect(postField.ModificationDate).to.contain(new Date().toISOString().split('T')[0]), // Should also be renamed to "ModificationDateTime"
                        //expect(postField.ModificationDate).to.contain('Z'),
                        expect(postField.CreationDate).to.equals(upsertField.CreationDate),
                        expect(postField.ModificationDate).to.not.equals(upsertField.ModificationDate),
                    ]);
                });
            });

            describe('Delete', () => {
                it('Delete Fields', async () => {
                    const fieldId = `TSATest Delete 1234`;
                    return Promise.all([
                        await expect(
                            service.upsertField(
                                'transactions',
                                {
                                    FieldID: fieldId,
                                    Label: '123',
                                    UIType: {
                                        ID: 1,
                                    },
                                },
                                transactionsTypeArr[transactionsTypeArr[0]],
                            ),
                        ).eventually.to.include({ FieldID: fieldId }),
                        //expect(service.deleteField('transactions', fieldId, transactionsTypeArr[transactionsTypeArr[0]])).eventually.to.be.true,
                        expect(
                            service.upsertField(
                                'transactions',
                                {
                                    FieldID: fieldId,
                                    Label: '123',
                                    Hidden: true,
                                    UIType: {
                                        ID: 1,
                                    },
                                },
                                transactionsTypeArr[transactionsTypeArr[0]],
                            ),
                        ).eventually.to.be.fulfilled,
                    ]);
                });
            });
        });

        describe('Scenarios', () => {
            describe('Positive', () => {
                it('CRUD Transactions Of Sales Order', async () => {
                    const fieldId = `TSATest transactions 1234`;
                    const postField = await service.upsertField(
                        'transactions',
                        {
                            FieldID: fieldId,
                            Label: '123',
                            UIType: {
                                ID: 1,
                            },
                        },
                        transactionsTypeArr[transactionsTypeArr[0]],
                    );

                    const upsertField = await service.upsertField(
                        'transactions',
                        {
                            FieldID: fieldId,
                            Label: '1234',
                            UIType: {
                                ID: 1,
                            },
                        },
                        transactionsTypeArr[transactionsTypeArr[0]],
                    );
                    return Promise.all([
                        expect(postField['InternalID']).not.to.be.undefined,
                        expect(postField['UIType'].Name).to.equals('TextBox'),
                        expect(postField['InternalID']).not.to.be.undefined,
                        expect(postField['InternalID']).to.equals(upsertField['InternalID']), //Ineternal ID should be added to the new API
                        expect(postField.Label).to.not.equals(upsertField.Label),
                        //expect(postField.CreationDate).to.contain('Z'), // Should also be renamed to "CreationDateTime"
                        expect(postField.ModificationDate).to.contain(new Date().toISOString().split('T')[0]), // Should also be renamed to "ModificationDateTime"
                        //expect(postField.ModificationDate).to.contain('Z'),
                        expect(postField.CreationDate).to.equals(upsertField.CreationDate),
                        expect(postField.ModificationDate).to.not.equals(upsertField.ModificationDate),
                        //expect(service.deleteField('transactions', fieldId, transactionsTypeArr[transactionsTypeArr[0]])).eventually.to.be.true,
                        expect(
                            service.upsertField(
                                'transactions',
                                {
                                    FieldID: fieldId,
                                    Label: '123',
                                    Hidden: true,
                                    UIType: {
                                        ID: 1,
                                    },
                                },
                                transactionsTypeArr[transactionsTypeArr[0]],
                            ),
                        ).eventually.to.be.fulfilled,
                    ]);
                });

                const resourceTypesArray: ResourceTypes[] = [
                    'accounts',
                    'activities',
                    'catalogs',
                    'items',
                    'transaction_lines',
                    'transactions',
                ];
                for (let index = 0; index < resourceTypesArray.length; index++) {
                    const resourceType = resourceTypesArray[index];
                    it(`CRUD ${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`, async () => {
                        const fieldId = `TSATest ${
                            resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
                        } 12345 (For-Positive)`;

                        if (resourceType == 'accounts' || resourceType == 'catalogs' || resourceType == 'items') {
                            const postField = await service.upsertField(resourceType, {
                                FieldID: fieldId,
                                Label: '123',
                                UIType: {
                                    ID: 1,
                                },
                            });

                            const upsertField = await service.upsertField(resourceType, {
                                FieldID: fieldId,
                                Label: '1234',
                                UIType: {
                                    ID: 1,
                                },
                            });

                            return Promise.all([
                                expect(postField['InternalID']).not.to.be.undefined,
                                expect(postField['InternalID']).to.equals(upsertField['InternalID']), //Ineternal ID should be added to the new API
                                expect(postField.Label).to.not.equals(upsertField.Label),
                                //expect(postField.CreationDate).to.contain('Z'), // Should also be renamed to "CreationDateTime"
                                expect(postField.ModificationDate).to.contain(new Date().toISOString().split('T')[0]), // Should also be renamed to "ModificationDateTime"
                                //expect(postField.ModificationDate).to.contain('Z'),
                                expect(postField.CreationDate).to.equals(upsertField.CreationDate),
                                expect(postField.ModificationDate).to.not.equals(upsertField.ModificationDate),
                                expect(service.deleteField(resourceType, fieldId)).eventually.to.be.true,
                                // expect(
                                //     service.upsertField(resourceType, {
                                //         FieldID: fieldId,
                                //         Label: '123',
                                //         Hidden: true,
                                //         UIType: {
                                //             ID: 1,
                                //         },
                                //     }),
                                // ).eventually.to.be.fulfilled,
                            ]);
                        } else {
                            const postField = await service.upsertField(
                                resourceType,
                                {
                                    FieldID: fieldId,
                                    Label: '123',
                                    UIType: {
                                        ID: 1,
                                    },
                                },
                                resourceType.startsWith('transaction')
                                    ? transactionsTypeArr[transactionsTypeArr[0]]
                                    : activitiesTypeArr[activitiesTypeArr[0]],
                            );

                            const upsertField = await service.upsertField(
                                resourceType,
                                {
                                    FieldID: fieldId,
                                    Label: '1234',
                                    UIType: {
                                        ID: 1,
                                    },
                                },
                                resourceType.startsWith('transaction')
                                    ? transactionsTypeArr[transactionsTypeArr[0]]
                                    : activitiesTypeArr[activitiesTypeArr[0]],
                            );

                            return Promise.all([
                                expect(postField['InternalID']).not.to.be.undefined,
                                expect(postField['InternalID']).to.equals(upsertField['InternalID']), //Ineternal ID should be added to the new API
                                expect(postField.Label).to.not.equals(upsertField.Label),
                                //expect(postField.CreationDate).to.contain('Z'), // Should also be renamed to "CreationDateTime"
                                expect(postField.ModificationDate).to.contain(new Date().toISOString().split('T')[0]), // Should also be renamed to "ModificationDateTime"
                                //expect(postField.ModificationDate).to.contain('Z'),
                                expect(postField.CreationDate).to.equals(upsertField.CreationDate),
                                expect(postField.ModificationDate).to.not.equals(upsertField.ModificationDate),
                                expect(
                                    service.deleteField(
                                        resourceType,
                                        fieldId,
                                        resourceType.startsWith('transaction')
                                            ? transactionsTypeArr[transactionsTypeArr[0]]
                                            : activitiesTypeArr[activitiesTypeArr[0]],
                                    ),
                                ).eventually.to.be.true,
                                // expect(
                                //     service.upsertField(
                                //         resourceType,
                                //         {
                                //             FieldID: fieldId,
                                //             Label: '123',
                                //             Hidden: true,
                                //             UIType: {
                                //                 ID: 1,
                                //             },
                                //         },
                                //         resourceType.startsWith('transaction')
                                //             ? transactionsTypeArr[transactionsTypeArr[0]]
                                //             : activitiesTypeArr[activitiesTypeArr[0]],
                                //     ),
                                // ).eventually.to.be.fulfilled,
                            ]);
                        }
                    });
                }
            });
            describe('Negative', () => {
                const resourceTypesArray: ResourceTypes[] = [
                    'accounts',
                    'activities',
                    'catalogs',
                    'items',
                    'transaction_lines',
                    'transactions',
                ];

                for (let index = 0; index < resourceTypesArray.length; index++) {
                    const resourceType = resourceTypesArray[index];
                    it(`Missing UITypeID or Sub TypeID ${
                        resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
                    }`, async () => {
                        const fieldId = `TSATest ${
                            resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
                        } 12345 (For-Negative)`;

                        if (resourceType == 'accounts' || resourceType == 'catalogs' || resourceType == 'items') {
                            return expect(
                                service.upsertField(resourceType, {
                                    FieldID: fieldId,
                                    Label: '123',
                                    UIType: {} as any,
                                }),
                            ).eventually.to.be.rejectedWith(
                                'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"UI Type: None is not possible for this field format"',
                            );
                        } else {
                            return Promise.all([
                                await expect(
                                    service.upsertField(resourceType, {
                                        FieldID: fieldId,
                                        Label: '123',
                                        UIType: {
                                            ID: 1,
                                        },
                                    }),
                                ).eventually.to.be.rejectedWith(
                                    'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"sub Type ID cannot be null"',
                                ),
                                expect(
                                    service.upsertField(
                                        resourceType,
                                        {
                                            FieldID: fieldId,
                                            Label: '123',
                                            UIType: {} as any,
                                        },
                                        resourceType.startsWith('transaction')
                                            ? transactionsTypeArr[transactionsTypeArr[0]]
                                            : activitiesTypeArr[activitiesTypeArr[0]],
                                    ),
                                ).eventually.to.be.rejectedWith(
                                    'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"UI Type: None is not possible for this field format"',
                                ),
                            ]);
                        }
                    });
                }
            });
        });
        describe('Known Bugs', () => {
            it('Temporary Property CRUD (DI-16194)', async () => {
                const fieldId = `TSATest Temp 1234`;
                const postField = await service.upsertField(
                    'transactions',
                    {
                        FieldID: fieldId,
                        Label: '123',
                        UIType: {
                            ID: 1,
                        },
                        CalculatedRuleEngine: {
                            Temporary: true,
                        },
                    },
                    transactionsTypeArr[transactionsTypeArr[0]],
                );

                const upsertField = await service.upsertField(
                    'transactions',
                    {
                        FieldID: fieldId,
                        Label: '1234',
                        UIType: {
                            ID: 1,
                        },
                        CalculatedRuleEngine: {
                            Temporary: false,
                        },
                    },
                    transactionsTypeArr[transactionsTypeArr[0]],
                );
                return Promise.all([
                    expect(postField['InternalID']).not.to.be.undefined,
                    expect(postField.CalculatedRuleEngine.Temporary).to.be.true,
                    expect(upsertField.CalculatedRuleEngine.Temporary).to.be.false,
                    expect(postField['InternalID']).to.equals(upsertField['InternalID']), //Ineternal ID should be added to the new API
                    expect(postField.Label).to.not.equals(upsertField.Label),
                    //expect(postField.CreationDate).to.contain('Z'), // Should also be renamed to "CreationDateTime"
                    expect(postField.ModificationDate).to.contain(new Date().toISOString().split('T')[0]), // Should also be renamed to "ModificationDateTime"
                    //expect(postField.ModificationDate).to.contain('Z'),
                    expect(postField.CreationDate).to.equals(upsertField.CreationDate),
                    expect(postField.ModificationDate).to.not.equals(upsertField.ModificationDate),
                    //expect(service.deleteField('transactions', fieldId, transactionsTypeArr[transactionsTypeArr[0]])).eventually.to.be.true,
                    expect(
                        service.upsertField(
                            'transactions',
                            {
                                FieldID: fieldId,
                                Label: '123',
                                Hidden: true,
                                UIType: {
                                    ID: 1,
                                },
                            },
                            transactionsTypeArr[transactionsTypeArr[0]],
                        ),
                    ).eventually.to.be.fulfilled,
                ]);
            });

            it('Create Transaction from undefined to valid Field (DI-17012)', async () => {
                const fieldId = `TSATest Steps 12345`;
                return Promise.all([
                    await expect(
                        service.upsertField(
                            'transactions',
                            undefined as any,
                            transactionsTypeArr[transactionsTypeArr[0]],
                        ),
                    ).eventually.to.be.rejectedWith(
                        'failed with status: 500 - Internal Server Error error: {"fault":{"faultstring":"Object reference not set to an instance of an object.',
                    ),
                    await expect(
                        service.upsertField('transactions', {} as any, transactionsTypeArr[transactionsTypeArr[0]]),
                    ).eventually.to.be.rejectedWith(
                        'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"FieldID cannot be null',
                    ),
                    await expect(
                        service.upsertField(
                            'transactions',
                            {
                                FieldID: fieldId,
                            } as any,
                            transactionsTypeArr[transactionsTypeArr[0]],
                        ),
                    ).eventually.to.be.rejectedWith(
                        'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Label cannot be null',
                    ),
                    await expect(
                        service.upsertField(
                            'transactions',
                            {
                                FieldID: fieldId,
                                Label: '1234',
                            } as any,
                            transactionsTypeArr[transactionsTypeArr[0]],
                        ),
                    ).eventually.to.be.rejectedWith(
                        'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"UIType cannot be null',
                    ),
                    await expect(
                        service.upsertField(
                            'transactions',
                            {
                                FieldID: fieldId,
                                Label: '1234',
                                UIType: {
                                    ID: 2,
                                },
                            },
                            transactionsTypeArr[transactionsTypeArr[0]],
                        ),
                    ).eventually.to.be.fulfilled,
                    //expect(service.deleteField('transactions', fieldId, transactionsTypeArr[transactionsTypeArr[0]])).eventually.to.be.true,
                    expect(
                        service.upsertField(
                            'transactions',
                            {
                                FieldID: fieldId,
                                Label: '123',
                                Hidden: true,
                                UIType: {
                                    ID: 1,
                                },
                            },
                            transactionsTypeArr[transactionsTypeArr[0]],
                        ),
                    ).eventually.to.be.fulfilled,
                ]);
            });

            it('Reject With Correct Error Message (DI-17013)', async () => {
                const fieldId = `TSATest 1234 (Negative)`;
                return Promise.all([
                    await expect(
                        service.upsertField(
                            'transactions',
                            {
                                FieldID: fieldId,
                                Label: '1234',
                                UIType: {
                                    ID: 'Throw Here' as any,
                                },
                            },
                            transactionsTypeArr[transactionsTypeArr[0]],
                        ),
                    ).eventually.to.be.rejectedWith(
                        `failed with status: 500 - Internal Server Error error: {"fault":{"faultstring":"Could not convert string to integer: Throw Here. Path 'UIType.ID', line 5, position 22.`,
                    ),
                    expect(
                        service.upsertField(
                            'transactions',
                            {
                                FieldID: fieldId,
                                Label: '1234',
                                UIType: {
                                    ID: 2,
                                },
                                CalculatedRuleEngine: {
                                    CalculatedOn: {},
                                    Temporary: 'Throw here for test',
                                },
                            },
                            transactionsTypeArr[transactionsTypeArr[0]],
                        ),
                    ).eventually.to.be.rejectedWith(
                        `failed with status: 500 - Internal Server Error error: {"fault":{"faultstring":"Could not convert string to boolean: Throw here for test. Path 'CalculatedRuleEngine.Temporary', line 9, position 38.`,
                    ),
                ]);
            });
        });
        describe('TSA DataBase Changes', () => {
            it('Created 11 Testing TSA', () => {
                return expect(
                    service.papiClient.get(
                        "/type_safe_attribute?where=Name LIKE 'TSATest%'&fields=Name&include_deleted=1",
                    ),
                )
                    .eventually.to.be.an('array')
                    .with.lengthOf(11);
            });
        });
    });
}

// bug1: mandatory fields should return correct error also in l
/* Error messages to validate
if (string.IsNullOrWhiteSpace(field.FieldID))
    ErrorMessage.MISSING_MANDATORY_FIELD, "FieldID"));

if (field.UIType == null || field.UIType.ID == null)
    ErrorMessage.MISSING_MANDATORY_FIELD, $"UIType ID of : {field.FieldID} "));

if (!field.FieldID.StartsWith("TSA"))
    ErrorMessage.INVALID_PARAMETER, $"FieldID: {field.FieldID}"));

if (field.UserDefinedTableSource != null && field.CalculatedRuleEngine != null)
    ErrorMessage.INVALID_PARAMETER, $"Duplicate advanced mode of {field.FieldID}"));

if (udt.MainKey == udt.SecondaryKey)
    ErrorMessage.POST_TSA_SAME_MAIN_KEY_SECONDARY_KEY));

if (mapDataMetaData == null)
    ErrorMessage.NOT_EXIST, $"Table ID {udt.TableID}"));

if (!field.TypeSpecificFields.ContainsKey("PicklistValues"))
    ErrorMessage.POST_TSA_VALUE_COULD_NOT_BE_NULL, $"Pick list Values of {field.FieldID}"));

if (string.IsNullOrWhiteSpace(field.UserDefinedTableSource.TableID))
    ErrorMessage.POST_TSA_VALUE_COULD_NOT_BE_NULL, $"map data external id of {field.FieldID}"));


if (!field.TypeSpecificFields.ContainsKey("PickListResourceType"))
    ErrorMessage.POST_TSA_VALUE_COULD_NOT_BE_NULL, $"Pick List Resource Type of {field.FieldID}"));

if (!field.TypeSpecificFields.ContainsKey("PickListDataView"))
    ErrorMessage.POST_TSA_VALUE_COULD_NOT_BE_NULL, $"Pick List Data View of {field.FieldID}"));

    try {
    log4net.Logger.Log.Error($"Validate Mandatory Specific Fields failed. Error messege: {ex.Message}");
    ErrorMessage.POST_TSA_INVALID_PICK_LIST_DATA_VIEW));

if (referenceToResourceType == null)
        ErrorMessage.POST_TSA_VALUE_COULD_NOT_BE_NULL, $"ReferenceToResourceType of {field.FieldID}"));

if (externalID == null)
    ErrorMessage.POST_TSA_VALUE_COULD_NOT_BE_NULL, $"Reference To ExternalID of {field.FieldID}"));

try {
    ErrorMessage.POST_TSA_INVALID_EXTERNAL_ID_OF_REFERENCE));

if (fieldTypeFactory.CalculatedField == null && apiFieldObjectField.CalculatedRuleEngine != null)
        ErrorMessage.POST_TSA_INVALID_ADVANCED_MODE, "User Defined Table")); return fieldTypeFactory;

if (!typeEntity.FieldTypes.Contains((UIControlFieldType)apiFieldObjectField.UIType.ID))
        ErrorMessage.POST_TSA_FIELD_DOES_NOT_MATCH_THIS_TYPE));

if (!supportedModes.Contains(currentAdvancedMode))
        ErrorMessage.POST_TSA_INVALID_ADVANCED_MODE_FOR_TYPE));
*/
