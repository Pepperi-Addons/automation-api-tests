import { NgComponentRelation, PageBlock } from '@pepperi-addons/papi-sdk';
import { PageFactory } from '../../page.factory';
import { PageTesterPageBlock } from '../index';

export class PageBlocksArray extends Array<PageTesterPageBlock> {
    constructor(pageBlocks?: Array<PageBlock>) {
        super(...(pageBlocks || []));
    }

    /**
     * Creates a new PageBlock and appends it to the end of an array.
     * @param blockRelation PageBlock relation from which to create the PageBlock.
     * @returns Reference to the created PageBlock
     */
    createAndAdd(blockRelation: NgComponentRelation): PageBlock {
        const pageBlock = PageFactory.defaultPageBlock(blockRelation);
        const index = this.push(pageBlock);
        return this[index - 1];
    }

    /**
     * Appends PageBlock elements to the end of an array.
     * @param pageBlock PageBlock elements to add to the array.
     */
    add(...pageBlock: PageBlock[]): void {
        this.push(...pageBlock);
    }

    private validateBlocksNotEmpty() {
        if (this.length <= 0) {
            throw new Error('No PageBlocks to remove - empty Blocks array');
        }
    }

    removeByKey(blockKey: string): PageBlock {
        this.validateBlocksNotEmpty();
        const index = this.findIndex((block) => block.Key === blockKey);
        if (index > -1) {
            return this.removeByIndex(index);
        } else {
            throw new Error(`Failed to remove PageBlock - PageBlock Key '${blockKey}'not found`);
        }
    }

    /**
     * Removes PageBlock elements from the array.
     * @param pageBlocks PageBlock elements to remove from the array.
     */
    remove(...pageBlocks: PageBlock[]): void {
        this.validateBlocksNotEmpty();

        pageBlocks.forEach((_pageBlock) => {
            const index = this.findIndex((block) => JSON.stringify(block) === JSON.stringify(_pageBlock));
            if (index > -1) {
                this.removeByIndex(index);
            } else {
                throw new Error(`Failed to remove PageBlock - PageBlock not found:\n'${JSON.stringify(_pageBlock)}'`);
            }
        });
    }
    /**
     * Attempts to remove a PageBlock element from the array. Returns true if removed successfully.
     * @param pageBlocks PageBlock elements to remove from the array.
     */
    tryRemove(pageBlock: PageBlock): boolean {
        try {
            this.remove(pageBlock);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Removes an element by index from the array. Returns the removed PageBlock element.
     * @param index position of the element in the array to remove.
     */
    removeByIndex(index: number): PageBlock {
        if (this?.[index]) {
            const deletedBlock = this.splice(index, 1)[0];
            return deletedBlock;
        } else {
            throw new Error(`Index '${index}' out of bounds`);
        }
    }
}
