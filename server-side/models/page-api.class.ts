import {
    DataViewScreenSize,
    Page,
    PageBlock,
    PageSection,
    PageBlockContainer,
    PageLayout,
} from '@pepperi-addons/papi-sdk';
export class PageApiClass implements Partial<Page> {
    /**
     *
     */
    //returns a shallow copy of PageClass's 'page' member.
    get page(): Page {
        return this.shallowCopyPage(this._page);
    }

    constructor(private _page: Page) {
        if (!_page) {
            throw new Error("'page' cannot be null/undefined");
        }
        this._page = this.shallowCopyPage(_page);
        for (const prop in this._page) {
            if (this._page[prop]) {
                this[prop] = this._page[prop];
            }
        }
    }
    [key: string]: any;
    Name?: string;
    Description?: string;
    Blocks?: PageBlock[];
    Layout?: PageLayout;
    Hidden?: boolean;
    CreationDateTime?: string;
    ModificationDateTime?: string;
    Key?: string;

    private shallowCopyPage(page: Page): Page {
        return JSON.parse(JSON.stringify(page));
    }

    editPageKey(key: string | undefined) {
        this._page.Key = key;
        this.Key = key;
    }

    addNewBlock(pageBlock: PageBlock): void {
        if (!this._page?.Blocks) {
            throw new Error("The page's 'Blocks' property is undefined/not initialzied");
        }
        this._page.Blocks.push(pageBlock);
    }

    overwriteBlockByKey(blockKey: string, pageBlock: PageBlock): void {
        this.removeBlockByKey(blockKey);
        this.addNewBlock(pageBlock);
    }

    addBlockToSection(
        blockKey: string,
        sectionKey: string,
        column = 0,
        hide?: Array<DataViewScreenSize> | undefined,
    ): void {
        const pageBlockContainer: PageBlockContainer = {
            BlockKey: blockKey,
            Hide: hide ?? undefined,
        };
        const sectionIndex = this._page.Layout.Sections.findIndex((section: PageSection) => section.Key === sectionKey);
        this._page.Layout.Sections[sectionIndex].Columns[column] = { BlockContainer: pageBlockContainer };
    }

    addNewBlockToSection(
        pageBlock: PageBlock,
        sectionKey: string,
        column = 0,
        hide?: Array<DataViewScreenSize> | undefined,
    ) {
        this.addNewBlock(pageBlock);
        this.addBlockToSection(pageBlock.Key, sectionKey, column, hide);
    }

    removeBlockByIndex(index: number) {
        if (this._page.Blocks.length === 1 && index === 0) {
            this._page.Blocks = [];
        } else {
            this._page.Blocks.splice(index, 1);
        }
    }

    private validatePageBlocksNotEmpty(): void {
        if (this._page.Blocks.length <= 0) {
            throw new Error('No PageBlocks to remove - empty Page.Blocks array');
        }
    }

    removeBlockByKey(blockKey: string): void {
        this.validatePageBlocksNotEmpty();
        const index = this._page.Blocks.findIndex((block) => block.Key === blockKey);
        if (index > -1) {
            this.removeBlockByIndex(index);
        } else {
            throw new Error(`PageBlock Key not found - failed to remove PageBlock Key: '${blockKey}'`);
        }
    }

    removeBlock(pageBlock: PageBlock): void {
        this.validatePageBlocksNotEmpty();
        const index = this._page.Blocks.findIndex((block) => JSON.stringify(block) === JSON.stringify(pageBlock));
        if (index > -1) {
            this.removeBlockByIndex(index);
        } else {
            throw new Error(`PageBlock not found - failed to remove PageBlock:\n'${JSON.stringify(pageBlock)}'`);
        }
    }

    addSection(pageSection: PageSection): void {
        if (!this._page?.Layout) {
            throw new Error("The page's 'Layout' property is undefined/not initialzied");
        }
        if (!this._page.Layout?.Sections) {
            throw new Error("The page layout's 'Sections' property is undefined/not initialzied");
        }
        this._page.Layout.Sections.push(pageSection);
    }

    removeSectionByKey(sectionKey: string): void {
        const index = this._page.Layout.Sections.findIndex((section: PageSection) => section.Key === sectionKey);
        if (index > -1) {
            if (this._page.Layout.Sections.length == 1) {
                this._page.Layout.Sections = [];
            } else {
                this._page.Layout.Sections.splice(index, 1);
            }
        } else {
            throw new Error(`The Block Key '${sectionKey}' was not found in the page`);
        }
    }

    removeSection(pageSection: PageSection): void {
        this.removeBlockByKey(pageSection.Key);
    }
}
