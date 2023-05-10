import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { UDCService } from '../../services/user-defined-collections.service';
import { Browser } from '../utilities/browser';
import { BrandedApp, WebAppHeader, WebAppHomePage, WebAppLoginPage } from '../pom';
import { DataViewsService } from '../../services/data-views.service';
import E2EUtils from '../utilities/e2e_utils';
import { ResourceViews } from '../pom/addons/ResourceList';
import { GridDataViewField, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { BasePageLayoutSectionColumn, ViewerBlock } from '../blueprints/PageBlocksBlueprints';
import { ResourceListBlock } from '../pom/ResourceList.block';
import { Slugs } from '../pom/addons/Slugs';

chai.use(promised);

export async function MockTest(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const dataViewsService = new DataViewsService(generalService.papiClient);
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

    describe('Resource List Test Suite', () => {
        describe('API Creation of UDCs', () => {
            /********************  RL Data Prep  ********************/
            it('1. Creating a UDC of "Reference Account" with API', async () => {
                // Collection:  ====>   ReferenceAccount   <====        //
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
            });

            it('2. Adding Values to Collection: "ReferenceAccountAuto"', async () => {
                // Collection:  ====>   ReferenceAccountAuto   <====        //
                const acc01UUID = '5737a507-fa00-4c32-a26a-8bc32572e24d';
                const acc02UUID = '56363496-f8ce-42e8-9305-de5d28737e66';
                const acc03UUID = '7fa13cfa-39a5-4901-b8f4-6bbb9ef870cb';
                const dataReferenceAccountAuto = [
                    { of_account: acc03UUID, best_seller_item: 'Cart', max_quantity: 1500 },
                    {
                        of_account: '',
                        best_seller_item: '',
                        max_quantity: 100000,
                        discount_rate: 0.1,
                        offered_discount_location: [],
                    },
                    {
                        of_account: acc02UUID,
                        best_seller_item: '',
                        max_quantity: 1,
                        discount_rate: 0.1,
                        offered_discount_location: ['rep'],
                    },
                    {
                        of_account: acc01UUID,
                        best_seller_item: 'Hair dryer',
                        max_quantity: 0,
                        discount_rate: 0.4,
                        offered_discount_location: ['store', 'on-line', 'rep'],
                    },
                    {
                        of_account: acc02UUID,
                        best_seller_item: 'Mask',
                        max_quantity: 40000,
                        discount_rate: 0.15,
                        offered_discount_location: ['store', 'on-line'],
                    },
                    { of_account: acc03UUID, max_quantity: 600, discount_rate: 0.1, offered_discount_location: [] },
                    { of_account: acc01UUID, best_seller_item: 'Shirt', max_quantity: 55, discount_rate: 0.22 },
                    {
                        of_account: acc03UUID,
                        best_seller_item: 'item2',
                        discount_rate: 0.3,
                        offered_discount_location: ['store'],
                    },
                    {
                        best_seller_item: 'A',
                        max_quantity: 111,
                        discount_rate: 0.35,
                        offered_discount_location: ['on-line'],
                    },
                ];
                dataReferenceAccountAuto.forEach(async (listing) => {
                    const upsertingValues_Response = await udcService.upsertValuesToCollection(
                        listing,
                        'ReferenceAccountAuto',
                    );
                    console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                    expect(upsertingValues_Response.Ok).to.be.true;
                    expect(upsertingValues_Response.Status).to.equal(200);
                    expect(upsertingValues_Response.Error).to.eql({});
                });
            });

            it('3. Creating a UDC of "Name Age" with API', async () => {
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

            it('4. Adding Values to Collection: "NameAgeAuto"', async () => {
                // Collection:  ====>   NameAgeAuto   <====        //
                const dataReferenceAccountAuto = [
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
                ];
                dataReferenceAccountAuto.forEach(async (listing) => {
                    const upsertingValues_Response = await udcService.upsertValuesToCollection(listing, 'NameAgeAuto');
                    console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                    expect(upsertingValues_Response.Ok).to.be.true;
                    expect(upsertingValues_Response.Status).to.equal(200);
                    expect(upsertingValues_Response.Error).to.eql({});
                });
            });

            it('5. Creating a UDC of "Indexed Name Age" with API', async () => {
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

            it('6. Adding Values to Collection: "IndexedNameAgeAuto"', async () => {
                // Collection:  ====>   IndexedNameAgeAuto   <====        //
                const dataReferenceAccountAuto = [
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
                    { name: 'Bibi', age: 20 },
                ];
                dataReferenceAccountAuto.forEach(async (listing) => {
                    const upsertingValues_Response = await udcService.upsertValuesToCollection(
                        listing,
                        'IndexedNameAgeAuto',
                    );
                    console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                    expect(upsertingValues_Response.Ok).to.be.true;
                    expect(upsertingValues_Response.Status).to.equal(200);
                    expect(upsertingValues_Response.Error).to.eql({});
                });
            });
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
                slugs = new Slugs(driver);
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async () => {
                await webAppLoginPage.login(email, password);
            });

            it('1. Configure Resource View For the Resource "ReferenceAccountAuto"', async function () {
                await resourceListUtils.addView({
                    nameOfView: 'ReferenceAccountAuto View',
                    descriptionOfView: 'Generated with Automation',
                    nameOfResource: 'ReferenceAccountAuto',
                });
                referenceAccountAutoViewUUID = await resourceListUtils.getUUIDfromURL();
                const viewFields: GridDataViewField[] = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                    {
                        fieldName: 'of_account',
                        dataViewType: udcService.resolveUIType('Resource') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'of_account.Name',
                        dataViewType: udcService.resolveUIType('String') || 'TextBox',
                        mandatory: false,
                        readonly: false,
                    },
                    {
                        fieldName: 'of_account.Email',
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
                ]);
                const viewSmartSearchFields: MenuDataViewField[] =
                    resourceListUtils.prepareDataToConfigFieldsInViewTabs([
                        { fieldName: 'of_account' },
                        { fieldName: 'of_account.Name' },
                        { fieldName: 'of_account.Email' },
                        { fieldName: 'best_seller_item' },
                        { fieldName: 'max_quantity' },
                    ]);
                await resourceViews.customViewConfig(
                    dataViewsService,
                    {
                        matchingEditorName: '',
                        viewKey: referenceAccountAutoViewUUID,
                        fieldsToConfigureInView: viewFields,
                    },
                    undefined,
                    undefined,
                    { fieldsToConfigureInViewSmartSearch: viewSmartSearchFields },
                );
                await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
                await webAppHeader.goHome();
            });
            it('2. Create Page With Viewer Block Inside It', async function () {
                referenceAccountPageName = 'ReferenceAccountAuto Page';
                referenceAccountAutoPageUUID = await e2eUiService.addPage(referenceAccountPageName, 'tests');

                const createdPage = await pageBuilder.getPageByUUID(referenceAccountAutoPageUUID, client);
                const viewerBlockInstance = new ViewerBlock([
                    {
                        collectionName: 'ReferenceAccountAuto',
                        collectionID: '',
                        selectedViewUUID: referenceAccountAutoViewUUID,
                        selectedViewName: 'ReferenceAccountAuto View',
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
                referenceAccountSlugDisplayName = `Ref Account`;
                referenceAccountSlugPath = 'ref_account_auto';
                // referenceAccountSlugUUID = await e2eUiService.createSlug(
                await e2eUiService.createSlug(
                    email,
                    password,
                    referenceAccountSlugDisplayName,
                    referenceAccountSlugPath,
                    referenceAccountAutoPageUUID,
                    client,
                );
                driver.sleep(0.5 * 1000);
                await brandedApp.addAdminHomePageButtons(referenceAccountSlugDisplayName);
                await e2eUiService.performManualSync(client);
                await webAppHomePage.validateATDIsApearingOnHomeScreen(referenceAccountSlugDisplayName);
            });
            it('4. Click On "Ref Account" Button at Homepage', async function () {
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
            // NameAge
            it('5. Configure Resource View For the Resource "NameAgeAuto"', async function () {
                await resourceListUtils.addView({
                    nameOfView: 'NameAgeAuto View',
                    descriptionOfView: 'Generated with Automation',
                    nameOfResource: 'NameAgeAuto',
                });
                nameAgeAutoViewUUID = await resourceListUtils.getUUIDfromURL();
                const viewFields: GridDataViewField[] = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
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
                ]);
                await resourceViews.customViewConfig(dataViewsService, {
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
                    email,
                    password,
                    nameAgeSlugDisplayName,
                    nameAgeSlugPath,
                    nameAgeAutoPageUUID,
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
            // IndexedNameAge
            it('9. Configure Resource View For the Resource "IndexedNameAgeAuto"', async function () {
                await resourceListUtils.addView({
                    nameOfView: 'IndexedNameAgeAuto View',
                    descriptionOfView: 'Generated with Automation',
                    nameOfResource: 'IndexedNameAgeAuto',
                });
                indexedNameAgeAutoViewUUID = await resourceListUtils.getUUIDfromURL();
                const viewFields: GridDataViewField[] = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
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
                ]);
                await resourceViews.customViewConfig(dataViewsService, {
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
                    email,
                    password,
                    indexedNameAgeSlugDisplayName,
                    indexedNameAgeSlugPath,
                    indexedNameAgeAutoPageUUID,
                    client,
                );
                driver.sleep(0.5 * 1000);
                await brandedApp.addAdminHomePageButtons(indexedNameAgeSlugDisplayName);
                await e2eUiService.performManualSync(client);
                await webAppHomePage.validateATDIsApearingOnHomeScreen(indexedNameAgeSlugDisplayName);
            });
            it('12. Click On "NameAge" Button at Homepage', async function () {
                resourceListBlock = new ResourceListBlock(driver, `https://app.pepperi.com/${indexedNameAgeSlugPath}`);
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHomePage.clickOnBtn(indexedNameAgeSlugDisplayName);
                await resourceListBlock.isSpinnerDone();
                driver.sleep(8 * 1000);
            });

            describe('TearDown', () => {
                it('Deleting the Documents of the UDC "ReferenceAccountAuto" with API', async () => {
                    const getReferenceAccountAuto = await udcService.getAllObjectFromCollection('ReferenceAccountAuto');
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
        });
    });
}
