import { Browser } from '../../utilities/browser';
import { it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { PagesService } from '../../../services/pages/pages.service';
import { PageClass } from '../../../models/pages/page.class';
import { v4 as newUuid } from 'uuid';
import { PageSectionClass } from '../../../models/pages/page-section.class';
import { Page, PageBlock } from '@pepperi-addons/papi-sdk';
import { PagesList } from '../../pom/addons/PageBuilder/PagesList';
import { StaticTester } from '../../pom/addons/Blocks/PageTester/StaticTester.block';
import { PageEditor } from '../../pom/addons/PageBuilder/PageEditor';
import addContext from 'mochawesome/addContext';
import { PageTestRequirements } from './page_builder.test';
import { TestConfiguration } from '../../../models/pages/parameter-config.class';

chai.use(promised);

export function BasicBlockTests(pagesService: PagesService, pagesReq: PageTestRequirements) {
    let browser: Browser;
    let pagesList: PagesList;

    const basicPage: PageClass = new PageClass();
    basicPage.Key = newUuid();
    basicPage.Name = `Basic Block Tests - ${basicPage.Key}`;

    let pageEditor: PageEditor;
    let staticTester: StaticTester;

    before(async function () {
        await apiCreateBasicPage();

        browser = pagesReq.browser;
        pagesList = pagesReq.pagesList;

        try {
            if (basicPage?.Name) {
                await browser.refresh();
                pageEditor = await pagesList.searchAndEditPage(basicPage.Name);
            } else {
                throw new Error(`Page does not have a name. Page Key: ${basicPage.Key}`);
            }
            await pageEditor.enterPreviewMode();
            staticTester = new StaticTester(basicPage.Blocks[0].Configuration.Data.BlockId, browser);
        } catch (error) {
            const beforeError = await browser.saveScreenshots();
            addContext(this, {
                title: `Image Before`,
                value: 'data:image/png;base64,' + beforeError,
            });
            throw error;
        }
    });

    after(async function () {
        await pageEditor.enterEditMode();
        await pageEditor.goBack();
        pagesList = new PagesList(browser);

        const result = await pagesService.deletePage(basicPage);
        expect(result?.Hidden).is.equal(true);
    });

    afterEach(async function () {
        await pageEditor.collectEndTestData(this);
    });

    it('Check Static Tester block loaded', async function () {
        await staticTester.clickBlockLoadBtn();
        expect(await staticTester.getTestText()).equals('TEST PASSED');
    });

    it('Check API call from block', async function () {
        await staticTester.clickApiCallBtn();
        const apiResult = await pagesService.getPages();

        let testText: string | null = await staticTester.getTestText();
        let textPollCount = 0;
        const maxCount = 30;
        while (testText == 'TEST PASSED' || !testText) {
            if (textPollCount >= maxCount) {
                throw new Error('Timed out while polling test text');
            }
            await browser.sleepTimeout(2500);
            testText = await staticTester.getTestText();
            textPollCount++;
        }
        expect(testText).equals(JSON.stringify(apiResult));
    });

    async function apiCreateBasicPage() {
        const staticBlockRelation = await pagesService.getBlockRelation('Static Tester');
        const staticTesterBlock: PageBlock = basicPage.Blocks.createAndAdd(staticBlockRelation);
        const section = new PageSectionClass(newUuid());

        const testConfig: TestConfiguration = {
            Parameters: [],
            BlockId: 'basicStaticBlock',
        };
        // config.push(stringParam, filterParam);
        staticTesterBlock.Configuration.Data = testConfig;

        section.addBlock(staticTesterBlock.Key);

        basicPage.Layout.Sections.add(section);

        const pageResult: Page = await pagesService.createOrUpdatePage(basicPage).catch((error) => {
            console.log((error as Error).message);
            throw error;
        });
        pagesService.deepCompareObjects(basicPage, pageResult, expect);
    }
}
