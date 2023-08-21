import { By } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';

export class AccountsPage extends AddonPage {
    public BurgerMenuButton: By = By.xpath('//list-menu[@data-qa="firstMenu"]//button[@aria-haspopup="menu"]');
    public OptionButtonInMenu: By = By.xpath('//list-menu[@data-qa="firstMenu"]//button[@aria-haspopup="menu"]');
    //span[contains(text(),'Account Info')]

    public async selectOptionFromBurgerMenu(option: string): Promise<void> {
        await this.browser.click(this.BurgerMenuButton);
        const xpathQueryForAccountMenuButton: string = this.OptionButtonInMenu.valueOf()['value'].replace(
            '{placeholder}',
            option,
        );
        await this.browser.click(By.xpath(xpathQueryForAccountMenuButton));
    }
}
