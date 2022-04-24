import { PageBlock } from '@pepperi-addons/papi-sdk';
import { PageTesterBlockName } from '../../ui-tests/pom/addons/Blocks/PageTester/PageTesterBlockName.enum';
import { DynamicTester } from '../../ui-tests/pom/addons/Blocks/PageTester/DynamicTester.block';
import { StaticTester } from '../../ui-tests/pom/addons/Blocks/PageTester/StaticTester.block';
import { Browser } from '../../ui-tests/utilities/browser';
import { ChartTester } from '../../ui-tests/pom/addons/Blocks/PageTester/ChartTester.block';

export class SectionBlockFactory {
    /**
     *
     */
    constructor(private browser: Browser) { }

    public fromPageBlock(pageBlock: PageBlock) {
        switch (pageBlock.Relation.Name) {
            case PageTesterBlockName.DynamicTester:
                return new DynamicTester(pageBlock.Configuration.Data.BlockId, this.browser);
            case PageTesterBlockName.StaticTester:
                return new StaticTester(pageBlock.Configuration.Data.BlockId, this.browser);
            case PageTesterBlockName.ChartsTester:
                return new ChartTester("", this.browser);
            default:
                throw new Error(`Unsupported SectionBlock name - '${pageBlock.Relation.Name}'`);
        }
    }
}
