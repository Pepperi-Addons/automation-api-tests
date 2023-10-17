import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Chips extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-chips--story-1"]');
    // public MainExampleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);
    public MainExampleChip: By = By.xpath(`${this.MainExampleDiv.value}//mat-chip`);

    public async doesChipsComponentFound(): Promise<void> {
        await this.doesComponentFound('chips', 'Chips');
    }

    // public async getMainExampleLabel(): Promise<string> {
    //     const label = await this.browser.findElement(this.MainExampleLabel);
    //     return (await label.getText()).trim();
    // }
}
