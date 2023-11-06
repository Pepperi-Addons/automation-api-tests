import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Textbox extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-textbox--base"]');
    public MainExampleTextbox: By = By.xpath(`${this.MainExampleDiv.value}//pep-textbox//input`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);
    public MainExample_pepTitle: By = By.xpath(`${this.MainExampleDiv.value}//pep-textbox${this.PepTitle.value}`);
    public MainExample_pepSymbol: By = By.xpath(`${this.MainExampleDiv.value}//pep-textbox//pep-textbox-icon`);
    public MainExample_ErrorMessageSpan: By = By.xpath(`${this.MainExampleDiv.value}${this.ErrorSpan.value}`);
    public MainExample_BorderLineElement: By = By.xpath(
        `${this.MainExampleDiv.value}//div[contains(@class,"mat-form-field-flex")]`,
    );

    public async doesTextboxComponentFound(): Promise<void> {
        await this.doesComponentFound('textbox', 'Textbox');
    }

    public async getMainExampleTextboxValue(): Promise<string> {
        const inputValue = await (await this.browser.findElement(this.MainExampleTextbox)).getAttribute('value');
        return inputValue.trim();
    }

    public async getMainExampleTextboxTxtColor(): Promise<string> {
        const colorDiv = await this.browser.findElement(this.MainExampleTextbox);
        try {
            const style = await colorDiv.getAttribute('style');
            const txtColor = style.split('color:')[1].split(';')[0];
            console.info('at getMainExampleTextboxTxtColor, txtColor VALUE: ', txtColor);
            return txtColor.trim();
        } catch (error) {
            console.error(error);
            return '';
        }
    }
}
