import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Signature extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-signature--story-1"]');
    public MainExampleHeightDiv: By = By.xpath(`//pep-signature`);
    public MainExample_image: By = By.xpath(`${this.MainExampleDiv.value}//pep-signature//img`);
    public MainExample_imagePopup: By = By.xpath(`//pep-dialog`);
    public MainExample_imagePopup_closeButton: By = By.xpath(`//pep-dialog//button[contains(@class,"dialog-close")]`);
    public MainExample_deleteButton: By = By.xpath(`${this.MainExampleDiv.value}//button[contains(@class,"delete")]`);
    public MainExampleSignature: By = By.xpath(
        `${this.MainExampleDiv.value}//pep-signature//img/parent::div/parent::div`,
    );

    public async doesSignatureComponentFound(): Promise<void> {
        await this.doesComponentFound('signature', 'Signature');
    }

    public async getImageSource(): Promise<string> {
        const imageElem = await this.browser.findElement(this.MainExample_image);
        const imgSrc = await imageElem.getAttribute('src');
        console.info('image source (at getImageSource): ', imgSrc);
        if (await this.browser.isElementVisible(this.MainExample_imagePopup)) {
            await this.browser.click(this.MainExample_imagePopup_closeButton);
        }
        return imgSrc;
    }
}
