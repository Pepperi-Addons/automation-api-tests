import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Textarea extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-textarea--story-1"]');
    public MainExampleHeightDiv: By = By.xpath(`//pep-textarea`);
    public MainExampleTextarea: By = By.xpath(`${this.MainExampleDiv.value}//pep-textarea//textarea`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);

    public async doesTextareaComponentFound(): Promise<void> {
        await this.doesComponentFound('textarea', 'Textarea');
    }
}
