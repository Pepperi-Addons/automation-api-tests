import { By, Key } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Attachment extends StorybookComponent {
    public MainExampleHeightDiv: By = By.xpath(`//pep-attachment//mat-form-field/div/div`);
    public MainExample_aHref: By = By.xpath(
        `//div[@id="story--components-attachment--story-1"]//span[text()="See original"]/parent::a`,
    );
    public RowSpanControlInput: By = By.xpath(`//input[@id="control-rowSpan"]`);
    public LabelControlInput: By = By.xpath(`//textarea[@id="control-label"]`);
    public SrcControlInput: By = By.xpath(`//textarea[@id="control-src"]`);

    public async doesAttachmentComponentFound(): Promise<void> {
        await this.doesComponentFound('attachment', 'Attachment');
    }

    public async changeRowSpanControl(toNum: number): Promise<void> {
        await this.browser.sendKeys(this.RowSpanControlInput, Key.CONTROL + 'a' + Key.DELETE);
        await this.browser.sendKeys(this.RowSpanControlInput, toNum + Key.ENTER);
        this.browser.sleep(0.5 * 1000);
    }

    public async getLabel(): Promise<string> {
        const label = await this.browser.findElement(this.LabelControlInput);
        return await label.getText();
    }

    public async openMainExampleSource(): Promise<string> {
        return await this.openSource(this.MainExample_aHref);
    }

    public async openSource(selector: By, tabIndex = 2): Promise<string> {
        await this.browser.click(selector);
        await this.browser.switchToOtherTab(tabIndex);
        this.browser.sleep(2 * 1000);
        const currentUrl = await this.browser.getCurrentUrl();
        return currentUrl;
    }

    public async changeSrcControl(src: string): Promise<void> {
        this.browser.sleep(0.1 * 1000);
        await this.browser.sendKeys(this.SrcControlInput, Key.CONTROL + 'a' + Key.DELETE);
        // this.browser.sleep(0.1 * 1000);
        await this.browser.sendKeys(this.SrcControlInput, src);
        // this.browser.sleep(0.1 * 1000);
        // const mainExampleSelector = By.xpath(this.MainExample_BigBoxDiv.value.replace('{placeholder}','attachment'))
        // await this.browser.click(mainExampleSelector);
        await this.browser.click(this.DocsDiv);
        // this.browser.sleep(0.1 * 1000);
    }
}
