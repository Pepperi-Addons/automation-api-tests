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
    public SelectPanelContent: By = By.xpath('//div[@role="listbox"]/mat-option');
    public SelectPanelContentOptions: By = By.xpath(`${this.MainExampleSelectPanel.value}//mat-checkbox/label/span[2]`);

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

    public async getSelectPanelOptions(): Promise<any> {
        const selectOptionsElement = await this.browser.findElement(this.MainExampleSelectPanel);
        const selectOptionsElement_innerHTML = await selectOptionsElement.getAttribute('innerHTML');
        console.info(
            'at getItemsControlContent -> await selectOptionsElement.getAttribute("innerHTML"): ',
            selectOptionsElement_innerHTML,
        );
        return selectOptionsElement_innerHTML;
    }

    public async getOptionsOutOfSelectPanelContent(): Promise<any> {
        const selectOptionsElement = await this.browser.findElements(this.SelectPanelContentOptions);
        console.info('at getButtonsOutOfMenuContent -> selectOptionsElement: ', selectOptionsElement);
        const optionsTitles: string[] = await Promise.all(
            selectOptionsElement.map(async (optionElem) => {
                return (await optionElem.getText()).trim();
            }),
        );
        console.info('at getButtonsOutOfMenuContent -> optionsTitles: ', optionsTitles);
        return optionsTitles;
    }
}
