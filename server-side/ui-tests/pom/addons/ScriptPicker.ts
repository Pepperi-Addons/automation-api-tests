import { expect } from 'chai';
import { By, Key } from 'selenium-webdriver';
import { GeneralService } from '../../../services';
import { WebAppSettingsSidePanel } from '../Components/WebAppSettingsSidePanel';
import { WebAppDialog } from '../WebAppDialog';
import { WebAppHeader } from '../WebAppHeader';
import { WebAppList } from '../WebAppList';
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
    public EditorPencilOption: By = By.xpath('//span[@title="Edit"]');
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
    public PublishBtn: By = By.css('[data-qa="Publish"]');
    public ModalParamTitle: By = By.xpath("//span[text()='Parameters']");
    public SpesificParamCheckbox: By = By.xpath(
        "//span[text()='|placeholder|']//..//..//..//..//..//..//mat-checkbox//label",
    );
    public InsideModalPencil: By = By.xpath('(//pep-list-actions//pep-menu//*//button)[2]');
    public DefaultValueInput: By = By.xpath('(//addon-script-param-form//pep-dialog//div[2]//input)[3]');
    public EditorRow: By = By.xpath(
        "//addon-script-editor-form//virtual-scroller//div//div//fieldset[@class='table-row-fieldset']",
    );
    public ScriptEditorDescriptionTxtArea: By = By.xpath('//mat-dialog-container//div//textarea');

    public addScriptButton: By = By.xpath(`//div//pep-button//button//span[contains(text(),'Add')]`);
    public addScriptMainTitle: By = By.xpath(`//span[contains(text(),"Add script")]`);
    public addScriptModal: By = By.xpath(`//div[@class='mat-dialog-content']`);
    public NameInput: By = By.xpath(`(//div[@class='mat-dialog-content']//input)[1]`);
    public DescInput: By = By.xpath(`(//div[@class='mat-dialog-content']//input)[2]`);
    public CodeTextArea: By = By.xpath(`//textarea`);
    public ModalCloseBtn: By = By.xpath(`//mat-dialog-container//button`);
    public Modal: By = By.xpath(`//div[contains(text(),'New script was added successfully')]`);

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
        expect(allFieldsText).to.equal(''); //this way i know the empty static field is thereכ
    }

    public async setParamStaticValue(listOfParam: any[], newValue: string[]) {
        let runningDropDownIndex = 2;
        for (let index = 0; index < listOfParam.length; index++) {
            const spesificParamInput = this.StaticParamInput.valueOf()
                ['value'].slice()
                .replace('|placeholder|', listOfParam[index].Name);
            await this.setParamTypeToStatic(runningDropDownIndex, By.xpath(spesificParamInput));
            await this.browser.sendKeys(By.xpath(spesificParamInput), newValue[index] + Key.ENTER);
            runningDropDownIndex += 4;
        }
    }

    public async publishScript() {
        await this.browser.click(this.PublishBtn);
        const webAppDialog = new WebAppDialog(this.browser);
        await expect(webAppDialog.untilIsVisible(webAppDialog.Title, 90000)).eventually.to.be.true;
        const titleTxt = await (await this.browser.findElement(webAppDialog.Title)).getText();
        expect(titleTxt).to.include('Publish');
        const contentTxt = await (await this.browser.findElement(webAppDialog.Content)).getText();
        expect(contentTxt).to.include('Script was published successfully');
        await this.browser.click(this.DialogOkBtn, 0); //in this case first index is the 'Close' btn
        await expect(this.untilIsVisible(this.CodeEditor, 90000)).eventually.to.be.true; //code editor element is loaded
        await expect(this.untilIsVisible(this.ParamAreaDebugger, 90000)).eventually.to.be.true; //validate prev screen is loaded again
    }

    public async enterEditor(index: number) {
        const webAppList = new WebAppList(this.browser);
        await webAppList.clickOnCheckBoxByElementIndex(index);
        await this.browser.click(this.PencilMenuBtn);
        await this.browser.click(this.EditorPencilOption);
        const webAppDialog = new WebAppDialog(this.browser);
        await expect(webAppDialog.untilIsVisible(webAppDialog.Title, 90000)).eventually.to.be.true;
        await expect(this.untilIsVisible(this.ModalParamTitle, 90000)).eventually.to.be.true; //params title area is loaded
    }

    public async editParam(numOfScriptInList: number, listOfParam: any[], listOfNewVals: any[]) {
        //TODO: refactor this stupid flow
        for (let index = 0; index < listOfParam.length; index++) {
            const spesificParamCheckboxInput = this.SpesificParamCheckbox.valueOf()
                ['value'].slice()
                .replace('|placeholder|', listOfParam[index].Name);
            await this.browser.click(this.EditorRow, index);
            this.browser.sleep(1000);
            const checkBoxElem = await this.browser.findElement(By.xpath(spesificParamCheckboxInput));
            await this.browser.executeCommandAdync('arguments[0].click();', checkBoxElem);
            await this.browser.click(this.InsideModalPencil);
            await expect(this.untilIsVisible(this.EditorPencilOption, 90000)).eventually.to.be.true;
            await this.browser.click(this.EditorPencilOption);
            const webAppDialog = new WebAppDialog(this.browser);
            await expect(webAppDialog.untilIsVisible(webAppDialog.Title, 90000)).eventually.to.be.true;
            const defaultValElem = await this.browser.findElement(this.DefaultValueInput);
            const defaultValTxt = await defaultValElem.getAttribute('title');
            expect(defaultValTxt).to.equal(listOfParam[index].Params.DefaultValue);
            await this.browser.sendKeys(this.DefaultValueInput, listOfNewVals[index]);
            await this.browser.click(this.SaveBtn, 1); //in this case first index is the 'save' btn
            await expect(webAppDialog.untilIsVisible(webAppDialog.Title, 90000)).eventually.to.be.true; //prev modal is loaded
            await this.browser.sendKeys(this.ScriptEditorDescriptionTxtArea, 'UI bug');
            await this.browser.click(this.SaveBtn, 0); //in this case first index is the 'save' btn
            await this.validateMainPageIsLoaded();
            if (index < listOfParam.length - 1) {
                await this.browser.refresh();
                await this.validateMainPageIsLoaded();
                await this.enterEditor(numOfScriptInList);
            }
        }
    }

    public async openDebugger() {
        await this.browser.click(this.PencilMenuBtn);
        await this.browser.click(this.DebuggerPencilOption);
        await expect(this.untilIsVisible(this.CodeEditor, 90000)).eventually.to.be.true; //code editor element is loaded
        await expect(this.untilIsVisible(this.ParamAreaDebugger, 90000)).eventually.to.be.true; //code editor element is loaded
    }

    public async validateMainPageIsLoaded() {
        await expect(this.untilIsVisible(this.NameHeader, 90000)).eventually.to.be.true;
        await expect(this.untilIsVisible(this.PencilMenuBtn, 90000)).eventually.to.be.true;
    }

    public async configureScript(sciptText: string, generalService: GeneralService) {
        const webAppHeader = new WebAppHeader(this.browser);
        await webAppHeader.openSettings();
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Configuration');
        await this.browser.click(webAppSettingsSidePanel.ScriptsEditor);
        const scriptEditor = new ScriptEditor(this.browser);
        await this.browser.click(scriptEditor.addScriptButton);
        const isModalFound = await this.browser.isElementVisible(scriptEditor.addScriptModal);
        const isMainTitleFound = await this.browser.isElementVisible(scriptEditor.addScriptMainTitle);
        expect(isModalFound).to.equal(true);
        expect(isMainTitleFound).to.equal(true);
        //1. give name
        await this.browser.sendKeys(scriptEditor.NameInput, 'SurveyScript');
        //2. give desc
        await this.browser.sendKeys(scriptEditor.DescInput, 'script for survey');
        //3. push code of script instead of the code found in the UI
        const selectAll = Key.chord(Key.CONTROL, 'a');
        await this.browser.sendKeys(scriptEditor.CodeTextArea, selectAll);
        await this.browser.sendKeys(scriptEditor.CodeTextArea, Key.DELETE);
        await this.browser.sendKeys(scriptEditor.CodeTextArea, sciptText);
        this.browser.sleep(4500);
        //4. save
        await this.browser.click(scriptEditor.SaveBtn);
        this.browser.sleep(5000);
        await this.browser.untilIsVisible(scriptEditor.ModalCloseBtn, 6000);
        await this.browser.click(scriptEditor.ModalCloseBtn);
        this.browser.sleep(1000);
        //5. validate script is found in list
        const webAppList = new WebAppList(this.browser);
        const allListElemsText = await webAppList.getAllListElementsTextValue();
        expect(allListElemsText.length).to.be.at.least(1);
        const foundScript = allListElemsText.find((elem) => elem.includes('SurveyScript'));
        expect(foundScript).to.not.be.undefined;
        expect(foundScript).to.include('SurveyScript');
        const allScripts = await generalService.fetchStatus(
            'https://papi.pepperi.com/V1.0/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/scripts',
            {
                method: 'GET',
            },
        );
        let surveyScript;
        for (let index = 0; index < allScripts.Body.length; index++) {
            const script = allScripts.Body[index];
            if (script.Name === 'SurveyScript') surveyScript = script;
        }
        return surveyScript.Key;
    }
}
