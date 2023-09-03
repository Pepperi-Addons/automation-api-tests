import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Textbox extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesTextboxComponentFound(): Promise<void> {
        await this.doesComponentFound('textbox', 'Textbox');
    }
}
