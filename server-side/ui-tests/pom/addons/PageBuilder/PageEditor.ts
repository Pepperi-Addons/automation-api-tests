import { By } from 'selenium-webdriver';
import { Browser } from '../../../utilities/browser';
import { WebAppPage } from '../../base/WebAppPage';
import config from '../../../../config';

export class PageEditor extends WebAppPage {
    //TODO: Add basic Page Editor functionality (as additional components?)
    public static PreviewButton: By = By.xpath("//*[@title='Preview']/ancestor::pep-button");
    public static PreviewModeContainer: By = By.css('.header-container-preview');
    public static EditButton: By = By.xpath(`//a[text()='Click here to edit']`);

    public static PublishButton: By = By.css('button[data-qa=Preview]');

    //TODO: Figure how to incorporate custom blocks
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public async clickPreviewButton(): Promise<void> {
        return this.browser.click(PageEditor.PreviewButton);
    }
    public async clickEditButton(): Promise<void> {
        return this.browser.click(PageEditor.EditButton);
    }

    public async enterPreviewMode(): Promise<void | undefined> {
        const isPreviewMode: boolean = await this.browser.isElementLocated(PageEditor.PreviewModeContainer);
        debugger;

        if (!isPreviewMode) {
            return await this.clickPreviewButton();
        }
    }

    public async enterEditMode(): Promise<void | undefined> {
        const isPreviewMode: boolean = await this.browser.isElementLocated(PageEditor.PreviewModeContainer);
        debugger;

        if (isPreviewMode) {
            return await this.clickEditButton();
        }
    }
}
