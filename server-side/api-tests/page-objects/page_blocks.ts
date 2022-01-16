// import GeneralService, { TesterFunctions } from '../../../services/general.service';
import { Page, PageBlock } from '@pepperi-addons/papi-sdk';
import { TesterFunctions } from '../../services/general.service';
import { PagesService } from '../../services/pages.service';
import { v4 as newUuid } from 'uuid';
import { PageClass } from '../../models/page.class';

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

    let pageBlockRelation: any;
    let basePageBlock: PageBlock;
    describe('Page Blocks Tests Suite', function () {
        debugger;
        it('Get Block Rleation', async function () {
            debugger;
            pageBlockRelation = await service.getBlockRelation('Page Block Tester');
            basePageBlock = {
                Relation: pageBlockRelation,
                Key: newUuid(),
            };
        });

        it('Add Page Block', async () => {
            console.log(`${new Date().getTime()} - Started test: Add Page Block`);
            pageClass.addNewBlock(basePageBlock);
            const resultPage = await pagesService.createOrUpdatePage(pageClass.page);
            pagesService.deepCompareObjects(pageClass.page, resultPage, expect);
            currentPage = pageClass.page;
            console.log(`${new Date().getTime()} - Ended test: Add Page Block`);
        });

        // it('Add duplicate Page Block key', async () => {
        //     console.log(`${new Date().getTime()} - Started test: Add Duplicate Page Block Key`);
        //     let apiError: any;
        //     pageClass.addNewBlock(basePageBlock);
        //     await pagesService.createOrUpdatePage(pageClass.page).catch((error) => (apiError = error));
        //     console.log(`${new Date().getTime()} - Ended test: Add Duplicate Page Block Key`);
        //     expect(
        //         apiError?.message,
        //         `Validation failed on Block Key uniqueness\nSent data: ${JSON.stringify(pageClass.page)}`,
        //     ).is.not.undefined.and.is.not.null;
        // });

        it('another', function () {
            describe('Add PageBlock without property', function () {
                debugger;

                const blockProps = Object.getOwnPropertyNames(basePageBlock).filter((prop) => prop !== 'length');
                try {
                    for (const prop of blockProps) {
                        debugger;
                        // const prop = blockProps[index];
                        it(`'${prop}'`, async () => {
                            debugger;
                            console.log(
                                `${new Date().getTime()} - Started test: Add PageBlock without '${prop}' field`,
                            );
                            let pageBlock: PageBlock = {} as any;
                            try {
                                let apiError: any;
                                pageBlock = pagesService.objectWithoutTargetProp(basePageBlock, blockProps, prop);

                                pageClass.addNewBlock(pageBlock);
                                await pagesService
                                    .createOrUpdatePage(pageClass.page)
                                    .catch((error) => (apiError = error));

                                expect(
                                    apiError?.message,
                                    `Did not receive error on not sending '${prop}' data\nSent data: ${JSON.stringify(
                                        pageBlock,
                                    )}`,
                                ).is.not.undefined.and.is.not.null;
                            } finally {
                                if (pageClass.page.Blocks.includes(pageBlock)) {
                                    pageClass.removeBlock(pageBlock);
                                }
                            }
                        });
                    }
                } catch (error) {
                    debugger;
                }

                // blockProps.forEach((prop) => {
                //     it(`'${prop}'`, async () => {
                //         debugger;
                //         console.log(`${new Date().getTime()} - Started test: Add PageBlock without '${prop}' field`);
                //         let pageBlock: PageBlock = {} as any;
                //         try {
                //             let apiError: any;
                //             pageBlock = pagesService.objectWithoutTargetProp(basePageBlock, blockProps, prop);

                //             pageClass.addNewBlock(pageBlock);
                //             await pagesService.createOrUpdatePage(pageClass.page).catch((error) => (apiError = error));

                //             expect(
                //                 apiError?.message,
                //                 `Did not receive error on not sending '${prop}' data\nSent data: ${JSON.stringify(pageBlock)}`,
                //             ).is.not.undefined.and.is.not.null;
                //         }
                //         finally {
                //             if (pageClass.page.Blocks.includes(pageBlock)) {
                //                 pageClass.removeBlock(pageBlock);
                //             }
                //         }
                //     });
                // });
            });
        });

        it('another2', function () {
            describe('Add PageBlock without property', function () {
                debugger;
                const properties = Object.getOwnPropertyNames(pageBlockRelation).filter((prop) => prop !== 'length');
                const pageBlock: PageBlock = { Key: basePageBlock.Key } as any;
                try {
                    properties.forEach((prop) => {
                        it(`Remove PageBlock Relation's '${prop}' field`, async () => {
                            debugger;
                            console.log(
                                `${new Date().getTime()} - Started test: Remove PageBlock Relation's '${prop}' field`,
                            );

                            let apiError: any;

                            pageBlock.Relation = pagesService.objectWithoutTargetProp(
                                pageBlockRelation,
                                properties,
                                prop,
                            );

                            pageClass.overwriteBlockByKey(pageBlock.Key, pageBlock);
                            await pagesService.createOrUpdatePage(pageClass.page).catch((error) => (apiError = error));

                            expect(
                                apiError?.message,
                                `Did not receive error on not sending '${prop}' data\nSent data: ${JSON.stringify(
                                    pageBlock,
                                )}`,
                            ).is.not.undefined.and.is.not.null;

                            console.log(
                                `${new Date().getTime()} - Ended test: Remove PageBlock Relation's '${prop}' field`,
                            );
                        });
                    });
                } finally {
                    if (pageClass.page.Blocks.includes(pageBlock)) {
                        pageClass.removeBlock(pageBlock);
                    }
                }
            });
        });

        // currentPage.Blocks = [basePageBlock];
    });
}
