import { By } from "selenium-webdriver";
import { Browser } from "../../utilities/browser";
import { WebAppPage } from "../base/WebAppPage";
import { Component } from "./Base/Component";

export class PepSearch extends Component{
    /**
     *
     */
    constructor(browser: Browser) {
        super(browser);
    }
    private _searchContainer: By = By.xpath('//pep-search');

    public get SearchContainer(): By{
        return this._searchContainer;
    }

    public readonly Input: By = By.xpath(`${this.SearchContainer.value}//input`);
    public readonly SearchButton: By = By.xpath(`${this.SearchContainer.value}//*[@name='system_search']`);
    public readonly ClearSearchButton: By = By.xpath(`${this.SearchContainer.value}//*[@name='system_close']`); 

    public setSearchContainer(xpathLocator: By): void
    {
        if(!xpathLocator.using.includes('xpath')){
            throw new Error(`'${xpathLocator.using}' is not a supported locator mechanism`);
        }
        this._searchContainer = By.xpath(`${xpathLocator.value}//pep-search`);
    }

    public async enterSearch(searchText: string): Promise<void> {
        return await this.browser.findSingleElement(this.Input).sendKeys(searchText);
    }

    public async clickSearchButton(): Promise<void> {
        return await this.browser.findSingleElement(this.SearchButton).click();
    }

    public async clickClearButton(): Promise<void> {
        return await this.browser.findSingleElement(this.ClearSearchButton).click();
    }

    public async performSearch(searchText: string){
        await this.enterSearch(searchText);
        return await this.clickSearchButton();
    }


}