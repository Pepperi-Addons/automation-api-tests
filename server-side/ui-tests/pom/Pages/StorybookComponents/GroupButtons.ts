import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class GroupButtons extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-group-buttons--story-1"]');
    public MainExampleGroupButtons: By = By.xpath(`${this.MainExampleDiv.value}//pep-group-buttons`);
    public MainExampleGroupButtons_singleButton: By = By.xpath(`${this.MainExampleGroupButtons.value}//button`);

    public async doesGroupButtonsComponentFound(): Promise<void> {
        await this.doesComponentFound('group-buttons', 'Group buttons');
    }
}
