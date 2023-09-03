import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Separator extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesSeparatorComponentFound(): Promise<void> {
        await this.doesComponentFound('separator', 'Separator');
    }
}
