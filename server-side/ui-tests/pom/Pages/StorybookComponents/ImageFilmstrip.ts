import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class ImageFilmstrip extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-image-filmstrip--story-1"]');
    public MainExampleImageFilmstrip: By = By.xpath(`${this.MainExampleDiv.value}//gallery-image/div`);
    public MainExampleHeightDiv: By = By.xpath(`//pep-images-filmstrip`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);
    public MainExampleGalleryThumbs: By = By.xpath(
        `${this.MainExampleDiv.value}${this.MainExampleHeightDiv.value}//gallery-thumbs`,
    );
    public MainExample_singleThumb: By = By.xpath(`${this.MainExampleGalleryThumbs.value}//gallery-thumb`);
    public MainExample_pepTitle: By = By.xpath(
        `${this.MainExampleDiv.value}//pep-images-filmstrip${this.PepTitle.value}`,
    );

    public async doesImageFilmstripComponentFound(): Promise<void> {
        await this.doesComponentFound('image-filmstrip', 'Image filmstrip');
    }

    public async getMainExampleImageFilmstripValue(): Promise<string> {
        const image = await (await this.browser.findElement(this.MainExampleImageFilmstrip)).getAttribute('style');
        const backgroundImage = image.split('background-image:')[1];
        return backgroundImage.trim();
    }
}
