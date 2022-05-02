import { PageBlock } from '@pepperi-addons/papi-sdk';
import { ChartData, TestConfiguration } from './parameter-config.class';

export interface PageBlockExt extends PageBlock {
    Configuration: { Resource: string; AddonUUID: string; Data: TestConfiguration };
}

export interface PageBlockChart extends PageBlock {
    Configuration: { Resource: string; AddonUUID: string; Data: ChartData };
}