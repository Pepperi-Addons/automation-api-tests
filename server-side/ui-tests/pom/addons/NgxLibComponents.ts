import { By, IRectangle, Locator, WebElement } from 'selenium-webdriver';
import { AddonPage, WebAppSettingsSidePanel } from '..';

export enum Components {
    Button = "Button",
    Attachment = "Attachment"
}

export class NgxLibComponents extends AddonPage {
    public changeStyleButton: Locator = By.css('[data-qa="style change btn"]');
    public componentButton: Locator = By.css('[data-qa="componentBtn"]');
    public autoData: Locator = By.css('[data-qa="auto-data"]');
    public disableButtonBtn: Locator = By.css('[data-qa="dis-comp"]');
    public visibilityOfButtonBtn: Locator = By.css('[data-qa="vis-comp"]');
    public insideButton: Locator = By.css("[data-qa='componentBtn'] > button");
    public nextTestBtn: Locator = By.css('[data-qa="next-test"]');
    public pepIconMandatory: Locator = By.css('[name="system_must"]');
    public pepIconTrash: Locator = By.css('[name="system_bin"]');
    public titleLabel: Locator = By.css('mat-label');
    public pepFileUploader: Locator = By.css('pep-files-uploader');
    public matError: Locator = By.css('[id="mat-error-0"]');
    public formTitle: Locator = By.xpath('//*[@class="mat-form-title"]');
    public noFileTitle: Locator = By.xpath('//*[contains(text(),"Drag and drop a file here or click")]');
    public openSrcButton: Locator = By.xpath("//*[@class='pep-file-preview ng-star-inserted']");



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
        this.browser.sleep(2000);
    }

    /**
     * click the button component
     */
    public async clickComponent(): Promise<void> {
        await this.browser.click(this.componentButton);
        this.browser.sleep(1500);
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
    public async getExpectedData(): Promise<string> {
        return await (await this.browser.findElement(this.autoData)).getText();
    }

    /**
     * returns whether this component is icon component
     */
    public async isComponentWithIcon(): Promise<boolean> {
        const expectedDataLength: number = (await this.getExpectedData()).split(' ').length;
        return expectedDataLength === 6;
    }

    /**
     * returns whether this component is icon component
     */
    public async areAllClassesIncluded(): Promise<boolean> {
        const insideButtonComponentActualClasses = await this.getInsideBtnClasses();
        const expectedComponentClasses = await this.getExpectedData();
        for (let i = 0; i < 3; i++) {
            if (!insideButtonComponentActualClasses.includes(expectedComponentClasses[i])) {
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
        const expectedComponentClassesSplited: string[] = (await this.getExpectedData()).split(' ');
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
            default://dunmmy fot ts
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
    public async getExpectedComponentSize(typeOfComponent: Components): Promise<IRectangle> {
        let delimiterToSplitBy = '';
        switch (typeOfComponent) {
            case 'Button':
                delimiterToSplitBy = ' ';
                break;
            case 'Attachment':
                delimiterToSplitBy = ',';
                break;
        }
        const expectedComponentClassesSplited: string[] = (await this.getExpectedData()).split(delimiterToSplitBy);
        let parsedExpectedData: (string | boolean)[] = [];
        if (typeOfComponent === "Attachment") {
            expectedComponentClassesSplited.forEach(element => {
                element = element.split(':')[1];
                let bool = (element === "true" || element === "false") ? element === "true" : undefined;
                parsedExpectedData.push(bool === true || bool === false ? bool : element);
            });
        }
        let indexToGetDataFrom = 0;
        switch (typeOfComponent) {
            case 'Button':
                indexToGetDataFrom = expectedComponentClassesSplited.length - 2;
                delimiterToSplitBy = 'x';
                break;
            case 'Attachment':
                indexToGetDataFrom = expectedComponentClassesSplited.length - 1;
                delimiterToSplitBy = '->';
                break;
        }
        const expectedH = typeOfComponent === "Button" ? expectedComponentClassesSplited[indexToGetDataFrom].split(delimiterToSplitBy)[0] : (parsedExpectedData[indexToGetDataFrom] as string).split(delimiterToSplitBy)[1].split('x')[0];
        const expectedW = typeOfComponent === "Button" ? expectedComponentClassesSplited[indexToGetDataFrom].split(delimiterToSplitBy)[0] : (parsedExpectedData[indexToGetDataFrom] as string).split(delimiterToSplitBy)[1].split('x')[1];
        return { height: parseInt(expectedH), width: parseInt(expectedW), x: 0, y: 0 } as IRectangle;
    }

    /**
     *
     *
     */
    public async getActualBgColor(): Promise<string> {
        return await (await this.browser.findElement(this.insideButton)).getCssValue('background-color');
    }

    /**
     *
     *
     */
    public async getExpectedBgColor(index: number): Promise<string> {
        const expectedComponentClassesSplited: string[] = (await this.getExpectedData()).split(' ');
        return expectedComponentClassesSplited[expectedComponentClassesSplited.length - 1]
            .split(';')
        [index].replace(/,/g, ', ');
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
}
