import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class SelectPanel extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesSelectPanelComponentFound(): Promise<void> {
        await this.doesComponentFound('elect-panel', 'Select panel');
    }
}
