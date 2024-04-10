import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class SmartFilters extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesSmartFiltersComponentFound(): Promise<void> {
        await this.doesComponentFound('smart-filters', 'Smart filters');
    }
}
