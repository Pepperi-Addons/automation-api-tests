import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Attachment extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesAttachmentComponentFound(): Promise<void> {
        await this.doesComponentFound('attachment', 'Attachment');
    }
}