import { Key } from 'selenium-webdriver';
import { By } from 'selenium-webdriver/lib/by';
import { BaseBlockRelation } from '../../blueprints/PageBlocksBlueprints';
import { WebAppSettingsSidePanel } from '../Components/WebAppSettingsSidePanel';
import { WebAppHeader } from '../WebAppHeader';
import { AddonPage } from './base/AddonPage';
import { v4 as uuidv4 } from 'uuid';
import E2EUtils from '../../utilities/e2e_utils';
import { Client } from '@pepperi-addons/debug-server/dist';
import GeneralService from '../../../services/general.service';
import { expect } from 'chai';

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
    Key?: string;
    WhichBoolVal?: boolean;
}

export interface ShowIf {
    Operator: 'And' | 'Or';
    FilterData: FilterData[];
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
    // public InternalGenericListLine: By = By.className(`table-header-fieldset`);
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
    public MakeQuestionMandatoryCheckBox: By = By.xpath(`//span[text()='Make Mandatory']/../..//input`);
    public ShowIfCheckBox: By = By.xpath(`//span[text()='Show If']/../..//input`);
    public AddLogicButton: By = By.css(`[data-qa="Add Logic"]`);

    //key text box inside selection
    public SelectionKey: By = By.xpath(`//mat-label[contains(text(),'Add Key')]/../../..//input`);
    //selection component
    public SelectOptionValueTextBox: By = By.xpath(`//textarea[@id="question"]`);
    public AddAnotherOptionButton: By = By.css(`[data-qa="Add item to Selection"]`);
    public ArrowDownButtonOnSelection: By = By.xpath(`//pep-button[@iconname="arrow_down"]`);
    public MatSelectArrow: By = By.xpath(`//div[contains(@class,"mat-select-arrow-wrapper")]`);
    //boolean option component
    public TrueValueName: By = By.xpath(`//mat-label[@title="True"]//..//..//..//input`);
    public FalseValueName: By = By.xpath(`//mat-label[@title="False"]//..//..//..//input`);

    //Add Logic Component
    public AndOperatorSelector: By = By.xpath(`//span[@title="And"]`);
    public OrOperatorSelector: By = By.xpath(`//span[@title="Or"]`);
    public AddFilterButton: By = By.css(`[data-qa="Add Filter"]`);
    public AddFilterGroupButton: By = By.css(`[data-qa="Add Filter Group"]`);
    public SelectQuestionButton: By = By.xpath(
        `//pep-query-builder-item//pep-select[@class="pep-field pep-field-no-spacing"]//mat-form-field//mat-select`,
    );
    public SelectQuestionDropDown: By = By.xpath(`//mat-option[contains(@title,'{placeholder}')]`);
    public QuestionToFilterByDropDownValue: By = By.xpath(`//pep-multi-select-filter`);
    public ValueFromDropDownOfSearchingValues: By = By.xpath(`//mat-option//span[contains(text(),'{placeholder}')]`);
    public ShowIfDropdownElement: By = By.xpath('//div[@role="listbox"]');
    public EmptySpaceToSaveValue: By = By.xpath(`//div[@class='cdk-overlay-container']`);
    public SaveFilterButton: By = By.xpath(`//mat-dialog-container//pep-button//button[@data-qa="Save"]`);

    public surveyListSearch: By = By.xpath('//input[@data-placeholder]');
    public surveyLink: By = By.xpath("//a[contains(text(),'{placeholder}')]");
    public sectionRightSideEditor: By = By.xpath("//span[contains(text(),'Section')]");

    public surveyTemplateToCreate: SurveySection[] = [
        {
            Title: 'my survey',
            Key: '',
            Questions: [
                {
                    Key: '',
                    Title: 'first question',
                    Type: 'Multiple Select',
                    OptionalValues: [
                        { Value: 'A', Key: 'A' },
                        { Value: 'B', Key: 'B' },
                        { Value: 'C', Key: 'C' },
                    ],
                    isMandatory: true,
                },
                {
                    Key: '',
                    Title: 'second question',
                    Type: 'Radio Group',
                    OptionalValues: [
                        { Value: 'A', Key: 'A' },
                        { Value: 'B', Key: 'B' },
                    ],
                    isMandatory: false,
                    ShowIf: {
                        Operator: 'And',
                        FilterData: [{ QuestionName: 'first question', ValueToLookFor: ['A', 'C'] }],
                    },
                },
                {
                    Key: '',
                    Title: 'third question',
                    Type: 'Short Text',
                    isMandatory: true,
                    ShowIf: {
                        Operator: 'And',
                        FilterData: [
                            { QuestionName: 'second question', ValueToLookFor: ['B'] },
                            { QuestionName: 'first question', ValueToLookFor: ['A', 'C'] },
                        ],
                    },
                },
                {
                    Key: '',
                    Title: 'fourth question',
                    Type: 'Checkbox',
                    isMandatory: false,
                    OptionalValues: [
                        { Value: '1', Key: '1' },
                        { Value: '2', Key: '2' },
                    ],
                },
                {
                    Key: '',
                    Title: 'fifth question',
                    Type: 'Yes/No',
                    isMandatory: false,
                    OptionalValues: [{ Value: '1' }, { Value: '2' }],
                    ShowIf: {
                        Operator: 'Or',
                        FilterData: [{ QuestionName: 'fourth question', ValueToLookFor: ['1', '2'] }],
                    },
                },
                {
                    Key: '',
                    Title: 'sixth question',
                    Type: 'Decimal',
                    isMandatory: true,
                },
                {
                    Key: '',
                    Title: 'seventh question',
                    Type: 'Date',
                    isMandatory: false,
                },
            ],
        },
    ];
    //-
    //-
    //

    // const xpathQueryForFieldTypeBtn: string = this.FeildTypeButton.valueOf()['value'].replace(
    //     '|textToFill|',
    //     fieldType,
    // );

    public async deleteTemplateByKeyViaAPI(surveyTemplateUUID: string, client: Client) {
        const generalService = new GeneralService(client);
        const deleteSurveyTemplateResponse = await generalService.fetchStatus(`/resources/MySurveyTemplates`, {
            method: 'POST',
            body: JSON.stringify({ Key: surveyTemplateUUID, Hidden: true }),
        });
        expect(deleteSurveyTemplateResponse.Ok).to.equal(true);
        expect(deleteSurveyTemplateResponse.Status).to.equal(200);
        expect(deleteSurveyTemplateResponse.Body.Key).to.equal(surveyTemplateUUID);
        expect(deleteSurveyTemplateResponse.Body.Hidden).to.equal(true);
    }

    public async enterSurveyBuilderSettingsPage(oldWeb?: 'Webapp17'): Promise<boolean> {
        const webAppHeader = new WebAppHeader(this.browser);
        if (oldWeb === 'Webapp17') {
            // added to support webapp versions older than 18, Hagit 3/1/24
            await webAppHeader.openSettings();
        } else {
            await webAppHeader.openSettings();
        }
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Sales Activities');
        await this.browser.click(webAppSettingsSidePanel.SurveysEditor);
        this.browser.sleep(2000);
        return await this.validateSettingsPageIsOpened();
    }

    public async enterSurveyBuilderActualBuilder(): Promise<boolean> {
        await this.browser.click(this.AddASurveyButton);
        this.browser.sleep(5500);
        return await this.validateEmptyBuilderPageIsOpened();
    }

    public async configureTheSurveyTemplate(
        surveyName: string,
        surveyDescription: string,
        sections: SurveySection[],
    ): Promise<string> {
        const eseUtils = new E2EUtils(this.browser);
        const surveyUUID = await eseUtils.getUUIDfromURL();
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
        this.browser.sleep(3000);
        return surveyUUID;
    }

    public async enterSurveyTemplateEditMode(surveyName: string): Promise<boolean> {
        await this.browser.click(this.surveyListSearch);
        await this.browser.sendKeys(this.surveyListSearch, surveyName + Key.ENTER);
        this.browser.sleep(3000);
        const xpathQueryForSurveyLink: string = this.surveyLink.valueOf()['value'].replace('{placeholder}', surveyName);
        await this.browser.click(By.xpath(xpathQueryForSurveyLink));
        this.browser.sleep(2000);
        return await this.validateBuilderPageIsOpened();
    }

    public async editSurveyTemplateName(surveyNewName) {
        await this.setSurveyName(surveyNewName);
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
        return isMainTitleShown && isGenericResourceTitleShown;
    }

    private async validateEmptyBuilderPageIsOpened(): Promise<boolean> {
        const isLeftSideSettingsTitleShown = await this.browser.isElementVisible(this.LeftSideSurveyTitle, 2000);
        const isRightSideSectionShown = await this.browser.isElementVisible(this.RightSideSurveyTitle, 2000);
        const isDeafultSurveySectionShown = await this.browser.isElementVisible(this.DeafultSurveySection, 5000);
        return isDeafultSurveySectionShown && isLeftSideSettingsTitleShown && isRightSideSectionShown;
    }

    private async validateBuilderPageIsOpened(): Promise<boolean> {
        const isLeftSideSettingsTitleShown = await this.browser.isElementVisible(this.LeftSideSurveyTitle, 2000);
        const isRightSideEditorShown = await this.browser.isElementVisible(this.sectionRightSideEditor, 3000);
        return isRightSideEditorShown && isLeftSideSettingsTitleShown;
    }

    private async setSurveyName(surveyName: string) {
        await this.browser.sendKeys(this.SurveyNameInput, '');
        this.browser.sleep(1000 * 3);
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
                        const selectAll = Key.chord(Key.CONTROL, 'a');
                        const optionSelect = question.OptionalValues[index];
                        await this.browser.click(this.ArrowDownButtonOnSelection);
                        this.browser.sleep(3000);
                        //click on the key element and set it with value
                        if (optionSelect.Key) {
                            await this.browser.click(this.SelectionKey, index);
                            await this.browser.sendKeys(this.SelectionKey, selectAll, index);
                            await this.browser.click(By.xpath(`//pep-dialog//button//span[contains(text(),'Close')]`));
                            await this.browser.sendKeys(this.SelectionKey, optionSelect.Key + Key.ENTER, index);
                        }
                        await this.browser.click(this.SelectOptionValueTextBox, index);
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
            for (let index = 0; index < question.ShowIf.FilterData.length; index++) {
                const filter = question.ShowIf.FilterData[index];
                await this.browser.click(this.SelectQuestionButton, index);
                const xpathQueryForQuestionFromDropDown: string = this.SelectQuestionDropDown.valueOf()[
                    'value'
                ].replace('{placeholder}', filter.QuestionName);
                await this.browser.click(By.xpath(xpathQueryForQuestionFromDropDown));
                //6. select value to look for from Drop Down
                for (let index1 = 0; index1 < filter.ValueToLookFor.length; index1++) {
                    const value = filter.ValueToLookFor[index1];
                    await this.browser.click(this.QuestionToFilterByDropDownValue, index);
                    const xpathQueryForValueFromDropDown: string = this.ValueFromDropDownOfSearchingValues.valueOf()[
                        'value'
                    ].replace('{placeholder}', value);
                    await this.browser.click(By.xpath(xpathQueryForValueFromDropDown));
                }
                this.browser.sleep(1500);
                await this.browser.sendKeysNoClear(this.ShowIfDropdownElement, Key.ESCAPE);
                this.browser.sleep(1500);
                if (index < question.ShowIf.FilterData.length - 1) {
                    await this.browser.click(this.AddFilterButton);
                }
            }
            this.browser.sleep(1500);
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
    public Data: any;
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

export class SlideShowBlockColumn {
    constructor(key: string) {
        this.BlockContainer.BlockKey = key;
    }
    public BlockContainer = {
        BlockKey: '',
    };
}

export class SlideShowBlock {
    constructor(scriptKey) {
        this.Key = uuidv4();
        this.PageConfiguration = { Parameters: [] };
        this.Configuration = new SlideShowConfiguration(scriptKey);
    }
    public Configuration: SlideShowConfiguration;
    public Key: string;
    public PageConfiguration: PageConfiguration;
    public Relation: SlideShowBlockRelation = new SlideShowBlockRelation();
}

export interface PageConfiguration {
    Parameters: any[];
}

export class SlideShowConfiguration {
    constructor(scriptKey) {
        this.Resource = 'Slideshow';
        this.Data = {
            slideshowConfig: {
                isUseArrows: true,
                arrowsStyle: 'weak',
                innerPadding: 'md',
                controllersDisplay: 'show',
                useRoundCorners: false,
                transitionTime: '0.75',
                fillHeight: false,
                transitionDuration: 5,
                roundCornersSize: 'md',
                arrowsDisplay: 'show',
                heightUnit: 'REM',
                height: '16',
                dropShadow: {
                    size: 'md',
                    intensity: 'soft',
                    use: false,
                },
                arrowShape: 'round',
                usePauseButton: true,
                showControllersInSlider: true,
                arrowsColor: 'system',
                useInverStyle: true,
                controllerSize: 'md',
                controllerStyle: 'weak',
                isTransition: true,
                arrowType: 'arrow_right',
                editSlideIndex: 0,
                transitionType: 'fade',
            },
            slides: [
                {
                    verticalAlign: 'start',
                    image: {
                        verticalPosition: '50',
                        useImage: false,
                        horizontalPosition: '50',
                        asset: '',
                        assetURL: '',
                    },
                    overlay: {
                        opacity: 75,
                        value: 'hsl(0, 0%, 0%)',
                        use: true,
                    },
                    buttonColor: 'system-primary',
                    titleSize: 'md',
                    subTitleSize: 'md',
                    textColor: 'inverted',
                    buttonsSize: 'md',
                    useTitle: true,
                    innerSpacing: 'md',
                    contentWidth: 'Regular',
                    secondButton: {
                        style: 'strong',
                        label: 'Noo',
                        useButton: false,
                        script: {},
                    },
                    useSubTitle: true,
                    horizontalAlign: 'left',
                    titleContent: '1st Title',
                    gradientOverlay: {
                        opacity: 75,
                        value: 'hsl(0, 100%, 50%)',
                        use: true,
                    },
                    subTitleContent: 'Sub title',
                    firstButton: {
                        style: 'weak-invert',
                        label: 'survey',
                        useButton: true,
                        script: {
                            runScriptData: {
                                ScriptData: {},
                                ScriptKey: scriptKey,
                            },
                        },
                    },
                    id: 0,
                    titleWeight: 'normal',
                },
            ],
        };
        this.AddonUUID = 'f93658be-17b6-4c92-9df3-4e6c7151e038';
    }
    public Resource: string;
    public Data: any;
    public AddonUUID: string;
}

export class SlideShowBlockRelation extends BaseBlockRelation {
    constructor() {
        super();
        (this.Type = 'NgComponent'),
            (this.SubType = 'NG14'),
            (this.ModuleName = 'SlideshowModule'),
            (this.Schema = {
                Fields: {
                    slideshowConfig: {
                        Type: 'Object',
                        Fields: {
                            controllersDisplay: {
                                Type: 'String',
                                ConfigurationPerScreenSize: true,
                            },
                            innerPadding: {
                                Type: 'String',
                                ConfigurationPerScreenSize: true,
                            },
                            arrowsDisplay: {
                                Type: 'String',
                                ConfigurationPerScreenSize: true,
                            },
                            heightUnit: {
                                Type: 'String',
                                ConfigurationPerScreenSize: true,
                            },
                            height: {
                                Type: 'String',
                                ConfigurationPerScreenSize: true,
                            },
                            controllerSize: {
                                Type: 'String',
                                ConfigurationPerScreenSize: true,
                            },
                        },
                    },
                    slides: {
                        Type: 'Array',
                        Items: {
                            Type: 'Object',
                            Fields: {
                                verticalAlign: {
                                    Type: 'String',
                                    ConfigurationPerScreenSize: true,
                                },
                                image: {
                                    Type: 'Object',
                                    Fields: {
                                        verticalPosition: {
                                            Type: 'String',
                                            ConfigurationPerScreenSize: true,
                                        },
                                        useImage: {
                                            Type: 'Bool',
                                            ConfigurationPerScreenSize: false,
                                        },
                                        horizontalPosition: {
                                            Type: 'String',
                                            ConfigurationPerScreenSize: true,
                                        },
                                        asset: {
                                            Type: 'Resource',
                                            Fields: {
                                                url: {
                                                    Type: 'String',
                                                },
                                                key: {
                                                    Type: 'String',
                                                },
                                            },
                                            ConfigurationPerScreenSize: false,
                                        },
                                    },
                                },
                                contentWidth: {
                                    Type: 'String',
                                    ConfigurationPerScreenSize: true,
                                },
                                horizontalAlign: {
                                    Type: 'String',
                                    ConfigurationPerScreenSize: true,
                                },
                                titleSize: {
                                    Type: 'String',
                                    ConfigurationPerScreenSize: true,
                                },
                                subTitleSize: {
                                    Type: 'String',
                                    ConfigurationPerScreenSize: true,
                                },
                                buttonsSize: {
                                    Type: 'String',
                                    ConfigurationPerScreenSize: true,
                                },
                            },
                        },
                    },
                },
            }),
            (this.RelationName = 'PageBlock'),
            (this.ComponentName = 'SlideshowComponent'),
            (this.AddonRelativeURL = 'slideshow'),
            (this.AddonUUID = 'f93658be-17b6-4c92-9df3-4e6c7151e038'),
            (this.Name = 'Slideshow');
    }
    public Schema: SlideShowSchema;
}

export interface SlideShowSchema {
    Fields: SlideShowSchemaFields;
}

export interface SlideShowSchemaFields {
    slideshowConfig: SlideshowConfig;
    slides: SlideShowSlides;
}

export interface SlideshowConfig {
    Type: any;
    Fields: SlideshowConfigFields;
}

export interface SlideshowConfigFields {
    controllersDisplay: SlideshowConfigData;
    innerPadding: SlideshowConfigData;
    arrowsDisplay: SlideshowConfigData;
    heightUnit: SlideshowConfigData;
    height: SlideshowConfigData;
    controllerSize: SlideshowConfigData;
}

export interface SlideshowConfigData {
    Type: string;
    ConfigurationPerScreenSize: boolean;
}

export interface SlideShowSlides {
    Type: string;
    Items: SlideShowSlidesItems;
}

export interface SlideShowSlidesItems {
    Type: string;
    Fields: SlideShowSlidesFields;
}

export interface SlideShowSlidesFields {
    verticalAlign: SlideshowConfigData;
    image: SlideShowSlidesImage;
    contentWidth: SlideshowConfigData;
    horizontalAlign: SlideshowConfigData;
    titleSize: SlideshowConfigData;
    subTitleSize: SlideshowConfigData;
    buttonsSize: SlideshowConfigData;
}

export interface SlideShowSlidesImage {
    Type: string;
    Fields: SlideShowSlidesImageFields;
}

export interface SlideShowSlidesImageFields {
    verticalPosition: SlideshowConfigData;
    useImage: SlideshowConfigData;
    horizontalPosition: SlideshowConfigData;
    asset: SlideShowSlidesImageFieldsAssets;
}

export interface SlideShowSlidesImageFieldsAssets {
    Type: string;
    Fields: SlideShowSlidesImageFieldsAssetsFields;
    ConfigurationPerScreenSize: boolean;
}

export interface SlideShowSlidesImageFieldsAssetsFields {
    url: { Type: string };
    key: { Type: string };
}
