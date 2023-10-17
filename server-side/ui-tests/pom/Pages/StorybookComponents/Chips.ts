import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Chips extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-chips--story-1"]');
    public MainExampleChip: By = By.xpath(`${this.MainExampleDiv.value}//mat-chip`);

    public async doesChipsComponentFound(): Promise<void> {
        await this.doesComponentFound('chips', 'Chips');
    }
}
