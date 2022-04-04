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
import { PageEditor } from '../../pom/addons/PageBuilder/PageEditor';
import addContext from 'mochawesome/addContext';
import { DynamicTester } from '../../pom/addons/Blocks/DynamicTester';
import {
    BlockParamConfig,
    IBlockFilterParameter,
    IBlockStringParameter,
    TestConfiguration,
} from '../../../models/pages/parameter-config.class';
import { PageTestRequirements } from './page_builder.test';

chai.use(promised);
const stringParam: IBlockStringParameter = {
    Key: 'stringParam',
    Consume: true,
    Produce: true,
    Type: 'String',
    Value: 'This is a string param',
};
const filterParam: IBlockFilterParameter = {
    Key: 'filterParam',
    Consume: true,
    Produce: true,
    Type: 'Filter',
    Resource: 'accounts',
    Fields: ['paramAccount'],
    Value: [
        {
            resource: 'accounts',
            filter: {
                ApiName: 'paramAccount',
                FieldType: 'boolean',
                Operation: 'IsEqual',
                Values: ['true'],
            },
        },
    ],
};
export function ProduceConsumeTests(
    pagesService: PagesService,
    pagesReq: PageTestRequirements
) {
    let browser: Browser;
    let pagesList: PagesList;
    // describe('Dynamic Block Tests', function () {
        const prodConsPage: PageClass = new PageClass();
        prodConsPage.Key = newUuid();
        prodConsPage.Name = `Produce Consume Tests - ${prodConsPage.Key}`;
        let pageEditor: PageEditor;
        let dynamicTester: DynamicTester;

        // const stringParam: IBlockStringParameter = stringParam;

        // const filterParam: IBlockFilterParameter = filterParam;
        before(async function () {
            
            await apiCreateProduceConsumePage();

            browser = pagesReq.browser;
            pagesList = pagesReq.pagesList;
            
            try {
                if (prodConsPage?.Name) {
                    await browser.refresh();
                    pageEditor = await pagesList.editPage(prodConsPage.Name);
                } else {
                    throw new Error(`Page does not have a name. Page Key: ${prodConsPage.Key}`);
                }
                dynamicTester = new DynamicTester(browser);
                await dynamicTester.editBlock();
                
                await pageEditor.goBack();
                await pageEditor.enterPreviewMode();
                
            } catch (error) {
                const beforeError = browser.saveScreenshots();
                addContext(this, {
                    title: `Image Before`,
                    value: 'data:image/png;base64,' + beforeError,
                });
                throw error;
            }
        });

        after(async function () {
            debugger;
            const result = await pagesService.deletePage(prodConsPage);
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

    async function apiCreateProduceConsumePage() {
        const dynamicBlockRelation = await pagesService.getBlockRelation('Dynamic Tester');
        const dynamicTesterBlock: PageBlock = prodConsPage.Blocks.createAndAdd(dynamicBlockRelation);
        const config: BlockParamConfig = new BlockParamConfig(stringParam, filterParam);
        const testConfig: TestConfiguration = {
            Parameters: config,
            BlockId: 'basicDynamicBlock'
        };
        // config.push(stringParam, filterParam);
        dynamicTesterBlock.Configuration.Data = testConfig;

        const section = new PageSectionClass(newUuid());

        section.addBlock(dynamicTesterBlock.Key);

        prodConsPage.Layout.Sections.add(section);

        const pageResult: Page = await pagesService.createOrUpdatePage(prodConsPage);

        pagesService.deepCompareObjects(prodConsPage, pageResult, expect);
    }
    // });
}
