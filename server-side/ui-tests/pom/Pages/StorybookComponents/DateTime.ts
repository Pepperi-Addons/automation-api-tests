import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class DateTime extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-date-date-time--story-1"]');
    public MainExampleDateTime_PepDate: By = By.xpath(`${this.MainExampleDiv.value}//pep-date`);
    public MainExampleDateTime: By = By.xpath(`${this.MainExampleDateTime_PepDate.value}//input`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);
    public MainExample_pepTitle: By = By.xpath(`${this.MainExampleDiv.value}//pep-date${this.PepTitle.value}`);

    public async doesDateTimeComponentFound(): Promise<void> {
        await this.doesComponentFound('date-time', 'Date & date-time');
    }

    public async getMainExampleDateTimeValue(): Promise<string> {
        const dateString = await (await this.browser.findElement(this.MainExampleDateTime)).getAttribute('value');
        return dateString.trim();
    }

    public async getMainExampleDateTimeTxtColor(): Promise<string> {
        const colorDiv = await this.browser.findElement(this.MainExampleDateTime);
        try {
            const style = await colorDiv.getAttribute('style');
            const txtColor = style.split('color:')[1].split(';')[0];
            console.info('at getMainExampleDateTimeTxtColor, txtColor VALUE: ', txtColor);
            return txtColor.trim();
        } catch (error) {
            console.error(error);
            return '';
        }
    }
}
