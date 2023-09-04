import { By } from 'selenium-webdriver/lib/by';
import { AddonPage } from './base/AddonPage';

export class SlideShowPage extends AddonPage {
    public enterSurveyBtn: By = By.css('[data-qa="survey"]'); //data-qa="survey"
    public arrowBtn: By = By.xpath('//pep-button[contains(@class,"arrowShape_round")]//button[@data-qa="undefined"]');
    public stopButton: By = By.xpath("//pep-button[@iconname='system_pause']");

    public async enterSurveyPicker() {
        if (!(await this.safeUntilIsVisible(this.enterSurveyBtn))) {
            await this.browser.click(this.arrowBtn);
            await this.browser.click(this.stopButton);
            this.browser.sleep(1000 * 2);
        }
        await this.browser.click(this.enterSurveyBtn);
    }
}
