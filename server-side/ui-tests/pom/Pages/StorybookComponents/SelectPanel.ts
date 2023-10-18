import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class SelectPanel extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-select-panel--story-1"]');
    public MainExampleSelectPanel: By = By.xpath(`${this.MainExampleDiv.value}//pep-select-panel/div`);

    public async doesSelectPanelComponentFound(): Promise<void> {
        await this.doesComponentFound('elect-panel', 'Select panel');
    }
}
