import { NgComponentRelation, Page, SplitType } from '@pepperi-addons/papi-sdk';
import { v4 as newUuid } from 'uuid';
import { PageClass } from './page.class';
import { PageBlockChart, PageBlockExt } from './pages/page-block.ext';
import { PageSectionClass } from './pages/page-section.class';

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

    public static defaultPageBlock(blockRelation: NgComponentRelation, blockKey?: string): PageBlockExt {
        blockKey = blockKey ?? newUuid();
        const pageBlock: PageBlockExt = {
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

    public static chartPageBlock(blockRelation: NgComponentRelation, blockKey?: string): PageBlockChart {
        blockKey = blockKey ?? newUuid();
        const pageBlock: PageBlockChart = {
            Key: blockKey,
            Relation: blockRelation,
            Configuration: {
                Resource: "Chart",
                AddonUUID: "00000000-0000-0000-0000-0da1a0de41e5",
                Data: {
                    query: {
                        Key: "dcecaf3e-c4a5-43b3-877b-7a7f6690c068"
                    },
                    useDropShadow: true,
                    dropShadow: {
                        type: "Regular",
                        intensity: 5
                    },
                    useBorder: false,
                    border: {
                        color: "hsl(0, 0%, 57%)",
                        opacity: "50"
                    },
                    executeQuery: true,
                    chart: {
                        Key: "2dd2b34e-ce0c-4d46-84bd-26fc9d6bb492",
                        ScriptURI: "https://pfs.pepperi.com/35247bab-7e80-444c-8c55-d0f144fdc88e/3d118baf-f576-4cdb-a81e-c2cc9af4d7ad/Bar.js"
                    },
                    useLabel: false,
                    label: "testing",
                    height: 22
                }
            }
        };

        return pageBlock;
    }

    public static defaultSection(split?: SplitType | undefined, sectionKey?: string | undefined): PageSectionClass {
        sectionKey = sectionKey ?? newUuid();
        split = split ?? undefined;

        return new PageSectionClass(sectionKey, split);
    }
}
