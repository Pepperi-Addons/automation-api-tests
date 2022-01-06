// import GeneralService, { TesterFunctions } from '../../../services/general.service';
import { Page, PageBlock } from '@pepperi-addons/papi-sdk';
import { TesterFunctions } from '../../../services/general.service';
import { PagesService } from '../../../services/pages.service';
import { v4 as newUuid } from 'uuid';
import { PageClass } from '../../../models/page.class';

export async function PageBlocksTestSuite(
    pagesService: PagesService,
    testerFunctions: TesterFunctions,
    currentPage: Page,
) {
    const describe = testerFunctions.describe;
    const expect = testerFunctions.expect;
    const it = testerFunctions.it;

    const service = pagesService;

    const pageClass = new PageClass(currentPage);
    const pageBlockRelation = await service.getBlockRelation('Page Block Tester');
    const testPageBlock: PageBlock = {
        Relation: pageBlockRelation,
        Key: newUuid(),
    };

    describe('Page Blocks Tests Suite', () => {
        it('Add Page Block', async () => {
            pageClass.addBlock(testPageBlock);
            const resultPage = await pagesService.createOrUpdatePage(pageClass.page);
            pagesService.comparePages(pageClass.page, resultPage, expect);
            currentPage = pageClass.page;
        });

        it('Add duplicate Page Block key', async () => {
            let apiError: any;
            pageClass.addBlock(testPageBlock);
            await pagesService.createOrUpdatePage(pageClass.page).catch((error) => (apiError = error));
            expect(
                apiError?.message,
                `Validation failed on Block Key uniqueness\nSent data: ${JSON.stringify(pageClass.page)}`,
            ).is.not.undefined.and.is.not.null;
        });

        it('Add PageBlock with no Key', async () => {
            const noKeyBlock: PageBlock = {
                Relation: pageBlockRelation,
            } as any;
            pageClass.addBlock(noKeyBlock);
            let apiError: any;
            try {
                await pagesService.createOrUpdatePage(pageClass.page).catch((error) => (apiError = error));
                expect(
                    apiError?.message,
                    `Did not receive error on not sending 'Key' property\nSent data: ${JSON.stringify(noKeyBlock)}`,
                ).is.not.undefined.and.is.not.null;
            } finally {
                if (pageClass.page.Blocks.includes(noKeyBlock)) {
                    pageClass.removeBlock(noKeyBlock);
                }
            }
        });

        it('Add PageBlock with no Relation', async () => {
            const noRelationBlock: PageBlock = {
                Key: newUuid(),
            } as any;
            pageClass.addBlock(noRelationBlock);
            let apiError: any;
            try {
                await pagesService.createOrUpdatePage(pageClass.page).catch((error) => (apiError = error));
                expect(
                    apiError?.message,
                    `Did not receive error on not sending 'Key' property\nSent data: ${JSON.stringify(
                        noRelationBlock,
                    )}`,
                ).is.not.undefined.and.is.not.null;
            } finally {
                if (pageClass.page.Blocks.includes(noRelationBlock)) {
                    pageClass.removeBlock(noRelationBlock);
                }
            }
        });

        const properties = Object.getOwnPropertyNames(pageBlockRelation).filter((prop) => prop !== 'length');
        const pageBlock: PageBlock = { Key: testPageBlock.Key } as any;
        try {
            properties.forEach((prop) => {
                it(`Remove PageBlock Relation's '${prop}' field`, async () => {
                    let apiError: any;
                    pageBlock.Relation = {} as any;
                    properties
                        .filter((relationProp) => relationProp != prop && relationProp !== 'length')
                        .forEach((relationProp) => {
                            pageBlock.Relation[relationProp] = pageBlockRelation[relationProp];
                        });

                    pageClass.overwriteBlockByKey(pageBlock.Key, pageBlock);
                    await pagesService.createOrUpdatePage(pageClass.page).catch((error) => (apiError = error));

                    expect(
                        apiError?.message,
                        `Did not receive error on not sending '${prop}' data\nSent data: ${JSON.stringify(pageBlock)}`,
                    ).is.not.undefined.and.is.not.null;
                });
            });
        } finally {
            if (pageClass.page.Blocks.includes(pageBlock)) {
                pageClass.removeBlock(pageBlock);
            }
        }

        currentPage.Blocks = [testPageBlock];
    });
}
