// import { Client } from "@pepperi-addons/debug-server/dist";
// import GeneralService from "./general.service";
// import { ObjectsService } from "./objects.service";
import { Browser } from '../ui-tests/utilities/browser';
import { expect } from 'chai';
import { Key } from 'selenium-webdriver';
import { Context } from 'vm';
import { WebAppLoginPage, WebAppHomePage, WebAppHeader, WebAppList, WebAppTopBar, WebAppDialog } from '../ui-tests/pom';
import { OrderPage } from '../ui-tests/pom/Pages/OrderPage';
import addContext from 'mochawesome/addContext';

export interface PriceTsaFields {
    PriceBaseUnitPriceAfter1: number;
    PriceDiscountUnitPriceAfter1: number;
    PriceGroupDiscountUnitPriceAfter1: number;
    PriceManualLineUnitPriceAfter1: number;
    PriceTaxUnitPriceAfter1: number;
    NPMCalcMessage: [any];
}

export class PricingService {
    public browser: Browser;
    // public generalService: GeneralService;
    // public objectsService: ObjectsService;
    public webAppLoginPage: WebAppLoginPage;
    public webAppHomePage: WebAppHomePage;
    public webAppHeader: WebAppHeader;
    public webAppList: WebAppList;
    public webAppTopBar: WebAppTopBar;
    public webAppDialog: WebAppDialog;
    public orderPage: OrderPage;
    public base64Image;

    constructor(
        // public client: Client,
        driver: Browser,
        webAppLoginPage: WebAppLoginPage,
        webAppHomePage: WebAppHomePage,
        webAppHeader: WebAppHeader,
        webAppList: WebAppList,
        webAppTopBar: WebAppTopBar,
        webAppDialog: WebAppDialog,
        orderPage: OrderPage,
    ) {
        this.browser = driver;
        // this.generalService = new GeneralService(client);
        // this.objectsService = new ObjectsService(this.generalService);
        // this.webAppLoginPage = new WebAppLoginPage(driver);
        // this.webAppHomePage = new WebAppHomePage(driver);
        // this.webAppHeader = new WebAppHeader(driver);
        // this.webAppList = new WebAppList(driver);
        // this.webAppTopBar = new WebAppTopBar(driver);
        // this.webAppDialog = new WebAppDialog(driver);
        // this.orderPage = new OrderPage(driver);
        this.webAppLoginPage = webAppLoginPage;
        this.webAppHomePage = webAppHomePage;
        this.webAppHeader = webAppHeader;
        this.webAppList = webAppList;
        this.webAppTopBar = webAppTopBar;
        this.webAppDialog = webAppDialog;
        this.orderPage = orderPage;
    }

    public async startNewSalesOrderTransaction(nameOfAccount: string): Promise<string> {
        await this.webAppHeader.goHome();
        await this.webAppHomePage.isSpinnerDone();
        await this.webAppHomePage.click(this.webAppHomePage.MainHomePageBtn);
        this.browser.sleep(0.1 * 1000);
        await this.webAppHeader.isSpinnerDone();
        await this.webAppList.clickOnFromListRowWebElementByName(nameOfAccount);
        this.browser.sleep(0.1 * 1000);
        await this.webAppHeader.click(this.webAppTopBar.DoneBtn);
        await this.webAppHeader.isSpinnerDone();
        if (await this.webAppHeader.safeUntilIsVisible(this.webAppDialog.Dialog, 5000)) {
            this.browser.sleep(0.1 * 1000);
            await this.webAppDialog.selectDialogBoxBeforeNewOrder();
        }
        this.browser.sleep(0.1 * 1000);
        await this.webAppHeader.isSpinnerDone();
        await this.browser.untilIsVisible(this.orderPage.Cart_Button);
        await this.browser.untilIsVisible(this.orderPage.TransactionUUID);
        const trnUUID = await (await this.browser.findElement(this.orderPage.TransactionUUID)).getText();
        this.browser.sleep(0.1 * 1000);
        return trnUUID;
    }

    public async getItemTSAs(
        at: 'OrderCenter' | 'Cart',
        nameOfItem: string,
        freeItem?: 'Free',
        locationInElementsArray?: number,
    ): Promise<PriceTsaFields> {
        const findSelectorOfItem = `getSelectorOfCustomFieldIn${at}By${freeItem ? freeItem : ''}ItemName`;
        let NPMCalcMessage_Value;
        const PriceBaseUnitPriceAfter1_Selector = this.orderPage[findSelectorOfItem](
            'PriceBaseUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceBaseUnitPriceAfter1_Values = await this.browser.findElements(PriceBaseUnitPriceAfter1_Selector);
        const PriceBaseUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceBaseUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceBaseUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceBaseUnitPriceAfter1_Value: `, PriceBaseUnitPriceAfter1_Value);

        const PriceDiscountUnitPriceAfter1_Selector = this.orderPage[findSelectorOfItem](
            'PriceDiscountUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceDiscountUnitPriceAfter1_Values = await this.browser.findElements(
            PriceDiscountUnitPriceAfter1_Selector,
        );
        const PriceDiscountUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceDiscountUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceDiscountUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceDiscountUnitPriceAfter1_Value: `, PriceDiscountUnitPriceAfter1_Value);

        const PriceGroupDiscountUnitPriceAfter1_Selector = this.orderPage[findSelectorOfItem](
            'PriceGroupDiscountUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceGroupDiscountUnitPriceAfter1_Values = await this.browser.findElements(
            PriceGroupDiscountUnitPriceAfter1_Selector,
        );
        const PriceGroupDiscountUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceGroupDiscountUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceGroupDiscountUnitPriceAfter1_Values[0].getText();
        console.info(
            `${nameOfItem} PriceGroupDiscountUnitPriceAfter1_Value: `,
            PriceGroupDiscountUnitPriceAfter1_Value,
        );

        const PriceManualLineUnitPriceAfter1_Selector = this.orderPage[findSelectorOfItem](
            'PriceManualLineUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceManualLineUnitPriceAfter1_Values = await this.browser.findElements(
            PriceManualLineUnitPriceAfter1_Selector,
        );
        const PriceManualLineUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceManualLineUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceManualLineUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceManualLineUnitPriceAfter1_Value: `, PriceManualLineUnitPriceAfter1_Value);

        const PriceTaxUnitPriceAfter1_Selector = this.orderPage[findSelectorOfItem](
            'PriceTaxUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceTaxUnitPriceAfter1_Values = await this.browser.findElements(PriceTaxUnitPriceAfter1_Selector);
        const PriceTaxUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceTaxUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceTaxUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceTaxUnitPriceAfter1_Value: `, PriceTaxUnitPriceAfter1_Value);

        if (at === 'OrderCenter') {
            const NPMCalcMessage_Selector = this.orderPage[findSelectorOfItem]('NPMCalcMessage_Value', nameOfItem);
            NPMCalcMessage_Value = await (await this.browser.findElement(NPMCalcMessage_Selector)).getText();
            console.info(`${nameOfItem} NPMCalcMessage_Value: `, NPMCalcMessage_Value);
        }
        this.browser.sleep(0.1 * 1000);
        return {
            PriceBaseUnitPriceAfter1: Number(PriceBaseUnitPriceAfter1_Value.split(' ')[1].trim()),
            PriceDiscountUnitPriceAfter1: Number(PriceDiscountUnitPriceAfter1_Value.split(' ')[1].trim()),
            PriceGroupDiscountUnitPriceAfter1: Number(PriceGroupDiscountUnitPriceAfter1_Value.split(' ')[1].trim()),
            PriceManualLineUnitPriceAfter1: Number(PriceManualLineUnitPriceAfter1_Value.split(' ')[1].trim()),
            PriceTaxUnitPriceAfter1: Number(PriceTaxUnitPriceAfter1_Value.split(' ')[1].trim()),
            NPMCalcMessage: at === 'OrderCenter' ? JSON.parse(NPMCalcMessage_Value) : null,
        };
    }

    public async searchInOrderCenter(this: Context, nameOfItem: string, driver: Browser): Promise<void> {
        const orderPage = new OrderPage(driver);
        await orderPage.isSpinnerDone();
        const searchInput = await driver.findElement(orderPage.Search_Input);
        await searchInput.clear();
        driver.sleep(0.1 * 1000);
        await searchInput.sendKeys(nameOfItem + '\n');
        driver.sleep(0.5 * 1000);
        await driver.click(orderPage.HtmlBody);
        driver.sleep(0.1 * 1000);
        await driver.click(orderPage.Search_Magnifier_Button);
        driver.sleep(0.1 * 1000);
        await orderPage.isSpinnerDone();
        await driver.untilIsVisible(orderPage.getSelectorOfItemInOrderCenterByName(nameOfItem));
        this.base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Order Center - after Search`,
            value: 'data:image/png;base64,' + this.base64Image,
        });
    }

    public async changeSelectedQuantityOfSpecificItemInOrderCenter(
        this: Context,
        uomValue: 'Each' | 'Case',
        nameOfItem: string,
        quantityOfItem: number,
        driver: Browser,
    ): Promise<void> {
        const orderPage = new OrderPage(driver);
        const itemContainer = await driver.findElement(orderPage.getSelectorOfItemInOrderCenterByName(nameOfItem));
        driver.sleep(0.05 * 1000);
        let itemUomValue = await driver.findElement(orderPage.UnitOfMeasure_Selector_Value);
        if ((await itemUomValue.getText()) !== uomValue) {
            await driver.click(orderPage.UnitOfMeasure_Selector_Value);
            driver.sleep(0.05 * 1000);
            await driver.click(orderPage.getSelectorOfUnitOfMeasureOptionByText(uomValue));
            driver.sleep(0.1 * 1000);
            await itemContainer.click();
            driver.sleep(0.1 * 1000);
            itemUomValue = await driver.findElement(orderPage.UnitOfMeasure_Selector_Value);
        }
        driver.sleep(0.05 * 1000);
        await orderPage.isSpinnerDone();
        expect(await itemUomValue.getText()).equals(uomValue);
        const uomXnumber = await driver.findElement(
            orderPage.getSelectorOfCustomFieldInOrderCenterByItemName(
                'ItemQuantity_byUOM_InteractableNumber',
                nameOfItem,
            ),
        );
        await itemContainer.click();
        for (let i = 0; i < 6; i++) {
            await uomXnumber.sendKeys(Key.BACK_SPACE);
            driver.sleep(0.01 * 1000);
        }
        driver.sleep(0.05 * 1000);
        await uomXnumber.sendKeys(quantityOfItem);
        await orderPage.isSpinnerDone();
        driver.sleep(0.05 * 1000);
        await itemContainer.click();
        driver.sleep(1 * 1000);
        const numberByUOM = await uomXnumber.getAttribute('title');
        driver.sleep(0.5 * 1000);
        await orderPage.isSpinnerDone();
        expect(Number(numberByUOM)).equals(quantityOfItem);
        driver.sleep(1 * 1000);
        const numberOfUnits = await (
            await driver.findElement(orderPage.ItemQuantity_NumberOfUnits_Readonly)
        ).getAttribute('title');
        driver.sleep(0.5 * 1000);
        await orderPage.isSpinnerDone();
        switch (uomValue) {
            case 'Each':
                expect(numberOfUnits).equals(numberByUOM);
                break;
            case 'Case':
                expect(Number(numberOfUnits)).equals(Number(numberByUOM) * 6);
                break;
            default:
                break;
        }
        driver.sleep(0.05 * 1000);
        await itemContainer.click();
        this.base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Order Center - after Quantity change`,
            value: 'data:image/png;base64,' + this.base64Image,
        });
    }

    public async changeSelectedQuantityOfSpecificItemInCart(
        this: Context,
        uomValue: 'Each' | 'Case',
        nameOfItem: string,
        quantityOfItem: number,
        driver: Browser,
    ): Promise<void> {
        const orderPage = new OrderPage(driver);
        driver.sleep(0.05 * 1000);
        let itemUomValue = await driver.findElement(orderPage.getSelectorOfUomValueInCartByItemName(nameOfItem));
        if ((await itemUomValue.getText()) !== uomValue) {
            await itemUomValue.click();
            driver.sleep(0.05 * 1000);
            await driver.click(orderPage.getSelectorOfUnitOfMeasureOptionByText(uomValue));
            driver.sleep(0.1 * 1000);
            await driver.click(orderPage.HtmlBody);
            driver.sleep(0.1 * 1000);
            itemUomValue = await driver.findElement(orderPage.getSelectorOfUomValueInCartByItemName(nameOfItem));
        }
        driver.sleep(0.05 * 1000);
        await orderPage.isSpinnerDone();
        expect(await itemUomValue.getText()).equals(uomValue);
        let uomXnumber = await driver.findElement(
            orderPage.getSelectorOfCustomFieldInCartByItemName('ItemQuantity_byUOM_InteractableNumber', nameOfItem),
        );
        for (let i = 0; i < 6; i++) {
            await uomXnumber.sendKeys(Key.BACK_SPACE);
            driver.sleep(0.01 * 1000);
        }
        driver.sleep(0.05 * 1000);
        await uomXnumber.sendKeys(quantityOfItem);
        await orderPage.isSpinnerDone();
        driver.sleep(0.05 * 1000);
        await driver.click(orderPage.HtmlBody);
        driver.sleep(1 * 1000);
        uomXnumber = await driver.findElement(
            orderPage.getSelectorOfCustomFieldInCartByItemName('ItemQuantity_byUOM_InteractableNumber', nameOfItem),
        );
        driver.sleep(1 * 1000);
        await orderPage.isSpinnerDone();
        expect(Number(await uomXnumber.getAttribute('title'))).equals(quantityOfItem);
        driver.sleep(0.2 * 1000);
        const numberOfUnits = await driver.findElement(
            orderPage.getSelectorOfNumberOfUnitsInCartByItemName(nameOfItem),
        );
        driver.sleep(1 * 1000);
        switch (uomValue) {
            case 'Each':
                expect(Number(await numberOfUnits.getAttribute('title'))).equals(
                    Number(await uomXnumber.getAttribute('title')),
                );
                break;
            case 'Case':
                expect(Number(await numberOfUnits.getAttribute('title'))).equals(
                    Number(await uomXnumber.getAttribute('title')) * 6,
                );
                break;
            default:
                break;
        }
        await orderPage.isSpinnerDone();
        driver.sleep(0.1 * 1000);
        this.base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Cart - after Quantity change`,
            value: 'data:image/png;base64,' + this.base64Image,
        });
    }

    public async clearOrderCenterSearch(): Promise<void> {
        await this.orderPage.isSpinnerDone();
        await this.browser.click(this.orderPage.Search_X_Button);
        this.browser.sleep(0.1 * 1000);
        await this.orderPage.isSpinnerDone();
    }
}
