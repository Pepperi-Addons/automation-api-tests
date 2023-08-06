import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Button extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesButtonComponentFound(): Promise<void> {
        await this.doesComponentFound('button', 'Button');
    }
}
