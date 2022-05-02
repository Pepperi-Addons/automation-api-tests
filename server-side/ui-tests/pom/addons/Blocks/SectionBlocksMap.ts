import { PageBlock } from '@pepperi-addons/papi-sdk';
import { SectionBlock } from './SectionBlock';

export class SectionBlocksMap extends Map<string, SectionBlock> {
    /**
     *
     */
    constructor(entries?: readonly (readonly [string, SectionBlock])[] | null | undefined);
    constructor(iterable?: Iterable<readonly [string, SectionBlock]> | null | undefined);
    constructor(
        entriesOrIterable?:
            | Iterable<readonly [string, SectionBlock]>
            | readonly (readonly [string, SectionBlock])[]
            | null
            | undefined,
    ) {
        if (!entriesOrIterable) {
            super();
        } else if (typeof entriesOrIterable[Symbol.iterator] === 'function') {
            const iter = entriesOrIterable as Iterable<readonly [string, SectionBlock]>;
            super(iter);
        } else {
            const arr = entriesOrIterable as readonly (readonly [string, SectionBlock])[];
            super(arr);
        }
    }

    public getBlock<T extends SectionBlock>(pageBlock: PageBlock): T | never;
    public getBlock<T extends SectionBlock>(pageBlockKey: string): T | never;
    public getBlock<T extends SectionBlock>(pageBlockOrKey: string | PageBlock): T | never {
        const blockKey = typeof pageBlockOrKey == 'string' ? pageBlockOrKey : pageBlockOrKey.Configuration.Data.BlockId ? pageBlockOrKey.Configuration.Data.BlockId : '';
        const block = this.get(blockKey);
        if (!block) {
            throw new Error(`Key '${blockKey}' does not exist in the map`);
        }
        return block as T;
    }

    public setBlock<T extends SectionBlock>(sectionBlock: T) {
        return this.set(sectionBlock.BlockId, sectionBlock);
    }

    public deleteBlock<T extends SectionBlock>(sectionBlock: T) {
        return this.delete(sectionBlock.BlockId);
    }

    public hasBlock<T extends SectionBlock>(sectionBlock: T) {
        return this.has(sectionBlock.BlockId);
    }
}
