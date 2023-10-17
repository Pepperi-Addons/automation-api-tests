import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Select extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-select--story-1"]');
    public MainExampleSelect: By = By.xpath(`${this.MainExampleDiv.value}//pep-select`);

    public async doesSelectComponentFound(): Promise<void> {
        await this.doesComponentFound('select', 'Select');
    }
}
