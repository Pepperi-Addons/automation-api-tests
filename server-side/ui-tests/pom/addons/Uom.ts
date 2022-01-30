import { expect } from 'chai';
import { By, Locator } from 'selenium-webdriver';
import { AddonPage, WebAppDialog, WebAppList } from '..';
import { OrderPage } from '../OrderPage';
import { AddonLoadCondition } from './AddonPage';
import { ObjectTypeEditor } from './ObjectTypeEditor';

export class Uom extends AddonPage {
    //UOM Addon Locators
    public uomHeader: Locator = By.xpath("//h1[contains(text(),'UOM')]");
    public uomInstalledHeader: Locator = By.xpath("//b[contains(text(),'Configuration Field')]");
    public uomInstallBtn: Locator = By.css("[data-qa='install']");
    public UomDropDownFields: Locator = By.xpath("(//div[contains(@class,'mat-select-arrow-wrapper')])");
    public UomSaveBtn: Locator = By.css("[data-qa='Save']");

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
        expect(await this.browser.untilIsVisible(this.uomHeader, 15000)).to.be.true;
        //testing whether already installed - after loading anyway
        if (await (await this.browser.findElement(this.uomInstallBtn)).isDisplayed()) {
            await this.browser.click(this.uomInstallBtn);
            const webAppDialog = new WebAppDialog(this.browser);
            // text not finalized yet - once will be the test is relevant
            // const isPupUP = await (await this.browser.findElement(webAppDialog.Content)).getText();
            // expect(isPupUP).to.equal('Are you sure you want to apply the module on the transaction?');
            await webAppDialog.selectDialogBox('ok');
            await this.isSpinnerDone();
        }
        expect(await this.browser.untilIsVisible(this.uomInstalledHeader, 15000)).to.be.true;
        await this.selectTabByText('General');
        const objectTypeEditor = new ObjectTypeEditor(this.browser);
        await objectTypeEditor.addATDCalculatedField(
            {
                Label: 'AllowedUomFieldsForTest', //name
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
        //**first testing phase will be performed w/o this feature - second whill test this only**
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
        await objectTypeEditor.editATDView('Order Center Views', 'Medium Thumbnails View', 'editPenIcon');
        await this.browser.sleep(7500);
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
        await this.browser.click(this.SaveUIControlBtn);
    }

    public async configureUomDataFields(...dataFieldNames: string[]): Promise<void> {
        await this.browser.switchToDefaultContent();
        await this.selectTabByText('Uom');
        expect(await this.browser.untilIsVisible(this.uomHeader, 15000)).to.be.true;
        for (let i = 0; i < dataFieldNames.length; i++) {
            await this.selectDropBoxByString(this.UomDropDownFields, dataFieldNames[i], i);
            await this.isSpinnerDone();
            await this.browser.sleep(1500);
        }
        await this.browser.click(this.UomSaveBtn);
        const webAppDialog = new WebAppDialog(this.browser);
        const isPopUpTextPresentedCorrectly: string = await (
            await this.browser.findElement(webAppDialog.Content)
        ).getText();
        expect(isPopUpTextPresentedCorrectly).to.equal('Configuration Saved successfully');
        await webAppDialog.selectDialogBox('Close');
        await this.isSpinnerDone();
        expect(await this.browser.untilIsVisible(this.uomInstalledHeader, 15000)).to.be.true;
        await this.selectTabByText('General');
    }

    /**
     *  UI test of UOM items order
     */
    public async testUomAtdUI(): Promise<void> {
        //1. regular item testing

        //1.1 add 48 items of regular qty - see 48 items are shown + correct price is presented
        let workingUomObject = new UomUIObject('1230');
        const orderPage = new OrderPage(this.browser);
        for (let i = 1; i < 49; i++) {
            await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                i.toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                i.toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((i * 0.5).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((i * 0.5).toString()).toFixed(2)}`,
            );
        }
        //1.2. try to add one more regular item - nothing should change
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '48',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$24.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$24.00');
        //1.3. lower qty to 35 - see price + amount changed everywhere correctly
        for (let i = 1; i < 14; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                (48 - i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (48 - i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat(((48 - i) * 0.5).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat(((48 - i) * 0.5).toString()).toFixed(2)}`,
            );
        }

        //1.4. zero the amount of the regular item - see everythins changed correctly
        await this.browser.click(workingUomObject.aoqmUom1Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom1Qty, '0');
        await this.browser.click(orderPage.blankSpaceOnScreenToClick);
        await this.isSpinnerDone();
        await this.browser.sleep(2500);
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '0',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('0');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$0.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$0.00');

        //2. UOM item testing

        //2.1. Box & single
        workingUomObject = new UomUIObject('1231');
        //set uom types to double in the upper field and single in lower
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Box');
        await this.browser.sleep(1500);
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'Single');
        await this.browser.sleep(1500);
        //2.1.2. fill the order with boxes - the rest in singel items
        for (let i = 1; i < 4; i++) {
            await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                i.toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (i * 13).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((i * 13).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((i * 13).toString()).toFixed(2)}`,
            );
        }
        //2.1.3. nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '3',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('39');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$39.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$39.00');
        //2.1.4. filling the rest with single elements
        for (let i = 1; i < 10; i++) {
            await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                '3',
            );
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
                i.toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (39 + i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((39 + i).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((39 + i).toString()).toFixed(2)}`,
            );
        }
        //2.1.5. nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
            '9',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$48.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$48.00');
        //2.1.6. lowering box by 1 and adding 13 singles
        await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '2',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('35');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$35.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$35.00');
        for (let i = 1; i < 14; i++) {
            await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
                (9 + i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (35 + i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((35 + i).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((35 + i).toString()).toFixed(2)}`,
            );
        }
        //2.1.7. nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '2',
        );
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
            '22',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$48.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$48.00');

        //2.2. Double & Single
        workingUomObject = new UomUIObject('1232');
        //set uom types to double in the upper field and single in lower
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'double');
        await this.browser.sleep(1500);
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'Single');
        await this.browser.sleep(1500);

        //2.2.1 fill the qty with double values
        for (let i = 1; i < 25; i++) {
            await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
            await this.browser.sleep(1200);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                i.toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (i * 2).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((48 + i * 2).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((48 + i * 2).toString()).toFixed(2)}`,
            ); //
        }
        //2.2.2 nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '24',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$96.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$96.00');
        //2.2.3 lowering the double qty by half
        for (let i = 1; i < 13; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                (24 - i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (48 - i * 2).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((96 - i * 2).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((96 - i * 2).toString()).toFixed(2)}`,
            );
        }
        //2.2.4 filling the rest with single
        for (let i = 1; i < 25; i++) {
            await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                '12',
            );
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
                i.toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (24 + i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((72 + i).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((72 + i).toString()).toFixed(2)}`,
            );
        }
        //2.2.5 nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '12',
        );
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
            '24',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$96.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$96.00');
        //2.2.6 nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '12',
        );
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
            '24',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$96.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$96.00');

        //2.3. Pack & Double
        workingUomObject = new UomUIObject('1233');
        //set uom types to double in the upper field and single in lower
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Pack');
        await this.browser.sleep(1500);
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'double');
        await this.browser.sleep(1500);

        //2.3.1 filling the amount by sending keys with bigger qty then inventory permits - expecting to get 8 packs
        await this.browser.click(workingUomObject.aoqmUom1Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom1Qty, '20');
        await this.browser.click(orderPage.blankSpaceOnScreenToClick);
        await this.isSpinnerDone();
        await this.browser.sleep(2500);
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '8',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$144.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$144.00');
        //2.3.2 lowering pack amount by 3
        for (let i = 1; i < 4; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                (8 - i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (48 - i * 6).toString(),
            ); //
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((144 - i * 6).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((144 - i * 6).toString()).toFixed(2)}`,
            );
        }
        //2.3.3 filling the amount by sending keys with bigger qty then inventory permits - expecting to get 9 double's
        await this.browser.click(workingUomObject.aoqmUom2Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom2Qty, '20');
        await this.browser.click(orderPage.blankSpaceOnScreenToClick);
        await this.isSpinnerDone();
        await this.browser.sleep(2500);
        //2.3.4 validating all values
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '5',
        );
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
            '9',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$144.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$144.00');

        //2.4. Case & Box
        workingUomObject = new UomUIObject('1234');
        //set uom types to case in the upper field and box in lower
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Case');
        await this.browser.sleep(1500);
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'Box');
        await this.browser.sleep(1500);

        //2.4.1 raise the case qty by 1 and check all values
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '1',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('24');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$168.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$168.00');

        //2.4.2 filling the amount by sending keys with bigger qty then inventory permits - expecting to get 1 box
        await this.browser.click(workingUomObject.aoqmUom2Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom2Qty, '20');
        await this.browser.click(orderPage.blankSpaceOnScreenToClick);
        await this.isSpinnerDone();
        await this.browser.sleep(2500);
        //2.4.3 valdating all values
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '1',
        ); //
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
            '1',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('37'); //
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$181.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$181.00');

        //3. UOM order test ended - submiting to cart
        await this.browser.click(orderPage.SubmitToCart);
        const webAppList = new WebAppList(this.browser);
        await webAppList.isSpinnerDone();
        await webAppList.validateListRowElements();
    }

    public async testUomAtdUIWithItemConfig(): Promise<void> {
        //1. single -> factor:3, minimum:2, case:1, decimal:0, negative:true
        let workingUomObject = new UomUIObject('1231');
        const orderPage = new OrderPage(this.browser);
        //set uom type to single
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Single');
        await this.browser.sleep(1500);
        //1.1. try to add one single item
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '2',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('6');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$6.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$6.00');
        //1.2 click on plus again - this time qty is bigger than minimum
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '3',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('9');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$9.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$9.00');
        //1.3 zero the amount and set qty of single items to '-8'
        await this.browser.click(workingUomObject.aoqmUom1Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom1Qty, '0');
        await this.browser.click(orderPage.blankSpaceOnScreenToClick);
        await this.isSpinnerDone();
        await this.browser.sleep(2500);
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '0',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('0');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$0.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$0.00');
        for (let i = 1; i < 9; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                (-1 * i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (-3 * i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((i * -3).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((i * -3).toString()).toFixed(2)}`,
            );
        }
        //1.4 set qty of single items as '3.5'
        await this.browser.click(workingUomObject.aoqmUom1Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom1Qty, '3.5');
        await this.browser.click(orderPage.blankSpaceOnScreenToClick);
        await this.isSpinnerDone();
        await this.browser.sleep(2500);
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '4',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('12');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$12.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$12.00');

        //2. Box -> factor:2, min:1, case:2, negative:false, decimal: 3
        workingUomObject = new UomUIObject('1232');
        //set uom type to Box
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Box');
        await this.browser.sleep(1500);
        //2.1. try to add one box item
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '2',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('4');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$16.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$16.00');
        //2.2 click on plus again - to see how many qtys of box are added
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '4',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('8');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$20.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$20.00');
        //2.3 zero the qty and try to set it to negative couple of times - shouldnt work
        await this.browser.click(workingUomObject.aoqmUom1Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom1Qty, '0');
        await this.browser.click(orderPage.blankSpaceOnScreenToClick);
        await this.isSpinnerDone();
        await this.browser.sleep(2500);
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '0',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('0');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$12.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$12.00');
        for (let i = 1; i < 4; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                '0',
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('0');
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                '$12.00',
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$12.00');
        }
        //2.4 set qty of single items to '3.5'
        await this.browser.click(workingUomObject.aoqmUom1Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom1Qty, '3.5');
        await this.browser.click(orderPage.blankSpaceOnScreenToClick);
        await this.isSpinnerDone();
        await this.browser.sleep(2500);
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '4',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('8');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$20.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$20.00');

        //3. Double -> factor:1, min:10, case:5, negative:true, decimal:1
        workingUomObject = new UomUIObject('1233');
        //set uom type to double
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'double');
        await this.browser.sleep(1500);
        //3.1. try to add one double item
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '10',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('10');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$30.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$30.00');
        //3.2 click on plus again - to see how many qtys of double are added
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1500);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '15',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('15');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$35.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$35.00');
        //3.3 zero qty of double and set it to '-8'
        await this.browser.click(workingUomObject.aoqmUom1Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom1Qty, '0');
        await this.browser.click(orderPage.blankSpaceOnScreenToClick);
        await this.isSpinnerDone();
        await this.browser.sleep(2500);
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
            '0',
        );
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('0');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$20.00');
        expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal('$20.00');
        for (let i = 1; i < 9; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                (-i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (-i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((20 + i * -1).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((20 + i * -1).toString()).toFixed(2)}`,
            );
        }

        //set lower uom type to Box
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'Box');
        await this.browser.sleep(1500);
        //3.4. add three more boxes - untill there are 0 items
        for (let i = 1; i < 3; i++) {
            await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                '-8',
            );
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
                (i * 2).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (-8 + i * 4).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((12 + i * 4).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((12 + i * 4).toString()).toFixed(2)}`,
            );
        }
        //3.5. click minus untill there are no more boxes
        for (let i = 1; i < 3; i++) {
            await this.browser.click(workingUomObject.aoqmUom2MinusQtyButton);
            await this.browser.sleep(1500);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                '-8',
            );
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
                (4 - i * 2).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (-(i * 4)).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((20 - i * 4).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(orderPage.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((20 - i * 4).toString()).toFixed(2)}`,
            );
        }

        //3. UOM order test ended - submiting to cart
        await this.browser.click(orderPage.SubmitToCart);
        const webAppList = new WebAppList(this.browser);
        await webAppList.isSpinnerDone();
        await webAppList.validateListRowElements();
    }
}

class UomUIObject {
    public readonly everyItemXpathPrefix: string = "//span[@title='|textToFill|']/../../../../../../..";
    public aoqmUom1: Locator = By.xpath(`${this.everyItemXpathPrefix}//span[@title='AOQM_UOM1']`);
    public aoqmUom1PlusQtyButton: Locator = By.xpath(`${this.everyItemXpathPrefix}//pep-icon[@name='number_plus']`);
    public aoqmUom1MinusQtyButton: Locator = By.xpath(`${this.everyItemXpathPrefix}//pep-icon[@name='number_minus']`);
    public aoqmUom1Qty: Locator = By.xpath(`${this.everyItemXpathPrefix}//input[@name='TSAAOQMQuantity1']`);
    public aoqmUom2: Locator = By.xpath(`${this.everyItemXpathPrefix}//span[@title='AOQM_UOM2']`);
    public aoqmUom2PlusQtyButton: Locator = By.xpath(
        `(${this.everyItemXpathPrefix}//pep-icon[@name='number_plus'])[2]`,
    );
    public aoqmUom2MinusQtyButton: Locator = By.xpath(
        `(${this.everyItemXpathPrefix}//pep-icon[@name='number_minus'])[2]`,
    );
    public aoqmUom2Qty: Locator = By.xpath(`${this.everyItemXpathPrefix}//input[@name='TSAAOQMQuantity2']`);
    public wholeItemQty: Locator = By.xpath(`${this.everyItemXpathPrefix}//span[@class='ellipsis']`);
    public itemGrandTotal: Locator = By.xpath(`${this.everyItemXpathPrefix}//span[@id='TransactionGrandTotal']`);
    public SubmitToCart: Locator = By.css('[data-qa=cartButton]');

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
