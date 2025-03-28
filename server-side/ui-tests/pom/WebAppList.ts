import { Browser } from '../utilities/browser';
import { Page } from './Pages/base/Page';
import config from '../../config';
import { WebElement, By, Key } from 'selenium-webdriver';
import { ConsoleColors } from '../../services/general.service';

export enum SelectSmartSearchRange {
    '=' = 1,
    '>' = 2,
    '<' = 4,
    Between = 7,
}

export class WebAppList extends Page {
    table: string[][] = [];
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public List: By = By.css('pep-list .scrollable-content');
    public Headers: By = By.css('pep-list .table-header-fieldset fieldset .header-label');
    public PencilMenu: By = By.xpath('//pep-list-actions//pep-menu');
    public ListActionsButton: By = By.xpath('//list-actions//button');
    public RadioButtons: By = By.css('pep-list .table-row-fieldset .mat-radio-button');
    public SelectAllCheckbox: By = By.css('pep-list .table-header-fieldset .mat-checkbox');
    public Cells: By = By.css('pep-list .table-row-fieldset .pep-report-fields');
    public PepGenericList_mainLayout: By = By.xpath(
        '//pep-generic-list/pep-page-layout//div[contains(@class,"main-layout")]',
    );
    public ListCardViewElement: By = By.xpath('//pep-list//virtual-scroller//pep-form//fieldset//mat-grid-list');
    public ListRowElements: By = By.css('pep-list .table-row-fieldset');
    public EmptyListElement: By = By.xpath('//pep-list//p[contains(text(),"No accounts found")]');
    public RowElementCheckBox: By = By.css('pep-list .table-row-fieldset > mat-checkbox');
    public GeneralCheckBoxValue: By = By.xpath(
        '//fieldset[contains(@class,"table-header-fieldset")]//mat-checkbox//..//input',
    );
    public GeneralCheckBoxClickable: By = By.xpath(
        '//fieldset[contains(@class,"table-header-fieldset")]//mat-checkbox',
    );
    public TotalResultsText: By = By.css('.total-items .number');
    public LinksInListArr: By = By.css('pep-internal-button a');

    public RadioButtonSelected: By = By.xpath(
        '//virtual-scroller//fieldset//input[@type="radio"]/ancestor::mat-radio-button[contains(@class,"mat-radio-checked")]',
    );
    public RowElementCheckBoxSelected: By = By.xpath(
        '//virtual-scroller//fieldset//input[@type="checkbox"][@aria-checked="true"]',
    );

    //title
    public NumberOfElementsTitle: By = By.xpath('//pep-list-total//span');
    //Addon Page
    public AddonCells: By = By.css('pep-list .table-row-fieldset');
    public AddonAddButton: By = By.css('[data-qa] [title="Add"]');

    //Card List
    public CardListElements: By = By.css('pep-list .scrollable-content > div pep-form');

    //Cart List
    public CartListElements: By = By.css('pep-list pep-form');
    public CartListElementsBtn: By = By.css('pep-form button');
    public CartListElementsQuantityBtn: By = By.css('pep-form pep-quantity-selector button');
    public CartListElementsQuantityInput: By = By.css('pep-form pep-quantity-selector input');
    public CartListElementsInternalBtn: By = By.css('pep-form pep-internal-menu button');
    public CartListElementsGridLineViewInternalBtn: By = By.css('pep-list pep-internal-button');
    public CartListGridLineHeaderItemPrice: By = By.css('label#ItemPrice');

    //Smart Search
    public SmartSearchOptions: By = By.css('app-advanced-search label');
    public SmartSearchCheckBoxBtnArr: By = By.css('.advance-search-menu li[title] input');
    public SmartSearchCheckBoxTitleArr: By = By.css('.advance-search-menu li[title] label');
    public SmartSearchCheckBoxOptions: By = By.css('.advance-search-menu li');
    public SmartSearchCheckBoxDone: By = By.css('.advance-search-menu .done');
    public SmartSearchCheckBoxClear: By = By.css('.advance-search-menu .clear');
    public SmartSearchSelect: By = By.css('.advance-search-menu .smBody select');
    public SmartSearchNumberInputArr: By = By.css(`.advance-search-menu .smBody input[type='number']`);

    //Addon List Search
    public AddonList_SearchInput: By = By.xpath('//input[@id="mat-input-1"]');
    public AddonList_SearchIconWrappingDiv: By = By.xpath('//input[@id="mat-input-1"]/parent::div/following::div');

    // Activities List
    public NoActivitiesFound_Text: By = By.xpath('//pep-list//p[contains(text(),"No activities found")]');
    public Activities_TopActivityInList_ID: By = By.xpath('//pep-form//span[@id="WrntyID"]');
    public Activities_TopActivityInList_Type: By = By.xpath('//pep-form//span[@id="Type"]');
    public Activities_TopActivityInList_Status: By = By.xpath('//pep-form//span[@id="Status"]');
    //Accounts List
    public SearchInput: By = By.xpath('//input[@id="searchInput"]');
    //Pencil Menu Options
    public PencilEditButton: By = By.xpath('//div[@role="menu"]//button[@title="Edit"]');

    public getSelectorOfActionItemUnderPencilByText(text: string) {
        return By.xpath(
            `//div[@role="menu"][contains(@id,"mat-menu-panel-")]//span[contains(text(),"${text}")]/parent::button`,
        );
    }

    public async searchInList(searchString: string): Promise<void> {
        await this.isSpinnerDone();
        await this.browser.click(this.SearchInput);
        await this.browser.sendKeys(this.SearchInput, searchString + Key.ENTER);
        await this.isSpinnerDone();
    }

    public async validateListRowElements(ms?: number): Promise<void> {
        await this.isSpinnerDone();
        return await this.validateElements(this.ListRowElements, ms);
    }

    public async validateEmptyList(ms?: number): Promise<void> {
        await this.isSpinnerDone();
        return await this.validateElements(this.EmptyListElement, ms);
    }

    public async validateCardListElements(ms?: number): Promise<void> {
        return await this.validateElements(this.CardListElements, ms);
    }

    public async validateCartListRowElements(ms?: number): Promise<void> {
        await this.isSpinnerDone();
        return await this.validateElements(this.CartListElements, ms);
    }

    public async validateElements(selector: By, ms?: number): Promise<void> {
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
        await this.isSpinnerDone();
        return await this.browser.click(this.ListRowElements, position, waitUntil);
    }

    public async clickOnCheckBoxByElementIndex(position = 0, waitUntil = 15000): Promise<void> {
        await this.isSpinnerDone();
        await this.clickOnFromListRowWebElement(position, waitUntil);
        return await this.browser.click(this.RowElementCheckBox, position, waitUntil);
    }

    public async clickOnRadioButtonByElementIndex(position = 0, waitUntil = 15000): Promise<void> {
        await this.isSpinnerDone();
        return await this.browser.click(this.RadioButtons, position, waitUntil);
    }

    public async clickOnRowByIndex(position = 0, waitUntil = 15000): Promise<void> {
        await this.isSpinnerDone();
        return await this.browser.click(this.ListRowElements, position, waitUntil);
    }

    public async clickOnFromListRowWebElementByName(textOfElement: string, waitUntil = 15000): Promise<void> {
        await this.isSpinnerDone();
        return await this.browser.ClickByText(this.ListRowElements, textOfElement, waitUntil);
    }

    public async clickOnLinkFromListRowWebElement(position = 0, waitUntil = 15000): Promise<void> {
        await this.isSpinnerDone();
        return await this.browser.click(this.LinksInListArr, position, waitUntil);
    }

    public async clickOnLinkFromListRowWebElementByText(textOfElement: string, waitUntil = 15000): Promise<void> {
        await this.isSpinnerDone();
        return await this.browser.ClickByText(this.LinksInListArr, textOfElement, waitUntil);
    }

    public async checkAllListElements() {
        await this.isSpinnerDone();
        const generalCheckbox = await this.browser.findElement(this.GeneralCheckBoxValue);
        const isChecked: boolean = (await generalCheckbox.getAttribute('aria-checked')) === 'true' ? true : false;
        if (!isChecked) {
            await this.browser.click(this.GeneralCheckBoxClickable);
        }
    }

    public async uncheckAllListElements() {
        await this.isSpinnerDone();
        const generalCheckbox = await this.browser.findElement(this.GeneralCheckBoxValue);
        const isChecked: boolean = (await generalCheckbox.getAttribute('aria-checked')) === 'true' ? true : false;
        if (isChecked) {
            await this.browser.click(this.GeneralCheckBoxClickable);
        }
    }

    public async clickOnPencilMenuButton(): Promise<void> {
        await this.isSpinnerDone();
        return await this.browser.click(this.PencilMenu);
    }

    public async clickOnListActionsButton(): Promise<void> {
        await this.isSpinnerDone();
        return await this.browser.click(this.ListActionsButton);
    }

    public async clickOnPencilMenuButtonEdit(): Promise<void> {
        await this.browser.untilIsVisible(this.PencilEditButton);
        await this.browser.click(this.PencilEditButton);
        this.browser.sleep(1000 * 3);
    }

    public async selectUnderPencilMenu(textOfActionUnderPencil: string) {
        const selector_of_action_under_pencil = this.getSelectorOfActionItemUnderPencilByText(textOfActionUnderPencil);
        try {
            await this.browser.untilIsVisible(selector_of_action_under_pencil, 500);
            await this.browser.click(selector_of_action_under_pencil);
            await this.browser.sleep(500);
        } catch (error) {
            console.info(`UNABLE TO SELECT: ${textOfActionUnderPencil}`);
            console.error(error);
        }
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

    public async getAddonListAsTable(): Promise<string[][]> {
        await this.validateListRowElements();
        const headrs = await this.browser.findElements(this.Headers);
        const cells = await this.browser.findElements(this.AddonCells);
        this.table = [];
        this.table.push([]);
        for (let i = 0; i < headrs.length; i++) {
            this.table[0].push(await headrs[i].getText());
        }
        for (let j = 0; j < cells.length; j++) {
            this.table.push([]);
            const tableRow = (await cells[j].getText()).split('\n');
            this.table[j + 1].push(tableRow[0], tableRow[1]);
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
                console.log(`%cElement ${this.SmartSearchCheckBoxOptions.toString()} not found`, ConsoleColors.Error);
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

    public async getNumOfElementsTitle() {
        return await (await this.browser.findElement(this.NumberOfElementsTitle)).getText();
    }

    public async clickEmptySpace() {
        await this.browser.click(this.NumberOfElementsTitle);
        this.browser.sleep(3 * 1000);
    }

    public async getListElementsAsArray() {
        return await this.browser.findElements(this.ListRowElements);
    }

    public async getAllListElementsTextValue() {
        const allElems = await this.getListElementsAsArray();
        const text = await Promise.all(allElems.map(async (elem) => await elem.getText()));
        return text;
    }

    public async getNumberOfElementsFromTitle() {
        const allElems = await this.getListElementsAsArray();
        const text = await Promise.all(allElems.map(async (elem) => await elem.getText()));
        return text;
    }

    public async getAllListElementTextValueByIndex(index: number) {
        const allElems = await this.getListElementsAsArray();
        const text = await Promise.all(allElems.map(async (elem) => await elem.getText()));
        return text[index];
    }

    public async searchInAddonList(textToSearch: string) {
        const search_input = await this.browser.findElement(this.AddonList_SearchInput);
        if (search_input) {
            await search_input.sendKeys(`${textToSearch}\n`);
        }
    }
}
