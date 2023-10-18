import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class QuantitySelector extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-quantity-selector--story-1"]');
    public MainExampleQuantitySelector: By = By.xpath(
        `${this.MainExampleDiv.value}//pep-quantity-selector//mat-form-field`,
    );
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);

    public async doesQuantitySelectorComponentFound(): Promise<void> {
        await this.doesComponentFound('quantity-selector', 'Quantity selector');
    }
}
