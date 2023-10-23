import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class ImageFilmstrip extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-image-filmstrip--story-1"]');
    public MainExampleImageFilmstrip: By = By.xpath(`${this.MainExampleDiv.value}//gallery-image/div`);
    public MainExampleHeightDiv: By = By.xpath(`//pep-images-filmstrip`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);

    public async doesImageFilmstripComponentFound(): Promise<void> {
        await this.doesComponentFound('image-filmstrip', 'Image filmstrip');
    }

    public async getMainExampleImageFilmstripValue(): Promise<string> {
        const image = await (await this.browser.findElement(this.MainExampleImageFilmstrip)).getAttribute('style');
        const backgroundImage = image.split('background-image:')[1];
        return backgroundImage.trim();
    }
}
