import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class DateTime extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesDateTimeComponentFound(): Promise<void> {
        await this.doesComponentFound('date-time', 'Date & date-time');
    }
}
