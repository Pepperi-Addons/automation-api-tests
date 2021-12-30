import {
    DataViewScreenSize,
    FindOptions,
    NgComponentRelation,
    Page,
    PageBlock,
    PageSection,
    PageSectionBlock,
} from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export class PagesService {
    /**
     *
     */
    constructor(private generalService: GeneralService) {}
    //Returns PageBlock relation by name for Page object's Block Relation
    async getBlockRelation(blockName: string): Promise<NgComponentRelation> {
        const apiResponse = await this.generalService.papiClient.addons.data.relations.find({
            where: `Name='${blockName}'`,
        });
        const fullRelation: NgComponentRelation = apiResponse[0];
        if (fullRelation.RelationName != 'PageBlock') {
            throw new Error(`Unexpected relation name: ${fullRelation.RelationName}`);
        }
        if (fullRelation.Type != 'NgComponent') {
            throw new Error(`Unexpected relation type: ${fullRelation.Type}`);
        }
        if (fullRelation.Name != blockName) {
            throw new Error(`Unexpected PageBlock name: ${fullRelation.Name}`);
        }
        const blockRelation: NgComponentRelation = {
            RelationName: fullRelation.RelationName,
            Type: fullRelation.Type,
            AddonUUID: fullRelation.AddonUUID,
            SubType: fullRelation.SubType,
            Name: fullRelation.Name,
            AddonRelativeURL: fullRelation.AddonRelativeURL,
            ModuleName: fullRelation.ModuleName,
            ComponentName: fullRelation.ComponentName,
        };
        return blockRelation;
    }

    addBlockToSection(
        block: PageBlock,
        section: PageSection,
        column = 0,
        hide?: Array<DataViewScreenSize>,
    ): PageSection {
        const pageSectionBlock: PageSectionBlock = {
            BlockKey: block.Key,
            Hide: hide ? hide : [],
        };
        section.Columns[column].Block = pageSectionBlock;
        return section;
    }

    async deletePage(page: Page): Promise<Page> {
        page.Hidden = true;
        return this.createOrUpdatePage(page);
    }

    async createOrUpdatePage(page: Page): Promise<Page> {
        return this.generalService.papiClient.pages.upsert(page);
    }
    async getPage(pageUuid: string): Promise<Page> {
        return this.generalService.papiClient.pages.uuid(pageUuid).get();
    }
    async getPages(findOptions?: FindOptions): Promise<Array<Page>> {
        return this.generalService.papiClient.pages.find(findOptions);
    }
}
