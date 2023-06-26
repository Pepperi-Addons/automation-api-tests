import { By } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';

export class ResourceListABI extends AddonPage {
    public TestsAddon_container: By = By.xpath(
        '//div[contains(@class,pep-center-layout)]/pep-remote-loader-element/settings-element-cd3ba412-66a4-42f4-8abc-65768c5dc606//rl-abi',
    );
    public TestsAddon_dropdownTitle: By = By.xpath(
        `${this.TestsAddon_container.value}//pep-select//pep-field-title//mat-label`,
    );
    public TestsAddon_dropdownElement: By = By.xpath(`${this.TestsAddon_container.value}//pep-select//mat-form-field`);
    public TestsAddon_openABI_button: By = By.xpath(
        `${this.TestsAddon_container.value}//pep-button[@value="open ABI"]/button[@data-qa="open ABI"]`,
    );

    // pep-generic-list
    public ListAbi_container: By = By.xpath(
        '//list-abi-element-0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/resource-list/list-ui',
    );
    public ListAbi_title: By = By.xpath(`${this.ListAbi_container.value}//pep-top-bar/div/div/div/div/div/div[2]/span`);
    public ListAbi_results_number: By = By.xpath(
        `${this.ListAbi_container.value}//pep-top-bar//pep-list-total//span[contains(@class,number)]`,
    );

    public ListAbi_Menu_button: By = By.xpath(
        '//pep-top-bar//div[contains(@class,"right-container")]//pep-menu//button',
    );
    public ListAbi_LineMenu_button: By = By.xpath('//pep-top-bar//pep-list-actions//pep-menu//button');
    public ListAbi_Search_input: By = By.xpath('//pep-search');
    public ListAbi_SmartSearch_container: By = By.xpath('//pep-smart-filters');

    public ListAbi_Pager_container: By = By.xpath('//pep-list-pager');
    public ListAbi_PageIndex: By = By.xpath(
        `${this.ListAbi_Pager_container.value}//pep-textbox[@data-qa="pageIndex"]]//input`,
    );
    public ListAbi_NumOfPages: By = By.xpath(
        `${this.ListAbi_Pager_container.value}//div[contains(@class,"pager-container")]/span[contains(@class,"pep-spacing-element")][3]`,
    );
    public ListAbi_Pager_LeftArrow: By = By.xpath(`${this.ListAbi_Pager_container.value}//button[@title="Previous"]`); // when disabled: class="disabled mat-button-disabled"
    public ListAbi_Pager_RightArrow: By = By.xpath(`${this.ListAbi_Pager_container.value}//button[@title="Next"]`); // when disabled: class="disabled mat-button-disabled"
}
