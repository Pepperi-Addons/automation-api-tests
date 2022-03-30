import { Browser } from '../utilities/browser';
import { Page } from './base/Page';
import config from '../../config';
import { Locator, By } from 'selenium-webdriver';
import { ConsoleColors } from '../../services/general.service';

export class WebAppDialog extends Page {
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public Dialog: Locator = By.css('pep-dialog');
    public Title: Locator = By.css('pep-dialog .dialog-title');
    public Content: Locator = By.css('div [pep-dialog-content]');
    public ButtonArr: Locator = By.css('pep-dialog button');

    ///Object Types Editor Locators
    public EditorContent: Locator = By.css('pep-dialog .mat-dialog-content');
    public EditorTextBoxInput: Locator = By.css('pep-dialog .mat-dialog-content pep-textbox input');
    public EditorTextAreaInput: Locator = By.css('pep-dialog .mat-dialog-content pep-textarea [matinput]');
    public EditorInput: Locator = By.css('pep-dialog .mat-dialog-content .pep-field input');
    public EditorMatInput: Locator = By.css('pep-dialog .mat-dialog-content .pep-field [matinput]');

    public DialogXpath: Locator = By.xpath('.//pep-dialog');

    //Iframe Dialogs
    public IframeDialog: Locator = By.css('.warning-dialog');
    public IframeDialogMessage: Locator = By.css('.warning-dialog #msgModalTextContent');
    public IframeDialogCancelBtn: Locator = By.css('.warning-dialog #msgModalLeftBtn');
    public IframeDialogApproveBtn: Locator = By.css('.warning-dialog #msgModalRightBtn');

    public async selectDialogBoxBeforeNewOrder(buttonText = 'Yes'): Promise<void> {
        /**
         * Click to dismiss if dialog box found
         */
        try {
            await this.browser.ClickByText(this.ButtonArr, buttonText);
        } catch (error) {
            console.log(`%cElement ${this.ButtonArr.toString()} not found`, ConsoleColors.Error);
        }
        return;
    }

    public async selectDialogBox(buttonText: string): Promise<void> {
        /**
         * Click to dismiss if dialog box found
         */
        try {
            await this.browser.ClickByText(this.ButtonArr, buttonText);
        } catch (error) {
            console.log(`%cElement ${this.ButtonArr.toString()} not found`, ConsoleColors.Error);
        }
        return;
    }

    public async selectDialogBoxByText(btnText: string): Promise<void> {
        const selectedBtn = Object.assign({}, this.DialogXpath);
        selectedBtn['value'] += ` //span[contains(., '${btnText}')]`;
        await this.browser.click(selectedBtn);
        return;
    }

    public async getDialogBoxText(): Promise<string> {
        return await this.browser.findElement(this.Content, 4000).then(
            async (res) => {
                return await res.getText();
            },
            () => {
                console.log(`%cElement ${this.ButtonArr.toString()} not found`, ConsoleColors.Error);
                return `Element ${this.ButtonArr.toString()} not found`;
            },
        );
    }
}
