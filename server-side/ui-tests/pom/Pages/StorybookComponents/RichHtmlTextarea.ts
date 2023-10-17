import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class RichHtmlTextarea extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);
    public MainExampleHeightDiv: By = By.xpath(`//pep-rich-html-textarea`);

    public async doesRichHtmlTextareaComponentFound(): Promise<void> {
        await this.doesComponentFound('rich-html-textarea', 'Rich HTML textarea');
    }
}
