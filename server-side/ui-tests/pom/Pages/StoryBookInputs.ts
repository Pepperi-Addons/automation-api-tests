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
    public RenderErrorToggler: By = By.xpath(`//input[contains(@id,'control-renderError')]`);
    public RenderSymbolToggler: By = By.xpath(`//input[contains(@id,'control-renderSymbol')]`);
    public ReadonlyToggler: By = By.xpath(`//input[contains(@id,'control-readonly')]`);
    public MaxFieldCharactersInputControl: By = By.xpath(`//input[contains(@id,'control-maxFieldCharacters')]`);
    public ItemsRawTextareaControl: By = By.xpath(`//textarea[contains(@id,'control-items')]`);
    public ColorValue: By = By.xpath(`//input[contains(@id,'control-value')]`);
    public TxtColorValue: By = By.xpath(`//input[contains(@id,'control-textColor')]`);
    public ToggableInput_label: By = By.xpath(`/parent::label`);
    public CheckBoxElements: By = By.xpath(`//table//label//input[@type='radio']`);
    public RadioButtonElements: By = By.xpath(`//label//input[@type='radio']`);
    public ControlTd: By = By.xpath(`/td[4]`);
    public ItemsInput_span: By = By.xpath(`/div/div/div/span[2]`);
    public ItemsInput_RAW_button: By = By.xpath(`${this.ControlTd.value}//button`);

    public async getInputRowSelectorByName(inputTitle: string): Promise<By> {
        return By.xpath(`${this.InputTitle.value}[text()='${inputTitle}']/ancestor::tr`);
    }

    public async changeInput(selector: By, changeTo: string | number): Promise<void> {
        await this.browser.sendKeys(selector, Key.CONTROL + 'a' + Key.DELETE);
        await this.browser.sendKeys(selector, changeTo);
        await this.browser.click(this.EmptySpaceToClick);
    }

    public async changeLabelControl(label: string): Promise<void> {
        await this.browser.sendKeys(this.LabelInput, Key.CONTROL + 'a' + Key.DELETE);
        await this.browser.sendKeys(this.LabelInput, label);
        await this.browser.click(this.EmptySpaceToClick);
    }

    public async changeValueControl(value: string | number): Promise<void> {
        await this.changeInput(this.ValueInput_textarea, value);
    }

    public async changeClassNamesControl(value: string): Promise<void> {
        await this.changeInput(this.ClassNamesInput, value);
    }

    public async changeMaxFieldCharactersControl(value: number): Promise<void> {
        await this.changeInput(this.MaxFieldCharactersInputControl, value);
    }

    public async changeItemsControl(value: string): Promise<void> {
        await this.changeInput(this.ItemsRawTextareaControl, value);
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

    public async toggleRenderErrorControl(): Promise<void> {
        await this.browser.click(this.RenderErrorToggler);
    }

    public async toggleRenderSymbolControl(): Promise<void> {
        await this.browser.click(this.RenderSymbolToggler);
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

    public async toggleReadonlyControl(): Promise<void> {
        await this.browser.click(this.ReadonlyToggler);
    }

    public async toggleItemsControlRawButton(): Promise<void> {
        const selector: By = By.xpath(
            `${(await this.getInputRowSelectorByName('items')).value}${this.ItemsInput_RAW_button.value}`,
        );
        await this.browser.click(selector);
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

    public async getItemsControlContent(): Promise<any> {
        const selector: By = By.xpath(
            `${(await this.getInputRowSelectorByName('items')).value}${this.ControlTd.value}${
                this.ItemsInput_span.value
            }`,
        );
        const itemsInputControl_valueElement = await this.browser.findElement(selector);
        const itemsInputControl_valueElement_innerHTML = await itemsInputControl_valueElement.getAttribute('innerHTML');
        console.info(
            'at getItemsControlContent -> await itemsInputControl_valueElement.getAttribute("innerHTML"): ',
            itemsInputControl_valueElement_innerHTML,
        );
        return itemsInputControl_valueElement_innerHTML;
    }

    public async setColorValue(color: string) {
        await this.browser.sendKeys(this.ColorValue, color);
        await this.browser.click(this.EmptySpaceToClick);
    }

    public async setTxtColorValue(color: string) {
        await this.browser.sendKeys(this.TxtColorValue, color);
        await this.browser.click(this.EmptySpaceToClick);
    }

    public async getTogglerStateByInputName(
        inputName:
            | 'Disable'
            | 'Visible'
            | 'Mandatory'
            | 'ShowTitle'
            | 'RenderTitle'
            | 'RenderError'
            | 'RenderSymbol'
            | 'Readonly',
    ): Promise<boolean | Error> {
        const inputTogglerSelector = this[`${inputName}Toggler`];
        const togglerLabelSelector = By.xpath(`${inputTogglerSelector.value}${this.ToggableInput_label.value}`);
        const inputControlLabel = await this.browser.findElement(togglerLabelSelector);
        const labelText = await inputControlLabel.getAttribute('title');
        let statusTextIndicator;
        try {
            statusTextIndicator = labelText.split('Change to ')[1];
        } catch (error) {
            const theError = error as Error;
            return theError;
        }
        if (statusTextIndicator === 'false') {
            return true;
        }
        if (statusTextIndicator === 'true') {
            return false;
        }
        throw new Error(`expected text is not 'true' or 'false' but: '${statusTextIndicator}'`);
    }
}
