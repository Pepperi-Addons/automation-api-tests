import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Checkbox extends StorybookComponent {
    public MainExampleLabel: By = By.xpath(``);

    public async doesCheckboxComponentFound(): Promise<void> {
        await this.doesComponentFound('checkbox', 'Checkbox');
    }

    public async getLabel(): Promise<string> {
        const label = await this.browser.findElement(this.MainExampleLabel);
        return await label.getText();
    }
}
