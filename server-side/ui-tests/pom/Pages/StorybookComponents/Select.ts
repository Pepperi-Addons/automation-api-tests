import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Select extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-select--story-1"]');
    public MainExamplePepSelect: By = By.xpath(`${this.MainExampleDiv.value}//pep-select`);
    public MainExampleSelect: By = By.xpath(`${this.MainExamplePepSelect.value}//mat-form-field`);
    public MainExampleSelect_value: By = By.xpath(`${this.MainExampleSelect.value}//mat-select//span/span`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);

    public async doesSelectComponentFound(): Promise<void> {
        await this.doesComponentFound('select', 'Select');
    }

    public async getMainExampleSelectValue(): Promise<string> {
        const label = await this.browser.findElement(this.MainExampleSelect_value);
        return (await label.getText()).trim();
    }
}
