import { By } from 'selenium-webdriver';
import { AddonPage } from './addons/base/AddonPage';

export class NeltPerformance extends AddonPage {
    public Home: By = By.css('[data-qa="systemHome"]');
    public HamburgerMenuButtonAtHome: By = By.css('[data-qa="systemMenu"]');
    public HomeMenuDropdown: By = By.xpath('//div[@role="menu"]');
    public AccountsSearchbox: By = By.xpath('//input[@id="searchInput"]');
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

    // Specific selectors for Pricing //
    public Duration_Span: By = By.xpath('//span[@id="TSAduration"]');
    public Search_Input: By = By.xpath('//input[@id="searchInput"]');
    public Search_Magnifier_Button: By = By.xpath('//search//pep-icon[@name="system_search"]');
    public Search_X_Button: By = By.xpath('//search//pep-icon[@name="system_close"]');

    public ItemQuantity_NumberOfUnits_Readonly: By = By.xpath('//pep-quantity-selector//button[@id="UnitsQuantity"]');
    public ItemQuantity_byUOM_InteractableNumber: By = By.xpath(
        '//pep-quantity-selector//input[@id="TSAAOQMQuantity1"]',
    );
    public ItemQuantity2_byUOM_InteractableNumber: By = By.xpath(
        '//pep-quantity-selector//input[@id="TSAAOQMQuantity2"]',
    );
    public AdditionalItemQuantity_byUOM_Number_Cart: By = By.xpath(
        '//pep-quantity-selector//button[@id="TSAAOQMQuantity1"]',
    );
    public ItemQuantity_Minus_Button: By = By.xpath('//pep-quantity-selector//mat-form-field/div/div/div[3]/button');
    public ItemQuantity2_Minus_Button: By = By.xpath('//pep-quantity-selector//mat-form-field/div/div/div[3]/button');
    public ItemQuantity_Plus_Button: By = By.xpath('//pep-quantity-selector//mat-form-field/div/div/div[5]/button');
    public ItemQuantity2_Plus_Button: By = By.xpath('//pep-quantity-selector//mat-form-field/div/div/div[5]/button');

    public Cart_Button: By = By.xpath('//button[@data-qa="cartButton"]');
    public Cart_Totals: By = By.xpath('//list-totals-view');
    public Cart_Total_Header: By = By.xpath('//pep-textbox[@data-qa="PSAGrandTotalHeader"]');
    public Cart_Total_Header_container: By = By.xpath('//div[contains(@class,"line-view")]');
    public Cart_Submit_Button: By = By.xpath('//button[@data-qa="Submit"]');
    public Cart_List_container: By = By.xpath('//app-cart//pep-list/div');
    public Cart_LinesView_List_container: By = By.xpath('//app-cart//pep-list');
    public TransactionUUID: By = By.id('UUID');
    public TransactionID: By = By.id('WrntyID');

    public UnitOfMeasure_Selector_Value: By = By.xpath('//span[@id="TSAAOQMUOM1"]');
    public UnitOfMeasure2_Selector_Value: By = By.xpath('//span[@id="TSAAOQMUOM2"]');
    public Cart_UnitOfMeasure_Selector_Value: By = By.xpath('//*[@id="TSAAOQMUOM1"]');
    public Cart_UnitOfMeasure2_Selector_Value: By = By.xpath('//*[@id="TSAAOQMUOM2"]');

    public PriceBaseUnitPriceAfter1_Value: By = By.xpath('//span[@id="TSAPriceBaseUnitPriceAfter1"]');

    public Cart_ContinueOrdering_Button: By = By.xpath('//button[@data-qa="Continue ordering"]');
    public Cart_Headline_Results_Number: By = By.xpath('//pep-list-total//span[contains(@class,"bold number")]');
    public OrderCenter_Headline_Results_Number: By = By.xpath('//list-total//span[contains(@class,"bold number")]');
    public OrderCenter_SideMenu_BeautyMakeUp: By = By.xpath(
        '//mat-tree//span[text()="Beauty Make Up"]/parent::li/parent::mat-tree-node',
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

    public getSelectorOfUnitOfMeasureOptionByText(text: string, uomIndex?: '2') {
        const path = `//div[@id="TSAAOQMUOM${
            uomIndex ? uomIndex : '1'
        }-panel"][@role="listbox"]/mat-option[@title="${text}"]`;
        return By.xpath(path);
    }

    public getSelectorOfItemInOrderCenterByName(name: string) {
        return By.xpath(`//span[@id="ItemExternalID"][contains(@title,"${name}")]/ancestor::mat-grid-list`);
    }

    public getSelectorOfSidebarSectionInOrderCenterByName(name: string) {
        return By.xpath(`//mat-tree//span[text()="${name}"]/parent::li/parent::mat-tree-node`);
    }

    public getSelectorOfCustomFieldInOrderCenterByItemName(fieldName: string, itemName: string) {
        return By.xpath(`${this.getSelectorOfItemInOrderCenterByName(itemName).value}${this[fieldName].value}`);
    }

    public getSelectorOfItemQuantityPlusButtonInOrderCenterByName(itemName: string, uomIndex?: number) {
        let path: string = this.getSelectorOfItemInOrderCenterByName(itemName).value;
        if (uomIndex && uomIndex === 2) {
            path += this.ItemQuantity2_Plus_Button.value;
        } else {
            path += this.ItemQuantity_Plus_Button.value;
        }
        return By.xpath(path);
    }

    public getSelectorOfItemQuantityMinusButtonInOrderCenterByName(itemName: string, uomIndex?: number) {
        let path: string = this.getSelectorOfItemInOrderCenterByName(itemName).value;
        if (uomIndex && uomIndex === 2) {
            path += this.ItemQuantity2_Minus_Button.value;
        } else {
            path += this.ItemQuantity_Minus_Button.value;
        }
        return By.xpath(path);
    }

    public getSelectorOfItemQuantityPlusButtonInCartByName(itemName: string) {
        return By.xpath(`${this.getSelectorOfItemInCartByName(itemName).value}${this.ItemQuantity_Plus_Button.value}`);
    }

    public getSelectorOfItemQuantityMinusButtonInCartByName(itemName: string) {
        return By.xpath(`${this.getSelectorOfItemInCartByName(itemName).value}${this.ItemQuantity_Minus_Button.value}`);
    }

    public getSelectorOfItemInCartByName(name: string) {
        return By.xpath(
            `//pep-textbox[@data-qa="ItemExternalID"]/span[contains(@title,"${name}")]/ancestor::fieldset/ancestor::fieldset`,
        );
    }

    public getSelectorOfItemInCartLinesViewByName(name: string) {
        return By.xpath(`//span[contains(@title,"${name}")]/ancestor::fieldset`);
    }

    public getSelectorOfFreeItemInCartByName(name: string) {
        return By.xpath(`${this.getSelectorOfItemInCartByName(name).value}[@style]`);
    }

    public getSelectorOfFreeItemInCartLinesViewByName(name: string) {
        return By.xpath(`${this.getSelectorOfItemInCartLinesViewByName(name).value}[@style]`);
    }

    public getSelectorOfCustomFieldInCartByItemName(fieldName: string, itemName: string) {
        return By.xpath(`${this.getSelectorOfItemInCartByName(itemName).value}${this[fieldName].value}`);
    }

    public getSelectorOfCustomFieldInCartLinesViewByItemName(fieldName: string, itemName: string) {
        return By.xpath(`${this.getSelectorOfItemInCartLinesViewByName(itemName).value}${this[fieldName].value}`);
    }

    public getSelectorOfCustomFieldInCartByFreeItemName(fieldName: string, itemName: string) {
        return By.xpath(`${this.getSelectorOfFreeItemInCartByName(itemName).value}${this[fieldName].value}`);
    }

    public getSelectorOfUomValueInCartByItemName(name: string) {
        return By.xpath(
            `${this.getSelectorOfItemInCartByName(name).value}${this.Cart_UnitOfMeasure_Selector_Value.value}`,
        );
    }

    public getSelectorOfNumberOfUnitsInCartByItemName(name: string) {
        return By.xpath(
            `${this.getSelectorOfItemInCartByName(name).value}${this.ItemQuantity_NumberOfUnits_Readonly.value}`,
        );
    }

    public getSelectorOfNumberOfUnitsInCartLinesViewByItemName(name: string) {
        return By.xpath(
            `${this.getSelectorOfItemInCartLinesViewByName(name).value}${
                this.ItemQuantity_NumberOfUnits_Readonly.value
            }`,
        );
    }

    public getSelectorOfNumberOfUnitsInCartByFreeItemName(name: string) {
        return By.xpath(
            `${this.getSelectorOfFreeItemInCartByName(name).value}${this.ItemQuantity_NumberOfUnits_Readonly.value}`,
        );
    }

    public getSelectorOfNumberOfUnitsInCartLinesViewByFreeItemName(name: string) {
        return By.xpath(
            `${this.getSelectorOfFreeItemInCartLinesViewByName(name).value}${
                this.ItemQuantity_NumberOfUnits_Readonly.value
            }`,
        );
    }

    public getSelectorOfNumberOfUnitsInOrderCenterByItemName(name: string) {
        return By.xpath(
            `${this.getSelectorOfItemInOrderCenterByName(name).value}${this.ItemQuantity_NumberOfUnits_Readonly.value}`,
        );
    }

    public getSelectorOfAoqmQuantityInCartByItemName(name: string) {
        return By.xpath(
            `${this.getSelectorOfItemInCartByName(name).value}${this.ItemQuantity_byUOM_InteractableNumber.value}`,
        );
    }

    public getSelectorOfReadOnlyAoqmQuantityInCartByAdditionalItemName(name: string) {
        return By.xpath(
            `${this.getSelectorOfItemInCartByName(name).value}${this.AdditionalItemQuantity_byUOM_Number_Cart.value}`,
        );
    }
}

export class OrderPageItem {
    public qty: By = By.xpath("//span[@title='|textToFill|']/../../../../..//fieldset//pep-quantity-selector//input");
    public totalUnitPrice: By = By.xpath(
        "//span[@title='|textToFill|']/../../../../..//fieldset//span[@id='TotalUnitsPriceAfterDiscount']",
    );

    public expectedQty: string;
    public expectedUnitPrice: string;

    constructor(idOfWUomElement: string, expectedQty: string, expectedUnitPrice: string) {
        this.qty.valueOf()['value'] = this.qty.valueOf()['value'].slice().replace('|textToFill|', idOfWUomElement);
        this.totalUnitPrice.valueOf()['value'] = this.totalUnitPrice
            .valueOf()
            ['value'].slice()
            .replace('|textToFill|', idOfWUomElement);
        this.expectedQty = expectedQty;
        this.expectedUnitPrice = expectedUnitPrice;
    }
}
