import { NgComponentRelation, Page, PageBlock } from '@pepperi-addons/papi-sdk';
import { v4 as newUuid } from 'uuid';

export class PageFactory {
    //Returns new Page object with all mandatory properties + Page name
    public static defaultPage(pageName?: string): Page {
        pageName = pageName ?? `${newUuid()} - PagesApiTest`;
        const page: Page = {
            Name: pageName,
            Blocks: [],
            Layout: {
                Sections: [],
            },
        };
        return page;
    }

    public static defaultPageBlock(blockRelation: NgComponentRelation, blockKey?: string): PageBlock {
        blockKey = blockKey ?? newUuid();
        const pageBlock: PageBlock = {
            Relation: blockRelation,
            Key: blockKey,
            Configuration: {
                AddonUUID: blockRelation.AddonUUID,
                Resource: blockRelation.Name,
                Data: undefined,
            },
        };
        return pageBlock;
    }
}
