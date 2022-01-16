import { Page, PageBlock, PageSection } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../../../services/general.service';
import { PagesService } from '../../../services/pages.service';
import { v4 as newUuid } from 'uuid';
import { PageClass } from '../../../models/page.class';

export async function PagesTestSuite(generalService: GeneralService, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    const pagesService = new PagesService(generalService);
    const pageBlockRelation = await pagesService.getBlockRelation('Page Block Tester');
    const basePageBlock: PageBlock = {
        Relation: pageBlockRelation,
        Key: newUuid(),
    };
    describe('Pages API Tests Suite', function () {
        console.log(`${new Date().getTime()} - Started Describe: Pages API Tests Suite`);
        let basePage: Page = {
            Name: `${generalService.getDate()} - ${generalService.getTime()} - PagesApiTest`,
            Blocks: [],
            Layout: {
                Sections: [],
            },
            Hidden: false,
        };

        it('Create new page', async function () {
            console.log(`${new Date().getTime()} - Started test: Create new page`);

            const resultPage = await pagesService.createOrUpdatePage(basePage);
            basePage.Key = resultPage.Key;
            console.log(`${new Date().getTime()} - Ended test: Create new page`);
            pagesService.deepCompareObjects(basePage, resultPage, expect);
        });

        describe('Modify Base Page Tests Suite', function () {
            it('Modify page name', async function () {
                console.log(`${new Date().getTime()} - Started Describe: Modify Base Page Tests Suite`);
                console.log(`${new Date().getTime()} - Started test: Modify page name`);
                basePage.Name = `${new Date().toLocaleDateString()} - PagesApiTest`;
                const resultPage = await pagesService.createOrUpdatePage(basePage);
                console.log(`${new Date().getTime()} - Ended test: Modify page name`);
                pagesService.deepCompareObjects(basePage, resultPage, expect);
            });
            it('Add Page with Incorrect Type', async function () {
                const testPage: Page = {
                    Name: `${generalService.getDate()} - ${generalService.getTime()} - PagesApiTest`,
                    Blocks: [],
                    Layout: {
                        Sections: [],
                    },
                    Hidden: false,
                    Type: 'BadType',
                } as any;
                //TODO: Add specific response error message
                await expect(pagesService.createOrUpdatePage(testPage)).to.eventually.be.rejected;
                await pagesService.deletePage(testPage);
            });

            it('Add Page with Unknown Property', async function () {
                const testPage: Page = {
                    Name: `${generalService.getDate()} - ${generalService.getTime()} - PagesApiTest`,
                    Blocks: [],
                    Layout: {
                        Sections: [],
                    },
                    Hidden: false,
                    BadProperty: true,
                } as any;

                await expect(pagesService.createOrUpdatePage(testPage)).to.be.fulfilled.and.to.not.have.property(
                    'BadProperty',
                );
                await pagesService.deletePage(testPage);
            });

            it('Add Page without Blocks', async function () {
                const testPage: Page = {
                    Name: `${generalService.getDate()} - ${generalService.getTime()} - PagesApiTest`,
                    Layout: {
                        Sections: [],
                    },
                } as any;
                await expect(pagesService.createOrUpdatePage(testPage)).to.eventually.be.rejectedWith(
                    `Blocks is missing`,
                );
            });

            it('Add Page without Layout', async function () {
                const testPage: Page = {
                    Name: `${generalService.getDate()} - ${generalService.getTime()} - PagesApiTest`,
                    Blocks: [],
                } as any;
                await expect(pagesService.createOrUpdatePage(testPage)).to.eventually.be.rejectedWith(
                    `Layout is missing`,
                );
            });

            it('Add Layout without Sections', async function () {
                const testPage: Page = {
                    Name: `${generalService.getDate()} - ${generalService.getTime()} - PagesApiTest`,
                    Blocks: [],
                    Layout: {},
                } as any;
                await expect(pagesService.createOrUpdatePage(testPage)).to.eventually.be.rejectedWith(
                    `Sections is missing`,
                );
            });
        });

        describe('Page Blocks Tests Suite', function () {
            it('Add Page Block', async function () {
                console.log(`${new Date().getTime()} - Started Describe: Page Blocks Tests Suite`);
                const testPage = new PageClass(basePage);
                testPage.addNewBlock(basePageBlock);
                const resultPage = await pagesService.createOrUpdatePage(testPage.page);
                pagesService.deepCompareObjects(testPage.page, resultPage, expect);
                basePage = testPage.page;
            });

            it('Add PageBlock to Blocks as Value (not as array)', async function () {
                const testPage: Page = {
                    Name: `${newUuid()} - PagesApiTest`,
                    Blocks: basePageBlock,
                    Layout: {
                        Sections: [],
                    },
                } as any;
                await expect(pagesService.createOrUpdatePage(testPage)).to.eventually.be.rejected;
            });

            it('Add PageBlock without mandatory field', async function () {
                const blockProps = Object.getOwnPropertyNames(basePageBlock).filter((prop) => prop !== 'length');
                for (const prop of blockProps) {
                    const pageClass = new PageClass(basePage);
                    let pageBlock: PageBlock = {} as any;
                    console.log(`${new Date().getTime()} - Started test: Add PageBlock without '${prop}' field`);
                    pageBlock = pagesService.objectWithoutTargetProp(basePageBlock, blockProps, prop);

                    pageClass.addNewBlock(pageBlock);
                    await expect(pagesService.createOrUpdatePage(pageClass.page)).to.eventually.be.rejectedWith(
                        `${prop} is missing`,
                    );
                    console.log(`${new Date().getTime()} - Ended test: Add PageBlock without '${prop}' field`);
                }
            });

            it('Add PageBlock without mandatory Relation fields', async function () {
                const properties = Object.getOwnPropertyNames(pageBlockRelation).filter((prop) => prop !== 'length');
                const pageClass = new PageClass(basePage);
                const pageBlock: PageBlock = { Key: basePageBlock.Key } as any;
                for (const prop of properties) {
                    console.log(`${new Date().getTime()} - Started test: Remove PageBlock Relation's '${prop}' field`);

                    pageBlock.Relation = pagesService.objectWithoutTargetProp(pageBlockRelation, properties, prop);

                    pageClass.overwriteBlockByKey(pageBlock.Key, pageBlock);

                    await expect(pagesService.createOrUpdatePage(pageClass.page)).to.eventually.be.rejectedWith(
                        `${prop} is missing`,
                    );

                    console.log(`${new Date().getTime()} - Ended test: Remove PageBlock Relation's '${prop}' field`);
                }
            });

            it('Add duplicate Page Block key', async function () {
                const pageClass = new PageClass(basePage);
                pageClass.addNewBlock(basePageBlock);
                //TODO: Add specific error message once issue is resolved (currently no validation on block keys)
                await expect(pagesService.createOrUpdatePage(pageClass.page)).to.eventually.be.rejected;
            });
        });

        const baseSection: PageSection = {
            Key: newUuid(),
            Columns: [{}],
        };
        describe('Page Layout Tests Suite', function () {
            it('Add Page Section', async function () {
                console.log(`${new Date().getTime()} - Started Describe: Page Layout Tests Suite`);
                console.log(`${new Date().getTime()} - Started test: Add Page Section`);
                const testPage = new PageClass(basePage);
                testPage.addSection(baseSection);
                const result = await pagesService.createOrUpdatePage(testPage.page);
                pagesService.deepCompareObjects(testPage.page, result, expect);
                basePage = testPage.page;
                console.log(`${new Date().getTime()} - Ended test: Add Page Section`);
            });

            it('Add Page Layout with Incorrect PageSizeType', async function () {
                const testPage = new PageClass(basePage);
                const tempPage = testPage.page;
                tempPage.page.Layout.ColumnsGap = 'BadType' as any;
                await expect(pagesService.createOrUpdatePage(tempPage)).to.eventually.be.rejected;
                // await pagesService.deletePage(testPage);
            });

            it('Add Block to Section', async function () {
                const testPage = new PageClass(basePage);
                testPage.addBlockToSection(basePageBlock.Key, baseSection.Key, 0);
                const result = await pagesService.createOrUpdatePage(testPage.page);
                pagesService.deepCompareObjects(testPage.page, result, expect);
                basePage = testPage.page;
            });

            it('Add Page Section without mandatory field', async function () {
                const sectionProps = Object.getOwnPropertyNames(baseSection).filter((prop) => prop !== 'length');
                for (const prop of sectionProps) {
                    const pageClass = new PageClass(basePage);
                    let pageSection: PageSection = {} as any;
                    pageSection = pagesService.objectWithoutTargetProp(baseSection, sectionProps, prop);
                    pageClass.addSection(pageSection);
                    await expect(pagesService.createOrUpdatePage(pageClass.page)).to.eventually.be.rejectedWith(
                        `${prop} is missing`,
                    );
                }
            });
            it('Add Incorrect Block Key to Section', async function () {
                const testPage = new PageClass(basePage);
                const testSection: PageSection = {
                    Key: newUuid(),
                    Columns: [{}],
                };
                testPage.addSection(testSection);
                testPage.addBlockToSection('NoKey', testSection.Key, 0);
                await expect(pagesService.createOrUpdatePage(testPage.page)).to.eventually.be.rejected;
            });
            it('Add Incorrect Section Split values', async function () {
                const testPage = new PageClass(basePage);
                const testSection: PageSection = {
                    Key: newUuid(),
                    Columns: [{}, {}, {}],
                    Split: '1/2 1/2 1/2',
                } as any;
                testPage.addSection(testSection);
                await expect(pagesService.createOrUpdatePage(testPage.page)).to.eventually.be.rejected;
            });
            it('Add Duplicate Block Key to Section', async function () {
                const testPage = new PageClass(basePage);
                const testSection: PageSection = {
                    Key: newUuid(),
                    Columns: [{}, {}],
                    Split: '1/2 1/2',
                };
                testPage.addSection(testSection);
                testPage.addBlockToSection(basePageBlock.Key, testSection.Key, 0);
                testPage.addBlockToSection(basePageBlock.Key, testSection.Key, 1);
                await expect(pagesService.createOrUpdatePage(testPage.page)).to.eventually.be.rejected;
            });

            it('Add Incorrect Hide Type', async function () {
                const testPage = new PageClass(basePage);
                const testSection: PageSection = {
                    Key: newUuid(),
                    Columns: [{}],
                    Hide: ['BadType'],
                } as any;
                testPage.addSection(testSection);
                await expect(pagesService.createOrUpdatePage(testPage.page)).to.eventually.be.rejected;
            });

            it('Add Duplicate Block Key to Section', async function () {
                const testPage = new PageClass(basePage);
                const testSection: PageSection = {
                    Key: newUuid(),
                    Columns: [{}, {}],
                    Split: '1/2 1/2',
                };
                testPage.addSection(testSection);
                testPage.addBlockToSection(basePageBlock.Key, testSection.Key, 0);
                testPage.addBlockToSection(basePageBlock.Key, testSection.Key, 1);
                await expect(pagesService.createOrUpdatePage(testPage.page)).to.eventually.be.rejected;
            });
        });

        describe('Load Testing', function () {
            const pagesArray: Array<Page> = [];

            it('Create 1000 pages', async function () {
                console.log(`${new Date().getTime()} - Started Describe: Load Testing`);
                console.log(`${new Date().getTime()} - Started Test: Create 1000 pages`);
                const errorCounter: Array<{ message: string; count: number }> = [];
                const promises: Array<Promise<Page | void>> = [];
                for (let i = 0; i < 1000; i++) {
                    const page: Page = {
                        Name: `${newUuid()} - Pages Load Test`,
                        Blocks: [],
                        Layout: {
                            Sections: [],
                        },
                    };
                    pagesArray[i] = page;
                    promises[i] = pagesService.createOrUpdatePage(page).catch((error) => {
                        addToErrorCounter(errorCounter, (error as Error).message);
                    });
                    generalService.sleep(100);
                }

                const postResults = await Promise.all(promises);

                postResults.map((postResult, index) => {
                    if (postResult && postResult?.Key) {
                        pagesArray[index].Key = postResult.Key;
                    } else {
                        if (pagesArray[index]) {
                            delete pagesArray[index];
                        }
                        postResult
                            ? addToErrorCounter(errorCounter, 'Result of POST returned an undefined page key')
                            : addToErrorCounter(errorCounter, 'Result of POST returned empty');
                    }
                });

                for (const page of pagesArray.filter((x) => x?.Key)) {
                    let actual: void | Page | undefined;
                    try {
                        actual = postResults.filter((x) => x).find((x) => x && x?.Key === page.Key);
                        pagesService.deepCompareObjects(page, actual, expect);
                    } catch (error) {
                        console.log(`Expected: ${JSON.stringify(page)}`);
                        console.log(`Actual: ${JSON.stringify(actual)}`);
                        throw error;
                    }
                }

                expect(
                    errorCounter,
                    errorCounter.map((value) => `message: ${value.message}\ncount: ${value.count}`).join('\n'),
                ).to.be.empty;

                const result = await pagesService.getPages({ page_size: -1 });
                pagesArray.map((page) =>
                    pagesService.deepCompareObjects(
                        page,
                        result.find((x) => x.Key === page.Key),
                        expect,
                    ),
                );
                console.log(`${new Date().getTime()} - Ended Test: Create 1000 pages`);
            });

            it('Delete 1000 pages', async function () {
                console.log(`${new Date().getTime()} - Started Test: Delete 1000 pages`);
                const errorCounter: Array<{ message: string; count: number }> = [];
                const promises = pagesArray.map(async function (page) {
                    if (page) {
                        return pagesService.deletePage(page).catch((error) => {
                            addToErrorCounter(errorCounter, (error as Error).message);
                        });
                    }
                });

                await Promise.all(promises);
                expect(
                    errorCounter,
                    errorCounter.map((value) => `message: ${value.message}\ncount: ${value.count}`).join('\n'),
                ).to.be.empty;

                const resultKeys = (await pagesService.getPages({ page_size: -1 })).map((page) => page.Key);
                const pageKeys = pagesArray
                    .filter((x) => x?.Key)
                    .map((page) => {
                        if (page?.Key) {
                            return page.Key;
                        }
                    });

                expect(
                    resultKeys,
                    `Retrieved page keys: ${resultKeys}\nPage keys that were deleted: ${pageKeys}`,
                ).to.not.have.any.members(pageKeys);
                pagesArray.map((page) => expect(page.Key).to.not.be.oneOf(resultKeys));
                console.log(`${new Date().getTime()} - Ended Test: Delete 1000 pages`);
            });
        });

        describe('Page Tests Suite Cleanup', function () {
            it('Delete created page', async function () {
                console.log(`${new Date().getTime()} - Started Describe: Page Tests Suite Cleanup`);
                console.log(`${new Date().getTime()} - Started test: Delete created page`);
                await pagesService.deletePage(basePage);
                const result = await pagesService.getPages({ where: `Key='${basePage.Key}'`, include_deleted: true });
                expect(result[0]?.Hidden).is.equal(true);
                console.log(`${new Date().getTime()} - Ended test: Delete created page`);
            });

            it('Cleanup of all automation pages', async function () {
                console.log(`${new Date().getTime()} - Started: Cleanup of all automation pages`);
                const errorCounter: Array<{ message: string; count: number }> = [];
                const pagesFromApi = await pagesService.getPages({ page_size: -1 });
                for (const page of pagesFromApi) {
                    if (page?.Name) {
                        if (page.Name.includes('Test') || page.Name.includes('PagesApiTest')) {
                            await pagesService
                                .deletePage(page)
                                .catch((error) => addToErrorCounter(errorCounter, (error as Error).message));
                        }
                    }
                }
                expect(
                    errorCounter,
                    errorCounter.map((value) => `message: ${value.message}\ncount: ${value.count}`).join('\n'),
                ).to.be.empty;

                const resultNames = (await pagesService.getPages({ page_size: -1 })).map((page) => page?.Name);
                expect(resultNames).to.not.include('Test').and.to.not.include('PagesApiTest');
                console.log(`${new Date().getTime()} - Ended: Cleanup of all automation pages`);
            });
        });

        function addToErrorCounter(errorCounter: Array<{ message: string; count: number }>, errorMessage: string) {
            const index = errorCounter.findIndex((x) => x.message === errorMessage);
            index > -1 ? errorCounter[index].count++ : errorCounter.push({ message: errorMessage, count: 1 });
        }
    });
}
