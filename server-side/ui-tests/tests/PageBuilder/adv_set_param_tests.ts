import { Browser } from '../../utilities/browser';
import { it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { PagesService } from '../../../services/pages/pages.service';
import { PageClass } from '../../../models/pages/page.class';
import { v4 as newUuid } from 'uuid';
import { PageSectionClass } from '../../../models/pages/page-section.class';
import { NgComponentRelation, Page } from '@pepperi-addons/papi-sdk';
import { PagesList } from '../../pom/addons/PageBuilder/PagesList';
import { PageEditor } from '../../pom/addons/PageBuilder/PageEditor';
import addContext from 'mochawesome/addContext';
import { DynamicTester } from '../../pom/addons/Blocks/DynamicTester';
import {
    TestConfiguration,
} from '../../../models/pages/parameter-config.class';
import { PageTestRequirements } from './page_builder.test';
import { PageBlockExt } from '../../../models/pages/page-block.ext';
import { PageFactory } from '../../../models/page.factory';
import { stringParam } from './PreConfigBlockParams/string_param.const';
import { filterParam } from './PreConfigBlockParams/filter_param.const';

chai.use(promised);

export function AdvSetParamTests(pagesService: PagesService, pagesReq: PageTestRequirements) {
    let browser: Browser;
    let pagesList: PagesList;
    const testPage: PageClass = new PageClass();
    testPage.Key = newUuid();
    testPage.Name = `Advanced SetParams Tests - ${testPage.Key}`;
    let pageEditor: PageEditor;
    let dynamicTester: DynamicTester;

    before(async function () {
        await apiCreatePage();

        browser = pagesReq.browser;
        pagesList = pagesReq.pagesList;

        try {
            if (testPage?.Name) {
                await browser.refresh();
                pageEditor = await pagesList.searchAndEditPage(testPage.Name);
            } else {
                throw new Error(`Page does not have a name. Page Key: ${testPage.Key}`);
            }
            dynamicTester = new DynamicTester(testPage.Blocks[0].Configuration.Data.BlockId, browser);

            await dynamicTester.editBlock();

            await pageEditor.goBack();
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
        const result = await pagesService.deletePage(testPage);
        expect(result?.Hidden).is.equal(true);
        await pageEditor.enterEditMode();
        await pageEditor.goBack();
        pagesList = new PagesList(browser);
    });

    afterEach(async function () {
        await pageEditor.collectEndTestData(this);
    });

    it('Produce String Param', async function () {
        await dynamicTester.clickSetParamBtn(stringParam.Key);
        expect(await dynamicTester.getConsumesText()).to.include(stringParam.Value);
    });

    it('Produce Filter Param', async function () {
        await dynamicTester.clickSetParamBtn(filterParam.Key);
        const consumeText = await dynamicTester.getConsumesText();

        expect(consumeText).to.include(JSON.stringify(filterParam?.Value[0]?.filter));
    });

    async function apiCreatePage(): Promise<PageClass> {
        const dynamicBlockRelation = await pagesService.getBlockRelation('Dynamic Tester');
        
        const stringProducer = getStringProducerBlock(dynamicBlockRelation);
        const filterProducer = getFilterProducerBlock(dynamicBlockRelation);

        testPage.Blocks.add(stringProducer, filterProducer);

        const section = new PageSectionClass(newUuid(), "1/2 1/2");

        section.addBlock(stringProducer.Key, 0);
        section.addBlock(filterProducer.Key, 1);
        testPage.Layout.Sections.add(section);

        const pageResult: Page = await pagesService.createOrUpdatePage(testPage).catch((error) => {
            console.log((error as Error).message);
            throw error;
        });
        pagesService.deepCompareObjects(testPage, pageResult, expect);
        return testPage;
    }
}

function getStringProducerBlock(blockRelation: NgComponentRelation): PageBlockExt{
    const pageBlock = PageFactory.defaultPageBlock(blockRelation);
    const testConfig: TestConfiguration = {
        Parameters: [{
            Key: stringParam.Key,
            Consume: false,
            Produce: true,
            Type: stringParam.Type,
            Value: stringParam.Value,
            }, {
                Key: filterParam.Key,
                Consume: true,
                Produce: false,
                Type: filterParam.Type,
                Value: [],
                Resource: filterParam.Resource,
                Fields: filterParam.Fields
            }],
        BlockId: 'stringProduceFilterConsume',
    };
    pageBlock.Configuration.Data = testConfig;

    return pageBlock;
}

function getFilterProducerBlock(blockRelation: NgComponentRelation): PageBlockExt{
    const pageBlock = PageFactory.defaultPageBlock(blockRelation);

    const testConfig: TestConfiguration = {
        Parameters: [{
            Key: stringParam.Key,
            Consume: true,
            Produce: false,
            Type: stringParam.Type,
            Value: stringParam.Value,
            }, {
                Key: filterParam.Key,
                Consume: false,
                Produce: true,
                Type: filterParam.Type,
                Value: filterParam.Value,
                Resource: filterParam.Resource,
                Fields: filterParam.Fields
            }],
        BlockId: 'filterProduceStringConsume',
    };

    pageBlock.Configuration.Data = testConfig;

    return pageBlock;
}