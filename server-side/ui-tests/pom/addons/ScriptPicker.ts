import { expect } from 'chai';
import { By, Key } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';

export interface ScriptConfigObj {
    Key: string;
    Hidden: boolean;
    CreationDateTime?: string;
    ModificationDateTime?: string;
    Name: string;
    Description: string;
    Code: string;
    Parameters: any[] | any;
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
    public NameHeader: By = By.id('Name');
    public PencilMenuBtn: By = By.css('.menu-container');
    public PickerInternalBtn: By = By.xpath('//span[contains(text(),"Picker")]');
    public ScriptPickerTitle: By = By.xpath('//span[contains(text(),"Script Picker")]');
    public InternalScriptDropDownSelector: By = By.css('.mat-form-field-wrapper');
    public ScriptDropDownOpts: By = By.css('.mat-option-text');
    public SpesificDropDownValue: By = By.xpath(
        '//span[@class="mat-option-text" and contains(text(),"|placeholder|")]',
    );
    public SaveBtn: By = By.css('[data-qa="Save"]');
    public ModalMainParamArea: By = By.css('addon-script-picker> div .pep-main-area');
    public DebuggerPencilOption: By = By.xpath('//span[@title="Debugger"]');
    public CodeEditor: By = By.css('.code-editor');
    public ParamAreaDebugger: By = By.css('pep-form > fieldset > mat-grid-list');
    public DebuggerParamNames: By = By.css('pep-select> pep-field-title > div > mat-label');
    public BackToListBtn: By = By.css('[data-qa="Scripts List"]');
    public RunScriptBtn: By = By.css('[data-qa="Run"]');
    public ScriptResultTxtArea: By = By.xpath('(//div[contains(@class,"mat-form-field-infix")]//div)[1]');
    public DialogOkBtn: By = By.css('pep-dialog > div > div> button');
    public LogsTxtArea: By = By.id('mat-input-0');
    public ValueTypeDropDownDebugger: By = By.xpath('//div[contains(@class,"mat-form-field-infix")]//div');
    public StaticTypeParamDropDown: By = By.xpath("//span[@class='mat-option-text' and text()='Static']");
    public StaticParamValueField: By = By.css('pep-textbox > mat-form-field');
    public StaticParamInput: By = By.xpath("//input[@name='|placeholder|']");




    public async enterPickerModal(): Promise<void> {
        await this.browser.click(this.PencilMenuBtn);
        await expect(this.untilIsVisible(this.PickerInternalBtn, 90000)).eventually.to.be.true; //picker menu drop down is loaded
        await this.browser.click(this.PickerInternalBtn);
        await expect(this.untilIsVisible(this.ScriptPickerTitle, 90000)).eventually.to.be.true; //script picker modal is loadeds
    }

    public async returnAllScriptPickerScriptNames(): Promise<any> {
        await this.browser.click(this.InternalScriptDropDownSelector);
        this.browser.sleep(8000);
        const allDropDownScripts = await this.browser.findElements(this.ScriptDropDownOpts);
        const dropFownTexts = await Promise.all(allDropDownScripts.map(async (elem) => await elem.getText()));
        return dropFownTexts;
    }

    public async clickDropDownByText(text: string) {
        const spesificDropDownElem = this.SpesificDropDownValue.valueOf()
        ['value'].slice()
            .replace('|placeholder|', text);
        await this.browser.click(By.xpath(spesificDropDownElem));
        await expect(this.untilIsVisible(this.ModalMainParamArea, 90000)).eventually.to.be.true; //params part of modal is loaded
        await this.browser.click(this.SaveBtn);
    }

    public async getDebuggerParamNames() {
        const allParamElems = await this.browser.findElements(this.DebuggerParamNames);
        const allParamText = await Promise.all(allParamElems.map(async (elem) => await elem.getText()));
        return allParamText;
    }

    public async goBackToScriptList() {
        await this.browser.click(this.BackToListBtn);
        return await this.untilIsVisible(this.NameHeader, 90000); //script editor page is loaded
    }

    public async runScriptAndGetResult(shouldReturnResult = true) {
        await this.browser.click(this.RunScriptBtn);
        await this.isSpinnerDone();
        this.browser.sleep(5000);
        if (shouldReturnResult) {
            const resultTxt = await (await this.browser.findElement(this.ScriptResultTxtArea)).getText();
            return resultTxt;
        }
    }

    public async getResult() {
        await this.isSpinnerDone();
        this.browser.sleep(5000);
        const resultTxt = await (await this.browser.findElement(this.ScriptResultTxtArea)).getText();
        return resultTxt;
    }

    public async getParamValues(nameOfParam: string[]) {
        const allParamValues: string[] = [];
        for (let index = 0; index < nameOfParam.length; index++) {
            const selector = By.xpath(`//input[@name='${nameOfParam[index]}']`);
            const paramValField = await this.browser.findElement(selector);
            const paramTxtValue = await paramValField.getAttribute('title');
            allParamValues.push(paramTxtValue);
        }
        return allParamValues;
    }

    public async getLogTxtData() {
        await this.isSpinnerDone();
        this.browser.sleep(5000);
        const resultTxt = await (await this.browser.findElement(this.LogsTxtArea)).getAttribute('Title');
        return resultTxt;
    }

    public async setParamTypeToStatic(index: number, staticFieldSelector: By) {
        await this.browser.click(this.ValueTypeDropDownDebugger, index);
        await expect(this.untilIsVisible(this.StaticTypeParamDropDown, 90000)).eventually.to.be.true; //drop down is shown
        await this.browser.click(this.StaticTypeParamDropDown);
        await expect(this.untilIsVisible(staticFieldSelector, 90000)).eventually.to.be.true; //value input is shown
        const staticFieldElems = await this.browser.findElement(staticFieldSelector);
        const allFieldsText = await staticFieldElems.getText();
        expect(allFieldsText).to.equal('');//this way i know the empty static field is thereכ
    }

    public async setParamStaticValue(listOfParam: any[], newValue: string[]) {
        let runningDropDownIndex = 2;
        for (let index = 0; index < listOfParam.length; index++) {
            const spesificParamInput = this.StaticParamInput.valueOf()
            ['value'].slice()
                .replace("|placeholder|", listOfParam[index].Name);
            await this.setParamTypeToStatic(runningDropDownIndex, By.xpath(spesificParamInput));
            await this.browser.sendKeys(By.xpath(spesificParamInput), newValue[index] + Key.ENTER);
            runningDropDownIndex += 4;
        }

    }
}
