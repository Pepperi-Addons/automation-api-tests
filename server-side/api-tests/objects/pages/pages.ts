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

        it('Modify page name', async function () {
            console.log(`${new Date().getTime()} - Started test: Modify page name`);
            basePage.Name = `${new Date().toLocaleDateString()} - PagesApiTest`;
            const resultPage = await pagesService.createOrUpdatePage(basePage);
            console.log(`${new Date().getTime()} - Ended test: Modify page name`);
            pagesService.deepCompareObjects(basePage, resultPage, expect);
        });

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

        const baseSection: PageSection = {
            Key: newUuid(),
            Columns: [{}],
        };

        it('Add Page Section', async function () {
            const testPage = new PageClass(basePage);
            testPage.addSection(baseSection);
            const result = await pagesService.createOrUpdatePage(testPage.page);
            pagesService.deepCompareObjects(testPage.page, result, expect);
            basePage = testPage.page;
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

        it('Delete created page', async function () {
            console.log(`${new Date().getTime()} - Started test: Delete created page`);
            await pagesService.deletePage(basePage);
            const result = await pagesService.getPages({ where: `Key='${basePage.Key}'`, include_deleted: true });
            expect(result[0]?.Hidden).is.equal(true);
            // expect().fulfilled.and.eventually.include({Hidden: true});
            console.log(`${new Date().getTime()} - Ended test: Delete created page`);
        });

        //
    });
}
