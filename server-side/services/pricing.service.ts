import { Browser } from '../ui-tests/utilities/browser';
import { expect } from 'chai';
import { Key, WebElement } from 'selenium-webdriver';
import { Context } from 'mocha';
import { WebAppLoginPage, WebAppHomePage, WebAppHeader, WebAppList, WebAppTopBar, WebAppDialog } from '../ui-tests/pom';
import { OrderPage } from '../ui-tests/pom/Pages/OrderPage';
import addContext from 'mochawesome/addContext';
import GeneralService from './general.service';

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

export interface PriceMultiTsaFields {
    PriceMultiAfter1: number;
    PriceMultiAfter2: number;
    PriceMultiAccountAfter1: number;
    PriceMultiAccountAfter2: number;
    PriceMultiCategoryAfter1: number;
    PriceMultiCategoryAfter2: number;
    PriceMultiItemAfter1: number;
    PriceMultiItemAfter2: number;
}

export interface PricePartialTsaFields {
    PricePartial: number;
}

export class PricingService {
    public browser: Browser;
    public generalService: GeneralService | undefined;
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
        driver: Browser,
        webAppLoginPage: WebAppLoginPage,
        webAppHomePage: WebAppHomePage,
        webAppHeader: WebAppHeader,
        webAppList: WebAppList,
        webAppTopBar: WebAppTopBar,
        webAppDialog: WebAppDialog,
        orderPage: OrderPage,
        generalService?: GeneralService,
    ) {
        this.browser = driver;
        this.generalService = generalService;
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

    /** */
    public async uploadConfiguration(payload: any) {
        const uploadConfigResponse =
            this.generalService &&
            (await this.generalService.fetchStatus(
                `/addons/api/adb3c829-110c-4706-9168-40fba9c0eb52/api/configuration`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        Key: 'main',
                        Config: JSON.stringify(payload),
                    }),
                },
            ));
        console.info('uploadConfigResponse: ', JSON.stringify(uploadConfigResponse, null, 2));
        expect(uploadConfigResponse?.Ok).to.equal(true);
        expect(uploadConfigResponse?.Status).to.equal(200);
        expect(Object.keys(uploadConfigResponse?.Body)).to.eql([
            'ModificationDateTime',
            'Hidden',
            'CreationDateTime',
            'Config',
            'Key',
        ]);
        expect(uploadConfigResponse?.Body.Key).to.equal('main');
    }

    /** */
    public async getConfiguration() {
        const getConfigResponse =
            this.generalService &&
            (await this.generalService.fetchStatus(
                `/addons/api/adb3c829-110c-4706-9168-40fba9c0eb52/api/configuration`,
            ));
        console.info('getConfigResponse: ', JSON.stringify(getConfigResponse, null, 2));
        if (getConfigResponse && getConfigResponse.Body[0].Config) {
            const configurationObj = getConfigResponse.Body[0].Config;
            return JSON.parse(configurationObj);
        }
    }

    /** */
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

    /** */
    public async getItemTotalAmount(
        at: 'OrderCenter' | 'Cart',
        itemName: string,
        freeItem?: 'Free',
        locationInElementsArray?: number,
        view?: 'LinesView',
    ): Promise<number> {
        const nameOfFunctionToLocateSelector = `getSelectorOfNumberOfUnitsIn${at}${view ? view : ''}By${
            freeItem ? freeItem : ''
        }ItemName`;
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
                // const totalOfUnitsByLocationAsNum = Number(
                //     await arrOfTotalOfUnitsMinusFree[locationInElementsArray].getAttribute('title'),
                // );
                const totalOfUnitsByLocationAsNum = Number(
                    await arrOfTotalOfUnitsMinusFree[locationInElementsArray].getText(),
                );
                console.info(
                    'at getItemTotalAmount function -> totalOfUnitsByLocationAsNum: ',
                    totalOfUnitsByLocationAsNum,
                );
                return totalOfUnitsByLocationAsNum;
            }
            // const totalOfUnitsFirstInArrAsNum = Number(await arrOfTotalOfUnitsMinusFree[0].getAttribute('title'));
            const totalOfUnitsFirstInArrAsNum = Number(await arrOfTotalOfUnitsMinusFree[0].getText());
            console.info(
                'at getItemTotalAmount function -> totalOfUnitsFirstInArrAsNum: ',
                totalOfUnitsFirstInArrAsNum,
            );
            return totalOfUnitsFirstInArrAsNum;
        }
        // const totalOfUnitsAsNum = Number(await arrOfTotalOfUnits[0].getAttribute('title'));
        const totalOfUnitsAsNum = Number(await arrOfTotalOfUnits[0].getText());
        console.info('at getItemTotalAmount function -> totalOfUnitsAsNum: ', totalOfUnitsAsNum);
        return totalOfUnitsAsNum;
    }

    /** */
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
        const PriceBaseUnitPriceAfter1_Values = await this.browser.findElements(PriceBaseUnitPriceAfter1_Selector);
        const PriceBaseUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceBaseUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceBaseUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceBaseUnitPriceAfter1_Value: `, PriceBaseUnitPriceAfter1_Value);

        const PriceDiscountUnitPriceAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
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

        const PriceGroupDiscountUnitPriceAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
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

        const PriceManualLineUnitPriceAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
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

        const PriceTaxUnitPriceAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceTaxUnitPriceAfter1_Value',
            nameOfItem,
        );
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

    /** */
    public async getItemNPMCalcMessage(
        at: 'OrderCenter' | 'Cart',
        nameOfItem: string,
        freeItem?: 'Free',
        locationInElementsArray?: number,
        view?: 'LinesView',
    ): Promise<{ NPMCalcMessage: [any] }> {
        const nameOfFunctionToLocateSelector = `getSelectorOfCustomFieldIn${at}${view ? view : ''}By${
            freeItem ? freeItem : ''
        }ItemName`;
        const NPMCalcMessage_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'NPMCalcMessage_Value',
            nameOfItem,
        );
        const NPMCalcMessage_Elements = await this.browser.findElements(NPMCalcMessage_Selector);
        const NPMCalcMessage_Element = locationInElementsArray
            ? NPMCalcMessage_Elements[locationInElementsArray]
            : NPMCalcMessage_Elements[0];
        const NPMCalcMessage_Value = await NPMCalcMessage_Element.getText();
        console.info(`${nameOfItem} NPMCalcMessage_Value: `, NPMCalcMessage_Value);

        this.browser.sleep(0.1 * 1000);
        return {
            NPMCalcMessage: JSON.parse(NPMCalcMessage_Value),
        };
    }

    /** */
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

    /** */
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

    /** */
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

    /** */
    public async getTSAsOfMultiPerItem(
        at: 'OrderCenter' | 'Cart',
        nameOfItem: string,
        freeItem?: 'Free',
        locationInElementsArray?: number,
        view?: 'LinesView',
    ): Promise<PriceMultiTsaFields> {
        const nameOfFunctionToLocateSelector = `getSelectorOfCustomFieldIn${at}${view ? view : ''}By${
            freeItem ? freeItem : ''
        }ItemName`;

        const PriceMultiAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceMultiAfter1_Value',
            nameOfItem,
        );

        const PriceMultiAfter1_Values = await this.browser.findElements(PriceMultiAfter1_Selector);
        const PriceMultiAfter1_Value = locationInElementsArray
            ? await PriceMultiAfter1_Values[locationInElementsArray].getText()
            : await PriceMultiAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceMultiAfter1_Value_Value: `, PriceMultiAfter1_Value);

        const PriceMultiAfter2_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceMultiAfter2_Value',
            nameOfItem,
        );

        const PriceMultiAfter2_Values = await this.browser.findElements(PriceMultiAfter2_Selector);
        const PriceMultiAfter2_Value = locationInElementsArray
            ? await PriceMultiAfter2_Values[locationInElementsArray].getText()
            : await PriceMultiAfter2_Values[0].getText();
        console.info(`${nameOfItem} PriceMultiAfter2_Value: `, PriceMultiAfter2_Value);

        const PriceMultiAccountAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceMultiAccountAfter1_Value',
            nameOfItem,
        );

        const PriceMultiAccountAfter1_Values = await this.browser.findElements(PriceMultiAccountAfter1_Selector);
        const PriceMultiAccountAfter1_Value = locationInElementsArray
            ? await PriceMultiAccountAfter1_Values[locationInElementsArray].getText()
            : await PriceMultiAccountAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceMultiAccountAfter1_Value_Value: `, PriceMultiAccountAfter1_Value);

        const PriceMultiAccountAfter2_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceMultiAccountAfter2_Value',
            nameOfItem,
        );

        const PriceMultiAccountAfter2_Values = await this.browser.findElements(PriceMultiAccountAfter2_Selector);
        const PriceMultiAccountAfter2_Value = locationInElementsArray
            ? await PriceMultiAccountAfter2_Values[locationInElementsArray].getText()
            : await PriceMultiAccountAfter2_Values[0].getText();
        console.info(`${nameOfItem} PriceMultiAccountAfter2_Value: `, PriceMultiAccountAfter2_Value);

        const PriceMultiCategoryAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceMultiCategoryAfter1_Value',
            nameOfItem,
        );

        const PriceMultiCategoryAfter1_Values = await this.browser.findElements(PriceMultiCategoryAfter1_Selector);
        const PriceMultiCategoryAfter1_Value = locationInElementsArray
            ? await PriceMultiCategoryAfter1_Values[locationInElementsArray].getText()
            : await PriceMultiCategoryAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceMultiCategoryAfter1_Value: `, PriceMultiCategoryAfter1_Value);

        const PriceMultiCategoryAfter2_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceMultiCategoryAfter2_Value',
            nameOfItem,
        );

        const PriceMultiCategoryAfter2_Values = await this.browser.findElements(PriceMultiCategoryAfter2_Selector);
        const PriceMultiCategoryAfter2_Value = locationInElementsArray
            ? await PriceMultiCategoryAfter2_Values[locationInElementsArray].getText()
            : await PriceMultiCategoryAfter2_Values[0].getText();
        console.info(`${nameOfItem} PriceMultiCategoryAfter2_Value: `, PriceMultiCategoryAfter2_Value);

        const PriceMultiItemAfter1_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceMultiItemAfter1_Value',
            nameOfItem,
        );

        const PriceMultiItemAfter1_Values = await this.browser.findElements(PriceMultiItemAfter1_Selector);
        const PriceMultiItemAfter1_Value = locationInElementsArray
            ? await PriceMultiItemAfter1_Values[locationInElementsArray].getText()
            : await PriceMultiItemAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceMultiItemAfter1_Value: `, PriceMultiItemAfter1_Value);

        const PriceMultiItemAfter2_Selector = this.orderPage[nameOfFunctionToLocateSelector](
            'PriceMultiItemAfter2_Value',
            nameOfItem,
        );

        const PriceMultiItemAfter2_Values = await this.browser.findElements(PriceMultiItemAfter2_Selector);
        const PriceMultiItemAfter2_Value = locationInElementsArray
            ? await PriceMultiItemAfter2_Values[locationInElementsArray].getText()
            : await PriceMultiItemAfter2_Values[0].getText();
        console.info(`${nameOfItem} PriceMultiItemAfter2_Value: `, PriceMultiItemAfter2_Value);

        this.browser.sleep(0.1 * 1000);
        return {
            PriceMultiAfter1: Number(PriceMultiAfter1_Value.split(' ')[1].trim()),
            PriceMultiAfter2: Number(PriceMultiAfter2_Value.split(' ')[1].trim()),
            PriceMultiAccountAfter1: Number(PriceMultiAccountAfter1_Value.split(' ')[1].trim()),
            PriceMultiAccountAfter2: Number(PriceMultiAccountAfter2_Value.split(' ')[1].trim()),
            PriceMultiCategoryAfter1: Number(PriceMultiCategoryAfter1_Value.split(' ')[1].trim()),
            PriceMultiCategoryAfter2: Number(PriceMultiCategoryAfter2_Value.split(' ')[1].trim()),
            PriceMultiItemAfter1: Number(PriceMultiItemAfter1_Value.split(' ')[1].trim()),
            PriceMultiItemAfter2: Number(PriceMultiItemAfter2_Value.split(' ')[1].trim()),
        };
    }

    /** */
    public async getTSAsOfPartialPerItem(
        at: 'OrderCenter' | 'Cart',
        nameOfItem: string,
        freeItem?: 'Free',
        locationInElementsArray?: number,
        view?: 'LinesView',
    ): Promise<PricePartialTsaFields> {
        const nameOfFunctionToLocateSelector = `getSelectorOfCustomFieldIn${at}${view ? view : ''}By${
            freeItem ? freeItem : ''
        }ItemName`;

        const PricePartial_Selector = this.orderPage[nameOfFunctionToLocateSelector]('PricePartial_Value', nameOfItem);

        const PricePartial_Values = await this.browser.findElements(PricePartial_Selector);
        const PricePartial_Value = locationInElementsArray
            ? await PricePartial_Values[locationInElementsArray].getText()
            : await PricePartial_Values[0].getText();
        console.info(`${nameOfItem} PricePartial_Value_Value: `, PricePartial_Value);

        this.browser.sleep(0.1 * 1000);
        return {
            PricePartial: Number(PricePartial_Value.split(' ')[1].trim()),
        };
    }

    /** */
    public async changeValueOfTSAUserLineDiscountOfSpecificItem(changeTo: string, nameOfItem: string): Promise<void> {
        const UserLineDiscount_Selector = this.orderPage.getSelectorOfCustomFieldInOrderCenterByItemName(
            'UserLineDiscount_Value',
            nameOfItem,
        );
        const UserLineDiscount_containerSelector = this.orderPage.getSelectorOfCustomFieldInOrderCenterByItemName(
            'UserLineDiscount_Container',
            nameOfItem,
        );
        const UserLineDiscount_inputSelector = this.orderPage.getSelectorOfCustomFieldInOrderCenterByItemName(
            'UserLineDiscount_Container',
            nameOfItem,
        );
        const UserLineDiscount_inputContainerSelector = this.orderPage.getSelectorOfCustomFieldInOrderCenterByItemName(
            'UserLineDiscount_InputContainer',
            nameOfItem,
        );
        const UserLineDiscount_Element = await this.browser.findElement(UserLineDiscount_Selector);
        console.info(`${nameOfItem} UserLineDiscount_Value: `, await UserLineDiscount_Element.getText());
        await UserLineDiscount_Element.click();
        const UserLineDiscount_containerElement = await this.browser.findElement(UserLineDiscount_containerSelector);
        const UserLineDiscount_inputContainerElement = await this.browser.findElement(
            UserLineDiscount_inputContainerSelector,
        );
        console.info(`${nameOfItem} UserLineDiscount_Value: `, await UserLineDiscount_containerElement.getText());
        console.info(
            `${nameOfItem} UserLineDiscount_Container Inner HTML: `,
            await UserLineDiscount_containerElement.getAttribute('innerHTML'),
        );
        console.info(
            `${nameOfItem} UserLineDiscount_InputContainer Inner HTML: `,
            await UserLineDiscount_inputContainerElement.getAttribute('innerHTML'),
        );
        this.browser.sleep(0.05 * 1000);
        const UserLineDiscount_inputElement = await this.browser.findElement(UserLineDiscount_inputSelector);
        console.info(`${nameOfItem} UserLineDiscount_Input text: `, await UserLineDiscount_inputElement.getText());
        await this.browser.sendStringWithoutElement(changeTo);
        this.browser.sleep(0.05 * 1000);
        await this.browser.click(this.orderPage.TransactionID); // getting the input out of focus
        await this.orderPage.isSpinnerDone();
        this.browser.sleep(0.1 * 1000);
    }

    /* UI FUNCTION: */
    public async searchInOrderCenter(this: Context, nameOfItem: string, driver: Browser): Promise<void> {
        const orderPage = new OrderPage(driver);
        await orderPage.isSpinnerDone();
        const searchInput = await driver.findElement(orderPage.Search_Input);
        await searchInput.clear();
        driver.sleep(0.1 * 1000);
        await searchInput.sendKeys(nameOfItem + '\n');
        driver.sleep(0.5 * 1000);
        await driver.click(orderPage.OrderCenter_Headline_Results_Number);
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

    /* UI FUNCTION: specify uom ('Each' | 'Case' | 'Box') at uomValue. if TOTALS are required the string '&Totals' should be added to the uom specified. the function do not perform a search before change */
    public async changeSelectedQuantityOfSpecificItemInOrderCenter(
        // for calculation of both AOQM fields "&Totals" needs to be added to uomValue
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

    /* UI FUNCTION: specify uom ('Each' | 'Case' | 'Box'), item name and desired quantity. the function do not perform a search before change */
    public async changeSelectedQuantityOfSpecificItemInCart(
        this: Context,
        uomValue: string, // 'Each' | 'Case' | 'Box'
        nameOfItem: string,
        quantityOfItem: number,
        driver: Browser,
        view?: 'LinesView',
    ): Promise<void> {
        const orderPage = new OrderPage(driver);
        const nameOfFunctionToLocateSelectorOfUnitsQuantity = `getSelectorOfNumberOfUnitsInCart${
            view ? view : ''
        }ByItemName`;
        const nameOfFunctionToLocateSelectorOfUomValue = `getSelectorOfUomValueInCart${view ? view : ''}ByItemName`;
        const nameOfFunctionToLocateSelectorOfCustomField = `getSelectorOfCustomFieldInCart${
            view ? view : ''
        }ByItemName`;
        driver.sleep(0.05 * 1000);
        let itemUomValue: WebElement = await driver.findElement(
            orderPage[nameOfFunctionToLocateSelectorOfUomValue](nameOfItem),
        );
        if ((await itemUomValue.getText()) !== uomValue) {
            await itemUomValue.click();
            driver.sleep(0.05 * 1000);
            await driver.click(orderPage.getSelectorOfUnitOfMeasureOptionByText(uomValue));
            driver.sleep(0.1 * 1000);
            await driver.click(orderPage.TopBar);
            driver.sleep(0.1 * 1000);
            itemUomValue = await driver.findElement(orderPage[nameOfFunctionToLocateSelectorOfUomValue](nameOfItem));
        }
        driver.sleep(0.05 * 1000);
        await orderPage.isSpinnerDone();
        itemUomValue = await driver.findElement(orderPage[nameOfFunctionToLocateSelectorOfUomValue](nameOfItem));
        driver.sleep(0.1 * 1000);
        expect(await itemUomValue.getText()).equals(uomValue);
        let uomXnumber = await driver.findElement(
            orderPage[nameOfFunctionToLocateSelectorOfCustomField]('ItemQuantity_byUOM_InteractableNumber', nameOfItem),
        );
        for (let i = 0; i < 6; i++) {
            await uomXnumber.sendKeys(Key.BACK_SPACE);
            driver.sleep(0.01 * 1000);
        }
        driver.sleep(0.05 * 1000);
        await uomXnumber.sendKeys(quantityOfItem);
        await orderPage.isSpinnerDone();
        driver.sleep(0.05 * 1000);
        await driver.click(orderPage.TopBar);
        driver.sleep(1 * 1000);
        uomXnumber = await driver.findElement(
            orderPage[nameOfFunctionToLocateSelectorOfCustomField]('ItemQuantity_byUOM_InteractableNumber', nameOfItem),
        );
        driver.sleep(1 * 1000);
        await orderPage.isSpinnerDone();
        expect(Number(await uomXnumber.getAttribute('title'))).equals(quantityOfItem);
        driver.sleep(0.2 * 1000);
        const numberOfUnits = await driver.findElement(
            orderPage[nameOfFunctionToLocateSelectorOfUnitsQuantity](nameOfItem),
        );
        driver.sleep(1 * 1000);
        // const unitsQuantity_number = Number(await numberOfUnits.getAttribute('title'));
        const unitsQuantity_number = Number(await numberOfUnits.getText());
        const uomXnumber_num = Number(await uomXnumber.getAttribute('title'));
        switch (uomValue) {
            case 'Each':
                expect(unitsQuantity_number).equals(uomXnumber_num);
                break;
            case 'Case':
                expect(unitsQuantity_number).equals(uomXnumber_num * 6);
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

    /* UI FUNCTION: pressing button with X icon that belongs to search component */
    public async clearOrderCenterSearch(): Promise<void> {
        await this.orderPage.isSpinnerDone();
        await this.browser.click(this.orderPage.Search_X_Button);
        this.browser.sleep(0.1 * 1000);
        await this.orderPage.isSpinnerDone();
    }
}
