import { By, Key } from 'selenium-webdriver';
import { AddonPage } from '..';

export class StoryBookInpus extends AddonPage {
    public LabelInput: By = By.xpath(`//textarea[contains(@name,'label')]`);
    public ValueInput: By = By.xpath(`//textarea[contains(@name,'value')]`);
    public ClassNamesInput: By = By.xpath(`//textarea[contains(@name,'classNames')]`);
    public EmptySpaceToClick: By = By.xpath(`//h1[contains(@class,'title')]`);
    public DisableToggler: By = By.xpath(`//input[contains(@name,'disabled')]`);
    public MandatoryToggler: By = By.xpath(`//input[contains(@name,'mandatory')]`);
    public ShowTitleToggler: By = By.xpath(`//input[contains(@name,'showTitle')]`);
    public CheckBoxElements: By = By.xpath(`//table//label//input[@type='radio']`);
    public ColorValue: By = By.xpath(`//input[contains(@id,'control-value')]`);

    public async changeInput(selector: By, changeTo: string): Promise<void> {
        await this.browser.sendKeys(selector, Key.CONTROL + 'a' + Key.DELETE);
        await this.browser.sendKeys(selector, changeTo);
        await this.browser.click(this.EmptySpaceToClick);
    }

    public async changeLabel(label: string): Promise<void> {
        await this.browser.sendKeys(this.LabelInput, Key.CONTROL + 'a' + Key.DELETE);
        await this.browser.sendKeys(this.LabelInput, label);
        await this.browser.click(this.EmptySpaceToClick);
    }

    public async changeValue(value: string): Promise<void> {
        await this.changeInput(this.ValueInput, value);
    }

    public async changeClassNames(value: string): Promise<void> {
        await this.changeInput(this.ClassNamesInput, value);
    }

    public async toggleDissableComponent(): Promise<void> {
        await this.browser.click(this.DisableToggler);
    }

    public async toggleMandatoryComponent(): Promise<void> {
        await this.browser.click(this.MandatoryToggler);
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
        // return allTypes.slice(5);
        return allTypes;
    }

    public async setColorValue(color: string) {
        await this.browser.sendKeys(this.ColorValue, color);
        await this.browser.click(this.EmptySpaceToClick);
    }
}
