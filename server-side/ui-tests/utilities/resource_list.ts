import { expect } from 'chai';
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

export default class ResourceListUtils {
    public constructor(protected browser: Browser) {}

    public async navigateTo(destiny: string) {
        // posible destinies: 'Resource Views' | 'Slugs' | 'Page Builder' (At Settings Side-Bar)
        const header: WebAppHeader = new WebAppHeader(this.browser);
        const settingsSidePanel: WebAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        try {
            // if (!(await this.browser.getCurrentUrl()).includes('HomePage')) {
            //     await header.goHome();
            // }
            await header.goHome();
            await header.openSettings();
            await settingsSidePanel.selectSettingsByID('Pages');
            switch (destiny) {
                case 'Resource Views':
                    const resourceList: ResourceList = new ResourceList(this.browser);
                    await settingsSidePanel.clickSettingsSubCategory('views_and_editors', 'Pages');
                    if (await this.browser.isElementVisible(resourceList.EditPage_BackToList_Button)) {
                        await resourceList.clickElement('EditPage_BackToList_Button');
                    }
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

    public async addEditor(nameOfEditor: string, descriptionOfEditor: string, nameOfResource: string) {
        const rlEditors: ResourceEditors = new ResourceEditors(this.browser);
        await this.navigateTo('Resource Views');
        await rlEditors.clickTab('Editors_Tab');
        await rlEditors.validateEditorsListPageIsLoaded();
        await rlEditors.addToResourceList(nameOfEditor, descriptionOfEditor, nameOfResource);
        await rlEditors.verifyEditorEditPageOpen(nameOfEditor);
        // rlEditors.setEditorName(nameOfEditor);
    }

    public async addView(nameOfView: string, descriptionOfView: string, nameOfResource: string) {
        const rlViews: ResourceViews = new ResourceViews(this.browser);
        await this.navigateTo('Resource Views');
        await rlViews.validateViewsListPageIsLoaded();
        await rlViews.addToResourceList(nameOfView, descriptionOfView, nameOfResource);
        await rlViews.verifyViewEditPageOpen(nameOfView); // IS DIFFERENT than: Editor Edit Page !  DO NOT CHANGE (Hagit, Dec2022)
        // rlViews.setViewName(nameOfView);
    }

    public async addPage(nameOfPage: string, descriptionOfPage: string) {
        const pageBuilder: PageBuilder = new PageBuilder(this.browser);
        await this.navigateTo('Page Builder');
        await pageBuilder.waitTillVisible(pageBuilder.PageBuilder_Title, 15000);
        await pageBuilder.waitTillVisible(pageBuilder.AddPage_Button, 15000);
        pageBuilder.pause(1000);
        await pageBuilder.addBlankPage(nameOfPage, descriptionOfPage);
        pageBuilder.pause(6000);
    }

    public async basicEditorConfig() {
        const rlEditors: ResourceEditors = new ResourceEditors(this.browser);
        await rlEditors.clickElement('Form_Tab');
        await rlEditors.waitTillVisible(rlEditors.EditPage_ConfigProfileCard_Rep, 15000);
        await rlEditors.clickElement('EditPage_ConfigProfileCard_EditButton_Rep');
        rlEditors.pause(500);
        await rlEditors.clickElement('EditPage_MappedFields_DeleteButton_ByText_CreationDateTime');
        rlEditors.pause(500);
        await rlEditors.clickElement('EditPage_MappedFields_DeleteButton_ByText_ModificationDateTime');
        rlEditors.pause(500);
        await rlEditors.clickElement('EditPage_MappedFields_ReadOnly_CheckBox_ByText_Key');
        rlEditors.pause(500);
        await rlEditors.clickElement('EditPage_ProfileEditButton_Save');
        await rlEditors.waitTillVisible(rlEditors.Save_Popup_PepDialog, 5000);
        expect(await (await this.browser.findElement(rlEditors.Save_Popup_MessageDiv)).getText()).to.contain(
            'Saved successfully',
        );
        await rlEditors.clickElement('Save_Popup_Close_Button');
        await rlEditors.clickElement('EditPage_ProfileEditButton_Back');
        await rlEditors.clickElement('EditPage_BackToList_Button');
    }

    public async basicViewConfig(nameOfEditor: string) {
        const rlViews: ResourceViews = new ResourceViews(this.browser);
        await rlViews.selectEditor(rlViews.SelectEditor_DropDown, nameOfEditor);
        await rlViews.clickElement('EditPage_Update_Button');
        await rlViews.waitTillVisible(rlViews.Update_Popup_PepDialog, 5000);
        expect(await (await this.browser.findElement(rlViews.Update_Popup_MessageDiv)).getText()).to.contain(
            'Successfully updated',
        );
        await rlViews.clickElement('Update_Popup_Close_Button');
        rlViews.pause(5000);
    }

    public async createBlockFullFlowE2E(nameOfResource: string, uniqueName: string) {
        // Add Editor
        const slugs: Slugs = new Slugs(this.browser);
        const editor_name = `${nameOfResource}_RL_Editors_Test_${uniqueName}`;
        const editor_decsription = `${nameOfResource} Editor for RL automated testing`;
        await this.addEditor(editor_name, editor_decsription, nameOfResource);
        // Configure Editor
        await this.basicEditorConfig();
        // Add View
        const view_name = `${nameOfResource}_RL_Views_Test_${uniqueName}`;
        const view_decsription = `${nameOfResource} View for RL automated testing`;
        await this.addView(view_name, view_decsription, nameOfResource);
        // Configure View
        await this.basicViewConfig(editor_name);
        // Create Page
        const page_name = `${nameOfResource} Page ${uniqueName}_Test`;
        const page_description = `Automation Testing Page for resource ${nameOfResource}`;
        await this.addPage(page_name, page_description);
        // Nevigate to Slugs
        await this.navigateTo('Slugs');
        await slugs.clickTab('Mapping_Tab');
        this.browser.sleep(7000);
    }

    public async mappingSlugWithPage(slugName: string, pageName: string) {
        const slugs: Slugs = new Slugs(this.browser);
        await this.navigateTo('Slugs');
        await slugs.mapPageToSlug(slugName, pageName);
    }

    // public prepareDataForUdcCreation(collectionData: {
    //     nameOfCollection: string,
    //     fieldsOfCollection: {
    //         classType: "Primitive" | "Array" | "Contained" | "Resource",
    //         fieldName: string,
    //         fieldType?: SchemeFieldType,
    //         indexed?: boolean,
    //         mandatory?: boolean,
    //         fieldDescription?: string,
    //         dataViewType?: DataViewFieldType,
    //         readonly?: boolean
    //     }[],
    //     descriptionOfCollection?: string
    // }
    // ) {
    //     const collectionFields = {};
    //     const udcListViewFields = collectionData.fieldsOfCollection.map((schemeField) => {
    //         switch (schemeField.classType) {
    //             case "Primitive":
    //                 collectionFields[schemeField.fieldName] = new PrimitiveTypeUdcField(
    //                     schemeField.fieldDescription ? schemeField.fieldDescription : "",
    //                     schemeField.hasOwnProperty('mandatory') ? schemeField.mandatory : false,
    //                     schemeField.fieldType ? schemeField.fieldType : "String",
    //                     schemeField.hasOwnProperty('indexed') ? schemeField.indexed : false,
    //                 );
    //                 break;

    //             default:
    //                 break;
    //         }
    //         return new DataViewBaseField(
    //             schemeField.fieldName,
    //             schemeField.dataViewType ? schemeField.dataViewType : "TextBox",
    //             schemeField.hasOwnProperty('mandatory') ? schemeField.mandatory : false,
    //             schemeField.hasOwnProperty('readonly') ? schemeField.readonly : true
    //         )
    //     })
    //     const udcListView = new UpsertUdcGridDataView(udcListViewFields);
    //     const bodyOfCollectionWithFields = new BodyToUpsertUdcWithFields(
    //         collectionData.nameOfCollection,
    //         collectionFields,
    //         udcListView,
    //         collectionData.descriptionOfCollection ? collectionData.descriptionOfCollection : ""
    //     );

    //     return bodyOfCollectionWithFields;
    // }

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

    public prepareDataForDragAndDropAtSlugs(arrayOfSlugPathSlugUUID: [string, string][]) {
        const fields: MenuDataViewField[] = [];
        let field: MenuDataViewField;
        arrayOfSlugPathSlugUUID.forEach((slugPathSlugUUID: [string, string]) => {
            field = new SlugField(slugPathSlugUUID[0], slugPathSlugUUID[1]);
            fields.push(field);
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
}
