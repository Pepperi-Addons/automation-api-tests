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
    public InsightsLoaded_Indication_Chart: By = By.xpath(
        '//pep-remote-loader-element//benchmark-chart-element-00000000-0000-0000-0000-0da1a0de41e5//div[@id="canvas"]',
    );
    public InsightsLoaded_Indication_Table: By = By.xpath(
        '//pep-remote-loader-element//table-element-00000000-0000-0000-0000-0da1a0de41e5//tbody//tr//td',
    );
    public InsightsLoaded_Indication_GalleryCard: By = By.xpath(
        `//gallery-card//*[local-name()='svg']/*[local-name()='text']`,
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
}
