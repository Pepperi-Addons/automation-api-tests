import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class DateTime extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-date-date-time--story-1"]');
    public MainExampleDateTime: By = By.xpath(`${this.MainExampleDiv.value}//pep-date//input`);

    public async doesDateTimeComponentFound(): Promise<void> {
        await this.doesComponentFound('date-time', 'Date & date-time');
    }
}
