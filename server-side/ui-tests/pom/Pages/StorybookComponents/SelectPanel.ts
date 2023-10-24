import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class SelectPanel extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-select-panel--story-1"]');
    public MainExampleSelectPanel: By = By.xpath(`${this.MainExampleDiv.value}//pep-select-panel/div`);
    public MainExampleSelectPanel_checkbox: By = By.xpath(
        `${this.MainExampleSelectPanel.value}//div[contains(@title,"{Placeholder}")]`,
    );
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);

    public async doesSelectPanelComponentFound(): Promise<void> {
        await this.doesComponentFound('elect-panel', 'Select panel');
    }

    public async getSelectPanelCheckboxSelectorByName(selectTitle: string): Promise<By> {
        return By.xpath(
            `${this.MainExampleSelectPanel_checkbox.value.replace('{Placeholder}', selectTitle)}/mat-checkbox//input`,
        );
    }

    public async isMainExampleByNameSelected(selectTitle: string): Promise<boolean> {
        const selectedElem = await this.browser.findElement(
            await this.getSelectPanelCheckboxSelectorByName(selectTitle),
        );
        const selected = await selectedElem.getAttribute('aria-checked');
        return selected === 'true' ? true : false;
    }
}
