import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class QuantitySelector extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-quantity-selector--story-1"]');
    public MainExamplePepQuantitySelector: By = By.xpath(`${this.MainExampleDiv.value}//pep-quantity-selector`);
    public MainExampleQuantitySelector: By = By.xpath(`${this.MainExamplePepQuantitySelector.value}//mat-form-field`);
    public MainExampleQuantitySelector_style: By = By.xpath(`${this.MainExampleQuantitySelector.value}/div/div`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);
    public MainExampleQuantitySelector_value: By = By.xpath(`${this.MainExampleQuantitySelector.value}//input`);

    public async doesQuantitySelectorComponentFound(): Promise<void> {
        await this.doesComponentFound('quantity-selector', 'Quantity selector');
    }

    public async getMainExampleQuantitySelectorValue(): Promise<string> {
        const label = await (
            await this.browser.findElement(this.MainExampleQuantitySelector_value)
        ).getAttribute('value');
        return label.trim();
    }

    public async getMainExampleQuantitySelectorTxtColor(): Promise<string> {
        const colorDiv = await this.browser.findElement(this.MainExampleQuantitySelector_style);
        try {
            const style = await colorDiv.getAttribute('style');
            const txtColor = style.split('color:')[1].split(';')[0];
            console.info('at getMainExampleQuantitySelectorTxtColor, txtColor VALUE: ', txtColor);
            return txtColor.trim();
        } catch (error) {
            console.error(error);
            return '';
        }
    }
}
