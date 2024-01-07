// import { Client } from "@pepperi-addons/debug-server/dist";
// import GeneralService from "./general.service";
// import { ObjectsService } from "./objects.service";
import { Browser } from '../ui-tests/utilities/browser';
import { expect } from 'chai';
import { Key, WebElement } from 'selenium-webdriver';
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

export interface PriceTsaDiscount2 {
    PriceDiscount2UnitPriceAfter1: number;
}

export interface PriceTsaFieldsUom2 {
    PriceBaseUnitPriceAfter2: number;
    PriceDiscountUnitPriceAfter2: number;
    PriceTaxUnitPriceAfter2: number;
}

export interface PriceTotalsTsaFields {
    PriceTaxTotal: number;
    PriceTaxTotalPercent: number;
    PriceTaxTotalDiff: number;
    PriceTaxUnitDiff: number;
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

    public async getItemTotalAmount(
        at: 'OrderCenter' | 'Cart',
        itemName: string,
        freeItem?: 'Free',
        locationInElementsArray?: number,
    ): Promise<number> {
        const nameOfFunctionToLocateSelector = `getSelectorOfNumberOfUnitsIn${at}By${freeItem ? freeItem : ''}ItemName`;
        const selectorOfItem = this.orderPage[nameOfFunctionToLocateSelector](itemName);
        const arrOfTotalOfUnits: WebElement[] = await this.browser.findElements(selectorOfItem);
        if (arrOfTotalOfUnits.length > 1) {
            // let arrOfFreeTotalOfUnits: WebElement[] = [];
            const arrOfTotalOfUnitsMinusFree: WebElement[] = arrOfTotalOfUnits;
            // if (!freeItem) {
            //     // arrOfFreeTotalOfUnits = await this.browser.findElements(this.orderPage.getSelectorOfNumberOfUnitsInCartByFreeItemName(itemName));
            //     // arrOfFreeTotalOfUnits.forEach(webelement => {
            //     //     arrOfTotalOfUnitsMinusFree = arrOfTotalOfUnitsMinusFree.splice(arrOfTotalOfUnitsMinusFree.findIndex(elem => elem === webelement), 1);
            //     // });
            //     arrOfTotalOfUnitsMinusFree = arrOfTotalOfUnits.filter(async (webelement) => {
            //         if (!(await webelement.getAttribute('style'))) {
            //             return webelement;
            //         }
            //     });
            // }
            if (locationInElementsArray) {
                const totalOfUnitsByLocationAsNum = Number(
                    await arrOfTotalOfUnitsMinusFree[locationInElementsArray].getAttribute('title'),
                );
                console.info(
                    'at getItemTotalAmount function -> totalOfUnitsByLocationAsNum: ',
                    totalOfUnitsByLocationAsNum,
                );
                return totalOfUnitsByLocationAsNum;
            }
            const totalOfUnitsFirstInArrAsNum = Number(await arrOfTotalOfUnitsMinusFree[0].getAttribute('title'));
            console.info(
                'at getItemTotalAmount function -> totalOfUnitsFirstInArrAsNum: ',
                totalOfUnitsFirstInArrAsNum,
            );
            return totalOfUnitsFirstInArrAsNum;
        }
        const totalOfUnitsAsNum = Number(await arrOfTotalOfUnits[0].getAttribute('title'));
        console.info('at getItemTotalAmount function -> totalOfUnitsAsNum: ', totalOfUnitsAsNum);
        return totalOfUnitsAsNum;
    }

    public async getItemTSAs(
        at: 'OrderCenter' | 'Cart',
        nameOfItem: string,
        freeItem?: 'Free',
        locationInElementsArray?: number,
        view?: 'LinesView',
    ): Promise<PriceTsaFields> {
        const nameOfFunctionToLocateSelector = `getSelectorOfCustomFieldIn${at}${view ? view : ''}By${
            freeItem ? freeItem : ''
        }ItemName`;
        let NPMCalcMessage_Value;
        const PriceBaseUnitPriceAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceBaseUnitPriceAfter1_Value',
            nameOfItem,
        );
        // let PriceBaseUnitPriceAfter1_Values;
        // if (at === 'Cart') {
        //     PriceBaseUnitPriceAfter1_Values = freeItem ? await this.browser.findElements(PriceBaseUnitPriceAfter1_Selector) : (await this.browser.findElements(PriceBaseUnitPriceAfter1_Selector)).filter(async webElement => { if ((await webElement.getCssValue('background')) !== 'rgb(165, 235, 255)') { return webElement } });
        //     console.info('background-color: ', await PriceBaseUnitPriceAfter1_Values[0].getCssValue('background-color'));
        // } else {
        //     PriceBaseUnitPriceAfter1_Values = await this.browser.findElements(PriceBaseUnitPriceAfter1_Selector);
        // }
        const PriceBaseUnitPriceAfter1_Values = await this.browser.findElements(PriceBaseUnitPriceAfter1_Selector);
        const PriceBaseUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceBaseUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceBaseUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceBaseUnitPriceAfter1_Value: `, PriceBaseUnitPriceAfter1_Value);

        const PriceDiscountUnitPriceAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceDiscountUnitPriceAfter1_Value',
            nameOfItem,
        );
        // let PriceDiscountUnitPriceAfter1_Values;
        // if (at === 'Cart') {
        //     PriceDiscountUnitPriceAfter1_Values = freeItem ? await this.browser.findElements(PriceDiscountUnitPriceAfter1_Selector) : (await this.browser.findElements(PriceDiscountUnitPriceAfter1_Selector)).filter(async webElement => { if ((await webElement.getAttribute('style')) === '') { return webElement } });
        // } else {
        //     PriceDiscountUnitPriceAfter1_Values = await this.browser.findElements(PriceDiscountUnitPriceAfter1_Selector);
        // }
        const PriceDiscountUnitPriceAfter1_Values = await this.browser.findElements(
            PriceDiscountUnitPriceAfter1_Selector,
        );
        const PriceDiscountUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceDiscountUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceDiscountUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceDiscountUnitPriceAfter1_Value: `, PriceDiscountUnitPriceAfter1_Value);

        const PriceGroupDiscountUnitPriceAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceGroupDiscountUnitPriceAfter1_Value',
            nameOfItem,
        );
        // let PriceGroupDiscountUnitPriceAfter1_Values;
        // if (at === 'Cart') {
        //     PriceGroupDiscountUnitPriceAfter1_Values = freeItem ? await this.browser.findElements(PriceGroupDiscountUnitPriceAfter1_Selector) : (await this.browser.findElements(PriceGroupDiscountUnitPriceAfter1_Selector)).filter(async webElement => { if ((await webElement.getAttribute('style')) === '') { return webElement } });
        // } else {
        //     PriceGroupDiscountUnitPriceAfter1_Values = await this.browser.findElements(PriceGroupDiscountUnitPriceAfter1_Selector);
        // }
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

        const PriceManualLineUnitPriceAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceManualLineUnitPriceAfter1_Value',
            nameOfItem,
        );
        // let PriceManualLineUnitPriceAfter1_Values;
        // if (at === 'Cart') {
        //     PriceManualLineUnitPriceAfter1_Values = freeItem ? await this.browser.findElements(PriceManualLineUnitPriceAfter1_Selector) : (await this.browser.findElements(PriceManualLineUnitPriceAfter1_Selector)).filter(async webElement => { if ((await webElement.getAttribute('style')) === '') { return webElement } });
        // } else {
        //     PriceManualLineUnitPriceAfter1_Values = await this.browser.findElements(PriceManualLineUnitPriceAfter1_Selector);
        // }
        const PriceManualLineUnitPriceAfter1_Values = await this.browser.findElements(
            PriceManualLineUnitPriceAfter1_Selector,
        );
        const PriceManualLineUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceManualLineUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceManualLineUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceManualLineUnitPriceAfter1_Value: `, PriceManualLineUnitPriceAfter1_Value);

        const PriceTaxUnitPriceAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceTaxUnitPriceAfter1_Value',
            nameOfItem,
        );
        // let PriceTaxUnitPriceAfter1_Values;
        // if (at === 'Cart') {
        //     PriceTaxUnitPriceAfter1_Values = freeItem ? await this.browser.findElements(PriceTaxUnitPriceAfter1_Selector) : (await this.browser.findElements(PriceTaxUnitPriceAfter1_Selector)).filter(async webElement => { if ((await webElement.getAttribute('style')) === '') { return webElement } });
        // } else {
        //     PriceTaxUnitPriceAfter1_Values = await this.browser.findElements(PriceTaxUnitPriceAfter1_Selector);
        // }
        const PriceTaxUnitPriceAfter1_Values = await this.browser.findElements(PriceTaxUnitPriceAfter1_Selector);
        const PriceTaxUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceTaxUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceTaxUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceTaxUnitPriceAfter1_Value: `, PriceTaxUnitPriceAfter1_Value);

        if (at === 'OrderCenter') {
            const NPMCalcMessage_Selector = this.orderPage[nameOfFunctionToLocateSelector](
                'NPMCalcMessage_Value',
                nameOfItem,
            );
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

    public async getItemTSAs_Discount2(
        at: 'OrderCenter' | 'Cart',
        nameOfItem: string,
        freeItem?: 'Free',
        locationInElementsArray?: number,
        view?: 'LinesView',
    ): Promise<PriceTsaDiscount2> {
        const nameOfFunctionToLocateSelector = `getSelectorOfCustomFieldIn${at}${view ? view : ''}By${
            freeItem ? freeItem : ''
        }ItemName`;

        const PriceDiscount2UnitPriceAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceDiscount2UnitPriceAfter1_Value',
            nameOfItem,
        );
        // let PriceDiscount2UnitPriceAfter1_Values;
        // if (at === 'Cart') {
        //     PriceDiscount2UnitPriceAfter1_Values = freeItem ? await this.browser.findElements(PriceDiscount2UnitPriceAfter1_Selector) : (await this.browser.findElements(PriceDiscount2UnitPriceAfter1_Selector)).filter(async webElement => { if ((await webElement.getAttribute('style')) === '') { return webElement } });
        // } else {
        //     PriceDiscount2UnitPriceAfter1_Values = await this.browser.findElements(PriceDiscount2UnitPriceAfter1_Selector);
        // }
        const PriceDiscount2UnitPriceAfter1_Values = await this.browser.findElements(
            PriceDiscount2UnitPriceAfter1_Selector,
        );
        const PriceDiscount2UnitPriceAfter1_Value = locationInElementsArray
            ? await PriceDiscount2UnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceDiscount2UnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceDiscount2UnitPriceAfter1_Value: `, PriceDiscount2UnitPriceAfter1_Value);

        this.browser.sleep(0.1 * 1000);
        return {
            PriceDiscount2UnitPriceAfter1: Number(PriceDiscount2UnitPriceAfter1_Value.split(' ')[1].trim()),
        };
    }

    public async getItemTSAs_AOQM_UOM2(
        at: 'OrderCenter' | 'Cart',
        nameOfItem: string,
        freeItem?: 'Free',
        locationInElementsArray?: number,
        view?: 'LinesView',
    ): Promise<PriceTsaFieldsUom2> {
        const nameOfFunctionToLocateSelector = `getSelectorOfCustomFieldIn${at}${view ? view : ''}By${
            freeItem ? freeItem : ''
        }ItemName`;

        const PriceBaseUnitPriceAfter2_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceBaseUnitPriceAfter2_Value',
            nameOfItem,
        );
        // let PriceBaseUnitPriceAfter2_Values;
        // if (at === 'Cart') {
        //     PriceBaseUnitPriceAfter2_Values = freeItem ? await this.browser.findElements(PriceBaseUnitPriceAfter2_Selector) : (await this.browser.findElements(PriceBaseUnitPriceAfter2_Selector)).filter(async webElement => { if ((await webElement.getCssValue('background')) !== 'rgb(165, 235, 255)') { return webElement } });
        //     console.info('background-color: ', await PriceBaseUnitPriceAfter2_Values[0].getCssValue('background-color'));
        // } else {
        //     PriceBaseUnitPriceAfter2_Values = await this.browser.findElements(PriceBaseUnitPriceAfter2_Selector);
        // }
        const PriceBaseUnitPriceAfter2_Values = await this.browser.findElements(PriceBaseUnitPriceAfter2_Selector);
        const PriceBaseUnitPriceAfter2_Value = locationInElementsArray
            ? await PriceBaseUnitPriceAfter2_Values[locationInElementsArray].getText()
            : await PriceBaseUnitPriceAfter2_Values[0].getText();
        console.info(`${nameOfItem} PriceBaseUnitPriceAfter2_Value: `, PriceBaseUnitPriceAfter2_Value);

        const PriceDiscountUnitPriceAfter2_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceDiscountUnitPriceAfter2_Value',
            nameOfItem,
        );
        // let PriceDiscountUnitPriceAfter2_Values;
        // if (at === 'Cart') {
        //     PriceDiscountUnitPriceAfter2_Values = freeItem ? await this.browser.findElements(PriceDiscountUnitPriceAfter2_Selector) : (await this.browser.findElements(PriceDiscountUnitPriceAfter2_Selector)).filter(async webElement => { if ((await webElement.getAttribute('style')) === '') { return webElement } });
        // } else {
        //     PriceDiscountUnitPriceAfter2_Values = await this.browser.findElements(PriceDiscountUnitPriceAfter2_Selector);
        // }
        const PriceDiscountUnitPriceAfter2_Values = await this.browser.findElements(
            PriceDiscountUnitPriceAfter2_Selector,
        );
        const PriceDiscountUnitPriceAfter2_Value = locationInElementsArray
            ? await PriceDiscountUnitPriceAfter2_Values[locationInElementsArray].getText()
            : await PriceDiscountUnitPriceAfter2_Values[0].getText();
        console.info(`${nameOfItem} PriceDiscountUnitPriceAfter2_Value: `, PriceDiscountUnitPriceAfter2_Value);

        const PriceTaxUnitPriceAfter2_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceTaxUnitPriceAfter2_Value',
            nameOfItem,
        );
        // let PriceTaxUnitPriceAfter2_Values;
        // if (at === 'Cart') {
        //     PriceTaxUnitPriceAfter2_Values = freeItem ? await this.browser.findElements(PriceTaxUnitPriceAfter2_Selector) : (await this.browser.findElements(PriceTaxUnitPriceAfter2_Selector)).filter(async webElement => { if ((await webElement.getAttribute('style')) === '') { return webElement } });
        // } else {
        //     PriceTaxUnitPriceAfter2_Values = await this.browser.findElements(PriceTaxUnitPriceAfter2_Selector);
        // }
        const PriceTaxUnitPriceAfter2_Values = await this.browser.findElements(PriceTaxUnitPriceAfter2_Selector);
        const PriceTaxUnitPriceAfter2_Value = locationInElementsArray
            ? await PriceTaxUnitPriceAfter2_Values[locationInElementsArray].getText()
            : await PriceTaxUnitPriceAfter2_Values[0].getText();
        console.info(`${nameOfItem} PriceTaxUnitPriceAfter2_Value: `, PriceTaxUnitPriceAfter2_Value);

        this.browser.sleep(0.1 * 1000);
        return {
            PriceBaseUnitPriceAfter2: Number(PriceBaseUnitPriceAfter2_Value.split(' ')[1].trim()),
            PriceDiscountUnitPriceAfter2: Number(PriceDiscountUnitPriceAfter2_Value.split(' ')[1].trim()),
            PriceTaxUnitPriceAfter2: Number(PriceTaxUnitPriceAfter2_Value.split(' ')[1].trim()),
        };
    }

    public async getTotalsTSAsOfItem(
        at: 'OrderCenter' | 'Cart',
        nameOfItem: string,
        freeItem?: 'Free',
        locationInElementsArray?: number,
        view?: 'LinesView',
    ): Promise<PriceTotalsTsaFields> {
        const nameOfFunctionToLocateSelector = `getSelectorOfCustomFieldIn${at}${view ? view : ''}By${
            freeItem ? freeItem : ''
        }ItemName`;

        const PriceTaxTotal_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceTaxTotal_Value',
            nameOfItem,
        );

        const PriceTaxTotal_Values = await this.browser.findElements(PriceTaxTotal_Selector);
        const PriceTaxTotal_Value = locationInElementsArray
            ? await PriceTaxTotal_Values[locationInElementsArray].getText()
            : await PriceTaxTotal_Values[0].getText();
        console.info(`${nameOfItem} PriceTaxTotal_Value: `, PriceTaxTotal_Value);

        const PriceTaxTotalPercent_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceTaxTotalPercent_Value',
            nameOfItem,
        );

        const PriceTaxTotalPercent_Values = await this.browser.findElements(PriceTaxTotalPercent_Selector);
        const PriceTaxTotalPercent_Value = locationInElementsArray
            ? await PriceTaxTotalPercent_Values[locationInElementsArray].getText()
            : await PriceTaxTotalPercent_Values[0].getText();
        console.info(`${nameOfItem} PriceTaxTotalPercent_Value: `, PriceTaxTotalPercent_Value);

        const PriceTaxTotalDiff_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceTaxTotalDiff_Value',
            nameOfItem,
        );

        const PriceTaxTotalDiff_Values = await this.browser.findElements(PriceTaxTotalDiff_Selector);
        const PriceTaxTotalDiff_Value = locationInElementsArray
            ? await PriceTaxTotalDiff_Values[locationInElementsArray].getText()
            : await PriceTaxTotalDiff_Values[0].getText();
        console.info(`${nameOfItem} PriceTaxTotalDiff_Value: `, PriceTaxTotalDiff_Value);

        const PriceTaxUnitDiff_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceTaxUnitDiff_Value',
            nameOfItem,
        );

        const PriceTaxUnitDiff_Values = await this.browser.findElements(PriceTaxUnitDiff_Selector);
        const PriceTaxUnitDiff_Value = locationInElementsArray
            ? await PriceTaxUnitDiff_Values[locationInElementsArray].getText()
            : await PriceTaxUnitDiff_Values[0].getText();
        console.info(`${nameOfItem} PriceTaxUnitDiff_Value: `, PriceTaxUnitDiff_Value);

        this.browser.sleep(0.1 * 1000);
        return {
            PriceTaxTotal: Number(PriceTaxTotal_Value.split(' ')[1].trim()),
            PriceTaxTotalPercent: Number(PriceTaxTotalPercent_Value.split(' ')[1].trim()),
            PriceTaxTotalDiff: Number(PriceTaxTotalDiff_Value.split(' ')[1].trim()),
            PriceTaxUnitDiff: Number(PriceTaxUnitDiff_Value.split(' ')[1].trim()),
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
        uomValue: string,
        nameOfItem: string,
        quantityOfItem: number,
        driver: Browser,
        aoqm?: '2',
    ): Promise<void> {
        const orderPage = new OrderPage(driver);
        const uomValueSplited = uomValue.split('&');
        const uomToSet = uomValueSplited[0];
        const isTotals = uomValueSplited[1];
        const uomSelector = orderPage[`UnitOfMeasure${aoqm ? '2' : ''}_Selector_Value`];
        driver.sleep(0.05 * 1000);
        let itemUomValue = await driver.findElement(uomSelector);
        if ((await itemUomValue.getText()) !== uomToSet) {
            await driver.click(uomSelector);
            driver.sleep(0.05 * 1000);
            await driver.click(orderPage.getSelectorOfUnitOfMeasureOptionByText(uomToSet, aoqm ? aoqm : undefined));
            driver.sleep(0.1 * 1000);
            await driver.click(orderPage.ItemQuantity_NumberOfUnits_Readonly); // clicking on "neutral" element to make the previously selected element de-actived
            driver.sleep(0.1 * 1000);
            itemUomValue = await driver.findElement(uomSelector);
        }
        driver.sleep(0.05 * 1000);
        await orderPage.isSpinnerDone();
        expect(await itemUomValue.getText()).equals(uomToSet);
        const quantitySelector = orderPage.getSelectorOfCustomFieldInOrderCenterByItemName(
            `ItemQuantity${aoqm ? '2' : ''}_byUOM_InteractableNumber`,
            nameOfItem,
        );
        const uomXnumber = await driver.findElement(quantitySelector);
        for (let i = 0; i < 6; i++) {
            await uomXnumber.sendKeys(Key.BACK_SPACE);
            driver.sleep(0.01 * 1000);
        }
        driver.sleep(0.05 * 1000);
        await uomXnumber.sendKeys(quantityOfItem);
        await orderPage.isSpinnerDone();
        driver.sleep(0.05 * 1000);
        await driver.click(orderPage.ItemQuantity_NumberOfUnits_Readonly); // clicking on "neutral" element to make the previously selected element de-actived
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
            case 'Box':
                expect(Number(numberOfUnits)).equals(Number(numberByUOM) * 24);
                break;
            default:
                if (isTotals === 'Totals') {
                    const otherQuantitySelector = orderPage.getSelectorOfCustomFieldInOrderCenterByItemName(
                        `ItemQuantity${aoqm ? '' : '2'}_byUOM_InteractableNumber`,
                        nameOfItem,
                    );
                    const otherQty = await (await driver.findElement(otherQuantitySelector)).getAttribute('title');
                    if (aoqm === '2') {
                        const uom1 = await (await driver.findElement(orderPage.UnitOfMeasure_Selector_Value)).getText();
                        const multiplier1 = uom1 === 'Case' ? 6 : uom1 === 'Box' ? 24 : 1;
                        const units1 = Number(otherQty) * multiplier1;
                        const units2 = Number(numberByUOM) * (uomToSet === 'Case' ? 6 : uomToSet === 'Box' ? 24 : 1);
                        console.info(
                            `at changeSelectedQuantityOfSpecificItemInOrderCenter(), case: "${uomValue}", units1: `,
                            units1,
                            'units2: ',
                            units2,
                            'total: ',
                            units1 + units2,
                        );
                        expect(Number(numberOfUnits)).equals(units1 + units2);
                    } else {
                        const uom2 = await (
                            await driver.findElement(orderPage.UnitOfMeasure2_Selector_Value)
                        ).getText();
                        const multiplier2 = uom2 === 'Case' ? 6 : uom2 === 'Box' ? 24 : 1;
                        const units1 = Number(numberByUOM) * (uomToSet === 'Case' ? 6 : uomToSet === 'Box' ? 24 : 1);
                        const units2 = Number(otherQty) * multiplier2;
                        console.info(
                            `at changeSelectedQuantityOfSpecificItemInOrderCenter(), case: "${uomValue}", units1: `,
                            units1,
                            'units2: ',
                            units2,
                            'total: ',
                            units1 + units2,
                        );
                        expect(Number(numberOfUnits)).equals(units1 + units2);
                    }
                }
                break;
        }
        driver.sleep(0.05 * 1000);
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
