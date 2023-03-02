import { Key } from 'selenium-webdriver';
import { By } from 'selenium-webdriver/lib/by';
import { BaseBlockRelation } from '../../blueprints/PageBlocksBlueprints';
import { WebAppSettingsSidePanel } from '../Components/WebAppSettingsSidePanel';
import { WebAppHeader } from '../WebAppHeader';
import { AddonPage } from './base/AddonPage';
import { v4 as uuidv4 } from 'uuid';
import E2EUtils from '../../utilities/e2e_utils';
import { SurveyQuestion } from './SurveyTemplateBuilder';

export class SurveyFiller extends AddonPage {
    public MiltiSelectElement: By = By.xpath(`//mat-label[contains(text(),'{placeholder}')]//..//..//..//*[@type]`);
    public selectOption: By = By.xpath(`//span[@class='mat-option-text' and contains(text(),'{placeholder}')]`);
    public RadioButonElement: By = By.xpath(`//mat-label[contains(text(),'{placeholder1}')]//..//..//..//*[contains(text(),'{placeholder2}')]//..//input`);
    public TextBoxElement: By = By.xpath(`//mat-label[contains(text(),'{placeholder}')]//..//..//..//..//pep-textbox`);
    public CheckBoxElement: By = By.xpath(`//mat-label[contains(text(),'{placeholder1}')]//..//..//..//..//*[contains(text(),'{placeholder2}')]//..//span`);
    public YesNoElement: By = By.xpath(`//mat-label[contains(text(),'{placeholder1}')]//..//..//..//..//*[contains(text(),'{placeholder2}')]`);
    public DecimalElement: By = By.xpath(`//mat-label[contains(text(),'{placeholder}')]//..//..//..//..//pep-textbox[@data-qa]`);
    public DatelElement: By = By.xpath(`//mat-label[contains(text(),'{placeholder}')]//..//..//..//..//pep-date`);


    //TODO: "Single Select" | "Number" | "Currency" | "Percentage"

    public async answerQuestion(type: SurveyQuestion["Type"], questionTitle, answer: any[]) {
        switch (type) {
            case "Short Text":
            case "Long Text":
                const xpathQueryForText: string = this.TextBoxElement
                    .valueOf()
                ['value'].replace('{placeholder}', questionTitle);
                await this.browser.sendKeys(By.xpath(xpathQueryForText), answer[0]);
                break;
            case "Multiple Select":
                const xpathQueryForMultiSelect: string = this.MiltiSelectElement
                    .valueOf()
                ['value'].replace('{placeholder}', questionTitle);
                await this.browser.click(By.xpath(xpathQueryForMultiSelect));
                for (let index = 0; index < answer.length; index++) {
                    const certainAnswer = answer[index];
                    const xpathQueryForMultiSelectOption: string = this.selectOption
                        .valueOf()
                    ['value'].replace('{placeholder}', certainAnswer);
                    await this.browser.click(By.xpath(xpathQueryForMultiSelectOption));
                }
                break;
            case "Checkbox":
                let xpathQueryForCheckBox: string = this.CheckBoxElement
                    .valueOf()
                ['value'].replace('{placeholder1}', questionTitle);
                for (let index = 0; index < answer.length; index++) {
                    const certainAnswer = answer[index];
                    xpathQueryForCheckBox = this.CheckBoxElement
                        .valueOf()
                    ['value'].replace('{placeholder2}', certainAnswer);
                    await this.browser.click(By.xpath(xpathQueryForCheckBox));
                }
                break;
            case "Radio Group":
                let xpathQueryForRadio: string = this.RadioButonElement
                    .valueOf()
                ['value'].replace('{placeholder1}', questionTitle);
                xpathQueryForRadio = this.RadioButonElement
                    .valueOf()
                ['value'].replace('{placeholder2}', answer[0]);
                await this.browser.click(By.xpath(xpathQueryForRadio));
                break;
            case "Yes/No":
                let xpathQueryForYesNo: string = this.YesNoElement
                    .valueOf()
                ['value'].replace('{placeholder1}', questionTitle);
                xpathQueryForYesNo = this.RadioButonElement
                    .valueOf()
                ['value'].replace('{placeholder2}', answer[0]);
                await this.browser.click(By.xpath(xpathQueryForYesNo));
                break;
            case "Decimal":
                let xpathQueryForDecimal: string = this.DecimalElement
                    .valueOf()
                ['value'].replace('{placeholder}', questionTitle);
                await this.browser.sendKeys(By.xpath(xpathQueryForDecimal), answer[0]);
                break;
            case "Date":
            case "Date Time":
                let xpathQueryForDate: string = this.DatelElement
                    .valueOf()
                ['value'].replace('{placeholder}', questionTitle);
                //TODO
                break;
        }
    }
}