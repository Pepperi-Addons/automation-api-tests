import { By } from 'selenium-webdriver';
import { Browser } from '../../../utilities/browser';
import { SectionBlock } from './SectionBlock';

export class DynamicTester extends SectionBlock {
    constructor(browser: Browser) {
        super('Dynamic Tester', browser);
    }

    public static readonly BlockContainer = By.css('dynamic-tester');

    public static readonly HostObjectText = By.css(`${DynamicTester.BlockContainer.value} #hostObject textarea`);

    public static readonly ConsumesText = By.css(`${DynamicTester.BlockContainer.value} #receivedConsumes textarea`);

    public static getSetParamBtn(paramKey: string) {
        return By.css(`${DynamicTester.BlockContainer.value} button[data-qa='${paramKey}']`);
    }

    public async getHostObjectText(): Promise<string | null> {
        return await this.browser.getElementAttribute(DynamicTester.HostObjectText, 'title');
    }

    public async getConsumesText(): Promise<string | null> {
        return await this.browser.getElementAttribute(DynamicTester.ConsumesText, 'title');
    }

    public async clickSetParamBtn(paramKey: string): Promise<void> {
        return await this.browser.click(DynamicTester.getSetParamBtn(paramKey));
    }

}
