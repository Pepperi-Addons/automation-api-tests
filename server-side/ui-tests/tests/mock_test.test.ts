import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { UDCService } from '../../services/user-defined-collections.service';
import { Browser } from '../utilities/browser';
import { BrandedApp, WebAppHeader, WebAppHomePage, WebAppLoginPage } from '../pom';
// import { DataViewsService } from '../../services/data-views.service';
import E2EUtils from '../utilities/e2e_utils';
import { ResourceViews } from '../pom/addons/ResourceList';
import { DataViewFieldType } from '@pepperi-addons/papi-sdk';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import {
    BasePageLayoutSectionColumn,
    // ViewID,
    ViewerBlock,
} from '../blueprints/PageBlocksBlueprints';
import { ResourceListBlock } from '../pom/ResourceList.block';
import { Slugs } from '../pom/addons/Slugs';

chai.use(promised);

export async function MockTest(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    // const dataViewsService = new DataViewsService(generalService.papiClient);
    const coreResourcesUUID = 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f';
    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let e2eUiService: E2EUtils;
    let resourceListUtils: E2EUtils;
    let resourceViews: ResourceViews;
    let resourceListBlock: ResourceListBlock;
    let pageBuilder: PageBuilder;
    let slugs: Slugs;
    let brandedApp: BrandedApp;
    // let referenceAccountAutoCollectionUUID: string;
    let referenceAccountAutoViewUUID: string;
    let referenceAccountPageName: string;
    let referenceAccountAutoPageUUID: string;
    let referenceAccountSlugDisplayName: string;
    let referenceAccountSlugPath: string;
    // let referenceAccountSlugUUID: string;
    let nameAgeAutoViewUUID: string;
    let nameAgePageName: string;
    let nameAgeAutoPageUUID: string;
    let nameAgeSlugDisplayName: string;
    let nameAgeSlugPath: string;
    let indexedNameAgeAutoViewUUID: string;
    let indexedNameAgePageName: string;
    let indexedNameAgeAutoPageUUID: string;
    let indexedNameAgeSlugDisplayName: string;
    let indexedNameAgeSlugPath: string;
    let indexedFieldsAutoViewUUID: string;
    let indexedFieldsPageName: string;
    let indexedFieldsAutoPageUUID: string;
    let indexedFieldsSlugDisplayName: string;
    let indexedFieldsSlugPath: string;

    describe('Resource List Test Suite', () => {
        describe('API Creation of UDCs', () => {
            /********************  RL Data Prep  ********************/
            // it('Creating UDC of Arrays of Primiteve Types Fields with API', async () => {
            //     //  Strings Array  |  Integers Array  |  Doubles Array  //
            //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
            //         nameOfCollection: 'ArraysPrimitivesAuto',
            //         descriptionOfCollection: 'Created with Automation',
            //         fieldsOfCollection: [
            //             {
            //                 classType: 'Array',
            //                 fieldName: 'numbers',
            //                 fieldTitle: 'Numbers',
            //                 field: {
            //                     Type: 'String',
            //                     Description: 'list of products',
            //                     AddonUUID: '',
            //                     ApplySystemFilter: false,
            //                     Mandatory: false,
            //                     Indexed: false,
            //                     // IndexedFields: {},
            //                     // OptionalValues: [],
            //                 },
            //             },
            //             {
            //                 classType: 'Array',
            //                 fieldName: 'names',
            //                 fieldTitle: 'Names',
            //                 field: {
            //                     Type: 'Integer',
            //                     Description: 'in stock quantity',
            //                     AddonUUID: '',
            //                     ApplySystemFilter: false,
            //                     Mandatory: false,
            //                     Indexed: false,
            //                     // IndexedFields: {},
            //                     // OptionalValues: [],
            //                 },
            //             },
            //             {
            //                 classType: 'Array',
            //                 fieldName: 'reals',
            //                 fieldTitle: 'Reals',
            //                 field: {
            //                     Type: 'Double',
            //                     Description: 'average items sold per month',
            //                     AddonUUID: '',
            //                     ApplySystemFilter: false,
            //                     Mandatory: false,
            //                     Indexed: false,
            //                     // IndexedFields: {},
            //                     // OptionalValues: [],
            //                 },
            //             },
            //         ],
            //     });
            //     const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
            //     console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);

            //     expect(upsertResponse.Ok).to.be.true;
            //     expect(upsertResponse.Status).to.equal(200);
            //     expect(upsertResponse.Error).to.eql({});
            // });

            // // Collection: ==========>   ArraysPrimitivesAuto   <==========   //
            // it('Adding Values to Collection: ArraysPrimitivesAuto', async () => {
            //     const collectionName = 'ArraysPrimitivesAuto';
            //     const upsertingValues_Response = await udcService.upsertValuesToCollection(
            //         {
            //             numbers: [1, 2, 3, 4],
            //             names: ['Happy', 'New', 'Year', '!!!'],
            //             reals: [0.1, 0.2, 0.3, 0.4],
            //         },
            //         collectionName,
            //     );
            //     console.info(
            //         `Response of POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/create?collection_name=${collectionName} :\n`,
            //         `${JSON.stringify(upsertingValues_Response, null, 2)}`,
            //     );
            //     expect(upsertingValues_Response.Ok).to.be.true;
            //     expect(upsertingValues_Response.Status).to.equal(200);
            //     expect(upsertingValues_Response.Error).to.eql({});
            // });
            // it('1. Creating a UDC of "Big Data Reference Account" with API', async () => {
            //     // Collection:  ====>   BigDataReferenceAccountAuto   <====        //
            //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
            //         nameOfCollection: 'BigDataReferenceAccountAuto',
            //         descriptionOfCollection: 'Created with Automation',
            //         fieldsOfCollection: [
            //             {
            //                 classType: 'Resource',
            //                 fieldName: 'in_account',
            //                 fieldTitle: '',
            //                 field: {
            //                     Type: 'Resource',
            //                     Resource: 'accounts',
            //                     Description: '',
            //                     Mandatory: false,
            //                     Indexed: true,
            //                     IndexedFields: {
            //                         Email: { Indexed: true, Type: 'String' },
            //                         Name: { Indexed: true, Type: 'String' },
            //                         UUID: { Indexed: true, Type: 'String' },
            //                     },
            //                     Items: { Description: '', Mandatory: false, Type: 'String' },
            //                     OptionalValues: [],
            //                     AddonUUID: coreResourcesUUID,
            //                 },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'best_seller_item',
            //                 fieldTitle: '',
            //                 field: {
            //                     Type: 'String',
            //                     Description: '',
            //                     AddonUUID: '',
            //                     ApplySystemFilter: false,
            //                     Mandatory: false,
            //                     Indexed: false,
            //                     IndexedFields: {},
            //                     OptionalValues: [
            //                         'A',
            //                         'B',
            //                         'C',
            //                         'D',
            //                         'Hair dryer',
            //                         'Roller',
            //                         'Cart',
            //                         'Mask',
            //                         'Shirt',
            //                         '',
            //                     ],
            //                 },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'max_quantity',
            //                 fieldTitle: '',
            //                 field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'discount_rate',
            //                 fieldTitle: '',
            //                 field: { Type: 'Double', Mandatory: false, Indexed: false, Description: '' },
            //             },
            //             {
            //                 classType: 'Array',
            //                 fieldName: 'offered_discount_location',
            //                 fieldTitle: '',
            //                 field: {
            //                     Type: 'String',
            //                     Mandatory: false,
            //                     Indexed: false,
            //                     Description: '',
            //                     OptionalValues: ['store', 'on-line', 'rep'],
            //                 },
            //             },
            //         ],
            //     });
            //     const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
            //     console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);
            // });
            // it('2. Adding Values to Collection: "BigDataReferenceAccountAuto"', async () => {
            //     // Collection:  ====>   BigDataReferenceAccountAuto   <====        //
            //     const acc01UUID = '9d315555-dbb4-4390-8b67-5fc1a9304514'; // Prod: '5737a507-fa00-4c32-a26a-8bc32572e24d' , Stage: '3889ed1c-8d10-4042-8209-ac4cbf32299d', EU: '9d315555-dbb4-4390-8b67-5fc1a9304514'
            //     const acc02UUID = '28290d15-bf25-43a2-a71a-2c8514188d07'; // Prod: '56363496-f8ce-42e8-9305-de5d28737e66' , Stage: '375fbb0f-5dfa-4b49-ac5e-bf3a5328d868', EU: '28290d15-bf25-43a2-a71a-2c8514188d07'
            //     const acc03UUID = '58e20103-3550-4943-b63b-05d3e0914b66'; // Prod: '7fa13cfa-39a5-4901-b8f4-6bbb9ef870cb' , Stage: '3d119d7d-cb3b-41d1-805d-bc5d8cc5be7e', EU: '58e20103-3550-4943-b63b-05d3e0914b66'
            //     // const bestSellerOptions = ['Cart', 'Hair dryer', 'Mask', 'Shirt']
            //     // let dataBigDataReferenceAccountAuto: {}[] = [];
            //     // for (let index = 0; index < 3450; index++) {
            //     //     dataBigDataReferenceAccountAuto.push({ in_account: acc01UUID, best_seller_item: `Cart_${index}`, max_quantity: index, discount_rate: 0.1, offered_discount_location: ['rep'] });
            //     //     dataBigDataReferenceAccountAuto.push({ in_account: acc02UUID, best_seller_item: `Mask_${index}`, max_quantity: index, discount_rate: 0.1, offered_discount_location: ['store'] });
            //     //     dataBigDataReferenceAccountAuto.push({ in_account: acc03UUID, best_seller_item: `Shirt_${index}`, max_quantity: index, discount_rate: 0.1, offered_discount_location: ['on-line'] });
            //     // }
            //     const dataBigDataReferenceAccountAuto = [
            //         { in_account: acc03UUID, best_seller_item: 'Cart', max_quantity: 1500 },
            //         {
            //             in_account: '',
            //             best_seller_item: '',
            //             max_quantity: 100000,
            //             discount_rate: 0.1,
            //             offered_discount_location: [],
            //         },
            //         {
            //             in_account: acc02UUID,
            //             best_seller_item: '',
            //             max_quantity: 1,
            //             discount_rate: 0.1,
            //             offered_discount_location: ['rep'],
            //         },
            //         {
            //             in_account: acc01UUID,
            //             best_seller_item: 'Hair dryer',
            //             max_quantity: 0,
            //             discount_rate: 0.4,
            //             offered_discount_location: ['store', 'on-line', 'rep'],
            //         },
            //         {
            //             in_account: acc02UUID,
            //             best_seller_item: 'Mask',
            //             max_quantity: 40000,
            //             discount_rate: 0.15,
            //             offered_discount_location: ['store', 'on-line'],
            //         },
            //         { in_account: acc03UUID, max_quantity: 600, discount_rate: 0.1, offered_discount_location: [] },
            //         { in_account: acc01UUID, best_seller_item: 'Shirt', max_quantity: 55, discount_rate: 0.22 },
            //         {
            //             in_account: acc03UUID,
            //             best_seller_item: 'item2',
            //             discount_rate: 0.3,
            //             offered_discount_location: ['store'],
            //         },
            //         {
            //             best_seller_item: 'A',
            //             max_quantity: 111,
            //             discount_rate: 0.35,
            //             offered_discount_location: ['on-line'],
            //         },
            //     ];
            //     dataBigDataReferenceAccountAuto.forEach(async (listing) => {
            //         const upsertingValues_Response = await udcService.upsertValuesToCollection(
            //             listing,
            //             'BigDataReferenceAccountAuto',
            //         );
            //         console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
            //         expect(upsertingValues_Response.Ok).to.be.true;
            //         expect(upsertingValues_Response.Status).to.equal(200);
            //         expect(upsertingValues_Response.Error).to.eql({});
            //     });
            //     await generalService.createCSVFile(
            //         100,
            //         'in_account,best_seller_item,max_quantity,discount_rate,offered_discount_location,Hidden',
            //         '7fa13cfa-39a5-4901-b8f4-6bbb9ef870cb',
            //         ['Candy_index', 'index', '0.index1', '["on-line"]'],
            //         'false',
            //     );
            // });
            it('1. Creating a UDC of "Account Filter Reference Account" with API', async () => {
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
            it('2. Adding Values to Collection: "AccountFilterReferenceAccountAuto"', async () => {
                // Collection:  ====>   AccountFilterReferenceAccountAuto   <====        //
                const acc01UUID = '5737a507-fa00-4c32-a26a-8bc32572e24d'; // Prod: '5737a507-fa00-4c32-a26a-8bc32572e24d' , Stage: '3889ed1c-8d10-4042-8209-ac4cbf32299d', EU: '9d315555-dbb4-4390-8b67-5fc1a9304514'
                const acc02UUID = '56363496-f8ce-42e8-9305-de5d28737e66'; // Prod: '56363496-f8ce-42e8-9305-de5d28737e66' , Stage: '375fbb0f-5dfa-4b49-ac5e-bf3a5328d868', EU: '28290d15-bf25-43a2-a71a-2c8514188d07'
                const acc03UUID = '7fa13cfa-39a5-4901-b8f4-6bbb9ef870cb'; // Prod: '7fa13cfa-39a5-4901-b8f4-6bbb9ef870cb' , Stage: '3d119d7d-cb3b-41d1-805d-bc5d8cc5be7e', EU: '58e20103-3550-4943-b63b-05d3e0914b66'
                // const bestSellerOptions = ['Cart', 'Hair dryer', 'Mask', 'Shirt']
                // let dataAccountFilterReferenceAccountAuto: {}[] = [];
                // for (let index = 0; index < 3450; index++) {
                //     dataAccountFilterReferenceAccountAuto.push({ an_account: acc01UUID, best_seller_item: `Cart_${index}`, max_quantity: index, discount_rate: 0.1, offered_discount_location: ['rep'] });
                //     dataAccountFilterReferenceAccountAuto.push({ an_account: acc02UUID, best_seller_item: `Mask_${index}`, max_quantity: index, discount_rate: 0.1, offered_discount_location: ['store'] });
                //     dataAccountFilterReferenceAccountAuto.push({ an_account: acc03UUID, best_seller_item: `Shirt_${index}`, max_quantity: index, discount_rate: 0.1, offered_discount_location: ['on-line'] });
                // }
                const dataAccountFilterReferenceAccountAuto = [
                    { an_account: acc03UUID, best_seller_item: 'Cart', max_quantity: 1500 },
                    {
                        an_account: '',
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
                        best_seller_item: 'A',
                        max_quantity: 111,
                        discount_rate: 0.35,
                        offered_discount_location: ['on-line', 'rep'],
                    },
                ];
                dataAccountFilterReferenceAccountAuto.forEach(async (listing) => {
                    const upsertingValues_Response = await udcService.upsertValuesToCollection(
                        listing,
                        'AccountFilterReferenceAccountAuto',
                    );
                    console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                    expect(upsertingValues_Response.Ok).to.be.true;
                    expect(upsertingValues_Response.Status).to.equal(200);
                    expect(upsertingValues_Response.Error).to.eql({});
                });
                await generalService.createCSVFile(
                    25,
                    'an_account,best_seller_item,max_quantity,discount_rate,offered_discount_location,Hidden',
                    acc01UUID,
                    ['Candy_index', 'index', '0.index1', '["on-line"]'],
                    'false',
                );
            });
            // it('1. Creating a UDC of "Reference Account" with API', async () => {
            //     // Collection:  ====>   ReferenceAccount   <====        //
            //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
            //         nameOfCollection: 'ReferenceAccountAuto',
            //         descriptionOfCollection: 'Created with Automation',
            //         fieldsOfCollection: [
            //             {
            //                 classType: 'Resource',
            //                 fieldName: 'of_account',
            //                 fieldTitle: '',
            //                 field: {
            //                     Type: 'Resource',
            //                     Resource: 'accounts',
            //                     Description: '',
            //                     Mandatory: false,
            //                     Indexed: true,
            //                     IndexedFields: {
            //                         Email: { Indexed: true, Type: 'String' },
            //                         Name: { Indexed: true, Type: 'String' },
            //                         UUID: { Indexed: true, Type: 'String' },
            //                     },
            //                     Items: { Description: '', Mandatory: false, Type: 'String' },
            //                     OptionalValues: [],
            //                     AddonUUID: coreResourcesUUID,
            //                 },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'best_seller_item',
            //                 fieldTitle: '',
            //                 field: {
            //                     Type: 'String',
            //                     Description: '',
            //                     AddonUUID: '',
            //                     ApplySystemFilter: false,
            //                     Mandatory: false,
            //                     Indexed: false,
            //                     IndexedFields: {},
            //                     OptionalValues: [
            //                         'A',
            //                         'B',
            //                         'C',
            //                         'D',
            //                         'Hair dryer',
            //                         'Roller',
            //                         'Cart',
            //                         'Mask',
            //                         'Shirt',
            //                         '',
            //                     ],
            //                 },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'max_quantity',
            //                 fieldTitle: '',
            //                 field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'discount_rate',
            //                 fieldTitle: '',
            //                 field: { Type: 'Double', Mandatory: false, Indexed: false, Description: '' },
            //             },
            //             {
            //                 classType: 'Array',
            //                 fieldName: 'offered_discount_location',
            //                 fieldTitle: '',
            //                 field: {
            //                     Type: 'String',
            //                     Mandatory: false,
            //                     Indexed: false,
            //                     Description: '',
            //                     OptionalValues: ['store', 'on-line', 'rep'],
            //                 },
            //             },
            //         ],
            //     });
            //     const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
            //     console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);
            // });
            // it('2. Adding Values to Collection: "ReferenceAccountAuto"', async () => {
            //     // Collection:  ====>   ReferenceAccountAuto   <====        //
            //     const acc01UUID = '5737a507-fa00-4c32-a26a-8bc32572e24d'; // Prod: '5737a507-fa00-4c32-a26a-8bc32572e24d' , Stage: '3889ed1c-8d10-4042-8209-ac4cbf32299d', EU: '9d315555-dbb4-4390-8b67-5fc1a9304514'
            //     const acc02UUID = '56363496-f8ce-42e8-9305-de5d28737e66'; // Prod: '56363496-f8ce-42e8-9305-de5d28737e66' , Stage: '375fbb0f-5dfa-4b49-ac5e-bf3a5328d868', EU: '28290d15-bf25-43a2-a71a-2c8514188d07'
            //     const acc03UUID = '7fa13cfa-39a5-4901-b8f4-6bbb9ef870cb'; // Prod: '7fa13cfa-39a5-4901-b8f4-6bbb9ef870cb' , Stage: '3d119d7d-cb3b-41d1-805d-bc5d8cc5be7e', EU: '58e20103-3550-4943-b63b-05d3e0914b66'
            //     const dataReferenceAccountAuto = [
            //         { of_account: acc03UUID, best_seller_item: 'Daisy', max_quantity: 1500 },
            //         {
            //             of_account: '',
            //             best_seller_item: '',
            //             max_quantity: 100000,
            //             discount_rate: 0.1,
            //             offered_discount_location: [],
            //         },
            //         {
            //             of_account: acc02UUID,
            //             best_seller_item: 'Lily',
            //             max_quantity: 1,
            //             discount_rate: 0.1,
            //             offered_discount_location: ['rep'],
            //         },
            //         {
            //             of_account: acc01UUID,
            //             best_seller_item: 'Rose',
            //             max_quantity: 0,
            //             discount_rate: 0.4,
            //             offered_discount_location: ['store', 'on-line', 'rep'],
            //         },
            //         {
            //             of_account: acc02UUID,
            //             best_seller_item: 'Iris',
            //             max_quantity: 40000,
            //             discount_rate: 0.15,
            //             offered_discount_location: ['store', 'on-line'],
            //         },
            //         { of_account: acc03UUID, max_quantity: 600, discount_rate: 0.1, offered_discount_location: [] },
            //         { of_account: acc01UUID, best_seller_item: '', max_quantity: 55, discount_rate: 0.22 },
            //         {
            //             of_account: acc03UUID,
            //             best_seller_item: 'Tulip',
            //             discount_rate: 0.3,
            //             offered_discount_location: ['store'],
            //         },
            //         {
            //             best_seller_item: 'NO Account',
            //             max_quantity: 111,
            //             discount_rate: 0.35,
            //             offered_discount_location: ['on-line'],
            //         },
            //     ];
            //     const upsertingValues_Responses = await Promise.all(
            //         dataReferenceAccountAuto.map(async (listing) => {
            //             return await udcService.upsertValuesToCollection(listing, 'ReferenceAccountAuto');
            //         }),
            //     );
            //     upsertingValues_Responses.forEach((upsertingValues_Response) => {
            //         console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
            //         expect(upsertingValues_Response.Ok).to.be.true;
            //         expect(upsertingValues_Response.Status).to.equal(200);
            //         expect(upsertingValues_Response.Error).to.eql({});
            //     });
            // });

            // it('3. Creating a UDC of "Name Age" with API', async () => {
            //     // Collection:  ====>   NameAgeAuto   <====        //
            //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
            //         nameOfCollection: 'NameAgeAuto',
            //         descriptionOfCollection: 'Created with Automation',
            //         fieldsOfCollection: [
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'name',
            //                 fieldTitle: '',
            //                 field: { Type: 'String', Mandatory: false, Indexed: false, Description: '' },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'age',
            //                 fieldTitle: '',
            //                 field: { Type: 'Integer', Mandatory: false, Indexed: false, Description: '' },
            //             },
            //         ],
            //     });
            //     const upsertCollecionResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
            //     console.info(`upsertCollecionResponse: ${JSON.stringify(upsertCollecionResponse, null, 2)}`);
            // });
            // it('4. Adding Values to Collection: "NameAgeAuto"', async () => {
            //     // Collection:  ====>   NameAgeAuto   <====        //
            //     const dataReferenceAccountAuto = [
            //         { name: 'Shoshi', age: 20 },
            //         { name: 'Avram', age: 100 },
            //         { name: 'Menachem', age: 5 },
            //         { name: 'Charlie', age: 1 },
            //         { name: 'Gil', age: 51 },
            //         { name: 'Ari', age: 13 },
            //         { name: 'Ruth', age: 69 },
            //         { name: 'Charls', age: 7 },
            //         { name: 'Alex', age: 33 },
            //         { name: 'Chocky', age: 4 },
            //         { name: 'Shin', age: 82 },
            //         { name: 'Bibi', age: 47 },
            //         { name: 'Amsalem', age: 99 },
            //         { name: 'Uri', age: 19 },
            //         { name: 'Motty', age: 18 },
            //         { name: 'David', age: 17 },
            //         { name: 'Eli', age: 16 },
            //         { name: 'Franc', age: 15 },
            //         { name: 'Hagit', age: 14 },
            //         { name: 'Iris', age: 13 },
            //         { name: 'Penny', age: 12 },
            //         { name: 'Zux', age: 11 },
            //         { name: 'Iris', age: 10 },
            //     ];
            //     dataReferenceAccountAuto.forEach(async (listing) => {
            //         const upsertingValues_Response = await udcService.upsertValuesToCollection(listing, 'NameAgeAuto');
            //         console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
            //         expect(upsertingValues_Response.Ok).to.be.true;
            //         expect(upsertingValues_Response.Status).to.equal(200);
            //         expect(upsertingValues_Response.Error).to.eql({});
            //     });
            // });
            // it('5. Creating a UDC of "Indexed Name Age" with API', async () => {
            //     // Collection:  ====>   IndexedNameAgeAuto   <====        //
            //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
            //         nameOfCollection: 'IndexedNameAgeAuto',
            //         descriptionOfCollection: 'Created with Automation',
            //         fieldsOfCollection: [
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'name',
            //                 fieldTitle: '',
            //                 field: { Type: 'String', Mandatory: false, Indexed: true, Description: '' },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'age',
            //                 fieldTitle: '',
            //                 field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
            //             },
            //         ],
            //         syncDefinitionOfCollection: { Sync: false },
            //     });
            //     const upsertCollecionResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
            //     console.info(`upsertCollecionResponse: ${JSON.stringify(upsertCollecionResponse, null, 2)}`);
            // });
            // it('6. Adding Values to Collection: "IndexedNameAgeAuto"', async () => {
            //     // Collection:  ====>   IndexedNameAgeAuto   <====        //
            //     const dataReferenceAccountAuto = [
            //         { name: 'Shoshi', age: 47 },
            //         { name: 'Avram', age: 82 },
            //         { name: 'Menachem', age: 4 },
            //         { name: 'Charlie', age: 33 },
            //         { name: 'Gil', age: 7 },
            //         { name: 'Ari', age: 69 },
            //         { name: 'Ruth', age: 13 },
            //         { name: 'Charls', age: 51 },
            //         { name: 'Alex', age: 1 },
            //         { name: 'Chocky', age: 5 },
            //         { name: 'Shin', age: 100 },
            //         { name: 'Bibi', age: 20 },
            //     ];
            //     dataReferenceAccountAuto.forEach(async (listing) => {
            //         const upsertingValues_Response = await udcService.upsertValuesToCollection(
            //             listing,
            //             'IndexedNameAgeAuto',
            //         );
            //         console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
            //         expect(upsertingValues_Response.Ok).to.be.true;
            //         expect(upsertingValues_Response.Status).to.equal(200);
            //         expect(upsertingValues_Response.Error).to.eql({});
            //     });
            // });
            // it('7. Creating a UDC of "Indexed Fields" with API', async () => {
            //     // Collection:  ====>   IndexedFieldsAuto   <====        //
            //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
            //         nameOfCollection: 'IndexedFieldsAuto',
            //         descriptionOfCollection: 'Created with Automation',
            //         fieldsOfCollection: [
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'item',
            //                 fieldTitle: '',
            //                 field: { Type: 'String', Mandatory: false, Indexed: true, Description: '' },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'price',
            //                 fieldTitle: '',
            //                 field: { Type: 'Double', Mandatory: false, Indexed: true, Description: '' },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'quantity',
            //                 fieldTitle: '',
            //                 field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'instock',
            //                 fieldTitle: '',
            //                 field: { Type: 'Bool', Mandatory: false, Indexed: true, Description: '' },
            //             },
            //         ],
            //     });
            //     const upsertCollecionResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
            //     console.info(`upsertCollecionResponse: ${JSON.stringify(upsertCollecionResponse, null, 2)}`);
            // });
            // it('8. Adding Values to Collection: "IndexedFieldsAuto"', async () => {
            //     // Collection:  ====>   IndexedFieldsAuto   <====        //
            //     const dataReferenceAccountAuto = [
            //         { item: 'Aa', price: 10.5, quantity: 80, instock: true },
            //         { item: 'Bb', price: 0.99, quantity: 1000, instock: false },
            //         { item: 'Cc', price: 5.0, quantity: 100, instock: true },
            //         { item: 'Dd', price: 6.75, quantity: 100, instock: false },
            //         { item: 'Ee', price: 66.7, quantity: 1, instock: false },
            //     ];
            //     dataReferenceAccountAuto.forEach(async (listing) => {
            //         const upsertingValues_Response = await udcService.upsertValuesToCollection(
            //             listing,
            //             'IndexedFieldsAuto',
            //         );
            //         console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
            //         expect(upsertingValues_Response.Ok).to.be.true;
            //         expect(upsertingValues_Response.Status).to.equal(200);
            //         expect(upsertingValues_Response.Error).to.eql({});
            //     });
            // });
            // it('9. Creating a UDC of "Filters Account Ref" with API', async () => {
            //     // Collection:  ====>   IndexedFieldsAuto   <====        //
            //     const bodyOfCollection = udcService.prepareDataForUdcCreation({
            //         nameOfCollection: 'FiltersAccRefAuto',
            //         descriptionOfCollection: 'Created with Automation',
            //         fieldsOfCollection: [
            //             {
            //                 classType: 'Resource',
            //                 fieldName: 'from_account',
            //                 fieldTitle: '',
            //                 field: {
            //                     Type: 'Resource',
            //                     Resource: 'accounts',
            //                     Description: '',
            //                     Mandatory: false,
            //                     Indexed: true,
            //                     IndexedFields: {
            //                         Email: { Indexed: true, Type: 'String' },
            //                         Name: { Indexed: true, Type: 'String' },
            //                         UUID: { Indexed: true, Type: 'String' },
            //                     },
            //                     Items: { Description: '', Mandatory: false, Type: 'String' },
            //                     OptionalValues: [],
            //                     AddonUUID: coreResourcesUUID,
            //                 },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'item',
            //                 fieldTitle: '',
            //                 field: { Type: 'String', Mandatory: false, Indexed: true, Description: '' },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'price',
            //                 fieldTitle: '',
            //                 field: { Type: 'Double', Mandatory: false, Indexed: true, Description: '' },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'quantity',
            //                 fieldTitle: '',
            //                 field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
            //             },
            //             {
            //                 classType: 'Primitive',
            //                 fieldName: 'instock',
            //                 fieldTitle: '',
            //                 field: { Type: 'Bool', Mandatory: false, Indexed: true, Description: '' },
            //             },
            //         ],
            //     });
            //     const upsertCollecionResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
            //     console.info(`upsertCollecionResponse: ${JSON.stringify(upsertCollecionResponse, null, 2)}`);
            // });
            // it('10. Adding Values to Collection: "FiltersAccRefAuto"', async () => {
            //     // Collection:  ====>   IndexedFieldsAuto   <====        //
            //     generalService.sleep(5 * 1000);
            //     const acc01UUID = '9d315555-dbb4-4390-8b67-5fc1a9304514'; // Prod: '5737a507-fa00-4c32-a26a-8bc32572e24d' , Stage: '3889ed1c-8d10-4042-8209-ac4cbf32299d', EU: '9d315555-dbb4-4390-8b67-5fc1a9304514'
            //     const acc02UUID = '28290d15-bf25-43a2-a71a-2c8514188d07'; // Prod: '56363496-f8ce-42e8-9305-de5d28737e66' , Stage: '375fbb0f-5dfa-4b49-ac5e-bf3a5328d868', EU: '28290d15-bf25-43a2-a71a-2c8514188d07'
            //     const acc03UUID = '58e20103-3550-4943-b63b-05d3e0914b66'; // Prod: '7fa13cfa-39a5-4901-b8f4-6bbb9ef870cb' , Stage: '3d119d7d-cb3b-41d1-805d-bc5d8cc5be7e', EU: '58e20103-3550-4943-b63b-05d3e0914b66'
            //     const dataReferenceAccountAuto = [
            //         { from_account: acc02UUID, item: 'Abagada', price: 10.5, quantity: 80, instock: true },
            //         { from_account: acc01UUID, item: 'Bananza', price: 0.99, quantity: 1000, instock: false },
            //         { from_account: acc03UUID, item: 'Cockie', price: 5.0, quantity: 100, instock: true },
            //         { from_account: acc01UUID, item: 'Dov', price: 6.75, quantity: 100, instock: false },
            //         { from_account: acc03UUID, item: 'Emerald', price: 66.7, quantity: 1, instock: false },
            //         { from_account: acc02UUID, item: 'Funny', price: 66.7, quantity: 80, instock: false },
            //         { from_account: acc01UUID, item: 'Great', price: 0.99, quantity: 1, instock: false },
            //     ];
            //     dataReferenceAccountAuto.forEach(async (listing) => {
            //         const upsertingValues_Response = await udcService.upsertValuesToCollection(
            //             listing,
            //             'FiltersAccRefAuto',
            //         );
            //         console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
            //         expect(upsertingValues_Response.Ok).to.be.true;
            //         expect(upsertingValues_Response.Status).to.equal(200);
            //         expect(upsertingValues_Response.Error).to.eql({});
            //     });
            // });
        });

        describe('Resource List UI tests', () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                resourceListUtils = new E2EUtils(driver);
                resourceViews = new ResourceViews(driver);
                e2eUiService = new E2EUtils(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                pageBuilder = new PageBuilder(driver);
                brandedApp = new BrandedApp(driver);
                // slugs = new Slugs(driver);
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async () => {
                await webAppLoginPage.login(email, password);
            });

            // it('1. Configure Resource View For the Resource "ReferenceAccountAuto"', async function () {
            //     await resourceListUtils.addView({
            //         nameOfView: 'ReferenceAccountAuto View',
            //         descriptionOfView: 'Generated with Automation',
            //         nameOfResource: 'ReferenceAccountAuto',
            //     });
            //     referenceAccountAutoViewUUID = await resourceListUtils.getUUIDfromURL();
            //     const viewFields: {
            //         fieldName: string;
            //         dataViewType: DataViewFieldType;
            //         mandatory: boolean;
            //         readonly: boolean;
            //     }[] = [
            //         {
            //             fieldName: 'of_account',
            //             dataViewType: udcService.resolveUIType('Resource') || 'TextBox',
            //             mandatory: false,
            //             readonly: false,
            //         },
            //         {
            //             fieldName: 'of_account.Name',
            //             dataViewType: udcService.resolveUIType('String') || 'TextBox',
            //             mandatory: false,
            //             readonly: false,
            //         },
            //         {
            //             fieldName: 'of_account.Email',
            //             dataViewType: udcService.resolveUIType('String') || 'TextBox',
            //             mandatory: false,
            //             readonly: false,
            //         },
            //         {
            //             fieldName: 'best_seller_item',
            //             dataViewType: udcService.resolveUIType('String') || 'TextBox',
            //             mandatory: false,
            //             readonly: false,
            //         },
            //         {
            //             fieldName: 'max_quantity',
            //             dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
            //             mandatory: false,
            //             readonly: false,
            //         },
            //         {
            //             fieldName: 'discount_rate',
            //             dataViewType: udcService.resolveUIType('Double') || 'TextBox',
            //             mandatory: false,
            //             readonly: false,
            //         },
            //         {
            //             fieldName: 'offered_discount_location',
            //             dataViewType: udcService.resolveUIType('Array') || 'TextBox',
            //             mandatory: false,
            //             readonly: false,
            //         },
            //     ];
            //     await resourceViews.customViewConfig(client, {
            //         matchingEditorName: '',
            //         viewKey: referenceAccountAutoViewUUID,
            //         fieldsToConfigureInView: viewFields,
            //         fieldsToConfigureInViewSmartSearch: [
            //             { fieldName: 'of_account' },
            //             { fieldName: 'of_account.Name' },
            //             { fieldName: 'of_account.Email' },
            //             { fieldName: 'best_seller_item' },
            //             { fieldName: 'max_quantity' },
            //         ],
            //     });
            //     await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
            //     await webAppHeader.goHome();
            // });
            // it('2. Create Page With Viewer Block Inside It', async function () {
            //     referenceAccountPageName = 'ReferenceAccountAuto Page';
            //     referenceAccountAutoPageUUID = await e2eUiService.addPage(referenceAccountPageName, 'tests');

            //     const createdPage = await pageBuilder.getPageByUUID(referenceAccountAutoPageUUID, client);
            //     const viewerBlockInstance = new ViewerBlock([
            //         {
            //             collectionName: 'ReferenceAccountAuto',
            //             collectionID: '',
            //             selectedViewUUID: referenceAccountAutoViewUUID,
            //             selectedViewName: 'ReferenceAccountAuto View',
            //         },
            //     ]);
            //     createdPage.Blocks.push(viewerBlockInstance);
            //     createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(viewerBlockInstance.Key);
            //     createdPage.Name = referenceAccountPageName;
            //     console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
            //     const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
            //     console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
            //     await webAppHeader.goHome();
            // });
            // it('3. Create A Slug For The Viewer Page And Set It To Show On Homepage', async function () {
            //     referenceAccountSlugDisplayName = `Ref Account`;
            //     referenceAccountSlugPath = 'ref_account_auto';
            //     // referenceAccountSlugUUID = await e2eUiService.createSlug(
            //     await e2eUiService.createSlug(
            //         referenceAccountSlugDisplayName,
            //         referenceAccountSlugPath,
            //         referenceAccountAutoPageUUID,
            //         email,
            //         password,
            //         client,
            //     );
            //     driver.sleep(0.5 * 1000);
            //     await brandedApp.addAdminHomePageButtons(referenceAccountSlugDisplayName);
            //     await e2eUiService.performManualSync(client);
            //     await webAppHomePage.validateATDIsApearingOnHomeScreen(referenceAccountSlugDisplayName);
            // });
            // it('4. Click On "Ref Account" Button at Homepage', async function () {
            //     resourceListBlock = new ResourceListBlock(
            //         driver,
            //         `https://app.pepperi.com/${referenceAccountSlugPath}`,
            //     );
            //     await webAppHeader.goHome();
            //     await webAppHomePage.isSpinnerDone();
            //     await webAppHomePage.clickOnBtn(referenceAccountSlugDisplayName);
            //     await resourceListBlock.isSpinnerDone();
            //     driver.sleep(8 * 1000);
            // });
            it('1. Configure Resource View For the Resource "AccountFilterReferenceAccountAuto"', async function () {
                await resourceListUtils.addView({
                    nameOfView: 'AccountFilterReferenceAccountAuto View',
                    descriptionOfView: 'Generated with Automation',
                    nameOfResource: 'AccountFilterReferenceAccountAuto',
                });
                referenceAccountAutoViewUUID = await resourceListUtils.getUUIDfromURL();
                const viewFields: {
                    fieldName: string;
                    dataViewType: DataViewFieldType;
                    mandatory: boolean;
                    readonly: boolean;
                }[] = [
                    {
                        fieldName: 'an_account',
                        dataViewType: udcService.resolveUIType('Resource') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'an_account.Name',
                        dataViewType: udcService.resolveUIType('String') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'an_account.Email',
                        dataViewType: udcService.resolveUIType('String') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'best_seller_item',
                        dataViewType: udcService.resolveUIType('String') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'max_quantity',
                        dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'discount_rate',
                        dataViewType: udcService.resolveUIType('Double') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'offered_discount_location',
                        dataViewType: udcService.resolveUIType('Array') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                ];
                await resourceViews.customViewConfig(client, {
                    matchingEditorName: '',
                    viewKey: referenceAccountAutoViewUUID,
                    fieldsToConfigureInView: viewFields,
                    fieldsToConfigureInViewSmartSearch: [
                        { fieldName: 'an_account' },
                        { fieldName: 'an_account.Name' },
                        { fieldName: 'an_account.Email' },
                        { fieldName: 'best_seller_item' },
                        { fieldName: 'max_quantity' },
                    ],
                });
                await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
                await webAppHeader.goHome();
            });
            it('2. Create Page With Viewer Block Inside It', async function () {
                referenceAccountPageName = 'AccountFilterReferenceAccountAuto Page';
                referenceAccountAutoPageUUID = await e2eUiService.addPage(referenceAccountPageName, 'tests');

                const createdPage = await pageBuilder.getPageByUUID(referenceAccountAutoPageUUID, client);
                const viewerBlockInstance = new ViewerBlock([
                    {
                        collectionName: 'AccountFilterReferenceAccountAuto',
                        collectionID: '',
                        selectedViewUUID: referenceAccountAutoViewUUID,
                        selectedViewName: 'AccountFilterReferenceAccountAuto View',
                    },
                ]);
                createdPage.Blocks.push(viewerBlockInstance);
                createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(viewerBlockInstance.Key);
                createdPage.Name = referenceAccountPageName;
                console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
                const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
                await webAppHeader.goHome();
            });
            it('3. Create A Slug For The Viewer Page And Set It To Show On Homepage', async function () {
                referenceAccountSlugDisplayName = `Account Filter`;
                referenceAccountSlugPath = 'account_filter_auto';
                // referenceAccountSlugUUID = await e2eUiService.createSlug(
                await e2eUiService.createSlug(
                    referenceAccountSlugDisplayName,
                    referenceAccountSlugPath,
                    referenceAccountAutoPageUUID,
                    email,
                    password,
                    client,
                );
                driver.sleep(0.5 * 1000);
                await brandedApp.addAdminHomePageButtons(referenceAccountSlugDisplayName);
                await e2eUiService.performManualSync(client);
                await webAppHomePage.validateATDIsApearingOnHomeScreen(referenceAccountSlugDisplayName);
            });
            it('4. Click On "Account Filter" Button at Homepage', async function () {
                resourceListBlock = new ResourceListBlock(
                    driver,
                    `https://app.pepperi.com/${referenceAccountSlugPath}`,
                );
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHomePage.clickOnBtn(referenceAccountSlugDisplayName);
                await resourceListBlock.isSpinnerDone();
                driver.sleep(8 * 1000);
            });
            //     it('1. Configure Resource View For the Resource "BigDataReferenceAccountAuto"', async function () {
            //         await resourceListUtils.addView({
            //             nameOfView: 'BigDataReferenceAccountAuto View',
            //             descriptionOfView: 'Generated with Automation',
            //             nameOfResource: 'BigDataReferenceAccountAuto',
            //         });
            //         referenceAccountAutoViewUUID = await resourceListUtils.getUUIDfromURL();
            //         const viewFields: {
            //             fieldName: string;
            //             dataViewType: DataViewFieldType;
            //             mandatory: boolean;
            //             readonly: boolean;
            //         }[] = [
            //             {
            //                 fieldName: 'in_account',
            //                 dataViewType: udcService.resolveUIType('Resource') || 'TextBox',
            //                 mandatory: false,
            //                 readonly: true,
            //             },
            //             {
            //                 fieldName: 'in_account.Name',
            //                 dataViewType: udcService.resolveUIType('String') || 'TextBox',
            //                 mandatory: false,
            //                 readonly: true,
            //             },
            //             {
            //                 fieldName: 'in_account.Email',
            //                 dataViewType: udcService.resolveUIType('String') || 'TextBox',
            //                 mandatory: false,
            //                 readonly: true,
            //             },
            //             {
            //                 fieldName: 'best_seller_item',
            //                 dataViewType: udcService.resolveUIType('String') || 'TextBox',
            //                 mandatory: false,
            //                 readonly: true,
            //             },
            //             {
            //                 fieldName: 'max_quantity',
            //                 dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
            //                 mandatory: false,
            //                 readonly: true,
            //             },
            //             {
            //                 fieldName: 'discount_rate',
            //                 dataViewType: udcService.resolveUIType('Double') || 'TextBox',
            //                 mandatory: false,
            //                 readonly: true,
            //             },
            //             {
            //                 fieldName: 'offered_discount_location',
            //                 dataViewType: udcService.resolveUIType('Array') || 'TextBox',
            //                 mandatory: false,
            //                 readonly: true,
            //             },
            //         ];
            //         await resourceViews.customViewConfig(client, {
            //             matchingEditorName: '',
            //             viewKey: referenceAccountAutoViewUUID,
            //             fieldsToConfigureInView: viewFields,
            //             fieldsToConfigureInViewSmartSearch: [
            //                 { fieldName: 'in_account' },
            //                 { fieldName: 'in_account.Name' },
            //                 { fieldName: 'in_account.Email' },
            //                 { fieldName: 'best_seller_item' },
            //                 { fieldName: 'max_quantity' },
            //                 { fieldName: 'discount_rate' },
            //                 { fieldName: 'offered_discount_location' },
            //             ],
            //         });
            //         await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
            //         await webAppHeader.goHome();
            //     });
            //     it('2. Create Page With Viewer Block Inside It', async function () {
            //         referenceAccountPageName = 'BigDataReferenceAccountAuto Page';
            //         referenceAccountAutoPageUUID = await e2eUiService.addPage(referenceAccountPageName, 'tests');

            //         const createdPage = await pageBuilder.getPageByUUID(referenceAccountAutoPageUUID, client);
            //         const viewerBlockInstance = new ViewerBlock([
            //             {
            //                 collectionName: 'BigDataReferenceAccountAuto',
            //                 collectionID: '',
            //                 selectedViewUUID: referenceAccountAutoViewUUID,
            //                 selectedViewName: 'BigDataReferenceAccountAuto View',
            //             },
            //         ]);
            //         createdPage.Blocks.push(viewerBlockInstance);
            //         createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(viewerBlockInstance.Key);
            //         createdPage.Name = referenceAccountPageName;
            //         console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
            //         const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
            //         console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
            //         await webAppHeader.goHome();
            //     });
            //     it('3. Create A Slug For The Viewer Page And Set It To Show On Homepage', async function () {
            //         referenceAccountSlugDisplayName = `Big Data Ref Account`;
            //         referenceAccountSlugPath = 'big_data_ref_account_auto';
            //         // referenceAccountSlugUUID = await e2eUiService.createSlug(
            //         await e2eUiService.createSlug(
            //             referenceAccountSlugDisplayName,
            //             referenceAccountSlugPath,
            //             referenceAccountAutoPageUUID,
            //             email,
            //             password,
            //             client,
            //         );
            //         driver.sleep(0.5 * 1000);
            //         await brandedApp.addAdminHomePageButtons(referenceAccountSlugDisplayName);
            //         await e2eUiService.performManualSync(client);
            //         await webAppHomePage.validateATDIsApearingOnHomeScreen(referenceAccountSlugDisplayName);
            //     });
            //     it('4. Click On "Big Data Ref Account" Button at Homepage', async function () {
            //         resourceListBlock = new ResourceListBlock(
            //             driver,
            //             `https://app.pepperi.com/${referenceAccountSlugPath}`,
            //         );
            //         await webAppHeader.goHome();
            //         await webAppHomePage.isSpinnerDone();
            //         await webAppHomePage.clickOnBtn(referenceAccountSlugDisplayName);
            //         await resourceListBlock.isSpinnerDone();
            //         driver.sleep(8 * 1000);
            //     });
            // NameAge
            it('5. Configure Resource View For the Resource "NameAgeAuto"', async function () {
                await resourceListUtils.addView({
                    nameOfView: 'NameAgeAuto View',
                    descriptionOfView: 'Generated with Automation',
                    nameOfResource: 'NameAgeAuto',
                });
                nameAgeAutoViewUUID = await resourceListUtils.getUUIDfromURL();
                const viewFields: {
                    fieldName: string;
                    dataViewType: DataViewFieldType;
                    mandatory: boolean;
                    readonly: boolean;
                }[] = [
                    {
                        fieldName: 'name',
                        dataViewType: udcService.resolveUIType('String') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'age',
                        dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                ];
                await resourceViews.customViewConfig(client, {
                    matchingEditorName: '',
                    viewKey: nameAgeAutoViewUUID,
                    fieldsToConfigureInView: viewFields,
                });
                await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
                await webAppHeader.goHome();
            });
            it('6. Create Page With Viewer Block Inside It', async function () {
                nameAgePageName = 'NameAgeAuto Page';
                nameAgeAutoPageUUID = await e2eUiService.addPage(nameAgePageName, 'tests');

                const createdPage = await pageBuilder.getPageByUUID(nameAgeAutoPageUUID, client);
                const viewerBlockInstance = new ViewerBlock([
                    {
                        collectionName: 'NameAgeAuto',
                        collectionID: '',
                        selectedViewUUID: nameAgeAutoViewUUID,
                        selectedViewName: 'NameAgeAuto View',
                        selectedViewTitle: 'Name Age',
                    },
                ]);
                createdPage.Blocks.push(viewerBlockInstance);
                createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(viewerBlockInstance.Key);
                createdPage.Name = nameAgePageName;
                console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
                const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
                await webAppHeader.goHome();
            });
            it('7. Create A Slug For The Viewer Page And Set It To Show On Homepage', async function () {
                nameAgeSlugDisplayName = `NameAge`;
                nameAgeSlugPath = 'name_age_auto';
                await e2eUiService.createSlug(
                    nameAgeSlugDisplayName,
                    nameAgeSlugPath,
                    nameAgeAutoPageUUID,
                    email,
                    password,
                    client,
                );
                driver.sleep(0.5 * 1000);
                await brandedApp.addAdminHomePageButtons(nameAgeSlugDisplayName);
                await e2eUiService.performManualSync(client);
                await webAppHomePage.validateATDIsApearingOnHomeScreen(nameAgeSlugDisplayName);
            });
            it('8. Click On "NameAge" Button at Homepage', async function () {
                resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${nameAgeSlugPath}`);
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHomePage.clickOnBtn(nameAgeSlugDisplayName);
                await resourceListBlock.isSpinnerDone();
                driver.sleep(8 * 1000);
            });
            // // IndexedNameAge
            it('9. Configure Resource View For the Resource "IndexedNameAgeAuto"', async function () {
                await resourceListUtils.addView({
                    nameOfView: 'IndexedNameAgeAuto View',
                    descriptionOfView: 'Generated with Automation',
                    nameOfResource: 'IndexedNameAgeAuto',
                });
                indexedNameAgeAutoViewUUID = await resourceListUtils.getUUIDfromURL();
                const viewFields: {
                    fieldName: string;
                    dataViewType: DataViewFieldType;
                    mandatory: boolean;
                    readonly: boolean;
                }[] = [
                    {
                        fieldName: 'name',
                        dataViewType: udcService.resolveUIType('String') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'age',
                        dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'Key',
                        dataViewType: udcService.resolveUIType('String') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                ];
                await resourceViews.customViewConfig(client, {
                    matchingEditorName: '',
                    viewKey: indexedNameAgeAutoViewUUID,
                    fieldsToConfigureInView: viewFields,
                });
                await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
                await webAppHeader.goHome();
            });
            it('10. Create Page With Viewer Block Inside It', async function () {
                indexedNameAgePageName = 'IndexedNameAgeAuto Page';
                indexedNameAgeAutoPageUUID = await e2eUiService.addPage(indexedNameAgePageName, 'tests');

                const createdPage = await pageBuilder.getPageByUUID(indexedNameAgeAutoPageUUID, client);
                const viewerBlockInstance = new ViewerBlock([
                    {
                        collectionName: 'IndexedNameAgeAuto',
                        collectionID: '',
                        selectedViewUUID: indexedNameAgeAutoViewUUID,
                        selectedViewName: 'IndexedNameAgeAuto View',
                        selectedViewTitle: 'Indexed Name Age',
                    },
                ]);
                createdPage.Blocks.push(viewerBlockInstance);
                createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(viewerBlockInstance.Key);
                createdPage.Name = indexedNameAgePageName;
                console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
                const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
                await webAppHeader.goHome();
            });
            it('11. Create A Slug For The Viewer Page And Set It To Show On Homepage', async function () {
                indexedNameAgeSlugDisplayName = `Indexed NameAge`;
                indexedNameAgeSlugPath = 'indexed_name_age_auto';
                await e2eUiService.createSlug(
                    indexedNameAgeSlugDisplayName,
                    indexedNameAgeSlugPath,
                    indexedNameAgeAutoPageUUID,
                    email,
                    password,
                    client,
                );
                driver.sleep(0.5 * 1000);
                await brandedApp.addAdminHomePageButtons(indexedNameAgeSlugDisplayName);
                await e2eUiService.performManualSync(client);
                await webAppHomePage.validateATDIsApearingOnHomeScreen(indexedNameAgeSlugDisplayName);
            });
            it('12. Click On "Indexed NameAge" Button at Homepage', async function () {
                resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${indexedNameAgeSlugPath}`);
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHomePage.clickOnBtn(indexedNameAgeSlugDisplayName);
                await resourceListBlock.isSpinnerDone();
                driver.sleep(8 * 1000);
            });
            // IndexedFields
            it('13. Configure View For the Resource "IndexedFieldsAuto"', async function () {
                await resourceListUtils.addView({
                    nameOfView: 'IndexedFieldsAuto View',
                    descriptionOfView: 'Generated with Automation',
                    nameOfResource: 'IndexedFieldsAuto',
                });
                indexedFieldsAutoViewUUID = await resourceListUtils.getUUIDfromURL();
                const viewFields: {
                    fieldName: string;
                    dataViewType: DataViewFieldType;
                    mandatory: boolean;
                    readonly: boolean;
                }[] = [
                    {
                        fieldName: 'item',
                        dataViewType: udcService.resolveUIType('String') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'price',
                        dataViewType: udcService.resolveUIType('Double') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'quantity',
                        dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'instock',
                        dataViewType: udcService.resolveUIType('Bool') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                ];
                const viewSmartSearchFields = [
                    { fieldName: 'item' },
                    { fieldName: 'price' },
                    { fieldName: 'quantity' },
                    { fieldName: 'instock' },
                ];
                console.info('viewSmartSearchFields: ', JSON.stringify(viewSmartSearchFields, null, 2));
                await resourceViews.customViewConfig(client, {
                    matchingEditorName: '',
                    viewKey: indexedFieldsAutoViewUUID,
                    fieldsToConfigureInView: viewFields,
                    fieldsToConfigureInViewSmartSearch: viewSmartSearchFields,
                });
                await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
                await webAppHeader.goHome();
            });
            it('14. Create Page With Viewer Block Inside It', async function () {
                indexedFieldsPageName = 'IndexedFieldsAuto Page';
                indexedFieldsAutoPageUUID = await e2eUiService.addPage(indexedFieldsPageName, 'tests');

                const createdPage = await pageBuilder.getPageByUUID(indexedFieldsAutoPageUUID, client);
                const viewerBlockInstance = new ViewerBlock([
                    {
                        collectionName: 'IndexedFieldsAuto',
                        collectionID: '',
                        selectedViewUUID: indexedFieldsAutoViewUUID,
                        selectedViewName: 'IndexedFieldsAuto View',
                        selectedViewTitle: 'Indexed Fields',
                    },
                ]);
                createdPage.Blocks.push(viewerBlockInstance);
                createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(viewerBlockInstance.Key);
                createdPage.Name = indexedFieldsPageName;
                console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
                const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
                await webAppHeader.goHome();
            });
            it('15. Create A Slug For The Viewer Page And Set It To Show On Homepage', async function () {
                indexedFieldsSlugDisplayName = `Indexed Fields`;
                indexedFieldsSlugPath = 'indexed_fields_auto';
                await e2eUiService.createSlug(
                    indexedFieldsSlugDisplayName,
                    indexedFieldsSlugPath,
                    indexedFieldsAutoPageUUID,
                    email,
                    password,
                    client,
                );
                driver.sleep(0.5 * 1000);
                await brandedApp.addAdminHomePageButtons(indexedFieldsSlugDisplayName);
                await e2eUiService.performManualSync(client);
                await webAppHomePage.validateATDIsApearingOnHomeScreen(indexedFieldsSlugDisplayName);
            });
            it('16. Click On "Indexed Fields" Button at Homepage', async function () {
                resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${indexedFieldsSlugPath}`);
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHomePage.clickOnBtn(indexedFieldsSlugDisplayName);
                await resourceListBlock.isSpinnerDone();
                driver.sleep(8 * 1000);
            });
            it('17. Arrays collection E2E', async function () {
                const resourceName = 'ArraysOfPrimitivesAuto';
                const slugDisplay = 'Arrays Auto';
                const slugPath = 'arrays_auto';
                await e2eUiService.configureResourceE2E(client, {
                    collection: {
                        createUDC: {
                            nameOfCollection: resourceName,
                            descriptionOfCollection: 'Created with Automation',
                            fieldsOfCollection: [
                                {
                                    classType: 'Array',
                                    fieldName: 'numbers',
                                    fieldTitle: 'numbers',
                                    field: {
                                        Type: 'Integer',
                                        Mandatory: false,
                                        Description: 'list of products',
                                    },
                                },
                                {
                                    classType: 'Array',
                                    fieldName: 'names',
                                    fieldTitle: 'names',
                                    field: {
                                        Type: 'String',
                                        Mandatory: false,
                                        Description: 'in stock quantity',
                                    },
                                },
                                {
                                    classType: 'Array',
                                    fieldName: 'reals',
                                    fieldTitle: 'reals',
                                    field: {
                                        Type: 'Double',
                                        Mandatory: false,
                                        Description: 'average items sold per month',
                                    },
                                },
                            ],
                        },
                        addValuesToCollection: {
                            collectionName: resourceName,
                            values: [
                                { numbers: [1, 1], names: ['a', 'A'], reals: [0.0, 0.1] },
                                { numbers: [1, 2], names: ['b', 'B'], reals: [0.0, 0.2] },
                                { numbers: [1, 3], names: ['c', 'C'], reals: [0.0, 0.3] },
                                { numbers: [1, 4], names: ['d', 'D'], reals: [0.0, 0.4] },
                                { numbers: [1, 5], names: ['e', 'E'], reals: [0.0, 0.5] },
                            ],
                        },
                    },
                    editor: {
                        editorDetails: {
                            nameOfEditor: `${resourceName} Editor`,
                            descriptionOfEditor: 'Generated with Automation',
                            nameOfResource: resourceName,
                        },
                        editorConfiguration: {
                            editorKey: '',
                            fieldsToConfigureInEditor: [
                                {
                                    FieldID: 'numbers',
                                    Type: udcService.resolveUIType('Integer') || 'TextBox',
                                    Title: 'numbers',
                                    Mandatory: false,
                                    ReadOnly: false,
                                },
                                {
                                    FieldID: 'names',
                                    Type: udcService.resolveUIType('String') || 'TextBox',
                                    Title: 'names',
                                    Mandatory: false,
                                    ReadOnly: false,
                                },
                                {
                                    FieldID: 'reals',
                                    Type: udcService.resolveUIType('Double') || 'TextBox',
                                    Title: 'reals',
                                    Mandatory: false,
                                    ReadOnly: false,
                                },
                            ],
                        },
                    },
                    view: {
                        viewDetails: {
                            nameOfView: `${resourceName} View`,
                            descriptionOfView: 'Generated with Automation',
                            nameOfResource: resourceName,
                        },
                        viewConfiguration: {
                            matchingEditorName: '', //`${resourceName} Editor`,
                            viewKey: '',
                            fieldsToConfigureInView: [
                                {
                                    fieldName: 'numbers',
                                    dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'names',
                                    dataViewType: udcService.resolveUIType('String') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'reals',
                                    dataViewType: udcService.resolveUIType('Double') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                            ],
                            fieldsToConfigureInViewSearch: [{ fieldName: 'Key' }],
                        },
                    },
                    page: {
                        pageDetails: {
                            nameOfPage: `${resourceName} Page`,
                            descriptionOfPage: 'Automated testing',
                            extraSection: false,
                        },
                        pageBlocks: [
                            {
                                blockType: 'Viewer',
                                selectedViews: [
                                    {
                                        collectionName: resourceName,
                                        collectionID: '',
                                        selectedViewUUID: '',
                                        selectedViewName: `${resourceName} View`,
                                    },
                                ],
                            },
                        ],
                    },
                    slug: {
                        slugDisplayName: slugDisplay,
                        slug_path: slugPath,
                        keyOfMappedPage: '',
                        email: email,
                        password: password,
                    },
                    homePageButton: { toAdd: true, slugDisplayName: slugDisplay },
                });
            });
            it('18. Filters Account Ref collection E2E', async function () {
                const resourceName = 'FiltersAccRefAuto';
                const slugDisplay = 'Filters Acc Ref Auto';
                const slugPath = 'filters_acc_ref_auto';
                const acc01UUID = '5737a507-fa00-4c32-a26a-8bc32572e24d';
                const acc02UUID = '56363496-f8ce-42e8-9305-de5d28737e66';
                const acc03UUID = '7fa13cfa-39a5-4901-b8f4-6bbb9ef870cb';
                await e2eUiService.configureResourceE2E(client, {
                    collection: {
                        createUDC: {
                            nameOfCollection: resourceName,
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
                        },
                        addValuesToCollection: {
                            collectionName: resourceName,
                            values: [
                                { from_account: acc02UUID, item: 'Abagada', price: 10.5, quantity: 80, instock: true },
                                {
                                    from_account: acc01UUID,
                                    item: 'Bananza',
                                    price: 0.99,
                                    quantity: 1000,
                                    instock: false,
                                },
                                { from_account: acc03UUID, item: 'Cockie', price: 5.0, quantity: 100, instock: true },
                                { from_account: acc01UUID, item: 'Dove', price: 6.75, quantity: 100, instock: false },
                                { from_account: acc03UUID, item: 'Emerald', price: 66.7, quantity: 1, instock: false },
                                { from_account: acc02UUID, item: 'Funny', price: 66.7, quantity: 80, instock: false },
                                { from_account: acc01UUID, item: 'Great', price: 0.99, quantity: 1, instock: false },
                                { from_account: acc02UUID, item: 'Google', price: 200.99, quantity: 80, instock: true },
                                { from_account: acc01UUID, item: 'Freak', price: 30.5, quantity: 1000, instock: false },
                                { from_account: acc03UUID, item: 'Energy', price: 69.29, quantity: 88, instock: true },
                                { from_account: acc01UUID, item: 'Drone', price: 0.5, quantity: 79, instock: false },
                                { from_account: acc03UUID, item: 'Crazy', price: 10.1, quantity: 101, instock: false },
                                { from_account: acc02UUID, item: 'Brown', price: 70.3, quantity: 70, instock: false },
                                { from_account: acc01UUID, item: 'Apple', price: 22.2, quantity: 1, instock: true },
                            ],
                        },
                    },
                    view: {
                        viewDetails: {
                            nameOfView: `${resourceName} View`,
                            descriptionOfView: 'Generated with Automation',
                            nameOfResource: resourceName,
                        },
                        viewConfiguration: {
                            matchingEditorName: ``,
                            viewKey: '',
                            fieldsToConfigureInView: [
                                {
                                    fieldName: 'from_account',
                                    dataViewType: udcService.resolveUIType('Resource') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'from_account.Name',
                                    dataViewType: udcService.resolveUIType('String') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'from_account.Email',
                                    dataViewType: udcService.resolveUIType('String') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'item',
                                    dataViewType: udcService.resolveUIType('String') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'price',
                                    dataViewType: udcService.resolveUIType('Double') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'quantity',
                                    dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'instock',
                                    dataViewType: udcService.resolveUIType('Bool') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                            ],
                            // fieldsToConfigureInViewSearch: [{ fieldName: 'Key' }, { fieldName: 'item' }],
                            // fieldsToConfigureInViewSmartSearch: [
                            //     { fieldName: 'item' },
                            //     { fieldName: 'price' },
                            //     { fieldName: 'quantity' },
                            //     { fieldName: 'instock' },
                            // ],
                        },
                    },
                    page: {
                        pageDetails: {
                            nameOfPage: `${resourceName} Page`,
                            descriptionOfPage: 'Automated testing',
                            extraSection: false,
                        },
                        pageBlocks: [
                            {
                                blockType: 'Viewer',
                                selectedViews: [
                                    {
                                        collectionName: resourceName,
                                        collectionID: '',
                                        selectedViewUUID: '',
                                        selectedViewName: `${resourceName} View`,
                                    },
                                ],
                            },
                        ],
                    },
                    slug: {
                        slugDisplayName: slugDisplay,
                        slug_path: slugPath,
                        keyOfMappedPage: '',
                        email: email,
                        password: password,
                    },
                    homePageButton: { toAdd: true, slugDisplayName: slugDisplay },
                });
            });
            it('18. Indexed Fields collection E2E', async function () {
                const resourceName = 'IndexedFieldsAuto';
                const slugDisplay = 'Indexed Fields Auto';
                const slugPath = 'indexed_fields_auto';
                await e2eUiService.configureResourceE2E(client, {
                    collection: {
                        createUDC: {
                            nameOfCollection: resourceName,
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
                        },
                        addValuesToCollection: {
                            collectionName: resourceName,
                            values: [
                                { item: 'Aa', price: 10.5, quantity: 80, instock: true },
                                { item: 'Bb', price: 0.99, quantity: 1000, instock: false },
                                { item: 'Cc', price: 5.0, quantity: 100, instock: true },
                                { item: 'Dd', price: 6.75, quantity: 100, instock: false },
                                { item: 'Ee', price: 66.7, quantity: 1, instock: false },
                            ],
                        },
                    },
                    view: {
                        viewDetails: {
                            nameOfView: `${resourceName} View`,
                            descriptionOfView: 'Generated with Automation',
                            nameOfResource: resourceName,
                        },
                        viewConfiguration: {
                            matchingEditorName: ``,
                            viewKey: '',
                            fieldsToConfigureInView: [
                                {
                                    fieldName: 'item',
                                    dataViewType: udcService.resolveUIType('String') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'price',
                                    dataViewType: udcService.resolveUIType('Double') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'quantity',
                                    dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'instock',
                                    dataViewType: udcService.resolveUIType('Bool') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                            ],
                            fieldsToConfigureInViewSearch: [{ fieldName: 'Key' }, { fieldName: 'item' }],
                            fieldsToConfigureInViewSmartSearch: [
                                { fieldName: 'item' },
                                { fieldName: 'price' },
                                { fieldName: 'quantity' },
                                { fieldName: 'instock' },
                            ],
                        },
                    },
                    page: {
                        pageDetails: {
                            nameOfPage: `${resourceName} Page`,
                            descriptionOfPage: 'Automated testing',
                            extraSection: false,
                        },
                        pageBlocks: [
                            {
                                blockType: 'Viewer',
                                selectedViews: [
                                    {
                                        collectionName: resourceName,
                                        collectionID: '',
                                        selectedViewUUID: '',
                                        selectedViewName: `${resourceName} View`,
                                    },
                                ],
                            },
                        ],
                    },
                    slug: {
                        slugDisplayName: slugDisplay,
                        slug_path: slugPath,
                        keyOfMappedPage: '',
                        email: email,
                        password: password,
                    },
                    homePageButton: { toAdd: true, slugDisplayName: slugDisplay },
                });
            });
            it('19. Name Age collection E2E', async function () {
                const resourceName = 'NameAgeAuto';
                const slugDisplay = 'NameAge Auto';
                const slugPath = 'name_age_auto';
                await e2eUiService.configureResourceE2E(client, {
                    collection: {
                        createUDC: {
                            nameOfCollection: resourceName,
                            descriptionOfCollection: 'Created with Automation',
                            fieldsOfCollection: [
                                {
                                    classType: 'Primitive',
                                    fieldName: 'name',
                                    fieldTitle: '',
                                    field: { Type: 'String', Mandatory: true, Indexed: false, Description: '' },
                                },
                                {
                                    classType: 'Primitive',
                                    fieldName: 'age',
                                    fieldTitle: '',
                                    field: { Type: 'Integer', Mandatory: true, Indexed: false, Description: '' },
                                },
                            ],
                        },
                        addValuesToCollection: {
                            collectionName: resourceName,
                            values: [
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
                                { name: 'Bibi', age: 47 },
                                { name: 'Amsalem', age: 99 },
                                { name: 'Uri', age: 19 },
                                { name: 'Motty', age: 18 },
                                { name: 'David', age: 17 },
                                { name: 'Eli', age: 16 },
                                { name: 'Franc', age: 15 },
                                { name: 'Hagit', age: 14 },
                                { name: 'Iris', age: 13 },
                                { name: 'Penny', age: 12 },
                                { name: 'Zux', age: 11 },
                                { name: 'Iris', age: 10 },
                            ],
                        },
                    },
                    view: {
                        viewDetails: {
                            nameOfView: `${resourceName} View`,
                            descriptionOfView: 'Generated with Automation',
                            nameOfResource: resourceName,
                        },
                        viewConfiguration: {
                            matchingEditorName: ``,
                            viewKey: '',
                            fieldsToConfigureInView: [
                                {
                                    fieldName: 'name',
                                    dataViewType: udcService.resolveUIType('String') || 'TextBox',
                                    mandatory: true,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'age',
                                    dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
                                    mandatory: true,
                                    readonly: true,
                                },
                            ],
                            fieldsToConfigureInViewSearch: [],
                        },
                    },
                    page: {
                        pageDetails: {
                            nameOfPage: `${resourceName} Page`,
                            descriptionOfPage: 'Automated testing',
                            extraSection: false,
                        },
                        pageBlocks: [
                            {
                                blockType: 'Viewer',
                                selectedViews: [
                                    {
                                        collectionName: resourceName,
                                        collectionID: '',
                                        selectedViewUUID: '',
                                        selectedViewName: `${resourceName} View`,
                                    },
                                ],
                            },
                        ],
                    },
                    slug: {
                        slugDisplayName: slugDisplay,
                        slug_path: slugPath,
                        keyOfMappedPage: '',
                        email: email,
                        password: password,
                    },
                    homePageButton: { toAdd: true, slugDisplayName: slugDisplay },
                });
            });
            it('20. Indexed Name Age collection E2E', async function () {
                const resourceName = 'IndexedNameAgeAuto';
                const slugDisplay = 'Indexed NameAge Auto';
                const slugPath = 'indexed_name_age_auto';
                await e2eUiService.configureResourceE2E(client, {
                    collection: {
                        createUDC: {
                            nameOfCollection: resourceName,
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
                        },
                        addValuesToCollection: {
                            collectionName: resourceName,
                            values: [
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
                                { name: 'Bibi', age: 78 },
                            ],
                        },
                    },
                    view: {
                        viewDetails: {
                            nameOfView: `${resourceName} View`,
                            descriptionOfView: 'Generated with Automation',
                            nameOfResource: resourceName,
                        },
                        viewConfiguration: {
                            matchingEditorName: ``,
                            viewKey: '',
                            fieldsToConfigureInView: [
                                {
                                    fieldName: 'name',
                                    dataViewType: udcService.resolveUIType('String') || 'TextBox',
                                    mandatory: true,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'age',
                                    dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
                                    mandatory: true,
                                    readonly: true,
                                },
                                {
                                    fieldName: 'Key',
                                    dataViewType: udcService.resolveUIType('String') || 'TextBox',
                                    mandatory: false,
                                    readonly: true,
                                },
                            ],
                            fieldsToConfigureInViewMenu: [],
                            fieldsToConfigureInViewLineMenu: [],
                        },
                    },
                    page: {
                        pageDetails: {
                            nameOfPage: `${resourceName} Page`,
                            descriptionOfPage: 'Automated testing',
                            extraSection: false,
                        },
                        pageBlocks: [
                            {
                                blockType: 'Viewer',
                                selectedViews: [
                                    {
                                        collectionName: resourceName,
                                        collectionID: '',
                                        selectedViewUUID: '',
                                        selectedViewName: `${resourceName} View`,
                                    },
                                ],
                            },
                        ],
                    },
                    slug: {
                        slugDisplayName: slugDisplay,
                        slug_path: slugPath,
                        keyOfMappedPage: '',
                        email: email,
                        password: password,
                    },
                    homePageButton: { toAdd: true, slugDisplayName: slugDisplay },
                });
            });
            //     it('21. Reference Account collection E2E', async function () {
            //         const resourceName = 'ReferenceAccountAuto';
            //         const slugDisplay = 'Ref Account Auto';
            //         const slugPath = 'ref_account_auto';
            //         const acc01UUID = '5737a507-fa00-4c32-a26a-8bc32572e24d';
            //         const acc02UUID = '56363496-f8ce-42e8-9305-de5d28737e66';
            //         const acc03UUID = '7fa13cfa-39a5-4901-b8f4-6bbb9ef870cb';
            //         await e2eUiService.configureResourceE2E(client, {
            //             collection: {
            //                 createUDC: {
            //                     nameOfCollection: resourceName,
            //                     descriptionOfCollection: 'Created with Automation',
            //                     fieldsOfCollection: [
            //                         {
            //                             classType: 'Resource',
            //                             fieldName: 'of_account',
            //                             fieldTitle: '',
            //                             field: {
            //                                 Type: 'Resource',
            //                                 Resource: 'accounts',
            //                                 Description: '',
            //                                 Mandatory: false,
            //                                 Indexed: true,
            //                                 IndexedFields: {
            //                                     Email: { Indexed: true, Type: 'String' },
            //                                     Name: { Indexed: true, Type: 'String' },
            //                                     UUID: { Indexed: true, Type: 'String' },
            //                                 },
            //                                 Items: { Description: '', Mandatory: false, Type: 'String' },
            //                                 OptionalValues: [],
            //                                 AddonUUID: coreResourcesUUID,
            //                             },
            //                         },
            //                         {
            //                             classType: 'Primitive',
            //                             fieldName: 'best_seller_item',
            //                             fieldTitle: '',
            //                             field: {
            //                                 Type: 'String',
            //                                 Description: '',
            //                                 AddonUUID: '',
            //                                 ApplySystemFilter: false,
            //                                 Mandatory: false,
            //                                 Indexed: false,
            //                                 IndexedFields: {},
            //                                 OptionalValues: [
            //                                     'A',
            //                                     'B',
            //                                     'C',
            //                                     'D',
            //                                     'Hair dryer',
            //                                     'Roller',
            //                                     'Cart',
            //                                     'Mask',
            //                                     'Shirt',
            //                                     '',
            //                                 ],
            //                             },
            //                         },
            //                         {
            //                             classType: 'Primitive',
            //                             fieldName: 'max_quantity',
            //                             fieldTitle: '',
            //                             field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
            //                         },
            //                         {
            //                             classType: 'Primitive',
            //                             fieldName: 'discount_rate',
            //                             fieldTitle: '',
            //                             field: { Type: 'Double', Mandatory: false, Indexed: false, Description: '' },
            //                         },
            //                         {
            //                             classType: 'Array',
            //                             fieldName: 'offered_discount_location',
            //                             fieldTitle: '',
            //                             field: {
            //                                 Type: 'String',
            //                                 Mandatory: false,
            //                                 Indexed: false,
            //                                 Description: '',
            //                                 OptionalValues: ['store', 'on-line', 'rep'],
            //                             },
            //                         },
            //                     ],
            //                 },
            //                 addValuesToCollection: {
            //                     collectionName: resourceName,
            //                     values: [
            //                         {
            //                             of_account: acc03UUID,
            //                             best_seller_item: 'Cart',
            //                             max_quantity: 1500,
            //                         },
            //                         {
            //                             of_account: '',
            //                             best_seller_item: '',
            //                             max_quantity: 100000,
            //                             discount_rate: 0.1,
            //                             offered_discount_location: [],
            //                         },
            //                         {
            //                             of_account: acc02UUID,
            //                             best_seller_item: '',
            //                             max_quantity: 1,
            //                             discount_rate: 0.1,
            //                             offered_discount_location: ['rep'],
            //                         },
            //                         {
            //                             of_account: acc01UUID,
            //                             best_seller_item: 'Hair dryer',
            //                             max_quantity: 0,
            //                             discount_rate: 0.4,
            //                             offered_discount_location: ['store', 'on-line', 'rep'],
            //                         },
            //                         {
            //                             of_account: acc02UUID,
            //                             best_seller_item: 'Mask',
            //                             max_quantity: 40000,
            //                             discount_rate: 0.15,
            //                             offered_discount_location: ['store', 'on-line'],
            //                         },
            //                         {
            //                             of_account: acc03UUID,
            //                             max_quantity: 600,
            //                             discount_rate: 0.1,
            //                             offered_discount_location: [],
            //                         },
            //                         {
            //                             of_account: acc01UUID,
            //                             best_seller_item: 'Shirt',
            //                             max_quantity: 55,
            //                             discount_rate: 0.22,
            //                         },
            //                         {
            //                             of_account: acc03UUID,
            //                             best_seller_item: 'item2',
            //                             discount_rate: 0.3,
            //                             offered_discount_location: ['store'],
            //                         },
            //                         {
            //                             best_seller_item: 'A',
            //                             max_quantity: 111,
            //                             discount_rate: 0.35,
            //                             offered_discount_location: ['on-line'],
            //                         },
            //                     ],
            //                 },
            //             },
            //             view: {
            //                 viewDetails: {
            //                     nameOfView: `${resourceName} View`,
            //                     descriptionOfView: 'Generated with Automation',
            //                     nameOfResource: resourceName,
            //                 },
            //                 viewConfiguration: {
            //                     matchingEditorName: ``,
            //                     viewKey: '',
            //                     fieldsToConfigureInView: [
            //                         {
            //                             fieldName: 'of_account',
            //                             dataViewType: udcService.resolveUIType('Resource') || 'TextBox',
            //                             mandatory: false,
            //                             readonly: true,
            //                         },
            //                         {
            //                             fieldName: 'of_account.Name',
            //                             dataViewType: udcService.resolveUIType('String') || 'TextBox',
            //                             mandatory: false,
            //                             readonly: true,
            //                         },
            //                         {
            //                             fieldName: 'of_account.Email',
            //                             dataViewType: udcService.resolveUIType('String') || 'TextBox',
            //                             mandatory: false,
            //                             readonly: true,
            //                         },
            //                         {
            //                             fieldName: 'best_seller_item',
            //                             dataViewType: udcService.resolveUIType('String') || 'TextBox',
            //                             mandatory: false,
            //                             readonly: true,
            //                         },
            //                         {
            //                             fieldName: 'max_quantity',
            //                             dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
            //                             mandatory: false,
            //                             readonly: true,
            //                         },
            //                         {
            //                             fieldName: 'discount_rate',
            //                             dataViewType: udcService.resolveUIType('Double') || 'TextBox',
            //                             mandatory: false,
            //                             readonly: true,
            //                         },
            //                         {
            //                             fieldName: 'offered_discount_location',
            //                             dataViewType: udcService.resolveUIType('Array') || 'TextBox',
            //                             mandatory: false,
            //                             readonly: true,
            //                         },
            //                     ],
            //                 },
            //             },
            //             page: {
            //                 pageDetails: {
            //                     nameOfPage: `${resourceName} Page`,
            //                     descriptionOfPage: 'Automated testing',
            //                     extraSection: false,
            //                 },
            //                 pageBlocks: [
            //                     {
            //                         blockType: 'Viewer',
            //                         selectedViews: [
            //                             {
            //                                 collectionName: resourceName,
            //                                 collectionID: '',
            //                                 selectedViewUUID: '',
            //                                 selectedViewName: `${resourceName} View`,
            //                             },
            //                         ],
            //                     },
            //                 ],
            //             },
            //             slug: {
            //                 slugDisplayName: slugDisplay,
            //                 slug_path: slugPath,
            //                 keyOfMappedPage: '',
            //                 email: email,
            //                 password: password,
            //             },
            //             homePageButton: { toAdd: true, slugDisplayName: slugDisplay },
            //         });
            //     });
            //     it('30. Visit Flow Steps', async function () {
            //         const resourceName = 'VisitFlowSteps';
            //         await e2eUiService.configureResourceE2E(client, {
            //             view: {
            //                 viewDetails: {
            //                     nameOfView: `${resourceName} View`,
            //                     descriptionOfView: '',
            //                     nameOfResource: resourceName,
            //                 },
            //                 viewConfiguration: {
            //                     matchingEditorName: '',
            //                     viewKey: '',
            //                     fieldsToConfigureInView: [
            //                         {
            //                             fieldName: '',
            //                             dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
            //                             mandatory: false,
            //                             readonly: false,
            //                         },
            //                     ],
            //                     fieldsToConfigureInViewMenu: [{ fieldName: '' }],
            //                     fieldsToConfigureInViewLineMenu: [{ fieldName: '' }],
            //                     fieldsToConfigureInViewSmartSearch: [{ fieldName: '' }],
            //                     fieldsToConfigureInViewSearch: [{ fieldName: '' }],
            //                 },
            //             },
            //             page: {
            //                 pageDetails: { nameOfPage: '', descriptionOfPage: '', extraSection: false },
            //                 pageBlocks: [
            //                     {
            //                         blockType: 'Viewer',
            //                         selectedViews: [
            //                             {
            //                                 collectionName: '',
            //                                 collectionID: '',
            //                                 selectedViewUUID: '',
            //                                 selectedViewName: '',
            //                             },
            //                         ],
            //                     },
            //                 ],
            //             },
            //             slug: {
            //                 slugDisplayName: '',
            //                 slug_path: '',
            //                 keyOfMappedPage: '',
            //                 email: email,
            //                 password: password,
            //             },
            //             homePageButton: { toAdd: true, slugDisplayName: '' },
            //         });
            //     });
            //     it('31. Visit Flow Groups', async function () {
            //         const resourceName = 'VisitFlowGroups';
            //         await e2eUiService.configureResourceE2E(client, {
            //             editor: {
            //                 editorDetails: {
            //                     nameOfEditor: `${resourceName} Editor`,
            //                     descriptionOfEditor: 'Generated with Automation',
            //                     nameOfResource: resourceName,
            //                 },
            //                 editorConfiguration: {
            //                     editorKey: '',
            //                     fieldsToConfigureInEditor: [
            //                         {
            //                             FieldID: '',
            //                             Type: udcService.resolveUIType('Integer') || 'TextBox',
            //                             Title: '',
            //                             Mandatory: false,
            //                             ReadOnly: false,
            //                         },
            //                     ],
            //                 },
            //             },
            //             view: {
            //                 viewDetails: {
            //                     nameOfView: `${resourceName} View`,
            //                     descriptionOfView: 'Generated with Automation',
            //                     nameOfResource: resourceName,
            //                 },
            //                 viewConfiguration: {
            //                     matchingEditorName: '',
            //                     viewKey: '',
            //                     fieldsToConfigureInView: [
            //                         {
            //                             fieldName: '',
            //                             dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
            //                             mandatory: false,
            //                             readonly: false,
            //                         },
            //                     ],
            //                     fieldsToConfigureInViewMenu: [{ fieldName: '' }],
            //                     fieldsToConfigureInViewLineMenu: [{ fieldName: '' }],
            //                     fieldsToConfigureInViewSmartSearch: [{ fieldName: '' }],
            //                     fieldsToConfigureInViewSearch: [{ fieldName: '' }],
            //                 },
            //             },
            //             page: {
            //                 pageDetails: { nameOfPage: '', descriptionOfPage: '', extraSection: false },
            //                 pageBlocks: [
            //                     {
            //                         blockType: 'Viewer',
            //                         selectedViews: [
            //                             {
            //                                 collectionName: '',
            //                                 collectionID: '',
            //                                 selectedViewUUID: '',
            //                                 selectedViewName: '',
            //                             },
            //                         ],
            //                     },
            //                 ],
            //             },
            //             slug: {
            //                 slugDisplayName: '',
            //                 slug_path: '',
            //                 keyOfMappedPage: '',
            //                 email: email,
            //                 password: password,
            //             },
            //             homePageButton: { toAdd: true, slugDisplayName: '' },
            //         });
            //     });
            //     it('32. Visit Flows', async function () {
            //         const resourceName = 'VisitFlows';
            //         await e2eUiService.configureResourceE2E(client, {
            //             view: {
            //                 viewDetails: {
            //                     nameOfView: `${resourceName} View`,
            //                     descriptionOfView: '',
            //                     nameOfResource: resourceName,
            //                 },
            //                 viewConfiguration: {
            //                     matchingEditorName: '',
            //                     viewKey: '',
            //                     fieldsToConfigureInView: [
            //                         {
            //                             fieldName: '',
            //                             dataViewType: udcService.resolveUIType('Integer') || 'TextBox',
            //                             mandatory: false,
            //                             readonly: false,
            //                         },
            //                     ],
            //                     fieldsToConfigureInViewMenu: [{ fieldName: '' }],
            //                     fieldsToConfigureInViewLineMenu: [{ fieldName: '' }],
            //                     fieldsToConfigureInViewSmartSearch: [{ fieldName: '' }],
            //                     fieldsToConfigureInViewSearch: [{ fieldName: '' }],
            //                 },
            //             },
            //             page: {
            //                 pageDetails: { nameOfPage: '', descriptionOfPage: '', extraSection: false },
            //                 pageBlocks: [
            //                     {
            //                         blockType: 'Viewer',
            //                         selectedViews: [
            //                             {
            //                                 collectionName: '',
            //                                 collectionID: '',
            //                                 selectedViewUUID: '',
            //                                 selectedViewName: '',
            //                             },
            //                         ],
            //                     },
            //                 ],
            //             },
            //             slug: {
            //                 slugDisplayName: '',
            //                 slug_path: '',
            //                 keyOfMappedPage: '',
            //                 email: email,
            //                 password: password,
            //             },
            //             homePageButton: { toAdd: true, slugDisplayName: '' },
            //         });
            //     });

            describe('TearDown', () => {
                it('Deleting the Documents of the UDC "ReferenceAccountAuto" with API', async () => {
                    const getReferenceAccountAuto = await udcService.getAllObjectFromCollectionCount(
                        'ReferenceAccountAuto',
                    );
                    console.info(`getReferenceAccountAuto: ${JSON.stringify(getReferenceAccountAuto, null, 2)}`);
                    getReferenceAccountAuto.objects.forEach(async (document) => {
                        const deleteDocument = await udcService.hideObjectInACollection(
                            'ReferenceAccountAuto',
                            document.Key,
                        );
                        console.info(`deleteDocument: ${JSON.stringify(deleteDocument, null, 2)}`);
                        expect(deleteDocument.Ok).to.be.true;
                        expect(deleteDocument.Status).to.equal(200);
                        expect(deleteDocument.Error).to.eql({});
                    });
                });
                it('Removing "Ref Account" Button from Home Screen', async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHeader.openSettings();
                    driver.sleep(1 * 1000);
                    await brandedApp.removeAdminHomePageButtons(referenceAccountSlugDisplayName);
                    await webAppHomePage.manualResync(client);
                    const isNotFound = await webAppHomePage.validateATDIsNOTApearingOnHomeScreen(
                        referenceAccountSlugDisplayName,
                    );
                    expect(isNotFound).to.equal(true);
                });
                it('Deleting the Slug "ref_account_auto" with API', async () => {
                    const deleteSlugResponse = await slugs.deleteSlugByName(referenceAccountSlugPath, client);
                    expect(deleteSlugResponse.Ok).to.be.true;
                    expect(deleteSlugResponse.Status).to.equal(200);
                    expect(deleteSlugResponse.Error).to.eql({});
                    expect(deleteSlugResponse.Body.success).to.be.true;
                    expect(
                        await (
                            await slugs.getSlugs(client)
                        ).Body.find((item) => item.Slug === referenceAccountSlugPath),
                    ).to.be.undefined;
                });
                it('Deleting the Page "ReferenceAccountAuto Page" with API', async () => {
                    const deletePageResponse = await pageBuilder.removePageByKey(referenceAccountAutoPageUUID, client);
                    expect(deletePageResponse.Ok).to.equal(true);
                    expect(deletePageResponse.Status).to.equal(200);
                    expect(deletePageResponse.Body).to.equal(true);
                });
                it('Deleting the View "ReferenceAccountAuto View" with API', async () => {
                    const deleteViewResponse = await resourceViews.deleteViewViaApiByUUID(
                        referenceAccountAutoViewUUID,
                        client,
                    );
                    expect(deleteViewResponse.Ok).to.equal(true);
                    expect(deleteViewResponse.Status).to.equal(200);
                    expect(deleteViewResponse.Body).to.equal(true);
                });
                it('Deleting the UDC "ReferenceAccountAuto" with API', async () => {
                    generalService.sleep(5 * 1000);
                    const deleteResponse = await udcService.hideCollection('ReferenceAccountAuto');
                    console.info(`deleteResponse: ${JSON.stringify(deleteResponse, null, 2)}`);
                    expect(deleteResponse.Ok).to.be.true;
                    expect(deleteResponse.Status).to.equal(200);
                    expect(deleteResponse.Error).to.eql({});
                });
            });

            it('Deleting the View "ReferenceAccountAuto View" with API', async () => {
                await e2eUiService.navigateTo('Resource Views');
                await resourceViews.validateViewsListPageIsLoaded();
                await resourceViews.deleteFromListByName('IndexedFieldsAuto View');
                resourceViews.pause(10 * 1000);
                // expect(deleteViewResponse.Ok).to.equal(true);
                // expect(deleteViewResponse.Status).to.equal(200);
                // expect(deleteViewResponse.Body).to.equal(true);
            });
        });
    });
}
