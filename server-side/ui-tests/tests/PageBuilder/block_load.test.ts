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
import { TestConfiguration } from '../../../models/pages/parameter-config.class';
import { PageTestRequirements } from './page_builder.test';
import { PageBlockExt } from '../../../models/pages/page-block.ext';
import { PageFactory } from '../../../models/page.factory';
import { stringParam } from './PreConfigBlockParams/string_param.const';
import { SectionBlockFactory } from '../../../services/pages/section-block.factory';
import { SectionBlock } from '../../pom/addons/Blocks/SectionBlock';
import { ConfigurablePageTesterBlock } from '../../pom/addons/Blocks/PageTester/base/index';
import { InitTester } from '../../pom/addons/Blocks/PageTester/index';

chai.use(promised);
enum TestBlockId {
    Consumer = 'consumerBlock',
    Producer = 'producerBlock',
    ConsumerProducer = 'consumerProducerBlock',
    Static = 'staticBlock'
};
//Loading block order: Producer blocks, Consumer blocks, non-producer and non-consumer blocks.
enum BlockType {
    Producer = 0,
    Consumer = 1,
    Static = 2
}

export function BlockLoadTests(pagesService: PagesService, pagesReq: PageTestRequirements) {
    let browser: Browser;
    let pagesList: PagesList;
    const testPage: PageClass = new PageClass();
    testPage.Key = newUuid();
    testPage.Name = `Load Order Tests - ${testPage.Key}`;
    let pageEditor: PageEditor;

    before(async function () {
        const initBlockRelation = await pagesService.getBlockRelation('Init Tester');

        const producerBlock = getProducerBlock(initBlockRelation);
        const consumerBlock = getConsumerBlock(initBlockRelation);
        const consumerProducerBlock = getConsumerProducerBlock(initBlockRelation);
        const staticBlock = getStaticBlock(initBlockRelation);
        await apiCreatePage(staticBlock, producerBlock, consumerBlock, consumerProducerBlock);
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
            await (await pageEditor.publishPage()).selectDialogBoxByText('Close');
            await browser.refresh();
            // debugger;
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

    //TODO: Check what's supposed to be the complete order of the blocks and test them all.
    it('Basic Load Order Test', async function () {
        const loadTimes: Map<string,number> = new Map<string,number>();
        for(const blockName of Object.values(TestBlockId)){
            const block = pageEditor.PageBlocks.getBlock<InitTester>(blockName);
            const timeString = await block.getBlockLoadingTime();
            expect(timeString, `Load time of ${blockName} is null`).to.not.be.null;
            loadTimes.set(blockName, parseFloat(timeString as string))
        }

        for(const loadTimeMap of loadTimes){
            const testedBlockType = getBlockType(testPage?.Blocks?.find( pageBlock => pageBlock?.Configuration?.Data?.BlockId == loadTimeMap[0]));
            if(testedBlockType == BlockType.Static){
                expect(loadTimeMap[1]).to.be.greaterThan(0);
            }
            else{
                pageEditor.PageBlocks.forEach(function(_pageBlock){
                    if(_pageBlock.BlockId != loadTimeMap[0]){
                        const pageBlock = testPage?.Blocks?.find( pageBlock => pageBlock?.Configuration?.Data?.BlockId == _pageBlock.BlockId);
                        const comparedBlockType = getBlockType(pageBlock);
                        // debugger;
                        if(comparedBlockType != BlockType.Static){
                            switch(true){
                                case testedBlockType < comparedBlockType:
                                    expect(loadTimeMap[1]).to.be.lessThan(loadTimes.get(_pageBlock.BlockId) as number, `'${loadTimeMap[0]}' was loaded after '${_pageBlock.BlockId}'`);
                                    break;
                                case testedBlockType == comparedBlockType:
                                    expect(loadTimeMap[1]).to.be.greaterThan(0);
                                    break;
                                case testedBlockType > comparedBlockType:
                                    expect(loadTimeMap[1]).to.be.greaterThan(loadTimes.get(_pageBlock.BlockId) as number, `'${loadTimeMap[0]}' was loaded before '${_pageBlock.BlockId}'`);
                                    break;
                            }
                        }
                    }
                });
            }
            
        }
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

function getProducerBlock(blockRelation: NgComponentRelation): PageBlockExt {
    const pageBlock = PageFactory.defaultPageBlock(blockRelation);
    const testConfig: TestConfiguration = {
        Parameters: [
            {
                Key: stringParam.Key,
                Consume: false,
                Produce: true,
                Type: stringParam.Type,
                Value: `This is ${TestBlockId.Producer}`,
            }
        ],
        BlockId: TestBlockId.Producer,
    };
    pageBlock.Configuration.Data = testConfig;

    return pageBlock;
}

function getConsumerProducerBlock(blockRelation: NgComponentRelation): PageBlockExt {
    const pageBlock = PageFactory.defaultPageBlock(blockRelation);
    const testConfig: TestConfiguration = {
        Parameters: [
            {
                Key: stringParam.Key,
                Consume: true,
                Produce: true,
                Type: stringParam.Type,
                Value: `This is ${TestBlockId.ConsumerProducer}`,
            }
        ],
        BlockId: TestBlockId.ConsumerProducer,
    };
    pageBlock.Configuration.Data = testConfig;

    return pageBlock;
}

function getConsumerBlock(blockRelation: NgComponentRelation): PageBlockExt {
    const pageBlock = PageFactory.defaultPageBlock(blockRelation);

    const testConfig: TestConfiguration = {
        Parameters: [
            {
                Key: stringParam.Key,
                Consume: true,
                Produce: false,
                Type: stringParam.Type,
                Value:  `This is ${TestBlockId.Consumer}`,
            }
        ],
        BlockId: TestBlockId.Consumer,
    };

    pageBlock.Configuration.Data = testConfig;

    return pageBlock;
}

function getStaticBlock(blockRelation: NgComponentRelation): PageBlockExt {
    const pageBlock = PageFactory.defaultPageBlock(blockRelation);

    const testConfig: TestConfiguration = {
        Parameters: [],
        BlockId: TestBlockId.Static,
    };

    pageBlock.Configuration.Data = testConfig;

    return pageBlock;
}

function isConfigurablePageTester(sectionBlock: SectionBlock): sectionBlock is ConfigurablePageTesterBlock{
    return (sectionBlock as ConfigurablePageTesterBlock).initBlockConfig !== undefined;
}

function getBlockType(pageBlock: PageBlock | undefined): BlockType{
    if(!pageBlock){
        throw new Error();
    }
    const pageParameters = pageBlock?.Configuration.Data?.Parameters;
    if(pageParameters?.find(pageParameter => pageParameter?.Produce == true)){
        return BlockType.Producer;
    }
    else if(pageParameters?.find(pageParameter => pageParameter?.Consume == true)){
        return BlockType.Consumer;
    }
    else{
        return BlockType.Static;
    }
    // return pageParameters?.find(pageParameter => pageParameter.Produce != true) ? 
    // (pageParameters?.find(pageParameter => pageParameter.Consume == true) ? BlockType.Consumer : BlockType.Static ) :
    // BlockType.Producer;
}