import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Menu extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-menu--story-1"]');
    public MainExampleMenu: By = By.xpath(`${this.MainExampleDiv.value}//pep-menu//button`);
    public MainExampleMenu_icon: By = By.xpath(`${this.MainExampleMenu.value}/mat-icon`);
    public MainExampleMenu_iconSvgValue: By = By.xpath(
        `${this.MainExampleMenu_icon.value}/pep-icon/*[local-name()='svg']/*[local-name()='path']`,
    );

    public async doesMenuComponentFound(): Promise<void> {
        await this.doesComponentFound('menu', 'Menu');
    }
}
