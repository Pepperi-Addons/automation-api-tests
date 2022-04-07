import { By } from "selenium-webdriver";
import { Browser } from "../../../utilities/browser";
import { PageLayoutSideBar } from "./PageLayoutSideBar";

export class PageBlockEditorSideBar extends PageLayoutSideBar{
    /**
     *
     */
    constructor(private sideBarTitle: string, browser: Browser) {
        super(browser);
        this.Title = sideBarTitle;
    }

    public readonly Title: string;
    public readonly SideBarTitle: By = By.css(`${PageLayoutSideBar.BackButton.value} ~ ['${this.sideBarTitle}']`);

    public async exitBlockEditorMode(){
        const titleDisplayed = await this.isTitleDisplayed(true);
        if(!titleDisplayed){
            throw new Error(`PageBlock Editor's title ${this.SideBarTitle.value} was not visible`);
        }
        return await this.goBack();
    }

    public async isTitleDisplayed(suppressLog: boolean = false): Promise<boolean>{
        return await this.browser.isElementVisible(this.SideBarTitle);
    }
}