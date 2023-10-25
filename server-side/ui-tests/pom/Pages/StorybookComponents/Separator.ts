import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Separator extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-separator--story-1"]');
    public MainExamplePepSeparator: By = By.xpath(`${this.MainExampleDiv.value}//pep-separator`);

    public async doesSeparatorComponentFound(): Promise<void> {
        await this.doesComponentFound('separator', 'Separator');
    }
}
