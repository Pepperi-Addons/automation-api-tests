import { expect } from 'chai';
import { By, Key, WebElement } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppSettingsSidePanel, WebAppTopBar } from '..';
import { OrderPage } from '../Pages/OrderPage';
import { AddonLoadCondition } from './base/AddonPage';
import { ObjectTypeEditor } from './ObjectTypeEditor';

export interface ScriptConfigObj {
    Key: string;
    Hidden: boolean;
    CreationDateTime?: string;
    ModificationDateTime?: string;
    Name: string;
    Description: string;
    Code: string;
    Parameters: any;
}

export interface ScriptParams {
    Name: string;
    Params: ScriptInternalParam;
}

interface ScriptInternalParam {
    Type: 'Integer' | 'Double' | 'String' | 'Boolean' | 'None';
    DefaultValue?: any;
}

export class ScriptEditor extends AddonPage {
    public NameHeader: By = By.id("Name");
    public MainMenuBtn: By = By.css(".menu-container");
    public PickerInternalBtn: By = By.xpath('//span[contains(text(),"Picker")]');
    public ScriptPickerTitle: By = By.xpath('//span[contains(text(),"Script Picker")]');
    public InternalScriptDropDownSelector: By = By.css('.mat-form-field-wrapper');
    public ScriptDropDownOpts: By = By.css('.mat-option-text');
    public SpesificDropDownValue: By = By.xpath('//span[@class="mat-option-text" and contains(text(),"|placeholder|")]');
    public SaveBtn: By = By.css('[data-qa="Save"]');
    public ModalMainParamArea: By = By.css('addon-script-picker> div .pep-main-area');



    public async enterPickerModal(): Promise<void> {
        await this.browser.click(this.MainMenuBtn);
        await expect(this.untilIsVisible(this.PickerInternalBtn, 90000)).eventually.to
            .be.true; //picker menu drop down is loaded
        await this.browser.click(this.PickerInternalBtn);
        await expect(this.untilIsVisible(this.ScriptPickerTitle, 90000)).eventually.to
            .be.true; //script picker modal is loadeds
    }

    public async returnAllScriptPickerScriptNames(): Promise<any> {
        await this.browser.click(this.InternalScriptDropDownSelector);
        this.browser.sleep(1000);
        const allDropDownScripts = await this.browser.findElements(this.ScriptDropDownOpts);
        const dropFownTexts = await Promise.all(allDropDownScripts.map(async elem => await elem.getText()));
        return dropFownTexts;
    }

    public async clickDropDownByText(text: string) {
        const spesificDropDownElem = this.SpesificDropDownValue
            .valueOf()
        ['value'].slice()
            .replace('|placeholder|', text);
        await this.browser.click(By.xpath(spesificDropDownElem));
        await expect(this.untilIsVisible(this.ModalMainParamArea, 90000)).eventually.to
            .be.true; //params part of modal is loaded
        await this.browser.click(this.SaveBtn);
    }
}


