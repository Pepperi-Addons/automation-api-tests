import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class RichHtmlTextarea extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-rich-html-textarea--story-1"]');
    public MainExampleHeightDiv: By = By.xpath(`//pep-rich-html-textarea`);
    public MainExampleRichHtmlTextarea: By = By.xpath(
        `${this.MainExampleDiv.value}//pep-rich-html-textarea//mat-form-field//textarea`,
    );

    public async doesRichHtmlTextareaComponentFound(): Promise<void> {
        await this.doesComponentFound('rich-html-textarea', 'Rich HTML textarea');
    }
}
