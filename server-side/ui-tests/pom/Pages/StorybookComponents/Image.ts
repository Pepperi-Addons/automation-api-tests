import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Image extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-image--story-1"]');
    public MainExampleHeightDiv: By = By.xpath(`//pep-image`);
    public MainExampleImage: By = By.xpath(`${this.MainExampleDiv.value}//pep-files-uploader//img`);
    public MainExample_deleteButton: By = By.xpath(`${this.MainExampleDiv.value}//button[contains(@class,"delete")]`);
    public MainExampleImage_disabled: By = By.xpath(`${this.MainExampleDiv.value}//pep-date//input`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);

    public async doesImageComponentFound(): Promise<void> {
        await this.doesComponentFound('image', 'Image');
    }

    public async getImageSource(): Promise<string> {
        const imageElem = await this.browser.findElement(this.MainExampleImage);
        const imgSrc = await imageElem.getAttribute('src');
        console.info('image source (at getImageSource): ', imgSrc);
        return imgSrc;
    }
}
