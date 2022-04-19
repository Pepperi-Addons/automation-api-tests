import { By } from 'selenium-webdriver';
import { Browser } from '../../../utilities/browser';
import { WebAppPage } from '../../Pages/base/WebAppPage';
import config from '../../../../config';
import { PageLayoutSideBar } from './PageLayoutSideBar';
import { SectionBlocksMap } from '../Blocks/SectionBlocksMap';

export class PageEditor extends WebAppPage {
    public static readonly PreviewButton: By = By.xpath("//*[@title='Preview']/ancestor::pep-button");
    public static readonly PreviewModeContainer: By = By.css('.header-container-preview');
    public static readonly EditButton: By = By.xpath(`//a[text()='Click here to edit']`);
    public static readonly PublishButton: By = By.css('button[data-qa=Preview]');

    protected readonly SideBar: PageLayoutSideBar;
    public PageBlocks: SectionBlocksMap = new SectionBlocksMap();

    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
        this.SideBar = new PageLayoutSideBar(browser);
    }

    public async clickPreviewButton(): Promise<void> {
        return this.browser.click(PageEditor.PreviewButton);
    }
    public async clickEditButton(): Promise<void> {
        return this.browser.click(PageEditor.EditButton);
    }

    public async enterPreviewMode(): Promise<void | undefined> {
        const isPreviewMode: boolean = await this.browser.isElementLocated(PageEditor.PreviewModeContainer);

        if (!isPreviewMode) {
            return await this.clickPreviewButton();
        }
    }

    public async enterEditMode(): Promise<void | undefined> {
        const isPreviewMode: boolean = await this.browser.isElementLocated(PageEditor.PreviewModeContainer);

        if (isPreviewMode) {
            return await this.clickEditButton();
        }
    }

    public async goBack(): Promise<void> {
        return await this.SideBar.goBack();
    }
}
