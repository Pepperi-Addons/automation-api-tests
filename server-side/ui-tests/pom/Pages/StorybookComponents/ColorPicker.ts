import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class ColorPicker extends StorybookComponent {
    public Component: By = By.xpath(`//div[contains(@id,'color-picker')]//div[contains(@id,'color-picker')]`);
    public ComponentLabel: By = By.xpath(`(//div[contains(@id,'color-picker')]//pep-field-title//mat-label)[1]`);
    public ComponentLabelTxtAlign: By = By.xpath(`//div[contains(@id,'color-picker')]//pep-field-title//div`);
    public IframeElement: By = By.xpath(`//iframe`);
    public PenIcon: By = By.xpath(`//mat-icon//pep-icon[contains(@name,'system_edit')]`);
    public ComponentColor: By = By.xpath(`//div[contains(@class,'pep-color pep-input one-row')]`);
    //color picker modal
    public ChangeHueTitle: By = By.xpath(`//mat-label[@title="Change hue"]`);
    public HueSilder: By = By.xpath(`(//mat-slider)[1]`);
    public ChangeSaturationTitle: By = By.xpath(`//mat-label[@title="Change saturation"]`);
    public SaturationSilder: By = By.xpath(`(//mat-slider)[2]`);
    public ChangeLightnessTitle: By = By.xpath(`//mat-label[@title="Change lightness"]`);
    public LightnessSilder: By = By.xpath(`(//mat-slider)[3]`);
    public OrAddTitle: By = By.xpath(`//mat-label[@title="Or add (hsl, reg, hex)"]`);
    public OrAddBox: By = By.xpath(`//mat-form-field`);
    public AACompilantTitle: By = By.xpath(`//mat-label[@title="AA Compliant"]`);
    public AACompilantBox: By = By.xpath(`//div[@class='color-complient']`);
    public CurrentColorBox: By = By.xpath(`//div[@class='current-color']`);
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);
    //
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

    public async isModalFullyShown(): Promise<boolean> {
        //hue
        const isHueTitleShown = await this.browser.untilIsVisible(this.ChangeHueTitle);
        const isHueSliderShown = await this.browser.untilIsVisible(this.HueSilder);
        //saturation
        const isSaturationTitleShown = await this.browser.untilIsVisible(this.ChangeSaturationTitle);
        const isSaturationSliderShown = await this.browser.untilIsVisible(this.SaturationSilder);
        //lightness
        const isLightnessTitleShown = await this.browser.untilIsVisible(this.ChangeLightnessTitle);
        const isLightnessSliderShown = await this.browser.untilIsVisible(this.LightnessSilder);
        //or add
        const isOrAddTitleShown = await this.browser.untilIsVisible(this.OrAddTitle);
        const isOrAddBoxShown = await this.browser.untilIsVisible(this.OrAddBox);
        //AA compliant
        const isAACompTilehown = await this.browser.untilIsVisible(this.AACompilantTitle);
        const isACompTileBoxShown = await this.browser.untilIsVisible(this.AACompilantBox);
        //color box
        const isCurrentColorBoxShown = await this.browser.untilIsVisible(this.CurrentColorBox);
        return (
            isHueTitleShown &&
            isHueSliderShown &&
            isSaturationTitleShown &&
            isSaturationSliderShown &&
            isLightnessTitleShown &&
            isLightnessSliderShown &&
            isOrAddTitleShown &&
            isOrAddBoxShown &&
            isAACompTilehown &&
            isACompTileBoxShown &&
            isCurrentColorBoxShown
        );
    }

    public async okModal(): Promise<void> {
        await this.browser.click(this.ModalOKBtn);
    }

    public async isPenIconFound(): Promise<boolean> {
        const penIcon = await this.browser.findElement(this.PenIcon);
        const penIconStyle = await penIcon.getAttribute('style');
        return penIconStyle.includes('transparent');
    }

    public async testComponentModal() {
        await this.openComonentModal();
        const isComponentModalFullyShown = await this.isModalFullyShown();
        await this.okModal();
        return isComponentModalFullyShown;
    }

    public async getComponentColor() {
        const colorElement = await this.browser.findElement(this.ComponentColor);
        const componentStyle = await colorElement.getAttribute('style');
        const indexOfP1 = componentStyle.indexOf('(');
        const indexOfP2 = componentStyle.indexOf(')');
        return componentStyle.substring(indexOfP1, indexOfP2 + 1);
    }

    public async doesColorPickerComponentFound(): Promise<void> {
        await this.doesComponentFound('color-picker', 'Color picker');
    }
}
