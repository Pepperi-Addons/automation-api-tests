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
            // RelationName: fullRelation.RelationName,
            // Type: fullRelation.Type,
            AddonUUID: fullRelation.AddonUUID,
            SubType: fullRelation.SubType,
            Name: fullRelation.Name,
            AddonRelativeURL: fullRelation.AddonRelativeURL,
            ModuleName: fullRelation.ModuleName,
            ComponentName: fullRelation.ComponentName,
        } as any;
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
        return await this.createOrUpdatePage(page);
    }

    async createOrUpdatePage(page: Page): Promise<Page> {
        return await this.generalService.papiClient.pages.upsert(page);
    }
    async getPage(pageUuid: string): Promise<Page> {
        return await this.generalService.papiClient.pages.uuid(pageUuid).get();
    }
    async getPages(findOptions?: FindOptions): Promise<Array<Page>> {
        return await this.generalService.papiClient.pages.find(findOptions);
    }

    assertAndLog(expected: any, actual: any, expect: Chai.ExpectStatic, parentProp = ''): void {
        console.log(`Expected ${parentProp}: ${typeof expected === 'object' ? JSON.stringify(expected) : expected}`);
        console.log(`Actual ${parentProp}: ${typeof actual === 'object' ? JSON.stringify(actual) : actual}`);
        expect(
            actual,
            `The objects don't match: \nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`,
        ).to.equal(expected);
    }

    comparePages(
        expected: any,
        actual: any,
        expect: Chai.ExpectStatic,
        excludedProperties: Array<string> = ['length'],
        parentProp?: string,
    ) {
        if (typeof expected === 'object') {
            const properties = Object.getOwnPropertyNames(expected).filter((prop) =>
                excludedProperties && excludedProperties.length > 0 ? !excludedProperties.includes(prop) : prop,
            );

            properties.forEach((prop) => {
                
                if (typeof expected[prop] === 'object') {
					parentProp = parentProp ? parentProp + '.' + prop : prop;
                    this.comparePages(expected[prop], actual[prop], expect, excludedProperties, parentProp);
                } else {
                    this.assertAndLog(expected[prop], actual[prop], expect, parentProp ?? prop);
                }
            });
        } else {
            this.assertAndLog(expected, actual, expect);
        }
    }
}
