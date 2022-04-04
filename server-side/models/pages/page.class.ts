import { DataViewScreenSize, Page, PageBlock } from '@pepperi-addons/papi-sdk';
import { PageBlocksArray } from './page-block-array';
import { PageLayoutClass } from './page-layout.class';

export class PageClass implements Page {
    // [key: string]: any;
    Name?: string;
    Description?: string;
    Blocks: PageBlocksArray;
    Layout: PageLayoutClass;
    Hidden?: boolean;
    CreationDateTime?: string;
    ModificationDateTime?: string;
    Key?: string;

    constructor(blocks?: PageBlocksArray, layout?: PageLayoutClass) {
        this.Blocks = blocks ?? new PageBlocksArray();
        this.Layout = layout ?? new PageLayoutClass();
    }

    static fromPage(page: Page) {
        const autoLayout: PageLayoutClass = PageLayoutClass.fromLayout(page.Layout);
        const autoBlocks: PageBlocksArray = new PageBlocksArray(page?.Blocks);
        const automationPage: PageClass = new PageClass(autoBlocks, autoLayout);
        for (const propName in page) {
            if (propName !== 'Layout' && propName !== 'Blocks') {
                automationPage[propName] = page[propName];
            }
        }
        return automationPage;
    }

    createAndAddBlockToSection(pageBlock: PageBlock, sectionKey: string, column = 0, hide?: Array<DataViewScreenSize>) {
        this.Blocks.add(pageBlock);
        const section = this.Layout.Sections?.findByKey(sectionKey);
        if (!section) {
            throw new Error(`Section with key '${sectionKey}' was not found`);
        }
        section?.addBlock(pageBlock.Key, column, hide);
    }

    /**
     * Removes a PageBlock from the 'Blocks' array along with its Key reference in the first found PageSectionColumn, if exists.
     * @param sections elements to add to the array.
     */
    deleteBlock(pageBlock: PageBlock) {
        this.Blocks.remove(pageBlock);
        this.Layout.Sections.findByBlockKey(pageBlock.Key)?.removeBlock(pageBlock.Key);
    }

    deleteDisplayedBlockByKey(blockKey: string): void {
        this.Blocks.removeByKey(blockKey);
        this.Layout.Sections.findByBlockKey(blockKey)?.removeBlock(blockKey);
    }
}
