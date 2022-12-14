import { expect } from 'chai';
import { By } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';

export class Slugs extends AddonPage {
    public Slugs_Title: By = By.xpath('//span[@title="Page Mapping"]');
    public Slugs_Tab: By = this.getSelectorOfTabByText('Slugs'); //By.xpath('//div[text()="Slugs"]/parent::div[@role="tab"][contains(@id,"mat-tab-label-")]');
    public Mapping_Tab: By = this.getSelectorOfTabByText('Mapping');
    public CreateSlug_Button: By = By.xpath('//span[@title="Create Slug"]/ancestor::pep-button');
    // Create Slug Popup
    public CreateSlugPopup_Title: By = By.xpath('//span[contains(@class,"dialog-title")]');
    public CreateSlugPopup_DisplayName_Input: By = this.getSelectorOfCreateSlugPopupInputByTitle('Display Name'); //By.xpath('//mat-label[@title="Display Name"]/ancestor::pep-field-title/parent::pep-textbox/mat-form-field //input');
    public CreateSlugPopup_Slug_Input: By = this.getSelectorOfCreateSlugPopupInputByTitle('Slug');
    public CreateSlugPopup_Description_Input: By = By.xpath('//mat-label[contains(@title,"Description")]/ancestor::pep-field-title/parent::div/mat-form-field //textarea');
    public CreateSlugPopup_CreateSlug_Button: By = this.getSelectorOfCreateSlugPopupButtonByTitle('Create Slug'); //By.xpath('//span[@title="Create Slug"]/ancestor::button[@data-qa="Create Slug"]');
    public CreateSlugPopup_Cancel_Button: By = this.getSelectorOfCreateSlugPopupButtonByTitle('Cancel');
    // Slugs List
    public SelectedCheckbox: By = By.xpath('//mat-checkbox[contains(@class,"checked")] //span[contains(@class,"mat-checkbox-inner-container")]');
    public Pencil_Button: By = By.xpath('//pep-list-actions/pep-menu //button');
    public Uncheck_Checkbox: By = By.xpath('//mat-checkbox //input[@aria-checked="mixed"]');

    private getSelectorOfTabByText(title: string) {
        return By.xpath(`//div[text()="${title}"]/parent::div[@role="tab"][contains(@id,"mat-tab-label-")]`);
    }

    private getSelectorOfCreateSlugPopupInputByTitle(title: string) {
        return By.xpath(`//mat-label[@title="${title}"]/ancestor::pep-field-title/parent::pep-textbox/mat-form-field //input`);
    }

    private getSelectorOfCreateSlugPopupButtonByTitle(title: string) {
        return By.xpath(`//span[@title="${title}"]/ancestor::button[@data-qa="${title}"]`);
    }

    private getSelectorOfRowInListByName(name: string) {
        return By.xpath('');
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
        const selector: By = this.getSelectorOfRowInListByName(name);
        await this.selectFromList(selector, name);
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

    public async createSlug(displayNameOfSlug: string, slugPath: string, descriptionOfSlug: string) {
        this.pause(500);
        await this.clickElement('CreateSlug_Button');
        await this.waitTillVisible(this.CreateSlugPopup_Title, 10000);
        await this.insertTextToInputElement(displayNameOfSlug, this.CreateSlugPopup_DisplayName_Input);
        await this.insertTextToInputElement(slugPath, this.CreateSlugPopup_Slug_Input);
        await this.insertTextToInputElement(descriptionOfSlug, this.CreateSlugPopup_Description_Input);
        this.pause(500);
        await this.clickElement('CreateSlugPopup_CreateSlug_Button');
        this.pause(5000);
    }
}