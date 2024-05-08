import addContext from 'mochawesome/addContext';
import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService, { FetchStatusResponse } from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHeader, WebAppHomePage, WebAppLoginPage } from '../pom';
import { ResourceList, ResourceEditors, ResourceViews } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import E2EUtils from '../utilities/e2e_utils';
import { BaseFormDataViewField, DataViewFieldType } from '@pepperi-addons/papi-sdk';
import { v4 as uuidv4 } from 'uuid';

import { BasePageLayoutSectionColumn, ResourceViewEditorBlock } from '../blueprints/PageBlocksBlueprints';
import { ResourceListBlock } from '../pom/ResourceList.block';
import { Slugs } from '../pom/addons/Slugs';
import { AccountDashboardLayout } from '../pom/AccountDashboardLayout';
import { UDCService } from '../../services/user-defined-collections.service';

chai.use(promised);

export async function ResourceListTests(email: string, password: string, client: Client, varPass: string) {
    const date = new Date();
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    // const papi_resources = ['accounts', 'items', 'users', 'catalogs', 'account_users', 'contacts'];

    await generalService.baseAddonVersionsInstallation(varPass);

    const testData = {
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        ResourceListABI_Addon: ['cd3ba412-66a4-42f4-8abc-65768c5dc606', ''],
        Nebula: ['00000000-0000-0000-0000-000000006a91', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '1.%'], // to prevent open sync from being installed (2.0.%)
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', ''], // needed for filtering by account (ReferenceAccount collections)
        // Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', '2.%'],
        // 'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        // configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        // 'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '1.6.%'], // Dependency of Nebula
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', '0.6.%'], // Dependency of Nebula
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);

    const installedResourceListVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Resource List',
    )?.Version;

    const accountName = 'Second Account';
    const resource_name_sanity = 'SchemeOnlyObjectAuto';
    const resource_name_pipeline = 'NameAgeAuto';
    const coreResourcesSlugDisplayName = 'Auto Test';
    const core_resources_slug_path = 'auto_test';
    const coreResourcesUUID = 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f';
    const test_generic_decsription = 'for RL automated testing';
    const resource_name_from_account_dashborad = 'ReferenceAccountAuto';
    const collectionProperties = [
        'GenericResource',
        'ModificationDateTime',
        'SyncData',
        'CreationDateTime',
        'UserDefined',
        'Fields',
        'Description',
        'DataSourceData',
        'DocumentKey',
        'Type',
        'Lock',
        'ListView',
        'Hidden',
        'Name',
        'AddonUUID',
    ];
    const getSchemesResponse = await udcService.getSchemes({ where: `Name=${resource_name_from_account_dashborad}` });
    let syncStatusOfReferenceAccount = getSchemesResponse[0].SyncData?.Sync;
    console.info('syncStatusOfReferenceAccount: ', syncStatusOfReferenceAccount);

    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let resourceList: ResourceList;
    let resourceEditors: ResourceEditors;
    let resourceViews: ResourceViews;
    let pageBuilder: PageBuilder;
    let slugs: Slugs;
    let resourceListUtils: E2EUtils;
    let resourceListBlock: ResourceListBlock;
    let accountDashboardLayout: AccountDashboardLayout;
    let previousSyncStatus: boolean | undefined;
    let random_name: string;
    let editorName: string;
    let editor_decsription: string;
    let view_decsription: string;
    let editorKey: string;
    let viewKey: string;
    let viewName: string;
    let slugDisplayName: string;
    let slug_path: string;
    let slugDisplayNameAccountDashboard: string;
    let slug_path_account_dashboard: string;
    let pageName: string;
    let pageKey: string;
    let createdPage;
    let deletePageResponse;

    const detailsByResource: {
        [key: string]: {
            view_fields_names: string[];
            view_fields: {
                fieldName: string;
                dataViewType: DataViewFieldType;
                mandatory: boolean;
                readonly: boolean;
            }[];
        };
    } = {
        accounts: {
            view_fields_names: ['Name', 'Email', 'Country', 'City', 'Type', 'UUID'],
            view_fields: [
                { fieldName: 'Name', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Email', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Country', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'City', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Type', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'UUID', dataViewType: 'TextBox', mandatory: true, readonly: true },
            ],
        },
        items: {
            view_fields_names: ['Name', 'Price', 'Discount', 'UPC', 'UUID', 'Image', 'ExternalID'],
            view_fields: [
                { fieldName: 'Name', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Price', dataViewType: 'NumberReal', mandatory: true, readonly: true },
                { fieldName: 'Discount', dataViewType: 'NumberReal', mandatory: true, readonly: true },
                { fieldName: 'UPC', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'UUID', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Image', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: true, readonly: true },
            ],
        },
        users: {
            view_fields_names: [
                'ExternalID',
                'Email',
                'FirstName',
                'LastName',
                'Mobile',
                'Phone',
                'IsInTradeShowMode',
                'UUID',
            ],
            view_fields: [
                { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Email', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'FirstName', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'LastName', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Mobile', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Phone', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'IsInTradeShowMode', dataViewType: 'Boolean', mandatory: true, readonly: true },
                { fieldName: 'UUID', dataViewType: 'TextBox', mandatory: true, readonly: true },
            ],
        },
        catalogs: {
            view_fields_names: ['UUID', 'ExternalID', 'Description', 'ExpirationDate', 'IsActive', 'TSAImage'],
            view_fields: [
                { fieldName: 'UUID', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Description', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'ExpirationDate', dataViewType: 'DateAndTime', mandatory: true, readonly: true },
                { fieldName: 'IsActive', dataViewType: 'Boolean', mandatory: true, readonly: true },
                { fieldName: 'TSAImage', dataViewType: 'TextBox', mandatory: true, readonly: true },
            ],
        },
        account_users: {
            view_fields_names: ['Account', 'User', 'ConnectedWithFullAccountAccess', 'UUID'],
            view_fields: [
                { fieldName: 'Account', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'User', dataViewType: 'TextBox', mandatory: true, readonly: true },
                {
                    fieldName: 'ConnectedWithFullAccountAccess',
                    dataViewType: 'Boolean',
                    mandatory: true,
                    readonly: true,
                },
                { fieldName: 'UUID', dataViewType: 'TextBox', mandatory: true, readonly: true },
            ],
        },
        contacts: {
            view_fields_names: ['FirstName', 'LastName', 'Email', 'IsBuyer', 'Role', 'TypeDefinitionID', 'Status'],
            view_fields: [
                { fieldName: 'FirstName', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'LastName', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'Email', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'IsBuyer', dataViewType: 'Boolean', mandatory: true, readonly: true },
                { fieldName: 'Role', dataViewType: 'TextBox', mandatory: true, readonly: true },
                { fieldName: 'TypeDefinitionID', dataViewType: 'NumberInteger', mandatory: true, readonly: true },
                { fieldName: 'Status', dataViewType: 'NumberInteger', mandatory: true, readonly: true },
            ],
        },
        // OfflineArraysToOnline: {
        //     view_fields_names: ['strArr', 'intArr', 'doubArr'],
        // },
        NameAgeAuto: {
            view_fields_names: ['name', 'age', 'Key'],
            view_fields: [
                { fieldName: 'name', dataViewType: 'TextBox', mandatory: false, readonly: true },
                { fieldName: 'age', dataViewType: 'TextBox', mandatory: false, readonly: true },
                { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: true },
            ],
        },
        ArraysOfPrimitivesAuto: {
            view_fields_names: ['name', 'age', 'Key'],
            view_fields: [],
        },
        FiltersAccRefAuto: {
            view_fields_names: ['name', 'age', 'Key'],
            view_fields: [],
        },
        IndexedFieldsAuto: {
            view_fields_names: ['name', 'age', 'Key'],
            view_fields: [],
        },
        IndexedNameAgeAuto: {
            view_fields_names: ['name', 'age', 'Key'],
            view_fields: [],
        },
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
        },
        // Dataless: {
        //     view_fields_names: ['Key', 'integerhavenodata'],
        // },
    };

    const simpleResources = [
        'accounts',
        'items',
        // 'users',
        // 'catalogs',
        // 'account_users',
        'contacts',
    ];
    // const complexResources = ['ArraysOfPrimitivesAuto', 'FiltersAccRefAuto', 'IndexedFieldsAuto', 'IndexedNameAgeAuto', 'ReferenceAccountAuto'];

    describe(`Resource List Tests Suite - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } || Ver ${installedResourceListVersion} || ${date}`, async function () {
        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
            webAppHeader = new WebAppHeader(driver);
            resourceList = new ResourceList(driver);
            resourceEditors = new ResourceEditors(driver);
            resourceViews = new ResourceViews(driver);
            pageBuilder = new PageBuilder(driver);
            slugs = new Slugs(driver);
            resourceListUtils = new E2EUtils(driver);
            accountDashboardLayout = new AccountDashboardLayout(driver);
            random_name = generalService.generateRandomString(5);
        });

        after(async function () {
            await driver.quit();
        });

        describe('UDCs Prep', async function () {
            it(`Upsert "${resource_name_sanity}" Collection`, async function () {
                const bodyOfCollection = udcService.prepareDataForUdcCreation({
                    nameOfCollection: resource_name_sanity,
                    descriptionOfCollection: 'Created with Automation',
                    typeOfCollection: 'contained',
                    syncDefinitionOfCollection: { Sync: false },
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
                });
                const upsertResponse = await udcService.postScheme(bodyOfCollection);
                console.info(`${resource_name_sanity} upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);
                expect(upsertResponse).to.be.an('object');
                Object.keys(upsertResponse).forEach((collectionProperty) => {
                    expect(collectionProperty).to.be.oneOf(collectionProperties);
                });
                expect(upsertResponse.Name).to.equal(resource_name_sanity);
                expect(upsertResponse.Fields).to.be.an('object');
                if (upsertResponse.Fields) expect(Object.keys(upsertResponse.Fields)).to.eql(['name', 'age']);
            });

            it(`Upsert "${resource_name_pipeline}" Collection`, async function () {
                const bodyOfCollection = udcService.prepareDataForUdcCreation({
                    nameOfCollection: resource_name_pipeline,
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
                const upsertResponse = await udcService.postScheme(bodyOfCollection);
                console.info(`${resource_name_pipeline} upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);
                expect(upsertResponse).to.be.an('object');
                Object.keys(upsertResponse).forEach((collectionProperty) => {
                    expect(collectionProperty).to.be.oneOf(collectionProperties);
                });
                expect(upsertResponse.Name).to.equal(resource_name_pipeline);
                expect(upsertResponse.Fields).to.be.an('object');
                if (upsertResponse.Fields) expect(Object.keys(upsertResponse.Fields)).to.eql(['name', 'age']);
            });

            it(`Upsert "${resource_name_from_account_dashborad}" Collection`, async function () {
                const bodyOfCollection = udcService.prepareDataForUdcCreation({
                    nameOfCollection: resource_name_from_account_dashborad,
                    descriptionOfCollection: 'Created with Automation',
                    syncDefinitionOfCollection: { Sync: syncStatusOfReferenceAccount || false },
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
                const upsertResponse = await udcService.postScheme(bodyOfCollection);
                console.info(
                    `${resource_name_from_account_dashborad} upsertResponse: ${JSON.stringify(
                        upsertResponse,
                        null,
                        2,
                    )}`,
                );
                expect(upsertResponse).to.be.an('object');
                Object.keys(upsertResponse).forEach((collectionProperty) => {
                    expect(collectionProperty).to.be.oneOf(collectionProperties);
                });
                expect(upsertResponse.Name).to.equal(resource_name_from_account_dashborad);
                expect(upsertResponse.Fields).to.be.an('object');
                if (upsertResponse.Fields)
                    expect(Object.keys(upsertResponse.Fields)).to.eql([
                        'of_account',
                        'best_seller_item',
                        'max_quantity',
                        'offered_discount_location',
                        'discount_rate',
                    ]);
            });
        });

        describe('Resource List UI tests', async function () {
            it('Login', async function () {
                await webAppLoginPage.login(email, password);
            });

            it('Manual Resync', async () => {
                await resourceListUtils.performManualResync(client);
            });

            it(`Logout Login`, async () => {
                await resourceListUtils.logOutLogIn(email, password);
                await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
            });

            describe('Views & Editors Full Functionality test', async function () {
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it('Resource Views settings is loaded and Elements exist', async function () {
                    // navigation
                    await resourceListUtils.navigateTo('Resource Views');
                    await resourceList.isSpinnerDone();
                    /* test logics */
                    // title is currect
                    const addonSettingsTitle = await (
                        await driver.findElement(resourceList.PepTopArea_title)
                    ).getText();
                    expect(addonSettingsTitle).to.contain('Views & Editors');

                    // tabs are the right amount, the currect text and the right one (Views) is selected while the other isn't
                    await driver.untilIsVisible(resourceList.GenericList_Content);
                    await driver.untilIsVisible(resourceList.TabsContainer);
                    const tabs = await driver.findElements(resourceList.AddonContainerTabs);
                    expect(tabs.length).to.equal(2);
                    const viewsTab_isSelected = await (
                        await driver.findElement(resourceList.Views_Tab)
                    ).getAttribute('aria-selected');
                    expect(viewsTab_isSelected).to.equal('true');
                    const editorsTab_isSelected = await (
                        await driver.findElement(resourceList.Editors_Tab)
                    ).getAttribute('aria-selected');
                    expect(editorsTab_isSelected).to.equal('false');

                    // list title is "Views" - contains number and "results"/"result", number of results is 0 and the text "No Data Found" appears
                    const listTitle = await (await driver.findElement(resourceList.GenericList_Title)).getText();
                    expect(listTitle).to.equal('Views');
                    const resultsDivText = await (await driver.findElement(resourceList.ResultsDiv)).getText();
                    expect(resultsDivText).to.contain('result');
                    // await resourceViews.deleteAll();
                    // const numberOfResults = await (await driver.findElement(resourceList.NumberOfItemsInList)).getText();
                    // expect(Number(numberOfResults)).to.be.equal(0);
                    // const noData = (await (await driver.findElement(resourceList.List_NoDataFound)).getText()).trim();
                    // expect(noData).to.be.oneOf(['No Data Found', 'No results were found.']);
                });

                // it('Editors Tab', async function () {
                //     await resourceList.clickTab('Editors_Tab');
                //     //TODO
                // });
            });

            describe('Operations (e.g Addition, Deletion)', async function () {
                it('Neviagte to Editors, Add Editor and Delete it', async function () {
                    editorName = `RL_Editors_${resource_name_sanity}_Test_${random_name}`;
                    editor_decsription = `Editor ${resource_name_sanity} ${test_generic_decsription}`;
                    await resourceListUtils.navigateTo('Resource Views');
                    await resourceList.isSpinnerDone();
                    await resourceEditors.clickTab('Editors_Tab');
                    await resourceEditors.isSpinnerDone();
                    await resourceEditors.validateEditorsListPageIsLoaded();
                    await resourceEditors.addToResourceList(editorName, editor_decsription, resource_name_sanity);
                    await resourceEditors.verifyEditorEditPageOpen(editorName);
                    await resourceEditors.click(resourceEditors.EditPage_BackToList_Button);
                    await resourceEditors.clickTab('Editors_Tab');
                    await resourceEditors.deleteFromListByName(editorName);
                });

                it('Perform Manual Sync', async function () {
                    await resourceListUtils.performManualSync(client);
                });
            });

            // describe('Pre-clean', async function () {
            //     before(function () {
            //         resource_name = 'NameAge';
            //         random_name = generalService.generateRandomString(5);
            //     });
            //     afterEach(async function () {
            //         driver.sleep(500);
            //         await webAppHomePage.collectEndTestData(this);
            //     });

            //     it('Delete All Views', async function () {
            //         await resourceListUtils.deleteAllViewsViaUI();
            //     });
            //     it('Delete All Editors', async function () {
            //         await resourceListUtils.deleteAllEditorsViaUI();
            //     });
            //     it('Delete All Pages', async function () {
            //         await resourceListUtils.deleteAllPagesViaUI();
            //     });
            // });

            describe('Pipeline', async function () {
                // conditions for this section: tested user must have UDC = NameAgeAuto
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it('Add & Configure Editor', async function () {
                    // Add Editor
                    editorName = `${resource_name_pipeline} Editor _(${random_name})`;
                    editor_decsription = `Editor of resource: ${resource_name_pipeline} - ${test_generic_decsription}`;
                    await resourceListUtils.addEditor({
                        nameOfEditor: editorName,
                        descriptionOfEditor: editor_decsription,
                        nameOfResource: resource_name_pipeline,
                    });
                    if (await driver.isElementVisible(resourceEditors.EditPage_BackToList_Button)) {
                        await driver.click(resourceEditors.EditPage_BackToList_Button);
                    }
                    // Configure Editor
                    await resourceListUtils.gotoEditPageOfSelectedEditorByName(editorName);
                    editorKey = await resourceListUtils.getUUIDfromURL();
                    const editorFields: BaseFormDataViewField[] =
                        resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                            { fieldName: 'name', dataViewType: 'TextBox', mandatory: false, readonly: true },
                            { fieldName: 'age', dataViewType: 'TextBox', mandatory: false, readonly: true },
                        ]);
                    await resourceEditors.customEditorConfig(
                        generalService,
                        {
                            //this was changed due to the function changing - EVGENY 27/8/23
                            editorKey: editorKey,
                            fieldsToConfigureInView: editorFields,
                        },
                        editorName,
                    );
                    let base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `In Editor "${resource_name_pipeline}"`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    resourceEditors.pause(0.5 * 1000);
                    await driver.click(resourceEditors.EditPage_BackToList_Button);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Back at Editors List`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    resourceEditors.pause(0.5 * 1000);
                });

                it('Add & Configure View', async function () {
                    // Add View
                    viewName = `${resource_name_pipeline} View _(${random_name})`;
                    view_decsription = `View of resource: ${resource_name_pipeline} - ${test_generic_decsription}`;
                    await resourceListUtils.addView({
                        nameOfView: viewName,
                        descriptionOfView: view_decsription,
                        nameOfResource: resource_name_pipeline,
                    });
                    if (await driver.isElementVisible(resourceViews.EditPage_BackToList_Button)) {
                        await driver.click(resourceViews.EditPage_BackToList_Button);
                    }
                    // Configure View
                    await resourceListUtils.gotoEditPageOfSelectedViewByName(viewName);
                    viewKey = await resourceListUtils.getUUIDfromURL();
                    // const viewFields: {
                    //     fieldName: string;
                    //     dataViewType: DataViewFieldType;
                    //     mandatory: boolean;
                    //     readonly: boolean;
                    // }[] = [
                    //     { fieldName: 'name', dataViewType: 'TextBox', mandatory: false, readonly: true },
                    //     { fieldName: 'age', dataViewType: 'TextBox', mandatory: false, readonly: true },
                    //     { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: true },
                    // ];
                    await resourceViews.customViewConfig(client, {
                        matchingEditorName: editorName,
                        viewKey: viewKey,
                        fieldsToConfigureInView: detailsByResource[resource_name_pipeline].view_fields,
                    });
                    let base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `In View "${resource_name_pipeline}"`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    resourceViews.pause(0.5 * 1000);
                    await driver.click(resourceViews.EditPage_BackToList_Button);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Back at Views List`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    resourceViews.pause(0.5 * 1000);
                });

                it('Create Page', async function () {
                    await resourceListUtils.navigateTo('Page Builder');
                    // debugger
                    await pageBuilder.validatePageBuilderIsLoaded();
                    // await pageBuilder.deleteAll();
                    pageName = `${resource_name_pipeline} Page Auto_(${random_name})`;
                    await pageBuilder.addBlankPage(
                        pageName,
                        `Automation Testing Page for resource ${resource_name_pipeline}`,
                    );
                    driver.sleep(0.2 * 1000);
                    pageKey = await resourceListUtils.getUUIDfromURL();
                    createdPage = await pageBuilder.getPageByUUID(pageKey, client);
                    console.info(`createdPage before blocks addition: ${JSON.stringify(createdPage, null, 2)}`);
                    const editorBlockKey = uuidv4();
                    console.info('Newly generated editor block key: ', editorBlockKey);
                    const viewBlockKey = uuidv4();
                    console.info('Newly generated view block key: ', viewBlockKey);
                    const selectedViews = [
                        {
                            collectionName: resource_name_pipeline,
                            collectionID: '',
                            selectedViewUUID: viewKey,
                            selectedViewName: viewName,
                        },
                    ];
                    const viewerBlock = new ResourceViewEditorBlock(
                        viewBlockKey,
                        'DataViewerBlock',
                        undefined,
                        selectedViews,
                    );
                    console.info(`viewer block: ${JSON.stringify(viewerBlock, null, 2)}`);
                    const editorBlock = new ResourceViewEditorBlock(editorBlockKey, 'DataConfigurationBlock', {
                        collectionName: resource_name_pipeline,
                        editorUUID: editorKey,
                    });
                    console.info(`editor block: ${JSON.stringify(editorBlock, null, 2)}`);
                    createdPage.Blocks.push(editorBlock);
                    createdPage.Blocks.push(viewerBlock);
                    createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(viewBlockKey);
                    createdPage.Layout.Sections[0].Columns.push(new BasePageLayoutSectionColumn(editorBlockKey));

                    const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                    console.info(`RESPONSE: ${JSON.stringify(responseOfPublishPage, null, 2)}`);
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `After Page Creation`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    expect(responseOfPublishPage.Ok).to.be.true;
                    expect(responseOfPublishPage.Status).to.equal(200);
                    pageBuilder.pause(1 * 1000);
                    await webAppHeader.goHome();
                });

                it('Create & Map Slug', async function () {
                    slugDisplayName = `${resource_name_pipeline} ${random_name}`;
                    slug_path = `${resource_name_pipeline.toLowerCase()}_${random_name}`;
                    await resourceListUtils.createSlug(slugDisplayName, slug_path, pageKey, email, password, client);
                });

                it(`Create A Button On Homepage`, async function () {
                    await webAppHeader.openSettings();
                    await webAppHeader.isSpinnerDone();
                    driver.sleep(0.1 * 1000);
                    await resourceListUtils.addHomePageButtonByProfile(slugDisplayName, 'Rep');
                    await webAppHomePage.manualResync(client);
                    await webAppHomePage.validateATDIsApearingOnHomeScreen(slugDisplayName);
                    addContext(this, {
                        title: `${slugDisplayName}`,
                        value: 'button name',
                    });
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `After Home Page Button Creation`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('Go to Block and perform checks', async function () {
                    resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${slug_path}`);
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn(slugDisplayName);
                    await resourceListBlock.isSpinnerDone();
                    addContext(this, {
                        title: `Current URL`,
                        value: `${await driver.getCurrentUrl()}`,
                    });
                    let base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `In Block "${resource_name_pipeline}"`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(0.5 * 1000);
                    const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                    const expectedViewFieldsNames = detailsByResource[resource_name_pipeline].view_fields_names;
                    expect(columnsTitles.length).to.equal(expectedViewFieldsNames.length);
                    columnsTitles.forEach(async (columnTitle) => {
                        const columnTitleText = await columnTitle.getText();
                        expect(columnTitleText).to.be.oneOf(expectedViewFieldsNames);
                    });
                    driver.sleep(0.5 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `After Assertions`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('Editing checks at Block', async function () {
                    // TODO
                    driver.sleep(0.5 * 1000);
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `After Assertions`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('Return to Home Page', async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                });
            });

            describe('Teardown of Pipeline', async function () {
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it('Delete Page', async function () {
                    deletePageResponse = await pageBuilder.removePageByUUID(pageKey, client);
                });

                it('Delete Slug', async function () {
                    const deleteSlugResponse = await slugs.deleteSlugByName(slug_path, client);
                    expect(deleteSlugResponse.Ok).to.equal(true);
                    expect(deleteSlugResponse.Status).to.equal(200);
                    expect(deleteSlugResponse.Body.success).to.equal(true);
                });

                it('Delete Editor Via API', async function () {
                    const deleteEditorResponse = await resourceEditors.deleteEditorViaAPI(editorKey, client);
                    expect(deleteEditorResponse.Ok).to.equal(true);
                    expect(deleteEditorResponse.Status).to.equal(200);
                    expect(deleteEditorResponse.Body.Name).to.equal(editorName);
                    expect(deleteEditorResponse.Body.Hidden).to.equal(true);
                });

                it('Delete View Via API', async function () {
                    const deleteViewResponse = await resourceViews.deleteViewViaApiByUUID(viewKey, client);
                    expect(deleteViewResponse.Ok).to.equal(true);
                    expect(deleteViewResponse.Status).to.equal(200);
                    expect(deleteViewResponse.Body.Name).to.equal(viewName);
                    expect(deleteViewResponse.Body.Hidden).to.equal(true);
                });

                it('Remove button from home screen', async function () {
                    await webAppHeader.goHome();
                    await webAppHeader.openSettings();
                    await webAppHomePage.isSpinnerDone();
                    driver.sleep(0.5 * 1000);
                    await resourceListUtils.removeHomePageButtonByProfile(slugDisplayName, 'Rep');
                    await webAppHomePage.manualResync(client);
                    const isNotFound = await webAppHomePage.validateATDIsNOTApearingOnHomeScreen(slugDisplayName);
                    expect(isNotFound).to.equal(true);
                });

                it('Validating Deletion of Page', async function () {
                    console.info(`deletePageResponse: ${JSON.stringify(deletePageResponse, null, 2)}`);
                    driver.sleep(0.5 * 1000);
                    expect(deletePageResponse.Ok).to.equal(true);
                    expect(deletePageResponse.Status).to.equal(200);
                    expect(deletePageResponse.Body.Hidden).to.equal(true);
                    expect(deletePageResponse.Body.Name).to.equal(pageName);
                });
            });

            describe(`Resource View (${resource_name_from_account_dashborad}) from Account Dashboard`, async function () {
                // conditions for this section: tested user must have UDC = ReferenceAccountAuto
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it('Add & Configure View', async function () {
                    // Add View
                    viewName = `${resource_name_from_account_dashborad} View _(${random_name})`;
                    view_decsription = `View of resource: ${resource_name_from_account_dashborad} - ${test_generic_decsription}`;
                    await resourceListUtils.addView({
                        nameOfView: viewName,
                        descriptionOfView: view_decsription,
                        nameOfResource: resource_name_from_account_dashborad,
                    });
                    if (await driver.isElementVisible(resourceViews.EditPage_BackToList_Button)) {
                        await driver.click(resourceViews.EditPage_BackToList_Button);
                    }
                    // Configure View
                    await resourceListUtils.gotoEditPageOfSelectedViewByName(viewName);
                    viewKey = await resourceListUtils.getUUIDfromURL();
                    await resourceViews.customViewConfig(client, {
                        matchingEditorName: '',
                        viewKey: viewKey,
                        fieldsToConfigureInView: detailsByResource[resource_name_from_account_dashborad].view_fields,
                    });
                    let base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `In View "${resource_name_from_account_dashborad}"`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    resourceViews.pause(0.5 * 1000);
                    await driver.click(resourceViews.EditPage_BackToList_Button);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Back at Views List`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    resourceViews.pause(0.5 * 1000);
                });

                it('Create Page', async function () {
                    await resourceListUtils.navigateTo('Page Builder');
                    // debugger
                    await pageBuilder.validatePageBuilderIsLoaded();
                    // await pageBuilder.deleteAll();
                    pageName = `${resource_name_from_account_dashborad} Page Auto_(${random_name})`;
                    await pageBuilder.addBlankPage(
                        pageName,
                        `Automation Testing Page for resource ${resource_name_from_account_dashborad}`,
                    );
                    driver.sleep(0.2 * 1000);
                    pageKey = await resourceListUtils.getUUIDfromURL();
                    createdPage = await pageBuilder.getPageByUUID(pageKey, client);
                    console.info(`createdPage before blocks addition: ${JSON.stringify(createdPage, null, 2)}`);
                    const editorBlockKey = uuidv4();
                    console.info('Newly generated editor block key: ', editorBlockKey);
                    const viewBlockKey = uuidv4();
                    console.info('Newly generated view block key: ', viewBlockKey);
                    const selectedViews = [
                        {
                            collectionName: resource_name_from_account_dashborad,
                            collectionID: '',
                            selectedViewUUID: viewKey,
                            selectedViewName: viewName,
                        },
                    ];
                    const viewerBlock = new ResourceViewEditorBlock(
                        viewBlockKey,
                        'DataViewerBlock',
                        undefined,
                        selectedViews,
                    );
                    console.info(`viewer block: ${JSON.stringify(viewerBlock, null, 2)}`);
                    const editorBlock = new ResourceViewEditorBlock(editorBlockKey, 'DataConfigurationBlock', {
                        collectionName: resource_name_from_account_dashborad,
                        editorUUID: editorKey,
                    });
                    console.info(`editor block: ${JSON.stringify(editorBlock, null, 2)}`);
                    createdPage.Blocks.push(editorBlock);
                    createdPage.Blocks.push(viewerBlock);
                    createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(viewBlockKey);
                    createdPage.Layout.Sections[0].Columns.push(new BasePageLayoutSectionColumn(editorBlockKey));

                    const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                    console.info(`RESPONSE: ${JSON.stringify(responseOfPublishPage, null, 2)}`);
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `After Page Creation`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    expect(responseOfPublishPage.Ok).to.be.true;
                    expect(responseOfPublishPage.Status).to.equal(200);
                    pageBuilder.pause(1 * 1000);
                    await webAppHeader.goHome();
                });

                it('Create & Map Slug', async function () {
                    slugDisplayNameAccountDashboard = `${resource_name_from_account_dashborad} ${random_name}`;
                    slug_path_account_dashboard = `${resource_name_from_account_dashborad.toLowerCase()}_${random_name}`;
                    await resourceListUtils.createSlug(
                        slugDisplayNameAccountDashboard,
                        slug_path_account_dashboard,
                        pageKey,
                        email,
                        password,
                        client,
                    );
                });

                it('Admin: Navigating to Account Dashboard Layout -> Menu (Pencil) -> Admin (Pencil) -> Configuring Slug', async () => {
                    await accountDashboardLayout.configureToAccountSelectedSectionByProfile(
                        driver,
                        slugDisplayNameAccountDashboard,
                        'Menu',
                        'Admin',
                    );
                });

                it(`Logout Login & Manual Sync`, async () => {
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
                    await resourceListUtils.performManualSync(client);
                });

                it(`${
                    syncStatusOfReferenceAccount ? 'Offline & Online' : 'Online Only'
                }: Navigating to a specific Account (${accountName}) & Entering Resource View slug from Menu`, async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Accounts');
                    await resourceListUtils.selectAccountFromAccountList.bind(this)(driver, accountName, 'name');
                    await resourceList.isSpinnerDone();
                    driver.sleep(1 * 1000);
                    let base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `At "${accountName}" dashboard`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await resourceList.waitTillVisible(
                        accountDashboardLayout.AccountDashboard_HamburgerMenu_Button,
                        15000,
                    );
                    await resourceList.click(accountDashboardLayout.AccountDashboard_HamburgerMenu_Button);
                    resourceList.pause(0.2 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Hamburger Menu opened`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await resourceList.waitTillVisible(
                        accountDashboardLayout.AccountDashboard_HamburgerMenu_Content,
                        15000,
                    );
                    resourceList.pause(1 * 1000);
                    await resourceList.click(
                        accountDashboardLayout.getSelectorOfAccountHomePageHamburgerMenuItemByText(
                            slugDisplayNameAccountDashboard,
                        ),
                    );
                    resourceList.pause(1 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Clicked Wanted Slug at hamburger menu`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('At Block performing checks', async function () {
                    resourceListBlock = new ResourceListBlock(
                        driver,
                        `https://app.pepperi.com/${slug_path_account_dashboard}`,
                    );
                    await resourceListBlock.isSpinnerDone();
                    addContext(this, {
                        title: `Current URL`,
                        value: `${await driver.getCurrentUrl()}`,
                    });
                    let base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `In Block "${resource_name_from_account_dashborad}" - from Account Dashboard`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(0.5 * 1000);
                    const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                    const expectedViewFieldsNames =
                        detailsByResource[resource_name_from_account_dashborad].view_fields_names;
                    expect(columnsTitles.length).to.equal(expectedViewFieldsNames.length);
                    columnsTitles.forEach(async (columnTitle) => {
                        const columnTitleText = await columnTitle.getText();
                        expect(columnTitleText).to.be.oneOf(expectedViewFieldsNames);
                    });
                    driver.sleep(0.5 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `After Assertions`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it(`Changing Sync definition at ${resource_name_from_account_dashborad} from ${
                    syncStatusOfReferenceAccount ? '"Offline & Online"' : '"Online Only"'
                } to ${syncStatusOfReferenceAccount ? '"Online Only"' : '"Offline & Online"'}`, async () => {
                    previousSyncStatus = syncStatusOfReferenceAccount;
                    const newSyncDefinition = syncStatusOfReferenceAccount
                        ? { Sync: false }
                        : { Sync: true, SyncFieldLevel: false };
                    console.info('syncStatusOfReferenceAccount: ', syncStatusOfReferenceAccount);
                    console.info('newSyncDefinition: ', newSyncDefinition);
                    const response = await udcService.postScheme({
                        Name: resource_name_from_account_dashborad,
                        SyncData: newSyncDefinition,
                    });
                    console.info('udcService.postScheme response: ', JSON.stringify(response, null, 2));
                });

                it(`Manual ${syncStatusOfReferenceAccount ? 'Resync' : 'Sync'}`, async () => {
                    syncStatusOfReferenceAccount
                        ? await resourceListUtils.performManualResync(client)
                        : await resourceListUtils.performManualSync(client);
                });

                it(`Logout Login`, async () => {
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
                });

                it('Validating Sync definition changed', async function () {
                    const getSchemesResponse = await udcService.getSchemes({
                        where: `Name=${resource_name_from_account_dashborad}`,
                    });
                    syncStatusOfReferenceAccount = getSchemesResponse[0].SyncData?.Sync;
                    console.info('syncStatusOfReferenceAccount: ', syncStatusOfReferenceAccount);
                    expect(syncStatusOfReferenceAccount).to.not.equal(previousSyncStatus);
                });

                it(`${
                    syncStatusOfReferenceAccount ? 'Online Only' : 'Offline & Online'
                }: Navigating to a specific Account (${accountName}) & Entering Resource View slug from Menu`, async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Accounts');
                    await resourceListUtils.selectAccountFromAccountList.bind(this)(driver, accountName, 'name');
                    await resourceList.isSpinnerDone();
                    driver.sleep(1 * 1000);
                    let base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `At "${accountName}" dashboard`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await resourceList.waitTillVisible(
                        accountDashboardLayout.AccountDashboard_HamburgerMenu_Button,
                        15000,
                    );
                    await resourceList.click(accountDashboardLayout.AccountDashboard_HamburgerMenu_Button);
                    resourceList.pause(0.2 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Hamburger Menu opened`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await resourceList.waitTillVisible(
                        accountDashboardLayout.AccountDashboard_HamburgerMenu_Content,
                        15000,
                    );
                    resourceList.pause(1 * 1000);
                    await resourceList.click(
                        accountDashboardLayout.getSelectorOfAccountHomePageHamburgerMenuItemByText(
                            slugDisplayNameAccountDashboard,
                        ),
                    );
                    resourceList.pause(1 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Clicked Wanted Slug at hamburger menu`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('At Block performing checks', async function () {
                    resourceListBlock = new ResourceListBlock(
                        driver,
                        `https://app.pepperi.com/${slug_path_account_dashboard}`,
                    );
                    await resourceListBlock.isSpinnerDone();
                    addContext(this, {
                        title: `Current URL`,
                        value: `${await driver.getCurrentUrl()}`,
                    });
                    let base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `In Block "${resource_name_from_account_dashborad}" - from Account Dashboard`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(0.5 * 1000);
                    const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                    const expectedViewFieldsNames =
                        detailsByResource[resource_name_from_account_dashborad].view_fields_names;
                    expect(columnsTitles.length).to.equal(expectedViewFieldsNames.length);
                    columnsTitles.forEach(async (columnTitle) => {
                        const columnTitleText = await columnTitle.getText();
                        expect(columnTitleText).to.be.oneOf(expectedViewFieldsNames);
                    });
                    driver.sleep(0.5 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `After Assertions`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('Return to Home Page', async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                });
            });

            describe(`Resource View (${resource_name_from_account_dashborad}) without account filter`, async function () {
                // conditions for this section: tested user must have UDC = ReferenceAccountAuto
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it(`${syncStatusOfReferenceAccount ? 'Offline & Online' : 'Online Only'} --> Navigating to ${
                    client.BaseURL
                }/${slugDisplayNameAccountDashboard}`, async function () {
                    const baseUrl = client.BaseURL.includes('staging') ? 'app.sandbox.pepperi.com' : 'app.pepperi.com';
                    await driver.navigate(`${baseUrl}/${slugDisplayNameAccountDashboard}`);
                    resourceList.pause(1 * 1000);
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `At ${baseUrl}/${slugDisplayNameAccountDashboard}`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('At Block performing checks', async function () {
                    resourceListBlock = new ResourceListBlock(
                        driver,
                        `https://app.pepperi.com/${slug_path_account_dashboard}`,
                    );
                    await resourceListBlock.isSpinnerDone();
                    addContext(this, {
                        title: `Current URL`,
                        value: `${await driver.getCurrentUrl()}`,
                    });
                    let base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `In Block "${resource_name_from_account_dashborad}" - from Account Dashboard`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(0.5 * 1000);
                    const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                    const expectedViewFieldsNames =
                        detailsByResource[resource_name_from_account_dashborad].view_fields_names;
                    expect(columnsTitles.length).to.equal(expectedViewFieldsNames.length);
                    columnsTitles.forEach(async (columnTitle) => {
                        const columnTitleText = await columnTitle.getText();
                        expect(columnTitleText).to.be.oneOf(expectedViewFieldsNames);
                    });
                    driver.sleep(0.5 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `After Assertions`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it(`Changing Sync definition at ${resource_name_from_account_dashborad} from ${
                    syncStatusOfReferenceAccount ? '"Offline & Online"' : '"Online Only"'
                } to ${syncStatusOfReferenceAccount ? '"Online Only"' : '"Offline & Online"'}`, async () => {
                    previousSyncStatus = syncStatusOfReferenceAccount;
                    const newSyncDefinition = syncStatusOfReferenceAccount
                        ? { Sync: false }
                        : { Sync: true, SyncFieldLevel: false };
                    console.info('syncStatusOfReferenceAccount: ', syncStatusOfReferenceAccount);
                    console.info('newSyncDefinition: ', newSyncDefinition);
                    const response = await udcService.postScheme({
                        Name: resource_name_from_account_dashborad,
                        SyncData: newSyncDefinition,
                    });
                    console.info('udcService.postScheme response: ', JSON.stringify(response, null, 2));
                });

                it(`Manual ${syncStatusOfReferenceAccount ? 'Resync' : 'Sync'}`, async () => {
                    syncStatusOfReferenceAccount
                        ? await resourceListUtils.performManualResync(client)
                        : await resourceListUtils.performManualSync(client);
                });

                it(`Logout Login`, async () => {
                    await resourceListUtils.logOutLogIn(email, password);
                    await webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn);
                });

                it('Validating Sync definition changed', async function () {
                    const getSchemesResponse = await udcService.getSchemes({
                        where: `Name=${resource_name_from_account_dashborad}`,
                    });
                    syncStatusOfReferenceAccount = getSchemesResponse[0].SyncData?.Sync;
                    console.info('syncStatusOfReferenceAccount: ', syncStatusOfReferenceAccount);
                    expect(syncStatusOfReferenceAccount).to.not.equal(previousSyncStatus);
                });

                it(`${syncStatusOfReferenceAccount ? 'Online Only' : 'Offline & Online'} --> Navigating to ${
                    client.BaseURL
                }/${slugDisplayNameAccountDashboard}`, async function () {
                    await driver.navigate(`${client.BaseURL}/${slugDisplayNameAccountDashboard}`);
                    resourceList.pause(1 * 1000);
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `At ${client.BaseURL}/${slugDisplayNameAccountDashboard}`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('At Block performing checks', async function () {
                    resourceListBlock = new ResourceListBlock(
                        driver,
                        `https://app.pepperi.com/${slug_path_account_dashboard}`,
                    );
                    await resourceListBlock.isSpinnerDone();
                    addContext(this, {
                        title: `Current URL`,
                        value: `${await driver.getCurrentUrl()}`,
                    });
                    let base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `In Block "${resource_name_from_account_dashborad}" - from Account Dashboard`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                    await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                    driver.sleep(0.5 * 1000);
                    const columnsTitles = await driver.findElements(resourceListBlock.dataViewerBlockTableColumnTitle);
                    const expectedViewFieldsNames =
                        detailsByResource[resource_name_from_account_dashborad].view_fields_names;
                    expect(columnsTitles.length).to.equal(expectedViewFieldsNames.length);
                    columnsTitles.forEach(async (columnTitle) => {
                        const columnTitleText = await columnTitle.getText();
                        expect(columnTitleText).to.be.oneOf(expectedViewFieldsNames);
                    });
                    driver.sleep(0.5 * 1000);
                    base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `After Assertions`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('Return to Home Page', async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                });
            });

            describe('Teardown of Account Dashboard scenario', async function () {
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });

                it('Delete Page', async function () {
                    deletePageResponse = await pageBuilder.removePageByUUID(pageKey, client);
                });

                it('Delete Slug', async function () {
                    const deleteSlugResponse = await slugs.deleteSlugByName(slug_path_account_dashboard, client);
                    expect(deleteSlugResponse.Ok).to.equal(true);
                    expect(deleteSlugResponse.Status).to.equal(200);
                    expect(deleteSlugResponse.Body.success).to.equal(true);
                });

                it('Delete View Via API', async function () {
                    const deleteViewResponse = await resourceViews.deleteViewViaApiByUUID(viewKey, client);
                    expect(deleteViewResponse.Ok).to.equal(true);
                    expect(deleteViewResponse.Status).to.equal(200);
                    expect(deleteViewResponse.Body.Name).to.equal(viewName);
                    expect(deleteViewResponse.Body.Hidden).to.equal(true);
                });

                it('Validating Deletion of Page', async function () {
                    console.info(`deletePageResponse: ${JSON.stringify(deletePageResponse, null, 2)}`);
                    driver.sleep(0.5 * 1000);
                    expect(deletePageResponse.Ok).to.equal(true);
                    expect(deletePageResponse.Status).to.equal(200);
                    expect(deletePageResponse.Body.Hidden).to.equal(true);
                    expect(deletePageResponse.Body.Name).to.equal(pageName);
                });
            });

            // conditions for this section: tested user must have Slug with display name "Auto Test" and path "auto_test"
            simpleResources.forEach((resource) => {
                describe(`Flow Tests for "${resource}"`, async function () {
                    // conditions for this section: tested user must have UDC = NameAgeAuto
                    before(function () {
                        resourceListBlock = new ResourceListBlock(
                            driver,
                            `https://app.pepperi.com/${core_resources_slug_path}`,
                        );
                    });

                    afterEach(async function () {
                        driver.sleep(500);
                        await webAppHomePage.collectEndTestData(this);
                    });

                    it('Add & Configure View', async function () {
                        // Add View
                        viewName = `${resource} View _(${random_name})`;
                        view_decsription = `View of resource: ${resource} - ${test_generic_decsription}`;
                        if (await driver.isElementVisible(resourceViews.EditPage_BackToList_Button)) {
                            await driver.click(resourceViews.EditPage_BackToList_Button);
                        }
                        await resourceListUtils.addView({
                            nameOfView: viewName,
                            descriptionOfView: view_decsription,
                            nameOfResource: resource,
                        });
                        if (await driver.isElementVisible(resourceViews.EditPage_BackToList_Button)) {
                            await driver.click(resourceViews.EditPage_BackToList_Button);
                        }
                        // Configure View
                        await resourceListUtils.gotoEditPageOfSelectedViewByName(viewName);
                        viewKey = await resourceListUtils.getUUIDfromURL();
                        const viewFields = detailsByResource[resource].view_fields;
                        console.info(`viewFields: ${JSON.stringify(viewFields, null, 2)}`);
                        await resourceViews.customViewConfig(client, {
                            matchingEditorName: '',
                            viewKey: viewKey,
                            fieldsToConfigureInView: viewFields,
                        });
                        let base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `In View "${resource}"`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                        resourceViews.pause(0.5 * 1000);
                        await driver.click(resourceViews.EditPage_BackToList_Button);
                        base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Back at Views List`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                        resourceViews.pause(0.5 * 1000);
                    });

                    it('Perform Manual Sync', async function () {
                        await resourceListUtils.performManualSync(client);
                    });

                    it('Create Page', async function () {
                        await resourceListUtils.navigateTo('Page Builder');
                        // await driver.refresh();
                        await resourceList.isSpinnerDone();
                        await pageBuilder.validatePageBuilderIsLoaded();
                        pageName = `${resource} Page Auto_(${random_name})`;
                        await pageBuilder.addBlankPage(pageName, `Automation Testing Page for resource '${resource}'`);
                        driver.sleep(0.2 * 1000);
                        pageKey = await resourceListUtils.getUUIDfromURL();
                        createdPage = await pageBuilder.getPageByUUID(pageKey, client);
                        console.info(`createdPage before blocks addition: ${JSON.stringify(createdPage, null, 2)}`);
                        const viewBlockKey = uuidv4();
                        console.info('Newly generated view block key: ', viewBlockKey);
                        const selectedViews = [
                            {
                                collectionName: resource,
                                collectionID: '',
                                selectedViewUUID: viewKey,
                                selectedViewName: viewName,
                            },
                        ];
                        const viewerBlock = new ResourceViewEditorBlock(
                            viewBlockKey,
                            'DataViewerBlock',
                            undefined,
                            selectedViews,
                        );
                        console.info(`viewer block: ${JSON.stringify(viewerBlock, null, 2)}`);
                        createdPage.Blocks.push(viewerBlock);
                        createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(viewBlockKey);

                        const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                        console.info(`RESPONSE: ${JSON.stringify(responseOfPublishPage, null, 2)}`);
                        const base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `After Page Creation`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                        expect(responseOfPublishPage.Ok).to.be.true;
                        expect(responseOfPublishPage.Status).to.equal(200);
                        pageBuilder.pause(1 * 1000);
                        await webAppHeader.goHome();
                    });

                    it('Perform Manual Sync', async function () {
                        await resourceListUtils.performManualSync(client);
                    });

                    it('Map the Slug with the Page', async function () {
                        const mapPage = await resourceListUtils.changePageAtMappedSlugs(
                            [{ slug_path: core_resources_slug_path, pageUUID: pageKey }],
                            client,
                        );
                        console.info(`Map Page To Slug: ${JSON.stringify(mapPage, null, 2)}`);
                    });

                    it('Logout & Login', async function () {
                        await resourceListUtils.logOutLogIn(email, password);
                    });

                    it('Block Tests', async function () {
                        await webAppHomePage.isSpinnerDone();
                        await webAppHomePage.clickOnBtn(coreResourcesSlugDisplayName);
                        await resourceListBlock.isSpinnerDone();
                        driver.sleep(2 * 1000);
                        let base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `In Block "${resource}"`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                        await driver.untilIsVisible(resourceListBlock.dataViewerBlockTableHeader);
                        driver.sleep(0.5 * 1000);
                        const columnsTitles = await driver.findElements(
                            resourceListBlock.dataViewerBlockTableColumnTitle,
                        );
                        const expectedViewFieldsNames = detailsByResource[resource].view_fields_names;
                        expect(columnsTitles.length).to.equal(expectedViewFieldsNames.length);
                        columnsTitles.forEach(async (columnTitle) => {
                            const columnTitleText = await columnTitle.getText();
                            expect(columnTitleText).to.be.oneOf(expectedViewFieldsNames);
                        });
                        driver.sleep(0.5 * 1000);
                        base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `After Assertions`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                        await webAppHeader.goHome();
                        await webAppHomePage.isSpinnerDone();
                    });

                    it('Delete Page', async function () {
                        deletePageResponse = await pageBuilder.removePageByUUID(pageKey, client);
                        console.info(`deletePageResponse: ${JSON.stringify(deletePageResponse, null, 2)}`);
                        driver.sleep(0.5 * 1000);
                        expect(deletePageResponse.Ok).to.equal(true);
                        expect(deletePageResponse.Status).to.equal(200);
                        expect(deletePageResponse.Body.Hidden).to.equal(true);
                        expect(deletePageResponse.Body.Name).to.equal(pageName);
                    });

                    it('Delete View Via API', async function () {
                        const deleteViewResponse = await resourceViews.deleteViewViaApiByUUID(viewKey, client);
                        expect(deleteViewResponse.Ok).to.equal(true);
                        expect(deleteViewResponse.Status).to.equal(200);
                        expect(deleteViewResponse.Body.Name).to.equal(viewName);
                        expect(deleteViewResponse.Body.Hidden).to.equal(true);
                    });
                });
            });

            describe('Cleanup', () => {
                it('Editors Leftovers Cleanup (containing "RL_Editors_")', async () => {
                    const allEditors = await resourceEditors.getAllEditors(client);
                    const editorsOfAutoTest = allEditors?.Body.filter((editor) => {
                        if (editor.Name.includes('RL_Editors_')) {
                            return editor.Key;
                        }
                    });
                    console.info(`allEditors: ${JSON.stringify(allEditors.Body, null, 4)}`);
                    console.info(`editorsOfAutoTest: ${JSON.stringify(editorsOfAutoTest, null, 4)}`);
                    const deleteAutoEditorsResponse: FetchStatusResponse[] = await Promise.all(
                        editorsOfAutoTest.map(async (autoEditor) => {
                            const deleteAutoEditorResponse = await resourceEditors.deleteEditorViaAPI(
                                autoEditor.Key,
                                client,
                            );
                            // console.info(`deleteAutoEditorResponse: ${JSON.stringify(deleteAutoEditorResponse, null, 4)}`);
                            return deleteAutoEditorResponse;
                        }),
                    );
                    console.info(`deleteAutoEditorsResponse: ${JSON.stringify(deleteAutoEditorsResponse, null, 4)}`);
                    generalService.sleep(5 * 1000);
                    const allEditorsAfterCleanup = await resourceEditors.getAllEditors(client);
                    const findAutoEditorAfterCleanup = allEditorsAfterCleanup?.Body.find((editor) =>
                        editor.Name.includes('RL_Editors_'),
                    );
                    console.info(`findAutoEditorAfterCleanup: ${JSON.stringify(findAutoEditorAfterCleanup, null, 4)}`);
                    expect(findAutoEditorAfterCleanup).to.be.undefined;
                });

                it('Editors Leftovers Cleanup (containing " Editor _(")', async () => {
                    const allEditors = await resourceEditors.getAllEditors(client);
                    const editorsOfAutoTest = allEditors?.Body.filter((editor) => {
                        if (editor.Name.includes(' Editor _(')) {
                            return editor.Key;
                        }
                    });
                    console.info(`allEditors: ${JSON.stringify(allEditors.Body, null, 4)}`);
                    console.info(`editorsOfAutoTest: ${JSON.stringify(editorsOfAutoTest, null, 4)}`);
                    const deleteAutoEditorsResponse: FetchStatusResponse[] = await Promise.all(
                        editorsOfAutoTest.map(async (autoEditor) => {
                            const deleteAutoEditorResponse = await resourceEditors.deleteEditorViaAPI(
                                autoEditor.Key,
                                client,
                            );
                            // console.info(`deleteAutoEditorResponse: ${JSON.stringify(deleteAutoEditorResponse, null, 4)}`);
                            return deleteAutoEditorResponse;
                        }),
                    );
                    console.info(`deleteAutoEditorsResponse: ${JSON.stringify(deleteAutoEditorsResponse, null, 4)}`);
                    generalService.sleep(5 * 1000);
                    const allEditorsAfterCleanup = await resourceEditors.getAllEditors(client);
                    const findAutoEditorAfterCleanup = allEditorsAfterCleanup?.Body.find((editor) =>
                        editor.Name.includes(' Editor _('),
                    );
                    console.info(`findAutoEditorAfterCleanup: ${JSON.stringify(findAutoEditorAfterCleanup, null, 4)}`);
                    expect(findAutoEditorAfterCleanup).to.be.undefined;
                });

                it('Views Leftovers Cleanup (containing " View _(")', async () => {
                    const allViews = await resourceViews.getAllViews(client);
                    const viewsOfAutoTest = allViews?.Body.filter((view) => {
                        if (view.Name.includes(' View _(')) {
                            return view.Key;
                        }
                    });
                    console.info(`allViews Length: ${allViews.Body.length}`);
                    console.info(`viewsOfAutoTest Length: ${viewsOfAutoTest.length}`);
                    console.info(`allViews: ${JSON.stringify(allViews.Body, null, 4)}`);
                    console.info(`viewsOfAutoTest: ${JSON.stringify(viewsOfAutoTest, null, 4)}`);
                    const deleteAutoViewsResponse: FetchStatusResponse[] = await Promise.all(
                        viewsOfAutoTest.map(async (autoView) => {
                            const deleteAutoViewResponse = await resourceViews.deleteViewViaAPI(autoView.Key, client);
                            // console.info(`deleteAutoViewResponse: ${JSON.stringify(deleteAutoViewResponse, null, 4)}`);
                            return deleteAutoViewResponse;
                        }),
                    );
                    console.info(`deleteAutoViewResponse Length: ${deleteAutoViewsResponse.length}`);
                    console.info(`deleteAutoViewsResponse: ${JSON.stringify(deleteAutoViewsResponse, null, 4)}`);
                    generalService.sleep(5 * 1000);
                    const allViewsAfterCleanup = await resourceViews.getAllViews(client);
                    const findAutoViewAfterCleanup = allViewsAfterCleanup?.Body.find((view) =>
                        view.Name.includes(' View _('),
                    );
                    console.info(`findAutoViewAfterCleanup: ${JSON.stringify(findAutoViewAfterCleanup, null, 4)}`);
                    expect(findAutoViewAfterCleanup).to.be.undefined;
                });

                it('Pages Leftovers Cleanup (containing " Page Auto_(")', async () => {
                    const allPages = await pageBuilder.getAllPages(client);
                    const pagesOfAutoTest = allPages?.Body.filter((page) => {
                        if (page.Name.includes(' Page Auto_(')) {
                            return page.Key;
                        }
                    });
                    console.info(`allPages: ${JSON.stringify(allPages.Body, null, 4)}`);
                    console.info(`pagesOfAutoTest: ${JSON.stringify(pagesOfAutoTest, null, 4)}`);
                    const deleteAutoPagesResponse: FetchStatusResponse[] = await Promise.all(
                        pagesOfAutoTest.map(async (autoPage) => {
                            const deleteAutoPageResponse = await pageBuilder.removePageByUUID(autoPage.Key, client);
                            console.info(`deleteAutoPageResponse: ${JSON.stringify(deleteAutoPageResponse, null, 4)}`);
                            return deleteAutoPageResponse;
                        }),
                    );
                    console.info(`deleteAutoPagesResponse: ${JSON.stringify(deleteAutoPagesResponse, null, 4)}`);
                    generalService.sleep(5 * 1000);
                    const allPagesAfterCleanup = await pageBuilder.getAllPages(client);
                    const findAutoPageAfterCleanup = allPagesAfterCleanup?.Body.find((page) =>
                        page.Name.includes(' Page Auto_('),
                    );
                    console.info(`findAutoPageAfterCleanup: ${JSON.stringify(findAutoPageAfterCleanup, null, 4)}`);
                    expect(findAutoPageAfterCleanup).to.be.undefined;
                });

                it('Pages Leftovers Cleanup (starting with "Blank Page")', async () => {
                    const allPages = await pageBuilder.getDraftPages(client);
                    console.info(
                        `allPages.Body.length (looking for Blank Page): ${JSON.stringify(
                            allPages.Body.length,
                            null,
                            4,
                        )}`,
                    );
                    const blankPages = allPages?.Body.filter((page) => {
                        if (page.Name.includes('Blank Page ')) {
                            return page.Key;
                        }
                    });
                    console.info(`allPages: ${JSON.stringify(allPages.Body, null, 4)}`);
                    console.info(`blankPages: ${JSON.stringify(blankPages, null, 4)}`);
                    const deleteBlankPagesResponse: FetchStatusResponse[] = await Promise.all(
                        blankPages.map(async (blankPage) => {
                            const deleteAutoPageResponse = await pageBuilder.removePageByUUID(blankPage.Key, client);
                            console.info(`deleteAutoPageResponse: ${JSON.stringify(deleteAutoPageResponse, null, 4)}`);
                            return deleteAutoPageResponse;
                        }),
                    );
                    console.info(`deleteBlankPagesResponse: ${JSON.stringify(deleteBlankPagesResponse, null, 4)}`);
                    generalService.sleep(5 * 1000);
                    const allPagesAfterCleanup = await pageBuilder.getDraftPages(client);
                    const findBlankPageAfterCleanup = allPagesAfterCleanup?.Body.find((page) =>
                        page.Name.includes('Blank Page'),
                    );
                    console.info(`findBlankPageAfterCleanup: ${JSON.stringify(findBlankPageAfterCleanup, null, 4)}`);
                    expect(findBlankPageAfterCleanup).to.be.undefined;
                });

                it('Remove Leftovers Buttons from home screen', async function () {
                    await webAppHeader.goHome();
                    await webAppHeader.openSettings();
                    await webAppHomePage.isSpinnerDone();
                    driver.sleep(0.5 * 1000);
                    await resourceListUtils.removeHomePageButtonsLeftoversByProfile(
                        `${resource_name_pipeline} `,
                        'Rep',
                    );
                    await webAppHomePage.manualResync(client);
                    const leftoversButtonsOnHomeScreen =
                        await webAppHomePage.buttonsApearingOnHomeScreenByPartialText.bind(this)(
                            driver,
                            `${resource_name_pipeline} `,
                        );
                    expect(leftoversButtonsOnHomeScreen).to.equal(false);
                });

                it('Print Screen', async function () {
                    driver.sleep(0.5 * 1000);
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `After Buttons Removal`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });

                it('Unconfiguring Slug from Account Dashboard', async () => {
                    await accountDashboardLayout.unconfigureFromAccountSelectedSectionByProfile(
                        driver,
                        slugDisplayNameAccountDashboard,
                        'Menu',
                        'Admin',
                        resource_name_from_account_dashborad,
                    );
                });
            });
        });

        describe(`Prerequisites Addons for Resource List Tests - ${
            client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
        } | Tested user: ${email} | Date Time: ${date}`, () => {
            // const addonsLatestVersionList = Object.keys(testData);

            // isInstalledArr.forEach((isInstalled, index) => {
            //     it(`Validate That The Needed Addon: ${addonsLatestVersionList[index]} - Is Installed.`, () => {
            //         expect(isInstalled).to.be.true;
            //     });
            // });
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
}
