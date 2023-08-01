import { WebAppHeader } from '../WebAppHeader';
import { AddonPage } from './base/AddonPage';
import { WebAppSettingsSidePanel } from '../Components/WebAppSettingsSidePanel';
import { By } from 'selenium-webdriver/lib/by';
import { Key } from 'selenium-webdriver';

export interface FlowParam {
    Name: string;
    Type: 'String' | 'Bool' | 'DateTime' | 'Integer' | 'Double' | 'Object';
    Description?: string;
    DefaultValue?: string | boolean | Date | number | Record<string, unknown>;
    Internal?: boolean;
}

export interface FlowStep {
    Name: string;
    Disabled: boolean; //
    Type: 'LogicBlock'; //
    Relation?: RelationForFlow; //
    Configuration: stepConfig;
}

export interface FlowStepGroup {
    Name: string;
    Disabled: boolean;
    Type: 'Group';
    Configuration: stepConfig;
    Steps: FlowStep[];
}

export interface RelationForFlow {
    ExecutionURL: '/addon-cpi/run_logic_block_script';
    AddonUUID: '9f3b727c-e88c-4311-8ec4-3857bc8621f3';
    Name: 'UserScriptsBlock';
}

export interface stepConfig {
    runScriptData: {
        ScriptData: any;
        ScriptKey: string;
    };
}

export interface Flow {
    Key?: string; //
    Name: string; //
    Description?: string; //
    Params: FlowParam[]; //
    Steps: FlowStep[] | FlowStepGroup;
    Hidden: boolean;
}

export class FlowService extends AddonPage {
    //temp
    // public tempCongifTab: By = By.xpath(`(//span[@id='Configuration'][1])[2]`);
    //flow settings page
    public FlowBuilderMainTitle: By = By.xpath(`//*[@title='Flows List']`);
    public ResultsHeader: By = By.xpath(`//span[@class='bold number']`);
    public searchField: By = By.xpath(`//pep-search`);
    public HamburgerButton: By = By.xpath(`//pep-menu`);
    public AddFlowButton: By = By.xpath(`//span[contains(text(),'Add flow')]`);
    //add flow modal
    public AddFlowModalTitle: By = By.xpath(`//pep-dialog//div//span[contains(text(),'Add flow')]`);
    public ModalNameSubTitle: By = By.xpath(`//mat-label[contains(text(),'Name')]`);
    public modalNameInput: By = By.xpath(`//input[@name="Name"]`);
    public ModalDescriptionSubTitle: By = By.xpath(`//mat-label[contains(text(),'Description')]`);
    public modalDescriptionInput: By = By.xpath(`//textarea[@id="Description"]`);
    public ModalCancelButton: By = By.css(`[data-qa="Cancel"]`);
    public ModalAddButton: By = By.css(`[data-qa="Add"]`);
    //flow internal UI
    public FlowTabList: By = By.xpath(`//div[@role='tablist']`);
    public GenralTab: By = By.xpath(`//div[@role='tab'][1]`);
    //General Tab
    public GeneralTabNameInput: By = By.xpath(`//input[@name='Name']`);
    public GeneralTabDescInput: By = By.xpath(`//textarea[@id='Description']`);
    //Steps Tab
    public StepslTab: By = By.xpath(`//div[@role='tab'][3]`);
    public ParamTab: By = By.xpath(`//div[@role='tab'][2]`);
    //ParamTab
    public FlowParamPageTitle: By = By.xpath(`//span[text()="Flow parameters"]`);
    public AddParameterButton: By = By.css(`[data-qa="Add parameter"]`);
    //param modal
    public KeyTitle: By = By.xpath(`//mat-label[@title="Key"]`);
    public KeyInputParamModal: By = By.xpath(`//input[@id="Name"]`);
    public DescriptionTitle: By = By.xpath(`//mat-label[@title="Description"]`);
    public DescriptionInputParamModal: By = By.xpath(`//textarea[@id="Description"]`);
    public EmptySpaceToClickOnModal: By = By.xpath('//div[@id="mat-dialog-title-1"]');
    public TypeTitle: By = By.xpath(`//mat-label[@title="Type"]`);
    public TypeDropDownInitalButton: By = By.xpath(`//mat-select[@id="Type"]`);
    public TypeDropDownValues: By = By.xpath(`//mat-option[@title='|PLACEHOLDER|']`);
    public DefValueTitle: By = By.xpath(`//mat-label[@title="Default Value"]`);
    public DefValueInput: By = By.xpath(`//input[@id="DefaultValue"]`);
    public TextualParagraph: By = By.xpath(
        `//div[@class="body-sm rich-text-cont hide-enlarge-button ng-star-inserted"]`,
    );
    public AccTitle: By = By.xpath(`//mat-label[@title="Accessibility"]`);
    public AccDropDownInitalButton: By = By.xpath(`//mat-select[@id="Accessibility"]`);
    public AccDropDownValues: By = By.xpath(`//mat-option[@title='|PLACEHOLDER|']`);
    public SaveParamModalButton: By = By.css(`[data-qa="Save"]`);
    public ListParamLinks: By = By.xpath(`//a[@id='Name' and text()='|PLACEHOLDER|']`);
    public UpdateFlowButton: By = By.css('[data-qa="Update"]');
    public SearchInput: By = By.xpath('//pep-search//mat-form-field//input');
    public EditStepButton: By = By.xpath('//pep-button[@iconname="system_edit"]');
    public ScriptChoosingModalTitle: By = By.xpath('//mat-label[@title="Scripts"]');
    public InitialDDButtonOfScripts: By = By.xpath(`//mat-select[@id='mat-select-8']`);
    public ScriptsActualValueDD: By = By.xpath('//mat-option[@title="|PLACEHOLDER|"]');
    public SaveScriptModalButton: By = By.xpath(
        '(//button[@class="mat-focus-indicator mat-button mat-button-base pep-button md strong system" and @data-qa])[2]',
    );
    public StepBlockElement: By = By.xpath('(//flow-steps//block-editor)[|PLACEHOLDER|]');
    public scriptPickerTitle: By = By.xpath('//addon-script-picker//pep-field-title');
    public InitalDDButtonScriptPicker: By = By.xpath('//addon-script-picker//mat-form-field');
    public InitalDDButtonScriptPickerParams: By = By.xpath(
        '//addon-script-picker//pep-field-generator//pep-select//mat-form-field',
    );
    public ScriptNameValueInsideDD: By = By.xpath('//addon-script-picker//pep-select//mat-select');
    public ModalParamName: By = By.xpath(
        '(//addon-script-picker//pep-generic-form//pep-field-generator//pep-field-title//mat-label)[1]',
    );
    public ModalParamSource: By = By.xpath('(//addon-script-picker//pep-generic-form//mat-select//div//span//span)[1]');
    public ModalParamSourceName: By = By.xpath(
        '(//addon-script-picker//pep-generic-form//mat-select//div//span//span)[2]',
    );
    public FlowRadioButton: By = By.xpath('(//mat-radio-button)[|PLACEHOLDER|]');
    public FlowPencilButton: By = By.xpath('//pep-list-actions//pep-menu//button');
    public PencilTestButton: By = By.xpath("//button[@title='Test']");
    public PencilLogsButton: By = By.xpath("//button[@title='Logs']");
    public RunScreenTtile: By = By.xpath('//flow-page-title//span');
    public LogsScreenTtile: By = By.xpath("//span[contains(@title,'Logs')]");
    public NumberOfResultsLogs: By = By.xpath('//pep-list-total//span');
    public UserEmailLogsEntry: By = By.xpath("(//span[@id='UserEmail'])[|PLACEHOLDER|]");
    public DatelLogsEntry: By = By.xpath("(//span[@id='DateTimeStamp'])[|PLACEHOLDER|]");
    public LevelLogsEntry: By = By.xpath("(//span[@id='Level'])[|PLACEHOLDER|]");
    public RunScreenParamValueType: By = By.xpath('//mat-select');
    public RunScreenParamValue: By = By.xpath('//mat-form-field//input');
    public RunScreenParamName: By = By.xpath('//pep-select//pep-field-title//mat-label');
    public RunFlowButton: By = By.css('[data-qa="Run Flow"]');
    public RunResultValues: By = By.xpath('((//ngx-json-viewer)[4]//span)[|PLACEHOLDER|]');
    public FlowKeyTitle: By = By.xpath('((//ngx-json-viewer)[1]//span)[1]');
    public FlowKeyData: By = By.xpath('((//ngx-json-viewer)[1]//span)[3]');
    public RunParamInput: By = By.xpath(`//input[@name='test']`);
    public BackToListButton: By = By.css(`[data-qa="Back to list"]`);
    public refreshLogsButton: By = By.xpath('//button[@data-qa="Refresh"]');
    //->

    public async enterFlowBuilderSettingsPage(): Promise<boolean> {
        const webAppHeader = new WebAppHeader(this.browser);
        await webAppHeader.openSettings();
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Configuration');
        await this.browser.click(webAppSettingsSidePanel.FlowEditor);
        this.browser.sleep(2000);
        return await this.validateSettingsPageIsOpened();
    }

    public async backToList() {
        await this.browser.click(this.BackToListButton);
        this.browser.sleep(5000);
    }

    public async enterNewFlowPage(flowBuilder: Flow): Promise<any> {
        await this.fillNameAndDescriptionModal(flowBuilder.Name, flowBuilder.Description);
        await this.browser.click(this.ModalAddButton);
        this.browser.sleep(5000);
        const currentUrl = (await this.browser.getCurrentUrl()).split('/');
        const flowKey = currentUrl[currentUrl.length - 1];
        return [await this.browser.untilIsVisible(this.FlowTabList, 6000), flowKey];
    }

    public async enterGeneralTabAndSeeValues(flowBuilder: Flow): Promise<boolean> {
        //1. goto General tab
        await this.browser.click(this.GenralTab);
        await this.browser.untilIsVisible(this.GeneralTabNameInput);
        //2. see values
        const nameInputText = await (await this.browser.findElement(this.GeneralTabNameInput)).getAttribute('title');
        const descInputText = await (await this.browser.findElement(this.GeneralTabDescInput)).getAttribute('title');
        //3. return to Steps
        await this.browser.click(this.StepslTab);
        return nameInputText === flowBuilder.Name && descInputText === flowBuilder.Description;
    }

    public async openAddFlowPage(): Promise<boolean> {
        await this.browser.click(this.AddFlowButton);
        return await this.validateAddFlowModalIsOpened();
    }

    async validateSettingsPageIsOpened(): Promise<boolean> {
        const isMainTitleShown = await this.browser.isElementVisible(this.FlowBuilderMainTitle, 5000);
        const isResultsHeaderShown = await this.browser.isElementVisible(this.ResultsHeader, 5000);
        const isSearchFieldShown = await this.browser.isElementVisible(this.searchField, 5000);
        const isHamburgerButtonShown = await this.browser.isElementVisible(this.HamburgerButton, 5000);
        const isAddFlowButtonShown = await this.browser.isElementVisible(this.AddFlowButton, 5000);
        return (
            isMainTitleShown &&
            isResultsHeaderShown &&
            isSearchFieldShown &&
            isHamburgerButtonShown &&
            isAddFlowButtonShown
        );
    }

    async validateAddFlowModalIsOpened(): Promise<boolean> {
        const isModalTitleShown = await this.browser.isElementVisible(this.AddFlowModalTitle, 5000);
        const isModalNameSubTitleShown = await this.browser.isElementVisible(this.ModalDescriptionSubTitle, 5000);
        const isModalDescriptionSubTitleShown = await this.browser.isElementVisible(
            this.ModalDescriptionSubTitle,
            5000,
        );
        const isCancelButtonShown = await this.browser.isElementVisible(this.ModalCancelButton, 5000);
        const isAddButtonShown = await this.browser.isElementVisible(this.ModalAddButton, 5000);
        return (
            isModalTitleShown &&
            isModalNameSubTitleShown &&
            isModalDescriptionSubTitleShown &&
            isCancelButtonShown &&
            isAddButtonShown
        );
    }

    async fillNameAndDescriptionModal(name, description) {
        await this.browser.click(this.modalNameInput);
        await this.browser.sendKeys(this.modalNameInput, name);
        this.browser.sleep(1500);
        await this.browser.sendKeys(this.modalDescriptionInput, description);
    }

    async enterParamTab() {
        //1. goto param tab and validate title
        await this.browser.click(this.ParamTab);
        return await this.browser.isElementVisible(this.FlowParamPageTitle, 5000);
    }

    async closeScriptModal() {
        await this.browser.click(this.ModalCancelButton);
    }

    async addParam(flowBuilder: Flow) {
        //1. goto param tab and validate title
        await this.enterParamTab();
        //2. click on add parameter
        await this.click(this.AddParameterButton);
        //3. validate add param modal
        const isModalShownCorrectly = await this.validateAddParamModal();
        //4.  enter values by given flow
        //4.1. check that cannot save w/o data
        const saveButtonDisability = await (
            await this.browser.findElement(this.SaveParamModalButton)
        ).getAttribute('disabled');
        for (let index = 0; index < flowBuilder.Params.length; index++) {
            const param = flowBuilder.Params[index];
            await this.fillParamForm(param);
        }
        let areValuesSimilar = true;
        //6. see in list + see cannot change type -- run in loop on all params and send to validateParamInsideList
        for (let index = 0; index < flowBuilder.Params.length; index++) {
            const param = flowBuilder.Params[index];
            const [keyValue, descValue, typeValue, defValue, accValue] = await this.getParamInsideList(param);
            const accValueOfParam = param.Internal ? 'Internal' : 'External';
            if (
                !(
                    keyValue === param.Name &&
                    descValue === param.Description &&
                    typeValue === param.Type &&
                    defValue === param.DefaultValue &&
                    accValue === accValueOfParam
                )
            ) {
                areValuesSimilar = false;
            }
        }
        return [isModalShownCorrectly, saveButtonDisability, areValuesSimilar];
    }

    async selectRadioButtonOfFlowByIndexFromList(flowIndex) {
        //->FlowRadioButton
        const radioButtonByIndex: string = this.FlowRadioButton.valueOf()['value'].replace('|PLACEHOLDER|', flowIndex);
        await this.browser.click(By.xpath(radioButtonByIndex));
    }

    async getToRunPageOfFlowByIndex(flowIndex, flow: Flow) {
        await this.selectRadioButtonOfFlowByIndexFromList(flowIndex);
        await this.browser.untilIsVisible(this.FlowPencilButton);
        await this.browser.click(this.FlowPencilButton);
        await this.browser.untilIsVisible(this.PencilTestButton);
        await this.browser.click(this.PencilTestButton);
        this.browser.sleep(3000);
        await this.browser.untilIsVisible(this.RunScreenTtile);
        const isNamesSimilar = (await (await this.browser.findElement(this.RunScreenTtile)).getText()).includes(
            flow.Name,
        );
        const isTypeCorrect =
            (await (await this.browser.findElement(this.RunScreenParamValueType)).getAttribute('title')) === 'Default';
        const isValueCorrect =
            (await (await this.browser.findElement(this.RunScreenParamValue)).getAttribute('title')) ===
            flow.Params[0].DefaultValue;
        const isParamNameCorrect =
            (await (await this.browser.findElement(this.RunScreenParamName)).getText()) === flow.Params[0].Name;
        return isNamesSimilar && isTypeCorrect && isValueCorrect && isParamNameCorrect;
    }

    async getToLogsPageOfFlowByIndex(flowIndex, flow: Flow) {
        await this.selectRadioButtonOfFlowByIndexFromList(flowIndex);
        await this.browser.untilIsVisible(this.FlowPencilButton);
        await this.browser.click(this.FlowPencilButton);
        await this.browser.untilIsVisible(this.PencilLogsButton);
        await this.browser.click(this.PencilLogsButton);
        this.browser.sleep(3000);
        await this.browser.untilIsVisible(this.LogsScreenTtile);
        const isNamesSimilar = (await (await this.browser.findElement(this.LogsScreenTtile)).getText()).includes(
            flow.Name,
        );
        this.browser.sleep(1000 * 5);
        return isNamesSimilar;
    }

    async validateLogs() {
        //get number of logs
        const numberOfLogsInList = Number(await (await this.browser.findElement(this.NumberOfResultsLogs)).getText());
        const arrayOfMails: string[] = [];
        const arrayOfDates: string[] = [];
        const arrayOfLevels: string[] = [];
        //see all logs are from the correct user
        for (let index = 0; index < numberOfLogsInList; index++) {
            const userMailByIndex: string = this.UserEmailLogsEntry.valueOf()['value'].replace(
                '|PLACEHOLDER|',
                index + 1,
            );
            const textEmail = await (await this.browser.findElement(By.xpath(userMailByIndex))).getText();
            arrayOfMails.push(textEmail);
        }
        //see all logs have correct date
        for (let index = 0; index < numberOfLogsInList; index++) {
            const userMailByIndex: string = this.DatelLogsEntry.valueOf()['value'].replace('|PLACEHOLDER|', index + 1);
            const dateText = await (await this.browser.findElement(By.xpath(userMailByIndex))).getText();
            arrayOfDates.push(dateText);
        }
        //see all logs have correct level
        for (let index = 0; index < numberOfLogsInList; index++) {
            const logLevelByIndex: string = this.LevelLogsEntry.valueOf()['value'].replace('|PLACEHOLDER|', index + 1);
            const levelText = await (await this.browser.findElement(By.xpath(logLevelByIndex))).getText();
            arrayOfLevels.push(levelText);
        }
        return { number: numberOfLogsInList, mails: arrayOfMails, dates: arrayOfDates, levels: arrayOfLevels };
    }

    async runFlow() {
        //press button
        await this.browser.click(this.RunFlowButton);
        //wait for 7 seconds
        this.browser.sleep(1000 * 7);
        await this.browser.switchToOtherTab(0);
    }

    async refreshLogs() {
        //press button
        await this.browser.click(this.refreshLogsButton);
        //wait for 7 seconds
        this.browser.sleep(1000 * 12);
    }

    async validateRunResult(expectedResult: string) {
        let totValue = '';
        for (let index = 3; index < 3 + expectedResult.length * 3; index = index + 3) {
            const valueToRead: string = this.RunResultValues.valueOf()['value'].replace('|PLACEHOLDER|', index);
            const value = await this.browser.findElement(By.xpath(valueToRead));
            totValue += (await value.getText()).replace(/"/g, '');
        }
        return totValue;
    }

    async validateRunData() {
        const flowKeyTitle = await (await this.browser.findElement(this.FlowKeyTitle)).getText();
        const flowKeyData = (await (await this.browser.findElement(this.FlowKeyData)).getText()).replace(/"/g, '');
        const totValue = `${flowKeyTitle}:${flowKeyData}`;
        return totValue;
    }

    async validateRunParam() {
        const runFlowParam = await (await this.browser.findElement(this.RunParamInput)).getAttribute('title');
        return runFlowParam;
    }

    async saveFlow() {
        await this.browser.click(this.UpdateFlowButton);
        this.browser.sleep(4000);
        return await this.validateSettingsPageIsOpened();
    }

    async addEmptyStepViaAPI(generalService, flowKey, flowName, step) {
        const bodyToSend = { Key: flowKey, Name: flowName, Steps: step };
        const responseForFlow = await generalService.fetchStatus('/user_defined_flows', {
            method: 'POST',
            body: JSON.stringify(bodyToSend),
        });
        return responseForFlow;
    }

    async addStepViaAPI(generalService, flowKey, flowName, step) {
        const bodyToSend = { Key: flowKey, Name: flowName, Steps: step };
        const responseForFlow = await generalService.fetchStatus('/user_defined_flows', {
            method: 'POST',
            body: JSON.stringify(bodyToSend),
        });
        return responseForFlow;
    }

    async hideFlowViaAPI(generalService, flowKey) {
        const bodyToSend = { Key: flowKey, Hidden: true };
        const responseForFlow = await generalService.fetchStatus('/user_defined_flows', {
            method: 'POST',
            body: JSON.stringify(bodyToSend),
        });
        return responseForFlow;
    }

    async getAllFlowsViaAPI(generalService) {
        const responseForFlow = await generalService.fetchStatus('/user_defined_flows?page_size=-1', {
            method: 'GET',
        });
        return responseForFlow;
    }

    async getFlowByKeyViaAPI(generalService, flowKey) {
        const responseForPosFlow = await generalService.fetchStatus(`/user_defined_flows/key/${flowKey}`, {
            method: 'GET',
        });
        return responseForPosFlow;
    }

    async enterFlowBySearchingName(flowName) {
        await this.browser.click(this.SearchInput);
        await this.browser.sendKeys(this.SearchInput, flowName + Key.ENTER);
        const paramNameInList: string = this.ListParamLinks.valueOf()['value'].replace('|PLACEHOLDER|', flowName);
        await this.browser.untilIsVisible(By.xpath(paramNameInList));
        await this.browser.click(By.xpath(paramNameInList));
        await this.browser.untilIsVisible(this.FlowTabList, 6000);
    }

    async validateStepCreatedByApi(stepName: string, index: number) {
        const stepByIndex: string = this.StepBlockElement.valueOf()['value'].replace('|PLACEHOLDER|', index);
        const cretedBlockElem = await this.browser.findElement(By.xpath(stepByIndex));
        const isShown = await cretedBlockElem.isDisplayed();
        const nameTitleOfStepBlock = stepByIndex + '//input';
        const blockName = await (await this.browser.findElement(By.xpath(nameTitleOfStepBlock))).getAttribute('title');
        return isShown && blockName === stepName;
    }

    async editStep(stepIndex: number, step: FlowStep, service) {
        const stepByIndex: string = this.StepBlockElement.valueOf()['value'].replace('|PLACEHOLDER|', stepIndex);
        //name
        const nameTitleOfStepBlock = stepByIndex + '//input';
        await this.browser.click(By.xpath(nameTitleOfStepBlock));
        await this.browser.sendKeys(By.xpath(nameTitleOfStepBlock), step.Name);
        //script
        const editButtonOfStepBlock = stepByIndex + "//pep-button[@title='Edit']";
        await this.browser.click(By.xpath(editButtonOfStepBlock));
        await this.browser.untilIsVisible(this.scriptPickerTitle, 10000);
        await this.browser.click(this.InitalDDButtonScriptPicker);
        const scriptName = await this.convertScriptKeyToName(service, step.Configuration.runScriptData.ScriptKey);
        const DDvalueToPressScripts: string = this.ScriptsActualValueDD.valueOf()['value'].replace(
            '|PLACEHOLDER|',
            scriptName,
        );
        debugger;
        await this.browser.click(By.xpath(DDvalueToPressScripts));
        //scripts params
        await this.browser.click(this.InitalDDButtonScriptPickerParams);
        const DDvalueToPressScriptsParams: string = this.ScriptsActualValueDD.valueOf()['value'].replace(
            '|PLACEHOLDER|',
            step.Configuration.runScriptData.ScriptData.Source,
        );
        await this.browser.click(By.xpath(DDvalueToPressScriptsParams));
        //save
        await this.browser.click(this.SaveParamModalButton);
    }

    async validateStepScript(stepIndex: number, step: FlowStep, service) {
        const stepByIndex: string = this.StepBlockElement.valueOf()['value'].replace('|PLACEHOLDER|', stepIndex);
        //script
        const editButtonOfStepBlock = stepByIndex + "//pep-button[@title='Edit']";
        await this.browser.click(By.xpath(editButtonOfStepBlock));
        this.browser.sleep(3000);
        await this.browser.untilIsVisible(this.scriptPickerTitle, 10000);
        const nameOfParamInput = Object.keys(step.Configuration.runScriptData.ScriptData)[0];
        const realScriptName = await this.convertScriptKeyToName(service, step.Configuration.runScriptData.ScriptKey);
        const scriptFromUI = await (await this.browser.findElement(this.ScriptNameValueInsideDD)).getAttribute('title');
        const isScriptNameSimilar = realScriptName === scriptFromUI;
        const modalParamNameFromUI = await (await this.browser.findElement(this.ModalParamName)).getAttribute('title');
        const isParamNameSimilar = modalParamNameFromUI === nameOfParamInput;
        const paramSourceFromUI = await (await this.browser.findElement(this.ModalParamSource)).getText();
        const isParamSourceSimilar =
            paramSourceFromUI.toLocaleLowerCase() ===
            step.Configuration.runScriptData.ScriptData[nameOfParamInput].Source;
        const paramSourceNameFromUI = await (await this.browser.findElement(this.ModalParamSourceName)).getText();
        const isParamSourceNameSimilar =
            paramSourceNameFromUI === step.Configuration.runScriptData.ScriptData[nameOfParamInput].Value;
        return isScriptNameSimilar && isParamNameSimilar && isParamSourceSimilar && isParamSourceNameSimilar;
    }

    async convertScriptKeyToName(service, scriptKey) {
        const scripts = await service.fetchStatus(`/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/scripts`, {
            method: 'GET',
        });
        const scriptName = scripts.Body.filter((script) => script.Key === scriptKey)[0].Name;
        return scriptName;
    }

    async duplicateAndValidateStep(toDuplicateStepIndex, service, newStepToEdit) {
        const stepByIndex: string = this.StepBlockElement.valueOf()['value'].replace(
            '|PLACEHOLDER|',
            toDuplicateStepIndex,
        );
        const duplicateButtonOfStepBlock = stepByIndex + "//pep-button[@title='Duplicate']";
        await this.browser.click(By.xpath(duplicateButtonOfStepBlock));
        const newStepIndex = toDuplicateStepIndex + 1;
        await this.editStep(newStepIndex, newStepToEdit, service);
    }

    async getParamInsideList(param) {
        //DI-24202
        await this.browser.click(this.GenralTab);
        await this.browser.click(this.ParamTab);
        const paramNameInList: string = this.ListParamLinks.valueOf()['value'].replace('|PLACEHOLDER|', param.Name);
        await this.browser.click(By.xpath(paramNameInList));
        //1. Key
        const keyValue = await (await this.browser.findElement(this.KeyInputParamModal)).getAttribute('title');
        //2. Desc
        const descValue = await (await this.browser.findElement(this.DescriptionInputParamModal)).getAttribute('title');
        //3. click Type
        const typeValue = await (await this.browser.findElement(this.TypeDropDownInitalButton)).getText();
        //4. def value if we got-- bad
        const defValue = await (await this.browser.findElement(this.DefValueInput)).getAttribute('title');
        //5. click acc
        const accValue = await (await this.browser.findElement(this.AccDropDownInitalButton)).getText();
        await this.browser.click(this.ModalCancelButton);
        return [keyValue, descValue, typeValue, defValue, accValue];
    }

    async validateAddParamModal() {
        this.browser.sleep(1500);
        const isMKeyTitleShown = await this.browser.isElementVisible(this.KeyTitle, 5000);
        const isDescriptionTitleShown = await this.browser.isElementVisible(this.DescriptionTitle, 5000);
        const isTypeTitleShown = await this.browser.isElementVisible(this.TypeTitle, 5000);
        const isDefValueTitleShown = await this.browser.isElementVisible(this.DefValueTitle, 5000);
        const isTextualParagraphShown = await this.browser.isElementVisible(this.TextualParagraph, 5000);
        const isAccTitleShown = await this.browser.isElementVisible(this.AccTitle, 5000);
        return (
            isMKeyTitleShown &&
            isDescriptionTitleShown &&
            isTypeTitleShown &&
            isDefValueTitleShown &&
            isTextualParagraphShown &&
            isAccTitleShown
        );
    }

    async fillParamForm(flowParam: FlowParam) {
        //1. Key
        await this.browser.click(this.KeyInputParamModal);
        await this.browser.sendKeys(this.KeyInputParamModal, flowParam.Name);
        //2. Desc
        await this.browser.click(this.DescriptionInputParamModal);
        await this.browser.sendKeys(this.DescriptionInputParamModal, (flowParam as any).Description);
        //3. click Type
        await this.browser.click(this.TypeDropDownInitalButton);
        //3.1. select dd value
        const whichDDValueToClickType: string = this.TypeDropDownValues.valueOf()['value'].replace(
            '|PLACEHOLDER|',
            flowParam.Type,
        );
        await this.browser.click(By.xpath(whichDDValueToClickType));
        //4. def value if we got
        if (flowParam.DefaultValue) {
            await this.browser.click(this.DefValueInput);
            await this.browser.sendKeys(this.DefValueInput, (flowParam as any).DefaultValue);
        }
        //5. click acc
        await this.browser.click(this.AccDropDownInitalButton);
        //5.1. select dd value
        const accVal = flowParam.Internal ? 'Internal' : 'External';
        const whichDDValueToClickAcc: string = this.AccDropDownValues.valueOf()['value'].replace(
            '|PLACEHOLDER|',
            accVal,
        );
        await this.browser.click(By.xpath(whichDDValueToClickAcc));
        await this.browser.click(this.SaveParamModalButton);
    }
}
