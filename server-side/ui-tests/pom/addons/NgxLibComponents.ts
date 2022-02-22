import { By, IRectangle, Locator, WebElement } from "selenium-webdriver";
import { AddonPage, WebAppSettingsSidePanel } from "..";

export class NgxLibComponents extends AddonPage {

    public changeStyleButton: Locator = By.css('[data-qa="style change btn"]');
    public componentButton: Locator = By.css('[data-qa="componentBtn"]');
    public autoData: Locator = By.css('[data-qa="auto-data"]');
    public disableButtonBtn: Locator = By.css('[data-qa="dis-comp"]');
    public visibilityOfButtonBtn: Locator = By.css('[data-qa="vis-comp"]');
    public insideButton: Locator = By.css("[data-qa='componentBtn'] > button");




    /**
     * goto NGX - lib page from homepage
     */
    public async gotoNgxAddon(): Promise<void> {
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('NGX-Lib-Automation');
        await this.browser.click(webAppSettingsSidePanel.ObjectEditorNGX);
        this.browser.sleep(2000);
        await this.isSpinnerDone();
        this.browser.sleep(2200);
        return;
    }

    /**
     * change the configuration of the element
     */
    public async changeStyle(): Promise<void> {
        await this.browser.click(this.changeStyleButton);
        this.browser.sleep(2000);
    }

    /**
     * click the button component
     */
    public async clickComponent(): Promise<void> {
        await this.browser.click(this.componentButton);
        this.browser.sleep(1500);
    }

    /**
     * returns all classes from the inside element 
     */
    public async getInsideBtnClasses(): Promise<string> {
        return await (await this.browser.findElement(this.insideButton)).getAttribute("class");
    }

    /**
    * returns all the expected data shown on the page
    */
    public async getExpectedData(): Promise<string> {
        return await (await this.browser.findElement(this.autoData)).getText();
    }

    /**
    * returns whether this component is icon component
    */
    public async isComponentWithIcon(): Promise<boolean> {
        const expectedDataLength: number = (await this.getExpectedData()).split(' ').length;
        return expectedDataLength === 6;
    }

    /**
    * returns whether this component is icon component
    */
    public async areAllClassesIncluded(): Promise<boolean> {
        const insideButtonComponentActualClasses = await this.getInsideBtnClasses();
        const expectedComponentClasses = await this.getExpectedData();
        for (let i = 0; i < 3; i++) {
            if (!insideButtonComponentActualClasses.includes(expectedComponentClasses[i])) {
                return false;
            }
        }
        return true;
    }

    /**
   *
   * 
   */
    public async isComponentVisibale(): Promise<boolean> {
        let isVis: boolean = true;
        try {
            isVis = await this.browser.untilIsVisible(this.componentButton);
        } catch (e: any) {
            if (e.message.includes(`'[data-qa="componentBtn"]', The test must end, The element is not visible`)) {
                isVis = false;
            }
        }
        return isVis;
    }

    /**
    *
    * 
    */
    public async getIconNameOutOfExpectedData(): Promise<string> {
        const expectedComponentClassesSplited: string[] = (await (this.getExpectedData())).split(' ');
        return expectedComponentClassesSplited[expectedComponentClassesSplited.length - 3];
    }

    /**
     *
     * 
     */
    public async getComponentData(): Promise<string> {
        const componentElement = await this.browser.findElement(this.autoData);
        return componentElement.getText();
    }

    /**
     *
     * 
     */
    public async getActualComponentSize(): Promise<IRectangle> {
        const btnComp: WebElement = await this.browser.findElement(this.componentButton);
        return await btnComp.getRect();
    }

    /**
     *
     * 
     */
    public async getExpectedComponentSize(): Promise<IRectangle> {
        const expectedComponentClassesSplited: string[] = (await (this.getExpectedData())).split(' ');
        const expectedH = expectedComponentClassesSplited[expectedComponentClassesSplited.length - 2].split('x')[0];
        const expectedW = expectedComponentClassesSplited[expectedComponentClassesSplited.length - 2].split('x')[1];
        return { height: parseInt(expectedH), width: parseInt(expectedW), x: 0, y: 0 } as IRectangle;
    }

    /**
    *
    * 
    */
    public async getActualBgColor(): Promise<string> {
        return await (await this.browser.findElement(this.insideButton)).getCssValue("background-color");
    }

    /**
   *
   * 
   */
    public async getExpectedBgColor(index: number): Promise<string> {
        const expectedComponentClassesSplited: string[] = (await (this.getExpectedData())).split(' ');
        return expectedComponentClassesSplited[expectedComponentClassesSplited.length - 1].split(';')[index].replace(/,/g, ", ");
    }

    /**
   *
   * 
   */
    public async disableBtn(): Promise<void> {
        await this.browser.click(this.disableButtonBtn);
        this.browser.sleep(1500);
    }

    /**
  *
  * 
  */
    public async changeVisibilityOfBtn(): Promise<void> {
        await this.browser.click(this.visibilityOfButtonBtn);
        this.browser.sleep(1500);
    }
}