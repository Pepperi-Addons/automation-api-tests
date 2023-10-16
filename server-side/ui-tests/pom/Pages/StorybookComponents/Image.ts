import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Image extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);
    public MainExampleHeightDiv: By = By.xpath(`//pep-image`);

    public async doesImageComponentFound(): Promise<void> {
        await this.doesComponentFound('image', 'Image');
    }
}
