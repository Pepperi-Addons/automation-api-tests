import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Link extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-link--story-1"]');
    public MainExampleLink: By = By.xpath(`${this.MainExampleDiv.value}//pep-link//mat-form-field`);
    public MainExampleLink_value: By = By.xpath(`${this.MainExampleLink.value}//input`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);

    public async doesLinkComponentFound(): Promise<void> {
        await this.doesComponentFound('link', 'Link');
    }

    public async getMainExampleLinkValue(): Promise<string> {
        const dateString = await (await this.browser.findElement(this.MainExampleLink_value)).getAttribute('value');
        return dateString.trim();
    }
}
