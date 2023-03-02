import { By } from "selenium-webdriver/lib/by";
import { AddonPage } from "./base/AddonPage";

export class SurveyPicker extends AddonPage {

    public radioButtonKeySurvey: By = By.xpath("//span[@id='Key' and contains(text(),'{placeholder}')]//..//..//..//..//..//..//mat-radio-button");
    public radioButtonKeyAccount: By = By.xpath("//span[contains(text(),'{placeholder}')]//..//..//..//..//..//..//mat-radio-button");
    public doneButton: By = By.css('[data-qa="done"]');
    public numberOfResultsIndicator: By = By.xpath("//span[@class='bold number']");
    public surveyPageLabel: By = By.xpath("//label[contains(text(),'surveyTemplate')]");
    
    //
    public async selectSurvey(surveyKey) {
        const xpathQueryForRadioButtonOfSurvey: string = this.radioButtonKeySurvey.valueOf()[
            'value'
        ].replace('{placeholder}', surveyKey);
        await this.browser.click(By.xpath(xpathQueryForRadioButtonOfSurvey));
        await this.browser.click(this.doneButton);
        const isAccountSelectionVisibale = this.browser.untilIsVisible(this.numberOfResultsIndicator,5000);
        return isAccountSelectionVisibale;
    }

    public async selectAccount(accountName) {
        const xpathQueryForRadioButtonOfAccount: string = this.radioButtonKeyAccount.valueOf()[
            'value'
        ].replace('{placeholder}', accountName);
        await this.browser.click(By.xpath(xpathQueryForRadioButtonOfAccount));
        await this.browser.click(this.doneButton);
        const isSurveyPageOpen = this.browser.untilIsVisible(this.surveyPageLabel,5000);
        return isSurveyPageOpen;
    }
}