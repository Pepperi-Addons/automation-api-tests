import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class ImageFilmstrip extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-image-filmstrip--story-1"]');
    public MainExampleHeightDiv: By = By.xpath(`//pep-images-filmstrip`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);

    public async doesImageFilmstripComponentFound(): Promise<void> {
        await this.doesComponentFound('image-filmstrip', 'Image filmstrip');
    }
}
