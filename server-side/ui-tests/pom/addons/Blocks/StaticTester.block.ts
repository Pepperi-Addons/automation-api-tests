import { By } from 'selenium-webdriver';
import { Browser } from '../../../utilities/browser';
import { AddonPage } from '../base/AddonPage';

export class StaticTester extends AddonPage {
    constructor(browser: Browser) {
        super(browser);
    }

    public static readonly BlockContainer = By.css('static-tester');

    public static readonly TestText = By.css(`${StaticTester.BlockContainer.value} #testText`);

    public static readonly BlockLoadBtn = By.css(`${StaticTester.BlockContainer.value} #blockLoadBtn`);

    public static readonly ApiCallBtn = By.css(`${StaticTester.BlockContainer.value} #apiCallBtn`);

    public async getTestText(): Promise<string | null> {
        return this.browser.getElementAttribute(StaticTester.TestText, 'title');
    }

    public async clickBlockLoadBtn(): Promise<void> {
        return this.browser.click(StaticTester.BlockLoadBtn);
    }

    public async clickApiCallBtn(): Promise<void> {
        return this.browser.click(StaticTester.BlockLoadBtn);
    }
}
