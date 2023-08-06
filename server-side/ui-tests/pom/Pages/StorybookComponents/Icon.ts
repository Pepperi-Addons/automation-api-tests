import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Icon extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesIconComponentFound(): Promise<void> {
        await this.isComponentFound('icon', 'Icon');
    }
}
