import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class Select extends StorybookComponent {
    public MainExampleDiv: By = By.xpath('//div[@id="story--components-select--story-1"]');
    public MainExamplePepSelect: By = By.xpath(`${this.MainExampleDiv.value}//pep-select`);
    public MainExampleSelect: By = By.xpath(`${this.MainExamplePepSelect.value}//mat-form-field`);
    public MainExampleSelect_value: By = By.xpath(`${this.MainExampleSelect.value}//mat-select//span/span`);
    public MainExample_mandatoryIcon: By = By.xpath(`${this.MainExampleDiv.value}${this.MandatoryIcon.value}`);
    public MainExample_titleLabel: By = By.xpath(`${this.MainExampleDiv.value}//pep-field-title//mat-label`);
    public SelectContent: By = By.xpath('//div[@role="listbox"]/mat-option');
    public SelectContentOptions: By = By.xpath('//div[@role="listbox"]/mat-option/span');

    public async doesSelectComponentFound(): Promise<void> {
        await this.doesComponentFound('select', 'Select');
    }

    public async getMainExampleSelectValue(): Promise<string> {
        const label = await this.browser.findElement(this.MainExampleSelect_value);
        return (await label.getText()).trim();
    }

    public async getSelectOptions(): Promise<any> {
        const selectOptionsElement = await this.browser.findElement(this.SelectContent);
        const selectOptionsElement_innerHTML = await selectOptionsElement.getAttribute('innerHTML');
        console.info(
            'at getItemsControlContent -> await selectOptionsElement.getAttribute("innerHTML"): ',
            selectOptionsElement_innerHTML,
        );
        return selectOptionsElement_innerHTML;
    }

    public async getOptionsOutOfSelectContent(): Promise<any> {
        const selectOptionsElement = await this.browser.findElements(this.SelectContentOptions);
        console.info('at getButtonsOutOfMenuContent -> selectOptionsElement: ', selectOptionsElement);
        const optionsTitles: string[] = await Promise.all(
            selectOptionsElement.map(async (optionElem) => {
                return await optionElem.getText();
            }),
        );
        console.info('at getButtonsOutOfMenuContent -> optionsTitles: ', optionsTitles);
        return optionsTitles;
    }
}
