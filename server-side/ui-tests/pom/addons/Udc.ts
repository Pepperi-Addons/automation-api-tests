import { By } from 'selenium-webdriver';
import { WebAppList } from '..';
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
    public UDCKeyInputField: By = By.css('#mat-input-0');
    public UDCDescriptionInputField: By = By.css('#mat-input-1');
    public UDCOfflinecheckboxButton: By = By.css('#mat-checkbox-2');

    //UDC Fields Locators
    public UDCFieldKeyInputFieldArr: By = By.css('.pep-dialog [id^="mat-input"]');
    public UDCFieldTypeSelect = () => By.css(`.pep-dialog [id^="mat-select"]`);
    public UDCFieldTypeSelectOption = (type: CollectionField['Type']) => By.css(`[id^='mat-select'] [title="${type}"]`);
    public UDCFieldMandatorySelect: By = By.css('#mat-select-6');

    public async sendKeysToField(id: 'Key' | 'Description' | 'Optional Values', data: string) {
        switch (id) {
            case 'Key':
                await this.browser.sendKeys(this.UDCFieldKeyInputFieldArr, data, 0);
                break;
            case 'Description':
                await this.browser.sendKeys(this.UDCFieldKeyInputFieldArr, data, 1);
                break;
            case 'Optional Values':
                await this.browser.sendKeys(this.UDCFieldKeyInputFieldArr, data, 2);
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
        await this.sendKeys(this.UDCKeyInputField, CollectionMain.Key);
        await this.sendKeys(this.UDCDescriptionInputField, CollectionMain.Description);
        return;
    }

    /**
     *
     * configuration of UDC Field
     */
    public async createField(collectionField: CollectionField): Promise<void> {
        const webAppList = new WebAppList(this.browser);
        await this.browser.click(webAppList.AddonAddButton);
        await this.sendKeysToField('Key', collectionField.Key);
        await this.sendKeysToField('Description', collectionField.Description);
        await this.clickOnSelect();
        await this.browser.sleepTimeout(500);
        await this.click(this.UDCFieldTypeSelectOption(collectionField.Type));
        if (collectionField.Type == 'Array' && collectionField.ArrayInnerType) {
            await this.clickOnArrayTypeSelect();
            await this.browser.sleepTimeout(500);
            await this.click(this.UDCFieldTypeSelectOption(collectionField.ArrayInnerType));
            debugger;
        }
        if (collectionField.OptionalValues) {
            await this.sendKeysToField('Optional Values', collectionField.OptionalValues);
        }
        if (collectionField.Mandatory) {
            //Select
            // await this.sendKeys(this.UDCFieldMandatorySelect, collectionField.Mandatory);
        }
        await this.browser.click(this.DialogSaveBtn);
        return;
    }
}
