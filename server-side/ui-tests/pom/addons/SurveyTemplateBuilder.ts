import { Key } from 'selenium-webdriver';
import { By } from 'selenium-webdriver/lib/by';
import { WebAppSettingsSidePanel } from '../Components/WebAppSettingsSidePanel';
import { WebAppHeader } from '../WebAppHeader';
import { AddonPage } from './base/AddonPage';

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
    Name: string;
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
        await this.browser.click(this.SaveSurveyButton);
        await this.browser.click(this.PublishSurveyButton);
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
                await this.browser.sendKeys(this.TextQuestionInput, question.Title + Key.ENTER);
                if (await this.browser.isElementVisible(this.ErrorDialogText, 3000)) {
                    await this.browser.click(this.CloseErrorDialogButtont);
                }
            case 'Multiple Select':
            case 'Single Select':
            //TODO
            case 'Yes/No':
            //TODO
            case 'Checkbox':
            case 'Radio Group':
            //TODO
        }
    }
}
