import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Search extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesSearchComponentFound(): Promise<void> {
        await this.doesComponentFound('search', 'Search');
    }
}
