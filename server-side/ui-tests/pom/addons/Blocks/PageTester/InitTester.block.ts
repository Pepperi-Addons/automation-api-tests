import { By } from 'selenium-webdriver';
import { Browser } from '../../../../utilities/browser';
import { ConfigurablePageTesterBlock, PageTesterBlockName } from './base/index';

export class InitTester extends ConfigurablePageTesterBlock {
    constructor(blockId: string, browser: Browser) {
        super(PageTesterBlockName.InitTester, blockId, browser);
    }

    public readonly BlockContainer = By.css(`init-tester[block-id='${this.blockId}']`);

    public readonly HostObjectText = By.css(`${this.BlockContainer.value} #hostObject textarea`);

    public readonly ConsumesText = By.css(`${this.BlockContainer.value} #receivedConsumes textarea`);

    public readonly BlockLoadingTime = By.css(`${this.BlockContainer.value} [label="Block loading time"] input`);

    public async getHostObjectText(): Promise<string | null> {
        return await this.browser.getElementAttribute(this.HostObjectText, 'title');
    }

    public async getConsumesText(): Promise<string | null> {
        return await this.browser.getElementAttribute(this.ConsumesText, 'title');
    }

    public async getBlockLoadingTime(): Promise<string | null> {
        return await this.browser.getElementAttribute(this.BlockLoadingTime, 'title');
    }
}
