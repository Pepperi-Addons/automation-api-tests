import {
    NgComponentRelation,
    Page,
    PageBlock,
    PageSection,
    PageSectionColumn,
    SplitType,
} from '@pepperi-addons/papi-sdk';
import { v4 as newUuid } from 'uuid';
import { PageClass } from './page.class';

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

    public static defaultPageClass(pageName?: string): PageClass {
        return new PageClass(this.defaultPage(pageName));
    }

    public static defaultPageBlock(blockRelation: NgComponentRelation, blockKey?: string): PageBlock {
        blockKey = blockKey ?? newUuid();
        const pageBlock: PageBlock = {
            Relation: blockRelation,
            Key: blockKey,
            Configuration: {
                AddonUUID: blockRelation.AddonUUID,
                Resource: blockRelation.Name,
                Data: {},
            },
        };
        return pageBlock;
    }

    public static defaultSection(split?: SplitType | undefined, sectionKey?: string | undefined): PageSection {
        sectionKey = sectionKey ?? newUuid();
        split = split ?? undefined;
        const baseSection: PageSection = {
            Key: sectionKey,
            Columns: getColumnsLength(split),
            Split: split,
        };
        return baseSection;

        function getColumnsLength(split?: SplitType | undefined) {
            const columns : PageSectionColumn[] = [];
            
            let columnNumber = 1;
            if(split){
                columnNumber = Math.max(split.split('/').length - 1, 1);
            }
            for(let i=0; i<columnNumber; i++){
                columns.push({});
            }
            return columns;
        }
    }
}
