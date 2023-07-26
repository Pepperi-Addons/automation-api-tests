import { By } from 'selenium-webdriver';
import { AddonPage } from '../../..';

export class StorybookComponent extends AddonPage {
    public Component: By = By.xpath(`//div[contains(@id,'color-picker')]//div[contains(@id,'color-picker')]`);
    public ComponentLabel: By = By.xpath(`(//div[contains(@id,'color-picker')]//pep-field-title//mat-label)[1]`);
    public ComponentLabelTxtAlign: By = By.xpath(`//div[contains(@id,'color-picker')]//pep-field-title//div`);
    public IframeElement: By = By.xpath(`//iframe`);

    public async isComponentFound(): Promise<boolean> {
        await this.browser.switchTo(this.IframeElement);
        return (
            (await this.browser.isElementLocated(this.Component)) &&
            (await this.browser.isElementVisible(this.Component))
        );
    }

    public async openComonentModal(): Promise<void> {
        await this.browser.click(this.Component);
        this.browser.sleep(4000);
    }

    public async getLabel(): Promise<string> {
        const label = await this.browser.findElement(this.ComponentLabel);
        return await label.getText();
    }

    public async getComponentTxtAlignment() {
        const txtAlignComp = await this.browser.findElement(this.ComponentLabelTxtAlign);
        const txtAlignVal = (await txtAlignComp.getAttribute('style')).split(':')[1];
        return txtAlignVal;
    }

    public async getAllStories() {
        const allStories = await this.browser.findElements(this.Component);
        return allStories.slice(1);
    }
}
