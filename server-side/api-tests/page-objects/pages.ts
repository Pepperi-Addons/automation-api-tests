import { NgComponentRelation, Page, PageBlock, PageSection } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../../services/general.service';
import { PagesService } from '../../services/pages/pages.service';
import { v4 as newUuid } from 'uuid';
import { PageApiClass } from '../../models/page-api.class';
import { PageFactory } from '../../models/page.factory';

export async function PagesTestSuite(generalService: GeneralService, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade Addon requirements
    const testData = {
        // 'Services Framework': ['00000000-0000-0000-0000-000000000a91', ''],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        // 'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''],
        // 'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''], //16.65.12
        Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''], //Page Builder Addon 0.0.81
        // PageBuilderTester: ['5046a9e4-ffa4-41bc-8b62-db1c2cf3e455', ''],
        'Page Tester': ['3da3c1d7-6aa9-4938-bcdb-b8b4acbf8535', ''],

        Slideshow: ['f93658be-17b6-4c92-9df3-4e6c7151e038', '0.0.52'], //Slideshow Addon 0.0.36
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
            isInstalledArr.forEach((isInstalled, index) => {
                it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
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
                const testPage = new PageApiClass(basePage);
                testPage.addNewBlock(basePageBlock);
                const resultPage = await pagesService.createOrUpdatePage(testPage.page);
                pagesService.deepCompareObjects(testPage.page, resultPage, expect);
                basePage = testPage.page;
            });

            // it('Add Page Block with Incorrect Relation', async function () {
            //     const testPage = new PageClass(basePage);
            //     let tempRel = basePageBlock;
            //     tempRel.Relation.
            //     testPage.addNewBlock(basePageBlock);
            //     const resultPage = await pagesService.createOrUpdatePage(testPage.page);
            //     pagesService.deepCompareObjects(testPage.page, resultPage, expect);
            //     basePage = testPage.page;
            // });

            it("Add PageBlock without mandatory 'Relation' fields", async function () {
                const properties = Object.getOwnPropertyNames(pageBlockRelation).filter((prop) => prop !== 'length');
                const pageClass = new PageApiClass(basePage);

                for (const prop of properties) {
                    const pageRelation = pagesService.objectWithoutTargetProp(pageBlockRelation, properties, prop);
                    const pageBlock: PageBlock = {
                        Key: basePageBlock.Key,
                        Relation: pageRelation,
                        Configuration: basePageBlock.Configuration,
                    };
                    pageClass.overwriteBlockByKey(pageBlock.Key, pageBlock);

                    if (prop == 'Name' || prop == 'AddonUUID') {
                        const expectedError =
                            prop == 'AddonUUID'
                                ? `${prop} is missing`
                                : `Resource should be the same as Block -> Relation -> ${prop}`;

                        await expect(pagesService.createOrUpdatePage(pageClass.page)).to.eventually.be.rejectedWith(
                            expectedError,
                        );
                    } else {
                        const postResult = await pagesService.createOrUpdatePage(pageClass.page);
                        pagesService.deepCompareObjects(basePage, postResult, expect);
                    }
                }
            });

            it('Add PageBlock with Incorrect Relation Fields', async function () {
                const properties = Object.getOwnPropertyNames(pageBlockRelation).filter((prop) => prop !== 'length');
                const pageClass = new PageApiClass(basePage);

                for (const prop of properties) {
                    const pageRelation = pagesService.objectWithoutTargetProp(pageBlockRelation, properties, prop);
                    pageRelation[prop] = 'FillterProp';
                    const pageBlock: PageBlock = {
                        Key: basePageBlock.Key,
                        Configuration: basePageBlock.Configuration,
                        Relation: pageRelation,
                    };
                    pageClass.overwriteBlockByKey(pageBlock.Key, pageBlock);

                    if (prop == 'Name' || prop == 'AddonUUID') {
                        const expectedError =
                            prop == 'AddonUUID'
                                ? `Block with ${prop} ${pageRelation[prop]} doesn\'t exist as available page block`
                                : `Resource should be the same as Block -> Relation -> ${prop}`;
                        await expect(
                            pagesService.createOrUpdatePage(pageClass.page).then((page) => JSON.stringify(page)),
                            `Relation field '${prop}'`,
                        ).to.eventually.be.rejectedWith(expectedError);
                    } else {
                        const postResult = await pagesService.createOrUpdatePage(pageClass.page);
                        pagesService.deepCompareObjects(basePage, postResult, expect);
                    }
                }
            });
            it('Add PageBlock without mandatory field', async function () {
                const blockProps = Object.getOwnPropertyNames(basePageBlock).filter((prop) => prop !== 'length');
                for (const prop of blockProps) {
                    const pageClass = new PageApiClass(basePage);
                    const pageBlock: PageBlock = pagesService.objectWithoutTargetProp(basePageBlock, blockProps, prop);
                    // pageBlock = pagesService.objectWithoutTargetProp(basePageBlock, blockProps, prop);

                    pageClass.addNewBlock(pageBlock);
                    await expect(
                        pagesService.createOrUpdatePage(pageClass.page).then((page) => JSON.stringify(page)),
                    ).to.eventually.be.rejectedWith(`${prop} is missing`);
                }
            });

            it('Add duplicate Page Block key', async function () {
                const pageClass = new PageApiClass(basePage);
                pageClass.addNewBlock(basePageBlock);
                await expect(pagesService.createOrUpdatePage(pageClass.page)).to.eventually.be.rejectedWith(
                    'already exists',
                );
            });
            describe('Page Paramters Tests Suite', function () {
                it("Add duplicate filter key for two 'parameter' types", async function () {
                    const pageClass = new PageApiClass(basePage);
                    const paramKey = 'MyKey';
                    const testBlock = PageFactory.defaultPageBlock(pageBlockRelation);
                    testBlock.PageConfiguration = {
                        Parameters: [
                            {
                                Key: paramKey,
                                Type: 'String',
                                Consume: true,
                                Produce: true,
                            },
                            {
                                Key: paramKey,
                                Type: 'Filter',
                                Consume: true,
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
                    const pageClass = new PageApiClass(basePage);
                    const testBlock = PageFactory.defaultPageBlock(pageBlockRelation);
                    const paramKey = 'ParamKey';
                    testBlock.PageConfiguration = {
                        Parameters: [
                            {
                                Key: paramKey,
                                Type: 'String',
                                Consume: false,
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
                const testPage = new PageApiClass(basePage);
                testPage.addSection(baseSection);
                const result = await pagesService.createOrUpdatePage(testPage.page);
                pagesService.deepCompareObjects(testPage.page, result, expect);
                basePage = testPage.page;
            });

            it('Add Page Layout with Incorrect PageSizeType', async function () {
                const testPage = new PageApiClass(basePage);

                const tempPage = testPage.page;
                tempPage.Layout.ColumnsGap = 'BadType' as any;
                await expect(pagesService.createOrUpdatePage(tempPage)).to.eventually.be.rejectedWith(
                    `Page -> Layout -> ColumnsGap should be value from`,
                );
            });

            it('Add Block to Section', async function () {
                const testPage = new PageApiClass(basePage);
                testPage.addBlockToSection(basePageBlock.Key, baseSection.Key, 0);
                const result = await pagesService.createOrUpdatePage(testPage.page);
                pagesService.deepCompareObjects(testPage.page, result, expect);
                basePage = testPage.page;
            });

            it('Add Page Section without mandatory field', async function () {
                const sectionProps = Object.getOwnPropertyNames(baseSection).filter((prop) => prop !== 'length');
                for (const prop of sectionProps) {
                    const pageClass = new PageApiClass(basePage);
                    let pageSection: PageSection = {} as any;
                    pageSection = pagesService.objectWithoutTargetProp(baseSection, sectionProps, prop);
                    pageClass.addSection(pageSection);
                    await expect(pagesService.createOrUpdatePage(pageClass.page)).to.eventually.be.rejectedWith(
                        `${prop} is missing`,
                    );
                }
            });
            it('Add Incorrect Block Key to Section', async function () {
                const testPage = new PageApiClass(basePage);
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
                const testPage = new PageApiClass(basePage);
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
                const testPage = new PageApiClass(basePage);
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
                const testPage = new PageApiClass(basePage);
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
                const testPage = new PageApiClass(page);

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

        describe('Page Creation Limit Test', function () {
            const pagesArray: Array<Page> = [];
            const pagesLimit = 100;

            it(`Exceed create limit of ${pagesLimit} pages`, async function () {
                const currentPages = (await pagesService.getPages({ page_size: -1 })).length;
                const errorCounter: Array<{ message: string; count: number }> = [];
                // const promises: Array<Promise<Page | void>> = [];
                const postResults: Array<Page | void> = [];
                let time = new Date();
                const pagesToCreate = pagesLimit - currentPages;
                console.log(`Page creation start: ${generalService.getTime()};${time.getMilliseconds()}`);
                for (let i = 0; i < pagesToCreate; i++) {
                    const page: Page = PageFactory.defaultPage();
                    pagesArray[i] = page;
                    postResults[i] = await pagesService.createOrUpdatePage(page).catch((error) => {
                        addToErrorCounter(errorCounter, (error as Error).message);
                    });
                    // await generalService.sleepAsync(200);
                }

                time = new Date();
                console.log(`Page creation end: ${generalService.getTime()};${time.getMilliseconds()}`);

                // const postResults = await Promise.all(promises);
                // time = new Date();
                // console.log(`After all calls were returned: ${generalService.getTime()};${time.getMilliseconds()}`);
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
                await expect(
                    pagesService
                        .createOrUpdatePage(PageFactory.defaultPage())
                        .then((pageResult: void | Page) => (postResults[pagesToCreate] = pageResult)),
                ).to.eventually.be.rejectedWith(
                    `You exceeded your pages number limit (${pagesLimit}) - please contact your administrator`,
                );
                for (const page of pagesArray.filter((x) => x?.Key)) {
                    const actual = postResults.filter((_page) => _page && _page.Key === page.Key);

                    try {
                        expect(
                            actual,
                            `${actual.length} pages found with the assigned key: '${
                                page.Key
                            }'\nPOST index: ${pagesArray.findIndex((_page) => _page === page)}\nFound pages: ${actual
                                .map((_page) => JSON.stringify(_page))
                                .join('\n')}`,
                        ).to.be.of.length(1);
                        pagesService.deepCompareObjects(page, actual[0], expect);
                    } catch (error) {
                        addToErrorCounter(errorCounter, (error as Error).message);
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
            });

            // it(`Delete ${pagesLimit} pages`, async function () {
            //     const errorCounter: Array<{ message: string; count: number }> = [];

            //     let time = new Date();
            //     console.log(`Before all calls: ${generalService.getTime()};${time.getMilliseconds()}`);
            //     const promises: Array<Promise<Page | void>> = [];
            //     for (const [index, page] of pagesArray.entries()) {
            //         if (page) {
            //             await generalService.sleepAsync(100);
            //             promises[index] = pagesService.deletePage(page).catch((error) => {
            //                 addToErrorCounter(errorCounter, (error as Error).message);
            //             });
            //         }
            //     }

            //     time = new Date();
            //     console.log(`After all calls: ${generalService.getTime()};${time.getMilliseconds()}`);

            //     await Promise.all(promises);

            //     time = new Date();
            //     console.log(`After all calls were returned: ${generalService.getTime()};${time.getMilliseconds()}`);

            //     expect(
            //         errorCounter,
            //         errorCounter.map((value) => `message: ${value.message}\ncount: ${value.count}`).join('\n'),
            //     ).to.be.empty;

            //     const resultKeys = (await pagesService.getPages({ page_size: -1 }))
            //         .map((page) => page.Key)
            //         .filter((key): key is string => !!key);
            //     const pageKeys = pagesArray.map((page) => page.Key).filter((key): key is string => !!key);

            //     expect(
            //         resultKeys,
            //         `Retrieved page keys: ${resultKeys}\nPage keys that were deleted: ${pageKeys}`,
            //     ).to.not.include.members(pageKeys);

            //     pagesArray.map(function (page) {
            //         if (page?.Key) {
            //             return expect(
            //                 page.Key,
            //                 `Expected ${page.Key} to not be one of: ${resultKeys.join(', ')}`,
            //             ).to.not.be.oneOf(resultKeys);
            //         }
            //     });

            // });
        });

        describe('Page Tests Suite Cleanup', function () {
            it('Delete created page', async function () {
                const deleteResult = await pagesService.deletePage(basePage);
                pagesService.deepCompareObjects(basePage, deleteResult, expect);
                // const result = await pagesService.getPages({ where: `Key='${basePage.Key}'`, include_deleted: true });
                const result = await pagesService.getPage(basePage.Key as string);

                // console.log(`%cBug in Pages API FindOptions - DI-19747`, ConsoleColors.BugSkipped);
                expect(result?.Hidden).is.equal(true);
            });

            it('Cleanup of all PagesApiTest pages', async function () {
                const errorCounter: Array<{ message: string; count: number }> = [];
                const pagesFromApi = await pagesService.getPages({ page_size: -1 });
                const pageNamesToDelete = [
                    'PagesApiTest',
                    'Remove Slideshow Test',
                    'SamplePage',
                    'Produce Consume Tests',
                    'Advanced SetParams Tests',
                    'Load Order Tests',
                ];

                for (const page of pagesFromApi) {
                    await deletePageIncluding(page, pagesService, pageNamesToDelete).catch((error) => {
                        addToErrorCounter(errorCounter, `Page ${page.Key} - ${(error as Error).message}`);
                    });
                }
                expect(
                    errorCounter,
                    errorCounter.map((value) => `message: ${value.message}\ncount: ${value.count}`).join('\n'),
                ).to.be.empty;

                const resultNames = (await pagesService.getPages({ page_size: -1 })).map((page) => page?.Name);
                expect(resultNames).to.not.include.members(pageNamesToDelete);
            });
        });

        function addToErrorCounter(errorCounter: Array<{ message: string; count: number }>, errorMessage: string) {
            const index = errorCounter.findIndex((x) => x.message === errorMessage);
            index > -1 ? errorCounter[index].count++ : errorCounter.push({ message: errorMessage, count: 1 });
        }
    });
}
async function deletePageIncluding(page: Page, pagesService: PagesService, pageNamesToDelete: string[] = []) {
    if (page?.Name) {
        if (pageNamesToDelete.length == 0 || pageNamesToDelete.find((name) => page.Name?.includes(name))) {
            page.Blocks.forEach((block) => {
                if (!block.Configuration?.Data) {
                    block.Configuration.Data = {};
                }
                if (block.Configuration?.Resource != block.Relation.Name) {
                    block.Configuration.Resource = block.Relation.Name;
                }
                if (block.Configuration?.AddonUUID != block.Relation.AddonUUID) {
                    block.Configuration.AddonUUID = block.Relation.AddonUUID;
                }
            });

            await pagesService.deletePage(page);
            // .catch((error) => addToErrorCounter(errorCounter, (error as Error).message));
        }
    }
}
