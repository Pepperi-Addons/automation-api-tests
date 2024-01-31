import { By } from 'selenium-webdriver';
import { WebAppList } from '..';
import { Browser } from '../../utilities/browser';

export class OrderPage extends WebAppList {
    constructor(protected browser: Browser) {
        super(browser);
    }
    public pageGrandTotal: By = By.xpath("//span[@class='value']"); //order page
    public blankSpaceOnScreenToClick: By = By.xpath("//div[contains(@class,'total-items-container')]"); //order page
    public SubmitToCart: By = By.css('[data-qa=cartButton]'); //order
    public ChangeViewButton: By = By.xpath("//mat-icon[@title='Change View']");
    public ViewTypeOption: By = By.xpath(`//span[text()='|textToFill|']`);

    public Image_Label: By = By.xpath(`//pep-list//label[@id="Image"]`);

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
    public PriceDiscountUnitPriceAfter1_Value: By = By.xpath('//span[@id="TSAPriceDiscountUnitPriceAfter1"]');
    public PriceGroupDiscountUnitPriceAfter1_Value: By = By.xpath('//span[@id="TSAPriceGroupDiscountUnitPriceAfter1"]');
    public PriceManualLineUnitPriceAfter1_Value: By = By.xpath('//span[@id="TSAPriceManualLineUnitPriceAfter1"]');
    public PriceTaxUnitPriceAfter1_Value: By = By.xpath('//span[@id="TSAPriceTaxUnitPriceAfter1"]');
    public NPMCalcMessage_Value: By = By.xpath('//span[@id="TSANPMCalcMessage"]');

    public PriceDiscount2UnitPriceAfter1_Value: By = By.xpath('//span[@id="TSAPriceDiscount2UnitPriceAfter1"]');

    public PriceBaseUnitPriceAfter2_Value: By = By.xpath('//span[@id="TSAPriceBaseUnitPriceAfter2"]');
    public PriceDiscountUnitPriceAfter2_Value: By = By.xpath('//span[@id="TSAPriceDiscountUnitPriceAfter2"]');
    public PriceTaxUnitPriceAfter2_Value: By = By.xpath('//span[@id="TSAPriceTaxUnitPriceAfter2"]');

    public PriceTaxTotal_Value: By = By.xpath('//span[@id="TSAPriceTaxTotal"]');
    public PriceTaxTotalPercent_Value: By = By.xpath('//span[@id="TSAPriceTaxTotalPercent"]');
    public PriceTaxTotalDiff_Value: By = By.xpath('//span[@id="TSAPriceTaxTotalDiff"]');
    public PriceTaxUnitDiff_Value: By = By.xpath('//span[@id="TSAPriceTaxUnitDiff"]');

    public Cart_ContinueOrdering_Button: By = By.xpath('//button[@data-qa="Continue ordering"]');
    public Cart_Headline_Results_Number: By = By.xpath('//pep-list-total//span[contains(@class,"bold number")]');
    public OrderCenter_Headline_Results_Number: By = By.xpath('//list-total//span[contains(@class,"bold number")]');
    public OrderCenter_SideMenu_BeautyMakeUp: By = By.xpath(
        '//mat-tree//span[text()="Beauty Make Up"]/parent::li/parent::mat-tree-node',
    );

    public getSelectorOfUnitOfMeasureOptionByText(text: string, uomIndex?: '2') {
        const path = `//div[@id="TSAAOQMUOM${
            uomIndex ? uomIndex : '1'
        }-panel"][@role="listbox"]/mat-option[@title="${text}"]`;
        // if (uomIndex && uomIndex === '2') {
        //     path = `//div[@id="TSAAOQMUOM2-panel"][@role="listbox"]/mat-option[@title="${text}"]`;
        // }
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
    // End of specific pricing selectors //

    public async changeOrderCenterPageView(viewType: string) {
        //switch to medium view:
        //1. click on btn to open drop down
        await this.clickViewMenu();
        //2. pick wanted view
        const injectedViewType = this.ViewTypeOption.value.slice().replace('|textToFill|', viewType);
        await this.browser.click(By.xpath(injectedViewType));
        await this.isSpinnerDone();
    }

    public async changeCartView(viewType: string) {
        //switch to medium view:
        //1. click on btn to open drop down
        await this.clickViewMenu();
        //2. pick wanted view
        const injectedViewType = this.ViewTypeOption.value.slice().replace('|textToFill|', viewType);
        await this.browser.click(By.xpath(injectedViewType));
        await this.browser.click(this.Cart_Headline_Results_Number);
        await this.isSpinnerDone();
    }

    public async clickViewMenu() {
        await this.browser.click(this.ChangeViewButton);
        await this.browser.sleep(0.5 * 1000);
    }

    public async searchInOrderCenter(nameOfItem: string): Promise<void> {
        await this.isSpinnerDone();
        const searchInput = await this.browser.findElement(this.Search_Input);
        await searchInput.clear();
        this.browser.sleep(0.1 * 1000);
        await searchInput.sendKeys(nameOfItem + '\n');
        this.browser.sleep(0.5 * 1000);
        await this.browser.click(this.HtmlBody);
        await this.browser.click(this.Search_Magnifier_Button);
        this.browser.sleep(0.1 * 1000);
        await this.isSpinnerDone();
        await this.browser.untilIsVisible(this.getSelectorOfItemInOrderCenterByName(nameOfItem));
    }

    public async clearOrderCenterSearch(): Promise<void> {
        await this.isSpinnerDone();
        await this.browser.click(this.Search_X_Button);
        this.browser.sleep(0.1 * 1000);
        await this.isSpinnerDone();
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
