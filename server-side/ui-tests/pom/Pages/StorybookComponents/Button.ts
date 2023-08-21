import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Button extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-button--story-1"]');
    public MainExampleButton: By = By.xpath(`${this.MainExampleDiv.value}//button`);
    public MainExampleButton_value: By = By.xpath(`${this.MainExampleButton.value}/span/span`);

    public async doesButtonComponentFound(): Promise<void> {
        await this.doesComponentFound('button', 'Button');
    }

    public async getMainExampleButtonValue(): Promise<string> {
        const label = await this.browser.findElement(this.MainExampleButton_value);
        return (await label.getText()).trim();
    }
}
