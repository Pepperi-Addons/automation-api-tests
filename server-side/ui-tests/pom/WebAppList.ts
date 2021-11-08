import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { WebElement, Locator, By } from 'selenium-webdriver';

export enum SelectSmartSearchRange {
    '=' = 1,
    '>' = 2,
    '<' = 4,
    Between = 7,
}

export class WebAppList extends Page {
    table: string[][] = [];
    constructor(browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public List: Locator = By.css('pep-list .scrollable-content');
    public Headers: Locator = By.css('pep-list .table-header-fieldset fieldset .header-label');
    public RadioButtons: Locator = By.css('pep-list .table-row-fieldset .mat-radio-button');
    public Cells: Locator = By.css('pep-list .table-row-fieldset .pep-report-fields');
    public ListRowElements: Locator = By.css('pep-list .table-row-fieldset');
    public TotalResultsText: Locator = By.css('.total-items .number');
    public LinksInListArr: Locator = By.css('pep-internal-button a');

    //Card List
    public CardListElements: Locator = By.css('pep-list .scrollable-content > div pep-form');

    //Cart List
    public CartListElements: Locator = By.css('pep-list pep-form');
    public CartListElementsBtn: Locator = By.css('pep-form button');
    public CartListElementsQuantityBtn: Locator = By.css('pep-form pep-quantity-selector button');
    public CartListElementsQuantityInput: Locator = By.css('pep-form pep-quantity-selector input');
    public CartListElementsInternalBtn: Locator = By.css('pep-form pep-internal-menu button');
    public CartListElementsGridLineViewInternalBtn: Locator = By.css('pep-list pep-internal-button');
    public CartListGridLineHeaderItemPrice: Locator = By.css('label#ItemPrice');

    //Smart Search
    public SmartSearchOptions: Locator = By.css('app-advanced-search label');
    public SmartSearchCheckBoxBtnArr: Locator = By.css('.advance-search-menu li[title] input');
    public SmartSearchCheckBoxTitleArr: Locator = By.css('.advance-search-menu li[title] label');
    public SmartSearchCheckBoxOptions: Locator = By.css('.advance-search-menu li');
    public SmartSearchCheckBoxDone: Locator = By.css('.advance-search-menu .done');
    public SmartSearchCheckBoxClear: Locator = By.css('.advance-search-menu .clear');
    public SmartSearchSelect: Locator = By.css('.advance-search-menu .smBody select');
    public SmartSearchNumberInputArr: Locator = By.css(`.advance-search-menu .smBody input[type='number']`);

    public async validateListRowElements(ms?: number): Promise<void> {
        return await this.validateElements(this.ListRowElements, ms);
    }

    public async validateCardListElements(ms?: number): Promise<void> {
        return await this.validateElements(this.CardListElements, ms);
    }

    public async validateCartListRowElements(ms?: number): Promise<void> {
        return await this.validateElements(this.CartListElements, ms);
    }

    public async validateElements(selector: Locator, ms?: number): Promise<void> {
        let tempListItems = await this.browser.findElements(selector);
        let tempListItemsLength;
        let loopCounter = ms ? ms / 1500 : 20;
        console.log('Validate List Loaded');
        let loadingCounter = 0;
        do {
            tempListItemsLength = tempListItems.length;
            this.browser.sleep(1500 + loadingCounter);
            tempListItems = await this.browser.findElements(selector);
            loopCounter--;
            loadingCounter++;
        } while (tempListItems.length > tempListItemsLength && loopCounter > 0);
        return;
    }

    public async clickOnFromListRowWebElement(position = 0, waitUntil = 15000): Promise<void> {
        return await this.click(this.ListRowElements, position, waitUntil);
    }

    public async clickOnLinkFromListRowWebElement(position = 0, waitUntil = 15000): Promise<void> {
        return await this.click(this.LinksInListArr, position, waitUntil);
    }

    public async selectCardWebElement(position = 0): Promise<WebElement> {
        const cardsArr = await this.browser.findElements(this.CardListElements);
        return cardsArr[cardsArr.length > position ? position : 0];
    }

    public async getListAsTable(): Promise<string[][]> {
        await this.validateListRowElements();
        const headrs = await this.browser.findElements(this.Headers);
        const cells = await this.browser.findElements(this.Cells);
        this.table = [];
        for (let j = 0; j < cells.length / headrs.length; j++) {
            this.table.push([]);
            for (let i = 0; i < headrs.length; i++) {
                if (j == 0) {
                    this.table[0].push(await headrs[i].getText());
                } else {
                    this.table[j].push(await cells[headrs.length * (j - 1) + i].getText());
                }
            }
        }
        return this.table;
    }

    public async getCardListAsArray(): Promise<string[]> {
        await this.validateCardListElements();
        const cards = await this.browser.findElements(this.CardListElements);
        const cardsArr: string[] = [];
        for (let i = 0; i < cards.length; i++) {
            cardsArr.push(await cards[i].getText());
        }
        return cardsArr;
    }

    public async getCartListGridlineAsMatrix(): Promise<string[][]> {
        await this.validateCartListRowElements();
        const cartItems = await this.browser.findElements(this.CartListElements);
        const rowCount = (await cartItems[0].getText()).split('\n').length;

        this.table = [];
        for (let j = 0; j < cartItems.length; j++) {
            this.table.push([]);
            for (let i = 0; i < rowCount; i++) {
                this.table[j].push(await (await cartItems[j].getText()).split('\n')[i]);
            }
        }
        return this.table;
    }

    public async clickOnCartAddButtonByIndex(index: number): Promise<void> {
        await this.validateCartListRowElements();
        return await this.browser.click(this.CartListElementsQuantityBtn, index * 2 + 1);
    }

    public async clickOnCartRemoveButtonByIndex(index: number): Promise<void> {
        await this.validateCartListRowElements();
        return await this.browser.click(this.CartListElementsQuantityBtn, index * 2);
    }

    public async sendKysToInputListRowWebElement(index: number, inputText: string | number): Promise<void> {
        await this.validateCartListRowElements();
        await this.browser.click(this.CartListElementsQuantityInput, index);
        return await this.browser.sendKeys(this.CartListElementsQuantityInput, inputText, index);
    }

    public getPriceFromLineOfMatrix(line: string): number {
        const textArr = line.split('\n');
        for (let i = 0; i < textArr.length; i++) {
            const element = textArr[i].replace(/\s/g, '');
            if (element.startsWith('$')) {
                return Number(element.substring(1));
            }
        }
        return 0;
    }

    public getPriceFromArray(textArr: string[]): number {
        for (let i = 0; i < textArr.length; i++) {
            const element = textArr[i].replace(/\s/g, '');
            if (element.startsWith('$')) {
                return Number(element.substring(1));
            }
        }
        return 0;
    }

    public async selectSmartSearchByTitle(titleText: string): Promise<void> {
        const selectedTitle = Object.assign({}, this.SmartSearchOptions);
        selectedTitle['value'] += `[title*='${titleText}']`;
        await this.browser.click(selectedTitle);
        return;
    }

    public async selectSmartSearchCheckBoxByTitle(titleText: string): Promise<void> {
        const selectedTitle = Object.assign({}, this.SmartSearchCheckBoxOptions);
        selectedTitle['value'] += `[title*='${titleText}']`;
        await this.browser.click(selectedTitle);
        return;
    }

    public async selectSmartSearchByIndex(index: number): Promise<void> {
        await this.browser.findElements(this.SmartSearchCheckBoxOptions, 4000).then(
            async (res) => {
                if (res.length > index) {
                    await res[index].click();
                    return;
                }
                throw new Error(`Index of ${index} is out of range`);
            },
            () => {
                console.log(`Element ${this.SmartSearchCheckBoxOptions.toString()} not found`);
            },
        );
        return;
    }

    public async selectRangeOption(option: SelectSmartSearchRange): Promise<void> {
        const selectedBox = Object.assign({}, this.SmartSearchSelect);
        selectedBox['value'] += ` option[value='${option}']`;
        await this.browser.click(selectedBox);
        return;
    }

    public async selectRange(option: SelectSmartSearchRange, min: number, max?: number): Promise<void> {
        await this.selectRangeOption(option);
        await this.browser.sendKeys(this.SmartSearchNumberInputArr, min, 0);
        if (max) {
            await this.browser.sendKeys(this.SmartSearchNumberInputArr, max, 1);
        }
        await this.browser.click(this.SmartSearchCheckBoxDone);
    }
}
