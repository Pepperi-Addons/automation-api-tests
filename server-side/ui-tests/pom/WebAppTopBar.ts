import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Locator, By } from 'selenium-webdriver';

export class WebAppTopBar extends Page {
    constructor(browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public Header: Locator = By.css('.modal.in .headerTitle.pep-border-bottom');
    public CloseBtn: Locator = By.css('.modal.in .headerTitle.pep-border-bottom button');
    public DoneBtn: Locator = By.css('[data-qa="doneButton"]');
    public CancelBtn: Locator = By.css('.modal.in .headerTitle.pep-border-bottom button');
    public SearchFieldInput: Locator = By.css('#searchInput');
    public ChangeViewButton: Locator = By.css(`.top-bar-container button [title='Change View']`);
    public PanelMenuButtons: Locator = By.css(`[role="menu"] button`);

    //Cart
    public CartTopMenu: Locator = By.css('[data-qa="firstMenu"]');
    public CartViewBtn: Locator = By.css('[data-qa="cartButton"]');
    public CartSumbitBtn: Locator = By.css('[data-qa="Submit"]');
    public CartContinueOrderingBtn: Locator = By.css('[data-qa="continueOrderingButton"]');

    //Editor
    public EditorEditBtn: Locator = By.css('main .content.pep-border-bottom [pepmenublur]');
    public EditorSearchField: Locator = By.css('main .content.pep-border-bottom pep-search input');
    public EditorAddBtn: Locator = By.css('main .content.pep-border-bottom button [name="number_plus"]');

    public async selectFromMenuByText(menu: Locator, buttonText: string): Promise<void> {
        this.browser.sleep(1000);
        await this.browser.click(menu);
        //This is mandatory wait while the buttons on the menu are loading and might change
        this.browser.sleep(2000);
        await this.browser.findElements(this.PanelMenuButtons, 4000).then(
            async (res) => {
                for (let i = 0; i < res.length; i++) {
                    if ((await res[i].getText()).trim() == buttonText) {
                        await res[i].click();
                    }
                }
            },
            () => {
                throw new Error(`Element ${this.PanelMenuButtons.toString()}, with text: ${buttonText} not found`);
            },
        );
        return;
    }
}
