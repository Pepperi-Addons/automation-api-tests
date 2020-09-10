import GeneralService from '../services/general.service';
import tester from '../tester';
import { FieldsService } from '../services/fields.service';

// All File Storage Tests //NeedToCover: [] Covered: [Grid, Details, Configuration, Menu, Map, Grid, Form, Card, Large, Line, CardsGrid]
export async function FieldsTests(generalService: GeneralService) {
    const service = new FieldsService(generalService.papiClient);
    const { describe, expect, it, run } = tester();

    //#region Tests
    describe('Fields Tests Suites', () => {
        //#region Endpoints
        describe('Endpoints', () => {
            describe('Get', () => {
                /*it('Get All Data Views Valid Response (DI-16800)', async () => {
                    return expect(service.getFields('transactions', '268428')).eventually.to.be.include({});
                });
    
                it('Get All Data Views Valid Response (DI-16800)', async () => {
                    return expect(service.getFields('transactions', '268428', 'Archive')).eventually.to.be.include({});
                });*/

                it('Get All Data Views Valid Response (DI-16800)', async () => {
                    //return expect(
                    const thisIsForTesting = service.papiClient.accounts.find({ page: 1 });
                    return Promise.all([
                        expect(1 > 9).to.be.false,
                        expect(thisIsForTesting).eventually.to.be.above(20),
                        expect(1 > 9).to.be.false,
                        expect(1 > 9).to.be.false,
                        expect(1 > 9).false,
                    ]);

                    // const oren1 = await service.upsertFields(
                    //     'transactions',
                    //     {
                    //         FieldID: 'TSATest  1234',
                    //         Label: '123',
                    //         UIType: {
                    //             ID: 1,
                    //         },
                    //         Format: 'Int64',
                    //     },
                    //     '268428',
                    // );
                    // const oren2 = await service.deleteFields('transactions', 'TSATest  1234', '268428');

                    // const oren3 = await service.upsertFields('catalogs', {
                    //     FieldID: 'TSATest  12345',
                    //     Label: '123',
                    //     UIType: {
                    //         ID: 1,
                    //     },
                    //     Format: 'Int64',
                    // });
                    // const oren4 = await service.deleteFields('catalogs', 'TSATest  12345');
                });
            });
        });
    });
    return run();
}

/*
    //#endregion Endpoints
    //#region Scenarios
    describe('Scenarios', () => {
        describe('Positive', () => {
            describe('CRUD Data View (Form - Update: Title, Type, Hidden)', () => {
                it('Add Data View', async () => {
                    const allDataViewsBefore: DataView[] = await service.getDataView();
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return Promise.all([
                        await expect(
                            service.postDataView({
                                Type: 'Form',
                                Title: testDataViewTitle,
                                Context: {
                                    Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                                    ScreenSize: 'Phablet',
                                    Profile: {
                                        Name: 'Admin',
                                    },
                                },
                                Fields: [],
                                Rows: [],
                                Columns: [],
                            }),
                        )
                            .eventually.to.include({
                                Type: 'Form',
                                Title: testDataViewTitle,
                            })
                            .and.to.have.property('InternalID')
                            .that.is.a('Number'),

                        expect(await service.getDataView())
                            .to.be.an('array')
                            .with.lengthOf(allDataViewsBefore.length + 1),
                    ]);
                });

                it('Read Data View', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    const testDataView: DataView = await service.postDataView({
                        Type: 'Form',
                        Title: testDataViewTitle,
                        Context: {
                            Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                            ScreenSize: 'Phablet',
                            Profile: {
                                Name: 'Admin',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    });

                    const getDataViewResponseObj: DataView[] = await service.getDataView({
                        where: `InternalID = '${testDataView.InternalID}'`,
                    });
                    expect(getDataViewResponseObj[0].InternalID).to.be.above(0);
                    expect(getDataViewResponseObj[0]).to.include({
                        InternalID: testDataView.InternalID,
                        Type: 'Form',
                        Title: testDataViewTitle,
                        Hidden: false,
                    });
                    expect(getDataViewResponseObj[0].Context.Profile.Name).to.eql('Admin');
                    expect(getDataViewResponseObj[0].Context.Profile.InternalID).to.be.above(0);
                    expect(getDataViewResponseObj[0].Context.Name).to.eql(
                        `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                    );
                    expect(getDataViewResponseObj[0].Context.ScreenSize).to.eql('Phablet');
                    expect(getDataViewResponseObj[0].CreationDateTime).to.contain(
                        new Date().toISOString().split('T')[0],
                    );
                    expect(getDataViewResponseObj[0].CreationDateTime).to.contain('Z');
                    expect(getDataViewResponseObj[0].ModificationDateTime).to.contain(
                        new Date().toISOString().split('T')[0],
                    );
                    expect(getDataViewResponseObj[0].ModificationDateTime).to.contain('Z');
                    expect(getDataViewResponseObj[0]['Columns']).to.be.an('array');
                    expect(getDataViewResponseObj[0]['Rows']).to.be.an('array');
                    expect(getDataViewResponseObj[0].Fields).to.be.an('array');
                });

                it('Update the new added file', async () => {
                    //Create new Data View to be updated
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    const testDataView: DataView = {
                        Type: 'Form',
                        Title: testDataViewTitle,
                        Hidden: true,
                        Context: {
                            Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                            ScreenSize: 'Phablet',
                            Profile: {
                                Name: 'Admin',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    };

                    const postDataViewResponseObj: DataView = await service.postDataView(testDataView);

                    //Update the new added file
                    const testDataViewNewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();

                    const updatedDataViewObject: DataView = {
                        InternalID: postDataViewResponseObj.InternalID,
                        Type: 'Card',
                        Title: testDataViewNewTitle,
                        Hidden: false,
                        Context: postDataViewResponseObj.Context,
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    };

                    const postUpdatedDataViewResponseObj: DataView = await service.postDataView(updatedDataViewObject);

                    //Get the current (after the update) data view
                    const getDataViewResponseObj: DataView[] = await service.getDataView({
                        where: `InternalID = '${postUpdatedDataViewResponseObj.InternalID}'`,
                    });

                    expect(getDataViewResponseObj[0].InternalID).to.be.above(0);
                    expect(getDataViewResponseObj[0]).to.include({
                        InternalID: postUpdatedDataViewResponseObj.InternalID,
                        Type: 'Card',
                        Title: testDataViewNewTitle,
                        Hidden: false,
                    });
                    expect(getDataViewResponseObj[0].Context.Profile.Name).to.eql('Admin');
                    expect(getDataViewResponseObj[0].Context.Profile.InternalID).to.be.above(0);
                    expect(getDataViewResponseObj[0].Context.Name).to.eql(postUpdatedDataViewResponseObj.Context.Name);
                    expect(getDataViewResponseObj[0].Context.ScreenSize).to.eql('Phablet');
                    expect(getDataViewResponseObj[0].CreationDateTime).to.contain(
                        new Date().toISOString().split('T')[0],
                    );
                    expect(getDataViewResponseObj[0].CreationDateTime).to.contain('Z');
                    expect(getDataViewResponseObj[0].ModificationDateTime).to.contain(
                        new Date().toISOString().split('T')[0],
                    );
                    expect(getDataViewResponseObj[0].ModificationDateTime).to.contain('Z');
                    expect(getDataViewResponseObj[0]['Columns']).to.be.an('array');
                    expect(getDataViewResponseObj[0]['Rows']).to.be.an('array');
                    expect(getDataViewResponseObj[0].Fields).to.be.an('array');
                });
            });

            describe('Upsert Data View (Menu) With Partial Context (DI-16770)', () => {
                it('Upsert Data View witout Context.Object.InternalID', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    const testDataView: DataView = await service.postDataView({
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'transactions',
                                //InternalID: 268428,
                                Name: 'Sales Order',
                            },
                            Name: 'CartBulkMenu',
                            ScreenSize: 'Tablet',
                            Profile: {
                                InternalID: 67773,
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                    });

                    expect(testDataView.InternalID).to.be.above(0);
                    expect(testDataView).to.include({
                        InternalID: testDataView.InternalID,
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Hidden: false,
                    });
                    expect(testDataView.Context['Object' as any].Resource).to.be.eql('transactions');
                    expect(testDataView.Context['Object' as any].InternalID).to.be.eql(268428);
                    expect(testDataView.Context['Object' as any].Name).to.eql('Sales Order');
                    expect(testDataView.Context.Name).to.eql('CartBulkMenu');
                    expect(testDataView.Context.ScreenSize).to.eql('Tablet');
                    expect(testDataView.Context.Profile.InternalID).to.be.eql(67773);
                    expect(testDataView.Context.Profile.Name).to.eql('Rep');
                    expect(testDataView.CreationDateTime).to.contain('20');
                    expect(testDataView.CreationDateTime).to.contain('T');
                    expect(testDataView.CreationDateTime).to.contain('Z');
                    expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                    expect(testDataView.ModificationDateTime).to.contain('Z');
                    expect(testDataView.Fields).to.be.an('array');
                });

                it('Upsert Data View witout Context.Object.Name', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    const testDataView: DataView = await service.postDataView({
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'transactions',
                                InternalID: 268428,
                                //Name: 'Sales Order',
                            },
                            Name: 'CartBulkMenu',
                            ScreenSize: 'Tablet',
                            Profile: {
                                InternalID: 67773,
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                    });

                    expect(testDataView.InternalID).to.be.above(0);
                    expect(testDataView).to.include({
                        InternalID: testDataView.InternalID,
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Hidden: false,
                    });
                    expect(testDataView.Context['Object' as any].Resource).to.be.eql('transactions');
                    expect(testDataView.Context['Object' as any].InternalID).to.be.eql(268428);
                    expect(testDataView.Context['Object' as any].Name).to.eql('Sales Order');
                    expect(testDataView.Context.Name).to.eql('CartBulkMenu');
                    expect(testDataView.Context.ScreenSize).to.eql('Tablet');
                    expect(testDataView.Context.Profile.InternalID).to.be.eql(67773);
                    expect(testDataView.Context.Profile.Name).to.eql('Rep');
                    expect(testDataView.CreationDateTime).to.contain('20');
                    expect(testDataView.CreationDateTime).to.contain('T');
                    expect(testDataView.CreationDateTime).to.contain('Z');
                    expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                    expect(testDataView.ModificationDateTime).to.contain('Z');
                    expect(testDataView.Fields).to.be.an('array');
                });

                it('Upsert Data View witout Context.Profile.InternalID', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    const testDataView: DataView = await service.postDataView({
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'transactions',
                                InternalID: 268428,
                                Name: 'Sales Order',
                            },
                            Name: 'CartBulkMenu',
                            ScreenSize: 'Tablet',
                            Profile: {
                                //InternalID: 67773,
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                    });

                    expect(testDataView.InternalID).to.be.above(0);
                    expect(testDataView).to.include({
                        InternalID: testDataView.InternalID,
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Hidden: false,
                    });
                    expect(testDataView.Context['Object' as any].Resource).to.be.eql('transactions');
                    expect(testDataView.Context['Object' as any].InternalID).to.be.eql(268428);
                    expect(testDataView.Context['Object' as any].Name).to.eql('Sales Order');
                    expect(testDataView.Context.Name).to.eql('CartBulkMenu');
                    expect(testDataView.Context.ScreenSize).to.eql('Tablet');
                    expect(testDataView.Context.Profile.InternalID).to.be.eql(67773);
                    expect(testDataView.Context.Profile.Name).to.eql('Rep');
                    expect(testDataView.CreationDateTime).to.contain('20');
                    expect(testDataView.CreationDateTime).to.contain('T');
                    expect(testDataView.CreationDateTime).to.contain('Z');
                    expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                    expect(testDataView.ModificationDateTime).to.contain('Z');
                    expect(testDataView.Fields).to.be.an('array');
                });

                it('Upsert Data View witout Context.Profile.Name', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    const testDataView: DataView = await service.postDataView({
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'transactions',
                                InternalID: 268428,
                                Name: 'Sales Order',
                            },
                            Name: 'CartBulkMenu',
                            ScreenSize: 'Tablet',
                            Profile: {
                                InternalID: 67773,
                                //Name: 'Rep',
                            },
                        },
                        Fields: [],
                    });

                    expect(testDataView.InternalID).to.be.above(0);
                    expect(testDataView).to.include({
                        InternalID: testDataView.InternalID,
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Hidden: false,
                    });
                    expect(testDataView.Context['Object' as any].Resource).to.be.eql('transactions');
                    expect(testDataView.Context['Object' as any].InternalID).to.be.eql(268428);
                    expect(testDataView.Context['Object' as any].Name).to.eql('Sales Order');
                    expect(testDataView.Context.Name).to.eql('CartBulkMenu');
                    expect(testDataView.Context.ScreenSize).to.eql('Tablet');
                    expect(testDataView.Context.Profile.InternalID).to.be.eql(67773);
                    expect(testDataView.Context.Profile.Name).to.eql('Rep');
                    expect(testDataView.CreationDateTime).to.contain('20');
                    expect(testDataView.CreationDateTime).to.contain('T');
                    expect(testDataView.CreationDateTime).to.contain('Z');
                    expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                    expect(testDataView.ModificationDateTime).to.contain('Z');
                    expect(testDataView.Fields).to.be.an('array');
                });
            });

            describe('Upsert Data View (Menu) Form Empty Object To Data View ', () => {
                it('Upsert Data View to be rejected with missing Type', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                        } as any),
                    ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Type'");
                });

                it('Upsert Data View to be rejected with missing Context', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Menu',
                        } as any),
                    ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Context'");
                });

                it('Upsert Data View to be rejected with missing Context.Name', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Menu',
                            Context: {},
                        } as any),
                    ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Context.Name'");
                });

                it('Upsert Data View to be rejected with missing Context.ScreenSize', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Menu',
                            Context: {
                                Name: 'CartBulkMenu',
                            },
                        } as any),
                    ).eventually.to.be.rejectedWith(
                        "Failed due to exception: Missing expected field: 'Context.ScreenSize'",
                    );
                });

                it('Upsert Data View to be rejected with missing Context.Profile', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Menu',
                            Context: {
                                Name: 'CartBulkMenu',
                                ScreenSize: 'Tablet',
                            },
                        } as any),
                    ).eventually.to.be.rejectedWith(
                        "Failed due to exception: Missing expected field: 'Context.Profile'",
                    );
                });

                it('Upsert Data View to be rejected with missing Context.Profile.Name or Context.Profile.InternalID', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Menu',
                            Context: {
                                Name: 'CartBulkMenu',
                                ScreenSize: 'Tablet',
                                Profile: {},
                            },
                        } as any),
                    ).eventually.to.be.rejectedWith(
                        "Failed due to exception: Expected field: 'Context.Profile' to have either 'Name' or 'InternalID'",
                    );
                });

                it('Upsert Data View to be rejected with missing Context.Object', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Menu',
                            Context: {
                                Name: 'CartBulkMenu',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: 67773,
                                    Name: 'Rep',
                                },
                            },
                        } as any),
                    ).eventually.to.be.rejectedWith(
                        "Failed due to exception: Missing expected field: 'Context.Object'",
                    );
                });

                it('Upsert Data View to be rejected with missing Context.Object.Resource', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Menu',
                            Context: {
                                Name: 'CartBulkMenu',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: 67773,
                                    Name: 'Rep',
                                },
                                Object: {},
                            },
                        } as any),
                    ).eventually.to.be.rejectedWith(
                        "Failed due to exception: Missing expected field: 'Context.Object.Resource'",
                    );
                });

                it('Upsert Data View to be rejected with missing Context.Object.Name or Context.Object.InternalID', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Menu',
                            Context: {
                                Name: 'CartBulkMenu',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: 67773,
                                    Name: 'Rep',
                                },
                                Object: {
                                    Resource: 'transactions',
                                },
                            },
                        } as any),
                    ).eventually.to.be.rejectedWith(
                        "Failed due to exception: Expected field: 'Context.Object' to have either 'Name' or 'InternalID'",
                    );
                });

                it('Upsert Data View to be rejected with missing Fields', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Menu',
                            Context: {
                                Name: 'CartBulkMenu',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: 67773,
                                    Name: 'Rep',
                                },
                                Object: {
                                    Resource: 'transactions',
                                    InternalID: 67773,
                                    Name: 'Rep',
                                },
                            },
                        } as any),
                    ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Fields'");
                });

                it('Upsert Data View to be rejected with already existing', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Menu',
                            Context: {
                                Name: 'CartBulkMenu',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: 67773,
                                    Name: 'Rep',
                                },
                                Object: {
                                    Resource: 'transactions',
                                    InternalID: 67773,
                                    Name: 'Rep',
                                },
                            },
                            Fields: [],
                        }),
                    ).eventually.to.be.rejectedWith(
                        `Failed due to exception: There should only be one data view for context: {\\"Name\\":\\"CartBulkMenu\\",\\"ScreenSize\\":\\"Tablet\\",\\"Profile\\":{\\"InternalID\\":67773,\\"Name\\":\\"Rep\\"}}`,
                    );
                });
            });

            describe('Upsert Data View (Details) Form Missing Data Members To Data View ', () => {
                it('Upsert Data View to be rejected with missing Columns', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Details',
                            Context: {
                                Name: 'Test_Details',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: 67773,
                                    Name: 'Rep',
                                },
                                Object: {
                                    Resource: 'transactions',
                                    InternalID: 67773,
                                    Name: 'Rep',
                                },
                            },
                            Fields: [],
                        }),
                    ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Columns'");
                });

                it('Upsert Data View to be rejected with missing Rows', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Details',
                            Context: {
                                Name: 'Test_Details',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: 67773,
                                    Name: 'Rep',
                                },
                                Object: {
                                    Resource: 'transactions',
                                    InternalID: 67773,
                                    Name: 'Rep',
                                },
                            },
                            Fields: [],
                            Columns: [],
                        }),
                    ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Rows'");
                });

                it('Upsert Data View To Be Fulfilled', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    return expect(
                        service.postDataView({
                            Title: testDataViewTitle,
                            Type: 'Details',
                            Context: {
                                Object: {
                                    Resource: 'transactions',
                                    InternalID: 268428,
                                    Name: 'Sales Order',
                                },
                                Name: 'Test_Details',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: 67773,
                                    Name: 'Rep',
                                },
                            },
                            Fields: [],
                            Columns: [],
                            Rows: [],
                        }),
                    ).eventually.to.be.fulfilled;
                });

                it('Upsert Data View (Menu) with Fields', async () => {
                    const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                    const testDataView: DataView = await service.postDataView({
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'transactions',
                                InternalID: 268428,
                                Name: 'Sales Order',
                            },
                            Name: 'CartBulkMenu',
                            ScreenSize: 'Tablet',
                            Profile: {
                                InternalID: 67773,
                                Name: 'Rep',
                            },
                        },
                        Fields: [
                            {
                                FieldID: 'Test 123456',
                                Title: 'Hello',
                            },
                        ],
                    });

                    expect(testDataView.InternalID).to.be.above(0);
                    expect(testDataView).to.include({
                        InternalID: testDataView.InternalID,
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Hidden: false,
                    });
                    expect(testDataView.Context['Object' as any].Resource).to.be.eql('transactions');
                    expect(testDataView.Context['Object' as any].InternalID).to.be.eql(268428);
                    expect(testDataView.Context['Object' as any].Name).to.eql('Sales Order');
                    expect(testDataView.Context.Name).to.eql('CartBulkMenu');
                    expect(testDataView.Context.ScreenSize).to.eql('Tablet');
                    expect(testDataView.Context.Profile.InternalID).to.be.eql(67773);
                    expect(testDataView.Context.Profile.Name).to.eql('Rep');
                    expect(testDataView.CreationDateTime).to.contain('20');
                    expect(testDataView.CreationDateTime).to.contain('T');
                    expect(testDataView.CreationDateTime).to.contain('Z');
                    expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                    expect(testDataView.ModificationDateTime).to.contain('Z');
                    expect(testDataView.Fields).to.be.an('array');
                    expect(testDataView.Fields[0]).to.include({
                        FieldID: 'Test 123456',
                        Title: 'Hello',
                    });
                });
            });

            it('Upsert Data View (Map) With Fields, Rows and Columns (DI-16855)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                const testDataView: DataView = await service.postDataView({
                    Type: 'Map',
                    Title: testDataViewTitle,
                    Context: {
                        Object: {
                            Resource: 'activities',
                            InternalID: 271932,
                            Name: 'Daily deposit',
                        },
                        Name: 'Testing_MAP_123456',
                        ScreenSize: 'Tablet',
                        Profile: {
                            InternalID: 67773,
                            Name: 'Rep',
                        },
                    },
                    Fields: [
                        {
                            FieldID: 'Test 123456',
                            Title: 'Hello',
                            Type: 'Phone',
                            Mandatory: true,
                            ReadOnly: true,
                            Layout: {
                                Origin: {
                                    X: 10,
                                    Y: 20,
                                },
                                Size: {
                                    Height: 10,
                                    Width: 20,
                                },
                            },
                            Style: {
                                Alignment: {
                                    Horizontal: 'Center',
                                    Vertical: 'Bottom',
                                },
                            },
                        },
                    ],
                    Rows: [
                        {
                            Mode: 'MatchParent',
                        },
                    ],
                    Columns: [{}, {}],
                });

                expect(testDataView.InternalID).to.be.above(0);
                expect(testDataView).to.include({
                    InternalID: testDataView.InternalID,
                    Type: 'Map',
                    Title: testDataViewTitle,
                    Hidden: false,
                });
                expect(testDataView.Context['Object' as any].Resource).to.be.eql('activities');
                expect(testDataView.Context['Object' as any].InternalID).to.be.eql(271932);
                expect(testDataView.Context['Object' as any].Name).to.eql('Daily deposit');
                expect(testDataView.Context.Name).to.eql('Testing_MAP_123456');
                expect(testDataView.Context.ScreenSize).to.eql('Tablet');
                expect(testDataView.Context.Profile.InternalID).to.be.eql(67773);
                expect(testDataView.Context.Profile.Name).to.eql('Rep');
                expect(testDataView.CreationDateTime).to.contain('20');
                expect(testDataView.CreationDateTime).to.contain('T');
                expect(testDataView.CreationDateTime).to.contain('Z');
                expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                expect(testDataView.ModificationDateTime).to.contain('Z');
                expect(testDataView.Fields).to.be.an('array');
                expect(testDataView.Fields[0]).to.include({
                    FieldID: 'Test 123456',
                    Title: 'Hello',
                    Type: 'Phone',
                });
                expect(testDataView['Rows'][0]).to.include({
                    Mode: 'MatchParent',
                });
                expect(testDataView['Columns']).to.be.an('array');
                expect(testDataView['Columns'][0]).to.be.an('object');
                expect(testDataView['Columns'][1]).to.be.an('object');
            });

            it('Upsert Data View (Grid) With Fields, Rows and Columns (DI-16861)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                const testDataView: DataView = await service.postDataView({
                    Type: 'Grid',
                    Title: testDataViewTitle,
                    Context: {
                        Object: {
                            Resource: 'activities',
                            InternalID: 271932,
                            Name: 'Daily deposit',
                        },
                        Name: 'Testing_MAP_123456',
                        ScreenSize: 'Tablet',
                        Profile: {
                            InternalID: 67773,
                            Name: 'Rep',
                        },
                    },
                    Fields: [
                        {
                            FieldID: 'Test 123456',
                            Title: 'Hello',
                            Type: 'Phone',
                            Mandatory: true,
                            ReadOnly: true,
                            Layout: {
                                Origin: {
                                    X: 10,
                                    Y: 20,
                                },
                                Size: {
                                    Height: 10,
                                    Width: 20,
                                },
                            },
                            Style: {
                                Alignment: {
                                    Horizontal: 'Center',
                                    Vertical: 'Bottom',
                                },
                            },
                        },
                        {
                            FieldID: 'Test 123456',
                            Title: 'Hello',
                            Type: 'Phone',
                            Mandatory: true,
                            ReadOnly: true,
                            Layout: {
                                Origin: {
                                    X: 10,
                                    Y: 20,
                                },
                                Size: {
                                    Height: 10,
                                    Width: 20,
                                },
                            },
                            Style: {
                                Alignment: {
                                    Horizontal: 'Center',
                                    Vertical: 'Bottom',
                                },
                            },
                        },
                    ],
                    Rows: [
                        {
                            Mode: 'MatchParent',
                        },
                    ],
                    Columns: [
                        {
                            Width: 50,
                        },
                        {
                            Width: 10,
                        },
                    ],
                    FrozenColumnsCount: 0,
                    MinimumColumnWidth: 0,
                });

                expect(testDataView.InternalID).to.be.above(0);
                expect(testDataView).to.include({
                    InternalID: testDataView.InternalID,
                    Type: 'Grid',
                    Title: testDataViewTitle,
                    Hidden: false,
                    FrozenColumnsCount: 0,
                    MinimumColumnWidth: 0,
                });
                expect(testDataView.Context['Object' as any].Resource).to.be.eql('activities');
                expect(testDataView.Context['Object' as any].InternalID).to.be.eql(271932);
                expect(testDataView.Context['Object' as any].Name).to.eql('Daily deposit');
                expect(testDataView.Context.Name).to.eql('Testing_MAP_123456');
                expect(testDataView.Context.ScreenSize).to.eql('Tablet');
                expect(testDataView.Context.Profile.InternalID).to.be.eql(67773);
                expect(testDataView.Context.Profile.Name).to.eql('Rep');
                expect(testDataView.CreationDateTime).to.contain('20');
                expect(testDataView.CreationDateTime).to.contain('T');
                expect(testDataView.CreationDateTime).to.contain('Z');
                expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                expect(testDataView.ModificationDateTime).to.contain('Z');
                expect(testDataView.Fields).to.be.an('array');
                expect(testDataView.Fields[0]).to.include({
                    FieldID: 'Test 123456',
                    Title: 'Hello',
                    Type: 'Phone',
                });
                expect(testDataView['Columns']).to.be.an('array');
                expect(testDataView['Columns'][0]).to.include({
                    Width: 50,
                });
                expect(testDataView['Columns'][1]).to.include({
                    Width: 10,
                });
            });

            it('Get Existing Data View With Hidden ATD (DI-16826)', async () => {
                const testDataViewArr: DataView[] = await service.getDataView({
                    where: 'InternalID = 4067228',
                    include_deleted: 1,
                });
                const testDataView = testDataViewArr[0];
                expect(testDataView).to.include({
                    InternalID: 4067228,
                    Type: 'Menu',
                    Title: 'Rep',
                    Hidden: true,
                });
                expect(testDataView.Context['Object' as any].Resource).to.be.eql('transactions');
                expect(testDataView.Context['Object' as any].InternalID).to.be.eql(271439);
                expect(testDataView.Context['Object' as any].Name).to.eql('new');
                expect(testDataView.Context.Name).to.eql('CartBulkMenu');
                expect(testDataView.Context.ScreenSize).to.eql('Tablet');
                expect(testDataView.Context.Profile.InternalID).to.be.eql(67773);
                expect(testDataView.Context.Profile.Name).to.eql('Rep');
                expect(testDataView.CreationDateTime).to.contain('20');
                expect(testDataView.CreationDateTime).to.contain('T');
                expect(testDataView.CreationDateTime).to.contain('Z');
                expect(testDataView.ModificationDateTime).to.contain('Z');
                expect(testDataView.Fields).to.be.an('array');
                expect(testDataView.Fields[0]).to.include({
                    FieldID: 'Delete',
                    Title: 'Delete',
                });
                expect(testDataView.Fields[1]).to.include({
                    FieldID: 'Edit',
                    Title: 'Edit',
                });
            });

            it('Upsert Data View (Large) (DI-16874)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                const testDataView: DataView = await service.postDataView({
                    Type: 'Large',
                    Title: testDataViewTitle,
                    Context: {
                        Object: {
                            Resource: 'transactions',
                            InternalID: 268428,
                            Name: 'Sales Order',
                        },
                        Name: 'Large_Creation_Test',
                        ScreenSize: 'Tablet',
                        Profile: {
                            InternalID: 67773,
                            Name: 'Rep',
                        },
                    },
                    Fields: [],
                    Columns: [],
                    Rows: [],
                });

                expect(testDataView.InternalID).to.be.above(0);
                expect(testDataView).to.include({
                    InternalID: testDataView.InternalID,
                    Type: 'Large',
                    Title: testDataViewTitle,
                    Hidden: false,
                });
                expect(testDataView.Context['Object' as any].Resource).to.be.eql('transactions');
                expect(testDataView.Context['Object' as any].InternalID).to.be.eql(268428);
                expect(testDataView.Context['Object' as any].Name).to.eql('Sales Order');
                expect(testDataView.Context.Name).to.eql('Large_Creation_Test');
                expect(testDataView.Context.ScreenSize).to.eql('Tablet');
                expect(testDataView.Context.Profile.InternalID).to.be.eql(67773);
                expect(testDataView.Context.Profile.Name).to.eql('Rep');
                expect(testDataView.CreationDateTime).to.contain('20');
                expect(testDataView.CreationDateTime).to.contain('T');
                expect(testDataView.CreationDateTime).to.contain('Z');
                expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                expect(testDataView.ModificationDateTime).to.contain('Z');
                expect(testDataView.Fields).to.be.an('array');
                expect(testDataView.Fields[0]).to.be.undefined;
                expect(testDataView['Columns']).to.be.an('array');
                expect(testDataView['Columns'][0]).to.be.undefined;
                expect(testDataView['Rows']).to.be.an('array');
                expect(testDataView['Rows'][0]).to.be.undefined;
            });

            it('Upsert Data View (Line)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                const testDataView: DataView = await service.postDataView({
                    Type: 'Line',
                    Title: testDataViewTitle,
                    Context: {
                        Object: {
                            Resource: 'transactions',
                            InternalID: 268428,
                            Name: 'Sales Order',
                        },
                        Name: 'Line_Creation_Test',
                        ScreenSize: 'Tablet',
                        Profile: {
                            InternalID: 67773,
                            Name: 'Rep',
                        },
                    },
                    Fields: [],
                    Columns: [],
                    Rows: [],
                });

                expect(testDataView.InternalID).to.be.above(0);
                expect(testDataView).to.include({
                    InternalID: testDataView.InternalID,
                    Type: 'Line',
                    Title: testDataViewTitle,
                    Hidden: false,
                });
                expect(testDataView.Context['Object' as any].Resource).to.be.eql('transactions');
                expect(testDataView.Context['Object' as any].InternalID).to.be.eql(268428);
                expect(testDataView.Context['Object' as any].Name).to.eql('Sales Order');
                expect(testDataView.Context.Name).to.eql('Line_Creation_Test');
                expect(testDataView.Context.ScreenSize).to.eql('Tablet');
                expect(testDataView.Context.Profile.InternalID).to.be.eql(67773);
                expect(testDataView.Context.Profile.Name).to.eql('Rep');
                expect(testDataView.CreationDateTime).to.contain('20');
                expect(testDataView.CreationDateTime).to.contain('T');
                expect(testDataView.CreationDateTime).to.contain('Z');
                expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                expect(testDataView.ModificationDateTime).to.contain('Z');
                expect(testDataView.Fields).to.be.an('array');
                expect(testDataView.Fields[0]).to.be.undefined;
                expect(testDataView['Columns']).to.be.an('array');
                expect(testDataView['Columns'][0]).to.be.undefined;
                expect(testDataView['Rows']).to.be.an('array');
                expect(testDataView['Rows'][0]).to.be.undefined;
            });

            it('Upsert Data View (CardsGrid)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                const testDataView: DataView = await service.postDataView({
                    Type: 'CardsGrid',
                    Title: testDataViewTitle,
                    Context: {
                        Object: {
                            Resource: 'transactions',
                            InternalID: 268428,
                            Name: 'Sales Order',
                        },
                        Name: 'CardsGrid_Creation_Test',
                        ScreenSize: 'Tablet',
                        Profile: {
                            InternalID: 67773,
                            Name: 'Rep',
                        },
                    },
                    Fields: [],
                    Columns: [],
                    Rows: [],
                });

                expect(testDataView.InternalID).to.be.above(0);
                expect(testDataView).to.include({
                    InternalID: testDataView.InternalID,
                    Type: 'CardsGrid',
                    Title: testDataViewTitle,
                    Hidden: false,
                });
                expect(testDataView.Context['Object' as any].Resource).to.be.eql('transactions');
                expect(testDataView.Context['Object' as any].InternalID).to.be.eql(268428);
                expect(testDataView.Context['Object' as any].Name).to.eql('Sales Order');
                expect(testDataView.Context.Name).to.eql('CardsGrid_Creation_Test');
                expect(testDataView.Context.ScreenSize).to.eql('Tablet');
                expect(testDataView.Context.Profile.InternalID).to.be.eql(67773);
                expect(testDataView.Context.Profile.Name).to.eql('Rep');
                expect(testDataView.CreationDateTime).to.contain('20');
                expect(testDataView.CreationDateTime).to.contain('T');
                expect(testDataView.CreationDateTime).to.contain('Z');
                expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                expect(testDataView.ModificationDateTime).to.contain('Z');
                expect(testDataView.Fields).to.be.an('array');
                expect(testDataView.Fields[0]).to.be.undefined;
                expect(testDataView['Columns']).to.be.an('array');
                expect(testDataView['Columns'][0]).to.be.undefined;
                expect(testDataView['Rows']).to.be.an('array');
                expect(testDataView['Rows'][0]).to.be.undefined;
            });
        });

        describe('Negative', () => {
            it('Insert New Data View (Card) With Wrong Context.Name', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Card',
                        Title: testDataViewTitle,
                        Context: {
                            Name: `Oren ${testDataViewTitle}`, //(#Negative).replace(/ /gi, '_'),
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    'Failed due to exception: Context.Name must be non-empty and can only contain letters, numbers or an underscore',
                );
            });

            it('Insert New Data View (Card) Without Context.Profile', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Card',
                        Title: testDataViewTitle,
                        Context: {
                            Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: undefined, //(#Negative)'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    "Failed due to exception: Expected field: 'Context.Profile' to have either 'Name' or 'InternalID'",
                );
            });

            it('Insert New Data View (Card) Without Context.Name', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Card',
                        Title: testDataViewTitle,
                        Context: {
                            Name: undefined as any, //(#Negative)`Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Context.Name'");
            });

            it('Insert New Data View (Card) Without Context.ScreenSize', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Card',
                        Title: testDataViewTitle,
                        Context: {
                            Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                            ScreenSize: undefined as any, //(#Negative)'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    "Failed due to exception: Missing expected field: 'Context.ScreenSize'",
                );
            });

            it('Insert New Data View (Card) Without Type', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: undefined as any, //'Card',
                        Title: testDataViewTitle,
                        Context: {
                            Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Type'");
            });

            it('Insert New Data View (Configuration) Without Context.Object (DI-16781)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Configuration',
                        Title: testDataViewTitle,
                        Context: {
                            Name: 'ActivityProfilePermission',
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Context.Object'");
            });

            it('Insert New Data View (Configuration) Without Context.Object.Name (DI-16796)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Configuration',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'activities',
                            },
                            Name: 'ActivityProfilePermission',
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    "Failed due to exception: Expected field: 'Context.Object' to have either 'Name' or 'InternalID'",
                );
            });

            it('Insert New Data View (Configuration) With Wrong Context.Object.Name (DI-16872)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Configuration',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'activities',
                                Name: 'Oren Test',
                            },
                            Name: 'ActivityProfilePermission',
                            ScreenSize: 'Landscape',
                            Profile: {
                                InternalID: 67778,
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    "Failed due to exception: Object with Name = 'Oren Test' for Resource = 'activities' not found",
                );
            });

            it('Insert New Data View (Configuration) With Wrong Context.Name (DI-16747)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Configuration',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'activities',
                                Name: 'Photo',
                            },
                            Name: 'ActivityProfilePermission ',
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    'Failed due to exception: Context.Name must be non-empty and can only contain letters, numbers or an underscore',
                );
            });

            it('Insert new data view (Configuration) With Object (Unexpected) For WebAppMainBar', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Configuration',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'activities',
                                Name: 'Photo',
                            },
                            Name: 'WebAppMainBar',
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    "Failed due to exception: Unexpected field: 'Context.Object' for DataView of 'WebAppMainBar'",
                );
            });

            it('Insert New Data View (Configuration) Without Context.Profile', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Configuration',
                        Title: testDataViewTitle,
                        Context: {
                            Name: 'ActivityProfilePermission',
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: undefined, //(#Negative)'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    "Failed due to exception: Expected field: 'Context.Profile' to have either 'Name' or 'InternalID'",
                );
            });

            it('Insert New Data View (Configuration) Without Context.Name', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Configuration',
                        Title: testDataViewTitle,
                        Context: {
                            Name: undefined as any, //(#Negative)`Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Context.Name'");
            });

            it('Insert New Data View (Configuration) Without Context.ScreenSize', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Configuration',
                        Title: testDataViewTitle,
                        Context: {
                            Name: 'ActivityProfilePermission',
                            ScreenSize: undefined as any, //(#Negative)'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    "Failed due to exception: Missing expected field: 'Context.ScreenSize'",
                );
            });

            it('Insert New Data View (Configuration) Without Type', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: undefined as any, //'Card',
                        Title: testDataViewTitle,
                        Context: {
                            Name: 'ActivityProfilePermission',
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Type'");
            });

            it('Try To Update Context Of Existing Data View (Form)', async () => {
                //Create new Data View to be updated
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                const testDataView: DataView = {
                    Type: 'Form',
                    Title: testDataViewTitle,
                    Hidden: true,
                    Context: {
                        Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                        ScreenSize: 'Tablet',
                        Profile: {
                            Name: 'Rep',
                        },
                    },
                    Fields: [],
                    Rows: [],
                    Columns: [],
                };

                const postDataViewResponseObj: DataView = await service.postDataView(testDataView);

                return expect(
                    service.postDataView({
                        InternalID: postDataViewResponseObj.InternalID,
                        Type: 'Form',
                        Title: testDataViewTitle,
                        Hidden: false,
                        Context: {
                            Name: postDataViewResponseObj.Context.Name,
                            ScreenSize: 'Phablet',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    `Failed due to exception: The Context send does not match the current Context. Current Context: {\\"Name\\":\\"${postDataViewResponseObj.Context.Name}\\",\\"ScreenSize\\":\\"Tablet\\",\\"Profile\\":{\\"InternalID\\":67773,\\"Name\\":\\"Rep\\"}`,
                );
            });

            it('Upsert Data View (Menu) With Wrong Context.Object (DI-16872)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'transactions',
                                InternalID: 268421, //8
                            },
                            Name: 'OrderCartSmartSearch',
                            ScreenSize: 'Landscape',
                            Profile: {
                                InternalID: 67773,
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                    }),
                ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'InternalID'");
            });

            it('Upsert Data View (Card) With Missing Non-Mandatory Field Valid Response (DI-16807)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return Promise.all([
                    await expect(
                        service.postDataView({
                            Type: 'Card',
                            Title: testDataViewTitle,
                            Context: {
                                Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                                ScreenSize: 'Landscape',
                                Profile: {
                                    Name: 'Rep',
                                },
                            },
                            Fields: [],
                            Rows: [],
                            Columns: [],
                        }),
                    )
                        .eventually.to.include({
                            Type: 'Card',
                            Title: testDataViewTitle,
                        })
                        .and.to.have.property('InternalID')
                        .that.is.a('Number'),
                    await expect(
                        service.postDataView({
                            Type: 'Card',
                            Context: {
                                Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                                ScreenSize: 'Landscape',
                                Profile: {
                                    Name: 'Rep',
                                },
                            },
                            Fields: [],
                            Rows: [],
                            Columns: [],
                        }),
                    )
                        .eventually.to.include({
                            Type: 'Card',
                            Title: testDataViewTitle,
                        })
                        .and.to.have.property('InternalID')
                        .that.is.a('Number'),
                ]);
            });

            it('Upsert Data View (Details) Valid Response For Landscape (DI-16818)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Card',
                        Title: testDataViewTitle,
                        Context: {
                            Name: '',
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    'Failed due to exception: Context.Name must be non-empty and can only contain letters, numbers or an underscore',
                );
            });

            it('Upsert Data View (Details) Valid Response For Tablet', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Card',
                        Title: testDataViewTitle,
                        Context: {
                            Name: '',
                            ScreenSize: 'Tablet',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    'Failed due to exception: Context.Name must be non-empty and can only contain letters, numbers or an underscore',
                );
            });

            it('Upsert Data View (Details) Valid Response For Phablet (DI-16818)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Card',
                        Title: testDataViewTitle,
                        Context: {
                            Name: '',
                            ScreenSize: 'Phablet',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                    }),
                ).eventually.to.be.rejectedWith(
                    'Failed due to exception: Context.Name must be non-empty and can only contain letters, numbers or an underscore',
                );
            });

            it('Upsert Data View (Grid) With Wrong Type For Context.Name (DI-16809)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        InternalID: 4886426,
                        Type: 'Grid',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'transactions',
                                Name: 'Sales Order',
                            },
                            Name: 'OrderViewsMenu',
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                        FrozenColumnsCount: 0,
                        MinimumColumnWidth: 0,
                    }),
                ).eventually.to.be.rejectedWith(
                    "Failed due to exception: Expected Type = 'Menu' for Context.Name = 'OrderViewsMenu'",
                );
            });

            it('Upsert Data View (Grid) With Wrong InternalID', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        InternalID: 488642612,
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'transactions',
                                Name: 'Sales Order',
                            },
                            Name: 'OrderViewsMenu',
                            ScreenSize: 'Landscape',
                            Profile: {
                                Name: 'Rep',
                            },
                        },
                        Fields: [],
                        Rows: [],
                        Columns: [],
                        FrozenColumnsCount: 0,
                        MinimumColumnWidth: 0,
                    }),
                ).eventually.to.be.rejectedWith(
                    'Failed due to exception: Could not find DataView with InternalID = 488642612',
                );
            });

            it('Upsert Data View (Menu) Witout Fields.Title', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'transactions',
                                InternalID: 268428,
                                Name: 'Sales Order',
                            },
                            Name: 'CartBulkMenu',
                            ScreenSize: 'Tablet',
                            Profile: {
                                InternalID: 67773,
                                Name: 'Rep',
                            },
                        },
                        Fields: [
                            {
                                FieldID: '123456',
                                //Title: "hello"
                            },
                        ],
                    }),
                ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Fields[0].Title'");
            });

            it('Upsert Data View (Menu) Witout Fields.FieldID', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Menu',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'transactions',
                                InternalID: 268428,
                                Name: 'Sales Order',
                            },
                            Name: 'CartBulkMenu',
                            ScreenSize: 'Tablet',
                            Profile: {
                                InternalID: 67773,
                                Name: 'Rep',
                            },
                        },
                        Fields: [
                            {
                                //FieldID: "123456",
                                Title: 'hello',
                            } as any,
                        ],
                    }),
                ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Fields[0].FieldID'");
            });

            it('Upsert Data View (Map) Without Fields[0].Style.Alignment.Vertical (DI-16852)', async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Map',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'activities',
                                InternalID: 271932,
                                Name: 'Daily deposit',
                            },
                            Name: 'Testing_MAP_123456',
                            ScreenSize: 'Tablet',
                            Profile: {
                                InternalID: 67773,
                                Name: 'Rep',
                            },
                        },
                        Fields: [
                            {
                                FieldID: 'Test 123456',
                                Title: 'Hello',
                                Type: 'Phone',
                                Mandatory: true,
                                ReadOnly: true,
                                Layout: {
                                    Origin: {
                                        X: 10,
                                        Y: 20,
                                    },
                                    Size: {
                                        Height: 10,
                                        Width: 20,
                                    },
                                },
                                Style: {
                                    Alignment: {
                                        Horizontal: 'Center',
                                        //Vertical: 'Bottom',
                                    },
                                },
                            },
                        ],
                        Rows: [
                            {
                                Mode: 'MatchParent',
                            },
                        ],
                        Columns: [],
                    } as any),
                ).eventually.to.be.rejectedWith(
                    "Failed due to exception: Missing expected field: 'Fields[0].Style.Alignment.Vertical'",
                );
            });

            it("Upsert Data View (Grid) With One 'Fields' And Two 'Columns' (DI-16861)", async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Grid',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'activities',
                                InternalID: 271932,
                                Name: 'Daily deposit',
                            },
                            Name: 'Testing_MAP_123456',
                            ScreenSize: 'Tablet',
                            Profile: {
                                InternalID: 67773,
                                Name: 'Rep',
                            },
                        },
                        Fields: [
                            {
                                FieldID: 'Test 123456',
                                Title: 'Hello',
                                Type: 'Phone',
                                Mandatory: true,
                                ReadOnly: true,
                                Layout: {
                                    Origin: {
                                        X: 10,
                                        Y: 20,
                                    },
                                    Size: {
                                        Height: 10,
                                        Width: 20,
                                    },
                                },
                                Style: {
                                    Alignment: {
                                        Horizontal: 'Center',
                                        Vertical: 'Bottom',
                                    },
                                },
                            },
                        ],
                        Rows: [
                            {
                                Mode: 'MatchParent',
                            },
                        ],
                        Columns: [
                            {
                                Width: 50,
                            },
                            {
                                Width: 10,
                            },
                        ],
                        FrozenColumnsCount: 0,
                        MinimumColumnWidth: 0,
                    }),
                ).eventually.to.be.rejectedWith(
                    "Failed due to exception: A Grid's number of columns must match it's number of fields",
                );
            });

            it("Upsert Data View (Grid) With Two 'Fields' And One 'Columns' (DI-16861)", async () => {
                const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                return expect(
                    service.postDataView({
                        Type: 'Grid',
                        Title: testDataViewTitle,
                        Context: {
                            Object: {
                                Resource: 'activities',
                                InternalID: 271932,
                                Name: 'Daily deposit',
                            },
                            Name: 'Testing_MAP_123456',
                            ScreenSize: 'Tablet',
                            Profile: {
                                InternalID: 67773,
                                Name: 'Rep',
                            },
                        },
                        Fields: [
                            {
                                FieldID: 'Test 123456',
                                Title: 'Hello',
                                Type: 'Phone',
                                Mandatory: true,
                                ReadOnly: true,
                                Layout: {
                                    Origin: {
                                        X: 10,
                                        Y: 20,
                                    },
                                    Size: {
                                        Height: 10,
                                        Width: 20,
                                    },
                                },
                                Style: {
                                    Alignment: {
                                        Horizontal: 'Center',
                                        Vertical: 'Bottom',
                                    },
                                },
                            },
                            {
                                FieldID: 'Test 123456',
                                Title: 'Hello',
                                Type: 'Phone',
                                Mandatory: true,
                                ReadOnly: true,
                                Layout: {
                                    Origin: {
                                        X: 10,
                                        Y: 20,
                                    },
                                    Size: {
                                        Height: 10,
                                        Width: 20,
                                    },
                                },
                                Style: {
                                    Alignment: {
                                        Horizontal: 'Center',
                                        Vertical: 'Bottom',
                                    },
                                },
                            },
                        ],
                        Rows: [
                            {
                                Mode: 'MatchParent',
                            },
                        ],
                        Columns: [
                            {
                                Width: 50,
                            },
                        ],
                        FrozenColumnsCount: 0,
                        MinimumColumnWidth: 0,
                    }),
                ).eventually.to.be.rejectedWith(
                    "Failed due to exception: A Grid's number of columns must match it's number of fields",
                );
            });
        });
    });
/*
    //#endregion Scenarios

    describe('Test Clean Up (Hidden = true)', () => {
        it('All The Data Views Hidden', async () => {
            const dataViewCounter: number = await (await service.getDataView()).length;
            return Promise.all([
                await expect(TestCleanUp(service)).eventually.to.be.above(0),
                await expect((await service.getDataView()).length).to.be.below(dataViewCounter),
            ]);
        });
    });
    //#endregion Tests
    return run();
}

//Service Functions
//Remove all test files from Files Storage
async function TestCleanUp(service: DataViewsService) {
    const allDataViewObjects: DataView[] = await service.getDataView();
    let deletedCounter = 0;

    for (let index = 0; index < allDataViewObjects.length; index++) {
        if (
            allDataViewObjects[index].Title?.toString().startsWith('Test') &&
            Number(allDataViewObjects[index].Title?.toString().split(' ')[1]) > 100 &&
            allDataViewObjects[index].Hidden == false
        ) {
            try {
                console.log('deleted idex: ' + index);
                console.log({ deleted_Object: allDataViewObjects[index] });
                allDataViewObjects[index].Hidden = true;
                await service.postDataView(allDataViewObjects[index]);
                deletedCounter++;
            } catch (error) {
                console.log('error in idex: ' + index);

                console.log(error);
            }
        }
    }
    console.log('Hided Data Views: ' + deletedCounter);
    return deletedCounter;
}
*/
