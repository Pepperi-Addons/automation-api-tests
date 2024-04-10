import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class QueryBuilder extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesQueryBuilderComponentFound(): Promise<void> {
        await this.doesComponentFound('query-builder', 'Query builder');
    }
}
