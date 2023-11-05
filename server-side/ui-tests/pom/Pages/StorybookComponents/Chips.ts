import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Chips extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-chips--story-1"]');
    // public MainExampleChips: By = By.xpath(`${this.MainExampleDiv.value}//mat-chip`);
    public MainExampleChips: By = By.xpath(`${this.MainExampleDiv.value}//pep-chips`);
    public MainExampleChips_singleChip: By = By.xpath(`${this.MainExampleChips.value}//mat-chip`);
    public MainExampleChips_input: By = By.xpath(`${this.MainExampleChips.value}/div/input`);
    public MainExampleChips_select: By = By.xpath(`${this.MainExampleChips.value}/div/pep-button`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);
    public MainExample_pepTitle: By = By.xpath(`${this.MainExampleDiv.value}//pep-chips${this.PepTitle.value}`);

    public async doesChipsComponentFound(): Promise<void> {
        await this.doesComponentFound('chips', 'Chips');
    }
}
