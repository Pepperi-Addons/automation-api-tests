import { NgComponentRelation, Page, SplitType } from '@pepperi-addons/papi-sdk';
import { v4 as newUuid } from 'uuid';
import { PageApiClass } from './page-api.class';
import { PageTesterPageBlock } from './pages/interfaces/page-tester-page-block.interface';
import { PageSectionClass } from './pages/implementations/page-section.class';

export class PageFactory {
    //Returns new Page object with all mandatory properties + Page name
    public static defaultPage(pageName?: string | undefined): Page {
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

    public static defaultPageApiClass(pageName?: string): PageApiClass {
        return new PageApiClass(this.defaultPage(pageName));
    }

    public static defaultPageBlock(blockRelation: NgComponentRelation, blockKey?: string): PageTesterPageBlock {
        blockKey = blockKey ?? newUuid();
        const pageBlock: PageTesterPageBlock = {
            Relation: blockRelation,
            Key: blockKey,
            Configuration: {
                AddonUUID: blockRelation.AddonUUID,
                Resource: blockRelation.Name,
                Data: {
                    BlockId: '',
                    Parameters: [],
                },
            },
        };
        return pageBlock;
    }

    public static defaultSection(split?: SplitType | undefined, sectionKey?: string | undefined): PageSectionClass {
        sectionKey = sectionKey ?? newUuid();
        split = split ?? undefined;

        return new PageSectionClass(sectionKey, split);
    }
}
