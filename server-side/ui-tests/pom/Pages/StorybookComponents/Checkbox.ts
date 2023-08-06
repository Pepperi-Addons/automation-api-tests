import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Checkbox extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesCheckboxComponentFound(): Promise<void> {
        await this.doesComponentFound('checkbox', 'Checkbox');
    }
}
