import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class DateTime extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-date-date-time--story-1"]');
    public MainExampleDateTime: By = By.xpath(`${this.MainExampleDiv.value}//pep-date//input`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);

    public async doesDateTimeComponentFound(): Promise<void> {
        await this.doesComponentFound('date-time', 'Date & date-time');
    }

    public async getMainExampleDateTimeValue(): Promise<string> {
        const dateString = await (await this.browser.findElement(this.MainExampleDateTime)).getAttribute('value');
        return dateString.trim();
    }
}
