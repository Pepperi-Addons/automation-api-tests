import { Client } from '@pepperi-addons/debug-server/dist';
import { expect } from 'chai';
import { By } from 'selenium-webdriver';
import GeneralService from '../../../../services/general.service';
import { AddonPage } from '../base/AddonPage';

export class PageBuilder extends AddonPage {
    public PageBuilder_Title: By = By.xpath('//span[@title="Page Builder"]');
    public AddPage_Button: By = By.xpath('//span[@title="Add Page"]/ancestor::pep-button/button');
    public PageBuilder_Search_Input: By = By.xpath('//input[@placeholder="Search..."]');
    public PageBuilder_Search_Submit: By = By.xpath(
        '//input[@placeholder="Search..."]/parent::div/following-sibling::div //mat-icon[2]',
    );
    // Add a new Page
    public SelectPage_Title: By = By.xpath('//span[@title="Select a Page"]');
    public BlankTemplatePage: By = By.xpath('//*[text()="Blank"]/parent::div[contains(@class,"page-cube-inner")]');
    // List
    public PagesList_Title: By = By.xpath('//pep-generic-list//div[contains(@class,"header-content")]//div[contains(@class,"left-container")]//div[contains(@class,"title")]//span');
    public PagesList_NumberOfItemsInList: By = By.xpath(
        '//div[contains(text(), "result")]/span[contains(@class, "bold number")]',
    );
    public PagesList_EmptyList_Paragraph: By = By.xpath('//pep-list//p');
    public PagesList_FirstCheckboxInList: By = By.xpath('//virtual-scroller/div[2]/div/fieldset/mat-checkbox');
    // public PagesList_PageSelectCheckbox_ByName: By = By.xpath(`${this.getSelectorOfRowInListByName('').value}/mat-checkbox/label/span`);
    // Single Selection
    public Pencil_Button: By = By.xpath('//pep-list-actions/pep-menu/div/button');
    public Pencil_Edit: By = this.getSelectorOfButtonUnderPencilMenu('Edit');
    public Pencil_Delete: By = this.getSelectorOfButtonUnderPencilMenu('Delete');
    // Delete Pop-up
    public DeletePopup_Dialog: By = By.xpath('//*[text()=" Delete "]/ancestor::pep-dialog');
    public DeletePopup_Delete_Button: By = this.getSelectorOfButtonUnderDeletePopupWindow('Delete');
    public DeletePopup_Cancel_Button: By = this.getSelectorOfButtonUnderDeletePopupWindow('Cancel');
    // Edit a Page
    public EditPage_SideBar_PageTitle: By = By.xpath('//pep-side-bar/div/div/div[1]/div[1]/div/div/div/span');
    public EditPage_EditMenu_Button_Publish: By = this.getSelectorOfButtonAtEditPageByDataQa('Publish'); //By.xpath('//button[@data-qa="Publish"]');
    public EditPage_EditMenu_Button_Save: By = this.getSelectorOfButtonAtEditPageByDataQa('Save'); //By.xpath('//button[@data-qa="Save"]');
    public EditPage_EditMenu_Button_Preview: By = this.getSelectorOfButtonAtEditPageByDataQa('Preview'); //By.xpath('//button[@data-qa="Preview"]');
    public EditPage_EditMenu_Button_Hamburger: By = By.xpath('//pep-menu //button[@mat-button]');
    public EditPage_SideBar_ArrowBack_Button: By = By.xpath('//pep-button[contains(@class,"back-button")]');
    public EditPage_SideBar_PageName_TextInput: By = By.xpath('//input[@type="text"][contains(@id,"mat-input-")]');
    public EditPage_SideBar_PageDescription_Textarea: By = By.xpath('//textarea[contains(@id,"mat-input-")]');
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

    private getSelectorOfRowInListByName(title: string) {
        return By.xpath(`//a[@id="Name"][text()="${title}"]/ancestor::fieldset`);
    }

    private getSelectorOfSelectedPageCheckboxByName(title: string) {
        return By.xpath(`//a[@id="Name"][text()="${title}"]/ancestor::fieldset/mat-checkbox/label/span`);
    }

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
        await this.waitTillVisible(this.EditPage_EditMenu_Button_Publish, 5000);
        this.pause(500);
        await this.waitTillVisible(this.EditSideBar_AddSection_Button, 5000);
        const pageNameElement = await this.browser.findElement(this.EditPage_SideBar_PageName_TextInput);
        pageNameElement.clear();
        pageNameElement.sendKeys(pageName);
        const pageDescriptionElement = await this.browser.findElement(this.EditPage_SideBar_PageDescription_Textarea);
        pageDescriptionElement.clear();
        pageDescriptionElement.sendKeys(pageDescription);
        this.pause(1500);
        await this.clickElement('EditSideBar_AddSection_Button');
        await this.waitTillVisible(this.Section_Frame, 5000);
        await this.clickElement('EditPage_EditMenu_Button_Publish');
        this.pause(1500);
    }

    public async returnToPageBuilderFromPage() {
        await this.clickElement('EditPage_SideBar_ArrowBack_Button');
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
        // needs to be fixed: can't choose checkbox from the second time on... Hagit, Jan 10th 2023
        let numOfEditors: string;
        do {
            debugger;
            numOfEditors = await (await this.browser.findElement(this.PagesList_NumberOfItemsInList)).getText();
            try {
                this.browser.sleep(500);
                const availablePagesCheckboxs = await this.browser.findElements(this.PagesList_FirstCheckboxInList);
                this.browser.sleep(500);
                availablePagesCheckboxs[0].click();
                this.browser.sleep(500);
                await this.openPencilChooseDelete();
                this.browser.sleep(500);
                await this.confirmDeleteClickRedButton();
                this.browser.sleep(500);
                await this.browser.click(this.PagesList_NumberOfItemsInList);
            } catch (error) {
                const errorMessage: string = (error as any).message;
                console.info(`MESSAGE thrown in deleteAllEditors: ${errorMessage}`);
            }
            debugger;
        } while (Number(numOfEditors) > 0);
        debugger;
        numOfEditors = await (await this.browser.findElement(this.PagesList_NumberOfItemsInList)).getText();
        expect(Number(numOfEditors)).to.equal(0);
    }

    // public async selectFromList(selector: By, name?: string) {
    //     try {
    //         await this.browser.click(selector);
    //         await this.browser.untilIsVisible(this.SelectedRadioButton);
    //         await expect(this.untilIsVisible(this.Pencil_Button, 90000)).eventually.to.be.true;
    //     } catch (error) {
    //         console.info(`UNABLE TO SELECT: ${name}`);
    //         console.error(error);
    //         expect(`ERROR -> UNABLE TO SELECT: ${name}`).to.be.undefined;
    //     }
    // }

    public async selectFromListByName(name: string) {
        const pageRow_selector: By = this.getSelectorOfRowInListByName(name);
        const pageRowCheckbox_selector: By = this.getSelectorOfSelectedPageCheckboxByName(name);
        const selectedPageRow = await this.browser.findElement(pageRow_selector);
        selectedPageRow.click();
        await (await this.browser.findElement(pageRowCheckbox_selector)).click();
    }

    // public async selectFromListByPartialName(name: string) {
    //     const selector: By = this.getSelectorOfRowInListByName(name);
    //     await this.selectFromList(selector, name);
    // }

    public async deleteFromListByName(name: string) {
        await this.selectFromListByName(name);
        await this.openPencilMenu();
        await this.selectUnderPencil('Delete');
        await this.confirmDeleteClickRedButton();
    }

    public async searchForPageByName(name: string) {
        await this.insertTextToInputElement(name, this.PageBuilder_Search_Input);
        await (await this.browser.findElement(this.PageBuilder_Search_Submit)).click();
    }

    public async publishPage(pageObj, client: Client) {
        return await this.upsertPage('publish_page', pageObj, client);
    }

    public async saveDraftPage(pageObj, client: Client) {
        return await this.upsertPage('save_draft_page', pageObj, client);
    }

    public async upsertPage(path: 'publish_page' | 'save_draft_page', pageObj, client: Client) {
        const generalService = new GeneralService(client);
        return await generalService.fetchStatus(
            `https://papi.pepperi.com/V1.0/addons/api/50062e0c-9967-4ed4-9102-f2bc50602d41/internal_api/${path}`,
            {
                method: 'POST',
                body: JSON.stringify(pageObj),
            },
        );
    }

    public async getAllPages(client: Client) {
        const generalService = new GeneralService(client);
        return await generalService.fetchStatus('/addons/api/50062e0c-9967-4ed4-9102-f2bc50602d41/api/pages');
    }

    public async getPageByUUID(pageUUID: string, client: Client) {
        const generalService = new GeneralService(client);
        const pageBuilderData = await generalService.fetchStatus(
            `/addons/api/50062e0c-9967-4ed4-9102-f2bc50602d41/internal_api/get_page_builder_data?key=${pageUUID}`,
        );
        // return { page: pageBuilderData.Body.page, name: pageBuilderData.Body.Name };
        return pageBuilderData.Body.page;
    }

    public async getPageUUIDbyPageName(pageName: string, client: Client) {
        const allPages = await this.getAllPages(client);
        const findPageByPageName = allPages.Body.find((pageObj) => {
            if (pageObj.Name === pageName) {
                return pageObj.Key;
            }
        });
        return findPageByPageName.Key ? findPageByPageName.Key : '';
    }
}
