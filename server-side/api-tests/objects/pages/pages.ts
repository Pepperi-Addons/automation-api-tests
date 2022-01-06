import { Page } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../../../services/general.service';
import { PagesService } from '../../../services/pages.service';
// import { v4 as newUuid } from 'uuid';
import { PageBlocksTestSuite } from './page_blocks';

export async function PagesTestSuite(generalService: GeneralService, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    const pagesService = new PagesService(generalService);
    // const pageBlockRelation = await pagesService.getBlockRelation('Page Block Tester');
    describe('Pages API Tests Suite', () => {
        const expected: Page = {
            Name: `${new Date().toLocaleDateString()} - PagesApiTest`,
            Blocks: [],
            Layout: {
                Sections: [],
            },
        };

        it('Create new page', async () => {
            const resultPage = await pagesService.createOrUpdatePage(expected);
            expected.Key = resultPage.Key;
            pagesService.comparePages(expected, resultPage, expect);
        });

        it('Page Blocks Test Suite', async () => await PageBlocksTestSuite(pagesService, tester, expected));
        // it('Page blocks', async () => await PageBlocksTestSuite(pagesService, tester, expected
        //     // {
        //     //     Name: `${new Date().toLocaleDateString()} - PagesApiTest`,
        //     //     Blocks: [],
        //     //     Layout: {
        //     //         Sections: [
        //     //         ],
        //     //     },
        //     // }
        // ));

        // it('Change section data', async () => {
        //     expected.Layout.Sections[0].Name = 'Test Section';
        //     const resultPage: Page = await pagesService.createOrUpdatePage(expected);
        //     pagesService.comparePages(expected, resultPage, expect);
        // });

        it('Delete created page', async () => {
            expected.Hidden = true;
            const resultPage = await pagesService.deletePage(expected);
            expect(resultPage.Hidden).to.equal(true);
        });

        // function comparePages(
        //     expected: any,
        //     actual: any,
        //     expect : Chai.ExpectStatic,
        //     excludedProperties: Array<string> = ['length'],
        //     parentProp?: string,
        // ) {
        //     if (typeof expected === 'object') {
        //         const properties = Object.getOwnPropertyNames(expected).filter((prop) =>
        //             excludedProperties && excludedProperties.length > 0 ? !excludedProperties.includes(prop) : prop,
        //         );

        //         properties.forEach((prop) => {
        //             parentProp = parentProp ? parentProp + '.' + prop : prop;
        //             if (typeof expected[prop] === 'object') {
        //                 comparePages(expected[prop], actual[prop], expect, excludedProperties, parentProp);
        //             } else {
        //                 pagesService.assertAndLog(expected[prop], actual[prop], expect, parentProp);
        //             }
        //         });
        //     } else {
        //         pagesService.assertAndLog(expected, actual, expect);
        //     }
        // }
    });

    // function AssertAndLog(expected: any, actual: any, parentProp = ''): void {
    //     console.log(`Expected ${parentProp}: ${typeof expected === 'object' ? JSON.stringify(expected) : expected}`);
    //     console.log(`Actual ${parentProp}: ${typeof actual === 'object' ? JSON.stringify(actual) : actual}`);
    //     expect(
    //         actual,
    //         `The objects don't match: \nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`,
    //     ).to.equal(expected);
    // }
}

// export function AssertAndLog(expected: any, actual: any, expect : Chai.ExpectStatic, parentProp = ''): void {
//     console.log(`Expected ${parentProp}: ${typeof expected === 'object' ? JSON.stringify(expected) : expected}`);
//     console.log(`Actual ${parentProp}: ${typeof actual === 'object' ? JSON.stringify(actual) : actual}`);
//     expect(
//         actual,
//         `The objects don't match: \nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`,
//     ).to.equal(expected);
// }
