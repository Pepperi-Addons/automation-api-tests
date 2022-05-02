import { Browser } from '../../../../../utilities/browser';
import { PageTesterSectionBlock } from './PageTesterSectionBlock.block';

/**
 * Abstract class of PageTester blocks that contain configurations.
 */
export abstract class ConfigurablePageTesterBlock extends PageTesterSectionBlock {
    protected constructor(blockName: string, protected blockId: string, browser: Browser) {
        super(blockName, blockId, browser);
    }
    /**
     * Initializes block configuration by entering block edit mode. Exits edit block mode after loading animation has finished.
     */
    public async initBlockConfig(): Promise<void> {
        await this.editBlock();
        return await this.SideBar.exitBlockEditorMode();
    }
}
