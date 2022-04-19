import { PageBlock } from '@pepperi-addons/papi-sdk';
import { SectionBlockName } from '../../ui-tests/pom/addons/Blocks/BlockNameEnums';
import { DynamicTester } from '../../ui-tests/pom/addons/Blocks/DynamicTester';
import { StaticTester } from '../../ui-tests/pom/addons/Blocks/StaticTester.block';
import { Browser } from '../../ui-tests/utilities/browser';

export class SectionBlockFactory {
    /**
     *
     */
    constructor(private browser: Browser) {}

    public fromPageBlock(pageBlock: PageBlock) {
        switch (pageBlock.Relation.Name) {
            case SectionBlockName.DynamicTester:
                return new DynamicTester(pageBlock.Configuration.Data.BlockId, this.browser);
            case SectionBlockName.StaticTester:
                return new StaticTester(pageBlock.Configuration.Data.BlockId, this.browser);
            default:
                throw new Error(`Unsupported SectionBlock name - '${pageBlock.Relation.Name}'`);
        }
    }
}
