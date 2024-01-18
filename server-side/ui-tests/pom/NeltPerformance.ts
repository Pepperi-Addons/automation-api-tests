import { By } from 'selenium-webdriver';
import { AddonPage } from './addons/base/AddonPage';

export class NeltPerformance extends AddonPage {
    public Home: By = By.css('[data-qa="systemHome"]');
    public HamburgerMenuButtonAtHome: By = By.css('[data-qa="systemMenu"]');
    public HomeMenuDropdown: By = By.xpath('//div[@role="menu"]');
    public pageGrandTotal: By = By.xpath("//span[@class='value']"); //order page
    public blankSpaceOnScreenToClick: By = By.xpath("//div[contains(@class,'total-items-container')]"); //order page
    public SubmitToCart: By = By.css('[data-qa=cartButton]'); //order
    public ChangeViewButton: By = By.xpath("//mat-icon[@title='Change View']");
    public ViewTypeOption: By = By.xpath(`//span[text()='|textToFill|']`);
    public KupciButtonAtHome: By = By.xpath('//button[@id="mainButton"]');
    public FirstAccountInList: By = By.xpath('//virtual-scroller//fieldset//span[@id="Name"]');
    public AccountActivityList_PlusButton: By = By.xpath('//list-menu[@data-qa="secondMenu"]//button');
    public AccountActivityList_BurgerMenu: By = By.xpath('//list-menu[@data-qa="firstMenu"]//button');
    public Image_Label: By = By.xpath(`//pep-list//label[@id="Image"]`);
    public PepList: By = By.xpath(`//pep-list`);
    public ListRow: By = By.xpath(`//pep-list//virtual-scroller//fieldset[contains(@class,"table-row-fieldset")]`);
    public Search_Input: By = By.xpath('//input[@id="searchInput"]');
    public Search_Magnifier_Button: By = By.xpath('//search//pep-icon[@name="system_search"]');
    public Search_X_Button: By = By.xpath('//search//pep-icon[@name="system_close"]');
    public Cart_Button: By = By.xpath('//button[@data-qa="cartButton"]');
    public TransactionUUID: By = By.id('UUID');
    public TransactionID: By = By.id('WrntyID');

    // Specific selectors for Nelt //
    public OrderCatalogItem: By = By.xpath('//span[@id="Description"]/ancestor::mat-grid-list');
    public OrderCenterItem_OrderButton: By = By.xpath(
        '//pep-list//virtual-scroller//pep-form//mat-grid-list[contains(@class,"card")]//button[@id="TSAAOQMQuantity1"][@title="Order"]',
    );
    public OrderCenterItem_OrderButton_GridLineView: By = By.xpath(
        '//pep-list//virtual-scroller//pep-form//button[@id="TSAAOQMQuantity1"][@title="Order"]',
    );
    public InsightsLoaded_Indication_Chart: By = By.xpath(
        '//pep-remote-loader-element//benchmark-chart-element-00000000-0000-0000-0000-0da1a0de41e5//div[@id="canvas"]',
    );
    public InsightsLoaded_Indication_Chart_SVG: By = By.xpath(
        `//pep-remote-loader-element//benchmark-chart-element-00000000-0000-0000-0000-0da1a0de41e5//div[@id="canvas"]//*[local-name()='svg']/*[local-name()='text']`,
    );
    public InsightsLoaded_Indication_Chart_SVGtext: By = By.xpath(
        `//pep-remote-loader-element//benchmark-chart-element-00000000-0000-0000-0000-0da1a0de41e5//div[@id="canvas"]//*[local-name()='svg']/*[local-name()='text'][contains(text(),"")]`,
    );
    public InsightsLoaded_Indication_Table: By = By.xpath(
        '//pep-remote-loader-element//table-element-00000000-0000-0000-0000-0da1a0de41e5//tbody//tr//td',
    );
    public InsightsLoaded_Indication_Table_Header: By = By.xpath(
        '//pep-remote-loader-element//table-element-00000000-0000-0000-0000-0da1a0de41e5//thead//tr//td[contains(text(),"")]',
    );
    public InsightsLoaded_Indication_Table_Header_Target: By = By.xpath(
        '//pep-remote-loader-element//table-element-00000000-0000-0000-0000-0da1a0de41e5//thead//tr//td[contains(text(),"Target")]',
    );
    public InsightsLoaded_Indication_GalleryCard: By = By.xpath(
        `//gallery-card//*[local-name()='svg']/*[local-name()='text']`,
    );
    public InsightsLoaded_Indication_GalleryCard_text: By = By.xpath(
        `//gallery-card//*[local-name()='svg']/*[local-name()='text'][contains(text(),"0")]`,
    );
    public ResourceView_Indication_TableHeader_Label_Category: By = By.xpath(
        `//pep-list//fieldset[contains(@class,"table-header-fieldset")]//fieldset//label[@id="category"]`,
    );
    public ResourceView_Indication_TableHeader_Label_returnYTD: By = By.xpath(
        `//pep-list//fieldset[contains(@class,"table-header-fieldset")]//fieldset//label[@id="returnYTD"]`,
    );

    public getSelectorOfHomeHamburgerMenuItemByName(name: string) {
        return By.xpath(`//span[contains(text(),"${name}")]/parent::button[@role="menuitem"]`);
    }

    public getSelectorOfAccountHyperlinkByName(name: string) {
        return By.xpath(`//virtual-scroller//fieldset//span[@id="Name"][@title="${name}"]`);
    }

    public getSelectorOfAccountHyperlinkByID(id: number) {
        return By.xpath(
            `//virtual-scroller//fieldset//span[@id="ExternalID"][@title="${id}"]/ancestor::fieldset//pep-internal-button/a`,
        );
    }

    public getSelectorOfAccountActivityPlusButtonMenuItemByName(name: string) {
        return By.xpath(`//button[@title="${name}"]`);
    }

    public getSelectorOfAccountActivityHamburgerMenuItemByName(name: string) {
        return By.xpath(`//button[@title="${name}"]`);
    }

    public getSelectorOfOrderCatalogByName(name: string) {
        return By.xpath(`//span[@id="Description"][@title="${name}"]/ancestor::mat-grid-list`);
    }
}
