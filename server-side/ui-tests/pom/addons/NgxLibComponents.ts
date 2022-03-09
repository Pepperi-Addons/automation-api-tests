import { By, IRectangle, Key, Locator, WebElement } from 'selenium-webdriver';
import { AddonPage, WebAppSettingsSidePanel } from '..';

export enum Components {
    Button = 'Button',
    Attachment = 'Attachment',
}

export class NgxLibComponents extends AddonPage {
    //*generic*//
    public changeStyleButton: Locator = By.css('[data-qa="style change btn"]');
    public autoData: Locator = By.css('[data-qa="auto-data"]');
    public nextTestBtn: Locator = By.css('[data-qa="next-test"]');
    public pepIconMandatory: Locator = By.css('[name="system_must"]');
    public titleLabel: Locator = By.css('mat-label');
    //*button*//
    public componentButton: Locator = By.css('[data-qa="componentBtn"]');
    public disableButtonBtn: Locator = By.css('[data-qa="dis-comp"]');
    public visibilityOfButtonBtn: Locator = By.css('[data-qa="vis-comp"]');
    public insideButton: Locator = By.css("[data-qa='componentBtn'] > button");
    public pepIconTrash: Locator = By.css('[name="system_bin"]');
    //*attachment*//
    public pepFileUploader: Locator = By.css('pep-files-uploader');
    public matError: Locator = By.css('[id="mat-error-0"]');
    public formTitle: Locator = By.xpath('//*[@class="mat-form-title"]');
    public noFileTitle: Locator = By.xpath('//*[contains(text(),"Drag and drop a file here or click")]');
    public openSrcButton: Locator = By.xpath("//*[@class='pep-file-preview ng-star-inserted']");
    public checkBoxLabel: Locator = By.xpath("//span[@class='mat-checkbox-label']//span[2]");
    public checkBoxValueEmoji: Locator = By.xpath("//div[contains(@title,'checkbox')]");
    public checkBoxValueCheck: Locator = By.xpath("//input[@type='checkbox']");
    public checkBoxFieldTitle: Locator = By.css('pep-field-title > div');
    public checkBoxComponent: Locator = By.css('pep-checkbox');
    public checkBoxEmoji: Locator = By.xpath("//button[contains(@class,'emoji-icon')]");
    public checkBoxEmojiTitle: Locator = By.xpath("//span[contains(@class,'emoji-title')]");
    //*color*//
    public outerDialogContainer: Locator = By.xpath("//*[contains(@class,'pep-color')]");
    public dialogContainer: Locator = By.css('mat-dialog-container');
    public changeHueSlider: Locator = By.xpath('(//mat-slider)[1]');
    public changeSaturationSlider: Locator = By.xpath('(//mat-slider)[2]');
    public changeLightnessSlider: Locator = By.xpath('(//mat-slider)[3]');
    public currentColor: Locator = By.className('current-color');
    public okDialog: Locator = By.xpath("//span[contains(text(),'Ok')]");
    public outterComponentColor: Locator = By.css('pep-color > div > div');
    public aaComplientCheckBox: Locator = By.xpath('//mat-checkbox//label//span//input');
    public titleAlignment: Locator = By.xpath("//div[@class='mat-form-title']");
    public AAcomp: Locator = By.xpath("//div[@class='color-complient']");
    //*date*//
    public dateValue: Locator = By.xpath("//input[contains(@class,'mat-input-element')]");
    public pepDateIcon: Locator = By.css('[name="time_cal"]');
    public pepDateTimeIcon: Locator = By.css('[name="time_datetime"]');
    public pepDate: Locator = By.css('pep-date');
    public datePicker: Locator = By.css('mat-datetimepicker-calendar');
    public datePickerMinutes: Locator = By.xpath("//div[contains(@class,'minutes')]");
    public datePickerHours: Locator = By.xpath("//div[contains(@class,'hours')]");
    public jan8thDate: Locator = By.xpath("//td[@aria-label='January 8, 2020']");
    public jan1stDate: Locator = By.xpath("//td[@aria-label='January 1, 2020']");
    //->
    //

    /**
     * goto NGX - lib page from homepage
     */
    public async gotoNgxAddon(): Promise<void> {
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('NGX-Lib-Automation');
        await this.browser.click(webAppSettingsSidePanel.ObjectEditorNGX);
        this.browser.sleep(2000);
        await this.isSpinnerDone();
        this.browser.sleep(2200);
        return;
    }

    /**
     * change the configuration of the element
     */
    public async changeStyle(): Promise<void> {
        await this.browser.click(this.changeStyleButton);
        this.browser.sleep(1200);
    }

    /**
     * click the button component
     */
    public async clickNGXButton(): Promise<void> {
        await this.browser.click(this.componentButton);
        this.browser.sleep(3000);
    }

    /**
     * returns all classes from the inside element
     */
    public async getInsideBtnClasses(): Promise<string> {
        return await (await this.browser.findElement(this.insideButton)).getAttribute('class');
    }

    /**
     * returns all the expected data shown on the page
     */
    public async getExpectedData(): Promise<string[]> {
        return (await (await this.browser.findElement(this.autoData)).getText()).split(';');
    }

    /**
     * returns whether this component is icon component
     */
    public async isComponentWithIcon(): Promise<boolean> {
        const expectedDataLength: number = (await this.getExpectedData()).length;
        return expectedDataLength === 6;
    }

    /**
     * returns whether this component is icon component
     */
    public async areAllClassesIncluded(...expectedData): Promise<boolean> {
        const insideButtonComponentActualClasses = await this.getInsideBtnClasses();
        for (let i = 0; i < expectedData.length; i++) {
            if (!insideButtonComponentActualClasses.includes(expectedData[i])) {
                return false;
            }
        }
        return true;
    }

    /**
     *
     *
     */
    public async isComponentVisibale(): Promise<boolean> {
        let isVis = true;
        try {
            isVis = await this.browser.untilIsVisible(this.componentButton);
        } catch (e: any) {
            if (e.message.includes(`'[data-qa="componentBtn"]', The test must end, The element is not visible`)) {
                isVis = false;
            }
        }
        return isVis;
    }

    /**
     *
     *
     */
    public async getIconNameOutOfExpectedData(): Promise<string> {
        const expectedComponentClassesSplited: string[] = await this.getExpectedData();
        return expectedComponentClassesSplited[expectedComponentClassesSplited.length - 3];
    }

    /**
     *
     *
     */
    public async getComponentData(): Promise<string> {
        const componentElement = await this.browser.findElement(this.autoData);
        return componentElement.getText();
    }

    /**
     *
     *
     */
    public async getActualComponentSize(typeOfComponent: Components): Promise<IRectangle> {
        let locator: Locator;
        switch (typeOfComponent) {
            case 'Button':
                locator = this.componentButton;
                break;
            case 'Attachment':
                locator = this.pepFileUploader;
                break;
            default:
                //dunmmy fot ts
                locator = this.pepFileUploader;
                break;
        }
        const btnComp: WebElement = await this.browser.findElement(locator);
        return await btnComp.getRect();
    }

    /**
     *
     *
     */
    public async getExpectedComponentSize(size: string): Promise<IRectangle> {
        const [expectedH, expectedW] = size.split('x');
        return { height: parseInt(expectedH), width: parseInt(expectedW), x: 0, y: 0 } as IRectangle;
    }

    /**
     *
     *
     */
    public async getActualElementColor(locator: Locator, colorType: string): Promise<string> {
        return await (await this.browser.findElement(locator)).getCssValue(colorType);
    }

    /**
     *
     *
     */
    public async disableBtn(): Promise<void> {
        await this.browser.click(this.disableButtonBtn);
        this.browser.sleep(1500);
    }

    /**
     *
     *
     */
    public async changeVisibilityOfBtn(): Promise<void> {
        await this.browser.click(this.visibilityOfButtonBtn);
        this.browser.sleep(1500);
    }

    /**
     *
     *
     */
    public async gotoNextTest(): Promise<void> {
        await this.browser.click(this.nextTestBtn);
        this.browser.sleep(2000);
    }

    /**
     *
     *
     */
    public async getCheckBoxValue(type: string): Promise<boolean> {
        const checkBoxValue =
            type === 'checkbox'
                ? await (await this.browser.findElement(this.checkBoxValueCheck)).getAttribute('aria-checked')
                : (await (await this.browser.findElement(this.checkBoxValueEmoji)).getAttribute('title'))
                      .split(':')[1]
                      .trim()
                      .toLowerCase();
        return checkBoxValue === 'true' ? true : false;
    }

    /**
     *
     *
     */
    public async getCheckBoxLabelText(type: string): Promise<string> {
        return type === 'checkbox'
            ? await (await this.browser.findElement(this.checkBoxLabel)).getText()
            : await (await this.browser.findElement(this.checkBoxEmojiTitle)).getText();
    }

    /**
     *
     *
     */
    public async getIfCheckBoxShown(type: string, value: boolean, isDisabled: boolean): Promise<boolean> {
        if (type === 'checkbox') {
            return await this.testIfElementShown(this.checkBoxValueCheck);
        } else {
            if (!(await this.testIfElementShown(this.checkBoxEmoji))) {
                return false;
            }
            const checkBoxEmoji = await (await this.browser.findElement(this.checkBoxEmoji)).getText();
            if (value) {
                if (checkBoxEmoji !== '❤') {
                    return false;
                }
            } else {
                if (checkBoxEmoji !== '✌️') {
                    return false;
                }
            }
            if (!isDisabled) {
                if (!(await this.validateClick(this.checkBoxEmoji))) {
                    return false;
                }
                const checkBoxEmoji = await (await this.browser.findElement(this.checkBoxEmoji)).getText();
                if (value) {
                    if (checkBoxEmoji !== '✌️') {
                        return false;
                    }
                } else {
                    if (checkBoxEmoji !== '❤') {
                        return false;
                    }
                }
                await this.browser.click(this.checkBoxEmoji);
            }
            return true;
        }
    }
    private isDisabledTested = false;
    public async validateDisabledCheckbox(disabled: boolean): Promise<boolean> {
        if (disabled && !this.isDisabledTested) {
            this.isDisabledTested = true;
            await this.browser.getALLConsoleLogs(); //to delete all logs before click
            await this.browser.click(this.checkBoxComponent);
            if (await this.isTextPresentedInConsole(`checkbox value changed`)) {
                return false;
            }
            return true;
        }
        return true;
    }

    public async validateClick(locator: Locator): Promise<boolean> {
        await this.browser.getALLConsoleLogs(); //to delete all logs before click
        await this.browser.click(locator);
        if (!(await this.isTextPresentedInConsole(`checkbox value changed`))) {
            return false;
        }
        return true;
    }

    public async testIfElementShown(locator: Locator): Promise<boolean> {
        let foundElement: WebElement | undefined = undefined;
        try {
            foundElement = await this.browser.findElement(locator);
        } catch (e: any) {
            return false;
        }
        return true;
    }

    public async isTextPresentedInConsole(expectedValueInConsole: string): Promise<boolean> {
        const consoleOutput = (await this.browser.getALLConsoleLogs()).join();
        return consoleOutput.includes(expectedValueInConsole);
    }

    public async getXAligment(aligmentElement: Locator): Promise<string> {
        const formTitle: WebElement = await this.browser.findElement(aligmentElement);
        return await formTitle.getCssValue('text-align');
    }

    public async openSrcLink(): Promise<string> {
        await this.browser.click(this.openSrcButton);
        this.browser.sleep(1500);
        await this.browser.switchToTab(1);
        const urlAfterClick = await this.browser.getCurrentUrl();
        return urlAfterClick;
    }

    public async deleteCurrentAttachment() {
        await this.browser.click(this.pepIconTrash);
    }

    public async getIntoColorDialog() {
        await this.browser.click(this.outerDialogContainer);
    }

    public async disableAAComp() {
        const checkBoxElement = await this.browser.findElement(this.aaComplientCheckBox);
        if ((await checkBoxElement.getAttribute('aria-checked')) === 'true') {
            await this.browser.click(this.aaComplientCheckBox);
        }
    }

    public async okColorDialog() {
        await this.browser.click(this.okDialog);
    }

    public async changeDateAndReturnNew(dateType: string, renderSymbol: boolean, xAligment: string) {
        await this.browser.getALLConsoleLogs(); //to clean the log
        let dateValueTitle = '';
        if (dateType === 'date') {
            //create "change and return date from component" in NGX class and only validate here
            if (renderSymbol && xAligment !== 'center') {
                await this.browser.click(this.pepDateIcon);
            } else {
                await this.browser.click(this.dateValue);
                this.browser.sleep(1000);
            }
            await this.browser.click(this.jan8thDate);
            const dateValue = await this.browser.findElement(this.dateValue);
            dateValueTitle = await dateValue.getAttribute('title');
        } else {
            await this.browser.click(this.dateValue);
            this.browser.sleep(1000);
            const elem = await await this.browser.findElement(this.datePicker);
            await elem.sendKeys(Key.ENTER);
            const hourLocator = this.datePickerHours.valueOf()['value'].slice() + "//div[text()='13']";
            await this.browser.click(By.xpath(hourLocator));
            const minuteLocator = this.datePickerMinutes.valueOf()['value'].slice() + "//div[text()='30']";
            await this.browser.click(By.xpath(minuteLocator));
            await this.browser.click(this.autoData);
            const dateValue = await this.browser.findElement(this.dateValue);
            dateValueTitle = await dateValue.getAttribute('title');
        }
        return dateValueTitle;
    }

    public async resetDateToDeafult(type: string) {
        switch (type) {
            case 'date':
                await this.browser.click(this.dateValue);
                this.browser.sleep(1000);
                await this.browser.click(this.jan1stDate);
                await this.browser.click(this.autoData);
                break;
            case 'datetime':
                await this.browser.click(this.dateValue);
                this.browser.sleep(1000);
                const elem = await this.browser.findElement(this.datePicker);
                await elem.sendKeys(Key.ENTER);
                const hourLocator = this.datePickerHours.valueOf()['value'].slice() + "//div[text()='00']";
                await this.browser.click(By.xpath(hourLocator));
                const minuteLocator = this.datePickerMinutes.valueOf()['value'].slice() + "//div[text()='00']";
                await this.browser.click(By.xpath(minuteLocator));
                await this.browser.click(this.autoData);
                break;
        }
    }

    public async getExpectedAndActualElemColor(
        indexOfColor: number,
        locatorToActual: Locator,
        colorType: string,
        expectedColor: string,
        secondaryIndex?: number,
    ): Promise<{ true: string; expected: string }> {
        const trueColor = await this.getActualElementColor(locatorToActual, colorType);
        const webElementColor = expectedColor.split('=>')[indexOfColor].replace(/,/g, ', ');
        const expectedColorAfterParse = webElementColor.includes('/')
            ? webElementColor.split('/')[secondaryIndex ? secondaryIndex : 0]
            : webElementColor;
        return { true: trueColor, expected: expectedColorAfterParse };
    }

    public async moveSlider(locator: Locator, numOfMovments: number) {
        const changeLightnessSlider = await this.browser.findElement(locator);
        for (let i = 0; i < numOfMovments; i++) {
            await changeLightnessSlider.sendKeys(Key.ARROW_RIGHT);
        }
    }
}
