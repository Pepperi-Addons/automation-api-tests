import { By } from 'selenium-webdriver';
import { AddonPage } from '../addons/base/AddonPage';

export class AccountsPage extends AddonPage {
    public BurgerMenuButton: By = By.xpath('//list-menu[@data-qa="firstMenu"]//button[@aria-haspopup="menu"]');
    public OptionButtonInMenu: By = By.xpath("//span[contains(text(),'{placeholder}')]");

    public async selectOptionFromBurgerMenu(option: string): Promise<void> {
        await this.browser.click(this.BurgerMenuButton);
        const xpathQueryForAccountMenuButton: string = this.OptionButtonInMenu.valueOf()['value'].replace(
            '{placeholder}',
            option,
        );
        await this.browser.click(By.xpath(xpathQueryForAccountMenuButton));
        this.browser.sleep(1000 * 5);
    }
}
