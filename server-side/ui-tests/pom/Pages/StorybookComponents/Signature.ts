import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Signature extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesSignatureComponentFound(): Promise<void> {
        await this.doesComponentFound('signature', 'Signature');
    }
}
