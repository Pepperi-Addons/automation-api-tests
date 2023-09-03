import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class QuantitySelector extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesQuantitySelectorComponentFound(): Promise<void> {
        await this.doesComponentFound('quantity-selector', 'Quantity selector');
    }
}
