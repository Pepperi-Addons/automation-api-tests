import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Chips extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesChipsComponentFound(): Promise<void> {
        await this.doesComponentFound('chips', 'Chips');
    }
}
