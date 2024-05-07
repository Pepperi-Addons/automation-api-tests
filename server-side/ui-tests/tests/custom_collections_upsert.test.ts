import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { UDCService } from '../../services/user-defined-collections.service';

chai.use(promised);

export async function CustomCollectionsUpsert(
    email: string,
    client: Client,
    acc01UUID: string,
    acc02UUID: string,
    acc03UUID: string,
    udcNameAge: string,
    udcIndexedNameAge: string,
    udcIndexedFields: string,
    udcArrays: string,
    udcReferenceAccount: string,
    udcAccountFilter: string,
    udcFiltersRefAccount: string,
    udcBigDataRefAccount: string,
    udcContainedArray: string,
) {
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const coreResourcesUUID = 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f';

    describe(`User Defined Collections : Creating & Adding Data | On User: ${email} | Test Suite`, () => {
        describe('API Creation of UDCs', () => {
            /********************  Collections Creation  ********************/

            udcContainedArray == 'true' &&
                it('0. Creating UDC of "Scheme Only" with API', async () => {
                    // Collection:  ====>   SchemeOnlyObjectAuto   <====        //
                    const bodyOfCollection = udcService.prepareDataForUdcCreation({
                        nameOfCollection: 'SchemeOnlyObjectAuto',
                        descriptionOfCollection: 'Created with Automation',
                        fieldsOfCollection: [
                            {
                                classType: 'Primitive',
                                fieldName: 'name',
                                fieldTitle: 'Name',
                                field: {
                                    Type: 'String',
                                    Description: '',
                                    AddonUUID: '',
                                    ApplySystemFilter: false,
                                    Mandatory: false,
                                    Indexed: false,
                                },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'age',
                                fieldTitle: 'Age',
                                field: {
                                    Type: 'Integer',
                                    Description: '',
                                    AddonUUID: '',
                                    ApplySystemFilter: false,
                                    Mandatory: false,
                                    Indexed: false,
                                },
                            },
                        ],
                        typeOfCollection: 'contained',
                        syncDefinitionOfCollection: { Sync: false },
                    });
                    const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
                    console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);

                    expect(upsertResponse.Ok).to.be.true;
                    expect(upsertResponse.Status).to.equal(200);
                    expect(upsertResponse.Error).to.eql({});
                });

            udcNameAge == 'true' &&
                it('1. Creating a UDC of "Name Age" with API', async () => {
                    // Collection:  ====>   NameAgeAuto   <====        //
                    const bodyOfCollection = udcService.prepareDataForUdcCreation({
                        nameOfCollection: 'NameAgeAuto',
                        descriptionOfCollection: 'Created with Automation',
                        fieldsOfCollection: [
                            {
                                classType: 'Primitive',
                                fieldName: 'name',
                                fieldTitle: '',
                                field: { Type: 'String', Mandatory: false, Indexed: false, Description: '' },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'age',
                                fieldTitle: '',
                                field: { Type: 'Integer', Mandatory: false, Indexed: false, Description: '' },
                            },
                        ],
                    });
                    const upsertCollecionResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
                    console.info(`upsertCollecionResponse: ${JSON.stringify(upsertCollecionResponse, null, 2)}`);
                });

            udcIndexedNameAge == 'true' &&
                it('2. Creating a UDC of "Indexed Name Age" with API', async () => {
                    // Collection:  ====>   IndexedNameAgeAuto   <====        //
                    const bodyOfCollection = udcService.prepareDataForUdcCreation({
                        nameOfCollection: 'IndexedNameAgeAuto',
                        descriptionOfCollection: 'Created with Automation',
                        fieldsOfCollection: [
                            {
                                classType: 'Primitive',
                                fieldName: 'name',
                                fieldTitle: '',
                                field: { Type: 'String', Mandatory: false, Indexed: true, Description: '' },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'age',
                                fieldTitle: '',
                                field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
                            },
                        ],
                        syncDefinitionOfCollection: { Sync: false },
                    });
                    const upsertCollecionResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
                    console.info(`upsertCollecionResponse: ${JSON.stringify(upsertCollecionResponse, null, 2)}`);
                });

            udcIndexedFields == 'true' &&
                it('3. Creating a UDC of "Indexed Fields" with API', async () => {
                    // Collection:  ====>   IndexedFieldsAuto   <====        //
                    const bodyOfCollection = udcService.prepareDataForUdcCreation({
                        nameOfCollection: 'IndexedFieldsAuto',
                        descriptionOfCollection: 'Created with Automation',
                        fieldsOfCollection: [
                            {
                                classType: 'Primitive',
                                fieldName: 'item',
                                fieldTitle: '',
                                field: { Type: 'String', Mandatory: false, Indexed: true, Description: '' },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'price',
                                fieldTitle: '',
                                field: { Type: 'Double', Mandatory: false, Indexed: true, Description: '' },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'quantity',
                                fieldTitle: '',
                                field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'instock',
                                fieldTitle: '',
                                field: { Type: 'Bool', Mandatory: false, Indexed: true, Description: '' },
                            },
                        ],
                    });
                    const upsertCollecionResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
                    console.info(`upsertCollecionResponse: ${JSON.stringify(upsertCollecionResponse, null, 2)}`);
                });

            udcArrays == 'true' &&
                it('4. Creating UDC of "Arrays of Primiteve Types Fields" with API', async () => {
                    //  Strings Array  |  Integers Array  |  Doubles Array  //
                    const bodyOfCollection = udcService.prepareDataForUdcCreation({
                        nameOfCollection: 'ArraysOfPrimitivesAuto',
                        descriptionOfCollection: 'Created with Automation',
                        fieldsOfCollection: [
                            {
                                classType: 'Array',
                                fieldName: 'names',
                                fieldTitle: 'Names',
                                field: {
                                    Type: 'String',
                                    Description: 'list of products',
                                    AddonUUID: '',
                                    ApplySystemFilter: false,
                                    Mandatory: false,
                                    Indexed: false,
                                },
                            },
                            {
                                classType: 'Array',
                                fieldName: 'numbers',
                                fieldTitle: 'Numbers',
                                field: {
                                    Type: 'Integer',
                                    Description: 'in stock quantity',
                                    AddonUUID: '',
                                    ApplySystemFilter: false,
                                    Mandatory: false,
                                    Indexed: false,
                                },
                            },
                            {
                                classType: 'Array',
                                fieldName: 'reals',
                                fieldTitle: 'Reals',
                                field: {
                                    Type: 'Double',
                                    Description: 'average items sold per month',
                                    AddonUUID: '',
                                    ApplySystemFilter: false,
                                    Mandatory: false,
                                    Indexed: false,
                                },
                            },
                        ],
                    });
                    const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
                    console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);

                    expect(upsertResponse.Ok).to.be.true;
                    expect(upsertResponse.Status).to.equal(200);
                    expect(upsertResponse.Error).to.eql({});
                });

            udcReferenceAccount == 'true' &&
                it('5. Creating a UDC of "Reference Account" with API', async () => {
                    // Collection:  ====>   ReferenceAccountAuto   <====        //
                    const bodyOfCollection = udcService.prepareDataForUdcCreation({
                        nameOfCollection: 'ReferenceAccountAuto',
                        descriptionOfCollection: 'Created with Automation',
                        fieldsOfCollection: [
                            {
                                classType: 'Resource',
                                fieldName: 'of_account',
                                fieldTitle: '',
                                field: {
                                    Type: 'Resource',
                                    Resource: 'accounts',
                                    Description: '',
                                    Mandatory: false,
                                    Indexed: true,
                                    IndexedFields: {
                                        Email: { Indexed: true, Type: 'String' },
                                        Name: { Indexed: true, Type: 'String' },
                                        UUID: { Indexed: true, Type: 'String' },
                                    },
                                    Items: { Description: '', Mandatory: false, Type: 'String' },
                                    OptionalValues: [],
                                    AddonUUID: coreResourcesUUID,
                                },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'best_seller_item',
                                fieldTitle: '',
                                field: {
                                    Type: 'String',
                                    Description: '',
                                    AddonUUID: '',
                                    ApplySystemFilter: false,
                                    Mandatory: false,
                                    Indexed: false,
                                    IndexedFields: {},
                                    OptionalValues: [
                                        'A',
                                        'B',
                                        'C',
                                        'D',
                                        'Hair dryer',
                                        'Roller',
                                        'Cart',
                                        'Mask',
                                        'Shirt',
                                        '',
                                    ],
                                },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'max_quantity',
                                fieldTitle: '',
                                field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'discount_rate',
                                fieldTitle: '',
                                field: { Type: 'Double', Mandatory: false, Indexed: false, Description: '' },
                            },
                            {
                                classType: 'Array',
                                fieldName: 'offered_discount_location',
                                fieldTitle: '',
                                field: {
                                    Type: 'String',
                                    Mandatory: false,
                                    Indexed: false,
                                    Description: '',
                                    OptionalValues: ['store', 'on-line', 'rep'],
                                },
                            },
                        ],
                    });
                    const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
                    console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);
                    expect(upsertResponse.Ok).to.be.true;
                    expect(upsertResponse.Status).to.equal(200);
                    expect(upsertResponse.Error).to.eql({});
                });

            udcAccountFilter == 'true' &&
                it('6. Creating a UDC of "Account Filter Reference Account" with API', async () => {
                    // Collection:  ====>   AccountFilterReferenceAccountAuto   <====        //
                    const bodyOfCollection = udcService.prepareDataForUdcCreation({
                        nameOfCollection: 'AccountFilterReferenceAccountAuto',
                        descriptionOfCollection: 'Created with Automation',
                        fieldsOfCollection: [
                            {
                                classType: 'Resource',
                                fieldName: 'an_account',
                                fieldTitle: '',
                                field: {
                                    Type: 'Resource',
                                    Resource: 'accounts',
                                    Description: '',
                                    Mandatory: false,
                                    Indexed: true,
                                    ApplySystemFilter: true,
                                    IndexedFields: {
                                        Email: { Indexed: true, Type: 'String' },
                                        Name: { Indexed: true, Type: 'String' },
                                        UUID: { Indexed: true, Type: 'String' },
                                    },
                                    Items: { Description: '', Mandatory: false, Type: 'String' },
                                    OptionalValues: [],
                                    AddonUUID: coreResourcesUUID,
                                },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'best_seller_item',
                                fieldTitle: '',
                                field: {
                                    Type: 'String',
                                    Description: '',
                                    AddonUUID: '',
                                    ApplySystemFilter: false,
                                    Mandatory: false,
                                    Indexed: false,
                                    IndexedFields: {},
                                    OptionalValues: [
                                        'A',
                                        'B',
                                        'C',
                                        'D',
                                        'Hair dryer',
                                        'Roller',
                                        'Cart',
                                        'Mask',
                                        'Shirt',
                                        '',
                                    ],
                                },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'max_quantity',
                                fieldTitle: '',
                                field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'discount_rate',
                                fieldTitle: '',
                                field: { Type: 'Double', Mandatory: false, Indexed: false, Description: '' },
                            },
                            {
                                classType: 'Array',
                                fieldName: 'offered_discount_location',
                                fieldTitle: '',
                                field: {
                                    Type: 'String',
                                    Mandatory: false,
                                    Indexed: false,
                                    Description: '',
                                    OptionalValues: ['store', 'on-line', 'rep'],
                                },
                            },
                        ],
                    });
                    const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
                    console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);
                });

            udcFiltersRefAccount == 'true' &&
                it('7. Creating a UDC of "Filters Account Ref" with API', async () => {
                    // Collection:  ====>   FiltersAccRefAuto   <====        //
                    const bodyOfCollection = udcService.prepareDataForUdcCreation({
                        nameOfCollection: 'FiltersAccRefAuto',
                        descriptionOfCollection: 'Created with Automation',
                        fieldsOfCollection: [
                            {
                                classType: 'Resource',
                                fieldName: 'from_account',
                                fieldTitle: '',
                                field: {
                                    Type: 'Resource',
                                    Resource: 'accounts',
                                    Description: '',
                                    Mandatory: false,
                                    Indexed: true,
                                    IndexedFields: {
                                        Email: { Indexed: true, Type: 'String' },
                                        Name: { Indexed: true, Type: 'String' },
                                        UUID: { Indexed: true, Type: 'String' },
                                    },
                                    Items: { Description: '', Mandatory: false, Type: 'String' },
                                    OptionalValues: [],
                                    AddonUUID: coreResourcesUUID,
                                },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'item',
                                fieldTitle: '',
                                field: { Type: 'String', Mandatory: false, Indexed: true, Description: '' },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'price',
                                fieldTitle: '',
                                field: { Type: 'Double', Mandatory: false, Indexed: true, Description: '' },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'quantity',
                                fieldTitle: '',
                                field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'instock',
                                fieldTitle: '',
                                field: { Type: 'Bool', Mandatory: false, Indexed: true, Description: '' },
                            },
                        ],
                    });
                    const upsertCollecionResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
                    console.info(`upsertCollecionResponse: ${JSON.stringify(upsertCollecionResponse, null, 2)}`);
                    expect(upsertCollecionResponse.Ok).to.be.true;
                    expect(upsertCollecionResponse.Status).to.equal(200);
                    expect(upsertCollecionResponse.Error).to.eql({});
                });

            udcBigDataRefAccount == 'true' &&
                it('8. Creating a UDC of "Big Data Reference Account" with API', async () => {
                    // Collection:  ====>   BigDataReferenceAccountAuto   <====        //
                    const bodyOfCollection = udcService.prepareDataForUdcCreation({
                        nameOfCollection: 'BigDataReferenceAccountAuto',
                        descriptionOfCollection: 'Created with Automation',
                        fieldsOfCollection: [
                            {
                                classType: 'Resource',
                                fieldName: 'in_account',
                                fieldTitle: '',
                                field: {
                                    Type: 'Resource',
                                    Resource: 'accounts',
                                    Description: '',
                                    Mandatory: false,
                                    Indexed: true,
                                    IndexedFields: {
                                        Email: { Indexed: true, Type: 'String' },
                                        Name: { Indexed: true, Type: 'String' },
                                        UUID: { Indexed: true, Type: 'String' },
                                    },
                                    Items: { Description: '', Mandatory: false, Type: 'String' },
                                    OptionalValues: [],
                                    AddonUUID: coreResourcesUUID,
                                },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'best_seller_item',
                                fieldTitle: '',
                                field: {
                                    Type: 'String',
                                    Description: '',
                                    AddonUUID: '',
                                    ApplySystemFilter: false,
                                    Mandatory: false,
                                    Indexed: false,
                                    IndexedFields: {},
                                    OptionalValues: [
                                        'A',
                                        'B',
                                        'C',
                                        'D',
                                        'Hair dryer',
                                        'Roller',
                                        'Cart',
                                        'Mask',
                                        'Shirt',
                                        '',
                                    ],
                                },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'max_quantity',
                                fieldTitle: '',
                                field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
                            },
                            {
                                classType: 'Primitive',
                                fieldName: 'discount_rate',
                                fieldTitle: '',
                                field: { Type: 'Double', Mandatory: false, Indexed: false, Description: '' },
                            },
                            {
                                classType: 'Array',
                                fieldName: 'offered_discount_location',
                                fieldTitle: '',
                                field: {
                                    Type: 'String',
                                    Mandatory: false,
                                    Indexed: false,
                                    Description: '',
                                    OptionalValues: ['store', 'on-line', 'rep'],
                                },
                            },
                        ],
                    });
                    const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
                    console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);
                });

            udcContainedArray == 'true' &&
                it('9. Creating UDC of "Contained Array" with API', async () => {
                    // Collection:  ====>   ContainedArrayAuto   <====        //
                    const bodyOfCollection = udcService.prepareDataForUdcCreation({
                        nameOfCollection: 'ContainedArrayAuto',
                        descriptionOfCollection: 'Created with Automation',
                        fieldsOfCollection: [
                            {
                                classType: 'Primitive',
                                fieldName: 'title',
                                fieldTitle: 'Title',
                                field: {
                                    Type: 'String',
                                    Description: '',
                                    AddonUUID: '',
                                    ApplySystemFilter: false,
                                    Mandatory: false,
                                    Indexed: false,
                                },
                            },
                            {
                                classType: 'ContainedArray',
                                fieldName: 'contained_scheme_only_name_age',
                                fieldTitle: 'Name Age scheme',
                                field: {
                                    Type: 'Array',
                                    Description: '',
                                    AddonUUID: '',
                                    ApplySystemFilter: false,
                                    Mandatory: false,
                                    Indexed: false,
                                    Resource: 'SchemeOnlyObjectAuto',
                                    Sync: false,
                                },
                            },
                        ],
                        typeOfCollection: 'data',
                        syncDefinitionOfCollection: { Sync: false },
                    });
                    const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
                    console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);

                    expect(upsertResponse.Ok).to.be.true;
                    expect(upsertResponse.Status).to.equal(200);
                    expect(upsertResponse.Error).to.eql({});
                });

            /********************  Values Insertions To Collections  ********************/

            // Collection: ==========>   NameAgeAuto   <==========   //
            udcNameAge == 'true' &&
                it('1. Adding Values to Collection: "NameAgeAuto"', async () => {
                    const dataNameAgeAuto = [
                        { name: 'Shoshi', age: 20 },
                        { name: 'Avram', age: 100 },
                        { name: 'Menachem', age: 5 },
                        { name: 'Charlie', age: 1 },
                        { name: 'Gil', age: 51 },
                        { name: 'Ari', age: 13 },
                        { name: 'Ruth', age: 69 },
                        { name: 'Charls', age: 7 },
                        { name: 'Alex', age: 33 },
                        { name: 'Chocky', age: 4 },
                        { name: 'Shin', age: 82 },
                        { name: 'Bini', age: 47 },
                        { name: 'Amsalem', age: 99 },
                        { name: 'Uri', age: 19 },
                        { name: 'Motty', age: 18 },
                        { name: 'David', age: 17 },
                        { name: 'Eli', age: 16 },
                        { name: 'Franc', age: 15 },
                        { name: 'Hagay', age: 14 },
                        { name: 'Iris', age: 13 },
                        { name: 'Penny', age: 12 },
                        { name: 'Zux', age: 11 },
                        { name: 'Iris', age: 10 },
                        { name: 'Gili', age: 30 },
                        { name: 'Kevin', age: 50 },
                        { name: 'Ross', age: 70 },
                        { name: 'Martin', age: 90 },
                    ];
                    const upsertingValues_Responses = await Promise.all(
                        dataNameAgeAuto.map(async (listing) => {
                            return await udcService.listingsInsertionToCollection(listing, 'NameAgeAuto');
                        }),
                    );
                    upsertingValues_Responses.forEach((upsertingValues_Response) => {
                        console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                        expect(upsertingValues_Response.Ok).to.be.true;
                        expect(upsertingValues_Response.Status).to.equal(200);
                        expect(upsertingValues_Response.Error).to.eql({});
                    });
                });

            // Collection: ==========>   IndexedNameAgeAuto   <==========   //
            udcIndexedNameAge == 'true' &&
                it('2. Adding Values to Collection: "IndexedNameAgeAuto"', async () => {
                    const dataIndexedNameAgeAuto = [
                        { name: 'Shoshi', age: 47 },
                        { name: 'Avram', age: 82 },
                        { name: 'Menachem', age: 4 },
                        { name: 'Charlie', age: 33 },
                        { name: 'Gil', age: 7 },
                        { name: 'Ari', age: 69 },
                        { name: 'Ruth', age: 13 },
                        { name: 'Charls', age: 51 },
                        { name: 'Alex', age: 1 },
                        { name: 'Chocky', age: 5 },
                        { name: 'Shin', age: 100 },
                        { name: 'Bibi', age: 80 },
                    ];
                    const upsertingValues_Responses = await Promise.all(
                        dataIndexedNameAgeAuto.map(async (listing) => {
                            return await udcService.listingsInsertionToCollection(listing, 'IndexedNameAgeAuto');
                        }),
                    );
                    upsertingValues_Responses.forEach((upsertingValues_Response) => {
                        console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                        expect(upsertingValues_Response.Ok).to.be.true;
                        expect(upsertingValues_Response.Status).to.equal(200);
                        expect(upsertingValues_Response.Error).to.eql({});
                    });
                });

            // Collection: ==========>   IndexedFieldsAuto   <==========   //
            udcIndexedFields == 'true' &&
                it('3. Adding Values to Collection: "IndexedFieldsAuto"', async () => {
                    const dataIndexedFieldsAuto = [
                        { item: 'Aa', price: 10.5, quantity: 80, instock: true },
                        { item: 'Bb', price: 0.99, quantity: 1000, instock: false },
                        { item: 'Cc', price: 5.0, quantity: 100, instock: true },
                        { item: 'Dd', price: 6.75, quantity: 100, instock: false },
                        { item: 'Ee', price: 66.7, quantity: 1, instock: false },
                    ];
                    const upsertingValues_Responses = await Promise.all(
                        dataIndexedFieldsAuto.map(async (listing) => {
                            return await udcService.listingsInsertionToCollection(listing, 'IndexedFieldsAuto');
                        }),
                    );
                    upsertingValues_Responses.forEach((upsertingValues_Response) => {
                        console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                        expect(upsertingValues_Response.Ok).to.be.true;
                        expect(upsertingValues_Response.Status).to.equal(200);
                        expect(upsertingValues_Response.Error).to.eql({});
                    });
                });

            // Collection: ==========>   ArraysOfPrimitivesAuto   <==========   //
            udcArrays == 'true' &&
                it('4. Adding Values to Collection: "ArraysOfPrimitivesAuto"', async () => {
                    const dataReferenceAccountAuto = [
                        {
                            numbers: [1, 2, 3, 4],
                            names: ['Happy', 'New', 'Year', '!!!'],
                            reals: [0.1, 0.2, 0.3, 0.4],
                        },
                        {
                            numbers: [5, 6, 7, 8],
                            names: ['Purim', 'Sameach'],
                            reals: [0.5, 0.6, 0.7, 0.8],
                        },
                        {
                            numbers: [0, 9, 10],
                            names: ['Ramadan', 'Karim', 'Habibi'],
                            reals: [0.0, 0.9, 0.1],
                        },
                    ];
                    const upsertingValues_Responses = await Promise.all(
                        dataReferenceAccountAuto.map(async (listing) => {
                            return await udcService.listingsInsertionToCollection(listing, 'ArraysOfPrimitivesAuto');
                        }),
                    );
                    upsertingValues_Responses.forEach((upsertingValues_Response) => {
                        console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                        expect(upsertingValues_Response.Ok).to.be.true;
                        expect(upsertingValues_Response.Status).to.equal(200);
                        expect(upsertingValues_Response.Error).to.eql({});
                    });
                });

            // Collection: ==========>   ReferenceAccountAuto   <==========   //
            udcReferenceAccount == 'true' &&
                it('5. Adding Values to Collection: "ReferenceAccountAuto"', async () => {
                    const dataReferenceAccountAuto = [
                        { of_account: acc03UUID, best_seller_item: 'Daisy', max_quantity: 1500 },
                        {
                            of_account: acc03UUID,
                            best_seller_item: '',
                            max_quantity: 100000,
                            discount_rate: 0.1,
                            offered_discount_location: [],
                        },
                        {
                            of_account: acc02UUID,
                            best_seller_item: 'Lily',
                            max_quantity: 1,
                            discount_rate: 0.1,
                            offered_discount_location: ['rep'],
                        },
                        {
                            of_account: acc01UUID,
                            best_seller_item: 'Rose',
                            max_quantity: 0,
                            discount_rate: 0.4,
                            offered_discount_location: ['store', 'on-line', 'rep'],
                        },
                        {
                            of_account: acc02UUID,
                            best_seller_item: 'Iris',
                            max_quantity: 40000,
                            discount_rate: 0.15,
                            offered_discount_location: ['store', 'on-line'],
                        },
                        { of_account: acc03UUID, max_quantity: 600, discount_rate: 0.1, offered_discount_location: [] },
                        { of_account: acc01UUID, best_seller_item: '', max_quantity: 55, discount_rate: 0.22 },
                        {
                            of_account: acc03UUID,
                            best_seller_item: 'Tulip',
                            discount_rate: 0.3,
                            offered_discount_location: ['store'],
                        },
                        {
                            of_account: acc01UUID,
                            best_seller_item: 'NO Amount',
                            max_quantity: 111,
                            discount_rate: 0.35,
                            offered_discount_location: ['on-line'],
                        },
                    ];
                    const upsertingValues_Responses = await Promise.all(
                        dataReferenceAccountAuto.map(async (listing) => {
                            return await udcService.listingsInsertionToCollection(listing, 'ReferenceAccountAuto');
                        }),
                    );
                    upsertingValues_Responses.forEach((upsertingValues_Response) => {
                        console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                        expect(upsertingValues_Response.Ok).to.be.true;
                        expect(upsertingValues_Response.Status).to.equal(200);
                        expect(upsertingValues_Response.Error).to.eql({});
                    });
                });

            // Collection: ==========>   AccountFilterReferenceAccountAuto   <==========   //
            udcAccountFilter == 'true' &&
                it('6. Adding Values to Collection: "AccountFilterReferenceAccountAuto"', async () => {
                    //
                    const dataAccountFilterReferenceAccountAuto = [
                        { an_account: acc03UUID, best_seller_item: 'Cart', max_quantity: 1500 },
                        {
                            an_account: acc03UUID,
                            best_seller_item: '',
                            max_quantity: 100000,
                            discount_rate: 0.1,
                            offered_discount_location: ['store', 'rep'],
                        },
                        {
                            an_account: acc02UUID,
                            best_seller_item: '',
                            max_quantity: 1,
                            discount_rate: 0.1,
                            offered_discount_location: ['rep'],
                        },
                        {
                            an_account: acc01UUID,
                            best_seller_item: 'Hair dryer',
                            max_quantity: 0,
                            discount_rate: 0.4,
                            offered_discount_location: ['store', 'on-line', 'rep'],
                        },
                        {
                            an_account: acc02UUID,
                            best_seller_item: 'Mask',
                            max_quantity: 40000,
                            discount_rate: 0.15,
                            offered_discount_location: ['store', 'on-line'],
                        },
                        { an_account: acc03UUID, max_quantity: 600, discount_rate: 0.1, offered_discount_location: [] },
                        { an_account: acc01UUID, best_seller_item: 'Shirt', max_quantity: 55, discount_rate: 0.22 },
                        {
                            an_account: acc03UUID,
                            best_seller_item: 'item2',
                            discount_rate: 0.3,
                            offered_discount_location: ['store', 'on-line', 'rep'],
                        },
                        {
                            an_account: acc01UUID,
                            best_seller_item: 'A',
                            max_quantity: 111,
                            discount_rate: 0.35,
                            offered_discount_location: ['on-line', 'rep'],
                        },
                    ];
                    const upsertingValues_Responses = await Promise.all(
                        dataAccountFilterReferenceAccountAuto.map(async (listing) => {
                            return await udcService.listingsInsertionToCollection(
                                listing,
                                'AccountFilterReferenceAccountAuto',
                            );
                        }),
                    );
                    upsertingValues_Responses.forEach((upsertingValues_Response) => {
                        console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                        expect(upsertingValues_Response.Ok).to.be.true;
                        expect(upsertingValues_Response.Status).to.equal(200);
                        expect(upsertingValues_Response.Error).to.eql({});
                    });
                });

            // Collection: ==========>   FiltersAccRefAuto   <==========   //
            udcFiltersRefAccount == 'true' &&
                it('7. Adding Values to Collection: "FiltersAccRefAuto"', async () => {
                    const dataFiltersAccRefAuto = [
                        { from_account: acc02UUID, item: 'Abagada', price: 10.5, quantity: 80, instock: true },
                        { from_account: acc01UUID, item: 'Bananza', price: 0.99, quantity: 1000, instock: false },
                        { from_account: acc03UUID, item: 'Cockie', price: 5.0, quantity: 100, instock: true },
                        { from_account: acc01UUID, item: 'Dov', price: 6.75, quantity: 100, instock: false },
                        { from_account: acc03UUID, item: 'Emerald', price: 66.7, quantity: 1, instock: false },
                        { from_account: acc02UUID, item: 'Funny', price: 66.7, quantity: 80, instock: false },
                        { from_account: acc01UUID, item: 'Great', price: 0.99, quantity: 1, instock: false },
                    ];
                    const upsertingValues_Responses = await Promise.all(
                        dataFiltersAccRefAuto.map(async (listing) => {
                            return await udcService.listingsInsertionToCollection(listing, 'FiltersAccRefAuto');
                        }),
                    );
                    upsertingValues_Responses.forEach((upsertingValues_Response) => {
                        console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                        expect(upsertingValues_Response.Ok).to.be.true;
                        expect(upsertingValues_Response.Status).to.equal(200);
                        expect(upsertingValues_Response.Error).to.eql({});
                    });
                });

            // Collection: ==========>   BigDataReferenceAccountAuto   <==========   //
            udcBigDataRefAccount == 'true' &&
                it('8. Adding Values to Collection: "BigDataReferenceAccountAuto"', async () => {
                    const dataBigDataReferenceAccountAuto = [
                        { in_account: acc03UUID, best_seller_item: 'Cart', max_quantity: 1500 },
                        {
                            in_account: acc03UUID,
                            best_seller_item: '',
                            max_quantity: 100000,
                            discount_rate: 0.1,
                            offered_discount_location: [],
                        },
                        {
                            in_account: acc02UUID,
                            best_seller_item: '',
                            max_quantity: 1,
                            discount_rate: 0.1,
                            offered_discount_location: ['rep'],
                        },
                        {
                            in_account: acc01UUID,
                            best_seller_item: 'Hair dryer',
                            max_quantity: 0,
                            discount_rate: 0.4,
                            offered_discount_location: ['store', 'on-line', 'rep'],
                        },
                        {
                            in_account: acc02UUID,
                            best_seller_item: 'Mask',
                            max_quantity: 40000,
                            discount_rate: 0.15,
                            offered_discount_location: ['store', 'on-line'],
                        },
                        { in_account: acc03UUID, max_quantity: 600, discount_rate: 0.1, offered_discount_location: [] },
                        { in_account: acc01UUID, best_seller_item: 'Shirt', max_quantity: 55, discount_rate: 0.22 },
                        {
                            in_account: acc03UUID,
                            best_seller_item: 'item2',
                            discount_rate: 0.3,
                            offered_discount_location: ['store'],
                        },
                        {
                            in_account: acc01UUID,
                            best_seller_item: 'A',
                            max_quantity: 111,
                            discount_rate: 0.35,
                            offered_discount_location: ['on-line'],
                        },
                    ];
                    const upsertingValues_Responses = await Promise.all(
                        dataBigDataReferenceAccountAuto.map(async (listing) => {
                            return await udcService.listingsInsertionToCollection(
                                listing,
                                'BigDataReferenceAccountAuto',
                            );
                        }),
                    );
                    upsertingValues_Responses.forEach((upsertingValues_Response) => {
                        console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                        expect(upsertingValues_Response.Ok).to.be.true;
                        expect(upsertingValues_Response.Status).to.equal(200);
                        expect(upsertingValues_Response.Error).to.eql({});
                    });
                });

            // Collection: ==========>   ContainedArrayAuto   <==========   //
            udcContainedArray == 'true' &&
                it('9. Adding Values to Collection: "ContainedArrayAuto"', async () => {
                    const dataContainedArrayAuto = [
                        {
                            title: 'First input',
                            contained_scheme_only_name_age: [
                                { name: 'Mitzi', age: 1 },
                                { name: 'Pitzi', age: 2 },
                                { name: 'Eitzi', age: 3 },
                                { name: 'Flitzi', age: 4 },
                            ],
                        },
                        {
                            title: 'Second input',
                            contained_scheme_only_name_age: [
                                { name: 'Aaa', age: 5 },
                                { name: 'Bbb', age: 6 },
                                { name: 'Ccc', age: 7 },
                                { name: 'Ddd', age: 8 },
                            ],
                        },
                    ];
                    const upsertingValues_Responses = await Promise.all(
                        dataContainedArrayAuto.map(async (listing) => {
                            return await udcService.listingsInsertionToCollection(listing, 'ContainedArrayAuto');
                        }),
                    );
                    upsertingValues_Responses.forEach((upsertingValues_Response) => {
                        console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                        expect(upsertingValues_Response.Ok).to.be.true;
                        expect(upsertingValues_Response.Status).to.equal(200);
                        expect(upsertingValues_Response.Error).to.eql({});
                    });
                });
        });
    });
}
