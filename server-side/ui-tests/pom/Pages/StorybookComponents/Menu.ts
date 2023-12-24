import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Menu extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-menu--story-1"]');
    public MenuContent: By = By.xpath('//div[@role="menu"]/div');
    public MenuContentButtons: By = By.xpath(`${this.MenuContent.value}//button`);
    public MainExampleMenu: By = By.xpath(`${this.MainExampleDiv.value}//pep-menu//button`);
    public MainExampleMenu_icon: By = By.xpath(`${this.MainExampleMenu.value}/mat-icon`);
    public MainExampleMenu_iconSvgValue: By = By.xpath(
        `${this.MainExampleMenu_icon.value}/pep-icon/*[local-name()='svg']/*[local-name()='path']`,
    );

    public async doesMenuComponentFound(): Promise<void> {
        await this.doesComponentFound('menu', 'Menu');
    }

    public async getMenuContent(): Promise<any> {
        const menuContentElement = await this.browser.findElement(this.MenuContent);
        const menuContentElement_innerHTML = await menuContentElement.getAttribute('innerHTML');
        console.info(
            'at getItemsControlContent -> await menuContentElement.getAttribute("innerHTML"): ',
            menuContentElement_innerHTML,
        );
        return menuContentElement_innerHTML;
    }

    public async getButtonsOutOfMenuContent(): Promise<any> {
        const menuContentElement = await this.browser.findElements(this.MenuContentButtons);
        console.info('at getButtonsOutOfMenuContent -> menuContentElement: ', menuContentElement);
        return menuContentElement;
    }
}
