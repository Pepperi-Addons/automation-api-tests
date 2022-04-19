import { Browser } from '../utilities/browser';
import { Page } from './base/Page';
import config from '../../config';
import { By } from 'selenium-webdriver';

export class WebAppTopBar extends Page {
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public Header: By = By.css('[data-qa="firstMenu"]');
    public CloseBtn: By = By.css('.modal.in .headerTitle.pep-border-bottom button');
    public DoneBtn: By = By.css('[data-qa="doneButton"]');
    public CancelBtn: By = By.css('.modal.in .headerTitle.pep-border-bottom button');
    public SearchFieldInput: By = By.css('#searchInput');
    public ChangeViewButton: By = By.css(`.top-bar-container button [title='Change View']`);
    public PanelMenuButtons: By = By.css(`[role="menu"] button`);
    //TODO: Replace ChangeListButton for:
    //WebApp Platform | Version: 16.60.38 = top-bar-container
    //WebApp Platform | Version: 16.65.30/16.65.34 = pep-side-bar-container
    // public ChangeListButton: By = By.css(`.top-bar-container list-chooser button`);
    public ChangeListButton: By = By.css(`.pep-side-bar-container list-chooser button`);

    //Cart
    public CartTopMenu: By = By.css('[data-qa="firstMenu"]');
    public CartViewBtn: By = By.css('[data-qa="cartButton"]');
    public CartSumbitBtn: By = By.css('[data-qa="Submit"]');
    public CartDoneBtn: By = By.css('[data-qa="Done"]');
    public CartContinueOrderingBtn: By = By.css('[data-qa="continueOrderingButton"]');
    public CartOrderTotal: By = By.css('list-totals-view .list-totals-view .value');

    //Editor
    public EditorEditBtn: By = By.css('main .content.pep-border-bottom [pepmenublur]');
    public EditorSearchField: By = By.css('main .content.pep-border-bottom pep-search input');
    public EditorAddBtn: By = By.css('main .content.pep-border-bottom button [name="number_plus"]');

    //Catalog
    //TODO: Replace CatalogSelectHeader for:
    //WebApp Platform | Version: 16.60.38 = div
    //WebApp Platform | Version: 16.65.30/16.65.34 = sapn
    // public CatalogSelectHeader: By = By.xpath("//div[contains(text(), 'Select Catalog')]");
    public CatalogSelectHeader: By = By.xpath("//span[contains(text(), 'Select Catalog')]");

    public async selectFromMenuByText(menu: By, buttonText: string): Promise<void> {
        console.log('Select from menu');
        this.browser.sleep(1001);
        await this.browser.click(menu);
        //This is mandatory wait while the buttons on the menu are loading and might change
        this.browser.sleep(2002);
        await this.browser.findElements(this.PanelMenuButtons, 4000).then(
            async (res) => {
                for (let i = 0; i < res.length; i++) {
                    if ((await res[i].getText()).trim() == buttonText) {
                        await res[i].click();
                        break;
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
