import { Browser } from './browser';
import { WebAppHeader } from '../pom/WebAppHeader';
import { BrandedApp, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
import { ResourceList, ResourceEditors, ResourceViews, ViewConfiguration } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { Slugs } from '../pom/addons/Slugs';
import {
    DataViewBaseField,
    DataFieldForEditorView,
    SlugField,
    UpsertFieldsToMappedSlugs,
    ViewMenuTypeField,
} from '../blueprints/DataViewBlueprints';
import {
    BaseFormDataViewField,
    DataViewFieldType,
    GridDataViewField,
    MenuDataViewField,
} from '@pepperi-addons/papi-sdk';
import { BasePomObject } from '../pom/base/BasePomObject';
import { DataViewsService } from '../../services/data-views.service';
import { GeneralService } from '../../services';
import { Client } from '@pepperi-addons/debug-server/dist';
import { expect } from 'chai';
import { CollectionDefinition, UDCService } from '../../services/user-defined-collections.service';
import { SelectedView, ViewerBlock, BasePageLayoutSectionColumn } from '../blueprints/PageBlocksBlueprints';

export default class E2EUtils extends BasePomObject {
    public constructor(protected browser: Browser) {
        super(browser);
    }

    public async navigateTo(destiny: 'Resource Views' | 'Slugs' | 'Page Builder') {
        const header: WebAppHeader = new WebAppHeader(this.browser);
        const settingsSidePanel: WebAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        try {
            await header.goHome();
            await header.isSpinnerDone();
            await header.openSettings();
            await header.isSpinnerDone();
            await settingsSidePanel.selectSettingsByID('Pages');
            switch (destiny) {
                case 'Resource Views':
                    const resourceList: ResourceList = new ResourceList(this.browser);
                    await settingsSidePanel.clickSettingsSubCategory('views_and_editors', 'Pages');
                    // if (await this.browser.isElementVisible(resourceList.EditPage_BackToList_Button)) {
                    //     await resourceList.click(resourceList.EditPage_BackToList_Button);
                    // }
                    await resourceList.waitTillVisible(resourceList.PepTopArea_title, 30000);
                    break;
                case 'Slugs':
                    await settingsSidePanel.clickSettingsSubCategory('slugs', 'Pages');
                    break;
                case 'Page Builder':
                    await settingsSidePanel.clickSettingsSubCategory('pages', 'Pages');
                    break;
                default:
                    throw new Error('Incorrect Path Chosen!');
            }
        } catch (error) {
            console.error(error);
        }
        return;
    }

    public async addEditor(editorData: { nameOfEditor: string; descriptionOfEditor: string; nameOfResource: string }) {
        const rlEditors: ResourceEditors = new ResourceEditors(this.browser);
        await this.navigateTo('Resource Views');
        await rlEditors.clickTab('Editors_Tab');
        await rlEditors.validateEditorsListPageIsLoaded();
        await rlEditors.addToResourceList(
            editorData.nameOfEditor,
            editorData.descriptionOfEditor,
            editorData.nameOfResource,
        );
        await rlEditors.verifyEditorEditPageOpen(editorData.nameOfEditor);
    }

    public async addView(viewData: { nameOfView: string; descriptionOfView: string; nameOfResource: string }) {
        const rlViews: ResourceViews = new ResourceViews(this.browser);
        await this.navigateTo('Resource Views');
        await rlViews.validateViewsListPageIsLoaded();
        await rlViews.addToResourceList(viewData.nameOfView, viewData.descriptionOfView, viewData.nameOfResource);
        await rlViews.verifyViewEditPageOpen(viewData.nameOfView); // IS DIFFERENT than: Editor Edit Page !  DO NOT CHANGE (Hagit, Dec2022)
    }

    public async addPage(nameOfPage: string, descriptionOfPage: string, extraSection = false) {
        // debugger;
        const pageBuilder: PageBuilder = new PageBuilder(this.browser);
        await this.navigateTo('Page Builder');
        await pageBuilder.waitTillVisible(pageBuilder.PageBuilder_Title, 15000);
        await pageBuilder.waitTillVisible(pageBuilder.AddPage_Button, 15000);
        pageBuilder.pause(1000);
        await pageBuilder.addBlankPage(nameOfPage, descriptionOfPage, extraSection ? extraSection : false);
        pageBuilder.pause(2 * 1000);
        const pageUUID = await this.getUUIDfromURL();
        pageBuilder.pause(3 * 1000);
        await pageBuilder.returnToPageBuilderFromPage();
        pageBuilder.pause(1000);
        return pageUUID;
    }

    public async addPageNoSections(nameOfPage: string, descriptionOfPage: string) {
        const pageBuilder: PageBuilder = new PageBuilder(this.browser);
        await this.navigateTo('Page Builder');
        pageBuilder.pause(1000);
        await pageBuilder.waitTillVisible(pageBuilder.PageBuilder_Title, 15000);
        await pageBuilder.waitTillVisible(pageBuilder.AddPage_Button, 15000);
        pageBuilder.pause(1000);
        await pageBuilder.addBlankPageNoSections(nameOfPage, descriptionOfPage);
        pageBuilder.pause(2 * 1000);
        const pageUUID = await this.getUUIDfromURL();
        pageBuilder.pause(3 * 1000);
        await pageBuilder.returnToPageBuilderFromPage();
        pageBuilder.pause(1000);
        return pageUUID;
    }

    public async deleteAllEditorsViaUI() {
        const resourceEditors: ResourceEditors = new ResourceEditors(this.browser);
        await this.navigateTo('Resource Views');
        await resourceEditors.clickTab('Editors_Tab');
        await resourceEditors.validateEditorsListPageIsLoaded();
        await resourceEditors.deleteAll();
    }

    public async deleteAllViewsViaUI() {
        const resourceViews: ResourceViews = new ResourceViews(this.browser);
        await this.navigateTo('Resource Views');
        await resourceViews.validateViewsListPageIsLoaded();
        await resourceViews.deleteAll();
    }

    // public async deleteAllPagesViaUI() { // doesn't work
    //     const pageBuilder: PageBuilder = new PageBuilder(this.browser);
    //     await this.navigateTo('Page Builder');
    //     await pageBuilder.validatePageBuilderIsLoaded();
    //     // await pageBuilder.clickElement('PagesList_SelectAll_Checkbox');
    //     // await pageBuilder.openPencilChooseDelete();
    //     // this.browser.sleep(500);
    //     // await pageBuilder.confirmDeleteClickRedButton();
    //     // this.browser.sleep(500);
    //     await pageBuilder.deleteAll();
    // }

    public async gotoEditPageOfSelectedEditorByName(editorName: string) {
        const resourceEditors: ResourceEditors = new ResourceEditors(this.browser);
        await this.navigateTo('Resource Views');
        await resourceEditors.clickTab('Editors_Tab');
        await resourceEditors.gotoEditPageOfEditor(editorName);
    }

    public async gotoEditPageOfSelectedViewByName(viewName: string) {
        const resourceViews: ResourceViews = new ResourceViews(this.browser);
        await this.navigateTo('Resource Views');
        await resourceViews.gotoEditPageOfView(viewName);
    }

    public async createBlock(resourceName: string, uniqueName: string) {
        const slugs: Slugs = new Slugs(this.browser);
        const resourceEditors: ResourceEditors = new ResourceEditors(this.browser);
        const resourceViews: ResourceViews = new ResourceViews(this.browser);
        // Add Editor
        const editor_name = `${resourceName}_RL_Editors_Test_${uniqueName}`;
        const editor_decsription = `${resourceName} Editor for RL automated testing`;
        await this.addEditor({
            nameOfEditor: editor_name,
            descriptionOfEditor: editor_decsription,
            nameOfResource: resourceName,
        });
        // Configure Editor
        await resourceEditors.basicEditorConfig();
        // Add View
        const view_name = `${resourceName}_RL_Views_Test_${uniqueName}`;
        const view_decsription = `${resourceName} View for RL automated testing`;
        await this.addView({
            nameOfView: view_name,
            descriptionOfView: view_decsription,
            nameOfResource: resourceName,
        });
        // Configure View
        await resourceViews.basicViewConfig(editor_name);
        // Create Page
        const page_name = `${resourceName} Page ${uniqueName}_Test`;
        const page_description = `Automation Testing Page for resource ${resourceName}`;
        await this.addPage(page_name, page_description);
        // Nevigate to Slugs
        await this.navigateTo('Slugs');
        await slugs.clickTab('Mapping_Tab');
        this.browser.sleep(7000);
    }

    public async mappingSlugWithPage(slugPath: string, pageName: string) {
        const slugs: Slugs = new Slugs(this.browser);
        await this.navigateTo('Slugs');
        await slugs.mapPageToSlug(slugPath, pageName);
    }

    public async mappingSlugWithPageEvgeny(slugPath: string, pageName: string) {
        const slugs: Slugs = new Slugs(this.browser);
        await this.navigateTo('Slugs');
        await slugs.mapPageToSlugEVGENY(slugPath, pageName);
    }

    public async createSlug(
        slugDisplayName: string,
        slug_path: string,
        keyOfMappedPage: string,
        email: string,
        password: string,
        client: Client,
    ) {
        const webAppHomePage = new WebAppHomePage(this.browser);
        const webAppHeader = new WebAppHeader(this.browser);
        const slugs: Slugs = new Slugs(this.browser);
        await this.navigateTo('Slugs');
        await slugs.createSlug(slugDisplayName, slug_path, 'slug for Automation');
        slugs.pause(3 * 1000);
        const slugUUID = await slugs.getSlugUUIDbySlugName(slug_path, client);
        console.info('slugUUID: ', slugUUID);
        await webAppHeader.goHome();
        expect(slugUUID).to.not.be.undefined;
        const mappedSlugsUpsertResponse = await this.addToMappedSlugs(
            [{ slug_path: slug_path, pageUUID: keyOfMappedPage }],
            client,
        );
        console.info(
            `existingMappedSlugs: ${JSON.stringify(mappedSlugsUpsertResponse.previouslyExistingMappedSlugs, null, 4)}`,
        );
        await this.logOutLogIn(email, password);
        await webAppHomePage.isSpinnerDone();
        await this.navigateTo('Slugs');
        await slugs.clickTab('Mapping_Tab');
        await slugs.waitTillVisible(slugs.MappingTab_RepCard_InnerListOfMappedSlugs, 15000);
        const slugNameAtMappedSlugsSmallDisplayInRepCard = await this.browser.findElement(
            slugs.getSelectorOfMappedSlugInRepCardSmallDisplayByText(slug_path),
            10000,
        );
        expect(await slugNameAtMappedSlugsSmallDisplayInRepCard.getText()).to.contain(slug_path);
        this.browser.sleep(1 * 1000);
        return slugUUID;
    }

    public prepareListOfBaseFields(
        arrayOfFields: {
            fieldName: string;
            mandatory?: boolean;
            dataViewType?: DataViewFieldType;
            readonly?: boolean;
        }[],
    ) {
        const fields: GridDataViewField[] = [];
        let field: GridDataViewField;
        arrayOfFields.forEach(
            (fieldFromArray: {
                fieldName: string;
                mandatory?: boolean;
                dataViewType?: DataViewFieldType;
                readonly?: boolean;
            }) => {
                field = new DataViewBaseField(
                    fieldFromArray.fieldName,
                    fieldFromArray.dataViewType ? fieldFromArray.dataViewType : 'TextBox',
                    fieldFromArray.fieldName,
                    fieldFromArray.hasOwnProperty('mandatory') ? fieldFromArray.mandatory : false,
                    fieldFromArray.hasOwnProperty('readonly') ? fieldFromArray.readonly : true,
                );
                fields.push(field);
            },
        );
        return fields;
    }

    public prepareDataForDragAndDropAtEditorAndView(
        arrayOfFields: { fieldName: string; dataViewType: DataViewFieldType; mandatory: boolean; readonly: boolean }[],
    ) {
        const fields: BaseFormDataViewField[] | GridDataViewField[] = [];
        let index = 0;
        let field: BaseFormDataViewField | GridDataViewField;
        arrayOfFields.forEach(
            (fieldDefinitionArray: {
                fieldName: string;
                dataViewType: DataViewFieldType;
                mandatory: boolean;
                readonly: boolean;
            }) => {
                field = new DataFieldForEditorView(
                    fieldDefinitionArray.fieldName,
                    fieldDefinitionArray.dataViewType,
                    fieldDefinitionArray.fieldName,
                    fieldDefinitionArray.mandatory,
                    fieldDefinitionArray.readonly,
                    index,
                );
                fields.push(field);
                index++;
            },
        );
        return fields;
    }

    public prepareDataToConfigFieldsInViewTabs(arrayOfFields: { fieldName: string }[]) {
        const fields: MenuDataViewField[] = [];
        let field: MenuDataViewField;
        arrayOfFields.forEach((listing: { fieldName: string }) => {
            field = new ViewMenuTypeField(listing.fieldName);
            fields.push(field);
        });
        return fields;
    }

    public prepareDataForDragAndDropAtSlugs(
        slugsData: { slug_path: string; pageUUID: string }[],
        existingMappedSlugs: MenuDataViewField[],
    ) {
        const fields: MenuDataViewField[] = existingMappedSlugs;
        let field: MenuDataViewField;
        let slugExistInMapped;
        slugsData.forEach((slugData: { slug_path: string; pageUUID: string }) => {
            field = new SlugField(slugData.slug_path, slugData.pageUUID);
            if (existingMappedSlugs.length) {
                slugExistInMapped = existingMappedSlugs.find((slug) => slug.FieldID === slugData.slug_path);
            }
            if (!slugExistInMapped) {
                fields.push(field);
            }
        });
        return fields;
    }

    public async performManualSync(client: Client) {
        const webAppHeader: WebAppHeader = new WebAppHeader(this.browser);
        const webAppHomePage: WebAppHomePage = new WebAppHomePage(this.browser);
        const webAppList: WebAppList = new WebAppList(this.browser);
        await webAppHeader.goHome();
        await webAppHomePage.manualResync(client);
        await webAppList.isSpinnerDone(); // just for the use of webAppList so that fix-lint won't get angry
        // for (let index = 0; index < 4; index++) {
        //     await webAppHeader.goHome();
        //     await webAppHomePage.isSpinnerDone();
        //     await webAppHomePage.clickOnBtn('Accounts');
        //     await webAppList.isSpinnerDone();
        //     await webAppList.validateListRowElements();
        // }
        // await webAppHeader.goHome();
        // await webAppHomePage.isSpinnerDone();
    }

    public async performManualResync() {
        const webAppHeader: WebAppHeader = new WebAppHeader(this.browser);
        const webAppHomePage: WebAppHomePage = new WebAppHomePage(this.browser);
        await webAppHeader.goHome();
        await webAppHomePage.isSpinnerDone();
        await this.browser.navigate(`${await this.browser.getCurrentUrl()}/supportmenu`);
        await this.browser.untilIsVisible(webAppHomePage.SupportMenuPopup_Container);
        await this.browser.click(webAppHomePage.SupportMenuPopup_Refresh);
        await this.browser.untilIsVisible(webAppHomePage.SupportMenuPopup_RefreshData);
        await this.browser.click(webAppHomePage.SupportMenuPopup_RefreshData);
        this.browser.sleep(5 * 60 * 1000);
        let spinnerDone = await webAppHomePage.isSpinnerDone();
        do {
            await webAppHomePage.isDialogOnHomePAge('Error');
            spinnerDone = await webAppHomePage.isSpinnerDone();
        } while (!spinnerDone);
        await webAppHeader.goHome();
    }

    public async logOutLogIn(email: string, password: string) {
        const webAppHeader: WebAppHeader = new WebAppHeader(this.browser);
        const webAppLoginPage: WebAppLoginPage = new WebAppLoginPage(this.browser);
        this.browser.sleep(1000);
        await webAppHeader.signOut();
        this.browser.sleep(2000);
        await webAppLoginPage.login(email, password);
        this.browser.sleep(1000);
    }

    public async getUUIDfromURL() {
        const currentUrl = (await this.browser.getCurrentUrl()).split('/');
        return currentUrl[currentUrl.length - 1];
    }

    public async addToMappedSlugs(slugsPagesPairsToAdd: { slug_path: string; pageUUID: string }[], client: Client) {
        const generalService = new GeneralService(client);
        const dataViewsService = new DataViewsService(generalService.papiClient);
        const slugs: Slugs = new Slugs(this.browser);
        const existingMappedSlugs = await slugs.getExistingMappedSlugsList(dataViewsService);
        const slugsFields: MenuDataViewField[] = this.prepareDataForDragAndDropAtSlugs(
            slugsPagesPairsToAdd,
            existingMappedSlugs,
        );
        console.info(`slugsFields: ${JSON.stringify(slugsFields, null, 4)}`);
        const slugsFieldsToAddToMappedSlugsObj = new UpsertFieldsToMappedSlugs(slugsFields);
        console.info(`slugsFieldsToAddToMappedSlugs: ${JSON.stringify(slugsFieldsToAddToMappedSlugsObj, null, 4)}`);
        const upsertFieldsToMappedSlugs = await dataViewsService.postDataView(slugsFieldsToAddToMappedSlugsObj);
        return { previouslyExistingMappedSlugs: existingMappedSlugs, postResponse: upsertFieldsToMappedSlugs };
    }

    public async runOverMappedSlugs(mappedSlugsList: MenuDataViewField[], client: Client) {
        const generalService = new GeneralService(client);
        const dataViewsService = new DataViewsService(generalService.papiClient);
        const slugsFields: MenuDataViewField[] = this.prepareDataForDragAndDropAtSlugs([], mappedSlugsList);
        console.info(`slugsFields: ${JSON.stringify(slugsFields, null, 4)}`);
        const slugsFieldsToAddToMappedSlugsObj = new UpsertFieldsToMappedSlugs(slugsFields);
        console.info(`slugsFieldsToAddToMappedSlugs: ${JSON.stringify(slugsFieldsToAddToMappedSlugsObj, null, 4)}`);
        const upsertFieldsToMappedSlugs = await dataViewsService.postDataView(slugsFieldsToAddToMappedSlugsObj);
        console.info(`upsertFieldsToMappedSlugs RESPONSE: ${JSON.stringify(upsertFieldsToMappedSlugs, null, 4)}`);
        return upsertFieldsToMappedSlugs;
    }

    public async configureResourceE2E(
        client: Client,
        resourceData: {
            collection?: {
                createUDC?: CollectionDefinition;
                addValuesToCollection?: { [fieldName: string]: any }[];
            };
            editor?: {
                editorDetails: { nameOfEditor: string; descriptionOfEditor: string; nameOfResource: string };
                editorConfiguration?: { editorKey: string; fieldsToConfigureInEditor: BaseFormDataViewField[] };
            };
            view?: {
                viewDetails: { nameOfView: string; descriptionOfView: string; nameOfResource: string };
                viewConfiguration?: ViewConfiguration;
            };
            page?: {
                pageDetails: { nameOfPage: string; descriptionOfPage: string; extraSection: boolean };
                pageBlocks: { blockType: 'Viewer' | 'Configuration'; selectedViews: SelectedView[] }[];
            };
            slug?: {
                slugDisplayName: string;
                slug_path: string;
                keyOfMappedPage: string;
                email: string;
                password: string;
            };
            homePageButton?: { toAdd: boolean; slugDisplayName: string };
        },
    ) {
        const generalService = new GeneralService(client);
        const udcService = new UDCService(generalService);
        // const dataViewsService = new DataViewsService(generalService.papiClient);
        const resourceViews = new ResourceViews(this.browser);
        const resourceEditors = new ResourceEditors(this.browser);
        const webAppHomePage = new WebAppHomePage(this.browser);
        const webAppHeader = new WebAppHeader(this.browser);
        const pageBuilder = new PageBuilder(this.browser);
        const brandedApp = new BrandedApp(this.browser);
        let editorUUID = '';
        let viewUUID = '';
        let pageUUID = '';

        if (resourceData.collection) {
            if (resourceData.collection.createUDC) {
                const bodyOfCollection = udcService.prepareDataForUdcCreation(resourceData.collection.createUDC);
                const upsertResponse = await udcService.upsertUDC(bodyOfCollection, 'schemes');
                console.info(`UDC upsert Response: ${JSON.stringify(upsertResponse, null, 2)}`);
            }
            if (resourceData.collection.addValuesToCollection) {
                resourceData.collection.addValuesToCollection.forEach(async (listing) => {
                    const upsertingValues_Response = await udcService.upsertValuesToCollection(
                        listing,
                        'ReferenceAccountAuto',
                    );
                    console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                    expect(upsertingValues_Response.Ok).to.be.true;
                    expect(upsertingValues_Response.Status).to.equal(200);
                    expect(upsertingValues_Response.Error).to.eql({});
                });
            }
        }
        if (resourceData.editor) {
            await this.addEditor(resourceData.editor.editorDetails);
            editorUUID = await this.getUUIDfromURL();
            if (resourceData.editor.editorConfiguration) {
                await resourceEditors.customEditorConfig(generalService.papiClient, {
                    editorKey: resourceData.editor.editorConfiguration.editorKey || editorUUID,
                    fieldsToConfigureInView: resourceData.editor.editorConfiguration.fieldsToConfigureInEditor,
                });
            }
        }
        if (resourceData.view) {
            await this.addView(resourceData.view.viewDetails);
            viewUUID = await this.getUUIDfromURL();
            if (resourceData.view.viewConfiguration) {
                await resourceViews.customViewConfig(client, {
                    matchingEditorName: '',
                    viewKey: resourceData.view.viewConfiguration.viewKey || viewUUID,
                    fieldsToConfigureInView: resourceData.view.viewConfiguration.fieldsToConfigureInView,
                    fieldsToConfigureInViewMenu: resourceData.view.viewConfiguration.fieldsToConfigureInViewMenu,
                    fieldsToConfigureInViewLineMenu:
                        resourceData.view.viewConfiguration.fieldsToConfigureInViewLineMenu,
                    fieldsToConfigureInViewSmartSearch:
                        resourceData.view.viewConfiguration.fieldsToConfigureInViewSmartSearch,
                    fieldsToConfigureInViewSearch: resourceData.view.viewConfiguration.fieldsToConfigureInViewSearch,
                });
            }
            await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
            await webAppHeader.goHome();
        }
        if (resourceData.page) {
            pageUUID = await this.addPage(
                resourceData.page.pageDetails.nameOfPage,
                resourceData.page.pageDetails.descriptionOfPage,
                resourceData.page.pageDetails.extraSection,
            );
            const createdPage = await pageBuilder.getPageByUUID(pageUUID, client);
            let blockInstance: ViewerBlock;
            resourceData.page.pageBlocks.forEach((block) => {
                switch (block.blockType) {
                    case 'Viewer':
                        blockInstance = new ViewerBlock(block.selectedViews);
                        break;
                    case 'Configuration':
                        break;

                    default:
                        break;
                }
                createdPage.Blocks.push(blockInstance);
                createdPage.Layout.Sections[0].Columns[0] = new BasePageLayoutSectionColumn(blockInstance.Key);
            });
            createdPage.Name = resourceData.page.pageDetails.nameOfPage;
            console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
            const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
            console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
            await webAppHeader.goHome();
        }
        if (resourceData.slug) {
            await this.createSlug(
                resourceData.slug.slugDisplayName,
                resourceData.slug.slug_path,
                resourceData.slug.keyOfMappedPage || pageUUID,
                resourceData.slug.email,
                resourceData.slug.password,
                client,
            );
            this.browser.sleep(0.5 * 1000);
        }
        if (resourceData.homePageButton && resourceData.homePageButton.toAdd === true) {
            await brandedApp.addAdminHomePageButtons(resourceData.homePageButton.slugDisplayName);
            await this.performManualSync(client);
            await webAppHomePage.validateATDIsApearingOnHomeScreen(resourceData.homePageButton.slugDisplayName);
        }
    }
}
