import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class QuantitySelector extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-quantity-selector--story-1"]');
    public MainExampleQuantitySelector: By = By.xpath(
        `${this.MainExampleDiv.value}//pep-quantity-selector//mat-form-field`,
    );
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
}
