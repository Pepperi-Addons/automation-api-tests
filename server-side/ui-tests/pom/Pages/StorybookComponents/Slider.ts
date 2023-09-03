import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Slider extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesSliderComponentFound(): Promise<void> {
        await this.doesComponentFound('slider', 'Slider');
    }
}
