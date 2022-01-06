import {
    FindOptions,
    NgComponentRelation,
    Page
} from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export class PagesService {
    /**
     *
     */
    mandatoryRelationFields = ["AddonUUID", "SubType", "Name", "AddonRelativeURL", "ModuleName", "ComponentName"];
    constructor(private generalService: GeneralService) {}

    private validatePageExists(page: Page) {
        if (!page) {
            throw new Error("Parameter 'page' cannot be null/undefined");
        }
    }
    //Returns only the mandatory fields for PageBlock's 'Relation' property by name from the relations record
    async getBlockRelation(blockName: string): Promise<any> {
        const apiResponse = await this.generalService.papiClient.addons.data.relations.find({
            where: `Name='${blockName}'`,
        });
        const fullRelation: NgComponentRelation = apiResponse[0];

        if (fullRelation.Name != blockName) {
            throw new Error(`Unexpected PageBlock name: ${fullRelation.Name}`);
        }
        //Only the mandatory fields as specified by API design.
        const blockRelation : any = {};
        this.mandatoryRelationFields.forEach((field) => {
            blockRelation[field] = fullRelation[field]
        });
        return blockRelation;
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
        // if (typeof expected === 'object') {
        //     const properties = Object.getOwnPropertyNames(expected).filter((prop) =>
        //         excludedProperties && excludedProperties.length > 0 ? !excludedProperties.includes(prop) : prop,
        //     );

        //     properties.forEach((prop) => {
        //         if (typeof expected[prop] === 'object') {
        //             parentProp = parentProp ? parentProp + '.' + prop : prop;
        //             this.comparePages(expected[prop], actual[prop], expect, excludedProperties, parentProp);
        //         } else {
        //             this.assertAndLog(expected[prop], actual[prop], expect, parentProp ?? prop);
        //         }
        //     });
        // } else {
        //     this.assertAndLog(expected, actual, expect);
        // }
        try {
            this.compare(expected, actual, expect, excludedProperties, parentProp);
        } catch (error) {
            console.log(
                `Expected ${parentProp}: ${typeof expected === 'object' ? JSON.stringify(expected) : expected}`,
            );
            console.log(`Actual ${parentProp}: ${typeof actual === 'object' ? JSON.stringify(actual) : actual}`);
            throw error;
        }
    }

    private compare(
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
