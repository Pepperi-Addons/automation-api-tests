import { Page, PageBlock, PageLayout } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions, FilterAttributes } from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';

export async function AccountsTests(generalService: GeneralService, tester: TesterFunctions) {
    const service = new ObjectsService(generalService);
    const PepperiOwnerID = generalService.papiClient['options'].addonUUID;
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    let page : Page = await service.papiClient.pages.find({page_size: 1})[0];
    let pageBlocks = page.Blocks;
    let pageLayout = page.Layout;
    console.log(pageBlocks);
    console.log(pageLayout);
    console.log(page);
    
}