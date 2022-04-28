import { Browser } from '../../utilities/browser';
import { it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { PagesService } from '../../../services/pages/pages.service';
import { PageClass } from '../../../models/pages/page.class';
import { v4 as newUuid } from 'uuid';
import { PageSectionClass } from '../../../models/pages/page-section.class';
import { NgComponentRelation, Page, PageBlock } from '@pepperi-addons/papi-sdk';
import { PagesList } from '../../pom/addons/PageBuilder/PagesList';
import { PageEditor } from '../../pom/addons/PageBuilder/PageEditor';
import addContext from 'mochawesome/addContext';
import { DynamicTester } from '../../pom/addons/Blocks/PageTester/index';
import { TestConfiguration } from '../../../models/pages/parameter-config.class';
import { PageTestRequirements } from './page_builder.test';
import { PageBlockExt } from '../../../models/pages/page-block.ext';
import { PageFactory } from '../../../models/page.factory';
import { stringParam } from './PreConfigBlockParams/string_param.const';
import { filterParam } from './PreConfigBlockParams/filter_param.const';
import { SectionBlockFactory } from '../../../services/pages/section-block.factory';
import { SectionBlock } from '../../pom/addons/Blocks/SectionBlock';
import { ConfigurablePageTesterBlock } from '../../pom/addons/Blocks/PageTester/base/index';

chai.use(promised);
enum TestBlockId {
    StringProducer = 'stringProduceFilterConsume',
    FilterProducer = 'filterProduceStringConsume',
    InitConsumer = 'filterConsumeStringConsume'
};

export function AdvSetParamTests(pagesService: PagesService, pagesReq: PageTestRequirements) {
    let browser: Browser;
    let pagesList: PagesList;
    const testPage: PageClass = new PageClass();
    testPage.Key = newUuid();
    testPage.Name = `Advanced SetParams Tests - ${testPage.Key}`;
    let pageEditor: PageEditor;

    before(async function () {
        const dynamicBlockRelation = await pagesService.getBlockRelation('Dynamic Tester');

        const stringProducer = getStringProducerBlock(dynamicBlockRelation);
        const filterProducer = getFilterProducerBlock(dynamicBlockRelation);
        const initConsumer = getInitBlock(await pagesService.getBlockRelation('Init Tester'));

        await apiCreatePage(stringProducer, filterProducer, initConsumer);
        browser = pagesReq.browser;
        pagesList = pagesReq.pagesList;

        try {
            if (testPage?.Name) {
                await browser.refresh();
                pageEditor = await pagesList.searchAndEditPage(testPage.Name);
            } else {
                throw new Error(`Page does not have a name. Page Key: ${testPage.Key}`);
            }
            const createBlock = new SectionBlockFactory(browser);
            for (const block of testPage.Blocks) {
                pageEditor.PageBlocks.setBlock(createBlock.fromPageBlock(block));
                const tempBlock = pageEditor.PageBlocks.getBlock(block);
                if(isConfigurablePageTester(tempBlock)){
                    await tempBlock.initBlockConfig();
                }
            }
            await pageEditor.enterPreviewMode();
        } catch (error) {
            const beforeError = await browser.saveScreenshots();
            await addContext(this, {
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

        const result = await pagesService.deletePage(testPage);
        expect(result?.Hidden).is.equal(true);
    });

    afterEach(async function () {
        await pageEditor.collectEndTestData(this);
    });

    it('Produce String Param', async function () {
        const stringProducerBlock = pageEditor.PageBlocks.getBlock<DynamicTester>(
            TestBlockId.StringProducer,
        );
        await stringProducerBlock.clickSetParamBtn(stringParam.Key);
        expect(await stringProducerBlock.getConsumesText()).to.not.include(stringParam.Value);
        expect(await pageEditor.PageBlocks.getBlock<DynamicTester>(
                TestBlockId.FilterProducer,
            ).getConsumesText(),
        ).to.include(stringParam.Value);
    });

    it('Produce Filter Param', async function () {
        const filterProducerBlock = pageEditor.PageBlocks.getBlock<DynamicTester>(
            TestBlockId.FilterProducer,
        );
        await filterProducerBlock.clickSetParamBtn(filterParam.Key);
        

        const stringProducerText = await pageEditor.PageBlocks.getBlock<DynamicTester>(
            TestBlockId.StringProducer,
        ).getConsumesText();
        expect(stringProducerText).to.include(JSON.stringify(filterParam?.Value[0]?.filter));

        const filterProducerText = await pageEditor.PageBlocks.getBlock<DynamicTester>(
            TestBlockId.FilterProducer,
        ).getConsumesText();
        expect(filterProducerText).to.not.include(JSON.stringify(filterParam?.Value[0]?.filter));
    });

    async function apiCreatePage(...pageBlocks: PageBlock[]): Promise<PageClass> {
        for (const pageBlock of pageBlocks) {
            testPage.Blocks.add(pageBlock);
            const section = new PageSectionClass(newUuid());
            section.addBlock(pageBlock.Key);
            testPage.Layout.Sections.add(section);
        }

        const pageResult: Page = await pagesService.createOrUpdatePage(testPage).catch((error) => {
            console.log((error as Error).message);
            throw error;
        });
        pagesService.deepCompareObjects(testPage, pageResult, expect);
        return testPage;
    }
}

function getStringProducerBlock(blockRelation: NgComponentRelation): PageBlockExt {
    const pageBlock = PageFactory.defaultPageBlock(blockRelation);
    const testConfig: TestConfiguration = {
        Parameters: [
            {
                Key: stringParam.Key,
                Consume: false,
                Produce: true,
                Type: stringParam.Type,
                Value: stringParam.Value,
            },
            {
                Key: filterParam.Key,
                Consume: true,
                Produce: false,
                Type: filterParam.Type,
                Value: filterParam.Value,
                Resource: filterParam.Resource,
                Fields: filterParam.Fields,
            },
        ],
        BlockId: TestBlockId.StringProducer,
    };
    pageBlock.Configuration.Data = testConfig;

    return pageBlock;
}

function getInitBlock(blockRelation: NgComponentRelation): PageBlockExt {
    const pageBlock = PageFactory.defaultPageBlock(blockRelation);
    const testConfig: TestConfiguration = {
        Parameters: [
            {
                Key: stringParam.Key,
                Consume: true,
                Produce: false,
                Type: stringParam.Type,
                Value: stringParam.Value,
            },
            {
                Key: filterParam.Key,
                Consume: true,
                Produce: false,
                Type: filterParam.Type,
                Value: filterParam.Value,
                Resource: filterParam.Resource,
                Fields: filterParam.Fields,
            },
        ],
        BlockId: TestBlockId.InitConsumer,
    };
    pageBlock.Configuration.Data = testConfig;

    return pageBlock;
}

function getFilterProducerBlock(blockRelation: NgComponentRelation): PageBlockExt {
    const pageBlock = PageFactory.defaultPageBlock(blockRelation);

    const testConfig: TestConfiguration = {
        Parameters: [
            {
                Key: stringParam.Key,
                Consume: true,
                Produce: false,
                Type: stringParam.Type,
                Value: stringParam.Value,
            },
            {
                Key: filterParam.Key,
                Consume: false,
                Produce: true,
                Type: filterParam.Type,
                Value: filterParam.Value,
                Resource: filterParam.Resource,
                Fields: filterParam.Fields,
            },
        ],
        BlockId: TestBlockId.FilterProducer,
    };

    pageBlock.Configuration.Data = testConfig;

    return pageBlock;
}

function isConfigurablePageTester(sectionBlock: SectionBlock): sectionBlock is ConfigurablePageTesterBlock{
    return (sectionBlock as ConfigurablePageTesterBlock).initBlockConfig !== undefined;
}