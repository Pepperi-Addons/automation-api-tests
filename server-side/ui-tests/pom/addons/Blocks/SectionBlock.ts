import { By } from 'selenium-webdriver';
import { Browser } from '../../../utilities/browser';
import { Component } from '../../Components/Base/Component';
import { WebAppPage } from '../../Pages/base/WebAppPage';
import { PageBlockEditorSideBar } from '../PageBuilder/PageBlockEditorSideBar';

/**
 * Abstract class for all displayed blocks in a page's Section.
 */
export abstract class SectionBlock extends Component {
    protected constructor(private blockName: string, protected blockId: string, browser: Browser) {
        super(browser);
        this.BlockName = blockName;
        this.SideBar = new PageBlockEditorSideBar(blockName, this.browser);
        this.BlockId = blockId;
    }
    public readonly BlockId: string;
    public readonly BlockName: string;
    protected readonly SideBar: PageBlockEditorSideBar;

    /**
     * Can be overwritten in inherited classes to narrow locators for basic {@link SectionBlock} functions.
     */
    protected XPathParentContainer: By = By.xpath(`//section-block`);

    public getBlockDraggable(): By {
        return By.xpath(
         `${this.XPathParentContainer.value}//*[@title='${this.blockName}']`);
    }

    public getEditBlockBtn(): By {
        return By.xpath(
            `${this.getBlockDraggable().value}/ancestor::pep-draggable-item//pep-button[@iconname='system_edit']`,
        );
    }

    public getLoadedBlockElement(): By {
        return By.xpath(`${this.getBlockDraggable().value}/ancestor::pep-draggable-item/parent::*//pep-remote-loader/*`);
    }

    public async editBlock(): Promise<void> {
        const blockLoadTimeOut = 30000;
        const blockLoaded = await this.isBlockLoaded(blockLoadTimeOut, true);
        if (!blockLoaded) {
            throw new Error(
                `${this.getLoadedBlockElement().value} was not loaded in the alotted time ${blockLoadTimeOut}ms`,
            );
        }
        await this.browser.click(this.getEditBlockBtn());
        await this.browser.waitForLoading(WebAppPage.LoadingSpinner);
        return;
    }

    public async isBlockLoaded(timeOut?: number, suppressLog?: boolean): Promise<boolean> {
        return this.browser.isElementLocated(this.getLoadedBlockElement(), timeOut, suppressLog);
    }
}
