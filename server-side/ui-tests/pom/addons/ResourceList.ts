import { expect } from 'chai';
import { By } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';

export class ResourceList extends AddonPage {

    // *general selectors for Resource Views*

    public PepTopArea: By = By.xpath('/html/body/app-root/div[2]/main/div/pep-remote-loader-element/settings-element-0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/app-settings/app-views-and-editors/pep-page-layout/div[4]/div[1]/h2');
    public TabsContainer: By = By.xpath('/html/body/app-root/div[2]/main/div/pep-remote-loader-element/settings-element-0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/app-settings/app-views-and-editors/pep-page-layout/div[4]/div[2]/mat-tab-group/mat-tab-header/div"]');
    public ViewsTab: By = By.id('mat-tab-label-0-0');
    public EditorsTab: By = By.xpath('//div[contains(text(), "Editors")]/ancestor::div[@role="tab"]');
    // List
    public GenericList_Content: By = By.xpath('//pep-generic-list/pep-page-layout/div[@class="pep-page-main-layout"]');
    public Label_Name: By = By.xpath('//label[@id="Name"]');
    public Label_Description: By = By.xpath('//label[@id="Description"]');
    public Label_Resource: By = By.xpath('//label[@id="Resource"]');
    public RadioButtons: By = By.xpath('//input[@type="radio"]');
    public SelectedRadioButton: By = By.className('mat-radio-checked');
    public EditorsTabBody: By = By.id('mat-tab-content-0-1');
    public EditorsTab_Content: By = By.xpath('//*[@id="mat-tab-content-0-1"]/div/app-table');
    public ResultsDiv: By = By.xpath('//*[@id="mat-tab-content-0-1"]/div/app-table/pep-page-layout/div[4]/div[2]/pep-generic-list/pep-page-layout/div[4]/div[1]/pep-top-bar/div/div/div/div/div[1]/div[5]/pep-list-total/div/div');
    public NumberOfEditorsInList: By = By.xpath('//*[@id="mat-tab-content-0-1"]/div/app-table/pep-page-layout/div[4]/div[2]/pep-generic-list/pep-page-layout/div[4]/div[1]/pep-top-bar/div/div/div/div/div[1]/div[5]/pep-list-total/div/div/span');
    public EmptyEditorsList: By = By.id('mat-tab-content-0-0');
    public ContentEditorsList: By = By.id('mat-tab-content-1-0');
    public NoResultsFoundDiv: By = By.xpath('//*[@id="mat-tab-content-0-0"]/div/app-table/pep-page-layout/div[4]/div[2]/pep-generic-list/pep-page-layout/div[4]/div[2]/div/div/pep-list/div[1]/p');
    public Pencil_Button: By = By.xpath('//pep-list-actions/pep-menu/div/button');
    public Pencil_Edit: By = this.getSelectorOfButtonUnderPencilMenu('Edit');
    public Pencil_Delete: By = this.getSelectorOfButtonUnderPencilMenu('Delete');
    public EditorInList: By = By.xpath('//pep-list/virtual-scroller/div[@class="scrollable-content"]/div/fieldset/mat-radio-button/label/span/input');
    // Delete Pop-up
    public DeletePopup_Dialog: By = By.xpath('//*[text()=" Delete "]/ancestor::pep-dialog');
    public DeletePopup_Delete_Button: By = this.getSelectorOfButtonUnderDeletePopupWindow('Delete');
    public DeletePopup_Cancel_Button: By = this.getSelectorOfButtonUnderDeletePopupWindow('Cancel');

    private getSelectorOfButtonUnderDeletePopupWindow(title: string) {
        return By.xpath(`//span[text()=" ${title} "]/parent::button`);
    }

    private getSelectorOfButtonUnderPencilMenu(title: string) {
        return By.xpath(`//span[@title="${title}"]/parent::button`);
    }

    public async clickTab(tabName: string): Promise<void> {
        if (this[tabName]) {
            try {
                await this.browser.click(this[tabName]);
                await expect(this.untilIsVisible(this[tabName], 90000)).eventually.to.be.true;
            } catch (error) {
                console.info(`UNABLE TO SELECT: ${tabName}`);
                console.error(error);
                expect(error).to.be.null;
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
            expect(error).to.be.null;
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
            expect(error).to.be.null;
        }
    }

    public async confirmDeleteClickRedButton() {
        try {
            await this.browser.untilIsVisible(this.DeletePopup_Delete_Button, 500);
            await this.clickElement('DeletePopup_Delete_Button');
            this.pause(1000);
            await this.checkThatElementIsNotFound('DeletePopup_Delete_Button');
        } catch (error) {
            console.info('RED DELETE Button NOT CLICKED!');
            console.error(error);
            expect(error).to.be.null;
        }
    }
}


export class ResourceViews extends ResourceList {

    // *specific selectors for Views TAB under Resource Views*

    public ViewsTabBody: By = By.id('mat-tab-content-0-0');
    public ViewsTabContent: By = By.xpath('//*[@id="mat-tab-content-0-0"]/div/app-table');
}


export class ResourceEditors extends ResourceList {

    public resourceName: string = 'resources';

    // *specific selectors for Editors TAB under Resource Views*
    public AddEditor_Button: By = By.xpath('//span[@title="Add"]/ancestor::button');
    // Add Pop-up
    public AddEditorPopup_Title: By = By.xpath('//*[@id="mat-dialog-title-0"]/span');
    public AddEditorPopup_Name: By = By.xpath('//input[@id="Name"]');
    public AddEditorPopup_Description: By = By.xpath('//input[@id="Description"]');
    public AddEditorPopup_Cancel: By = By.xpath('//button[@data-qa="Cancel"]');
    public AddEditorPopup_Save: By = By.xpath('//button[@data-qa="Save"]');
    public AddEditorPopup_Resource: By = By.xpath('//*[@id="mat-select-value-1"]/span/span');
    public AddEditorPopupResourceDropdown: By = By.id('Resource-panel');
    public AddEditorPopupResourceDropdownSingleOption: By = By.xpath('//*[@id="mat-dialog-0"]/app-add-form/pep-dialog/div[2]/pep-generic-form/pep-page-layout/div[4]/div[2]/div/div/pep-form/fieldset/mat-grid-list/div/mat-grid-tile[3]/div/pep-field-generator/pep-select/mat-form-field/div/div[1]');
    // Edit Page
    public EditPageEditors_Title: By = By.xpath('//span[contains(text(), "Edit - ")]');
    public EditPageEditors_BackToList_Button: By = By.xpath('//span[@title="Back to list"]/ancestor::button');
    public EditPageEditors_Update_Button: By = By.linkText(' Update ');
    public EditPageEditors_General_Tab: By = By.linkText('General');
    public EditPageEditors_Form_Tab: By = By.linkText('Form');
    public EditPageEditors_GeneralTab_Title: By = By.linkText(' Define the new content');
    public EditPageEditors_GeneralTab_NameTitle: By = By.linkText(' Name ');
    public EditPageEditors_GeneralTab_NameInput: By = By.xpath('//input[@id="Name"]');
    public EditPageEditors_GeneralTab_DescriptionTitle: By = By.linkText(' Description ');
    public EditPageEditors_GeneralTab_DescriptionInput: By = By.xpath('//input[@id="Description"]');
    public EditPageEditors_GeneralTab_ResourceTitle: By = By.linkText(' Resource ');
    public EditPageEditors_GeneralTab_ResourceDropdownField: By = By.xpath('//*[@id="mat-tab-content-0-0"]/div/div[1]/pep-generic-form/pep-page-layout/div[4]/div[2]/div/div/pep-form/fieldset/mat-grid-list/div/mat-grid-tile[3]/div/pep-field-generator/pep-select/mat-form-field/div/div[1]');
    public EditPageEditors_GeneralTab_DesignTitle: By = By.linkText(' Resource ');
    public EditPageEditors_GeneralTab_Design_OpenMode: By = By.linkText(' open mode ');
    public EditPageEditors_GeneralTab_Design_OpenMode_DropdownField: By = By.xpath('//*[@id="mat-tab-content-0-0"]/div/div[2]/pep-select/mat-form-field/div/div[1]');
    public EditPageEditors_GeneralTab_ResourceFields_Title: By = By.xpath('//span[@title="ResourceFields"]');
    public EditPageEditors_GeneralTab_ResourceFields_Results: By = By.xpath('//*[@id="mat-tab-content-0-0"]/div/div[3]/block-reference-fields-table/pep-generic-list/pep-page-layout/div[4]/div[1]/pep-top-bar/div/div/div/div/div[1]/div[5]/pep-list-total/div/div');
    public EditPageEditors_GeneralTab_ResourceFields_Search: By = By.xpath('//*[@id="mat-tab-content-0-0"]/div/div[3]/block-reference-fields-table/pep-generic-list/pep-page-layout/div[4]/div[1]/pep-top-bar/div/div/div/div/div[3]/div[1]/pep-search/div/div/mat-form-field/div/div[1]');
    public EditPageEditors_GeneralTab_ResourceFields_SearchInput: By = By.xpath('//input[@id="mat-input-0"]');
    public EditPageEditors_GeneralTab_ResourceFields_Content: By = By.xpath('//*[@id="mat-tab-content-0-0"]/div/div[3]/block-reference-fields-table/pep-generic-list/pep-page-layout/div[4]/div[2]/div/div/pep-list/div[1]');

    private getSelectorOfEditPgaeTitleWithName(name: string) {
        return By.xpath(`//span[@title="Edit - ${name}"]`);
    }

    public async validateEditorsListPageIsLoaded() {
        await expect(this.untilIsVisible(this.EditorsTab_Content, 90000)).eventually.to.be.true;
        expect(await (await this.browser.findElement(this.ResultsDiv)).getText()).to.contain('result');
    }

    public setResourceName(resName: string): any {
        this.resourceName = resName;
    }

    public async selectResource(resName: string, dropdownElement: By) {
        await this.selectDropBoxByString(dropdownElement, resName);

    }

    public async verifyResourceSelected() {
        this.browser.sleep(2000);
        let inputContent = await (await this.browser.findElement(this.AddEditorPopup_Resource)).getText()
        return expect(inputContent).to.equal(this.resourceName);
    }

    public async verifyEditPageOpen(testName: string) {
        let selector: By = this.getSelectorOfEditPgaeTitleWithName(testName);
        // this.browser.sleep(8000);
        await expect(this.untilIsVisible(selector, 15000)).eventually.to.be.true;
        expect(await (await this.browser.findElement(this.EditPageEditors_Title)).getText()).to.contain(testName);
    }

    public async selectFromListByName(name: string) {
        try {
            const selector: By = By.xpath(`//span[@title="${name}"]/ancestor::pep-textbox`);
            await this.browser.click(selector);
        } catch (error) {
            console.info(`UNABLE TO SELECT: ${name}`);
            console.error(error);
            expect(error).to.be.null;
        }

    }



    public async deleteEditorByName(name: string) {
        await this.selectFromListByName(name);
        await this.openPencilMenu();
        await this.selectUnderPencil('Delete');
        await this.confirmDeleteClickRedButton();
    }

    public async deleteAllEditors() {
        await this.browser.untilIsVisible(By.xpath('//pep-list'), 3000);
        try {
            debugger
            await this.browser.findElements(this.EditorInList).then((editors) => {
                debugger
                editors.forEach(async (editor) => {
                    editor.click();
                    await (await this.browser.findElement(this.Pencil_Delete)).click();
                    await (await this.browser.findElement(this.DeletePopup_Delete_Button)).click();
                })
            })
            // let allEditors = await this.browser.findElements(this.EditorInList);
            // debugger
            // if (allEditors) {
            //     debugger
            //     allEditors.forEach(async (editor) => {
            //         editor.click();
            //         await this.browser.untilIsVisible(this.Pencil_Delete, 500);
            //         await this.clickElement('Pencil_Delete');
            //         await this.browser.untilIsVisible(this.DeletePopup_Dialog, 500);
            //         await this.browser.untilIsVisible(this.DeletePopup_Delete_Button, 500);
            //         this.pause(1000);
            //         await this.clickElement('DeletePopup_Delete_Button');
            //     })
            // }
        } catch (error) {
            console.error(error);
            expect(error).to.be.null;
        }
    }
}