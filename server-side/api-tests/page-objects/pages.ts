import { NgComponentRelation, Page, PageBlock, PageSection } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../../services/general.service';
import { PagesService } from '../../services/pages/pages.service';
import { v4 as newUuid } from 'uuid';
import { PageClass } from '../../models/page.class';
import { PageFactory } from '../../models/page.factory';

export async function PagesTestSuite(generalService: GeneralService, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade Addon requirements
    const testData = {
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', ''],
        // ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        // 'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''],
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''], //16.65.12
        Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''], //Page Builder Addon 0.0.68
        PageBuilderTester: ['5046a9e4-ffa4-41bc-8b62-db1c2cf3e455', ''],
        Slideshow: ['f93658be-17b6-4c92-9df3-4e6c7151e038', '0.0.38'], //Slideshow Addon 0.0.36
    };

    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    const chnageVersionResponseArr = await generalService.changeToAnyAvailableVersion(testData);
    //#endregion Upgrade Addon requirements

    const pagesService = new PagesService(generalService);
    let basePage: Page = PageFactory.defaultPage();
    const pageBlockRelation: NgComponentRelation = await pagesService.getBlockRelation('Static Tester');
    const basePageBlock: PageBlock = PageFactory.defaultPageBlock(pageBlockRelation);

    describe('Pages API Tests Suite', function () {
        describe('Prerequisites Addon for Pages API Tests', () => {
            //Test Data
            it('Validate That All The Needed Addons Installed', async () => {
                isInstalledArr.forEach((isInstalled) => {
                    expect(isInstalled).to.be.true;
                });
            });

            for (const addonName in testData) {
                const addonUUID = testData[addonName][0];
                const version = testData[addonName][1];
                const varLatestVersion = chnageVersionResponseArr[addonName][2];
                const changeType = chnageVersionResponseArr[addonName][3];
                describe(`Test Data: ${addonName}`, () => {
                    it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                        if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                            expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                        } else {
                            expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                        }
                    });

                    it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(varLatestVersion);
                    });
                });
            }
        });

        describe('Base Page Tests Suite', function () {
            it('Create new page', async function () {
                const resultPage = await pagesService.createOrUpdatePage(basePage);
                basePage.Key = resultPage.Key;
                pagesService.deepCompareObjects(basePage, resultPage, expect);
            });

            it('Modify page name', async function () {
                basePage.Name = `${new Date().toLocaleDateString()} - PagesApiTest`;
                const resultPage = await pagesService.createOrUpdatePage(basePage);
                pagesService.deepCompareObjects(basePage, resultPage, expect);
            });

            it('Add Page with Unknown Property', async function () {
                const testPage: Page = PageFactory.defaultPage();
                testPage.BadProperty = true;

                const result = await pagesService.createOrUpdatePage(testPage);
                expect(result).to.not.have.property('BadProperty');
                await pagesService.deletePage(testPage);
            });

            it("Add Page without 'Blocks' field", async function () {
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

            it("Add Page without 'Layout' field", async function () {
                const testPage: Page = {
                    Name: `${generalService.getDate()} - ${generalService.getTime()} - PagesApiTest`,
                    Blocks: [],
                } as any;
                await expect(pagesService.createOrUpdatePage(testPage)).to.eventually.be.rejectedWith(
                    `Layout is missing`,
                );
            });

            it("Add Layout without 'Sections' field", async function () {
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
                const testPage = new PageClass(basePage);
                testPage.addNewBlock(basePageBlock);
                const resultPage = await pagesService.createOrUpdatePage(testPage.page);
                pagesService.deepCompareObjects(testPage.page, resultPage, expect);
                basePage = testPage.page;
            });

            it('Add PageBlock without mandatory field', async function () {
                const blockProps = Object.getOwnPropertyNames(basePageBlock).filter((prop) => prop !== 'length');
                for (const prop of blockProps) {
                    const pageClass = new PageClass(basePage);
                    let pageBlock: PageBlock = {} as any;
                    pageBlock = pagesService.objectWithoutTargetProp(basePageBlock, blockProps, prop);

                    pageClass.addNewBlock(pageBlock);
                    await expect(pagesService.createOrUpdatePage(pageClass.page)).to.eventually.be.rejectedWith(
                        `${prop} is missing`,
                    );
                }
            });

            it("Add PageBlock without mandatory 'Relation' fields", async function () {
                const properties = Object.getOwnPropertyNames(pageBlockRelation).filter((prop) => prop !== 'length');
                const pageClass = new PageClass(basePage);
                const pageBlock: PageBlock = { Key: basePageBlock.Key } as any;
                for (const prop of properties) {
                    pageBlock.Relation = pagesService.objectWithoutTargetProp(pageBlockRelation, properties, prop);

                    pageClass.overwriteBlockByKey(pageBlock.Key, pageBlock);

                    await expect(pagesService.createOrUpdatePage(pageClass.page)).to.eventually.be.rejectedWith(
                        `${prop} is missing`,
                    );
                }
            });

            it('Add duplicate Page Block key', async function () {
                const pageClass = new PageClass(basePage);
                pageClass.addNewBlock(basePageBlock);
                await expect(pagesService.createOrUpdatePage(pageClass.page)).to.eventually.be.rejectedWith(
                    'already exists',
                );
            });
            describe('Page Paramters Tests Suite', function () {
                it("Add duplicate filter key for two 'parameter' types", async function () {
                    const pageClass = new PageClass(basePage);
                    const paramKey = 'MyKey';
                    const testBlock = PageFactory.defaultPageBlock(pageBlockRelation);
                    testBlock.PageConfiguration = {
                        Parameters: [
                            {
                                Key: paramKey,
                                Type: 'String',
                                Consume: true,
                                Mandatory: false,
                                Produce: true,
                            },
                            {
                                Key: paramKey,
                                Type: 'Filter',
                                Consume: true,
                                Mandatory: false,
                                Produce: true,
                                Resource: 'accounts',
                                Fields: ['test'],
                            },
                        ],
                    };
                    pageClass.addNewBlock(testBlock);
                    await expect(pagesService.createOrUpdatePage(pageClass.page)).to.eventually.be.rejectedWith(
                        ` Parameters with key ${paramKey} should be with the same Type.`,
                    );
                });
                it('Add Parameter with Produce and Consume as false', async function () {
                    const pageClass = new PageClass(basePage);
                    const testBlock = PageFactory.defaultPageBlock(pageBlockRelation);
                    const paramKey = 'ParamKey';
                    testBlock.PageConfiguration = {
                        Parameters: [
                            {
                                Key: paramKey,
                                Type: 'String',
                                Consume: false,
                                Mandatory: false,
                                Produce: false,
                            },
                        ],
                    };
                    pageClass.addNewBlock(testBlock);
                    await expect(pagesService.createOrUpdatePage(pageClass.page)).to.eventually.be.rejectedWith(
                        `The parameter (with key ${paramKey}) is not allowed, at least on of the properties Produce or Consume should be true`,
                    );
                });
            });
        });

        const baseSection: PageSection = {
            Key: newUuid(),
            Columns: [{}],
        };
        describe('Page Layout Tests Suite', function () {
            it('Add Page Section', async function () {
                const testPage = new PageClass(basePage);
                testPage.addSection(baseSection);
                const result = await pagesService.createOrUpdatePage(testPage.page);
                pagesService.deepCompareObjects(testPage.page, result, expect);
                basePage = testPage.page;
            });

            it('Add Page Layout with Incorrect PageSizeType', async function () {
                const testPage = new PageClass(basePage);

                const tempPage = testPage.page;
                tempPage.Layout.ColumnsGap = 'BadType' as any;
                await expect(pagesService.createOrUpdatePage(tempPage)).to.eventually.be.rejectedWith(
                    `Page -> Layout -> ColumnsGap should be value from`,
                );
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
                await expect(pagesService.createOrUpdatePage(testPage.page)).to.eventually.be.rejectedWith(
                    'exist in Page.Blocks',
                );
            });
            it('Add Incorrect Section Split values', async function () {
                const testPage = new PageClass(basePage);
                const testSection: PageSection = {
                    Key: newUuid(),
                    Columns: [{}, {}, {}],
                    Split: '1/2 1/2 1/2',
                } as any;
                testPage.addSection(testSection);
                await expect(pagesService.createOrUpdatePage(testPage.page)).to.eventually.be.rejectedWith(
                    'Split should be empty or value from',
                );
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
                await expect(pagesService.createOrUpdatePage(testPage.page)).to.eventually.be.rejectedWith(
                    'already exists in another section column',
                );
            });

            it('Add Incorrect Hide Type', async function () {
                const testPage = new PageClass(basePage);
                const testSection: PageSection = {
                    Key: newUuid(),
                    Columns: [{}],
                    Hide: ['BadType'],
                } as any;
                testPage.addSection(testSection);
                await expect(pagesService.createOrUpdatePage(testPage.page)).to.eventually.be.rejectedWith(
                    'Hide should be value from',
                );
            });

            it('Block Removal On Uninstall Addon', async function () {
                const page = PageFactory.defaultPage();
                page.Name = 'PagesApiTest - Remove Slideshow Test';
                const testPage = new PageClass(page);

                const testSection: PageSection = PageFactory.defaultSection();
                testPage.addSection(testSection);

                const slideBlockRelation: NgComponentRelation = await pagesService.getBlockRelation('Slideshow');
                const slideShowBlock: PageBlock = PageFactory.defaultPageBlock(slideBlockRelation);

                testPage.addNewBlockToSection(slideShowBlock, testSection.Key, 0);
                const postPageResult = await pagesService.createOrUpdatePage(testPage.page);
                pagesService.deepCompareObjects(testPage.page, postPageResult, expect);
                console.log(`Page Key: ${postPageResult.Key}`);
                // testPage.editPageKey(postPageResult.Key);
                const uninstallResult = await generalService.uninstallAddon(testData.Slideshow[0]).catch((error) => {
                    throw error;
                });
                expect(uninstallResult.URI).to.not.be.undefined;
                const auditResult = await generalService.getAuditLogResultObjectIfValid(<string>uninstallResult.URI);
                expect(auditResult).to.have.deep.include({ Status: { ID: 1, Name: 'Success' } });
                //To wait for PNS to be received by Page Builder to trigger blocks removal
                let resultPages: Page[];
                const startTime = new Date().getTime();
                const timeOutinMs = 300000;
                do {
                    resultPages = await pagesService.getPages({ page_size: -1 });
                    await generalService.sleepAsync(5000);
                } while (
                    JSON.stringify(resultPages).includes(testData.Slideshow[0]) &&
                    new Date().getTime() < startTime + timeOutinMs
                );

                resultPages.map(function (page) {
                    expect(JSON.stringify(page))
                        .to.not.include(
                            testData.Slideshow[0],
                            "Slideshow's addon blocks still exists in page's Blocks array after uninstalling",
                        )
                        .and.to.not.include(
                            slideShowBlock.Key,
                            "Slideshow's addon block key references were not removed from page section's 'Columns' array after uninstalling",
                        );
                });
            });
        });

        // describe('Load Testing', function () {
        //     const pagesArray: Array<Page> = [];
        //     const objectsToCreate = 1000;

        //     it(`Create ${objectsToCreate} pages`, async function () {
        //         const errorCounter: Array<{ message: string; count: number }> = [];
        //         const promises: Array<Promise<Page | void>> = [];
        //         let time = new Date();
        //         console.log(`Before all calls: ${generalService.getTime()};${time.getMilliseconds()}`);
        //         for (let i = 0; i < objectsToCreate; i++) {
        //             const page: Page = PageFactory.defaultPage();
        //             pagesArray[i] = page;
        //             promises[i] = pagesService.createOrUpdatePage(page).catch((error) => {
        //                 addToErrorCounter(errorCounter, (error as Error).message);
        //             });
        //             await generalService.sleepAsync(25);
        //         }

        //         time = new Date();
        //         console.log(`After all calls: ${generalService.getTime()};${time.getMilliseconds()}`);

        //         const postResults = await Promise.all(promises);

        //         time = new Date();
        //         console.log(`After all calls were returned: ${generalService.getTime()};${time.getMilliseconds()}`);
        //         postResults.map((postResult, index) => {
        //             if (postResult && postResult?.Key) {
        //                 pagesArray[index].Key = postResult.Key;
        //             } else {
        //                 if (pagesArray[index]) {
        //                     delete pagesArray[index];
        //                 }
        //                 postResult
        //                     ? addToErrorCounter(errorCounter, 'Result of POST returned an undefined page key')
        //                     : addToErrorCounter(errorCounter, 'Result of POST returned empty');
        //             }
        //         });

        //         for (const page of pagesArray.filter((x) => x?.Key)) {
        //             // let actual: void | Page | undefined;
        //             const actual = postResults.filter((_page) => _page && _page.Key === page.Key);

        //             try {
        //                 expect(
        //                     actual,
        //                     `${actual.length} pages found with the assigned key: '${
        //                         page.Key
        //                     }'\nPOST index: ${pagesArray.findIndex((_page) => _page === page)}\nFound pages: ${actual
        //                         .map((_page) => JSON.stringify(_page))
        //                         .join('\n')}`,
        //                 ).to.be.of.length(1);
        //                 pagesService.deepCompareObjects(page, actual[0], expect);
        //             } catch (error) {
        //                 addToErrorCounter(errorCounter, (error as Error).message);
        //                 console.log(`Expected: ${JSON.stringify(page)}`);
        //                 console.log(`Actual: ${JSON.stringify(actual)}`);
        //                 throw error;
        //             }
        //         }

        //         expect(
        //             errorCounter,
        //             errorCounter.map((value) => `message: ${value.message}\ncount: ${value.count}`).join('\n'),
        //         ).to.be.empty;

        //         const result = await pagesService.getPages({ page_size: -1 });
        //         pagesArray.map((page) =>
        //             pagesService.deepCompareObjects(
        //                 page,
        //                 result.find((x) => x.Key === page.Key),
        //                 expect,
        //             ),
        //         );
        //     });

        //     it(`Delete ${objectsToCreate} pages`, async function () {
        //         const errorCounter: Array<{ message: string; count: number }> = [];

        //         let time = new Date();
        //         console.log(`Before all calls: ${generalService.getTime()};${time.getMilliseconds()}`);
        //         const promises: Array<Promise<Page | void>> = [];
        //         for (const [index, page] of pagesArray.entries()) {
        //             if (page) {
        //                 await generalService.sleepAsync(25);
        //                 promises[index] = pagesService.deletePage(page).catch((error) => {
        //                     addToErrorCounter(errorCounter, (error as Error).message);
        //                 });
        //             }
        //         }

        //         time = new Date();
        //         console.log(`After all calls: ${generalService.getTime()};${time.getMilliseconds()}`);

        //         await Promise.all(promises);

        //         time = new Date();
        //         console.log(`After all calls were returned: ${generalService.getTime()};${time.getMilliseconds()}`);

        //         expect(
        //             errorCounter,
        //             errorCounter.map((value) => `message: ${value.message}\ncount: ${value.count}`).join('\n'),
        //         ).to.be.empty;

        //         const resultKeys = (await pagesService.getPages({ page_size: -1 }))
        //             .map((page) => page.Key)
        //             .filter((key): key is string => !!key);
        //         const pageKeys = pagesArray.map((page) => page.Key).filter((key): key is string => !!key);

        //         expect(
        //             resultKeys,
        //             `Retrieved page keys: ${resultKeys}\nPage keys that were deleted: ${pageKeys}`,
        //         ).to.not.include.members(pageKeys);

        //         pagesArray.map(function (page) {
        //             if (page?.Key) {
        //                 return expect(
        //                     page.Key,
        //                     `Expected ${page.Key} to not be one of: ${resultKeys.join(', ')}`,
        //                 ).to.not.be.oneOf(resultKeys);
        //             }
        //         });

        //     });
        // });

        describe('Page Tests Suite Cleanup', function () {
            it('Delete created page', async function () {
                await pagesService.deletePage(basePage);
                const result = await pagesService.getPages({ where: `Key='${basePage.Key}'`, include_deleted: true });
                expect(result[0]?.Hidden).is.equal(true);
            });

            it('Cleanup of all PagesApiTest pages', async function () {
                const errorCounter: Array<{ message: string; count: number }> = [];
                const pagesFromApi = await pagesService.getPages({ page_size: -1 });
                for (const page of pagesFromApi) {
                    if (page?.Name) {
                        if (page.Name.includes('PagesApiTest') || page.Name.includes('Remove Slideshow Test')) {
                            page.Blocks.filter((block) => !block.Configuration?.Data).forEach(
                                (block) => (block.Configuration.Data = {}),
                            );

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
                expect(resultNames).to.not.include.members(['PagesApiTest', 'Remove Slideshow Test']);
            });
        });

        function addToErrorCounter(errorCounter: Array<{ message: string; count: number }>, errorMessage: string) {
            const index = errorCounter.findIndex((x) => x.message === errorMessage);
            index > -1 ? errorCounter[index].count++ : errorCounter.push({ message: errorMessage, count: 1 });
        }
    });
}
