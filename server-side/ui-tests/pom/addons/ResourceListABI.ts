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

    public ListAbi_Empty_Error_container: By = By.xpath('//pep-page-layout//div[contains(@class,"pep-main-area")]//div[contains(@class,"list-empty-state")]');
    public ListAbi_Empty_Error_title: By = By.xpath(`${this.ListAbi_Empty_Error_container.value}/div[contains(@class,"list-empty-title")]`);
    public ListAbi_Empty_Error_description: By = By.xpath(`${this.ListAbi_Empty_Error_container.value}/div[contains(@class,"list-empty-descr")]`);

    public ListAbi_Menu_button: By = By.xpath(
        '//pep-top-bar//div[contains(@class,"right-container")]//pep-menu//button',
    );
    public ListAbi_New_button: By = By.xpath(`${this.ListAbi_container.value}//pep-top-bar//div[contains(@class,"right-container")]//pep-button/button[contains(@data-qa,"_new")]`);
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

    public ListAbi_VerticalScroll: By = By.xpath(
        '//pep-list//virtual-scroller[contains(@class, "virtual-scroller")][contains(@class, "vertical selfScroll")]',
    );
    // no scroll: <virtual-scroller _ngcontent-xfn-c622 class="virtual-scroller table-body vertical selfScroll ng-star-inserted" _nghost-xfn-c620>
    // scroll: <virtual-scroller _ngcontent-hei-c622 class="virtual-scroller table-body vertical selfScroll ng-star-inserted" _nghost-hei-c620>

    public ListAbi_ViewsDropdown: By = By.xpath('//pep-top-bar//pep-select[@label="select view"]//mat-select');
    public ListAbi_ViewsDropdown_value: By = By.xpath(
        `${this.ListAbi_ViewsDropdown.value}//div[contains(@id, "mat-select-value-")]/span/span`,
    );
}
