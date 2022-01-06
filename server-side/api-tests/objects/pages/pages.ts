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

        
    });

}

