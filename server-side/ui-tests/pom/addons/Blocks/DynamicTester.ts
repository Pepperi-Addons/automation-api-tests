import { By } from 'selenium-webdriver';
import { Browser } from '../../../utilities/browser';
import { SectionBlock } from './SectionBlock';

export class DynamicTester extends SectionBlock {
    constructor(blockId: string, browser: Browser) {
        super('Dynamic Tester', blockId, browser);
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
}
