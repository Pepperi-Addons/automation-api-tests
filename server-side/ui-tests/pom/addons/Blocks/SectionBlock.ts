import { By } from 'selenium-webdriver';
import { Browser } from '../../../utilities/browser';
import { Component } from '../../Components/Base/Component';
import { WebAppPage } from '../../Pages/base/WebAppPage';
import { PageBlockEditorSideBar } from '../PageBuilder/PageBlockEditorSideBar';
import { PageLayoutSideBar } from '../PageBuilder/PageLayoutSideBar';

export abstract class SectionBlock extends Component {
    
    protected constructor(private blockName: string, protected blockId: string, browser: Browser) {
        super(browser);
        this.BlockName = blockName;
        this.BlockId = blockId;
        this.SideBar = new PageBlockEditorSideBar(blockName, this.browser);
    }
    public readonly BlockName: string;
    public readonly BlockId: string;
    protected readonly SideBar: PageBlockEditorSideBar;
    public readonly ParentContainer = By.xpath(`//*[@block-id='${this.blockId}']/ancestor::section-block`);

    // public getBlockDraggable(): By {
    //     return By.xpath(`${SectionBlock.ParentContainer.value}//*[@title='${this.blockName}']`);
    // }

    public readonly getBlockDraggable: By = By.xpath(`${this.ParentContainer.value}//*[@title='${this.blockName}']`);

    public getEditBlockBtn(): By {
        return By.xpath(
            `${this.getBlockDraggable.value}/ancestor::pep-draggable-item//pep-button[@iconname='system_edit']`,
        );
    }

    public getLoadedBlockElement(): By {
        return By.xpath(`${this.getBlockDraggable.value}/ancestor::pep-draggable-item/parent::*//pep-remote-loader/*`);
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
