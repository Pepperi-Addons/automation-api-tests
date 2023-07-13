import { WebAppHeader } from '../WebAppHeader';
import { AddonPage } from './base/AddonPage';
import { WebAppSettingsSidePanel } from '../Components/WebAppSettingsSidePanel';
import { By } from 'selenium-webdriver/lib/by';

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
    runScriptData: { ScriptData: Record<string, unknown>; ScriptKey: string };
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
    public tempCongifTab: By = By.xpath(`(//span[@id='Configuration'][1])[2]`);
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
    public TypeTitle: By = By.xpath(`//mat-label[@title="Type"]`);
    public TypeDropDownInitalButton: By = By.xpath(`//mat-select[@id="Type"]`);
    public TypeDropDownValues: By = By.xpath(`//span[text()='|PLACEHOLDER|']`);
    public DefValueTitle: By = By.xpath(`//mat-label[@title="Default Value"]`);
    public DefValueInput: By = By.xpath(`//input[@1id="DefaultValue"]`);
    public TextualParagraph: By = By.xpath(
        `//div[@class="body-sm rich-text-cont hide-enlarge-button ng-star-inserted"]`,
    );
    public AccTitle: By = By.xpath(`//mat-label[@title="Accessibility"]"`);
    public AccDropDownInitalButton: By = By.xpath(`//mat-select[@id="Accessibility"]`);
    public AccDropDownValues: By = By.xpath(`//span[text()='|PLACEHOLDER|']`);
    public SaveParamModalButton: By = By.xpath(`[data-qa="Save"]`);
    public ListParamLinks: By = By.xpath(`//a[@id='Name' and text()='test']`);

    public async enterFlowBuilderSettingsPage(): Promise<boolean> {
        const webAppHeader = new WebAppHeader(this.browser);
        await webAppHeader.openSettings();
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        //->
        await this.browser.click(this.tempCongifTab);
        await this.browser.click(webAppSettingsSidePanel.FlowEditor);
        this.browser.sleep(2000);
        return await this.validateSettingsPageIsOpened();
    }

    public async enterNewFlowPage(flowBuilder: Flow): Promise<boolean> {
        await this.fillNameAndDescriptionModal(flowBuilder.Name, flowBuilder.Description);
        await this.browser.click(this.ModalAddButton);
        return await this.browser.untilIsVisible(this.FlowTabList, 6000);
    }

    public async enterGeneralTabAndSeeValues(flowBuilder: Flow): Promise<boolean> {
        //1. goto General tab
        await this.browser.click(this.GenralTab);
        await this.browser.untilIsVisible(this.GeneralTabNameInput);
        //2. see values
        const nameInputText = await (await this.browser.findElement(this.GeneralTabNameInput)).getAttribute('title');
        const descInputText = await (await this.browser.findElement(this.GeneralTabDescInput)).getAttribute('title');
        debugger;
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

    async addParam(flowBuilder: Flow) {
        //1. goto param tab and validate title
        await this.enterParamTab();
        //2. click on add parameter
        await this.click(this.AddParameterButton);
        //3. validate add param modal
        const isModalShownCorrectly = this.validateAddParamModal();
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

    async getParamInsideList(param) {
        const paramNameInList: string = this.TypeDropDownValues.valueOf()['value'].replace('|PLACEHOLDER|', param.Name);
        await this.browser.click(By.xpath(paramNameInList));
        //1. Key
        const keyValue = await (await this.browser.findElement(this.KeyInputParamModal)).getText();
        //2. Desc
        const descValue = await (await this.browser.findElement(this.DescriptionInputParamModal)).getText();
        //3. click Type
        const typeValue = await (await this.browser.findElement(this.TypeDropDownInitalButton)).getText();
        //4. def value if we got
        const defValue = await (await this.browser.findElement(this.DefValueInput)).getText();
        //5. click acc
        const accValue = await (await this.browser.findElement(this.AccDropDownInitalButton)).getText();
        await this.browser.click(this.ModalCancelButton);
        return [keyValue, descValue, typeValue, defValue, accValue];
    }

    async validateAddParamModal() {
        const isMKeyTitleShown = await this.browser.isElementVisible(this.KeyTitle, 5000);
        const isDescriptionTitleShown = await this.browser.isElementVisible(this.DescriptionTitle, 5000);
        const isTypeTitleShown = await this.browser.isElementVisible(this.TypeTitle, 5000);
        const isDefValueTitleShown = await this.browser.isElementVisible(this.HamburgerButton, 5000);
        const isTextualParagraphShown = await this.browser.isElementVisible(this.AddFlowButton, 5000);
        const isAccTitleShown = await this.browser.isElementVisible(this.AddFlowButton, 5000);
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
        await this.browser.click(this.TypeDropDownInitalButton);
        //5.1. select dd value
        const accVal = flowParam.Internal ? 'Internal' : 'External';
        const whichDDValueToClickAcc: string = this.TypeDropDownValues.valueOf()['value'].replace(
            '|PLACEHOLDER|',
            accVal,
        );
        await this.browser.click(By.xpath(whichDDValueToClickAcc));
        await this.browser.click(this.SaveParamModalButton);
    }
}
