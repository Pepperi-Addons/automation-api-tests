import { expect } from 'chai';
import { By, Key, Locator, WebElement } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppSettingsSidePanel, WebAppTopBar } from '..';
import { OrderPage } from '../OrderPage';
import { AddonLoadCondition } from './base/AddonPage';
import { ObjectTypeEditor } from './ObjectTypeEditor';

export interface CollectionField {
    Key: string;
    Description: string;
    Type: 'String' | 'Bool' | 'Integer' | 'Double' | 'Object' | 'Array' | 'DateTime';
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
    public AddonPageSaveBtn: Locator = By.css("[data-qa='Save']");
    public DialogSaveBtn: Locator = By.css(".pep-dialog [data-qa='Save']");

    //UDC locators
    public UDCKeyInputField: Locator = By.css('#mat-input-0');
    public UDCDescriptionInputField: Locator = By.css('#mat-input-1');
    public UDCOfflinecheckboxButton: Locator = By.css('#mat-checkbox-2');

    /**
     *
     * configuration of UDC Collection
     */
    public async createCollection(CollectionMain: CollectionMain): Promise<void> {
        this.sendKeys(this.UDCKeyInputField, CollectionMain.Key);
        this.sendKeys(this.UDCKeyInputField, CollectionMain.Description);
        debugger;

        return;
    }

    /**
     *
     * configuration of UDC Field
     */
    public async createField(collectionFieldsArr: CollectionField): Promise<void> {
        // edit;

        return;
    }
}
