import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Checkbox extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-checkbox--story-1"]');
    public MainExampleLabel: By = By.xpath(`${this.MainExampleDiv.value}//mat-checkbox/label/span[2]`);
    public MainExampleCheckbox: By = By.xpath(`${this.MainExampleDiv.value}//mat-checkbox/label/span/input`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);

    public async doesCheckboxComponentFound(): Promise<void> {
        await this.doesComponentFound('checkbox', 'Checkbox');
    }

    public async getMainExampleLabel(): Promise<string> {
        const label = await this.browser.findElement(this.MainExampleLabel);
        return await label.getText();
    }
}
