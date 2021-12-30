import { Page, PageBlock } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../../services/general.service';
import { PagesService } from '../../services/pages.service';
import { v4 as newUuid } from 'uuid';

export async function SampleTest(generalService: GeneralService, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    const pagesService = new PagesService(generalService);
    const pageBlockRelation = await pagesService.getBlockRelation('Page Block Tester');
    describe('Pages API Tests Suite', () => {
        const testPageBlock: PageBlock = {
            Relation: pageBlockRelation,
            Key: newUuid(),
        };

        const testPage: Page = {
            Name: 'Pages Api Test with block',
            Blocks: [testPageBlock],
            Layout: {
                Sections: [
                    {
                        Key: newUuid(),
                        Columns: [{}],
                        Hide: [],
                    },
                ],
            },
        };
        testPage.Layout.Sections[0] = pagesService.addBlockToSection(testPageBlock, testPage.Layout.Sections[0]);

        it('Create new page', async () => {
            const resultPage: Page = await pagesService.createOrUpdatePage(testPage);
            testPage.Key = resultPage.Key;
            DeepCompareObjects(testPage, resultPage, ['length']);
        });

        it('Delete created page', async () => {
            testPage.Hidden = true;
            const resultPage = await pagesService.deletePage(testPage);
            expect(resultPage.Hidden).to.equal(true);
        });

        function DeepCompareObjects(
            expected: any,
            actual: any,
            excludedProperties?: Array<string>,
            parentProp?: string,
        ) {
            // AssertAndLog(expected, actual);
            if (typeof expected === 'object') {
                const properties = Object.getOwnPropertyNames(expected).filter((prop) =>
                    excludedProperties ? !excludedProperties.includes(prop) : prop,
                );

                properties.forEach((prop) => {
                    parentProp = parentProp ? parentProp + '.' + prop : prop;
                    if (typeof expected[prop] === 'object') {
                        DeepCompareObjects(expected[prop], actual[prop], excludedProperties, parentProp);
                    } else {
                        AssertAndLog(expected[prop], actual[prop], parentProp);
                    }
                });
            } else {
                AssertAndLog(expected, actual);
            }
        }
    });

    function AssertAndLog(expected: any, actual: any, parentProp = '') {
        console.log(`Expected ${parentProp}: ${typeof expected === 'object' ? JSON.stringify(expected) : expected}`);
        console.log(`Actual ${parentProp}: ${typeof actual === 'object' ? JSON.stringify(actual) : actual}`);
        expect(
            actual,
            `The objects don't match: \nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`,
        ).to.equal(expected);
    }
}
