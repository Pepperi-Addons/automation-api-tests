import { PageBlock } from '@pepperi-addons/papi-sdk';
import { PageTesterConfig } from '../index';

export interface PageTesterPageBlock extends PageBlock {
    Configuration: { Resource: string; AddonUUID: string; Data: PageTesterConfig };
}
