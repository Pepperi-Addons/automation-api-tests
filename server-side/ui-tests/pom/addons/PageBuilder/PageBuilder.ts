import { expect } from 'chai';
import { By } from 'selenium-webdriver';
import { AddonPage } from '../base/AddonPage';

export class PageBuilder extends AddonPage {
    public PageBuilder_Title: By = By.xpath('//span[@title="Page Builder"]');
    public AddPage_Button: By = By.xpath('//span[@title="Add Page"]/ancestor::pep-button');
    // Add a new Page
    public SelectPage_Title: By = By.xpath('//span[@title="Select a Page"]');
    public BlankTemplatePage: By = By.xpath('//*[text()="Blank"]/parent::div[contains(@class,"page-cube-inner")]');
    // List
    public PagesList_Title: By = By.xpath('');
    public PagesList_NumberOfItemsInList: By = By.xpath(
        '//div[contains(text(), "result")]/span[contains(@class, "bold number")]',
    );
    public PagesList_FirstCheckboxInList: By = By.xpath('//virtual-scroller/div[2]/div/fieldset/mat-checkbox');
    // Single Selection
    public Pencil_Button: By = By.xpath('//pep-list-actions/pep-menu/div/button');
    public Pencil_Edit: By = this.getSelectorOfButtonUnderPencilMenu('Edit');
    public Pencil_Delete: By = this.getSelectorOfButtonUnderPencilMenu('Delete');
    // Delete Pop-up
    public DeletePopup_Dialog: By = By.xpath('//*[text()=" Delete "]/ancestor::pep-dialog');
    public DeletePopup_Delete_Button: By = this.getSelectorOfButtonUnderDeletePopupWindow('Delete');
    public DeletePopup_Cancel_Button: By = this.getSelectorOfButtonUnderDeletePopupWindow('Cancel');
    // Edit a Page
    public EditMenu_Button_Publish: By = this.getSelectorOfButtonAtEditPageByDataQa('Publish'); //By.xpath('//button[@data-qa="Publish"]');
    public EditMenu_Button_Save: By = this.getSelectorOfButtonAtEditPageByDataQa('Save'); //By.xpath('//button[@data-qa="Save"]');
    public EditMenu_Button_Preview: By = this.getSelectorOfButtonAtEditPageByDataQa('Preview'); //By.xpath('//button[@data-qa="Preview"]');
    public EditMenu_Button_Hamburger: By = By.xpath('//pep-menu //button[@mat-button]');
    public SideBar_ArrowBack_Button: By = By.xpath('//pep-button[contains(@class,"back-button")]');
    public SideBar_PageName_TextInput: By = By.xpath('//input[@type="text"][contains(@id,"mat-input-")]');
    public SideBar_PageDescription_Textarea: By = By.xpath('//textarea[contains(@id,"mat-input-")]');
    // Add Section
    public EditSideBar_AddSection_Button: By = this.getSelectorOfButtonAtEditPageByDataQa('Add Section'); //By.xpath('//button[@data-qa="Add Section"]');
    public Section_Frame: By = By.xpath('//div[contains(@id,"_column_")]');
    // Notice Popup
    public NoticePopup_Title: By = By.xpath('//span[contains(@class,"dialog-title")][contains(text(), "Notice")]');
    public NoticePopup_LeavePage_Button: By = By.xpath(
        '//span[contains(@class,"mat-button-wrapper")][contains(text(), "Leave Page")]/parent::button',
    );
    public NoticePopup_Cancel_Button: By = By.xpath(
        '//span[contains(@class,"mat-button-wrapper")][contains(text(), "Cancel")]/parent::button',
    );

    private getSelectorOfButtonUnderPencilMenu(title: string) {
        return By.xpath(`//span[@title="${title}"]/parent::button`);
    }

    private getSelectorOfButtonUnderDeletePopupWindow(title: string) {
        return By.xpath(`//span[contains(text(),"${title}")]/parent::button`);
    }

    private getSelectorOfButtonAtEditPageByDataQa(title: string) {
        return By.xpath(`//button[@data-qa="${title}"]`);
    }

    public async validatePageBuilderIsLoaded() {
        await this.waitTillVisible(this.PageBuilder_Title, 15000);
        await this.waitTillVisible(this.AddPage_Button, 15000);
        this.pause(1000);
    }

    public async addBlankPage(pageName: string, pageDescription: string) {
        await this.clickElement('AddPage_Button');
        await this.waitTillVisible(this.SelectPage_Title, 5000);
        await this.waitTillVisible(this.BlankTemplatePage, 5000);
        this.pause(500);
        await this.clickElement('BlankTemplatePage');
        await this.waitTillVisible(this.EditMenu_Button_Publish, 5000);
        this.pause(500);
        await this.waitTillVisible(this.EditSideBar_AddSection_Button, 5000);
        const pageNameElement = await this.browser.findElement(this.SideBar_PageName_TextInput);
        pageNameElement.clear();
        pageNameElement.sendKeys(pageName);
        const pageDescriptionElement = await this.browser.findElement(this.SideBar_PageDescription_Textarea);
        pageDescriptionElement.clear();
        pageDescriptionElement.sendKeys(pageDescription);
        this.pause(1500);
        await this.clickElement('EditSideBar_AddSection_Button');
        await this.waitTillVisible(this.Section_Frame, 5000);
        await this.clickElement('EditMenu_Button_Save');
        this.pause(1500);
        await this.clickElement('SideBar_ArrowBack_Button');
        if (await this.browser.isElementVisible(this.NoticePopup_Title)) {
            await this.clickElement('NoticePopup_LeavePage_Button');
        }
        this.pause(1500);
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
            numOfEditors = await (await this.browser.findElement(this.PagesList_NumberOfItemsInList)).getText();
            try {
                this.browser.sleep(500);
                await this.browser.click(this.PagesList_FirstCheckboxInList);
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
        numOfEditors = await (await this.browser.findElement(this.PagesList_NumberOfItemsInList)).getText();
        expect(Number(numOfEditors)).to.equal(0);
    }

    // public async prepareDataForPublishPageRequest() {}
}
