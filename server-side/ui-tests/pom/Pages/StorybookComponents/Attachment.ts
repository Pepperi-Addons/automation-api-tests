import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Attachment extends StorybookComponent {
    public MainExampleHeightDiv: By = By.xpath(`//pep-attachment//mat-form-field/div/div`);
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-attachment--story-1"]');
    public MainExampleAttachment: By = By.xpath(`${this.MainExampleDiv.value}//pep-attachment//mat-form-field`);
    public MainExample_aHref: By = By.xpath(`${this.MainExampleDiv.value}//span[text()="See original"]/parent::a`);
    public MainExample_deleteButton: By = By.xpath(`${this.MainExampleDiv.value}//button[contains(@class,"delete")]`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);
    public LabelControlInput: By = By.xpath(`//textarea[@id="control-label"]`);

    public async doesAttachmentComponentFound(): Promise<void> {
        await this.doesComponentFound('attachment', 'Attachment');
    }

    public async getLabelControl(): Promise<string> {
        const label = await this.browser.findElement(this.LabelControlInput);
        return await label.getText();
    }

    public async openMainExampleSource(): Promise<string> {
        return await this.openSource(this.MainExample_aHref);
    }

    // public async openSource(selector: By, tabIndex = 2): Promise<string> {
    //     await this.browser.click(selector);
    //     await this.browser.switchToOtherTab(tabIndex);
    //     this.browser.sleep(2 * 1000);
    //     const currentUrl = await this.browser.getCurrentUrl();
    //     return currentUrl;
    // }
}
