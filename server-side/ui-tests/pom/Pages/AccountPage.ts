import { By } from 'selenium-webdriver';
import { AddonPage } from '../addons/base/AddonPage';

export class AccountsPage extends AddonPage {
    public BurgerMenuButton: By = By.xpath('//list-menu[@data-qa="firstMenu"]//button[@aria-haspopup="menu"]');
    public OptionButtonInMenu: By = By.xpath("//span[contains(text(),'{placeholder}')]");
    public TitleElement: By = By.xpath("//span[contains(text(),'{placeholder}')]");

    public async selectOptionFromBurgerMenu(option: string): Promise<void> {
        this.browser.sleep(1000 * 7);
        await this.browser.click(this.BurgerMenuButton);
        const xpathQueryForAccountMenuButton: string = this.OptionButtonInMenu.valueOf()['value'].replace(
            '{placeholder}',
            option,
        );
        await this.browser.click(By.xpath(xpathQueryForAccountMenuButton));
        this.browser.sleep(1000 * 5);
    }

    public async clickOnEmptySpace(resourceViewName: string): Promise<void> {
        const xpathQueryForTitleElement: string = this.OptionButtonInMenu.valueOf()['value'].replace(
            '{placeholder}',
            resourceViewName,
        );
        await this.browser.untilIsVisible(By.xpath(xpathQueryForTitleElement));
        await this.browser.click(By.xpath(xpathQueryForTitleElement));
        this.browser.sleep(1000 * 2);
    }
}
