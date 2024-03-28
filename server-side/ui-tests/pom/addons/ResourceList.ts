import { BaseFormDataViewField, DataViewFieldType, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { expect } from 'chai';
import { By } from 'selenium-webdriver';
import {
    UpsertResourceFieldsToEditor,
    UpsertResourceFieldsToView,
    UpsertResourceFieldsToViewLineMenu,
    UpsertResourceFieldsToViewMenu,
    UpsertResourceFieldsToViewSearch,
    UpsertResourceFieldsToViewSmartSearch,
} from '../../blueprints/DataViewBlueprints';
import { AddonPage } from './base/AddonPage';
import { Client } from '@pepperi-addons/debug-server/dist';
import { GeneralService } from '../../../services';
import { DataViewsService } from '../../../services/data-views.service';
import E2EUtils from '../../utilities/e2e_utils';

export interface ViewConfiguration {
    matchingEditorName: string;
    viewKey: string;
    fieldsToConfigureInView: {
        fieldName: string;
        dataViewType: DataViewFieldType;
        mandatory: boolean;
        readonly: boolean;
    }[];
    fieldsToConfigureInViewMenu?: { fieldName: string }[];
    fieldsToConfigureInViewLineMenu?: { fieldName: string }[];
    fieldsToConfigureInViewSmartSearch?: { fieldName: string }[];
    fieldsToConfigureInViewSearch?: { fieldName: string }[];
}

export class ResourceList extends AddonPage {
    // *general selectors for Resource Views*
    public PepTopArea_title: By = By.xpath('//div[contains(@class, "pep-top-area")]');
    public TabsContainer: By = By.xpath('//div[contains(@class, "mat-tab-labels")]');
    // Tabs
    public Highlighted_Tab: By = By.xpath(
        '//div[contains(@class,"mat-tab-labels")]/div[@role="tab"][@aria-selected="true"]/div',
    );
    public Views_Tab: By = this.getSelectorOfResourceListSettingsTab('Views');
    public Editors_Tab: By = this.getSelectorOfResourceListSettingsTab('Editors');
    public General_Tab: By = this.getSelectorOfResourceListSettingsTab('General');
    public Form_Tab: By = this.getSelectorOfResourceListSettingsTab('Form');
    public Menu_Tab: By = this.getSelectorOfResourceListSettingsTab('Menu');
    public LineMenu_Tab: By = this.getSelectorOfResourceListSettingsTab('Line Menu');
    public SmartSearch_Tab: By = this.getSelectorOfResourceListSettingsTab('Smart Search');
    public Search_Tab: By = this.getSelectorOfResourceListSettingsTab('Search');
    public SearchBox: By = By.xpath('//div[contains(@class,"pep-search-input")]//input[contains(@id,"mat-input")]');
    public SearchMagnifierIcon: By = By.xpath(
        '//div[contains(@class,"pep-search-input")]//pep-icon[@name="system_search"]/parent::mat-icon',
    );
    // List
    public GenericList_Content: By = By.xpath('//pep-generic-list/pep-page-layout/div[@class="pep-page-main-layout"]');
    public GenericList_Title: By = By.xpath(
        '//pep-generic-list//div[contains(@class,"header-content")]//div[contains(@class,"title")]/span',
    );
    public Add_Button: By = By.xpath('//span[@title="Add"]/ancestor::button');
    public AddonSettingsContent_ListTitle: By = By.xpath('//pep-top-bar //div[contains(@class,"title")]');
    public List_NoDataFound: By = By.xpath('//pep-list/div/p[contains(@class, "no-data")]');
    public Label_Name: By = this.getSelectorOfLabelUnderTableHeader('Name');
    public Label_Description: By = this.getSelectorOfLabelUnderTableHeader('Description');
    public Label_Resource: By = this.getSelectorOfLabelUnderTableHeader('Resource');
    public RadioButtons: By = By.xpath('//input[@type="radio"]');
    public FirstRadioButtonInList: By = By.xpath('//virtual-scroller/div[2]/div/fieldset/mat-radio-button');
    public SelectedRadioButton: By = By.xpath('//mat-radio-button[contains(@class, "checked")]');
    public ResultsDiv: By = By.xpath(
        '//*[contains(@id,"mat-tab-content")]//pep-generic-list/pep-page-layout//pep-top-bar//pep-list-total/div/div',
    );
    public NumberOfItemsInList: By = By.xpath(
        '//div[contains(text(), "result")]/span[contains(@class, "bold number")]',
    );
    public Pencil_Button: By = By.xpath('//pep-list-actions/pep-menu/div/button');
    public Pencil_Edit: By = this.getSelectorOfButtonUnderPencilMenu('Edit');
    public Pencil_Delete: By = this.getSelectorOfButtonUnderPencilMenu('Delete');
    // Delete Pop-up
    public DeletePopup_Dialog: By = By.xpath('//*[text()=" Delete "]/ancestor::pep-dialog');
    public DeletePopup_Delete_Button: By = this.getSelectorOfButtonUnderDeletePopupWindow('Delete');
    public DeletePopup_Cancel_Button: By = this.getSelectorOfButtonUnderDeletePopupWindow('Cancel');
    // Add Pop-up
    public AddPopup_Title: By = By.xpath('//span[contains(@class,"dialog-title")]');
    public AddPopup_Name: By = By.xpath('//input[@id="Name"]');
    public AddPopup_Description: By = By.xpath('//input[@id="Description"]');
    public AddPopup_Cancel: By = By.xpath('//pep-button/button[@data-qa="Cancel"]');
    public AddPopup_Save: By = By.xpath('//pep-button/button[@data-qa="Save"]');
    public AddPopup_Resource: By = By.xpath('//*[contains(@id,"mat-select-value")]/span/span');
    public AddPopupResourceDropdown: By = By.id('Resource-panel');
    public AddPopupResourceDropdownSingleOption: By = By.xpath(
        '//*[contains(@id,"mat-dialog")]/app-add-form/pep-dialog//pep-form/fieldset/mat-grid-list//pep-select/mat-form-field/div/div[1]',
    );
    // Edit page
    public EditPage_Title: By = By.xpath('//pep-top-bar/div/div/div/div/div/div[2]/span');
    public EditPage_BackToList_Button: By = By.xpath('//span[@title="Back to list"]/ancestor::button');
    public EditPage_Update_Button: By = By.xpath('//button[@data-qa="Update"]');
    //EVGENY
    public TextLabelElements: By = By.xpath('//mat-form-field//input');
    // Update Popup
    public Update_Popup_PepDialog: By = By.xpath('//span[text()=" Update "]/ancestor::pep-dialog');
    public Update_Popup_MessageDiv: By = By.xpath('//span[text()=" Update "]/ancestor::pep-dialog/div[2]/div');
    public Update_Popup_Close_Button: By = By.xpath(
        '//span[text()=" Update "]/ancestor::pep-dialog //span[text()=" Close "]/parent::button',
    );
    // Edit Tabs Configuration - moved to AddonPage.ts (Dec2022 Hagit)

    // Edit Page Profile Edit
    public EditPage_ProfileEditButton_Back: By = this.getSelectorOfEditPageProfileEditButton('Back'); //By.xpath('//button[@data-qa="Back"]');
    public EditPage_ProfileEditButton_Save: By = this.getSelectorOfEditPageProfileEditButton('Save'); //By.xpath('//button[@data-qa="Save"]');
    public EditPage_MappedFields_DeleteButton_ByText_CreationDateTime: By =
        this.getSelectorOfEditPageMappedFieldsByTextDeleteButton('Creation Date Time');
    public EditPage_MappedFields_DeleteButton_ByText_ModificationDateTime: By =
        this.getSelectorOfEditPageMappedFieldsByTextDeleteButton('Modification Date Time');
    public EditPage_MappedFields_ReadOnly_CheckBox_ByText_Key: By =
        this.getSelectorOfEditPageMappedFieldsByTextReadOnlyCheckBox('Key');
    // Save Popup
    public Save_Popup_PepDialog: By = By.xpath('//span[contains(text(),"Save")]/ancestor::pep-dialog');
    public Save_Popup_MessageDiv: By = By.xpath('//span[contains(text(),"Save")]/ancestor::pep-dialog/div[2]/div');
    public Save_Popup_Close_Button: By = By.xpath(
        '//span[text()=" Save "]/ancestor::pep-dialog //span[text()=" Close "]/parent::button',
    );

    //editor dialog
    public DialogElement: By = By.xpath('//mat-dialog-container[@role="dialog"]');
    public InputInsideDialogElement: By = By.xpath('//mat-label[contains(text(),"{placeholder}")]//..//..//..//input');

    public getSelectorOfResourceListSettingsTab(title: string) {
        return By.xpath(`//div[contains(@class,"mat-tab-labels")] //div[text()="${title}"]/parent::div[@role="tab"]`);
    }

    private getSelectorOfButtonUnderDeletePopupWindow(title: string) {
        return By.xpath(`//span[contains(text(),"${title}")]/parent::button`);
    }

    private getSelectorOfButtonUnderPencilMenu(title: string) {
        return By.xpath(`//span[@title="${title}"]/parent::button`);
    }

    private getSelectorOfLabelUnderTableHeader(title: string) {
        return By.xpath(`//label[@id="${title}"]`);
    }

    public getSelectorOfRowInListByName(name: string) {
        return By.xpath(`//span[@id="Name"][@title="${name}"]/ancestor::pep-textbox/ancestor::pep-form`);
    }

    public getSelectorOfRadioButtonInListByName(name: string) {
        return By.xpath(`${this.getSelectorOfRowInListByName(name).value}/ancestor::fieldset/mat-radio-button`);
    }

    public getSelectorOfRowInListByPartialName(name: string) {
        return By.xpath(`//span[@id="Name"][contains(text(),"${name}")]/ancestor::pep-form`);
    }

    public getSelectorOfEditPgaeTitleWithName(name: string) {
        return By.xpath(`//span[@title="Edit - ${name}"]`);
    }

    private getSelectorOfEditPageProfileEditButton(title: string) {
        return By.xpath(`//button[@data-qa="${title}"]`);
    }

    private getSelectorOfEditPageMappedFieldsByTextDeleteButton(title: string) {
        return By.xpath(
            `//div[@id="mappedFields"] //pep-textbox[@type="text"] //input[@title="${title}"]/ancestor::app-editor-mapped-field //pep-button[contains(@class,"del-button")]/button`,
        );
    }

    private getSelectorOfEditPageMappedFieldsByTextReadOnlyCheckBox(title: string) {
        return By.xpath(
            `//div[@id="mappedFields"] //pep-textbox[@type="text"] //input[@title="${title}"]/ancestor::app-editor-mapped-field //pep-checkbox //mat-checkbox/label/span[contains(@class,"mat-checkbox-inner-container")]`,
        );
    }

    public async selectResource(resName: string, dropdownElement: By) {
        await this.selectDropBoxByString(dropdownElement, resName);
    }

    public async clickTab(tabName: 'Views_Tab' | 'Editors_Tab' | 'General_Tab' | 'Form_Tab') {
        if (this[tabName]) {
            try {
                await this.browser.click(this[tabName]);
                const tabSelected = await (await this.browser.findElement(this[tabName])).getAttribute('aria-selected');
                expect(Boolean(tabSelected)).to.be.true;
            } catch (error) {
                console.info(`UNABLE TO SELECT: ${tabName}`);
                console.error(error);
                expect(`ERROR -> UNABLE TO SELECT: ${tabName}`).to.be.undefined;
            }
        } else {
            expect(`${tabName} is NOT defined in the ResourceList.ts selectors' list`).to.be.null;
        }
    }

    public async editDataInsideRsourceListEditorPopup(valueLabelName: string, dataToInsert: string) {
        await this.browser.untilIsVisible(this.DialogElement);
        const inputElement = this.InputInsideDialogElement.valueOf()
            ['value'].slice()
            .replace('{placeholder}', valueLabelName);
        await this.browser.click(By.xpath(inputElement));
        await this.browser.sendKeys(By.xpath(inputElement), dataToInsert);
        this.browser.sleep(1000 * 2);
        await this.browser.click(this.EditPage_Update_Button);
        this.browser.sleep(1000 * 3);
    }

    public async openPencilMenu() {
        try {
            await this.browser.untilIsVisible(this.Pencil_Button, 500);
            await this.click(this.Pencil_Button);
        } catch (error) {
            console.info('Unable to Click Pencil_Button!!!');
            console.error(error);
            expect('Unable to Click Pencil_Button!!!').to.be.undefined;
        }
    }

    public async selectUnderPencil(buttonTitle: 'Edit' | 'Delete') {
        try {
            const selector = this.getSelectorOfButtonUnderPencilMenu(buttonTitle);
            await this.browser.untilIsVisible(selector, 500);
            await this.click(selector);
            switch (buttonTitle) {
                case 'Delete':
                    await this.browser.untilIsVisible(this.DeletePopup_Dialog, 500);
                    break;
                case 'Edit':
                    const tabText = await (await this.browser.findElement(this.Highlighted_Tab)).getText();
                    if (tabText === 'Views') {
                        await this.browser.untilIsVisible(this.EditPage_BackToList_Button, 1000);
                    }
                    if (tabText === 'Editors') {
                        await this.browser.untilIsVisible(this.EditPage_Title, 1000);
                    }
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.info(`UNABLE TO SELECT: ${buttonTitle}`);
            console.error(error);
            expect(`ERROR -> UNABLE TO SELECT: ${buttonTitle}`).to.be.undefined;
        }
    }

    public async confirmDeleteClickRedButton() {
        try {
            this.pause(500);
            const redDeleteButton = await this.browser.findElement(this.DeletePopup_Delete_Button);
            redDeleteButton.click();
            this.pause(1000);
            await this.checkThatElementIsNotFound('DeletePopup_Delete_Button');
        } catch (error) {
            console.info('RED DELETE Button NOT CLICKED!');
            console.error(error);
            expect('RED DELETE Button NOT CLICKED!').to.be.null;
        }
    }

    public async deleteAll() {
        let numOfEditors: string;
        do {
            numOfEditors = await (await this.browser.findElement(this.NumberOfItemsInList)).getText();
            try {
                this.browser.sleep(500);
                await this.browser.click(this.FirstRadioButtonInList);
                this.browser.sleep(500);
                await this.openPencilMenu();
                await this.selectUnderPencil('Delete');
                this.browser.sleep(500);
                await this.confirmDeleteClickRedButton();
                this.browser.sleep(500);
            } catch (error) {
                const errorMessage: string = (error as any).message;
                console.info(`MESSAGE thrown in deleteAllEditors: ${errorMessage}`);
            }
        } while (Number(numOfEditors) > 0);
        numOfEditors = await (await this.browser.findElement(this.NumberOfItemsInList)).getText();
        expect(Number(numOfEditors)).to.equal(0);
    }

    public async selectFromList(selector: By, name?: string) {
        try {
            await this.browser.click(selector);
            await this.browser.untilIsVisible(this.SelectedRadioButton);
            await expect(this.untilIsVisible(this.Pencil_Button, 90000)).eventually.to.be.true;
        } catch (error) {
            console.info(`UNABLE TO SELECT: ${name}`);
            console.error(error);
            expect(`ERROR -> UNABLE TO SELECT: ${name}`).to.be.undefined;
        }
    }

    public async selectFromListByName(name: string) {
        const selector: By = this.getSelectorOfRowInListByName(name);
        await this.selectFromList(selector, name);
    }

    public async singleSelectFromListByName(name: string) {
        const selector: By = this.getSelectorOfRadioButtonInListByName(name);
        await this.selectFromList(selector, name);
    }

    public async selectFromListByPartialName(name: string) {
        const selector: By = this.getSelectorOfRowInListByPartialName(name);
        await this.selectFromList(selector, name);
    }

    public async deleteFromListByName(name: string) {
        await this.selectFromListByName(name);
        await this.openPencilMenu();
        await this.selectUnderPencil('Delete');
        await this.confirmDeleteClickRedButton();
    }

    public async validateListPageIsLoaded() {
        await expect(this.untilIsVisible(this.GenericList_Content, 90000)).eventually.to.be.true;
        expect(await (await this.browser.findElement(this.ResultsDiv)).getText()).to.contain('result');
    }

    public async verifyResourceSelected(resourceName: string) {
        this.browser.sleep(2000);
        const inputContent = await (await this.browser.findElement(this.AddPopup_Resource)).getText();
        return expect(inputContent).to.equal(resourceName);
    }

    public async addToResourceList(testName: string, testDescription: string, nameOfResource: string) {
        await this.waitTillVisible(this.Add_Button, 5000);
        await this.click(this.Add_Button);
        await this.waitTillVisible(this.AddPopup_Title, 15000);
        await this.waitTillVisible(this.AddPopup_Name, 5000);
        await this.insertTextToInputElement(testName, this.AddPopup_Name);
        await this.insertTextToInputElement(testDescription, this.AddPopup_Description);
        await this.selectResource(nameOfResource, this.AddPopupResourceDropdownSingleOption);
        await this.verifyResourceSelected(nameOfResource);
        await this.click(this.AddPopup_Save);
        this.pause(1000);
    }

    public async gotoEditPage(name: string) {
        await this.singleSelectFromListByName(name);
        this.pause(0.5 * 1000);
        await this.openPencilMenu();
        this.pause(0.5 * 1000);
        await this.selectUnderPencil('Edit');
        this.pause(0.5 * 1000);
    }
}

export class ResourceViews extends ResourceList {
    /* specific selectors for Views TAB under Resource Views */
    public Views_List_Title: By = By.xpath('//span[@title="Views"]');
    public View_Edit_Title: By = By.xpath('//pep-top-bar/div/div/div/div/div/div[2]/span');
    // Tabs
    public Menu_Tab: By = this.getSelectorOfResourceListSettingsTab('Menu');
    public LineMenu_Tab: By = this.getSelectorOfResourceListSettingsTab('Line Menu');
    // Edit Page
    public SelectEditor_DropDown: By = By.xpath('//mat-select[@id="Editor"]/parent::div/parent::div');

    public async validateViewsListPageIsLoaded() {
        await this.validateListPageIsLoaded();
        await expect(this.untilIsVisible(this.Views_List_Title, 90000)).eventually.to.be.true;
    }

    public async verifyViewEditPageOpen(viewName: string) {
        await expect(this.untilIsVisible(this.EditPage_BackToList_Button, 90000)).eventually.to.be.true;
        this.browser.sleep(2000);
        const viewEditTitle = await (await this.browser.findElement(this.View_Edit_Title)).getText();
        expect(viewEditTitle).to.contain(viewName);
        // await this.click(this.EditPage_BackToList_Button);
    }

    public async selectEditor(dropdownElement: By, editorName: string) {
        await this.selectDropBoxByString(dropdownElement, editorName);
    }

    public async searchForViewByName(name: string) {
        await this.insertTextToInputElement(name, this.SearchBox);
        this.browser.sleep(0.1 * 1000);
        await this.browser.click(this.SearchMagnifierIcon);
        this.browser.sleep(0.5 * 1000);
    }

    public async gotoEditPageOfView(viewName: string) {
        await this.singleSelectFromListByName(viewName);
        this.pause(0.5 * 1000);
        await this.openPencilMenu();
        this.pause(0.5 * 1000);
        await this.selectUnderPencil('Edit');
        this.pause(0.5 * 1000);
        await this.verifyViewEditPageOpen(viewName);
        this.pause(2 * 1000);
    }

    public async basicViewConfig(matchingEditorName: string) {
        await this.selectEditor(this.SelectEditor_DropDown, matchingEditorName);
        await this.click(this.EditPage_Update_Button);
        await this.waitTillVisible(this.Update_Popup_PepDialog, 5000);
        expect(await (await this.browser.findElement(this.Update_Popup_MessageDiv)).getText()).to.contain(
            'Successfully updated',
        );
        await this.click(this.Update_Popup_Close_Button);
        this.pause(0.5 * 1000);
        await this.click(this.Form_Tab);
        await this.waitTillVisible(this.EditPage_ConfigProfileCard_Rep, 15000);
        await this.click(this.EditPage_ConfigProfileCard_EditButton_Rep);
        this.pause(0.5 * 1000);
        await this.click(this.EditPage_ProfileEditButton_Save);
        this.pause(0.5 * 1000);
        await this.waitTillVisible(this.Save_Popup_PepDialog, 5000);
        expect(await (await this.browser.findElement(this.Save_Popup_MessageDiv)).getText()).to.contain(
            'Saved successfully',
        );
        await this.click(this.Save_Popup_Close_Button);
        await this.click(this.EditPage_ProfileEditButton_Back);
        this.pause(5 * 1000);
    }

    public async clickUpdateHandleUpdatePopUpGoBack() {
        await this.click(this.EditPage_Update_Button);
        await this.waitTillVisible(this.Update_Popup_PepDialog, 5000);
        expect(await (await this.browser.findElement(this.Update_Popup_MessageDiv)).getText()).to.contain(
            'Successfully updated',
        );
        await this.click(this.Update_Popup_Close_Button);
        this.pause(5 * 1000);
        await this.click(this.EditPage_BackToList_Button);
    }

    public async customViewConfig(client: Client, viewData: ViewConfiguration) {
        const generalService = new GeneralService(client);
        const dataViewsService = new DataViewsService(generalService.papiClient);
        const resourceListUtils = new E2EUtils(this.browser);
        const resourceFieldsToAddToViewObj = new UpsertResourceFieldsToView(
            viewData.viewKey,
            resourceListUtils.prepareDataForDragAndDropAtEditorAndView(viewData.fieldsToConfigureInView),
        );
        console.info(`resourceFieldsToAddToViewObj: ${JSON.stringify(resourceFieldsToAddToViewObj, null, 2)}`);
        // POST https://papi.pepperi.com/V1.0/meta_data/data_views
        const upsertFieldsToView = await dataViewsService.postDataView(resourceFieldsToAddToViewObj);
        console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToView, null, 2)}`);
        this.pause(0.5 * 1000);
        if (viewData.matchingEditorName !== '') {
            //can i create a view only AFTER editor is created?
            await this.selectEditor(this.SelectEditor_DropDown, viewData.matchingEditorName);
            await this.click(this.EditPage_Update_Button);
            await this.waitTillVisible(this.Update_Popup_PepDialog, 5000);
            expect(await (await this.browser.findElement(this.Update_Popup_MessageDiv)).getText()).to.contain(
                'Successfully updated',
            );
            await this.click(this.Update_Popup_Close_Button);
            this.pause(5 * 1000);
        }
        await this.click(this.Form_Tab);
        await this.waitTillVisible(this.EditPage_ConfigProfileCard_Rep, 15000);
        await this.click(this.EditPage_ConfigProfileCard_EditButton_Rep);
        this.pause(0.5 * 1000);
        await this.click(this.EditPage_ProfileEditButton_Back);
        this.pause(5 * 1000);
        if (viewData.fieldsToConfigureInViewMenu) {
            this.customViewTabConfig('Menu', dataViewsService, generalService, {
                viewKey: viewData.viewKey,
                fields: resourceListUtils.prepareDataToConfigFieldsInViewTabs(viewData.fieldsToConfigureInViewMenu),
            });
        }
        if (viewData.fieldsToConfigureInViewLineMenu) {
            this.customViewTabConfig('LineMenu', dataViewsService, generalService, {
                viewKey: viewData.viewKey,
                fields: resourceListUtils.prepareDataToConfigFieldsInViewTabs(viewData.fieldsToConfigureInViewLineMenu),
            });
        }
        if (viewData.fieldsToConfigureInViewSmartSearch) {
            this.customViewTabConfig('SmartSearch', dataViewsService, generalService, {
                viewKey: viewData.viewKey,
                fields: resourceListUtils.prepareDataToConfigFieldsInViewTabs(
                    viewData.fieldsToConfigureInViewSmartSearch,
                ),
            });
        }
        if (viewData.fieldsToConfigureInViewSearch) {
            this.customViewTabConfig('Search', dataViewsService, generalService, {
                viewKey: viewData.viewKey,
                fields: resourceListUtils.prepareDataToConfigFieldsInViewTabs(viewData.fieldsToConfigureInViewSearch),
            });
        }
    }

    // public async customViewSmartSearchConfig(
    //     dataViewsService,
    //     smartSearch: { viewKey: string; fieldsToConfigureInViewSmartSearch: MenuDataViewField[] },
    // ) {
    //     const resourceFieldsToAddToViewSmartSearchObj = new UpsertResourceFieldsToViewSmartSearch(
    //         smartSearch.viewKey,
    //         smartSearch.fieldsToConfigureInViewSmartSearch,
    //     );
    //     // POST https://papi.pepperi.com/V1.0/meta_data/data_views
    //     const upsertFieldsToViewSmartSearch = await dataViewsService.postDataView(resourceFieldsToAddToViewSmartSearchObj);
    //     console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToViewSmartSearch, null, 2)}`);
    //     this.pause(0.5 * 1000);
    //     await this.click(this.SmartSearch_Tab);
    //     await this.waitTillVisible(this.EditPage_ConfigProfileCard_Rep, 15000);
    //     await this.click(this.EditPage_ConfigProfileCard_EditButton_Rep);
    //     this.pause(0.5 * 1000);
    //     await this.click(this.EditPage_ProfileEditButton_Back);
    //     this.pause(5 * 1000);
    // }

    public async customViewTabConfig(
        tabContext: 'Menu' | 'LineMenu' | 'SmartSearch' | 'Search',
        dataViewsService,
        generalService,
        configData: { viewKey: string; fields: MenuDataViewField[] },
    ) {
        let resourceFieldsToAddToViewTabObj;
        // const menuDataViews = await dataViewsService.getDataViews({ where: `Type LIKE ("Menu")` });
        const menuDataViews = await generalService.fetchStatus(
            "https://papi.pepperi.com/V1.0/meta_data/data_views?where=Type Like 'Menu'",
        );
        console.info(`menuDataViews: ${JSON.stringify(menuDataViews, null, 2)}`);
        switch (tabContext) {
            case 'Menu':
                resourceFieldsToAddToViewTabObj = new UpsertResourceFieldsToViewMenu(
                    configData.viewKey,
                    configData.fields,
                );
                break;
            case 'LineMenu':
                resourceFieldsToAddToViewTabObj = new UpsertResourceFieldsToViewLineMenu(
                    configData.viewKey,
                    configData.fields,
                );
                break;
            case 'SmartSearch':
                // console.info(
                //     `menuDataViews: ${JSON.stringify(
                //         menuDataViews.find((view) => {
                //             view.Context.Name.includes('SmartSearch');
                //         }),
                //         null,
                //         2,
                //     )}`,
                // );
                console.info(`menuDataViews: ${JSON.stringify(menuDataViews, null, 2)}`);
                resourceFieldsToAddToViewTabObj = new UpsertResourceFieldsToViewSmartSearch(
                    configData.viewKey,
                    configData.fields,
                );
                break;
            case 'Search':
                resourceFieldsToAddToViewTabObj = new UpsertResourceFieldsToViewSearch(
                    configData.viewKey,
                    configData.fields,
                );
                break;

            default:
                break;
        }
        // const existingRepProfile = await generalService;
        // POST https://papi.pepperi.com/V1.0/meta_data/data_views
        const upsertFieldsToViewTab = await dataViewsService.postDataView(resourceFieldsToAddToViewTabObj);
        console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToViewTab, null, 2)}`);
        this.pause(0.5 * 1000);
        await this.click(this.Search_Tab);
        await this.waitTillVisible(this.EditPage_ConfigProfileCard_Rep, 15000);
        await this.click(this.EditPage_ConfigProfileCard_EditButton_Rep);
        this.pause(0.5 * 1000);
        await this.click(this.EditPage_ProfileEditButton_Back);
        this.pause(5 * 1000);
    }

    public async deleteViewViaApiByUUID(viewKey: string, client: Client) {
        const generalService = new GeneralService(client);
        const deleteViewResponse = await generalService.fetchStatus(
            `/addons/api/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/api/views`,
            {
                method: 'POST',
                body: JSON.stringify({ Key: viewKey, Hidden: true }),
            },
        );
        return deleteViewResponse;
    }
}

export class ResourceEditors extends ResourceList {
    // *specific selectors for Editors TAB under Resource Views*
    public Editors_List_Title: By = By.xpath('//span[@title="Editors"]');
    // Edit Page
    public EditPageEditors_Update_Button: By = By.linkText(' Update ');
    public EditPageEditors_General_Tab: By = By.linkText('General');
    public EditPageEditors_Form_Tab: By = By.linkText('Form');
    public EditPageEditors_GeneralTab_Title: By = By.linkText(' Define the new content');
    public EditPageEditors_GeneralTab_NameTitle: By = By.linkText(' Name ');
    public EditPageEditors_GeneralTab_NameInput: By = By.xpath('//input[@id="Name"]');
    public EditPageEditors_GeneralTab_DescriptionTitle: By = By.linkText(' Description ');
    public EditPageEditors_GeneralTab_DescriptionInput: By = By.xpath('//input[@id="Description"]');
    public EditPageEditors_GeneralTab_ResourceTitle: By = By.linkText(' Resource ');
    public EditPageEditors_GeneralTab_ResourceDropdownField: By = By.xpath(
        '//*[@id="mat-tab-content-0-0"]/div/div[1]/pep-generic-form/pep-page-layout/div[4]/div[2]/div/div/pep-form/fieldset/mat-grid-list/div/mat-grid-tile[3]/div/pep-field-generator/pep-select/mat-form-field/div/div[1]',
    );
    public EditPageEditors_GeneralTab_DesignTitle: By = By.linkText(' Resource ');
    public EditPageEditors_GeneralTab_Design_OpenMode: By = By.linkText(' open mode ');
    public EditPageEditors_GeneralTab_Design_OpenMode_DropdownField: By = By.xpath(
        '//*[@id="mat-tab-content-0-0"]/div/div[2]/pep-select/mat-form-field/div/div[1]',
    );
    public EditPageEditors_GeneralTab_ResourceFields_Title: By = By.xpath('//span[@title="ResourceFields"]');
    public EditPageEditors_GeneralTab_ResourceFields_Results: By = By.xpath(
        '//*[@id="mat-tab-content-0-0"]/div/div[3]/block-reference-fields-table/pep-generic-list/pep-page-layout/div[4]/div[1]/pep-top-bar/div/div/div/div/div[1]/div[5]/pep-list-total/div/div',
    );
    public EditPageEditors_GeneralTab_ResourceFields_Search: By = By.xpath(
        '//*[@id="mat-tab-content-0-0"]/div/div[3]/block-reference-fields-table/pep-generic-list/pep-page-layout/div[4]/div[1]/pep-top-bar/div/div/div/div/div[3]/div[1]/pep-search/div/div/mat-form-field/div/div[1]',
    );
    public EditPageEditors_GeneralTab_ResourceFields_SearchInput: By = By.xpath('//input[@id="mat-input-0"]');
    public EditPageEditors_GeneralTab_ResourceFields_Content: By = By.xpath(
        '//*[@id="mat-tab-content-0-0"]/div/div[3]/block-reference-fields-table/pep-generic-list/pep-page-layout/div[4]/div[2]/div/div/pep-list/div[1]',
    );

    public async validateEditorsListPageIsLoaded() {
        await this.validateListPageIsLoaded();
        await expect(this.untilIsVisible(this.Editors_List_Title, 90000)).eventually.to.be.true;
    }

    public async verifyEditorEditPageOpen(editorName: string) {
        const selector: By = this.getSelectorOfEditPgaeTitleWithName(editorName);
        await expect(this.untilIsVisible(selector, 15000)).eventually.to.be.true;
        const editPageTitle = await (await this.browser.findElement(this.EditPage_Title)).getText();
        expect(editPageTitle).to.contain(editorName);
        // await this.click(this.EditPage_BackToList_Button);
    }

    public async searchForEditorByName(name: string) {
        await this.insertTextToInputElement(name, this.SearchBox);
        this.browser.sleep(0.1 * 1000);
        await this.browser.click(this.SearchMagnifierIcon);
        this.browser.sleep(0.5 * 1000);
    }

    public async gotoEditPageOfEditor(editorName: string) {
        await this.selectFromListByName(editorName);
        this.pause(0.5 * 1000);
        await this.openPencilMenu();
        this.pause(0.5 * 1000);
        await this.selectUnderPencil('Edit');
        this.pause(0.5 * 1000);
        await this.verifyEditorEditPageOpen(editorName);
        this.pause(2 * 1000);
    }

    public async basicEditorConfig() {
        await this.click(this.Form_Tab);
        await this.waitTillVisible(this.EditPage_ConfigProfileCard_Rep, 15000);
        await this.click(this.EditPage_ConfigProfileCard_EditButton_Rep);
        this.pause(500);
        await this.click(this.EditPage_MappedFields_DeleteButton_ByText_CreationDateTime);
        this.pause(500);
        await this.click(this.EditPage_MappedFields_DeleteButton_ByText_ModificationDateTime);
        this.pause(500);
        await this.click(this.EditPage_MappedFields_ReadOnly_CheckBox_ByText_Key);
        this.pause(500);
        await this.click(this.EditPage_ProfileEditButton_Save);
        await this.waitTillVisible(this.Save_Popup_PepDialog, 5000);
        expect(await (await this.browser.findElement(this.Save_Popup_MessageDiv)).getText()).to.contain(
            'Saved successfully',
        );
        await this.click(this.Save_Popup_Close_Button);
        await this.click(this.EditPage_ProfileEditButton_Back);
        await this.click(this.EditPage_BackToList_Button);
    }

    public async customEditorConfig(
        generalService: GeneralService,
        editorData: { editorKey: string; fieldsToConfigureInView: BaseFormDataViewField[] },
        editorName: string,
    ) {
        const resourceFieldsToAddToEditorObj = new UpsertResourceFieldsToEditor(
            editorData.editorKey,
            editorData.fieldsToConfigureInView,
        );
        // POST https://papi.pepperi.com/V1.0/meta_data/data_views
        // const upsertFieldsToEditor = await dataViewsService.postDataView(resourceFieldsToAddToEditorObj);
        const upsertFieldsToEditor = await generalService.fetchStatus('/meta_data/data_views', {
            method: 'POST',
            body: JSON.stringify(resourceFieldsToAddToEditorObj),
        });
        console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToEditor, null, 2)}`);
        this.pause(5 * 1000);
        await this.click(this.EditPage_BackToList_Button);
        this.pause(3 * 1000);
        await this.click(this.Editors_Tab);
        this.pause(3 * 1000);
        await this.gotoEditPage(editorName);
        this.pause(3 * 1000);
        await this.click(this.Form_Tab);
        await this.waitTillVisible(this.EditPage_ConfigProfileCard_Rep, 15000);
        await this.click(this.EditPage_ConfigProfileCard_EditButton_Rep);
        const allFieldsNames = editorData.fieldsToConfigureInView.map((view) => view.FieldID);
        const allLabelElementsFromUI = await this.browser.findElements(this.TextLabelElements);
        expect(allLabelElementsFromUI.length).to.equal(allFieldsNames.length);
        for (let index = 0; index < allLabelElementsFromUI.length; index++) {
            const uiElement = allLabelElementsFromUI[index];
            const uiElementTextValue = await uiElement.getAttribute('title');
            expect(uiElementTextValue).to.be.oneOf(allFieldsNames);
        }
    }

    public async deleteEditorViaAPI(resourceUUID: string, client: Client) {
        const generalService = new GeneralService(client);
        const body = { Key: resourceUUID, Hidden: true };
        const deleteResourceRLResponse = await generalService.fetchStatus(
            `/addons/api/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/api/editors`,
            {
                method: 'POST',
                body: JSON.stringify(body),
            },
        );
        return deleteResourceRLResponse;
    }
}
