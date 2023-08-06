import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Textarea extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesTextareaComponentFound(): Promise<void> {
        await this.doesComponentFound('textarea', 'Textarea');
    }
}
