import { By } from 'selenium-webdriver';
import { Browser } from '../../utilities/browser';
import { Component } from './Base/Component';

export class PepSearch extends Component {
    /**
     *
     */
    private _searchContainer: By = By.xpath('//pep-search');
    constructor(browser: Browser) {
        super(browser);
    }

    public get SearchContainer(): By {
        return this._searchContainer;
    }

    public set SearchContainer(locator: By) {
        this._searchContainer = locator;
        this.Input = By.xpath(`${this.SearchContainer.value}//input`);
    }

    public Input: By = By.xpath(`${this.SearchContainer.value}//input`);
    public readonly SearchButton: By = By.xpath(`${this.SearchContainer.value}//*[@name='system_search']`);
    public readonly ClearSearchButton: By = By.xpath(`${this.SearchContainer.value}//*[@name='system_close']`);

    /**
     * Sets the component's parent container to narrow the locators. Important when the component appears multiple times.
     * @param xpathLocator The parent container's XPath locator.
     */
    public setParentContainer(xpathLocator: By): void {
        if (!xpathLocator.using.includes('xpath')) {
            throw new Error(`'${xpathLocator.using}' is not a supported locator mechanism`);
        }
        this._searchContainer = By.xpath(`${xpathLocator.value}//pep-search`);
    }

    public async enterSearch(searchText: string, xpathElem?: By): Promise<void> {
        if (xpathElem) {
            return await this.browser.findSingleElement(xpathElem).sendKeys(searchText);
        }
        return await this.browser.findSingleElement(this.Input).sendKeys(searchText);
    }

    public async clickSearchButton(): Promise<void> {
        return await this.browser.findSingleElement(this.SearchButton).click();
    }

    public async clickClearButton(): Promise<void> {
        return await this.browser.findSingleElement(this.ClearSearchButton).click();
    }

    /**
     * Enters search text and clicks the search button.
     * @param searchText The text to search for.
     */
    public async performSearch(searchText: string) {
        await this.enterSearch(searchText);
        return await this.clickSearchButton();
    }
}
