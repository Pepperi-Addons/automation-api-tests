import { By } from 'selenium-webdriver';
import { WebAppDialog, WebAppList } from '..';
import { AddonPage } from './base/AddonPage';

export interface CollectionField {
    Key: string;
    Description: string;
    Type: 'String' | 'Bool' | 'Integer' | 'Double' | 'Object' | 'Array' | 'DateTime';
    ArrayInnerType?: 'String' | 'Bool' | 'Integer' | 'Double' | 'Object' | 'DateTime';
    OptionalValues?: string;
    Mandatory: boolean;
}

export interface CollectionMain {
    Key: string;
    Description: string;
    Offline?: boolean;
}

export class Udc extends AddonPage {
    //Addon Locators
    public pageListHeaderTitle = By.css('.pep-main-area .generic-list .title [title]');
    public pageHeaderTotal = By.css('.pep-main-area .generic-list .total-items-container');
    public createCollectionHeaderTitle = By.css('[title="Create Collection"]');

    //Locators that should be moved
    public AddonPageSaveBtn: By = By.css("[data-qa='Save']");
    public DialogSaveBtn: By = By.css(".pep-dialog [data-qa='Save']");

    //UDC locators
    public UDCFieldKeyInputFieldArr: By = By.css('[id^="mat-input"]');
    public UDCOfflinecheckboxButton: By = By.css('[id^="mat-checkbox"]');

    //UDC Fields Locators
    public UDCDialogFieldKeyInputFieldArr: By = By.css('.pep-dialog [id^="mat-input"]');
    public UDCFieldTypeSelect = () => By.css(`.pep-dialog [id^="mat-select"]`);
    public UDCFieldTypeSelectOption = (type: CollectionField['Type']) => By.css(`[id^='mat-select'] [title="${type}"]`);
    public UDCFieldMandatorySelect: By = By.css('#mat-select-6');

    public async sendKeysToDialogField(id: 'Key' | 'Description' | 'Optional Values', data: string) {
        switch (id) {
            case 'Key':
                await this.browser.sendKeys(this.UDCDialogFieldKeyInputFieldArr, data, 0);
                break;
            case 'Description':
                await this.browser.sendKeys(this.UDCDialogFieldKeyInputFieldArr, data, 1);
                break;
            case 'Optional Values':
                await this.browser.sendKeys(this.UDCDialogFieldKeyInputFieldArr, data, 2);
            default:
                break;
        }
        return;
    }

    public async sendKeysToField(id: 'Key' | 'Description', data: string) {
        switch (id) {
            case 'Key':
                await this.browser.sendKeys(this.UDCFieldKeyInputFieldArr, data, 0);
                break;
            case 'Description':
                await this.browser.sendKeys(this.UDCFieldKeyInputFieldArr, data, 1);
                break;
            default:
                break;
        }
        return;
    }

    public async clickOnSelect() {
        await this.browser.click(this.UDCFieldTypeSelect(), 0);
        return;
    }

    public async clickOnArrayTypeSelect() {
        await this.browser.click(this.UDCFieldTypeSelect(), 2);
        return;
    }

    /**
     *
     * configuration of UDC Collection
     */
    public async createCollection(CollectionMain: CollectionMain): Promise<void> {
        await this.sendKeysToField('Key', CollectionMain.Key);
        await this.sendKeysToField('Description', CollectionMain.Description);
        return;
    }

    /**
     *
     * configuration of UDC Field
     */
    public async createField(collectionField: CollectionField): Promise<void> {
        const webAppList = new WebAppList(this.browser);
        await this.browser.click(webAppList.AddonAddButton);
        await this.sendKeysToDialogField('Key', collectionField.Key);
        await this.sendKeysToDialogField('Description', collectionField.Description);
        await this.clickOnSelect();
        await this.browser.sleepAsync(500);
        await this.click(this.UDCFieldTypeSelectOption(collectionField.Type));
        if (collectionField.Type == 'Array' && collectionField.ArrayInnerType) {
            await this.clickOnArrayTypeSelect();
            await this.browser.sleepAsync(500);
            await this.click(this.UDCFieldTypeSelectOption(collectionField.ArrayInnerType));
        }
        if (collectionField.OptionalValues) {
            await this.sendKeysToDialogField('Optional Values', collectionField.OptionalValues);
        }
        if (collectionField.Mandatory) {
            //Select
            // await this.sendKeys(this.UDCFieldMandatorySelect, collectionField.Mandatory);
        }
        await this.browser.click(this.DialogSaveBtn);
        return;
    }

    public async closeEditDialogsAndSave() {
        //Let the collection updae after creation of first collection field
        await this.browser.sleepAsync(500);
        await (await this.browser.findElement(this.AddonPageSaveBtn)).click();
        //Let the page update after creation of new collection field
        await this.browser.sleepAsync(500);
        const webAppDialog = new WebAppDialog(this.browser);
        await webAppDialog.untilIsVisible(webAppDialog.Dialog);
        await this.browser.sleepAsync(500);
        await webAppDialog.selectDialogBox('Close');
        //Let the page updae after saving new collection
        await this.browser.sleepAsync(1500);
    }
}
