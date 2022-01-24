import { FindOptions, NgComponentRelation, Page } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface PageBlockRelation {
    AddonUUID: string;
    SubType: string;
    Name: string;
    AddonRelativeURL: string;
    ModuleName: string;
    ComponentName: string;
}
export class PagesService {
    /**
     *
     */
    mandatoryRelationFields = ['AddonUUID', 'SubType', 'Name', 'AddonRelativeURL', 'ModuleName', 'ComponentName'];
    constructor(private generalService: GeneralService) {}

    private validatePageExists(page: Page) {
        if (!page) {
            throw new Error("Parameter 'page' cannot be null/undefined");
        }
    }
    //Returns only the mandatory fields for PageBlock's 'Relation' property by name from the relations record
    async getBlockRelation(blockName: string): Promise<NgComponentRelation> {
        const apiResponse = await this.generalService.papiClient.addons.data.relations.find({
            where: `Name='${blockName}'`,
        });
        const fullRelation: NgComponentRelation = apiResponse[0];

        if (fullRelation.Name != blockName) {
            throw new Error(`Unexpected PageBlock name: ${fullRelation.Name}`);
        }
        //Only the mandatory fields as specified by API design.
        const blockRelation: any = {};
        this.mandatoryRelationFields.forEach((field) => {
            blockRelation[field] = fullRelation[field];
        });
        return blockRelation;
    }

    async deletePage(page: Page): Promise<Page> {
        page.Hidden = true;
        return this.createOrUpdatePage(page);
    }
    async createOrUpdatePage(page: Page): Promise<Page> {
        // console.log(`${new Date().getTime()} - Create or Update Page`);
        return this.generalService.papiClient.pages.upsert(page);
    }
    async getPage(pageUuid: string): Promise<Page> {
        return this.generalService.papiClient.pages.uuid(pageUuid).get();
    }
    async getPages(findOptions?: FindOptions): Promise<Array<Page>> {
        return this.generalService.papiClient.pages.find(findOptions);
    }

    assertAndLog(expected: any, actual: any, expect: Chai.ExpectStatic): void {
        expect(
            actual,
            `The objects don't match: \nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`,
        ).to.equal(expected);
    }

    objectWithoutTargetProp<Type>(baseObject: Type, properties: string[], targetProp: string): Type {
        const apiObject: Type = {} as any;
        properties
            .filter((prop) => prop != targetProp && prop !== 'length')
            .forEach((prop) => {
                apiObject[prop] = baseObject[prop];
            });
        return apiObject;
    }

    //Deep comparison of objects by value of all properties existing on 'expected' parameter
    deepCompareObjects<Type>(
        expected: Type,
        actual: Type,
        expect: Chai.ExpectStatic,
        excludedProperties: Array<string> = ['length'],
        parentProp?: string,
    ) {
        try {
            if (typeof expected === 'object') {
                const properties = Object.getOwnPropertyNames(expected).filter((prop) =>
                    excludedProperties && excludedProperties.length > 0 ? !excludedProperties.includes(prop) : prop,
                );

                properties.forEach((prop) => {
                    if (typeof expected[prop] === 'object') {
                        parentProp = parentProp ? parentProp + '.' + prop : prop;
                        this.deepCompareObjects(expected[prop], actual[prop], expect, excludedProperties, parentProp);
                    } else {
                        this.assertAndLog(expected[prop], actual[prop], expect);
                    }
                });
            } else {
                this.assertAndLog(expected, actual, expect);
            }
        } catch (error) {
            console.log(
                `Expected ${parentProp ? parentProp : ''}: ${
                    typeof expected === 'object' ? JSON.stringify(expected) : expected
                }`,
            );
            console.log(
                `Actual ${parentProp ? parentProp : ''}: ${
                    typeof actual === 'object' ? JSON.stringify(actual) : actual
                }`,
            );
            throw error;
        }
    }

    // private compare<Type>(
    //     expected: Type,
    //     actual: Type,
    //     expect: Chai.ExpectStatic,
    //     excludedProperties: Array<string> = ['length'],
    //     parentProp?: string,
    // ) {
    //     if (typeof expected === 'object') {
    //         const properties = Object.getOwnPropertyNames(expected).filter((prop) =>
    //             excludedProperties && excludedProperties.length > 0 ? !excludedProperties.includes(prop) : prop,
    //         );

    //         properties.forEach((prop) => {
    //             if (typeof expected[prop] === 'object') {
    //                 parentProp = parentProp ? parentProp + '.' + prop : prop;
    //                 this.deepCompareObjects(expected[prop], actual[prop], expect, excludedProperties, parentProp);
    //             } else {
    //                 this.assertAndLog(expected[prop], actual[prop], expect, parentProp ?? prop);
    //             }
    //         });
    //     } else {
    //         this.assertAndLog(expected, actual, expect);
    //     }
    // }
}
