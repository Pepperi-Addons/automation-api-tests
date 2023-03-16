import { Key } from 'selenium-webdriver';
import { By } from 'selenium-webdriver/lib/by';
import { AddonPage } from './base/AddonPage';
import { SurveyQuestion } from './SurveyTemplateBuilder';

export class SurveyFiller extends AddonPage {
    public MiltiSelectElement: By = By.xpath(`//mat-label[contains(text(),'{placeholder}')]//..//..//..//*[@type]`);
    public SingleSelectElement: By = By.xpath(
        `//mat-label[contains(text(),'{placeholder}')]//..//..//..//mat-form-field`,
    );
    public selectOption: By = By.xpath(`//span[@class='mat-option-text' and contains(text(),'{placeholder}')]`);
    public RadioButonElement: By = By.xpath(
        `//mat-label[contains(text(),'{placeholder1}')]//..//..//..//div[contains(@title,'{placeholder2}')]`,
    );
    public TextBoxElement: By = By.xpath(
        `//mat-label[contains(text(),'{placeholder}')]//..//..//..//..//pep-textbox//input`,
    );
    public CheckBoxElement: By = By.xpath(
        `//mat-label[contains(text(),'{placeholder1}')]//..//..//..//..//*[contains(text(),'{placeholder2}')]//..//span`,
    );
    public YesNoElement: By = By.xpath(
        `//mat-label[contains(text(),'{placeholder1}')]//..//..//..//..//*[contains(text(),'{placeholder2}')]`,
    );
    public DecimalElement: By = By.xpath(
        `//mat-label[contains(text(),'{placeholder}')]//..//..//..//..//pep-textbox[@data-qa]//input`,
    );
    public DatelElement: By = By.xpath(
        `//mat-label[contains(text(),'{placeholder}')]//..//..//..//..//pep-date//input`,
    );
    public emptySpaceToClick: By = By.xpath("//div[@class='pep-top-bar-container inline']");
    public saveBtn: By = By.xpath(`//button[@data-qa]//span//span[contains(text(),'Save')]`);

    public async answerQuestion(type: SurveyQuestion['Type'], questionTitle, answer: any[]) {
        switch (type) {
            case 'Short Text':
            case 'Long Text':
                const xpathQueryForText: string = this.TextBoxElement.valueOf()['value'].replace(
                    '{placeholder}',
                    questionTitle,
                );
                await this.browser.sendKeys(By.xpath(xpathQueryForText), answer[0]);
                break;
            case 'Multiple Select':
                const xpathQueryForMultiSelect: string = this.MiltiSelectElement.valueOf()['value'].replace(
                    '{placeholder}',
                    questionTitle,
                );
                await this.browser.click(By.xpath(xpathQueryForMultiSelect));
                for (let index = 0; index < answer.length; index++) {
                    const certainAnswer = answer[index];
                    const xpathQueryForMultiSelectOption: string = this.selectOption
                        .valueOf()
                        ['value'].replace('{placeholder}', certainAnswer);
                    await this.browser.click(By.xpath(xpathQueryForMultiSelectOption));
                    this.browser.sleep(1100);
                }
                break;
            case 'Single Select':
                const xpathQueryForSingleSelect: string = this.SingleSelectElement.valueOf()['value'].replace(
                    '{placeholder}',
                    questionTitle,
                );
                await this.browser.click(By.xpath(xpathQueryForSingleSelect));
                const xpathQueryForSingleSelectOption: string = this.selectOption
                    .valueOf()
                    ['value'].replace('{placeholder}', answer[0]);
                await this.browser.click(By.xpath(xpathQueryForSingleSelectOption));
                break;
            case 'Checkbox':
                const xpathQueryForCheckBox: string = this.CheckBoxElement.valueOf()['value'].replace(
                    '{placeholder1}',
                    questionTitle,
                );
                for (let index = 0; index < answer.length; index++) {
                    const certainAnswer = answer[index];
                    const xpathQueryForCheckBox2 = xpathQueryForCheckBox.replace('{placeholder2}', certainAnswer);
                    await this.browser.click(By.xpath(xpathQueryForCheckBox2));
                    this.browser.sleep(4000);
                }
                break;
            case 'Radio Group':
                const xpathQueryForRadio: string = this.RadioButonElement.valueOf()['value'].replace(
                    '{placeholder1}',
                    questionTitle,
                );
                const xpathQueryForRadio2 = xpathQueryForRadio.replace('{placeholder2}', answer[0]);
                await this.browser.click(By.xpath(xpathQueryForRadio2));
                break;
            case 'Yes/No':
                let xpathQueryForYesNo: string = this.YesNoElement.valueOf()['value'].replace(
                    '{placeholder1}',
                    questionTitle,
                );
                xpathQueryForYesNo = xpathQueryForYesNo.replace('{placeholder2}', answer[0]);
                await this.browser.click(By.xpath(xpathQueryForYesNo));
                break;
            case 'Decimal':
            case 'Number':
            case 'Currency':
            case 'Percentage':
                const xpathQueryForDecimal: string = this.DecimalElement.valueOf()['value'].replace(
                    '{placeholder}',
                    questionTitle,
                );
                await this.browser.sendKeys(By.xpath(xpathQueryForDecimal), answer[0]);
                break;
            case 'Date':
            case 'Date Time':
                const xpathQueryForDate: string = this.DatelElement.valueOf()['value'].replace(
                    '{placeholder}',
                    questionTitle,
                );
                await this.browser.sendKeys(By.xpath(xpathQueryForDate), answer[0]);

                break;
        }
        const elem = await this.browser.switchToActiveElement();
        await elem.sendKeys(Key.ESCAPE);
        this.browser.sleep(5000);
    }

    public async saveSurvey() {
        await this.browser.click(this.saveBtn);
    }
}
