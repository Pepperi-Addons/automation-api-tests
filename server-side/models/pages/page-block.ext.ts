import { PageBlock } from '@pepperi-addons/papi-sdk';
import { TestConfiguration } from './parameter-config.class';

export interface PageBlockExt extends PageBlock {
    Configuration: { Resource: string; AddonUUID: string; Data: TestConfiguration };
}
