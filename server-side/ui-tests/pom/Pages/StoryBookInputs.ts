import { By, Key } from 'selenium-webdriver';
import { AddonPage } from '..';

export class StoryBookInpus extends AddonPage {
    public InputsRow: By = By.xpath(
        `//div[contains(@class,"css")]//table//tbody//span[text()="inputs"]/ancestor::tr/following-sibling::tr`,
    );
    public InputTitle: By = By.xpath(`${this.InputsRow.value}/td[1]/span`);
    public LabelInput: By = By.xpath(`//textarea[contains(@name,'label')]`);
    public ValueInput_textarea: By = By.xpath(`//textarea[contains(@name,'value')]`);
    public ValueInput_boolean: By = By.xpath(`//input[contains(@name,'value')]`);
    public ClassNamesInput: By = By.xpath(`//textarea[contains(@name,'classNames')]`);
    public IconNameInputControl: By = By.xpath(`//select[contains(@id,'control-iconName')]`);
    public SelectOption_byText: By = By.xpath(`//option[text()="{placeholder}"]`);
    public EmptySpaceToClick: By = By.xpath(`//h1[contains(@class,'title')]`);
    public DisableToggler: By = By.xpath(`//input[contains(@name,'disabled')]`);
    public VisibleToggler: By = By.xpath(`//input[contains(@name,'visible')]`);
    public MandatoryToggler: By = By.xpath(`//input[contains(@name,'mandatory')]`);
    public ShowTitleToggler: By = By.xpath(`//input[contains(@name,'showTitle')]`);
    public RenderTitleToggler: By = By.xpath(`//input[contains(@name,'renderTitle')]`);
    public CheckBoxElements: By = By.xpath(`//table//label//input[@type='radio']`);
    public RadioButtonElements: By = By.xpath(`//label//input[@type='radio']`);
    public ColorValue: By = By.xpath(`//input[contains(@id,'control-value')]`);

    public async getInputRowSelectorByName(inputTitle: string): Promise<By> {
        return By.xpath(`${this.InputTitle.value}[text()='${inputTitle}']`);
    }

    public async changeInput(selector: By, changeTo: string): Promise<void> {
        await this.browser.sendKeys(selector, Key.CONTROL + 'a' + Key.DELETE);
        await this.browser.sendKeys(selector, changeTo);
        await this.browser.click(this.EmptySpaceToClick);
    }

    public async changeLabelControl(label: string): Promise<void> {
        await this.browser.sendKeys(this.LabelInput, Key.CONTROL + 'a' + Key.DELETE);
        await this.browser.sendKeys(this.LabelInput, label);
        await this.browser.click(this.EmptySpaceToClick);
    }

    public async changeValueControl(value: string): Promise<void> {
        await this.changeInput(this.ValueInput_textarea, value);
    }

    public async changeClassNamesControl(value: string): Promise<void> {
        await this.changeInput(this.ClassNamesInput, value);
    }

    public async toggleDisableControl(): Promise<void> {
        await this.browser.click(this.DisableToggler);
    }

    public async toggleVisibleControl(): Promise<void> {
        await this.browser.click(this.VisibleToggler);
    }

    public async toggleValueControl(): Promise<void> {
        await this.browser.click(this.ValueInput_boolean);
    }

    public async selectIconName(toSelect: string): Promise<void> {
        await this.selectByOption(this.IconNameInputControl, toSelect);
    }

    public async selectByOption(locator: By, option: string, index?: number): Promise<void> {
        this.browser.sleep(0.1 * 1000);
        this.browser.untilIsVisible(locator);
        if (index !== undefined) {
            await this.browser.click(locator, index);
        } else {
            await this.browser.click(locator);
        }
        this.browser.sleep(0.3 * 1000);
        const matOptionWithStringInjected: string = this.SelectOption_byText.value.replace('{placeholder}', option);
        await this.browser.click(By.xpath(matOptionWithStringInjected));
        return;
    }

    public async toggleMandatoryControl(): Promise<void> {
        await this.browser.click(this.MandatoryToggler);
    }

    public async toggleShowTitleControl(): Promise<void> {
        await this.browser.click(this.ShowTitleToggler);
    }

    public async toggleRenderTitleControl(): Promise<void> {
        await this.browser.click(this.RenderTitleToggler);
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

    public async getAllRadioButtons(inputName: string) {
        const iconPositionRadioButtonSelector = By.xpath(
            `//span[text()='${inputName}']/ancestor::tr${this.RadioButtonElements.value}`,
        );
        const allIconPositions = await this.browser.findElements(iconPositionRadioButtonSelector);
        return allIconPositions;
    }

    public async getAllxAlignments() {
        return await this.getAllRadioButtons('xAlignment');
    }

    public async getAllIconPositions() {
        return await this.getAllRadioButtons('iconPosition');
    }

    public async getAllSizeTypes() {
        return await this.getAllRadioButtons('sizeType');
    }

    public async getAllStyleStateTypes() {
        return await this.getAllRadioButtons('styleStateType');
    }

    public async getAllStyleTypes() {
        return await this.getAllRadioButtons('styleType');
    }

    public async getAllTypeInputValues() {
        return await this.getAllRadioButtons('type');
    }

    public async setColorValue(color: string) {
        await this.browser.sendKeys(this.ColorValue, color);
        await this.browser.click(this.EmptySpaceToClick);
    }
}
