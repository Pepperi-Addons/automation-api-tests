import GeneralService, { TesterFunctions } from '../services/general.service';
import { FieldsService } from '../services/fields.service';

declare type ResourceTypes = 'activities' | 'transactions' | 'transaction_lines' | 'catalogs' | 'accounts' | 'items';

/*Create a test using UUID of other Addon
With the fetch header like in this example:
await fetch(url, {
    method:`PUT`,
    body:JSON.stringify(atd),
    headers:
        });

        // how to fetch
        // const fileContent: string = await fetch(uriStr).then((response) => response.text());
        //         expect(fileContent).to.contain('ABCD');
        
*/

// All Fields Tests
export async function FieldsTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = new FieldsService(generalService.papiClient);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

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
        it(`Test Data: Transaction - Name: ${transactionsTypeArr[0]}, TypeID:${
            transactionsTypeArr[transactionsTypeArr[0]]
        }`, () => {
            expect(transactionsTypeArr[transactionsTypeArr[0]]).to.be.a('number').that.is.above(0);
        });
        it(`Test Data: Activity - Name: ${activitiesTypeArr[0]}, TypeID:${
            activitiesTypeArr[activitiesTypeArr[0]]
        }`, () => {
            expect(activitiesTypeArr[activitiesTypeArr[0]]).to.be.a('number').that.is.above(0);
        });

        //#region Endpoints
        describe('Endpoints', () => {
            describe('Get', () => {
                it('Get Transaction With The Type Sales Order', () => {
                    return expect(transactionsTypeArr).to.have.property('Sales Order');
                });

                it('Get Sales Order Fields', async () => {
                    const transactionTypes = await generalService.getTypes('transactions');
                    const salesOrderTypeID = transactionTypes[0].TypeID;
                    return expect(service.getFields('transactions', salesOrderTypeID))
                        .eventually.to.be.an('array')
                        .with.length.above(5);
                });

                it('Get An Activity TypeID', () => {
                    return expect(activitiesTypeArr[activitiesTypeArr[0]]).to.be.a('number').and.is.above(0);
                });
            });

            describe('Upsert', () => {
                it('Upsert Fields (DI-17371)', async () => {
                    const fieldID = `TSATest 2 Upsert 1234`;
                    const postField = await service.upsertField(
                        'transactions',
                        {
                            FieldID: fieldID,
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
                            FieldID: fieldID,
                            Label: '1234',
                            UIType: {
                                ID: 1,
                            },
                        },
                        transactionsTypeArr[transactionsTypeArr[0]],
                    );
                    return Promise.all([
                        expect(postField.InternalID).not.to.be.undefined,
                        expect(postField.InternalID).to.equals(upsertField.InternalID),
                        expect(postField.Label).to.not.equals(upsertField.Label),
                        expect(postField.CreationDateTime).to.contain('Z'),
                        expect(postField.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]),
                        expect(postField.ModificationDateTime).to.contain('Z'),
                        expect(postField.CreationDateTime).to.equals(upsertField.CreationDateTime),
                        expect(postField.ModificationDateTime).to.not.equals(upsertField.ModificationDateTime),
                    ]);
                });
            });

            describe('Delete', () => {
                it('Delete Fields', async () => {
                    const fieldID = `TSATest 2 Delete 1234`;
                    return Promise.all([
                        await expect(
                            service.upsertField(
                                'transactions',
                                {
                                    FieldID: fieldID,
                                    Label: '123',
                                    UIType: {
                                        ID: 1,
                                    },
                                },
                                transactionsTypeArr[transactionsTypeArr[0]],
                            ),
                        ).eventually.to.include({ FieldID: fieldID }),
                        //expect(service.deleteField('transactions', fieldID, transactionsTypeArr[transactionsTypeArr[0]])).eventually.to.be.true,
                        expect(
                            service.upsertField(
                                'transactions',
                                {
                                    FieldID: fieldID,
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
                it('CRUD Transactions Of Sales Order (DI-17083)', async () => {
                    const fieldID = `TSA Creation Test ${
                        Math.floor(Math.random() * 10000).toString() + Math.random().toString(36).substring(10)
                    }`;
                    const postField = await service.upsertField(
                        'transactions',
                        {
                            FieldID: fieldID,
                            Label: '123',
                            Description: `Description of ${fieldID}`,
                            UIType: {
                                ID: 1,
                            },
                        },
                        transactionsTypeArr[transactionsTypeArr[0]],
                    );

                    const upsertField = await service.upsertField(
                        'transactions',
                        {
                            FieldID: fieldID,
                            Label: '1234',
                            UIType: {
                                ID: 1,
                            },
                        },
                        transactionsTypeArr[transactionsTypeArr[0]],
                    );
                    return Promise.all([
                        expect(postField.Description).to.equals(`Description of ${fieldID}`),
                        expect(upsertField.Description).to.equals(`Description of ${fieldID}`),
                        expect(postField.InternalID).not.to.be.undefined,
                        expect(postField['UIType'].Name).to.equals('TextBox'),
                        expect(postField.InternalID).not.to.be.undefined,
                        expect(postField.InternalID).to.equals(upsertField.InternalID),
                        expect(postField.Label).to.not.equals(upsertField.Label),
                        expect(postField.CreationDateTime).to.contain('Z'),
                        expect(postField.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]),
                        expect(postField.ModificationDateTime).to.contain('Z'),
                        expect(postField.CreationDateTime).to.equals(upsertField.CreationDateTime),
                        expect(postField.ModificationDateTime).to.not.equals(upsertField.ModificationDateTime),
                        //expect(service.deleteField('transactions', fieldID, transactionsTypeArr[transactionsTypeArr[0]])).eventually.to.be.true,
                        // expect(
                        //     service.upsertField(
                        //         'transactions',
                        //         {
                        //             FieldID: fieldID,
                        //             Label: '123',
                        //             Hidden: true,
                        //             UIType: {
                        //                 ID: 1,
                        //             },
                        //         },
                        //         transactionsTypeArr[transactionsTypeArr[0]],
                        //     ),
                        // ).eventually.to.be.fulfilled,
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
                    it(`CRUD ${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} (DI-17083)`, async () => {
                        const fieldID = `TSA Creation Test ${
                            Math.floor(Math.random() * 10000).toString() + Math.random().toString(36).substring(10)
                        } ${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} 12345 (For-Positive)`;

                        if (resourceType == 'accounts' || resourceType == 'catalogs' || resourceType == 'items') {
                            const postField = await service.upsertField(resourceType, {
                                FieldID: fieldID,
                                Label: '123',
                                Description: `Description of ${fieldID}`,
                                UIType: {
                                    ID: 1,
                                },
                            });

                            const upsertField = await service.upsertField(resourceType, {
                                FieldID: fieldID,
                                Label: '1234',
                                UIType: {
                                    ID: 1,
                                },
                            });

                            return Promise.all([
                                expect(postField.Description).to.equals(`Description of ${fieldID}`),
                                expect(upsertField.Description).to.equals(`Description of ${fieldID}`),
                                expect(postField.InternalID).not.to.be.undefined,
                                expect(postField.InternalID).to.equals(upsertField.InternalID),
                                expect(postField.Label).to.not.equals(upsertField.Label),
                                expect(postField.CreationDateTime).to.contain('Z'),
                                expect(postField.ModificationDateTime).to.contain(
                                    new Date().toISOString().split('T')[0],
                                ),
                                expect(postField.ModificationDateTime).to.contain('Z'),
                                expect(postField.CreationDateTime).to.equals(upsertField.CreationDateTime),
                                expect(postField.ModificationDateTime).to.not.equals(upsertField.ModificationDateTime),
                                // expect(service.deleteField(resourceType, fieldID)).eventually.to.be.true,
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
                                    FieldID: fieldID,
                                    Label: '123',
                                    Description: `Description of ${fieldID}`,
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
                                    FieldID: fieldID,
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
                                expect(postField.Description).to.equals(`Description of ${fieldID}`),
                                expect(upsertField.Description).to.equals(`Description of ${fieldID}`),
                                expect(postField.InternalID).not.to.be.undefined,
                                expect(postField.InternalID).to.equals(upsertField.InternalID),
                                expect(postField.Label).to.not.equals(upsertField.Label),
                                expect(postField.CreationDateTime).to.contain('Z'),
                                expect(postField.ModificationDateTime).to.contain(
                                    new Date().toISOString().split('T')[0],
                                ),
                                expect(postField.ModificationDateTime).to.contain('Z'),
                                expect(postField.CreationDateTime).to.equals(upsertField.CreationDateTime),
                                expect(postField.ModificationDateTime).to.not.equals(upsertField.ModificationDateTime),
                                // expect(
                                //     service.deleteField(
                                //         resourceType,
                                //         fieldID,
                                //         resourceType.startsWith('transaction')
                                //             ? transactionsTypeArr[transactionsTypeArr[0]]
                                //             : activitiesTypeArr[activitiesTypeArr[0]],
                                //     ),
                                // ).eventually.to.be.true,
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

                it('RUD Existing Transactions Of Sales Order', async () => {
                    const fieldID = `TSATest 2 transactions 1234`;
                    const postField = await service.upsertField(
                        'transactions',
                        {
                            FieldID: fieldID,
                            Label: '123',
                            Description: `Description of ${fieldID}`,
                            UIType: {
                                ID: 1,
                            },
                        },
                        transactionsTypeArr[transactionsTypeArr[0]],
                    );

                    const upsertField = await service.upsertField(
                        'transactions',
                        {
                            FieldID: fieldID,
                            Label: '1234',
                            UIType: {
                                ID: 1,
                            },
                        },
                        transactionsTypeArr[transactionsTypeArr[0]],
                    );
                    return Promise.all([
                        expect(postField.Description).to.equals(`Description of ${fieldID}`),
                        expect(upsertField.Description).to.equals(`Description of ${fieldID}`),
                        expect(postField.InternalID).not.to.be.undefined,
                        expect(postField['UIType'].Name).to.equals('TextBox'),
                        expect(postField.InternalID).not.to.be.undefined,
                        expect(postField.InternalID).to.equals(upsertField.InternalID),
                        expect(postField.Label).to.not.equals(upsertField.Label),
                        expect(postField.CreationDateTime).to.contain('Z'),
                        expect(postField.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]),
                        expect(postField.ModificationDateTime).to.contain('Z'),
                        expect(postField.CreationDateTime).to.equals(upsertField.CreationDateTime),
                        expect(postField.ModificationDateTime).to.not.equals(upsertField.ModificationDateTime),
                        //expect(service.deleteField('transactions', fieldID, transactionsTypeArr[transactionsTypeArr[0]])).eventually.to.be.true,
                        expect(
                            service.upsertField(
                                'transactions',
                                {
                                    FieldID: fieldID,
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

                for (let index = 0; index < resourceTypesArray.length; index++) {
                    const resourceType = resourceTypesArray[index];
                    it(`RUD Existing ${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`, async () => {
                        const fieldID = `TSATest 2 ${
                            resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
                        } 12345 (For-Positive)`;

                        if (resourceType == 'accounts' || resourceType == 'catalogs' || resourceType == 'items') {
                            const postField = await service.upsertField(resourceType, {
                                FieldID: fieldID,
                                Label: '123',
                                Description: `Description of ${fieldID}`,
                                UIType: {
                                    ID: 1,
                                },
                            });

                            const upsertField = await service.upsertField(resourceType, {
                                FieldID: fieldID,
                                Label: '1234',
                                UIType: {
                                    ID: 1,
                                },
                            });

                            return Promise.all([
                                expect(postField.Description).to.equals(`Description of ${fieldID}`),
                                expect(upsertField.Description).to.equals(`Description of ${fieldID}`),
                                expect(postField.InternalID).not.to.be.undefined,
                                expect(postField.InternalID).to.equals(upsertField.InternalID),
                                expect(postField.Label).to.not.equals(upsertField.Label),
                                expect(postField.CreationDateTime).to.contain('Z'),
                                expect(postField.ModificationDateTime).to.contain(
                                    new Date().toISOString().split('T')[0],
                                ),
                                expect(postField.ModificationDateTime).to.contain('Z'),
                                expect(postField.CreationDateTime).to.equals(upsertField.CreationDateTime),
                                expect(postField.ModificationDateTime).to.not.equals(upsertField.ModificationDateTime),
                                expect(service.deleteField(resourceType, fieldID)).eventually.to.be.true,
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
                                    FieldID: fieldID,
                                    Label: '123',
                                    Description: `Description of ${fieldID}`,
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
                                    FieldID: fieldID,
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
                                expect(postField.Description).to.equals(`Description of ${fieldID}`),
                                expect(upsertField.Description).to.equals(`Description of ${fieldID}`),
                                expect(postField.InternalID).not.to.be.undefined,
                                expect(postField.InternalID).to.equals(upsertField.InternalID),
                                expect(postField.Label).to.not.equals(upsertField.Label),
                                expect(postField.CreationDateTime).to.contain('Z'),
                                expect(postField.ModificationDateTime).to.contain(
                                    new Date().toISOString().split('T')[0],
                                ),
                                expect(postField.ModificationDateTime).to.contain('Z'),
                                expect(postField.CreationDateTime).to.equals(upsertField.CreationDateTime),
                                expect(postField.ModificationDateTime).to.not.equals(upsertField.ModificationDateTime),
                                expect(
                                    service.deleteField(
                                        resourceType,
                                        fieldID,
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

                it('Recreating flaky bug (DI-17083)', async () => {
                    const fieldID = 'TSATestHadar SB12';
                    const postField = await service.upsertField(
                        'transactions',
                        {
                            FieldID: fieldID,
                            Label: 'TSATestHadar SB12',
                            Description: `TSATest bug reproduce 17/12/2020`,
                            UIType: {
                                ID: 1,
                            },
                        },
                        transactionsTypeArr[transactionsTypeArr[0]],
                    );

                    const upsertField = await service.upsertField(
                        'transactions',
                        {
                            FieldID: fieldID,
                            Label: 'TSATestHadar SB12',
                            UIType: {
                                ID: 1,
                            },
                        },
                        transactionsTypeArr[transactionsTypeArr[0]],
                    );
                    return Promise.all([
                        expect(postField.Description).to.equals(`TSATest bug reproduce 17/12/2020`),
                        expect(upsertField.Description).to.equals(`TSATest bug reproduce 17/12/2020`),
                        expect(postField.InternalID).not.to.be.undefined,
                        expect(postField['UIType'].Name).to.equals('TextBox'),
                        expect(postField.InternalID).not.to.be.undefined,
                        expect(postField.InternalID).to.equals(upsertField.InternalID),
                        expect(postField.Label).to.equals(upsertField.Label),
                        expect(postField.CreationDateTime).to.contain('Z'),
                        expect(postField.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]),
                        expect(postField.ModificationDateTime).to.contain('Z'),
                        expect(postField.CreationDateTime).to.equals(upsertField.CreationDateTime),
                        expect(postField.ModificationDateTime).to.not.equals(upsertField.ModificationDateTime),
                        //expect(service.deleteField('transactions', fieldID, transactionsTypeArr[transactionsTypeArr[0]])).eventually.to.be.true,
                        // expect(
                        //     service.upsertField(
                        //         'transactions',
                        //         {
                        //             FieldID: fieldID,
                        //             Label: '123',
                        //             Hidden: true,
                        //             UIType: {
                        //                 ID: 1,
                        //             },
                        //         },
                        //         transactionsTypeArr[transactionsTypeArr[0]],
                        //     ),
                        // ).eventually.to.be.fulfilled,
                    ]);
                });
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
                        const fieldID = `TSATest 2 ${
                            resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
                        } 12345 (For-Negative)`;

                        if (resourceType == 'accounts' || resourceType == 'catalogs' || resourceType == 'items') {
                            return expect(
                                service.upsertField(resourceType, {
                                    FieldID: fieldID,
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
                                        FieldID: fieldID,
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
                                            FieldID: fieldID,
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
                const fieldID = `TSATest 2 Temp 1234`;
                const postField = await service.upsertField(
                    'transactions',
                    {
                        FieldID: fieldID,
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
                        FieldID: fieldID,
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
                    expect(postField.InternalID).not.to.be.undefined,
                    expect(postField.CalculatedRuleEngine.Temporary).to.be.true,
                    expect(upsertField.CalculatedRuleEngine.Temporary).to.be.false,
                    expect(postField.InternalID).to.equals(upsertField.InternalID),
                    expect(postField.Label).to.not.equals(upsertField.Label),
                    expect(postField.CreationDateTime).to.contain('Z'),
                    expect(postField.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]),
                    expect(postField.ModificationDateTime).to.contain('Z'),
                    expect(postField.CreationDateTime).to.equals(upsertField.CreationDateTime),
                    expect(postField.ModificationDateTime).to.not.equals(upsertField.ModificationDateTime),
                    //expect(service.deleteField('transactions', fieldID, transactionsTypeArr[transactionsTypeArr[0]])).eventually.to.be.true,
                    expect(
                        service.upsertField(
                            'transactions',
                            {
                                FieldID: fieldID,
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
                const fieldID = `TSATest 2 Steps 12345`;
                return Promise.all([
                    //Test was removed in 21/12/2020 since all the responses of 500 will return in HTML and are not formattable
                    // await expect(
                    //     service.upsertField(
                    //         'transactions',
                    //         undefined as any,
                    //         transactionsTypeArr[transactionsTypeArr[0]],
                    //     ),
                    // ).eventually.to.be.rejectedWith(
                    //     'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Object reference not set to an instance of an object.',
                    // ),
                    await expect(
                        service.upsertField('transactions', {} as any, transactionsTypeArr[transactionsTypeArr[0]]),
                    ).eventually.to.be.rejectedWith(
                        'failed with status: 400 - Bad Request error: {"fault":{"faultstring":"FieldID cannot be null',
                    ),
                    await expect(
                        service.upsertField(
                            'transactions',
                            {
                                FieldID: fieldID,
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
                                FieldID: fieldID,
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
                                FieldID: fieldID,
                                Label: '1234',
                                UIType: {
                                    ID: 2,
                                },
                            },
                            transactionsTypeArr[transactionsTypeArr[0]],
                        ),
                    ).eventually.to.be.fulfilled,
                    //expect(service.deleteField('transactions', fieldID, transactionsTypeArr[transactionsTypeArr[0]])).eventually.to.be.true,
                    expect(
                        service.upsertField(
                            'transactions',
                            {
                                FieldID: fieldID,
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
                const fieldID = `TSATest 2 1234 (Negative)`;
                return Promise.all([
                    await expect(
                        service.upsertField(
                            'transactions',
                            {
                                FieldID: fieldID,
                                Label: '1234',
                                UIType: {
                                    ID: 'Throw Here' as any,
                                },
                            },
                            transactionsTypeArr[transactionsTypeArr[0]],
                        ),
                    ).eventually.to.be.rejectedWith(
                        `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Could not convert string to integer: Throw Here. Path 'UIType.ID', line 5, position 22.`,
                    ),
                    expect(
                        service.upsertField(
                            'transactions',
                            {
                                FieldID: fieldID,
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
                        `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Could not convert string to boolean: Throw here for test. Path 'CalculatedRuleEngine.Temporary', line 9, position 38.`,
                    ),
                ]);
            });
        });

        describe('TSA DataBase Changes', () => {
            it('Created only 7 testing TSA in the RUD Existing Tests', () => {
                return expect(
                    service.papiClient.get(
                        //Version 1 of Fields tests
                        // `/type_safe_attribute?where=Name LIKE 'TSATest %' AND Name NOT LIKE 'TSATest 1234' AND ActivityTypeDefinitionID LIKE '${
                        //     transactionsTypeArr[transactionsTypeArr[0]]
                        // }'&fields=Name&include_deleted=1`,
                        //Version 2 of Fields tests
                        `/type_safe_attribute?where=Name LIKE 'TSATest 2 %' AND ActivityTypeDefinitionID LIKE '${
                            transactionsTypeArr[transactionsTypeArr[0]]
                        }'&fields=Name&include_deleted=1`,
                    ),
                )
                    .eventually.to.be.an('array')
                    .with.lengthOf(7);
            });
        });

        describe('Test Clean up', () => {
            it('Make sure the 7 Fields from the CRUD tests removed in the end of the tests (DI-17371)', async () => {
                return expect(TestCleanUp(service)).eventually.to.equal(7);
            });
        });

        //Remove all CURD Tests Fields
        async function TestCleanUp(service: FieldsService) {
            const allFieldsObject = await service.papiClient.get(
                `/type_safe_attribute?where=Name LIKE 'TSA Creation Test %'`,
            );
            let deletedCounter = 0;
            for (let index = 0; index < allFieldsObject.length; index++) {
                if (allFieldsObject[index].Name?.toString().startsWith('TSA Creation Test ')) {
                    await service.papiClient.post('/type_safe_attribute', {
                        InternalID: allFieldsObject[index].InternalID,
                        Hidden: true,
                    });
                    deletedCounter++;
                }
            }
            return deletedCounter;
        }
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
