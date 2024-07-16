import promised from 'chai-as-promised';
import { Client } from '@pepperi-addons/debug-server/dist';
import { Browser } from '../utilities/browser';
import { WebAppLoginPage, WebAppHomePage, WebAppHeader, WebAppList, WebAppAPI } from '../pom';
import { describe, it, afterEach, before, after, Context } from 'mocha';
import chai, { expect } from 'chai';
import { ResourceListABI } from '../pom/addons/ResourceListABI';
import { By } from 'selenium-webdriver';
import GeneralService from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';
import { OpenCatalogService } from '../../services/open-catalog.service';
import { UDCService } from '../../services/user-defined-collections.service';
import { ListAbiTestData } from '../pom/addons/ListAbiTestData';
import addContext from 'mochawesome/addContext';
import E2EUtils from '../utilities/e2e_utils';
import { CollectionField, DataViewFieldType } from '@pepperi-addons/papi-sdk';

chai.use(promised);

export async function ResourceListAbiTests(email: string, password: string, client: Client, varPass: string) {
    /** Description **/
    /* for the purpose of this test an Addon named "ResourceListABI_Addon" was created *
    /* it's code can be found at the following repository: https://github.com/Pepperi-Addons/resource-list-abi-tests/tree/main/client-side/src/app/settings/rl-abi *
    /* the Addon provides a set of list containers that through the "Resource List ABI" are displayed as Generic List inside a Dialog - upon a button click *
    /* the access to the UI of the Addon is either via the Settings Side Panel, or through the path:
    * https://app.pepperi.com/settings_block/cd3ba412-66a4-42f4-8abc-65768c5dc606/resource_list_abi/view *
    * or through the Home Page Slug: "Resource List ABI" */

    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const objectsService = new ObjectsService(generalService);
    const openCatalogService = new OpenCatalogService(generalService);
    const dateTime = new Date();
    const coreResourcesUUID = 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f';
    const baseUrl = `https://${client.BaseURL.includes('staging') ? 'app.sandbox.pepperi.com' : 'app.pepperi.com'}`;

    await generalService.baseAddonVersionsInstallation(varPass);

    const testData = {
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        ResourceListABI_Addon: ['cd3ba412-66a4-42f4-8abc-65768c5dc606', ''],
        Nebula: ['00000000-0000-0000-0000-000000006a91', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '1.%'], // to prevent open sync from being installed (2.0.%)
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
        // 'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        // configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        // 'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '1.6.%'], // CPI_Node
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', '0.6.%'],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    // const isInstalledArr = await generalService.areAddonsInstalled(testData);

    const refAccTruncateResponse = await udcService.truncateScheme('ReferenceAccountAuto');
    console.info(`ReferenceAccountAuto truncateResponse: ${JSON.stringify(refAccTruncateResponse, null, 2)}`);

    const filtersTruncateResponse = await udcService.truncateScheme('FiltersAccRefAuto');
    console.info(`FiltersAccRefAuto truncateResponse: ${JSON.stringify(filtersTruncateResponse, null, 2)}`);

    const installedResourceListVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Resource List',
    )?.Version;

    const items = await openCatalogService.getItems('?page_size=-1');
    const accounts = await objectsService.getAccounts({ page_size: -1 });
    // console.info('items: ', JSON.stringify(items, null, 2));
    // console.info('accounts: ', JSON.stringify(accounts, null, 2));
    const accountsUUIDs = {};
    accountsUUIDs['First Account'] = accounts?.filter((account) => {
        if (account.Name?.includes('First ')) {
            return account;
        }
    })[0]['UUID'];
    accountsUUIDs['Second Account'] = accounts?.filter((account) => {
        if (account.Name?.includes('Second ')) {
            return account;
        }
    })[0]['UUID'];
    accountsUUIDs['Third Account'] = accounts?.filter((account) => {
        if (account.Name?.includes('Third ')) {
            return account;
        }
    })[0]['UUID'];
    console.info('First Account: ', JSON.stringify(accountsUUIDs['First Account'], null, 2));
    console.info('Second Account: ', JSON.stringify(accountsUUIDs['Second Account'], null, 2));
    console.info('Third Account: ', JSON.stringify(accountsUUIDs['Third Account'], null, 2));

    const detailsByResource: {
        [key: string]: {
            view_fields_names: string[];
            view_fields: {
                fieldName: string;
                dataViewType: DataViewFieldType;
                mandatory: boolean;
                readonly: boolean;
            }[];
            collectionType?: 'contained' | 'data';
            collectionFields?: {
                classType: 'Primitive' | 'Array' | 'Contained' | 'Resource' | 'ContainedArray';
                fieldName: string;
                fieldTitle: string;
                field: CollectionField;
                dataViewType?: DataViewFieldType;
                readonly?: boolean;
            }[];
            listings?: { [key: string]: any }[];
        };
    } = {
        ReferenceAccountAuto: {
            view_fields_names: [
                'of_account',
                'of_account.Name',
                'best_seller_item',
                'max_quantity',
                'discount_rate',
                'offered_discount_location',
            ],
            view_fields: [
                { fieldName: 'of_account', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'of_account.Name', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'best_seller_item', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'max_quantity', dataViewType: 'NumberInteger', mandatory: true, readonly: true },
                { fieldName: 'discount_rate', dataViewType: 'NumberReal', mandatory: true, readonly: true },
                { fieldName: 'offered_discount_location', dataViewType: 'TextBox', mandatory: true, readonly: true },
            ],
            collectionFields: [
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
                        OptionalValues: ['A', 'B', 'C', 'D', 'Hair dryer', 'Roller', 'Cart', 'Mask', 'Shirt', ''],
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
            listings: [
                { of_account: accountsUUIDs['Third Account'], best_seller_item: 'Daisy', max_quantity: 1500 },
                {
                    of_account: accountsUUIDs['Third Account'],
                    best_seller_item: '',
                    max_quantity: 100000,
                    discount_rate: 0.1,
                    offered_discount_location: [],
                },
                {
                    of_account: accountsUUIDs['Second Account'],
                    best_seller_item: 'Lily',
                    max_quantity: 1,
                    discount_rate: 0.1,
                    offered_discount_location: ['rep'],
                },
                {
                    of_account: accountsUUIDs['First Account'],
                    best_seller_item: 'Rose',
                    max_quantity: 0,
                    discount_rate: 0.4,
                    offered_discount_location: ['store', 'on-line', 'rep'],
                },
                {
                    of_account: accountsUUIDs['Second Account'],
                    best_seller_item: 'Iris',
                    max_quantity: 40000,
                    discount_rate: 0.15,
                    offered_discount_location: ['store', 'on-line'],
                },
                {
                    of_account: accountsUUIDs['Third Account'],
                    max_quantity: 600,
                    discount_rate: 0.1,
                    offered_discount_location: [],
                },
                {
                    of_account: accountsUUIDs['First Account'],
                    best_seller_item: '',
                    max_quantity: 55,
                    discount_rate: 0.22,
                },
                {
                    of_account: accountsUUIDs['Third Account'],
                    best_seller_item: 'Tulip',
                    discount_rate: 0.3,
                    offered_discount_location: ['store'],
                },
                {
                    of_account: accountsUUIDs['First Account'],
                    best_seller_item: 'NO Amount',
                    max_quantity: 111,
                    discount_rate: 0.35,
                    offered_discount_location: ['on-line'],
                },
                {
                    of_account: accountsUUIDs['First Account'],
                    best_seller_item: 'First Item',
                    max_quantity: 1111,
                    discount_rate: 0.11,
                    offered_discount_location: ['store', 'on-line', 'rep'],
                },
                {
                    of_account: accountsUUIDs['Second Account'],
                    best_seller_item: 'Second Item',
                    max_quantity: 2222,
                    discount_rate: 0.22,
                    offered_discount_location: ['on-line', 'rep', 'store'],
                },
                {
                    of_account: accountsUUIDs['Third Account'],
                    best_seller_item: 'Third Item',
                    max_quantity: 3333,
                    discount_rate: 0.33,
                    offered_discount_location: ['rep', 'store', 'on-line'],
                },
            ],
        },
        FiltersAccRefAuto: {
            view_fields_names: ['from_account', 'item', 'price', 'quantity', 'instock'],
            view_fields: [
                { fieldName: 'from_account', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'of_account.Name', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'item', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'price', dataViewType: 'NumberReal', mandatory: true, readonly: true },
                { fieldName: 'quantity', dataViewType: 'NumberInteger', mandatory: true, readonly: true },
                { fieldName: 'instock', dataViewType: 'Boolean', mandatory: true, readonly: true },
            ],
            collectionFields: [
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
            listings: [
                {
                    from_account: accountsUUIDs['First Account'],
                    item: 'Abagada',
                    price: 10.5,
                    quantity: 80,
                    instock: true,
                },
                {
                    from_account: accountsUUIDs['Third Account'],
                    item: 'Bananza',
                    price: 0.99,
                    quantity: 1000,
                    instock: false,
                },
                {
                    from_account: accountsUUIDs['Second Account'],
                    item: 'Cockie',
                    price: 5.0,
                    quantity: 100,
                    instock: true,
                },
                {
                    from_account: accountsUUIDs['Third Account'],
                    item: 'Dov',
                    price: 6.75,
                    quantity: 100,
                    instock: false,
                },
                {
                    from_account: accountsUUIDs['Second Account'],
                    item: 'Emerald',
                    price: 66.7,
                    quantity: 1,
                    instock: false,
                },
                {
                    from_account: accountsUUIDs['First Account'],
                    item: 'Funny',
                    price: 66.7,
                    quantity: 80,
                    instock: false,
                },
                {
                    from_account: accountsUUIDs['Third Account'],
                    item: 'Great',
                    price: 0.99,
                    quantity: 1,
                    instock: false,
                },
            ],
        },
        SchemeOnlyObjectAuto: {
            view_fields_names: ['name', 'age'],
            view_fields: [
                { fieldName: 'name', dataViewType: 'TextBox', mandatory: false, readonly: true },
                { fieldName: 'age', dataViewType: 'TextBox', mandatory: false, readonly: true },
            ],
            collectionType: 'contained',
            collectionFields: [
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
        },
    };

    const refAcc = 'ReferenceAccountAuto';
    const refAccCollectionValues = detailsByResource[refAcc].listings;
    if (refAccCollectionValues) {
        const refAccUpsertingValues_Responses = await Promise.all(
            refAccCollectionValues.map(async (listing) => {
                return await udcService.listingsInsertionToCollection(listing, refAcc);
            }),
        );
        refAccUpsertingValues_Responses.forEach((upsertingValues_Response) => {
            console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
        });
    }

    const filters = 'FiltersAccRefAuto';
    const filtersCollectionValues = detailsByResource[filters].listings;
    if (filtersCollectionValues) {
        const filtersUpsertingValues_Responses = await Promise.all(
            filtersCollectionValues.map(async (listing) => {
                return await udcService.listingsInsertionToCollection(listing, filters);
            }),
        );
        filtersUpsertingValues_Responses.forEach((upsertingValues_Response) => {
            console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
        });
    }

    const items_filtered_MaNa = items?.filter((item) => {
        if (item.ExternalID.includes('MaNa')) {
            return item;
        }
    });
    const items_filtered_a = items?.filter((item) => {
        if (item.Name.toLowerCase().includes('a')) {
            return item;
        }
    });
    const accounts_filtered_a = accounts?.filter((account) => {
        if (account.Name?.toLowerCase().includes('a')) {
            return account;
        }
    });
    const referenceAccountAuto = await udcService.getAllObjectFromCollectionCount('ReferenceAccountAuto');
    const filtersAccRefAuto = await udcService.getAllObjectFromCollectionCount('FiltersAccRefAuto');
    const arraysOfPrimitivesAuto = await udcService.getAllObjectFromCollectionCount('ArraysOfPrimitivesAuto');
    const containedArrayAuto = await udcService.getAllObjectFromCollectionCount('ContainedArrayAuto');

    const numOfListingsIn_items: number = items?.length;
    const numOfListingsIn_accounts: number = accounts?.length;
    const numOfListingsIn_items_filtered_MaNa: number = items_filtered_MaNa?.length;
    const numOfListingsIn_items_filtered_a: number = items_filtered_a?.length;
    const numOfListingsIn_accounts_filtered_a: number = accounts_filtered_a?.length;
    const numOfListingsIn_ReferenceAccountAuto: number = referenceAccountAuto?.objects?.length;
    const numOfListingsIn_FiltersAccRefAuto: number = filtersAccRefAuto?.objects?.length;
    const numOfListingsIn_ArraysOfPrimitivesAuto: number = arraysOfPrimitivesAuto?.objects?.length;
    const numOfListingsIn_ContainedArray: number = containedArrayAuto?.objects?.length;

    const lists: ListAbiTestData = new ListAbiTestData(
        numOfListingsIn_items,
        numOfListingsIn_accounts,
        numOfListingsIn_items_filtered_MaNa,
        numOfListingsIn_accounts_filtered_a,
        numOfListingsIn_items_filtered_a,
        numOfListingsIn_ReferenceAccountAuto,
        numOfListingsIn_FiltersAccRefAuto,
        numOfListingsIn_ArraysOfPrimitivesAuto,
        numOfListingsIn_ContainedArray,
    );

    let driver: Browser;
    let webAppAPI: WebAppAPI;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let webAppList: WebAppList;
    let resourceListABI: ResourceListABI;
    let e2eUtils: E2EUtils;
    let enteredAbiSlug = true;

    describe(`Resource List ABI Test Suite - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } || Ver ${installedResourceListVersion} || ${dateTime}`, async () => {
        before(async function () {
            console.info('numOfListingsIn_accounts: ', JSON.stringify(numOfListingsIn_accounts, null, 2));
            console.info('numOfListingsIn_items: ', JSON.stringify(numOfListingsIn_items, null, 2));
            console.info(
                'numOfListingsIn_ReferenceAccountAuto: ',
                JSON.stringify(numOfListingsIn_ReferenceAccountAuto, null, 2),
            );
            console.info(
                'numOfListingsIn_FiltersAccRefAuto: ',
                JSON.stringify(numOfListingsIn_FiltersAccRefAuto, null, 2),
            );
            console.info(
                'numOfListingsIn_items_filtered_MaNa: ',
                JSON.stringify(numOfListingsIn_items_filtered_MaNa, null, 2),
            );
            console.info(
                'numOfListingsIn_items_filtered_a: ',
                JSON.stringify(numOfListingsIn_items_filtered_a, null, 2),
            );
            console.info(
                'numOfListingsIn_accounts_filtered_a: ',
                JSON.stringify(numOfListingsIn_accounts_filtered_a, null, 2),
            );
            console.info(
                'numOfListingsIn_ArraysOfPrimitivesAuto: ',
                JSON.stringify(numOfListingsIn_ArraysOfPrimitivesAuto, null, 2),
            );
            console.info('numOfListingsIn_ContainedArray: ', JSON.stringify(numOfListingsIn_ContainedArray, null, 2));

            // console.info('lists: ', JSON.stringify(lists, null, 2));
        });

        it('Validating Resources Data', async () => {
            expect(typeof numOfListingsIn_items).to.equal('number');
            expect(typeof numOfListingsIn_accounts).to.equal('number');
            expect(typeof numOfListingsIn_items_filtered_MaNa).to.equal('number');
            expect(typeof numOfListingsIn_items_filtered_a).to.equal('number');
            expect(typeof numOfListingsIn_accounts_filtered_a).to.equal('number');
            expect(typeof numOfListingsIn_ReferenceAccountAuto).to.equal('number');
            expect(typeof numOfListingsIn_FiltersAccRefAuto).to.equal('number');
            expect(typeof numOfListingsIn_ArraysOfPrimitivesAuto).to.equal('number');
            expect(typeof numOfListingsIn_ContainedArray).to.equal('number');
            expect(numOfListingsIn_items).to.be.greaterThan(0);
            expect(numOfListingsIn_accounts).to.be.greaterThan(0);
            expect(numOfListingsIn_items_filtered_MaNa).to.be.greaterThan(0);
            expect(numOfListingsIn_items_filtered_a).to.be.greaterThan(0);
            expect(numOfListingsIn_accounts_filtered_a).to.be.greaterThan(0);
            expect(numOfListingsIn_ReferenceAccountAuto).to.be.greaterThan(0);
            expect(numOfListingsIn_FiltersAccRefAuto).to.be.greaterThan(0);
            expect(numOfListingsIn_ArraysOfPrimitivesAuto).to.be.greaterThan(0);
            expect(numOfListingsIn_ContainedArray).to.be.greaterThan(0);
        });

        // bug: DI-27584
        // it(`Setting Collection's Sync Definition to True (Offline Online) & Validating Collection's Structure + Fields`, async () => {
        //     const collectionsNames = Object.keys(udcsForTest);
        //     const postSchemeResponses = await Promise.all(
        //         collectionsNames.map(async (collectionName) => {
        //             return await udcService.postScheme({ Name: collectionName, SyncData: { Sync: true } });
        //         }),
        //     );
        //     postSchemeResponses.forEach((response, index) => {
        //         const collectionName = collectionsNames[index];
        //         const fieldsNames = Object.keys(udcsForTest[collectionName]);
        //         expect(response).to.not.equal(undefined);
        //         expect(response).to.be.an('object');
        //         Object.keys(response).forEach((collectionProperty) => {
        //             expect(collectionProperty).to.be.oneOf(collectionProperties);
        //         });
        //         expect(response).to.haveOwnProperty('Name');
        //         expect(response).to.haveOwnProperty('Fields');
        //         expect(response).to.haveOwnProperty('SyncData');
        //         expect(response.Name).to.equal(collectionName);
        //         expect(response.Fields).to.be.an('object');
        //         if (response.Fields != undefined) {
        //             expect(Object.keys(response.Fields)).to.have.lengthOf.greaterThan(0).and.to.eql(fieldsNames);
        //             fieldsNames.forEach((fieldName) => {
        //                 const expectedFieldType = udcsForTest[collectionName][fieldName];
        //                 if (response.Fields != undefined) {
        //                     expect(response.Fields).to.haveOwnProperty(fieldName);
        //                     const field = response.Fields[fieldName];
        //                     expect(field).to.be.an('object').and.haveOwnProperty('Type');
        //                     expect(field.Type).to.equal(expectedFieldType);
        //                 }
        //             });
        //         }
        //         expect(response.SyncData).to.eql({ Sync: false, SyncFieldLevel: false });
        //     });
        // });

        describe('RL ABI UI tests', async () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppAPI = new WebAppAPI(driver, client);
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                webAppList = new WebAppList(driver);
                resourceListABI = new ResourceListABI(driver);
                e2eUtils = new E2EUtils(driver);
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async () => {
                await webAppLoginPage.login(email, password);
            });

            it('Manual Resync', async function () {
                await e2eUtils.performManualResync.bind(this)(client, driver);
            });

            it('If Error popup appear - close it', async function () {
                await driver.refresh();
                const accessToken = await webAppAPI.getAccessToken();
                let errorDialogAppear = true;
                do {
                    await webAppAPI.pollForResyncResponse(accessToken, 100);
                    try {
                        errorDialogAppear = await webAppHomePage.isErrorDialogOnHomePage(this);
                    } catch (error) {
                        console.error(error);
                    } finally {
                        await driver.navigate(`${baseUrl}/HomePage`);
                    }
                    await webAppAPI.pollForResyncResponse(accessToken);
                } while (errorDialogAppear);
            });

            it('Entering Resource List ABI tests Addon', async () => {
                try {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    driver.sleep(2 * 1000);
                    await webAppHomePage.clickOnBtn('Resource List ABI');
                    await resourceListABI.waitTillVisible(resourceListABI.TestsAddon_container, 15000);
                    await resourceListABI.waitTillVisible(resourceListABI.TestsAddon_dropdownElement, 15000);
                    resourceListABI.pause(2 * 1000);
                    const dropdownTitle = await (
                        await driver.findElement(resourceListABI.TestsAddon_dropdownTitle)
                    ).getAttribute('title');
                    expect(dropdownTitle).to.contain('Select List Data');
                    await driver.refresh();
                    await resourceListABI.isSpinnerDone();
                } catch (error) {
                    enteredAbiSlug = false;
                    console.error(error);
                    throw new Error('Problem with opening ABI addon slug');
                }
            });

            describe('List Content Tests', async () => {
                afterEach(async function () {
                    driver.sleep(0.5 * 1000);
                });
                if (enteredAbiSlug) {
                    Object.keys(lists).forEach((listTitle) => {
                        describe(listTitle, async () => {
                            after(async function () {
                                await driver.refresh();
                            });
                            afterEach(async function () {
                                await webAppHomePage.collectEndTestData(this);
                            });
                            let enteringListTitle = '';

                            switch (listTitle) {
                                case '1. Items - Basic':
                                    enteringListTitle = 'Entering Default Selected List';
                                    break;

                                default:
                                    enteringListTitle = 'Choosing List Data and Opening the Dialog';
                                    break;
                            }
                            it(enteringListTitle, async function () {
                                const list = lists[listTitle].listToSelect;
                                const expectedTitle = lists[listTitle].expectedTitle;
                                const expectedNumOfResults = lists[listTitle].expectedNumOfResults;

                                switch (listTitle) {
                                    case '34. Accounts - Propagated Error':
                                        const errorMessage =
                                            "Error: Addon with uuid 0e2ae61b-a26a-4c26-81fe doesn't exist or isn't installed or doesn't have any cpi-side files";
                                        await listPickAndVerify.bind(this)(
                                            list,
                                            expectedTitle,
                                            expectedNumOfResults,
                                            '',
                                            true,
                                            errorMessage,
                                        );
                                        break;
                                    case '32. ReferenceAccount - 2 Views':
                                        // https://pepperi.atlassian.net/browse/DI-24602
                                        // fix-version: Resource List 1.0 https://pepperi.atlassian.net/projects/DI/versions/19610/tab/release-report-all-issues
                                        if (email.includes('.stage') === false) {
                                            const listDefaultView = lists[listTitle].views[0];
                                            await listPickAndVerify.bind(this)(
                                                list,
                                                expectedTitle,
                                                expectedNumOfResults,
                                                listDefaultView,
                                            );
                                        }
                                        break;
                                    default:
                                        const listDefaultView = lists[listTitle].views[0];
                                        await listPickAndVerify.bind(this)(
                                            list,
                                            expectedTitle,
                                            expectedNumOfResults,
                                            listDefaultView,
                                        );
                                        break;
                                }
                                resourceListABI.pause(0.1 * 1000);
                                await resourceListABI.isSpinnerDone();
                            });
                            switch (listTitle) {
                                case '34. Accounts - Propagated Error':
                                    break;

                                case '32. ReferenceAccount - 2 Views':
                                    // https://pepperi.atlassian.net/browse/DI-24602
                                    // fix-version: Resource List 1.0 https://pepperi.atlassian.net/projects/DI/versions/19610/tab/release-report-all-issues
                                    if (email.includes('.stage') === false) {
                                        it('Validate Views', async function () {
                                            const currentListExpectedViews = lists[listTitle].views;
                                            const currentListExpectedHeadersPerView =
                                                lists[listTitle].columnHeadersPerView;
                                            await validateViewsTitles.bind(this)(
                                                currentListExpectedViews.length,
                                                currentListExpectedViews,
                                            );
                                            await validateViewsListHeaders(
                                                currentListExpectedViews.length,
                                                currentListExpectedViews,
                                                currentListExpectedHeadersPerView,
                                            );
                                        });
                                    }
                                    break;

                                default:
                                    it('Validate Views', async function () {
                                        const currentListExpectedViews = lists[listTitle].views;
                                        const currentListExpectedHeadersPerView = lists[listTitle].columnHeadersPerView;
                                        await validateViewsTitles.bind(this)(
                                            currentListExpectedViews.length,
                                            currentListExpectedViews,
                                        );
                                        await validateViewsListHeaders(
                                            currentListExpectedViews.length,
                                            currentListExpectedViews,
                                            currentListExpectedHeadersPerView,
                                        );
                                    });
                                    break;
                            }

                            // if (!email.includes('.stage') || listTitle !== '32. ReferenceAccount - 2 Views') {
                            // DI-24602
                            Object.keys(lists[listTitle].elements).forEach((element) => {
                                const isDisplayed = lists[listTitle].elements[element];
                                it(`${element} - ${isDisplayed ? 'DISPLAYED' : 'NOT Displayed'}`, async function () {
                                    switch (element) {
                                        case 'Menu':
                                            isDisplayed ? await elemntExist('Menu') : await elemntDoNotExist('Menu');
                                            break;
                                        case 'Search Input':
                                            isDisplayed
                                                ? await elemntExist('Search')
                                                : await elemntDoNotExist('Search');
                                            break;
                                        case 'Smart Search':
                                            isDisplayed
                                                ? await elemntExist('SmartSearch')
                                                : await elemntDoNotExist('SmartSearch');
                                            break;
                                        case 'Single Radio Button':
                                            isDisplayed
                                                ? await elemntExist('SingleRadioButton')
                                                : await elemntDoNotExist('SingleRadioButton');
                                            break;
                                        case 'Select All Checkbox':
                                            isDisplayed
                                                ? await elemntExist('MultiCheckbox')
                                                : await elemntDoNotExist('MultiCheckbox');
                                            break;
                                        case 'Pager':
                                            isDisplayed ? await elemntExist('Pager') : await elemntDoNotExist('Pager');
                                            break;
                                        case 'Line Menu':
                                            switch (listTitle) {
                                                case '10. Accounts - Line Menu':
                                                case '30. Items - Full - with 2 Views':
                                                    await lineMenuSingleExist.bind(this)();
                                                    break;

                                                case '11. Items - Line Menu - Selection Type Multi':
                                                case '29. Accounts - Full':
                                                case '32. ReferenceAccount - 2 Views':
                                                case '33. FiltersAccRef - 2 Views':
                                                    await lineMenuMultiExist.bind(this)();
                                                    break;

                                                case '1. Items - Basic':
                                                case '2. Accounts - Basic':
                                                case '5. Accounts - Selection - Single':
                                                    await lineMenuSingleDoNotExist.bind(this)();
                                                    break;

                                                case '4. Accounts - Selection - Multi':
                                                case '31. Accounts - Draw Grid Relation':
                                                    await lineMenuMultiDoNotExist.bind(this)();
                                                    break;

                                                case '6. Accounts - Selection - None':
                                                    await webAppList.clickOnRowByIndex();
                                                    await webAppList.isSpinnerDone();
                                                    const base64ImageBuild = await driver.saveScreenshots();
                                                    addContext(this, {
                                                        title: `After row of type "None" was clicked (not really selected)`,
                                                        value: 'data:image/png;base64,' + base64ImageBuild,
                                                    });
                                                    await elemntDoNotExist('LineMenu');
                                                    resourceListABI.pause(0.2 * 1000);
                                                    break;

                                                default:
                                                    isDisplayed
                                                        ? await elemntExist('LineMenu')
                                                        : await elemntDoNotExist('LineMenu');
                                                    break;
                                            }
                                            break;

                                        default:
                                            break;
                                    }
                                });
                            });
                            if (
                                lists[listTitle].elements['Line Menu'] &&
                                lists[listTitle].elements['Select All Checkbox']
                            ) {
                                it('Line Menu - Disappear', async function () {
                                    await lineMenuMultiDisappear.bind(this)();
                                });
                            }
                            // }
                            switch (listTitle) {
                                case '1. Items - Basic':
                                    break;
                                case '2. Accounts - Basic':
                                    break;
                                case '3. Accounts - Default Draw':
                                    break;
                                case '4. Accounts - Selection - Multi':
                                    break;
                                case '5. Accounts - Selection - Single':
                                    break;
                                case '6. Accounts - Selection - None':
                                    break;
                                case '7. Accounts - Menu':
                                    // open menu and check that the items are there - Recycle Bin | Import | Export
                                    break;
                                case '8. Accounts - Menu - Hosting Addon Functionality':
                                    // open menu and check that the items are there - Test | Go To Home Page
                                    // click "Go To Home Page" button and check to be on home page
                                    break;
                                case '9. Accounts - Menu - Full':
                                    // open menu and check that the items are there - Recycle Bin | Import | Export | Test | Go To Home Page
                                    break;
                                case '10. Accounts - Line Menu':
                                    break;
                                case '11. Items - Line Menu - Selection Type Multi':
                                    break;
                                case '12. Items - Search':
                                    break;
                                case '13. Accounts - Smart Search':
                                    break;
                                case '14. Accounts - Sorting Ascending':
                                    break;
                                case '15. Accounts - Sorting Descending':
                                    break;
                                case '16. Items - Search String':
                                    // check that search input holds the correct string
                                    break;
                                case '17. Items - Page Type Pages':
                                    break;
                                case '18. Items - Page Type Pages - Page size':
                                    break;
                                case '19. Items - Page Type Pages - Page Index':
                                    break;
                                case '20. Items - Page Type Pages - Top Scroll Index':
                                    break;
                                case '21. Items - Page Type Pages - Page Size & Page Index':
                                    break;
                                case '22. Items - Page Type Pages - Page Size, Page Index & Top Scroll Index':
                                    break;
                                case '23. Items - Page Type Scroll':
                                    break;
                                case '24. Items - Page Type Scroll - Top Scroll Index':
                                    break;
                                case '25. Items - Page Type Scroll - Page Index':
                                    break;
                                case '26. Items - Page Type Scroll - Page Index & Top Scroll Index':
                                    break;
                                case '27. Items - Page Type Scroll - Page Size & Page Index':
                                    break;
                                case '28. Items - Page Type Scroll - Page Size & Page Index & Top Scroll Index':
                                    break;
                                case '29. Accounts - Full':
                                    // click "Test" button in Menu and check that "Hello World" appear in search input and search response
                                    break;
                                case '30. Items - Full - with 2 Views':
                                    break;
                                case '31. Accounts - Draw Grid Relation':
                                    // DI-22735
                                    break;
                                case '32. ReferenceAccount - 2 Views':
                                    break;
                                case '33. FiltersAccRef - 2 Views':
                                    break;
                                case '34. Accounts - Propagated Error':
                                    break;
                                case '35. ArraysOfPrimitives - Numbers, Names, Reals':
                                    // test the content on the list cells - that it is displayed correctly
                                    break;
                                case '36. ContainedArray - Scheme Only: Name, Age':
                                    // test the content on the list cells - that it is displayed correctly
                                    break;
                                case '37. ':
                                    // test the content on the list cells - that it is displayed correctly
                                    break;

                                default:
                                    break;
                            }
                            if (email.includes('.stage') && listTitle === '32. ReferenceAccount - 2 Views') {
                                it('Dialog Not Shown', async function () {
                                    // await resourceListABI.clickElement('ListAbi_dialogButton_done');
                                });
                            } else {
                                it('Close Dialog', async function () {
                                    await resourceListABI.clickElement('ListAbi_dialogButton_done');
                                });
                            }
                        });
                    });
                }
            });
        });

        describe(`Prerequisites Addons for Resource List Tests`, () => {
            for (const addonName in testData) {
                const addonUUID = testData[addonName][0];
                const version = testData[addonName][1];
                const currentAddonChnageVersionResponse = chnageVersionResponseArr[addonName];
                const varLatestVersion = currentAddonChnageVersionResponse[2];
                const changeType = currentAddonChnageVersionResponse[3];
                const status = currentAddonChnageVersionResponse[4];
                const note = currentAddonChnageVersionResponse[5];

                describe(`"${addonName}"`, () => {
                    it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                        if (status == 'Failure') {
                            expect(note).to.include('is already working on version');
                        } else {
                            expect(status).to.include('Success');
                        }
                    });
                    it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(varLatestVersion);
                    });
                });
            }
        });
    });

    async function listPickAndVerify(
        this: Context,
        listToSelect: string,
        expectedTitle: string,
        expectedNumOfResults: number,
        defaultView: string,
        err = false,
        errorText?: string,
    ) {
        await resourceListABI.isSpinnerDone();
        if (listToSelect) {
            await resourceListABI.selectDropBoxByString(resourceListABI.TestsAddon_dropdownElement, listToSelect);
            await resourceListABI.isSpinnerDone();
            await resourceListABI.clickElement('TestsAddon_chooseList_mainDiv');
            await resourceListABI.isSpinnerDone();
        }
        driver.sleep(1 * 1000);
        let base64ImageBuild = await driver.saveScreenshots();
        addContext(this, {
            title: `List Selected from Dropdown`,
            value: 'data:image/png;base64,' + base64ImageBuild,
        });
        await resourceListABI.clickElement('TestsAddon_openABI_button');
        await resourceListABI.isSpinnerDone();
        driver.sleep(2.5 * 1000);
        await resourceListABI.isSpinnerDone();
        await resourceListABI.waitTillVisible(resourceListABI.ListAbi_container, 15000);
        if (!err) {
            await resourceListABI.waitTillVisible(webAppList.ListRowElements, 15000);
            const listAbiTitle = await (await driver.findElement(resourceListABI.ListAbi_title)).getAttribute('title');
            expect(listAbiTitle.trim()).to.equal(expectedTitle);
            await resourceListABI.waitTillVisible(resourceListABI.ListAbi_ViewsDropdown, 15000);
            const listAbi_ViewTitle = await (
                await driver.findElement(resourceListABI.ListAbi_ViewsDropdown_value)
            ).getText();
            expect(listAbi_ViewTitle.trim()).to.equal(defaultView);
            resourceListABI.pause(0.1 * 1000);
            if (expectedNumOfResults > 0) {
                await elemntExist('ListRow');
                resourceListABI.pause(0.2 * 1000);
            }
        } else {
            const listAbiErrorTitle = await (
                await driver.findElement(resourceListABI.ListAbi_Empty_Error_title)
            ).getText();
            const listAbiErrorDescription = await (
                await driver.findElement(resourceListABI.ListAbi_Empty_Error_description)
            ).getText();
            expect(listAbiErrorTitle.trim()).to.equal('Error');
            expect(listAbiErrorDescription.trim()).to.contain(errorText);
        }
        const listAbiResultsNumber = await (await driver.findElement(resourceListABI.ListAbi_results_number)).getText();
        addContext(this, {
            title: `Number of Results`,
            value: 'Actual: ' + listAbiResultsNumber + ' | Expected: ' + expectedNumOfResults,
        });
        expect(Number(listAbiResultsNumber.trim())).to.equal(expectedNumOfResults);
        base64ImageBuild = await driver.saveScreenshots();
        addContext(this, {
            title: `Current List ABI`,
            value: 'data:image/png;base64,' + base64ImageBuild,
        });
    }

    async function getSelector(
        elemName:
            | 'Menu'
            | 'New Button'
            | 'LineMenu'
            | 'Search'
            | 'SmartSearch'
            | 'ListRow'
            | 'MultiCheckbox'
            | 'SingleRadioButton'
            | 'Pager'
            | 'Scroll'
            | 'RadioButtonSelected'
            | 'CheckboxSelected'
            | 'Views',
    ) {
        let selectorOfElemToFind: By;
        let selectorName: string;
        switch (elemName) {
            case 'Menu':
                selectorOfElemToFind = resourceListABI.ListAbi_Menu_button;
                selectorName = 'Menu Button';
                break;
            case 'New Button':
                selectorOfElemToFind = resourceListABI.ListAbi_New_button;
                selectorName = 'New Button';
                break;
            case 'LineMenu':
                selectorOfElemToFind = resourceListABI.ListAbi_LineMenu_button;
                selectorName = 'LineMenu Button';
                break;
            case 'Search':
                selectorOfElemToFind = resourceListABI.ListAbi_Search_input;
                selectorName = 'Search Input';
                break;
            case 'SmartSearch':
                selectorOfElemToFind = resourceListABI.ListAbi_SmartSearch_container;
                selectorName = 'SmartSearch (Filters) Container';
                break;
            case 'ListRow':
                selectorOfElemToFind = webAppList.ListRowElements;
                selectorName = 'List Row';
                break;
            case 'MultiCheckbox':
                selectorOfElemToFind = webAppList.SelectAllCheckbox;
                selectorName = 'Selection Type Multi (Select All Checkbox)';
                break;
            case 'SingleRadioButton':
                selectorOfElemToFind = webAppList.RadioButtons;
                selectorName = 'Selection Type Single (Radio Button)';
                break;
            case 'Pager':
                selectorOfElemToFind = resourceListABI.ListAbi_Pager_container;
                selectorName = 'Pager Box';
                break;
            case 'Scroll':
                selectorOfElemToFind = resourceListABI.ListAbi_VerticalScroll;
                selectorName = 'Vertical Scroll';
                break;
            case 'RadioButtonSelected':
                selectorOfElemToFind = webAppList.RadioButtonSelected;
                selectorName = 'Selected Radio Button';
                break;
            case 'CheckboxSelected':
                selectorOfElemToFind = webAppList.RowElementCheckBoxSelected;
                selectorName = 'Selected Checkbox';
                break;
            case 'Views':
                selectorOfElemToFind = resourceListABI.ListAbi_ViewsDropdown;
                selectorName = 'Views Box';
                break;

            default:
                selectorOfElemToFind = resourceListABI.ListAbi_container;
                selectorName = '';
                break;
        }
        return { selector: selectorOfElemToFind, name: selectorName };
    }

    async function elemntDoNotExist(
        element:
            | 'Menu'
            | 'New Button'
            | 'LineMenu'
            | 'Search'
            | 'SmartSearch'
            | 'ListRow'
            | 'MultiCheckbox'
            | 'SingleRadioButton'
            | 'Pager'
            | 'Scroll'
            | 'RadioButtonSelected'
            | 'CheckboxSelected'
            | 'Views',
    ) {
        const selectorDetails = getSelector(element);
        try {
            await driver.findElement((await selectorDetails).selector);
            throw new Error(`The Element: "${(await selectorDetails).name}" is Unexpectedly Shown on the Form!`);
        } catch (error) {
            const theError = error as Error;
            expect(theError.message).to.contain('After wait time of: 15000, for selector');
        }
    }

    async function elemntExist(
        element:
            | 'Menu'
            | 'New Button'
            | 'LineMenu'
            | 'Search'
            | 'SmartSearch'
            | 'ListRow'
            | 'MultiCheckbox'
            | 'SingleRadioButton'
            | 'Pager'
            | 'Scroll'
            | 'RadioButtonSelected'
            | 'CheckboxSelected'
            | 'Views',
    ) {
        const selectorDetails = getSelector(element);
        try {
            const element = await driver.findElement((await selectorDetails).selector);
            expect(await typeof element).to.equal('object');
        } catch (error) {
            console.error(error);
            expect((await selectorDetails).name).to.be.a.string('Shown - but is NOT');
        }
    }

    async function lineMenuMultiDoNotExist(this: Context) {
        await elemntDoNotExist('CheckboxSelected');
        await webAppList.clickOnCheckBoxByElementIndex();
        await webAppList.isSpinnerDone();
        await webAppList.untilIsVisible(webAppList.RowElementCheckBoxSelected);
        let base64ImageBuild = await driver.saveScreenshots();
        addContext(this, {
            title: `After row of type "Multi" was selected`,
            value: 'data:image/png;base64,' + base64ImageBuild,
        });
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(0.2 * 1000);
        await webAppList.clickOnCheckBoxByElementIndex();
        await webAppList.isSpinnerDone();
        await elemntDoNotExist('CheckboxSelected');
        base64ImageBuild = await driver.saveScreenshots();
        addContext(this, {
            title: `After row of type "Multi" was un-selected`,
            value: 'data:image/png;base64,' + base64ImageBuild,
        });
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(2 * 1000);
    }

    async function lineMenuSingleDoNotExist(this: Context) {
        await elemntDoNotExist('RadioButtonSelected');
        await webAppList.clickOnRadioButtonByElementIndex();
        await webAppList.isSpinnerDone();
        await webAppList.untilIsVisible(webAppList.RadioButtonSelected);
        let base64ImageBuild = await driver.saveScreenshots();
        addContext(this, {
            title: `After row of type "Single" was selected`,
            value: 'data:image/png;base64,' + base64ImageBuild,
        });
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(0.2 * 1000);
        await webAppList.clickOnRadioButtonByElementIndex();
        await webAppList.isSpinnerDone();
        base64ImageBuild = await driver.saveScreenshots();
        addContext(this, {
            title: `After row of type "Single" was suppose to be un-selected (it doesn't have the ability to be unselected)`,
            value: 'data:image/png;base64,' + base64ImageBuild,
        });
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(2 * 1000);
    }

    async function lineMenuSingleExist(this: Context) {
        await elemntDoNotExist('RadioButtonSelected');
        await webAppList.clickOnRadioButtonByElementIndex();
        await webAppList.isSpinnerDone();
        await webAppList.untilIsVisible(webAppList.RadioButtonSelected);
        const base64ImageBuild = await driver.saveScreenshots();
        addContext(this, {
            title: `After row of type "Single" was selected`,
            value: 'data:image/png;base64,' + base64ImageBuild,
        });
        await elemntExist('LineMenu');
        resourceListABI.pause(0.2 * 1000);
    }

    async function lineMenuMultiExist(this: Context) {
        await elemntDoNotExist('CheckboxSelected');
        await webAppList.clickOnCheckBoxByElementIndex();
        await webAppList.isSpinnerDone();
        await webAppList.untilIsVisible(webAppList.RowElementCheckBoxSelected);
        const base64ImageBuild = await driver.saveScreenshots();
        addContext(this, {
            title: `After row of type "Multi" was selected`,
            value: 'data:image/png;base64,' + base64ImageBuild,
        });
        await elemntExist('LineMenu');
        resourceListABI.pause(0.2 * 1000);
    }

    async function lineMenuMultiDisappear(this: Context) {
        await elemntExist('CheckboxSelected');
        let base64ImageBuild = await driver.saveScreenshots();
        addContext(this, {
            title: `Line Menu should be visible`,
            value: 'data:image/png;base64,' + base64ImageBuild,
        });
        await webAppList.clickOnCheckBoxByElementIndex();
        await webAppList.isSpinnerDone();
        base64ImageBuild = await driver.saveScreenshots();
        addContext(this, {
            title: `After selected line was un-selected, Line Menu should not be visible`,
            value: 'data:image/png;base64,' + base64ImageBuild,
        });
        await elemntDoNotExist('CheckboxSelected');
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(2 * 1000);
    }

    async function validateView(expectedViewTitle: string, expectedColumnHeaders: string[]) {
        console.info(`***In Validate View*** ${expectedViewTitle}`);
        const listHeaders = await driver.findElements(webAppList.Headers);
        const viewTitle = await (await driver.findElement(resourceListABI.ListAbi_ViewsDropdown_value)).getText();
        driver.sleep(0.1 * 1000);
        console.info(`in validateView, expectedColumnHeaders: ${expectedColumnHeaders}`);
        console.info(`in validateView, viewTitle: ${viewTitle}`);
        expect(listHeaders.length).to.equal(expectedColumnHeaders.length);
        expect(viewTitle).to.equal(expectedViewTitle);
        listHeaders.forEach(async (header, index) => {
            try {
                const headerTitle = (await header.getText()).trim();
                console.info(`headerTitle: ${headerTitle}`);
                expect(headerTitle).equals(expectedColumnHeaders[index]);
            } catch (error) {
                console.error(
                    `Validating List Headers: looking for ${index}. ${await header.getText()}, getting error: ${error}`,
                );
            }
        });
    }

    async function validateViewsTitles(this: Context, expectedNumOfViews: number, expectedViewsTitles: string[]) {
        await driver.click(resourceListABI.ListAbi_ViewsDropdown);
        await driver.untilIsVisible(resourceListABI.ListAbi_ViewsDropdownOptions_container);
        const base64ImageBuild = await driver.saveScreenshots();
        addContext(this, {
            title: `Views List Open`,
            value: 'data:image/png;base64,' + base64ImageBuild,
        });
        const views = await driver.findElements(resourceListABI.ListAbi_ViewsDropdownSingleOption_textContent);
        resourceListABI.pause(0.2 * 1000);
        expect(views.length).to.equal(expectedNumOfViews);
        await views[0].click();
        resourceListABI.pause(0.1 * 1000);
        views.forEach(async (view) => {
            try {
                const viewTitle = await view.getText();
                expect(expectedViewsTitles).contains(viewTitle);
            } catch (error) {
                console.error(
                    `Validating View Title: "${JSON.stringify(
                        await view.getText(),
                    )}" in dropdown, getting an error: ${error}`,
                );
            }
        });
    }

    async function validateViewsListHeaders(
        expectedNumOfViews: number,
        expectedViewsTitles: string[],
        columnHeadersOfEachView: string[][],
    ) {
        driver.sleep(0.1 * 1000);
        for (let viewIndex = 0; viewIndex < expectedNumOfViews; viewIndex++) {
            console.info(`In validateViews, viewIndex: ${viewIndex}`);
            await switchViewByName(expectedViewsTitles[viewIndex]);
            resourceListABI.isSpinnerDone();
            await validateView(expectedViewsTitles[viewIndex], columnHeadersOfEachView[viewIndex]);
        }
        driver.sleep(5 * 1000);
    }

    async function switchViewByName(viewText: string) {
        console.info('***In Switch View***');
        driver.sleep(0.1 * 1000);
        await driver.untilIsVisible(resourceListABI.ListAbi_ViewsDropdown);
        driver.sleep(0.1 * 1000);
        await resourceListABI.selectDropBoxByString(resourceListABI.ListAbi_ViewsDropdown, viewText);
        driver.sleep(0.1 * 1000);
        await driver.click(resourceListABI.ListAbi_title);
        driver.sleep(1 * 1000);
        const currentView = await (await driver.findElement(resourceListABI.ListAbi_ViewsDropdown_value)).getText();
        expect(currentView).equals(viewText);
    }
}
