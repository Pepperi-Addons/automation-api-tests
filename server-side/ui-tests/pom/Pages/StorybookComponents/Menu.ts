import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Menu extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-menu--story-1"]');
    public MainExampleMenu: By = By.xpath(`${this.MainExampleDiv.value}//pep-menu//button`);

    public async doesMenuComponentFound(): Promise<void> {
        await this.doesComponentFound('menu', 'Menu');
    }
}
