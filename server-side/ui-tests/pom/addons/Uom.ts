import { expect } from 'chai';
import { By, Key, WebElement } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppSettingsSidePanel, WebAppTopBar } from '..';
import { OrderPage } from '../Pages/OrderPage';
import { AddonLoadCondition } from './base/AddonPage';
import { ObjectTypeEditor } from './ObjectTypeEditor';

export class Uom extends AddonPage {
    //UOM Addon Locators
    public UomHeader: By = By.xpath("//h1[contains(text(),'UOM')]");
    public UomInstalledHeader: By = By.xpath("//b[contains(text(),'Configuration Field')]");
    public UomInstallBtn: By = By.css("[data-qa='install']");
    public UomDropDownFields: By = By.xpath("(//div[contains(@class,'mat-select-arrow-wrapper')])");
    public UomSaveBtn: By = By.css("[data-qa='Save']");
    public NonUomTypeItemInOrder: By = By.xpath('//fieldset');
    public UomTypeItemInOrder: By = By.xpath("//pep-select[@class='ng-star-inserted']//div//span[@title='AOQM_UOM2']");
    public TransLineField: By = By.xpath("//div[text()='Custom Transaction line-item Fields']");

    /**
     *
     * configuration of UOM ATD for auto test
     */
    public async configUomATD(): Promise<void> {
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
        expect(await this.isEditorHiddenTabExist('DataCustomization', 45000)).to.be.true;
        expect(await this.isEditorTabVisible('GeneralInfo')).to.be.true;
        await this.browser.switchToDefaultContent();
        await this.selectTabByText('Uom');
        //validate uom is loaded both if installed and if not
        expect(await this.browser.untilIsVisible(this.UomHeader, 15000)).to.be.true;
        //testing whether already installed - after loading anyway
        if (await (await this.browser.findElement(this.UomInstallBtn)).isDisplayed()) {
            await this.browser.click(this.UomInstallBtn);
            const webAppDialog = new WebAppDialog(this.browser);
            // ****text not finalized yet - once will be the test is relevant****
            // const isPupUP = await (await this.browser.findElement(webAppDialog.Content)).getText();
            // expect(isPupUP).to.equal('Are you sure you want to apply the module on the transaction?');
            await webAppDialog.selectDialogBox('ok');
            await this.isSpinnerDone();
        }
        expect(await this.browser.untilIsVisible(this.UomInstalledHeader, 15000)).to.be.true;
        await this.selectTabByText('General');
        const objectTypeEditor = new ObjectTypeEditor(this.browser);
        await objectTypeEditor.addATDCalculatedField(
            {
                Label: 'AllowedUomFieldsForTest',
                CalculatedRuleEngine: {
                    JSFormula:
                        "return ItemMainCategory==='uom item'?JSON.stringify(['Bx','SIN', 'DOU', 'TR', 'QU','PK','CS']):null;",
                },
            },
            true,
            'ItemMainCategory',
        );
        await this.browser.switchToDefaultContent();
        await this.selectTabByText('General');
        //**first testing phase will be performed w/o this feature - second will test this only**
        await objectTypeEditor.addATDCalculatedField(
            {
                Label: 'ItemConfig',
                CalculatedRuleEngine: {
                    JSFormula: `return null;`,
                },
            },
            true,
        );
        await this.browser.switchToDefaultContent();
        await this.selectTabByText('General');
        await objectTypeEditor.addATDCalculatedField(
            {
                Label: 'UomValues',
                CalculatedRuleEngine: {
                    JSFormula: `return JSON.stringify(["Bx","SIN", "DOU", "TR", "QU","PK","CS"]);`,
                },
            },
            true,
        );
        await this.browser.switchToDefaultContent();
        await this.selectTabByText('General');
        await objectTypeEditor.addATDCalculatedField(
            {
                Label: 'ConstInventory',
                CalculatedRuleEngine: {
                    JSFormula: `return 48;`,
                },
            },
            true,
            undefined,
            'Number',
        );
        await this.configUomFieldsAndMediumView();
        return;
    }

    /**
     * configure UOM ATD with previously created fields and configure the medium view of the UOM ATD for UI testing
     */
    public async configUomFieldsAndMediumView(): Promise<void> {
        await this.configureUomDataFields(
            'AllowedUomFieldsForTest',
            'ItemConfig',
            'ConstInventory',
            'Fix Quantity',
            'Fix Quantity',
            'Fix Quantity',
        );
        const objectTypeEditor = new ObjectTypeEditor(this.browser);
        try {
            await objectTypeEditor.enterATDView('Order Center Views', 'Medium Thumbnails View');
        } catch (Error) {
            //in case medium view isnt added yet
            await this.browser.switchToDefaultContent();
            await this.selectTabByText('General');
            await objectTypeEditor.addViewToATD('Order Center Views', 'Medium Thumbnails View');
            await objectTypeEditor.enterATDView('Order Center Views', 'Medium Thumbnails View');
        }
        this.browser.sleep(7500);
        await this.browser.click(this.RepViewEditIcon);
        await this.deleteAllFieldFromUIControl();
        await this.setFieldsInUIControl(
            'Item External ID',
            'Item Price',
            'AOQM_UOM1',
            'AOQM_QUANTITY1',
            'AOQM_UOM2',
            'AOQM_QUANTITY2',
            'UomValues',
            'ConstInventory',
            'Transaction Total Sum',
            'ItemConfig',
            'Item ID',
            'Unit Quantity',
        );
        this.browser.sleep(2000);
        await this.browser.click(this.SaveUIControlBtn);
        this.browser.sleep(3500);
    }

    public async editItemConfigField(nameOfATD: string): Promise<void> {
        const webAppHeader = new WebAppHeader(this.browser);
        await this.browser.click(webAppHeader.Settings);
        this.browser.sleep(1500);
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Sales Activities');
        await this.browser.click(webAppSettingsSidePanel.ObjectEditorTransactions);
        await this.isSpinnerDone();
        this.browser.sleep(4000);

        const webAppTopBar = new WebAppTopBar(this.browser);
        await this.sendKeys(webAppTopBar.EditorSearchField, nameOfATD + Key.ENTER);

        const webAppList = new WebAppList(this.browser);
        await webAppList.clickOnLinkFromListRowWebElement();
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
        expect(await this.isEditorHiddenTabExist('DataCustomization', 45000)).to.be.true;
        expect(await this.isEditorTabVisible('GeneralInfo')).to.be.true;
        await this.browser.switchToDefaultContent();
        const FielEditor = new ObjectTypeEditor(this.browser);
        await FielEditor.editATDCalculatedFieldScript(
            {
                Label: 'ItemConfig',
                CalculatedRuleEngine: {
                    JSFormula: `const res = [];

                    res.push(
                      {"UOMKey": "SIN", "Factor": 3, "Min": 2, "Case": 1, "Decimal": 0, "Negative":true},
                      {"UOMKey": "Bx", "Factor": 2, "Min": 1, "Case": 2, "Decimal": 1, "Negative":false},
                      {"UOMKey": "DOU", "Factor": 2.5, "Min": 5, "Case": 4, "Decimal": 1, "Negative":true}
                    );
                  
                  return JSON.stringify(res);`,
                },
            },
            this.TransLineField,
            'ItemConfig',
        );
    }

    public async configureUomDataFields(...dataFieldNames: string[]): Promise<void> {
        await this.browser.switchToDefaultContent();
        await this.selectTabByText('Uom');
        expect(await this.browser.untilIsVisible(this.UomHeader, 15000)).to.be.true;
        for (let i = 0; i < dataFieldNames.length; i++) {
            await this.selectDropBoxByString(this.UomDropDownFields, dataFieldNames[i], i);
            await this.isSpinnerDone();
            this.browser.sleep(1500);
        }
        await this.browser.click(this.UomSaveBtn);
        const webAppDialog = new WebAppDialog(this.browser);
        const isPopUpTextPresentedCorrectly: string = await (
            await this.browser.findElement(webAppDialog.Content)
        ).getText();
        expect(isPopUpTextPresentedCorrectly).to.equal('Configuration Saved successfully');
        await webAppDialog.selectDialogBox('Close');
        await this.isSpinnerDone();
        expect(await this.browser.untilIsVisible(this.UomInstalledHeader, 15000)).to.be.true;
        await this.selectTabByText('General');
    }

    private async testQtysOfItem(
        workingUomObject: UomUIObject,
        aoqmUom1Qty?: number,
        aoqmUom2Qty?: number,
        wholeItemQty?: number,
        itemGrandTotal?: number,
        pageGrandTotal?: number,
    ) {
        console.info(
            'inside testQtysOfItem. ',
            'aoqmUom1Qty: ',
            aoqmUom1Qty,
            ' aoqmUom2Qty: ',
            aoqmUom2Qty,
            ' wholeItemQty: ',
            wholeItemQty,
            ' itemGrandTotal: ',
            itemGrandTotal,
            ' pageGrandTotal: ',
            pageGrandTotal,
        );
        const orderPage = new OrderPage(this.browser);
        if (aoqmUom1Qty !== undefined) {
            const optionArr = [
                aoqmUom1Qty.toString(),
                parseFloat(aoqmUom1Qty.toString()).toFixed(1),
                parseFloat(aoqmUom1Qty.toString()).toFixed(2),
            ];
            console.info('optionArr at aoqmUom1Qty: ', optionArr);
            const workingUomObjectAoqmUom1Qty = await (
                await this.browser.findElement(workingUomObject.aoqmUom1Qty)
            ).getAttribute('title'); // Hagit June 23
            console.info('workingUomObjectAoqmUom1Qty: ', workingUomObjectAoqmUom1Qty);
            expect(workingUomObjectAoqmUom1Qty).to.be.oneOf(optionArr);
        }
        if (aoqmUom2Qty !== undefined) {
            const optionArr = [
                aoqmUom2Qty.toString(),
                parseFloat(aoqmUom2Qty.toString()).toFixed(1),
                parseFloat(aoqmUom2Qty.toString()).toFixed(2),
            ];
            console.info('optionArr at aoqmUom2Qty: ', optionArr);
            const workingUomObjectAoqmUom2Qty = await (
                await this.browser.findElement(workingUomObject.aoqmUom2Qty)
            ).getAttribute('title');
            console.info('workingUomObjectAoqmUom2Qty: ', workingUomObjectAoqmUom2Qty);
            expect(workingUomObjectAoqmUom2Qty).to.be.oneOf(optionArr);
        }
        if (wholeItemQty !== undefined) {
            const workingUomObjectWholeItemQty = await (
                await this.browser.findElement(workingUomObject.wholeItemQty)
            ).getText(); // Hagit June 23
            // debugger
            console.info('workingUomObjectWholeItemQty: ', workingUomObjectWholeItemQty);
            const theDecimalPortionOf_wholeItemQty = (wholeItemQty - Math.floor(wholeItemQty)) * 10;
            console.info('theDecimalPortionOf_wholeItemQty: ', theDecimalPortionOf_wholeItemQty);
            // let newWholeItemQty: number; // Hagit June 23 - checking if when item's quantity has decimal portion - it rounds up
            // if (theDecimalPortionOf_wholeItemQty > 0) {
            //     const base =
            //         wholeItemQty > 0
            //             ? wholeItemQty - theDecimalPortionOf_wholeItemQty / 10
            //             : wholeItemQty + theDecimalPortionOf_wholeItemQty / 10;
            //     newWholeItemQty = wholeItemQty > 0 ? base + 1 : base - 1;
            // } else {
            //     newWholeItemQty = wholeItemQty;
            // }
            // console.info('newWholeItemQty: ', newWholeItemQty);
            // expect(workingUomObjectWholeItemQty).to.equal(newWholeItemQty.toString());
            expect(workingUomObjectWholeItemQty).to.equal(
                // Hagit - needs to check if a "Decimal" key is sent (it's value would be 4)
                wholeItemQty.toString().includes('.')
                    ? `${parseFloat(wholeItemQty.toString()).toFixed(4)}`
                    : wholeItemQty.toString(),
            );
        }
        if (itemGrandTotal !== undefined) {
            const itemGrandTotalString = parseFloat(itemGrandTotal.toString()).toFixed(2);
            console.info('itemGrandTotalString: ', itemGrandTotalString);
            const workingUomObjectItemGrandTotal = (
                await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()
            )
                .split('$')[1]
                .trim();
            console.info('workingUomObjectItemGrandTotal: ', workingUomObjectItemGrandTotal);
            expect(workingUomObjectItemGrandTotal).to.be.oneOf([
                `${itemGrandTotalString.trim()}`,
                `-${itemGrandTotalString.trim()}`,
            ]);
        }

        if (pageGrandTotal !== undefined) {
            const pageGrandTotalString = parseFloat(pageGrandTotal.toString()).toFixed(2);
            const orderPageGrandTotal = (await (await this.browser.findElement(orderPage.pageGrandTotal)).getText())
                .split('$')[1]
                .trim();
            expect(orderPageGrandTotal).to.be.oneOf([
                `${pageGrandTotalString.trim()}`,
                `-${pageGrandTotalString.trim()}`,
            ]);
        }
    }
    /**
     *  UI test of UOM items order
     */
    public async testUomAtdUI(): Promise<void> {
        //1. regular item testing
        //1.1 add 48 items of regular qty - see 48 items are shown + correct price is presented
        let workingUomObject = new UomUIObject('1230');
        const orderPage = new OrderPage(this.browser);
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom1Qty,
            workingUomObject.aoqmUom1Qty,
            '40',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 40, undefined, 40, 20, 20);
        for (let i = 1; i < 9; i++) {
            await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
            this.browser.sleep(1500);
            await this.isSpinnerDone();
            await this.testQtysOfItem(workingUomObject, 40 + i, undefined, 40 + i, 20 + i * 0.5, 20 + i * 0.5);
        }
        //1.2. try to add one more regular item - nothing should change
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 48, undefined, 48, 48 / 2, 48 / 2);
        //1.3. lower qty back to 40 - see price + amount changed everywhere correctly
        for (let i = 1; i < 9; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            this.browser.sleep(1500);
            await this.isSpinnerDone();
            await this.testQtysOfItem(workingUomObject, 48 - i, undefined, 48 - i, (48 - i) * 0.5, (48 - i) * 0.5);
        }

        //1.4. zero the amount of the regular item - see everythins changed correctly
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom1Qty,
            workingUomObject.aoqmUom1Qty,
            '0',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 0, undefined, 0, 0, 0);
        //2. UOM item testing

        //2.1. Box & single
        workingUomObject = new UomUIObject('1231');
        //set uom types to double in the upper field and single in lower
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Box');
        this.browser.sleep(1500);
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'Single');
        this.browser.sleep(1500);
        //2.1.2. fill the order with boxes - the rest in singel items
        for (let i = 1; i < 4; i++) {
            await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
            this.browser.sleep(1500);
            await this.isSpinnerDone();
            await this.testQtysOfItem(workingUomObject, i, undefined, i * 13, i * 13, i * 13);
        }
        //2.1.3. nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 3, undefined, 39, 39, 39);
        //2.1.4. filling the rest with single elements
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom2Qty,
            workingUomObject.aoqmUom2Qty,
            '9',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 3, 9, 48, 48, 48);

        //2.1.5. nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 3, 9, 48, 48, 48);
        //2.1.6. lowering box by 1 and adding 13 singles
        await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 2, 9, 35, 35, 35);
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom2Qty,
            workingUomObject.aoqmUom2Qty,
            (9 + 13).toString(),
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 2, 22, 48, 48, 48);
        //2.1.7. nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 2, 22, 48, 48, 48);

        //2.2. Double & Single
        workingUomObject = new UomUIObject('1232');
        //set uom types to double in the upper field and single in lower
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'double');
        this.browser.sleep(1500);
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'Single');
        this.browser.sleep(1500);

        //2.2.1 fill the qty with double values
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom1Qty,
            workingUomObject.aoqmUom1Qty,
            '24',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 24, 0, 48, 48 + 24 * 2, 48 + 24 * 2);

        //2.2.2 nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 24, 0, 48, 48 + 24 * 2, 48 + 24 * 2);
        //2.2.3 lowering the double qty by half
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom1Qty,
            workingUomObject.aoqmUom1Qty,
            '12',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 12, 0, 48 - 12 * 2, 96 - 12 * 2, 96 - 12 * 2);
        //2.2.4 filling the rest with single
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom2Qty,
            workingUomObject.aoqmUom2Qty,
            '24',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 12, 24, 48, 72 + 24, 72 + 24);

        //2.2.5 nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 12, 24, 48, 72 + 24, 72 + 24);
        //2.2.6 nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 12, 24, 48, 72 + 24, 72 + 24);

        //2.3. Pack & Double
        workingUomObject = new UomUIObject('1233');
        //set uom types to double in the upper field and single in lower
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Pack');
        this.browser.sleep(1500);
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'double');
        this.browser.sleep(1500);

        //2.3.1 filling the amount by sending keys with bigger qty then inventory permits - expecting to get 8 packs
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom1Qty,
            workingUomObject.aoqmUom1Qty,
            '20',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 8, 0, 48, 144, 144);
        //2.3.2 lowering pack amount by 3
        for (let i = 1; i < 4; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            this.browser.sleep(1500);
            await this.isSpinnerDone();
            await this.testQtysOfItem(workingUomObject, 8 - i, 0, 48 - i * 6, 144 - i * 6, 144 - i * 6);
        }
        //2.3.3 filling the amount by sending keys with bigger qty then inventory permits - expecting to get 9 double's
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom2Qty,
            workingUomObject.aoqmUom2Qty,
            '20',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        //2.3.4 validating all values
        await this.testQtysOfItem(workingUomObject, 5, 9, 48, 144, 144);
        //2.4. Case & Box
        workingUomObject = new UomUIObject('1234');
        //set uom types to case in the upper field and box in lower
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Case');
        this.browser.sleep(1500);
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'Box');
        this.browser.sleep(1500);

        //2.4.1 raise the case qty by 1 and check all values
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 1, 0, 24, 168, 168);

        //2.4.2 filling the amount by sending keys with bigger qty then inventory permits - expecting to get 1 box
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom2Qty,
            workingUomObject.aoqmUom2Qty,
            '20',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        //2.4.3 valdating all values
        await this.testQtysOfItem(workingUomObject, 1, 1, 37, 181, 181);

        //3. UOM order test ended - submiting to cart
        await this.gotoCart(orderPage);
    }

    public async testUomAtdUIWithItemConfig(): Promise<void> {
        //1. single -> factor:3, minimum:2, case:1, decimal:0, negative:true
        let workingUomObject = new UomUIObject('1231');
        const orderPage = new OrderPage(this.browser);
        //set uom type to single
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Single');
        this.browser.sleep(1500);
        //1.1. try to add one single item
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 2, 0, 6, 6, 6);
        //1.2 click on plus again - this time qty is bigger than minimum
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 3, 0, 9, 9, 9);
        //1.3 zero the amount and set qty of single items to '-8'
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom1Qty,
            workingUomObject.aoqmUom1Qty,
            '0',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 0, 0, 0, 0, 0);
        for (let i = 1; i < 9; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            this.browser.sleep(1500);
            await this.isSpinnerDone();
            await this.testQtysOfItem(workingUomObject, -1 * i, 0, -3 * i, i * -3, i * -3);
        }
        //1.4 set qty of single items as '3.5'
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom1Qty,
            workingUomObject.aoqmUom1Qty,
            '3.5',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 16, 0, 48, 48, 48);

        //2. Box -> factor:2, min:1, case:2, negative:false, decimal: 3
        workingUomObject = new UomUIObject('1232');
        //set uom type to Box
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Box');
        this.browser.sleep(1500);
        //2.1. try to add one box item
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 2, 0, 4, 52, 52);
        //2.2 click on plus again - to see how many qtys of box are added
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 4, 0, 8, 56, 56);
        //2.3 zero the qty and try to set it to negative couple of times - shouldnt work
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom1Qty,
            workingUomObject.aoqmUom1Qty,
            '0',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 0, 0, 0, 48, 48);
        for (let i = 1; i < 4; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            await this.testQtysOfItem(workingUomObject, 0, 0, 0, 48, 48);
        }
        //2.4 set qty of single items to '3.5'
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom1Qty,
            workingUomObject.aoqmUom1Qty,
            '3.5',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 4, 0, 8, 56, 56);
        //3. Double -> factor:2.5, min:10, case:5, negative:true, decimal:1
        workingUomObject = new UomUIObject('1233');
        //set uom type to double
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'double');
        this.browser.sleep(1500);
        //3.1. try to add one double item
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 8, 0, 20, 76, 76);
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        await this.testQtysOfItem(workingUomObject, 12, 0, 30, 86, 86);
        //3.3 zero qty of double and set it to '-8'
        await this.browser.activateTextInputFieldAndWaitUntillFunction(
            workingUomObject.aoqmUom1Qty,
            workingUomObject.aoqmUom1Qty,
            '0',
            orderPage.blankSpaceOnScreenToClick,
            this.isSpinnerDone,
            this,
        );
        this.browser.sleep(2500);
        await this.testQtysOfItem(workingUomObject, 0, 0, 0, 56, 56);
        // debugger;
        for (let i = 1; i < 9; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            this.browser.sleep(1500);
            await this.isSpinnerDone();
            await this.testQtysOfItem(workingUomObject, -i, 0, -(i * 2.5), 56 + i * -2.5, 56 + i * -2.5);
            // await this.testQtysOfItem(workingUomObject, -i, 0, -(i * 3), 56 + i * -3, 56 + i * -3); // Hagit June 23 - has to be verifyed!
        }

        //set lower uom type to Box
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'Box');
        this.browser.sleep(1500);
        //3.4. add three more boxes - untill there are 0 items
        for (let i = 1; i < 3; i++) {
            await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            await this.testQtysOfItem(workingUomObject, -8, i * 2, -20 + i * 4, 36 + i * 4, 36 + i * 4);
        }
        //3.5. click minus untill there are no more boxes
        for (let i = 1; i < 3; i++) {
            await this.browser.click(workingUomObject.aoqmUom2MinusQtyButton);
            this.browser.sleep(1500);
            await this.isSpinnerDone();
            await this.testQtysOfItem(workingUomObject, -8, 4 - i * 2, -12 - i * 4, 44 - i * 4, 44 - i * 4);
        }

        //3. UOM order test ended - submiting to cart
        await this.gotoCart(orderPage);
    }

    private async gotoCart(orderPage: OrderPage) {
        await this.browser.click(orderPage.SubmitToCart);
        const webAppList = new WebAppList(this.browser);
        await webAppList.isSpinnerDone();
        try {
            await orderPage.changeOrderCenterPageView('GridLine');
        } catch (Error) {
            await orderPage.clickViewMenu(); //to close the menu first
            await orderPage.changeOrderCenterPageView('Grid');
        }
        await webAppList.validateListRowElements();
    }

    public async initiateUOMActivity(ATDname: string, accountName: string, viewType = 'Medium'): Promise<void> {
        const webAppHomePage = new WebAppHomePage(this.browser);
        await webAppHomePage.initiateSalesActivity(ATDname, accountName);
        const orderPage = new OrderPage(this.browser);
        await orderPage.changeOrderCenterPageView(viewType);
        //validate there are 5 items on screen
        const allItemPresented: WebElement[] = await this.browser.findElements(this.NonUomTypeItemInOrder);
        expect(allItemPresented.length).to.equal(5);
        //validate 4 are UOM items
        let allUOMItemPresented: WebElement[] = [];
        try {
            //DI-19257 - https://pepperi.atlassian.net/browse/DI-19257
            allUOMItemPresented = await this.browser.findElements(this.UomTypeItemInOrder);
        } catch (Error) {
            console.log('cannot find UOM type items - probably related to: DI-19257');
            process.exit(1);
        }
        expect(allUOMItemPresented.length).to.equal(4);
    }
}

class UomUIObject {
    public readonly everyItemXpathPrefix: string = "//span[@title='|textToFill|']/../../../../../../..";
    public aoqmUom1: By = By.xpath(`${this.everyItemXpathPrefix}//span[@title='AOQM_UOM1']`);
    public aoqmUom1PlusQtyButton: By = By.xpath(`${this.everyItemXpathPrefix}//pep-icon[@name='number_plus']`);
    public aoqmUom1MinusQtyButton: By = By.xpath(`${this.everyItemXpathPrefix}//pep-icon[@name='number_minus']`);
    public aoqmUom1Qty: By = By.xpath(`${this.everyItemXpathPrefix}//input[@name='TSAAOQMQuantity1']`);
    public aoqmUom2: By = By.xpath(`${this.everyItemXpathPrefix}//span[@title='AOQM_UOM2']`);
    public aoqmUom2PlusQtyButton: By = By.xpath(`(${this.everyItemXpathPrefix}//pep-icon[@name='number_plus'])[2]`);
    public aoqmUom2MinusQtyButton: By = By.xpath(`(${this.everyItemXpathPrefix}//pep-icon[@name='number_minus'])[2]`);
    public aoqmUom2Qty: By = By.xpath(`${this.everyItemXpathPrefix}//input[@name='TSAAOQMQuantity2']`);
    public wholeItemQty: By = By.xpath(`${this.everyItemXpathPrefix}//span[@class='ellipsis']`);
    public itemGrandTotal: By = By.xpath(`${this.everyItemXpathPrefix}//span[@id='TransactionGrandTotal']`);
    public SubmitToCart: By = By.css('[data-qa=cartButton]');

    constructor(idOfWUomElement: string) {
        this.aoqmUom1PlusQtyButton.valueOf()['value'] = this.aoqmUom1PlusQtyButton
            .valueOf()
            ['value'].slice()
            .replace('|textToFill|', idOfWUomElement);
        this.aoqmUom1MinusQtyButton.valueOf()['value'] = this.aoqmUom1MinusQtyButton
            .valueOf()
            ['value'].slice()
            .replace('|textToFill|', idOfWUomElement);
        this.aoqmUom1Qty.valueOf()['value'] = this.aoqmUom1Qty
            .valueOf()
            ['value'].slice()
            .replace('|textToFill|', idOfWUomElement);
        this.aoqmUom2PlusQtyButton.valueOf()['value'] = this.aoqmUom2PlusQtyButton
            .valueOf()
            ['value'].slice()
            .replace('|textToFill|', idOfWUomElement);
        this.aoqmUom2MinusQtyButton.valueOf()['value'] = this.aoqmUom2MinusQtyButton
            .valueOf()
            ['value'].slice()
            .replace('|textToFill|', idOfWUomElement);
        this.aoqmUom2Qty.valueOf()['value'] = this.aoqmUom2Qty
            .valueOf()
            ['value'].slice()
            .replace('|textToFill|', idOfWUomElement);
        this.wholeItemQty.valueOf()['value'] = this.wholeItemQty
            .valueOf()
            ['value'].slice()
            .replace('|textToFill|', idOfWUomElement);
        this.itemGrandTotal.valueOf()['value'] = this.itemGrandTotal
            .valueOf()
            ['value'].slice()
            .replace('|textToFill|', idOfWUomElement);
        this.aoqmUom1.valueOf()['value'] = this.aoqmUom1
            .valueOf()
            ['value'].slice()
            .replace('|textToFill|', idOfWUomElement);
        this.aoqmUom2.valueOf()['value'] = this.aoqmUom2
            .valueOf()
            ['value'].slice()
            .replace('|textToFill|', idOfWUomElement);
    }
}
