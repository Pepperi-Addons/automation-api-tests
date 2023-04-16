import { By } from 'selenium-webdriver';
import { AddonPage } from '../..';

export class ColorPicker extends AddonPage {
    //should this extend 'page'? maybe create Component base class

    public Component: By = By.xpath(`//div[contains(@id,'color-picker')]//div[contains(@id,'color-picker')]`);
    public IframeElement: By = By.xpath(`//iframe`);
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
}
