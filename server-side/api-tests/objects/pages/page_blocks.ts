// import GeneralService, { TesterFunctions } from '../../../services/general.service';
import { NgComponentRelation, Page, PageBlock } from '@pepperi-addons/papi-sdk';
import { TesterFunctions } from '../../../services/general.service';
import { PagesService } from '../../../services/pages.service';
import { v4 as newUuid } from 'uuid';

export async function PageBlocksTestSuite(
    pagesService: PagesService,
    testerFunctions: TesterFunctions,
    currentPage: Page,
)  {
    const describe = testerFunctions.describe;
    const expect = testerFunctions.expect;
    const it = testerFunctions.it;

    const service = pagesService;
	
    const pageBlockRelation: NgComponentRelation = await service.getBlockRelation('Page Block Tester');
    describe('Page Blocks Test Suite', () => {
        const testPageBlock : PageBlock = {
            Relation: pageBlockRelation,
            Key: newUuid(),
        };
        currentPage.Blocks = [testPageBlock];

        it('Add Page Block', async () => {
            const resultPage = await pagesService.createOrUpdatePage(currentPage);
            pagesService.comparePages(currentPage, resultPage, expect);
        });

        it('Change Page Block values', async () => {
            const properties = Object.getOwnPropertyNames(pageBlockRelation).filter((prop) => prop !== 'length');
			for(let index = 0; index < properties.length; index++){
				let prop = properties[index];
				let pageBlock: any = {};
				let apiError : any;
                if (prop === 'Key') {
                    pageBlock.Relation = pageBlockRelation;
                } else {
                    pageBlock.Key = testPageBlock.Key;
					pageBlock.Relation = {};
					// debugger;
                    properties
                        .filter((relationProp) => relationProp != prop && relationProp !== 'Key' && relationProp !== 'length')
                        .forEach((relationProp) => {
                            pageBlock.Relation[relationProp] = pageBlockRelation[relationProp];
                        });
                }
				currentPage.Blocks = [pageBlock];
				currentPage = await pagesService.createOrUpdatePage(currentPage).catch((error) => apiError = error);

				expect(apiError?.message, `Did not receive error on not sending '${prop}' data\nSent data: ${JSON.stringify(pageBlock)}`).is.not.undefined.and.is.not.null;
			}

			currentPage.Blocks = [testPageBlock];

        })
    });
	// pagesService.deletePage(currentPage);
}
