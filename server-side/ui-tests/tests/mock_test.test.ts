import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { UDCService } from '../../services/user-defined-collections.service';
import { Browser } from '../utilities/browser';
import {
    BrandedApp,
    // WebAppDialog,
    WebAppHeader,
    WebAppHomePage,
    // WebAppList,
    WebAppLoginPage,
    // WebAppTopBar
} from '../pom';
import { DataViewsService } from '../../services/data-views.service';
import E2EUtils from '../utilities/e2e_utils';
import { ResourceViews } from '../pom/addons/ResourceList';
import { GridDataViewField } from '@pepperi-addons/papi-sdk';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { BasePageLayoutSectionColumn, ViewerBlock } from '../blueprints/PageBlocksBlueprints';
import { Slugs } from '../pom/addons/Slugs';

chai.use(promised);

export async function MockTest(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const dataViewsService = new DataViewsService(generalService.papiClient);
    const coreResourcesUUID = 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f';
    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let resourceListUtils: E2EUtils;
    let resourceViews: ResourceViews;
    let e2eUiService: E2EUtils;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    // let webAppList: WebAppList;
    // let webAppTopBar: WebAppTopBar;
    // let webAppDialog: WebAppDialog;
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

    describe('API Creation of UDCs', () => {
        /********************  RL Data Prep  ********************/

        it('Creating a UDC of Reference Account with API', async () => {
            // Collection:  ====>   ReferenceAccount   <====        //
            const bodyOfCollection = udcService.prepareDataForUdcCreation({
                nameOfCollection: 'ReferenceAccountAuto',
                descriptionOfCollection: 'Created with Automation',
                fieldsOfCollection: [
                    {
                        classType: 'Resource',
                        fieldName: 'of_account',
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
                        field: { Type: 'Integer', Mandatory: false, Indexed: true, Description: '' },
                    },
                    {
                        classType: 'Primitive',
                        fieldName: 'discount_rate',
                        field: { Type: 'Double', Mandatory: false, Indexed: false, Description: '' },
                    },
                    {
                        classType: 'Array',
                        fieldName: 'offered_discount_location',
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
            // console.info(`bodyOfCollection: ${JSON.stringify(bodyOfCollection, null, 2)}`);
            const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
            console.info(`upsertResponse: ${JSON.stringify(upsertResponse, null, 2)}`);
        });

        it('Adding Values to Collection: ReferenceAccountAuto', async () => {
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
            // webAppList = new WebAppList(driver);
            // webAppTopBar = new WebAppTopBar(driver);
            // webAppDialog = new WebAppDialog(driver);
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
            await resourceViews.customViewConfig(dataViewsService, {
                matchingEditorName: '',
                viewKey: referenceAccountAutoViewUUID,
                fieldsToConfigureInView: viewFields,
            });
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
            // driver.sleep(5000);
            // await webAppHeader.openSettings();
            driver.sleep(0.5 * 1000);
            await brandedApp.addAdminHomePageButtons(referenceAccountSlugDisplayName);
            // for (let index = 0; index < 2; index++) {
            //     await webAppHomePage.manualResync(client);
            // }
            await e2eUiService.performManualSync(client);
            await webAppHomePage.validateATDIsApearingOnHomeScreen(referenceAccountSlugDisplayName);
        });
    });

    describe('TearDown', () => {
        it('Deleting the Documents of the UDC "ReferenceAccountAuto" with API', async () => {
            const getReferenceAccountAuto = await udcService.getAllObjectFromCollection('ReferenceAccountAuto');
            console.info(`getReferenceAccountAuto: ${JSON.stringify(getReferenceAccountAuto, null, 2)}`);
            getReferenceAccountAuto.objects.forEach(async (document) => {
                const deleteDocument = await udcService.hideObjectInACollection('ReferenceAccountAuto', document.Key);
                console.info(`deleteDocument: ${JSON.stringify(deleteDocument, null, 2)}`);
                expect(deleteDocument.Ok).to.be.true;
                expect(deleteDocument.Status).to.equal(200);
                expect(deleteDocument.Error).to.eql({});
            });
        });
        it('Removing "Ref Account" Button from Home Screen', async function () {
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
            expect(await (await slugs.getSlugs(client)).Body.find((item) => item.Slug === referenceAccountSlugPath)).to
                .be.undefined;
        });
        it('Deleting the Page "ReferenceAccountAuto Page" with API', async () => {
            const deletePageResponse = await pageBuilder.removePageByKey(referenceAccountAutoPageUUID, client);
            expect(deletePageResponse.Ok).to.equal(true);
            expect(deletePageResponse.Status).to.equal(200);
            expect(deletePageResponse.Body).to.equal(true);
        });
        it('Deleting the View "ReferenceAccountAuto View" with API', async () => {
            const deleteViewResponse = await resourceViews.deleteViewViaApiByUUID(referenceAccountAutoViewUUID, client);
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
}
