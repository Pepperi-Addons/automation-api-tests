import { By } from "selenium-webdriver";
import { Browser } from "../../../utilities/browser";
import { Component } from "../../Components/Base/Component";
import { WebAppPage } from "../../Pages/base/WebAppPage";

//TODO: Create base abstract class for 'pep-side-bar' and have PageLayoutSideBar extend it.
export class PageLayoutSideBar extends Component{
    /**
     *
     */
    constructor(browser: Browser) {
        super(browser);
    }

    public static readonly SideBarContainer: By = By.css('pep-side-bar');
    public static readonly BackButton: By = By.css(`${this.SideBarContainer.value} pep-button.back-button`);

    public async goBack(): Promise<void> {
        await this.browser.click(PageLayoutSideBar.BackButton);
        await this.browser.waitForLoading(WebAppPage.LoadingSpinner);
    }
}