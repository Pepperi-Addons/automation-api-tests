import { By } from 'selenium-webdriver';
import { Browser } from '../../../../utilities/browser';
import { PageTesterBlockName, ConfigurablePageTesterBlock } from './base/index';

export class DynamicTester extends ConfigurablePageTesterBlock {
    constructor(blockId: string, browser: Browser) {
        super(PageTesterBlockName.DynamicTester, blockId, browser);
    }

    public readonly BlockContainer = By.css(`dynamic-tester[block-id='${this.blockId}']`);

    public readonly HostObjectText = By.css(`${this.BlockContainer.value} #hostObject textarea`);

    public readonly ConsumesText = By.css(`${this.BlockContainer.value} #receivedConsumes textarea`);

    public getSetParamBtn(paramKey: string) {
        return By.css(`${this.BlockContainer.value} button[data-qa='${paramKey}']`);
    }

    public async getHostObjectText(): Promise<string | null> {
        return await this.browser.getElementAttribute(this.HostObjectText, 'title');
    }

    public async getConsumesText(): Promise<string | null> {
        return await this.browser.getElementAttribute(this.ConsumesText, 'title');
    }

    public async clickSetParamBtn(paramKey: string): Promise<void> {
        return await this.browser.click(this.getSetParamBtn(paramKey));
    }
    // /**
    //  * Initializes block configuration by entering block edit mode. Exits edit block mode after loading animation has finished.
    //  */
    // public async initBlockConfig(): Promise<void> {
    //     await this.editBlock();
    //     return await this.SideBar.exitBlockEditorMode();
    // }
}
