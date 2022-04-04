import { By } from 'selenium-webdriver';
import { Browser } from '../../../utilities/browser';
import { Component } from '../../base/Component';
import { WebAppPage } from '../../base/WebAppPage';

export abstract class SectionBlock extends Component {

    public readonly BlockName: string;

    protected constructor(private blockName: string, browser: Browser) {
        super(browser);
        this.BlockName = blockName;
    }

    public static readonly ParentContainer = By.xpath('//section-block');

    // public getBlockDraggable(): By {
    //     return By.xpath(`${SectionBlock.ParentContainer.value}//*[@title='${this.blockName}']`);
    // }

    public readonly getBlockDraggable: By =
        By.xpath(`${SectionBlock.ParentContainer.value}//*[@title='${this.blockName}']`);
    

    public getEditBlockBtn(): By {
        return By.xpath(
            `${
                this.getBlockDraggable.value
            }/ancestor::pep-draggable-item//pep-button[@iconname='system_edit']`,
        );
    }

    public getLoadedBlockElement(): By {
        return By.xpath(
            `${
                this.getBlockDraggable.value
            }/ancestor::pep-draggable-item/parent::*//pep-remote-loader/*`,
        );
    }

    public async editBlock(): Promise<void> {
        const blockLoadTimeOut = 5000;
        const blockLoaded = await this.isBlockLoaded(blockLoadTimeOut, true);
        if(!blockLoaded){
            throw new Error(`${this.BlockName} block was not loaded in the alotted time: ${blockLoadTimeOut}ms`);
        }
        await this.browser.click(this.getEditBlockBtn());
        await this.browser.waitForLoading(WebAppPage.LoadingSpinner);
        return;
    }

    public async isBlockLoaded(timeOut?: number, suppressLog?: boolean): Promise<boolean>{
        return this.browser.isElementLocated(this.getLoadedBlockElement(), timeOut, suppressLog);
    }
}
