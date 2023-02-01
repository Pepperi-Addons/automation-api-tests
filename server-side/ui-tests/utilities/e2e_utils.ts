import { Browser } from './browser';
import { WebAppHeader } from '../pom/WebAppHeader';
import { WebAppHomePage, WebAppList, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
import { ResourceList, ResourceEditors, ResourceViews } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { Slugs } from '../pom/addons/Slugs';
import { DataViewBaseField, DataFieldForEditorView, SlugField } from '../blueprints/DataViewBlueprints';
import {
    BaseFormDataViewField,
    DataViewFieldType,
    GridDataViewField,
    MenuDataViewField,
} from '@pepperi-addons/papi-sdk';
import { BasePomObject } from '../pom/base/BasePomObject';

export default class E2EUtils extends BasePomObject {
    public constructor(protected browser: Browser) {
        super(browser);
    }

    public async navigateTo(destiny: 'Resource Views' | 'Slugs' | 'Page Builder') {
        const header: WebAppHeader = new WebAppHeader(this.browser);
        const settingsSidePanel: WebAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        try {
            await header.goHome();
            await header.openSettings();
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

    public async addPage(nameOfPage: string, descriptionOfPage: string) {
        debugger;
        const pageBuilder: PageBuilder = new PageBuilder(this.browser);
        await this.navigateTo('Page Builder');
        await pageBuilder.waitTillVisible(pageBuilder.PageBuilder_Title, 15000);
        await pageBuilder.waitTillVisible(pageBuilder.AddPage_Button, 15000);
        pageBuilder.pause(1000);
        await pageBuilder.addBlankPage(nameOfPage, descriptionOfPage);
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

    public async deleteAllPagesViaUI() {
        const pageBuilder: PageBuilder = new PageBuilder(this.browser);
        await this.navigateTo('Page Builder');
        await pageBuilder.validatePageBuilderIsLoaded();
        await pageBuilder.deleteAll();
    }

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

    public async performManualSync() {
        const webAppHeader: WebAppHeader = new WebAppHeader(this.browser);
        const webAppHomePage: WebAppHomePage = new WebAppHomePage(this.browser);
        const webAppList: WebAppList = new WebAppList(this.browser);
        for (let index = 0; index < 4; index++) {
            await webAppHeader.goHome();
            await webAppHomePage.isSpinnerDone();
            await webAppHomePage.clickOnBtn('Accounts');
            await webAppList.isSpinnerDone();
            await webAppList.validateListRowElements();
        }
        await webAppHeader.goHome();
        await webAppHomePage.isSpinnerDone();
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
}
