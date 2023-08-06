import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Menu extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesMenuComponentFound(): Promise<void> {
        await this.doesComponentFound('menu', 'Menu');
    }
}
