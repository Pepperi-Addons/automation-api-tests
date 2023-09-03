import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Link extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesLinkComponentFound(): Promise<void> {
        await this.doesComponentFound('link', 'Link');
    }
}
