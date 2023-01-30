import { Client } from '@pepperi-addons/debug-server/dist';
import { expect } from 'chai';
import { By } from 'selenium-webdriver';
import GeneralService from '../../../services/general.service';
import { AddonPage } from './base/AddonPage';
import { PageBuilder } from './PageBuilder/PageBuilder';

export class Slugs extends AddonPage {
    public Slugs_Title: By = By.xpath('//span[@title="Page Mapping"]');
    public Slugs_Tab: By = this.getSelectorOfTabByText('Slugs'); //By.xpath('//div[text()="Slugs"]/parent::div[@role="tab"][contains(@id,"mat-tab-label-")]');
    public Mapping_Tab: By = this.getSelectorOfTabByText('Mapping');
    public CreateSlug_Button: By = By.xpath('//span[@title="Create Slug"]/ancestor::pep-button');
    // Create Slug Popup
    public CreateSlugPopup_Title: By = By.xpath('//span[contains(@class,"dialog-title")]');
    public CreateSlugPopup_DisplayName_Input: By = this.getSelectorOfCreateSlugPopupInputByTitle('Display Name'); //By.xpath('//mat-label[@title="Display Name"]/ancestor::pep-field-title/parent::pep-textbox/mat-form-field //input');
    public CreateSlugPopup_Slug_Input: By = this.getSelectorOfCreateSlugPopupInputByTitle('Slug');
    public CreateSlugPopup_Description_Input: By = By.xpath(
        '//mat-label[contains(@title,"Description")]/ancestor::pep-field-title/parent::div/mat-form-field //textarea',
    );
    public CreateSlugPopup_CreateSlug_Button: By = this.getSelectorOfCreateSlugPopupButtonByTitle('Create Slug'); //By.xpath('//span[@title="Create Slug"]/ancestor::button[@data-qa="Create Slug"]');
    public CreateSlugPopup_Cancel_Button: By = this.getSelectorOfCreateSlugPopupButtonByTitle('Cancel');
    // Slugs List
    public SelectedCheckbox: By = By.xpath(
        '//mat-checkbox[contains(@class,"checked")] //span[contains(@class,"mat-checkbox-inner-container")]',
    );
    public Pencil_Button: By = By.xpath('//pep-list-actions/pep-menu //button');
    public Uncheck_Checkbox: By = By.xpath('//mat-checkbox //input[@aria-checked="mixed"]');
    // Mapped Slugs
    public MappedSlugs: By = By.id('mappedSlugs');
    public MappedSlugs_SlugsPaths: By = By.xpath('//div[@id="mappedSlugs"]//input');
    public MappedSlugs_MappedPages: By = By.xpath('//div[@id="mappedSlugs"]//mat-select');
    // Page Mapping Profile Edit Button
    public PageMapping_ProfileEditButton_Save: By = this.getSelectorOfPageMappingProfileEditButton('Save');
    public PageMapping_ProfileEditButton_Cancel: By = this.getSelectorOfPageMappingProfileEditButton('Cancel');
    // Info Popup
    public Info_Popup_PepDialog: By = By.xpath('//span[contains(text(),"Info")]/ancestor::pep-dialog');
    public Info_Popup_MessageDiv: By = By.xpath('//span[contains(text(),"Info")]/ancestor::pep-dialog/div[2]/div');
    public Info_Popup_Close_Button: By = By.xpath(
        '//span[contains(text(),"Info")]/ancestor::pep-dialog //span[contains(text(),"Close")]/parent::button',
    );
    // Delete Pop-up
    public DeletePopup_Dialog: By = By.xpath('//*[text()=" Delete "]/ancestor::pep-dialog');
    public DeletePopup_Delete_Button: By = this.getSelectorOfButtonUnderDeletePopupWindow('Delete');
    public DeletePopup_Cancel_Button: By = this.getSelectorOfButtonUnderDeletePopupWindow('Cancel');

    private getSelectorOfTabByText(title: string) {
        return By.xpath(`//div[text()="${title}"]/parent::div[@role="tab"][contains(@id,"mat-tab-label-")]`);
    }

    private getSelectorOfCreateSlugPopupInputByTitle(title: string) {
        return By.xpath(
            `//mat-label[@title="${title}"]/ancestor::pep-field-title/parent::pep-textbox/mat-form-field //input`,
        );
    }

    private getSelectorOfCreateSlugPopupButtonByTitle(title: string) {
        return By.xpath(`//span[@title="${title}"]/ancestor::button[@data-qa="${title}"]`);
    }

    // private getSelectorOfRowInListByName(name: string) {
    //     return By.xpath(``);
    // }

    private getSelectorOfSelectPageDropdownBySlugName(name: string) {
        return By.xpath(
            `//input[@title="${name}"]/ancestor::pep-textbox/parent::div/pep-select/mat-form-field //mat-select/parent::div/parent::div`,
        );
    }

    private getSelectorOfPageMappingProfileEditButton(title: string) {
        return By.xpath(`//span[@title="${title}"]/ancestor::pep-button`);
    }

    // private getSelectorOfRowInListByName(title: string) {
    //     return By.xpath(`//a[@id="Name"][text()="${title}"]/ancestor::fieldset`);
    // }

    private getSelectorOfSelectedSlugCheckboxByName(title: string) {
        return By.xpath(`//a[@id="Name"][text()="${title}"]/ancestor::fieldset/mat-checkbox/label/span`);
    }

    private getSelectorOfSlugCheckboxByPartialName(title: string) {
        return By.xpath(`//a[@id="Name"][contains(text(),"${title}")]/ancestor::fieldset/mat-checkbox/label/span`);
    }

    private getSelectorOfButtonUnderDeletePopupWindow(title: string) {
        return By.xpath(`//span[contains(text(),"${title}")]/parent::button`);
    }

    public async selectFromList(selector: By, name?: string) {
        try {
            await this.browser.click(selector);
            await this.browser.untilIsVisible(this.SelectedCheckbox);
            await expect(this.untilIsVisible(this.Pencil_Button, 90000)).eventually.to.be.true;
        } catch (error) {
            console.info(`UNABLE TO SELECT: ${name}`);
            console.error(error);
            expect(`ERROR -> UNABLE TO SELECT: ${name}`).to.be.undefined;
        }
    }

    public async selectFromListByName(name: string) {
        const slugRowCheckbox_selector: By = this.getSelectorOfSelectedSlugCheckboxByName(name);
        await (await this.browser.findElement(slugRowCheckbox_selector)).click();
    }

    public async selectFromListByPartialName(name: string) {
        const selector: By = this.getSelectorOfSlugCheckboxByPartialName(name);
        await (await this.browser.findElement(selector)).click();
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

    public async deleteFromListByName(name: string) {
        await this.selectFromListByName(name);
        await this.openPencilMenu();
        await this.selectUnderPencil('Delete');
        await this.confirmDeleteClickRedButton();
    }

    public async clickTab(tabName: string): Promise<void> {
        if (this[tabName]) {
            try {
                await this.browser.click(this[tabName]);
                const tabSelected = await (await this.browser.findElement(this[tabName])).getAttribute('aria-selected');
                expect(Boolean(tabSelected)).to.be.true;
            } catch (error) {
                console.info(`UNABLE TO CLICK: ${tabName}`);
                console.error(error);
                expect(`ERROR -> UNABLE TO CLICK: ${tabName}`).to.be.undefined;
            }
        } else {
            expect(`${tabName} is NOT defined in the Slugs.ts selectors' list`).to.be.null;
        }
    }

    public async forSlugByNameSelectPageByName(nameOfSlug: string, nameOfPage: string) {
        await this.selectDropBoxByString(this.getSelectorOfSelectPageDropdownBySlugName(nameOfSlug), nameOfPage);
    }

    public async createSlug(displayNameOfSlug: string, slugPath: string, descriptionOfSlug: string) {
        this.pause(500);
        await this.click(this.CreateSlug_Button);
        await this.waitTillVisible(this.CreateSlugPopup_Title, 10000);
        await this.insertTextToInputElement(displayNameOfSlug, this.CreateSlugPopup_DisplayName_Input);
        await this.insertTextToInputElement(slugPath, this.CreateSlugPopup_Slug_Input);
        await this.insertTextToInputElement(descriptionOfSlug, this.CreateSlugPopup_Description_Input);
        this.pause(500);
        await this.click(this.CreateSlugPopup_CreateSlug_Button);
        this.pause(5000);
    }

    // TODO: method of drag & drop

    public async mapPageToSlug(pathOfSlug: string, nameOfPage: string) {
        await this.clickTab('Mapping_Tab');
        await this.isSpinnerDone();
        //click Rep Pencil button
        await this.waitTillVisible(this.EditPage_ConfigProfileCard_EditButton_Rep, 5000);
        await this.click(this.EditPage_ConfigProfileCard_EditButton_Rep);
        await this.waitTillVisible(this.MappedSlugs, 5000);
        await this.forSlugByNameSelectPageByName(pathOfSlug, nameOfPage);
        this.pause(500);
        await this.click(this.PageMapping_ProfileEditButton_Save);
        await this.waitTillVisible(this.Info_Popup_PepDialog, 5000);
        expect(await (await this.browser.findElement(this.Info_Popup_MessageDiv)).getText()).to.contain(
            'The mapped slugs are saved.',
        );
        await this.click(this.Info_Popup_Close_Button);
    }

    public async getMappedSlugsFromUI(client: Client) { // stops retrieving after 5 elements. Hagit, Jan 2023
        const mappedSlugsPages: any[] = [];
        const pageBuilder = new PageBuilder(this.browser);
        const listOfMappedSlugsNames = await this.browser.findElements(this.MappedSlugs_SlugsPaths);
        const listOfMappedPagesNames = await this.browser.findElements(this.MappedSlugs_MappedPages);
        for (let i = 0; i < listOfMappedSlugsNames.length; i++) {
            const slug = await listOfMappedSlugsNames[i].getAttribute('title');
            const pageName = await listOfMappedPagesNames[i].getAttribute('title');
            const pageUUID = await pageBuilder.getPageUUIDbyPageName(pageName, client);
            mappedSlugsPages.push({ FieldID: slug, Title: pageUUID });
        }
        return mappedSlugsPages;
    }

    public async getSlugs(client: Client) {
        const generalService = new GeneralService(client);
        return await generalService.fetchStatus('/addons/api/4ba5d6f9-6642-4817-af67-c79b68c96977/api/slugs');
    }

    public async getSlugByUUID(slugUUID: string, client: Client) {
        const generalService = new GeneralService(client);
        return await generalService.fetchStatus(`/addons/api/4ba5d6f9-6642-4817-af67-c79b68c96977/api/slugs${slugUUID}`);
    }

    public async getSlugUUIDbySlugName(slugName: string, client: Client) {
        const allSlugs = await this.getSlugs(client);
        const findSlugBySlugName = allSlugs.Body.find((slugObj) => {
            if (slugObj.Slug === slugName) {
                return slugObj.Key;
            }
        });
        return findSlugBySlugName.Key;
    }

    public async upsertSlugByUUID(slugUUID: string, slugObj, client: Client) {
        const generalService = new GeneralService(client);
        return await generalService.fetchStatus(`/addons/api/4ba5d6f9-6642-4817-af67-c79b68c96977/api/slugs/${slugUUID}`, {
            method: 'POST',
            body: JSON.stringify(slugObj),
        },);
    }
}
