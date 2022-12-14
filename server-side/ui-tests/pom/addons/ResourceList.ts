import { expect } from 'chai';
import { By } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';

export class ResourceList extends AddonPage {
    // *general selectors for Resource Views*
    public PepTopArea_title: By = By.xpath('//div[contains(@class, "pep-top-area")]/h2');
    public TabsContainer: By = By.xpath('//div[contains(@class, "mat-tab-labels")]');
    // Tabs
    public Views_Tab: By = this.getSelectorOfResourceListSettingsTab('Views');
    public Editors_Tab: By = this.getSelectorOfResourceListSettingsTab('Editors');
    public General_Tab: By = this.getSelectorOfResourceListSettingsTab('General');
    public Form_Tab: By = this.getSelectorOfResourceListSettingsTab('Form');
    // List
    public GenericList_Content: By = By.xpath('//pep-generic-list/pep-page-layout/div[@class="pep-page-main-layout"]');
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
        '//*[contains(@id,"mat-tab-content")]/div/app-table/pep-page-layout/div[4]/div[2]/pep-generic-list/pep-page-layout/div[4]/div[1]/pep-top-bar/div/div/div/div/div[1]/div[5]/pep-list-total/div/div',
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
        '//*[contains(@id,"mat-dialog")]/app-add-form/pep-dialog/div[2]/pep-generic-form/pep-page-layout/div[4]/div[2]/div/div/pep-form/fieldset/mat-grid-list/div/mat-grid-tile[3]/div/pep-field-generator/pep-select/mat-form-field/div/div[1]',
    );
    // Edit page
    public EditPage_Title: By = By.xpath('//span[contains(text(), "Edit - ")]');
    public EditPage_BackToList_Button: By = By.xpath('//span[@title="Back to list"]/ancestor::button');
    public EditPage_Update_Button: By = By.xpath('//button[@data-qa="Update"]');
    // Update Popup
    public Update_Popup_PepDialog: By = By.xpath('//span[text()=" Update "]/ancestor::pep-dialog');
    public Update_Popup_MessageDiv: By = By.xpath('//span[text()=" Update "]/ancestor::pep-dialog/div[2]/div');
    public Update_Popup_Close_Button: By = By.xpath(
        '//span[text()=" Update "]/ancestor::pep-dialog //span[text()=" Close "]/parent::button',
    );
    // Edit Tabs Configuration
    public EditPage_ConfigProfileCard_Rep: By = this.getSelectorOfConfigProfileCardByName('Rep');
    public EditPage_AddProfile_Button: By = By.xpath('//button[@data-qa="Add profile"]');
    public EditPage_ProfileCard_Menu: By = By.xpath('//button[@data-qa="Add profile"]');
    public EditPage_ConfigProfileCard_EditButton_Rep: By = this.getSelectorOfProfileCardEditButtonByName('Rep');
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
    public Save_Popup_PepDialog: By = By.xpath('//span[text()=" Save "]/ancestor::pep-dialog');
    public Save_Popup_MessageDiv: By = By.xpath('//span[text()=" Save "]/ancestor::pep-dialog/div[2]/div');
    public Save_Popup_Close_Button: By = By.xpath(
        '//span[text()=" Save "]/ancestor::pep-dialog //span[text()=" Close "]/parent::button',
    );

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
        return By.xpath(`//span[@id="Name"][@text()="${name}"]/ancestor::pep-form`);
    }

    public getSelectorOfRowInListByPartialName(name: string) {
        return By.xpath(`//span[@id="Name"][contains(text(),"${name}")]/ancestor::pep-form`);
    }

    private getSelectorOfEditPgaeTitleWithName(name: string) {
        return By.xpath(`//span[@title="Edit - ${name}"]`);
    }

    private getSelectorOfConfigProfileCardByName(name: string) {
        return By.xpath(`//span[contains(text(),"${name}")]/ancestor::pep-profile-data-views-card`);
    }

    private getSelectorOfProfileCardEditButtonByName(name: string) {
        return By.xpath(
            `//span[contains(text(),"${name}")]/ancestor::pep-profile-data-views-card //pep-button[@iconname="system_edit"]/button`,
        );
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

    public async clickTab(tabName: string): Promise<void> {
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

    public async openPencilMenu() {
        try {
            await this.browser.untilIsVisible(this.Pencil_Button, 500);
            await this.clickElement('Pencil_Button');
        } catch (error) {
            console.info('Unable to Click Pencil_Button!!!');
            console.error(error);
            expect('Unable to Click Pencil_Button!!!').to.be.undefined;
        }
    }

    public async selectUnderPencil(buttonTitle: string) {
        try {
            await this.browser.untilIsVisible(this[`Pencil_${buttonTitle}`], 500);
            await this.clickElement(`Pencil_${buttonTitle}`);
            await this.browser.untilIsVisible(this.DeletePopup_Dialog, 500);
        } catch (error) {
            console.info(`UNABLE TO SELECT: ${buttonTitle}`);
            console.error(error);
            expect(`ERROR -> UNABLE TO SELECT: ${buttonTitle}`).to.be.undefined;
        }
    }

    public async openPencilChooseDelete() {
        await this.openPencilMenu();
        await this.selectUnderPencil('Delete');
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
                await this.openPencilChooseDelete();
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
        const selector: By = this.getSelectorOfRowInListByName(name); //By.xpath(`//span[@title="${name}"]/ancestor::pep-textbox`);
        await this.selectFromList(selector, name);
    }

    public async selectFromListByPartialName(name: string) {
        const selector: By = this.getSelectorOfRowInListByName(name); //By.xpath(`//span[@title="${name}"]/ancestor::pep-textbox`);
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

    public async verifyEditPageOpen(testName: string) {
        // This method is NOT Generic for both Editor and View (they have different HTML structure) - it works only for Editors (Hagit, Dec2022)
        const selector: By = this.getSelectorOfEditPgaeTitleWithName(testName);
        await expect(this.untilIsVisible(selector, 15000)).eventually.to.be.true;
        const editPageTitle = await (await this.browser.findElement(this.EditPage_Title)).getText();
        expect(editPageTitle).to.contain(testName);
    }

    public async addToResourceList(testName: string, testDescription: string, nameOfResource: string) {
        await this.waitTillVisible(this.Add_Button, 5000);
        await this.clickElement('Add_Button');
        await this.waitTillVisible(this.AddPopup_Title, 15000);
        await this.waitTillVisible(this.AddPopup_Name, 5000);
        await this.insertTextToInputElement(testName, this.AddPopup_Name);
        await this.insertTextToInputElement(testDescription, this.AddPopup_Description);
        await this.selectResource(nameOfResource, this.AddPopupResourceDropdownSingleOption);
        await this.verifyResourceSelected(nameOfResource);
        await this.clickElement('AddPopup_Save');
        this.pause(1000);
    }
}

export class ResourceViews extends ResourceList {
    /* specific selectors for Views TAB under Resource Views */
    public Views_List_Title: By = By.xpath('//span[@title="Views"]');
    public View_Edit_Title: By = By.xpath('//div[contains(@class,"pep-top-area")]/div[contains(@class,"header")]/h4');
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
    }

    public async selectEditor(dropdownElement: By, editorName: string) {
        await this.selectDropBoxByString(dropdownElement, editorName);
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
        this.verifyEditPageOpen(editorName);
    }
}
