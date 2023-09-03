import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Select extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesSelectComponentFound(): Promise<void> {
        await this.doesComponentFound('select', 'Select');
    }
}
