import { By, Key } from 'selenium-webdriver';
import { AddonPage } from '..';

export class StoryBookInpus extends AddonPage {
    public LabelInput: By = By.xpath(`//textarea[contains(@name,'label')]`);
    public EmptySpaceToClick: By = By.xpath(`//h1[contains(@class,'title')]`);
    public DisableToggler: By = By.xpath(`//input[contains(@name,'disabled')]`);
    public ShowTitleToggler: By = By.xpath(`//input[contains(@name,'showTitle')]`);
    public CheckBoxElements: By = By.xpath(`//table//label//input[@type='radio']`);
    public ColorValue: By = By.xpath(`//input[contains(@id,'control-value')]`);

    public async changeLabel(label: string): Promise<void> {
        await this.browser.sendKeys(this.LabelInput, Key.CONTROL + 'a' + Key.DELETE);
        await this.browser.sendKeys(this.LabelInput, label);
        await this.browser.click(this.EmptySpaceToClick);
    }

    public async toggleDissableComponent(): Promise<void> {
        await this.browser.click(this.DisableToggler);
    }

    public async toggleShowTitle(): Promise<void> {
        await this.browser.click(this.ShowTitleToggler);
    }

    public async getAllTypes() {
        const allTypes = await this.browser.findElements(this.CheckBoxElements);
        return allTypes.slice(0, 4);
    }

    public async getAllAlignments() {
        const allTypes = await this.browser.findElements(this.CheckBoxElements);
        return allTypes.slice(5);
    }

    public async setColorValue(color: string) {
        await this.browser.sendKeys(this.ColorValue, color);
        await this.browser.click(this.EmptySpaceToClick);
    }
}
