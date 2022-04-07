import { PageClass } from "../../../../models/pages/page.class";
import { Browser } from "../../../utilities/browser";
import { SectionBlock } from "./SectionBlock";

export class SectionBlocksMap extends Map<string,SectionBlock>{

    /**
     *
     */
    constructor(iterable?: Iterable<readonly [string, SectionBlock]> | null | undefined){
        super(iterable);
    }

    public getBlockOfType<T extends SectionBlock>(blockKey: string): T{
        const block = this.get(blockKey);
        if(!block){
            throw new Error(`Key '${blockKey}' does not exist in the map`);
        }
        return block as T;
    }

    public static createFromPageClass(browser: Browser, page: PageClass){
        
    }
}