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

    public CartTopMenu: Locator = By.css('[data-qa="firstMenu"]');

    public CartViewBtn: Locator = By.css('[data-qa="cartButton"]');

    public CartSumbitBtn: Locator = By.css('[data-qa="Submit"]');

    public CartContinueOrderingBtn: Locator = By.css('[data-qa="continueOrderingButton"]');
}
