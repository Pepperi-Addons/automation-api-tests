import GeneralService, { TesterFunctions } from '../services/general.service';
import { DataViewsService } from '../services/data-views.service';
import { DataView } from '@pepperi-addons/papi-sdk';

//#region Test Config area
const testConfigObj = {
    isBase: false,
    isPositiveScenarios: false,
    isNegativeScenarios: false,
};

// All Data Views Tests //NeedToCover: [] Covered: [Grid, Details, Configuration, Menu, Map, Grid, Form, Card, Large, Line, CardsGrid]
export async function DataViewsTestsBase(generalService: GeneralService, tester: TesterFunctions) {
    (testConfigObj.isBase = true),
        (testConfigObj.isPositiveScenarios = false),
        (testConfigObj.isNegativeScenarios = false),
        await DataViewsTests(generalService, tester);
}

export async function DataViewsTestsPositive(generalService: GeneralService, tester: TesterFunctions) {
    (testConfigObj.isBase = false),
        (testConfigObj.isPositiveScenarios = true),
        (testConfigObj.isNegativeScenarios = false),
        await DataViewsTests(generalService, tester);
}

export async function DataViewsTestsNegative(generalService: GeneralService, tester: TesterFunctions) {
    (testConfigObj.isBase = false),
        (testConfigObj.isPositiveScenarios = false),
        (testConfigObj.isNegativeScenarios = true),
        await DataViewsTests(generalService, tester);
}

export async function DataViewsTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = new DataViewsService(generalService.papiClient);
    //const clientService = generalService; // only use to execute tests on specifc clients - canceled on 04/02/2021
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //Prerequisites Test Data
    const transactionsTypeArr = [] as any;
    const activitiesTypeArr = [] as any;
    const userTypeIDArr = [] as any;

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

    const usersArr = await service.papiClient.get('/users');
    usersArr.forEach((element) => {
        if (!userTypeIDArr.includes(element.Profile.Data.Name)) {
            userTypeIDArr.push(element.Profile.Data.Name);
            userTypeIDArr[element.Profile.Data.Name] = element.Profile.Data.InternalID;
        }
    });

    //#region Tests
    describe('Data Views Tests Suites', () => {
        //Test Data
        it(`Test Data: Transaction - Name: ${transactionsTypeArr[0]}, TypeID: ${
            transactionsTypeArr[transactionsTypeArr[0]]
        }`, () => {
            expect(transactionsTypeArr[transactionsTypeArr[0]]).to.be.a('number').that.is.above(0);
        });

        it(`Test Data: Activity - Name: ${activitiesTypeArr[0]}, TypeID: ${
            activitiesTypeArr[activitiesTypeArr[0]]
        }`, () => {
            expect(activitiesTypeArr[activitiesTypeArr[0]]).to.be.a('number').that.is.above(0);
        });

        it(`Test Data: Users - Name: ${userTypeIDArr[0]}, InternalID: ${userTypeIDArr[userTypeIDArr[0]]}, Name: ${
            userTypeIDArr[1]
        }, InternalID: ${userTypeIDArr[userTypeIDArr[1]]}`, () => {
            expect(userTypeIDArr[userTypeIDArr[0]]).to.be.a('number').that.is.above(0);
            expect(userTypeIDArr[userTypeIDArr[1]]).to.be.a('number').that.is.above(0);
        });

        //#region Endpoints
        if (testConfigObj.isBase) {
            describe('Endpoints', () => {
                describe('Upsert', () => {
                    it('Upsert Data View (Card) Valid Response', async () => {
                        const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        return expect(
                            service.postDataView({
                                Type: 'Card',
                                Title: testDataViewTitle,
                                Context: {
                                    Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                                    ScreenSize: 'Landscape',
                                    Profile: {
                                        Name: userTypeIDArr[1],
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
                            .that.is.a('Number');
                    });

                    it('Upsert Data View (Card) Valid Creation Amount', async () => {
                        //Get All Before
                        const totalDataViewsBefore: number = await (await service.getDataViews()).length;
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
                                            Name: userTypeIDArr[0],
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
                            await expect(service.getDataViews())
                                .eventually.to.be.an('array')
                                .with.lengthOf(totalDataViewsBefore + 1),
                        ]);
                    });

                    // Array endpoints are not yet supported and Batch SDK is not yet working
                    let testCRUDataViewsArr: DataView[];
                    let totalDataViewsBeforeCRU;
                    let insertDataViewResponse;
                    let upsertDataViewResponse;
                    let ignoreDataViewResponse;
                    it('Insert Data Views Batch Valid Response (DI-16869)', async () => {
                        //Get All Before
                        totalDataViewsBeforeCRU = await (await service.getDataViews()).length;
                        const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        testCRUDataViewsArr = [
                            {
                                Type: 'Card',
                                Title: testDataViewTitle,
                                Context: {
                                    Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                                    ScreenSize: 'Landscape',
                                    Profile: {
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
                                Rows: [],
                                Columns: [],
                            },
                            {
                                Type: 'Card',
                                Title: testDataViewTitle,
                                Context: {
                                    Name: `Oren ${testDataViewTitle + 1}`.replace(/ /gi, '_'),
                                    ScreenSize: 'Landscape',
                                    Profile: {
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
                                Rows: [],
                                Columns: [],
                            },
                        ];
                        insertDataViewResponse = await service.postDataViewBatch(testCRUDataViewsArr);
                        return Promise.all([
                            expect(insertDataViewResponse).to.be.an('array').with.lengthOf(2),
                            expect(insertDataViewResponse[0].InternalID).to.be.a('number').that.is.above(0),
                            expect(insertDataViewResponse[0].UUID).to.be.a('string').with.lengthOf(36),
                            expect(insertDataViewResponse[0].ExternalID).to.be.a('string').that.equal(''),
                            expect(insertDataViewResponse[0].Status).to.be.a('string').that.equal('Insert'),
                            expect(insertDataViewResponse[0].Message).to.be.a('string').that.equal('Row inserted.'),
                            expect(insertDataViewResponse[0].URI)
                                .to.be.a('string')
                                .that.contains(
                                    `/meta_data/data_views?where=InternalID=${insertDataViewResponse[0].InternalID}`,
                                ),
                            expect(insertDataViewResponse[1].InternalID).to.be.a('number').that.is.above(0),
                            expect(insertDataViewResponse[1].UUID).to.be.a('string').with.lengthOf(36),
                            expect(insertDataViewResponse[1].ExternalID).to.be.a('string').that.equal(''),
                            expect(insertDataViewResponse[1].Status).to.be.a('string').that.equal('Insert'),
                            expect(insertDataViewResponse[1].Message).to.be.a('string').that.equal('Row inserted.'),
                            expect(insertDataViewResponse[1].URI)
                                .to.be.a('string')
                                .that.contains(
                                    `/meta_data/data_views?where=InternalID=${insertDataViewResponse[1].InternalID}`,
                                ),
                        ]);
                    });

                    it('Upsert Data Views Batch Valid Response (DI-16869)', async () => {
                        upsertDataViewResponse = await service.postDataViewBatch(testCRUDataViewsArr);
                        await Promise.all([
                            expect(upsertDataViewResponse).to.be.an('array').with.lengthOf(2),
                            expect(upsertDataViewResponse[0].InternalID)
                                .to.be.a('number')
                                .that.equal(insertDataViewResponse[0].InternalID),
                            expect(upsertDataViewResponse[0].UUID)
                                .to.be.a('string')
                                .that.equal(insertDataViewResponse[0].UUID),
                            expect(upsertDataViewResponse[0].ExternalID)
                                .to.be.a('string')
                                .that.equal(insertDataViewResponse[0].ExternalID),
                            expect(upsertDataViewResponse[0].Status).to.be.a('string').that.equal('Update'),
                            expect(upsertDataViewResponse[0].Message).to.be.a('string').that.equal('Row updated.'),
                            expect(upsertDataViewResponse[0].URI)
                                .to.be.a('string')
                                .that.contains(
                                    `/meta_data/data_views?where=InternalID=${insertDataViewResponse[0].InternalID}`,
                                ),
                            expect(upsertDataViewResponse[1].InternalID)
                                .to.be.a('number')
                                .that.equal(insertDataViewResponse[1].InternalID),
                            expect(upsertDataViewResponse[1].UUID)
                                .to.be.a('string')
                                .that.equal(insertDataViewResponse[1].UUID),
                            expect(upsertDataViewResponse[1].ExternalID)
                                .to.be.a('string')
                                .that.equal(insertDataViewResponse[1].ExternalID),
                            expect(upsertDataViewResponse[1].Status).to.be.a('string').that.equal('Update'),
                            expect(upsertDataViewResponse[1].Message).to.be.a('string').that.equal('Row updated.'),
                            expect(upsertDataViewResponse[1].URI)
                                .to.be.a('string')
                                .that.contains(
                                    `/meta_data/data_views?where=InternalID=${insertDataViewResponse[1].InternalID}`,
                                ),
                        ]);
                    });

                    it('Ignore Data Views Batch Valid Response (DI-16869)', async () => {
                        ignoreDataViewResponse = await service.postDataViewBatch(testCRUDataViewsArr);
                        await Promise.all([
                            expect(ignoreDataViewResponse).to.be.an('array').with.lengthOf(2),
                            expect(ignoreDataViewResponse[0].InternalID)
                                .to.be.a('number')
                                .that.equal(insertDataViewResponse[0].InternalID),
                            expect(ignoreDataViewResponse[0].UUID)
                                .to.be.a('string')
                                .that.equal(insertDataViewResponse[0].UUID),
                            expect(ignoreDataViewResponse[0].ExternalID)
                                .to.be.a('string')
                                .that.equal(insertDataViewResponse[0].ExternalID),
                            expect(ignoreDataViewResponse[0].Status).to.be.a('string').that.equal('Ignore'),
                            expect(ignoreDataViewResponse[0].Message)
                                .to.be.a('string')
                                .that.equal('No changes in this row. The row is being ignored.'),
                            expect(ignoreDataViewResponse[0].URI)
                                .to.be.a('string')
                                .that.contains(
                                    `/meta_data/data_views?where=InternalID=${insertDataViewResponse[0].InternalID}`,
                                ),
                            expect(ignoreDataViewResponse[1].InternalID)
                                .to.be.a('number')
                                .that.equal(insertDataViewResponse[1].InternalID),
                            expect(ignoreDataViewResponse[1].UUID)
                                .to.be.a('string')
                                .that.equal(insertDataViewResponse[1].UUID),
                            expect(ignoreDataViewResponse[1].ExternalID)
                                .to.be.a('string')
                                .that.equal(insertDataViewResponse[1].ExternalID),
                            expect(ignoreDataViewResponse[1].Status).to.be.a('string').that.equal('Ignore'),
                            expect(ignoreDataViewResponse[1].Message)
                                .to.be.a('string')
                                .that.equal('No changes in this row. The row is being ignored.'),
                            expect(ignoreDataViewResponse[1].URI)
                                .to.be.a('string')
                                .that.contains(
                                    `/meta_data/data_views?where=InternalID=${insertDataViewResponse[1].InternalID}`,
                                ),
                            await expect(service.getDataViews())
                                .eventually.to.be.an('array')
                                .with.lengthOf(totalDataViewsBeforeCRU + 2),
                        ]);
                    });

                    it('Upsert Data Views Batch Valid Creation Amount (DI-16869)', async () => {
                        //Get All Before
                        const totalDataViewsBefore: number = await (await service.getDataViews()).length;
                        const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        return Promise.all([
                            await expect(
                                service.postDataViewBatch([
                                    {
                                        Type: 'Card',
                                        Title: testDataViewTitle,
                                        Context: {
                                            Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                                            ScreenSize: 'Landscape',
                                            Profile: {
                                                Name: userTypeIDArr[0],
                                            },
                                        },
                                        Fields: [],
                                        Rows: [],
                                        Columns: [],
                                    },
                                    {
                                        Type: 'Card',
                                        Title: testDataViewTitle,
                                        Context: {
                                            Name: `Oren ${testDataViewTitle + 1}`.replace(/ /gi, '_'),
                                            ScreenSize: 'Landscape',
                                            Profile: {
                                                Name: userTypeIDArr[0],
                                            },
                                        },
                                        Fields: [],
                                        Rows: [],
                                        Columns: [],
                                    },
                                ]),
                            )
                                .eventually.to.be.an('array')
                                .with.lengthOf(2),
                            expect(service.getDataViews())
                                .eventually.to.be.an('array')
                                .with.lengthOf(totalDataViewsBefore + 2),
                        ]);
                    });
                });

                describe('Get', () => {
                    it('Get All Data Views Valid Response (DI-16800)', async () => {
                        return expect(service.getDataViews()).eventually.to.be.an('array').with.length.above(0);
                    });

                    it('Get No Data Views Valid Response', async () => {
                        return expect(
                            service.getDataViews({
                                where: `InternalID = '00'`,
                            }),
                        )
                            .eventually.to.be.an('array')
                            .with.lengthOf(0);
                    });

                    it('Get Data View (Grid - by InternalID) Valid Response', async () => {
                        const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        const testDataView: DataView = await service.postDataView({
                            Type: 'Grid',
                            Title: testDataViewTitle,
                            Hidden: false,
                            Context: {
                                Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                                ScreenSize: 'Tablet',
                                Profile: {
                                    Name: userTypeIDArr[1],
                                },
                            },
                            Fields: [],
                            Columns: [],
                            FrozenColumnsCount: 0,
                            MinimumColumnWidth: 0,
                        });

                        const getDataViewResponseObj: DataView[] = await service.getDataViews({
                            where: `InternalID = '${testDataView.InternalID}'`,
                            //where: 'Type = Grid AND Title = Rep',
                            //where: "Type = 'Grid' AND CreationDateTime = '2019-12-31Z'",
                            //where: "CreationDateTime = '2019-12-31Z'",
                            //where: "Type = 'Grid' AND Title = userTypeIDArr[userTypeIDArr[1]]",
                        });
                        expect(getDataViewResponseObj[0].InternalID).to.be.above(0);
                        expect(getDataViewResponseObj[0]).to.include({
                            InternalID: testDataView.InternalID,
                            Type: 'Grid',
                            Title: testDataViewTitle,
                            Hidden: false,
                            FrozenColumnsCount: 0,
                            MinimumColumnWidth: 0,
                        });
                        expect(getDataViewResponseObj[0]['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                        expect(getDataViewResponseObj[0]['Context' as any].Profile.InternalID).to.be.above(0);
                        expect(getDataViewResponseObj[0]['Context' as any].Name).to.eql(
                            `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                        );
                        expect(getDataViewResponseObj[0]['Context' as any].ScreenSize).to.eql('Tablet');
                        expect(getDataViewResponseObj[0].CreationDateTime).to.contain('20');
                        expect(getDataViewResponseObj[0].CreationDateTime).to.contain('T');
                        expect(getDataViewResponseObj[0].CreationDateTime).to.contain('Z');
                        expect(getDataViewResponseObj[0].ModificationDateTime).to.contain(
                            new Date().toISOString().split('T')[0],
                        );
                        expect(getDataViewResponseObj[0].ModificationDateTime).to.contain('Z');
                        expect(getDataViewResponseObj[0]['Columns']).to.be.an('array');
                        expect(getDataViewResponseObj[0].Fields).to.be.an('array');
                    });

                    it('Get Data View (Grid - by Type and Context) Valid Response', async () => {
                        const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        const testDataView: DataView = await service.postDataView({
                            Type: 'Grid',
                            Title: testDataViewTitle,
                            Hidden: false,
                            Context: {
                                Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                                ScreenSize: 'Tablet',
                                Profile: {
                                    Name: userTypeIDArr[1],
                                },
                            },
                            Fields: [],
                            Columns: [],
                            FrozenColumnsCount: 0,
                            MinimumColumnWidth: 0,
                        });

                        const getDataViewResponseObj: DataView[] = await service.getDataViews({
                            where: `InternalID = '${testDataView.InternalID}'`,
                            //where: 'Type = Grid AND Context.ScreenSize = Tablet AND Context.Profile.Name = Buyer',
                            //where: "Type = 'Grid' AND CreationDateTime = '2019-12-31Z'",
                            //where: "CreationDateTime = '2019-12-31Z'",
                            //where: "Type = 'Grid' AND Title = userTypeIDArr[userTypeIDArr[1]]",
                        });
                        //console.log(getDataViewResponseObj);
                        expect(getDataViewResponseObj[0].InternalID).to.be.above(0);
                        expect(getDataViewResponseObj[0]).to.include({
                            InternalID: testDataView.InternalID,
                            Type: 'Grid',
                            Title: testDataViewTitle,
                            Hidden: false,
                            FrozenColumnsCount: 0,
                            MinimumColumnWidth: 0,
                        });
                        expect(getDataViewResponseObj[0]['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                        expect(getDataViewResponseObj[0]['Context' as any].Profile.InternalID).to.be.above(0);
                        expect(getDataViewResponseObj[0]['Context' as any].Name).to.eql(
                            `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                        );
                        expect(getDataViewResponseObj[0]['Context' as any].ScreenSize).to.eql('Tablet');
                        expect(getDataViewResponseObj[0].CreationDateTime).to.contain('20');
                        expect(getDataViewResponseObj[0].CreationDateTime).to.contain('T');
                        expect(getDataViewResponseObj[0].CreationDateTime).to.contain('Z');
                        expect(getDataViewResponseObj[0].ModificationDateTime).to.contain(
                            new Date().toISOString().split('T')[0],
                        );
                        expect(getDataViewResponseObj[0].ModificationDateTime).to.contain('Z');
                        expect(getDataViewResponseObj[0]['Columns']).to.be.an('array');
                        expect(getDataViewResponseObj[0].Fields).to.be.an('array');
                    });

                    it('Get Data View Where "IN" Valid Response (DI-17834)', async () => {
                        const testDataViewsArr = await service.getDataViews();
                        const dataViewsINArr = await service.getDataViews({
                            where: `InternalID IN (${testDataViewsArr[0].InternalID},${testDataViewsArr[1].InternalID})`,
                        });
                        expect(dataViewsINArr[0].InternalID).to.equal(testDataViewsArr[0].InternalID);
                        expect(dataViewsINArr[1].InternalID).to.equal(testDataViewsArr[1].InternalID);
                    });

                    it('Get Data View Where "LIKE" Valid Response (DI-17865)', async () => {
                        const testDataViewsArr = await service.getDataViews();
                        const dataViewsINArr = await service.getDataViews({
                            where: `Title LIKE '${testDataViewsArr[0].Title}'`,
                        });
                        expect(dataViewsINArr[0].InternalID).to.equal(testDataViewsArr[0].InternalID);
                    });
                });
            });
        }

        //#endregion Endpoints
        //#region Scenarios
        describe('Scenarios', () => {
            describe('Positive', () => {
                if (testConfigObj.isBase) {
                    describe('CRUD Data View (Form - Update: Title, Type, Hidden)', () => {
                        it('Add Data View', async () => {
                            const allDataViewsBefore: DataView[] = await service.getDataViews();
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
                                                Name: userTypeIDArr[0],
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

                                expect(await service.getDataViews())
                                    .to.be.an('array')
                                    .with.lengthOf(allDataViewsBefore.length + 1),
                            ]);
                        });

                        it('Read Data View', async () => {
                            const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                            const testDataView: DataView = await service.postDataView({
                                Type: 'Form',
                                Title: testDataViewTitle,
                                Hidden: false,
                                Context: {
                                    Name: `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                                    ScreenSize: 'Phablet',
                                    Profile: {
                                        Name: userTypeIDArr[0],
                                    },
                                },
                                Fields: [],
                                Rows: [],
                                Columns: [],
                            });

                            const getDataViewResponseObj: DataView[] = await service.getDataViews({
                                where: `InternalID = '${testDataView.InternalID}'`,
                            });
                            expect(getDataViewResponseObj[0].InternalID).to.be.above(0);
                            expect(getDataViewResponseObj[0]).to.include({
                                InternalID: testDataView.InternalID,
                                Type: 'Form',
                                Title: testDataViewTitle,
                                Hidden: false,
                            });
                            expect(getDataViewResponseObj[0]['Context' as any].Profile.Name).to.eql(userTypeIDArr[0]);
                            expect(getDataViewResponseObj[0]['Context' as any].Profile.InternalID).to.be.above(0);
                            expect(getDataViewResponseObj[0]['Context' as any].Name).to.eql(
                                `Oren ${testDataViewTitle}`.replace(/ /gi, '_'),
                            );
                            expect(getDataViewResponseObj[0]['Context' as any].ScreenSize).to.eql('Phablet');
                            expect(getDataViewResponseObj[0].CreationDateTime).to.contain('20');
                            expect(getDataViewResponseObj[0].CreationDateTime).to.contain('T');
                            expect(getDataViewResponseObj[0].CreationDateTime).to.contain('Z');
                            expect(getDataViewResponseObj[0].ModificationDateTime).to.contain(
                                new Date().toISOString().split('T')[0],
                            );
                            expect(getDataViewResponseObj[0].ModificationDateTime).to.contain('Z');
                            expect(getDataViewResponseObj[0]['Columns']).to.be.an('array');
                            expect(getDataViewResponseObj[0]['Rows']).to.be.an('array');
                            expect(getDataViewResponseObj[0].Fields).to.be.an('array');
                        });

                        it('Update the Data View', async () => {
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
                                        Name: userTypeIDArr[0],
                                    },
                                },
                                Fields: [],
                                Rows: [],
                                Columns: [],
                            };

                            const postDataViewResponseObj: DataView = await service.postDataView(testDataView);

                            //Update the new added file
                            const testDataViewNewTitle: string =
                                'Test ' + Math.floor(Math.random() * 1000000).toString();

                            const updatedDataViewObject: DataView = {
                                InternalID: postDataViewResponseObj.InternalID,
                                Type: 'Form',
                                Title: testDataViewNewTitle,
                                Hidden: false,
                                Context: postDataViewResponseObj.Context,
                                Fields: [],
                                Rows: [],
                                Columns: [],
                            };

                            const postUpdatedDataViewResponseObj: DataView = await service.postDataView(
                                updatedDataViewObject,
                            );

                            //Get the current (after the update) data view
                            const getDataViewResponseObj: DataView[] = await service.getDataViews({
                                where: `InternalID = '${postUpdatedDataViewResponseObj.InternalID}'`,
                            });

                            expect(getDataViewResponseObj[0].InternalID).to.be.above(0);
                            expect(getDataViewResponseObj[0]).to.include({
                                InternalID: postUpdatedDataViewResponseObj.InternalID,
                                Type: 'Form',
                                Title: testDataViewNewTitle,
                                Hidden: false,
                            });
                            expect(getDataViewResponseObj[0]['Context' as any].Profile.Name).to.eql(userTypeIDArr[0]);
                            expect(getDataViewResponseObj[0]['Context' as any].Profile.InternalID).to.be.above(0);
                            expect(getDataViewResponseObj[0]['Context' as any].Name).to.eql(
                                postUpdatedDataViewResponseObj['Context' as any].Name,
                            );
                            expect(getDataViewResponseObj[0]['Context' as any].ScreenSize).to.eql('Phablet');
                            expect(getDataViewResponseObj[0].CreationDateTime).to.contain('20');
                            expect(getDataViewResponseObj[0].CreationDateTime).to.contain('T');
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

                    it('Post An Array To Addon Endpoint (DI-16894)', async () => {
                        return expect(service.postDataViewBatch([])).eventually.to.be.an('array').with.lengthOf(0);
                    });
                }

                if (testConfigObj.isPositiveScenarios) {
                    describe('Upsert Data View (Menu) With Partial Context (DI-16770)', () => {
                        it('Upsert Data View witout Context.Object.InternalID', async () => {
                            const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                            const testDataView: DataView = await service.postDataView({
                                Type: 'Menu',
                                Title: testDataViewTitle,
                                Hidden: false,
                                Context: {
                                    Object: {
                                        Resource: 'transactions',
                                        //InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                        Name: transactionsTypeArr[0],
                                    },
                                    Name: 'CartBulkMenu',
                                    ScreenSize: 'Tablet',
                                    Profile: {
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        Name: userTypeIDArr[1],
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
                            expect(testDataView['Context' as any].Object.Resource).to.be.eql('transactions');
                            expect(testDataView['Context' as any].Object.InternalID).to.be.eql(
                                transactionsTypeArr[transactionsTypeArr[0]],
                            );
                            expect(testDataView['Context' as any].Object.Name).to.eql(transactionsTypeArr[0]);
                            expect(testDataView['Context' as any].Name).to.eql('CartBulkMenu');
                            expect(testDataView['Context' as any].ScreenSize).to.eql('Tablet');
                            expect(testDataView['Context' as any].Profile.InternalID).to.be.eql(
                                userTypeIDArr[userTypeIDArr[1]],
                            );
                            expect(testDataView['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                            expect(testDataView.CreationDateTime).to.contain('20');
                            expect(testDataView.CreationDateTime).to.contain('T');
                            expect(testDataView.CreationDateTime).to.contain('Z');
                            expect(testDataView.ModificationDateTime).to.contain(
                                new Date().toISOString().split('T')[0],
                            );
                            expect(testDataView.ModificationDateTime).to.contain('Z');
                            expect(testDataView.Fields).to.be.an('array');
                        });

                        it('Upsert Data View witout Context.Object.Name', async () => {
                            const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                            const testDataView: DataView = await service.postDataView({
                                Type: 'Menu',
                                Title: testDataViewTitle,
                                Hidden: false,
                                Context: {
                                    Object: {
                                        Resource: 'transactions',
                                        InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                        //Name: transactionsTypeArr[0],
                                    },
                                    Name: 'CartBulkMenu',
                                    ScreenSize: 'Tablet',
                                    Profile: {
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        Name: userTypeIDArr[1],
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
                            expect(testDataView['Context' as any].Object.Resource).to.be.eql('transactions');
                            expect(testDataView['Context' as any].Object.InternalID).to.be.eql(
                                transactionsTypeArr[transactionsTypeArr[0]],
                            );
                            expect(testDataView['Context' as any].Object.Name).to.eql(transactionsTypeArr[0]);
                            expect(testDataView['Context' as any].Name).to.eql('CartBulkMenu');
                            expect(testDataView['Context' as any].ScreenSize).to.eql('Tablet');
                            expect(testDataView['Context' as any].Profile.InternalID).to.be.eql(
                                userTypeIDArr[userTypeIDArr[1]],
                            );
                            expect(testDataView['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                            expect(testDataView.CreationDateTime).to.contain('20');
                            expect(testDataView.CreationDateTime).to.contain('T');
                            expect(testDataView.CreationDateTime).to.contain('Z');
                            expect(testDataView.ModificationDateTime).to.contain(
                                new Date().toISOString().split('T')[0],
                            );
                            expect(testDataView.ModificationDateTime).to.contain('Z');
                            expect(testDataView.Fields).to.be.an('array');
                        });

                        it('Upsert Data View witout Context.Profile.InternalID', async () => {
                            const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                            const testDataView: DataView = await service.postDataView({
                                Type: 'Menu',
                                Title: testDataViewTitle,
                                Hidden: false,
                                Context: {
                                    Object: {
                                        Resource: 'transactions',
                                        InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                        Name: transactionsTypeArr[0],
                                    },
                                    Name: 'CartBulkMenu',
                                    ScreenSize: 'Tablet',
                                    Profile: {
                                        //InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        Name: userTypeIDArr[1],
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
                            expect(testDataView['Context' as any].Object.Resource).to.be.eql('transactions');
                            expect(testDataView['Context' as any].Object.InternalID).to.be.eql(
                                transactionsTypeArr[transactionsTypeArr[0]],
                            );
                            expect(testDataView['Context' as any].Object.Name).to.eql(transactionsTypeArr[0]);
                            expect(testDataView['Context' as any].Name).to.eql('CartBulkMenu');
                            expect(testDataView['Context' as any].ScreenSize).to.eql('Tablet');
                            expect(testDataView['Context' as any].Profile.InternalID).to.be.eql(
                                userTypeIDArr[userTypeIDArr[1]],
                            );
                            expect(testDataView['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                            expect(testDataView.CreationDateTime).to.contain('20');
                            expect(testDataView.CreationDateTime).to.contain('T');
                            expect(testDataView.CreationDateTime).to.contain('Z');
                            expect(testDataView.ModificationDateTime).to.contain(
                                new Date().toISOString().split('T')[0],
                            );
                            expect(testDataView.ModificationDateTime).to.contain('Z');
                            expect(testDataView.Fields).to.be.an('array');
                        });

                        it('Upsert Data View witout Context.Profile.Name', async () => {
                            const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                            const testDataView: DataView = await service.postDataView({
                                Type: 'Menu',
                                Title: testDataViewTitle,
                                Hidden: false,
                                Context: {
                                    Object: {
                                        Resource: 'transactions',
                                        InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                        Name: transactionsTypeArr[0],
                                    },
                                    Name: 'CartBulkMenu',
                                    ScreenSize: 'Tablet',
                                    Profile: {
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        //Name: userTypeIDArr[1],
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
                            expect(testDataView['Context' as any].Object.Resource).to.be.eql('transactions');
                            expect(testDataView['Context' as any].Object.InternalID).to.be.eql(
                                transactionsTypeArr[transactionsTypeArr[0]],
                            );
                            expect(testDataView['Context' as any].Object.Name).to.eql(transactionsTypeArr[0]);
                            expect(testDataView['Context' as any].Name).to.eql('CartBulkMenu');
                            expect(testDataView['Context' as any].ScreenSize).to.eql('Tablet');
                            expect(testDataView['Context' as any].Profile.InternalID).to.be.eql(
                                userTypeIDArr[userTypeIDArr[1]],
                            );
                            expect(testDataView['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                            expect(testDataView.CreationDateTime).to.contain('20');
                            expect(testDataView.CreationDateTime).to.contain('T');
                            expect(testDataView.CreationDateTime).to.contain('Z');
                            expect(testDataView.ModificationDateTime).to.contain(
                                new Date().toISOString().split('T')[0],
                            );
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
                            ).eventually.to.be.rejectedWith(
                                'Failed due to exception: Expected either InternalID or Context',
                            );
                        });

                        it('Upsert Data View to be rejected with missing Context.Name', async () => {
                            const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                            return expect(
                                service.postDataView({
                                    Title: testDataViewTitle,
                                    Type: 'Menu',
                                    Context: {},
                                } as any),
                            ).eventually.to.be.rejectedWith(
                                "Failed due to exception: Missing expected field: 'Context.Name'",
                            );
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
                                            InternalID: userTypeIDArr[userTypeIDArr[1]],
                                            Name: userTypeIDArr[1],
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
                                            InternalID: userTypeIDArr[userTypeIDArr[1]],
                                            Name: userTypeIDArr[1],
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
                                            InternalID: userTypeIDArr[userTypeIDArr[1]],
                                            Name: userTypeIDArr[1],
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

                        it('Upsert existing Data View Without Changes', async () => {
                            const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                            return expect(
                                service.postDataView({
                                    Title: testDataViewTitle,
                                    Type: 'Menu',
                                    Context: {
                                        Name: 'CartBulkMenu',
                                        ScreenSize: 'Tablet',
                                        Profile: {
                                            InternalID: userTypeIDArr[userTypeIDArr[1]],
                                            Name: userTypeIDArr[1],
                                        },
                                        Object: {
                                            Resource: 'transactions',
                                            InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                            Name: transactionsTypeArr[0],
                                        },
                                    },
                                }),
                            ).eventually.to.be.fulfilled;
                        });
                    });

                    describe('Upsert Data View (Details) Form Missing Data Members To Data View ', () => {
                        it('Upsert Data View To Be Fulfilled', async () => {
                            const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                            return expect(
                                service.postDataView({
                                    Title: testDataViewTitle,
                                    Type: 'Details',
                                    Context: {
                                        Object: {
                                            Resource: 'transactions',
                                            InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                            Name: transactionsTypeArr[0],
                                        },
                                        Name: 'Test_Details',
                                        ScreenSize: 'Tablet',
                                        Profile: {
                                            InternalID: userTypeIDArr[userTypeIDArr[1]],
                                            Name: userTypeIDArr[1],
                                        },
                                    },
                                }),
                            ).eventually.to.be.fulfilled;
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
                                            InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                            Name: transactionsTypeArr[0],
                                        },
                                        Name: 'Test_Details',
                                        ScreenSize: 'Tablet',
                                        Profile: {
                                            InternalID: userTypeIDArr[userTypeIDArr[1]],
                                            Name: userTypeIDArr[1],
                                        },
                                    },
                                    Fields: [],
                                }),
                            ).eventually.to.be.fulfilled;
                        });

                        it('Upsert Data View (Menu) with Fields', async () => {
                            const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                            const testDataView: DataView = await service.postDataView({
                                Type: 'Menu',
                                Title: testDataViewTitle,
                                Hidden: false,
                                Context: {
                                    Object: {
                                        Resource: 'transactions',
                                        InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                        Name: transactionsTypeArr[0],
                                    },
                                    Name: 'CartBulkMenu',
                                    ScreenSize: 'Tablet',
                                    Profile: {
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        Name: userTypeIDArr[1],
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
                            expect(testDataView['Context' as any].Object.Resource).to.be.eql('transactions');
                            expect(testDataView['Context' as any].Object.InternalID).to.be.eql(
                                transactionsTypeArr[transactionsTypeArr[0]],
                            );
                            expect(testDataView['Context' as any].Object.Name).to.eql(transactionsTypeArr[0]);
                            expect(testDataView['Context' as any].Name).to.eql('CartBulkMenu');
                            expect(testDataView['Context' as any].ScreenSize).to.eql('Tablet');
                            expect(testDataView['Context' as any].Profile.InternalID).to.be.eql(
                                userTypeIDArr[userTypeIDArr[1]],
                            );
                            expect(testDataView['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                            expect(testDataView.CreationDateTime).to.contain('20');
                            expect(testDataView.CreationDateTime).to.contain('T');
                            expect(testDataView.CreationDateTime).to.contain('Z');
                            expect(testDataView.ModificationDateTime).to.contain(
                                new Date().toISOString().split('T')[0],
                            );
                            expect(testDataView.ModificationDateTime).to.contain('Z');
                            expect(testDataView.Fields).to.be.an('array');
                            expect(testDataView['Fields' as any][0]).to.include({
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
                            Hidden: false,
                            Context: {
                                Object: {
                                    Resource: 'activities',
                                    InternalID: activitiesTypeArr[activitiesTypeArr[0]],
                                    Name: activitiesTypeArr[0],
                                },
                                Name: 'Testing_Map_123456',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: userTypeIDArr[userTypeIDArr[1]],
                                    Name: userTypeIDArr[1],
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
                        expect(testDataView['Context' as any].Object.Resource).to.be.eql('activities');
                        expect(testDataView['Context' as any].Object.InternalID).to.be.eql(
                            activitiesTypeArr[activitiesTypeArr[0]],
                        );
                        expect(testDataView['Context' as any].Object.Name).to.eql(activitiesTypeArr[0]);
                        expect(testDataView['Context' as any].Name).to.eql('Testing_Map_123456');
                        expect(testDataView['Context' as any].ScreenSize).to.eql('Tablet');
                        expect(testDataView['Context' as any].Profile.InternalID).to.be.eql(
                            userTypeIDArr[userTypeIDArr[1]],
                        );
                        expect(testDataView['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                        expect(testDataView.CreationDateTime).to.contain('20');
                        expect(testDataView.CreationDateTime).to.contain('T');
                        expect(testDataView.CreationDateTime).to.contain('Z');
                        expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                        expect(testDataView.ModificationDateTime).to.contain('Z');
                        expect(testDataView.Fields).to.be.an('array');
                        expect(testDataView['Fields' as any][0]).to.include({
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
                            Hidden: true,
                            Context: {
                                Object: {
                                    Resource: 'activities',
                                    InternalID: activitiesTypeArr[activitiesTypeArr[0]],
                                    Name: activitiesTypeArr[0],
                                },
                                Name: 'Testing_Grid_123456',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: userTypeIDArr[userTypeIDArr[1]],
                                    Name: userTypeIDArr[1],
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
                            Hidden: true,
                            FrozenColumnsCount: 0,
                            MinimumColumnWidth: 0,
                        });
                        expect(testDataView['Context' as any].Object.Resource).to.be.eql('activities');
                        expect(testDataView['Context' as any].Object.InternalID).to.be.eql(
                            activitiesTypeArr[activitiesTypeArr[0]],
                        );
                        expect(testDataView['Context' as any].Object.Name).to.eql(activitiesTypeArr[0]);
                        expect(testDataView['Context' as any].Name).to.eql('Testing_Grid_123456');
                        expect(testDataView['Context' as any].ScreenSize).to.eql('Tablet');
                        expect(testDataView['Context' as any].Profile.InternalID).to.be.eql(
                            userTypeIDArr[userTypeIDArr[1]],
                        );
                        expect(testDataView['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                        expect(testDataView.CreationDateTime).to.contain('20');
                        expect(testDataView.CreationDateTime).to.contain('T');
                        expect(testDataView.CreationDateTime).to.contain('Z');
                        expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                        expect(testDataView.ModificationDateTime).to.contain('Z');
                        expect(testDataView.Fields).to.be.an('array');
                        expect(testDataView['Fields' as any][0]).to.include({
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

                    //This was manually removed from the DB by Ido in 04/02/2021 in atempt to remove "trash" from the DB,
                    //So this will no longer be executed but this should stay here in case this bug will ever be reopen and then this test will be useful
                    // if (clientService.getClientData('UserEmail').includes('oren.v@')) {
                    //     it('Get Existing Data View With Hidden ATD (DI-16826)', async () => {
                    //         const testDataViewArr: DataView[] = await service.getDataViews({
                    //             where: 'InternalID = 4067228',
                    //             include_deleted: true,
                    //         });
                    //         const testDataView = testDataViewArr[0];
                    //         expect(testDataView).to.include({
                    //             InternalID: 4067228,
                    //             Type: 'Menu',
                    //             Title: 'Rep', //userTypeIDArr[1], //Need to fix this Oren
                    //             Hidden: true,
                    //         });
                    //         expect(testDataView['Context' as any].Object.Resource).to.be.eql('transactions');
                    //         expect(testDataView['Context' as any].Object.InternalID).to.be.eql(271439);
                    //         expect(testDataView['Context' as any].Object.Name).to.eql('new');
                    //         expect(testDataView['Context' as any].Name).to.eql('CartBulkMenu');
                    //         expect(testDataView['Context' as any].ScreenSize).to.eql('Tablet');
                    //         expect(testDataView['Context' as any].Profile.InternalID).to.be.eql(67773); //userTypeIDArr[userTypeIDArr[1]]); //Need to fix this Oren
                    //         expect(testDataView['Context' as any].Profile.Name).to.eql('Rep'); //userTypeIDArr[1]); //Need to fix this Oren
                    //         expect(testDataView.CreationDateTime).to.contain('20');
                    //         expect(testDataView.CreationDateTime).to.contain('T');
                    //         expect(testDataView.CreationDateTime).to.contain('Z');
                    //         expect(testDataView.ModificationDateTime).to.contain('Z');
                    //         expect(testDataView.Fields).to.be.an('array');
                    //         expect(testDataView['Fields' as any][0]).to.include({
                    //             FieldID: 'Delete',
                    //             Title: 'Delete',
                    //         });
                    //         expect(testDataView['Fields' as any][1]).to.include({
                    //             FieldID: 'Edit',
                    //             Title: 'Edit',
                    //         });
                    //     });
                    // }

                    it('Upsert Data View (Large) (DI-16874)', async () => {
                        const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        const testDataView: DataView = await service.postDataView({
                            Type: 'Large',
                            Title: testDataViewTitle,
                            Hidden: false,
                            Context: {
                                Object: {
                                    Resource: 'transactions',
                                    InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                    Name: transactionsTypeArr[0],
                                },
                                Name: 'OrderCenterVariant',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: userTypeIDArr[userTypeIDArr[1]],
                                    Name: userTypeIDArr[1],
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
                        expect(testDataView['Context' as any].Object.Resource).to.be.eql('transactions');
                        expect(testDataView['Context' as any].Object.InternalID).to.be.eql(
                            transactionsTypeArr[transactionsTypeArr[0]],
                        );
                        expect(testDataView['Context' as any].Object.Name).to.eql(transactionsTypeArr[0]);
                        expect(testDataView['Context' as any].Name).to.eql('OrderCenterVariant');
                        expect(testDataView['Context' as any].ScreenSize).to.eql('Tablet');
                        expect(testDataView['Context' as any].Profile.InternalID).to.be.eql(
                            userTypeIDArr[userTypeIDArr[1]],
                        );
                        expect(testDataView['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                        expect(testDataView.CreationDateTime).to.contain('20');
                        expect(testDataView.CreationDateTime).to.contain('T');
                        expect(testDataView.CreationDateTime).to.contain('Z');
                        expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                        expect(testDataView.ModificationDateTime).to.contain('Z');
                        expect(testDataView.Fields).to.be.an('array');
                        expect(testDataView['Fields' as any][0]).to.be.undefined;
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
                            Hidden: false,
                            Context: {
                                Object: {
                                    Resource: 'transactions',
                                    InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                    Name: transactionsTypeArr[0],
                                },
                                Name: 'Line_Creation_Test',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: userTypeIDArr[userTypeIDArr[1]],
                                    Name: userTypeIDArr[1],
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
                        expect(testDataView['Context' as any].Object.Resource).to.be.eql('transactions');
                        expect(testDataView['Context' as any].Object.InternalID).to.be.eql(
                            transactionsTypeArr[transactionsTypeArr[0]],
                        );
                        expect(testDataView['Context' as any].Object.Name).to.eql(transactionsTypeArr[0]);
                        expect(testDataView['Context' as any].Name).to.eql('Line_Creation_Test');
                        expect(testDataView['Context' as any].ScreenSize).to.eql('Tablet');
                        expect(testDataView['Context' as any].Profile.InternalID).to.be.eql(
                            userTypeIDArr[userTypeIDArr[1]],
                        );
                        expect(testDataView['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                        expect(testDataView.CreationDateTime).to.contain('20');
                        expect(testDataView.CreationDateTime).to.contain('T');
                        expect(testDataView.CreationDateTime).to.contain('Z');
                        expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                        expect(testDataView.ModificationDateTime).to.contain('Z');
                        expect(testDataView.Fields).to.be.an('array');
                        expect(testDataView['Fields' as any][0]).to.be.undefined;
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
                            Hidden: false,
                            Context: {
                                Object: {
                                    Resource: 'transactions',
                                    InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                    Name: transactionsTypeArr[0],
                                },
                                Name: 'CardsGrid_Creation_Test',
                                ScreenSize: 'Tablet',
                                Profile: {
                                    InternalID: userTypeIDArr[userTypeIDArr[1]],
                                    Name: userTypeIDArr[1],
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
                        expect(testDataView['Context' as any].Object.Resource).to.be.eql('transactions');
                        expect(testDataView['Context' as any].Object.InternalID).to.be.eql(
                            transactionsTypeArr[transactionsTypeArr[0]],
                        );
                        expect(testDataView['Context' as any].Object.Name).to.eql(transactionsTypeArr[0]);
                        expect(testDataView['Context' as any].Name).to.eql('CardsGrid_Creation_Test');
                        expect(testDataView['Context' as any].ScreenSize).to.eql('Tablet');
                        expect(testDataView['Context' as any].Profile.InternalID).to.be.eql(
                            userTypeIDArr[userTypeIDArr[1]],
                        );
                        expect(testDataView['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                        expect(testDataView.CreationDateTime).to.contain('20');
                        expect(testDataView.CreationDateTime).to.contain('T');
                        expect(testDataView.CreationDateTime).to.contain('Z');
                        expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                        expect(testDataView.ModificationDateTime).to.contain('Z');
                        expect(testDataView.Fields).to.be.an('array');
                        expect(testDataView['Fields' as any][0]).to.be.undefined;
                        expect(testDataView['Columns']).to.be.an('array');
                        expect(testDataView['Columns'][0]).to.be.undefined;
                        expect(testDataView['Rows']).to.be.an('array');
                        expect(testDataView['Rows'][0]).to.be.undefined;
                    });

                    it('Insert New Data View (Configuration) With Non Existing Context.Name (DI-16868)', async () => {
                        const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        const testDataView: DataView = await service.postDataView({
                            Type: 'Configuration',
                            Title: testDataViewTitle,
                            Hidden: false,
                            Context: {
                                Object: {
                                    Resource: 'activities',
                                    InternalID: activitiesTypeArr[activitiesTypeArr[0]],
                                },
                                Name: 'Oren_Test_12345',
                                ScreenSize: 'Landscape',
                                Profile: {
                                    InternalID: userTypeIDArr[userTypeIDArr[1]],
                                },
                            },
                        });
                        expect(testDataView.InternalID).to.be.above(0);
                        expect(testDataView).to.include({
                            InternalID: testDataView.InternalID,
                            Type: 'Configuration',
                            Title: testDataViewTitle,
                            Hidden: false,
                        });
                        expect(testDataView['Context' as any].Object.Resource).to.be.eql('activities');
                        expect(testDataView['Context' as any].Object.InternalID).to.be.eql(
                            activitiesTypeArr[activitiesTypeArr[0]],
                        );
                        expect(testDataView['Context' as any].Object.Name).to.eql(activitiesTypeArr[0]);
                        expect(testDataView['Context' as any].Name).to.eql('Oren_Test_12345');
                        expect(testDataView['Context' as any].ScreenSize).to.eql('Landscape');
                        expect(testDataView['Context' as any].Profile.InternalID).to.be.eql(
                            userTypeIDArr[userTypeIDArr[1]],
                        );
                        expect(testDataView['Context' as any].Profile.Name).to.eql(userTypeIDArr[1]);
                        expect(testDataView.CreationDateTime).to.contain('20');
                        expect(testDataView.CreationDateTime).to.contain('T');
                        expect(testDataView.CreationDateTime).to.contain('Z');
                        expect(testDataView.ModificationDateTime).to.contain(new Date().toISOString().split('T')[0]);
                        expect(testDataView.ModificationDateTime).to.contain('Z');
                    });
                }
            });

            describe('Negative', () => {
                if (testConfigObj.isBase) {
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
                                        Name: userTypeIDArr[1],
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
                                        Name: undefined, //(#Negative)userTypeIDArr[userTypeIDArr[1]],
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
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
                                Rows: [],
                                Columns: [],
                            }),
                        ).eventually.to.be.rejectedWith(
                            "Failed due to exception: Missing expected field: 'Context.Name'",
                        );
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
                                        Name: userTypeIDArr[1],
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
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
                                Rows: [],
                                Columns: [],
                            }),
                        ).eventually.to.be.rejectedWith("Failed due to exception: Missing expected field: 'Type'");
                    });
                }

                if (testConfigObj.isNegativeScenarios) {
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
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
                            }),
                        ).eventually.to.be.rejectedWith(
                            "Failed due to exception: Missing expected field: 'Context.Object'",
                        );
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
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
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
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                    },
                                },
                                Fields: [],
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
                                        Name: 'activitiesTypeArr[0]',
                                    },
                                    Name: 'ActivityProfilePermission ',
                                    ScreenSize: 'Landscape',
                                    Profile: {
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
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
                                        Name: 'activitiesTypeArr[0]',
                                    },
                                    Name: 'WebAppMainBar',
                                    ScreenSize: 'Landscape',
                                    Profile: {
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
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
                                        Name: undefined, //(#Negative)userTypeIDArr[userTypeIDArr[1]],
                                    },
                                },
                                Fields: [],
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
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
                            }),
                        ).eventually.to.be.rejectedWith(
                            "Failed due to exception: Missing expected field: 'Context.Name'",
                        );
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
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
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
                                        Name: userTypeIDArr[1],
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
                                    Name: userTypeIDArr[1],
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
                                    Name: postDataViewResponseObj['Context' as any].Name,
                                    ScreenSize: 'Phablet',
                                    Profile: {
                                        Name: userTypeIDArr[1],
                                    },
                                },
                            }),
                        ).eventually.to.be.rejectedWith(
                            `Failed due to exception: The Context sent does not match the existing Context. Expected: {\\"Name\\":\\"${
                                postDataViewResponseObj['Context' as any].Name
                            }\\",\\"ScreenSize\\":\\"Phablet\\",`,
                        );
                    });

                    it('Upsert Data View (Configuration) With Wrong Context.Object (DI-16872)', async () => {
                        const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        return expect(
                            service.postDataView({
                                Type: 'Configuration',
                                Title: testDataViewTitle,
                                Context: {
                                    Object: {
                                        Resource: 'transactions',
                                        InternalID: 268421, //8
                                    },
                                    Name: 'OrderCartSmartSearch',
                                    ScreenSize: 'Landscape',
                                    Profile: {
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
                            }),
                        ).eventually.to.be.rejectedWith(
                            `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Object with InternalID = 268421 for Resource = 'transactions' not found"`,
                        );
                    });

                    it('Validate Improvment To OrderCartSmartSearch (DI-17565)', async () => {
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
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
                            }),
                        ).eventually.to.be.rejectedWith(
                            `failed with status: 400 - Bad Request error: {"fault":{"faultstring":"Failed due to exception: Expected Type = 'Configuration' for Context.Name = 'OrderCartSmartSearch'`,
                        );
                    });

                    it('Upsert Data View (Card) With Missing Non-Mandatory Field Valid Response (DI-16807 and DI-16870)', async () => {
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
                                            Name: userTypeIDArr[1],
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
                                            Name: userTypeIDArr[1],
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
                                        Name: userTypeIDArr[1],
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
                                        Name: userTypeIDArr[1],
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
                                        Name: userTypeIDArr[1],
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
                                        Name: transactionsTypeArr[0],
                                    },
                                    Name: 'OrderViewsMenu',
                                    ScreenSize: 'Landscape',
                                    Profile: {
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
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
                                        Name: transactionsTypeArr[0],
                                    },
                                    Name: 'OrderViewsMenu',
                                    ScreenSize: 'Landscape',
                                    Profile: {
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
                            }),
                        ).eventually.to.be.rejectedWith(
                            'Failed due to exception: DataView with InternalID = 488642612 does not exist',
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
                                        InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                        Name: transactionsTypeArr[0],
                                    },
                                    Name: 'CartBulkMenu',
                                    ScreenSize: 'Tablet',
                                    Profile: {
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [
                                    {
                                        FieldID: '123456',
                                        //Title: "hello"
                                    },
                                ],
                            } as any),
                        ).eventually.to.be.rejectedWith(
                            "Failed due to exception: Missing expected field: 'Fields[0].Title'",
                        );
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
                                        InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                        Name: transactionsTypeArr[0],
                                    },
                                    Name: 'CartBulkMenu',
                                    ScreenSize: 'Tablet',
                                    Profile: {
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [
                                    {
                                        //FieldID: "123456",
                                        Title: 'hello',
                                    } as any,
                                ],
                            }),
                        ).eventually.to.be.rejectedWith(
                            "Failed due to exception: Missing expected field: 'Fields[0].FieldID'",
                        );
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
                                        InternalID: activitiesTypeArr[activitiesTypeArr[0]],
                                        Name: activitiesTypeArr[0],
                                    },
                                    Name: 'Testing_Map_123456',
                                    ScreenSize: 'Tablet',
                                    Profile: {
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        Name: userTypeIDArr[1],
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
                                        InternalID: activitiesTypeArr[activitiesTypeArr[0]],
                                        Name: activitiesTypeArr[0],
                                    },
                                    Name: 'Testing_Grid_123456',
                                    ScreenSize: 'Tablet',
                                    Profile: {
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        Name: userTypeIDArr[1],
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
                                        InternalID: activitiesTypeArr[activitiesTypeArr[0]],
                                        Name: activitiesTypeArr[0],
                                    },
                                    Name: 'Testing_Grid_123456',
                                    ScreenSize: 'Tablet',
                                    Profile: {
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        Name: userTypeIDArr[1],
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

                    it("Upsert Data View (Large) with wrong 'Context.Name' (DI-16874)", async () => {
                        const testDataViewTitle: string = 'Test ' + Math.floor(Math.random() * 1000000).toString();
                        return expect(
                            service.postDataView({
                                Type: 'Large',
                                Title: testDataViewTitle,
                                Hidden: false,
                                Context: {
                                    Object: {
                                        Resource: 'transactions',
                                        InternalID: transactionsTypeArr[transactionsTypeArr[0]],
                                        Name: transactionsTypeArr[0],
                                    },
                                    Name: 'Large_Creation_Test',
                                    ScreenSize: 'Tablet',
                                    Profile: {
                                        InternalID: userTypeIDArr[userTypeIDArr[1]],
                                        Name: userTypeIDArr[1],
                                    },
                                },
                                Fields: [],
                                Columns: [],
                                Rows: [],
                            }),
                        ).eventually.to.be.rejectedWith(
                            "Failed due to exception: Expected field: 'Context.Name' to be of one of: OrderCenterItemFullPage, OrderCenterVariant",
                        );
                    });

                    it('Try to changed a Data View from Form to Card', async () => {
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
                                    Name: userTypeIDArr[0],
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

                        //Get the current (after the update) data view
                        return expect(service.postDataView(updatedDataViewObject)).eventually.to.be.rejectedWith(
                            "Failed due to exception: DataView Type can't be changed from Form to Card",
                        );
                    });
                }
            });
        });

        //#endregion Scenarios

        describe('Test Clean Up (Hidden = true)', () => {
            it('All The Data Views Hidden', async () => {
                const dataViewCounter: number = await (await service.getDataViews()).length;
                return Promise.all([
                    await expect(TestCleanUp(service)).eventually.to.be.above(0),
                    await expect((await service.getDataViews()).length).to.be.below(dataViewCounter),
                ]);
            });
        });
    });
    //#endregion Tests
}

//Service Functions
//Remove all test data views (Hidden = true)
async function TestCleanUp(service: DataViewsService) {
    const allDataViewObjects: DataView[] = await service.getDataViews();
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
