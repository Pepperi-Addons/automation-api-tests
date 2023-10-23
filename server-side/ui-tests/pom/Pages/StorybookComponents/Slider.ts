import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Slider extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-slider--story-1"]');
    public MainExampleSlider: By = By.xpath(`${this.MainExampleDiv.value}//pep-slider//mat-slider`);

    public async doesSliderComponentFound(): Promise<void> {
        await this.doesComponentFound('slider', 'Slider');
    }

    public async getMainExampleSliderValue(): Promise<string> {
        const inputValue = await (await this.browser.findElement(this.MainExampleSlider)).getAttribute('aria-valuenow');
        return inputValue.trim();
    }
}
