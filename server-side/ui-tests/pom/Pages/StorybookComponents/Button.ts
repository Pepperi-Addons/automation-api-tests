import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Button extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);
    //

    public async okModal(): Promise<void> {
        await this.browser.click(this.ModalOKBtn);
    }
}
