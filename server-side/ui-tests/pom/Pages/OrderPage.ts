import { By } from 'selenium-webdriver';
import { WebAppList } from '..';

export class OrderPage extends WebAppList {
    public pageGrandTotal: By = By.xpath("//span[@class='value']"); //order page
    public blankSpaceOnScreenToClick: By = By.xpath("//div[contains(@class,'total-items-container')]"); //order page
    public SubmitToCart: By = By.css('[data-qa=cartButton]'); //order
    public ChangeViewButton: By = By.xpath("//mat-icon[@title='Change View']");
    public ViewTypeOption: By = By.xpath(`//span[text()='|textToFill|']`);

    // Specific selectors for Pricing //
    public Search_Input: By = By.xpath('//input[@id="searchInput"]');
    public Search_Magnifier_Button: By = By.xpath('//search//pep-icon[@name="system_search"]');
    public Search_X_Button: By = By.xpath('//search//pep-icon[@name="system_close"]');
    public PriceBaseUnitPriceAfter1_Value: By = By.xpath('//span[@id="TSAPriceBaseUnitPriceAfter1"]');
    public PriceDiscountUnitPriceAfter1_Value: By = By.xpath('//span[@id="TSAPriceDiscountUnitPriceAfter1"]');
    public PriceGroupDiscountUnitPriceAfter1_Value: By = By.xpath('//span[@id="TSAPriceGroupDiscountUnitPriceAfter1"]');
    public PriceManualLineUnitPriceAfter1_Value: By = By.xpath('//span[@id="TSAPriceManualLineUnitPriceAfter1"]');
    public PriceTaxUnitPriceAfter1_Value: By = By.xpath('//span[@id="TSAPriceTaxUnitPriceAfter1"]');
    public NPMCalcMessage_Value: By = By.xpath('//span[@id="TSANPMCalcMessage"]');

    public getSelectorOfItemInOrderCenterByName(name: string) {
        return By.xpath(`//span[@id="ItemExternalID"][@title="${name}"]/ancestor::mat-grid-list`);
    }

    public getSelectorOfCustomFieldByItemName(fieldName: string, itemName: string) {
        return By.xpath(`${this.getSelectorOfItemInOrderCenterByName(itemName).value}${this[fieldName].value}`);
    }
    // End of specific pricing selectors //

    public async changeOrderCenterPageView(viewType: string) {
        //switch to medium view:
        //1. click on btn to open drop down
        await this.clickViewMenu();
        //2. pick wanted view
        const injectedViewType = this.ViewTypeOption.valueOf()['value'].slice().replace('|textToFill|', viewType);
        await this.browser.click(By.xpath(injectedViewType));
        await this.isSpinnerDone();
    }

    public async clickViewMenu() {
        await this.browser.click(this.ChangeViewButton);
        await this.browser.sleep(1500);
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
