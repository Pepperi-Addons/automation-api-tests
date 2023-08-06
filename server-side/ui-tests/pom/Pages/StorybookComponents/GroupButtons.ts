import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class GroupButtons extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesGroupButtonsComponentFound(): Promise<void> {
        await this.doesComponentFound('group-buttons', 'Group buttons');
    }
}
