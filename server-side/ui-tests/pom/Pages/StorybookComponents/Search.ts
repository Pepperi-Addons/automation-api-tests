import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Search extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-search--story-1"]');
    public MainExampleSearch: By = By.xpath(`${this.MainExampleDiv.value}//pep-files-uploader//img`);
    public MainExampleSearch_value: By = By.xpath(`${this.MainExampleDiv.value}//pep-search//input`);

    public async doesSearchComponentFound(): Promise<void> {
        await this.doesComponentFound('search', 'Search');
    }

    public async getMainExampleSearchValue(): Promise<string> {
        const label = await (await this.browser.findElement(this.MainExampleSearch_value)).getAttribute('value');
        return label.trim();
    }
}
