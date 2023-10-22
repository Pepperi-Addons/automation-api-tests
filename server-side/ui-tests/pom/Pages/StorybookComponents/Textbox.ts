import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Textbox extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-textbox--base"]');
    public MainExampleTextbox: By = By.xpath(`${this.MainExampleDiv.value}//pep-textbox//input`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);

    public async doesTextboxComponentFound(): Promise<void> {
        await this.doesComponentFound('textbox', 'Textbox');
    }

    public async getMainExampleTextboxValue(): Promise<string> {
        const inputValue = await (await this.browser.findElement(this.MainExampleTextbox)).getAttribute('value');
        return inputValue.trim();
    }
}
