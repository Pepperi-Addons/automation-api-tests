import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class ImageFilmstrip extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesImageFilmstripComponentFound(): Promise<void> {
        await this.doesComponentFound('image-filmstrip', 'Image filmstrip');
    }
}
