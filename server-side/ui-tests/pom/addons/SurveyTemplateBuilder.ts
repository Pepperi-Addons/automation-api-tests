import { Key } from 'selenium-webdriver';
import { By } from 'selenium-webdriver/lib/by';
import {
    BaseBlockRelation,
    VisitFlowBlockConfiguration,
    VisitFlowBlockConfigurationData,
    VisitFlowBlockRelation,
} from '../../blueprints/PageBlocksBlueprints';
import { WebAppSettingsSidePanel } from '../Components/WebAppSettingsSidePanel';
import { WebAppHeader } from '../WebAppHeader';
import { AddonPage } from './base/AddonPage';
import { v4 as uuidv4 } from 'uuid';

// {
//     "surveyTemplate": {
//         "Name": " 4",----
//         "Active": true,----
//         "Sections": [------
//             {
//                 "Key": "ddccd6ff-32f4-46a0-95b1-a8a86978329a",
//                 "Title": "Section 1",
//                 "Questions": [
//                     {
//                         "Name": "f20befac-f520-704e-40df-efb3adf87ed8",
//                         "Key": "7b67f09d-c638-328b-5163-5f46756b85cd",
//                         "Title": "why god why",
//                         "Type": "short-text"
//                     }
//                 ]
//             }
//         ],
//         "Key": "e798aebd-238d-4159-98aa-61d2fce4fcfb",
//         "Description": " 4"
//     }
// }

export interface SurveyTemplate {
    Name: string;
    Active: boolean;
    Sections: SurveySection[];
    Key: string;
    Description: string;
}

export interface SurveySection {
    Key: string;
    Title: string;
    Questions: SurveyQuestion[];
}

export interface SurveyQuestion {
    Key: string;
    Title: string;
    Type:
        | 'Short Text'
        | 'Long Text'
        | 'Multiple Select'
        | 'Single Select'
        | 'Checkbox'
        | 'Radio Group'
        | 'Yes/No'
        | 'Number'
        | 'Decimal'
        | 'Currency'
        | 'Percentage'
        | 'Date'
        | 'Date Time';
    isMandatory: boolean;
    OptionalValues?: SelectValues[];
    ShowIf?: ShowIf;
}

export interface SelectValues {
    Value: string;
    WhichBoolVal?: boolean;
}

export interface ShowIf {
    Operator: 'And' | 'Or';
    FilterData: FilterData;
    FilterGroup?: FilterData;
}

export interface FilterData {
    QuestionName: string;
    ValueToLookFor: string[];
    FilterGroup?: FilterData;
}

// export interface ScriptParams {
//     Name: string;
//     Params: ScriptInternalParam;
// }

// interface ScriptInternalParam {
//     Type: 'Integer' | 'Double' | 'String' | 'Boolean' | 'None';
//     DefaultValue?: any;
// }

export class SurveyTemplateBuilder extends AddonPage {
    public SurveyBuilderMainTitle: By = By.xpath(`//*[@title='Survey Builder']`);
    public SurveyBuilderGenericListTitle: By = By.xpath(`//span[text()='Surveys' and @title='Surveys']`);
    public InternalGenericListLine: By = By.className(`table-header-fieldset`);
    public AddASurveyButton: By = By.xpath(`//span[text()=' Add a Survey ']//..//..`);
    public DeafultSurveySection: By = By.xpath(`//mat-label[text()=' Section 1 ']`);
    public LeftSideSurveyTitle: By = By.xpath(`//span[text()='Survey Builder']`);
    public RightSideSurveyTitle: By = By.xpath(`//span[text()='Section']`);
    public SurveyNameInput: By = By.xpath(`//input[@type='text' and @id='float']`);
    public SurveyDescriptionnput: By = By.xpath(`//textarea[@id='description']`);
    public CurrentSectionNameInput: By = By.xpath(
        `//*[text()=' Section Title ']/ancestor::pep-textbox//mat-form-field//input`,
    );
    public AddSectionButton: By = By.css(`[data-qa="Add a Section"]`);
    public AddQuestionButton: By = By.xpath(`//span[text()=' Add a Question ']//..`);
    public QuestionSelectionFromList: By = By.xpath(`//span[text()=' {placeholder} ']//..`);
    public TextQuestionInput: By = By.xpath(
        `//*[@title='Type your question here...']/ancestor::pep-textarea//mat-form-field//textarea`,
    );
    public ErrorDialogText: By = By.xpath(`//div//div[contains(text(),'missing.')]`);
    public CloseErrorDialogButtont: By = By.xpath(`//span[text()=' Close ']//..`);
    public SaveSurveyButton: By = By.css(`[data-qa="Save"]`);
    public PublishSurveyButton: By = By.css(`[data-qa="Publish"]`);
    public GoBackButton: By = By.xpath(`//pep-button[@iconname='arrow_left_alt']`);
    public MakeQuestionMandatoryCheckBox: By = By.xpath(
        `//mat-checkbox[contains(@title,'Make Mandatory')]//span//input`,
    );
    public ShowIfCheckBox: By = By.xpath(`//mat-checkbox[contains(@title,'Show If')]//span//input`);
    public AddLogicButton: By = By.css(`[data-qa="Add Logic"]`);

    //selection component
    public SelectOptionValueTextBox: By = By.xpath(`//textarea[@id="question"]`);
    public AddAnotherOptionButton: By = By.css(`[data-qa="Add item to Selection"]`);
    public ArrowDownButtonOnSelection: By = By.xpath(`//pep-button[@iconname="arrow_down"]`);
    //boolean option component
    public TrueValueName: By = By.xpath(`//mat-label[@title="True"]//..//..//..//input`);
    public FalseValueName: By = By.xpath(`//mat-label[@title="False"]//..//..//..//input`);

    //Add Logic Component
    public AndOperatorSelector: By = By.xpath(`//span[@title="And"]`);
    public OrOperatorSelector: By = By.xpath(`//span[@title="Or"]`);
    public AddFilterButton: By = By.css(`[data-qa="Add Filter"]`);
    public AddFilterGroupButton: By = By.css(`[data-qa="Add Filter Group"]`);
    public SelectQuestionButton: By = By.xpath(`//pep-query-builder-item//pep-select`);
    public SelectQuestionDropDown: By = By.xpath(`//mat-option[contains(@title,'{placeholder}')]`);
    public QuestionToFilterByDropDownValue: By = By.xpath(`//pep-multi-select-filter`);
    public ValueFromDropDownOfSearchingValues: By = By.xpath(`//mat-option//span[contains(text(),'{placeholder}')]`);
    public EmptySpaceToSaveValue: By = By.xpath(`//div[@class='cdk-overlay-container']`);
    public SaveFilterButton: By = By.xpath(`//mat-dialog-container//pep-button//button[@data-qa="Save"]`);
    //-
    //-
    //

    // const xpathQueryForFieldTypeBtn: string = this.FeildTypeButton.valueOf()['value'].replace(
    //     '|textToFill|',
    //     fieldType,
    // );

    public async enterSurveyBuilderSettingsPage(): Promise<boolean> {
        const webAppHeader = new WebAppHeader(this.browser);
        await webAppHeader.openSettings();
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Sales Activities');
        await this.browser.click(webAppSettingsSidePanel.SurveysEditor);
        this.browser.sleep(2000);
        return await this.validateSettingsPageIsOpened();
    }

    public async enterSurveyBuilderActualBuilder(): Promise<boolean> {
        await this.browser.click(this.AddASurveyButton);
        this.browser.sleep(2500);
        return await this.validateBuilderPageIsOpened();
    }

    public async configureTheSurveyTemplate(
        surveyName: string,
        surveyDescription: string,
        sections: SurveySection[],
    ): Promise<void> {
        await this.setSurveyName(surveyName);
        await this.setSurveyDescription(surveyDescription);
        for (let index = 0; index < sections.length; index++) {
            const section = sections[index];
            await this.browser.click(this.CurrentSectionNameInput);
            await this.browser.sendKeysNoClear(this.CurrentSectionNameInput, section.Title + Key.ENTER);
            for (let index = 0; index < section.Questions.length; index++) {
                const question = section.Questions[index];
                await this.addQuestionToSurvey(question);
            }
            if (index !== sections.length - 1) await this.browser.click(this.AddSectionButton);
        }
        this.browser.sleep(3000);
        await this.browser.click(this.SaveSurveyButton);
        this.browser.sleep(3000);
        await this.browser.click(this.PublishSurveyButton);
        this.browser.sleep(3000);
        await this.browser.click(this.GoBackButton);
    }

    private async validateSettingsPageIsOpened(): Promise<boolean> {
        const isMainTitleShown = await this.browser.isElementVisible(this.SurveyBuilderMainTitle, 5000);
        const isGenericResourceTitleShown = await this.browser.isElementVisible(
            this.SurveyBuilderGenericListTitle,
            2000,
        );
        const isInternalGenericListLineShown = await this.browser.isElementVisible(this.InternalGenericListLine, 2000);
        return isMainTitleShown && isGenericResourceTitleShown && isInternalGenericListLineShown;
    }

    private async validateBuilderPageIsOpened(): Promise<boolean> {
        const isLeftSideSettingsTitleShown = await this.browser.isElementVisible(this.LeftSideSurveyTitle, 2000);
        const isRightSideSectionShown = await this.browser.isElementVisible(this.RightSideSurveyTitle, 2000);
        const isDeafultSurveySectionShown = await this.browser.isElementVisible(this.DeafultSurveySection, 5000);
        return isDeafultSurveySectionShown && isLeftSideSettingsTitleShown && isRightSideSectionShown;
    }

    private async setSurveyName(surveyName: string) {
        await this.browser.sendKeys(this.SurveyNameInput, surveyName);
    }

    private async setSurveyDescription(surveyDesc: string) {
        await this.browser.sendKeys(this.SurveyDescriptionnput, surveyDesc);
    }

    private async setQuestionTitle(questionTitle: string) {
        await this.browser.sendKeys(this.TextQuestionInput, questionTitle + Key.ENTER);
        if (await this.browser.isElementVisible(this.ErrorDialogText, 3000)) {
            await this.browser.click(this.CloseErrorDialogButtont);
        }
    }

    private async addQuestionToSurvey(question: SurveyQuestion) {
        await this.browser.click(this.AddQuestionButton);
        const xpathQueryForQuestionType: string = this.QuestionSelectionFromList.valueOf()['value'].replace(
            '{placeholder}',
            question.Type,
        );
        await this.browser.click(By.xpath(xpathQueryForQuestionType));
        switch (question.Type) {
            case 'Short Text':
            case 'Long Text':
            case 'Currency':
            case 'Number':
            case 'Decimal':
            case 'Date':
            case 'Percentage':
            case 'Date Time':
                await this.setQuestionTitle(question.Title + Key.ENTER);
                break;
            case 'Multiple Select':
            case 'Single Select':
            case 'Checkbox':
            case 'Radio Group':
                await this.browser.click(this.TextQuestionInput);
                await this.setQuestionTitle(question.Title + Key.ENTER);
                if (question.OptionalValues)
                    for (let index = 0; index < question.OptionalValues.length; index++) {
                        const optionSelect = question.OptionalValues[index];
                        await this.browser.click(this.ArrowDownButtonOnSelection);
                        this.browser.sleep(3000);
                        await this.browser.click(this.SelectOptionValueTextBox, index);
                        const selectAll = Key.chord(Key.CONTROL, 'a');
                        await this.browser.sendKeys(this.SelectOptionValueTextBox, selectAll, index);
                        await this.browser.sendKeys(
                            this.SelectOptionValueTextBox,
                            optionSelect.Value + Key.ENTER,
                            index,
                        );
                        if (index !== question.OptionalValues.length - 1)
                            await this.browser.click(this.AddAnotherOptionButton);
                    }
                break;
            case 'Yes/No':
                await this.browser.click(this.TextQuestionInput);
                await this.setQuestionTitle(question.Title + Key.ENTER);
                if (question.OptionalValues)
                    for (let index = 0; index < question.OptionalValues.length; index++) {
                        const optionBoolean = question.OptionalValues[index];
                        if (optionBoolean.WhichBoolVal !== undefined)
                            if (optionBoolean.WhichBoolVal) {
                                await this.browser.click(this.TrueValueName);
                                const selectAll = Key.chord(Key.CONTROL, 'a');
                                await this.browser.sendKeys(this.TrueValueName, selectAll);
                                await this.browser.sendKeys(this.TrueValueName, optionBoolean.Value);
                            } else {
                                await this.browser.click(this.FalseValueName);
                                const selectAll = Key.chord(Key.CONTROL, 'a');
                                await this.browser.sendKeys(this.FalseValueName, selectAll);
                                await this.browser.sendKeys(this.FalseValueName, optionBoolean.Value);
                            }
                    }
                break;
            default:
                throw `Error: No Such Question Type As ${question.Type}`;
        }
        if (question.isMandatory) {
            await this.browser.click(this.MakeQuestionMandatoryCheckBox);
        }

        if (question.ShowIf) {
            //1. check "show if" checkbox
            await this.browser.click(this.ShowIfCheckBox);
            //2. click "AddLogic" button
            await this.browser.click(this.AddLogicButton);
            //3. select which operator
            if (question.ShowIf.Operator === 'And') {
                await this.browser.click(this.AndOperatorSelector);
            } else if (question.ShowIf.Operator === 'Or') {
                await this.browser.click(this.OrOperatorSelector);
            }
            //4. add filter
            if (question.ShowIf.FilterGroup !== undefined) {
                //TODO
                await this.browser.click(this.AddFilterGroupButton);
            } else if (question.ShowIf.FilterGroup == undefined) {
                await this.browser.click(this.AddFilterButton);
            }
            //5. select question name
            await this.browser.click(this.SelectQuestionButton);
            const xpathQueryForQuestionFromDropDown: string = this.SelectQuestionDropDown.valueOf()['value'].replace(
                '{placeholder}',
                question.ShowIf.FilterData.QuestionName,
            );
            await this.browser.click(By.xpath(xpathQueryForQuestionFromDropDown));
            //6. select value to look for from Drop Down
            for (let index = 0; index < question.ShowIf.FilterData.ValueToLookFor.length; index++) {
                const value = question.ShowIf.FilterData.ValueToLookFor[index];
                await this.browser.click(this.QuestionToFilterByDropDownValue);
                const xpathQueryForValueFromDropDown: string = this.ValueFromDropDownOfSearchingValues.valueOf()[
                    'value'
                ].replace('{placeholder}', value);
                await this.browser.click(By.xpath(xpathQueryForValueFromDropDown));
            }
            this.browser.sleep(1500);
            await this.browser.click(this.EmptySpaceToSaveValue);
            this.browser.sleep(1500);
            await this.browser.click(this.SaveFilterButton);
            await this.browser.click(this.SaveFilterButton);
        }
    }
}

export class SurveyBlock {
    constructor() {
        this.Key = uuidv4();
    }
    public Configuration: SurveyBlockConfiguration = new SurveyBlockConfiguration();
    public Key: string;
    public Relation: SurveyBlockRelation = new SurveyBlockRelation();
}

export class SurveyBlockConfiguration {
    constructor() {
        this.Resource = 'Survey';
        this.Data = {};
        this.AddonUUID = 'cf17b569-1af4-45a9-aac5-99f23cae45d8';
    }
    public Resource: string;
    public Data: {};
    public AddonUUID: string;
}

export class SurveyBlockRelation extends BaseBlockRelation {
    constructor() {
        super();
        this.ElementName = 'block-element-cf17b569-1af4-45a9-aac5-99f23cae45d8';
        this.EditorElementName = 'block-editor-element-cf17b569-1af4-45a9-aac5-99f23cae45d8';
        this.EditorComponentName = 'BlockEditorComponent';
        this.EditorModuleName = 'BlockEditorModule';
        this.Key = 'Survey_cf17b569-1af4-45a9-aac5-99f23cae45d8_PageBlock';
        this.AddonRelativeURL = 'survey_builder';
        this.AddonUUID = 'cf17b569-1af4-45a9-aac5-99f23cae45d8';
        this.ModuleName = 'BlockModule';
        this.ComponentName = 'BlockComponent';
        this.Name = 'Survey';
        this.RelationName = 'PageBlock';
        this.SubType = 'NG14';
        this.Type = 'NgComponent';
    }
    public ElementName: string;
    public EditorElementName: string;
    public EditorComponentName: string;
    public EditorModuleName: string;
    public Key: string;
}

export class SurveyBlockColumn {
    constructor(key: string) {
        this.BlockContainer.BlockKey = key;
    }
    public BlockContainer = {
        BlockKey: '',
    };
}
