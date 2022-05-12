import { By } from 'selenium-webdriver';
import { Browser } from '../../../../../utilities/browser';
import { SectionBlock } from '../../SectionBlock';

/**
 * Abstract class for displayed Page Tester blocks in a page's Section.
 */
export abstract class PageTesterSectionBlock extends SectionBlock {
    protected constructor(blockName: string, protected blockId: string, browser: Browser) {
        super(blockName, blockId, browser);
        this.XPathParentContainer = By.xpath(`//*[@block-id='${blockId}']/ancestor::section-block`);
    }
}
