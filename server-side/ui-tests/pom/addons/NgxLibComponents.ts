import { By, Locator } from "selenium-webdriver";
import { AddonPage, WebAppSettingsSidePanel } from "..";

export class NgxLibComponents extends AddonPage {

    public changeStyleButton: Locator = By.css('[data-qa="style change btn"]');
    public componentButton: Locator = By.css('[data-qa="componentBtn"]');

    /**
     *
     * 
     */
    public async gotoNgxAddon(): Promise<void> {
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('NGX-Lib-Automation');
        await this.browser.click(webAppSettingsSidePanel.ObjectEditorNGX);
        this.browser.sleep(2000);
        await this.isSpinnerDone();
        return;
    }

    /**
     *
     * 
     */
    public async changeStyle(): Promise<void> {
        await this.browser.click(this.changeStyleButton);
        this.browser.sleep(2500);
    }

    /**
     *
     * 
     */
    public async clickComponent(): Promise<void> {
        await this.browser.click(this.componentButton);
        this.browser.sleep(2500);
    }

    /**
     *
     * 
     */
    public async getComponentName(): Promise<string> {
        const componentElement = await this.browser.findElement(this.componentButton);
        return componentElement.getText();
    }
}