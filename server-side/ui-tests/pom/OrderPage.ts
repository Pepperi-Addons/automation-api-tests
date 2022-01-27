import { By, Locator } from "selenium-webdriver";
import { WebAppList } from ".";

export class OrderPage extends WebAppList
{
    public pageGrandTotal: Locator = By.xpath("//span[@class='value']");//order page
    public blankSpaceOnScreenToClick: Locator = By.xpath("//div[contains(@class,'total-items-container')]");//order page
    public SubmitToCart: Locator = By.css('[data-qa=cartButton]');//order

    
}

export class OrderPageItem {
    public qty: Locator = By.xpath(
        "//span[@title='|textToFill|']/../../../../..//fieldset//pep-quantity-selector//input",
    );
    public totalUnitPrice: Locator = By.xpath(
        "//span[@title='|textToFill|']/../../../../..//fieldset//span[@id='TotalUnitsPriceAfterDiscount']",
    );

    public expectedQty: string;
    public expectedUnitPrice: string;

    constructor(idOfWUomElement: string, expectedQty: string, expectedUnitPrice: string) {
        this.qty.valueOf()['value'] = this.qty.valueOf()['value'].slice().replace('|textToFill|', idOfWUomElement);
        this.totalUnitPrice.valueOf()['value'] = this.totalUnitPrice.valueOf()['value'].slice().replace('|textToFill|', idOfWUomElement);
        this.expectedQty = expectedQty;
        this.expectedUnitPrice = expectedUnitPrice;
    }

}