import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class RichHtmlTextarea extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-rich-html-textarea--story-1"]');
    public MainExampleHeightDiv: By = By.xpath(`//pep-rich-html-textarea`);
    public MainExampleRichHtmlTextarea: By = By.xpath(
        `${this.MainExampleDiv.value}//pep-rich-html-textarea//mat-form-field`,
    );
    public MainExampleRichHtmlTextarea_button: By = By.xpath(
        `${this.MainExampleRichHtmlTextarea.value}//pep-textbox-icon//button`,
    );
    public MainExample_PopupDialog_container: By = By.xpath(`//mat-dialog-container`);
    public MainExample_PopupDialog_readOnly: By = By.xpath(
        `${this.MainExample_PopupDialog_container.value}//div[@pep-dialog-content]`,
    );
    public MainExample_PopupDialog_editMode: By = By.xpath(
        `${this.MainExample_PopupDialog_container.value}//quill-editor`,
    );
    public MainExample_PopupDialog_wrapperContainer: By = By.xpath(`//div[contains(@class,"cdk-overlay-container")]`);
    public MainExample_PopupDialog_closeButton: By = By.xpath(
        `${this.MainExample_PopupDialog_container.value}//pep-icon[@name="system_close"]/ancestor::button`,
    );
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);

    public async doesRichHtmlTextareaComponentFound(): Promise<void> {
        await this.doesComponentFound('rich-html-textarea', 'Rich HTML textarea');
    }
}
