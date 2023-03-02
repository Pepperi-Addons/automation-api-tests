import { By } from 'selenium-webdriver/lib/by';
import { AddonPage } from './base/AddonPage';

export class SlideShowPage extends AddonPage {
    public enterSurveyBtn: By = By.css('[data-qa="survey"]'); //data-qa="survey"
    public arrowBtn: By = By.xpath('//pep-button[contains(@class,"arrowShape_round")]//button[@data-qa="undefined"]');

    public async enterSurveyPicker() {
        do {
            await this.browser.click(this.arrowBtn);
        } while (!(await this.safeUntilIsVisible(this.enterSurveyBtn)));
        await this.browser.click(this.enterSurveyBtn);
    }
}
